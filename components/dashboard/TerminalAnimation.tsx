'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TerminalAnimationProps {
  tasks: string[]
  completedTasks: number[]
  isRunning: boolean
}

// ─── Typing line ──────────────────────────────────────────────────────────────

function TypingLine({
  text,
  delay = 0,
  onDone,
}: {
  text: string
  delay?: number
  onDone?: () => void
}) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return

    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        onDone?.()
      }
    }, 22)

    return () => clearInterval(interval)
  }, [started, text, onDone])

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <span
          style={{
            display: 'inline-block',
            width: 7,
            height: 14,
            background: 'var(--gold-400)',
            marginLeft: 2,
            verticalAlign: 'middle',
            animation: 'cursorBlink 0.8s step-start infinite',
          }}
        />
      )}
    </span>
  )
}

// ─── Terminal Animation ───────────────────────────────────────────────────────

export default function TerminalAnimation({
  tasks,
  completedTasks,
  isRunning,
}: TerminalAnimationProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [visibleTasks, setVisibleTasks] = useState<number[]>([])

  const progressPct =
    tasks.length > 0
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0

  // Reveal tasks one by one when running
  useEffect(() => {
    if (!isRunning) return

    setVisibleTasks([])
    tasks.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleTasks(prev => (prev.includes(idx) ? prev : [...prev, idx]))
      }, idx * 420)
    })
  }, [isRunning, tasks])

  // Auto-scroll to bottom
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [visibleTasks])

  const isComplete = (idx: number) => completedTasks.includes(idx)
  const isActive   = (idx: number) =>
    isRunning &&
    !isComplete(idx) &&
    visibleTasks.includes(idx) &&
    (completedTasks.length === idx ||
      (idx === 0 && completedTasks.length === 0))

  return (
    <div
      className="terminal"
      style={{ display: 'flex', flexDirection: 'column', gap: 0, minHeight: 180 }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        {['#F87171', '#FBBF24', '#4ADE80'].map((c, i) => (
          <span
            key={i}
            style={{
              width: 10, height: 10,
              borderRadius: '50%',
              background: c,
              opacity: 0.8,
            }}
          />
        ))}
        <span
          style={{
            marginLeft: 8,
            fontSize: 11,
            color: 'var(--t-3)',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          xeron-engine — terminal
        </span>
        {isRunning && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 11,
              color: 'var(--gold-400)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} />
            running...
          </span>
        )}
      </div>

      {/* Task lines */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          maxHeight: 220,
        }}
      >
        <AnimatePresence initial={false}>
          {visibleTasks.map(idx => {
            const task   = tasks[idx]
            const done   = isComplete(idx)
            const active = isActive(idx)

            return (
              <motion.div
                key={`task-${idx}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                }}
              >
                {/* Status icon */}
                <span style={{ flexShrink: 0, marginTop: 1 }}>
                  {done ? (
                    <CheckCircle2 size={14} style={{ color: '#4ADE80' }} />
                  ) : active ? (
                    <Loader2 size={14} style={{ color: 'var(--gold-400)', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Circle size={14} style={{ color: 'var(--t-3)' }} />
                  )}
                </span>

                {/* Prompt prefix */}
                <span className="terminal-prompt" style={{ flexShrink: 0 }}>
                  &gt;&gt;
                </span>

                {/* Task text */}
                <span
                  className={done ? 'terminal-success' : 'terminal-text'}
                  style={{ lineHeight: 1.5 }}
                >
                  {done ? (
                    task
                  ) : (
                    <TypingLine text={task} delay={0} />
                  )}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Idle placeholder */}
        {!isRunning && visibleTasks.length === 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
            }}
          >
            <span className="terminal-prompt">&gt;&gt;</span>
            <span className="terminal-text" style={{ color: 'var(--t-3)' }}>
              Waiting for task...
              <span
                style={{
                  display: 'inline-block',
                  width: 7,
                  height: 13,
                  background: 'var(--t-3)',
                  marginLeft: 4,
                  verticalAlign: 'middle',
                  animation: 'cursorBlink 1s step-start infinite',
                }}
              />
            </span>
          </div>
        )}
      </div>

      {/* Gold progress bar */}
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
            fontSize: 11,
            color: 'var(--t-3)',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <span>Progress</span>
          <span style={{ color: progressPct === 100 ? '#4ADE80' : 'var(--gold-400)' }}>
            {progressPct}%
          </span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      {/* Inline keyframes injected via style tag */}
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
