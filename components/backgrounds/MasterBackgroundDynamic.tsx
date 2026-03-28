'use client'
import dynamic from 'next/dynamic'

const MasterBg = dynamic(() => import('./MasterBackground').then(m => ({ default: m.MasterBackground })), { ssr: false })

export function MasterBackgroundDynamic() {
  return <MasterBg />
}
