import { OWNERS, type OwnerId } from '../common/owners';

// 由 owners.ts 集中維護，re-export 以維持既有匯入點。
export { OWNERS, type OwnerId };

// ─── Types ──────────────────────────────────────────────────────────────────
export type CoId = 'tsmc' | 'fox' | 'mtk' | 'wis' | 'delta' | 'asus';
export type ActType = 'call' | 'mail' | 'meet' | 'note';

export interface OppLink {
  nm: string;
  stage: string;
  stageL: string;
  amt: string;
}
export interface Activity {
  t: ActType;
  ti: string;
  d: string;
  m: string;
}
export interface Contact {
  id: number;
  av: string;
  g: string;
  nm: string;
  title: string;
  role: string;
  co: CoId;
  pri: boolean;
  owner: OwnerId;
  email: string;
  phone: string;
  mobile: string;
  last: string;
  ago: string;
  opps: OppLink[];
  acts: Activity[];
}

/** 使用者在新增／編輯表單抽屜實際填寫的欄位。顯示用衍生欄位不在內。 */
export interface ContactDraft {
  id?: number;
  nm: string;
  title: string;
  role: string;
  co: CoId;
  owner: OwnerId;
  email: string;
  phone: string;
  mobile: string;
  pri: boolean;
}

export interface ContactValidation {
  ok: boolean;
  nameError?: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────
/** 固定公司對照（名稱／標誌／漸層／產業）。 */
export const CO: Record<CoId, { nm: string; logo: string; g: string; ind: string }> = {
  tsmc: { nm: '台積電', logo: '台', g: 'linear-gradient(135deg,#2563eb,#1e3a5f)', ind: '半導體' },
  fox: {
    nm: '鴻海精密',
    logo: '鴻',
    g: 'linear-gradient(135deg,#1e3a5f,#122440)',
    ind: '電子製造',
  },
  mtk: { nm: '聯發科技', logo: '聯', g: 'linear-gradient(135deg,#7c3aed,#5b21b6)', ind: 'IC 設計' },
  wis: {
    nm: '緯創資通',
    logo: '緯',
    g: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
    ind: '電子製造',
  },
  delta: {
    nm: '台達電子',
    logo: '台',
    g: 'linear-gradient(135deg,#dc2626,#991b1b)',
    ind: '電源管理',
  },
  asus: {
    nm: '華碩電腦',
    logo: '華',
    g: 'linear-gradient(135deg,#0891b2,#0e7490)',
    ind: '消費電子',
  },
};

/** 角色（職務）可選清單。 */
export const ROLE_OPTIONS = ['決策者', '採購窗口', '技術窗口', '使用者'];

/** 新增聯絡人的固定預設頭像漸層（既有聯絡人各自的漸層為靜態資料）。 */
export const DEFAULT_GRADIENT = 'linear-gradient(135deg,#64748b,#475569)';

// ─── Search / Filter ──────────────────────────────────────────────────────────
/** 依姓名、所屬公司名稱與 Email 過濾聯絡人（不分大小寫、子字串）。空白關鍵字回傳全部。 */
export function filterContacts(contacts: Contact[], query: string): Contact[] {
  const q = query.trim().toLowerCase();
  if (q === '') return [...contacts];
  return contacts.filter(
    (c) =>
      c.nm.toLowerCase().includes(q) ||
      CO[c.co].nm.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
  );
}

// ─── Draft → Contact ──────────────────────────────────────────────────────────
/** 草稿必填驗證：姓名不可空白。 */
export function validateContactDraft(draft: ContactDraft): ContactValidation {
  const nameError = draft.nm.trim() === '' ? '請輸入姓名' : undefined;
  return { ok: !nameError, nameError };
}

/**
 * 把草稿補上顯示用衍生欄位，產出完整 Contact。
 * 新增（無 existing）：g=預設漸層、last/ago='—'、opps/acts 為空。
 * 編輯（有 existing）：沿用 existing 的 g/last/ago/opps/acts 與原 id。
 * av 一律取姓名首字。
 */
export function materializeContact(
  draft: ContactDraft,
  newId: number,
  existing?: Contact
): Contact {
  return {
    id: existing?.id ?? draft.id ?? newId,
    av: draft.nm.trim().charAt(0),
    g: existing?.g ?? DEFAULT_GRADIENT,
    nm: draft.nm,
    title: draft.title,
    role: draft.role,
    co: draft.co,
    pri: draft.pri,
    owner: draft.owner,
    email: draft.email,
    phone: draft.phone,
    mobile: draft.mobile,
    last: existing?.last ?? '—',
    ago: existing?.ago ?? '—',
    opps: existing?.opps ?? [],
    acts: existing?.acts ?? [],
  };
}

// ─── Immutable list operations ────────────────────────────────────────────────
/** 新增一筆聯絡人，回傳新陣列。 */
export function addContact(contacts: Contact[], draft: ContactDraft, newId: number): Contact[] {
  return [...contacts, materializeContact(draft, newId)];
}

/** 以草稿更新對應 id 的聯絡人（沿用未呈現欄位），回傳新陣列。 */
export function editContact(contacts: Contact[], draft: ContactDraft): Contact[] {
  return contacts.map((c) => (c.id === draft.id ? materializeContact(draft, c.id, c) : c));
}

/** 移除指定 id 的聯絡人，回傳新陣列。 */
export function deleteContact(contacts: Contact[], id: number): Contact[] {
  return contacts.filter((c) => c.id !== id);
}
