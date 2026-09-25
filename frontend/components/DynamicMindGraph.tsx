import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface Node {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  pulsePhase: number;
  pulseSpeed: number;
  connections: number[];
  isEpicenter?: boolean;
  color?: string;
}

interface SignalPulse {
  startNode: number;
  targetNode: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
  trailLength: number;
}

export default function DynamicMindGraph() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 3-Stage Flow: 1. Real Photo -> 2. AI Scan -> 3. Neural Mind with moving light
  const [stage, setStage] = useState<'real' | 'scan' | 'neural'>('real');
  const [scanProgress, setScanProgress] = useState<number>(0);

  // Initial auto transition: Real Photo (2.4s) -> AI Scan -> Neural Mind
  useEffect(() => {
    const t = setTimeout(() => {
      setStage('scan');
    }, 2400);

    return () => clearTimeout(t);
  }, []);

  // Scanline animation during 'scan'
  useEffect(() => {
    if (stage !== 'scan') return;
    let startTime: number | null = null;
    let animId: number;

    const animateScan = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / 1300, 1);
      setScanProgress(progress);
      if (progress < 1) {
        animId = requestAnimationFrame(animateScan);
      } else {
        setStage('neural');
      }
    };

    animId = requestAnimationFrame(animateScan);
    return () => cancelAnimationFrame(animId);
  }, [stage]);

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStage('real');
    setScanProgress(0);
    setTimeout(() => {
      setStage('scan');
    }, 2000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Anatomically calibrated coordinates for Professor Mind & Constellation Knowledge Graph (facing left)
    const rawNodes = [
      // 1. Mind Neural Epicenter & Core Radiation Nucleus
      { x: 0.55, y: 0.35, epicenter: true, color: '#FFFFFF' },
      { x: 0.50, y: 0.32, epicenter: true, color: '#38BDF8' },
      { x: 0.60, y: 0.33, epicenter: true, color: '#38BDF8' },
      { x: 0.53, y: 0.40, epicenter: true, color: '#7DD3FC' },
      { x: 0.58, y: 0.39, epicenter: true, color: '#7DD3FC' },
      { x: 0.48, y: 0.37, epicenter: true, color: '#38BDF8' },

      // 2. Intellectual Radiance & Scientific Knowledge Constellations (upper & back of turban)
      { x: 0.68, y: 0.22, color: '#38BDF8' },
      { x: 0.76, y: 0.16, color: '#FFFFFF' },
      { x: 0.83, y: 0.24, color: '#38BDF8' },
      { x: 0.72, y: 0.30, color: '#7DD3FC' },
      { x: 0.79, y: 0.34, color: '#FDE047' }, // Golden academic star
      { x: 0.86, y: 0.33, color: '#FFFFFF' },
      { x: 0.74, y: 0.42, color: '#38BDF8' },
      { x: 0.82, y: 0.44, color: '#7DD3FC' },
      { x: 0.88, y: 0.41, color: '#38BDF8' },
      { x: 0.75, y: 0.50, color: '#7DD3FC' },
      { x: 0.81, y: 0.53, color: '#FFFFFF' },

      // 3. Turban Crown & Architectural Folds
      { x: 0.42, y: 0.08, color: '#7DD3FC' }, // Turban peak
      { x: 0.34, y: 0.12, color: '#38BDF8' },
      { x: 0.48, y: 0.12, color: '#38BDF8' },
      { x: 0.58, y: 0.14, color: '#7DD3FC' },
      { x: 0.27, y: 0.18, color: '#7DD3FC' },
      { x: 0.38, y: 0.20, color: '#FFFFFF' },
      { x: 0.46, y: 0.22, color: '#38BDF8' },
      { x: 0.24, y: 0.28, color: '#7DD3FC' },
      { x: 0.32, y: 0.29, color: '#38BDF8' },

      // 4. Professor Facial Profile (Dignified male profile facing left)
      { x: 0.25, y: 0.36, color: '#38BDF8' }, // Forehead
      { x: 0.22, y: 0.44, color: '#7DD3FC' }, // Brow
      { x: 0.32, y: 0.46, color: '#FFFFFF' }, // Visionary eye
      { x: 0.20, y: 0.54, color: '#38BDF8' }, // Nose tip
      { x: 0.24, y: 0.58, color: '#7DD3FC' }, // Mustache crest
      { x: 0.24, y: 0.63, color: '#7DD3FC' }, // Lip
      { x: 0.23, y: 0.69, color: '#38BDF8' }, // Beard contour
      { x: 0.25, y: 0.76, color: '#7DD3FC' }, // Lower beard
      { x: 0.32, y: 0.80, color: '#38BDF8' }, // Beard base

      // 5. Cheek & Neural Data Flow
      { x: 0.36, y: 0.52, color: '#38BDF8' },
      { x: 0.42, y: 0.56, color: '#7DD3FC' },
      { x: 0.36, y: 0.64, color: '#7DD3FC' },
      { x: 0.45, y: 0.66, color: '#38BDF8' },
      { x: 0.52, y: 0.58, color: '#7DD3FC' },

      // 6. Academic Attire / Collar & Base Radiation
      { x: 0.42, y: 0.82, color: '#7DD3FC' },
      { x: 0.48, y: 0.88, color: '#38BDF8' },
      { x: 0.58, y: 0.84, color: '#7DD3FC' },
      { x: 0.66, y: 0.86, color: '#38BDF8' },
      { x: 0.74, y: 0.82, color: '#FFFFFF' },
      { x: 0.62, y: 0.72, color: '#7DD3FC' },

      // 7. Outer Cosmos Data Stars (Radiating into the dark canvas)
      { x: 0.92, y: 0.18, color: '#FFFFFF' },
      { x: 0.94, y: 0.32, color: '#38BDF8' },
      { x: 0.92, y: 0.48, color: '#7DD3FC' },
      { x: 0.86, y: 0.65, color: '#38BDF8' },
      { x: 0.14, y: 0.48, color: '#38BDF8' },
      { x: 0.12, y: 0.56, color: '#FFFFFF' }
    ];

    const nodes: Node[] = rawNodes.map((n) => ({
      x: n.x,
      y: n.y,
      radius: n.epicenter ? 3.4 : 2.2,
      baseRadius: n.epicenter ? 3.4 : 2.2,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.025 + Math.random() * 0.03,
      connections: [],
      isEpicenter: n.epicenter,
      color: n.color || '#38BDF8'
    }));

    // Interconnect nodes for knowledge graph pathways
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = (nodes[i].isEpicenter || nodes[j].isEpicenter) ? 0.18 : 0.14;
        if (dist < maxDist) {
          nodes[i].connections.push(j);
          nodes[j].connections.push(i);
        }
      }
    }

    // Dynamic light pulses / knowledge action potentials
    const activePulses: SignalPulse[] = [];
    const MAX_PULSES = 34;

    const spawnPulse = (preferredStart?: number) => {
      let startIdx = preferredStart !== undefined
        ? preferredStart
        : (Math.random() < 0.35 ? 0 : Math.floor(Math.random() * nodes.length));
      const node = nodes[startIdx];
      if (!node || node.connections.length === 0) return;
      const targetIdx = node.connections[Math.floor(Math.random() * node.connections.length)];

      const isCore = node.isEpicenter || nodes[targetIdx].isEpicenter;
      activePulses.push({
        startNode: startIdx,
        targetNode: targetIdx,
        progress: 0,
        speed: 0.012 + Math.random() * 0.018,
        color: isCore ? '#FFFFFF' : '#38BDF8',
        size: isCore ? 3.8 : 2.8,
        trailLength: 0.30
      });
    };

    // Preload pulses
    for (let p = 0; p < 20; p++) {
      spawnPulse();
      if (activePulses[activePulses.length - 1]) {
        activePulses[activePulses.length - 1].progress = Math.random();
      }
    }

    let lastSpawn = 0;
    let epicenterPulse = 0;

    const render = (time: number) => {
      if (!ctx || width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Periodically spawn bursts from the neural epicenter
      epicenterPulse += 0.02;
      const epicenterGlow = 0.5 + 0.5 * Math.sin(epicenterPulse);

      // Draw Epicenter Wave Flare from Professor's Mind Core
      const ex = 0.55 * width;
      const ey = 0.35 * height;
      const coreHalo = ctx.createRadialGradient(ex, ey, 0, ex, ey, 60 + epicenterGlow * 30);
      coreHalo.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      coreHalo.addColorStop(0.3, 'rgba(56, 189, 248, 0.25)');
      coreHalo.addColorStop(0.7, 'rgba(14, 165, 233, 0.08)');
      coreHalo.addColorStop(1, 'rgba(14, 165, 233, 0)');

      ctx.beginPath();
      ctx.arc(ex, ey, 60 + epicenterGlow * 30, 0, Math.PI * 2);
      ctx.fillStyle = coreHalo;
      ctx.fill();

      // Spawn pulses at frequent intervals
      if (activePulses.length < MAX_PULSES && time - lastSpawn > 55) {
        spawnPulse();
        lastSpawn = time;
      }

      // 1. Draw Network Connections (White & Cyan Knowledge Synapses)
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        const ax = nodeA.x * width;
        const ay = nodeA.y * height;

        for (const j of nodeA.connections) {
          if (j > i) {
            const nodeB = nodes[j];
            const bx = nodeB.x * width;
            const by = nodeB.y * height;

            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);

            const isCoreLine = nodeA.isEpicenter || nodeB.isEpicenter;
            ctx.strokeStyle = isCoreLine
              ? 'rgba(125, 211, 252, 0.35)'
              : 'rgba(56, 189, 248, 0.18)';
            ctx.lineWidth = isCoreLine ? 1.5 : 0.9;
            ctx.stroke();
          }
        }
      }

      // 2. Draw Moving Light Pulses (Dynamic Light Moving along Lines)
      for (let p = activePulses.length - 1; p >= 0; p--) {
        const pulse = activePulses[p];
        pulse.progress += pulse.speed;

        const nodeA = nodes[pulse.startNode];
        const nodeB = nodes[pulse.targetNode];

        const xA = nodeA.x * width;
        const yA = nodeA.y * height;
        const xB = nodeB.x * width;
        const yB = nodeB.y * height;

        const curX = xA + (xB - xA) * pulse.progress;
        const curY = yA + (yB - yA) * pulse.progress;

        // Draw glowing light trail behind moving head
        const trailProgress = Math.max(0, pulse.progress - pulse.trailLength);
        const trailX = xA + (xB - xA) * trailProgress;
        const trailY = yA + (yB - yA) * trailProgress;

        const grad = ctx.createLinearGradient(trailX, trailY, curX, curY);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        grad.addColorStop(0.4, 'rgba(56, 189, 248, 0.55)');
        grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(1, '#FFFFFF');

        ctx.beginPath();
        ctx.moveTo(trailX, trailY);
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = pulse.size + 1.2;
        ctx.stroke();

        // Intense radial glow at the head of the moving light
        const glow = ctx.createRadialGradient(curX, curY, 0, curX, curY, pulse.size * 4);
        glow.addColorStop(0, '#FFFFFF');
        glow.addColorStop(0.3, 'rgba(255, 255, 255, 0.95)');
        glow.addColorStop(0.65, 'rgba(56, 189, 248, 0.75)');
        glow.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.beginPath();
        ctx.arc(curX, curY, pulse.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Bright pure white center spark
        ctx.beginPath();
        ctx.arc(curX, curY, pulse.size * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // When pulse arrives at destination node
        if (pulse.progress >= 1) {
          nodeB.pulsePhase = Math.PI * 0.5; // Trigger instant synaptic flash

          // Propagate forward
          if (Math.random() < 0.70 && nodeB.connections.length > 1) {
            const nextCandidates = nodeB.connections.filter(c => c !== pulse.startNode);
            if (nextCandidates.length > 0) {
              spawnPulse(pulse.targetNode);
            }
          }
          activePulses.splice(p, 1);
        }
      }

      // 3. Draw Synaptic Constellation Nodes (Star Points)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.pulsePhase += node.pulseSpeed;
        const pulseFactor = 0.5 + 0.5 * Math.sin(node.pulsePhase);

        const nx = node.x * width;
        const ny = node.y * height;
        const r = node.baseRadius + pulseFactor * 1.8;

        // Radial halo
        const halo = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 4.5);
        halo.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        halo.addColorStop(0.35, 'rgba(56, 189, 248, 0.6)');
        halo.addColorStop(1, 'rgba(14, 165, 233, 0)');

        ctx.beginPath();
        ctx.arc(nx, ny, r * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Solid core
        ctx.beginPath();
        ctx.arc(nx, ny, r * 1.0, 0, Math.PI * 2);
        ctx.fillStyle = pulseFactor > 0.75 ? '#FFFFFF' : (node.color || '#38BDF8');
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none flex items-center justify-center overflow-visible transform scale-[1.25] sm:scale-[1.3] lg:scale-[1.38] xl:scale-[1.42] origin-center transition-transform duration-300"
    >
      {/* =========================================================================
          STAGE 1 & 2: ORIGINAL PROFESSOR PHOTO & AI SCAN (Seamless, No Box)
      ========================================================================== */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
          stage === 'real' || stage === 'scan'
            ? 'opacity-100 scale-100 pointer-events-auto z-10'
            : 'opacity-0 scale-95 pointer-events-none z-0'
        }`}
      >
        <div className="relative w-[65%] sm:w-[70%] max-w-[280px] aspect-square rounded-full overflow-hidden border-2 border-[#00B4D8]/40 shadow-[0_0_35px_rgba(0,180,216,0.35)] bg-[#04132B]">
          <img
            src="/dr-prabdeep-singh.jpg"
            alt="Dr. Prabh Deep Singh — Academic Portrait"
            className={`w-full h-full object-cover object-top transition-all duration-700 ${
              stage === 'scan' ? 'filter grayscale contrast-125' : ''
            }`}
          />

          {/* AI Scan Beam & Laser Logic */}
          {stage === 'scan' && (
            <>
              {/* Digital Grid Overlay */}
              <div 
                className="absolute inset-0 opacity-40 bg-[radial-gradient(#38BDF8_1px,transparent_1px)]"
                style={{ backgroundSize: '12px 12px' }}
              />

              {/* Laser Scanline */}
              <div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent shadow-[0_0_15px_#38BDF8,0_0_25px_#7DD3FC]"
                style={{ top: `${scanProgress * 100}%` }}
              />

              {/* Telemetry Tag */}
              <div className="absolute bottom-3 left-3 right-3 text-center text-[9.5px] font-mono text-cyan-300 bg-black/75 px-2 py-0.5 rounded-full border border-cyan-500/40 tracking-wider">
                AI SCAN: {Math.round(scanProgress * 100)}%
              </div>
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          STAGE 3: ORIGINAL HERO MIND GRAPH & MOVING NEURONS (No equation boxes)
      ========================================================================== */}
      <div
        className={`relative w-full h-full flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
          stage === 'neural' ? 'opacity-100 z-10' : stage === 'scan' ? 'opacity-30 z-0' : 'opacity-0 z-0'
        }`}
      >
        {/* Distinguished Professor AI Mind & Constellation Knowledge Graph Visual */}
        <img
          src="/professor-mind-hero.png"
          alt="Dr. Prabh Deep Singh — AI & Healthcare Knowledge Graph"
          className="w-full h-full object-contain pointer-events-none select-none transition-all duration-700"
          style={{
            filter: 'drop-shadow(0 0 35px rgba(56, 189, 248, 0.45)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.35))'
          }}
        />

        {/* Dynamic Animated Mind Knowledge Graph Overlay with Moving Light Pulses */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
        />
      </div>

      {/* Subtle Replay trigger in top-right */}
      {stage === 'neural' && (
        <button
          onClick={handleReplay}
          className="absolute top-2 right-2 z-20 text-[10px] font-mono text-cyan-400/60 hover:text-cyan-200 transition-colors flex items-center gap-1.5 cursor-pointer bg-black/50 hover:bg-black/80 px-2.5 py-1 rounded-full border border-cyan-500/20 backdrop-blur-xs shadow-xs"
          title="Replay AI Scan"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Replay Scan</span>
        </button>
      )}

      {/* Ambient Diffuse Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full bg-gradient-to-tr from-[#0284C7]/20 via-[#0D9488]/15 to-transparent blur-3xl pointer-events-none"
      />
    </div>
  );
}
