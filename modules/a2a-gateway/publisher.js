/**
 * A2A Gateway Publisher
 * Publishes messages to various Pub/Sub topics
 * @module publisher
 */

import { getTopic, TOPICS, LOG_CONFIG } from './config.js';
import { validateMessage, createMessage, VALIDATION_ERRORS } from './schema.js';

/**
 * Simple logger utility
 * @type {Object}
 */
const logger = {
  info: (msg, data) => {
    if (LOG_CONFIG.enabled && LOG_CONFIG.level !== 'error') {
      console.log(`[A2A:INFO] ${msg}`, data || '');
    }
  },
  error: (msg, err) => {
    if (LOG_CONFIG.enabled) {
      console.error(`[A2A:ERROR] ${msg}`, err || '');
    }
  },
  debug: (msg, data) => {
    if (LOG_CONFIG.enabled && LOG_CONFIG.level === 'debug') {
      console.debug(`[A2A:DEBUG] ${msg}`, data || '');
    }
  }
};

/**
 * Generic publish function
 * Publishes a validated message to a specified topic
 * @param {string} topicName - Name of the topic to publish to
 * @param {Object} message - Message to publish (will be validated)
 * @returns {Promise<string>} Message ID from Pub/Sub
 * @throws {Error} If validation fails or publish fails
 */
export async function publish(topicName, message) {
  try {
    // Validate message
    const validation = validateMessage(message);
    if (!validation.valid) {
      const errorMsg = validation.errors.join('; ');
      throw new Error(`${VALIDATION_ERRORS.INVALID_MESSAGE}: ${errorMsg}`);
    }

    // Get topic reference
    const topic = getTopic(topicName);

    // Convert message to JSON buffer
    const messageBuffer = Buffer.from(JSON.stringify(message));

    // Publish with attributes for routing
    const attributes = {
      eventId: message.eventId,
      source: message.source,
      target: message.target,
      type: message.type,
      priority: message.metadata?.priority || 'normal'
    };

    logger.debug('Publishing message', {
      topic: topicName,
      eventId: message.eventId,
      type: message.type
    });

    const messageId = await topic.publish(messageBuffer, attributes);

    logger.info(`Message published to ${topicName}`, {
      messageId,
      eventId: message.eventId
    });

    return messageId;
  } catch (error) {
    logger.error(`Failed to publish to ${topicName}`, error);
    throw error;
  }
}

/**
 * Publish a task message
 * Task messages are sent to the ruptur-tasks topic
 * @param {Object} taskData - Task data to publish
 * @param {string} taskData.source - Source system (jarvis|hermes|matuzas|operator)
 * @param {string} taskData.target - Target system (jarvis|hermes|matuzas)
 * @param {Object} taskData.payload - Task payload
 * @param {string} [taskData.eventId] - Optional event ID (auto-generated if not provided)
 * @param {string} [taskData.traceId] - Optional trace/session ID
 * @param {Object} [taskData.metadata] - Optional metadata
 * @returns {Promise<string>} Message ID
 * @throws {Error} If validation or publish fails
 */
export async function publishTask(taskData) {
  try {
    const message = createMessage({
      type: 'task',
      ...taskData,
      timestamp: taskData.timestamp || new Date().toISOString()
    });

    return await publish(TOPICS.TASKS, message);
  } catch (error) {
    logger.error('Failed to publish task', error);
    throw error;
  }
}

/**
 * Publish an approval message
 * Approval messages can be requests or responses on ruptur-approvals topic
 * @param {Object} approvalData - Approval data to publish
 * @param {string} approvalData.source - Source system
 * @param {string} approvalData.target - Target system
 * @param {Object} approvalData.payload - Approval payload
 * @param {string} [approvalData.eventId] - Optional event ID
 * @param {string} [approvalData.traceId] - Optional trace ID
 * @param {Object} [approvalData.metadata] - Optional metadata
 * @returns {Promise<string>} Message ID
 * @throws {Error} If validation or publish fails
 */
export async function publishApproval(approvalData) {
  try {
    const message = createMessage({
      type: 'approval',
      ...approvalData,
      timestamp: approvalData.timestamp || new Date().toISOString()
    });

    return await publish(TOPICS.APPROVALS, message);
  } catch (error) {
    logger.error('Failed to publish approval', error);
    throw error;
  }
}

/**
 * Publish a result message
 * Result messages contain task execution results on ruptur-results topic
 * @param {Object} resultData - Result data to publish
 * @param {string} resultData.source - Source system
 * @param {string} resultData.target - Target system
 * @param {Object} resultData.payload - Result payload
 * @param {string} [resultData.eventId] - Optional event ID
 * @param {string} [resultData.traceId] - Optional trace ID
 * @param {Object} [resultData.metadata] - Optional metadata
 * @returns {Promise<string>} Message ID
 * @throws {Error} If validation or publish fails
 */
export async function publishResult(resultData) {
  try {
    const message = createMessage({
      type: 'result',
      ...resultData,
      timestamp: resultData.timestamp || new Date().toISOString()
    });

    return await publish(TOPICS.RESULTS, message);
  } catch (error) {
    logger.error('Failed to publish result', error);
    throw error;
  }
}

/**
 * Publish a validation message
 * Validation messages contain validation results on ruptur-validations topic
 * @param {Object} validationData - Validation data to publish
 * @param {string} validationData.source - Source system
 * @param {string} validationData.target - Target system
 * @param {Object} validationData.payload - Validation payload
 * @param {string} [validationData.eventId] - Optional event ID
 * @param {string} [validationData.traceId] - Optional trace ID
 * @param {Object} [validationData.metadata] - Optional metadata
 * @returns {Promise<string>} Message ID
 * @throws {Error} If validation or publish fails
 */
export async function publishValidation(validationData) {
  try {
    const message = createMessage({
      type: 'validation',
      ...validationData,
      timestamp: validationData.timestamp || new Date().toISOString()
    });

    return await publish(TOPICS.VALIDATIONS, message);
  } catch (error) {
    logger.error('Failed to publish validation', error);
    throw error;
  }
}

/**
 * Publish multiple messages in batch
 * @param {string} topicName - Topic name
 * @param {Array<Object>} messages - Array of messages
 * @returns {Promise<Array<string>>} Array of message IDs
 */
export async function publishBatch(topicName, messages) {
  try {
    logger.info(`Publishing batch of ${messages.length} messages to ${topicName}`);

    const messageIds = await Promise.all(
      messages.map(msg => publish(topicName, msg))
    );

    logger.info(`Batch published successfully`, { count: messageIds.length });
    return messageIds;
  } catch (error) {
    logger.error('Failed to publish batch', error);
    throw error;
  }
}

export default {
  publish,
  publishTask,
  publishApproval,
  publishResult,
  publishValidation,
  publishBatch
};
