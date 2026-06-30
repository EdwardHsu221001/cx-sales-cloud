// ── Types ─────────────────────────────────────────────────────────────────────
export type Stage = 'need' | 'proposal' | 'negotiate' | 'won' | 'lost';
export type OwnerId = 'zhang' | 'chen' | 'lin';
export type CoId = 'tsmc' | 'fox' | 'mtk' | 'wis' | 'delta' | 'asus';

export interface Opp {
  id: number;
  title: string;
  co: CoId;
  amt: number;
  prob: number;
  close: string;
  owner: OwnerId;
  stage: Stage;
}
