'use client'
import { useState } from 'react'
import { X, Shield, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  isOpen: boolean
  onClose: () => void
  onAccept: (waiverText: string) => void
  productName: string
  amountEur: number
}

export const WAIVER_TEXT_EN = `I acknowledge that I am purchasing digital content (credits/subscription) that is made immediately available upon payment. In accordance with §356 para. 5 of the German Civil Code (BGB), I expressly waive my 14-day right of withdrawal for this digital content. I confirm that I have been informed of this waiver and that I agree to it.`

export function WithdrawalWaiverModal({ isOpen, onClose, onAccept, productName, amountEur }: Props) {
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)

  const canProceed = check1 && check2

  const handleAccept = () => {
    if (!canProceed) return
    onAccept(WAIVER_TEXT_EN)
  }

  const handleClose = () => {
    setCheck1(false)
    setCheck2(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', zIndex: 9980, backdropFilter: 'blur(12px)' }}
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 9985, width: '100%', maxWidth: 580, padding: '0 16px' }}
          >
            <div className="lg-modal" style={{ padding: '36px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={20} color="var(--gold-400)" />
                  </div>
                  <div>
                    <div className="t-headline" style={{ fontSize: 18 }}>Complete Your Purchase</div>
                    <div style={{ color: 'var(--t-3)', fontSize: 14 }}>{productName} — {amountEur.toFixed(2)} €</div>
                  </div>
                </div>
                <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t-3)', padding: 4 }} aria-label="Close">
                  <X size={20} />
                </button>
              </div>

              <div style={{ background: 'rgba(212,160,23,0.06)', border: '1px solid rgba(212,160,23,0.15)', borderRadius: 16, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <AlertTriangle size={16} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ color: 'var(--t-2)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  Digital content is made immediately available after payment. Please read and confirm the following before purchasing.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                <label style={{ display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'flex-start' }}>
                  <input type="checkbox" checked={check1} onChange={e => setCheck1(e.target.checked)}
                    style={{ marginTop: 3, width: 18, height: 18, accentColor: 'var(--gold-500)', flexShrink: 0, cursor: 'pointer' }} />
                  <span style={{ color: 'var(--t-2)', fontSize: 13, lineHeight: 1.65 }}>
                    {WAIVER_TEXT_EN}
                  </span>
                </label>

                <label style={{ display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'flex-start' }}>
                  <input type="checkbox" checked={check2} onChange={e => setCheck2(e.target.checked)}
                    style={{ marginTop: 3, width: 18, height: 18, accentColor: 'var(--gold-500)', flexShrink: 0, cursor: 'pointer' }} />
                  <span style={{ color: 'var(--t-2)', fontSize: 13, lineHeight: 1.65 }}>
                    I have read and agree to the{' '}
                    <a href="/terms" target="_blank" style={{ color: 'var(--gold-400)', textDecoration: 'underline' }}>Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" target="_blank" style={{ color: 'var(--gold-400)', textDecoration: 'underline' }}>Privacy Policy</a>.
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-luxury" onClick={handleAccept} disabled={!canProceed}
                  style={{ flex: 1, opacity: canProceed ? 1 : 0.4, cursor: canProceed ? 'pointer' : 'not-allowed', transition: 'opacity 0.3s' }}>
                  Proceed to Payment →
                </button>
                <button className="btn-glass" onClick={handleClose} style={{ padding: '14px 20px' }}>Cancel</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
