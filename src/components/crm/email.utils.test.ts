import { describe, it, expect } from 'vitest';
import {
  splitMergeText,
  filterEmailTemplates,
  emailStats,
  validateTemplateDraft,
  applyTemplateEdit,
  type EmailCategory,
  type EmailTemplate,
} from './email.utils';

const CATS: Record<string, EmailCategory> = {
  sales: { nm: '業務 / 商機', hex: '#3B82F6', v: 'blue' },
  cs: { nm: '客戶成功', hex: '#059669', v: 'green' },
};

const T: EmailTemplate[] = [
  {
    k: 'quote_send',
    name: '報價單寄送',
    cat: 'sales',
    icon: 'send',
    on: true,
    used: '2 天前',
    from: '業務 <{{User.Email}}>',
    to: '{{Contact.Email}}',
    lang: '繁體中文',
    subj: '您的報價單 {{Opportunity.Name}} 已備妥',
    body: [],
  },
  {
    k: 'won_notify',
    name: '贏單恭賀通知',
    cat: 'sales',
    icon: 'trophy',
    on: true,
    used: '1 週前',
    from: 'CX',
    to: '{{Contact.Email}}',
    lang: '繁體中文',
    subj: '歡迎加入',
    body: [],
  },
  {
    k: 'onboarding_welcome',
    name: '導入歡迎信',
    cat: 'cs',
    icon: 'welcome',
    on: false,
    used: '3 天前',
    from: 'CS',
    to: '{{Contact.Email}}',
    lang: '繁體中文',
    subj: '歡迎啟用',
    body: [],
  },
];

describe('splitMergeText', () => {
  it('純文字回傳單一非合併欄位片段', () => {
    expect(splitMergeText('您好')).toEqual([{ text: '您好', isMergeField: false }]);
  });

  it('將 {{Token}} 切為合併欄位片段', () => {
    expect(splitMergeText('{{Contact.FirstName}}')).toEqual([
      { text: '{{Contact.FirstName}}', isMergeField: true },
    ]);
  });

  it('混合字串保留順序', () => {
    expect(splitMergeText('親愛的 {{Contact.FirstName}} 您好')).toEqual([
      { text: '親愛的 ', isMergeField: false },
      { text: '{{Contact.FirstName}}', isMergeField: true },
      { text: ' 您好', isMergeField: false },
    ]);
  });

  it('多個合併欄位皆被標記', () => {
    const parts = splitMergeText('{{A.B}} 與 {{C.D}}');
    expect(parts.filter((p) => p.isMergeField).map((p) => p.text)).toEqual(['{{A.B}}', '{{C.D}}']);
  });
});

describe('filterEmailTemplates', () => {
  it('空查詢回傳全部', () => {
    expect(filterEmailTemplates(T, CATS, '').map((t) => t.k)).toEqual([
      'quote_send',
      'won_notify',
      'onboarding_welcome',
    ]);
  });

  it('依範本名稱過濾', () => {
    expect(filterEmailTemplates(T, CATS, '導入').map((t) => t.k)).toEqual(['onboarding_welcome']);
  });

  it('依主旨過濾', () => {
    expect(filterEmailTemplates(T, CATS, '報價單').map((t) => t.k)).toEqual(['quote_send']);
  });

  it('依分類名稱過濾', () => {
    expect(filterEmailTemplates(T, CATS, '客戶成功').map((t) => t.k)).toEqual([
      'onboarding_welcome',
    ]);
  });

  it('無相符回傳空陣列', () => {
    expect(filterEmailTemplates(T, CATS, '不存在的關鍵字')).toEqual([]);
  });
});

describe('emailStats', () => {
  it('計算總數、啟用中與分類數', () => {
    const s = emailStats(T, CATS);
    expect(s.total).toBe(3);
    expect(s.active).toBe(2);
    expect(s.categories).toBe(2);
  });
});

describe('validateTemplateDraft', () => {
  it('名稱與主旨皆有值時通過', () => {
    expect(validateTemplateDraft(T[0])).toEqual({ ok: true });
  });

  it('名稱空白時失敗並回傳 nameError', () => {
    const r = validateTemplateDraft({ ...T[0], name: '  ' });
    expect(r.ok).toBe(false);
    expect(r.nameError).toBeTruthy();
    expect(r.subjError).toBeUndefined();
  });

  it('主旨空白時失敗並回傳 subjError', () => {
    const r = validateTemplateDraft({ ...T[0], subj: '' });
    expect(r.ok).toBe(false);
    expect(r.subjError).toBeTruthy();
    expect(r.nameError).toBeUndefined();
  });

  it('名稱與主旨皆空白時兩個錯誤都回傳', () => {
    const r = validateTemplateDraft({ ...T[0], name: '', subj: '' });
    expect(r.ok).toBe(false);
    expect(r.nameError).toBeTruthy();
    expect(r.subjError).toBeTruthy();
  });
});

describe('applyTemplateEdit', () => {
  it('依 k 取代對應範本', () => {
    const draft: EmailTemplate = { ...T[1], name: '改過的名稱', on: false };
    const next = applyTemplateEdit(T, draft);
    const updated = next.find((t) => t.k === 'won_notify');
    expect(updated?.name).toBe('改過的名稱');
    expect(updated?.on).toBe(false);
  });

  it('不變動其他列且不變動原陣列', () => {
    const draft: EmailTemplate = { ...T[1], name: '改過的名稱' };
    const next = applyTemplateEdit(T, draft);
    expect(next.find((t) => t.k === 'quote_send')).toBe(T[0]);
    expect(next.find((t) => t.k === 'onboarding_welcome')).toBe(T[2]);
    expect(T[1].name).toBe('贏單恭賀通知');
    expect(next).not.toBe(T);
  });

  it('k 不存在時清單內容不變', () => {
    const draft: EmailTemplate = { ...T[0], k: 'nope' };
    const next = applyTemplateEdit(T, draft);
    expect(next.map((t) => t.k)).toEqual(T.map((t) => t.k));
  });
});
