'use client';

import { useState, useCallback, useRef, Fragment } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IconSearch } from './icons';

// ── Icons ─────────────────────────────────────────────────────────────────────
function ChevRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
function ChevLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8M7 3v5h8" />
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 15V3M7 8l5-5 5 5" />
      <path d="M5 21h14" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}
function ClipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function LoginIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="m10 17 5-5-5-5M15 12H3" />
    </svg>
  );
}
function UserGrpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.5a3.2 3.2 0 0 1 0 6" />
      <path d="M17.5 14.5a5.5 5.5 0 0 1 3 5" />
    </svg>
  );
}
function CheckCircle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" />
      <path d="M22 4 12 14.1l-3-3" />
    </svg>
  );
}
function LicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function IconSettingsCenter() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M5 5l2 2M17 17l2 2M2 12h3M19 12h3M5 19l2-2M17 7l2-2" />
    </svg>
  );
}
function IconGroupUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.5a3.2 3.2 0 0 1 0 6" />
      <path d="M17.5 14.5a5.5 5.5 0 0 1 3 5" />
    </svg>
  );
}
function IconGroupObjects() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </svg>
  );
}
function IconGroupUI() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}
function IconGroupAuto() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
    </svg>
  );
}
function IconGroupIntegration() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-10 0Z" />
      <path d="M12 16v6" />
    </svg>
  );
}
function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="m7 14 3-3 3 3 5-6" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const GRAD: Record<string, string> = {
  green: 'linear-gradient(135deg,#34D399,#10b981)',
  blue: 'linear-gradient(135deg,#60a5fa,#2563eb)',
  violet: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
  amber: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
  navy: 'linear-gradient(135deg,#3b82f6,#1e3a5f)',
  cyan: 'linear-gradient(135deg,#22d3ee,#0891b2)',
  rose: 'linear-gradient(135deg,#f87171,#dc2626)',
  teal: 'linear-gradient(135deg,#2dd4bf,#0d9488)',
};

type RoleKey = 'admin' | 'director' | 'manager' | 'senior' | 'rep' | 'support';
const ROLES: Record<RoleKey, { name: string; color: string; cap: number; over: string }> = {
  admin: { name: '系統管理員', color: '#2563eb', cap: 100, over: 'unlimited' },
  director: { name: '區域總監', color: '#6d28d9', cap: 40, over: 'approve' },
  manager: { name: '業務經理', color: '#0891b2', cap: 25, over: 'approve' },
  senior: { name: '資深業務', color: '#059669', cap: 15, over: 'approve' },
  rep: { name: '業務代表', color: '#ea7a1e', cap: 10, over: 'approve' },
  support: { name: '業務支援', color: '#9aa1ae', cap: 0, over: 'block' },
};

const STATUS_MAP = {
  active: { cls: 'active', lbl: '啟用中' },
  inactive: { cls: 'inactive', lbl: '停用' },
  pending: { cls: 'pending', lbl: '待啟用' },
};

interface UserData {
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
const USERS: UserData[] = [
  {
    av: '陳',
    g: 'green',
    name: '陳小明',
    email: 'chen.xm@cxcrm.com',
    title: '資深業務經理',
    role: 'manager',
    profile: '業務經理',
    perms: ['報表匯出', '商機刪除'],
    status: 'active',
    last: '2 小時前',
    since: '2023/11/04',
  },
  {
    av: '王',
    g: 'navy',
    name: '王淑芬',
    email: 'wang.sf@cxcrm.com',
    title: 'IT 系統管理員',
    role: 'admin',
    profile: '系統管理員',
    perms: ['報表匯出', '商機刪除', 'API 存取', '大量匯入精靈', 'Cisco 整合'],
    status: 'active',
    last: '剛剛',
    since: '2022/08/15',
  },
  {
    av: '李',
    g: 'cyan',
    name: '李孟翰',
    email: 'lee.mh@cxcrm.com',
    title: '北區區域總監',
    role: 'director',
    profile: '業務經理',
    perms: ['報表匯出', 'API 存取'],
    status: 'active',
    last: '1 天前',
    since: '2023/02/20',
  },
  {
    av: '陳',
    g: 'violet',
    name: '陳美華',
    email: 'chen.mh@cxcrm.com',
    title: '資深業務',
    role: 'senior',
    profile: '標準業務',
    perms: ['報表匯出', '大量匯入精靈'],
    status: 'active',
    last: '3 小時前',
    since: '2023/06/11',
  },
  {
    av: '張',
    g: 'blue',
    name: '張志豪',
    email: 'chang.zh@cxcrm.com',
    title: '業務代表',
    role: 'rep',
    profile: '標準業務',
    perms: ['報表匯出'],
    status: 'active',
    last: '昨天',
    since: '2024/03/01',
  },
  {
    av: '林',
    g: 'amber',
    name: '林俊傑',
    email: 'lin.cj@cxcrm.com',
    title: '業務代表',
    role: 'rep',
    profile: '標準業務',
    perms: [],
    status: 'active',
    last: '5 天前',
    since: '2024/09/18',
  },
  {
    av: '吳',
    g: 'teal',
    name: '吳建宏',
    email: 'wu.jh@cxcrm.com',
    title: '資深業務',
    role: 'senior',
    profile: '標準業務',
    perms: ['Cisco 整合'],
    status: 'pending',
    last: '—',
    since: '2026/06/14',
  },
  {
    av: '黃',
    g: 'rose',
    name: '黃詩涵',
    email: 'huang.sh@cxcrm.com',
    title: '業務支援專員',
    role: 'support',
    profile: '業務支援',
    perms: [],
    status: 'inactive',
    last: '30 天前',
    since: '2023/01/09',
  },
];

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

// ── Role Hierarchy Data ───────────────────────────────────────────────────────
const ORG_NAME = 'CX CRM 股份有限公司';

interface RoleNode {
  name: string;
  code: string;
  color: string;
  children?: RoleNode[];
}
interface RPerson {
  av: string;
  g: string;
  name: string;
  title: string;
  email: string;
  role: string;
}

const ROLE_HIER: RoleNode[] = [
  { name: '客戶成功經理', code: 'CSM', color: '#0891b2' },
  { name: '續約經理', code: 'Renewal_Mgr', color: '#7c3aed' },
  { name: '產品經理', code: 'Product_Mgr', color: '#db2777' },
  {
    name: '業務主管',
    code: 'Sales_Lead',
    color: '#2563eb',
    children: [
      {
        name: '業務組長',
        code: 'Sales_TeamLead',
        color: '#0d9488',
        children: [{ name: '業務人員', code: 'Sales_Staff', color: '#059669' }],
      },
    ],
  },
  { name: '業務代表', code: 'Sales_Rep', color: '#ea7a1e' },
  { name: '技術顧問', code: 'Tech_Consult', color: '#6d28d9' },
];

const RPEOPLE_INIT: RPerson[] = [
  {
    av: '林',
    g: 'rose',
    name: '林雅婷',
    title: '客戶成功資深專員',
    email: 'lin.yt@cxcrm.com',
    role: '客戶成功經理',
  },
  {
    av: '周',
    g: 'blue',
    name: '周冠宇',
    title: '客戶成功經理',
    email: 'chou.gy@cxcrm.com',
    role: '客戶成功經理',
  },
  {
    av: '蔡',
    g: 'violet',
    name: '蔡岱穎',
    title: '續約業務經理',
    email: 'tsai.dy@cxcrm.com',
    role: '續約經理',
  },
  {
    av: '鄭',
    g: 'cyan',
    name: '鄭凱文',
    title: '產品線經理',
    email: 'cheng.kw@cxcrm.com',
    role: '產品經理',
  },
  {
    av: '高',
    g: 'amber',
    name: '高敏華',
    title: '產品企劃經理',
    email: 'kao.mh@cxcrm.com',
    role: '產品經理',
  },
  {
    av: '李',
    g: 'navy',
    name: '李孟翰',
    title: '北區業務主管',
    email: 'lee.mh@cxcrm.com',
    role: '業務主管',
  },
  {
    av: '陳',
    g: 'green',
    name: '陳小明',
    title: '業務一組組長',
    email: 'chen.xm@cxcrm.com',
    role: '業務組長',
  },
  {
    av: '吳',
    g: 'teal',
    name: '吳建宏',
    title: '業務二組組長',
    email: 'wu.jh@cxcrm.com',
    role: '業務組長',
  },
  {
    av: '張',
    g: 'blue',
    name: '張志豪',
    title: '業務專員',
    email: 'chang.zh@cxcrm.com',
    role: '業務人員',
  },
  {
    av: '林',
    g: 'amber',
    name: '林俊傑',
    title: '業務專員',
    email: 'lin.cj@cxcrm.com',
    role: '業務人員',
  },
  {
    av: '黃',
    g: 'rose',
    name: '黃詩涵',
    title: '業務專員',
    email: 'huang.sh@cxcrm.com',
    role: '業務人員',
  },
  {
    av: '許',
    g: 'cyan',
    name: '許文彥',
    title: '業務專員',
    email: 'hsu.wy@cxcrm.com',
    role: '業務人員',
  },
  {
    av: '劉',
    g: 'violet',
    name: '劉哲瑋',
    title: '業務代表',
    email: 'liu.zw@cxcrm.com',
    role: '業務代表',
  },
  {
    av: '楊',
    g: 'teal',
    name: '楊雅筑',
    title: '業務代表',
    email: 'yang.yz@cxcrm.com',
    role: '業務代表',
  },
  {
    av: '簡',
    g: 'green',
    name: '簡上瑋',
    title: '業務代表',
    email: 'chien.sw@cxcrm.com',
    role: '業務代表',
  },
  {
    av: '范',
    g: 'navy',
    name: '范柏宏',
    title: '資深技術顧問',
    email: 'fan.bh@cxcrm.com',
    role: '技術顧問',
  },
  {
    av: '沈',
    g: 'rose',
    name: '沈宜蓁',
    title: '業務支援專員',
    email: 'shen.yz@cxcrm.com',
    role: '',
  },
  { av: '邱', g: 'blue', name: '邱柏睿', title: '儲備幹部', email: 'chiu.br@cxcrm.com', role: '' },
  {
    av: '顏',
    g: 'amber',
    name: '顏均豪',
    title: '技術支援工程師',
    email: 'yen.jh@cxcrm.com',
    role: '',
  },
  {
    av: '趙',
    g: 'cyan',
    name: '趙文心',
    title: '客戶成功專員',
    email: 'chao.wx@cxcrm.com',
    role: '',
  },
];

function flattenRoleNames(nodes: RoleNode[]): string[] {
  return nodes.flatMap((n) => [n.name, ...flattenRoleNames(n.children ?? [])]);
}
const ROLE_FLAT = flattenRoleNames(ROLE_HIER);

function findRoleNode(
  name: string,
  nodes: RoleNode[],
  parent: RoleNode | null = null
): { node: RoleNode; parent: RoleNode | null } | null {
  for (const n of nodes) {
    if (n.name === name) return { node: n, parent };
    const res = findRoleNode(name, n.children ?? [], n);
    if (res) return res;
  }
  return null;
}

function rolePathTo(name: string, nodes: RoleNode[], acc: RoleNode[] = []): RoleNode[] | null {
  for (const n of nodes) {
    if (n.name === name) return acc;
    const res = rolePathTo(name, n.children ?? [], [...acc, n]);
    if (res !== null) return res;
  }
  return null;
}

// ── Flow Data ────────────────────────────────────────────────────────────────
type FlowTrig = 'record' | 'schedule' | 'screen';
const FLOW_TRIGGER: Record<FlowTrig, { lbl: string; tag: string; kind: string }> = {
  record: { lbl: '記錄觸發', tag: '記錄觸發', kind: '記錄觸發 · 啟動' },
  schedule: { lbl: '排程', tag: '排程', kind: '排程 · 啟動' },
  screen: { lbl: '畫面流程', tag: '畫面流程', kind: '畫面流程 · 啟動' },
};
interface DiagramStep {
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
interface FlowItem {
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
const FLOWS: FlowItem[] = [
  {
    name: '商機結案自動建立續約',
    api: 'Opportunity_Won_Renewal',
    trig: 'record',
    obj: '商機 Opportunity',
    desc: '當商機階段變更為「結案 — 贏單」且含保固類產品時，自動建立續約商機並通知負責業務。',
    on: true,
    ver: 4,
    runs7: 842,
    fail7: 0,
    lm: { av: '王', g: 'navy', name: '王淑芬', date: '2026/06/12' },
    diagram: [
      { start: true, trig: 'record', label: '商機 Opportunity', sub: '階段變更為 結案-贏單 時' },
      { ic: 'get', label: '取得商機產品明細', sub: 'OpportunityLineItem' },
      {
        decision: true,
        label: '含保固類產品？',
        sub: 'Product.Family = Warranty',
        yes: [
          { ic: 'create', label: '建立續約商機', sub: '到期前 90 天' },
          { ic: 'action', label: '通知負責業務', sub: 'Email + 站內通知' },
        ],
        no: [{ end: true, label: '結束 — 不處理' }],
      },
    ],
  },
  {
    name: '高額折扣自動送審',
    api: 'Quote_Discount_Approval',
    trig: 'record',
    obj: '報價單 Quote',
    desc: '報價單建立或編輯時，比對提交者角色折扣上限，超限自動送出審核給上層主管。',
    on: true,
    ver: 7,
    runs7: 1310,
    fail7: 6,
    lm: { av: '陳', g: 'green', name: '陳小明', date: '2026/06/15' },
    diagram: [
      { start: true, trig: 'record', label: '報價單 Quote', sub: '建立或更新時' },
      { ic: 'get', label: '取得提交者角色上限', sub: 'Role.DiscountCap__c' },
      {
        decision: true,
        label: '折扣 > 角色上限？',
        yes: [
          { ic: 'action', label: '送出審核給上層主管', sub: 'Approval Process' },
          { ic: 'update', label: '標記狀態 = 審核中' },
        ],
        no: [
          { ic: 'update', label: '標記狀態 = 已核准' },
          { end: true, label: '自動核准' },
        ],
      },
    ],
  },
  {
    name: '新名單自動指派業務',
    api: 'Lead_Auto_Assignment',
    trig: 'record',
    obj: '名單 Lead',
    desc: '名單建立時依來源與地區，套用指派規則分派給對應業務團隊並記錄指派時間。',
    on: true,
    ver: 2,
    runs7: 476,
    fail7: 0,
    lm: { av: '林', g: 'violet', name: '林雅婷', date: '2026/05/28' },
    diagram: [
      { start: true, trig: 'record', label: '名單 Lead', sub: '建立時' },
      { ic: 'get', label: '取得地區業務團隊', sub: '依 Lead.Region__c' },
      {
        decision: true,
        label: '名單來源 = 官網？',
        yes: [{ ic: 'assign', label: '指派給內勤業務', sub: 'Inbound 隊列' }],
        no: [{ ic: 'assign', label: '指派給區域外勤業務' }],
      },
      { ic: 'update', label: '記錄指派時間', sub: 'AssignedAt__c = NOW()' },
    ],
  },
  {
    name: '每日逾期商機提醒',
    api: 'Daily_Stale_Opp_Reminder',
    trig: 'schedule',
    obj: '排程 · 每日 08:00',
    desc: '每日早晨掃描逾 14 天未更新的進行中商機，彙整摘要寄送給負責業務與其主管。',
    on: true,
    ver: 3,
    runs7: 7,
    fail7: 0,
    lm: { av: '王', g: 'navy', name: '王淑芬', date: '2026/06/01' },
    diagram: [
      { start: true, trig: 'schedule', label: '每日 08:00', sub: 'Scheduled Flow' },
      { ic: 'get', label: '取得逾期商機', sub: '14 天未更新 · 進行中' },
      {
        decision: true,
        label: '有逾期商機？',
        yes: [{ ic: 'action', label: '寄送摘要 Email', sub: '分組寄給各負責業務' }],
        no: [{ end: true, label: '結束 — 無待辦' }],
      },
    ],
  },
  {
    name: '報價單產生畫面流程',
    api: 'Quote_Builder_Screen',
    trig: 'screen',
    obj: '畫面流程 · 使用者啟動',
    desc: '引導業務逐步選擇產品、套用價目表與折扣規則，並在確認後建立報價單。',
    on: true,
    ver: 5,
    runs7: 318,
    fail7: 1,
    lm: { av: '陳', g: 'green', name: '陳小明', date: '2026/06/10' },
    diagram: [
      { start: true, trig: 'screen', label: '使用者啟動', sub: '商機頁面按鈕' },
      { ic: 'screen', label: '選擇產品與數量' },
      { ic: 'get', label: '取得價目表與折扣規則' },
      { ic: 'screen', label: '確認報價明細' },
      { ic: 'create', label: '建立報價單', sub: 'Quote + QuoteLineItem' },
      { end: true, label: '完成' },
    ],
  },
  {
    name: 'Cisco 保固到期通知',
    api: 'Cisco_Warranty_Expiry',
    trig: 'schedule',
    obj: '排程 · 每日 07:00',
    desc: '每日呼叫 Cisco API 同步保固狀態，對 90 天內到期者建立續約行動項目並通知客戶經理。',
    on: true,
    ver: 1,
    runs7: 7,
    fail7: 5,
    lm: { av: '王', g: 'navy', name: '王淑芬', date: '2026/06/16' },
    diagram: [
      { start: true, trig: 'schedule', label: '每日 07:00', sub: 'Scheduled Flow' },
      { ic: 'action', label: '呼叫 Cisco 保固 API', sub: 'External Service' },
      {
        decision: true,
        label: '90 天內到期？',
        yes: [
          { ic: 'create', label: '建立續約行動項目', sub: 'CallToAction__c' },
          { ic: 'action', label: '通知客戶經理' },
        ],
        no: [{ end: true, label: '結束' }],
      },
    ],
  },
  {
    name: '客戶滿意度調查',
    api: 'CSAT_Survey_OnClose',
    trig: 'screen',
    obj: '服務案件 Case',
    desc: '服務案件結案後彈出滿意度問卷，並將評分寫回案件。目前為草稿，尚未啟用。',
    on: false,
    ver: 1,
    runs7: 0,
    fail7: 0,
    lm: { av: '林', g: 'violet', name: '林雅婷', date: '2026/06/14' },
    diagram: [
      { start: true, trig: 'screen', label: '案件結案後', sub: '草稿 Draft' },
      { ic: 'screen', label: '滿意度問卷', sub: 'CSAT 1–5 分' },
      { ic: 'update', label: '寫回案件評分', sub: 'Case.CSAT__c' },
      { end: true, label: '完成' },
    ],
  },
];
type RunEntry = { ok: number; t: string; d: string; time: string; dur: string };
const FLOW_RUNS: Record<number | 'default', RunEntry[]> = {
  default: [
    {
      ok: 1,
      t: '執行成功',
      d: '處理 1 筆記錄，2 個元素已執行。',
      time: '今天 14:22',
      dur: '0.42s',
    },
    {
      ok: 1,
      t: '執行成功',
      d: '處理 1 筆記錄，2 個元素已執行。',
      time: '今天 11:08',
      dur: '0.39s',
    },
    { ok: 1, t: '執行成功', d: '處理 1 筆記錄。', time: '今天 09:51', dur: '0.51s' },
    { ok: 1, t: '執行成功', d: '處理 1 筆記錄。', time: '昨天 17:30', dur: '0.44s' },
  ],
  1: [
    {
      ok: 0,
      t: '執行失敗',
      d: '動作「送出審核」失敗：找不到提交者的上層主管（Manager 欄位為空）。',
      time: '今天 13:15',
      dur: '0.88s',
    },
    {
      ok: 1,
      t: '執行成功',
      d: '折扣 22% 超限，已送審核給 王淑芬。',
      time: '今天 12:40',
      dur: '0.55s',
    },
    {
      ok: 0,
      t: '執行失敗',
      d: '動作「送出審核」失敗：找不到提交者的上層主管（Manager 欄位為空）。',
      time: '今天 10:02',
      dur: '0.91s',
    },
    { ok: 1, t: '執行成功', d: '折扣 8%，未超限，自動核准。', time: '今天 09:18', dur: '0.33s' },
  ],
  5: [
    {
      ok: 0,
      t: '執行失敗',
      d: '呼叫 Cisco 保固 API 逾時（10s）— External Service「CiscoWarranty」未回應。',
      time: '今天 07:00',
      dur: '10.0s',
    },
    {
      ok: 0,
      t: '執行失敗',
      d: '呼叫 Cisco 保固 API 逾時（10s）。',
      time: '昨天 07:00',
      dur: '10.0s',
    },
    {
      ok: 0,
      t: '執行失敗',
      d: 'HTTP 401 — API 金鑰已過期，請至「系統整合 › API 設定」更新。',
      time: '06/15 07:00',
      dur: '1.2s',
    },
    { ok: 0, t: '執行失敗', d: 'HTTP 401 — API 金鑰已過期。', time: '06/14 07:00', dur: '1.1s' },
  ],
};
type VerEntry = { v: string; active: boolean; date: string; by: string; note: string };
const FLOW_VERSIONS: Record<number | 'default', VerEntry[]> = {
  default: [
    {
      v: '目前版本',
      active: true,
      date: '2026/06/12',
      by: '王淑芬',
      note: '調整通知收件人，新增主管副本。',
    },
    { v: 'v3', active: false, date: '2026/04/30', by: '王淑芬', note: '加入保固產品判斷條件。' },
    { v: 'v2', active: false, date: '2026/02/18', by: '陳小明', note: '初版上線。' },
  ],
  1: [
    {
      v: '目前版本',
      active: true,
      date: '2026/06/15',
      by: '陳小明',
      note: '依角色折扣上限改寫判斷，串接審核流程。',
    },
    { v: 'v6', active: false, date: '2026/05/20', by: '陳小明', note: '新增「已核准」狀態回寫。' },
    { v: 'v5', active: false, date: '2026/03/11', by: '王淑芬', note: '調整審核路由規則。' },
  ],
  5: [
    {
      v: '目前版本',
      active: true,
      date: '2026/06/16',
      by: '王淑芬',
      note: '串接 Cisco 保固 API（External Service）。',
    },
  ],
};

// ── Import Batch Data ────────────────────────────────────────────────────────
type ImpSrc = 'csv' | 'api' | 'manual';
type ImpStatus = 'scheduled' | 'processing' | 'completed' | 'partial' | 'failed' | 'queued';
const IMP_SOURCE: Record<ImpSrc, { tag: string }> = {
  csv: { tag: 'CSV 上傳' },
  api: { tag: 'API 同步' },
  manual: { tag: '手動上傳' },
};
const IMP_STATUS: Record<ImpStatus, { cls: string; lbl: string }> = {
  scheduled: { cls: 'active', lbl: '排程中' },
  processing: { cls: 'proc', lbl: '處理中' },
  completed: { cls: 'active', lbl: '完成' },
  partial: { cls: 'pending', lbl: '部分失敗' },
  failed: { cls: 'inactive', lbl: '失敗' },
  queued: { cls: 'queue', lbl: '排隊中' },
};
const IMP_RULES = [
  { l: '重複比對欄位', v: 'Email · 統一編號' },
  { l: '重複處理方式', v: '更新既有紀錄（Upsert）' },
  { l: '批次大小', v: '每批 200 筆' },
  { l: '錯誤門檻', v: '失敗 > 10% 自動中止' },
  { l: '預設負責人', v: '依指派規則 / 上傳者' },
  { l: '完成通知', v: 'Email 通知上傳者與管理員' },
];
interface BatchItem {
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
const BATCHES: BatchItem[] = [
  {
    name: '每日潛客匯入',
    file: 'leads_daily.csv',
    obj: '名單 Lead',
    src: 'api',
    freq: '排程 · 每日 02:00',
    status: 'scheduled',
    sched: true,
    on: true,
    total: 128,
    ok: 128,
    err: 0,
    skip: 4,
    by: { av: '系', g: 'navy', name: '系統排程', date: '今天 02:00' },
    dur: '14s',
  },
  {
    name: 'ERP 客戶同步',
    file: 'SAP OData',
    obj: '客戶帳號 Account',
    src: 'api',
    freq: '排程 · 每 6 小時',
    status: 'scheduled',
    sched: true,
    on: true,
    total: 42,
    ok: 42,
    err: 0,
    skip: 8,
    by: { av: '系', g: 'navy', name: '系統排程', date: '今天 06:00' },
    dur: '9s',
  },
  {
    name: 'Cisco 保固清單匯入',
    file: 'cisco_warranty_q2.csv',
    obj: '保固續約 Cisco_Warranty_Renewal__c',
    src: 'manual',
    freq: '一次性',
    status: 'processing',
    sched: false,
    on: false,
    total: 1240,
    ok: 794,
    err: 6,
    skip: 0,
    prog: 64,
    by: { av: '王', g: 'navy', name: '王淑芬', date: '今天 14:38' },
    dur: '進行中',
  },
  {
    name: '行銷名單匯入（展會）',
    file: 'expo2026_leads.xlsx',
    obj: '名單 Lead',
    src: 'manual',
    freq: '一次性',
    status: 'completed',
    sched: false,
    on: false,
    total: 560,
    ok: 548,
    err: 0,
    skip: 12,
    by: { av: '林', g: 'violet', name: '林雅婷', date: '昨天 16:20' },
    dur: '31s',
  },
  {
    name: '歷史商機匯入',
    file: 'opps_2024_archive.csv',
    obj: '商機 Opportunity',
    src: 'csv',
    freq: '一次性',
    status: 'partial',
    sched: false,
    on: false,
    total: 312,
    ok: 309,
    err: 3,
    skip: 0,
    by: { av: '陳', g: 'green', name: '陳小明', date: '06/16 11:02' },
    dur: '22s',
  },
  {
    name: '聯絡人批次更新',
    file: 'contacts_update.csv',
    obj: '聯絡人 Contact',
    src: 'csv',
    freq: '一次性',
    status: 'failed',
    sched: false,
    on: false,
    total: 0,
    ok: 0,
    err: 0,
    skip: 0,
    by: { av: '林', g: 'violet', name: '林雅婷', date: '06/16 09:45' },
    dur: '—',
    failReason: '檔案編碼非 UTF-8，且第 1 列標頭與欄位對應不符，匯入未啟動。',
  },
  {
    name: '產品價目表匯入',
    file: 'pricebook_2026h2.csv',
    obj: '產品 Product2',
    src: 'csv',
    freq: '一次性',
    status: 'queued',
    sched: false,
    on: false,
    total: 86,
    ok: 0,
    err: 0,
    skip: 0,
    by: { av: '王', g: 'navy', name: '王淑芬', date: '今天 14:51' },
    dur: '排隊中',
  },
];
type ImpErrEntry = { row: number; id: string; reason: string };
const IMP_ERRORS: Record<number, ImpErrEntry[]> = {
  2: [
    { row: 118, id: 'CSCO-2291', reason: '保固到期日格式錯誤（應為 YYYY-MM-DD）。' },
    { row: 204, id: 'CSCO-2310', reason: '關聯帳號「鴻博科技」查無對應 Account。' },
    { row: 377, id: 'CSCO-2402', reason: 'Cisco 合約號重複，已存在相同紀錄。' },
  ],
  4: [
    { row: 57, id: 'OPP-2024-0571', reason: '金額欄位為空，必填欄位驗證失敗。' },
    { row: 142, id: 'OPP-2024-1183', reason: '階段「Closed」非有效選項清單值。' },
    { row: 288, id: 'OPP-2024-2240', reason: '負責業務 Email 查無對應使用者。' },
  ],
};
type MapRow = [string, string, string, 'ok' | 'skip'];
const IMP_MAPPING: Record<number | 'default', MapRow[]> = {
  default: [
    ['name', '名稱', 'Name', 'ok'],
    ['email', 'Email', 'Email', 'ok'],
    ['company', '公司', 'Company', 'ok'],
    ['phone', '電話', 'Phone', 'ok'],
    ['source', '來源', 'LeadSource', 'ok'],
    ['notes', '—', '—', 'skip'],
  ],
  2: [
    ['contract_no', 'Cisco 合約號', 'Cisco_Contract_No__c', 'ok'],
    ['account', '關聯帳號', 'Account__c', 'ok'],
    ['warranty_end', '保固到期日', 'Warranty_End__c', 'ok'],
    ['amount', '續約金額', 'Renewal_Amount__c', 'ok'],
    ['status', '續約狀態', 'Renewal_Status__c', 'ok'],
    ['internal_id', '—', '—', 'skip'],
  ],
  4: [
    ['opp_name', '商機名稱', 'Name', 'ok'],
    ['amount', '金額', 'Amount', 'ok'],
    ['stage', '階段', 'StageName', 'ok'],
    ['close_date', '預計關閉日', 'CloseDate', 'ok'],
    ['owner_email', '負責業務', 'OwnerId', 'ok'],
    ['legacy_note', '—', '—', 'skip'],
  ],
};

type ImpRecEntry = { id: string; name: string; status: 'ok' | 'skip' | 'err'; note?: string };
const IMP_RECORDS: Record<number | 'default', ImpRecEntry[]> = {
  default: [
    { id: 'LEAD-0042', name: '張庭瑋 / 宏立科技', status: 'ok' },
    { id: 'LEAD-0043', name: '李孟潔 / 優思資訊', status: 'ok' },
    {
      id: 'LEAD-0044',
      name: '王柏宇 / 鼎新電腦',
      status: 'skip',
      note: '重複 Email — 已 Upsert 更新',
    },
    { id: 'LEAD-0045', name: '陳怡安 / 凱基系統', status: 'ok' },
    { id: 'LEAD-0046', name: '林志豪 / 聯華電子', status: 'ok' },
  ],
  1: [
    { id: 'ACC-1201', name: '宏立科技股份有限公司', status: 'ok' },
    { id: 'ACC-1202', name: '優思資訊有限公司', status: 'ok' },
    { id: 'ACC-1203', name: '鼎新電腦股份有限公司', status: 'ok' },
  ],
  2: [
    { id: 'LEAD-0051', name: '劉怡婷 / 英業達', status: 'ok' },
    { id: 'LEAD-0052', name: '陳冠宏 / 仁寶電腦', status: 'err', note: '缺少必填欄位「公司」' },
    { id: 'LEAD-0053', name: '吳佩儀 / 廣達電腦', status: 'ok' },
    {
      id: 'LEAD-0054',
      name: '黃俊豪 / 和碩聯合',
      status: 'skip',
      note: '重複 Email — 已 Upsert 更新',
    },
    { id: 'LEAD-0055', name: '許雅涵 / 微星科技', status: 'ok' },
  ],
  4: [
    { id: 'OPP-0841', name: '宏立科技-ERP導入案', status: 'ok' },
    { id: 'OPP-0842', name: '優思資訊-雲端續約', status: 'ok' },
    {
      id: 'OPP-0843',
      name: '鼎新電腦-資安方案',
      status: 'err',
      note: '必填欄位「預計關閉日」格式錯誤',
    },
    { id: 'OPP-0844', name: '凱基系統-網路設備採購', status: 'ok' },
  ],
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
      { key: 'pagelayout', label: '頁面版面 Page Layout', ph: true },
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
      { key: 'email', label: '郵件設定', ph: true },
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
  pagelayout: {
    group: '介面設定',
    title: '頁面版面 Page Layout',
    cta: '新增版面',
    desc: '設計各物件紀錄頁的欄位區塊、相關清單與按鈕配置，並依 Profile 指派不同版面。',
    cols: ['版面名稱', '所屬物件', '已指派 Profile', '相關清單', '最後修改'],
    rows: [
      ['商機 — 業務版面', 'Opportunity', '標準業務、業務經理', '4', '2026/05/30'],
      ['商機 — 主管版面', 'Opportunity', '系統管理員', '5', '2026/04/18'],
      ['客戶帳號 — 標準版面', 'Account', '全部', '3', '2026/03/22'],
      ['報價單 — 審核版面', 'Quote__c', '業務經理', '2', '2026/06/01'],
      ['聯絡人 — 標準版面', 'Contact', '全部', '2', '2026/02/11'],
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
        {state.type === 'user' && <UserContent />}
        {state.type === 'profile' && <ProfileContent />}
        {state.type === 'permset' && <PermSetContent />}
        {state.type === 'flow' && <FlowContent />}
        {state.type === 'batch' && <BatchContent />}
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
  const [discountVals, setDiscountVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(Object.entries(ROLES).map(([k, r]) => [k, r.cap]))
  );
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

  // ── Discount Caps panel ───────────────────────────────────────────────────
  function DiscountPanel() {
    return (
      <div>
        <div className="cx-crumbs">
          <a onClick={() => setActiveTab('hub')}>設定</a>
          <ChevRight />
          <span>使用者管理</span>
          <ChevRight />
          <span>角色折扣上限</span>
        </div>
        <div className="cx-set-head">
          <div>
            <h1>角色折扣上限</h1>
            <div className="sub">
              設定各角色於商機 / 報價單可核給的最高折扣百分比。超過上限的報價將自動觸發審核流程。
            </div>
          </div>
          <div className="actions">
            <button
              className="cx-btn-outline"
              onClick={() => {
                setDiscountVals(
                  Object.fromEntries(Object.entries(ROLES).map(([k, r]) => [k, r.cap]))
                );
                showToast('已還原為預設值');
              }}
            >
              <ResetIcon />
              還原
            </button>
            <button className="cx-btn-navy" onClick={() => showToast('已儲存角色折扣上限')}>
              <SaveIcon />
              儲存變更
            </button>
          </div>
        </div>

        <div className="cx-disc-note">
          <InfoIcon />
          <div>
            折扣上限與「業務自動化 ›
            審核流程」連動：當業務於報價輸入的折扣超過其角色上限，系統將自動送出審核給上一層主管。系統管理員不受上限限制。
          </div>
        </div>

        <div className="cx-data-card">
          <table className="cx-dt">
            <colgroup>
              <col />
              <col style={{ width: 90 }} />
              <col style={{ width: 300 }} />
              <col style={{ width: 150 }} />
            </colgroup>
            <thead>
              <tr>
                <th>角色</th>
                <th className="num">人數</th>
                <th>折扣上限</th>
                <th>超限行為</th>
              </tr>
            </thead>
            <tbody>
              {(Object.entries(ROLES) as [RoleKey, (typeof ROLES)[RoleKey]][]).map(([k, r]) => {
                const cnt = USERS.filter((u) => u.role === k).length;
                const val = discountVals[k] ?? r.cap;
                const overBadge =
                  r.over === 'unlimited' ? (
                    <span className="cx-status active">
                      <span className="pip" />
                      不受限制
                    </span>
                  ) : r.over === 'block' ? (
                    <span className="cx-status inactive">
                      <span className="pip" />
                      禁止核給
                    </span>
                  ) : (
                    <span className="cx-status pending">
                      <span className="pip" />
                      自動送審核
                    </span>
                  );
                return (
                  <tr key={k} className="no-hover">
                    <td>
                      <span className="cx-role-tag">
                        <span className="rk" style={{ background: r.color }} />
                        {r.name}
                      </span>
                    </td>
                    <td className="num" style={{ color: 'var(--cx-text-sub)' }}>
                      {cnt}
                    </td>
                    <td>
                      <div className="cx-disc-cap">
                        <div className="track">
                          <i style={{ width: `${val}%` }} />
                        </div>
                        <div className="cx-disc-input">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={val}
                            disabled={r.over === 'unlimited'}
                            onChange={(e) =>
                              setDiscountVals((prev) => ({
                                ...prev,
                                [k]: Math.max(0, Math.min(100, +e.target.value || 0)),
                              }))
                            }
                          />
                          <span className="pct">%</span>
                        </div>
                      </div>
                    </td>
                    <td>{overBadge}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── Roles panel ───────────────────────────────────────────────────────────
  function RolesPanel() {
    const [rpeople, setRpeople] = useState<RPerson[]>(RPEOPLE_INIT);
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
    const [allCollapsed, setAllCollapsed] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [drawerTab, setDrawerTab] = useState('assigned');
    const [candSearch, setCandSearch] = useState('');

    const totalRoles = ROLE_FLAT.length;
    const assignedCount = rpeople.filter((p) => p.role).length;

    function getAssigned(roleName: string) {
      return rpeople.filter((p) => p.role === roleName);
    }

    function toggleCollapse(name: string, e: React.MouseEvent) {
      e.stopPropagation();
      setCollapsed((prev) => {
        const s = new Set(prev);
        s.has(name) ? s.delete(name) : s.add(name);
        return s;
      });
    }

    function toggleAll() {
      if (allCollapsed) {
        setCollapsed(new Set());
        setAllCollapsed(false);
      } else {
        const withKids: string[] = [];
        function collect(nodes: RoleNode[]) {
          nodes.forEach((n) => {
            if (n.children?.length) {
              withKids.push(n.name);
              collect(n.children);
            }
          });
        }
        collect(ROLE_HIER);
        setCollapsed(new Set(withKids));
        setAllCollapsed(true);
      }
    }

    function openRole(name: string, tab = 'assigned') {
      setSelectedRole(name);
      setDrawerTab(tab);
      setCandSearch('');
    }

    function assignToggle(personName: string) {
      if (!selectedRole) return;
      setRpeople((prev) =>
        prev.map((p) =>
          p.name === personName ? { ...p, role: p.role === selectedRole ? '' : selectedRole } : p
        )
      );
    }

    function removeFromRole(personName: string) {
      setRpeople((prev) => prev.map((p) => (p.name === personName ? { ...p, role: '' } : p)));
    }

    function stepRole(d: number) {
      const idx = selectedRole ? ROLE_FLAT.indexOf(selectedRole) : 0;
      const ni = (idx + d + ROLE_FLAT.length) % ROLE_FLAT.length;
      openRole(ROLE_FLAT[ni]);
    }

    const found = selectedRole ? findRoleNode(selectedRole, ROLE_HIER) : null;
    const roleNode = found?.node ?? null;
    const rolePath = selectedRole ? (rolePathTo(selectedRole, ROLE_HIER) ?? []) : [];
    const drawerAssigned = selectedRole ? getAssigned(selectedRole) : [];
    const filteredCands = rpeople.filter(
      (p) =>
        !candSearch ||
        p.name.toLowerCase().includes(candSearch.toLowerCase()) ||
        p.title.toLowerCase().includes(candSearch.toLowerCase()) ||
        p.email.toLowerCase().includes(candSearch.toLowerCase())
    );

    function TreeNode({ node }: { node: RoleNode }) {
      const hasKids = (node.children?.length ?? 0) > 0;
      const isCollapsed = collapsed.has(node.name);
      const cnt = getAssigned(node.name).length;
      return (
        <div className={`cx-rt-node${isCollapsed ? ' collapsed' : ''}`}>
          <div className="cx-rt-row" onClick={() => openRole(node.name)}>
            {hasKids ? (
              <div className="cx-rt-caret" onClick={(e) => toggleCollapse(node.name, e)}>
                <ChevRight />
              </div>
            ) : (
              <div className="cx-rt-leaf">
                <i />
              </div>
            )}
            <div className="cx-rt-dot" style={{ background: node.color }} />
            <div className="cx-rt-name">{node.name}</div>
            <div className="cx-rt-code">{node.code}</div>
            <div className={`cx-rt-count${cnt === 0 ? ' zero' : ''}`}>
              <UserGrpIcon />
              {cnt} 位
            </div>
            <div className="cx-rt-actions">
              <button
                className="cx-rt-act"
                onClick={(e) => {
                  e.stopPropagation();
                  openRole(node.name, 'assign');
                }}
              >
                指派使用者
              </button>
              <button
                className="cx-rt-act"
                onClick={(e) => {
                  e.stopPropagation();
                  showToast(`新增「${node.name}」的子角色`);
                }}
              >
                新增子角色
              </button>
            </div>
          </div>
          {hasKids && (
            <div className="cx-rt-children">
              {node.children!.map((child) => (
                <TreeNode key={child.name} node={child} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        <div className="cx-crumbs">
          <a onClick={() => setActiveTab('hub')}>設定</a>
          <ChevRight />
          <span>使用者管理</span>
          <ChevRight />
          <span>角色階層管理</span>
        </div>
        <div className="cx-set-head">
          <div>
            <h1>角色階層管理</h1>
            <div className="sub">
              以組織為頂層建立角色階層。上層角色可檢視其下所有角色擁有的記錄，階層同時決定報表彙總與資料共用範圍。
            </div>
          </div>
          <div className="actions">
            <button className="cx-btn-outline" onClick={toggleAll}>
              {allCollapsed ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ width: 15, height: 15 }}
                  >
                    <path d="M9 5H5v4M15 5h4v4M19 15v4h-4M5 15v4h4" />
                  </svg>
                  展開全部
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ width: 15, height: 15 }}
                  >
                    <path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" />
                  </svg>
                  收合全部
                </>
              )}
            </button>
            <button className="cx-btn-navy" onClick={() => showToast('已開啟「新增角色」面板')}>
              <PlusIcon />
              新增角色
            </button>
          </div>
        </div>

        <div className="cx-stat-bar">
          <div className="cx-sb-item">
            <div className="sic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="6" r="3" />
                <path d="M5 21a7 7 0 0 1 14 0" />
              </svg>
            </div>
            <div className="stx">
              <div className="snum">{totalRoles}</div>
              <div className="slb">角色總數</div>
            </div>
          </div>
          <div className="cx-sb-item">
            <div className="sic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 3v18h18" />
                <rect x="7" y="13" width="3" height="5" />
                <rect x="12" y="9" width="3" height="9" />
                <rect x="17" y="5" width="3" height="13" />
              </svg>
            </div>
            <div className="stx">
              <div className="snum">{ROLE_HIER.length}</div>
              <div className="slb">頂層角色</div>
            </div>
          </div>
          <div className="cx-sb-item">
            <div className="sic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 7h4l2 10 2-14 2 10 2-6h4" />
              </svg>
            </div>
            <div className="stx">
              <div className="snum">
                3 <span style={{ fontSize: 13, fontWeight: 400 }}>層</span>
              </div>
              <div className="slb">最深階層深度</div>
            </div>
          </div>
          <div className="cx-sb-item">
            <div className="sic">
              <UserGrpIcon />
            </div>
            <div className="stx">
              <div className="snum">{assignedCount}</div>
              <div className="slb">已指派人數</div>
            </div>
          </div>
        </div>

        <div className="cx-disc-note">
          <InfoIcon />
          <div>
            角色階層與「角色折扣上限」、「報表彙總」連動：階層中位置越高的角色，可見資料範圍越廣。點擊角色列可檢視與指派成員。
          </div>
        </div>

        <div className="cx-data-card">
          <div className="cx-role-tree">
            {/* Org root */}
            <div className="cx-rt-org">
              <div className="cx-rt-org-ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  style={{ width: 21, height: 21, color: '#cfe0fd' }}
                >
                  <path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
                  <path d="M15 9h3a1 1 0 0 1 1 1v11" />
                  <path d="M3 21h18M8 8h2M8 12h2M8 16h2" />
                </svg>
              </div>
              <div className="cx-rt-org-tx">
                <div className="nm">{ORG_NAME}</div>
                <div className="sb">組織最高層級 · 角色階層根節點</div>
              </div>
              <div className="cx-rt-org-meta">
                <div className="om">
                  <b>{totalRoles}</b>
                  <span>角色</span>
                </div>
                <div className="om-div" />
                <div className="om">
                  <b>{assignedCount}</b>
                  <span>使用者</span>
                </div>
              </div>
            </div>
            {/* Children */}
            <div className="cx-rt-children cx-rt-top">
              {ROLE_HIER.map((node) => (
                <TreeNode key={node.name} node={node} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Role Drawer ── */}
        {selectedRole && roleNode && (
          <>
            <div className="cx-drawer-scrim open" onClick={() => setSelectedRole(null)} />
            <div className="cx-drawer open">
              <div className="cx-dw-top">
                <div className="cx-dw-bar">
                  <span className="crumb">
                    <b>角色</b> ／ {selectedRole}
                  </span>
                  <div style={{ flex: 1 }} />
                  <button className="cx-dw-iconbtn" onClick={() => stepRole(-1)}>
                    <ChevLeft />
                  </button>
                  <button className="cx-dw-iconbtn" onClick={() => stepRole(1)}>
                    <ChevRight />
                  </button>
                  <button className="cx-dw-iconbtn" onClick={() => setSelectedRole(null)}>
                    <XIcon />
                  </button>
                </div>
                <div className="cx-dw-hero">
                  <div
                    className="logo sq"
                    style={{ background: roleNode.color, display: 'grid', placeItems: 'center' }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      style={{ width: 23, height: 23 }}
                    >
                      <path d="M16 18a4 4 0 0 0-8 0" />
                      <circle cx="12" cy="8" r="3.2" />
                      <path d="M4 20a6 6 0 0 1 4-5.6M20 20a6 6 0 0 0-4-5.6" />
                    </svg>
                  </div>
                  <div className="h-main" style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ fontSize: 19, fontWeight: 500 }}>{selectedRole}</h2>
                    <div className="h-meta" style={{ marginTop: 7 }}>
                      <span className="cx-prof-tag" style={{ fontFamily: 'monospace' }}>
                        {roleNode.code}
                      </span>
                      <span className="cx-prof-tag">{drawerAssigned.length} 位使用者</span>
                    </div>
                    <div
                      className="h-sub"
                      style={{ fontSize: 12.5, color: 'var(--cx-text-sub)', marginTop: 4 }}
                    >
                      階層：{[ORG_NAME, ...rolePath.map((p) => p.name), selectedRole].join(' › ')}
                    </div>
                  </div>
                  <button className="cx-btn-sm pri" onClick={() => showToast('已開啟編輯面板')}>
                    <EditIcon />
                    編輯
                  </button>
                </div>
                <div className="cx-dw-tabs">
                  {(['assigned', 'assign', 'place'] as const).map((t, i) => (
                    <div
                      key={t}
                      className={`cx-dw-tab ${drawerTab === t ? 'on' : ''}`}
                      onClick={() => setDrawerTab(t)}
                    >
                      {['已指派人員', '指派使用者', '階層位置'][i]}
                      {t === 'assigned' && <span className="n">{drawerAssigned.length}</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="cx-dw-body">
                {/* Tab: 已指派人員 */}
                {drawerTab === 'assigned' && (
                  <div className="cx-dw-sec">
                    <div className="sh">
                      <h3>已指派至此角色的人員</h3>
                      <span className="sh-n">{drawerAssigned.length}</span>
                      <div style={{ flex: 1 }} />
                      <span className="add" onClick={() => setDrawerTab('assign')}>
                        <PlusIcon />
                        指派使用者
                      </span>
                    </div>
                    {drawerAssigned.length ? (
                      drawerAssigned.map((p) => (
                        <div key={p.email} className="cx-assign-row">
                          <div className="av" style={{ background: GRAD[p.g] }}>
                            {p.av}
                          </div>
                          <div className="am">
                            <div className="n">{p.name}</div>
                            <div className="t">
                              {p.title} · {p.email}
                            </div>
                          </div>
                          <button
                            className="x"
                            title="移除指派"
                            onClick={() => removeFromRole(p.name)}
                          >
                            <XIcon />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          padding: '30px 16px',
                          textAlign: 'center',
                          color: 'var(--cx-text-faint)',
                          fontSize: 12.5,
                        }}
                      >
                        尚無使用者指派至此角色
                        <br />
                        <span style={{ fontSize: 11.5 }}>切換至「指派使用者」分頁加入成員</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: 指派使用者 */}
                {drawerTab === 'assign' && (
                  <div className="cx-dw-sec">
                    <div className="sh">
                      <h3>選擇使用者指派至「{selectedRole}」</h3>
                    </div>
                    <div className="cx-assign-hint">
                      <InfoIcon />
                      點選人員即可指派；每位使用者於階層中僅能擔任一個角色，指派將自動移轉其原角色。
                    </div>
                    <div className="cx-cand-search">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                      <input
                        type="text"
                        placeholder="搜尋姓名、職稱或 Email…"
                        value={candSearch}
                        onChange={(e) => setCandSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div>
                      {filteredCands.map((p) => {
                        const isThis = p.role === selectedRole;
                        return (
                          <div
                            key={p.email}
                            className={`cx-cand-row${isThis ? ' is-assigned' : ''}`}
                            onClick={() => assignToggle(p.name)}
                          >
                            <div className="av" style={{ background: GRAD[p.g] }}>
                              {p.av}
                            </div>
                            <div className="cm">
                              <div className="n">{p.name}</div>
                              <div className="t">{p.title}</div>
                            </div>
                            {p.role && !isThis && <span className="cx-cand-other">{p.role}</span>}
                            {!p.role && <span className="cx-cand-other">未指派</span>}
                            <button
                              className={`cx-cand-btn${isThis ? ' assigned' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                assignToggle(p.name);
                              }}
                            >
                              {isThis ? '移除' : '指派'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab: 階層位置 */}
                {drawerTab === 'place' && (
                  <>
                    <div className="cx-dw-sec">
                      <div className="sh">
                        <h3>階層路徑</h3>
                      </div>
                      <div className="cx-role-path">
                        {[
                          { name: ORG_NAME, color: 'var(--cx-navy)' },
                          ...rolePath.map((p) => ({ name: p.name, color: p.color })),
                          { name: selectedRole, color: roleNode.color },
                        ].map((seg, i, arr) => (
                          <Fragment key={i}>
                            {i > 0 && <ChevRight />}
                            <span className={`seg${i === arr.length - 1 ? ' cur' : ''}`}>
                              <span className="pdot" style={{ background: seg.color }} />
                              {seg.name}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="cx-dw-sec">
                      <div className="sh">
                        <h3>直屬上層角色</h3>
                      </div>
                      <div className="cx-rel-chips">
                        <span className="cx-rel-chip">
                          <span
                            className="rk"
                            style={{ background: found?.parent?.color ?? 'var(--cx-navy)' }}
                          />
                          {found?.parent?.name ?? ORG_NAME}
                        </span>
                      </div>
                    </div>
                    <div className="cx-dw-sec">
                      <div className="sh">
                        <h3>直屬下層角色</h3>
                        <span className="sh-n">{roleNode.children?.length ?? 0}</span>
                      </div>
                      {roleNode.children?.length ? (
                        <div className="cx-rel-chips">
                          {roleNode.children.map((c) => (
                            <span key={c.name} className="cx-rel-chip">
                              <span className="rk" style={{ background: c.color }} />
                              {c.name}
                              <span className="rc-n">{getAssigned(c.name).length} 位</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="cx-rel-empty">此角色目前無子角色（為階層末端）</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
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

  // ── Flow panel ───────────────────────────────────────────────────────────
  function FlowPanel() {
    const [trigFilter, setTrigFilter] = useState<FlowTrig | ''>('');
    const [statusFilter, setStatusFilter] = useState('');
    const [healthFilter, setHealthFilter] = useState('');
    const [flowSearch, setFlowSearch] = useState('');

    const list = FLOWS.map((f, i) => ({ ...f, on: flowOn[i] ?? f.on, idx: i }));
    const filtered = list.filter((f) => {
      if (trigFilter && f.trig !== trigFilter) return false;
      if (statusFilter === 'on' && !f.on) return false;
      if (statusFilter === 'off' && f.on) return false;
      if (healthFilter === 'err' && f.fail7 === 0) return false;
      if (healthFilter === 'ok' && f.fail7 > 0) return false;
      if (flowSearch) {
        const q = flowSearch.toLowerCase();
        if (!f.name.toLowerCase().includes(q) && !f.api.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    const activeCount = list.filter((f) => f.on).length;
    const failFlows = list.filter((f) => f.fail7 > 0).length;
    const totalRuns = list.reduce((s, f) => s + f.runs7, 0);

    function TrigSvg({ k }: { k: FlowTrig }) {
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

    const GRAD_FL: Record<string, string> = {
      navy: '#1e3a5f',
      green: '#16a34a',
      violet: '#7c3aed',
      blue: '#2563eb',
      amber: '#b45309',
      rose: '#be123c',
    };

    return (
      <div>
        <div className="cx-crumbs">
          <span>設定</span>
          <ChevRight />
          <span>自動化流程 Flow</span>
        </div>
        <div className="cx-set-head">
          <div>
            <h1 className="cx-set-title">自動化流程 Flow</h1>
            <p className="cx-set-desc">管理記錄觸發、排程與畫面流程，監控執行狀態與錯誤。</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="cx-btn-sec"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}
              onClick={() => showToast('已開啟執行監控')}
            >
              <MonitorIcon />
              執行監控
            </button>
            <button
              className="cx-btn-pri"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}
              onClick={() => showToast('已開啟新增流程精靈')}
            >
              <PlusIcon />
              新增流程
            </button>
          </div>
        </div>

        <div className="cx-stat-bar">
          <div className="cx-sb-item">
            <div className="sic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M9 9h6M9 12h6M9 15h4" />
              </svg>
            </div>
            <div className="stx">
              <div className="snum">{FLOWS.length}</div>
              <div className="slb">流程總數</div>
            </div>
          </div>
          <div className="cx-sb-item">
            <div className="sic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="stx">
              <div className="snum">{activeCount}</div>
              <div className="slb">啟用中</div>
            </div>
          </div>
          <div className="cx-sb-item">
            <div className="sic red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="stx">
              <div className={`snum${failFlows > 0 ? ' red' : ''}`}>{failFlows}</div>
              <div className="slb">近 7 日有失敗</div>
            </div>
          </div>
          <div className="cx-sb-item">
            <div className="sic">
              <MonitorIcon />
            </div>
            <div className="stx">
              <div className="snum">{totalRuns.toLocaleString()}</div>
              <div className="slb">近 7 日執行次數</div>
            </div>
          </div>
        </div>

        <div className="cx-filter-row">
          <select
            className="cx-fpill"
            value={trigFilter}
            onChange={(e) => setTrigFilter(e.target.value as FlowTrig | '')}
          >
            <option value="">所有觸發類型</option>
            <option value="record">記錄觸發</option>
            <option value="schedule">排程</option>
            <option value="screen">畫面流程</option>
          </select>
          <select
            className="cx-fpill"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">所有狀態</option>
            <option value="on">啟用中</option>
            <option value="off">已停用</option>
          </select>
          <select
            className="cx-fpill"
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
          >
            <option value="">所有健康度</option>
            <option value="ok">無失敗</option>
            <option value="err">有失敗</option>
          </select>
          <div className="cx-fsearch">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: 14, height: 14, color: 'var(--cx-text-faint)' }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              placeholder="搜尋流程名稱或 API Name…"
              value={flowSearch}
              onChange={(e) => setFlowSearch(e.target.value)}
            />
          </div>
          <div
            style={{
              marginLeft: 'auto',
              fontSize: 12,
              color: 'var(--cx-text-faint)',
              whiteSpace: 'nowrap',
              alignSelf: 'center',
            }}
          >
            共 <b>{filtered.length}</b> 個流程
          </div>
        </div>

        <div className="cx-data-card">
          <table className="cx-dt">
            <colgroup>
              <col />
              <col style={{ width: 110 }} />
              <col style={{ width: 90 }} />
              <col style={{ width: 80 }} />
              <col />
              <col style={{ width: 64 }} />
              <col style={{ width: 48 }} />
            </colgroup>
            <thead>
              <tr>
                <th>流程</th>
                <th>觸發類型</th>
                <th>近 7 日失敗</th>
                <th>執行次數</th>
                <th>最後修改</th>
                <th>狀態</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.api} onClick={() => openFlow(f.idx)}>
                  <td>
                    <div className="cx-fl-name">
                      <div className={`cx-fl-tic ${f.trig}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <TrigSvg k={f.trig} />
                        </svg>
                      </div>
                      <div className="fn-tx">
                        <div className="n">
                          {f.name}
                          <span className="cx-fl-vbadge">v{f.ver}</span>
                        </div>
                        <div className="sub">
                          {f.api} · {f.obj}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`cx-fl-type-tag ${f.trig}`}>{FLOW_TRIGGER[f.trig].tag}</span>
                  </td>
                  <td>
                    <span className={`cx-fl-err${f.fail7 > 0 ? ' has' : ' none'}`}>
                      {f.fail7 > 0 && <span className="ed" />}
                      {f.fail7 > 0 ? `${f.fail7} 次` : '無'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--cx-text-sub)' }}>{f.runs7.toLocaleString()}</td>
                  <td>
                    <div className="cx-fl-lm">
                      <div className="av" style={{ background: GRAD_FL[f.lm.g] || '#1e3a5f' }}>
                        {f.lm.av}
                      </div>
                      <div className="tx">
                        <div className="n">{f.lm.name}</div>
                        <div className="d">{f.lm.date}</div>
                      </div>
                    </div>
                  </td>
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlowToggle(f.idx);
                    }}
                  >
                    <span className={`cx-fl-toggle${f.on ? '' : ' off'}`} />
                  </td>
                  <td>
                    <div className="cx-row-arr">
                      <ChevRight />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cx-pager">
            <div className="info">
              共 <b>{filtered.length}</b> 個流程
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Import panel ─────────────────────────────────────────────────────────
  function ImportPanel() {
    const [objFilter, setObjFilter] = useState('');
    const [srcFilter, setSrcFilter] = useState('');
    const [stFilter, setStFilter] = useState('');
    const [impSearch, setImpSearch] = useState('');

    const list = BATCHES.map((b, i) => ({ ...b, on: batchOn[i] ?? b.on, idx: i }));
    const filtered = list.filter((b) => {
      if (objFilter && !b.obj.startsWith(objFilter)) return false;
      if (srcFilter && b.src !== srcFilter) return false;
      if (stFilter && b.status !== stFilter) return false;
      if (impSearch) {
        const q = impSearch.toLowerCase();
        if (!b.name.toLowerCase().includes(q) && !b.file.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    const totalRecs = BATCHES.reduce((s, b) => s + b.ok, 0);
    const pendingCnt = BATCHES.filter(
      (b) => b.status === 'processing' || b.status === 'queued'
    ).length;
    const needAtt = BATCHES.filter((b) => b.status === 'partial' || b.status === 'failed').length;

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

    function CountCell({ b }: { b: (typeof filtered)[0] }) {
      if (b.status === 'queued')
        return <span style={{ color: 'var(--cx-text-faint)', fontSize: 12.5 }}>—</span>;
      if (b.status === 'failed')
        return <span style={{ color: '#d6483f', fontSize: 12.5, fontWeight: 500 }}>未匯入</span>;
      if (b.status === 'processing')
        return (
          <div className="cx-miniprog">
            <div className="track">
              <i style={{ width: `${b.prog}%` }} />
            </div>
            <span className="pc">{b.prog}%</span>
          </div>
        );
      return (
        <span className="cx-cnt-cell">
          <span className="ok">{b.ok.toLocaleString()}</span>
          <span className="sep">/</span>
          {b.err > 0 ? (
            <span className="er">{b.err}</span>
          ) : (
            <span style={{ color: 'var(--cx-text-faint)' }}>0</span>
          )}
        </span>
      );
    }

    return (
      <div>
        <div className="cx-crumbs">
          <span>設定</span>
          <ChevRight />
          <span>系統整合</span>
          <ChevRight />
          <span>匯入批次設定</span>
        </div>
        <div className="cx-set-head">
          <div>
            <h1 className="cx-set-title">匯入批次設定</h1>
            <p className="cx-set-desc">
              管理排程與一次性資料匯入、檢視執行結果與錯誤明細，並設定全域重複比對與錯誤處理規則。
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="cx-btn-sec"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}
              onClick={() => showToast('已下載匯入範本（CSV）')}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: 15, height: 15 }}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
              </svg>
              下載範本
            </button>
            <button
              className="cx-btn-pri"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}
              onClick={() => setActiveTab('importwizard')}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: 15, height: 15 }}
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              匯入精靈
            </button>
          </div>
        </div>

        <div className="cx-stat-bar">
          <div className="cx-sb-item">
            <div className="sic blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M7 10l5 5 5-5M12 15V3" />
              </svg>
            </div>
            <div className="stx">
              <div className="snum">{BATCHES.length}</div>
              <div className="slb">匯入批次</div>
            </div>
          </div>
          <div className="cx-sb-item">
            <div className="sic green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="stx">
              <div className="snum green">{totalRecs.toLocaleString()}</div>
              <div className="slb">近 30 日匯入筆數</div>
            </div>
          </div>
          <div className="cx-sb-item">
            <div className="sic orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 12a9 9 0 1 1-6.2-8.5" />
                <path d="M21 3v6h-6" />
              </svg>
            </div>
            <div className="stx">
              <div className="snum orange">{pendingCnt}</div>
              <div className="slb">處理中 / 排隊</div>
            </div>
          </div>
          <div className="cx-sb-item">
            <div className="sic red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="stx">
              <div className={`snum${needAtt > 0 ? ' red' : ''}`}>{needAtt}</div>
              <div className="slb">需處理（失敗 / 部分失敗）</div>
            </div>
          </div>
        </div>

        {/* 預設匯入規則 */}
        <div className="cx-filter-row">
          <select
            className="cx-fpill"
            value={objFilter}
            onChange={(e) => setObjFilter(e.target.value)}
          >
            <option value="">全部物件</option>
            <option value="名單">名單 Lead</option>
            <option value="客戶帳號">客戶帳號 Account</option>
            <option value="商機">商機 Opportunity</option>
            <option value="聯絡人">聯絡人 Contact</option>
            <option value="產品">產品 Product2</option>
            <option value="保固續約">保固續約 Cisco_Warranty_Renewal__c</option>
          </select>
          <select
            className="cx-fpill"
            value={srcFilter}
            onChange={(e) => setSrcFilter(e.target.value)}
          >
            <option value="">全部來源</option>
            <option value="csv">CSV 上傳</option>
            <option value="api">API 同步</option>
          </select>
          <select
            className="cx-fpill"
            value={stFilter}
            onChange={(e) => setStFilter(e.target.value)}
          >
            <option value="">全部狀態</option>
            <option value="scheduled">排程中</option>
            <option value="processing">處理中</option>
            <option value="completed">完成</option>
            <option value="partial">部分失敗</option>
            <option value="failed">失敗</option>
            <option value="queued">排隊中</option>
          </select>
          <div className="cx-fsearch">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: 14, height: 14, color: 'var(--cx-text-faint)' }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              placeholder="搜尋批次名稱或檔案…"
              value={impSearch}
              onChange={(e) => setImpSearch(e.target.value)}
            />
          </div>
          <div
            style={{
              marginLeft: 'auto',
              fontSize: 12,
              color: 'var(--cx-text-faint)',
              whiteSpace: 'nowrap',
              alignSelf: 'center',
            }}
          >
            共 <b>{filtered.length}</b> 個批次
          </div>
        </div>

        <div className="cx-data-card">
          <table className="cx-dt">
            <colgroup>
              <col />
              <col style={{ width: 140 }} />
              <col style={{ width: 138 }} />
              <col style={{ width: 148 }} />
              <col style={{ width: 92 }} />
              <col style={{ width: 148 }} />
              <col style={{ width: 48 }} />
            </colgroup>
            <thead>
              <tr>
                <th>匯入批次</th>
                <th>目標物件</th>
                <th>來源 · 頻率</th>
                <th>筆數（成功 / 失敗）</th>
                <th>狀態</th>
                <th>上次執行</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: '30px',
                      textAlign: 'center',
                      color: 'var(--cx-text-faint)',
                      fontSize: 13,
                      cursor: 'default',
                    }}
                  >
                    沒有符合條件的批次
                  </td>
                </tr>
              )}
              {filtered.map((b) => (
                <tr key={b.idx} onClick={() => openBatch(b.idx)}>
                  <td>
                    <div className="cx-im-name">
                      <div className={`cx-im-tic ${b.src}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {IMP_SRC_ICON[b.src]}
                        </svg>
                      </div>
                      <div className="in-tx">
                        <div className="n">{b.name}</div>
                        <div className="sub">{b.file}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="cx-obj-pill">
                      <span className="od" />
                      {b.obj.split(' ')[0]}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--cx-text-sub)' }}>
                    {IMP_SOURCE[b.src].tag}
                    <div style={{ fontSize: 11, color: 'var(--cx-text-faint)', marginTop: 2 }}>
                      {b.freq}
                    </div>
                  </td>
                  <td>
                    <CountCell b={b} />
                  </td>
                  <td>
                    <span className={`cx-status ${IMP_STATUS[b.status].cls}`}>
                      <span className="pip" />
                      {IMP_STATUS[b.status].lbl}
                    </span>
                  </td>
                  <td>
                    <div className="cx-fl-lm">
                      <div className="av" style={{ background: GRAD[b.by.g] || '#1e3a5f' }}>
                        {b.by.av}
                      </div>
                      <div className="tx">
                        <div className="n">{b.by.name}</div>
                        <div className="d">{b.by.date}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cx-row-arr">
                      <ChevRight />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cx-pager">
            <div className="info">
              共 <b>{filtered.length}</b> 個批次
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Import Wizard panel ───────────────────────────────────────────────────
  function ImportWizardPanel() {
    type ObjKey = 'lead' | 'account' | 'opportunity' | 'contact' | 'product';
    interface WizField {
      l: string;
      api: string;
      req: boolean;
    }
    interface WizObj {
      nm: string;
      api: string;
      icon: React.ReactNode;
      desc: string;
      fields: WizField[];
    }

    const WIZ_OBJECTS: Record<ObjKey, WizObj> = {
      lead: {
        nm: '名單',
        api: 'Lead',
        desc: '潛在客戶名單',
        icon: (
          <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M19 8v6M22 11h-6" />
          </>
        ),
        fields: [
          { l: '名稱', api: 'Name', req: true },
          { l: '公司', api: 'Company', req: true },
          { l: 'Email', api: 'Email', req: false },
          { l: '電話', api: 'Phone', req: false },
          { l: '來源', api: 'LeadSource', req: false },
          { l: '地區', api: 'Region__c', req: false },
        ],
      },
      account: {
        nm: '客戶帳號',
        api: 'Account',
        desc: '公司 / 組織',
        icon: (
          <>
            <path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
            <path d="M15 9h3a1 1 0 0 1 1 1v11" />
            <path d="M3 21h18" />
            <path d="M8 8h2M8 12h2M8 16h2" />
          </>
        ),
        fields: [
          { l: '帳號名稱', api: 'Name', req: true },
          { l: '統一編號', api: 'TaxId__c', req: true },
          { l: '產業', api: 'Industry', req: false },
          { l: '員工規模', api: 'NumberOfEmployees', req: false },
          { l: '官方網站', api: 'Website', req: false },
        ],
      },
      opportunity: {
        nm: '商機',
        api: 'Opportunity',
        desc: '銷售機會',
        icon: (
          <>
            <path d="M3 3v18h18" />
            <path d="m7 14 3-3 3 3 5-6" />
          </>
        ),
        fields: [
          { l: '商機名稱', api: 'Name', req: true },
          { l: '金額', api: 'Amount', req: true },
          { l: '階段', api: 'StageName', req: true },
          { l: '預計關閉日', api: 'CloseDate', req: true },
          { l: '折扣百分比', api: 'Discount__c', req: false },
        ],
      },
      contact: {
        nm: '聯絡人',
        api: 'Contact',
        desc: '帳號下的窗口',
        icon: (
          <>
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20a7 7 0 0 1 14 0" />
          </>
        ),
        fields: [
          { l: '姓名', api: 'Name', req: true },
          { l: 'Email', api: 'Email', req: false },
          { l: '電話', api: 'Phone', req: false },
          { l: '職稱', api: 'Title', req: false },
          { l: '關聯帳號', api: 'AccountName', req: false },
        ],
      },
      product: {
        nm: '產品',
        api: 'Product2',
        desc: '價目表品項',
        icon: (
          <>
            <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
          </>
        ),
        fields: [
          { l: '產品名稱', api: 'Name', req: true },
          { l: '產品代碼', api: 'ProductCode', req: true },
          { l: '單價', api: 'UnitPrice', req: false },
          { l: '類別', api: 'Family', req: false },
        ],
      },
    };
    const WIZ_SAMPLE: Record<ObjKey, string> = {
      lead: 'name,company,email,phone,source,region\n張庭瑋,宏立科技,t.chang@honglih.com,02-2712-3344,官網,北區\n李孟潔,優思資訊,meng.li@usinfo.tw,03-558-7700,展會,中區\n王柏宇,鼎新電腦,by.wang@dsc.com.tw,04-2358-1100,轉介,中區\n陳怡安,凱基系統,ya.chen@kgi-sys.com,07-336-9988,電話進線,南區',
      account:
        'name,tax_id,industry,employees,website\n宏立科技股份有限公司,28451930,製造業,420,https://honglih.com\n優思資訊有限公司,53120887,軟體服務,86,https://usinfo.tw\n鼎新電腦股份有限公司,11912033,軟體服務,3200,https://dsc.com.tw',
      opportunity:
        'opp_name,amount,stage,close_date,discount\n宏立科技-ERP導入案,1850000,提案,2026-08-30,8\n優思資訊-雲端續約,420000,談判,2026-07-15,5\n鼎新電腦-資安方案,2760000,需求確認,2026-09-20,0',
      contact:
        'name,email,phone,title,account\n張庭瑋,t.chang@honglih.com,02-2712-3344,資訊處長,宏立科技\n李孟潔,meng.li@usinfo.tw,03-558-7700,採購經理,優思資訊',
      product:
        'name,code,price,family\nCisco Catalyst 9300 交換器,WS-C9300-24T,142000,網路設備\nMeraki MX68 防火牆,MX68-HW,38500,資安設備\nCisco 智慧授權續約,DNA-C-1Y,21000,軟體授權',
    };
    const STEP_LABELS = ['選擇物件', '上傳 CSV', '對應欄位', '建立資料'];

    const [step, setStep] = useState(1);
    const [objKey, setObjKey] = useState<ObjKey | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [headers, setHeaders] = useState<string[]>([]);
    const [rows, setRows] = useState<string[][]>([]);
    const [map, setMap] = useState<Record<string, number>>({});
    const [done, setDone] = useState(false);
    const [result, setResult] = useState<{ created: number; failed: number; total: number } | null>(
      null
    );
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    function pCSV(text: string) {
      const lines = text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .filter((l) => l.trim());
      const pl = (l: string) => {
        const out: string[] = [];
        let cur = '',
          q = false;
        for (let i = 0; i < l.length; i++) {
          const c = l[i];
          if (q) {
            if (c === '"') {
              if (l[i + 1] === '"') {
                cur += '"';
                i++;
              } else q = false;
            } else cur += c;
          } else {
            if (c === '"') q = true;
            else if (c === ',') {
              out.push(cur);
              cur = '';
            } else cur += c;
          }
        }
        out.push(cur);
        return out.map((s) => s.trim());
      };
      if (!lines.length) return { headers: [] as string[], rows: [] as string[][] };
      return { headers: pl(lines[0]), rows: lines.slice(1).map(pl) };
    }
    function doAutoMap(h: string[], ob: WizObj) {
      const norm = (s: string) => (s || '').toLowerCase().replace(/[_\s\-/]/g, '');
      const m: Record<string, number> = {};
      ob.fields.forEach((f) => {
        const cands = [
          norm(f.l),
          norm(f.api),
          norm(f.api.replace('__c', '')),
          norm(f.l.replace('名稱', '')),
        ];
        let hit = -1;
        h.forEach((hdr, hi) => {
          if (hit < 0) {
            const nh = norm(hdr);
            if (cands.some((c) => c && (nh === c || nh.includes(c) || c.includes(nh)))) hit = hi;
          }
        });
        m[f.api] = hit;
      });
      return m;
    }
    function reqMissing(ob: WizObj, m: Record<string, number>) {
      return ob.fields.filter((f) => f.req && (m[f.api] === undefined || m[f.api] < 0)).length;
    }
    function computeResult(ob: WizObj) {
      const reqFields = ob.fields.filter((f) => f.req);
      let created = 0,
        failed = 0;
      rows.forEach((r) => {
        const ok = reqFields.every((f) => {
          const idx = map[f.api];
          return idx >= 0 && (r[idx] || '').trim().length;
        });
        if (ok) created++;
        else failed++;
      });
      return { created, failed, total: rows.length };
    }
    function handleFileInput(files: FileList | null) {
      const f = files?.[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        const { headers: h, rows: r } = pCSV(rd.result as string);
        if (!h.length) {
          showToast('無法解析此 CSV 檔案');
          return;
        }
        setHeaders(h);
        setRows(r);
        setFileName(f.name);
      };
      rd.readAsText(f, 'utf-8');
    }
    function loadSample() {
      const { headers: h, rows: r } = pCSV(WIZ_SAMPLE[objKey!]);
      setHeaders(h);
      setRows(r);
      setFileName(`${WIZ_OBJECTS[objKey!].api}_範例.csv`);
    }
    function clearFile() {
      setHeaders([]);
      setRows([]);
      setFileName(null);
      setMap({});
    }
    function goNext() {
      if (step === 2 && headers.length) setMap(doAutoMap(headers, WIZ_OBJECTS[objKey!]));
      setStep((s) => s + 1);
    }
    function createData() {
      const ob = WIZ_OBJECTS[objKey!];
      const r = computeResult(ob);
      setResult(r);
      setDone(true);
      showToast(`已建立 ${r.created} 筆 ${ob.nm} 資料`);
    }
    function resetWizard() {
      setStep(1);
      setObjKey(null);
      setFileName(null);
      setHeaders([]);
      setRows([]);
      setMap({});
      setDone(false);
      setResult(null);
    }

    const ob = objKey ? WIZ_OBJECTS[objKey] : null;
    let nextDisabled = false,
      footHint = '';
    if (step === 1) {
      nextDisabled = !objKey;
      footHint = !objKey ? '請選擇一個物件' : '';
    }
    if (step === 2) {
      nextDisabled = !headers.length;
      footHint = headers.length ? `已載入 ${rows.length} 筆` : '請先上傳 CSV 或使用範例';
    }
    if (step === 3 && ob) {
      const m = reqMissing(ob, map);
      nextDisabled = m > 0;
      footHint = m > 0 ? `尚有 ${m} 個必填欄位未對應` : '必填欄位皆已對應';
    }

    return (
      <div>
        <div className="cx-crumbs">
          <span>設定</span>
          <ChevRight />
          <span className="cx-crumb-link" onClick={() => setActiveTab('import')}>
            匯入批次設定
          </span>
          <ChevRight />
          <span>系統匯入精靈</span>
        </div>
        <div className="cx-set-head">
          <div>
            <button className="cx-btn-back" onClick={() => setActiveTab('import')}>
              <ChevLeft />
              返回匯入批次
            </button>
            <h1 className="cx-set-title">系統匯入精靈</h1>
            <p className="cx-set-desc">
              四個步驟匯入資料：選擇目標物件、上傳 CSV 檔案、對應欄位，並建立資料。
            </p>
          </div>
        </div>

        <div className="cx-wiz-card">
          {/* Steps bar */}
          <div className="cx-wiz-steps">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const cls = n < step ? 'done' : n === step ? 'active' : '';
              return (
                <Fragment key={i}>
                  <div className={`cx-wiz-step ${cls}`}>
                    <div className="num">
                      {n < step ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        n
                      )}
                    </div>
                    <div className="slab">{label}</div>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`cx-wiz-line ${n < step ? 'done' : ''}`} />
                  )}
                </Fragment>
              );
            })}
          </div>

          {/* Body */}
          <div className="cx-wiz-body">
            {/* Step 1 — select object */}
            {step === 1 && (
              <>
                <div className="cx-wiz-htitle">選擇要匯入的目標物件</div>
                <div className="cx-wiz-hdesc">資料將建立到所選物件。每次匯入僅能對應一個物件。</div>
                <div className="cx-wiz-objgrid">
                  {(Object.keys(WIZ_OBJECTS) as ObjKey[]).map((k) => {
                    const o = WIZ_OBJECTS[k];
                    return (
                      <div
                        key={k}
                        className={`cx-wiz-objcard${objKey === k ? ' sel' : ''}`}
                        onClick={() => {
                          setObjKey(k);
                          setHeaders([]);
                          setRows([]);
                          setFileName(null);
                          setMap({});
                        }}
                      >
                        <div className="oc-check">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </div>
                        <div className="oc-ic">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            {o.icon}
                          </svg>
                        </div>
                        <div className="oc-nm">{o.nm}</div>
                        <div className="oc-api">{o.api}</div>
                        <div className="oc-meta">
                          {o.desc} · {o.fields.length} 個可匯入欄位
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Step 2 — upload CSV */}
            {step === 2 && ob && headers.length === 0 && (
              <>
                <div className="cx-wiz-htitle">上傳 {ob.nm} 的 CSV 檔案</div>
                <div className="cx-wiz-hdesc">
                  第一列須為欄位標頭。檔案須為 UTF-8 編碼的 .csv，下一步可調整欄位對應。
                </div>
                <div
                  className={`cx-wiz-drop${dragOver ? ' drag' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFileInput(e.dataTransfer.files);
                  }}
                >
                  <div className="dz-ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <path d="M7 10l5 5 5-5M12 15V3" />
                    </svg>
                  </div>
                  <div className="dz-t">將 CSV 檔案拖曳至此，或點擊選擇檔案</div>
                  <div className="dz-s">支援 .csv · 最大 10MB</div>
                  <div className="dz-or">— 或 —</div>
                  <div className="cx-wiz-sample">
                    <button
                      className="cx-btn-ghost"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        loadSample();
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ width: 15, height: 15 }}
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                        <path d="M14 2v6h6" />
                      </svg>
                      使用 {ob.nm} 範例 CSV
                    </button>
                  </div>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleFileInput(e.target.files);
                    e.target.value = '';
                  }}
                />
              </>
            )}

            {/* Step 2 — file loaded preview */}
            {step === 2 && ob && headers.length > 0 && (
              <>
                <div className="cx-wiz-htitle">已載入檔案</div>
                <div className="cx-wiz-hdesc">確認偵測到的欄位與資料無誤後，繼續對應欄位。</div>
                <div className="cx-wiz-filecard">
                  <div className="fc-ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                      <path d="M14 2v6h6" />
                    </svg>
                  </div>
                  <div className="fc-m">
                    <div className="n">{fileName}</div>
                    <div className="d">
                      {headers.length} 個欄位 · {rows.length} 筆資料
                    </div>
                  </div>
                  <div className="fc-x" title="移除檔案" onClick={clearFile}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div className="cx-wiz-preview">
                  <div className="pv-head">資料預覽（前 {Math.min(rows.length, 4)} 筆）</div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="cx-wiz-pvtbl">
                      <thead>
                        <tr>
                          {headers.map((h, i) => (
                            <th key={i}>{h || '（空白）'}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.slice(0, 4).map((r, ri) => (
                          <tr key={ri}>
                            {headers.map((_, ci) => (
                              <td key={ci}>{r[ci] || ''}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Step 3 — map fields */}
            {step === 3 && ob && (
              <>
                <div className="cx-wiz-htitle">對應欄位</div>
                <div className="cx-wiz-hdesc">
                  將 CSV 欄位對應到 {ob.nm}（{ob.api}）的目標欄位。系統已自動配對相符欄位。
                </div>
                <div className="cx-wiz-mapnote">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ width: 16, height: 16, flexShrink: 0 }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  <span>
                    標示 <b style={{ color: '#d6483f' }}>＊</b> 為必填欄位，必須對應到一個 CSV
                    欄位才能建立資料。
                  </span>
                </div>
                <div className="cx-wiz-maphead">
                  <span>目標欄位（{ob.nm}）</span>
                  <span />
                  <span>CSV 來源欄位</span>
                </div>
                {ob.fields.map((f) => {
                  const idx = map[f.api] ?? -1;
                  const unmapped = f.req && idx < 0;
                  return (
                    <div key={f.api} className="cx-wiz-maprow">
                      <div className="wiz-tgt">
                        <div className="tl">
                          {f.l}
                          {f.req && <span className="req">＊</span>}
                        </div>
                        <div className="ta">{f.api}</div>
                      </div>
                      <div className="wiz-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </div>
                      <div className={`cx-wiz-mapsel${unmapped ? ' unmapped' : ''}`}>
                        <select
                          value={idx}
                          onChange={(e) => setMap((m) => ({ ...m, [f.api]: +e.target.value }))}
                        >
                          <option value="-1">— 不對應 —</option>
                          {headers.map((h, hi) => (
                            <option key={hi} value={hi}>
                              {h || '（空白欄）'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Step 4 — review */}
            {step === 4 &&
              ob &&
              !done &&
              (() => {
                const mapped = ob.fields.filter((f) => (map[f.api] ?? -1) >= 0);
                return (
                  <>
                    <div className="cx-wiz-htitle">檢視並建立資料</div>
                    <div className="cx-wiz-hdesc">
                      確認以下設定後點擊「建立資料」，系統將套用預設匯入規則（重複以 Upsert 處理）。
                    </div>
                    <div className="cx-wiz-rev">
                      <div className="cx-wiz-revcell">
                        <div className="rl">目標物件</div>
                        <div className="rv">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{ width: 17, height: 17, color: 'var(--cx-accent)' }}
                          >
                            {ob.icon}
                          </svg>
                          {ob.nm}{' '}
                          <span
                            style={{ fontWeight: 400, color: 'var(--cx-text-faint)', fontSize: 12 }}
                          >
                            {ob.api}
                          </span>
                        </div>
                      </div>
                      <div className="cx-wiz-revcell">
                        <div className="rl">來源檔案</div>
                        <div className="rv" style={{ fontSize: 13 }}>
                          {fileName}
                        </div>
                      </div>
                      <div className="cx-wiz-revcell">
                        <div className="rl">資料筆數</div>
                        <div className="rv">{rows.length.toLocaleString()} 筆</div>
                      </div>
                      <div className="cx-wiz-revcell">
                        <div className="rl">已對應欄位</div>
                        <div className="rv">
                          {mapped.length} / {ob.fields.length}
                        </div>
                      </div>
                    </div>
                    <div className="cx-wiz-preview">
                      <div className="pv-head">對應後資料預覽（前 3 筆）</div>
                      <div style={{ overflowX: 'auto' }}>
                        <table className="cx-wiz-pvtbl">
                          <thead>
                            <tr>
                              {mapped.map((f) => (
                                <th key={f.api}>{f.l}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.slice(0, 3).map((r, ri) => (
                              <tr key={ri}>
                                {mapped.map((f) => (
                                  <td key={f.api}>{r[map[f.api]] || ''}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                );
              })()}

            {/* Step 4 — done result */}
            {step === 4 && ob && done && result && (
              <div className="cx-wiz-result">
                <div className="rs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" />
                    <path d="M22 4 12 14.1l-3-3" />
                  </svg>
                </div>
                <h2>匯入完成</h2>
                <div className="rs-sub">
                  已將 <b>{result.created.toLocaleString()}</b> 筆資料建立到 {ob.nm}（{ob.api}）。
                  {result.failed > 0 && (
                    <>
                      <br />有 {result.failed} 筆因必填欄位缺值未匯入。
                    </>
                  )}
                </div>
                <div className="cx-wiz-rs-stats">
                  <div className="rs-stat">
                    <div className="v" style={{ color: '#0f9b6c' }}>
                      {result.created.toLocaleString()}
                    </div>
                    <div className="l">成功建立</div>
                  </div>
                  <div className="rs-stat">
                    <div className="v" style={{ color: result.failed ? '#d6483f' : undefined }}>
                      {result.failed}
                    </div>
                    <div className="l">失敗</div>
                  </div>
                  <div className="rs-stat">
                    <div className="v">{result.total.toLocaleString()}</div>
                    <div className="l">來源總筆數</div>
                  </div>
                </div>
                <div className="cx-wiz-rs-actions">
                  <button
                    className="cx-btn-outline"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
                    onClick={() => setActiveTab('import')}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ width: 15, height: 15 }}
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <path d="M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    檢視匯入批次
                  </button>
                  <button
                    className="cx-btn-navy"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
                    onClick={resetWizard}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      style={{ width: 15, height: 15 }}
                    >
                      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    再匯入一批
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="cx-wiz-foot">
            {step === 4 && done ? (
              <div className="cx-wiz-fnote">匯入已完成，可關閉或開始新的匯入。</div>
            ) : (
              <>
                {step > 1 && (
                  <button
                    className="cx-btn-ghost"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
                    onClick={() => setStep((s) => s - 1)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ width: 15, height: 15 }}
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    上一步
                  </button>
                )}
                <div className="cx-wiz-fnote">{footHint}</div>
                <div style={{ flex: 1 }} />
                {step < 4 ? (
                  <button
                    className="cx-btn-navy"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
                    disabled={nextDisabled}
                    onClick={goNext}
                  >
                    下一步{' '}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ width: 15, height: 15 }}
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    className="cx-btn-navy"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
                    onClick={createData}
                  >
                    建立資料{' '}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      style={{ width: 15, height: 15 }}
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </button>
                )}
              </>
            )}
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
            {activeTab === 'roles' && <RolesPanel />}
            {activeTab === 'profiles' && <ProfilesPanel />}
            {activeTab === 'permsets' && <PermSetsPanel />}
            {activeTab === 'discount' && <DiscountPanel />}
            {activeTab === 'objects' && <ObjectsPanel />}
            {activeTab === 'fields' && <FieldsPanel />}
            {activeTab === 'flow' && <FlowPanel />}
            {activeTab === 'import' && <ImportPanel />}
            {activeTab === 'importwizard' && <ImportWizardPanel />}
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
