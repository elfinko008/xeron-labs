'use client';

import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const XERON_PRICE = 4.99;

export default function PricingCalculator() {
  const uid               = useId();
  const [scripts, setScripts]   = useState(10);
  const [hours, setHours]       = useState(3);
  const [rate, setRate]         = useState(25);

  const manualCost = scripts * hours * rate;
  const savings    = Math.max(0, manualCost - XERON_PRICE);
  const savingsPct = manualCost > 0 ? Math.round((savings / manualCost) * 100) : 0;

  return (
    <div
      className="lg-card"
      style={{ padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <span className="lg-badge" style={{ marginBottom: '12px' }}>ROI Calculator</span>
        <h3
          className="t-headline"
          style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--t-1)' }}
        >
          How much could you save?
        </h3>
        <p className="t-body" style={{ color: 'var(--t-2)', fontSize: '0.875rem', marginTop: '4px' }}>
          Adjust the sliders to see your monthly savings with XERON.
        </p>
      </div>

      {/* Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Scripts per month */}
        <SliderField
          id={`${uid}-scripts`}
          label="Scripts per month"
          value={scripts}
          min={1} max={50}
          display={`${scripts}`}
          onChange={setScripts}
        />

        {/* Hours per script */}
        <SliderField
          id={`${uid}-hours`}
          label="Hours per script"
          value={hours}
          min={1} max={8}
          display={`${hours}h`}
          onChange={setHours}
        />

        {/* Hourly rate */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label
              htmlFor={`${uid}-rate`}
              style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--t-2)' }}
            >
              Your hourly rate
            </label>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--gold-400)' }}>
              {rate}€/h
            </span>
          </div>
          <input
            id={`${uid}-rate`}
            type="number"
            className="lg-input"
            value={rate}
            min={1}
            max={500}
            onChange={e => setRate(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: 'var(--glass-border-gold)',
        margin: '28px 0',
      }} />

      {/* Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ResultRow label="Manual cost" value={`${manualCost.toFixed(2)}€/month`} muted />
        <ResultRow label="XERON Starter" value={`${XERON_PRICE.toFixed(2)}€/month`} muted />

        {/* Savings — animated */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 18px',
          background: 'rgba(212,160,23,0.08)',
          border: '1px solid rgba(212,160,23,0.25)',
          borderRadius: '10px',
          marginTop: '4px',
        }}>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--t-1)' }}>
            You save
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={`${savings.toFixed(2)}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22 }}
              className="text-gold-gradient"
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {savings.toFixed(2)}€/month ({savingsPct}%)
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* CTA */}
      <a
        href="/shop"
        className="btn-luxury btn-luxury-pulse"
        style={{ display: 'block', textAlign: 'center', marginTop: '24px', textDecoration: 'none' }}
      >
        Start saving — Get XERON Starter
      </a>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

interface SliderFieldProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  display: string;
  onChange: (v: number) => void;
}

function SliderField({ id, label, value, min, max, display, onChange }: SliderFieldProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label htmlFor={id} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--t-2)' }}>
          {label}
        </label>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--gold-400)' }}>
          {display}
        </span>
      </div>
      <div style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
        {/* Track fill */}
        <div style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          height: '4px', width: '100%',
          background: 'rgba(255,255,255,0.08)', borderRadius: '2px',
        }} />
        <div style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          height: '4px', width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--gold-600), var(--gold-400))',
          borderRadius: '2px',
          transition: 'width 0.1s',
        }} />
        <input
          id={id}
          type="range"
          min={min} max={max}
          value={value}
          onChange={e => onChange(parseInt(e.target.value))}
          style={{
            position: 'relative', width: '100%',
            appearance: 'none', background: 'transparent',
            height: '20px', cursor: 'pointer',
            // Thumb styled via globals or inline (webkit)
          }}
        />
      </div>
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold-600), var(--gold-400));
          box-shadow: 0 0 8px rgba(212,160,23,0.55);
          cursor: grab;
        }
        input[type='range']:active::-webkit-slider-thumb { cursor: grabbing; }
        input[type='range']::-moz-range-thumb {
          width: 18px; height: 18px; border: none; border-radius: 50%;
          background: linear-gradient(135deg, var(--gold-600), var(--gold-400));
          box-shadow: 0 0 8px rgba(212,160,23,0.55);
          cursor: grab;
        }
      `}</style>
    </div>
  );
}

interface ResultRowProps {
  label: string;
  value: string;
  muted?: boolean;
}

function ResultRow({ label, value, muted }: ResultRowProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--t-2)' }}>{label}</span>
      <span style={{
        fontSize: '0.9rem',
        fontWeight: 600,
        color: muted ? 'var(--t-2)' : 'var(--t-1)',
        fontFamily: "'Outfit', monospace",
      }}>
        {value}
      </span>
    </div>
  );
}
