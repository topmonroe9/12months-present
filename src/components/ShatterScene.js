"use client";
import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

const COLS = 8;
const ROWS = 12;
const PARTICLE_COUNT = 200;
const EMBER_COUNT = 80;

// ── Fragment tessellation (irregular Voronoi-like grid) ──────────────
function generateFragmentData() {
  const points = [];
  for (let r = 0; r <= ROWS; r++) {
    points[r] = [];
    for (let c = 0; c <= COLS; c++) {
      let x = c / COLS;
      let y = r / ROWS;
      if (c > 0 && c < COLS && r > 0 && r < ROWS) {
        x += (Math.random() - 0.5) * (0.7 / COLS);
        y += (Math.random() - 0.5) * (0.7 / ROWS);
      }
      points[r][c] = [x, y];
    }
  }

  const fragments = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tl = points[r][c];
      const tr = points[r][c + 1];
      const bl = points[r + 1][c];
      const br = points[r + 1][c + 1];

      const cx = (tl[0] + tr[0] + bl[0] + br[0]) / 4;
      const cy = (tl[1] + tr[1] + bl[1] + br[1]) / 4;
      const dx = cx - 0.5;
      const dy = cy - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Dramatic: center fragments explode fast and toward camera
      const isCentral = dist < 0.2;
      const speed = isCentral
        ? 3.5 + Math.random() * 3
        : 1.5 + Math.random() * 2.5;
      const zSpeed = isCentral
        ? 2 + Math.random() * 4
        : 0.2 + Math.random() * 1.5;

      fragments.push({
        vertices: [tl, tr, br, bl],
        center: [cx, cy],
        velocity: [
          Math.cos(angle) * speed + (Math.random() - 0.5) * 0.8,
          Math.sin(angle) * speed + (Math.random() - 0.5) * 0.8,
          zSpeed,
        ],
        rotationSpeed: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
        ],
        delay: dist * 0.04,
        size: 1 / COLS,
      });
    }
  }
  return fragments;
}

// ── Single textured fragment ─────────────────────────────────────────
function Fragment({ data, texture, planeWidth, planeHeight }) {
  const meshRef = useRef();
  const edgeRef = useRef();
  const startTime = useRef(null);
  const initPos = useRef(null);

  const geometry = useMemo(() => {
    const { vertices, center } = data;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(4 * 3);
    const uvs = new Float32Array(4 * 2);

    vertices.forEach(([vx, vy], i) => {
      pos[i * 3] = (vx - center[0]) * planeWidth;
      pos[i * 3 + 1] = -(vy - center[1]) * planeHeight;
      pos[i * 3 + 2] = 0;
      uvs[i * 2] = vx;
      uvs[i * 2 + 1] = 1 - vy;
    });

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.setIndex([0, 1, 2, 0, 2, 3]);
    return geo;
  }, [data, planeWidth, planeHeight]);

  // Edge geometry for glowing edges
  const edgeGeometry = useMemo(() => {
    const { vertices, center } = data;
    const positions = [];
    for (let i = 0; i < vertices.length; i++) {
      const [vx, vy] = vertices[i];
      positions.push(
        (vx - center[0]) * planeWidth,
        -(vy - center[1]) * planeHeight,
        0.01
      );
    }
    // Close the loop
    const [vx, vy] = vertices[0];
    positions.push(
      (vx - center[0]) * planeWidth,
      -(vy - center[1]) * planeHeight,
      0.01
    );

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geo;
  }, [data, planeWidth, planeHeight]);

  useEffect(() => {
    const { center } = data;
    initPos.current = new THREE.Vector3(
      (center[0] - 0.5) * planeWidth,
      -(center[1] - 0.5) * planeHeight,
      0
    );
    if (meshRef.current) meshRef.current.position.copy(initPos.current);
    if (edgeRef.current) edgeRef.current.position.copy(initPos.current);
  }, [data, planeWidth, planeHeight]);

  useFrame((state) => {
    if (!meshRef.current || !initPos.current) return;
    if (!startTime.current) startTime.current = state.clock.elapsedTime;

    const elapsed = state.clock.elapsedTime - startTime.current;
    const t = Math.max(0, elapsed - data.delay);
    if (t <= 0) return;

    const s = planeHeight * 0.5;
    const gravity = 3.0;

    const px = initPos.current.x + data.velocity[0] * t * s;
    const py =
      initPos.current.y + (data.velocity[1] * t - gravity * t * t) * s;
    const pz = initPos.current.z + data.velocity[2] * t * s;

    meshRef.current.position.set(px, py, pz);
    meshRef.current.rotation.x = data.rotationSpeed[0] * t;
    meshRef.current.rotation.y = data.rotationSpeed[1] * t;
    meshRef.current.rotation.z = data.rotationSpeed[2] * t;

    // Fade + dissolve
    const fade = Math.max(0, 1 - t * 0.9);
    if (meshRef.current.material) {
      meshRef.current.material.opacity = fade;
    }

    // Edge glow follows fragment
    if (edgeRef.current) {
      edgeRef.current.position.copy(meshRef.current.position);
      edgeRef.current.rotation.copy(meshRef.current.rotation);
      // Edge glow fades faster and pulses
      const edgeFade = Math.max(0, 1 - t * 1.2) * (0.6 + 0.4 * Math.sin(t * 15));
      if (edgeRef.current.material) {
        edgeRef.current.material.opacity = edgeFade;
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial
          map={texture}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <line ref={edgeRef} geometry={edgeGeometry}>
        <lineBasicMaterial
          color="#ffaa44"
          transparent
          opacity={0.8}
          linewidth={1}
        />
      </line>
    </group>
  );
}

// ── Spark particles (bright points flying outward) ───────────────────
function SparkParticles() {
  const pointsRef = useRef();
  const startTime = useRef(null);

  const { positions, velocities, delays, sizes } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = [];
    const del = [];
    const siz = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = 0;

      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      vel.push([
        Math.cos(angle) * speed,
        Math.sin(angle) * speed + Math.random() * 2,
        (Math.random() - 0.3) * 6,
      ]);

      del.push(Math.random() * 0.15);
      siz[i] = 2 + Math.random() * 5;
    }

    return {
      positions: pos,
      velocities: vel,
      delays: del,
      sizes: siz,
    };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, sizes]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    if (!startTime.current) startTime.current = state.clock.elapsedTime;

    const elapsed = state.clock.elapsedTime - startTime.current;
    const posArr = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.max(0, elapsed - delays[i]);
      if (t <= 0) continue;

      posArr[i * 3] = positions[i * 3] + velocities[i][0] * t;
      posArr[i * 3 + 1] =
        positions[i * 3 + 1] + velocities[i][1] * t - 4 * t * t;
      posArr[i * 3 + 2] = positions[i * 3 + 2] + velocities[i][2] * t;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Fade the whole system
    if (pointsRef.current.material) {
      pointsRef.current.material.opacity = Math.max(0, 1 - elapsed * 0.7);
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#ffcc44"
        size={0.08}
        transparent
        opacity={1}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Floating embers (slower, lingering particles) ────────────────────
function EmberParticles() {
  const pointsRef = useRef();
  const startTime = useRef(null);

  const { positions, velocities, delays } = useMemo(() => {
    const pos = new Float32Array(EMBER_COUNT * 3);
    const vel = [];
    const del = [];

    for (let i = 0; i < EMBER_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;

      vel.push([
        (Math.random() - 0.5) * 0.5,
        0.3 + Math.random() * 0.8, // float upward
        (Math.random() - 0.5) * 0.3,
      ]);

      del.push(0.2 + Math.random() * 0.5);
    }

    return { positions: pos, velocities: vel, delays: del };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    if (!startTime.current) startTime.current = state.clock.elapsedTime;

    const elapsed = state.clock.elapsedTime - startTime.current;
    const posArr = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < EMBER_COUNT; i++) {
      const t = Math.max(0, elapsed - delays[i]);
      if (t <= 0) continue;

      posArr[i * 3] =
        positions[i * 3] + velocities[i][0] * t + Math.sin(t * 2 + i) * 0.2;
      posArr[i * 3 + 1] = positions[i * 3 + 1] + velocities[i][1] * t;
      posArr[i * 3 + 2] = positions[i * 3 + 2] + velocities[i][2] * t;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    if (pointsRef.current.material) {
      const fade = Math.max(0, 1 - (elapsed - 0.3) * 0.4);
      pointsRef.current.material.opacity = fade * 0.7;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#ff6633"
        size={0.04}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Shockwave ring expanding from center ─────────────────────────────
function ShockwaveRing() {
  const meshRef = useRef();
  const startTime = useRef(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (!startTime.current) startTime.current = state.clock.elapsedTime;

    const t = state.clock.elapsedTime - startTime.current;
    const scale = 1 + t * 18;
    meshRef.current.scale.set(scale, scale, 1);

    if (meshRef.current.material) {
      meshRef.current.material.opacity = Math.max(0, 0.8 - t * 1.5);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.5]}>
      <ringGeometry args={[0.9, 1.0, 64]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ── Main scene ───────────────────────────────────────────────────────
function Scene({ screenshotCanvas }) {
  const { camera, size } = useThree();

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(screenshotCanvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [screenshotCanvas]);

  const { planeWidth, planeHeight } = useMemo(() => {
    const fovRad = (camera.fov * Math.PI) / 180;
    const h = 2 * Math.tan(fovRad / 2) * camera.position.z;
    const w = h * (size.width / size.height);
    return { planeWidth: w, planeHeight: h };
  }, [camera, size]);

  const fragments = useMemo(() => generateFragmentData(), []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <>
      {/* Textured fragments */}
      {fragments.map((data, i) => (
        <Fragment
          key={i}
          data={data}
          texture={texture}
          planeWidth={planeWidth}
          planeHeight={planeHeight}
        />
      ))}

      {/* Bright spark explosion */}
      <SparkParticles />

      {/* Floating embers */}
      <EmberParticles />

      {/* Expanding shockwave */}
      <ShockwaveRing />

      {/* Postprocessing: bloom + subtle chromatic aberration */}
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.002, 0.002]}
        />
      </EffectComposer>
    </>
  );
}

export default function ShatterScene({ screenshotCanvas, isActive }) {
  if (!isActive || !screenshotCanvas) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 61,
        pointerEvents: "none",
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <Scene screenshotCanvas={screenshotCanvas} />
    </Canvas>
  );
}
