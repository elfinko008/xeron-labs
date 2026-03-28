'use client'
import dynamic from 'next/dynamic'

const Feed = dynamic(() => import('./LiveActivityFeed').then(m => ({ default: m.LiveActivityFeed })), { ssr: false })

export function LiveActivityFeedDynamic() {
  return <Feed />
}
