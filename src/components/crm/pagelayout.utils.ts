// ── Page Layout (頁面版面) types & pure helpers ───────────────────────────────

export type PLVariant = 'blue' | 'violet' | 'green' | 'orange' | 'cyan' | 'pink';

export type PLPaletteTab = 'fields' | 'buttons' | 'related';

export interface PLPaletteItem {
  n: string;
  t: string;
  c?: PLVariant;
}

export interface PLPaletteGroup {
  g: string;
  items: PLPaletteItem[];
}

export interface PLField {
  n?: string;
  t?: string;
  req?: boolean;
  full?: boolean;
  empty?: boolean;
}

export interface PLSection {
  t: string;
  cols: number;
  collapsed?: boolean;
  fields: PLField[];
}

export interface PLRelCard {
  n: string;
  s: string;
  c: PLVariant;
}

export interface PageLayoutStats {
  /** 版面總數 — 所有物件版面數的總和 */
  layouts: number;
  /** 套用物件 — 已設定版面的物件數 */
  objects: number;
}

/** 由版面對應表推導統計摘要（版面總數、套用物件）。 */
export function pageLayoutStats(pills: Record<string, string[]>): PageLayoutStats {
  const objects = Object.keys(pills).length;
  const layouts = Object.values(pills).reduce((sum, arr) => sum + arr.length, 0);
  return { layouts, objects };
}

/** 依關鍵字過濾調色盤群組，並移除過濾後為空的群組。 */
export function filterPalette(groups: PLPaletteGroup[], search: string): PLPaletteGroup[] {
  const q = search.trim().toLowerCase();
  if (!q) return groups;
  return groups
    .map((grp) => ({
      ...grp,
      items: grp.items.filter(
        (it) => it.n.toLowerCase().includes(q) || it.t.toLowerCase().includes(q)
      ),
    }))
    .filter((grp) => grp.items.length > 0);
}
