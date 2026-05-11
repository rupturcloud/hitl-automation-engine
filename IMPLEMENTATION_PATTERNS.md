# HITL Automation Engine - Implementation Patterns & Best Practices

## Pattern Adoption Framework

### 1. Pattern Definition Methodology

**Step 1: Data Collection Phase**
```
1. Observe operational states (min. 100-500 examples)
2. Record ground truth labels (what should happen)
3. Extract relevant features from observations
4. Document decision rules used by domain experts
5. Create labeled dataset for training
```

**Step 2: Validation Phase**
```
Dataset Requirements:
├─ Training set: 70% (with ground truth labels)
├─ Validation set: 15% (tune hyperparameters)
└─ Test set: 15% (final evaluation)

Minimum samples per pattern: 30-50
Class balance check: No more than 3:1 imbalance
Feature coverage: Test with various input ranges
```

**Step 3: Pattern Encoding**
```javascript
// Pattern definition with metrics targets
const PATTERN_STANDARD_OPERATION = {
  id: "pattern_standard_001",
  name: "Standard Operation Flow",
  
  // Detection criteria
  criteria: {
    features: ["state_a", "state_b", "observation_c"],
    thresholds: { state_a: "> 50", state_b: "== ready" }
  },
  
  // Expected behavior
  expectedAction: "execute_standard_action",
  preconditions: ["dom_loaded", "connection_active"],
  postconditions: ["state_changed", "log_created"],
  
  // Quality targets
  f1Target: 0.95,
  precisionWeight: 0.6,  // Minimize false positives
  recallWeight: 0.4,     // Accept some false negatives
  
  // Performance requirements
  maxLatency: 100,        // milliseconds
  maxErrorRate: 0.05      // 5% acceptable failure rate
};
```

---

### 2. Metric Collection Implementation

**Evidence System Architecture**:
```javascript
// Centralized metrics collection
class MetricsCollector {
  // Core metrics storage
  constructor() {
    this.decisions = [];        // All decisions made
    this.executions = [];       // All action executions
    this.outcomes = [];         // Actual outcomes
    this.humanApprovals = [];   // Human interventions
  }

  // Record decision
  recordDecision(decision) {
    this.decisions.push({
      id: decision.id,
      timestamp: Date.now(),
      patternId: decision.patternId,
      confidence: decision.confidence,
      meetsThreshold: decision.meetsThreshold,
      decidedAction: decision.decidedAction
    });
  }

  // Record execution
  recordExecution(execution) {
    this.executions.push({
      id: execution.id,
      decisionId: execution.decisionId,
      actionType: execution.actionType,
      startTime: execution.startTime,
      endTime: execution.endTime,
      latency: execution.endTime - execution.startTime,
      success: execution.success,
      errorMessage: execution.errorMessage
    });
  }

  // Record outcome (ground truth)
  recordOutcome(outcome) {
    this.outcomes.push({
      id: outcome.id,
      decisionId: outcome.decisionId,
      expectedResult: outcome.expectedResult,
      actualResult: outcome.actualResult,
      matches: outcome.expectedResult === outcome.actualResult,
      timestamp: Date.now()
    });
  }

  // Calculate metrics
  calculateMetrics(patternId, period) {
    const decisions = this.decisions.filter(d => 
      d.patternId === patternId && 
      this.isInPeriod(d.timestamp, period)
    );
    
    const outcomes = this.outcomes.filter(o => 
      decisions.some(d => d.id === o.decisionId)
    );

    let tp = 0, fp = 0, fn = 0, tn = 0;

    outcomes.forEach(o => {
      if (o.matches && o.actualResult === "positive") tp++;
      if (!o.matches && o.actualResult === "positive") fp++;
      if (!o.matches && o.actualResult === "negative") fn++;
      if (o.matches && o.actualResult === "negative") tn++;
    });

    return {
      truePositives: tp,
      falsePositives: fp,
      falseNegatives: fn,
      trueNegatives: tn,
      precision: tp / (tp + fp),
      recall: tp / (tp + fn),
      f1Score: 2 * ((tp/(tp+fp)) * (tp/(tp+fn))) / 
               ((tp/(tp+fp)) + (tp/(tp+fn))),
      accuracy: (tp + tn) / (tp + fp + fn + tn),
      specificity: tn / (tn + fp)
    };
  }
}
```

---

### 3. Decision Qualification System

**Threshold Optimization Process**:

```python
# Python example for threshold optimization
import numpy as np
from sklearn.metrics import precision_recall_curve, f1_score

def optimize_threshold(confidence_scores, ground_truth, metric='f1'):
    """
    Find optimal confidence threshold for decisions
    
    Args:
        confidence_scores: Array of model confidence scores (0-1)
        ground_truth: Array of actual outcomes (0-1)
        metric: 'f1', 'precision', or 'recall'
    
    Returns:
        optimal_threshold: Best threshold value
        metrics: Performance at optimal threshold
    """
    
    thresholds = np.linspace(0, 1, 100)
    scores = {}
    
    for threshold in thresholds:
        predictions = (confidence_scores >= threshold).astype(int)
        
        precision, recall, _ = precision_recall_curve(
            ground_truth, confidence_scores
        )
        f1 = f1_score(ground_truth, predictions)
        
        scores[threshold] = {
            'f1': f1,
            'precision': precision.mean(),
            'recall': recall.mean()
        }
    
    # Select threshold based on metric
    if metric == 'f1':
        optimal = max(scores.items(), key=lambda x: x[1]['f1'])
    elif metric == 'precision':
        optimal = max(scores.items(), key=lambda x: x[1]['precision'])
    else:  # recall
        optimal = max(scores.items(), key=lambda x: x[1]['recall'])
    
    return optimal[0], optimal[1]

# Usage
optimal_threshold, metrics = optimize_threshold(
    confidence_scores=model_predictions,
    ground_truth=actual_outcomes,
    metric='f1'
)

print(f"Optimal Threshold: {optimal_threshold:.3f}")
print(f"F1 Score: {metrics['f1']:.3f}")
print(f"Precision: {metrics['precision']:.3f}")
print(f"Recall: {metrics['recall']:.3f}")
```

---

### 4. Automated Action Execution with Precision

**Execution Framework**:
```javascript
class PrecisionActionExecutor {
  constructor(config) {
    this.config = config;
    this.executionLog = [];
    this.stateValidator = new StateValidator();
  }

  async executeAction(action, approvalContext) {
    const executionRecord = {
      id: generateUUID(),
      actionId: action.id,
      approvalContext: approvalContext,
      startTime: Date.now(),
      steps: []
    };

    try {
      // Step 1: Validate preconditions
      const preconditionsMet = await this.validatePreconditions(action);
      if (!preconditionsMet) {
        throw new Error("Preconditions not met");
      }
      executionRecord.steps.push({
        step: "precondition_validation",
        status: "success",
        timestamp: Date.now()
      });

      // Step 2: Prepare action (deterministic)
      const preparedAction = this.prepareAction(action);
      executionRecord.steps.push({
        step: "action_preparation",
        status: "success",
        timestamp: Date.now()
      });

      // Step 3: Queue action (handle concurrency)
      await this.queueAction(preparedAction);
      executionRecord.steps.push({
        step: "action_queued",
        status: "success",
        timestamp: Date.now()
      });

      // Step 4: Execute (atomic operation)
      const result = await this.performAction(preparedAction);
      const executionTime = Date.now() - executionRecord.startTime;
      executionRecord.steps.push({
        step: "action_executed",
        status: "success",
        executionTime: executionTime,
        result: result,
        timestamp: Date.now()
      });

      // Step 5: Validate postconditions
      const postconditionsMet = await this.validatePostconditions(action, result);
      if (!postconditionsMet) {
        throw new Error("Postconditions not met after execution");
      }
      executionRecord.steps.push({
        step: "postcondition_validation",
        status: "success",
        timestamp: Date.now()
      });

      // Step 6: Log execution
      executionRecord.status = "success";
      executionRecord.endTime = Date.now();
      this.executionLog.push(executionRecord);

      return {
        success: true,
        executionRecord: executionRecord,
        latency: executionTime
      };

    } catch (error) {
      // Error handling: log and potentially rollback
      executionRecord.status = "failed";
      executionRecord.error = error.message;
      executionRecord.endTime = Date.now();
      this.executionLog.push(executionRecord);

      // Attempt rollback if possible
      await this.rollbackAction(action);

      return {
        success: false,
        executionRecord: executionRecord,
        error: error.message
      };
    }
  }

  async validatePreconditions(action) {
    // Check each precondition
    const checks = action.preconditions.map(pre => 
      this.stateValidator.check(pre)
    );
    return (await Promise.all(checks)).every(c => c === true);
  }

  async validatePostconditions(action, result) {
    // Verify expected state change
    const checks = action.postconditions.map(post => 
      this.stateValidator.verifyStateChange(post, result)
    );
    return (await Promise.all(checks)).every(c => c === true);
  }
}
```

---

### 5. Continuous Quality Monitoring

**Monitoring Implementation**:
```javascript
class ContinuousQualityMonitor {
  constructor(config) {
    this.config = config;
    this.metricsHistory = [];
    this.alerts = [];
    this.monitoringInterval = config.monitoringInterval || 3600000; // 1 hour
  }

  startMonitoring() {
    setInterval(() => {
      this.calculateDailyMetrics();
      this.checkForDegradation();
      this.generateAlerts();
    }, this.monitoringInterval);
  }

  calculateDailyMetrics() {
    const today = new Date().toISOString().split('T')[0];
    
    // Get all decisions from today
    const todaysDecisions = this.getDecisionsForDate(today);
    
    // Group by pattern
    const byPattern = this.groupByPattern(todaysDecisions);
    
    // Calculate metrics for each pattern
    const metrics = {};
    Object.entries(byPattern).forEach(([patternId, decisions]) => {
      metrics[patternId] = this.calculateMetrics(decisions);
    });

    this.metricsHistory.push({
      date: today,
      metrics: metrics,
      timestamp: Date.now()
    });

    return metrics;
  }

  calculateMetrics(decisions) {
    let tp = 0, fp = 0, fn = 0, tn = 0;

    decisions.forEach(d => {
      if (d.outcome.matches) {
        if (d.outcome.actualResult === "positive") tp++;
        else tn++;
      } else {
        if (d.outcome.actualResult === "positive") fp++;
        else fn++;
      }
    });

    return {
      precision: tp / (tp + fp) || 0,
      recall: tp / (tp + fn) || 0,
      f1: this.calculateF1(tp, fp, fn),
      accuracy: (tp + tn) / (tp + fp + fn + tn) || 0,
      sampleSize: decisions.length,
      humanOverrideRate: decisions.filter(d => d.humanApproved).length / 
                         decisions.length
    };
  }

  checkForDegradation() {
    const latestMetrics = this.metricsHistory[this.metricsHistory.length - 1];
    const previousMetrics = this.metricsHistory[this.metricsHistory.length - 2];

    if (!latestMetrics || !previousMetrics) return;

    Object.entries(latestMetrics.metrics).forEach(([patternId, current]) => {
      const previous = previousMetrics.metrics[patternId];
      if (!previous) return;

      const f1Drop = previous.f1 - current.f1;
      const precisionDrop = previous.precision - current.precision;

      if (f1Drop > 0.05) {
        this.alerts.push({
          severity: "warning",
          type: "f1_degradation",
          patternId: patternId,
          message: `F1 score dropped ${(f1Drop * 100).toFixed(1)}%`,
          recommendation: "Review new data, consider retraining",
          timestamp: Date.now()
        });
      }

      if (precisionDrop > 0.1) {
        this.alerts.push({
          severity: "critical",
          type: "precision_degradation",
          patternId: patternId,
          message: `Precision dropped ${(precisionDrop * 100).toFixed(1)}%`,
          recommendation: "Immediately review false positive cases",
          timestamp: Date.now()
        });
      }
    });
  }

  generateAlerts() {
    // Filter recent alerts
    const recentAlerts = this.alerts.filter(a => 
      Date.now() - a.timestamp < 86400000 // Last 24 hours
    );

    if (recentAlerts.length > 0) {
      console.log("⚠️ Quality Alerts Generated:");
      recentAlerts.forEach(alert => {
        console.log(`[${alert.severity}] ${alert.message}`);
        console.log(`  Recommendation: ${alert.recommendation}`);
      });
    }
  }
}
```

---

## Quality Assurance Checklist

### Before Deployment

```
Pattern Quality:
☑ Domain experts validated patterns
☑ F1 score ≥ 0.92 on test set
☑ Precision ≥ 0.90 (minimize false positives)
☑ Recall ≥ 0.85 (minimize false negatives)
☑ Tested with edge cases
☑ Handles missing/malformed data

Decision Engine:
☑ Threshold calibrated to operational needs
☑ Human approval gates defined
☑ Escalation paths documented
☑ Confidence scores are well-calibrated

Action Execution:
☑ Deterministic execution (no randomness)
☑ Preconditions validated
☑ Postconditions verified
☑ Error handling implemented
☑ Rollback capability verified

Audit & Monitoring:
☑ Audit trail logging 100% complete
☑ Metrics calculation verified
☑ Alert thresholds set appropriately
☑ Monitoring system operational
☑ Human review workflow tested
```

### Post-Deployment Monitoring

```
Daily Checks:
- F1 score remains ≥ 0.92
- Precision ≥ 0.90
- Human override rate < 5%
- No execution errors
- Audit logs complete

Weekly Analysis:
- Precision/recall trends
- Most common false positives
- Most common false negatives
- Confidence score calibration
- Pattern stability

Monthly Review:
- Full metrics recalculation
- Retraining decision
- Documentation updates
- Performance trends
- Operational feedback
```

---

## Integration with Enterprise Systems

### Audit Trail Requirements
```
Every decision must include:
├─ Decision ID (UUID)
├─ Timestamp (ISO8601)
├─ Pattern identified
├─ Confidence score
├─ Decision (execute/review/escalate)
├─ Human approval (if required)
├─ Action taken
├─ Outcome
└─ Ground truth (for retraining)
```

### Compliance & Security
```
✓ GDPR compliance: Right to explanation (confidence scores)
✓ Audit compliance: Complete decision trail
✓ Data security: Encryption of sensitive decision data
✓ Retention policy: Archive logs per regulation
✓ Access control: Role-based decision history access
```

---

**Document Version**: 1.0  
**Implementation Status**: Production-ready patterns  
**Last Updated**: May 2026
