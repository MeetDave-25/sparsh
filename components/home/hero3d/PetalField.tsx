'use client';
/* eslint-disable react-hooks/immutability -- three.js objects are mutated per frame inside useFrame by design; copying them each frame would defeat the render loop. */

import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

const PETAL_COLORS = ['#E57C9A', '#C94A6D', '#F8E9DA', '#FFF7EE', '#B69AE0', '#EBA3B9', '#D96A8A', '#F2C4CF'];
const SPAN_Y = 9;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function petalGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.13, 0.05, 0.16, 0.24, 0, 0.32);
  shape.bezierCurveTo(-0.16, 0.24, -0.13, 0.05, 0, 0);
  const geo = new THREE.ShapeGeometry(shape, 10);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // Cup the petal and curl its tip so it catches light like the real thing.
    pos.setZ(i, x * x * 2.2 + Math.pow(y / 0.32, 3) * 0.05);
  }
  geo.translate(0, -0.16, 0);
  geo.computeVertexNormals();
  return geo;
}

type Shared = { progress: MutableRefObject<number>; smooth: MutableRefObject<number> };

function Petals({ count, progress, smooth }: Shared & { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => petalGeometry(), []);

  const petals = useMemo(() => {
    const rnd = seeded(7);
    return Array.from({ length: count }, () => {
      const z = -5 + rnd() * 7.5;
      return {
        x: (rnd() - 0.5) * (9 + (2 - z) * 1.1),
        y: (rnd() - 0.5) * SPAN_Y,
        z,
        fall: 0.18 + rnd() * 0.35,
        sway: 0.2 + rnd() * 0.5,
        swayF: 0.4 + rnd() * 0.8,
        depth: 0.6 + (z + 5) * 0.35,
        scale: 0.55 + rnd() * 0.75,
        tx: (rnd() - 0.5) * 1.8,
        ty: (rnd() - 0.5) * 1.4,
        tz: (rnd() - 0.5) * 1.8,
        phase: rnd() * Math.PI * 2,
        color: new THREE.Color(PETAL_COLORS[Math.floor(rnd() * PETAL_COLORS.length)]),
      };
    });
  }, [count]);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    petals.forEach((p, i) => m.setColorAt(i, p.color));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [petals]);

  const tmp = useMemo(
    () => ({ m: new THREE.Matrix4(), pos: new THREE.Vector3(), q: new THREE.Quaternion(), e: new THREE.Euler(), s: new THREE.Vector3() }),
    [],
  );

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const prev = smooth.current;
    smooth.current += (progress.current - smooth.current) * (1 - Math.exp(-dt * 5));
    // Scrolling lifts the petals, nearer ones faster: a parallax that reads as depth.
    const lift = (smooth.current - prev) * 14;

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.y += -p.fall * dt + lift * p.depth;
      if (p.y < -SPAN_Y / 2) p.y += SPAN_Y;
      if (p.y > SPAN_Y / 2) p.y -= SPAN_Y;
      tmp.pos.set(p.x + Math.sin(t * p.swayF + p.phase) * p.sway, p.y, p.z);
      tmp.e.set(t * p.tx + p.phase, t * p.ty, t * p.tz + p.phase * 0.5);
      tmp.q.setFromEuler(tmp.e);
      tmp.s.setScalar(p.scale);
      tmp.m.compose(tmp.pos, tmp.q, tmp.s);
      m.setMatrixAt(i, tmp.m);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geo, undefined, count]} frustumCulled={false}>
      <meshPhysicalMaterial color="#ffffff" roughness={0.55} sheen={1} sheenRoughness={0.45} sheenColor="#ffd9e4" side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function Dust({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const dot = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,236,190,1)');
    g.addColorStop(0.35, 'rgba(233,194,122,0.6)');
    g.addColorStop(1, 'rgba(233,194,122,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const { positions, speeds } = useMemo(() => {
    const rnd = seeded(42);
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rnd() - 0.5) * 14;
      positions[i * 3 + 1] = (rnd() - 0.5) * SPAN_Y;
      positions[i * 3 + 2] = -4 + rnd() * 6;
      speeds[i] = 0.08 + rnd() * 0.3;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((state, delta) => {
    const pts = points.current;
    if (!pts) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += dt * speeds[i];
      arr[i * 3] += Math.sin(t * 0.5 + i) * dt * 0.05;
      if (arr[i * 3 + 1] > SPAN_Y / 2) arr[i * 3 + 1] = -SPAN_Y / 2;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={dot} color="#F0CF8A" size={0.07} sizeAttenuation transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  );
}

type Props = { progress: MutableRefObject<number>; active: boolean; lite: boolean; onLost?: () => void };

/** Transparent WebGL layer of drifting 3D petals and gold dust, composited over the hero photography. */
export default function PetalField({ progress, active, lite, onLost }: Props) {
  const smooth = useRef(progress.current);
  return (
    <Canvas
      dpr={lite ? [1, 1.25] : [1, 1.6]}
      camera={{ fov: 40, near: 0.1, far: 40, position: [0, 0, 7] }}
      gl={{ alpha: true, antialias: !lite, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener('webglcontextlost', () => onLost?.(), { once: true });
      }}
    >
      <ambientLight intensity={0.9} color="#ffe9dc" />
      <directionalLight position={[4, 6, 5]} intensity={2.4} color="#fff1e0" />
      <directionalLight position={[-5, -2, 3]} intensity={0.9} color="#f2a7bd" />
      <Petals count={lite ? 45 : 90} progress={progress} smooth={smooth} />
      <Dust count={lite ? 90 : 200} />
    </Canvas>
  );
}
