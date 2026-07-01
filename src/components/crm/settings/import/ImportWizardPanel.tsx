'use client';

import { useState, useRef, Fragment } from 'react';
import { ChevRight, ChevLeft } from '../settings.icons';

export default function ImportWizardPanel({
  showToast,
  onNavigate,
}: {
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
}) {
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
        <span className="cx-crumb-link" onClick={() => onNavigate('import')}>
          匯入批次設定
        </span>
        <ChevRight />
        <span>系統匯入精靈</span>
      </div>
      <div className="cx-set-head">
        <div>
          <button className="cx-btn-back" onClick={() => onNavigate('import')}>
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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                      <div className="oc-ic">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                  onClick={() => onNavigate('import')}
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
