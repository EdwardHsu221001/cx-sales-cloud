'use client';

import { useState, useRef, useCallback } from 'react';
import Accounts from '@/components/crm/Accounts';

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function AccountsPage() {
  const [toast, setToast] = useState({ visible: false, msg: '' });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    setToast({ visible: true, msg });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
  }, []);

  return (
    <>
      <Accounts showToast={showToast} />
      <div className={`cx-toast ${toast.visible ? 'show' : ''}`}>
        <IconCheck />
        <span>{toast.msg}</span>
      </div>
    </>
  );
}
