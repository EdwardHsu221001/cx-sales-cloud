import { describe, it, expect } from 'vitest';
import {
  splitMergeText,
  filterEmailTemplates,
  emailStats,
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
