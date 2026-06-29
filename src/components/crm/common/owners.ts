// 單一負責人登錄：Leads 與 Accounts 共用同一份資料，避免重複維護。
export type OwnerId = 'zhang' | 'chen' | 'lin';

/** 固定三位負責人對照。正規結構 { name, initial, gradient }。 */
export const OWNERS: Record<OwnerId, { name: string; initial: string; gradient: string }> = {
  zhang: { name: '張志豪', initial: '張', gradient: 'linear-gradient(135deg,#60a5fa,#2563eb)' },
  chen: { name: '陳美華', initial: '陳', gradient: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
  lin: { name: '林俊傑', initial: '林', gradient: 'linear-gradient(135deg,#fbbf24,#f59e0b)' },
};
