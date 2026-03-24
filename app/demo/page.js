'use client';
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { runPRDAnalyst, runCriteriaEngine, runTestArchitect, runQualityOracle } from '../../components/agents';
import { SAMPLE_PRDS, AGENT_CONFIG, PIPELINE_ORDER } from '../../components/data';
import FeedbackWidget from '../../components/FeedbackWidget';

/* ── Agent Card ── */
function AgentCard({ agentKey, data, isActive, isComplete, onClick, isSelected }) {
  const agent = AGENT_CONFIG[agentKey];
  return (
    <div onClick={onClick} className="transition-all duration-300 cursor-pointer" style={{
      padding: '12px 14px', borderRadius: 12, position: 'relative', overflow: 'hidden',
      border: isSelected ? `2px solid ${agent.color}` : isComplete ? `2px solid ${agent.color}40` : isActive ? `2px solid ${agent.color}60` : '2px solid transparent',
      background: isComplete ? agent.bgLight : isActive ? agent.bgLight : '#FAFAFA',
      opacity: !isActive && !isComplete ? 0.5 : 1,
    }}>
      {isActive && <div className="absolute top-0 left-0 right-0 h-[3px] animate-shimmer" style={{ background: `linear-gradient(90deg, ${agent.color}, transparent)` }} />}
      <div className="flex items-center gap-3">
        <span className="text-xl">{agent.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-gray-900 truncate">{agent.name}</div>
          <div className="text-xs text-gray-500 truncate">{isActive ? 'Processing...' : isComplete ? 'Complete' : agent.description}</div>
        </div>
        {isComplete && !isActive && (
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: agent.color }}>✓</div>
        )}
        {isActive && (
          <div className="w-6 h-6 rounded-full shrink-0 animate-spin-slow" style={{ border: `3px solid ${agent.color}`, borderTopColor: 'transparent' }} />
        )}
      </div>
    </div>
  );
}

/* ── Result Views ── */
function PRDAnalystView({ data }) {
  if (!data) return null;
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="p-4 bg-teal-50 rounded-xl border-l-4 border-teal-500">
        <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Summary</div>
        <div className="text-sm text-gray-800 leading-relaxed">{data.summary}</div>
      </div>
      <div>
        <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Requirements ({data.requirements?.length})</div>
        {data.requirements?.map((req, i) => (
          <div key={i} className="p-3 mb-2 bg-white rounded-lg border border-gray-200 flex gap-3 items-start">
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono whitespace-nowrap ${req.priority === 'P0' ? 'bg-red-100 text-red-600' : req.priority === 'P1' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>{req.id}</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-900">{req.title}</div>
              <div className="text-xs text-gray-500 mt-1 leading-relaxed">{req.description}</div>
              <div className="flex gap-1.5 mt-2">
                <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500 font-mono">{req.type}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${req.priority === 'P0' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>{req.priority}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {data.ambiguities?.length > 0 && (
        <div>
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">⚠ Ambiguities Found</div>
          {data.ambiguities.map((a, i) => <div key={i} className="p-2 mb-1 bg-amber-50 rounded-md text-xs text-amber-800 border-l-[3px] border-amber-400 leading-relaxed">{a}</div>)}
        </div>
      )}
      {data.missing_coverage?.length > 0 && (
        <div>
          <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">🚨 Missing Coverage</div>
          {data.missing_coverage.map((m, i) => <div key={i} className="p-2 mb-1 bg-red-50 rounded-md text-xs text-red-800 border-l-[3px] border-red-400 leading-relaxed">{m}</div>)}
        </div>
      )}
    </div>
  );
}

function CriteriaView({ data }) {
  if (!data) return null;
  return (
    <div className="space-y-4 animate-fade-in">
      {data.criteria?.map((c, i) => (
        <div key={i} className="p-3.5 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-purple-50 text-purple-600">{c.req_id}</span>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Priority: {c.priority_score}/10</span>
          </div>
          {c.acceptance_criteria?.map((ac, j) => (
            <div key={j} className="p-2.5 mb-1.5 bg-gray-50 rounded-md font-mono text-xs leading-[1.8]">
              <div><span className="text-purple-600 font-bold">GIVEN </span><span className="text-gray-700">{ac.given}</span></div>
              <div><span className="text-blue-600 font-bold">WHEN </span><span className="text-gray-700">{ac.when}</span></div>
              <div><span className="text-emerald-600 font-bold">THEN </span><span className="text-gray-700">{ac.then}</span></div>
            </div>
          ))}
          {c.edge_cases?.length > 0 && (
            <div className="mt-2">
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Edge Cases</div>
              {c.edge_cases.map((e, k) => <div key={k} className="text-xs text-gray-500 py-0.5">→ {e}</div>)}
            </div>
          )}
        </div>
      ))}
      {data.risk_areas?.length > 0 && (
        <div className="p-3.5 bg-red-50 rounded-xl border-l-4 border-red-500">
          <div className="text-xs font-bold text-red-600 mb-2">Risk Areas</div>
          {data.risk_areas.map((r, i) => <div key={i} className="text-xs text-red-800 py-0.5">• {r}</div>)}
        </div>
      )}
    </div>
  );
}

function TestArchitectView({ data }) {
  if (!data) return null;
  const cp = data.coverage_map?.total_requirements > 0 ? Math.round((data.coverage_map.covered / data.coverage_map.total_requirements) * 100) : 0;
  return (
    <div className="space-y-4 animate-fade-in">
      {data.coverage_map && (
        <div className="p-3.5 bg-green-50 rounded-xl border-l-4 border-green-500 flex gap-4 items-center">
          <div className="text-center">
            <div className="text-2xl font-black text-green-600">{cp}%</div>
            <div className="text-[10px] text-gray-500">Coverage</div>
          </div>
          <div className="flex-1 h-2 bg-green-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${cp}%` }} />
          </div>
          <div className="text-xs text-gray-500 font-mono">{data.coverage_map.covered}/{data.coverage_map.total_requirements}</div>
        </div>
      )}
      {data.test_suites?.map((suite, i) => (
        <div key={i} className="p-3.5 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="font-bold text-sm text-gray-900">{suite.suite_name}</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-600 font-mono">{suite.framework}</span>
          </div>
          {suite.tests?.map((test, j) => (
            <div key={j} className="mb-2 p-2.5 bg-gray-50 rounded-md border border-gray-100">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-600 font-mono">{test.id}</span>
                <span className="text-[10px] text-gray-400 font-mono">→ {test.ac_id}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${test.type === 'e2e' ? 'bg-amber-100 text-amber-600' : test.type === 'integration' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{test.type}</span>
                <div className="flex-1" />
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${test.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{test.status}</span>
              </div>
              <div className="text-xs font-semibold text-gray-800 mb-1.5">{test.name}</div>
              <pre className="m-0 p-2 bg-[#1a1a2e] rounded text-[11px] text-cyan-300 overflow-auto font-mono leading-relaxed whitespace-pre-wrap break-words">{test.code_snippet}</pre>
            </div>
          ))}
        </div>
      ))}
      {data.ci_config_suggestion && (
        <div className="p-3 bg-blue-50 rounded-lg border-l-[3px] border-blue-500 text-xs text-blue-800 leading-relaxed">
          <strong>CI/CD: </strong>{data.ci_config_suggestion}
        </div>
      )}
    </div>
  );
}

function QualityOracleView({ data }) {
  if (!data) return null;
  const vc = { SHIP: '#22C55E', HOLD: '#F59E0B', BLOCK: '#EF4444' };
  const sc = { pass: '#22C55E', warning: '#F59E0B', fail: '#EF4444' };
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="p-5 rounded-2xl text-center" style={{ background: `linear-gradient(135deg, ${vc[data.verdict]}15, ${vc[data.verdict]}05)`, border: `2px solid ${vc[data.verdict]}40` }}>
        <div className="text-5xl font-black" style={{ color: vc[data.verdict] }}>{data.overall_score}</div>
        <div className="inline-block mt-1 px-5 py-1 rounded-full text-white text-base font-black tracking-widest" style={{ background: vc[data.verdict] }}>{data.verdict}</div>
        <div className="text-sm text-gray-600 mt-3 leading-relaxed max-w-lg mx-auto">{data.verdict_reason}</div>
      </div>
      <div>
        <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Requirement Status</div>
        {data.requirement_status?.map((r, i) => (
          <div key={i} className="p-2.5 mb-1.5 bg-white rounded-lg border border-gray-200 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: sc[r.status] }} />
            <span className="text-[10px] font-bold text-purple-600 font-mono shrink-0">{r.req_id}</span>
            <div className="flex-1 text-xs text-gray-800 min-w-0 truncate">{r.title}</div>
            <span className="text-xs text-gray-400 font-mono shrink-0">{Math.round(r.confidence * 100)}%</span>
          </div>
        ))}
      </div>
      {data.top_risks?.length > 0 && (
        <div>
          <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Top Risks</div>
          {data.top_risks.map((r, i) => (
            <div key={i} className="p-2.5 mb-1.5 rounded-lg" style={{
              background: r.severity === 'high' ? '#FEF2F2' : r.severity === 'medium' ? '#FFFBEB' : '#F0FDF4',
              borderLeft: `3px solid ${r.severity === 'high' ? '#EF4444' : r.severity === 'medium' ? '#F59E0B' : '#22C55E'}`,
            }}>
              <div className="text-xs font-semibold text-gray-900">{r.risk}</div>
              <div className="text-xs text-gray-500 mt-1">→ {r.recommendation}</div>
            </div>
          ))}
        </div>
      )}
      {data.pm_summary && (
        <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
          <div className="text-[10px] font-bold text-blue-600 uppercase mb-2">📋 Copy to Slack</div>
          <div className="text-xs text-blue-900 leading-relaxed">{data.pm_summary}</div>
          <button
            onClick={() => { try { navigator.clipboard?.writeText(data.pm_summary); } catch(e) {} }}
            className="mt-2 px-3 py-1 rounded text-[10px] font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}

const VIEWS = { prd_analyst: PRDAnalystView, criteria_engine: CriteriaView, test_architect: TestArchitectView, quality_oracle: QualityOracleView };

/* ═══ MAIN DEMO PAGE ═══ */
export default function DemoPage() {
  const [prdText, setPrdText] = useState('');
  const [running, setRunning] = useState(false);
  const [activeAgent, setActiveAgent] = useState(null);
  const [results, setResults] = useState({});
  const [selectedView, setSelectedView] = useState(null);
  const [agentLog, setAgentLog] = useState([]);
  const [showMobilePanel, setShowMobilePanel] = useState('input'); // 'input' | 'results'
  const textareaRef = useRef(null);
  const logRef = useRef(null);

  const addLog = useCallback((msg) => {
    setAgentLog(prev => {
      const next = [...prev, { time: new Date().toLocaleTimeString(), msg }];
      setTimeout(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, 50);
      return next;
    });
  }, []);

  async function runPipeline() {
    if (!prdText.trim()) return;
    setRunning(true); setResults({}); setAgentLog([]); setSelectedView(null);

    setActiveAgent('prd_analyst'); addLog('PRD Analyst parsing requirements...');
    const prdResult = await runPRDAnalyst(prdText);
    setResults(p => ({ ...p, prd_analyst: prdResult })); setSelectedView('prd_analyst');
    addLog(`Found ${prdResult.requirements.length} requirements, ${prdResult.ambiguities.length} ambiguities, ${prdResult.missing_coverage.length} gaps`);

    setActiveAgent('criteria_engine'); addLog('Criteria Engine generating acceptance criteria...');
    const criteriaResult = await runCriteriaEngine(prdResult);
    setResults(p => ({ ...p, criteria_engine: criteriaResult })); setSelectedView('criteria_engine');
    addLog(`Generated ${criteriaResult.criteria.reduce((a, c) => a + c.acceptance_criteria.length, 0)} acceptance criteria`);

    setActiveAgent('test_architect'); addLog('Test Architect building test suites...');
    const testResult = await runTestArchitect(criteriaResult, prdResult);
    setResults(p => ({ ...p, test_architect: testResult })); setSelectedView('test_architect');
    addLog(`Created ${testResult.test_suites.reduce((a, s) => a + s.tests.length, 0)} tests — ${testResult.coverage_map.covered}/${testResult.coverage_map.total_requirements} covered`);

    setActiveAgent('quality_oracle'); addLog('Quality Oracle analyzing full pipeline...');
    const oracleResult = await runQualityOracle(prdResult, criteriaResult, testResult);
    setResults(p => ({ ...p, quality_oracle: oracleResult })); setSelectedView('quality_oracle');
    addLog(`Verdict: ${oracleResult.verdict} (Score: ${oracleResult.overall_score}/100)`);

    setActiveAgent(null); addLog('Pipeline complete.'); setRunning(false);
    setShowMobilePanel('results');
  }

  const ActiveView = selectedView ? VIEWS[selectedView] : null;
  const hasResults = Object.keys(results).length > 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 sm:px-6 h-14 bg-[#1a1a2e] border-b-2 border-teal-500">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg, #0D9488, #7C3AED)' }}>
            <span className="text-white">⚡</span>
          </div>
          <div>
            <div className="font-extrabold text-base text-white tracking-tight">Eval Copilot PRO</div>
            <div className="text-[10px] text-emerald-300 font-mono">PRD → Criteria → Tests → Verdict</div>
          </div>
        </Link>
        <div className="flex-1" />
        <div className="px-2.5 py-1 rounded-md text-[10px] font-mono text-emerald-300 border border-emerald-500/30 bg-emerald-500/10 hidden sm:block">
          100% Local • No API Keys
        </div>
        {/* Mobile toggle */}
        {hasResults && (
          <div className="flex sm:hidden gap-1 bg-gray-800 rounded-lg p-0.5">
            <button onClick={() => setShowMobilePanel('input')} className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${showMobilePanel === 'input' ? 'bg-teal-600 text-white' : 'text-gray-400'}`}>Input</button>
            <button onClick={() => setShowMobilePanel('results')} className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${showMobilePanel === 'results' ? 'bg-teal-600 text-white' : 'text-gray-400'}`}>Results</button>
          </div>
        )}
      </div>

      <div className="flex h-[calc(100vh-56px)]">
        {/* Left Panel */}
        <div className={`w-full sm:w-[360px] border-r border-gray-200 flex flex-col bg-white shrink-0 overflow-auto ${hasResults && showMobilePanel !== 'input' ? 'hidden sm:flex' : 'flex'}`}>
          {/* PRD Input */}
          <div className="p-3.5 border-b border-gray-100">
            <div className="font-bold text-sm text-gray-900 mb-2">Paste your PRD</div>
            <div className="flex gap-1.5 flex-wrap mb-2.5">
              {SAMPLE_PRDS.map((s, i) => (
                <button key={i} onClick={() => { setPrdText(s.text); textareaRef.current?.focus(); }}
                  className="px-2.5 py-1 rounded-md border border-gray-200 bg-gray-50 text-[11px] text-gray-500 hover:border-teal-500 hover:text-teal-600 transition-colors cursor-pointer">
                  {s.label}
                </button>
              ))}
            </div>
            <textarea ref={textareaRef} value={prdText} onChange={e => setPrdText(e.target.value)}
              placeholder="Paste your product requirements document here..."
              className="w-full h-40 sm:h-44 resize-none rounded-lg border border-gray-200 p-3 text-sm text-gray-800 bg-gray-50 leading-relaxed" />
            <button onClick={runPipeline} disabled={running || !prdText.trim()}
              className="w-full mt-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: running || !prdText.trim() ? '#D1D5DB' : 'linear-gradient(135deg, #0D9488, #0F766E)' }}>
              {running ? '⏳ Agents Working...' : '🚀 Run Pipeline'}
            </button>
          </div>

          {/* Agent cards */}
          <div className="p-3.5 space-y-1.5">
            {PIPELINE_ORDER.map(key => (
              <AgentCard key={key} agentKey={key} data={results[key]} isActive={activeAgent === key} isComplete={!!results[key]}
                isSelected={selectedView === key}
                onClick={() => { if (results[key]) { setSelectedView(key); setShowMobilePanel('results'); } }} />
            ))}
          </div>

          {/* Agent Log */}
          {agentLog.length > 0 && (
            <div className="px-3.5 pb-3.5 border-t border-gray-100 pt-3">
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">Agent Log</div>
              <div ref={logRef} className="max-h-28 overflow-auto bg-[#1a1a2e] rounded-lg p-2.5">
                {agentLog.map((l, i) => (
                  <div key={i} className="text-[11px] text-cyan-300 font-mono py-0.5 leading-snug animate-fade-in">
                    <span className="text-gray-500">[{l.time}]</span> {l.msg}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className={`flex-1 overflow-auto p-4 sm:p-6 ${hasResults && showMobilePanel !== 'results' ? 'hidden sm:block' : ''} ${!hasResults && !running ? 'hidden sm:flex' : ''}`}>
          {!selectedView && !running && !hasResults && (
            <div className="flex items-center justify-center h-full flex-col gap-4">
              <div className="text-5xl opacity-20">⚡</div>
              <div className="text-lg font-bold text-gray-300">Paste a PRD and run the pipeline</div>
              <div className="text-sm text-gray-300 max-w-md text-center leading-relaxed">
                Four local AI agents will analyze your requirements, generate acceptance criteria, create test plans, and deliver a quality verdict.
              </div>
            </div>
          )}
          {selectedView && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{AGENT_CONFIG[selectedView].icon}</span>
                <div>
                  <div className="font-extrabold text-xl text-gray-900">{AGENT_CONFIG[selectedView].name}</div>
                  <div className="text-xs text-gray-500">{AGENT_CONFIG[selectedView].description}</div>
                </div>
              </div>
              {ActiveView && <ActiveView data={results[selectedView]} />}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Widget */}
      {hasResults && <FeedbackWidget pipelineResults={results} prdText={prdText} />}
    </div>
  );
}
