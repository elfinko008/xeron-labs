'use client'
import dynamic from 'next/dynamic'

const OceanDepthBackgroundInner = dynamic(
  () => import('./OceanDepthBackground').then(m => ({ default: m.OceanDepthBackground })),
  { ssr: false }
)

export function OceanDepthBackgroundDynamic() {
  return <OceanDepthBackgroundInner />
}
