'use client';

import { useState, Fragment } from 'react';
import {
  ChevRight,
  ChevLeft,
  XIcon,
  PlusIcon,
  EditIcon,
  InfoIcon,
  UserGrpIcon,
} from '../settings.icons';
import type { RoleNode, RPerson } from '../settings.types';
import { GRAD, ORG_NAME, ROLE_HIER, RPEOPLE_INIT } from '../settings.data';

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

export default function RolesPanel({
  showToast,
  onNavigate,
}: {
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
}) {
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
        <a onClick={() => onNavigate('hub')}>設定</a>
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
