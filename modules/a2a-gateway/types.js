/**
 * A2A (Agent-to-Agent) Message Types and Interfaces
 * Standardized schema for all Pub/Sub messaging across Jarvis, Hermes, and Matuzas agents
 */

/**
 * @typedef {Object} A2AMessage
 * @property {string} eventId - Unique identifier for this message (UUID)
 * @property {string} source - Origin agent (jarvis|hermes|matuzas|operator)
 * @property {string} target - Destination agent (jarvis|hermes|matuzas|operator)
 * @property {string} type - Message type (task|approval|result|validation)
 * @property {Object} payload - Type-specific content
 * @property {string} timestamp - ISO8601 timestamp of message creation
 * @property {string} traceId - Session ID or request ID for debugging
 * @property {Object} metadata - Optional metadata
 * @property {string} metadata.version - Schema version (default: "1.0.0")
 * @property {number} metadata.priority - Priority level (1-5, default: 3)
 * @property {string} metadata.correlationId - Parent request ID for tracking chains
 */

/**
 * @typedef {Object} TaskPayload
 * @property {string} taskId - Unique task identifier
 * @property {string} action - Task action (start|pause|resume|cancel)
 * @property {string} description - Task description
 * @property {Object} parameters - Task parameters
 * @property {number} timeout - Timeout in milliseconds
 */

/**
 * @typedef {Object} ApprovalPayload
 * @property {string} approvalId - Unique approval identifier
 * @property {string} decision - Approval decision (approved|rejected|pending)
 * @property {string} reason - Decision reason or comment
 * @property {string} approver - User ID or agent that approved
 * @property {number} timestamp - Approval timestamp
 */

/**
 * @typedef {Object} ResultPayload
 * @property {string} taskId - Associated task ID
 * @property {string} status - Result status (success|failure|partial)
 * @property {*} data - Result data
 * @property {Object} metrics - Performance metrics
 * @property {number} metrics.duration - Execution duration in ms
 * @property {number} metrics.itemsProcessed - Number of items processed
 * @property {string} error - Error message if status is failure
 */

/**
 * @typedef {Object} ValidationPayload
 * @property {string} validationId - Unique validation identifier
 * @property {string} targetId - ID of resource being validated
 * @property {string} validationType - Type of validation (schema|data|integrity)
 * @property {boolean} isValid - Validation result
 * @property {Array<string>} errors - Array of validation errors
 * @property {Object} details - Additional validation details
 */

/**
 * Valid agent identifiers
 * @type {string[]}
 */
export const VALID_AGENTS = ['jarvis', 'hermes', 'matuzas', 'operator'];

/**
 * Valid message types
 * @type {string[]}
 */
export const VALID_MESSAGE_TYPES = ['task', 'approval', 'result', 'validation'];

/**
 * Valid task actions
 * @type {string[]}
 */
export const VALID_TASK_ACTIONS = ['start', 'pause', 'resume', 'cancel'];

/**
 * Valid approval decisions
 * @type {string[]}
 */
export const VALID_APPROVAL_DECISIONS = ['approved', 'rejected', 'pending'];

/**
 * Valid result statuses
 * @type {string[]}
 */
export const VALID_RESULT_STATUSES = ['success', 'failure', 'partial'];

/**
 * Valid validation types
 * @type {string[]}
 */
export const VALID_VALIDATION_TYPES = ['schema', 'data', 'integrity'];

/**
 * Pub/Sub topic configuration
 * @type {Object}
 */
export const TOPIC_CONFIG = {
  tasks: {
    name: 'ruptur-tasks',
    description: 'Jarvis → Hermes/Matuzas task distribution'
  },
  approvals: {
    name: 'ruptur-approvals',
    description: 'Manual/Operator → Jarvis approval decisions'
  },
  results: {
    name: 'ruptur-results',
    description: 'Hermes → Jarvis task results'
  },
  validations: {
    name: 'ruptur-validations',
    description: 'Matuzas → Jarvis validation reports'
  }
};

export default {
  VALID_AGENTS,
  VALID_MESSAGE_TYPES,
  VALID_TASK_ACTIONS,
  VALID_APPROVAL_DECISIONS,
  VALID_RESULT_STATUSES,
  VALID_VALIDATION_TYPES,
  TOPIC_CONFIG
};
