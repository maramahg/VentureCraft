'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useEffect, useMemo, useState } from 'react';

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

type Errors = Record<string, string>;

export default function AboutPage() {
  useScrollAnimation(0.2);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentPhase = 0;
  const isBeating = true;

  const nodes: TimelineNode[] = useMemo(
    () => [
      { id: 0, top: { title: 'Marketing & Promotion', dates: '1 Jan - 1 Feb' } },
      {
        id: 1,
        top: { title: '18 Feb \n Ramadan', special: true },
        bottom: { title: 'Idea Submission', dates: '1 Feb - 1 Mar' },
      },
      {
        id: 2,
        top: { title: 'Screening \n (Round 1 & 2)', dates: '1 Mar - 15 Mar' },
        bottom: { title: '15 - 26 Mar \n Eid Break', special: true },
      },
      { id: 3, bottom: { title: 'Online Bootcamp', dates: '23 Mar - 30 Mar' } },
      { id: 4, top: { title: 'Finalist Notification & Travel Arrangements', dates: '1 April - 5 April' } },
      { id: 5, bottom: { title: 'Bootcamp & Acceleration Program', dates: '5 April - 12 April' } },
      { id: 6, top: { title: 'Final Competition', dates: '15 April' } },
    ],
    []
  );

  const nodeCount = nodes.length + 2;

  const safeNode = useMemo(() => {
    const max = nodes.length - 1;
    return Math.min(Math.max(currentPhase, 0), max);
  }, [currentPhase, nodes.length]);

  const currentPosition = safeNode + 1;
  const progressPct = (currentPosition / (nodeCount - 1)) * 100;

  const nodeGridStyle = { gridTemplateColumns: `repeat(${nodeCount}, minmax(0, 1fr))` };

  const BASE_LINE = '#082754';
  const PROGRESS_LINE = '#4F8DF7';

  const getState = (nodeIndex: number): NodeState => ({
    isCurrent: nodeIndex === safeNode,
    isPast: nodeIndex < safeNode,
  });

  const cardClass = (state: NodeState, isSpecial?: boolean) =>
    [
      'md:mx-auto',
      'w-[88%] max-w-[420px] md:w-fit md:max-w-full',
      'rounded-2xl px-4 py-3 text-center',
      'backdrop-blur-md border transition-all duration-300',
      'bg-black/30 border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.45)]',
      state.isCurrent
        ? isSpecial
          ? 'bg-red-500/10 border-red-300/30'
          : 'bg-green-400/10 border-green-200/30'
        : state.isPast
          ? 'opacity-95'
          : 'opacity-45',
    ].join(' ');

  const titleClass = (state: NodeState, isSpecial?: boolean) => {
    if (isSpecial) return 'text-red-200';
    if (state.isCurrent) return 'text-green-100';
    return 'text-white';
  };

  const Card = ({ label, state }: { label: PhaseLabel; state: NodeState }) => (
    <div className={cardClass(state, label.special)}>
      <div className={`font-semibold whitespace-pre-line leading-snug ${titleClass(state, label.special)}`}>
        {label.title}
      </div>
      {label.dates && <div className="text-xs text-white/60 mt-2 whitespace-pre-line">{label.dates}</div>}
    </div>
  );

  const EndpointDot = () => <div className="w-7 h-7 rounded-full border-4 border-white bg-transparent" />;

  const Dot = ({ nodeIndex }: { nodeIndex: number }) => {
    const state = getState(nodeIndex);

    return (
      <div className="relative flex justify-center">
        {state.isCurrent && (
          <>
            <div className="absolute -inset-3 animate-ping rounded-full border-2 border-green-400 opacity-75" />
            {isBeating && <div className="absolute -inset-3 animate-pulse rounded-full bg-green-400/30" />}
          </>
        )}

        <div
          className={[
            'w-6 h-6 rounded-full border-4 transition-all duration-300',
            state.isCurrent
              ? 'bg-green-400 border-white scale-125 shadow-lg shadow-green-400/50'
              : state.isPast
                ? 'bg-red-400 border-white'
                : 'bg-white/10 border-white/30',
          ].join(' ')}
        />

        {state.isCurrent && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2">
            <span className="text-2xl animate-bounce">🚀</span>
          </div>
        )}
      </div>
    );
  };

  const currentTitle = nodes[safeNode]?.top?.title || nodes[safeNode]?.bottom?.title || '—';

  // -------------------------
  // FORM 
  // -------------------------
  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [preview, setPreview] = useState<object | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

const stepLabel = (n: 1 | 2 | 3) => (n === 1 ? 'User' : n === 2 ? 'Privacy' : 'Done');

const stepValid = (fd: FormData, currentStep: 1 | 2 | 3) => {
  // validate only fields in the current step
  const next: Errors = {};

  const requiredByStep: Record<1 | 2 | 3, string[]> = {
    1: ['fullName', 'nationality', 'email', 'phone'],
    2: ['university', 'major', 'degree', 'socialUrl'],
    3: [],
  };

  for (const key of requiredByStep[currentStep]) {
    const v = String(fd.get(key) ?? '').trim();
    if (!v) next[key] = 'Required';
  }

  const email = String(fd.get('email') ?? '').trim();
  if ((currentStep === 1 || currentStep === 3) && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    next.email = 'Enter a valid email';
  }

  const phone = String(fd.get('phone') ?? '').trim();
  if ((currentStep === 1 || currentStep === 3) && phone && !/^\d+$/.test(phone)) {
    next.phone = 'The value must be a number';
  }

  const socialUrl = String(fd.get('socialUrl') ?? '').trim();
  if ((currentStep === 2 || currentStep === 3) && socialUrl) {
    try {
      const u = new URL(socialUrl);
      if (!['http:', 'https:'].includes(u.protocol)) next.socialUrl = 'Please enter a valid URL';
    } catch {
      next.socialUrl = 'Please enter a valid URL';
    }
  }

  setErrors(next);
  return Object.keys(next).length === 0;
};


  const inputBase =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none ' +
    'focus:border-white/20 focus:ring-2 focus:ring-green-400/30';

  const validate = (fd: FormData) => {
    const next: Errors = {};

    const required = ['fullName', 'nationality', 'email', 'phone', 'university', 'major', 'degree', 'socialUrl'];
    for (const key of required) {
      const v = String(fd.get(key) ?? '').trim();
      if (!v) next[key] = 'Required';
    }

    const email = String(fd.get('email') ?? '').trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';

    const phone = String(fd.get('phone') ?? '').trim();
    if (phone && !/^\d+$/.test(phone)) next.phone = 'The value must be a number';

    const socialUrl = String(fd.get('socialUrl') ?? '').trim();
    if (socialUrl) {
      try {
        const u = new URL(socialUrl);
        if (!['http:', 'https:'].includes(u.protocol)) next.socialUrl = 'Please enter a valid URL';
      } catch {
        next.socialUrl = 'Please enter a valid URL';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  const fd = new FormData(form);

  if (step !== 3) {
    if (!stepValid(fd, step)) return;
    setStep((prev) => (prev === 1 ? 2 : 3));
    return;
  }

  
  if (!stepValid(fd, 1) || !stepValid(fd, 2)) return;

  const obj = Object.fromEntries(fd.entries());
  setPreview(obj);
  setFormStatus('success');
};


  return (
    <>
      <Navbar />

      <main className="relative min-h-screen pt-24 md:pt-0">
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A1F1F] via-[#0A1F1F] to-[#1a4d4d]">
          <div className="w-full max-w-[1400px] px-6">
            <div className="rounded-3xl bg-gradient-to-br from-[#062222] via-[#041C1C] to-[#021212] p-6 md:p-12 border border-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
              <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white">Timeline</h2>
              <div className="h-2 w-64 bg-green-400/80 rounded-full mb-10" />

              {/* DESKTOP VIEW */}
              <div className="hidden md:grid items-center" style={nodeGridStyle}>
                <div className="h-[120px]" />
                {nodes.map((n, i) => {
                  const state = getState(i);
                  return (
                    <div
                      key={`top-${n.id}`}
                      className={`h-[120px] flex items-end justify-center px-2 ${n.top?.special ? 'pb-4' : 'pb-6'}`}
                    >
                      {n.top ? <Card label={n.top} state={state} /> : null}
                    </div>
                  );
                })}
                <div className="h-[120px]" />

                <div className="relative h-[130px] flex items-center col-span-full">
                  <div className="absolute inset-0">
                    <div
                      className="absolute top-1/2 h-[4px] -translate-y-1/2 rounded-full"
                      style={{
                        left: `calc(100% / ${nodeCount} / 2)`,
                        right: `calc(100% / ${nodeCount} / 2)`,
                        backgroundColor: BASE_LINE,
                      }}
                    />
                    <div
                      className="absolute top-1/2 h-[4px] -translate-y-1/2 rounded-full"
                      style={{
                        left: `calc(100% / ${nodeCount} / 2)`,
                        width: `calc((100% - (100% / ${nodeCount})) * ${progressPct / 100})`,
                        backgroundColor: PROGRESS_LINE,
                      }}
                    />
                  </div>

                  <div className="absolute inset-0 grid items-center" style={nodeGridStyle}>
                    <div className="flex justify-center">
                      <EndpointDot />
                    </div>

                    {nodes.map((n, i) => (
                      <div key={`dot-${n.id}`} className="flex justify-center">
                        <Dot nodeIndex={i} />
                      </div>
                    ))}

                    <div className="flex justify-center">
                      <EndpointDot />
                    </div>
                  </div>

                  <div className="absolute inset-0 grid items-center pointer-events-none" style={nodeGridStyle}>
                    <div className="relative flex justify-center">
                      <div className="absolute -top-14 text-white font-semibold text-sm">Start</div>
                    </div>

                    {nodes.map((n) => (
                      <div key={`sf-spacer-${n.id}`} />
                    ))}

                    <div className="relative flex justify-center">
                      <div className="absolute -top-14 text-white font-semibold text-sm">Finish</div>
                    </div>
                  </div>
                </div>

                <div className="h-[120px]" />
                {nodes.map((n, i) => {
                  const state = getState(i);
                  return (
                    <div
                      key={`bottom-${n.id}`}
                      className={`h-[120px] flex items-start justify-center px-2 ${n.bottom?.special ? 'pt-4' : 'pt-6'}`}
                    >
                      {n.bottom ? <Card label={n.bottom} state={state} /> : null}
                    </div>
                  );
                })}
                <div className="h-[120px]" />
              </div>

              {/* MOBILE VIEW */}
              <div className="block md:hidden w-full">
                <div className="h-8" />

                <div className="relative w-full pl-2 pr-2">
                  <div
                    className="absolute w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500 rounded-full"
                    style={{ left: '16px', top: '38px', bottom: '38px' }}
                  />

                  <div className="mb-3">
                    <span className="ml-10 text-white font-semibold text-sm">Start</span>
                  </div>

                  <div className="mb-8 relative" style={{ height: '28px' }}>
                    <div style={{ position: 'absolute', left: '6px', top: '0' }}>
                      <div className="w-6 h-6 rounded-full border-4 border-white bg-transparent" />
                    </div>
                  </div>

                  {nodes.map((node, i) => {
                    const state = getState(i);

                    return (
                      <div key={node.id} className="relative">
                        {node.top && (
                          <div className="relative mb-8">
                            {!node.top.special && (
                              <div className="absolute z-10" style={{ left: '9px', top: '50%', transform: 'translateY(-50%)' }}>
                                {state.isCurrent && (
                                  <>
                                    <div className="absolute -inset-3 animate-ping rounded-full border-2 border-green-400 opacity-75" />
                                    {isBeating && <div className="absolute -inset-3 animate-pulse rounded-full bg-green-400/30" />}
                                  </>
                                )}
                                <div
                                  className={[
                                    'w-5 h-5 rounded-full relative z-10 border-4 transition-all duration-300',
                                    state.isCurrent
                                      ? 'bg-green-400 border-white shadow-lg shadow-green-400/50 scale-125'
                                      : state.isPast
                                        ? 'bg-red-400 border-white'
                                        : 'bg-white/10 border-white/30',
                                  ].join(' ')}
                                />
                                {state.isCurrent && (
                                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xl animate-bounce z-20">
                                    🚀
                                  </div>
                                )}
                              </div>
                            )}

                            <div style={{ marginLeft: '56px' }}>
                              <Card label={node.top} state={state} />
                            </div>
                          </div>
                        )}

                        {node.bottom && (
                          <div className="relative mb-8">
                            {!node.bottom.special && (
                              <div className="absolute z-10" style={{ left: '9px', top: '50%', transform: 'translateY(-50%)' }}>
                                {state.isCurrent && (
                                  <>
                                    <div className="absolute -inset-3 animate-ping rounded-full border-2 border-green-400 opacity-75" />
                                    {isBeating && <div className="absolute -inset-3 animate-pulse rounded-full bg-green-400/30" />}
                                  </>
                                )}
                                <div
                                  className={[
                                    'w-5 h-5 rounded-full relative z-10 border-4 transition-all duration-300',
                                    state.isCurrent
                                      ? 'bg-green-400 border-white shadow-lg shadow-green-400/50 scale-125'
                                      : state.isPast
                                        ? 'bg-red-400 border-white'
                                        : 'bg-white/10 border-white/30',
                                  ].join(' ')}
                                />
                                {state.isCurrent && (
                                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 text-xl animate-bounce z-20">
                                    🚀
                                  </div>
                                )}
                              </div>
                            )}

                            <div style={{ marginLeft: '56px' }}>
                              <Card label={node.bottom} state={state} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="mt-4 mb-3 relative" style={{ height: '28px' }}>
                    <div style={{ position: 'absolute', left: '6px', top: '0' }}>
                      <div className="w-6 h-6 rounded-full border-4 border-white bg-transparent" />
                    </div>
                  </div>

                  <div>
                    <span className="ml-10 text-white font-semibold text-sm">Finish</span>
                  </div>
                </div>

                <div className="h-8" />
              </div>

              <p className="text-center mt-8 text-green-200">
                Current Phase: <span className="font-bold text-white">{currentTitle}</span>
              </p>

              {/* FORM SECTION HEREEEE */}
             

<div className="mt-14">
  <h3 className="text-3xl md:text-4xl font-bold text-white">Application Form</h3>
  <div className="h-2 w-56 bg-green-400/80 rounded-full mt-3 mb-8" />

  <div className="rounded-3xl bg-black/30 border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.55)] p-5 md:p-10 backdrop-blur-md">
    <div className="mx-auto w-full max-w-[640px] rounded-2xl bg-white/5 border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="px-6 py-5 md:px-10 md:py-7">
        <h4 className="text-center text-2xl font-bold text-white">Signup Form</h4>

        {/* Stepper */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className={step === 1 ? 'text-green-200 font-semibold' : ''}>User</span>
            <span className={step === 2 ? 'text-green-200 font-semibold' : ''}>Privacy</span>
            <span className={step === 3 ? 'text-green-200 font-semibold' : ''}>Done</span>
          </div>

          <div className="relative mt-3 h-8">
            {/* line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/15" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-green-400/80 transition-all"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            />

            {/* dots */}
            <div className="absolute inset-0 flex items-center justify-between">
              {[1, 2, 3].map((n) => {
                const active = step === n;
                const done = step > n;
                return (
                  <div
                    key={n}
                    className={[
                      'w-8 h-8 rounded-full flex items-center justify-center border text-sm font-semibold transition-all',
                      active
                        ? 'bg-green-400 text-black border-white shadow-lg shadow-green-400/30'
                        : done
                          ? 'bg-green-400/30 text-white border-white/30'
                          : 'bg-black/30 text-white/70 border-white/20',
                    ].join(' ')}
                  >
                    {n}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          {/* Step title */}
          <div className="text-white/85 font-semibold">{stepLabel(step as 1 | 2 | 3)} Form:</div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/80 mb-2">name *</label>
                <input
                  name="fullName"
                  placeholder="Enter your answer"
                  className={`${inputBase} ${errors.fullName ? 'border-red-400/40 ring-2 ring-red-400/20' : ''}`}
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-200">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">nationality *</label>
                <input
                  name="nationality"
                  placeholder="Enter your answer"
                  className={`${inputBase} ${errors.nationality ? 'border-red-400/40 ring-2 ring-red-400/20' : ''}`}
                />
                {errors.nationality && <p className="mt-1 text-xs text-red-200">{errors.nationality}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">email *</label>
                <input
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  className={`${inputBase} ${errors.email ? 'border-red-400/40 ring-2 ring-red-400/20' : ''}`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-200">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">phone number *</label>
                <input
                  name="phone"
                  inputMode="numeric"
                  placeholder="The value must be a number"
                  className={`${inputBase} ${errors.phone ? 'border-red-400/40 ring-2 ring-red-400/20' : ''}`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-200">{errors.phone}</p>}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/80 mb-2">university *</label>
                <input
                  name="university"
                  placeholder="Enter your answer"
                  className={`${inputBase} ${errors.university ? 'border-red-400/40 ring-2 ring-red-400/20' : ''}`}
                />
                {errors.university && <p className="mt-1 text-xs text-red-200">{errors.university}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">major *</label>
                <input
                  name="major"
                  placeholder="Enter your answer"
                  className={`${inputBase} ${errors.major ? 'border-red-400/40 ring-2 ring-red-400/20' : ''}`}
                />
                {errors.major && <p className="mt-1 text-xs text-red-200">{errors.major}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">degree *</label>
                <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  {['Bachelor', 'Master', 'PhD', 'Other'].map((opt) => (
                    <label key={opt} className="flex items-center gap-3 text-white/80">
                      <input type="radio" name="degree" value={opt} className="h-4 w-4 accent-green-400" />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.degree && <p className="mt-1 text-xs text-red-200">{errors.degree}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">social media (x,Linkedin,Instagram) *</label>
                <input
                  name="socialUrl"
                  type="url"
                  placeholder="https://..."
                  className={`${inputBase} ${errors.socialUrl ? 'border-red-400/40 ring-2 ring-red-400/20' : ''}`}
                />
                {errors.socialUrl && <p className="mt-1 text-xs text-red-200">{errors.socialUrl}</p>}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm text-white/80 mb-2">Review & Submit</div>
              <div className="text-xs text-white/55">
                Click <span className="text-white/80 font-semibold">Submit</span> to preview.
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-white/55">* required fields</div>

            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setFormStatus('idle');
                    setStep((s) => (s === 3 ? 2 : 1));
                  }}
                  className="rounded-xl px-5 py-2 text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  Back
                </button>
              )}

              <button
                type="submit"
                className="rounded-xl px-6 py-2 text-sm font-medium border border-white/10 bg-green-400/90 text-black hover:bg-green-400 transition"
              >
                {step === 3 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </form>

        {/* Success + preview */}
        {formStatus === 'success' && preview && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-sm text-green-200 mb-2">Submitted  </div>
            <pre className="overflow-auto text-xs text-white/80">{JSON.stringify(preview, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
{/* END FORM SECTION */}

           
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
