// ── Email settings (郵件設定) types & pure helpers ────────────────────────────

export type EmailCatVariant = 'blue' | 'green' | 'cyan' | 'pink' | 'violet';

export interface EmailCategory {
  nm: string;
  hex: string;
  v: EmailCatVariant;
}

export interface EmailSig {
  name: string;
  title: string;
  phone: string;
}

export type EmailBlock =
  | { kind: 'greet'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'cta'; text: string }
  | { kind: 'quote'; rows: [string, string][]; total?: [string, string] }
  | { kind: 'sig'; sig: EmailSig };

export interface EmailTemplate {
  k: string;
  name: string;
  cat: string;
  icon: string;
  on: boolean;
  used: string;
  from: string;
  to: string;
  lang: string;
  subj: string;
  body: EmailBlock[];
}

export interface EmailMergeGroup {
  g: string;
  f: string[];
}

export interface MergeTextPart {
  text: string;
  isMergeField: boolean;
}

/**
 * 將含有 `{{Token}}` 合併欄位語法的字串切成片段，保留原始順序。
 * 一般文字片段 isMergeField=false，`{{...}}` 片段 isMergeField=true。
 */
export function splitMergeText(text: string): MergeTextPart[] {
  const parts: MergeTextPart[] = [];
  const re = /\{\{[^}]+\}\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push({ text: text.slice(last, m.index), isMergeField: false });
    }
    parts.push({ text: m[0], isMergeField: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push({ text: text.slice(last), isMergeField: false });
  }
  return parts.length ? parts : [{ text, isMergeField: false }];
}

/**
 * 依「範本名稱、主旨或分類名稱」過濾範本（不分大小寫、子字串比對）。
 */
export function filterEmailTemplates(
  templates: EmailTemplate[],
  cats: Record<string, EmailCategory>,
  query: string
): EmailTemplate[] {
  const q = query.trim().toLowerCase();
  if (!q) return templates;
  return templates.filter((t) => {
    const catName = cats[t.cat]?.nm ?? '';
    return (
      t.name.toLowerCase().includes(q) ||
      t.subj.toLowerCase().includes(q) ||
      catName.toLowerCase().includes(q)
    );
  });
}

/**
 * 由範本資料推導統計：總數、啟用中、分類數。
 */
export function emailStats(
  templates: EmailTemplate[],
  cats: Record<string, EmailCategory>
): { total: number; active: number; categories: number } {
  return {
    total: templates.length,
    active: templates.filter((t) => t.on).length,
    categories: Object.keys(cats).length,
  };
}

export interface TemplateDraftValidation {
  ok: boolean;
  nameError?: string;
  subjError?: string;
}

/**
 * 驗證編輯草稿：範本名稱與主旨必填（去除前後空白後非空）。
 */
export function validateTemplateDraft(draft: EmailTemplate): TemplateDraftValidation {
  const result: TemplateDraftValidation = { ok: true };
  if (!draft.name.trim()) {
    result.ok = false;
    result.nameError = '請輸入範本名稱';
  }
  if (!draft.subj.trim()) {
    result.ok = false;
    result.subjError = '請輸入主旨';
  }
  return result;
}

/**
 * 將編輯草稿套用回範本清單：依 `k` 取代對應範本，其餘維持不變（不可變更新）。
 */
export function applyTemplateEdit(
  list: EmailTemplate[],
  draft: EmailTemplate
): EmailTemplate[] {
  return list.map((t) => (t.k === draft.k ? draft : t));
}
