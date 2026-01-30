'use client';

import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type PhaseLabel = {
  title: string;
  dates?: string;
  special?: boolean;
};

type TimelineNode = {
  id: number;
  top?: PhaseLabel;
  bottom?: PhaseLabel;
};

type NodeState = {
  isCurrent: boolean;
  isPast: boolean;
};

export default function Timeline() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const isBeating = true;

  const nodes: TimelineNode[] = useMemo(
    () => [
      { id: 0, top: { title: 'Idea Submission', dates: '1 Feb - 1 Mar' } },
      { id: 1, bottom: { title: 'Screening \n (Round 1 & 2)', dates: '1 Mar - 15 Mar' } },
      { id: 2, top: { title: 'Online Bootcamp', dates: '23 Mar - 30 Mar' } },
      { id: 3, bottom: { title: 'Finalist Notification & Travel Arrangements', dates: '1 April - 5 April' } },
      { id: 4, top: { title: 'Bootcamp & Acceleration Program', dates: '5 April - 12 April' } },
      { id: 5, bottom: { title: 'Final Competition', dates: '15 April' } },
    ],
    []
  );

  const nodeCount = nodes.length;

  const safeNode = useMemo(() => {
    const max = nodes.length - 1;
    return Math.min(Math.max(currentPhase, 0), max);
  }, [currentPhase, nodes.length]);

  const currentPosition = safeNode + 1;
  const progressPct = (safeNode / (nodeCount - 1)) * 100;

  const nodeGridStyle = { gridTemplateColumns: `repeat(${nodeCount}, minmax(0, 1fr))` };

  const BASE_LINE = '#082754';
  const PROGRESS_LINE = '#00f2fe'; // Updated to a vibrant cyan for better contrast

  const getState = (nodeIndex: number): NodeState => ({
    isCurrent: nodeIndex === safeNode,
    isPast: nodeIndex < safeNode,
  });

  const cardClass = (state: NodeState, isSpecial?: boolean) =>
    [
      'md:mx-auto',
      'w-full max-w-[280px] md:w-fit md:max-w-full',
      'rounded-2xl px-4 py-3 text-center',
      'backdrop-blur-md border transition-all duration-300',
      'shadow-[0_10px_35px_rgba(0,0,0,0.3)]',
      state.isCurrent
        ? isSpecial
          ? 'bg-red-500/20 border-red-300/40'
          : 'bg-[rgba(0,75,68,0.95)] border-vc-mint/50'
        : state.isPast
          ? 'bg-[rgba(0,75,68,0.7)] border-white/10 opacity-95'
          : 'bg-[rgba(0,75,68,0.4)] border-white/5 opacity-45',
    ].join(' ');

  const titleClass = (state: NodeState, isSpecial?: boolean) => {
    if (isSpecial) return 'text-red-200';
    if (state.isCurrent) return 'text-vc-mint';
    return 'text-white';
  };

  const Card = ({ label, state }: { label: PhaseLabel; state: NodeState }) => (
    <div className={cardClass(state, label.special)}>
      <div className={`font-semibold font-poppins text-xs md:text-sm whitespace-pre-line leading-snug ${titleClass(state, label.special)}`}>
        {label.title}
      </div>
      {label.dates && <div className="text-[10px] text-white/60 mt-2 whitespace-pre-line">{label.dates}</div>}
    </div>
  );

  const EndpointDot = () => <div className="w-5 h-5 rounded-full border-2 border-white bg-transparent" />;

  const Dot = ({ nodeIndex }: { nodeIndex: number }) => {
    const state = getState(nodeIndex);

    return (
      <div
        className="relative flex justify-center cursor-pointer group"
        onClick={() => setCurrentPhase(nodeIndex)}
      >
        {state.isCurrent && (
          <>
            <div className="absolute -inset-3 animate-ping rounded-full border-2 border-vc-mint opacity-75" />
            {isBeating && <div className="absolute -inset-3 animate-pulse rounded-full bg-vc-mint/30" />}
          </>
        )}

        <div
          className={[
            'w-5 h-5 rounded-full border-2 transition-all duration-300',
            state.isCurrent
              ? 'bg-vc-mint border-white scale-125 shadow-lg shadow-vc-mint/50 outline outline-4 outline-vc-mint/20'
              : state.isPast
                ? 'bg-red-500 border-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : 'bg-white/10 border-white/30 group-hover:bg-white/20',
          ].join(' ')}
        />

        {state.isCurrent && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <span className="text-xl animate-bounce">🚀</span>
          </div>
        )}
      </div>
    );
  };

  const currentTitle = nodes[safeNode]?.top?.title || nodes[safeNode]?.bottom?.title || '—';

  return (
    <section id="timeline" className="py-24 md:py-40 relative z-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 font-poppins uppercase tracking-tight">Timeline</h2>
          <p className="text-vc-mint font-bold max-w-2xl mx-auto">Click on the points to explore each phase of the competition.</p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* SHARED CONTAINER FOR DESKTOP & MOBILE */}
          <div className="rounded-3xl backdrop-blur-xl p-6 md:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
            style={{
              background: 'rgba(0, 75, 68, 0.75)',
              border: '1px solid rgba(79, 209, 197, 0.3)'
            }}>

            {/* DESKTOP VIEW */}
            <div className="hidden md:grid items-center" style={nodeGridStyle}>
              {/* TOP CARDS ROW */}
              {nodes.map((n, i) => {
                const state = getState(i);
                return (
                  <div
                    key={`top-${n.id}`}
                    className={`h-[100px] flex items-end justify-center px-1 ${n.top?.special ? 'pb-2' : 'pb-4'}`}
                  >
                    {n.top ? <Card label={n.top} state={state} /> : null}
                  </div>
                );
              })}

              {/* TIMELINE TRACK ROW */}
              <div className="relative h-[80px] flex items-center col-span-full">
                <div className="absolute inset-0">
                  <div
                    className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full"
                    style={{
                      left: `calc(100% / ${nodeCount} / 2)`,
                      right: `calc(100% / ${nodeCount} / 2)`,
                      backgroundColor: BASE_LINE,
                    }}
                  />
                  <motion.div
                    className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `calc((100% - (100% / ${nodeCount})) * (${progressPct} / 100))` }}
                    style={{
                      left: `calc(100% / ${nodeCount} / 2)`,
                      backgroundColor: PROGRESS_LINE,
                      boxShadow: '0 0 10px rgba(0, 242, 254, 0.5)'
                    }}
                  />
                </div>

                <div className="absolute inset-0 grid items-center" style={nodeGridStyle}>
                  {nodes.map((n, i) => (
                    <div key={`dot-${n.id}`} className="flex justify-center">
                      <Dot nodeIndex={i} />
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM CARDS ROW */}
              {nodes.map((n, i) => {
                const state = getState(i);
                return (
                  <div
                    key={`bottom-${n.id}`}
                    className={`h-[100px] flex items-start justify-center px-1 ${n.bottom?.special ? 'pt-2' : 'pt-4'}`}
                  >
                    {n.bottom ? <Card label={n.bottom} state={state} /> : null}
                  </div>
                );
              })}
            </div>

            {/* MOBILE VIEW */}
            <div className="block md:hidden w-full">
              <div className="relative w-full pl-2 pr-2">
                {/* Vertical Line */}
                <div
                  className="absolute w-0.5 bg-gradient-to-b from-vc-mint via-vc-teal to-transparent rounded-full"
                  style={{ left: '20px', top: '15px', bottom: '15px' }}
                />

                <div className="space-y-8">
                  {nodes.map((node, i) => {
                    const state = getState(i);
                    const label = node.top || node.bottom;
                    if (!label) return null;

                    const isFirst = i === 0;
                    const isLast = i === nodes.length - 1;

                    return (
                      <div key={node.id} className="relative flex items-start" onClick={() => setCurrentPhase(i)}>
                        {/* Dot Anchor */}
                        <div className="relative z-10 flex flex-col items-center justify-center min-w-[42px] h-[42px]" style={{ transform: 'translateY(12px)' }}>
                          {state.isCurrent && (
                            <motion.div
                              layoutId="rocket"
                              className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl"
                            >
                              🚀
                            </motion.div>
                          )}

                          {state.isCurrent && (
                            <>
                              <div className="absolute -inset-2 animate-ping rounded-full border border-vc-mint opacity-50" />
                              <div className="absolute -inset-1 animate-pulse rounded-full bg-vc-mint/20" />
                            </>
                          )}

                          <div
                            className={[
                              'w-4 h-4 rounded-full relative z-10 border-2 transition-all duration-300',
                              state.isCurrent
                                ? 'bg-vc-mint border-white shadow-lg shadow-vc-mint/50 scale-150 outline outline-4 outline-vc-mint/20'
                                : state.isPast
                                  ? 'bg-red-500 border-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                                  : 'bg-white/10 border-white/20',
                              isFirst || isLast ? 'w-5 h-5' : '',
                            ].join(' ')}
                          />
                        </div>

                        {/* Card Content */}
                        <div className="flex-1 ml-4 py-2">
                          <div className={`
                            relative p-5 rounded-2xl border transition-all duration-500
                            ${state.isCurrent
                              ? 'bg-white/10 border-vc-mint shadow-[0_0_20px_rgba(79,209,197,0.2)]'
                              : 'bg-black/20 border-white/5'}
                            ${isFirst ? 'border-l-4 border-l-blue-400' : ''}
                            ${isLast ? 'border-l-4 border-l-vc-mint' : ''}
                          `}>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className={`font-bold font-poppins text-lg ${state.isCurrent ? 'text-vc-mint' : 'text-white'}`}>
                                {isFirst && <span className="text-[10px] block uppercase text-blue-400 mb-1">Phase 1: Start</span>}
                                {isLast && <span className="text-[10px] block uppercase text-vc-mint mb-1">Phase Final: Grand Finale</span>}
                                {label.title.replace('\\n', ' ')}
                              </h3>
                            </div>
                            {label.dates && (
                              <div className="text-sm text-white/50 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-vc-mint" />
                                {label.dates}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
