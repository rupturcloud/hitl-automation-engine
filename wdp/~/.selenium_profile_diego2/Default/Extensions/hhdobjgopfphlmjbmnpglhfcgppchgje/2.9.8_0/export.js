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

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/locale/en-US/_lib/formatDistance.js
const formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds",
  },

  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds",
  },

  halfAMinute: "half a minute",

  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes",
  },

  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes",
  },

  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours",
  },

  xHours: {
    one: "1 hour",
    other: "{{count}} hours",
  },

  xDays: {
    one: "1 day",
    other: "{{count}} days",
  },

  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks",
  },

  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks",
  },

  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months",
  },

  xMonths: {
    one: "1 month",
    other: "{{count}} months",
  },

  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years",
  },

  xYears: {
    one: "1 year",
    other: "{{count}} years",
  },

  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years",
  },

  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years",
  },
};

const formatDistance = (token, count, options) => {
  let result;

  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }

  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }

  return result;
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/locale/_lib/buildFormatLongFn.js
function buildFormatLongFn(args) {
  return (options = {}) => {
    // TODO: Remove String()
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/locale/en-US/_lib/formatLong.js


const dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy",
};

const timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a",
};

const dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}",
};

const formatLong_formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full",
  }),

  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full",
  }),

  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full",
  }),
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/locale/en-US/_lib/formatRelative.js
const formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P",
};

const formatRelative = (token, _date, _baseDate, _options) =>
  formatRelativeLocale[token];

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/locale/_lib/buildLocalizeFn.js
/**
 * The localize function argument callback which allows to convert raw value to
 * the actual type.
 *
 * @param value - The value to convert
 *
 * @returns The converted value
 */

/**
 * The map of localized values for each width.
 */

/**
 * The index type of the locale unit value. It types conversion of units of
 * values that don't start at 0 (i.e. quarters).
 */

/**
 * Converts the unit value to the tuple of values.
 */

/**
 * The tuple of localized era values. The first element represents BC,
 * the second element represents AD.
 */

/**
 * The tuple of localized quarter values. The first element represents Q1.
 */

/**
 * The tuple of localized day values. The first element represents Sunday.
 */

/**
 * The tuple of localized month values. The first element represents January.
 */

function buildLocalizeFn(args) {
  return (value, options) => {
    const context = options?.context ? String(options.context) : "standalone";

    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;

      valuesArray =
        args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = options?.width ? String(options.width) : args.defaultWidth;

      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;

    // @ts-expect-error - For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
    return valuesArray[index];
  };
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/locale/en-US/_lib/localize.js


const eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"],
};

const quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"],
};

// Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true for the language you're working on.
// Generally, formatted dates should look like they are in the middle of a sentence,
// e.g. in Spanish language the weekdays and months should be in the lowercase.
const monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],

  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

const dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
};

const dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
};

const formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night",
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night",
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night",
  },
};

const ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);

  // If ordinal numbers depend on context, for example,
  // if they are different for different grammatical genders,
  // use `options.unit`.
  //
  // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
  // 'day', 'hour', 'minute', 'second'.

  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};

const localize_localize = {
  ordinalNumber,

  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide",
  }),

  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1,
  }),

  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide",
  }),

  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide",
  }),

  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide",
  }),
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/locale/_lib/buildMatchFn.js
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;

    const matchPattern =
      (width && args.matchPatterns[width]) ||
      args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);

    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];

    const parsePatterns =
      (width && args.parsePatterns[width]) ||
      args.parsePatterns[args.defaultParseWidth];

    const key = Array.isArray(parsePatterns)
      ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString))
      : // [TODO] -- I challenge you to fix the type
        findKey(parsePatterns, (pattern) => pattern.test(matchedString));

    let value;

    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback
      ? // [TODO] -- I challenge you to fix the type
        options.valueCallback(value)
      : value;

    const rest = string.slice(matchedString.length);

    return { value, rest };
  };
}

function findKey(object, predicate) {
  for (const key in object) {
    if (
      Object.prototype.hasOwnProperty.call(object, key) &&
      predicate(object[key])
    ) {
      return key;
    }
  }
  return undefined;
}

function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return undefined;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/locale/_lib/buildMatchPatternFn.js
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];

    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback
      ? args.valueCallback(parseResult[0])
      : parseResult[0];

    // [TODO] I challenge you to fix the type
    value = options.valueCallback ? options.valueCallback(value) : value;

    const rest = string.slice(matchedString.length);

    return { value, rest };
  };
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/locale/en-US/_lib/match.js



const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
const parseOrdinalNumberPattern = /\d+/i;

const matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i,
};
const parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i],
};

const matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i,
};
const parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i],
};

const matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
};
const parseMonthPatterns = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i,
  ],

  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i,
  ],
};

const matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
};
const parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
};

const matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
};
const parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i,
  },
};

const match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10),
  }),

  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any",
  }),

  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1,
  }),

  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any",
  }),

  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any",
  }),

  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any",
  }),
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/locale/en-US.js






/**
 * @category Locales
 * @summary English locale (United States).
 * @language English
 * @iso-639-2 eng
 * @author Sasha Koss [@kossnocorp](https://github.com/kossnocorp)
 * @author Lesha Koss [@leshakoss](https://github.com/leshakoss)
 */
const enUS = {
  code: "en-US",
  formatDistance: formatDistance,
  formatLong: formatLong_formatLong,
  formatRelative: formatRelative,
  localize: localize_localize,
  match: match,
  options: {
    weekStartsOn: 0 /* Sunday */,
    firstWeekContainsDate: 1,
  },
};

// Fallback for modularized imports:
/* export default */ const en_US = ((/* unused pure expression or super */ null && (enUS)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/_lib/defaultOptions.js
let defaultOptions_defaultOptions = {};

function getDefaultOptions() {
  return defaultOptions_defaultOptions;
}

function setDefaultOptions(newOptions) {
  defaultOptions_defaultOptions = newOptions;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/constants.js
/**
 * @module constants
 * @summary Useful constants
 * @description
 * Collection of useful date constants.
 *
 * The constants could be imported from `date-fns/constants`:
 *
 * ```ts
 * import { maxTime, minTime } from "./constants/date-fns/constants";
 *
 * function isAllowedTime(time) {
 *   return time <= maxTime && time >= minTime;
 * }
 * ```
 */

/**
 * @constant
 * @name daysInWeek
 * @summary Days in 1 week.
 */
const daysInWeek = 7;

/**
 * @constant
 * @name daysInYear
 * @summary Days in 1 year.
 *
 * @description
 * How many days in a year.
 *
 * One years equals 365.2425 days according to the formula:
 *
 * > Leap year occurs every 4 years, except for years that are divisible by 100 and not divisible by 400.
 * > 1 mean year = (365+1/4-1/100+1/400) days = 365.2425 days
 */
const daysInYear = 365.2425;

/**
 * @constant
 * @name maxTime
 * @summary Maximum allowed time.
 *
 * @example
 * import { maxTime } from "./constants/date-fns/constants";
 *
 * const isValid = 8640000000000001 <= maxTime;
 * //=> false
 *
 * new Date(8640000000000001);
 * //=> Invalid Date
 */
const maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1000;

/**
 * @constant
 * @name minTime
 * @summary Minimum allowed time.
 *
 * @example
 * import { minTime } from "./constants/date-fns/constants";
 *
 * const isValid = -8640000000000001 >= minTime;
 * //=> false
 *
 * new Date(-8640000000000001)
 * //=> Invalid Date
 */
const minTime = (/* unused pure expression or super */ null && (-maxTime));

/**
 * @constant
 * @name millisecondsInWeek
 * @summary Milliseconds in 1 week.
 */
const millisecondsInWeek = 604800000;

/**
 * @constant
 * @name millisecondsInDay
 * @summary Milliseconds in 1 day.
 */
const millisecondsInDay = 86400000;

/**
 * @constant
 * @name millisecondsInMinute
 * @summary Milliseconds in 1 minute
 */
const millisecondsInMinute = 60000;

/**
 * @constant
 * @name millisecondsInHour
 * @summary Milliseconds in 1 hour
 */
const millisecondsInHour = 3600000;

/**
 * @constant
 * @name millisecondsInSecond
 * @summary Milliseconds in 1 second
 */
const millisecondsInSecond = 1000;

/**
 * @constant
 * @name minutesInYear
 * @summary Minutes in 1 year.
 */
const minutesInYear = 525600;

/**
 * @constant
 * @name minutesInMonth
 * @summary Minutes in 1 month.
 */
const minutesInMonth = 43200;

/**
 * @constant
 * @name minutesInDay
 * @summary Minutes in 1 day.
 */
const minutesInDay = 1440;

/**
 * @constant
 * @name minutesInHour
 * @summary Minutes in 1 hour.
 */
const minutesInHour = 60;

/**
 * @constant
 * @name monthsInQuarter
 * @summary Months in 1 quarter.
 */
const monthsInQuarter = 3;

/**
 * @constant
 * @name monthsInYear
 * @summary Months in 1 year.
 */
const monthsInYear = 12;

/**
 * @constant
 * @name quartersInYear
 * @summary Quarters in 1 year
 */
const quartersInYear = 4;

/**
 * @constant
 * @name secondsInHour
 * @summary Seconds in 1 hour.
 */
const secondsInHour = 3600;

/**
 * @constant
 * @name secondsInMinute
 * @summary Seconds in 1 minute.
 */
const secondsInMinute = 60;

/**
 * @constant
 * @name secondsInDay
 * @summary Seconds in 1 day.
 */
const secondsInDay = (/* unused pure expression or super */ null && (secondsInHour * 24));

/**
 * @constant
 * @name secondsInWeek
 * @summary Seconds in 1 week.
 */
const secondsInWeek = (/* unused pure expression or super */ null && (secondsInDay * 7));

/**
 * @constant
 * @name secondsInYear
 * @summary Seconds in 1 year.
 */
const secondsInYear = (/* unused pure expression or super */ null && (secondsInDay * daysInYear));

/**
 * @constant
 * @name secondsInMonth
 * @summary Seconds in 1 month
 */
const secondsInMonth = (/* unused pure expression or super */ null && (secondsInYear / 12));

/**
 * @constant
 * @name secondsInQuarter
 * @summary Seconds in 1 quarter.
 */
const secondsInQuarter = (/* unused pure expression or super */ null && (secondsInMonth * 3));

/**
 * @constant
 * @name constructFromSymbol
 * @summary Symbol enabling Date extensions to inherit properties from the reference date.
 *
 * The symbol is used to enable the `constructFrom` function to construct a date
 * using a reference date and a value. It allows to transfer extra properties
 * from the reference date to the new date. It's useful for extensions like
 * [`TZDate`](https://github.com/date-fns/tz) that accept a time zone as
 * a constructor argument.
 */
const constructFromSymbol = Symbol.for("constructDateFrom");

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/constructFrom.js


/**
 * @name constructFrom
 * @category Generic Helpers
 * @summary Constructs a date using the reference date and the value
 *
 * @description
 * The function constructs a new date using the constructor from the reference
 * date and the given value. It helps to build generic functions that accept
 * date extensions.
 *
 * It defaults to `Date` if the passed reference date is a number or a string.
 *
 * Starting from v3.7.0, it allows to construct a date using `[Symbol.for("constructDateFrom")]`
 * enabling to transfer extra properties from the reference date to the new date.
 * It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
 * that accept a time zone as a constructor argument.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The reference date to take constructor from
 * @param value - The value to create the date
 *
 * @returns Date initialized using the given date and value
 *
 * @example
 * import { constructFrom } from "./constructFrom/date-fns";
 *
 * // A function that clones a date preserving the original type
 * function cloneDate<DateType extends Date>(date: DateType): DateType {
 *   return constructFrom(
 *     date, // Use constructor from the given date
 *     date.getTime() // Use the date value to create a new date
 *   );
 * }
 */
function constructFrom(date, value) {
  if (typeof date === "function") return date(value);

  if (date && typeof date === "object" && constructFromSymbol in date)
    return date[constructFromSymbol](value);

  if (date instanceof Date) return new date.constructor(value);

  return new Date(value);
}

// Fallback for modularized imports:
/* export default */ const date_fns_constructFrom = ((/* unused pure expression or super */ null && (constructFrom)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/toDate.js


/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * Starting from v3.7.0, it clones a date using `[Symbol.for("constructDateFrom")]`
 * enabling to transfer extra properties from the reference date to the new date.
 * It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
 * that accept a time zone as a constructor argument.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param argument - The value to convert
 *
 * @returns The parsed date in the local time zone
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */
function toDate(argument, context) {
  // [TODO] Get rid of `toDate` or `constructFrom`?
  return constructFrom(context || argument, argument);
}

// Fallback for modularized imports:
/* export default */ const date_fns_toDate = ((/* unused pure expression or super */ null && (toDate)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js


/**
 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
 * They usually appear for dates that denote time before the timezones were introduced
 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
 * and GMT+01:00:00 after that date)
 *
 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
 * which would lead to incorrect calculations.
 *
 * This function returns the timezone offset in milliseconds that takes seconds in account.
 */
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds(),
    ),
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/_lib/normalizeDates.js


function normalizeDates(context, ...dates) {
  const normalize = constructFrom.bind(
    null,
    context || dates.find((date) => typeof date === "object"),
  );
  return dates.map(normalize);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/startOfDay.js


/**
 * The {@link startOfDay} function options.
 */

/**
 * @name startOfDay
 * @category Day Helpers
 * @summary Return the start of a day for the given date.
 *
 * @description
 * Return the start of a day for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The original date
 * @param options - The options
 *
 * @returns The start of a day
 *
 * @example
 * // The start of a day for 2 September 2014 11:55:00:
 * const result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 00:00:00
 */
function startOfDay(date, options) {
  const _date = toDate(date, options?.in);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// Fallback for modularized imports:
/* export default */ const date_fns_startOfDay = ((/* unused pure expression or super */ null && (startOfDay)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/differenceInCalendarDays.js





/**
 * The {@link differenceInCalendarDays} function options.
 */

/**
 * @name differenceInCalendarDays
 * @category Day Helpers
 * @summary Get the number of calendar days between the given dates.
 *
 * @description
 * Get the number of calendar days between the given dates. This means that the times are removed
 * from the dates and then the difference in days is calculated.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param options - The options object
 *
 * @returns The number of calendar days
 *
 * @example
 * // How many calendar days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * const result = differenceInCalendarDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 366
 * // How many calendar days are between
 * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
 * const result = differenceInCalendarDays(
 *   new Date(2011, 6, 3, 0, 1),
 *   new Date(2011, 6, 2, 23, 59)
 * )
 * //=> 1
 */
function differenceInCalendarDays(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate,
  );

  const laterStartOfDay = startOfDay(laterDate_);
  const earlierStartOfDay = startOfDay(earlierDate_);

  const laterTimestamp =
    +laterStartOfDay - getTimezoneOffsetInMilliseconds(laterStartOfDay);
  const earlierTimestamp =
    +earlierStartOfDay - getTimezoneOffsetInMilliseconds(earlierStartOfDay);

  // Round the number of days to the nearest integer because the number of
  // milliseconds in a day is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInDay);
}

// Fallback for modularized imports:
/* export default */ const date_fns_differenceInCalendarDays = ((/* unused pure expression or super */ null && (differenceInCalendarDays)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/startOfYear.js


/**
 * The {@link startOfYear} function options.
 */

/**
 * @name startOfYear
 * @category Year Helpers
 * @summary Return the start of a year for the given date.
 *
 * @description
 * Return the start of a year for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The original date
 * @param options - The options
 *
 * @returns The start of a year
 *
 * @example
 * // The start of a year for 2 September 2014 11:55:00:
 * const result = startOfYear(new Date(2014, 8, 2, 11, 55, 00))
 * //=> Wed Jan 01 2014 00:00:00
 */
function startOfYear(date, options) {
  const date_ = toDate(date, options?.in);
  date_.setFullYear(date_.getFullYear(), 0, 1);
  date_.setHours(0, 0, 0, 0);
  return date_;
}

// Fallback for modularized imports:
/* export default */ const date_fns_startOfYear = ((/* unused pure expression or super */ null && (startOfYear)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/getDayOfYear.js




/**
 * The {@link getDayOfYear} function options.
 */

/**
 * @name getDayOfYear
 * @category Day Helpers
 * @summary Get the day of the year of the given date.
 *
 * @description
 * Get the day of the year of the given date.
 *
 * @param date - The given date
 * @param options - The options
 *
 * @returns The day of year
 *
 * @example
 * // Which day of the year is 2 July 2014?
 * const result = getDayOfYear(new Date(2014, 6, 2))
 * //=> 183
 */
function getDayOfYear(date, options) {
  const _date = toDate(date, options?.in);
  const diff = differenceInCalendarDays(_date, startOfYear(_date));
  const dayOfYear = diff + 1;
  return dayOfYear;
}

// Fallback for modularized imports:
/* export default */ const date_fns_getDayOfYear = ((/* unused pure expression or super */ null && (getDayOfYear)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/startOfWeek.js



/**
 * The {@link startOfWeek} function options.
 */

/**
 * @name startOfWeek
 * @category Week Helpers
 * @summary Return the start of a week for the given date.
 *
 * @description
 * Return the start of a week for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The start of a week
 *
 * @example
 * // The start of a week for 2 September 2014 11:55:00:
 * const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sun Aug 31 2014 00:00:00
 *
 * @example
 * // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
 * const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfWeek(date, options) {
  const defaultOptions = getDefaultOptions();
  const weekStartsOn =
    options?.weekStartsOn ??
    options?.locale?.options?.weekStartsOn ??
    defaultOptions.weekStartsOn ??
    defaultOptions.locale?.options?.weekStartsOn ??
    0;

  const _date = toDate(date, options?.in);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

  _date.setDate(_date.getDate() - diff);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// Fallback for modularized imports:
/* export default */ const date_fns_startOfWeek = ((/* unused pure expression or super */ null && (startOfWeek)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/startOfISOWeek.js


/**
 * The {@link startOfISOWeek} function options.
 */

/**
 * @name startOfISOWeek
 * @category ISO Week Helpers
 * @summary Return the start of an ISO week for the given date.
 *
 * @description
 * Return the start of an ISO week for the given date.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The start of an ISO week
 *
 * @example
 * // The start of an ISO week for 2 September 2014 11:55:00:
 * const result = startOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfISOWeek(date, options) {
  return startOfWeek(date, { ...options, weekStartsOn: 1 });
}

// Fallback for modularized imports:
/* export default */ const date_fns_startOfISOWeek = ((/* unused pure expression or super */ null && (startOfISOWeek)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/getISOWeekYear.js




/**
 * The {@link getISOWeekYear} function options.
 */

/**
 * @name getISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the ISO week-numbering year of the given date.
 *
 * @description
 * Get the ISO week-numbering year of the given date,
 * which always starts 3 days before the year's first Thursday.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param date - The given date
 *
 * @returns The ISO week-numbering year
 *
 * @example
 * // Which ISO-week numbering year is 2 January 2005?
 * const result = getISOWeekYear(new Date(2005, 0, 2))
 * //=> 2004
 */
function getISOWeekYear(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();

  const fourthOfJanuaryOfNextYear = constructFrom(_date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);

  const fourthOfJanuaryOfThisYear = constructFrom(_date, 0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);

  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// Fallback for modularized imports:
/* export default */ const date_fns_getISOWeekYear = ((/* unused pure expression or super */ null && (getISOWeekYear)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/startOfISOWeekYear.js




/**
 * The {@link startOfISOWeekYear} function options.
 */

/**
 * @name startOfISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Return the start of an ISO week-numbering year for the given date.
 *
 * @description
 * Return the start of an ISO week-numbering year,
 * which always starts 3 days before the year's first Thursday.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The start of an ISO week-numbering year
 *
 * @example
 * // The start of an ISO week-numbering year for 2 July 2005:
 * const result = startOfISOWeekYear(new Date(2005, 6, 2))
 * //=> Mon Jan 03 2005 00:00:00
 */
function startOfISOWeekYear(date, options) {
  const year = getISOWeekYear(date, options);
  const fourthOfJanuary = constructFrom(options?.in || date, 0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  return startOfISOWeek(fourthOfJanuary);
}

// Fallback for modularized imports:
/* export default */ const date_fns_startOfISOWeekYear = ((/* unused pure expression or super */ null && (startOfISOWeekYear)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/getISOWeek.js





/**
 * The {@link getISOWeek} function options.
 */

/**
 * @name getISOWeek
 * @category ISO Week Helpers
 * @summary Get the ISO week of the given date.
 *
 * @description
 * Get the ISO week of the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param date - The given date
 * @param options - The options
 *
 * @returns The ISO week
 *
 * @example
 * // Which week of the ISO-week numbering year is 2 January 2005?
 * const result = getISOWeek(new Date(2005, 0, 2))
 * //=> 53
 */
function getISOWeek(date, options) {
  const _date = toDate(date, options?.in);
  const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);

  // Round the number of weeks to the nearest integer because the number of
  // milliseconds in a week is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round(diff / millisecondsInWeek) + 1;
}

// Fallback for modularized imports:
/* export default */ const date_fns_getISOWeek = ((/* unused pure expression or super */ null && (getISOWeek)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/getWeekYear.js





/**
 * The {@link getWeekYear} function options.
 */

/**
 * @name getWeekYear
 * @category Week-Numbering Year Helpers
 * @summary Get the local week-numbering year of the given date.
 *
 * @description
 * Get the local week-numbering year of the given date.
 * The exact calculation depends on the values of
 * `options.weekStartsOn` (which is the index of the first day of the week)
 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
 * the first week of the week-numbering year)
 *
 * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
 *
 * @param date - The given date
 * @param options - An object with options.
 *
 * @returns The local week-numbering year
 *
 * @example
 * // Which week numbering year is 26 December 2004 with the default settings?
 * const result = getWeekYear(new Date(2004, 11, 26))
 * //=> 2005
 *
 * @example
 * // Which week numbering year is 26 December 2004 if week starts on Saturday?
 * const result = getWeekYear(new Date(2004, 11, 26), { weekStartsOn: 6 })
 * //=> 2004
 *
 * @example
 * // Which week numbering year is 26 December 2004 if the first week contains 4 January?
 * const result = getWeekYear(new Date(2004, 11, 26), { firstWeekContainsDate: 4 })
 * //=> 2004
 */
function getWeekYear(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();

  const defaultOptions = getDefaultOptions();
  const firstWeekContainsDate =
    options?.firstWeekContainsDate ??
    options?.locale?.options?.firstWeekContainsDate ??
    defaultOptions.firstWeekContainsDate ??
    defaultOptions.locale?.options?.firstWeekContainsDate ??
    1;

  const firstWeekOfNextYear = constructFrom(options?.in || date, 0);
  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);

  const firstWeekOfThisYear = constructFrom(options?.in || date, 0);
  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);

  if (+_date >= +startOfNextYear) {
    return year + 1;
  } else if (+_date >= +startOfThisYear) {
    return year;
  } else {
    return year - 1;
  }
}

// Fallback for modularized imports:
/* export default */ const date_fns_getWeekYear = ((/* unused pure expression or super */ null && (getWeekYear)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/startOfWeekYear.js





/**
 * The {@link startOfWeekYear} function options.
 */

/**
 * @name startOfWeekYear
 * @category Week-Numbering Year Helpers
 * @summary Return the start of a local week-numbering year for the given date.
 *
 * @description
 * Return the start of a local week-numbering year.
 * The exact calculation depends on the values of
 * `options.weekStartsOn` (which is the index of the first day of the week)
 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
 * the first week of the week-numbering year)
 *
 * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type.
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The start of a week-numbering year
 *
 * @example
 * // The start of an a week-numbering year for 2 July 2005 with default settings:
 * const result = startOfWeekYear(new Date(2005, 6, 2))
 * //=> Sun Dec 26 2004 00:00:00
 *
 * @example
 * // The start of a week-numbering year for 2 July 2005
 * // if Monday is the first day of week
 * // and 4 January is always in the first week of the year:
 * const result = startOfWeekYear(new Date(2005, 6, 2), {
 *   weekStartsOn: 1,
 *   firstWeekContainsDate: 4
 * })
 * //=> Mon Jan 03 2005 00:00:00
 */
function startOfWeekYear(date, options) {
  const defaultOptions = getDefaultOptions();
  const firstWeekContainsDate =
    options?.firstWeekContainsDate ??
    options?.locale?.options?.firstWeekContainsDate ??
    defaultOptions.firstWeekContainsDate ??
    defaultOptions.locale?.options?.firstWeekContainsDate ??
    1;

  const year = getWeekYear(date, options);
  const firstWeek = constructFrom(options?.in || date, 0);
  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  const _date = startOfWeek(firstWeek, options);
  return _date;
}

// Fallback for modularized imports:
/* export default */ const date_fns_startOfWeekYear = ((/* unused pure expression or super */ null && (startOfWeekYear)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/getWeek.js





/**
 * The {@link getWeek} function options.
 */

/**
 * @name getWeek
 * @category Week Helpers
 * @summary Get the local week index of the given date.
 *
 * @description
 * Get the local week index of the given date.
 * The exact calculation depends on the values of
 * `options.weekStartsOn` (which is the index of the first day of the week)
 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
 * the first week of the week-numbering year)
 *
 * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
 *
 * @param date - The given date
 * @param options - An object with options
 *
 * @returns The week
 *
 * @example
 * // Which week of the local week numbering year is 2 January 2005 with default options?
 * const result = getWeek(new Date(2005, 0, 2))
 * //=> 2
 *
 * @example
 * // Which week of the local week numbering year is 2 January 2005,
 * // if Monday is the first day of the week,
 * // and the first week of the year always contains 4 January?
 * const result = getWeek(new Date(2005, 0, 2), {
 *   weekStartsOn: 1,
 *   firstWeekContainsDate: 4
 * })
 * //=> 53
 */
function getWeek(date, options) {
  const _date = toDate(date, options?.in);
  const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);

  // Round the number of weeks to the nearest integer because the number of
  // milliseconds in a week is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round(diff / millisecondsInWeek) + 1;
}

// Fallback for modularized imports:
/* export default */ const date_fns_getWeek = ((/* unused pure expression or super */ null && (getWeek)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/_lib/addLeadingZeros.js
function addLeadingZeros(number, targetLength) {
  const sign = number < 0 ? "-" : "";
  const output = Math.abs(number).toString().padStart(targetLength, "0");
  return sign + output;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/_lib/format/lightFormatters.js


/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* |                                |
 * |  d  | Day of month                   |  D  |                                |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  m  | Minute                         |  M  | Month                          |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  y  | Year (abs)                     |  Y  |                                |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 */

const lightFormatters = {
  // Year
  y(date, token) {
    // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
    // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
    // |----------|-------|----|-------|-------|-------|
    // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
    // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
    // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
    // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
    // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |

    const signedYear = date.getFullYear();
    // Returns 1 for 1 BC (which is year 0 in JavaScript)
    const year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
  },

  // Month
  M(date, token) {
    const month = date.getMonth();
    return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },

  // Day of the month
  d(date, token) {
    return addLeadingZeros(date.getDate(), token.length);
  },

  // AM or PM
  a(date, token) {
    const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";

    switch (token) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },

  // Hour [1-12]
  h(date, token) {
    return addLeadingZeros(date.getHours() % 12 || 12, token.length);
  },

  // Hour [0-23]
  H(date, token) {
    return addLeadingZeros(date.getHours(), token.length);
  },

  // Minute
  m(date, token) {
    return addLeadingZeros(date.getMinutes(), token.length);
  },

  // Second
  s(date, token) {
    return addLeadingZeros(date.getSeconds(), token.length);
  },

  // Fraction of second
  S(date, token) {
    const numberOfDigits = token.length;
    const milliseconds = date.getMilliseconds();
    const fractionalSeconds = Math.trunc(
      milliseconds * Math.pow(10, numberOfDigits - 3),
    );
    return addLeadingZeros(fractionalSeconds, token.length);
  },
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/_lib/format/formatters.js









const dayPeriodEnum = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night",
};

/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* | Milliseconds in day            |
 * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
 * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
 * |  d  | Day of month                   |  D  | Day of year                    |
 * |  e  | Local day of week              |  E  | Day of week                    |
 * |  f  |                                |  F* | Day of week in month           |
 * |  g* | Modified Julian day            |  G  | Era                            |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  i! | ISO day of week                |  I! | ISO week of year               |
 * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
 * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
 * |  l* | (deprecated)                   |  L  | Stand-alone month              |
 * |  m  | Minute                         |  M  | Month                          |
 * |  n  |                                |  N  |                                |
 * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
 * |  p! | Long localized time            |  P! | Long localized date            |
 * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
 * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
 * |  u  | Extended year                  |  U* | Cyclic year                    |
 * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
 * |  w  | Local week of year             |  W* | Week of month                  |
 * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
 * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
 * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 *
 * Letters marked by ! are non-standard, but implemented by date-fns:
 * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
 * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
 *   i.e. 7 for Sunday, 1 for Monday, etc.
 * - `I` is ISO week of year, as opposed to `w` which is local week of year.
 * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
 *   `R` is supposed to be used in conjunction with `I` and `i`
 *   for universal ISO week-numbering date, whereas
 *   `Y` is supposed to be used in conjunction with `w` and `e`
 *   for week-numbering date specific to the locale.
 * - `P` is long localized date format
 * - `p` is long localized time format
 */

const formatters = {
  // Era
  G: function (date, token, localize) {
    const era = date.getFullYear() > 0 ? 1 : 0;
    switch (token) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return localize.era(era, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return localize.era(era, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return localize.era(era, { width: "wide" });
    }
  },

  // Year
  y: function (date, token, localize) {
    // Ordinal number
    if (token === "yo") {
      const signedYear = date.getFullYear();
      // Returns 1 for 1 BC (which is year 0 in JavaScript)
      const year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize.ordinalNumber(year, { unit: "year" });
    }

    return lightFormatters.y(date, token);
  },

  // Local week-numbering year
  Y: function (date, token, localize, options) {
    const signedWeekYear = getWeekYear(date, options);
    // Returns 1 for 1 BC (which is year 0 in JavaScript)
    const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;

    // Two digit year
    if (token === "YY") {
      const twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }

    // Ordinal number
    if (token === "Yo") {
      return localize.ordinalNumber(weekYear, { unit: "year" });
    }

    // Padding
    return addLeadingZeros(weekYear, token.length);
  },

  // ISO week-numbering year
  R: function (date, token) {
    const isoWeekYear = getISOWeekYear(date);

    // Padding
    return addLeadingZeros(isoWeekYear, token.length);
  },

  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function (date, token) {
    const year = date.getFullYear();
    return addLeadingZeros(year, token.length);
  },

  // Quarter
  Q: function (date, token, localize) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "Q":
        return String(quarter);
      // 01, 02, 03, 04
      case "QQ":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return localize.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return localize.quarter(quarter, {
          width: "abbreviated",
          context: "formatting",
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return localize.quarter(quarter, {
          width: "narrow",
          context: "formatting",
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return localize.quarter(quarter, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // Stand-alone quarter
  q: function (date, token, localize) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "q":
        return String(quarter);
      // 01, 02, 03, 04
      case "qq":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return localize.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return localize.quarter(quarter, {
          width: "abbreviated",
          context: "standalone",
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return localize.quarter(quarter, {
          width: "narrow",
          context: "standalone",
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return localize.quarter(quarter, {
          width: "wide",
          context: "standalone",
        });
    }
  },

  // Month
  M: function (date, token, localize) {
    const month = date.getMonth();
    switch (token) {
      case "M":
      case "MM":
        return lightFormatters.M(date, token);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return localize.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return localize.month(month, {
          width: "abbreviated",
          context: "formatting",
        });
      // J, F, ..., D
      case "MMMMM":
        return localize.month(month, {
          width: "narrow",
          context: "formatting",
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return localize.month(month, { width: "wide", context: "formatting" });
    }
  },

  // Stand-alone month
  L: function (date, token, localize) {
    const month = date.getMonth();
    switch (token) {
      // 1, 2, ..., 12
      case "L":
        return String(month + 1);
      // 01, 02, ..., 12
      case "LL":
        return addLeadingZeros(month + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return localize.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return localize.month(month, {
          width: "abbreviated",
          context: "standalone",
        });
      // J, F, ..., D
      case "LLLLL":
        return localize.month(month, {
          width: "narrow",
          context: "standalone",
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return localize.month(month, { width: "wide", context: "standalone" });
    }
  },

  // Local week of year
  w: function (date, token, localize, options) {
    const week = getWeek(date, options);

    if (token === "wo") {
      return localize.ordinalNumber(week, { unit: "week" });
    }

    return addLeadingZeros(week, token.length);
  },

  // ISO week of year
  I: function (date, token, localize) {
    const isoWeek = getISOWeek(date);

    if (token === "Io") {
      return localize.ordinalNumber(isoWeek, { unit: "week" });
    }

    return addLeadingZeros(isoWeek, token.length);
  },

  // Day of the month
  d: function (date, token, localize) {
    if (token === "do") {
      return localize.ordinalNumber(date.getDate(), { unit: "date" });
    }

    return lightFormatters.d(date, token);
  },

  // Day of year
  D: function (date, token, localize) {
    const dayOfYear = getDayOfYear(date);

    if (token === "Do") {
      return localize.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
    }

    return addLeadingZeros(dayOfYear, token.length);
  },

  // Day of week
  E: function (date, token, localize) {
    const dayOfWeek = date.getDay();
    switch (token) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting",
        });
      // T
      case "EEEEE":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "formatting",
        });
      // Tu
      case "EEEEEE":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "formatting",
        });
      // Tuesday
      case "EEEE":
      default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // Local day of week
  e: function (date, token, localize, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(localDayOfWeek);
      // Padded numerical value
      case "ee":
        return addLeadingZeros(localDayOfWeek, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return localize.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "eee":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting",
        });
      // T
      case "eeeee":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "formatting",
        });
      // Tu
      case "eeeeee":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "formatting",
        });
      // Tuesday
      case "eeee":
      default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // Stand-alone local day of week
  c: function (date, token, localize, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (same as in `e`)
      case "c":
        return String(localDayOfWeek);
      // Padded numerical value
      case "cc":
        return addLeadingZeros(localDayOfWeek, token.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return localize.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "ccc":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone",
        });
      // T
      case "ccccc":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "standalone",
        });
      // Tu
      case "cccccc":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "standalone",
        });
      // Tuesday
      case "cccc":
      default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "standalone",
        });
    }
  },

  // ISO day of week
  i: function (date, token, localize) {
    const dayOfWeek = date.getDay();
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      // 2
      case "i":
        return String(isoDayOfWeek);
      // 02
      case "ii":
        return addLeadingZeros(isoDayOfWeek, token.length);
      // 2nd
      case "io":
        return localize.ordinalNumber(isoDayOfWeek, { unit: "day" });
      // Tue
      case "iii":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting",
        });
      // T
      case "iiiii":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "formatting",
        });
      // Tu
      case "iiiiii":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "formatting",
        });
      // Tuesday
      case "iiii":
      default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // AM or PM
  a: function (date, token, localize) {
    const hours = date.getHours();
    const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";

    switch (token) {
      case "a":
      case "aa":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting",
        });
      case "aaa":
        return localize
          .dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting",
          })
          .toLowerCase();
      case "aaaaa":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting",
        });
      case "aaaa":
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // AM, PM, midnight, noon
  b: function (date, token, localize) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }

    switch (token) {
      case "b":
      case "bb":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting",
        });
      case "bbb":
        return localize
          .dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting",
          })
          .toLowerCase();
      case "bbbbb":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting",
        });
      case "bbbb":
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // in the morning, in the afternoon, in the evening, at night
  B: function (date, token, localize) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }

    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting",
        });
      case "BBBBB":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting",
        });
      case "BBBB":
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // Hour [1-12]
  h: function (date, token, localize) {
    if (token === "ho") {
      let hours = date.getHours() % 12;
      if (hours === 0) hours = 12;
      return localize.ordinalNumber(hours, { unit: "hour" });
    }

    return lightFormatters.h(date, token);
  },

  // Hour [0-23]
  H: function (date, token, localize) {
    if (token === "Ho") {
      return localize.ordinalNumber(date.getHours(), { unit: "hour" });
    }

    return lightFormatters.H(date, token);
  },

  // Hour [0-11]
  K: function (date, token, localize) {
    const hours = date.getHours() % 12;

    if (token === "Ko") {
      return localize.ordinalNumber(hours, { unit: "hour" });
    }

    return addLeadingZeros(hours, token.length);
  },

  // Hour [1-24]
  k: function (date, token, localize) {
    let hours = date.getHours();
    if (hours === 0) hours = 24;

    if (token === "ko") {
      return localize.ordinalNumber(hours, { unit: "hour" });
    }

    return addLeadingZeros(hours, token.length);
  },

  // Minute
  m: function (date, token, localize) {
    if (token === "mo") {
      return localize.ordinalNumber(date.getMinutes(), { unit: "minute" });
    }

    return lightFormatters.m(date, token);
  },

  // Second
  s: function (date, token, localize) {
    if (token === "so") {
      return localize.ordinalNumber(date.getSeconds(), { unit: "second" });
    }

    return lightFormatters.s(date, token);
  },

  // Fraction of second
  S: function (date, token) {
    return lightFormatters.S(date, token);
  },

  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function (date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();

    if (timezoneOffset === 0) {
      return "Z";
    }

    switch (token) {
      // Hours and optional minutes
      case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX": // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset);

      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case "XXXXX":
      case "XXX": // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },

  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function (date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();

    switch (token) {
      // Hours and optional minutes
      case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx": // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset);

      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case "xxxxx":
      case "xxx": // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },

  // Timezone (GMT)
  O: function (date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();

    switch (token) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "OOOO":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },

  // Timezone (specific non-location)
  z: function (date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();

    switch (token) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "zzzz":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },

  // Seconds timestamp
  t: function (date, token, _localize) {
    const timestamp = Math.trunc(+date / 1000);
    return addLeadingZeros(timestamp, token.length);
  },

  // Milliseconds timestamp
  T: function (date, token, _localize) {
    return addLeadingZeros(+date, token.length);
  },
};

function formatTimezoneShort(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = Math.trunc(absOffset / 60);
  const minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}

function formatTimezoneWithOptionalMinutes(offset, delimiter) {
  if (offset % 60 === 0) {
    const sign = offset > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, delimiter);
}

function formatTimezone(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
  const minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/_lib/format/longFormatters.js
const dateLongFormatter = (pattern, formatLong) => {
  switch (pattern) {
    case "P":
      return formatLong.date({ width: "short" });
    case "PP":
      return formatLong.date({ width: "medium" });
    case "PPP":
      return formatLong.date({ width: "long" });
    case "PPPP":
    default:
      return formatLong.date({ width: "full" });
  }
};

const timeLongFormatter = (pattern, formatLong) => {
  switch (pattern) {
    case "p":
      return formatLong.time({ width: "short" });
    case "pp":
      return formatLong.time({ width: "medium" });
    case "ppp":
      return formatLong.time({ width: "long" });
    case "pppp":
    default:
      return formatLong.time({ width: "full" });
  }
};

const dateTimeLongFormatter = (pattern, formatLong) => {
  const matchResult = pattern.match(/(P+)(p+)?/) || [];
  const datePattern = matchResult[1];
  const timePattern = matchResult[2];

  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong);
  }

  let dateTimeFormat;

  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong.dateTime({ width: "short" });
      break;
    case "PP":
      dateTimeFormat = formatLong.dateTime({ width: "medium" });
      break;
    case "PPP":
      dateTimeFormat = formatLong.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong.dateTime({ width: "full" });
      break;
  }

  return dateTimeFormat
    .replace("{{date}}", dateLongFormatter(datePattern, formatLong))
    .replace("{{time}}", timeLongFormatter(timePattern, formatLong));
};

const longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter,
};

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/_lib/protectedTokens.js
const dayOfYearTokenRE = /^D+$/;
const weekYearTokenRE = /^Y+$/;

const throwTokens = ["D", "DD", "YY", "YYYY"];

function isProtectedDayOfYearToken(token) {
  return dayOfYearTokenRE.test(token);
}

function isProtectedWeekYearToken(token) {
  return weekYearTokenRE.test(token);
}

function warnOrThrowProtectedError(token, format, input) {
  const _message = protectedTokens_message(token, format, input);
  console.warn(_message);
  if (throwTokens.includes(token)) throw new RangeError(_message);
}

function protectedTokens_message(token, format, input) {
  const subject = token[0] === "Y" ? "years" : "days of the month";
  return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/isDate.js
/**
 * @name isDate
 * @category Common Helpers
 * @summary Is the given value a date?
 *
 * @description
 * Returns true if the given value is an instance of Date. The function works for dates transferred across iframes.
 *
 * @param value - The value to check
 *
 * @returns True if the given value is a date
 *
 * @example
 * // For a valid date:
 * const result = isDate(new Date())
 * //=> true
 *
 * @example
 * // For an invalid date:
 * const result = isDate(new Date(NaN))
 * //=> true
 *
 * @example
 * // For some value:
 * const result = isDate('2014-02-31')
 * //=> false
 *
 * @example
 * // For an object:
 * const result = isDate({})
 * //=> false
 */
function isDate(value) {
  return (
    value instanceof Date ||
    (typeof value === "object" &&
      Object.prototype.toString.call(value) === "[object Date]")
  );
}

// Fallback for modularized imports:
/* export default */ const date_fns_isDate = ((/* unused pure expression or super */ null && (isDate)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/isValid.js



/**
 * @name isValid
 * @category Common Helpers
 * @summary Is the given date valid?
 *
 * @description
 * Returns false if argument is Invalid Date and true otherwise.
 * Argument is converted to Date using `toDate`. See [toDate](https://date-fns.org/docs/toDate)
 * Invalid Date is a Date, whose time value is NaN.
 *
 * Time value of Date: http://es5.github.io/#x15.9.1.1
 *
 * @param date - The date to check
 *
 * @returns The date is valid
 *
 * @example
 * // For the valid date:
 * const result = isValid(new Date(2014, 1, 31))
 * //=> true
 *
 * @example
 * // For the value, convertible into a date:
 * const result = isValid(1393804800000)
 * //=> true
 *
 * @example
 * // For the invalid date:
 * const result = isValid(new Date(''))
 * //=> false
 */
function isValid(date) {
  return !((!isDate(date) && typeof date !== "number") || isNaN(+toDate(date)));
}

// Fallback for modularized imports:
/* export default */ const date_fns_isValid = ((/* unused pure expression or super */ null && (isValid)));

;// CONCATENATED MODULE: ./node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/format.js








// Rexports of internal for libraries to use.
// See: https://github.com/date-fns/date-fns/issues/3638#issuecomment-1877082874


// This RegExp consists of three parts separated by `|`:
// - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
//   (one of the certain letters followed by `o`)
// - (\w)\1* matches any sequences of the same letter
// - '' matches two quote characters in a row
// - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
//   except a single quote symbol, which ends the sequence.
//   Two quote characters do not end the sequence.
//   If there is no matching single quote
//   then the sequence will continue until the end of the string.
// - . matches any single character unmatched by previous parts of the RegExps
const formattingTokensRegExp =
  /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;

// This RegExp catches symbols escaped by quotes, and also
// sequences of symbols P, p, and the combinations like `PPPPPPPppppp`
const longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;

const escapedStringRegExp = /^'([^]*?)'?$/;
const doubleQuoteRegExp = /''/g;
const unescapedLatinCharacterRegExp = /[a-zA-Z]/;



/**
 * The {@link format} function options.
 */

/**
 * @name format
 * @alias formatDate
 * @category Common Helpers
 * @summary Format the date.
 *
 * @description
 * Return the formatted date string in the given format. The result may vary by locale.
 *
 * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
 * > See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * The characters wrapped between two single quotes characters (') are escaped.
 * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
 * (see the last example)
 *
 * Format of the string is based on Unicode Technical Standard #35:
 * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * with a few additions (see note 7 below the table).
 *
 * Accepted patterns:
 * | Unit                            | Pattern | Result examples                   | Notes |
 * |---------------------------------|---------|-----------------------------------|-------|
 * | Era                             | G..GGG  | AD, BC                            |       |
 * |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
 * |                                 | GGGGG   | A, B                              |       |
 * | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
 * |                                 | yy      | 44, 01, 00, 17                    | 5     |
 * |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
 * |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
 * |                                 | yyyyy   | ...                               | 3,5   |
 * | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
 * |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
 * |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
 * |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
 * |                                 | YYYYY   | ...                               | 3,5   |
 * | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
 * |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
 * |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
 * |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
 * |                                 | RRRRR   | ...                               | 3,5,7 |
 * | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
 * |                                 | uu      | -43, 01, 1900, 2017               | 5     |
 * |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
 * |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
 * |                                 | uuuuu   | ...                               | 3,5   |
 * | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
 * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | QQ      | 01, 02, 03, 04                    |       |
 * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
 * | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
 * |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | qq      | 01, 02, 03, 04                    |       |
 * |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
 * | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
 * |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | MM      | 01, 02, ..., 12                   |       |
 * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
 * |                                 | MMMM    | January, February, ..., December  | 2     |
 * |                                 | MMMMM   | J, F, ..., D                      |       |
 * | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
 * |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | LL      | 01, 02, ..., 12                   |       |
 * |                                 | LLL     | Jan, Feb, ..., Dec                |       |
 * |                                 | LLLL    | January, February, ..., December  | 2     |
 * |                                 | LLLLL   | J, F, ..., D                      |       |
 * | Local week of year              | w       | 1, 2, ..., 53                     |       |
 * |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | ww      | 01, 02, ..., 53                   |       |
 * | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
 * |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | II      | 01, 02, ..., 53                   | 7     |
 * | Day of month                    | d       | 1, 2, ..., 31                     |       |
 * |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
 * |                                 | dd      | 01, 02, ..., 31                   |       |
 * | Day of year                     | D       | 1, 2, ..., 365, 366               | 9     |
 * |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
 * |                                 | DD      | 01, 02, ..., 365, 366             | 9     |
 * |                                 | DDD     | 001, 002, ..., 365, 366           |       |
 * |                                 | DDDD    | ...                               | 3     |
 * | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
 * |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
 * |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
 * |                                 | ii      | 01, 02, ..., 07                   | 7     |
 * |                                 | iii     | Mon, Tue, Wed, ..., Sun           | 7     |
 * |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
 * |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
 * |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 7     |
 * | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
 * |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | ee      | 02, 03, ..., 01                   |       |
 * |                                 | eee     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | eeeee   | M, T, W, T, F, S, S               |       |
 * |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
 * |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | cc      | 02, 03, ..., 01                   |       |
 * |                                 | ccc     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | ccccc   | M, T, W, T, F, S, S               |       |
 * |                                 | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | AM, PM                          | a..aa   | AM, PM                            |       |
 * |                                 | aaa     | am, pm                            |       |
 * |                                 | aaaa    | a.m., p.m.                        | 2     |
 * |                                 | aaaaa   | a, p                              |       |
 * | AM, PM, noon, midnight          | b..bb   | AM, PM, noon, midnight            |       |
 * |                                 | bbb     | am, pm, noon, midnight            |       |
 * |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
 * |                                 | bbbbb   | a, p, n, mi                       |       |
 * | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
 * |                                 | BBBB    | at night, in the morning, ...     | 2     |
 * |                                 | BBBBB   | at night, in the morning, ...     |       |
 * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
 * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
 * |                                 | hh      | 01, 02, ..., 11, 12               |       |
 * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
 * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
 * |                                 | HH      | 00, 01, 02, ..., 23               |       |
 * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
 * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
 * |                                 | KK      | 01, 02, ..., 11, 00               |       |
 * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
 * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
 * |                                 | kk      | 24, 01, 02, ..., 23               |       |
 * | Minute                          | m       | 0, 1, ..., 59                     |       |
 * |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | mm      | 00, 01, ..., 59                   |       |
 * | Second                          | s       | 0, 1, ..., 59                     |       |
 * |                                 | so      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | ss      | 00, 01, ..., 59                   |       |
 * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
 * |                                 | SS      | 00, 01, ..., 99                   |       |
 * |                                 | SSS     | 000, 001, ..., 999                |       |
 * |                                 | SSSS    | ...                               | 3     |
 * | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
 * |                                 | XX      | -0800, +0530, Z                   |       |
 * |                                 | XXX     | -08:00, +05:30, Z                 |       |
 * |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
 * |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
 * | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
 * |                                 | xx      | -0800, +0530, +0000               |       |
 * |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
 * |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
 * |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
 * | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
 * |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
 * | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
 * |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
 * | Seconds timestamp               | t       | 512969520                         | 7     |
 * |                                 | tt      | ...                               | 3,7   |
 * | Milliseconds timestamp          | T       | 512969520900                      | 7     |
 * |                                 | TT      | ...                               | 3,7   |
 * | Long localized date             | P       | 04/29/1453                        | 7     |
 * |                                 | PP      | Apr 29, 1453                      | 7     |
 * |                                 | PPP     | April 29th, 1453                  | 7     |
 * |                                 | PPPP    | Friday, April 29th, 1453          | 2,7   |
 * | Long localized time             | p       | 12:00 AM                          | 7     |
 * |                                 | pp      | 12:00:00 AM                       | 7     |
 * |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
 * |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
 * | Combination of date and time    | Pp      | 04/29/1453, 12:00 AM              | 7     |
 * |                                 | PPpp    | Apr 29, 1453, 12:00:00 AM         | 7     |
 * |                                 | PPPppp  | April 29th, 1453 at ...           | 7     |
 * |                                 | PPPPpppp| Friday, April 29th, 1453 at ...   | 2,7   |
 * Notes:
 * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
 *    are the same as "stand-alone" units, but are different in some languages.
 *    "Formatting" units are declined according to the rules of the language
 *    in the context of a date. "Stand-alone" units are always nominative singular:
 *
 *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
 *
 *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
 *
 * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
 *    the single quote characters (see below).
 *    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
 *    the output will be the same as default pattern for this unit, usually
 *    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
 *    are marked with "2" in the last column of the table.
 *
 *    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
 *
 * 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
 *    The output will be padded with zeros to match the length of the pattern.
 *
 *    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
 *
 * 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
 *    These tokens represent the shortest form of the quarter.
 *
 * 5. The main difference between `y` and `u` patterns are B.C. years:
 *
 *    | Year | `y` | `u` |
 *    |------|-----|-----|
 *    | AC 1 |   1 |   1 |
 *    | BC 1 |   1 |   0 |
 *    | BC 2 |   2 |  -1 |
 *
 *    Also `yy` always returns the last two digits of a year,
 *    while `uu` pads single digit years to 2 characters and returns other years unchanged:
 *
 *    | Year | `yy` | `uu` |
 *    |------|------|------|
 *    | 1    |   01 |   01 |
 *    | 14   |   14 |   14 |
 *    | 376  |   76 |  376 |
 *    | 1453 |   53 | 1453 |
 *
 *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
 *    except local week-numbering years are dependent on `options.weekStartsOn`
 *    and `options.firstWeekContainsDate` (compare [getISOWeekYear](https://date-fns.org/docs/getISOWeekYear)
 *    and [getWeekYear](https://date-fns.org/docs/getWeekYear)).
 *
 * 6. Specific non-location timezones are currently unavailable in `date-fns`,
 *    so right now these tokens fall back to GMT timezones.
 *
 * 7. These patterns are not in the Unicode Technical Standard #35:
 *    - `i`: ISO day of week
 *    - `I`: ISO week of year
 *    - `R`: ISO week-numbering year
 *    - `t`: seconds timestamp
 *    - `T`: milliseconds timestamp
 *    - `o`: ordinal number modifier
 *    - `P`: long localized date
 *    - `p`: long localized time
 *
 * 8. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
 *    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * 9. `D` and `DD` tokens represent days of the year but they are often confused with days of the month.
 *    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * @param date - The original date
 * @param format - The string of tokens
 * @param options - An object with options
 *
 * @returns The formatted date string
 *
 * @throws `date` must not be Invalid Date
 * @throws `options.locale` must contain `localize` property
 * @throws `options.locale` must contain `formatLong` property
 * @throws use `yyyy` instead of `YYYY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `yy` instead of `YY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `d` instead of `D` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `dd` instead of `DD` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws format string contains an unescaped latin alphabet character
 *
 * @example
 * // Represent 11 February 2014 in middle-endian format:
 * const result = format(new Date(2014, 1, 11), 'MM/dd/yyyy')
 * //=> '02/11/2014'
 *
 * @example
 * // Represent 2 July 2014 in Esperanto:
 * import { eoLocale } from 'date-fns/locale/eo'
 * const result = format(new Date(2014, 6, 2), "do 'de' MMMM yyyy", {
 *   locale: eoLocale
 * })
 * //=> '2-a de julio 2014'
 *
 * @example
 * // Escape string by single quote characters:
 * const result = format(new Date(2014, 6, 2, 15), "h 'o''clock'")
 * //=> "3 o'clock"
 */
function format_format(date, formatStr, options) {
  const defaultOptions = getDefaultOptions();
  const locale = options?.locale ?? defaultOptions.locale ?? enUS;

  const firstWeekContainsDate =
    options?.firstWeekContainsDate ??
    options?.locale?.options?.firstWeekContainsDate ??
    defaultOptions.firstWeekContainsDate ??
    defaultOptions.locale?.options?.firstWeekContainsDate ??
    1;

  const weekStartsOn =
    options?.weekStartsOn ??
    options?.locale?.options?.weekStartsOn ??
    defaultOptions.weekStartsOn ??
    defaultOptions.locale?.options?.weekStartsOn ??
    0;

  const originalDate = toDate(date, options?.in);

  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }

  let parts = formatStr
    .match(longFormattingTokensRegExp)
    .map((substring) => {
      const firstCharacter = substring[0];
      if (firstCharacter === "p" || firstCharacter === "P") {
        const longFormatter = longFormatters[firstCharacter];
        return longFormatter(substring, locale.formatLong);
      }
      return substring;
    })
    .join("")
    .match(formattingTokensRegExp)
    .map((substring) => {
      // Replace two single quote characters with one single quote character
      if (substring === "''") {
        return { isToken: false, value: "'" };
      }

      const firstCharacter = substring[0];
      if (firstCharacter === "'") {
        return { isToken: false, value: cleanEscapedString(substring) };
      }

      if (formatters[firstCharacter]) {
        return { isToken: true, value: substring };
      }

      if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" +
            firstCharacter +
            "`",
        );
      }

      return { isToken: false, value: substring };
    });

  // invoke localize preprocessor (only for french locales at the moment)
  if (locale.localize.preprocessor) {
    parts = locale.localize.preprocessor(originalDate, parts);
  }

  const formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale,
  };

  return parts
    .map((part) => {
      if (!part.isToken) return part.value;

      const token = part.value;

      if (
        (!options?.useAdditionalWeekYearTokens &&
          isProtectedWeekYearToken(token)) ||
        (!options?.useAdditionalDayOfYearTokens &&
          isProtectedDayOfYearToken(token))
      ) {
        warnOrThrowProtectedError(token, formatStr, String(date));
      }

      const formatter = formatters[token[0]];
      return formatter(originalDate, token, locale.localize, formatterOptions);
    })
    .join("");
}

function cleanEscapedString(input) {
  const matched = input.match(escapedStringRegExp);

  if (!matched) {
    return input;
  }

  return matched[1].replace(doubleQuoteRegExp, "'");
}

// Fallback for modularized imports:
/* export default */ const date_fns_format = ((/* unused pure expression or super */ null && (format_format)));

// EXTERNAL MODULE: ./node_modules/.pnpm/webextension-polyfill@0.12.0/node_modules/webextension-polyfill/dist/browser-polyfill.js
var browser_polyfill = __webpack_require__(3675);
var browser_polyfill_default = /*#__PURE__*/__webpack_require__.n(browser_polyfill);
;// CONCATENATED MODULE: ./node_modules/.pnpm/nanoid@3.3.11/node_modules/nanoid/index.browser.js

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)
  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step | 0
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size, random)
let nanoid = (size = 21) =>
  crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    byte &= 63
    if (byte < 36) {
      id += byte.toString(36)
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte > 62) {
      id += '-'
    } else {
      id += '_'
    }
    return id
  }, '')


;// CONCATENATED MODULE: ./src/background/config.ts
/**
 * Keys for forwarder urls queries.
 */ var config_ForwarderUrlQueryKey = /*#__PURE__*/ function(ForwarderUrlQueryKey) {
    ForwarderUrlQueryKey["AdguardDnsKb"] = "ADGUARD_DNS_KB";
    ForwarderUrlQueryKey["AdguardDnsProvidersKb"] = "ADGUARD_DNS_PROVIDERS_KB";
    ForwarderUrlQueryKey["ComparePage"] = "COMPARE_PAGE";
    ForwarderUrlQueryKey["DeviceCount"] = "DEVICE_COUNT";
    ForwarderUrlQueryKey["EditAccount"] = "EDIT_ACCOUNT";
    ForwarderUrlQueryKey["Eula"] = "EULA";
    ForwarderUrlQueryKey["Faq"] = "FAQ";
    ForwarderUrlQueryKey["Feedback"] = "FEEDBACK";
    ForwarderUrlQueryKey["FirefoxThankYouPage"] = "FIREFOX_THANK_YOU_PAGE";
    ForwarderUrlQueryKey["LimitedOffer"] = "LIMITED_OFFER";
    ForwarderUrlQueryKey["LimitedOfferRu"] = "LIMITED_OFFER_RU";
    ForwarderUrlQueryKey["OptionsStore"] = "OPTIONS_STORE";
    ForwarderUrlQueryKey["OtherProducts"] = "OTHER_PRODUCTS";
    ForwarderUrlQueryKey["PopupDefaultSupport"] = "POPUP_DEFAULT_SUPPORT";
    ForwarderUrlQueryKey["PopupFeedback"] = "POPUP_FEEDBACK";
    ForwarderUrlQueryKey["PopupStore"] = "POPUP_STORE";
    ForwarderUrlQueryKey["Privacy"] = "PRIVACY";
    ForwarderUrlQueryKey["Subscribe"] = "SUBSCRIBE";
    ForwarderUrlQueryKey["SuggestFeature"] = "SUGGEST_FEATURE";
    ForwarderUrlQueryKey["ThankYouPage"] = "THANK_YOU_PAGE";
    ForwarderUrlQueryKey["UninstallPage"] = "UNINSTALL_PAGE";
    ForwarderUrlQueryKey["UpgradeLicense"] = "UPGRADE_LICENSE";
    ForwarderUrlQueryKey["VpnBlockedGetApp"] = "VPN_BLOCKED_GET_APP";
    ForwarderUrlQueryKey["VpnBlockedGetAppLinux"] = "VPN_BLOCKED_GET_APP_LINUX";
    ForwarderUrlQueryKey["Website"] = "WEBSITE";
    ForwarderUrlQueryKey["PromoteSocials"] = "PROMOTE_SOCIALS";
    return ForwarderUrlQueryKey;
}({});
// global data
// @ts-ignore
const CONFIG = {"BROWSER":"chrome","BUILD_ENV":"release","STAGE_ENV":"prod","PRIVACY":"action=privacy&from=popup&app=vpn_extension","EULA":"action=eula&from=popup&app=vpn_extension","UPGRADE_LICENSE":"action=buy_license&from=popup&app=vpn_extension","SUBSCRIBE":"action=subscribe&from=popup_connections_limit&app=vpn_extension","LIMITED_OFFER":"action=limited_offer&from=popup&app=vpn_extension","LIMITED_OFFER_RU":"action=limited_offer_ru&from=popup&app=vpn_extension","DEVICE_COUNT":"action=devices_count&from=popup_connections_limit&app=vpn_extension","OTHER_PRODUCTS":"action=other_products&from=popup&app=vpn_extension","POPUP_DEFAULT_SUPPORT":"action=support&from=popup&app=vpn_extension","WEBSITE":"action=adguard_site&from=options_screen&app=vpn_extension","FAQ":"action=faq&from=options_screen&app=vpn_extension","SUGGEST_FEATURE":"action=suggest_feature&from=options_screen&app=vpn_extension","THANK_YOU_PAGE":"action=thank_you_v2&from=background_page&app=vpn_extension","FIREFOX_THANK_YOU_PAGE":"action=thank_you_v2_firefox&from=background_page&app=vpn_extension","EDIT_ACCOUNT":"action=account_settings&from=options_screen&app=vpn_extension","UNINSTALL_PAGE":"action=adguard_uninstal_ext&from=background_page&app=vpn_extension","ADGUARD_DNS_KB":"action=adguard_dns_kb&from=options_screen&app=vpn_extension","ADGUARD_DNS_PROVIDERS_KB":"action=adguard_dns_providers_kb&from=options_screen&app=vpn_extension","COMPARE_PAGE":"action=compare&from=popup&app=vpn_extension","VPN_BLOCKED_GET_APP":"action=vpn_blocked_get_app&from=popup&app=vpn_extension","VPN_BLOCKED_GET_APP_LINUX":"action=vpn_blocked_get_app_linux&from=popup&app=vpn_extension","PROMOTE_SOCIALS":"action=vpn_mentions_for_gbs&from=options_screen&app=vpn_extension","POPUP_STORE":"action=chrome_store&from=popup&app=vpn_extension","POPUP_FEEDBACK":"action=feedback_chrome&from=popup&app=vpn_extension","OPTIONS_STORE":"action=chrome_store&from=options_screen&app=vpn_extension","FEEDBACK":"action=feedback_chrome&from=options_screen&app=vpn_extension","VPN_API_URL":"api.adguard.io","AUTH_API_URL":"auth.adguard.io","TELEMETRY_API_URL":"api.agrdvpn-tm.com","FORWARDER_DOMAIN":"link.adtidy.info","WS_API_URL_TEMPLATE":"wss://{{host}}:443/user?hash={{hash}}","AUTH_CLIENT_ID":"adguard-vpn-extension","AMO_PRIVACY_URL":"https://addons.mozilla.org/en-US/firefox/addon/adguard-vpn/privacy/","AMO_EULA_URL":"https://addons.mozilla.org/en-US/firefox/addon/adguard-vpn/eula/"};
const { VPN_API_URL, AUTH_API_URL, TELEMETRY_API_URL, AUTH_CLIENT_ID, WS_API_URL_TEMPLATE, BROWSER, BUILD_ENV, STAGE_ENV, AMO_EULA_URL, AMO_PRIVACY_URL, // keep them sorted
ADGUARD_DNS_KB, ADGUARD_DNS_PROVIDERS_KB, COMPARE_PAGE, DEVICE_COUNT, EDIT_ACCOUNT, EULA, FAQ, FEEDBACK, FIREFOX_THANK_YOU_PAGE, LIMITED_OFFER, LIMITED_OFFER_RU, OPTIONS_STORE, OTHER_PRODUCTS, POPUP_DEFAULT_SUPPORT, POPUP_FEEDBACK, POPUP_STORE, PRIVACY, PROMOTE_SOCIALS, SUBSCRIBE, SUGGEST_FEATURE, THANK_YOU_PAGE, UNINSTALL_PAGE, UPGRADE_LICENSE, VPN_BLOCKED_GET_APP, VPN_BLOCKED_GET_APP_LINUX, WEBSITE } = CONFIG;
// not destructuring for adding a jsdoc comment
/**
 * **Should NOT be used directly**, use the Forwarder class. AG-32237.
 */ const FORWARDER_DOMAIN = CONFIG.FORWARDER_DOMAIN; // eslint-disable-line prefer-destructuring
/**
 * List of forwarder urls queries from the config.
 *
 * Needed for forwarder url generation. AG-32237.
 */ const FORWARDER_URL_QUERIES = (/* unused pure expression or super */ null && ({
    ADGUARD_DNS_KB,
    ADGUARD_DNS_PROVIDERS_KB,
    COMPARE_PAGE,
    DEVICE_COUNT,
    EDIT_ACCOUNT,
    EULA,
    FAQ,
    FEEDBACK,
    FIREFOX_THANK_YOU_PAGE,
    LIMITED_OFFER,
    LIMITED_OFFER_RU,
    OPTIONS_STORE,
    OTHER_PRODUCTS,
    POPUP_DEFAULT_SUPPORT,
    POPUP_FEEDBACK,
    POPUP_STORE,
    PRIVACY,
    PROMOTE_SOCIALS,
    SUBSCRIBE,
    SUGGEST_FEATURE,
    THANK_YOU_PAGE,
    UNINSTALL_PAGE,
    UPGRADE_LICENSE,
    VPN_BLOCKED_GET_APP,
    VPN_BLOCKED_GET_APP_LINUX,
    WEBSITE
}));


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
function dist_bytes(requirement, message$1) {
	return {
		kind: "validation",
		type: "bytes",
		reference: dist_bytes,
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
function dist_email(message$1) {
	return {
		kind: "validation",
		type: "email",
		reference: dist_email,
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
function dist_isoWeek(message$1) {
	return {
		kind: "validation",
		type: "iso_week",
		reference: dist_isoWeek,
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
function dist_nanoid(message$1) {
	return {
		kind: "validation",
		type: "nanoid",
		reference: dist_nanoid,
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
function dist_normalize(form) {
	return {
		kind: "transformation",
		type: "normalize",
		reference: dist_normalize,
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
function dist_toDate(message$1) {
	return {
		kind: "transformation",
		type: "to_date",
		reference: dist_toDate,
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
function dist_array(item, message$1) {
	return {
		kind: "schema",
		type: "array",
		reference: dist_array,
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
function dist_blob(message$1) {
	return {
		kind: "schema",
		type: "blob",
		reference: dist_blob,
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
function dist_number(message$1) {
	return {
		kind: "schema",
		type: "number",
		reference: dist_number,
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
function dist_string(message$1) {
	return {
		kind: "schema",
		type: "string",
		reference: dist_string,
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

const logsValidator = optional(dist_array(dist_string()), ()=>[]);

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


;// CONCATENATED MODULE: ./src/common/messenger.ts
function messenger_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
function messenger_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                messenger_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                messenger_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}





/**
 * Function that checks if the message is a valid {@link Message}.
 *
 * @param message Message to check.
 *
 * @returns True if the message is a valid message, false otherwise.
 */ const isMessage = (message)=>{
    if (typeof message !== 'object' || message === null) {
        return false;
    }
    const { type } = message;
    return typeof type === 'string' && Object.values(constants_MessageType).includes(type);
};
class Messenger {
    sendMessage(type, data) {
        return messenger_async_to_generator(function*() {
            log.debug(`[vpn.Messenger.sendMessage]: Request type: "${type}"`);
            if (data) {
                log.debug('[vpn.Messenger.sendMessage]: Request data:', data);
            }
            const response = yield browser_polyfill_default().runtime.sendMessage({
                type,
                data
            });
            if (response) {
                log.debug(`[vpn.Messenger.sendMessage]: Response type: "${type}"`);
                log.debug('[vpn.Messenger.sendMessage]: Response data:', response);
            }
            // TODO: This is temporary fix of message type,
            // it should be refactored to support `unknown` type (AG-41896)
            return response;
        })();
    }
    getPopupData(url, numberOfTries) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_POPUP_DATA;
            return this.sendMessage(type, {
                url,
                numberOfTries
            });
        }).call(this);
    }
    /**
     * Sends a message to the background page to get limited data offer for the user.
     *
     * @returns Returns a promise that resolves to an object with the limited offer data or null.
     */ getLimitedOfferData() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_LIMITED_OFFER_DATA;
            return this.sendMessage(type);
        }).call(this);
    }
    /**
     * Sends a message to the background page to update locations from the server.
     *
     * @returns Returns a promise that resolves to an array of locations
     * or null if locations update failed.
     */ forceUpdateLocations() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.FORCE_UPDATE_LOCATIONS;
            return this.sendMessage(type);
        }).call(this);
    }
    /**
     * Sends a message to the background page to save locations tab.
     *
     * @param locationsTab New locations tab.
     *
     * @returns Promise that resolves when locations tab is saved.
     */ saveLocationsTab(locationsTab) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.SAVED_LOCATIONS_SAVE_TAB;
            return this.sendMessage(type, {
                locationsTab
            });
        }).call(this);
    }
    /**
     * Sends a message to the background page to add location to saved locations.
     *
     * @param locationId Location ID to add.
     *
     * @returns Promise that resolves when location is added.
     */ addSavedLocation(locationId) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.SAVED_LOCATIONS_ADD;
            return this.sendMessage(type, {
                locationId
            });
        }).call(this);
    }
    /**
     * Sends a message to the background page to remove location from saved locations.
     *
     * @param locationId Location ID to remove.
     *
     * @returns Promise that resolves when location is removed.
     */ removeSavedLocation(locationId) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.SAVED_LOCATIONS_REMOVE;
            return this.sendMessage(type, {
                locationId
            });
        }).call(this);
    }
    /**
     * Sends a message to the background page to get options data.
     *
     * @param isRefresh If `true`, skips new `pageId` generation.
     * Use this when you want to refresh the data without needing to
     * generate a new `pageId`.
     *
     * @returns Returns a promise that resolves to the options data.
     */ getOptionsData(isRefresh) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_OPTIONS_DATA;
            return this.sendMessage(type, {
                isRefresh
            });
        }).call(this);
    }
    /**
     * Sends a message to the background page to get consent data.
     *
     * @returns Data needed for the consent page.
     */ getConsentData() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_CONSENT_DATA;
            return this.sendMessage(type);
        }).call(this);
    }
    /**
     * Sends a message to the background page to set consent data,
     * which includes user agreement to the policy and help us improve checkbox.
     *
     * @param policyAgreement Policy agreement status.
     * @param helpUsImprove Help us improve status.
     *
     * @returns Promise that resolves when consent data is set.
     */ setConsentData(policyAgreement, helpUsImprove) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.SET_CONSENT_DATA;
            return this.sendMessage(type, {
                policyAgreement,
                helpUsImprove
            });
        }).call(this);
    }
    getVpnFailurePage() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_VPN_FAILURE_PAGE;
            return this.sendMessage(type);
        }).call(this);
    }
    openOptionsPage() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.OPEN_OPTIONS_PAGE;
            return this.sendMessage(type);
        }).call(this);
    }
    openFreeGbsPage() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.OPEN_FREE_GBS_PAGE;
            return this.sendMessage(type);
        }).call(this);
    }
    getBonusesData() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_BONUSES_DATA;
            return this.sendMessage(type);
        }).call(this);
    }
    setCurrentLocation(location, isSelectedByUser) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.SET_SELECTED_LOCATION;
            return this.sendMessage(type, {
                location,
                isSelectedByUser
            });
        }).call(this);
    }
    deauthenticateUser() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.DEAUTHENTICATE_USER;
            return this.sendMessage(type);
        }).call(this);
    }
    updateAuthCache(field, value) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.UPDATE_AUTH_CACHE;
            return this.sendMessage(type, {
                field,
                value
            });
        }).call(this);
    }
    getCanControlProxy() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_CAN_CONTROL_PROXY;
            return this.sendMessage(type);
        }).call(this);
    }
    enableProxy(force) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.ENABLE_PROXY;
            return this.sendMessage(type, {
                force
            });
        }).call(this);
    }
    disableProxy(force) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.DISABLE_PROXY;
            return this.sendMessage(type, {
                force
            });
        }).call(this);
    }
    addUrlToExclusions(url) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.ADD_URL_TO_EXCLUSIONS;
            return this.sendMessage(type, {
                url
            });
        }).call(this);
    }
    removeExclusion(id) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.REMOVE_EXCLUSION;
            return this.sendMessage(type, {
                id
            });
        }).call(this);
    }
    disableVpnByUrl(url) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.DISABLE_VPN_BY_URL;
            return this.sendMessage(type, {
                url
            });
        }).call(this);
    }
    enableVpnByUrl(url) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.ENABLE_VPN_BY_URL;
            return this.sendMessage(type, {
                url
            });
        }).call(this);
    }
    toggleExclusionState(id) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.TOGGLE_EXCLUSION_STATE;
            return this.sendMessage(type, {
                id
            });
        }).call(this);
    }
    restoreExclusions() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.RESTORE_EXCLUSIONS;
            return this.sendMessage(type);
        }).call(this);
    }
    toggleServices(ids) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.TOGGLE_SERVICES;
            return this.sendMessage(type, {
                ids
            });
        }).call(this);
    }
    resetServiceData(serviceId) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.RESET_SERVICE_DATA;
            return this.sendMessage(type, {
                serviceId
            });
        }).call(this);
    }
    clearExclusionsList() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.CLEAR_EXCLUSIONS_LIST;
            return this.sendMessage(type);
        }).call(this);
    }
    disableOtherExtensions() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.DISABLE_OTHER_EXTENSIONS;
            return this.sendMessage(type);
        }).call(this);
    }
    isAuthenticated() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.IS_AUTHENTICATED;
            return this.sendMessage(type);
        }).call(this);
    }
    clearPermissionsError() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.CLEAR_PERMISSIONS_ERROR;
            return this.sendMessage(type);
        }).call(this);
    }
    checkPermissions() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.CHECK_PERMISSIONS;
            return this.sendMessage(type);
        }).call(this);
    }
    getExclusionsInverted() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_EXCLUSIONS_INVERTED;
            return this.sendMessage(type);
        }).call(this);
    }
    getSetting(settingId) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_SETTING_VALUE;
            return this.sendMessage(type, {
                settingId
            });
        }).call(this);
    }
    setSetting(settingId, value) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.SET_SETTING_VALUE;
            return this.sendMessage(type, {
                settingId,
                value
            });
        }).call(this);
    }
    getUsername() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_USERNAME;
            return this.sendMessage(type);
        }).call(this);
    }
    /**
     * Updates user decision on marketing consent.
     *
     * @param newMarketingConsent New marketing consent value.
     */ updateMarketingConsent(newMarketingConsent) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.UPDATE_MARKETING_CONSENT;
            return this.sendMessage(type, {
                newMarketingConsent
            });
        }).call(this);
    }
    getExclusionsData() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_EXCLUSIONS_DATA;
            return this.sendMessage(type);
        }).call(this);
    }
    setExclusionsMode(mode) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.SET_EXCLUSIONS_MODE;
            return this.sendMessage(type, {
                mode
            });
        }).call(this);
    }
    getSelectedLocation() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_SELECTED_LOCATION;
            return this.sendMessage(type);
        }).call(this);
    }
    checkIsPremiumToken() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.CHECK_IS_PREMIUM_TOKEN;
            return this.sendMessage(type);
        }).call(this);
    }
    hideRateModalAfterCancel() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.HIDE_RATE_MODAL_AFTER_CANCEL;
            return this.sendMessage(type);
        }).call(this);
    }
    hideRateModalAfterRate() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.HIDE_RATE_MODAL_AFTER_RATE;
            return this.sendMessage(type);
        }).call(this);
    }
    hideMobileEdgePromoBanner() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.HIDE_MOBILE_EDGE_PROMO_BANNER;
            return this.sendMessage(type);
        }).call(this);
    }
    setNotificationViewed(withDelay) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.SET_NOTIFICATION_VIEWED;
            return this.sendMessage(type, {
                withDelay
            });
        }).call(this);
    }
    setHintPopupViewed() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.SET_HINT_POPUP_VIEWED;
            return this.sendMessage(type);
        }).call(this);
    }
    markRegionNoticeAsShown() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.MARK_REGION_NOTICE_AS_SHOWN;
            return this.sendMessage(type);
        }).call(this);
    }
    openTab(url) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.OPEN_TAB;
            return this.sendMessage(type, {
                url
            });
        }).call(this);
    }
    reportBug(email, message, includeLog) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.REPORT_BUG;
            return this.sendMessage(type, {
                email,
                message,
                includeLog
            });
        }).call(this);
    }
    /**
     * Opens Premium Promo Page in new tab.
     * @returns Promise that resolves when Premium Promo Page is opened.
     */ openPremiumPromoPage() {
        return messenger_async_to_generator(function*() {
            return this.openForwarderUrlWithEmail(config_ForwarderUrlQueryKey.UpgradeLicense);
        }).call(this);
    }
    /**
     * Opens Subscribe Promo Page in new tab.
     * @returns Promise that resolves when Subscribe Promo Page is opened.
     */ openSubscribePromoPage() {
        return messenger_async_to_generator(function*() {
            return this.openForwarderUrlWithEmail(config_ForwarderUrlQueryKey.Subscribe);
        }).call(this);
    }
    /**
     * Opens Promote Socials Page in new tab.
     * @returns Promise that resolves when Promote Socials Page is opened.
     */ openPromoteSocialsPage() {
        return messenger_async_to_generator(function*() {
            return this.openForwarderUrlWithEmail(config_ForwarderUrlQueryKey.PromoteSocials);
        }).call(this);
    }
    /**
     * Opens forwarder URL in new tab by appending email query param if user is logged in.
     *
     * @param forwarderUrlQueryKey Forwarder query key.
     *
     * @returns Promise that resolves when forwarder URL is opened.
     */ openForwarderUrlWithEmail(forwarderUrlQueryKey) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.OPEN_FORWARDER_URL_WITH_EMAIL;
            return this.sendMessage(type, {
                forwarderUrlQueryKey
            });
        }).call(this);
    }
    /**
     * Sets value for key in flags storage
     *
     * @param key
     * @param value
     *
     * @returns Promise that resolves when flag is set.
     */ setFlag(key, value) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.SET_FLAG;
            return this.sendMessage(type, {
                key,
                value
            });
        }).call(this);
    }
    getGeneralExclusions() {
        const type = constants_MessageType.GET_GENERAL_EXCLUSIONS;
        return this.sendMessage(type);
    }
    getSelectiveExclusions() {
        const type = constants_MessageType.GET_SELECTIVE_EXCLUSIONS;
        return this.sendMessage(type);
    }
    addRegularExclusions(exclusions) {
        const type = constants_MessageType.ADD_REGULAR_EXCLUSIONS;
        return this.sendMessage(type, {
            exclusions
        });
    }
    addSelectiveExclusions(exclusions) {
        const type = constants_MessageType.ADD_SELECTIVE_EXCLUSIONS;
        return this.sendMessage(type, {
            exclusions
        });
    }
    addExclusionsMap(exclusionsMap) {
        const type = constants_MessageType.ADD_EXCLUSIONS_MAP;
        return this.sendMessage(type, {
            exclusionsMap
        });
    }
    addCustomDnsServer(dnsServerData) {
        const type = constants_MessageType.ADD_CUSTOM_DNS_SERVER;
        return this.sendMessage(type, {
            dnsServerData
        });
    }
    editCustomDnsServer(dnsServerData) {
        const type = constants_MessageType.EDIT_CUSTOM_DNS_SERVER;
        return this.sendMessage(type, {
            dnsServerData
        });
    }
    removeCustomDnsServer(dnsServerId) {
        const type = constants_MessageType.REMOVE_CUSTOM_DNS_SERVER;
        return this.sendMessage(type, {
            dnsServerId
        });
    }
    restoreCustomDnsServersData() {
        const type = constants_MessageType.RESTORE_CUSTOM_DNS_SERVERS_DATA;
        return this.sendMessage(type);
    }
    /**
     * Gets logs from the background page.
     *
     * @returns Logs from the background page.
     */ getLogs() {
        const type = constants_MessageType.GET_LOGS;
        return this.sendMessage(type);
    }
    /**
     * Gets app version from background page.
     *
     * @returns App version from background page.
     */ getAppVersion() {
        const type = constants_MessageType.GET_APP_VERSION;
        return this.sendMessage(type);
    }
    /**
     * Re-fetches locations from the server, refreshing backend-provided pings.
     *
     * @returns Promise that resolves when locations are refreshed.
     */ refreshLocations() {
        const type = constants_MessageType.REFRESH_LOCATIONS;
        return this.sendMessage(type);
    }
    /**
     * Sends a message to the background to send a page view telemetry event.
     *
     * NOTE: Do not await this function, as it is not necessary to wait for the response.
     *
     * @param screenName Name of the screen.
     * @param pageId Page ID of the screen.
     *
     * @returns Promise that resolves when page view telemetry event is sent.
     */ sendPageViewTelemetryEvent(screenName, pageId) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.TELEMETRY_EVENT_SEND_PAGE_VIEW;
            return this.sendMessage(type, {
                screenName,
                pageId
            });
        }).call(this);
    }
    /**
     * Sends a message to the background to send a custom telemetry event.
     *
     * NOTE: Do not await this function, as it is not necessary to wait for the response.
     *
     * @returns Promise that resolves when custom telemetry event is sent.
     * @param actionName Name of the action.
     * @param screenName Screen that action is related to.
     * @param label Optional label for the event.
     */ sendCustomTelemetryEvent(actionName, screenName, label) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.TELEMETRY_EVENT_SEND_CUSTOM;
            return this.sendMessage(type, {
                actionName,
                screenName,
                label
            });
        }).call(this);
    }
    /**
     * Removes opened page from the list of opened pages of telemetry module.
     *
     * @param pageId ID of page to remove.
     *
     * @returns Promise that resolves when opened page is removed.
     */ removeTelemetryOpenedPage(pageId) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.TELEMETRY_EVENT_REMOVE_OPENED_PAGE;
            return this.sendMessage(type, {
                pageId
            });
        }).call(this);
    }
    /**
     * Retrieves statistics data for the given range.
     *
     * @param range The range for which statistics data is needed.
     *
     * @returns Stats data for the given range.
     */ getStatsByRange(range) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.STATISTICS_GET_BY_RANGE;
            return this.sendMessage(type, {
                range
            });
        }).call(this);
    }
    /**
     * Clears all statistics.
     *
     * WARNING: This method will delete all statistics data,
     * make sure that you know what you are doing before calling it.
     *
     * @returns Promise that resolves when statistics are cleared.
     */ clearStatistics() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.STATISTICS_CLEAR;
            return this.sendMessage(type);
        }).call(this);
    }
    /**
     * Sets the statistics disabled state.
     *
     * @param isDisabled If `true`, statistics will be disabled and no data will be collected.
     * @returns Promise that resolves when statistics disabled state is set.
     */ setStatisticsIsDisabled(isDisabled) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.STATISTICS_SET_IS_DISABLED;
            return this.sendMessage(type, {
                isDisabled
            });
        }).call(this);
    }
    /**
     * Sends a web authentication flow action to the background.
     *
     * @param action Action to send.
     */ sendWebAuthAction(action) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.SEND_WEB_AUTH_ACTION;
            return this.sendMessage(type, {
                action
            });
        }).call(this);
    }
    /**
     * Gets startup data from the background page.
     *
     * @returns Promise with all required data for onboarding and upgrade screen.
     */ getStartupData() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_STARTUP_DATA;
            return this.sendMessage(type);
        }).call(this);
    }
    /**
     * Sets the interface language preference.
     *
     * @param language Locale code (e.g. 'de') or 'auto' for browser default.
     */ setInterfaceLanguage(language) {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.SET_INTERFACE_LANGUAGE;
            return this.sendMessage(type, {
                language
            });
        }).call(this);
    }
    /**
     * Retrieves the current interface language preference.
     *
     * @returns The current locale code or 'auto'.
     */ getInterfaceLanguage() {
        return messenger_async_to_generator(function*() {
            const type = constants_MessageType.GET_INTERFACE_LANGUAGE;
            return this.sendMessage(type);
        }).call(this);
    }
    constructor(){
        /**
     * Used to receive notifications from background page.
     *
     * @param events Events for listening
     * @param callback Event listener callback
     *
     * @returns function to remove event listener.
     */ this.createEventListener = (events, callback)=>messenger_async_to_generator(function*() {
                const eventListener = (...args)=>{
                    callback(...args);
                };
                let listenerId = yield this.sendMessage(constants_MessageType.ADD_EVENT_LISTENER, {
                    events
                });
                const onUpdateListeners = ()=>messenger_async_to_generator(function*() {
                        const response = yield this.sendMessage(constants_MessageType.ADD_EVENT_LISTENER, {
                            events
                        });
                        listenerId = response;
                    }).call(this);
                const messageHandler = (message)=>{
                    if (!isMessage(message)) {
                        log.error('[vpn.Messenger]: Invalid message received:', message);
                        return;
                    }
                    if (message.type === constants_MessageType.NOTIFY_LISTENERS) {
                        const [type, data, value] = message.data;
                        eventListener({
                            type,
                            data,
                            value
                        });
                    }
                    if (message.type === constants_MessageType.UPDATE_LISTENERS) {
                        onUpdateListeners();
                    }
                };
                const onUnload = ()=>messenger_async_to_generator(function*() {
                        if (listenerId) {
                            browser_polyfill_default().runtime.onMessage.removeListener(messageHandler);
                            window.removeEventListener('beforeunload', onUnload);
                            window.removeEventListener('unload', onUnload);
                            yield this.sendMessage(constants_MessageType.REMOVE_EVENT_LISTENER, {
                                listenerId
                            });
                            listenerId = null;
                        }
                    }).call(this);
                browser_polyfill_default().runtime.onMessage.addListener(messageHandler);
                window.addEventListener('beforeunload', onUnload);
                window.addEventListener('unload', onUnload);
                return onUnload;
            }).call(this);
        /**
     * Creates long lived connections between popup and background page.
     *
     * @param events
     * @param callback
     *
     * @returns Function to disconnect long lived connection.
     */ this.createLongLivedConnection = (events, callback)=>{
            const eventListener = (...args)=>{
                callback(...args);
            };
            const portId = `popup_${nanoid()}`;
            let port;
            let forceDisconnected = false;
            const connect = ()=>{
                port = browser_polyfill_default().runtime.connect({
                    name: portId
                });
                port.postMessage({
                    type: constants_MessageType.ADD_LONG_LIVED_CONNECTION,
                    data: {
                        events
                    }
                });
                port.onMessage.addListener((message)=>{
                    if (!isMessage(message)) {
                        log.error('[vpn.Messenger]: Invalid message received:', message);
                        return;
                    }
                    if (message.type === constants_MessageType.NOTIFY_LISTENERS) {
                        const [type, data, value] = message.data;
                        eventListener({
                            type,
                            data,
                            value
                        });
                    }
                });
                port.onDisconnect.addListener(()=>{
                    if ((browser_polyfill_default()).runtime.lastError) {
                        log.debug('[vpn.Messenger]: ', (browser_polyfill_default()).runtime.lastError.message);
                    }
                    // we try to connect again if the background page was terminated
                    if (!forceDisconnected) {
                        connect();
                    }
                });
            };
            connect();
            const onUnload = ()=>{
                if (port) {
                    forceDisconnected = true;
                    port.disconnect();
                }
            };
            window.addEventListener('beforeunload', onUnload);
            window.addEventListener('unload', onUnload);
            return {
                onUnload,
                portId
            };
        };
    }
}
const messenger = new Messenger();

;// CONCATENATED MODULE: ./src/export/export-logs.ts
function export_logs_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
function export_logs_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                export_logs_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                export_logs_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}




var export_logs_FileExtension = /*#__PURE__*/ (/* unused pure expression or super */ null && (function(FileExtension) {
    FileExtension["Txt"] = "txt";
    return FileExtension;
}(export_logs_FileExtension || {})));
/**
 * Helper for creating a downloadable file
 */ const exportData = (content, fileExtension, appVersion)=>export_logs_async_to_generator(function*() {
        const currentTimeString = format_format(Date.now(), 'yyyyMMdd_HHmmss');
        const filename = `${currentTimeString}_adg_vpn_v${appVersion}.${fileExtension}`;
        const blob = new Blob([
            content
        ]);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    })();
const getLogs = ()=>export_logs_async_to_generator(function*() {
        return messenger.sendMessage(constants_MessageType.GET_LOGS);
    })();
const getAppVersion = ()=>export_logs_async_to_generator(function*() {
        return messenger.sendMessage(constants_MessageType.GET_APP_VERSION);
    })();
const exportLogs = ()=>export_logs_async_to_generator(function*() {
        try {
            const logs = yield getLogs();
            const appVersion = yield getAppVersion();
            yield exportData(logs, "txt", appVersion);
        } catch (e) {
            log.error('[vpn.export-logs]: ', e.message);
        }
    })();

;// CONCATENATED MODULE: ./src/export/index.ts
function export_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
function export_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                export_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                export_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

(()=>export_async_to_generator(function*() {
        yield exportLogs();
    })())();

})();

})()
;