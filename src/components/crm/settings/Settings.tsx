'use client';

import { useState, useCallback, Fragment } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IconSearch } from '../common/icons';
import {
  ChevRight,
  ChevLeft,
  CheckIcon,
  XIcon,
  PlusIcon,
  EditIcon,
  ExportIcon,
  ClipIcon,
  LockIcon,
  LoginIcon,
  UserGrpIcon,
  CheckCircle,
  LicIcon,
  ClockIcon,
  IconSettingsCenter,
  IconGroupUsers,
  IconGroupObjects,
  IconGroupUI,
  IconGroupAuto,
  IconGroupIntegration,
} from './settings.icons';
import {
  ROLES,
  USERS,
  GRAD,
  FLOWS,
  FLOW_TRIGGER,
  FLOW_RUNS,
  FLOW_VERSIONS,
  BATCHES,
  IMP_SOURCE,
  IMP_STATUS,
  IMP_ERRORS,
  IMP_MAPPING,
  IMP_RECORDS,
} from './settings.data';
import type {
  FlowTrig,
  DiagramStep,
  RunEntry,
  VerEntry,
  ImpSrc,
  MapRow,
  ImpRecEntry,
} from './settings.types';
import DiscountPanel from './discount/DiscountPanel';
import RolesPanel from './roles/RolesPanel';
import FlowPanel from './flow/FlowPanel';
import ImportPanel from './import/ImportPanel';
import ImportWizardPanel from './import/ImportWizardPanel';
import EmailPanel from './email/EmailPanel';
import PageLayoutPanel from './pagelayout/PageLayoutPanel';

const STATUS_MAP = {
  active: { cls: 'active', lbl: '啟用中' },
  inactive: { cls: 'inactive', lbl: '停用' },
  pending: { cls: 'pending', lbl: '待啟用' },
};

const OBJECTS = [
  { nm: '客戶帳號', api: 'Account' },
  { nm: '聯絡人', api: 'Contact' },
  { nm: '商機', api: 'Opportunity' },
  { nm: '潛在客戶', api: 'Lead' },
  { nm: '活動 / 任務', api: 'Activity' },
  { nm: '報表', api: 'Report' },
];
const ACCESS: Record<string, boolean[][]> = {
  full: OBJECTS.map(() => [true, true, true, true]),
  rw: [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 0],
  ].map((r) => r.map(Boolean)),
  std: [
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
  ].map((r) => r.map(Boolean)),
  support: [
    [1, 0, 1, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
  ].map((r) => r.map(Boolean)),
  ro: OBJECTS.map(() => [true, false, false, false]),
};

interface ProfileData {
  name: string;
  users: number;
  license: string;
  lic: string;
  access: string;
  sys: string[];
  desc: string;
}
const PROFILES: ProfileData[] = [
  {
    name: '系統管理員',
    users: 2,
    license: 'Salesforce',
    lic: 'sf',
    access: 'full',
    sys: ['管理使用者', '修改所有資料', '檢視設定與組態', '管理 Permission Set'],
    desc: '完整系統存取與設定權限，僅供 IT 與系統管理人員使用。',
  },
  {
    name: '業務經理',
    users: 3,
    license: 'Salesforce',
    lic: 'sf',
    access: 'rw',
    sys: ['檢視團隊所有商機', '匯出報表', '管理預測', '轉移擁有權'],
    desc: '可讀寫團隊資料、檢視報表與業績預測，管理下屬商機。',
  },
  {
    name: '標準業務',
    users: 8,
    license: 'Salesforce',
    lic: 'sf',
    access: 'std',
    sys: ['建立與編輯自有紀錄', '記錄活動', '使用清單檢視'],
    desc: '業務代表預設 Profile，可讀寫自有客戶與商機。',
  },
  {
    name: '業務支援',
    users: 4,
    license: 'Salesforce',
    lic: 'sf',
    access: 'support',
    sys: ['存取知識庫', '記錄個案活動', '檢視帳號'],
    desc: '內勤支援角色，以個案、活動與知識庫為主。',
  },
  {
    name: '唯讀稽核',
    users: 2,
    license: 'Salesforce Platform',
    lic: 'platform',
    access: 'ro',
    sys: ['檢視所有資料', '匯出報表'],
    desc: '全物件唯讀，供稽核與財務查核使用，無寫入權限。',
  },
];

interface PermSetData {
  name: string;
  type: string;
  typeL: string;
  users: number;
  desc: string;
  perms: [string, string, boolean][];
}
const PERMSETS: PermSetData[] = [
  {
    name: '報表匯出',
    type: 'func',
    typeL: '功能',
    users: 12,
    desc: '允許將報表與清單檢視匯出為 CSV / Excel。',
    perms: [
      ['匯出報表', '將報表結果下載為檔案', true],
      ['匯出清單檢視', '下載清單檢視資料', true],
      ['排程報表寄送', '定期以 Email 寄送報表', false],
    ],
  },
  {
    name: '商機刪除',
    type: 'obj',
    typeL: '物件',
    users: 4,
    desc: '授予商機物件的刪除權限（預設 Profile 不含）。',
    perms: [
      ['刪除商機', '刪除自有與團隊商機', true],
      ['大量刪除', '於清單檢視批次刪除', false],
    ],
  },
  {
    name: 'API 存取',
    type: 'sys',
    typeL: '系統',
    users: 3,
    desc: '啟用 REST / Bulk API 與已連接的應用程式。',
    perms: [
      ['API 已啟用', '透過 REST / SOAP 存取資料', true],
      ['Bulk API', '大量資料批次處理', true],
      ['管理已連接應用程式', 'OAuth 連線管理', false],
    ],
  },
  {
    name: '大量匯入精靈',
    type: 'data',
    typeL: '資料',
    users: 5,
    desc: '使用資料匯入精靈批次建立 / 更新紀錄。',
    perms: [
      ['匯入個人紀錄', '匯入自有物件資料', true],
      ['匯入所有資料', '跨擁有者匯入', false],
    ],
  },
  {
    name: 'Cisco 整合',
    type: 'intg',
    typeL: '整合',
    users: 2,
    desc: '存取 Cisco Webex / CUCM 通話紀錄同步與點擊撥號。',
    perms: [
      ['通話紀錄同步', '自 CUCM 同步通話歷程', true],
      ['點擊撥號 (Click-to-Dial)', '於紀錄頁一鍵撥號', true],
      ['Webex 會議建立', '於商機建立 Webex 會議', true],
    ],
  },
  {
    name: '行銷活動管理',
    type: 'func',
    typeL: '功能',
    users: 6,
    desc: '建立與管理行銷活動及其成員名單。',
    perms: [
      ['管理行銷活動', '建立 / 編輯行銷活動', true],
      ['新增行銷活動成員', '加入聯絡人 / 潛客', true],
    ],
  },
];
const PERM_ASSIGNED: Record<string, number[]> = {
  報表匯出: [0, 1, 2, 3, 4],
  商機刪除: [0, 1],
  'API 存取': [1, 2],
  大量匯入精靈: [1, 3],
  'Cisco 整合': [1, 6],
  行銷活動管理: [2, 3],
};

// ── Nav groups ────────────────────────────────────────────────────────────────
interface NavItem {
  key: string;
  label: string;
  cnt?: string;
  ph?: boolean;
}
interface NavGroup {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: '使用者管理',
    icon: <IconGroupUsers />,
    items: [
      { key: 'users', label: '使用者清單與角色指派', cnt: '8' },
      { key: 'roles', label: '角色階層管理', cnt: '8' },
      { key: 'profiles', label: 'Profile 管理', cnt: '5' },
      { key: 'permsets', label: 'Permission Set 指派', cnt: '6' },
      { key: 'discount', label: '角色折扣上限', cnt: '6' },
    ],
  },
  {
    label: '物件與欄位',
    icon: <IconGroupObjects />,
    items: [{ key: 'objects', label: '物件管理員' }],
  },
  {
    label: '介面設定',
    icon: <IconGroupUI />,
    items: [
      { key: 'pagelayout', label: '頁面版面 Page Layout' },
      { key: 'flexipage', label: 'Lightning 頁面', ph: true },
      { key: 'tabs', label: 'Tab 與導覽', ph: true },
    ],
  },
  {
    label: '業務自動化',
    icon: <IconGroupAuto />,
    items: [
      { key: 'flow', label: '自動化流程 Flow' },
      { key: 'approval', label: '審核流程', ph: true },
      { key: 'workflow', label: '工作流程規則', ph: true },
    ],
  },
  {
    label: '系統整合',
    icon: <IconGroupIntegration />,
    items: [
      { key: 'api', label: 'API 設定（Cisco 等）', ph: true },
      { key: 'import', label: '匯入批次設定' },
      { key: 'email', label: '郵件設定' },
    ],
  },
];

const HUB_ICON_CLS = ['cx-ic-users', 'cx-ic-objs', 'cx-ic-ui', 'cx-ic-auto', 'cx-ic-int'];

// ── Placeholder metadata ──────────────────────────────────────────────────────
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

// ── Object Manager Data ───────────────────────────────────────────────────────
const OBJ_ICON_STYLE: Record<string, { bg: string; color: string }> = {
  blue: { bg: 'var(--cx-accent-soft)', color: 'var(--cx-accent)' },
  green: { bg: 'var(--cx-success-soft)', color: '#059669' },
  violet: { bg: '#EDE9FE', color: '#6d28d9' },
  amber: { bg: '#FEF3C7', color: '#b45309' },
  cyan: { bg: '#E0F2FE', color: '#0369a1' },
  teal: { bg: '#CCFBF1', color: '#0d9488' },
};

interface ObjItem {
  nm: string;
  api: string;
  icon: string;
  g: string;
  records: number;
  fields: number;
  std: boolean;
  customFields: number;
}
const OBJ_ITEMS: ObjItem[] = [
  {
    nm: '客戶帳號',
    api: 'Account',
    icon: '帳',
    g: 'blue',
    records: 1248,
    fields: 148,
    std: true,
    customFields: 12,
  },
  {
    nm: '聯絡人',
    api: 'Contact',
    icon: '聯',
    g: 'green',
    records: 3902,
    fields: 62,
    std: true,
    customFields: 5,
  },
  {
    nm: '商機',
    api: 'Opportunity',
    icon: '機',
    g: 'violet',
    records: 846,
    fields: 54,
    std: true,
    customFields: 8,
  },
  {
    nm: '潛在客戶',
    api: 'Lead',
    icon: '潛',
    g: 'amber',
    records: 312,
    fields: 43,
    std: true,
    customFields: 3,
  },
  {
    nm: '報價單',
    api: 'Quote__c',
    icon: '報',
    g: 'cyan',
    records: 1205,
    fields: 28,
    std: false,
    customFields: 28,
  },
  {
    nm: '服務合約',
    api: 'ServiceContract__c',
    icon: '約',
    g: 'teal',
    records: 420,
    fields: 22,
    std: false,
    customFields: 22,
  },
];

interface FieldRow {
  label: string;
  api: string;
  type: string;
  status: 'STANDARD' | 'CUSTOM';
}
const FIELDS_DATA: Record<string, { total: number; custom: number; rows: FieldRow[] }> = {
  Account: {
    total: 148,
    custom: 12,
    rows: [
      { label: 'Account Name', api: 'Name', type: 'Text(255)', status: 'STANDARD' },
      { label: 'Industry', api: 'Industry', type: 'Picklist', status: 'STANDARD' },
      { label: 'SLA Expiration Date', api: 'SLAExpirationDate__c', type: 'Date', status: 'CUSTOM' },
      { label: 'Tier Level', api: 'TierLevel__c', type: 'Picklist (Multi)', status: 'CUSTOM' },
      { label: 'Total Value', api: 'TotalValue__c', type: 'Currency(16,2)', status: 'CUSTOM' },
      { label: 'Website', api: 'Website', type: 'URL', status: 'STANDARD' },
    ],
  },
  Contact: {
    total: 62,
    custom: 5,
    rows: [
      { label: 'First Name', api: 'FirstName', type: 'Text(40)', status: 'STANDARD' },
      { label: 'Last Name', api: 'LastName', type: 'Text(80)', status: 'STANDARD' },
      { label: 'Email', api: 'Email', type: 'Email', status: 'STANDARD' },
      { label: 'Phone', api: 'Phone', type: 'Phone', status: 'STANDARD' },
      { label: 'LINE ID', api: 'LINE_ID__c', type: 'Text(100)', status: 'CUSTOM' },
      { label: 'Priority', api: 'Priority__c', type: 'Picklist', status: 'CUSTOM' },
    ],
  },
  Opportunity: {
    total: 54,
    custom: 8,
    rows: [
      { label: 'Opportunity Name', api: 'Name', type: 'Text(120)', status: 'STANDARD' },
      { label: 'Amount', api: 'Amount', type: 'Currency', status: 'STANDARD' },
      { label: 'Stage', api: 'StageName', type: 'Picklist', status: 'STANDARD' },
      { label: 'Close Date', api: 'CloseDate', type: 'Date', status: 'STANDARD' },
      { label: 'Discount', api: 'Discount__c', type: 'Percent(0–100)', status: 'CUSTOM' },
      { label: 'Cisco Call ID', api: 'CiscoCallId__c', type: 'Text(64)', status: 'CUSTOM' },
    ],
  },
  Lead: {
    total: 43,
    custom: 3,
    rows: [
      { label: 'First Name', api: 'FirstName', type: 'Text(40)', status: 'STANDARD' },
      { label: 'Last Name', api: 'LastName', type: 'Text(80)', status: 'STANDARD' },
      { label: 'Company', api: 'Company', type: 'Text(255)', status: 'STANDARD' },
      { label: 'Status', api: 'Status', type: 'Picklist', status: 'STANDARD' },
      { label: 'Lead Source', api: 'LeadSource', type: 'Picklist', status: 'STANDARD' },
      { label: 'Score', api: 'Score__c', type: 'Number(3,0)', status: 'CUSTOM' },
    ],
  },
  Quote__c: {
    total: 28,
    custom: 28,
    rows: [
      { label: 'Quote Name', api: 'Name', type: 'Auto Number', status: 'STANDARD' },
      { label: 'Status', api: 'Status__c', type: 'Picklist', status: 'CUSTOM' },
      { label: 'Total Amount', api: 'TotalAmount__c', type: 'Currency(16,2)', status: 'CUSTOM' },
      { label: 'Discount', api: 'Discount__c', type: 'Percent(0–100)', status: 'CUSTOM' },
      { label: 'Valid Until', api: 'ValidUntil__c', type: 'Date', status: 'CUSTOM' },
      { label: 'Approval Status', api: 'ApprovalStatus__c', type: 'Picklist', status: 'CUSTOM' },
    ],
  },
  ServiceContract__c: {
    total: 22,
    custom: 22,
    rows: [
      { label: 'Contract Name', api: 'Name', type: 'Auto Number', status: 'STANDARD' },
      { label: 'Status', api: 'Status__c', type: 'Picklist', status: 'CUSTOM' },
      { label: 'Start Date', api: 'StartDate__c', type: 'Date', status: 'CUSTOM' },
      { label: 'End Date', api: 'EndDate__c', type: 'Date', status: 'CUSTOM' },
      {
        label: 'Contract Value',
        api: 'ContractValue__c',
        type: 'Currency(16,2)',
        status: 'CUSTOM',
      },
      { label: 'Auto Renew', api: 'AutoRenew__c', type: 'Checkbox', status: 'CUSTOM' },
    ],
  },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ s }: { s: 'active' | 'inactive' | 'pending' }) {
  const m = STATUS_MAP[s];
  return (
    <span className={`cx-status ${m.cls}`}>
      <span className="pip" />
      {m.lbl}
    </span>
  );
}

function PermChips({ perms }: { perms: string[] }) {
  if (!perms.length) return <span className="cx-perm-none">—</span>;
  const show = perms.slice(0, 2);
  const extra = perms.length - show.length;
  return (
    <div className="cx-perm-chips">
      {show.map((p) => (
        <span key={p} className="cx-perm-chip">
          {p}
        </span>
      ))}
      {extra > 0 && <span className="cx-perm-more">+{extra}</span>}
    </div>
  );
}

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

// ── Detail Drawer ─────────────────────────────────────────────────────────────
interface DrawerState {
  open: boolean;
  type: 'user' | 'profile' | 'permset' | 'flow' | 'batch';
  index: number;
  tab: string;
}

function DetailDrawer({
  state,
  onClose,
  onStep,
  onTabChange,
  showToast,
  toggleStates,
  onToggle,
  flowOn,
  onFlowToggle,
  batchOn,
  onBatchToggle,
}: {
  state: DrawerState;
  onClose: () => void;
  onStep: (d: number) => void;
  onTabChange: (tab: string) => void;
  showToast: (msg: string) => void;
  toggleStates: Record<string, boolean>;
  onToggle: (key: string) => void;
  flowOn: Record<number, boolean>;
  onFlowToggle: (i: number) => void;
  batchOn: Record<number, boolean>;
  onBatchToggle: (i: number) => void;
}) {
  if (!state.open) return null;

  const len =
    state.type === 'user'
      ? USERS.length
      : state.type === 'profile'
        ? PROFILES.length
        : state.type === 'flow'
          ? FLOWS.length
          : state.type === 'batch'
            ? BATCHES.length
            : PERMSETS.length;

  function UserContent() {
    const u = USERS[state.index];
    const r = ROLES[u.role];
    const st = STATUS_MAP[u.status];
    const tabs = ['overview', 'assign', 'activity'];
    const tabLabels = ['概覽', '角色與權限', '活動歷程'];

    return (
      <>
        <div className="cx-dw-top">
          <div className="cx-dw-bar">
            <span
              className="crumb"
              style={{ fontSize: '11.5px', color: 'var(--cx-text-faint)', fontWeight: 500 }}
            >
              <b style={{ color: 'var(--cx-text-sub)', fontWeight: 500 }}>使用者</b> ／ {u.name}
            </span>
            <div className="sp" style={{ flex: 1 }} />
            <button className="cx-dw-iconbtn" onClick={() => onStep(-1)}>
              <ChevLeft />
            </button>
            <button className="cx-dw-iconbtn" onClick={() => onStep(1)}>
              <ChevRight />
            </button>
            <button className="cx-dw-iconbtn" onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <div className="cx-dw-hero">
            <div className="logo" style={{ background: GRAD[u.g] }}>
              {u.av}
            </div>
            <div className="h-main" style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: 19,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {u.name}
              </h2>
              <div
                className="h-meta cx-dw-hero"
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}
              >
                <span className="cx-role-tag">
                  <span className="rk" style={{ background: r.color }} />
                  {r.name}
                </span>
                <StatusBadge s={u.status} />
              </div>
              <div className="h-sub">
                {u.title} · {u.email}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="cx-btn-sm pri" onClick={() => showToast('已開啟編輯面板')}>
                <EditIcon />
                編輯
              </button>
            </div>
          </div>
          <div className="cx-dw-tabs">
            {tabs.map((t, i) => (
              <div
                key={t}
                className={`cx-dw-tab ${state.tab === t ? 'on' : ''}`}
                onClick={() => onTabChange(t)}
              >
                {tabLabels[i]}
              </div>
            ))}
          </div>
        </div>
        <div className="cx-dw-body">
          {state.tab === 'overview' && (
            <>
              <div className="cx-dw-kpi">
                <div className="k">
                  <div className="v">{r.cap}%</div>
                  <div className="l">折扣核給上限</div>
                </div>
                <div className="k">
                  <div className="v">{u.perms.length}</div>
                  <div className="l">Permission Sets</div>
                </div>
                <div className="k">
                  <div className="v" style={{ fontSize: 13, lineHeight: 1.3, paddingTop: 2 }}>
                    {u.last}
                  </div>
                  <div className="l">最後登入</div>
                </div>
              </div>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>使用者資訊</h3>
                  <div className="sp" style={{ flex: 1 }} />
                  <span
                    className="add"
                    style={{
                      fontSize: 12,
                      color: 'var(--cx-accent)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onClick={() => showToast('已開啟編輯面板')}
                  >
                    <EditIcon />
                    編輯
                  </span>
                </div>
                <div className="cx-info-grid">
                  <div className="cell">
                    <div className="cl">姓名</div>
                    <div className="cv">{u.name}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">職稱</div>
                    <div className="cv">{u.title}</div>
                  </div>
                  <div className="cell full">
                    <div className="cl">Email</div>
                    <div className="cv">
                      <a href="#" style={{ color: 'var(--cx-accent)', textDecoration: 'none' }}>
                        {u.email}
                      </a>
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">角色</div>
                    <div className="cv">
                      <span className="cx-role-tag">
                        <span className="rk" style={{ background: r.color }} />
                        {r.name}
                      </span>
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">Profile</div>
                    <div className="cv">
                      <span className="cx-prof-tag">{u.profile}</span>
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">啟用日期</div>
                    <div className="cv">{u.since}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">狀態</div>
                    <div className="cv">
                      <StatusBadge s={u.status} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {state.tab === 'assign' && (
            <>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>角色與折扣上限</h3>
                </div>
                <div className="cx-info-grid">
                  <div className="cell">
                    <div className="cl">角色</div>
                    <div className="cv">
                      <span className="cx-role-tag">
                        <span className="rk" style={{ background: r.color }} />
                        {r.name}
                      </span>
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">折扣核給上限</div>
                    <div className="cv">
                      <b style={{ fontWeight: 500 }}>{r.cap}%</b>&ensp;
                      <span style={{ color: 'var(--cx-text-faint)', fontSize: 11.5 }}>
                        {r.over === 'unlimited'
                          ? '不受限制'
                          : r.over === 'block'
                            ? '禁止核給'
                            : '自動送審核'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>Profile（權限基準）</h3>
                </div>
                <div className="cx-info-grid">
                  <div className="cell full">
                    <div className="cl">指派的 Profile</div>
                    <div className="cv">
                      <span className="cx-prof-tag">{u.profile}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>Permission Sets（疊加權限）</h3>
                  <span
                    className="sh-n"
                    style={{
                      fontSize: 11,
                      color: 'var(--cx-text-faint)',
                      background: 'var(--cx-bg)',
                      padding: '1px 8px',
                      borderRadius: 20,
                      fontWeight: 500,
                    }}
                  >
                    {u.perms.length}
                  </span>
                  <div className="sp" style={{ flex: 1 }} />
                  <span
                    className="add"
                    style={{
                      fontSize: 12,
                      color: 'var(--cx-accent)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onClick={() => showToast('已開啟指派面板')}
                  >
                    <PlusIcon />
                    指派
                  </span>
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {u.perms.length ? (
                    u.perms.map((p) => (
                      <span
                        key={p}
                        className="cx-perm-chip"
                        style={{ fontSize: 12, padding: '4px 11px' }}
                      >
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="cx-perm-none">尚未指派任何 Permission Set</span>
                  )}
                </div>
              </div>
            </>
          )}
          {state.tab === 'activity' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>活動歷程</h3>
              </div>
              <div className="cx-tl">
                {[
                  {
                    t: 'cx-ti-login',
                    icon: <LoginIcon />,
                    tt: '登入系統',
                    td: '自 IP 203.74.x.x（台北）登入 Sales Cloud。',
                    m: u.last,
                  },
                  {
                    t: 'cx-ti-role',
                    icon: <ClipIcon />,
                    tt: '角色指派變更',
                    td: '由「業務代表」調整為現任角色，折扣上限同步更新。',
                    m: '王淑芬 · 指派',
                  },
                  {
                    t: 'cx-ti-perm',
                    icon: <LockIcon />,
                    tt: '套用 Permission Set',
                    td: '新增「報表匯出」權限集。',
                    m: '王淑芬 · 指派',
                  },
                ].map((a, i) => (
                  <div key={i} className="cx-tl-item">
                    <div className={`ti ${a.t}`}>{a.icon}</div>
                    <div className="tc">
                      <div className="tt">{a.tt}</div>
                      <div className="td">{a.td}</div>
                      <div className="tm">{a.m}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  function ProfileContent() {
    const p = PROFILES[state.index];
    const acc = ACCESS[p.access];
    const tabs = ['objects', 'fls', 'users'];
    const tabLabels = ['物件存取', '欄位安全性', '指派使用者'];
    const assigned = USERS.filter((u) => u.profile === p.name);

    return (
      <>
        <div className="cx-dw-top">
          <div className="cx-dw-bar">
            <span
              className="crumb"
              style={{ fontSize: '11.5px', color: 'var(--cx-text-faint)', fontWeight: 500 }}
            >
              <b style={{ color: 'var(--cx-text-sub)', fontWeight: 500 }}>Profile</b> ／ {p.name}
            </span>
            <div className="sp" style={{ flex: 1 }} />
            <button className="cx-dw-iconbtn" onClick={() => onStep(-1)}>
              <ChevLeft />
            </button>
            <button className="cx-dw-iconbtn" onClick={() => onStep(1)}>
              <ChevRight />
            </button>
            <button className="cx-dw-iconbtn" onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <div className="cx-dw-hero">
            <div
              className="logo sq"
              style={{
                background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <ClipIcon />
            </div>
            <div className="h-main" style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 19, fontWeight: 500 }}>{p.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
                <span className={`cx-lic-tag ${p.lic === 'platform' ? 'platform' : ''}`}>
                  {p.license}
                </span>
                <span className="cx-prof-tag">{p.users} 位使用者</span>
              </div>
              <div className="h-sub">{p.desc}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="cx-btn-sm pri" onClick={() => showToast('已開啟編輯面板')}>
                <EditIcon />
                編輯
              </button>
            </div>
          </div>
          <div className="cx-dw-tabs">
            {tabs.map((t, i) => (
              <div
                key={t}
                className={`cx-dw-tab ${state.tab === t ? 'on' : ''}`}
                onClick={() => onTabChange(t)}
              >
                {tabLabels[i]}
              </div>
            ))}
          </div>
        </div>
        <div className="cx-dw-body">
          {state.tab === 'objects' && (
            <>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>物件存取權限</h3>
                  <div className="sp" style={{ flex: 1 }} />
                  <span
                    className="add"
                    style={{
                      fontSize: 12,
                      color: 'var(--cx-accent)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onClick={() => showToast('已開啟編輯面板')}
                  >
                    <EditIcon />
                    編輯
                  </span>
                </div>
                <table className="cx-oa-tbl">
                  <thead>
                    <tr>
                      <th className="obj">物件</th>
                      <th>讀取</th>
                      <th>建立</th>
                      <th>編輯</th>
                      <th>刪除</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OBJECTS.map((o, oi) => {
                      const a = acc[oi];
                      return (
                        <tr key={o.api}>
                          <td className="obj">
                            {o.nm}
                            <div className="api">{o.api}</div>
                          </td>
                          {a.map((v, vi) => (
                            <td key={vi}>
                              {v ? (
                                <span className="cx-perm-yes">
                                  <CheckIcon />
                                </span>
                              ) : (
                                <span className="cx-perm-no">
                                  <XIcon />
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>系統權限</h3>
                  <span
                    className="sh-n"
                    style={{
                      fontSize: 11,
                      color: 'var(--cx-text-faint)',
                      background: 'var(--cx-bg)',
                      padding: '1px 8px',
                      borderRadius: 20,
                      fontWeight: 500,
                    }}
                  >
                    {p.sys.length}
                  </span>
                </div>
                <div className="cx-perm-list">
                  {p.sys.map((s) => (
                    <div key={s} className="cx-pl-row">
                      <div className="cx-pl-m">
                        <div className="n">{s}</div>
                      </div>
                      <span className="cx-perm-yes">
                        <CheckIcon />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {state.tab === 'fls' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>欄位層級安全性</h3>
                <div className="sp" style={{ flex: 1 }} />
                <span style={{ fontSize: '11.5px', color: 'var(--cx-text-faint)' }}>
                  物件：商機
                </span>
              </div>
              <div className="cx-perm-list">
                {[
                  [
                    '金額',
                    'Amount',
                    p.access === 'full' || p.access === 'rw'
                      ? '可編輯'
                      : p.access === 'ro'
                        ? '隱藏'
                        : '唯讀',
                  ],
                  [
                    '折扣百分比',
                    'Discount__c',
                    p.access === 'full' ? '可編輯' : p.access === 'ro' ? '隱藏' : '唯讀',
                  ],
                  ['預計關閉日', 'CloseDate', '可見'],
                  ['負責業務', 'OwnerId', p.access === 'ro' ? '唯讀' : '可見'],
                  ['成本', 'Cost__c', p.access === 'full' ? '可編輯' : '隱藏'],
                ].map(([nm, api, val]) => {
                  const cls = val === '隱藏' ? 'inactive' : val === '唯讀' ? 'pending' : 'active';
                  return (
                    <div key={api} className="cx-pl-row">
                      <div className="cx-pl-m">
                        <div className="n">{nm}</div>
                        <div className="d">{api}</div>
                      </div>
                      <span className={`cx-status ${cls}`}>
                        <span className="pip" />
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {state.tab === 'users' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>指派此 Profile 的使用者</h3>
                <span
                  className="sh-n"
                  style={{
                    fontSize: 11,
                    color: 'var(--cx-text-faint)',
                    background: 'var(--cx-bg)',
                    padding: '1px 8px',
                    borderRadius: 20,
                    fontWeight: 500,
                  }}
                >
                  {assigned.length}
                </span>
              </div>
              {assigned.length ? (
                assigned.map((u) => {
                  const r2 = ROLES[u.role];
                  return (
                    <div key={u.email} className="cx-assign-row">
                      <div className="av" style={{ background: GRAD[u.g] }}>
                        {u.av}
                      </div>
                      <div className="am">
                        <div className="n">{u.name}</div>
                        <div className="t">
                          {u.title} · {r2.name}
                        </div>
                      </div>
                      <button
                        className="x"
                        title="移除指派"
                        onClick={() => showToast('已移除指派')}
                      >
                        <XIcon />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: 'var(--cx-text-faint)',
                    fontSize: 12.5,
                  }}
                >
                  尚無使用者指派此 Profile
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  function PermSetContent() {
    const p = PERMSETS[state.index];
    const tabs = ['perms', 'users'];
    const tabLabels = ['啟用的權限', '指派使用者'];
    const assigned = (PERM_ASSIGNED[p.name] || []).map((idx) => USERS[idx]);

    return (
      <>
        <div className="cx-dw-top">
          <div className="cx-dw-bar">
            <span
              className="crumb"
              style={{ fontSize: '11.5px', color: 'var(--cx-text-faint)', fontWeight: 500 }}
            >
              <b style={{ color: 'var(--cx-text-sub)', fontWeight: 500 }}>Permission Set</b> ／{' '}
              {p.name}
            </span>
            <div className="sp" style={{ flex: 1 }} />
            <button className="cx-dw-iconbtn" onClick={() => onStep(-1)}>
              <ChevLeft />
            </button>
            <button className="cx-dw-iconbtn" onClick={() => onStep(1)}>
              <ChevRight />
            </button>
            <button className="cx-dw-iconbtn" onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <div className="cx-dw-hero">
            <div
              className="logo sq"
              style={{
                background: 'linear-gradient(135deg,#60a5fa,#2563eb)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <LockIcon />
            </div>
            <div className="h-main" style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: 19,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {p.name} <span className={`cx-type-tag ${p.type}`}>{p.typeL}</span>
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
                <span className="cx-prof-tag">{p.users} 位已指派</span>
              </div>
              <div className="h-sub">{p.desc}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="cx-btn-sm pri" onClick={() => showToast('已開啟編輯面板')}>
                <EditIcon />
                編輯
              </button>
            </div>
          </div>
          <div className="cx-dw-tabs">
            {tabs.map((t, i) => (
              <div
                key={t}
                className={`cx-dw-tab ${state.tab === t ? 'on' : ''}`}
                onClick={() => onTabChange(t)}
              >
                {tabLabels[i]}
              </div>
            ))}
          </div>
        </div>
        <div className="cx-dw-body">
          {state.tab === 'perms' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>此權限集啟用的權限</h3>
                <span
                  className="sh-n"
                  style={{
                    fontSize: 11,
                    color: 'var(--cx-text-faint)',
                    background: 'var(--cx-bg)',
                    padding: '1px 8px',
                    borderRadius: 20,
                    fontWeight: 500,
                  }}
                >
                  {p.perms.length}
                </span>
              </div>
              <div className="cx-perm-list">
                {p.perms.map(([name, desc, on]) => {
                  const k = `${p.name}::${name}`;
                  const active = toggleStates[k] ?? on;
                  return (
                    <div key={name} className="cx-pl-row">
                      <div className="cx-pl-m">
                        <div className="n">{name}</div>
                        <div className="d">{desc}</div>
                      </div>
                      <span
                        className={`cx-toggle ${active ? '' : 'off'}`}
                        onClick={() => onToggle(k)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {state.tab === 'users' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>已指派使用者</h3>
                <span
                  className="sh-n"
                  style={{
                    fontSize: 11,
                    color: 'var(--cx-text-faint)',
                    background: 'var(--cx-bg)',
                    padding: '1px 8px',
                    borderRadius: 20,
                    fontWeight: 500,
                  }}
                >
                  {assigned.length}
                </span>
                <div className="sp" style={{ flex: 1 }} />
                <span
                  className="add"
                  style={{
                    fontSize: 12,
                    color: 'var(--cx-accent)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  onClick={() => showToast('已開啟指派面板')}
                >
                  <PlusIcon />
                  指派
                </span>
              </div>
              {assigned.length ? (
                assigned.map((u) => {
                  const r2 = ROLES[u.role];
                  return (
                    <div key={u.email} className="cx-assign-row">
                      <div className="av" style={{ background: GRAD[u.g] }}>
                        {u.av}
                      </div>
                      <div className="am">
                        <div className="n">{u.name}</div>
                        <div className="t">
                          {u.title} · {r2.name}
                        </div>
                      </div>
                      <button
                        className="x"
                        title="移除指派"
                        onClick={() => showToast('已移除指派')}
                      >
                        <XIcon />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: 'var(--cx-text-faint)',
                    fontSize: 12.5,
                  }}
                >
                  尚無指派
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  function FlowContent() {
    const f = FLOWS[state.index];
    const on = flowOn[state.index] ?? f.on;
    const runs =
      (FLOW_RUNS as Record<number | 'default', RunEntry[]>)[state.index] ?? FLOW_RUNS.default;
    const vers =
      (FLOW_VERSIONS as Record<number | 'default', VerEntry[]>)[state.index] ??
      FLOW_VERSIONS.default;
    const okCount = runs.filter((r) => r.ok).length;
    const successRate = runs.length ? Math.round((okCount / runs.length) * 100) : 100;
    const trigInfo = FLOW_TRIGGER[f.trig];

    function TrigSvg({ k }: { k: FlowTrig | string }) {
      if (k === 'record')
        return (
          <>
            <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
          </>
        );
      if (k === 'schedule')
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </>
        );
      return (
        <>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </>
      );
    }
    function NodeSvg({ k }: { k: string }) {
      if (k === 'get')
        return (
          <>
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
            <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
          </>
        );
      if (k === 'decision') return <path d="M12 3 21 12l-9 9-9-9Z" />;
      if (k === 'update')
        return (
          <>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </>
        );
      if (k === 'create')
        return (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M12 8v8M8 12h8" />
          </>
        );
      if (k === 'action')
        return (
          <>
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </>
        );
      if (k === 'screen')
        return (
          <>
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </>
        );
      if (k === 'assign')
        return (
          <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="m16 11 2 2 4-4" />
          </>
        );
      return null;
    }
    const FKIND: Record<string, string> = {
      get: '取得記錄',
      update: '更新記錄',
      create: '建立記錄',
      action: '動作',
      screen: '畫面',
      assign: '指派',
      decision: '決策',
    };

    function FNode({ s }: { s: DiagramStep }) {
      if (s.start)
        return (
          <div className="cx-fnode start">
            <div className="cx-fic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <TrigSvg k={s.trig!} />
              </svg>
            </div>
            <div className="cx-ftx">
              <div className="fl">{trigInfo.kind}</div>
              <div className="ft">{s.label}</div>
              {s.sub && <div className="fs">{s.sub}</div>}
            </div>
          </div>
        );
      if (s.end)
        return (
          <div className={`cx-fnode end${s.stop ? ' stop' : ''}`}>
            <span className="ed" />
            <span className="et">{s.label}</span>
          </div>
        );
      const icCls = s.decision ? 'decision' : s.ic || '';
      return (
        <div className={`cx-fnode${s.decision ? ' decision-node' : ''}`}>
          <div className={`cx-fic ${icCls}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <NodeSvg k={icCls} />
            </svg>
          </div>
          <div className="cx-ftx">
            <div className="fl">{FKIND[icCls] || ''}</div>
            <div className="ft">{s.label}</div>
            {s.sub && <div className="fs">{s.sub}</div>}
          </div>
        </div>
      );
    }

    function FlowDiagram({ steps }: { steps: DiagramStep[] }) {
      return (
        <div className="cx-fdiag">
          {steps.map((s, i) => (
            <Fragment key={i}>
              {i > 0 && <div className="cx-fconn" />}
              <FNode s={s} />
              {s.decision && (
                <>
                  <div className="cx-fconn" />
                  <div className="cx-fbranches">
                    {s.yes && (
                      <div className="cx-flane">
                        <div className="cx-fblabel yes">是</div>
                        {s.yes.map((n, j) => (
                          <Fragment key={j}>
                            <div className="cx-fconn short" />
                            <FNode s={n} />
                          </Fragment>
                        ))}
                      </div>
                    )}
                    {s.no && (
                      <div className="cx-flane">
                        <div className="cx-fblabel no">否</div>
                        {s.no.map((n, j) => (
                          <Fragment key={j}>
                            <div className="cx-fconn short" />
                            <FNode s={n} />
                          </Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </Fragment>
          ))}
        </div>
      );
    }

    const tabDefs = [
      { key: 'overview', label: '概覽' },
      { key: 'versions', label: '版本' },
      { key: 'runs', label: '執行紀錄' },
    ];

    return (
      <>
        <div className="cx-dw-top">
          <div className="cx-dw-bar">
            <span
              className="crumb"
              style={{ fontSize: '11.5px', color: 'var(--cx-text-faint)', fontWeight: 500 }}
            >
              <b style={{ color: 'var(--cx-text-sub)', fontWeight: 500 }}>流程</b> ／ {f.name}
            </span>
            <div className="sp" style={{ flex: 1 }} />
            <button className="cx-dw-iconbtn" onClick={() => onStep(-1)}>
              <ChevLeft />
            </button>
            <button className="cx-dw-iconbtn" onClick={() => onStep(1)}>
              <ChevRight />
            </button>
            <button className="cx-dw-iconbtn" onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <div className="cx-dw-hero">
            <div
              className={`cx-fl-tic ${f.trig} logo sq`}
              style={{ width: 50, height: 50, borderRadius: 14 }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: 24, height: 24 }}
              >
                <TrigSvg k={f.trig} />
              </svg>
            </div>
            <div className="h-main" style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 17, fontWeight: 600 }}>{f.name}</h2>
              <div
                className="h-meta"
                style={{ display: 'flex', gap: 7, marginTop: 6, flexWrap: 'wrap' }}
              >
                <span className={`cx-fl-type-tag ${f.trig}`}>{trigInfo.tag}</span>
                <span className={`cx-status ${on ? 'active' : 'inactive'}`}>
                  {on ? '啟用' : '停用'}
                </span>
                {f.fail7 > 0 && (
                  <span
                    className="cx-status inactive"
                    style={{ background: '#FEF2F2', color: '#d6483f' }}
                  >
                    有失敗
                  </span>
                )}
              </div>
              <div className="h-sub">{f.desc}</div>
            </div>
          </div>
          <div className="cx-dw-tabs">
            {tabDefs.map((t) => (
              <div
                key={t.key}
                className={`cx-dw-tab ${state.tab === t.key ? 'on' : ''}`}
                onClick={() => onTabChange(t.key)}
              >
                {t.label}
              </div>
            ))}
          </div>
        </div>
        <div className="cx-dw-body">
          {state.tab === 'overview' && (
            <>
              <div className="cx-dw-kpi">
                <div className="k">
                  <div className="v">{f.runs7.toLocaleString()}</div>
                  <div className="l">近 7 日執行</div>
                </div>
                <div className="k">
                  <div className={`v${f.fail7 > 0 ? ' red' : ''}`}>{f.fail7}</div>
                  <div className="l">近 7 日失敗</div>
                </div>
                <div className="k">
                  <div className="v">v{f.ver}</div>
                  <div className="l">目前版本</div>
                </div>
              </div>
              {f.fail7 > 0 && (
                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: 10,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d6483f"
                    strokeWidth="2"
                    style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1 }}
                  >
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <div style={{ fontSize: 12.5, color: '#b91c1c', lineHeight: 1.5 }}>
                    近 7 日有 <b>{f.fail7}</b> 次執行失敗，請查閱執行紀錄以了解錯誤詳情。
                  </div>
                </div>
              )}
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>基本資訊</h3>
                </div>
                <div className="cx-info-grid">
                  <div className="cell">
                    <div className="cl">API Name</div>
                    <div className="cv" style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {f.api}
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">觸發類型</div>
                    <div className="cv">{trigInfo.lbl}</div>
                  </div>
                  <div className="cell full">
                    <div className="cl">關聯物件</div>
                    <div className="cv">{f.obj}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">最後修改</div>
                    <div className="cv">
                      {f.lm.name} · {f.lm.date}
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">狀態</div>
                    <div className="cv" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        className={`cx-fl-toggle${on ? '' : ' off'}`}
                        onClick={() => onFlowToggle(state.index)}
                      />
                      <span style={{ fontSize: 12.5, color: 'var(--cx-text-sub)' }}>
                        {on ? '啟用中' : '已停用'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>流程圖</h3>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <FlowDiagram steps={f.diagram} />
                </div>
              </div>
            </>
          )}
          {state.tab === 'runs' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>近期執行</h3>
              </div>
              <div style={{ padding: '14px 16px 10px' }}>
                <div style={{ fontSize: 12, color: 'var(--cx-text-sub)', marginBottom: 6 }}>
                  成功率 {successRate}%
                </div>
                <div className="cx-rate-bar">
                  <i style={{ width: `${successRate}%` }} />
                  {successRate < 100 && (
                    <span className="rb-fail" style={{ width: `${100 - successRate}%` }} />
                  )}
                </div>
              </div>
              {runs.map((r, i) => (
                <div key={i} className="cx-run-row">
                  <div className={`cx-run-st ${r.ok ? 'ok' : 'fail'}`}>
                    {r.ok ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                  </div>
                  <div className="cx-run-m">
                    <div className="rt">{r.t}</div>
                    <div className={`rd${r.ok ? '' : ' err'}`}>{r.d}</div>
                  </div>
                  <div className="cx-run-time">
                    {r.time}
                    <span className="dur">{r.dur}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {state.tab === 'versions' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>版本紀錄</h3>
              </div>
              {vers.map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: '13px 16px',
                    borderBottom: i < vers.length - 1 ? '1px solid var(--cx-border-soft)' : 'none',
                    display: 'flex',
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 500 }}>{v.v}</span>
                      {v.active && (
                        <span
                          className="cx-status active"
                          style={{ fontSize: 10, padding: '1px 7px' }}
                        >
                          使用中
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--cx-text-sub)', lineHeight: 1.4 }}>
                      {v.note}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'right',
                      flexShrink: 0,
                      fontSize: 11.5,
                      color: 'var(--cx-text-faint)',
                      lineHeight: 1.6,
                    }}
                  >
                    <div>{v.date}</div>
                    <div>{v.by}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  function BatchContent() {
    const b = BATCHES[state.index];
    const on = batchOn[state.index] ?? b.on;
    const src = IMP_SOURCE[b.src];
    const st = IMP_STATUS[b.status];
    const errs = IMP_ERRORS[state.index] || [];
    const mapping =
      (IMP_MAPPING as Record<number | 'default', MapRow[]>)[state.index] ?? IMP_MAPPING.default;
    const showErrTab = b.err > 0 || b.status === 'failed';
    const okCount = mapping.filter((m) => m[3] === 'ok').length;

    const IMP_SRC_ICON: Record<ImpSrc, React.ReactNode> = {
      csv: (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h2M8 17h2M14 13h2M14 17h2" />
        </>
      ),
      api: (
        <>
          <path d="M16 18 22 12 16 6" />
          <path d="M8 6 2 12 8 18" />
          <path d="m14 4-4 16" />
        </>
      ),
      manual: (
        <>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="M7 10l5 5 5-5M12 15V3" />
        </>
      ),
    };
    const SRC_BG: Record<ImpSrc, string> = { api: '#2563eb', manual: '#7c3aed', csv: '#16a34a' };

    const objShort = b.obj.split(' ')[0];
    const okV = b.status === 'failed' || b.status === 'queued' ? '—' : b.ok.toLocaleString();
    const errV = b.status === 'failed' || b.status === 'queued' ? '—' : String(b.err);

    function StatusBlock() {
      if (b.status === 'processing')
        return (
          <div className="cx-dw-sec" style={{ marginBottom: 14 }}>
            <div
              className="sh"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 16px',
                borderBottom: '1px solid var(--cx-border-soft)',
              }}
            >
              <h3 style={{ fontSize: 13, fontWeight: 700 }}>匯入進度</h3>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--cx-accent)' }}>
                {b.prog}%
              </span>
            </div>
            <div style={{ padding: '14px 16px 16px' }}>
              <div className="cx-rate-bar">
                <i
                  style={{
                    width: `${b.prog}%`,
                    background: 'linear-gradient(90deg,#60A5FA,#3B82F6)',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 8,
                  fontSize: 11.5,
                  color: 'var(--cx-text-faint)',
                }}
              >
                <span>
                  已處理 {b.ok.toLocaleString()} / {b.total.toLocaleString()} 筆
                </span>
                <span>預估剩餘 約 3 分鐘</span>
              </div>
            </div>
          </div>
        );
      if (b.status === 'queued')
        return (
          <div
            className="cx-disc-note"
            style={{
              borderLeftColor: 'var(--cx-accent)',
              background: 'var(--cx-accent-soft)',
              marginBottom: 14,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                color: 'var(--cx-accent)',
                width: 16,
                height: 16,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 7v5l3 2" />
            </svg>
            <div>
              此批次正在排隊中，待前一批次完成後將自動開始匯入 <b>{b.total.toLocaleString()}</b>{' '}
              筆資料。
            </div>
          </div>
        );
      if (b.status === 'failed')
        return (
          <div
            className="cx-disc-note"
            style={{
              borderLeftColor: 'var(--cx-danger)',
              background: 'var(--cx-danger-soft)',
              marginBottom: 14,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: '#d6483f', width: 16, height: 16, flexShrink: 0, marginTop: 1 }}
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>{b.failReason}</div>
          </div>
        );
      if (b.err > 0)
        return (
          <div
            className="cx-disc-note"
            style={{
              borderLeftColor: '#FB923C',
              background: 'var(--cx-warn-soft)',
              marginBottom: 14,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: '#c2691e', width: 16, height: 16, flexShrink: 0, marginTop: 1 }}
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              本次匯入有 <b>{b.err}</b> 筆失敗，請於「錯誤明細」檢視並修正後重新匯入。
            </div>
          </div>
        );
      return (
        <div
          className="cx-disc-note"
          style={{
            borderLeftColor: 'var(--cx-success)',
            background: 'var(--cx-success-soft)',
            marginBottom: 14,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: '#0f9b6c', width: 16, height: 16, flexShrink: 0, marginTop: 1 }}
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div>
            匯入完成，共成功 <b>{b.ok.toLocaleString()}</b> 筆
            {b.skip ? `，略過 ${b.skip} 筆重複` : ''}，耗時 {b.dur}。
          </div>
        </div>
      );
    }

    const records =
      (IMP_RECORDS as Record<number | 'default', ImpRecEntry[]>)[state.index] ??
      IMP_RECORDS.default;
    const tabDefs = [
      { key: 'overview', label: '概覽' },
      { key: 'records', label: '匯入記錄' },
      ...(showErrTab ? [{ key: 'errors', label: '錯誤明細' }] : []),
      { key: 'mapping', label: '欄位對應' },
    ];

    return (
      <>
        <div className="cx-dw-top">
          <div className="cx-dw-bar">
            <span
              className="crumb"
              style={{ fontSize: '11.5px', color: 'var(--cx-text-faint)', fontWeight: 500 }}
            >
              <b style={{ color: 'var(--cx-text-sub)', fontWeight: 500 }}>匯入批次</b> ／ {b.name}
            </span>
            <div className="sp" style={{ flex: 1 }} />
            <button className="cx-dw-iconbtn" onClick={() => onStep(-1)}>
              <ChevLeft />
            </button>
            <button className="cx-dw-iconbtn" onClick={() => onStep(1)}>
              <ChevRight />
            </button>
            <button className="cx-dw-iconbtn" onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <div className="cx-dw-hero">
            <div className="logo sq" style={{ background: SRC_BG[b.src] }}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                style={{ width: 23, height: 23 }}
              >
                {IMP_SRC_ICON[b.src]}
              </svg>
            </div>
            <div className="h-main" style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 17, fontWeight: 600 }}>{b.name}</h2>
              <div
                className="h-meta"
                style={{ display: 'flex', gap: 7, marginTop: 6, flexWrap: 'wrap' }}
              >
                <span className={`cx-status ${st.cls}`}>
                  <span className="pip" />
                  {st.lbl}
                </span>
                <span className="cx-prof-tag">{src.tag}</span>
                <span className="cx-prof-tag">{objShort}</span>
              </div>
              <div className="h-sub">
                {b.file} · {b.freq}
              </div>
            </div>
          </div>
          <div className="cx-dw-tabs">
            {tabDefs.map((t) => (
              <div
                key={t.key}
                className={`cx-dw-tab ${state.tab === t.key ? 'on' : ''}`}
                onClick={() => onTabChange(t.key)}
              >
                {t.label}
                {t.key === 'errors' && (
                  <span className="n">{b.status === 'failed' ? '!' : errs.length}</span>
                )}
                {t.key === 'mapping' && <span className="n">{okCount}</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="cx-dw-body">
          {state.tab === 'overview' && (
            <>
              <div className="cx-dw-kpi">
                <div className="k">
                  <div className="v">{b.total.toLocaleString()}</div>
                  <div className="l">來源總筆數</div>
                </div>
                <div className="k">
                  <div className="v" style={{ color: '#0f9b6c' }}>
                    {okV}
                  </div>
                  <div className="l">成功匯入</div>
                </div>
                <div className="k">
                  <div className={`v${b.err > 0 ? ' red' : ''}`}>{errV}</div>
                  <div className="l">失敗</div>
                </div>
              </div>
              <StatusBlock />
              <div className="cx-dw-sec">
                <div className="sh">
                  <h3>批次資訊</h3>
                </div>
                <div className="cx-info-grid">
                  <div className="cell full">
                    <div className="cl">來源檔案 / 端點</div>
                    <div className="cv" style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {b.file}
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">目標物件</div>
                    <div className="cv">{objShort}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">匯入方式</div>
                    <div className="cv">{src.tag}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">頻率</div>
                    <div className="cv">{b.freq}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">略過重複</div>
                    <div className="cv">{b.skip ? `${b.skip} 筆` : '0 筆'}</div>
                  </div>
                  <div className="cell">
                    <div className="cl">執行者</div>
                    <div className="cv">
                      {b.by.name} · {b.by.date}
                    </div>
                  </div>
                  <div className="cell">
                    <div className="cl">耗時</div>
                    <div className="cv">{b.dur}</div>
                  </div>
                </div>
              </div>
            </>
          )}
          {state.tab === 'records' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>匯入記錄</h3>
                <span className="sh-n">{records.length}</span>
                <div style={{ flex: 1 }} />
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--cx-accent)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  onClick={() => showToast('已匯出完整記錄 CSV')}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ width: 13, height: 13 }}
                  >
                    <path d="M12 15V3M7 8l5-5 5 5" />
                    <path d="M5 21h14" />
                  </svg>
                  匯出
                </span>
              </div>
              <table className="cx-map-tbl">
                <thead>
                  <tr>
                    <th>記錄 ID</th>
                    <th>名稱</th>
                    <th>狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={i}>
                      <td className="src">{r.id}</td>
                      <td>{r.name}</td>
                      <td>
                        {r.status === 'ok' ? (
                          <span className="cx-status active" style={{ fontSize: 11 }}>
                            <span className="pip" />
                            成功
                          </span>
                        ) : r.status === 'skip' ? (
                          <span style={{ fontSize: 11.5, color: 'var(--cx-text-faint)' }}>
                            {r.note || '略過'}
                          </span>
                        ) : (
                          <span style={{ fontSize: 11.5, color: '#d6483f' }}>
                            {r.note || '失敗'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '10px 16px', fontSize: 11.5, color: 'var(--cx-text-faint)' }}>
                顯示前 {records.length} 筆 · 完整清單請匯出 CSV
              </div>
            </div>
          )}
          {state.tab === 'errors' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>錯誤明細</h3>
                {b.status !== 'failed' && <span className="sh-n">{errs.length}</span>}
                <div style={{ flex: 1 }} />
                <span
                  className="add"
                  style={{
                    fontSize: 12,
                    color: 'var(--cx-accent)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  onClick={() => showToast('已匯出錯誤清單')}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ width: 13, height: 13 }}
                  >
                    <path d="M12 15V3M7 8l5-5 5 5" />
                    <path d="M5 21h14" />
                  </svg>
                  匯出錯誤清單
                </span>
              </div>
              {b.status === 'failed' ? (
                <div style={{ padding: '16px' }}>
                  <div className="cx-run-row" style={{ border: 'none', padding: 0 }}>
                    <div className="cx-run-st fail">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                    <div className="cx-run-m">
                      <div className="rt">匯入未啟動</div>
                      <div className="rd err">{b.failReason}</div>
                    </div>
                  </div>
                </div>
              ) : (
                errs.map((er, i) => (
                  <div key={i} className="cx-run-row">
                    <div className="cx-run-st fail">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                    <div className="cx-run-m">
                      <div className="rt">
                        第 {er.row} 列 · {er.id}
                      </div>
                      <div className="rd err">{er.reason}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {state.tab === 'mapping' && (
            <div className="cx-dw-sec">
              <div className="sh">
                <h3>欄位對應</h3>
                <span className="sh-n">{okCount}</span>
                <div style={{ flex: 1 }} />
                <span
                  className="add"
                  style={{
                    fontSize: 12,
                    color: 'var(--cx-accent)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  onClick={() => showToast('已開啟欄位對應編輯')}
                >
                  <EditIcon />
                  編輯對應
                </span>
              </div>
              <table className="cx-map-tbl">
                <thead>
                  <tr>
                    <th>來源欄位</th>
                    <th></th>
                    <th>目標欄位</th>
                  </tr>
                </thead>
                <tbody>
                  {mapping.map((m, i) =>
                    m[3] === 'skip' ? (
                      <tr key={i}>
                        <td className="src">{m[0]}</td>
                        <td className="arr">
                          <ChevRight />
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: 11,
                              color: 'var(--cx-text-faint)',
                              fontStyle: 'italic',
                            }}
                          >
                            略過 — 不匯入
                          </span>
                        </td>
                      </tr>
                    ) : (
                      <tr key={i}>
                        <td className="src">{m[0]}</td>
                        <td className="arr">
                          <ChevRight />
                        </td>
                        <td>
                          <div className="tgt">
                            {m[1]}
                            <div className="api">{m[2]}</div>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="cx-drawer-scrim open" onClick={onClose} />
      <aside className="cx-drawer open">
        {state.type === 'user' && UserContent()}
        {state.type === 'profile' && ProfileContent()}
        {state.type === 'permset' && PermSetContent()}
        {state.type === 'flow' && FlowContent()}
        {state.type === 'batch' && BatchContent()}
      </aside>
    </>
  );
}

// ── Main Settings component ───────────────────────────────────────────────────

export default function Settings({ showToast }: { showToast: (msg: string) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const _segs = pathname
    .replace(/^\/settings\/?/, '')
    .split('/')
    .filter(Boolean);
  const _first = _segs[0] ?? '';
  const activeTab =
    _first === 'objects' && _segs.length >= 2
      ? 'fields'
      : _first === 'import' && _segs[1] === 'importwizard'
        ? 'importwizard'
        : _first || 'hub';
  const selectedObjApi = _first === 'objects' && _segs.length >= 2 ? _segs[1] : '';
  const setActiveTab = (tab: string) => {
    if (tab === 'fields') {
      router.push(`/settings/objects/${selectedObjApi || OBJ_ITEMS[0].api}`);
      return;
    }
    const PATH: Record<string, string> = {
      hub: '/settings',
      users: '/settings/users',
      roles: '/settings/roles',
      profiles: '/settings/profiles',
      permsets: '/settings/permsets',
      discount: '/settings/discount',
      objects: '/settings/objects',
      importwizard: '/settings/import/importwizard',
    };
    router.push(PATH[tab] ?? `/settings/${tab}`);
  };
  const [hubSearch, setHubSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [drawer, setDrawer] = useState<DrawerState>({
    open: false,
    type: 'user',
    index: 0,
    tab: 'overview',
  });
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});
  const [objTab, setObjTab] = useState<'std' | 'custom'>('std');
  const [fieldTab, setFieldTab] = useState('fields');
  const [fieldSearch, setFieldSearch] = useState('');

  const [flowOn, setFlowOn] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(FLOWS.map((f, i) => [i, f.on]))
  );
  const [batchOn, setBatchOn] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(BATCHES.map((b, i) => [i, b.on]))
  );

  const openUser = useCallback(
    (i: number) => setDrawer({ open: true, type: 'user', index: i, tab: 'overview' }),
    []
  );
  const openProfile = useCallback(
    (i: number) => setDrawer({ open: true, type: 'profile', index: i, tab: 'objects' }),
    []
  );
  const openPermSet = useCallback(
    (i: number) => setDrawer({ open: true, type: 'permset', index: i, tab: 'perms' }),
    []
  );
  const openFlow = useCallback(
    (i: number) => setDrawer({ open: true, type: 'flow', index: i, tab: 'overview' }),
    []
  );
  const openBatch = useCallback(
    (i: number) => setDrawer({ open: true, type: 'batch', index: i, tab: 'overview' }),
    []
  );
  const closeDrawer = useCallback(() => setDrawer((d) => ({ ...d, open: false })), []);
  const stepDrawer = useCallback((d: number) => {
    setDrawer((prev) => {
      const len =
        prev.type === 'user'
          ? USERS.length
          : prev.type === 'profile'
            ? PROFILES.length
            : prev.type === 'flow'
              ? FLOWS.length
              : prev.type === 'batch'
                ? BATCHES.length
                : PERMSETS.length;
      const ni = (prev.index + d + len) % len;
      const tab =
        prev.type === 'user'
          ? 'overview'
          : prev.type === 'profile'
            ? 'objects'
            : prev.type === 'flow' || prev.type === 'batch'
              ? 'overview'
              : 'perms';
      return { ...prev, index: ni, tab };
    });
  }, []);
  const changeTab = useCallback((tab: string) => setDrawer((d) => ({ ...d, tab })), []);
  const handleToggle = useCallback((key: string) => {
    setToggleStates((prev) => ({ ...prev, [key]: !(prev[key] ?? true) }));
  }, []);
  const handleFlowToggle = useCallback((i: number) => {
    setFlowOn((prev) => ({ ...prev, [i]: !prev[i] }));
  }, []);
  const handleBatchToggle = useCallback(
    (i: number) => {
      setBatchOn((prev) => ({ ...prev, [i]: !prev[i] }));
      showToast(`「${BATCHES[i].name}」排程已${batchOn[i] ? '暫停' : '啟用'}`);
    },
    [batchOn]
  );

  const filteredUsers = USERS.filter(
    (u) => u.name.includes(userSearch) || u.email.includes(userSearch)
  );

  const filteredGroups = hubSearch
    ? NAV_GROUPS.map((g) => ({
        ...g,
        items: g.items.filter((it) => it.label.toLowerCase().includes(hubSearch.toLowerCase())),
      })).filter((g) => g.items.length > 0)
    : NAV_GROUPS;

  // active/pending/inactive counts
  const activeCount = USERS.filter((u) => u.status === 'active').length;
  const pendingCount = USERS.filter((u) => u.status === 'pending').length;

  function toggleRow(i: number) {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }
  function toggleAll() {
    if (selectedRows.size === USERS.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(USERS.map((_, i) => i)));
  }

  // ── Hub panel ──────────────────────────────────────────────────────────────
  function HubPanel() {
    return (
      <div>
        <div className="cx-crumbs">
          <span>設定</span>
        </div>
        <div className="cx-set-head">
          <div>
            <h1>設定中心</h1>
            <div className="sub">
              管理使用者、物件與欄位、介面、自動化與系統整合。以下為各設定模組入口。
            </div>
          </div>
        </div>
        <div className="cx-hub-search">
          <IconSearch />
          <input
            type="text"
            placeholder="快速尋找設定…（例如：使用者、Profile、Flow、API）"
            value={hubSearch}
            onChange={(e) => setHubSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') showToast(`搜尋設定：${hubSearch || '（空白）'}`);
            }}
          />
        </div>
        <div className="cx-hub-recent">
          <span className="lab">最近使用</span>
          <span className="cx-hub-chip" onClick={() => setActiveTab('users')}>
            <UserGrpIcon />
            使用者清單與角色指派
          </span>
          <span className="cx-hub-chip" onClick={() => setActiveTab('profiles')}>
            <ClipIcon />
            Profile 管理
          </span>
          <span className="cx-hub-chip" onClick={() => setActiveTab('discount')}>
            <IconSettingsCenter />
            角色折扣上限
          </span>
        </div>
        <div className="cx-hub-grid">
          {filteredGroups.map((g, gi) => (
            <div key={gi} className="cx-hub-card">
              <div className="cx-hc-head">
                <div className={`cx-hc-ic ${HUB_ICON_CLS[gi % 5]}`}>{g.icon}</div>
                <div className="cx-hc-ht">
                  <h3>{g.label}</h3>
                  <div className="s">{g.items.length} 個設定項目</div>
                </div>
              </div>
              <div className="cx-hc-items">
                {g.items.map((item) => (
                  <div key={item.key} className="cx-hc-item" onClick={() => setActiveTab(item.key)}>
                    <span className="cx-hc-dotpt" />
                    {item.label}
                    {item.ph ? (
                      <span className="cx-hc-soon">設計中</span>
                    ) : (
                      <span className="cx-hc-chev">
                        <ChevRight />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Users panel ───────────────────────────────────────────────────────────
  function UsersPanel() {
    const allSel = selectedRows.size === USERS.length;
    return (
      <div>
        <div className="cx-crumbs">
          <a onClick={() => setActiveTab('hub')}>設定</a>
          <ChevRight />
          <span>使用者管理</span>
          <ChevRight />
          <span>使用者清單與角色指派</span>
        </div>
        <div className="cx-set-head">
          <div>
            <h1>使用者清單與角色指派</h1>
            <div className="sub">
              管理系統使用者、指派角色與 Profile、套用 Permission Set。點擊任一列檢視與編輯指派。
            </div>
          </div>
          <div className="actions">
            <button className="cx-btn-outline" onClick={() => showToast('已匯出使用者清單 CSV')}>
              <ExportIcon />
              匯出
            </button>
            <button className="cx-btn-navy" onClick={() => showToast('已開啟「新增使用者」面板')}>
              <PlusIcon />
              新增使用者
            </button>
          </div>
        </div>

        {/* Stat bar */}
        <div className="cx-stat-bar">
          <div className="cx-stat">
            <div className="cx-sic blue">
              <UserGrpIcon />
            </div>
            <div>
              <div className="cx-snum">{USERS.length}</div>
              <div className="cx-slbl">全部使用者</div>
            </div>
          </div>
          <div className="cx-stat">
            <div className="cx-sic green">
              <CheckCircle />
            </div>
            <div>
              <div className="cx-snum green">{activeCount}</div>
              <div className="cx-slbl">啟用中</div>
            </div>
          </div>
          <div className="cx-stat">
            <div className="cx-sic" style={{ background: '#EDE9FE', color: '#6d28d9' }}>
              <LicIcon />
            </div>
            <div>
              <div className="cx-snum">
                {USERS.length}{' '}
                <small style={{ fontSize: 13, color: 'var(--cx-text-faint)', fontWeight: 500 }}>
                  / 25
                </small>
              </div>
              <div className="cx-slbl">授權席次已使用</div>
            </div>
          </div>
          <div className="cx-stat">
            <div className="cx-sic orange">
              <ClockIcon />
            </div>
            <div>
              <div className="cx-snum" style={{ color: '#ea7a1e' }}>
                {pendingCount}
              </div>
              <div className="cx-slbl">待啟用</div>
            </div>
          </div>
        </div>

        {/* Filter row */}
        <div className="cx-filter-row">
          <div className="cx-fpill">
            <span className="fl">角色</span>
            <select onChange={(e) => showToast('已套用篩選 · 角色：' + e.target.value)}>
              <option>全部角色</option>
              {Object.values(ROLES).map((r) => (
                <option key={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="cx-fpill">
            <span className="fl">狀態</span>
            <select onChange={(e) => showToast('已套用篩選 · 狀態：' + e.target.value)}>
              <option>全部</option>
              <option>啟用中</option>
              <option>停用</option>
              <option>待啟用</option>
            </select>
          </div>
          <div className="cx-fsearch">
            <IconSearch />
            <input
              type="text"
              placeholder="搜尋姓名或 Email…"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>
          <div className="cx-filter-count">
            共 <b>{filteredUsers.length}</b> 位
          </div>
        </div>

        {/* Table */}
        <div className="cx-data-card">
          <table className="cx-dt">
            <colgroup>
              <col style={{ width: 42 }} />
              <col />
              <col style={{ width: 120 }} />
              <col style={{ width: 108 }} />
              <col style={{ width: 188 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 48 }} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <div className={`cx-chk ${allSel ? 'on' : ''}`} onClick={toggleAll}>
                    {allSel && <CheckIcon />}
                  </div>
                </th>
                <th>使用者</th>
                <th>角色</th>
                <th>Profile</th>
                <th>Permission Sets</th>
                <th>狀態</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, idx) => {
                const r = ROLES[u.role];
                const origIdx = USERS.indexOf(u);
                const sel = selectedRows.has(origIdx);
                return (
                  <tr key={u.email} className={sel ? 'sel' : ''} onClick={() => openUser(origIdx)}>
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(origIdx);
                      }}
                    >
                      <div className={`cx-chk ${sel ? 'on' : ''}`}>{sel && <CheckIcon />}</div>
                    </td>
                    <td>
                      <div className="cx-u-id">
                        <div className="cx-u-av" style={{ background: GRAD[u.g] }}>
                          {u.av}
                        </div>
                        <div className="txt">
                          <div className="nm">{u.name}</div>
                          <div className="em">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="cx-role-tag">
                        <span className="rk" style={{ background: r.color }} />
                        {r.name}
                      </span>
                    </td>
                    <td>
                      <span className="cx-prof-tag">{u.profile}</span>
                    </td>
                    <td>
                      <PermChips perms={u.perms} />
                    </td>
                    <td>
                      <StatusBadge s={u.status} />
                    </td>
                    <td>
                      <div className="cx-row-arr">
                        <ChevRight />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="cx-pager">
            <div className="info">
              顯示 <b>1–{filteredUsers.length}</b> 位，共 <b>{filteredUsers.length}</b> 位
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--cx-text-sub)' }}>每頁 25 筆</div>
          </div>
        </div>
      </div>
    );
  }

  // ── Profiles panel ────────────────────────────────────────────────────────
  function ProfilesPanel() {
    return (
      <div>
        <div className="cx-crumbs">
          <a onClick={() => setActiveTab('hub')}>設定</a>
          <ChevRight />
          <span>使用者管理</span>
          <ChevRight />
          <span>Profile 管理</span>
        </div>
        <div className="cx-set-head">
          <div>
            <h1>Profile 管理</h1>
            <div className="sub">
              Profile 定義使用者可存取的物件、欄位與系統權限基準。點擊檢視物件存取與欄位層級安全性。
            </div>
          </div>
          <div className="actions">
            <button className="cx-btn-navy" onClick={() => showToast('已開啟「新增 Profile」面板')}>
              <PlusIcon />
              新增 Profile
            </button>
          </div>
        </div>
        <div className="cx-card-grid">
          {PROFILES.map((p, i) => (
            <div key={p.name} className="cx-obj-card" onClick={() => openProfile(i)}>
              <div className="cx-oc-head">
                <div className="cx-oc-ic">
                  <ClipIcon />
                </div>
                <div className="cx-oc-oh">
                  <div className="t">{p.name}</div>
                  <div className="s">
                    {p.access === 'full' ? '完整存取' : p.access === 'ro' ? '唯讀' : '物件讀寫'}
                  </div>
                </div>
                <div className="cx-oc-arr">
                  <ChevRight />
                </div>
              </div>
              <div className="cx-oc-desc">{p.desc}</div>
              <div className="cx-oc-foot">
                <span className="cx-oc-meta">
                  <UserGrpIcon />
                  <b>{p.users}</b> 位使用者
                </span>
                <span className={`cx-lic-tag ${p.lic === 'platform' ? 'platform' : ''}`}>
                  {p.license}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Permission Sets panel ─────────────────────────────────────────────────
  function PermSetsPanel() {
    return (
      <div>
        <div className="cx-crumbs">
          <a onClick={() => setActiveTab('hub')}>設定</a>
          <ChevRight />
          <span>使用者管理</span>
          <ChevRight />
          <span>Permission Set 指派</span>
        </div>
        <div className="cx-set-head">
          <div>
            <h1>Permission Set 指派</h1>
            <div className="sub">
              Permission Set 可在 Profile
              基準之上，疊加授予個別使用者額外權限。點擊檢視已啟用權限與指派名單。
            </div>
          </div>
          <div className="actions">
            <button
              className="cx-btn-navy"
              onClick={() => showToast('已開啟「新增 Permission Set」面板')}
            >
              <PlusIcon />
              新增 Permission Set
            </button>
          </div>
        </div>
        <div className="cx-card-grid">
          {PERMSETS.map((p, i) => {
            const assigned = (PERM_ASSIGNED[p.name] || []).slice(0, 4);
            return (
              <div key={p.name} className="cx-obj-card" onClick={() => openPermSet(i)}>
                <div className="cx-oc-head">
                  <div className="cx-oc-ic">
                    <LockIcon />
                  </div>
                  <div className="cx-oc-oh">
                    <div className="t">
                      {p.name} <span className={`cx-type-tag ${p.type}`}>{p.typeL}</span>
                    </div>
                    <div className="s">{p.perms.length} 項權限</div>
                  </div>
                  <div className="cx-oc-arr">
                    <ChevRight />
                  </div>
                </div>
                <div className="cx-oc-desc">{p.desc}</div>
                <div className="cx-oc-foot">
                  <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 6 }}>
                    {assigned.map((idx) => (
                      <div
                        key={idx}
                        className="cx-u-av"
                        style={{
                          width: 24,
                          height: 24,
                          fontSize: 10,
                          background: GRAD[USERS[idx].g],
                          marginLeft: -6,
                          border: '1.5px solid #fff',
                        }}
                      >
                        {USERS[idx].av}
                      </div>
                    ))}
                  </div>
                  <span className="cx-oc-meta" style={{ marginLeft: 'auto' }}>
                    <b>{p.users}</b> 位已指派
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Objects panel ─────────────────────────────────────────────────────────
  function ObjectsPanel() {
    const filtered = OBJ_ITEMS.filter((o) => (objTab === 'std' ? o.std : !o.std));
    const stdCount = OBJ_ITEMS.filter((o) => o.std).length;
    const cusCount = OBJ_ITEMS.filter((o) => !o.std).length;

    return (
      <div>
        <div className="cx-crumbs">
          <a onClick={() => setActiveTab('hub')}>設定</a>
          <ChevRight />
          <span>物件與欄位</span>
          <ChevRight />
          <span>物件管理員</span>
        </div>
        <div className="cx-set-head">
          <div>
            <h1>物件管理員</h1>
            <div className="sub">管理標準與自訂物件 — 定義欄位、頁面版面、觸發程序與驗證規則。</div>
          </div>
          <div className="actions">
            <button className="cx-btn-navy" onClick={() => showToast('已開啟「新增自訂物件」精靈')}>
              <PlusIcon />
              新增自訂物件
            </button>
          </div>
        </div>

        <div className="cx-seg" style={{ marginBottom: 18 }}>
          <button className={objTab === 'std' ? 'on' : ''} onClick={() => setObjTab('std')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="8" ry="3" />
              <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
              <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
            </svg>
            標準物件
            <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 2 }}>({stdCount})</span>
          </button>
          <button className={objTab === 'custom' ? 'on' : ''} onClick={() => setObjTab('custom')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
            自訂物件
            <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 2 }}>({cusCount})</span>
          </button>
        </div>

        <div className="cx-data-card">
          <table className="cx-dt">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col style={{ width: 48 }} />
            </colgroup>
            <thead>
              <tr>
                <th>物件</th>
                <th>API Name</th>
                <th>類型</th>
                <th>紀錄數</th>
                <th>欄位</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((obj) => {
                const ic = OBJ_ICON_STYLE[obj.g];
                return (
                  <tr key={obj.api} onClick={() => router.push(`/settings/objects/${obj.api}`)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <div
                          className="cx-omgmt-icon"
                          style={{
                            background: ic.bg,
                            color: ic.color,
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            fontSize: 13,
                            flexShrink: 0,
                          }}
                        >
                          {obj.icon}
                        </div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{obj.nm}</div>
                      </div>
                    </td>
                    <td
                      style={{
                        fontFamily: 'monospace',
                        fontSize: 11.5,
                        color: 'var(--cx-text-sub)',
                      }}
                    >
                      {obj.api}
                    </td>
                    <td>
                      <span className={`cx-tag-inline${!obj.std ? ' custom' : ''}`}>
                        {obj.std ? '標準' : '自訂'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--cx-text-sub)' }}>{obj.records.toLocaleString()}</td>
                    <td style={{ color: 'var(--cx-text-sub)', fontSize: 12.5 }}>
                      {obj.fields} 個
                      {obj.customFields > 0 && (
                        <span style={{ color: 'var(--cx-text-faint)', marginLeft: 4 }}>
                          ({obj.customFields} 自訂)
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="cx-row-arr">
                        <ChevRight />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="cx-pager">
            <div className="info">
              共 <b>{filtered.length}</b> 個{objTab === 'std' ? '標準' : '自訂'}物件
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Fields panel ───────────────────────────────────────────────────────────
  function FieldsPanel() {
    const obj = OBJ_ITEMS.find((o) => o.api === selectedObjApi) ?? OBJ_ITEMS[0];
    const fd = FIELDS_DATA[obj.api] ?? { total: obj.fields, custom: obj.customFields, rows: [] };
    const ic = OBJ_ICON_STYLE[obj.g];

    const filteredRows = fd.rows.filter(
      (r) =>
        !fieldSearch ||
        r.label.toLowerCase().includes(fieldSearch.toLowerCase()) ||
        r.api.toLowerCase().includes(fieldSearch.toLowerCase())
    );

    return (
      <div>
        {/* 麵包屑 */}
        <div className="cx-crumbs">
          <a onClick={() => setActiveTab('hub')}>設定</a>
          <ChevRight />
          <span>物件與欄位</span>
          <ChevRight />
          <a onClick={() => setActiveTab('objects')}>物件管理員</a>
          <ChevRight />
          <span>{obj.nm}</span>
        </div>

        {/* 標頭與動作按鈕 */}
        <div className="cx-set-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              className="cx-omgmt-icon"
              style={{
                background: ic.bg,
                color: ic.color,
                width: 46,
                height: 46,
                borderRadius: 13,
                fontSize: 17,
                flexShrink: 0,
              }}
            >
              {obj.icon}
            </div>
            <div>
              <h1 style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                {obj.nm}
                <span style={{ fontSize: 14, color: 'var(--cx-text-faint)', fontWeight: 400 }}>
                  ({obj.api})
                </span>
              </h1>
              <div className="sub">管理 {obj.nm} 物件的欄位定義、資料類型與欄位層級安全性。</div>
            </div>
          </div>
          <div className="actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              className="cx-btn-outline"
              onClick={() => setActiveTab('objects')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <ChevLeft /> 物件管理員
            </button>
            <button className="cx-btn-navy" onClick={() => showToast('已開啟「新增欄位」精靈')}>
              <PlusIcon />
              新增欄位
            </button>
          </div>
        </div>

        {/* 篩選與搜尋列 */}
        <div className="cx-filter-row">
          <div className="cx-fsearch" style={{ flex: 1, maxWidth: 280 }}>
            <IconSearch />
            <input
              type="text"
              placeholder="篩選欄位名稱或 API…"
              value={fieldSearch}
              onChange={(e) => setFieldSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div className="cx-filter-count">
            共 <b>{filteredRows.length}</b> 個欄位
          </div>
        </div>

        {/* 資料表格 */}
        <div className="cx-data-card">
          <table className="cx-dt">
            <colgroup>
              <col style={{ width: '28%' }} />
              <col style={{ width: '28%' }} />
              <col style={{ width: '22%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '8%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>欄位標籤</th>
                <th>API 名稱</th>
                <th>資料類型</th>
                <th>類型</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.api} onClick={() => showToast(`開啟欄位：${row.label}`)}>
                  <td style={{ fontWeight: 500, color: 'var(--cx-accent)', cursor: 'pointer' }}>
                    {row.label}
                  </td>
                  <td
                    style={{ fontFamily: 'monospace', fontSize: 11.5, color: 'var(--cx-text-sub)' }}
                  >
                    {row.api}
                  </td>
                  <td style={{ color: 'var(--cx-text-sub)', fontSize: 12.5 }}>{row.type}</td>
                  <td>
                    <span
                      className={`cx-field-status ${row.status === 'CUSTOM' ? 'custom' : 'std'}`}
                    >
                      {row.status === 'CUSTOM' ? '自訂' : '標準'}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--cx-accent)',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(`編輯欄位：${row.label}`);
                      }}
                    >
                      Edit
                    </span>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr className="no-hover">
                  <td
                    colSpan={5}
                    style={{
                      textAlign: 'center',
                      padding: '28px 0',
                      color: 'var(--cx-text-faint)',
                      fontSize: 13,
                    }}
                  >
                    找不到符合的欄位
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 分頁器 */}
          <div className="cx-pager">
            <div className="info">
              顯示 <b>1–{filteredRows.length}</b>，共 <b>{fd.total}</b> 個欄位
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="cx-pg nav" disabled>
                <ChevLeft />
              </button>
              <button className="cx-pg nav" onClick={() => showToast('下一頁')}>
                <ChevRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Placeholder panel ─────────────────────────────────────────────────────
  function PlaceholderPanel() {
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
          <a onClick={() => setActiveTab('hub')}>設定</a>
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

  // ── Render ────────────────────────────────────────────────────────────────
  const isFullPanel = [
    'hub',
    'users',
    'roles',
    'profiles',
    'permsets',
    'discount',
    'objects',
    'fields',
    'flow',
    'import',
    'importwizard',
    'pagelayout',
    'email',
  ].includes(activeTab);

  return (
    <>
      <div className="cx-settings-shell">
        {/* ── Left Navigation Rail (DO NOT CHANGE) ── */}
        <nav className="cx-set-nav">
          <div
            className={`cx-sn-home ${activeTab === 'hub' ? 'active' : ''}`}
            onClick={() => setActiveTab('hub')}
          >
            <div className="cx-h-ic">
              <IconSettingsCenter />
            </div>
            <div className="cx-h-tx">
              <div className="t">設定中心</div>
              <div className="s">所有設定模組</div>
            </div>
          </div>

          {NAV_GROUPS.map((group, groupIdx) => (
            <div className="cx-set-group" key={groupIdx}>
              <div className="cx-set-group-label">
                {group.icon}
                {group.label}
              </div>
              {group.items.map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <div
                    key={item.key}
                    className={`cx-sn-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.key)}
                  >
                    <span className="cx-sn-lab">{item.label}</span>
                    {item.ph && <span className="cx-ph-dot" title="設計中" />}
                    {item.cnt && <span className="cnt">{item.cnt}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Right Content Pane ── */}
        <div className="cx-set-content">
          <div className="cx-set-inner">
            {activeTab === 'hub' && <HubPanel />}
            {activeTab === 'users' && <UsersPanel />}
            {activeTab === 'roles' && (
              <RolesPanel showToast={showToast} onNavigate={setActiveTab} />
            )}
            {activeTab === 'profiles' && <ProfilesPanel />}
            {activeTab === 'permsets' && <PermSetsPanel />}
            {activeTab === 'discount' && (
              <DiscountPanel showToast={showToast} onNavigate={setActiveTab} />
            )}
            {activeTab === 'objects' && <ObjectsPanel />}
            {activeTab === 'fields' && <FieldsPanel />}
            {activeTab === 'flow' && (
              <FlowPanel
                showToast={showToast}
                flowOn={flowOn}
                onOpenFlow={openFlow}
                onFlowToggle={handleFlowToggle}
              />
            )}
            {activeTab === 'import' && (
              <ImportPanel
                showToast={showToast}
                onNavigate={setActiveTab}
                batchOn={batchOn}
                onOpenBatch={openBatch}
              />
            )}
            {activeTab === 'importwizard' && (
              <ImportWizardPanel showToast={showToast} onNavigate={setActiveTab} />
            )}
            {activeTab === 'pagelayout' && (
              <PageLayoutPanel showToast={showToast} onNavigate={setActiveTab} />
            )}
            {activeTab === 'email' && (
              <EmailPanel showToast={showToast} onNavigate={setActiveTab} />
            )}
            {!isFullPanel && <PlaceholderPanel />}
          </div>
        </div>
      </div>

      <DetailDrawer
        state={drawer}
        onClose={closeDrawer}
        onStep={stepDrawer}
        onTabChange={changeTab}
        showToast={showToast}
        toggleStates={toggleStates}
        onToggle={handleToggle}
        flowOn={flowOn}
        onFlowToggle={handleFlowToggle}
        batchOn={batchOn}
        onBatchToggle={handleBatchToggle}
      />
    </>
  );
}
