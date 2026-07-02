'use client';

import { useState, useCallback, Fragment } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IconSettingsCenter } from './settings.icons';
import { USERS, FLOWS, BATCHES, PROFILES, PERMSETS, OBJ_ITEMS } from './settings.data';
import { NAV_GROUPS } from './settings.nav';
import type { DrawerState } from './settings.types';
import DiscountPanel from './discount/DiscountPanel';
import RolesPanel from './roles/RolesPanel';
import FlowPanel from './flow/FlowPanel';
import ImportPanel from './import/ImportPanel';
import ImportWizardPanel from './import/ImportWizardPanel';
import EmailPanel from './email/EmailPanel';
import PageLayoutPanel from './pagelayout/PageLayoutPanel';
import HubPanel from './hub/HubPanel';
import ProfilesPanel from './profiles/ProfilesPanel';
import PermSetsPanel from './permsets/PermSetsPanel';
import DetailDrawer from './drawer/DetailDrawer';
import PlaceholderPanel from './placeholder/PlaceholderPanel';
import UsersPanel from './users/UsersPanel';
import ObjectsPanel from './objects/ObjectsPanel';
import FieldsPanel from './fields/FieldsPanel';

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
  const [drawer, setDrawer] = useState<DrawerState>({
    open: false,
    type: 'user',
    index: 0,
    tab: 'overview',
  });
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

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
            {activeTab === 'hub' && <HubPanel showToast={showToast} onNavigate={setActiveTab} />}
            {activeTab === 'users' && (
              <UsersPanel showToast={showToast} onNavigate={setActiveTab} onOpenUser={openUser} />
            )}
            {activeTab === 'roles' && (
              <RolesPanel showToast={showToast} onNavigate={setActiveTab} />
            )}
            {activeTab === 'profiles' && (
              <ProfilesPanel
                showToast={showToast}
                onNavigate={setActiveTab}
                onOpenProfile={openProfile}
              />
            )}
            {activeTab === 'permsets' && (
              <PermSetsPanel
                showToast={showToast}
                onNavigate={setActiveTab}
                onOpenPermSet={openPermSet}
              />
            )}
            {activeTab === 'discount' && (
              <DiscountPanel showToast={showToast} onNavigate={setActiveTab} />
            )}
            {activeTab === 'objects' && (
              <ObjectsPanel
                showToast={showToast}
                onNavigate={setActiveTab}
                onOpenObject={(api) => router.push(`/settings/objects/${api}`)}
              />
            )}
            {activeTab === 'fields' && (
              <FieldsPanel
                showToast={showToast}
                onNavigate={setActiveTab}
                selectedObjApi={selectedObjApi}
              />
            )}
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
            {!isFullPanel && (
              <PlaceholderPanel
                showToast={showToast}
                onNavigate={setActiveTab}
                activeTab={activeTab}
              />
            )}
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
