'use client'

import { useState, useRef, useCallback } from 'react'
import Contacts from '@/components/crm/Contacts'

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export default function ContactsPage() {
  const [toast, setToast] = useState({ visible: false, msg: '' })
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const showToast = useCallback((msg: string) => {
    setToast({ visible: true, msg })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2200)
  }, [])

  return (
    <>
      <Contacts showToast={showToast} />
      <div className={`cx-toast ${toast.visible ? 'show' : ''}`}>
        <IconCheck />
        <span>{toast.msg}</span>
      </div>
    </>
  )
}
