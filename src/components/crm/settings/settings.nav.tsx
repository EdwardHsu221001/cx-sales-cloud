import {
  IconGroupUsers,
  IconGroupObjects,
  IconGroupUI,
  IconGroupAuto,
  IconGroupIntegration,
} from './settings.icons';

// 設定頁側欄導覽結構（分組、項目、icon、計數與「設計中」佔位旗標）。
// 由 shell 側欄與 HubPanel（搜尋/卡片入口）共用。
export interface NavItem {
  key: string;
  label: string;
  cnt?: string;
  ph?: boolean;
}
export interface NavGroup {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
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
