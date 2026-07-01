'use client';

import { useState, Fragment } from 'react';
import { XIcon, PlusIcon, ChevRight} from '../settings.icons';
import {
  splitMergeText,
  filterEmailTemplates,
  emailStats,
  validateTemplateDraft,
  applyTemplateEdit,
  type EmailTemplate,
} from '../email.utils';
import { EMAIL_CATS, EMAIL_SENT_30D, EMAIL_TEMPLATES_INIT, EMAIL_MERGE } from '../settings.data';

const EMAIL_ICON_PATHS: Record<string, React.ReactNode> = {
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </>
  ),
  chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />,
  trophy: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0Z" />
      <path d="M7 4H4v2a3 3 0 0 0 3 3M17 4h3v2a3 3 0 0 0-3 3" />
    </>
  ),
  welcome: (
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 7h18v4a2 2 0 0 0 0 4v2H3v-2a2 2 0 0 0 0-4Z" />
      <path d="M13 7v10" />
    </>
  ),
  checkc: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </>
  ),
  gavel: (
    <>
      <path d="m14 13-7.5 7.5a2.1 2.1 0 0 1-3-3L11 10" />
      <path d="m13 8 3-3M9 12l7 7M16 5l3 3M5 19h6" />
    </>
  ),
  news: (
    <>
      <path d="M4 4h13v16H6a2 2 0 0 1-2-2Z" />
      <path d="M17 8h3v10a2 2 0 0 1-2 2" />
      <path d="M7 8h7M7 12h7M7 16h4" />
    </>
  ),
  back: (
    <>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h11a6 6 0 0 1 0 12h-3" />
    </>
  ),
};

function EmailIco({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {EMAIL_ICON_PATHS[name]}
    </svg>
  );
}

/** 將含合併欄位的字串渲染為高亮節點。 */
function MergeText({ text }: { text: string }) {
  return (
    <>
      {splitMergeText(text).map((part, i) =>
        part.isMergeField ? (
          <span key={i} className="cx-em-mf">
            {part.text}
          </span>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        )
      )}
    </>
  );
}

export default function EmailPanel({
  showToast,
  onNavigate,
}: {
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
}) {
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(EMAIL_TEMPLATES_INIT);
  const [emailSel, setEmailSel] = useState(EMAIL_TEMPLATES_INIT[0].k);
  const [emailSearch, setEmailSearch] = useState('');
  const [emailDraft, setEmailDraft] = useState<EmailTemplate | null>(null);
  const stats = emailStats(emailTemplates, EMAIL_CATS);
  const filtered = filterEmailTemplates(emailTemplates, EMAIL_CATS, emailSearch);
  const selected = emailTemplates.find((t) => t.k === emailSel) ?? emailTemplates[0];
  const selCat = EMAIL_CATS[selected.cat];

  return (
    <div>
      <div className="cx-crumbs">
        <a onClick={() => onNavigate('hub')}>設定</a>
        <ChevRight />
        <span>系統整合</span>
        <ChevRight />
        <span>郵件設定</span>
      </div>
      <div className="cx-set-head">
        <div>
          <h1>
            郵件設定 <span className="en">Email Templates</span>
          </h1>
          <div className="sub">
            管理系統與業務流程使用的電子郵件範本。範本支援合併欄位，於寄送時自動帶入紀錄資料；可指派至自動化流程、審核通知與手動寄送。
          </div>
        </div>
        <div className="actions">
          <button
            className="cx-btn-outline"
            onClick={() => showToast('已寄出測試郵件至 chen.xm@cxcrm.com')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
            測試寄送
          </button>
          <button className="cx-btn-navy" onClick={() => showToast('建立新郵件範本')}>
            <PlusIcon />
            新增範本
          </button>
        </div>
      </div>

      <div className="cx-stat-bar">
        <div className="cx-stat">
          <div className="cx-sic blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </div>
          <div>
            <div className="cx-snum">{stats.total}</div>
            <div className="cx-slbl">範本總數</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" />
              <path d="M22 4 12 14.1l-3-3" />
            </svg>
          </div>
          <div>
            <div className="cx-snum green" aria-label="啟用中範本數">
              {stats.active}
            </div>
            <div className="cx-slbl">啟用中</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic violet">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7h18M3 12h18M3 17h10" />
            </svg>
          </div>
          <div>
            <div className="cx-snum">{stats.categories}</div>
            <div className="cx-slbl">範本分類</div>
          </div>
        </div>
        <div className="cx-stat">
          <div className="cx-sic orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </div>
          <div>
            <div className="cx-snum orange">{EMAIL_SENT_30D}</div>
            <div className="cx-slbl">近 30 日寄送</div>
          </div>
        </div>
      </div>

      <div className="cx-em-split">
        {/* list */}
        <div className="cx-em-list">
          <div className="cx-em-lsearch">
            <input
              type="search"
              aria-label="搜尋範本"
              placeholder="搜尋範本名稱或主旨…"
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
            />
          </div>
          <div className="cx-em-lbody">
            {filtered.length === 0 ? (
              <div className="cx-em-empty">查無符合的範本</div>
            ) : (
              Object.keys(EMAIL_CATS).map((ck) => {
                const rows = filtered.filter((t) => t.cat === ck);
                if (!rows.length) return null;
                const c = EMAIL_CATS[ck];
                return (
                  <Fragment key={ck}>
                    <div className="cx-em-cat">
                      <span className="cdot" style={{ background: c.hex }} />
                      {c.nm}
                    </div>
                    {rows.map((t) => (
                      <div
                        key={t.k}
                        className={`cx-em-trow ${t.k === emailSel ? 'on' : ''}`}
                        onClick={() => setEmailSel(t.k)}
                      >
                        <div className={`cx-em-tic v-${c.v}`}>
                          <EmailIco name={t.icon} />
                        </div>
                        <div className="ttx">
                          <div className="tn">{t.name}</div>
                          <div className="ts">
                            {c.nm} · 最後使用 {t.used}
                          </div>
                        </div>
                        <span
                          className={`tstat ${t.on ? '' : 'off'}`}
                          title={t.on ? '啟用中' : '停用'}
                        />
                      </div>
                    ))}
                  </Fragment>
                );
              })
            )}
          </div>
        </div>

        {/* detail */}
        <div className="cx-em-detail">
          <div className="cx-em-card">
            <div className="cx-em-dhead">
              <div className={`dic v-${selCat.v}`}>
                <EmailIco name={selected.icon} />
              </div>
              <div className="dt">
                <h3>
                  {selected.name}
                  <span className={`cx-em-pill ${selected.on ? 'on' : 'off'}`}>
                    <span className="d" />
                    {selected.on ? '啟用中' : '停用'}
                  </span>
                </h3>
                <div className="dsub">
                  {selCat.nm} · 範本 API：Email_{selected.k} · 最後修改 {selected.used}
                </div>
              </div>
              <div className="dact">
                <button
                  className="cx-em-btn-sm"
                  onClick={() => showToast(`已複製範本「${selected.name}」`)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                  </svg>
                  複製
                </button>
                <button
                  className="cx-em-btn-sm pri"
                  onClick={() => setEmailDraft(structuredClone(selected))}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  編輯範本
                </button>
              </div>
            </div>

            <div className="cx-em-meta">
              {[
                ['寄件者', selected.from],
                ['收件對象', selected.to],
                ['分類', selCat.nm],
                ['語言 / 編碼', `${selected.lang} · UTF-8`],
              ].map(([k, v]) => (
                <div className="mc" key={k}>
                  <div className="mk">{k}</div>
                  <div className="mv">
                    <MergeText text={v} />
                  </div>
                </div>
              ))}
            </div>

            <div className="cx-em-subj">
              <span className="sl">主旨</span>
              <span className="sv">
                <MergeText text={selected.subj} />
              </span>
            </div>

            <div className="cx-em-canvas">
              <div className="cx-em-mail">
                <div className="cx-em-mail-top" />
                <div className="cx-em-mail-brand">
                  <div className="mk">C</div>
                  <div className="bn">
                    CX <b>CRM</b>
                  </div>
                </div>
                <div className="cx-em-mail-body">
                  {selected.body.map((b, i) => {
                    if (b.kind === 'greet')
                      return (
                        <p className="greet" key={i}>
                          <MergeText text={b.text} />
                        </p>
                      );
                    if (b.kind === 'p')
                      return (
                        <p key={i}>
                          <MergeText text={b.text} />
                        </p>
                      );
                    if (b.kind === 'cta')
                      return (
                        <a
                          className="cx-em-cta"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          key={i}
                        >
                          {b.text}
                        </a>
                      );
                    if (b.kind === 'quote')
                      return (
                        <div className="cx-em-quote-box" key={i}>
                          {b.rows.map((r, j) => (
                            <div className="qr" key={j}>
                              <span className="qk">{r[0]}</span>
                              <span>
                                <MergeText text={r[1]} />
                              </span>
                            </div>
                          ))}
                          {b.total && (
                            <div className="qr tot">
                              <span>{b.total[0]}</span>
                              <span>
                                <MergeText text={b.total[1]} />
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    // sig
                    return (
                      <div className="cx-em-sig" key={i}>
                        <div className="sn">
                          <MergeText text={b.sig.name} />
                        </div>
                        {b.sig.title && (
                          <>
                            <MergeText text={b.sig.title} />
                            <br />
                          </>
                        )}
                        {b.sig.phone && <MergeText text={b.sig.phone} />}
                      </div>
                    );
                  })}
                </div>
                <div className="cx-em-mail-foot">
                  CX CRM · 台北市內湖區瑞光路 ××× 號　|　本郵件由系統自動發送，請勿直接回覆
                  <br />
                  若不願再收到此類通知，可於偏好設定中調整訂閱。
                </div>
              </div>
            </div>
          </div>

          {/* merge fields */}
          <div className="cx-em-card cx-em-mergecard">
            <div className="cx-em-merge-h">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7V4h16v3M9 20h6M12 4v16" />
              </svg>
              可用合併欄位
            </div>
            <div className="cx-em-merge-sub">
              點擊欄位即可插入游標位置；寄送時以實際紀錄資料替換。
            </div>
            {EMAIL_MERGE.map((grp) => (
              <div className="cx-em-merge-grp" key={grp.g}>
                <div className="cx-em-merge-gl">{grp.g}</div>
                <div className="cx-em-merge-chips">
                  {grp.f.map((f) => (
                    <span
                      className="cx-em-chip"
                      key={f}
                      onClick={() => showToast(`已複製合併欄位 ${f}`)}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Edit Drawer ── */}
      {emailDraft &&
        (() => {
          const draft = emailDraft;
          const v = validateTemplateDraft(draft);
          const setField = (patch: Partial<EmailTemplate>) =>
            setEmailDraft((d) => (d ? { ...d, ...patch } : d));
          const setBlockText = (idx: number, text: string) =>
            setEmailDraft((d) =>
              d
                ? {
                    ...d,
                    body: d.body.map((b, i) =>
                      i === idx && (b.kind === 'greet' || b.kind === 'p' || b.kind === 'cta')
                        ? { ...b, text }
                        : b
                    ),
                  }
                : d
            );
          const close = () => setEmailDraft(null);
          const save = () => {
            if (!validateTemplateDraft(draft).ok) return;
            setEmailTemplates((list) => applyTemplateEdit(list, draft));
            showToast('範本已更新');
            setEmailDraft(null);
          };
          return (
            <>
              <div className="cx-drawer-scrim open" onClick={close} />
              <aside className="cx-drawer open" aria-label="編輯範本">
                <div className="cx-dw-top">
                  <div className="cx-dw-bar">
                    <span className="crumb">
                      <b>郵件範本</b> ／ 編輯
                    </span>
                    <div style={{ flex: 1 }} />
                    <button className="cx-dw-iconbtn" onClick={close} aria-label="關閉">
                      <XIcon />
                    </button>
                  </div>
                  <div className="cx-emf-hero">
                    <h2>編輯範本</h2>
                    <div className="sub">範本 API：Email_{draft.k}（識別碼不可變更）</div>
                  </div>
                </div>

                <div className="cx-dw-body cx-emf-body">
                  <div className="cx-emf-grid">
                    <label className="cx-emf-field span2">
                      <span className="l">範本名稱</span>
                      <input
                        value={draft.name}
                        onChange={(e) => setField({ name: e.target.value })}
                      />
                      {v.nameError && <span className="err">{v.nameError}</span>}
                    </label>

                    <div className="cx-emf-field">
                      <span className="l">啟用狀態</span>
                      <div className="cx-emf-toggle">
                        <span
                          className={`cx-toggle ${draft.on ? '' : 'off'}`}
                          role="switch"
                          aria-checked={draft.on}
                          aria-label="啟用狀態"
                          onClick={() => setField({ on: !draft.on })}
                        />
                        <span className="t">{draft.on ? '啟用中' : '停用'}</span>
                      </div>
                    </div>

                    <label className="cx-emf-field">
                      <span className="l">分類</span>
                      <select value={draft.cat} onChange={(e) => setField({ cat: e.target.value })}>
                        {Object.keys(EMAIL_CATS).map((ck) => (
                          <option key={ck} value={ck}>
                            {EMAIL_CATS[ck].nm}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="cx-emf-field">
                      <span className="l">寄件者</span>
                      <input
                        value={draft.from}
                        onChange={(e) => setField({ from: e.target.value })}
                      />
                    </label>

                    <label className="cx-emf-field">
                      <span className="l">收件對象</span>
                      <input value={draft.to} onChange={(e) => setField({ to: e.target.value })} />
                    </label>

                    <label className="cx-emf-field">
                      <span className="l">語言</span>
                      <input
                        value={draft.lang}
                        onChange={(e) => setField({ lang: e.target.value })}
                      />
                    </label>

                    <label className="cx-emf-field span2">
                      <span className="l">主旨</span>
                      <input
                        value={draft.subj}
                        onChange={(e) => setField({ subj: e.target.value })}
                      />
                      {v.subjError && <span className="err">{v.subjError}</span>}
                    </label>
                  </div>

                  <div className="cx-emf-blocks">
                    <div className="cx-emf-blocks-h">內文區塊</div>
                    {draft.body.map((b, i) => {
                      if (b.kind === 'greet' || b.kind === 'p' || b.kind === 'cta') {
                        const label =
                          b.kind === 'greet' ? '問候' : b.kind === 'cta' ? '行動按鈕文字' : '段落';
                        return (
                          <label className="cx-emf-block" key={i}>
                            <span className="l">{label}</span>
                            <textarea
                              rows={b.kind === 'cta' ? 1 : 3}
                              value={b.text}
                              onChange={(e) => setBlockText(i, e.target.value)}
                            />
                          </label>
                        );
                      }
                      const ro = b.kind === 'quote' ? '報價表' : '簽名';
                      return (
                        <div className="cx-emf-block ro" key={i}>
                          <span className="l">
                            {ro}
                            <span className="rotag">唯讀</span>
                          </span>
                          <div className="note">此區塊維持原結構，本版不可編輯。</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="cx-emf-foot">
                  <button className="cx-btn-outline" onClick={close}>
                    取消
                  </button>
                  <button className="cx-btn-navy" disabled={!v.ok} onClick={save}>
                    儲存
                  </button>
                </div>
              </aside>
            </>
          );
        })()}
    </div>
  );
}
