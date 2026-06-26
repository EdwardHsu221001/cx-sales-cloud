// ─── Types ──────────────────────────────────────────────────────────────────
export type HealthKey = 'good' | 'stable' | 'watch' | 'risk';
export type OwnerId = 'zhang' | 'chen' | 'lin';
export type ActType = 'call' | 'mail' | 'meet' | 'note';

export interface Contact {
  nm: string;
  title: string;
  pri?: boolean;
  g: string;
  av: string;
}
export interface OppLink {
  nm: string;
  stage: string;
  stageL: string;
  close: string;
  amt: string;
}
export interface Activity {
  t: ActType;
  ti: string;
  d: string;
  m: string;
}
export interface Account {
  id: number;
  logo: string;
  lg: string;
  name: string;
  star: boolean;
  domain: string;
  ind: string;
  size: string;
  sizeShort: string;
  amt: string;
  oppN: number;
  owner: OwnerId;
  health: HealthKey;
  info: { stat: string; web: string; phone: string; addr: string; region: string; since: string };
  age: string;
  contacts: Contact[];
  opps: OppLink[];
  acts: Activity[];
}

/** 使用者在新增／編輯表單抽屜實際填寫的欄位。顯示用衍生欄位不在內。 */
export interface AccountDraft {
  id?: number;
  name: string;
  domain: string;
  ind: string;
  size: string;
  owner: OwnerId;
  health: HealthKey;
  stat: string;
  web: string;
  phone: string;
  addr: string;
  region: string;
  since: string;
}

export interface AccountValidation {
  ok: boolean;
  nameError?: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────
/** 固定三位負責人對照（與其他物件一致的 OwnerId）。 */
export const OWNERS: Record<OwnerId, { nm: string; av: string; g: string }> = {
  zhang: { nm: '張志豪', av: '張', g: 'linear-gradient(135deg,#60a5fa,#2563eb)' },
  chen: { nm: '陳美華', av: '陳', g: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
  lin: { nm: '林俊傑', av: '林', g: 'linear-gradient(135deg,#fbbf24,#f59e0b)' },
};

export const HEALTH_META: Record<HealthKey, { lbl: string }> = {
  good: { lbl: '良好' },
  stable: { lbl: '穩定' },
  watch: { lbl: '待關注' },
  risk: { lbl: '風險' },
};

/** 新增帳號的固定預設標誌漸層（既有帳號各自的漸層為靜態資料）。 */
export const DEFAULT_GRADIENT = 'linear-gradient(135deg,#64748b,#475569)';

// ─── Search / Filter ──────────────────────────────────────────────────────────
/** 依名稱與網域過濾帳號（不分大小寫、子字串比對）。空白關鍵字回傳全部。 */
export function filterAccounts(accounts: Account[], query: string): Account[] {
  const q = query.trim().toLowerCase();
  if (q === '') return [...accounts];
  return accounts.filter(
    (a) => a.name.toLowerCase().includes(q) || a.domain.toLowerCase().includes(q),
  );
}

// ─── Draft → Account ──────────────────────────────────────────────────────────
/** 草稿必填驗證：名稱不可空白。 */
export function validateAccountDraft(draft: AccountDraft): AccountValidation {
  const nameError = draft.name.trim() === '' ? '請輸入帳號名稱' : undefined;
  return { ok: !nameError, nameError };
}

/** 由規模字串推導表格用短版（去除結尾「人」與空白）。 */
function deriveSizeShort(size: string): string {
  return size.trim().replace(/\s*人\s*$/, '');
}

/**
 * 把草稿補上顯示用衍生欄位，產出完整 Account。
 * 新增（無 existing）：star=false、amt='NT$ 0'、oppN=0、contacts/opps/acts 為空、age='—'。
 * 編輯（有 existing）：沿用 existing 的 star/amt/oppN/contacts/opps/acts/age 與原 id。
 * logo 一律取名稱首字、lg 一律為預設漸層。
 */
export function materializeAccount(
  draft: AccountDraft,
  newId: number,
  existing?: Account,
): Account {
  return {
    id: existing?.id ?? draft.id ?? newId,
    logo: draft.name.trim().charAt(0),
    lg: DEFAULT_GRADIENT,
    name: draft.name,
    star: existing?.star ?? false,
    domain: draft.domain,
    ind: draft.ind,
    size: draft.size,
    sizeShort: deriveSizeShort(draft.size),
    amt: existing?.amt ?? 'NT$ 0',
    oppN: existing?.oppN ?? 0,
    owner: draft.owner,
    health: draft.health,
    info: {
      stat: draft.stat,
      web: draft.web,
      phone: draft.phone,
      addr: draft.addr,
      region: draft.region,
      since: draft.since,
    },
    age: existing?.age ?? '—',
    contacts: existing?.contacts ?? [],
    opps: existing?.opps ?? [],
    acts: existing?.acts ?? [],
  };
}

// ─── Immutable list operations ────────────────────────────────────────────────
/** 新增一筆帳號，回傳新陣列。 */
export function addAccount(accounts: Account[], draft: AccountDraft, newId: number): Account[] {
  return [...accounts, materializeAccount(draft, newId)];
}

/** 以草稿更新對應 id 的帳號（沿用未呈現欄位），回傳新陣列。 */
export function editAccount(accounts: Account[], draft: AccountDraft): Account[] {
  return accounts.map((a) => (a.id === draft.id ? materializeAccount(draft, a.id, a) : a));
}

/** 移除指定 id 的帳號，回傳新陣列。 */
export function deleteAccount(accounts: Account[], id: number): Account[] {
  return accounts.filter((a) => a.id !== id);
}
