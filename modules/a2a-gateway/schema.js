/**
 * Message Schema Validation
 * Validates A2A Gateway messages against defined schemas
 * @module schema
 */

import { v4 as uuidv4 } from 'uuid';
import {
  VALID_SOURCES,
  VALID_TARGETS,
  MESSAGE_TYPES,
  PRIORITY_LEVELS
} from './config.js';

/**
 * Error messages for validation
 * @type {Object}
 */
export const VALIDATION_ERRORS = {
  MISSING_FIELD: 'Missing required field: {field}',
  INVALID_FORMAT: 'Invalid format for {field}: expected {type}',
  INVALID_ENUM: 'Invalid value for {field}: must be one of {values}',
  INVALID_UUID: 'Invalid UUID format for {field}',
  INVALID_ISO8601: 'Invalid ISO8601 timestamp for {field}',
  INVALID_JSON: 'Invalid JSON in {field}',
  INVALID_MESSAGE: 'Message validation failed',
  PAYLOAD_REQUIRED: 'Payload must be a non-empty object',
  INVALID_CORRELATION_ID: 'CorrelationId must be a string'
};

/**
 * Message type definitions and schemas
 * @type {Object}
 */
export const MESSAGE_SCHEMAS = {
  task: {
    description: 'Task execution message',
    requiredFields: ['eventId', 'source', 'target', 'type', 'payload', 'timestamp']
  },
  approval: {
    description: 'Approval request/response message',
    requiredFields: ['eventId', 'source', 'target', 'type', 'payload', 'timestamp']
  },
  result: {
    description: 'Task result message',
    requiredFields: ['eventId', 'source', 'target', 'type', 'payload', 'timestamp']
  },
  validation: {
    description: 'Validation result message',
    requiredFields: ['eventId', 'source', 'target', 'type', 'payload', 'timestamp']
  }
};

/**
 * Base message schema structure
 * @type {Object}
 */
export const BASE_MESSAGE_SCHEMA = {
  eventId: {
    type: 'string',
    pattern: 'uuid',
    description: 'Unique event identifier'
  },
  source: {
    type: 'string',
    enum: VALID_SOURCES,
    description: 'Message source system'
  },
  target: {
    type: 'string',
    enum: VALID_TARGETS,
    description: 'Message target system'
  },
  type: {
    type: 'string',
    enum: MESSAGE_TYPES,
    description: 'Message type'
  },
  payload: {
    type: 'object',
    description: 'Message payload data',
    minProperties: 1
  },
  timestamp: {
    type: 'string',
    pattern: 'iso8601',
    description: 'Message creation timestamp (ISO8601)'
  },
  traceId: {
    type: 'string',
    description: 'Session or trace identifier'
  },
  metadata: {
    type: 'object',
    properties: {
      priority: {
        type: 'string',
        enum: PRIORITY_LEVELS,
        default: 'normal'
      },
      retryCount: {
        type: 'integer',
        minimum: 0,
        default: 0
      },
      correlationId: {
        type: 'string',
        description: 'Parent message ID for correlation'
      }
    }
  }
};

/**
 * Validate UUID format
 * @param {string} value - Value to validate
 * @returns {boolean} True if valid UUID
 */
function isValidUUID(value) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Validate ISO8601 timestamp format
 * @param {string} value - Value to validate
 * @returns {boolean} True if valid ISO8601
 */
function isValidISO8601(value) {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  return iso8601Regex.test(value) && !isNaN(Date.parse(value));
}

/**
 * Validate a single field against schema
 * @param {string} fieldName - Field name
 * @param {*} value - Field value
 * @param {Object} schema - Field schema definition
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
function validateField(fieldName, value, schema) {
  // Check required field
  if (value === undefined || value === null) {
    return {
      valid: false,
      error: VALIDATION_ERRORS.MISSING_FIELD.replace('{field}', fieldName)
    };
  }

  // Validate type
  const expectedType = schema.type;
  let actualType = typeof value;
  if (value instanceof Date) actualType = 'date';
  if (Array.isArray(value)) actualType = 'array';

  if (expectedType && actualType !== expectedType) {
    return {
      valid: false,
      error: VALIDATION_ERRORS.INVALID_FORMAT
        .replace('{field}', fieldName)
        .replace('{type}', expectedType)
    };
  }

  // Validate pattern (UUID, ISO8601, etc)
  if (schema.pattern === 'uuid' && !isValidUUID(value)) {
    return {
      valid: false,
      error: VALIDATION_ERRORS.INVALID_UUID.replace('{field}', fieldName)
    };
  }

  if (schema.pattern === 'iso8601' && !isValidISO8601(value)) {
    return {
      valid: false,
      error: VALIDATION_ERRORS.INVALID_ISO8601.replace('{field}', fieldName)
    };
  }

  // Validate enum
  if (schema.enum && !schema.enum.includes(value)) {
    return {
      valid: false,
      error: VALIDATION_ERRORS.INVALID_ENUM
        .replace('{field}', fieldName)
        .replace('{values}', schema.enum.join(', '))
    };
  }

  // Validate minProperties for objects
  if (schema.minProperties && Object.keys(value).length < schema.minProperties) {
    return {
      valid: false,
      error: VALIDATION_ERRORS.PAYLOAD_REQUIRED
    };
  }

  return { valid: true };
}

/**
 * Validate metadata object
 * @param {Object} metadata - Metadata to validate
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
function validateMetadata(metadata) {
  if (!metadata) {
    return { valid: true }; // Optional
  }

  if (typeof metadata !== 'object') {
    return {
      valid: false,
      error: VALIDATION_ERRORS.INVALID_FORMAT
        .replace('{field}', 'metadata')
        .replace('{type}', 'object')
    };
  }

  // Validate priority if present
  if (metadata.priority && !PRIORITY_LEVELS.includes(metadata.priority)) {
    return {
      valid: false,
      error: VALIDATION_ERRORS.INVALID_ENUM
        .replace('{field}', 'metadata.priority')
        .replace('{values}', PRIORITY_LEVELS.join(', '))
    };
  }

  // Validate retryCount if present
  if (metadata.retryCount !== undefined && typeof metadata.retryCount !== 'number') {
    return {
      valid: false,
      error: VALIDATION_ERRORS.INVALID_FORMAT
        .replace('{field}', 'metadata.retryCount')
        .replace('{type}', 'number')
    };
  }

  // Validate correlationId if present
  if (metadata.correlationId && typeof metadata.correlationId !== 'string') {
    return {
      valid: false,
      error: VALIDATION_ERRORS.INVALID_CORRELATION_ID
    };
  }

  return { valid: true };
}

/**
 * Validate a complete message
 * @param {Object} message - Message to validate
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
export function validateMessage(message) {
  const errors = [];

  // Validate it's an object
  if (!message || typeof message !== 'object') {
    return {
      valid: false,
      errors: [VALIDATION_ERRORS.INVALID_JSON.replace('{field}', 'message')]
    };
  }

  // Validate required base fields
  const requiredFields = ['eventId', 'source', 'target', 'type', 'payload', 'timestamp'];
  for (const field of requiredFields) {
    const schema = BASE_MESSAGE_SCHEMA[field];
    const validation = validateField(field, message[field], schema);
    if (!validation.valid) {
      errors.push(validation.error);
    }
  }

  // Early return if basic fields fail
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Validate type-specific schema exists
  const messageType = message.type;
  if (!MESSAGE_SCHEMAS[messageType]) {
    errors.push(`Unknown message type: ${messageType}`);
    return { valid: false, errors };
  }

  // Validate optional traceId
  if (message.traceId && typeof message.traceId !== 'string') {
    errors.push(
      VALIDATION_ERRORS.INVALID_FORMAT
        .replace('{field}', 'traceId')
        .replace('{type}', 'string')
    );
  }

  // Validate metadata
  const metadataValidation = validateMetadata(message.metadata);
  if (!metadataValidation.valid) {
    errors.push(metadataValidation.error);
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Create a new message with defaults and validation
 * @param {Object} messageData - Message data
 * @returns {Object} Complete message object with defaults
 * @throws {Error} If message validation fails
 */
export function createMessage(messageData) {
  const message = {
    eventId: messageData.eventId || uuidv4(),
    source: messageData.source,
    target: messageData.target,
    type: messageData.type,
    payload: messageData.payload,
    timestamp: messageData.timestamp || new Date().toISOString(),
    traceId: messageData.traceId,
    metadata: {
      priority: messageData.metadata?.priority || 'normal',
      retryCount: messageData.metadata?.retryCount || 0,
      correlationId: messageData.metadata?.correlationId
    }
  };

  const validation = validateMessage(message);
  if (!validation.valid) {
    const errorMsg = validation.errors.join('; ');
    throw new Error(`${VALIDATION_ERRORS.INVALID_MESSAGE}: ${errorMsg}`);
  }

  return message;
}

/**
 * Get message schema for a specific type
 * @param {string} messageType - Type of message
 * @returns {Object} Message schema
 */
export function getMessageSchema(messageType) {
  return MESSAGE_SCHEMAS[messageType];
}

export default {
  validateMessage,
  createMessage,
  getMessageSchema,
  VALIDATION_ERRORS,
  MESSAGE_SCHEMAS,
  BASE_MESSAGE_SCHEMA
};
