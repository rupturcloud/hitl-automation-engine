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
8558(module) {
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


},
9481(__unused_rspack_module, exports, __webpack_require__) {
"use strict";
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/*
 Modernizr 3.0.0pre (Custom Build) | MIT
*/
var aa=__webpack_require__(758),ca=__webpack_require__(1896);function p(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var da=new Set,ea={};function fa(a,b){ha(a,b);ha(a+"Capture",b)}
function ha(a,b){ea[a]=b;for(a=0;a<b.length;a++)da.add(b[a])}
var ia=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ja=Object.prototype.hasOwnProperty,ka=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,la=
{},ma={};function oa(a){if(ja.call(ma,a))return!0;if(ja.call(la,a))return!1;if(ka.test(a))return ma[a]=!0;la[a]=!0;return!1}function pa(a,b,c,d){if(null!==c&&0===c.type)return!1;switch(typeof b){case "function":case "symbol":return!0;case "boolean":if(d)return!1;if(null!==c)return!c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return"data-"!==a&&"aria-"!==a;default:return!1}}
function qa(a,b,c,d){if(null===b||"undefined"===typeof b||pa(a,b,c,d))return!0;if(d)return!1;if(null!==c)switch(c.type){case 3:return!b;case 4:return!1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return!1}function v(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g}var z={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){z[a]=new v(a,0,!1,a,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];z[b]=new v(b,1,!1,a[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(a){z[a]=new v(a,2,!1,a.toLowerCase(),null,!1,!1)});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){z[a]=new v(a,2,!1,a,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){z[a]=new v(a,3,!1,a.toLowerCase(),null,!1,!1)});
["checked","multiple","muted","selected"].forEach(function(a){z[a]=new v(a,3,!0,a,null,!1,!1)});["capture","download"].forEach(function(a){z[a]=new v(a,4,!1,a,null,!1,!1)});["cols","rows","size","span"].forEach(function(a){z[a]=new v(a,6,!1,a,null,!1,!1)});["rowSpan","start"].forEach(function(a){z[a]=new v(a,5,!1,a.toLowerCase(),null,!1,!1)});var ra=/[\-:]([a-z])/g;function sa(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(ra,
sa);z[b]=new v(b,1,!1,a,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(ra,sa);z[b]=new v(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(ra,sa);z[b]=new v(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(a){z[a]=new v(a,1,!1,a.toLowerCase(),null,!1,!1)});
z.xlinkHref=new v("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){z[a]=new v(a,1,!1,a.toLowerCase(),null,!0,!0)});
function ta(a,b,c,d){var e=z.hasOwnProperty(b)?z[b]:null;if(null!==e?0!==e.type:d||!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1])qa(b,c,e,d)&&(c=null),d||null===e?oa(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c)))}
var ua=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,va=Symbol.for("react.element"),wa=Symbol.for("react.portal"),ya=Symbol.for("react.fragment"),za=Symbol.for("react.strict_mode"),Aa=Symbol.for("react.profiler"),Ba=Symbol.for("react.provider"),Ca=Symbol.for("react.context"),Da=Symbol.for("react.forward_ref"),Ea=Symbol.for("react.suspense"),Fa=Symbol.for("react.suspense_list"),Ga=Symbol.for("react.memo"),Ha=Symbol.for("react.lazy");Symbol.for("react.scope");Symbol.for("react.debug_trace_mode");
var Ia=Symbol.for("react.offscreen");Symbol.for("react.legacy_hidden");Symbol.for("react.cache");Symbol.for("react.tracing_marker");var Ja=Symbol.iterator;function Ka(a){if(null===a||"object"!==typeof a)return null;a=Ja&&a[Ja]||a["@@iterator"];return"function"===typeof a?a:null}var A=Object.assign,La;function Ma(a){if(void 0===La)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);La=b&&b[1]||""}return"\n"+La+a}var Na=!1;
function Oa(a,b){if(!a||Na)return"";Na=!0;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[])}catch(l){var d=l}Reflect.construct(a,[],b)}else{try{b.call()}catch(l){d=l}a.call(b.prototype)}else{try{throw Error();}catch(l){d=l}a()}}catch(l){if(l&&d&&"string"===typeof l.stack){for(var e=l.stack.split("\n"),
f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h]){var k="\n"+e[g].replace(" at new "," at ");a.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",a.displayName));return k}while(1<=g&&0<=h)}break}}}finally{Na=!1,Error.prepareStackTrace=c}return(a=a?a.displayName||a.name:"")?Ma(a):""}
function Pa(a){switch(a.tag){case 5:return Ma(a.type);case 16:return Ma("Lazy");case 13:return Ma("Suspense");case 19:return Ma("SuspenseList");case 0:case 2:case 15:return a=Oa(a.type,!1),a;case 11:return a=Oa(a.type.render,!1),a;case 1:return a=Oa(a.type,!0),a;default:return""}}
function Qa(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ya:return"Fragment";case wa:return"Portal";case Aa:return"Profiler";case za:return"StrictMode";case Ea:return"Suspense";case Fa:return"SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case Ca:return(a.displayName||"Context")+".Consumer";case Ba:return(a._context.displayName||"Context")+".Provider";case Da:var b=a.render;a=a.displayName;a||(a=b.displayName||
b.name||"",a=""!==a?"ForwardRef("+a+")":"ForwardRef");return a;case Ga:return b=a.displayName||null,null!==b?b:Qa(a.type)||"Memo";case Ha:b=a._payload;a=a._init;try{return Qa(a(b))}catch(c){}}return null}
function Ra(a){var b=a.type;switch(a.tag){case 24:return"Cache";case 9:return(b.displayName||"Context")+".Consumer";case 10:return(b._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return a=b.render,a=a.displayName||a.name||"",b.displayName||(""!==a?"ForwardRef("+a+")":"ForwardRef");case 7:return"Fragment";case 5:return b;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Qa(b);case 8:return b===za?"StrictMode":"Mode";case 22:return"Offscreen";
case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if("function"===typeof b)return b.displayName||b.name||null;if("string"===typeof b)return b}return null}function Sa(a){switch(typeof a){case "boolean":case "number":case "string":case "undefined":return a;case "object":return a;default:return""}}
function Ta(a){var b=a.type;return(a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
function Ua(a){var b=Ta(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a)}});Object.defineProperty(a,b,{enumerable:c.enumerable});return{getValue:function(){return d},setValue:function(a){d=""+a},stopTracking:function(){a._valueTracker=
null;delete a[b]}}}}function Va(a){a._valueTracker||(a._valueTracker=Ua(a))}function Wa(a){if(!a)return!1;var b=a._valueTracker;if(!b)return!0;var c=b.getValue();var d="";a&&(d=Ta(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}function Xa(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
function Ya(a,b){var c=b.checked;return A({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value}}function ab(a,b){b=b.checked;null!=b&&ta(a,"checked",b,!1)}
function bb(a,b){ab(a,b);var c=Sa(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?cb(a,b.type,c):b.hasOwnProperty("defaultValue")&&cb(a,b.type,Sa(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked)}
function db(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c)}
function cb(a,b,c){if("number"!==b||Xa(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c)}var eb=Array.isArray;
function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0)}else{c=""+Sa(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e])}null!==b&&(b.selected=!0)}}
function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(p(91));return A({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(p(92));if(eb(c)){if(1<c.length)throw Error(p(93));c=c[0]}b=c}null==b&&(b="");c=b}a._wrapperState={initialValue:Sa(c)}}
function ib(a,b){var c=Sa(b.value),d=Sa(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d)}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b)}function kb(a){switch(a){case "svg":return"http://www.w3.org/2000/svg";case "math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}
function lb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?kb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
var mb,nb=function(a){return"undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)})}:a}(function(a,b){if("http://www.w3.org/2000/svg"!==a.namespaceURI||"innerHTML"in a)a.innerHTML=b;else{mb=mb||document.createElement("div");mb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=mb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild)}});
function ob(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b}
var pb={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,
zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},qb=["Webkit","ms","Moz","O"];Object.keys(pb).forEach(function(a){qb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);pb[b]=pb[a]})});function rb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||pb.hasOwnProperty(a)&&pb[a]?(""+b).trim():b+"px"}
function sb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=rb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e}}var tb=A({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
function ub(a,b){if(b){if(tb[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(p(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(p(60));if("object"!==typeof b.dangerouslySetInnerHTML||!("__html"in b.dangerouslySetInnerHTML))throw Error(p(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(p(62));}}
function vb(a,b){if(-1===a.indexOf("-"))return"string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return!1;default:return!0}}var wb=null;function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(p(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b))}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a])}}function Gb(a,b){return a(b)}function Hb(){}var Ib=!1;function Jb(a,b,c){if(Ib)return a(b,c);Ib=!0;try{return Gb(a,b,c)}finally{if(Ib=!1,null!==zb||null!==Ab)Hb(),Fb()}}
function Kb(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1}if(a)return null;if(c&&"function"!==
typeof c)throw Error(p(231,b,typeof c));return c}var Lb=!1;if(ia)try{var Mb={};Object.defineProperty(Mb,"passive",{get:function(){Lb=!0}});window.addEventListener("test",Mb,Mb);window.removeEventListener("test",Mb,Mb)}catch(a){Lb=!1}function Nb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l)}catch(m){this.onError(m)}}var Ob=!1,Pb=null,Qb=!1,Rb=null,Sb={onError:function(a){Ob=!0;Pb=a}};function Tb(a,b,c,d,e,f,g,h,k){Ob=!1;Pb=null;Nb.apply(Sb,arguments)}
function Ub(a,b,c,d,e,f,g,h,k){Tb.apply(this,arguments);if(Ob){if(Ob){var l=Pb;Ob=!1;Pb=null}else throw Error(p(198));Qb||(Qb=!0,Rb=l)}}function Vb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else{a=b;do b=a,0!==(b.flags&4098)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function Wb(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function Xb(a){if(Vb(a)!==a)throw Error(p(188));}
function Yb(a){var b=a.alternate;if(!b){b=Vb(a);if(null===b)throw Error(p(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return Xb(e),a;if(f===d)return Xb(e),b;f=f.sibling}throw Error(p(188));}if(c.return!==d.return)c=e,d=f;else{for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling}if(!g){for(h=f.child;h;){if(h===
c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling}if(!g)throw Error(p(189));}}if(c.alternate!==d)throw Error(p(190));}if(3!==c.tag)throw Error(p(188));return c.stateNode.current===c?a:b}function Zb(a){a=Yb(a);return null!==a?$b(a):null}function $b(a){if(5===a.tag||6===a.tag)return a;for(a=a.child;null!==a;){var b=$b(a);if(null!==b)return b;a=a.sibling}return null}
var ac=ca.unstable_scheduleCallback,bc=ca.unstable_cancelCallback,cc=ca.unstable_shouldYield,dc=ca.unstable_requestPaint,B=ca.unstable_now,ec=ca.unstable_getCurrentPriorityLevel,fc=ca.unstable_ImmediatePriority,gc=ca.unstable_UserBlockingPriority,hc=ca.unstable_NormalPriority,ic=ca.unstable_LowPriority,jc=ca.unstable_IdlePriority,kc=null,lc=null;function mc(a){if(lc&&"function"===typeof lc.onCommitFiberRoot)try{lc.onCommitFiberRoot(kc,a,void 0,128===(a.current.flags&128))}catch(b){}}
var oc=Math.clz32?Math.clz32:nc,pc=Math.log,qc=Math.LN2;function nc(a){a>>>=0;return 0===a?32:31-(pc(a)/qc|0)|0}var rc=64,sc=4194304;
function tc(a){switch(a&-a){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return a&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;
default:return a}}function uc(a,b){var c=a.pendingLanes;if(0===c)return 0;var d=0,e=a.suspendedLanes,f=a.pingedLanes,g=c&268435455;if(0!==g){var h=g&~e;0!==h?d=tc(h):(f&=g,0!==f&&(d=tc(f)))}else g=c&~e,0!==g?d=tc(g):0!==f&&(d=tc(f));if(0===d)return 0;if(0!==b&&b!==d&&0===(b&e)&&(e=d&-d,f=b&-b,e>=f||16===e&&0!==(f&4194240)))return b;0!==(d&4)&&(d|=c&16);b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-oc(b),e=1<<c,d|=a[c],b&=~e;return d}
function vc(a,b){switch(a){case 1:case 2:case 4:return b+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return b+5E3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}
function wc(a,b){for(var c=a.suspendedLanes,d=a.pingedLanes,e=a.expirationTimes,f=a.pendingLanes;0<f;){var g=31-oc(f),h=1<<g,k=e[g];if(-1===k){if(0===(h&c)||0!==(h&d))e[g]=vc(h,b)}else k<=b&&(a.expiredLanes|=h);f&=~h}}function xc(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function yc(){var a=rc;rc<<=1;0===(rc&4194240)&&(rc=64);return a}function zc(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
function Ac(a,b,c){a.pendingLanes|=b;536870912!==b&&(a.suspendedLanes=0,a.pingedLanes=0);a=a.eventTimes;b=31-oc(b);a[b]=c}function Bc(a,b){var c=a.pendingLanes&~b;a.pendingLanes=b;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=b;a.mutableReadLanes&=b;a.entangledLanes&=b;b=a.entanglements;var d=a.eventTimes;for(a=a.expirationTimes;0<c;){var e=31-oc(c),f=1<<e;b[e]=0;d[e]=-1;a[e]=-1;c&=~f}}
function Cc(a,b){var c=a.entangledLanes|=b;for(a=a.entanglements;c;){var d=31-oc(c),e=1<<d;e&b|a[d]&b&&(a[d]|=b);c&=~e}}var C=0;function Dc(a){a&=-a;return 1<a?4<a?0!==(a&268435455)?16:536870912:4:1}var Ec,Fc,Gc,Hc,Ic,Jc=!1,Kc=[],Lc=null,Mc=null,Nc=null,Oc=new Map,Pc=new Map,Qc=[],Rc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a,b){switch(a){case "focusin":case "focusout":Lc=null;break;case "dragenter":case "dragleave":Mc=null;break;case "mouseover":case "mouseout":Nc=null;break;case "pointerover":case "pointerout":Oc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":Pc.delete(b.pointerId)}}
function Tc(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a={blockedOn:b,domEventName:c,eventSystemFlags:d,nativeEvent:f,targetContainers:[e]},null!==b&&(b=Cb(b),null!==b&&Fc(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
function Uc(a,b,c,d,e){switch(b){case "focusin":return Lc=Tc(Lc,a,b,c,d,e),!0;case "dragenter":return Mc=Tc(Mc,a,b,c,d,e),!0;case "mouseover":return Nc=Tc(Nc,a,b,c,d,e),!0;case "pointerover":var f=e.pointerId;Oc.set(f,Tc(Oc.get(f)||null,a,b,c,d,e));return!0;case "gotpointercapture":return f=e.pointerId,Pc.set(f,Tc(Pc.get(f)||null,a,b,c,d,e)),!0}return!1}
function Vc(a){var b=Wc(a.target);if(null!==b){var c=Vb(b);if(null!==c)if(b=c.tag,13===b){if(b=Wb(c),null!==b){a.blockedOn=b;Ic(a.priority,function(){Gc(c)});return}}else if(3===b&&c.stateNode.current.memoizedState.isDehydrated){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null}
function Xc(a){if(null!==a.blockedOn)return!1;for(var b=a.targetContainers;0<b.length;){var c=Yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null===c){c=a.nativeEvent;var d=new c.constructor(c.type,c);wb=d;c.target.dispatchEvent(d);wb=null}else return b=Cb(c),null!==b&&Fc(b),a.blockedOn=c,!1;b.shift()}return!0}function Zc(a,b,c){Xc(a)&&c.delete(b)}function $c(){Jc=!1;null!==Lc&&Xc(Lc)&&(Lc=null);null!==Mc&&Xc(Mc)&&(Mc=null);null!==Nc&&Xc(Nc)&&(Nc=null);Oc.forEach(Zc);Pc.forEach(Zc)}
function ad(a,b){a.blockedOn===b&&(a.blockedOn=null,Jc||(Jc=!0,ca.unstable_scheduleCallback(ca.unstable_NormalPriority,$c)))}
function bd(a){function b(b){return ad(b,a)}if(0<Kc.length){ad(Kc[0],a);for(var c=1;c<Kc.length;c++){var d=Kc[c];d.blockedOn===a&&(d.blockedOn=null)}}null!==Lc&&ad(Lc,a);null!==Mc&&ad(Mc,a);null!==Nc&&ad(Nc,a);Oc.forEach(b);Pc.forEach(b);for(c=0;c<Qc.length;c++)d=Qc[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<Qc.length&&(c=Qc[0],null===c.blockedOn);)Vc(c),null===c.blockedOn&&Qc.shift()}var cd=ua.ReactCurrentBatchConfig,dd=!0;
function ed(a,b,c,d){var e=C,f=cd.transition;cd.transition=null;try{C=1,fd(a,b,c,d)}finally{C=e,cd.transition=f}}function gd(a,b,c,d){var e=C,f=cd.transition;cd.transition=null;try{C=4,fd(a,b,c,d)}finally{C=e,cd.transition=f}}
function fd(a,b,c,d){if(dd){var e=Yc(a,b,c,d);if(null===e)hd(a,b,d,id,c),Sc(a,d);else if(Uc(e,a,b,c,d))d.stopPropagation();else if(Sc(a,d),b&4&&-1<Rc.indexOf(a)){for(;null!==e;){var f=Cb(e);null!==f&&Ec(f);f=Yc(a,b,c,d);null===f&&hd(a,b,d,id,c);if(f===e)break;e=f}null!==e&&d.stopPropagation()}else hd(a,b,d,null,c)}}var id=null;
function Yc(a,b,c,d){id=null;a=xb(d);a=Wc(a);if(null!==a)if(b=Vb(a),null===b)a=null;else if(c=b.tag,13===c){a=Wb(b);if(null!==a)return a;a=null}else if(3===c){if(b.stateNode.current.memoizedState.isDehydrated)return 3===b.tag?b.stateNode.containerInfo:null;a=null}else b!==a&&(a=null);id=a;return null}
function jd(a){switch(a){case "cancel":case "click":case "close":case "contextmenu":case "copy":case "cut":case "auxclick":case "dblclick":case "dragend":case "dragstart":case "drop":case "focusin":case "focusout":case "input":case "invalid":case "keydown":case "keypress":case "keyup":case "mousedown":case "mouseup":case "paste":case "pause":case "play":case "pointercancel":case "pointerdown":case "pointerup":case "ratechange":case "reset":case "resize":case "seeked":case "submit":case "touchcancel":case "touchend":case "touchstart":case "volumechange":case "change":case "selectionchange":case "textInput":case "compositionstart":case "compositionend":case "compositionupdate":case "beforeblur":case "afterblur":case "beforeinput":case "blur":case "fullscreenchange":case "focus":case "hashchange":case "popstate":case "select":case "selectstart":return 1;case "drag":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "mousemove":case "mouseout":case "mouseover":case "pointermove":case "pointerout":case "pointerover":case "scroll":case "toggle":case "touchmove":case "wheel":case "mouseenter":case "mouseleave":case "pointerenter":case "pointerleave":return 4;
case "message":switch(ec()){case fc:return 1;case gc:return 4;case hc:case ic:return 16;case jc:return 536870912;default:return 16}default:return 16}}var kd=null,ld=null,md=null;function nd(){if(md)return md;var a,b=ld,c=b.length,d,e="value"in kd?kd.value:kd.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md=e.slice(a,1<d?1-d:void 0)}
function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd(){return!0}function qd(){return!1}
function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:!1===f.returnValue)?pd:qd;this.isPropagationStopped=qd;return this}A(b.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
(a.returnValue=!1),this.isDefaultPrevented=pd)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=pd)},persist:function(){},isPersistent:pd});return b}
var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td=rd(sd),ud=A({},sd,{view:0,detail:0}),vd=rd(ud),wd,xd,yd,Ad=A({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
a)return a.movementX;a!==yd&&(yd&&"mousemove"===a.type?(wd=a.screenX-yd.screenX,xd=a.screenY-yd.screenY):xd=wd=0,yd=a);return wd},movementY:function(a){return"movementY"in a?a.movementY:xd}}),Bd=rd(Ad),Cd=A({},Ad,{dataTransfer:0}),Dd=rd(Cd),Ed=A({},ud,{relatedTarget:0}),Fd=rd(Ed),Gd=A({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd),Id=A({},sd,{clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd=rd(Id),Kd=A({},sd,{data:0}),Ld=rd(Kd),Md={Esc:"Escape",
Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od[a])?!!b[a]:!1}function zd(){return Pd}
var Qd=A({},ud,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return"keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return"keypress"===a.type?od(a):0},keyCode:function(a){return"keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return"keypress"===
a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd),Sd=A({},Ad,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=rd(Sd),Ud=A({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud),Wd=A({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd),Yd=A({},Ad,{deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae=ia&&"CompositionEvent"in window,be=null;ia&&"documentMode"in document&&(be=document.documentMode);var ce=ia&&"TextEvent"in window&&!be,de=ia&&(!ae||be&&8<be&&11>=be),ee=String.fromCharCode(32),fe=!1;
function ge(a,b){switch(a){case "keyup":return-1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return!0;default:return!1}}function he(a){a=a.detail;return"object"===typeof a&&"data"in a?a.data:null}var ie=!1;function je(a,b){switch(a){case "compositionend":return he(b);case "keypress":if(32!==b.which)return null;fe=!0;return ee;case "textInput":return a=b.data,a===ee&&fe?null:a;default:return null}}
function ke(a,b){if(ie)return"compositionend"===a||!ae&&ge(a,b)?(a=nd(),md=ld=kd=null,ie=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de&&"ko"!==b.locale?null:b.data;default:return null}}
var le={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function me(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return"input"===b?!!le[a.type]:"textarea"===b?!0:!1}function ne(a,b,c,d){Eb(d);b=oe(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}))}var pe=null,qe=null;function re(a){se(a,0)}function te(a){var b=ue(a);if(Wa(b))return a}
function ve(a,b){if("change"===a)return b}var we=!1;if(ia){var xe;if(ia){var ye="oninput"in document;if(!ye){var ze=document.createElement("div");ze.setAttribute("oninput","return;");ye="function"===typeof ze.oninput}xe=ye}else xe=!1;we=xe&&(!document.documentMode||9<document.documentMode)}function Ae(){pe&&(pe.detachEvent("onpropertychange",Be),qe=pe=null)}function Be(a){if("value"===a.propertyName&&te(qe)){var b=[];ne(b,qe,a,xb(a));Jb(re,b)}}
function Ce(a,b,c){"focusin"===a?(Ae(),pe=b,qe=c,pe.attachEvent("onpropertychange",Be)):"focusout"===a&&Ae()}function De(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te(qe)}function Ee(a,b){if("click"===a)return te(b)}function Fe(a,b){if("input"===a||"change"===a)return te(b)}function Ge(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He="function"===typeof Object.is?Object.is:Ge;
function Ie(a,b){if(He(a,b))return!0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return!1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return!1;for(d=0;d<c.length;d++){var e=c[d];if(!ja.call(b,e)||!He(a[e],b[e]))return!1}return!0}function Je(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
function Ke(a,b){var c=Je(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return{node:c,offset:b-a};a=d}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode}c=void 0}c=Je(c)}}function Le(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Le(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
function Me(){for(var a=window,b=Xa();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href}catch(d){c=!1}if(c)a=b.contentWindow;else break;b=Xa(a.document)}return b}function Ne(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
function Oe(a){var b=Me(),c=a.focusedElem,d=a.selectionRange;if(b!==c&&c&&c.ownerDocument&&Le(c.ownerDocument.documentElement,c)){if(null!==d&&Ne(c))if(b=d.start,a=d.end,void 0===a&&(a=b),"selectionStart"in c)c.selectionStart=b,c.selectionEnd=Math.min(a,c.value.length);else if(a=(b=c.ownerDocument||document)&&b.defaultView||window,a.getSelection){a=a.getSelection();var e=c.textContent.length,f=Math.min(d.start,e);d=void 0===d.end?f:Math.min(d.end,e);!a.extend&&f>d&&(e=d,d=f,f=e);e=Ke(c,f);var g=Ke(c,
d);e&&g&&(1!==a.rangeCount||a.anchorNode!==e.node||a.anchorOffset!==e.offset||a.focusNode!==g.node||a.focusOffset!==g.offset)&&(b=b.createRange(),b.setStart(e.node,e.offset),a.removeAllRanges(),f>d?(a.addRange(b),a.extend(g.node,g.offset)):(b.setEnd(g.node,g.offset),a.addRange(b)))}b=[];for(a=c;a=a.parentNode;)1===a.nodeType&&b.push({element:a,left:a.scrollLeft,top:a.scrollTop});"function"===typeof c.focus&&c.focus();for(c=0;c<b.length;c++)a=b[c],a.element.scrollLeft=a.left,a.element.scrollTop=a.top}}
var Pe=ia&&"documentMode"in document&&11>=document.documentMode,Qe=null,Re=null,Se=null,Te=!1;
function Ue(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te||null==Qe||Qe!==Xa(d)||(d=Qe,"selectionStart"in d&&Ne(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se&&Ie(Se,d)||(Se=d,d=oe(Re,"onSelect"),0<d.length&&(b=new td("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe)))}
function Ve(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var We={animationend:Ve("Animation","AnimationEnd"),animationiteration:Ve("Animation","AnimationIteration"),animationstart:Ve("Animation","AnimationStart"),transitionend:Ve("Transition","TransitionEnd")},Xe={},Ye={};
ia&&(Ye=document.createElement("div").style,"AnimationEvent"in window||(delete We.animationend.animation,delete We.animationiteration.animation,delete We.animationstart.animation),"TransitionEvent"in window||delete We.transitionend.transition);function Ze(a){if(Xe[a])return Xe[a];if(!We[a])return a;var b=We[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Ye)return Xe[a]=b[c];return a}var $e=Ze("animationend"),af=Ze("animationiteration"),bf=Ze("animationstart"),cf=Ze("transitionend"),df=new Map,ef="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a,b){df.set(a,b);fa(b,[a])}for(var gf=0;gf<ef.length;gf++){var hf=ef[gf],jf=hf.toLowerCase(),kf=hf[0].toUpperCase()+hf.slice(1);ff(jf,"on"+kf)}ff($e,"onAnimationEnd");ff(af,"onAnimationIteration");ff(bf,"onAnimationStart");ff("dblclick","onDoubleClick");ff("focusin","onFocus");ff("focusout","onBlur");ff(cf,"onTransitionEnd");ha("onMouseEnter",["mouseout","mouseover"]);ha("onMouseLeave",["mouseout","mouseover"]);ha("onPointerEnter",["pointerout","pointerover"]);
ha("onPointerLeave",["pointerout","pointerover"]);fa("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));fa("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));fa("onBeforeInput",["compositionend","keypress","textInput","paste"]);fa("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));fa("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var lf="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),mf=new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Ub(d,b,void 0,a);a.currentTarget=null}
function se(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k}}}if(Qb)throw a=Rb,Qb=!1,Rb=null,a;}
function D(a,b){var c=b[of];void 0===c&&(c=b[of]=new Set);var d=a+"__bubble";c.has(d)||(pf(b,a,2,!1),c.add(d))}function qf(a,b,c){var d=0;b&&(d|=4);pf(c,a,d,b)}var rf="_reactListening"+Math.random().toString(36).slice(2);function sf(a){if(!a[rf]){a[rf]=!0;da.forEach(function(b){"selectionchange"!==b&&(mf.has(b)||qf(b,!1,a),qf(b,!0,a))});var b=9===a.nodeType?a:a.ownerDocument;null===b||b[rf]||(b[rf]=!0,qf("selectionchange",!1,b))}}
function pf(a,b,c,d){switch(jd(b)){case 1:var e=ed;break;case 4:e=gd;break;default:e=fd}c=e.bind(null,b,c,a);e=void 0;!Lb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=!0);d?void 0!==e?a.addEventListener(b,c,{capture:!0,passive:e}):a.addEventListener(b,c,!0):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,!1)}
function hd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return}for(;null!==h;){g=Wc(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode}}d=d.return}Jb(function(){var d=f,e=xb(c),g=[];
a:{var h=df.get(a);if(void 0!==h){var k=td,n=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":n="focus";k=Fd;break;case "focusout":n="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case $e:case af:case bf:k=Hd;break;case cf:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td}var t=0!==(b&4),J=!t&&"scroll"===a,x=t?null!==h?h+"Capture":null:h;t=[];for(var w=d,u;null!==
w;){u=w;var F=u.stateNode;5===u.tag&&null!==F&&(u=F,null!==x&&(F=Kb(w,x),null!=F&&t.push(tf(w,F,u))));if(J)break;w=w.return}0<t.length&&(h=new k(h,n,null,c,e),g.push({event:h,listeners:t}))}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&c!==wb&&(n=c.relatedTarget||c.fromElement)&&(Wc(n)||n[uf]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(n=c.relatedTarget||c.toElement,k=d,n=n?Wc(n):null,null!==
n&&(J=Vb(n),n!==J||5!==n.tag&&6!==n.tag))n=null}else k=null,n=d;if(k!==n){t=Bd;F="onMouseLeave";x="onMouseEnter";w="mouse";if("pointerout"===a||"pointerover"===a)t=Td,F="onPointerLeave",x="onPointerEnter",w="pointer";J=null==k?h:ue(k);u=null==n?h:ue(n);h=new t(F,w+"leave",k,c,e);h.target=J;h.relatedTarget=u;F=null;Wc(e)===d&&(t=new t(x,w+"enter",n,c,e),t.target=u,t.relatedTarget=J,F=t);J=F;if(k&&n)b:{t=k;x=n;w=0;for(u=t;u;u=vf(u))w++;u=0;for(F=x;F;F=vf(F))u++;for(;0<w-u;)t=vf(t),w--;for(;0<u-w;)x=
vf(x),u--;for(;w--;){if(t===x||null!==x&&t===x.alternate)break b;t=vf(t);x=vf(x)}t=null}else t=null;null!==k&&wf(g,h,k,t,!1);null!==n&&null!==J&&wf(g,J,n,t,!0)}}}a:{h=d?ue(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var na=ve;else if(me(h))if(we)na=Fe;else{na=De;var xa=Ce}else(k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(na=Ee);if(na&&(na=na(a,d))){ne(g,na,c,e);break a}xa&&xa(a,h,d);"focusout"===a&&(xa=h._wrapperState)&&
xa.controlled&&"number"===h.type&&cb(h,"number",h.value)}xa=d?ue(d):window;switch(a){case "focusin":if(me(xa)||"true"===xa.contentEditable)Qe=xa,Re=d,Se=null;break;case "focusout":Se=Re=Qe=null;break;case "mousedown":Te=!0;break;case "contextmenu":case "mouseup":case "dragend":Te=!1;Ue(g,c,e);break;case "selectionchange":if(Pe)break;case "keydown":case "keyup":Ue(g,c,e)}var $a;if(ae)b:{switch(a){case "compositionstart":var ba="onCompositionStart";break b;case "compositionend":ba="onCompositionEnd";
break b;case "compositionupdate":ba="onCompositionUpdate";break b}ba=void 0}else ie?ge(a,c)&&(ba="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(ba="onCompositionStart");ba&&(de&&"ko"!==c.locale&&(ie||"onCompositionStart"!==ba?"onCompositionEnd"===ba&&ie&&($a=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie=!0)),xa=oe(d,ba),0<xa.length&&(ba=new Ld(ba,a,null,c,e),g.push({event:ba,listeners:xa}),$a?ba.data=$a:($a=he(c),null!==$a&&(ba.data=$a))));if($a=ce?je(a,c):ke(a,c))d=oe(d,"onBeforeInput"),
0<d.length&&(e=new Ld("onBeforeInput","beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=$a)}se(g,b)})}function tf(a,b,c){return{instance:a,listener:b,currentTarget:c}}function oe(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Kb(a,c),null!=f&&d.unshift(tf(a,f,e)),f=Kb(a,b),null!=f&&d.push(tf(a,f,e)));a=a.return}return d}function vf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
function wf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Kb(c,f),null!=k&&g.unshift(tf(c,k,h))):e||(k=Kb(c,f),null!=k&&g.push(tf(c,k,h))));c=c.return}0!==g.length&&a.push({event:b,listeners:g})}var xf=/\r\n?/g,yf=/\u0000|\uFFFD/g;function zf(a){return("string"===typeof a?a:""+a).replace(xf,"\n").replace(yf,"")}function Af(a,b,c){b=zf(b);if(zf(a)!==b&&c)throw Error(p(425));}function Bf(){}
var Cf=null,Df=null;function Ef(a,b){return"textarea"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}
var Ff="function"===typeof setTimeout?setTimeout:void 0,Gf="function"===typeof clearTimeout?clearTimeout:void 0,Hf="function"===typeof Promise?Promise:void 0,Jf="function"===typeof queueMicrotask?queueMicrotask:"undefined"!==typeof Hf?function(a){return Hf.resolve(null).then(a).catch(If)}:Ff;function If(a){setTimeout(function(){throw a;})}
function Kf(a,b){var c=b,d=0;do{var e=c.nextSibling;a.removeChild(c);if(e&&8===e.nodeType)if(c=e.data,"/$"===c){if(0===d){a.removeChild(e);bd(b);return}d--}else"$"!==c&&"$?"!==c&&"$!"!==c||d++;c=e}while(c);bd(b)}function Lf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break;if(8===b){b=a.data;if("$"===b||"$!"===b||"$?"===b)break;if("/$"===b)return null}}return a}
function Mf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--}else"/$"===c&&b++}a=a.previousSibling}return null}var Nf=Math.random().toString(36).slice(2),Of="__reactFiber$"+Nf,Pf="__reactProps$"+Nf,uf="__reactContainer$"+Nf,of="__reactEvents$"+Nf,Qf="__reactListeners$"+Nf,Rf="__reactHandles$"+Nf;
function Wc(a){var b=a[Of];if(b)return b;for(var c=a.parentNode;c;){if(b=c[uf]||c[Of]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=Mf(a);null!==a;){if(c=a[Of])return c;a=Mf(a)}return b}a=c;c=a.parentNode}return null}function Cb(a){a=a[Of]||a[uf];return!a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(p(33));}function Db(a){return a[Pf]||null}var Sf=[],Tf=-1;function Uf(a){return{current:a}}
function E(a){0>Tf||(a.current=Sf[Tf],Sf[Tf]=null,Tf--)}function G(a,b){Tf++;Sf[Tf]=a.current;a.current=b}var Vf={},H=Uf(Vf),Wf=Uf(!1),Xf=Vf;function Yf(a,b){var c=a.type.contextTypes;if(!c)return Vf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}
function Zf(a){a=a.childContextTypes;return null!==a&&void 0!==a}function $f(){E(Wf);E(H)}function ag(a,b,c){if(H.current!==Vf)throw Error(p(168));G(H,b);G(Wf,c)}function bg(a,b,c){var d=a.stateNode;b=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in b))throw Error(p(108,Ra(a)||"Unknown",e));return A({},c,d)}
function cg(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Vf;Xf=H.current;G(H,a);G(Wf,Wf.current);return!0}function dg(a,b,c){var d=a.stateNode;if(!d)throw Error(p(169));c?(a=bg(a,b,Xf),d.__reactInternalMemoizedMergedChildContext=a,E(Wf),E(H),G(H,a)):E(Wf);G(Wf,c)}var eg=null,fg=!1,gg=!1;function hg(a){null===eg?eg=[a]:eg.push(a)}function ig(a){fg=!0;hg(a)}
function jg(){if(!gg&&null!==eg){gg=!0;var a=0,b=C;try{var c=eg;for(C=1;a<c.length;a++){var d=c[a];do d=d(!0);while(null!==d)}eg=null;fg=!1}catch(e){throw null!==eg&&(eg=eg.slice(a+1)),ac(fc,jg),e;}finally{C=b,gg=!1}}return null}var kg=[],lg=0,mg=null,ng=0,og=[],pg=0,qg=null,rg=1,sg="";function tg(a,b){kg[lg++]=ng;kg[lg++]=mg;mg=a;ng=b}
function ug(a,b,c){og[pg++]=rg;og[pg++]=sg;og[pg++]=qg;qg=a;var d=rg;a=sg;var e=32-oc(d)-1;d&=~(1<<e);c+=1;var f=32-oc(b)+e;if(30<f){var g=e-e%5;f=(d&(1<<g)-1).toString(32);d>>=g;e-=g;rg=1<<32-oc(b)+e|c<<e|d;sg=f+a}else rg=1<<f|c<<e|d,sg=a}function vg(a){null!==a.return&&(tg(a,1),ug(a,1,0))}function wg(a){for(;a===mg;)mg=kg[--lg],kg[lg]=null,ng=kg[--lg],kg[lg]=null;for(;a===qg;)qg=og[--pg],og[pg]=null,sg=og[--pg],og[pg]=null,rg=og[--pg],og[pg]=null}var xg=null,yg=null,I=!1,zg=null;
function Ag(a,b){var c=Bg(5,null,null,0);c.elementType="DELETED";c.stateNode=b;c.return=a;b=a.deletions;null===b?(a.deletions=[c],a.flags|=16):b.push(c)}
function Cg(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,xg=a,yg=Lf(b.firstChild),!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,xg=a,yg=null,!0):!1;case 13:return b=8!==b.nodeType?null:b,null!==b?(c=null!==qg?{id:rg,overflow:sg}:null,a.memoizedState={dehydrated:b,treeContext:c,retryLane:1073741824},c=Bg(18,null,null,0),c.stateNode=b,c.return=a,a.child=c,xg=a,yg=
null,!0):!1;default:return!1}}function Dg(a){return 0!==(a.mode&1)&&0===(a.flags&128)}function Eg(a){if(I){var b=yg;if(b){var c=b;if(!Cg(a,b)){if(Dg(a))throw Error(p(418));b=Lf(c.nextSibling);var d=xg;b&&Cg(a,b)?Ag(d,c):(a.flags=a.flags&-4097|2,I=!1,xg=a)}}else{if(Dg(a))throw Error(p(418));a.flags=a.flags&-4097|2;I=!1;xg=a}}}function Fg(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;xg=a}
function Gg(a){if(a!==xg)return!1;if(!I)return Fg(a),I=!0,!1;var b;(b=3!==a.tag)&&!(b=5!==a.tag)&&(b=a.type,b="head"!==b&&"body"!==b&&!Ef(a.type,a.memoizedProps));if(b&&(b=yg)){if(Dg(a))throw Hg(),Error(p(418));for(;b;)Ag(a,b),b=Lf(b.nextSibling)}Fg(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(p(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){yg=Lf(a.nextSibling);break a}b--}else"$"!==c&&"$!"!==c&&"$?"!==c||b++}a=a.nextSibling}yg=
null}}else yg=xg?Lf(a.stateNode.nextSibling):null;return!0}function Hg(){for(var a=yg;a;)a=Lf(a.nextSibling)}function Ig(){yg=xg=null;I=!1}function Jg(a){null===zg?zg=[a]:zg.push(a)}var Kg=ua.ReactCurrentBatchConfig;
function Lg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(p(309));var d=c.stateNode}if(!d)throw Error(p(147,a));var e=d,f=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===f)return b.ref;b=function(a){var b=e.refs;null===a?delete b[f]:b[f]=a};b._stringRef=f;return b}if("string"!==typeof a)throw Error(p(284));if(!c._owner)throw Error(p(290,a));}return a}
function Mg(a,b){a=Object.prototype.toString.call(b);throw Error(p(31,"[object Object]"===a?"object with keys {"+Object.keys(b).join(", ")+"}":a));}function Ng(a){var b=a._init;return b(a._payload)}
function Og(a){function b(b,c){if(a){var d=b.deletions;null===d?(b.deletions=[c],b.flags|=16):d.push(c)}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Pg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return b.flags|=1048576,c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags|=2,c):d;b.flags|=2;return c}function g(b){a&&
null===b.alternate&&(b.flags|=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Qg(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){var f=c.type;if(f===ya)return m(a,b,c.props.children,d,c.key);if(null!==b&&(b.elementType===f||"object"===typeof f&&null!==f&&f.$$typeof===Ha&&Ng(f)===b.type))return d=e(b,c.props),d.ref=Lg(a,b,c),d.return=a,d;d=Rg(c.type,c.key,c.props,null,a.mode,d);d.ref=Lg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||
b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=Sg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function m(a,b,c,d,f){if(null===b||7!==b.tag)return b=Tg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function q(a,b,c){if("string"===typeof b&&""!==b||"number"===typeof b)return b=Qg(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case va:return c=Rg(b.type,b.key,b.props,null,a.mode,c),
c.ref=Lg(a,null,b),c.return=a,c;case wa:return b=Sg(b,a.mode,c),b.return=a,b;case Ha:var d=b._init;return q(a,d(b._payload),c)}if(eb(b)||Ka(b))return b=Tg(b,a.mode,c,null),b.return=a,b;Mg(a,b)}return null}function r(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c&&""!==c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case va:return c.key===e?k(a,b,c,d):null;case wa:return c.key===e?l(a,b,c,d):null;case Ha:return e=c._init,r(a,
b,e(c._payload),d)}if(eb(c)||Ka(c))return null!==e?null:m(a,b,c,d,null);Mg(a,c)}return null}function y(a,b,c,d,e){if("string"===typeof d&&""!==d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case va:return a=a.get(null===d.key?c:d.key)||null,k(b,a,d,e);case wa:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e);case Ha:var f=d._init;return y(a,b,c,f(d._payload),e)}if(eb(d)||Ka(d))return a=a.get(c)||null,m(b,a,d,e,null);Mg(b,d)}return null}
function n(e,g,h,k){for(var l=null,m=null,u=g,w=g=0,x=null;null!==u&&w<h.length;w++){u.index>w?(x=u,u=null):x=u.sibling;var n=r(e,u,h[w],k);if(null===n){null===u&&(u=x);break}a&&u&&null===n.alternate&&b(e,u);g=f(n,g,w);null===m?l=n:m.sibling=n;m=n;u=x}if(w===h.length)return c(e,u),I&&tg(e,w),l;if(null===u){for(;w<h.length;w++)u=q(e,h[w],k),null!==u&&(g=f(u,g,w),null===m?l=u:m.sibling=u,m=u);I&&tg(e,w);return l}for(u=d(e,u);w<h.length;w++)x=y(u,e,w,h[w],k),null!==x&&(a&&null!==x.alternate&&u.delete(null===
x.key?w:x.key),g=f(x,g,w),null===m?l=x:m.sibling=x,m=x);a&&u.forEach(function(a){return b(e,a)});I&&tg(e,w);return l}function t(e,g,h,k){var l=Ka(h);if("function"!==typeof l)throw Error(p(150));h=l.call(h);if(null==h)throw Error(p(151));for(var u=l=null,m=g,w=g=0,x=null,n=h.next();null!==m&&!n.done;w++,n=h.next()){m.index>w?(x=m,m=null):x=m.sibling;var t=r(e,m,n.value,k);if(null===t){null===m&&(m=x);break}a&&m&&null===t.alternate&&b(e,m);g=f(t,g,w);null===u?l=t:u.sibling=t;u=t;m=x}if(n.done)return c(e,
m),I&&tg(e,w),l;if(null===m){for(;!n.done;w++,n=h.next())n=q(e,n.value,k),null!==n&&(g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);I&&tg(e,w);return l}for(m=d(e,m);!n.done;w++,n=h.next())n=y(m,e,w,n.value,k),null!==n&&(a&&null!==n.alternate&&m.delete(null===n.key?w:n.key),g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);a&&m.forEach(function(a){return b(e,a)});I&&tg(e,w);return l}function J(a,d,f,h){"object"===typeof f&&null!==f&&f.type===ya&&null===f.key&&(f=f.props.children);if("object"===typeof f&&null!==f){switch(f.$$typeof){case va:a:{for(var k=
f.key,l=d;null!==l;){if(l.key===k){k=f.type;if(k===ya){if(7===l.tag){c(a,l.sibling);d=e(l,f.props.children);d.return=a;a=d;break a}}else if(l.elementType===k||"object"===typeof k&&null!==k&&k.$$typeof===Ha&&Ng(k)===l.type){c(a,l.sibling);d=e(l,f.props);d.ref=Lg(a,l,f);d.return=a;a=d;break a}c(a,l);break}else b(a,l);l=l.sibling}f.type===ya?(d=Tg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Rg(f.type,f.key,f.props,null,a.mode,h),h.ref=Lg(a,d,f),h.return=a,a=h)}return g(a);case wa:a:{for(l=f.key;null!==
d;){if(d.key===l)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else{c(a,d);break}else b(a,d);d=d.sibling}d=Sg(f,a.mode,h);d.return=a;a=d}return g(a);case Ha:return l=f._init,J(a,d,l(f._payload),h)}if(eb(f))return n(a,d,f,h);if(Ka(f))return t(a,d,f,h);Mg(a,f)}return"string"===typeof f&&""!==f||"number"===typeof f?(f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):
(c(a,d),d=Qg(f,a.mode,h),d.return=a,a=d),g(a)):c(a,d)}return J}var Ug=Og(!0),Vg=Og(!1),Wg=Uf(null),Xg=null,Yg=null,Zg=null;function $g(){Zg=Yg=Xg=null}function ah(a){var b=Wg.current;E(Wg);a._currentValue=b}function bh(a,b,c){for(;null!==a;){var d=a.alternate;(a.childLanes&b)!==b?(a.childLanes|=b,null!==d&&(d.childLanes|=b)):null!==d&&(d.childLanes&b)!==b&&(d.childLanes|=b);if(a===c)break;a=a.return}}
function ch(a,b){Xg=a;Zg=Yg=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(dh=!0),a.firstContext=null)}function eh(a){var b=a._currentValue;if(Zg!==a)if(a={context:a,memoizedValue:b,next:null},null===Yg){if(null===Xg)throw Error(p(308));Yg=a;Xg.dependencies={lanes:0,firstContext:a}}else Yg=Yg.next=a;return b}var fh=null;function gh(a){null===fh?fh=[a]:fh.push(a)}
function hh(a,b,c,d){var e=b.interleaved;null===e?(c.next=c,gh(b)):(c.next=e.next,e.next=c);b.interleaved=c;return ih(a,d)}function ih(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}var jh=!1;function kh(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}
function lh(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects})}function mh(a,b){return{eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}
function nh(a,b,c){var d=a.updateQueue;if(null===d)return null;d=d.shared;if(0!==(K&2)){var e=d.pending;null===e?b.next=b:(b.next=e.next,e.next=b);d.pending=b;return ih(a,c)}e=d.interleaved;null===e?(b.next=b,gh(d)):(b.next=e.next,e.next=b);d.interleaved=b;return ih(a,c)}function oh(a,b,c){b=b.updateQueue;if(null!==b&&(b=b.shared,0!==(c&4194240))){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c)}}
function ph(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next}while(null!==c);null===f?e=f=b:f=f.next=b}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
b;c.lastBaseUpdate=b}
function qh(a,b,c,d){var e=a.updateQueue;jh=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var m=a.alternate;null!==m&&(m=m.updateQueue,h=m.lastBaseUpdate,h!==g&&(null===h?m.firstBaseUpdate=l:h.next=l,m.lastBaseUpdate=k))}if(null!==f){var q=e.baseState;g=0;m=l=k=null;h=f;do{var r=h.lane,y=h.eventTime;if((d&r)===r){null!==m&&(m=m.next={eventTime:y,lane:0,tag:h.tag,payload:h.payload,callback:h.callback,
next:null});a:{var n=a,t=h;r=b;y=c;switch(t.tag){case 1:n=t.payload;if("function"===typeof n){q=n.call(y,q,r);break a}q=n;break a;case 3:n.flags=n.flags&-65537|128;case 0:n=t.payload;r="function"===typeof n?n.call(y,q,r):n;if(null===r||void 0===r)break a;q=A({},q,r);break a;case 2:jh=!0}}null!==h.callback&&0!==h.lane&&(a.flags|=64,r=e.effects,null===r?e.effects=[h]:r.push(h))}else y={eventTime:y,lane:r,tag:h.tag,payload:h.payload,callback:h.callback,next:null},null===m?(l=m=y,k=q):m=m.next=y,g|=r;
h=h.next;if(null===h)if(h=e.shared.pending,null===h)break;else r=h,h=r.next,r.next=null,e.lastBaseUpdate=r,e.shared.pending=null}while(1);null===m&&(k=q);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=m;b=e.shared.interleaved;if(null!==b){e=b;do g|=e.lane,e=e.next;while(e!==b)}else null===f&&(e.shared.lanes=0);rh|=g;a.lanes=g;a.memoizedState=q}}
function sh(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(p(191,e));e.call(d)}}}var th={},uh=Uf(th),vh=Uf(th),wh=Uf(th);function xh(a){if(a===th)throw Error(p(174));return a}
function yh(a,b){G(wh,b);G(vh,a);G(uh,th);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:lb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=lb(b,a)}E(uh);G(uh,b)}function zh(){E(uh);E(vh);E(wh)}function Ah(a){xh(wh.current);var b=xh(uh.current);var c=lb(b,a.type);b!==c&&(G(vh,a),G(uh,c))}function Bh(a){vh.current===a&&(E(uh),E(vh))}var L=Uf(0);
function Ch(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&128))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}return null}var Dh=[];
function Eh(){for(var a=0;a<Dh.length;a++)Dh[a]._workInProgressVersionPrimary=null;Dh.length=0}var Fh=ua.ReactCurrentDispatcher,Gh=ua.ReactCurrentBatchConfig,Hh=0,M=null,N=null,O=null,Ih=!1,Jh=!1,Kh=0,Lh=0;function P(){throw Error(p(321));}function Mh(a,b){if(null===b)return!1;for(var c=0;c<b.length&&c<a.length;c++)if(!He(a[c],b[c]))return!1;return!0}
function Nh(a,b,c,d,e,f){Hh=f;M=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;Fh.current=null===a||null===a.memoizedState?Oh:Ph;a=c(d,e);if(Jh){f=0;do{Jh=!1;Kh=0;if(25<=f)throw Error(p(301));f+=1;O=N=null;b.updateQueue=null;Fh.current=Qh;a=c(d,e)}while(Jh)}Fh.current=Rh;b=null!==N&&null!==N.next;Hh=0;O=N=M=null;Ih=!1;if(b)throw Error(p(300));return a}function Sh(){var a=0!==Kh;Kh=0;return a}
function Th(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===O?M.memoizedState=O=a:O=O.next=a;return O}function Uh(){if(null===N){var a=M.alternate;a=null!==a?a.memoizedState:null}else a=N.next;var b=null===O?M.memoizedState:O.next;if(null!==b)O=b,N=a;else{if(null===a)throw Error(p(310));N=a;a={memoizedState:N.memoizedState,baseState:N.baseState,baseQueue:N.baseQueue,queue:N.queue,next:null};null===O?M.memoizedState=O=a:O=O.next=a}return O}
function Vh(a,b){return"function"===typeof b?b(a):b}
function Wh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p(311));c.lastRenderedReducer=a;var d=N,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g}d.baseQueue=e=f;c.pending=null}if(null!==e){f=e.next;d=d.baseState;var h=g=null,k=null,l=f;do{var m=l.lane;if((Hh&m)===m)null!==k&&(k=k.next={lane:0,action:l.action,hasEagerState:l.hasEagerState,eagerState:l.eagerState,next:null}),d=l.hasEagerState?l.eagerState:a(d,l.action);else{var q={lane:m,action:l.action,hasEagerState:l.hasEagerState,
eagerState:l.eagerState,next:null};null===k?(h=k=q,g=d):k=k.next=q;M.lanes|=m;rh|=m}l=l.next}while(null!==l&&l!==f);null===k?g=d:k.next=h;He(d,b.memoizedState)||(dh=!0);b.memoizedState=d;b.baseState=g;b.baseQueue=k;c.lastRenderedState=d}a=c.interleaved;if(null!==a){e=a;do f=e.lane,M.lanes|=f,rh|=f,e=e.next;while(e!==a)}else null===e&&(c.lanes=0);return[b.memoizedState,c.dispatch]}
function Xh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He(f,b.memoizedState)||(dh=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f}return[f,d]}function Yh(){}
function Zh(a,b){var c=M,d=Uh(),e=b(),f=!He(d.memoizedState,e);f&&(d.memoizedState=e,dh=!0);d=d.queue;$h(ai.bind(null,c,d,a),[a]);if(d.getSnapshot!==b||f||null!==O&&O.memoizedState.tag&1){c.flags|=2048;bi(9,ci.bind(null,c,d,e,b),void 0,null);if(null===Q)throw Error(p(349));0!==(Hh&30)||di(c,b,e)}return e}function di(a,b,c){a.flags|=16384;a={getSnapshot:b,value:c};b=M.updateQueue;null===b?(b={lastEffect:null,stores:null},M.updateQueue=b,b.stores=[a]):(c=b.stores,null===c?b.stores=[a]:c.push(a))}
function ci(a,b,c,d){b.value=c;b.getSnapshot=d;ei(b)&&fi(a)}function ai(a,b,c){return c(function(){ei(b)&&fi(a)})}function ei(a){var b=a.getSnapshot;a=a.value;try{var c=b();return!He(a,c)}catch(d){return!0}}function fi(a){var b=ih(a,1);null!==b&&gi(b,a,1,-1)}
function hi(a){var b=Th();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Vh,lastRenderedState:a};b.queue=a;a=a.dispatch=ii.bind(null,M,a);return[b.memoizedState,a]}
function bi(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=M.updateQueue;null===b?(b={lastEffect:null,stores:null},M.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function ji(){return Uh().memoizedState}function ki(a,b,c,d){var e=Th();M.flags|=a;e.memoizedState=bi(1|b,c,void 0,void 0===d?null:d)}
function li(a,b,c,d){var e=Uh();d=void 0===d?null:d;var f=void 0;if(null!==N){var g=N.memoizedState;f=g.destroy;if(null!==d&&Mh(d,g.deps)){e.memoizedState=bi(b,c,f,d);return}}M.flags|=a;e.memoizedState=bi(1|b,c,f,d)}function mi(a,b){return ki(8390656,8,a,b)}function $h(a,b){return li(2048,8,a,b)}function ni(a,b){return li(4,2,a,b)}function oi(a,b){return li(4,4,a,b)}
function pi(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null)};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null}}function qi(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return li(4,4,pi.bind(null,b,a),c)}function ri(){}function si(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}
function ti(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}function ui(a,b,c){if(0===(Hh&21))return a.baseState&&(a.baseState=!1,dh=!0),a.memoizedState=c;He(c,b)||(c=yc(),M.lanes|=c,rh|=c,a.baseState=!0);return b}function vi(a,b){var c=C;C=0!==c&&4>c?c:4;a(!0);var d=Gh.transition;Gh.transition={};try{a(!1),b()}finally{C=c,Gh.transition=d}}function wi(){return Uh().memoizedState}
function xi(a,b,c){var d=yi(a);c={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(zi(a))Ai(b,c);else if(c=hh(a,b,c,d),null!==c){var e=R();gi(c,a,d,e);Bi(c,b,d)}}
function ii(a,b,c){var d=yi(a),e={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(zi(a))Ai(b,e);else{var f=a.alternate;if(0===a.lanes&&(null===f||0===f.lanes)&&(f=b.lastRenderedReducer,null!==f))try{var g=b.lastRenderedState,h=f(g,c);e.hasEagerState=!0;e.eagerState=h;if(He(h,g)){var k=b.interleaved;null===k?(e.next=e,gh(b)):(e.next=k.next,k.next=e);b.interleaved=e;return}}catch(l){}finally{}c=hh(a,b,e,d);null!==c&&(e=R(),gi(c,a,d,e),Bi(c,b,d))}}
function zi(a){var b=a.alternate;return a===M||null!==b&&b===M}function Ai(a,b){Jh=Ih=!0;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b}function Bi(a,b,c){if(0!==(c&4194240)){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c)}}
var Rh={readContext:eh,useCallback:P,useContext:P,useEffect:P,useImperativeHandle:P,useInsertionEffect:P,useLayoutEffect:P,useMemo:P,useReducer:P,useRef:P,useState:P,useDebugValue:P,useDeferredValue:P,useTransition:P,useMutableSource:P,useSyncExternalStore:P,useId:P,unstable_isNewReconciler:!1},Oh={readContext:eh,useCallback:function(a,b){Th().memoizedState=[a,void 0===b?null:b];return a},useContext:eh,useEffect:mi,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return ki(4194308,
4,pi.bind(null,b,a),c)},useLayoutEffect:function(a,b){return ki(4194308,4,a,b)},useInsertionEffect:function(a,b){return ki(4,2,a,b)},useMemo:function(a,b){var c=Th();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Th();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};d.queue=a;a=a.dispatch=xi.bind(null,M,a);return[d.memoizedState,a]},useRef:function(a){var b=
Th();a={current:a};return b.memoizedState=a},useState:hi,useDebugValue:ri,useDeferredValue:function(a){return Th().memoizedState=a},useTransition:function(){var a=hi(!1),b=a[0];a=vi.bind(null,a[1]);Th().memoizedState=a;return[b,a]},useMutableSource:function(){},useSyncExternalStore:function(a,b,c){var d=M,e=Th();if(I){if(void 0===c)throw Error(p(407));c=c()}else{c=b();if(null===Q)throw Error(p(349));0!==(Hh&30)||di(d,b,c)}e.memoizedState=c;var f={value:c,getSnapshot:b};e.queue=f;mi(ai.bind(null,d,
f,a),[a]);d.flags|=2048;bi(9,ci.bind(null,d,f,c,b),void 0,null);return c},useId:function(){var a=Th(),b=Q.identifierPrefix;if(I){var c=sg;var d=rg;c=(d&~(1<<32-oc(d)-1)).toString(32)+c;b=":"+b+"R"+c;c=Kh++;0<c&&(b+="H"+c.toString(32));b+=":"}else c=Lh++,b=":"+b+"r"+c.toString(32)+":";return a.memoizedState=b},unstable_isNewReconciler:!1},Ph={readContext:eh,useCallback:si,useContext:eh,useEffect:$h,useImperativeHandle:qi,useInsertionEffect:ni,useLayoutEffect:oi,useMemo:ti,useReducer:Wh,useRef:ji,useState:function(){return Wh(Vh)},
useDebugValue:ri,useDeferredValue:function(a){var b=Uh();return ui(b,N.memoizedState,a)},useTransition:function(){var a=Wh(Vh)[0],b=Uh().memoizedState;return[a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi,unstable_isNewReconciler:!1},Qh={readContext:eh,useCallback:si,useContext:eh,useEffect:$h,useImperativeHandle:qi,useInsertionEffect:ni,useLayoutEffect:oi,useMemo:ti,useReducer:Xh,useRef:ji,useState:function(){return Xh(Vh)},useDebugValue:ri,useDeferredValue:function(a){var b=Uh();return null===
N?b.memoizedState=a:ui(b,N.memoizedState,a)},useTransition:function(){var a=Xh(Vh)[0],b=Uh().memoizedState;return[a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi,unstable_isNewReconciler:!1};function Ci(a,b){if(a&&a.defaultProps){b=A({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}function Di(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:A({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c)}
var Ei={isMounted:function(a){return(a=a._reactInternals)?Vb(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=R(),e=yi(a),f=mh(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi(b,a,e,d),oh(b,a,e))},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=R(),e=yi(a),f=mh(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi(b,a,e,d),oh(b,a,e))},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=R(),d=
yi(a),e=mh(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=b);b=nh(a,e,d);null!==b&&(gi(b,a,d,c),oh(b,a,d))}};function Fi(a,b,c,d,e,f,g){a=a.stateNode;return"function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Ie(c,d)||!Ie(e,f):!0}
function Gi(a,b,c){var d=!1,e=Vf;var f=b.contextType;"object"===typeof f&&null!==f?f=eh(f):(e=Zf(b)?Xf:H.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Yf(a,e):Vf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Ei;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function Hi(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Ei.enqueueReplaceState(b,b.state,null)}
function Ii(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs={};kh(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=eh(f):(f=Zf(b)?Xf:H.current,e.context=Yf(a,f));e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Di(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||(b=e.state,
"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Ei.enqueueReplaceState(e,e.state,null),qh(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4194308)}function Ji(a,b){try{var c="",d=b;do c+=Pa(d),d=d.return;while(d);var e=c}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack}return{value:a,source:b,stack:e,digest:null}}
function Ki(a,b,c){return{value:a,source:null,stack:null!=c?c:null,digest:null!=b?b:null}}function Li(a,b){try{console.error(b.value)}catch(c){setTimeout(function(){throw c;})}}var Mi="function"===typeof WeakMap?WeakMap:Map;function Ni(a,b,c){c=mh(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Oi||(Oi=!0,Pi=d);Li(a,b)};return c}
function Qi(a,b,c){c=mh(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){return d(e)};c.callback=function(){Li(a,b)}}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){Li(a,b);"function"!==typeof d&&(null===Ri?Ri=new Set([this]):Ri.add(this));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""})});return c}
function Si(a,b,c){var d=a.pingCache;if(null===d){d=a.pingCache=new Mi;var e=new Set;d.set(b,e)}else e=d.get(b),void 0===e&&(e=new Set,d.set(b,e));e.has(c)||(e.add(c),a=Ti.bind(null,a,b,c),b.then(a,a))}function Ui(a){do{var b;if(b=13===a.tag)b=a.memoizedState,b=null!==b?null!==b.dehydrated?!0:!1:!0;if(b)return a;a=a.return}while(null!==a);return null}
function Vi(a,b,c,d,e){if(0===(a.mode&1))return a===b?a.flags|=65536:(a.flags|=128,c.flags|=131072,c.flags&=-52805,1===c.tag&&(null===c.alternate?c.tag=17:(b=mh(-1,1),b.tag=2,nh(c,b,1))),c.lanes|=1),a;a.flags|=65536;a.lanes=e;return a}var Wi=ua.ReactCurrentOwner,dh=!1;function Xi(a,b,c,d){b.child=null===a?Vg(b,null,c,d):Ug(b,a.child,c,d)}
function Yi(a,b,c,d,e){c=c.render;var f=b.ref;ch(b,e);d=Nh(a,b,c,d,f,e);c=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi(a,b,e);I&&c&&vg(b);b.flags|=1;Xi(a,b,d,e);return b.child}
function $i(a,b,c,d,e){if(null===a){var f=c.type;if("function"===typeof f&&!aj(f)&&void 0===f.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=f,bj(a,b,f,d,e);a=Rg(c.type,null,d,b,b.mode,e);a.ref=b.ref;a.return=b;return b.child=a}f=a.child;if(0===(a.lanes&e)){var g=f.memoizedProps;c=c.compare;c=null!==c?c:Ie;if(c(g,d)&&a.ref===b.ref)return Zi(a,b,e)}b.flags|=1;a=Pg(f,d);a.ref=b.ref;a.return=b;return b.child=a}
function bj(a,b,c,d,e){if(null!==a){var f=a.memoizedProps;if(Ie(f,d)&&a.ref===b.ref)if(dh=!1,b.pendingProps=d=f,0!==(a.lanes&e))0!==(a.flags&131072)&&(dh=!0);else return b.lanes=a.lanes,Zi(a,b,e)}return cj(a,b,c,d,e)}
function dj(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode)if(0===(b.mode&1))b.memoizedState={baseLanes:0,cachePool:null,transitions:null},G(ej,fj),fj|=c;else{if(0===(c&1073741824))return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a,cachePool:null,transitions:null},b.updateQueue=null,G(ej,fj),fj|=a,null;b.memoizedState={baseLanes:0,cachePool:null,transitions:null};d=null!==f?f.baseLanes:c;G(ej,fj);fj|=d}else null!==
f?(d=f.baseLanes|c,b.memoizedState=null):d=c,G(ej,fj),fj|=d;Xi(a,b,e,c);return b.child}function gj(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=512,b.flags|=2097152}function cj(a,b,c,d,e){var f=Zf(c)?Xf:H.current;f=Yf(b,f);ch(b,e);c=Nh(a,b,c,d,f,e);d=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi(a,b,e);I&&d&&vg(b);b.flags|=1;Xi(a,b,c,e);return b.child}
function hj(a,b,c,d,e){if(Zf(c)){var f=!0;cg(b)}else f=!1;ch(b,e);if(null===b.stateNode)ij(a,b),Gi(b,c,d),Ii(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=eh(l):(l=Zf(c)?Xf:H.current,l=Yf(b,l));var m=c.getDerivedStateFromProps,q="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;q||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||
(h!==d||k!==l)&&Hi(b,g,d,l);jh=!1;var r=b.memoizedState;g.state=r;qh(b,d,g,e);k=b.memoizedState;h!==d||r!==k||Wf.current||jh?("function"===typeof m&&(Di(b,c,m,d),k=b.memoizedState),(h=jh||Fi(b,c,h,d,r,k,l))?(q||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.flags|=4194308)):
("function"===typeof g.componentDidMount&&(b.flags|=4194308),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4194308),d=!1)}else{g=b.stateNode;lh(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:Ci(b.type,h);g.props=l;q=b.pendingProps;r=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=eh(k):(k=Zf(c)?Xf:H.current,k=Yf(b,k));var y=c.getDerivedStateFromProps;(m="function"===typeof y||"function"===typeof g.getSnapshotBeforeUpdate)||
"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==q||r!==k)&&Hi(b,g,d,k);jh=!1;r=b.memoizedState;g.state=r;qh(b,d,g,e);var n=b.memoizedState;h!==q||r!==n||Wf.current||jh?("function"===typeof y&&(Di(b,c,y,d),n=b.memoizedState),(l=jh||Fi(b,c,l,d,r,n,k)||!1)?(m||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,n,k),"function"===typeof g.UNSAFE_componentWillUpdate&&
g.UNSAFE_componentWillUpdate(d,n,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=1024)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),b.memoizedProps=d,b.memoizedState=n),g.props=d,g.state=n,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===
a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),d=!1)}return jj(a,b,c,d,f,e)}
function jj(a,b,c,d,e,f){gj(a,b);var g=0!==(b.flags&128);if(!d&&!g)return e&&dg(b,c,!1),Zi(a,b,f);d=b.stateNode;Wi.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Ug(b,a.child,null,f),b.child=Ug(b,null,h,f)):Xi(a,b,h,f);b.memoizedState=d.state;e&&dg(b,c,!0);return b.child}function kj(a){var b=a.stateNode;b.pendingContext?ag(a,b.pendingContext,b.pendingContext!==b.context):b.context&&ag(a,b.context,!1);yh(a,b.containerInfo)}
function lj(a,b,c,d,e){Ig();Jg(e);b.flags|=256;Xi(a,b,c,d);return b.child}var mj={dehydrated:null,treeContext:null,retryLane:0};function nj(a){return{baseLanes:a,cachePool:null,transitions:null}}
function oj(a,b,c){var d=b.pendingProps,e=L.current,f=!1,g=0!==(b.flags&128),h;(h=g)||(h=null!==a&&null===a.memoizedState?!1:0!==(e&2));if(h)f=!0,b.flags&=-129;else if(null===a||null!==a.memoizedState)e|=1;G(L,e&1);if(null===a){Eg(b);a=b.memoizedState;if(null!==a&&(a=a.dehydrated,null!==a))return 0===(b.mode&1)?b.lanes=1:"$!"===a.data?b.lanes=8:b.lanes=1073741824,null;g=d.children;a=d.fallback;return f?(d=b.mode,f=b.child,g={mode:"hidden",children:g},0===(d&1)&&null!==f?(f.childLanes=0,f.pendingProps=
g):f=pj(g,d,0,null),a=Tg(a,d,c,null),f.return=b,a.return=b,f.sibling=a,b.child=f,b.child.memoizedState=nj(c),b.memoizedState=mj,a):qj(b,g)}e=a.memoizedState;if(null!==e&&(h=e.dehydrated,null!==h))return rj(a,b,g,d,h,e,c);if(f){f=d.fallback;g=b.mode;e=a.child;h=e.sibling;var k={mode:"hidden",children:d.children};0===(g&1)&&b.child!==e?(d=b.child,d.childLanes=0,d.pendingProps=k,b.deletions=null):(d=Pg(e,k),d.subtreeFlags=e.subtreeFlags&14680064);null!==h?f=Pg(h,f):(f=Tg(f,g,c,null),f.flags|=2);f.return=
b;d.return=b;d.sibling=f;b.child=d;d=f;f=b.child;g=a.child.memoizedState;g=null===g?nj(c):{baseLanes:g.baseLanes|c,cachePool:null,transitions:g.transitions};f.memoizedState=g;f.childLanes=a.childLanes&~c;b.memoizedState=mj;return d}f=a.child;a=f.sibling;d=Pg(f,{mode:"visible",children:d.children});0===(b.mode&1)&&(d.lanes=c);d.return=b;d.sibling=null;null!==a&&(c=b.deletions,null===c?(b.deletions=[a],b.flags|=16):c.push(a));b.child=d;b.memoizedState=null;return d}
function qj(a,b){b=pj({mode:"visible",children:b},a.mode,0,null);b.return=a;return a.child=b}function sj(a,b,c,d){null!==d&&Jg(d);Ug(b,a.child,null,c);a=qj(b,b.pendingProps.children);a.flags|=2;b.memoizedState=null;return a}
function rj(a,b,c,d,e,f,g){if(c){if(b.flags&256)return b.flags&=-257,d=Ki(Error(p(422))),sj(a,b,g,d);if(null!==b.memoizedState)return b.child=a.child,b.flags|=128,null;f=d.fallback;e=b.mode;d=pj({mode:"visible",children:d.children},e,0,null);f=Tg(f,e,g,null);f.flags|=2;d.return=b;f.return=b;d.sibling=f;b.child=d;0!==(b.mode&1)&&Ug(b,a.child,null,g);b.child.memoizedState=nj(g);b.memoizedState=mj;return f}if(0===(b.mode&1))return sj(a,b,g,null);if("$!"===e.data){d=e.nextSibling&&e.nextSibling.dataset;
if(d)var h=d.dgst;d=h;f=Error(p(419));d=Ki(f,d,void 0);return sj(a,b,g,d)}h=0!==(g&a.childLanes);if(dh||h){d=Q;if(null!==d){switch(g&-g){case 4:e=2;break;case 16:e=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:e=32;break;case 536870912:e=268435456;break;default:e=0}e=0!==(e&(d.suspendedLanes|g))?0:e;
0!==e&&e!==f.retryLane&&(f.retryLane=e,ih(a,e),gi(d,a,e,-1))}tj();d=Ki(Error(p(421)));return sj(a,b,g,d)}if("$?"===e.data)return b.flags|=128,b.child=a.child,b=uj.bind(null,a),e._reactRetry=b,null;a=f.treeContext;yg=Lf(e.nextSibling);xg=b;I=!0;zg=null;null!==a&&(og[pg++]=rg,og[pg++]=sg,og[pg++]=qg,rg=a.id,sg=a.overflow,qg=b);b=qj(b,d.children);b.flags|=4096;return b}function vj(a,b,c){a.lanes|=b;var d=a.alternate;null!==d&&(d.lanes|=b);bh(a.return,b,c)}
function wj(a,b,c,d,e){var f=a.memoizedState;null===f?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e}:(f.isBackwards=b,f.rendering=null,f.renderingStartTime=0,f.last=d,f.tail=c,f.tailMode=e)}
function xj(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;Xi(a,b,d.children,c);d=L.current;if(0!==(d&2))d=d&1|2,b.flags|=128;else{if(null!==a&&0!==(a.flags&128))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&vj(a,c,b);else if(19===a.tag)vj(a,c,b);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return}a.sibling.return=a.return;a=a.sibling}d&=1}G(L,d);if(0===(b.mode&1))b.memoizedState=
null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===Ch(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);wj(b,!1,e,c,f);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===Ch(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a}wj(b,!0,c,null,f);break;case "together":wj(b,!1,null,null,void 0);break;default:b.memoizedState=null}return b.child}
function ij(a,b){0===(b.mode&1)&&null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2)}function Zi(a,b,c){null!==a&&(b.dependencies=a.dependencies);rh|=b.lanes;if(0===(c&b.childLanes))return null;if(null!==a&&b.child!==a.child)throw Error(p(153));if(null!==b.child){a=b.child;c=Pg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Pg(a,a.pendingProps),c.return=b;c.sibling=null}return b.child}
function yj(a,b,c){switch(b.tag){case 3:kj(b);Ig();break;case 5:Ah(b);break;case 1:Zf(b.type)&&cg(b);break;case 4:yh(b,b.stateNode.containerInfo);break;case 10:var d=b.type._context,e=b.memoizedProps.value;G(Wg,d._currentValue);d._currentValue=e;break;case 13:d=b.memoizedState;if(null!==d){if(null!==d.dehydrated)return G(L,L.current&1),b.flags|=128,null;if(0!==(c&b.child.childLanes))return oj(a,b,c);G(L,L.current&1);a=Zi(a,b,c);return null!==a?a.sibling:null}G(L,L.current&1);break;case 19:d=0!==(c&
b.childLanes);if(0!==(a.flags&128)){if(d)return xj(a,b,c);b.flags|=128}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);G(L,L.current);if(d)break;else return null;case 22:case 23:return b.lanes=0,dj(a,b,c)}return Zi(a,b,c)}var zj,Aj,Bj,Cj;
zj=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return}c.sibling.return=c.return;c=c.sibling}};Aj=function(){};
Bj=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;xh(uh.current);var f=null;switch(c){case "input":e=Ya(a,e);d=Ya(a,d);f=[];break;case "select":e=A({},e,{value:void 0});d=A({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=Bf)}ub(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&
(c||(c={}),c[g]="")}else"dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ea.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||(c={}),c[g]=k[g])}else c||(f||(f=[]),f.push(l,
c)),c=k;else"dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ea.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&D("scroll",a),f||h===k||(f=[])):(f=f||[]).push(l,k))}c&&(f=f||[]).push("style",c);var l=f;if(b.updateQueue=l)b.flags|=4}};Cj=function(a,b,c,d){c!==d&&(b.flags|=4)};
function Dj(a,b){if(!I)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null}}
function S(a){var b=null!==a.alternate&&a.alternate.child===a.child,c=0,d=0;if(b)for(var e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags&14680064,d|=e.flags&14680064,e.return=a,e=e.sibling;else for(e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags,d|=e.flags,e.return=a,e=e.sibling;a.subtreeFlags|=d;a.childLanes=c;return b}
function Ej(a,b,c){var d=b.pendingProps;wg(b);switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return S(b),null;case 1:return Zf(b.type)&&$f(),S(b),null;case 3:d=b.stateNode;zh();E(Wf);E(H);Eh();d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)Gg(b)?b.flags|=4:null===a||a.memoizedState.isDehydrated&&0===(b.flags&256)||(b.flags|=1024,null!==zg&&(Fj(zg),zg=null));Aj(a,b);S(b);return null;case 5:Bh(b);var e=xh(wh.current);
c=b.type;if(null!==a&&null!=b.stateNode)Bj(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=512,b.flags|=2097152);else{if(!d){if(null===b.stateNode)throw Error(p(166));S(b);return null}a=xh(uh.current);if(Gg(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[Of]=b;d[Pf]=f;a=0!==(b.mode&1);switch(c){case "dialog":D("cancel",d);D("close",d);break;case "iframe":case "object":case "embed":D("load",d);break;case "video":case "audio":for(e=0;e<lf.length;e++)D(lf[e],d);break;case "source":D("error",d);break;case "img":case "image":case "link":D("error",
d);D("load",d);break;case "details":D("toggle",d);break;case "input":Za(d,f);D("invalid",d);break;case "select":d._wrapperState={wasMultiple:!!f.multiple};D("invalid",d);break;case "textarea":hb(d,f),D("invalid",d)}ub(c,f);e=null;for(var g in f)if(f.hasOwnProperty(g)){var h=f[g];"children"===g?"string"===typeof h?d.textContent!==h&&(!0!==f.suppressHydrationWarning&&Af(d.textContent,h,a),e=["children",h]):"number"===typeof h&&d.textContent!==""+h&&(!0!==f.suppressHydrationWarning&&Af(d.textContent,
h,a),e=["children",""+h]):ea.hasOwnProperty(g)&&null!=h&&"onScroll"===g&&D("scroll",d)}switch(c){case "input":Va(d);db(d,f,!0);break;case "textarea":Va(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=Bf)}d=e;b.updateQueue=d;null!==d&&(b.flags|=4)}else{g=9===e.nodeType?e:e.ownerDocument;"http://www.w3.org/1999/xhtml"===a&&(a=kb(c));"http://www.w3.org/1999/xhtml"===a?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):
"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=!0:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[Of]=b;a[Pf]=d;zj(a,b,!1,!1);b.stateNode=a;a:{g=vb(c,d);switch(c){case "dialog":D("cancel",a);D("close",a);e=d;break;case "iframe":case "object":case "embed":D("load",a);e=d;break;case "video":case "audio":for(e=0;e<lf.length;e++)D(lf[e],a);e=d;break;case "source":D("error",a);e=d;break;case "img":case "image":case "link":D("error",
a);D("load",a);e=d;break;case "details":D("toggle",a);e=d;break;case "input":Za(a,d);e=Ya(a,d);D("invalid",a);break;case "option":e=d;break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=A({},d,{value:void 0});D("invalid",a);break;case "textarea":hb(a,d);e=gb(a,d);D("invalid",a);break;default:e=d}ub(c,e);h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?sb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&nb(a,k)):"children"===f?"string"===typeof k?("textarea"!==
c||""!==k)&&ob(a,k):"number"===typeof k&&ob(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ea.hasOwnProperty(f)?null!=k&&"onScroll"===f&&D("scroll",a):null!=k&&ta(a,f,k,g))}switch(c){case "input":Va(a);db(a,d,!1);break;case "textarea":Va(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,!1):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,
!0);break;default:"function"===typeof e.onClick&&(a.onclick=Bf)}switch(c){case "button":case "input":case "select":case "textarea":d=!!d.autoFocus;break a;case "img":d=!0;break a;default:d=!1}}d&&(b.flags|=4)}null!==b.ref&&(b.flags|=512,b.flags|=2097152)}S(b);return null;case 6:if(a&&null!=b.stateNode)Cj(a,b,a.memoizedProps,d);else{if("string"!==typeof d&&null===b.stateNode)throw Error(p(166));c=xh(wh.current);xh(uh.current);if(Gg(b)){d=b.stateNode;c=b.memoizedProps;d[Of]=b;if(f=d.nodeValue!==c)if(a=
xg,null!==a)switch(a.tag){case 3:Af(d.nodeValue,c,0!==(a.mode&1));break;case 5:!0!==a.memoizedProps.suppressHydrationWarning&&Af(d.nodeValue,c,0!==(a.mode&1))}f&&(b.flags|=4)}else d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[Of]=b,b.stateNode=d}S(b);return null;case 13:E(L);d=b.memoizedState;if(null===a||null!==a.memoizedState&&null!==a.memoizedState.dehydrated){if(I&&null!==yg&&0!==(b.mode&1)&&0===(b.flags&128))Hg(),Ig(),b.flags|=98560,f=!1;else if(f=Gg(b),null!==d&&null!==d.dehydrated){if(null===
a){if(!f)throw Error(p(318));f=b.memoizedState;f=null!==f?f.dehydrated:null;if(!f)throw Error(p(317));f[Of]=b}else Ig(),0===(b.flags&128)&&(b.memoizedState=null),b.flags|=4;S(b);f=!1}else null!==zg&&(Fj(zg),zg=null),f=!0;if(!f)return b.flags&65536?b:null}if(0!==(b.flags&128))return b.lanes=c,b;d=null!==d;d!==(null!==a&&null!==a.memoizedState)&&d&&(b.child.flags|=8192,0!==(b.mode&1)&&(null===a||0!==(L.current&1)?0===T&&(T=3):tj()));null!==b.updateQueue&&(b.flags|=4);S(b);return null;case 4:return zh(),
Aj(a,b),null===a&&sf(b.stateNode.containerInfo),S(b),null;case 10:return ah(b.type._context),S(b),null;case 17:return Zf(b.type)&&$f(),S(b),null;case 19:E(L);f=b.memoizedState;if(null===f)return S(b),null;d=0!==(b.flags&128);g=f.rendering;if(null===g)if(d)Dj(f,!1);else{if(0!==T||null!==a&&0!==(a.flags&128))for(a=b.child;null!==a;){g=Ch(a);if(null!==g){b.flags|=128;Dj(f,!1);d=g.updateQueue;null!==d&&(b.updateQueue=d,b.flags|=4);b.subtreeFlags=0;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=14680066,
g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.subtreeFlags=0,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.subtreeFlags=0,f.deletions=null,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;G(L,L.current&1|2);return b.child}a=
a.sibling}null!==f.tail&&B()>Gj&&(b.flags|=128,d=!0,Dj(f,!1),b.lanes=4194304)}else{if(!d)if(a=Ch(g),null!==a){if(b.flags|=128,d=!0,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Dj(f,!0),null===f.tail&&"hidden"===f.tailMode&&!g.alternate&&!I)return S(b),null}else 2*B()-f.renderingStartTime>Gj&&1073741824!==c&&(b.flags|=128,d=!0,Dj(f,!1),b.lanes=4194304);f.isBackwards?(g.sibling=b.child,b.child=g):(c=f.last,null!==c?c.sibling=g:b.child=g,f.last=g)}if(null!==f.tail)return b=f.tail,f.rendering=
b,f.tail=b.sibling,f.renderingStartTime=B(),b.sibling=null,c=L.current,G(L,d?c&1|2:c&1),b;S(b);return null;case 22:case 23:return Hj(),d=null!==b.memoizedState,null!==a&&null!==a.memoizedState!==d&&(b.flags|=8192),d&&0!==(b.mode&1)?0!==(fj&1073741824)&&(S(b),b.subtreeFlags&6&&(b.flags|=8192)):S(b),null;case 24:return null;case 25:return null}throw Error(p(156,b.tag));}
function Ij(a,b){wg(b);switch(b.tag){case 1:return Zf(b.type)&&$f(),a=b.flags,a&65536?(b.flags=a&-65537|128,b):null;case 3:return zh(),E(Wf),E(H),Eh(),a=b.flags,0!==(a&65536)&&0===(a&128)?(b.flags=a&-65537|128,b):null;case 5:return Bh(b),null;case 13:E(L);a=b.memoizedState;if(null!==a&&null!==a.dehydrated){if(null===b.alternate)throw Error(p(340));Ig()}a=b.flags;return a&65536?(b.flags=a&-65537|128,b):null;case 19:return E(L),null;case 4:return zh(),null;case 10:return ah(b.type._context),null;case 22:case 23:return Hj(),
null;case 24:return null;default:return null}}var Jj=!1,U=!1,Kj="function"===typeof WeakSet?WeakSet:Set,V=null;function Lj(a,b){var c=a.ref;if(null!==c)if("function"===typeof c)try{c(null)}catch(d){W(a,b,d)}else c.current=null}function Mj(a,b,c){try{c()}catch(d){W(a,b,d)}}var Nj=!1;
function Oj(a,b){Cf=dd;a=Me();if(Ne(a)){if("selectionStart"in a)var c={start:a.selectionStart,end:a.selectionEnd};else a:{c=(c=a.ownerDocument)&&c.defaultView||window;var d=c.getSelection&&c.getSelection();if(d&&0!==d.rangeCount){c=d.anchorNode;var e=d.anchorOffset,f=d.focusNode;d=d.focusOffset;try{c.nodeType,f.nodeType}catch(F){c=null;break a}var g=0,h=-1,k=-1,l=0,m=0,q=a,r=null;b:for(;;){for(var y;;){q!==c||0!==e&&3!==q.nodeType||(h=g+e);q!==f||0!==d&&3!==q.nodeType||(k=g+d);3===q.nodeType&&(g+=
q.nodeValue.length);if(null===(y=q.firstChild))break;r=q;q=y}for(;;){if(q===a)break b;r===c&&++l===e&&(h=g);r===f&&++m===d&&(k=g);if(null!==(y=q.nextSibling))break;q=r;r=q.parentNode}q=y}c=-1===h||-1===k?null:{start:h,end:k}}else c=null}c=c||{start:0,end:0}}else c=null;Df={focusedElem:a,selectionRange:c};dd=!1;for(V=b;null!==V;)if(b=V,a=b.child,0!==(b.subtreeFlags&1028)&&null!==a)a.return=b,V=a;else for(;null!==V;){b=V;try{var n=b.alternate;if(0!==(b.flags&1024))switch(b.tag){case 0:case 11:case 15:break;
case 1:if(null!==n){var t=n.memoizedProps,J=n.memoizedState,x=b.stateNode,w=x.getSnapshotBeforeUpdate(b.elementType===b.type?t:Ci(b.type,t),J);x.__reactInternalSnapshotBeforeUpdate=w}break;case 3:var u=b.stateNode.containerInfo;1===u.nodeType?u.textContent="":9===u.nodeType&&u.documentElement&&u.removeChild(u.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(p(163));}}catch(F){W(b,b.return,F)}a=b.sibling;if(null!==a){a.return=b.return;V=a;break}V=b.return}n=Nj;Nj=!1;return n}
function Pj(a,b,c){var d=b.updateQueue;d=null!==d?d.lastEffect:null;if(null!==d){var e=d=d.next;do{if((e.tag&a)===a){var f=e.destroy;e.destroy=void 0;void 0!==f&&Mj(b,c,f)}e=e.next}while(e!==d)}}function Qj(a,b){b=b.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){var c=b=b.next;do{if((c.tag&a)===a){var d=c.create;c.destroy=d()}c=c.next}while(c!==b)}}function Rj(a){var b=a.ref;if(null!==b){var c=a.stateNode;switch(a.tag){case 5:a=c;break;default:a=c}"function"===typeof b?b(a):b.current=a}}
function Sj(a){var b=a.alternate;null!==b&&(a.alternate=null,Sj(b));a.child=null;a.deletions=null;a.sibling=null;5===a.tag&&(b=a.stateNode,null!==b&&(delete b[Of],delete b[Pf],delete b[of],delete b[Qf],delete b[Rf]));a.stateNode=null;a.return=null;a.dependencies=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.stateNode=null;a.updateQueue=null}function Tj(a){return 5===a.tag||3===a.tag||4===a.tag}
function Uj(a){a:for(;;){for(;null===a.sibling;){if(null===a.return||Tj(a.return))return null;a=a.return}a.sibling.return=a.return;for(a=a.sibling;5!==a.tag&&6!==a.tag&&18!==a.tag;){if(a.flags&2)continue a;if(null===a.child||4===a.tag)continue a;else a.child.return=a,a=a.child}if(!(a.flags&2))return a.stateNode}}
function Vj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=Bf));else if(4!==d&&(a=a.child,null!==a))for(Vj(a,b,c),a=a.sibling;null!==a;)Vj(a,b,c),a=a.sibling}
function Wj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(Wj(a,b,c),a=a.sibling;null!==a;)Wj(a,b,c),a=a.sibling}var X=null,Xj=!1;function Yj(a,b,c){for(c=c.child;null!==c;)Zj(a,b,c),c=c.sibling}
function Zj(a,b,c){if(lc&&"function"===typeof lc.onCommitFiberUnmount)try{lc.onCommitFiberUnmount(kc,c)}catch(h){}switch(c.tag){case 5:U||Lj(c,b);case 6:var d=X,e=Xj;X=null;Yj(a,b,c);X=d;Xj=e;null!==X&&(Xj?(a=X,c=c.stateNode,8===a.nodeType?a.parentNode.removeChild(c):a.removeChild(c)):X.removeChild(c.stateNode));break;case 18:null!==X&&(Xj?(a=X,c=c.stateNode,8===a.nodeType?Kf(a.parentNode,c):1===a.nodeType&&Kf(a,c),bd(a)):Kf(X,c.stateNode));break;case 4:d=X;e=Xj;X=c.stateNode.containerInfo;Xj=!0;
Yj(a,b,c);X=d;Xj=e;break;case 0:case 11:case 14:case 15:if(!U&&(d=c.updateQueue,null!==d&&(d=d.lastEffect,null!==d))){e=d=d.next;do{var f=e,g=f.destroy;f=f.tag;void 0!==g&&(0!==(f&2)?Mj(c,b,g):0!==(f&4)&&Mj(c,b,g));e=e.next}while(e!==d)}Yj(a,b,c);break;case 1:if(!U&&(Lj(c,b),d=c.stateNode,"function"===typeof d.componentWillUnmount))try{d.props=c.memoizedProps,d.state=c.memoizedState,d.componentWillUnmount()}catch(h){W(c,b,h)}Yj(a,b,c);break;case 21:Yj(a,b,c);break;case 22:c.mode&1?(U=(d=U)||null!==
c.memoizedState,Yj(a,b,c),U=d):Yj(a,b,c);break;default:Yj(a,b,c)}}function ak(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Kj);b.forEach(function(b){var d=bk.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d))})}}
function ck(a,b){var c=b.deletions;if(null!==c)for(var d=0;d<c.length;d++){var e=c[d];try{var f=a,g=b,h=g;a:for(;null!==h;){switch(h.tag){case 5:X=h.stateNode;Xj=!1;break a;case 3:X=h.stateNode.containerInfo;Xj=!0;break a;case 4:X=h.stateNode.containerInfo;Xj=!0;break a}h=h.return}if(null===X)throw Error(p(160));Zj(f,g,e);X=null;Xj=!1;var k=e.alternate;null!==k&&(k.return=null);e.return=null}catch(l){W(e,b,l)}}if(b.subtreeFlags&12854)for(b=b.child;null!==b;)dk(b,a),b=b.sibling}
function dk(a,b){var c=a.alternate,d=a.flags;switch(a.tag){case 0:case 11:case 14:case 15:ck(b,a);ek(a);if(d&4){try{Pj(3,a,a.return),Qj(3,a)}catch(t){W(a,a.return,t)}try{Pj(5,a,a.return)}catch(t){W(a,a.return,t)}}break;case 1:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);break;case 5:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);if(a.flags&32){var e=a.stateNode;try{ob(e,"")}catch(t){W(a,a.return,t)}}if(d&4&&(e=a.stateNode,null!=e)){var f=a.memoizedProps,g=null!==c?c.memoizedProps:f,h=a.type,k=a.updateQueue;
a.updateQueue=null;if(null!==k)try{"input"===h&&"radio"===f.type&&null!=f.name&&ab(e,f);vb(h,g);var l=vb(h,f);for(g=0;g<k.length;g+=2){var m=k[g],q=k[g+1];"style"===m?sb(e,q):"dangerouslySetInnerHTML"===m?nb(e,q):"children"===m?ob(e,q):ta(e,m,q,l)}switch(h){case "input":bb(e,f);break;case "textarea":ib(e,f);break;case "select":var r=e._wrapperState.wasMultiple;e._wrapperState.wasMultiple=!!f.multiple;var y=f.value;null!=y?fb(e,!!f.multiple,y,!1):r!==!!f.multiple&&(null!=f.defaultValue?fb(e,!!f.multiple,
f.defaultValue,!0):fb(e,!!f.multiple,f.multiple?[]:"",!1))}e[Pf]=f}catch(t){W(a,a.return,t)}}break;case 6:ck(b,a);ek(a);if(d&4){if(null===a.stateNode)throw Error(p(162));e=a.stateNode;f=a.memoizedProps;try{e.nodeValue=f}catch(t){W(a,a.return,t)}}break;case 3:ck(b,a);ek(a);if(d&4&&null!==c&&c.memoizedState.isDehydrated)try{bd(b.containerInfo)}catch(t){W(a,a.return,t)}break;case 4:ck(b,a);ek(a);break;case 13:ck(b,a);ek(a);e=a.child;e.flags&8192&&(f=null!==e.memoizedState,e.stateNode.isHidden=f,!f||
null!==e.alternate&&null!==e.alternate.memoizedState||(fk=B()));d&4&&ak(a);break;case 22:m=null!==c&&null!==c.memoizedState;a.mode&1?(U=(l=U)||m,ck(b,a),U=l):ck(b,a);ek(a);if(d&8192){l=null!==a.memoizedState;if((a.stateNode.isHidden=l)&&!m&&0!==(a.mode&1))for(V=a,m=a.child;null!==m;){for(q=V=m;null!==V;){r=V;y=r.child;switch(r.tag){case 0:case 11:case 14:case 15:Pj(4,r,r.return);break;case 1:Lj(r,r.return);var n=r.stateNode;if("function"===typeof n.componentWillUnmount){d=r;c=r.return;try{b=d,n.props=
b.memoizedProps,n.state=b.memoizedState,n.componentWillUnmount()}catch(t){W(d,c,t)}}break;case 5:Lj(r,r.return);break;case 22:if(null!==r.memoizedState){gk(q);continue}}null!==y?(y.return=r,V=y):gk(q)}m=m.sibling}a:for(m=null,q=a;;){if(5===q.tag){if(null===m){m=q;try{e=q.stateNode,l?(f=e.style,"function"===typeof f.setProperty?f.setProperty("display","none","important"):f.display="none"):(h=q.stateNode,k=q.memoizedProps.style,g=void 0!==k&&null!==k&&k.hasOwnProperty("display")?k.display:null,h.style.display=
rb("display",g))}catch(t){W(a,a.return,t)}}}else if(6===q.tag){if(null===m)try{q.stateNode.nodeValue=l?"":q.memoizedProps}catch(t){W(a,a.return,t)}}else if((22!==q.tag&&23!==q.tag||null===q.memoizedState||q===a)&&null!==q.child){q.child.return=q;q=q.child;continue}if(q===a)break a;for(;null===q.sibling;){if(null===q.return||q.return===a)break a;m===q&&(m=null);q=q.return}m===q&&(m=null);q.sibling.return=q.return;q=q.sibling}}break;case 19:ck(b,a);ek(a);d&4&&ak(a);break;case 21:break;default:ck(b,
a),ek(a)}}function ek(a){var b=a.flags;if(b&2){try{a:{for(var c=a.return;null!==c;){if(Tj(c)){var d=c;break a}c=c.return}throw Error(p(160));}switch(d.tag){case 5:var e=d.stateNode;d.flags&32&&(ob(e,""),d.flags&=-33);var f=Uj(a);Wj(a,f,e);break;case 3:case 4:var g=d.stateNode.containerInfo,h=Uj(a);Vj(a,h,g);break;default:throw Error(p(161));}}catch(k){W(a,a.return,k)}a.flags&=-3}b&4096&&(a.flags&=-4097)}function hk(a,b,c){V=a;ik(a,b,c)}
function ik(a,b,c){for(var d=0!==(a.mode&1);null!==V;){var e=V,f=e.child;if(22===e.tag&&d){var g=null!==e.memoizedState||Jj;if(!g){var h=e.alternate,k=null!==h&&null!==h.memoizedState||U;h=Jj;var l=U;Jj=g;if((U=k)&&!l)for(V=e;null!==V;)g=V,k=g.child,22===g.tag&&null!==g.memoizedState?jk(e):null!==k?(k.return=g,V=k):jk(e);for(;null!==f;)V=f,ik(f,b,c),f=f.sibling;V=e;Jj=h;U=l}kk(a,b,c)}else 0!==(e.subtreeFlags&8772)&&null!==f?(f.return=e,V=f):kk(a,b,c)}}
function kk(a){for(;null!==V;){var b=V;if(0!==(b.flags&8772)){var c=b.alternate;try{if(0!==(b.flags&8772))switch(b.tag){case 0:case 11:case 15:U||Qj(5,b);break;case 1:var d=b.stateNode;if(b.flags&4&&!U)if(null===c)d.componentDidMount();else{var e=b.elementType===b.type?c.memoizedProps:Ci(b.type,c.memoizedProps);d.componentDidUpdate(e,c.memoizedState,d.__reactInternalSnapshotBeforeUpdate)}var f=b.updateQueue;null!==f&&sh(b,f,d);break;case 3:var g=b.updateQueue;if(null!==g){c=null;if(null!==b.child)switch(b.child.tag){case 5:c=
b.child.stateNode;break;case 1:c=b.child.stateNode}sh(b,g,c)}break;case 5:var h=b.stateNode;if(null===c&&b.flags&4){c=h;var k=b.memoizedProps;switch(b.type){case "button":case "input":case "select":case "textarea":k.autoFocus&&c.focus();break;case "img":k.src&&(c.src=k.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(null===b.memoizedState){var l=b.alternate;if(null!==l){var m=l.memoizedState;if(null!==m){var q=m.dehydrated;null!==q&&bd(q)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;
default:throw Error(p(163));}U||b.flags&512&&Rj(b)}catch(r){W(b,b.return,r)}}if(b===a){V=null;break}c=b.sibling;if(null!==c){c.return=b.return;V=c;break}V=b.return}}function gk(a){for(;null!==V;){var b=V;if(b===a){V=null;break}var c=b.sibling;if(null!==c){c.return=b.return;V=c;break}V=b.return}}
function jk(a){for(;null!==V;){var b=V;try{switch(b.tag){case 0:case 11:case 15:var c=b.return;try{Qj(4,b)}catch(k){W(b,c,k)}break;case 1:var d=b.stateNode;if("function"===typeof d.componentDidMount){var e=b.return;try{d.componentDidMount()}catch(k){W(b,e,k)}}var f=b.return;try{Rj(b)}catch(k){W(b,f,k)}break;case 5:var g=b.return;try{Rj(b)}catch(k){W(b,g,k)}}}catch(k){W(b,b.return,k)}if(b===a){V=null;break}var h=b.sibling;if(null!==h){h.return=b.return;V=h;break}V=b.return}}
var lk=Math.ceil,mk=ua.ReactCurrentDispatcher,nk=ua.ReactCurrentOwner,ok=ua.ReactCurrentBatchConfig,K=0,Q=null,Y=null,Z=0,fj=0,ej=Uf(0),T=0,pk=null,rh=0,qk=0,rk=0,sk=null,tk=null,fk=0,Gj=Infinity,uk=null,Oi=!1,Pi=null,Ri=null,vk=!1,wk=null,xk=0,yk=0,zk=null,Ak=-1,Bk=0;function R(){return 0!==(K&6)?B():-1!==Ak?Ak:Ak=B()}
function yi(a){if(0===(a.mode&1))return 1;if(0!==(K&2)&&0!==Z)return Z&-Z;if(null!==Kg.transition)return 0===Bk&&(Bk=yc()),Bk;a=C;if(0!==a)return a;a=window.event;a=void 0===a?16:jd(a.type);return a}function gi(a,b,c,d){if(50<yk)throw yk=0,zk=null,Error(p(185));Ac(a,c,d);if(0===(K&2)||a!==Q)a===Q&&(0===(K&2)&&(qk|=c),4===T&&Ck(a,Z)),Dk(a,d),1===c&&0===K&&0===(b.mode&1)&&(Gj=B()+500,fg&&jg())}
function Dk(a,b){var c=a.callbackNode;wc(a,b);var d=uc(a,a===Q?Z:0);if(0===d)null!==c&&bc(c),a.callbackNode=null,a.callbackPriority=0;else if(b=d&-d,a.callbackPriority!==b){null!=c&&bc(c);if(1===b)0===a.tag?ig(Ek.bind(null,a)):hg(Ek.bind(null,a)),Jf(function(){0===(K&6)&&jg()}),c=null;else{switch(Dc(d)){case 1:c=fc;break;case 4:c=gc;break;case 16:c=hc;break;case 536870912:c=jc;break;default:c=hc}c=Fk(c,Gk.bind(null,a))}a.callbackPriority=b;a.callbackNode=c}}
function Gk(a,b){Ak=-1;Bk=0;if(0!==(K&6))throw Error(p(327));var c=a.callbackNode;if(Hk()&&a.callbackNode!==c)return null;var d=uc(a,a===Q?Z:0);if(0===d)return null;if(0!==(d&30)||0!==(d&a.expiredLanes)||b)b=Ik(a,d);else{b=d;var e=K;K|=2;var f=Jk();if(Q!==a||Z!==b)uk=null,Gj=B()+500,Kk(a,b);do try{Lk();break}catch(h){Mk(a,h)}while(1);$g();mk.current=f;K=e;null!==Y?b=0:(Q=null,Z=0,b=T)}if(0!==b){2===b&&(e=xc(a),0!==e&&(d=e,b=Nk(a,e)));if(1===b)throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B()),c;if(6===b)Ck(a,d);
else{e=a.current.alternate;if(0===(d&30)&&!Ok(e)&&(b=Ik(a,d),2===b&&(f=xc(a),0!==f&&(d=f,b=Nk(a,f))),1===b))throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B()),c;a.finishedWork=e;a.finishedLanes=d;switch(b){case 0:case 1:throw Error(p(345));case 2:Pk(a,tk,uk);break;case 3:Ck(a,d);if((d&130023424)===d&&(b=fk+500-B(),10<b)){if(0!==uc(a,0))break;e=a.suspendedLanes;if((e&d)!==d){R();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=Ff(Pk.bind(null,a,tk,uk),b);break}Pk(a,tk,uk);break;case 4:Ck(a,d);if((d&4194240)===
d)break;b=a.eventTimes;for(e=-1;0<d;){var g=31-oc(d);f=1<<g;g=b[g];g>e&&(e=g);d&=~f}d=e;d=B()-d;d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3E3>d?3E3:4320>d?4320:1960*lk(d/1960))-d;if(10<d){a.timeoutHandle=Ff(Pk.bind(null,a,tk,uk),d);break}Pk(a,tk,uk);break;case 5:Pk(a,tk,uk);break;default:throw Error(p(329));}}}Dk(a,B());return a.callbackNode===c?Gk.bind(null,a):null}
function Nk(a,b){var c=sk;a.current.memoizedState.isDehydrated&&(Kk(a,b).flags|=256);a=Ik(a,b);2!==a&&(b=tk,tk=c,null!==b&&Fj(b));return a}function Fj(a){null===tk?tk=a:tk.push.apply(tk,a)}
function Ok(a){for(var b=a;;){if(b.flags&16384){var c=b.updateQueue;if(null!==c&&(c=c.stores,null!==c))for(var d=0;d<c.length;d++){var e=c[d],f=e.getSnapshot;e=e.value;try{if(!He(f(),e))return!1}catch(g){return!1}}}c=b.child;if(b.subtreeFlags&16384&&null!==c)c.return=b,b=c;else{if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return!0;b=b.return}b.sibling.return=b.return;b=b.sibling}}return!0}
function Ck(a,b){b&=~rk;b&=~qk;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-oc(b),d=1<<c;a[c]=-1;b&=~d}}function Ek(a){if(0!==(K&6))throw Error(p(327));Hk();var b=uc(a,0);if(0===(b&1))return Dk(a,B()),null;var c=Ik(a,b);if(0!==a.tag&&2===c){var d=xc(a);0!==d&&(b=d,c=Nk(a,d))}if(1===c)throw c=pk,Kk(a,0),Ck(a,b),Dk(a,B()),c;if(6===c)throw Error(p(345));a.finishedWork=a.current.alternate;a.finishedLanes=b;Pk(a,tk,uk);Dk(a,B());return null}
function Qk(a,b){var c=K;K|=1;try{return a(b)}finally{K=c,0===K&&(Gj=B()+500,fg&&jg())}}function Rk(a){null!==wk&&0===wk.tag&&0===(K&6)&&Hk();var b=K;K|=1;var c=ok.transition,d=C;try{if(ok.transition=null,C=1,a)return a()}finally{C=d,ok.transition=c,K=b,0===(K&6)&&jg()}}function Hj(){fj=ej.current;E(ej)}
function Kk(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,Gf(c));if(null!==Y)for(c=Y.return;null!==c;){var d=c;wg(d);switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&$f();break;case 3:zh();E(Wf);E(H);Eh();break;case 5:Bh(d);break;case 4:zh();break;case 13:E(L);break;case 19:E(L);break;case 10:ah(d.type._context);break;case 22:case 23:Hj()}c=c.return}Q=a;Y=a=Pg(a.current,null);Z=fj=b;T=0;pk=null;rk=qk=rh=0;tk=sk=null;if(null!==fh){for(b=
0;b<fh.length;b++)if(c=fh[b],d=c.interleaved,null!==d){c.interleaved=null;var e=d.next,f=c.pending;if(null!==f){var g=f.next;f.next=e;d.next=g}c.pending=d}fh=null}return a}
function Mk(a,b){do{var c=Y;try{$g();Fh.current=Rh;if(Ih){for(var d=M.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next}Ih=!1}Hh=0;O=N=M=null;Jh=!1;Kh=0;nk.current=null;if(null===c||null===c.return){T=1;pk=b;Y=null;break}a:{var f=a,g=c.return,h=c,k=b;b=Z;h.flags|=32768;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k,m=h,q=m.tag;if(0===(m.mode&1)&&(0===q||11===q||15===q)){var r=m.alternate;r?(m.updateQueue=r.updateQueue,m.memoizedState=r.memoizedState,
m.lanes=r.lanes):(m.updateQueue=null,m.memoizedState=null)}var y=Ui(g);if(null!==y){y.flags&=-257;Vi(y,g,h,f,b);y.mode&1&&Si(f,l,b);b=y;k=l;var n=b.updateQueue;if(null===n){var t=new Set;t.add(k);b.updateQueue=t}else n.add(k);break a}else{if(0===(b&1)){Si(f,l,b);tj();break a}k=Error(p(426))}}else if(I&&h.mode&1){var J=Ui(g);if(null!==J){0===(J.flags&65536)&&(J.flags|=256);Vi(J,g,h,f,b);Jg(Ji(k,h));break a}}f=k=Ji(k,h);4!==T&&(T=2);null===sk?sk=[f]:sk.push(f);f=g;do{switch(f.tag){case 3:f.flags|=65536;
b&=-b;f.lanes|=b;var x=Ni(f,k,b);ph(f,x);break a;case 1:h=k;var w=f.type,u=f.stateNode;if(0===(f.flags&128)&&("function"===typeof w.getDerivedStateFromError||null!==u&&"function"===typeof u.componentDidCatch&&(null===Ri||!Ri.has(u)))){f.flags|=65536;b&=-b;f.lanes|=b;var F=Qi(f,h,b);ph(f,F);break a}}f=f.return}while(null!==f)}Sk(c)}catch(na){b=na;Y===c&&null!==c&&(Y=c=c.return);continue}break}while(1)}function Jk(){var a=mk.current;mk.current=Rh;return null===a?Rh:a}
function tj(){if(0===T||3===T||2===T)T=4;null===Q||0===(rh&268435455)&&0===(qk&268435455)||Ck(Q,Z)}function Ik(a,b){var c=K;K|=2;var d=Jk();if(Q!==a||Z!==b)uk=null,Kk(a,b);do try{Tk();break}catch(e){Mk(a,e)}while(1);$g();K=c;mk.current=d;if(null!==Y)throw Error(p(261));Q=null;Z=0;return T}function Tk(){for(;null!==Y;)Uk(Y)}function Lk(){for(;null!==Y&&!cc();)Uk(Y)}function Uk(a){var b=Vk(a.alternate,a,fj);a.memoizedProps=a.pendingProps;null===b?Sk(a):Y=b;nk.current=null}
function Sk(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&32768)){if(c=Ej(c,b,fj),null!==c){Y=c;return}}else{c=Ij(c,b);if(null!==c){c.flags&=32767;Y=c;return}if(null!==a)a.flags|=32768,a.subtreeFlags=0,a.deletions=null;else{T=6;Y=null;return}}b=b.sibling;if(null!==b){Y=b;return}Y=b=a}while(null!==b);0===T&&(T=5)}function Pk(a,b,c){var d=C,e=ok.transition;try{ok.transition=null,C=1,Wk(a,b,c,d)}finally{ok.transition=e,C=d}return null}
function Wk(a,b,c,d){do Hk();while(null!==wk);if(0!==(K&6))throw Error(p(327));c=a.finishedWork;var e=a.finishedLanes;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(p(177));a.callbackNode=null;a.callbackPriority=0;var f=c.lanes|c.childLanes;Bc(a,f);a===Q&&(Y=Q=null,Z=0);0===(c.subtreeFlags&2064)&&0===(c.flags&2064)||vk||(vk=!0,Fk(hc,function(){Hk();return null}));f=0!==(c.flags&15990);if(0!==(c.subtreeFlags&15990)||f){f=ok.transition;ok.transition=null;
var g=C;C=1;var h=K;K|=4;nk.current=null;Oj(a,c);dk(c,a);Oe(Df);dd=!!Cf;Df=Cf=null;a.current=c;hk(c,a,e);dc();K=h;C=g;ok.transition=f}else a.current=c;vk&&(vk=!1,wk=a,xk=e);f=a.pendingLanes;0===f&&(Ri=null);mc(c.stateNode,d);Dk(a,B());if(null!==b)for(d=a.onRecoverableError,c=0;c<b.length;c++)e=b[c],d(e.value,{componentStack:e.stack,digest:e.digest});if(Oi)throw Oi=!1,a=Pi,Pi=null,a;0!==(xk&1)&&0!==a.tag&&Hk();f=a.pendingLanes;0!==(f&1)?a===zk?yk++:(yk=0,zk=a):yk=0;jg();return null}
function Hk(){if(null!==wk){var a=Dc(xk),b=ok.transition,c=C;try{ok.transition=null;C=16>a?16:a;if(null===wk)var d=!1;else{a=wk;wk=null;xk=0;if(0!==(K&6))throw Error(p(331));var e=K;K|=4;for(V=a.current;null!==V;){var f=V,g=f.child;if(0!==(V.flags&16)){var h=f.deletions;if(null!==h){for(var k=0;k<h.length;k++){var l=h[k];for(V=l;null!==V;){var m=V;switch(m.tag){case 0:case 11:case 15:Pj(8,m,f)}var q=m.child;if(null!==q)q.return=m,V=q;else for(;null!==V;){m=V;var r=m.sibling,y=m.return;Sj(m);if(m===
l){V=null;break}if(null!==r){r.return=y;V=r;break}V=y}}}var n=f.alternate;if(null!==n){var t=n.child;if(null!==t){n.child=null;do{var J=t.sibling;t.sibling=null;t=J}while(null!==t)}}V=f}}if(0!==(f.subtreeFlags&2064)&&null!==g)g.return=f,V=g;else b:for(;null!==V;){f=V;if(0!==(f.flags&2048))switch(f.tag){case 0:case 11:case 15:Pj(9,f,f.return)}var x=f.sibling;if(null!==x){x.return=f.return;V=x;break b}V=f.return}}var w=a.current;for(V=w;null!==V;){g=V;var u=g.child;if(0!==(g.subtreeFlags&2064)&&null!==
u)u.return=g,V=u;else b:for(g=w;null!==V;){h=V;if(0!==(h.flags&2048))try{switch(h.tag){case 0:case 11:case 15:Qj(9,h)}}catch(na){W(h,h.return,na)}if(h===g){V=null;break b}var F=h.sibling;if(null!==F){F.return=h.return;V=F;break b}V=h.return}}K=e;jg();if(lc&&"function"===typeof lc.onPostCommitFiberRoot)try{lc.onPostCommitFiberRoot(kc,a)}catch(na){}d=!0}return d}finally{C=c,ok.transition=b}}return!1}function Xk(a,b,c){b=Ji(c,b);b=Ni(a,b,1);a=nh(a,b,1);b=R();null!==a&&(Ac(a,1,b),Dk(a,b))}
function W(a,b,c){if(3===a.tag)Xk(a,a,c);else for(;null!==b;){if(3===b.tag){Xk(b,a,c);break}else if(1===b.tag){var d=b.stateNode;if("function"===typeof b.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ri||!Ri.has(d))){a=Ji(c,a);a=Qi(b,a,1);b=nh(b,a,1);a=R();null!==b&&(Ac(b,1,a),Dk(b,a));break}}b=b.return}}
function Ti(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=R();a.pingedLanes|=a.suspendedLanes&c;Q===a&&(Z&c)===c&&(4===T||3===T&&(Z&130023424)===Z&&500>B()-fk?Kk(a,0):rk|=c);Dk(a,b)}function Yk(a,b){0===b&&(0===(a.mode&1)?b=1:(b=sc,sc<<=1,0===(sc&130023424)&&(sc=4194304)));var c=R();a=ih(a,b);null!==a&&(Ac(a,b,c),Dk(a,c))}function uj(a){var b=a.memoizedState,c=0;null!==b&&(c=b.retryLane);Yk(a,c)}
function bk(a,b){var c=0;switch(a.tag){case 13:var d=a.stateNode;var e=a.memoizedState;null!==e&&(c=e.retryLane);break;case 19:d=a.stateNode;break;default:throw Error(p(314));}null!==d&&d.delete(b);Yk(a,c)}var Vk;
Vk=function(a,b,c){if(null!==a)if(a.memoizedProps!==b.pendingProps||Wf.current)dh=!0;else{if(0===(a.lanes&c)&&0===(b.flags&128))return dh=!1,yj(a,b,c);dh=0!==(a.flags&131072)?!0:!1}else dh=!1,I&&0!==(b.flags&1048576)&&ug(b,ng,b.index);b.lanes=0;switch(b.tag){case 2:var d=b.type;ij(a,b);a=b.pendingProps;var e=Yf(b,H.current);ch(b,c);e=Nh(null,b,d,a,e,c);var f=Sh();b.flags|=1;"object"===typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof?(b.tag=1,b.memoizedState=null,b.updateQueue=
null,Zf(d)?(f=!0,cg(b)):f=!1,b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null,kh(b),e.updater=Ei,b.stateNode=e,e._reactInternals=b,Ii(b,d,a,c),b=jj(null,b,d,!0,f,c)):(b.tag=0,I&&f&&vg(b),Xi(null,b,e,c),b=b.child);return b;case 16:d=b.elementType;a:{ij(a,b);a=b.pendingProps;e=d._init;d=e(d._payload);b.type=d;e=b.tag=Zk(d);a=Ci(d,a);switch(e){case 0:b=cj(null,b,d,a,c);break a;case 1:b=hj(null,b,d,a,c);break a;case 11:b=Yi(null,b,d,a,c);break a;case 14:b=$i(null,b,d,Ci(d.type,a),c);break a}throw Error(p(306,
d,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),cj(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),hj(a,b,d,e,c);case 3:a:{kj(b);if(null===a)throw Error(p(387));d=b.pendingProps;f=b.memoizedState;e=f.element;lh(a,b);qh(b,d,null,c);var g=b.memoizedState;d=g.element;if(f.isDehydrated)if(f={element:d,isDehydrated:!1,cache:g.cache,pendingSuspenseBoundaries:g.pendingSuspenseBoundaries,transitions:g.transitions},b.updateQueue.baseState=
f,b.memoizedState=f,b.flags&256){e=Ji(Error(p(423)),b);b=lj(a,b,d,c,e);break a}else if(d!==e){e=Ji(Error(p(424)),b);b=lj(a,b,d,c,e);break a}else for(yg=Lf(b.stateNode.containerInfo.firstChild),xg=b,I=!0,zg=null,c=Vg(b,null,d,c),b.child=c;c;)c.flags=c.flags&-3|4096,c=c.sibling;else{Ig();if(d===e){b=Zi(a,b,c);break a}Xi(a,b,d,c)}b=b.child}return b;case 5:return Ah(b),null===a&&Eg(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,Ef(d,e)?g=null:null!==f&&Ef(d,f)&&(b.flags|=32),
gj(a,b),Xi(a,b,g,c),b.child;case 6:return null===a&&Eg(b),null;case 13:return oj(a,b,c);case 4:return yh(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Ug(b,null,d,c):Xi(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),Yi(a,b,d,e,c);case 7:return Xi(a,b,b.pendingProps,c),b.child;case 8:return Xi(a,b,b.pendingProps.children,c),b.child;case 12:return Xi(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;f=b.memoizedProps;
g=e.value;G(Wg,d._currentValue);d._currentValue=g;if(null!==f)if(He(f.value,g)){if(f.children===e.children&&!Wf.current){b=Zi(a,b,c);break a}}else for(f=b.child,null!==f&&(f.return=b);null!==f;){var h=f.dependencies;if(null!==h){g=f.child;for(var k=h.firstContext;null!==k;){if(k.context===d){if(1===f.tag){k=mh(-1,c&-c);k.tag=2;var l=f.updateQueue;if(null!==l){l=l.shared;var m=l.pending;null===m?k.next=k:(k.next=m.next,m.next=k);l.pending=k}}f.lanes|=c;k=f.alternate;null!==k&&(k.lanes|=c);bh(f.return,
c,b);h.lanes|=c;break}k=k.next}}else if(10===f.tag)g=f.type===b.type?null:f.child;else if(18===f.tag){g=f.return;if(null===g)throw Error(p(341));g.lanes|=c;h=g.alternate;null!==h&&(h.lanes|=c);bh(g,c,b);g=f.sibling}else g=f.child;if(null!==g)g.return=f;else for(g=f;null!==g;){if(g===b){g=null;break}f=g.sibling;if(null!==f){f.return=g.return;g=f;break}g=g.return}f=g}Xi(a,b,e.children,c);b=b.child}return b;case 9:return e=b.type,d=b.pendingProps.children,ch(b,c),e=eh(e),d=d(e),b.flags|=1,Xi(a,b,d,c),
b.child;case 14:return d=b.type,e=Ci(d,b.pendingProps),e=Ci(d.type,e),$i(a,b,d,e,c);case 15:return bj(a,b,b.type,b.pendingProps,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),ij(a,b),b.tag=1,Zf(d)?(a=!0,cg(b)):a=!1,ch(b,c),Gi(b,d,e),Ii(b,d,e,c),jj(null,b,d,!0,a,c);case 19:return xj(a,b,c);case 22:return dj(a,b,c)}throw Error(p(156,b.tag));};function Fk(a,b){return ac(a,b)}
function $k(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.subtreeFlags=this.flags=0;this.deletions=null;this.childLanes=this.lanes=0;this.alternate=null}function Bg(a,b,c,d){return new $k(a,b,c,d)}function aj(a){a=a.prototype;return!(!a||!a.isReactComponent)}
function Zk(a){if("function"===typeof a)return aj(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Da)return 11;if(a===Ga)return 14}return 2}
function Pg(a,b){var c=a.alternate;null===c?(c=Bg(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.subtreeFlags=0,c.deletions=null);c.flags=a.flags&14680064;c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
function Rg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)aj(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ya:return Tg(c.children,e,f,b);case za:g=8;e|=8;break;case Aa:return a=Bg(12,c,b,e|2),a.elementType=Aa,a.lanes=f,a;case Ea:return a=Bg(13,c,b,e),a.elementType=Ea,a.lanes=f,a;case Fa:return a=Bg(19,c,b,e),a.elementType=Fa,a.lanes=f,a;case Ia:return pj(c,e,f,b);default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case Ba:g=10;break a;case Ca:g=9;break a;case Da:g=11;
break a;case Ga:g=14;break a;case Ha:g=16;d=null;break a}throw Error(p(130,null==a?a:typeof a,""));}b=Bg(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Tg(a,b,c,d){a=Bg(7,a,d,b);a.lanes=c;return a}function pj(a,b,c,d){a=Bg(22,a,d,b);a.elementType=Ia;a.lanes=c;a.stateNode={isHidden:!1};return a}function Qg(a,b,c){a=Bg(6,a,null,b);a.lanes=c;return a}
function Sg(a,b,c){b=Bg(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function al(a,b,c,d,e){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.callbackNode=this.pendingContext=this.context=null;this.callbackPriority=0;this.eventTimes=zc(0);this.expirationTimes=zc(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=zc(0);this.identifierPrefix=d;this.onRecoverableError=e;this.mutableSourceEagerHydrationData=
null}function bl(a,b,c,d,e,f,g,h,k){a=new al(a,b,c,h,k);1===b?(b=1,!0===f&&(b|=8)):b=0;f=Bg(3,null,null,b);a.current=f;f.stateNode=a;f.memoizedState={element:d,isDehydrated:c,cache:null,transitions:null,pendingSuspenseBoundaries:null};kh(f);return a}function cl(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:wa,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
function dl(a){if(!a)return Vf;a=a._reactInternals;a:{if(Vb(a)!==a||1!==a.tag)throw Error(p(170));var b=a;do{switch(b.tag){case 3:b=b.stateNode.context;break a;case 1:if(Zf(b.type)){b=b.stateNode.__reactInternalMemoizedMergedChildContext;break a}}b=b.return}while(null!==b);throw Error(p(171));}if(1===a.tag){var c=a.type;if(Zf(c))return bg(a,c,b)}return b}
function el(a,b,c,d,e,f,g,h,k){a=bl(c,d,!0,a,e,f,g,h,k);a.context=dl(null);c=a.current;d=R();e=yi(c);f=mh(d,e);f.callback=void 0!==b&&null!==b?b:null;nh(c,f,e);a.current.lanes=e;Ac(a,e,d);Dk(a,d);return a}function fl(a,b,c,d){var e=b.current,f=R(),g=yi(e);c=dl(c);null===b.context?b.context=c:b.pendingContext=c;b=mh(f,g);b.payload={element:a};d=void 0===d?null:d;null!==d&&(b.callback=d);a=nh(e,b,g);null!==a&&(gi(a,e,g,f),oh(a,e,g));return g}
function gl(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function hl(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b}}function il(a,b){hl(a,b);(a=a.alternate)&&hl(a,b)}function jl(){return null}var kl="function"===typeof reportError?reportError:function(a){console.error(a)};function ll(a){this._internalRoot=a}
ml.prototype.render=ll.prototype.render=function(a){var b=this._internalRoot;if(null===b)throw Error(p(409));fl(a,b,null,null)};ml.prototype.unmount=ll.prototype.unmount=function(){var a=this._internalRoot;if(null!==a){this._internalRoot=null;var b=a.containerInfo;Rk(function(){fl(null,a,null,null)});b[uf]=null}};function ml(a){this._internalRoot=a}
ml.prototype.unstable_scheduleHydration=function(a){if(a){var b=Hc();a={blockedOn:null,target:a,priority:b};for(var c=0;c<Qc.length&&0!==b&&b<Qc[c].priority;c++);Qc.splice(c,0,a);0===c&&Vc(a)}};function nl(a){return!(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType)}function ol(a){return!(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}function pl(){}
function ql(a,b,c,d,e){if(e){if("function"===typeof d){var f=d;d=function(){var a=gl(g);f.call(a)}}var g=el(b,d,a,0,null,!1,!1,"",pl);a._reactRootContainer=g;a[uf]=g.current;sf(8===a.nodeType?a.parentNode:a);Rk();return g}for(;e=a.lastChild;)a.removeChild(e);if("function"===typeof d){var h=d;d=function(){var a=gl(k);h.call(a)}}var k=bl(a,0,!1,null,null,!1,!1,"",pl);a._reactRootContainer=k;a[uf]=k.current;sf(8===a.nodeType?a.parentNode:a);Rk(function(){fl(b,k,c,d)});return k}
function rl(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f;if("function"===typeof e){var h=e;e=function(){var a=gl(g);h.call(a)}}fl(b,g,a,e)}else g=ql(c,b,a,e,d);return gl(g)}Ec=function(a){switch(a.tag){case 3:var b=a.stateNode;if(b.current.memoizedState.isDehydrated){var c=tc(b.pendingLanes);0!==c&&(Cc(b,c|1),Dk(b,B()),0===(K&6)&&(Gj=B()+500,jg()))}break;case 13:Rk(function(){var b=ih(a,1);if(null!==b){var c=R();gi(b,a,1,c)}}),il(a,1)}};
Fc=function(a){if(13===a.tag){var b=ih(a,134217728);if(null!==b){var c=R();gi(b,a,134217728,c)}il(a,134217728)}};Gc=function(a){if(13===a.tag){var b=yi(a),c=ih(a,b);if(null!==c){var d=R();gi(c,a,b,d)}il(a,b)}};Hc=function(){return C};Ic=function(a,b){var c=C;try{return C=a,b()}finally{C=c}};
yb=function(a,b,c){switch(b){case "input":bb(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(p(90));Wa(d);bb(d,e)}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,!1)}};Gb=Qk;Hb=Rk;
var sl={usingClientEntryPoint:!1,Events:[Cb,ue,Db,Eb,Fb,Qk]},tl={findFiberByHostInstance:Wc,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"};
var ul={bundleType:tl.bundleType,version:tl.version,rendererPackageName:tl.rendererPackageName,rendererConfig:tl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ua.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=Zb(a);return null===a?null:a.stateNode},findFiberByHostInstance:tl.findFiberByHostInstance||
jl,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var vl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!vl.isDisabled&&vl.supportsFiber)try{kc=vl.inject(ul),lc=vl}catch(a){}}exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sl;
exports.createPortal=function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!nl(b))throw Error(p(200));return cl(a,b,null,c)};exports.createRoot=function(a,b){if(!nl(a))throw Error(p(299));var c=!1,d="",e=kl;null!==b&&void 0!==b&&(!0===b.unstable_strictMode&&(c=!0),void 0!==b.identifierPrefix&&(d=b.identifierPrefix),void 0!==b.onRecoverableError&&(e=b.onRecoverableError));b=bl(a,1,!1,null,null,c,!1,d,e);a[uf]=b.current;sf(8===a.nodeType?a.parentNode:a);return new ll(b)};
exports.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(p(188));a=Object.keys(a).join(",");throw Error(p(268,a));}a=Zb(b);a=null===a?null:a.stateNode;return a};exports.flushSync=function(a){return Rk(a)};exports.hydrate=function(a,b,c){if(!ol(b))throw Error(p(200));return rl(null,a,b,!0,c)};
exports.hydrateRoot=function(a,b,c){if(!nl(a))throw Error(p(405));var d=null!=c&&c.hydratedSources||null,e=!1,f="",g=kl;null!==c&&void 0!==c&&(!0===c.unstable_strictMode&&(e=!0),void 0!==c.identifierPrefix&&(f=c.identifierPrefix),void 0!==c.onRecoverableError&&(g=c.onRecoverableError));b=el(b,null,a,1,null!=c?c:null,e,!1,f,g);a[uf]=b.current;sf(a);if(d)for(a=0;a<d.length;a++)c=d[a],e=c._getVersion,e=e(c._source),null==b.mutableSourceEagerHydrationData?b.mutableSourceEagerHydrationData=[c,e]:b.mutableSourceEagerHydrationData.push(c,
e);return new ml(b)};exports.render=function(a,b,c){if(!ol(b))throw Error(p(200));return rl(null,a,b,!1,c)};exports.unmountComponentAtNode=function(a){if(!ol(a))throw Error(p(40));return a._reactRootContainer?(Rk(function(){rl(null,null,a,!1,function(){a._reactRootContainer=null;a[uf]=null})}),!0):!1};exports.unstable_batchedUpdates=Qk;
exports.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!ol(c))throw Error(p(200));if(null==a||void 0===a._reactInternals)throw Error(p(38));return rl(a,b,c,!1,d)};exports.version="18.3.1-next-f1338f8080-20240426";


},
9576(__unused_rspack_module, exports, __webpack_require__) {
"use strict";
var __webpack_unused_export__;


var m = __webpack_require__(8143);
if (true) {
  exports.createRoot = m.createRoot;
  __webpack_unused_export__ = m.hydrateRoot;
} else { var i }


},
8143(module, __unused_rspack_exports, __webpack_require__) {
"use strict";


function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (false) {}
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (true) {
  // DCE check should happen before ReactDOM bundle executes so that
  // DevTools can report bad minification during injection.
  checkDCE();
  module.exports = __webpack_require__(9481);
} else {}


},
7462(__unused_rspack_module, exports, __webpack_require__) {
"use strict";
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=__webpack_require__(758),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};
function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l;exports.jsx=q;exports.jsxs=q;


},
2713(__unused_rspack_module, exports) {
"use strict";
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l=Symbol.for("react.element"),n=Symbol.for("react.portal"),p=Symbol.for("react.fragment"),q=Symbol.for("react.strict_mode"),r=Symbol.for("react.profiler"),t=Symbol.for("react.provider"),u=Symbol.for("react.context"),v=Symbol.for("react.forward_ref"),w=Symbol.for("react.suspense"),x=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),z=Symbol.iterator;function A(a){if(null===a||"object"!==typeof a)return null;a=z&&a[z]||a["@@iterator"];return"function"===typeof a?a:null}
var B={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,D={};function E(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B}E.prototype.isReactComponent={};
E.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,b,"setState")};E.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};function F(){}F.prototype=E.prototype;function G(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B}var H=G.prototype=new F;
H.constructor=G;C(H,E.prototype);H.isPureReactComponent=!0;var I=Array.isArray,J=Object.prototype.hasOwnProperty,K={current:null},L={key:!0,ref:!0,__self:!0,__source:!0};
function M(a,b,e){var d,c={},k=null,h=null;if(null!=b)for(d in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)J.call(b,d)&&!L.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(1===g)c.children=e;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];c.children=f}if(a&&a.defaultProps)for(d in g=a.defaultProps,g)void 0===c[d]&&(c[d]=g[d]);return{$$typeof:l,type:a,key:k,ref:h,props:c,_owner:K.current}}
function N(a,b){return{$$typeof:l,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function O(a){return"object"===typeof a&&null!==a&&a.$$typeof===l}function escape(a){var b={"=":"=0",":":"=2"};return"$"+a.replace(/[=:]/g,function(a){return b[a]})}var P=/\/+/g;function Q(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function R(a,b,e,d,c){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case l:case n:h=!0}}if(h)return h=a,c=c(h),a=""===d?"."+Q(h,0):d,I(c)?(e="",null!=a&&(e=a.replace(P,"$&/")+"/"),R(c,b,e,"",function(a){return a})):null!=c&&(O(c)&&(c=N(c,e+(!c.key||h&&h.key===c.key?"":(""+c.key).replace(P,"$&/")+"/")+a)),b.push(c)),1;h=0;d=""===d?".":d+":";if(I(a))for(var g=0;g<a.length;g++){k=
a[g];var f=d+Q(k,g);h+=R(k,b,e,f,c)}else if(f=A(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=d+Q(k,g++),h+=R(k,b,e,f,c);else if("object"===k)throw b=String(a),Error("Objects are not valid as a React child (found: "+("[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}
function S(a,b,e){if(null==a)return a;var d=[],c=0;R(a,d,"","",function(a){return b.call(e,a,c++)});return d}function T(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b});-1===a._status&&(a._status=0,a._result=b)}if(1===a._status)return a._result.default;throw a._result;}
var U={current:null},V={transition:null},W={ReactCurrentDispatcher:U,ReactCurrentBatchConfig:V,ReactCurrentOwner:K};function X(){throw Error("act(...) is not supported in production builds of React.");}
exports.Children={map:S,forEach:function(a,b,e){S(a,function(){b.apply(this,arguments)},e)},count:function(a){var b=0;S(a,function(){b++});return b},toArray:function(a){return S(a,function(a){return a})||[]},only:function(a){if(!O(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};exports.Component=E;exports.Fragment=p;exports.Profiler=r;exports.PureComponent=G;exports.StrictMode=q;exports.Suspense=w;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W;exports.act=X;
exports.cloneElement=function(a,b,e){if(null===a||void 0===a)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var d=C({},a.props),c=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=K.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)J.call(b,f)&&!L.hasOwnProperty(f)&&(d[f]=void 0===b[f]&&void 0!==g?g[f]:b[f])}var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){g=Array(f);
for(var m=0;m<f;m++)g[m]=arguments[m+2];d.children=g}return{$$typeof:l,type:a.type,key:c,ref:k,props:d,_owner:h}};exports.createContext=function(a){a={$$typeof:u,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};a.Provider={$$typeof:t,_context:a};return a.Consumer=a};exports.createElement=M;exports.createFactory=function(a){var b=M.bind(null,a);b.type=a;return b};exports.createRef=function(){return{current:null}};
exports.forwardRef=function(a){return{$$typeof:v,render:a}};exports.isValidElement=O;exports.lazy=function(a){return{$$typeof:y,_payload:{_status:-1,_result:a},_init:T}};exports.memo=function(a,b){return{$$typeof:x,type:a,compare:void 0===b?null:b}};exports.startTransition=function(a){var b=V.transition;V.transition={};try{a()}finally{V.transition=b}};exports.unstable_act=X;exports.useCallback=function(a,b){return U.current.useCallback(a,b)};exports.useContext=function(a){return U.current.useContext(a)};
exports.useDebugValue=function(){};exports.useDeferredValue=function(a){return U.current.useDeferredValue(a)};exports.useEffect=function(a,b){return U.current.useEffect(a,b)};exports.useId=function(){return U.current.useId()};exports.useImperativeHandle=function(a,b,e){return U.current.useImperativeHandle(a,b,e)};exports.useInsertionEffect=function(a,b){return U.current.useInsertionEffect(a,b)};exports.useLayoutEffect=function(a,b){return U.current.useLayoutEffect(a,b)};
exports.useMemo=function(a,b){return U.current.useMemo(a,b)};exports.useReducer=function(a,b,e){return U.current.useReducer(a,b,e)};exports.useRef=function(a){return U.current.useRef(a)};exports.useState=function(a){return U.current.useState(a)};exports.useSyncExternalStore=function(a,b,e){return U.current.useSyncExternalStore(a,b,e)};exports.useTransition=function(){return U.current.useTransition()};exports.version="18.3.1";


},
758(module, __unused_rspack_exports, __webpack_require__) {
"use strict";


if (true) {
  module.exports = __webpack_require__(2713);
} else {}


},
6070(module, __unused_rspack_exports, __webpack_require__) {
"use strict";


if (true) {
  module.exports = __webpack_require__(7462);
} else {}


},
4733(__unused_rspack_module, exports) {
"use strict";
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function f(a,b){var c=a.length;a.push(b);a:for(;0<c;){var d=c-1>>>1,e=a[d];if(0<g(e,b))a[d]=b,a[c]=e,c=d;else break a}}function h(a){return 0===a.length?null:a[0]}function k(a){if(0===a.length)return null;var b=a[0],c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length,w=e>>>1;d<w;){var m=2*(d+1)-1,C=a[m],n=m+1,x=a[n];if(0>g(C,c))n<e&&0>g(x,C)?(a[d]=x,a[n]=c,d=n):(a[d]=C,a[m]=c,d=m);else if(n<e&&0>g(x,c))a[d]=x,a[n]=c,d=n;else break a}}return b}
function g(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()}}else{var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q}}var r=[],t=[],u=1,v=null,y=3,z=!1,A=!1,B=!1,D="function"===typeof setTimeout?setTimeout:null,E="function"===typeof clearTimeout?clearTimeout:null,F="undefined"!==typeof setImmediate?setImmediate:null;
"undefined"!==typeof navigator&&void 0!==navigator.scheduling&&void 0!==navigator.scheduling.isInputPending&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function G(a){for(var b=h(t);null!==b;){if(null===b.callback)k(t);else if(b.startTime<=a)k(t),b.sortIndex=b.expirationTime,f(r,b);else break;b=h(t)}}function H(a){B=!1;G(a);if(!A)if(null!==h(r))A=!0,I(J);else{var b=h(t);null!==b&&K(H,b.startTime-a)}}
function J(a,b){A=!1;B&&(B=!1,E(L),L=-1);z=!0;var c=y;try{G(b);for(v=h(r);null!==v&&(!(v.expirationTime>b)||a&&!M());){var d=v.callback;if("function"===typeof d){v.callback=null;y=v.priorityLevel;var e=d(v.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?v.callback=e:v===h(r)&&k(r);G(b)}else k(r);v=h(r)}if(null!==v)var w=!0;else{var m=h(t);null!==m&&K(H,m.startTime-b);w=!1}return w}finally{v=null,y=c,z=!1}}var N=!1,O=null,L=-1,P=5,Q=-1;
function M(){return exports.unstable_now()-Q<P?!1:!0}function R(){if(null!==O){var a=exports.unstable_now();Q=a;var b=!0;try{b=O(!0,a)}finally{b?S():(N=!1,O=null)}}else N=!1}var S;if("function"===typeof F)S=function(){F(R)};else if("undefined"!==typeof MessageChannel){var T=new MessageChannel,U=T.port2;T.port1.onmessage=R;S=function(){U.postMessage(null)}}else S=function(){D(R,0)};function I(a){O=a;N||(N=!0,S())}function K(a,b){L=D(function(){a(exports.unstable_now())},b)}
exports.unstable_IdlePriority=5;exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null};exports.unstable_continueExecution=function(){A||z||(A=!0,I(J))};
exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<a?Math.floor(1E3/a):5};exports.unstable_getCurrentPriorityLevel=function(){return y};exports.unstable_getFirstCallbackNode=function(){return h(r)};exports.unstable_next=function(a){switch(y){case 1:case 2:case 3:var b=3;break;default:b=y}var c=y;y=b;try{return a()}finally{y=c}};exports.unstable_pauseExecution=function(){};
exports.unstable_requestPaint=function(){};exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=y;y=a;try{return b()}finally{y=c}};
exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3}e=c+e;a={id:u++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,f(t,a),null===h(r)&&a===h(t)&&(B?(E(L),L=-1):B=!0,K(H,c-d))):(a.sortIndex=e,f(r,a),A||z||(A=!0,I(J)));return a};
exports.unstable_shouldYield=M;exports.unstable_wrapCallback=function(a){var b=y;return function(){var c=y;y=b;try{return a.apply(this,arguments)}finally{y=c}}};


},
1896(module, __unused_rspack_exports, __webpack_require__) {
"use strict";


if (true) {
  module.exports = __webpack_require__(4733);
} else {}


},
4125(module, exports) {
/////////////////////////////////////////////////////////////////////////////////
/* UAParser.js v1.0.40
   Copyright © 2012-2024 Faisal Salman <f@faisalman.com>
   MIT License *//*
   Detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data.
   Supports browser & node.js environment. 
   Demo   : https://faisalman.github.io/ua-parser-js
   Source : https://github.com/faisalman/ua-parser-js */
/////////////////////////////////////////////////////////////////////////////////

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '1.0.40',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major',
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded',
        UA_MAX_LENGTH = 500;

    var AMAZON  = 'Amazon',
        APPLE   = 'Apple',
        ASUS    = 'ASUS',
        BLACKBERRY = 'BlackBerry',
        BROWSER = 'Browser',
        CHROME  = 'Chrome',
        EDGE    = 'Edge',
        FIREFOX = 'Firefox',
        GOOGLE  = 'Google',
        HUAWEI  = 'Huawei',
        LG      = 'LG',
        MICROSOFT = 'Microsoft',
        MOTOROLA  = 'Motorola',
        OPERA   = 'Opera',
        SAMSUNG = 'Samsung',
        SHARP   = 'Sharp',
        SONY    = 'Sony',
        XIAOMI  = 'Xiaomi',
        ZEBRA   = 'Zebra',
        FACEBOOK    = 'Facebook',
        CHROMIUM_OS = 'Chromium OS',
        MAC_OS  = 'Mac OS',
        SUFFIX_BROWSER = ' Browser';

    ///////////
    // Helper
    //////////

    var extend = function (regexes, extensions) {
            var mergedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    mergedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    mergedRegexes[i] = regexes[i];
                }
            }
            return mergedRegexes;
        },
        enumerize = function (arr) {
            var enums = {};
            for (var i=0; i<arr.length; i++) {
                enums[arr[i].toUpperCase()] = arr[i];
            }
            return enums;
        },
        has = function (str1, str2) {
            return typeof str1 === STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
        },
        lowerize = function (str) {
            return str.toLowerCase();
        },
        majorize = function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g, EMPTY).split('.')[0] : undefined;
        },
        trim = function (str, len) {
            if (typeof(str) === STR_TYPE) {
                str = str.replace(/^\s\s*/, EMPTY);
                return typeof(len) === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
            }
    };

    ///////////////
    // Map helper
    //////////////

    var rgxMapper = function (ua, arrays) {

            var i = 0, j, k, p, q, matches, match;

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    if (!regex[j]) { break; }
                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length === 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length === 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length === 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
        },

        strMapper = function (str, map) {

            for (var i in map) {
                // check if current value is array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return map.hasOwnProperty('*') ? map['*'] : str;
    };

    ///////////////
    // String map
    //////////////

    // Safari < 3.0
    var oldSafariMap = {
            '1.0'   : '/8',
            '1.2'   : '/1',
            '1.3'   : '/3',
            '2.0'   : '/412',
            '2.0.2' : '/416',
            '2.0.3' : '/417',
            '2.0.4' : '/419',
            '?'     : '/'
        },
        windowsVersionMap = {
            'ME'        : '4.90',
            'NT 3.11'   : 'NT3.51',
            'NT 4.0'    : 'NT4.0',
            '2000'      : 'NT 5.0',
            'XP'        : ['NT 5.1', 'NT 5.2'],
            'Vista'     : 'NT 6.0',
            '7'         : 'NT 6.1',
            '8'         : 'NT 6.2',
            '8.1'       : 'NT 6.3',
            '10'        : ['NT 6.4', 'NT 10.0'],
            'RT'        : 'ARM'
    };

    //////////////
    // Regex map
    /////////////

    var regexes = {

        browser : [[

            /\b(?:crmo|crios)\/([\w\.]+)/i                                      // Chrome for Android/iOS
            ], [VERSION, [NAME, 'Chrome']], [
            /edg(?:e|ios|a)?\/([\w\.]+)/i                                       // Microsoft Edge
            ], [VERSION, [NAME, 'Edge']], [

            // Presto based
            /(opera mini)\/([-\w\.]+)/i,                                        // Opera Mini
            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,                 // Opera Mobi/Tablet
            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i                           // Opera
            ], [NAME, VERSION], [
            /opios[\/ ]+([\w\.]+)/i                                             // Opera mini on iphone >= 8.0
            ], [VERSION, [NAME, OPERA+' Mini']], [
            /\bop(?:rg)?x\/([\w\.]+)/i                                          // Opera GX
            ], [VERSION, [NAME, OPERA+' GX']], [
            /\bopr\/([\w\.]+)/i                                                 // Opera Webkit
            ], [VERSION, [NAME, OPERA]], [

            // Mixed
            /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i            // Baidu
            ], [VERSION, [NAME, 'Baidu']], [
            /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i                       // Maxthon
            ], [VERSION, [NAME, 'Maxthon']], [
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,      
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer/Sleipnir
            // Trident based
            /(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i,        // Avant/IEMobile/SlimBrowser/SlimBoat/Slimjet
            /(?:ms|\()(ie) ([\w\.]+)/i,                                         // Internet Explorer

            // Blink/Webkit/KHTML based                                         // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon)\/([-\w\.]+)/i,
                                                                                // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ//Vivaldi/DuckDuckGo/Klar/Helio/Dragon
            /(heytap|ovi|115)browser\/([\d\.]+)/i,                              // HeyTap/Ovi/115
            /(weibo)__([\d\.]+)/i                                               // Weibo
            ], [NAME, VERSION], [
            /quark(?:pc)?\/([-\w\.]+)/i                                         // Quark
            ], [VERSION, [NAME, 'Quark']], [
            /\bddg\/([\w\.]+)/i                                                 // DuckDuckGo
            ], [VERSION, [NAME, 'DuckDuckGo']], [
            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i                 // UCBrowser
            ], [VERSION, [NAME, 'UC'+BROWSER]], [
            /microm.+\bqbcore\/([\w\.]+)/i,                                     // WeChat Desktop for Windows Built-in Browser
            /\bqbcore\/([\w\.]+).+microm/i,
            /micromessenger\/([\w\.]+)/i                                        // WeChat
            ], [VERSION, [NAME, 'WeChat']], [
            /konqueror\/([\w\.]+)/i                                             // Konqueror
            ], [VERSION, [NAME, 'Konqueror']], [
            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i                       // IE11
            ], [VERSION, [NAME, 'IE']], [
            /ya(?:search)?browser\/([\w\.]+)/i                                  // Yandex
            ], [VERSION, [NAME, 'Yandex']], [
            /slbrowser\/([\w\.]+)/i                                             // Smart Lenovo Browser
            ], [VERSION, [NAME, 'Smart Lenovo '+BROWSER]], [
            /(avast|avg)\/([\w\.]+)/i                                           // Avast/AVG Secure Browser
            ], [[NAME, /(.+)/, '$1 Secure '+BROWSER], VERSION], [
            /\bfocus\/([\w\.]+)/i                                               // Firefox Focus
            ], [VERSION, [NAME, FIREFOX+' Focus']], [
            /\bopt\/([\w\.]+)/i                                                 // Opera Touch
            ], [VERSION, [NAME, OPERA+' Touch']], [
            /coc_coc\w+\/([\w\.]+)/i                                            // Coc Coc Browser
            ], [VERSION, [NAME, 'Coc Coc']], [
            /dolfin\/([\w\.]+)/i                                                // Dolphin
            ], [VERSION, [NAME, 'Dolphin']], [
            /coast\/([\w\.]+)/i                                                 // Opera Coast
            ], [VERSION, [NAME, OPERA+' Coast']], [
            /miuibrowser\/([\w\.]+)/i                                           // MIUI Browser
            ], [VERSION, [NAME, 'MIUI' + SUFFIX_BROWSER]], [
            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, FIREFOX]], [
            /\bqihoobrowser\/?([\w\.]*)/i                                       // 360
            ], [VERSION, [NAME, '360']], [
            /\b(qq)\/([\w\.]+)/i                                                // QQ
            ], [[NAME, /(.+)/, '$1Browser'], VERSION], [
            /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
            ], [[NAME, /(.+)/, '$1' + SUFFIX_BROWSER], VERSION], [              // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
            /samsungbrowser\/([\w\.]+)/i                                        // Samsung Internet
            ], [VERSION, [NAME, SAMSUNG + ' Internet']], [
            /metasr[\/ ]?([\d\.]+)/i                                            // Sogou Explorer
            ], [VERSION, [NAME, 'Sogou Explorer']], [
            /(sogou)mo\w+\/([\d\.]+)/i                                          // Sogou Mobile
            ], [[NAME, 'Sogou Mobile'], VERSION], [
            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
            /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i   // QQ/2345
            ], [NAME, VERSION], [
            /(lbbrowser|rekonq)/i,                                              // LieBao Browser/Rekonq
            /\[(linkedin)app\]/i                                                // LinkedIn App for iOS & Android
            ], [NAME], [
            /ome\/([\w\.]+) \w* ?(iron) saf/i,                                  // Iron
            /ome\/([\w\.]+).+qihu (360)[es]e/i                                  // 360
            ], [VERSION, NAME], [

            // WebView
            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
            ], [[NAME, FACEBOOK], VERSION], [
            /(Klarna)\/([\w\.]+)/i,                                             // Klarna Shopping Browser for iOS & Android
            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,                             // Kakao App
            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,                                  // Naver InApp
            /safari (line)\/([\w\.]+)/i,                                        // Line App for iOS
            /\b(line)\/([\w\.]+)\/iab/i,                                        // Line App for Android
            /(alipay)client\/([\w\.]+)/i,                                       // Alipay
            /(twitter)(?:and| f.+e\/([\w\.]+))/i,                               // Twitter
            /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i                     // Chromium/Instagram/Snapchat
            ], [NAME, VERSION], [
            /\bgsa\/([\w\.]+) .*safari\//i                                      // Google Search Appliance on iOS
            ], [VERSION, [NAME, 'GSA']], [
            /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i                        // TikTok
            ], [VERSION, [NAME, 'TikTok']], [

            /headlesschrome(?:\/([\w\.]+)| )/i                                  // Chrome Headless
            ], [VERSION, [NAME, CHROME+' Headless']], [

            / wv\).+(chrome)\/([\w\.]+)/i                                       // Chrome WebView
            ], [[NAME, CHROME+' WebView'], VERSION], [

            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i           // Android Browser
            ], [VERSION, [NAME, 'Android '+BROWSER]], [

            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i       // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i                      // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [
            /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i                // Safari & Safari Mobile
            ], [VERSION, NAME], [
            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i                      // Safari < 3.0
            ], [NAME, [VERSION, strMapper, oldSafariMap]], [

            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape\d?)\/([-\w\.]+)/i                              // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /(wolvic|librewolf)\/([\w\.]+)/i                                    // Wolvic/LibreWolf
            ], [NAME, VERSION], [
            /mobile vr; rv:([\w\.]+)\).+firefox/i                               // Firefox Reality
            ], [VERSION, [NAME, FIREFOX+' Reality']], [
            /ekiohf.+(flow)\/([\w\.]+)/i,                                       // Flow
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(firefox)\/([\w\.]+)/i,                                            // Other Firefox-based
            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,                         // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Obigo/Mosaic/Go/ICE/UP.Browser
            /(links) \(([\w\.]+)/i                                              // Links
            ], [NAME, [VERSION, /_/g, '.']], [
            
            /(cobalt)\/([\w\.]+)/i                                              // Cobalt
            ], [NAME, [VERSION, /master.|lts./, ""]]
        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i                     // AMD64 (x64)
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32 (x86)
            ], [[ARCHITECTURE, 'ia32']], [

            /\b(aarch64|arm(v?8e?l?|_?64))\b/i                                 // ARM64
            ], [[ARCHITECTURE, 'arm64']], [

            /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i                                   // ARMHF
            ], [[ARCHITECTURE, 'armhf']], [

            // PocketPC mistakenly identified as PowerPC
            /windows (ce|mobile); ppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i                            // PowerPC
            ], [[ARCHITECTURE, /ower/, EMPTY, lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, lowerize]]
        ],

        device : [[

            //////////////////////////
            // MOBILES & TABLETS
            /////////////////////////

            // Samsung
            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]], [
            /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
            /samsung[- ]((?!sm-[lr])[-\w]+)/i,
            /sec-(sgh\w+)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]], [

            // Apple
            /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i                          // iPod/iPhone
            ], [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]], [
            /\((ipad);[-\w\),; ]+apple/i,                                       // iPad
            /applecoremedia\/[\w\.]+ \((ipad)/i,
            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
            ], [MODEL, [VENDOR, APPLE], [TYPE, TABLET]], [
            /(macintosh);/i
            ], [MODEL, [VENDOR, APPLE]], [

            // Sharp
            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
            ], [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]], [

            // Honor
            /(?:honor)([-\w ]+)[;\)]/i
            ], [MODEL, [VENDOR, 'Honor'], [TYPE, MOBILE]], [

            // Huawei
            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [
            /(?:huawei)([-\w ]+)[;\)]/i,
            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [

            // Xiaomi
            /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,                  // Xiaomi POCO
            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
            /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,        // Xiaomi Redmi 'numeric' models
            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i // Xiaomi Mi
            ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, MOBILE]], [
            /oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,                     // Redmi Pad
            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i                        // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, TABLET]], [

            // OPPO
            /; (\w+) bui.+ oppo/i,
            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [
            /\b(opd2\d{3}a?) bui/i
            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, TABLET]], [

            // Vivo
            /vivo (\w+)(?: bui|\))/i,
            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
            ], [MODEL, [VENDOR, 'Vivo'], [TYPE, MOBILE]], [

            // Realme
            /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
            ], [MODEL, [VENDOR, 'Realme'], [TYPE, MOBILE]], [

            // Motorola
            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
            /\bmot(?:orola)?[- ](\w*)/i,
            /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]], [
            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]], [

            // LG
            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
            ], [MODEL, [VENDOR, LG], [TYPE, TABLET]], [
            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
            /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
            /\blg-?([\d\w]+) bui/i
            ], [MODEL, [VENDOR, LG], [TYPE, MOBILE]], [

            // Lenovo
            /(ideatab[-\w ]+)/i,
            /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            // Nokia
            /(?:maemo|nokia).*(n900|lumia \d+)/i,
            /nokia[-_ ]?([-\w\.]*)/i
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Nokia'], [TYPE, MOBILE]], [

            // Google
            /(pixel c)\b/i                                                      // Google Pixel C
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]], [
            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i                         // Google Pixel
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]], [

            // Sony
            /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
            ], [MODEL, [VENDOR, SONY], [TYPE, MOBILE]], [
            /sony tablet [ps]/i,
            /\b(?:sony)?sgp\w+(?: bui|\))/i
            ], [[MODEL, 'Xperia Tablet'], [VENDOR, SONY], [TYPE, TABLET]], [

            // OnePlus
            / (kb2005|in20[12]5|be20[12][59])\b/i,
            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            // Amazon
            /(alexa)webm/i,
            /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,                           // Kindle Fire without Silk / Echo Show
            /(kf[a-z]+)( bui|\)).+silk\//i                                      // Kindle Fire HD
            ], [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]], [
            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i                     // Fire Phone
            ], [[MODEL, /(.+)/g, 'Fire Phone $1'], [VENDOR, AMAZON], [TYPE, MOBILE]], [

            // BlackBerry
            /(playbook);[-\w\),; ]+(rim)/i                                      // BlackBerry PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [
            /\b((?:bb[a-f]|st[hv])100-\d)/i,
            /\(bb10; (\w+)/i                                                    // BlackBerry 10
            ], [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]], [

            // Asus
            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
            ], [MODEL, [VENDOR, ASUS], [TYPE, TABLET]], [
            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
            ], [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]], [

            // HTC
            /(nexus 9)/i                                                        // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [
            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,                         // HTC

            // ZTE
            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
            /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i         // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            // TCL
            /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])\w*(\)| bui)/i
            ], [MODEL, [VENDOR, 'TCL'], [TYPE, TABLET]], [

            // itel
            /(itel) ((\w+))/i
            ], [[VENDOR, lowerize], MODEL, [TYPE, strMapper, { 'tablet' : ['p10001l', 'w7001'], '*' : 'mobile' }]], [

            // Acer
            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            // Meizu
            /droid.+; (m[1-5] note) bui/i,
            /\bmz-([-\w]{2,})/i
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [
                
            // Ulefone
            /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
            ], [MODEL, [VENDOR, 'Ulefone'], [TYPE, MOBILE]], [

            // Energizer
            /; (energy ?\w+)(?: bui|\))/i,
            /; energizer ([\w ]+)(?: bui|\))/i
            ], [MODEL, [VENDOR, 'Energizer'], [TYPE, MOBILE]], [

            // Cat
            /; cat (b35);/i,
            /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
            ], [MODEL, [VENDOR, 'Cat'], [TYPE, MOBILE]], [

            // Smartfren
            /((?:new )?andromax[\w- ]+)(?: bui|\))/i
            ], [MODEL, [VENDOR, 'Smartfren'], [TYPE, MOBILE]], [

            // Nothing
            /droid.+; (a(?:015|06[35]|142p?))/i
            ], [MODEL, [VENDOR, 'Nothing'], [TYPE, MOBILE]], [

            // MIXED
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno|micromax|advan)[-_ ]?([-\w]*)/i,
                                                                                // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron/Infinix/Tecno/Micromax/Advan
            /; (imo) ((?!tab)[\w ]+?)(?: bui|\))/i,                             // IMO
            /(hp) ([\w ]+\w)/i,                                                 // HP iPAQ
            /(asus)-?(\w+)/i,                                                   // Asus
            /(microsoft); (lumia[\w ]+)/i,                                      // Microsoft Lumia
            /(lenovo)[-_ ]?([-\w]+)/i,                                          // Lenovo
            /(jolla)/i,                                                         // Jolla
            /(oppo) ?([\w ]+) bui/i                                             // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /(imo) (tab \w+)/i,                                                 // IMO
            /(kobo)\s(ereader|touch)/i,                                         // Kobo
            /(archos) (gamepad2?)/i,                                            // Archos
            /(hp).+(touchpad(?!.+tablet)|tablet)/i,                             // HP TouchPad
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(nook)[\w ]+build\/(\w+)/i,                                        // Nook
            /(dell) (strea[kpr\d ]*[\dko])/i,                                   // Dell Streak
            /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,                                  // Le Pan Tablets
            /(trinity)[- ]*(t\d{3}) bui/i,                                      // Trinity Tablets
            /(gigaset)[- ]+(q\w{1,9}) bui/i,                                    // Gigaset Tablets
            /(vodafone) ([\w ]+)(?:\)| bui)/i                                   // Vodafone
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(surface duo)/i                                                    // Surface Duo
            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]], [
            /droid [\d\.]+; (fp\du?)(?: b|\))/i                                 // Fairphone
            ], [MODEL, [VENDOR, 'Fairphone'], [TYPE, MOBILE]], [
            /(u304aa)/i                                                         // AT&T
            ], [MODEL, [VENDOR, 'AT&T'], [TYPE, MOBILE]], [
            /\bsie-(\w*)/i                                                      // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [
            /\b(rct\w+) b/i                                                     // RCA Tablets
            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [
            /\b(venue[\d ]{2,7}) b/i                                            // Dell Venue Tablets
            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [
            /\b(q(?:mv|ta)\w+) b/i                                              // Verizon Tablet
            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [
            /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i                       // Barnes & Noble Tablet
            ], [MODEL, [VENDOR, 'Barnes & Noble'], [TYPE, TABLET]], [
            /\b(tm\d{3}\w+) b/i
            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [
            /\b(k88) b/i                                                        // ZTE K Series Tablet
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [
            /\b(nx\d{3}j) b/i                                                   // ZTE Nubia
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [
            /\b(gen\d{3}) b.+49h/i                                              // Swiss GEN Mobile
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [
            /\b(zur\d{3}) b/i                                                   // Swiss ZUR Tablet
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [
            /\b((zeki)?tb.*\b) b/i                                              // Zeki Tablets
            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [
            /\b([yr]\d{2}) b/i,
            /\b(dragon[- ]+touch |dt)(\w{5}) b/i                                // Dragon Touch Tablet
            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [
            /\b(ns-?\w{0,9}) b/i                                                // Insignia Tablets
            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [
            /\b((nxa|next)-?\w{0,9}) b/i                                        // NextBook Tablets
            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [
            /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i                  // Voice Xtreme Phones
            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [
            /\b(lvtel\-)?(v1[12]) b/i                                           // LvTel Phones
            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [
            /\b(ph-1) /i                                                        // Essential PH-1
            ], [MODEL, [VENDOR, 'Essential'], [TYPE, MOBILE]], [
            /\b(v(100md|700na|7011|917g).*\b) b/i                               // Envizen Tablets
            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [
            /\b(trio[-\w\. ]+) b/i                                              // MachSpeed Tablets
            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [
            /\btu_(1491) b/i                                                    // Rotor Tablets
            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [
            /(shield[\w ]+) b/i                                                 // Nvidia Shield Tablets
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, TABLET]], [
            /(sprint) (\w+)/i                                                   // Sprint Phones
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, MICROSOFT], [TYPE, MOBILE]], [
            /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i             // Zebra
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]], [
            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]], [

            ///////////////////
            // SMARTTVS
            ///////////////////

            /smart-tv.+(samsung)/i                                              // Samsung
            ], [VENDOR, [TYPE, SMARTTV]], [
            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, SAMSUNG], [TYPE, SMARTTV]], [
            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i        // LG SmartTV
            ], [[VENDOR, LG], [TYPE, SMARTTV]], [
            /(apple) ?tv/i                                                      // Apple TV
            ], [VENDOR, [MODEL, APPLE+' TV'], [TYPE, SMARTTV]], [
            /crkey/i                                                            // Google Chromecast
            ], [[MODEL, CHROME+'cast'], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
            /droid.+aft(\w+)( bui|\))/i                                         // Fire TV
            ], [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]], [
            /\(dtv[\);].+(aquos)/i,
            /(aquos-tv[\w ]+)\)/i                                               // Sharp
            ], [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],[
            /(bravia[\w ]+)( bui|\))/i                                              // Sony
            ], [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]], [
            /(mitv-\w{5}) bui/i                                                 // Xiaomi
            ], [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]], [
            /Hbbtv.*(technisat) (.*);/i                                         // TechniSAT
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,                          // Roku
            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i         // HbbTV devices
            ], [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]], [
            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i                   // SmartTV from Unidentified Vendors
            ], [[TYPE, SMARTTV]], [

            ///////////////////
            // CONSOLES
            ///////////////////

            /(ouya)/i,                                                          // Ouya
            /(nintendo) ([wids3utch]+)/i                                        // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [
            /droid.+; (shield) bui/i                                            // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [
            /(playstation [345portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]], [
            /\b(xbox(?: one)?(?!; xbox))[\); ]/i                                // Microsoft Xbox
            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]], [

            ///////////////////
            // WEARABLES
            ///////////////////

            /\b(sm-[lr]\d\d[05][fnuw]?s?)\b/i                                   // Samsung Galaxy Watch
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, WEARABLE]], [
            /((pebble))app/i                                                    // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i                              // Apple Watch
            ], [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]], [
            /droid.+; (glass) \d/i                                              // Google Glass
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]], [
            /droid.+; (wt63?0{2,3})\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [

            ///////////////////
            // XR
            ///////////////////

            /droid.+; (glass) \d/i                                              // Google Glass
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]], [
            /(pico) (4|neo3(?: link|pro)?)/i                                    // Pico
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
            /; (quest( \d| pro)?)/i                                             // Oculus Quest
            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]], [

            ///////////////////
            // EMBEDDED
            ///////////////////

            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i                              // Tesla
            ], [VENDOR, [TYPE, EMBEDDED]], [
            /(aeobc)\b/i                                                        // Echo Dot
            ], [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]], [

            ////////////////////
            // MIXED (GENERIC)
            ///////////////////

            /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i    // Android Phones from Unidentified Vendors
            ], [MODEL, [TYPE, MOBILE]], [
            /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i       // Android Tablets from Unidentified Vendors
            ], [MODEL, [TYPE, TABLET]], [
            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i                      // Unidentifiable Tablet
            ], [[TYPE, TABLET]], [
            /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i    // Unidentifiable Mobile
            ], [[TYPE, MOBILE]], [
            /(android[-\w\. ]{0,9});.+buil/i                                    // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]
        ],

        engine : [[

            /windows.+ edge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, EDGE+'HTML']], [

            /(arkweb)\/([\w\.]+)/i                                              // ArkWeb
            ], [NAME, VERSION], [

            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i                         // Blink
            ], [VERSION, [NAME, 'Blink']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna/Servo
            /ekioh(flow)\/([\w\.]+)/i,                                          // Flow
            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,                           // KHTML/Tasman/Links
            /(icab)[\/ ]([23]\.[\d\.]+)/i,                                      // iCab
            /\b(libweb)/i
            ], [NAME, VERSION], [

            /rv\:([\w\.]{1,9})\b.+(gecko)/i                                     // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows
            /microsoft (windows) (vista|xp)/i                                   // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i             // Windows Phone
            ], [NAME, [VERSION, strMapper, windowsVersionMap]], [
            /windows nt 6\.2; (arm)/i,                                        // Windows RT
            /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
            /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i
            ], [[VERSION, strMapper, windowsVersionMap], [NAME, 'Windows']], [

            // iOS/macOS
            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,              // iOS
            /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
            /cfnetwork\/.+darwin/i
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [
            /(mac os x) ?([\w\. ]*)/i,
            /(macintosh|mac_powerpc\b)(?!.+haiku)/i                             // Mac OS
            ], [[NAME, MAC_OS], [VERSION, /_/g, '.']], [

            // Mobile OSes
            /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i                    // Android-x86/HarmonyOS
            ], [VERSION, NAME], [                                               // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS/OpenHarmony
            /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish|openharmony)[-\/ ]?([\w\.]*)/i,
            /(blackberry)\w*\/([\w\.]*)/i,                                      // Blackberry
            /(tizen|kaios)[\/ ]([\w\.]+)/i,                                     // Tizen/KaiOS
            /\((series40);/i                                                    // Series 40
            ], [NAME, VERSION], [
            /\(bb(10);/i                                                        // BlackBerry 10
            ], [VERSION, [NAME, BLACKBERRY]], [
            /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i         // Symbian
            ], [VERSION, [NAME, 'Symbian']], [
            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i // Firefox OS
            ], [VERSION, [NAME, FIREFOX+' OS']], [
            /web0s;.+rt(tv)/i,
            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i                              // WebOS
            ], [VERSION, [NAME, 'webOS']], [
            /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i                              // watchOS
            ], [VERSION, [NAME, 'watchOS']], [

            // Google Chromecast
            /crkey\/([\d\.]+)/i                                                 // Google Chromecast
            ], [VERSION, [NAME, CHROME+'cast']], [
            /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i                                  // Chromium OS
            ], [[NAME, CHROMIUM_OS], VERSION],[

            // Smart TVs
            /panasonic;(viera)/i,                                               // Panasonic Viera
            /(netrange)mmh/i,                                                   // Netrange
            /(nettv)\/(\d+\.[\w\.]+)/i,                                         // NetTV

            // Console
            /(nintendo|playstation) ([wids345portablevuch]+)/i,                 // Nintendo/Playstation
            /(xbox); +xbox ([^\);]+)/i,                                         // Microsoft Xbox (360, One, X, S, Series X, Series S)

            // Other
            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,                            // Joli/Palm
            /(mint)[\/\(\) ]?(\w*)/i,                                           // Mint
            /(mageia|vectorlinux)[; ]/i,                                        // Mageia/VectorLinux
            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
                                                                                // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
            /(hurd|linux) ?([\w\.]*)/i,                                         // Hurd/Linux
            /(gnu) ?([\w\.]*)/i,                                                // GNU
            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
            /(haiku) (\w+)/i                                                    // Haiku
            ], [NAME, VERSION], [
            /(sunos) ?([\w\.\d]*)/i                                             // Solaris
            ], [[NAME, 'Solaris'], VERSION], [
            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,                              // Solaris
            /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,                                  // AIX
            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
            /(unix) ?([\w\.]*)/i                                                // UNIX
            ], [NAME, VERSION]
        ]
    };

    /////////////////
    // Constructor
    ////////////////

    var UAParser = function (ua, extensions) {

        if (typeof ua === OBJ_TYPE) {
            extensions = ua;
            ua = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(ua, extensions).getResult();
        }

        var _navigator = (typeof window !== UNDEF_TYPE && window.navigator) ? window.navigator : undefined;
        var _ua = ua || ((_navigator && _navigator.userAgent) ? _navigator.userAgent : EMPTY);
        var _uach = (_navigator && _navigator.userAgentData) ? _navigator.userAgentData : undefined;
        var _rgxmap = extensions ? extend(regexes, extensions) : regexes;
        var _isSelfNav = _navigator && _navigator.userAgent == _ua;

        this.getBrowser = function () {
            var _browser = {};
            _browser[NAME] = undefined;
            _browser[VERSION] = undefined;
            rgxMapper.call(_browser, _ua, _rgxmap.browser);
            _browser[MAJOR] = majorize(_browser[VERSION]);
            // Brave-specific detection
            if (_isSelfNav && _navigator && _navigator.brave && typeof _navigator.brave.isBrave == FUNC_TYPE) {
                _browser[NAME] = 'Brave';
            }
            return _browser;
        };
        this.getCPU = function () {
            var _cpu = {};
            _cpu[ARCHITECTURE] = undefined;
            rgxMapper.call(_cpu, _ua, _rgxmap.cpu);
            return _cpu;
        };
        this.getDevice = function () {
            var _device = {};
            _device[VENDOR] = undefined;
            _device[MODEL] = undefined;
            _device[TYPE] = undefined;
            rgxMapper.call(_device, _ua, _rgxmap.device);
            if (_isSelfNav && !_device[TYPE] && _uach && _uach.mobile) {
                _device[TYPE] = MOBILE;
            }
            // iPadOS-specific detection: identified as Mac, but has some iOS-only properties
            if (_isSelfNav && _device[MODEL] == 'Macintosh' && _navigator && typeof _navigator.standalone !== UNDEF_TYPE && _navigator.maxTouchPoints && _navigator.maxTouchPoints > 2) {
                _device[MODEL] = 'iPad';
                _device[TYPE] = TABLET;
            }
            return _device;
        };
        this.getEngine = function () {
            var _engine = {};
            _engine[NAME] = undefined;
            _engine[VERSION] = undefined;
            rgxMapper.call(_engine, _ua, _rgxmap.engine);
            return _engine;
        };
        this.getOS = function () {
            var _os = {};
            _os[NAME] = undefined;
            _os[VERSION] = undefined;
            rgxMapper.call(_os, _ua, _rgxmap.os);
            if (_isSelfNav && !_os[NAME] && _uach && _uach.platform && _uach.platform != 'Unknown') {
                _os[NAME] = _uach.platform  
                                    .replace(/chrome os/i, CHROMIUM_OS)
                                    .replace(/macos/i, MAC_OS);           // backward compatibility
            }
            return _os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return _ua;
        };
        this.setUA = function (ua) {
            _ua = (typeof ua === STR_TYPE && ua.length > UA_MAX_LENGTH) ? trim(ua, UA_MAX_LENGTH) : ua;
            return this;
        };
        this.setUA(_ua);
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER =  enumerize([NAME, VERSION, MAJOR]);
    UAParser.CPU = enumerize([ARCHITECTURE]);
    UAParser.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]);
    UAParser.ENGINE = UAParser.OS = enumerize([NAME, VERSION]);

    ///////////
    // Export
    //////////

    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if ('object' !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if (typeof(define) === FUNC_TYPE && define.amd) {
            define(function () {
                return UAParser;
            });
        } else if (typeof window !== UNDEF_TYPE) {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = typeof window !== UNDEF_TYPE && (window.jQuery || window.Zepto);
    if ($ && !$.ua) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (ua) {
            parser.setUA(ua);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);


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
5119(module) {
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());


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

// expose the modules object (__webpack_modules__)
__webpack_require__.m = __webpack_modules__;

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
// webpack/runtime/make_namespace_object
(() => {
// define __esModule on exports
__webpack_require__.r = (exports) => {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};
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
// webpack/runtime/auto_public_path
(() => {
var scriptUrl;

if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
var document = __webpack_require__.g.document;
if (!scriptUrl && document) {
  // Technically we could use `document.currentScript instanceof window.HTMLScriptElement`,
  // but an attacker could try to inject `<script>HTMLScriptElement = HTMLImageElement</script>`
  // and use `<img name="currentScript" src="https://attacker.controlled.server/"></img>`
  if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT') scriptUrl = document.currentScript.src;
  if (!scriptUrl) {
    var scripts = document.getElementsByTagName("script");
    if (scripts.length) {
      var i = scripts.length - 1;
      while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
    }
  }
}

// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration",
// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.',
if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");

__webpack_require__.p = scriptUrl;

})();
// webpack/runtime/rspack_unique_id
(() => {
__webpack_require__.ruid = "bundler=rspack@1.7.5";
})();
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./node_modules/.pnpm/react@18.3.1/node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(6070);
// EXTERNAL MODULE: ./node_modules/.pnpm/react@18.3.1/node_modules/react/index.js
var node_modules_react = __webpack_require__(758);
;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx@5.15.7/node_modules/mobx/lib/mobx.module.js
/* provided dependency */ var process = __webpack_require__(8558);
/** MobX - (c) Michel Weststrate 2015 - 2020 - MIT Licensed */
var OBFUSCATED_ERROR = "An invariant failed, however the error is obfuscated because this is a production build.";
var EMPTY_ARRAY = [];
Object.freeze(EMPTY_ARRAY);
var EMPTY_OBJECT = {};
Object.freeze(EMPTY_OBJECT);
function getNextId() {
    return ++globalState.mobxGuid;
}
function fail(message) {
    invariant(false, message);
    throw "X"; // unreachable
}
function invariant(check, message) {
    if (!check)
        throw new Error("[mobx] " + (message || OBFUSCATED_ERROR));
}
/**
 * Prints a deprecation message, but only one time.
 * Returns false if the deprecated message was already printed before
 */
var deprecatedMessages = [];
function deprecated(msg, thing) {
    if (true)
        return false;
    if (thing) {
        return deprecated("'" + msg + "', use '" + thing + "' instead.");
    }
    if (deprecatedMessages.indexOf(msg) !== -1)
        return false;
    deprecatedMessages.push(msg);
    console.error("[mobx] Deprecated: " + msg);
    return true;
}
/**
 * Makes sure that the provided function is invoked at most once.
 */
function once(func) {
    var invoked = false;
    return function () {
        if (invoked)
            return;
        invoked = true;
        return func.apply(this, arguments);
    };
}
var noop = function () { };
function unique(list) {
    var res = [];
    list.forEach(function (item) {
        if (res.indexOf(item) === -1)
            res.push(item);
    });
    return res;
}
function isObject(value) {
    return value !== null && typeof value === "object";
}
function mobx_module_isPlainObject(value) {
    if (value === null || typeof value !== "object")
        return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}
function convertToMap(dataStructure) {
    if (isES6Map(dataStructure) || mobx_module_isObservableMap(dataStructure)) {
        return dataStructure;
    }
    else if (Array.isArray(dataStructure)) {
        return new Map(dataStructure);
    }
    else if (mobx_module_isPlainObject(dataStructure)) {
        var map = new Map();
        for (var key in dataStructure) {
            map.set(key, dataStructure[key]);
        }
        return map;
    }
    else {
        return fail("Cannot convert to map from '" + dataStructure + "'");
    }
}
function addHiddenProp(object, propName, value) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: true,
        configurable: true,
        value: value
    });
}
function addHiddenFinalProp(object, propName, value) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value: value
    });
}
function isPropertyConfigurable(object, prop) {
    var descriptor = Object.getOwnPropertyDescriptor(object, prop);
    return !descriptor || (descriptor.configurable !== false && descriptor.writable !== false);
}
function assertPropertyConfigurable(object, prop) {
    if (false)
        {}
}
function createInstanceofPredicate(name, clazz) {
    var propName = "isMobX" + name;
    clazz.prototype[propName] = true;
    return function (x) {
        return isObject(x) && x[propName] === true;
    };
}
/**
 * Returns whether the argument is an array, disregarding observability.
 */
function isArrayLike(x) {
    return Array.isArray(x) || mobx_module_isObservableArray(x);
}
function isES6Map(thing) {
    return thing instanceof Map;
}
function isES6Set(thing) {
    return thing instanceof Set;
}
/**
 * Returns the following: own keys, prototype keys & own symbol keys, if they are enumerable.
 */
function getPlainObjectKeys(object) {
    var enumerables = new Set();
    for (var key in object)
        enumerables.add(key); // *all* enumerables
    Object.getOwnPropertySymbols(object).forEach(function (k) {
        if (Object.getOwnPropertyDescriptor(object, k).enumerable)
            enumerables.add(k);
    }); // *own* symbols
    // Note: this implementation is missing enumerable, inherited, symbolic property names! That would however pretty expensive to add,
    // as there is no efficient iterator that returns *all* properties
    return Array.from(enumerables);
}
function stringifyKey(key) {
    if (key && key.toString)
        return key.toString();
    else
        return new String(key).toString();
}
function toPrimitive(value) {
    return value === null ? null : typeof value === "object" ? "" + value : value;
}
var mobx_module_ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys
    ? Reflect.ownKeys
    : Object.getOwnPropertySymbols
        ? function (obj) { return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj)); }
        : /* istanbul ignore next */ Object.getOwnPropertyNames;

var mobx_module_$mobx = Symbol("mobx administration");
var mobx_module_Atom = /** @class */ (function () {
    /**
     * Create a new atom. For debugging purposes it is recommended to give it a name.
     * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
     */
    function Atom(name) {
        if (name === void 0) { name = "Atom@" + getNextId(); }
        this.name = name;
        this.isPendingUnobservation = false; // for effective unobserving. BaseAtom has true, for extra optimization, so its onBecomeUnobserved never gets called, because it's not needed
        this.isBeingObserved = false;
        this.observers = new Set();
        this.diffValue = 0;
        this.lastAccessedBy = 0;
        this.lowestObserverState = mobx_module_IDerivationState.NOT_TRACKING;
    }
    Atom.prototype.onBecomeObserved = function () {
        if (this.onBecomeObservedListeners) {
            this.onBecomeObservedListeners.forEach(function (listener) { return listener(); });
        }
    };
    Atom.prototype.onBecomeUnobserved = function () {
        if (this.onBecomeUnobservedListeners) {
            this.onBecomeUnobservedListeners.forEach(function (listener) { return listener(); });
        }
    };
    /**
     * Invoke this method to notify mobx that your atom has been used somehow.
     * Returns true if there is currently a reactive context.
     */
    Atom.prototype.reportObserved = function () {
        return reportObserved(this);
    };
    /**
     * Invoke this method _after_ this method has changed to signal mobx that all its observers should invalidate.
     */
    Atom.prototype.reportChanged = function () {
        startBatch();
        propagateChanged(this);
        endBatch();
    };
    Atom.prototype.toString = function () {
        return this.name;
    };
    return Atom;
}());
var isAtom = createInstanceofPredicate("Atom", mobx_module_Atom);
function mobx_module_createAtom(name, onBecomeObservedHandler, onBecomeUnobservedHandler) {
    if (onBecomeObservedHandler === void 0) { onBecomeObservedHandler = noop; }
    if (onBecomeUnobservedHandler === void 0) { onBecomeUnobservedHandler = noop; }
    var atom = new mobx_module_Atom(name);
    // default `noop` listener will not initialize the hook Set
    if (onBecomeObservedHandler !== noop) {
        onBecomeObserved(atom, onBecomeObservedHandler);
    }
    if (onBecomeUnobservedHandler !== noop) {
        onBecomeUnobserved(atom, onBecomeUnobservedHandler);
    }
    return atom;
}

function identityComparer(a, b) {
    return a === b;
}
function structuralComparer(a, b) {
    return deepEqual(a, b);
}
function shallowComparer(a, b) {
    return deepEqual(a, b, 1);
}
function defaultComparer(a, b) {
    return Object.is(a, b);
}
var comparer = {
    identity: identityComparer,
    structural: structuralComparer,
    default: defaultComparer,
    shallow: shallowComparer
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var mobx_module_assign = function() {
    mobx_module_assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return mobx_module_assign.apply(this, arguments);
};

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var mobxDidRunLazyInitializersSymbol = Symbol("mobx did run lazy initializers");
var mobxPendingDecorators = Symbol("mobx pending decorators");
var enumerableDescriptorCache = {};
var nonEnumerableDescriptorCache = {};
function createPropertyInitializerDescriptor(prop, enumerable) {
    var cache = enumerable ? enumerableDescriptorCache : nonEnumerableDescriptorCache;
    return (cache[prop] ||
        (cache[prop] = {
            configurable: true,
            enumerable: enumerable,
            get: function () {
                initializeInstance(this);
                return this[prop];
            },
            set: function (value) {
                initializeInstance(this);
                this[prop] = value;
            }
        }));
}
function initializeInstance(target) {
    var e_1, _a;
    if (target[mobxDidRunLazyInitializersSymbol] === true)
        return;
    var decorators = target[mobxPendingDecorators];
    if (decorators) {
        addHiddenProp(target, mobxDidRunLazyInitializersSymbol, true);
        // Build property key array from both strings and symbols
        var keys = __spread(Object.getOwnPropertySymbols(decorators), Object.keys(decorators));
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                var d = decorators[key];
                d.propertyCreator(target, d.prop, d.descriptor, d.decoratorTarget, d.decoratorArguments);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
}
function createPropDecorator(propertyInitiallyEnumerable, propertyCreator) {
    return function decoratorFactory() {
        var decoratorArguments;
        var decorator = function decorate(target, prop, descriptor, applyImmediately
        // This is a special parameter to signal the direct application of a decorator, allow extendObservable to skip the entire type decoration part,
        // as the instance to apply the decorator to equals the target
        ) {
            if (applyImmediately === true) {
                propertyCreator(target, prop, descriptor, target, decoratorArguments);
                return null;
            }
            if (false)
                {}
            if (!Object.prototype.hasOwnProperty.call(target, mobxPendingDecorators)) {
                var inheritedDecorators = target[mobxPendingDecorators];
                addHiddenProp(target, mobxPendingDecorators, mobx_module_assign({}, inheritedDecorators));
            }
            target[mobxPendingDecorators][prop] = {
                prop: prop,
                propertyCreator: propertyCreator,
                descriptor: descriptor,
                decoratorTarget: target,
                decoratorArguments: decoratorArguments
            };
            return createPropertyInitializerDescriptor(prop, propertyInitiallyEnumerable);
        };
        if (quacksLikeADecorator(arguments)) {
            // @decorator
            decoratorArguments = EMPTY_ARRAY;
            return decorator.apply(null, arguments);
        }
        else {
            // @decorator(args)
            decoratorArguments = Array.prototype.slice.call(arguments);
            return decorator;
        }
    };
}
function quacksLikeADecorator(args) {
    return (((args.length === 2 || args.length === 3) &&
        (typeof args[1] === "string" || typeof args[1] === "symbol")) ||
        (args.length === 4 && args[3] === true));
}

function deepEnhancer(v, _, name) {
    // it is an observable already, done
    if (isObservable(v))
        return v;
    // something that can be converted and mutated?
    if (Array.isArray(v))
        return mobx_module_observable.array(v, { name: name });
    if (mobx_module_isPlainObject(v))
        return mobx_module_observable.object(v, undefined, { name: name });
    if (isES6Map(v))
        return mobx_module_observable.map(v, { name: name });
    if (isES6Set(v))
        return mobx_module_observable.set(v, { name: name });
    return v;
}
function shallowEnhancer(v, _, name) {
    if (v === undefined || v === null)
        return v;
    if (mobx_module_isObservableObject(v) || mobx_module_isObservableArray(v) || mobx_module_isObservableMap(v) || isObservableSet(v))
        return v;
    if (Array.isArray(v))
        return mobx_module_observable.array(v, { name: name, deep: false });
    if (mobx_module_isPlainObject(v))
        return mobx_module_observable.object(v, undefined, { name: name, deep: false });
    if (isES6Map(v))
        return mobx_module_observable.map(v, { name: name, deep: false });
    if (isES6Set(v))
        return mobx_module_observable.set(v, { name: name, deep: false });
    return fail( false &&
        0);
}
function referenceEnhancer(newValue) {
    // never turn into an observable
    return newValue;
}
function refStructEnhancer(v, oldValue, name) {
    if (false)
        {}
    if (deepEqual(v, oldValue))
        return oldValue;
    return v;
}

function createDecoratorForEnhancer(enhancer) {
    invariant(enhancer);
    var decorator = createPropDecorator(true, function (target, propertyName, descriptor, _decoratorTarget, decoratorArgs) {
        if (false) {}
        var initialValue = descriptor
            ? descriptor.initializer
                ? descriptor.initializer.call(target)
                : descriptor.value
            : undefined;
        asObservableObject(target).addObservableProp(propertyName, initialValue, enhancer);
    });
    var res = 
    // Extra process checks, as this happens during module initialization
    typeof process !== "undefined" && process.env && "production" !== "production"
        ? 0
        : decorator;
    res.enhancer = enhancer;
    return res;
}

// Predefined bags of create observable options, to avoid allocating temporarily option objects
// in the majority of cases
var defaultCreateObservableOptions = {
    deep: true,
    name: undefined,
    defaultDecorator: undefined,
    proxy: true
};
Object.freeze(defaultCreateObservableOptions);
function assertValidOption(key) {
    if (!/^(deep|name|equals|defaultDecorator|proxy)$/.test(key))
        fail("invalid option for (extend)observable: " + key);
}
function asCreateObservableOptions(thing) {
    if (thing === null || thing === undefined)
        return defaultCreateObservableOptions;
    if (typeof thing === "string")
        return { name: thing, deep: true, proxy: true };
    if (false) {}
    return thing;
}
var deepDecorator = createDecoratorForEnhancer(deepEnhancer);
var shallowDecorator = createDecoratorForEnhancer(shallowEnhancer);
var refDecorator = createDecoratorForEnhancer(referenceEnhancer);
var refStructDecorator = createDecoratorForEnhancer(refStructEnhancer);
function getEnhancerFromOptions(options) {
    return options.defaultDecorator
        ? options.defaultDecorator.enhancer
        : options.deep === false
            ? referenceEnhancer
            : deepEnhancer;
}
/**
 * Turns an object, array or function into a reactive structure.
 * @param v the value which should become observable.
 */
function createObservable(v, arg2, arg3) {
    // @observable someProp;
    if (typeof arguments[1] === "string" || typeof arguments[1] === "symbol") {
        return deepDecorator.apply(null, arguments);
    }
    // it is an observable already, done
    if (isObservable(v))
        return v;
    // something that can be converted and mutated?
    var res = mobx_module_isPlainObject(v)
        ? mobx_module_observable.object(v, arg2, arg3)
        : Array.isArray(v)
            ? mobx_module_observable.array(v, arg2)
            : isES6Map(v)
                ? mobx_module_observable.map(v, arg2)
                : isES6Set(v)
                    ? mobx_module_observable.set(v, arg2)
                    : v;
    // this value could be converted to a new observable data structure, return it
    if (res !== v)
        return res;
    // otherwise, just box it
    fail( false &&
        0);
}
var observableFactories = {
    box: function (value, options) {
        if (arguments.length > 2)
            incorrectlyUsedAsDecorator("box");
        var o = asCreateObservableOptions(options);
        return new mobx_module_ObservableValue(value, getEnhancerFromOptions(o), o.name, true, o.equals);
    },
    array: function (initialValues, options) {
        if (arguments.length > 2)
            incorrectlyUsedAsDecorator("array");
        var o = asCreateObservableOptions(options);
        return createObservableArray(initialValues, getEnhancerFromOptions(o), o.name);
    },
    map: function (initialValues, options) {
        if (arguments.length > 2)
            incorrectlyUsedAsDecorator("map");
        var o = asCreateObservableOptions(options);
        return new mobx_module_ObservableMap(initialValues, getEnhancerFromOptions(o), o.name);
    },
    set: function (initialValues, options) {
        if (arguments.length > 2)
            incorrectlyUsedAsDecorator("set");
        var o = asCreateObservableOptions(options);
        return new mobx_module_ObservableSet(initialValues, getEnhancerFromOptions(o), o.name);
    },
    object: function (props, decorators, options) {
        if (typeof arguments[1] === "string")
            incorrectlyUsedAsDecorator("object");
        var o = asCreateObservableOptions(options);
        if (o.proxy === false) {
            return extendObservable({}, props, decorators, o);
        }
        else {
            var defaultDecorator = getDefaultDecoratorFromObjectOptions(o);
            var base = extendObservable({}, undefined, undefined, o);
            var proxy = createDynamicObservableObject(base);
            extendObservableObjectWithProperties(proxy, props, decorators, defaultDecorator);
            return proxy;
        }
    },
    ref: refDecorator,
    shallow: shallowDecorator,
    deep: deepDecorator,
    struct: refStructDecorator
};
var mobx_module_observable = createObservable;
// weird trick to keep our typings nicely with our funcs, and still extend the observable function
Object.keys(observableFactories).forEach(function (name) { return (mobx_module_observable[name] = observableFactories[name]); });
function incorrectlyUsedAsDecorator(methodName) {
    fail(
    // process.env.NODE_ENV !== "production" &&
    "Expected one or two arguments to observable." + methodName + ". Did you accidentally try to use observable." + methodName + " as decorator?");
}

var computedDecorator = createPropDecorator(false, function (instance, propertyName, descriptor, decoratorTarget, decoratorArgs) {
    if (false) {}
    var get = descriptor.get, set = descriptor.set; // initialValue is the descriptor for get / set props
    // Optimization: faster on decorator target or instance? Assuming target
    // Optimization: find out if declaring on instance isn't just faster. (also makes the property descriptor simpler). But, more memory usage..
    // Forcing instance now, fixes hot reloadig issues on React Native:
    var options = decoratorArgs[0] || {};
    asObservableObject(instance).addComputedProp(instance, propertyName, mobx_module_assign({ get: get,
        set: set, context: instance }, options));
});
var computedStructDecorator = computedDecorator({ equals: comparer.structural });
/**
 * Decorator for class properties: @computed get value() { return expr; }.
 * For legacy purposes also invokable as ES5 observable created: `computed(() => expr)`;
 */
var mobx_module_computed = function computed(arg1, arg2, arg3) {
    if (typeof arg2 === "string") {
        // @computed
        return computedDecorator.apply(null, arguments);
    }
    if (arg1 !== null && typeof arg1 === "object" && arguments.length === 1) {
        // @computed({ options })
        return computedDecorator.apply(null, arguments);
    }
    // computed(expr, options?)
    if (false) {}
    var opts = typeof arg2 === "object" ? arg2 : {};
    opts.get = arg1;
    opts.set = typeof arg2 === "function" ? arg2 : opts.set;
    opts.name = opts.name || arg1.name || ""; /* for generated name */
    return new mobx_module_ComputedValue(opts);
};
mobx_module_computed.struct = computedStructDecorator;

var mobx_module_IDerivationState;
(function (IDerivationState) {
    // before being run or (outside batch and not being observed)
    // at this point derivation is not holding any data about dependency tree
    IDerivationState[IDerivationState["NOT_TRACKING"] = -1] = "NOT_TRACKING";
    // no shallow dependency changed since last computation
    // won't recalculate derivation
    // this is what makes mobx fast
    IDerivationState[IDerivationState["UP_TO_DATE"] = 0] = "UP_TO_DATE";
    // some deep dependency changed, but don't know if shallow dependency changed
    // will require to check first if UP_TO_DATE or POSSIBLY_STALE
    // currently only ComputedValue will propagate POSSIBLY_STALE
    //
    // having this state is second big optimization:
    // don't have to recompute on every dependency change, but only when it's needed
    IDerivationState[IDerivationState["POSSIBLY_STALE"] = 1] = "POSSIBLY_STALE";
    // A shallow dependency has changed since last computation and the derivation
    // will need to recompute when it's needed next.
    IDerivationState[IDerivationState["STALE"] = 2] = "STALE";
})(mobx_module_IDerivationState || (mobx_module_IDerivationState = {}));
var mobx_module_TraceMode;
(function (TraceMode) {
    TraceMode[TraceMode["NONE"] = 0] = "NONE";
    TraceMode[TraceMode["LOG"] = 1] = "LOG";
    TraceMode[TraceMode["BREAK"] = 2] = "BREAK";
})(mobx_module_TraceMode || (mobx_module_TraceMode = {}));
var mobx_module_CaughtException = /** @class */ (function () {
    function CaughtException(cause) {
        this.cause = cause;
        // Empty
    }
    return CaughtException;
}());
function isCaughtException(e) {
    return e instanceof mobx_module_CaughtException;
}
/**
 * Finds out whether any dependency of the derivation has actually changed.
 * If dependenciesState is 1 then it will recalculate dependencies,
 * if any dependency changed it will propagate it by changing dependenciesState to 2.
 *
 * By iterating over the dependencies in the same order that they were reported and
 * stopping on the first change, all the recalculations are only called for ComputedValues
 * that will be tracked by derivation. That is because we assume that if the first x
 * dependencies of the derivation doesn't change then the derivation should run the same way
 * up until accessing x-th dependency.
 */
function shouldCompute(derivation) {
    switch (derivation.dependenciesState) {
        case mobx_module_IDerivationState.UP_TO_DATE:
            return false;
        case mobx_module_IDerivationState.NOT_TRACKING:
        case mobx_module_IDerivationState.STALE:
            return true;
        case mobx_module_IDerivationState.POSSIBLY_STALE: {
            // state propagation can occur outside of action/reactive context #2195
            var prevAllowStateReads = allowStateReadsStart(true);
            var prevUntracked = untrackedStart(); // no need for those computeds to be reported, they will be picked up in trackDerivedFunction.
            var obs = derivation.observing, l = obs.length;
            for (var i = 0; i < l; i++) {
                var obj = obs[i];
                if (isComputedValue(obj)) {
                    if (globalState.disableErrorBoundaries) {
                        obj.get();
                    }
                    else {
                        try {
                            obj.get();
                        }
                        catch (e) {
                            // we are not interested in the value *or* exception at this moment, but if there is one, notify all
                            untrackedEnd(prevUntracked);
                            allowStateReadsEnd(prevAllowStateReads);
                            return true;
                        }
                    }
                    // if ComputedValue `obj` actually changed it will be computed and propagated to its observers.
                    // and `derivation` is an observer of `obj`
                    // invariantShouldCompute(derivation)
                    if (derivation.dependenciesState === mobx_module_IDerivationState.STALE) {
                        untrackedEnd(prevUntracked);
                        allowStateReadsEnd(prevAllowStateReads);
                        return true;
                    }
                }
            }
            changeDependenciesStateTo0(derivation);
            untrackedEnd(prevUntracked);
            allowStateReadsEnd(prevAllowStateReads);
            return false;
        }
    }
}
// function invariantShouldCompute(derivation: IDerivation) {
//     const newDepState = (derivation as any).dependenciesState
//     if (
//         process.env.NODE_ENV === "production" &&
//         (newDepState === IDerivationState.POSSIBLY_STALE ||
//             newDepState === IDerivationState.NOT_TRACKING)
//     )
//         fail("Illegal dependency state")
// }
function isComputingDerivation() {
    return globalState.trackingDerivation !== null; // filter out actions inside computations
}
function checkIfStateModificationsAreAllowed(atom) {
    var hasObservers = atom.observers.size > 0;
    // Should never be possible to change an observed observable from inside computed, see #798
    if (globalState.computationDepth > 0 && hasObservers)
        fail( false &&
            0);
    // Should not be possible to change observed state outside strict mode, except during initialization, see #563
    if (!globalState.allowStateChanges && (hasObservers || globalState.enforceActions === "strict"))
        fail( false &&
            0);
}
function checkIfStateReadsAreAllowed(observable) {
    if (false) {}
}
/**
 * Executes the provided function `f` and tracks which observables are being accessed.
 * The tracking information is stored on the `derivation` object and the derivation is registered
 * as observer of any of the accessed observables.
 */
function trackDerivedFunction(derivation, f, context) {
    var prevAllowStateReads = allowStateReadsStart(true);
    // pre allocate array allocation + room for variation in deps
    // array will be trimmed by bindDependencies
    changeDependenciesStateTo0(derivation);
    derivation.newObserving = new Array(derivation.observing.length + 100);
    derivation.unboundDepsCount = 0;
    derivation.runId = ++globalState.runId;
    var prevTracking = globalState.trackingDerivation;
    globalState.trackingDerivation = derivation;
    var result;
    if (globalState.disableErrorBoundaries === true) {
        result = f.call(context);
    }
    else {
        try {
            result = f.call(context);
        }
        catch (e) {
            result = new mobx_module_CaughtException(e);
        }
    }
    globalState.trackingDerivation = prevTracking;
    bindDependencies(derivation);
    warnAboutDerivationWithoutDependencies(derivation);
    allowStateReadsEnd(prevAllowStateReads);
    return result;
}
function warnAboutDerivationWithoutDependencies(derivation) {
    if (true)
        return;
    if (derivation.observing.length !== 0)
        return;
    if (globalState.reactionRequiresObservable || derivation.requiresObservable) {
        console.warn("[mobx] Derivation " + derivation.name + " is created/updated without reading any observable value");
    }
}
/**
 * diffs newObserving with observing.
 * update observing to be newObserving with unique observables
 * notify observers that become observed/unobserved
 */
function bindDependencies(derivation) {
    // invariant(derivation.dependenciesState !== IDerivationState.NOT_TRACKING, "INTERNAL ERROR bindDependencies expects derivation.dependenciesState !== -1");
    var prevObserving = derivation.observing;
    var observing = (derivation.observing = derivation.newObserving);
    var lowestNewObservingDerivationState = mobx_module_IDerivationState.UP_TO_DATE;
    // Go through all new observables and check diffValue: (this list can contain duplicates):
    //   0: first occurrence, change to 1 and keep it
    //   1: extra occurrence, drop it
    var i0 = 0, l = derivation.unboundDepsCount;
    for (var i = 0; i < l; i++) {
        var dep = observing[i];
        if (dep.diffValue === 0) {
            dep.diffValue = 1;
            if (i0 !== i)
                observing[i0] = dep;
            i0++;
        }
        // Upcast is 'safe' here, because if dep is IObservable, `dependenciesState` will be undefined,
        // not hitting the condition
        if (dep.dependenciesState > lowestNewObservingDerivationState) {
            lowestNewObservingDerivationState = dep.dependenciesState;
        }
    }
    observing.length = i0;
    derivation.newObserving = null; // newObserving shouldn't be needed outside tracking (statement moved down to work around FF bug, see #614)
    // Go through all old observables and check diffValue: (it is unique after last bindDependencies)
    //   0: it's not in new observables, unobserve it
    //   1: it keeps being observed, don't want to notify it. change to 0
    l = prevObserving.length;
    while (l--) {
        var dep = prevObserving[l];
        if (dep.diffValue === 0) {
            removeObserver(dep, derivation);
        }
        dep.diffValue = 0;
    }
    // Go through all new observables and check diffValue: (now it should be unique)
    //   0: it was set to 0 in last loop. don't need to do anything.
    //   1: it wasn't observed, let's observe it. set back to 0
    while (i0--) {
        var dep = observing[i0];
        if (dep.diffValue === 1) {
            dep.diffValue = 0;
            addObserver(dep, derivation);
        }
    }
    // Some new observed derivations may become stale during this derivation computation
    // so they have had no chance to propagate staleness (#916)
    if (lowestNewObservingDerivationState !== mobx_module_IDerivationState.UP_TO_DATE) {
        derivation.dependenciesState = lowestNewObservingDerivationState;
        derivation.onBecomeStale();
    }
}
function clearObserving(derivation) {
    // invariant(globalState.inBatch > 0, "INTERNAL ERROR clearObserving should be called only inside batch");
    var obs = derivation.observing;
    derivation.observing = [];
    var i = obs.length;
    while (i--)
        removeObserver(obs[i], derivation);
    derivation.dependenciesState = mobx_module_IDerivationState.NOT_TRACKING;
}
function mobx_module_untracked(action) {
    var prev = untrackedStart();
    try {
        return action();
    }
    finally {
        untrackedEnd(prev);
    }
}
function untrackedStart() {
    var prev = globalState.trackingDerivation;
    globalState.trackingDerivation = null;
    return prev;
}
function untrackedEnd(prev) {
    globalState.trackingDerivation = prev;
}
function allowStateReadsStart(allowStateReads) {
    var prev = globalState.allowStateReads;
    globalState.allowStateReads = allowStateReads;
    return prev;
}
function allowStateReadsEnd(prev) {
    globalState.allowStateReads = prev;
}
/**
 * needed to keep `lowestObserverState` correct. when changing from (2 or 1) to 0
 *
 */
function changeDependenciesStateTo0(derivation) {
    if (derivation.dependenciesState === mobx_module_IDerivationState.UP_TO_DATE)
        return;
    derivation.dependenciesState = mobx_module_IDerivationState.UP_TO_DATE;
    var obs = derivation.observing;
    var i = obs.length;
    while (i--)
        obs[i].lowestObserverState = mobx_module_IDerivationState.UP_TO_DATE;
}

// we don't use globalState for these in order to avoid possible issues with multiple
// mobx versions
var currentActionId = 0;
var nextActionId = 1;
var functionNameDescriptor = Object.getOwnPropertyDescriptor(function () { }, "name");
var isFunctionNameConfigurable = functionNameDescriptor && functionNameDescriptor.configurable;
function createAction(actionName, fn, ref) {
    if (false) {}
    var res = function () {
        return executeAction(actionName, fn, ref || this, arguments);
    };
    res.isMobxAction = true;
    if (false) {}
    return res;
}
function executeAction(actionName, fn, scope, args) {
    var runInfo = _startAction(actionName, scope, args);
    try {
        return fn.apply(scope, args);
    }
    catch (err) {
        runInfo.error = err;
        throw err;
    }
    finally {
        _endAction(runInfo);
    }
}
function _startAction(actionName, scope, args) {
    var notifySpy = isSpyEnabled() && !!actionName;
    var startTime = 0;
    if (notifySpy && "production" !== "production") { var l, i, flattendArgs }
    var prevDerivation = untrackedStart();
    startBatch();
    var prevAllowStateChanges = allowStateChangesStart(true);
    var prevAllowStateReads = allowStateReadsStart(true);
    var runInfo = {
        prevDerivation: prevDerivation,
        prevAllowStateChanges: prevAllowStateChanges,
        prevAllowStateReads: prevAllowStateReads,
        notifySpy: notifySpy,
        startTime: startTime,
        actionId: nextActionId++,
        parentActionId: currentActionId
    };
    currentActionId = runInfo.actionId;
    return runInfo;
}
function _endAction(runInfo) {
    if (currentActionId !== runInfo.actionId) {
        fail("invalid action stack. did you forget to finish an action?");
    }
    currentActionId = runInfo.parentActionId;
    if (runInfo.error !== undefined) {
        globalState.suppressReactionErrors = true;
    }
    allowStateChangesEnd(runInfo.prevAllowStateChanges);
    allowStateReadsEnd(runInfo.prevAllowStateReads);
    endBatch();
    untrackedEnd(runInfo.prevDerivation);
    if (runInfo.notifySpy && "production" !== "production") {}
    globalState.suppressReactionErrors = false;
}
function mobx_module_allowStateChanges(allowStateChanges, func) {
    var prev = allowStateChangesStart(allowStateChanges);
    var res;
    try {
        res = func();
    }
    finally {
        allowStateChangesEnd(prev);
    }
    return res;
}
function allowStateChangesStart(allowStateChanges) {
    var prev = globalState.allowStateChanges;
    globalState.allowStateChanges = allowStateChanges;
    return prev;
}
function allowStateChangesEnd(prev) {
    globalState.allowStateChanges = prev;
}
function allowStateChangesInsideComputed(func) {
    var prev = globalState.computationDepth;
    globalState.computationDepth = 0;
    var res;
    try {
        res = func();
    }
    finally {
        globalState.computationDepth = prev;
    }
    return res;
}

var mobx_module_ObservableValue = /** @class */ (function (_super) {
    __extends(ObservableValue, _super);
    function ObservableValue(value, enhancer, name, notifySpy, equals) {
        if (name === void 0) { name = "ObservableValue@" + getNextId(); }
        if (notifySpy === void 0) { notifySpy = true; }
        if (equals === void 0) { equals = comparer.default; }
        var _this = _super.call(this, name) || this;
        _this.enhancer = enhancer;
        _this.name = name;
        _this.equals = equals;
        _this.hasUnreportedChange = false;
        _this.value = enhancer(value, undefined, name);
        if (notifySpy && isSpyEnabled() && "production" !== "production") {}
        return _this;
    }
    ObservableValue.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined)
            return this.dehancer(value);
        return value;
    };
    ObservableValue.prototype.set = function (newValue) {
        var oldValue = this.value;
        newValue = this.prepareNewValue(newValue);
        if (newValue !== globalState.UNCHANGED) {
            var notifySpy = isSpyEnabled();
            if (notifySpy && "production" !== "production") {}
            this.setNewValue(newValue);
            if (notifySpy && "production" !== "production")
                {}
        }
    };
    ObservableValue.prototype.prepareNewValue = function (newValue) {
        checkIfStateModificationsAreAllowed(this);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this,
                type: "update",
                newValue: newValue
            });
            if (!change)
                return globalState.UNCHANGED;
            newValue = change.newValue;
        }
        // apply modifier
        newValue = this.enhancer(newValue, this.value, this.name);
        return this.equals(this.value, newValue) ? globalState.UNCHANGED : newValue;
    };
    ObservableValue.prototype.setNewValue = function (newValue) {
        var oldValue = this.value;
        this.value = newValue;
        this.reportChanged();
        if (hasListeners(this)) {
            notifyListeners(this, {
                type: "update",
                object: this,
                newValue: newValue,
                oldValue: oldValue
            });
        }
    };
    ObservableValue.prototype.get = function () {
        this.reportObserved();
        return this.dehanceValue(this.value);
    };
    ObservableValue.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableValue.prototype.observe = function (listener, fireImmediately) {
        if (fireImmediately)
            listener({
                object: this,
                type: "update",
                newValue: this.value,
                oldValue: undefined
            });
        return registerListener(this, listener);
    };
    ObservableValue.prototype.toJSON = function () {
        return this.get();
    };
    ObservableValue.prototype.toString = function () {
        return this.name + "[" + this.value + "]";
    };
    ObservableValue.prototype.valueOf = function () {
        return toPrimitive(this.get());
    };
    ObservableValue.prototype[Symbol.toPrimitive] = function () {
        return this.valueOf();
    };
    return ObservableValue;
}(mobx_module_Atom));
var isObservableValue = createInstanceofPredicate("ObservableValue", mobx_module_ObservableValue);

/**
 * A node in the state dependency root that observes other nodes, and can be observed itself.
 *
 * ComputedValue will remember the result of the computation for the duration of the batch, or
 * while being observed.
 *
 * During this time it will recompute only when one of its direct dependencies changed,
 * but only when it is being accessed with `ComputedValue.get()`.
 *
 * Implementation description:
 * 1. First time it's being accessed it will compute and remember result
 *    give back remembered result until 2. happens
 * 2. First time any deep dependency change, propagate POSSIBLY_STALE to all observers, wait for 3.
 * 3. When it's being accessed, recompute if any shallow dependency changed.
 *    if result changed: propagate STALE to all observers, that were POSSIBLY_STALE from the last step.
 *    go to step 2. either way
 *
 * If at any point it's outside batch and it isn't observed: reset everything and go to 1.
 */
var mobx_module_ComputedValue = /** @class */ (function () {
    /**
     * Create a new computed value based on a function expression.
     *
     * The `name` property is for debug purposes only.
     *
     * The `equals` property specifies the comparer function to use to determine if a newly produced
     * value differs from the previous value. Two comparers are provided in the library; `defaultComparer`
     * compares based on identity comparison (===), and `structualComparer` deeply compares the structure.
     * Structural comparison can be convenient if you always produce a new aggregated object and
     * don't want to notify observers if it is structurally the same.
     * This is useful for working with vectors, mouse coordinates etc.
     */
    function ComputedValue(options) {
        this.dependenciesState = mobx_module_IDerivationState.NOT_TRACKING;
        this.observing = []; // nodes we are looking at. Our value depends on these nodes
        this.newObserving = null; // during tracking it's an array with new observed observers
        this.isBeingObserved = false;
        this.isPendingUnobservation = false;
        this.observers = new Set();
        this.diffValue = 0;
        this.runId = 0;
        this.lastAccessedBy = 0;
        this.lowestObserverState = mobx_module_IDerivationState.UP_TO_DATE;
        this.unboundDepsCount = 0;
        this.__mapid = "#" + getNextId();
        this.value = new mobx_module_CaughtException(null);
        this.isComputing = false; // to check for cycles
        this.isRunningSetter = false;
        this.isTracing = mobx_module_TraceMode.NONE;
        invariant(options.get, "missing option for computed: get");
        this.derivation = options.get;
        this.name = options.name || "ComputedValue@" + getNextId();
        if (options.set)
            this.setter = createAction(this.name + "-setter", options.set);
        this.equals =
            options.equals ||
                (options.compareStructural || options.struct
                    ? comparer.structural
                    : comparer.default);
        this.scope = options.context;
        this.requiresReaction = !!options.requiresReaction;
        this.keepAlive = !!options.keepAlive;
    }
    ComputedValue.prototype.onBecomeStale = function () {
        propagateMaybeChanged(this);
    };
    ComputedValue.prototype.onBecomeObserved = function () {
        if (this.onBecomeObservedListeners) {
            this.onBecomeObservedListeners.forEach(function (listener) { return listener(); });
        }
    };
    ComputedValue.prototype.onBecomeUnobserved = function () {
        if (this.onBecomeUnobservedListeners) {
            this.onBecomeUnobservedListeners.forEach(function (listener) { return listener(); });
        }
    };
    /**
     * Returns the current value of this computed value.
     * Will evaluate its computation first if needed.
     */
    ComputedValue.prototype.get = function () {
        if (this.isComputing)
            fail("Cycle detected in computation " + this.name + ": " + this.derivation);
        if (globalState.inBatch === 0 && this.observers.size === 0 && !this.keepAlive) {
            if (shouldCompute(this)) {
                this.warnAboutUntrackedRead();
                startBatch(); // See perf test 'computed memoization'
                this.value = this.computeValue(false);
                endBatch();
            }
        }
        else {
            reportObserved(this);
            if (shouldCompute(this))
                if (this.trackAndCompute())
                    propagateChangeConfirmed(this);
        }
        var result = this.value;
        if (isCaughtException(result))
            throw result.cause;
        return result;
    };
    ComputedValue.prototype.peek = function () {
        var res = this.computeValue(false);
        if (isCaughtException(res))
            throw res.cause;
        return res;
    };
    ComputedValue.prototype.set = function (value) {
        if (this.setter) {
            invariant(!this.isRunningSetter, "The setter of computed value '" + this.name + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?");
            this.isRunningSetter = true;
            try {
                this.setter.call(this.scope, value);
            }
            finally {
                this.isRunningSetter = false;
            }
        }
        else
            invariant(false,  false &&
                0);
    };
    ComputedValue.prototype.trackAndCompute = function () {
        if (isSpyEnabled() && "production" !== "production") {}
        var oldValue = this.value;
        var wasSuspended = 
        /* see #1208 */ this.dependenciesState === mobx_module_IDerivationState.NOT_TRACKING;
        var newValue = this.computeValue(true);
        var changed = wasSuspended ||
            isCaughtException(oldValue) ||
            isCaughtException(newValue) ||
            !this.equals(oldValue, newValue);
        if (changed) {
            this.value = newValue;
        }
        return changed;
    };
    ComputedValue.prototype.computeValue = function (track) {
        this.isComputing = true;
        globalState.computationDepth++;
        var res;
        if (track) {
            res = trackDerivedFunction(this, this.derivation, this.scope);
        }
        else {
            if (globalState.disableErrorBoundaries === true) {
                res = this.derivation.call(this.scope);
            }
            else {
                try {
                    res = this.derivation.call(this.scope);
                }
                catch (e) {
                    res = new mobx_module_CaughtException(e);
                }
            }
        }
        globalState.computationDepth--;
        this.isComputing = false;
        return res;
    };
    ComputedValue.prototype.suspend = function () {
        if (!this.keepAlive) {
            clearObserving(this);
            this.value = undefined; // don't hold on to computed value!
        }
    };
    ComputedValue.prototype.observe = function (listener, fireImmediately) {
        var _this = this;
        var firstTime = true;
        var prevValue = undefined;
        return autorun(function () {
            var newValue = _this.get();
            if (!firstTime || fireImmediately) {
                var prevU = untrackedStart();
                listener({
                    type: "update",
                    object: _this,
                    newValue: newValue,
                    oldValue: prevValue
                });
                untrackedEnd(prevU);
            }
            firstTime = false;
            prevValue = newValue;
        });
    };
    ComputedValue.prototype.warnAboutUntrackedRead = function () {
        if (true)
            return;
        if (this.requiresReaction === true) {
            fail("[mobx] Computed value " + this.name + " is read outside a reactive context");
        }
        if (this.isTracing !== mobx_module_TraceMode.NONE) {
            console.log("[mobx.trace] '" + this.name + "' is being read outside a reactive context. Doing a full recompute");
        }
        if (globalState.computedRequiresReaction) {
            console.warn("[mobx] Computed value " + this.name + " is being read outside a reactive context. Doing a full recompute");
        }
    };
    ComputedValue.prototype.toJSON = function () {
        return this.get();
    };
    ComputedValue.prototype.toString = function () {
        return this.name + "[" + this.derivation.toString() + "]";
    };
    ComputedValue.prototype.valueOf = function () {
        return toPrimitive(this.get());
    };
    ComputedValue.prototype[Symbol.toPrimitive] = function () {
        return this.valueOf();
    };
    return ComputedValue;
}());
var isComputedValue = createInstanceofPredicate("ComputedValue", mobx_module_ComputedValue);

/**
 * These values will persist if global state is reset
 */
var persistentKeys = (/* unused pure expression or super */ null && ([
    "mobxGuid",
    "spyListeners",
    "enforceActions",
    "computedRequiresReaction",
    "reactionRequiresObservable",
    "observableRequiresReaction",
    "allowStateReads",
    "disableErrorBoundaries",
    "runId",
    "UNCHANGED"
]));
var mobx_module_MobXGlobals = /** @class */ (function () {
    function MobXGlobals() {
        /**
         * MobXGlobals version.
         * MobX compatiblity with other versions loaded in memory as long as this version matches.
         * It indicates that the global state still stores similar information
         *
         * N.B: this version is unrelated to the package version of MobX, and is only the version of the
         * internal state storage of MobX, and can be the same across many different package versions
         */
        this.version = 5;
        /**
         * globally unique token to signal unchanged
         */
        this.UNCHANGED = {};
        /**
         * Currently running derivation
         */
        this.trackingDerivation = null;
        /**
         * Are we running a computation currently? (not a reaction)
         */
        this.computationDepth = 0;
        /**
         * Each time a derivation is tracked, it is assigned a unique run-id
         */
        this.runId = 0;
        /**
         * 'guid' for general purpose. Will be persisted amongst resets.
         */
        this.mobxGuid = 0;
        /**
         * Are we in a batch block? (and how many of them)
         */
        this.inBatch = 0;
        /**
         * Observables that don't have observers anymore, and are about to be
         * suspended, unless somebody else accesses it in the same batch
         *
         * @type {IObservable[]}
         */
        this.pendingUnobservations = [];
        /**
         * List of scheduled, not yet executed, reactions.
         */
        this.pendingReactions = [];
        /**
         * Are we currently processing reactions?
         */
        this.isRunningReactions = false;
        /**
         * Is it allowed to change observables at this point?
         * In general, MobX doesn't allow that when running computations and React.render.
         * To ensure that those functions stay pure.
         */
        this.allowStateChanges = true;
        /**
         * Is it allowed to read observables at this point?
         * Used to hold the state needed for `observableRequiresReaction`
         */
        this.allowStateReads = true;
        /**
         * If strict mode is enabled, state changes are by default not allowed
         */
        this.enforceActions = false;
        /**
         * Spy callbacks
         */
        this.spyListeners = [];
        /**
         * Globally attached error handlers that react specifically to errors in reactions
         */
        this.globalReactionErrorHandlers = [];
        /**
         * Warn if computed values are accessed outside a reactive context
         */
        this.computedRequiresReaction = false;
        /**
         * (Experimental)
         * Warn if you try to create to derivation / reactive context without accessing any observable.
         */
        this.reactionRequiresObservable = false;
        /**
         * (Experimental)
         * Warn if observables are accessed outside a reactive context
         */
        this.observableRequiresReaction = false;
        /**
         * Allows overwriting of computed properties, useful in tests but not prod as it can cause
         * memory leaks. See https://github.com/mobxjs/mobx/issues/1867
         */
        this.computedConfigurable = false;
        /*
         * Don't catch and rethrow exceptions. This is useful for inspecting the state of
         * the stack when an exception occurs while debugging.
         */
        this.disableErrorBoundaries = false;
        /*
         * If true, we are already handling an exception in an action. Any errors in reactions should be suppressed, as
         * they are not the cause, see: https://github.com/mobxjs/mobx/issues/1836
         */
        this.suppressReactionErrors = false;
    }
    return MobXGlobals;
}());
var mockGlobal = {};
function mobx_module_getGlobal() {
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof __webpack_require__.g !== "undefined") {
        return __webpack_require__.g;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    return mockGlobal;
}
var canMergeGlobalState = true;
var isolateCalled = false;
var globalState = (function () {
    var global = mobx_module_getGlobal();
    if (global.__mobxInstanceCount > 0 && !global.__mobxGlobals)
        canMergeGlobalState = false;
    if (global.__mobxGlobals && global.__mobxGlobals.version !== new mobx_module_MobXGlobals().version)
        canMergeGlobalState = false;
    if (!canMergeGlobalState) {
        setTimeout(function () {
            if (!isolateCalled) {
                fail("There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`");
            }
        }, 1);
        return new mobx_module_MobXGlobals();
    }
    else if (global.__mobxGlobals) {
        global.__mobxInstanceCount += 1;
        if (!global.__mobxGlobals.UNCHANGED)
            global.__mobxGlobals.UNCHANGED = {}; // make merge backward compatible
        return global.__mobxGlobals;
    }
    else {
        global.__mobxInstanceCount = 1;
        return (global.__mobxGlobals = new mobx_module_MobXGlobals());
    }
})();
function isolateGlobalState() {
    if (globalState.pendingReactions.length ||
        globalState.inBatch ||
        globalState.isRunningReactions)
        fail("isolateGlobalState should be called before MobX is running any reactions");
    isolateCalled = true;
    if (canMergeGlobalState) {
        if (--mobx_module_getGlobal().__mobxInstanceCount === 0)
            mobx_module_getGlobal().__mobxGlobals = undefined;
        globalState = new mobx_module_MobXGlobals();
    }
}
function getGlobalState() {
    return globalState;
}
/**
 * For testing purposes only; this will break the internal state of existing observables,
 * but can be used to get back at a stable state after throwing errors
 */
function resetGlobalState() {
    var defaultGlobals = new mobx_module_MobXGlobals();
    for (var key in defaultGlobals)
        if (persistentKeys.indexOf(key) === -1)
            globalState[key] = defaultGlobals[key];
    globalState.allowStateChanges = !globalState.enforceActions;
}

function mobx_module_hasObservers(observable) {
    return observable.observers && observable.observers.size > 0;
}
function getObservers(observable) {
    return observable.observers;
}
// function invariantObservers(observable: IObservable) {
//     const list = observable.observers
//     const map = observable.observersIndexes
//     const l = list.length
//     for (let i = 0; i < l; i++) {
//         const id = list[i].__mapid
//         if (i) {
//             invariant(map[id] === i, "INTERNAL ERROR maps derivation.__mapid to index in list") // for performance
//         } else {
//             invariant(!(id in map), "INTERNAL ERROR observer on index 0 shouldn't be held in map.") // for performance
//         }
//     }
//     invariant(
//         list.length === 0 || Object.keys(map).length === list.length - 1,
//         "INTERNAL ERROR there is no junk in map"
//     )
// }
function addObserver(observable, node) {
    // invariant(node.dependenciesState !== -1, "INTERNAL ERROR, can add only dependenciesState !== -1");
    // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR add already added node");
    // invariantObservers(observable);
    observable.observers.add(node);
    if (observable.lowestObserverState > node.dependenciesState)
        observable.lowestObserverState = node.dependenciesState;
    // invariantObservers(observable);
    // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR didn't add node");
}
function removeObserver(observable, node) {
    // invariant(globalState.inBatch > 0, "INTERNAL ERROR, remove should be called only inside batch");
    // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR remove already removed node");
    // invariantObservers(observable);
    observable.observers.delete(node);
    if (observable.observers.size === 0) {
        // deleting last observer
        queueForUnobservation(observable);
    }
    // invariantObservers(observable);
    // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR remove already removed node2");
}
function queueForUnobservation(observable) {
    if (observable.isPendingUnobservation === false) {
        // invariant(observable._observers.length === 0, "INTERNAL ERROR, should only queue for unobservation unobserved observables");
        observable.isPendingUnobservation = true;
        globalState.pendingUnobservations.push(observable);
    }
}
/**
 * Batch starts a transaction, at least for purposes of memoizing ComputedValues when nothing else does.
 * During a batch `onBecomeUnobserved` will be called at most once per observable.
 * Avoids unnecessary recalculations.
 */
function startBatch() {
    globalState.inBatch++;
}
function endBatch() {
    if (--globalState.inBatch === 0) {
        runReactions();
        // the batch is actually about to finish, all unobserving should happen here.
        var list = globalState.pendingUnobservations;
        for (var i = 0; i < list.length; i++) {
            var observable = list[i];
            observable.isPendingUnobservation = false;
            if (observable.observers.size === 0) {
                if (observable.isBeingObserved) {
                    // if this observable had reactive observers, trigger the hooks
                    observable.isBeingObserved = false;
                    observable.onBecomeUnobserved();
                }
                if (observable instanceof mobx_module_ComputedValue) {
                    // computed values are automatically teared down when the last observer leaves
                    // this process happens recursively, this computed might be the last observable of another, etc..
                    observable.suspend();
                }
            }
        }
        globalState.pendingUnobservations = [];
    }
}
function reportObserved(observable) {
    checkIfStateReadsAreAllowed(observable);
    var derivation = globalState.trackingDerivation;
    if (derivation !== null) {
        /**
         * Simple optimization, give each derivation run an unique id (runId)
         * Check if last time this observable was accessed the same runId is used
         * if this is the case, the relation is already known
         */
        if (derivation.runId !== observable.lastAccessedBy) {
            observable.lastAccessedBy = derivation.runId;
            // Tried storing newObserving, or observing, or both as Set, but performance didn't come close...
            derivation.newObserving[derivation.unboundDepsCount++] = observable;
            if (!observable.isBeingObserved) {
                observable.isBeingObserved = true;
                observable.onBecomeObserved();
            }
        }
        return true;
    }
    else if (observable.observers.size === 0 && globalState.inBatch > 0) {
        queueForUnobservation(observable);
    }
    return false;
}
// function invariantLOS(observable: IObservable, msg: string) {
//     // it's expensive so better not run it in produciton. but temporarily helpful for testing
//     const min = getObservers(observable).reduce((a, b) => Math.min(a, b.dependenciesState), 2)
//     if (min >= observable.lowestObserverState) return // <- the only assumption about `lowestObserverState`
//     throw new Error(
//         "lowestObserverState is wrong for " +
//             msg +
//             " because " +
//             min +
//             " < " +
//             observable.lowestObserverState
//     )
// }
/**
 * NOTE: current propagation mechanism will in case of self reruning autoruns behave unexpectedly
 * It will propagate changes to observers from previous run
 * It's hard or maybe impossible (with reasonable perf) to get it right with current approach
 * Hopefully self reruning autoruns aren't a feature people should depend on
 * Also most basic use cases should be ok
 */
// Called by Atom when its value changes
function propagateChanged(observable) {
    // invariantLOS(observable, "changed start");
    if (observable.lowestObserverState === mobx_module_IDerivationState.STALE)
        return;
    observable.lowestObserverState = mobx_module_IDerivationState.STALE;
    // Ideally we use for..of here, but the downcompiled version is really slow...
    observable.observers.forEach(function (d) {
        if (d.dependenciesState === mobx_module_IDerivationState.UP_TO_DATE) {
            if (d.isTracing !== mobx_module_TraceMode.NONE) {
                logTraceInfo(d, observable);
            }
            d.onBecomeStale();
        }
        d.dependenciesState = mobx_module_IDerivationState.STALE;
    });
    // invariantLOS(observable, "changed end");
}
// Called by ComputedValue when it recalculate and its value changed
function propagateChangeConfirmed(observable) {
    // invariantLOS(observable, "confirmed start");
    if (observable.lowestObserverState === mobx_module_IDerivationState.STALE)
        return;
    observable.lowestObserverState = mobx_module_IDerivationState.STALE;
    observable.observers.forEach(function (d) {
        if (d.dependenciesState === mobx_module_IDerivationState.POSSIBLY_STALE)
            d.dependenciesState = mobx_module_IDerivationState.STALE;
        else if (d.dependenciesState === mobx_module_IDerivationState.UP_TO_DATE // this happens during computing of `d`, just keep lowestObserverState up to date.
        )
            observable.lowestObserverState = mobx_module_IDerivationState.UP_TO_DATE;
    });
    // invariantLOS(observable, "confirmed end");
}
// Used by computed when its dependency changed, but we don't wan't to immediately recompute.
function propagateMaybeChanged(observable) {
    // invariantLOS(observable, "maybe start");
    if (observable.lowestObserverState !== mobx_module_IDerivationState.UP_TO_DATE)
        return;
    observable.lowestObserverState = mobx_module_IDerivationState.POSSIBLY_STALE;
    observable.observers.forEach(function (d) {
        if (d.dependenciesState === mobx_module_IDerivationState.UP_TO_DATE) {
            d.dependenciesState = mobx_module_IDerivationState.POSSIBLY_STALE;
            if (d.isTracing !== mobx_module_TraceMode.NONE) {
                logTraceInfo(d, observable);
            }
            d.onBecomeStale();
        }
    });
    // invariantLOS(observable, "maybe end");
}
function logTraceInfo(derivation, observable) {
    console.log("[mobx.trace] '" + derivation.name + "' is invalidated due to a change in: '" + observable.name + "'");
    if (derivation.isTracing === mobx_module_TraceMode.BREAK) {
        var lines = [];
        printDepTree(getDependencyTree(derivation), lines, 1);
        // prettier-ignore
        new Function("debugger;\n/*\nTracing '" + derivation.name + "'\n\nYou are entering this break point because derivation '" + derivation.name + "' is being traced and '" + observable.name + "' is now forcing it to update.\nJust follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update\nThe stackframe you are looking for is at least ~6-8 stack-frames up.\n\n" + (derivation instanceof mobx_module_ComputedValue ? derivation.derivation.toString().replace(/[*]\//g, "/") : "") + "\n\nThe dependencies for this derivation are:\n\n" + lines.join("\n") + "\n*/\n    ")();
    }
}
function printDepTree(tree, lines, depth) {
    if (lines.length >= 1000) {
        lines.push("(and many more)");
        return;
    }
    lines.push("" + new Array(depth).join("\t") + tree.name); // MWE: not the fastest, but the easiest way :)
    if (tree.dependencies)
        tree.dependencies.forEach(function (child) { return printDepTree(child, lines, depth + 1); });
}

var mobx_module_Reaction = /** @class */ (function () {
    function Reaction(name, onInvalidate, errorHandler, requiresObservable) {
        if (name === void 0) { name = "Reaction@" + getNextId(); }
        if (requiresObservable === void 0) { requiresObservable = false; }
        this.name = name;
        this.onInvalidate = onInvalidate;
        this.errorHandler = errorHandler;
        this.requiresObservable = requiresObservable;
        this.observing = []; // nodes we are looking at. Our value depends on these nodes
        this.newObserving = [];
        this.dependenciesState = mobx_module_IDerivationState.NOT_TRACKING;
        this.diffValue = 0;
        this.runId = 0;
        this.unboundDepsCount = 0;
        this.__mapid = "#" + getNextId();
        this.isDisposed = false;
        this._isScheduled = false;
        this._isTrackPending = false;
        this._isRunning = false;
        this.isTracing = mobx_module_TraceMode.NONE;
    }
    Reaction.prototype.onBecomeStale = function () {
        this.schedule();
    };
    Reaction.prototype.schedule = function () {
        if (!this._isScheduled) {
            this._isScheduled = true;
            globalState.pendingReactions.push(this);
            runReactions();
        }
    };
    Reaction.prototype.isScheduled = function () {
        return this._isScheduled;
    };
    /**
     * internal, use schedule() if you intend to kick off a reaction
     */
    Reaction.prototype.runReaction = function () {
        if (!this.isDisposed) {
            startBatch();
            this._isScheduled = false;
            if (shouldCompute(this)) {
                this._isTrackPending = true;
                try {
                    this.onInvalidate();
                    if (this._isTrackPending &&
                        isSpyEnabled() &&
                        "production" !== "production") {}
                }
                catch (e) {
                    this.reportExceptionInDerivation(e);
                }
            }
            endBatch();
        }
    };
    Reaction.prototype.track = function (fn) {
        if (this.isDisposed) {
            return;
            // console.warn("Reaction already disposed") // Note: Not a warning / error in mobx 4 either
        }
        startBatch();
        var notify = isSpyEnabled();
        var startTime;
        if (notify && "production" !== "production") {}
        this._isRunning = true;
        var result = trackDerivedFunction(this, fn, undefined);
        this._isRunning = false;
        this._isTrackPending = false;
        if (this.isDisposed) {
            // disposed during last run. Clean up everything that was bound after the dispose call.
            clearObserving(this);
        }
        if (isCaughtException(result))
            this.reportExceptionInDerivation(result.cause);
        if (notify && "production" !== "production") {}
        endBatch();
    };
    Reaction.prototype.reportExceptionInDerivation = function (error) {
        var _this = this;
        if (this.errorHandler) {
            this.errorHandler(error, this);
            return;
        }
        if (globalState.disableErrorBoundaries)
            throw error;
        var message = "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'";
        if (globalState.suppressReactionErrors) {
            console.warn("[mobx] (error in reaction '" + this.name + "' suppressed, fix error of causing action below)"); // prettier-ignore
        }
        else {
            console.error(message, error);
            /** If debugging brought you here, please, read the above message :-). Tnx! */
        }
        if (isSpyEnabled()) {
            spyReport({
                type: "error",
                name: this.name,
                message: message,
                error: "" + error
            });
        }
        globalState.globalReactionErrorHandlers.forEach(function (f) { return f(error, _this); });
    };
    Reaction.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.isDisposed = true;
            if (!this._isRunning) {
                // if disposed while running, clean up later. Maybe not optimal, but rare case
                startBatch();
                clearObserving(this);
                endBatch();
            }
        }
    };
    Reaction.prototype.getDisposer = function () {
        var r = this.dispose.bind(this);
        r[mobx_module_$mobx] = this;
        return r;
    };
    Reaction.prototype.toString = function () {
        return "Reaction[" + this.name + "]";
    };
    Reaction.prototype.trace = function (enterBreakPoint) {
        if (enterBreakPoint === void 0) { enterBreakPoint = false; }
        trace(this, enterBreakPoint);
    };
    return Reaction;
}());
function onReactionError(handler) {
    globalState.globalReactionErrorHandlers.push(handler);
    return function () {
        var idx = globalState.globalReactionErrorHandlers.indexOf(handler);
        if (idx >= 0)
            globalState.globalReactionErrorHandlers.splice(idx, 1);
    };
}
/**
 * Magic number alert!
 * Defines within how many times a reaction is allowed to re-trigger itself
 * until it is assumed that this is gonna be a never ending loop...
 */
var MAX_REACTION_ITERATIONS = 100;
var mobx_module_reactionScheduler = function (f) { return f(); };
function runReactions() {
    // Trampolining, if runReactions are already running, new reactions will be picked up
    if (globalState.inBatch > 0 || globalState.isRunningReactions)
        return;
    mobx_module_reactionScheduler(runReactionsHelper);
}
function runReactionsHelper() {
    globalState.isRunningReactions = true;
    var allReactions = globalState.pendingReactions;
    var iterations = 0;
    // While running reactions, new reactions might be triggered.
    // Hence we work with two variables and check whether
    // we converge to no remaining reactions after a while.
    while (allReactions.length > 0) {
        if (++iterations === MAX_REACTION_ITERATIONS) {
            console.error("Reaction doesn't converge to a stable state after " + MAX_REACTION_ITERATIONS + " iterations." +
                (" Probably there is a cycle in the reactive function: " + allReactions[0]));
            allReactions.splice(0); // clear reactions
        }
        var remainingReactions = allReactions.splice(0);
        for (var i = 0, l = remainingReactions.length; i < l; i++)
            remainingReactions[i].runReaction();
    }
    globalState.isRunningReactions = false;
}
var isReaction = createInstanceofPredicate("Reaction", mobx_module_Reaction);
function setReactionScheduler(fn) {
    var baseScheduler = mobx_module_reactionScheduler;
    mobx_module_reactionScheduler = function (f) { return fn(function () { return baseScheduler(f); }); };
}

function isSpyEnabled() {
    return  false && 0;
}
function spyReport(event) {
    if (true)
        return; // dead code elimination can do the rest
    if (!globalState.spyListeners.length)
        return;
    var listeners = globalState.spyListeners;
    for (var i = 0, l = listeners.length; i < l; i++)
        listeners[i](event);
}
function spyReportStart(event) {
    if (true)
        return;
    var change = mobx_module_assign(mobx_module_assign({}, event), { spyReportStart: true });
    spyReport(change);
}
var END_EVENT = (/* unused pure expression or super */ null && ({ spyReportEnd: true }));
function spyReportEnd(change) {
    if (true)
        return;
    if (change)
        spyReport(mobx_module_assign(mobx_module_assign({}, change), { spyReportEnd: true }));
    else
        spyReport(END_EVENT);
}
function spy(listener) {
    if (true) {
        console.warn("[mobx.spy] Is a no-op in production builds");
        return function () { };
    }
    else {}
}

function dontReassignFields() {
    fail( false && 0);
}
function namedActionDecorator(name) {
    return function (target, prop, descriptor) {
        if (descriptor) {
            if (false) {}
            // babel / typescript
            // @action method() { }
            if (descriptor.value) {
                // typescript
                return {
                    value: createAction(name, descriptor.value),
                    enumerable: false,
                    configurable: true,
                    writable: true // for typescript, this must be writable, otherwise it cannot inherit :/ (see inheritable actions test)
                };
            }
            // babel only: @action method = () => {}
            var initializer_1 = descriptor.initializer;
            return {
                enumerable: false,
                configurable: true,
                writable: true,
                initializer: function () {
                    // N.B: we can't immediately invoke initializer; this would be wrong
                    return createAction(name, initializer_1.call(this));
                }
            };
        }
        // bound instance methods
        return actionFieldDecorator(name).apply(this, arguments);
    };
}
function actionFieldDecorator(name) {
    // Simple property that writes on first invocation to the current instance
    return function (target, prop, descriptor) {
        Object.defineProperty(target, prop, {
            configurable: true,
            enumerable: false,
            get: function () {
                return undefined;
            },
            set: function (value) {
                addHiddenProp(this, prop, mobx_module_action(name, value));
            }
        });
    };
}
function boundActionDecorator(target, propertyName, descriptor, applyToInstance) {
    if (applyToInstance === true) {
        defineBoundAction(target, propertyName, descriptor.value);
        return null;
    }
    if (descriptor) {
        // if (descriptor.value)
        // Typescript / Babel: @action.bound method() { }
        // also: babel @action.bound method = () => {}
        return {
            configurable: true,
            enumerable: false,
            get: function () {
                defineBoundAction(this, propertyName, descriptor.value || descriptor.initializer.call(this));
                return this[propertyName];
            },
            set: dontReassignFields
        };
    }
    // field decorator Typescript @action.bound method = () => {}
    return {
        enumerable: false,
        configurable: true,
        set: function (v) {
            defineBoundAction(this, propertyName, v);
        },
        get: function () {
            return undefined;
        }
    };
}

var mobx_module_action = function action(arg1, arg2, arg3, arg4) {
    // action(fn() {})
    if (arguments.length === 1 && typeof arg1 === "function")
        return createAction(arg1.name || "<unnamed action>", arg1);
    // action("name", fn() {})
    if (arguments.length === 2 && typeof arg2 === "function")
        return createAction(arg1, arg2);
    // @action("name") fn() {}
    if (arguments.length === 1 && typeof arg1 === "string")
        return namedActionDecorator(arg1);
    // @action fn() {}
    if (arg4 === true) {
        // apply to instance immediately
        addHiddenProp(arg1, arg2, createAction(arg1.name || arg2, arg3.value, this));
    }
    else {
        return namedActionDecorator(arg2).apply(null, arguments);
    }
};
mobx_module_action.bound = boundActionDecorator;
function mobx_module_runInAction(arg1, arg2) {
    var actionName = typeof arg1 === "string" ? arg1 : arg1.name || "<unnamed action>";
    var fn = typeof arg1 === "function" ? arg1 : arg2;
    if (false) {}
    return executeAction(actionName, fn, this, undefined);
}
function isAction(thing) {
    return typeof thing === "function" && thing.isMobxAction === true;
}
function defineBoundAction(target, propertyName, fn) {
    addHiddenProp(target, propertyName, createAction(propertyName, fn.bind(target)));
}

/**
 * Creates a named reactive view and keeps it alive, so that the view is always
 * updated if one of the dependencies changes, even when the view is not further used by something else.
 * @param view The reactive view
 * @returns disposer function, which can be used to stop the view from being updated in the future.
 */
function autorun(view, opts) {
    if (opts === void 0) { opts = EMPTY_OBJECT; }
    if (false) {}
    var name = (opts && opts.name) || view.name || "Autorun@" + getNextId();
    var runSync = !opts.scheduler && !opts.delay;
    var reaction;
    if (runSync) {
        // normal autorun
        reaction = new mobx_module_Reaction(name, function () {
            this.track(reactionRunner);
        }, opts.onError, opts.requiresObservable);
    }
    else {
        var scheduler_1 = createSchedulerFromOptions(opts);
        // debounced autorun
        var isScheduled_1 = false;
        reaction = new mobx_module_Reaction(name, function () {
            if (!isScheduled_1) {
                isScheduled_1 = true;
                scheduler_1(function () {
                    isScheduled_1 = false;
                    if (!reaction.isDisposed)
                        reaction.track(reactionRunner);
                });
            }
        }, opts.onError, opts.requiresObservable);
    }
    function reactionRunner() {
        view(reaction);
    }
    reaction.schedule();
    return reaction.getDisposer();
}
var run = function (f) { return f(); };
function createSchedulerFromOptions(opts) {
    return opts.scheduler
        ? opts.scheduler
        : opts.delay
            ? function (f) { return setTimeout(f, opts.delay); }
            : run;
}
function mobx_module_reaction(expression, effect, opts) {
    if (opts === void 0) { opts = EMPTY_OBJECT; }
    if (false) {}
    var name = opts.name || "Reaction@" + getNextId();
    var effectAction = mobx_module_action(name, opts.onError ? wrapErrorHandler(opts.onError, effect) : effect);
    var runSync = !opts.scheduler && !opts.delay;
    var scheduler = createSchedulerFromOptions(opts);
    var firstTime = true;
    var isScheduled = false;
    var value;
    var equals = opts.compareStructural
        ? comparer.structural
        : opts.equals || comparer.default;
    var r = new mobx_module_Reaction(name, function () {
        if (firstTime || runSync) {
            reactionRunner();
        }
        else if (!isScheduled) {
            isScheduled = true;
            scheduler(reactionRunner);
        }
    }, opts.onError, opts.requiresObservable);
    function reactionRunner() {
        isScheduled = false; // Q: move into reaction runner?
        if (r.isDisposed)
            return;
        var changed = false;
        r.track(function () {
            var nextValue = expression(r);
            changed = firstTime || !equals(value, nextValue);
            value = nextValue;
        });
        if (firstTime && opts.fireImmediately)
            effectAction(value, r);
        if (!firstTime && changed === true)
            effectAction(value, r);
        if (firstTime)
            firstTime = false;
    }
    r.schedule();
    return r.getDisposer();
}
function wrapErrorHandler(errorHandler, baseFn) {
    return function () {
        try {
            return baseFn.apply(this, arguments);
        }
        catch (e) {
            errorHandler.call(this, e);
        }
    };
}

function onBecomeObserved(thing, arg2, arg3) {
    return interceptHook("onBecomeObserved", thing, arg2, arg3);
}
function onBecomeUnobserved(thing, arg2, arg3) {
    return interceptHook("onBecomeUnobserved", thing, arg2, arg3);
}
function interceptHook(hook, thing, arg2, arg3) {
    var atom = typeof arg3 === "function" ? mobx_module_getAtom(thing, arg2) : mobx_module_getAtom(thing);
    var cb = typeof arg3 === "function" ? arg3 : arg2;
    var listenersKey = hook + "Listeners";
    if (atom[listenersKey]) {
        atom[listenersKey].add(cb);
    }
    else {
        atom[listenersKey] = new Set([cb]);
    }
    var orig = atom[hook];
    if (typeof orig !== "function")
        return fail( false && 0);
    return function () {
        var hookListeners = atom[listenersKey];
        if (hookListeners) {
            hookListeners.delete(cb);
            if (hookListeners.size === 0) {
                delete atom[listenersKey];
            }
        }
    };
}

function configure(options) {
    var enforceActions = options.enforceActions, computedRequiresReaction = options.computedRequiresReaction, computedConfigurable = options.computedConfigurable, disableErrorBoundaries = options.disableErrorBoundaries, reactionScheduler = options.reactionScheduler, reactionRequiresObservable = options.reactionRequiresObservable, observableRequiresReaction = options.observableRequiresReaction;
    if (options.isolateGlobalState === true) {
        isolateGlobalState();
    }
    if (enforceActions !== undefined) {
        if (typeof enforceActions === "boolean" || enforceActions === "strict")
            deprecated("Deprecated value for 'enforceActions', use 'false' => '\"never\"', 'true' => '\"observed\"', '\"strict\"' => \"'always'\" instead");
        var ea = void 0;
        switch (enforceActions) {
            case true:
            case "observed":
                ea = true;
                break;
            case false:
            case "never":
                ea = false;
                break;
            case "strict":
            case "always":
                ea = "strict";
                break;
            default:
                fail("Invalid value for 'enforceActions': '" + enforceActions + "', expected 'never', 'always' or 'observed'");
        }
        globalState.enforceActions = ea;
        globalState.allowStateChanges = ea === true || ea === "strict" ? false : true;
    }
    if (computedRequiresReaction !== undefined) {
        globalState.computedRequiresReaction = !!computedRequiresReaction;
    }
    if (reactionRequiresObservable !== undefined) {
        globalState.reactionRequiresObservable = !!reactionRequiresObservable;
    }
    if (observableRequiresReaction !== undefined) {
        globalState.observableRequiresReaction = !!observableRequiresReaction;
        globalState.allowStateReads = !globalState.observableRequiresReaction;
    }
    if (computedConfigurable !== undefined) {
        globalState.computedConfigurable = !!computedConfigurable;
    }
    if (disableErrorBoundaries !== undefined) {
        if (disableErrorBoundaries === true)
            console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled.");
        globalState.disableErrorBoundaries = !!disableErrorBoundaries;
    }
    if (reactionScheduler) {
        setReactionScheduler(reactionScheduler);
    }
}

function mobx_module_decorate(thing, decorators) {
     false &&
        0;
    var target = typeof thing === "function" ? thing.prototype : thing;
    var _loop_1 = function (prop) {
        var propertyDecorators = decorators[prop];
        if (!Array.isArray(propertyDecorators)) {
            propertyDecorators = [propertyDecorators];
        }
         false &&
            0;
        var descriptor = Object.getOwnPropertyDescriptor(target, prop);
        var newDescriptor = propertyDecorators.reduce(function (accDescriptor, decorator) { return decorator(target, prop, accDescriptor); }, descriptor);
        if (newDescriptor)
            Object.defineProperty(target, prop, newDescriptor);
    };
    for (var prop in decorators) {
        _loop_1(prop);
    }
    return thing;
}

function extendObservable(target, properties, decorators, options) {
    if (false) {}
    options = asCreateObservableOptions(options);
    var defaultDecorator = getDefaultDecoratorFromObjectOptions(options);
    initializeInstance(target); // Fixes #1740
    asObservableObject(target, options.name, defaultDecorator.enhancer); // make sure object is observable, even without initial props
    if (properties)
        extendObservableObjectWithProperties(target, properties, decorators, defaultDecorator);
    return target;
}
function getDefaultDecoratorFromObjectOptions(options) {
    return options.defaultDecorator || (options.deep === false ? refDecorator : deepDecorator);
}
function extendObservableObjectWithProperties(target, properties, decorators, defaultDecorator) {
    var e_1, _a, e_2, _b;
    if (false) { var keys_1, key, keys_1_1, keys }
    startBatch();
    try {
        var keys = mobx_module_ownKeys(properties);
        try {
            for (var keys_2 = __values(keys), keys_2_1 = keys_2.next(); !keys_2_1.done; keys_2_1 = keys_2.next()) {
                var key = keys_2_1.value;
                var descriptor = Object.getOwnPropertyDescriptor(properties, key);
                if (false) {}
                var decorator = decorators && key in decorators
                    ? decorators[key]
                    : descriptor.get
                        ? computedDecorator
                        : defaultDecorator;
                if (false)
                    {}
                var resultDescriptor = decorator(target, key, descriptor, true);
                if (resultDescriptor // otherwise, assume already applied, due to `applyToInstance`
                )
                    Object.defineProperty(target, key, resultDescriptor);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (keys_2_1 && !keys_2_1.done && (_b = keys_2.return)) _b.call(keys_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    finally {
        endBatch();
    }
}

function getDependencyTree(thing, property) {
    return nodeToDependencyTree(mobx_module_getAtom(thing, property));
}
function nodeToDependencyTree(node) {
    var result = {
        name: node.name
    };
    if (node.observing && node.observing.length > 0)
        result.dependencies = unique(node.observing).map(nodeToDependencyTree);
    return result;
}
function getObserverTree(thing, property) {
    return nodeToObserverTree(mobx_module_getAtom(thing, property));
}
function nodeToObserverTree(node) {
    var result = {
        name: node.name
    };
    if (mobx_module_hasObservers(node))
        result.observers = Array.from(getObservers(node)).map(nodeToObserverTree);
    return result;
}

var generatorId = 0;
function FlowCancellationError() {
    this.message = "FLOW_CANCELLED";
}
FlowCancellationError.prototype = Object.create(Error.prototype);
function isFlowCancellationError(error) {
    return error instanceof FlowCancellationError;
}
function flow(generator) {
    if (arguments.length !== 1)
        fail( true && "Flow expects 1 argument and cannot be used as decorator");
    var name = generator.name || "<unnamed flow>";
    // Implementation based on https://github.com/tj/co/blob/master/index.js
    return function () {
        var ctx = this;
        var args = arguments;
        var runId = ++generatorId;
        var gen = mobx_module_action(name + " - runid: " + runId + " - init", generator).apply(ctx, args);
        var rejector;
        var pendingPromise = undefined;
        var promise = new Promise(function (resolve, reject) {
            var stepId = 0;
            rejector = reject;
            function onFulfilled(res) {
                pendingPromise = undefined;
                var ret;
                try {
                    ret = mobx_module_action(name + " - runid: " + runId + " - yield " + stepId++, gen.next).call(gen, res);
                }
                catch (e) {
                    return reject(e);
                }
                next(ret);
            }
            function onRejected(err) {
                pendingPromise = undefined;
                var ret;
                try {
                    ret = mobx_module_action(name + " - runid: " + runId + " - yield " + stepId++, gen.throw).call(gen, err);
                }
                catch (e) {
                    return reject(e);
                }
                next(ret);
            }
            function next(ret) {
                if (ret && typeof ret.then === "function") {
                    // an async iterator
                    ret.then(next, reject);
                    return;
                }
                if (ret.done)
                    return resolve(ret.value);
                pendingPromise = Promise.resolve(ret.value);
                return pendingPromise.then(onFulfilled, onRejected);
            }
            onFulfilled(undefined); // kick off the process
        });
        promise.cancel = mobx_module_action(name + " - runid: " + runId + " - cancel", function () {
            try {
                if (pendingPromise)
                    cancelPromise(pendingPromise);
                // Finally block can return (or yield) stuff..
                var res = gen.return(undefined);
                // eat anything that promise would do, it's cancelled!
                var yieldedPromise = Promise.resolve(res.value);
                yieldedPromise.then(noop, noop);
                cancelPromise(yieldedPromise); // maybe it can be cancelled :)
                // reject our original promise
                rejector(new FlowCancellationError());
            }
            catch (e) {
                rejector(e); // there could be a throwing finally block
            }
        });
        return promise;
    };
}
function cancelPromise(promise) {
    if (typeof promise.cancel === "function")
        promise.cancel();
}

function interceptReads(thing, propOrHandler, handler) {
    var target;
    if (mobx_module_isObservableMap(thing) || mobx_module_isObservableArray(thing) || isObservableValue(thing)) {
        target = getAdministration(thing);
    }
    else if (mobx_module_isObservableObject(thing)) {
        if (typeof propOrHandler !== "string")
            return fail( false &&
                0);
        target = getAdministration(thing, propOrHandler);
    }
    else {
        return fail( false &&
            0);
    }
    if (target.dehancer !== undefined)
        return fail( false && 0);
    target.dehancer = typeof propOrHandler === "function" ? propOrHandler : handler;
    return function () {
        target.dehancer = undefined;
    };
}

function intercept(thing, propOrHandler, handler) {
    if (typeof handler === "function")
        return interceptProperty(thing, propOrHandler, handler);
    else
        return interceptInterceptable(thing, propOrHandler);
}
function interceptInterceptable(thing, handler) {
    return getAdministration(thing).intercept(handler);
}
function interceptProperty(thing, property, handler) {
    return getAdministration(thing, property).intercept(handler);
}

function _isComputed(value, property) {
    if (value === null || value === undefined)
        return false;
    if (property !== undefined) {
        if (mobx_module_isObservableObject(value) === false)
            return false;
        if (!value[mobx_module_$mobx].values.has(property))
            return false;
        var atom = mobx_module_getAtom(value, property);
        return isComputedValue(atom);
    }
    return isComputedValue(value);
}
function isComputed(value) {
    if (arguments.length > 1)
        return fail( false &&
            0);
    return _isComputed(value);
}
function isComputedProp(value, propName) {
    if (typeof propName !== "string")
        return fail( false &&
            0);
    return _isComputed(value, propName);
}

function _isObservable(value, property) {
    if (value === null || value === undefined)
        return false;
    if (property !== undefined) {
        if (false)
            {}
        if (mobx_module_isObservableObject(value)) {
            return value[mobx_module_$mobx].values.has(property);
        }
        return false;
    }
    // For first check, see #701
    return (mobx_module_isObservableObject(value) ||
        !!value[mobx_module_$mobx] ||
        isAtom(value) ||
        isReaction(value) ||
        isComputedValue(value));
}
function isObservable(value) {
    if (arguments.length !== 1)
        fail( false &&
            0);
    return _isObservable(value);
}
function isObservableProp(value, propName) {
    if (typeof propName !== "string")
        return fail( false && 0);
    return _isObservable(value, propName);
}

function mobx_module_keys(obj) {
    if (mobx_module_isObservableObject(obj)) {
        return obj[mobx_module_$mobx].getKeys();
    }
    if (mobx_module_isObservableMap(obj)) {
        return Array.from(obj.keys());
    }
    if (isObservableSet(obj)) {
        return Array.from(obj.keys());
    }
    if (mobx_module_isObservableArray(obj)) {
        return obj.map(function (_, index) { return index; });
    }
    return fail( false &&
        0);
}
function mobx_module_values(obj) {
    if (mobx_module_isObservableObject(obj)) {
        return mobx_module_keys(obj).map(function (key) { return obj[key]; });
    }
    if (mobx_module_isObservableMap(obj)) {
        return mobx_module_keys(obj).map(function (key) { return obj.get(key); });
    }
    if (isObservableSet(obj)) {
        return Array.from(obj.values());
    }
    if (mobx_module_isObservableArray(obj)) {
        return obj.slice();
    }
    return fail( false &&
        0);
}
function mobx_module_entries(obj) {
    if (mobx_module_isObservableObject(obj)) {
        return mobx_module_keys(obj).map(function (key) { return [key, obj[key]]; });
    }
    if (mobx_module_isObservableMap(obj)) {
        return mobx_module_keys(obj).map(function (key) { return [key, obj.get(key)]; });
    }
    if (isObservableSet(obj)) {
        return Array.from(obj.entries());
    }
    if (mobx_module_isObservableArray(obj)) {
        return obj.map(function (key, index) { return [index, key]; });
    }
    return fail( false &&
        0);
}
function mobx_module_set(obj, key, value) {
    if (arguments.length === 2 && !isObservableSet(obj)) {
        startBatch();
        var values_1 = key;
        try {
            for (var key_1 in values_1)
                mobx_module_set(obj, key_1, values_1[key_1]);
        }
        finally {
            endBatch();
        }
        return;
    }
    if (mobx_module_isObservableObject(obj)) {
        var adm = obj[mobx_module_$mobx];
        var existingObservable = adm.values.get(key);
        if (existingObservable) {
            adm.write(key, value);
        }
        else {
            adm.addObservableProp(key, value, adm.defaultEnhancer);
        }
    }
    else if (mobx_module_isObservableMap(obj)) {
        obj.set(key, value);
    }
    else if (isObservableSet(obj)) {
        obj.add(key);
    }
    else if (mobx_module_isObservableArray(obj)) {
        if (typeof key !== "number")
            key = parseInt(key, 10);
        invariant(key >= 0, "Not a valid index: '" + key + "'");
        startBatch();
        if (key >= obj.length)
            obj.length = key + 1;
        obj[key] = value;
        endBatch();
    }
    else {
        return fail( false &&
            0);
    }
}
function remove(obj, key) {
    if (mobx_module_isObservableObject(obj)) {
        obj[mobx_module_$mobx].remove(key);
    }
    else if (mobx_module_isObservableMap(obj)) {
        obj.delete(key);
    }
    else if (isObservableSet(obj)) {
        obj.delete(key);
    }
    else if (mobx_module_isObservableArray(obj)) {
        if (typeof key !== "number")
            key = parseInt(key, 10);
        invariant(key >= 0, "Not a valid index: '" + key + "'");
        obj.splice(key, 1);
    }
    else {
        return fail( false &&
            0);
    }
}
function has(obj, key) {
    if (mobx_module_isObservableObject(obj)) {
        // return keys(obj).indexOf(key) >= 0
        var adm = getAdministration(obj);
        return adm.has(key);
    }
    else if (mobx_module_isObservableMap(obj)) {
        return obj.has(key);
    }
    else if (isObservableSet(obj)) {
        return obj.has(key);
    }
    else if (mobx_module_isObservableArray(obj)) {
        return key >= 0 && key < obj.length;
    }
    else {
        return fail( false &&
            0);
    }
}
function mobx_module_get(obj, key) {
    if (!has(obj, key))
        return undefined;
    if (mobx_module_isObservableObject(obj)) {
        return obj[key];
    }
    else if (mobx_module_isObservableMap(obj)) {
        return obj.get(key);
    }
    else if (mobx_module_isObservableArray(obj)) {
        return obj[key];
    }
    else {
        return fail( false &&
            0);
    }
}

function observe(thing, propOrCb, cbOrFire, fireImmediately) {
    if (typeof cbOrFire === "function")
        return observeObservableProperty(thing, propOrCb, cbOrFire, fireImmediately);
    else
        return observeObservable(thing, propOrCb, cbOrFire);
}
function observeObservable(thing, listener, fireImmediately) {
    return getAdministration(thing).observe(listener, fireImmediately);
}
function observeObservableProperty(thing, property, listener, fireImmediately) {
    return getAdministration(thing, property).observe(listener, fireImmediately);
}

var defaultOptions = (/* unused pure expression or super */ null && ({
    detectCycles: true,
    exportMapsAsObjects: true,
    recurseEverything: false
}));
function mobx_module_cache(map, key, value, options) {
    if (options.detectCycles)
        map.set(key, value);
    return value;
}
function toJSHelper(source, options, __alreadySeen) {
    if (!options.recurseEverything && !isObservable(source))
        return source;
    if (typeof source !== "object")
        return source;
    // Directly return null if source is null
    if (source === null)
        return null;
    // Directly return the Date object itself if contained in the observable
    if (source instanceof Date)
        return source;
    if (isObservableValue(source))
        return toJSHelper(source.get(), options, __alreadySeen);
    // make sure we track the keys of the object
    if (isObservable(source))
        mobx_module_keys(source);
    var detectCycles = options.detectCycles === true;
    if (detectCycles && source !== null && __alreadySeen.has(source)) {
        return __alreadySeen.get(source);
    }
    if (mobx_module_isObservableArray(source) || Array.isArray(source)) {
        var res_1 = mobx_module_cache(__alreadySeen, source, [], options);
        var toAdd = source.map(function (value) { return toJSHelper(value, options, __alreadySeen); });
        res_1.length = toAdd.length;
        for (var i = 0, l = toAdd.length; i < l; i++)
            res_1[i] = toAdd[i];
        return res_1;
    }
    if (isObservableSet(source) || Object.getPrototypeOf(source) === Set.prototype) {
        if (options.exportMapsAsObjects === false) {
            var res_2 = mobx_module_cache(__alreadySeen, source, new Set(), options);
            source.forEach(function (value) {
                res_2.add(toJSHelper(value, options, __alreadySeen));
            });
            return res_2;
        }
        else {
            var res_3 = mobx_module_cache(__alreadySeen, source, [], options);
            source.forEach(function (value) {
                res_3.push(toJSHelper(value, options, __alreadySeen));
            });
            return res_3;
        }
    }
    if (mobx_module_isObservableMap(source) || Object.getPrototypeOf(source) === Map.prototype) {
        if (options.exportMapsAsObjects === false) {
            var res_4 = mobx_module_cache(__alreadySeen, source, new Map(), options);
            source.forEach(function (value, key) {
                res_4.set(key, toJSHelper(value, options, __alreadySeen));
            });
            return res_4;
        }
        else {
            var res_5 = mobx_module_cache(__alreadySeen, source, {}, options);
            source.forEach(function (value, key) {
                res_5[key] = toJSHelper(value, options, __alreadySeen);
            });
            return res_5;
        }
    }
    // Fallback to the situation that source is an ObservableObject or a plain object
    var res = mobx_module_cache(__alreadySeen, source, {}, options);
    getPlainObjectKeys(source).forEach(function (key) {
        res[key] = toJSHelper(source[key], options, __alreadySeen);
    });
    return res;
}
function toJS(source, options) {
    // backward compatibility
    if (typeof options === "boolean")
        options = { detectCycles: options };
    if (!options)
        options = defaultOptions;
    options.detectCycles =
        options.detectCycles === undefined
            ? options.recurseEverything === true
            : options.detectCycles === true;
    var __alreadySeen;
    if (options.detectCycles)
        __alreadySeen = new Map();
    return toJSHelper(source, options, __alreadySeen);
}

function trace() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var enterBreakPoint = false;
    if (typeof args[args.length - 1] === "boolean")
        enterBreakPoint = args.pop();
    var derivation = getAtomFromArgs(args);
    if (!derivation) {
        return fail( false &&
            0);
    }
    if (derivation.isTracing === mobx_module_TraceMode.NONE) {
        console.log("[mobx.trace] '" + derivation.name + "' tracing enabled");
    }
    derivation.isTracing = enterBreakPoint ? mobx_module_TraceMode.BREAK : mobx_module_TraceMode.LOG;
}
function getAtomFromArgs(args) {
    switch (args.length) {
        case 0:
            return globalState.trackingDerivation;
        case 1:
            return mobx_module_getAtom(args[0]);
        case 2:
            return mobx_module_getAtom(args[0], args[1]);
    }
}

/**
 * During a transaction no views are updated until the end of the transaction.
 * The transaction will be run synchronously nonetheless.
 *
 * @param action a function that updates some reactive state
 * @returns any value that was returned by the 'action' parameter.
 */
function mobx_module_transaction(action, thisArg) {
    if (thisArg === void 0) { thisArg = undefined; }
    startBatch();
    try {
        return action.apply(thisArg);
    }
    finally {
        endBatch();
    }
}

function when(predicate, arg1, arg2) {
    if (arguments.length === 1 || (arg1 && typeof arg1 === "object"))
        return whenPromise(predicate, arg1);
    return _when(predicate, arg1, arg2 || {});
}
function _when(predicate, effect, opts) {
    var timeoutHandle;
    if (typeof opts.timeout === "number") {
        timeoutHandle = setTimeout(function () {
            if (!disposer[mobx_module_$mobx].isDisposed) {
                disposer();
                var error = new Error("WHEN_TIMEOUT");
                if (opts.onError)
                    opts.onError(error);
                else
                    throw error;
            }
        }, opts.timeout);
    }
    opts.name = opts.name || "When@" + getNextId();
    var effectAction = createAction(opts.name + "-effect", effect);
    var disposer = autorun(function (r) {
        if (predicate()) {
            r.dispose();
            if (timeoutHandle)
                clearTimeout(timeoutHandle);
            effectAction();
        }
    }, opts);
    return disposer;
}
function whenPromise(predicate, opts) {
    if (false)
        {}
    var cancel;
    var res = new Promise(function (resolve, reject) {
        var disposer = _when(predicate, resolve, mobx_module_assign(mobx_module_assign({}, opts), { onError: reject }));
        cancel = function () {
            disposer();
            reject("WHEN_CANCELLED");
        };
    });
    res.cancel = cancel;
    return res;
}

function getAdm(target) {
    return target[mobx_module_$mobx];
}
function isPropertyKey(val) {
    return typeof val === "string" || typeof val === "number" || typeof val === "symbol";
}
// Optimization: we don't need the intermediate objects and could have a completely custom administration for DynamicObjects,
// and skip either the internal values map, or the base object with its property descriptors!
var objectProxyTraps = {
    has: function (target, name) {
        if (name === mobx_module_$mobx || name === "constructor" || name === mobxDidRunLazyInitializersSymbol)
            return true;
        var adm = getAdm(target);
        // MWE: should `in` operator be reactive? If not, below code path will be faster / more memory efficient
        // TODO: check performance stats!
        // if (adm.values.get(name as string)) return true
        if (isPropertyKey(name))
            return adm.has(name);
        return name in target;
    },
    get: function (target, name) {
        if (name === mobx_module_$mobx || name === "constructor" || name === mobxDidRunLazyInitializersSymbol)
            return target[name];
        var adm = getAdm(target);
        var observable = adm.values.get(name);
        if (observable instanceof mobx_module_Atom) {
            var result = observable.get();
            if (result === undefined) {
                // This fixes #1796, because deleting a prop that has an
                // undefined value won't retrigger a observer (no visible effect),
                // the autorun wouldn't subscribe to future key changes (see also next comment)
                adm.has(name);
            }
            return result;
        }
        // make sure we start listening to future keys
        // note that we only do this here for optimization
        if (isPropertyKey(name))
            adm.has(name);
        return target[name];
    },
    set: function (target, name, value) {
        if (!isPropertyKey(name))
            return false;
        mobx_module_set(target, name, value);
        return true;
    },
    deleteProperty: function (target, name) {
        if (!isPropertyKey(name))
            return false;
        var adm = getAdm(target);
        adm.remove(name);
        return true;
    },
    ownKeys: function (target) {
        var adm = getAdm(target);
        adm.keysAtom.reportObserved();
        return Reflect.ownKeys(target);
    },
    preventExtensions: function (target) {
        fail("Dynamic observable objects cannot be frozen");
        return false;
    }
};
function createDynamicObservableObject(base) {
    var proxy = new Proxy(base, objectProxyTraps);
    base[mobx_module_$mobx].proxy = proxy;
    return proxy;
}

function hasInterceptors(interceptable) {
    return interceptable.interceptors !== undefined && interceptable.interceptors.length > 0;
}
function registerInterceptor(interceptable, handler) {
    var interceptors = interceptable.interceptors || (interceptable.interceptors = []);
    interceptors.push(handler);
    return once(function () {
        var idx = interceptors.indexOf(handler);
        if (idx !== -1)
            interceptors.splice(idx, 1);
    });
}
function interceptChange(interceptable, change) {
    var prevU = untrackedStart();
    try {
        // Interceptor can modify the array, copy it to avoid concurrent modification, see #1950
        var interceptors = __spread((interceptable.interceptors || []));
        for (var i = 0, l = interceptors.length; i < l; i++) {
            change = interceptors[i](change);
            invariant(!change || change.type, "Intercept handlers should return nothing or a change object");
            if (!change)
                break;
        }
        return change;
    }
    finally {
        untrackedEnd(prevU);
    }
}

function hasListeners(listenable) {
    return listenable.changeListeners !== undefined && listenable.changeListeners.length > 0;
}
function registerListener(listenable, handler) {
    var listeners = listenable.changeListeners || (listenable.changeListeners = []);
    listeners.push(handler);
    return once(function () {
        var idx = listeners.indexOf(handler);
        if (idx !== -1)
            listeners.splice(idx, 1);
    });
}
function notifyListeners(listenable, change) {
    var prevU = untrackedStart();
    var listeners = listenable.changeListeners;
    if (!listeners)
        return;
    listeners = listeners.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i](change);
    }
    untrackedEnd(prevU);
}

var MAX_SPLICE_SIZE = 10000; // See e.g. https://github.com/mobxjs/mobx/issues/859
var arrayTraps = {
    get: function (target, name) {
        if (name === mobx_module_$mobx)
            return target[mobx_module_$mobx];
        if (name === "length")
            return target[mobx_module_$mobx].getArrayLength();
        if (typeof name === "number") {
            return arrayExtensions.get.call(target, name);
        }
        if (typeof name === "string" && !isNaN(name)) {
            return arrayExtensions.get.call(target, parseInt(name));
        }
        if (arrayExtensions.hasOwnProperty(name)) {
            return arrayExtensions[name];
        }
        return target[name];
    },
    set: function (target, name, value) {
        if (name === "length") {
            target[mobx_module_$mobx].setArrayLength(value);
        }
        if (typeof name === "number") {
            arrayExtensions.set.call(target, name, value);
        }
        if (typeof name === "symbol" || isNaN(name)) {
            target[name] = value;
        }
        else {
            // numeric string
            arrayExtensions.set.call(target, parseInt(name), value);
        }
        return true;
    },
    preventExtensions: function (target) {
        fail("Observable arrays cannot be frozen");
        return false;
    }
};
function createObservableArray(initialValues, enhancer, name, owned) {
    if (name === void 0) { name = "ObservableArray@" + getNextId(); }
    if (owned === void 0) { owned = false; }
    var adm = new mobx_module_ObservableArrayAdministration(name, enhancer, owned);
    addHiddenFinalProp(adm.values, mobx_module_$mobx, adm);
    var proxy = new Proxy(adm.values, arrayTraps);
    adm.proxy = proxy;
    if (initialValues && initialValues.length) {
        var prev = allowStateChangesStart(true);
        adm.spliceWithArray(0, 0, initialValues);
        allowStateChangesEnd(prev);
    }
    return proxy;
}
var mobx_module_ObservableArrayAdministration = /** @class */ (function () {
    function ObservableArrayAdministration(name, enhancer, owned) {
        this.owned = owned;
        this.values = [];
        this.proxy = undefined;
        this.lastKnownLength = 0;
        this.atom = new mobx_module_Atom(name || "ObservableArray@" + getNextId());
        this.enhancer = function (newV, oldV) { return enhancer(newV, oldV, name + "[..]"); };
    }
    ObservableArrayAdministration.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined)
            return this.dehancer(value);
        return value;
    };
    ObservableArrayAdministration.prototype.dehanceValues = function (values) {
        if (this.dehancer !== undefined && values.length > 0)
            return values.map(this.dehancer);
        return values;
    };
    ObservableArrayAdministration.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableArrayAdministration.prototype.observe = function (listener, fireImmediately) {
        if (fireImmediately === void 0) { fireImmediately = false; }
        if (fireImmediately) {
            listener({
                object: this.proxy,
                type: "splice",
                index: 0,
                added: this.values.slice(),
                addedCount: this.values.length,
                removed: [],
                removedCount: 0
            });
        }
        return registerListener(this, listener);
    };
    ObservableArrayAdministration.prototype.getArrayLength = function () {
        this.atom.reportObserved();
        return this.values.length;
    };
    ObservableArrayAdministration.prototype.setArrayLength = function (newLength) {
        if (typeof newLength !== "number" || newLength < 0)
            throw new Error("[mobx.array] Out of range: " + newLength);
        var currentLength = this.values.length;
        if (newLength === currentLength)
            return;
        else if (newLength > currentLength) {
            var newItems = new Array(newLength - currentLength);
            for (var i = 0; i < newLength - currentLength; i++)
                newItems[i] = undefined; // No Array.fill everywhere...
            this.spliceWithArray(currentLength, 0, newItems);
        }
        else
            this.spliceWithArray(newLength, currentLength - newLength);
    };
    ObservableArrayAdministration.prototype.updateArrayLength = function (oldLength, delta) {
        if (oldLength !== this.lastKnownLength)
            throw new Error("[mobx] Modification exception: the internal structure of an observable array was changed.");
        this.lastKnownLength += delta;
    };
    ObservableArrayAdministration.prototype.spliceWithArray = function (index, deleteCount, newItems) {
        var _this = this;
        checkIfStateModificationsAreAllowed(this.atom);
        var length = this.values.length;
        if (index === undefined)
            index = 0;
        else if (index > length)
            index = length;
        else if (index < 0)
            index = Math.max(0, length + index);
        if (arguments.length === 1)
            deleteCount = length - index;
        else if (deleteCount === undefined || deleteCount === null)
            deleteCount = 0;
        else
            deleteCount = Math.max(0, Math.min(deleteCount, length - index));
        if (newItems === undefined)
            newItems = EMPTY_ARRAY;
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this.proxy,
                type: "splice",
                index: index,
                removedCount: deleteCount,
                added: newItems
            });
            if (!change)
                return EMPTY_ARRAY;
            deleteCount = change.removedCount;
            newItems = change.added;
        }
        newItems = newItems.length === 0 ? newItems : newItems.map(function (v) { return _this.enhancer(v, undefined); });
        if (false) { var lengthDelta }
        var res = this.spliceItemsIntoValues(index, deleteCount, newItems);
        if (deleteCount !== 0 || newItems.length !== 0)
            this.notifyArraySplice(index, newItems, res);
        return this.dehanceValues(res);
    };
    ObservableArrayAdministration.prototype.spliceItemsIntoValues = function (index, deleteCount, newItems) {
        var _a;
        if (newItems.length < MAX_SPLICE_SIZE) {
            return (_a = this.values).splice.apply(_a, __spread([index, deleteCount], newItems));
        }
        else {
            var res = this.values.slice(index, index + deleteCount);
            this.values = this.values
                .slice(0, index)
                .concat(newItems, this.values.slice(index + deleteCount));
            return res;
        }
    };
    ObservableArrayAdministration.prototype.notifyArrayChildUpdate = function (index, newValue, oldValue) {
        var notifySpy = !this.owned && isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy
            ? {
                object: this.proxy,
                type: "update",
                index: index,
                newValue: newValue,
                oldValue: oldValue
            }
            : null;
        // The reason why this is on right hand side here (and not above), is this way the uglifier will drop it, but it won't
        // cause any runtime overhead in development mode without NODE_ENV set, unless spying is enabled
        if (notifySpy && "production" !== "production")
            {}
        this.atom.reportChanged();
        if (notify)
            notifyListeners(this, change);
        if (notifySpy && "production" !== "production")
            {}
    };
    ObservableArrayAdministration.prototype.notifyArraySplice = function (index, added, removed) {
        var notifySpy = !this.owned && isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy
            ? {
                object: this.proxy,
                type: "splice",
                index: index,
                removed: removed,
                added: added,
                removedCount: removed.length,
                addedCount: added.length
            }
            : null;
        if (notifySpy && "production" !== "production")
            {}
        this.atom.reportChanged();
        // conform: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe
        if (notify)
            notifyListeners(this, change);
        if (notifySpy && "production" !== "production")
            {}
    };
    return ObservableArrayAdministration;
}());
var arrayExtensions = {
    intercept: function (handler) {
        return this[mobx_module_$mobx].intercept(handler);
    },
    observe: function (listener, fireImmediately) {
        if (fireImmediately === void 0) { fireImmediately = false; }
        var adm = this[mobx_module_$mobx];
        return adm.observe(listener, fireImmediately);
    },
    clear: function () {
        return this.splice(0);
    },
    replace: function (newItems) {
        var adm = this[mobx_module_$mobx];
        return adm.spliceWithArray(0, adm.values.length, newItems);
    },
    /**
     * Converts this array back to a (shallow) javascript structure.
     * For a deep clone use mobx.toJS
     */
    toJS: function () {
        return this.slice();
    },
    toJSON: function () {
        // Used by JSON.stringify
        return this.toJS();
    },
    /*
     * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
     * since these functions alter the inner structure of the array, the have side effects.
     * Because the have side effects, they should not be used in computed function,
     * and for that reason the do not call dependencyState.notifyObserved
     */
    splice: function (index, deleteCount) {
        var newItems = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            newItems[_i - 2] = arguments[_i];
        }
        var adm = this[mobx_module_$mobx];
        switch (arguments.length) {
            case 0:
                return [];
            case 1:
                return adm.spliceWithArray(index);
            case 2:
                return adm.spliceWithArray(index, deleteCount);
        }
        return adm.spliceWithArray(index, deleteCount, newItems);
    },
    spliceWithArray: function (index, deleteCount, newItems) {
        var adm = this[mobx_module_$mobx];
        return adm.spliceWithArray(index, deleteCount, newItems);
    },
    push: function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var adm = this[mobx_module_$mobx];
        adm.spliceWithArray(adm.values.length, 0, items);
        return adm.values.length;
    },
    pop: function () {
        return this.splice(Math.max(this[mobx_module_$mobx].values.length - 1, 0), 1)[0];
    },
    shift: function () {
        return this.splice(0, 1)[0];
    },
    unshift: function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var adm = this[mobx_module_$mobx];
        adm.spliceWithArray(0, 0, items);
        return adm.values.length;
    },
    reverse: function () {
        // reverse by default mutates in place before returning the result
        // which makes it both a 'derivation' and a 'mutation'.
        // so we deviate from the default and just make it an dervitation
        if (false) {}
        var clone = this.slice();
        return clone.reverse.apply(clone, arguments);
    },
    sort: function (compareFn) {
        // sort by default mutates in place before returning the result
        // which goes against all good practices. Let's not change the array in place!
        if (false) {}
        var clone = this.slice();
        return clone.sort.apply(clone, arguments);
    },
    remove: function (value) {
        var adm = this[mobx_module_$mobx];
        var idx = adm.dehanceValues(adm.values).indexOf(value);
        if (idx > -1) {
            this.splice(idx, 1);
            return true;
        }
        return false;
    },
    get: function (index) {
        var adm = this[mobx_module_$mobx];
        if (adm) {
            if (index < adm.values.length) {
                adm.atom.reportObserved();
                return adm.dehanceValue(adm.values[index]);
            }
            console.warn("[mobx.array] Attempt to read an array index (" + index + ") that is out of bounds (" + adm.values.length + "). Please check length first. Out of bound indices will not be tracked by MobX");
        }
        return undefined;
    },
    set: function (index, newValue) {
        var adm = this[mobx_module_$mobx];
        var values = adm.values;
        if (index < values.length) {
            // update at index in range
            checkIfStateModificationsAreAllowed(adm.atom);
            var oldValue = values[index];
            if (hasInterceptors(adm)) {
                var change = interceptChange(adm, {
                    type: "update",
                    object: adm.proxy,
                    index: index,
                    newValue: newValue
                });
                if (!change)
                    return;
                newValue = change.newValue;
            }
            newValue = adm.enhancer(newValue, oldValue);
            var changed = newValue !== oldValue;
            if (changed) {
                values[index] = newValue;
                adm.notifyArrayChildUpdate(index, newValue, oldValue);
            }
        }
        else if (index === values.length) {
            // add a new item
            adm.spliceWithArray(index, 0, [newValue]);
        }
        else {
            // out of bounds
            throw new Error("[mobx.array] Index out of bounds, " + index + " is larger than " + values.length);
        }
    }
};
[
    "concat",
    "flat",
    "includes",
    "indexOf",
    "join",
    "lastIndexOf",
    "slice",
    "toString",
    "toLocaleString"
].forEach(function (funcName) {
    // Feature detection (eg flat may not be available)
    if (typeof Array.prototype[funcName] !== "function") {
        return;
    }
    arrayExtensions[funcName] = function () {
        var adm = this[mobx_module_$mobx];
        adm.atom.reportObserved();
        var dehancedValues = adm.dehanceValues(adm.values);
        return dehancedValues[funcName].apply(dehancedValues, arguments);
    };
});
["every", "filter", "find", "findIndex", "flatMap", "forEach", "map", "some"].forEach(function (funcName) {
    // Feature detection (eg flatMap may not be available)
    if (typeof Array.prototype[funcName] !== "function") {
        return;
    }
    arrayExtensions[funcName] = function (callback, thisArg) {
        var _this = this;
        var adm = this[mobx_module_$mobx];
        adm.atom.reportObserved();
        var dehancedValues = adm.dehanceValues(adm.values);
        return dehancedValues[funcName](function (element, index) {
            return callback.call(thisArg, element, index, _this);
        }, thisArg);
    };
});
["reduce", "reduceRight"].forEach(function (funcName) {
    arrayExtensions[funcName] = function () {
        var _this = this;
        var adm = this[mobx_module_$mobx];
        adm.atom.reportObserved();
        // #2432 - reduce behavior depends on arguments.length
        var callback = arguments[0];
        arguments[0] = function (accumulator, currentValue, index) {
            currentValue = adm.dehanceValue(currentValue);
            return callback(accumulator, currentValue, index, _this);
        };
        return adm.values[funcName].apply(adm.values, arguments);
    };
});
var isObservableArrayAdministration = createInstanceofPredicate("ObservableArrayAdministration", mobx_module_ObservableArrayAdministration);
function mobx_module_isObservableArray(thing) {
    return isObject(thing) && isObservableArrayAdministration(thing[mobx_module_$mobx]);
}

var mobx_module_a;
var ObservableMapMarker = {};
// just extend Map? See also https://gist.github.com/nestharus/13b4d74f2ef4a2f4357dbd3fc23c1e54
// But: https://github.com/mobxjs/mobx/issues/1556
var mobx_module_ObservableMap = /** @class */ (function () {
    function ObservableMap(initialData, enhancer, name) {
        if (enhancer === void 0) { enhancer = deepEnhancer; }
        if (name === void 0) { name = "ObservableMap@" + getNextId(); }
        this.enhancer = enhancer;
        this.name = name;
        this[mobx_module_a] = ObservableMapMarker;
        this._keysAtom = mobx_module_createAtom(this.name + ".keys()");
        this[Symbol.toStringTag] = "Map";
        if (typeof Map !== "function") {
            throw new Error("mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js");
        }
        this._data = new Map();
        this._hasMap = new Map();
        this.merge(initialData);
    }
    ObservableMap.prototype._has = function (key) {
        return this._data.has(key);
    };
    ObservableMap.prototype.has = function (key) {
        var _this = this;
        if (!globalState.trackingDerivation)
            return this._has(key);
        var entry = this._hasMap.get(key);
        if (!entry) {
            // todo: replace with atom (breaking change)
            var newEntry = (entry = new mobx_module_ObservableValue(this._has(key), referenceEnhancer, this.name + "." + stringifyKey(key) + "?", false));
            this._hasMap.set(key, newEntry);
            onBecomeUnobserved(newEntry, function () { return _this._hasMap.delete(key); });
        }
        return entry.get();
    };
    ObservableMap.prototype.set = function (key, value) {
        var hasKey = this._has(key);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: hasKey ? "update" : "add",
                object: this,
                newValue: value,
                name: key
            });
            if (!change)
                return this;
            value = change.newValue;
        }
        if (hasKey) {
            this._updateValue(key, value);
        }
        else {
            this._addValue(key, value);
        }
        return this;
    };
    ObservableMap.prototype.delete = function (key) {
        var _this = this;
        checkIfStateModificationsAreAllowed(this._keysAtom);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "delete",
                object: this,
                name: key
            });
            if (!change)
                return false;
        }
        if (this._has(key)) {
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy
                ? {
                    type: "delete",
                    object: this,
                    oldValue: this._data.get(key).value,
                    name: key
                }
                : null;
            if (notifySpy && "production" !== "production")
                {}
            mobx_module_transaction(function () {
                _this._keysAtom.reportChanged();
                _this._updateHasMapEntry(key, false);
                var observable = _this._data.get(key);
                observable.setNewValue(undefined);
                _this._data.delete(key);
            });
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && "production" !== "production")
                {}
            return true;
        }
        return false;
    };
    ObservableMap.prototype._updateHasMapEntry = function (key, value) {
        var entry = this._hasMap.get(key);
        if (entry) {
            entry.setNewValue(value);
        }
    };
    ObservableMap.prototype._updateValue = function (key, newValue) {
        var observable = this._data.get(key);
        newValue = observable.prepareNewValue(newValue);
        if (newValue !== globalState.UNCHANGED) {
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy
                ? {
                    type: "update",
                    object: this,
                    oldValue: observable.value,
                    name: key,
                    newValue: newValue
                }
                : null;
            if (notifySpy && "production" !== "production")
                {}
            observable.setNewValue(newValue);
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && "production" !== "production")
                {}
        }
    };
    ObservableMap.prototype._addValue = function (key, newValue) {
        var _this = this;
        checkIfStateModificationsAreAllowed(this._keysAtom);
        mobx_module_transaction(function () {
            var observable = new mobx_module_ObservableValue(newValue, _this.enhancer, _this.name + "." + stringifyKey(key), false);
            _this._data.set(key, observable);
            newValue = observable.value; // value might have been changed
            _this._updateHasMapEntry(key, true);
            _this._keysAtom.reportChanged();
        });
        var notifySpy = isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy
            ? {
                type: "add",
                object: this,
                name: key,
                newValue: newValue
            }
            : null;
        if (notifySpy && "production" !== "production")
            {}
        if (notify)
            notifyListeners(this, change);
        if (notifySpy && "production" !== "production")
            {}
    };
    ObservableMap.prototype.get = function (key) {
        if (this.has(key))
            return this.dehanceValue(this._data.get(key).get());
        return this.dehanceValue(undefined);
    };
    ObservableMap.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined) {
            return this.dehancer(value);
        }
        return value;
    };
    ObservableMap.prototype.keys = function () {
        this._keysAtom.reportObserved();
        return this._data.keys();
    };
    ObservableMap.prototype.values = function () {
        var self = this;
        var keys = this.keys();
        return makeIterable({
            next: function () {
                var _b = keys.next(), done = _b.done, value = _b.value;
                return {
                    done: done,
                    value: done ? undefined : self.get(value)
                };
            }
        });
    };
    ObservableMap.prototype.entries = function () {
        var self = this;
        var keys = this.keys();
        return makeIterable({
            next: function () {
                var _b = keys.next(), done = _b.done, value = _b.value;
                return {
                    done: done,
                    value: done ? undefined : [value, self.get(value)]
                };
            }
        });
    };
    ObservableMap.prototype[(mobx_module_a = mobx_module_$mobx, Symbol.iterator)] = function () {
        return this.entries();
    };
    ObservableMap.prototype.forEach = function (callback, thisArg) {
        var e_1, _b;
        try {
            for (var _c = __values(this), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), key = _e[0], value = _e[1];
                callback.call(thisArg, value, key, this);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /** Merge another object into this object, returns this. */
    ObservableMap.prototype.merge = function (other) {
        var _this = this;
        if (mobx_module_isObservableMap(other)) {
            other = other.toJS();
        }
        mobx_module_transaction(function () {
            var prev = allowStateChangesStart(true);
            try {
                if (mobx_module_isPlainObject(other))
                    getPlainObjectKeys(other).forEach(function (key) {
                        return _this.set(key, other[key]);
                    });
                else if (Array.isArray(other))
                    other.forEach(function (_b) {
                        var _c = __read(_b, 2), key = _c[0], value = _c[1];
                        return _this.set(key, value);
                    });
                else if (isES6Map(other)) {
                    if (other.constructor !== Map)
                        fail("Cannot initialize from classes that inherit from Map: " + other.constructor.name); // prettier-ignore
                    other.forEach(function (value, key) { return _this.set(key, value); });
                }
                else if (other !== null && other !== undefined)
                    fail("Cannot initialize map from " + other);
            }
            finally {
                allowStateChangesEnd(prev);
            }
        });
        return this;
    };
    ObservableMap.prototype.clear = function () {
        var _this = this;
        mobx_module_transaction(function () {
            mobx_module_untracked(function () {
                var e_2, _b;
                try {
                    for (var _c = __values(_this.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var key = _d.value;
                        _this.delete(key);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            });
        });
    };
    ObservableMap.prototype.replace = function (values) {
        var _this = this;
        // Implementation requirements:
        // - respect ordering of replacement map
        // - allow interceptors to run and potentially prevent individual operations
        // - don't recreate observables that already exist in original map (so we don't destroy existing subscriptions)
        // - don't _keysAtom.reportChanged if the keys of resulting map are indentical (order matters!)
        // - note that result map may differ from replacement map due to the interceptors
        mobx_module_transaction(function () {
            var e_3, _b, e_4, _c;
            // Convert to map so we can do quick key lookups
            var replacementMap = convertToMap(values);
            var orderedData = new Map();
            // Used for optimization
            var keysReportChangedCalled = false;
            try {
                // Delete keys that don't exist in replacement map
                // if the key deletion is prevented by interceptor
                // add entry at the beginning of the result map
                for (var _d = __values(_this._data.keys()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var key = _e.value;
                    // Concurrently iterating/deleting keys
                    // iterator should handle this correctly
                    if (!replacementMap.has(key)) {
                        var deleted = _this.delete(key);
                        // Was the key removed?
                        if (deleted) {
                            // _keysAtom.reportChanged() was already called
                            keysReportChangedCalled = true;
                        }
                        else {
                            // Delete prevented by interceptor
                            var value = _this._data.get(key);
                            orderedData.set(key, value);
                        }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                // Merge entries
                for (var _f = __values(replacementMap.entries()), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var _h = __read(_g.value, 2), key = _h[0], value = _h[1];
                    // We will want to know whether a new key is added
                    var keyExisted = _this._data.has(key);
                    // Add or update value
                    _this.set(key, value);
                    // The addition could have been prevent by interceptor
                    if (_this._data.has(key)) {
                        // The update could have been prevented by interceptor
                        // and also we want to preserve existing values
                        // so use value from _data map (instead of replacement map)
                        var value_1 = _this._data.get(key);
                        orderedData.set(key, value_1);
                        // Was a new key added?
                        if (!keyExisted) {
                            // _keysAtom.reportChanged() was already called
                            keysReportChangedCalled = true;
                        }
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                }
                finally { if (e_4) throw e_4.error; }
            }
            // Check for possible key order change
            if (!keysReportChangedCalled) {
                if (_this._data.size !== orderedData.size) {
                    // If size differs, keys are definitely modified
                    _this._keysAtom.reportChanged();
                }
                else {
                    var iter1 = _this._data.keys();
                    var iter2 = orderedData.keys();
                    var next1 = iter1.next();
                    var next2 = iter2.next();
                    while (!next1.done) {
                        if (next1.value !== next2.value) {
                            _this._keysAtom.reportChanged();
                            break;
                        }
                        next1 = iter1.next();
                        next2 = iter2.next();
                    }
                }
            }
            // Use correctly ordered map
            _this._data = orderedData;
        });
        return this;
    };
    Object.defineProperty(ObservableMap.prototype, "size", {
        get: function () {
            this._keysAtom.reportObserved();
            return this._data.size;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a plain object that represents this map.
     * Note that all the keys being stringified.
     * If there are duplicating keys after converting them to strings, behaviour is undetermined.
     */
    ObservableMap.prototype.toPOJO = function () {
        var e_5, _b;
        var res = {};
        try {
            for (var _c = __values(this), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), key = _e[0], value = _e[1];
                // We lie about symbol key types due to https://github.com/Microsoft/TypeScript/issues/1863
                res[typeof key === "symbol" ? key : stringifyKey(key)] = value;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return res;
    };
    /**
     * Returns a shallow non observable object clone of this map.
     * Note that the values migth still be observable. For a deep clone use mobx.toJS.
     */
    ObservableMap.prototype.toJS = function () {
        return new Map(this);
    };
    ObservableMap.prototype.toJSON = function () {
        // Used by JSON.stringify
        return this.toPOJO();
    };
    ObservableMap.prototype.toString = function () {
        var _this = this;
        return (this.name +
            "[{ " +
            Array.from(this.keys())
                .map(function (key) { return stringifyKey(key) + ": " + ("" + _this.get(key)); })
                .join(", ") +
            " }]");
    };
    /**
     * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
     * for callback details
     */
    ObservableMap.prototype.observe = function (listener, fireImmediately) {
         false &&
            0;
        return registerListener(this, listener);
    };
    ObservableMap.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    return ObservableMap;
}());
/* 'var' fixes small-build issue */
var mobx_module_isObservableMap = createInstanceofPredicate("ObservableMap", mobx_module_ObservableMap);

var _a$1;
var ObservableSetMarker = {};
var mobx_module_ObservableSet = /** @class */ (function () {
    function ObservableSet(initialData, enhancer, name) {
        if (enhancer === void 0) { enhancer = deepEnhancer; }
        if (name === void 0) { name = "ObservableSet@" + getNextId(); }
        this.name = name;
        this[_a$1] = ObservableSetMarker;
        this._data = new Set();
        this._atom = mobx_module_createAtom(this.name);
        this[Symbol.toStringTag] = "Set";
        if (typeof Set !== "function") {
            throw new Error("mobx.set requires Set polyfill for the current browser. Check babel-polyfill or core-js/es6/set.js");
        }
        this.enhancer = function (newV, oldV) { return enhancer(newV, oldV, name); };
        if (initialData) {
            this.replace(initialData);
        }
    }
    ObservableSet.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined) {
            return this.dehancer(value);
        }
        return value;
    };
    ObservableSet.prototype.clear = function () {
        var _this = this;
        mobx_module_transaction(function () {
            mobx_module_untracked(function () {
                var e_1, _b;
                try {
                    for (var _c = __values(_this._data.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var value = _d.value;
                        _this.delete(value);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            });
        });
    };
    ObservableSet.prototype.forEach = function (callbackFn, thisArg) {
        var e_2, _b;
        try {
            for (var _c = __values(this), _d = _c.next(); !_d.done; _d = _c.next()) {
                var value = _d.value;
                callbackFn.call(thisArg, value, value, this);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Object.defineProperty(ObservableSet.prototype, "size", {
        get: function () {
            this._atom.reportObserved();
            return this._data.size;
        },
        enumerable: true,
        configurable: true
    });
    ObservableSet.prototype.add = function (value) {
        var _this = this;
        checkIfStateModificationsAreAllowed(this._atom);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "add",
                object: this,
                newValue: value
            });
            if (!change)
                return this;
            // TODO: ideally, value = change.value would be done here, so that values can be
            // changed by interceptor. Same applies for other Set and Map api's.
        }
        if (!this.has(value)) {
            mobx_module_transaction(function () {
                _this._data.add(_this.enhancer(value, undefined));
                _this._atom.reportChanged();
            });
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy
                ? {
                    type: "add",
                    object: this,
                    newValue: value
                }
                : null;
            if (notifySpy && "production" !== "production")
                {}
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && "production" !== "production")
                {}
        }
        return this;
    };
    ObservableSet.prototype.delete = function (value) {
        var _this = this;
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "delete",
                object: this,
                oldValue: value
            });
            if (!change)
                return false;
        }
        if (this.has(value)) {
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy
                ? {
                    type: "delete",
                    object: this,
                    oldValue: value
                }
                : null;
            if (notifySpy && "production" !== "production")
                {}
            mobx_module_transaction(function () {
                _this._atom.reportChanged();
                _this._data.delete(value);
            });
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && "production" !== "production")
                {}
            return true;
        }
        return false;
    };
    ObservableSet.prototype.has = function (value) {
        this._atom.reportObserved();
        return this._data.has(this.dehanceValue(value));
    };
    ObservableSet.prototype.entries = function () {
        var nextIndex = 0;
        var keys = Array.from(this.keys());
        var values = Array.from(this.values());
        return makeIterable({
            next: function () {
                var index = nextIndex;
                nextIndex += 1;
                return index < values.length
                    ? { value: [keys[index], values[index]], done: false }
                    : { done: true };
            }
        });
    };
    ObservableSet.prototype.keys = function () {
        return this.values();
    };
    ObservableSet.prototype.values = function () {
        this._atom.reportObserved();
        var self = this;
        var nextIndex = 0;
        var observableValues = Array.from(this._data.values());
        return makeIterable({
            next: function () {
                return nextIndex < observableValues.length
                    ? { value: self.dehanceValue(observableValues[nextIndex++]), done: false }
                    : { done: true };
            }
        });
    };
    ObservableSet.prototype.replace = function (other) {
        var _this = this;
        if (isObservableSet(other)) {
            other = other.toJS();
        }
        mobx_module_transaction(function () {
            var prev = allowStateChangesStart(true);
            try {
                if (Array.isArray(other)) {
                    _this.clear();
                    other.forEach(function (value) { return _this.add(value); });
                }
                else if (isES6Set(other)) {
                    _this.clear();
                    other.forEach(function (value) { return _this.add(value); });
                }
                else if (other !== null && other !== undefined) {
                    fail("Cannot initialize set from " + other);
                }
            }
            finally {
                allowStateChangesEnd(prev);
            }
        });
        return this;
    };
    ObservableSet.prototype.observe = function (listener, fireImmediately) {
        // TODO 'fireImmediately' can be true?
         false &&
            0;
        return registerListener(this, listener);
    };
    ObservableSet.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableSet.prototype.toJS = function () {
        return new Set(this);
    };
    ObservableSet.prototype.toString = function () {
        return this.name + "[ " + Array.from(this).join(", ") + " ]";
    };
    ObservableSet.prototype[(_a$1 = mobx_module_$mobx, Symbol.iterator)] = function () {
        return this.values();
    };
    return ObservableSet;
}());
var isObservableSet = createInstanceofPredicate("ObservableSet", mobx_module_ObservableSet);

var mobx_module_ObservableObjectAdministration = /** @class */ (function () {
    function ObservableObjectAdministration(target, values, name, defaultEnhancer) {
        if (values === void 0) { values = new Map(); }
        this.target = target;
        this.values = values;
        this.name = name;
        this.defaultEnhancer = defaultEnhancer;
        this.keysAtom = new mobx_module_Atom(name + ".keys");
    }
    ObservableObjectAdministration.prototype.read = function (key) {
        return this.values.get(key).get();
    };
    ObservableObjectAdministration.prototype.write = function (key, newValue) {
        var instance = this.target;
        var observable = this.values.get(key);
        if (observable instanceof mobx_module_ComputedValue) {
            observable.set(newValue);
            return;
        }
        // intercept
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "update",
                object: this.proxy || instance,
                name: key,
                newValue: newValue
            });
            if (!change)
                return;
            newValue = change.newValue;
        }
        newValue = observable.prepareNewValue(newValue);
        // notify spy & observers
        if (newValue !== globalState.UNCHANGED) {
            var notify = hasListeners(this);
            var notifySpy = isSpyEnabled();
            var change = notify || notifySpy
                ? {
                    type: "update",
                    object: this.proxy || instance,
                    oldValue: observable.value,
                    name: key,
                    newValue: newValue
                }
                : null;
            if (notifySpy && "production" !== "production")
                {}
            observable.setNewValue(newValue);
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && "production" !== "production")
                {}
        }
    };
    ObservableObjectAdministration.prototype.has = function (key) {
        var map = this.pendingKeys || (this.pendingKeys = new Map());
        var entry = map.get(key);
        if (entry)
            return entry.get();
        else {
            var exists = !!this.values.get(key);
            // Possible optimization: Don't have a separate map for non existing keys,
            // but store them in the values map instead, using a special symbol to denote "not existing"
            entry = new mobx_module_ObservableValue(exists, referenceEnhancer, this.name + "." + stringifyKey(key) + "?", false);
            map.set(key, entry);
            return entry.get(); // read to subscribe
        }
    };
    ObservableObjectAdministration.prototype.addObservableProp = function (propName, newValue, enhancer) {
        if (enhancer === void 0) { enhancer = this.defaultEnhancer; }
        var target = this.target;
        assertPropertyConfigurable(target, propName);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this.proxy || target,
                name: propName,
                type: "add",
                newValue: newValue
            });
            if (!change)
                return;
            newValue = change.newValue;
        }
        var observable = new mobx_module_ObservableValue(newValue, enhancer, this.name + "." + stringifyKey(propName), false);
        this.values.set(propName, observable);
        newValue = observable.value; // observableValue might have changed it
        Object.defineProperty(target, propName, generateObservablePropConfig(propName));
        this.notifyPropertyAddition(propName, newValue);
    };
    ObservableObjectAdministration.prototype.addComputedProp = function (propertyOwner, // where is the property declared?
    propName, options) {
        var target = this.target;
        options.name = options.name || this.name + "." + stringifyKey(propName);
        this.values.set(propName, new mobx_module_ComputedValue(options));
        if (propertyOwner === target || isPropertyConfigurable(propertyOwner, propName))
            Object.defineProperty(propertyOwner, propName, generateComputedPropConfig(propName));
    };
    ObservableObjectAdministration.prototype.remove = function (key) {
        if (!this.values.has(key))
            return;
        var target = this.target;
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this.proxy || target,
                name: key,
                type: "remove"
            });
            if (!change)
                return;
        }
        try {
            startBatch();
            var notify = hasListeners(this);
            var notifySpy = isSpyEnabled();
            var oldObservable = this.values.get(key);
            var oldValue = oldObservable && oldObservable.get();
            oldObservable && oldObservable.set(undefined);
            // notify key and keyset listeners
            this.keysAtom.reportChanged();
            this.values.delete(key);
            if (this.pendingKeys) {
                var entry = this.pendingKeys.get(key);
                if (entry)
                    entry.set(false);
            }
            // delete the prop
            delete this.target[key];
            var change = notify || notifySpy
                ? {
                    type: "remove",
                    object: this.proxy || target,
                    oldValue: oldValue,
                    name: key
                }
                : null;
            if (notifySpy && "production" !== "production")
                {}
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && "production" !== "production")
                {}
        }
        finally {
            endBatch();
        }
    };
    ObservableObjectAdministration.prototype.illegalAccess = function (owner, propName) {
        /**
         * This happens if a property is accessed through the prototype chain, but the property was
         * declared directly as own property on the prototype.
         *
         * E.g.:
         * class A {
         * }
         * extendObservable(A.prototype, { x: 1 })
         *
         * classB extens A {
         * }
         * console.log(new B().x)
         *
         * It is unclear whether the property should be considered 'static' or inherited.
         * Either use `console.log(A.x)`
         * or: decorate(A, { x: observable })
         *
         * When using decorate, the property will always be redeclared as own property on the actual instance
         */
        console.warn("Property '" + propName + "' of '" + owner + "' was accessed through the prototype chain. Use 'decorate' instead to declare the prop or access it statically through it's owner");
    };
    /**
     * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
     * for callback details
     */
    ObservableObjectAdministration.prototype.observe = function (callback, fireImmediately) {
         false &&
            0;
        return registerListener(this, callback);
    };
    ObservableObjectAdministration.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableObjectAdministration.prototype.notifyPropertyAddition = function (key, newValue) {
        var notify = hasListeners(this);
        var notifySpy = isSpyEnabled();
        var change = notify || notifySpy
            ? {
                type: "add",
                object: this.proxy || this.target,
                name: key,
                newValue: newValue
            }
            : null;
        if (notifySpy && "production" !== "production")
            {}
        if (notify)
            notifyListeners(this, change);
        if (notifySpy && "production" !== "production")
            {}
        if (this.pendingKeys) {
            var entry = this.pendingKeys.get(key);
            if (entry)
                entry.set(true);
        }
        this.keysAtom.reportChanged();
    };
    ObservableObjectAdministration.prototype.getKeys = function () {
        var e_1, _a;
        this.keysAtom.reportObserved();
        // return Reflect.ownKeys(this.values) as any
        var res = [];
        try {
            for (var _b = __values(this.values), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                if (value instanceof mobx_module_ObservableValue)
                    res.push(key);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return res;
    };
    return ObservableObjectAdministration;
}());
function asObservableObject(target, name, defaultEnhancer) {
    if (name === void 0) { name = ""; }
    if (defaultEnhancer === void 0) { defaultEnhancer = deepEnhancer; }
    if (Object.prototype.hasOwnProperty.call(target, mobx_module_$mobx))
        return target[mobx_module_$mobx];
     false &&
        0;
    if (!mobx_module_isPlainObject(target))
        name = (target.constructor.name || "ObservableObject") + "@" + getNextId();
    if (!name)
        name = "ObservableObject@" + getNextId();
    var adm = new mobx_module_ObservableObjectAdministration(target, new Map(), stringifyKey(name), defaultEnhancer);
    addHiddenProp(target, mobx_module_$mobx, adm);
    return adm;
}
var observablePropertyConfigs = Object.create(null);
var computedPropertyConfigs = Object.create(null);
function generateObservablePropConfig(propName) {
    return (observablePropertyConfigs[propName] ||
        (observablePropertyConfigs[propName] = {
            configurable: true,
            enumerable: true,
            get: function () {
                return this[mobx_module_$mobx].read(propName);
            },
            set: function (v) {
                this[mobx_module_$mobx].write(propName, v);
            }
        }));
}
function getAdministrationForComputedPropOwner(owner) {
    var adm = owner[mobx_module_$mobx];
    if (!adm) {
        // because computed props are declared on proty,
        // the current instance might not have been initialized yet
        initializeInstance(owner);
        return owner[mobx_module_$mobx];
    }
    return adm;
}
function generateComputedPropConfig(propName) {
    return (computedPropertyConfigs[propName] ||
        (computedPropertyConfigs[propName] = {
            configurable: globalState.computedConfigurable,
            enumerable: false,
            get: function () {
                return getAdministrationForComputedPropOwner(this).read(propName);
            },
            set: function (v) {
                getAdministrationForComputedPropOwner(this).write(propName, v);
            }
        }));
}
var isObservableObjectAdministration = createInstanceofPredicate("ObservableObjectAdministration", mobx_module_ObservableObjectAdministration);
function mobx_module_isObservableObject(thing) {
    if (isObject(thing)) {
        // Initializers run lazily when transpiling to babel, so make sure they are run...
        initializeInstance(thing);
        return isObservableObjectAdministration(thing[mobx_module_$mobx]);
    }
    return false;
}

function mobx_module_getAtom(thing, property) {
    if (typeof thing === "object" && thing !== null) {
        if (mobx_module_isObservableArray(thing)) {
            if (property !== undefined)
                fail( false &&
                    0);
            return thing[mobx_module_$mobx].atom;
        }
        if (isObservableSet(thing)) {
            return thing[mobx_module_$mobx];
        }
        if (mobx_module_isObservableMap(thing)) {
            var anyThing = thing;
            if (property === undefined)
                return anyThing._keysAtom;
            var observable = anyThing._data.get(property) || anyThing._hasMap.get(property);
            if (!observable)
                fail( false &&
                    0);
            return observable;
        }
        // Initializers run lazily when transpiling to babel, so make sure they are run...
        initializeInstance(thing);
        if (property && !thing[mobx_module_$mobx])
            thing[property]; // See #1072
        if (mobx_module_isObservableObject(thing)) {
            if (!property)
                return fail( false && 0);
            var observable = thing[mobx_module_$mobx].values.get(property);
            if (!observable)
                fail( false &&
                    0);
            return observable;
        }
        if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
            return thing;
        }
    }
    else if (typeof thing === "function") {
        if (isReaction(thing[mobx_module_$mobx])) {
            // disposer function
            return thing[mobx_module_$mobx];
        }
    }
    return fail( false && 0);
}
function getAdministration(thing, property) {
    if (!thing)
        fail("Expecting some object");
    if (property !== undefined)
        return getAdministration(mobx_module_getAtom(thing, property));
    if (isAtom(thing) || isComputedValue(thing) || isReaction(thing))
        return thing;
    if (mobx_module_isObservableMap(thing) || isObservableSet(thing))
        return thing;
    // Initializers run lazily when transpiling to babel, so make sure they are run...
    initializeInstance(thing);
    if (thing[mobx_module_$mobx])
        return thing[mobx_module_$mobx];
    fail( false && 0);
}
function getDebugName(thing, property) {
    var named;
    if (property !== undefined)
        named = mobx_module_getAtom(thing, property);
    else if (mobx_module_isObservableObject(thing) || mobx_module_isObservableMap(thing) || isObservableSet(thing))
        named = getAdministration(thing);
    else
        named = mobx_module_getAtom(thing); // valid for arrays as well
    return named.name;
}

var mobx_module_toString = Object.prototype.toString;
function deepEqual(a, b, depth) {
    if (depth === void 0) { depth = -1; }
    return eq(a, b, depth);
}
// Copied from https://github.com/jashkenas/underscore/blob/5c237a7c682fb68fd5378203f0bf22dce1624854/underscore.js#L1186-L1289
// Internal recursive comparison function for `isEqual`.
function eq(a, b, depth, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b)
        return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null)
        return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a)
        return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== "function" && type !== "object" && typeof b != "object")
        return false;
    // Compare `[[Class]]` names.
    var className = mobx_module_toString.call(a);
    if (className !== mobx_module_toString.call(b))
        return false;
    switch (className) {
        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
        case "[object RegExp]":
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
        case "[object String]":
            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
            // equivalent to `new String("5")`.
            return "" + a === "" + b;
        case "[object Number]":
            // `NaN`s are equivalent, but non-reflexive.
            // Object(NaN) is equivalent to NaN.
            if (+a !== +a)
                return +b !== +b;
            // An `egal` comparison is performed for other numeric values.
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case "[object Date]":
        case "[object Boolean]":
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a === +b;
        case "[object Symbol]":
            return (typeof Symbol !== "undefined" && Symbol.valueOf.call(a) === Symbol.valueOf.call(b));
        case "[object Map]":
        case "[object Set]":
            // Maps and Sets are unwrapped to arrays of entry-pairs, adding an incidental level.
            // Hide this extra level by increasing the depth.
            if (depth >= 0) {
                depth++;
            }
            break;
    }
    // Unwrap any wrapped objects.
    a = unwrap(a);
    b = unwrap(b);
    var areArrays = className === "[object Array]";
    if (!areArrays) {
        if (typeof a != "object" || typeof b != "object")
            return false;
        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor &&
            !(typeof aCtor === "function" &&
                aCtor instanceof aCtor &&
                typeof bCtor === "function" &&
                bCtor instanceof bCtor) &&
            ("constructor" in a && "constructor" in b)) {
            return false;
        }
    }
    if (depth === 0) {
        return false;
    }
    else if (depth < 0) {
        depth = -1;
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a)
            return bStack[length] === b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    // Recursively compare objects and arrays.
    if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length;
        if (length !== b.length)
            return false;
        // Deep compare the contents, ignoring non-numeric properties.
        while (length--) {
            if (!eq(a[length], b[length], depth - 1, aStack, bStack))
                return false;
        }
    }
    else {
        // Deep compare objects.
        var keys = Object.keys(a);
        var key = void 0;
        length = keys.length;
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (Object.keys(b).length !== length)
            return false;
        while (length--) {
            // Deep compare each member
            key = keys[length];
            if (!(has$1(b, key) && eq(a[key], b[key], depth - 1, aStack, bStack)))
                return false;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
}
function unwrap(a) {
    if (mobx_module_isObservableArray(a))
        return a.slice();
    if (isES6Map(a) || mobx_module_isObservableMap(a))
        return Array.from(a.entries());
    if (isES6Set(a) || isObservableSet(a))
        return Array.from(a.entries());
    return a;
}
function has$1(a, key) {
    return Object.prototype.hasOwnProperty.call(a, key);
}

function makeIterable(iterator) {
    iterator[Symbol.iterator] = getSelf;
    return iterator;
}
function getSelf() {
    return this;
}

/**
 * (c) Michel Weststrate 2015 - 2018
 * MIT Licensed
 *
 * Welcome to the mobx sources! To get an global overview of how MobX internally works,
 * this is a good place to start:
 * https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254#.xvbh6qd74
 *
 * Source folders:
 * ===============
 *
 * - api/     Most of the public static methods exposed by the module can be found here.
 * - core/    Implementation of the MobX algorithm; atoms, derivations, reactions, dependency trees, optimizations. Cool stuff can be found here.
 * - types/   All the magic that is need to have observable objects, arrays and values is in this folder. Including the modifiers like `asFlat`.
 * - utils/   Utility stuff.
 *
 */
if (typeof Proxy === "undefined" || typeof Symbol === "undefined") {
    throw new Error("[mobx] MobX 5+ requires Proxy and Symbol objects. If your environment doesn't support Symbol or Proxy objects, please downgrade to MobX 4. For React Native Android, consider upgrading JSCore.");
}
try {
    // define process.env if needed
    // if this is not a production build in the first place
    // (in which case the expression below would be substituted with 'production')
    "production";
}
catch (e) {
    var g = mobx_module_getGlobal();
    if (typeof process === "undefined")
        g.process = {};
    g.process.env = {};
}
(function () {
    function testCodeMinification() { }
    if (testCodeMinification.name !== "testCodeMinification" &&
        "production" !== "production" &&
        0 && 0) { var varName }
})();
if (typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "object") {
    // See: https://github.com/andykog/mobx-devtools/
    __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
        spy: spy,
        extras: {
            getDebugName: getDebugName
        },
        $mobx: mobx_module_$mobx
    });
}



;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/assertEnvironment.js


if (!node_modules_react.useState) {
    throw new Error("mobx-react-lite requires React with Hooks support");
}
if (!spy) {
    throw new Error("mobx-react-lite requires mobx at least version 4 to be available");
}

// EXTERNAL MODULE: ./node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/index.js
var react_dom = __webpack_require__(8143);
;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/utils/reactBatchedUpdates.js


;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/utils.js
var utils_read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};

var utils_EMPTY_ARRAY = (/* unused pure expression or super */ null && ([]));
function useUnmount(fn) {
    useEffect(function () { return fn; }, utils_EMPTY_ARRAY);
}
function useForceUpdate() {
    var _a = utils_read((0,node_modules_react.useState)(0), 2), setTick = _a[1];
    var update = (0,node_modules_react.useCallback)(function () {
        setTick(function (tick) { return tick + 1; });
    }, []);
    return update;
}
function utils_isPlainObject(value) {
    if (!value || typeof value !== "object") {
        return false;
    }
    var proto = Object.getPrototypeOf(value);
    return !proto || proto === Object.prototype;
}
function getSymbol(name) {
    if (typeof Symbol === "function") {
        return Symbol.for(name);
    }
    return "__$mobx-react " + name + "__";
}
var utils_mockGlobal = {};
function utils_getGlobal() {
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof __webpack_require__.g !== "undefined") {
        return __webpack_require__.g;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    return utils_mockGlobal;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/observerBatching.js


var observerBatchingConfiguredSymbol = getSymbol("observerBatching");
function defaultNoopBatch(callback) {
    callback();
}
function observerBatching(reactionScheduler) {
    if (!reactionScheduler) {
        reactionScheduler = defaultNoopBatch;
        if (false) {}
    }
    configure({ reactionScheduler: reactionScheduler });
    utils_getGlobal()[observerBatchingConfiguredSymbol] = true;
}
var isObserverBatched = function () { return !!getGlobal()[observerBatchingConfiguredSymbol]; };

;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/printDebugValue.js

function printDebugValue(v) {
    return getDependencyTree(v);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/reactionCleanupTracking.js
function createTrackingData(reaction) {
    var trackingData = {
        cleanAt: Date.now() + CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS,
        reaction: reaction
    };
    return trackingData;
}
/**
 * The minimum time before we'll clean up a Reaction created in a render
 * for a component that hasn't managed to run its effects. This needs to
 * be big enough to ensure that a component won't turn up and have its
 * effects run without being re-rendered.
 */
var CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS = 10000;
/**
 * The frequency with which we'll check for leaked reactions.
 */
var CLEANUP_TIMER_LOOP_MILLIS = 10000;
/**
 * Reactions created by components that have yet to be fully mounted.
 */
var uncommittedReactionRefs = new Set();
/**
 * Latest 'uncommitted reactions' cleanup timer handle.
 */
var reactionCleanupHandle;
function ensureCleanupTimerRunning() {
    if (reactionCleanupHandle === undefined) {
        reactionCleanupHandle = setTimeout(cleanUncommittedReactions, CLEANUP_TIMER_LOOP_MILLIS);
    }
}
function scheduleCleanupOfReactionIfLeaked(ref) {
    uncommittedReactionRefs.add(ref);
    ensureCleanupTimerRunning();
}
function recordReactionAsCommitted(reactionRef) {
    uncommittedReactionRefs.delete(reactionRef);
}
/**
 * Run by the cleanup timer to dispose any outstanding reactions
 */
function cleanUncommittedReactions() {
    reactionCleanupHandle = undefined;
    // Loop through all the candidate leaked reactions; those older
    // than CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS get tidied.
    var now = Date.now();
    uncommittedReactionRefs.forEach(function (ref) {
        var tracking = ref.current;
        if (tracking) {
            if (now >= tracking.cleanAt) {
                // It's time to tidy up this leaked reaction.
                tracking.reaction.dispose();
                ref.current = null;
                uncommittedReactionRefs.delete(ref);
            }
        }
    });
    if (uncommittedReactionRefs.size > 0) {
        // We've just finished a round of cleanups but there are still
        // some leak candidates outstanding.
        ensureCleanupTimerRunning();
    }
}
/* istanbul ignore next */
/**
 * Only to be used by test functions; do not export outside of mobx-react-lite
 */
function forceCleanupTimerToRunNowForTests() {
    // This allows us to control the execution of the cleanup timer
    // to force it to run at awkward times in unit tests.
    if (reactionCleanupHandle) {
        clearTimeout(reactionCleanupHandle);
        cleanUncommittedReactions();
    }
}
/* istanbul ignore next */
function resetCleanupScheduleForTests() {
    if (reactionCleanupHandle) {
        clearTimeout(reactionCleanupHandle);
        reactionCleanupHandle = undefined;
    }
    uncommittedReactionRefs.clear();
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/staticRendering.js
var globalIsUsingStaticRendering = false;
function useStaticRendering(enable) {
    globalIsUsingStaticRendering = enable;
}
function staticRendering_isUsingStaticRendering() {
    return globalIsUsingStaticRendering;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/useQueuedForceUpdate.js

var insideRender = false;
var forceUpdateQueue = [];
function useQueuedForceUpdate(forceUpdate) {
    return function () {
        if (insideRender) {
            forceUpdateQueue.push(forceUpdate);
        }
        else {
            forceUpdate();
        }
    };
}
function useQueuedForceUpdateBlock(callback) {
    // start intercepting force-update calls
    insideRender = true;
    forceUpdateQueue = [];
    try {
        var result = callback();
        // stop intercepting force-update
        insideRender = false;
        // store queue or nothing if it was empty to execute useLayoutEffect only when necessary
        var queue_1 = forceUpdateQueue.length > 0 ? forceUpdateQueue : undefined;
        // run force-update queue in useLayoutEffect
        node_modules_react.useLayoutEffect(function () {
            if (queue_1) {
                queue_1.forEach(function (x) { return x(); });
            }
        }, [queue_1]);
        return result;
    }
    finally {
        insideRender = false;
    }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/useObserver.js







var useObserver_EMPTY_OBJECT = {};
function observerComponentNameFor(baseComponentName) {
    return "observer" + baseComponentName;
}
function useObserver_useObserver(fn, baseComponentName, options) {
    if (baseComponentName === void 0) { baseComponentName = "observed"; }
    if (options === void 0) { options = useObserver_EMPTY_OBJECT; }
    if (staticRendering_isUsingStaticRendering()) {
        return fn();
    }
    var wantedForceUpdateHook = options.useForceUpdate || useForceUpdate;
    var forceUpdate = wantedForceUpdateHook();
    var queuedForceUpdate = useQueuedForceUpdate(forceUpdate);
    // StrictMode/ConcurrentMode/Suspense may mean that our component is
    // rendered and abandoned multiple times, so we need to track leaked
    // Reactions.
    var reactionTrackingRef = node_modules_react.useRef(null);
    if (!reactionTrackingRef.current) {
        // First render for this component (or first time since a previous
        // reaction from an abandoned render was disposed).
        var newReaction_1 = new mobx_module_Reaction(observerComponentNameFor(baseComponentName), function () {
            // Observable has changed, meaning we want to re-render
            // BUT if we're a component that hasn't yet got to the useEffect()
            // stage, we might be a component that _started_ to render, but
            // got dropped, and we don't want to make state changes then.
            // (It triggers warnings in StrictMode, for a start.)
            if (trackingData_1.mounted) {
                // We have reached useEffect(), so we're mounted, and can trigger an update
                queuedForceUpdate();
            }
            else {
                // We haven't yet reached useEffect(), so we'll need to trigger a re-render
                // when (and if) useEffect() arrives.  The easiest way to do that is just to
                // drop our current reaction and allow useEffect() to recreate it.
                newReaction_1.dispose();
                reactionTrackingRef.current = null;
            }
        });
        var trackingData_1 = createTrackingData(newReaction_1);
        reactionTrackingRef.current = trackingData_1;
        scheduleCleanupOfReactionIfLeaked(reactionTrackingRef);
    }
    var reaction = reactionTrackingRef.current.reaction;
    node_modules_react.useDebugValue(reaction, printDebugValue);
    node_modules_react.useEffect(function () {
        // Called on first mount only
        recordReactionAsCommitted(reactionTrackingRef);
        if (reactionTrackingRef.current) {
            // Great. We've already got our reaction from our render;
            // all we need to do is to record that it's now mounted,
            // to allow future observable changes to trigger re-renders
            reactionTrackingRef.current.mounted = true;
        }
        else {
            // The reaction we set up in our render has been disposed.
            // This is either due to bad timings of renderings, e.g. our
            // component was paused for a _very_ long time, and our
            // reaction got cleaned up, or we got a observable change
            // between render and useEffect
            // Re-create the reaction
            reactionTrackingRef.current = {
                reaction: new mobx_module_Reaction(observerComponentNameFor(baseComponentName), function () {
                    // We've definitely already been mounted at this point
                    queuedForceUpdate();
                }),
                cleanAt: Infinity
            };
            queuedForceUpdate();
        }
        return function () {
            reactionTrackingRef.current.reaction.dispose();
            reactionTrackingRef.current = null;
        };
    }, []);
    // delay all force-update calls after rendering of this component
    return useQueuedForceUpdateBlock(function () {
        // render the original component, but have the
        // reaction track the observables, so that rendering
        // can be invalidated (see above) once a dependency changes
        var rendering;
        var exception;
        reaction.track(function () {
            try {
                rendering = fn();
            }
            catch (e) {
                exception = e;
            }
        });
        if (exception) {
            throw exception; // re-throw any exceptions caught during rendering
        }
        return rendering;
    });
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/observer.js
var observer_assign = (undefined && undefined.__assign) || function () {
    observer_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return observer_assign.apply(this, arguments);
};



// n.b. base case is not used for actual typings or exported in the typing files
function observer(baseComponent, options) {
    // The working of observer is explained step by step in this talk: https://www.youtube.com/watch?v=cPF4iBedoF0&feature=youtu.be&t=1307
    if (isUsingStaticRendering()) {
        return baseComponent;
    }
    var realOptions = observer_assign({ forwardRef: false }, options);
    var baseComponentName = baseComponent.displayName || baseComponent.name;
    var wrappedComponent = function (props, ref) {
        return useObserver(function () { return baseComponent(props, ref); }, baseComponentName);
    };
    wrappedComponent.displayName = baseComponentName;
    // memo; we are not interested in deep updates
    // in props; we assume that if deep objects are changed,
    // this is in observables, which would have been tracked anyway
    var memoComponent;
    if (realOptions.forwardRef) {
        // we have to use forwardRef here because:
        // 1. it cannot go before memo, only after it
        // 2. forwardRef converts the function into an actual component, so we can't let the baseComponent do it
        //    since it wouldn't be a callable function anymore
        memoComponent = memo(forwardRef(wrappedComponent));
    }
    else {
        memoComponent = memo(wrappedComponent);
    }
    copyStaticProperties(baseComponent, memoComponent);
    memoComponent.displayName = baseComponentName;
    return memoComponent;
}
// based on https://github.com/mridgway/hoist-non-react-statics/blob/master/src/index.js
var hoistBlackList = (/* unused pure expression or super */ null && ({
    $$typeof: true,
    render: true,
    compare: true,
    type: true
}));
function copyStaticProperties(base, target) {
    Object.keys(base).forEach(function (key) {
        if (!hoistBlackList[key]) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key));
        }
    });
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/ObserverComponent.js

function ObserverComponent(_a) {
    var children = _a.children, render = _a.render;
    var component = children || render;
    if (typeof component !== "function") {
        return null;
    }
    return useObserver_useObserver(component);
}
ObserverComponent.propTypes = {
    children: ObserverPropsCheck,
    render: ObserverPropsCheck
};
ObserverComponent.displayName = "Observer";

function ObserverPropsCheck(props, key, componentName, location, propFullName) {
    var extraKey = key === "children" ? "render" : "children";
    var hasProp = typeof props[key] === "function";
    var hasExtraProp = typeof props[extraKey] === "function";
    if (hasProp && hasExtraProp) {
        return new Error("MobX Observer: Do not use children and render in the same time in`" + componentName);
    }
    if (hasProp || hasExtraProp) {
        return null;
    }
    return new Error("Invalid prop `" +
        propFullName +
        "` of type `" +
        typeof props[key] +
        "` supplied to" +
        " `" +
        componentName +
        "`, expected `function`.");
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/useAsObservableSource.js
var useAsObservableSource_read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};



function useAsObservableSource_useAsObservableSourceInternal(current, usedByLocalStore) {
    var culprit = usedByLocalStore ? "useLocalStore" : "useAsObservableSource";
    if (false) { var _a, initialSource }
    if (usedByLocalStore && current === undefined) {
        return undefined;
    }
    if (false) {}
    var _b = useAsObservableSource_read(React.useState(function () { return observable(current, {}, { deep: false }); }), 1), res = _b[0];
    if (false) {}
    runInAction(function () {
        Object.assign(res, current);
    });
    return res;
}
function useAsObservableSource(current) {
    return useAsObservableSource_useAsObservableSourceInternal(current, false);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/useLocalStore.js




function useLocalStore(initializer, current) {
    var source = useAsObservableSourceInternal(current, true);
    return React.useState(function () {
        var local = observable(initializer(source));
        if (isPlainObject(local)) {
            runInAction(function () {
                Object.keys(local).forEach(function (key) {
                    var value = local[key];
                    if (typeof value === "function") {
                        // @ts-ignore No idea why ts2536 is popping out here
                        local[key] = wrapInTransaction(value, local);
                    }
                });
            });
        }
        return local;
    })[0];
}
// tslint:disable-next-line: ban-types
function wrapInTransaction(fn, context) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return transaction(function () { return fn.apply(context, args); });
    };
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react-lite@2.2.2_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react-lite/es/index.js



observerBatching(react_dom.unstable_batchedUpdates);










;// CONCATENATED MODULE: ./node_modules/.pnpm/mobx-react@6.3.1_mobx@5.15.7_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/mobx-react/dist/mobxreact.esm.js





var symbolId = 0;

function createSymbol(name) {
  if (typeof Symbol === "function") {
    return Symbol(name);
  }

  var symbol = "__$mobx-react " + name + " (" + symbolId + ")";
  symbolId++;
  return symbol;
}

var createdSymbols = (/* unused pure expression or super */ null && ({}));
function newSymbol(name) {
  if (!createdSymbols[name]) {
    createdSymbols[name] = createSymbol(name);
  }

  return createdSymbols[name];
}
function shallowEqual(objA, objB) {
  //From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
  if (is(objA, objB)) return true;

  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) {
    if (!Object.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

function is(x, y) {
  // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
} // based on https://github.com/mridgway/hoist-non-react-statics/blob/master/src/index.js


var mobxreact_esm_hoistBlackList = (/* unused pure expression or super */ null && ({
  $$typeof: 1,
  render: 1,
  compare: 1,
  type: 1,
  childContextTypes: 1,
  contextType: 1,
  contextTypes: 1,
  defaultProps: 1,
  getDefaultProps: 1,
  getDerivedStateFromError: 1,
  getDerivedStateFromProps: 1,
  mixins: 1,
  propTypes: 1
}));
function mobxreact_esm_copyStaticProperties(base, target) {
  var protoProps = Object.getOwnPropertyNames(Object.getPrototypeOf(base));
  Object.getOwnPropertyNames(base).forEach(function (key) {
    if (!mobxreact_esm_hoistBlackList[key] && protoProps.indexOf(key) === -1) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key));
    }
  });
}
/**
 * Helper to set `prop` to `this` as non-enumerable (hidden prop)
 * @param target
 * @param prop
 * @param value
 */

function setHiddenProp(target, prop, value) {
  if (!Object.hasOwnProperty.call(target, prop)) {
    Object.defineProperty(target, prop, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: value
    });
  } else {
    target[prop] = value;
  }
}
/**
 * Utilities for patching componentWillUnmount, to make sure @disposeOnUnmount works correctly icm with user defined hooks
 * and the handler provided by mobx-react
 */

var mobxMixins =
/*#__PURE__*/
(/* unused pure expression or super */ null && (newSymbol("patchMixins")));
var mobxPatchedDefinition =
/*#__PURE__*/
(/* unused pure expression or super */ null && (newSymbol("patchedDefinition")));

function getMixins(target, methodName) {
  var mixins = target[mobxMixins] = target[mobxMixins] || {};
  var methodMixins = mixins[methodName] = mixins[methodName] || {};
  methodMixins.locks = methodMixins.locks || 0;
  methodMixins.methods = methodMixins.methods || [];
  return methodMixins;
}

function wrapper(realMethod, mixins) {
  var _this = this;

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  // locks are used to ensure that mixins are invoked only once per invocation, even on recursive calls
  mixins.locks++;

  try {
    var retVal;

    if (realMethod !== undefined && realMethod !== null) {
      retVal = realMethod.apply(this, args);
    }

    return retVal;
  } finally {
    mixins.locks--;

    if (mixins.locks === 0) {
      mixins.methods.forEach(function (mx) {
        mx.apply(_this, args);
      });
    }
  }
}

function wrapFunction(realMethod, mixins) {
  var fn = function fn() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    wrapper.call.apply(wrapper, [this, realMethod, mixins].concat(args));
  };

  return fn;
}

function patch(target, methodName, mixinMethod) {
  var mixins = getMixins(target, methodName);

  if (mixins.methods.indexOf(mixinMethod) < 0) {
    mixins.methods.push(mixinMethod);
  }

  var oldDefinition = Object.getOwnPropertyDescriptor(target, methodName);

  if (oldDefinition && oldDefinition[mobxPatchedDefinition]) {
    // already patched definition, do not repatch
    return;
  }

  var originalMethod = target[methodName];
  var newDefinition = createDefinition(target, methodName, oldDefinition ? oldDefinition.enumerable : undefined, mixins, originalMethod);
  Object.defineProperty(target, methodName, newDefinition);
}

function createDefinition(target, methodName, enumerable, mixins, originalMethod) {
  var _ref;

  var wrappedFunc = wrapFunction(originalMethod, mixins);
  return _ref = {}, _ref[mobxPatchedDefinition] = true, _ref.get = function get() {
    return wrappedFunc;
  }, _ref.set = function set(value) {
    if (this === target) {
      wrappedFunc = wrapFunction(value, mixins);
    } else {
      // when it is an instance of the prototype/a child prototype patch that particular case again separately
      // since we need to store separate values depending on wether it is the actual instance, the prototype, etc
      // e.g. the method for super might not be the same as the method for the prototype which might be not the same
      // as the method for the instance
      var newDefinition = createDefinition(this, methodName, enumerable, mixins, value);
      Object.defineProperty(this, methodName, newDefinition);
    }
  }, _ref.configurable = true, _ref.enumerable = enumerable, _ref;
}

var mobxAdminProperty = (/* unused pure expression or super */ null && ($mobx || "$mobx"));
var mobxObserverProperty =
/*#__PURE__*/
(/* unused pure expression or super */ null && (newSymbol("isMobXReactObserver")));
var mobxIsUnmounted =
/*#__PURE__*/
(/* unused pure expression or super */ null && (newSymbol("isUnmounted")));
var skipRenderKey =
/*#__PURE__*/
(/* unused pure expression or super */ null && (newSymbol("skipRender")));
var isForcingUpdateKey =
/*#__PURE__*/
(/* unused pure expression or super */ null && (newSymbol("isForcingUpdate")));
function makeClassComponentObserver(componentClass) {
  var target = componentClass.prototype;

  if (componentClass[mobxObserverProperty]) {
    var displayName = getDisplayName(target);
    console.warn("The provided component class (" + displayName + ") \n                has already been declared as an observer component.");
  } else {
    componentClass[mobxObserverProperty] = true;
  }

  if (target.componentWillReact) throw new Error("The componentWillReact life-cycle event is no longer supported");

  if (componentClass["__proto__"] !== PureComponent) {
    if (!target.shouldComponentUpdate) target.shouldComponentUpdate = observerSCU;else if (target.shouldComponentUpdate !== observerSCU) // n.b. unequal check, instead of existence check, as @observer might be on superclass as well
      throw new Error("It is not allowed to use shouldComponentUpdate in observer based components.");
  } // this.props and this.state are made observable, just to make sure @computed fields that
  // are defined inside the component, and which rely on state or props, re-compute if state or props change
  // (otherwise the computed wouldn't update and become stale on props change, since props are not observable)
  // However, this solution is not without it's own problems: https://github.com/mobxjs/mobx-react/issues?utf8=%E2%9C%93&q=is%3Aissue+label%3Aobservable-props-or-not+


  makeObservableProp(target, "props");
  makeObservableProp(target, "state");
  var baseRender = target.render;

  target.render = function () {
    return makeComponentReactive.call(this, baseRender);
  };

  patch(target, "componentWillUnmount", function () {
    var _this$render$mobxAdmi;

    if (isUsingStaticRendering() === true) return;
    (_this$render$mobxAdmi = this.render[mobxAdminProperty]) === null || _this$render$mobxAdmi === void 0 ? void 0 : _this$render$mobxAdmi.dispose();
    this[mobxIsUnmounted] = true;

    if (!this.render[mobxAdminProperty]) {
      // Render may have been hot-swapped and/or overriden by a subclass.
      var _displayName = getDisplayName(this);

      console.warn("The reactive render of an observer class component (" + _displayName + ") \n                was overriden after MobX attached. This may result in a memory leak if the \n                overriden reactive render was not properly disposed.");
    }
  });
  return componentClass;
} // Generates a friendly name for debugging

function getDisplayName(comp) {
  return comp.displayName || comp.name || comp.constructor && (comp.constructor.displayName || comp.constructor.name) || "<component>";
}

function makeComponentReactive(render) {
  var _this = this;

  if (isUsingStaticRendering() === true) return render.call(this);
  /**
   * If props are shallowly modified, react will render anyway,
   * so atom.reportChanged() should not result in yet another re-render
   */

  setHiddenProp(this, skipRenderKey, false);
  /**
   * forceUpdate will re-assign this.props. We don't want that to cause a loop,
   * so detect these changes
   */

  setHiddenProp(this, isForcingUpdateKey, false);
  var initialName = getDisplayName(this);
  var baseRender = render.bind(this);
  var isRenderingPending = false;
  var reaction = new Reaction(initialName + ".render()", function () {
    if (!isRenderingPending) {
      // N.B. Getting here *before mounting* means that a component constructor has side effects (see the relevant test in misc.js)
      // This unidiomatic React usage but React will correctly warn about this so we continue as usual
      // See #85 / Pull #44
      isRenderingPending = true;

      if (_this[mobxIsUnmounted] !== true) {
        var hasError = true;

        try {
          setHiddenProp(_this, isForcingUpdateKey, true);
          if (!_this[skipRenderKey]) Component.prototype.forceUpdate.call(_this);
          hasError = false;
        } finally {
          setHiddenProp(_this, isForcingUpdateKey, false);
          if (hasError) reaction.dispose();
        }
      }
    }
  });
  reaction["reactComponent"] = this;
  reactiveRender[mobxAdminProperty] = reaction;
  this.render = reactiveRender;

  function reactiveRender() {
    isRenderingPending = false;
    var exception = undefined;
    var rendering = undefined;
    reaction.track(function () {
      try {
        rendering = _allowStateChanges(false, baseRender);
      } catch (e) {
        exception = e;
      }
    });

    if (exception) {
      throw exception;
    }

    return rendering;
  }

  return reactiveRender.call(this);
}

function observerSCU(nextProps, nextState) {
  if (isUsingStaticRendering()) {
    console.warn("[mobx-react] It seems that a re-rendering of a React component is triggered while in static (server-side) mode. Please make sure components are rendered only once server-side.");
  } // update on any state changes (as is the default)


  if (this.state !== nextState) {
    return true;
  } // update if props are shallowly not equal, inspired by PureRenderMixin
  // we could return just 'false' here, and avoid the `skipRender` checks etc
  // however, it is nicer if lifecycle events are triggered like usually,
  // so we return true here if props are shallowly modified.


  return !shallowEqual(this.props, nextProps);
}

function makeObservableProp(target, propName) {
  var valueHolderKey = newSymbol("reactProp_" + propName + "_valueHolder");
  var atomHolderKey = newSymbol("reactProp_" + propName + "_atomHolder");

  function getAtom() {
    if (!this[atomHolderKey]) {
      setHiddenProp(this, atomHolderKey, createAtom("reactive " + propName));
    }

    return this[atomHolderKey];
  }

  Object.defineProperty(target, propName, {
    configurable: true,
    enumerable: true,
    get: function get() {
      var prevReadState = false;

      if (_allowStateReadsStart && _allowStateReadsEnd) {
        prevReadState = _allowStateReadsStart(true);
      }

      getAtom.call(this).reportObserved();

      if (_allowStateReadsStart && _allowStateReadsEnd) {
        _allowStateReadsEnd(prevReadState);
      }

      return this[valueHolderKey];
    },
    set: function set(v) {
      if (!this[isForcingUpdateKey] && !shallowEqual(this[valueHolderKey], v)) {
        setHiddenProp(this, valueHolderKey, v);
        setHiddenProp(this, skipRenderKey, true);
        getAtom.call(this).reportChanged();
        setHiddenProp(this, skipRenderKey, false);
      } else {
        setHiddenProp(this, valueHolderKey, v);
      }
    }
  });
}

var hasSymbol = typeof Symbol === "function" && Symbol.for; // Using react-is had some issues (and operates on elements, not on types), see #608 / #609

var ReactForwardRefSymbol = hasSymbol ?
/*#__PURE__*/
Symbol.for("react.forward_ref") : typeof node_modules_react.forwardRef === "function" &&
/*#__PURE__*/
(0,node_modules_react.forwardRef)(function (props) {
  return null;
})["$$typeof"];
var ReactMemoSymbol = hasSymbol ?
/*#__PURE__*/
Symbol.for("react.memo") : typeof node_modules_react.memo === "function" &&
/*#__PURE__*/
(0,node_modules_react.memo)(function (props) {
  return null;
})["$$typeof"];
/**
 * Observer function / decorator
 */

function mobxreact_esm_observer(component) {
  if (component["isMobxInjector"] === true) {
    console.warn("Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'");
  }

  if (ReactMemoSymbol && component["$$typeof"] === ReactMemoSymbol) {
    throw new Error("Mobx observer: You are trying to use 'observer' on a function component wrapped in either another observer or 'React.memo'. The observer already applies 'React.memo' for you.");
  } // Unwrap forward refs into `<Observer>` component
  // we need to unwrap the render, because it is the inner render that needs to be tracked,
  // not the ForwardRef HoC


  if (ReactForwardRefSymbol && component["$$typeof"] === ReactForwardRefSymbol) {
    var baseRender = component["render"];
    if (typeof baseRender !== "function") throw new Error("render property of ForwardRef was not a function");
    return forwardRef(function ObserverForwardRef() {
      var args = arguments;
      return createElement(Observer, null, function () {
        return baseRender.apply(undefined, args);
      });
    });
  } // Function component


  if (typeof component === "function" && (!component.prototype || !component.prototype.render) && !component["isReactClass"] && !Object.prototype.isPrototypeOf.call(Component, component)) {
    return observer$1(component);
  }

  return makeClassComponentObserver(component);
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var MobXProviderContext =
/*#__PURE__*/
node_modules_react.createContext({});
function Provider(props) {
  var children = props.children,
      stores = _objectWithoutPropertiesLoose(props, ["children"]);

  var parentValue = node_modules_react.useContext(MobXProviderContext);
  var mutableProviderRef = node_modules_react.useRef(_extends({}, parentValue, stores));
  var value = mutableProviderRef.current;

  if (false) { var newValue }

  return node_modules_react.createElement(MobXProviderContext.Provider, {
    value: value
  }, children);
}
Provider.displayName = "MobXProvider";

/**
 * Store Injection
 */

function createStoreInjector(grabStoresFn, component, injectNames, makeReactive) {
  // Support forward refs
  var Injector = React__default.forwardRef(function (props, ref) {
    var newProps = _extends({}, props);

    var context = React__default.useContext(MobXProviderContext);
    Object.assign(newProps, grabStoresFn(context || {}, newProps) || {});

    if (ref) {
      newProps.ref = ref;
    }

    return React__default.createElement(component, newProps);
  });
  if (makeReactive) Injector = mobxreact_esm_observer(Injector);
  Injector["isMobxInjector"] = true; // assigned late to suppress observer warning
  // Static fields from component should be visible on the generated Injector

  mobxreact_esm_copyStaticProperties(component, Injector);
  Injector["wrappedComponent"] = component;
  Injector.displayName = getInjectName(component, injectNames);
  return Injector;
}

function getInjectName(component, injectNames) {
  var displayName;
  var componentName = component.displayName || component.name || component.constructor && component.constructor.name || "Component";
  if (injectNames) displayName = "inject-with-" + injectNames + "(" + componentName + ")";else displayName = "inject(" + componentName + ")";
  return displayName;
}

function grabStoresByName(storeNames) {
  return function (baseStores, nextProps) {
    storeNames.forEach(function (storeName) {
      if (storeName in nextProps // prefer props over stores
      ) return;
      if (!(storeName in baseStores)) throw new Error("MobX injector: Store '" + storeName + "' is not available! Make sure it is provided by some Provider");
      nextProps[storeName] = baseStores[storeName];
    });
    return nextProps;
  };
}
/**
 * higher order component that injects stores to a child.
 * takes either a varargs list of strings, which are stores read from the context,
 * or a function that manually maps the available stores from the context to props:
 * storesToProps(mobxStores, props, context) => newProps
 */


function inject() {
  for (var _len = arguments.length, storeNames = new Array(_len), _key = 0; _key < _len; _key++) {
    storeNames[_key] = arguments[_key];
  }

  if (typeof arguments[0] === "function") {
    var grabStoresFn = arguments[0];
    return function (componentClass) {
      return createStoreInjector(grabStoresFn, componentClass, grabStoresFn.name, true);
    };
  } else {
    return function (componentClass) {
      return createStoreInjector(grabStoresByName(storeNames), componentClass, storeNames.join("-"), false);
    };
  }
}

var protoStoreKey =
/*#__PURE__*/
(/* unused pure expression or super */ null && (newSymbol("disposeOnUnmountProto")));
var instStoreKey =
/*#__PURE__*/
(/* unused pure expression or super */ null && (newSymbol("disposeOnUnmountInst")));

function runDisposersOnWillUnmount() {
  var _this = this;
  [].concat(this[protoStoreKey] || [], this[instStoreKey] || []).forEach(function (propKeyOrFunction) {
    var prop = typeof propKeyOrFunction === "string" ? _this[propKeyOrFunction] : propKeyOrFunction;

    if (prop !== undefined && prop !== null) {
      if (Array.isArray(prop)) prop.map(function (f) {
        return f();
      });else prop();
    }
  });
}

function disposeOnUnmount(target, propertyKeyOrFunction) {
  if (Array.isArray(propertyKeyOrFunction)) {
    return propertyKeyOrFunction.map(function (fn) {
      return disposeOnUnmount(target, fn);
    });
  }

  var c = Object.getPrototypeOf(target).constructor;
  var c2 = Object.getPrototypeOf(target.constructor); // Special case for react-hot-loader

  var c3 = Object.getPrototypeOf(Object.getPrototypeOf(target));

  if (!(c === React__default.Component || c === React__default.PureComponent || c2 === React__default.Component || c2 === React__default.PureComponent || c3 === React__default.Component || c3 === React__default.PureComponent)) {
    throw new Error("[mobx-react] disposeOnUnmount only supports direct subclasses of React.Component or React.PureComponent.");
  }

  if (typeof propertyKeyOrFunction !== "string" && typeof propertyKeyOrFunction !== "function" && !Array.isArray(propertyKeyOrFunction)) {
    throw new Error("[mobx-react] disposeOnUnmount only works if the parameter is either a property key or a function.");
  } // decorator's target is the prototype, so it doesn't have any instance properties like props


  var isDecorator = typeof propertyKeyOrFunction === "string"; // add property key / function we want run (disposed) to the store

  var componentWasAlreadyModified = !!target[protoStoreKey] || !!target[instStoreKey];
  var store = isDecorator ? // decorators are added to the prototype store
  target[protoStoreKey] || (target[protoStoreKey] = []) : // functions are added to the instance store
  target[instStoreKey] || (target[instStoreKey] = []);
  store.push(propertyKeyOrFunction); // tweak the component class componentWillUnmount if not done already

  if (!componentWasAlreadyModified) {
    patch(target, "componentWillUnmount", runDisposersOnWillUnmount);
  } // return the disposer as is if invoked as a non decorator


  if (typeof propertyKeyOrFunction !== "string") {
    return propertyKeyOrFunction;
  }
}

function createChainableTypeChecker(validator) {
  function checkType(isRequired, props, propName, componentName, location, propFullName) {
    for (var _len = arguments.length, rest = new Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
      rest[_key - 6] = arguments[_key];
    }

    return untracked(function () {
      componentName = componentName || "<<anonymous>>";
      propFullName = propFullName || propName;

      if (props[propName] == null) {
        if (isRequired) {
          var actual = props[propName] === null ? "null" : "undefined";
          return new Error("The " + location + " `" + propFullName + "` is marked as required " + "in `" + componentName + "`, but its value is `" + actual + "`.");
        }

        return null;
      } else {
        // @ts-ignore rest arg is necessary for some React internals - fails tests otherwise
        return validator.apply(void 0, [props, propName, componentName, location, propFullName].concat(rest));
      }
    });
  }

  var chainedCheckType = checkType.bind(null, false); // Add isRequired to satisfy Requirable

  chainedCheckType.isRequired = checkType.bind(null, true);
  return chainedCheckType;
} // Copied from React.PropTypes


function isSymbol(propType, propValue) {
  // Native Symbol.
  if (propType === "symbol") {
    return true;
  } // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'


  if (propValue["@@toStringTag"] === "Symbol") {
    return true;
  } // Fallback for non-spec compliant Symbols which are polyfilled.


  if (typeof Symbol === "function" && propValue instanceof Symbol) {
    return true;
  }

  return false;
} // Copied from React.PropTypes


function getPropType(propValue) {
  var propType = typeof propValue;

  if (Array.isArray(propValue)) {
    return "array";
  }

  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return "object";
  }

  if (isSymbol(propType, propValue)) {
    return "symbol";
  }

  return propType;
} // This handles more types than `getPropType`. Only used for error messages.
// Copied from React.PropTypes


function getPreciseType(propValue) {
  var propType = getPropType(propValue);

  if (propType === "object") {
    if (propValue instanceof Date) {
      return "date";
    } else if (propValue instanceof RegExp) {
      return "regexp";
    }
  }

  return propType;
}

function createObservableTypeCheckerCreator(allowNativeType, mobxType) {
  return createChainableTypeChecker(function (props, propName, componentName, location, propFullName) {
    return untracked(function () {
      if (allowNativeType) {
        if (getPropType(props[propName]) === mobxType.toLowerCase()) return null;
      }

      var mobxChecker;

      switch (mobxType) {
        case "Array":
          mobxChecker = isObservableArray;
          break;

        case "Object":
          mobxChecker = isObservableObject;
          break;

        case "Map":
          mobxChecker = isObservableMap;
          break;

        default:
          throw new Error("Unexpected mobxType: " + mobxType);
      }

      var propValue = props[propName];

      if (!mobxChecker(propValue)) {
        var preciseType = getPreciseType(propValue);
        var nativeTypeExpectationMessage = allowNativeType ? " or javascript `" + mobxType.toLowerCase() + "`" : "";
        return new Error("Invalid prop `" + propFullName + "` of type `" + preciseType + "` supplied to" + " `" + componentName + "`, expected `mobx.Observable" + mobxType + "`" + nativeTypeExpectationMessage + ".");
      }

      return null;
    });
  });
}

function createObservableArrayOfTypeChecker(allowNativeType, typeChecker) {
  return createChainableTypeChecker(function (props, propName, componentName, location, propFullName) {
    for (var _len2 = arguments.length, rest = new Array(_len2 > 5 ? _len2 - 5 : 0), _key2 = 5; _key2 < _len2; _key2++) {
      rest[_key2 - 5] = arguments[_key2];
    }

    return untracked(function () {
      if (typeof typeChecker !== "function") {
        return new Error("Property `" + propFullName + "` of component `" + componentName + "` has " + "invalid PropType notation.");
      } else {
        var error = createObservableTypeCheckerCreator(allowNativeType, "Array")(props, propName, componentName, location, propFullName);
        if (error instanceof Error) return error;
        var propValue = props[propName];

        for (var i = 0; i < propValue.length; i++) {
          error = typeChecker.apply(void 0, [propValue, i, componentName, location, propFullName + "[" + i + "]"].concat(rest));
          if (error instanceof Error) return error;
        }

        return null;
      }
    });
  });
}

var observableArray =
/*#__PURE__*/
(/* unused pure expression or super */ null && (createObservableTypeCheckerCreator(false, "Array")));
var observableArrayOf =
/*#__PURE__*/
(/* unused pure expression or super */ null && (createObservableArrayOfTypeChecker.bind(null, false)));
var observableMap =
/*#__PURE__*/
(/* unused pure expression or super */ null && (createObservableTypeCheckerCreator(false, "Map")));
var observableObject =
/*#__PURE__*/
(/* unused pure expression or super */ null && (createObservableTypeCheckerCreator(false, "Object")));
var arrayOrObservableArray =
/*#__PURE__*/
(/* unused pure expression or super */ null && (createObservableTypeCheckerCreator(true, "Array")));
var arrayOrObservableArrayOf =
/*#__PURE__*/
(/* unused pure expression or super */ null && (createObservableArrayOfTypeChecker.bind(null, true)));
var objectOrObservableObject =
/*#__PURE__*/
(/* unused pure expression or super */ null && (createObservableTypeCheckerCreator(true, "Object")));
var PropTypes = (/* unused pure expression or super */ null && ({
  observableArray: observableArray,
  observableArrayOf: observableArrayOf,
  observableMap: observableMap,
  observableObject: observableObject,
  arrayOrObservableArray: arrayOrObservableArray,
  arrayOrObservableArrayOf: arrayOrObservableArrayOf,
  objectOrObservableObject: objectOrObservableObject
}));

if (!node_modules_react.Component) throw new Error("mobx-react requires React to be available");
if (!mobx_module_observable) throw new Error("mobx-react requires mobx to be available");


//# sourceMappingURL=mobxreact.esm.js.map

// EXTERNAL MODULE: ./node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js
var client = __webpack_require__(9576);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@adguard+translate@2.0.1/node_modules/@adguard/translate/dist/index.esm.js
function _defineProperty(obj, key, value) {
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

var index_esm_NODE_TYPES;

(function (NODE_TYPES) {
  NODE_TYPES["PLACEHOLDER"] = "placeholder";
  NODE_TYPES["TEXT"] = "text";
  NODE_TYPES["TAG"] = "tag";
  NODE_TYPES["VOID_TAG"] = "void_tag";
})(index_esm_NODE_TYPES || (index_esm_NODE_TYPES = {}));

var index_esm_isTextNode = function isTextNode(node) {
  return node.type === index_esm_NODE_TYPES.TEXT;
};
var index_esm_isTagNode = function isTagNode(node) {
  return node.type === index_esm_NODE_TYPES.TAG;
};
var index_esm_isPlaceholderNode = function isPlaceholderNode(node) {
  return node.type === index_esm_NODE_TYPES.PLACEHOLDER;
};
var index_esm_isVoidTagNode = function isVoidTagNode(node) {
  return node.type === index_esm_NODE_TYPES.VOID_TAG;
};
var index_esm_placeholderNode = function placeholderNode(value) {
  return {
    type: index_esm_NODE_TYPES.PLACEHOLDER,
    value: value
  };
};
var index_esm_textNode = function textNode(str) {
  return {
    type: index_esm_NODE_TYPES.TEXT,
    value: str
  };
};
var index_esm_tagNode = function tagNode(tagName, children) {
  var value = tagName.trim();
  return {
    type: index_esm_NODE_TYPES.TAG,
    value: value,
    children: children
  };
};
var index_esm_voidTagNode = function voidTagNode(tagName) {
  var value = tagName.trim();
  return {
    type: index_esm_NODE_TYPES.VOID_TAG,
    value: value
  };
};
/**
 * Checks if target is node
 * @param target
 */

var index_esm_isNode = function isNode(target) {
  if (typeof target === 'string') {
    return false;
  }

  return !!target.type;
};

var index_esm_STATE;

(function (STATE) {
  /**
   * Parser function switches to the text state when parses simple text,
   * or content between open and close tags
   */
  STATE["TEXT"] = "text";
  /**
   * Parser function switches to the tag state when meets open tag brace ("<"), and switches back,
   * when meets closing tag brace (">")
   */

  STATE["TAG"] = "tag";
  /**
   * Parser function switches to the placeholder state when meets in the text
   * open placeholders brace ("{") and switches back to the text state,
   * when meets close placeholder brace ("}")
   */

  STATE["PLACEHOLDER"] = "placeholder";
})(index_esm_STATE || (index_esm_STATE = {}));

var CONTROL_CHARS = {
  TAG_OPEN_BRACE: '<',
  TAG_CLOSE_BRACE: '>',
  CLOSING_TAG_MARK: '/',
  PLACEHOLDER_MARK: '%'
};
/**
 * Checks if text length is enough to create text node
 * If text node created, then if stack is not empty it is pushed into stack,
 * otherwise into result
 * @param context
 */

var index_esm_createTextNodeIfPossible = function createTextNodeIfPossible(context) {
  var text = context.text;

  if (text.length > 0) {
    var node = index_esm_textNode(text);

    if (context.stack.length > 0) {
      context.stack.push(node);
    } else {
      context.result.push(node);
    }
  }

  context.text = '';
};
/**
 * Checks if lastFromStack tag has any attributes
 * @param lastFromStack
 */


var index_esm_hasAttributes = function hasAttributes(lastFromStack) {
  // e.g. "a class" or "a href='#'"
  var tagStrParts = lastFromStack.split(' ');
  return tagStrParts.length > 1;
};
/**
 * Handles text state
 */


var index_esm_textStateHandler = function textStateHandler(context) {
  var currChar = context.currChar,
      currIdx = context.currIdx; // switches to the tag state

  if (currChar === CONTROL_CHARS.TAG_OPEN_BRACE) {
    context.lastTextStateChangeIdx = currIdx;
    return index_esm_STATE.TAG;
  } // switches to the placeholder state


  if (currChar === CONTROL_CHARS.PLACEHOLDER_MARK) {
    context.lastTextStateChangeIdx = currIdx;
    return index_esm_STATE.PLACEHOLDER;
  } // remains in the text state


  context.text += currChar;
  return index_esm_STATE.TEXT;
};
/**
 * Handles placeholder state
 * @param context
 */


var index_esm_placeholderStateHandler = function placeholderStateHandler(context) {
  var currChar = context.currChar,
      currIdx = context.currIdx,
      lastTextStateChangeIdx = context.lastTextStateChangeIdx,
      placeholder = context.placeholder,
      stack = context.stack,
      result = context.result,
      str = context.str;

  if (currChar === CONTROL_CHARS.PLACEHOLDER_MARK) {
    // if distance between current index and last state change equal to 1,
    // it means that placeholder mark was escaped by itself e.g. "%%",
    // so we return to the text state
    if (currIdx - lastTextStateChangeIdx === 1) {
      context.text += str.substring(lastTextStateChangeIdx, currIdx);
      return index_esm_STATE.TEXT;
    }

    index_esm_createTextNodeIfPossible(context);
    var node = index_esm_placeholderNode(placeholder); // push node to the appropriate stack

    if (stack.length > 0) {
      stack.push(node);
    } else {
      result.push(node);
    }

    context.placeholder = '';
    return index_esm_STATE.TEXT;
  }

  context.placeholder += currChar;
  return index_esm_STATE.PLACEHOLDER;
};
/**
 * Switches current state to the tag state and returns tag state handler
 */


var index_esm_tagStateHandler = function tagStateHandler(context) {
  var currChar = context.currChar,
      text = context.text,
      stack = context.stack,
      result = context.result,
      lastTextStateChangeIdx = context.lastTextStateChangeIdx,
      currIdx = context.currIdx,
      str = context.str;
  var tag = context.tag; // if found tag end ">"

  if (currChar === CONTROL_CHARS.TAG_CLOSE_BRACE) {
    // if the tag is close tag e.g. </a>
    if (tag.indexOf(CONTROL_CHARS.CLOSING_TAG_MARK) === 0) {
      // remove slash from tag
      tag = tag.substring(1);
      var children = [];

      if (text.length > 0) {
        children.push(index_esm_textNode(text));
        context.text = '';
      }

      var pairTagFound = false; // looking for the pair to the close tag

      while (!pairTagFound && stack.length > 0) {
        var lastFromStack = stack.pop(); // if tag from stack equal to close tag

        if (lastFromStack === tag) {
          // create tag node
          var node = index_esm_tagNode(tag, children); // and add it to the appropriate stack

          if (stack.length > 0) {
            stack.push(node);
          } else {
            result.push(node);
          }

          children = [];
          pairTagFound = true;
        } else if (index_esm_isNode(lastFromStack)) {
          // add nodes between close tag and open tag to the children
          children.unshift(lastFromStack);
        } else {
          if (typeof lastFromStack === 'string' && index_esm_hasAttributes(lastFromStack)) {
            throw new Error("Tags in string should not have attributes: ".concat(str));
          } else {
            throw new Error("String has unbalanced tags: ".concat(str));
          }
        }

        if (stack.length === 0 && children.length > 0) {
          throw new Error("String has unbalanced tags: ".concat(str));
        }
      }

      context.tag = '';
      return index_esm_STATE.TEXT;
    } // if the tag is void tag e.g. <img/>


    if (tag.lastIndexOf(CONTROL_CHARS.CLOSING_TAG_MARK) === tag.length - 1) {
      tag = tag.substring(0, tag.length - 1);
      index_esm_createTextNodeIfPossible(context);

      var _node = index_esm_voidTagNode(tag); // add node to the appropriate stack


      if (stack.length > 0) {
        stack.push(_node);
      } else {
        result.push(_node);
      }

      context.tag = '';
      return index_esm_STATE.TEXT;
    }

    index_esm_createTextNodeIfPossible(context);
    stack.push(tag);
    context.tag = '';
    return index_esm_STATE.TEXT;
  } // If we meet open tag "<" it means that we wrongly moved into tag state


  if (currChar === CONTROL_CHARS.TAG_OPEN_BRACE) {
    context.text += str.substring(lastTextStateChangeIdx, currIdx);
    context.lastTextStateChangeIdx = currIdx;
    context.tag = '';
    return index_esm_STATE.TAG;
  }

  context.tag += currChar;
  return index_esm_STATE.TAG;
};
/**
 * Parses string into AST (abstract syntax tree) and returns it
 * e.g.
 * parse("String to <a>translate</a>") ->
 * ```
 *      [
 *           { type: 'text', value: 'String to ' },
 *           { type: 'tag', value: 'a', children: [{ type: 'text', value: 'translate' }] }
 *      ];
 * ```
 * Empty string is parsed into empty AST (abstract syntax tree): "[]"
 *
 * @param str Message in simplified ICU like syntax without plural support.
 *
 * @returns AST representation of the input string.
 *
 * @throws Error if tags have attributes or string has unbalanced tags or placeholder marker '%' is unclosed.
 */


var index_esm_parser = function parser() {
  var _STATE_HANDLERS;

  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var context = {
    /**
     * Stack is used to keep and search nested tag nodes
     */
    stack: [],

    /**
     * Result is stack where function allocates nodes
     */
    result: [],

    /**
     * Current char index
     */
    currIdx: 0,

    /**
     * Saves index of the last state change from the text state,
     * used to restore parsed text if we moved into other state wrongly
     */
    lastTextStateChangeIdx: 0,

    /**
     * Accumulated tag value
     */
    tag: '',

    /**
     * Accumulated text value
     */
    text: '',

    /**
     * Accumulated placeholder value
     */
    placeholder: '',

    /**
     * Parsed string
     */
    str: str
  };
  var STATE_HANDLERS = (_STATE_HANDLERS = {}, _defineProperty(_STATE_HANDLERS, index_esm_STATE.TEXT, index_esm_textStateHandler), _defineProperty(_STATE_HANDLERS, index_esm_STATE.PLACEHOLDER, index_esm_placeholderStateHandler), _defineProperty(_STATE_HANDLERS, index_esm_STATE.TAG, index_esm_tagStateHandler), _STATE_HANDLERS); // Start from text state

  var currentState = index_esm_STATE.TEXT;

  while (context.currIdx < str.length) {
    context.currChar = str[context.currIdx];
    var currentStateHandler = STATE_HANDLERS[currentState];
    currentState = currentStateHandler(context);
    context.currIdx += 1;
  }

  var result = context.result,
      text = context.text,
      stack = context.stack,
      lastTextStateChangeIdx = context.lastTextStateChangeIdx; // Means that placeholder nodes were not closed

  if (currentState === index_esm_STATE.PLACEHOLDER) {
    throw new Error("Unclosed placeholder marker '%' in string: ".concat(str));
  } // Means that tag node were not closed, so we consider them as text


  if (currentState !== index_esm_STATE.TEXT) {
    var restText = str.substring(lastTextStateChangeIdx);

    if ((restText + text).length > 0) {
      result.push(index_esm_textNode(text + restText));
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (text.length > 0) {
      result.push(index_esm_textNode(text));
    }
  }

  if (stack.length > 0) {
    throw new Error("String has unbalanced tags: ".concat(context.str));
  }

  return result;
};

function index_esm_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { index_esm_ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { index_esm_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Helper functions used by default to assemble strings from tag nodes
 * @param tagName
 * @param children
 */

var index_esm_createStringElement = function createStringElement(tagName, children) {
  if (children) {
    return "<".concat(tagName, ">").concat(children, "</").concat(tagName, ">");
  }

  return "<".concat(tagName, "/>");
};
/**
 * Creates map with default values for tag converters
 */


var index_esm_createDefaultValues = function createDefaultValues() {
  return {
    p: function p(children) {
      return index_esm_createStringElement('p', children);
    },
    b: function b(children) {
      return index_esm_createStringElement('b', children);
    },
    strong: function strong(children) {
      return index_esm_createStringElement('strong', children);
    },
    tt: function tt(children) {
      return index_esm_createStringElement('tt', children);
    },
    s: function s(children) {
      return index_esm_createStringElement('s', children);
    },
    i: function i(children) {
      return index_esm_createStringElement('i', children);
    }
  };
};
/**
 * Returns prepared error message text.
 *
 * @param nodeType Node type.
 * @param nodeValue Node value.
 * @param key String key.
 *
 * @returns Error message.
 */


var index_esm_getErrorMessage = function getErrorMessage(nodeType, nodeValue, key) {
  var errorMessage = "Value '".concat(nodeValue, "' for '").concat(nodeType, "' was not provided");

  if (key) {
    errorMessage += " in string '".concat(key, "'");
  }

  return errorMessage;
};
/**
 * This function accepts an AST (abstract syntax tree) which is a result
 * of the parser function call, and converts tree nodes into array of strings replacing node
 * values with provided values.
 * Values is a map with functions or strings, where each key is related to placeholder value
 * or tag value
 * e.g.
 * string "text <tag>tag text</tag> %placeholder%" is parsed into next AST
 *
 *      [
 *          { type: 'text', value: 'text ' },
 *          {
 *              type: 'tag',
 *              value: 'tag',
 *              children: [{ type: 'text', value: 'tag text' }],
 *          },
 *          { type: 'text', value: ' ' },
 *          { type: 'placeholder', value: 'placeholder' }
 *      ];
 *
 * this AST after format and next values
 *
 *      {
 *          // here used template strings, but it can be react components as well
 *          tag: (chunks) => `<b>${chunks}</b>`,
 *          placeholder: 'placeholder text'
 *      }
 *
 * will return next array
 *
 * [ 'text ', '<b>tag text</b>', ' ', 'placeholder text' ]
 *
 * as you can see, <tag> was replaced by <b>, and placeholder was replaced by placeholder text
 *
 * @param key
 * @param ast - AST (abstract syntax tree)
 * @param values
 */


var index_esm_format = function format(key) {
  var ast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var values = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var result = [];

  var tmplValues = _objectSpread(_objectSpread({}, index_esm_createDefaultValues()), values);

  var i = 0;

  while (i < ast.length) {
    var currentNode = ast[i]; // if current node is text node, there is nothing to change, append value to the result

    if (index_esm_isTextNode(currentNode)) {
      result.push(currentNode.value);
    } else if (index_esm_isTagNode(currentNode)) {
      var children = _toConsumableArray(format(key, currentNode.children, tmplValues));

      var value = tmplValues[currentNode.value];

      if (value) {
        // TODO consider using strong typing
        if (typeof value === 'function') {
          result.push(value(children.join('')));
        } else {
          result.push(value);
        }
      } else {
        throw new Error(index_esm_getErrorMessage(currentNode.type, currentNode.value, key));
      }
    } else if (index_esm_isVoidTagNode(currentNode)) {
      var _value = tmplValues[currentNode.value]; // TODO consider using strong typing

      if (_value && typeof _value === 'string') {
        result.push(_value);
      } else {
        throw new Error(index_esm_getErrorMessage(currentNode.type, currentNode.value, key));
      }
    } else if (index_esm_isPlaceholderNode(currentNode)) {
      var _value2 = tmplValues[currentNode.value]; // TODO consider using strong typing

      if (_value2 && typeof _value2 === 'string') {
        result.push(_value2);
      } else {
        throw new Error(index_esm_getErrorMessage(currentNode.type, currentNode.value, key));
      }
    }

    i += 1;
  }

  return result;
};
/**
 * Function gets AST (abstract syntax tree) or string and formats messages,
 * replacing values accordingly
 * e.g.
 *      const message = formatter('<a>some text</a>', {
 *          a: (chunks) => `<a href="#">${chunks}</a>`,
 *      });
 *      console.log(message); // ['<a href="#">some text</a>']
 *
 * @param key
 * @param message
 * @param values
 */


var index_esm_formatter = function formatter(key, message, values) {
  var ast = index_esm_parser(message);
  var preparedValues = {}; // convert values to strings if not a function

  if (values) {
    Object.keys(values).forEach(function (key) {
      var value = values[key]; // TODO consider using strong typing

      if (typeof value === 'function') {
        preparedValues[key] = value;
      } else {
        preparedValues[key] = String(value);
      }
    });
  }

  return index_esm_format(key, ast, preparedValues);
};

var _pluralFormsCount;

var index_esm_AvailableLocales;

(function (AvailableLocales) {
  AvailableLocales["az"] = "az";
  AvailableLocales["bo"] = "bo";
  AvailableLocales["dz"] = "dz";
  AvailableLocales["id"] = "id";
  AvailableLocales["ja"] = "ja";
  AvailableLocales["jv"] = "jv";
  AvailableLocales["ka"] = "ka";
  AvailableLocales["km"] = "km";
  AvailableLocales["kn"] = "kn";
  AvailableLocales["ko"] = "ko";
  AvailableLocales["ms"] = "ms";
  AvailableLocales["th"] = "th";
  AvailableLocales["tr"] = "tr";
  AvailableLocales["vi"] = "vi";
  AvailableLocales["zh"] = "zh";
  AvailableLocales["zh_cn"] = "zh_cn";
  AvailableLocales["zh_tw"] = "zh_tw";
  AvailableLocales["af"] = "af";
  AvailableLocales["bn"] = "bn";
  AvailableLocales["bg"] = "bg";
  AvailableLocales["ca"] = "ca";
  AvailableLocales["da"] = "da";
  AvailableLocales["de"] = "de";
  AvailableLocales["el"] = "el";
  AvailableLocales["en"] = "en";
  AvailableLocales["eo"] = "eo";
  AvailableLocales["es"] = "es";
  AvailableLocales["et"] = "et";
  AvailableLocales["eu"] = "eu";
  AvailableLocales["fa"] = "fa";
  AvailableLocales["fi"] = "fi";
  AvailableLocales["fo"] = "fo";
  AvailableLocales["fur"] = "fur";
  AvailableLocales["fy"] = "fy";
  AvailableLocales["gl"] = "gl";
  AvailableLocales["gu"] = "gu";
  AvailableLocales["ha"] = "ha";
  AvailableLocales["he"] = "he";
  AvailableLocales["hu"] = "hu";
  AvailableLocales["is"] = "is";
  AvailableLocales["it"] = "it";
  AvailableLocales["ku"] = "ku";
  AvailableLocales["lb"] = "lb";
  AvailableLocales["ml"] = "ml";
  AvailableLocales["mn"] = "mn";
  AvailableLocales["mr"] = "mr";
  AvailableLocales["nah"] = "nah";
  AvailableLocales["nb"] = "nb";
  AvailableLocales["ne"] = "ne";
  AvailableLocales["nl"] = "nl";
  AvailableLocales["nn"] = "nn";
  AvailableLocales["no"] = "no";
  AvailableLocales["oc"] = "oc";
  AvailableLocales["om"] = "om";
  AvailableLocales["or"] = "or";
  AvailableLocales["pa"] = "pa";
  AvailableLocales["pap"] = "pap";
  AvailableLocales["ps"] = "ps";
  AvailableLocales["pt"] = "pt";
  AvailableLocales["pt_pt"] = "pt_pt";
  AvailableLocales["pt_br"] = "pt_br";
  AvailableLocales["so"] = "so";
  AvailableLocales["sq"] = "sq";
  AvailableLocales["sv"] = "sv";
  AvailableLocales["sw"] = "sw";
  AvailableLocales["ta"] = "ta";
  AvailableLocales["te"] = "te";
  AvailableLocales["tk"] = "tk";
  AvailableLocales["ur"] = "ur";
  AvailableLocales["zu"] = "zu";
  AvailableLocales["am"] = "am";
  AvailableLocales["bh"] = "bh";
  AvailableLocales["fil"] = "fil";
  AvailableLocales["fr"] = "fr";
  AvailableLocales["gun"] = "gun";
  AvailableLocales["hi"] = "hi";
  AvailableLocales["hy"] = "hy";
  AvailableLocales["ln"] = "ln";
  AvailableLocales["mg"] = "mg";
  AvailableLocales["nso"] = "nso";
  AvailableLocales["xbr"] = "xbr";
  AvailableLocales["ti"] = "ti";
  AvailableLocales["wa"] = "wa";
  AvailableLocales["be"] = "be";
  AvailableLocales["bs"] = "bs";
  AvailableLocales["hr"] = "hr";
  AvailableLocales["ru"] = "ru";
  AvailableLocales["sr"] = "sr";
  AvailableLocales["uk"] = "uk";
  AvailableLocales["cs"] = "cs";
  AvailableLocales["sk"] = "sk";
  AvailableLocales["ga"] = "ga";
  AvailableLocales["lt"] = "lt";
  AvailableLocales["sl"] = "sl";
  AvailableLocales["mk"] = "mk";
  AvailableLocales["mt"] = "mt";
  AvailableLocales["lv"] = "lv";
  AvailableLocales["pl"] = "pl";
  AvailableLocales["cy"] = "cy";
  AvailableLocales["ro"] = "ro";
  AvailableLocales["ar"] = "ar";
  AvailableLocales["sr_latn"] = "sr_latn";
})(index_esm_AvailableLocales || (index_esm_AvailableLocales = {}));

var index_esm_getPluralFormId = function getPluralFormId(locale, number) {
  var _supportedForms;

  if (number === 0) {
    return 0;
  }

  var slavNum = number % 10 === 1 && number % 100 !== 11 ? 1 : number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20) ? 2 : 3;
  var supportedForms = (_supportedForms = {}, _defineProperty(_supportedForms, index_esm_AvailableLocales.az, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.bo, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.dz, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.id, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.ja, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.jv, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.ka, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.km, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.kn, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.ko, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.ms, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.th, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.tr, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.vi, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.zh, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.zh_tw, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.zh_cn, 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.af, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.bn, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.bg, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.ca, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.da, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.de, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.el, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.en, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.eo, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.es, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.et, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.eu, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.fa, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.fi, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.fo, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.fur, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.fy, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.gl, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.gu, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.ha, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.he, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.hu, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.is, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.it, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.ku, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.lb, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.ml, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.mn, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.mr, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.nah, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.nb, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.ne, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.nl, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.nn, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.no, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.oc, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.om, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.or, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.pa, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.pap, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.ps, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.pt, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.pt_pt, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.pt_br, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.so, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.sq, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.sv, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.sw, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.ta, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.te, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.tk, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.ur, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.zu, number === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.am, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.bh, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.fil, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.fr, number === 0 || number >= 2 ? 2 : 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.gun, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.hi, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.hy, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.ln, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.mg, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.nso, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.xbr, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.ti, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.wa, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, index_esm_AvailableLocales.be, slavNum), _defineProperty(_supportedForms, index_esm_AvailableLocales.bs, slavNum), _defineProperty(_supportedForms, index_esm_AvailableLocales.hr, slavNum), _defineProperty(_supportedForms, index_esm_AvailableLocales.ru, slavNum), _defineProperty(_supportedForms, index_esm_AvailableLocales.sr, slavNum), _defineProperty(_supportedForms, index_esm_AvailableLocales.sr_latn, slavNum), _defineProperty(_supportedForms, index_esm_AvailableLocales.uk, slavNum), _defineProperty(_supportedForms, index_esm_AvailableLocales.cs, number === 1 ? 1 : number >= 2 && number <= 4 ? 2 : 3), _defineProperty(_supportedForms, index_esm_AvailableLocales.sk, number === 1 ? 1 : number >= 2 && number <= 4 ? 2 : 3), _defineProperty(_supportedForms, index_esm_AvailableLocales.ga, number === 1 ? 1 : number === 2 ? 2 : 3), _defineProperty(_supportedForms, index_esm_AvailableLocales.lt, number % 10 === 1 && number % 100 !== 11 ? 1 : number % 10 >= 2 && (number % 100 < 10 || number % 100 >= 20) ? 2 : 3), _defineProperty(_supportedForms, index_esm_AvailableLocales.sl, number % 100 === 1 ? 1 : number % 100 === 2 ? 2 : number % 100 === 3 || number % 100 === 4 ? 3 : 4), _defineProperty(_supportedForms, index_esm_AvailableLocales.mk, number % 10 === 1 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.mt, number === 1 ? 1 : number === 0 || number % 100 > 1 && number % 100 < 11 ? 2 : number % 100 > 10 && number % 100 < 20 ? 3 : 4), _defineProperty(_supportedForms, index_esm_AvailableLocales.lv, number === 0 ? 0 : number % 10 === 1 && number % 100 !== 11 ? 1 : 2), _defineProperty(_supportedForms, index_esm_AvailableLocales.pl, number === 1 ? 1 : number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 12 || number % 100 > 14) ? 2 : 3), _defineProperty(_supportedForms, index_esm_AvailableLocales.cy, number === 1 ? 0 : number === 2 ? 1 : number === 8 || number === 11 ? 2 : 3), _defineProperty(_supportedForms, index_esm_AvailableLocales.ro, number === 1 ? 1 : number === 1 || number % 100 > 0 && number % 100 < 20 ? 2 : 3), _defineProperty(_supportedForms, index_esm_AvailableLocales.ar, number === 0 ? 0 : number === 1 ? 1 : number === 2 ? 2 : number % 100 >= 3 && number % 100 <= 10 ? 3 : number % 100 >= 11 && number % 100 <= 99 ? 4 : 5), _supportedForms);
  return supportedForms[locale];
};

var pluralFormsCount = (_pluralFormsCount = {}, _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.az, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.bo, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.dz, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.id, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ja, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.jv, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ka, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.km, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.kn, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ko, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ms, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.th, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.tr, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.vi, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.zh, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.zh_cn, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.zh_tw, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.af, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.bn, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.bg, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ca, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.da, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.de, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.el, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.en, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.eo, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.es, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.et, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.eu, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.fa, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.fi, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.fo, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.fur, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.fy, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.gl, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.gu, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ha, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.he, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.hu, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.is, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.it, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ku, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.lb, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ml, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.mn, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.mr, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.nah, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.nb, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ne, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.nl, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.nn, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.no, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.oc, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.om, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.or, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.pa, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.pap, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ps, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.pt, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.pt_pt, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.pt_br, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.so, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.sq, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.sv, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.sw, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ta, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.te, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.tk, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ur, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.zu, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.am, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.bh, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.fil, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.fr, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.gun, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.hi, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.hy, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ln, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.mg, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.nso, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.xbr, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ti, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.wa, 2), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.be, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.bs, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.hr, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ru, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.sr, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.sr_latn, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.uk, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.cs, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.sk, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ga, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.lt, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.sl, 5), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.mk, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.mt, 5), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.lv, 3), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.pl, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.cy, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ro, 4), _defineProperty(_pluralFormsCount, index_esm_AvailableLocales.ar, 6), _pluralFormsCount);
var PLURAL_STRING_DELIMITER = '|';
/**
 * Returns string plural forms which are separated by `|`.
 *
 * @param str Message.
 *
 * @returns Array of plural forms.
 */

var index_esm_getForms = function getForms(str) {
  return str.split(PLURAL_STRING_DELIMITER);
};
/**
 * Checks whether the string has correct number of plural forms.
 *
 * @param str Translated string.
 * @param locale Locale.
 * @param key Optional, base key.
 *
 * @throws Error if the number of plural forms is incorrect.
 */

var index_esm_checkForms = function checkForms(str, locale, key) {
  var givenCount = index_esm_getForms(str).length;
  var requiredCount = pluralFormsCount[locale]; // e.g. 'sr-latn' may be passed and it is not supported, 'sr_latn' should be used

  if (typeof requiredCount === 'undefined') {
    throw new Error("Locale is not supported: '".concat(locale, "'"));
  }

  if (givenCount !== requiredCount) {
    var prefix = typeof key !== 'undefined' ? "Invalid plural string \"".concat(key, "\" for locale '").concat(locale, "'") : "Invalid plural string for locale '".concat(locale, "'");
    throw new Error("".concat(prefix, ": required ").concat(requiredCount, ", given ").concat(givenCount, " in string \"").concat(str, "\""));
  }
};
/**
 * Checks whether plural forms are present in base string
 * by checking the presence of the vertical bar `|`.
 *
 * @param baseStr Base string.
 *
 * @returns True if `baseStr` contains `|`, false otherwise.
 */


var index_esm_hasPluralForm = function hasPluralForm(baseStr) {
  return baseStr.includes(PLURAL_STRING_DELIMITER);
};
/**
 * Checks if plural forms are valid.
 *
 * @param targetStr Translated message with plural forms.
 * @param locale Locale.
 * @param key Optional, message key, used for clearer log message.
 *
 * @returns True if plural forms are valid, false otherwise.
 */

var index_esm_isPluralFormValid = function isPluralFormValid(targetStr, locale, key) {
  try {
    index_esm_checkForms(targetStr, locale, key);
    return true;
  } catch (error) {
    return false;
  }
};
/**
 * Returns plural form corresponding to number
 * @param str
 * @param number
 * @param locale - current locale
 * @param key - message key
 */

var index_esm_getForm = function getForm(str, number, locale, key) {
  index_esm_checkForms(str, locale, key);
  var forms = index_esm_getForms(str);
  var currentForm = index_esm_getPluralFormId(locale, number);
  return forms[currentForm].trim();
};

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var index_esm_defaultMessageConstructor = function defaultMessageConstructor(formatted) {
  return formatted.join('');
};

var index_esm_Translator = /*#__PURE__*/function () {
  function Translator(i18n, // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messageConstructor, values) {
    _classCallCheck(this, Translator);

    this.i18n = i18n;
    this.messageConstructor = messageConstructor || index_esm_defaultMessageConstructor;
    this.values = values || {};
  }
  /**
   * Retrieves message and translates it, substituting parameters where necessary
   * @param key - translation message key
   * @param params - values used to substitute placeholders and tags
   */


  _createClass(Translator, [{
    key: "getMessage",
    value: function getMessage(key) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var message = this.i18n.getMessage(key);

      if (!message) {
        message = this.i18n.getBaseMessage(key);

        if (!message) {
          throw new Error("Was unable to find message for key: \"".concat(key, "\""));
        }
      }

      var formatted = index_esm_formatter(key, message, _objectSpread$1(_objectSpread$1({}, this.values), params));
      return this.messageConstructor(formatted);
    }
    /**
     * Retrieves correct plural form and translates it
     * @param key - translation message key
     * @param number - plural form number
     * @param params - values used to substitute placeholders or tags if necessary,
     * if params has "count" property it will be overridden by number (plural form number)
     */

  }, {
    key: "getPlural",
    value: function getPlural(key, number) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var message = this.i18n.getMessage(key);
      var language = this.i18n.getUILanguage();

      if (!message) {
        message = this.i18n.getBaseMessage(key);

        if (!message) {
          throw new Error("Was unable to find message for key: \"".concat(key, "\""));
        }

        language = this.i18n.getBaseUILanguage();
      }

      var form = index_esm_getForm(message, number, language, key);
      var formatted = index_esm_formatter(key, form, _objectSpread$1(_objectSpread$1(_objectSpread$1({}, this.values), params), {}, {
        count: number
      }));
      return this.messageConstructor(formatted);
    }
  }]);

  return Translator;
}();

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Creates translation function for strings used in the React components
 * We do not import React directly, because translator module can be used
 * in the modules without React too
 *
 * e.g.
 * const translateReact = createReactTranslator(getMessage, React);
 * in locales folder you should have messages.json file
 * ```
 * message:
 *     "popup_auth_agreement_consent": {
 *          "message": "You agree to our <eula>EULA</eula>",
 *      },
 * ```
 *
 * this message can be retrieved and translated into react components next way:
 *
 * const component = translateReact('popup_auth_agreement_consent', {
 *          eula: (chunks) => (
 *              <button
 *                  className="auth__privacy-link"
 *                  onClick={handleEulaClick}
 *              >
 *                  {chunks}
 *              </button>
 *          ),
 *       });
 *
 * Note how functions in the values argument can be used with handlers
 *
 * @param i18n - object with methods which get translated message by key and return current locale
 * @param React - instance of react library
 */

var index_esm_createReactTranslator = function createReactTranslator(i18n, react, defaults) {
  /**
   * Helps to build nodes without values
   *
   * @param tagName
   * @param children
   */
  var createReactElement = function createReactElement(tagName, children) {
    if (children) {
      return react.createElement(tagName, null, react.Children.toArray(children));
    }

    return react.createElement(tagName, null);
  };
  /**
   * Function creates default values to be used if user didn't provide function values for tags
   */


  var createDefaultValues = function createDefaultValues() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    var externalDefaults = {};

    if (defaults) {
      defaults.tags.forEach(function (t) {
        externalDefaults[t.key] = function (children) {
          return createReactElement(t.createdTag, children);
        };
      });
    }

    if (defaults !== null && defaults !== void 0 && defaults.override) {
      return externalDefaults;
    }

    return _objectSpread$2({
      p: function p(children) {
        return createReactElement('p', children);
      },
      b: function b(children) {
        return createReactElement('b', children);
      },
      strong: function strong(children) {
        return createReactElement('strong', children);
      },
      tt: function tt(children) {
        return createReactElement('tt', children);
      },
      s: function s(children) {
        return createReactElement('s', children);
      },
      i: function i(children) {
        return createReactElement('i', children);
      }
    }, externalDefaults);
  };

  var reactMessageConstructor = function reactMessageConstructor(formatted) {
    var reactChildren = react.Children.toArray(formatted); // if there is only strings in the array we join them

    if (reactChildren.every(function (child) {
      return typeof child === 'string';
    })) {
      return reactChildren.join('');
    }

    return reactChildren;
  };

  var defaultValues = createDefaultValues();
  return new index_esm_Translator(i18n, reactMessageConstructor, defaultValues);
};

var index_esm_r,
    index_esm_f;

function A(n, l) {
  return l = l || [], null == n || "boolean" == typeof n || (Array.isArray(n) ? n.some(function (n) {
    A(n, l);
  }) : l.push(n)), l;
}

index_esm_r = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, index_esm_f = 0;

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Creates translation function for strings used in the Preact components
 * We do not import Preact directly, because translator module can be used
 * in the modules without Preact too
 *
 * e.g.
 * const translatePreact = createPreactTranslator(getMessage, Preact);
 * in locales folder you should have messages.json file
 * ```
 * message:
 *     "popup_auth_agreement_consent": {
 *          "message": "You agree to our <eula>EULA</eula>",
 *      },
 * ```
 *
 * this message can be retrieved and translated into preact components next way:
 *
 * const component = translatePreact('popup_auth_agreement_consent', {
 *          eula: (chunks) => (
 *              <button
 *                  className="auth__privacy-link"
 *                  onClick={handleEulaClick}
 *              >
 *                  {chunks}
 *              </button>
 *          ),
 *       });
 *
 * Note how functions in the values argument can be used with handlers
 *
 * @param i18n - object with methods which get translated message by key and return current locale
 * @param Preact - instance of preact library
 */

var index_esm_createPreactTranslator = function createPreactTranslator(i18n, preact, defaults) {
  /**
   * Helps to build nodes without values
   *
   * @param tagName
   * @param children
   */
  var createPreactElement = function createPreactElement(tagName, children) {
    if (children) {
      return preact.createElement(tagName, null, A(children));
    }

    return preact.createElement(tagName, null);
  };
  /**
   * Function creates default values to be used if user didn't provide function values for tags
   */


  var createDefaultValues = function createDefaultValues() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    var externalDefaults = {};

    if (defaults) {
      defaults.tags.forEach(function (t) {
        externalDefaults[t.key] = function (children) {
          return createPreactElement(t.createdTag, children);
        };
      });
    }

    if (defaults !== null && defaults !== void 0 && defaults.override) {
      return externalDefaults;
    }

    return _objectSpread$3({
      p: function p(children) {
        return createPreactElement('p', children);
      },
      b: function b(children) {
        return createPreactElement('b', children);
      },
      strong: function strong(children) {
        return createPreactElement('strong', children);
      },
      tt: function tt(children) {
        return createPreactElement('tt', children);
      },
      s: function s(children) {
        return createPreactElement('s', children);
      },
      i: function i(children) {
        return createPreactElement('i', children);
      }
    }, externalDefaults);
  };

  var preactMessageConstructor = function preactMessageConstructor(formatted) {
    var preactChildren = A(formatted); // if there is only strings in the array we join them

    if (preactChildren.every(function (child) {
      return typeof child === 'string';
    })) {
      return preactChildren.join('');
    }

    return preactChildren;
  };

  var defaultValues = createDefaultValues();
  return new index_esm_Translator(i18n, preactMessageConstructor, defaultValues);
};

/**
 * Creates translator instance strings, by default for simple strings
 * @param i18n - function which returns translated message by key
 * @param messageConstructor - function that will collect messages
 * @param values - map with default values for tag converters
 */

var index_esm_createTranslator = function createTranslator(i18n, messageConstructor, values) {
  return new index_esm_Translator(i18n, messageConstructor, values);
};

var translate = {
  createTranslator: index_esm_createTranslator,
  createReactTranslator: index_esm_createReactTranslator,
  createPreactTranslator: index_esm_createPreactTranslator
};

function index_esm_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    index_esm_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    index_esm_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return index_esm_typeof(obj);
}

/**
 * Compares two AST (abstract syntax tree) structures,
 * view tests for examples
 * @param baseAst
 * @param targetAst
 */

var index_esm_areAstStructuresSame = function areAstStructuresSame(baseAst, targetAst) {
  var textNodeFilter = function textNodeFilter(node) {
    return !index_esm_isTextNode(node);
  };

  var filteredBaseAst = baseAst.filter(textNodeFilter);
  var filteredTargetAst = targetAst.filter(textNodeFilter); // if AST structures have different lengths, they are not equal

  if (filteredBaseAst.length !== filteredTargetAst.length) {
    return false;
  }

  var _loop = function _loop(i) {
    var baseNode = filteredBaseAst[i];
    var targetNode = filteredTargetAst.find(function (node) {
      return node.type === baseNode.type && node.value === baseNode.value;
    });

    if (!targetNode) {
      return {
        v: false
      };
    }

    if (targetNode.children && baseNode.children) {
      var areChildrenSame = areAstStructuresSame(baseNode.children, targetNode.children);

      if (!areChildrenSame) {
        return {
          v: false
        };
      }
    }
  };

  for (var i = 0; i < filteredBaseAst.length; i += 1) {
    var _ret = _loop(i);

    if (index_esm_typeof(_ret) === "object") return _ret.v;
  }

  return true;
};
/**
 * Validates translation against base string by AST (abstract syntax tree) structure.
 *
 * @param baseMessage Base message.
 * @param translatedMessage Translated message.
 * @param locale Locale of `translatedMessage`.
 *
 * @returns True if translated message is valid, false otherwise:
 * - if base message has no plural forms, it will return true if AST structures are same;
 * - if base message has plural forms, first of all
 *   the function checks if the number of plural forms is correct for the `locale`,
 *   and then it validates AST plural forms structures for base and translated messages.
 *
 * @throws Error for invalid tags in base or translated messages,
 * if translated message has invalid plural forms,
 * or if base or translated message has unclosed placeholder markers.
 */


var index_esm_isTranslationValid = function isTranslationValid(baseMessage, translatedMessage, locale) {
  if (index_esm_hasPluralForm(baseMessage)) {
    var isPluralFormsValid = index_esm_isPluralFormValid(translatedMessage, locale);

    if (!isPluralFormsValid) {
      throw new Error('Invalid plural forms');
    }

    var baseForms = index_esm_getForms(baseMessage);
    var translatedForms = index_esm_getForms(translatedMessage); // check a zero form structures of base and translated messages

    if (!isTranslationValid(baseForms[0], translatedForms[0], locale)) {
      return false;
    } // and check other forms structures of translated messages against the first form of base message


    for (var i = 1; i < translatedForms.length; i += 1) {
      if (!isTranslationValid(baseForms[1], translatedForms[i], locale)) {
        return false;
      }
    } // if no errors, return true after all checks


    return true;
  }

  var baseMessageAst = index_esm_parser(baseMessage);
  var translatedMessageAst = index_esm_parser(translatedMessage);
  return index_esm_areAstStructuresSame(baseMessageAst, translatedMessageAst);
};
var index_esm_validator = (/* unused pure expression or super */ null && ({
  isTranslationValid: index_esm_isTranslationValid,
  isPluralFormValid: index_esm_isPluralFormValid
}));



// EXTERNAL MODULE: ./node_modules/.pnpm/webextension-polyfill@0.12.0/node_modules/webextension-polyfill/dist/browser-polyfill.js
var browser_polyfill = __webpack_require__(3675);
var browser_polyfill_default = /*#__PURE__*/__webpack_require__.n(browser_polyfill);
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
function es_getErrorMessage(error) {
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
        const message = es_getErrorMessage(error);
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
const getUrl = (url)=>browser_polyfill_default().runtime.getURL(url);
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
let dist_store;
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
	if (!dist_store) dist_store = /* @__PURE__ */ new Map();
	if (!dist_store.get(locales)) dist_store.set(locales, new Intl.Segmenter(locales, { granularity: "word" }));
	const segments = dist_store.get(locales).segment(input);
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
function dist_check(requirement, message$1) {
	return {
		kind: "validation",
		type: "check",
		reference: dist_check,
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
function dist_description(description_) {
	return {
		kind: "metadata",
		type: "description",
		reference: dist_description,
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
function dist_entries(requirement, message$1) {
	return {
		kind: "validation",
		type: "entries",
		reference: dist_entries,
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
function dist_title(title_) {
	return {
		kind: "metadata",
		type: "title",
		reference: dist_title,
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
function dist_values(requirement, message$1) {
	return {
		kind: "validation",
		type: "values",
		reference: dist_values,
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
function dist_is(schema, input) {
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
function dist_instance(class_, message$1) {
	return {
		kind: "schema",
		type: "instance",
		reference: dist_instance,
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
function dist_map(key, value$1, message$1) {
	return {
		kind: "schema",
		type: "map",
		reference: dist_map,
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
function dist_promise(message$1) {
	return {
		kind: "schema",
		type: "promise",
		reference: dist_promise,
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
function dist_set(value$1, message$1) {
	return {
		kind: "schema",
		type: "set",
		reference: dist_set,
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
function dist_symbol(message$1) {
	return {
		kind: "schema",
		type: "symbol",
		reference: dist_symbol,
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
function dist_variant(key, options, message$1) {
	return {
		kind: "schema",
		type: "variant",
		reference: dist_variant,
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
function dist_parser(schema, config$1) {
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
function dist_unwrap(schema) {
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


;// CONCATENATED MODULE: ./.twosky.json
var _twosky_namespaceObject = JSON.parse('[{"eo":{"ar":"Arabic","be":"Belarusian","bg":"Bulgarian","ca":"Catalan","cs":"Czech","da":"Danish","de":"German","el":"Greek","en":"English","es":"Spanish","fa":"Persian","fi":"Finnish","fr":"French","he":"Hebrew","hr":"Croatian","hu":"Hungarian","hy":"Armenian","id":"Indonesian","it":"Italian","ja":"Japanese","ko":"Korean","lt":"Lithuanian","mk":"Macedonian","ms":"Malay","nb":"Norwegian Bokmal","nl":"Dutch","pl":"Polish","pt_BR":"Portuguese, Brazilian","pt_PT":"Portuguese","ro":"Romanian","ru":"Russian","sk":"Slovak","sl":"Slovenian","sr":"Serbian (Latin)","sv":"Swedish","tr":"Turkish","uk":"Ukrainian","vi":"Vietnamese","zh_CN":"Chinese Simplified","zh_TW":"Chinese Traditional"}}]')
;// CONCATENATED MODULE: ./src/common/locale/localeConstants.ts


/**
 * Base locale used as fallback when translations are missing.
 */ const BASE_LOCALE = 'en';
/**
 * Locale prefix for Russian language.
 */ const RU_LOCALE = 'ru';
/**
 * Sentinel value meaning "use browser language" (auto-detect).
 */ const LANGUAGE_AUTO = 'auto';
/**
 * All supported locale codes, derived from `.twosky.json` languages.
 * Sorted alphabetically.
 */ const AVAILABLE_LOCALES = Object.keys(_twosky_namespaceObject["0"].eo).sort();
/**
 * Schema that validates a raw string as a known locale or `'auto'`.
 * Falls back to {@link LANGUAGE_AUTO} for unrecognized values.
 */ const localePreferenceSchema = fallback(picklist([
    LANGUAGE_AUTO,
    ...AVAILABLE_LOCALES
]), LANGUAGE_AUTO);
/**
 * Validates a raw string from storage and returns a safe {@link LocalePreference}.
 * Returns {@link LANGUAGE_AUTO} if the value is not a known locale.
 *
 * @param value Raw string read from persistent storage.
 * @returns A valid {@link LocalePreference}.
 */ function toLocalePreference(value) {
    return v.parse(localePreferenceSchema, value);
}
/**
 * Maps each supported locale code to its native language name.
 * Used for displaying the language selector dropdown.
 */ const LANGUAGE_NAMES = (/* unused pure expression or super */ null && ({
    ar: 'العربية',
    be: 'Беларуская',
    bg: 'Български',
    ca: 'Català',
    cs: 'Čeština',
    da: 'Dansk',
    de: 'Deutsch',
    el: 'Ελληνικά',
    en: 'English',
    es: 'Español',
    fa: 'فارسی',
    fi: 'Suomi',
    fr: 'Français',
    he: 'עברית',
    hr: 'Hrvatski',
    hu: 'Magyar',
    hy: 'Հայերեն',
    id: 'Bahasa Indonesia',
    it: 'Italiano',
    ja: '日本語',
    ko: '한국어',
    lt: 'Lietuvių',
    mk: 'Македонски',
    ms: 'Bahasa Melayu',
    nb: 'Norsk bokmål',
    nl: 'Nederlands',
    pl: 'Polski',
    pt_BR: 'Português (Brasil)',
    pt_PT: 'Português (Portugal)',
    ro: 'Română',
    ru: 'Русский',
    sk: 'Slovenčina',
    sl: 'Slovenščina',
    sr: 'Српски',
    sv: 'Svenska',
    tr: 'Türkçe',
    uk: 'Українська',
    vi: 'Tiếng Việt',
    zh_CN: '简体中文',
    zh_TW: '繁體中文'
}));

;// CONCATENATED MODULE: ./src/common/locale/checkLocale.ts
/**
 * Matches a browser locale code to one of the supported locales.
 *
 * Resolution order:
 * 1. Normalize input (lowercase, hyphens → underscores)
 * 2. Exact match against available locales
 * 3. First two segments match (for 3-part BCP 47 codes like zh-Hant-TW → zh_TW)
 * 4. Base language exact match (e.g., en-GB → en)
 * 5. Base language prefix match (e.g., zh → zh_CN)
 *
 * @param availableLocales List of supported locale codes (e.g., from AVAILABLE_LOCALES).
 * @param locale Browser locale code to resolve (e.g., 'en-US', 'zh-CN').
 *
 * @returns Result indicating whether a match was found and the resolved locale code.
 *
 * @example
 * checkLocale(['en', 'zh_CN'], 'zh-CN')  // { suitable: true, locale: 'zh_CN' }
 * checkLocale(['en', 'zh_CN'], 'en-GB')  // { suitable: true, locale: 'en' }
 * checkLocale(['en', 'zh_CN'], 'xyz')    // { suitable: false, locale: 'xyz' }
 */ function checkLocale(availableLocales, locale) {
    if (!locale) {
        return {
            suitable: false,
            locale: ''
        };
    }
    const normalized = locale.toLowerCase().replace(/-/g, '_');
    // Build a lowercase → original lookup map
    const lookupMap = availableLocales.reduce((map, available)=>{
        map.set(available.toLowerCase(), available);
        return map;
    }, new Map());
    // 1. Exact match
    const exactMatch = lookupMap.get(normalized);
    if (exactMatch) {
        return {
            suitable: true,
            locale: exactMatch
        };
    }
    const parts = normalized.split('_');
    // 2. For 3-part BCP 47 codes (e.g., zh_hant_tw):
    //    Try first+second (zh_hant), then first+last (zh_tw) to skip the script subtag
    if (parts.length >= 3) {
        const firstSecond = `${parts[0]}_${parts[1]}`;
        const firstSecondMatch = lookupMap.get(firstSecond);
        if (firstSecondMatch) {
            return {
                suitable: true,
                locale: firstSecondMatch
            };
        }
        const firstLast = `${parts[0]}_${parts[parts.length - 1]}`;
        const firstLastMatch = lookupMap.get(firstLast);
        if (firstLastMatch) {
            return {
                suitable: true,
                locale: firstLastMatch
            };
        }
    }
    // 3. Base language exact match (e.g., en_gb → en)
    const baseMatch = lookupMap.get(parts[0]);
    if (baseMatch) {
        return {
            suitable: true,
            locale: baseMatch
        };
    }
    // 4. Base language prefix match (e.g., zh → zh_CN)
    const prefix = `${parts[0]}_`;
    const prefixMatch = availableLocales.find((available)=>available.toLowerCase().startsWith(prefix));
    if (prefixMatch) {
        return {
            suitable: true,
            locale: prefixMatch
        };
    }
    // No match found
    return {
        suitable: false,
        locale: normalized
    };
}

;// CONCATENATED MODULE: ./src/common/locale/TranslationService.ts
function TranslationService_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
function TranslationService_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                TranslationService_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                TranslationService_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}



/**
 * Stateless translation utility that loads locale files on demand, caches them,
 * and provides synchronous message lookup with English fallback.
 *
 * Contains no MobX dependencies and holds no locale state — suitable for any
 * extension context including the background script.  Callers (I18n, TranslationStore)
 * own the active locale and pass it as a parameter to lookup methods.
 */ class TranslationService {
    /**
     * Flattens a raw MessagesJson object into a FlattenedMessages record.
     * Skips entries whose `.message` value is not a non-empty string.
     *
     * @param rawMessages Raw messages.json content.
     *
     * @returns Flattened key → message map.
     */ flattenMessages(rawMessages) {
        const result = {};
        const entries = Object.entries(rawMessages);
        for(let i = 0; i < entries.length; i += 1){
            const [key, entry] = entries[i];
            if (entry && typeof entry.message === 'string' && entry.message.length > 0) {
                result[key] = entry.message;
            }
        }
        return result;
    }
    /**
     * Resolves a user preference into a concrete supported locale code.
     *
     * When preference is 'auto', uses the browser's UI language.
     * Falls back to BASE_LOCALE when the locale is not supported.
     *
     * @param localePreference User locale preference ('auto' or a locale code).
     *
     * @returns Resolved locale code from AVAILABLE_LOCALES, or BASE_LOCALE.
     */ resolveLocale(localePreference) {
        const code = localePreference === LANGUAGE_AUTO ? browser_polyfill_default().i18n.getUILanguage() : localePreference;
        const result = checkLocale(AVAILABLE_LOCALES, code);
        return result.suitable ? result.locale : BASE_LOCALE;
    }
    /**
     * Loads a locale file from extension assets, flattens it, and caches the result.
     * No-op if the locale is already cached.
     *
     * @param locale Locale code matching a folder in `_locales/`.
     *
     * @throws On fetch or parse failure — callers handle fallback.
     */ loadLocale(locale) {
        return TranslationService_async_to_generator(function*() {
            if (this.localeCache.has(locale)) {
                return;
            }
            const url = browser_polyfill_default().runtime.getURL(`_locales/${locale}/messages.json`);
            const response = yield fetch(url);
            const raw = yield response.json();
            const flattened = this.flattenMessages(raw);
            this.localeCache.set(locale, flattened);
        }).call(this);
    }
    /**
     * Loads the English base locale and the locale resolved from `preference`,
     * using the cache when possible.
     *
     * This is the single entry-point callers use instead of the former
     * stateful `init()` / `setLocalePreference()` methods.  The caller is
     * responsible for storing the returned locale.
     *
     * @param preference Persisted preference ('auto' or a locale code).
     *                   Defaults to 'auto' if not provided.
     *
     * @returns The resolved {@link AvailableLocale} that was loaded.
     */ loadLocaleData(preference) {
        return TranslationService_async_to_generator(function*() {
            const pref = preference || LANGUAGE_AUTO;
            yield this.loadLocale(BASE_LOCALE);
            const resolved = this.resolveLocale(pref);
            if (resolved !== BASE_LOCALE) {
                yield this.loadLocale(resolved);
            }
            return resolved;
        }).call(this);
    }
    /**
     * Returns the translated message for the given key in the specified locale.
     *
     * Lookup order:
     * 1. Requested locale's flattened messages
     * 2. If missing → return '' so `@adguard/translate` handles fallback with correct plural forms
     * 3. If key does not exist in the English base → throw Error
     *
     * @param locale The locale to look up the message in.
     * @param key Translation message key.
     *
     * @returns Translated message, or empty string if untranslated in the requested locale.
     *
     * @throws If the key does not exist in the English base messages.
     */ getMessage(locale, key) {
        const baseMessages = this.localeCache.get(BASE_LOCALE);
        const baseMessage = baseMessages === null || baseMessages === void 0 ? void 0 : baseMessages[key];
        if (!baseMessage) {
            throw new Error(`There is no such key "${key}" in the messages`);
        }
        // When requested locale is the base locale, return the base message directly
        if (locale === BASE_LOCALE) {
            return baseMessage;
        }
        const currentMessages = this.localeCache.get(locale);
        const currentMessage = currentMessages === null || currentMessages === void 0 ? void 0 : currentMessages[key];
        // Missing or skipped entry in requested locale → return empty string
        // so @adguard/translate falls back to base message with correct plural forms
        if (!currentMessage) {
            return '';
        }
        return currentMessage;
    }
    /**
     * Returns the UI language code for `@adguard/translate`.
     *
     * @param locale The locale code to convert.
     *
     * @returns Lowercase locale code matching the `AvailableLocales` enum
     *          in `@adguard/translate` (e.g. 'de', 'pt_br', 'zh_cn').
     */ getUILanguage(locale) {
        return locale.toLowerCase();
    }
    /**
     * Returns the English base message for the given key.
     * Returns an empty string if the key is not found, which signals
     * to `@adguard/translate` that no base message is available
     * (safe for plural form parsing).
     *
     * @param key Translation message key.
     *
     * @returns English base message, or empty string if not found.
     */ getBaseMessage(key) {
        const baseMessages = this.localeCache.get(BASE_LOCALE);
        return (baseMessages === null || baseMessages === void 0 ? void 0 : baseMessages[key]) || '';
    }
    /**
     * Returns the base locale code.
     *
     * @returns The base locale code ('en').
     */ getBaseUILanguage() {
        return BASE_LOCALE;
    }
    constructor(){
        /**
     * In-memory cache of loaded and flattened locale data.
     * Maps locale code → FlattenedMessages.
     */ this.localeCache = new Map();
    }
}

;// CONCATENATED MODULE: ./src/common/i18n.ts
function i18n_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
function i18n_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                i18n_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                i18n_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}




/**
 * Internationalization facade with two operating modes:
 *
 * - **Standalone** (background, consent): holds a plain `currentLocale` field.
 *   `getMessage()` uses that field. No MobX in the import chain.
 * - **Store-connected** (popup, options): after {@link connectStore} is called,
 *   `getMessage()` reads `store.currentLocale` which is a MobX `@observable`,
 *   creating automatic dependency tracking for `observer` components.
 *
 * Each extension context (background, popup, options, consent) gets its own
 * instance of the underlying service.  Before {@link i18n.init} completes,
 * all methods fall back to `browser.i18n` (preserving current behaviour).
 */ class I18n {
    /**
     * Creates and connects a {@link LocaleStore} so that `getMessage()` and
     * `getUILanguage()` read the store's observable `currentLocale`,
     * creating MobX dependency tracking for `observer` components.
     *
     * Accepts a **constructor** rather than importing `TranslationStore`
     * directly, because `TranslationStore` depends on MobX.  A direct
     * import would pull MobX into the background script's bundle, where
     * it is not needed and not wanted.
     *
     * Call this once in each UI context's `RootStore` constructor.
     *
     * @param StoreClass A class whose constructor accepts a `TranslationService`.
     *
     * @returns The created store instance.
     */ connectStore(StoreClass) {
        const store = new StoreClass(this.translationService);
        this.store = store;
        return store;
    }
    /**
     * Initializes the translation service with a saved language preference.
     * Must be called during startup of each extension context.
     *
     * In store-connected mode, delegates to `store.init()` so that the
     * store’s observables are updated atomically.  In standalone mode,
     * loads locale data directly and sets the plain `currentLocale` field.
     *
     * @param savedPreference Persisted preference ('auto' or a locale code). Defaults to 'auto'.
     */ init(savedPreference) {
        return i18n_async_to_generator(function*() {
            if (this.store) {
                yield this.store.init(savedPreference);
            } else {
                try {
                    this.currentLocale = yield this.translationService.loadLocaleData(savedPreference);
                } catch (e) {
                    log.warn('[vpn.I18n.init]: Failed to initialize, falling back to English', e);
                    this.currentLocale = BASE_LOCALE;
                }
            }
            this.initialized = true;
        }).call(this);
    }
    /**
     * Changes the locale preference.
     *
     * In store-connected mode, delegates to `store.setLocalePreference()`.
     * In standalone mode, loads locale data directly and updates the plain field.
     *
     * @param preference 'auto' or a specific locale code (e.g. 'de').
     */ setLocalePreference(preference) {
        return i18n_async_to_generator(function*() {
            if (this.store) {
                yield this.store.setLocalePreference(preference);
            } else {
                try {
                    this.currentLocale = yield this.translationService.loadLocaleData(preference);
                } catch (e) {
                    log.warn('[vpn.I18n.setLocalePreference]: Failed to set locale, falling back to English', e);
                    this.currentLocale = BASE_LOCALE;
                }
            }
        }).call(this);
    }
    /**
     * Retrieves the localized message for the given key.
     *
     * When a store is connected, reads `store.currentLocale` which creates
     * a MobX dependency so that `observer` components re-render on locale change.
     * In standalone mode, reads the plain `currentLocale` field.
     *
     * Before {@link init} completes, falls back to `browser.i18n.getMessage()`.
     *
     * @param key The key corresponding to the message in the localization files.
     *
     * @returns The localized message, or an empty string if untranslated in the current locale.
     *
     * @throws If the key does not exist in the English base messages (after init).
     */ getMessage(key) {
        // Read locale first - when a store is connected this creates a MobX
        // dependency so the calling observer re-renders on locale change.
        const locale = this.store ? this.store.currentLocale : this.currentLocale;
        if (!this.initialized) {
            return browser_polyfill_default().i18n.getMessage(key);
        }
        return this.translationService.getMessage(locale, key);
    }
    /**
     * Returns the UI language code for `@adguard/translate`.
     *
     * When a store is connected, reads `store.currentLocale` for MobX tracking.
     * Before {@link init} completes, falls back to `browser.i18n.getUILanguage()`.
     *
     * @returns Lowercase locale code matching the `AvailableLocales` enum
     *          in `@adguard/translate` (e.g. 'de', 'pt_br', 'zh_cn').
     */ getUILanguage() {
        const locale = this.store ? this.store.currentLocale : this.currentLocale;
        if (!this.initialized) {
            return browser_polyfill_default().i18n.getUILanguage().toLowerCase().replace('-', '_');
        }
        return this.translationService.getUILanguage(locale);
    }
    /**
     * Retrieves the base (English) message for the given key.
     *
     * Before {@link init} completes, falls back to `browser.i18n.getMessage()`.
     * After init, delegates to {@link TranslationService.getBaseMessage}.
     *
     * @param key The key corresponding to the message in the base messages.
     *
     * @returns The English base message, or empty string if not found.
     */ getBaseMessage(key) {
        if (!this.initialized) {
            // In tests, browser.i18n is mocked and returns empty strings.
            // Return the raw key so @adguard/translate has a fallback message
            // for top-level translator.getMessage() calls (e.g. dnsConstants.ts).
            if (false) {}
            return browser_polyfill_default().i18n.getMessage(key);
        }
        return this.translationService.getBaseMessage(key);
    }
    /**
     * Retrieves the base UI language code for `@adguard/translate`.
     *
     * @returns The base UI language code ('en').
     */ getBaseUILanguage() {
        return BASE_LOCALE;
    }
    /**
     * Returns the internal {@link TranslationService} instance.
     *
     * Intended for tests that need direct access to the stateless service.
     *
     * @returns The per-context TranslationService instance.
     */ getTranslationService() {
        return this.translationService;
    }
    constructor(){
        /**
     * Per-context TranslationService instance (stateless cache + lookup).
     */ this.translationService = new TranslationService();
        /**
     * Whether {@link init} has completed successfully.
     * Before this flag is set, all methods fall back to `browser.i18n`.
     */ this.initialized = false;
        /**
     * Connected locale store (UI contexts only).
     * When set, `getMessage()` / `getUILanguage()` read `store.currentLocale`
     * instead of the plain {@link currentLocale} field.
     */ this.store = null;
        /**
     * Active locale in standalone mode (background, consent).
     * Ignored when a store is connected.
     */ this.currentLocale = BASE_LOCALE;
    }
}
const i18n_i18n = new I18n();

;// CONCATENATED MODULE: ./src/common/translator.ts


/**
 * Retrieves localised message by key, formats it and converts into string
 */ const translator = translate.createTranslator(i18n_i18n);

;// CONCATENATED MODULE: ./src/background/authentication/authCacheTypes.ts
/**
 * IMPORTANT:
 * Do not import inside this file other dependencies,
 * because imports of this file are also used in the popup
 * and redundant code from background may get into popup code
 */ /**
 * Enum for Auth cache keys.
 */ var authCacheTypes_AuthCacheKey = /*#__PURE__*/ function(AuthCacheKey) {
    AuthCacheKey["PolicyAgreement"] = "policyAgreement";
    AuthCacheKey["HelpUsImprove"] = "helpUsImprove";
    AuthCacheKey["WebAuthFlowState"] = "webAuthFlowState";
    return AuthCacheKey;
}({});

;// CONCATENATED MODULE: ./src/background/auth/webAuthEnums.ts
/**
 * IMPORTANT:
 * Do not import inside this file other dependencies,
 * because imports of this file are also used in the popup
 * and redundant code from background may get into popup code
 */ /**
 * Enum which represents current web authentication state.
 */ var webAuthEnums_WebAuthState = /*#__PURE__*/ function(WebAuthState) {
    /**
     * Idle state - waiting for user to start the web authentication flow.
     *
     * In this state web authentication screen will not be shown.
     */ WebAuthState["Idle"] = "idle";
    /**
     * Loading state - web authentication flow is started and in progress.
     *
     * In this state web authentication screen will be shown **with loader**.
     */ WebAuthState["Loading"] = "loading";
    /**
     * Failed state - web authentication flow is started but failed to complete.
     *
     * In this state web authentication screen will be shown **with error modal**.
     */ WebAuthState["Failed"] = "failed";
    /**
     * FailedByUser state - web authentication flow is failed
     * because user closed or moved away from the web authentication tab.
     *
     * In this state web authentication screen will be shown **with error modal** but without support link.
     */ WebAuthState["FailedByUser"] = "failedByUser";
    /**
     * Opened state - web authentication flow is started but nothing is happening currently,
     * and waiting for user to either reopen the flow or cancel it.
     *
     * In this state web authentication screen will be shown **without loader and error modal**.
     */ WebAuthState["Opened"] = "opened";
    return WebAuthState;
}({});
/**
 * Enum which represents web authentication actions.
 */ var webAuthEnums_WebAuthAction = /*#__PURE__*/ function(WebAuthAction) {
    /**
     * Start the web authentication flow.
     */ WebAuthAction["Start"] = "start";
    /**
     * Reopen the web authentication flow.
     */ WebAuthAction["Reopen"] = "reopen";
    /**
     * Cancel the web authentication flow.
     */ WebAuthAction["Cancel"] = "cancel";
    /**
     * Dismiss the error modal shown when the web authentication flow fails.
     */ WebAuthAction["DismissFailure"] = "dismissFailure";
    /**
     * Emitted when the web authentication flow fails.
     */ WebAuthAction["Fail"] = "fail";
    /**
     * Emitted when the web authentication tab is closed or moved away.
     */ WebAuthAction["TabModified"] = "tabModified";
    /**
     * Emitted when the web authentication flow succeeds.
     */ WebAuthAction["Succeed"] = "succeed";
    return WebAuthAction;
}({});

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
 */ const FORWARDER_URL_QUERIES = {
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
};


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
let index_browser_nanoid = (size = 21) =>
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
            const portId = `popup_${index_browser_nanoid()}`;
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

;// CONCATENATED MODULE: ./src/common/reactTranslator.ts



/**
 * Retrieves localized messages by key, formats and converts into react components or string
 */ const reactTranslator = translate.createReactTranslator(i18n_i18n, node_modules_react);

;// CONCATENATED MODULE: ./node_modules/.pnpm/punycode@2.3.1/node_modules/punycode/punycode.es6.js


/** Highest positive signed 32-bit float value */
const maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */
const punycode_es6_base = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128; // 0x80
const delimiter = '-'; // '\x2D'

/** Regular expressions */
const regexPunycode = /^xn--/;
const regexNonASCII = /[^\0-\x7F]/; // Note: U+007F DEL is excluded too.
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

/** Error messages */
const errors = (/* unused pure expression or super */ null && ({
	'overflow': 'Overflow: input needs wider integers to process',
	'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
	'invalid-input': 'Invalid input'
}));

/** Convenience shortcuts */
const baseMinusTMin = (/* unused pure expression or super */ null && (punycode_es6_base - tMin));
const floor = (/* unused pure expression or super */ null && (Math.floor));
const stringFromCharCode = String.fromCharCode;

/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function punycode_es6_error(type) {
	throw new RangeError(errors[type]);
}

/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */
function punycode_es6_map(array, callback) {
	const result = [];
	let length = array.length;
	while (length--) {
		result[length] = callback(array[length]);
	}
	return result;
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {String} A new string of characters returned by the callback
 * function.
 */
function mapDomain(domain, callback) {
	const parts = domain.split('@');
	let result = '';
	if (parts.length > 1) {
		// In email addresses, only the domain name should be punycoded. Leave
		// the local part (i.e. everything up to `@`) intact.
		result = parts[0] + '@';
		domain = parts[1];
	}
	// Avoid `split(regex)` for IE8 compatibility. See #17.
	domain = domain.replace(regexSeparators, '\x2E');
	const labels = domain.split('.');
	const encoded = punycode_es6_map(labels, callback).join('.');
	return result + encoded;
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(string) {
	const output = [];
	let counter = 0;
	const length = string.length;
	while (counter < length) {
		const value = string.charCodeAt(counter++);
		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
			// It's a high surrogate, and there is a next character.
			const extra = string.charCodeAt(counter++);
			if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
			} else {
				// It's an unmatched surrogate; only append this code unit, in case the
				// next code unit is the high surrogate of a surrogate pair.
				output.push(value);
				counter--;
			}
		} else {
			output.push(value);
		}
	}
	return output;
}

/**
 * Creates a string based on an array of numeric code points.
 * @see `punycode.ucs2.decode`
 * @memberOf punycode.ucs2
 * @name encode
 * @param {Array} codePoints The array of numeric code points.
 * @returns {String} The new Unicode string (UCS-2).
 */
const ucs2encode = codePoints => String.fromCodePoint(...codePoints);

/**
 * Converts a basic code point into a digit/integer.
 * @see `digitToBasic()`
 * @private
 * @param {Number} codePoint The basic numeric code point value.
 * @returns {Number} The numeric value of a basic code point (for use in
 * representing integers) in the range `0` to `base - 1`, or `base` if
 * the code point does not represent a value.
 */
const basicToDigit = function(codePoint) {
	if (codePoint >= 0x30 && codePoint < 0x3A) {
		return 26 + (codePoint - 0x30);
	}
	if (codePoint >= 0x41 && codePoint < 0x5B) {
		return codePoint - 0x41;
	}
	if (codePoint >= 0x61 && codePoint < 0x7B) {
		return codePoint - 0x61;
	}
	return punycode_es6_base;
};

/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
const digitToBasic = function(digit, flag) {
	//  0..25 map to ASCII a..z or A..Z
	// 26..35 map to ASCII 0..9
	return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
const adapt = function(delta, numPoints, firstTime) {
	let k = 0;
	delta = firstTime ? floor(delta / damp) : delta >> 1;
	delta += floor(delta / numPoints);
	for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += punycode_es6_base) {
		delta = floor(delta / baseMinusTMin);
	}
	return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
 * symbols.
 * @memberOf punycode
 * @param {String} input The Punycode string of ASCII-only symbols.
 * @returns {String} The resulting string of Unicode symbols.
 */
const decode = function(input) {
	// Don't use UCS-2.
	const output = [];
	const inputLength = input.length;
	let i = 0;
	let n = initialN;
	let bias = initialBias;

	// Handle the basic code points: let `basic` be the number of input code
	// points before the last delimiter, or `0` if there is none, then copy
	// the first basic code points to the output.

	let basic = input.lastIndexOf(delimiter);
	if (basic < 0) {
		basic = 0;
	}

	for (let j = 0; j < basic; ++j) {
		// if it's not a basic code point
		if (input.charCodeAt(j) >= 0x80) {
			punycode_es6_error('not-basic');
		}
		output.push(input.charCodeAt(j));
	}

	// Main decoding loop: start just after the last delimiter if any basic code
	// points were copied; start at the beginning otherwise.

	for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

		// `index` is the index of the next character to be consumed.
		// Decode a generalized variable-length integer into `delta`,
		// which gets added to `i`. The overflow checking is easier
		// if we increase `i` as we go, then subtract off its starting
		// value at the end to obtain `delta`.
		const oldi = i;
		for (let w = 1, k = punycode_es6_base; /* no condition */; k += punycode_es6_base) {

			if (index >= inputLength) {
				punycode_es6_error('invalid-input');
			}

			const digit = basicToDigit(input.charCodeAt(index++));

			if (digit >= punycode_es6_base) {
				punycode_es6_error('invalid-input');
			}
			if (digit > floor((maxInt - i) / w)) {
				punycode_es6_error('overflow');
			}

			i += digit * w;
			const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

			if (digit < t) {
				break;
			}

			const baseMinusT = punycode_es6_base - t;
			if (w > floor(maxInt / baseMinusT)) {
				punycode_es6_error('overflow');
			}

			w *= baseMinusT;

		}

		const out = output.length + 1;
		bias = adapt(i - oldi, out, oldi == 0);

		// `i` was supposed to wrap around from `out` to `0`,
		// incrementing `n` each time, so we'll fix that now:
		if (floor(i / out) > maxInt - n) {
			punycode_es6_error('overflow');
		}

		n += floor(i / out);
		i %= out;

		// Insert `n` at position `i` of the output.
		output.splice(i++, 0, n);

	}

	return String.fromCodePoint(...output);
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
const encode = function(input) {
	const output = [];

	// Convert the input in UCS-2 to an array of Unicode code points.
	input = ucs2decode(input);

	// Cache the length.
	const inputLength = input.length;

	// Initialize the state.
	let n = initialN;
	let delta = 0;
	let bias = initialBias;

	// Handle the basic code points.
	for (const currentValue of input) {
		if (currentValue < 0x80) {
			output.push(stringFromCharCode(currentValue));
		}
	}

	const basicLength = output.length;
	let handledCPCount = basicLength;

	// `handledCPCount` is the number of code points that have been handled;
	// `basicLength` is the number of basic code points.

	// Finish the basic string with a delimiter unless it's empty.
	if (basicLength) {
		output.push(delimiter);
	}

	// Main encoding loop:
	while (handledCPCount < inputLength) {

		// All non-basic code points < n have been handled already. Find the next
		// larger one:
		let m = maxInt;
		for (const currentValue of input) {
			if (currentValue >= n && currentValue < m) {
				m = currentValue;
			}
		}

		// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
		// but guard against overflow.
		const handledCPCountPlusOne = handledCPCount + 1;
		if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
			punycode_es6_error('overflow');
		}

		delta += (m - n) * handledCPCountPlusOne;
		n = m;

		for (const currentValue of input) {
			if (currentValue < n && ++delta > maxInt) {
				punycode_es6_error('overflow');
			}
			if (currentValue === n) {
				// Represent delta as a generalized variable-length integer.
				let q = delta;
				for (let k = punycode_es6_base; /* no condition */; k += punycode_es6_base) {
					const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
					if (q < t) {
						break;
					}
					const qMinusT = q - t;
					const baseMinusT = punycode_es6_base - t;
					output.push(
						stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
					);
					q = floor(qMinusT / baseMinusT);
				}

				output.push(stringFromCharCode(digitToBasic(q, 0)));
				bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
				delta = 0;
				++handledCPCount;
			}
		}

		++delta;
		++n;

	}
	return output.join('');
};

/**
 * Converts a Punycode string representing a domain name or an email address
 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
 * it doesn't matter if you call it on a string that has already been
 * converted to Unicode.
 * @memberOf punycode
 * @param {String} input The Punycoded domain name or email address to
 * convert to Unicode.
 * @returns {String} The Unicode representation of the given Punycode
 * string.
 */
const toUnicode = function(input) {
	return mapDomain(input, function(string) {
		return regexPunycode.test(string)
			? decode(string.slice(4).toLowerCase())
			: string;
	});
};

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
const toASCII = function(input) {
	return mapDomain(input, function(string) {
		return regexNonASCII.test(string)
			? 'xn--' + encode(string)
			: string;
	});
};

/*--------------------------------------------------------------------------*/

/** Define the public API */
const punycode_es6_punycode = (/* unused pure expression or super */ null && ({
	/**
	 * A string representing the current Punycode.js version number.
	 * @memberOf punycode
	 * @type String
	 */
	'version': '2.3.1',
	/**
	 * An object of methods to convert from JavaScript's internal character
	 * representation (UCS-2) to Unicode code points, and back.
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode
	 * @type Object
	 */
	'ucs2': {
		'decode': ucs2decode,
		'encode': ucs2encode
	},
	'decode': decode,
	'encode': encode,
	'toASCII': toASCII,
	'toUnicode': toUnicode
}));


/* export default */ const punycode_es6 = ((/* unused pure expression or super */ null && (punycode_es6_punycode)));

;// CONCATENATED MODULE: ./src/common/helpers.ts
function helpers_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
function helpers_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                helpers_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                helpers_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

/**
 * Returns the value of the property from the cache,
 * otherwise, calculates it using the callback, memoizes it, and returns the value.
 *
 * @param obj Object to store the property.
 * @param prop Property name.
 * @param getter Callback to get the value.
 *
 * @returns Property value.
 */ const lazyGet = (obj, prop, func)=>{
    const cachedProp = `_${prop}`;
    if (cachedProp in obj) {
        return obj[cachedProp];
    }
    const value = func.apply(obj);
    // eslint-disable-next-line no-param-reassign
    obj[cachedProp] = value;
    return value;
};
// TODO: looks like not used, consider removing
/**
 * Normalizes exclusions url
 * 1. trims it
 * 2. converts to lowercase
 * 3. removes `https://www.` and `/` at the end of the line
 * 4. converts to ASCII
 * save hostnames as ASCII because 'pacScript.url' supports only ASCII URLs
 * https://chromium.googlesource.com/chromium/src/+/3a46e0bf9308a42642689c4b73b6b8622aeecbe5/chrome/browser/extensions/api/proxy/proxy_api_helpers.cc#115
 * @param rawUrl
 *
 * @returns Prepared URL.
 */ const prepareUrl = (rawUrl)=>{
    var _rawUrl_trim_toLowerCase_replace, _rawUrl_trim_toLowerCase, _rawUrl_trim;
    const url = rawUrl === null || rawUrl === void 0 ? void 0 : (_rawUrl_trim = rawUrl.trim()) === null || _rawUrl_trim === void 0 ? void 0 : (_rawUrl_trim_toLowerCase = _rawUrl_trim.toLowerCase()) === null || _rawUrl_trim_toLowerCase === void 0 ? void 0 : (_rawUrl_trim_toLowerCase_replace = _rawUrl_trim_toLowerCase.replace(/(http(s)?:\/\/)?(www\.)?/, '')) === null || _rawUrl_trim_toLowerCase_replace === void 0 ? void 0 : _rawUrl_trim_toLowerCase_replace.replace(/\/$/, '');
    return punycode.toASCII(url);
};
/**
 * Selects location with the lowest ping taking in consideration pingBonus
 * pingBonus is an number which comes from backend and it is used to
 * adjust default location selection.
 *
 * @returns Location with the lowest ping.
 */ const getLocationWithLowestPing = (locations)=>{
    // filter locations by ping,
    // so array of filtered locations will be LocationInterfaceWithPing[] instead of LocationInterface[]
    // @ts-ignore
    const locationsWithPings = locations.filter((location)=>location.ping && location.ping > 0);
    const sortedByPing = locationsWithPings.sort((locationA, locationB)=>{
        const adjustedPingA = locationA.ping - locationA.pingBonus;
        const adjustedPingB = locationB.ping - locationB.pingBonus;
        return adjustedPingA - adjustedPingB;
    });
    return sortedByPing[0];
};
/**
 * Formats bytes into units.
 *
 * @param bytes
 * @param decimals - number of digits after decimal point
 *
 * @returns Object with unit and value.
 */ const formatBytes = (bytes, decimals = 1)=>{
    if (!bytes || bytes <= 0) {
        return {
            value: '0.0',
            unit: 'KB'
        };
    }
    const UNITS = [
        'Bytes',
        'KB',
        'MB',
        'GB',
        'TB'
    ];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k)) || 1;
    return {
        value: parseFloat(String(bytes / Math.pow(k, i))).toFixed(decimals),
        unit: UNITS[i]
    };
};
/**
 * Sleeps given period of time.
 *
 * @param wait
 *
 * @returns Promise that resolves after given period of time.
 */ const sleep = (wait)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve, wait);
    });
};
/**
 * Sleeps necessary period of time if minimum duration didn't pass since entry time
 * @param entryTimeMs
 * @param minDurationMs
 */ const sleepIfNecessary = (entryTimeMs, minDurationMs)=>helpers_async_to_generator(function*() {
        if (Date.now() - entryTimeMs < minDurationMs) {
            yield sleep(minDurationMs - (Date.now() - entryTimeMs));
        }
    })();
/**
 * Executes async function with at least required time.
 *
 * @param fn
 * @param minDurationMs
 *
 * @returns Async function that executes with at least required time.
 */ const addMinDurationTime = (fn, minDurationMs)=>{
    return (...args)=>helpers_async_to_generator(function*() {
            const start = Date.now();
            try {
                const response = yield fn(...args);
                yield sleepIfNecessary(start, minDurationMs);
                return response;
            } catch (e) {
                yield sleepIfNecessary(start, minDurationMs);
                throw e;
            }
        })();
};
/**
 * Runs generator with possibility to cancel
 *
 * @param fn - generator to run
 * @param args - args
 *
 * @returns Object with cancel function and promise.
 */ const runWithCancel = (fn, ...args)=>{
    const gen = fn(...args);
    let cancelled;
    let cancel;
    const promise = new Promise((resolve, reject)=>{
        // define cancel function to return it from our fn
        cancel = (reason)=>{
            cancelled = true;
            reject(new Error(reason));
        };
        // eslint-disable-next-line consistent-return
        function onFulfilled(res) {
            if (!cancelled) {
                let result;
                try {
                    result = gen.next(res);
                } catch (e) {
                    return reject(e);
                }
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                next(result);
            }
        }
        // eslint-disable-next-line consistent-return
        function onRejected(err) {
            let result;
            try {
                result = gen.throw(err);
            } catch (e) {
                return reject(e);
            }
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            next(result);
        }
        function next({ done, value }) {
            if (done) {
                return resolve(value);
            }
            // we assume we always receive promises, so no type checks
            return value.then(onFulfilled, onRejected);
        }
        onFulfilled();
    });
    return {
        promise,
        cancel
    };
};
/**
 * Generates forwarder URL with the given query.
 *
 * @param forwarderDomain Forwarder domain.
 * @param query Query string with parameters.
 *
 * @returns URL with the forwarder domain and query.
 */ const getForwarderUrl = (forwarderDomain, query)=>{
    return `https://${forwarderDomain}/forward.html?${query}`;
};

// EXTERNAL MODULE: ./node_modules/.pnpm/ua-parser-js@1.0.40/node_modules/ua-parser-js/src/ua-parser.js
var ua_parser = __webpack_require__(4125);
var ua_parser_default = /*#__PURE__*/__webpack_require__.n(ua_parser);
;// CONCATENATED MODULE: ./src/common/prefs.ts
function prefs_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
function prefs_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                prefs_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                prefs_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}



/**
 * Browser name enum.
 */ var prefs_BrowserName = /*#__PURE__*/ (/* unused pure expression or super */ null && (function(BrowserName) {
    BrowserName["Chrome"] = "Chrome";
    BrowserName["Firefox"] = "Firefox";
    BrowserName["Opera"] = "Opera";
    BrowserName["Edge"] = "Edge";
    BrowserName["EdgeChromium"] = "EdgeChromium";
    BrowserName["YaBrowser"] = "YaBrowser";
    BrowserName["Oculus"] = "Oculus";
    return BrowserName;
}({})));
/**
 * System name enum.
 */ var prefs_SystemName = /*#__PURE__*/ (/* unused pure expression or super */ null && (function(SystemName) {
    SystemName["MacOS"] = "mac";
    SystemName["iOS"] = "ios";
    SystemName["Windows"] = "win";
    SystemName["Android"] = "android";
    SystemName["ChromeOS"] = "cros";
    SystemName["Linux"] = "linux";
    SystemName["OpenBSD"] = "openbsd";
    SystemName["Fuchsia"] = "fuchsia";
    return SystemName;
}({})));
/**
 * Preferences class.
 *
 * Utility class for getting icon urls, platform info, device runtime.
 */ class Preferences {
    /**
     * Clears the cache.
     *
     * NOTE: This method is used for testing purposes.
     */ static clearCache() {
        Preferences.cache = {};
    }
    /**
     * Icon variants getter.
     */ get ICONS() {
        return lazyGet(Preferences.cache, 'ICONS', ()=>({
                ENABLED: {
                    19: getUrl(`${Preferences.ICONS_PATH}/enabled-19.png`),
                    38: getUrl(`${Preferences.ICONS_PATH}/enabled-38.png`),
                    128: getUrl(`${Preferences.ICONS_PATH}/enabled-128.png`)
                },
                DISABLED: {
                    19: getUrl(`${Preferences.ICONS_PATH}/disabled-19.png`),
                    38: getUrl(`${Preferences.ICONS_PATH}/disabled-38.png`),
                    128: getUrl(`${Preferences.ICONS_PATH}/disabled-128.png`)
                },
                TRAFFIC_OFF: {
                    19: getUrl(`${Preferences.ICONS_PATH}/traffic-off-19.png`),
                    38: getUrl(`${Preferences.ICONS_PATH}/traffic-off-38.png`),
                    128: getUrl(`${Preferences.ICONS_PATH}/traffic-off-128.png`)
                }
            }));
    }
    /* BROWSER RELATED PREFERENCES */ /**
     * Check if the current browser is as given one.
     *
     * @param browserName Browser Name.
     *
     * @returns True if current browser has specified name.
     */ static isTargetBrowser(browserName) {
        return Preferences.uaParser.getBrowser().name === browserName;
    }
    /**
     * Browser name getter.
     */ get browser() {
        return lazyGet(Preferences.cache, 'browser', ()=>{
            if (Preferences.isTargetBrowser('Oculus Browser')) {
                return "Oculus";
            }
            let browser;
            let { userAgent } = navigator;
            userAgent = userAgent.toLowerCase();
            if (userAgent.indexOf('yabrowser') >= 0) {
                browser = "YaBrowser";
            } else if (userAgent.indexOf('edge') >= 0) {
                browser = "Edge";
            } else if (userAgent.indexOf('edg') >= 0) {
                browser = "EdgeChromium";
            } else if (userAgent.indexOf('opera') >= 0 || userAgent.indexOf('opr') >= 0) {
                browser = "Opera";
            } else if (userAgent.indexOf('firefox') >= 0) {
                browser = "Firefox";
            } else {
                browser = "Chrome";
            }
            return browser;
        });
    }
    /**
     * Browser version getter.
     *
     * @returns Browser version string.
     */ getBrowserVersion() {
        return Preferences.uaParser.getBrowser().version || 'unknown';
    }
    /**
     * Checks whether the current browser is Firefox.
     *
     * @returns True if the current browser is Firefox, false otherwise.
     */ isFirefox() {
        return this.browser === "Firefox";
    }
    /**
     * Checks whether the current browser is Edge.
     *
     * @returns True if the current browser is Edge, false otherwise.
     */ isEdge() {
        return this.browser === "Edge" || this.browser === "EdgeChromium";
    }
    /**
     * Checks whether the current browser is Oculus.
     *
     * @returns True if the current browser is Oculus, false otherwise.
     */ isOculus() {
        return this.browser === "Oculus";
    }
    /* PLATFORM RELATED PREFERENCES */ /**
     * UA parser instance getter.
     */ static get uaParser() {
        return lazyGet(Preferences.cache, 'uaParser', ()=>new (ua_parser_default())(navigator.userAgent));
    }
    /**
     * Platform info promise getter.
     */ static get platformInfoPromise() {
        return lazyGet(Preferences.cache, 'platformInfoPromise', ()=>prefs_async_to_generator(function*() {
                const { os, arch } = yield runtime.getPlatformInfo();
                return {
                    // Runtime.PlatformInfo.os and SystemName is interchangeable
                    os: os,
                    arch
                };
            })());
    }
    /**
     * Returns the platform info (os, arch).
     *
     * Uses native {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/getPlatformInfo | runtime.getPlatformInfo()}.
     *
     * @returns Promise that will be fulfilled with platform info.
     */ getPlatformInfo() {
        return prefs_async_to_generator(function*() {
            return Preferences.platformInfoPromise;
        })();
    }
    /**
     * Get OS name.
     *
     * @returns OS name.
     */ getOS() {
        return prefs_async_to_generator(function*() {
            const platformInfo = yield this.getPlatformInfo();
            return platformInfo.os;
        }).call(this);
    }
    /**
     * Checks whether the current OS is Windows.
     *
     * @returns Promise that will be fulfilled with `true` if the current OS is Windows, `false` otherwise.
     */ isWindows() {
        return prefs_async_to_generator(function*() {
            const os = yield this.getOS();
            return os === "win";
        }).call(this);
    }
    /**
     * Checks whether the current OS is MacOS.
     *
     * @returns Promise that will be fulfilled with `true` if the current OS is MacOS, `false` otherwise.
     */ isMacOS() {
        return prefs_async_to_generator(function*() {
            const os = yield this.getOS();
            return os === "mac";
        }).call(this);
    }
    /**
     * Checks whether the current OS is Android.
     *
     * @returns Promise that will be fulfilled with `true` if the current OS is Android, `false` otherwise.
     */ isAndroid() {
        return prefs_async_to_generator(function*() {
            const os = yield this.getOS();
            return os === "android";
        }).call(this);
    }
    /**
     * Checks whether the current OS is Linux.
     *
     * @returns Promise that will be fulfilled with `true` if the current OS is Linux, `false` otherwise.
     */ isLinux() {
        return prefs_async_to_generator(function*() {
            const os = yield this.getOS();
            return os === "linux";
        }).call(this);
    }
    /**
     * Cached promise for Firefox Android check.
     */ get isFirefoxAndroidPromise() {
        return lazyGet(Preferences.cache, 'isFirefoxAndroidPromise', ()=>prefs_async_to_generator(function*() {
                const isFirefox = this.isFirefox();
                const isAndroid = yield this.isAndroid();
                return isFirefox && isAndroid;
            }).call(this));
    }
    /**
     * Checks whether the extension is running on Firefox Android.
     * This check is cached for performance.
     *
     * @returns Promise that will be fulfilled with `true` if running on Firefox Android, `false` otherwise.
     */ isFirefoxAndroid() {
        return prefs_async_to_generator(function*() {
            return this.isFirefoxAndroidPromise;
        }).call(this);
    }
    /**
     * Platform version promise getter.
     */ static get platformVersionPromise() {
        return lazyGet(Preferences.cache, 'platformVersionPromise', ()=>prefs_async_to_generator(function*() {
                let { version } = Preferences.uaParser.getOS();
                if (typeof version === 'undefined') {
                    return version;
                }
                // use static promise to not depend on this.isMacOS() and this.isWindows()
                const { os } = yield Preferences.platformInfoPromise;
                if (os === "win" && version === Preferences.WINDOWS_10_OS_VERSION) {
                    // windows 11 is parsed as windows 10 from user agent
                    version = yield Preferences.getActualWindowsVersion(version);
                } else if (os === "mac") {
                    // mac os version can be parsed from user agent as 10.15.7
                    // so it also might be more specific version like 13.5.2
                    version = yield Preferences.getActualMacosVersion(version);
                }
                return version;
            })());
    }
    /**
     * Returns the platform version.
     *
     * Detects version from `navigator.userAgent` and `navigator.userAgentData.getHighEntropyValues()`.
     *
     * @returns Promise that will be fulfilled with platform version if possible to detect, undefined otherwise.
     */ getPlatformVersion() {
        return prefs_async_to_generator(function*() {
            return Preferences.platformVersionPromise;
        })();
    }
    /**
     * Returns current platform version.
     * Uses NavigatorUAData.getHighEntropyValues() to get platform version.
     *
     * @returns Actual platform version as string if possible to detect, undefined otherwise.
     */ static getEntropyPlatformVersion() {
        return prefs_async_to_generator(function*() {
            try {
                var _navigator_userAgentData;
                const ua = yield (_navigator_userAgentData = navigator.userAgentData) === null || _navigator_userAgentData === void 0 ? void 0 : _navigator_userAgentData.getHighEntropyValues([
                    Preferences.PLATFORM_VERSION_ENTROPY
                ]);
                if (ua) {
                    return ua[Preferences.PLATFORM_VERSION_ENTROPY];
                }
            } catch (e) {
            // do nothing
            }
            return undefined;
        })();
    }
    /**
     * Returns actual Windows version if it is parsed from user agent as Windows 10.
     *
     * @see {@link https://learn.microsoft.com/en-us/microsoft-edge/web-platform/how-to-detect-win11#sample-code-for-detecting-windows-11}.
     *
     * @returns Actual Windows version.
     */ static getActualWindowsVersion(version) {
        return prefs_async_to_generator(function*() {
            let actualVersion = version;
            const entropyPlatformVersion = yield Preferences.getEntropyPlatformVersion();
            if (typeof entropyPlatformVersion === 'undefined') {
                return actualVersion;
            }
            const rawMajorPlatformVersion = entropyPlatformVersion.split('.')[0];
            const majorPlatformVersion = rawMajorPlatformVersion && parseInt(rawMajorPlatformVersion, 10);
            if (!majorPlatformVersion || Number.isNaN(majorPlatformVersion)) {
                return actualVersion;
            }
            if (majorPlatformVersion >= Preferences.MIN_WINDOWS_11_PLATFORM_VERSION) {
                actualVersion = Preferences.WINDOWS_11_OS_VERSION;
            }
            return actualVersion;
        })();
    }
    /**
     * Returns actual MacOS version if it is possible to detect, otherwise returns passed `version`.
     *
     * @param version MacOS version parsed from user agent.
     *
     * @returns Actual MacOS version.
     */ static getActualMacosVersion(version) {
        return prefs_async_to_generator(function*() {
            const entropyPlatformVersion = yield Preferences.getEntropyPlatformVersion();
            return entropyPlatformVersion || version;
        })();
    }
    /**
     * Device info getter.
     */ get device() {
        return lazyGet(Preferences.cache, 'device', ()=>Preferences.uaParser.getDevice());
    }
}
/**
     * Cache storage for lazy getters.
     */ Preferences.cache = {};
/* ICON RELATED PREFERENCES */ /**
     * Path to icons.
     */ Preferences.ICONS_PATH = 'assets/images/icons';
/**
     * Platform version query to `navigator.userAgentData.getHighEntropyValues()`.
     */ Preferences.PLATFORM_VERSION_ENTROPY = 'platformVersion';
/**
     * Windows 10 OS version.
     */ Preferences.WINDOWS_10_OS_VERSION = '10';
/**
     * Windows 11 OS version.
     */ Preferences.WINDOWS_11_OS_VERSION = '11';
/**
     * Windows 11 is specified as 13 and above in entropy version.
     */ Preferences.MIN_WINDOWS_11_PLATFORM_VERSION = 13;
const Prefs = new Preferences();

;// CONCATENATED MODULE: ./src/common/forwarderHelpers.ts



/**
 * Returns URLs for Privacy Policy and EULA based on the browser type.
 *
 * @param forwarderDomain Forwarder domain to use for generating URLs.
 *
 * @returns Privacy and EULA URLs.
 */ const getPrivacyAndEulaUrls = (forwarderDomain)=>{
    if (Prefs.isFirefox()) {
        return {
            privacyUrl: AMO_PRIVACY_URL,
            eulaUrl: AMO_EULA_URL
        };
    }
    return {
        privacyUrl: getForwarderUrl(forwarderDomain, FORWARDER_URL_QUERIES.PRIVACY),
        eulaUrl: getForwarderUrl(forwarderDomain, FORWARDER_URL_QUERIES.EULA)
    };
};

// EXTERNAL MODULE: ./node_modules/.pnpm/classnames@2.5.1/node_modules/classnames/index.js
var classnames = __webpack_require__(5119);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
;// CONCATENATED MODULE: ./src/common/components/Icons/Icon.tsx




function Icon({ name, color = 'current', size = '24', rotation = 'none', className }) {
    const classes = classnames_default()('icon', `icon--color-${color}`, `icon--size-${size}`, `icon--rotation-${rotation}`, className);
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("svg", {
        className: classes,
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("use", {
            xlinkHref: `#${name}`
        })
    });
}

;// CONCATENATED MODULE: ./src/common/components/Icons/IconButton.tsx





function IconButton({ name, size, rotation, className, type = 'button', color = 'gray', hoverColor = 'text-main', iconClassName, onClick }) {
    const classes = classnames_default()('icon-button has-tab-focus', `icon-button--hover-color-${hoverColor}`, className);
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
        // eslint-disable-next-line react/button-has-type
        type: type,
        className: classes,
        onClick: onClick,
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon, {
            name: name,
            color: color,
            size: size,
            rotation: rotation,
            className: iconClassName
        })
    });
}

;// CONCATENATED MODULE: ./src/common/components/Icons/Icons.tsx


const Icons = ()=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        className: "hidden",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "star",
                viewBox: "0 0 30 30",
                fill: "currentColor",
                fillRule: "evenodd",
                clipRule: "evenodd",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "m15 21-8.8 6.1 3-10.2-8.5-6.5 10.8-.3L15 0l3.5 10.1 10.8.3-8.6 6.5L23.8 27l-8.8-6Z"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "tick",
                viewBox: "0 0 24 24",
                fill: "none",
                fillRule: "evenodd",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "m5 12 6 6 8-9"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "plus",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M4 12H20"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M12 4L12 20"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "basket",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M7 9h10l-.76 10.08a1 1 0 0 1-1 .92H8.76a1 1 0 0 1-1-.92L7 9ZM6 6.5h12M14 6V4h-4v2M13.5 12v5-5Zm-3 0v5-5Z"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "edit",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M4 20.5h15.983M10.778 16.435l-4.242-4.243 7.07-7.07a3 3 0 0 1 4.243 0 3 3 0 0 1 0 4.242l-7.07 7.071ZM5.121 17.85l1.415-5.658 4.242 4.243-5.657 1.414ZM16.789 9.01 13.96 6.182"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "question",
                viewBox: "0 0 24 24",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("circle", {
                        cx: "12",
                        cy: "12",
                        r: "9.25",
                        stroke: "currentColor",
                        strokeWidth: "1.5"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M11.01 13.92c0-.63.08-1.13.23-1.5.15-.38.42-.74.83-1.1.4-.36.67-.66.8-.88s.2-.47.2-.72c0-.76-.35-1.13-1.04-1.13-.33 0-.6.1-.79.3-.2.2-.3.49-.3.85H9c0-.86.28-1.53.82-2.01A3.19 3.19 0 0 1 12.03 7c.94 0 1.67.23 2.2.69.51.46.77 1.1.77 1.94 0 .39-.08.74-.25 1.08-.17.34-.47.72-.89 1.13l-.54.52c-.34.32-.53.7-.58 1.15l-.02.4zm-.2 2.06c0-.3.1-.55.31-.74.2-.2.46-.3.78-.3s.57.1.77.3c.2.2.3.44.3.74s-.1.54-.3.73c-.19.2-.45.29-.77.29-.33 0-.59-.1-.79-.29a.98.98 0 0 1-.3-.73z",
                        fill: "currentColor"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "bug",
                viewBox: "0 0 24 24",
                fill: "none",
                fillRule: "evenodd",
                stroke: "currentColor",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "1.5",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M12 5a6 6 0 0 1 6 6v4a6 6 0 1 1-12 0v-4a6 6 0 0 1 6-6zm6 5h3m-6.25-5 1.5-2m-6.5 2-1.5-2M2.5 10h3M18 14h3M2.5 14h3m12 4H21M2.5 18h4m0-6.5h11"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "send-feedback",
                viewBox: "0 0 24 24",
                fill: "none",
                fillRule: "evenodd",
                stroke: "currentColor",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "1.5",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M13 12H7l-3 8 17-8L4 4l3 8z"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "checkbox-partly-enabled",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M21 3H3V21H21V3Z",
                        fillRule: "evenodd",
                        clipRule: "evenodd",
                        strokeWidth: "1.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("rect", {
                        x: "9.5",
                        y: "9.5",
                        width: "5",
                        height: "5",
                        strokeWidth: "5",
                        strokeLinejoin: "miter"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "checkmark",
                viewBox: "0 0 24 24",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("circle", {
                        cx: "12",
                        cy: "12",
                        r: "10.6",
                        fill: "currentColor"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M17.24 7.84c.37.32.4.87.09 1.23l-6.09 7a.87.87 0 0 1-1.3.03L6.7 12.68a.87.87 0 0 1 1.27-1.2l2.58 2.72 5.46-6.27a.88.88 0 0 1 1.23-.09Z",
                        fill: "white",
                        fillRule: "evenodd",
                        clipRule: "evenodd"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "external-link",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M18.5 11.83V6h-5.71M18.42 6.04l-6.79 6.93M9.27 7H8.5a2 2 0 0 0-2 2v7c0 1.1.9 2 2 2h7a2 2 0 0 0 2-2v-.7"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "pencil",
                viewBox: "0 0 16 16",
                fill: "none",
                fillRule: "evenodd",
                clipRule: "evenodd",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M7.19 10.96 4.36 8.13 9.07 3.4a2 2 0 0 1 2.83 2.83l-4.71 4.72Z"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "m3.41 11.9.95-3.77 2.83 2.83-3.78.94ZM11.2 6 9.3 4.13"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "globe",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M14.5 3.5c.27 1.17.5 2.33.65 3.5M19 7c-1.25.36-2.5.62-3.75.78a36.4 36.4 0 0 1 0 8.44c1.25.16 2.5.42 3.75.78M15.15 17a38.06 38.06 0 0 1-.65 3.5M9.5 20.5c-.27-1.17-.5-2.33-.65-3.5M5 17c1.25-.36 2.5-.62 3.75-.78a36.18 36.18 0 0 1 0-8.44C7.5 7.62 6.25 7.36 5 7M8.85 7c.16-1.17.38-2.33.65-3.5M9.5 16.13a24.61 24.61 0 0 1 5 0M14.5 7.87a24.61 24.61 0 0 1-5 0M3 12h18"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "spinner",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M6.29 5.04c.11-.1.23-.18.35-.27M8.56 3.68a8.93 8.93 0 0 1 1.24-.4M12 3a9 9 0 1 1-8.32 12.44"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "gift",
                viewBox: "0 0 24 24",
                width: "24",
                height: "24",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("rect", {
                        x: "5",
                        y: "10",
                        width: "14",
                        height: "11",
                        stroke: "#74A352",
                        strokeWidth: "1.5",
                        strokeLinejoin: "round",
                        fill: "none"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("rect", {
                        x: "-0.75",
                        y: "0.75",
                        width: "17.5",
                        height: "2.5",
                        transform: "matrix(1 0 0 -1 4 10.5)",
                        stroke: "#74A352",
                        strokeWidth: "1.5",
                        strokeLinejoin: "round",
                        fill: "none"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M12 6.14273C12.8741 4.55946 14.9219 1.62639 16.6002 3.73742C18.2784 5.84844 14.2726 6.31865 12 6.14273Z",
                        stroke: "#74A352",
                        strokeWidth: "1.5",
                        fill: "none"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M11.8911 6.65113C11.0361 4.94529 9.03282 1.78516 7.39111 4.05961C5.74941 6.33406 9.66797 6.84067 11.8911 6.65113Z",
                        stroke: "#74A352",
                        strokeWidth: "1.5",
                        fill: "none"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "bookmark-off",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M7 6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12.59a1 1 0 0 1-1.7.7l-2.6-2.58a1 1 0 0 0-1.4 0l-2.6 2.58a1 1 0 0 1-1.7-.7V6Z"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "bookmark-off-thin",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M7 6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12.59a1 1 0 0 1-1.7.7l-2.6-2.58a1 1 0 0 0-1.4 0l-2.6 2.58a1 1 0 0 1-1.7-.7V6Z"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "bookmark-on",
                viewBox: "0 0 24 24",
                fill: "currentColor",
                stroke: "currentColor",
                strokeWidth: "1.5",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M7 6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12.59a1 1 0 0 1-1.7.7l-2.6-2.58a1 1 0 0 0-1.4 0l-2.6 2.58a1 1 0 0 1-1.7-.7V6Z"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "play",
                width: "16",
                height: "16",
                viewBox: "0 0 16 16",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("rect", {
                        x: "2",
                        y: "2",
                        width: "12",
                        height: "12",
                        rx: "4",
                        stroke: "#74A352",
                        strokeWidth: "1.5"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        fillRule: "evenodd",
                        clipRule: "evenodd",
                        d: "M10.6665 7.99992L6.6665 10.6666L6.6665 5.33325L10.6665 7.99992Z",
                        stroke: "#74A352",
                        strokeWidth: "1.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "star-rounded",
                width: "32",
                height: "29",
                viewBox: "0 0 32 29",
                fillRule: "evenodd",
                clipRule: "evenodd",
                fill: "currentColor",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M16.1324 24L6.72787 28.9443L8.52398 18.4721L0.915527 11.0557L11.4302 9.52786L16.1324 0L20.8347 9.52786L31.3493 11.0557L23.7409 18.4721L25.537 28.9443L16.1324 24Z"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "back",
                viewBox: "0 0 24 24",
                fill: "none",
                fillRule: "evenodd",
                stroke: "currentColor",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "1.5",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("g", {
                    transform: "matrix(-1 0 0 1 19 5)",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("polyline", {
                            points: "3.5 3.167 10.5 -3.5 10.5 10.5",
                            transform: "rotate(90 7 3.5)"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("polyline", {
                            points: "3.5 10.167 10.5 3.5 10.5 17.5",
                            transform: "matrix(0 -1 -1 0 17.5 17.5)"
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "fire",
                width: "24",
                height: "24",
                fill: "none",
                clipRule: "evenodd",
                stroke: "#F5264E",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M15.032 4.603 14.628 3l-1.146 1.167c-1.3 1.323-2.1 2.604-2.535 4.008l-.017.056c-.332 1.095-.438 2.156-.444 3.813v.08l-.036-.014c-.792-.338-1.535-1.221-1.937-2.286l-.52-1.375-1.006 1.053c-1.806 1.887-2.423 4.241-1.677 6.564C6.233 18.937 9.032 21 12 21c3.86 0 7-3.209 7-7.157 0-1.057-.148-1.893-.462-2.647l-.023-.055c-.25-.584-.513-.993-1.114-1.797l-.23-.307a15.38 15.38 0 0 1-.664-.942c-.64-.993-1.115-2.066-1.475-3.492Z"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "reload",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M6 7.5c3.6-5.2 13.5-3.5 14 5V14M18 17.5c-3.6 5.2-13.5 3.5-14-5v-1"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "m22 12.5-2 2-2-2M2 12.5l2-2 2 2",
                        strokeLinejoin: "round"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("svg", {
                id: "warning",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("circle", {
                        id: "Oval",
                        cx: "9",
                        cy: "9",
                        r: "9",
                        transform: "matrix(1 0 0 -1 3 21)",
                        stroke: "#D58500",
                        strokeWidth: "1.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        id: "Line",
                        d: "M12 8V14",
                        stroke: "#D58500",
                        strokeWidth: "1.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        id: "Path 14 Copy",
                        d: "M11.997 16.4045C12.009 16.4025 11.997 16.5955 11.997 16.5955",
                        stroke: "#D58500",
                        strokeWidth: "1.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "bullets",
                viewBox: "0 0 24 24",
                fill: "currentColor",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M12 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM12 20a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "arrow-down",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M6 10L12 16L18 10"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "cross",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M6.43 6.43 17.6 17.6m-11.17-.03L17.6 6.4"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "checkbox-disabled",
                viewBox: "0 0 24 24",
                fill: "none",
                fillRule: "evenodd",
                clipRule: "evenodd",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M21 3H3V21H21V3Z"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "checkbox-enabled",
                viewBox: "0 0 24 24",
                fill: "currentColor",
                fillRule: "evenodd",
                clipRule: "evenodd",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    d: "M22 22V2H2v20h20ZM17.57 9.49a.75.75 0 1 0-1.14-.98l-5.48 6.38-3.41-3.49a.75.75 0 0 0-1.08 1.05l4.57 4.66 6.54-7.62Z"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "info",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("circle", {
                        cx: "12",
                        cy: "12",
                        r: "9"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M12 16v-6M12 7.6v-.2"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "sidebar-burger",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M4 12H20"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M4 7H20"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M4 17H20"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "cross-circle",
                viewBox: "0 0 24 24",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        fill: "currentColor",
                        fillRule: "evenodd",
                        d: "M23.925 12c0 6.627-5.356 12-11.962 12C5.356 24 0 18.627 0 12S5.356 0 11.963 0s11.962 5.373 11.962 12M11.963 22.286c5.663 0 10.253-4.605 10.253-10.286S17.626 1.714 11.963 1.714 1.709 6.32 1.709 12s4.59 10.286 10.254 10.286",
                        clipRule: "evenodd"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeWidth: "3",
                        d: "m7.89 7.843 8.518 8.544m0-8.544-8.517 8.544"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "check-circle",
                viewBox: "0 0 24 24",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        fill: "#fff",
                        d: "M22.216 12c0 5.68-4.59 10.286-10.253 10.286S1.709 17.68 1.709 12 6.299 1.714 11.963 1.714 22.216 6.32 22.216 12"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        fill: "#74a352",
                        fillRule: "evenodd",
                        d: "M23.925 12c0 6.627-5.356 12-11.962 12C5.356 24 0 18.627 0 12S5.356 0 11.963 0s11.962 5.373 11.962 12M11.963 22.286c5.663 0 10.253-4.605 10.253-10.286S17.626 1.714 11.963 1.714 1.709 6.32 1.709 12s4.59 10.286 10.254 10.286",
                        clipRule: "evenodd"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        fill: "#5c8141",
                        fillRule: "evenodd",
                        d: "M15.635 7.438a1.692 1.692 0 1 1 2.551 2.225l-6.21 7.13a1.693 1.693 0 0 1-2.501.054l-3.313-3.489a1.693 1.693 0 0 1 2.452-2.332l2.032 2.14z",
                        clipRule: "evenodd"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "infinity-circle",
                viewBox: "0 0 24 24",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        fill: "#fff",
                        d: "M22.216 12c0 5.68-4.59 10.286-10.253 10.286S1.709 17.68 1.709 12 6.299 1.714 11.963 1.714 22.216 6.32 22.216 12"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        fill: "#74a352",
                        fillRule: "evenodd",
                        d: "M23.925 12c0 6.627-5.356 12-11.962 12C5.356 24 0 18.627 0 12S5.356 0 11.963 0s11.962 5.373 11.962 12M11.963 22.286c5.663 0 10.253-4.605 10.253-10.286S17.626 1.714 11.963 1.714 1.709 6.32 1.709 12s4.59 10.286 10.254 10.286",
                        clipRule: "evenodd"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        fill: "#5c8141",
                        fillRule: "evenodd",
                        d: "M16.36 16c-1.887 0-3.236-1.222-4.398-2.522C10.792 14.785 9.447 16 7.565 16c-2.248 0-4.076-1.795-4.076-4s1.828-4 4.076-4c1.884 0 3.266 1.239 4.398 2.496C13.093 9.24 14.477 8 16.36 8c2.249 0 4.076 1.795 4.076 4s-1.828 4-4.076 4m0-6.06c1.163 0 2.109.926 2.109 2.06 0 1.136-.946 2.06-2.11 2.06-.576 0-1.112-.234-1.653-.644-.488-.37-.962-.869-1.453-1.43.482-.55.95-1.041 1.438-1.407.54-.404 1.08-.639 1.669-.638M5.456 12c0-1.135.946-2.06 2.11-2.06.587 0 1.128.235 1.668.64.487.365.955.855 1.438 1.406-.487.557-.958 1.055-1.447 1.426-.541.41-1.08.648-1.66.648-1.163 0-2.109-.925-2.109-2.06",
                        clipRule: "evenodd"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("symbol", {
                id: "fire-outline",
                viewBox: "0 0 24 24",
                fill: "none",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                    stroke: "currentColor",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "1.5",
                    d: "M15.032 4.603 14.628 3l-1.146 1.167c-1.3 1.323-2.1 2.604-2.535 4.008l-.017.056c-.332 1.095-.438 2.156-.444 3.813v.08l-.036-.014c-.792-.338-1.535-1.221-1.937-2.286l-.52-1.375-1.006 1.053c-1.806 1.887-2.423 4.241-1.677 6.564C6.233 18.937 9.032 21 12 21c3.86 0 7-3.209 7-7.157 0-1.057-.148-1.892-.462-2.647l-.023-.055c-.25-.584-.513-.993-1.114-1.797l-.23-.307a15 15 0 0 1-.664-.942c-.64-.993-1.115-2.066-1.475-3.492",
                    clipRule: "evenodd"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "rocket",
                viewBox: "0 0 24 24",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        stroke: "currentColor",
                        strokeLinejoin: "round",
                        strokeWidth: "1.5",
                        d: "M15.162 7.75a1.413 1.413 0 1 1 0 2.826 1.413 1.413 0 0 1 0-2.826Z"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeWidth: "1.5",
                        d: "M14.75 15.75v5.5M4.5 17v3h3M9.25 9.75h-5.5"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        stroke: "currentColor",
                        strokeLinejoin: "round",
                        strokeWidth: "1.5",
                        d: "m13.485 3.828 6.364.708.707 6.364-9.9 7.07-4.242-4.242z"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "globe",
                viewBox: "0 0 24 24",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "1.5",
                        d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18",
                        clipRule: "evenodd"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "1.5",
                        d: "M14.5 3.5q.413 1.75.654 3.5M19 7a26 26 0 0 1-3.746.784 36.4 36.4 0 0 1 0 8.434q1.872.246 3.746.782M15.154 17a38 38 0 0 1-.654 3.5M9.5 20.5a38 38 0 0 1-.654-3.5M5 17a26 26 0 0 1 3.747-.784 36.2 36.2 0 0 1 0-8.433A26 26 0 0 1 5 7v0M8.846 7q.242-1.75.654-3.5v0M9.5 16.128a24.6 24.6 0 0 1 5 0M14.5 7.873a24.6 24.6 0 0 1-5 0M3 12h18"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "device",
                viewBox: "0 0 24 24",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("rect", {
                        width: "12",
                        height: "19",
                        x: "6",
                        y: "2",
                        stroke: "currentColor",
                        strokeWidth: "1.5",
                        rx: "3"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeWidth: "1.5",
                        d: "M10.5 4.5h3"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("symbol", {
                id: "web-activity",
                viewBox: "0 0 24 24",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("rect", {
                        width: "16",
                        height: "6",
                        x: "4",
                        y: "13",
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "1.5",
                        rx: "1"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "1.5",
                        d: "M17 16h-1M14 16h-1"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("rect", {
                        width: "16",
                        height: "6",
                        x: "4",
                        y: "5",
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "1.5",
                        rx: "1"
                    })
                ]
            })
        ]
    });

;// CONCATENATED MODULE: ./src/common/components/Icons/index.ts




;// CONCATENATED MODULE: ./src/common/hooks/useSubscribeNotifier.ts
function useSubscribeNotifier_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
function useSubscribeNotifier_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                useSubscribeNotifier_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                useSubscribeNotifier_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}




/**
 * Hook that subscribes for notifier events from background.
 *
 * @param events Events list to subscribe for.
 * @param messageHandler Handler for notifier messages.
 * @param onListenersUpdate Callback for when listeners are updated.
 */ function useSubscribeNotifier(events, messageHandler, onListenersUpdate) {
    const callbackRef = (0,node_modules_react.useRef)(null);
    /**
     * Subscribe to notification from background page with this method
     * If use runtime.onMessage, then we can intercept messages from popup
     * to the message handler on background page.
     *
     * @returns A function that can be called to remove the event listener subscription.
     */ const createMessageListener = ()=>useSubscribeNotifier_async_to_generator(function*() {
            return messenger.createEventListener(events, messageHandler);
        })();
    /**
     * Handle messages from the background page.
     * This function intentionally not async to avoid interception of several
     * listeners. In order to deal with async code we return `true` as result
     * of listener to keep the message channel open until the response is sent.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#sending_an_asynchronous_response_using_sendresponse}
     *
     * @param message Message from background page.
     * @param sender Sender of the message.
     * @param sendResponse Response function to send response back to the sender.
     *
     * @returns True if message type is UPDATE_LISTENERS to keep the message
     * channel open until the callback is invoked.
     */ const handleBrowserMessage = (message, sender, sendResponse)=>{
        const { type } = message;
        if (type === constants_MessageType.UPDATE_LISTENERS) {
            if (onListenersUpdate) {
                onListenersUpdate();
            }
            if (callbackRef.current) {
                callbackRef.current();
            }
            createMessageListener().then((callback)=>{
                callbackRef.current = callback;
                // By sending a response, we indicate that we have handled
                // the message and that the message channel can be closed.
                sendResponse(null);
            });
            // Return true to keep the message
            // channel open until the callback is invoked
            return true;
        }
    };
    (0,node_modules_react.useEffect)(()=>{
        (()=>useSubscribeNotifier_async_to_generator(function*() {
                callbackRef.current = yield createMessageListener();
            })())();
        browser_polyfill_default().runtime.onMessage.addListener(handleBrowserMessage);
        return ()=>{
            if (callbackRef.current) {
                callbackRef.current();
            }
            browser_polyfill_default().runtime.onMessage.removeListener(handleBrowserMessage);
        };
    }, []);
}

;// CONCATENATED MODULE: ./src/options/components/ui/Checkbox/Checkbox.tsx





/**
 * Checkbox component.
 */ function Checkbox({ id, label, value, onToggle }) {
    const [checkedValue, setCheckedValue] = (0,node_modules_react.useState)(value);
    const computedValue = onToggle ? value : checkedValue;
    const classes = classnames_default()('checkbox has-tab-focus', computedValue && 'checkbox--active');
    const iconName = `checkbox-${computedValue ? 'enabled' : 'disabled'}`;
    const handleChange = ()=>{
        setCheckedValue((prevValue)=>!prevValue);
        if (onToggle) {
            onToggle();
        }
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
        htmlFor: id,
        className: classes,
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex: 0,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon, {
                name: iconName,
                color: computedValue ? 'product' : 'gray'
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                id: id,
                type: "checkbox",
                checked: value,
                className: "checkbox__input",
                tabIndex: -1,
                onChange: handleChange
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "checkbox__label",
                children: label
            })
        ]
    });
}

;// CONCATENATED MODULE: ./src/options/components/ui/Checkbox/index.ts


;// CONCATENATED MODULE: ./src/options/components/ui/Button/Button.tsx





function Button({ variant = 'filled', type = 'button', color = 'primary', size = 'large', className, disabled, form, beforeIconName, children, onClick }) {
    const classes = classnames_default()('button has-tab-focus', `button--${variant}`, `button--color-${color}`, `button--size-${size}`, className);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
        // eslint-disable-next-line react/button-has-type
        type: type,
        className: classes,
        disabled: disabled,
        form: form,
        onClick: onClick,
        children: [
            beforeIconName && /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon, {
                name: beforeIconName
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                className: "button__text",
                children: children
            })
        ]
    });
}

;// CONCATENATED MODULE: ./src/options/components/ui/Button/index.ts


;// CONCATENATED MODULE: ./src/assets/images/vpn-blocked-error-ninja.svg
const vpn_blocked_error_ninja_namespaceObject = __webpack_require__.p + "assets/images/vpn-blocked-error-ninja.svg";
;// CONCATENATED MODULE: ./src/common/hooks/useOutsideClick.tsx

const ESC_KEY_NAME = 'Escape';
/**
 * A hook that calls provided handler on outside click of referenced element
 * or ESC key pressed (https://github.com/AdguardTeam/AdGuardVPNExtension/issues/90)
 * @param ref
 * @param handler
 */ const useOutsideClick = (ref, handler)=>{
    useEffect(()=>{
        const listener = (event)=>{
            if (event instanceof KeyboardEvent && event.key === ESC_KEY_NAME || ref.current && !ref.current.contains(event.target)) {
                handler(event);
            }
        };
        document.addEventListener('click', listener);
        document.addEventListener('keydown', listener);
        return ()=>{
            document.removeEventListener('click', listener);
            document.removeEventListener('keydown', listener);
        };
    }, [
        ref,
        handler
    ]);
};

;// CONCATENATED MODULE: ./src/options/components/ui/ReactPortal.tsx

function ReactPortal({ children }) {
    return /*#__PURE__*/ (0,react_dom.createPortal)(children, document.body);
}

;// CONCATENATED MODULE: ./src/options/components/ui/Modal/Modal.tsx







function Modal({ title, description, actions, isOpen, size = 'large', className, children, onClose }) {
    const classes = classnames_default()('modal', `modal--size-${size}`, className);
    (0,node_modules_react.useEffect)(()=>{
        const listener = (event)=>{
            if (event.key === ESC_KEY_NAME) {
                onClose();
            }
        };
        document.addEventListener('keydown', listener);
        return ()=>{
            document.removeEventListener('keydown', listener);
        };
    }, [
        onClose
    ]);
    if (!isOpen) {
        return null;
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(ReactPortal, {
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: classes,
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                    className: "modal__overlay",
                    onClick: onClose
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "modal__content",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(IconButton, {
                            name: "cross",
                            className: "modal__close-btn",
                            onClick: onClose
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "modal__header",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "modal__title",
                                    children: title
                                }),
                                description && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "modal__description",
                                    children: description
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "modal__wrapper",
                            children: children
                        }),
                        actions && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "modal__actions",
                            children: actions
                        })
                    ]
                })
            ]
        })
    });
}

;// CONCATENATED MODULE: ./src/options/components/ui/Modal/index.ts


;// CONCATENATED MODULE: ./src/consent/App/UsageDataModal.tsx





/**
 * Usage data modal. Shown when consent checkbox link clicked.
 */ function UsageDataModal({ isOpen, privacyUrl, onClose }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(Modal, {
        title: translator.getMessage('settings_help_us_improve_modal_title'),
        description: /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                    className: "consent__modal-text",
                    children: translator.getMessage('settings_help_us_improve_modal_desc_data')
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("ul", {
                    className: "consent__modal-list",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                            className: "consent__modal-list-item",
                            children: translator.getMessage('settings_help_us_improve_modal_desc_data_screens')
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                            className: "consent__modal-list-item",
                            children: translator.getMessage('settings_help_us_improve_modal_desc_data_buttons')
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                            className: "consent__modal-list-item",
                            children: translator.getMessage('settings_help_us_improve_modal_desc_data_sessions')
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                    className: "consent__modal-text",
                    children: translator.getMessage('settings_help_us_improve_modal_desc_improve')
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                    className: "consent__modal-text",
                    children: translator.getMessage('settings_help_us_improve_modal_desc_internally')
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("a", {
                    href: privacyUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "link consent__modal-link",
                    children: translator.getMessage('settings_help_us_improve_modal_privacy_policy')
                })
            ]
        }),
        actions: /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
            onClick: onClose,
            children: translator.getMessage('settings_help_us_improve_modal_button')
        }),
        isOpen: isOpen,
        className: "consent__modal",
        onClose: onClose
    });
}

;// CONCATENATED MODULE: ./src/consent/App/FailedToLoginModal.tsx

/* eslint-disable react/no-unstable-nested-components */ 




/**
 * Failed to login modal component. Shown when the user fails to log in.
 */ function FailedToLoginModal({ isOpen, supportUrl = '#', shouldShowSupportLink, onClose }) {
    const description = shouldShowSupportLink ? reactTranslator.getMessage('auth_failed_to_login_description', {
        a: (chunks)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("a", {
                href: supportUrl,
                className: "link consent__modal-link",
                target: "_blank",
                rel: "noopener noreferrer",
                children: chunks
            })
    }) : translator.getMessage('auth_failed_to_login_description_without_support');
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(Modal, {
        title: translator.getMessage('auth_failed_to_login_title'),
        description: description,
        actions: /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
            onClick: onClose,
            children: translator.getMessage('auth_failed_to_login_button')
        }),
        isOpen: isOpen,
        className: "consent__modal",
        onClose: onClose
    });
}

;// CONCATENATED MODULE: ./src/consent/App/App.tsx
function App_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
function App_async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                App_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                App_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

/* eslint-disable react/no-unstable-nested-components */ 



















/**
 * List of notifier events to subscribe for.
 */ const NOTIFIER_EVENTS = [
    notifier.types.AUTH_CACHE_UPDATED,
    notifier.types.USER_AUTHENTICATED
];
/**
 * Consent page main component.
 */ function App() {
    // Retrieved from background
    const [policyAgreement, setPolicyAgreement] = (0,node_modules_react.useState)(false);
    const [helpUsImprove, setHelpUsImprove] = (0,node_modules_react.useState)(false);
    const [eulaUrl, setEulaUrl] = (0,node_modules_react.useState)(undefined);
    const [privacyUrl, setPrivacyUrl] = (0,node_modules_react.useState)(undefined);
    const [supportUrl, setSupportUrl] = (0,node_modules_react.useState)(undefined);
    const [webAuthFlowState, setWebAuthFlowState] = (0,node_modules_react.useState)(webAuthEnums_WebAuthState.Idle);
    // Local state
    const [isUsageDataModalOpen, setIsUsageDataModalOpen] = (0,node_modules_react.useState)(false);
    const isWebAuthFlowStarted = webAuthFlowState !== webAuthEnums_WebAuthState.Idle;
    const isWebAuthFlowLoading = webAuthFlowState === webAuthEnums_WebAuthState.Loading;
    const isWebAuthFailedByUser = webAuthFlowState === webAuthEnums_WebAuthState.FailedByUser;
    const isWebAuthFlowHasError = webAuthFlowState === webAuthEnums_WebAuthState.Failed || isWebAuthFailedByUser;
    (0,node_modules_react.useEffect)(()=>{
        const getData = ()=>App_async_to_generator(function*() {
                const { policyAgreement, helpUsImprove, webAuthFlowState, forwarderDomain, selectedLanguage } = yield messenger.getConsentData();
                yield i18n_i18n.init(selectedLanguage);
                setPolicyAgreement(policyAgreement);
                setHelpUsImprove(helpUsImprove);
                setWebAuthFlowState(webAuthFlowState);
                const { eulaUrl, privacyUrl } = getPrivacyAndEulaUrls(forwarderDomain);
                const supportUrl = getForwarderUrl(forwarderDomain, FORWARDER_URL_QUERIES.POPUP_DEFAULT_SUPPORT);
                setEulaUrl(eulaUrl);
                setPrivacyUrl(privacyUrl);
                setSupportUrl(supportUrl);
            })();
        getData();
    }, []);
    const messageHandler = (message)=>{
        const { type, data, value } = message;
        switch(type){
            case notifier.types.AUTH_CACHE_UPDATED:
                switch(data){
                    case authCacheTypes_AuthCacheKey.PolicyAgreement:
                        setPolicyAgreement(value);
                        break;
                    case authCacheTypes_AuthCacheKey.HelpUsImprove:
                        setHelpUsImprove(value);
                        break;
                    case authCacheTypes_AuthCacheKey.WebAuthFlowState:
                        setWebAuthFlowState(value);
                        break;
                    default:
                        break;
                }
                break;
            // Close consent page when user authenticates
            case notifier.types.USER_AUTHENTICATED:
                window.close();
                break;
            default:
                break;
        }
    };
    useSubscribeNotifier(NOTIFIER_EVENTS, messageHandler);
    const stopPropagation = (e)=>App_async_to_generator(function*() {
            e.stopPropagation();
        })();
    const handlePolicyToggle = ()=>App_async_to_generator(function*() {
            const newValue = !policyAgreement;
            yield messenger.updateAuthCache(authCacheTypes_AuthCacheKey.PolicyAgreement, newValue);
            setPolicyAgreement(newValue);
        })();
    const handleHelpUsImproveToggle = ()=>App_async_to_generator(function*() {
            const newValue = !helpUsImprove;
            yield messenger.updateAuthCache(authCacheTypes_AuthCacheKey.HelpUsImprove, newValue);
            setHelpUsImprove(newValue);
        })();
    const openUsageDataModal = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        setIsUsageDataModalOpen(true);
    };
    const closeUsageDataModal = ()=>{
        setIsUsageDataModalOpen(false);
    };
    const closeFailedToLoginModal = ()=>App_async_to_generator(function*() {
            yield messenger.sendWebAuthAction(webAuthEnums_WebAuthAction.DismissFailure);
        })();
    const handleContinueClick = ()=>App_async_to_generator(function*() {
            // save the consent data
            yield messenger.setConsentData(policyAgreement, helpUsImprove);
            // start the web authentication flow
            yield messenger.sendWebAuthAction(webAuthEnums_WebAuthAction.Start);
        })();
    const handleReopenClick = ()=>App_async_to_generator(function*() {
            yield messenger.sendWebAuthAction(webAuthEnums_WebAuthAction.Reopen);
        })();
    const handleCancelClick = ()=>App_async_to_generator(function*() {
            yield messenger.sendWebAuthAction(webAuthEnums_WebAuthAction.Cancel);
        })();
    if (isWebAuthFlowStarted) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: "consent",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "consent__loader-content",
                    children: [
                        isWebAuthFlowLoading && /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon, {
                            name: "spinner",
                            color: "product",
                            size: "48",
                            className: "consent__loader-spinner"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                            className: "consent__loader-title",
                            children: translator.getMessage('auth_loading_title')
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                            className: "consent__loader-description",
                            children: translator.getMessage('auth_loading_description')
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "consent__loader-actions",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                            className: "consent__loader-button",
                            onClick: handleReopenClick,
                            children: translator.getMessage('auth_loading_button_reopen')
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                            className: "consent__loader-button",
                            variant: "transparent",
                            onClick: handleCancelClick,
                            children: translator.getMessage('auth_loading_button_cancel')
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(FailedToLoginModal, {
                    isOpen: isWebAuthFlowHasError,
                    supportUrl: supportUrl,
                    shouldShowSupportLink: !isWebAuthFailedByUser,
                    onClose: closeFailedToLoginModal
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(Icons, {})
            ]
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "consent",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "consent__header",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                    className: "consent__logo"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "consent__content",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "consent__image-wrapper",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("img", {
                            src: vpn_blocked_error_ninja_namespaceObject,
                            alt: "Reading Ninja",
                            className: "consent__image"
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "consent__title",
                        children: translator.getMessage('popup_auth_policy_agreement_title')
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "consent__checkboxes",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Checkbox, {
                                id: "policy_agreement",
                                label: reactTranslator.getMessage('popup_auth_policy_agreement', {
                                    eula: (chunks)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("a", {
                                            href: eulaUrl,
                                            className: "link",
                                            target: "_blank",
                                            rel: "noreferrer",
                                            // handler used to stop propagation,
                                            // because it's contained in a checkbox label
                                            // in order to avoid checking the checkbox
                                            // when clicking on the link
                                            onClick: stopPropagation,
                                            children: chunks
                                        }),
                                    privacy: (chunks)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("a", {
                                            href: privacyUrl,
                                            className: "link",
                                            target: "_blank",
                                            rel: "noreferrer",
                                            // handler used to stop propagation,
                                            // because it's contained in a checkbox label
                                            // in order to avoid checking the checkbox
                                            // when clicking on the link
                                            onClick: stopPropagation,
                                            children: chunks
                                        })
                                }),
                                value: policyAgreement,
                                onToggle: handlePolicyToggle
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Checkbox, {
                                id: "help_us_improve",
                                label: reactTranslator.getMessage('popup_auth_help_us_improve_agreement', {
                                    link: (chunks)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("a", {
                                            role: "button",
                                            href: "#",
                                            onClick: openUsageDataModal,
                                            className: "link",
                                            children: chunks
                                        })
                                }),
                                value: helpUsImprove,
                                onToggle: handleHelpUsImproveToggle
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "consent__actions-spacer"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "consent__actions",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                            onClick: handleContinueClick,
                            disabled: !policyAgreement,
                            children: translator.getMessage('popup_auth_policy_agreement_continue_button')
                        })
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(UsageDataModal, {
                isOpen: isUsageDataModalOpen,
                privacyUrl: privacyUrl,
                onClose: closeUsageDataModal
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(FailedToLoginModal, {
                isOpen: isWebAuthFlowHasError,
                supportUrl: supportUrl,
                shouldShowSupportLink: !isWebAuthFailedByUser,
                onClose: closeFailedToLoginModal
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Icons, {})
        ]
    });
}

;// CONCATENATED MODULE: ./src/consent/App/index.ts


;// CONCATENATED MODULE: ./src/consent/index.tsx






document.title = translator.getMessage('name');
const rootNode = document.getElementById('root');
const root = (0,client.createRoot)(rootNode);
root.render(/*#__PURE__*/ (0,jsx_runtime.jsx)(Provider, {
    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(App, {})
}));

})();

})()
;