import { OWNERS, type OwnerId } from '../common/owners';

// ─── Types ──────────────────────────────────────────────────────────────────
export type Score = 'hot' | 'warm' | 'cold';
export type Status = 'new' | 'contacted' | 'followed' | 'toconvert' | 'overdue' | 'converted';
export type ContactMethod = 'email' | 'phone';

// 由 owners.ts 集中維護，re-export 以維持既有匯入點。
export { OWNERS, type OwnerId };

export interface Lead {
  id: number;
  name: string;
  initial: string;
  company: string;
  contacts: ContactMethod[];
  score: Score;
  status: Status;
  source: string;
  assigneeBg: string;
  assigneeInitial: string;
  assigneeName: string;
  canConvert: boolean;
  convertTitle?: string;
}

/** 使用者在新增／編輯抽屜實際填寫的欄位。顯示用衍生欄位不在內。 */
export interface LeadDraft {
  id?: number;
  name: string;
  company: string;
  convertTitle: string;
  source: string;
  score: Score;
  status: Status;
  contacts: ContactMethod[];
  assignee: OwnerId;
}

export interface LeadValidation {
  ok: boolean;
  nameError?: string;
  companyError?: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────
/** 可手動設定的工作狀態（排除終態 converted，後者僅由轉換動作產生）。 */
export const WORKING_STATUSES: Status[] = ['new', 'contacted', 'followed', 'toconvert', 'overdue'];

// ─── Search / Filter ──────────────────────────────────────────────────────────
/** 依姓名與公司過濾潛客（不分大小寫、子字串比對）。空白關鍵字回傳全部。 */
export function filterLeads(leads: Lead[], query: string): Lead[] {
  const q = query.trim().toLowerCase();
  if (q === '') return [...leads];
  return leads.filter(
    (lead) => lead.name.toLowerCase().includes(q) || lead.company.toLowerCase().includes(q)
  );
}

/** 依狀態過濾潛客。'all' 回傳全部。 */
export function filterLeadsByStatus(leads: Lead[], status: Status | 'all'): Lead[] {
  if (status === 'all') return [...leads];
  return leads.filter((lead) => lead.status === status);
}

// ─── Draft → Lead ─────────────────────────────────────────────────────────────
/** 草稿必填驗證：姓名與公司不可空白。 */
export function validateLeadDraft(draft: LeadDraft): LeadValidation {
  const nameError = draft.name.trim() === '' ? '請輸入姓名' : undefined;
  const companyError = draft.company.trim() === '' ? '請輸入公司' : undefined;
  return { ok: !nameError && !companyError, nameError, companyError };
}

/** 把草稿補上顯示用衍生欄位，產出完整 Lead。canConvert 由 status 推導。 */
export function materializeLead(draft: LeadDraft, newId: number): Lead {
  const owner = OWNERS[draft.assignee];
  return {
    id: draft.id ?? newId,
    name: draft.name,
    initial: draft.name.trim().charAt(0),
    company: draft.company,
    contacts: draft.contacts,
    score: draft.score,
    status: draft.status,
    source: draft.source,
    assigneeBg: owner.gradient,
    assigneeInitial: owner.initial,
    assigneeName: owner.name,
    canConvert: draft.status === 'toconvert',
    convertTitle: draft.convertTitle || undefined,
  };
}

// ─── Immutable list operations ────────────────────────────────────────────────
/** 新增一筆潛客，回傳新陣列。 */
export function addLead(leads: Lead[], draft: LeadDraft, newId: number): Lead[] {
  return [...leads, materializeLead(draft, newId)];
}

/** 以草稿更新對應 id 的潛客，回傳新陣列。 */
export function editLead(leads: Lead[], draft: LeadDraft): Lead[] {
  return leads.map((lead) => (lead.id === draft.id ? materializeLead(draft, lead.id) : lead));
}

/** 移除指定 id 的潛客，回傳新陣列。 */
export function deleteLead(leads: Lead[], id: number): Lead[] {
  return leads.filter((lead) => lead.id !== id);
}

/** 轉換：把指定 id 的潛客標記為已轉化並鎖定，回傳新陣列。 */
export function convertLead(leads: Lead[], id: number): Lead[] {
  return leads.map((lead) =>
    lead.id === id ? { ...lead, status: 'converted', canConvert: false } : lead
  );
}
