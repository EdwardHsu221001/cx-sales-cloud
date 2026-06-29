'use client';

import { IconClose } from './icons';

/** Leads/Accounts 共用的刪除確認對話框。維持既有 cx-modal-* / role=dialog 結構。 */
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  ariaLabel = '刪除確認',
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  ariaLabel?: string;
}) {
  return (
    <div className={`cx-modal-overlay${open ? ' open' : ''}`}>
      <div className="cx-modal" role="dialog" aria-label={ariaLabel}>
        <div className="cx-modal-head">
          <div>
            <h2>{title}</h2>
            <div className="ms">{message}</div>
          </div>
          <button className="x" onClick={onCancel}>
            <IconClose />
          </button>
        </div>
        <div className="cx-modal-foot">
          <div className="grp">
            <button className="cx-btn-ghost" onClick={onCancel}>
              取消
            </button>
            <button className="cx-btn-confirm" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}