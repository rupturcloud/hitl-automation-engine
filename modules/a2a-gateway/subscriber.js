/**
 * A2A Gateway Subscriber
 * Subscribes to and processes messages from Pub/Sub topics
 * @module subscriber
 */

import { getSubscription, SUBSCRIPTIONS, TOPICS, TIMEOUT_CONFIG, LOG_CONFIG } from './config.js';
import { validateMessage } from './schema.js';

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
 * Process and validate an incoming message
 * @param {Object} pubsubMessage - Message from Pub/Sub
 * @returns {Object} Processed message with metadata
 * @throws {Error} If message parsing or validation fails
 */
export function handleMessage(pubsubMessage) {
  try {
    // Parse message data
    const messageData = JSON.parse(pubsubMessage.data.toString());

    logger.debug('Received message', {
      id: pubsubMessage.id,
      eventId: messageData.eventId,
      type: messageData.type
    });

    // Validate message schema
    const validation = validateMessage(messageData);
    if (!validation.valid) {
      logger.error('Message validation failed', {
        eventId: messageData.eventId,
        errors: validation.errors
      });
      throw new Error(`Invalid message schema: ${validation.errors.join('; ')}`);
    }

    // Enrich with subscription metadata
    const processedMessage = {
      ...messageData,
      _meta: {
        pubsubId: pubsubMessage.id,
        publishTime: pubsubMessage.publishTime,
        attributes: pubsubMessage.attributes,
        ackId: pubsubMessage.ackId
      }
    };

    logger.info(`Message processed: ${messageData.type}`, {
      eventId: messageData.eventId,
      source: messageData.source,
      target: messageData.target
    });

    return processedMessage;
  } catch (error) {
    logger.error('Failed to handle message', error);
    throw error;
  }
}

/**
 * Subscribe to task messages
 * @param {Function} callback - Callback function to process task messages
 *   Called with (message, ackFn) parameters
 * @returns {Object} Subscription object with close() method
 */
export function subscribeToTasks(callback) {
  return subscribeToTopic(SUBSCRIPTIONS.TASKS, TOPICS.TASKS, callback);
}

/**
 * Subscribe to approval messages
 * @param {Function} callback - Callback function to process approval messages
 *   Called with (message, ackFn) parameters
 * @returns {Object} Subscription object with close() method
 */
export function subscribeToApprovals(callback) {
  return subscribeToTopic(SUBSCRIPTIONS.APPROVALS, TOPICS.APPROVALS, callback);
}

/**
 * Subscribe to result messages
 * @param {Function} callback - Callback function to process result messages
 *   Called with (message, ackFn) parameters
 * @returns {Object} Subscription object with close() method
 */
export function subscribeToResults(callback) {
  return subscribeToTopic(SUBSCRIPTIONS.RESULTS, TOPICS.RESULTS, callback);
}

/**
 * Subscribe to validation messages
 * @param {Function} callback - Callback function to process validation messages
 *   Called with (message, ackFn) parameters
 * @returns {Object} Subscription object with close() method
 */
export function subscribeToValidations(callback) {
  return subscribeToTopic(SUBSCRIPTIONS.VALIDATIONS, TOPICS.VALIDATIONS, callback);
}

/**
 * Generic subscription handler
 * @param {string} subscriptionName - Name of the subscription
 * @param {string} topicName - Name of the topic (for logging)
 * @param {Function} callback - Callback to process messages
 * @returns {Object} Subscription object
 */
function subscribeToTopic(subscriptionName, topicName, callback) {
  const subscription = getSubscription(subscriptionName);

  logger.info(`Subscribing to ${topicName}`, { subscription: subscriptionName });

  // Set up message handler
  const messageHandler = (pubsubMessage) => {
    try {
      // Process message
      const processedMessage = handleMessage(pubsubMessage);

      // Call user callback
      callback(processedMessage, () => {
        // Acknowledge message after successful processing
        pubsubMessage.ack();
        logger.debug('Message acknowledged', { eventId: processedMessage.eventId });
      });
    } catch (error) {
      logger.error('Error processing message', {
        pubsubId: pubsubMessage.id,
        error: error.message
      });

      // Nack message to retry
      pubsubMessage.nack();
    }
  };

  // Set up error handler
  const errorHandler = (error) => {
    logger.error(`Subscription error on ${topicName}`, error);
  };

  // Listen for messages
  subscription.on('message', messageHandler);
  subscription.on('error', errorHandler);

  // Configure subscription settings
  subscription.setOptions({
    streamingOptions: {
      maxStreams: 1,
      maxLeaseSeconds: TIMEOUT_CONFIG.ackDeadline
    }
  });

  logger.info(`Subscription active on ${topicName}`, {
    subscription: subscriptionName,
    ackDeadline: TIMEOUT_CONFIG.ackDeadline
  });

  // Return subscription wrapper with close method
  return {
    close: async () => {
      logger.info(`Closing subscription to ${topicName}`);
      await subscription.removeAllListeners();
      return Promise.resolve();
    },
    subscription
  };
}

/**
 * Subscribe to multiple topics at once
 * @param {Object} config - Configuration object
 * @param {Function} [config.onTask] - Task message handler
 * @param {Function} [config.onApproval] - Approval message handler
 * @param {Function} [config.onResult] - Result message handler
 * @param {Function} [config.onValidation] - Validation message handler
 * @returns {Object} Subscription manager with closeAll() method
 */
export function subscribeToAll(config = {}) {
  const subscriptions = [];

  if (config.onTask) {
    subscriptions.push({ name: 'tasks', sub: subscribeToTasks(config.onTask) });
  }

  if (config.onApproval) {
    subscriptions.push({ name: 'approvals', sub: subscribeToApprovals(config.onApproval) });
  }

  if (config.onResult) {
    subscriptions.push({ name: 'results', sub: subscribeToResults(config.onResult) });
  }

  if (config.onValidation) {
    subscriptions.push({ name: 'validations', sub: subscribeToValidations(config.onValidation) });
  }

  logger.info(`Subscribed to ${subscriptions.length} topics`);

  return {
    subscriptions,
    closeAll: async () => {
      logger.info('Closing all subscriptions');
      await Promise.all(subscriptions.map(s => s.sub.close()));
      logger.info('All subscriptions closed');
    },
    close: async (topicName) => {
      const sub = subscriptions.find(s => s.name === topicName);
      if (sub) {
        await sub.sub.close();
        const index = subscriptions.indexOf(sub);
        subscriptions.splice(index, 1);
        logger.info(`Closed subscription to ${topicName}`);
      }
    }
  };
}

export default {
  handleMessage,
  subscribeToTasks,
  subscribeToApprovals,
  subscribeToResults,
  subscribeToValidations,
  subscribeToAll
};
