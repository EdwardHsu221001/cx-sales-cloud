// ─── Types ──────────────────────────────────────────────────────────────────
export type Score = 'hot' | 'warm' | 'cold';
export type Status = 'new' | 'contacted' | 'followed' | 'toconvert' | 'overdue';
export type ContactMethod = 'email' | 'phone';

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

// ─── Search ─────────────────────────────────────────────────────────────────
/** 依姓名與公司過濾潛客（不分大小寫、子字串比對）。空白關鍵字回傳全部。 */
export function filterLeads(leads: Lead[], query: string): Lead[] {
  const q = query.trim().toLowerCase();
  if (q === '') return [...leads];
  return leads.filter(
    (lead) => lead.name.toLowerCase().includes(q) || lead.company.toLowerCase().includes(q),
  );
}
