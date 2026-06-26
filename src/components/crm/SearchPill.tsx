'use client';

/** Leads/Accounts 共用的關鍵字搜尋框。維持既有 cx-fpill cx-lead-search 結構與可及性。 */
export default function SearchPill({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
}) {
  return (
    <div className="cx-fpill cx-lead-search">
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
