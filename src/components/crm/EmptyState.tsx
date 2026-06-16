const META = {
  leads: {
    t: '潛在客戶 · Leads',
    d: '列表視圖、Hot/Warm/Cold 評分與一鍵 Convert 動作，設計中。',
    i: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  },
  accounts: {
    t: '客戶帳號 · Accounts',
    d: '列表視圖與帳號詳情側抽屜（公司資訊、聯絡人、商機、活動歷程），設計中。',
    i: '<path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16"/><path d="M15 9h3a1 1 0 0 1 1 1v11"/><path d="M3 21h18"/>',
  },
  contacts: {
    t: '聯絡人 · Contacts',
    d: '聯絡人列表與卡片（頭像縮寫、所屬公司連結、外部連結圖示），設計中。',
    i: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6"/>',
  },
  activities: {
    t: '活動與任務 · Activities',
    d: '統一活動列表（通話 / Email / 會議 / 任務）依日期分組與快速記錄列，設計中。',
    i: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>',
  },
  reports: {
    t: '報表 · Reports',
    d: '業績達成、漏斗轉換與活動量分析報表，設計中。',
    i: '<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="13" y="7" width="3" height="10"/>',
  },
  settings: {
    t: '設定 · Settings',
    d: '團隊、欄位、自動化與整合設定，設計中。',
    i: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M5 5l2 2M17 17l2 2M2 12h3M19 12h3M5 19l2-2M17 7l2-2"/>',
  },
} as const

type Page = keyof typeof META

export default function EmptyState({ page }: { page: Page }) {
  const meta = META[page]
  return (
    <div className="cx-empty">
      <div className="cx-empty-ic">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          dangerouslySetInnerHTML={{ __html: meta.i }}
        />
      </div>
      <h2>{meta.t}</h2>
      <p>{meta.d}</p>
      <div className="cx-empty-tag">即將推出</div>
    </div>
  )
}
