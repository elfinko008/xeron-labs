'use client';

import type * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';

// ── WebGL detection ──────────────────────────────────────────────────────────
function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

// ── CSS fallback ─────────────────────────────────────────────────────────────
function FallbackScene() {
  return (
    <div style={{
      width: '100%', height: '100%', minHeight: '400px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, rgba(212,160,23,0.08) 0%, transparent 70%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Static hexagon */}
      <div style={{
        width: '160px', height: '92px',
        background: 'linear-gradient(135deg, rgba(212,160,23,0.15), rgba(212,160,23,0.05))',
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        border: '1px solid rgba(212,160,23,0.4)',
        position: 'relative',
        animation: 'fallbackSpin 8s linear infinite',
      }} />
      {/* Floating shapes */}
      {[
        { size: 24, top: '20%', left: '20%', delay: '0s' },
        { size: 16, top: '70%', left: '75%', delay: '1s' },
        { size: 20, top: '30%', left: '80%', delay: '2s' },
        { size: 12, top: '65%', left: '18%', delay: '0.5s' },
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: s.size, height: s.size,
          background: 'linear-gradient(135deg, rgba(212,160,23,0.3), rgba(212,160,23,0.1))',
          border: '1px solid rgba(212,160,23,0.4)',
          borderRadius: i % 2 === 0 ? '4px' : '50%',
          top: s.top, left: s.left,
          animation: `fallbackFloat 3s ease-in-out ${s.delay} infinite alternate`,
        }} />
      ))}
      <style>{`
        @keyframes fallbackSpin  { to { transform: rotateY(360deg); } }
        @keyframes fallbackFloat { to { transform: translateY(-12px); } }
      `}</style>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function XeronScene() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const mountedRef    = useRef(false);
  const mouseRef      = useRef({ x: 0, y: 0 });
  const [webglOk, setWebglOk] = useState<boolean | null>(null); // null = not determined yet

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    if (!canUseWebGL()) {
      setWebglOk(false);
      return;
    }
    setWebglOk(true);

    let animId: number;
    let THREE: typeof import('three');

    const canvas    = canvasRef.current!;
    const container = containerRef.current!;

    import('three').then(mod => {
      THREE = mod;

      // ── Renderer ──
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;

      // ── Scene / Camera ──
      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        55,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 2.5, 6);
      camera.lookAt(0, 0, 0);

      // ── Lights ──
      const ambient = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambient);

      const pointLight = new THREE.PointLight(0xd4a017, 3, 20);
      pointLight.position.set(3, 4, 3);
      pointLight.castShadow = true;
      scene.add(pointLight);

      const rimLight = new THREE.PointLight(0x4488ff, 1.2, 15);
      rimLight.position.set(-4, 2, -3);
      scene.add(rimLight);

      // ── Hexagonal platform ──
      const hexGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.25, 6, 1);
      const hexMat = new THREE.MeshStandardMaterial({
        color: 0xd4a017,
        metalness: 0.92,
        roughness: 0.12,
        envMapIntensity: 1.0,
      });
      const platform = new THREE.Mesh(hexGeo, hexMat);
      platform.castShadow    = true;
      platform.receiveShadow = true;
      scene.add(platform);

      // Hex edge ring
      const edgeGeo = new THREE.CylinderGeometry(2.22, 2.22, 0.27, 6, 1, true);
      const edgeMat = new THREE.MeshStandardMaterial({
        color: 0xf5d87a,
        metalness: 1, roughness: 0.05,
        emissive: new THREE.Color(0xd4a017),
        emissiveIntensity: 0.3,
        side: THREE.BackSide,
      });
      platform.add(new THREE.Mesh(edgeGeo, edgeMat));

      // ── Floating shapes ──
      const floaters: Array<{
        mesh: THREE.Mesh;
        orbitRadius: number;
        orbitSpeed: number;
        orbitOffset: number;
        bobSpeed: number;
        bobAmplitude: number;
        bobOffset: number;
      }> = [];

      const floaterConfigs = [
        { geo: new THREE.OctahedronGeometry(0.35),    r: 3.2, os: 0.6,  color: 0xe8c44a, met: 0.9, rough: 0.1 },
        { geo: new THREE.TetrahedronGeometry(0.28),   r: 2.6, os: 1.1,  color: 0xd4a017, met: 0.8, rough: 0.2 },
        { geo: new THREE.BoxGeometry(0.3, 0.3, 0.3),  r: 3.5, os: 2.4,  color: 0xc8c8d8, met: 0.95, rough: 0.08 },
        { geo: new THREE.OctahedronGeometry(0.22),    r: 2.9, os: 3.9,  color: 0xf0e0a0, met: 0.85, rough: 0.15 },
        { geo: new THREE.IcosahedronGeometry(0.2),    r: 3.8, os: 5.1,  color: 0xa0b8ff, met: 0.7, rough: 0.25 },
        { geo: new THREE.TetrahedronGeometry(0.18),   r: 2.4, os: 4.7,  color: 0xd4a017, met: 0.9, rough: 0.1 },
      ];

      floaterConfigs.forEach((cfg, i) => {
        const mat  = new THREE.MeshStandardMaterial({
          color: cfg.color, metalness: cfg.met, roughness: cfg.rough,
        });
        const mesh = new THREE.Mesh(cfg.geo, mat);
        mesh.castShadow = true;
        scene.add(mesh);
        floaters.push({
          mesh,
          orbitRadius:  cfg.r,
          orbitSpeed:   cfg.os * 0.25,
          orbitOffset:  (i / floaterConfigs.length) * Math.PI * 2,
          bobSpeed:     0.8 + i * 0.15,
          bobAmplitude: 0.18 + (i % 3) * 0.12,
          bobOffset:    i * 0.7,
        });
      });

      // ── Particle ring ──
      const particleCount = 120;
      const pPositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const angle  = (i / particleCount) * Math.PI * 2;
        const radius = 4.5 + (Math.random() - 0.5) * 1.5;
        pPositions[i * 3]     = Math.cos(angle) * radius;
        pPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
        pPositions[i * 3 + 2] = Math.sin(angle) * radius;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xd4a017, size: 0.04, transparent: true, opacity: 0.55,
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // ── Mouse tilt group ──
      const sceneGroup = new THREE.Group();
      // Re-parent all objects into group
      [platform, particles, ...floaters.map(f => f.mesh)].forEach(o => {
        scene.remove(o);
        sceneGroup.add(o);
      });
      scene.add(sceneGroup);

      // ── Mouse handler ──
      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseRef.current = {
          x: ((e.clientX - rect.left) / rect.width  - 0.5) * 2,
          y: ((e.clientY - rect.top)  / rect.height - 0.5) * 2,
        };
      };
      container.addEventListener('mousemove', onMouseMove);

      // ── Resize ──
      const onResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      // ── Animation loop ──
      let targetTiltX = 0, targetTiltY = 0;
      let currentTiltX = 0, currentTiltY = 0;

      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t    = clock.getElapsedTime();

        // Smooth mouse tilt
        targetTiltX = mouseRef.current.y * 0.15;
        targetTiltY = mouseRef.current.x * 0.2;
        currentTiltX += (targetTiltX - currentTiltX) * 0.05;
        currentTiltY += (targetTiltY - currentTiltY) * 0.05;
        sceneGroup.rotation.x = currentTiltX;
        sceneGroup.rotation.y = currentTiltY + t * 0.12; // slow base spin

        // Platform subtle y-bob
        platform.position.y = Math.sin(t * 0.5) * 0.05;

        // Floaters orbit
        floaters.forEach(f => {
          const angle = t * f.orbitSpeed + f.orbitOffset;
          f.mesh.position.x = Math.cos(angle) * f.orbitRadius;
          f.mesh.position.z = Math.sin(angle) * f.orbitRadius;
          f.mesh.position.y = 0.5 + Math.sin(t * f.bobSpeed + f.bobOffset) * f.bobAmplitude;
          f.mesh.rotation.x += 0.007;
          f.mesh.rotation.y += 0.011;
        });

        // Particles drift
        particles.rotation.y = t * 0.04;

        // Pulsing point light
        pointLight.intensity = 2.5 + Math.sin(t * 1.2) * 0.5;

        renderer.render(scene, camera);
      };
      animate();

      // ── Cleanup ──
      return () => {
        cancelAnimationFrame(animId);
        container.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
      };
    });

    return () => {
      cancelAnimationFrame(animId!);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: '400px', position: 'relative' }}
    >
      {webglOk === false && <FallbackScene />}
      {webglOk !== false && (
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      )}
    </div>
  );
}
