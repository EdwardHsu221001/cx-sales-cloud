import { STATUS_MAP } from './settings.data';

// 跨 shell（含 DetailDrawer）與各面板共用的展示型子元件。
export function StatusBadge({ s }: { s: 'active' | 'inactive' | 'pending' }) {
  const m = STATUS_MAP[s];
  return (
    <span className={`cx-status ${m.cls}`}>
      <span className="pip" />
      {m.lbl}
    </span>
  );
}
