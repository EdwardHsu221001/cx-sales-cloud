'use client';

import { useState, useCallback, Fragment } from 'react';
import { ChevRight } from '../settings.icons';
import {
  pageLayoutStats,
  filterPalette,
  type PLPaletteTab,
  type PLSection,
} from '../pagelayout.utils';
import {
  PL_OBJECTS,
  PL_PILLS,
  PL_PALETTE,
  PL_SECTIONS_INIT,
  PL_REL,
  PL_ASSIGNED,
  PL_UNASSIGNED,
} from '../settings.data';

function GripDots() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <circle cx="9" cy="6" r="1.4" />
      <circle cx="15" cy="6" r="1.4" />
      <circle cx="9" cy="12" r="1.4" />
      <circle cx="15" cy="12" r="1.4" />
      <circle cx="9" cy="18" r="1.4" />
      <circle cx="15" cy="18" r="1.4" />
    </svg>
  );
}

function PalFieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    </svg>
  );
}

function PLRelIcon({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {c === 'cyan' && (
        <>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
        </>
      )}
      {c === 'green' && (
        <>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18" />
        </>
      )}
      {c === 'orange' && (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6" />
        </>
      )}
      {c === 'violet' && (
        <>
          <rect x="3" y="4.5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 2.5v4M16 2.5v4" />
        </>
      )}
    </svg>
  );
}

export default function PageLayoutPanel({
  showToast,
  onNavigate,
}: {
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
}) {
  const [plObj, setPlObj] = useState(PL_OBJECTS[0]);
  const [plLayout, setPlLayout] = useState(0);
  const [plPalTab, setPlPalTab] = useState<PLPaletteTab>('fields');
  const [plPalSearch, setPlPalSearch] = useState('');
  const [plSections, setPlSections] = useState<PLSection[]>(PL_SECTIONS_INIT);

  const togglePlSection = useCallback((si: number) => {
    setPlSections((prev) => prev.map((s, i) => (i === si ? { ...s, collapsed: !s.collapsed } : s)));
  }, []);
  const removePlField = useCallback(
    (si: number, fi: number) => {
      setPlSections((prev) =>
        prev.map((s, i) => (i === si ? { ...s, fields: s.fields.filter((_, j) => j !== fi) } : s))
      );
      showToast('已移除欄位');
    },
    [showToast]
  );
  const removePlSection = useCallback(
    (si: number) => {
      setPlSections((prev) => prev.filter((_, i) => i !== si));
      showToast('已移除區段');
    },
    [showToast]
  );

  const stats = pageLayoutStats(PL_PILLS);
  const pills = PL_PILLS[plObj] ?? [];
  const palGroups = filterPalette(PL_PALETTE[plPalTab], plPalSearch);
  const palTabs: [PLPaletteTab, string][] = [
    ['fields', '欄位'],
    ['buttons', '按鈕'],
    ['related', '相關清單'],
  ];

  return (
    <div>
      <div className="cx-crumbs">
        <a onClick={() => onNavigate('hub')}>設定</a>
        <ChevRight />
        <span>介面設定</span>
        <ChevRight />
        <span>頁面版面 Page Layout</span>
      </div>
      <div className="cx-set-head">
        <div>
          <h1>
            頁面版面 <span className="en">Page Layout</span>
          </h1>
          <div className="sub">
            設計各物件紀錄頁的欄位區段、相關清單與按鈕配置，並依 Profile
            指派不同版面。拖放左側欄位至區段即可編排。
          </div>
        </div>
        <div className="actions">
          <button className="cx-btn-outline" onClick={() => showToast('開啟版面預覽')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            預覽
          </button>
          <button className="cx-btn-navy" onClick={() => showToast('頁面版面已儲存')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
              <path d="M17 21v-8H7v8M7 3v5h8" />
            </svg>
            儲存版面
          </button>
        </div>
      </div>

      <div className="cx-stat-bar">
        <div className="cx-stat">
          <div className="cx-sic blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <div>
            <div className="cx-snum">{stats.layouts}</div>
            <div className="cx-slbl">版面總數</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic violet">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0" />
            </svg>
          </div>
          <div>
            <div className="cx-snum">{stats.objects}</div>
            <div className="cx-slbl">套用物件</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" />
            </svg>
          </div>
          <div>
            <div className="cx-snum green">{PL_ASSIGNED}</div>
            <div className="cx-slbl">已指派 Profile</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
          </div>
          <div>
            <div className="cx-snum orange">{PL_UNASSIGNED}</div>
            <div className="cx-slbl">未指派 Profile</div>
          </div>
        </div>
      </div>

      <div className="cx-bld-toolbar">
        <div className="cx-bld-sel">
          <span className="lab">物件</span>
          <select
            value={plObj}
            onChange={(e) => {
              setPlObj(e.target.value);
              setPlLayout(0);
              showToast(`已切換至「${e.target.value}」版面`);
            }}
          >
            {PL_OBJECTS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="cx-bld-pills">
          {pills.map((l, i) => (
            <span
              key={l}
              className={`cx-bld-pill ${i === plLayout ? 'on' : ''}`}
              onClick={() => setPlLayout(i)}
            >
              {l}
            </span>
          ))}
        </div>
        <div className="cx-bld-spacer" />
        <div className="cx-bld-save">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          已於 2026/05/30 14:22 儲存
        </div>
      </div>

      <div className="cx-pl-editor">
        {/* palette */}
        <div className="cx-pal-card">
          <div className="cx-pal-tabs">
            {palTabs.map(([k, lab]) => (
              <div
                key={k}
                className={`cx-pal-tab ${plPalTab === k ? 'on' : ''}`}
                onClick={() => setPlPalTab(k)}
              >
                {lab}
              </div>
            ))}
          </div>
          <div className="cx-pal-search">
            <input
              type="text"
              placeholder="搜尋可用項目…"
              value={plPalSearch}
              onChange={(e) => setPlPalSearch(e.target.value)}
            />
          </div>
          <div className="cx-pal-list">
            {palGroups.length === 0 ? (
              <div className="cx-pal-grouplab">查無符合的項目</div>
            ) : (
              palGroups.map((grp) => (
                <Fragment key={grp.g}>
                  <div className="cx-pal-grouplab">{grp.g}</div>
                  {grp.items.map((it) => (
                    <div key={it.n} className="cx-pal-item">
                      <span className="grip">
                        <GripDots />
                      </span>
                      <div className={`cx-pic cx-v-${it.c ?? 'blue'}`}>
                        <PalFieldIcon />
                      </div>
                      <div className="ptx">
                        <div className="pn">{it.n}</div>
                        <div className="pt">{it.t}</div>
                      </div>
                    </div>
                  ))}
                </Fragment>
              ))
            )}
          </div>
        </div>

        {/* canvas */}
        <div className="cx-pl-canvas">
          <div className="cx-pl-rechead">
            <div className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 17l5-5 4 3 8-8" />
                <path d="M16 7h4v4" />
              </svg>
            </div>
            <div>
              <div className="rh-name">Opportunity · 紀錄頁版面</div>
              <h3>{pills[plLayout] ?? plObj}</h3>
            </div>
            <div className="rh-hl">
              <div className="hl">
                <div className="v">NT$ 1.2M</div>
                <div className="k">金額</div>
              </div>
              <div className="hl">
                <div className="v">提案中</div>
                <div className="k">階段</div>
              </div>
              <div className="hl">
                <div className="v">2026/07/15</div>
                <div className="k">預計成交</div>
              </div>
            </div>
          </div>
          <div className="cx-pl-body">
            {plSections.map((s, si) => (
              <div key={si} className={`cx-pl-section ${s.collapsed ? 'collapsed' : ''}`}>
                <div className="cx-pl-sechead" onClick={() => togglePlSection(si)}>
                  <span className="caret">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                  <span className="st">{s.t}</span>
                  <span className="scols">{s.cols} 欄</span>
                  <span className="sact" onClick={(e) => e.stopPropagation()}>
                    <button title="編輯區段" onClick={() => showToast(`編輯區段「${s.t}」`)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>
                    <button title="移除區段" onClick={() => removePlSection(si)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                </div>
                <div className="cx-pl-grid">
                  {s.fields.map((f, fi) =>
                    f.empty ? (
                      <div key={fi} className="cx-pl-field empty">
                        ＋ 拖放欄位至此
                      </div>
                    ) : (
                      <div
                        key={fi}
                        className="cx-pl-field"
                        style={f.full ? { gridColumn: '1 / -1' } : undefined}
                      >
                        <span className="fgrip">
                          <GripDots />
                        </span>
                        <div className="fl">
                          <div className="fn">
                            {f.n}
                            {f.req && <span className="req">*</span>}
                          </div>
                          <div className="ft">{f.t}</div>
                        </div>
                        <button className="fx" title="移除" onClick={() => removePlField(si, fi)}>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
            <button className="cx-pl-addsec" onClick={() => showToast('新增區段')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 5v14M5 12h14" />
              </svg>
              新增區段
            </button>
            <div className="cx-pl-rel">
              <div className="cx-pl-rel-lab">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8" />
                </svg>
                相關清單
              </div>
              <div className="cx-pl-rel-row">
                {PL_REL.map((r) => (
                  <div key={r.n} className="cx-pl-relcard">
                    <div className={`cx-ric cx-pic cx-v-${r.c}`}>
                      <PLRelIcon c={r.c} />
                    </div>
                    <div className="rn">
                      {r.n}
                      <small>{r.s}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
