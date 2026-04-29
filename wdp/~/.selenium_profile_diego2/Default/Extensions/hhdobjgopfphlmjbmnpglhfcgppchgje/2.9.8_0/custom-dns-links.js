(() => {
var __webpack_modules__ = ({
4073(module, __unused_rspack_exports, __webpack_require__) {
var root = __webpack_require__(8453);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


},
6624(module, __unused_rspack_exports, __webpack_require__) {
var Symbol = __webpack_require__(4073),
    getRawTag = __webpack_require__(7915),
    objectToString = __webpack_require__(4478);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


},
3480(module, __unused_rspack_exports, __webpack_require__) {
var trimmedEndIndex = __webpack_require__(8976);

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

module.exports = baseTrim;


},
8928(module, __unused_rspack_exports, __webpack_require__) {
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


},
7915(module, __unused_rspack_exports, __webpack_require__) {
var Symbol = __webpack_require__(4073);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


},
4478(module) {
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


},
8453(module, __unused_rspack_exports, __webpack_require__) {
var freeGlobal = __webpack_require__(8928);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


},
8976(module) {
/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

module.exports = trimmedEndIndex;


},
2645(module, __unused_rspack_exports, __webpack_require__) {
var isObject = __webpack_require__(7717),
    now = __webpack_require__(4884),
    toNumber = __webpack_require__(6086);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


},
7717(module) {
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


},
2050(module) {
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


},
6770(module, __unused_rspack_exports, __webpack_require__) {
var baseGetTag = __webpack_require__(6624),
    isObjectLike = __webpack_require__(2050);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


},
4884(module, __unused_rspack_exports, __webpack_require__) {
var root = __webpack_require__(8453);

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


},
462(module, __unused_rspack_exports, __webpack_require__) {
var debounce = __webpack_require__(2645),
    isObject = __webpack_require__(7717);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;


},
6086(module, __unused_rspack_exports, __webpack_require__) {
var baseTrim = __webpack_require__(3480),
    isObject = __webpack_require__(7717),
    isSymbol = __webpack_require__(6770);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


},
3675(module, __unused_rspack_exports, __webpack_require__) {
/* module decorator */ module = __webpack_require__.nmd(module);
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("webextension-polyfill", ["module"], factory);
  } else if (true) {
    factory(module);
  } else { var mod }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.12.0 - Tue May 14 2024 18:01:29 */
  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
  /* vim: set sts=2 sw=2 et tw=80: */
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
    throw new Error("This script should only be loaded in a browser extension.");
  }
  if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";

    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.
    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };
      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }

      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */
      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }
        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }
          return super.get(key);
        }
      }

      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */
      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };

      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */
      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };
      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */
      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }
          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }
          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args);

                // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.
                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };

      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */
      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }
        });
      };
      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */
      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },
          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }
            if (!(prop in target)) {
              return undefined;
            }
            let value = target[prop];
            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.

              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,
                get() {
                  return target[prop];
                },
                set(value) {
                  target[prop] = value;
                }
              });
              return value;
            }
            cache[prop] = value;
            return value;
          },
          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }
            return true;
          },
          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },
          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }
        };

        // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.
        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };

      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */
      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },
        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },
        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }
      });
      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */
        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {} /* wrappers */, {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      });
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */
        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;
          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }
          const isResultThenable = result !== true && isThenable(result);

          // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.
          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          }

          // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).
          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;
              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }
              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          };

          // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.
          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          }

          // Let Chrome know that the listener is replying.
          return true;
        };
      });
      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };
      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }
        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }
        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };
      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.
    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = globalThis.browser;
  }
});
//# sourceMappingURL=browser-polyfill.js.map


},

});
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
id: moduleId,
loaded: false,
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);

// Flag the module as loaded
module.loaded = true;
// Return the exports of the module
return module.exports;

}

// webpack/runtime/compat_get_default_export
(() => {
// getDefaultExport function for compatibility with non-ESM modules
__webpack_require__.n = (module) => {
	var getter = module && module.__esModule ?
		() => (module['default']) :
		() => (module);
	__webpack_require__.d(getter, { a: getter });
	return getter;
};

})();
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = (exports, definition) => {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
})();
// webpack/runtime/global
(() => {
__webpack_require__.g = (() => {
	if (typeof globalThis === 'object') return globalThis;
	try {
		return this || new Function('return this')();
	} catch (e) {
		if (typeof window === 'object') return window;
	}
})();
})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
})();
// webpack/runtime/node_module_decorator
(() => {
__webpack_require__.nmd = (module) => {
  module.paths = [];
  if (!module.children) module.children = [];
  return module;
};
})();
// webpack/runtime/rspack_version
(() => {
__webpack_require__.rv = () => ("1.7.5")
})();
// webpack/runtime/rspack_unique_id
(() => {
__webpack_require__.ruid = "bundler=rspack@1.7.5";
})();
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// UNUSED EXPORTS: getSubscriptionParams

;// CONCATENATED MODULE: ./src/common/constants.ts
const SETTINGS_IDS = {
    PROXY_ENABLED: 'proxy.enabled',
    RATE_SHOW: 'rate.show',
    PREMIUM_FEATURES_SHOW: 'premium.features.show',
    USER_SET_PROMO_SHOW: 'user.set.promo.show',
    EXCLUSIONS: 'exclusions.list',
    HANDLE_WEBRTC_ENABLED: 'webrtc.handle.enabled',
    SELECTED_DNS_SERVER: 'dns.handle.server',
    SELECTED_CUSTOM_DNS_SERVER: 'custom.dns.handle.server',
    CONTEXT_MENU_ENABLED: 'context.menu.enabled',
    SELECTED_LOCATION_KEY: 'endpoints.selected.location',
    LOCATION_SELECTED_BY_USER_KEY: 'endpoints.location.selected.by.user',
    POLICY_AGREEMENT: 'policy.agreement',
    HELP_US_IMPROVE: 'help.us.improve',
    APPEARANCE_THEME: 'appearance.theme',
    CUSTOM_DNS_SERVERS: 'custom.dns.servers',
    QUICK_CONNECT: 'quick.connect',
    DEBUG_MODE_ENABLED: 'debug.mode.enabled',
    SELECTED_LANGUAGE: 'language.selected'
};
var constants_AppearanceTheme = /*#__PURE__*/ (/* unused pure expression or super */ null && (function(AppearanceTheme) {
    AppearanceTheme["System"] = "System";
    AppearanceTheme["Dark"] = "Dark";
    AppearanceTheme["Light"] = "Light";
    return AppearanceTheme;
}({})));
const APPEARANCE_THEME_DEFAULT = "System";
const THEME_URL_PARAMETER = 'theme';
var constants_QuickConnectSetting = /*#__PURE__*/ (/* unused pure expression or super */ null && (function(QuickConnectSetting) {
    QuickConnectSetting["LastUsedLocation"] = "lastUsedLocation";
    QuickConnectSetting["FastestLocation"] = "fastestLocation";
    return QuickConnectSetting;
}({})));
const QUICK_CONNECT_SETTING_DEFAULT = "lastUsedLocation";
var constants_MessageType = /*#__PURE__*/ function(MessageType) {
    MessageType["ADD_EVENT_LISTENER"] = "add.event.listener";
    MessageType["NOTIFY_LISTENERS"] = "notify.listeners";
    MessageType["REMOVE_EVENT_LISTENER"] = "remove.event.listener";
    MessageType["ADD_LONG_LIVED_CONNECTION"] = "add.long.lived.connection";
    MessageType["GET_POPUP_DATA"] = "get.popup.data";
    MessageType["GET_LIMITED_OFFER_DATA"] = "get.limited.offer.data";
    MessageType["FORCE_UPDATE_LOCATIONS"] = "force.update.locations";
    MessageType["SAVED_LOCATIONS_SAVE_TAB"] = "saved.locations.save.tab";
    MessageType["SAVED_LOCATIONS_ADD"] = "saved.locations.add";
    MessageType["SAVED_LOCATIONS_REMOVE"] = "saved.locations.remove";
    MessageType["GET_OPTIONS_DATA"] = "get.options.data";
    MessageType["GET_CONSENT_DATA"] = "get.consent.data";
    MessageType["SET_CONSENT_DATA"] = "set.consent.data";
    MessageType["GET_VPN_FAILURE_PAGE"] = "get.vpn.failure.page";
    MessageType["OPEN_OPTIONS_PAGE"] = "open.options.page";
    MessageType["SET_SELECTED_LOCATION"] = "set.selected.location";
    MessageType["DEAUTHENTICATE_USER"] = "deauthenticate.user";
    MessageType["UPDATE_AUTH_CACHE"] = "update.auth.cache";
    MessageType["GET_CAN_CONTROL_PROXY"] = "get.can.control.proxy";
    MessageType["ENABLE_PROXY"] = "enable.proxy";
    MessageType["DISABLE_PROXY"] = "disable.proxy";
    MessageType["ADD_URL_TO_EXCLUSIONS"] = "add.to.exclusions";
    MessageType["REMOVE_EXCLUSION"] = "remove.exclusion";
    MessageType["DISABLE_VPN_BY_URL"] = "disable.vpn.by.url";
    MessageType["ENABLE_VPN_BY_URL"] = "enable.vpn.by.url";
    MessageType["DISABLE_OTHER_EXTENSIONS"] = "disable.other.extensions";
    MessageType["IS_AUTHENTICATED"] = "is.authenticated";
    MessageType["CLEAR_PERMISSIONS_ERROR"] = "clear.permissions.error";
    MessageType["CHECK_PERMISSIONS"] = "check.permissions";
    MessageType["GET_EXCLUSIONS_INVERTED"] = "get.exclusions.inverted";
    MessageType["GET_EXCLUSIONS_DATA"] = "get.exclusions.data";
    MessageType["SET_EXCLUSIONS_MODE"] = "set.exclusions.mode";
    MessageType["TOGGLE_EXCLUSION_STATE"] = "toggle.exclusion.state";
    MessageType["RESET_SERVICE_DATA"] = "reset.service.data";
    MessageType["CLEAR_EXCLUSIONS_LIST"] = "clear.exclusions.list";
    MessageType["TOGGLE_SERVICES"] = "toggle.services";
    MessageType["GET_SETTING_VALUE"] = "get.setting.value";
    MessageType["SET_SETTING_VALUE"] = "set.setting.value";
    MessageType["GET_USERNAME"] = "get.username";
    MessageType["UPDATE_MARKETING_CONSENT"] = "update.marketing.consent";
    MessageType["GET_SELECTED_LOCATION"] = "get.selected.location";
    MessageType["CHECK_IS_PREMIUM_TOKEN"] = "check.is.premium.token";
    MessageType["SET_NOTIFICATION_VIEWED"] = "set.notification.viewed";
    MessageType["OPEN_TAB"] = "open.tab.action";
    MessageType["REPORT_BUG"] = "post.report.bug";
    MessageType["OPEN_FORWARDER_URL_WITH_EMAIL"] = "open.forwarder.url.with.email";
    MessageType["ADD_REGULAR_EXCLUSIONS"] = "add.regular.exclusions";
    MessageType["ADD_SELECTIVE_EXCLUSIONS"] = "add.selective.exclusions";
    MessageType["SET_FLAG"] = "set.flag";
    MessageType["GET_GENERAL_EXCLUSIONS"] = "get.general.exclusions";
    MessageType["GET_SELECTIVE_EXCLUSIONS"] = "get.selective.exclusions";
    MessageType["OPEN_FREE_GBS_PAGE"] = "open.free.gbs.page";
    MessageType["GET_BONUSES_DATA"] = "get.bonuses.data";
    MessageType["RESTORE_EXCLUSIONS"] = "restore.exclusions";
    MessageType["ADD_EXCLUSIONS_MAP"] = "add.exclusions.map";
    MessageType["HIDE_RATE_MODAL_AFTER_RATE"] = "hide.rate.modal.after.rate";
    MessageType["HIDE_RATE_MODAL_AFTER_CANCEL"] = "hide.rate.modal.after.cancel";
    MessageType["HIDE_MOBILE_EDGE_PROMO_BANNER"] = "hide.mobile.edge.promo.banner";
    MessageType["HANDLE_CUSTOM_DNS_LINK"] = "handle.custom.dns.link";
    MessageType["ADD_CUSTOM_DNS_SERVER"] = "add.custom.dns.server";
    MessageType["EDIT_CUSTOM_DNS_SERVER"] = "edit.custom.dns.server";
    MessageType["REMOVE_CUSTOM_DNS_SERVER"] = "remove.custom.dns.server";
    MessageType["RESTORE_CUSTOM_DNS_SERVERS_DATA"] = "restore.custom.dns.servers.data";
    MessageType["SET_HINT_POPUP_VIEWED"] = "set.hint.popup.viewed";
    MessageType["MARK_REGION_NOTICE_AS_SHOWN"] = "mark.region.notice.as.shown";
    MessageType["GET_LOGS"] = "get.logs";
    MessageType["GET_APP_VERSION"] = "get.app.version";
    MessageType["UPDATE_LISTENERS"] = "update.listeners";
    /**
     * Re-fetches locations from the server, populating backend-provided pings.
     * Only locations without a backend ping are measured locally.
     */ MessageType["REFRESH_LOCATIONS"] = "refresh.locations";
    MessageType["TELEMETRY_EVENT_SEND_PAGE_VIEW"] = "telemetry.event.send.page.view";
    MessageType["TELEMETRY_EVENT_SEND_CUSTOM"] = "telemetry.event.send.custom";
    MessageType["TELEMETRY_EVENT_REMOVE_OPENED_PAGE"] = "telemetry.event.remove.opened.page";
    MessageType["STATISTICS_GET_BY_RANGE"] = "statistics.get.by.range";
    MessageType["STATISTICS_CLEAR"] = "statistics.clear";
    MessageType["STATISTICS_SET_IS_DISABLED"] = "statistics.set.is.disabled";
    MessageType["SEND_WEB_AUTH_ACTION"] = "send.web.auth.action";
    MessageType["GET_STARTUP_DATA"] = "get.startup.data";
    MessageType["SET_INTERFACE_LANGUAGE"] = "set.interface.language";
    MessageType["GET_INTERFACE_LANGUAGE"] = "get.interface.language";
    return MessageType;
}({});
const FLAGS_FIELDS = (/* unused pure expression or super */ null && ({
    IS_NEW_USER: 'isNewUser',
    SHOW_NEWSLETTER: 'showNewsletter',
    SHOW_ONBOARDING: 'showOnboarding',
    SHOW_UPGRADE_SCREEN: 'showUpgradeScreen',
    SALE_SHOW: 'saleShow',
    SHOULD_SHOW_RATE_MODAL: 'shouldShowRateModal'
}));
/**
 * Absolute URL for the consent page.
 */ const CONSENT_PAGE_URL = '/consent.html';
var constants_SubscriptionType = /*#__PURE__*/ (/* unused pure expression or super */ null && (function(SubscriptionType) {
    SubscriptionType["Monthly"] = "MONTHLY";
    SubscriptionType["Yearly"] = "YEARLY";
    SubscriptionType["TwoYears"] = "TWO_YEARS";
    return SubscriptionType;
}({})));
const CUSTOM_DNS_ANCHOR_NAME = 'custom-dns';
const ONE_SECOND_MS = 1000;
const ONE_MINUTE_MS = (/* unused pure expression or super */ null && (ONE_SECOND_MS * 60));
const ONE_HOUR_MS = (/* unused pure expression or super */ null && (ONE_MINUTE_MS * 60));
const ONE_DAY_MS = (/* unused pure expression or super */ null && (ONE_HOUR_MS * 24));

;// CONCATENATED MODULE: ./node_modules/.pnpm/@adguard+logger@2.0.0/node_modules/@adguard/logger/dist/es/index.mjs
/**
 * Checks if error has message.
 *
 * @param error Error object.
 *
 * @returns True if error has message.
 */
function isErrorWithMessage(error) {
    return (typeof error === 'object'
        && error !== null
        && 'message' in error
        && typeof error.message === 'string');
}
/**
 * Converts error to the error with a message.
 *
 * @param maybeError Possible error.
 *
 * @returns Error with a message.
 */
function toErrorWithMessage(maybeError) {
    if (isErrorWithMessage(maybeError)) {
        return maybeError;
    }
    try {
        return new Error(JSON.stringify(maybeError));
    }
    catch {
        // fallback in case there's an error stringifying the maybeError
        // like with circular references, for example.
        return new Error(String(maybeError));
    }
}
/**
 * Converts an error object to an error with a message. This method might be helpful to handle thrown errors.
 *
 * @param error Error object.
 *
 * @returns Message of the error.
 */
function getErrorMessage(error) {
    return toErrorWithMessage(error).message;
}

/**
 * Pads a number with leading zeros.
 *
 * @param num The number to pad.
 * @param size The number of digits to pad to.
 *
 * @returns The padded number.
 */
const pad = (num, size = 2) => {
    return num.toString().padStart(size, '0');
};
/**
 * Formats a date into an ISO 8601-like string with milliseconds.
 *
 * @param {Date|number} date The date object or timestamp to format.
 *
 * @returns {string} The formatted date string.
 */
const formatTime = (date) => {
    const d = (date instanceof Date) ? date : new Date(date);
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1); // Months are 0-based
    const day = pad(d.getDate());
    const hour = pad(d.getHours());
    const minute = pad(d.getMinutes());
    const second = pad(d.getSeconds());
    const millisecond = pad(d.getMilliseconds(), 3); // Milliseconds are 3 digits
    return `${year}-${month}-${day}T${hour}:${minute}:${second}:${millisecond}`;
};

/**
 * String presentation of log levels, for convenient users usage.
 * Ordered in the same way as LogLevelNumeric.
 *
 * First three levels will be shown to users, and the last two are for developers.
 */
var es_LogLevel;
(function (LogLevel) {
    /**
     * For errors.
     */
    LogLevel["Error"] = "error";
    /**
     * For not critical errors.
     */
    LogLevel["Warn"] = "warn";
    /**
     * For important information.
     * Use for general operational messages.
     */
    LogLevel["Info"] = "info";
    /**
     * For debugging purposes, e.g. Inside conditions, loops or some edge cases.
     */
    LogLevel["Debug"] = "debug";
    /**
     * For ultra-detailed, step-by-step traces (like stack traces or flow tracking).
     */
    LogLevel["Verbose"] = "verbose";
})(es_LogLevel || (es_LogLevel = {}));
/**
 * Log levels map, which maps number level to string level.
 * Ordered in the same way as LogLevelNumeric.
 */
const levelMapNumToString = {
    [1 /* LogLevelNumeric.Error */]: es_LogLevel.Error,
    [2 /* LogLevelNumeric.Warn */]: es_LogLevel.Warn,
    [3 /* LogLevelNumeric.Info */]: es_LogLevel.Info,
    [4 /* LogLevelNumeric.Debug */]: es_LogLevel.Debug,
    [5 /* LogLevelNumeric.Verbose */]: es_LogLevel.Verbose,
};
/**
 * Log levels map, which maps string level to number level.
 */
const levelMapStringToNum = Object.entries(levelMapNumToString)
    .reduce((acc, [key, value]) => {
    // Here, key is originally a string since Object.entries() returns [string, string][].
    // We need to cast the key to LogLevelNumeric correctly without causing type mismatches.
    const numericKey = Number(key);
    if (!Number.isNaN(numericKey)) {
        acc[value] = numericKey;
    }
    return acc;
}, {});
/**
 * Methods supported by console. Used to manage levels.
 * Ordered in the same way as LogLevelNumeric.
 */
var es_LogMethod;
(function (LogMethod) {
    LogMethod["Error"] = "error";
    LogMethod["Warn"] = "warn";
    LogMethod["Info"] = "info";
    LogMethod["Debug"] = "debug";
    LogMethod["Trace"] = "trace";
})(es_LogMethod || (es_LogMethod = {}));
/**
 * Simple logger with log levels.
 */
class Logger {
    currentLevelValue = 3 /* LogLevelNumeric.Info */;
    writer;
    /**
     * Constructor.
     *
     * @param writer Writer object.
     */
    constructor(writer = console) {
        this.writer = writer;
        // bind the logging methods to avoid losing context
        this.error = this.error.bind(this);
        this.warn = this.warn.bind(this);
        this.info = this.info.bind(this);
        this.debug = this.debug.bind(this);
        this.trace = this.trace.bind(this);
    }
    /**
     * Print error messages.
     * Use when something went wrong.
     *
     * @param args Printed arguments.
     */
    error(...args) {
        this.print(1 /* LogLevelNumeric.Error */, es_LogMethod.Error, args);
    }
    /**
     * Print warn messages.
     * Use when Something might go wrong.
     *
     * @param args Printed arguments.
     */
    warn(...args) {
        this.print(2 /* LogLevelNumeric.Warn */, es_LogMethod.Warn, args);
    }
    /**
     * Print messages you want to disclose to users.
     * Use for general operational messages.
     *
     * @param args Printed arguments.
     */
    info(...args) {
        this.print(3 /* LogLevelNumeric.Info */, es_LogMethod.Info, args);
    }
    /**
     * Print debug messages. Usually used for technical information.
     *
     * @param args Printed arguments.
     */
    debug(...args) {
        this.print(4 /* LogLevelNumeric.Debug */, es_LogMethod.Debug, args);
    }
    /**
     * Print trace messages.
     * Ultra-detailed, step-by-step traces (like stack traces or flow tracking).
     *
     * @param args Printed arguments.
     */
    trace(...args) {
        this.print(5 /* LogLevelNumeric.Verbose */, es_LogMethod.Trace, args);
    }
    /**
     * Getter for log level.
     *
     * @returns Logger level.
     */
    get currentLevel() {
        return levelMapNumToString[this.currentLevelValue];
    }
    /**
     * Setter for log level. With this method log level can be updated dynamically.
     *
     * @param logLevel Logger level.
     *
     * @throws Error if log level is not supported.
     */
    set currentLevel(logLevel) {
        const level = levelMapStringToNum[logLevel];
        if (level === undefined) {
            throw new Error(`Logger supports only the following levels: ${[Object.values(es_LogLevel).join(', ')]}`);
        }
        this.currentLevelValue = level;
    }
    /**
     * Converts error to string, and adds stack trace.
     *
     * @param error Error to print.
     *
     * @returns Error message.
     */
    static errorToString(error) {
        const message = getErrorMessage(error);
        return `${message}\nStack trace:\n${error.stack}`;
    }
    /**
     * Prints error message with stack trace.
     * It prints the message with the stack trace in a collapsed group.
     * This is useful for debugging purposes, as it allows to see the stack trace
     * without cluttering the console with too many messages.
     *
     * @param formattedTime Formatted time.
     * @param formattedArgs Formatted arguments.
     */
    printWithStackTrace(formattedTime, formattedArgs) {
        // If grouping is not supported, print just expanded trace, but this
        // leads to a lot of dirty logs in the console, since the stack trace
        // will be printed for every message.
        if (!this.writer.groupCollapsed || !this.writer.groupEnd) {
            // Print expanded trace
            this.writer.trace(formattedTime, ...formattedArgs);
            return;
        }
        // Print collapsed trace to make logs more readable and access to stack
        // trace by clicking on the group.
        this.writer.groupCollapsed(formattedTime, ...formattedArgs);
        this.writer.trace();
        this.writer.groupEnd();
    }
    /**
     * Wrapper over log methods.
     *
     * @param level Logger level.
     * @param method Logger method.
     * @param args Printed arguments.
     */
    print(level, method, args) {
        // Skip writing if the basic conditions are not met.
        if (this.currentLevelValue < level) {
            return;
        }
        // Do not print if no arguments are passed.
        if (!args || args.length === 0 || !args[0]) {
            return;
        }
        const formattedArgs = args.map((value) => {
            if (value instanceof Error) {
                return Logger.errorToString(value);
            }
            if (value && typeof value.message === 'string') {
                return value.message;
            }
            if (typeof value === 'object' && value !== null) {
                return JSON.stringify(value);
            }
            return String(value);
        });
        const formattedTime = `${formatTime(new Date())}:`;
        /**
         * If current log level is Debug or Verbose, print all channels with stack
         * trace via using writer.trace method to help identify the location of the
         * log.
         *
         * Exception is Error method, because it is already contains build-in
         * stack trace.
         */
        if (this.currentLevelValue >= levelMapStringToNum[es_LogLevel.Debug]
            && method !== es_LogMethod.Error) {
            this.printWithStackTrace(formattedTime, formattedArgs);
            return;
        }
        // Otherwise just print with requested method of writer.
        this.writer[method](formattedTime, ...formattedArgs);
    }
}



// EXTERNAL MODULE: ./node_modules/.pnpm/webextension-polyfill@0.12.0/node_modules/webextension-polyfill/dist/browser-polyfill.js
var browser_polyfill = __webpack_require__(3675);
var browser_polyfill_default = /*#__PURE__*/__webpack_require__.n(browser_polyfill);
;// CONCATENATED MODULE: ./src/background/browserApi/runtime.ts
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

/**
 * This function moved into separate api file, in order to hide unhandled promise errors
 * @param args
 */ const sendMessage = (...args)=>_async_to_generator(function*() {
        try {
            yield browser_polyfill_default().runtime.sendMessage(...args);
        } catch (e) {
        // ignore
        }
    })();
const getUrl = (url)=>browser.runtime.getURL(url);
const getManifest = ()=>{
    return browser_polyfill_default().runtime.getManifest();
};
const getPlatformInfo = ()=>_async_to_generator(function*() {
        return browser_polyfill_default().runtime.getPlatformInfo();
    })();
const getPlatformOs = ()=>_async_to_generator(function*() {
        const platformInfo = yield getPlatformInfo();
        return platformInfo.os;
    })();
const runtime = {
    sendMessage,
    getManifest,
    getPlatformInfo,
    getPlatformOs
};

;// CONCATENATED MODULE: ./src/background/browserApi/storage.ts
function storage_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function storage_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                storage_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                storage_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
class Storage {
    set(key, data) {
        return storage_async_to_generator(function*() {
            yield this.vault.set({
                [key]: data
            });
        }).call(this);
    }
    get(key) {
        return storage_async_to_generator(function*() {
            const value = yield this.vault.get([
                key
            ]);
            return value[key];
        }).call(this);
    }
    remove(key) {
        return storage_async_to_generator(function*() {
            yield this.vault.remove([
                key
            ]);
        }).call(this);
    }
    constructor(browser){
        this.vault = browser.storage.local;
    }
}

;// CONCATENATED MODULE: ./src/background/browserApi/index.ts



const browserApi = {
    runtime: runtime,
    storage: new Storage((browser_polyfill_default()))
};

// EXTERNAL MODULE: ./node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/throttle.js
var throttle = __webpack_require__(462);
var throttle_default = /*#__PURE__*/__webpack_require__.n(throttle);
;// CONCATENATED MODULE: ./src/common/notifier.ts
var notifier_NotifierType = /*#__PURE__*/ function(NotifierType) {
    NotifierType["SETTING_UPDATED"] = "event.update.setting.value";
    NotifierType["NON_ROUTABLE_DOMAIN_FOUND"] = "event.found.non.routable.domain";
    NotifierType["TOO_MANY_DEVICES_CONNECTED"] = "event.too.many.devices.connected";
    NotifierType["NON_ROUTABLE_DOMAIN_ADDED"] = "event.added.non.routable.domain";
    NotifierType["CREDENTIALS_UPDATED"] = "event.credentials.updated";
    NotifierType["USER_AUTHENTICATED"] = "event.authentication.authenticated";
    NotifierType["USER_DEAUTHENTICATED"] = "event.authentication.deauthenticated";
    NotifierType["TAB_UPDATED"] = "event.tab.updated";
    NotifierType["TAB_ACTIVATED"] = "event.tab.activated";
    NotifierType["EXCLUSIONS_UPDATED_BACK_MESSAGE"] = "event.exclusions.updated.back.message";
    NotifierType["EXCLUSIONS_DATA_UPDATED"] = "event.exclusions.data.updated";
    NotifierType["SHOULD_REFRESH_TOKENS"] = "event.should.refresh.tokens";
    NotifierType["DNS_SERVER_SET"] = "event.dns.server.set";
    NotifierType["UPDATE_BROWSER_ACTION_ICON"] = "event.update.browser.action.icon";
    NotifierType["SHOW_RATE_MODAL"] = "event.show.rate.modal";
    NotifierType["AUTH_CACHE_UPDATED"] = "event.auth.cache.updated";
    NotifierType["VPN_INFO_UPDATED"] = "event.vpn.info.updated";
    NotifierType["LOCATIONS_UPDATED"] = "event.locations.updated";
    NotifierType["LOCATION_STATE_UPDATED"] = "event.location.state.updated";
    NotifierType["CURRENT_LOCATION_UPDATED"] = "event.current.location.updated";
    NotifierType["PERMISSIONS_ERROR_UPDATE"] = "event.permission.error.update";
    NotifierType["TOKEN_PREMIUM_STATE_UPDATED"] = "event.token.premium.state.updated";
    NotifierType["TRAFFIC_STATS_UPDATED"] = "event.traffic.stats.updated";
    NotifierType["STATS_UPDATED"] = "event.stats.updated";
    // Connectivity state
    NotifierType["CONNECTIVITY_STATE_CHANGED"] = "event.connectivity.state.changed";
    // Language
    NotifierType["LANGUAGE_CHANGED"] = "event.language.changed";
    NotifierType["SERVER_ERROR"] = "server.error";
    // Background page connection events
    NotifierType["PORT_CONNECTED"] = "event.port.connected";
    NotifierType["PORT_DISCONNECTED"] = "event.port.disconnected";
    NotifierType["WEB_AUTH_FLOW_AUTHENTICATED"] = "event.web.auth.flow.authenticated";
    return NotifierType;
}({});
class Notifier {
    getListenerId() {
        const id = this.listenerId;
        this.listenerId += 1;
        return id.toString();
    }
    /**
     * Subscribes listener to the specified events and returns index of the listener
     *
     * @param events List of event types listener will be notified of
     * @param listener Listener object
     *
     * @returns Listener id.
     */ addSpecifiedListener(events, listener) {
        if (typeof listener !== 'function') {
            throw new Error('Illegal listener');
        }
        if (!Array.isArray(events)) {
            // eslint-disable-next-line no-param-reassign
            events = [
                events
            ];
        }
        const listenerId = this.getListenerId();
        this.listeners[listenerId] = listener;
        this.listenersEvents[listenerId] = events;
        return listenerId;
    }
    /**
     * Subscribes specified listener to all events and returns index of the listener
     *
     * @param listener Listener
     *
     * @returns Listener id.
     */ addListener(listener) {
        if (typeof listener !== 'function') {
            throw new Error('Illegal listener');
        }
        const listenerId = this.getListenerId();
        this.listeners[listenerId] = listener;
        return listenerId;
    }
    /**
     * Unsubscribe listener
     * @param listenerId Index of listener to unsubscribe
     */ removeListener(listenerId) {
        delete this.listeners[listenerId];
        delete this.listenersEvents[listenerId];
    }
    /**
     * Notifies listeners about the events passed as arguments of this function.
     */ notifyListeners(event, ...args) {
        if (!event || !(event in this.events)) {
            throw new Error(`Illegal event: ${event}`);
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const [listenerId, listener] of Object.entries(this.listeners)){
            const events = this.listenersEvents[listenerId];
            if (events && events.length > 0 && events.indexOf(event) < 0) {
                continue;
            }
            try {
                if (events && events.length > 1) {
                    // if listener was added for many events, notify with event title
                    listener.apply(listener, [
                        event,
                        ...args
                    ]);
                } else {
                    // otherwise, notify without event title
                    listener.apply(listener, args);
                }
            } catch (ex) {
                const message = `Error invoking listener for event: "${event}" cause: ${ex}`;
                throw new Error(message);
            }
        }
    }
    constructor(types){
        this.events = {};
        this.listeners = {};
        this.listenersEvents = {};
        this.listenerId = 0;
        this.types = types;
        Object.entries(this.types).forEach(([key, value])=>{
            this.events[value] = key;
        });
    }
}
const notifier = new Notifier(notifier_NotifierType);

;// CONCATENATED MODULE: ./node_modules/.pnpm/valibot@1.2.0_typescript@5.9.3/node_modules/valibot/dist/index.mjs
//#region src/storages/globalConfig/globalConfig.ts
let store$4;
/**
* Sets the global configuration.
*
* @param config The configuration.
*/
function setGlobalConfig(config$1) {
	store$4 = {
		...store$4,
		...config$1
	};
}
/**
* Returns the global configuration.
*
* @param config The config to merge.
*
* @returns The configuration.
*/
/* @__NO_SIDE_EFFECTS__ */
function getGlobalConfig(config$1) {
	return {
		lang: config$1?.lang ?? store$4?.lang,
		message: config$1?.message,
		abortEarly: config$1?.abortEarly ?? store$4?.abortEarly,
		abortPipeEarly: config$1?.abortPipeEarly ?? store$4?.abortPipeEarly
	};
}
/**
* Deletes the global configuration.
*/
function deleteGlobalConfig() {
	store$4 = void 0;
}

//#endregion
//#region src/storages/globalMessage/globalMessage.ts
let store$3;
/**
* Sets a global error message.
*
* @param message The error message.
* @param lang The language of the message.
*/
function setGlobalMessage(message$1, lang) {
	if (!store$3) store$3 = /* @__PURE__ */ new Map();
	store$3.set(lang, message$1);
}
/**
* Returns a global error message.
*
* @param lang The language of the message.
*
* @returns The error message.
*/
/* @__NO_SIDE_EFFECTS__ */
function getGlobalMessage(lang) {
	return store$3?.get(lang);
}
/**
* Deletes a global error message.
*
* @param lang The language of the message.
*/
function deleteGlobalMessage(lang) {
	store$3?.delete(lang);
}

//#endregion
//#region src/storages/schemaMessage/schemaMessage.ts
let store$2;
/**
* Sets a schema error message.
*
* @param message The error message.
* @param lang The language of the message.
*/
function setSchemaMessage(message$1, lang) {
	if (!store$2) store$2 = /* @__PURE__ */ new Map();
	store$2.set(lang, message$1);
}
/**
* Returns a schema error message.
*
* @param lang The language of the message.
*
* @returns The error message.
*/
/* @__NO_SIDE_EFFECTS__ */
function getSchemaMessage(lang) {
	return store$2?.get(lang);
}
/**
* Deletes a schema error message.
*
* @param lang The language of the message.
*/
function deleteSchemaMessage(lang) {
	store$2?.delete(lang);
}

//#endregion
//#region src/storages/specificMessage/specificMessage.ts
let store$1;
/**
* Sets a specific error message.
*
* @param reference The identifier reference.
* @param message The error message.
* @param lang The language of the message.
*/
function setSpecificMessage(reference, message$1, lang) {
	if (!store$1) store$1 = /* @__PURE__ */ new Map();
	if (!store$1.get(reference)) store$1.set(reference, /* @__PURE__ */ new Map());
	store$1.get(reference).set(lang, message$1);
}
/**
* Returns a specific error message.
*
* @param reference The identifier reference.
* @param lang The language of the message.
*
* @returns The error message.
*/
/* @__NO_SIDE_EFFECTS__ */
function getSpecificMessage(reference, lang) {
	return store$1?.get(reference)?.get(lang);
}
/**
* Deletes a specific error message.
*
* @param reference The identifier reference.
* @param lang The language of the message.
*/
function deleteSpecificMessage(reference, lang) {
	store$1?.get(reference)?.delete(lang);
}

//#endregion
//#region src/utils/_stringify/_stringify.ts
/**
* Stringifies an unknown input to a literal or type string.
*
* @param input The unknown input.
*
* @returns A literal or type string.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _stringify(input) {
	const type = typeof input;
	if (type === "string") return `"${input}"`;
	if (type === "number" || type === "bigint" || type === "boolean") return `${input}`;
	if (type === "object" || type === "function") return (input && Object.getPrototypeOf(input)?.constructor?.name) ?? "null";
	return type;
}

//#endregion
//#region src/utils/_addIssue/_addIssue.ts
/**
* Adds an issue to the dataset.
*
* @param context The issue context.
* @param label The issue label.
* @param dataset The input dataset.
* @param config The configuration.
* @param other The optional props.
*
* @internal
*/
function _addIssue(context, label, dataset, config$1, other) {
	const input = other && "input" in other ? other.input : dataset.value;
	const expected = other?.expected ?? context.expects ?? null;
	const received = other?.received ?? /* @__PURE__ */ _stringify(input);
	const issue = {
		kind: context.kind,
		type: context.type,
		input,
		expected,
		received,
		message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
		requirement: context.requirement,
		path: other?.path,
		issues: other?.issues,
		lang: config$1.lang,
		abortEarly: config$1.abortEarly,
		abortPipeEarly: config$1.abortPipeEarly
	};
	const isSchema = context.kind === "schema";
	const message$1 = other?.message ?? context.message ?? /* @__PURE__ */ getSpecificMessage(context.reference, issue.lang) ?? (isSchema ? /* @__PURE__ */ getSchemaMessage(issue.lang) : null) ?? config$1.message ?? /* @__PURE__ */ getGlobalMessage(issue.lang);
	if (message$1 !== void 0) issue.message = typeof message$1 === "function" ? message$1(issue) : message$1;
	if (isSchema) dataset.typed = false;
	if (dataset.issues) dataset.issues.push(issue);
	else dataset.issues = [issue];
}

//#endregion
//#region src/utils/_getByteCount/_getByteCount.ts
let textEncoder;
/**
* Returns the byte count of the input.
*
* @param input The input to be measured.
*
* @returns The byte count.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _getByteCount(input) {
	if (!textEncoder) textEncoder = new TextEncoder();
	return textEncoder.encode(input).length;
}

//#endregion
//#region src/utils/_getGraphemeCount/_getGraphemeCount.ts
let segmenter;
/**
* Returns the grapheme count of the input.
*
* @param input The input to be measured.
*
* @returns The grapheme count.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _getGraphemeCount(input) {
	if (!segmenter) segmenter = new Intl.Segmenter();
	const segments = segmenter.segment(input);
	let count = 0;
	for (const _ of segments) count++;
	return count;
}

//#endregion
//#region src/utils/_getLastMetadata/_getLastMetadata.ts
/**
* Returns the last top-level value of a given metadata type from a schema
* using a breadth-first search that starts with the last item in the pipeline.
*
* @param schema The schema to search.
* @param type The metadata type.
*
* @returns The value, if any.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _getLastMetadata(schema, type) {
	if ("pipe" in schema) {
		const nestedSchemas = [];
		for (let index = schema.pipe.length - 1; index >= 0; index--) {
			const item = schema.pipe[index];
			if (item.kind === "schema" && "pipe" in item) nestedSchemas.push(item);
			else if (item.kind === "metadata" && item.type === type) return item[type];
		}
		for (const nestedSchema of nestedSchemas) {
			const result = /* @__PURE__ */ _getLastMetadata(nestedSchema, type);
			if (result !== void 0) return result;
		}
	}
}

//#endregion
//#region src/utils/_getStandardProps/_getStandardProps.ts
/**
* Returns the Standard Schema properties.
*
* @param context The schema context.
*
* @returns The Standard Schema properties.
*/
/* @__NO_SIDE_EFFECTS__ */
function _getStandardProps(context) {
	return {
		version: 1,
		vendor: "valibot",
		validate(value$1) {
			return context["~run"]({ value: value$1 }, /* @__PURE__ */ getGlobalConfig());
		}
	};
}

//#endregion
//#region src/utils/_getWordCount/_getWordCount.ts
let store;
/**
* Returns the word count of the input.
*
* @param locales The locales to be used.
* @param input The input to be measured.
*
* @returns The word count.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _getWordCount(locales, input) {
	if (!store) store = /* @__PURE__ */ new Map();
	if (!store.get(locales)) store.set(locales, new Intl.Segmenter(locales, { granularity: "word" }));
	const segments = store.get(locales).segment(input);
	let count = 0;
	for (const segment of segments) if (segment.isWordLike) count++;
	return count;
}

//#endregion
//#region src/utils/_isLuhnAlgo/_isLuhnAlgo.ts
/**
* Non-digit regex.
*/
const NON_DIGIT_REGEX = /\D/gu;
/**
* Checks whether a string with numbers corresponds to the luhn algorithm.
*
* @param input The input to be checked.
*
* @returns Whether input is valid.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _isLuhnAlgo(input) {
	const number$1 = input.replace(NON_DIGIT_REGEX, "");
	let length$1 = number$1.length;
	let bit = 1;
	let sum = 0;
	while (length$1) {
		const value$1 = +number$1[--length$1];
		bit ^= 1;
		sum += bit ? [
			0,
			2,
			4,
			6,
			8,
			1,
			3,
			5,
			7,
			9
		][value$1] : value$1;
	}
	return sum % 10 === 0;
}

//#endregion
//#region src/utils/_isValidObjectKey/_isValidObjectKey.ts
/**
* Disallows inherited object properties and prevents object prototype
* pollution by disallowing certain keys.
*
* @param object The object to check.
* @param key The key to check.
*
* @returns Whether the key is allowed.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _isValidObjectKey(object$1, key) {
	return Object.hasOwn(object$1, key) && key !== "__proto__" && key !== "prototype" && key !== "constructor";
}

//#endregion
//#region src/utils/_joinExpects/_joinExpects.ts
/**
* Joins multiple `expects` values with the given separator.
*
* @param values The `expects` values.
* @param separator The separator.
*
* @returns The joined `expects` property.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _joinExpects(values$1, separator) {
	const list = [...new Set(values$1)];
	if (list.length > 1) return `(${list.join(` ${separator} `)})`;
	return list[0] ?? "never";
}

//#endregion
//#region src/utils/entriesFromList/entriesFromList.ts
/**
* Creates an object entries definition from a list of keys and a schema.
*
* @param list A list of keys.
* @param schema The schema of the keys.
*
* @returns The object entries.
*/
/* @__NO_SIDE_EFFECTS__ */
function entriesFromList(list, schema) {
	const entries$1 = {};
	for (const key of list) entries$1[key] = schema;
	return entries$1;
}

//#endregion
//#region src/utils/entriesFromObjects/entriesFromObjects.ts
/* @__NO_SIDE_EFFECTS__ */
function entriesFromObjects(schemas) {
	const entries$1 = {};
	for (const schema of schemas) Object.assign(entries$1, schema.entries);
	return entries$1;
}

//#endregion
//#region src/utils/getDotPath/getDotPath.ts
/* @__NO_SIDE_EFFECTS__ */
function getDotPath(issue) {
	if (issue.path) {
		let key = "";
		for (const item of issue.path) if (typeof item.key === "string" || typeof item.key === "number") if (key) key += `.${item.key}`;
		else key += item.key;
		else return null;
		return key;
	}
	return null;
}

//#endregion
//#region src/utils/isOfKind/isOfKind.ts
/**
* A generic type guard to check the kind of an object.
*
* @param kind The kind to check for.
* @param object The object to check.
*
* @returns Whether it matches.
*/
/* @__NO_SIDE_EFFECTS__ */
function isOfKind(kind, object$1) {
	return object$1.kind === kind;
}

//#endregion
//#region src/utils/isOfType/isOfType.ts
/**
* A generic type guard to check the type of an object.
*
* @param type The type to check for.
* @param object The object to check.
*
* @returns Whether it matches.
*/
/* @__NO_SIDE_EFFECTS__ */
function isOfType(type, object$1) {
	return object$1.type === type;
}

//#endregion
//#region src/utils/isValiError/isValiError.ts
/**
* A type guard to check if an error is a ValiError.
*
* @param error The error to check.
*
* @returns Whether its a ValiError.
*/
/* @__NO_SIDE_EFFECTS__ */
function isValiError(error) {
	return error instanceof ValiError;
}

//#endregion
//#region src/utils/ValiError/ValiError.ts
/**
* A Valibot error with useful information.
*/
var ValiError = class extends Error {
	/**
	* Creates a Valibot error with useful information.
	*
	* @param issues The error issues.
	*/
	constructor(issues) {
		super(issues[0].message);
		this.name = "ValiError";
		this.issues = issues;
	}
};

//#endregion
//#region src/actions/args/args.ts
/* @__NO_SIDE_EFFECTS__ */
function dist_args(schema) {
	return {
		kind: "transformation",
		type: "args",
		reference: dist_args,
		async: false,
		schema,
		"~run"(dataset, config$1) {
			const func = dataset.value;
			dataset.value = (...args_) => {
				const argsDataset = this.schema["~run"]({ value: args_ }, config$1);
				if (argsDataset.issues) throw new ValiError(argsDataset.issues);
				return func(...argsDataset.value);
			};
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/args/argsAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function argsAsync(schema) {
	return {
		kind: "transformation",
		type: "args",
		reference: argsAsync,
		async: false,
		schema,
		"~run"(dataset, config$1) {
			const func = dataset.value;
			dataset.value = async (...args$1) => {
				const argsDataset = await schema["~run"]({ value: args$1 }, config$1);
				if (argsDataset.issues) throw new ValiError(argsDataset.issues);
				return func(...argsDataset.value);
			};
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/await/awaitAsync.ts
/**
* Creates an await transformation action.
*
* @returns An await action.
*/
/* @__NO_SIDE_EFFECTS__ */
function awaitAsync() {
	return {
		kind: "transformation",
		type: "await",
		reference: awaitAsync,
		async: true,
		async "~run"(dataset) {
			dataset.value = await dataset.value;
			return dataset;
		}
	};
}

//#endregion
//#region src/regex.ts
/**
* [Base64](https://en.wikipedia.org/wiki/Base64) regex.
*/
const BASE64_REGEX = /^(?:[\da-z+/]{4})*(?:[\da-z+/]{2}==|[\da-z+/]{3}=)?$/iu;
/**
* [BIC](https://en.wikipedia.org/wiki/ISO_9362) regex.
*/
const BIC_REGEX = /^[A-Z]{6}(?!00)[\dA-Z]{2}(?:[\dA-Z]{3})?$/u;
/**
* [Cuid2](https://github.com/paralleldrive/cuid2) regex.
*/
const CUID2_REGEX = /^[a-z][\da-z]*$/u;
/**
* [Decimal](https://en.wikipedia.org/wiki/Decimal) regex.
*/
const DECIMAL_REGEX = /^[+-]?(?:\d*\.)?\d+$/u;
/**
* [Digits](https://en.wikipedia.org/wiki/Numerical_digit) regex.
*/
const DIGITS_REGEX = /^\d+$/u;
/**
* [Email address](https://en.wikipedia.org/wiki/Email_address) regex.
*/
const EMAIL_REGEX = /^[\w+-]+(?:\.[\w+-]+)*@[\da-z]+(?:[.-][\da-z]+)*\.[a-z]{2,}$/iu;
/**
* Emoji regex from [emoji-regex-xs](https://github.com/slevithan/emoji-regex-xs) v1.0.0 (MIT license).
*
* Hint: We decided against the newer `/^\p{RGI_Emoji}+$/v` regex because it is
* not supported in older runtimes and does not match all emoji.
*/
const EMOJI_REGEX = /^(?:[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|(?![\p{Emoji_Modifier_Base}\u{1F1E6}-\u{1F1FF}])\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|(?![\p{Emoji_Modifier_Base}\u{1F1E6}-\u{1F1FF}])\p{Emoji_Presentation}))*)+$/u;
/**
* [Hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) regex.
*
* Hint: We decided against the `i` flag for better JSON Schema compatibility.
*/
const HEXADECIMAL_REGEX = /^(?:0[hx])?[\da-fA-F]+$/u;
/**
* [Hex color](https://en.wikipedia.org/wiki/Web_colors#Hex_triplet) regex.
*
* Hint: We decided against the `i` flag for better JSON Schema compatibility.
*/
const HEX_COLOR_REGEX = /^#(?:[\da-fA-F]{3,4}|[\da-fA-F]{6}|[\da-fA-F]{8})$/u;
/**
* [IMEI](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity) regex.
*/
const IMEI_REGEX = /^\d{15}$|^\d{2}-\d{6}-\d{6}-\d$/u;
/**
* [IPv4](https://en.wikipedia.org/wiki/IPv4) regex.
*/
const IPV4_REGEX = /^(?:(?:[1-9]|1\d|2[0-4])?\d|25[0-5])(?:\.(?:(?:[1-9]|1\d|2[0-4])?\d|25[0-5])){3}$/u;
/**
* [IPv6](https://en.wikipedia.org/wiki/IPv6) regex.
*/
const IPV6_REGEX = /^(?:(?:[\da-f]{1,4}:){7}[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,7}:|(?:[\da-f]{1,4}:){1,6}:[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,5}(?::[\da-f]{1,4}){1,2}|(?:[\da-f]{1,4}:){1,4}(?::[\da-f]{1,4}){1,3}|(?:[\da-f]{1,4}:){1,3}(?::[\da-f]{1,4}){1,4}|(?:[\da-f]{1,4}:){1,2}(?::[\da-f]{1,4}){1,5}|[\da-f]{1,4}:(?::[\da-f]{1,4}){1,6}|:(?:(?::[\da-f]{1,4}){1,7}|:)|fe80:(?::[\da-f]{0,4}){0,4}%[\da-z]+|::(?:f{4}(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d)|(?:[\da-f]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d))$/iu;
/**
* [IP](https://en.wikipedia.org/wiki/IP_address) regex.
*/
const IP_REGEX = /^(?:(?:[1-9]|1\d|2[0-4])?\d|25[0-5])(?:\.(?:(?:[1-9]|1\d|2[0-4])?\d|25[0-5])){3}$|^(?:(?:[\da-f]{1,4}:){7}[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,7}:|(?:[\da-f]{1,4}:){1,6}:[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,5}(?::[\da-f]{1,4}){1,2}|(?:[\da-f]{1,4}:){1,4}(?::[\da-f]{1,4}){1,3}|(?:[\da-f]{1,4}:){1,3}(?::[\da-f]{1,4}){1,4}|(?:[\da-f]{1,4}:){1,2}(?::[\da-f]{1,4}){1,5}|[\da-f]{1,4}:(?::[\da-f]{1,4}){1,6}|:(?:(?::[\da-f]{1,4}){1,7}|:)|fe80:(?::[\da-f]{0,4}){0,4}%[\da-z]+|::(?:f{4}(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d)|(?:[\da-f]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d))$/iu;
/**
* [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date regex.
*/
const ISO_DATE_REGEX = /^\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])$/u;
/**
* [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date-time regex.
*/
const ISO_DATE_TIME_REGEX = /^\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])[T ](?:0\d|1\d|2[0-3]):[0-5]\d$/u;
/**
* [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) time regex.
*/
const ISO_TIME_REGEX = /^(?:0\d|1\d|2[0-3]):[0-5]\d$/u;
/**
* [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) time with seconds regex.
*/
const ISO_TIME_SECOND_REGEX = /^(?:0\d|1\d|2[0-3])(?::[0-5]\d){2}$/u;
/**
* [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp regex.
*/
const ISO_TIMESTAMP_REGEX = /^\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])[T ](?:0\d|1\d|2[0-3])(?::[0-5]\d){2}(?:\.\d{1,9})?(?:Z|[+-](?:0\d|1\d|2[0-3])(?::?[0-5]\d)?)$/u;
/**
* [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) week regex.
*/
const ISO_WEEK_REGEX = /^\d{4}-W(?:0[1-9]|[1-4]\d|5[0-3])$/u;
/**
* [MAC](https://en.wikipedia.org/wiki/MAC_address) 48 bit regex.
*/
const MAC48_REGEX = /^(?:[\da-f]{2}:){5}[\da-f]{2}$|^(?:[\da-f]{2}-){5}[\da-f]{2}$|^(?:[\da-f]{4}\.){2}[\da-f]{4}$/iu;
/**
* [MAC](https://en.wikipedia.org/wiki/MAC_address) 64 bit regex.
*/
const MAC64_REGEX = /^(?:[\da-f]{2}:){7}[\da-f]{2}$|^(?:[\da-f]{2}-){7}[\da-f]{2}$|^(?:[\da-f]{4}\.){3}[\da-f]{4}$|^(?:[\da-f]{4}:){3}[\da-f]{4}$/iu;
/**
* [MAC](https://en.wikipedia.org/wiki/MAC_address) regex.
*/
const MAC_REGEX = /^(?:[\da-f]{2}:){5}[\da-f]{2}$|^(?:[\da-f]{2}-){5}[\da-f]{2}$|^(?:[\da-f]{4}\.){2}[\da-f]{4}$|^(?:[\da-f]{2}:){7}[\da-f]{2}$|^(?:[\da-f]{2}-){7}[\da-f]{2}$|^(?:[\da-f]{4}\.){3}[\da-f]{4}$|^(?:[\da-f]{4}:){3}[\da-f]{4}$/iu;
/**
* [Nano ID](https://github.com/ai/nanoid) regex.
*/
const NANO_ID_REGEX = /^[\w-]+$/u;
/**
* [Octal](https://en.wikipedia.org/wiki/Octal) regex.
*/
const OCTAL_REGEX = /^(?:0o)?[0-7]+$/u;
/**
* [RFC 5322 email address](https://datatracker.ietf.org/doc/html/rfc5322#section-3.4.1) regex.
*
* Hint: This regex was taken from the [HTML Living Standard Specification](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) and does not perfectly represent RFC 5322.
*/
const RFC_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
/**
* [Slug](https://en.wikipedia.org/wiki/Clean_URL#Slug) regex.
*/
const SLUG_REGEX = /^[\da-z]+(?:[-_][\da-z]+)*$/u;
/**
* [ULID](https://github.com/ulid/spec) regex.
*
* Hint: We decided against the `i` flag for better JSON Schema compatibility.
*/
const ULID_REGEX = /^[\da-hjkmnp-tv-zA-HJKMNP-TV-Z]{26}$/u;
/**
* [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) regex.
*/
const UUID_REGEX = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/iu;

//#endregion
//#region src/actions/base64/base64.ts
/* @__NO_SIDE_EFFECTS__ */
function base64(message$1) {
	return {
		kind: "validation",
		type: "base64",
		reference: base64,
		async: false,
		expects: null,
		requirement: BASE64_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "Base64", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/bic/bic.ts
/* @__NO_SIDE_EFFECTS__ */
function bic(message$1) {
	return {
		kind: "validation",
		type: "bic",
		reference: bic,
		async: false,
		expects: null,
		requirement: BIC_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "BIC", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/brand/brand.ts
/**
* Creates a brand transformation action.
*
* @param name The brand name.
*
* @returns A brand action.
*/
/* @__NO_SIDE_EFFECTS__ */
function brand(name) {
	return {
		kind: "transformation",
		type: "brand",
		reference: brand,
		async: false,
		name,
		"~run"(dataset) {
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/bytes/bytes.ts
/* @__NO_SIDE_EFFECTS__ */
function bytes(requirement, message$1) {
	return {
		kind: "validation",
		type: "bytes",
		reference: bytes,
		async: false,
		expects: `${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed) {
				const length$1 = /* @__PURE__ */ _getByteCount(dataset.value);
				if (length$1 !== this.requirement) _addIssue(this, "bytes", dataset, config$1, { received: `${length$1}` });
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/check/check.ts
/* @__NO_SIDE_EFFECTS__ */
function check(requirement, message$1) {
	return {
		kind: "validation",
		type: "check",
		reference: check,
		async: false,
		expects: null,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "input", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/check/checkAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function checkAsync(requirement, message$1) {
	return {
		kind: "validation",
		type: "check",
		reference: checkAsync,
		async: true,
		expects: null,
		requirement,
		message: message$1,
		async "~run"(dataset, config$1) {
			if (dataset.typed && !await this.requirement(dataset.value)) _addIssue(this, "input", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/checkItems/checkItems.ts
/* @__NO_SIDE_EFFECTS__ */
function checkItems(requirement, message$1) {
	return {
		kind: "validation",
		type: "check_items",
		reference: checkItems,
		async: false,
		expects: null,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed) for (let index = 0; index < dataset.value.length; index++) {
				const item = dataset.value[index];
				if (!this.requirement(item, index, dataset.value)) _addIssue(this, "item", dataset, config$1, {
					input: item,
					path: [{
						type: "array",
						origin: "value",
						input: dataset.value,
						key: index,
						value: item
					}]
				});
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/checkItems/checkItemsAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function checkItemsAsync(requirement, message$1) {
	return {
		kind: "validation",
		type: "check_items",
		reference: checkItemsAsync,
		async: true,
		expects: null,
		requirement,
		message: message$1,
		async "~run"(dataset, config$1) {
			if (dataset.typed) {
				const requirementResults = await Promise.all(dataset.value.map(this.requirement));
				for (let index = 0; index < dataset.value.length; index++) if (!requirementResults[index]) {
					const item = dataset.value[index];
					_addIssue(this, "item", dataset, config$1, {
						input: item,
						path: [{
							type: "array",
							origin: "value",
							input: dataset.value,
							key: index,
							value: item
						}]
					});
				}
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/creditCard/creditCard.ts
/**
* Credit card regex.
*/
const CREDIT_CARD_REGEX = /^(?:\d{14,19}|\d{4}(?: \d{3,6}){2,4}|\d{4}(?:-\d{3,6}){2,4})$/u;
/**
* Sanitize regex.
*/
const SANITIZE_REGEX = /[- ]/gu;
/**
* Provider regex list.
*/
const PROVIDER_REGEX_LIST = (/* unused pure expression or super */ null && ([
	/^3[47]\d{13}$/u,
	/^3(?:0[0-5]|[68]\d)\d{11,13}$/u,
	/^6(?:011|5\d{2})\d{12,15}$/u,
	/^(?:2131|1800|35\d{3})\d{11}$/u,
	/^5[1-5]\d{2}|(?:222\d|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}$/u,
	/^(?:6[27]\d{14,17}|81\d{14,17})$/u,
	/^4\d{12}(?:\d{3,6})?$/u
]));
/* @__NO_SIDE_EFFECTS__ */
function creditCard(message$1) {
	return {
		kind: "validation",
		type: "credit_card",
		reference: creditCard,
		async: false,
		expects: null,
		requirement(input) {
			let sanitized;
			return CREDIT_CARD_REGEX.test(input) && (sanitized = input.replace(SANITIZE_REGEX, "")) && PROVIDER_REGEX_LIST.some((regex$1) => regex$1.test(sanitized)) && /* @__PURE__ */ _isLuhnAlgo(sanitized);
		},
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "credit card", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/cuid2/cuid2.ts
/* @__NO_SIDE_EFFECTS__ */
function cuid2(message$1) {
	return {
		kind: "validation",
		type: "cuid2",
		reference: cuid2,
		async: false,
		expects: null,
		requirement: CUID2_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "Cuid2", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/decimal/decimal.ts
/* @__NO_SIDE_EFFECTS__ */
function decimal(message$1) {
	return {
		kind: "validation",
		type: "decimal",
		reference: decimal,
		async: false,
		expects: null,
		requirement: DECIMAL_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "decimal", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/description/description.ts
/**
* Creates a description metadata action.
*
* @param description_ The description text.
*
* @returns A description action.
*/
/* @__NO_SIDE_EFFECTS__ */
function description(description_) {
	return {
		kind: "metadata",
		type: "description",
		reference: description,
		description: description_
	};
}

//#endregion
//#region src/actions/digits/digits.ts
/* @__NO_SIDE_EFFECTS__ */
function digits(message$1) {
	return {
		kind: "validation",
		type: "digits",
		reference: digits,
		async: false,
		expects: null,
		requirement: DIGITS_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "digits", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/email/email.ts
/* @__NO_SIDE_EFFECTS__ */
function email(message$1) {
	return {
		kind: "validation",
		type: "email",
		reference: email,
		expects: null,
		async: false,
		requirement: EMAIL_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "email", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/emoji/emoji.ts
/* @__NO_SIDE_EFFECTS__ */
function emoji(message$1) {
	return {
		kind: "validation",
		type: "emoji",
		reference: emoji,
		async: false,
		expects: null,
		requirement: EMOJI_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "emoji", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/empty/empty.ts
/* @__NO_SIDE_EFFECTS__ */
function empty(message$1) {
	return {
		kind: "validation",
		type: "empty",
		reference: empty,
		async: false,
		expects: "0",
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.length > 0) _addIssue(this, "length", dataset, config$1, { received: `${dataset.value.length}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/endsWith/endsWith.ts
/* @__NO_SIDE_EFFECTS__ */
function endsWith(requirement, message$1) {
	return {
		kind: "validation",
		type: "ends_with",
		reference: endsWith,
		async: false,
		expects: `"${requirement}"`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !dataset.value.endsWith(this.requirement)) _addIssue(this, "end", dataset, config$1, { received: `"${dataset.value.slice(-this.requirement.length)}"` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/entries/entries.ts
/* @__NO_SIDE_EFFECTS__ */
function entries(requirement, message$1) {
	return {
		kind: "validation",
		type: "entries",
		reference: entries,
		async: false,
		expects: `${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (!dataset.typed) return dataset;
			const count = Object.keys(dataset.value).length;
			if (dataset.typed && count !== this.requirement) _addIssue(this, "entries", dataset, config$1, { received: `${count}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/everyItem/everyItem.ts
/* @__NO_SIDE_EFFECTS__ */
function everyItem(requirement, message$1) {
	return {
		kind: "validation",
		type: "every_item",
		reference: everyItem,
		async: false,
		expects: null,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !dataset.value.every(this.requirement)) _addIssue(this, "item", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/examples/examples.ts
/**
* Creates an examples metadata action.
*
* @param examples_ The examples.
*
* @returns An examples action.
*
* @beta
*/
/* @__NO_SIDE_EFFECTS__ */
function examples(examples_) {
	return {
		kind: "metadata",
		type: "examples",
		reference: examples,
		examples: examples_
	};
}

//#endregion
//#region src/actions/excludes/excludes.ts
/* @__NO_SIDE_EFFECTS__ */
function excludes(requirement, message$1) {
	const received = /* @__PURE__ */ _stringify(requirement);
	return {
		kind: "validation",
		type: "excludes",
		reference: excludes,
		async: false,
		expects: `!${received}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.includes(this.requirement)) _addIssue(this, "content", dataset, config$1, { received });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/filterItems/filterItems.ts
/* @__NO_SIDE_EFFECTS__ */
function filterItems(operation) {
	return {
		kind: "transformation",
		type: "filter_items",
		reference: filterItems,
		async: false,
		operation,
		"~run"(dataset) {
			dataset.value = dataset.value.filter(this.operation);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/findItem/findItem.ts
/* @__NO_SIDE_EFFECTS__ */
function findItem(operation) {
	return {
		kind: "transformation",
		type: "find_item",
		reference: findItem,
		async: false,
		operation,
		"~run"(dataset) {
			dataset.value = dataset.value.find(this.operation);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/finite/finite.ts
/* @__NO_SIDE_EFFECTS__ */
function finite(message$1) {
	return {
		kind: "validation",
		type: "finite",
		reference: finite,
		async: false,
		expects: null,
		requirement: Number.isFinite,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "finite", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/flavor/flavor.ts
/**
* Creates a flavor transformation action.
*
* @param name The flavor name.
*
* @returns A flavor action.
*
* @beta
*/
/* @__NO_SIDE_EFFECTS__ */
function flavor(name) {
	return {
		kind: "transformation",
		type: "flavor",
		reference: flavor,
		async: false,
		name,
		"~run"(dataset) {
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/graphemes/graphemes.ts
/* @__NO_SIDE_EFFECTS__ */
function graphemes(requirement, message$1) {
	return {
		kind: "validation",
		type: "graphemes",
		reference: graphemes,
		async: false,
		expects: `${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed) {
				const count = /* @__PURE__ */ _getGraphemeCount(dataset.value);
				if (count !== this.requirement) _addIssue(this, "graphemes", dataset, config$1, { received: `${count}` });
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/gtValue/gtValue.ts
/* @__NO_SIDE_EFFECTS__ */
function gtValue(requirement, message$1) {
	return {
		kind: "validation",
		type: "gt_value",
		reference: gtValue,
		async: false,
		expects: `>${requirement instanceof Date ? requirement.toJSON() : /* @__PURE__ */ _stringify(requirement)}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !(dataset.value > this.requirement)) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/hash/hash.ts
/**
* Hash lengths object.
*/
const HASH_LENGTHS = (/* unused pure expression or super */ null && ({
	md4: 32,
	md5: 32,
	sha1: 40,
	sha256: 64,
	sha384: 96,
	sha512: 128,
	ripemd128: 32,
	ripemd160: 40,
	tiger128: 32,
	tiger160: 40,
	tiger192: 48,
	crc32: 8,
	crc32b: 8,
	adler32: 8
}));
/* @__NO_SIDE_EFFECTS__ */
function hash(types, message$1) {
	return {
		kind: "validation",
		type: "hash",
		reference: hash,
		expects: null,
		async: false,
		requirement: RegExp(types.map((type) => `^[a-f0-9]{${HASH_LENGTHS[type]}}$`).join("|"), "iu"),
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "hash", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/hexadecimal/hexadecimal.ts
/* @__NO_SIDE_EFFECTS__ */
function hexadecimal(message$1) {
	return {
		kind: "validation",
		type: "hexadecimal",
		reference: hexadecimal,
		async: false,
		expects: null,
		requirement: HEXADECIMAL_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "hexadecimal", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/hexColor/hexColor.ts
/* @__NO_SIDE_EFFECTS__ */
function hexColor(message$1) {
	return {
		kind: "validation",
		type: "hex_color",
		reference: hexColor,
		async: false,
		expects: null,
		requirement: HEX_COLOR_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "hex color", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/imei/imei.ts
/* @__NO_SIDE_EFFECTS__ */
function imei(message$1) {
	return {
		kind: "validation",
		type: "imei",
		reference: imei,
		async: false,
		expects: null,
		requirement(input) {
			return IMEI_REGEX.test(input) && /* @__PURE__ */ _isLuhnAlgo(input);
		},
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "IMEI", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/includes/includes.ts
/* @__NO_SIDE_EFFECTS__ */
function includes(requirement, message$1) {
	const expects = /* @__PURE__ */ _stringify(requirement);
	return {
		kind: "validation",
		type: "includes",
		reference: includes,
		async: false,
		expects,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !dataset.value.includes(this.requirement)) _addIssue(this, "content", dataset, config$1, { received: `!${expects}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/integer/integer.ts
/* @__NO_SIDE_EFFECTS__ */
function integer(message$1) {
	return {
		kind: "validation",
		type: "integer",
		reference: integer,
		async: false,
		expects: null,
		requirement: Number.isInteger,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "integer", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/ip/ip.ts
/* @__NO_SIDE_EFFECTS__ */
function ip(message$1) {
	return {
		kind: "validation",
		type: "ip",
		reference: ip,
		async: false,
		expects: null,
		requirement: IP_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "IP", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/ipv4/ipv4.ts
/* @__NO_SIDE_EFFECTS__ */
function ipv4(message$1) {
	return {
		kind: "validation",
		type: "ipv4",
		reference: ipv4,
		async: false,
		expects: null,
		requirement: IPV4_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "IPv4", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/ipv6/ipv6.ts
/* @__NO_SIDE_EFFECTS__ */
function ipv6(message$1) {
	return {
		kind: "validation",
		type: "ipv6",
		reference: ipv6,
		async: false,
		expects: null,
		requirement: IPV6_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "IPv6", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/isoDate/isoDate.ts
/* @__NO_SIDE_EFFECTS__ */
function isoDate(message$1) {
	return {
		kind: "validation",
		type: "iso_date",
		reference: isoDate,
		async: false,
		expects: null,
		requirement: ISO_DATE_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "date", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/isoDateTime/isoDateTime.ts
/* @__NO_SIDE_EFFECTS__ */
function isoDateTime(message$1) {
	return {
		kind: "validation",
		type: "iso_date_time",
		reference: isoDateTime,
		async: false,
		expects: null,
		requirement: ISO_DATE_TIME_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "date-time", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/isoTime/isoTime.ts
/* @__NO_SIDE_EFFECTS__ */
function isoTime(message$1) {
	return {
		kind: "validation",
		type: "iso_time",
		reference: isoTime,
		async: false,
		expects: null,
		requirement: ISO_TIME_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "time", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/isoTimeSecond/isoTimeSecond.ts
/* @__NO_SIDE_EFFECTS__ */
function isoTimeSecond(message$1) {
	return {
		kind: "validation",
		type: "iso_time_second",
		reference: isoTimeSecond,
		async: false,
		expects: null,
		requirement: ISO_TIME_SECOND_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "time-second", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/isoTimestamp/isoTimestamp.ts
/* @__NO_SIDE_EFFECTS__ */
function isoTimestamp(message$1) {
	return {
		kind: "validation",
		type: "iso_timestamp",
		reference: isoTimestamp,
		async: false,
		expects: null,
		requirement: ISO_TIMESTAMP_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "timestamp", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/isoWeek/isoWeek.ts
/* @__NO_SIDE_EFFECTS__ */
function isoWeek(message$1) {
	return {
		kind: "validation",
		type: "iso_week",
		reference: isoWeek,
		async: false,
		expects: null,
		requirement: ISO_WEEK_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "week", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/length/length.ts
/* @__NO_SIDE_EFFECTS__ */
function dist_length(requirement, message$1) {
	return {
		kind: "validation",
		type: "length",
		reference: dist_length,
		async: false,
		expects: `${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.length !== this.requirement) _addIssue(this, "length", dataset, config$1, { received: `${dataset.value.length}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/ltValue/ltValue.ts
/* @__NO_SIDE_EFFECTS__ */
function ltValue(requirement, message$1) {
	return {
		kind: "validation",
		type: "lt_value",
		reference: ltValue,
		async: false,
		expects: `<${requirement instanceof Date ? requirement.toJSON() : /* @__PURE__ */ _stringify(requirement)}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !(dataset.value < this.requirement)) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/mac/mac.ts
/* @__NO_SIDE_EFFECTS__ */
function mac(message$1) {
	return {
		kind: "validation",
		type: "mac",
		reference: mac,
		async: false,
		expects: null,
		requirement: MAC_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "MAC", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/mac48/mac48.ts
/* @__NO_SIDE_EFFECTS__ */
function mac48(message$1) {
	return {
		kind: "validation",
		type: "mac48",
		reference: mac48,
		async: false,
		expects: null,
		requirement: MAC48_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "48-bit MAC", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/mac64/mac64.ts
/* @__NO_SIDE_EFFECTS__ */
function mac64(message$1) {
	return {
		kind: "validation",
		type: "mac64",
		reference: mac64,
		async: false,
		expects: null,
		requirement: MAC64_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "64-bit MAC", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/mapItems/mapItems.ts
/* @__NO_SIDE_EFFECTS__ */
function mapItems(operation) {
	return {
		kind: "transformation",
		type: "map_items",
		reference: mapItems,
		async: false,
		operation,
		"~run"(dataset) {
			dataset.value = dataset.value.map(this.operation);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/maxBytes/maxBytes.ts
/* @__NO_SIDE_EFFECTS__ */
function maxBytes(requirement, message$1) {
	return {
		kind: "validation",
		type: "max_bytes",
		reference: maxBytes,
		async: false,
		expects: `<=${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed) {
				const length$1 = /* @__PURE__ */ _getByteCount(dataset.value);
				if (length$1 > this.requirement) _addIssue(this, "bytes", dataset, config$1, { received: `${length$1}` });
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/maxEntries/maxEntries.ts
/* @__NO_SIDE_EFFECTS__ */
function maxEntries(requirement, message$1) {
	return {
		kind: "validation",
		type: "max_entries",
		reference: maxEntries,
		async: false,
		expects: `<=${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (!dataset.typed) return dataset;
			const count = Object.keys(dataset.value).length;
			if (dataset.typed && count > this.requirement) _addIssue(this, "entries", dataset, config$1, { received: `${count}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/maxGraphemes/maxGraphemes.ts
/* @__NO_SIDE_EFFECTS__ */
function maxGraphemes(requirement, message$1) {
	return {
		kind: "validation",
		type: "max_graphemes",
		reference: maxGraphemes,
		async: false,
		expects: `<=${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed) {
				const count = /* @__PURE__ */ _getGraphemeCount(dataset.value);
				if (count > this.requirement) _addIssue(this, "graphemes", dataset, config$1, { received: `${count}` });
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/maxLength/maxLength.ts
/* @__NO_SIDE_EFFECTS__ */
function maxLength(requirement, message$1) {
	return {
		kind: "validation",
		type: "max_length",
		reference: maxLength,
		async: false,
		expects: `<=${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.length > this.requirement) _addIssue(this, "length", dataset, config$1, { received: `${dataset.value.length}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/maxSize/maxSize.ts
/* @__NO_SIDE_EFFECTS__ */
function maxSize(requirement, message$1) {
	return {
		kind: "validation",
		type: "max_size",
		reference: maxSize,
		async: false,
		expects: `<=${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.size > this.requirement) _addIssue(this, "size", dataset, config$1, { received: `${dataset.value.size}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/maxValue/maxValue.ts
/* @__NO_SIDE_EFFECTS__ */
function maxValue(requirement, message$1) {
	return {
		kind: "validation",
		type: "max_value",
		reference: maxValue,
		async: false,
		expects: `<=${requirement instanceof Date ? requirement.toJSON() : /* @__PURE__ */ _stringify(requirement)}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !(dataset.value <= this.requirement)) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/maxWords/maxWords.ts
/* @__NO_SIDE_EFFECTS__ */
function maxWords(locales, requirement, message$1) {
	return {
		kind: "validation",
		type: "max_words",
		reference: maxWords,
		async: false,
		expects: `<=${requirement}`,
		locales,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed) {
				const count = /* @__PURE__ */ _getWordCount(this.locales, dataset.value);
				if (count > this.requirement) _addIssue(this, "words", dataset, config$1, { received: `${count}` });
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/metadata/metadata.ts
/**
* Creates a custom metadata action.
*
* @param metadata_ The metadata object.
*
* @returns A metadata action.
*/
/* @__NO_SIDE_EFFECTS__ */
function metadata(metadata_) {
	return {
		kind: "metadata",
		type: "metadata",
		reference: metadata,
		metadata: metadata_
	};
}

//#endregion
//#region src/actions/mimeType/mimeType.ts
/* @__NO_SIDE_EFFECTS__ */
function mimeType(requirement, message$1) {
	return {
		kind: "validation",
		type: "mime_type",
		reference: mimeType,
		async: false,
		expects: /* @__PURE__ */ _joinExpects(requirement.map((option) => `"${option}"`), "|"),
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.includes(dataset.value.type)) _addIssue(this, "MIME type", dataset, config$1, { received: `"${dataset.value.type}"` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/minBytes/minBytes.ts
/* @__NO_SIDE_EFFECTS__ */
function minBytes(requirement, message$1) {
	return {
		kind: "validation",
		type: "min_bytes",
		reference: minBytes,
		async: false,
		expects: `>=${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed) {
				const length$1 = /* @__PURE__ */ _getByteCount(dataset.value);
				if (length$1 < this.requirement) _addIssue(this, "bytes", dataset, config$1, { received: `${length$1}` });
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/minEntries/minEntries.ts
/* @__NO_SIDE_EFFECTS__ */
function minEntries(requirement, message$1) {
	return {
		kind: "validation",
		type: "min_entries",
		reference: minEntries,
		async: false,
		expects: `>=${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (!dataset.typed) return dataset;
			const count = Object.keys(dataset.value).length;
			if (dataset.typed && count < this.requirement) _addIssue(this, "entries", dataset, config$1, { received: `${count}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/minGraphemes/minGraphemes.ts
/* @__NO_SIDE_EFFECTS__ */
function minGraphemes(requirement, message$1) {
	return {
		kind: "validation",
		type: "min_graphemes",
		reference: minGraphemes,
		async: false,
		expects: `>=${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed) {
				const count = /* @__PURE__ */ _getGraphemeCount(dataset.value);
				if (count < this.requirement) _addIssue(this, "graphemes", dataset, config$1, { received: `${count}` });
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/minLength/minLength.ts
/* @__NO_SIDE_EFFECTS__ */
function minLength(requirement, message$1) {
	return {
		kind: "validation",
		type: "min_length",
		reference: minLength,
		async: false,
		expects: `>=${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.length < this.requirement) _addIssue(this, "length", dataset, config$1, { received: `${dataset.value.length}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/minSize/minSize.ts
/* @__NO_SIDE_EFFECTS__ */
function minSize(requirement, message$1) {
	return {
		kind: "validation",
		type: "min_size",
		reference: minSize,
		async: false,
		expects: `>=${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.size < this.requirement) _addIssue(this, "size", dataset, config$1, { received: `${dataset.value.size}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/minValue/minValue.ts
/* @__NO_SIDE_EFFECTS__ */
function minValue(requirement, message$1) {
	return {
		kind: "validation",
		type: "min_value",
		reference: minValue,
		async: false,
		expects: `>=${requirement instanceof Date ? requirement.toJSON() : /* @__PURE__ */ _stringify(requirement)}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !(dataset.value >= this.requirement)) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/minWords/minWords.ts
/* @__NO_SIDE_EFFECTS__ */
function minWords(locales, requirement, message$1) {
	return {
		kind: "validation",
		type: "min_words",
		reference: minWords,
		async: false,
		expects: `>=${requirement}`,
		locales,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed) {
				const count = /* @__PURE__ */ _getWordCount(this.locales, dataset.value);
				if (count < this.requirement) _addIssue(this, "words", dataset, config$1, { received: `${count}` });
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/multipleOf/multipleOf.ts
/* @__NO_SIDE_EFFECTS__ */
function multipleOf(requirement, message$1) {
	return {
		kind: "validation",
		type: "multiple_of",
		reference: multipleOf,
		async: false,
		expects: `%${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value % this.requirement != 0) _addIssue(this, "multiple", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/nanoid/nanoid.ts
/* @__NO_SIDE_EFFECTS__ */
function nanoid(message$1) {
	return {
		kind: "validation",
		type: "nanoid",
		reference: nanoid,
		async: false,
		expects: null,
		requirement: NANO_ID_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "Nano ID", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/nonEmpty/nonEmpty.ts
/* @__NO_SIDE_EFFECTS__ */
function nonEmpty(message$1) {
	return {
		kind: "validation",
		type: "non_empty",
		reference: nonEmpty,
		async: false,
		expects: "!0",
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.length === 0) _addIssue(this, "length", dataset, config$1, { received: "0" });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/normalize/normalize.ts
/* @__NO_SIDE_EFFECTS__ */
function normalize(form) {
	return {
		kind: "transformation",
		type: "normalize",
		reference: normalize,
		async: false,
		form,
		"~run"(dataset) {
			dataset.value = dataset.value.normalize(this.form);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/notBytes/notBytes.ts
/* @__NO_SIDE_EFFECTS__ */
function notBytes(requirement, message$1) {
	return {
		kind: "validation",
		type: "not_bytes",
		reference: notBytes,
		async: false,
		expects: `!${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed) {
				const length$1 = /* @__PURE__ */ _getByteCount(dataset.value);
				if (length$1 === this.requirement) _addIssue(this, "bytes", dataset, config$1, { received: `${length$1}` });
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/notEntries/notEntries.ts
/* @__NO_SIDE_EFFECTS__ */
function notEntries(requirement, message$1) {
	return {
		kind: "validation",
		type: "not_entries",
		reference: notEntries,
		async: false,
		expects: `!${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (!dataset.typed) return dataset;
			const count = Object.keys(dataset.value).length;
			if (dataset.typed && count === this.requirement) _addIssue(this, "entries", dataset, config$1, { received: `${count}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/notGraphemes/notGraphemes.ts
/* @__NO_SIDE_EFFECTS__ */
function notGraphemes(requirement, message$1) {
	return {
		kind: "validation",
		type: "not_graphemes",
		reference: notGraphemes,
		async: false,
		expects: `!${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed) {
				const count = /* @__PURE__ */ _getGraphemeCount(dataset.value);
				if (count === this.requirement) _addIssue(this, "graphemes", dataset, config$1, { received: `${count}` });
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/notLength/notLength.ts
/* @__NO_SIDE_EFFECTS__ */
function notLength(requirement, message$1) {
	return {
		kind: "validation",
		type: "not_length",
		reference: notLength,
		async: false,
		expects: `!${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.length === this.requirement) _addIssue(this, "length", dataset, config$1, { received: `${dataset.value.length}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/notSize/notSize.ts
/* @__NO_SIDE_EFFECTS__ */
function notSize(requirement, message$1) {
	return {
		kind: "validation",
		type: "not_size",
		reference: notSize,
		async: false,
		expects: `!${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.size === this.requirement) _addIssue(this, "size", dataset, config$1, { received: `${dataset.value.size}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/notValue/notValue.ts
/* @__NO_SIDE_EFFECTS__ */
function notValue(requirement, message$1) {
	return {
		kind: "validation",
		type: "not_value",
		reference: notValue,
		async: false,
		expects: requirement instanceof Date ? `!${requirement.toJSON()}` : `!${/* @__PURE__ */ _stringify(requirement)}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && this.requirement <= dataset.value && this.requirement >= dataset.value) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/notValues/notValues.ts
/* @__NO_SIDE_EFFECTS__ */
function notValues(requirement, message$1) {
	return {
		kind: "validation",
		type: "not_values",
		reference: notValues,
		async: false,
		expects: `!${/* @__PURE__ */ _joinExpects(requirement.map((value$1) => value$1 instanceof Date ? value$1.toJSON() : /* @__PURE__ */ _stringify(value$1)), "|")}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && this.requirement.some((value$1) => value$1 <= dataset.value && value$1 >= dataset.value)) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/notWords/notWords.ts
/* @__NO_SIDE_EFFECTS__ */
function notWords(locales, requirement, message$1) {
	return {
		kind: "validation",
		type: "not_words",
		reference: notWords,
		async: false,
		expects: `!${requirement}`,
		locales,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed) {
				const count = /* @__PURE__ */ _getWordCount(this.locales, dataset.value);
				if (count === this.requirement) _addIssue(this, "words", dataset, config$1, { received: `${count}` });
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/octal/octal.ts
/* @__NO_SIDE_EFFECTS__ */
function octal(message$1) {
	return {
		kind: "validation",
		type: "octal",
		reference: octal,
		async: false,
		expects: null,
		requirement: OCTAL_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "octal", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/parseJson/parseJson.ts
/* @__NO_SIDE_EFFECTS__ */
function parseJson(config$1, message$1) {
	return {
		kind: "transformation",
		type: "parse_json",
		reference: parseJson,
		config: config$1,
		message: message$1,
		async: false,
		"~run"(dataset, config$2) {
			try {
				dataset.value = JSON.parse(dataset.value, this.config?.reviver);
			} catch (error) {
				if (error instanceof Error) {
					_addIssue(this, "JSON", dataset, config$2, { received: `"${error.message}"` });
					dataset.typed = false;
				} else throw error;
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/partialCheck/utils/_isPartiallyTyped/_isPartiallyTyped.ts
/**
* Checks if a dataset is partially typed.
*
* @param dataset The dataset to check.
* @param paths The paths to check.
*
* @returns Whether it is partially typed.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _isPartiallyTyped(dataset, paths) {
	if (dataset.issues) for (const path of paths) for (const issue of dataset.issues) {
		let typed = false;
		const bound = Math.min(path.length, issue.path?.length ?? 0);
		for (let index = 0; index < bound; index++) if (path[index] !== issue.path[index].key && (path[index] !== "$" || issue.path[index].type !== "array")) {
			typed = true;
			break;
		}
		if (!typed) return false;
	}
	return true;
}

//#endregion
//#region src/actions/partialCheck/partialCheck.ts
/* @__NO_SIDE_EFFECTS__ */
function partialCheck(paths, requirement, message$1) {
	return {
		kind: "validation",
		type: "partial_check",
		reference: partialCheck,
		async: false,
		expects: null,
		paths,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if ((dataset.typed || /* @__PURE__ */ _isPartiallyTyped(dataset, paths)) && !this.requirement(dataset.value)) _addIssue(this, "input", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/partialCheck/partialCheckAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function partialCheckAsync(paths, requirement, message$1) {
	return {
		kind: "validation",
		type: "partial_check",
		reference: partialCheckAsync,
		async: true,
		expects: null,
		paths,
		requirement,
		message: message$1,
		async "~run"(dataset, config$1) {
			if ((dataset.typed || /* @__PURE__ */ _isPartiallyTyped(dataset, paths)) && !await this.requirement(dataset.value)) _addIssue(this, "input", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/rawCheck/rawCheck.ts
/**
* Creates a raw check validation action.
*
* @param action The validation action.
*
* @returns A raw check action.
*/
/* @__NO_SIDE_EFFECTS__ */
function rawCheck(action) {
	return {
		kind: "validation",
		type: "raw_check",
		reference: rawCheck,
		async: false,
		expects: null,
		"~run"(dataset, config$1) {
			action({
				dataset,
				config: config$1,
				addIssue: (info) => _addIssue(this, info?.label ?? "input", dataset, config$1, info)
			});
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/rawCheck/rawCheckAsync.ts
/**
* Creates a raw check validation action.
*
* @param action The validation action.
*
* @returns A raw check action.
*/
/* @__NO_SIDE_EFFECTS__ */
function rawCheckAsync(action) {
	return {
		kind: "validation",
		type: "raw_check",
		reference: rawCheckAsync,
		async: true,
		expects: null,
		async "~run"(dataset, config$1) {
			await action({
				dataset,
				config: config$1,
				addIssue: (info) => _addIssue(this, info?.label ?? "input", dataset, config$1, info)
			});
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/rawTransform/rawTransform.ts
/**
* Creates a raw transformation action.
*
* @param action The transformation action.
*
* @returns A raw transform action.
*/
/* @__NO_SIDE_EFFECTS__ */
function rawTransform(action) {
	return {
		kind: "transformation",
		type: "raw_transform",
		reference: rawTransform,
		async: false,
		"~run"(dataset, config$1) {
			const output = action({
				dataset,
				config: config$1,
				addIssue: (info) => _addIssue(this, info?.label ?? "input", dataset, config$1, info),
				NEVER: null
			});
			if (dataset.issues) dataset.typed = false;
			else dataset.value = output;
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/rawTransform/rawTransformAsync.ts
/**
* Creates a raw transformation action.
*
* @param action The transformation action.
*
* @returns A raw transform action.
*/
/* @__NO_SIDE_EFFECTS__ */
function rawTransformAsync(action) {
	return {
		kind: "transformation",
		type: "raw_transform",
		reference: rawTransformAsync,
		async: true,
		async "~run"(dataset, config$1) {
			const output = await action({
				dataset,
				config: config$1,
				addIssue: (info) => _addIssue(this, info?.label ?? "input", dataset, config$1, info),
				NEVER: null
			});
			if (dataset.issues) dataset.typed = false;
			else dataset.value = output;
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/readonly/readonly.ts
/* @__NO_SIDE_EFFECTS__ */
function readonly() {
	return {
		kind: "transformation",
		type: "readonly",
		reference: readonly,
		async: false,
		"~run"(dataset) {
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/reduceItems/reduceItems.ts
/* @__NO_SIDE_EFFECTS__ */
function reduceItems(operation, initial) {
	return {
		kind: "transformation",
		type: "reduce_items",
		reference: reduceItems,
		async: false,
		operation,
		initial,
		"~run"(dataset) {
			dataset.value = dataset.value.reduce(this.operation, this.initial);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/regex/regex.ts
/* @__NO_SIDE_EFFECTS__ */
function regex(requirement, message$1) {
	return {
		kind: "validation",
		type: "regex",
		reference: regex,
		async: false,
		expects: `${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "format", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/returns/returns.ts
/* @__NO_SIDE_EFFECTS__ */
function returns(schema) {
	return {
		kind: "transformation",
		type: "returns",
		reference: returns,
		async: false,
		schema,
		"~run"(dataset, config$1) {
			const func = dataset.value;
			dataset.value = (...args_) => {
				const returnsDataset = this.schema["~run"]({ value: func(...args_) }, config$1);
				if (returnsDataset.issues) throw new ValiError(returnsDataset.issues);
				return returnsDataset.value;
			};
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/returns/returnsAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function returnsAsync(schema) {
	return {
		kind: "transformation",
		type: "returns",
		reference: returnsAsync,
		async: false,
		schema,
		"~run"(dataset, config$1) {
			const func = dataset.value;
			dataset.value = async (...args_) => {
				const returnsDataset = await this.schema["~run"]({ value: await func(...args_) }, config$1);
				if (returnsDataset.issues) throw new ValiError(returnsDataset.issues);
				return returnsDataset.value;
			};
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/rfcEmail/rfcEmail.ts
/* @__NO_SIDE_EFFECTS__ */
function rfcEmail(message$1) {
	return {
		kind: "validation",
		type: "rfc_email",
		reference: rfcEmail,
		expects: null,
		async: false,
		requirement: RFC_EMAIL_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "email", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/safeInteger/safeInteger.ts
/* @__NO_SIDE_EFFECTS__ */
function safeInteger(message$1) {
	return {
		kind: "validation",
		type: "safe_integer",
		reference: safeInteger,
		async: false,
		expects: null,
		requirement: Number.isSafeInteger,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "safe integer", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/size/size.ts
/* @__NO_SIDE_EFFECTS__ */
function dist_size(requirement, message$1) {
	return {
		kind: "validation",
		type: "size",
		reference: dist_size,
		async: false,
		expects: `${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.size !== this.requirement) _addIssue(this, "size", dataset, config$1, { received: `${dataset.value.size}` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/slug/slug.ts
/* @__NO_SIDE_EFFECTS__ */
function slug(message$1) {
	return {
		kind: "validation",
		type: "slug",
		reference: slug,
		async: false,
		expects: null,
		requirement: SLUG_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "slug", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/someItem/someItem.ts
/* @__NO_SIDE_EFFECTS__ */
function someItem(requirement, message$1) {
	return {
		kind: "validation",
		type: "some_item",
		reference: someItem,
		async: false,
		expects: null,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !dataset.value.some(this.requirement)) _addIssue(this, "item", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/sortItems/sortItems.ts
/* @__NO_SIDE_EFFECTS__ */
function sortItems(operation) {
	return {
		kind: "transformation",
		type: "sort_items",
		reference: sortItems,
		async: false,
		operation,
		"~run"(dataset) {
			dataset.value = dataset.value.sort(this.operation);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/startsWith/startsWith.ts
/* @__NO_SIDE_EFFECTS__ */
function startsWith(requirement, message$1) {
	return {
		kind: "validation",
		type: "starts_with",
		reference: startsWith,
		async: false,
		expects: `"${requirement}"`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !dataset.value.startsWith(this.requirement)) _addIssue(this, "start", dataset, config$1, { received: `"${dataset.value.slice(0, this.requirement.length)}"` });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/stringifyJson/stringifyJson.ts
/* @__NO_SIDE_EFFECTS__ */
function stringifyJson(config$1, message$1) {
	return {
		kind: "transformation",
		type: "stringify_json",
		reference: stringifyJson,
		message: message$1,
		config: config$1,
		async: false,
		"~run"(dataset, config$2) {
			try {
				const output = JSON.stringify(dataset.value, this.config?.replacer, this.config?.space);
				if (output === void 0) {
					_addIssue(this, "JSON", dataset, config$2);
					dataset.typed = false;
				}
				dataset.value = output;
			} catch (error) {
				if (error instanceof Error) {
					_addIssue(this, "JSON", dataset, config$2, { received: `"${error.message}"` });
					dataset.typed = false;
				} else throw error;
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/title/title.ts
/**
* Creates a title metadata action.
*
* @param title_ The title text.
*
* @returns A title action.
*/
/* @__NO_SIDE_EFFECTS__ */
function title(title_) {
	return {
		kind: "metadata",
		type: "title",
		reference: title,
		title: title_
	};
}

//#endregion
//#region src/actions/toBigint/toBigint.ts
/* @__NO_SIDE_EFFECTS__ */
function toBigint(message$1) {
	return {
		kind: "transformation",
		type: "to_bigint",
		reference: toBigint,
		async: false,
		message: message$1,
		"~run"(dataset, config$1) {
			try {
				dataset.value = BigInt(dataset.value);
			} catch {
				_addIssue(this, "bigint", dataset, config$1);
				dataset.typed = false;
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/toBoolean/toBoolean.ts
/**
* Creates a to boolean transformation action.
*
* @returns A to boolean action.
*
* @beta
*/
/* @__NO_SIDE_EFFECTS__ */
function toBoolean() {
	return {
		kind: "transformation",
		type: "to_boolean",
		reference: toBoolean,
		async: false,
		"~run"(dataset) {
			dataset.value = Boolean(dataset.value);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/toDate/toDate.ts
/* @__NO_SIDE_EFFECTS__ */
function toDate(message$1) {
	return {
		kind: "transformation",
		type: "to_date",
		reference: toDate,
		async: false,
		message: message$1,
		"~run"(dataset, config$1) {
			try {
				dataset.value = new Date(dataset.value);
				if (isNaN(dataset.value)) {
					_addIssue(this, "date", dataset, config$1, { received: "\"Invalid Date\"" });
					dataset.typed = false;
				}
			} catch {
				_addIssue(this, "date", dataset, config$1);
				dataset.typed = false;
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/toLowerCase/toLowerCase.ts
/**
* Creates a to lower case transformation action.
*
* @returns A to lower case action.
*/
/* @__NO_SIDE_EFFECTS__ */
function toLowerCase() {
	return {
		kind: "transformation",
		type: "to_lower_case",
		reference: toLowerCase,
		async: false,
		"~run"(dataset) {
			dataset.value = dataset.value.toLowerCase();
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/toMaxValue/toMaxValue.ts
/**
* Creates a to max value transformation action.
*
* @param requirement The maximum value.
*
* @returns A to max value action.
*/
/* @__NO_SIDE_EFFECTS__ */
function toMaxValue(requirement) {
	return {
		kind: "transformation",
		type: "to_max_value",
		reference: toMaxValue,
		async: false,
		requirement,
		"~run"(dataset) {
			dataset.value = dataset.value > this.requirement ? this.requirement : dataset.value;
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/toMinValue/toMinValue.ts
/**
* Creates a to min value transformation action.
*
* @param requirement The minimum value.
*
* @returns A to min value action.
*/
/* @__NO_SIDE_EFFECTS__ */
function toMinValue(requirement) {
	return {
		kind: "transformation",
		type: "to_min_value",
		reference: toMinValue,
		async: false,
		requirement,
		"~run"(dataset) {
			dataset.value = dataset.value < this.requirement ? this.requirement : dataset.value;
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/toNumber/toNumber.ts
/* @__NO_SIDE_EFFECTS__ */
function toNumber(message$1) {
	return {
		kind: "transformation",
		type: "to_number",
		reference: toNumber,
		async: false,
		message: message$1,
		"~run"(dataset, config$1) {
			try {
				dataset.value = Number(dataset.value);
				if (isNaN(dataset.value)) {
					_addIssue(this, "number", dataset, config$1);
					dataset.typed = false;
				}
			} catch {
				_addIssue(this, "number", dataset, config$1);
				dataset.typed = false;
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/toString/toString.ts
/* @__NO_SIDE_EFFECTS__ */
function dist_toString(message$1) {
	return {
		kind: "transformation",
		type: "to_string",
		reference: dist_toString,
		async: false,
		message: message$1,
		"~run"(dataset, config$1) {
			try {
				dataset.value = String(dataset.value);
			} catch {
				_addIssue(this, "string", dataset, config$1);
				dataset.typed = false;
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/toUpperCase/toUpperCase.ts
/**
* Creates a to upper case transformation action.
*
* @returns A to upper case action.
*/
/* @__NO_SIDE_EFFECTS__ */
function toUpperCase() {
	return {
		kind: "transformation",
		type: "to_upper_case",
		reference: toUpperCase,
		async: false,
		"~run"(dataset) {
			dataset.value = dataset.value.toUpperCase();
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/transform/transform.ts
/**
* Creates a custom transformation action.
*
* @param operation The transformation operation.
*
* @returns A transform action.
*/
/* @__NO_SIDE_EFFECTS__ */
function transform(operation) {
	return {
		kind: "transformation",
		type: "transform",
		reference: transform,
		async: false,
		operation,
		"~run"(dataset) {
			dataset.value = this.operation(dataset.value);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/transform/transformAsync.ts
/**
* Creates a custom transformation action.
*
* @param operation The transformation operation.
*
* @returns A transform action.
*/
/* @__NO_SIDE_EFFECTS__ */
function transformAsync(operation) {
	return {
		kind: "transformation",
		type: "transform",
		reference: transformAsync,
		async: true,
		operation,
		async "~run"(dataset) {
			dataset.value = await this.operation(dataset.value);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/trim/trim.ts
/**
* Creates a trim transformation action.
*
* @returns A trim action.
*/
/* @__NO_SIDE_EFFECTS__ */
function trim() {
	return {
		kind: "transformation",
		type: "trim",
		reference: trim,
		async: false,
		"~run"(dataset) {
			dataset.value = dataset.value.trim();
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/trimEnd/trimEnd.ts
/**
* Creates a trim end transformation action.
*
* @returns A trim end action.
*/
/* @__NO_SIDE_EFFECTS__ */
function trimEnd() {
	return {
		kind: "transformation",
		type: "trim_end",
		reference: trimEnd,
		async: false,
		"~run"(dataset) {
			dataset.value = dataset.value.trimEnd();
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/trimStart/trimStart.ts
/**
* Creates a trim start transformation action.
*
* @returns A trim start action.
*/
/* @__NO_SIDE_EFFECTS__ */
function trimStart() {
	return {
		kind: "transformation",
		type: "trim_start",
		reference: trimStart,
		async: false,
		"~run"(dataset) {
			dataset.value = dataset.value.trimStart();
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/ulid/ulid.ts
/* @__NO_SIDE_EFFECTS__ */
function ulid(message$1) {
	return {
		kind: "validation",
		type: "ulid",
		reference: ulid,
		async: false,
		expects: null,
		requirement: ULID_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "ULID", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/url/url.ts
/* @__NO_SIDE_EFFECTS__ */
function dist_url(message$1) {
	return {
		kind: "validation",
		type: "url",
		reference: dist_url,
		async: false,
		expects: null,
		requirement(input) {
			try {
				new URL(input);
				return true;
			} catch {
				return false;
			}
		},
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "URL", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/uuid/uuid.ts
/* @__NO_SIDE_EFFECTS__ */
function uuid(message$1) {
	return {
		kind: "validation",
		type: "uuid",
		reference: uuid,
		async: false,
		expects: null,
		requirement: UUID_REGEX,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "UUID", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/value/value.ts
/* @__NO_SIDE_EFFECTS__ */
function dist_value(requirement, message$1) {
	return {
		kind: "validation",
		type: "value",
		reference: dist_value,
		async: false,
		expects: requirement instanceof Date ? requirement.toJSON() : /* @__PURE__ */ _stringify(requirement),
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !(this.requirement <= dataset.value && this.requirement >= dataset.value)) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/values/values.ts
/* @__NO_SIDE_EFFECTS__ */
function values(requirement, message$1) {
	return {
		kind: "validation",
		type: "values",
		reference: values,
		async: false,
		expects: `${/* @__PURE__ */ _joinExpects(requirement.map((value$1) => value$1 instanceof Date ? value$1.toJSON() : /* @__PURE__ */ _stringify(value$1)), "|")}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.some((value$1) => value$1 <= dataset.value && value$1 >= dataset.value)) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
			return dataset;
		}
	};
}

//#endregion
//#region src/actions/words/words.ts
/* @__NO_SIDE_EFFECTS__ */
function words(locales, requirement, message$1) {
	return {
		kind: "validation",
		type: "words",
		reference: words,
		async: false,
		expects: `${requirement}`,
		locales,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed) {
				const count = /* @__PURE__ */ _getWordCount(this.locales, dataset.value);
				if (count !== this.requirement) _addIssue(this, "words", dataset, config$1, { received: `${count}` });
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/methods/assert/assert.ts
/**
* Checks if the input matches the schema. As this is an assertion function, it
* can be used as a type guard.
*
* @param schema The schema to be used.
* @param input The input to be tested.
*/
function assert(schema, input) {
	const issues = schema["~run"]({ value: input }, { abortEarly: true }).issues;
	if (issues) throw new ValiError(issues);
}

//#endregion
//#region src/methods/config/config.ts
/**
* Changes the local configuration of a schema.
*
* @param schema The schema to configure.
* @param config The parse configuration.
*
* @returns The configured schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function config(schema, config$1) {
	return {
		...schema,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config_) {
			return schema["~run"](dataset, {
				...config_,
				...config$1
			});
		}
	};
}

//#endregion
//#region src/methods/getFallback/getFallback.ts
/**
* Returns the fallback value of the schema.
*
* @param schema The schema to get it from.
* @param dataset The output dataset if available.
* @param config The config if available.
*
* @returns The fallback value.
*/
/* @__NO_SIDE_EFFECTS__ */
function getFallback(schema, dataset, config$1) {
	return typeof schema.fallback === "function" ? schema.fallback(dataset, config$1) : schema.fallback;
}

//#endregion
//#region src/methods/fallback/fallback.ts
/**
* Returns a fallback value as output if the input does not match the schema.
*
* @param schema The schema to catch.
* @param fallback The fallback value.
*
* @returns The passed schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function fallback(schema, fallback$1) {
	return {
		...schema,
		fallback: fallback$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const outputDataset = schema["~run"](dataset, config$1);
			return outputDataset.issues ? {
				typed: true,
				value: /* @__PURE__ */ getFallback(this, outputDataset, config$1)
			} : outputDataset;
		}
	};
}

//#endregion
//#region src/methods/fallback/fallbackAsync.ts
/**
* Returns a fallback value as output if the input does not match the schema.
*
* @param schema The schema to catch.
* @param fallback The fallback value.
*
* @returns The passed schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function fallbackAsync(schema, fallback$1) {
	return {
		...schema,
		fallback: fallback$1,
		async: true,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const outputDataset = await schema["~run"](dataset, config$1);
			return outputDataset.issues ? {
				typed: true,
				value: await /* @__PURE__ */ getFallback(this, outputDataset, config$1)
			} : outputDataset;
		}
	};
}

//#endregion
//#region src/methods/flatten/flatten.ts
/* @__NO_SIDE_EFFECTS__ */
function flatten(issues) {
	const flatErrors = {};
	for (const issue of issues) if (issue.path) {
		const dotPath = /* @__PURE__ */ getDotPath(issue);
		if (dotPath) {
			if (!flatErrors.nested) flatErrors.nested = {};
			if (flatErrors.nested[dotPath]) flatErrors.nested[dotPath].push(issue.message);
			else flatErrors.nested[dotPath] = [issue.message];
		} else if (flatErrors.other) flatErrors.other.push(issue.message);
		else flatErrors.other = [issue.message];
	} else if (flatErrors.root) flatErrors.root.push(issue.message);
	else flatErrors.root = [issue.message];
	return flatErrors;
}

//#endregion
//#region src/methods/forward/forward.ts
/**
* Forwards the issues of the passed validation action.
*
* @param action The validation action.
* @param path The path to forward the issues to.
*
* @returns The modified action.
*/
/* @__NO_SIDE_EFFECTS__ */
function forward(action, path) {
	return {
		...action,
		"~run"(dataset, config$1) {
			const prevIssues = dataset.issues && [...dataset.issues];
			dataset = action["~run"](dataset, config$1);
			if (dataset.issues) {
				for (const issue of dataset.issues) if (!prevIssues?.includes(issue)) {
					let pathInput = dataset.value;
					for (const key of path) {
						const pathValue = pathInput[key];
						const pathItem = {
							type: "unknown",
							origin: "value",
							input: pathInput,
							key,
							value: pathValue
						};
						if (issue.path) issue.path.push(pathItem);
						else issue.path = [pathItem];
						if (!pathValue) break;
						pathInput = pathValue;
					}
				}
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/methods/forward/forwardAsync.ts
/**
* Forwards the issues of the passed validation action.
*
* @param action The validation action.
* @param path The path to forward the issues to.
*
* @returns The modified action.
*/
/* @__NO_SIDE_EFFECTS__ */
function forwardAsync(action, path) {
	return {
		...action,
		async: true,
		async "~run"(dataset, config$1) {
			const prevIssues = dataset.issues && [...dataset.issues];
			dataset = await action["~run"](dataset, config$1);
			if (dataset.issues) {
				for (const issue of dataset.issues) if (!prevIssues?.includes(issue)) {
					let pathInput = dataset.value;
					for (const key of path) {
						const pathValue = pathInput[key];
						const pathItem = {
							type: "unknown",
							origin: "value",
							input: pathInput,
							key,
							value: pathValue
						};
						if (issue.path) issue.path.push(pathItem);
						else issue.path = [pathItem];
						if (!pathValue) break;
						pathInput = pathValue;
					}
				}
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/methods/getDefault/getDefault.ts
/**
* Returns the default value of the schema.
*
* @param schema The schema to get it from.
* @param dataset The input dataset if available.
* @param config The config if available.
*
* @returns The default value.
*/
/* @__NO_SIDE_EFFECTS__ */
function getDefault(schema, dataset, config$1) {
	return typeof schema.default === "function" ? schema.default(dataset, config$1) : schema.default;
}

//#endregion
//#region src/methods/getDefaults/getDefaults.ts
/**
* Returns the default values of the schema.
*
* Hint: The difference to `getDefault` is that for object and tuple schemas
* this function recursively returns the default values of the subschemas
* instead of `undefined`.
*
* @param schema The schema to get them from.
*
* @returns The default values.
*/
/* @__NO_SIDE_EFFECTS__ */
function getDefaults(schema) {
	if ("entries" in schema) {
		const object$1 = {};
		for (const key in schema.entries) object$1[key] = /* @__PURE__ */ getDefaults(schema.entries[key]);
		return object$1;
	}
	if ("items" in schema) return schema.items.map(getDefaults);
	return /* @__PURE__ */ getDefault(schema);
}

//#endregion
//#region src/methods/getDefaults/getDefaultsAsync.ts
/**
* Returns the default values of the schema.
*
* Hint: The difference to `getDefault` is that for object and tuple schemas
* this function recursively returns the default values of the subschemas
* instead of `undefined`.
*
* @param schema The schema to get them from.
*
* @returns The default values.
*/
/* @__NO_SIDE_EFFECTS__ */
async function getDefaultsAsync(schema) {
	if ("entries" in schema) return Object.fromEntries(await Promise.all(Object.entries(schema.entries).map(async ([key, value$1]) => [key, await /* @__PURE__ */ getDefaultsAsync(value$1)])));
	if ("items" in schema) return Promise.all(schema.items.map(getDefaultsAsync));
	return /* @__PURE__ */ getDefault(schema);
}

//#endregion
//#region src/methods/getDescription/getDescription.ts
/**
* Returns the description of the schema.
*
* If multiple descriptions are defined, the last one of the highest level is
* returned. If no description is defined, `undefined` is returned.
*
* @param schema The schema to get the description from.
*
* @returns The description, if any.
*
* @beta
*/
/* @__NO_SIDE_EFFECTS__ */
function getDescription(schema) {
	return /* @__PURE__ */ _getLastMetadata(schema, "description");
}

//#endregion
//#region src/methods/getExamples/getExamples.ts
/**
* Returns the examples of a schema.
*
* If multiple examples are defined, it concatenates them using depth-first
* search. If no examples are defined, an empty array is returned.
*
* @param schema The schema to get the examples from.
*
* @returns The examples, if any.
*
* @beta
*/
/* @__NO_SIDE_EFFECTS__ */
function getExamples(schema) {
	const examples$1 = [];
	function depthFirstCollect(schema$1) {
		if ("pipe" in schema$1) {
			for (const item of schema$1.pipe) if (item.kind === "schema" && "pipe" in item) depthFirstCollect(item);
			else if (item.kind === "metadata" && item.type === "examples") examples$1.push(...item.examples);
		}
	}
	depthFirstCollect(schema);
	return examples$1;
}

//#endregion
//#region src/methods/getFallbacks/getFallbacks.ts
/**
* Returns the fallback values of the schema.
*
* Hint: The difference to `getFallback` is that for object and tuple schemas
* this function recursively returns the fallback values of the subschemas
* instead of `undefined`.
*
* @param schema The schema to get them from.
*
* @returns The fallback values.
*/
/* @__NO_SIDE_EFFECTS__ */
function getFallbacks(schema) {
	if ("entries" in schema) {
		const object$1 = {};
		for (const key in schema.entries) object$1[key] = /* @__PURE__ */ getFallbacks(schema.entries[key]);
		return object$1;
	}
	if ("items" in schema) return schema.items.map(getFallbacks);
	return /* @__PURE__ */ getFallback(schema);
}

//#endregion
//#region src/methods/getFallbacks/getFallbacksAsync.ts
/**
* Returns the fallback values of the schema.
*
* Hint: The difference to `getFallback` is that for object and tuple schemas
* this function recursively returns the fallback values of the subschemas
* instead of `undefined`.
*
* @param schema The schema to get them from.
*
* @returns The fallback values.
*/
/* @__NO_SIDE_EFFECTS__ */
async function getFallbacksAsync(schema) {
	if ("entries" in schema) return Object.fromEntries(await Promise.all(Object.entries(schema.entries).map(async ([key, value$1]) => [key, await /* @__PURE__ */ getFallbacksAsync(value$1)])));
	if ("items" in schema) return Promise.all(schema.items.map(getFallbacksAsync));
	return /* @__PURE__ */ getFallback(schema);
}

//#endregion
//#region src/methods/getMetadata/getMetadata.ts
/**
* Returns the metadata of a schema.
*
* If multiple metadata are defined, it shallowly merges them using depth-first
* search. If no metadata is defined, an empty object is returned.
*
* @param schema Schema to get the metadata from.
*
* @returns The metadata, if any.
*
* @beta
*/
/* @__NO_SIDE_EFFECTS__ */
function getMetadata(schema) {
	const result = {};
	function depthFirstMerge(schema$1) {
		if ("pipe" in schema$1) {
			for (const item of schema$1.pipe) if (item.kind === "schema" && "pipe" in item) depthFirstMerge(item);
			else if (item.kind === "metadata" && item.type === "metadata") Object.assign(result, item.metadata);
		}
	}
	depthFirstMerge(schema);
	return result;
}

//#endregion
//#region src/methods/getTitle/getTitle.ts
/**
* Returns the title of the schema.
*
* If multiple titles are defined, the last one of the highest level is
* returned. If no title is defined, `undefined` is returned.
*
* @param schema The schema to get the title from.
*
* @returns The title, if any.
*
* @beta
*/
/* @__NO_SIDE_EFFECTS__ */
function getTitle(schema) {
	return /* @__PURE__ */ _getLastMetadata(schema, "title");
}

//#endregion
//#region src/methods/is/is.ts
/**
* Checks if the input matches the schema. By using a type predicate, this
* function can be used as a type guard.
*
* @param schema The schema to be used.
* @param input The input to be tested.
*
* @returns Whether the input matches the schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function is(schema, input) {
	return !schema["~run"]({ value: input }, { abortEarly: true }).issues;
}

//#endregion
//#region src/schemas/any/any.ts
/**
* Creates an any schema.
*
* Hint: This schema function exists only for completeness and is not
* recommended in practice. Instead, `unknown` should be used to accept
* unknown data.
*
* @returns An any schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function any() {
	return {
		kind: "schema",
		type: "any",
		reference: any,
		expects: "any",
		async: false,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset) {
			dataset.typed = true;
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/array/array.ts
/* @__NO_SIDE_EFFECTS__ */
function array(item, message$1) {
	return {
		kind: "schema",
		type: "array",
		reference: array,
		expects: "Array",
		async: false,
		item,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < input.length; key++) {
					const value$1 = input[key];
					const itemDataset = this.item["~run"]({ value: value$1 }, config$1);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/array/arrayAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function arrayAsync(item, message$1) {
	return {
		kind: "schema",
		type: "array",
		reference: arrayAsync,
		expects: "Array",
		async: true,
		item,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				const itemDatasets = await Promise.all(input.map((value$1) => this.item["~run"]({ value: value$1 }, config$1)));
				for (let key = 0; key < itemDatasets.length; key++) {
					const itemDataset = itemDatasets[key];
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: input[key]
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/bigint/bigint.ts
/* @__NO_SIDE_EFFECTS__ */
function bigint(message$1) {
	return {
		kind: "schema",
		type: "bigint",
		reference: bigint,
		expects: "bigint",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "bigint") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/blob/blob.ts
/* @__NO_SIDE_EFFECTS__ */
function blob(message$1) {
	return {
		kind: "schema",
		type: "blob",
		reference: blob,
		expects: "Blob",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value instanceof Blob) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/boolean/boolean.ts
/* @__NO_SIDE_EFFECTS__ */
function dist_boolean(message$1) {
	return {
		kind: "schema",
		type: "boolean",
		reference: dist_boolean,
		expects: "boolean",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "boolean") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/custom/custom.ts
/* @__NO_SIDE_EFFECTS__ */
function custom(check$1, message$1) {
	return {
		kind: "schema",
		type: "custom",
		reference: custom,
		expects: "unknown",
		async: false,
		check: check$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (this.check(dataset.value)) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/custom/customAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function customAsync(check$1, message$1) {
	return {
		kind: "schema",
		type: "custom",
		reference: customAsync,
		expects: "unknown",
		async: true,
		check: check$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			if (await this.check(dataset.value)) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/date/date.ts
/* @__NO_SIDE_EFFECTS__ */
function dist_date(message$1) {
	return {
		kind: "schema",
		type: "date",
		reference: dist_date,
		expects: "Date",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value instanceof Date) if (!isNaN(dataset.value)) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1, { received: "\"Invalid Date\"" });
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/enum/enum.ts
/* @__NO_SIDE_EFFECTS__ */
function enum_(enum__, message$1) {
	const options = [];
	for (const key in enum__) if (`${+key}` !== key || typeof enum__[key] !== "string" || !Object.is(enum__[enum__[key]], +key)) options.push(enum__[key]);
	return {
		kind: "schema",
		type: "enum",
		reference: enum_,
		expects: /* @__PURE__ */ _joinExpects(options.map(_stringify), "|"),
		async: false,
		enum: enum__,
		options,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (this.options.includes(dataset.value)) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/exactOptional/exactOptional.ts
/* @__NO_SIDE_EFFECTS__ */
function exactOptional(wrapped, default_) {
	return {
		kind: "schema",
		type: "exact_optional",
		reference: exactOptional,
		expects: wrapped.expects,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}

//#endregion
//#region src/schemas/exactOptional/exactOptionalAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function exactOptionalAsync(wrapped, default_) {
	return {
		kind: "schema",
		type: "exact_optional",
		reference: exactOptionalAsync,
		expects: wrapped.expects,
		async: true,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}

//#endregion
//#region src/schemas/file/file.ts
/* @__NO_SIDE_EFFECTS__ */
function file(message$1) {
	return {
		kind: "schema",
		type: "file",
		reference: file,
		expects: "File",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value instanceof File) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/function/function.ts
/* @__NO_SIDE_EFFECTS__ */
function function_(message$1) {
	return {
		kind: "schema",
		type: "function",
		reference: function_,
		expects: "Function",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "function") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/instance/instance.ts
/* @__NO_SIDE_EFFECTS__ */
function instance(class_, message$1) {
	return {
		kind: "schema",
		type: "instance",
		reference: instance,
		expects: class_.name,
		async: false,
		class: class_,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value instanceof this.class) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/intersect/utils/_merge/_merge.ts
/**
* Merges two values into one single output.
*
* @param value1 First value.
* @param value2 Second value.
*
* @returns The merge dataset.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _merge(value1, value2) {
	if (typeof value1 === typeof value2) {
		if (value1 === value2 || value1 instanceof Date && value2 instanceof Date && +value1 === +value2) return { value: value1 };
		if (value1 && value2 && value1.constructor === Object && value2.constructor === Object) {
			for (const key in value2) if (key in value1) {
				const dataset = /* @__PURE__ */ _merge(value1[key], value2[key]);
				if (dataset.issue) return dataset;
				value1[key] = dataset.value;
			} else value1[key] = value2[key];
			return { value: value1 };
		}
		if (Array.isArray(value1) && Array.isArray(value2)) {
			if (value1.length === value2.length) {
				for (let index = 0; index < value1.length; index++) {
					const dataset = /* @__PURE__ */ _merge(value1[index], value2[index]);
					if (dataset.issue) return dataset;
					value1[index] = dataset.value;
				}
				return { value: value1 };
			}
		}
	}
	return { issue: true };
}

//#endregion
//#region src/schemas/intersect/intersect.ts
/* @__NO_SIDE_EFFECTS__ */
function intersect(options, message$1) {
	return {
		kind: "schema",
		type: "intersect",
		reference: intersect,
		expects: /* @__PURE__ */ _joinExpects(options.map((option) => option.expects), "&"),
		async: false,
		options,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (this.options.length) {
				const input = dataset.value;
				let outputs;
				dataset.typed = true;
				for (const schema of this.options) {
					const optionDataset = schema["~run"]({ value: input }, config$1);
					if (optionDataset.issues) {
						if (dataset.issues) dataset.issues.push(...optionDataset.issues);
						else dataset.issues = optionDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!optionDataset.typed) dataset.typed = false;
					if (dataset.typed) if (outputs) outputs.push(optionDataset.value);
					else outputs = [optionDataset.value];
				}
				if (dataset.typed) {
					dataset.value = outputs[0];
					for (let index = 1; index < outputs.length; index++) {
						const mergeDataset = /* @__PURE__ */ _merge(dataset.value, outputs[index]);
						if (mergeDataset.issue) {
							_addIssue(this, "type", dataset, config$1, { received: "unknown" });
							break;
						}
						dataset.value = mergeDataset.value;
					}
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/intersect/intersectAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function intersectAsync(options, message$1) {
	return {
		kind: "schema",
		type: "intersect",
		reference: intersectAsync,
		expects: /* @__PURE__ */ _joinExpects(options.map((option) => option.expects), "&"),
		async: true,
		options,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			if (this.options.length) {
				const input = dataset.value;
				let outputs;
				dataset.typed = true;
				const optionDatasets = await Promise.all(this.options.map((schema) => schema["~run"]({ value: input }, config$1)));
				for (const optionDataset of optionDatasets) {
					if (optionDataset.issues) {
						if (dataset.issues) dataset.issues.push(...optionDataset.issues);
						else dataset.issues = optionDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!optionDataset.typed) dataset.typed = false;
					if (dataset.typed) if (outputs) outputs.push(optionDataset.value);
					else outputs = [optionDataset.value];
				}
				if (dataset.typed) {
					dataset.value = outputs[0];
					for (let index = 1; index < outputs.length; index++) {
						const mergeDataset = /* @__PURE__ */ _merge(dataset.value, outputs[index]);
						if (mergeDataset.issue) {
							_addIssue(this, "type", dataset, config$1, { received: "unknown" });
							break;
						}
						dataset.value = mergeDataset.value;
					}
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/lazy/lazy.ts
/**
* Creates a lazy schema.
*
* @param getter The schema getter.
*
* @returns A lazy schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function lazy(getter) {
	return {
		kind: "schema",
		type: "lazy",
		reference: lazy,
		expects: "unknown",
		async: false,
		getter,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			return this.getter(dataset.value)["~run"](dataset, config$1);
		}
	};
}

//#endregion
//#region src/schemas/lazy/lazyAsync.ts
/**
* Creates a lazy schema.
*
* @param getter The schema getter.
*
* @returns A lazy schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function lazyAsync(getter) {
	return {
		kind: "schema",
		type: "lazy",
		reference: lazyAsync,
		expects: "unknown",
		async: true,
		getter,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			return (await this.getter(dataset.value))["~run"](dataset, config$1);
		}
	};
}

//#endregion
//#region src/schemas/literal/literal.ts
/* @__NO_SIDE_EFFECTS__ */
function literal(literal_, message$1) {
	return {
		kind: "schema",
		type: "literal",
		reference: literal,
		expects: /* @__PURE__ */ _stringify(literal_),
		async: false,
		literal: literal_,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === this.literal) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/looseObject/looseObject.ts
/* @__NO_SIDE_EFFECTS__ */
function looseObject(entries$1, message$1) {
	return {
		kind: "schema",
		type: "loose_object",
		reference: looseObject,
		expects: "Object",
		async: false,
		entries: entries$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const key in this.entries) {
					const valueSchema = this.entries[key];
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value$1 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
						const valueDataset = valueSchema["~run"]({ value: value$1 }, config$1);
						if (valueDataset.issues) {
							const pathItem = {
								type: "object",
								origin: "value",
								input,
								key,
								value: value$1
							};
							for (const issue of valueDataset.issues) {
								if (issue.path) issue.path.unshift(pathItem);
								else issue.path = [pathItem];
								dataset.issues?.push(issue);
							}
							if (!dataset.issues) dataset.issues = valueDataset.issues;
							if (config$1.abortEarly) {
								dataset.typed = false;
								break;
							}
						}
						if (!valueDataset.typed) dataset.typed = false;
						dataset.value[key] = valueDataset.value;
					} else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
					else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
						_addIssue(this, "key", dataset, config$1, {
							input: void 0,
							expected: `"${key}"`,
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						if (config$1.abortEarly) break;
					}
				}
				if (!dataset.issues || !config$1.abortEarly) {
					for (const key in input) if (/* @__PURE__ */ _isValidObjectKey(input, key) && !(key in this.entries)) dataset.value[key] = input[key];
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/looseObject/looseObjectAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function looseObjectAsync(entries$1, message$1) {
	return {
		kind: "schema",
		type: "loose_object",
		reference: looseObjectAsync,
		expects: "Object",
		async: true,
		entries: entries$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				const valueDatasets = await Promise.all(Object.entries(this.entries).map(async ([key, valueSchema]) => {
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value$1 = key in input ? input[key] : await /* @__PURE__ */ getDefault(valueSchema);
						return [
							key,
							value$1,
							valueSchema,
							await valueSchema["~run"]({ value: value$1 }, config$1)
						];
					}
					return [
						key,
						input[key],
						valueSchema,
						null
					];
				}));
				for (const [key, value$1, valueSchema, valueDataset] of valueDatasets) if (valueDataset) {
					if (valueDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!valueDataset.typed) dataset.typed = false;
					dataset.value[key] = valueDataset.value;
				} else if (valueSchema.fallback !== void 0) dataset.value[key] = await /* @__PURE__ */ getFallback(valueSchema);
				else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
					_addIssue(this, "key", dataset, config$1, {
						input: void 0,
						expected: `"${key}"`,
						path: [{
							type: "object",
							origin: "key",
							input,
							key,
							value: value$1
						}]
					});
					if (config$1.abortEarly) break;
				}
				if (!dataset.issues || !config$1.abortEarly) {
					for (const key in input) if (/* @__PURE__ */ _isValidObjectKey(input, key) && !(key in this.entries)) dataset.value[key] = input[key];
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/looseTuple/looseTuple.ts
/* @__NO_SIDE_EFFECTS__ */
function looseTuple(items, message$1) {
	return {
		kind: "schema",
		type: "loose_tuple",
		reference: looseTuple,
		expects: "Array",
		async: false,
		items,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < this.items.length; key++) {
					const value$1 = input[key];
					const itemDataset = this.items[key]["~run"]({ value: value$1 }, config$1);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
				if (!dataset.issues || !config$1.abortEarly) for (let key = this.items.length; key < input.length; key++) dataset.value.push(input[key]);
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/looseTuple/looseTupleAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function looseTupleAsync(items, message$1) {
	return {
		kind: "schema",
		type: "loose_tuple",
		reference: looseTupleAsync,
		expects: "Array",
		async: true,
		items,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				const itemDatasets = await Promise.all(this.items.map(async (item, key) => {
					const value$1 = input[key];
					return [
						key,
						value$1,
						await item["~run"]({ value: value$1 }, config$1)
					];
				}));
				for (const [key, value$1, itemDataset] of itemDatasets) {
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
				if (!dataset.issues || !config$1.abortEarly) for (let key = this.items.length; key < input.length; key++) dataset.value.push(input[key]);
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/map/map.ts
/* @__NO_SIDE_EFFECTS__ */
function map(key, value$1, message$1) {
	return {
		kind: "schema",
		type: "map",
		reference: map,
		expects: "Map",
		async: false,
		key,
		value: value$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input instanceof Map) {
				dataset.typed = true;
				dataset.value = /* @__PURE__ */ new Map();
				for (const [inputKey, inputValue] of input) {
					const keyDataset = this.key["~run"]({ value: inputKey }, config$1);
					if (keyDataset.issues) {
						const pathItem = {
							type: "map",
							origin: "key",
							input,
							key: inputKey,
							value: inputValue
						};
						for (const issue of keyDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = keyDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					const valueDataset = this.value["~run"]({ value: inputValue }, config$1);
					if (valueDataset.issues) {
						const pathItem = {
							type: "map",
							origin: "value",
							input,
							key: inputKey,
							value: inputValue
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!keyDataset.typed || !valueDataset.typed) dataset.typed = false;
					dataset.value.set(keyDataset.value, valueDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/map/mapAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function mapAsync(key, value$1, message$1) {
	return {
		kind: "schema",
		type: "map",
		reference: mapAsync,
		expects: "Map",
		async: true,
		key,
		value: value$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const input = dataset.value;
			if (input instanceof Map) {
				dataset.typed = true;
				dataset.value = /* @__PURE__ */ new Map();
				const datasets = await Promise.all([...input].map(([inputKey, inputValue]) => Promise.all([
					inputKey,
					inputValue,
					this.key["~run"]({ value: inputKey }, config$1),
					this.value["~run"]({ value: inputValue }, config$1)
				])));
				for (const [inputKey, inputValue, keyDataset, valueDataset] of datasets) {
					if (keyDataset.issues) {
						const pathItem = {
							type: "map",
							origin: "key",
							input,
							key: inputKey,
							value: inputValue
						};
						for (const issue of keyDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = keyDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (valueDataset.issues) {
						const pathItem = {
							type: "map",
							origin: "value",
							input,
							key: inputKey,
							value: inputValue
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!keyDataset.typed || !valueDataset.typed) dataset.typed = false;
					dataset.value.set(keyDataset.value, valueDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/nan/nan.ts
/* @__NO_SIDE_EFFECTS__ */
function nan(message$1) {
	return {
		kind: "schema",
		type: "nan",
		reference: nan,
		expects: "NaN",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (Number.isNaN(dataset.value)) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/never/never.ts
/* @__NO_SIDE_EFFECTS__ */
function never(message$1) {
	return {
		kind: "schema",
		type: "never",
		reference: never,
		expects: "never",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			_addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/nonNullable/nonNullable.ts
/* @__NO_SIDE_EFFECTS__ */
function nonNullable(wrapped, message$1) {
	return {
		kind: "schema",
		type: "non_nullable",
		reference: nonNullable,
		expects: "!null",
		async: false,
		wrapped,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value !== null) dataset = this.wrapped["~run"](dataset, config$1);
			if (dataset.value === null) _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/nonNullable/nonNullableAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function nonNullableAsync(wrapped, message$1) {
	return {
		kind: "schema",
		type: "non_nullable",
		reference: nonNullableAsync,
		expects: "!null",
		async: true,
		wrapped,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			if (dataset.value !== null) dataset = await this.wrapped["~run"](dataset, config$1);
			if (dataset.value === null) _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/nonNullish/nonNullish.ts
/* @__NO_SIDE_EFFECTS__ */
function nonNullish(wrapped, message$1) {
	return {
		kind: "schema",
		type: "non_nullish",
		reference: nonNullish,
		expects: "(!null & !undefined)",
		async: false,
		wrapped,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (!(dataset.value === null || dataset.value === void 0)) dataset = this.wrapped["~run"](dataset, config$1);
			if (dataset.value === null || dataset.value === void 0) _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/nonNullish/nonNullishAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function nonNullishAsync(wrapped, message$1) {
	return {
		kind: "schema",
		type: "non_nullish",
		reference: nonNullishAsync,
		expects: "(!null & !undefined)",
		async: true,
		wrapped,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			if (!(dataset.value === null || dataset.value === void 0)) dataset = await this.wrapped["~run"](dataset, config$1);
			if (dataset.value === null || dataset.value === void 0) _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/nonOptional/nonOptional.ts
/* @__NO_SIDE_EFFECTS__ */
function nonOptional(wrapped, message$1) {
	return {
		kind: "schema",
		type: "non_optional",
		reference: nonOptional,
		expects: "!undefined",
		async: false,
		wrapped,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value !== void 0) dataset = this.wrapped["~run"](dataset, config$1);
			if (dataset.value === void 0) _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/nonOptional/nonOptionalAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function nonOptionalAsync(wrapped, message$1) {
	return {
		kind: "schema",
		type: "non_optional",
		reference: nonOptionalAsync,
		expects: "!undefined",
		async: true,
		wrapped,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			if (dataset.value !== void 0) dataset = await this.wrapped["~run"](dataset, config$1);
			if (dataset.value === void 0) _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/null/null.ts
/* @__NO_SIDE_EFFECTS__ */
function null_(message$1) {
	return {
		kind: "schema",
		type: "null",
		reference: null_,
		expects: "null",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === null) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/nullable/nullable.ts
/* @__NO_SIDE_EFFECTS__ */
function nullable(wrapped, default_) {
	return {
		kind: "schema",
		type: "nullable",
		reference: nullable,
		expects: `(${wrapped.expects} | null)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === null) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === null) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}

//#endregion
//#region src/schemas/nullable/nullableAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function nullableAsync(wrapped, default_) {
	return {
		kind: "schema",
		type: "nullable",
		reference: nullableAsync,
		expects: `(${wrapped.expects} | null)`,
		async: true,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			if (dataset.value === null) {
				if (this.default !== void 0) dataset.value = await /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === null) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}

//#endregion
//#region src/schemas/nullish/nullish.ts
/* @__NO_SIDE_EFFECTS__ */
function nullish(wrapped, default_) {
	return {
		kind: "schema",
		type: "nullish",
		reference: nullish,
		expects: `(${wrapped.expects} | null | undefined)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === null || dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === null || dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}

//#endregion
//#region src/schemas/nullish/nullishAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function nullishAsync(wrapped, default_) {
	return {
		kind: "schema",
		type: "nullish",
		reference: nullishAsync,
		expects: `(${wrapped.expects} | null | undefined)`,
		async: true,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			if (dataset.value === null || dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = await /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === null || dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}

//#endregion
//#region src/schemas/number/number.ts
/* @__NO_SIDE_EFFECTS__ */
function number(message$1) {
	return {
		kind: "schema",
		type: "number",
		reference: number,
		expects: "number",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "number" && !isNaN(dataset.value)) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/object/object.ts
/* @__NO_SIDE_EFFECTS__ */
function dist_object(entries$1, message$1) {
	return {
		kind: "schema",
		type: "object",
		reference: dist_object,
		expects: "Object",
		async: false,
		entries: entries$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const key in this.entries) {
					const valueSchema = this.entries[key];
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value$1 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
						const valueDataset = valueSchema["~run"]({ value: value$1 }, config$1);
						if (valueDataset.issues) {
							const pathItem = {
								type: "object",
								origin: "value",
								input,
								key,
								value: value$1
							};
							for (const issue of valueDataset.issues) {
								if (issue.path) issue.path.unshift(pathItem);
								else issue.path = [pathItem];
								dataset.issues?.push(issue);
							}
							if (!dataset.issues) dataset.issues = valueDataset.issues;
							if (config$1.abortEarly) {
								dataset.typed = false;
								break;
							}
						}
						if (!valueDataset.typed) dataset.typed = false;
						dataset.value[key] = valueDataset.value;
					} else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
					else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
						_addIssue(this, "key", dataset, config$1, {
							input: void 0,
							expected: `"${key}"`,
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						if (config$1.abortEarly) break;
					}
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/object/objectAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function objectAsync(entries$1, message$1) {
	return {
		kind: "schema",
		type: "object",
		reference: objectAsync,
		expects: "Object",
		async: true,
		entries: entries$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				const valueDatasets = await Promise.all(Object.entries(this.entries).map(async ([key, valueSchema]) => {
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value$1 = key in input ? input[key] : await /* @__PURE__ */ getDefault(valueSchema);
						return [
							key,
							value$1,
							valueSchema,
							await valueSchema["~run"]({ value: value$1 }, config$1)
						];
					}
					return [
						key,
						input[key],
						valueSchema,
						null
					];
				}));
				for (const [key, value$1, valueSchema, valueDataset] of valueDatasets) if (valueDataset) {
					if (valueDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!valueDataset.typed) dataset.typed = false;
					dataset.value[key] = valueDataset.value;
				} else if (valueSchema.fallback !== void 0) dataset.value[key] = await /* @__PURE__ */ getFallback(valueSchema);
				else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
					_addIssue(this, "key", dataset, config$1, {
						input: void 0,
						expected: `"${key}"`,
						path: [{
							type: "object",
							origin: "key",
							input,
							key,
							value: value$1
						}]
					});
					if (config$1.abortEarly) break;
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/objectWithRest/objectWithRest.ts
/* @__NO_SIDE_EFFECTS__ */
function objectWithRest(entries$1, rest, message$1) {
	return {
		kind: "schema",
		type: "object_with_rest",
		reference: objectWithRest,
		expects: "Object",
		async: false,
		entries: entries$1,
		rest,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const key in this.entries) {
					const valueSchema = this.entries[key];
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value$1 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
						const valueDataset = valueSchema["~run"]({ value: value$1 }, config$1);
						if (valueDataset.issues) {
							const pathItem = {
								type: "object",
								origin: "value",
								input,
								key,
								value: value$1
							};
							for (const issue of valueDataset.issues) {
								if (issue.path) issue.path.unshift(pathItem);
								else issue.path = [pathItem];
								dataset.issues?.push(issue);
							}
							if (!dataset.issues) dataset.issues = valueDataset.issues;
							if (config$1.abortEarly) {
								dataset.typed = false;
								break;
							}
						}
						if (!valueDataset.typed) dataset.typed = false;
						dataset.value[key] = valueDataset.value;
					} else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
					else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
						_addIssue(this, "key", dataset, config$1, {
							input: void 0,
							expected: `"${key}"`,
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						if (config$1.abortEarly) break;
					}
				}
				if (!dataset.issues || !config$1.abortEarly) {
					for (const key in input) if (/* @__PURE__ */ _isValidObjectKey(input, key) && !(key in this.entries)) {
						const valueDataset = this.rest["~run"]({ value: input[key] }, config$1);
						if (valueDataset.issues) {
							const pathItem = {
								type: "object",
								origin: "value",
								input,
								key,
								value: input[key]
							};
							for (const issue of valueDataset.issues) {
								if (issue.path) issue.path.unshift(pathItem);
								else issue.path = [pathItem];
								dataset.issues?.push(issue);
							}
							if (!dataset.issues) dataset.issues = valueDataset.issues;
							if (config$1.abortEarly) {
								dataset.typed = false;
								break;
							}
						}
						if (!valueDataset.typed) dataset.typed = false;
						dataset.value[key] = valueDataset.value;
					}
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/objectWithRest/objectWithRestAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function objectWithRestAsync(entries$1, rest, message$1) {
	return {
		kind: "schema",
		type: "object_with_rest",
		reference: objectWithRestAsync,
		expects: "Object",
		async: true,
		entries: entries$1,
		rest,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				const [normalDatasets, restDatasets] = await Promise.all([Promise.all(Object.entries(this.entries).map(async ([key, valueSchema]) => {
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value$1 = key in input ? input[key] : await /* @__PURE__ */ getDefault(valueSchema);
						return [
							key,
							value$1,
							valueSchema,
							await valueSchema["~run"]({ value: value$1 }, config$1)
						];
					}
					return [
						key,
						input[key],
						valueSchema,
						null
					];
				})), Promise.all(Object.entries(input).filter(([key]) => /* @__PURE__ */ _isValidObjectKey(input, key) && !(key in this.entries)).map(async ([key, value$1]) => [
					key,
					value$1,
					await this.rest["~run"]({ value: value$1 }, config$1)
				]))]);
				for (const [key, value$1, valueSchema, valueDataset] of normalDatasets) if (valueDataset) {
					if (valueDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!valueDataset.typed) dataset.typed = false;
					dataset.value[key] = valueDataset.value;
				} else if (valueSchema.fallback !== void 0) dataset.value[key] = await /* @__PURE__ */ getFallback(valueSchema);
				else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
					_addIssue(this, "key", dataset, config$1, {
						input: void 0,
						expected: `"${key}"`,
						path: [{
							type: "object",
							origin: "key",
							input,
							key,
							value: value$1
						}]
					});
					if (config$1.abortEarly) break;
				}
				if (!dataset.issues || !config$1.abortEarly) for (const [key, value$1, valueDataset] of restDatasets) {
					if (valueDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!valueDataset.typed) dataset.typed = false;
					dataset.value[key] = valueDataset.value;
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/optional/optional.ts
/* @__NO_SIDE_EFFECTS__ */
function optional(wrapped, default_) {
	return {
		kind: "schema",
		type: "optional",
		reference: optional,
		expects: `(${wrapped.expects} | undefined)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}

//#endregion
//#region src/schemas/optional/optionalAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function optionalAsync(wrapped, default_) {
	return {
		kind: "schema",
		type: "optional",
		reference: optionalAsync,
		expects: `(${wrapped.expects} | undefined)`,
		async: true,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			if (dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = await /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}

//#endregion
//#region src/schemas/picklist/picklist.ts
/* @__NO_SIDE_EFFECTS__ */
function picklist(options, message$1) {
	return {
		kind: "schema",
		type: "picklist",
		reference: picklist,
		expects: /* @__PURE__ */ _joinExpects(options.map(_stringify), "|"),
		async: false,
		options,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (this.options.includes(dataset.value)) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/promise/promise.ts
/* @__NO_SIDE_EFFECTS__ */
function promise(message$1) {
	return {
		kind: "schema",
		type: "promise",
		reference: promise,
		expects: "Promise",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value instanceof Promise) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/record/record.ts
/* @__NO_SIDE_EFFECTS__ */
function record(key, value$1, message$1) {
	return {
		kind: "schema",
		type: "record",
		reference: record,
		expects: "Object",
		async: false,
		key,
		value: value$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const entryKey in input) if (/* @__PURE__ */ _isValidObjectKey(input, entryKey)) {
					const entryValue = input[entryKey];
					const keyDataset = this.key["~run"]({ value: entryKey }, config$1);
					if (keyDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "key",
							input,
							key: entryKey,
							value: entryValue
						};
						for (const issue of keyDataset.issues) {
							issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = keyDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					const valueDataset = this.value["~run"]({ value: entryValue }, config$1);
					if (valueDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "value",
							input,
							key: entryKey,
							value: entryValue
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!keyDataset.typed || !valueDataset.typed) dataset.typed = false;
					if (keyDataset.typed) dataset.value[keyDataset.value] = valueDataset.value;
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/record/recordAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function recordAsync(key, value$1, message$1) {
	return {
		kind: "schema",
		type: "record",
		reference: recordAsync,
		expects: "Object",
		async: true,
		key,
		value: value$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				const datasets = await Promise.all(Object.entries(input).filter(([key$1]) => /* @__PURE__ */ _isValidObjectKey(input, key$1)).map(([entryKey, entryValue]) => Promise.all([
					entryKey,
					entryValue,
					this.key["~run"]({ value: entryKey }, config$1),
					this.value["~run"]({ value: entryValue }, config$1)
				])));
				for (const [entryKey, entryValue, keyDataset, valueDataset] of datasets) {
					if (keyDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "key",
							input,
							key: entryKey,
							value: entryValue
						};
						for (const issue of keyDataset.issues) {
							issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = keyDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (valueDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "value",
							input,
							key: entryKey,
							value: entryValue
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!keyDataset.typed || !valueDataset.typed) dataset.typed = false;
					if (keyDataset.typed) dataset.value[keyDataset.value] = valueDataset.value;
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/set/set.ts
/* @__NO_SIDE_EFFECTS__ */
function set(value$1, message$1) {
	return {
		kind: "schema",
		type: "set",
		reference: set,
		expects: "Set",
		async: false,
		value: value$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input instanceof Set) {
				dataset.typed = true;
				dataset.value = /* @__PURE__ */ new Set();
				for (const inputValue of input) {
					const valueDataset = this.value["~run"]({ value: inputValue }, config$1);
					if (valueDataset.issues) {
						const pathItem = {
							type: "set",
							origin: "value",
							input,
							key: null,
							value: inputValue
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!valueDataset.typed) dataset.typed = false;
					dataset.value.add(valueDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/set/setAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function setAsync(value$1, message$1) {
	return {
		kind: "schema",
		type: "set",
		reference: setAsync,
		expects: "Set",
		async: true,
		value: value$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const input = dataset.value;
			if (input instanceof Set) {
				dataset.typed = true;
				dataset.value = /* @__PURE__ */ new Set();
				const valueDatasets = await Promise.all([...input].map(async (inputValue) => [inputValue, await this.value["~run"]({ value: inputValue }, config$1)]));
				for (const [inputValue, valueDataset] of valueDatasets) {
					if (valueDataset.issues) {
						const pathItem = {
							type: "set",
							origin: "value",
							input,
							key: null,
							value: inputValue
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!valueDataset.typed) dataset.typed = false;
					dataset.value.add(valueDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/strictObject/strictObject.ts
/* @__NO_SIDE_EFFECTS__ */
function strictObject(entries$1, message$1) {
	return {
		kind: "schema",
		type: "strict_object",
		reference: strictObject,
		expects: "Object",
		async: false,
		entries: entries$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const key in this.entries) {
					const valueSchema = this.entries[key];
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value$1 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
						const valueDataset = valueSchema["~run"]({ value: value$1 }, config$1);
						if (valueDataset.issues) {
							const pathItem = {
								type: "object",
								origin: "value",
								input,
								key,
								value: value$1
							};
							for (const issue of valueDataset.issues) {
								if (issue.path) issue.path.unshift(pathItem);
								else issue.path = [pathItem];
								dataset.issues?.push(issue);
							}
							if (!dataset.issues) dataset.issues = valueDataset.issues;
							if (config$1.abortEarly) {
								dataset.typed = false;
								break;
							}
						}
						if (!valueDataset.typed) dataset.typed = false;
						dataset.value[key] = valueDataset.value;
					} else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
					else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
						_addIssue(this, "key", dataset, config$1, {
							input: void 0,
							expected: `"${key}"`,
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						if (config$1.abortEarly) break;
					}
				}
				if (!dataset.issues || !config$1.abortEarly) {
					for (const key in input) if (!(key in this.entries)) {
						_addIssue(this, "key", dataset, config$1, {
							input: key,
							expected: "never",
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						break;
					}
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/strictObject/strictObjectAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function strictObjectAsync(entries$1, message$1) {
	return {
		kind: "schema",
		type: "strict_object",
		reference: strictObjectAsync,
		expects: "Object",
		async: true,
		entries: entries$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				const valueDatasets = await Promise.all(Object.entries(this.entries).map(async ([key, valueSchema]) => {
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value$1 = key in input ? input[key] : await /* @__PURE__ */ getDefault(valueSchema);
						return [
							key,
							value$1,
							valueSchema,
							await valueSchema["~run"]({ value: value$1 }, config$1)
						];
					}
					return [
						key,
						input[key],
						valueSchema,
						null
					];
				}));
				for (const [key, value$1, valueSchema, valueDataset] of valueDatasets) if (valueDataset) {
					if (valueDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!valueDataset.typed) dataset.typed = false;
					dataset.value[key] = valueDataset.value;
				} else if (valueSchema.fallback !== void 0) dataset.value[key] = await /* @__PURE__ */ getFallback(valueSchema);
				else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
					_addIssue(this, "key", dataset, config$1, {
						input: void 0,
						expected: `"${key}"`,
						path: [{
							type: "object",
							origin: "key",
							input,
							key,
							value: value$1
						}]
					});
					if (config$1.abortEarly) break;
				}
				if (!dataset.issues || !config$1.abortEarly) {
					for (const key in input) if (!(key in this.entries)) {
						_addIssue(this, "key", dataset, config$1, {
							input: key,
							expected: "never",
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						break;
					}
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/strictTuple/strictTuple.ts
/* @__NO_SIDE_EFFECTS__ */
function strictTuple(items, message$1) {
	return {
		kind: "schema",
		type: "strict_tuple",
		reference: strictTuple,
		expects: "Array",
		async: false,
		items,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < this.items.length; key++) {
					const value$1 = input[key];
					const itemDataset = this.items[key]["~run"]({ value: value$1 }, config$1);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
				if (!(dataset.issues && config$1.abortEarly) && this.items.length < input.length) _addIssue(this, "type", dataset, config$1, {
					input: input[this.items.length],
					expected: "never",
					path: [{
						type: "array",
						origin: "value",
						input,
						key: this.items.length,
						value: input[this.items.length]
					}]
				});
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/strictTuple/strictTupleAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function strictTupleAsync(items, message$1) {
	return {
		kind: "schema",
		type: "strict_tuple",
		reference: strictTupleAsync,
		expects: "Array",
		async: true,
		items,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				const itemDatasets = await Promise.all(this.items.map(async (item, key) => {
					const value$1 = input[key];
					return [
						key,
						value$1,
						await item["~run"]({ value: value$1 }, config$1)
					];
				}));
				for (const [key, value$1, itemDataset] of itemDatasets) {
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
				if (!(dataset.issues && config$1.abortEarly) && this.items.length < input.length) _addIssue(this, "type", dataset, config$1, {
					input: input[this.items.length],
					expected: "never",
					path: [{
						type: "array",
						origin: "value",
						input,
						key: this.items.length,
						value: input[this.items.length]
					}]
				});
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/string/string.ts
/* @__NO_SIDE_EFFECTS__ */
function string(message$1) {
	return {
		kind: "schema",
		type: "string",
		reference: string,
		expects: "string",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "string") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/symbol/symbol.ts
/* @__NO_SIDE_EFFECTS__ */
function symbol(message$1) {
	return {
		kind: "schema",
		type: "symbol",
		reference: symbol,
		expects: "symbol",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "symbol") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/tuple/tuple.ts
/* @__NO_SIDE_EFFECTS__ */
function tuple(items, message$1) {
	return {
		kind: "schema",
		type: "tuple",
		reference: tuple,
		expects: "Array",
		async: false,
		items,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < this.items.length; key++) {
					const value$1 = input[key];
					const itemDataset = this.items[key]["~run"]({ value: value$1 }, config$1);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/tuple/tupleAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function tupleAsync(items, message$1) {
	return {
		kind: "schema",
		type: "tuple",
		reference: tupleAsync,
		expects: "Array",
		async: true,
		items,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				const itemDatasets = await Promise.all(this.items.map(async (item, key) => {
					const value$1 = input[key];
					return [
						key,
						value$1,
						await item["~run"]({ value: value$1 }, config$1)
					];
				}));
				for (const [key, value$1, itemDataset] of itemDatasets) {
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/tupleWithRest/tupleWithRest.ts
/* @__NO_SIDE_EFFECTS__ */
function tupleWithRest(items, rest, message$1) {
	return {
		kind: "schema",
		type: "tuple_with_rest",
		reference: tupleWithRest,
		expects: "Array",
		async: false,
		items,
		rest,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < this.items.length; key++) {
					const value$1 = input[key];
					const itemDataset = this.items[key]["~run"]({ value: value$1 }, config$1);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
				if (!dataset.issues || !config$1.abortEarly) for (let key = this.items.length; key < input.length; key++) {
					const value$1 = input[key];
					const itemDataset = this.rest["~run"]({ value: value$1 }, config$1);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/tupleWithRest/tupleWithRestAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function tupleWithRestAsync(items, rest, message$1) {
	return {
		kind: "schema",
		type: "tuple_with_rest",
		reference: tupleWithRestAsync,
		expects: "Array",
		async: true,
		items,
		rest,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				const [normalDatasets, restDatasets] = await Promise.all([Promise.all(this.items.map(async (item, key) => {
					const value$1 = input[key];
					return [
						key,
						value$1,
						await item["~run"]({ value: value$1 }, config$1)
					];
				})), Promise.all(input.slice(this.items.length).map(async (value$1, key) => {
					return [
						key + this.items.length,
						value$1,
						await this.rest["~run"]({ value: value$1 }, config$1)
					];
				}))]);
				for (const [key, value$1, itemDataset] of normalDatasets) {
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
				if (!dataset.issues || !config$1.abortEarly) for (const [key, value$1, itemDataset] of restDatasets) {
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value$1
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/undefined/undefined.ts
/* @__NO_SIDE_EFFECTS__ */
function undefined_(message$1) {
	return {
		kind: "schema",
		type: "undefined",
		reference: undefined_,
		expects: "undefined",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === void 0) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/undefinedable/undefinedable.ts
/* @__NO_SIDE_EFFECTS__ */
function undefinedable(wrapped, default_) {
	return {
		kind: "schema",
		type: "undefinedable",
		reference: undefinedable,
		expects: `(${wrapped.expects} | undefined)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}

//#endregion
//#region src/schemas/undefinedable/undefinedableAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function undefinedableAsync(wrapped, default_) {
	return {
		kind: "schema",
		type: "undefinedable",
		reference: undefinedableAsync,
		expects: `(${wrapped.expects} | undefined)`,
		async: true,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			if (dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = await /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}

//#endregion
//#region src/schemas/union/utils/_subIssues/_subIssues.ts
/**
* Returns the sub issues of the provided datasets for the union issue.
*
* @param datasets The datasets.
*
* @returns The sub issues.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _subIssues(datasets) {
	let issues;
	if (datasets) for (const dataset of datasets) if (issues) issues.push(...dataset.issues);
	else issues = dataset.issues;
	return issues;
}

//#endregion
//#region src/schemas/union/union.ts
/* @__NO_SIDE_EFFECTS__ */
function union(options, message$1) {
	return {
		kind: "schema",
		type: "union",
		reference: union,
		expects: /* @__PURE__ */ _joinExpects(options.map((option) => option.expects), "|"),
		async: false,
		options,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			let validDataset;
			let typedDatasets;
			let untypedDatasets;
			for (const schema of this.options) {
				const optionDataset = schema["~run"]({ value: dataset.value }, config$1);
				if (optionDataset.typed) if (optionDataset.issues) if (typedDatasets) typedDatasets.push(optionDataset);
				else typedDatasets = [optionDataset];
				else {
					validDataset = optionDataset;
					break;
				}
				else if (untypedDatasets) untypedDatasets.push(optionDataset);
				else untypedDatasets = [optionDataset];
			}
			if (validDataset) return validDataset;
			if (typedDatasets) {
				if (typedDatasets.length === 1) return typedDatasets[0];
				_addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(typedDatasets) });
				dataset.typed = true;
			} else if (untypedDatasets?.length === 1) return untypedDatasets[0];
			else _addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(untypedDatasets) });
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/union/unionAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function unionAsync(options, message$1) {
	return {
		kind: "schema",
		type: "union",
		reference: unionAsync,
		expects: /* @__PURE__ */ _joinExpects(options.map((option) => option.expects), "|"),
		async: true,
		options,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			let validDataset;
			let typedDatasets;
			let untypedDatasets;
			for (const schema of this.options) {
				const optionDataset = await schema["~run"]({ value: dataset.value }, config$1);
				if (optionDataset.typed) if (optionDataset.issues) if (typedDatasets) typedDatasets.push(optionDataset);
				else typedDatasets = [optionDataset];
				else {
					validDataset = optionDataset;
					break;
				}
				else if (untypedDatasets) untypedDatasets.push(optionDataset);
				else untypedDatasets = [optionDataset];
			}
			if (validDataset) return validDataset;
			if (typedDatasets) {
				if (typedDatasets.length === 1) return typedDatasets[0];
				_addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(typedDatasets) });
				dataset.typed = true;
			} else if (untypedDatasets?.length === 1) return untypedDatasets[0];
			else _addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(untypedDatasets) });
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/unknown/unknown.ts
/**
* Creates a unknown schema.
*
* @returns A unknown schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function unknown() {
	return {
		kind: "schema",
		type: "unknown",
		reference: unknown,
		expects: "unknown",
		async: false,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset) {
			dataset.typed = true;
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/variant/variant.ts
/* @__NO_SIDE_EFFECTS__ */
function variant(key, options, message$1) {
	return {
		kind: "schema",
		type: "variant",
		reference: variant,
		expects: "Object",
		async: false,
		key,
		options,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				let outputDataset;
				let maxDiscriminatorPriority = 0;
				let invalidDiscriminatorKey = this.key;
				let expectedDiscriminators = [];
				const parseOptions = (variant$1, allKeys) => {
					for (const schema of variant$1.options) {
						if (schema.type === "variant") parseOptions(schema, new Set(allKeys).add(schema.key));
						else {
							let keysAreValid = true;
							let currentPriority = 0;
							for (const currentKey of allKeys) {
								const discriminatorSchema = schema.entries[currentKey];
								if (currentKey in input ? discriminatorSchema["~run"]({
									typed: false,
									value: input[currentKey]
								}, { abortEarly: true }).issues : discriminatorSchema.type !== "exact_optional" && discriminatorSchema.type !== "optional" && discriminatorSchema.type !== "nullish") {
									keysAreValid = false;
									if (invalidDiscriminatorKey !== currentKey && (maxDiscriminatorPriority < currentPriority || maxDiscriminatorPriority === currentPriority && currentKey in input && !(invalidDiscriminatorKey in input))) {
										maxDiscriminatorPriority = currentPriority;
										invalidDiscriminatorKey = currentKey;
										expectedDiscriminators = [];
									}
									if (invalidDiscriminatorKey === currentKey) expectedDiscriminators.push(schema.entries[currentKey].expects);
									break;
								}
								currentPriority++;
							}
							if (keysAreValid) {
								const optionDataset = schema["~run"]({ value: input }, config$1);
								if (!outputDataset || !outputDataset.typed && optionDataset.typed) outputDataset = optionDataset;
							}
						}
						if (outputDataset && !outputDataset.issues) break;
					}
				};
				parseOptions(this, new Set([this.key]));
				if (outputDataset) return outputDataset;
				_addIssue(this, "type", dataset, config$1, {
					input: input[invalidDiscriminatorKey],
					expected: /* @__PURE__ */ _joinExpects(expectedDiscriminators, "|"),
					path: [{
						type: "object",
						origin: "value",
						input,
						key: invalidDiscriminatorKey,
						value: input[invalidDiscriminatorKey]
					}]
				});
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/variant/variantAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function variantAsync(key, options, message$1) {
	return {
		kind: "schema",
		type: "variant",
		reference: variantAsync,
		expects: "Object",
		async: true,
		key,
		options,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				let outputDataset;
				let maxDiscriminatorPriority = 0;
				let invalidDiscriminatorKey = this.key;
				let expectedDiscriminators = [];
				const parseOptions = async (variant$1, allKeys) => {
					for (const schema of variant$1.options) {
						if (schema.type === "variant") await parseOptions(schema, new Set(allKeys).add(schema.key));
						else {
							let keysAreValid = true;
							let currentPriority = 0;
							for (const currentKey of allKeys) {
								const discriminatorSchema = schema.entries[currentKey];
								if (currentKey in input ? (await discriminatorSchema["~run"]({
									typed: false,
									value: input[currentKey]
								}, { abortEarly: true })).issues : discriminatorSchema.type !== "exact_optional" && discriminatorSchema.type !== "optional" && discriminatorSchema.type !== "nullish") {
									keysAreValid = false;
									if (invalidDiscriminatorKey !== currentKey && (maxDiscriminatorPriority < currentPriority || maxDiscriminatorPriority === currentPriority && currentKey in input && !(invalidDiscriminatorKey in input))) {
										maxDiscriminatorPriority = currentPriority;
										invalidDiscriminatorKey = currentKey;
										expectedDiscriminators = [];
									}
									if (invalidDiscriminatorKey === currentKey) expectedDiscriminators.push(schema.entries[currentKey].expects);
									break;
								}
								currentPriority++;
							}
							if (keysAreValid) {
								const optionDataset = await schema["~run"]({ value: input }, config$1);
								if (!outputDataset || !outputDataset.typed && optionDataset.typed) outputDataset = optionDataset;
							}
						}
						if (outputDataset && !outputDataset.issues) break;
					}
				};
				await parseOptions(this, new Set([this.key]));
				if (outputDataset) return outputDataset;
				_addIssue(this, "type", dataset, config$1, {
					input: input[invalidDiscriminatorKey],
					expected: /* @__PURE__ */ _joinExpects(expectedDiscriminators, "|"),
					path: [{
						type: "object",
						origin: "value",
						input,
						key: invalidDiscriminatorKey,
						value: input[invalidDiscriminatorKey]
					}]
				});
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/schemas/void/void.ts
/* @__NO_SIDE_EFFECTS__ */
function void_(message$1) {
	return {
		kind: "schema",
		type: "void",
		reference: void_,
		expects: "void",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === void 0) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}

//#endregion
//#region src/methods/keyof/keyof.ts
/* @__NO_SIDE_EFFECTS__ */
function keyof(schema, message$1) {
	return /* @__PURE__ */ picklist(Object.keys(schema.entries), message$1);
}

//#endregion
//#region src/methods/message/message.ts
/**
* Changes the local message configuration of a schema.
*
* @param schema The schema to configure.
* @param message_ The error message.
*
* @returns The configured schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function dist_message(schema, message_) {
	return {
		...schema,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			return schema["~run"](dataset, {
				...config$1,
				message: message_
			});
		}
	};
}

//#endregion
//#region src/methods/omit/omit.ts
/**
* Creates a modified copy of an object schema that does not contain the
* selected entries.
*
* @param schema The schema to omit from.
* @param keys The selected entries.
*
* @returns An object schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function omit(schema, keys) {
	const entries$1 = { ...schema.entries };
	for (const key of keys) delete entries$1[key];
	return {
		...schema,
		entries: entries$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		}
	};
}

//#endregion
//#region src/methods/parse/parse.ts
/**
* Parses an unknown input based on a schema.
*
* @param schema The schema to be used.
* @param input The input to be parsed.
* @param config The parse configuration.
*
* @returns The parsed input.
*/
function parse(schema, input, config$1) {
	const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config$1));
	if (dataset.issues) throw new ValiError(dataset.issues);
	return dataset.value;
}

//#endregion
//#region src/methods/parse/parseAsync.ts
/**
* Parses an unknown input based on a schema.
*
* @param schema The schema to be used.
* @param input The input to be parsed.
* @param config The parse configuration.
*
* @returns The parsed input.
*/
async function parseAsync(schema, input, config$1) {
	const dataset = await schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config$1));
	if (dataset.issues) throw new ValiError(dataset.issues);
	return dataset.value;
}

//#endregion
//#region src/methods/parser/parser.ts
/* @__NO_SIDE_EFFECTS__ */
function parser(schema, config$1) {
	const func = (input) => parse(schema, input, config$1);
	func.schema = schema;
	func.config = config$1;
	return func;
}

//#endregion
//#region src/methods/parser/parserAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function parserAsync(schema, config$1) {
	const func = (input) => parseAsync(schema, input, config$1);
	func.schema = schema;
	func.config = config$1;
	return func;
}

//#endregion
//#region src/methods/partial/partial.ts
/* @__NO_SIDE_EFFECTS__ */
function partial(schema, keys) {
	const entries$1 = {};
	for (const key in schema.entries) entries$1[key] = !keys || keys.includes(key) ? /* @__PURE__ */ optional(schema.entries[key]) : schema.entries[key];
	return {
		...schema,
		entries: entries$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		}
	};
}

//#endregion
//#region src/methods/partial/partialAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function partialAsync(schema, keys) {
	const entries$1 = {};
	for (const key in schema.entries) entries$1[key] = !keys || keys.includes(key) ? /* @__PURE__ */ optionalAsync(schema.entries[key]) : schema.entries[key];
	return {
		...schema,
		entries: entries$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		}
	};
}

//#endregion
//#region src/methods/pick/pick.ts
/**
* Creates a modified copy of an object schema that contains only the selected
* entries.
*
* @param schema The schema to pick from.
* @param keys The selected entries.
*
* @returns An object schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function pick(schema, keys) {
	const entries$1 = {};
	for (const key of keys) entries$1[key] = schema.entries[key];
	return {
		...schema,
		entries: entries$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		}
	};
}

//#endregion
//#region src/methods/pipe/pipe.ts
/* @__NO_SIDE_EFFECTS__ */
function pipe(...pipe$1) {
	return {
		...pipe$1[0],
		pipe: pipe$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			for (const item of pipe$1) if (item.kind !== "metadata") {
				if (dataset.issues && (item.kind === "schema" || item.kind === "transformation")) {
					dataset.typed = false;
					break;
				}
				if (!dataset.issues || !config$1.abortEarly && !config$1.abortPipeEarly) dataset = item["~run"](dataset, config$1);
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/methods/pipe/pipeAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function pipeAsync(...pipe$1) {
	return {
		...pipe$1[0],
		pipe: pipe$1,
		async: true,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config$1) {
			for (const item of pipe$1) if (item.kind !== "metadata") {
				if (dataset.issues && (item.kind === "schema" || item.kind === "transformation")) {
					dataset.typed = false;
					break;
				}
				if (!dataset.issues || !config$1.abortEarly && !config$1.abortPipeEarly) dataset = await item["~run"](dataset, config$1);
			}
			return dataset;
		}
	};
}

//#endregion
//#region src/methods/required/required.ts
/* @__NO_SIDE_EFFECTS__ */
function required(schema, arg2, arg3) {
	const keys = Array.isArray(arg2) ? arg2 : void 0;
	const message$1 = Array.isArray(arg2) ? arg3 : arg2;
	const entries$1 = {};
	for (const key in schema.entries) entries$1[key] = !keys || keys.includes(key) ? /* @__PURE__ */ nonOptional(schema.entries[key], message$1) : schema.entries[key];
	return {
		...schema,
		entries: entries$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		}
	};
}

//#endregion
//#region src/methods/required/requiredAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function requiredAsync(schema, arg2, arg3) {
	const keys = Array.isArray(arg2) ? arg2 : void 0;
	const message$1 = Array.isArray(arg2) ? arg3 : arg2;
	const entries$1 = {};
	for (const key in schema.entries) entries$1[key] = !keys || keys.includes(key) ? /* @__PURE__ */ nonOptionalAsync(schema.entries[key], message$1) : schema.entries[key];
	return {
		...schema,
		entries: entries$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		}
	};
}

//#endregion
//#region src/methods/safeParse/safeParse.ts
/**
* Parses an unknown input based on a schema.
*
* @param schema The schema to be used.
* @param input The input to be parsed.
* @param config The parse configuration.
*
* @returns The parse result.
*/
/* @__NO_SIDE_EFFECTS__ */
function safeParse(schema, input, config$1) {
	const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config$1));
	return {
		typed: dataset.typed,
		success: !dataset.issues,
		output: dataset.value,
		issues: dataset.issues
	};
}

//#endregion
//#region src/methods/safeParse/safeParseAsync.ts
/**
* Parses an unknown input based on a schema.
*
* @param schema The schema to be used.
* @param input The input to be parsed.
* @param config The parse configuration.
*
* @returns The parse result.
*/
/* @__NO_SIDE_EFFECTS__ */
async function safeParseAsync(schema, input, config$1) {
	const dataset = await schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config$1));
	return {
		typed: dataset.typed,
		success: !dataset.issues,
		output: dataset.value,
		issues: dataset.issues
	};
}

//#endregion
//#region src/methods/safeParser/safeParser.ts
/* @__NO_SIDE_EFFECTS__ */
function safeParser(schema, config$1) {
	const func = (input) => /* @__PURE__ */ safeParse(schema, input, config$1);
	func.schema = schema;
	func.config = config$1;
	return func;
}

//#endregion
//#region src/methods/safeParser/safeParserAsync.ts
/* @__NO_SIDE_EFFECTS__ */
function safeParserAsync(schema, config$1) {
	const func = (input) => /* @__PURE__ */ safeParseAsync(schema, input, config$1);
	func.schema = schema;
	func.config = config$1;
	return func;
}

//#endregion
//#region src/methods/summarize/summarize.ts
/**
* Summarize the error messages of issues in a pretty-printable multi-line string.
*
* @param issues The list of issues.
*
* @returns A summary of the issues.
*
* @beta
*/
/* @__NO_SIDE_EFFECTS__ */
function summarize(issues) {
	let summary = "";
	for (const issue of issues) {
		if (summary) summary += "\n";
		summary += `× ${issue.message}`;
		const dotPath = /* @__PURE__ */ getDotPath(issue);
		if (dotPath) summary += `\n  → at ${dotPath}`;
	}
	return summary;
}

//#endregion
//#region src/methods/unwrap/unwrap.ts
/**
* Unwraps the wrapped schema.
*
* @param schema The schema to be unwrapped.
*
* @returns The unwrapped schema.
*/
/* @__NO_SIDE_EFFECTS__ */
function unwrap(schema) {
	return schema.wrapped;
}

//#endregion

;// CONCATENATED MODULE: ./src/common/log-storage/storageProvider/browserProvider/logsSchema.ts

const logsValidator = optional(array(string()), ()=>[]);

;// CONCATENATED MODULE: ./src/common/log-storage/storageProvider/browserProvider/BrowserLogStorageProvider.ts
function BrowserLogStorageProvider_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function BrowserLogStorageProvider_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                BrowserLogStorageProvider_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                BrowserLogStorageProvider_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
/**
 * @module BrowserLogStorageProvider
 * Provides an implementation of the LogStorageProvider interface for storing logs in the browser's storage.
 */ 


/**
 * The key used to store logs in the browser's storage.
 * @constant
 */ const LOGS_STORAGE_KEY = 'logs.storage.key';
/**
 * Implements the LogStorageProvider interface to provide mechanisms for storing,
 * retrieving, and clearing logs in the browser's storage.
 *
 * @class
 * @implements {LogStorageProvider}
 */ class BrowserLogStorageProvider {
    /**
     * Stores the provided logs in the browser's storage.
     *
     * @param logs - The logs to store.
     * @returns Resolves once the logs have been stored.
     */ set(logs) {
        return browserApi.storage.set(LOGS_STORAGE_KEY, logs);
    }
    /**
     * Retrieves the logs from the browser's storage.
     *
     * @returns Resolves with the retrieved logs. If no logs are found, resolves with an empty array.
     */ get() {
        return BrowserLogStorageProvider_async_to_generator(function*() {
            const logsFromStorage = yield browserApi.storage.get(LOGS_STORAGE_KEY);
            let logs;
            try {
                logs = parse(logsValidator, logsFromStorage);
            } catch (e) {
                // we use here simple console, because this module is used in the logger.
                // eslint-disable-next-line no-console
                console.error(`Error parsing logs from storage: ${e}`, 'Setting logs to the empty array.');
                logs = [];
            }
            return logs;
        })();
    }
    /**
     * Clears the logs from the browser's storage.
     *
     * @returns Resolves once the logs have been cleared.
     */ clear() {
        return browserApi.storage.remove(LOGS_STORAGE_KEY);
    }
}

;// CONCATENATED MODULE: ./src/common/log-storage/storageProvider/browserProvider/index.ts


;// CONCATENATED MODULE: ./src/common/log-storage/storageProvider/memoryProvider/MemoryLogStorageProvider.ts
/**
 * @module MemoryLogStorageProvider
 * Provides an implementation of the LogStorageProvider interface for storing logs in memory.
 */ /**
 * Implements the LogStorageProvider interface to provide mechanisms for storing,
 * retrieving, and clearing logs in memory.
 *
 * @class
 * @implements {LogStorageProvider}
 */ class MemoryLogStorageProvider {
    /**
     * Stores the provided logs in memory.
     *
     * @param logs - The logs to store.
     * @returns A promise that resolves once the logs have been stored.
     */ set(logs) {
        this.logs = logs;
        return Promise.resolve();
    }
    /**
     * Retrieves the logs from memory.
     *
     * @returns A promise that resolves with the retrieved logs.
     */ get() {
        return Promise.resolve(this.logs);
    }
    /**
     * Clears the logs from memory.
     *
     * @returns A promise that resolves once the logs have been cleared.
     */ clear() {
        this.logs = [];
        return Promise.resolve();
    }
    constructor(){
        /**
     * Holds the logs in memory.
     */ this.logs = [];
    }
}

;// CONCATENATED MODULE: ./src/common/log-storage/LogStorageManager.ts
function LogStorageManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function LogStorageManager_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                LogStorageManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                LogStorageManager_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}




/**
 * Manages the storage mechanism for logs, allowing for dynamic switching
 * between different storage providers based on the debug mode setting.
 * We store logs to facilitate exporting when a user sends logs to the server.
 * Storing logs in memory is unsuitable, as service worker reloads frequently.
 * Therefore, we also use browser storage, which preserves logs across reloads.
 */ class LogStorageManager {
    /**
     * Checks the debug mode setting and switches the storage provider if necessary.
     * If a switch occurs, logs from the old provider are transferred to the new provider.
     *
     * @param {boolean} isDebugModeEnabled - Indicates if debug mode is enabled.
     */ checkAndSwitchStorage(isDebugModeEnabled) {
        return LogStorageManager_async_to_generator(function*() {
            const newStorage = isDebugModeEnabled ? new BrowserLogStorageProvider() : new MemoryLogStorageProvider();
            if (!(this.currentStorage instanceof newStorage.constructor)) {
                const currentLogs = yield this.currentStorage.get();
                // Retrieve logs from the new storage before switching:
                // - For BrowserLogStorageProvider: This ensures we don't lose logs during service worker restarts.
                // - For MemoryLogStorageProvider: Typically returns an empty array as it starts fresh.
                const oldLogs = yield newStorage.get();
                const logs = oldLogs.concat(currentLogs);
                yield this.currentStorage.clear();
                this.currentStorage = newStorage;
                yield this.currentStorage.set(logs);
            }
        }).call(this);
    }
    /**
     * Retrieves the current storage provider.
     *
     * @returns {LogStorageProvider} - The current storage provider.
     */ getStorage() {
        return this.currentStorage;
    }
    /**
     * Creates a new instance of the LogStorageManager.
     *
     * @param {LogStorageProvider} storage - The initial storage provider to use.
     */ constructor(storage){
        this.currentStorage = storage;
        this.checkAndSwitchStorage = this.checkAndSwitchStorage.bind(this);
        // Listen for changes in the debug mode setting and switch storage accordingly.
        notifier.addSpecifiedListener(notifier.types.SETTING_UPDATED, (settingId, value)=>LogStorageManager_async_to_generator(function*() {
                if (settingId === SETTINGS_IDS.DEBUG_MODE_ENABLED) {
                    yield this.checkAndSwitchStorage(value);
                }
            }).call(this));
    }
}
/**
 * Default instance of the LogStorageManager, initialized with MemoryLogStorageProvider.
 */ const logStorageManager = new LogStorageManager(new MemoryLogStorageProvider());

;// CONCATENATED MODULE: ./src/common/log-storage/log-storage.ts
function log_storage_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function log_storage_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                log_storage_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                log_storage_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}


const MAX_LOGS_SIZE_ELEMENTS = 1000;
const SAVE_STORAGE_LOGS_TIMEOUT_MS = 5 * 1000; // 5 sec
/**
 * Class representing a log storage system.
 * @implements {LogStorageInterface}
 */ class LogStorage {
    /**
     * Returns logs as a string
     */ getLogsString() {
        return log_storage_async_to_generator(function*() {
            const logs = yield this.getLogs();
            return logs.join('\n');
        }).call(this);
    }
    /**
     * Returns logs from storage merged with current logs
     */ getLogs() {
        return log_storage_async_to_generator(function*() {
            const storage = logStorageManager.getStorage();
            const storageLogs = yield storage.get();
            if (!storageLogs) {
                return this.logs;
            }
            return storageLogs.concat(this.logs);
        }).call(this);
    }
    /**
     * Saves all logs to storage and clears current log
     */ saveLogsToStorage() {
        return log_storage_async_to_generator(function*() {
            let logs = yield this.getLogs();
            this.logs = [];
            logs = this.limitLogSize(logs);
            const storage = logStorageManager.getStorage();
            yield storage.set(logs);
        }).call(this);
    }
    /**
     * Creates a new LogStorage instance.
     * @param [maxLogSizeElements=MAX_LOGS_SIZE_ELEMENTS] Maximum number of log elements.
     * @param [saveStorageLogsTimeoutMs=SAVE_STORAGE_LOGS_TIMEOUT_MS] Timeout for saving logs to storage in
     *  milliseconds.
     */ constructor(maxLogSizeElements = MAX_LOGS_SIZE_ELEMENTS, saveStorageLogsTimeoutMs = SAVE_STORAGE_LOGS_TIMEOUT_MS){
        /**
     * Array of log strings.
     */ this.logs = [];
        /**
     * Throttled function to save logs to storage.
     */ this.throttledLogsSaver = throttle_default()(this.saveLogsToStorage, SAVE_STORAGE_LOGS_TIMEOUT_MS);
        /**
     * Saves logs to storage
     * @param logStrings
     */ this.addLog = (...logStrings)=>{
            const logString = logStrings.map((arg)=>{
                try {
                    return JSON.stringify(arg);
                } catch (e) {
                    return arg;
                }
            }).join(' ');
            this.logs.push(logString);
            this.throttledLogsSaver();
        };
        /**
     * Limits log size to maxLogSizeElements
     * @param logs
     */ this.limitLogSize = (logs)=>{
            return logs.slice(-this.maxLogSizeElements);
        };
        this.maxLogSizeElements = maxLogSizeElements;
        this.saveStorageLogsTimeoutMs = saveStorageLogsTimeoutMs;
    }
}
const logStorage = new LogStorage(MAX_LOGS_SIZE_ELEMENTS);

;// CONCATENATED MODULE: ./src/common/log-storage/index.ts


;// CONCATENATED MODULE: ./src/common/logger.ts
function logger_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function logger_async_to_generator(fn) {
    return function() {
        var self1 = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self1, args);
            function _next(value) {
                logger_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                logger_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function logger_ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        logger_ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
/* eslint-disable no-console */ 


// @ts-ignore - Importing from 'background/config' throws error
const IS_DEV = {"BROWSER":"chrome","BUILD_ENV":"release","STAGE_ENV":"prod","PRIVACY":"action=privacy&from=popup&app=vpn_extension","EULA":"action=eula&from=popup&app=vpn_extension","UPGRADE_LICENSE":"action=buy_license&from=popup&app=vpn_extension","SUBSCRIBE":"action=subscribe&from=popup_connections_limit&app=vpn_extension","LIMITED_OFFER":"action=limited_offer&from=popup&app=vpn_extension","LIMITED_OFFER_RU":"action=limited_offer_ru&from=popup&app=vpn_extension","DEVICE_COUNT":"action=devices_count&from=popup_connections_limit&app=vpn_extension","OTHER_PRODUCTS":"action=other_products&from=popup&app=vpn_extension","POPUP_DEFAULT_SUPPORT":"action=support&from=popup&app=vpn_extension","WEBSITE":"action=adguard_site&from=options_screen&app=vpn_extension","FAQ":"action=faq&from=options_screen&app=vpn_extension","SUGGEST_FEATURE":"action=suggest_feature&from=options_screen&app=vpn_extension","THANK_YOU_PAGE":"action=thank_you_v2&from=background_page&app=vpn_extension","FIREFOX_THANK_YOU_PAGE":"action=thank_you_v2_firefox&from=background_page&app=vpn_extension","EDIT_ACCOUNT":"action=account_settings&from=options_screen&app=vpn_extension","UNINSTALL_PAGE":"action=adguard_uninstal_ext&from=background_page&app=vpn_extension","ADGUARD_DNS_KB":"action=adguard_dns_kb&from=options_screen&app=vpn_extension","ADGUARD_DNS_PROVIDERS_KB":"action=adguard_dns_providers_kb&from=options_screen&app=vpn_extension","COMPARE_PAGE":"action=compare&from=popup&app=vpn_extension","VPN_BLOCKED_GET_APP":"action=vpn_blocked_get_app&from=popup&app=vpn_extension","VPN_BLOCKED_GET_APP_LINUX":"action=vpn_blocked_get_app_linux&from=popup&app=vpn_extension","PROMOTE_SOCIALS":"action=vpn_mentions_for_gbs&from=options_screen&app=vpn_extension","POPUP_STORE":"action=chrome_store&from=popup&app=vpn_extension","POPUP_FEEDBACK":"action=feedback_chrome&from=popup&app=vpn_extension","OPTIONS_STORE":"action=chrome_store&from=options_screen&app=vpn_extension","FEEDBACK":"action=feedback_chrome&from=options_screen&app=vpn_extension","VPN_API_URL":"api.adguard.io","AUTH_API_URL":"auth.adguard.io","TELEMETRY_API_URL":"api.agrdvpn-tm.com","FORWARDER_DOMAIN":"link.adtidy.info","WS_API_URL_TEMPLATE":"wss://{{host}}:443/user?hash={{hash}}","AUTH_CLIENT_ID":"adguard-vpn-extension","AMO_PRIVACY_URL":"https://addons.mozilla.org/en-US/firefox/addon/adguard-vpn/privacy/","AMO_EULA_URL":"https://addons.mozilla.org/en-US/firefox/addon/adguard-vpn/eula/"}.BUILD_ENV === 'dev';
// @ts-ignore - Importing from 'background/config' throws error
const IS_RELEASE = {"BROWSER":"chrome","BUILD_ENV":"release","STAGE_ENV":"prod","PRIVACY":"action=privacy&from=popup&app=vpn_extension","EULA":"action=eula&from=popup&app=vpn_extension","UPGRADE_LICENSE":"action=buy_license&from=popup&app=vpn_extension","SUBSCRIBE":"action=subscribe&from=popup_connections_limit&app=vpn_extension","LIMITED_OFFER":"action=limited_offer&from=popup&app=vpn_extension","LIMITED_OFFER_RU":"action=limited_offer_ru&from=popup&app=vpn_extension","DEVICE_COUNT":"action=devices_count&from=popup_connections_limit&app=vpn_extension","OTHER_PRODUCTS":"action=other_products&from=popup&app=vpn_extension","POPUP_DEFAULT_SUPPORT":"action=support&from=popup&app=vpn_extension","WEBSITE":"action=adguard_site&from=options_screen&app=vpn_extension","FAQ":"action=faq&from=options_screen&app=vpn_extension","SUGGEST_FEATURE":"action=suggest_feature&from=options_screen&app=vpn_extension","THANK_YOU_PAGE":"action=thank_you_v2&from=background_page&app=vpn_extension","FIREFOX_THANK_YOU_PAGE":"action=thank_you_v2_firefox&from=background_page&app=vpn_extension","EDIT_ACCOUNT":"action=account_settings&from=options_screen&app=vpn_extension","UNINSTALL_PAGE":"action=adguard_uninstal_ext&from=background_page&app=vpn_extension","ADGUARD_DNS_KB":"action=adguard_dns_kb&from=options_screen&app=vpn_extension","ADGUARD_DNS_PROVIDERS_KB":"action=adguard_dns_providers_kb&from=options_screen&app=vpn_extension","COMPARE_PAGE":"action=compare&from=popup&app=vpn_extension","VPN_BLOCKED_GET_APP":"action=vpn_blocked_get_app&from=popup&app=vpn_extension","VPN_BLOCKED_GET_APP_LINUX":"action=vpn_blocked_get_app_linux&from=popup&app=vpn_extension","PROMOTE_SOCIALS":"action=vpn_mentions_for_gbs&from=options_screen&app=vpn_extension","POPUP_STORE":"action=chrome_store&from=popup&app=vpn_extension","POPUP_FEEDBACK":"action=feedback_chrome&from=popup&app=vpn_extension","OPTIONS_STORE":"action=chrome_store&from=options_screen&app=vpn_extension","FEEDBACK":"action=feedback_chrome&from=options_screen&app=vpn_extension","VPN_API_URL":"api.adguard.io","AUTH_API_URL":"auth.adguard.io","TELEMETRY_API_URL":"api.agrdvpn-tm.com","FORWARDER_DOMAIN":"link.adtidy.info","WS_API_URL_TEMPLATE":"wss://{{host}}:443/user?hash={{hash}}","AUTH_CLIENT_ID":"adguard-vpn-extension","AMO_PRIVACY_URL":"https://addons.mozilla.org/en-US/firefox/addon/adguard-vpn/privacy/","AMO_EULA_URL":"https://addons.mozilla.org/en-US/firefox/addon/adguard-vpn/eula/"}.BUILD_ENV === 'release';
// @ts-ignore - Importing from 'background/config' throws error
const IS_BETA = {"BROWSER":"chrome","BUILD_ENV":"release","STAGE_ENV":"prod","PRIVACY":"action=privacy&from=popup&app=vpn_extension","EULA":"action=eula&from=popup&app=vpn_extension","UPGRADE_LICENSE":"action=buy_license&from=popup&app=vpn_extension","SUBSCRIBE":"action=subscribe&from=popup_connections_limit&app=vpn_extension","LIMITED_OFFER":"action=limited_offer&from=popup&app=vpn_extension","LIMITED_OFFER_RU":"action=limited_offer_ru&from=popup&app=vpn_extension","DEVICE_COUNT":"action=devices_count&from=popup_connections_limit&app=vpn_extension","OTHER_PRODUCTS":"action=other_products&from=popup&app=vpn_extension","POPUP_DEFAULT_SUPPORT":"action=support&from=popup&app=vpn_extension","WEBSITE":"action=adguard_site&from=options_screen&app=vpn_extension","FAQ":"action=faq&from=options_screen&app=vpn_extension","SUGGEST_FEATURE":"action=suggest_feature&from=options_screen&app=vpn_extension","THANK_YOU_PAGE":"action=thank_you_v2&from=background_page&app=vpn_extension","FIREFOX_THANK_YOU_PAGE":"action=thank_you_v2_firefox&from=background_page&app=vpn_extension","EDIT_ACCOUNT":"action=account_settings&from=options_screen&app=vpn_extension","UNINSTALL_PAGE":"action=adguard_uninstal_ext&from=background_page&app=vpn_extension","ADGUARD_DNS_KB":"action=adguard_dns_kb&from=options_screen&app=vpn_extension","ADGUARD_DNS_PROVIDERS_KB":"action=adguard_dns_providers_kb&from=options_screen&app=vpn_extension","COMPARE_PAGE":"action=compare&from=popup&app=vpn_extension","VPN_BLOCKED_GET_APP":"action=vpn_blocked_get_app&from=popup&app=vpn_extension","VPN_BLOCKED_GET_APP_LINUX":"action=vpn_blocked_get_app_linux&from=popup&app=vpn_extension","PROMOTE_SOCIALS":"action=vpn_mentions_for_gbs&from=options_screen&app=vpn_extension","POPUP_STORE":"action=chrome_store&from=popup&app=vpn_extension","POPUP_FEEDBACK":"action=feedback_chrome&from=popup&app=vpn_extension","OPTIONS_STORE":"action=chrome_store&from=options_screen&app=vpn_extension","FEEDBACK":"action=feedback_chrome&from=options_screen&app=vpn_extension","VPN_API_URL":"api.adguard.io","AUTH_API_URL":"auth.adguard.io","TELEMETRY_API_URL":"api.agrdvpn-tm.com","FORWARDER_DOMAIN":"link.adtidy.info","WS_API_URL_TEMPLATE":"wss://{{host}}:443/user?hash={{hash}}","AUTH_CLIENT_ID":"adguard-vpn-extension","AMO_PRIVACY_URL":"https://addons.mozilla.org/en-US/firefox/addon/adguard-vpn/privacy/","AMO_EULA_URL":"https://addons.mozilla.org/en-US/firefox/addon/adguard-vpn/eula/"}.BUILD_ENV === 'beta';
const logger_writer = {
    error: (...args)=>{
        logStorage.addLog(...args);
        console.error(...args);
    },
    warn: (...args)=>{
        logStorage.addLog(...args);
        console.warn(...args);
    },
    info: (...args)=>{
        logStorage.addLog(...args);
        console.info(...args);
    },
    debug: (...args)=>{
        logStorage.addLog(...args);
        console.debug(...args);
    },
    trace: (...args)=>{
        logStorage.addLog(...args);
        console.trace(...args);
    }
};
// If build environment is 'dev' we add optional group methods.
if (IS_DEV) {
    logger_writer.groupCollapsed = console.groupCollapsed;
    logger_writer.groupEnd = console.groupEnd;
}
/**
 * Extended logger with persistent log level setting.
 * Extends the base Logger class with browser storage integration
 * for saving and retrieving log level preferences.
 */ class ExtendedLogger extends Logger {
    /**
     * Checks if the current log level is verbose (Debug or Verbose).
     *
     * This method is useful for determining if detailed logging should
     * be enabled across the application in different modules. Some kind of
     * "single point of truth".
     *
     * @returns True if current log level is Debug or Verbose, false otherwise.
     */ isVerbose() {
        return this.currentLevel === es_LogLevel.Debug || this.currentLevel === es_LogLevel.Verbose;
    }
    /**
     * Sets log with persistent value, which will be saved, if
     * browser.storage.local is available.
     *
     * @param level Log level to set.
     */ setLogLevel(level) {
        this.currentLevel = level;
        browserApi.storage.set(ExtendedLogger.LOG_LEVEL_LOCAL_STORAGE_KEY, level).catch((error)=>{
            this.error('[vpn.ExtendedLogger.setLogLevel]: failed to save log level in browser.storage.local', error);
        });
    }
    /**
     * Validates if the provided value is a valid LogLevel.
     *
     * @param value Value to validate.
     *
     * @returns True if the value is a valid LogLevel, false otherwise.
     */ static isValidLogLevel(value) {
        return typeof value === 'string' && Object.values(es_LogLevel).includes(value);
    }
    /**
     * Initializes the logger by loading the saved log level from browser storage.
     * Falls back to the default log level if retrieval fails or the stored level is invalid.
     *
     * @returns Promise that resolves when initialization is complete.
     */ init() {
        return logger_async_to_generator(function*() {
            try {
                const logLevel = yield browserApi.storage.get(ExtendedLogger.LOG_LEVEL_LOCAL_STORAGE_KEY);
                if (!ExtendedLogger.isValidLogLevel(logLevel)) {
                    this.warn('[vpn.ExtendedLogger.init]: log level from browser.storage.local is not valid', logLevel);
                    return;
                }
                try {
                    this.setLogLevel(logLevel);
                } catch (e) {
                    this.warn('[vpn.ExtendedLogger.init]: failed to set log level from browser.storage.local, will set to default level', e);
                    this.setLogLevel(ExtendedLogger.DEFAULT_LOG_LEVEL);
                }
            } catch (error) {
                this.warn('[vpn.ExtendedLogger.init]: failed to get log level from browser.storage.local', error);
            }
        }).call(this);
    }
    /**
     * Creates a new instance of ExtendedLogger.
     * Initializes the logger with the default log level based on build configuration.
     */ constructor(){
        super(logger_writer);
        this.currentLevel = ExtendedLogger.DEFAULT_LOG_LEVEL;
    }
}
/**
     * Key for storing the current log level in browser storage.
     */ ExtendedLogger.LOG_LEVEL_LOCAL_STORAGE_KEY = 'log-level';
/**
     * Default log level based on the build configuration.
     */ ExtendedLogger.DEFAULT_LOG_LEVEL = IS_RELEASE || IS_BETA ? es_LogLevel.Info : es_LogLevel.Debug;
const log = new ExtendedLogger();
// Expose logger to the window object,
// to have possibility to switch log level from the console.
// Example: adguard.logger.setLogLevel('error');
// Available levels: 'error', 'warn', 'info', 'debug', 'verbose'
// eslint-disable-next-line no-restricted-globals
Object.assign(self, {
    adguard: _object_spread_props(_object_spread({}, self.adguard), {
        logger: log
    })
});


;// CONCATENATED MODULE: ./src/content-scripts/custom-dns-links.ts
function custom_dns_links_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function custom_dns_links_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                custom_dns_links_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                custom_dns_links_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}


const CUSTOM_PROTOCOL = 'adguardvpnext:';
const LINK_TAG_NAME = 'a';
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-use-before-define
const custom_dns_links_browser = chrome || custom_dns_links_browser;
/**
 * Gets the subscription parameters 'name' and 'address' from the specified URL.
 *
 * @param url The URL containing the subscription parameters.
 * @returns An object containing the 'name' and 'address' parameters, or null if not found.
 */ const getSubscriptionParams = (url)=>{
    let urlObject;
    try {
        urlObject = new URL(url);
    } catch (e) {
        log.error(`[vpn.custom-dns-links]: Failed to parse URL: ${url}, due to error: ${e}`);
        return {
            name: null,
            address: null
        };
    }
    const params = new URLSearchParams(urlObject.search);
    const name = params.get('name');
    const address = params.get('address');
    return {
        name: name ? decodeURIComponent(name) : null,
        address: address ? decodeURIComponent(address) : null
    };
};
/**
 * Handles a link click event, specifically for links with a custom protocol.
 * If the link meets the criteria, it sends a message to handle the custom DNS link.
 *
 * @param event The mouse event object associated with the link click.
 * @returns A Promise that resolves to void.
 */ const onLinkClicked = (event)=>custom_dns_links_async_to_generator(function*() {
        var _subParams_address, _this;
        if (event.button === 2) {
            // ignore right-click
            return;
        }
        const target = event.target;
        if (!target || target.tagName.toLowerCase() !== LINK_TAG_NAME || target.protocol !== CUSTOM_PROTOCOL) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const subParams = getSubscriptionParams(target.href);
        const address = (_subParams_address = subParams.address) === null || _subParams_address === void 0 ? void 0 : _subParams_address.trim();
        const name = (_this = subParams.name || address) === null || _this === void 0 ? void 0 : _this.trim();
        if (!address) {
            return;
        }
        yield custom_dns_links_browser.runtime.sendMessage({
            type: constants_MessageType.HANDLE_CUSTOM_DNS_LINK,
            data: {
                address,
                name
            }
        });
    })();
const main = ()=>{
    document.addEventListener('click', onLinkClicked);
};
main();

})();

})()
;