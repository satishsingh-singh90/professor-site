import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Binary, Sparkles } from 'lucide-react';

type MorphPhase = 'real' | 'morphing' | 'neural';

interface ConstellationNode {
  x: number; // 0 to 1
  y: number; // 0 to 1
  radius: number;
  color: string;
  connections: number[];
  isHub?: boolean;
}

interface Pulse {
  from: number;
  to: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

export default function HeroMorphExperience() {
  const [phase, setPhase] = useState<MorphPhase>('neural');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scanline animation during 'morphing' phase
  useEffect(() => {
    if (phase !== 'morphing') return;
    let startTime: number | null = null;
    let animId: number;

    const animateScan = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / 1600, 1);
      setScanProgress(progress);
      if (progress < 1) {
        animId = requestAnimationFrame(animateScan);
      } else {
        setPhase('neural');
      }
    };

    animId = requestAnimationFrame(animateScan);
    return () => cancelAnimationFrame(animId);
  }, [phase]);

  // Dynamic Constellation & Light Pulses for 'neural' phase
  useEffect(() => {
    if (phase !== 'neural') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
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

    // Anatomically calibrated constellation nodes extending outwards to the right
    const nodesData: ConstellationNode[] = [
      // Brain Epicenter Hub
      { x: 0.32, y: 0.38, radius: 4.2, color: '#FFFFFF', isHub: true, connections: [1, 2, 3, 4, 5] },
      
      // Upper turban perimeter
      { x: 0.28, y: 0.26, radius: 2.5, color: '#38BDF8', connections: [0, 2] },
      { x: 0.38, y: 0.22, radius: 3.0, color: '#7DD3FC', connections: [0, 1, 3, 6] },
      { x: 0.44, y: 0.30, radius: 2.8, color: '#38BDF8', connections: [0, 2, 4, 7] },
      { x: 0.40, y: 0.44, radius: 2.6, color: '#7DD3FC', connections: [0, 3, 5, 8] },
      { x: 0.35, y: 0.52, radius: 2.4, color: '#38BDF8', connections: [0, 4, 9] },

      // Extrusions to the Right: 1. Fog & Edge Computing Nodes (Top Right)
      { x: 0.54, y: 0.23, radius: 2.8, color: '#7DD3FC', connections: [2, 7, 10] },
      { x: 0.63, y: 0.25, radius: 3.2, color: '#38BDF8', connections: [6, 10, 11] },
      { x: 0.70, y: 0.23, radius: 3.8, color: '#FFFFFF', isHub: true, connections: [7] }, // Target: Fog & Edge

      // Extrusions to the Right: 2. Distributed AI & ML (Middle Right)
      { x: 0.52, y: 0.38, radius: 3.0, color: '#38BDF8', connections: [3, 4, 12] },
      { x: 0.58, y: 0.42, radius: 3.5, color: '#7DD3FC', connections: [9, 12, 13] },
      { x: 0.65, y: 0.40, radius: 3.8, color: '#FFFFFF', isHub: true, connections: [10] }, // Target: Distributed AI

      // Extrusions to the Right: 3. Post-Doc Collaborative Network (Lower Middle Right)
      { x: 0.48, y: 0.52, radius: 2.6, color: '#38BDF8', connections: [5, 14] },
      { x: 0.56, y: 0.56, radius: 3.0, color: '#7DD3FC', connections: [12, 14, 15] },
      { x: 0.66, y: 0.58, radius: 3.4, color: '#38BDF8', connections: [13, 15, 16] },
      { x: 0.76, y: 0.54, radius: 3.6, color: '#FFFFFF', isHub: true, connections: [14, 16] }, // Target: Post-Doc 1
      { x: 0.72, y: 0.64, radius: 3.4, color: '#7DD3FC', isHub: true, connections: [14, 15] }, // Target: Post-Doc 2

      // Extrusions to the Right: 4. IoT Devices (Bottom Right)
      { x: 0.42, y: 0.64, radius: 2.4, color: '#38BDF8', connections: [5, 18] },
      { x: 0.50, y: 0.70, radius: 2.8, color: '#7DD3FC', connections: [17, 19] },
      { x: 0.58, y: 0.75, radius: 3.4, color: '#FFFFFF', isHub: true, connections: [18] }, // Target: IoT Devices

      // Neck & Attire Anchor Nodes
      { x: 0.32, y: 0.68, radius: 2.2, color: '#38BDF8', connections: [5, 17] },
      { x: 0.36, y: 0.80, radius: 2.4, color: '#7DD3FC', connections: [20] }
    ];

    // Light pulses traveling between nodes
    const pulses: Pulse[] = [];
    const spawnPulse = () => {
      if (pulses.length > 28) return;
      const startIdx = Math.floor(Math.random() * nodesData.length);
      const startNode = nodesData[startIdx];
      if (!startNode || startNode.connections.length === 0) return;
      const targetIdx = startNode.connections[Math.floor(Math.random() * startNode.connections.length)];

      pulses.push({
        from: startIdx,
        to: targetIdx,
        progress: 0,
        speed: 0.012 + Math.random() * 0.016,
        color: startNode.isHub ? '#FFFFFF' : '#38BDF8',
        size: startNode.isHub ? 3.4 : 2.4
      });
    };

    // Preload some pulses
    for (let i = 0; i < 16; i++) {
      spawnPulse();
      if (pulses[i]) pulses[i].progress = Math.random();
    }

    let lastSpawnTime = 0;

    const render = (time: number) => {
      if (!ctx || width === 0 || height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Periodically spawn new pulses
      if (time - lastSpawnTime > 120) {
        spawnPulse();
        lastSpawnTime = time;
      }

      // 1. Draw Network Connections
      for (let i = 0; i < nodesData.length; i++) {
        const nA = nodesData[i];
        const xA = nA.x * width;
        const yA = nA.y * height;

        for (const targetIdx of nA.connections) {
          if (targetIdx > i) {
            const nB = nodesData[targetIdx];
            const xB = nB.x * width;
            const yB = nB.y * height;

            ctx.beginPath();
            ctx.moveTo(xA, yA);
            ctx.lineTo(xB, yB);
            ctx.strokeStyle = nA.isHub || nB.isHub 
              ? 'rgba(125, 211, 252, 0.40)' 
              : 'rgba(56, 189, 248, 0.22)';
            ctx.lineWidth = nA.isHub || nB.isHub ? 1.4 : 0.8;
            ctx.stroke();
          }
        }
      }

      // 2. Draw Moving Light Pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const nA = nodesData[pulse.from];
        const nB = nodesData[pulse.to];
        const curX = (nA.x + (nB.x - nA.x) * pulse.progress) * width;
        const curY = (nA.y + (nB.y - nA.y) * pulse.progress) * height;

        // Glowing dot
        ctx.beginPath();
        ctx.arc(curX, curY, pulse.size, 0, Math.PI * 2);
        ctx.fillStyle = pulse.color;
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 3. Draw Nodes / Dots
      for (let i = 0; i < nodesData.length; i++) {
        const n = nodesData[i];
        const nx = n.x * width;
        const ny = n.y * height;

        ctx.beginPath();
        ctx.arc(nx, ny, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        if (n.isHub) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 14;
        } else {
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [phase]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-[540px] sm:max-w-[580px] lg:max-w-[620px] rounded-3xl overflow-hidden bg-[#030914] border border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.7)] p-4 sm:p-5 flex flex-col justify-between aspect-[16/10] sm:aspect-[16/9.5]"
    >
      {/* =========================================================================
          TOP MINIMALIST SWITCHER TABS (Matching User's Reference Screenshot)
      ========================================================================== */}
      <div className="flex items-center justify-center space-x-3.5 text-xs font-mono text-slate-400 z-30 pt-1 pb-2 border-b border-white/[0.04]">
        <button
          onClick={() => setPhase('real')}
          className={`transition-colors cursor-pointer pb-1 ${
            phase === 'real'
              ? 'text-[#2DD4BF] font-bold border-b-2 border-[#2DD4BF]'
              : 'hover:text-slate-200'
          }`}
          title="Switch to Real Scholar"
        >
          Real Scholar
        </button>

        <span className="text-slate-600">|</span>

        <button
          onClick={() => {
            setPhase('morphing');
          }}
          className={`transition-colors cursor-pointer pb-1 ${
            phase === 'morphing'
              ? 'text-[#2DD4BF] font-bold border-b-2 border-[#2DD4BF]'
              : 'hover:text-slate-200'
          }`}
          title="Switch to AI Scan"
        >
          AI Scan
        </button>

        <span className="text-slate-600">|</span>

        <button
          onClick={() => setPhase('neural')}
          className={`transition-colors cursor-pointer pb-1 ${
            phase === 'neural'
              ? 'text-[#2DD4BF] font-bold border-b-2 border-[#2DD4BF]'
              : 'hover:text-slate-200'
          }`}
          title="Switch to Neural Mind"
        >
          Neural Mind
        </button>
      </div>

      {/* =========================================================================
          CONTENT STAGE
      ========================================================================== */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">

        {/* -------------------------------------------------------------------
            STAGE 1: REAL PROFESSOR PHOTOGRAPH
        -------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
            phase === 'real'
              ? 'opacity-100 scale-100 pointer-events-auto z-10'
              : 'opacity-0 scale-95 pointer-events-none z-0'
          }`}
        >
          <div className="relative w-[260px] sm:w-[290px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <img
              src="/dr-prabdeep-singh.jpg"
              alt="Dr. Prabh Deep Singh — Academic Portrait"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030914] via-transparent to-transparent opacity-75" />
            
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-[#030914]/90 border border-white/10 backdrop-blur-md flex items-center justify-between">
              <div>
                <h4 className="text-white font-heading font-bold text-xs sm:text-sm">Dr. Prabh Deep Singh</h4>
                <p className="text-[10px] text-[#2DD4BF] font-mono">Associate Professor & Mentor</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            STAGE 2: HOLOGRAPHIC AI SCAN
        -------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
            phase === 'morphing'
              ? 'opacity-100 scale-100 pointer-events-auto z-10'
              : 'opacity-0 scale-95 pointer-events-none z-0'
          }`}
        >
          <div className="relative w-[260px] sm:w-[290px] aspect-[4/5] rounded-2xl overflow-hidden border border-cyan-400/80 shadow-[0_0_30px_rgba(45,212,191,0.4)]">
            <img
              src="/dr-prabdeep-singh.jpg"
              alt="Dr. Prabh Deep Singh"
              className="w-full h-full object-cover object-top filter grayscale contrast-125"
            />
            {/* Digital Grid Overlay */}
            <div 
              className="absolute inset-0 opacity-40 bg-[radial-gradient(#2DD4BF_1px,transparent_1px)]"
              style={{ backgroundSize: '14px 14px' }}
            />
            {/* Sweeping Laser Beam */}
            <div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2DD4BF] to-transparent shadow-[0_0_20px_#2DD4BF]"
              style={{ top: `${scanProgress * 100}%` }}
            />
            <div className="absolute top-3 left-3 right-3 px-3 py-1 rounded bg-black/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center justify-between">
              <span className="flex items-center gap-1 animate-pulse">
                <Binary className="w-3 h-3" />
                <span>SYNTHESIZING DIGITAL TWIN...</span>
              </span>
              <span>{Math.round(scanProgress * 100)}%</span>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            STAGE 3: NEURAL MIND (Exact Match to User Reference Screenshot)
        -------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex items-center justify-between transition-all duration-700 ease-in-out ${
            phase === 'neural'
              ? 'opacity-100 scale-100 pointer-events-auto z-10'
              : 'opacity-0 scale-95 pointer-events-none z-0'
          }`}
        >
          {/* Left Side: Silhouette Portrait with Illuminated Turban & Core */}
          <div className="relative w-[52%] h-full flex items-center justify-start pl-2 sm:pl-4 overflow-visible">
            <img
              src="/professor-mind-hero.jpg"
              alt="Dr. Prabh Deep Singh — AI Neural Mind"
              className="h-[92%] max-h-[360px] object-contain select-none pointer-events-none filter drop-shadow-[0_0_25px_rgba(45,212,191,0.35)]"
              style={{
                maskImage: 'radial-gradient(ellipse 95% 95% at 40% 50%, black 75%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 95% 95% at 40% 50%, black 75%, transparent 100%)'
              }}
            />
          </div>

          {/* Right Side: Animated Constellation Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* =================================================================
              CALLOUT ANNOTATIONS WITH DELICATE LEADER POINTERS
              (Matching User Reference: Fog & Edge, Distributed AI, Post-Doc, IoT)
          ================================================================== */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* SVG Connecting Leader Lines */}
            <svg className="w-full h-full absolute inset-0 overflow-visible">
              {/* 1. Fog & Edge Leader Line (Curve from label at 70%, 18% to node at 70%, 23%) */}
              <path
                d="M 68%,18% Q 65%,21% 69.5%,23%"
                fill="none"
                stroke="rgba(148, 163, 184, 0.45)"
                strokeWidth="1"
              />

              {/* 2. Distributed AI & ML Leader Line (Curve from label at 58%, 50% to node at 65%, 40%) */}
              <path
                d="M 57%,50% Q 54%,43% 64.5%,40%"
                fill="none"
                stroke="rgba(148, 163, 184, 0.45)"
                strokeWidth="1"
              />

              {/* 3. Post-Doc Collaborative Network Leader Lines (To upper and lower collaborative nodes) */}
              <path
                d="M 72%,65% L 75.5%,54.5%"
                fill="none"
                stroke="rgba(148, 163, 184, 0.45)"
                strokeWidth="1"
              />
              <path
                d="M 72%,65% L 71.8%,64%"
                fill="none"
                stroke="rgba(148, 163, 184, 0.45)"
                strokeWidth="1"
              />

              {/* 4. IoT Devices Leader Line (Curve from label at 58%, 86% to node at 58%, 75%) */}
              <path
                d="M 58%,85% Q 54%,80% 57.8%,75.5%"
                fill="none"
                stroke="rgba(148, 163, 184, 0.45)"
                strokeWidth="1"
              />
            </svg>

            {/* Label 1: Fog & Edge Computing Nodes (Top Right) */}
            <div className="absolute top-[14%] right-[5%] sm:right-[7%] text-right">
              <span className="text-[11px] sm:text-[12px] font-sans font-medium text-slate-200 tracking-wide block leading-tight">
                Fog & Edge
              </span>
              <span className="text-[11px] sm:text-[12px] font-sans font-medium text-slate-200 tracking-wide block leading-tight">
                Computing Nodes
              </span>
            </div>

            {/* Label 2: Distributed AI & ML (Middle Right) */}
            <div className="absolute top-[48%] left-[54%] sm:left-[56%]">
              <span className="text-[11px] sm:text-[12px] font-sans font-medium text-slate-200 tracking-wide leading-tight">
                Distributed AI & ML
              </span>
            </div>

            {/* Label 3: Post-Doc Collaborative Network (Lower Right) */}
            <div className="absolute top-[64%] left-[72%] sm:left-[73%]">
              <span className="text-[11px] sm:text-[12px] font-sans font-medium text-slate-200 tracking-wide block leading-tight">
                Post-Doc Collaborative
              </span>
              <span className="text-[11px] sm:text-[12px] font-sans font-medium text-slate-200 tracking-wide block leading-tight">
                Network
              </span>
            </div>

            {/* Label 4: IoT Devices (Bottom Right) */}
            <div className="absolute bottom-[8%] left-[58%] sm:left-[60%]">
              <span className="text-[11px] sm:text-[12px] font-sans font-medium text-slate-200 tracking-wide leading-tight">
                IoT Devices
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          BOTTOM RIGHT FOUR-POINTED STAR (Matching Reference Screenshot)
      ========================================================================== */}
      <div className="absolute bottom-3 right-4 z-20 pointer-events-none opacity-40 text-slate-400">
        <Sparkles className="w-4 h-4 fill-slate-400 text-slate-400" />
      </div>
    </div>
  );
}
