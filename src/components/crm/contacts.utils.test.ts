import { describe, it, expect } from 'vitest';
import {
  filterContacts,
  validateContactDraft,
  materializeContact,
  addContact,
  editContact,
  deleteContact,
  DEFAULT_GRADIENT,
  type Contact,
  type ContactDraft,
} from './contacts.utils';

const CONTACTS: Contact[] = [
  { id: 1, nm: '王俊傑', co: 'tsmc', email: 'jj.wang@tsmc.com' } as Contact,
  { id: 2, nm: '陳冠宇', co: 'fox', email: 'gy.chen@foxconn.com' } as Contact,
  { id: 3, nm: '林佳蓉', co: 'mtk', email: 'jr.lin@mediatek.com' } as Contact,
];

function draft(over: Partial<ContactDraft> = {}): ContactDraft {
  return {
    nm: '測試人',
    title: '經理',
    role: '技術窗口',
    co: 'tsmc',
    owner: 'zhang',
    email: 'test@example.com',
    phone: '02-1234',
    mobile: '0900-000-000',
    pri: false,
    ...over,
  };
}

describe('filterContacts', () => {
  it('依姓名過濾', () => {
    expect(filterContacts(CONTACTS, '佳蓉').map((c) => c.id)).toEqual([3]);
  });

  it('依公司名稱過濾（經 CO 對照）', () => {
    expect(filterContacts(CONTACTS, '鴻海').map((c) => c.id)).toEqual([2]);
  });

  it('依 Email 過濾、不分大小寫', () => {
    expect(filterContacts(CONTACTS, 'TSMC').map((c) => c.id)).toEqual([1]);
  });

  it('空字串回傳全部、無相符回傳空、不改原陣列', () => {
    expect(filterContacts(CONTACTS, '')).toHaveLength(3);
    expect(filterContacts(CONTACTS, '   ')).toHaveLength(3);
    expect(filterContacts(CONTACTS, '不存在')).toEqual([]);
    const copy = [...CONTACTS];
    filterContacts(CONTACTS, '王');
    expect(CONTACTS).toEqual(copy);
  });
});

describe('validateContactDraft', () => {
  it('姓名空白回報 nameError 且 ok 為 false', () => {
    const v = validateContactDraft(draft({ nm: '  ' }));
    expect(v.ok).toBe(false);
    expect(v.nameError).toBeTruthy();
  });

  it('姓名有填則 ok 為 true 且無錯誤', () => {
    const v = validateContactDraft(draft());
    expect(v.ok).toBe(true);
    expect(v.nameError).toBeUndefined();
  });
});

describe('materializeContact', () => {
  it('新增：推導 av 首字、預設漸層、初始衍生值', () => {
    const c = materializeContact(draft({ nm: '黃信宏' }), 99);
    expect(c.id).toBe(99);
    expect(c.av).toBe('黃');
    expect(c.g).toBe(DEFAULT_GRADIENT);
    expect(c.last).toBe('—');
    expect(c.ago).toBe('—');
    expect(c.opps).toEqual([]);
    expect(c.acts).toEqual([]);
  });

  it('新增：草稿欄位直接帶入', () => {
    const c = materializeContact(draft({ pri: true, role: '決策者', co: 'mtk' }), 5);
    expect(c.pri).toBe(true);
    expect(c.role).toBe('決策者');
    expect(c.co).toBe('mtk');
  });

  it('編輯：沿用 existing 的 g/last/ago/opps/acts 與原 id', () => {
    const existing: Contact = {
      id: 7,
      g: 'linear-gradient(135deg,#000,#111)',
      last: '電話會議',
      ago: '2 小時前',
      opps: [{ nm: 'O', stage: 'won', stageL: '已成交', amt: '' }],
      acts: [{ t: 'call', ti: 'x', d: 'y', m: 'z' }],
    } as Contact;
    const c = materializeContact(draft({ id: 7, nm: '王俊傑改' }), 99, existing);
    expect(c.id).toBe(7);
    expect(c.g).toBe(existing.g);
    expect(c.last).toBe('電話會議');
    expect(c.ago).toBe('2 小時前');
    expect(c.opps).toBe(existing.opps);
    expect(c.acts).toBe(existing.acts);
    expect(c.nm).toBe('王俊傑改');
    expect(c.av).toBe('王');
  });
});

describe('addContact', () => {
  it('回傳新陣列（不可變）且長度 +1', () => {
    const next = addContact(CONTACTS, draft({ nm: '新人' }), 100);
    expect(next).not.toBe(CONTACTS);
    expect(next).toHaveLength(CONTACTS.length + 1);
    expect(next[next.length - 1].nm).toBe('新人');
    expect(next[next.length - 1].id).toBe(100);
  });
});

describe('editContact', () => {
  const data: Contact[] = [
    { id: 1, nm: '舊名', last: 'L', ago: 'A', opps: [], acts: [] } as unknown as Contact,
    { id: 2, nm: '不動' } as Contact,
  ];

  it('回傳新陣列，只更新目標筆並沿用未呈現欄位', () => {
    const next = editContact(data, draft({ id: 1, nm: '新名' }));
    expect(next).not.toBe(data);
    const edited = next.find((c) => c.id === 1)!;
    expect(edited.nm).toBe('新名');
    expect(edited.last).toBe('L');
    expect(next.find((c) => c.id === 2)!.nm).toBe('不動');
  });
});

describe('deleteContact', () => {
  it('回傳新陣列且移除目標筆', () => {
    const next = deleteContact(CONTACTS, 2);
    expect(next).not.toBe(CONTACTS);
    expect(next).toHaveLength(CONTACTS.length - 1);
    expect(next.find((c) => c.id === 2)).toBeUndefined();
  });
});
