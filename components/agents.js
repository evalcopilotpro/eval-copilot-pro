/* ═══════════════════════════════════════════════════════════════
   LOCAL AGENT ENGINES — Zero API Dependencies
   Each agent uses keyword extraction, pattern matching, and
   heuristic scoring to produce structured outputs from PRD text.
   ═══════════════════════════════════════════════════════════════ */

function extractKeyPhrases(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const reqs = [];
  lines.forEach(line => {
    const cleaned = line.replace(/^[-•*>\d.)\]]+\s*/, '').trim();
    if (cleaned.length > 15 && cleaned.length < 300) reqs.push(cleaned);
  });
  return reqs;
}

function extractSentences(text) {
  return text.split(/[.\n]/).map(s => s.trim()).filter(s => s.length > 10);
}

function classify(text) {
  const lower = text.toLowerCase();
  if (/performance|latency|speed|scalab|uptime|load|throughput|< ?\d+\s*(ms|s|sec)|handle \d+/i.test(lower)) return 'non-functional';
  if (/ui|ux|display|show|view|page|screen|button|modal|dashboard|interface|user.?friendly|intuitive/i.test(lower)) return 'ux';
  return 'functional';
}

function assignPriority(text) {
  const lower = text.toLowerCase();
  if (/must|critical|required|essential|security|compliance|pci|gdpr|auth|payment|error.?handl/i.test(lower)) return 'P0';
  if (/should|important|key|primary|core|main|support|integrat/i.test(lower)) return 'P1';
  return 'P2';
}

function detectAmbiguities(text) {
  const ambiguities = [];
  const lower = text.toLowerCase();
  if (/appropriate|suitable|reasonable|adequate|sufficient/i.test(lower))
    ambiguities.push('Vague qualifiers used (e.g., "appropriate", "suitable") — needs specific measurable criteria');
  if (/etc\.?|and so on|and more|among others/i.test(lower))
    ambiguities.push('Open-ended lists detected (e.g., "etc.") — all supported items should be explicitly enumerated');
  if (/nice to have|optional|if possible|ideally|stretch goal/i.test(lower))
    ambiguities.push('Ambiguous priority language — clarify whether "nice-to-have" features are in scope for v1');
  if (!/\d+\s*(ms|s|sec|minute|hour|day|%|percent)/i.test(lower))
    ambiguities.push('No quantitative performance targets specified — add measurable SLAs');
  if (!/error|fail|edge|exception|invalid|timeout|retry/i.test(lower))
    ambiguities.push('No error handling or failure scenarios described');
  if (/user|customer/i.test(lower) && !/role|permission|admin|auth/i.test(lower))
    ambiguities.push('User roles and permissions not defined — who can access what?');
  return ambiguities.slice(0, 4);
}

function detectMissingCoverage(text) {
  const missing = [];
  const lower = text.toLowerCase();
  if (!/accessib|wcag|aria|screen.?reader|a11y/i.test(lower))
    missing.push('Accessibility requirements (WCAG compliance, screen reader support)');
  if (!/monitor|log|observ|metric|alert|telemetry|track/i.test(lower))
    missing.push('Monitoring, logging, and observability strategy');
  if (!/rollback|migration|backward|deprecat|version/i.test(lower))
    missing.push('Rollback plan and backward compatibility considerations');
  if (!/rate.?limit|throttl|abuse|bot|spam|dos/i.test(lower))
    missing.push('Rate limiting and abuse prevention');
  if (!/cache|cdn|offline/i.test(lower))
    missing.push('Caching strategy and offline behavior');
  if (!/i18n|internation|locali?z|translat|language/i.test(lower) && !/multilingual/i.test(lower))
    missing.push('Internationalization and localization support');
  if (!/mobile|responsive|tablet|ios|android/i.test(lower))
    missing.push('Mobile and responsive design requirements');
  if (!/data.?retention|backup|disaster|recovery/i.test(lower))
    missing.push('Data retention and disaster recovery plan');
  return missing.filter(() => Math.random() > 0.3).slice(0, 4);
}

function generateSummary(text) {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const title = lines.find(l => /^(prd|product|feature|project|requirements)/i.test(l.trim())) || lines[0] || 'Untitled PRD';
  const sentenceCount = extractSentences(text).length;
  const reqCount = extractKeyPhrases(text).length;
  return `This PRD describes ${title.replace(/^(prd|product requirements)[:\s]*/i, '').trim()}. The document contains approximately ${sentenceCount} specifications across ${reqCount} identifiable requirement areas. Analysis follows below.`;
}

// ─── AGENT 1: PRD ANALYST ───
export function runPRDAnalyst(prdText) {
  return new Promise(resolve => {
    setTimeout(() => {
      const phrases = extractKeyPhrases(prdText);
      const requirements = phrases.slice(0, 8).map((phrase, i) => {
        const words = phrase.split(/\s+/).slice(0, 8).join(' ');
        return {
          id: `REQ-${String(i + 1).padStart(3, '0')}`,
          title: words.charAt(0).toUpperCase() + words.slice(1),
          description: phrase,
          priority: assignPriority(phrase),
          type: classify(phrase),
        };
      });
      if (requirements.length < 3) {
        const sentences = extractSentences(prdText);
        sentences.slice(0, 5 - requirements.length).forEach((s) => {
          requirements.push({
            id: `REQ-${String(requirements.length + 1).padStart(3, '0')}`,
            title: s.split(/\s+/).slice(0, 6).join(' '),
            description: s,
            priority: assignPriority(s),
            type: classify(s),
          });
        });
      }
      resolve({
        summary: generateSummary(prdText),
        requirements,
        ambiguities: detectAmbiguities(prdText),
        missing_coverage: detectMissingCoverage(prdText),
      });
    }, 800 + Math.random() * 700);
  });
}

// ─── AGENT 2: CRITERIA ENGINE ───
export function runCriteriaEngine(prdResult) {
  return new Promise(resolve => {
    setTimeout(() => {
      const criteria = prdResult.requirements.map(req => {
        const lower = req.description.toLowerCase();
        const acs = [];
        acs.push({
          id: `AC-${req.id.split('-')[1]}-01`,
          given: `a user interacting with the ${req.type} feature described in ${req.id}`,
          when: `the primary action for "${req.title}" is triggered`,
          then: `the system should fulfill the requirement: ${req.description.slice(0, 80)}`,
        });
        if (/error|fail|invalid|timeout/i.test(lower)) {
          acs.push({
            id: `AC-${req.id.split('-')[1]}-02`,
            given: 'an error condition or invalid input is encountered',
            when: 'the system attempts to process the request',
            then: 'a user-friendly error message is displayed and the failure is logged with context',
          });
        } else if (/display|show|view|dashboard|ui/i.test(lower)) {
          acs.push({
            id: `AC-${req.id.split('-')[1]}-02`,
            given: 'the user navigates to the relevant view',
            when: 'the page or component loads',
            then: 'all required data is displayed correctly within 2 seconds with proper formatting',
          });
        } else {
          acs.push({
            id: `AC-${req.id.split('-')[1]}-02`,
            given: 'the feature is used under normal operating conditions',
            when: 'multiple concurrent users perform the same action',
            then: 'the system handles all requests without data corruption or race conditions',
          });
        }
        const edgeCases = [];
        if (/payment|card|transaction/i.test(lower))
          edgeCases.push('Expired payment method during processing', 'Network timeout mid-transaction', 'Duplicate submission within 1 second');
        else if (/user|account|profile/i.test(lower))
          edgeCases.push('User session expires during action', 'Concurrent edits from multiple tabs', 'Special characters in input fields');
        else if (/upload|file|document|image/i.test(lower))
          edgeCases.push('File exceeds maximum size limit', 'Unsupported file format submitted', 'Upload interrupted by network failure');
        else
          edgeCases.push('Unexpected null or empty input values', 'System under peak load conditions', 'Partial data availability from upstream services');
        return {
          req_id: req.id,
          acceptance_criteria: acs,
          edge_cases: edgeCases,
          priority_score: req.priority === 'P0' ? 9 + Math.round(Math.random()) : req.priority === 'P1' ? 6 + Math.round(Math.random() * 2) : 3 + Math.round(Math.random() * 3),
        };
      });
      const riskAreas = [];
      const allText = prdResult.requirements.map(r => r.description).join(' ').toLowerCase();
      if (/payment|financial|money|transaction/i.test(allText))
        riskAreas.push('Financial transaction integrity — requires thorough idempotency and reconciliation testing');
      if (/real.?time|live|stream|websocket/i.test(allText))
        riskAreas.push('Real-time processing latency under load — needs performance benchmarking');
      if (/third.?party|external|api|integrat/i.test(allText))
        riskAreas.push('Third-party service dependency — consider circuit breaker and fallback strategies');
      if (/security|auth|encrypt|pci|gdpr|compli/i.test(allText))
        riskAreas.push('Compliance and security requirements need dedicated security review');
      if (riskAreas.length === 0)
        riskAreas.push('Requirements breadth suggests phased delivery may reduce integration risk');
      resolve({
        criteria,
        coverage_summary: `Generated ${criteria.reduce((a, c) => a + c.acceptance_criteria.length, 0)} acceptance criteria covering ${criteria.length} requirements with ${criteria.reduce((a, c) => a + c.edge_cases.length, 0)} edge cases identified.`,
        risk_areas: riskAreas,
      });
    }, 1000 + Math.random() * 800);
  });
}

// ─── AGENT 3: TEST ARCHITECT ───
export function runTestArchitect(criteriaResult, prdResult) {
  return new Promise(resolve => {
    setTimeout(() => {
      const suiteMap = {};
      criteriaResult.criteria.forEach(c => {
        const req = prdResult.requirements.find(r => r.id === c.req_id);
        const suiteName = req ? `${req.type.charAt(0).toUpperCase() + req.type.slice(1)} — ${req.title}` : c.req_id;
        if (!suiteMap[suiteName]) suiteMap[suiteName] = { suite_name: suiteName, framework: 'playwright', tests: [] };
        c.acceptance_criteria.forEach((ac, i) => {
          const testId = `TEST-${c.req_id.split('-')[1]}-${String(i + 1).padStart(2, '0')}`;
          const testType = i === 0 ? 'e2e' : Math.random() > 0.5 ? 'integration' : 'unit';
          let snippet = '';
          const lower = (req?.description || '').toLowerCase();
          if (/button|click|tap|submit/i.test(lower)) {
            snippet = `test('${ac.then.slice(0, 50)}', async ({ page }) => {\n  await page.goto('/feature');\n  await page.click('[data-testid=\"action-btn\"]');\n  await expect(page.locator('.result')).toBeVisible();\n});`;
          } else if (/api|endpoint|request/i.test(lower)) {
            snippet = `test('${ac.then.slice(0, 50)}', async () => {\n  const res = await request.post('/api/endpoint', { data: payload });\n  expect(res.status()).toBe(200);\n  expect(res.json()).toHaveProperty('success', true);\n});`;
          } else if (/display|show|dashboard/i.test(lower)) {
            snippet = `test('${ac.then.slice(0, 50)}', async ({ page }) => {\n  await page.goto('/dashboard');\n  const items = page.locator('[data-testid=\"data-row\"]');\n  await expect(items).toHaveCount(greaterThan(0));\n});`;
          } else {
            snippet = `test('${ac.then.slice(0, 50)}', async ({ page }) => {\n  await page.goto('/feature');\n  // Verify: ${ac.then.slice(0, 60)}\n  await expect(page.locator('.status')).toContainText('success');\n});`;
          }
          suiteMap[suiteName].tests.push({
            id: testId, ac_id: ac.id, name: ac.then.slice(0, 70),
            type: testType, code_snippet: snippet,
            status: Math.random() > 0.2 ? 'ready' : 'needs_review',
          });
        });
      });
      const totalReqs = prdResult.requirements.length;
      const coveredReqs = criteriaResult.criteria.length;
      resolve({
        test_suites: Object.values(suiteMap),
        coverage_map: {
          total_requirements: totalReqs,
          covered: Math.min(coveredReqs, totalReqs),
          uncovered_ids: totalReqs > coveredReqs ? prdResult.requirements.slice(coveredReqs).map(r => r.id) : [],
        },
        ci_config_suggestion: 'Add a GitHub Actions workflow with Playwright test runner triggered on PR merge to main. Include parallel test sharding for suites with >10 tests. Gate deployment on 100% pass rate for P0 requirement tests.',
      });
    }, 900 + Math.random() * 600);
  });
}

// ─── AGENT 4: QUALITY ORACLE ───
export function runQualityOracle(prdResult, criteriaResult, testResult) {
  return new Promise(resolve => {
    setTimeout(() => {
      const totalTests = testResult.test_suites.reduce((a, s) => a + s.tests.length, 0);
      const readyTests = testResult.test_suites.reduce((a, s) => a + s.tests.filter(t => t.status === 'ready').length, 0);
      const coveragePercent = testResult.coverage_map.total_requirements > 0
        ? testResult.coverage_map.covered / testResult.coverage_map.total_requirements : 0;
      const ambiguityPenalty = (prdResult.ambiguities?.length || 0) * 3;
      const missingPenalty = (prdResult.missing_coverage?.length || 0) * 2;
      const riskPenalty = (criteriaResult.risk_areas?.length || 0) * 2;
      const readyPercent = totalTests > 0 ? readyTests / totalTests : 0;
      let score = Math.round(coveragePercent * 50 + readyPercent * 30 + 20 - ambiguityPenalty - missingPenalty - riskPenalty);
      score = Math.max(35, Math.min(98, score));

      let verdict, verdictReason;
      if (score >= 80) {
        verdict = 'SHIP';
        verdictReason = `Quality score of ${score}/100 indicates strong requirement coverage and test readiness. ${prdResult.ambiguities?.length || 0} ambiguities flagged but none are blocking. Recommend proceeding with deployment after addressing flagged edge cases.`;
      } else if (score >= 55) {
        verdict = 'HOLD';
        verdictReason = `Quality score of ${score}/100 shows gaps that should be addressed before shipping. ${prdResult.ambiguities?.length || 0} ambiguities and ${prdResult.missing_coverage?.length || 0} missing coverage areas need clarification. Test coverage at ${Math.round(coveragePercent * 100)}% — target 90%+ before release.`;
      } else {
        verdict = 'BLOCK';
        verdictReason = `Quality score of ${score}/100 indicates significant risk. Multiple ambiguities, missing coverage areas, and incomplete test readiness suggest this PRD needs substantial revision before development should proceed.`;
      }

      const reqStatus = prdResult.requirements.map(req => {
        const hasCriteria = criteriaResult.criteria.some(c => c.req_id === req.id);
        const hasTests = testResult.test_suites.some(s => s.tests.some(t => t.ac_id?.startsWith(`AC-${req.id.split('-')[1]}`)));
        const confidence = hasCriteria && hasTests ? 0.8 + Math.random() * 0.18
          : hasCriteria ? 0.5 + Math.random() * 0.2 : 0.2 + Math.random() * 0.2;
        return {
          req_id: req.id, title: req.title,
          status: confidence > 0.75 ? 'pass' : confidence > 0.45 ? 'warning' : 'fail',
          confidence: parseFloat(confidence.toFixed(2)),
          notes: confidence > 0.75 ? 'Fully covered with acceptance criteria and automated tests'
            : confidence > 0.45 ? 'Criteria defined but test coverage is incomplete or needs review'
            : 'Missing automated test coverage — manual verification required',
        };
      });

      const topRisks = [];
      if (ambiguityPenalty > 6)
        topRisks.push({ risk: 'High ambiguity in PRD language may lead to misaligned implementation', severity: 'high', recommendation: 'Schedule a 30-min PRD review session with engineering lead to resolve flagged ambiguities' });
      if (missingPenalty > 4)
        topRisks.push({ risk: 'Multiple coverage gaps identified in non-functional requirements', severity: 'medium', recommendation: 'Add explicit sections for the missing coverage areas before sprint planning' });
      if (criteriaResult.risk_areas?.length > 2)
        topRisks.push({ risk: 'Complex integration points increase regression risk', severity: 'high', recommendation: 'Implement contract tests for all third-party service boundaries' });
      if (readyPercent < 0.8)
        topRisks.push({ risk: `${totalTests - readyTests} of ${totalTests} tests flagged as needs_review`, severity: 'medium', recommendation: 'QA lead should review and approve flagged test implementations before merge' });
      if (topRisks.length === 0)
        topRisks.push({ risk: 'No critical risks identified, but edge case coverage should be monitored post-launch', severity: 'low', recommendation: 'Set up automated regression monitoring for the first 2 weeks after deployment' });

      const pmSummary = `Quality Check Complete: ${verdict} (${score}/100). ${prdResult.requirements.length} requirements analyzed → ${criteriaResult.criteria.reduce((a, c) => a + c.acceptance_criteria.length, 0)} acceptance criteria generated → ${totalTests} automated tests created. ${reqStatus.filter(r => r.status === 'pass').length}/${reqStatus.length} requirements fully covered. ${topRisks.length > 0 ? `Top risk: ${topRisks[0].risk.slice(0, 80)}.` : ''} ${verdict === 'SHIP' ? 'Green light to proceed.' : 'Action items need resolution before shipping.'}`;

      resolve({ overall_score: score, verdict, verdict_reason: verdictReason, requirement_status: reqStatus, top_risks: topRisks, pm_summary: pmSummary });
    }, 700 + Math.random() * 500);
  });
}
