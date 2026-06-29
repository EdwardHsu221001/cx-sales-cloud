'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconHome,
  IconLeads,
  IconAccounts,
  IconContacts,
  IconOpps,
  IconActivities,
  IconReports,
  IconSettings,
  IconSearch,
  IconChevron,
  IconHelp,
  IconBell,
} from './common/icons';

const NAV_ITEMS = [
  { href: '/', label: '首頁', Icon: IconHome },
  { href: '/leads', label: '潛在客戶', Icon: IconLeads, badge: '32' },
  { href: '/accounts', label: '客戶帳號', Icon: IconAccounts },
  { href: '/contacts', label: '聯絡人', Icon: IconContacts },
  { href: '/opportunities', label: '商機', Icon: IconOpps, fav: true },
  { href: '/activities', label: '活動任務', Icon: IconActivities, badge: '7' },
  { href: '/reports', label: '報表', Icon: IconReports },
] as const;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="cx-app">
      {/* ── Navbar ── */}
      <header className="cx-nav">
        <div className="cx-brand">
          <div className="cx-brand-mark">C</div>
          <div className="cx-brand-name">
            CX <b>CRM</b>
          </div>
        </div>
        <div className="cx-app-switch">
          Sales Cloud
          <IconChevron />
        </div>
        <div className="cx-search">
          <IconSearch />
          <input type="text" placeholder="搜尋客戶、聯絡人、商機…" />
        </div>
        <div className="cx-nav-right">
          <button className="cx-icon-btn" title="說明">
            <IconHelp />
          </button>
          <button className="cx-icon-btn" title="通知">
            <span className="cx-notif-dot" />
            <IconBell />
          </button>
          <div className="cx-nav-avatar" title="陳小明">
            陳
          </div>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <aside className="cx-sidebar">
        <div className="cx-nav-label">銷售</div>
        {NAV_ITEMS.map(({ href, label, Icon, ...rest }) => {
          const badge = 'badge' in rest ? rest.badge : undefined;
          const fav = 'fav' in rest ? rest.fav : undefined;
          return (
            <Link
              key={href}
              href={href}
              className={`cx-nav-item ${isActive(href) ? 'active' : ''}`}
            >
              <Icon />
              {label}
              {badge && <span className="cx-nav-badge">{badge}</span>}
              {fav && <span className="cx-nav-fav">✦</span>}
            </Link>
          );
        })}
        <div className="cx-nav-divider" />
        <Link href="/settings" className={`cx-nav-item ${isActive('/settings') ? 'active' : ''}`}>
          <IconSettings />
          設定
        </Link>
        <div className="cx-sidebar-spacer" />
        <div className="cx-user-card">
          <div className="cx-user-av">陳</div>
          <div className="cx-user-meta">
            <div className="cx-user-name">陳小明</div>
            <div className="cx-user-role">資深業務經理</div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="cx-main">
        <div className="cx-main-inner">{children}</div>
      </main>
    </div>
  );
}
