/**
 * A2A Gateway Module
 * Unified entry point for the A2A (Agent-to-Agent) Gateway
 * Provides publisher, subscriber, and configuration exports
 * @module a2a-gateway
 */

// Configuration exports
export {
  TOPICS,
  SUBSCRIPTIONS,
  VALID_SOURCES,
  VALID_TARGETS,
  MESSAGE_TYPES,
  PRIORITY_LEVELS,
  getPubSubClient,
  getTopic,
  getSubscription,
  RETRY_CONFIG,
  TIMEOUT_CONFIG,
  LOG_CONFIG
} from './config.js';

// Schema and validation exports
export {
  validateMessage,
  createMessage,
  getMessageSchema,
  VALIDATION_ERRORS,
  MESSAGE_SCHEMAS,
  BASE_MESSAGE_SCHEMA
} from './schema.js';

// Publisher exports
export {
  publish,
  publishTask,
  publishApproval,
  publishResult,
  publishValidation,
  publishBatch
} from './publisher.js';

// Subscriber exports
export {
  handleMessage,
  subscribeToTasks,
  subscribeToApprovals,
  subscribeToResults,
  subscribeToValidations,
  subscribeToAll
} from './subscriber.js';

/**
 * A2A Gateway version
 * @type {string}
 */
export const VERSION = '1.0.0';

/**
 * Gateway status enum
 * @type {Object}
 */
export const STATUS = {
  INITIALIZED: 'initialized',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};

/**
 * Default export with all modules
 */
export default {
  // Config
  TOPICS,
  SUBSCRIPTIONS,
  VALID_SOURCES,
  VALID_TARGETS,
  MESSAGE_TYPES,
  PRIORITY_LEVELS,
  getPubSubClient,
  getTopic,
  getSubscription,
  RETRY_CONFIG,
  TIMEOUT_CONFIG,
  LOG_CONFIG,

  // Schema
  validateMessage,
  createMessage,
  getMessageSchema,
  VALIDATION_ERRORS,
  MESSAGE_SCHEMAS,
  BASE_MESSAGE_SCHEMA,

  // Publisher
  publish,
  publishTask,
  publishApproval,
  publishResult,
  publishValidation,
  publishBatch,

  // Subscriber
  handleMessage,
  subscribeToTasks,
  subscribeToApprovals,
  subscribeToResults,
  subscribeToValidations,
  subscribeToAll,

  // Metadata
  VERSION,
  STATUS
};
