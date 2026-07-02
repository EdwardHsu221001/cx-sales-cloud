'use client';

import { ChevRight, PlusIcon, EditIcon } from '../settings.icons';

// 尚未做完的設定模組佔位資料（依 activeTab 查表）。
const METADATA: Record<
  string,
  { group: string; title: string; cta: string; desc: string; cols: string[]; rows: string[][] }
> = {
  objects: {
    group: '物件與欄位',
    title: '物件管理',
    cta: '新增自訂物件',
    desc: '管理標準與自訂物件 — 定義 API 名稱、紀錄類型、頁面版面指派與物件層級權限。',
    cols: ['物件標籤', 'API 名稱', '類型', '紀錄數', '頁面版面', '分頁'],
    rows: [
      ['客戶帳號', 'Account', 'std', '1,248', '2 個版面', '已啟用'],
      ['聯絡人', 'Contact', 'std', '3,902', '1 個版面', '已啟用'],
      ['商機', 'Opportunity', 'std', '846', '3 個版面', '已啟用'],
      ['潛在客戶', 'Lead', 'std', '312', '1 個版面', '已啟用'],
      ['報價單', 'Quote__c', 'custom', '1,205', '2 個版面', '已啟用'],
      ['服務合約', 'ServiceContract__c', 'custom', '420', '1 個版面', '已啟用'],
    ],
  },
  fields: {
    group: '物件與欄位',
    title: '欄位管理',
    cta: '新增欄位',
    desc: '管理各物件的欄位 — 資料類型、必填、預設值、說明文字與欄位層級安全性。此處顯示「商機」物件欄位。',
    cols: ['欄位標籤', 'API 名稱', '資料類型', '必填', '索引'],
    rows: [
      ['商機名稱', 'Name', '文字(120)', 'req', '已索引'],
      ['金額', 'Amount', '貨幣', 'req', '已索引'],
      ['階段', 'StageName', '選項清單', 'req', '—'],
      ['折扣百分比', 'Discount__c', '百分比(0–100)', 'opt', '—'],
      ['預計關閉日', 'CloseDate', '日期', 'req', '已索引'],
      ['Cisco 通話 ID', 'CiscoCallId__c', '文字(64)', 'opt', '已索引'],
    ],
  },
  flexipage: {
    group: '介面設定',
    title: 'Lightning 頁面',
    cta: '新增 Lightning 頁面',
    desc: '以拖放元件方式組裝紀錄頁、首頁與應用程式頁，並設定啟用與指派範圍。',
    cols: ['頁面名稱', '類型', '範本', '狀態', '指派'],
    rows: [
      ['商機紀錄頁', '紀錄頁', '標頭與右側欄', 'active', '應用程式預設'],
      ['業務首頁', '首頁', '三欄', 'active', 'Sales Cloud'],
      ['客戶帳號紀錄頁', '紀錄頁', '標頭與右側欄', 'active', '應用程式預設'],
      ['主管儀表板', '應用程式頁', '單欄', 'off', '未指派'],
      ['潛客紀錄頁', '紀錄頁', '兩欄', 'active', '應用程式預設'],
    ],
  },
  tabs: {
    group: '介面設定',
    title: 'Tab 與導覽',
    cta: '新增 Tab',
    desc: '設定應用程式導覽列顯示的 Tab、順序與可見性，並管理自訂 Tab。',
    cols: ['Tab 名稱', '類型', '對應物件', '預設顯示', '排序'],
    rows: [
      ['首頁', '標準', '—', '顯示', '1'],
      ['潛在客戶', '物件', 'Lead', '顯示', '2'],
      ['客戶帳號', '物件', 'Account', '顯示', '3'],
      ['商機', '物件', 'Opportunity', '顯示', '4'],
      ['報表', '標準', '—', '顯示', '6'],
    ],
  },
  flow: {
    group: '業務自動化',
    title: '自動化流程 Flow',
    cta: '新增 Flow',
    desc: '以視覺化流程自動執行紀錄建立、更新與通知。支援紀錄觸發、排程與畫面流程。',
    cols: ['流程名稱', '類型', '觸發時機', '狀態', '執行次數(30天)'],
    rows: [
      ['新商機自動指派負責人', '紀錄觸發', '建立時', 'active', '142'],
      ['報價折扣超限送審', '紀錄觸發', '建立 / 更新時', 'active', '38'],
      ['潛客轉換建立帳號', '紀錄觸發', '更新時', 'active', '67'],
      ['逾期任務每日提醒', '排程', '每日 08:00', 'active', '30'],
      ['客戶健康度重算', '排程', '每週一', 'off', '—'],
    ],
  },
  approval: {
    group: '業務自動化',
    title: '審核流程',
    cta: '新增審核流程',
    desc: '定義紀錄送審條件、審核層級與核准 / 退回後的自動動作。與角色折扣上限連動。',
    cols: ['流程名稱', '物件', '觸發條件', '審核層級', '狀態'],
    rows: [
      ['折扣超限審核', 'Quote__c', '折扣 > 角色上限', '2 層（主管→總監）', 'active'],
      ['大額商機審核', 'Opportunity', '金額 > NT$ 3M', '1 層（區域總監）', 'active'],
      ['合約展延審核', 'ServiceContract__c', '展延 > 12 個月', '1 層（業務經理）', 'active'],
      ['退費申請審核', 'Quote__c', '含退費項目', '2 層', 'off'],
    ],
  },
  workflow: {
    group: '業務自動化',
    title: '工作流程規則',
    cta: '新增規則',
    desc: '以條件式規則觸發欄位更新、Email 提醒與外寄訊息（傳統 Workflow，建議逐步遷移至 Flow）。',
    cols: ['規則名稱', '物件', '評估時機', '動作', '狀態'],
    rows: [
      ['商機成交通知主管', 'Opportunity', '建立 / 編輯', 'Email 提醒', 'active'],
      ['潛客評分自動標記', 'Lead', '建立', '欄位更新', 'active'],
      ['停滯商機提醒', 'Opportunity', '符合條件時', '工作指派', 'off'],
      ['續約日期前 30 天提醒', 'ServiceContract__c', '建立 / 編輯', 'Email 提醒', 'active'],
    ],
  },
  api: {
    group: '系統整合',
    title: 'API 設定（Cisco 等）',
    cta: '連接新應用程式',
    desc: '管理已連接的外部系統與 API 認證 — 包含 Cisco 通訊整合、OAuth 用戶端與 Webhook 端點。',
    cols: ['整合名稱', '類型', '驗證方式', '狀態', '最後同步'],
    rows: [
      ['Cisco Webex', '通訊', 'OAuth 2.0', 'connected', '5 分鐘前'],
      ['Cisco CUCM 通話紀錄', '通訊', 'API Key', 'connected', '12 分鐘前'],
      ['SendGrid 郵件服務', '郵件', 'API Key', 'connected', '1 小時前'],
      ['企業 ERP (SAP)', '資料', 'OAuth 2.0', 'connected', '今日 06:00'],
      ['Slack 通知', '通知', 'Webhook', 'off', '—'],
    ],
  },
  import: {
    group: '系統整合',
    title: '匯入批次設定',
    cta: '新增匯入批次',
    desc: '設定排程性資料匯入批次 — 來源、對應欄位、重複比對規則與執行頻率。',
    cols: ['批次名稱', '目標物件', '來源', '頻率', '上次結果'],
    rows: [
      ['每日潛客匯入', 'Lead', 'FTP / CSV', '每日 02:00', '成功 · 128 筆'],
      ['ERP 客戶同步', 'Account', 'SAP API', '每 6 小時', '成功 · 42 筆'],
      ['行銷名單匯入', 'Lead', '手動上傳', '手動', '成功 · 560 筆'],
      ['歷史商機匯入', 'Opportunity', 'CSV', '一次性', '部分失敗 · 3 筆'],
    ],
  },
  email: {
    group: '系統整合',
    title: '郵件設定',
    cta: '新增寄件位址',
    desc: '設定系統外寄郵件 — 寄件位址、SMTP / 中繼服務、郵件範本與每日送信額度。',
    cols: ['設定項目', '類型', '值 / 狀態', '驗證', '預設'],
    rows: [
      ['寄件位址 sales@cxcrm.com', '寄件者', '已驗證', 'spf', '是'],
      ['SendGrid 中繼', 'SMTP 中繼', 'smtp.sendgrid.net', 'dkim', '是'],
      ['每日送信額度', '限制', '2,000 / 5,000 封', '—', '—'],
      ['報表範本', '郵件範本', 'HTML', '—', '是'],
      ['退信處理', '設定', '自動標記無效', '—', '—'],
    ],
  },
};

function PlaceholderCell({ cell }: { cell: string }) {
  if (cell === '已啟用' || cell === 'active' || cell === 'connected')
    return (
      <span className="cx-status active">
        <span className="pip" />
        {cell === 'active' ? '啟用' : cell === 'connected' ? '已連線' : cell}
      </span>
    );
  if (cell === 'off')
    return (
      <span className="cx-status inactive">
        <span className="pip" />
        停用
      </span>
    );
  if (cell === 'std') return <span className="cx-tag-inline">標準</span>;
  if (cell === 'custom') return <span className="cx-tag-inline custom">自訂</span>;
  if (cell === 'req') return <span className="cx-req-tag">必填</span>;
  if (cell === 'opt') return <span className="cx-req-tag no">選填</span>;
  if (cell === 'spf')
    return (
      <span className="cx-status active">
        <span className="pip" />
        SPF 已驗
      </span>
    );
  if (cell === 'dkim')
    return (
      <span className="cx-status active">
        <span className="pip" />
        DKIM 已驗
      </span>
    );
  return <>{cell}</>;
}

export default function PlaceholderPanel({
  showToast,
  onNavigate,
  activeTab,
}: {
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
}) {
  const meta = METADATA[activeTab] || {
    group: '系統設定',
    title: activeTab,
    cta: '執行動作',
    desc: '本設定模組的高保真設計正在進行中。',
    cols: ['項目', '說明', '狀態'],
    rows: [['預覽資料', '點擊左側軌道切換設定項。', '進行中']],
  };
  return (
    <div>
      <div className="cx-crumbs">
        <a onClick={() => onNavigate('hub')}>設定</a>
        <ChevRight />
        <span>{meta.group}</span>
        <ChevRight />
        <span>{meta.title}</span>
      </div>
      <div className="cx-set-head">
        <div>
          <h1>{meta.title}</h1>
          <div className="sub">{meta.desc}</div>
        </div>
        <div className="actions">
          <button className="cx-btn-sm pri" onClick={() => showToast(`已觸發行動：${meta.cta}`)}>
            <PlusIcon />
            {meta.cta}
          </button>
        </div>
      </div>

      <div className="cx-ph-banner">
        <div className="pb-ic">
          <EditIcon />
        </div>
        <div className="pb-tx">
          <div className="t">此模組高保真設計進行中</div>
          <div className="s">
            「{meta.title}」的完整編輯介面尚在規劃中，以下為資料結構與內容預覽。
          </div>
        </div>
        <span className="pb-tag">設計中</span>
      </div>

      <div className="cx-ph-preview">
        <div className="cx-data-card">
          <table className="cx-dt">
            <thead>
              <tr>
                {meta.cols.map((c, i) => (
                  <th key={i}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meta.rows.map((row, ri) => (
                <tr key={ri} className="no-hover">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={ci === 0 ? { fontWeight: 500 } : { color: 'var(--cx-text-sub)' }}
                    >
                      <PlaceholderCell cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cx-pager">
            <div className="info">
              顯示 <b>1–{meta.rows.length}</b> 筆，共 <b>{meta.rows.length}</b> 筆
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--cx-text-faint)' }}>預覽資料</div>
          </div>
        </div>
      </div>
    </div>
  );
}
