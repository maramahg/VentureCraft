'use client';
// Final refined timeline with deep responsiveness

import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type PhaseLabel = {
  title: string;
  dates?: string;
  special?: boolean;
  description?: string;
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
  const IS_POSTPONED = false;
  const [currentPhase, setCurrentPhase] = useState(IS_POSTPONED ? -1 : 0);
  const isBeating = true;

  const nodes: TimelineNode[] = useMemo(
    () => [
      { id: 1, top: { title: 'Idea Submission', dates: 'Announcing Soon', description: 'Launch your journey. Submit your initial concept for review by our technical committee.' } },
      { id: 2, bottom: { title: 'Screening\n(round 1&2)', dates: 'Announcing Soon', description: 'Expert technical and business validation. Top innovators advance to the next stage of the competition.' } },
      { id: 3, top: { title: 'Finalist\nConfirmation', dates: 'Announcing Soon', description: 'Confirmed finalists receive their advancement notice and prepare for the next stage.' } },
      { id: 4, bottom: { title: 'Online Bootcamp', dates: 'Announcing Soon', description: 'A virtual deep-dive into startup fundamentals, IP strategy, and go-to-market planning.' } },
      { id: 5, top: { title: 'Finalist Notification\n& Travel', dates: 'Announcing Soon', description: 'Selected teams receive travel coordination details for the in-person acceleration program.' } },
      { id: 6, bottom: { title: 'In-Person\nAcceleration', dates: 'Announcing Soon', description: 'Hands-on mentoring and site visits to stress-test your solution in a real-world ecosystem.' } },
      { id: 7, top: { title: 'Final Competition', dates: 'Announcing Soon', description: 'Pitch your venture to global investors and energy leaders for the grand prize and partnership deals.' } },
    ],
    []
  );

  const nodeCount = nodes.length;

  useEffect(() => {
    if (IS_POSTPONED) return;

    const phases = [
      new Date('2026-07-15T00:00:00'),
      new Date('2026-08-16T00:00:00'),
      new Date('2026-08-30T00:00:00'),
      new Date('2026-09-06T00:00:00'),
      new Date('2026-09-22T00:00:00'),
      new Date('2026-09-26T00:00:00'),
      new Date('2026-09-30T00:00:00'),
    ];
    const now = new Date();
    const idx = phases.reduce((acc, d, i) => (now >= d ? i : acc), 0);
    setCurrentPhase(Math.min(idx, phases.length - 1));
  }, [IS_POSTPONED]);

  const safeNode = useMemo(() => {
    if (IS_POSTPONED) return -1;
    const max = nodes.length - 1;
    return Math.min(Math.max(currentPhase, 0), max);
  }, [currentPhase, nodes.length, IS_POSTPONED]);

  const progressPct = (safeNode / (nodeCount - 1)) * 100;

  const nodeGridStyle = { gridTemplateColumns: `repeat(${nodeCount}, minmax(0, 1fr))` };

  const BASE_LINE = '#082754';
  const PROGRESS_LINE = '#4FD1C5';

  const getState = (nodeIndex: number): NodeState => ({
    isCurrent: nodeIndex === safeNode,
    isPast: nodeIndex < safeNode,
  });

  const cardClass = (state: NodeState, isSpecial?: boolean) =>
    [
      'lg:mx-auto',
      'w-full max-w-[280px] lg:w-[150%] lg:max-w-[480px] xl:max-w-[540px]',
      'rounded-2xl px-5 py-4 text-center',
      'backdrop-blur-md border transition-all duration-500 ease-in-out',
      'shadow-[0_10px_35px_rgba(0,0,0,0.3)]',
      state.isCurrent
        ? isSpecial
          ? 'bg-red-500/20 border-red-300/40 ring-2 ring-red-500/20'
          : 'bg-[rgba(0,75,68,0.95)] border-vc-mint/50 ring-2 ring-vc-mint/30'
        : state.isPast
          ? 'bg-[rgba(0,75,68,0.7)] border-white/10 opacity-95'
          : 'bg-[rgba(0,75,68,0.4)] border-white/5 opacity-45 hover:bg-[rgba(0,75,68,0.55)]',
    ].join(' ');

  const titleClass = (state: NodeState, isSpecial?: boolean) => {
    if (isSpecial) return 'text-red-200';
    if (state.isCurrent) return 'text-vc-mint';
    return 'text-white';
  };

  const Card = ({ label, state }: { label: PhaseLabel; state: NodeState; isTop?: boolean }) => (
    <div className={cardClass(state, label.special)}>
      <div className={`font-bold font-poppins text-lg md:text-xl whitespace-pre-line leading-tight ${titleClass(state, label.special)}`}>
        {label.title}
      </div>
      {label.dates && (
        <div className="text-sm md:text-base font-poppins text-white/50 mt-1.5 uppercase tracking-wider font-medium">
          {label.dates}
        </div>
      )}

      {state.isCurrent && label.description && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
          className="overflow-hidden border-t border-white/10 pt-3"
        >
          <p className="text-white/80 font-poppins text-base md:text-lg leading-relaxed text-left md:text-center">
            {label.description}
          </p>
        </motion.div>
      )}
    </div>
  );

  const Dot = ({ nodeIndex }: { nodeIndex: number }) => {
    const state = getState(nodeIndex);

    return (
      <div
        className="relative flex justify-center cursor-pointer group"
        onClick={() => setCurrentPhase(nodeIndex)}
      >
        {state.isCurrent && (
          <>
            <div className="absolute -inset-4 animate-ping rounded-full border-2 border-vc-mint opacity-40" />
            {isBeating && <div className="absolute -inset-4 animate-pulse rounded-full bg-vc-mint/20" />}
          </>
        )}

        <div
          className={[
            'w-5 h-5 rounded-full border-2 transition-all duration-300 relative z-10',
            state.isCurrent
              ? 'bg-vc-mint border-white scale-125 shadow-lg shadow-vc-mint/50'
              : state.isPast
                ? 'bg-vc-mint/60 border-white/60 shadow-[0_0_15px_rgba(79,209,197,0.3)]'
                : 'bg-white/10 border-white/30 group-hover:bg-white/20 group-hover:border-white/50',
          ].join(' ')}
        />

        {state.isCurrent && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <span className="text-2xl animate-bounce">🚀</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="timeline" className="py-24 md:py-40 relative z-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 font-poppins uppercase tracking-tight text-white">Timeline</h2>
          <p className="text-vc-mint font-bold font-poppins max-w-vc-container mx-auto uppercase tracking-widest text-xs md:text-sm">Explore our journey to the grand finale</p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="rounded-3xl backdrop-blur-xl p-6 md:p-12 lg:px-16 lg:py-20 xl:px-32 shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
            style={{
              background: 'rgba(0, 75, 68, 0.75)',
              border: '1px solid rgba(79, 209, 197, 0.3)'
            }}>

            <div className="hidden lg:grid items-center" style={nodeGridStyle}>
              {nodes.map((n, i) => {
                const state = getState(i);
                return (
                  <div
                    key={`top-${n.id}`}
                    className="flex flex-col items-center justify-end h-[160px] lg:h-[180px] pb-8 cursor-pointer"
                    onClick={() => setCurrentPhase(i)}
                  >
                    {n.top ? <Card label={n.top} state={state} isTop /> : null}
                  </div>
                );
              })}

              <div className="relative h-[2px] flex items-center col-span-full my-4">
                <div className="absolute inset-0">
                  <div
                    className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full w-full"
                    style={{
                      left: 0,
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
                      boxShadow: '0 0 15px rgba(79, 209, 197, 0.6)'
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

              {nodes.map((n, i) => {
                const state = getState(i);
                return (
                  <div
                    key={`bottom-${n.id}`}
                    className="flex flex-col items-center justify-start h-[160px] lg:h-[180px] pt-8 cursor-pointer"
                    onClick={() => setCurrentPhase(i)}
                  >
                    {n.bottom ? <Card label={n.bottom} state={state} /> : null}
                  </div>
                );
              })}
            </div>

            <div className="block lg:hidden w-full">
              <div className="relative w-full max-w-md mx-auto">
                <div
                  className="absolute w-0.5 bg-gradient-to-b from-vc-mint via-vc-teal to-transparent rounded-full"
                  style={{ left: '20px', top: '20px', bottom: '20px' }}
                />

                <div className="space-y-6">
                  {nodes.map((node, i) => {
                    const state = getState(i);
                    const label = node.top || node.bottom;
                    if (!label) return null;

                    return (
                      <div key={node.id} className="relative flex items-start cursor-pointer" onClick={() => setCurrentPhase(i)}>
                        <div className="relative z-10 flex flex-col items-center justify-center min-w-[42px] mt-4">
                          {state.isCurrent && (
                            <motion.div
                              layoutId="rocket-mobile"
                              className="absolute -top-12 left-1/2 -translate-x-1/2 text-2xl"
                            >
                              🚀
                            </motion.div>
                          )}

                          {state.isCurrent && (
                            <>
                              <div className="absolute -inset-2 animate-ping rounded-full border border-vc-mint opacity-40" />
                              <div className="absolute -inset-1 animate-pulse rounded-full bg-vc-mint/15" />
                            </>
                          )}

                          <div
                            className={[
                              'w-4 h-4 rounded-full relative z-10 border-2 transition-all duration-300',
                              state.isCurrent
                                ? 'bg-vc-mint border-white shadow-lg shadow-vc-mint/50 scale-125'
                                : state.isPast
                                  ? 'bg-vc-mint/60 border-white/60 transition-opacity'
                                  : 'bg-white/10 border-white/20',
                            ].join(' ')}
                          />
                        </div>

                        <div className="flex-1 ml-4">
                          <Card label={label} state={state} />
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
