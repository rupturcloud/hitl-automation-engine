# HITL Automation Engine - Technical Architecture

## System Overview

A **Human-in-the-Loop (HITL) automation framework** that combines pattern recognition, decision engineering, and precision execution to reduce human error while maintaining human authority over critical decisions.

## Architecture Principles

### 1. Human Authority
- Humans retain final decision authority
- System provides recommendations, not commands
- Clear escalation paths for uncertain decisions
- No silent autonomous actions

### 2. Measurable Accuracy
- All decisions tracked against ground truth
- F1 score calculated for each decision category
- Precision and recall explicitly managed
- Continuous accuracy monitoring

### 3. Transparent Operations
- Every decision logged with reasoning
- Confidence scores visible to operators
- Failure modes documented and anticipated
- No black-box decision making

### 4. Precision Execution
- Approved actions executed with high fidelity
- Timing and sequencing controlled
- State validation before and after
- Complete execution audit trail

## System Architecture

```
┌─────────────────────────────────────────────────┐
│          User Control Panel (popup.html)        │
│    ├─ Start/Stop Automation                    │
│    ├─ Review Pending Decisions                 │
│    ├─ Manual Override                          │
│    └─ Real-time Metrics Dashboard              │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│      Service Worker (background.js)             │
│    ├─ HITL Coordination                        │
│    ├─ Decision Routing                         │
│    ├─ Approval Flow Management                 │
│    └─ Audit Logging                            │
└──────────────────────┬──────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
  ┌─────────┐    ┌──────────┐    ┌─────────┐
  │Decision │    │ Pattern  │    │ Session │
  │ Engine  │    │Calibrator│    │Monitor  │
  └─────────┘    └──────────┘    └─────────┘
       │               │               │
       └───────────────┼───────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
  ┌─────────┐    ┌──────────┐    ┌──────────┐
  │ Action  │    │ Content  │    │ Lib Core │
  │Executor │    │ Observer │    │(hitl-core)
  └─────────┘    └──────────┘    └──────────┘
       │               │               │
       └───────────────┼───────────────┘
                       │
                ┌──────▼──────┐
                │ Audit Trail │
                │ & Metrics   │
                └─────────────┘
```

## Component Deep Dive

### Pattern Calibrator (`patternCalibrator.js`)

**Responsibility**: Recognize operational patterns and score confidence.

**Algorithm**:
```
For each observed state:
  1. Extract features from DOM/state
  2. Compare against known patterns
  3. Calculate similarity score (0-1)
  4. Apply precision/recall weights
  5. Compute F1-optimized confidence
  6. Return: (pattern_id, confidence, feature_vector)
```

**Metrics Tracked**:
- True Positives: Correct pattern recognition
- False Positives: Incorrect pattern recognition (cost: wrong action)
- False Negatives: Missed patterns (cost: actions not taken)
- Precision: TP / (TP + FP) - Avoid wrong actions
- Recall: TP / (TP + FN) - Catch all valid patterns

**Confidence Scoring**:
```
confidence = (precision_weight × precision_component) +
             (recall_weight × recall_component) +
             (stability_weight × stability_score)
```

### Decision Engine (`decisionEngine.js`)

**Responsibility**: Route patterns to action or human review.

**Decision Flow**:
```
Pattern Confidence Score
         │
    ┌────▼────┐
    │ > 0.92? │
    └────┬────┘
         │
    ├─ YES → Check pattern type
    │        ├─ Routine → Execute (with logging)
    │        └─ Critical → Route to human approval
    │
    └─ NO  → Confidence between 0.75-0.92?
             ├─ YES → Route to human review
             └─ NO  → Log, await next observation
```

**Human Approval Gates**:
- **Always Required**: First execution of new pattern
- **Always Required**: Critical decision categories
- **Always Required**: Confidence < threshold
- **Optional**: High-confidence routine patterns

### Action Executor (`actionExecutor.js`)

**Responsibility**: Execute approved actions with precision.

**Execution Protocol**:
```
1. Validate preconditions met
2. Queue action for execution
3. Execute with timing control
4. Verify postcondition state
5. Log execution with telemetry
6. Return: (success, latency, state_change)
```

**Precision Characteristics**:
- Deterministic execution (no random delays)
- State validation before/after
- Rollback capability for failed executions
- Complete timing telemetry

### Session Monitor (`sessionMonitor.js`)

**Responsibility**: Track operational state and detect anomalies.

**Monitoring Loop**:
```
Every 15s:
  1. Check connection state
  2. Verify DOM structure intact
  3. Validate last execution status
  4. Check for error conditions
  5. Update session metrics
  6. Trigger recovery if needed
```

**Recovery Strategy**:
- Connection lost → Reconnect (exponential backoff)
- DOM changed → Re-calibrate patterns
- Execution failed → Log, escalate to human

### Core Library (`lib/hitl-automation-core.js`)

**Provides**:
- Pattern definition and validation
- F1 score calculation
- Confidence scoring algorithms
- State machine for HITL flow
- Audit logging utilities

**Key Exports**:
```javascript
{
  // Pattern management
  definePattern(id, criteria, rules),
  validatePattern(pattern, testData),
  
  // Scoring
  calculateF1(tp, fp, fn),
  calculateConfidence(features),
  
  // HITL flow
  routeDecision(pattern, confidence),
  recordApproval(decision_id, human_approval),
  
  // Audit
  logAction(action_id, decision_reasoning, execution_result),
  getAuditTrail(filters)
}
```

## Data Structures

### Pattern Definition
```javascript
{
  id: "pattern_001",
  name: "Standard Operation",
  criteria: {
    features: ["state_a", "state_b"],
    threshold: 0.85
  },
  expectedAction: "execute_routine",
  preconditions: ["dom_ready", "connection_valid"],
  postconditions: ["state_changed", "action_logged"],
  f1Target: 0.95,
  precisionWeight: 0.6,
  recallWeight: 0.4
}
```

### Decision Record
```javascript
{
  id: UUID,
  timestamp: ISO8601,
  patternId: "pattern_001",
  confidence: 0.94,
  features: { /* recognized state */ },
  decidedAction: "execute_action",
  humanApprovalRequired: false,
  executionResult: "success",
  latency: 245, // ms
  auditTrail: "complete"
}
```

### F1 Metrics
```javascript
{
  category: "pattern_001",
  period: "2026-05-11",
  truePositives: 145,
  falsePositives: 3,
  falseNegatives: 8,
  precision: 0.98,
  recall: 0.95,
  f1Score: 0.965,
  accuracy: 0.943,
  humanOverrides: 2
}
```

## HITL Workflow

### 1. Observation Phase
- Content scripts observe page state
- Pattern calibrator recognizes patterns
- Features extracted and normalized

### 2. Decision Phase
- Decision engine calculates confidence
- Compares against thresholds
- Determines if action is needed

### 3. Approval Phase
- If high confidence → Execute with logging
- If medium confidence → Route to human review
- If low confidence → Wait for more data

### 4. Execution Phase
- Execute approved action
- Log execution telemetry
- Verify state change

### 5. Measurement Phase
- Compare outcome against expected
- Update F1 metrics
- Identify mismatches for retraining

## Quality Management

### F1 Score Optimization

**Precision Focus** (Avoid false positives):
- Cost of wrong action is high
- Set high precision threshold
- Accept lower recall

**Recall Focus** (Catch all true positives):
- Cost of missing pattern is high
- Lower precision threshold
- Increase human review volume

**Balanced** (F1 optimal):
- Weight precision and recall equally
- Target F1 0.95+
- Monitor both metrics

### Continuous Improvement
```
Measure → Analyze → Adjust → Measure
   ▲                           │
   └───────────────────────────┘

1. Calculate daily F1 scores
2. Identify patterns below target
3. Review misclassifications
4. Adjust thresholds or rules
5. Re-measure
```

## Error Handling Strategy

### Critical Errors
- Connection failure → Escalate immediately
- State corruption → Rollback last action
- Execution timeout → Manual intervention required

### Recoverable Errors
- Pattern mismatch → Wait for confirmation
- Confidence low → Route to human review
- Precondition failed → Retry with backoff

### Monitoring Errors
- Metrics divergence → Alert operator
- F1 score drops → Retrain patterns
- Human override spike → Review decision criteria

## Performance Characteristics

### Timing
- Pattern detection: <50ms
- Confidence calculation: <30ms
- Decision routing: <20ms
- Action execution: Variable (domain-specific)
- Total latency target: <200ms

### Accuracy Targets
- F1 Score: 0.95+
- Precision: 0.90+
- Recall: 0.85+
- Human override rate: <5%

### Resource Usage
- Service worker: 4-6MB
- Content scripts: 2-3MB per instance
- Audit logs: Configurable (compress old logs)

## Security & Compliance

### Audit Requirements
- Every decision logged with full context
- Human approvals recorded with timestamp/user
- Action executions traced with results
- Metrics calculated and stored
- Logs retained per policy

### Compliance Checks
- No decisions made without approval gate
- No silent autonomous actions
- All failures escalated
- Reversibility maintained
- Complete transparency

## Deployment Checklist

- [ ] Pattern definitions validated by domain experts
- [ ] F1 baseline calculated with test data
- [ ] Human approval workflow implemented
- [ ] Audit logging infrastructure ready
- [ ] Metrics calculation verified
- [ ] Operator training completed
- [ ] Escalation paths defined
- [ ] Recovery procedures documented

---

**Document Version**: 1.0  
**Architecture Standard**: Enterprise HITL  
**Quality Metric**: F1-Optimized  
**Last Updated**: May 2026
