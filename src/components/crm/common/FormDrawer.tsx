'use client';

import type { ReactNode } from 'react';
import { IconClose } from './icons';

/**
 * Leads/Accounts/Contacts 共用的「新增/編輯表單抽屜」外框（非唯讀詳情抽屜）。
 * 只負責 chrome（麵包屑/標題/取消儲存）；欄位由呼叫端以 children 提供。
 * 由呼叫端條件掛載（掛載即開啟）；Escape 由呼叫端的全域 keydown 處理。
 */
export default function FormDrawer({
  crumbRoot,
  noun,
  isEdit,
  onClose,
  onSave,
  children,
}: {
  crumbRoot: string;
  noun: string;
  isEdit: boolean;
  onClose: () => void;
  onSave: () => void;
  children: ReactNode;
}) {
  const action = isEdit ? '編輯' : '新增';
  const title = `${action}${noun}`;
  return (
    <>
      <div className="cx-drawer-scrim open" onClick={onClose} />
      <aside className="cx-drawer open" aria-label={title}>
        <div className="cx-dw-top">
          <div className="cx-dw-bar">
            <span className="crumb">
              <b>{crumbRoot}</b> ／ {action}
            </span>
            <span className="sp" style={{ flex: 1 }} />
            <button className="cx-dw-iconbtn" aria-label="關閉" onClick={onClose}>
              <IconClose />
            </button>
          </div>
          <div className="cx-emf-hero">
            <h2>{title}</h2>
          </div>
        </div>

        <div className="cx-dw-body cx-emf-body">
          <div className="cx-emf-grid">{children}</div>
        </div>

        <div className="cx-emf-foot">
          <button className="cx-btn-outline" onClick={onClose}>
            取消
          </button>
          <button className="cx-btn-navy" onClick={onSave}>
            儲存
          </button>
        </div>
      </aside>
    </>
  );
}
