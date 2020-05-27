/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, function () { 'use strict';

  /*  */

  var emptyObject = Object.freeze({});

  // These helpers produce better VM code in JS engines due to their
  // explicitness and function inlining.
  function isUndef (v) {
    return v === undefined || v === null
  }

  function isDef (v) {
    return v !== undefined && v !== null
  }

  function isTrue (v) {
    return v === true
  }

  function isFalse (v) {
    return v === false
  }

  /**
   * Check if value is primitive.
   */
  function isPrimitive (value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  /**
   * Get the raw type string of a value, e.g., [object Object].
   */
  var _toString = Object.prototype.toString;

  function toRawType (value) {
    return _toString.call(value).slice(8, -1)
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
  }

  function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
  }

  /**
   * Check if val is a valid array index.
   */
  function isValidArrayIndex (val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val)
  }

  function isPromise (val) {
    return (
      isDef(val) &&
      typeof val.then === 'function' &&
      typeof val.catch === 'function'
    )
  }

  /**
   * Convert a value to a string that is actually rendered.
   */
  function toString (val) {
    return val == null
      ? ''
      : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
        ? JSON.stringify(val, null, 2)
        : String(val)
  }

  /**
   * Convert an input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber (val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap (
    str,
    expectsLowerCase
  ) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase
      ? function (val) { return map[val.toLowerCase()]; }
      : function (val) { return map[val]; }
  }

  /**
   * Check if a tag is a built-in tag.
   */
  var isBuiltInTag = makeMap('slot,component', true);

  /**
   * Check if an attribute is a reserved attribute.
   */
  var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

  /**
   * Remove an item from an array.
   */
  function remove (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }

  /**
   * Check whether an object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached (fn) {
    var cache = Object.create(null);
    return (function cachedFn (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str))
    })
  }

  /**
   * Camelize a hyphen-delimited string.
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
  });

  /**
   * Capitalize a string.
   */
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  });

  /**
   * Hyphenate a camelCase string.
   */
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  });

  /**
   * Simple bind polyfill for environments that do not support it,
   * e.g., PhantomJS 1.x. Technically, we don't need this anymore
   * since native bind is now performant enough in most browsers.
   * But removing it would mean breaking code that was able to run in
   * PhantomJS 1.x, so this must be kept for backward compatibility.
   */

  /* istanbul ignore next */
  function polyfillBind (fn, ctx) {
    function boundFn (a) {
      var l = arguments.length;
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx)
    }

    boundFn._length = fn.length;
    return boundFn
  }

  function nativeBind (fn, ctx) {
    return fn.bind(ctx)
  }

  var bind = Function.prototype.bind
    ? nativeBind
    : polyfillBind;

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray (list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret
  }

  /**
   * Mix properties into target object.
   */
  function extend (to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject (arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res
  }

  /* eslint-disable no-unused-vars */

  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */
  function noop (a, b, c) {}

  /**
   * Always return false.
   */
  var no = function (a, b, c) { return false; };

  /* eslint-enable no-unused-vars */

  /**
   * Return the same value.
   */
  var identity = function (_) { return _; };

  /**
   * Generate a string containing static keys from compiler modules.
   */
  function genStaticKeys (modules) {
    return modules.reduce(function (keys, m) {
      return keys.concat(m.staticKeys || [])
    }, []).join(',')
  }

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual (a, b) {
    if (a === b) { return true }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a);
        var isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function (e, i) {
            return looseEqual(e, b[i])
          })
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime()
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key])
          })
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }

  /**
   * Return the first index at which a loosely equal value can be
   * found in the array (if value is a plain object, the array must
   * contain an object of the same shape), or -1 if it is not present.
   */
  function looseIndexOf (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) { return i }
    }
    return -1
  }

  /**
   * Ensure a function is called only once.
   */
  function once (fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    }
  }

  var SSR_ATTR = 'data-server-rendered';

  var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
  ];

  var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
  ];

  /*  */



  var config = ({
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Show production mode tip message on boot?
     */
    productionTip: "development" !== 'production',

    /**
     * Whether to enable devtools
     */
    devtools: "development" !== 'production',

    /**
     * Whether to record perf
     */
    performance: false,

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],

    /**
     * Custom user key aliases for v-on
     */
    // $flow-disable-line
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils
     * This will significantly reduce performance if set to false.
     */
    async: true,

    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
  });

  /*  */

  /**
   * unicode letters used for parsing html tags, component names and property paths.
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
   */
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

  /**
   * Check if a string starts with $ or _
   */
  function isReserved (str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F
  }

  /**
   * Define a property.
   */
  function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Parse simple path.
   */
  var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
  function parsePath (path) {
    if (bailRE.test(path)) {
      return
    }
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }

  /*  */

  // can we use __proto__?
  var hasProto = '__proto__' in {};

  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';
  var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
  var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isEdge = UA && UA.indexOf('edge/') > 0;
  var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
  var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
  var isPhantomJS = UA && /phantomjs/.test(UA);
  var isFF = UA && UA.match(/firefox\/(\d+)/);

  // Firefox has a "watch" function on Object.prototype...
  var nativeWatch = ({}).watch;

  var supportsPassive = false;
  if (inBrowser) {
    try {
      var opts = {};
      Object.defineProperty(opts, 'passive', ({
        get: function get () {
          /* istanbul ignore next */
          supportsPassive = true;
        }
      })); // https://github.com/facebook/flow/issues/285
      window.addEventListener('test-passive', null, opts);
    } catch (e) {}
  }

  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  var _isServer;
  var isServerRendering = function () {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && !inWeex && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer
  };

  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  /* istanbul ignore next */
  function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
  }

  var hasSymbol =
    typeof Symbol !== 'undefined' && isNative(Symbol) &&
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

  var _Set;
  /* istanbul ignore if */ // $flow-disable-line
  if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = /*@__PURE__*/(function () {
      function Set () {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has (key) {
        return this.set[key] === true
      };
      Set.prototype.add = function add (key) {
        this.set[key] = true;
      };
      Set.prototype.clear = function clear () {
        this.set = Object.create(null);
      };

      return Set;
    }());
  }

  /*  */

  var warn = noop;
  var tip = noop;
  var generateComponentTrace = (noop); // work around flow check
  var formatComponentName = (noop);

  {
    var hasConsole = typeof console !== 'undefined';
    var classifyRE = /(?:^|[-_])(\w)/g;
    var classify = function (str) { return str
      .replace(classifyRE, function (c) { return c.toUpperCase(); })
      .replace(/[-_]/g, ''); };

    warn = function (msg, vm) {
      var trace = vm ? generateComponentTrace(vm) : '';

      if (config.warnHandler) {
        config.warnHandler.call(null, msg, vm, trace);
      } else if (hasConsole && (!config.silent)) {
        console.error(("[Vue warn]: " + msg + trace));
      }
    };

    tip = function (msg, vm) {
      if (hasConsole && (!config.silent)) {
        console.warn("[Vue tip]: " + msg + (
          vm ? generateComponentTrace(vm) : ''
        ));
      }
    };

    formatComponentName = function (vm, includeFile) {
      if (vm.$root === vm) {
        return '<Root>'
      }
      var options = typeof vm === 'function' && vm.cid != null
        ? vm.options
        : vm._isVue
          ? vm.$options || vm.constructor.options
          : vm;
      var name = options.name || options._componentTag;
      var file = options.__file;
      if (!name && file) {
        var match = file.match(/([^/\\]+)\.vue$/);
        name = match && match[1];
      }

      return (
        (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
        (file && includeFile !== false ? (" at " + file) : '')
      )
    };

    var repeat = function (str, n) {
      var res = '';
      while (n) {
        if (n % 2 === 1) { res += str; }
        if (n > 1) { str += str; }
        n >>= 1;
      }
      return res
    };

    generateComponentTrace = function (vm) {
      if (vm._isVue && vm.$parent) {
        var tree = [];
        var currentRecursiveSequence = 0;
        while (vm) {
          if (tree.length > 0) {
            var last = tree[tree.length - 1];
            if (last.constructor === vm.constructor) {
              currentRecursiveSequence++;
              vm = vm.$parent;
              continue
            } else if (currentRecursiveSequence > 0) {
              tree[tree.length - 1] = [last, currentRecursiveSequence];
              currentRecursiveSequence = 0;
            }
          }
          tree.push(vm);
          vm = vm.$parent;
        }
        return '\n\nfound in\n\n' + tree
          .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
              ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
              : formatComponentName(vm))); })
          .join('\n')
      } else {
        return ("\n\n(found in " + (formatComponentName(vm)) + ")")
      }
    };
  }

  /*  */

  var uid = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep () {
    this.id = uid++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub (sub) {
    remove(this.subs, sub);
  };

  Dep.prototype.depend = function depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify () {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    if (!config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort(function (a, b) { return a.id - b.id; });
    }
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // The current target watcher being evaluated.
  // This is globally unique because only one watcher
  // can be evaluated at a time.
  Dep.target = null;
  var targetStack = [];

  function pushTarget (target) {
    targetStack.push(target);
    Dep.target = target;
  }

  function popTarget () {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
  }

  /*  */

  var VNode = function VNode (
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
    asyncFactory
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.fnContext = undefined;
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  };

  var prototypeAccessors = { child: { configurable: true } };

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  prototypeAccessors.child.get = function () {
    return this.componentInstance
  };

  Object.defineProperties( VNode.prototype, prototypeAccessors );

  var createEmptyVNode = function (text) {
    if ( text === void 0 ) text = '';

    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
  };

  function createTextVNode (val) {
    return new VNode(undefined, undefined, undefined, String(val))
  }

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode (vnode) {
    var cloned = new VNode(
      vnode.tag,
      vnode.data,
      // #7975
      // clone children array to avoid mutating original in case of cloning
      // a child.
      vnode.children && vnode.children.slice(),
      vnode.text,
      vnode.elm,
      vnode.context,
      vnode.componentOptions,
      vnode.asyncFactory
    );
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.asyncMeta = vnode.asyncMeta;
    cloned.isCloned = true;
    return cloned
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);

  var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      if (inserted) { ob.observeArray(inserted); }
      // notify change
      ob.dep.notify();
      return result
    });
  });

  /*  */

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * In some cases we may want to disable observation inside a component's
   * update computation.
   */
  var shouldObserve = true;

  function toggleObserving (value) {
    shouldObserve = value;
  }

  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   */
  var Observer = function Observer (value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment a target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment a target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe (value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
      return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      shouldObserve &&
      !isServerRendering() &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    ) {
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1 (
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        /* eslint-enable no-self-compare */
        if (customSetter) {
          customSetter();
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set (target, key, val) {
    if (isUndef(target) || isPrimitive(target)
    ) {
      warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      );
      return val
    }
    if (!ob) {
      target[key] = val;
      return val
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del (target, key) {
    if (isUndef(target) || isPrimitive(target)
    ) {
      warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      warn(
        'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
      );
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray (value) {
    for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
      e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  var strats = config.optionMergeStrategies;

  /**
   * Options with restrictions
   */
  {
    strats.el = strats.propsData = function (parent, child, vm, key) {
      if (!vm) {
        warn(
          "option \"" + key + "\" can only be used during instance " +
          'creation with the `new` keyword.'
        );
      }
      return defaultStrat(parent, child)
    };
  }

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData (to, from) {
    if (!from) { return to }
    var key, toVal, fromVal;

    var keys = hasSymbol
      ? Reflect.ownKeys(from)
      : Object.keys(from);

    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      // in case the object is already observed...
      if (key === '__ob__') { continue }
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (
        toVal !== fromVal &&
        isPlainObject(toVal) &&
        isPlainObject(fromVal)
      ) {
        mergeData(toVal, fromVal);
      }
    }
    return to
  }

  /**
   * Data
   */
  function mergeDataOrFn (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal
      }
      if (!parentVal) {
        return childVal
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn () {
        return mergeData(
          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
          typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
        )
      }
    } else {
      return function mergedInstanceDataFn () {
        // instance merge
        var instanceData = typeof childVal === 'function'
          ? childVal.call(vm, vm)
          : childVal;
        var defaultData = typeof parentVal === 'function'
          ? parentVal.call(vm, vm)
          : parentVal;
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
    }
  }

  strats.data = function (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {
        warn(
          'The "data" option should be a function ' +
          'that returns a per-instance value in component ' +
          'definitions.',
          vm
        );

        return parentVal
      }
      return mergeDataOrFn(parentVal, childVal)
    }

    return mergeDataOrFn(parentVal, childVal, vm)
  };

  /**
   * Hooks and props are merged as arrays.
   */
  function mergeHook (
    parentVal,
    childVal
  ) {
    var res = childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
          ? childVal
          : [childVal]
      : parentVal;
    return res
      ? dedupeHooks(res)
      : res
  }

  function dedupeHooks (hooks) {
    var res = [];
    for (var i = 0; i < hooks.length; i++) {
      if (res.indexOf(hooks[i]) === -1) {
        res.push(hooks[i]);
      }
    }
    return res
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets (
    parentVal,
    childVal,
    vm,
    key
  ) {
    var res = Object.create(parentVal || null);
    if (childVal) {
      assertObjectType(key, childVal, vm);
      return extend(res, childVal)
    } else {
      return res
    }
  }

  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    // work around Firefox's Object.prototype.watch...
    if (parentVal === nativeWatch) { parentVal = undefined; }
    if (childVal === nativeWatch) { childVal = undefined; }
    /* istanbul ignore if */
    if (!childVal) { return Object.create(parentVal || null) }
    {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) { return childVal }
    var ret = {};
    extend(ret, parentVal);
    for (var key$1 in childVal) {
      var parent = ret[key$1];
      var child = childVal[key$1];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key$1] = parent
        ? parent.concat(child)
        : Array.isArray(child) ? child : [child];
    }
    return ret
  };

  /**
   * Other object hashes.
   */
  strats.props =
  strats.methods =
  strats.inject =
  strats.computed = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    if (childVal && "development" !== 'production') {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) { return childVal }
    var ret = Object.create(null);
    extend(ret, parentVal);
    if (childVal) { extend(ret, childVal); }
    return ret
  };
  strats.provide = mergeDataOrFn;

  /**
   * Default strategy.
   */
  var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined
      ? parentVal
      : childVal
  };

  /**
   * Validate component names
   */
  function checkComponents (options) {
    for (var key in options.components) {
      validateComponentName(key);
    }
  }

  function validateComponentName (name) {
    if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
      warn(
        'Invalid component name: "' + name + '". Component names ' +
        'should conform to valid custom element name in html5 specification.'
      );
    }
    if (isBuiltInTag(name) || config.isReservedTag(name)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + name
      );
    }
  }

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps (options, vm) {
    var props = options.props;
    if (!props) { return }
    var res = {};
    var i, val, name;
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = { type: null };
        } else {
          warn('props must be strings when using array syntax.');
        }
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val)
          ? val
          : { type: val };
      }
    } else {
      warn(
        "Invalid value for option \"props\": expected an Array or an Object, " +
        "but got " + (toRawType(props)) + ".",
        vm
      );
    }
    options.props = res;
  }

  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject (options, vm) {
    var inject = options.inject;
    if (!inject) { return }
    var normalized = options.inject = {};
    if (Array.isArray(inject)) {
      for (var i = 0; i < inject.length; i++) {
        normalized[inject[i]] = { from: inject[i] };
      }
    } else if (isPlainObject(inject)) {
      for (var key in inject) {
        var val = inject[key];
        normalized[key] = isPlainObject(val)
          ? extend({ from: key }, val)
          : { from: val };
      }
    } else {
      warn(
        "Invalid value for option \"inject\": expected an Array or an Object, " +
        "but got " + (toRawType(inject)) + ".",
        vm
      );
    }
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives (options) {
    var dirs = options.directives;
    if (dirs) {
      for (var key in dirs) {
        var def$$1 = dirs[key];
        if (typeof def$$1 === 'function') {
          dirs[key] = { bind: def$$1, update: def$$1 };
        }
      }
    }
  }

  function assertObjectType (name, value, vm) {
    if (!isPlainObject(value)) {
      warn(
        "Invalid value for option \"" + name + "\": expected an Object, " +
        "but got " + (toRawType(value)) + ".",
        vm
      );
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions (
    parent,
    child,
    vm
  ) {
    {
      checkComponents(child);
    }

    if (typeof child === 'function') {
      child = child.options;
    }

    normalizeProps(child, vm);
    normalizeInject(child, vm);
    normalizeDirectives(child);

    // Apply extends and mixins on the child options,
    // but only if it is a raw options object that isn't
    // the result of another mergeOptions call.
    // Only merged options has the _base property.
    if (!child._base) {
      if (child.extends) {
        parent = mergeOptions(parent, child.extends, vm);
      }
      if (child.mixins) {
        for (var i = 0, l = child.mixins.length; i < l; i++) {
          parent = mergeOptions(parent, child.mixins[i], vm);
        }
      }
    }

    var options = {};
    var key;
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField (key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset (
    options,
    type,
    id,
    warnMissing
  ) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
      return
    }
    var assets = options[type];
    // check local registration variations first
    if (hasOwn(assets, id)) { return assets[id] }
    var camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
    var PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
    // fallback to prototype chain
    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    if (warnMissing && !res) {
      warn(
        'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
        options
      );
    }
    return res
  }

  /*  */



  function validateProp (
    key,
    propOptions,
    propsData,
    vm
  ) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // boolean casting
    var booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (value === '' || value === hyphenate(key)) {
        // only cast empty string / same name to boolean if
        // boolean has higher priority
        var stringIndex = getTypeIndex(String, prop.type);
        if (stringIndex < 0 || booleanIndex < stringIndex) {
          value = true;
        }
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      var prevShouldObserve = shouldObserve;
      toggleObserving(true);
      observe(value);
      toggleObserving(prevShouldObserve);
    }
    {
      assertProp(prop, key, value, vm, absent);
    }
    return value
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue (vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
      return undefined
    }
    var def = prop.default;
    // warn against non-factory defaults for Object & Array
    if (isObject(def)) {
      warn(
        'Invalid default value for prop "' + key + '": ' +
        'Props with type Object/Array must use a factory function ' +
        'to return the default value.',
        vm
      );
    }
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm && vm.$options.propsData &&
      vm.$options.propsData[key] === undefined &&
      vm._props[key] !== undefined
    ) {
      return vm._props[key]
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return typeof def === 'function' && getType(prop.type) !== 'Function'
      ? def.call(vm)
      : def
  }

  /**
   * Assert whether a prop is valid.
   */
  function assertProp (
    prop,
    name,
    value,
    vm,
    absent
  ) {
    if (prop.required && absent) {
      warn(
        'Missing required prop: "' + name + '"',
        vm
      );
      return
    }
    if (value == null && !prop.required) {
      return
    }
    var type = prop.type;
    var valid = !type || type === true;
    var expectedTypes = [];
    if (type) {
      if (!Array.isArray(type)) {
        type = [type];
      }
      for (var i = 0; i < type.length && !valid; i++) {
        var assertedType = assertType(value, type[i]);
        expectedTypes.push(assertedType.expectedType || '');
        valid = assertedType.valid;
      }
    }

    if (!valid) {
      warn(
        getInvalidTypeMessage(name, value, expectedTypes),
        vm
      );
      return
    }
    var validator = prop.validator;
    if (validator) {
      if (!validator(value)) {
        warn(
          'Invalid prop: custom validator check failed for prop "' + name + '".',
          vm
        );
      }
    }
  }

  var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

  function assertType (value, type) {
    var valid;
    var expectedType = getType(type);
    if (simpleCheckRE.test(expectedType)) {
      var t = typeof value;
      valid = t === expectedType.toLowerCase();
      // for primitive wrapper objects
      if (!valid && t === 'object') {
        valid = value instanceof type;
      }
    } else if (expectedType === 'Object') {
      valid = isPlainObject(value);
    } else if (expectedType === 'Array') {
      valid = Array.isArray(value);
    } else {
      valid = value instanceof type;
    }
    return {
      valid: valid,
      expectedType: expectedType
    }
  }

  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType (fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : ''
  }

  function isSameType (a, b) {
    return getType(a) === getType(b)
  }

  function getTypeIndex (type, expectedTypes) {
    if (!Array.isArray(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1
    }
    for (var i = 0, len = expectedTypes.length; i < len; i++) {
      if (isSameType(expectedTypes[i], type)) {
        return i
      }
    }
    return -1
  }

  function getInvalidTypeMessage (name, value, expectedTypes) {
    var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', '));
    var expectedType = expectedTypes[0];
    var receivedType = toRawType(value);
    var expectedValue = styleValue(value, expectedType);
    var receivedValue = styleValue(value, receivedType);
    // check if we need to specify expected value
    if (expectedTypes.length === 1 &&
        isExplicable(expectedType) &&
        !isBoolean(expectedType, receivedType)) {
      message += " with value " + expectedValue;
    }
    message += ", got " + receivedType + " ";
    // check if we need to specify received value
    if (isExplicable(receivedType)) {
      message += "with value " + receivedValue + ".";
    }
    return message
  }

  function styleValue (value, type) {
    if (type === 'String') {
      return ("\"" + value + "\"")
    } else if (type === 'Number') {
      return ("" + (Number(value)))
    } else {
      return ("" + value)
    }
  }

  function isExplicable (value) {
    var explicitTypes = ['string', 'number', 'boolean'];
    return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
  }

  function isBoolean () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
  }

  /*  */

  function handleError (err, vm, info) {
    // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
    // See: https://github.com/vuejs/vuex/issues/1505
    pushTarget();
    try {
      if (vm) {
        var cur = vm;
        while ((cur = cur.$parent)) {
          var hooks = cur.$options.errorCaptured;
          if (hooks) {
            for (var i = 0; i < hooks.length; i++) {
              try {
                var capture = hooks[i].call(cur, err, vm, info) === false;
                if (capture) { return }
              } catch (e) {
                globalHandleError(e, cur, 'errorCaptured hook');
              }
            }
          }
        }
      }
      globalHandleError(err, vm, info);
    } finally {
      popTarget();
    }
  }

  function invokeWithErrorHandling (
    handler,
    context,
    args,
    vm,
    info
  ) {
    var res;
    try {
      res = args ? handler.apply(context, args) : handler.call(context);
      if (res && !res._isVue && isPromise(res) && !res._handled) {
        res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
        // issue #9511
        // avoid catch triggering multiple times when nested calls
        res._handled = true;
      }
    } catch (e) {
      handleError(e, vm, info);
    }
    return res
  }

  function globalHandleError (err, vm, info) {
    if (config.errorHandler) {
      try {
        return config.errorHandler.call(null, err, vm, info)
      } catch (e) {
        // if the user intentionally throws the original error in the handler,
        // do not log it twice
        if (e !== err) {
          logError(e, null, 'config.errorHandler');
        }
      }
    }
    logError(err, vm, info);
  }

  function logError (err, vm, info) {
    {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if ((inBrowser || inWeex) && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }

  /*  */

  var isUsingMicroTask = false;

  var callbacks = [];
  var pending = false;

  function flushCallbacks () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // Here we have async deferring wrappers using microtasks.
  // In 2.5 we used (macro) tasks (in combination with microtasks).
  // However, it has subtle problems when state is changed right before repaint
  // (e.g. #6813, out-in transitions).
  // Also, using (macro) tasks in event handler would cause some weird behaviors
  // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
  // So we now use microtasks everywhere, again.
  // A major drawback of this tradeoff is that there are some scenarios
  // where microtasks have too high a priority and fire in between supposedly
  // sequential events (e.g. #4521, #6690, which have workarounds)
  // or even between bubbling of the same event (#6566).
  var timerFunc;

  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
      // In problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
    isUsingMicroTask = true;
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
    isUsingMicroTask = true;
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Technically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    timerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }

  function nextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }

  /*  */

  var mark;
  var measure;

  {
    var perf = inBrowser && window.performance;
    /* istanbul ignore if */
    if (
      perf &&
      perf.mark &&
      perf.measure &&
      perf.clearMarks &&
      perf.clearMeasures
    ) {
      mark = function (tag) { return perf.mark(tag); };
      measure = function (name, startTag, endTag) {
        perf.measure(name, startTag, endTag);
        perf.clearMarks(startTag);
        perf.clearMarks(endTag);
        // perf.clearMeasures(name)
      };
    }
  }

  /* not type checking this file because flow doesn't play well with Proxy */

  var initProxy;

  {
    var allowedGlobals = makeMap(
      'Infinity,undefined,NaN,isFinite,isNaN,' +
      'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
      'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
      'require' // for Webpack/Browserify
    );

    var warnNonPresent = function (target, key) {
      warn(
        "Property or method \"" + key + "\" is not defined on the instance but " +
        'referenced during render. Make sure that this property is reactive, ' +
        'either in the data option, or for class-based components, by ' +
        'initializing the property. ' +
        'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
        target
      );
    };

    var warnReservedPrefix = function (target, key) {
      warn(
        "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
        'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
        'prevent conflicts with Vue internals. ' +
        'See: https://vuejs.org/v2/api/#data',
        target
      );
    };

    var hasProxy =
      typeof Proxy !== 'undefined' && isNative(Proxy);

    if (hasProxy) {
      var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
      config.keyCodes = new Proxy(config.keyCodes, {
        set: function set (target, key, value) {
          if (isBuiltInModifier(key)) {
            warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
            return false
          } else {
            target[key] = value;
            return true
          }
        }
      });
    }

    var hasHandler = {
      has: function has (target, key) {
        var has = key in target;
        var isAllowed = allowedGlobals(key) ||
          (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
        if (!has && !isAllowed) {
          if (key in target.$data) { warnReservedPrefix(target, key); }
          else { warnNonPresent(target, key); }
        }
        return has || !isAllowed
      }
    };

    var getHandler = {
      get: function get (target, key) {
        if (typeof key === 'string' && !(key in target)) {
          if (key in target.$data) { warnReservedPrefix(target, key); }
          else { warnNonPresent(target, key); }
        }
        return target[key]
      }
    };

    initProxy = function initProxy (vm) {
      if (hasProxy) {
        // determine which proxy handler to use
        var options = vm.$options;
        var handlers = options.render && options.render._withStripped
          ? getHandler
          : hasHandler;
        vm._renderProxy = new Proxy(vm, handlers);
      } else {
        vm._renderProxy = vm;
      }
    };
  }

  /*  */

  var seenObjects = new _Set();

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  function traverse (val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
  }

  function _traverse (val, seen) {
    var i, keys;
    var isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
      return
    }
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return
      }
      seen.add(depId);
    }
    if (isA) {
      i = val.length;
      while (i--) { _traverse(val[i], seen); }
    } else {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) { _traverse(val[keys[i]], seen); }
    }
  }

  /*  */

  var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once$$1 ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
      name: name,
      once: once$$1,
      capture: capture,
      passive: passive
    }
  });

  function createFnInvoker (fns, vm) {
    function invoker () {
      var arguments$1 = arguments;

      var fns = invoker.fns;
      if (Array.isArray(fns)) {
        var cloned = fns.slice();
        for (var i = 0; i < cloned.length; i++) {
          invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
        }
      } else {
        // return handler return value for single handlers
        return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
      }
    }
    invoker.fns = fns;
    return invoker
  }

  function updateListeners (
    on,
    oldOn,
    add,
    remove$$1,
    createOnceHandler,
    vm
  ) {
    var name, def$$1, cur, old, event;
    for (name in on) {
      def$$1 = cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name);
      if (isUndef(cur)) {
        warn(
          "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
          vm
        );
      } else if (isUndef(old)) {
        if (isUndef(cur.fns)) {
          cur = on[name] = createFnInvoker(cur, vm);
        }
        if (isTrue(event.once)) {
          cur = on[name] = createOnceHandler(event.name, cur, event.capture);
        }
        add(event.name, cur, event.capture, event.passive, event.params);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    for (name in oldOn) {
      if (isUndef(on[name])) {
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture);
      }
    }
  }

  /*  */

  function mergeVNodeHook (def, hookKey, hook) {
    if (def instanceof VNode) {
      def = def.data.hook || (def.data.hook = {});
    }
    var invoker;
    var oldHook = def[hookKey];

    function wrappedHook () {
      hook.apply(this, arguments);
      // important: remove merged hook to ensure it's called only once
      // and prevent memory leak
      remove(invoker.fns, wrappedHook);
    }

    if (isUndef(oldHook)) {
      // no existing hook
      invoker = createFnInvoker([wrappedHook]);
    } else {
      /* istanbul ignore if */
      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
        // already a merged invoker
        invoker = oldHook;
        invoker.fns.push(wrappedHook);
      } else {
        // existing plain hook
        invoker = createFnInvoker([oldHook, wrappedHook]);
      }
    }

    invoker.merged = true;
    def[hookKey] = invoker;
  }

  /*  */

  function extractPropsFromVNodeData (
    data,
    Ctor,
    tag
  ) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
      return
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    if (isDef(attrs) || isDef(props)) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        {
          var keyInLowerCase = key.toLowerCase();
          if (
            key !== keyInLowerCase &&
            attrs && hasOwn(attrs, keyInLowerCase)
          ) {
            tip(
              "Prop \"" + keyInLowerCase + "\" is passed to component " +
              (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
              " \"" + key + "\". " +
              "Note that HTML attributes are case-insensitive and camelCased " +
              "props need to use their kebab-case equivalents when using in-DOM " +
              "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
            );
          }
        }
        checkProp(res, props, key, altKey, true) ||
        checkProp(res, attrs, key, altKey, false);
      }
    }
    return res
  }

  function checkProp (
    res,
    hash,
    key,
    altKey,
    preserve
  ) {
    if (isDef(hash)) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true
      }
    }
    return false
  }

  /*  */

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren (children) {
    for (var i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children)
      }
    }
    return children
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren (children) {
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : Array.isArray(children)
        ? normalizeArrayChildren(children)
        : undefined
  }

  function isTextNode (node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
  }

  function normalizeArrayChildren (children, nestedIndex) {
    var res = [];
    var i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
      c = children[i];
      if (isUndef(c) || typeof c === 'boolean') { continue }
      lastIndex = res.length - 1;
      last = res[lastIndex];
      //  nested
      if (Array.isArray(c)) {
        if (c.length > 0) {
          c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
          // merge adjacent text nodes
          if (isTextNode(c[0]) && isTextNode(last)) {
            res[lastIndex] = createTextVNode(last.text + (c[0]).text);
            c.shift();
          }
          res.push.apply(res, c);
        }
      } else if (isPrimitive(c)) {
        if (isTextNode(last)) {
          // merge adjacent text nodes
          // this is necessary for SSR hydration because text nodes are
          // essentially merged when rendered to HTML strings
          res[lastIndex] = createTextVNode(last.text + c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else {
        if (isTextNode(c) && isTextNode(last)) {
          // merge adjacent text nodes
          res[lastIndex] = createTextVNode(last.text + c.text);
        } else {
          // default key for nested array children (likely generated by v-for)
          if (isTrue(children._isVList) &&
            isDef(c.tag) &&
            isUndef(c.key) &&
            isDef(nestedIndex)) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }

  /*  */

  function initProvide (vm) {
    var provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function'
        ? provide.call(vm)
        : provide;
    }
  }

  function initInjections (vm) {
    var result = resolveInject(vm.$options.inject, vm);
    if (result) {
      toggleObserving(false);
      Object.keys(result).forEach(function (key) {
        /* istanbul ignore else */
        {
          defineReactive$$1(vm, key, result[key], function () {
            warn(
              "Avoid mutating an injected value directly since the changes will be " +
              "overwritten whenever the provided component re-renders. " +
              "injection being mutated: \"" + key + "\"",
              vm
            );
          });
        }
      });
      toggleObserving(true);
    }
  }

  function resolveInject (inject, vm) {
    if (inject) {
      // inject is :any because flow is not smart enough to figure out cached
      var result = Object.create(null);
      var keys = hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // #6574 in case the inject object is observed...
        if (key === '__ob__') { continue }
        var provideKey = inject[key].from;
        var source = vm;
        while (source) {
          if (source._provided && hasOwn(source._provided, provideKey)) {
            result[key] = source._provided[provideKey];
            break
          }
          source = source.$parent;
        }
        if (!source) {
          if ('default' in inject[key]) {
            var provideDefault = inject[key].default;
            result[key] = typeof provideDefault === 'function'
              ? provideDefault.call(vm)
              : provideDefault;
          } else {
            warn(("Injection \"" + key + "\" not found"), vm);
          }
        }
      }
      return result
    }
  }

  /*  */



  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots (
    children,
    context
  ) {
    if (!children || !children.length) {
      return {}
    }
    var slots = {};
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) &&
        data && data.slot != null
      ) {
        var name = data.slot;
        var slot = (slots[name] || (slots[name] = []));
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        (slots.default || (slots.default = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    for (var name$1 in slots) {
      if (slots[name$1].every(isWhitespace)) {
        delete slots[name$1];
      }
    }
    return slots
  }

  function isWhitespace (node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' '
  }

  /*  */

  function normalizeScopedSlots (
    slots,
    normalSlots,
    prevSlots
  ) {
    var res;
    var hasNormalSlots = Object.keys(normalSlots).length > 0;
    var isStable = slots ? !!slots.$stable : !hasNormalSlots;
    var key = slots && slots.$key;
    if (!slots) {
      res = {};
    } else if (slots._normalized) {
      // fast path 1: child component re-render only, parent did not change
      return slots._normalized
    } else if (
      isStable &&
      prevSlots &&
      prevSlots !== emptyObject &&
      key === prevSlots.$key &&
      !hasNormalSlots &&
      !prevSlots.$hasNormal
    ) {
      // fast path 2: stable scoped slots w/ no normal slots to proxy,
      // only need to normalize once
      return prevSlots
    } else {
      res = {};
      for (var key$1 in slots) {
        if (slots[key$1] && key$1[0] !== '$') {
          res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
        }
      }
    }
    // expose normal slots on scopedSlots
    for (var key$2 in normalSlots) {
      if (!(key$2 in res)) {
        res[key$2] = proxyNormalSlot(normalSlots, key$2);
      }
    }
    // avoriaz seems to mock a non-extensible $scopedSlots object
    // and when that is passed down this would cause an error
    if (slots && Object.isExtensible(slots)) {
      (slots)._normalized = res;
    }
    def(res, '$stable', isStable);
    def(res, '$key', key);
    def(res, '$hasNormal', hasNormalSlots);
    return res
  }

  function normalizeScopedSlot(normalSlots, key, fn) {
    var normalized = function () {
      var res = arguments.length ? fn.apply(null, arguments) : fn({});
      res = res && typeof res === 'object' && !Array.isArray(res)
        ? [res] // single vnode
        : normalizeChildren(res);
      return res && (
        res.length === 0 ||
        (res.length === 1 && res[0].isComment) // #9658
      ) ? undefined
        : res
    };
    // this is a slot using the new v-slot syntax without scope. although it is
    // compiled as a scoped slot, render fn users would expect it to be present
    // on this.$slots because the usage is semantically a normal slot.
    if (fn.proxy) {
      Object.defineProperty(normalSlots, key, {
        get: normalized,
        enumerable: true,
        configurable: true
      });
    }
    return normalized
  }

  function proxyNormalSlot(slots, key) {
    return function () { return slots[key]; }
  }

  /*  */

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      if (hasSymbol && val[Symbol.iterator]) {
        ret = [];
        var iterator = val[Symbol.iterator]();
        var result = iterator.next();
        while (!result.done) {
          ret.push(render(result.value, ret.length));
          result = iterator.next();
        }
      } else {
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          ret[i] = render(val[key], key, i);
        }
      }
    }
    if (!isDef(ret)) {
      ret = [];
    }
    (ret)._isVList = true;
    return ret
  }

  /*  */

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot (
    name,
    fallback,
    props,
    bindObject
  ) {
    var scopedSlotFn = this.$scopedSlots[name];
    var nodes;
    if (scopedSlotFn) { // scoped slot
      props = props || {};
      if (bindObject) {
        if (!isObject(bindObject)) {
          warn(
            'slot v-bind without argument expects an Object',
            this
          );
        }
        props = extend(extend({}, bindObject), props);
      }
      nodes = scopedSlotFn(props) || fallback;
    } else {
      nodes = this.$slots[name] || fallback;
    }

    var target = props && props.slot;
    if (target) {
      return this.$createElement('template', { slot: target }, nodes)
    } else {
      return nodes
    }
  }

  /*  */

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  }

  /*  */

  function isKeyNotMatch (expect, actual) {
    if (Array.isArray(expect)) {
      return expect.indexOf(actual) === -1
    } else {
      return expect !== actual
    }
  }

  /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */
  function checkKeyCodes (
    eventKeyCode,
    key,
    builtInKeyCode,
    eventKeyName,
    builtInKeyName
  ) {
    var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
      return isKeyNotMatch(builtInKeyName, eventKeyName)
    } else if (mappedKeyCode) {
      return isKeyNotMatch(mappedKeyCode, eventKeyCode)
    } else if (eventKeyName) {
      return hyphenate(eventKeyName) !== key
    }
  }

  /*  */

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps (
    data,
    tag,
    value,
    asProp,
    isSync
  ) {
    if (value) {
      if (!isObject(value)) {
        warn(
          'v-bind without argument expects an Object or Array value',
          this
        );
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        var hash;
        var loop = function ( key ) {
          if (
            key === 'class' ||
            key === 'style' ||
            isReservedAttribute(key)
          ) {
            hash = data;
          } else {
            var type = data.attrs && data.attrs.type;
            hash = asProp || config.mustUseProp(tag, type, key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
          }
          var camelizedKey = camelize(key);
          var hyphenatedKey = hyphenate(key);
          if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
            hash[key] = value[key];

            if (isSync) {
              var on = data.on || (data.on = {});
              on[("update:" + key)] = function ($event) {
                value[key] = $event;
              };
            }
          }
        };

        for (var key in value) loop( key );
      }
    }
    return data
  }

  /*  */

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic (
    index,
    isInFor
  ) {
    var cached = this._staticTrees || (this._staticTrees = []);
    var tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
      return tree
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(
      this._renderProxy,
      null,
      this // for render fns generated for functional component templates
    );
    markStatic(tree, ("__static__" + index), false);
    return tree
  }

  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce (
    tree,
    index,
    key
  ) {
    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
    return tree
  }

  function markStatic (
    tree,
    key,
    isOnce
  ) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], (key + "_" + i), isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode (node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  /*  */

  function bindObjectListeners (data, value) {
    if (value) {
      if (!isPlainObject(value)) {
        warn(
          'v-on without argument expects an Object value',
          this
        );
      } else {
        var on = data.on = data.on ? extend({}, data.on) : {};
        for (var key in value) {
          var existing = on[key];
          var ours = value[key];
          on[key] = existing ? [].concat(existing, ours) : ours;
        }
      }
    }
    return data
  }

  /*  */

  function resolveScopedSlots (
    fns, // see flow/vnode
    res,
    // the following are added in 2.6
    hasDynamicKeys,
    contentHashKey
  ) {
    res = res || { $stable: !hasDynamicKeys };
    for (var i = 0; i < fns.length; i++) {
      var slot = fns[i];
      if (Array.isArray(slot)) {
        resolveScopedSlots(slot, res, hasDynamicKeys);
      } else if (slot) {
        // marker for reverse proxying v-slot without scope on this.$slots
        if (slot.proxy) {
          slot.fn.proxy = true;
        }
        res[slot.key] = slot.fn;
      }
    }
    if (contentHashKey) {
      (res).$key = contentHashKey;
    }
    return res
  }

  /*  */

  function bindDynamicKeys (baseObj, values) {
    for (var i = 0; i < values.length; i += 2) {
      var key = values[i];
      if (typeof key === 'string' && key) {
        baseObj[values[i]] = values[i + 1];
      } else if (key !== '' && key !== null) {
        // null is a special value for explicitly removing a binding
        warn(
          ("Invalid value for dynamic directive argument (expected string or null): " + key),
          this
        );
      }
    }
    return baseObj
  }

  // helper to dynamically append modifier runtime markers to event names.
  // ensure only append when value is already string, otherwise it will be cast
  // to string and cause the type check to miss.
  function prependModifier (value, symbol) {
    return typeof value === 'string' ? symbol + value : value
  }

  /*  */

  function installRenderHelpers (target) {
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
  }

  /*  */

  function FunctionalRenderContext (
    data,
    props,
    children,
    parent,
    Ctor
  ) {
    var this$1 = this;

    var options = Ctor.options;
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    var contextVm;
    if (hasOwn(parent, '_uid')) {
      contextVm = Object.create(parent);
      // $flow-disable-line
      contextVm._original = parent;
    } else {
      // the context vm passed in is a functional context as well.
      // in this case we want to make sure we are able to get a hold to the
      // real context instance.
      contextVm = parent;
      // $flow-disable-line
      parent = parent._original;
    }
    var isCompiled = isTrue(options._compiled);
    var needNormalization = !isCompiled;

    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = function () {
      if (!this$1.$slots) {
        normalizeScopedSlots(
          data.scopedSlots,
          this$1.$slots = resolveSlots(children, parent)
        );
      }
      return this$1.$slots
    };

    Object.defineProperty(this, 'scopedSlots', ({
      enumerable: true,
      get: function get () {
        return normalizeScopedSlots(data.scopedSlots, this.slots())
      }
    }));

    // support for compiled functional template
    if (isCompiled) {
      // exposing $options for renderStatic()
      this.$options = options;
      // pre-resolve slots for renderSlot()
      this.$slots = this.slots();
      this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
    }

    if (options._scopeId) {
      this._c = function (a, b, c, d) {
        var vnode = createElement(contextVm, a, b, c, d, needNormalization);
        if (vnode && !Array.isArray(vnode)) {
          vnode.fnScopeId = options._scopeId;
          vnode.fnContext = parent;
        }
        return vnode
      };
    } else {
      this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
    }
  }

  installRenderHelpers(FunctionalRenderContext.prototype);

  function createFunctionalComponent (
    Ctor,
    propsData,
    data,
    contextVm,
    children
  ) {
    var options = Ctor.options;
    var props = {};
    var propOptions = options.props;
    if (isDef(propOptions)) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData || emptyObject);
      }
    } else {
      if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
      if (isDef(data.props)) { mergeProps(props, data.props); }
    }

    var renderContext = new FunctionalRenderContext(
      data,
      props,
      children,
      contextVm,
      Ctor
    );

    var vnode = options.render.call(null, renderContext._c, renderContext);

    if (vnode instanceof VNode) {
      return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
    } else if (Array.isArray(vnode)) {
      var vnodes = normalizeChildren(vnode) || [];
      var res = new Array(vnodes.length);
      for (var i = 0; i < vnodes.length; i++) {
        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
      }
      return res
    }
  }

  function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
    // #7817 clone node before setting fnContext, otherwise if the node is reused
    // (e.g. it was from a cached normal slot) the fnContext causes named slots
    // that should not be matched to match.
    var clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    {
      (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
    }
    if (data.slot) {
      (clone.data || (clone.data = {})).slot = data.slot;
    }
    return clone
  }

  function mergeProps (to, from) {
    for (var key in from) {
      to[camelize(key)] = from[key];
    }
  }

  /*  */

  /*  */

  /*  */

  /*  */

  // inline hooks to be invoked on component VNodes during patch
  var componentVNodeHooks = {
    init: function init (vnode, hydrating) {
      if (
        vnode.componentInstance &&
        !vnode.componentInstance._isDestroyed &&
        vnode.data.keepAlive
      ) {
        // kept-alive components, treat as a patch
        var mountedNode = vnode; // work around flow
        componentVNodeHooks.prepatch(mountedNode, mountedNode);
      } else {
        var child = vnode.componentInstance = createComponentInstanceForVnode(
          vnode,
          activeInstance
        );
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
      }
    },

    prepatch: function prepatch (oldVnode, vnode) {
      var options = vnode.componentOptions;
      var child = vnode.componentInstance = oldVnode.componentInstance;
      updateChildComponent(
        child,
        options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
      );
    },

    insert: function insert (vnode) {
      var context = vnode.context;
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isMounted) {
        componentInstance._isMounted = true;
        callHook(componentInstance, 'mounted');
      }
      if (vnode.data.keepAlive) {
        if (context._isMounted) {
          // vue-router#1212
          // During updates, a kept-alive component's child components may
          // change, so directly walking the tree here may call activated hooks
          // on incorrect children. Instead we push them into a queue which will
          // be processed after the whole patch process ended.
          queueActivatedComponent(componentInstance);
        } else {
          activateChildComponent(componentInstance, true /* direct */);
        }
      }
    },

    destroy: function destroy (vnode) {
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isDestroyed) {
        if (!vnode.data.keepAlive) {
          componentInstance.$destroy();
        } else {
          deactivateChildComponent(componentInstance, true /* direct */);
        }
      }
    }
  };

  var hooksToMerge = Object.keys(componentVNodeHooks);

  function createComponent (
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (isUndef(Ctor)) {
      return
    }

    var baseCtor = context.$options._base;

    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
      {
        warn(("Invalid Component definition: " + (String(Ctor))), context);
      }
      return
    }

    // async component
    var asyncFactory;
    if (isUndef(Ctor.cid)) {
      asyncFactory = Ctor;
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
      if (Ctor === undefined) {
        // return a placeholder node for async component, which is rendered
        // as a comment node but preserves all the raw information for the node.
        // the information will be used for async server-rendering and hydration.
        return createAsyncPlaceholder(
          asyncFactory,
          data,
          context,
          children,
          tag
        )
      }
    }

    data = data || {};

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    // transform component v-model data into props & events
    if (isDef(data.model)) {
      transformModel(Ctor.options, data);
    }

    // extract props
    var propsData = extractPropsFromVNodeData(data, Ctor, tag);

    // functional component
    if (isTrue(Ctor.options.functional)) {
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    if (isTrue(Ctor.options.abstract)) {
      // abstract components do not keep anything
      // other than props & listeners & slot

      // work around flow
      var slot = data.slot;
      data = {};
      if (slot) {
        data.slot = slot;
      }
    }

    // install component management hooks onto the placeholder node
    installComponentHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
      data, undefined, undefined, undefined, context,
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
      asyncFactory
    );

    return vnode
  }

  function createComponentInstanceForVnode (
    vnode, // we know it's MountedComponentVNode but flow doesn't
    parent // activeInstance in lifecycle state
  ) {
    var options = {
      _isComponent: true,
      _parentVnode: vnode,
      parent: parent
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options)
  }

  function installComponentHooks (data) {
    var hooks = data.hook || (data.hook = {});
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      var existing = hooks[key];
      var toMerge = componentVNodeHooks[key];
      if (existing !== toMerge && !(existing && existing._merged)) {
        hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
      }
    }
  }

  function mergeHook$1 (f1, f2) {
    var merged = function (a, b) {
      // flow complains about extra args which is why we use any
      f1(a, b);
      f2(a, b);
    };
    merged._merged = true;
    return merged
  }

  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel (options, data) {
    var prop = (options.model && options.model.prop) || 'value';
    var event = (options.model && options.model.event) || 'input'
    ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    var existing = on[event];
    var callback = data.model.callback;
    if (isDef(existing)) {
      if (
        Array.isArray(existing)
          ? existing.indexOf(callback) === -1
          : existing !== callback
      ) {
        on[event] = [callback].concat(existing);
      }
    } else {
      on[event] = callback;
    }
  }

  /*  */

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement (
    context,
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize
  ) {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children;
      children = data;
      data = undefined;
    }
    if (isTrue(alwaysNormalize)) {
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType)
  }

  function _createElement (
    context,
    tag,
    data,
    children,
    normalizationType
  ) {
    if (isDef(data) && isDef((data).__ob__)) {
      warn(
        "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
        'Always create fresh vnode data objects in each render!',
        context
      );
      return createEmptyVNode()
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
      tag = data.is;
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return createEmptyVNode()
    }
    // warn against non-primitive key
    if (isDef(data) && isDef(data.key) && !isPrimitive(data.key)
    ) {
      {
        warn(
          'Avoid using non-primitive value as key, ' +
          'use string/number value instead.',
          context
        );
      }
    }
    // support single function children as default scoped slot
    if (Array.isArray(children) &&
      typeof children[0] === 'function'
    ) {
      data = data || {};
      data.scopedSlots = { default: children[0] };
      children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
      children = normalizeChildren(children);
    } else if (normalizationType === SIMPLE_NORMALIZE) {
      children = simpleNormalizeChildren(children);
    }
    var vnode, ns;
    if (typeof tag === 'string') {
      var Ctor;
      ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        // platform built-in elements
        if (isDef(data) && isDef(data.nativeOn)) {
          warn(
            ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
            context
          );
        }
        vnode = new VNode(
          config.parsePlatformTagName(tag), data, children,
          undefined, undefined, context
        );
      } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
        // component
        vnode = createComponent(Ctor, data, context, children, tag);
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        vnode = new VNode(
          tag, data, children,
          undefined, undefined, context
        );
      }
    } else {
      // direct component options / constructor
      vnode = createComponent(tag, data, context, children);
    }
    if (Array.isArray(vnode)) {
      return vnode
    } else if (isDef(vnode)) {
      if (isDef(ns)) { applyNS(vnode, ns); }
      if (isDef(data)) { registerDeepBindings(data); }
      return vnode
    } else {
      return createEmptyVNode()
    }
  }

  function applyNS (vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
      // use default namespace inside foreignObject
      ns = undefined;
      force = true;
    }
    if (isDef(vnode.children)) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        var child = vnode.children[i];
        if (isDef(child.tag) && (
          isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
          applyNS(child, ns, force);
        }
      }
    }
  }

  // ref #5318
  // necessary to ensure parent re-render when deep bindings like :style and
  // :class are used on slot nodes
  function registerDeepBindings (data) {
    if (isObject(data.style)) {
      traverse(data.style);
    }
    if (isObject(data.class)) {
      traverse(data.class);
    }
  }

  /*  */

  function initRender (vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    var options = vm.$options;
    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data;

    /* istanbul ignore else */
    {
      defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
        !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
      }, true);
      defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
        !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
      }, true);
    }
  }

  var currentRenderingInstance = null;

  function renderMixin (Vue) {
    // install runtime convenience helpers
    installRenderHelpers(Vue.prototype);

    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this)
    };

    Vue.prototype._render = function () {
      var vm = this;
      var ref = vm.$options;
      var render = ref.render;
      var _parentVnode = ref._parentVnode;

      if (_parentVnode) {
        vm.$scopedSlots = normalizeScopedSlots(
          _parentVnode.data.scopedSlots,
          vm.$slots,
          vm.$scopedSlots
        );
      }

      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      var vnode;
      try {
        // There's no need to maintain a stack because all render fns are called
        // separately from one another. Nested component's render fns are called
        // when parent component is patched.
        currentRenderingInstance = vm;
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        handleError(e, vm, "render");
        // return error render result,
        // or previous vnode to prevent render error causing blank component
        /* istanbul ignore else */
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } finally {
        currentRenderingInstance = null;
      }
      // if the returned array contains only a single node, allow it
      if (Array.isArray(vnode) && vnode.length === 1) {
        vnode = vnode[0];
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        if (Array.isArray(vnode)) {
          warn(
            'Multiple root nodes returned from render function. Render function ' +
            'should return a single root node.',
            vm
          );
        }
        vnode = createEmptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode
    };
  }

  /*  */

  function ensureCtor (comp, base) {
    if (
      comp.__esModule ||
      (hasSymbol && comp[Symbol.toStringTag] === 'Module')
    ) {
      comp = comp.default;
    }
    return isObject(comp)
      ? base.extend(comp)
      : comp
  }

  function createAsyncPlaceholder (
    factory,
    data,
    context,
    children,
    tag
  ) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
    return node
  }

  function resolveAsyncComponent (
    factory,
    baseCtor
  ) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
      return factory.errorComp
    }

    if (isDef(factory.resolved)) {
      return factory.resolved
    }

    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
      // already pending
      factory.owners.push(owner);
    }

    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
      return factory.loadingComp
    }

    if (owner && !isDef(factory.owners)) {
      var owners = factory.owners = [owner];
      var sync = true;
      var timerLoading = null;
      var timerTimeout = null

      ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

      var forceRender = function (renderCompleted) {
        for (var i = 0, l = owners.length; i < l; i++) {
          (owners[i]).$forceUpdate();
        }

        if (renderCompleted) {
          owners.length = 0;
          if (timerLoading !== null) {
            clearTimeout(timerLoading);
            timerLoading = null;
          }
          if (timerTimeout !== null) {
            clearTimeout(timerTimeout);
            timerTimeout = null;
          }
        }
      };

      var resolve = once(function (res) {
        // cache resolved
        factory.resolved = ensureCtor(res, baseCtor);
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          forceRender(true);
        } else {
          owners.length = 0;
        }
      });

      var reject = once(function (reason) {
        warn(
          "Failed to resolve async component: " + (String(factory)) +
          (reason ? ("\nReason: " + reason) : '')
        );
        if (isDef(factory.errorComp)) {
          factory.error = true;
          forceRender(true);
        }
      });

      var res = factory(resolve, reject);

      if (isObject(res)) {
        if (isPromise(res)) {
          // () => Promise
          if (isUndef(factory.resolved)) {
            res.then(resolve, reject);
          }
        } else if (isPromise(res.component)) {
          res.component.then(resolve, reject);

          if (isDef(res.error)) {
            factory.errorComp = ensureCtor(res.error, baseCtor);
          }

          if (isDef(res.loading)) {
            factory.loadingComp = ensureCtor(res.loading, baseCtor);
            if (res.delay === 0) {
              factory.loading = true;
            } else {
              timerLoading = setTimeout(function () {
                timerLoading = null;
                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                  factory.loading = true;
                  forceRender(false);
                }
              }, res.delay || 200);
            }
          }

          if (isDef(res.timeout)) {
            timerTimeout = setTimeout(function () {
              timerTimeout = null;
              if (isUndef(factory.resolved)) {
                reject(
                  "timeout (" + (res.timeout) + "ms)"
                );
              }
            }, res.timeout);
          }
        }
      }

      sync = false;
      // return in case resolved synchronously
      return factory.loading
        ? factory.loadingComp
        : factory.resolved
    }
  }

  /*  */

  function isAsyncPlaceholder (node) {
    return node.isComment && node.asyncFactory
  }

  /*  */

  function getFirstComponentChild (children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
          return c
        }
      }
    }
  }

  /*  */

  /*  */

  function initEvents (vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }

  var target;

  function add (event, fn) {
    target.$on(event, fn);
  }

  function remove$1 (event, fn) {
    target.$off(event, fn);
  }

  function createOnceHandler (event, fn) {
    var _target = target;
    return function onceHandler () {
      var res = fn.apply(null, arguments);
      if (res !== null) {
        _target.$off(event, onceHandler);
      }
    }
  }

  function updateComponentListeners (
    vm,
    listeners,
    oldListeners
  ) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
    target = undefined;
  }

  function eventsMixin (Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          vm.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on () {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm
    };

    Vue.prototype.$off = function (event, fn) {
      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm
      }
      // array of events
      if (Array.isArray(event)) {
        for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
          vm.$off(event[i$1], fn);
        }
        return vm
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm
      }
      if (!fn) {
        vm._events[event] = null;
        return vm
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break
        }
      }
      return vm
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      {
        var lowerCaseEvent = event.toLowerCase();
        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
          tip(
            "Event \"" + lowerCaseEvent + "\" is emitted in component " +
            (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
            "Note that HTML attributes are case-insensitive and you cannot use " +
            "v-on to listen to camelCase events when using in-DOM templates. " +
            "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
          );
        }
      }
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        var info = "event handler for \"" + event + "\"";
        for (var i = 0, l = cbs.length; i < l; i++) {
          invokeWithErrorHandling(cbs[i], vm, args, vm, info);
        }
      }
      return vm
    };
  }

  /*  */

  var activeInstance = null;
  var isUpdatingChildComponent = false;

  function setActiveInstance(vm) {
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    return function () {
      activeInstance = prevActiveInstance;
    }
  }

  function initLifecycle (vm) {
    var options = vm.$options;

    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
      var vm = this;
      var prevEl = vm.$el;
      var prevVnode = vm._vnode;
      var restoreActiveInstance = setActiveInstance(vm);
      vm._vnode = vnode;
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      if (!prevVnode) {
        // initial render
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
      } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      restoreActiveInstance();
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      // updated hook is called by the scheduler to ensure that children are
      // updated in a parent's updated hook.
    };

    Vue.prototype.$forceUpdate = function () {
      var vm = this;
      if (vm._watcher) {
        vm._watcher.update();
      }
    };

    Vue.prototype.$destroy = function () {
      var vm = this;
      if (vm._isBeingDestroyed) {
        return
      }
      callHook(vm, 'beforeDestroy');
      vm._isBeingDestroyed = true;
      // remove self from parent
      var parent = vm.$parent;
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm);
      }
      // teardown watchers
      if (vm._watcher) {
        vm._watcher.teardown();
      }
      var i = vm._watchers.length;
      while (i--) {
        vm._watchers[i].teardown();
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
      }
      // call the last hook...
      vm._isDestroyed = true;
      // invoke destroy hooks on current rendered tree
      vm.__patch__(vm._vnode, null);
      // fire destroyed hook
      callHook(vm, 'destroyed');
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
      // release circular reference (#6759)
      if (vm.$vnode) {
        vm.$vnode.parent = null;
      }
    };
  }

  function mountComponent (
    vm,
    el,
    hydrating
  ) {
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
      {
        /* istanbul ignore if */
        if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
          vm.$options.el || el) {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          );
        } else {
          warn(
            'Failed to mount component: template or render function not defined.',
            vm
          );
        }
      }
    }
    callHook(vm, 'beforeMount');

    var updateComponent;
    /* istanbul ignore if */
    if (config.performance && mark) {
      updateComponent = function () {
        var name = vm._name;
        var id = vm._uid;
        var startTag = "vue-perf-start:" + id;
        var endTag = "vue-perf-end:" + id;

        mark(startTag);
        var vnode = vm._render();
        mark(endTag);
        measure(("vue " + name + " render"), startTag, endTag);

        mark(startTag);
        vm._update(vnode, hydrating);
        mark(endTag);
        measure(("vue " + name + " patch"), startTag, endTag);
      };
    } else {
      updateComponent = function () {
        vm._update(vm._render(), hydrating);
      };
    }

    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(vm, updateComponent, noop, {
      before: function before () {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      }
    }, true /* isRenderWatcher */);
    hydrating = false;

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  }

  function updateChildComponent (
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    {
      isUpdatingChildComponent = true;
    }

    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren.

    // check if there are dynamic scopedSlots (hand-written or compiled but with
    // dynamic slot names). Static scoped slots compiled from template has the
    // "$stable" marker.
    var newScopedSlots = parentVnode.data.scopedSlots;
    var oldScopedSlots = vm.$scopedSlots;
    var hasDynamicScopedSlot = !!(
      (newScopedSlots && !newScopedSlots.$stable) ||
      (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
      (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
    );

    // Any static slot children from the parent may have changed during parent's
    // update. Dynamic scoped slots may also have changed. In such cases, a forced
    // update is necessary to ensure correctness.
    var needsForceUpdate = !!(
      renderChildren ||               // has new static slots
      vm.$options._renderChildren ||  // has old static slots
      hasDynamicScopedSlot
    );

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render

    if (vm._vnode) { // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;

    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    vm.$attrs = parentVnode.data.attrs || emptyObject;
    vm.$listeners = listeners || emptyObject;

    // update props
    if (propsData && vm.$options.props) {
      toggleObserving(false);
      var props = vm._props;
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        var propOptions = vm.$options.props; // wtf flow?
        props[key] = validateProp(key, propOptions, propsData, vm);
      }
      toggleObserving(true);
      // keep a copy of raw propsData
      vm.$options.propsData = propsData;
    }

    // update listeners
    listeners = listeners || emptyObject;
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);

    // resolve slots + force update if has children
    if (needsForceUpdate) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }

    {
      isUpdatingChildComponent = false;
    }
  }

  function isInInactiveTree (vm) {
    while (vm && (vm = vm.$parent)) {
      if (vm._inactive) { return true }
    }
    return false
  }

  function activateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = false;
      if (isInInactiveTree(vm)) {
        return
      }
    } else if (vm._directInactive) {
      return
    }
    if (vm._inactive || vm._inactive === null) {
      vm._inactive = false;
      for (var i = 0; i < vm.$children.length; i++) {
        activateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'activated');
    }
  }

  function deactivateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = true;
      if (isInInactiveTree(vm)) {
        return
      }
    }
    if (!vm._inactive) {
      vm._inactive = true;
      for (var i = 0; i < vm.$children.length; i++) {
        deactivateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'deactivated');
    }
  }

  function callHook (vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
  }

  /*  */

  var MAX_UPDATE_COUNT = 100;

  var queue = [];
  var activatedChildren = [];
  var has = {};
  var circular = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState () {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    {
      circular = {};
    }
    waiting = flushing = false;
  }

  // Async edge case #6566 requires saving the timestamp when event listeners are
  // attached. However, calling performance.now() has a perf overhead especially
  // if the page has thousands of event listeners. Instead, we take a timestamp
  // every time the scheduler flushes and use that for all event listeners
  // attached during that flush.
  var currentFlushTimestamp = 0;

  // Async edge case fix requires storing an event listener's attach timestamp.
  var getNow = Date.now;

  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  // All IE versions use low-res event timestamps, and have problematic clock
  // implementations (#9632)
  if (inBrowser && !isIE) {
    var performance = window.performance;
    if (
      performance &&
      typeof performance.now === 'function' &&
      getNow() > document.createEvent('Event').timeStamp
    ) {
      // if the event timestamp, although evaluated AFTER the Date.now(), is
      // smaller than it, it means the event is using a hi-res timestamp,
      // and we need to use the hi-res version for event listener timestamps as
      // well.
      getNow = function () { return performance.now(); };
    }
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue () {
    currentFlushTimestamp = getNow();
    flushing = true;
    var watcher, id;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(function (a, b) { return a.id - b.id; });

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index];
      if (watcher.before) {
        watcher.before();
      }
      id = watcher.id;
      has[id] = null;
      watcher.run();
      // in dev build, check and stop circular updates.
      if (has[id] != null) {
        circular[id] = (circular[id] || 0) + 1;
        if (circular[id] > MAX_UPDATE_COUNT) {
          warn(
            'You may have an infinite update loop ' + (
              watcher.user
                ? ("in watcher with expression \"" + (watcher.expression) + "\"")
                : "in a component render function."
            ),
            watcher.vm
          );
          break
        }
      }
    }

    // keep copies of post queues before resetting state
    var activatedQueue = activatedChildren.slice();
    var updatedQueue = queue.slice();

    resetSchedulerState();

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
  }

  function callUpdatedHooks (queue) {
    var i = queue.length;
    while (i--) {
      var watcher = queue[i];
      var vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'updated');
      }
    }
  }

  /**
   * Queue a kept-alive component that was activated during patch.
   * The queue will be processed after the entire tree has been patched.
   */
  function queueActivatedComponent (vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
  }

  function callActivatedHooks (queue) {
    for (var i = 0; i < queue.length; i++) {
      queue[i]._inactive = true;
      activateChildComponent(queue[i], true /* true */);
    }
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher (watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;

        if (!config.async) {
          flushSchedulerQueue();
          return
        }
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */



  var uid$2 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher (
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$2; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression = expOrFn.toString();
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
        warn(
          "Failed watching path: \"" + expOrFn + "\" " +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        );
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get();
  };

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get () {
    pushTarget(this);
    var value;
    var vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var i = this.deps.length;
    while (i--) {
      var dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  Watcher.prototype.run = function run () {
    if (this.active) {
      var value = this.get();
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  Watcher.prototype.evaluate = function evaluate () {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend () {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list.
   */
  Watcher.prototype.teardown = function teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
    }
  };

  /*  */

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function initState (vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }

  function initProps (vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
      toggleObserving(false);
    }
    var loop = function ( key ) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
        var hyphenatedKey = hyphenate(key);
        if (isReservedAttribute(hyphenatedKey) ||
            config.isReservedAttr(hyphenatedKey)) {
          warn(
            ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
            vm
          );
        }
        defineReactive$$1(props, key, value, function () {
          if (!isRoot && !isUpdatingChildComponent) {
            warn(
              "Avoid mutating a prop directly since the value will be " +
              "overwritten whenever the parent component re-renders. " +
              "Instead, use a data or computed property based on the prop's " +
              "value. Prop being mutated: \"" + key + "\"",
              vm
            );
          }
        });
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    };

    for (var key in propsOptions) loop( key );
    toggleObserving(true);
  }

  function initData (vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
      warn(
        'data functions should return an object:\n' +
        'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        vm
      );
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      {
        if (methods && hasOwn(methods, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a data property."),
            vm
          );
        }
      }
      if (props && hasOwn(props, key)) {
        warn(
          "The data property \"" + key + "\" is already declared as a prop. " +
          "Use prop default value instead.",
          vm
        );
      } else if (!isReserved(key)) {
        proxy(vm, "_data", key);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }

  function getData (data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, "data()");
      return {}
    } finally {
      popTarget();
    }
  }

  var computedWatcherOptions = { lazy: true };

  function initComputed (vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      if (getter == null) {
        warn(
          ("Getter is missing for computed property \"" + key + "\"."),
          vm
        );
      }

      if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      } else {
        if (key in vm.$data) {
          warn(("The computed property \"" + key + "\" is already defined in data."), vm);
        } else if (vm.$options.props && key in vm.$options.props) {
          warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
        }
      }
    }
  }

  function defineComputed (
    target,
    key,
    userDef
  ) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : createGetterInvoker(userDef);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : createGetterInvoker(userDef.get)
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
        warn(
          ("Computed property \"" + key + "\" was assigned to but it has no setter."),
          this
        );
      };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter (key) {
    return function computedGetter () {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }

  function createGetterInvoker(fn) {
    return function computedGetter () {
      return fn.call(this, this)
    }
  }

  function initMethods (vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      {
        if (typeof methods[key] !== 'function') {
          warn(
            "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
            "Did you reference the function correctly?",
            vm
          );
        }
        if (props && hasOwn(props, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a prop."),
            vm
          );
        }
        if ((key in vm) && isReserved(key)) {
          warn(
            "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
            "Avoid defining component methods that start with _ or $."
          );
        }
      }
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
  }

  function initWatch (vm, watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher (
    vm,
    expOrFn,
    handler,
    options
  ) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options)
  }

  function stateMixin (Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () { return this._data };
    var propsDef = {};
    propsDef.get = function () { return this._props };
    {
      dataDef.set = function () {
        warn(
          'Avoid replacing instance root $data. ' +
          'Use nested data properties instead.',
          this
        );
      };
      propsDef.set = function () {
        warn("$props is readonly.", this);
      };
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (
      expOrFn,
      cb,
      options
    ) {
      var vm = this;
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
      }
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        try {
          cb.call(vm, watcher.value);
        } catch (error) {
          handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
        }
      }
      return function unwatchFn () {
        watcher.teardown();
      }
    };
  }

  /*  */

  var uid$3 = 0;

  function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid$3++;

      var startTag, endTag;
      /* istanbul ignore if */
      if (config.performance && mark) {
        startTag = "vue-perf-start:" + (vm._uid);
        endTag = "vue-perf-end:" + (vm._uid);
        mark(startTag);
      }

      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
      }
      /* istanbul ignore else */
      {
        initProxy(vm);
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initInjections(vm); // resolve injections before data/props
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created');

      /* istanbul ignore if */
      if (config.performance && mark) {
        vm._name = formatComponentName(vm, false);
        mark(endTag);
        measure(("vue " + (vm._name) + " init"), startTag, endTag);
      }

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  function initInternalComponent (vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;

    var vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;

    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions (Ctor) {
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = resolveConstructorOptions(Ctor.super);
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions;
        // check if there are any late-modified/attached options (#4976)
        var modifiedOptions = resolveModifiedOptions(Ctor);
        // update base extend options
        if (modifiedOptions) {
          extend(Ctor.extendOptions, modifiedOptions);
        }
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options
  }

  function resolveModifiedOptions (Ctor) {
    var modified;
    var latest = Ctor.options;
    var sealed = Ctor.sealedOptions;
    for (var key in latest) {
      if (latest[key] !== sealed[key]) {
        if (!modified) { modified = {}; }
        modified[key] = latest[key];
      }
    }
    return modified
  }

  function Vue (options) {
    if (!(this instanceof Vue)
    ) {
      warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
  }

  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  /*  */

  function initUse (Vue) {
    Vue.use = function (plugin) {
      var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }

      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this
    };
  }

  /*  */

  function initMixin$1 (Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this
    };
  }

  /*  */

  function initExtend (Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var SuperId = Super.cid;
      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
      if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId]
      }

      var name = extendOptions.name || Super.options.name;
      if (name) {
        validateComponentName(name);
      }

      var Sub = function VueComponent (options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(
        Super.options,
        extendOptions
      );
      Sub['super'] = Super;

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }

      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;
      return Sub
    };
  }

  function initProps$1 (Comp) {
    var props = Comp.options.props;
    for (var key in props) {
      proxy(Comp.prototype, "_props", key);
    }
  }

  function initComputed$1 (Comp) {
    var computed = Comp.options.computed;
    for (var key in computed) {
      defineComputed(Comp.prototype, key, computed[key]);
    }
  }

  /*  */

  function initAssetRegisters (Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (
        id,
        definition
      ) {
        if (!definition) {
          return this.options[type + 's'][id]
        } else {
          /* istanbul ignore if */
          if (type === 'component') {
            validateComponentName(id);
          }
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = this.options._base.extend(definition);
          }
          if (type === 'directive' && typeof definition === 'function') {
            definition = { bind: definition, update: definition };
          }
          this.options[type + 's'][id] = definition;
          return definition
        }
      };
    });
  }

  /*  */



  function getComponentName (opts) {
    return opts && (opts.Ctor.options.name || opts.tag)
  }

  function matches (pattern, name) {
    if (Array.isArray(pattern)) {
      return pattern.indexOf(name) > -1
    } else if (typeof pattern === 'string') {
      return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
      return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
  }

  function pruneCache (keepAliveInstance, filter) {
    var cache = keepAliveInstance.cache;
    var keys = keepAliveInstance.keys;
    var _vnode = keepAliveInstance._vnode;
    for (var key in cache) {
      var cachedNode = cache[key];
      if (cachedNode) {
        var name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) {
          pruneCacheEntry(cache, key, keys, _vnode);
        }
      }
    }
  }

  function pruneCacheEntry (
    cache,
    key,
    keys,
    current
  ) {
    var cached$$1 = cache[key];
    if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
      cached$$1.componentInstance.$destroy();
    }
    cache[key] = null;
    remove(keys, key);
  }

  var patternTypes = [String, RegExp, Array];

  var KeepAlive = {
    name: 'keep-alive',
    abstract: true,

    props: {
      include: patternTypes,
      exclude: patternTypes,
      max: [String, Number]
    },

    created: function created () {
      this.cache = Object.create(null);
      this.keys = [];
    },

    destroyed: function destroyed () {
      for (var key in this.cache) {
        pruneCacheEntry(this.cache, key, this.keys);
      }
    },

    mounted: function mounted () {
      var this$1 = this;

      this.$watch('include', function (val) {
        pruneCache(this$1, function (name) { return matches(val, name); });
      });
      this.$watch('exclude', function (val) {
        pruneCache(this$1, function (name) { return !matches(val, name); });
      });
    },

    render: function render () {
      var slot = this.$slots.default;
      var vnode = getFirstComponentChild(slot);
      var componentOptions = vnode && vnode.componentOptions;
      if (componentOptions) {
        // check pattern
        var name = getComponentName(componentOptions);
        var ref = this;
        var include = ref.include;
        var exclude = ref.exclude;
        if (
          // not included
          (include && (!name || !matches(include, name))) ||
          // excluded
          (exclude && name && matches(exclude, name))
        ) {
          return vnode
        }

        var ref$1 = this;
        var cache = ref$1.cache;
        var keys = ref$1.keys;
        var key = vnode.key == null
          // same constructor may get registered as different local components
          // so cid alone is not enough (#3269)
          ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
          : vnode.key;
        if (cache[key]) {
          vnode.componentInstance = cache[key].componentInstance;
          // make current key freshest
          remove(keys, key);
          keys.push(key);
        } else {
          cache[key] = vnode;
          keys.push(key);
          // prune oldest entry
          if (this.max && keys.length > parseInt(this.max)) {
            pruneCacheEntry(cache, keys[0], keys, this._vnode);
          }
        }

        vnode.data.keepAlive = true;
      }
      return vnode || (slot && slot[0])
    }
  };

  var builtInComponents = {
    KeepAlive: KeepAlive
  };

  /*  */

  function initGlobalAPI (Vue) {
    // config
    var configDef = {};
    configDef.get = function () { return config; };
    {
      configDef.set = function () {
        warn(
          'Do not replace the Vue.config object, set individual fields instead.'
        );
      };
    }
    Object.defineProperty(Vue, 'config', configDef);

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
      warn: warn,
      extend: extend,
      mergeOptions: mergeOptions,
      defineReactive: defineReactive$$1
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    // 2.6 explicit observable API
    Vue.observable = function (obj) {
      observe(obj);
      return obj
    };

    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;

    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue);

  Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
  });

  Object.defineProperty(Vue.prototype, '$ssrContext', {
    get: function get () {
      /* istanbul ignore next */
      return this.$vnode && this.$vnode.ssrContext
    }
  });

  // expose FunctionalRenderContext for ssr runtime helper installation
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
  });

  Vue.version = '2.6.11';

  /*  */

  // these are reserved for web because they are directly compiled away
  // during template compilation
  var isReservedAttr = makeMap('style,class');

  // attributes that should be using props for binding
  var acceptValue = makeMap('input,textarea,option,select,progress');
  var mustUseProp = function (tag, type, attr) {
    return (
      (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
      (attr === 'selected' && tag === 'option') ||
      (attr === 'checked' && tag === 'input') ||
      (attr === 'muted' && tag === 'video')
    )
  };

  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

  var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

  var convertEnumeratedValue = function (key, value) {
    return isFalsyAttrValue(value) || value === 'false'
      ? 'false'
      // allow arbitrary string value for contenteditable
      : key === 'contenteditable' && isValidContentEditableValue(value)
        ? value
        : 'true'
  };

  var isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,translate,' +
    'truespeed,typemustmatch,visible'
  );

  var xlinkNS = 'http://www.w3.org/1999/xlink';

  var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
  };

  var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : ''
  };

  var isFalsyAttrValue = function (val) {
    return val == null || val === false
  };

  /*  */

  function genClassForVnode (vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (isDef(childNode.componentInstance)) {
      childNode = childNode.componentInstance._vnode;
      if (childNode && childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while (isDef(parentNode = parentNode.parent)) {
      if (parentNode && parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return renderClass(data.staticClass, data.class)
  }

  function mergeClassData (child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: isDef(child.class)
        ? [child.class, parent.class]
        : parent.class
    }
  }

  function renderClass (
    staticClass,
    dynamicClass
  ) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
      return concat(staticClass, stringifyClass(dynamicClass))
    }
    /* istanbul ignore next */
    return ''
  }

  function concat (a, b) {
    return a ? b ? (a + ' ' + b) : a : (b || '')
  }

  function stringifyClass (value) {
    if (Array.isArray(value)) {
      return stringifyArray(value)
    }
    if (isObject(value)) {
      return stringifyObject(value)
    }
    if (typeof value === 'string') {
      return value
    }
    /* istanbul ignore next */
    return ''
  }

  function stringifyArray (value) {
    var res = '';
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
        if (res) { res += ' '; }
        res += stringified;
      }
    }
    return res
  }

  function stringifyObject (value) {
    var res = '';
    for (var key in value) {
      if (value[key]) {
        if (res) { res += ' '; }
        res += key;
      }
    }
    return res
  }

  /*  */

  var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
  };

  var isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
  );

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  );

  var isPreTag = function (tag) { return tag === 'pre'; };

  var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag)
  };

  function getTagNamespace (tag) {
    if (isSVG(tag)) {
      return 'svg'
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
      return 'math'
    }
  }

  var unknownElementCache = Object.create(null);
  function isUnknownElement (tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
      return true
    }
    if (isReservedTag(tag)) {
      return false
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
      return unknownElementCache[tag]
    }
    var el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return (unknownElementCache[tag] = (
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement
      ))
    } else {
      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
    }
  }

  var isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query (el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);
      if (!selected) {
        warn(
          'Cannot find element: ' + el
        );
        return document.createElement('div')
      }
      return selected
    } else {
      return el
    }
  }

  /*  */

  function createElement$1 (tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') {
      return elm
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
      elm.setAttribute('multiple', 'multiple');
    }
    return elm
  }

  function createElementNS (namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
  }

  function createTextNode (text) {
    return document.createTextNode(text)
  }

  function createComment (text) {
    return document.createComment(text)
  }

  function insertBefore (parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild (node, child) {
    node.removeChild(child);
  }

  function appendChild (node, child) {
    node.appendChild(child);
  }

  function parentNode (node) {
    return node.parentNode
  }

  function nextSibling (node) {
    return node.nextSibling
  }

  function tagName (node) {
    return node.tagName
  }

  function setTextContent (node, text) {
    node.textContent = text;
  }

  function setStyleScope (node, scopeId) {
    node.setAttribute(scopeId, '');
  }

  var nodeOps = /*#__PURE__*/Object.freeze({
    createElement: createElement$1,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setStyleScope: setStyleScope
  });

  /*  */

  var ref = {
    create: function create (_, vnode) {
      registerRef(vnode);
    },
    update: function update (oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy (vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef (vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!isDef(key)) { return }

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          // $flow-disable-line
          refs[key].push(ref);
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  var emptyNode = new VNode('', {}, []);

  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

  function sameVnode (a, b) {
    return (
      a.key === b.key && (
        (
          a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef(a.data) === isDef(b.data) &&
          sameInputType(a, b)
        ) || (
          isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)
        )
      )
    )
  }

  function sameInputType (a, b) {
    if (a.tag !== 'input') { return true }
    var i;
    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
  }

  function createKeyToOldIdx (children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) { map[key] = i; }
    }
    return map
  }

  function createPatchFunction (backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          cbs[hooks[i]].push(modules[j][hooks[i]]);
        }
      }
    }

    function emptyNodeAt (elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    function createRmCb (childElm, listeners) {
      function remove$$1 () {
        if (--remove$$1.listeners === 0) {
          removeNode(childElm);
        }
      }
      remove$$1.listeners = listeners;
      return remove$$1
    }

    function removeNode (el) {
      var parent = nodeOps.parentNode(el);
      // element may have already been removed due to v-html / v-text
      if (isDef(parent)) {
        nodeOps.removeChild(parent, el);
      }
    }

    function isUnknownElement$$1 (vnode, inVPre) {
      return (
        !inVPre &&
        !vnode.ns &&
        !(
          config.ignoredElements.length &&
          config.ignoredElements.some(function (ignore) {
            return isRegExp(ignore)
              ? ignore.test(vnode.tag)
              : ignore === vnode.tag
          })
        ) &&
        config.isUnknownElement(vnode.tag)
      )
    }

    var creatingElmInVPre = 0;

    function createElm (
      vnode,
      insertedVnodeQueue,
      parentElm,
      refElm,
      nested,
      ownerArray,
      index
    ) {
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // This vnode was used in a previous render!
        // now it's used as a new node, overwriting its elm would cause
        // potential patch errors down the road when it's used as an insertion
        // reference node. Instead, we clone the node on-demand before creating
        // associated DOM element for it.
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      vnode.isRootInsert = !nested; // for transition enter check
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
      }

      var data = vnode.data;
      var children = vnode.children;
      var tag = vnode.tag;
      if (isDef(tag)) {
        {
          if (data && data.pre) {
            creatingElmInVPre++;
          }
          if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
            warn(
              'Unknown custom element: <' + tag + '> - did you ' +
              'register the component correctly? For recursive components, ' +
              'make sure to provide the "name" option.',
              vnode.context
            );
          }
        }

        vnode.elm = vnode.ns
          ? nodeOps.createElementNS(vnode.ns, tag)
          : nodeOps.createElement(tag, vnode);
        setScope(vnode);

        /* istanbul ignore if */
        {
          createChildren(vnode, children, insertedVnodeQueue);
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }

        if (data && data.pre) {
          creatingElmInVPre--;
        }
      } else if (isTrue(vnode.isComment)) {
        vnode.elm = nodeOps.createComment(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      }
    }

    function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i = vnode.data;
      if (isDef(i)) {
        var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
        if (isDef(i = i.hook) && isDef(i = i.init)) {
          i(vnode, false /* hydrating */);
        }
        // after calling the init hook, if the vnode is a child component
        // it should've created a child instance and mounted it. the child
        // component also has set the placeholder vnode's elm.
        // in that case we can just return the element and be done.
        if (isDef(vnode.componentInstance)) {
          initComponent(vnode, insertedVnodeQueue);
          insert(parentElm, vnode.elm, refElm);
          if (isTrue(isReactivated)) {
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
          }
          return true
        }
      }
    }

    function initComponent (vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
        vnode.data.pendingInsert = null;
      }
      vnode.elm = vnode.componentInstance.$el;
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
        setScope(vnode);
      } else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        insertedVnodeQueue.push(vnode);
      }
    }

    function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i;
      // hack for #4339: a reactivated component with inner transition
      // does not trigger because the inner node's created hooks are not called
      // again. It's not ideal to involve module-specific logic in here but
      // there doesn't seem to be a better way to do it.
      var innerNode = vnode;
      while (innerNode.componentInstance) {
        innerNode = innerNode.componentInstance._vnode;
        if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
          for (i = 0; i < cbs.activate.length; ++i) {
            cbs.activate[i](emptyNode, innerNode);
          }
          insertedVnodeQueue.push(innerNode);
          break
        }
      }
      // unlike a newly created component,
      // a reactivated keep-alive component doesn't insert itself
      insert(parentElm, vnode.elm, refElm);
    }

    function insert (parent, elm, ref$$1) {
      if (isDef(parent)) {
        if (isDef(ref$$1)) {
          if (nodeOps.parentNode(ref$$1) === parent) {
            nodeOps.insertBefore(parent, elm, ref$$1);
          }
        } else {
          nodeOps.appendChild(parent, elm);
        }
      }
    }

    function createChildren (vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        {
          checkDuplicateKeys(children);
        }
        for (var i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
      }
    }

    function isPatchable (vnode) {
      while (vnode.componentInstance) {
        vnode = vnode.componentInstance._vnode;
      }
      return isDef(vnode.tag)
    }

    function invokeCreateHooks (vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (isDef(i.create)) { i.create(emptyNode, vnode); }
        if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope (vnode) {
      var i;
      if (isDef(i = vnode.fnScopeId)) {
        nodeOps.setStyleScope(vnode.elm, i);
      } else {
        var ancestor = vnode;
        while (ancestor) {
          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
            nodeOps.setStyleScope(vnode.elm, i);
          }
          ancestor = ancestor.parent;
        }
      }
      // for slot content they should also get the scopeId from the host instance.
      if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        i !== vnode.fnContext &&
        isDef(i = i.$options._scopeId)
      ) {
        nodeOps.setStyleScope(vnode.elm, i);
      }
    }

    function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
      }
    }

    function invokeDestroyHook (vnode) {
      var i, j;
      var data = vnode.data;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
        for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
      }
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }

    function removeVnodes (vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx];
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
          } else { // Text node
            removeNode(ch.elm);
          }
        }
      }
    }

    function removeAndInvokeRemoveHook (vnode, rm) {
      if (isDef(rm) || isDef(vnode.data)) {
        var i;
        var listeners = cbs.remove.length + 1;
        if (isDef(rm)) {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        } else {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
        }
        // recursively invoke hooks on child component root node
        if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
          removeAndInvokeRemoveHook(i, rm);
        }
        for (i = 0; i < cbs.remove.length; ++i) {
          cbs.remove[i](vnode, rm);
        }
        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
          i(vnode, rm);
        } else {
          rm();
        }
      } else {
        removeNode(vnode.elm);
      }
    }

    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      {
        checkDuplicateKeys(newCh);
      }

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
          if (isUndef(idxInOld)) { // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          } else {
            vnodeToMove = oldCh[idxInOld];
            if (sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            }
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function checkDuplicateKeys (children) {
      var seenKeys = {};
      for (var i = 0; i < children.length; i++) {
        var vnode = children[i];
        var key = vnode.key;
        if (isDef(key)) {
          if (seenKeys[key]) {
            warn(
              ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
              vnode.context
            );
          } else {
            seenKeys[key] = true;
          }
        }
      }
    }

    function findIdxInOld (node, oldCh, start, end) {
      for (var i = start; i < end; i++) {
        var c = oldCh[i];
        if (isDef(c) && sameVnode(node, c)) { return i }
      }
    }

    function patchVnode (
      oldVnode,
      vnode,
      insertedVnodeQueue,
      ownerArray,
      index,
      removeOnly
    ) {
      if (oldVnode === vnode) {
        return
      }

      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // clone reused vnode
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      var elm = vnode.elm = oldVnode.elm;

      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved)) {
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
        } else {
          vnode.isAsyncPlaceholder = true;
        }
        return
      }

      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
        vnode.componentInstance = oldVnode.componentInstance;
        return
      }

      var i;
      var data = vnode.data;
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }

      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (isDef(data) && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
        if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
      }
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
        } else if (isDef(ch)) {
          {
            checkDuplicateKeys(ch);
          }
          if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
      }
    }

    function invokeInsertHook (vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (isTrue(initial) && isDef(vnode.parent)) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (var i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }

    var hydrationBailed = false;
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
      var i;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      inVPre = inVPre || (data && data.pre);
      vnode.elm = elm;

      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
        vnode.isAsyncPlaceholder = true;
        return true
      }
      // assert node match
      {
        if (!assertNodeMatch(elm, vnode, inVPre)) {
          return false
        }
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
        if (isDef(i = vnode.componentInstance)) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          // empty element, allow client to pick up and populate children
          if (!elm.hasChildNodes()) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            // v-html and domProps: innerHTML
            if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
              if (i !== elm.innerHTML) {
                /* istanbul ignore if */
                if (typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('server innerHTML: ', i);
                  console.warn('client innerHTML: ', elm.innerHTML);
                }
                return false
              }
            } else {
              // iterate and compare children lists
              var childrenMatch = true;
              var childNode = elm.firstChild;
              for (var i$1 = 0; i$1 < children.length; i$1++) {
                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                  childrenMatch = false;
                  break
                }
                childNode = childNode.nextSibling;
              }
              // if childNode is not null, it means the actual childNodes list is
              // longer than the virtual children list.
              if (!childrenMatch || childNode) {
                /* istanbul ignore if */
                if (typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                }
                return false
              }
            }
          }
        }
        if (isDef(data)) {
          var fullInvoke = false;
          for (var key in data) {
            if (!isRenderedModule(key)) {
              fullInvoke = true;
              invokeCreateHooks(vnode, insertedVnodeQueue);
              break
            }
          }
          if (!fullInvoke && data['class']) {
            // ensure collecting deps for deep class bindings for future updates
            traverse(data['class']);
          }
        }
      } else if (elm.data !== vnode.text) {
        elm.data = vnode.text;
      }
      return true
    }

    function assertNodeMatch (node, vnode, inVPre) {
      if (isDef(vnode.tag)) {
        return vnode.tag.indexOf('vue-component') === 0 || (
          !isUnknownElement$$1(vnode, inVPre) &&
          vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
        )
      } else {
        return node.nodeType === (vnode.isComment ? 8 : 3)
      }
    }

    return function patch (oldVnode, vnode, hydrating, removeOnly) {
      if (isUndef(vnode)) {
        if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
        return
      }

      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if (isUndef(oldVnode)) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue);
      } else {
        var isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR);
              hydrating = true;
            }
            if (isTrue(hydrating)) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode
              } else {
                warn(
                  'The client-side rendered virtual DOM tree is not matching ' +
                  'server-rendered content. This is likely caused by incorrect ' +
                  'HTML markup, for example nesting block-level elements inside ' +
                  '<p>, or missing <tbody>. Bailing hydration and performing ' +
                  'full client-side render.'
                );
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode);
          }

          // replacing existing element
          var oldElm = oldVnode.elm;
          var parentElm = nodeOps.parentNode(oldElm);

          // create new node
          createElm(
            vnode,
            insertedVnodeQueue,
            // extremely rare edge case: do not insert if old element is in a
            // leaving transition. Only happens when combining transition +
            // keep-alive + HOCs. (#4590)
            oldElm._leaveCb ? null : parentElm,
            nodeOps.nextSibling(oldElm)
          );

          // update parent placeholder node element, recursively
          if (isDef(vnode.parent)) {
            var ancestor = vnode.parent;
            var patchable = isPatchable(vnode);
            while (ancestor) {
              for (var i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](ancestor);
              }
              ancestor.elm = vnode.elm;
              if (patchable) {
                for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                  cbs.create[i$1](emptyNode, ancestor);
                }
                // #6513
                // invoke insert hooks that may have been merged by create hooks.
                // e.g. for directives that uses the "inserted" hook.
                var insert = ancestor.data.hook.insert;
                if (insert.merged) {
                  // start at index 1 to avoid re-invoking component mounted hook
                  for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                    insert.fns[i$2]();
                  }
                }
              } else {
                registerRef(ancestor);
              }
              ancestor = ancestor.parent;
            }
          }

          // destroy old node
          if (isDef(parentElm)) {
            removeVnodes([oldVnode], 0, 0);
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm
    }
  }

  /*  */

  var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives (vnode) {
      updateDirectives(vnode, emptyNode);
    }
  };

  function updateDirectives (oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
      _update(oldVnode, vnode);
    }
  }

  function _update (oldVnode, vnode) {
    var isCreate = oldVnode === emptyNode;
    var isDestroy = vnode === emptyNode;
    var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
    var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

    var dirsWithInsert = [];
    var dirsWithPostpatch = [];

    var key, oldDir, dir;
    for (key in newDirs) {
      oldDir = oldDirs[key];
      dir = newDirs[key];
      if (!oldDir) {
        // new directive, bind
        callHook$1(dir, 'bind', vnode, oldVnode);
        if (dir.def && dir.def.inserted) {
          dirsWithInsert.push(dir);
        }
      } else {
        // existing directive, update
        dir.oldValue = oldDir.value;
        dir.oldArg = oldDir.arg;
        callHook$1(dir, 'update', vnode, oldVnode);
        if (dir.def && dir.def.componentUpdated) {
          dirsWithPostpatch.push(dir);
        }
      }
    }

    if (dirsWithInsert.length) {
      var callInsert = function () {
        for (var i = 0; i < dirsWithInsert.length; i++) {
          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
        }
      };
      if (isCreate) {
        mergeVNodeHook(vnode, 'insert', callInsert);
      } else {
        callInsert();
      }
    }

    if (dirsWithPostpatch.length) {
      mergeVNodeHook(vnode, 'postpatch', function () {
        for (var i = 0; i < dirsWithPostpatch.length; i++) {
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
    }

    if (!isCreate) {
      for (key in oldDirs) {
        if (!newDirs[key]) {
          // no longer present, unbind
          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
        }
      }
    }
  }

  var emptyModifiers = Object.create(null);

  function normalizeDirectives$1 (
    dirs,
    vm
  ) {
    var res = Object.create(null);
    if (!dirs) {
      // $flow-disable-line
      return res
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];
      if (!dir.modifiers) {
        // $flow-disable-line
        dir.modifiers = emptyModifiers;
      }
      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
    }
    // $flow-disable-line
    return res
  }

  function getRawDirName (dir) {
    return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
  }

  function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
    var fn = dir.def && dir.def[hook];
    if (fn) {
      try {
        fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
      } catch (e) {
        handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
      }
    }
  }

  var baseModules = [
    ref,
    directives
  ];

  /*  */

  function updateAttrs (oldVnode, vnode) {
    var opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
      return
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
      return
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__)) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    // #6666: IE/Edge forces progress value down to 1 before setting a max
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
      if (isUndef(attrs[key])) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr (el, key, value) {
    if (el.tagName.indexOf('-') > -1) {
      baseSetAttr(el, key, value);
    } else if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        // technically allowfullscreen is a boolean attribute for <iframe>,
        // but Flash expects a value of "true" when used on <embed> tag
        value = key === 'allowfullscreen' && el.tagName === 'EMBED'
          ? 'true'
          : key;
        el.setAttribute(key, value);
      }
    } else if (isEnumeratedAttr(key)) {
      el.setAttribute(key, convertEnumeratedValue(key, value));
    } else if (isXlink(key)) {
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      baseSetAttr(el, key, value);
    }
  }

  function baseSetAttr (el, key, value) {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && value !== '' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs
  };

  /*  */

  function updateClass (oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (
      isUndef(data.staticClass) &&
      isUndef(data.class) && (
        isUndef(oldData) || (
          isUndef(oldData.staticClass) &&
          isUndef(oldData.class)
        )
      )
    ) {
      return
    }

    var cls = genClassForVnode(vnode);

    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
      cls = concat(cls, stringifyClass(transitionClass));
    }

    // set the class
    if (cls !== el._prevClass) {
      el.setAttribute('class', cls);
      el._prevClass = cls;
    }
  }

  var klass = {
    create: updateClass,
    update: updateClass
  };

  /*  */

  var validDivisionCharRE = /[\w).+\-_$\]]/;

  function parseFilters (exp) {
    var inSingle = false;
    var inDouble = false;
    var inTemplateString = false;
    var inRegex = false;
    var curly = 0;
    var square = 0;
    var paren = 0;
    var lastFilterIndex = 0;
    var c, prev, i, expression, filters;

    for (i = 0; i < exp.length; i++) {
      prev = c;
      c = exp.charCodeAt(i);
      if (inSingle) {
        if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
      } else if (inDouble) {
        if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
      } else if (inTemplateString) {
        if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
      } else if (inRegex) {
        if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
      } else if (
        c === 0x7C && // pipe
        exp.charCodeAt(i + 1) !== 0x7C &&
        exp.charCodeAt(i - 1) !== 0x7C &&
        !curly && !square && !paren
      ) {
        if (expression === undefined) {
          // first filter, end of expression
          lastFilterIndex = i + 1;
          expression = exp.slice(0, i).trim();
        } else {
          pushFilter();
        }
      } else {
        switch (c) {
          case 0x22: inDouble = true; break         // "
          case 0x27: inSingle = true; break         // '
          case 0x60: inTemplateString = true; break // `
          case 0x28: paren++; break                 // (
          case 0x29: paren--; break                 // )
          case 0x5B: square++; break                // [
          case 0x5D: square--; break                // ]
          case 0x7B: curly++; break                 // {
          case 0x7D: curly--; break                 // }
        }
        if (c === 0x2f) { // /
          var j = i - 1;
          var p = (void 0);
          // find first non-whitespace prev char
          for (; j >= 0; j--) {
            p = exp.charAt(j);
            if (p !== ' ') { break }
          }
          if (!p || !validDivisionCharRE.test(p)) {
            inRegex = true;
          }
        }
      }
    }

    if (expression === undefined) {
      expression = exp.slice(0, i).trim();
    } else if (lastFilterIndex !== 0) {
      pushFilter();
    }

    function pushFilter () {
      (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
      lastFilterIndex = i + 1;
    }

    if (filters) {
      for (i = 0; i < filters.length; i++) {
        expression = wrapFilter(expression, filters[i]);
      }
    }

    return expression
  }

  function wrapFilter (exp, filter) {
    var i = filter.indexOf('(');
    if (i < 0) {
      // _f: resolveFilter
      return ("_f(\"" + filter + "\")(" + exp + ")")
    } else {
      var name = filter.slice(0, i);
      var args = filter.slice(i + 1);
      return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args))
    }
  }

  /*  */



  /* eslint-disable no-unused-vars */
  function baseWarn (msg, range) {
    console.error(("[Vue compiler]: " + msg));
  }
  /* eslint-enable no-unused-vars */

  function pluckModuleFunction (
    modules,
    key
  ) {
    return modules
      ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
      : []
  }

  function addProp (el, name, value, range, dynamic) {
    (el.props || (el.props = [])).push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
    el.plain = false;
  }

  function addAttr (el, name, value, range, dynamic) {
    var attrs = dynamic
      ? (el.dynamicAttrs || (el.dynamicAttrs = []))
      : (el.attrs || (el.attrs = []));
    attrs.push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
    el.plain = false;
  }

  // add a raw attr (use this in preTransforms)
  function addRawAttr (el, name, value, range) {
    el.attrsMap[name] = value;
    el.attrsList.push(rangeSetItem({ name: name, value: value }, range));
  }

  function addDirective (
    el,
    name,
    rawName,
    value,
    arg,
    isDynamicArg,
    modifiers,
    range
  ) {
    (el.directives || (el.directives = [])).push(rangeSetItem({
      name: name,
      rawName: rawName,
      value: value,
      arg: arg,
      isDynamicArg: isDynamicArg,
      modifiers: modifiers
    }, range));
    el.plain = false;
  }

  function prependModifierMarker (symbol, name, dynamic) {
    return dynamic
      ? ("_p(" + name + ",\"" + symbol + "\")")
      : symbol + name // mark the event as captured
  }

  function addHandler (
    el,
    name,
    value,
    modifiers,
    important,
    warn,
    range,
    dynamic
  ) {
    modifiers = modifiers || emptyObject;
    // warn prevent and passive modifier
    /* istanbul ignore if */
    if (
      warn &&
      modifiers.prevent && modifiers.passive
    ) {
      warn(
        'passive and prevent can\'t be used together. ' +
        'Passive handler can\'t prevent default event.',
        range
      );
    }

    // normalize click.right and click.middle since they don't actually fire
    // this is technically browser-specific, but at least for now browsers are
    // the only target envs that have right/middle clicks.
    if (modifiers.right) {
      if (dynamic) {
        name = "(" + name + ")==='click'?'contextmenu':(" + name + ")";
      } else if (name === 'click') {
        name = 'contextmenu';
        delete modifiers.right;
      }
    } else if (modifiers.middle) {
      if (dynamic) {
        name = "(" + name + ")==='click'?'mouseup':(" + name + ")";
      } else if (name === 'click') {
        name = 'mouseup';
      }
    }

    // check capture modifier
    if (modifiers.capture) {
      delete modifiers.capture;
      name = prependModifierMarker('!', name, dynamic);
    }
    if (modifiers.once) {
      delete modifiers.once;
      name = prependModifierMarker('~', name, dynamic);
    }
    /* istanbul ignore if */
    if (modifiers.passive) {
      delete modifiers.passive;
      name = prependModifierMarker('&', name, dynamic);
    }

    var events;
    if (modifiers.native) {
      delete modifiers.native;
      events = el.nativeEvents || (el.nativeEvents = {});
    } else {
      events = el.events || (el.events = {});
    }

    var newHandler = rangeSetItem({ value: value.trim(), dynamic: dynamic }, range);
    if (modifiers !== emptyObject) {
      newHandler.modifiers = modifiers;
    }

    var handlers = events[name];
    /* istanbul ignore if */
    if (Array.isArray(handlers)) {
      important ? handlers.unshift(newHandler) : handlers.push(newHandler);
    } else if (handlers) {
      events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
    } else {
      events[name] = newHandler;
    }

    el.plain = false;
  }

  function getRawBindingAttr (
    el,
    name
  ) {
    return el.rawAttrsMap[':' + name] ||
      el.rawAttrsMap['v-bind:' + name] ||
      el.rawAttrsMap[name]
  }

  function getBindingAttr (
    el,
    name,
    getStatic
  ) {
    var dynamicValue =
      getAndRemoveAttr(el, ':' + name) ||
      getAndRemoveAttr(el, 'v-bind:' + name);
    if (dynamicValue != null) {
      return parseFilters(dynamicValue)
    } else if (getStatic !== false) {
      var staticValue = getAndRemoveAttr(el, name);
      if (staticValue != null) {
        return JSON.stringify(staticValue)
      }
    }
  }

  // note: this only removes the attr from the Array (attrsList) so that it
  // doesn't get processed by processAttrs.
  // By default it does NOT remove it from the map (attrsMap) because the map is
  // needed during codegen.
  function getAndRemoveAttr (
    el,
    name,
    removeFromMap
  ) {
    var val;
    if ((val = el.attrsMap[name]) != null) {
      var list = el.attrsList;
      for (var i = 0, l = list.length; i < l; i++) {
        if (list[i].name === name) {
          list.splice(i, 1);
          break
        }
      }
    }
    if (removeFromMap) {
      delete el.attrsMap[name];
    }
    return val
  }

  function getAndRemoveAttrByRegex (
    el,
    name
  ) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      var attr = list[i];
      if (name.test(attr.name)) {
        list.splice(i, 1);
        return attr
      }
    }
  }

  function rangeSetItem (
    item,
    range
  ) {
    if (range) {
      if (range.start != null) {
        item.start = range.start;
      }
      if (range.end != null) {
        item.end = range.end;
      }
    }
    return item
  }

  /*  */

  /**
   * Cross-platform code generation for component v-model
   */
  function genComponentModel (
    el,
    value,
    modifiers
  ) {
    var ref = modifiers || {};
    var number = ref.number;
    var trim = ref.trim;

    var baseValueExpression = '$$v';
    var valueExpression = baseValueExpression;
    if (trim) {
      valueExpression =
        "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
    }
    if (number) {
      valueExpression = "_n(" + valueExpression + ")";
    }
    var assignment = genAssignmentCode(value, valueExpression);

    el.model = {
      value: ("(" + value + ")"),
      expression: JSON.stringify(value),
      callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
    };
  }

  /**
   * Cross-platform codegen helper for generating v-model value assignment code.
   */
  function genAssignmentCode (
    value,
    assignment
  ) {
    var res = parseModel(value);
    if (res.key === null) {
      return (value + "=" + assignment)
    } else {
      return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
    }
  }

  /**
   * Parse a v-model expression into a base path and a final key segment.
   * Handles both dot-path and possible square brackets.
   *
   * Possible cases:
   *
   * - test
   * - test[key]
   * - test[test1[key]]
   * - test["a"][key]
   * - xxx.test[a[a].test1[key]]
   * - test.xxx.a["asa"][test1[key]]
   *
   */

  var len, str, chr, index$1, expressionPos, expressionEndPos;



  function parseModel (val) {
    // Fix https://github.com/vuejs/vue/pull/7730
    // allow v-model="obj.val " (trailing whitespace)
    val = val.trim();
    len = val.length;

    if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
      index$1 = val.lastIndexOf('.');
      if (index$1 > -1) {
        return {
          exp: val.slice(0, index$1),
          key: '"' + val.slice(index$1 + 1) + '"'
        }
      } else {
        return {
          exp: val,
          key: null
        }
      }
    }

    str = val;
    index$1 = expressionPos = expressionEndPos = 0;

    while (!eof()) {
      chr = next();
      /* istanbul ignore if */
      if (isStringStart(chr)) {
        parseString(chr);
      } else if (chr === 0x5B) {
        parseBracket(chr);
      }
    }

    return {
      exp: val.slice(0, expressionPos),
      key: val.slice(expressionPos + 1, expressionEndPos)
    }
  }

  function next () {
    return str.charCodeAt(++index$1)
  }

  function eof () {
    return index$1 >= len
  }

  function isStringStart (chr) {
    return chr === 0x22 || chr === 0x27
  }

  function parseBracket (chr) {
    var inBracket = 1;
    expressionPos = index$1;
    while (!eof()) {
      chr = next();
      if (isStringStart(chr)) {
        parseString(chr);
        continue
      }
      if (chr === 0x5B) { inBracket++; }
      if (chr === 0x5D) { inBracket--; }
      if (inBracket === 0) {
        expressionEndPos = index$1;
        break
      }
    }
  }

  function parseString (chr) {
    var stringQuote = chr;
    while (!eof()) {
      chr = next();
      if (chr === stringQuote) {
        break
      }
    }
  }

  /*  */

  var warn$1;

  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  var RANGE_TOKEN = '__r';
  var CHECKBOX_RADIO_TOKEN = '__c';

  function model (
    el,
    dir,
    _warn
  ) {
    warn$1 = _warn;
    var value = dir.value;
    var modifiers = dir.modifiers;
    var tag = el.tag;
    var type = el.attrsMap.type;

    {
      // inputs with type="file" are read only and setting the input's
      // value will throw an error.
      if (tag === 'input' && type === 'file') {
        warn$1(
          "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
          "File inputs are read only. Use a v-on:change listener instead.",
          el.rawAttrsMap['v-model']
        );
      }
    }

    if (el.component) {
      genComponentModel(el, value, modifiers);
      // component v-model doesn't need extra runtime
      return false
    } else if (tag === 'select') {
      genSelect(el, value, modifiers);
    } else if (tag === 'input' && type === 'checkbox') {
      genCheckboxModel(el, value, modifiers);
    } else if (tag === 'input' && type === 'radio') {
      genRadioModel(el, value, modifiers);
    } else if (tag === 'input' || tag === 'textarea') {
      genDefaultModel(el, value, modifiers);
    } else if (!config.isReservedTag(tag)) {
      genComponentModel(el, value, modifiers);
      // component v-model doesn't need extra runtime
      return false
    } else {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "v-model is not supported on this element type. " +
        'If you are working with contenteditable, it\'s recommended to ' +
        'wrap a library dedicated for that purpose inside a custom component.',
        el.rawAttrsMap['v-model']
      );
    }

    // ensure runtime directive metadata
    return true
  }

  function genCheckboxModel (
    el,
    value,
    modifiers
  ) {
    var number = modifiers && modifiers.number;
    var valueBinding = getBindingAttr(el, 'value') || 'null';
    var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
    var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
    addProp(el, 'checked',
      "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
    );
    addHandler(el, 'change',
      "var $$a=" + value + "," +
          '$$el=$event.target,' +
          "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
      'if(Array.isArray($$a)){' +
        "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
            '$$i=_i($$a,$$v);' +
        "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
        "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
      "}else{" + (genAssignmentCode(value, '$$c')) + "}",
      null, true
    );
  }

  function genRadioModel (
    el,
    value,
    modifiers
  ) {
    var number = modifiers && modifiers.number;
    var valueBinding = getBindingAttr(el, 'value') || 'null';
    valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
    addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
    addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
  }

  function genSelect (
    el,
    value,
    modifiers
  ) {
    var number = modifiers && modifiers.number;
    var selectedVal = "Array.prototype.filter" +
      ".call($event.target.options,function(o){return o.selected})" +
      ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
      "return " + (number ? '_n(val)' : 'val') + "})";

    var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
    var code = "var $$selectedVal = " + selectedVal + ";";
    code = code + " " + (genAssignmentCode(value, assignment));
    addHandler(el, 'change', code, null, true);
  }

  function genDefaultModel (
    el,
    value,
    modifiers
  ) {
    var type = el.attrsMap.type;

    // warn if v-bind:value conflicts with v-model
    // except for inputs with v-bind:type
    {
      var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
      var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
      if (value$1 && !typeBinding) {
        var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
        warn$1(
          binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
          'because the latter already expands to a value binding internally',
          el.rawAttrsMap[binding]
        );
      }
    }

    var ref = modifiers || {};
    var lazy = ref.lazy;
    var number = ref.number;
    var trim = ref.trim;
    var needCompositionGuard = !lazy && type !== 'range';
    var event = lazy
      ? 'change'
      : type === 'range'
        ? RANGE_TOKEN
        : 'input';

    var valueExpression = '$event.target.value';
    if (trim) {
      valueExpression = "$event.target.value.trim()";
    }
    if (number) {
      valueExpression = "_n(" + valueExpression + ")";
    }

    var code = genAssignmentCode(value, valueExpression);
    if (needCompositionGuard) {
      code = "if($event.target.composing)return;" + code;
    }

    addProp(el, 'value', ("(" + value + ")"));
    addHandler(el, event, code, null, true);
    if (trim || number) {
      addHandler(el, 'blur', '$forceUpdate()');
    }
  }

  /*  */

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents (on) {
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
      // IE input[type=range] only supports `change` event
      var event = isIE ? 'change' : 'input';
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
      delete on[RANGE_TOKEN];
    }
    // This was originally intended to fix #4521 but no longer necessary
    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
    /* istanbul ignore if */
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
      on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
      delete on[CHECKBOX_RADIO_TOKEN];
    }
  }

  var target$1;

  function createOnceHandler$1 (event, handler, capture) {
    var _target = target$1; // save current target element in closure
    return function onceHandler () {
      var res = handler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, onceHandler, capture, _target);
      }
    }
  }

  // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
  // implementation and does not fire microtasks in between event propagation, so
  // safe to exclude.
  var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

  function add$1 (
    name,
    handler,
    capture,
    passive
  ) {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    if (useMicrotaskFix) {
      var attachedTimestamp = currentFlushTimestamp;
      var original = handler;
      handler = original._wrapper = function (e) {
        if (
          // no bubbling, should always fire.
          // this is just a safety net in case event.timeStamp is unreliable in
          // certain weird environments...
          e.target === e.currentTarget ||
          // event is fired after handler attachment
          e.timeStamp >= attachedTimestamp ||
          // bail for environments that have buggy event.timeStamp implementations
          // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
          // #9681 QtWebEngine event.timeStamp is negative value
          e.timeStamp <= 0 ||
          // #9448 bail if event is fired in another document in a multi-page
          // electron/nw.js app, since event.timeStamp will be using a different
          // starting reference
          e.target.ownerDocument !== document
        ) {
          return original.apply(this, arguments)
        }
      };
    }
    target$1.addEventListener(
      name,
      handler,
      supportsPassive
        ? { capture: capture, passive: passive }
        : capture
    );
  }

  function remove$2 (
    name,
    handler,
    capture,
    _target
  ) {
    (_target || target$1).removeEventListener(
      name,
      handler._wrapper || handler,
      capture
    );
  }

  function updateDOMListeners (oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
      return
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
    target$1 = undefined;
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  };

  /*  */

  var svgContainer;

  function updateDOMProps (oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
      return
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__)) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (!(key in props)) {
        elm[key] = '';
      }
    }

    for (key in props) {
      cur = props[key];
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if (key === 'textContent' || key === 'innerHTML') {
        if (vnode.children) { vnode.children.length = 0; }
        if (cur === oldProps[key]) { continue }
        // #6601 work around Chrome version <= 55 bug where single textNode
        // replaced by innerHTML/textContent retains its parentNode property
        if (elm.childNodes.length === 1) {
          elm.removeChild(elm.childNodes[0]);
        }
      }

      if (key === 'value' && elm.tagName !== 'PROGRESS') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = isUndef(cur) ? '' : String(cur);
        if (shouldUpdateValue(elm, strCur)) {
          elm.value = strCur;
        }
      } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
        // IE doesn't support innerHTML for SVG elements
        svgContainer = svgContainer || document.createElement('div');
        svgContainer.innerHTML = "<svg>" + cur + "</svg>";
        var svg = svgContainer.firstChild;
        while (elm.firstChild) {
          elm.removeChild(elm.firstChild);
        }
        while (svg.firstChild) {
          elm.appendChild(svg.firstChild);
        }
      } else if (
        // skip the update if old and new VDOM state is the same.
        // `value` is handled separately because the DOM value may be temporarily
        // out of sync with VDOM state due to focus, composition and modifiers.
        // This  #4521 by skipping the unnecesarry `checked` update.
        cur !== oldProps[key]
      ) {
        // some property updates can throw
        // e.g. `value` on <progress> w/ non-finite value
        try {
          elm[key] = cur;
        } catch (e) {}
      }
    }
  }

  // check platforms/web/util/attrs.js acceptValue


  function shouldUpdateValue (elm, checkVal) {
    return (!elm.composing && (
      elm.tagName === 'OPTION' ||
      isNotInFocusAndDirty(elm, checkVal) ||
      isDirtyWithModifiers(elm, checkVal)
    ))
  }

  function isNotInFocusAndDirty (elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    var notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try { notInFocus = document.activeElement !== elm; } catch (e) {}
    return notInFocus && elm.value !== checkVal
  }

  function isDirtyWithModifiers (elm, newVal) {
    var value = elm.value;
    var modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers)) {
      if (modifiers.number) {
        return toNumber(value) !== toNumber(newVal)
      }
      if (modifiers.trim) {
        return value.trim() !== newVal.trim()
      }
    }
    return value !== newVal
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  };

  /*  */

  var parseStyleText = cached(function (cssText) {
    var res = {};
    var listDelimiter = /;(?![^(]*\))/g;
    var propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        var tmp = item.split(propertyDelimiter);
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return res
  });

  // merge static and dynamic style data on the same vnode
  function normalizeStyleData (data) {
    var style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle
      ? extend(data.staticStyle, style)
      : style
  }

  // normalize possible array / string values into Object
  function normalizeStyleBinding (bindingStyle) {
    if (Array.isArray(bindingStyle)) {
      return toObject(bindingStyle)
    }
    if (typeof bindingStyle === 'string') {
      return parseStyleText(bindingStyle)
    }
    return bindingStyle
  }

  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle (vnode, checkChild) {
    var res = {};
    var styleData;

    if (checkChild) {
      var childNode = vnode;
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode;
        if (
          childNode && childNode.data &&
          (styleData = normalizeStyleData(childNode.data))
        ) {
          extend(res, styleData);
        }
      }
    }

    if ((styleData = normalizeStyleData(vnode.data))) {
      extend(res, styleData);
    }

    var parentNode = vnode;
    while ((parentNode = parentNode.parent)) {
      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
        extend(res, styleData);
      }
    }
    return res
  }

  /*  */

  var cssVarRE = /^--/;
  var importantRE = /\s*!important$/;
  var setProp = function (el, name, val) {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
      el.style.setProperty(name, val);
    } else if (importantRE.test(val)) {
      el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
    } else {
      var normalizedName = normalize(name);
      if (Array.isArray(val)) {
        // Support values array created by autoprefixer, e.g.
        // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
        // Set them one by one, and the browser will only set those it can recognize
        for (var i = 0, len = val.length; i < len; i++) {
          el.style[normalizedName] = val[i];
        }
      } else {
        el.style[normalizedName] = val;
      }
    }
  };

  var vendorNames = ['Webkit', 'Moz', 'ms'];

  var emptyStyle;
  var normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && (prop in emptyStyle)) {
      return prop
    }
    var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < vendorNames.length; i++) {
      var name = vendorNames[i] + capName;
      if (name in emptyStyle) {
        return name
      }
    }
  });

  function updateStyle (oldVnode, vnode) {
    var data = vnode.data;
    var oldData = oldVnode.data;

    if (isUndef(data.staticStyle) && isUndef(data.style) &&
      isUndef(oldData.staticStyle) && isUndef(oldData.style)
    ) {
      return
    }

    var cur, name;
    var el = vnode.elm;
    var oldStaticStyle = oldData.staticStyle;
    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    var oldStyle = oldStaticStyle || oldStyleBinding;

    var style = normalizeStyleBinding(vnode.data.style) || {};

    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likely wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__)
      ? extend({}, style)
      : style;

    var newStyle = getStyle(vnode, true);

    for (name in oldStyle) {
      if (isUndef(newStyle[name])) {
        setProp(el, name, '');
      }
    }
    for (name in newStyle) {
      cur = newStyle[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle
  };

  /*  */

  var whitespaceRE = /\s+/;

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
      } else {
        el.classList.add(cls);
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
      } else {
        el.classList.remove(cls);
      }
      if (!el.classList.length) {
        el.removeAttribute('class');
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      cur = cur.trim();
      if (cur) {
        el.setAttribute('class', cur);
      } else {
        el.removeAttribute('class');
      }
    }
  }

  /*  */

  function resolveTransition (def$$1) {
    if (!def$$1) {
      return
    }
    /* istanbul ignore else */
    if (typeof def$$1 === 'object') {
      var res = {};
      if (def$$1.css !== false) {
        extend(res, autoCssTransition(def$$1.name || 'v'));
      }
      extend(res, def$$1);
      return res
    } else if (typeof def$$1 === 'string') {
      return autoCssTransition(def$$1)
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: (name + "-enter"),
      enterToClass: (name + "-enter-to"),
      enterActiveClass: (name + "-enter-active"),
      leaveClass: (name + "-leave"),
      leaveToClass: (name + "-leave-to"),
      leaveActiveClass: (name + "-leave-active")
    }
  });

  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = 'transition';
  var ANIMATION = 'animation';

  // Transition property/event sniffing
  var transitionProp = 'transition';
  var transitionEndEvent = 'transitionend';
  var animationProp = 'animation';
  var animationEndEvent = 'animationend';
  if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
    ) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
    ) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  // binding to window is necessary to make hot reload work in IE in strict mode
  var raf = inBrowser
    ? window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : setTimeout
    : /* istanbul ignore next */ function (fn) { return fn(); };

  function nextFrame (fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass (el, cls) {
    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
      transitionClasses.push(cls);
      addClass(el, cls);
    }
  }

  function removeTransitionClass (el, cls) {
    if (el._transitionClasses) {
      remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds (
    el,
    expectedType,
    cb
  ) {
    var ref = getTransitionInfo(el, expectedType);
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if (!type) { return cb() }
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
      el.removeEventListener(event, onEnd);
      cb();
    };
    var onEnd = function (e) {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  var transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo (el, expectedType) {
    var styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
    var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
    var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);

    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0
        ? transitionTimeout > animationTimeout
          ? TRANSITION
          : ANIMATION
        : null;
      propCount = type
        ? type === TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }
    var hasTransform =
      type === TRANSITION &&
      transformRE.test(styles[transitionProp + 'Property']);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    }
  }

  function getTimeout (delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i])
    }))
  }

  // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
  // in a locale-dependent way, using a comma instead of a dot.
  // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
  // as a floor function) causing unexpected behaviors
  function toMs (s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000
  }

  /*  */

  function enter (vnode, toggleDisplay) {
    var el = vnode.elm;

    // call leave callback now
    if (isDef(el._leaveCb)) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
      return
    }

    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
      return
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterToClass = data.enterToClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearToClass = data.appearToClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;
    var duration = data.duration;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var context = activeInstance;
    var transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
      context = transitionNode.context;
      transitionNode = transitionNode.parent;
    }

    var isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== '') {
      return
    }

    var startClass = isAppear && appearClass
      ? appearClass
      : enterClass;
    var activeClass = isAppear && appearActiveClass
      ? appearActiveClass
      : enterActiveClass;
    var toClass = isAppear && appearToClass
      ? appearToClass
      : enterToClass;

    var beforeEnterHook = isAppear
      ? (beforeAppear || beforeEnter)
      : beforeEnter;
    var enterHook = isAppear
      ? (typeof appear === 'function' ? appear : enter)
      : enter;
    var afterEnterHook = isAppear
      ? (afterAppear || afterEnter)
      : afterEnter;
    var enterCancelledHook = isAppear
      ? (appearCancelled || enterCancelled)
      : enterCancelled;

    var explicitEnterDuration = toNumber(
      isObject(duration)
        ? duration.enter
        : duration
    );

    if (explicitEnterDuration != null) {
      checkDuration(explicitEnterDuration, 'enter', vnode);
    }

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(enterHook);

    var cb = el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, toClass);
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    });

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(vnode, 'insert', function () {
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb
        ) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      });
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled) {
          addTransitionClass(el, toClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitEnterDuration)) {
              setTimeout(cb, explicitEnterDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }

    if (vnode.data.show) {
      toggleDisplay && toggleDisplay();
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave (vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (isDef(el._enterCb)) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data) || el.nodeType !== 1) {
      return rm()
    }

    /* istanbul ignore if */
    if (isDef(el._leaveCb)) {
      return
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveToClass = data.leaveToClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;
    var duration = data.duration;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(leave);

    var explicitLeaveDuration = toNumber(
      isObject(duration)
        ? duration.leave
        : duration
    );

    if (isDef(explicitLeaveDuration)) {
      checkDuration(explicitLeaveDuration, 'leave', vnode);
    }

    var cb = el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    });

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave () {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return
      }
      // record leaving element
      if (!vnode.data.show && el.parentNode) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled) {
            addTransitionClass(el, leaveToClass);
            if (!userWantsControl) {
              if (isValidDuration(explicitLeaveDuration)) {
                setTimeout(cb, explicitLeaveDuration);
              } else {
                whenTransitionEnds(el, type, cb);
              }
            }
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  // only used in dev mode
  function checkDuration (val, name, vnode) {
    if (typeof val !== 'number') {
      warn(
        "<transition> explicit " + name + " duration is not a valid number - " +
        "got " + (JSON.stringify(val)) + ".",
        vnode.context
      );
    } else if (isNaN(val)) {
      warn(
        "<transition> explicit " + name + " duration is NaN - " +
        'the duration expression might be incorrect.',
        vnode.context
      );
    }
  }

  function isValidDuration (val) {
    return typeof val === 'number' && !isNaN(val)
  }

  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength (fn) {
    if (isUndef(fn)) {
      return false
    }
    var invokerFns = fn.fns;
    if (isDef(invokerFns)) {
      // invoker
      return getHookArgumentsLength(
        Array.isArray(invokerFns)
          ? invokerFns[0]
          : invokerFns
      )
    } else {
      return (fn._length || fn.length) > 1
    }
  }

  function _enter (_, vnode) {
    if (vnode.data.show !== true) {
      enter(vnode);
    }
  }

  var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove: function remove$$1 (vnode, rm) {
      /* istanbul ignore else */
      if (vnode.data.show !== true) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {};

  var platformModules = [
    attrs,
    klass,
    events,
    domProps,
    style,
    transition
  ];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function () {
      var el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, 'input');
      }
    });
  }

  var directive = {
    inserted: function inserted (el, binding, vnode, oldVnode) {
      if (vnode.tag === 'select') {
        // #6903
        if (oldVnode.elm && !oldVnode.elm._vOptions) {
          mergeVNodeHook(vnode, 'postpatch', function () {
            directive.componentUpdated(el, binding, vnode);
          });
        } else {
          setSelected(el, binding, vnode.context);
        }
        el._vOptions = [].map.call(el.options, getValue);
      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        el._vModifiers = binding.modifiers;
        if (!binding.modifiers.lazy) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
          // Safari < 10.2 & UIWebView doesn't fire compositionend when
          // switching focus before confirming composition choice
          // this also fixes the issue where some browsers e.g. iOS Chrome
          // fires "change" instead of "input" on autocomplete.
          el.addEventListener('change', onCompositionEnd);
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },

    componentUpdated: function componentUpdated (el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        var prevOptions = el._vOptions;
        var curOptions = el._vOptions = [].map.call(el.options, getValue);
        if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
          // trigger change event if
          // no matching option found for at least one value
          var needReset = el.multiple
            ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
            : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
          if (needReset) {
            trigger(el, 'change');
          }
        }
      }
    }
  };

  function setSelected (el, binding, vm) {
    actuallySetSelected(el, binding, vm);
    /* istanbul ignore if */
    if (isIE || isEdge) {
      setTimeout(function () {
        actuallySetSelected(el, binding, vm);
      }, 0);
    }
  }

  function actuallySetSelected (el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
      warn(
        "<select multiple v-model=\"" + (binding.expression) + "\"> " +
        "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
        vm
      );
      return
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption (value, options) {
    return options.every(function (o) { return !looseEqual(o, value); })
  }

  function getValue (option) {
    return '_value' in option
      ? option._value
      : option.value
  }

  function onCompositionStart (e) {
    e.target.composing = true;
  }

  function onCompositionEnd (e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing) { return }
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger (el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode (vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.componentInstance._vnode)
      : vnode
  }

  var show = {
    bind: function bind (el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      var originalDisplay = el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display;
      if (value && transition$$1) {
        vnode.data.show = true;
        enter(vnode, function () {
          el.style.display = originalDisplay;
        });
      } else {
        el.style.display = value ? originalDisplay : 'none';
      }
    },

    update: function update (el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (!value === !oldValue) { return }
      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      if (transition$$1) {
        vnode.data.show = true;
        if (value) {
          enter(vnode, function () {
            el.style.display = el.__vOriginalDisplay;
          });
        } else {
          leave(vnode, function () {
            el.style.display = 'none';
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : 'none';
      }
    },

    unbind: function unbind (
      el,
      binding,
      vnode,
      oldVnode,
      isDestroy
    ) {
      if (!isDestroy) {
        el.style.display = el.__vOriginalDisplay;
      }
    }
  };

  var platformDirectives = {
    model: directive,
    show: show
  };

  /*  */

  var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild (vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
      return vnode
    }
  }

  function extractTransitionData (comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key$1 in listeners) {
      data[camelize(key$1)] = listeners[key$1];
    }
    return data
  }

  function placeholder (h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag)) {
      return h('keep-alive', {
        props: rawChild.componentOptions.propsData
      })
    }
  }

  function hasParentTransition (vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true
      }
    }
  }

  function isSameChild (child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag
  }

  var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

  var isVShowDirective = function (d) { return d.name === 'show'; };

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,

    render: function render (h) {
      var this$1 = this;

      var children = this.$slots.default;
      if (!children) {
        return
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(isNotTextNode);
      /* istanbul ignore if */
      if (!children.length) {
        return
      }

      // warn multiple elements
      if (children.length > 1) {
        warn(
          '<transition> can only be used on a single element. Use ' +
          '<transition-group> for lists.',
          this.$parent
        );
      }

      var mode = this.mode;

      // warn invalid mode
      if (mode && mode !== 'in-out' && mode !== 'out-in'
      ) {
        warn(
          'invalid <transition> mode: ' + mode,
          this.$parent
        );
      }

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild
      }

      if (this._leaving) {
        return placeholder(h, rawChild)
      }

      // ensure a key that is unique to the vnode type and to this transition
      // component instance. This key will be used to remove pending leaving nodes
      // during entering.
      var id = "__transition-" + (this._uid) + "-";
      child.key = child.key == null
        ? child.isComment
          ? id + 'comment'
          : id + child.tag
        : isPrimitive(child.key)
          ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
          : child.key;

      var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (child.data.directives && child.data.directives.some(isVShowDirective)) {
        child.data.show = true;
      }

      if (
        oldChild &&
        oldChild.data &&
        !isSameChild(child, oldChild) &&
        !isAsyncPlaceholder(oldChild) &&
        // #6687 component root is a comment node
        !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
      ) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = oldChild.data.transition = extend({}, data);
        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          });
          return placeholder(h, rawChild)
        } else if (mode === 'in-out') {
          if (isAsyncPlaceholder(child)) {
            return oldRawChild
          }
          var delayedLeave;
          var performLeave = function () { delayedLeave(); };
          mergeVNodeHook(data, 'afterEnter', performLeave);
          mergeVNodeHook(data, 'enterCancelled', performLeave);
          mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
        }
      }

      return rawChild
    }
  };

  /*  */

  var props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props: props,

    beforeMount: function beforeMount () {
      var this$1 = this;

      var update = this._update;
      this._update = function (vnode, hydrating) {
        var restoreActiveInstance = setActiveInstance(this$1);
        // force removing pass
        this$1.__patch__(
          this$1._vnode,
          this$1.kept,
          false, // hydrating
          true // removeOnly (!important, avoids unnecessary moves)
        );
        this$1._vnode = this$1.kept;
        restoreActiveInstance();
        update.call(this$1, vnode, hydrating);
      };
    },

    render: function render (h) {
      var tag = this.tag || this.$vnode.data.tag || 'span';
      var map = Object.create(null);
      var prevChildren = this.prevChildren = this.children;
      var rawChildren = this.$slots.default || [];
      var children = this.children = [];
      var transitionData = extractTransitionData(this);

      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c);
            map[c.key] = c
            ;(c.data || (c.data = {})).transition = transitionData;
          } else {
            var opts = c.componentOptions;
            var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
            warn(("<transition-group> children must be keyed: <" + name + ">"));
          }
        }
      }

      if (prevChildren) {
        var kept = [];
        var removed = [];
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1];
          c$1.data.transition = transitionData;
          c$1.data.pos = c$1.elm.getBoundingClientRect();
          if (map[c$1.key]) {
            kept.push(c$1);
          } else {
            removed.push(c$1);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children)
    },

    updated: function updated () {
      var children = this.prevChildren;
      var moveClass = this.moveClass || ((this.name || 'v') + '-move');
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      // assign to this to avoid being removed in tree-shaking
      // $flow-disable-line
      this._reflow = document.body.offsetHeight;

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
            if (e && e.target !== el) {
              return
            }
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener(transitionEndEvent, cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          });
        }
      });
    },

    methods: {
      hasMove: function hasMove (el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false
        }
        /* istanbul ignore if */
        if (this._hasMove) {
          return this._hasMove
        }
        // Detect whether an element with the move class applied has
        // CSS transitions. Since the element may be inside an entering
        // transition at this very moment, we make a clone of it and remove
        // all other transition classes applied to ensure only the move class
        // is applied.
        var clone = el.cloneNode();
        if (el._transitionClasses) {
          el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
        }
        addClass(clone, moveClass);
        clone.style.display = 'none';
        this.$el.appendChild(clone);
        var info = getTransitionInfo(clone);
        this.$el.removeChild(clone);
        return (this._hasMove = info.hasTransform)
      }
    }
  };

  function callPendingCbs (c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition (c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation (c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
      s.transitionDuration = '0s';
    }
  }

  var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
  };

  /*  */

  // install platform specific utils
  Vue.config.mustUseProp = mustUseProp;
  Vue.config.isReservedTag = isReservedTag;
  Vue.config.isReservedAttr = isReservedAttr;
  Vue.config.getTagNamespace = getTagNamespace;
  Vue.config.isUnknownElement = isUnknownElement;

  // install platform runtime directives & components
  extend(Vue.options.directives, platformDirectives);
  extend(Vue.options.components, platformComponents);

  // install platform patch function
  Vue.prototype.__patch__ = inBrowser ? patch : noop;

  // public mount method
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating)
  };

  // devtools global hook
  /* istanbul ignore next */
  if (inBrowser) {
    setTimeout(function () {
      if (config.devtools) {
        if (devtools) {
          devtools.emit('init', Vue);
        } else {
          console[console.info ? 'info' : 'log'](
            'Download the Vue Devtools extension for a better development experience:\n' +
            'https://github.com/vuejs/vue-devtools'
          );
        }
      }
      if (config.productionTip !== false &&
        typeof console !== 'undefined'
      ) {
        console[console.info ? 'info' : 'log'](
          "You are running Vue in development mode.\n" +
          "Make sure to turn on production mode when deploying for production.\n" +
          "See more tips at https://vuejs.org/guide/deployment.html"
        );
      }
    }, 0);
  }

  /*  */

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

  var buildRegex = cached(function (delimiters) {
    var open = delimiters[0].replace(regexEscapeRE, '\\$&');
    var close = delimiters[1].replace(regexEscapeRE, '\\$&');
    return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
  });



  function parseText (
    text,
    delimiters
  ) {
    var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
    if (!tagRE.test(text)) {
      return
    }
    var tokens = [];
    var rawTokens = [];
    var lastIndex = tagRE.lastIndex = 0;
    var match, index, tokenValue;
    while ((match = tagRE.exec(text))) {
      index = match.index;
      // push text token
      if (index > lastIndex) {
        rawTokens.push(tokenValue = text.slice(lastIndex, index));
        tokens.push(JSON.stringify(tokenValue));
      }
      // tag token
      var exp = parseFilters(match[1].trim());
      tokens.push(("_s(" + exp + ")"));
      rawTokens.push({ '@binding': exp });
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
      rawTokens.push(tokenValue = text.slice(lastIndex));
      tokens.push(JSON.stringify(tokenValue));
    }
    return {
      expression: tokens.join('+'),
      tokens: rawTokens
    }
  }

  /*  */

  function transformNode (el, options) {
    var warn = options.warn || baseWarn;
    var staticClass = getAndRemoveAttr(el, 'class');
    if (staticClass) {
      var res = parseText(staticClass, options.delimiters);
      if (res) {
        warn(
          "class=\"" + staticClass + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div class="{{ val }}">, use <div :class="val">.',
          el.rawAttrsMap['class']
        );
      }
    }
    if (staticClass) {
      el.staticClass = JSON.stringify(staticClass);
    }
    var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
    if (classBinding) {
      el.classBinding = classBinding;
    }
  }

  function genData (el) {
    var data = '';
    if (el.staticClass) {
      data += "staticClass:" + (el.staticClass) + ",";
    }
    if (el.classBinding) {
      data += "class:" + (el.classBinding) + ",";
    }
    return data
  }

  var klass$1 = {
    staticKeys: ['staticClass'],
    transformNode: transformNode,
    genData: genData
  };

  /*  */

  function transformNode$1 (el, options) {
    var warn = options.warn || baseWarn;
    var staticStyle = getAndRemoveAttr(el, 'style');
    if (staticStyle) {
      /* istanbul ignore if */
      {
        var res = parseText(staticStyle, options.delimiters);
        if (res) {
          warn(
            "style=\"" + staticStyle + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div style="{{ val }}">, use <div :style="val">.',
            el.rawAttrsMap['style']
          );
        }
      }
      el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
    }

    var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
    if (styleBinding) {
      el.styleBinding = styleBinding;
    }
  }

  function genData$1 (el) {
    var data = '';
    if (el.staticStyle) {
      data += "staticStyle:" + (el.staticStyle) + ",";
    }
    if (el.styleBinding) {
      data += "style:(" + (el.styleBinding) + "),";
    }
    return data
  }

  var style$1 = {
    staticKeys: ['staticStyle'],
    transformNode: transformNode$1,
    genData: genData$1
  };

  /*  */

  var decoder;

  var he = {
    decode: function decode (html) {
      decoder = decoder || document.createElement('div');
      decoder.innerHTML = html;
      return decoder.textContent
    }
  };

  /*  */

  var isUnaryTag = makeMap(
    'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
    'link,meta,param,source,track,wbr'
  );

  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  var canBeLeftOpenTag = makeMap(
    'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
  );

  // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
  // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
  var isNonPhrasingTag = makeMap(
    'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
    'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
    'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
    'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
    'title,tr,track'
  );

  /**
   * Not type-checking this file because it's mostly vendor code.
   */

  // Regular Expressions for parsing tags and attributes
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + (unicodeRegExp.source) + "]*";
  var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
  var startTagOpen = new RegExp(("^<" + qnameCapture));
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
  var doctype = /^<!DOCTYPE [^>]+>/i;
  // #7298: escape - to avoid being passed as HTML comment when inlined in page
  var comment = /^<!\--/;
  var conditionalComment = /^<!\[/;

  // Special Elements (can contain anything)
  var isPlainTextElement = makeMap('script,style,textarea', true);
  var reCache = {};

  var decodingMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&amp;': '&',
    '&#10;': '\n',
    '&#9;': '\t',
    '&#39;': "'"
  };
  var encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
  var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;

  // #5992
  var isIgnoreNewlineTag = makeMap('pre,textarea', true);
  var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

  function decodeAttr (value, shouldDecodeNewlines) {
    var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
    return value.replace(re, function (match) { return decodingMap[match]; })
  }

  function parseHTML (html, options) {
    var stack = [];
    var expectHTML = options.expectHTML;
    var isUnaryTag$$1 = options.isUnaryTag || no;
    var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
    var index = 0;
    var last, lastTag;
    while (html) {
      last = html;
      // Make sure we're not in a plaintext content element like script/style
      if (!lastTag || !isPlainTextElement(lastTag)) {
        var textEnd = html.indexOf('<');
        if (textEnd === 0) {
          // Comment:
          if (comment.test(html)) {
            var commentEnd = html.indexOf('-->');

            if (commentEnd >= 0) {
              if (options.shouldKeepComment) {
                options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
              }
              advance(commentEnd + 3);
              continue
            }
          }

          // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
          if (conditionalComment.test(html)) {
            var conditionalEnd = html.indexOf(']>');

            if (conditionalEnd >= 0) {
              advance(conditionalEnd + 2);
              continue
            }
          }

          // Doctype:
          var doctypeMatch = html.match(doctype);
          if (doctypeMatch) {
            advance(doctypeMatch[0].length);
            continue
          }

          // End tag:
          var endTagMatch = html.match(endTag);
          if (endTagMatch) {
            var curIndex = index;
            advance(endTagMatch[0].length);
            parseEndTag(endTagMatch[1], curIndex, index);
            continue
          }

          // Start tag:
          var startTagMatch = parseStartTag();
          if (startTagMatch) {
            handleStartTag(startTagMatch);
            if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
              advance(1);
            }
            continue
          }
        }

        var text = (void 0), rest = (void 0), next = (void 0);
        if (textEnd >= 0) {
          rest = html.slice(textEnd);
          while (
            !endTag.test(rest) &&
            !startTagOpen.test(rest) &&
            !comment.test(rest) &&
            !conditionalComment.test(rest)
          ) {
            // < in plain text, be forgiving and treat it as text
            next = rest.indexOf('<', 1);
            if (next < 0) { break }
            textEnd += next;
            rest = html.slice(textEnd);
          }
          text = html.substring(0, textEnd);
        }

        if (textEnd < 0) {
          text = html;
        }

        if (text) {
          advance(text.length);
        }

        if (options.chars && text) {
          options.chars(text, index - text.length, index);
        }
      } else {
        var endTagLength = 0;
        var stackedTag = lastTag.toLowerCase();
        var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
        var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
          endTagLength = endTag.length;
          if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
            text = text
              .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
              .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
          }
          if (shouldIgnoreFirstNewline(stackedTag, text)) {
            text = text.slice(1);
          }
          if (options.chars) {
            options.chars(text);
          }
          return ''
        });
        index += html.length - rest$1.length;
        html = rest$1;
        parseEndTag(stackedTag, index - endTagLength, index);
      }

      if (html === last) {
        options.chars && options.chars(html);
        if (!stack.length && options.warn) {
          options.warn(("Mal-formatted tag at end of template: \"" + html + "\""), { start: index + html.length });
        }
        break
      }
    }

    // Clean up any remaining tags
    parseEndTag();

    function advance (n) {
      index += n;
      html = html.substring(n);
    }

    function parseStartTag () {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          attrs: [],
          start: index
        };
        advance(start[0].length);
        var end, attr;
        while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
          attr.start = index;
          advance(attr[0].length);
          attr.end = index;
          match.attrs.push(attr);
        }
        if (end) {
          match.unarySlash = end[1];
          advance(end[0].length);
          match.end = index;
          return match
        }
      }
    }

    function handleStartTag (match) {
      var tagName = match.tagName;
      var unarySlash = match.unarySlash;

      if (expectHTML) {
        if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
          parseEndTag(lastTag);
        }
        if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
          parseEndTag(tagName);
        }
      }

      var unary = isUnaryTag$$1(tagName) || !!unarySlash;

      var l = match.attrs.length;
      var attrs = new Array(l);
      for (var i = 0; i < l; i++) {
        var args = match.attrs[i];
        var value = args[3] || args[4] || args[5] || '';
        var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
          ? options.shouldDecodeNewlinesForHref
          : options.shouldDecodeNewlines;
        attrs[i] = {
          name: args[1],
          value: decodeAttr(value, shouldDecodeNewlines)
        };
        if (options.outputSourceRange) {
          attrs[i].start = args.start + args[0].match(/^\s*/).length;
          attrs[i].end = args.end;
        }
      }

      if (!unary) {
        stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end });
        lastTag = tagName;
      }

      if (options.start) {
        options.start(tagName, attrs, unary, match.start, match.end);
      }
    }

    function parseEndTag (tagName, start, end) {
      var pos, lowerCasedTagName;
      if (start == null) { start = index; }
      if (end == null) { end = index; }

      // Find the closest opened tag of the same type
      if (tagName) {
        lowerCasedTagName = tagName.toLowerCase();
        for (pos = stack.length - 1; pos >= 0; pos--) {
          if (stack[pos].lowerCasedTag === lowerCasedTagName) {
            break
          }
        }
      } else {
        // If no tag name is provided, clean shop
        pos = 0;
      }

      if (pos >= 0) {
        // Close all the open elements, up the stack
        for (var i = stack.length - 1; i >= pos; i--) {
          if (i > pos || !tagName &&
            options.warn
          ) {
            options.warn(
              ("tag <" + (stack[i].tag) + "> has no matching end tag."),
              { start: stack[i].start, end: stack[i].end }
            );
          }
          if (options.end) {
            options.end(stack[i].tag, start, end);
          }
        }

        // Remove the open elements from the stack
        stack.length = pos;
        lastTag = pos && stack[pos - 1].tag;
      } else if (lowerCasedTagName === 'br') {
        if (options.start) {
          options.start(tagName, [], true, start, end);
        }
      } else if (lowerCasedTagName === 'p') {
        if (options.start) {
          options.start(tagName, [], false, start, end);
        }
        if (options.end) {
          options.end(tagName, start, end);
        }
      }
    }
  }

  /*  */

  var onRE = /^@|^v-on:/;
  var dirRE = /^v-|^@|^:|^#/;
  var forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  var stripParensRE = /^\(|\)$/g;
  var dynamicArgRE = /^\[.*\]$/;

  var argRE = /:(.*)$/;
  var bindRE = /^:|^\.|^v-bind:/;
  var modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;

  var slotRE = /^v-slot(:|$)|^#/;

  var lineBreakRE = /[\r\n]/;
  var whitespaceRE$1 = /\s+/g;

  var invalidAttributeRE = /[\s"'<>\/=]/;

  var decodeHTMLCached = cached(he.decode);

  var emptySlotScopeToken = "_empty_";

  // configurable state
  var warn$2;
  var delimiters;
  var transforms;
  var preTransforms;
  var postTransforms;
  var platformIsPreTag;
  var platformMustUseProp;
  var platformGetTagNamespace;
  var maybeComponent;

  function createASTElement (
    tag,
    attrs,
    parent
  ) {
    return {
      type: 1,
      tag: tag,
      attrsList: attrs,
      attrsMap: makeAttrsMap(attrs),
      rawAttrsMap: {},
      parent: parent,
      children: []
    }
  }

  /**
   * Convert HTML string to AST.
   */
  function parse (
    template,
    options
  ) {
    warn$2 = options.warn || baseWarn;

    platformIsPreTag = options.isPreTag || no;
    platformMustUseProp = options.mustUseProp || no;
    platformGetTagNamespace = options.getTagNamespace || no;
    var isReservedTag = options.isReservedTag || no;
    maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };

    transforms = pluckModuleFunction(options.modules, 'transformNode');
    preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
    postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

    delimiters = options.delimiters;

    var stack = [];
    var preserveWhitespace = options.preserveWhitespace !== false;
    var whitespaceOption = options.whitespace;
    var root;
    var currentParent;
    var inVPre = false;
    var inPre = false;
    var warned = false;

    function warnOnce (msg, range) {
      if (!warned) {
        warned = true;
        warn$2(msg, range);
      }
    }

    function closeElement (element) {
      trimEndingWhitespace(element);
      if (!inVPre && !element.processed) {
        element = processElement(element, options);
      }
      // tree management
      if (!stack.length && element !== root) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          {
            checkRootConstraints(element);
          }
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead.",
            { start: element.start }
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else {
          if (element.slotScope) {
            // scoped slot
            // keep it in the children list so that v-else(-if) conditions can
            // find it as the prev node.
            var name = element.slotTarget || '"default"'
            ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
          }
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }

      // final children cleanup
      // filter out scoped slots
      element.children = element.children.filter(function (c) { return !(c).slotScope; });
      // remove trailing whitespace node again
      trimEndingWhitespace(element);

      // check pre state
      if (element.pre) {
        inVPre = false;
      }
      if (platformIsPreTag(element.tag)) {
        inPre = false;
      }
      // apply post-transforms
      for (var i = 0; i < postTransforms.length; i++) {
        postTransforms[i](element, options);
      }
    }

    function trimEndingWhitespace (el) {
      // remove trailing whitespace node
      if (!inPre) {
        var lastNode;
        while (
          (lastNode = el.children[el.children.length - 1]) &&
          lastNode.type === 3 &&
          lastNode.text === ' '
        ) {
          el.children.pop();
        }
      }
    }

    function checkRootConstraints (el) {
      if (el.tag === 'slot' || el.tag === 'template') {
        warnOnce(
          "Cannot use <" + (el.tag) + "> as component root element because it may " +
          'contain multiple nodes.',
          { start: el.start }
        );
      }
      if (el.attrsMap.hasOwnProperty('v-for')) {
        warnOnce(
          'Cannot use v-for on stateful component root element because ' +
          'it renders multiple elements.',
          el.rawAttrsMap['v-for']
        );
      }
    }

    parseHTML(template, {
      warn: warn$2,
      expectHTML: options.expectHTML,
      isUnaryTag: options.isUnaryTag,
      canBeLeftOpenTag: options.canBeLeftOpenTag,
      shouldDecodeNewlines: options.shouldDecodeNewlines,
      shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
      shouldKeepComment: options.comments,
      outputSourceRange: options.outputSourceRange,
      start: function start (tag, attrs, unary, start$1, end) {
        // check namespace.
        // inherit parent ns if there is one
        var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

        // handle IE svg bug
        /* istanbul ignore if */
        if (isIE && ns === 'svg') {
          attrs = guardIESVGBug(attrs);
        }

        var element = createASTElement(tag, attrs, currentParent);
        if (ns) {
          element.ns = ns;
        }

        {
          if (options.outputSourceRange) {
            element.start = start$1;
            element.end = end;
            element.rawAttrsMap = element.attrsList.reduce(function (cumulated, attr) {
              cumulated[attr.name] = attr;
              return cumulated
            }, {});
          }
          attrs.forEach(function (attr) {
            if (invalidAttributeRE.test(attr.name)) {
              warn$2(
                "Invalid dynamic argument expression: attribute names cannot contain " +
                "spaces, quotes, <, >, / or =.",
                {
                  start: attr.start + attr.name.indexOf("["),
                  end: attr.start + attr.name.length
                }
              );
            }
          });
        }

        if (isForbiddenTag(element) && !isServerRendering()) {
          element.forbidden = true;
          warn$2(
            'Templates should only be responsible for mapping the state to the ' +
            'UI. Avoid placing tags with side-effects in your templates, such as ' +
            "<" + tag + ">" + ', as they will not be parsed.',
            { start: element.start }
          );
        }

        // apply pre-transforms
        for (var i = 0; i < preTransforms.length; i++) {
          element = preTransforms[i](element, options) || element;
        }

        if (!inVPre) {
          processPre(element);
          if (element.pre) {
            inVPre = true;
          }
        }
        if (platformIsPreTag(element.tag)) {
          inPre = true;
        }
        if (inVPre) {
          processRawAttrs(element);
        } else if (!element.processed) {
          // structural directives
          processFor(element);
          processIf(element);
          processOnce(element);
        }

        if (!root) {
          root = element;
          {
            checkRootConstraints(root);
          }
        }

        if (!unary) {
          currentParent = element;
          stack.push(element);
        } else {
          closeElement(element);
        }
      },

      end: function end (tag, start, end$1) {
        var element = stack[stack.length - 1];
        // pop stack
        stack.length -= 1;
        currentParent = stack[stack.length - 1];
        if (options.outputSourceRange) {
          element.end = end$1;
        }
        closeElement(element);
      },

      chars: function chars (text, start, end) {
        if (!currentParent) {
          {
            if (text === template) {
              warnOnce(
                'Component template requires a root element, rather than just text.',
                { start: start }
              );
            } else if ((text = text.trim())) {
              warnOnce(
                ("text \"" + text + "\" outside root element will be ignored."),
                { start: start }
              );
            }
          }
          return
        }
        // IE textarea placeholder bug
        /* istanbul ignore if */
        if (isIE &&
          currentParent.tag === 'textarea' &&
          currentParent.attrsMap.placeholder === text
        ) {
          return
        }
        var children = currentParent.children;
        if (inPre || text.trim()) {
          text = isTextTag(currentParent) ? text : decodeHTMLCached(text);
        } else if (!children.length) {
          // remove the whitespace-only node right after an opening tag
          text = '';
        } else if (whitespaceOption) {
          if (whitespaceOption === 'condense') {
            // in condense mode, remove the whitespace node if it contains
            // line break, otherwise condense to a single space
            text = lineBreakRE.test(text) ? '' : ' ';
          } else {
            text = ' ';
          }
        } else {
          text = preserveWhitespace ? ' ' : '';
        }
        if (text) {
          if (!inPre && whitespaceOption === 'condense') {
            // condense consecutive whitespaces into single space
            text = text.replace(whitespaceRE$1, ' ');
          }
          var res;
          var child;
          if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
            child = {
              type: 2,
              expression: res.expression,
              tokens: res.tokens,
              text: text
            };
          } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
            child = {
              type: 3,
              text: text
            };
          }
          if (child) {
            if (options.outputSourceRange) {
              child.start = start;
              child.end = end;
            }
            children.push(child);
          }
        }
      },
      comment: function comment (text, start, end) {
        // adding anyting as a sibling to the root node is forbidden
        // comments should still be allowed, but ignored
        if (currentParent) {
          var child = {
            type: 3,
            text: text,
            isComment: true
          };
          if (options.outputSourceRange) {
            child.start = start;
            child.end = end;
          }
          currentParent.children.push(child);
        }
      }
    });
    return root
  }

  function processPre (el) {
    if (getAndRemoveAttr(el, 'v-pre') != null) {
      el.pre = true;
    }
  }

  function processRawAttrs (el) {
    var list = el.attrsList;
    var len = list.length;
    if (len) {
      var attrs = el.attrs = new Array(len);
      for (var i = 0; i < len; i++) {
        attrs[i] = {
          name: list[i].name,
          value: JSON.stringify(list[i].value)
        };
        if (list[i].start != null) {
          attrs[i].start = list[i].start;
          attrs[i].end = list[i].end;
        }
      }
    } else if (!el.pre) {
      // non root node in pre blocks with no attributes
      el.plain = true;
    }
  }

  function processElement (
    element,
    options
  ) {
    processKey(element);

    // determine whether this is a plain element after
    // removing structural attributes
    element.plain = (
      !element.key &&
      !element.scopedSlots &&
      !element.attrsList.length
    );

    processRef(element);
    processSlotContent(element);
    processSlotOutlet(element);
    processComponent(element);
    for (var i = 0; i < transforms.length; i++) {
      element = transforms[i](element, options) || element;
    }
    processAttrs(element);
    return element
  }

  function processKey (el) {
    var exp = getBindingAttr(el, 'key');
    if (exp) {
      {
        if (el.tag === 'template') {
          warn$2(
            "<template> cannot be keyed. Place the key on real elements instead.",
            getRawBindingAttr(el, 'key')
          );
        }
        if (el.for) {
          var iterator = el.iterator2 || el.iterator1;
          var parent = el.parent;
          if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
            warn$2(
              "Do not use v-for index as key on <transition-group> children, " +
              "this is the same as not using keys.",
              getRawBindingAttr(el, 'key'),
              true /* tip */
            );
          }
        }
      }
      el.key = exp;
    }
  }

  function processRef (el) {
    var ref = getBindingAttr(el, 'ref');
    if (ref) {
      el.ref = ref;
      el.refInFor = checkInFor(el);
    }
  }

  function processFor (el) {
    var exp;
    if ((exp = getAndRemoveAttr(el, 'v-for'))) {
      var res = parseFor(exp);
      if (res) {
        extend(el, res);
      } else {
        warn$2(
          ("Invalid v-for expression: " + exp),
          el.rawAttrsMap['v-for']
        );
      }
    }
  }



  function parseFor (exp) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) { return }
    var res = {};
    res.for = inMatch[2].trim();
    var alias = inMatch[1].trim().replace(stripParensRE, '');
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      res.alias = alias.replace(forIteratorRE, '').trim();
      res.iterator1 = iteratorMatch[1].trim();
      if (iteratorMatch[2]) {
        res.iterator2 = iteratorMatch[2].trim();
      }
    } else {
      res.alias = alias;
    }
    return res
  }

  function processIf (el) {
    var exp = getAndRemoveAttr(el, 'v-if');
    if (exp) {
      el.if = exp;
      addIfCondition(el, {
        exp: exp,
        block: el
      });
    } else {
      if (getAndRemoveAttr(el, 'v-else') != null) {
        el.else = true;
      }
      var elseif = getAndRemoveAttr(el, 'v-else-if');
      if (elseif) {
        el.elseif = elseif;
      }
    }
  }

  function processIfConditions (el, parent) {
    var prev = findPrevElement(parent.children);
    if (prev && prev.if) {
      addIfCondition(prev, {
        exp: el.elseif,
        block: el
      });
    } else {
      warn$2(
        "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
        "used on element <" + (el.tag) + "> without corresponding v-if.",
        el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']
      );
    }
  }

  function findPrevElement (children) {
    var i = children.length;
    while (i--) {
      if (children[i].type === 1) {
        return children[i]
      } else {
        if (children[i].text !== ' ') {
          warn$2(
            "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
            "will be ignored.",
            children[i]
          );
        }
        children.pop();
      }
    }
  }

  function addIfCondition (el, condition) {
    if (!el.ifConditions) {
      el.ifConditions = [];
    }
    el.ifConditions.push(condition);
  }

  function processOnce (el) {
    var once$$1 = getAndRemoveAttr(el, 'v-once');
    if (once$$1 != null) {
      el.once = true;
    }
  }

  // handle content being passed to a component as slot,
  // e.g. <template slot="xxx">, <div slot-scope="xxx">
  function processSlotContent (el) {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if (slotScope) {
        warn$2(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          el.rawAttrsMap['scope'],
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if (el.attrsMap['v-for']) {
        warn$2(
          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
          "(v-for takes higher priority). Use a wrapper <template> for the " +
          "scoped slot to make it clearer.",
          el.rawAttrsMap['slot-scope'],
          true
        );
      }
      el.slotScope = slotScope;
    }

    // slot="xxx"
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
      }
    }

    // 2.6 v-slot syntax
    {
      if (el.tag === 'template') {
        // v-slot on <template>
        var slotBinding = getAndRemoveAttrByRegex(el, slotRE);
        if (slotBinding) {
          {
            if (el.slotTarget || el.slotScope) {
              warn$2(
                "Unexpected mixed usage of different slot syntaxes.",
                el
              );
            }
            if (el.parent && !maybeComponent(el.parent)) {
              warn$2(
                "<template v-slot> can only appear at the root level inside " +
                "the receiving component",
                el
              );
            }
          }
          var ref = getSlotName(slotBinding);
          var name = ref.name;
          var dynamic = ref.dynamic;
          el.slotTarget = name;
          el.slotTargetDynamic = dynamic;
          el.slotScope = slotBinding.value || emptySlotScopeToken; // force it into a scoped slot for perf
        }
      } else {
        // v-slot on component, denotes default slot
        var slotBinding$1 = getAndRemoveAttrByRegex(el, slotRE);
        if (slotBinding$1) {
          {
            if (!maybeComponent(el)) {
              warn$2(
                "v-slot can only be used on components or <template>.",
                slotBinding$1
              );
            }
            if (el.slotScope || el.slotTarget) {
              warn$2(
                "Unexpected mixed usage of different slot syntaxes.",
                el
              );
            }
            if (el.scopedSlots) {
              warn$2(
                "To avoid scope ambiguity, the default slot should also use " +
                "<template> syntax when there are other named slots.",
                slotBinding$1
              );
            }
          }
          // add the component's children to its default slot
          var slots = el.scopedSlots || (el.scopedSlots = {});
          var ref$1 = getSlotName(slotBinding$1);
          var name$1 = ref$1.name;
          var dynamic$1 = ref$1.dynamic;
          var slotContainer = slots[name$1] = createASTElement('template', [], el);
          slotContainer.slotTarget = name$1;
          slotContainer.slotTargetDynamic = dynamic$1;
          slotContainer.children = el.children.filter(function (c) {
            if (!c.slotScope) {
              c.parent = slotContainer;
              return true
            }
          });
          slotContainer.slotScope = slotBinding$1.value || emptySlotScopeToken;
          // remove children as they are returned from scopedSlots now
          el.children = [];
          // mark el non-plain so data gets generated
          el.plain = false;
        }
      }
    }
  }

  function getSlotName (binding) {
    var name = binding.name.replace(slotRE, '');
    if (!name) {
      if (binding.name[0] !== '#') {
        name = 'default';
      } else {
        warn$2(
          "v-slot shorthand syntax requires a slot name.",
          binding
        );
      }
    }
    return dynamicArgRE.test(name)
      // dynamic [name]
      ? { name: name.slice(1, -1), dynamic: true }
      // static name
      : { name: ("\"" + name + "\""), dynamic: false }
  }

  // handle <slot/> outlets
  function processSlotOutlet (el) {
    if (el.tag === 'slot') {
      el.slotName = getBindingAttr(el, 'name');
      if (el.key) {
        warn$2(
          "`key` does not work on <slot> because slots are abstract outlets " +
          "and can possibly expand into multiple elements. " +
          "Use the key on a wrapping element instead.",
          getRawBindingAttr(el, 'key')
        );
      }
    }
  }

  function processComponent (el) {
    var binding;
    if ((binding = getBindingAttr(el, 'is'))) {
      el.component = binding;
    }
    if (getAndRemoveAttr(el, 'inline-template') != null) {
      el.inlineTemplate = true;
    }
  }

  function processAttrs (el) {
    var list = el.attrsList;
    var i, l, name, rawName, value, modifiers, syncGen, isDynamic;
    for (i = 0, l = list.length; i < l; i++) {
      name = rawName = list[i].name;
      value = list[i].value;
      if (dirRE.test(name)) {
        // mark element as dynamic
        el.hasBindings = true;
        // modifiers
        modifiers = parseModifiers(name.replace(dirRE, ''));
        // support .foo shorthand syntax for the .prop modifier
        if (modifiers) {
          name = name.replace(modifierRE, '');
        }
        if (bindRE.test(name)) { // v-bind
          name = name.replace(bindRE, '');
          value = parseFilters(value);
          isDynamic = dynamicArgRE.test(name);
          if (isDynamic) {
            name = name.slice(1, -1);
          }
          if (
            value.trim().length === 0
          ) {
            warn$2(
              ("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"")
            );
          }
          if (modifiers) {
            if (modifiers.prop && !isDynamic) {
              name = camelize(name);
              if (name === 'innerHtml') { name = 'innerHTML'; }
            }
            if (modifiers.camel && !isDynamic) {
              name = camelize(name);
            }
            if (modifiers.sync) {
              syncGen = genAssignmentCode(value, "$event");
              if (!isDynamic) {
                addHandler(
                  el,
                  ("update:" + (camelize(name))),
                  syncGen,
                  null,
                  false,
                  warn$2,
                  list[i]
                );
                if (hyphenate(name) !== camelize(name)) {
                  addHandler(
                    el,
                    ("update:" + (hyphenate(name))),
                    syncGen,
                    null,
                    false,
                    warn$2,
                    list[i]
                  );
                }
              } else {
                // handler w/ dynamic event name
                addHandler(
                  el,
                  ("\"update:\"+(" + name + ")"),
                  syncGen,
                  null,
                  false,
                  warn$2,
                  list[i],
                  true // dynamic
                );
              }
            }
          }
          if ((modifiers && modifiers.prop) || (
            !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
          )) {
            addProp(el, name, value, list[i], isDynamic);
          } else {
            addAttr(el, name, value, list[i], isDynamic);
          }
        } else if (onRE.test(name)) { // v-on
          name = name.replace(onRE, '');
          isDynamic = dynamicArgRE.test(name);
          if (isDynamic) {
            name = name.slice(1, -1);
          }
          addHandler(el, name, value, modifiers, false, warn$2, list[i], isDynamic);
        } else { // normal directives
          name = name.replace(dirRE, '');
          // parse arg
          var argMatch = name.match(argRE);
          var arg = argMatch && argMatch[1];
          isDynamic = false;
          if (arg) {
            name = name.slice(0, -(arg.length + 1));
            if (dynamicArgRE.test(arg)) {
              arg = arg.slice(1, -1);
              isDynamic = true;
            }
          }
          addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i]);
          if (name === 'model') {
            checkForAliasModel(el, value);
          }
        }
      } else {
        // literal attribute
        {
          var res = parseText(value, delimiters);
          if (res) {
            warn$2(
              name + "=\"" + value + "\": " +
              'Interpolation inside attributes has been removed. ' +
              'Use v-bind or the colon shorthand instead. For example, ' +
              'instead of <div id="{{ val }}">, use <div :id="val">.',
              list[i]
            );
          }
        }
        addAttr(el, name, JSON.stringify(value), list[i]);
        // #6887 firefox doesn't update muted state if set via attribute
        // even immediately after element creation
        if (!el.component &&
            name === 'muted' &&
            platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, 'true', list[i]);
        }
      }
    }
  }

  function checkInFor (el) {
    var parent = el;
    while (parent) {
      if (parent.for !== undefined) {
        return true
      }
      parent = parent.parent;
    }
    return false
  }

  function parseModifiers (name) {
    var match = name.match(modifierRE);
    if (match) {
      var ret = {};
      match.forEach(function (m) { ret[m.slice(1)] = true; });
      return ret
    }
  }

  function makeAttrsMap (attrs) {
    var map = {};
    for (var i = 0, l = attrs.length; i < l; i++) {
      if (
        map[attrs[i].name] && !isIE && !isEdge
      ) {
        warn$2('duplicate attribute: ' + attrs[i].name, attrs[i]);
      }
      map[attrs[i].name] = attrs[i].value;
    }
    return map
  }

  // for script (e.g. type="x/template") or style, do not decode content
  function isTextTag (el) {
    return el.tag === 'script' || el.tag === 'style'
  }

  function isForbiddenTag (el) {
    return (
      el.tag === 'style' ||
      (el.tag === 'script' && (
        !el.attrsMap.type ||
        el.attrsMap.type === 'text/javascript'
      ))
    )
  }

  var ieNSBug = /^xmlns:NS\d+/;
  var ieNSPrefix = /^NS\d+:/;

  /* istanbul ignore next */
  function guardIESVGBug (attrs) {
    var res = [];
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (!ieNSBug.test(attr.name)) {
        attr.name = attr.name.replace(ieNSPrefix, '');
        res.push(attr);
      }
    }
    return res
  }

  function checkForAliasModel (el, value) {
    var _el = el;
    while (_el) {
      if (_el.for && _el.alias === value) {
        warn$2(
          "<" + (el.tag) + " v-model=\"" + value + "\">: " +
          "You are binding v-model directly to a v-for iteration alias. " +
          "This will not be able to modify the v-for source array because " +
          "writing to the alias is like modifying a function local variable. " +
          "Consider using an array of objects and use v-model on an object property instead.",
          el.rawAttrsMap['v-model']
        );
      }
      _el = _el.parent;
    }
  }

  /*  */

  function preTransformNode (el, options) {
    if (el.tag === 'input') {
      var map = el.attrsMap;
      if (!map['v-model']) {
        return
      }

      var typeBinding;
      if (map[':type'] || map['v-bind:type']) {
        typeBinding = getBindingAttr(el, 'type');
      }
      if (!map.type && !typeBinding && map['v-bind']) {
        typeBinding = "(" + (map['v-bind']) + ").type";
      }

      if (typeBinding) {
        var ifCondition = getAndRemoveAttr(el, 'v-if', true);
        var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
        var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
        var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
        // 1. checkbox
        var branch0 = cloneASTElement(el);
        // process for on the main node
        processFor(branch0);
        addRawAttr(branch0, 'type', 'checkbox');
        processElement(branch0, options);
        branch0.processed = true; // prevent it from double-processed
        branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
        addIfCondition(branch0, {
          exp: branch0.if,
          block: branch0
        });
        // 2. add radio else-if condition
        var branch1 = cloneASTElement(el);
        getAndRemoveAttr(branch1, 'v-for', true);
        addRawAttr(branch1, 'type', 'radio');
        processElement(branch1, options);
        addIfCondition(branch0, {
          exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
          block: branch1
        });
        // 3. other
        var branch2 = cloneASTElement(el);
        getAndRemoveAttr(branch2, 'v-for', true);
        addRawAttr(branch2, ':type', typeBinding);
        processElement(branch2, options);
        addIfCondition(branch0, {
          exp: ifCondition,
          block: branch2
        });

        if (hasElse) {
          branch0.else = true;
        } else if (elseIfCondition) {
          branch0.elseif = elseIfCondition;
        }

        return branch0
      }
    }
  }

  function cloneASTElement (el) {
    return createASTElement(el.tag, el.attrsList.slice(), el.parent)
  }

  var model$1 = {
    preTransformNode: preTransformNode
  };

  var modules$1 = [
    klass$1,
    style$1,
    model$1
  ];

  /*  */

  function text (el, dir) {
    if (dir.value) {
      addProp(el, 'textContent', ("_s(" + (dir.value) + ")"), dir);
    }
  }

  /*  */

  function html (el, dir) {
    if (dir.value) {
      addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"), dir);
    }
  }

  var directives$1 = {
    model: model,
    text: text,
    html: html
  };

  /*  */

  var baseOptions = {
    expectHTML: true,
    modules: modules$1,
    directives: directives$1,
    isPreTag: isPreTag,
    isUnaryTag: isUnaryTag,
    mustUseProp: mustUseProp,
    canBeLeftOpenTag: canBeLeftOpenTag,
    isReservedTag: isReservedTag,
    getTagNamespace: getTagNamespace,
    staticKeys: genStaticKeys(modules$1)
  };

  /*  */

  var isStaticKey;
  var isPlatformReservedTag;

  var genStaticKeysCached = cached(genStaticKeys$1);

  /**
   * Goal of the optimizer: walk the generated template AST tree
   * and detect sub-trees that are purely static, i.e. parts of
   * the DOM that never needs to change.
   *
   * Once we detect these sub-trees, we can:
   *
   * 1. Hoist them into constants, so that we no longer need to
   *    create fresh nodes for them on each re-render;
   * 2. Completely skip them in the patching process.
   */
  function optimize (root, options) {
    if (!root) { return }
    isStaticKey = genStaticKeysCached(options.staticKeys || '');
    isPlatformReservedTag = options.isReservedTag || no;
    // first pass: mark all non-static nodes.
    markStatic$1(root);
    // second pass: mark static roots.
    markStaticRoots(root, false);
  }

  function genStaticKeys$1 (keys) {
    return makeMap(
      'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
      (keys ? ',' + keys : '')
    )
  }

  function markStatic$1 (node) {
    node.static = isStatic(node);
    if (node.type === 1) {
      // do not make component slot content static. this avoids
      // 1. components not able to mutate slot nodes
      // 2. static slot content fails for hot-reloading
      if (
        !isPlatformReservedTag(node.tag) &&
        node.tag !== 'slot' &&
        node.attrsMap['inline-template'] == null
      ) {
        return
      }
      for (var i = 0, l = node.children.length; i < l; i++) {
        var child = node.children[i];
        markStatic$1(child);
        if (!child.static) {
          node.static = false;
        }
      }
      if (node.ifConditions) {
        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
          var block = node.ifConditions[i$1].block;
          markStatic$1(block);
          if (!block.static) {
            node.static = false;
          }
        }
      }
    }
  }

  function markStaticRoots (node, isInFor) {
    if (node.type === 1) {
      if (node.static || node.once) {
        node.staticInFor = isInFor;
      }
      // For a node to qualify as a static root, it should have children that
      // are not just static text. Otherwise the cost of hoisting out will
      // outweigh the benefits and it's better off to just always render it fresh.
      if (node.static && node.children.length && !(
        node.children.length === 1 &&
        node.children[0].type === 3
      )) {
        node.staticRoot = true;
        return
      } else {
        node.staticRoot = false;
      }
      if (node.children) {
        for (var i = 0, l = node.children.length; i < l; i++) {
          markStaticRoots(node.children[i], isInFor || !!node.for);
        }
      }
      if (node.ifConditions) {
        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
          markStaticRoots(node.ifConditions[i$1].block, isInFor);
        }
      }
    }
  }

  function isStatic (node) {
    if (node.type === 2) { // expression
      return false
    }
    if (node.type === 3) { // text
      return true
    }
    return !!(node.pre || (
      !node.hasBindings && // no dynamic bindings
      !node.if && !node.for && // not v-if or v-for or v-else
      !isBuiltInTag(node.tag) && // not a built-in
      isPlatformReservedTag(node.tag) && // not a component
      !isDirectChildOfTemplateFor(node) &&
      Object.keys(node).every(isStaticKey)
    ))
  }

  function isDirectChildOfTemplateFor (node) {
    while (node.parent) {
      node = node.parent;
      if (node.tag !== 'template') {
        return false
      }
      if (node.for) {
        return true
      }
    }
    return false
  }

  /*  */

  var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
  var fnInvokeRE = /\([^)]*?\);*$/;
  var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

  // KeyboardEvent.keyCode aliases
  var keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    'delete': [8, 46]
  };

  // KeyboardEvent.key aliases
  var keyNames = {
    // #7880: IE11 and Edge use `Esc` for Escape key name.
    esc: ['Esc', 'Escape'],
    tab: 'Tab',
    enter: 'Enter',
    // #9112: IE11 uses `Spacebar` for Space key name.
    space: [' ', 'Spacebar'],
    // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
    up: ['Up', 'ArrowUp'],
    left: ['Left', 'ArrowLeft'],
    right: ['Right', 'ArrowRight'],
    down: ['Down', 'ArrowDown'],
    // #9112: IE11 uses `Del` for Delete key name.
    'delete': ['Backspace', 'Delete', 'Del']
  };

  // #4868: modifiers that prevent the execution of the listener
  // need to explicitly return null so that we can determine whether to remove
  // the listener for .once
  var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

  var modifierCode = {
    stop: '$event.stopPropagation();',
    prevent: '$event.preventDefault();',
    self: genGuard("$event.target !== $event.currentTarget"),
    ctrl: genGuard("!$event.ctrlKey"),
    shift: genGuard("!$event.shiftKey"),
    alt: genGuard("!$event.altKey"),
    meta: genGuard("!$event.metaKey"),
    left: genGuard("'button' in $event && $event.button !== 0"),
    middle: genGuard("'button' in $event && $event.button !== 1"),
    right: genGuard("'button' in $event && $event.button !== 2")
  };

  function genHandlers (
    events,
    isNative
  ) {
    var prefix = isNative ? 'nativeOn:' : 'on:';
    var staticHandlers = "";
    var dynamicHandlers = "";
    for (var name in events) {
      var handlerCode = genHandler(events[name]);
      if (events[name] && events[name].dynamic) {
        dynamicHandlers += name + "," + handlerCode + ",";
      } else {
        staticHandlers += "\"" + name + "\":" + handlerCode + ",";
      }
    }
    staticHandlers = "{" + (staticHandlers.slice(0, -1)) + "}";
    if (dynamicHandlers) {
      return prefix + "_d(" + staticHandlers + ",[" + (dynamicHandlers.slice(0, -1)) + "])"
    } else {
      return prefix + staticHandlers
    }
  }

  function genHandler (handler) {
    if (!handler) {
      return 'function(){}'
    }

    if (Array.isArray(handler)) {
      return ("[" + (handler.map(function (handler) { return genHandler(handler); }).join(',')) + "]")
    }

    var isMethodPath = simplePathRE.test(handler.value);
    var isFunctionExpression = fnExpRE.test(handler.value);
    var isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));

    if (!handler.modifiers) {
      if (isMethodPath || isFunctionExpression) {
        return handler.value
      }
      return ("function($event){" + (isFunctionInvocation ? ("return " + (handler.value)) : handler.value) + "}") // inline statement
    } else {
      var code = '';
      var genModifierCode = '';
      var keys = [];
      for (var key in handler.modifiers) {
        if (modifierCode[key]) {
          genModifierCode += modifierCode[key];
          // left/right
          if (keyCodes[key]) {
            keys.push(key);
          }
        } else if (key === 'exact') {
          var modifiers = (handler.modifiers);
          genModifierCode += genGuard(
            ['ctrl', 'shift', 'alt', 'meta']
              .filter(function (keyModifier) { return !modifiers[keyModifier]; })
              .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
              .join('||')
          );
        } else {
          keys.push(key);
        }
      }
      if (keys.length) {
        code += genKeyFilter(keys);
      }
      // Make sure modifiers like prevent and stop get executed after key filtering
      if (genModifierCode) {
        code += genModifierCode;
      }
      var handlerCode = isMethodPath
        ? ("return " + (handler.value) + "($event)")
        : isFunctionExpression
          ? ("return (" + (handler.value) + ")($event)")
          : isFunctionInvocation
            ? ("return " + (handler.value))
            : handler.value;
      return ("function($event){" + code + handlerCode + "}")
    }
  }

  function genKeyFilter (keys) {
    return (
      // make sure the key filters only apply to KeyboardEvents
      // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
      // key events that do not have keyCode property...
      "if(!$event.type.indexOf('key')&&" +
      (keys.map(genFilterCode).join('&&')) + ")return null;"
    )
  }

  function genFilterCode (key) {
    var keyVal = parseInt(key, 10);
    if (keyVal) {
      return ("$event.keyCode!==" + keyVal)
    }
    var keyCode = keyCodes[key];
    var keyName = keyNames[key];
    return (
      "_k($event.keyCode," +
      (JSON.stringify(key)) + "," +
      (JSON.stringify(keyCode)) + "," +
      "$event.key," +
      "" + (JSON.stringify(keyName)) +
      ")"
    )
  }

  /*  */

  function on (el, dir) {
    if (dir.modifiers) {
      warn("v-on without argument does not support modifiers.");
    }
    el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
  }

  /*  */

  function bind$1 (el, dir) {
    el.wrapData = function (code) {
      return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
    };
  }

  /*  */

  var baseDirectives = {
    on: on,
    bind: bind$1,
    cloak: noop
  };

  /*  */





  var CodegenState = function CodegenState (options) {
    this.options = options;
    this.warn = options.warn || baseWarn;
    this.transforms = pluckModuleFunction(options.modules, 'transformCode');
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
    this.directives = extend(extend({}, baseDirectives), options.directives);
    var isReservedTag = options.isReservedTag || no;
    this.maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };
    this.onceId = 0;
    this.staticRenderFns = [];
    this.pre = false;
  };



  function generate (
    ast,
    options
  ) {
    var state = new CodegenState(options);
    var code = ast ? genElement(ast, state) : '_c("div")';
    return {
      render: ("with(this){return " + code + "}"),
      staticRenderFns: state.staticRenderFns
    }
  }

  function genElement (el, state) {
    if (el.parent) {
      el.pre = el.pre || el.parent.pre;
    }

    if (el.staticRoot && !el.staticProcessed) {
      return genStatic(el, state)
    } else if (el.once && !el.onceProcessed) {
      return genOnce(el, state)
    } else if (el.for && !el.forProcessed) {
      return genFor(el, state)
    } else if (el.if && !el.ifProcessed) {
      return genIf(el, state)
    } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
      return genChildren(el, state) || 'void 0'
    } else if (el.tag === 'slot') {
      return genSlot(el, state)
    } else {
      // component or element
      var code;
      if (el.component) {
        code = genComponent(el.component, el, state);
      } else {
        var data;
        if (!el.plain || (el.pre && state.maybeComponent(el))) {
          data = genData$2(el, state);
        }

        var children = el.inlineTemplate ? null : genChildren(el, state, true);
        code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
      }
      // module transforms
      for (var i = 0; i < state.transforms.length; i++) {
        code = state.transforms[i](el, code);
      }
      return code
    }
  }

  // hoist static sub-trees out
  function genStatic (el, state) {
    el.staticProcessed = true;
    // Some elements (templates) need to behave differently inside of a v-pre
    // node.  All pre nodes are static roots, so we can use this as a location to
    // wrap a state change and reset it upon exiting the pre node.
    var originalPreState = state.pre;
    if (el.pre) {
      state.pre = el.pre;
    }
    state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
    state.pre = originalPreState;
    return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
  }

  // v-once
  function genOnce (el, state) {
    el.onceProcessed = true;
    if (el.if && !el.ifProcessed) {
      return genIf(el, state)
    } else if (el.staticInFor) {
      var key = '';
      var parent = el.parent;
      while (parent) {
        if (parent.for) {
          key = parent.key;
          break
        }
        parent = parent.parent;
      }
      if (!key) {
        state.warn(
          "v-once can only be used inside v-for that is keyed. ",
          el.rawAttrsMap['v-once']
        );
        return genElement(el, state)
      }
      return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
    } else {
      return genStatic(el, state)
    }
  }

  function genIf (
    el,
    state,
    altGen,
    altEmpty
  ) {
    el.ifProcessed = true; // avoid recursion
    return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
  }

  function genIfConditions (
    conditions,
    state,
    altGen,
    altEmpty
  ) {
    if (!conditions.length) {
      return altEmpty || '_e()'
    }

    var condition = conditions.shift();
    if (condition.exp) {
      return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
    } else {
      return ("" + (genTernaryExp(condition.block)))
    }

    // v-if with v-once should generate code like (a)?_m(0):_m(1)
    function genTernaryExp (el) {
      return altGen
        ? altGen(el, state)
        : el.once
          ? genOnce(el, state)
          : genElement(el, state)
    }
  }

  function genFor (
    el,
    state,
    altGen,
    altHelper
  ) {
    var exp = el.for;
    var alias = el.alias;
    var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
    var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

    if (state.maybeComponent(el) &&
      el.tag !== 'slot' &&
      el.tag !== 'template' &&
      !el.key
    ) {
      state.warn(
        "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
        "v-for should have explicit keys. " +
        "See https://vuejs.org/guide/list.html#key for more info.",
        el.rawAttrsMap['v-for'],
        true /* tip */
      );
    }

    el.forProcessed = true; // avoid recursion
    return (altHelper || '_l') + "((" + exp + ")," +
      "function(" + alias + iterator1 + iterator2 + "){" +
        "return " + ((altGen || genElement)(el, state)) +
      '})'
  }

  function genData$2 (el, state) {
    var data = '{';

    // directives first.
    // directives may mutate the el's other properties before they are generated.
    var dirs = genDirectives(el, state);
    if (dirs) { data += dirs + ','; }

    // key
    if (el.key) {
      data += "key:" + (el.key) + ",";
    }
    // ref
    if (el.ref) {
      data += "ref:" + (el.ref) + ",";
    }
    if (el.refInFor) {
      data += "refInFor:true,";
    }
    // pre
    if (el.pre) {
      data += "pre:true,";
    }
    // record original tag name for components using "is" attribute
    if (el.component) {
      data += "tag:\"" + (el.tag) + "\",";
    }
    // module data generation functions
    for (var i = 0; i < state.dataGenFns.length; i++) {
      data += state.dataGenFns[i](el);
    }
    // attributes
    if (el.attrs) {
      data += "attrs:" + (genProps(el.attrs)) + ",";
    }
    // DOM props
    if (el.props) {
      data += "domProps:" + (genProps(el.props)) + ",";
    }
    // event handlers
    if (el.events) {
      data += (genHandlers(el.events, false)) + ",";
    }
    if (el.nativeEvents) {
      data += (genHandlers(el.nativeEvents, true)) + ",";
    }
    // slot target
    // only for non-scoped slots
    if (el.slotTarget && !el.slotScope) {
      data += "slot:" + (el.slotTarget) + ",";
    }
    // scoped slots
    if (el.scopedSlots) {
      data += (genScopedSlots(el, el.scopedSlots, state)) + ",";
    }
    // component v-model
    if (el.model) {
      data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
    }
    // inline-template
    if (el.inlineTemplate) {
      var inlineTemplate = genInlineTemplate(el, state);
      if (inlineTemplate) {
        data += inlineTemplate + ",";
      }
    }
    data = data.replace(/,$/, '') + '}';
    // v-bind dynamic argument wrap
    // v-bind with dynamic arguments must be applied using the same v-bind object
    // merge helper so that class/style/mustUseProp attrs are handled correctly.
    if (el.dynamicAttrs) {
      data = "_b(" + data + ",\"" + (el.tag) + "\"," + (genProps(el.dynamicAttrs)) + ")";
    }
    // v-bind data wrap
    if (el.wrapData) {
      data = el.wrapData(data);
    }
    // v-on data wrap
    if (el.wrapListeners) {
      data = el.wrapListeners(data);
    }
    return data
  }

  function genDirectives (el, state) {
    var dirs = el.directives;
    if (!dirs) { return }
    var res = 'directives:[';
    var hasRuntime = false;
    var i, l, dir, needRuntime;
    for (i = 0, l = dirs.length; i < l; i++) {
      dir = dirs[i];
      needRuntime = true;
      var gen = state.directives[dir.name];
      if (gen) {
        // compile-time directive that manipulates AST.
        // returns true if it also needs a runtime counterpart.
        needRuntime = !!gen(el, dir, state.warn);
      }
      if (needRuntime) {
        hasRuntime = true;
        res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:" + (dir.isDynamicArg ? dir.arg : ("\"" + (dir.arg) + "\""))) : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
      }
    }
    if (hasRuntime) {
      return res.slice(0, -1) + ']'
    }
  }

  function genInlineTemplate (el, state) {
    var ast = el.children[0];
    if (el.children.length !== 1 || ast.type !== 1) {
      state.warn(
        'Inline-template components must have exactly one child element.',
        { start: el.start }
      );
    }
    if (ast && ast.type === 1) {
      var inlineRenderFns = generate(ast, state.options);
      return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
    }
  }

  function genScopedSlots (
    el,
    slots,
    state
  ) {
    // by default scoped slots are considered "stable", this allows child
    // components with only scoped slots to skip forced updates from parent.
    // but in some cases we have to bail-out of this optimization
    // for example if the slot contains dynamic names, has v-if or v-for on them...
    var needsForceUpdate = el.for || Object.keys(slots).some(function (key) {
      var slot = slots[key];
      return (
        slot.slotTargetDynamic ||
        slot.if ||
        slot.for ||
        containsSlotChild(slot) // is passing down slot from parent which may be dynamic
      )
    });

    // #9534: if a component with scoped slots is inside a conditional branch,
    // it's possible for the same component to be reused but with different
    // compiled slot content. To avoid that, we generate a unique key based on
    // the generated code of all the slot contents.
    var needsKey = !!el.if;

    // OR when it is inside another scoped slot or v-for (the reactivity may be
    // disconnected due to the intermediate scope variable)
    // #9438, #9506
    // TODO: this can be further optimized by properly analyzing in-scope bindings
    // and skip force updating ones that do not actually use scope variables.
    if (!needsForceUpdate) {
      var parent = el.parent;
      while (parent) {
        if (
          (parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
          parent.for
        ) {
          needsForceUpdate = true;
          break
        }
        if (parent.if) {
          needsKey = true;
        }
        parent = parent.parent;
      }
    }

    var generatedSlots = Object.keys(slots)
      .map(function (key) { return genScopedSlot(slots[key], state); })
      .join(',');

    return ("scopedSlots:_u([" + generatedSlots + "]" + (needsForceUpdate ? ",null,true" : "") + (!needsForceUpdate && needsKey ? (",null,false," + (hash(generatedSlots))) : "") + ")")
  }

  function hash(str) {
    var hash = 5381;
    var i = str.length;
    while(i) {
      hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    return hash >>> 0
  }

  function containsSlotChild (el) {
    if (el.type === 1) {
      if (el.tag === 'slot') {
        return true
      }
      return el.children.some(containsSlotChild)
    }
    return false
  }

  function genScopedSlot (
    el,
    state
  ) {
    var isLegacySyntax = el.attrsMap['slot-scope'];
    if (el.if && !el.ifProcessed && !isLegacySyntax) {
      return genIf(el, state, genScopedSlot, "null")
    }
    if (el.for && !el.forProcessed) {
      return genFor(el, state, genScopedSlot)
    }
    var slotScope = el.slotScope === emptySlotScopeToken
      ? ""
      : String(el.slotScope);
    var fn = "function(" + slotScope + "){" +
      "return " + (el.tag === 'template'
        ? el.if && isLegacySyntax
          ? ("(" + (el.if) + ")?" + (genChildren(el, state) || 'undefined') + ":undefined")
          : genChildren(el, state) || 'undefined'
        : genElement(el, state)) + "}";
    // reverse proxy v-slot without scope on this.$slots
    var reverseProxy = slotScope ? "" : ",proxy:true";
    return ("{key:" + (el.slotTarget || "\"default\"") + ",fn:" + fn + reverseProxy + "}")
  }

  function genChildren (
    el,
    state,
    checkSkip,
    altGenElement,
    altGenNode
  ) {
    var children = el.children;
    if (children.length) {
      var el$1 = children[0];
      // optimize single v-for
      if (children.length === 1 &&
        el$1.for &&
        el$1.tag !== 'template' &&
        el$1.tag !== 'slot'
      ) {
        var normalizationType = checkSkip
          ? state.maybeComponent(el$1) ? ",1" : ",0"
          : "";
        return ("" + ((altGenElement || genElement)(el$1, state)) + normalizationType)
      }
      var normalizationType$1 = checkSkip
        ? getNormalizationType(children, state.maybeComponent)
        : 0;
      var gen = altGenNode || genNode;
      return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType$1 ? ("," + normalizationType$1) : ''))
    }
  }

  // determine the normalization needed for the children array.
  // 0: no normalization needed
  // 1: simple normalization needed (possible 1-level deep nested array)
  // 2: full normalization needed
  function getNormalizationType (
    children,
    maybeComponent
  ) {
    var res = 0;
    for (var i = 0; i < children.length; i++) {
      var el = children[i];
      if (el.type !== 1) {
        continue
      }
      if (needsNormalization(el) ||
          (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
        res = 2;
        break
      }
      if (maybeComponent(el) ||
          (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
        res = 1;
      }
    }
    return res
  }

  function needsNormalization (el) {
    return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
  }

  function genNode (node, state) {
    if (node.type === 1) {
      return genElement(node, state)
    } else if (node.type === 3 && node.isComment) {
      return genComment(node)
    } else {
      return genText(node)
    }
  }

  function genText (text) {
    return ("_v(" + (text.type === 2
      ? text.expression // no need for () because already wrapped in _s()
      : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
  }

  function genComment (comment) {
    return ("_e(" + (JSON.stringify(comment.text)) + ")")
  }

  function genSlot (el, state) {
    var slotName = el.slotName || '"default"';
    var children = genChildren(el, state);
    var res = "_t(" + slotName + (children ? ("," + children) : '');
    var attrs = el.attrs || el.dynamicAttrs
      ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(function (attr) { return ({
          // slot props are camelized
          name: camelize(attr.name),
          value: attr.value,
          dynamic: attr.dynamic
        }); }))
      : null;
    var bind$$1 = el.attrsMap['v-bind'];
    if ((attrs || bind$$1) && !children) {
      res += ",null";
    }
    if (attrs) {
      res += "," + attrs;
    }
    if (bind$$1) {
      res += (attrs ? '' : ',null') + "," + bind$$1;
    }
    return res + ')'
  }

  // componentName is el.component, take it as argument to shun flow's pessimistic refinement
  function genComponent (
    componentName,
    el,
    state
  ) {
    var children = el.inlineTemplate ? null : genChildren(el, state, true);
    return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
  }

  function genProps (props) {
    var staticProps = "";
    var dynamicProps = "";
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      var value = transformSpecialNewlines(prop.value);
      if (prop.dynamic) {
        dynamicProps += (prop.name) + "," + value + ",";
      } else {
        staticProps += "\"" + (prop.name) + "\":" + value + ",";
      }
    }
    staticProps = "{" + (staticProps.slice(0, -1)) + "}";
    if (dynamicProps) {
      return ("_d(" + staticProps + ",[" + (dynamicProps.slice(0, -1)) + "])")
    } else {
      return staticProps
    }
  }

  // #3895, #4268
  function transformSpecialNewlines (text) {
    return text
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')
  }

  /*  */



  // these keywords should not appear inside expressions, but operators like
  // typeof, instanceof and in are allowed
  var prohibitedKeywordRE = new RegExp('\\b' + (
    'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
    'super,throw,while,yield,delete,export,import,return,switch,default,' +
    'extends,finally,continue,debugger,function,arguments'
  ).split(',').join('\\b|\\b') + '\\b');

  // these unary operators should not be used as property/method names
  var unaryOperatorsRE = new RegExp('\\b' + (
    'delete,typeof,void'
  ).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

  // strip strings in expressions
  var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

  // detect problematic expressions in a template
  function detectErrors (ast, warn) {
    if (ast) {
      checkNode(ast, warn);
    }
  }

  function checkNode (node, warn) {
    if (node.type === 1) {
      for (var name in node.attrsMap) {
        if (dirRE.test(name)) {
          var value = node.attrsMap[name];
          if (value) {
            var range = node.rawAttrsMap[name];
            if (name === 'v-for') {
              checkFor(node, ("v-for=\"" + value + "\""), warn, range);
            } else if (name === 'v-slot' || name[0] === '#') {
              checkFunctionParameterExpression(value, (name + "=\"" + value + "\""), warn, range);
            } else if (onRE.test(name)) {
              checkEvent(value, (name + "=\"" + value + "\""), warn, range);
            } else {
              checkExpression(value, (name + "=\"" + value + "\""), warn, range);
            }
          }
        }
      }
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          checkNode(node.children[i], warn);
        }
      }
    } else if (node.type === 2) {
      checkExpression(node.expression, node.text, warn, node);
    }
  }

  function checkEvent (exp, text, warn, range) {
    var stripped = exp.replace(stripStringRE, '');
    var keywordMatch = stripped.match(unaryOperatorsRE);
    if (keywordMatch && stripped.charAt(keywordMatch.index - 1) !== '$') {
      warn(
        "avoid using JavaScript unary operator as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim()),
        range
      );
    }
    checkExpression(exp, text, warn, range);
  }

  function checkFor (node, text, warn, range) {
    checkExpression(node.for || '', text, warn, range);
    checkIdentifier(node.alias, 'v-for alias', text, warn, range);
    checkIdentifier(node.iterator1, 'v-for iterator', text, warn, range);
    checkIdentifier(node.iterator2, 'v-for iterator', text, warn, range);
  }

  function checkIdentifier (
    ident,
    type,
    text,
    warn,
    range
  ) {
    if (typeof ident === 'string') {
      try {
        new Function(("var " + ident + "=_"));
      } catch (e) {
        warn(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())), range);
      }
    }
  }

  function checkExpression (exp, text, warn, range) {
    try {
      new Function(("return " + exp));
    } catch (e) {
      var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
      if (keywordMatch) {
        warn(
          "avoid using JavaScript keyword as property name: " +
          "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim()),
          range
        );
      } else {
        warn(
          "invalid expression: " + (e.message) + " in\n\n" +
          "    " + exp + "\n\n" +
          "  Raw expression: " + (text.trim()) + "\n",
          range
        );
      }
    }
  }

  function checkFunctionParameterExpression (exp, text, warn, range) {
    try {
      new Function(exp, '');
    } catch (e) {
      warn(
        "invalid function parameter expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n",
        range
      );
    }
  }

  /*  */

  var range = 2;

  function generateCodeFrame (
    source,
    start,
    end
  ) {
    if ( start === void 0 ) start = 0;
    if ( end === void 0 ) end = source.length;

    var lines = source.split(/\r?\n/);
    var count = 0;
    var res = [];
    for (var i = 0; i < lines.length; i++) {
      count += lines[i].length + 1;
      if (count >= start) {
        for (var j = i - range; j <= i + range || end > count; j++) {
          if (j < 0 || j >= lines.length) { continue }
          res.push(("" + (j + 1) + (repeat$1(" ", 3 - String(j + 1).length)) + "|  " + (lines[j])));
          var lineLength = lines[j].length;
          if (j === i) {
            // push underline
            var pad = start - (count - lineLength) + 1;
            var length = end > count ? lineLength - pad : end - start;
            res.push("   |  " + repeat$1(" ", pad) + repeat$1("^", length));
          } else if (j > i) {
            if (end > count) {
              var length$1 = Math.min(end - count, lineLength);
              res.push("   |  " + repeat$1("^", length$1));
            }
            count += lineLength + 1;
          }
        }
        break
      }
    }
    return res.join('\n')
  }

  function repeat$1 (str, n) {
    var result = '';
    if (n > 0) {
      while (true) { // eslint-disable-line
        if (n & 1) { result += str; }
        n >>>= 1;
        if (n <= 0) { break }
        str += str;
      }
    }
    return result
  }

  /*  */



  function createFunction (code, errors) {
    try {
      return new Function(code)
    } catch (err) {
      errors.push({ err: err, code: code });
      return noop
    }
  }

  function createCompileToFunctionFn (compile) {
    var cache = Object.create(null);

    return function compileToFunctions (
      template,
      options,
      vm
    ) {
      options = extend({}, options);
      var warn$$1 = options.warn || warn;
      delete options.warn;

      /* istanbul ignore if */
      {
        // detect possible CSP restriction
        try {
          new Function('return 1');
        } catch (e) {
          if (e.toString().match(/unsafe-eval|CSP/)) {
            warn$$1(
              'It seems you are using the standalone build of Vue.js in an ' +
              'environment with Content Security Policy that prohibits unsafe-eval. ' +
              'The template compiler cannot work in this environment. Consider ' +
              'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
              'templates into render functions.'
            );
          }
        }
      }

      // check cache
      var key = options.delimiters
        ? String(options.delimiters) + template
        : template;
      if (cache[key]) {
        return cache[key]
      }

      // compile
      var compiled = compile(template, options);

      // check compilation errors/tips
      {
        if (compiled.errors && compiled.errors.length) {
          if (options.outputSourceRange) {
            compiled.errors.forEach(function (e) {
              warn$$1(
                "Error compiling template:\n\n" + (e.msg) + "\n\n" +
                generateCodeFrame(template, e.start, e.end),
                vm
              );
            });
          } else {
            warn$$1(
              "Error compiling template:\n\n" + template + "\n\n" +
              compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
              vm
            );
          }
        }
        if (compiled.tips && compiled.tips.length) {
          if (options.outputSourceRange) {
            compiled.tips.forEach(function (e) { return tip(e.msg, vm); });
          } else {
            compiled.tips.forEach(function (msg) { return tip(msg, vm); });
          }
        }
      }

      // turn code into functions
      var res = {};
      var fnGenErrors = [];
      res.render = createFunction(compiled.render, fnGenErrors);
      res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
        return createFunction(code, fnGenErrors)
      });

      // check function generation errors.
      // this should only happen if there is a bug in the compiler itself.
      // mostly for codegen development use
      /* istanbul ignore if */
      {
        if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
          warn$$1(
            "Failed to generate render function:\n\n" +
            fnGenErrors.map(function (ref) {
              var err = ref.err;
              var code = ref.code;

              return ((err.toString()) + " in\n\n" + code + "\n");
          }).join('\n'),
            vm
          );
        }
      }

      return (cache[key] = res)
    }
  }

  /*  */

  function createCompilerCreator (baseCompile) {
    return function createCompiler (baseOptions) {
      function compile (
        template,
        options
      ) {
        var finalOptions = Object.create(baseOptions);
        var errors = [];
        var tips = [];

        var warn = function (msg, range, tip) {
          (tip ? tips : errors).push(msg);
        };

        if (options) {
          if (options.outputSourceRange) {
            // $flow-disable-line
            var leadingSpaceLength = template.match(/^\s*/)[0].length;

            warn = function (msg, range, tip) {
              var data = { msg: msg };
              if (range) {
                if (range.start != null) {
                  data.start = range.start + leadingSpaceLength;
                }
                if (range.end != null) {
                  data.end = range.end + leadingSpaceLength;
                }
              }
              (tip ? tips : errors).push(data);
            };
          }
          // merge custom modules
          if (options.modules) {
            finalOptions.modules =
              (baseOptions.modules || []).concat(options.modules);
          }
          // merge custom directives
          if (options.directives) {
            finalOptions.directives = extend(
              Object.create(baseOptions.directives || null),
              options.directives
            );
          }
          // copy other options
          for (var key in options) {
            if (key !== 'modules' && key !== 'directives') {
              finalOptions[key] = options[key];
            }
          }
        }

        finalOptions.warn = warn;

        var compiled = baseCompile(template.trim(), finalOptions);
        {
          detectErrors(compiled.ast, warn);
        }
        compiled.errors = errors;
        compiled.tips = tips;
        return compiled
      }

      return {
        compile: compile,
        compileToFunctions: createCompileToFunctionFn(compile)
      }
    }
  }

  /*  */

  // `createCompilerCreator` allows creating compilers that use alternative
  // parser/optimizer/codegen, e.g the SSR optimizing compiler.
  // Here we just export a default compiler using the default parts.
  var createCompiler = createCompilerCreator(function baseCompile (
    template,
    options
  ) {
    var ast = parse(template.trim(), options);
    if (options.optimize !== false) {
      optimize(ast, options);
    }
    var code = generate(ast, options);
    return {
      ast: ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    }
  });

  /*  */

  var ref$1 = createCompiler(baseOptions);
  var compile = ref$1.compile;
  var compileToFunctions = ref$1.compileToFunctions;

  /*  */

  // check whether current browser encodes a char inside attribute values
  var div;
  function getShouldDecode (href) {
    div = div || document.createElement('div');
    div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
    return div.innerHTML.indexOf('&#10;') > 0
  }

  // #3663: IE encodes newlines inside attribute values while other browsers don't
  var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
  // #6828: chrome encodes content in a[href]
  var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

  /*  */

  var idToTemplate = cached(function (id) {
    var el = query(id);
    return el && el.innerHTML
  });

  var mount = Vue.prototype.$mount;
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && query(el);

    /* istanbul ignore if */
    if (el === document.body || el === document.documentElement) {
      warn(
        "Do not mount Vue to <html> or <body> - mount to normal elements instead."
      );
      return this
    }

    var options = this.$options;
    // resolve template/el and convert to render function
    if (!options.render) {
      var template = options.template;
      if (template) {
        if (typeof template === 'string') {
          if (template.charAt(0) === '#') {
            template = idToTemplate(template);
            /* istanbul ignore if */
            if (!template) {
              warn(
                ("Template element not found or is empty: " + (options.template)),
                this
              );
            }
          }
        } else if (template.nodeType) {
          template = template.innerHTML;
        } else {
          {
            warn('invalid template option:' + template, this);
          }
          return this
        }
      } else if (el) {
        template = getOuterHTML(el);
      }
      if (template) {
        /* istanbul ignore if */
        if (config.performance && mark) {
          mark('compile');
        }

        var ref = compileToFunctions(template, {
          outputSourceRange: "development" !== 'production',
          shouldDecodeNewlines: shouldDecodeNewlines,
          shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments
        }, this);
        var render = ref.render;
        var staticRenderFns = ref.staticRenderFns;
        options.render = render;
        options.staticRenderFns = staticRenderFns;

        /* istanbul ignore if */
        if (config.performance && mark) {
          mark('compile end');
          measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
        }
      }
    }
    return mount.call(this, el, hydrating)
  };

  /**
   * Get outerHTML of elements, taking care
   * of SVG elements in IE as well.
   */
  function getOuterHTML (el) {
    if (el.outerHTML) {
      return el.outerHTML
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML
    }
  }

  Vue.compile = compileToFunctions;

  return Vue;

}));



/* axios v0.19.2 | (c) 2020 by Matt Zabriskie */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.axios=t():e.axios=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";function r(e){var t=new s(e),n=i(s.prototype.request,t);return o.extend(n,s.prototype,t),o.extend(n,t),n}var o=n(2),i=n(3),s=n(4),a=n(22),u=n(10),c=r(u);c.Axios=s,c.create=function(e){return r(a(c.defaults,e))},c.Cancel=n(23),c.CancelToken=n(24),c.isCancel=n(9),c.all=function(e){return Promise.all(e)},c.spread=n(25),e.exports=c,e.exports.default=c},function(e,t,n){"use strict";function r(e){return"[object Array]"===j.call(e)}function o(e){return"undefined"==typeof e}function i(e){return null!==e&&!o(e)&&null!==e.constructor&&!o(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}function s(e){return"[object ArrayBuffer]"===j.call(e)}function a(e){return"undefined"!=typeof FormData&&e instanceof FormData}function u(e){var t;return t="undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer}function c(e){return"string"==typeof e}function f(e){return"number"==typeof e}function p(e){return null!==e&&"object"==typeof e}function d(e){return"[object Date]"===j.call(e)}function l(e){return"[object File]"===j.call(e)}function h(e){return"[object Blob]"===j.call(e)}function m(e){return"[object Function]"===j.call(e)}function y(e){return p(e)&&m(e.pipe)}function g(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams}function v(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}function x(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)}function w(e,t){if(null!==e&&"undefined"!=typeof e)if("object"!=typeof e&&(e=[e]),r(e))for(var n=0,o=e.length;n<o;n++)t.call(null,e[n],n,e);else for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.call(null,e[i],i,e)}function b(){function e(e,n){"object"==typeof t[n]&&"object"==typeof e?t[n]=b(t[n],e):t[n]=e}for(var t={},n=0,r=arguments.length;n<r;n++)w(arguments[n],e);return t}function E(){function e(e,n){"object"==typeof t[n]&&"object"==typeof e?t[n]=E(t[n],e):"object"==typeof e?t[n]=E({},e):t[n]=e}for(var t={},n=0,r=arguments.length;n<r;n++)w(arguments[n],e);return t}function S(e,t,n){return w(t,function(t,r){n&&"function"==typeof t?e[r]=C(t,n):e[r]=t}),e}var C=n(3),j=Object.prototype.toString;e.exports={isArray:r,isArrayBuffer:s,isBuffer:i,isFormData:a,isArrayBufferView:u,isString:c,isNumber:f,isObject:p,isUndefined:o,isDate:d,isFile:l,isBlob:h,isFunction:m,isStream:y,isURLSearchParams:g,isStandardBrowserEnv:x,forEach:w,merge:b,deepMerge:E,extend:S,trim:v}},function(e,t){"use strict";e.exports=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}},function(e,t,n){"use strict";function r(e){this.defaults=e,this.interceptors={request:new s,response:new s}}var o=n(2),i=n(5),s=n(6),a=n(7),u=n(22);r.prototype.request=function(e){"string"==typeof e?(e=arguments[1]||{},e.url=arguments[0]):e=e||{},e=u(this.defaults,e),e.method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var t=[a,void 0],n=Promise.resolve(e);for(this.interceptors.request.forEach(function(e){t.unshift(e.fulfilled,e.rejected)}),this.interceptors.response.forEach(function(e){t.push(e.fulfilled,e.rejected)});t.length;)n=n.then(t.shift(),t.shift());return n},r.prototype.getUri=function(e){return e=u(this.defaults,e),i(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},o.forEach(["delete","get","head","options"],function(e){r.prototype[e]=function(t,n){return this.request(o.merge(n||{},{method:e,url:t}))}}),o.forEach(["post","put","patch"],function(e){r.prototype[e]=function(t,n,r){return this.request(o.merge(r||{},{method:e,url:t,data:n}))}}),e.exports=r},function(e,t,n){"use strict";function r(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var o=n(2);e.exports=function(e,t,n){if(!t)return e;var i;if(n)i=n(t);else if(o.isURLSearchParams(t))i=t.toString();else{var s=[];o.forEach(t,function(e,t){null!==e&&"undefined"!=typeof e&&(o.isArray(e)?t+="[]":e=[e],o.forEach(e,function(e){o.isDate(e)?e=e.toISOString():o.isObject(e)&&(e=JSON.stringify(e)),s.push(r(t)+"="+r(e))}))}),i=s.join("&")}if(i){var a=e.indexOf("#");a!==-1&&(e=e.slice(0,a)),e+=(e.indexOf("?")===-1?"?":"&")+i}return e}},function(e,t,n){"use strict";function r(){this.handlers=[]}var o=n(2);r.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},r.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},r.prototype.forEach=function(e){o.forEach(this.handlers,function(t){null!==t&&e(t)})},e.exports=r},function(e,t,n){"use strict";function r(e){e.cancelToken&&e.cancelToken.throwIfRequested()}var o=n(2),i=n(8),s=n(9),a=n(10);e.exports=function(e){r(e),e.headers=e.headers||{},e.data=i(e.data,e.headers,e.transformRequest),e.headers=o.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),o.forEach(["delete","get","head","post","put","patch","common"],function(t){delete e.headers[t]});var t=e.adapter||a.adapter;return t(e).then(function(t){return r(e),t.data=i(t.data,t.headers,e.transformResponse),t},function(t){return s(t)||(r(e),t&&t.response&&(t.response.data=i(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)})}},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t,n){return r.forEach(n,function(n){e=n(e,t)}),e}},function(e,t){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},function(e,t,n){"use strict";function r(e,t){!i.isUndefined(e)&&i.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}function o(){var e;return"undefined"!=typeof XMLHttpRequest?e=n(12):"undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process)&&(e=n(12)),e}var i=n(2),s=n(11),a={"Content-Type":"application/x-www-form-urlencoded"},u={adapter:o(),transformRequest:[function(e,t){return s(t,"Accept"),s(t,"Content-Type"),i.isFormData(e)||i.isArrayBuffer(e)||i.isBuffer(e)||i.isStream(e)||i.isFile(e)||i.isBlob(e)?e:i.isArrayBufferView(e)?e.buffer:i.isURLSearchParams(e)?(r(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):i.isObject(e)?(r(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};u.headers={common:{Accept:"application/json, text/plain, */*"}},i.forEach(["delete","get","head"],function(e){u.headers[e]={}}),i.forEach(["post","put","patch"],function(e){u.headers[e]=i.merge(a)}),e.exports=u},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t){r.forEach(e,function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])})}},function(e,t,n){"use strict";var r=n(2),o=n(13),i=n(5),s=n(16),a=n(19),u=n(20),c=n(14);e.exports=function(e){return new Promise(function(t,f){var p=e.data,d=e.headers;r.isFormData(p)&&delete d["Content-Type"];var l=new XMLHttpRequest;if(e.auth){var h=e.auth.username||"",m=e.auth.password||"";d.Authorization="Basic "+btoa(h+":"+m)}var y=s(e.baseURL,e.url);if(l.open(e.method.toUpperCase(),i(y,e.params,e.paramsSerializer),!0),l.timeout=e.timeout,l.onreadystatechange=function(){if(l&&4===l.readyState&&(0!==l.status||l.responseURL&&0===l.responseURL.indexOf("file:"))){var n="getAllResponseHeaders"in l?a(l.getAllResponseHeaders()):null,r=e.responseType&&"text"!==e.responseType?l.response:l.responseText,i={data:r,status:l.status,statusText:l.statusText,headers:n,config:e,request:l};o(t,f,i),l=null}},l.onabort=function(){l&&(f(c("Request aborted",e,"ECONNABORTED",l)),l=null)},l.onerror=function(){f(c("Network Error",e,null,l)),l=null},l.ontimeout=function(){var t="timeout of "+e.timeout+"ms exceeded";e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),f(c(t,e,"ECONNABORTED",l)),l=null},r.isStandardBrowserEnv()){var g=n(21),v=(e.withCredentials||u(y))&&e.xsrfCookieName?g.read(e.xsrfCookieName):void 0;v&&(d[e.xsrfHeaderName]=v)}if("setRequestHeader"in l&&r.forEach(d,function(e,t){"undefined"==typeof p&&"content-type"===t.toLowerCase()?delete d[t]:l.setRequestHeader(t,e)}),r.isUndefined(e.withCredentials)||(l.withCredentials=!!e.withCredentials),e.responseType)try{l.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&l.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&l.upload&&l.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(e){l&&(l.abort(),f(e),l=null)}),void 0===p&&(p=null),l.send(p)})}},function(e,t,n){"use strict";var r=n(14);e.exports=function(e,t,n){var o=n.config.validateStatus;!o||o(n.status)?e(n):t(r("Request failed with status code "+n.status,n.config,null,n.request,n))}},function(e,t,n){"use strict";var r=n(15);e.exports=function(e,t,n,o,i){var s=new Error(e);return r(s,t,n,o,i)}},function(e,t){"use strict";e.exports=function(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}},function(e,t,n){"use strict";var r=n(17),o=n(18);e.exports=function(e,t){return e&&!r(t)?o(e,t):t}},function(e,t){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,t){"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},function(e,t,n){"use strict";var r=n(2),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,n,i,s={};return e?(r.forEach(e.split("\n"),function(e){if(i=e.indexOf(":"),t=r.trim(e.substr(0,i)).toLowerCase(),n=r.trim(e.substr(i+1)),t){if(s[t]&&o.indexOf(t)>=0)return;"set-cookie"===t?s[t]=(s[t]?s[t]:[]).concat([n]):s[t]=s[t]?s[t]+", "+n:n}}),s):s}},function(e,t,n){"use strict";var r=n(2);e.exports=r.isStandardBrowserEnv()?function(){function e(e){var t=e;return n&&(o.setAttribute("href",t),t=o.href),o.setAttribute("href",t),{href:o.href,protocol:o.protocol?o.protocol.replace(/:$/,""):"",host:o.host,search:o.search?o.search.replace(/^\?/,""):"",hash:o.hash?o.hash.replace(/^#/,""):"",hostname:o.hostname,port:o.port,pathname:"/"===o.pathname.charAt(0)?o.pathname:"/"+o.pathname}}var t,n=/(msie|trident)/i.test(navigator.userAgent),o=document.createElement("a");return t=e(window.location.href),function(n){var o=r.isString(n)?e(n):n;return o.protocol===t.protocol&&o.host===t.host}}():function(){return function(){return!0}}()},function(e,t,n){"use strict";var r=n(2);e.exports=r.isStandardBrowserEnv()?function(){return{write:function(e,t,n,o,i,s){var a=[];a.push(e+"="+encodeURIComponent(t)),r.isNumber(n)&&a.push("expires="+new Date(n).toGMTString()),r.isString(o)&&a.push("path="+o),r.isString(i)&&a.push("domain="+i),s===!0&&a.push("secure"),document.cookie=a.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}}():function(){return{write:function(){},read:function(){return null},remove:function(){}}}()},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t){t=t||{};var n={},o=["url","method","params","data"],i=["headers","auth","proxy"],s=["baseURL","url","transformRequest","transformResponse","paramsSerializer","timeout","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","maxContentLength","validateStatus","maxRedirects","httpAgent","httpsAgent","cancelToken","socketPath"];r.forEach(o,function(e){"undefined"!=typeof t[e]&&(n[e]=t[e])}),r.forEach(i,function(o){r.isObject(t[o])?n[o]=r.deepMerge(e[o],t[o]):"undefined"!=typeof t[o]?n[o]=t[o]:r.isObject(e[o])?n[o]=r.deepMerge(e[o]):"undefined"!=typeof e[o]&&(n[o]=e[o])}),r.forEach(s,function(r){"undefined"!=typeof t[r]?n[r]=t[r]:"undefined"!=typeof e[r]&&(n[r]=e[r])});var a=o.concat(i).concat(s),u=Object.keys(t).filter(function(e){return a.indexOf(e)===-1});return r.forEach(u,function(r){"undefined"!=typeof t[r]?n[r]=t[r]:"undefined"!=typeof e[r]&&(n[r]=e[r])}),n}},function(e,t){"use strict";function n(e){this.message=e}n.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},n.prototype.__CANCEL__=!0,e.exports=n},function(e,t,n){"use strict";function r(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise(function(e){t=e});var n=this;e(function(e){n.reason||(n.reason=new o(e),t(n.reason))})}var o=n(23);r.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},r.source=function(){var e,t=new r(function(t){e=t});return{token:t,cancel:e}},e.exports=r},function(e,t){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}}])});
//# sourceMappingURL=axios.min.map


/*JSPDF*/
/*JS PDF*/
!function(t){"function"==typeof define&&define.amd?define(t):t()}(function(){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}!function(e){if("object"!==t(e.console)){e.console={};for(var n,r,i=e.console,o=function(){},a=["memory"],s="assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn".split(",");n=a.pop();)i[n]||(i[n]={});for(;r=s.pop();)i[r]||(i[r]=o)}var l,h,u,c,f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";void 0===e.btoa&&(e.btoa=function(t){var e,n,r,i,o,a=0,s=0,l="",h=[];if(!t)return t;do{e=(o=t.charCodeAt(a++)<<16|t.charCodeAt(a++)<<8|t.charCodeAt(a++))>>18&63,n=o>>12&63,r=o>>6&63,i=63&o,h[s++]=f.charAt(e)+f.charAt(n)+f.charAt(r)+f.charAt(i)}while(a<t.length);l=h.join("");var u=t.length%3;return(u?l.slice(0,u-3):l)+"===".slice(u||3)}),void 0===e.atob&&(e.atob=function(t){var e,n,r,i,o,a,s=0,l=0,h=[];if(!t)return t;t+="";do{e=(a=f.indexOf(t.charAt(s++))<<18|f.indexOf(t.charAt(s++))<<12|(i=f.indexOf(t.charAt(s++)))<<6|(o=f.indexOf(t.charAt(s++))))>>16&255,n=a>>8&255,r=255&a,h[l++]=64==i?String.fromCharCode(e):64==o?String.fromCharCode(e,n):String.fromCharCode(e,n,r)}while(s<t.length);return h.join("")}),Array.prototype.map||(Array.prototype.map=function(t){if(null==this||"function"!=typeof t)throw new TypeError;for(var e=Object(this),n=e.length>>>0,r=new Array(n),i=arguments.length>1?arguments[1]:void 0,o=0;o<n;o++)o in e&&(r[o]=t.call(i,e[o],o,e));return r}),Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),Array.prototype.forEach||(Array.prototype.forEach=function(t,e){if(null==this||"function"!=typeof t)throw new TypeError;for(var n=Object(this),r=n.length>>>0,i=0;i<r;i++)i in n&&t.call(e,n[i],i,n)}),Array.prototype.find||Object.defineProperty(Array.prototype,"find",{value:function(t){if(null==this)throw new TypeError('"this" is null or not defined');var e=Object(this),n=e.length>>>0;if("function"!=typeof t)throw new TypeError("predicate must be a function");for(var r=arguments[1],i=0;i<n;){var o=e[i];if(t.call(r,o,i,e))return o;i++}},configurable:!0,writable:!0}),Object.keys||(Object.keys=(l=Object.prototype.hasOwnProperty,h=!{toString:null}.propertyIsEnumerable("toString"),c=(u=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length,function(e){if("object"!==t(e)&&("function"!=typeof e||null===e))throw new TypeError;var n,r,i=[];for(n in e)l.call(e,n)&&i.push(n);if(h)for(r=0;r<c;r++)l.call(e,u[r])&&i.push(u[r]);return i})),"function"!=typeof Object.assign&&(Object.assign=function(t){if(null==t)throw new TypeError("Cannot convert undefined or null to object");t=Object(t);for(var e=1;e<arguments.length;e++){var n=arguments[e];if(null!=n)for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),String.prototype.trimLeft||(String.prototype.trimLeft=function(){return this.replace(/^\s+/g,"")}),String.prototype.trimRight||(String.prototype.trimRight=function(){return this.replace(/\s+$/g,"")}),Number.isInteger=Number.isInteger||function(t){return"number"==typeof t&&isFinite(t)&&Math.floor(t)===t}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof global&&global||Function('return typeof this === "object" && this.content')()||Function("return this")());var e,n,r,i,o,a,s,l,h,u,c,f,p,d,g,m,y=function(e){function n(n){if("object"!==t(n))throw new Error("Invalid Context passed to initialize PubSub (jsPDF-module)");var r={};this.subscribe=function(t,e,n){if(n=n||!1,"string"!=typeof t||"function"!=typeof e||"boolean"!=typeof n)throw new Error("Invalid arguments passed to PubSub.subscribe (jsPDF-module)");r.hasOwnProperty(t)||(r[t]={});var i=Math.random().toString(35);return r[t][i]=[e,!!n],i},this.unsubscribe=function(t){for(var e in r)if(r[e][t])return delete r[e][t],0===Object.keys(r[e]).length&&delete r[e],!0;return!1},this.publish=function(t){if(r.hasOwnProperty(t)){var i=Array.prototype.slice.call(arguments,1),o=[];for(var a in r[t]){var s=r[t][a];try{s[0].apply(n,i)}catch(t){e.console&&console.error("jsPDF PubSub Error",t.message,t)}s[1]&&o.push(a)}o.length&&o.forEach(this.unsubscribe)}},this.getTopics=function(){return r}}function r(i,o,a,s){var l={},h=[],u=1;"object"===t(i)&&(i=(l=i).orientation,o=l.unit||o,a=l.format||a,s=l.compress||l.compressPdf||s,h=l.filters||(!0===s?["FlateEncode"]:h),u="number"==typeof l.userUnit?Math.abs(l.userUnit):1),o=o||"mm",i=(""+(i||"P")).toLowerCase();var c=l.putOnlyUsedFonts||!0,f={},p={internal:{},__private__:{}};p.__private__.PubSub=n;var d="1.3",g=p.__private__.getPdfVersion=function(){return d},m=(p.__private__.setPdfVersion=function(t){d=t},{a0:[2383.94,3370.39],a1:[1683.78,2383.94],a2:[1190.55,1683.78],a3:[841.89,1190.55],a4:[595.28,841.89],a5:[419.53,595.28],a6:[297.64,419.53],a7:[209.76,297.64],a8:[147.4,209.76],a9:[104.88,147.4],a10:[73.7,104.88],b0:[2834.65,4008.19],b1:[2004.09,2834.65],b2:[1417.32,2004.09],b3:[1000.63,1417.32],b4:[708.66,1000.63],b5:[498.9,708.66],b6:[354.33,498.9],b7:[249.45,354.33],b8:[175.75,249.45],b9:[124.72,175.75],b10:[87.87,124.72],c0:[2599.37,3676.54],c1:[1836.85,2599.37],c2:[1298.27,1836.85],c3:[918.43,1298.27],c4:[649.13,918.43],c5:[459.21,649.13],c6:[323.15,459.21],c7:[229.61,323.15],c8:[161.57,229.61],c9:[113.39,161.57],c10:[79.37,113.39],dl:[311.81,623.62],letter:[612,792],"government-letter":[576,756],legal:[612,1008],"junior-legal":[576,360],ledger:[1224,792],tabloid:[792,1224],"credit-card":[153,243]}),y=(p.__private__.getPageFormats=function(){return m},p.__private__.getPageFormat=function(t){return m[t]});"string"==typeof a&&(a=y(a)),a=a||y("a4");var w,b=p.f2=p.__private__.f2=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f2");return t.toFixed(2)},x=p.__private__.f3=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f3");return t.toFixed(3)},N="00000000000000000000000000000000",L=p.__private__.getFileId=function(){return N},A=p.__private__.setFileId=function(t){return t=t||"12345678901234567890123456789012".split("").map(function(){return"ABCDEF0123456789".charAt(Math.floor(16*Math.random()))}).join(""),N=t};p.setFileId=function(t){return A(t),this},p.getFileId=function(){return L()};var S=p.__private__.convertDateToPDFDate=function(t){var e=t.getTimezoneOffset(),n=e<0?"+":"-",r=Math.floor(Math.abs(e/60)),i=Math.abs(e%60),o=[n,q(r),"'",q(i),"'"].join("");return["D:",t.getFullYear(),q(t.getMonth()+1),q(t.getDate()),q(t.getHours()),q(t.getMinutes()),q(t.getSeconds()),o].join("")},_=p.__private__.convertPDFDateToDate=function(t){var e=parseInt(t.substr(2,4),10),n=parseInt(t.substr(6,2),10)-1,r=parseInt(t.substr(8,2),10),i=parseInt(t.substr(10,2),10),o=parseInt(t.substr(12,2),10),a=parseInt(t.substr(14,2),10);parseInt(t.substr(16,2),10),parseInt(t.substr(20,2),10);return new Date(e,n,r,i,o,a,0)},F=p.__private__.setCreationDate=function(e){var n;if(void 0===e&&(e=new Date),"object"===t(e)&&"[object Date]"===Object.prototype.toString.call(e))n=S(e);else{if(!/^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|\-0[0-9]|\-1[0-1])\'(0[0-9]|[1-5][0-9])\'?$/.test(e))throw new Error("Invalid argument passed to jsPDF.setCreationDate");n=e}return w=n},P=p.__private__.getCreationDate=function(t){var e=w;return"jsDate"===t&&(e=_(w)),e};p.setCreationDate=function(t){return F(t),this},p.getCreationDate=function(t){return P(t)};var k,I,C,B,j,E,M,O,q=p.__private__.padd2=function(t){return("0"+parseInt(t)).slice(-2)},T=!1,R=[],D=[],U=0,z=(p.__private__.setCustomOutputDestination=function(t){I=t},p.__private__.resetCustomOutputDestination=function(t){I=void 0},p.__private__.out=function(t){var e;return t="string"==typeof t?t:t.toString(),(e=void 0===I?T?R[k]:D:I).push(t),T||(U+=t.length+1),e}),H=p.__private__.write=function(t){return z(1===arguments.length?t.toString():Array.prototype.join.call(arguments," "))},W=p.__private__.getArrayBuffer=function(t){for(var e=t.length,n=new ArrayBuffer(e),r=new Uint8Array(n);e--;)r[e]=t.charCodeAt(e);return n},V=[["Helvetica","helvetica","normal","WinAnsiEncoding"],["Helvetica-Bold","helvetica","bold","WinAnsiEncoding"],["Helvetica-Oblique","helvetica","italic","WinAnsiEncoding"],["Helvetica-BoldOblique","helvetica","bolditalic","WinAnsiEncoding"],["Courier","courier","normal","WinAnsiEncoding"],["Courier-Bold","courier","bold","WinAnsiEncoding"],["Courier-Oblique","courier","italic","WinAnsiEncoding"],["Courier-BoldOblique","courier","bolditalic","WinAnsiEncoding"],["Times-Roman","times","normal","WinAnsiEncoding"],["Times-Bold","times","bold","WinAnsiEncoding"],["Times-Italic","times","italic","WinAnsiEncoding"],["Times-BoldItalic","times","bolditalic","WinAnsiEncoding"],["ZapfDingbats","zapfdingbats","normal",null],["Symbol","symbol","normal",null]],G=(p.__private__.getStandardFonts=function(t){return V},l.fontSize||16),Y=(p.__private__.setFontSize=p.setFontSize=function(t){return G=t,this},p.__private__.getFontSize=p.getFontSize=function(){return G}),J=l.R2L||!1,X=(p.__private__.setR2L=p.setR2L=function(t){return J=t,this},p.__private__.getR2L=p.getR2L=function(t){return J},p.__private__.setZoomMode=function(t){var e=[void 0,null,"fullwidth","fullheight","fullpage","original"];if(/^\d*\.?\d*\%$/.test(t))C=t;else if(isNaN(t)){if(-1===e.indexOf(t))throw new Error('zoom must be Integer (e.g. 2), a percentage Value (e.g. 300%) or fullwidth, fullheight, fullpage, original. "'+t+'" is not recognized.');C=t}else C=parseInt(t,10)}),K=(p.__private__.getZoomMode=function(){return C},p.__private__.setPageMode=function(t){if(-1==[void 0,null,"UseNone","UseOutlines","UseThumbs","FullScreen"].indexOf(t))throw new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "'+t+'" is not recognized.');B=t}),Z=(p.__private__.getPageMode=function(){return B},p.__private__.setLayoutMode=function(t){if(-1==[void 0,null,"continuous","single","twoleft","tworight","two"].indexOf(t))throw new Error('Layout mode must be one of continuous, single, twoleft, tworight. "'+t+'" is not recognized.');j=t}),Q=(p.__private__.getLayoutMode=function(){return j},p.__private__.setDisplayMode=p.setDisplayMode=function(t,e,n){return X(t),Z(e),K(n),this},{title:"",subject:"",author:"",keywords:"",creator:""}),$=(p.__private__.getDocumentProperty=function(t){if(-1===Object.keys(Q).indexOf(t))throw new Error("Invalid argument passed to jsPDF.getDocumentProperty");return Q[t]},p.__private__.getDocumentProperties=function(t){return Q},p.__private__.setDocumentProperties=p.setProperties=p.setDocumentProperties=function(t){for(var e in Q)Q.hasOwnProperty(e)&&t[e]&&(Q[e]=t[e]);return this},p.__private__.setDocumentProperty=function(t,e){if(-1===Object.keys(Q).indexOf(t))throw new Error("Invalid arguments passed to jsPDF.setDocumentProperty");return Q[t]=e},0),tt=[],et={},nt={},rt=0,it=[],ot=[],at=new n(p),st=l.hotfixes||[],lt=p.__private__.newObject=function(){var t=ht();return ut(t,!0),t},ht=p.__private__.newObjectDeferred=function(){return tt[++$]=function(){return U},$},ut=function(t,e){return e="boolean"==typeof e&&e,tt[t]=U,e&&z(t+" 0 obj"),t},ct=p.__private__.newAdditionalObject=function(){var t={objId:ht(),content:""};return ot.push(t),t},ft=ht(),pt=ht(),dt=p.__private__.decodeColorString=function(t){var e=t.split(" ");if(2===e.length&&("g"===e[1]||"G"===e[1])){var n=parseFloat(e[0]);e=[n,n,n,"r"]}for(var r="#",i=0;i<3;i++)r+=("0"+Math.floor(255*parseFloat(e[i])).toString(16)).slice(-2);return r},gt=p.__private__.encodeColorString=function(e){var n;"string"==typeof e&&(e={ch1:e});var r=e.ch1,i=e.ch2,o=e.ch3,a=e.ch4,s=(e.precision,"draw"===e.pdfColorType?["G","RG","K"]:["g","rg","k"]);if("string"==typeof r&&"#"!==r.charAt(0)){var l=new RGBColor(r);if(l.ok)r=l.toHex();else if(!/^\d*\.?\d*$/.test(r))throw new Error('Invalid color "'+r+'" passed to jsPDF.encodeColorString.')}if("string"==typeof r&&/^#[0-9A-Fa-f]{3}$/.test(r)&&(r="#"+r[1]+r[1]+r[2]+r[2]+r[3]+r[3]),"string"==typeof r&&/^#[0-9A-Fa-f]{6}$/.test(r)){var h=parseInt(r.substr(1),16);r=h>>16&255,i=h>>8&255,o=255&h}if(void 0===i||void 0===a&&r===i&&i===o)if("string"==typeof r)n=r+" "+s[0];else switch(e.precision){case 2:n=b(r/255)+" "+s[0];break;case 3:default:n=x(r/255)+" "+s[0]}else if(void 0===a||"object"===t(a)){if(a&&!isNaN(a.a)&&0===a.a)return n=["1.000","1.000","1.000",s[1]].join(" ");if("string"==typeof r)n=[r,i,o,s[1]].join(" ");else switch(e.precision){case 2:n=[b(r/255),b(i/255),b(o/255),s[1]].join(" ");break;default:case 3:n=[x(r/255),x(i/255),x(o/255),s[1]].join(" ")}}else if("string"==typeof r)n=[r,i,o,a,s[2]].join(" ");else switch(e.precision){case 2:n=[b(r/255),b(i/255),b(o/255),b(a/255),s[2]].join(" ");break;case 3:default:n=[x(r/255),x(i/255),x(o/255),x(a/255),s[2]].join(" ")}return n},mt=p.__private__.getFilters=function(){return h},yt=p.__private__.putStream=function(t){var e=(t=t||{}).data||"",n=t.filters||mt(),i=t.alreadyAppliedFilters||[],o=t.addLength1||!1,a=e.length,s={};!0===n&&(n=["FlateEncode"]);var l=t.additionalKeyValues||[],h=(s=void 0!==r.API.processDataByFilters?r.API.processDataByFilters(e,n):{data:e,reverseChain:[]}).reverseChain+(Array.isArray(i)?i.join(" "):i.toString());0!==s.data.length&&(l.push({key:"Length",value:s.data.length}),!0===o&&l.push({key:"Length1",value:a})),0!=h.length&&(h.split("/").length-1==1?l.push({key:"Filter",value:h}):l.push({key:"Filter",value:"["+h+"]"})),z("<<");for(var u=0;u<l.length;u++)z("/"+l[u].key+" "+l[u].value);z(">>"),0!==s.data.length&&(z("stream"),z(s.data),z("endstream"))},vt=p.__private__.putPage=function(t){t.mediaBox;var e=t.number,n=t.data,r=t.objId,i=t.contentsObjId;ut(r,!0);it[k].mediaBox.topRightX,it[k].mediaBox.bottomLeftX,it[k].mediaBox.topRightY,it[k].mediaBox.bottomLeftY;z("<</Type /Page"),z("/Parent "+t.rootDictionaryObjId+" 0 R"),z("/Resources "+t.resourceDictionaryObjId+" 0 R"),z("/MediaBox ["+parseFloat(b(t.mediaBox.bottomLeftX))+" "+parseFloat(b(t.mediaBox.bottomLeftY))+" "+b(t.mediaBox.topRightX)+" "+b(t.mediaBox.topRightY)+"]"),null!==t.cropBox&&z("/CropBox ["+b(t.cropBox.bottomLeftX)+" "+b(t.cropBox.bottomLeftY)+" "+b(t.cropBox.topRightX)+" "+b(t.cropBox.topRightY)+"]"),null!==t.bleedBox&&z("/BleedBox ["+b(t.bleedBox.bottomLeftX)+" "+b(t.bleedBox.bottomLeftY)+" "+b(t.bleedBox.topRightX)+" "+b(t.bleedBox.topRightY)+"]"),null!==t.trimBox&&z("/TrimBox ["+b(t.trimBox.bottomLeftX)+" "+b(t.trimBox.bottomLeftY)+" "+b(t.trimBox.topRightX)+" "+b(t.trimBox.topRightY)+"]"),null!==t.artBox&&z("/ArtBox ["+b(t.artBox.bottomLeftX)+" "+b(t.artBox.bottomLeftY)+" "+b(t.artBox.topRightX)+" "+b(t.artBox.topRightY)+"]"),"number"==typeof t.userUnit&&1!==t.userUnit&&z("/UserUnit "+t.userUnit),at.publish("putPage",{objId:r,pageContext:it[e],pageNumber:e,page:n}),z("/Contents "+i+" 0 R"),z(">>"),z("endobj");var o=n.join("\n");return ut(i,!0),yt({data:o,filters:mt()}),z("endobj"),r},wt=p.__private__.putPages=function(){var t,e,n=[];for(t=1;t<=rt;t++)it[t].objId=ht(),it[t].contentsObjId=ht();for(t=1;t<=rt;t++)n.push(vt({number:t,data:R[t],objId:it[t].objId,contentsObjId:it[t].contentsObjId,mediaBox:it[t].mediaBox,cropBox:it[t].cropBox,bleedBox:it[t].bleedBox,trimBox:it[t].trimBox,artBox:it[t].artBox,userUnit:it[t].userUnit,rootDictionaryObjId:ft,resourceDictionaryObjId:pt}));ut(ft,!0),z("<</Type /Pages");var r="/Kids [";for(e=0;e<rt;e++)r+=n[e]+" 0 R ";z(r+"]"),z("/Count "+rt),z(">>"),z("endobj"),at.publish("postPutPages")},bt=function(){!function(){for(var t in et)et.hasOwnProperty(t)&&(!1===c||!0===c&&f.hasOwnProperty(t))&&(e=et[t],at.publish("putFont",{font:e,out:z,newObject:lt,putStream:yt}),!0!==e.isAlreadyPutted&&(e.objectNumber=lt(),z("<<"),z("/Type /Font"),z("/BaseFont /"+e.postScriptName),z("/Subtype /Type1"),"string"==typeof e.encoding&&z("/Encoding /"+e.encoding),z("/FirstChar 32"),z("/LastChar 255"),z(">>"),z("endobj")));var e}(),at.publish("putResources"),ut(pt,!0),z("<<"),function(){for(var t in z("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]"),z("/Font <<"),et)et.hasOwnProperty(t)&&(!1===c||!0===c&&f.hasOwnProperty(t))&&z("/"+t+" "+et[t].objectNumber+" 0 R");z(">>"),z("/XObject <<"),at.publish("putXobjectDict"),z(">>")}(),z(">>"),z("endobj"),at.publish("postPutResources")},xt=function(t,e,n){nt.hasOwnProperty(e)||(nt[e]={}),nt[e][n]=t},Nt=function(t,e,n,r,i){i=i||!1;var o="F"+(Object.keys(et).length+1).toString(10),a={id:o,postScriptName:t,fontName:e,fontStyle:n,encoding:r,isStandardFont:i,metadata:{}};return at.publish("addFont",{font:a,instance:this}),void 0!==o&&(et[o]=a,xt(o,e,n)),o},Lt=p.__private__.pdfEscape=p.pdfEscape=function(t,e){return function(t,e){var n,r,i,o,a,s,l,h,u;if(i=(e=e||{}).sourceEncoding||"Unicode",a=e.outputEncoding,(e.autoencode||a)&&et[E].metadata&&et[E].metadata[i]&&et[E].metadata[i].encoding&&(o=et[E].metadata[i].encoding,!a&&et[E].encoding&&(a=et[E].encoding),!a&&o.codePages&&(a=o.codePages[0]),"string"==typeof a&&(a=o[a]),a)){for(l=!1,s=[],n=0,r=t.length;n<r;n++)(h=a[t.charCodeAt(n)])?s.push(String.fromCharCode(h)):s.push(t[n]),s[n].charCodeAt(0)>>8&&(l=!0);t=s.join("")}for(n=t.length;void 0===l&&0!==n;)t.charCodeAt(n-1)>>8&&(l=!0),n--;if(!l)return t;for(s=e.noBOM?[]:[254,255],n=0,r=t.length;n<r;n++){if((u=(h=t.charCodeAt(n))>>8)>>8)throw new Error("Character at position "+n+" of string '"+t+"' exceeds 16bits. Cannot be encoded into UCS-2 BE");s.push(u),s.push(h-(u<<8))}return String.fromCharCode.apply(void 0,s)}(t,e).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)")},At=p.__private__.beginPage=function(t,e){var n,r="string"==typeof e&&e.toLowerCase();if("string"==typeof t&&(n=y(t.toLowerCase()))&&(t=n[0],e=n[1]),Array.isArray(t)&&(e=t[1],t=t[0]),(isNaN(t)||isNaN(e))&&(t=a[0],e=a[1]),r){switch(r.substr(0,1)){case"l":e>t&&(r="s");break;case"p":t>e&&(r="s")}"s"===r&&(n=t,t=e,e=n)}(t>14400||e>14400)&&(console.warn("A page in a PDF can not be wider or taller than 14400 userUnit. jsPDF limits the width/height to 14400"),t=Math.min(14400,t),e=Math.min(14400,e)),a=[t,e],T=!0,R[++rt]=[],it[rt]={objId:0,contentsObjId:0,userUnit:Number(u),artBox:null,bleedBox:null,cropBox:null,trimBox:null,mediaBox:{bottomLeftX:0,bottomLeftY:0,topRightX:Number(t),topRightY:Number(e)}},_t(rt)},St=function(){At.apply(this,arguments),Vt(Wt),z($t),0!==oe&&z(oe+" J"),0!==se&&z(se+" j"),at.publish("addPage",{pageNumber:rt})},_t=function(t){t>0&&t<=rt&&(k=t)},Ft=p.__private__.getNumberOfPages=p.getNumberOfPages=function(){return R.length-1},Pt=function(t,e,n){var r,i=void 0;return n=n||{},t=void 0!==t?t:et[E].fontName,e=void 0!==e?e:et[E].fontStyle,r=t.toLowerCase(),void 0!==nt[r]&&void 0!==nt[r][e]?i=nt[r][e]:void 0!==nt[t]&&void 0!==nt[t][e]?i=nt[t][e]:!1===n.disableWarning&&console.warn("Unable to look up font label for font '"+t+"', '"+e+"'. Refer to getFontList() for available fonts."),i||n.noFallback||null==(i=nt.times[e])&&(i=nt.times.normal),i},kt=p.__private__.putInfo=function(){for(var t in lt(),z("<<"),z("/Producer (jsPDF "+r.version+")"),Q)Q.hasOwnProperty(t)&&Q[t]&&z("/"+t.substr(0,1).toUpperCase()+t.substr(1)+" ("+Lt(Q[t])+")");z("/CreationDate ("+w+")"),z(">>"),z("endobj")},It=p.__private__.putCatalog=function(t){var e=(t=t||{}).rootDictionaryObjId||ft;switch(lt(),z("<<"),z("/Type /Catalog"),z("/Pages "+e+" 0 R"),C||(C="fullwidth"),C){case"fullwidth":z("/OpenAction [3 0 R /FitH null]");break;case"fullheight":z("/OpenAction [3 0 R /FitV null]");break;case"fullpage":z("/OpenAction [3 0 R /Fit]");break;case"original":z("/OpenAction [3 0 R /XYZ null null 1]");break;default:var n=""+C;"%"===n.substr(n.length-1)&&(C=parseInt(C)/100),"number"==typeof C&&z("/OpenAction [3 0 R /XYZ null null "+b(C)+"]")}switch(j||(j="continuous"),j){case"continuous":z("/PageLayout /OneColumn");break;case"single":z("/PageLayout /SinglePage");break;case"two":case"twoleft":z("/PageLayout /TwoColumnLeft");break;case"tworight":z("/PageLayout /TwoColumnRight")}B&&z("/PageMode /"+B),at.publish("putCatalog"),z(">>"),z("endobj")},Ct=p.__private__.putTrailer=function(){z("trailer"),z("<<"),z("/Size "+($+1)),z("/Root "+$+" 0 R"),z("/Info "+($-1)+" 0 R"),z("/ID [ <"+N+"> <"+N+"> ]"),z(">>")},Bt=p.__private__.putHeader=function(){z("%PDF-"+d),z("%ºß¬à")},jt=p.__private__.putXRef=function(){var t=1,e="0000000000";for(z("xref"),z("0 "+($+1)),z("0000000000 65535 f "),t=1;t<=$;t++){"function"==typeof tt[t]?z((e+tt[t]()).slice(-10)+" 00000 n "):void 0!==tt[t]?z((e+tt[t]).slice(-10)+" 00000 n "):z("0000000000 00000 n ")}},Et=p.__private__.buildDocument=function(){T=!1,$=0,U=0,D=[],tt=[],ot=[],ft=ht(),pt=ht(),at.publish("buildDocument"),Bt(),wt(),function(){at.publish("putAdditionalObjects");for(var t=0;t<ot.length;t++){var e=ot[t];ut(e.objId,!0),z(e.content),z("endobj")}at.publish("postPutAdditionalObjects")}(),bt(),kt(),It();var t=U;return jt(),Ct(),z("startxref"),z(""+t),z("%%EOF"),T=!0,D.join("\n")},Mt=p.__private__.getBlob=function(t){return new Blob([W(t)],{type:"application/pdf"})},Ot=p.output=p.__private__.output=((O=function(t,n){n=n||{};var r=Et();switch("string"==typeof n?n={filename:n}:n.filename=n.filename||"generated.pdf",t){case void 0:return r;case"save":p.save(n.filename);break;case"arraybuffer":return W(r);case"blob":return Mt(r);case"bloburi":case"bloburl":if(void 0!==e.URL&&"function"==typeof e.URL.createObjectURL)return e.URL&&e.URL.createObjectURL(Mt(r))||void 0;console.warn("bloburl is not supported by your system, because URL.createObjectURL is not supported by your browser.");break;case"datauristring":case"dataurlstring":return"data:application/pdf;filename="+n.filename+";base64,"+btoa(r);case"dataurlnewwindow":var i='<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><iframe src="'+this.output("datauristring")+'"></iframe></body></html>',o=e.open();if(null!==o&&o.document.write(i),o||"undefined"==typeof safari)return o;case"datauri":case"dataurl":return e.document.location.href="data:application/pdf;filename="+n.filename+";base64,"+btoa(r);default:return null}}).foo=function(){try{return O.apply(this,arguments)}catch(r){var t=r.stack||"";~t.indexOf(" at ")&&(t=t.split(" at ")[1]);var n="Error in function "+t.split("\n")[0].split("<")[0]+": "+r.message;if(!e.console)throw new Error(n);e.console.error(n,r),e.alert&&alert(n)}},O.foo.bar=O,O.foo),qt=function(t){return!0===Array.isArray(st)&&st.indexOf(t)>-1};switch(o){case"pt":M=1;break;case"mm":M=72/25.4;break;case"cm":M=72/2.54;break;case"in":M=72;break;case"px":M=1==qt("px_scaling")?.75:96/72;break;case"pc":case"em":M=12;break;case"ex":M=6;break;default:throw new Error("Invalid unit: "+o)}F(),A();var Tt=p.__private__.getPageInfo=function(t){if(isNaN(t)||t%1!=0)throw new Error("Invalid argument passed to jsPDF.getPageInfo");return{objId:it[t].objId,pageNumber:t,pageContext:it[t]}},Rt=p.__private__.getPageInfoByObjId=function(t){for(var e in it)if(it[e].objId===t)break;if(isNaN(t)||t%1!=0)throw new Error("Invalid argument passed to jsPDF.getPageInfoByObjId");return Tt(e)},Dt=p.__private__.getCurrentPageInfo=function(){return{objId:it[k].objId,pageNumber:k,pageContext:it[k]}};p.addPage=function(){return St.apply(this,arguments),this},p.setPage=function(){return _t.apply(this,arguments),this},p.insertPage=function(t){return this.addPage(),this.movePage(k,t),this},p.movePage=function(t,e){if(t>e){for(var n=R[t],r=it[t],i=t;i>e;i--)R[i]=R[i-1],it[i]=it[i-1];R[e]=n,it[e]=r,this.setPage(e)}else if(t<e){for(n=R[t],r=it[t],i=t;i<e;i++)R[i]=R[i+1],it[i]=it[i+1];R[e]=n,it[e]=r,this.setPage(e)}return this},p.deletePage=function(){return function(t){t>0&&t<=rt&&(R.splice(t,1),k>--rt&&(k=rt),this.setPage(k))}.apply(this,arguments),this};p.__private__.text=p.text=function(e,n,r,i){var o;"number"!=typeof e||"number"!=typeof n||"string"!=typeof r&&!Array.isArray(r)||(o=r,r=n,n=e,e=o);var a=arguments[3],s=arguments[4],l=arguments[5];if("object"===t(a)&&null!==a||("string"==typeof s&&(l=s,s=null),"string"==typeof a&&(l=a,a=null),"number"==typeof a&&(s=a,a=null),i={flags:a,angle:s,align:l}),(a=a||{}).noBOM=a.noBOM||!0,a.autoencode=a.autoencode||!0,isNaN(n)||isNaN(r)||null==e)throw new Error("Invalid arguments passed to jsPDF.text");if(0===e.length)return p;var h,u="",c="number"==typeof i.lineHeightFactor?i.lineHeightFactor:Ht,p=i.scope||this;function d(t){for(var e,n=t.concat(),r=[],i=n.length;i--;)"string"==typeof(e=n.shift())?r.push(e):Array.isArray(t)&&1===e.length?r.push(e[0]):r.push([e[0],e[1],e[2]]);return r}function g(t,e){var n;if("string"==typeof t)n=e(t)[0];else if(Array.isArray(t)){for(var r,i,o=t.concat(),a=[],s=o.length;s--;)"string"==typeof(r=o.shift())?a.push(e(r)[0]):Array.isArray(r)&&"string"===r[0]&&(i=e(r[0],r[1],r[2]),a.push([i[0],i[1],i[2]]));n=a}return n}var m=!1,y=!0;if("string"==typeof e)m=!0;else if(Array.isArray(e)){for(var v,w=e.concat(),N=[],L=w.length;L--;)("string"!=typeof(v=w.shift())||Array.isArray(v)&&"string"!=typeof v[0])&&(y=!1);m=y}if(!1===m)throw new Error('Type of text must be string or Array. "'+e+'" is not recognized.');var A=et[E].encoding;"WinAnsiEncoding"!==A&&"StandardEncoding"!==A||(e=g(e,function(t,e,n){return[(r=t,r=r.split("\t").join(Array(i.TabLen||9).join(" ")),Lt(r,a)),e,n];var r})),"string"==typeof e&&(e=e.match(/[\r?\n]/)?e.split(/\r\n|\r|\n/g):[e]);var S=G/p.internal.scaleFactor,_=S*(Ht-1);switch(i.baseline){case"bottom":r-=_;break;case"top":r+=S-_;break;case"hanging":r+=S-2*_;break;case"middle":r+=S/2-_}(U=i.maxWidth||0)>0&&("string"==typeof e?e=p.splitTextToSize(e,U):"[object Array]"===Object.prototype.toString.call(e)&&(e=p.splitTextToSize(e.join(" "),U)));var F={text:e,x:n,y:r,options:i,mutex:{pdfEscape:Lt,activeFontKey:E,fonts:et,activeFontSize:G}};at.publish("preProcessText",F),e=F.text;s=(i=F.options).angle;var P=p.internal.scaleFactor,k=[];if(s){s*=Math.PI/180;var I=Math.cos(s),C=Math.sin(s);k=[b(I),b(C),b(-1*C),b(I)]}void 0!==(D=i.charSpace)&&(u+=x(D*P)+" Tc\n");i.lang;var B=-1,j=void 0!==i.renderingMode?i.renderingMode:i.stroke,M=p.internal.getCurrentPageInfo().pageContext;switch(j){case 0:case!1:case"fill":B=0;break;case 1:case!0:case"stroke":B=1;break;case 2:case"fillThenStroke":B=2;break;case 3:case"invisible":B=3;break;case 4:case"fillAndAddForClipping":B=4;break;case 5:case"strokeAndAddPathForClipping":B=5;break;case 6:case"fillThenStrokeAndAddToPathForClipping":B=6;break;case 7:case"addToPathForClipping":B=7}var O=void 0!==M.usedRenderingMode?M.usedRenderingMode:-1;-1!==B?u+=B+" Tr\n":-1!==O&&(u+="0 Tr\n"),-1!==B&&(M.usedRenderingMode=B);l=i.align||"left";var q=G*c,T=p.internal.pageSize.getWidth(),R=(P=p.internal.scaleFactor,et[E]),D=i.charSpace||re,U=i.maxWidth||0,H=(a={},[]);if("[object Array]"===Object.prototype.toString.call(e)){var W,V;N=d(e);"left"!==l&&(V=N.map(function(t){return p.getStringUnitWidth(t,{font:R,charSpace:D,fontSize:G})*G/P}));var Y,X=Math.max.apply(Math,V),K=0;if("right"===l){n-=V[0],e=[];var Z=0;for(L=N.length;Z<L;Z++)X-V[Z],0===Z?(Y=Xt(n),W=Kt(r)):(Y=(K-V[Z])*P,W=-q),e.push([N[Z],Y,W]),K=V[Z]}else if("center"===l){n-=V[0]/2,e=[];for(Z=0,L=N.length;Z<L;Z++)(X-V[Z])/2,0===Z?(Y=Xt(n),W=Kt(r)):(Y=(K-V[Z])/2*P,W=-q),e.push([N[Z],Y,W]),K=V[Z]}else if("left"===l){e=[];for(Z=0,L=N.length;Z<L;Z++)W=0===Z?Kt(r):-q,Y=0===Z?Xt(n):0,e.push(N[Z])}else{if("justify"!==l)throw new Error('Unrecognized alignment option, use "left", "center", "right" or "justify".');e=[];for(U=0!==U?U:T,Z=0,L=N.length;Z<L;Z++)W=0===Z?Kt(r):-q,Y=0===Z?Xt(n):0,Z<L-1&&H.push(((U-V[Z])/(N[Z].split(" ").length-1)*P).toFixed(2)),e.push([N[Z],Y,W])}}!0===("boolean"==typeof i.R2L?i.R2L:J)&&(e=g(e,function(t,e,n){return[t.split("").reverse().join(""),e,n]}));F={text:e,x:n,y:r,options:i,mutex:{pdfEscape:Lt,activeFontKey:E,fonts:et,activeFontSize:G}};at.publish("postProcessText",F),e=F.text,h=F.mutex.isHex;N=d(e);e=[];var Q,$,tt,nt=0,rt=(L=N.length,"");for(Z=0;Z<L;Z++)rt="",Array.isArray(N[Z])?(Q=parseFloat(N[Z][1]),$=parseFloat(N[Z][2]),tt=(h?"<":"(")+N[Z][0]+(h?">":")"),nt=1):(Q=Xt(n),$=Kt(r),tt=(h?"<":"(")+N[Z]+(h?">":")")),void 0!==H&&void 0!==H[Z]&&(rt=H[Z]+" Tw\n"),0!==k.length&&0===Z?e.push(rt+k.join(" ")+" "+Q.toFixed(2)+" "+$.toFixed(2)+" Tm\n"+tt):1===nt||0===nt&&0===Z?e.push(rt+Q.toFixed(2)+" "+$.toFixed(2)+" Td\n"+tt):e.push(rt+tt);e=0===nt?e.join(" Tj\nT* "):e.join(" Tj\n"),e+=" Tj\n";var it="BT\n/"+E+" "+G+" Tf\n"+(G*c).toFixed(2)+" TL\n"+ee+"\n";return it+=u,it+=e,z(it+="ET"),f[E]=!0,p},p.__private__.lstext=p.lstext=function(t,e,n,r){return console.warn("jsPDF.lstext is deprecated"),this.text(t,e,n,{charSpace:r})},p.__private__.clip=p.clip=function(t){z("evenodd"===t?"W*":"W"),z("n")},p.__private__.clip_fixed=p.clip_fixed=function(t){console.log("clip_fixed is deprecated"),p.clip(t)};var Ut=p.__private__.isValidStyle=function(t){var e=!1;return-1!==[void 0,null,"S","F","DF","FD","f","f*","B","B*"].indexOf(t)&&(e=!0),e},zt=p.__private__.getStyle=function(t){var e="S";return"F"===t?e="f":"FD"===t||"DF"===t?e="B":"f"!==t&&"f*"!==t&&"B"!==t&&"B*"!==t||(e=t),e};p.__private__.line=p.line=function(t,e,n,r){if(isNaN(t)||isNaN(e)||isNaN(n)||isNaN(r))throw new Error("Invalid arguments passed to jsPDF.line");return this.lines([[n-t,r-e]],t,e)},p.__private__.lines=p.lines=function(t,e,n,r,i,o){var a,s,l,h,u,c,f,p,d,g,m,y;if("number"==typeof t&&(y=n,n=e,e=t,t=y),r=r||[1,1],o=o||!1,isNaN(e)||isNaN(n)||!Array.isArray(t)||!Array.isArray(r)||!Ut(i)||"boolean"!=typeof o)throw new Error("Invalid arguments passed to jsPDF.lines");for(z(x(Xt(e))+" "+x(Kt(n))+" m "),a=r[0],s=r[1],h=t.length,g=e,m=n,l=0;l<h;l++)2===(u=t[l]).length?(g=u[0]*a+g,m=u[1]*s+m,z(x(Xt(g))+" "+x(Kt(m))+" l")):(c=u[0]*a+g,f=u[1]*s+m,p=u[2]*a+g,d=u[3]*s+m,g=u[4]*a+g,m=u[5]*s+m,z(x(Xt(c))+" "+x(Kt(f))+" "+x(Xt(p))+" "+x(Kt(d))+" "+x(Xt(g))+" "+x(Kt(m))+" c"));return o&&z(" h"),null!==i&&z(zt(i)),this},p.__private__.rect=p.rect=function(t,e,n,r,i){if(isNaN(t)||isNaN(e)||isNaN(n)||isNaN(r)||!Ut(i))throw new Error("Invalid arguments passed to jsPDF.rect");return z([b(Xt(t)),b(Kt(e)),b(n*M),b(-r*M),"re"].join(" ")),null!==i&&z(zt(i)),this},p.__private__.triangle=p.triangle=function(t,e,n,r,i,o,a){if(isNaN(t)||isNaN(e)||isNaN(n)||isNaN(r)||isNaN(i)||isNaN(o)||!Ut(a))throw new Error("Invalid arguments passed to jsPDF.triangle");return this.lines([[n-t,r-e],[i-n,o-r],[t-i,e-o]],t,e,[1,1],a,!0),this},p.__private__.roundedRect=p.roundedRect=function(t,e,n,r,i,o,a){if(isNaN(t)||isNaN(e)||isNaN(n)||isNaN(r)||isNaN(i)||isNaN(o)||!Ut(a))throw new Error("Invalid arguments passed to jsPDF.roundedRect");var s=4/3*(Math.SQRT2-1);return this.lines([[n-2*i,0],[i*s,0,i,o-o*s,i,o],[0,r-2*o],[0,o*s,-i*s,o,-i,o],[2*i-n,0],[-i*s,0,-i,-o*s,-i,-o],[0,2*o-r],[0,-o*s,i*s,-o,i,-o]],t+i,e,[1,1],a),this},p.__private__.ellipse=p.ellipse=function(t,e,n,r,i){if(isNaN(t)||isNaN(e)||isNaN(n)||isNaN(r)||!Ut(i))throw new Error("Invalid arguments passed to jsPDF.ellipse");var o=4/3*(Math.SQRT2-1)*n,a=4/3*(Math.SQRT2-1)*r;return z([b(Xt(t+n)),b(Kt(e)),"m",b(Xt(t+n)),b(Kt(e-a)),b(Xt(t+o)),b(Kt(e-r)),b(Xt(t)),b(Kt(e-r)),"c"].join(" ")),z([b(Xt(t-o)),b(Kt(e-r)),b(Xt(t-n)),b(Kt(e-a)),b(Xt(t-n)),b(Kt(e)),"c"].join(" ")),z([b(Xt(t-n)),b(Kt(e+a)),b(Xt(t-o)),b(Kt(e+r)),b(Xt(t)),b(Kt(e+r)),"c"].join(" ")),z([b(Xt(t+o)),b(Kt(e+r)),b(Xt(t+n)),b(Kt(e+a)),b(Xt(t+n)),b(Kt(e)),"c"].join(" ")),null!==i&&z(zt(i)),this},p.__private__.circle=p.circle=function(t,e,n,r){if(isNaN(t)||isNaN(e)||isNaN(n)||!Ut(r))throw new Error("Invalid arguments passed to jsPDF.circle");return this.ellipse(t,e,n,n,r)};p.setFont=function(t,e){return E=Pt(t,e,{disableWarning:!1}),this},p.setFontStyle=p.setFontType=function(t){return E=Pt(void 0,t),this};p.__private__.getFontList=p.getFontList=function(){var t,e,n,r={};for(t in nt)if(nt.hasOwnProperty(t))for(e in r[t]=n=[],nt[t])nt[t].hasOwnProperty(e)&&n.push(e);return r};p.addFont=function(t,e,n,r){Nt.call(this,t,e,n,r=r||"Identity-H")};var Ht,Wt=l.lineWidth||.200025,Vt=p.__private__.setLineWidth=p.setLineWidth=function(t){return z((t*M).toFixed(2)+" w"),this},Gt=(p.__private__.setLineDash=r.API.setLineDash=function(t,e){if(t=t||[],e=e||0,isNaN(e)||!Array.isArray(t))throw new Error("Invalid arguments passed to jsPDF.setLineDash");return t=t.map(function(t){return(t*M).toFixed(3)}).join(" "),e=parseFloat((e*M).toFixed(3)),z("["+t+"] "+e+" d"),this},p.__private__.getLineHeight=p.getLineHeight=function(){return G*Ht}),Yt=(Gt=p.__private__.getLineHeight=p.getLineHeight=function(){return G*Ht},p.__private__.setLineHeightFactor=p.setLineHeightFactor=function(t){return"number"==typeof(t=t||1.15)&&(Ht=t),this}),Jt=p.__private__.getLineHeightFactor=p.getLineHeightFactor=function(){return Ht};Yt(l.lineHeight);var Xt=p.__private__.getHorizontalCoordinate=function(t){return t*M},Kt=p.__private__.getVerticalCoordinate=function(t){return it[k].mediaBox.topRightY-it[k].mediaBox.bottomLeftY-t*M},Zt=p.__private__.getHorizontalCoordinateString=function(t){return b(t*M)},Qt=p.__private__.getVerticalCoordinateString=function(t){return b(it[k].mediaBox.topRightY-it[k].mediaBox.bottomLeftY-t*M)},$t=l.strokeColor||"0 G",te=(p.__private__.getStrokeColor=p.getDrawColor=function(){return dt($t)},p.__private__.setStrokeColor=p.setDrawColor=function(t,e,n,r){return $t=gt({ch1:t,ch2:e,ch3:n,ch4:r,pdfColorType:"draw",precision:2}),z($t),this},l.fillColor||"0 g"),ee=(p.__private__.getFillColor=p.getFillColor=function(){return dt(te)},p.__private__.setFillColor=p.setFillColor=function(t,e,n,r){return te=gt({ch1:t,ch2:e,ch3:n,ch4:r,pdfColorType:"fill",precision:2}),z(te),this},l.textColor||"0 g"),ne=p.__private__.getTextColor=p.getTextColor=function(){return dt(ee)},re=(p.__private__.setTextColor=p.setTextColor=function(t,e,n,r){return ee=gt({ch1:t,ch2:e,ch3:n,ch4:r,pdfColorType:"text",precision:3}),this},l.charSpace||0),ie=p.__private__.getCharSpace=p.getCharSpace=function(){return re},oe=(p.__private__.setCharSpace=p.setCharSpace=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.setCharSpace");return re=t,this},0);p.CapJoinStyles={0:0,butt:0,but:0,miter:0,1:1,round:1,rounded:1,circle:1,2:2,projecting:2,project:2,square:2,bevel:2};p.__private__.setLineCap=p.setLineCap=function(t){var e=p.CapJoinStyles[t];if(void 0===e)throw new Error("Line cap style of '"+t+"' is not recognized. See or extend .CapJoinStyles property for valid styles");return oe=e,z(e+" J"),this};var ae,se=0;p.__private__.setLineJoin=p.setLineJoin=function(t){var e=p.CapJoinStyles[t];if(void 0===e)throw new Error("Line join style of '"+t+"' is not recognized. See or extend .CapJoinStyles property for valid styles");return se=e,z(e+" j"),this},p.__private__.setMiterLimit=p.setMiterLimit=function(t){if(t=t||0,isNaN(t))throw new Error("Invalid argument passed to jsPDF.setMiterLimit");return ae=parseFloat(b(t*M)),z(ae+" M"),this};for(var le in p.save=function(t,n){if(t=t||"generated.pdf",(n=n||{}).returnPromise=n.returnPromise||!1,!1!==n.returnPromise)return new Promise(function(n,r){try{var i=v(Mt(Et()),t);"function"==typeof v.unload&&e.setTimeout&&setTimeout(v.unload,911),n(i)}catch(t){r(t.message)}});v(Mt(Et()),t),"function"==typeof v.unload&&e.setTimeout&&setTimeout(v.unload,911)},r.API)r.API.hasOwnProperty(le)&&("events"===le&&r.API.events.length?function(t,e){var n,r,i;for(i=e.length-1;-1!==i;i--)n=e[i][0],r=e[i][1],t.subscribe.apply(t,[n].concat("function"==typeof r?[r]:r))}(at,r.API.events):p[le]=r.API[le]);return p.internal={pdfEscape:Lt,getStyle:zt,getFont:function(){return et[Pt.apply(p,arguments)]},getFontSize:Y,getCharSpace:ie,getTextColor:ne,getLineHeight:Gt,getLineHeightFactor:Jt,write:H,getHorizontalCoordinate:Xt,getVerticalCoordinate:Kt,getCoordinateString:Zt,getVerticalCoordinateString:Qt,collections:{},newObject:lt,newAdditionalObject:ct,newObjectDeferred:ht,newObjectDeferredBegin:ut,getFilters:mt,putStream:yt,events:at,scaleFactor:M,pageSize:{getWidth:function(){return(it[k].mediaBox.topRightX-it[k].mediaBox.bottomLeftX)/M},setWidth:function(t){it[k].mediaBox.topRightX=t*M+it[k].mediaBox.bottomLeftX},getHeight:function(){return(it[k].mediaBox.topRightY-it[k].mediaBox.bottomLeftY)/M},setHeight:function(t){it[k].mediaBox.topRightY=t*M+it[k].mediaBox.bottomLeftY}},output:Ot,getNumberOfPages:Ft,pages:R,out:z,f2:b,f3:x,getPageInfo:Tt,getPageInfoByObjId:Rt,getCurrentPageInfo:Dt,getPDFVersion:g,hasHotfix:qt},Object.defineProperty(p.internal.pageSize,"width",{get:function(){return(it[k].mediaBox.topRightX-it[k].mediaBox.bottomLeftX)/M},set:function(t){it[k].mediaBox.topRightX=t*M+it[k].mediaBox.bottomLeftX},enumerable:!0,configurable:!0}),Object.defineProperty(p.internal.pageSize,"height",{get:function(){return(it[k].mediaBox.topRightY-it[k].mediaBox.bottomLeftY)/M},set:function(t){it[k].mediaBox.topRightY=t*M+it[k].mediaBox.bottomLeftY},enumerable:!0,configurable:!0}),function(t){for(var e=0,n=V.length;e<n;e++){var r=Nt(t[e][0],t[e][1],t[e][2],V[e][3],!0);f[r]=!0;var i=t[e][0].split("-");xt(r,i[0],i[1]||"")}at.publish("addFonts",{fonts:et,dictionary:nt})}(V),E="F1",St(a,i),at.publish("initialized"),p}return r.API={events:[]},r.version="1.5.3","function"==typeof define&&define.amd?define("jsPDF",function(){return r}):"undefined"!=typeof module&&module.exports?(module.exports=r,module.exports.jsPDF=r):e.jsPDF=r,r}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof global&&global||Function('return typeof this === "object" && this.content')()||Function("return this")());window.tmp=y,function(e,n){var r,i=1,o=function(t){return t.replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)")},a=function(t){return t.replace(/\\\\/g,"\\").replace(/\\\(/g,"(").replace(/\\\)/g,")")},s=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f2");return t.toFixed(2)},l=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f2");return t.toFixed(5)};e.__acroform__={};var h=function(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t},u=function(t){return t*i},c=function(t){return t/i},f=function(t){var e=new E,n=J.internal.getHeight(t)||0,r=J.internal.getWidth(t)||0;return e.BBox=[0,0,Number(s(r)),Number(s(n))],e},p=e.__acroform__.setBit=function(t,e){if(t=t||0,e=e||0,isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBit");return t|=1<<e},d=e.__acroform__.clearBit=function(t,e){if(t=t||0,e=e||0,isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBit");return t&=~(1<<e)},g=e.__acroform__.getBit=function(t,e){if(isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBit");return 0==(t&1<<e)?0:1},m=e.__acroform__.getBitForPdf=function(t,e){if(isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBitForPdf");return g(t,e-1)},y=e.__acroform__.setBitForPdf=function(t,e){if(isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBitForPdf");return p(t,e-1)},v=e.__acroform__.clearBitForPdf=function(t,e,n){if(isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBitForPdf");return d(t,e-1)},w=e.__acroform__.calculateCoordinates=function(t){var e=this.internal.getHorizontalCoordinate,n=this.internal.getVerticalCoordinate,r=t[0],i=t[1],o=t[2],a=t[3],l={};return l.lowerLeft_X=e(r)||0,l.lowerLeft_Y=n(i+a)||0,l.upperRight_X=e(r+o)||0,l.upperRight_Y=n(i)||0,[Number(s(l.lowerLeft_X)),Number(s(l.lowerLeft_Y)),Number(s(l.upperRight_X)),Number(s(l.upperRight_Y))]},b=function(t){if(t.appearanceStreamContent)return t.appearanceStreamContent;if(t.V||t.DV){var e=[],n=t.V||t.DV,i=x(t,n),o=r.internal.getFont(t.fontName,t.fontStyle).id;e.push("/Tx BMC"),e.push("q"),e.push("BT"),e.push(r.__private__.encodeColorString(t.color)),e.push("/"+o+" "+s(i.fontSize)+" Tf"),e.push("1 0 0 1 0 0 Tm"),e.push(i.text),e.push("ET"),e.push("Q"),e.push("EMC");var a=new f(t);return a.stream=e.join("\n"),a}},x=function(t,e){var n=t.maxFontSize||12,i=(t.fontName,{text:"",fontSize:""}),a=(e=")"==(e="("==e.substr(0,1)?e.substr(1):e).substr(e.length-1)?e.substr(0,e.length-1):e).split(" "),l=(r.__private__.encodeColorString(t.color),n),h=J.internal.getHeight(t)||0;h=h<0?-h:h;var u=J.internal.getWidth(t)||0;u=u<0?-u:u;var c=function(e,n,r){if(e+1<a.length){var i=n+" "+a[e+1];return N(i,t,r).width<=u-4}return!1};l++;t:for(;;){e="";var f=N("3",t,--l).height,p=t.multiline?h-l:(h-f)/2,d=-2,g=p+=2,m=0,y=0,v=0;if(l<=0){e="(...) Tj\n",e+="% Width of Text: "+N(e,t,l=12).width+", FieldWidth:"+u+"\n";break}v=N(a[0]+" ",t,l).width;var w="",b=0;for(var x in a)if(a.hasOwnProperty(x)){w=" "==(w+=a[x]+" ").substr(w.length-1)?w.substr(0,w.length-1):w;var L=parseInt(x);v=N(w+" ",t,l).width;var A=c(L,w,l),S=x>=a.length-1;if(A&&!S){w+=" ";continue}if(A||S){if(S)y=L;else if(t.multiline&&(f+2)*(b+2)+2>h)continue t}else{if(!t.multiline)continue t;if((f+2)*(b+2)+2>h)continue t;y=L}for(var _="",F=m;F<=y;F++)_+=a[F]+" ";switch(_=" "==_.substr(_.length-1)?_.substr(0,_.length-1):_,v=N(_,t,l).width,t.textAlign){case"right":d=u-v-2;break;case"center":d=(u-v)/2;break;case"left":default:d=2}e+=s(d)+" "+s(g)+" Td\n",e+="("+o(_)+") Tj\n",e+=-s(d)+" 0 Td\n",g=-(l+2),v=0,m=y+1,b++,w=""}else;break}return i.text=e,i.fontSize=l,i},N=function(t,e,n){var i=r.internal.getFont(e.fontName,e.fontStyle),o=r.getStringUnitWidth(t,{font:i,fontSize:parseFloat(n),charSpace:0})*parseFloat(n);return{height:r.getStringUnitWidth("3",{font:i,fontSize:parseFloat(n),charSpace:0})*parseFloat(n)*1.5,width:o}},L={fields:[],xForms:[],acroFormDictionaryRoot:null,printedOut:!1,internal:null,isInitialized:!1},A=function(){r.internal.acroformPlugin.acroFormDictionaryRoot.objId=void 0;var t=r.internal.acroformPlugin.acroFormDictionaryRoot.Fields;for(var e in t)if(t.hasOwnProperty(e)){var n=t[e];n.objId=void 0,n.hasAnnotation&&S.call(r,n)}},S=function(t){var e={type:"reference",object:t};void 0===r.internal.getPageInfo(t.page).pageContext.annotations.find(function(t){return t.type===e.type&&t.object===e.object})&&r.internal.getPageInfo(t.page).pageContext.annotations.push(e)},_=function(){if(void 0===r.internal.acroformPlugin.acroFormDictionaryRoot)throw new Error("putCatalogCallback: Root missing.");r.internal.write("/AcroForm "+r.internal.acroformPlugin.acroFormDictionaryRoot.objId+" 0 R")},F=function(){r.internal.events.unsubscribe(r.internal.acroformPlugin.acroFormDictionaryRoot._eventID),delete r.internal.acroformPlugin.acroFormDictionaryRoot._eventID,r.internal.acroformPlugin.printedOut=!0},P=function(e){var n=!e;e||(r.internal.newObjectDeferredBegin(r.internal.acroformPlugin.acroFormDictionaryRoot.objId,!0),r.internal.acroformPlugin.acroFormDictionaryRoot.putStream());e=e||r.internal.acroformPlugin.acroFormDictionaryRoot.Kids;for(var i in e)if(e.hasOwnProperty(i)){var o=e[i],a=[],s=o.Rect;if(o.Rect&&(o.Rect=w.call(this,o.Rect)),r.internal.newObjectDeferredBegin(o.objId,!0),o.DA=J.createDefaultAppearanceStream(o),"object"===t(o)&&"function"==typeof o.getKeyValueListForStream&&(a=o.getKeyValueListForStream()),o.Rect=s,o.hasAppearanceStream&&!o.appearanceStreamContent){var l=b.call(this,o);a.push({key:"AP",value:"<</N "+l+">>"}),r.internal.acroformPlugin.xForms.push(l)}if(o.appearanceStreamContent){var h="";for(var u in o.appearanceStreamContent)if(o.appearanceStreamContent.hasOwnProperty(u)){var c=o.appearanceStreamContent[u];if(h+="/"+u+" ",h+="<<",Object.keys(c).length>=1||Array.isArray(c))for(var i in c){var f;if(c.hasOwnProperty(i))"function"==typeof(f=c[i])&&(f=f.call(this,o)),h+="/"+i+" "+f+" ",r.internal.acroformPlugin.xForms.indexOf(f)>=0||r.internal.acroformPlugin.xForms.push(f)}else"function"==typeof(f=c)&&(f=f.call(this,o)),h+="/"+i+" "+f,r.internal.acroformPlugin.xForms.indexOf(f)>=0||r.internal.acroformPlugin.xForms.push(f);h+=">>"}a.push({key:"AP",value:"<<\n"+h+">>"})}r.internal.putStream({additionalKeyValues:a}),r.internal.out("endobj")}n&&k.call(this,r.internal.acroformPlugin.xForms)},k=function(e){for(var n in e)if(e.hasOwnProperty(n)){var i=n,o=e[n];r.internal.newObjectDeferredBegin(o&&o.objId,!0),"object"===t(o)&&"function"==typeof o.putStream&&o.putStream(),delete e[i]}},I=function(){if(void 0!==this.internal&&(void 0===this.internal.acroformPlugin||!1===this.internal.acroformPlugin.isInitialized)){if(r=this,O.FieldNum=0,this.internal.acroformPlugin=JSON.parse(JSON.stringify(L)),this.internal.acroformPlugin.acroFormDictionaryRoot)throw new Error("Exception while creating AcroformDictionary");i=r.internal.scaleFactor,r.internal.acroformPlugin.acroFormDictionaryRoot=new M,r.internal.acroformPlugin.acroFormDictionaryRoot._eventID=r.internal.events.subscribe("postPutResources",F),r.internal.events.subscribe("buildDocument",A),r.internal.events.subscribe("putCatalog",_),r.internal.events.subscribe("postPutPages",P),r.internal.acroformPlugin.isInitialized=!0}},C=e.__acroform__.arrayToPdfArray=function(e){if(Array.isArray(e)){for(var n="[",r=0;r<e.length;r++)switch(0!==r&&(n+=" "),t(e[r])){case"boolean":case"number":case"object":n+=e[r].toString();break;case"string":"/"!==e[r].substr(0,1)?n+="("+o(e[r].toString())+")":n+=e[r].toString()}return n+="]"}throw new Error("Invalid argument passed to jsPDF.__acroform__.arrayToPdfArray")};var B=function(t){return(t=t||"").toString(),t="("+o(t)+")"},j=function(){var t;Object.defineProperty(this,"objId",{configurable:!0,get:function(){if(t||(t=r.internal.newObjectDeferred()),!t)throw new Error("AcroFormPDFObject: Couldn't create Object ID");return t},set:function(e){t=e}})};j.prototype.toString=function(){return this.objId+" 0 R"},j.prototype.putStream=function(){var t=this.getKeyValueListForStream();r.internal.putStream({data:this.stream,additionalKeyValues:t}),r.internal.out("endobj")},j.prototype.getKeyValueListForStream=function(){return function(t){var e=[],n=Object.getOwnPropertyNames(t).filter(function(t){return"content"!=t&&"appearanceStreamContent"!=t&&"_"!=t.substring(0,1)});for(var r in n)if(!1===Object.getOwnPropertyDescriptor(t,n[r]).configurable){var i=n[r],o=t[i];o&&(Array.isArray(o)?e.push({key:i,value:C(o)}):o instanceof j?e.push({key:i,value:o.objId+" 0 R"}):"function"!=typeof o&&e.push({key:i,value:o}))}return e}(this)};var E=function(){j.call(this),Object.defineProperty(this,"Type",{value:"/XObject",configurable:!1,writeable:!0}),Object.defineProperty(this,"Subtype",{value:"/Form",configurable:!1,writeable:!0}),Object.defineProperty(this,"FormType",{value:1,configurable:!1,writeable:!0});var t,e=[];Object.defineProperty(this,"BBox",{configurable:!1,writeable:!0,get:function(){return e},set:function(t){e=t}}),Object.defineProperty(this,"Resources",{value:"2 0 R",configurable:!1,writeable:!0}),Object.defineProperty(this,"stream",{enumerable:!1,configurable:!0,set:function(e){t=e.trim()},get:function(){return t||null}})};h(E,j);var M=function(){j.call(this);var t,e=[];Object.defineProperty(this,"Kids",{enumerable:!1,configurable:!0,get:function(){return e.length>0?e:void 0}}),Object.defineProperty(this,"Fields",{enumerable:!1,configurable:!1,get:function(){return e}}),Object.defineProperty(this,"DA",{enumerable:!1,configurable:!1,get:function(){if(t)return"("+t+")"},set:function(e){t=e}})};h(M,j);var O=function t(){j.call(this);var e=4;Object.defineProperty(this,"F",{enumerable:!1,configurable:!1,get:function(){return e},set:function(t){if(isNaN(t))throw new Error('Invalid value "'+t+'" for attribute F supplied.');e=t}}),Object.defineProperty(this,"showWhenPrinted",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(e,3))},set:function(t){!0===Boolean(t)?this.F=y(e,3):this.F=v(e,3)}});var n=0;Object.defineProperty(this,"Ff",{enumerable:!1,configurable:!1,get:function(){return n},set:function(t){if(isNaN(t))throw new Error('Invalid value "'+t+'" for attribute Ff supplied.');n=t}});var r=[];Object.defineProperty(this,"Rect",{enumerable:!1,configurable:!1,get:function(){if(0!==r.length)return r},set:function(t){r=void 0!==t?t:[]}}),Object.defineProperty(this,"x",{enumerable:!0,configurable:!0,get:function(){return!r||isNaN(r[0])?0:c(r[0])},set:function(t){r[0]=u(t)}}),Object.defineProperty(this,"y",{enumerable:!0,configurable:!0,get:function(){return!r||isNaN(r[1])?0:c(r[1])},set:function(t){r[1]=u(t)}}),Object.defineProperty(this,"width",{enumerable:!0,configurable:!0,get:function(){return!r||isNaN(r[2])?0:c(r[2])},set:function(t){r[2]=u(t)}}),Object.defineProperty(this,"height",{enumerable:!0,configurable:!0,get:function(){return!r||isNaN(r[3])?0:c(r[3])},set:function(t){r[3]=u(t)}});var i="";Object.defineProperty(this,"FT",{enumerable:!0,configurable:!1,get:function(){return i},set:function(t){switch(t){case"/Btn":case"/Tx":case"/Ch":case"/Sig":i=t;break;default:throw new Error('Invalid value "'+t+'" for attribute FT supplied.')}}});var s=null;Object.defineProperty(this,"T",{enumerable:!0,configurable:!1,get:function(){if(!s||s.length<1){if(this instanceof W)return;s="FieldObject"+t.FieldNum++}return"("+o(s)+")"},set:function(t){s=t.toString()}}),Object.defineProperty(this,"fieldName",{configurable:!0,enumerable:!0,get:function(){return s},set:function(t){s=t}});var l="helvetica";Object.defineProperty(this,"fontName",{enumerable:!0,configurable:!0,get:function(){return l},set:function(t){l=t}});var h="normal";Object.defineProperty(this,"fontStyle",{enumerable:!0,configurable:!0,get:function(){return h},set:function(t){h=t}});var f=0;Object.defineProperty(this,"fontSize",{enumerable:!0,configurable:!0,get:function(){return c(f)},set:function(t){f=u(t)}});var p=50;Object.defineProperty(this,"maxFontSize",{enumerable:!0,configurable:!0,get:function(){return c(p)},set:function(t){p=u(t)}});var d="black";Object.defineProperty(this,"color",{enumerable:!0,configurable:!0,get:function(){return d},set:function(t){d=t}});var g="/F1 0 Tf 0 g";Object.defineProperty(this,"DA",{enumerable:!0,configurable:!1,get:function(){if(!(!g||this instanceof W||this instanceof G))return B(g)},set:function(t){t=t.toString(),g=t}});var w=null;Object.defineProperty(this,"DV",{enumerable:!1,configurable:!1,get:function(){if(w)return this instanceof U==!1?B(w):w},set:function(t){t=t.toString(),w=this instanceof U==!1?"("===t.substr(0,1)?a(t.substr(1,t.length-2)):a(t):t}}),Object.defineProperty(this,"defaultValue",{enumerable:!0,configurable:!0,get:function(){return this instanceof U==!0?a(w.substr(1,w.length-1)):w},set:function(t){t=t.toString(),w=this instanceof U==!0?"/"+t:t}});var b=null;Object.defineProperty(this,"V",{enumerable:!1,configurable:!1,get:function(){if(b)return this instanceof U==!1?B(b):b},set:function(t){t=t.toString(),b=this instanceof U==!1?"("===t.substr(0,1)?a(t.substr(1,t.length-2)):a(t):t}}),Object.defineProperty(this,"value",{enumerable:!0,configurable:!0,get:function(){return this instanceof U==!0?a(b.substr(1,b.length-1)):b},set:function(t){t=t.toString(),b=this instanceof U==!0?"/"+t:t}}),Object.defineProperty(this,"hasAnnotation",{enumerable:!0,configurable:!0,get:function(){return this.Rect}}),Object.defineProperty(this,"Type",{enumerable:!0,configurable:!1,get:function(){return this.hasAnnotation?"/Annot":null}}),Object.defineProperty(this,"Subtype",{enumerable:!0,configurable:!1,get:function(){return this.hasAnnotation?"/Widget":null}});var x,N=!1;Object.defineProperty(this,"hasAppearanceStream",{enumerable:!0,configurable:!0,writeable:!0,get:function(){return N},set:function(t){t=Boolean(t),N=t}}),Object.defineProperty(this,"page",{enumerable:!0,configurable:!0,writeable:!0,get:function(){if(x)return x},set:function(t){x=t}}),Object.defineProperty(this,"readOnly",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,1))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,1):this.Ff=v(this.Ff,1)}}),Object.defineProperty(this,"required",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,2))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,2):this.Ff=v(this.Ff,2)}}),Object.defineProperty(this,"noExport",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,3))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,3):this.Ff=v(this.Ff,3)}});var L=null;Object.defineProperty(this,"Q",{enumerable:!0,configurable:!1,get:function(){if(null!==L)return L},set:function(t){if(-1===[0,1,2].indexOf(t))throw new Error('Invalid value "'+t+'" for attribute Q supplied.');L=t}}),Object.defineProperty(this,"textAlign",{get:function(){var t="left";switch(L){case 0:default:t="left";break;case 1:t="center";break;case 2:t="right"}return t},configurable:!0,enumerable:!0,set:function(t){switch(t){case"right":case 2:L=2;break;case"center":case 1:L=1;break;case"left":case 0:default:L=0}}})};h(O,j);var q=function(){O.call(this),this.FT="/Ch",this.V="()",this.fontName="zapfdingbats";var t=0;Object.defineProperty(this,"TI",{enumerable:!0,configurable:!1,get:function(){return t},set:function(e){t=e}}),Object.defineProperty(this,"topIndex",{enumerable:!0,configurable:!0,get:function(){return t},set:function(e){t=e}});var e=[];Object.defineProperty(this,"Opt",{enumerable:!0,configurable:!1,get:function(){return C(e)},set:function(t){var n,r;r=[],"string"==typeof(n=t)&&(r=function(t,e,n){n||(n=1);for(var r,i=[];r=e.exec(t);)i.push(r[n]);return i}(n,/\((.*?)\)/g)),e=r}}),this.getOptions=function(){return e},this.setOptions=function(t){e=t,this.sort&&e.sort()},this.addOption=function(t){t=(t=t||"").toString(),e.push(t),this.sort&&e.sort()},this.removeOption=function(t,n){for(n=n||!1,t=(t=t||"").toString();-1!==e.indexOf(t)&&(e.splice(e.indexOf(t),1),!1!==n););},Object.defineProperty(this,"combo",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,18))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,18):this.Ff=v(this.Ff,18)}}),Object.defineProperty(this,"edit",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,19))},set:function(t){!0===this.combo&&(!0===Boolean(t)?this.Ff=y(this.Ff,19):this.Ff=v(this.Ff,19))}}),Object.defineProperty(this,"sort",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,20))},set:function(t){!0===Boolean(t)?(this.Ff=y(this.Ff,20),e.sort()):this.Ff=v(this.Ff,20)}}),Object.defineProperty(this,"multiSelect",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,22))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,22):this.Ff=v(this.Ff,22)}}),Object.defineProperty(this,"doNotSpellCheck",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,23))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,23):this.Ff=v(this.Ff,23)}}),Object.defineProperty(this,"commitOnSelChange",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,27))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,27):this.Ff=v(this.Ff,27)}}),this.hasAppearanceStream=!1};h(q,O);var T=function(){q.call(this),this.fontName="helvetica",this.combo=!1};h(T,q);var R=function(){T.call(this),this.combo=!0};h(R,T);var D=function(){R.call(this),this.edit=!0};h(D,R);var U=function(){O.call(this),this.FT="/Btn",Object.defineProperty(this,"noToggleToOff",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,15))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,15):this.Ff=v(this.Ff,15)}}),Object.defineProperty(this,"radio",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,16))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,16):this.Ff=v(this.Ff,16)}}),Object.defineProperty(this,"pushButton",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,17))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,17):this.Ff=v(this.Ff,17)}}),Object.defineProperty(this,"radioIsUnison",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,26))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,26):this.Ff=v(this.Ff,26)}});var e,n={};Object.defineProperty(this,"MK",{enumerable:!1,configurable:!1,get:function(){if(0!==Object.keys(n).length){var t,e=[];for(t in e.push("<<"),n)e.push("/"+t+" ("+n[t]+")");return e.push(">>"),e.join("\n")}},set:function(e){"object"===t(e)&&(n=e)}}),Object.defineProperty(this,"caption",{enumerable:!0,configurable:!0,get:function(){return n.CA||""},set:function(t){"string"==typeof t&&(n.CA=t)}}),Object.defineProperty(this,"AS",{enumerable:!1,configurable:!1,get:function(){return e},set:function(t){e=t}}),Object.defineProperty(this,"appearanceState",{enumerable:!0,configurable:!0,get:function(){return e.substr(1,e.length-1)},set:function(t){e="/"+t}})};h(U,O);var z=function(){U.call(this),this.pushButton=!0};h(z,U);var H=function(){U.call(this),this.radio=!0,this.pushButton=!1;var t=[];Object.defineProperty(this,"Kids",{enumerable:!0,configurable:!1,get:function(){return t},set:function(e){t=void 0!==e?e:[]}})};h(H,U);var W=function(){var e,n;O.call(this),Object.defineProperty(this,"Parent",{enumerable:!1,configurable:!1,get:function(){return e},set:function(t){e=t}}),Object.defineProperty(this,"optionName",{enumerable:!1,configurable:!0,get:function(){return n},set:function(t){n=t}});var r,i={};Object.defineProperty(this,"MK",{enumerable:!1,configurable:!1,get:function(){var t,e=[];for(t in e.push("<<"),i)e.push("/"+t+" ("+i[t]+")");return e.push(">>"),e.join("\n")},set:function(e){"object"===t(e)&&(i=e)}}),Object.defineProperty(this,"caption",{enumerable:!0,configurable:!0,get:function(){return i.CA||""},set:function(t){"string"==typeof t&&(i.CA=t)}}),Object.defineProperty(this,"AS",{enumerable:!1,configurable:!1,get:function(){return r},set:function(t){r=t}}),Object.defineProperty(this,"appearanceState",{enumerable:!0,configurable:!0,get:function(){return r.substr(1,r.length-1)},set:function(t){r="/"+t}}),this.optionName=name,this.caption="l",this.appearanceState="Off",this._AppearanceType=J.RadioButton.Circle,this.appearanceStreamContent=this._AppearanceType.createAppearanceStream(name)};h(W,O),H.prototype.setAppearance=function(t){if(!("createAppearanceStream"in t&&"getCA"in t))throw new Error("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");for(var e in this.Kids)if(this.Kids.hasOwnProperty(e)){var n=this.Kids[e];n.appearanceStreamContent=t.createAppearanceStream(n.optionName),n.caption=t.getCA()}},H.prototype.createOption=function(t){this.Kids.length;var e=new W;return e.Parent=this,e.optionName=t,this.Kids.push(e),X.call(this,e),e};var V=function(){U.call(this),this.fontName="zapfdingbats",this.caption="3",this.appearanceState="On",this.value="On",this.textAlign="center",this.appearanceStreamContent=J.CheckBox.createAppearanceStream()};h(V,U);var G=function(){O.call(this),this.FT="/Tx",Object.defineProperty(this,"multiline",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,13))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,13):this.Ff=v(this.Ff,13)}}),Object.defineProperty(this,"fileSelect",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,21))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,21):this.Ff=v(this.Ff,21)}}),Object.defineProperty(this,"doNotSpellCheck",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,23))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,23):this.Ff=v(this.Ff,23)}}),Object.defineProperty(this,"doNotScroll",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,24))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,24):this.Ff=v(this.Ff,24)}}),Object.defineProperty(this,"comb",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,25))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,25):this.Ff=v(this.Ff,25)}}),Object.defineProperty(this,"richText",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,26))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,26):this.Ff=v(this.Ff,26)}});var t=null;Object.defineProperty(this,"MaxLen",{enumerable:!0,configurable:!1,get:function(){return t},set:function(e){t=e}}),Object.defineProperty(this,"maxLength",{enumerable:!0,configurable:!0,get:function(){return t},set:function(e){Number.isInteger(e)&&(t=e)}}),Object.defineProperty(this,"hasAppearanceStream",{enumerable:!0,configurable:!0,get:function(){return this.V||this.DV}})};h(G,O);var Y=function(){G.call(this),Object.defineProperty(this,"password",{enumerable:!0,configurable:!0,get:function(){return Boolean(m(this.Ff,14))},set:function(t){!0===Boolean(t)?this.Ff=y(this.Ff,14):this.Ff=v(this.Ff,14)}}),this.password=!0};h(Y,G);var J={CheckBox:{createAppearanceStream:function(){return{N:{On:J.CheckBox.YesNormal},D:{On:J.CheckBox.YesPushDown,Off:J.CheckBox.OffPushDown}}},YesPushDown:function(t){var e=f(t),n=[],i=r.internal.getFont(t.fontName,t.fontStyle).id,o=r.__private__.encodeColorString(t.color),a=x(t,t.caption);return n.push("0.749023 g"),n.push("0 0 "+s(J.internal.getWidth(t))+" "+s(J.internal.getHeight(t))+" re"),n.push("f"),n.push("BMC"),n.push("q"),n.push("0 0 1 rg"),n.push("/"+i+" "+s(a.fontSize)+" Tf "+o),n.push("BT"),n.push(a.text),n.push("ET"),n.push("Q"),n.push("EMC"),e.stream=n.join("\n"),e},YesNormal:function(t){var e=f(t),n=r.internal.getFont(t.fontName,t.fontStyle).id,i=r.__private__.encodeColorString(t.color),o=[],a=J.internal.getHeight(t),l=J.internal.getWidth(t),h=x(t,t.caption);return o.push("1 g"),o.push("0 0 "+s(l)+" "+s(a)+" re"),o.push("f"),o.push("q"),o.push("0 0 1 rg"),o.push("0 0 "+s(l-1)+" "+s(a-1)+" re"),o.push("W"),o.push("n"),o.push("0 g"),o.push("BT"),o.push("/"+n+" "+s(h.fontSize)+" Tf "+i),o.push(h.text),o.push("ET"),o.push("Q"),e.stream=o.join("\n"),e},OffPushDown:function(t){var e=f(t),n=[];return n.push("0.749023 g"),n.push("0 0 "+s(J.internal.getWidth(t))+" "+s(J.internal.getHeight(t))+" re"),n.push("f"),e.stream=n.join("\n"),e}},RadioButton:{Circle:{createAppearanceStream:function(t){var e={D:{Off:J.RadioButton.Circle.OffPushDown},N:{}};return e.N[t]=J.RadioButton.Circle.YesNormal,e.D[t]=J.RadioButton.Circle.YesPushDown,e},getCA:function(){return"l"},YesNormal:function(t){var e=f(t),n=[],r=J.internal.getWidth(t)<=J.internal.getHeight(t)?J.internal.getWidth(t)/4:J.internal.getHeight(t)/4;r=Number((.9*r).toFixed(5));var i=J.internal.Bezier_C,o=Number((r*i).toFixed(5));return n.push("q"),n.push("1 0 0 1 "+l(J.internal.getWidth(t)/2)+" "+l(J.internal.getHeight(t)/2)+" cm"),n.push(r+" 0 m"),n.push(r+" "+o+" "+o+" "+r+" 0 "+r+" c"),n.push("-"+o+" "+r+" -"+r+" "+o+" -"+r+" 0 c"),n.push("-"+r+" -"+o+" -"+o+" -"+r+" 0 -"+r+" c"),n.push(o+" -"+r+" "+r+" -"+o+" "+r+" 0 c"),n.push("f"),n.push("Q"),e.stream=n.join("\n"),e},YesPushDown:function(t){var e=f(t),n=[],r=J.internal.getWidth(t)<=J.internal.getHeight(t)?J.internal.getWidth(t)/4:J.internal.getHeight(t)/4,i=(r=Number((.9*r).toFixed(5)),Number((2*r).toFixed(5))),o=Number((i*J.internal.Bezier_C).toFixed(5)),a=Number((r*J.internal.Bezier_C).toFixed(5));return n.push("0.749023 g"),n.push("q"),n.push("1 0 0 1 "+l(J.internal.getWidth(t)/2)+" "+l(J.internal.getHeight(t)/2)+" cm"),n.push(i+" 0 m"),n.push(i+" "+o+" "+o+" "+i+" 0 "+i+" c"),n.push("-"+o+" "+i+" -"+i+" "+o+" -"+i+" 0 c"),n.push("-"+i+" -"+o+" -"+o+" -"+i+" 0 -"+i+" c"),n.push(o+" -"+i+" "+i+" -"+o+" "+i+" 0 c"),n.push("f"),n.push("Q"),n.push("0 g"),n.push("q"),n.push("1 0 0 1 "+l(J.internal.getWidth(t)/2)+" "+l(J.internal.getHeight(t)/2)+" cm"),n.push(r+" 0 m"),n.push(r+" "+a+" "+a+" "+r+" 0 "+r+" c"),n.push("-"+a+" "+r+" -"+r+" "+a+" -"+r+" 0 c"),n.push("-"+r+" -"+a+" -"+a+" -"+r+" 0 -"+r+" c"),n.push(a+" -"+r+" "+r+" -"+a+" "+r+" 0 c"),n.push("f"),n.push("Q"),e.stream=n.join("\n"),e},OffPushDown:function(t){var e=f(t),n=[],r=J.internal.getWidth(t)<=J.internal.getHeight(t)?J.internal.getWidth(t)/4:J.internal.getHeight(t)/4,i=(r=Number((.9*r).toFixed(5)),Number((2*r).toFixed(5))),o=Number((i*J.internal.Bezier_C).toFixed(5));return n.push("0.749023 g"),n.push("q"),n.push("1 0 0 1 "+l(J.internal.getWidth(t)/2)+" "+l(J.internal.getHeight(t)/2)+" cm"),n.push(i+" 0 m"),n.push(i+" "+o+" "+o+" "+i+" 0 "+i+" c"),n.push("-"+o+" "+i+" -"+i+" "+o+" -"+i+" 0 c"),n.push("-"+i+" -"+o+" -"+o+" -"+i+" 0 -"+i+" c"),n.push(o+" -"+i+" "+i+" -"+o+" "+i+" 0 c"),n.push("f"),n.push("Q"),e.stream=n.join("\n"),e}},Cross:{createAppearanceStream:function(t){var e={D:{Off:J.RadioButton.Cross.OffPushDown},N:{}};return e.N[t]=J.RadioButton.Cross.YesNormal,e.D[t]=J.RadioButton.Cross.YesPushDown,e},getCA:function(){return"8"},YesNormal:function(t){var e=f(t),n=[],r=J.internal.calculateCross(t);return n.push("q"),n.push("1 1 "+s(J.internal.getWidth(t)-2)+" "+s(J.internal.getHeight(t)-2)+" re"),n.push("W"),n.push("n"),n.push(s(r.x1.x)+" "+s(r.x1.y)+" m"),n.push(s(r.x2.x)+" "+s(r.x2.y)+" l"),n.push(s(r.x4.x)+" "+s(r.x4.y)+" m"),n.push(s(r.x3.x)+" "+s(r.x3.y)+" l"),n.push("s"),n.push("Q"),e.stream=n.join("\n"),e},YesPushDown:function(t){var e=f(t),n=J.internal.calculateCross(t),r=[];return r.push("0.749023 g"),r.push("0 0 "+s(J.internal.getWidth(t))+" "+s(J.internal.getHeight(t))+" re"),r.push("f"),r.push("q"),r.push("1 1 "+s(J.internal.getWidth(t)-2)+" "+s(J.internal.getHeight(t)-2)+" re"),r.push("W"),r.push("n"),r.push(s(n.x1.x)+" "+s(n.x1.y)+" m"),r.push(s(n.x2.x)+" "+s(n.x2.y)+" l"),r.push(s(n.x4.x)+" "+s(n.x4.y)+" m"),r.push(s(n.x3.x)+" "+s(n.x3.y)+" l"),r.push("s"),r.push("Q"),e.stream=r.join("\n"),e},OffPushDown:function(t){var e=f(t),n=[];return n.push("0.749023 g"),n.push("0 0 "+s(J.internal.getWidth(t))+" "+s(J.internal.getHeight(t))+" re"),n.push("f"),e.stream=n.join("\n"),e}}},createDefaultAppearanceStream:function(t){var e=r.internal.getFont(t.fontName,t.fontStyle).id,n=r.__private__.encodeColorString(t.color);return"/"+e+" "+t.fontSize+" Tf "+n}};J.internal={Bezier_C:.551915024494,calculateCross:function(t){var e=J.internal.getWidth(t),n=J.internal.getHeight(t),r=Math.min(e,n);return{x1:{x:(e-r)/2,y:(n-r)/2+r},x2:{x:(e-r)/2+r,y:(n-r)/2},x3:{x:(e-r)/2,y:(n-r)/2},x4:{x:(e-r)/2+r,y:(n-r)/2+r}}}},J.internal.getWidth=function(e){var n=0;return"object"===t(e)&&(n=u(e.Rect[2])),n},J.internal.getHeight=function(e){var n=0;return"object"===t(e)&&(n=u(e.Rect[3])),n};var X=e.addField=function(t){if(I.call(this),!(t instanceof O))throw new Error("Invalid argument passed to jsPDF.addField.");return function(t){r.internal.acroformPlugin.printedOut&&(r.internal.acroformPlugin.printedOut=!1,r.internal.acroformPlugin.acroFormDictionaryRoot=null),r.internal.acroformPlugin.acroFormDictionaryRoot||I.call(r),r.internal.acroformPlugin.acroFormDictionaryRoot.Fields.push(t)}.call(this,t),t.page=r.internal.getCurrentPageInfo().pageNumber,this};e.addButton=function(t){if(t instanceof U==!1)throw new Error("Invalid argument passed to jsPDF.addButton.");return X.call(this,t)},e.addTextField=function(t){if(t instanceof G==!1)throw new Error("Invalid argument passed to jsPDF.addTextField.");return X.call(this,t)},e.addChoiceField=function(t){if(t instanceof q==!1)throw new Error("Invalid argument passed to jsPDF.addChoiceField.");return X.call(this,t)};"object"==t(n)&&void 0===n.ChoiceField&&void 0===n.ListBox&&void 0===n.ComboBox&&void 0===n.EditBox&&void 0===n.Button&&void 0===n.PushButton&&void 0===n.RadioButton&&void 0===n.CheckBox&&void 0===n.TextField&&void 0===n.PasswordField?(n.ChoiceField=q,n.ListBox=T,n.ComboBox=R,n.EditBox=D,n.Button=U,n.PushButton=z,n.RadioButton=H,n.CheckBox=V,n.TextField=G,n.PasswordField=Y,n.AcroForm={Appearance:J}):console.warn("AcroForm-Classes are not populated into global-namespace, because the class-Names exist already."),e.AcroFormChoiceField=q,e.AcroFormListBox=T,e.AcroFormComboBox=R,e.AcroFormEditBox=D,e.AcroFormButton=U,e.AcroFormPushButton=z,e.AcroFormRadioButton=H,e.AcroFormCheckBox=V,e.AcroFormTextField=G,e.AcroFormPasswordField=Y,e.AcroFormAppearance=J,e.AcroForm={ChoiceField:q,ListBox:T,ComboBox:R,EditBox:D,Button:U,PushButton:z,RadioButton:H,CheckBox:V,TextField:G,PasswordField:Y,Appearance:J}}(y.API,"undefined"!=typeof window&&window||"undefined"!=typeof global&&global),function(e){var n={PNG:[[137,80,78,71]],TIFF:[[77,77,0,42],[73,73,42,0]],JPEG:[[255,216,255,224,void 0,void 0,74,70,73,70,0],[255,216,255,225,void 0,void 0,69,120,105,102,0,0]],JPEG2000:[[0,0,0,12,106,80,32,32]],GIF87a:[[71,73,70,56,55,97]],GIF89a:[[71,73,70,56,57,97]],BMP:[[66,77],[66,65],[67,73],[67,80],[73,67],[80,84]]},r=e.getImageFileTypeByImageData=function(t,r){var i,o;r=r||"UNKNOWN";var a,s,l,h="UNKNOWN";for(l in e.isArrayBufferView(t)&&(t=e.arrayBufferToBinaryString(t)),n)for(a=n[l],i=0;i<a.length;i+=1){for(s=!0,o=0;o<a[i].length;o+=1)if(void 0!==a[i][o]&&a[i][o]!==t.charCodeAt(o)){s=!1;break}if(!0===s){h=l;break}}return"UNKNOWN"===h&&"UNKNOWN"!==r&&(console.warn('FileType of Image not recognized. Processing image as "'+r+'".'),h=r),h},i=function t(e){for(var n=this.internal.newObject(),r=this.internal.write,i=this.internal.putStream,o=(0,this.internal.getFilters)();-1!==o.indexOf("FlateEncode");)o.splice(o.indexOf("FlateEncode"),1);e.n=n;var a=[];if(a.push({key:"Type",value:"/XObject"}),a.push({key:"Subtype",value:"/Image"}),a.push({key:"Width",value:e.w}),a.push({key:"Height",value:e.h}),e.cs===this.color_spaces.INDEXED?a.push({key:"ColorSpace",value:"[/Indexed /DeviceRGB "+(e.pal.length/3-1)+" "+("smask"in e?n+2:n+1)+" 0 R]"}):(a.push({key:"ColorSpace",value:"/"+e.cs}),e.cs===this.color_spaces.DEVICE_CMYK&&a.push({key:"Decode",value:"[1 0 1 0 1 0 1 0]"})),a.push({key:"BitsPerComponent",value:e.bpc}),"dp"in e&&a.push({key:"DecodeParms",value:"<<"+e.dp+">>"}),"trns"in e&&e.trns.constructor==Array){for(var s="",l=0,h=e.trns.length;l<h;l++)s+=e.trns[l]+" "+e.trns[l]+" ";a.push({key:"Mask",value:"["+s+"]"})}"smask"in e&&a.push({key:"SMask",value:n+1+" 0 R"});var u=void 0!==e.f?["/"+e.f]:void 0;if(i({data:e.data,additionalKeyValues:a,alreadyAppliedFilters:u}),r("endobj"),"smask"in e){var c="/Predictor "+e.p+" /Colors 1 /BitsPerComponent "+e.bpc+" /Columns "+e.w,f={w:e.w,h:e.h,cs:"DeviceGray",bpc:e.bpc,dp:c,data:e.smask};"f"in e&&(f.f=e.f),t.call(this,f)}e.cs===this.color_spaces.INDEXED&&(this.internal.newObject(),i({data:this.arrayBufferToBinaryString(new Uint8Array(e.pal))}),r("endobj"))},o=function(){var t=this.internal.collections.addImage_images;for(var e in t)i.call(this,t[e])},a=function(){var t,e=this.internal.collections.addImage_images,n=this.internal.write;for(var r in e)n("/I"+(t=e[r]).i,t.n,"0","R")},s=function(t){return"function"==typeof e["process"+t.toUpperCase()]},l=function(e){return"object"===t(e)&&1===e.nodeType},h=function(t,n){if("IMG"===t.nodeName&&t.hasAttribute("src")){var r=""+t.getAttribute("src");if(0===r.indexOf("data:image/"))return unescape(r);var i=e.loadFile(r);if(void 0!==i)return btoa(i)}if("CANVAS"===t.nodeName){var o=t;return t.toDataURL("image/jpeg",1)}(o=document.createElement("canvas")).width=t.clientWidth||t.width,o.height=t.clientHeight||t.height;var a=o.getContext("2d");if(!a)throw"addImage requires canvas to be supported by browser.";return a.drawImage(t,0,0,o.width,o.height),o.toDataURL("png"==(""+n).toLowerCase()?"image/png":"image/jpeg")},u=function(t,e){var n;if(e)for(var r in e)if(t===e[r].alias){n=e[r];break}return n};e.color_spaces={DEVICE_RGB:"DeviceRGB",DEVICE_GRAY:"DeviceGray",DEVICE_CMYK:"DeviceCMYK",CAL_GREY:"CalGray",CAL_RGB:"CalRGB",LAB:"Lab",ICC_BASED:"ICCBased",INDEXED:"Indexed",PATTERN:"Pattern",SEPARATION:"Separation",DEVICE_N:"DeviceN"},e.decode={DCT_DECODE:"DCTDecode",FLATE_DECODE:"FlateDecode",LZW_DECODE:"LZWDecode",JPX_DECODE:"JPXDecode",JBIG2_DECODE:"JBIG2Decode",ASCII85_DECODE:"ASCII85Decode",ASCII_HEX_DECODE:"ASCIIHexDecode",RUN_LENGTH_DECODE:"RunLengthDecode",CCITT_FAX_DECODE:"CCITTFaxDecode"},e.image_compression={NONE:"NONE",FAST:"FAST",MEDIUM:"MEDIUM",SLOW:"SLOW"},e.sHashCode=function(t){var e,n=0;if(0===(t=t||"").length)return n;for(e=0;e<t.length;e++)n=(n<<5)-n+t.charCodeAt(e),n|=0;return n},e.isString=function(t){return"string"==typeof t},e.validateStringAsBase64=function(t){(t=t||"").toString().trim();var e=!0;return 0===t.length&&(e=!1),t.length%4!=0&&(e=!1),!1===/^[A-Za-z0-9+\/]+$/.test(t.substr(0,t.length-2))&&(e=!1),!1===/^[A-Za-z0-9\/][A-Za-z0-9+\/]|[A-Za-z0-9+\/]=|==$/.test(t.substr(-2))&&(e=!1),e},e.extractInfoFromBase64DataURI=function(t){return/^data:([\w]+?\/([\w]+?));\S*;*base64,(.+)$/g.exec(t)},e.extractImageFromDataUrl=function(t){var e=(t=t||"").split("base64,"),n=null;if(2===e.length){var r=/^data:(\w*\/\w*);*(charset=[\w=-]*)*;*$/.exec(e[0]);Array.isArray(r)&&(n={mimeType:r[1],charset:r[2],data:e[1]})}return n},e.supportsArrayBuffer=function(){return"undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array},e.isArrayBuffer=function(t){return!!this.supportsArrayBuffer()&&t instanceof ArrayBuffer},e.isArrayBufferView=function(t){return!!this.supportsArrayBuffer()&&("undefined"!=typeof Uint32Array&&(t instanceof Int8Array||t instanceof Uint8Array||"undefined"!=typeof Uint8ClampedArray&&t instanceof Uint8ClampedArray||t instanceof Int16Array||t instanceof Uint16Array||t instanceof Int32Array||t instanceof Uint32Array||t instanceof Float32Array||t instanceof Float64Array))},e.binaryStringToUint8Array=function(t){for(var e=t.length,n=new Uint8Array(e),r=0;r<e;r++)n[r]=t.charCodeAt(r);return n},e.arrayBufferToBinaryString=function(t){if("function"==typeof atob)return atob(this.arrayBufferToBase64(t))},e.arrayBufferToBase64=function(t){for(var e,n="",r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=new Uint8Array(t),o=i.byteLength,a=o%3,s=o-a,l=0;l<s;l+=3)n+=r[(16515072&(e=i[l]<<16|i[l+1]<<8|i[l+2]))>>18]+r[(258048&e)>>12]+r[(4032&e)>>6]+r[63&e];return 1==a?n+=r[(252&(e=i[s]))>>2]+r[(3&e)<<4]+"==":2==a&&(n+=r[(64512&(e=i[s]<<8|i[s+1]))>>10]+r[(1008&e)>>4]+r[(15&e)<<2]+"="),n},e.createImageInfo=function(t,e,n,r,i,o,a,s,l,h,u,c,f){var p={alias:s,w:e,h:n,cs:r,bpc:i,i:a,data:t};return o&&(p.f=o),l&&(p.dp=l),h&&(p.trns=h),u&&(p.pal=u),c&&(p.smask=c),f&&(p.p=f),p},e.addImage=function(n,r,i,c,f,p,d,g,m){var y="";if("string"!=typeof r){var v=p;p=f,f=c,c=i,i=r,r=v}if("object"===t(n)&&!l(n)&&"imageData"in n){var w=n;n=w.imageData,r=w.format||r||"UNKNOWN",i=w.x||i||0,c=w.y||c||0,f=w.w||f,p=w.h||p,d=w.alias||d,g=w.compression||g,m=w.rotation||w.angle||m}var b=this.internal.getFilters();if(void 0===g&&-1!==b.indexOf("FlateEncode")&&(g="SLOW"),"string"==typeof n&&(n=unescape(n)),isNaN(i)||isNaN(c))throw console.error("jsPDF.addImage: Invalid coordinates",arguments),new Error("Invalid coordinates passed to jsPDF.addImage");var x,N,L,A=function(){var t=this.internal.collections.addImage_images;return t||(this.internal.collections.addImage_images=t={},this.internal.events.subscribe("putResources",o),this.internal.events.subscribe("putXobjectDict",a)),t}.call(this);if(!((x=u(n,A))||(l(n)&&(n=h(n,r)),(null==(L=d)||0===L.length)&&(d=function(t){return"string"==typeof t?e.sHashCode(t):e.isArrayBufferView(t)?e.sHashCode(e.arrayBufferToBinaryString(t)):null}(n)),x=u(d,A)))){if(this.isString(n)&&(""!==(y=this.convertStringToImageData(n))?n=y:void 0!==(y=e.loadFile(n))&&(n=y)),r=this.getImageFileTypeByImageData(n,r),!s(r))throw new Error("addImage does not support files of type '"+r+"', please ensure that a plugin for '"+r+"' support is added.");if(this.supportsArrayBuffer()&&(n instanceof Uint8Array||(N=n,n=this.binaryStringToUint8Array(n))),!(x=this["process"+r.toUpperCase()](n,function(t){var e=0;return t&&(e=Object.keys?Object.keys(t).length:function(t){var e=0;for(var n in t)t.hasOwnProperty(n)&&e++;return e}(t)),e}(A),d,function(t){return t&&"string"==typeof t&&(t=t.toUpperCase()),t in e.image_compression?t:e.image_compression.NONE}(g),N)))throw new Error("An unknown error occurred whilst processing the image")}return function(t,e,n,r,i,o,a,s){var l=function(t,e,n){return t||e||(t=-96,e=-96),t<0&&(t=-1*n.w*72/t/this.internal.scaleFactor),e<0&&(e=-1*n.h*72/e/this.internal.scaleFactor),0===t&&(t=e*n.w/n.h),0===e&&(e=t*n.h/n.w),[t,e]}.call(this,n,r,i),h=this.internal.getCoordinateString,u=this.internal.getVerticalCoordinateString;if(n=l[0],r=l[1],a[o]=i,s){s*=Math.PI/180;var c=Math.cos(s),f=Math.sin(s),p=function(t){return t.toFixed(4)},d=[p(c),p(f),p(-1*f),p(c),0,0,"cm"]}this.internal.write("q"),s?(this.internal.write([1,"0","0",1,h(t),u(e+r),"cm"].join(" ")),this.internal.write(d.join(" ")),this.internal.write([h(n),"0","0",h(r),"0","0","cm"].join(" "))):this.internal.write([h(n),"0","0",h(r),h(t),u(e+r),"cm"].join(" ")),this.internal.write("/I"+i.i+" Do"),this.internal.write("Q")}.call(this,i,c,f,p,x,x.i,A,m),this},e.convertStringToImageData=function(t){var n,r="";if(this.isString(t)){var i;n=null!==(i=this.extractImageFromDataUrl(t))?i.data:t;try{r=atob(n)}catch(t){throw e.validateStringAsBase64(n)?new Error("atob-Error in jsPDF.convertStringToImageData "+t.message):new Error("Supplied Data is not a valid base64-String jsPDF.convertStringToImageData ")}}return r};var c=function(t,e){return t.subarray(e,e+5)};e.processJPEG=function(t,e,n,i,o,a){var s,l=this.decode.DCT_DECODE;if(!this.isString(t)&&!this.isArrayBuffer(t)&&!this.isArrayBufferView(t))return null;if(this.isString(t)&&(s=function(t){var e;if("JPEG"!==r(t))throw new Error("getJpegSize requires a binary string jpeg file");for(var n=256*t.charCodeAt(4)+t.charCodeAt(5),i=4,o=t.length;i<o;){if(i+=n,255!==t.charCodeAt(i))throw new Error("getJpegSize could not find the size of the image");if(192===t.charCodeAt(i+1)||193===t.charCodeAt(i+1)||194===t.charCodeAt(i+1)||195===t.charCodeAt(i+1)||196===t.charCodeAt(i+1)||197===t.charCodeAt(i+1)||198===t.charCodeAt(i+1)||199===t.charCodeAt(i+1))return e=256*t.charCodeAt(i+5)+t.charCodeAt(i+6),[256*t.charCodeAt(i+7)+t.charCodeAt(i+8),e,t.charCodeAt(i+9)];i+=2,n=256*t.charCodeAt(i)+t.charCodeAt(i+1)}}(t)),this.isArrayBuffer(t)&&(t=new Uint8Array(t)),this.isArrayBufferView(t)&&(s=function(t){if(65496!=(t[0]<<8|t[1]))throw new Error("Supplied data is not a JPEG");for(var e,n=t.length,r=(t[4]<<8)+t[5],i=4;i<n;){if(r=((e=c(t,i+=r))[2]<<8)+e[3],(192===e[1]||194===e[1])&&255===e[0]&&r>7)return{width:((e=c(t,i+5))[2]<<8)+e[3],height:(e[0]<<8)+e[1],numcomponents:e[4]};i+=2}throw new Error("getJpegSizeFromBytes could not find the size of the image")}(t),t=o||this.arrayBufferToBinaryString(t)),void 0===a)switch(s.numcomponents){case 1:a=this.color_spaces.DEVICE_GRAY;break;case 4:a=this.color_spaces.DEVICE_CMYK;break;default:case 3:a=this.color_spaces.DEVICE_RGB}return this.createImageInfo(t,s.width,s.height,a,8,l,e,n)},e.processJPG=function(){return this.processJPEG.apply(this,arguments)},e.getImageProperties=function(t){var n,r,i="";if(l(t)&&(t=h(t)),this.isString(t)&&(""!==(i=this.convertStringToImageData(t))?t=i:void 0!==(i=e.loadFile(t))&&(t=i)),r=this.getImageFileTypeByImageData(t),!s(r))throw new Error("addImage does not support files of type '"+r+"', please ensure that a plugin for '"+r+"' support is added.");if(this.supportsArrayBuffer()&&(t instanceof Uint8Array||(t=this.binaryStringToUint8Array(t))),!(n=this["process"+r.toUpperCase()](t)))throw new Error("An unknown error occurred whilst processing the image");return{fileType:r,width:n.w,height:n.h,colorSpace:n.cs,compressionMode:n.f,bitsPerComponent:n.bpc}}}(y.API),function(t){y.API.events.push(["addPage",function(t){this.internal.getPageInfo(t.pageNumber).pageContext.annotations=[]}]),t.events.push(["putPage",function(t){for(var e=this.internal.getPageInfoByObjId(t.objId),n=t.pageContext.annotations,r=function(t){if(void 0!==t&&""!=t)return!0},i=!1,o=0;o<n.length&&!i;o++){switch((l=n[o]).type){case"link":if(r(l.options.url)||r(l.options.pageNumber)){i=!0;break}case"reference":case"text":case"freetext":i=!0}}if(0!=i){this.internal.write("/Annots [");this.internal.pageSize.height;var a=this.internal.getCoordinateString,s=this.internal.getVerticalCoordinateString;for(o=0;o<n.length;o++){var l;switch((l=n[o]).type){case"reference":this.internal.write(" "+l.object.objId+" 0 R ");break;case"text":var h=this.internal.newAdditionalObject(),u=this.internal.newAdditionalObject(),c=l.title||"Note";m="<</Type /Annot /Subtype /Text "+(p="/Rect ["+a(l.bounds.x)+" "+s(l.bounds.y+l.bounds.h)+" "+a(l.bounds.x+l.bounds.w)+" "+s(l.bounds.y)+"] ")+"/Contents ("+l.contents+")",m+=" /Popup "+u.objId+" 0 R",m+=" /P "+e.objId+" 0 R",m+=" /T ("+c+") >>",h.content=m;var f=h.objId+" 0 R";m="<</Type /Annot /Subtype /Popup "+(p="/Rect ["+a(l.bounds.x+30)+" "+s(l.bounds.y+l.bounds.h)+" "+a(l.bounds.x+l.bounds.w+30)+" "+s(l.bounds.y)+"] ")+" /Parent "+f,l.open&&(m+=" /Open true"),m+=" >>",u.content=m,this.internal.write(h.objId,"0 R",u.objId,"0 R");break;case"freetext":var p="/Rect ["+a(l.bounds.x)+" "+s(l.bounds.y)+" "+a(l.bounds.x+l.bounds.w)+" "+s(l.bounds.y+l.bounds.h)+"] ",d=l.color||"#000000";m="<</Type /Annot /Subtype /FreeText "+p+"/Contents ("+l.contents+")",m+=" /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#"+d+")",m+=" /Border [0 0 0]",m+=" >>",this.internal.write(m);break;case"link":if(l.options.name){var g=this.annotations._nameMap[l.options.name];l.options.pageNumber=g.page,l.options.top=g.y}else l.options.top||(l.options.top=0);p="/Rect ["+a(l.x)+" "+s(l.y)+" "+a(l.x+l.w)+" "+s(l.y+l.h)+"] ";var m="";if(l.options.url)m="<</Type /Annot /Subtype /Link "+p+"/Border [0 0 0] /A <</S /URI /URI ("+l.options.url+") >>";else if(l.options.pageNumber){switch(m="<</Type /Annot /Subtype /Link "+p+"/Border [0 0 0] /Dest ["+this.internal.getPageInfo(l.options.pageNumber).objId+" 0 R",l.options.magFactor=l.options.magFactor||"XYZ",l.options.magFactor){case"Fit":m+=" /Fit]";break;case"FitH":m+=" /FitH "+l.options.top+"]";break;case"FitV":l.options.left=l.options.left||0,m+=" /FitV "+l.options.left+"]";break;case"XYZ":default:var y=s(l.options.top);l.options.left=l.options.left||0,void 0===l.options.zoom&&(l.options.zoom=0),m+=" /XYZ "+l.options.left+" "+y+" "+l.options.zoom+"]"}}""!=m&&(m+=" >>",this.internal.write(m))}}this.internal.write("]")}}]),t.createAnnotation=function(t){var e=this.internal.getCurrentPageInfo();switch(t.type){case"link":this.link(t.bounds.x,t.bounds.y,t.bounds.w,t.bounds.h,t);break;case"text":case"freetext":e.pageContext.annotations.push(t)}},t.link=function(t,e,n,r,i){this.internal.getCurrentPageInfo().pageContext.annotations.push({x:t,y:e,w:n,h:r,options:i,type:"link"})},t.textWithLink=function(t,e,n,r){var i=this.getTextWidth(t),o=this.internal.getLineHeight()/this.internal.scaleFactor;return this.text(t,e,n),n+=.2*o,this.link(e,n-o,i,o,r),i},t.getTextWidth=function(t){var e=this.internal.getFontSize();return this.getStringUnitWidth(t)*e/this.internal.scaleFactor}}(y.API),function(t){var e={1569:[65152],1570:[65153,65154],1571:[65155,65156],1572:[65157,65158],1573:[65159,65160],1574:[65161,65162,65163,65164],1575:[65165,65166],1576:[65167,65168,65169,65170],1577:[65171,65172],1578:[65173,65174,65175,65176],1579:[65177,65178,65179,65180],1580:[65181,65182,65183,65184],1581:[65185,65186,65187,65188],1582:[65189,65190,65191,65192],1583:[65193,65194],1584:[65195,65196],1585:[65197,65198],1586:[65199,65200],1587:[65201,65202,65203,65204],1588:[65205,65206,65207,65208],1589:[65209,65210,65211,65212],1590:[65213,65214,65215,65216],1591:[65217,65218,65219,65220],1592:[65221,65222,65223,65224],1593:[65225,65226,65227,65228],1594:[65229,65230,65231,65232],1601:[65233,65234,65235,65236],1602:[65237,65238,65239,65240],1603:[65241,65242,65243,65244],1604:[65245,65246,65247,65248],1605:[65249,65250,65251,65252],1606:[65253,65254,65255,65256],1607:[65257,65258,65259,65260],1608:[65261,65262],1609:[65263,65264,64488,64489],1610:[65265,65266,65267,65268],1649:[64336,64337],1655:[64477],1657:[64358,64359,64360,64361],1658:[64350,64351,64352,64353],1659:[64338,64339,64340,64341],1662:[64342,64343,64344,64345],1663:[64354,64355,64356,64357],1664:[64346,64347,64348,64349],1667:[64374,64375,64376,64377],1668:[64370,64371,64372,64373],1670:[64378,64379,64380,64381],1671:[64382,64383,64384,64385],1672:[64392,64393],1676:[64388,64389],1677:[64386,64387],1678:[64390,64391],1681:[64396,64397],1688:[64394,64395],1700:[64362,64363,64364,64365],1702:[64366,64367,64368,64369],1705:[64398,64399,64400,64401],1709:[64467,64468,64469,64470],1711:[64402,64403,64404,64405],1713:[64410,64411,64412,64413],1715:[64406,64407,64408,64409],1722:[64414,64415],1723:[64416,64417,64418,64419],1726:[64426,64427,64428,64429],1728:[64420,64421],1729:[64422,64423,64424,64425],1733:[64480,64481],1734:[64473,64474],1735:[64471,64472],1736:[64475,64476],1737:[64482,64483],1739:[64478,64479],1740:[64508,64509,64510,64511],1744:[64484,64485,64486,64487],1746:[64430,64431],1747:[64432,64433]},n={65247:{65154:65269,65156:65271,65160:65273,65166:65275},65248:{65154:65270,65156:65272,65160:65274,65166:65276},65165:{65247:{65248:{65258:65010}}},1617:{1612:64606,1613:64607,1614:64608,1615:64609,1616:64610}},r={1612:64606,1613:64607,1614:64608,1615:64609,1616:64610},i=[1570,1571,1573,1575];t.__arabicParser__={};var o=t.__arabicParser__.isInArabicSubstitutionA=function(t){return void 0!==e[t.charCodeAt(0)]},a=t.__arabicParser__.isArabicLetter=function(t){return"string"==typeof t&&/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/.test(t)},s=t.__arabicParser__.isArabicEndLetter=function(t){return a(t)&&o(t)&&e[t.charCodeAt(0)].length<=2},l=t.__arabicParser__.isArabicAlfLetter=function(t){return a(t)&&i.indexOf(t.charCodeAt(0))>=0},h=(t.__arabicParser__.arabicLetterHasIsolatedForm=function(t){return a(t)&&o(t)&&e[t.charCodeAt(0)].length>=1},t.__arabicParser__.arabicLetterHasFinalForm=function(t){return a(t)&&o(t)&&e[t.charCodeAt(0)].length>=2}),u=(t.__arabicParser__.arabicLetterHasInitialForm=function(t){return a(t)&&o(t)&&e[t.charCodeAt(0)].length>=3},t.__arabicParser__.arabicLetterHasMedialForm=function(t){return a(t)&&o(t)&&4==e[t.charCodeAt(0)].length}),c=t.__arabicParser__.resolveLigatures=function(t){var e=0,r=n,i=0,o="",a=0;for(e=0;e<t.length;e+=1)void 0!==r[t.charCodeAt(e)]?(a++,"number"==typeof(r=r[t.charCodeAt(e)])&&(i=-1!==(i=f(t.charAt(e),t.charAt(e-a),t.charAt(e+1)))?i:0,o+=String.fromCharCode(r),r=n,a=0),e===t.length-1&&(r=n,o+=t.charAt(e-(a-1)),e-=a-1,a=0)):(r=n,o+=t.charAt(e-a),e-=a,a=0);return o},f=(t.__arabicParser__.isArabicDiacritic=function(t){return void 0!==t&&void 0!==r[t.charCodeAt(0)]},t.__arabicParser__.getCorrectForm=function(t,e,n){return a(t)?!1===o(t)?-1:!h(t)||!a(e)&&!a(n)||!a(n)&&s(e)||s(t)&&!a(e)||s(t)&&l(e)||s(t)&&s(e)?0:u(t)&&a(e)&&!s(e)&&a(n)&&h(n)?3:s(t)||!a(n)?1:2:-1}),p=t.__arabicParser__.processArabic=t.processArabic=function(t){var n=0,r=0,i=0,o="",s="",l="",h=(t=t||"").split("\\s+"),u=[];for(n=0;n<h.length;n+=1){for(u.push(""),r=0;r<h[n].length;r+=1)o=h[n][r],s=h[n][r-1],l=h[n][r+1],a(o)?(i=f(o,s,l),u[n]+=-1!==i?String.fromCharCode(e[o.charCodeAt(0)][i]):o):u[n]+=o;u[n]=c(u[n])}return u.join(" ")};t.events.push(["preProcessText",function(t){var e=t.text,n=(t.x,t.y,t.options||{}),r=(t.mutex,n.lang,[]);if("[object Array]"===Object.prototype.toString.call(e)){var i=0;for(r=[],i=0;i<e.length;i+=1)"[object Array]"===Object.prototype.toString.call(e[i])?r.push([p(e[i][0]),e[i][1],e[i][2]]):r.push([p(e[i])]);t.text=r}else t.text=p(e)}])}(y.API),y.API.autoPrint=function(t){var e;switch((t=t||{}).variant=t.variant||"non-conform",t.variant){case"javascript":this.addJS("print({});");break;case"non-conform":default:this.internal.events.subscribe("postPutResources",function(){e=this.internal.newObject(),this.internal.out("<<"),this.internal.out("/S /Named"),this.internal.out("/Type /Action"),this.internal.out("/N /Print"),this.internal.out(">>"),this.internal.out("endobj")}),this.internal.events.subscribe("putCatalog",function(){this.internal.out("/OpenAction "+e+" 0 R")})}return this},function(t){var e=function(){var t=void 0;Object.defineProperty(this,"pdf",{get:function(){return t},set:function(e){t=e}});var e=150;Object.defineProperty(this,"width",{get:function(){return e},set:function(t){e=isNaN(t)||!1===Number.isInteger(t)||t<0?150:t,this.getContext("2d").pageWrapXEnabled&&(this.getContext("2d").pageWrapX=e+1)}});var n=300;Object.defineProperty(this,"height",{get:function(){return n},set:function(t){n=isNaN(t)||!1===Number.isInteger(t)||t<0?300:t,this.getContext("2d").pageWrapYEnabled&&(this.getContext("2d").pageWrapY=n+1)}});var r=[];Object.defineProperty(this,"childNodes",{get:function(){return r},set:function(t){r=t}});var i={};Object.defineProperty(this,"style",{get:function(){return i},set:function(t){i=t}}),Object.defineProperty(this,"parentNode",{get:function(){return!1}})};e.prototype.getContext=function(t,e){var n;if("2d"!==(t=t||"2d"))return null;for(n in e)this.pdf.context2d.hasOwnProperty(n)&&(this.pdf.context2d[n]=e[n]);return this.pdf.context2d._canvas=this,this.pdf.context2d},e.prototype.toDataURL=function(){throw new Error("toDataURL is not implemented.")},t.events.push(["initialized",function(){this.canvas=new e,this.canvas.pdf=this}])}(y.API),e=y.API,r={x:void 0,y:void 0,w:void 0,h:void 0,ln:void 0},i=1,o=function(t,e,n,i,o){r={x:t,y:e,w:n,h:i,ln:o}},a=function(){return r},s={left:0,top:0,bottom:0},e.setHeaderFunction=function(t){n=t},e.getTextDimensions=function(t,e){var n=this.table_font_size||this.internal.getFontSize(),r=(this.internal.getFont().fontStyle,(e=e||{}).scaleFactor||this.internal.scaleFactor),i=0,o=0,a=0;if("string"==typeof t)0!=(i=this.getStringUnitWidth(t)*n)&&(o=1);else{if("[object Array]"!==Object.prototype.toString.call(t))throw new Error("getTextDimensions expects text-parameter to be of type String or an Array of Strings.");for(var s=0;s<t.length;s++)i<(a=this.getStringUnitWidth(t[s])*n)&&(i=a);0!==i&&(o=t.length)}return{w:i/=r,h:Math.max((o*n*this.getLineHeightFactor()-n*(this.getLineHeightFactor()-1))/r,0)}},e.cellAddPage=function(){var t=this.margins||s;this.addPage(),o(t.left,t.top,void 0,void 0),i+=1},e.cellInitialize=function(){r={x:void 0,y:void 0,w:void 0,h:void 0,ln:void 0},i=1},e.cell=function(t,e,n,r,i,l,h){var u=a(),c=!1;if(void 0!==u.ln)if(u.ln===l)t=u.x+u.w,e=u.y;else{var f=this.margins||s;u.y+u.h+r+13>=this.internal.pageSize.getHeight()-f.bottom&&(this.cellAddPage(),c=!0,this.printHeaders&&this.tableHeaderRow&&this.printHeaderRow(l,!0)),e=a().y+a().h,c&&(e=23)}if(void 0!==i[0])if(this.printingHeaderRow?this.rect(t,e,n,r,"FD"):this.rect(t,e,n,r),"right"===h){i instanceof Array||(i=[i]);for(var p=0;p<i.length;p++){var d=i[p],g=this.getStringUnitWidth(d)*this.internal.getFontSize()/this.internal.scaleFactor;this.text(d,t+n-g-3,e+this.internal.getLineHeight()*(p+1))}}else this.text(i,t+3,e+this.internal.getLineHeight());return o(t,e,n,r,l),this},e.arrayMax=function(t,e){var n,r,i,o=t[0];for(n=0,r=t.length;n<r;n+=1)i=t[n],e?-1===e(o,i)&&(o=i):i>o&&(o=i);return o},e.table=function(t,n,o,a,l){if(!o)throw"No data for PDF table";var h,u,c,f,p,d,g,m,y,v,w=[],b=[],x={},N={},L=[],A=[],S=!1,_=!0,F=12,P=s;if(P.width=this.internal.pageSize.getWidth(),l&&(!0===l.autoSize&&(S=!0),!1===l.printHeaders&&(_=!1),l.fontSize&&(F=l.fontSize),l.css&&void 0!==l.css["font-size"]&&(F=16*l.css["font-size"]),l.margins&&(P=l.margins)),this.lnMod=0,r={x:void 0,y:void 0,w:void 0,h:void 0,ln:void 0},i=1,this.printHeaders=_,this.margins=P,this.setFontSize(F),this.table_font_size=F,null==a)w=Object.keys(o[0]);else if(a[0]&&"string"!=typeof a[0])for(u=0,c=a.length;u<c;u+=1)h=a[u],w.push(h.name),b.push(h.prompt),N[h.name]=h.width*(19.049976/25.4);else w=a;if(S)for(v=function(t){return t[h]},u=0,c=w.length;u<c;u+=1){for(x[h=w[u]]=o.map(v),L.push(this.getTextDimensions(b[u]||h,{scaleFactor:1}).w),g=0,f=(d=x[h]).length;g<f;g+=1)p=d[g],L.push(this.getTextDimensions(p,{scaleFactor:1}).w);N[h]=e.arrayMax(L),L=[]}if(_){var k=this.calculateLineHeight(w,N,b.length?b:w);for(u=0,c=w.length;u<c;u+=1)h=w[u],A.push([t,n,N[h],k,String(b.length?b[u]:h)]);this.setTableHeaderRow(A),this.printHeaderRow(1,!1)}for(u=0,c=o.length;u<c;u+=1)for(m=o[u],k=this.calculateLineHeight(w,N,m),g=0,y=w.length;g<y;g+=1)h=w[g],this.cell(t,n,N[h],k,m[h],u+2,h.align);return this.lastCellPos=r,this.table_x=t,this.table_y=n,this},e.calculateLineHeight=function(t,e,n){for(var r,i=0,o=0;o<t.length;o++){n[r=t[o]]=this.splitTextToSize(String(n[r]),e[r]-3);var a=this.internal.getLineHeight()*n[r].length+3;a>i&&(i=a)}return i},e.setTableHeaderRow=function(t){this.tableHeaderRow=t},e.printHeaderRow=function(t,e){if(!this.tableHeaderRow)throw"Property tableHeaderRow does not exist.";var r,a,s,l;if(this.printingHeaderRow=!0,void 0!==n){var h=n(this,i);o(h[0],h[1],h[2],h[3],-1)}this.setFontStyle("bold");var u=[];for(s=0,l=this.tableHeaderRow.length;s<l;s+=1)this.setFillColor(200,200,200),r=this.tableHeaderRow[s],e&&(this.margins.top=13,r[1]=this.margins&&this.margins.top||0,u.push(r)),a=[].concat(r),this.cell.apply(this,a.concat(t));u.length>0&&this.setTableHeaderRow(u),this.setFontStyle("normal"),this.printingHeaderRow=!1},function(e,n){var r,i,o,a,s,l=function(t){return t=t||{},this.isStrokeTransparent=t.isStrokeTransparent||!1,this.strokeOpacity=t.strokeOpacity||1,this.strokeStyle=t.strokeStyle||"#000000",this.fillStyle=t.fillStyle||"#000000",this.isFillTransparent=t.isFillTransparent||!1,this.fillOpacity=t.fillOpacity||1,this.font=t.font||"10px sans-serif",this.textBaseline=t.textBaseline||"alphabetic",this.textAlign=t.textAlign||"left",this.lineWidth=t.lineWidth||1,this.lineJoin=t.lineJoin||"miter",this.lineCap=t.lineCap||"butt",this.path=t.path||[],this.transform=void 0!==t.transform?t.transform.clone():new M,this.globalCompositeOperation=t.globalCompositeOperation||"normal",this.globalAlpha=t.globalAlpha||1,this.clip_path=t.clip_path||[],this.currentPoint=t.currentPoint||new j,this.miterLimit=t.miterLimit||10,this.lastPoint=t.lastPoint||new j,this.ignoreClearRect="boolean"!=typeof t.ignoreClearRect||t.ignoreClearRect,this};e.events.push(["initialized",function(){this.context2d=new h(this),r=this.internal.f2,this.internal.f3,i=this.internal.getCoordinateString,o=this.internal.getVerticalCoordinateString,a=this.internal.getHorizontalCoordinate,s=this.internal.getVerticalCoordinate}]);var h=function(t){Object.defineProperty(this,"canvas",{get:function(){return{parentNode:!1,style:!1}}}),Object.defineProperty(this,"pdf",{get:function(){return t}});var e=!1;Object.defineProperty(this,"pageWrapXEnabled",{get:function(){return e},set:function(t){e=Boolean(t)}});var n=!1;Object.defineProperty(this,"pageWrapYEnabled",{get:function(){return n},set:function(t){n=Boolean(t)}});var r=0;Object.defineProperty(this,"posX",{get:function(){return r},set:function(t){isNaN(t)||(r=t)}});var i=0;Object.defineProperty(this,"posY",{get:function(){return i},set:function(t){isNaN(t)||(i=t)}});var o=!1;Object.defineProperty(this,"autoPaging",{get:function(){return o},set:function(t){o=Boolean(t)}});var a=0;Object.defineProperty(this,"lastBreak",{get:function(){return a},set:function(t){a=t}});var s=[];Object.defineProperty(this,"pageBreaks",{get:function(){return s},set:function(t){s=t}});var h=new l;Object.defineProperty(this,"ctx",{get:function(){return h},set:function(t){t instanceof l&&(h=t)}}),Object.defineProperty(this,"path",{get:function(){return h.path},set:function(t){h.path=t}});var c=[];Object.defineProperty(this,"ctxStack",{get:function(){return c},set:function(t){c=t}}),Object.defineProperty(this,"fillStyle",{get:function(){return this.ctx.fillStyle},set:function(t){var e;e=u(t),this.ctx.fillStyle=e.style,this.ctx.isFillTransparent=0===e.a,this.ctx.fillOpacity=e.a,this.pdf.setFillColor(e.r,e.g,e.b,{a:e.a}),this.pdf.setTextColor(e.r,e.g,e.b,{a:e.a})}}),Object.defineProperty(this,"strokeStyle",{get:function(){return this.ctx.strokeStyle},set:function(t){var e=u(t);this.ctx.strokeStyle=e.style,this.ctx.isStrokeTransparent=0===e.a,this.ctx.strokeOpacity=e.a,0===e.a?this.pdf.setDrawColor(255,255,255):(e.a,this.pdf.setDrawColor(e.r,e.g,e.b))}}),Object.defineProperty(this,"lineCap",{get:function(){return this.ctx.lineCap},set:function(t){-1!==["butt","round","square"].indexOf(t)&&(this.ctx.lineCap=t,this.pdf.setLineCap(t))}}),Object.defineProperty(this,"lineWidth",{get:function(){return this.ctx.lineWidth},set:function(t){isNaN(t)||(this.ctx.lineWidth=t,this.pdf.setLineWidth(t))}}),Object.defineProperty(this,"lineJoin",{get:function(){return this.ctx.lineJoin},set:function(t){-1!==["bevel","round","miter"].indexOf(t)&&(this.ctx.lineJoin=t,this.pdf.setLineJoin(t))}}),Object.defineProperty(this,"miterLimit",{get:function(){return this.ctx.miterLimit},set:function(t){isNaN(t)||(this.ctx.miterLimit=t,this.pdf.setMiterLimit(t))}}),Object.defineProperty(this,"textBaseline",{get:function(){return this.ctx.textBaseline},set:function(t){this.ctx.textBaseline=t}}),Object.defineProperty(this,"textAlign",{get:function(){return this.ctx.textAlign},set:function(t){-1!==["right","end","center","left","start"].indexOf(t)&&(this.ctx.textAlign=t)}}),Object.defineProperty(this,"font",{get:function(){return this.ctx.font},set:function(t){var e;if(this.ctx.font=t,null!==(e=/^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-_,\"\'\sa-z]+?)\s*$/i.exec(t))){var n=e[1],r=(e[2],e[3]),i=e[4],o=e[5],a=e[6];i="px"===o?Math.floor(parseFloat(i)):"em"===o?Math.floor(parseFloat(i)*this.pdf.getFontSize()):Math.floor(parseFloat(i)),this.pdf.setFontSize(i);var s="";("bold"===r||parseInt(r,10)>=700||"bold"===n)&&(s="bold"),"italic"===n&&(s+="italic"),0===s.length&&(s="normal");for(var l="",h=a.toLowerCase().replace(/"|'/g,"").split(/\s*,\s*/),u={arial:"Helvetica",verdana:"Helvetica",helvetica:"Helvetica","sans-serif":"Helvetica",fixed:"Courier",monospace:"Courier",terminal:"Courier",courier:"Courier",times:"Times",cursive:"Times",fantasy:"Times",serif:"Times"},c=0;c<h.length;c++){if(void 0!==this.pdf.internal.getFont(h[c],s,{noFallback:!0,disableWarning:!0})){l=h[c];break}if("bolditalic"===s&&void 0!==this.pdf.internal.getFont(h[c],"bold",{noFallback:!0,disableWarning:!0}))l=h[c],s="bold";else if(void 0!==this.pdf.internal.getFont(h[c],"normal",{noFallback:!0,disableWarning:!0})){l=h[c],s="normal";break}}if(""===l)for(c=0;c<h.length;c++)if(u[h[c]]){l=u[h[c]];break}l=""===l?"Times":l,this.pdf.setFont(l,s)}}}),Object.defineProperty(this,"globalCompositeOperation",{get:function(){return this.ctx.globalCompositeOperation},set:function(t){this.ctx.globalCompositeOperation=t}}),Object.defineProperty(this,"globalAlpha",{get:function(){return this.ctx.globalAlpha},set:function(t){this.ctx.globalAlpha=t}}),Object.defineProperty(this,"ignoreClearRect",{get:function(){return this.ctx.ignoreClearRect},set:function(t){this.ctx.ignoreClearRect=Boolean(t)}})};h.prototype.fill=function(){m.call(this,"fill",!1)},h.prototype.stroke=function(){m.call(this,"stroke",!1)},h.prototype.beginPath=function(){this.path=[{type:"begin"}]},h.prototype.moveTo=function(t,e){if(isNaN(t)||isNaN(e))throw console.error("jsPDF.context2d.moveTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.moveTo");var n=this.ctx.transform.applyToPoint(new j(t,e));this.path.push({type:"mt",x:n.x,y:n.y}),this.ctx.lastPoint=new j(t,e)},h.prototype.closePath=function(){var e=new j(0,0),n=0;for(n=this.path.length-1;-1!==n;n--)if("begin"===this.path[n].type&&"object"===t(this.path[n+1])&&"number"==typeof this.path[n+1].x){e=new j(this.path[n+1].x,this.path[n+1].y),this.path.push({type:"lt",x:e.x,y:e.y});break}"object"===t(this.path[n+2])&&"number"==typeof this.path[n+2].x&&this.path.push(JSON.parse(JSON.stringify(this.path[n+2]))),this.path.push({type:"close"}),this.ctx.lastPoint=new j(e.x,e.y)},h.prototype.lineTo=function(t,e){if(isNaN(t)||isNaN(e))throw console.error("jsPDF.context2d.lineTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.lineTo");var n=this.ctx.transform.applyToPoint(new j(t,e));this.path.push({type:"lt",x:n.x,y:n.y}),this.ctx.lastPoint=new j(n.x,n.y)},h.prototype.clip=function(){this.ctx.clip_path=JSON.parse(JSON.stringify(this.path)),m.call(this,null,!0)},h.prototype.quadraticCurveTo=function(t,e,n,r){if(isNaN(n)||isNaN(r)||isNaN(t)||isNaN(e))throw console.error("jsPDF.context2d.quadraticCurveTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.quadraticCurveTo");var i=this.ctx.transform.applyToPoint(new j(n,r)),o=this.ctx.transform.applyToPoint(new j(t,e));this.path.push({type:"qct",x1:o.x,y1:o.y,x:i.x,y:i.y}),this.ctx.lastPoint=new j(i.x,i.y)},h.prototype.bezierCurveTo=function(t,e,n,r,i,o){if(isNaN(i)||isNaN(o)||isNaN(t)||isNaN(e)||isNaN(n)||isNaN(r))throw console.error("jsPDF.context2d.bezierCurveTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo");var a=this.ctx.transform.applyToPoint(new j(i,o)),s=this.ctx.transform.applyToPoint(new j(t,e)),l=this.ctx.transform.applyToPoint(new j(n,r));this.path.push({type:"bct",x1:s.x,y1:s.y,x2:l.x,y2:l.y,x:a.x,y:a.y}),this.ctx.lastPoint=new j(a.x,a.y)},h.prototype.arc=function(t,e,n,r,i,o){if(isNaN(t)||isNaN(e)||isNaN(n)||isNaN(r)||isNaN(i))throw console.error("jsPDF.context2d.arc: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.arc");if(o=Boolean(o),!this.ctx.transform.isIdentity){var a=this.ctx.transform.applyToPoint(new j(t,e));t=a.x,e=a.y;var s=this.ctx.transform.applyToPoint(new j(0,n)),l=this.ctx.transform.applyToPoint(new j(0,0));n=Math.sqrt(Math.pow(s.x-l.x,2)+Math.pow(s.y-l.y,2))}Math.abs(i-r)>=2*Math.PI&&(r=0,i=2*Math.PI),this.path.push({type:"arc",x:t,y:e,radius:n,startAngle:r,endAngle:i,counterclockwise:o})},h.prototype.arcTo=function(t,e,n,r,i){throw new Error("arcTo not implemented.")},h.prototype.rect=function(t,e,n,r){if(isNaN(t)||isNaN(e)||isNaN(n)||isNaN(r))throw console.error("jsPDF.context2d.rect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.rect");this.moveTo(t,e),this.lineTo(t+n,e),this.lineTo(t+n,e+r),this.lineTo(t,e+r),this.lineTo(t,e),this.lineTo(t+n,e),this.lineTo(t,e)},h.prototype.fillRect=function(t,e,n,r){if(isNaN(t)||isNaN(e)||isNaN(n)||isNaN(r))throw console.error("jsPDF.context2d.fillRect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.fillRect");if(!c.call(this)){var i={};"butt"!==this.lineCap&&(i.lineCap=this.lineCap,this.lineCap="butt"),"miter"!==this.lineJoin&&(i.lineJoin=this.lineJoin,this.lineJoin="miter"),this.beginPath(),this.rect(t,e,n,r),this.fill(),i.hasOwnProperty("lineCap")&&(this.lineCap=i.lineCap),i.hasOwnProperty("lineJoin")&&(this.lineJoin=i.lineJoin)}},h.prototype.strokeRect=function(t,e,n,r){if(isNaN(t)||isNaN(e)||isNaN(n)||isNaN(r))throw console.error("jsPDF.context2d.strokeRect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.strokeRect");f.call(this)||(this.beginPath(),this.rect(t,e,n,r),this.stroke())},h.prototype.clearRect=function(t,e,n,r){if(isNaN(t)||isNaN(e)||isNaN(n)||isNaN(r))throw console.error("jsPDF.context2d.clearRect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.clearRect");this.ignoreClearRect||(this.fillStyle="#ffffff",this.fillRect(t,e,n,r))},h.prototype.save=function(t){t="boolean"!=typeof t||t;for(var e=this.pdf.internal.getCurrentPageInfo().pageNumber,n=0;n<this.pdf.internal.getNumberOfPages();n++)this.pdf.setPage(n+1),this.pdf.internal.out("q");if(this.pdf.setPage(e),t){this.ctx.fontSize=this.pdf.internal.getFontSize();var r=new l(this.ctx);this.ctxStack.push(this.ctx),this.ctx=r}},h.prototype.restore=function(t){t="boolean"!=typeof t||t;for(var e=this.pdf.internal.getCurrentPageInfo().pageNumber,n=0;n<this.pdf.internal.getNumberOfPages();n++)this.pdf.setPage(n+1),this.pdf.internal.out("Q");this.pdf.setPage(e),t&&0!==this.ctxStack.length&&(this.ctx=this.ctxStack.pop(),this.fillStyle=this.ctx.fillStyle,this.strokeStyle=this.ctx.strokeStyle,this.font=this.ctx.font,this.lineCap=this.ctx.lineCap,this.lineWidth=this.ctx.lineWidth,this.lineJoin=this.ctx.lineJoin)},h.prototype.toDataURL=function(){throw new Error("toDataUrl not implemented.")};var u=function(t){var e,n,r,i;if(!0===t.isCanvasGradient&&(t=t.getColor()),!t)return{r:0,g:0,b:0,a:0,style:t};if(/transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/.test(t))e=0,n=0,r=0,i=0;else{var o=/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(t);if(null!==o)e=parseInt(o[1]),n=parseInt(o[2]),r=parseInt(o[3]),i=1;else if(null!==(o=/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/.exec(t)))e=parseInt(o[1]),n=parseInt(o[2]),r=parseInt(o[3]),i=parseFloat(o[4]);else{if(i=1,"string"==typeof t&&"#"!==t.charAt(0)){var a=new RGBColor(t);t=a.ok?a.toHex():"#000000"}4===t.length?(e=t.substring(1,2),e+=e,n=t.substring(2,3),n+=n,r=t.substring(3,4),r+=r):(e=t.substring(1,3),n=t.substring(3,5),r=t.substring(5,7)),e=parseInt(e,16),n=parseInt(n,16),r=parseInt(r,16)}}return{r:e,g:n,b:r,a:i,style:t}},c=function(){return this.ctx.isFillTransparent||0==this.globalAlpha},f=function(){return Boolean(this.ctx.isStrokeTransparent||0==this.globalAlpha)};h.prototype.fillText=function(t,e,n,r){if(isNaN(e)||isNaN(n)||"string"!=typeof t)throw console.error("jsPDF.context2d.fillText: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.fillText");if(r=isNaN(r)?void 0:r,!c.call(this)){n=v.call(this,n);var i=k(this.ctx.transform.rotation),o=this.ctx.transform.scaleX;L.call(this,{text:t,x:e,y:n,scale:o,angle:i,align:this.textAlign,maxWidth:r})}},h.prototype.strokeText=function(t,e,n,r){if(isNaN(e)||isNaN(n)||"string"!=typeof t)throw console.error("jsPDF.context2d.strokeText: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.strokeText");if(!f.call(this)){r=isNaN(r)?void 0:r,n=v.call(this,n);var i=k(this.ctx.transform.rotation),o=this.ctx.transform.scaleX;L.call(this,{text:t,x:e,y:n,scale:o,renderingMode:"stroke",angle:i,align:this.textAlign,maxWidth:r})}},h.prototype.measureText=function(t){if("string"!=typeof t)throw console.error("jsPDF.context2d.measureText: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.measureText");var e=this.pdf,n=this.pdf.internal.scaleFactor,r=e.internal.getFontSize(),i=e.getStringUnitWidth(t)*r/e.internal.scaleFactor;return new function(t){var e=(t=t||{}).width||0;return Object.defineProperty(this,"width",{get:function(){return e}}),this}({width:i*=Math.round(96*n/72*1e4)/1e4})},h.prototype.scale=function(t,e){if(isNaN(t)||isNaN(e))throw console.error("jsPDF.context2d.scale: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.scale");var n=new M(t,0,0,e,0,0);this.ctx.transform=this.ctx.transform.multiply(n)},h.prototype.rotate=function(t){if(isNaN(t))throw console.error("jsPDF.context2d.rotate: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.rotate");var e=new M(Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t),0,0);this.ctx.transform=this.ctx.transform.multiply(e)},h.prototype.translate=function(t,e){if(isNaN(t)||isNaN(e))throw console.error("jsPDF.context2d.translate: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.translate");var n=new M(1,0,0,1,t,e);this.ctx.transform=this.ctx.transform.multiply(n)},h.prototype.transform=function(t,e,n,r,i,o){if(isNaN(t)||isNaN(e)||isNaN(n)||isNaN(r)||isNaN(i)||isNaN(o))throw console.error("jsPDF.context2d.transform: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.transform");var a=new M(t,e,n,r,i,o);this.ctx.transform=this.ctx.transform.multiply(a)},h.prototype.setTransform=function(t,e,n,r,i,o){t=isNaN(t)?1:t,e=isNaN(e)?0:e,n=isNaN(n)?0:n,r=isNaN(r)?1:r,i=isNaN(i)?0:i,o=isNaN(o)?0:o,this.ctx.transform=new M(t,e,n,r,i,o)},h.prototype.drawImage=function(t,e,n,r,i,o,a,s,l){var h=this.pdf.getImageProperties(t),u=1,c=1,f=1,d=1;void 0!==r&&void 0!==s&&(f=s/r,d=l/i,u=h.width/r*s/r,c=h.height/i*l/i),void 0===o&&(o=e,a=n,e=0,n=0),void 0!==r&&void 0===s&&(s=r,l=i),void 0===r&&void 0===s&&(s=h.width,l=h.height);var m=this.ctx.transform.decompose(),v=k(m.rotate.shx);m.scale.sx,m.scale.sy;for(var w,b=new M,x=((b=(b=(b=b.multiply(m.translate)).multiply(m.skew)).multiply(m.scale)).applyToPoint(new j(s,l)),b.applyToRectangle(new E(o-e*f,a-n*d,r*u,i*c))),N=p.call(this,x),L=[],A=0;A<N.length;A+=1)-1===L.indexOf(N[A])&&L.push(N[A]);if(L.sort(),this.autoPaging)for(var S=L[0],_=L[L.length-1],F=S;F<_+1;F++){if(this.pdf.setPage(F),0!==this.ctx.clip_path.length){var P=this.path;w=JSON.parse(JSON.stringify(this.ctx.clip_path)),this.path=g(w,this.posX,-1*this.pdf.internal.pageSize.height*(F-1)+this.posY),y.call(this,"fill",!0),this.path=P}var I=JSON.parse(JSON.stringify(x));I=g([I],this.posX,-1*this.pdf.internal.pageSize.height*(F-1)+this.posY)[0],this.pdf.addImage(t,"jpg",I.x,I.y,I.w,I.h,null,null,v)}else this.pdf.addImage(t,"jpg",x.x,x.y,x.w,x.h,null,null,v)};var p=function(t,e,n){var r=[];switch(e=e||this.pdf.internal.pageSize.width,n=n||this.pdf.internal.pageSize.height,t.type){default:case"mt":case"lt":r.push(Math.floor((t.y+this.posY)/n)+1);break;case"arc":r.push(Math.floor((t.y+this.posY-t.radius)/n)+1),r.push(Math.floor((t.y+this.posY+t.radius)/n)+1);break;case"qct":var i=C(this.ctx.lastPoint.x,this.ctx.lastPoint.y,t.x1,t.y1,t.x,t.y);r.push(Math.floor(i.y/n)+1),r.push(Math.floor((i.y+i.h)/n)+1);break;case"bct":var o=B(this.ctx.lastPoint.x,this.ctx.lastPoint.y,t.x1,t.y1,t.x2,t.y2,t.x,t.y);r.push(Math.floor(o.y/n)+1),r.push(Math.floor((o.y+o.h)/n)+1);break;case"rect":r.push(Math.floor((t.y+this.posY)/n)+1),r.push(Math.floor((t.y+t.h+this.posY)/n)+1)}for(var a=0;a<r.length;a+=1)for(;this.pdf.internal.getNumberOfPages()<r[a];)d.call(this);return r},d=function(){var t=this.fillStyle,e=this.strokeStyle,n=this.font,r=this.lineCap,i=this.lineWidth,o=this.lineJoin;this.pdf.addPage(),this.fillStyle=t,this.strokeStyle=e,this.font=n,this.lineCap=r,this.lineWidth=i,this.lineJoin=o},g=function(t,e,n){for(var r=0;r<t.length;r++)switch(t[r].type){case"bct":t[r].x2+=e,t[r].y2+=n;case"qct":t[r].x1+=e,t[r].y1+=n;case"mt":case"lt":case"arc":default:t[r].x+=e,t[r].y+=n}return t},m=function(t,e){for(var n,r,i=this.fillStyle,o=this.strokeStyle,a=(this.font,this.lineCap),s=this.lineWidth,l=this.lineJoin,h=JSON.parse(JSON.stringify(this.path)),u=JSON.parse(JSON.stringify(this.path)),c=[],f=0;f<u.length;f++)if(void 0!==u[f].x)for(var m=p.call(this,u[f]),v=0;v<m.length;v+=1)-1===c.indexOf(m[v])&&c.push(m[v]);for(f=0;f<c.length;f++)for(;this.pdf.internal.getNumberOfPages()<c[f];)d.call(this);if(c.sort(),this.autoPaging){var w=c[0],b=c[c.length-1];for(f=w;f<b+1;f++){if(this.pdf.setPage(f),this.fillStyle=i,this.strokeStyle=o,this.lineCap=a,this.lineWidth=s,this.lineJoin=l,0!==this.ctx.clip_path.length){var x=this.path;n=JSON.parse(JSON.stringify(this.ctx.clip_path)),this.path=g(n,this.posX,-1*this.pdf.internal.pageSize.height*(f-1)+this.posY),y.call(this,t,!0),this.path=x}r=JSON.parse(JSON.stringify(h)),this.path=g(r,this.posX,-1*this.pdf.internal.pageSize.height*(f-1)+this.posY),!1!==e&&0!==f||y.call(this,t,e)}}else y.call(this,t,e);this.path=h},y=function(t,e){if(("stroke"!==t||e||!f.call(this))&&("stroke"===t||e||!c.call(this))){var n=[];this.ctx.globalAlpha;this.ctx.fillOpacity<1&&this.ctx.fillOpacity;for(var r,i=this.path,o=0;o<i.length;o++){var a=i[o];switch(a.type){case"begin":n.push({begin:!0});break;case"close":n.push({close:!0});break;case"mt":n.push({start:a,deltas:[],abs:[]});break;case"lt":var s=n.length;if(!isNaN(i[o-1].x)){var l=[a.x-i[o-1].x,a.y-i[o-1].y];if(s>0)for(;s>=0;s--)if(!0!==n[s-1].close&&!0!==n[s-1].begin){n[s-1].deltas.push(l),n[s-1].abs.push(a);break}}break;case"bct":l=[a.x1-i[o-1].x,a.y1-i[o-1].y,a.x2-i[o-1].x,a.y2-i[o-1].y,a.x-i[o-1].x,a.y-i[o-1].y];n[n.length-1].deltas.push(l);break;case"qct":var h=i[o-1].x+2/3*(a.x1-i[o-1].x),u=i[o-1].y+2/3*(a.y1-i[o-1].y),p=a.x+2/3*(a.x1-a.x),d=a.y+2/3*(a.y1-a.y),g=a.x,m=a.y;l=[h-i[o-1].x,u-i[o-1].y,p-i[o-1].x,d-i[o-1].y,g-i[o-1].x,m-i[o-1].y];n[n.length-1].deltas.push(l);break;case"arc":n.push({deltas:[],abs:[],arc:!0}),Array.isArray(n[n.length-1].abs)&&n[n.length-1].abs.push(a)}}r=e?null:"stroke"===t?"stroke":"fill";for(o=0;o<n.length;o++){if(n[o].arc)for(var y=n[o].abs,v=0;v<y.length;v++){var N=y[v];if(void 0!==N.startAngle){var L=k(N.startAngle),_=k(N.endAngle),F=N.x,P=N.y;w.call(this,F,P,N.radius,L,_,N.counterclockwise,r,e)}else A.call(this,N.x,N.y)}if(!n[o].arc&&!0!==n[o].close&&!0!==n[o].begin){F=n[o].start.x,P=n[o].start.y;S.call(this,n[o].deltas,F,P,null,null)}}r&&b.call(this,r),e&&x.call(this)}},v=function(t){var e=this.pdf.internal.getFontSize()/this.pdf.internal.scaleFactor,n=e*(this.pdf.internal.getLineHeightFactor()-1);switch(this.ctx.textBaseline){case"bottom":return t-n;case"top":return t+e-n;case"hanging":return t+e-2*n;case"middle":return t+e/2-n;case"ideographic":return t;case"alphabetic":default:return t}};h.prototype.createLinearGradient=function(){var t=function(){};return t.colorStops=[],t.addColorStop=function(t,e){this.colorStops.push([t,e])},t.getColor=function(){return 0===this.colorStops.length?"#000000":this.colorStops[0][1]},t.isCanvasGradient=!0,t},h.prototype.createPattern=function(){return this.createLinearGradient()},h.prototype.createRadialGradient=function(){return this.createLinearGradient()};var w=function(t,e,n,r,i,o,a,s){this.pdf.internal.scaleFactor;for(var l=I(r),h=I(i),u=F.call(this,n,l,h,o),c=0;c<u.length;c++){var f=u[c];0===c&&N.call(this,f.x1+t,f.y1+e),_.call(this,t,e,f.x2,f.y2,f.x3,f.y3,f.x4,f.y4)}s?x.call(this):b.call(this,a)},b=function(t){switch(t){case"stroke":this.pdf.internal.out("S");break;case"fill":this.pdf.internal.out("f")}},x=function(){this.pdf.clip()},N=function(t,e){this.pdf.internal.out(i(t)+" "+o(e)+" m")},L=function(t){var e;switch(t.align){case"right":case"end":e="right";break;case"center":e="center";break;case"left":case"start":default:e="left"}var n=this.ctx.transform.applyToPoint(new j(t.x,t.y)),r=this.ctx.transform.decompose(),i=new M;i=(i=(i=i.multiply(r.translate)).multiply(r.skew)).multiply(r.scale);for(var o,a=this.pdf.getTextDimensions(t.text),s=this.ctx.transform.applyToRectangle(new E(t.x,t.y,a.w,a.h)),l=i.applyToRectangle(new E(t.x,t.y-a.h,a.w,a.h)),h=p.call(this,l),u=[],c=0;c<h.length;c+=1)-1===u.indexOf(h[c])&&u.push(h[c]);if(u.sort(),!0===this.autoPaging)for(var f=u[0],d=u[u.length-1],m=f;m<d+1;m++){if(this.pdf.setPage(m),0!==this.ctx.clip_path.length){var v=this.path;o=JSON.parse(JSON.stringify(this.ctx.clip_path)),this.path=g(o,this.posX,-1*this.pdf.internal.pageSize.height*(m-1)+this.posY),y.call(this,"fill",!0),this.path=v}var w=JSON.parse(JSON.stringify(s));if(w=g([w],this.posX,-1*this.pdf.internal.pageSize.height*(m-1)+this.posY)[0],t.scale>=.01){var b=this.pdf.internal.getFontSize();this.pdf.setFontSize(b*t.scale)}this.pdf.text(t.text,w.x,w.y,{angle:t.angle,align:e,renderingMode:t.renderingMode,maxWidth:t.maxWidth}),t.scale>=.01&&this.pdf.setFontSize(b)}else{if(t.scale>=.01){b=this.pdf.internal.getFontSize();this.pdf.setFontSize(b*t.scale)}this.pdf.text(t.text,n.x+this.posX,n.y+this.posY,{angle:t.angle,align:e,renderingMode:t.renderingMode,maxWidth:t.maxWidth}),t.scale>=.01&&this.pdf.setFontSize(b)}},A=function(t,e,n,r){n=n||0,r=r||0,this.pdf.internal.out(i(t+n)+" "+o(e+r)+" l")},S=function(t,e,n){return this.pdf.lines(t,e,n,null,null)},_=function(t,e,n,i,o,l,h,u){this.pdf.internal.out([r(a(n+t)),r(s(i+e)),r(a(o+t)),r(s(l+e)),r(a(h+t)),r(s(u+e)),"c"].join(" "))},F=function(t,e,n,r){var i=2*Math.PI,o=e;(o<i||o>i)&&(o%=i);var a=n;(a<i||a>i)&&(a%=i);for(var s=[],l=Math.PI/2,h=r?-1:1,u=e,c=Math.min(i,Math.abs(a-o));c>1e-5;){var f=u+h*Math.min(c,l);s.push(P.call(this,t,u,f)),c-=Math.abs(f-u),u=f}return s},P=function(t,e,n){var r=(n-e)/2,i=t*Math.cos(r),o=t*Math.sin(r),a=i,s=-o,l=a*a+s*s,h=l+a*i+s*o,u=4/3*(Math.sqrt(2*l*h)-h)/(a*o-s*i),c=a-u*s,f=s+u*a,p=c,d=-f,g=r+e,m=Math.cos(g),y=Math.sin(g);return{x1:t*Math.cos(e),y1:t*Math.sin(e),x2:c*m-f*y,y2:c*y+f*m,x3:p*m-d*y,y3:p*y+d*m,x4:t*Math.cos(n),y4:t*Math.sin(n)}},k=function(t){return 180*t/Math.PI},I=function(t){return t*Math.PI/180},C=function(t,e,n,r,i,o){var a=t+.5*(n-t),s=e+.5*(r-e),l=i+.5*(n-i),h=o+.5*(r-o),u=Math.min(t,i,a,l),c=Math.max(t,i,a,l),f=Math.min(e,o,s,h),p=Math.max(e,o,s,h);return new E(u,f,c-u,p-f)},B=function(t,e,n,r,i,o,a,s){for(var l,h,u,c,f,p,d,g,m,y,v,w,b,x=n-t,N=r-e,L=i-n,A=o-r,S=a-i,_=s-o,F=0;F<41;F++)g=(p=(h=t+(l=F/40)*x)+l*((c=n+l*L)-h))+l*(c+l*(i+l*S-c)-p),m=(d=(u=e+l*N)+l*((f=r+l*A)-u))+l*(f+l*(o+l*_-f)-d),0==F?(y=g,v=m,w=g,b=m):(y=Math.min(y,g),v=Math.min(v,m),w=Math.max(w,g),b=Math.max(b,m));return new E(Math.round(y),Math.round(v),Math.round(w-y),Math.round(b-v))},j=function(t,e){var n=t||0;Object.defineProperty(this,"x",{enumerable:!0,get:function(){return n},set:function(t){isNaN(t)||(n=parseFloat(t))}});var r=e||0;Object.defineProperty(this,"y",{enumerable:!0,get:function(){return r},set:function(t){isNaN(t)||(r=parseFloat(t))}});var i="pt";return Object.defineProperty(this,"type",{enumerable:!0,get:function(){return i},set:function(t){i=t.toString()}}),this},E=function(t,e,n,r){j.call(this,t,e),this.type="rect";var i=n||0;Object.defineProperty(this,"w",{enumerable:!0,get:function(){return i},set:function(t){isNaN(t)||(i=parseFloat(t))}});var o=r||0;return Object.defineProperty(this,"h",{enumerable:!0,get:function(){return o},set:function(t){isNaN(t)||(o=parseFloat(t))}}),this},M=function(t,e,n,r,i,o){var a=[];return Object.defineProperty(this,"sx",{get:function(){return a[0]},set:function(t){a[0]=Math.round(1e5*t)/1e5}}),Object.defineProperty(this,"shy",{get:function(){return a[1]},set:function(t){a[1]=Math.round(1e5*t)/1e5}}),Object.defineProperty(this,"shx",{get:function(){return a[2]},set:function(t){a[2]=Math.round(1e5*t)/1e5}}),Object.defineProperty(this,"sy",{get:function(){return a[3]},set:function(t){a[3]=Math.round(1e5*t)/1e5}}),Object.defineProperty(this,"tx",{get:function(){return a[4]},set:function(t){a[4]=Math.round(1e5*t)/1e5}}),Object.defineProperty(this,"ty",{get:function(){return a[5]},set:function(t){a[5]=Math.round(1e5*t)/1e5}}),Object.defineProperty(this,"rotation",{get:function(){return Math.atan2(this.shx,this.sx)}}),Object.defineProperty(this,"scaleX",{get:function(){return this.decompose().scale.sx}}),Object.defineProperty(this,"scaleY",{get:function(){return this.decompose().scale.sy}}),Object.defineProperty(this,"isIdentity",{get:function(){return 1===this.sx&&(0===this.shy&&(0===this.shx&&(1===this.sy&&(0===this.tx&&0===this.ty))))}}),this.sx=isNaN(t)?1:t,this.shy=isNaN(e)?0:e,this.shx=isNaN(n)?0:n,this.sy=isNaN(r)?1:r,this.tx=isNaN(i)?0:i,this.ty=isNaN(o)?0:o,this};M.prototype.multiply=function(t){var e=t.sx*this.sx+t.shy*this.shx,n=t.sx*this.shy+t.shy*this.sy,r=t.shx*this.sx+t.sy*this.shx,i=t.shx*this.shy+t.sy*this.sy,o=t.tx*this.sx+t.ty*this.shx+this.tx,a=t.tx*this.shy+t.ty*this.sy+this.ty;return new M(e,n,r,i,o,a)},M.prototype.decompose=function(){var t=this.sx,e=this.shy,n=this.shx,r=this.sy,i=this.tx,o=this.ty,a=Math.sqrt(t*t+e*e),s=(t/=a)*n+(e/=a)*r;n-=t*s,r-=e*s;var l=Math.sqrt(n*n+r*r);return s/=l,t*(r/=l)<e*(n/=l)&&(t=-t,e=-e,s=-s,a=-a),{scale:new M(a,0,0,l,0,0),translate:new M(1,0,0,1,i,o),rotate:new M(t,e,-e,t,0,0),skew:new M(1,0,s,1,0,0)}},M.prototype.applyToPoint=function(t){var e=t.x*this.sx+t.y*this.shx+this.tx,n=t.x*this.shy+t.y*this.sy+this.ty;return new j(e,n)},M.prototype.applyToRectangle=function(t){var e=this.applyToPoint(t),n=this.applyToPoint(new j(t.x+t.w,t.y+t.h));return new E(e.x,e.y,n.x-e.x,n.y-e.y)},M.prototype.clone=function(){var t=this.sx,e=this.shy,n=this.shx,r=this.sy,i=this.tx,o=this.ty;return new M(t,e,n,r,i,o)}}(y.API,"undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof global&&global||Function('return typeof this === "object" && this.content')()||Function("return this")()),function(t){var e=function(t){var e,n,r,i,o,a,s,l,h,u;for(/[^\x00-\xFF]/.test(t),n=[],r=0,i=(t+=e="\0\0\0\0".slice(t.length%4||4)).length;i>r;r+=4)0!==(o=(t.charCodeAt(r)<<24)+(t.charCodeAt(r+1)<<16)+(t.charCodeAt(r+2)<<8)+t.charCodeAt(r+3))?(a=(o=((o=((o=((o=(o-(u=o%85))/85)-(h=o%85))/85)-(l=o%85))/85)-(s=o%85))/85)%85,n.push(a+33,s+33,l+33,h+33,u+33)):n.push(122);return function(t,e){for(var n=e;n>0;n--)t.pop()}(n,e.length),String.fromCharCode.apply(String,n)+"~>"},n=function(t){var e,n,r,i,o,a=String,s="length",l=255,h="charCodeAt",u="slice",c="replace";for(t[u](-2),t=t[u](0,-2)[c](/\s/g,"")[c]("z","!!!!!"),r=[],i=0,o=(t+=e="uuuuu"[u](t[s]%5||5))[s];o>i;i+=5)n=52200625*(t[h](i)-33)+614125*(t[h](i+1)-33)+7225*(t[h](i+2)-33)+85*(t[h](i+3)-33)+(t[h](i+4)-33),r.push(l&n>>24,l&n>>16,l&n>>8,l&n);return function(t,e){for(var n=e;n>0;n--)t.pop()}(r,e[s]),a.fromCharCode.apply(a,r)},r=function(t){for(var e="",n=0;n<t.length;n+=1)e+=("0"+t.charCodeAt(n).toString(16)).slice(-2);return e+=">"},i=function(t){var e=new RegExp(/^([0-9A-Fa-f]{2})+$/);if(-1!==(t=t.replace(/\s/g,"")).indexOf(">")&&(t=t.substr(0,t.indexOf(">"))),t.length%2&&(t+="0"),!1===e.test(t))return"";for(var n="",r=0;r<t.length;r+=2)n+=String.fromCharCode("0x"+(t[r]+t[r+1]));return n},o=function(e,n){n=Object.assign({predictor:1,colors:1,bitsPerComponent:8,columns:1},n);for(var r,i,o=[],a=e.length;a--;)o[a]=e.charCodeAt(a);return r=t.adler32cs.from(e),(i=new Deflater(6)).append(new Uint8Array(o)),e=i.flush(),(o=new Uint8Array(e.length+6)).set(new Uint8Array([120,156])),o.set(e,2),o.set(new Uint8Array([255&r,r>>8&255,r>>16&255,r>>24&255]),e.length+2),e=String.fromCharCode.apply(null,o)};t.processDataByFilters=function(t,a){var s=0,l=t||"",h=[];for("string"==typeof(a=a||[])&&(a=[a]),s=0;s<a.length;s+=1)switch(a[s]){case"ASCII85Decode":case"/ASCII85Decode":l=n(l),h.push("/ASCII85Encode");break;case"ASCII85Encode":case"/ASCII85Encode":l=e(l),h.push("/ASCII85Decode");break;case"ASCIIHexDecode":case"/ASCIIHexDecode":l=i(l),h.push("/ASCIIHexEncode");break;case"ASCIIHexEncode":case"/ASCIIHexEncode":l=r(l),h.push("/ASCIIHexDecode");break;case"FlateEncode":case"/FlateEncode":l=o(l),h.push("/FlateDecode");break;default:throw'The filter: "'+a[s]+'" is not implemented'}return{data:l,reverseChain:h.reverse().join(" ")}}}(y.API),function(t){t.loadFile=function(t,e,n){var r;e=e||!0,n=n||function(){};try{r=function(t,e,n){var r=new XMLHttpRequest,i=[],o=0,a=function(t){var e=t.length,n=String.fromCharCode;for(o=0;o<e;o+=1)i.push(n(255&t.charCodeAt(o)));return i.join("")};if(r.open("GET",t,!e),r.overrideMimeType("text/plain; charset=x-user-defined"),!1===e&&(r.onload=function(){return a(this.responseText)}),r.send(null),200===r.status)return e?a(r.responseText):void 0;console.warn('Unable to load file "'+t+'"')}(t,e)}catch(t){r=void 0}return r},t.loadImageFile=t.loadFile}(y.API),function(e,n){var r=function(e){var n=t(e);return"undefined"===n?"undefined":"string"===n||e instanceof String?"string":"number"===n||e instanceof Number?"number":"function"===n||e instanceof Function?"function":e&&e.constructor===Array?"array":e&&1===e.nodeType?"element":"object"===n?"object":"unknown"},i=function(t,e){var n=document.createElement(t);if(e.className&&(n.className=e.className),e.innerHTML){n.innerHTML=e.innerHTML;for(var r=n.getElementsByTagName("script"),i=r.length;i-- >0;null)r[i].parentNode.removeChild(r[i])}for(var o in e.style)n.style[o]=e.style[o];return n},o=function t(e){var n=Object.assign(t.convert(Promise.resolve()),JSON.parse(JSON.stringify(t.template))),r=t.convert(Promise.resolve(),n);return r=(r=r.setProgress(1,t,1,[t])).set(e)};(o.prototype=Object.create(Promise.prototype)).constructor=o,o.convert=function(t,e){return t.__proto__=e||o.prototype,t},o.template={prop:{src:null,container:null,overlay:null,canvas:null,img:null,pdf:null,pageSize:null,callback:function(){}},progress:{val:0,state:null,n:0,stack:[]},opt:{filename:"file.pdf",margin:[0,0,0,0],enableLinks:!0,x:0,y:0,html2canvas:{},jsPDF:{}}},o.prototype.from=function(t,e){return this.then(function(){switch(e=e||function(t){switch(r(t)){case"string":return"string";case"element":return"canvas"===t.nodeName.toLowerCase?"canvas":"element";default:return"unknown"}}(t)){case"string":return this.set({src:i("div",{innerHTML:t})});case"element":return this.set({src:t});case"canvas":return this.set({canvas:t});case"img":return this.set({img:t});default:return this.error("Unknown source type.")}})},o.prototype.to=function(t){switch(t){case"container":return this.toContainer();case"canvas":return this.toCanvas();case"img":return this.toImg();case"pdf":return this.toPdf();default:return this.error("Invalid target.")}},o.prototype.toContainer=function(){return this.thenList([function(){return this.prop.src||this.error("Cannot duplicate - no source HTML.")},function(){return this.prop.pageSize||this.setPageSize()}]).then(function(){var t={position:"relative",display:"inline-block",width:Math.max(this.prop.src.clientWidth,this.prop.src.scrollWidth,this.prop.src.offsetWidth)+"px",left:0,right:0,top:0,margin:"auto",backgroundColor:"white"},e=function t(e,n){for(var r=3===e.nodeType?document.createTextNode(e.nodeValue):e.cloneNode(!1),i=e.firstChild;i;i=i.nextSibling)!0!==n&&1===i.nodeType&&"SCRIPT"===i.nodeName||r.appendChild(t(i,n));return 1===e.nodeType&&("CANVAS"===e.nodeName?(r.width=e.width,r.height=e.height,r.getContext("2d").drawImage(e,0,0)):"TEXTAREA"!==e.nodeName&&"SELECT"!==e.nodeName||(r.value=e.value),r.addEventListener("load",function(){r.scrollTop=e.scrollTop,r.scrollLeft=e.scrollLeft},!0)),r}(this.prop.src,this.opt.html2canvas.javascriptEnabled);"BODY"===e.tagName&&(t.height=Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight)+"px"),this.prop.overlay=i("div",{className:"html2pdf__overlay",style:{position:"fixed",overflow:"hidden",zIndex:1e3,left:"-100000px",right:0,bottom:0,top:0}}),this.prop.container=i("div",{className:"html2pdf__container",style:t}),this.prop.container.appendChild(e),this.prop.container.firstChild.appendChild(i("div",{style:{clear:"both",border:"0 none transparent",margin:0,padding:0,height:0}})),this.prop.container.style.float="none",this.prop.overlay.appendChild(this.prop.container),document.body.appendChild(this.prop.overlay),this.prop.container.firstChild.style.position="relative",this.prop.container.height=Math.max(this.prop.container.firstChild.clientHeight,this.prop.container.firstChild.scrollHeight,this.prop.container.firstChild.offsetHeight)+"px"})},o.prototype.toCanvas=function(){var t=[function(){return document.body.contains(this.prop.container)||this.toContainer()}];return this.thenList(t).then(function(){var t=Object.assign({},this.opt.html2canvas);if(delete t.onrendered,this.isHtml2CanvasLoaded())return html2canvas(this.prop.container,t)}).then(function(t){(this.opt.html2canvas.onrendered||function(){})(t),this.prop.canvas=t,document.body.removeChild(this.prop.overlay)})},o.prototype.toContext2d=function(){var t=[function(){return document.body.contains(this.prop.container)||this.toContainer()}];return this.thenList(t).then(function(){var t=this.opt.jsPDF,e=Object.assign({async:!0,allowTaint:!0,backgroundColor:"#ffffff",imageTimeout:15e3,logging:!0,proxy:null,removeContainer:!0,foreignObjectRendering:!1,useCORS:!1},this.opt.html2canvas);if(delete e.onrendered,t.context2d.autoPaging=!0,t.context2d.posX=this.opt.x,t.context2d.posY=this.opt.y,e.windowHeight=e.windowHeight||0,e.windowHeight=0==e.windowHeight?Math.max(this.prop.container.clientHeight,this.prop.container.scrollHeight,this.prop.container.offsetHeight):e.windowHeight,this.isHtml2CanvasLoaded())return html2canvas(this.prop.container,e)}).then(function(t){(this.opt.html2canvas.onrendered||function(){})(t),this.prop.canvas=t,document.body.removeChild(this.prop.overlay)})},o.prototype.toImg=function(){return this.thenList([function(){return this.prop.canvas||this.toCanvas()}]).then(function(){var t=this.prop.canvas.toDataURL("image/"+this.opt.image.type,this.opt.image.quality);this.prop.img=document.createElement("img"),this.prop.img.src=t})},o.prototype.toPdf=function(){return this.thenList([function(){return this.toContext2d()}]).then(function(){this.prop.pdf=this.prop.pdf||this.opt.jsPDF})},o.prototype.output=function(t,e,n){return"img"===(n=n||"pdf").toLowerCase()||"image"===n.toLowerCase()?this.outputImg(t,e):this.outputPdf(t,e)},o.prototype.outputPdf=function(t,e){return this.thenList([function(){return this.prop.pdf||this.toPdf()}]).then(function(){return this.prop.pdf.output(t,e)})},o.prototype.outputImg=function(t,e){return this.thenList([function(){return this.prop.img||this.toImg()}]).then(function(){switch(t){case void 0:case"img":return this.prop.img;case"datauristring":case"dataurlstring":return this.prop.img.src;case"datauri":case"dataurl":return document.location.href=this.prop.img.src;default:throw'Image output type "'+t+'" is not supported.'}})},o.prototype.isHtml2CanvasLoaded=function(){var t=void 0!==n.html2canvas;return t||console.error("html2canvas not loaded."),t},o.prototype.save=function(t){if(this.isHtml2CanvasLoaded())return this.thenList([function(){return this.prop.pdf||this.toPdf()}]).set(t?{filename:t}:null).then(function(){this.prop.pdf.save(this.opt.filename)})},o.prototype.doCallback=function(t){if(this.isHtml2CanvasLoaded())return this.thenList([function(){return this.prop.pdf||this.toPdf()}]).then(function(){this.prop.callback(this.prop.pdf)})},o.prototype.set=function(t){if("object"!==r(t))return this;var e=Object.keys(t||{}).map(function(e){if(e in o.template.prop)return function(){this.prop[e]=t[e]};switch(e){case"margin":return this.setMargin.bind(this,t.margin);case"jsPDF":return function(){return this.opt.jsPDF=t.jsPDF,this.setPageSize()};case"pageSize":return this.setPageSize.bind(this,t.pageSize);default:return function(){this.opt[e]=t[e]}}},this);return this.then(function(){return this.thenList(e)})},o.prototype.get=function(t,e){return this.then(function(){var n=t in o.template.prop?this.prop[t]:this.opt[t];return e?e(n):n})},o.prototype.setMargin=function(t){return this.then(function(){switch(r(t)){case"number":t=[t,t,t,t];case"array":if(2===t.length&&(t=[t[0],t[1],t[0],t[1]]),4===t.length)break;default:return this.error("Invalid margin array.")}this.opt.margin=t}).then(this.setPageSize)},o.prototype.setPageSize=function(t){function e(t,e){return Math.floor(t*e/72*96)}return this.then(function(){(t=t||y.getPageSize(this.opt.jsPDF)).hasOwnProperty("inner")||(t.inner={width:t.width-this.opt.margin[1]-this.opt.margin[3],height:t.height-this.opt.margin[0]-this.opt.margin[2]},t.inner.px={width:e(t.inner.width,t.k),height:e(t.inner.height,t.k)},t.inner.ratio=t.inner.height/t.inner.width),this.prop.pageSize=t})},o.prototype.setProgress=function(t,e,n,r){return null!=t&&(this.progress.val=t),null!=e&&(this.progress.state=e),null!=n&&(this.progress.n=n),null!=r&&(this.progress.stack=r),this.progress.ratio=this.progress.val/this.progress.state,this},o.prototype.updateProgress=function(t,e,n,r){return this.setProgress(t?this.progress.val+t:null,e||null,n?this.progress.n+n:null,r?this.progress.stack.concat(r):null)},o.prototype.then=function(t,e){var n=this;return this.thenCore(t,e,function(t,e){return n.updateProgress(null,null,1,[t]),Promise.prototype.then.call(this,function(e){return n.updateProgress(null,t),e}).then(t,e).then(function(t){return n.updateProgress(1),t})})},o.prototype.thenCore=function(t,e,n){n=n||Promise.prototype.then;t&&(t=t.bind(this)),e&&(e=e.bind(this));var r=-1!==Promise.toString().indexOf("[native code]")&&"Promise"===Promise.name?this:o.convert(Object.assign({},this),Promise.prototype),i=n.call(r,t,e);return o.convert(i,this.__proto__)},o.prototype.thenExternal=function(t,e){return Promise.prototype.then.call(this,t,e)},o.prototype.thenList=function(t){var e=this;return t.forEach(function(t){e=e.thenCore(t)}),e},o.prototype.catch=function(t){t&&(t=t.bind(this));var e=Promise.prototype.catch.call(this,t);return o.convert(e,this)},o.prototype.catchExternal=function(t){return Promise.prototype.catch.call(this,t)},o.prototype.error=function(t){return this.then(function(){throw new Error(t)})},o.prototype.using=o.prototype.set,o.prototype.saveAs=o.prototype.save,o.prototype.export=o.prototype.output,o.prototype.run=o.prototype.then,y.getPageSize=function(e,n,r){if("object"===t(e)){var i=e;e=i.orientation,n=i.unit||n,r=i.format||r}n=n||"mm",r=r||"a4",e=(""+(e||"P")).toLowerCase();var o=(""+r).toLowerCase(),a={a0:[2383.94,3370.39],a1:[1683.78,2383.94],a2:[1190.55,1683.78],a3:[841.89,1190.55],a4:[595.28,841.89],a5:[419.53,595.28],a6:[297.64,419.53],a7:[209.76,297.64],a8:[147.4,209.76],a9:[104.88,147.4],a10:[73.7,104.88],b0:[2834.65,4008.19],b1:[2004.09,2834.65],b2:[1417.32,2004.09],b3:[1000.63,1417.32],b4:[708.66,1000.63],b5:[498.9,708.66],b6:[354.33,498.9],b7:[249.45,354.33],b8:[175.75,249.45],b9:[124.72,175.75],b10:[87.87,124.72],c0:[2599.37,3676.54],c1:[1836.85,2599.37],c2:[1298.27,1836.85],c3:[918.43,1298.27],c4:[649.13,918.43],c5:[459.21,649.13],c6:[323.15,459.21],c7:[229.61,323.15],c8:[161.57,229.61],c9:[113.39,161.57],c10:[79.37,113.39],dl:[311.81,623.62],letter:[612,792],"government-letter":[576,756],legal:[612,1008],"junior-legal":[576,360],ledger:[1224,792],tabloid:[792,1224],"credit-card":[153,243]};switch(n){case"pt":var s=1;break;case"mm":s=72/25.4;break;case"cm":s=72/2.54;break;case"in":s=72;break;case"px":s=.75;break;case"pc":case"em":s=12;break;case"ex":s=6;break;default:throw"Invalid unit: "+n}if(a.hasOwnProperty(o))var l=a[o][1]/s,h=a[o][0]/s;else try{l=r[1],h=r[0]}catch(t){throw new Error("Invalid format: "+r)}if("p"===e||"portrait"===e){if(e="p",h>l){var u=h;h=l,l=u}}else{if("l"!==e&&"landscape"!==e)throw"Invalid orientation: "+e;if(e="l",l>h){u=h;h=l,l=u}}return{width:h,height:l,unit:n,k:s}},e.html=function(t,e){(e=e||{}).callback=e.callback||function(){},e.html2canvas=e.html2canvas||{},e.html2canvas.canvas=e.html2canvas.canvas||this.canvas,e.jsPDF=e.jsPDF||this;e.jsPDF;var n=new o(e);return e.worker?n:n.from(t).doCallback()}}(y.API,"undefined"!=typeof window&&window||"undefined"!=typeof global&&global),y.API.addJS=function(t){return u=t,this.internal.events.subscribe("postPutResources",function(t){l=this.internal.newObject(),this.internal.out("<<"),this.internal.out("/Names [(EmbeddedJS) "+(l+1)+" 0 R]"),this.internal.out(">>"),this.internal.out("endobj"),h=this.internal.newObject(),this.internal.out("<<"),this.internal.out("/S /JavaScript"),this.internal.out("/JS ("+u+")"),this.internal.out(">>"),this.internal.out("endobj")}),this.internal.events.subscribe("putCatalog",function(){void 0!==l&&void 0!==h&&this.internal.out("/Names <</JavaScript "+l+" 0 R>>")}),this},function(t){t.events.push(["postPutResources",function(){var t=this,e=/^(\d+) 0 obj$/;if(this.outline.root.children.length>0)for(var n=t.outline.render().split(/\r\n/),r=0;r<n.length;r++){var i=n[r],o=e.exec(i);if(null!=o){var a=o[1];t.internal.newObjectDeferredBegin(a,!1)}t.internal.write(i)}if(this.outline.createNamedDestinations){var s=this.internal.pages.length,l=[];for(r=0;r<s;r++){var h=t.internal.newObject();l.push(h);var u=t.internal.getPageInfo(r+1);t.internal.write("<< /D["+u.objId+" 0 R /XYZ null null null]>> endobj")}var c=t.internal.newObject();t.internal.write("<< /Names [ ");for(r=0;r<l.length;r++)t.internal.write("(page_"+(r+1)+")"+l[r]+" 0 R");t.internal.write(" ] >>","endobj");t.internal.newObject();t.internal.write("<< /Dests "+c+" 0 R"),t.internal.write(">>","endobj")}}]),t.events.push(["putCatalog",function(){this.outline.root.children.length>0&&(this.internal.write("/Outlines",this.outline.makeRef(this.outline.root)),this.outline.createNamedDestinations&&this.internal.write("/Names "+namesOid+" 0 R"))}]),t.events.push(["initialized",function(){var t=this;t.outline={createNamedDestinations:!1,root:{children:[]}},t.outline.add=function(t,e,n){var r={title:e,options:n,children:[]};return null==t&&(t=this.root),t.children.push(r),r},t.outline.render=function(){return this.ctx={},this.ctx.val="",this.ctx.pdf=t,this.genIds_r(this.root),this.renderRoot(this.root),this.renderItems(this.root),this.ctx.val},t.outline.genIds_r=function(e){e.id=t.internal.newObjectDeferred();for(var n=0;n<e.children.length;n++)this.genIds_r(e.children[n])},t.outline.renderRoot=function(t){this.objStart(t),this.line("/Type /Outlines"),t.children.length>0&&(this.line("/First "+this.makeRef(t.children[0])),this.line("/Last "+this.makeRef(t.children[t.children.length-1]))),this.line("/Count "+this.count_r({count:0},t)),this.objEnd()},t.outline.renderItems=function(e){this.ctx.pdf.internal.getCoordinateString;for(var n=this.ctx.pdf.internal.getVerticalCoordinateString,r=0;r<e.children.length;r++){var i=e.children[r];this.objStart(i),this.line("/Title "+this.makeString(i.title)),this.line("/Parent "+this.makeRef(e)),r>0&&this.line("/Prev "+this.makeRef(e.children[r-1])),r<e.children.length-1&&this.line("/Next "+this.makeRef(e.children[r+1])),i.children.length>0&&(this.line("/First "+this.makeRef(i.children[0])),this.line("/Last "+this.makeRef(i.children[i.children.length-1])));var o=this.count=this.count_r({count:0},i);if(o>0&&this.line("/Count "+o),i.options&&i.options.pageNumber){var a=t.internal.getPageInfo(i.options.pageNumber);this.line("/Dest ["+a.objId+" 0 R /XYZ 0 "+n(0)+" 0]")}this.objEnd()}for(r=0;r<e.children.length;r++){i=e.children[r];this.renderItems(i)}},t.outline.line=function(t){this.ctx.val+=t+"\r\n"},t.outline.makeRef=function(t){return t.id+" 0 R"},t.outline.makeString=function(e){return"("+t.internal.pdfEscape(e)+")"},t.outline.objStart=function(t){this.ctx.val+="\r\n"+t.id+" 0 obj\r\n<<\r\n"},t.outline.objEnd=function(t){this.ctx.val+=">> \r\nendobj\r\n"},t.outline.count_r=function(t,e){for(var n=0;n<e.children.length;n++)t.count++,this.count_r(t,e.children[n]);return t.count}}])}(y.API),function(t){var e=function(){var t="function"==typeof Deflater;if(!t)throw new Error("requires deflate.js for compression");return t},n=function(e,n,a,c){var f=5,p=l;switch(c){case t.image_compression.FAST:f=3,p=s;break;case t.image_compression.MEDIUM:f=6,p=h;break;case t.image_compression.SLOW:f=9,p=u}e=o(e,n,a,p);var d=new Uint8Array(r(f)),g=i(e),m=new Deflater(f),y=m.append(e),v=m.flush(),w=d.length+y.length+v.length,b=new Uint8Array(w+4);return b.set(d),b.set(y,d.length),b.set(v,d.length+y.length),b[w++]=g>>>24&255,b[w++]=g>>>16&255,b[w++]=g>>>8&255,b[w++]=255&g,t.arrayBufferToBinaryString(b)},r=function(t,e){var n=Math.LOG2E*Math.log(32768)-8<<4|8,r=n<<8;return r|=Math.min(3,(e-1&255)>>1)<<6,r|=0,[n,255&(r+=31-r%31)]},i=function(t,e){for(var n,r=1,i=0,o=t.length,a=0;o>0;){o-=n=o>e?e:o;do{i+=r+=t[a++]}while(--n);r%=65521,i%=65521}return(i<<16|r)>>>0},o=function(t,e,n,r){for(var i,o,a,s=t.length/e,l=new Uint8Array(t.length+s),h=f(),u=0;u<s;u++){if(a=u*e,i=t.subarray(a,a+e),r)l.set(r(i,n,o),a+u);else{for(var c=0,d=h.length,g=[];c<d;c++)g[c]=h[c](i,n,o);var m=p(g.concat());l.set(g[m],a+u)}o=i}return l},a=function(t,e,n){var r=Array.apply([],t);return r.unshift(0),r},s=function(t,e,n){var r,i=[],o=0,a=t.length;for(i[0]=1;o<a;o++)r=t[o-e]||0,i[o+1]=t[o]-r+256&255;return i},l=function(t,e,n){var r,i=[],o=0,a=t.length;for(i[0]=2;o<a;o++)r=n&&n[o]||0,i[o+1]=t[o]-r+256&255;return i},h=function(t,e,n){var r,i,o=[],a=0,s=t.length;for(o[0]=3;a<s;a++)r=t[a-e]||0,i=n&&n[a]||0,o[a+1]=t[a]+256-(r+i>>>1)&255;return o},u=function(t,e,n){var r,i,o,a,s=[],l=0,h=t.length;for(s[0]=4;l<h;l++)r=t[l-e]||0,i=n&&n[l]||0,o=n&&n[l-e]||0,a=c(r,i,o),s[l+1]=t[l]-a+256&255;return s},c=function(t,e,n){var r=t+e-n,i=Math.abs(r-t),o=Math.abs(r-e),a=Math.abs(r-n);return i<=o&&i<=a?t:o<=a?e:n},f=function(){return[a,s,l,h,u]},p=function(t){for(var e,n,r,i=0,o=t.length;i<o;)((e=d(t[i].slice(1)))<n||!n)&&(n=e,r=i),i++;return r},d=function(t){for(var e=0,n=t.length,r=0;e<n;)r+=Math.abs(t[e++]);return r};t.processPNG=function(r,i,o,a,s){var l,h,u,c,f,p,d=this.color_spaces.DEVICE_RGB,g=this.decode.FLATE_DECODE,m=8;if(this.isArrayBuffer(r)&&(r=new Uint8Array(r)),this.isArrayBufferView(r)){if("function"!=typeof PNG||"function"!=typeof A)throw new Error("PNG support requires png.js and zlib.js");if(r=(l=new PNG(r)).imgData,m=l.bits,d=l.colorSpace,c=l.colors,-1!==[4,6].indexOf(l.colorType)){if(8===l.bits)for(var y,v=(I=32==l.pixelBitlength?new Uint32Array(l.decodePixels().buffer):16==l.pixelBitlength?new Uint16Array(l.decodePixels().buffer):new Uint8Array(l.decodePixels().buffer)).length,w=new Uint8Array(v*l.colors),b=new Uint8Array(v),x=l.pixelBitlength-l.bits,N=0,L=0;N<v;N++){for(S=I[N],y=0;y<x;)w[L++]=S>>>y&255,y+=l.bits;b[N]=S>>>y&255}if(16===l.bits){v=(I=new Uint32Array(l.decodePixels().buffer)).length,w=new Uint8Array(v*(32/l.pixelBitlength)*l.colors),b=new Uint8Array(v*(32/l.pixelBitlength));for(var S,_=l.colors>1,F=(N=0,L=0,0);N<v;)S=I[N++],w[L++]=S>>>0&255,_&&(w[L++]=S>>>16&255,S=I[N++],w[L++]=S>>>0&255),b[F++]=S>>>16&255;m=8}a!==t.image_compression.NONE&&e()?(r=n(w,l.width*l.colors,l.colors,a),p=n(b,l.width,1,a)):(r=w,p=b,g=null)}if(3===l.colorType&&(d=this.color_spaces.INDEXED,f=l.palette,l.transparency.indexed)){var P=l.transparency.indexed,k=0;for(N=0,v=P.length;N<v;++N)k+=P[N];if((k/=255)===v-1&&-1!==P.indexOf(0))u=[P.indexOf(0)];else if(k!==v){var I=l.decodePixels();for(b=new Uint8Array(I.length),N=0,v=I.length;N<v;N++)b[N]=P[I[N]];p=n(b,l.width,1)}}var C=function(e){var n;switch(e){case t.image_compression.FAST:n=11;break;case t.image_compression.MEDIUM:n=13;break;case t.image_compression.SLOW:n=14;break;default:n=12}return n}(a);return h=g===this.decode.FLATE_DECODE?"/Predictor "+C+" /Colors "+c+" /BitsPerComponent "+m+" /Columns "+l.width:"/Colors "+c+" /BitsPerComponent "+m+" /Columns "+l.width,(this.isArrayBuffer(r)||this.isArrayBufferView(r))&&(r=this.arrayBufferToBinaryString(r)),(p&&this.isArrayBuffer(p)||this.isArrayBufferView(p))&&(p=this.arrayBufferToBinaryString(p)),this.createImageInfo(r,l.width,l.height,d,m,g,i,o,h,u,f,p,C)}throw new Error("Unsupported PNG image data, try using JPEG instead.")}}(y.API),function(t){t.processGIF89A=function(e,n,r,i,o){var a=new w(e),s=a.width,l=a.height,h=[];a.decodeAndBlitFrameRGBA(0,h);var u={data:h,width:s,height:l},c=new x(100).encode(u,100);return t.processJPEG.call(this,c,n,r,i)},t.processGIF87A=t.processGIF89A}(y.API),function(t){t.processBMP=function(e,n,r,i,o){var a=new N(e,!1),s=a.width,l=a.height,h={data:a.getData(),width:s,height:l},u=new x(100).encode(h,100);return t.processJPEG.call(this,u,n,r,i)}}(y.API),y.API.setLanguage=function(t){return void 0===this.internal.languageSettings&&(this.internal.languageSettings={},this.internal.languageSettings.isSubscribed=!1),void 0!=={af:"Afrikaans",sq:"Albanian",ar:"Arabic (Standard)","ar-DZ":"Arabic (Algeria)","ar-BH":"Arabic (Bahrain)","ar-EG":"Arabic (Egypt)","ar-IQ":"Arabic (Iraq)","ar-JO":"Arabic (Jordan)","ar-KW":"Arabic (Kuwait)","ar-LB":"Arabic (Lebanon)","ar-LY":"Arabic (Libya)","ar-MA":"Arabic (Morocco)","ar-OM":"Arabic (Oman)","ar-QA":"Arabic (Qatar)","ar-SA":"Arabic (Saudi Arabia)","ar-SY":"Arabic (Syria)","ar-TN":"Arabic (Tunisia)","ar-AE":"Arabic (U.A.E.)","ar-YE":"Arabic (Yemen)",an:"Aragonese",hy:"Armenian",as:"Assamese",ast:"Asturian",az:"Azerbaijani",eu:"Basque",be:"Belarusian",bn:"Bengali",bs:"Bosnian",br:"Breton",bg:"Bulgarian",my:"Burmese",ca:"Catalan",ch:"Chamorro",ce:"Chechen",zh:"Chinese","zh-HK":"Chinese (Hong Kong)","zh-CN":"Chinese (PRC)","zh-SG":"Chinese (Singapore)","zh-TW":"Chinese (Taiwan)",cv:"Chuvash",co:"Corsican",cr:"Cree",hr:"Croatian",cs:"Czech",da:"Danish",nl:"Dutch (Standard)","nl-BE":"Dutch (Belgian)",en:"English","en-AU":"English (Australia)","en-BZ":"English (Belize)","en-CA":"English (Canada)","en-IE":"English (Ireland)","en-JM":"English (Jamaica)","en-NZ":"English (New Zealand)","en-PH":"English (Philippines)","en-ZA":"English (South Africa)","en-TT":"English (Trinidad & Tobago)","en-GB":"English (United Kingdom)","en-US":"English (United States)","en-ZW":"English (Zimbabwe)",eo:"Esperanto",et:"Estonian",fo:"Faeroese",fj:"Fijian",fi:"Finnish",fr:"French (Standard)","fr-BE":"French (Belgium)","fr-CA":"French (Canada)","fr-FR":"French (France)","fr-LU":"French (Luxembourg)","fr-MC":"French (Monaco)","fr-CH":"French (Switzerland)",fy:"Frisian",fur:"Friulian",gd:"Gaelic (Scots)","gd-IE":"Gaelic (Irish)",gl:"Galacian",ka:"Georgian",de:"German (Standard)","de-AT":"German (Austria)","de-DE":"German (Germany)","de-LI":"German (Liechtenstein)","de-LU":"German (Luxembourg)","de-CH":"German (Switzerland)",el:"Greek",gu:"Gujurati",ht:"Haitian",he:"Hebrew",hi:"Hindi",hu:"Hungarian",is:"Icelandic",id:"Indonesian",iu:"Inuktitut",ga:"Irish",it:"Italian (Standard)","it-CH":"Italian (Switzerland)",ja:"Japanese",kn:"Kannada",ks:"Kashmiri",kk:"Kazakh",km:"Khmer",ky:"Kirghiz",tlh:"Klingon",ko:"Korean","ko-KP":"Korean (North Korea)","ko-KR":"Korean (South Korea)",la:"Latin",lv:"Latvian",lt:"Lithuanian",lb:"Luxembourgish",mk:"FYRO Macedonian",ms:"Malay",ml:"Malayalam",mt:"Maltese",mi:"Maori",mr:"Marathi",mo:"Moldavian",nv:"Navajo",ng:"Ndonga",ne:"Nepali",no:"Norwegian",nb:"Norwegian (Bokmal)",nn:"Norwegian (Nynorsk)",oc:"Occitan",or:"Oriya",om:"Oromo",fa:"Persian","fa-IR":"Persian/Iran",pl:"Polish",pt:"Portuguese","pt-BR":"Portuguese (Brazil)",pa:"Punjabi","pa-IN":"Punjabi (India)","pa-PK":"Punjabi (Pakistan)",qu:"Quechua",rm:"Rhaeto-Romanic",ro:"Romanian","ro-MO":"Romanian (Moldavia)",ru:"Russian","ru-MO":"Russian (Moldavia)",sz:"Sami (Lappish)",sg:"Sango",sa:"Sanskrit",sc:"Sardinian",sd:"Sindhi",si:"Singhalese",sr:"Serbian",sk:"Slovak",sl:"Slovenian",so:"Somani",sb:"Sorbian",es:"Spanish","es-AR":"Spanish (Argentina)","es-BO":"Spanish (Bolivia)","es-CL":"Spanish (Chile)","es-CO":"Spanish (Colombia)","es-CR":"Spanish (Costa Rica)","es-DO":"Spanish (Dominican Republic)","es-EC":"Spanish (Ecuador)","es-SV":"Spanish (El Salvador)","es-GT":"Spanish (Guatemala)","es-HN":"Spanish (Honduras)","es-MX":"Spanish (Mexico)","es-NI":"Spanish (Nicaragua)","es-PA":"Spanish (Panama)","es-PY":"Spanish (Paraguay)","es-PE":"Spanish (Peru)","es-PR":"Spanish (Puerto Rico)","es-ES":"Spanish (Spain)","es-UY":"Spanish (Uruguay)","es-VE":"Spanish (Venezuela)",sx:"Sutu",sw:"Swahili",sv:"Swedish","sv-FI":"Swedish (Finland)","sv-SV":"Swedish (Sweden)",ta:"Tamil",tt:"Tatar",te:"Teluga",th:"Thai",tig:"Tigre",ts:"Tsonga",tn:"Tswana",tr:"Turkish",tk:"Turkmen",uk:"Ukrainian",hsb:"Upper Sorbian",ur:"Urdu",ve:"Venda",vi:"Vietnamese",vo:"Volapuk",wa:"Walloon",cy:"Welsh",xh:"Xhosa",ji:"Yiddish",zu:"Zulu"}[t]&&(this.internal.languageSettings.languageCode=t,!1===this.internal.languageSettings.isSubscribed&&(this.internal.events.subscribe("putCatalog",function(){this.internal.write("/Lang ("+this.internal.languageSettings.languageCode+")")}),this.internal.languageSettings.isSubscribed=!0)),this},c=y.API,f=c.getCharWidthsArray=function(t,e){var n,r,i,o=(e=e||{}).font||this.internal.getFont(),a=e.fontSize||this.internal.getFontSize(),s=e.charSpace||this.internal.getCharSpace(),l=e.widths?e.widths:o.metadata.Unicode.widths,h=l.fof?l.fof:1,u=e.kerning?e.kerning:o.metadata.Unicode.kerning,c=u.fof?u.fof:1,f=0,p=l[0]||h,d=[];for(n=0,r=t.length;n<r;n++)i=t.charCodeAt(n),"function"==typeof o.metadata.widthOfString?d.push((o.metadata.widthOfGlyph(o.metadata.characterToGlyph(i))+s*(1e3/a)||0)/1e3):d.push((l[i]||p)/h+(u[i]&&u[i][f]||0)/c),f=i;return d},p=c.getArraySum=function(t){for(var e=t.length,n=0;e;)n+=t[--e];return n},d=c.getStringUnitWidth=function(t,e){var n=(e=e||{}).fontSize||this.internal.getFontSize(),r=e.font||this.internal.getFont(),i=e.charSpace||this.internal.getCharSpace();return"function"==typeof r.metadata.widthOfString?r.metadata.widthOfString(t,n,i)/n:p(f.apply(this,arguments))},g=function(t,e,n,r){for(var i=[],o=0,a=t.length,s=0;o!==a&&s+e[o]<n;)s+=e[o],o++;i.push(t.slice(0,o));var l=o;for(s=0;o!==a;)s+e[o]>r&&(i.push(t.slice(l,o)),s=0,l=o),s+=e[o],o++;return l!==o&&i.push(t.slice(l,o)),i},m=function(t,e,n){n||(n={});var r,i,o,a,s,l,h=[],u=[h],c=n.textIndent||0,m=0,y=0,v=t.split(" "),w=f.apply(this,[" ",n])[0];if(l=-1===n.lineIndent?v[0].length+2:n.lineIndent||0){var b=Array(l).join(" "),x=[];v.map(function(t){(t=t.split(/\s*\n/)).length>1?x=x.concat(t.map(function(t,e){return(e&&t.length?"\n":"")+t})):x.push(t[0])}),v=x,l=d.apply(this,[b,n])}for(o=0,a=v.length;o<a;o++){var N=0;if(r=v[o],l&&"\n"==r[0]&&(r=r.substr(1),N=1),i=f.apply(this,[r,n]),c+m+(y=p(i))>e||N){if(y>e){for(s=g.apply(this,[r,i,e-(c+m),e]),h.push(s.shift()),h=[s.pop()];s.length;)u.push([s.shift()]);y=p(i.slice(r.length-(h[0]?h[0].length:0)))}else h=[r];u.push(h),c=y+l,m=w}else h.push(r),c+=m+y,m=w}if(l)var L=function(t,e){return(e?b:"")+t.join(" ")};else L=function(t){return t.join(" ")};return u.map(L)},c.splitTextToSize=function(t,e,n){var r,i=(n=n||{}).fontSize||this.internal.getFontSize(),o=function(t){var e={0:1},n={};if(t.widths&&t.kerning)return{widths:t.widths,kerning:t.kerning};var r=this.internal.getFont(t.fontName,t.fontStyle);return r.metadata.Unicode?{widths:r.metadata.Unicode.widths||e,kerning:r.metadata.Unicode.kerning||n}:{font:r.metadata,fontSize:this.internal.getFontSize(),charSpace:this.internal.getCharSpace()}}.call(this,n);r=Array.isArray(t)?t:t.split(/\r?\n/);var a=1*this.internal.scaleFactor*e/i;o.textIndent=n.textIndent?1*n.textIndent*this.internal.scaleFactor/i:0,o.lineIndent=n.lineIndent;var s,l,h=[];for(s=0,l=r.length;s<l;s++)h=h.concat(m.apply(this,[r[s],a,o]));return h},function(t){var e=function(t){for(var e={},n=0;n<"klmnopqrstuvwxyz".length;n++)e["klmnopqrstuvwxyz"[n]]="0123456789abcdef"[n];var r,i,o,a,s={},l=1,h=s,u=[],c="",f="",p=t.length-1;for(n=1;n!=p;)a=t[n],n+=1,"'"==a?r?(o=r.join(""),r=void 0):r=[]:r?r.push(a):"{"==a?(u.push([h,o]),h={},o=void 0):"}"==a?((i=u.pop())[0][i[1]]=h,o=void 0,h=i[0]):"-"==a?l=-1:void 0===o?e.hasOwnProperty(a)?(c+=e[a],o=parseInt(c,16)*l,l=1,c=""):c+=a:e.hasOwnProperty(a)?(f+=e[a],h[o]=parseInt(f,16)*l,l=1,o=void 0,f=""):f+=a;return s},n={codePages:["WinAnsiEncoding"],WinAnsiEncoding:e("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")},r={Unicode:{Courier:n,"Courier-Bold":n,"Courier-BoldOblique":n,"Courier-Oblique":n,Helvetica:n,"Helvetica-Bold":n,"Helvetica-BoldOblique":n,"Helvetica-Oblique":n,"Times-Roman":n,"Times-Bold":n,"Times-BoldItalic":n,"Times-Italic":n}},i={Unicode:{"Courier-Oblique":e("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-BoldItalic":e("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"),"Helvetica-Bold":e("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),Courier:e("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Courier-BoldOblique":e("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-Bold":e("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}"),Symbol:e("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}"),Helvetica:e("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"),"Helvetica-BoldOblique":e("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),ZapfDingbats:e("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}"),"Courier-Bold":e("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-Italic":e("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"),"Times-Roman":e("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"),"Helvetica-Oblique":e("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")}};t.events.push(["addFont",function(t){var e,n,o,a=t.font;(e=i.Unicode[a.postScriptName])&&((n=a.metadata.Unicode?a.metadata.Unicode:a.metadata.Unicode={}).widths=e.widths,n.kerning=e.kerning),(o=r.Unicode[a.postScriptName])&&((n=a.metadata.Unicode?a.metadata.Unicode:a.metadata.Unicode={}).encoding=o,o.codePages&&o.codePages.length&&(a.encoding=o.codePages[0]))}])}(y.API),function(t,e){t.API.events.push(["addFont",function(e){var n=e.font,r=e.instance;if(void 0!==r&&r.existsFileInVFS(n.postScriptName)){var i=r.getFileFromVFS(n.postScriptName);if("string"!=typeof i)throw new Error("Font is not stored as string-data in vFS, import fonts or remove declaration doc.addFont('"+n.postScriptName+"').");n.metadata=t.API.TTFFont.open(n.postScriptName,n.fontName,i,n.encoding),n.metadata.Unicode=n.metadata.Unicode||{encoding:{},kerning:{},widths:[]},n.metadata.glyIdsUsed=[0]}else if(!1===n.isStandardFont)throw new Error("Font does not exist in vFS, import fonts or remove declaration doc.addFont('"+n.postScriptName+"').")}])}(y,"undefined"!=typeof self&&self||"undefined"!=typeof global&&global||"undefined"!=typeof window&&window||Function("return this")()),function(t){t.addSvg=function(t,e,n,r,i){if(void 0===e||void 0===n)throw new Error("addSVG needs values for 'x' and 'y'");function o(t){for(var e=parseFloat(t[1]),n=parseFloat(t[2]),r=[],i=3,o=t.length;i<o;)"c"===t[i]?(r.push([parseFloat(t[i+1]),parseFloat(t[i+2]),parseFloat(t[i+3]),parseFloat(t[i+4]),parseFloat(t[i+5]),parseFloat(t[i+6])]),i+=7):"l"===t[i]?(r.push([parseFloat(t[i+1]),parseFloat(t[i+2])]),i+=3):i+=1;return[e,n,r]}var a=function(t,e){var n=(e.contentWindow||e.contentDocument).document;return n.write(t),n.close(),n.getElementsByTagName("svg")[0]}(t,function(t){var e=t.createElement("iframe");return function(t,e){var n=e.createElement("style");n.type="text/css",n.styleSheet?n.styleSheet.cssText=t:n.appendChild(e.createTextNode(t)),e.getElementsByTagName("head")[0].appendChild(n)}(".jsPDF_sillysvg_iframe {display:none;position:absolute;}",t),e.name="childframe",e.setAttribute("width",0),e.setAttribute("height",0),e.setAttribute("frameborder","0"),e.setAttribute("scrolling","no"),e.setAttribute("seamless","seamless"),e.setAttribute("class","jsPDF_sillysvg_iframe"),t.body.appendChild(e),e}(document)),s=[1,1],l=parseFloat(a.getAttribute("width")),h=parseFloat(a.getAttribute("height"));l&&h&&(r&&i?s=[r/l,i/h]:r?s=[r/l,r/l]:i&&(s=[i/h,i/h]));var u,c,f,p,d=a.childNodes;for(u=0,c=d.length;u<c;u++)(f=d[u]).tagName&&"PATH"===f.tagName.toUpperCase()&&((p=o(f.getAttribute("d").split(" ")))[0]=p[0]*s[0]+e,p[1]=p[1]*s[1]+n,this.lines.call(this,p[2],p[0],p[1],s));return this},t.addSVG=t.addSvg,t.addSvgAsImage=function(t,e,n,r,i,o,a,s){if(isNaN(e)||isNaN(n))throw console.error("jsPDF.addSvgAsImage: Invalid coordinates",arguments),new Error("Invalid coordinates passed to jsPDF.addSvgAsImage");if(isNaN(r)||isNaN(i))throw console.error("jsPDF.addSvgAsImage: Invalid measurements",arguments),new Error("Invalid measurements (width and/or height) passed to jsPDF.addSvgAsImage");var l=document.createElement("canvas");l.width=r,l.height=i;var h=l.getContext("2d");return h.fillStyle="#fff",h.fillRect(0,0,l.width,l.height),canvg(l,t,{ignoreMouse:!0,ignoreAnimation:!0,ignoreDimensions:!0,ignoreClear:!0}),this.addImage(l.toDataURL("image/jpeg",1),e,n,r,i,a,s),this}}(y.API),y.API.putTotalPages=function(t){var e,n=0;parseInt(this.internal.getFont().id.substr(1),10)<15?(e=new RegExp(t,"g"),n=this.internal.getNumberOfPages()):(e=new RegExp(this.pdfEscape16(t,this.internal.getFont()),"g"),n=this.pdfEscape16(this.internal.getNumberOfPages()+"",this.internal.getFont()));for(var r=1;r<=this.internal.getNumberOfPages();r++)for(var i=0;i<this.internal.pages[r].length;i++)this.internal.pages[r][i]=this.internal.pages[r][i].replace(e,n);return this},y.API.viewerPreferences=function(e,n){var r;e=e||{},n=n||!1;var i,o,a={HideToolbar:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},HideMenubar:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},HideWindowUI:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},FitWindow:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},CenterWindow:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},DisplayDocTitle:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.4},NonFullScreenPageMode:{defaultValue:"UseNone",value:"UseNone",type:"name",explicitSet:!1,valueSet:["UseNone","UseOutlines","UseThumbs","UseOC"],pdfVersion:1.3},Direction:{defaultValue:"L2R",value:"L2R",type:"name",explicitSet:!1,valueSet:["L2R","R2L"],pdfVersion:1.3},ViewArea:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},ViewClip:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintArea:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintClip:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintScaling:{defaultValue:"AppDefault",value:"AppDefault",type:"name",explicitSet:!1,valueSet:["AppDefault","None"],pdfVersion:1.6},Duplex:{defaultValue:"",value:"none",type:"name",explicitSet:!1,valueSet:["Simplex","DuplexFlipShortEdge","DuplexFlipLongEdge","none"],pdfVersion:1.7},PickTrayByPDFSize:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.7},PrintPageRange:{defaultValue:"",value:"",type:"array",explicitSet:!1,valueSet:null,pdfVersion:1.7},NumCopies:{defaultValue:1,value:1,type:"integer",explicitSet:!1,valueSet:null,pdfVersion:1.7}},s=Object.keys(a),l=[],h=0,u=0,c=0,f=!0;function p(t,e){var n,r=!1;for(n=0;n<t.length;n+=1)t[n]===e&&(r=!0);return r}if(void 0===this.internal.viewerpreferences&&(this.internal.viewerpreferences={},this.internal.viewerpreferences.configuration=JSON.parse(JSON.stringify(a)),this.internal.viewerpreferences.isSubscribed=!1),r=this.internal.viewerpreferences.configuration,"reset"===e||!0===n){var d=s.length;for(c=0;c<d;c+=1)r[s[c]].value=r[s[c]].defaultValue,r[s[c]].explicitSet=!1}if("object"===t(e))for(i in e)if(o=e[i],p(s,i)&&void 0!==o){if("boolean"===r[i].type&&"boolean"==typeof o)r[i].value=o;else if("name"===r[i].type&&p(r[i].valueSet,o))r[i].value=o;else if("integer"===r[i].type&&Number.isInteger(o))r[i].value=o;else if("array"===r[i].type){for(h=0;h<o.length;h+=1)if(f=!0,1===o[h].length&&"number"==typeof o[h][0])l.push(String(o[h]-1));else if(o[h].length>1){for(u=0;u<o[h].length;u+=1)"number"!=typeof o[h][u]&&(f=!1);!0===f&&l.push([o[h][0]-1,o[h][1]-1].join(" "))}r[i].value="["+l.join(" ")+"]"}else r[i].value=r[i].defaultValue;r[i].explicitSet=!0}return!1===this.internal.viewerpreferences.isSubscribed&&(this.internal.events.subscribe("putCatalog",function(){var t,e=[];for(t in r)!0===r[t].explicitSet&&("name"===r[t].type?e.push("/"+t+" /"+r[t].value):e.push("/"+t+" "+r[t].value));0!==e.length&&this.internal.write("/ViewerPreferences\n<<\n"+e.join("\n")+"\n>>")}),this.internal.viewerpreferences.isSubscribed=!0),this.internal.viewerpreferences.configuration=r,this},function(t){var e="",n="",r="";t.addMetadata=function(t,i){return n=i||"http://jspdf.default.namespaceuri/",e=t,this.internal.events.subscribe("postPutResources",function(){if(e){var t='<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:jspdf="'+n+'"><jspdf:metadata>',i=unescape(encodeURIComponent('<x:xmpmeta xmlns:x="adobe:ns:meta/">')),o=unescape(encodeURIComponent(t)),a=unescape(encodeURIComponent(e)),s=unescape(encodeURIComponent("</jspdf:metadata></rdf:Description></rdf:RDF>")),l=unescape(encodeURIComponent("</x:xmpmeta>")),h=o.length+a.length+s.length+i.length+l.length;r=this.internal.newObject(),this.internal.write("<< /Type /Metadata /Subtype /XML /Length "+h+" >>"),this.internal.write("stream"),this.internal.write(i+o+a+s+l),this.internal.write("endstream"),this.internal.write("endobj")}else r=""}),this.internal.events.subscribe("putCatalog",function(){r&&this.internal.write("/Metadata "+r+" 0 R")}),this}}(y.API),function(t,e){var n=t.API;var r=n.pdfEscape16=function(t,e){for(var n,r=e.metadata.Unicode.widths,i=["","0","00","000","0000"],o=[""],a=0,s=t.length;a<s;++a){if(n=e.metadata.characterToGlyph(t.charCodeAt(a)),e.metadata.glyIdsUsed.push(n),e.metadata.toUnicode[n]=t.charCodeAt(a),-1==r.indexOf(n)&&(r.push(n),r.push([parseInt(e.metadata.widthOfGlyph(n),10)])),"0"==n)return o.join("");n=n.toString(16),o.push(i[4-n.length],n)}return o.join("")},i=function(t){var e,n,r,i,o,a,s;for(o="/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000><ffff>\nendcodespacerange",r=[],a=0,s=(n=Object.keys(t).sort(function(t,e){return t-e})).length;a<s;a++)e=n[a],r.length>=100&&(o+="\n"+r.length+" beginbfchar\n"+r.join("\n")+"\nendbfchar",r=[]),i=("0000"+t[e].toString(16)).slice(-4),e=("0000"+(+e).toString(16)).slice(-4),r.push("<"+e+"><"+i+">");return r.length&&(o+="\n"+r.length+" beginbfchar\n"+r.join("\n")+"\nendbfchar\n"),o+="endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend"};n.events.push(["putFont",function(e){!function(e,n,r,o){if(e.metadata instanceof t.API.TTFFont&&"Identity-H"===e.encoding){for(var a=e.metadata.Unicode.widths,s=e.metadata.subset.encode(e.metadata.glyIdsUsed,1),l="",h=0;h<s.length;h++)l+=String.fromCharCode(s[h]);var u=r();o({data:l,addLength1:!0}),n("endobj");var c=r();o({data:i(e.metadata.toUnicode),addLength1:!0}),n("endobj");var f=r();n("<<"),n("/Type /FontDescriptor"),n("/FontName /"+e.fontName),n("/FontFile2 "+u+" 0 R"),n("/FontBBox "+t.API.PDFObject.convert(e.metadata.bbox)),n("/Flags "+e.metadata.flags),n("/StemV "+e.metadata.stemV),n("/ItalicAngle "+e.metadata.italicAngle),n("/Ascent "+e.metadata.ascender),n("/Descent "+e.metadata.decender),n("/CapHeight "+e.metadata.capHeight),n(">>"),n("endobj");var p=r();n("<<"),n("/Type /Font"),n("/BaseFont /"+e.fontName),n("/FontDescriptor "+f+" 0 R"),n("/W "+t.API.PDFObject.convert(a)),n("/CIDToGIDMap /Identity"),n("/DW 1000"),n("/Subtype /CIDFontType2"),n("/CIDSystemInfo"),n("<<"),n("/Supplement 0"),n("/Registry (Adobe)"),n("/Ordering ("+e.encoding+")"),n(">>"),n(">>"),n("endobj"),e.objectNumber=r(),n("<<"),n("/Type /Font"),n("/Subtype /Type0"),n("/ToUnicode "+c+" 0 R"),n("/BaseFont /"+e.fontName),n("/Encoding /"+e.encoding),n("/DescendantFonts ["+p+" 0 R]"),n(">>"),n("endobj"),e.isAlreadyPutted=!0}}(e.font,e.out,e.newObject,e.putStream)}]);n.events.push(["putFont",function(e){!function(e,n,r,o){if(e.metadata instanceof t.API.TTFFont&&"WinAnsiEncoding"===e.encoding){e.metadata.Unicode.widths;for(var a=e.metadata.rawData,s="",l=0;l<a.length;l++)s+=String.fromCharCode(a[l]);var h=r();o({data:s,addLength1:!0}),n("endobj");var u=r();o({data:i(e.metadata.toUnicode),addLength1:!0}),n("endobj");var c=r();for(n("<<"),n("/Descent "+e.metadata.decender),n("/CapHeight "+e.metadata.capHeight),n("/StemV "+e.metadata.stemV),n("/Type /FontDescriptor"),n("/FontFile2 "+h+" 0 R"),n("/Flags 96"),n("/FontBBox "+t.API.PDFObject.convert(e.metadata.bbox)),n("/FontName /"+e.fontName),n("/ItalicAngle "+e.metadata.italicAngle),n("/Ascent "+e.metadata.ascender),n(">>"),n("endobj"),e.objectNumber=r(),l=0;l<e.metadata.hmtx.widths.length;l++)e.metadata.hmtx.widths[l]=parseInt(e.metadata.hmtx.widths[l]*(1e3/e.metadata.head.unitsPerEm));n("<</Subtype/TrueType/Type/Font/ToUnicode "+u+" 0 R/BaseFont/"+e.fontName+"/FontDescriptor "+c+" 0 R/Encoding/"+e.encoding+" /FirstChar 29 /LastChar 255 /Widths "+t.API.PDFObject.convert(e.metadata.hmtx.widths)+">>"),n("endobj"),e.isAlreadyPutted=!0}}(e.font,e.out,e.newObject,e.putStream)}]);var o=function(t){var e,n,i=t.text||"",o=t.x,a=t.y,s=t.options||{},l=t.mutex||{},h=l.pdfEscape,u=l.activeFontKey,c=l.fonts,f=(l.activeFontSize,""),p=0,d="",g=c[n=u].encoding;if("Identity-H"!==c[n].encoding)return{text:i,x:o,y:a,options:s,mutex:l};for(d=i,n=u,"[object Array]"===Object.prototype.toString.call(i)&&(d=i[0]),p=0;p<d.length;p+=1)c[n].metadata.hasOwnProperty("cmap")&&(e=c[n].metadata.cmap.unicode.codeMap[d[p].charCodeAt(0)]),e?f+=d[p]:d[p].charCodeAt(0)<256&&c[n].metadata.hasOwnProperty("Unicode")?f+=d[p]:f+="";var m="";return parseInt(n.slice(1))<14||"WinAnsiEncoding"===g?m=function(t){for(var e="",n=0;n<t.length;n++)e+=""+t.charCodeAt(n).toString(16);return e}(h(f,n)):"Identity-H"===g&&(m=r(f,c[n])),l.isHex=!0,{text:m,x:o,y:a,options:s,mutex:l}};n.events.push(["postProcessText",function(t){var e=t.text||"",n=t.x,r=t.y,i=t.options,a=t.mutex,s=(i.lang,[]),l={text:e,x:n,y:r,options:i,mutex:a};if("[object Array]"===Object.prototype.toString.call(e)){var h=0;for(h=0;h<e.length;h+=1)"[object Array]"===Object.prototype.toString.call(e[h])&&3===e[h].length?s.push([o(Object.assign({},l,{text:e[h][0]})).text,e[h][1],e[h][2]]):s.push(o(Object.assign({},l,{text:e[h]})).text);t.text=s}else t.text=o(Object.assign({},l,{text:e})).text}])}(y,"undefined"!=typeof self&&self||"undefined"!=typeof global&&global||"undefined"!=typeof window&&window||Function("return this")()),function(t){var e=function(t){return void 0!==t&&(void 0===t.vFS&&(t.vFS={}),!0)};t.existsFileInVFS=function(t){return!!e(this.internal)&&void 0!==this.internal.vFS[t]},t.addFileToVFS=function(t,n){return e(this.internal),this.internal.vFS[t]=n,this},t.getFileFromVFS=function(t){return e(this.internal),void 0!==this.internal.vFS[t]?this.internal.vFS[t]:null}}(y.API),y.API.addHTML=function(t,e,n,r,i){if("undefined"==typeof html2canvas&&"undefined"==typeof rasterizeHTML)throw new Error("You need either https://github.com/niklasvh/html2canvas or https://github.com/cburgmer/rasterizeHTML.js");"number"!=typeof e&&(r=e,i=n),"function"==typeof r&&(i=r,r=null),"function"!=typeof i&&(i=function(){});var o=this.internal,a=o.scaleFactor,s=o.pageSize.getWidth(),l=o.pageSize.getHeight();if((r=r||{}).onrendered=function(t){e=parseInt(e)||0,n=parseInt(n)||0;var o=r.dim||{},h=Object.assign({top:0,right:0,bottom:0,left:0,useFor:"content"},r.margin),u=o.h||Math.min(l,t.height/a),c=o.w||Math.min(s,t.width/a)-e,f=r.format||"JPEG",p=r.imageCompression||"SLOW";if(t.height>l-h.top-h.bottom&&r.pagesplit){var d=function(t,e,n,i,o){var a=document.createElement("canvas");a.height=o,a.width=i;var s=a.getContext("2d");return s.mozImageSmoothingEnabled=!1,s.webkitImageSmoothingEnabled=!1,s.msImageSmoothingEnabled=!1,s.imageSmoothingEnabled=!1,s.fillStyle=r.backgroundColor||"#ffffff",s.fillRect(0,0,i,o),s.drawImage(t,e,n,i,o,0,0,i,o),a},g=function(){for(var r,o,u=0,g=0,m={},y=!1;;){var v;if(g=0,m.top=0!==u?h.top:n,m.left=0!==u?h.left:e,y=(s-h.left-h.right)*a<t.width,"content"===h.useFor?0===u?(r=Math.min((s-h.left)*a,t.width),o=Math.min((l-h.top)*a,t.height-u)):(r=Math.min(s*a,t.width),o=Math.min(l*a,t.height-u),m.top=0):(r=Math.min((s-h.left-h.right)*a,t.width),o=Math.min((l-h.bottom-h.top)*a,t.height-u)),y)for(;;){"content"===h.useFor&&(0===g?r=Math.min((s-h.left)*a,t.width):(r=Math.min(s*a,t.width-g),m.left=0));var w=[v=d(t,g,u,r,o),m.left,m.top,v.width/a,v.height/a,f,null,p];if(this.addImage.apply(this,w),(g+=r)>=t.width)break;this.addPage()}else w=[v=d(t,0,u,r,o),m.left,m.top,v.width/a,v.height/a,f,null,p],this.addImage.apply(this,w);if((u+=o)>=t.height)break;this.addPage()}i(c,u,null,w)}.bind(this);if("CANVAS"===t.nodeName){var m=new Image;m.onload=g,m.src=t.toDataURL("image/png"),t=m}else g()}else{var y=Math.random().toString(35),v=[t,e,n,c,u,f,y,p];this.addImage.apply(this,v),i(c,u,y,v)}}.bind(this),"undefined"!=typeof html2canvas&&!r.rstz)return html2canvas(t,r);if("undefined"!=typeof rasterizeHTML){var h="drawDocument";return"string"==typeof t&&(h=/^http/.test(t)?"drawURL":"drawHTML"),r.width=r.width||s*a,rasterizeHTML[h](t,void 0,r).then(function(t){r.onrendered(t.image)},function(t){i(null,t)})}return null},function(e){var n,r,i,o,a,s,l,h,u,c,f,p,d,g,m,y,v,w,b,x;n=function(){return function(e){return t.prototype=e,new t};function t(){}}(),c=function(t){var e,n,r,i,o,a,s;for(n=0,r=t.length,e=void 0,i=!1,a=!1;!i&&n!==r;)(e=t[n]=t[n].trimLeft())&&(i=!0),n++;for(n=r-1;r&&!a&&-1!==n;)(e=t[n]=t[n].trimRight())&&(a=!0),n--;for(o=/\s+$/g,s=!0,n=0;n!==r;)"\u2028"!=t[n]&&(e=t[n].replace(/\s+/g," "),s&&(e=e.trimLeft()),e&&(s=o.test(e)),t[n]=e),n++;return t},p=function(t){var e,n,r;for(e=void 0,n=(r=t.split(",")).shift();!e&&n;)e=i[n.trim().toLowerCase()],n=r.shift();return e},d=function(t){var e;return(t="auto"===t?"0px":t).indexOf("em")>-1&&!isNaN(Number(t.replace("em","")))&&(t=18.719*Number(t.replace("em",""))+"px"),t.indexOf("pt")>-1&&!isNaN(Number(t.replace("pt","")))&&(t=1.333*Number(t.replace("pt",""))+"px"),void 0,16,(e=g[t])?e:void 0!==(e={"xx-small":9,"x-small":11,small:13,medium:16,large:19,"x-large":23,"xx-large":28,auto:0}[t])?g[t]=e/16:(e=parseFloat(t))?g[t]=e/16:(e=t.match(/([\d\.]+)(px)/),Array.isArray(e)&&3===e.length?g[t]=parseFloat(e[1])/16:g[t]=1)},u=function(t){var e,n,r,i,u;return i=t,u=document.defaultView&&document.defaultView.getComputedStyle?document.defaultView.getComputedStyle(i,null):i.currentStyle?i.currentStyle:i.style,n=void 0,(e={})["font-family"]=p((r=function(t){return t=t.replace(/-\D/g,function(t){return t.charAt(1).toUpperCase()}),u[t]})("font-family"))||"times",e["font-style"]=o[r("font-style")]||"normal",e["text-align"]=a[r("text-align")]||"left","bold"===(n=s[r("font-weight")]||"normal")&&("normal"===e["font-style"]?e["font-style"]=n:e["font-style"]=n+e["font-style"]),e["font-size"]=d(r("font-size"))||1,e["line-height"]=d(r("line-height"))||1,e.display="inline"===r("display")?"inline":"block",n="block"===e.display,e["margin-top"]=n&&d(r("margin-top"))||0,e["margin-bottom"]=n&&d(r("margin-bottom"))||0,e["padding-top"]=n&&d(r("padding-top"))||0,e["padding-bottom"]=n&&d(r("padding-bottom"))||0,e["margin-left"]=n&&d(r("margin-left"))||0,e["margin-right"]=n&&d(r("margin-right"))||0,e["padding-left"]=n&&d(r("padding-left"))||0,e["padding-right"]=n&&d(r("padding-right"))||0,e["page-break-before"]=r("page-break-before")||"auto",e.float=l[r("cssFloat")]||"none",e.clear=h[r("clear")]||"none",e.color=r("color"),e},m=function(t,e,n){var r,i,o,a,s;if(o=!1,i=void 0,a=void 0,r=n["#"+t.id])if("function"==typeof r)o=r(t,e);else for(i=0,a=r.length;!o&&i!==a;)o=r[i](t,e),i++;if(r=n[t.nodeName],!o&&r)if("function"==typeof r)o=r(t,e);else for(i=0,a=r.length;!o&&i!==a;)o=r[i](t,e),i++;for(s="string"==typeof t.className?t.className.split(" "):[],i=0;i<s.length;i++)if(r=n["."+s[i]],!o&&r)if("function"==typeof r)o=r(t,e);else for(i=0,a=r.length;!o&&i!==a;)o=r[i](t,e),i++;return o},x=function(t,e){var n,r,i,o,a,s,l,h,u;for(n=[],r=[],i=0,u=t.rows[0].cells.length,l=t.clientWidth;i<u;)h=t.rows[0].cells[i],r[i]={name:h.textContent.toLowerCase().replace(/\s+/g,""),prompt:h.textContent.replace(/\r?\n/g,""),width:h.clientWidth/l*e.pdf.internal.pageSize.getWidth()},i++;for(i=1;i<t.rows.length;){for(s=t.rows[i],a={},o=0;o<s.cells.length;)a[r[o].name]=s.cells[o].textContent.replace(/\r?\n/g,""),o++;n.push(a),i++}return{rows:n,headers:r}};var N={SCRIPT:1,STYLE:1,NOSCRIPT:1,OBJECT:1,EMBED:1,SELECT:1},L=1;r=function(e,i,o){var a,s,l,h,c,f,p,d;for(s=e.childNodes,a=void 0,(c="block"===(l=u(e)).display)&&(i.setBlockBoundary(),i.setBlockStyle(l)),h=0,f=s.length;h<f;){if("object"===t(a=s[h])){if(i.executeWatchFunctions(a),1===a.nodeType&&"HEADER"===a.nodeName){var g=a,v=i.pdf.margins_doc.top;i.pdf.internal.events.subscribe("addPage",function(t){i.y=v,r(g,i,o),i.pdf.margins_doc.top=i.y+10,i.y+=10},!1)}if(8===a.nodeType&&"#comment"===a.nodeName)~a.textContent.indexOf("ADD_PAGE")&&(i.pdf.addPage(),i.y=i.pdf.margins_doc.top);else if(1!==a.nodeType||N[a.nodeName])if(3===a.nodeType){var w=a.nodeValue;if(a.nodeValue&&"LI"===a.parentNode.nodeName)if("OL"===a.parentNode.parentNode.nodeName)w=L+++". "+w;else{var b=l["font-size"],A=(3-.75*b)*i.pdf.internal.scaleFactor,S=.75*b*i.pdf.internal.scaleFactor,_=1.74*b/i.pdf.internal.scaleFactor;d=function(t,e){this.pdf.circle(t+A,e+S,_,"FD")}}16&a.ownerDocument.body.compareDocumentPosition(a)&&i.addText(w,l)}else"string"==typeof a&&i.addText(a,l);else{var F;if("IMG"===a.nodeName){var P=a.getAttribute("src");F=y[i.pdf.sHashCode(P)||P]}if(F){i.pdf.internal.pageSize.getHeight()-i.pdf.margins_doc.bottom<i.y+a.height&&i.y>i.pdf.margins_doc.top&&(i.pdf.addPage(),i.y=i.pdf.margins_doc.top,i.executeWatchFunctions(a));var k=u(a),I=i.x,C=12/i.pdf.internal.scaleFactor,B=(k["margin-left"]+k["padding-left"])*C,j=(k["margin-right"]+k["padding-right"])*C,E=(k["margin-top"]+k["padding-top"])*C,M=(k["margin-bottom"]+k["padding-bottom"])*C;void 0!==k.float&&"right"===k.float?I+=i.settings.width-a.width-j:I+=B,i.pdf.addImage(F,I,i.y+E,a.width,a.height),F=void 0,"right"===k.float||"left"===k.float?(i.watchFunctions.push(function(t,e,n,r){return i.y>=e?(i.x+=t,i.settings.width+=n,!0):!!(r&&1===r.nodeType&&!N[r.nodeName]&&i.x+r.width>i.pdf.margins_doc.left+i.pdf.margins_doc.width)&&(i.x+=t,i.y=e,i.settings.width+=n,!0)}.bind(this,"left"===k.float?-a.width-B-j:0,i.y+a.height+E+M,a.width)),i.watchFunctions.push(function(t,e,n){return!(i.y<t&&e===i.pdf.internal.getNumberOfPages())||1===n.nodeType&&"both"===u(n).clear&&(i.y=t,!0)}.bind(this,i.y+a.height,i.pdf.internal.getNumberOfPages())),i.settings.width-=a.width+B+j,"left"===k.float&&(i.x+=a.width+B+j)):i.y+=a.height+E+M}else if("TABLE"===a.nodeName)p=x(a,i),i.y+=10,i.pdf.table(i.x,i.y,p.rows,p.headers,{autoSize:!1,printHeaders:o.printHeaders,margins:i.pdf.margins_doc,css:u(a)}),i.y=i.pdf.lastCellPos.y+i.pdf.lastCellPos.h+20;else if("OL"===a.nodeName||"UL"===a.nodeName)L=1,m(a,i,o)||r(a,i,o),i.y+=10;else if("LI"===a.nodeName){var O=i.x;i.x+=20/i.pdf.internal.scaleFactor,i.y+=3,m(a,i,o)||r(a,i,o),i.x=O}else"BR"===a.nodeName?(i.y+=l["font-size"]*i.pdf.internal.scaleFactor,i.addText("\u2028",n(l))):m(a,i,o)||r(a,i,o)}}h++}if(o.outY=i.y,c)return i.setBlockBoundary(d)},y={},v=function(t,e,n,r){var i,o=t.getElementsByTagName("img"),a=o.length,s=0;function l(){e.pdf.internal.events.publish("imagesLoaded"),r(i)}function h(t,n,r){if(t){var o=new Image;i=++s,o.crossOrigin="",o.onerror=o.onload=function(){if(o.complete&&(0===o.src.indexOf("data:image/")&&(o.width=n||o.width||0,o.height=r||o.height||0),o.width+o.height)){var i=e.pdf.sHashCode(t)||t;y[i]=y[i]||o}--s||l()},o.src=t}}for(;a--;)h(o[a].getAttribute("src"),o[a].width,o[a].height);return s||l()},w=function(t,e,n){var i=t.getElementsByTagName("footer");if(i.length>0){i=i[0];var o=e.pdf.internal.write,a=e.y;e.pdf.internal.write=function(){},r(i,e,n);var s=Math.ceil(e.y-a)+5;e.y=a,e.pdf.internal.write=o,e.pdf.margins_doc.bottom+=s;for(var l=function(t){var o=void 0!==t?t.pageNumber:1,a=e.y;e.y=e.pdf.internal.pageSize.getHeight()-e.pdf.margins_doc.bottom,e.pdf.margins_doc.bottom-=s;for(var l=i.getElementsByTagName("span"),h=0;h<l.length;++h)(" "+l[h].className+" ").replace(/[\n\t]/g," ").indexOf(" pageCounter ")>-1&&(l[h].innerHTML=o),(" "+l[h].className+" ").replace(/[\n\t]/g," ").indexOf(" totalPages ")>-1&&(l[h].innerHTML="###jsPDFVarTotalPages###");r(i,e,n),e.pdf.margins_doc.bottom+=s,e.y=a},h=i.getElementsByTagName("span"),u=0;u<h.length;++u)(" "+h[u].className+" ").replace(/[\n\t]/g," ").indexOf(" totalPages ")>-1&&e.pdf.internal.events.subscribe("htmlRenderingFinished",e.pdf.putTotalPages.bind(e.pdf,"###jsPDFVarTotalPages###"),!0);e.pdf.internal.events.subscribe("addPage",l,!1),l(),N.FOOTER=1}},b=function(t,e,n,i,o,a){if(!e)return!1;"string"==typeof e||e.parentNode||(e=""+e.innerHTML),"string"==typeof e&&(e=function(t){var e,n,r;return r="jsPDFhtmlText"+Date.now().toString()+(1e3*Math.random()).toFixed(0),"position: absolute !important;clip: rect(1px 1px 1px 1px); /* IE6, IE7 */clip: rect(1px, 1px, 1px, 1px);padding:0 !important;border:0 !important;height: 1px !important;width: 1px !important; top:auto;left:-100px;overflow: hidden;",(n=document.createElement("div")).style.cssText="position: absolute !important;clip: rect(1px 1px 1px 1px); /* IE6, IE7 */clip: rect(1px, 1px, 1px, 1px);padding:0 !important;border:0 !important;height: 1px !important;width: 1px !important; top:auto;left:-100px;overflow: hidden;",n.innerHTML='<iframe style="height:1px;width:1px" name="'+r+'" />',document.body.appendChild(n),(e=window.frames[r]).document.open(),e.document.writeln(t),e.document.close(),e.document.body}(e.replace(/<\/?script[^>]*?>/gi,"")));var s,l=new f(t,n,i,o);return v.call(this,e,l,o.elementHandlers,function(t){w(e,l,o.elementHandlers),r(e,l,o.elementHandlers),l.pdf.internal.events.publish("htmlRenderingFinished"),s=l.dispose(),"function"==typeof a?a(s):t&&console.error("jsPDF Warning: rendering issues? provide a callback to fromHTML!")}),s||{x:l.x,y:l.y}},(f=function(t,e,n,r){return this.pdf=t,this.x=e,this.y=n,this.settings=r,this.watchFunctions=[],this.init(),this}).prototype.init=function(){return this.paragraph={text:[],style:[]},this.pdf.internal.write("q")},f.prototype.dispose=function(){return this.pdf.internal.write("Q"),{x:this.x,y:this.y,ready:!0}},f.prototype.executeWatchFunctions=function(t){var e=!1,n=[];if(this.watchFunctions.length>0){for(var r=0;r<this.watchFunctions.length;++r)!0===this.watchFunctions[r](t)?e=!0:n.push(this.watchFunctions[r]);this.watchFunctions=n}return e},f.prototype.splitFragmentsIntoLines=function(t,e){var r,i,o,a,s,l,h,u,c,f,p,d,g,m;for(12,f=this.pdf.internal.scaleFactor,a={},i=void 0,c=void 0,o=void 0,s=void 0,m=void 0,u=void 0,h=void 0,l=void 0,d=[p=[]],r=0,g=this.settings.width;t.length;)if(s=t.shift(),m=e.shift(),s)if((o=a[(i=m["font-family"])+(c=m["font-style"])])||(o=this.pdf.internal.getFont(i,c).metadata.Unicode,a[i+c]=o),u={widths:o.widths,kerning:o.kerning,fontSize:12*m["font-size"],textIndent:r},h=this.pdf.getStringUnitWidth(s,u)*u.fontSize/f,"\u2028"==s)p=[],d.push(p);else if(r+h>g){for(l=this.pdf.splitTextToSize(s,g,u),p.push([l.shift(),m]);l.length;)p=[[l.shift(),m]],d.push(p);r=this.pdf.getStringUnitWidth(p[0][0],u)*u.fontSize/f}else p.push([s,m]),r+=h;if(void 0!==m["text-align"]&&("center"===m["text-align"]||"right"===m["text-align"]||"justify"===m["text-align"]))for(var y=0;y<d.length;++y){var v=this.pdf.getStringUnitWidth(d[y][0][0],u)*u.fontSize/f;y>0&&(d[y][0][1]=n(d[y][0][1]));var w=g-v;if("right"===m["text-align"])d[y][0][1]["margin-left"]=w;else if("center"===m["text-align"])d[y][0][1]["margin-left"]=w/2;else if("justify"===m["text-align"]){var b=d[y][0][0].split(" ").length-1;d[y][0][1]["word-spacing"]=w/b,y===d.length-1&&(d[y][0][1]["word-spacing"]=0)}}return d},f.prototype.RenderTextFragment=function(t,e){var n,r;r=0,this.pdf.internal.pageSize.getHeight()-this.pdf.margins_doc.bottom<this.y+this.pdf.internal.getFontSize()&&(this.pdf.internal.write("ET","Q"),this.pdf.addPage(),this.y=this.pdf.margins_doc.top,this.pdf.internal.write("q","BT",this.getPdfColor(e.color),this.pdf.internal.getCoordinateString(this.x),this.pdf.internal.getVerticalCoordinateString(this.y),"Td"),r=Math.max(r,e["line-height"],e["font-size"]),this.pdf.internal.write(0,(-12*r).toFixed(2),"Td")),n=this.pdf.internal.getFont(e["font-family"],e["font-style"]);var i=this.getPdfColor(e.color);i!==this.lastTextColor&&(this.pdf.internal.write(i),this.lastTextColor=i),void 0!==e["word-spacing"]&&e["word-spacing"]>0&&this.pdf.internal.write(e["word-spacing"].toFixed(2),"Tw"),this.pdf.internal.write("/"+n.id,(12*e["font-size"]).toFixed(2),"Tf","("+this.pdf.internal.pdfEscape(t)+") Tj"),void 0!==e["word-spacing"]&&this.pdf.internal.write(0,"Tw")},f.prototype.getPdfColor=function(t){var e,n,r,i=/rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+\s*)\)/.exec(t);if(null!=i)e=parseInt(i[1]),n=parseInt(i[2]),r=parseInt(i[3]);else{if("string"==typeof t&&"#"!=t.charAt(0)){var o=new RGBColor(t);t=o.ok?o.toHex():"#000000"}e=t.substring(1,3),e=parseInt(e,16),n=t.substring(3,5),n=parseInt(n,16),r=t.substring(5,7),r=parseInt(r,16)}if("string"==typeof e&&/^#[0-9A-Fa-f]{6}$/.test(e)){var a=parseInt(e.substr(1),16);e=a>>16&255,n=a>>8&255,r=255&a}var s=this.f3;return 0===e&&0===n&&0===r||void 0===n?s(e/255)+" g":[s(e/255),s(n/255),s(r/255),"rg"].join(" ")},f.prototype.f3=function(t){return t.toFixed(3)},f.prototype.renderParagraph=function(t){var e,n,r,i,o,a,s,l,h,u,f,p,d;if(r=c(this.paragraph.text),p=this.paragraph.style,e=this.paragraph.blockstyle,this.paragraph.priorblockstyle||{},this.paragraph={text:[],style:[],blockstyle:{},priorblockstyle:e},r.join("").trim()){s=this.splitFragmentsIntoLines(r,p),a=void 0,l=void 0,12,n=12/this.pdf.internal.scaleFactor,this.priorMarginBottom=this.priorMarginBottom||0,f=(Math.max((e["margin-top"]||0)-this.priorMarginBottom,0)+(e["padding-top"]||0))*n,u=((e["margin-bottom"]||0)+(e["padding-bottom"]||0))*n,this.priorMarginBottom=e["margin-bottom"]||0,"always"===e["page-break-before"]&&(this.pdf.addPage(),this.y=0,f=((e["margin-top"]||0)+(e["padding-top"]||0))*n),h=this.pdf.internal.write,i=void 0,o=void 0,this.y+=f,h("q","BT 0 g",this.pdf.internal.getCoordinateString(this.x),this.pdf.internal.getVerticalCoordinateString(this.y),"Td");for(var g=0;s.length;){for(l=0,i=0,o=(a=s.shift()).length;i!==o;)a[i][0].trim()&&(l=Math.max(l,a[i][1]["line-height"],a[i][1]["font-size"]),d=7*a[i][1]["font-size"]),i++;var m=0,y=0;for(void 0!==a[0][1]["margin-left"]&&a[0][1]["margin-left"]>0&&(m=(y=this.pdf.internal.getCoordinateString(a[0][1]["margin-left"]))-g,g=y),h(m+Math.max(e["margin-left"]||0,0)*n,(-12*l).toFixed(2),"Td"),i=0,o=a.length;i!==o;)a[i][0]&&this.RenderTextFragment(a[i][0],a[i][1]),i++;if(this.y+=l*n,this.executeWatchFunctions(a[0][1])&&s.length>0){var v=[],w=[];s.forEach(function(t){for(var e=0,n=t.length;e!==n;)t[e][0]&&(v.push(t[e][0]+" "),w.push(t[e][1])),++e}),s=this.splitFragmentsIntoLines(c(v),w),h("ET","Q"),h("q","BT 0 g",this.pdf.internal.getCoordinateString(this.x),this.pdf.internal.getVerticalCoordinateString(this.y),"Td")}}return t&&"function"==typeof t&&t.call(this,this.x-9,this.y-d/2),h("ET","Q"),this.y+=u}},f.prototype.setBlockBoundary=function(t){return this.renderParagraph(t)},f.prototype.setBlockStyle=function(t){return this.paragraph.blockstyle=t},f.prototype.addText=function(t,e){return this.paragraph.text.push(t),this.paragraph.style.push(e)},i={helvetica:"helvetica","sans-serif":"helvetica","times new roman":"times",serif:"times",times:"times",monospace:"courier",courier:"courier"},s={100:"normal",200:"normal",300:"normal",400:"normal",500:"bold",600:"bold",700:"bold",800:"bold",900:"bold",normal:"normal",bold:"bold",bolder:"bold",lighter:"normal"},o={normal:"normal",italic:"italic",oblique:"italic"},a={left:"left",right:"right",center:"center",justify:"justify"},l={none:"none",right:"right",left:"left"},h={none:"none",both:"both"},g={normal:1},e.fromHTML=function(t,e,n,r,i,o){return this.margins_doc=o||{top:0,bottom:0},r||(r={}),r.elementHandlers||(r.elementHandlers={}),b(this,t,isNaN(e)?4:e,isNaN(n)?4:n,r,i)}}(y.API),y.API,("undefined"!=typeof window&&window||"undefined"!=typeof global&&global).html2pdf=function(t,e,n){var r=e.canvas;if(r){var i,o;if(r.pdf=e,e.annotations={_nameMap:[],createAnnotation:function(t,n){var r,i=e.context2d._wrapX(n.left),o=e.context2d._wrapY(n.top),a=(e.context2d._page(n.top),t.indexOf("#"));r=a>=0?{name:t.substring(a+1)}:{url:t},e.link(i,o,n.right-n.left,n.bottom-n.top,r)},setName:function(t,n){var r=e.context2d._wrapX(n.left),i=e.context2d._wrapY(n.top),o=e.context2d._page(n.top);this._nameMap[t]={page:o,x:r,y:i}}},r.annotations=e.annotations,e.context2d._pageBreakAt=function(t){this.pageBreaks.push(t)},e.context2d._gotoPage=function(t){for(;e.internal.getNumberOfPages()<t;)e.addPage();e.setPage(t)},"string"==typeof t){t=t.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"");var a,s,l=document.createElement("iframe");document.body.appendChild(l),null!=(a=l.contentDocument)&&null!=a||(a=l.contentWindow.document),a.open(),a.write(t),a.close(),i=a.body,s=a.body||{},t=a.documentElement||{},o=Math.max(s.scrollHeight,s.offsetHeight,t.clientHeight,t.scrollHeight,t.offsetHeight)}else i=t,s=t.body||{},o=Math.max(s.scrollHeight,s.offsetHeight,t.clientHeight,t.scrollHeight,t.offsetHeight);var h={async:!0,allowTaint:!0,backgroundColor:"#ffffff",canvas:r,imageTimeout:15e3,logging:!0,proxy:null,removeContainer:!0,foreignObjectRendering:!1,useCORS:!1,windowHeight:o=e.internal.pageSize.getHeight(),scrollY:o};e.context2d.pageWrapYEnabled=!0,e.context2d.pageWrapY=e.internal.pageSize.getHeight(),html2canvas(i,h).then(function(t){n&&(l&&l.parentElement.removeChild(l),n(e))})}else alert("jsPDF canvas plugin not installed")},window.tmp=html2pdf,function(t){var e=t.BlobBuilder||t.WebKitBlobBuilder||t.MSBlobBuilder||t.MozBlobBuilder;t.URL=t.URL||t.webkitURL||function(t,e){return(e=document.createElement("a")).href=t,e};var n=t.Blob,r=URL.createObjectURL,i=URL.revokeObjectURL,o=t.Symbol&&t.Symbol.toStringTag,a=!1,s=!1,l=!!t.ArrayBuffer,h=e&&e.prototype.append&&e.prototype.getBlob;try{a=2===new Blob(["ä"]).size,s=2===new Blob([new Uint8Array([1,2])]).size}catch(t){}function u(t){return t.map(function(t){if(t.buffer instanceof ArrayBuffer){var e=t.buffer;if(t.byteLength!==e.byteLength){var n=new Uint8Array(t.byteLength);n.set(new Uint8Array(e,t.byteOffset,t.byteLength)),e=n.buffer}return e}return t})}function c(t,n){n=n||{};var r=new e;return u(t).forEach(function(t){r.append(t)}),n.type?r.getBlob(n.type):r.getBlob()}function f(t,e){return new n(u(t),e||{})}if(t.Blob&&(c.prototype=Blob.prototype,f.prototype=Blob.prototype),o)try{File.prototype[o]="File",Blob.prototype[o]="Blob",FileReader.prototype[o]="FileReader"}catch(t){}function p(){var e=!!t.ActiveXObject||"-ms-scroll-limit"in document.documentElement.style&&"-ms-ime-align"in document.documentElement.style,n=t.XMLHttpRequest&&t.XMLHttpRequest.prototype.send;e&&n&&(XMLHttpRequest.prototype.send=function(t){t instanceof Blob?(this.setRequestHeader("Content-Type",t.type),n.call(this,t)):n.call(this,t)});try{new File([],"")}catch(e){try{var r=new Function('class File extends Blob {constructor(chunks, name, opts) {opts = opts || {};super(chunks, opts || {});this.name = name;this.lastModifiedDate = opts.lastModified ? new Date(opts.lastModified) : new Date;this.lastModified = +this.lastModifiedDate;}};return new File([], ""), File')();t.File=r}catch(e){r=function(t,e,n){var r=new Blob(t,n),i=n&&void 0!==n.lastModified?new Date(n.lastModified):new Date;return r.name=e,r.lastModifiedDate=i,r.lastModified=+i,r.toString=function(){return"[object File]"},o&&(r[o]="File"),r};t.File=r}}}a?(p(),t.Blob=s?t.Blob:f):h?(p(),t.Blob=c):function(){function e(t){for(var e=[],n=0;n<t.length;n++){var r=t.charCodeAt(n);r<128?e.push(r):r<2048?e.push(192|r>>6,128|63&r):r<55296||r>=57344?e.push(224|r>>12,128|r>>6&63,128|63&r):(n++,r=65536+((1023&r)<<10|1023&t.charCodeAt(n)),e.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|63&r))}return e}function n(t){var e,n,r,i,o,a;for(e="",r=t.length,n=0;n<r;)switch((i=t[n++])>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:e+=String.fromCharCode(i);break;case 12:case 13:o=t[n++],e+=String.fromCharCode((31&i)<<6|63&o);break;case 14:o=t[n++],a=t[n++],e+=String.fromCharCode((15&i)<<12|(63&o)<<6|(63&a)<<0)}return e}function o(t){for(var e=new Array(t.byteLength),n=new Uint8Array(t),r=e.length;r--;)e[r]=n[r];return e}function a(t){for(var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=[],r=0;r<t.length;r+=3){var i=t[r],o=r+1<t.length,a=o?t[r+1]:0,s=r+2<t.length,l=s?t[r+2]:0,h=i>>2,u=(3&i)<<4|a>>4,c=(15&a)<<2|l>>6,f=63&l;s||(f=64,o||(c=64)),n.push(e[h],e[u],e[c],e[f])}return n.join("")}var s=Object.create||function(t){function e(){}return e.prototype=t,new e};if(l)var h=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],u=ArrayBuffer.isView||function(t){return t&&h.indexOf(Object.prototype.toString.call(t))>-1};function c(t,n){for(var r=0,i=(t=t||[]).length;r<i;r++){var a=t[r];a instanceof c?t[r]=a._buffer:"string"==typeof a?t[r]=e(a):l&&(ArrayBuffer.prototype.isPrototypeOf(a)||u(a))?t[r]=o(a):l&&(s=a)&&DataView.prototype.isPrototypeOf(s)?t[r]=o(a.buffer):t[r]=e(String(a))}var s;this._buffer=[].concat.apply([],t),this.size=this._buffer.length,this.type=n&&n.type||""}function f(t,e,n){n=n||{};var r=c.call(this,t,n)||this;return r.name=e,r.lastModifiedDate=n.lastModified?new Date(n.lastModified):new Date,r.lastModified=+r.lastModifiedDate,r}if(c.prototype.slice=function(t,e,n){return new c([this._buffer.slice(t||0,e||this._buffer.length)],{type:n})},c.prototype.toString=function(){return"[object Blob]"},f.prototype=s(c.prototype),f.prototype.constructor=f,Object.setPrototypeOf)Object.setPrototypeOf(f,c);else try{f.__proto__=c}catch(t){}function p(){if(!(this instanceof p))throw new TypeError("Failed to construct 'FileReader': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");var t=document.createDocumentFragment();this.addEventListener=t.addEventListener,this.dispatchEvent=function(e){var n=this["on"+e.type];"function"==typeof n&&n(e),t.dispatchEvent(e)},this.removeEventListener=t.removeEventListener}function d(t,e,n){if(!(e instanceof c))throw new TypeError("Failed to execute '"+n+"' on 'FileReader': parameter 1 is not of type 'Blob'.");t.result="",setTimeout(function(){this.readyState=p.LOADING,t.dispatchEvent(new Event("load")),t.dispatchEvent(new Event("loadend"))})}f.prototype.toString=function(){return"[object File]"},p.EMPTY=0,p.LOADING=1,p.DONE=2,p.prototype.error=null,p.prototype.onabort=null,p.prototype.onerror=null,p.prototype.onload=null,p.prototype.onloadend=null,p.prototype.onloadstart=null,p.prototype.onprogress=null,p.prototype.readAsDataURL=function(t){d(this,t,"readAsDataURL"),this.result="data:"+t.type+";base64,"+a(t._buffer)},p.prototype.readAsText=function(t){d(this,t,"readAsText"),this.result=n(t._buffer)},p.prototype.readAsArrayBuffer=function(t){d(this,t,"readAsText"),this.result=t._buffer.slice()},p.prototype.abort=function(){},URL.createObjectURL=function(t){return t instanceof c?"data:"+t.type+";base64,"+a(t._buffer):r.call(URL,t)},URL.revokeObjectURL=function(t){i&&i.call(URL,t)};var g=t.XMLHttpRequest&&t.XMLHttpRequest.prototype.send;g&&(XMLHttpRequest.prototype.send=function(t){t instanceof c?(this.setRequestHeader("Content-Type",t.type),g.call(this,n(t._buffer))):g.call(this,t)}),t.FileReader=p,t.File=f,t.Blob=c}()}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof global&&global||Function('return typeof this === "object" && this.content')()||Function("return this")());var v=v||function(t){if(!(void 0===t||"undefined"!=typeof navigator&&/MSIE [1-9]\./.test(navigator.userAgent))){var e=t.document,n=function(){return t.URL||t.webkitURL||t},r=e.createElementNS("http://www.w3.org/1999/xhtml","a"),i="download"in r,o=/constructor/i.test(t.HTMLElement)||t.safari,a=/CriOS\/[\d]+/.test(navigator.userAgent),s=t.setImmediate||t.setTimeout,l=function(t){s(function(){throw t},0)},h=function(t){setTimeout(function(){"string"==typeof t?n().revokeObjectURL(t):t.remove()},4e4)},u=function(t){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)?new Blob([String.fromCharCode(65279),t],{type:t.type}):t},c=function(e,c,f){f||(e=u(e));var p,d=this,g="application/octet-stream"===e.type,m=function(){!function(t,e,n){for(var r=(e=[].concat(e)).length;r--;){var i=t["on"+e[r]];if("function"==typeof i)try{i.call(t,n||t)}catch(t){l(t)}}}(d,"writestart progress write writeend".split(" "))};if(d.readyState=d.INIT,i)return p=n().createObjectURL(e),void s(function(){var t,e;r.href=p,r.download=c,t=r,e=new MouseEvent("click"),t.dispatchEvent(e),m(),h(p),d.readyState=d.DONE},0);!function(){if((a||g&&o)&&t.FileReader){var r=new FileReader;return r.onloadend=function(){var e=a?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");t.open(e,"_blank")||(t.location.href=e),e=void 0,d.readyState=d.DONE,m()},r.readAsDataURL(e),void(d.readyState=d.INIT)}p||(p=n().createObjectURL(e)),g?t.location.href=p:t.open(p,"_blank")||(t.location.href=p);d.readyState=d.DONE,m(),h(p)}()},f=c.prototype;return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(t,e,n){return e=e||t.name||"download",n||(t=u(t)),navigator.msSaveOrOpenBlob(t,e)}:(f.abort=function(){},f.readyState=f.INIT=0,f.WRITING=1,f.DONE=2,f.error=f.onwritestart=f.onprogress=f.onwrite=f.onabort=f.onerror=f.onwriteend=null,function(t,e,n){return new c(t,e||t.name||"download",n)})}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||void 0);function w(t){var e=0;if(71!==t[e++]||73!==t[e++]||70!==t[e++]||56!==t[e++]||56!=(t[e++]+1&253)||97!==t[e++])throw"Invalid GIF 87a/89a header.";var n=t[e++]|t[e++]<<8,r=t[e++]|t[e++]<<8,i=t[e++],o=i>>7,a=1<<(7&i)+1;t[e++];t[e++];var s=null;o&&(s=e,e+=3*a);var l=!0,h=[],u=0,c=null,f=0,p=null;for(this.width=n,this.height=r;l&&e<t.length;)switch(t[e++]){case 33:switch(t[e++]){case 255:if(11!==t[e]||78==t[e+1]&&69==t[e+2]&&84==t[e+3]&&83==t[e+4]&&67==t[e+5]&&65==t[e+6]&&80==t[e+7]&&69==t[e+8]&&50==t[e+9]&&46==t[e+10]&&48==t[e+11]&&3==t[e+12]&&1==t[e+13]&&0==t[e+16])e+=14,p=t[e++]|t[e++]<<8,e++;else for(e+=12;;){if(0===(S=t[e++]))break;e+=S}break;case 249:if(4!==t[e++]||0!==t[e+4])throw"Invalid graphics extension block.";var d=t[e++];u=t[e++]|t[e++]<<8,c=t[e++],0==(1&d)&&(c=null),f=d>>2&7,e++;break;case 254:for(;;){if(0===(S=t[e++]))break;e+=S}break;default:throw"Unknown graphic control label: 0x"+t[e-1].toString(16)}break;case 44:var g=t[e++]|t[e++]<<8,m=t[e++]|t[e++]<<8,y=t[e++]|t[e++]<<8,v=t[e++]|t[e++]<<8,w=t[e++],x=w>>6&1,N=s,L=!1;if(w>>7){L=!0;N=e,e+=3*(1<<(7&w)+1)}var A=e;for(e++;;){var S;if(0===(S=t[e++]))break;e+=S}h.push({x:g,y:m,width:y,height:v,has_local_palette:L,palette_offset:N,data_offset:A,data_length:e-A,transparent_index:c,interlaced:!!x,delay:u,disposal:f});break;case 59:l=!1;break;default:throw"Unknown gif block: 0x"+t[e-1].toString(16)}this.numFrames=function(){return h.length},this.loopCount=function(){return p},this.frameInfo=function(t){if(t<0||t>=h.length)throw"Frame index out of range.";return h[t]},this.decodeAndBlitFrameBGRA=function(e,r){var i=this.frameInfo(e),o=i.width*i.height,a=new Uint8Array(o);b(t,i.data_offset,a,o);var s=i.palette_offset,l=i.transparent_index;null===l&&(l=256);var h=i.width,u=n-h,c=h,f=4*(i.y*n+i.x),p=4*((i.y+i.height)*n+i.x),d=f,g=4*u;!0===i.interlaced&&(g+=4*(h+u)*7);for(var m=8,y=0,v=a.length;y<v;++y){var w=a[y];if(0===c&&(c=h,(d+=g)>=p&&(g=u+4*(h+u)*(m-1),d=f+(h+u)*(m<<1),m>>=1)),w===l)d+=4;else{var x=t[s+3*w],N=t[s+3*w+1],L=t[s+3*w+2];r[d++]=L,r[d++]=N,r[d++]=x,r[d++]=255}--c}},this.decodeAndBlitFrameRGBA=function(e,r){var i=this.frameInfo(e),o=i.width*i.height,a=new Uint8Array(o);b(t,i.data_offset,a,o);var s=i.palette_offset,l=i.transparent_index;null===l&&(l=256);var h=i.width,u=n-h,c=h,f=4*(i.y*n+i.x),p=4*((i.y+i.height)*n+i.x),d=f,g=4*u;!0===i.interlaced&&(g+=4*(h+u)*7);for(var m=8,y=0,v=a.length;y<v;++y){var w=a[y];if(0===c&&(c=h,(d+=g)>=p&&(g=u+4*(h+u)*(m-1),d=f+(h+u)*(m<<1),m>>=1)),w===l)d+=4;else{var x=t[s+3*w],N=t[s+3*w+1],L=t[s+3*w+2];r[d++]=x,r[d++]=N,r[d++]=L,r[d++]=255}--c}}}function b(t,e,n,r){for(var i=t[e++],o=1<<i,a=o+1,s=a+1,l=i+1,h=(1<<l)-1,u=0,c=0,f=0,p=t[e++],d=new Int32Array(4096),g=null;;){for(;u<16&&0!==p;)c|=t[e++]<<u,u+=8,1===p?p=t[e++]:--p;if(u<l)break;var m=c&h;if(c>>=l,u-=l,m!==o){if(m===a)break;for(var y=m<s?m:g,v=0,w=y;w>o;)w=d[w]>>8,++v;var b=w;if(f+v+(y!==m?1:0)>r)return void console.log("Warning, gif stream longer than expected.");n[f++]=b;var x=f+=v;for(y!==m&&(n[f++]=b),w=y;v--;)w=d[w],n[--x]=255&w,w>>=8;null!==g&&s<4096&&(d[s++]=g<<8|b,s>=h+1&&l<12&&(++l,h=h<<1|1)),g=m}else s=a+1,h=(1<<(l=i+1))-1,g=null}return f!==r&&console.log("Warning, gif stream shorter than expected."),n}try{exports.GifWriter=function(t,e,n,r){var i=0,o=void 0===(r=void 0===r?{}:r).loop?null:r.loop,a=void 0===r.palette?null:r.palette;if(e<=0||n<=0||e>65535||n>65535)throw"Width/Height invalid.";function s(t){var e=t.length;if(e<2||e>256||e&e-1)throw"Invalid code/color length, must be power of 2 and 2 .. 256.";return e}t[i++]=71,t[i++]=73,t[i++]=70,t[i++]=56,t[i++]=57,t[i++]=97;var l=0,h=0;if(null!==a){for(var u=s(a);u>>=1;)++l;if(u=1<<l,--l,void 0!==r.background){if((h=r.background)>=u)throw"Background index out of range.";if(0===h)throw"Background index explicitly passed as 0."}}if(t[i++]=255&e,t[i++]=e>>8&255,t[i++]=255&n,t[i++]=n>>8&255,t[i++]=(null!==a?128:0)|l,t[i++]=h,t[i++]=0,null!==a)for(var c=0,f=a.length;c<f;++c){var p=a[c];t[i++]=p>>16&255,t[i++]=p>>8&255,t[i++]=255&p}if(null!==o){if(o<0||o>65535)throw"Loop count invalid.";t[i++]=33,t[i++]=255,t[i++]=11,t[i++]=78,t[i++]=69,t[i++]=84,t[i++]=83,t[i++]=67,t[i++]=65,t[i++]=80,t[i++]=69,t[i++]=50,t[i++]=46,t[i++]=48,t[i++]=3,t[i++]=1,t[i++]=255&o,t[i++]=o>>8&255,t[i++]=0}var d=!1;this.addFrame=function(e,n,r,o,l,h){if(!0===d&&(--i,d=!1),h=void 0===h?{}:h,e<0||n<0||e>65535||n>65535)throw"x/y invalid.";if(r<=0||o<=0||r>65535||o>65535)throw"Width/Height invalid.";if(l.length<r*o)throw"Not enough pixels for the frame size.";var u=!0,c=h.palette;if(null==c&&(u=!1,c=a),null==c)throw"Must supply either a local or global palette.";for(var f=s(c),p=0;f>>=1;)++p;f=1<<p;var g=void 0===h.delay?0:h.delay,m=void 0===h.disposal?0:h.disposal;if(m<0||m>3)throw"Disposal out of range.";var y=!1,v=0;if(void 0!==h.transparent&&null!==h.transparent&&(y=!0,(v=h.transparent)<0||v>=f))throw"Transparent color index.";if((0!==m||y||0!==g)&&(t[i++]=33,t[i++]=249,t[i++]=4,t[i++]=m<<2|(!0===y?1:0),t[i++]=255&g,t[i++]=g>>8&255,t[i++]=v,t[i++]=0),t[i++]=44,t[i++]=255&e,t[i++]=e>>8&255,t[i++]=255&n,t[i++]=n>>8&255,t[i++]=255&r,t[i++]=r>>8&255,t[i++]=255&o,t[i++]=o>>8&255,t[i++]=!0===u?128|p-1:0,!0===u)for(var w=0,b=c.length;w<b;++w){var x=c[w];t[i++]=x>>16&255,t[i++]=x>>8&255,t[i++]=255&x}i=function(t,e,n,r){t[e++]=n;var i=e++,o=1<<n,a=o-1,s=o+1,l=s+1,h=n+1,u=0,c=0;function f(n){for(;u>=n;)t[e++]=255&c,c>>=8,u-=8,e===i+256&&(t[i]=255,i=e++)}function p(t){c|=t<<u,u+=h,f(8)}var d=r[0]&a,g={};p(o);for(var m=1,y=r.length;m<y;++m){var v=r[m]&a,w=d<<8|v,b=g[w];if(void 0===b){for(c|=d<<u,u+=h;u>=8;)t[e++]=255&c,c>>=8,u-=8,e===i+256&&(t[i]=255,i=e++);4096===l?(p(o),l=s+1,h=n+1,g={}):(l>=1<<h&&++h,g[w]=l++),d=v}else d=b}return p(d),p(s),f(1),i+1===e?t[i]=0:(t[i]=e-i-1,t[e++]=0),e}(t,i,p<2?2:p,l)},this.end=function(){return!1===d&&(t[i++]=59,d=!0),i}},exports.GifReader=w}catch(t){}function x(t){var e,n,r,i,o,a=Math.floor,s=new Array(64),l=new Array(64),h=new Array(64),u=new Array(64),c=new Array(65535),f=new Array(65535),p=new Array(64),d=new Array(64),g=[],m=0,y=7,v=new Array(64),w=new Array(64),b=new Array(64),x=new Array(256),N=new Array(2048),L=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],A=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],S=[0,1,2,3,4,5,6,7,8,9,10,11],_=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],F=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],P=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],k=[0,1,2,3,4,5,6,7,8,9,10,11],I=[0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119],C=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250];function B(t,e){for(var n=0,r=0,i=new Array,o=1;o<=16;o++){for(var a=1;a<=t[o];a++)i[e[r]]=[],i[e[r]][0]=n,i[e[r]][1]=o,r++,n++;n*=2}return i}function j(t){for(var e=t[0],n=t[1]-1;n>=0;)e&1<<n&&(m|=1<<y),n--,--y<0&&(255==m?(E(255),E(0)):E(m),y=7,m=0)}function E(t){g.push(t)}function M(t){E(t>>8&255),E(255&t)}function O(t,e,n,r,i){for(var o,a=i[0],s=i[240],l=function(t,e){var n,r,i,o,a,s,l,h,u,c,f=0;for(u=0;u<8;++u){n=t[f],r=t[f+1],i=t[f+2],o=t[f+3],a=t[f+4],s=t[f+5],l=t[f+6];var d=n+(h=t[f+7]),g=n-h,m=r+l,y=r-l,v=i+s,w=i-s,b=o+a,x=o-a,N=d+b,L=d-b,A=m+v,S=m-v;t[f]=N+A,t[f+4]=N-A;var _=.707106781*(S+L);t[f+2]=L+_,t[f+6]=L-_;var F=.382683433*((N=x+w)-(S=y+g)),P=.5411961*N+F,k=1.306562965*S+F,I=.707106781*(A=w+y),C=g+I,B=g-I;t[f+5]=B+P,t[f+3]=B-P,t[f+1]=C+k,t[f+7]=C-k,f+=8}for(f=0,u=0;u<8;++u){n=t[f],r=t[f+8],i=t[f+16],o=t[f+24],a=t[f+32],s=t[f+40],l=t[f+48];var j=n+(h=t[f+56]),E=n-h,M=r+l,O=r-l,q=i+s,T=i-s,R=o+a,D=o-a,U=j+R,z=j-R,H=M+q,W=M-q;t[f]=U+H,t[f+32]=U-H;var V=.707106781*(W+z);t[f+16]=z+V,t[f+48]=z-V;var G=.382683433*((U=D+T)-(W=O+E)),Y=.5411961*U+G,J=1.306562965*W+G,X=.707106781*(H=T+O),K=E+X,Z=E-X;t[f+40]=Z+Y,t[f+24]=Z-Y,t[f+8]=K+J,t[f+56]=K-J,f++}for(u=0;u<64;++u)c=t[u]*e[u],p[u]=c>0?c+.5|0:c-.5|0;return p}(t,e),h=0;h<64;++h)d[L[h]]=l[h];var u=d[0]-n;n=d[0],0==u?j(r[0]):(j(r[f[o=32767+u]]),j(c[o]));for(var g=63;g>0&&0==d[g];g--);if(0==g)return j(a),n;for(var m,y=1;y<=g;){for(var v=y;0==d[y]&&y<=g;++y);var w=y-v;if(w>=16){m=w>>4;for(var b=1;b<=m;++b)j(s);w&=15}o=32767+d[y],j(i[(w<<4)+f[o]]),j(c[o]),y++}return 63!=g&&j(a),n}function q(t){if(t<=0&&(t=1),t>100&&(t=100),o!=t){(function(t){for(var e=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99],n=0;n<64;n++){var r=a((e[n]*t+50)/100);r<1?r=1:r>255&&(r=255),s[L[n]]=r}for(var i=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99],o=0;o<64;o++){var c=a((i[o]*t+50)/100);c<1?c=1:c>255&&(c=255),l[L[o]]=c}for(var f=[1,1.387039845,1.306562965,1.175875602,1,.785694958,.5411961,.275899379],p=0,d=0;d<8;d++)for(var g=0;g<8;g++)h[p]=1/(s[L[p]]*f[d]*f[g]*8),u[p]=1/(l[L[p]]*f[d]*f[g]*8),p++})(t<50?Math.floor(5e3/t):Math.floor(200-2*t)),o=t}}this.encode=function(t,o){(new Date).getTime();o&&q(o),g=new Array,m=0,y=7,M(65496),M(65504),M(16),E(74),E(70),E(73),E(70),E(0),E(1),E(1),E(0),M(1),M(1),E(0),E(0),function(){M(65499),M(132),E(0);for(var t=0;t<64;t++)E(s[t]);E(1);for(var e=0;e<64;e++)E(l[e])}(),function(t,e){M(65472),M(17),E(8),M(e),M(t),E(3),E(1),E(17),E(0),E(2),E(17),E(1),E(3),E(17),E(1)}(t.width,t.height),function(){M(65476),M(418),E(0);for(var t=0;t<16;t++)E(A[t+1]);for(var e=0;e<=11;e++)E(S[e]);E(16);for(var n=0;n<16;n++)E(_[n+1]);for(var r=0;r<=161;r++)E(F[r]);E(1);for(var i=0;i<16;i++)E(P[i+1]);for(var o=0;o<=11;o++)E(k[o]);E(17);for(var a=0;a<16;a++)E(I[a+1]);for(var s=0;s<=161;s++)E(C[s])}(),M(65498),M(12),E(3),E(1),E(0),E(2),E(17),E(3),E(17),E(0),E(63),E(0);var a=0,c=0,f=0;m=0,y=7,this.encode.displayName="_encode_";for(var p,d,x,L,B,T,R,D,U,z=t.data,H=t.width,W=t.height,V=4*H,G=0;G<W;){for(p=0;p<V;){for(T=B=V*G+p,R=-1,D=0,U=0;U<64;U++)T=B+(D=U>>3)*V+(R=4*(7&U)),G+D>=W&&(T-=V*(G+1+D-W)),p+R>=V&&(T-=p+R-V+4),d=z[T++],x=z[T++],L=z[T++],v[U]=(N[d]+N[x+256>>0]+N[L+512>>0]>>16)-128,w[U]=(N[d+768>>0]+N[x+1024>>0]+N[L+1280>>0]>>16)-128,b[U]=(N[d+1280>>0]+N[x+1536>>0]+N[L+1792>>0]>>16)-128;a=O(v,h,a,e,r),c=O(w,u,c,n,i),f=O(b,u,f,n,i),p+=32}G+=8}if(y>=0){var Y=[];Y[1]=y+1,Y[0]=(1<<y+1)-1,j(Y)}return M(65497),new Uint8Array(g)},function(){(new Date).getTime();t||(t=50),function(){for(var t=String.fromCharCode,e=0;e<256;e++)x[e]=t(e)}(),e=B(A,S),n=B(P,k),r=B(_,F),i=B(I,C),function(){for(var t=1,e=2,n=1;n<=15;n++){for(var r=t;r<e;r++)f[32767+r]=n,c[32767+r]=[],c[32767+r][1]=n,c[32767+r][0]=r;for(var i=-(e-1);i<=-t;i++)f[32767+i]=n,c[32767+i]=[],c[32767+i][1]=n,c[32767+i][0]=e-1+i;t<<=1,e<<=1}}(),function(){for(var t=0;t<256;t++)N[t]=19595*t,N[t+256>>0]=38470*t,N[t+512>>0]=7471*t+32768,N[t+768>>0]=-11059*t,N[t+1024>>0]=-21709*t,N[t+1280>>0]=32768*t+8421375,N[t+1536>>0]=-27439*t,N[t+1792>>0]=-5329*t}(),q(t),(new Date).getTime()}()}function N(t,e){if(this.pos=0,this.buffer=t,this.datav=new DataView(t.buffer),this.is_with_alpha=!!e,this.bottom_up=!0,this.flag=String.fromCharCode(this.buffer[0])+String.fromCharCode(this.buffer[1]),this.pos+=2,-1===["BM","BA","CI","CP","IC","PT"].indexOf(this.flag))throw new Error("Invalid BMP File");this.parseHeader(),this.parseBGR()}window.tmp=w,function(t,e){t.API.adler32cs=function(){var t="function"==typeof ArrayBuffer&&"function"==typeof Uint8Array,e=null,n=function(){if(!t)return function(){return!1};try{var n={};"function"==typeof n.Buffer&&(e=n.Buffer)}catch(t){}return function(t){return t instanceof ArrayBuffer||null!==e&&t instanceof e}}(),r=null!==e?function(t){return new e(t,"utf8").toString("binary")}:function(t){return unescape(encodeURIComponent(t))},i=function(t,e){for(var n=65535&t,r=t>>>16,i=0,o=e.length;i<o;i++)n=(n+(255&e.charCodeAt(i)))%65521,r=(r+n)%65521;return(r<<16|n)>>>0},o=function(t,e){for(var n=65535&t,r=t>>>16,i=0,o=e.length;i<o;i++)n=(n+e[i])%65521,r=(r+n)%65521;return(r<<16|n)>>>0},a={},s=a.Adler32=(c=function(t){if(!(this instanceof c))throw new TypeError("Constructor cannot called be as a function.");if(!isFinite(t=null==t?1:+t))throw new Error("First arguments needs to be a finite number.");this.checksum=t>>>0},f=c.prototype={},f.constructor=c,c.from=((l=function(t){if(!(this instanceof c))throw new TypeError("Constructor cannot called be as a function.");if(null==t)throw new Error("First argument needs to be a string.");this.checksum=i(1,t.toString())}).prototype=f,l),c.fromUtf8=((h=function(t){if(!(this instanceof c))throw new TypeError("Constructor cannot called be as a function.");if(null==t)throw new Error("First argument needs to be a string.");var e=r(t.toString());this.checksum=i(1,e)}).prototype=f,h),t&&(c.fromBuffer=((u=function(t){if(!(this instanceof c))throw new TypeError("Constructor cannot called be as a function.");if(!n(t))throw new Error("First argument needs to be ArrayBuffer.");var e=new Uint8Array(t);return this.checksum=o(1,e)}).prototype=f,u)),f.update=function(t){if(null==t)throw new Error("First argument needs to be a string.");return t=t.toString(),this.checksum=i(this.checksum,t)},f.updateUtf8=function(t){if(null==t)throw new Error("First argument needs to be a string.");var e=r(t.toString());return this.checksum=i(this.checksum,e)},t&&(f.updateBuffer=function(t){if(!n(t))throw new Error("First argument needs to be ArrayBuffer.");var e=new Uint8Array(t);return this.checksum=o(this.checksum,e)}),f.clone=function(){return new s(this.checksum)},c);var l,h,u,c,f;a.from=function(t){if(null==t)throw new Error("First argument needs to be a string.");return i(1,t.toString())},a.fromUtf8=function(t){if(null==t)throw new Error("First argument needs to be a string.");var e=r(t.toString());return i(1,e)},t&&(a.fromBuffer=function(t){if(!n(t))throw new Error("First argument need to be ArrayBuffer.");var e=new Uint8Array(t);return o(1,e)});return a}()}(y),function(t){t.__bidiEngine__=t.prototype.__bidiEngine__=function(t){var n,r,i,o,a,s,l,h=e,u=[[0,3,0,1,0,0,0],[0,3,0,1,2,2,0],[0,3,0,17,2,0,1],[0,3,5,5,4,1,0],[0,3,21,21,4,0,1],[0,3,5,5,4,2,0]],c=[[2,0,1,1,0,1,0],[2,0,1,1,0,2,0],[2,0,2,1,3,2,0],[2,0,2,33,3,1,1]],f={L:0,R:1,EN:2,AN:3,N:4,B:5,S:6},p={0:0,5:1,6:2,7:3,32:4,251:5,254:6,255:7},d=["(",")","(","<",">","<","[","]","[","{","}","{","«","»","«","‹","›","‹","⁅","⁆","⁅","⁽","⁾","⁽","₍","₎","₍","≤","≥","≤","〈","〉","〈","﹙","﹚","﹙","﹛","﹜","﹛","﹝","﹞","﹝","﹤","﹥","﹤"],g=new RegExp(/^([1-4|9]|1[0-9]|2[0-9]|3[0168]|4[04589]|5[012]|7[78]|159|16[0-9]|17[0-2]|21[569]|22[03489]|250)$/),m=!1,y=0;this.__bidiEngine__={};var v=function(t){var e=t.charCodeAt(),n=e>>8,r=p[n];return void 0!==r?h[256*r+(255&e)]:252===n||253===n?"AL":g.test(n)?"L":8===n?"R":"N"},w=function(t){for(var e,n=0;n<t.length;n++){if("L"===(e=v(t.charAt(n))))return!1;if("R"===e)return!0}return!1},b=function(t,e,a,s){var l,h,u,c,f=e[s];switch(f){case"L":case"R":m=!1;break;case"N":case"AN":break;case"EN":m&&(f="AN");break;case"AL":m=!0,f="R";break;case"WS":f="N";break;case"CS":s<1||s+1>=e.length||"EN"!==(l=a[s-1])&&"AN"!==l||"EN"!==(h=e[s+1])&&"AN"!==h?f="N":m&&(h="AN"),f=h===l?h:"N";break;case"ES":f="EN"===(l=s>0?a[s-1]:"B")&&s+1<e.length&&"EN"===e[s+1]?"EN":"N";break;case"ET":if(s>0&&"EN"===a[s-1]){f="EN";break}if(m){f="N";break}for(u=s+1,c=e.length;u<c&&"ET"===e[u];)u++;f=u<c&&"EN"===e[u]?"EN":"N";break;case"NSM":if(i&&!o){for(c=e.length,u=s+1;u<c&&"NSM"===e[u];)u++;if(u<c){var p=t[s],d=p>=1425&&p<=2303||64286===p;if(l=e[u],d&&("R"===l||"AL"===l)){f="R";break}}}f=s<1||"B"===(l=e[s-1])?"N":a[s-1];break;case"B":m=!1,n=!0,f=y;break;case"S":r=!0,f="N";break;case"LRE":case"RLE":case"LRO":case"RLO":case"PDF":m=!1;break;case"BN":f="N"}return f},x=function(t,e,n){var r=t.split("");return n&&N(r,n,{hiLevel:y}),r.reverse(),e&&e.reverse(),r.join("")},N=function(t,e,i){var o,a,s,l,h,p=-1,d=t.length,g=0,w=[],x=y?c:u,N=[];for(m=!1,n=!1,r=!1,a=0;a<d;a++)N[a]=v(t[a]);for(s=0;s<d;s++){if(h=g,w[s]=b(t,N,w,s),o=240&(g=x[h][f[w[s]]]),g&=15,e[s]=l=x[g][5],o>0)if(16===o){for(a=p;a<s;a++)e[a]=1;p=-1}else p=-1;if(x[g][6])-1===p&&(p=s);else if(p>-1){for(a=p;a<s;a++)e[a]=l;p=-1}"B"===N[s]&&(e[s]=0),i.hiLevel|=l}r&&function(t,e,n){for(var r=0;r<n;r++)if("S"===t[r]){e[r]=y;for(var i=r-1;i>=0&&"WS"===t[i];i--)e[i]=y}}(N,e,d)},L=function(t,e,r,i,o){if(!(o.hiLevel<t)){if(1===t&&1===y&&!n)return e.reverse(),void(r&&r.reverse());for(var a,s,l,h,u=e.length,c=0;c<u;){if(i[c]>=t){for(l=c+1;l<u&&i[l]>=t;)l++;for(h=c,s=l-1;h<s;h++,s--)a=e[h],e[h]=e[s],e[s]=a,r&&(a=r[h],r[h]=r[s],r[s]=a);c=l}c++}}},A=function(t,e,n){var r=t.split(""),i={hiLevel:y};return n||(n=[]),N(r,n,i),function(t,e,n){if(0!==n.hiLevel&&l)for(var r,i=0;i<t.length;i++)1===e[i]&&(r=d.indexOf(t[i]))>=0&&(t[i]=d[r+1])}(r,n,i),L(2,r,e,n,i),L(1,r,e,n,i),r.join("")};return this.__bidiEngine__.doBidiReorder=function(t,e,n){if(function(t,e){if(e)for(var n=0;n<t.length;n++)e[n]=n;void 0===o&&(o=w(t)),void 0===s&&(s=w(t))}(t,e),i||!a||s)if(i&&a&&o^s)y=o?1:0,t=x(t,e,n);else if(!i&&a&&s)y=o?1:0,t=A(t,e,n),t=x(t,e);else if(!i||o||a||s){if(i&&!a&&o^s)t=x(t,e),o?(y=0,t=A(t,e,n)):(y=1,t=A(t,e,n),t=x(t,e));else if(i&&o&&!a&&s)y=1,t=A(t,e,n),t=x(t,e);else if(!i&&!a&&o^s){var r=l;o?(y=1,t=A(t,e,n),y=0,l=!1,t=A(t,e,n),l=r):(y=0,t=A(t,e,n),t=x(t,e),y=1,l=!1,t=A(t,e,n),l=r,t=x(t,e))}}else y=0,t=A(t,e,n);else y=o?1:0,t=A(t,e,n);return t},this.__bidiEngine__.setOptions=function(t){t&&(i=t.isInputVisual,a=t.isOutputVisual,o=t.isInputRtl,s=t.isOutputRtl,l=t.isSymmetricSwapping)},this.__bidiEngine__.setOptions(t),this.__bidiEngine__};var e=["BN","BN","BN","BN","BN","BN","BN","BN","BN","S","B","S","WS","B","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","B","B","B","S","WS","N","N","ET","ET","ET","N","N","N","N","N","ES","CS","ES","CS","CS","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","CS","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","BN","BN","BN","BN","BN","BN","B","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","CS","N","ET","ET","ET","ET","N","N","N","N","L","N","N","BN","N","N","ET","ET","EN","EN","N","L","N","N","N","EN","L","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","N","N","N","N","N","ET","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","R","NSM","R","NSM","NSM","R","NSM","NSM","R","NSM","N","N","N","N","N","N","N","N","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","N","N","N","N","N","R","R","R","R","R","N","N","N","N","N","N","N","N","N","N","N","AN","AN","AN","AN","AN","AN","N","N","AL","ET","ET","AL","CS","AL","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AL","AL","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AN","AN","AN","AN","AN","AN","AN","AN","AN","AN","ET","AN","AN","AL","AL","AL","NSM","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AN","N","NSM","NSM","NSM","NSM","NSM","NSM","AL","AL","NSM","NSM","N","NSM","NSM","NSM","NSM","AL","AL","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","AL","AL","NSM","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AL","N","N","N","N","N","N","N","N","N","N","N","N","N","N","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","R","R","N","N","N","N","R","N","N","N","N","N","WS","WS","WS","WS","WS","WS","WS","WS","WS","WS","WS","BN","BN","BN","L","R","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","WS","B","LRE","RLE","PDF","LRO","RLO","CS","ET","ET","ET","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","CS","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","WS","BN","BN","BN","BN","BN","N","LRI","RLI","FSI","PDI","BN","BN","BN","BN","BN","BN","EN","L","N","N","EN","EN","EN","EN","EN","EN","ES","ES","N","N","N","L","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","ES","ES","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","L","L","N","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","N","N","N","N","N","R","NSM","R","R","R","R","R","R","R","R","R","R","ES","R","R","R","R","R","R","R","R","R","R","R","R","R","N","R","R","R","R","R","N","R","N","R","R","N","R","R","N","R","R","R","R","R","R","R","R","R","R","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","CS","N","CS","N","N","CS","N","N","N","N","N","N","N","N","N","ET","N","N","ES","ES","N","N","N","N","N","ET","ET","N","N","N","N","N","AL","AL","AL","AL","AL","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","N","BN","N","N","N","ET","ET","ET","N","N","N","N","N","ES","CS","ES","CS","CS","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","CS","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","L","L","L","L","L","L","N","N","L","L","L","L","L","L","N","N","L","L","L","L","L","L","N","N","L","L","L","N","N","N","ET","ET","N","N","N","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N"],n=new t.__bidiEngine__({isInputVisual:!0});t.API.events.push(["postProcessText",function(t){var e=t.text,r=(t.x,t.y,t.options||{}),i=(t.mutex,r.lang,[]);if("[object Array]"===Object.prototype.toString.call(e)){var o=0;for(i=[],o=0;o<e.length;o+=1)"[object Array]"===Object.prototype.toString.call(e[o])?i.push([n.doBidiReorder(e[o][0]),e[o][1],e[o][2]]):i.push([n.doBidiReorder(e[o])]);t.text=i}else t.text=n.doBidiReorder(e)}])}(y),window.tmp=x,N.prototype.parseHeader=function(){if(this.fileSize=this.datav.getUint32(this.pos,!0),this.pos+=4,this.reserved=this.datav.getUint32(this.pos,!0),this.pos+=4,this.offset=this.datav.getUint32(this.pos,!0),this.pos+=4,this.headerSize=this.datav.getUint32(this.pos,!0),this.pos+=4,this.width=this.datav.getUint32(this.pos,!0),this.pos+=4,this.height=this.datav.getInt32(this.pos,!0),this.pos+=4,this.planes=this.datav.getUint16(this.pos,!0),this.pos+=2,this.bitPP=this.datav.getUint16(this.pos,!0),this.pos+=2,this.compress=this.datav.getUint32(this.pos,!0),this.pos+=4,this.rawSize=this.datav.getUint32(this.pos,!0),this.pos+=4,this.hr=this.datav.getUint32(this.pos,!0),this.pos+=4,this.vr=this.datav.getUint32(this.pos,!0),this.pos+=4,this.colors=this.datav.getUint32(this.pos,!0),this.pos+=4,this.importantColors=this.datav.getUint32(this.pos,!0),this.pos+=4,16===this.bitPP&&this.is_with_alpha&&(this.bitPP=15),this.bitPP<15){var t=0===this.colors?1<<this.bitPP:this.colors;this.palette=new Array(t);for(var e=0;e<t;e++){var n=this.datav.getUint8(this.pos++,!0),r=this.datav.getUint8(this.pos++,!0),i=this.datav.getUint8(this.pos++,!0),o=this.datav.getUint8(this.pos++,!0);this.palette[e]={red:i,green:r,blue:n,quad:o}}}this.height<0&&(this.height*=-1,this.bottom_up=!1)},N.prototype.parseBGR=function(){this.pos=this.offset;try{var t="bit"+this.bitPP,e=this.width*this.height*4;this.data=new Uint8Array(e),this[t]()}catch(t){console.log("bit decode error:"+t)}},N.prototype.bit1=function(){var t=Math.ceil(this.width/8),e=t%4,n=this.height>=0?this.height-1:-this.height;for(n=this.height-1;n>=0;n--){for(var r=this.bottom_up?n:this.height-1-n,i=0;i<t;i++)for(var o=this.datav.getUint8(this.pos++,!0),a=r*this.width*4+8*i*4,s=0;s<8&&8*i+s<this.width;s++){var l=this.palette[o>>7-s&1];this.data[a+4*s]=l.blue,this.data[a+4*s+1]=l.green,this.data[a+4*s+2]=l.red,this.data[a+4*s+3]=255}0!=e&&(this.pos+=4-e)}},N.prototype.bit4=function(){for(var t=Math.ceil(this.width/2),e=t%4,n=this.height-1;n>=0;n--){for(var r=this.bottom_up?n:this.height-1-n,i=0;i<t;i++){var o=this.datav.getUint8(this.pos++,!0),a=r*this.width*4+2*i*4,s=o>>4,l=15&o,h=this.palette[s];if(this.data[a]=h.blue,this.data[a+1]=h.green,this.data[a+2]=h.red,this.data[a+3]=255,2*i+1>=this.width)break;h=this.palette[l],this.data[a+4]=h.blue,this.data[a+4+1]=h.green,this.data[a+4+2]=h.red,this.data[a+4+3]=255}0!=e&&(this.pos+=4-e)}},N.prototype.bit8=function(){for(var t=this.width%4,e=this.height-1;e>=0;e--){for(var n=this.bottom_up?e:this.height-1-e,r=0;r<this.width;r++){var i=this.datav.getUint8(this.pos++,!0),o=n*this.width*4+4*r;if(i<this.palette.length){var a=this.palette[i];this.data[o]=a.red,this.data[o+1]=a.green,this.data[o+2]=a.blue,this.data[o+3]=255}else this.data[o]=255,this.data[o+1]=255,this.data[o+2]=255,this.data[o+3]=255}0!=t&&(this.pos+=4-t)}},N.prototype.bit15=function(){for(var t=this.width%3,e=parseInt("11111",2),n=this.height-1;n>=0;n--){for(var r=this.bottom_up?n:this.height-1-n,i=0;i<this.width;i++){var o=this.datav.getUint16(this.pos,!0);this.pos+=2;var a=(o&e)/e*255|0,s=(o>>5&e)/e*255|0,l=(o>>10&e)/e*255|0,h=o>>15?255:0,u=r*this.width*4+4*i;this.data[u]=l,this.data[u+1]=s,this.data[u+2]=a,this.data[u+3]=h}this.pos+=t}},N.prototype.bit16=function(){for(var t=this.width%3,e=parseInt("11111",2),n=parseInt("111111",2),r=this.height-1;r>=0;r--){for(var i=this.bottom_up?r:this.height-1-r,o=0;o<this.width;o++){var a=this.datav.getUint16(this.pos,!0);this.pos+=2;var s=(a&e)/e*255|0,l=(a>>5&n)/n*255|0,h=(a>>11)/e*255|0,u=i*this.width*4+4*o;this.data[u]=h,this.data[u+1]=l,this.data[u+2]=s,this.data[u+3]=255}this.pos+=t}},N.prototype.bit24=function(){for(var t=this.height-1;t>=0;t--){for(var e=this.bottom_up?t:this.height-1-t,n=0;n<this.width;n++){var r=this.datav.getUint8(this.pos++,!0),i=this.datav.getUint8(this.pos++,!0),o=this.datav.getUint8(this.pos++,!0),a=e*this.width*4+4*n;this.data[a]=o,this.data[a+1]=i,this.data[a+2]=r,this.data[a+3]=255}this.pos+=this.width%4}},N.prototype.bit32=function(){for(var t=this.height-1;t>=0;t--)for(var e=this.bottom_up?t:this.height-1-t,n=0;n<this.width;n++){var r=this.datav.getUint8(this.pos++,!0),i=this.datav.getUint8(this.pos++,!0),o=this.datav.getUint8(this.pos++,!0),a=this.datav.getUint8(this.pos++,!0),s=e*this.width*4+4*n;this.data[s]=o,this.data[s+1]=i,this.data[s+2]=r,this.data[s+3]=a}},N.prototype.getData=function(){return this.data},window.tmp=N,function(t){var e=15,n=30,r=19,i=256,o=i+1+29,a=2*o+1,s=256,l=16,h=17,u=18,c=16,f=-1,p=1,d=2,g=0,m=0,y=1,v=3,w=4,b=0,x=1,N=2,L=-2,A=-3,S=-5,_=[0,1,2,3,4,4,5,5,6,6,6,6,7,7,7,7,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,0,0,16,17,18,18,19,19,20,20,20,20,21,21,21,21,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29];function F(){var t=this;function n(t,e){var n=0;do{n|=1&t,t>>>=1,n<<=1}while(--e>0);return n>>>1}t.build_tree=function(r){var i,o,s,l=t.dyn_tree,h=t.stat_desc.static_tree,u=t.stat_desc.elems,c=-1;for(r.heap_len=0,r.heap_max=a,i=0;i<u;i++)0!==l[2*i]?(r.heap[++r.heap_len]=c=i,r.depth[i]=0):l[2*i+1]=0;for(;r.heap_len<2;)l[2*(s=r.heap[++r.heap_len]=c<2?++c:0)]=1,r.depth[s]=0,r.opt_len--,h&&(r.static_len-=h[2*s+1]);for(t.max_code=c,i=Math.floor(r.heap_len/2);i>=1;i--)r.pqdownheap(l,i);s=u;do{i=r.heap[1],r.heap[1]=r.heap[r.heap_len--],r.pqdownheap(l,1),o=r.heap[1],r.heap[--r.heap_max]=i,r.heap[--r.heap_max]=o,l[2*s]=l[2*i]+l[2*o],r.depth[s]=Math.max(r.depth[i],r.depth[o])+1,l[2*i+1]=l[2*o+1]=s,r.heap[1]=s++,r.pqdownheap(l,1)}while(r.heap_len>=2);r.heap[--r.heap_max]=r.heap[1],function(n){var r,i,o,s,l,h,u=t.dyn_tree,c=t.stat_desc.static_tree,f=t.stat_desc.extra_bits,p=t.stat_desc.extra_base,d=t.stat_desc.max_length,g=0;for(s=0;s<=e;s++)n.bl_count[s]=0;for(u[2*n.heap[n.heap_max]+1]=0,r=n.heap_max+1;r<a;r++)(s=u[2*u[2*(i=n.heap[r])+1]+1]+1)>d&&(s=d,g++),u[2*i+1]=s,i>t.max_code||(n.bl_count[s]++,l=0,i>=p&&(l=f[i-p]),h=u[2*i],n.opt_len+=h*(s+l),c&&(n.static_len+=h*(c[2*i+1]+l)));if(0!==g){do{for(s=d-1;0===n.bl_count[s];)s--;n.bl_count[s]--,n.bl_count[s+1]+=2,n.bl_count[d]--,g-=2}while(g>0);for(s=d;0!==s;s--)for(i=n.bl_count[s];0!==i;)(o=n.heap[--r])>t.max_code||(u[2*o+1]!=s&&(n.opt_len+=(s-u[2*o+1])*u[2*o],u[2*o+1]=s),i--)}}(r),function(t,r,i){var o,a,s,l=[],h=0;for(o=1;o<=e;o++)l[o]=h=h+i[o-1]<<1;for(a=0;a<=r;a++)0!==(s=t[2*a+1])&&(t[2*a]=n(l[s]++,s))}(l,t.max_code,r.bl_count)}}function P(t,e,n,r,i){this.static_tree=t,this.extra_bits=e,this.extra_base=n,this.elems=r,this.max_length=i}F._length_code=[0,1,2,3,4,5,6,7,8,8,9,9,10,10,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,16,16,16,16,17,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,28],F.base_length=[0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0],F.base_dist=[0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576],F.d_code=function(t){return t<256?_[t]:_[256+(t>>>7)]},F.extra_lbits=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],F.extra_dbits=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],F.extra_blbits=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],F.bl_order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],P.static_ltree=[12,8,140,8,76,8,204,8,44,8,172,8,108,8,236,8,28,8,156,8,92,8,220,8,60,8,188,8,124,8,252,8,2,8,130,8,66,8,194,8,34,8,162,8,98,8,226,8,18,8,146,8,82,8,210,8,50,8,178,8,114,8,242,8,10,8,138,8,74,8,202,8,42,8,170,8,106,8,234,8,26,8,154,8,90,8,218,8,58,8,186,8,122,8,250,8,6,8,134,8,70,8,198,8,38,8,166,8,102,8,230,8,22,8,150,8,86,8,214,8,54,8,182,8,118,8,246,8,14,8,142,8,78,8,206,8,46,8,174,8,110,8,238,8,30,8,158,8,94,8,222,8,62,8,190,8,126,8,254,8,1,8,129,8,65,8,193,8,33,8,161,8,97,8,225,8,17,8,145,8,81,8,209,8,49,8,177,8,113,8,241,8,9,8,137,8,73,8,201,8,41,8,169,8,105,8,233,8,25,8,153,8,89,8,217,8,57,8,185,8,121,8,249,8,5,8,133,8,69,8,197,8,37,8,165,8,101,8,229,8,21,8,149,8,85,8,213,8,53,8,181,8,117,8,245,8,13,8,141,8,77,8,205,8,45,8,173,8,109,8,237,8,29,8,157,8,93,8,221,8,61,8,189,8,125,8,253,8,19,9,275,9,147,9,403,9,83,9,339,9,211,9,467,9,51,9,307,9,179,9,435,9,115,9,371,9,243,9,499,9,11,9,267,9,139,9,395,9,75,9,331,9,203,9,459,9,43,9,299,9,171,9,427,9,107,9,363,9,235,9,491,9,27,9,283,9,155,9,411,9,91,9,347,9,219,9,475,9,59,9,315,9,187,9,443,9,123,9,379,9,251,9,507,9,7,9,263,9,135,9,391,9,71,9,327,9,199,9,455,9,39,9,295,9,167,9,423,9,103,9,359,9,231,9,487,9,23,9,279,9,151,9,407,9,87,9,343,9,215,9,471,9,55,9,311,9,183,9,439,9,119,9,375,9,247,9,503,9,15,9,271,9,143,9,399,9,79,9,335,9,207,9,463,9,47,9,303,9,175,9,431,9,111,9,367,9,239,9,495,9,31,9,287,9,159,9,415,9,95,9,351,9,223,9,479,9,63,9,319,9,191,9,447,9,127,9,383,9,255,9,511,9,0,7,64,7,32,7,96,7,16,7,80,7,48,7,112,7,8,7,72,7,40,7,104,7,24,7,88,7,56,7,120,7,4,7,68,7,36,7,100,7,20,7,84,7,52,7,116,7,3,8,131,8,67,8,195,8,35,8,163,8,99,8,227,8],P.static_dtree=[0,5,16,5,8,5,24,5,4,5,20,5,12,5,28,5,2,5,18,5,10,5,26,5,6,5,22,5,14,5,30,5,1,5,17,5,9,5,25,5,5,5,21,5,13,5,29,5,3,5,19,5,11,5,27,5,7,5,23,5],P.static_l_desc=new P(P.static_ltree,F.extra_lbits,i+1,o,e),P.static_d_desc=new P(P.static_dtree,F.extra_dbits,0,n,e),P.static_bl_desc=new P(null,F.extra_blbits,0,r,7);var k=9,I=8;function C(t,e,n,r,i){this.good_length=t,this.max_lazy=e,this.nice_length=n,this.max_chain=r,this.func=i}var B=0,j=1,E=2,M=[new C(0,0,0,0,B),new C(4,4,8,4,j),new C(4,5,16,8,j),new C(4,6,32,32,j),new C(4,4,16,16,E),new C(8,16,32,32,E),new C(8,16,128,128,E),new C(8,32,128,256,E),new C(32,128,258,1024,E),new C(32,258,258,4096,E)],O=["need dictionary","stream end","","","stream error","data error","","buffer error","",""],q=0,T=1,R=2,D=3,U=32,z=42,H=113,W=666,V=8,G=0,Y=1,J=2,X=3,K=258,Z=K+X+1;function Q(t,e,n,r){var i=t[2*e],o=t[2*n];return i<o||i==o&&r[e]<=r[n]}function $(){var t,e,a,_,C,$,tt,et,nt,rt,it,ot,at,st,lt,ht,ut,ct,ft,pt,dt,gt,mt,yt,vt,wt,bt,xt,Nt,Lt,At,St,_t,Ft,Pt,kt,It,Ct,Bt,jt,Et,Mt=this,Ot=new F,qt=new F,Tt=new F;function Rt(){var t;for(t=0;t<o;t++)At[2*t]=0;for(t=0;t<n;t++)St[2*t]=0;for(t=0;t<r;t++)_t[2*t]=0;At[2*s]=1,Mt.opt_len=Mt.static_len=0,kt=Ct=0}function Dt(t,e){var n,r,i=-1,o=t[1],a=0,s=7,c=4;for(0===o&&(s=138,c=3),t[2*(e+1)+1]=65535,n=0;n<=e;n++)r=o,o=t[2*(n+1)+1],++a<s&&r==o||(a<c?_t[2*r]+=a:0!==r?(r!=i&&_t[2*r]++,_t[2*l]++):a<=10?_t[2*h]++:_t[2*u]++,a=0,i=r,0===o?(s=138,c=3):r==o?(s=6,c=3):(s=7,c=4))}function Ut(t){Mt.pending_buf[Mt.pending++]=t}function zt(t){Ut(255&t),Ut(t>>>8&255)}function Ht(t,e){var n,r=e;Et>c-r?(zt(jt|=(n=t)<<Et&65535),jt=n>>>c-Et,Et+=r-c):(jt|=t<<Et&65535,Et+=r)}function Wt(t,e){var n=2*t;Ht(65535&e[n],65535&e[n+1])}function Vt(t,e){var n,r,i=-1,o=t[1],a=0,s=7,c=4;for(0===o&&(s=138,c=3),n=0;n<=e;n++)if(r=o,o=t[2*(n+1)+1],!(++a<s&&r==o)){if(a<c)do{Wt(r,_t)}while(0!=--a);else 0!==r?(r!=i&&(Wt(r,_t),a--),Wt(l,_t),Ht(a-3,2)):a<=10?(Wt(h,_t),Ht(a-3,3)):(Wt(u,_t),Ht(a-11,7));a=0,i=r,0===o?(s=138,c=3):r==o?(s=6,c=3):(s=7,c=4)}}function Gt(){16==Et?(zt(jt),jt=0,Et=0):Et>=8&&(Ut(255&jt),jt>>>=8,Et-=8)}function Yt(t,e){var r,o,a;if(Mt.pending_buf[It+2*kt]=t>>>8&255,Mt.pending_buf[It+2*kt+1]=255&t,Mt.pending_buf[Ft+kt]=255&e,kt++,0===t?At[2*e]++:(Ct++,t--,At[2*(F._length_code[e]+i+1)]++,St[2*F.d_code(t)]++),0==(8191&kt)&&bt>2){for(r=8*kt,o=dt-ut,a=0;a<n;a++)r+=St[2*a]*(5+F.extra_dbits[a]);if(r>>>=3,Ct<Math.floor(kt/2)&&r<Math.floor(o/2))return!0}return kt==Pt-1}function Jt(t,e){var n,r,o,a,l=0;if(0!==kt)do{n=Mt.pending_buf[It+2*l]<<8&65280|255&Mt.pending_buf[It+2*l+1],r=255&Mt.pending_buf[Ft+l],l++,0===n?Wt(r,t):(Wt((o=F._length_code[r])+i+1,t),0!==(a=F.extra_lbits[o])&&Ht(r-=F.base_length[o],a),n--,Wt(o=F.d_code(n),e),0!==(a=F.extra_dbits[o])&&Ht(n-=F.base_dist[o],a))}while(l<kt);Wt(s,t),Bt=t[2*s+1]}function Xt(){Et>8?zt(jt):Et>0&&Ut(255&jt),jt=0,Et=0}function Kt(t,e,n){Ht((G<<1)+(n?1:0),3),function(t,e,n){Xt(),Bt=8,n&&(zt(e),zt(~e)),Mt.pending_buf.set(et.subarray(t,t+e),Mt.pending),Mt.pending+=e}(t,e,!0)}function Zt(t,e,n){var i,o,a=0;bt>0?(Ot.build_tree(Mt),qt.build_tree(Mt),a=function(){var t;for(Dt(At,Ot.max_code),Dt(St,qt.max_code),Tt.build_tree(Mt),t=r-1;t>=3&&0===_t[2*F.bl_order[t]+1];t--);return Mt.opt_len+=3*(t+1)+5+5+4,t}(),i=Mt.opt_len+3+7>>>3,(o=Mt.static_len+3+7>>>3)<=i&&(i=o)):i=o=e+5,e+4<=i&&-1!=t?Kt(t,e,n):o==i?(Ht((Y<<1)+(n?1:0),3),Jt(P.static_ltree,P.static_dtree)):(Ht((J<<1)+(n?1:0),3),function(t,e,n){var r;for(Ht(t-257,5),Ht(e-1,5),Ht(n-4,4),r=0;r<n;r++)Ht(_t[2*F.bl_order[r]+1],3);Vt(At,t-1),Vt(St,e-1)}(Ot.max_code+1,qt.max_code+1,a+1),Jt(At,St)),Rt(),n&&Xt()}function Qt(e){Zt(ut>=0?ut:-1,dt-ut,e),ut=dt,t.flush_pending()}function $t(){var e,n,r,i;do{if(0===(i=nt-mt-dt)&&0===dt&&0===mt)i=C;else if(-1==i)i--;else if(dt>=C+C-Z){et.set(et.subarray(C,C+C),0),gt-=C,dt-=C,ut-=C,r=e=at;do{n=65535&it[--r],it[r]=n>=C?n-C:0}while(0!=--e);r=e=C;do{n=65535&rt[--r],rt[r]=n>=C?n-C:0}while(0!=--e);i+=C}if(0===t.avail_in)return;e=t.read_buf(et,dt+mt,i),(mt+=e)>=X&&(ot=((ot=255&et[dt])<<ht^255&et[dt+1])&lt)}while(mt<Z&&0!==t.avail_in)}function te(t){var e,n,r=vt,i=dt,o=yt,a=dt>C-Z?dt-(C-Z):0,s=Lt,l=tt,h=dt+K,u=et[i+o-1],c=et[i+o];yt>=Nt&&(r>>=2),s>mt&&(s=mt);do{if(et[(e=t)+o]==c&&et[e+o-1]==u&&et[e]==et[i]&&et[++e]==et[i+1]){i+=2,e++;do{}while(et[++i]==et[++e]&&et[++i]==et[++e]&&et[++i]==et[++e]&&et[++i]==et[++e]&&et[++i]==et[++e]&&et[++i]==et[++e]&&et[++i]==et[++e]&&et[++i]==et[++e]&&i<h);if(n=K-(h-i),i=h-K,n>o){if(gt=t,o=n,n>=s)break;u=et[i+o-1],c=et[i+o]}}}while((t=65535&rt[t&l])>a&&0!=--r);return o<=mt?o:mt}function ee(t){return t.total_in=t.total_out=0,t.msg=null,Mt.pending=0,Mt.pending_out=0,e=H,_=m,Ot.dyn_tree=At,Ot.stat_desc=P.static_l_desc,qt.dyn_tree=St,qt.stat_desc=P.static_d_desc,Tt.dyn_tree=_t,Tt.stat_desc=P.static_bl_desc,jt=0,Et=0,Bt=8,Rt(),function(){var t;for(nt=2*C,it[at-1]=0,t=0;t<at-1;t++)it[t]=0;wt=M[bt].max_lazy,Nt=M[bt].good_length,Lt=M[bt].nice_length,vt=M[bt].max_chain,dt=0,ut=0,mt=0,ct=yt=X-1,pt=0,ot=0}(),b}Mt.depth=[],Mt.bl_count=[],Mt.heap=[],At=[],St=[],_t=[],Mt.pqdownheap=function(t,e){for(var n=Mt.heap,r=n[e],i=e<<1;i<=Mt.heap_len&&(i<Mt.heap_len&&Q(t,n[i+1],n[i],Mt.depth)&&i++,!Q(t,r,n[i],Mt.depth));)n[e]=n[i],e=i,i<<=1;n[e]=r},Mt.deflateInit=function(t,e,n,r,i,o){return r||(r=V),i||(i=I),o||(o=g),t.msg=null,e==f&&(e=6),i<1||i>k||r!=V||n<9||n>15||e<0||e>9||o<0||o>d?L:(t.dstate=Mt,tt=(C=1<<($=n))-1,lt=(at=1<<(st=i+7))-1,ht=Math.floor((st+X-1)/X),et=new Uint8Array(2*C),rt=[],it=[],Pt=1<<i+6,Mt.pending_buf=new Uint8Array(4*Pt),a=4*Pt,It=Math.floor(Pt/2),Ft=3*Pt,bt=e,xt=o,ee(t))},Mt.deflateEnd=function(){return e!=z&&e!=H&&e!=W?L:(Mt.pending_buf=null,it=null,rt=null,et=null,Mt.dstate=null,e==H?A:b)},Mt.deflateParams=function(t,e,n){var r=b;return e==f&&(e=6),e<0||e>9||n<0||n>d?L:(M[bt].func!=M[e].func&&0!==t.total_in&&(r=t.deflate(y)),bt!=e&&(wt=M[bt=e].max_lazy,Nt=M[bt].good_length,Lt=M[bt].nice_length,vt=M[bt].max_chain),xt=n,r)},Mt.deflateSetDictionary=function(t,n,r){var i,o=r,a=0;if(!n||e!=z)return L;if(o<X)return b;for(o>C-Z&&(a=r-(o=C-Z)),et.set(n.subarray(a,a+o),0),dt=o,ut=o,ot=((ot=255&et[0])<<ht^255&et[1])&lt,i=0;i<=o-X;i++)ot=(ot<<ht^255&et[i+(X-1)])&lt,rt[i&tt]=it[ot],it[ot]=i;return b},Mt.deflate=function(n,r){var i,o,l,h,u,c;if(r>w||r<0)return L;if(!n.next_out||!n.next_in&&0!==n.avail_in||e==W&&r!=w)return n.msg=O[N-L],L;if(0===n.avail_out)return n.msg=O[N-S],S;if(t=n,h=_,_=r,e==z&&(o=V+($-8<<4)<<8,(l=(bt-1&255)>>1)>3&&(l=3),o|=l<<6,0!==dt&&(o|=U),e=H,Ut((c=o+=31-o%31)>>8&255),Ut(255&c)),0!==Mt.pending){if(t.flush_pending(),0===t.avail_out)return _=-1,b}else if(0===t.avail_in&&r<=h&&r!=w)return t.msg=O[N-S],S;if(e==W&&0!==t.avail_in)return n.msg=O[N-S],S;if(0!==t.avail_in||0!==mt||r!=m&&e!=W){switch(u=-1,M[bt].func){case B:u=function(e){var n,r=65535;for(r>a-5&&(r=a-5);;){if(mt<=1){if($t(),0===mt&&e==m)return q;if(0===mt)break}if(dt+=mt,mt=0,n=ut+r,(0===dt||dt>=n)&&(mt=dt-n,dt=n,Qt(!1),0===t.avail_out))return q;if(dt-ut>=C-Z&&(Qt(!1),0===t.avail_out))return q}return Qt(e==w),0===t.avail_out?e==w?R:q:e==w?D:T}(r);break;case j:u=function(e){for(var n,r=0;;){if(mt<Z){if($t(),mt<Z&&e==m)return q;if(0===mt)break}if(mt>=X&&(ot=(ot<<ht^255&et[dt+(X-1)])&lt,r=65535&it[ot],rt[dt&tt]=it[ot],it[ot]=dt),0!==r&&(dt-r&65535)<=C-Z&&xt!=d&&(ct=te(r)),ct>=X)if(n=Yt(dt-gt,ct-X),mt-=ct,ct<=wt&&mt>=X){ct--;do{ot=(ot<<ht^255&et[++dt+(X-1)])&lt,r=65535&it[ot],rt[dt&tt]=it[ot],it[ot]=dt}while(0!=--ct);dt++}else dt+=ct,ct=0,ot=((ot=255&et[dt])<<ht^255&et[dt+1])&lt;else n=Yt(0,255&et[dt]),mt--,dt++;if(n&&(Qt(!1),0===t.avail_out))return q}return Qt(e==w),0===t.avail_out?e==w?R:q:e==w?D:T}(r);break;case E:u=function(e){for(var n,r,i=0;;){if(mt<Z){if($t(),mt<Z&&e==m)return q;if(0===mt)break}if(mt>=X&&(ot=(ot<<ht^255&et[dt+(X-1)])&lt,i=65535&it[ot],rt[dt&tt]=it[ot],it[ot]=dt),yt=ct,ft=gt,ct=X-1,0!==i&&yt<wt&&(dt-i&65535)<=C-Z&&(xt!=d&&(ct=te(i)),ct<=5&&(xt==p||ct==X&&dt-gt>4096)&&(ct=X-1)),yt>=X&&ct<=yt){r=dt+mt-X,n=Yt(dt-1-ft,yt-X),mt-=yt-1,yt-=2;do{++dt<=r&&(ot=(ot<<ht^255&et[dt+(X-1)])&lt,i=65535&it[ot],rt[dt&tt]=it[ot],it[ot]=dt)}while(0!=--yt);if(pt=0,ct=X-1,dt++,n&&(Qt(!1),0===t.avail_out))return q}else if(0!==pt){if((n=Yt(0,255&et[dt-1]))&&Qt(!1),dt++,mt--,0===t.avail_out)return q}else pt=1,dt++,mt--}return 0!==pt&&(n=Yt(0,255&et[dt-1]),pt=0),Qt(e==w),0===t.avail_out?e==w?R:q:e==w?D:T}(r)}if(u!=R&&u!=D||(e=W),u==q||u==R)return 0===t.avail_out&&(_=-1),b;if(u==T){if(r==y)Ht(Y<<1,3),Wt(s,P.static_ltree),Gt(),1+Bt+10-Et<9&&(Ht(Y<<1,3),Wt(s,P.static_ltree),Gt()),Bt=7;else if(Kt(0,0,!1),r==v)for(i=0;i<at;i++)it[i]=0;if(t.flush_pending(),0===t.avail_out)return _=-1,b}}return r!=w?b:x}}function tt(){this.next_in_index=0,this.next_out_index=0,this.avail_in=0,this.total_in=0,this.avail_out=0,this.total_out=0}tt.prototype={deflateInit:function(t,n){return this.dstate=new $,n||(n=e),this.dstate.deflateInit(this,t,n)},deflate:function(t){return this.dstate?this.dstate.deflate(this,t):L},deflateEnd:function(){if(!this.dstate)return L;var t=this.dstate.deflateEnd();return this.dstate=null,t},deflateParams:function(t,e){return this.dstate?this.dstate.deflateParams(this,t,e):L},deflateSetDictionary:function(t,e){return this.dstate?this.dstate.deflateSetDictionary(this,t,e):L},read_buf:function(t,e,n){var r=this.avail_in;return r>n&&(r=n),0===r?0:(this.avail_in-=r,t.set(this.next_in.subarray(this.next_in_index,this.next_in_index+r),e),this.next_in_index+=r,this.total_in+=r,r)},flush_pending:function(){var t=this.dstate.pending;t>this.avail_out&&(t=this.avail_out),0!==t&&(this.next_out.set(this.dstate.pending_buf.subarray(this.dstate.pending_out,this.dstate.pending_out+t),this.next_out_index),this.next_out_index+=t,this.dstate.pending_out+=t,this.total_out+=t,this.avail_out-=t,this.dstate.pending-=t,0===this.dstate.pending&&(this.dstate.pending_out=0))}};var et=t.zip||t;et.Deflater=et._jzlib_Deflater=function(t){var e=new tt,n=m,r=new Uint8Array(512),i=t?t.level:f;void 0===i&&(i=f),e.deflateInit(i),e.next_out=r,this.append=function(t,i){var o,a=[],s=0,l=0,h=0;if(t.length){e.next_in_index=0,e.next_in=t,e.avail_in=t.length;do{if(e.next_out_index=0,e.avail_out=512,e.deflate(n)!=b)throw new Error("deflating: "+e.msg);e.next_out_index&&(512==e.next_out_index?a.push(new Uint8Array(r)):a.push(new Uint8Array(r.subarray(0,e.next_out_index)))),h+=e.next_out_index,i&&e.next_in_index>0&&e.next_in_index!=s&&(i(e.next_in_index),s=e.next_in_index)}while(e.avail_in>0||0===e.avail_out);return o=new Uint8Array(h),a.forEach(function(t){o.set(t,l),l+=t.length}),o}},this.flush=function(){var t,n,i=[],o=0,a=0;do{if(e.next_out_index=0,e.avail_out=512,(t=e.deflate(w))!=x&&t!=b)throw new Error("deflating: "+e.msg);512-e.avail_out>0&&i.push(new Uint8Array(r.subarray(0,e.next_out_index))),a+=e.next_out_index}while(e.avail_in>0||0===e.avail_out);return e.deflateEnd(),n=new Uint8Array(a),i.forEach(function(t){n.set(t,o),o+=t.length}),n}}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof global&&global||Function('return typeof this === "object" && this.content')()||Function("return this")()),function(t){t.RGBColor=function(t){var e;t=t||"",this.ok=!1,"#"==t.charAt(0)&&(t=t.substr(1,6)),t=(t=t.replace(/ /g,"")).toLowerCase();var n={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dodgerblue:"1e90ff",feldspar:"d19275",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslateblue:"8470ff",lightslategray:"778899",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"00ff00",limegreen:"32cd32",linen:"faf0e6",magenta:"ff00ff",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"ff0000",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",violetred:"d02090",wheat:"f5deb3",white:"ffffff",whitesmoke:"f5f5f5",yellow:"ffff00",yellowgreen:"9acd32"};for(var r in n)t==r&&(t=n[r]);for(var i=[{re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,example:["rgb(123, 234, 45)","rgb(255,234,245)"],process:function(t){return[parseInt(t[1]),parseInt(t[2]),parseInt(t[3])]}},{re:/^(\w{2})(\w{2})(\w{2})$/,example:["#00ff00","336699"],process:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/^(\w{1})(\w{1})(\w{1})$/,example:["#fb0","f0f"],process:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}}],o=0;o<i.length;o++){var a=i[o].re,s=i[o].process,l=a.exec(t);l&&(e=s(l),this.r=e[0],this.g=e[1],this.b=e[2],this.ok=!0)}this.r=this.r<0||isNaN(this.r)?0:this.r>255?255:this.r,this.g=this.g<0||isNaN(this.g)?0:this.g>255?255:this.g,this.b=this.b<0||isNaN(this.b)?0:this.b>255?255:this.b,this.toRGB=function(){return"rgb("+this.r+", "+this.g+", "+this.b+")"},this.toHex=function(){var t=this.r.toString(16),e=this.g.toString(16),n=this.b.toString(16);return 1==t.length&&(t="0"+t),1==e.length&&(e="0"+e),1==n.length&&(n="0"+n),"#"+t+e+n}}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof global&&global||Function('return typeof this === "object" && this.content')()||Function("return this")()),function(t){var e="+".charCodeAt(0),n="/".charCodeAt(0),r="0".charCodeAt(0),i="a".charCodeAt(0),o="A".charCodeAt(0),a="-".charCodeAt(0),s="_".charCodeAt(0),l=function(t){var l=t.charCodeAt(0);return l===e||l===a?62:l===n||l===s?63:l<r?-1:l<r+10?l-r+26+26:l<o+26?l-o:l<i+26?l-i+26:void 0};t.API.TTFFont=function(){function t(t,e,n){var r;if(this.rawData=t,r=this.contents=new u(t),this.contents.pos=4,"ttcf"===r.readString(4)){if(!e)throw new Error("Must specify a font name for TTC files.");throw new Error("Font "+e+" not found in TTC file.")}r.pos=0,this.parse(),this.subset=new k(this),this.registerTTF()}return t.open=function(e,n,r,i){if("string"!=typeof r)throw new Error("Invalid argument supplied in TTFFont.open");return new t(function(t){var e,n,r,i,o,a;if(t.length%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var s=t.length;o="="===t.charAt(s-2)?2:"="===t.charAt(s-1)?1:0,a=new Uint8Array(3*t.length/4-o),r=o>0?t.length-4:t.length;var h=0;function u(t){a[h++]=t}for(e=0,n=0;e<r;e+=4,n+=3)u((16711680&(i=l(t.charAt(e))<<18|l(t.charAt(e+1))<<12|l(t.charAt(e+2))<<6|l(t.charAt(e+3))))>>16),u((65280&i)>>8),u(255&i);return 2===o?u(255&(i=l(t.charAt(e))<<2|l(t.charAt(e+1))>>4)):1===o&&(u((i=l(t.charAt(e))<<10|l(t.charAt(e+1))<<4|l(t.charAt(e+2))>>2)>>8&255),u(255&i)),a}(r),n,i)},t.prototype.parse=function(){return this.directory=new c(this.contents),this.head=new d(this),this.name=new x(this),this.cmap=new m(this),this.toUnicode=new Map,this.hhea=new y(this),this.maxp=new N(this),this.hmtx=new L(this),this.post=new w(this),this.os2=new v(this),this.loca=new P(this),this.glyf=new S(this),this.ascender=this.os2.exists&&this.os2.ascender||this.hhea.ascender,this.decender=this.os2.exists&&this.os2.decender||this.hhea.decender,this.lineGap=this.os2.exists&&this.os2.lineGap||this.hhea.lineGap,this.bbox=[this.head.xMin,this.head.yMin,this.head.xMax,this.head.yMax]},t.prototype.registerTTF=function(){var t,e,n,r,i;if(this.scaleFactor=1e3/this.head.unitsPerEm,this.bbox=function(){var e,n,r,i;for(i=[],e=0,n=(r=this.bbox).length;e<n;e++)t=r[e],i.push(Math.round(t*this.scaleFactor));return i}.call(this),this.stemV=0,this.post.exists?(n=255&(r=this.post.italic_angle),!0&(e=r>>16)&&(e=-(1+(65535^e))),this.italicAngle=+(e+"."+n)):this.italicAngle=0,this.ascender=Math.round(this.ascender*this.scaleFactor),this.decender=Math.round(this.decender*this.scaleFactor),this.lineGap=Math.round(this.lineGap*this.scaleFactor),this.capHeight=this.os2.exists&&this.os2.capHeight||this.ascender,this.xHeight=this.os2.exists&&this.os2.xHeight||0,this.familyClass=(this.os2.exists&&this.os2.familyClass||0)>>8,this.isSerif=1===(i=this.familyClass)||2===i||3===i||4===i||5===i||7===i,this.isScript=10===this.familyClass,this.flags=0,this.post.isFixedPitch&&(this.flags|=1),this.isSerif&&(this.flags|=2),this.isScript&&(this.flags|=8),0!==this.italicAngle&&(this.flags|=64),this.flags|=32,!this.cmap.unicode)throw new Error("No unicode cmap for font")},t.prototype.characterToGlyph=function(t){var e;return(null!=(e=this.cmap.unicode)?e.codeMap[t]:void 0)||0},t.prototype.widthOfGlyph=function(t){var e;return e=1e3/this.head.unitsPerEm,this.hmtx.forGlyph(t).advance*e},t.prototype.widthOfString=function(t,e,n){var r,i,o,a,s;for(o=0,i=a=0,s=(t=""+t).length;0<=s?a<s:a>s;i=0<=s?++a:--a)r=t.charCodeAt(i),o+=this.widthOfGlyph(this.characterToGlyph(r))+n*(1e3/e)||0;return o*(e/1e3)},t.prototype.lineHeight=function(t,e){var n;return null==e&&(e=!1),n=e?this.lineGap:0,(this.ascender+n-this.decender)/1e3*t},t}();var h,u=function(){function t(t){this.data=null!=t?t:[],this.pos=0,this.length=this.data.length}return t.prototype.readByte=function(){return this.data[this.pos++]},t.prototype.writeByte=function(t){return this.data[this.pos++]=t},t.prototype.readUInt32=function(){return 16777216*this.readByte()+(this.readByte()<<16)+(this.readByte()<<8)+this.readByte()},t.prototype.writeUInt32=function(t){return this.writeByte(t>>>24&255),this.writeByte(t>>16&255),this.writeByte(t>>8&255),this.writeByte(255&t)},t.prototype.readInt32=function(){var t;return(t=this.readUInt32())>=2147483648?t-4294967296:t},t.prototype.writeInt32=function(t){return t<0&&(t+=4294967296),this.writeUInt32(t)},t.prototype.readUInt16=function(){return this.readByte()<<8|this.readByte()},t.prototype.writeUInt16=function(t){return this.writeByte(t>>8&255),this.writeByte(255&t)},t.prototype.readInt16=function(){var t;return(t=this.readUInt16())>=32768?t-65536:t},t.prototype.writeInt16=function(t){return t<0&&(t+=65536),this.writeUInt16(t)},t.prototype.readString=function(t){var e,n,r;for(n=[],e=r=0;0<=t?r<t:r>t;e=0<=t?++r:--r)n[e]=String.fromCharCode(this.readByte());return n.join("")},t.prototype.writeString=function(t){var e,n,r,i;for(i=[],e=n=0,r=t.length;0<=r?n<r:n>r;e=0<=r?++n:--n)i.push(this.writeByte(t.charCodeAt(e)));return i},t.prototype.readShort=function(){return this.readInt16()},t.prototype.writeShort=function(t){return this.writeInt16(t)},t.prototype.readLongLong=function(){var t,e,n,r,i,o,a,s;return t=this.readByte(),e=this.readByte(),n=this.readByte(),r=this.readByte(),i=this.readByte(),o=this.readByte(),a=this.readByte(),s=this.readByte(),128&t?-1*(72057594037927940*(255^t)+281474976710656*(255^e)+1099511627776*(255^n)+4294967296*(255^r)+16777216*(255^i)+65536*(255^o)+256*(255^a)+(255^s)+1):72057594037927940*t+281474976710656*e+1099511627776*n+4294967296*r+16777216*i+65536*o+256*a+s},t.prototype.writeLongLong=function(t){var e,n;return e=Math.floor(t/4294967296),n=4294967295&t,this.writeByte(e>>24&255),this.writeByte(e>>16&255),this.writeByte(e>>8&255),this.writeByte(255&e),this.writeByte(n>>24&255),this.writeByte(n>>16&255),this.writeByte(n>>8&255),this.writeByte(255&n)},t.prototype.readInt=function(){return this.readInt32()},t.prototype.writeInt=function(t){return this.writeInt32(t)},t.prototype.read=function(t){var e,n;for(e=[],n=0;0<=t?n<t:n>t;0<=t?++n:--n)e.push(this.readByte());return e},t.prototype.write=function(t){var e,n,r,i;for(i=[],n=0,r=t.length;n<r;n++)e=t[n],i.push(this.writeByte(e));return i},t}(),c=function(){var t;function e(t){var e,n,r;for(this.scalarType=t.readInt(),this.tableCount=t.readShort(),this.searchRange=t.readShort(),this.entrySelector=t.readShort(),this.rangeShift=t.readShort(),this.tables={},n=0,r=this.tableCount;0<=r?n<r:n>r;0<=r?++n:--n)e={tag:t.readString(4),checksum:t.readInt(),offset:t.readInt(),length:t.readInt()},this.tables[e.tag]=e}return e.prototype.encode=function(e){var n,r,i,o,a,s,l,h,c,f,p,d,g;for(g in p=Object.keys(e).length,s=Math.log(2),c=16*Math.floor(Math.log(p)/s),o=Math.floor(c/s),h=16*p-c,(r=new u).writeInt(this.scalarType),r.writeShort(p),r.writeShort(c),r.writeShort(o),r.writeShort(h),i=16*p,l=r.pos+i,a=null,d=[],e)for(f=e[g],r.writeString(g),r.writeInt(t(f)),r.writeInt(l),r.writeInt(f.length),d=d.concat(f),"head"===g&&(a=l),l+=f.length;l%4;)d.push(0),l++;return r.write(d),n=2981146554-t(r.data),r.pos=a+8,r.writeUInt32(n),r.data},t=function(t){var e,n,r,i;for(t=A.call(t);t.length%4;)t.push(0);for(n=new u(t),e=0,r=0,i=t.length;r<i;r+=4)e+=n.readUInt32();return 4294967295&e},e}(),f={}.hasOwnProperty,p=function(t,e){for(var n in e)f.call(e,n)&&(t[n]=e[n]);function r(){this.constructor=t}return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};h=function(){function t(t){var e;this.file=t,e=this.file.directory.tables[this.tag],this.exists=!!e,e&&(this.offset=e.offset,this.length=e.length,this.parse(this.file.contents))}return t.prototype.parse=function(){},t.prototype.encode=function(){},t.prototype.raw=function(){return this.exists?(this.file.contents.pos=this.offset,this.file.contents.read(this.length)):null},t}();var d=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return p(e,h),e.prototype.tag="head",e.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.revision=t.readInt(),this.checkSumAdjustment=t.readInt(),this.magicNumber=t.readInt(),this.flags=t.readShort(),this.unitsPerEm=t.readShort(),this.created=t.readLongLong(),this.modified=t.readLongLong(),this.xMin=t.readShort(),this.yMin=t.readShort(),this.xMax=t.readShort(),this.yMax=t.readShort(),this.macStyle=t.readShort(),this.lowestRecPPEM=t.readShort(),this.fontDirectionHint=t.readShort(),this.indexToLocFormat=t.readShort(),this.glyphDataFormat=t.readShort()},e.prototype.encode=function(t){var e;return(e=new u).writeInt(this.version),e.writeInt(this.revision),e.writeInt(this.checkSumAdjustment),e.writeInt(this.magicNumber),e.writeShort(this.flags),e.writeShort(this.unitsPerEm),e.writeLongLong(this.created),e.writeLongLong(this.modified),e.writeShort(this.xMin),e.writeShort(this.yMin),e.writeShort(this.xMax),e.writeShort(this.yMax),e.writeShort(this.macStyle),e.writeShort(this.lowestRecPPEM),e.writeShort(this.fontDirectionHint),e.writeShort(t),e.writeShort(this.glyphDataFormat),e.data},e}(),g=function(){function t(t,e){var n,r,i,o,a,s,l,h,u,c,f,p,d,g,m,y,v,w;switch(this.platformID=t.readUInt16(),this.encodingID=t.readShort(),this.offset=e+t.readInt(),u=t.pos,t.pos=this.offset,this.format=t.readUInt16(),this.length=t.readUInt16(),this.language=t.readUInt16(),this.isUnicode=3===this.platformID&&1===this.encodingID&&4===this.format||0===this.platformID&&4===this.format,this.codeMap={},this.format){case 0:for(s=m=0;m<256;s=++m)this.codeMap[s]=t.readByte();break;case 4:for(f=t.readUInt16(),c=f/2,t.pos+=6,i=function(){var e,n;for(n=[],s=e=0;0<=c?e<c:e>c;s=0<=c?++e:--e)n.push(t.readUInt16());return n}(),t.pos+=2,d=function(){var e,n;for(n=[],s=e=0;0<=c?e<c:e>c;s=0<=c?++e:--e)n.push(t.readUInt16());return n}(),l=function(){var e,n;for(n=[],s=e=0;0<=c?e<c:e>c;s=0<=c?++e:--e)n.push(t.readUInt16());return n}(),h=function(){var e,n;for(n=[],s=e=0;0<=c?e<c:e>c;s=0<=c?++e:--e)n.push(t.readUInt16());return n}(),r=(this.length-t.pos+this.offset)/2,a=function(){var e,n;for(n=[],s=e=0;0<=r?e<r:e>r;s=0<=r?++e:--e)n.push(t.readUInt16());return n}(),s=y=0,w=i.length;y<w;s=++y)for(g=i[s],n=v=p=d[s];p<=g?v<=g:v>=g;n=p<=g?++v:--v)0===h[s]?o=n+l[s]:0!==(o=a[h[s]/2+(n-p)-(c-s)]||0)&&(o+=l[s]),this.codeMap[n]=65535&o}t.pos=u}return t.encode=function(t,e){var n,r,i,o,a,s,l,h,c,f,p,d,g,m,y,v,w,b,x,N,L,A,S,_,F,P,k,I,C,B,j,E,M,O,q,T,R,D,U,z,H,W,V,G,Y,J;switch(I=new u,o=Object.keys(t).sort(function(t,e){return t-e}),e){case"macroman":for(g=0,m=function(){var t,e;for(e=[],d=t=0;t<256;d=++t)e.push(0);return e}(),v={0:0},i={},C=0,M=o.length;C<M;C++)null==v[V=t[r=o[C]]]&&(v[V]=++g),i[r]={old:t[r],new:v[t[r]]},m[r]=v[t[r]];return I.writeUInt16(1),I.writeUInt16(0),I.writeUInt32(12),I.writeUInt16(0),I.writeUInt16(262),I.writeUInt16(0),I.write(m),{charMap:i,subtable:I.data,maxGlyphID:g+1};case"unicode":for(P=[],c=[],w=0,v={},n={},y=l=null,B=0,O=o.length;B<O;B++)null==v[x=t[r=o[B]]]&&(v[x]=++w),n[r]={old:x,new:v[x]},a=v[x]-r,null!=y&&a===l||(y&&c.push(y),P.push(r),l=a),y=r;for(y&&c.push(y),c.push(65535),P.push(65535),_=2*(S=P.length),A=2*Math.pow(Math.log(S)/Math.LN2,2),f=Math.log(A/2)/Math.LN2,L=2*S-A,s=[],N=[],p=[],d=j=0,q=P.length;j<q;d=++j){if(F=P[d],h=c[d],65535===F){s.push(0),N.push(0);break}if(F-(k=n[F].new)>=32768)for(s.push(0),N.push(2*(p.length+S-d)),r=E=F;F<=h?E<=h:E>=h;r=F<=h?++E:--E)p.push(n[r].new);else s.push(k-F),N.push(0)}for(I.writeUInt16(3),I.writeUInt16(1),I.writeUInt32(12),I.writeUInt16(4),I.writeUInt16(16+8*S+2*p.length),I.writeUInt16(0),I.writeUInt16(_),I.writeUInt16(A),I.writeUInt16(f),I.writeUInt16(L),H=0,T=c.length;H<T;H++)r=c[H],I.writeUInt16(r);for(I.writeUInt16(0),W=0,R=P.length;W<R;W++)r=P[W],I.writeUInt16(r);for(G=0,D=s.length;G<D;G++)a=s[G],I.writeUInt16(a);for(Y=0,U=N.length;Y<U;Y++)b=N[Y],I.writeUInt16(b);for(J=0,z=p.length;J<z;J++)g=p[J],I.writeUInt16(g);return{charMap:n,subtable:I.data,maxGlyphID:w+1}}},t}(),m=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return p(e,h),e.prototype.tag="cmap",e.prototype.parse=function(t){var e,n,r;for(t.pos=this.offset,this.version=t.readUInt16(),n=t.readUInt16(),this.tables=[],this.unicode=null,r=0;0<=n?r<n:r>n;0<=n?++r:--r)e=new g(t,this.offset),this.tables.push(e),e.isUnicode&&null==this.unicode&&(this.unicode=e);return!0},e.encode=function(t,e){var n,r;return null==e&&(e="macroman"),n=g.encode(t,e),(r=new u).writeUInt16(0),r.writeUInt16(1),n.table=r.data.concat(n.subtable),n},e}(),y=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return p(e,h),e.prototype.tag="hhea",e.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.ascender=t.readShort(),this.decender=t.readShort(),this.lineGap=t.readShort(),this.advanceWidthMax=t.readShort(),this.minLeftSideBearing=t.readShort(),this.minRightSideBearing=t.readShort(),this.xMaxExtent=t.readShort(),this.caretSlopeRise=t.readShort(),this.caretSlopeRun=t.readShort(),this.caretOffset=t.readShort(),t.pos+=8,this.metricDataFormat=t.readShort(),this.numberOfMetrics=t.readUInt16()},e}(),v=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return p(e,h),e.prototype.tag="OS/2",e.prototype.parse=function(t){if(t.pos=this.offset,this.version=t.readUInt16(),this.averageCharWidth=t.readShort(),this.weightClass=t.readUInt16(),this.widthClass=t.readUInt16(),this.type=t.readShort(),this.ySubscriptXSize=t.readShort(),this.ySubscriptYSize=t.readShort(),this.ySubscriptXOffset=t.readShort(),this.ySubscriptYOffset=t.readShort(),this.ySuperscriptXSize=t.readShort(),this.ySuperscriptYSize=t.readShort(),this.ySuperscriptXOffset=t.readShort(),this.ySuperscriptYOffset=t.readShort(),this.yStrikeoutSize=t.readShort(),this.yStrikeoutPosition=t.readShort(),this.familyClass=t.readShort(),this.panose=function(){var e,n;for(n=[],e=0;e<10;++e)n.push(t.readByte());return n}(),this.charRange=function(){var e,n;for(n=[],e=0;e<4;++e)n.push(t.readInt());return n}(),this.vendorID=t.readString(4),this.selection=t.readShort(),this.firstCharIndex=t.readShort(),this.lastCharIndex=t.readShort(),this.version>0&&(this.ascent=t.readShort(),this.descent=t.readShort(),this.lineGap=t.readShort(),this.winAscent=t.readShort(),this.winDescent=t.readShort(),this.codePageRange=function(){var e,n;for(n=[],e=0;e<2;++e)n.push(t.readInt());return n}(),this.version>1))return this.xHeight=t.readShort(),this.capHeight=t.readShort(),this.defaultChar=t.readShort(),this.breakChar=t.readShort(),this.maxContext=t.readShort()},e}(),w=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return p(e,h),e.prototype.tag="post",e.prototype.parse=function(t){var e,n,r,i;switch(t.pos=this.offset,this.format=t.readInt(),this.italicAngle=t.readInt(),this.underlinePosition=t.readShort(),this.underlineThickness=t.readShort(),this.isFixedPitch=t.readInt(),this.minMemType42=t.readInt(),this.maxMemType42=t.readInt(),this.minMemType1=t.readInt(),this.maxMemType1=t.readInt(),this.format){case 65536:break;case 131072:for(n=t.readUInt16(),this.glyphNameIndex=[],r=0;0<=n?r<n:r>n;0<=n?++r:--r)this.glyphNameIndex.push(t.readUInt16());for(this.names=[],i=[];t.pos<this.offset+this.length;)e=t.readByte(),i.push(this.names.push(t.readString(e)));return i;case 151552:return n=t.readUInt16(),this.offsets=t.read(n);case 196608:break;case 262144:return this.map=function(){var e,n,r;for(r=[],e=0,n=this.file.maxp.numGlyphs;0<=n?e<n:e>n;0<=n?++e:--e)r.push(t.readUInt32());return r}.call(this)}},e}(),b=function(){return function(t,e){this.raw=t,this.length=t.length,this.platformID=e.platformID,this.encodingID=e.encodingID,this.languageID=e.languageID}}(),x=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return p(e,h),e.prototype.tag="name",e.prototype.parse=function(t){var e,n,r,i,o,a,s,l,h,u,c,f;for(t.pos=this.offset,t.readShort(),e=t.readShort(),a=t.readShort(),n=[],i=h=0;0<=e?h<e:h>e;i=0<=e?++h:--h)n.push({platformID:t.readShort(),encodingID:t.readShort(),languageID:t.readShort(),nameID:t.readShort(),length:t.readShort(),offset:this.offset+a+t.readShort()});for(s={},i=u=0,c=n.length;u<c;i=++u)r=n[i],t.pos=r.offset,l=t.readString(r.length),o=new b(l,r),null==s[f=r.nameID]&&(s[f]=[]),s[r.nameID].push(o);this.strings=s,this.copyright=s[0],this.fontFamily=s[1],this.fontSubfamily=s[2],this.uniqueSubfamily=s[3],this.fontName=s[4],this.version=s[5];try{this.postscriptName=s[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g,"")}catch(t){this.postscriptName=s[4][0].raw.replace(/[\x00-\x19\x80-\xff]/g,"")}return this.trademark=s[7],this.manufacturer=s[8],this.designer=s[9],this.description=s[10],this.vendorUrl=s[11],this.designerUrl=s[12],this.license=s[13],this.licenseUrl=s[14],this.preferredFamily=s[15],this.preferredSubfamily=s[17],this.compatibleFull=s[18],this.sampleText=s[19]},e}(),N=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return p(e,h),e.prototype.tag="maxp",e.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.numGlyphs=t.readUInt16(),this.maxPoints=t.readUInt16(),this.maxContours=t.readUInt16(),this.maxCompositePoints=t.readUInt16(),this.maxComponentContours=t.readUInt16(),this.maxZones=t.readUInt16(),this.maxTwilightPoints=t.readUInt16(),this.maxStorage=t.readUInt16(),this.maxFunctionDefs=t.readUInt16(),this.maxInstructionDefs=t.readUInt16(),this.maxStackElements=t.readUInt16(),this.maxSizeOfInstructions=t.readUInt16(),this.maxComponentElements=t.readUInt16(),this.maxComponentDepth=t.readUInt16()},e}(),L=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return p(e,h),e.prototype.tag="hmtx",e.prototype.parse=function(t){var e,n,r,i,o,a,s;for(t.pos=this.offset,this.metrics=[],i=0,a=this.file.hhea.numberOfMetrics;0<=a?i<a:i>a;0<=a?++i:--i)this.metrics.push({advance:t.readUInt16(),lsb:t.readInt16()});for(n=this.file.maxp.numGlyphs-this.file.hhea.numberOfMetrics,this.leftSideBearings=function(){var e,r;for(r=[],e=0;0<=n?e<n:e>n;0<=n?++e:--e)r.push(t.readInt16());return r}(),this.widths=function(){var t,e,n,i;for(i=[],t=0,e=(n=this.metrics).length;t<e;t++)r=n[t],i.push(r.advance);return i}.call(this),e=this.widths[this.widths.length-1],s=[],o=0;0<=n?o<n:o>n;0<=n?++o:--o)s.push(this.widths.push(e));return s},e.prototype.forGlyph=function(t){return t in this.metrics?this.metrics[t]:{advance:this.metrics[this.metrics.length-1].advance,lsb:this.leftSideBearings[t-this.metrics.length]}},e}(),A=[].slice,S=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return p(e,h),e.prototype.tag="glyf",e.prototype.parse=function(t){return this.cache={}},e.prototype.glyphFor=function(t){var e,n,r,i,o,a,s,l,h,c;return(t=t)in this.cache?this.cache[t]:(i=this.file.loca,e=this.file.contents,n=i.indexOf(t),0===(r=i.lengthOf(t))?this.cache[t]=null:(e.pos=this.offset+n,o=(a=new u(e.read(r))).readShort(),l=a.readShort(),c=a.readShort(),s=a.readShort(),h=a.readShort(),this.cache[t]=-1===o?new F(a,l,c,s,h):new _(a,o,l,c,s,h),this.cache[t]))},e.prototype.encode=function(t,e,n){var r,i,o,a,s;for(o=[],i=[],a=0,s=e.length;a<s;a++)r=t[e[a]],i.push(o.length),r&&(o=o.concat(r.encode(n)));return i.push(o.length),{table:o,offsets:i}},e}(),_=function(){function t(t,e,n,r,i,o){this.raw=t,this.numberOfContours=e,this.xMin=n,this.yMin=r,this.xMax=i,this.yMax=o,this.compound=!1}return t.prototype.encode=function(){return this.raw.data},t}(),F=function(){var t,e,n,r,i;function o(o,a,s,l,h){var u,c;for(this.raw=o,this.xMin=a,this.yMin=s,this.xMax=l,this.yMax=h,this.compound=!0,this.glyphIDs=[],this.glyphOffsets=[],u=this.raw;c=u.readShort(),this.glyphOffsets.push(u.pos),this.glyphIDs.push(u.readShort()),c&e;)u.pos+=c&t?4:2,c&i?u.pos+=8:c&n?u.pos+=4:c&r&&(u.pos+=2)}return t=1,r=8,e=32,n=64,i=128,o.prototype.encode=function(t){var e,n,r,i,o;for(n=new u(A.call(this.raw.data)),e=r=0,i=(o=this.glyphIDs).length;r<i;e=++r)o[e],n.pos=this.glyphOffsets[e];return n.data},o}(),P=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return p(e,h),e.prototype.tag="loca",e.prototype.parse=function(t){var e;return t.pos=this.offset,e=this.file.head.indexToLocFormat,this.offsets=0===e?function(){var e,n,r;for(r=[],e=0,n=this.length;e<n;e+=2)r.push(2*t.readUInt16());return r}.call(this):function(){var e,n,r;for(r=[],e=0,n=this.length;e<n;e+=4)r.push(t.readUInt32());return r}.call(this)},e.prototype.indexOf=function(t){return this.offsets[t]},e.prototype.lengthOf=function(t){return this.offsets[t+1]-this.offsets[t]},e.prototype.encode=function(t,e){for(var n=new Uint32Array(this.offsets.length),r=0,i=0,o=0;o<n.length;++o)if(n[o]=r,i<e.length&&e[i]==o){++i,n[o]=r;var a=this.offsets[o],s=this.offsets[o+1]-a;s>0&&(r+=s)}for(var l=new Array(4*n.length),h=0;h<n.length;++h)l[4*h+3]=255&n[h],l[4*h+2]=(65280&n[h])>>8,l[4*h+1]=(16711680&n[h])>>16,l[4*h]=(4278190080&n[h])>>24;return l},e}(),k=function(){function t(t){this.font=t,this.subset={},this.unicodes={},this.next=33}return t.prototype.generateCmap=function(){var t,e,n,r,i;for(e in r=this.font.cmap.tables[0].codeMap,t={},i=this.subset)n=i[e],t[e]=r[n];return t},t.prototype.glyphsFor=function(t){var e,n,r,i,o,a,s;for(r={},o=0,a=t.length;o<a;o++)r[i=t[o]]=this.font.glyf.glyphFor(i);for(i in e=[],r)(null!=(n=r[i])?n.compound:void 0)&&e.push.apply(e,n.glyphIDs);if(e.length>0)for(i in s=this.glyphsFor(e))n=s[i],r[i]=n;return r},t.prototype.encode=function(t,e){var n,r,i,o,a,s,l,h,u,c,f,p,d,g,y;for(r in n=m.encode(this.generateCmap(),"unicode"),o=this.glyphsFor(t),f={0:0},y=n.charMap)f[(s=y[r]).old]=s.new;for(p in c=n.maxGlyphID,o)p in f||(f[p]=c++);return h=function(t){var e,n;for(e in n={},t)n[t[e]]=e;return n}(f),u=Object.keys(h).sort(function(t,e){return t-e}),d=function(){var t,e,n;for(n=[],t=0,e=u.length;t<e;t++)a=u[t],n.push(h[a]);return n}(),i=this.font.glyf.encode(o,d,f),l=this.font.loca.encode(i.offsets,d),g={cmap:this.font.cmap.raw(),glyf:i.table,loca:l,hmtx:this.font.hmtx.raw(),hhea:this.font.hhea.raw(),maxp:this.font.maxp.raw(),post:this.font.post.raw(),name:this.font.name.raw(),head:this.font.head.encode(e)},this.font.os2.exists&&(g["OS/2"]=this.font.os2.raw()),this.font.directory.encode(g)},t}();t.API.PDFObject=function(){var t;function e(){}return t=function(t,e){return(Array(e+1).join("0")+t).slice(-e)},e.convert=function(n){var r,i,o,a;if(Array.isArray(n))return"["+function(){var t,i,o;for(o=[],t=0,i=n.length;t<i;t++)r=n[t],o.push(e.convert(r));return o}().join(" ")+"]";if("string"==typeof n)return"/"+n;if(null!=n?n.isString:void 0)return"("+n+")";if(n instanceof Date)return"(D:"+t(n.getUTCFullYear(),4)+t(n.getUTCMonth(),2)+t(n.getUTCDate(),2)+t(n.getUTCHours(),2)+t(n.getUTCMinutes(),2)+t(n.getUTCSeconds(),2)+"Z)";if("[object Object]"==={}.toString.call(n)){for(i in o=["<<"],n)a=n[i],o.push("/"+i+" "+e.convert(a));return o.push(">>"),o.join("\n")}return""+n},e}()}(y),function(t){var e;e=function(){var e,n,r;function i(t){var e,n,r,i,o,a,s,l,h,u,c,f,p,d;for(this.data=t,this.pos=8,this.palette=[],this.imgData=[],this.transparency={},this.animation=null,this.text={},a=null;;){switch(e=this.readUInt32(),h=function(){var t,e;for(e=[],t=0;t<4;++t)e.push(String.fromCharCode(this.data[this.pos++]));return e}.call(this).join("")){case"IHDR":this.width=this.readUInt32(),this.height=this.readUInt32(),this.bits=this.data[this.pos++],this.colorType=this.data[this.pos++],this.compressionMethod=this.data[this.pos++],this.filterMethod=this.data[this.pos++],this.interlaceMethod=this.data[this.pos++];break;case"acTL":this.animation={numFrames:this.readUInt32(),numPlays:this.readUInt32()||1/0,frames:[]};break;case"PLTE":this.palette=this.read(e);break;case"fcTL":a&&this.animation.frames.push(a),this.pos+=4,a={width:this.readUInt32(),height:this.readUInt32(),xOffset:this.readUInt32(),yOffset:this.readUInt32()},o=this.readUInt16(),i=this.readUInt16()||100,a.delay=1e3*o/i,a.disposeOp=this.data[this.pos++],a.blendOp=this.data[this.pos++],a.data=[];break;case"IDAT":case"fdAT":for("fdAT"===h&&(this.pos+=4,e-=4),t=(null!=a?a.data:void 0)||this.imgData,f=0;0<=e?f<e:f>e;0<=e?++f:--f)t.push(this.data[this.pos++]);break;case"tRNS":switch(this.transparency={},this.colorType){case 3:if(r=this.palette.length/3,this.transparency.indexed=this.read(e),this.transparency.indexed.length>r)throw new Error("More transparent colors than palette size");if((u=r-this.transparency.indexed.length)>0)for(p=0;0<=u?p<u:p>u;0<=u?++p:--p)this.transparency.indexed.push(255);break;case 0:this.transparency.grayscale=this.read(e)[0];break;case 2:this.transparency.rgb=this.read(e)}break;case"tEXt":s=(c=this.read(e)).indexOf(0),l=String.fromCharCode.apply(String,c.slice(0,s)),this.text[l]=String.fromCharCode.apply(String,c.slice(s+1));break;case"IEND":return a&&this.animation.frames.push(a),this.colors=function(){switch(this.colorType){case 0:case 3:case 4:return 1;case 2:case 6:return 3}}.call(this),this.hasAlphaChannel=4===(d=this.colorType)||6===d,n=this.colors+(this.hasAlphaChannel?1:0),this.pixelBitlength=this.bits*n,this.colorSpace=function(){switch(this.colors){case 1:return"DeviceGray";case 3:return"DeviceRGB"}}.call(this),void(this.imgData=new Uint8Array(this.imgData));default:this.pos+=e}if(this.pos+=4,this.pos>this.data.length)throw new Error("Incomplete or corrupt PNG file")}}i.load=function(t,e,n){var r;return"function"==typeof e&&(n=e),(r=new XMLHttpRequest).open("GET",t,!0),r.responseType="arraybuffer",r.onload=function(){var t;return t=new i(new Uint8Array(r.response||r.mozResponseArrayBuffer)),"function"==typeof(null!=e?e.getContext:void 0)&&t.render(e),"function"==typeof n?n(t):void 0},r.send(null)},i.prototype.read=function(t){var e,n;for(n=[],e=0;0<=t?e<t:e>t;0<=t?++e:--e)n.push(this.data[this.pos++]);return n},i.prototype.readUInt32=function(){return this.data[this.pos++]<<24|this.data[this.pos++]<<16|this.data[this.pos++]<<8|this.data[this.pos++]},i.prototype.readUInt16=function(){return this.data[this.pos++]<<8|this.data[this.pos++]},i.prototype.decodePixels=function(t){var e=this.pixelBitlength/8,n=new Uint8Array(this.width*this.height*e),r=0,i=this;if(null==t&&(t=this.imgData),0===t.length)return new Uint8Array(0);function o(o,a,s,l){var h,u,c,f,p,d,g,m,y,v,w,b,x,N,L,A,S,_,F,P,k,I=Math.ceil((i.width-o)/s),C=Math.ceil((i.height-a)/l),B=i.width==I&&i.height==C;for(N=e*I,b=B?n:new Uint8Array(N*C),d=t.length,x=0,u=0;x<C&&r<d;){switch(t[r++]){case 0:for(f=S=0;S<N;f=S+=1)b[u++]=t[r++];break;case 1:for(f=_=0;_<N;f=_+=1)h=t[r++],p=f<e?0:b[u-e],b[u++]=(h+p)%256;break;case 2:for(f=F=0;F<N;f=F+=1)h=t[r++],c=(f-f%e)/e,L=x&&b[(x-1)*N+c*e+f%e],b[u++]=(L+h)%256;break;case 3:for(f=P=0;P<N;f=P+=1)h=t[r++],c=(f-f%e)/e,p=f<e?0:b[u-e],L=x&&b[(x-1)*N+c*e+f%e],b[u++]=(h+Math.floor((p+L)/2))%256;break;case 4:for(f=k=0;k<N;f=k+=1)h=t[r++],c=(f-f%e)/e,p=f<e?0:b[u-e],0===x?L=A=0:(L=b[(x-1)*N+c*e+f%e],A=c&&b[(x-1)*N+(c-1)*e+f%e]),g=p+L-A,m=Math.abs(g-p),v=Math.abs(g-L),w=Math.abs(g-A),y=m<=v&&m<=w?p:v<=w?L:A,b[u++]=(h+y)%256;break;default:throw new Error("Invalid filter algorithm: "+t[r-1])}if(!B){var j=((a+x*l)*i.width+o)*e,E=x*N;for(f=0;f<I;f+=1){for(var M=0;M<e;M+=1)n[j++]=b[E++];j+=(s-1)*e}}x++}}return t=(t=new A(t)).getBytes(),1==i.interlaceMethod?(o(0,0,8,8),o(4,0,8,8),o(0,4,4,8),o(2,0,4,4),o(0,2,2,4),o(1,0,2,2),o(0,1,1,2)):o(0,0,1,1),n},i.prototype.decodePalette=function(){var t,e,n,r,i,o,a,s,l;for(n=this.palette,o=this.transparency.indexed||[],i=new Uint8Array((o.length||0)+n.length),r=0,n.length,t=0,e=a=0,s=n.length;a<s;e=a+=3)i[r++]=n[e],i[r++]=n[e+1],i[r++]=n[e+2],i[r++]=null!=(l=o[t++])?l:255;return i},i.prototype.copyToImageData=function(t,e){var n,r,i,o,a,s,l,h,u,c,f;if(r=this.colors,u=null,n=this.hasAlphaChannel,this.palette.length&&(u=null!=(f=this._decodedPalette)?f:this._decodedPalette=this.decodePalette(),r=4,n=!0),h=(i=t.data||t).length,a=u||e,o=s=0,1===r)for(;o<h;)l=u?4*e[o/4]:s,c=a[l++],i[o++]=c,i[o++]=c,i[o++]=c,i[o++]=n?a[l++]:255,s=l;else for(;o<h;)l=u?4*e[o/4]:s,i[o++]=a[l++],i[o++]=a[l++],i[o++]=a[l++],i[o++]=n?a[l++]:255,s=l},i.prototype.decode=function(){var t;return t=new Uint8Array(this.width*this.height*4),this.copyToImageData(t,this.decodePixels()),t};try{n=t.document.createElement("canvas"),r=n.getContext("2d")}catch(t){return-1}return e=function(t){var e;return r.width=t.width,r.height=t.height,r.clearRect(0,0,t.width,t.height),r.putImageData(t,0,0),(e=new Image).src=n.toDataURL(),e},i.prototype.decodeFrames=function(t){var n,r,i,o,a,s,l,h;if(this.animation){for(h=[],r=a=0,s=(l=this.animation.frames).length;a<s;r=++a)n=l[r],i=t.createImageData(n.width,n.height),o=this.decodePixels(new Uint8Array(n.data)),this.copyToImageData(i,o),n.imageData=i,h.push(n.image=e(i));return h}},i.prototype.renderFrame=function(t,e){var n,r,i;return n=(r=this.animation.frames)[e],i=r[e-1],0===e&&t.clearRect(0,0,this.width,this.height),1===(null!=i?i.disposeOp:void 0)?t.clearRect(i.xOffset,i.yOffset,i.width,i.height):2===(null!=i?i.disposeOp:void 0)&&t.putImageData(i.imageData,i.xOffset,i.yOffset),0===n.blendOp&&t.clearRect(n.xOffset,n.yOffset,n.width,n.height),t.drawImage(n.image,n.xOffset,n.yOffset)},i.prototype.animate=function(t){var e,n,r,i,o,a,s=this;return n=0,a=this.animation,i=a.numFrames,r=a.frames,o=a.numPlays,(e=function(){var a,l;if(a=n++%i,l=r[a],s.renderFrame(t,a),i>1&&n/i<o)return s.animation._timeout=setTimeout(e,l.delay)})()},i.prototype.stopAnimation=function(){var t;return clearTimeout(null!=(t=this.animation)?t._timeout:void 0)},i.prototype.render=function(t){var e,n;return t._png&&t._png.stopAnimation(),t._png=this,t.width=this.width,t.height=this.height,e=t.getContext("2d"),this.animation?(this.decodeFrames(e),this.animate(e)):(n=e.createImageData(this.width,this.height),this.copyToImageData(n,this.decodePixels()),e.putImageData(n,0,0))},i}(),t.PNG=e}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof global&&global||Function('return typeof this === "object" && this.content')()||Function("return this")());var L=function(){function t(){this.pos=0,this.bufferLength=0,this.eof=!1,this.buffer=null}return t.prototype={ensureBuffer:function(t){var e=this.buffer,n=e?e.byteLength:0;if(t<n)return e;for(var r=512;r<t;)r<<=1;for(var i=new Uint8Array(r),o=0;o<n;++o)i[o]=e[o];return this.buffer=i},getByte:function(){for(var t=this.pos;this.bufferLength<=t;){if(this.eof)return null;this.readBlock()}return this.buffer[this.pos++]},getBytes:function(t){var e=this.pos;if(t){this.ensureBuffer(e+t);for(var n=e+t;!this.eof&&this.bufferLength<n;)this.readBlock();var r=this.bufferLength;n>r&&(n=r)}else{for(;!this.eof;)this.readBlock();n=this.bufferLength}return this.pos=n,this.buffer.subarray(e,n)},lookChar:function(){for(var t=this.pos;this.bufferLength<=t;){if(this.eof)return null;this.readBlock()}return String.fromCharCode(this.buffer[this.pos])},getChar:function(){for(var t=this.pos;this.bufferLength<=t;){if(this.eof)return null;this.readBlock()}return String.fromCharCode(this.buffer[this.pos++])},makeSubStream:function(t,e,n){for(var r=t+e;this.bufferLength<=r&&!this.eof;)this.readBlock();return new Stream(this.buffer,t,e,n)},skip:function(t){t||(t=1),this.pos+=t},reset:function(){this.pos=0}},t}(),A=function(){if("undefined"!=typeof Uint32Array){var t=new Uint32Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),e=new Uint32Array([3,4,5,6,7,8,9,10,65547,65549,65551,65553,131091,131095,131099,131103,196643,196651,196659,196667,262211,262227,262243,262259,327811,327843,327875,327907,258,258,258]),n=new Uint32Array([1,2,3,4,65541,65543,131081,131085,196625,196633,262177,262193,327745,327777,393345,393409,459009,459137,524801,525057,590849,591361,657409,658433,724993,727041,794625,798721,868353,876545]),r=[new Uint32Array([459008,524368,524304,524568,459024,524400,524336,590016,459016,524384,524320,589984,524288,524416,524352,590048,459012,524376,524312,589968,459028,524408,524344,590032,459020,524392,524328,59e4,524296,524424,524360,590064,459010,524372,524308,524572,459026,524404,524340,590024,459018,524388,524324,589992,524292,524420,524356,590056,459014,524380,524316,589976,459030,524412,524348,590040,459022,524396,524332,590008,524300,524428,524364,590072,459009,524370,524306,524570,459025,524402,524338,590020,459017,524386,524322,589988,524290,524418,524354,590052,459013,524378,524314,589972,459029,524410,524346,590036,459021,524394,524330,590004,524298,524426,524362,590068,459011,524374,524310,524574,459027,524406,524342,590028,459019,524390,524326,589996,524294,524422,524358,590060,459015,524382,524318,589980,459031,524414,524350,590044,459023,524398,524334,590012,524302,524430,524366,590076,459008,524369,524305,524569,459024,524401,524337,590018,459016,524385,524321,589986,524289,524417,524353,590050,459012,524377,524313,589970,459028,524409,524345,590034,459020,524393,524329,590002,524297,524425,524361,590066,459010,524373,524309,524573,459026,524405,524341,590026,459018,524389,524325,589994,524293,524421,524357,590058,459014,524381,524317,589978,459030,524413,524349,590042,459022,524397,524333,590010,524301,524429,524365,590074,459009,524371,524307,524571,459025,524403,524339,590022,459017,524387,524323,589990,524291,524419,524355,590054,459013,524379,524315,589974,459029,524411,524347,590038,459021,524395,524331,590006,524299,524427,524363,590070,459011,524375,524311,524575,459027,524407,524343,590030,459019,524391,524327,589998,524295,524423,524359,590062,459015,524383,524319,589982,459031,524415,524351,590046,459023,524399,524335,590014,524303,524431,524367,590078,459008,524368,524304,524568,459024,524400,524336,590017,459016,524384,524320,589985,524288,524416,524352,590049,459012,524376,524312,589969,459028,524408,524344,590033,459020,524392,524328,590001,524296,524424,524360,590065,459010,524372,524308,524572,459026,524404,524340,590025,459018,524388,524324,589993,524292,524420,524356,590057,459014,524380,524316,589977,459030,524412,524348,590041,459022,524396,524332,590009,524300,524428,524364,590073,459009,524370,524306,524570,459025,524402,524338,590021,459017,524386,524322,589989,524290,524418,524354,590053,459013,524378,524314,589973,459029,524410,524346,590037,459021,524394,524330,590005,524298,524426,524362,590069,459011,524374,524310,524574,459027,524406,524342,590029,459019,524390,524326,589997,524294,524422,524358,590061,459015,524382,524318,589981,459031,524414,524350,590045,459023,524398,524334,590013,524302,524430,524366,590077,459008,524369,524305,524569,459024,524401,524337,590019,459016,524385,524321,589987,524289,524417,524353,590051,459012,524377,524313,589971,459028,524409,524345,590035,459020,524393,524329,590003,524297,524425,524361,590067,459010,524373,524309,524573,459026,524405,524341,590027,459018,524389,524325,589995,524293,524421,524357,590059,459014,524381,524317,589979,459030,524413,524349,590043,459022,524397,524333,590011,524301,524429,524365,590075,459009,524371,524307,524571,459025,524403,524339,590023,459017,524387,524323,589991,524291,524419,524355,590055,459013,524379,524315,589975,459029,524411,524347,590039,459021,524395,524331,590007,524299,524427,524363,590071,459011,524375,524311,524575,459027,524407,524343,590031,459019,524391,524327,589999,524295,524423,524359,590063,459015,524383,524319,589983,459031,524415,524351,590047,459023,524399,524335,590015,524303,524431,524367,590079]),9],i=[new Uint32Array([327680,327696,327688,327704,327684,327700,327692,327708,327682,327698,327690,327706,327686,327702,327694,0,327681,327697,327689,327705,327685,327701,327693,327709,327683,327699,327691,327707,327687,327703,327695,0]),5];return a.prototype=Object.create(L.prototype),a.prototype.getBits=function(t){for(var e,n=this.codeSize,r=this.codeBuf,i=this.bytes,a=this.bytesPos;n<t;)void 0===(e=i[a++])&&o("Bad encoding in flate stream"),r|=e<<n,n+=8;return e=r&(1<<t)-1,this.codeBuf=r>>t,this.codeSize=n-=t,this.bytesPos=a,e},a.prototype.getCode=function(t){for(var e=t[0],n=t[1],r=this.codeSize,i=this.codeBuf,a=this.bytes,s=this.bytesPos;r<n;){var l;void 0===(l=a[s++])&&o("Bad encoding in flate stream"),i|=l<<r,r+=8}var h=e[i&(1<<n)-1],u=h>>16,c=65535&h;return(0==r||r<u||0==u)&&o("Bad encoding in flate stream"),this.codeBuf=i>>u,this.codeSize=r-u,this.bytesPos=s,c},a.prototype.generateHuffmanTable=function(t){for(var e=t.length,n=0,r=0;r<e;++r)t[r]>n&&(n=t[r]);for(var i=1<<n,o=new Uint32Array(i),a=1,s=0,l=2;a<=n;++a,s<<=1,l<<=1)for(var h=0;h<e;++h)if(t[h]==a){var u=0,c=s;for(r=0;r<a;++r)u=u<<1|1&c,c>>=1;for(r=u;r<i;r+=l)o[r]=a<<16|h;++s}return[o,n]},a.prototype.readBlock=function(){function a(t,e,n,r,i){for(var o=t.getBits(n)+r;o-- >0;)e[d++]=i}var s=this.getBits(3);if(1&s&&(this.eof=!0),0!=(s>>=1)){var l,h;if(1==s)l=r,h=i;else if(2==s){for(var u=this.getBits(5)+257,c=this.getBits(5)+1,f=this.getBits(4)+4,p=Array(t.length),d=0;d<f;)p[t[d++]]=this.getBits(3);for(var g=this.generateHuffmanTable(p),m=0,y=(d=0,u+c),v=new Array(y);d<y;){var w=this.getCode(g);16==w?a(this,v,2,3,m):17==w?a(this,v,3,3,m=0):18==w?a(this,v,7,11,m=0):v[d++]=m=w}l=this.generateHuffmanTable(v.slice(0,u)),h=this.generateHuffmanTable(v.slice(u,y))}else o("Unknown block type in flate stream");for(var b=(B=this.buffer)?B.length:0,x=this.bufferLength;;){var N=this.getCode(l);if(N<256)x+1>=b&&(b=(B=this.ensureBuffer(x+1)).length),B[x++]=N;else{if(256==N)return void(this.bufferLength=x);var L=(N=e[N-=257])>>16;L>0&&(L=this.getBits(L));m=(65535&N)+L;N=this.getCode(h),(L=(N=n[N])>>16)>0&&(L=this.getBits(L));var A=(65535&N)+L;x+m>=b&&(b=(B=this.ensureBuffer(x+m)).length);for(var S=0;S<m;++S,++x)B[x]=B[x-A]}}}else{var _,F=this.bytes,P=this.bytesPos;void 0===(_=F[P++])&&o("Bad block header in flate stream");var k=_;void 0===(_=F[P++])&&o("Bad block header in flate stream"),k|=_<<8,void 0===(_=F[P++])&&o("Bad block header in flate stream");var I=_;void 0===(_=F[P++])&&o("Bad block header in flate stream"),(I|=_<<8)!=(65535&~k)&&o("Bad uncompressed block length in flate stream"),this.codeBuf=0,this.codeSize=0;var C=this.bufferLength,B=this.ensureBuffer(C+k),j=C+k;this.bufferLength=j;for(var E=C;E<j;++E){if(void 0===(_=F[P++])){this.eof=!0;break}B[E]=_}this.bytesPos=P}},a}function o(t){throw new Error(t)}function a(t){var e=0,n=t[e++],r=t[e++];-1!=n&&-1!=r||o("Invalid header in flate stream"),8!=(15&n)&&o("Unknown compression method in flate stream"),((n<<8)+r)%31!=0&&o("Bad FCHECK in flate stream"),32&r&&o("FDICT bit set in flate stream"),this.bytes=t,this.bytesPos=2,this.codeSize=0,this.codeBuf=0,L.call(this)}}();window.tmp=A});try{module.exports=jsPDF}catch(t){}



/*Shipmondo JS*/
function openReturnportal(e){if(e&&(-1<e.indexOf("pakkelabels")||-1<e.indexOf("shipmondo"))){var n,t=document.body,i=document.documentElement;window.scrollTo(0,0),n="undefined"!=typeof document.height?document.height:Math.max(t.scrollHeight,t.offsetHeight,i.clientHeight,i.scrollHeight,i.offsetHeight);var o=document.createElement("img");o.style.cssText=["position: absolute;","left: 50%;","top: 200px;","margin-left: -32px;","margin-top: -50px;","display: block;"].join(";"),o.src="https://plugins.shipmondo.com/img/loading_large.gif";var r=document.createElement("iframe");r.style.cssText=["width: 100%","max-width: 768px","display: block","margin: 30px auto","-webkit-border-radius: 3px","-moz-border-radius: 3px","border-radius: 3px","z-index: 2147483647","opacity:0","transition: opacity 0.25s ease-in-out;","-moz-transition: opacity 0.25s ease-in-out;","-webkit-transition: opacity 0.25s ease-in-out;","-webkit-box-shadow: 0 5px 15px rgba(0,0,0,0.5);","box-shadow: 0 5px 15px rgba(0,0,0,0.5);"].join(";"),r.setAttribute("src",e+"/?iframe=true"),r.id="returnportal",r.scrolling="no",r.marginWidth=0,r.marginHeight=0,r.noResize=0,r.border=0,r.frameBorder=0,r.frameSpacing=0,r.background="transparent",r.allowTransparency="allowTransparency",r.onload=function(){o.parentNode.removeChild(o),iFrameResize({enablePublicMethods:!0,heightCalculationMethod:"lowestElement",messageCallback:function(e){"ready"===e.message?r.style.opacity="1":"close"===e.message&&a.remove()}},r)};var a=document.createElement("div");a.style.cssText=["left: 0","top: 0","width: 100%","min-height: "+n+"px","position: absolute","z-index: 2147483646","background: transparent","background: rgba(0,0,0);","background: rgba(0,0,0,0.5);","opacity:0","transition: opacity 0.5s ease-in-out;","-moz-transition: opacity 0.5s ease-in-out;","-webkit-transition: opacity 0.5s ease-in-out;"].join(";"),a.appendChild(r),t.appendChild(a),t.appendChild(o),setTimeout(function(){a.style.opacity="1"},100)}else alert("Korrekt URL til Returportal mangler")}!function(z){"use strict";function h(e,n,t){"addEventListener"in z?e.addEventListener(n,t,!1):"attachEvent"in z&&e.attachEvent("on"+n,t)}function e(){var e,n=["moz","webkit","o","ms"];for(e=0;e<n.length&&!v;e+=1)v=z[n[e]+"RequestAnimationFrame"];v||F("setup","RequestAnimationFrame not supported")}function n(e){var n="Host page: "+e;return z.top!==z.self&&(n=z.parentIFrame&&z.parentIFrame.getId?z.parentIFrame.getId()+": "+e:"Nested host page: "+e),n}function o(e){return A+"["+n(e)+"]"}function t(e){return q[e]?q[e].log:y}function F(e,n){i("log",e,n,t(e))}function M(e,n){i("info",e,n,t(e))}function C(e,n){i("warn",e,n,!0)}function i(e,n,t,i){!0===i&&"object"==typeof z.console&&console[e](o(n),t)}function r(n){function e(){function e(){N(w),E(k)}i("Height"),i("Width"),S(e,w,"init")}function t(){var e=x.substr(L).split(":");return{iframe:q[e[0]].iframe,id:e[0],height:e[1],width:e[2],type:e[3]}}function i(e){var n=Number(q[k]["max"+e]),t=Number(q[k]["min"+e]),i=e.toLowerCase(),o=Number(w[i]);F(k,"Checking "+i+" is in range "+t+"-"+n),o<t&&(o=t,F(k,"Set "+i+" to min value")),n<o&&(o=n,F(k,"Set "+i+" to max value")),w[i]=""+o}function o(){function e(){function e(){var e=0,n=!1;for(F(k,"Checking connection is from allowed list of origins: "+i);e<i.length;e++)if(i[e]===t){n=!0;break}return n}function n(){var e=q[k].remoteHost;return F(k,"Checking connection is from: "+e),t===e}return i.constructor===Array?e():n()}var t=n.origin,i=q[k].checkOrigin;if(i&&""+t!="null"&&!e())throw new Error("Unexpected message received from: "+t+" for "+w.iframe.id+". Message was: "+n.data+". This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.");return!0}function r(){return A===(""+x).substr(0,L)&&x.substr(L).split(":")[0]in q}function a(){var e=w.type in{"true":1,"false":1,undefined:1};return e&&F(k,"Ignoring init message from meta parent page"),e}function s(e){return x.substr(x.indexOf(":")+P+e)}function c(e){F(k,"MessageCallback passed: {iframe: "+w.iframe.id+", message: "+e+"}"),p("messageCallback",{iframe:w.iframe,message:JSON.parse(e)}),F(k,"--")}function u(){var e=document.body.getBoundingClientRect(),n=w.iframe.getBoundingClientRect();W("Send Page Info","pageInfo:"+JSON.stringify({clientHeight:Math.max(document.documentElement.clientHeight,z.innerHeight||0),clientWidth:Math.max(document.documentElement.clientWidth,z.innerWidth||0),offsetTop:parseInt(n.top-e.top,10),offsetLeft:parseInt(n.left-e.left,10),scrollTop:z.pageYOffset,scrollLeft:z.pageXOffset}),q[k].iframe,k)}function l(){var e=!0;return null===w.iframe&&(C(k,"IFrame ("+w.id+") not found"),e=!1),e}function f(e){var n=e.getBoundingClientRect();return O(k),{x:Math.floor(Number(n.left)+Number(B.x)),y:Math.floor(Number(n.top)+Number(B.y))}}function d(e){function n(){B=r,m(),F(k,"--")}function t(){return{x:Number(w.width)+o.x,y:Number(w.height)+o.y}}function i(){z.parentIFrame?z.parentIFrame["scrollTo"+(e?"Offset":"")](r.x,r.y):C(k,"Unable to scroll to requested position, window.parentIFrame not found")}var o=e?f(w.iframe):{x:0,y:0},r=t();F(k,"Reposition requested from iFrame (offset x:"+o.x+" y:"+o.y+")"),z.top!==z.self?i():n()}function m(){!1!==p("scrollCallback",B)?E(k):T()}function g(e){function n(){var e=f(r);F(k,"Moving to in page link (#"+i+") at x: "+e.x+" y: "+e.y),B={x:e.x,y:e.y},m(),F(k,"--")}function t(){z.parentIFrame?z.parentIFrame.moveToAnchor(i):F(k,"In page link #"+i+" not found and window.parentIFrame not found")}var i=e.split("#")[1]||"",o=decodeURIComponent(i),r=document.getElementById(o)||document.getElementsByName(o)[0];r?n():z.top!==z.self?t():F(k,"In page link #"+i+" not found")}function p(e,n){return I(k,e,n)}function h(){switch(q[k].firstRun&&v(),w.type){case"close":R(w.iframe);break;case"message":c(s(6));break;case"scrollTo":d(!1);break;case"scrollToOffset":d(!0);break;case"pageInfo":u();break;case"inPageLink":g(s(9));break;case"reset":H(w);break;case"init":e(),p("initCallback",w.iframe),p("resizedCallback",w);break;default:e(),p("resizedCallback",w)}}function b(e){var n=!0;return q[e]||(n=!1,C(w.type+" No settings for "+e+". Message was: "+x)),n}function y(){for(var e in q)W("iFrame requested init",j(e),document.getElementById(e),e)}function v(){q[k].firstRun=!1}var x=n.data,w={},k=null;"[iFrameResizerChild]Ready"===x?y():r()?(w=t(),k=w.id,!a()&&b(k)&&(F(k,"Received: "+x),l()&&o()&&h())):M(k,"Ignored: "+x)}function I(e,n,t){var i=null,o=null;if(q[e]){if("function"!=typeof(i=q[e][n]))throw new TypeError(n+" on iFrame["+e+"] is not a function");o=i(t)}return o}function R(e){var n=e.id;F(n,"Removing iFrame: "+n),e.parentNode.removeChild(e),I(n,"closedCallback",n),F(n,"--"),delete q[n]}function O(e){null===B&&F(e,"Get page position: "+(B={x:void 0!==z.pageXOffset?z.pageXOffset:document.documentElement.scrollLeft,y:void 0!==z.pageYOffset?z.pageYOffset:document.documentElement.scrollTop}).x+","+B.y)}function E(e){null!==B&&(z.scrollTo(B.x,B.y),F(e,"Set page position: "+B.x+","+B.y),T())}function T(){B=null}function H(e){function n(){N(e),W("reset","reset",e.iframe,e.id)}F(e.id,"Size reset requested by "+("init"===e.type?"host page":"iFrame")),O(e.id),S(n,e,"reset")}function N(n){function t(e){n.iframe.style[e]=n[e]+"px",F(n.id,"IFrame ("+o+") "+e+" set to "+n[e]+"px")}function i(e){p||"0"!==n[e]||(p=!0,F(o,"Hidden iFrame detected, creating visibility listener"),c())}function e(e){t(e),i(e)}var o=n.iframe.id;q[o]&&(q[o].sizeHeight&&e("height"),q[o].sizeWidth&&e("width"))}function S(e,n,t){t!==n.type&&v?(F(n.id,"Requesting animation frame"),v(e)):e()}function W(e,n,t,i){function o(){F(i,"["+e+"] Sending msg to iframe["+i+"] ("+n+") targetOrigin: "+a),t.contentWindow.postMessage(A+n,a)}function r(){M(i,"["+e+"] IFrame("+i+") not found"),q[i]&&delete q[i]}i=i||t.id;var a=q[i].targetOrigin;t&&"contentWindow"in t?o():r()}function j(e){return e+":"+q[e].bodyMarginV1+":"+q[e].sizeWidth+":"+q[e].log+":"+q[e].interval+":"+q[e].enablePublicMethods+":"+q[e].autoResize+":"+q[e].bodyMargin+":"+q[e].heightCalculationMethod+":"+q[e].bodyBackground+":"+q[e].bodyPadding+":"+q[e].tolerance+":"+q[e].inPageLinks+":"+q[e].resizeFrom+":"+q[e].widthCalculationMethod}function a(t,n){function e(){function e(e){1/0!==q[p][e]&&0!==q[p][e]&&(t.style[e]=q[p][e]+"px",F(p,"Set "+e+" = "+q[p][e]+"px"))}function n(e){if(q[p]["min"+e]>q[p]["max"+e])throw new Error("Value for min"+e+" can not be greater than max"+e)}n("Height"),n("Width"),e("maxHeight"),e("minHeight"),e("maxWidth"),e("minWidth")}function i(){var e=n&&n.id||k.id+b++;return null!==document.getElementById(e)&&(e+=b++),e}function o(e){return""===e&&(t.id=e=i(),y=(n||{}).log,F(e,"Added missing iframe ID: "+e+" ("+t.src+")")),e}function r(){F(p,"IFrame scrolling "+(q[p].scrolling?"enabled":"disabled")+" for "+p),t.style.overflow=!1===q[p].scrolling?"hidden":"auto",t.scrolling=!1===q[p].scrolling?"no":"yes"}function a(){("number"==typeof q[p].bodyMargin||"0"===q[p].bodyMargin)&&(q[p].bodyMarginV1=q[p].bodyMargin,q[p].bodyMargin=q[p].bodyMargin+"px")}function s(){var e=q[p].firstRun,n=q[p].heightCalculationMethod in x;!e&&n&&H({iframe:t,height:0,width:0,type:"init"})}function c(){Function.prototype.bind&&(q[p].iframe.iFrameResizer={close:R.bind(null,q[p].iframe),resize:W.bind(null,"Window resize","resize",q[p].iframe),moveToAnchor:function(e){W("Move to anchor","inPageLink:"+e,q[p].iframe,p)},sendMessage:function(e){W("Send Message","message:"+(e=JSON.stringify(e)),q[p].iframe,p)}})}function u(e){function n(){W("iFrame.onload",e,t),s()}h(t,"load",n),W("init",e,t)}function l(e){if("object"!=typeof e)throw new TypeError("Options is not an object")}function f(e){for(var n in k)k.hasOwnProperty(n)&&(q[p][n]=e.hasOwnProperty(n)?e[n]:k[n])}function d(e){return""===e||"file://"===e?"*":e}function m(e){e=e||{},q[p]={firstRun:!0,iframe:t,remoteHost:t.src.split("/").slice(0,3).join("/")},l(e),f(e),q[p].targetOrigin=!0===q[p].checkOrigin?d(q[p].remoteHost):"*"}function g(){return p in q&&"iFrameResizer"in t}var p=o(t.id);g()?C(p,"Ignored iFrame, already setup."):(m(n),r(),e(),a(),u(j(p)),c())}function s(e,n){null===w&&(w=setTimeout(function(){w=null,e()},n))}function c(){function n(){function e(n){function e(e){return"0px"===q[n].iframe.style[e]}function t(e){return null!==e.offsetParent}t(q[n].iframe)&&(e("height")||e("width"))&&W("Visibility change","resize",q[n].iframe,n)}for(var n in q)e(n)}function t(e){F("window","Mutation observed: "+e[0].target+" "+e[0].type),s(n,16)}function e(){var e=document.querySelector("body"),n={attributes:!0,attributeOldValue:!1,characterData:!0,characterDataOldValue:!1,childList:!0,subtree:!0};new i(t).observe(e,n)}var i=z.MutationObserver||z.WebKitMutationObserver;i&&e()}function u(e){function n(){f("Window "+e,"resize")}F("window","Trigger event: "+e),s(n,16)}function l(){function e(){f("Tab Visable","resize")}"hidden"!==document.visibilityState&&(F("document","Trigger event: Visiblity change"),s(e,16))}function f(e,n){function t(e){return"parent"===q[e].resizeFrom&&q[e].autoResize&&!q[e].firstRun}for(var i in q)t(i)&&W(e,n,document.getElementById(i),i)}function d(){h(z,"message",r),h(z,"resize",function(){u("resize")}),h(document,"visibilitychange",l),h(document,"-webkit-visibilitychange",l),h(z,"focusin",function(){u("focus")}),h(z,"focus",function(){u("focus")})}function m(){function t(e,n){if(n){if(!n.tagName)throw new TypeError("Object is not a valid DOM element");if("IFRAME"!==n.tagName.toUpperCase())throw new TypeError("Expected <IFRAME> tag, found <"+n.tagName+">");a(n,e),i.push(n)}}var i;return e(),d(),function(e,n){switch(i=[],typeof n){case"undefined":case"string":Array.prototype.forEach.call(document.querySelectorAll(n||"iframe"),t.bind(void 0,e));break;case"object":t(e,n);break;default:throw new TypeError("Unexpected data type ("+typeof n+")")}return i}}function g(e){e.fn.iFrameResize=function(t){return this.filter("iframe").each(function(e,n){a(n,t)}).end()}}var b=0,y=!1,p=!1,P="message".length,A="[iFrameSizer]",L=A.length,B=null,v=z.requestAnimationFrame,x={max:1,scroll:1,bodyScroll:1,documentElementScroll:1},q={},w=null,k={autoResize:!0,bodyBackground:null,bodyMargin:null,bodyMarginV1:8,bodyPadding:null,checkOrigin:!0,inPageLinks:!1,enablePublicMethods:!0,heightCalculationMethod:"bodyOffset",id:"iFrameResizer",interval:32,log:!1,maxHeight:1/0,maxWidth:1/0,minHeight:0,minWidth:0,resizeFrom:"parent",scrolling:!1,sizeHeight:!0,sizeWidth:!1,tolerance:0,widthCalculationMethod:"scroll",closedCallback:function(){},initCallback:function(){},messageCallback:function(){C("MessageCallback function not defined")},resizedCallback:function(){},scrollCallback:function(){return!0}};z.jQuery&&g(jQuery),"function"==typeof define&&define.amd?define([],m):"object"==typeof module&&"object"==typeof module.exports?module.exports=m():z.iFrameResize=z.iFrameResize||m()}(window||{});


/*!
 *
 *             jsPDF AutoTable plugin v3.5.3
 *
 *             Copyright (c) 2020 Simon Bengtsson, https://github.com/simonbengtsson/jsPDF-AutoTable
 *             Licensed under the MIT License.
 *             http://opensource.org/licenses/mit-license
 *
 */
!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e(function(){try{return require("jspdf")}catch(t){}}());else if("function"==typeof define&&define.amd)define(["jspdf"],e);else{var n="object"==typeof exports?e(function(){try{return require("jspdf")}catch(t){}}()):e(t.jsPDF);for(var o in n)("object"==typeof exports?exports:t)[o]=n[o]}}(this,(function(t){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=9)}([function(t,e,n){"use strict";function o(t,e){var n=t>0,o=e||0===e;return n&&o?"DF":n?"S":o?"F":null}Object.defineProperty(e,"__esModule",{value:!0}),e.getStringWidth=function(t,e,n){return n.applyStyles(e,!0),(Array.isArray(t)?t:[t]).map((function(t){return n.getTextWidth(t)})).reduce((function(t,e){return Math.max(t,e)}),0)},e.addTableBorder=function(t,e){var n=t.settings.tableLineWidth,r=t.settings.tableLineColor;e.applyStyles({lineWidth:n,lineColor:r});var i=o(n,!1);i&&e.rect(t.pageStartX,t.pageStartY,t.width,t.cursor.y-t.pageStartY,i)},e.getFillStyle=o,e.marginOrPadding=function(t,e){var n,o,r,i;if(t=t||e,Array.isArray(t)){if(t.length>=4)return{top:t[0],right:t[1],bottom:t[2],left:t[3]};if(3===t.length)return{top:t[0],right:t[1],bottom:t[2],left:t[1]};if(2===t.length)return{top:t[0],right:t[1],bottom:t[0],left:t[1]};t=1===t.length?t[0]:e}return"object"==typeof t?("number"==typeof t.vertical&&(t.top=t.vertical,t.bottom=t.vertical),"number"==typeof t.horizontal&&(t.right=t.horizontal,t.left=t.horizontal),{left:null!==(n=t.left)&&void 0!==n?n:e,top:null!==(o=t.top)&&void 0!==o?o:e,right:null!==(r=t.right)&&void 0!==r?r:e,bottom:null!==(i=t.bottom)&&void 0!==i?i:e}):("number"!=typeof t&&(t=e),{top:t,right:t,bottom:t,left:t})}},function(t,e,n){"use strict";var o,r=this&&this.__extends||(o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(e,"__esModule",{value:!0}),e.FONT_ROW_RATIO=1.15;var i=function(t){function e(e){var n=t.call(this)||this;return n._element=e,n}return r(e,t),e}(Array);e.HtmlRowInput=i,e.defaultStyles=function(t){return{font:"helvetica",fontStyle:"normal",overflow:"linebreak",fillColor:!1,textColor:20,halign:"left",valign:"top",fontSize:10,cellPadding:5/t,lineColor:200,lineWidth:0,cellWidth:"auto",minCellHeight:0,minCellWidth:0}},e.getTheme=function(t){return{striped:{table:{fillColor:255,textColor:80,fontStyle:"normal"},head:{textColor:255,fillColor:[41,128,185],fontStyle:"bold"},body:{},foot:{textColor:255,fillColor:[41,128,185],fontStyle:"bold"},alternateRow:{fillColor:245}},grid:{table:{fillColor:255,textColor:80,fontStyle:"normal",lineWidth:.1},head:{textColor:255,fillColor:[26,188,156],fontStyle:"bold",lineWidth:0},body:{},foot:{textColor:255,fillColor:[26,188,156],fontStyle:"bold",lineWidth:0},alternateRow:{}},plain:{head:{fontStyle:"bold"},foot:{fontStyle:"bold"}}}[t]}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o={},r=function(){function t(t){this.jsPDFDocument=t,this.userStyles={textColor:t.getTextColor?this.jsPDFDocument.getTextColor():0,fontSize:t.internal.getFontSize(),fontStyle:t.internal.getFont().fontStyle,font:t.internal.getFont().fontName}}return t.setDefaults=function(t,e){void 0===e&&(e=null),e?e.__autoTableDocumentDefaults=t:o=t},t.unifyColor=function(t){return Array.isArray(t)?t:"number"==typeof t?[t,t,t]:"string"==typeof t?[t]:null},t.prototype.applyStyles=function(e,n){var o,r,i;if(void 0===n&&(n=!1),e.fontStyle&&this.jsPDFDocument.setFontStyle(e.fontStyle),e.font&&this.jsPDFDocument.setFont(e.font),e.fontSize&&this.jsPDFDocument.setFontSize(e.fontSize),!n){var l=t.unifyColor(e.fillColor);l&&(o=this.jsPDFDocument).setFillColor.apply(o,l),(l=t.unifyColor(e.textColor))&&(r=this.jsPDFDocument).setTextColor.apply(r,l),(l=t.unifyColor(e.lineColor))&&(i=this.jsPDFDocument).setDrawColor.apply(i,l),"number"==typeof e.lineWidth&&this.jsPDFDocument.setLineWidth(e.lineWidth)}},t.prototype.splitTextToSize=function(t,e,n){return this.jsPDFDocument.splitTextToSize(t,e,n)},t.prototype.rect=function(t,e,n,o,r){return this.jsPDFDocument.rect(t,e,n,o,r)},t.prototype.getPreviousAutoTable=function(){return this.jsPDFDocument.previousAutoTable},t.prototype.getTextWidth=function(t){return this.jsPDFDocument.getTextWidth(t)},t.prototype.getDocument=function(){return this.jsPDFDocument},t.prototype.setPage=function(t){this.jsPDFDocument.setPage(t)},t.prototype.addPage=function(){return this.jsPDFDocument.addPage()},t.prototype.getFontList=function(){return this.jsPDFDocument.getFontList()},t.prototype.getGlobalOptions=function(){return o||{}},t.prototype.getDocumentOptions=function(){return this.jsPDFDocument.__autoTableDocumentDefaults||{}},t.prototype.pageSize=function(){var t=this.jsPDFDocument.internal.pageSize;return null==t.width&&(t={width:t.getWidth(),height:t.getHeight()}),t},t.prototype.scaleFactor=function(){return this.jsPDFDocument.internal.scaleFactor},t.prototype.pageNumber=function(){var t=this.jsPDFDocument.internal.getCurrentPageInfo();return t?t.pageNumber:this.jsPDFDocument.internal.getNumberOfPages()},t}();e.DocHandler=r},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(11),r=n(1);function i(t,e,n,i,a,s){for(var u=new r.HtmlRowInput(i),d=0;d<i.cells.length;d++){var h=i.cells[d],c=n.getComputedStyle(h);if(a||"none"!==c.display){var f=void 0;s&&(f=o.parseCss(t,h,e,c,n)),u.push({rowSpan:h.rowSpan,colSpan:h.colSpan,styles:f,_element:h,content:l(h)})}}var g=n.getComputedStyle(i);if(u.length>0&&(a||"none"!==g.display))return u}function l(t){var e=t.cloneNode(!0);return e.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/ +/g," "),e.innerHTML=e.innerHTML.split("<br>").map((function(t){return t.trim()})).join("\n"),e.innerText||e.textContent||""}e.parseHtml=function(t,e,n,o,r){var l,a,s;void 0===o&&(o=!1),void 0===r&&(r=!1),s="string"==typeof e?n.document.querySelector(e):e;var u=Object.keys(t.getFontList()),d=t.scaleFactor(),h=[],c=[],f=[];if(!s)return console.error("Html table could not be found with input: ",e),{head:h,body:c,foot:f};for(var g=0;g<s.rows.length;g++){var p=s.rows[g],y=null===(a=null===(l=null==p?void 0:p.parentElement)||void 0===l?void 0:l.tagName)||void 0===a?void 0:a.toLowerCase(),v=i(u,d,n,p,o,r);v&&("thead"===y?h.push(v):"tfoot"===y?f.push(v):c.push(v))}return{head:h,body:c,foot:f}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e,n,o,r){o=o||{};var i=r.internal.scaleFactor,l=r.internal.getFontSize()/i,a="",s=1;if("middle"!==o.valign&&"bottom"!==o.valign&&"center"!==o.halign&&"right"!==o.halign||(s=(a="string"==typeof t?t.split(/\r\n|\r|\n/g):t).length||1),n+=l*(2-1.15),"middle"===o.valign?n-=s/2*l*1.15:"bottom"===o.valign&&(n-=s*l*1.15),"center"===o.halign||"right"===o.halign){var u=l;if("center"===o.halign&&(u*=.5),a&&s>=1){for(var d=0;d<a.length;d++)r.text(a[d],e-r.getStringUnitWidth(a[d])*u,n),n+=1.15*l;return r}e-=r.getStringUnitWidth(t)*u}return"justify"===o.halign?r.text(t,e,n,{maxWidth:o.maxWidth||100,align:"justify"}):r.text(t,e,n),r}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(3),i=n(6),l=n(0),a=n(2),s=n(12),u=n(7),d=n(14);function h(t,e,n,o,r,i,l){var a={};return e.map((function(e,n){for(var s=0,d=new u.Row(e,n,t),h=0,c=0,f=0,p=o;f<p.length;f++){var y=p[f];if(null==a[y.index]||0===a[y.index].left)if(0===c){var v=void 0,m={};"object"!=typeof(v=Array.isArray(e)?e[y.index-h-s]:e[y.dataKey])||Array.isArray(v)||(m=(null==v?void 0:v.styles)||{});var b=g(t,y,n,i,r,l,m),w=new u.Cell(v,b,t);d.cells[y.dataKey]=w,d.cells[y.index]=w,c=w.colSpan-1,a[y.index]={left:w.rowSpan-1,times:c}}else c--,h++;else a[y.index].left--,c=a[y.index].times,s++}return d}))}function c(t,e){var n={};return t.forEach((function(t){if(null!=t.raw){var o=function(t,e){if("head"===t){if("object"==typeof e)return e.header||e.title||null;if("string"==typeof e||"number"==typeof e)return e}else if("foot"===t&&"object"==typeof e)return e.footer;return null}(e,t.raw);null!=o&&(n[t.dataKey]=o)}})),Object.keys(n).length>0?n:null}function f(t,e,n){var o=t[0]||e[0]||n[0]||[],r=[];return Object.keys(o).filter((function(t){return"_element"!==t})).forEach((function(t){var e,n=1;"object"!=typeof(e=Array.isArray(o)?o[parseInt(t)]:o[t])||Array.isArray(e)||(n=(null==e?void 0:e.colSpan)||1);for(var i=0;i<n;i++){var l=void 0;l=Array.isArray(o)?r.length:t+(i>0?"_"+i:""),r.push({dataKey:l,header:e})}})),r}function g(t,e,n,r,l,a,s){var u,d=o.getTheme(r);"head"===t?u=l.headStyles:"body"===t?u=l.bodyStyles:"foot"===t&&(u=l.footStyles);var h=i.assign({},d.table,d[t],l.styles,u),c=l.columnStyles[e.dataKey]||l.columnStyles[e.index]||{},f="body"===t?c:{},g="body"===t&&n%2==0?i.assign({},d.alternateRow,l.alternateRowStyles):{},p=o.defaultStyles(a),y=i.assign({},p,h,g,f);return i.assign(y,s)}e.createTable=function(t,e){var n=new a.DocHandler(t),o=n.getDocumentOptions(),g=n.getGlobalOptions();s.default(g,o,e,n);var p,y=i.assign({},g,o,e),v=n.getPreviousAutoTable(),m=n.scaleFactor(),b=l.marginOrPadding(y.margin,40/m),w=function(t,e,n,o){var r,i,l,a,s,u,d,h,c,f,g;f=!0===t.showFoot?"everyPage":!1===t.showFoot?"never":null!==(r=t.showFoot)&&void 0!==r?r:"everyPage";g=!0===t.showHead?"everyPage":!1===t.showHead?"never":null!==(i=t.showHead)&&void 0!==i?i:"everyPage";var p=null!==(l=t.useCss)&&void 0!==l&&l,y=t.theme||(p?"plain":"striped");return{includeHiddenHtml:null!==(a=t.includeHiddenHtml)&&void 0!==a&&a,useCss:p,theme:y,startY:n,margin:o,pageBreak:null!==(s=t.pageBreak)&&void 0!==s?s:"auto",rowPageBreak:null!==(u=t.rowPageBreak)&&void 0!==u?u:"auto",tableWidth:null!==(d=t.tableWidth)&&void 0!==d?d:"auto",showHead:g,showFoot:f,tableLineWidth:null!==(h=t.tableLineWidth)&&void 0!==h?h:0,tableLineColor:null!==(c=t.tableLineColor)&&void 0!==c?c:200}}(y,0,function(t,e,n,o,r){var i=!1;if(t){var l=t.startPageNumber+t.pageNumber-1;i=l===n}var a=o.startY;null!=a&&!1!==a||i&&(a=t.finalY+20/e);return a||r}(v,m,n.pageNumber(),y,b.top),b),x=function(t,e,n){for(var o={styles:{},headStyles:{},bodyStyles:{},footStyles:{},alternateRowStyles:{},columnStyles:{}},r=function(r){if("columnStyles"===r){var l=t[r],a=e[r],s=n[r];o.columnStyles=i.assign({},l,a,s)}else{var u=[t,e,n].map((function(t){return t[r]||{}}));o[r]=i.assign({},u[0],u[1],u[2])}},l=0,a=Object.keys(o);l<a.length;l++){var s=a[l];r(s)}return o}(g,o,e);"undefined"!=typeof window&&(p=window);var P=function(t,e,n,o,i,l){var a=e.head||[],s=e.body||[],d=e.foot||[];if(e.html){var g=e.includeHiddenHtml;if(l){var p=r.parseHtml(t,e.html,l,g,e.useCss)||{};a=p.head||a,s=p.body||a,d=p.foot||a}else console.error("Cannot parse html in non browser environment")}var y=function(t){return t.map((function(t,e){var n,o,r;return r="object"==typeof t&&null!==(o=null!==(n=t.dataKey)&&void 0!==n?n:t.key)&&void 0!==o?o:e,new u.Column(r,t,e)}))}(e.columns||f(a,s,d));if(0===a.length&&e.columns){(v=c(y,"head"))&&a.push(v)}if(0===d.length&&e.columns){var v;(v=c(y,"foot"))&&d.push(v)}return{columns:y,head:h("head",a,e,y,n,o,i),body:h("body",s,e,y,n,o,i),foot:h("foot",d,e,y,n,o,i)}}(n,y,x,w.theme,m,p),S=new u.Table(e.tableId,w,x,function(t,e,n){for(var o={didParseCell:[],willDrawCell:[],didDrawCell:[],didDrawPage:[]},r=0,i=[t,e,n];r<i.length;r++){var l=i[r];l.didParseCell&&o.didParseCell.push(l.didParseCell),l.willDrawCell&&o.willDrawCell.push(l.willDrawCell),l.didDrawCell&&o.didDrawCell.push(l.didDrawCell),l.didDrawPage&&o.didDrawPage.push(l.didDrawPage)}return o}(g,o,e),P);return function(t,e,n){t.allRows().forEach((function(o){for(var r=0,i=t.columns;r<i.length;r++){var a=i[r],s=o.cells[a.index];if(s){t.callCellHooks(n,t.hooks.didParseCell,s,o,a);var u=s.padding("horizontal");s.contentWidth=l.getStringWidth(s.text,s.styles,n)+u;var d=l.getStringWidth(s.text.join(" ").split(/\s+/),s.styles,n);if(s.minReadableWidth=d+s.padding("horizontal"),"number"==typeof s.styles.cellWidth)s.minWidth=s.styles.cellWidth,s.wrappedWidth=s.styles.cellWidth;else if("wrap"===s.styles.cellWidth)s.minWidth=s.contentWidth,s.wrappedWidth=s.contentWidth;else{var h=10/e;s.minWidth=s.styles.minCellWidth||h,s.wrappedWidth=s.contentWidth,s.minWidth>s.wrappedWidth&&(s.wrappedWidth=s.minWidth)}}}})),t.allRows().forEach((function(e){for(var n=0,o=t.columns;n<o.length;n++){var r=o[n],i=e.cells[r.index];if(i&&1===i.colSpan)r.wrappedWidth=Math.max(r.wrappedWidth,i.wrappedWidth),r.minWidth=Math.max(r.minWidth,i.minWidth),r.minReadableWidth=Math.max(r.minReadableWidth,i.minReadableWidth);else{var l=(t.styles.columnStyles[r.dataKey]||t.styles.columnStyles[r.index]||{}).cellWidth;l&&"number"==typeof l&&(r.minWidth=l,r.wrappedWidth=l)}i&&(i.colSpan>1&&!r.minWidth&&(r.minWidth=i.minWidth),i.colSpan>1&&!r.wrappedWidth&&(r.wrappedWidth=i.minWidth))}}))}(S,m,n),S.minWidth=S.columns.reduce((function(t,e){return t+e.minWidth}),0),S.wrappedWidth=S.columns.reduce((function(t,e){return t+e.wrappedWidth}),0),"number"==typeof S.settings.tableWidth?S.width=S.settings.tableWidth:"wrap"===S.settings.tableWidth?S.width=S.wrappedWidth:S.width=n.pageSize().width-b.left-b.right,d.calculateWidths(n,S),n.applyStyles(n.userStyles),S},e.getColumnDef=f},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.assign=function(t,e,n,o,r){if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var i=Object(t),l=1;l<arguments.length;l++){var a=arguments[l];if(null!=a)for(var s in a)Object.prototype.hasOwnProperty.call(a,s)&&(i[s]=a[s])}return i}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(13),i=n(0),l=function(){function t(t,e,n,o,r){this.cursor={x:0,y:0},this.columns=[],this.head=[],this.body=[],this.foot=[],this.wrappedWidth=0,this.minWidth=0,this.width=0,this.height=0,this.headHeight=0,this.footHeight=0,this.startPageNumber=1,this.pageNumber=1,this.pageCount=1,this.pageStartX=0,this.pageStartY=0,this.finalY=0,this.id=t,this.settings=e,this.styles=n,this.hooks=o,this.columns=r.columns,this.head=r.head,this.body=r.body,this.foot=r.foot}return t.prototype.allRows=function(){return this.head.concat(this.body).concat(this.foot)},t.prototype.callCellHooks=function(t,e,n,o,i){for(var l=0,a=e;l<a.length;l++){var s=!1===(0,a[l])(new r.CellHookData(this,t,n,o,i));if(n.text=Array.isArray(n.text)?n.text:[n.text],s)return!1}return!0},t.prototype.callEndPageHooks=function(t){t.applyStyles(t.userStyles);for(var e=0,n=this.hooks.didDrawPage;e<n.length;e++){(0,n[e])(new r.HookData(this,t))}},t}();e.Table=l;var a=function(){function t(t,e,n){this.cells={},this.height=0,this.maxCellHeight=0,this.x=0,this.y=0,this.spansMultiplePages=!1,this.raw=t,t instanceof o.HtmlRowInput&&(this.raw=t._element,this.element=t._element),this.index=e,this.section=n}return t.prototype.hasRowSpan=function(t){var e=this;return t.filter((function(t){var n=e.cells[t.index];return!!n&&n.rowSpan>1})).length>0},t.prototype.canEntireRowFit=function(t){return this.maxCellHeight<=t},t.prototype.getMinimumRowHeight=function(t,e){var n=this;return t.reduce((function(t,r){var i=n.cells[r.index];if(!i)return 0;var l=i.styles.fontSize/e.scaleFactor()*o.FONT_ROW_RATIO,a=i.padding("vertical")+l;return a>t?a:t}),0)},t}();e.Row=a;var s=function(){function t(t,e,n){var o,r;this.contentHeight=0,this.contentWidth=0,this.wrappedWidth=0,this.minReadableWidth=0,this.minWidth=0,this.width=0,this.height=0,this.textPos={y:0,x:0},this.x=0,this.y=0,this.colSpan=1,this.rowSpan=1,this.styles=e,this.section=n,this.raw=t;var i=t;null==t||"object"!=typeof t||Array.isArray(t)||(this.rowSpan=t.rowSpan||1,this.colSpan=t.colSpan||1,i=null!==(r=null!==(o=t.content)&&void 0!==o?o:t.title)&&void 0!==r?r:t,t._element&&(this.raw=t._element));var l=null!=i?""+i:"";this.text=l.split(/\r\n|\r|\n/g)}return t.prototype.getContentHeight=function(t){return(Array.isArray(this.text)?this.text.length:1)*(this.styles.fontSize/t*o.FONT_ROW_RATIO)+this.padding("vertical")},t.prototype.padding=function(t){var e=i.marginOrPadding(this.styles.cellPadding,0);return"vertical"===t?e.top+e.bottom:"horizontal"===t?e.left+e.right:e[t]},t}();e.Cell=s;var u=function(){function t(t,e,n){this.wrappedWidth=0,this.minReadableWidth=0,this.minWidth=0,this.width=0,this.dataKey=t,this.raw=e,this.index=n}return t.prototype.getMaxCustomCellWidth=function(t){for(var e=0,n=0,o=t.allRows();n<o.length;n++){var r=o[n].cells[this.index];r&&"number"==typeof r.styles.cellWidth&&(e=Math.max(e,r.styles.cellWidth))}return e},t}();e.Column=u},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(0),i=n(7),l=n(2),a=n(6),s=n(4);function u(t,e,n){var r=t.styles.fontSize/n.scaleFactor()*o.FONT_ROW_RATIO,i=t.padding("vertical"),l=Math.floor((e-i)/r);return Math.max(0,l)}function d(t,e,n){t.cursor.x=t.settings.margin.left,e.y=t.cursor.y,e.x=t.cursor.x;for(var o=0,i=t.columns;o<i.length;o++){var l=i[o],a=e.cells[l.index];if(a){if(n.applyStyles(a.styles),a.x=t.cursor.x,a.y=e.y,"top"===a.styles.valign)a.textPos.y=t.cursor.y+a.padding("top");else if("bottom"===a.styles.valign)a.textPos.y=t.cursor.y+a.height-a.padding("bottom");else{var u=a.height-a.padding("vertical");a.textPos.y=t.cursor.y+u/2+a.padding("top")}if("right"===a.styles.halign)a.textPos.x=a.x+a.width-a.padding("right");else if("center"===a.styles.halign){var d=a.width-a.padding("horizontal");a.textPos.x=a.x+d/2+a.padding("left")}else a.textPos.x=a.x+a.padding("left");if(!1!==t.callCellHooks(n,t.hooks.willDrawCell,a,e,l)){var h=a.styles,c=r.getFillStyle(h.lineWidth,h.fillColor);c&&n.rect(a.x,t.cursor.y,a.width,a.height,c),s.default(a.text,a.textPos.x,a.textPos.y,{halign:a.styles.halign,valign:a.styles.valign,maxWidth:Math.ceil(a.width-a.padding("left")-a.padding("right"))},n.getDocument()),t.callCellHooks(n,t.hooks.didDrawCell,a,e,l),t.cursor.x+=l.width}else t.cursor.x+=l.width}else t.cursor.x+=l.width}t.cursor.y+=e.height}function h(t,e){e.applyStyles(e.userStyles),"everyPage"===t.settings.showFoot&&t.foot.forEach((function(n){return d(t,n,e)})),t.finalY=t.cursor.y,t.callEndPageHooks(e);var n=t.settings.margin;r.addTableBorder(t,e),c(e),t.pageNumber++,t.pageCount++,t.cursor={x:n.left,y:n.top},t.pageStartX=t.cursor.x,t.pageStartY=t.cursor.y,"everyPage"===t.settings.showHead&&t.head.forEach((function(n){return d(t,n,e)}))}function c(t){var e=t.pageNumber();t.setPage(e+1),t.pageNumber()===e&&t.addPage()}e.drawTable=function(t,e){var n=e.settings,o=n.startY,s=n.margin;e.cursor={x:s.left,y:o};var f=o+s.bottom+e.headHeight+e.footHeight;"avoid"===n.pageBreak&&(f+=e.height);var g=new l.DocHandler(t);("always"===n.pageBreak||null!=n.startY&&f>g.pageSize().height)&&(c(g),e.cursor.y=s.top),e.pageStartX=e.cursor.x,e.pageStartY=e.cursor.y,e.startPageNumber=g.pageNumber(),g.applyStyles(g.userStyles),"firstPage"!==n.showHead&&"everyPage"!==n.showHead||e.head.forEach((function(t){return d(e,t,g)})),g.applyStyles(g.userStyles),e.body.forEach((function(t,n){!function t(e,n,o,r){var l=function(t,e,n){var o=t.settings.margin.bottom,r=t.settings.showFoot;("everyPage"===r||"lastPage"===r&&e)&&(o+=t.footHeight);return n.pageSize().height-t.cursor.y-o}(e,o,r);if(n.canEntireRowFit(l))d(e,n,r);else if(function(t,e,n,o){var r=t.pageSize().height,i=o.settings.margin,l=i.top+i.bottom,a=r-l;"body"===e.section&&(a-=o.headHeight+o.footHeight);var s=e.getMinimumRowHeight(o.columns,t),u=s<n;if(s>a)return console.error("Will not be able to print row "+e.index+" correctly since it's minimum height is larger than page height"),!0;if(!u)return!1;var d=e.hasRowSpan(o.columns);if(e.maxCellHeight>a)return d&&console.error("The content of row "+e.index+" will not be drawn correctly since drawing rows with a height larger than the page height and has cells with rowspans is not supported."),!0;if(d)return!1;if("avoid"===o.settings.rowPageBreak)return!1;return!0}(r,n,l,e)){var s=function(t,e,n,o){var r=new i.Row(t.raw,-1,t.section);r.spansMultiplePages=!0,t.spansMultiplePages=!0,t.height=0,t.maxCellHeight=0;for(var l=0,s=n.columns;l<s.length;l++){var d=s[l];if(y=t.cells[d.index]){Array.isArray(y.text)||(y.text=[y.text]);var h=new i.Cell(y.raw,y.styles,y.section);(h=a.assign(h,y)).textPos=a.assign({},y.textPos),h.text=[];var c=u(y,e,o);y.text.length>c&&(h.text=y.text.splice(c,y.text.length));var f=o.scaleFactor();y.contentHeight=y.getContentHeight(f),y.contentHeight>t.height&&(t.height=y.contentHeight,t.maxCellHeight=y.contentHeight),h.contentHeight=h.getContentHeight(f),h.contentHeight>r.height&&(r.height=h.contentHeight,r.maxCellHeight=h.contentHeight),r.cells[d.index]=h}}for(var g=0,p=n.columns;g<p.length;g++){var y;d=p[g];(h=r.cells[d.index])&&(h.height=r.height),(y=t.cells[d.index])&&(y.height=t.height)}return r}(n,l,e,r);d(e,n,r),h(e,r),t(e,s,o,r)}else h(e,r),t(e,n,o,r)}(e,t,n===e.body.length-1,g)})),g.applyStyles(g.userStyles),"lastPage"!==n.showFoot&&"everyPage"!==n.showFoot||e.foot.forEach((function(t){return d(e,t,g)})),r.addTableBorder(e,g),e.callEndPageHooks(g),e.finalY=e.cursor.y,t.previousAutoTable=e,t.lastAutoTable=e,t.autoTable&&(t.autoTable.previous=e),g.applyStyles(g.userStyles)},e.addPage=h},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(10),r=n(5),i=n(8);function l(t){o.default(t)}e.applyPlugin=l,e.default=function(t,e){var n=r.createTable(t,e);i.drawTable(t,n)};try{l(n(15))}catch(t){}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(3),r=n(4),i=n(2),l=n(5),a=n(8);e.default=function(t){t.API.autoTable=function(){for(var t,e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];1===e.length?t=e[0]:(console.error("Use of deprecated autoTable initiation"),(t=e[2]||{}).columns=e[0],t.body=e[1]);var o=l.createTable(this,t);return a.drawTable(this,o),this},t.API.lastAutoTable=!1,t.API.previousAutoTable=!1,t.API.autoTable.previous=!1,t.API.autoTableText=function(t,e,n,o){r.default(t,e,n,o,this)},t.API.autoTableSetDefaults=function(t){return i.DocHandler.setDefaults(t,this),this},t.autoTableSetDefaults=function(t,e){i.DocHandler.setDefaults(t,e)},t.API.autoTableHtmlToJson=function(t,e){if(void 0===e&&(e=!1),"undefined"==typeof window)return console.error("Cannot run autoTableHtmlToJson in non browser environment"),null;var n=new i.DocHandler(this),r=o.parseHtml(n,t,window,e,!1),a=r.head,s=r.body,u=r.foot;return{columns:l.getColumnDef(a,s,u),rows:s,data:s}},t.API.autoTableEndPosY=function(){console.error("Use of deprecated function: autoTableEndPosY. Use doc.previousAutoTable.finalY instead.");var t=this.previousAutoTable;return t.cursor&&"number"==typeof t.cursor.y?t.cursor.y:0},t.API.autoTableAddPageContent=function(e){return console.error("Use of deprecated function: autoTableAddPageContent. Use jsPDF.autoTableSetDefaults({didDrawPage: () => {}}) instead."),t.API.autoTable.globalDefaults||(t.API.autoTable.globalDefaults={}),t.API.autoTable.globalDefaults.addPageContent=e,this},t.API.autoTableAddPage=function(){return console.error("Use of deprecated function: autoTableAddPage. Use doc.addPage()"),this.addPage(),this}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(0);function r(t,e){var n=function t(e,n){var o=n(e);return"rgba(0, 0, 0, 0)"===o||"transparent"===o||"initial"===o||"inherit"===o?null==e.parentElement?null:t(e.parentElement,n):o}(t,e);if(!n)return null;var o=n.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d*))?\)$/);if(!o||!Array.isArray(o))return null;var r=[parseInt(o[1]),parseInt(o[2]),parseInt(o[3])];return 0===parseInt(o[4])||isNaN(r[0])||isNaN(r[1])||isNaN(r[2])?null:r}e.parseCss=function(t,e,n,i,l){var a={},s=r(e,(function(t){return l.getComputedStyle(t).backgroundColor}));null!=s&&(a.fillColor=s),null!=(s=r(e,(function(t){return l.getComputedStyle(t).color})))&&(a.textColor=s),null!=(s=r(e,(function(t){return l.getComputedStyle(t).borderTopColor})))&&(a.lineColor=s);var u=function(t,e){var n=[t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft],r=96/(72/e),i=(parseInt(t.lineHeight)-parseInt(t.fontSize))/e/2,l=n.map((function(t){return parseInt(t)/r})),a=o.marginOrPadding(l,0);i>a.top&&(a.top=i);i>a.bottom&&(a.bottom=i);return a}(i,n);u&&(a.cellPadding=u);var d=parseInt(i.borderTopWidth||"");(d=d/(96/72)/n)&&(a.lineWidth=d);var h=["left","right","center","justify"];-1!==h.indexOf(i.textAlign)&&(a.halign=i.textAlign),-1!==(h=["middle","bottom","top"]).indexOf(i.verticalAlign)&&(a.valign=i.verticalAlign);var c=parseInt(i.fontSize||"");isNaN(c)||(a.fontSize=c/(96/72));var f=function(t){var e="";("bold"===t.fontWeight||"bolder"===t.fontWeight||parseInt(t.fontWeight)>=700)&&(e="bold");"italic"!==t.fontStyle&&"oblique"!==t.fontStyle||(e+="italic");return e}(i);f&&(a.fontStyle=f);var g=(i.fontFamily||"").toLowerCase();return-1!==t.indexOf(g)&&(a.font=g),a}},function(t,e,n){"use strict";function o(t){t.rowHeight?(console.error("Use of deprecated style rowHeight. It is renamed to minCellHeight."),t.minCellHeight||(t.minCellHeight=t.rowHeight)):t.columnWidth&&(console.error("Use of deprecated style columnWidth. It is renamed to cellWidth."),t.cellWidth||(t.cellWidth=t.columnWidth))}Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e,n,r){for(var i=function(t){t&&"object"!=typeof t&&console.error("The options parameter should be of type object, is: "+typeof t),void 0!==t.extendWidth&&(t.tableWidth=t.extendWidth?"auto":"wrap",console.error("Use of deprecated option: extendWidth, use tableWidth instead.")),void 0!==t.margins&&(void 0===t.margin&&(t.margin=t.margins),console.error("Use of deprecated option: margins, use margin instead.")),t.startY&&"number"!=typeof t.startY&&(console.error("Invalid value for startY option",t.startY),delete t.startY),!t.didDrawPage&&(t.afterPageContent||t.beforePageContent||t.afterPageAdd)&&(console.error("The afterPageContent, beforePageContent and afterPageAdd hooks are deprecated. Use didDrawPage instead"),t.didDrawPage=function(e){r.applyStyles(r.userStyles),t.beforePageContent&&t.beforePageContent(e),r.applyStyles(r.userStyles),t.afterPageContent&&t.afterPageContent(e),r.applyStyles(r.userStyles),t.afterPageAdd&&e.pageNumber>1&&e.afterPageAdd(e),r.applyStyles(r.userStyles)}),["createdHeaderCell","drawHeaderRow","drawRow","drawHeaderCell"].forEach((function(e){t[e]&&console.error('The "'+e+'" hook has changed in version 3.0, check the changelog for how to migrate.')})),[["showFoot","showFooter"],["showHead","showHeader"],["didDrawPage","addPageContent"],["didParseCell","createdCell"],["headStyles","headerStyles"]].forEach((function(e){var n=e[0],o=e[1];t[o]&&(console.error("Use of deprecated option "+o+". Use "+n+" instead"),t[n]=t[o])})),[["padding","cellPadding"],["lineHeight","rowHeight"],"fontSize","overflow"].forEach((function(e){var n="string"==typeof e?e:e[0],o="string"==typeof e?e:e[1];void 0!==t[n]&&(void 0===t.styles[o]&&(t.styles[o]=t[n]),console.error("Use of deprecated option: "+n+", use the style "+o+" instead."))}));for(var e=0,n=["styles","bodyStyles","headStyles","footStyles"];e<n.length;e++){o(t[n[e]]||{})}for(var i=t.columnStyles||{},l=0,a=Object.keys(i);l<a.length;l++){o(i[a[l]]||{})}},l=0,a=[t,e,n];l<a.length;l++){i(a[l])}}},function(t,e,n){"use strict";var o,r=this&&this.__extends||(o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(e,"__esModule",{value:!0});var i=function(t,e){this.table=t,this.pageNumber=t.pageNumber,this.pageCount=this.pageNumber,this.settings=t.settings,this.cursor=t.cursor,this.doc=e.getDocument()};e.HookData=i;var l=function(t){function e(e,n,o,r,i){var l=t.call(this,e,n)||this;return l.cell=o,l.row=r,l.column=i,l.section=r.section,l}return r(e,t),e}(i);e.CellHookData=l},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(0);function r(t,e,n){for(var o=e,i=t.reduce((function(t,e){return t+e.wrappedWidth}),0),l=0;l<t.length;l++){var a=t[l],s=o*(a.wrappedWidth/i),u=a.width+s,d=n(a),h=u<d?d:u;e-=h-a.width,a.width=h}if(e=Math.round(1e10*e)/1e10){var c=t.filter((function(t){return!(e<0)||t.width>n(t)}));c.length&&(e=r(c,e,n))}return e}function i(t,e,n,r,i){return t.map((function(t){return function(t,e,n,r,i){var l=1e4*r.scaleFactor();if((e=Math.ceil(e*l)/l)>=o.getStringWidth(t,n,r))return t;for(;e<o.getStringWidth(t+i,n,r)&&!(t.length<=1);)t=t.substring(0,t.length-1);return t.trim()+i}(t,e,n,r,i)}))}e.calculateWidths=function(t,e){var n=[],o=0;e.columns.forEach((function(t){var r=t.getMaxCustomCellWidth(e);r?t.width=r:(t.width=t.wrappedWidth,n.push(t)),o+=t.width}));var l=e.width-o;l&&(l=r(n,l,(function(t){return Math.max(t.minReadableWidth,t.minWidth)}))),l&&(l=r(n,l,(function(t){return t.minWidth}))),(l=Math.abs(l))>1e-10&&(l=l<1?l:Math.round(l),console.error("Of the table content, "+l+" units width could not fit page")),function(t){for(var e=t.allRows(),n=0;n<e.length;n++)for(var o=e[n],r=null,i=0,l=0,a=0;a<t.columns.length;a++){var s=t.columns[a];if((l-=1)>1&&t.columns[a+1])i+=s.width,delete o.cells[s.index];else if(r){var u=r;delete o.cells[s.index],r=null,u.width=s.width+i}else{if(!(u=o.cells[s.index]))continue;if(l=u.colSpan,i=0,u.colSpan>1){r=u,i+=s.width;continue}u.width=s.width+i}}}(e),function(t,e){for(var n={count:0,height:0},o=0,r=t.allRows();o<r.length;o++){for(var l=r[o],a=0,s=t.columns;a<s.length;a++){var u=s[a],d=l.cells[u.index];if(d){e.applyStyles(d.styles,!0);var h=d.width-d.padding("horizontal");"linebreak"===d.styles.overflow?d.text=e.splitTextToSize(d.text,h+1/e.scaleFactor(),{fontSize:d.styles.fontSize}):"ellipsize"===d.styles.overflow?d.text=i(d.text,h,d.styles,e,"..."):"hidden"===d.styles.overflow?d.text=i(d.text,h,d.styles,e,""):"function"==typeof d.styles.overflow&&(d.text=d.styles.overflow(d.text,h)),d.contentHeight=d.getContentHeight(e.scaleFactor()),d.styles.minCellHeight>d.contentHeight&&(d.contentHeight=d.styles.minCellHeight);var c=d.contentHeight/d.rowSpan;d.rowSpan>1&&n.count*n.height<c*d.rowSpan?n={height:c,count:d.rowSpan}:n&&n.count>0&&n.height>c&&(c=n.height),c>l.height&&(l.height=c,l.maxCellHeight=c)}}n.count--}}(e,t),function(t){for(var e={},n=1,o=t.allRows(),r=0;r<o.length;r++){for(var i=o[r],l=0,a=t.columns;l<a.length;l++){var s=a[l],u=e[s.index];if(n>1)n--,delete i.cells[s.index];else if(u)u.cell.height+=i.height,u.cell.height>i.maxCellHeight&&(u.row.maxCellHeight=u.cell.height),n=u.cell.colSpan,delete i.cells[s.index],u.left--,u.left<=1&&delete e[s.index];else{var d=i.cells[s.index];if(!d)continue;if(d.height=i.height,d.rowSpan>1){var h=o.length-r,c=d.rowSpan>h?h:d.rowSpan;e[s.index]={cell:d,left:c,row:i}}}}"head"===i.section&&(t.headHeight+=i.maxCellHeight),"foot"===i.section&&(t.footHeight+=i.maxCellHeight),t.height+=i.height}}(e)},e.resizeColumns=r,e.ellipsize=i},function(e,n){if(void 0===t){var o=new Error("Cannot find module 'undefined'");throw o.code="MODULE_NOT_FOUND",o}e.exports=t}])}));
