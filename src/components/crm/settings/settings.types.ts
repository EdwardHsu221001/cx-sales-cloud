// Settings 共用型別（自 Settings.tsx 抽出）。

export type RoleKey = 'admin' | 'director' | 'manager' | 'senior' | 'rep' | 'support';

export interface UserData {
  av: string;
  g: string;
  name: string;
  email: string;
  title: string;
  role: RoleKey;
  profile: string;
  perms: string[];
  status: 'active' | 'inactive' | 'pending';
  last: string;
  since: string;
}

// ── Roles ──────────────────────────────────────────────────────────────────
export interface RoleNode {
  name: string;
  code: string;
  color: string;
  children?: RoleNode[];
}
export interface RPerson {
  av: string;
  g: string;
  name: string;
  title: string;
  email: string;
  role: string;
}

// ── Flow ───────────────────────────────────────────────────────────────────
export type FlowTrig = 'record' | 'schedule' | 'screen';
export interface DiagramStep {
  start?: boolean;
  end?: boolean;
  stop?: boolean;
  decision?: boolean;
  ic?: string;
  label: string;
  sub?: string;
  trig?: FlowTrig;
  yes?: DiagramStep[];
  no?: DiagramStep[];
}
export interface FlowItem {
  name: string;
  api: string;
  trig: FlowTrig;
  obj: string;
  desc: string;
  on: boolean;
  ver: number;
  runs7: number;
  fail7: number;
  lm: { av: string; g: string; name: string; date: string };
  diagram: DiagramStep[];
}
export type RunEntry = { ok: number; t: string; d: string; time: string; dur: string };
export type VerEntry = { v: string; active: boolean; date: string; by: string; note: string };

// ── Import Batch ─────────────────────────────────────────────────────────────
export type ImpSrc = 'csv' | 'api' | 'manual';
export type ImpStatus = 'scheduled' | 'processing' | 'completed' | 'partial' | 'failed' | 'queued';
export interface BatchItem {
  name: string;
  file: string;
  obj: string;
  src: ImpSrc;
  freq: string;
  status: ImpStatus;
  sched: boolean;
  on: boolean;
  total: number;
  ok: number;
  err: number;
  skip: number;
  prog?: number;
  by: { av: string; g: string; name: string; date: string };
  dur: string;
  failReason?: string;
}
export type ImpErrEntry = { row: number; id: string; reason: string };
export type MapRow = [string, string, string, 'ok' | 'skip'];
export type ImpRecEntry = { id: string; name: string; status: 'ok' | 'skip' | 'err'; note?: string };
