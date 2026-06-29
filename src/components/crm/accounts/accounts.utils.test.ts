import { describe, it, expect } from 'vitest';
import {
  filterAccounts,
  validateAccountDraft,
  materializeAccount,
  addAccount,
  editAccount,
  deleteAccount,
  DEFAULT_GRADIENT,
  type Account,
  type AccountDraft,
} from './accounts.utils';

const ACCOUNTS: Account[] = [
  { id: 1, name: '台積電', domain: 'tsmc.com' } as Account,
  { id: 2, name: '鴻海精密', domain: 'foxconn.com' } as Account,
  { id: 3, name: '聯發科技', domain: 'mediatek.com' } as Account,
  { id: 4, name: 'ACME Corp', domain: 'acme.com' } as Account,
];

function draft(over: Partial<AccountDraft> = {}): AccountDraft {
  return {
    name: '測試公司',
    domain: 'test.com',
    ind: '半導體',
    size: '5,000+ 人',
    owner: 'zhang',
    health: 'good',
    stat: '12345678',
    web: 'test.com',
    phone: '02-12345678',
    addr: '台北市測試路 1 號',
    region: '台北',
    since: '2025 年 01 月',
    ...over,
  };
}

describe('filterAccounts', () => {
  it('依名稱過濾，只回傳名稱相符的帳號', () => {
    const result = filterAccounts(ACCOUNTS, '台積');
    expect(result.map((a) => a.id)).toEqual([1]);
  });

  it('依網域過濾，只回傳網域相符的帳號', () => {
    const result = filterAccounts(ACCOUNTS, 'foxconn');
    expect(result.map((a) => a.id)).toEqual([2]);
  });

  it('比對不分大小寫', () => {
    const result = filterAccounts(ACCOUNTS, 'acme');
    expect(result.map((a) => a.id)).toEqual([4]);
  });

  it('採子字串部分相符', () => {
    const result = filterAccounts(ACCOUNTS, 'tek');
    expect(result.map((a) => a.id)).toEqual([3]);
  });

  it('空字串回傳全部', () => {
    expect(filterAccounts(ACCOUNTS, '')).toHaveLength(ACCOUNTS.length);
  });

  it('全空白字串回傳全部', () => {
    expect(filterAccounts(ACCOUNTS, '   ')).toHaveLength(ACCOUNTS.length);
  });

  it('無相符回傳空陣列', () => {
    expect(filterAccounts(ACCOUNTS, '不存在的關鍵字')).toEqual([]);
  });

  it('不修改原始陣列', () => {
    const copy = [...ACCOUNTS];
    filterAccounts(ACCOUNTS, '台積');
    expect(ACCOUNTS).toEqual(copy);
  });
});

describe('validateAccountDraft', () => {
  it('名稱空白回報 nameError 且 ok 為 false', () => {
    const v = validateAccountDraft(draft({ name: '  ' }));
    expect(v.ok).toBe(false);
    expect(v.nameError).toBeTruthy();
  });

  it('名稱有填則 ok 為 true 且無錯誤', () => {
    const v = validateAccountDraft(draft());
    expect(v.ok).toBe(true);
    expect(v.nameError).toBeUndefined();
  });
});

describe('materializeAccount', () => {
  it('新增：推導 logo 首字、預設漸層與初始衍生值', () => {
    const a = materializeAccount(draft({ name: '宏碁電腦' }), 99);
    expect(a.id).toBe(99);
    expect(a.logo).toBe('宏');
    expect(a.lg).toBe(DEFAULT_GRADIENT);
    expect(a.star).toBe(false);
    expect(a.amt).toBe('NT$ 0');
    expect(a.oppN).toBe(0);
    expect(a.contacts).toEqual([]);
    expect(a.opps).toEqual([]);
    expect(a.acts).toEqual([]);
    expect(a.age).toBe('—');
  });

  it('新增：把扁平草稿欄位收進 info 物件', () => {
    const a = materializeAccount(draft({ stat: '87654321', region: '新竹' }), 5);
    expect(a.info.stat).toBe('87654321');
    expect(a.info.region).toBe('新竹');
  });

  it('編輯：沿用 existing 的 star/amt/oppN/contacts/opps/acts/age 與原 id', () => {
    const existing: Account = {
      id: 7,
      star: true,
      amt: 'NT$ 4.2M',
      oppN: 3,
      age: '2.4 年',
      contacts: [{ nm: '王', title: '經理', g: '', av: '王' }],
      opps: [{ nm: 'O', stage: 'won', stageL: '已成交', close: '', amt: '' }],
      acts: [{ t: 'call', ti: 'x', d: 'y', m: 'z' }],
    } as Account;
    const a = materializeAccount(draft({ id: 7, name: '台積電改' }), 99, existing);
    expect(a.id).toBe(7);
    expect(a.star).toBe(true);
    expect(a.amt).toBe('NT$ 4.2M');
    expect(a.oppN).toBe(3);
    expect(a.age).toBe('2.4 年');
    expect(a.contacts).toBe(existing.contacts);
    expect(a.opps).toBe(existing.opps);
    expect(a.acts).toBe(existing.acts);
    // 名稱仍可更新，logo 隨之重算
    expect(a.name).toBe('台積電改');
    expect(a.logo).toBe('台');
  });
});

describe('addAccount', () => {
  it('回傳新陣列（不可變）且長度 +1', () => {
    const next = addAccount(ACCOUNTS, draft({ name: '新帳號' }), 100);
    expect(next).not.toBe(ACCOUNTS);
    expect(next).toHaveLength(ACCOUNTS.length + 1);
    expect(next[next.length - 1].name).toBe('新帳號');
    expect(next[next.length - 1].id).toBe(100);
  });
});

describe('editAccount', () => {
  const data: Account[] = [
    { id: 1, name: '舊名', star: true, amt: 'NT$ 1M', oppN: 2, age: '1 年', contacts: [], opps: [], acts: [] } as unknown as Account,
    { id: 2, name: '不動' } as Account,
  ];

  it('回傳新陣列，只更新目標筆並沿用未呈現欄位', () => {
    const next = editAccount(data, draft({ id: 1, name: '新名' }));
    expect(next).not.toBe(data);
    const edited = next.find((a) => a.id === 1)!;
    expect(edited.name).toBe('新名');
    expect(edited.star).toBe(true);
    expect(edited.amt).toBe('NT$ 1M');
    expect(edited.oppN).toBe(2);
    expect(next.find((a) => a.id === 2)!.name).toBe('不動');
  });
});

describe('deleteAccount', () => {
  it('回傳新陣列且移除目標筆', () => {
    const next = deleteAccount(ACCOUNTS, 2);
    expect(next).not.toBe(ACCOUNTS);
    expect(next).toHaveLength(ACCOUNTS.length - 1);
    expect(next.find((a) => a.id === 2)).toBeUndefined();
  });
});
