// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"vMTe":[function(require,module,exports) {

},{}],"PgLh":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
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
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
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

  while (len) {
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
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
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

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"kGI0":[function(require,module,exports) {
var define;
var process = require("process");
var global = arguments[3];
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * Paper.js v0.12.11 - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2020, Jürg Lehni & Jonathan Puckey
 * http://juerglehni.com/ & https://puckey.studio/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 *
 * Date: Fri Jun 19 19:14:33 2020 +0200
 *
 ***
 *
 * Straps.js - Class inheritance library with support for bean-style accessors
 *
 * Copyright (c) 2006 - 2020 Jürg Lehni
 * http://juerglehni.com/
 *
 * Distributed under the MIT license.
 *
 ***
 *
 * Acorn.js
 * https://marijnhaverbeke.nl/acorn/
 *
 * Acorn is a tiny, fast JavaScript parser written in JavaScript,
 * created by Marijn Haverbeke and released under an MIT license.
 *
 */
var paper = function (self, undefined) {
  self = self || require('./node/self.js');
  var window = self.window,
      document = self.document;
  var Base = new function () {
    var hidden = /^(statics|enumerable|beans|preserve)$/,
        array = [],
        _slice = array.slice,
        create = Object.create,
        describe = Object.getOwnPropertyDescriptor,
        define = Object.defineProperty,
        forEach = array.forEach || function (iter, bind) {
      for (var i = 0, l = this.length; i < l; i++) {
        iter.call(bind, this[i], i, this);
      }
    },
        forIn = function forIn(iter, bind) {
      for (var i in this) {
        if (this.hasOwnProperty(i)) iter.call(bind, this[i], i, this);
      }
    },
        set = Object.assign || function (dst) {
      for (var i = 1, l = arguments.length; i < l; i++) {
        var src = arguments[i];

        for (var key in src) {
          if (src.hasOwnProperty(key)) dst[key] = src[key];
        }
      }

      return dst;
    },
        _each = function each(obj, iter, bind) {
      if (obj) {
        var desc = describe(obj, 'length');
        (desc && typeof desc.value === 'number' ? forEach : forIn).call(obj, iter, bind = bind || obj);
      }

      return bind;
    };

    function _inject(dest, src, enumerable, beans, preserve) {
      var beansNames = {};

      function field(name, val) {
        val = val || (val = describe(src, name)) && (val.get ? val : val.value);
        if (typeof val === 'string' && val[0] === '#') val = dest[val.substring(1)] || val;
        var isFunc = typeof val === 'function',
            res = val,
            prev = preserve || isFunc && !val.base ? val && val.get ? name in dest : dest[name] : null,
            bean;

        if (!preserve || !prev) {
          if (isFunc && prev) val.base = prev;
          if (isFunc && beans !== false && (bean = name.match(/^([gs]et|is)(([A-Z])(.*))$/))) beansNames[bean[3].toLowerCase() + bean[4]] = bean[2];

          if (!res || isFunc || !res.get || typeof res.get !== 'function' || !Base.isPlainObject(res)) {
            res = {
              value: res,
              writable: true
            };
          }

          if ((describe(dest, name) || {
            configurable: true
          }).configurable) {
            res.configurable = true;
            res.enumerable = enumerable != null ? enumerable : !bean;
          }

          define(dest, name, res);
        }
      }

      if (src) {
        for (var name in src) {
          if (src.hasOwnProperty(name) && !hidden.test(name)) field(name);
        }

        for (var name in beansNames) {
          var part = beansNames[name],
              set = dest['set' + part],
              get = dest['get' + part] || set && dest['is' + part];
          if (get && (beans === true || get.length === 0)) field(name, {
            get: get,
            set: set
          });
        }
      }

      return dest;
    }

    function Base() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        var src = arguments[i];
        if (src) set(this, src);
      }

      return this;
    }

    return _inject(Base, {
      inject: function inject(src) {
        if (src) {
          var statics = src.statics === true ? src : src.statics,
              beans = src.beans,
              preserve = src.preserve;
          if (statics !== src) _inject(this.prototype, src, src.enumerable, beans, preserve);

          _inject(this, statics, null, beans, preserve);
        }

        for (var i = 1, l = arguments.length; i < l; i++) {
          this.inject(arguments[i]);
        }

        return this;
      },
      extend: function extend() {
        var base = this,
            ctor,
            proto;

        for (var i = 0, obj, l = arguments.length; i < l && !(ctor && proto); i++) {
          obj = arguments[i];
          ctor = ctor || obj.initialize;
          proto = proto || obj.prototype;
        }

        ctor = ctor || function () {
          base.apply(this, arguments);
        };

        proto = ctor.prototype = proto || create(this.prototype);
        define(proto, 'constructor', {
          value: ctor,
          writable: true,
          configurable: true
        });

        _inject(ctor, this);

        if (arguments.length) this.inject.apply(ctor, arguments);
        ctor.base = base;
        return ctor;
      }
    }).inject({
      enumerable: false,
      initialize: Base,
      set: Base,
      inject: function inject() {
        for (var i = 0, l = arguments.length; i < l; i++) {
          var src = arguments[i];

          if (src) {
            _inject(this, src, src.enumerable, src.beans, src.preserve);
          }
        }

        return this;
      },
      extend: function extend() {
        var res = create(this);
        return res.inject.apply(res, arguments);
      },
      each: function each(iter, bind) {
        return _each(this, iter, bind);
      },
      clone: function clone() {
        return new this.constructor(this);
      },
      statics: {
        set: set,
        each: _each,
        create: create,
        define: define,
        describe: describe,
        clone: function clone(obj) {
          return set(new obj.constructor(), obj);
        },
        isPlainObject: function isPlainObject(obj) {
          var ctor = obj != null && obj.constructor;
          return ctor && (ctor === Object || ctor === Base || ctor.name === 'Object');
        },
        pick: function pick(a, b) {
          return a !== undefined ? a : b;
        },
        slice: function slice(list, begin, end) {
          return _slice.call(list, begin, end);
        }
      }
    });
  }();
  if (typeof module !== 'undefined') module.exports = Base;
  Base.inject({
    enumerable: false,
    toString: function toString() {
      return this._id != null ? (this._class || 'Object') + (this._name ? " '" + this._name + "'" : ' @' + this._id) : '{ ' + Base.each(this, function (value, key) {
        if (!/^_/.test(key)) {
          var type = _typeof(value);

          this.push(key + ': ' + (type === 'number' ? Formatter.instance.number(value) : type === 'string' ? "'" + value + "'" : value));
        }
      }, []).join(', ') + ' }';
    },
    getClassName: function getClassName() {
      return this._class || '';
    },
    importJSON: function importJSON(json) {
      return Base.importJSON(json, this);
    },
    exportJSON: function exportJSON(options) {
      return Base.exportJSON(this, options);
    },
    toJSON: function toJSON() {
      return Base.serialize(this);
    },
    set: function set(props, exclude) {
      if (props) Base.filter(this, props, exclude, this._prioritize);
      return this;
    }
  }, {
    beans: false,
    statics: {
      exports: {},
      extend: function extend() {
        var res = extend.base.apply(this, arguments),
            name = res.prototype._class;
        if (name && !Base.exports[name]) Base.exports[name] = res;
        return res;
      },
      equals: function equals(obj1, obj2) {
        if (obj1 === obj2) return true;
        if (obj1 && obj1.equals) return obj1.equals(obj2);
        if (obj2 && obj2.equals) return obj2.equals(obj1);

        if (obj1 && obj2 && _typeof(obj1) === 'object' && _typeof(obj2) === 'object') {
          if (Array.isArray(obj1) && Array.isArray(obj2)) {
            var length = obj1.length;
            if (length !== obj2.length) return false;

            while (length--) {
              if (!Base.equals(obj1[length], obj2[length])) return false;
            }
          } else {
            var keys = Object.keys(obj1),
                length = keys.length;
            if (length !== Object.keys(obj2).length) return false;

            while (length--) {
              var key = keys[length];
              if (!(obj2.hasOwnProperty(key) && Base.equals(obj1[key], obj2[key]))) return false;
            }
          }

          return true;
        }

        return false;
      },
      read: function read(list, start, options, amount) {
        if (this === Base) {
          var value = this.peek(list, start);
          list.__index++;
          return value;
        }

        var proto = this.prototype,
            readIndex = proto._readIndex,
            begin = start || readIndex && list.__index || 0,
            length = list.length,
            obj = list[begin];
        amount = amount || length - begin;

        if (obj instanceof this || options && options.readNull && obj == null && amount <= 1) {
          if (readIndex) list.__index = begin + 1;
          return obj && options && options.clone ? obj.clone() : obj;
        }

        obj = Base.create(proto);
        if (readIndex) obj.__read = true;
        obj = obj.initialize.apply(obj, begin > 0 || begin + amount < length ? Base.slice(list, begin, begin + amount) : list) || obj;

        if (readIndex) {
          list.__index = begin + obj.__read;
          var filtered = obj.__filtered;

          if (filtered) {
            list.__filtered = filtered;
            obj.__filtered = undefined;
          }

          obj.__read = undefined;
        }

        return obj;
      },
      peek: function peek(list, start) {
        return list[list.__index = start || list.__index || 0];
      },
      remain: function remain(list) {
        return list.length - (list.__index || 0);
      },
      readList: function readList(list, start, options, amount) {
        var res = [],
            entry,
            begin = start || 0,
            end = amount ? begin + amount : list.length;

        for (var i = begin; i < end; i++) {
          res.push(Array.isArray(entry = list[i]) ? this.read(entry, 0, options) : this.read(list, i, options, 1));
        }

        return res;
      },
      readNamed: function readNamed(list, name, start, options, amount) {
        var value = this.getNamed(list, name),
            hasValue = value !== undefined;

        if (hasValue) {
          var filtered = list.__filtered;

          if (!filtered) {
            var source = this.getSource(list);
            filtered = list.__filtered = Base.create(source);
            filtered.__unfiltered = source;
          }

          filtered[name] = undefined;
        }

        return this.read(hasValue ? [value] : list, start, options, amount);
      },
      readSupported: function readSupported(list, dest) {
        var source = this.getSource(list),
            that = this,
            read = false;

        if (source) {
          Object.keys(source).forEach(function (key) {
            if (key in dest) {
              var value = that.readNamed(list, key);

              if (value !== undefined) {
                dest[key] = value;
              }

              read = true;
            }
          });
        }

        return read;
      },
      getSource: function getSource(list) {
        var source = list.__source;

        if (source === undefined) {
          var arg = list.length === 1 && list[0];
          source = list.__source = arg && Base.isPlainObject(arg) ? arg : null;
        }

        return source;
      },
      getNamed: function getNamed(list, name) {
        var source = this.getSource(list);

        if (source) {
          return name ? source[name] : list.__filtered || source;
        }
      },
      hasNamed: function hasNamed(list, name) {
        return !!this.getNamed(list, name);
      },
      filter: function filter(dest, source, exclude, prioritize) {
        var processed;

        function handleKey(key) {
          if (!(exclude && key in exclude) && !(processed && key in processed)) {
            var value = source[key];
            if (value !== undefined) dest[key] = value;
          }
        }

        if (prioritize) {
          var keys = {};

          for (var i = 0, key, l = prioritize.length; i < l; i++) {
            if ((key = prioritize[i]) in source) {
              handleKey(key);
              keys[key] = true;
            }
          }

          processed = keys;
        }

        Object.keys(source.__unfiltered || source).forEach(handleKey);
        return dest;
      },
      isPlainValue: function isPlainValue(obj, asString) {
        return Base.isPlainObject(obj) || Array.isArray(obj) || asString && typeof obj === 'string';
      },
      serialize: function serialize(obj, options, compact, dictionary) {
        options = options || {};
        var isRoot = !dictionary,
            res;

        if (isRoot) {
          options.formatter = new Formatter(options.precision);
          dictionary = {
            length: 0,
            definitions: {},
            references: {},
            add: function add(item, create) {
              var id = '#' + item._id,
                  ref = this.references[id];

              if (!ref) {
                this.length++;
                var res = create.call(item),
                    name = item._class;
                if (name && res[0] !== name) res.unshift(name);
                this.definitions[id] = res;
                ref = this.references[id] = [id];
              }

              return ref;
            }
          };
        }

        if (obj && obj._serialize) {
          res = obj._serialize(options, dictionary);
          var name = obj._class;

          if (name && !obj._compactSerialize && (isRoot || !compact) && res[0] !== name) {
            res.unshift(name);
          }
        } else if (Array.isArray(obj)) {
          res = [];

          for (var i = 0, l = obj.length; i < l; i++) {
            res[i] = Base.serialize(obj[i], options, compact, dictionary);
          }
        } else if (Base.isPlainObject(obj)) {
          res = {};
          var keys = Object.keys(obj);

          for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            res[key] = Base.serialize(obj[key], options, compact, dictionary);
          }
        } else if (typeof obj === 'number') {
          res = options.formatter.number(obj, options.precision);
        } else {
          res = obj;
        }

        return isRoot && dictionary.length > 0 ? [['dictionary', dictionary.definitions], res] : res;
      },
      deserialize: function deserialize(json, create, _data, _setDictionary, _isRoot) {
        var res = json,
            isFirst = !_data,
            hasDictionary = isFirst && json && json.length && json[0][0] === 'dictionary';
        _data = _data || {};

        if (Array.isArray(json)) {
          var type = json[0],
              isDictionary = type === 'dictionary';

          if (json.length == 1 && /^#/.test(type)) {
            return _data.dictionary[type];
          }

          type = Base.exports[type];
          res = [];

          for (var i = type ? 1 : 0, l = json.length; i < l; i++) {
            res.push(Base.deserialize(json[i], create, _data, isDictionary, hasDictionary));
          }

          if (type) {
            var args = res;

            if (create) {
              res = create(type, args, isFirst || _isRoot);
            } else {
              res = new type(args);
            }
          }
        } else if (Base.isPlainObject(json)) {
          res = {};
          if (_setDictionary) _data.dictionary = res;

          for (var key in json) {
            res[key] = Base.deserialize(json[key], create, _data);
          }
        }

        return hasDictionary ? res[1] : res;
      },
      exportJSON: function exportJSON(obj, options) {
        var json = Base.serialize(obj, options);
        return options && options.asString == false ? json : JSON.stringify(json);
      },
      importJSON: function importJSON(json, target) {
        return Base.deserialize(typeof json === 'string' ? JSON.parse(json) : json, function (ctor, args, isRoot) {
          var useTarget = isRoot && target && target.constructor === ctor,
              obj = useTarget ? target : Base.create(ctor.prototype);

          if (args.length === 1 && obj instanceof Item && (useTarget || !(obj instanceof Layer))) {
            var arg = args[0];

            if (Base.isPlainObject(arg)) {
              arg.insert = false;

              if (useTarget) {
                args = args.concat([{
                  insert: true
                }]);
              }
            }
          }

          (useTarget ? obj.set : ctor).apply(obj, args);
          if (useTarget) target = null;
          return obj;
        });
      },
      push: function push(list, items) {
        var itemsLength = items.length;

        if (itemsLength < 4096) {
          list.push.apply(list, items);
        } else {
          var startLength = list.length;
          list.length += itemsLength;

          for (var i = 0; i < itemsLength; i++) {
            list[startLength + i] = items[i];
          }
        }

        return list;
      },
      splice: function splice(list, items, index, remove) {
        var amount = items && items.length,
            append = index === undefined;
        index = append ? list.length : index;
        if (index > list.length) index = list.length;

        for (var i = 0; i < amount; i++) {
          items[i]._index = index + i;
        }

        if (append) {
          Base.push(list, items);
          return [];
        } else {
          var args = [index, remove];
          if (items) Base.push(args, items);
          var removed = list.splice.apply(list, args);

          for (var i = 0, l = removed.length; i < l; i++) {
            removed[i]._index = undefined;
          }

          for (var i = index + amount, l = list.length; i < l; i++) {
            list[i]._index = i;
          }

          return removed;
        }
      },
      capitalize: function capitalize(str) {
        return str.replace(/\b[a-z]/g, function (match) {
          return match.toUpperCase();
        });
      },
      camelize: function camelize(str) {
        return str.replace(/-(.)/g, function (match, chr) {
          return chr.toUpperCase();
        });
      },
      hyphenate: function hyphenate(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      }
    }
  });
  var Emitter = {
    on: function on(type, func) {
      if (typeof type !== 'string') {
        Base.each(type, function (value, key) {
          this.on(key, value);
        }, this);
      } else {
        var types = this._eventTypes,
            entry = types && types[type],
            handlers = this._callbacks = this._callbacks || {};
        handlers = handlers[type] = handlers[type] || [];

        if (handlers.indexOf(func) === -1) {
          handlers.push(func);
          if (entry && entry.install && handlers.length === 1) entry.install.call(this, type);
        }
      }

      return this;
    },
    off: function off(type, func) {
      if (typeof type !== 'string') {
        Base.each(type, function (value, key) {
          this.off(key, value);
        }, this);
        return;
      }

      var types = this._eventTypes,
          entry = types && types[type],
          handlers = this._callbacks && this._callbacks[type],
          index;

      if (handlers) {
        if (!func || (index = handlers.indexOf(func)) !== -1 && handlers.length === 1) {
          if (entry && entry.uninstall) entry.uninstall.call(this, type);
          delete this._callbacks[type];
        } else if (index !== -1) {
          handlers.splice(index, 1);
        }
      }

      return this;
    },
    once: function once(type, func) {
      return this.on(type, function handler() {
        func.apply(this, arguments);
        this.off(type, handler);
      });
    },
    emit: function emit(type, event) {
      var handlers = this._callbacks && this._callbacks[type];
      if (!handlers) return false;
      var args = Base.slice(arguments, 1),
          setTarget = event && event.target && !event.currentTarget;
      handlers = handlers.slice();
      if (setTarget) event.currentTarget = this;

      for (var i = 0, l = handlers.length; i < l; i++) {
        if (handlers[i].apply(this, args) == false) {
          if (event && event.stop) event.stop();
          break;
        }
      }

      if (setTarget) delete event.currentTarget;
      return true;
    },
    responds: function responds(type) {
      return !!(this._callbacks && this._callbacks[type]);
    },
    attach: '#on',
    detach: '#off',
    fire: '#emit',
    _installEvents: function _installEvents(install) {
      var types = this._eventTypes,
          handlers = this._callbacks,
          key = install ? 'install' : 'uninstall';

      if (types) {
        for (var type in handlers) {
          if (handlers[type].length > 0) {
            var entry = types[type],
                func = entry && entry[key];
            if (func) func.call(this, type);
          }
        }
      }
    },
    statics: {
      inject: function inject(src) {
        var events = src._events;

        if (events) {
          var types = {};
          Base.each(events, function (entry, key) {
            var isString = typeof entry === 'string',
                name = isString ? entry : key,
                part = Base.capitalize(name),
                type = name.substring(2).toLowerCase();
            types[type] = isString ? {} : entry;
            name = '_' + name;

            src['get' + part] = function () {
              return this[name];
            };

            src['set' + part] = function (func) {
              var prev = this[name];
              if (prev) this.off(type, prev);
              if (func) this.on(type, func);
              this[name] = func;
            };
          });
          src._eventTypes = types;
        }

        return inject.base.apply(this, arguments);
      }
    }
  };
  var PaperScope = Base.extend({
    _class: 'PaperScope',
    initialize: function PaperScope() {
      paper = this;
      this.settings = new Base({
        applyMatrix: true,
        insertItems: true,
        handleSize: 4,
        hitTolerance: 0
      });
      this.project = null;
      this.projects = [];
      this.tools = [];
      this._id = PaperScope._id++;
      PaperScope._scopes[this._id] = this;
      var proto = PaperScope.prototype;

      if (!this.support) {
        var ctx = CanvasProvider.getContext(1, 1) || {};
        proto.support = {
          nativeDash: 'setLineDash' in ctx || 'mozDash' in ctx,
          nativeBlendModes: BlendMode.nativeModes
        };
        CanvasProvider.release(ctx);
      }

      if (!this.agent) {
        var user = self.navigator.userAgent.toLowerCase(),
            os = (/(darwin|win|mac|linux|freebsd|sunos)/.exec(user) || [])[0],
            platform = os === 'darwin' ? 'mac' : os,
            agent = proto.agent = proto.browser = {
          platform: platform
        };
        if (platform) agent[platform] = true;
        user.replace(/(opera|chrome|safari|webkit|firefox|msie|trident|atom|node|jsdom)\/?\s*([.\d]+)(?:.*version\/([.\d]+))?(?:.*rv\:v?([.\d]+))?/g, function (match, n, v1, v2, rv) {
          if (!agent.chrome) {
            var v = n === 'opera' ? v2 : /^(node|trident)$/.test(n) ? rv : v1;
            agent.version = v;
            agent.versionNumber = parseFloat(v);
            n = {
              trident: 'msie',
              jsdom: 'node'
            }[n] || n;
            agent.name = n;
            agent[n] = true;
          }
        });
        if (agent.chrome) delete agent.webkit;
        if (agent.atom) delete agent.chrome;
      }
    },
    version: "0.12.11",
    getView: function getView() {
      var project = this.project;
      return project && project._view;
    },
    getPaper: function getPaper() {
      return this;
    },
    execute: function execute(code, options) {
      var exports = paper.PaperScript.execute(code, this, options);
      View.updateFocus();
      return exports;
    },
    install: function install(scope) {
      var that = this;
      Base.each(['project', 'view', 'tool'], function (key) {
        Base.define(scope, key, {
          configurable: true,
          get: function get() {
            return that[key];
          }
        });
      });

      for (var key in this) {
        if (!/^_/.test(key) && this[key]) scope[key] = this[key];
      }
    },
    setup: function setup(element) {
      paper = this;
      this.project = new Project(element);
      return this;
    },
    createCanvas: function createCanvas(width, height) {
      return CanvasProvider.getCanvas(width, height);
    },
    activate: function activate() {
      paper = this;
    },
    clear: function clear() {
      var projects = this.projects,
          tools = this.tools;

      for (var i = projects.length - 1; i >= 0; i--) {
        projects[i].remove();
      }

      for (var i = tools.length - 1; i >= 0; i--) {
        tools[i].remove();
      }
    },
    remove: function remove() {
      this.clear();
      delete PaperScope._scopes[this._id];
    },
    statics: new function () {
      function handleAttribute(name) {
        name += 'Attribute';
        return function (el, attr) {
          return el[name](attr) || el[name]('data-paper-' + attr);
        };
      }

      return {
        _scopes: {},
        _id: 0,
        get: function get(id) {
          return this._scopes[id] || null;
        },
        getAttribute: handleAttribute('get'),
        hasAttribute: handleAttribute('has')
      };
    }()
  });
  var PaperScopeItem = Base.extend(Emitter, {
    initialize: function initialize(activate) {
      this._scope = paper;
      this._index = this._scope[this._list].push(this) - 1;
      if (activate || !this._scope[this._reference]) this.activate();
    },
    activate: function activate() {
      if (!this._scope) return false;
      var prev = this._scope[this._reference];
      if (prev && prev !== this) prev.emit('deactivate');
      this._scope[this._reference] = this;
      this.emit('activate', prev);
      return true;
    },
    isActive: function isActive() {
      return this._scope[this._reference] === this;
    },
    remove: function remove() {
      if (this._index == null) return false;
      Base.splice(this._scope[this._list], null, this._index, 1);
      if (this._scope[this._reference] == this) this._scope[this._reference] = null;
      this._scope = null;
      return true;
    },
    getView: function getView() {
      return this._scope.getView();
    }
  });
  var CollisionDetection = {
    findItemBoundsCollisions: function findItemBoundsCollisions(items1, items2, tolerance) {
      function getBounds(items) {
        var bounds = new Array(items.length);

        for (var i = 0; i < items.length; i++) {
          var rect = items[i].getBounds();
          bounds[i] = [rect.left, rect.top, rect.right, rect.bottom];
        }

        return bounds;
      }

      var bounds1 = getBounds(items1),
          bounds2 = !items2 || items2 === items1 ? bounds1 : getBounds(items2);
      return this.findBoundsCollisions(bounds1, bounds2, tolerance || 0);
    },
    findCurveBoundsCollisions: function findCurveBoundsCollisions(curves1, curves2, tolerance, bothAxis) {
      function getBounds(curves) {
        var min = Math.min,
            max = Math.max,
            bounds = new Array(curves.length);

        for (var i = 0; i < curves.length; i++) {
          var v = curves[i];
          bounds[i] = [min(v[0], v[2], v[4], v[6]), min(v[1], v[3], v[5], v[7]), max(v[0], v[2], v[4], v[6]), max(v[1], v[3], v[5], v[7])];
        }

        return bounds;
      }

      var bounds1 = getBounds(curves1),
          bounds2 = !curves2 || curves2 === curves1 ? bounds1 : getBounds(curves2);

      if (bothAxis) {
        var hor = this.findBoundsCollisions(bounds1, bounds2, tolerance || 0, false, true),
            ver = this.findBoundsCollisions(bounds1, bounds2, tolerance || 0, true, true),
            list = [];

        for (var i = 0, l = hor.length; i < l; i++) {
          list[i] = {
            hor: hor[i],
            ver: ver[i]
          };
        }

        return list;
      }

      return this.findBoundsCollisions(bounds1, bounds2, tolerance || 0);
    },
    findBoundsCollisions: function findBoundsCollisions(boundsA, boundsB, tolerance, sweepVertical, onlySweepAxisCollisions) {
      var self = !boundsB || boundsA === boundsB,
          allBounds = self ? boundsA : boundsA.concat(boundsB),
          lengthA = boundsA.length,
          lengthAll = allBounds.length;

      function binarySearch(indices, coord, value) {
        var lo = 0,
            hi = indices.length;

        while (lo < hi) {
          var mid = hi + lo >>> 1;

          if (allBounds[indices[mid]][coord] < value) {
            lo = mid + 1;
          } else {
            hi = mid;
          }
        }

        return lo - 1;
      }

      var pri0 = sweepVertical ? 1 : 0,
          pri1 = pri0 + 2,
          sec0 = sweepVertical ? 0 : 1,
          sec1 = sec0 + 2;
      var allIndicesByPri0 = new Array(lengthAll);

      for (var i = 0; i < lengthAll; i++) {
        allIndicesByPri0[i] = i;
      }

      allIndicesByPri0.sort(function (i1, i2) {
        return allBounds[i1][pri0] - allBounds[i2][pri0];
      });
      var activeIndicesByPri1 = [],
          allCollisions = new Array(lengthA);

      for (var i = 0; i < lengthAll; i++) {
        var curIndex = allIndicesByPri0[i],
            curBounds = allBounds[curIndex],
            origIndex = self ? curIndex : curIndex - lengthA,
            isCurrentA = curIndex < lengthA,
            isCurrentB = self || !isCurrentA,
            curCollisions = isCurrentA ? [] : null;

        if (activeIndicesByPri1.length) {
          var pruneCount = binarySearch(activeIndicesByPri1, pri1, curBounds[pri0] - tolerance) + 1;
          activeIndicesByPri1.splice(0, pruneCount);

          if (self && onlySweepAxisCollisions) {
            curCollisions = curCollisions.concat(activeIndicesByPri1);

            for (var j = 0; j < activeIndicesByPri1.length; j++) {
              var activeIndex = activeIndicesByPri1[j];
              allCollisions[activeIndex].push(origIndex);
            }
          } else {
            var curSec1 = curBounds[sec1],
                curSec0 = curBounds[sec0];

            for (var j = 0; j < activeIndicesByPri1.length; j++) {
              var activeIndex = activeIndicesByPri1[j],
                  activeBounds = allBounds[activeIndex],
                  isActiveA = activeIndex < lengthA,
                  isActiveB = self || activeIndex >= lengthA;

              if (onlySweepAxisCollisions || (isCurrentA && isActiveB || isCurrentB && isActiveA) && curSec1 >= activeBounds[sec0] - tolerance && curSec0 <= activeBounds[sec1] + tolerance) {
                if (isCurrentA && isActiveB) {
                  curCollisions.push(self ? activeIndex : activeIndex - lengthA);
                }

                if (isCurrentB && isActiveA) {
                  allCollisions[activeIndex].push(origIndex);
                }
              }
            }
          }
        }

        if (isCurrentA) {
          if (boundsA === boundsB) {
            curCollisions.push(curIndex);
          }

          allCollisions[curIndex] = curCollisions;
        }

        if (activeIndicesByPri1.length) {
          var curPri1 = curBounds[pri1],
              index = binarySearch(activeIndicesByPri1, pri1, curPri1);
          activeIndicesByPri1.splice(index + 1, 0, curIndex);
        } else {
          activeIndicesByPri1.push(curIndex);
        }
      }

      for (var i = 0; i < allCollisions.length; i++) {
        var collisions = allCollisions[i];

        if (collisions) {
          collisions.sort(function (i1, i2) {
            return i1 - i2;
          });
        }
      }

      return allCollisions;
    }
  };
  var Formatter = Base.extend({
    initialize: function initialize(precision) {
      this.precision = Base.pick(precision, 5);
      this.multiplier = Math.pow(10, this.precision);
    },
    number: function number(val) {
      return this.precision < 16 ? Math.round(val * this.multiplier) / this.multiplier : val;
    },
    pair: function pair(val1, val2, separator) {
      return this.number(val1) + (separator || ',') + this.number(val2);
    },
    point: function point(val, separator) {
      return this.number(val.x) + (separator || ',') + this.number(val.y);
    },
    size: function size(val, separator) {
      return this.number(val.width) + (separator || ',') + this.number(val.height);
    },
    rectangle: function rectangle(val, separator) {
      return this.point(val, separator) + (separator || ',') + this.size(val, separator);
    }
  });
  Formatter.instance = new Formatter();
  var Numerical = new function () {
    var abscissas = [[0.5773502691896257645091488], [0, 0.7745966692414833770358531], [0.3399810435848562648026658, 0.8611363115940525752239465], [0, 0.5384693101056830910363144, 0.9061798459386639927976269], [0.2386191860831969086305017, 0.6612093864662645136613996, 0.9324695142031520278123016], [0, 0.4058451513773971669066064, 0.7415311855993944398638648, 0.9491079123427585245261897], [0.1834346424956498049394761, 0.5255324099163289858177390, 0.7966664774136267395915539, 0.9602898564975362316835609], [0, 0.3242534234038089290385380, 0.6133714327005903973087020, 0.8360311073266357942994298, 0.9681602395076260898355762], [0.1488743389816312108848260, 0.4333953941292471907992659, 0.6794095682990244062343274, 0.8650633666889845107320967, 0.9739065285171717200779640], [0, 0.2695431559523449723315320, 0.5190961292068118159257257, 0.7301520055740493240934163, 0.8870625997680952990751578, 0.9782286581460569928039380], [0.1252334085114689154724414, 0.3678314989981801937526915, 0.5873179542866174472967024, 0.7699026741943046870368938, 0.9041172563704748566784659, 0.9815606342467192506905491], [0, 0.2304583159551347940655281, 0.4484927510364468528779129, 0.6423493394403402206439846, 0.8015780907333099127942065, 0.9175983992229779652065478, 0.9841830547185881494728294], [0.1080549487073436620662447, 0.3191123689278897604356718, 0.5152486363581540919652907, 0.6872929048116854701480198, 0.8272013150697649931897947, 0.9284348836635735173363911, 0.9862838086968123388415973], [0, 0.2011940939974345223006283, 0.3941513470775633698972074, 0.5709721726085388475372267, 0.7244177313601700474161861, 0.8482065834104272162006483, 0.9372733924007059043077589, 0.9879925180204854284895657], [0.0950125098376374401853193, 0.2816035507792589132304605, 0.4580167776572273863424194, 0.6178762444026437484466718, 0.7554044083550030338951012, 0.8656312023878317438804679, 0.9445750230732325760779884, 0.9894009349916499325961542]];
    var weights = [[1], [0.8888888888888888888888889, 0.5555555555555555555555556], [0.6521451548625461426269361, 0.3478548451374538573730639], [0.5688888888888888888888889, 0.4786286704993664680412915, 0.2369268850561890875142640], [0.4679139345726910473898703, 0.3607615730481386075698335, 0.1713244923791703450402961], [0.4179591836734693877551020, 0.3818300505051189449503698, 0.2797053914892766679014678, 0.1294849661688696932706114], [0.3626837833783619829651504, 0.3137066458778872873379622, 0.2223810344533744705443560, 0.1012285362903762591525314], [0.3302393550012597631645251, 0.3123470770400028400686304, 0.2606106964029354623187429, 0.1806481606948574040584720, 0.0812743883615744119718922], [0.2955242247147528701738930, 0.2692667193099963550912269, 0.2190863625159820439955349, 0.1494513491505805931457763, 0.0666713443086881375935688], [0.2729250867779006307144835, 0.2628045445102466621806889, 0.2331937645919904799185237, 0.1862902109277342514260976, 0.1255803694649046246346943, 0.0556685671161736664827537], [0.2491470458134027850005624, 0.2334925365383548087608499, 0.2031674267230659217490645, 0.1600783285433462263346525, 0.1069393259953184309602547, 0.0471753363865118271946160], [0.2325515532308739101945895, 0.2262831802628972384120902, 0.2078160475368885023125232, 0.1781459807619457382800467, 0.1388735102197872384636018, 0.0921214998377284479144218, 0.0404840047653158795200216], [0.2152638534631577901958764, 0.2051984637212956039659241, 0.1855383974779378137417166, 0.1572031671581935345696019, 0.1215185706879031846894148, 0.0801580871597602098056333, 0.0351194603317518630318329], [0.2025782419255612728806202, 0.1984314853271115764561183, 0.1861610000155622110268006, 0.1662692058169939335532009, 0.1395706779261543144478048, 0.1071592204671719350118695, 0.0703660474881081247092674, 0.0307532419961172683546284], [0.1894506104550684962853967, 0.1826034150449235888667637, 0.1691565193950025381893121, 0.1495959888165767320815017, 0.1246289712555338720524763, 0.0951585116824927848099251, 0.0622535239386478928628438, 0.0271524594117540948517806]];

    var abs = Math.abs,
        sqrt = Math.sqrt,
        pow = Math.pow,
        log2 = Math.log2 || function (x) {
      return Math.log(x) * Math.LOG2E;
    },
        EPSILON = 1e-12,
        MACHINE_EPSILON = 1.12e-16;

    function clamp(value, min, max) {
      return value < min ? min : value > max ? max : value;
    }

    function getDiscriminant(a, b, c) {
      function split(v) {
        var x = v * 134217729,
            y = v - x,
            hi = y + x,
            lo = v - hi;
        return [hi, lo];
      }

      var D = b * b - a * c,
          E = b * b + a * c;

      if (abs(D) * 3 < E) {
        var ad = split(a),
            bd = split(b),
            cd = split(c),
            p = b * b,
            dp = bd[0] * bd[0] - p + 2 * bd[0] * bd[1] + bd[1] * bd[1],
            q = a * c,
            dq = ad[0] * cd[0] - q + ad[0] * cd[1] + ad[1] * cd[0] + ad[1] * cd[1];
        D = p - q + (dp - dq);
      }

      return D;
    }

    function getNormalizationFactor() {
      var norm = Math.max.apply(Math, arguments);
      return norm && (norm < 1e-8 || norm > 1e8) ? pow(2, -Math.round(log2(norm))) : 0;
    }

    return {
      EPSILON: EPSILON,
      MACHINE_EPSILON: MACHINE_EPSILON,
      CURVETIME_EPSILON: 1e-8,
      GEOMETRIC_EPSILON: 1e-7,
      TRIGONOMETRIC_EPSILON: 1e-8,
      KAPPA: 4 * (sqrt(2) - 1) / 3,
      isZero: function isZero(val) {
        return val >= -EPSILON && val <= EPSILON;
      },
      isMachineZero: function isMachineZero(val) {
        return val >= -MACHINE_EPSILON && val <= MACHINE_EPSILON;
      },
      clamp: clamp,
      integrate: function integrate(f, a, b, n) {
        var x = abscissas[n - 2],
            w = weights[n - 2],
            A = (b - a) * 0.5,
            B = A + a,
            i = 0,
            m = n + 1 >> 1,
            sum = n & 1 ? w[i++] * f(B) : 0;

        while (i < m) {
          var Ax = A * x[i];
          sum += w[i++] * (f(B + Ax) + f(B - Ax));
        }

        return A * sum;
      },
      findRoot: function findRoot(f, df, x, a, b, n, tolerance) {
        for (var i = 0; i < n; i++) {
          var fx = f(x),
              dx = fx / df(x),
              nx = x - dx;

          if (abs(dx) < tolerance) {
            x = nx;
            break;
          }

          if (fx > 0) {
            b = x;
            x = nx <= a ? (a + b) * 0.5 : nx;
          } else {
            a = x;
            x = nx >= b ? (a + b) * 0.5 : nx;
          }
        }

        return clamp(x, a, b);
      },
      solveQuadratic: function solveQuadratic(a, b, c, roots, min, max) {
        var x1,
            x2 = Infinity;

        if (abs(a) < EPSILON) {
          if (abs(b) < EPSILON) return abs(c) < EPSILON ? -1 : 0;
          x1 = -c / b;
        } else {
          b *= -0.5;
          var D = getDiscriminant(a, b, c);

          if (D && abs(D) < MACHINE_EPSILON) {
            var f = getNormalizationFactor(abs(a), abs(b), abs(c));

            if (f) {
              a *= f;
              b *= f;
              c *= f;
              D = getDiscriminant(a, b, c);
            }
          }

          if (D >= -MACHINE_EPSILON) {
            var Q = D < 0 ? 0 : sqrt(D),
                R = b + (b < 0 ? -Q : Q);

            if (R === 0) {
              x1 = c / a;
              x2 = -x1;
            } else {
              x1 = R / a;
              x2 = c / R;
            }
          }
        }

        var count = 0,
            boundless = min == null,
            minB = min - EPSILON,
            maxB = max + EPSILON;
        if (isFinite(x1) && (boundless || x1 > minB && x1 < maxB)) roots[count++] = boundless ? x1 : clamp(x1, min, max);
        if (x2 !== x1 && isFinite(x2) && (boundless || x2 > minB && x2 < maxB)) roots[count++] = boundless ? x2 : clamp(x2, min, max);
        return count;
      },
      solveCubic: function solveCubic(a, b, c, d, roots, min, max) {
        var f = getNormalizationFactor(abs(a), abs(b), abs(c), abs(d)),
            x,
            b1,
            c2,
            qd,
            q;

        if (f) {
          a *= f;
          b *= f;
          c *= f;
          d *= f;
        }

        function evaluate(x0) {
          x = x0;
          var tmp = a * x;
          b1 = tmp + b;
          c2 = b1 * x + c;
          qd = (tmp + b1) * x + c2;
          q = c2 * x + d;
        }

        if (abs(a) < EPSILON) {
          a = b;
          b1 = c;
          c2 = d;
          x = Infinity;
        } else if (abs(d) < EPSILON) {
          b1 = b;
          c2 = c;
          x = 0;
        } else {
          evaluate(-(b / a) / 3);
          var t = q / a,
              r = pow(abs(t), 1 / 3),
              s = t < 0 ? -1 : 1,
              td = -qd / a,
              rd = td > 0 ? 1.324717957244746 * Math.max(r, sqrt(td)) : r,
              x0 = x - s * rd;

          if (x0 !== x) {
            do {
              evaluate(x0);
              x0 = qd === 0 ? x : x - q / qd / (1 + MACHINE_EPSILON);
            } while (s * x0 > s * x);

            if (abs(a) * x * x > abs(d / x)) {
              c2 = -d / x;
              b1 = (c2 - c) / x;
            }
          }
        }

        var count = Numerical.solveQuadratic(a, b1, c2, roots, min, max),
            boundless = min == null;
        if (isFinite(x) && (count === 0 || count > 0 && x !== roots[0] && x !== roots[1]) && (boundless || x > min - EPSILON && x < max + EPSILON)) roots[count++] = boundless ? x : clamp(x, min, max);
        return count;
      }
    };
  }();
  var UID = {
    _id: 1,
    _pools: {},
    get: function get(name) {
      if (name) {
        var pool = this._pools[name];
        if (!pool) pool = this._pools[name] = {
          _id: 1
        };
        return pool._id++;
      } else {
        return this._id++;
      }
    }
  };
  var Point = Base.extend({
    _class: 'Point',
    _readIndex: true,
    initialize: function Point(arg0, arg1) {
      var type = _typeof(arg0),
          reading = this.__read,
          read = 0;

      if (type === 'number') {
        var hasY = typeof arg1 === 'number';

        this._set(arg0, hasY ? arg1 : arg0);

        if (reading) read = hasY ? 2 : 1;
      } else if (type === 'undefined' || arg0 === null) {
        this._set(0, 0);

        if (reading) read = arg0 === null ? 1 : 0;
      } else {
        var obj = type === 'string' ? arg0.split(/[\s,]+/) || [] : arg0;
        read = 1;

        if (Array.isArray(obj)) {
          this._set(+obj[0], +(obj.length > 1 ? obj[1] : obj[0]));
        } else if ('x' in obj) {
          this._set(obj.x || 0, obj.y || 0);
        } else if ('width' in obj) {
          this._set(obj.width || 0, obj.height || 0);
        } else if ('angle' in obj) {
          this._set(obj.length || 0, 0);

          this.setAngle(obj.angle || 0);
        } else {
          this._set(0, 0);

          read = 0;
        }
      }

      if (reading) this.__read = read;
      return this;
    },
    set: '#initialize',
    _set: function _set(x, y) {
      this.x = x;
      this.y = y;
      return this;
    },
    equals: function equals(point) {
      return this === point || point && (this.x === point.x && this.y === point.y || Array.isArray(point) && this.x === point[0] && this.y === point[1]) || false;
    },
    clone: function clone() {
      return new Point(this.x, this.y);
    },
    toString: function toString() {
      var f = Formatter.instance;
      return '{ x: ' + f.number(this.x) + ', y: ' + f.number(this.y) + ' }';
    },
    _serialize: function _serialize(options) {
      var f = options.formatter;
      return [f.number(this.x), f.number(this.y)];
    },
    getLength: function getLength() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    setLength: function setLength(length) {
      if (this.isZero()) {
        var angle = this._angle || 0;

        this._set(Math.cos(angle) * length, Math.sin(angle) * length);
      } else {
        var scale = length / this.getLength();
        if (Numerical.isZero(scale)) this.getAngle();

        this._set(this.x * scale, this.y * scale);
      }
    },
    getAngle: function getAngle() {
      return this.getAngleInRadians.apply(this, arguments) * 180 / Math.PI;
    },
    setAngle: function setAngle(angle) {
      this.setAngleInRadians.call(this, angle * Math.PI / 180);
    },
    getAngleInDegrees: '#getAngle',
    setAngleInDegrees: '#setAngle',
    getAngleInRadians: function getAngleInRadians() {
      if (!arguments.length) {
        return this.isZero() ? this._angle || 0 : this._angle = Math.atan2(this.y, this.x);
      } else {
        var point = Point.read(arguments),
            div = this.getLength() * point.getLength();

        if (Numerical.isZero(div)) {
          return NaN;
        } else {
          var a = this.dot(point) / div;
          return Math.acos(a < -1 ? -1 : a > 1 ? 1 : a);
        }
      }
    },
    setAngleInRadians: function setAngleInRadians(angle) {
      this._angle = angle;

      if (!this.isZero()) {
        var length = this.getLength();

        this._set(Math.cos(angle) * length, Math.sin(angle) * length);
      }
    },
    getQuadrant: function getQuadrant() {
      return this.x >= 0 ? this.y >= 0 ? 1 : 4 : this.y >= 0 ? 2 : 3;
    }
  }, {
    beans: false,
    getDirectedAngle: function getDirectedAngle() {
      var point = Point.read(arguments);
      return Math.atan2(this.cross(point), this.dot(point)) * 180 / Math.PI;
    },
    getDistance: function getDistance() {
      var args = arguments,
          point = Point.read(args),
          x = point.x - this.x,
          y = point.y - this.y,
          d = x * x + y * y,
          squared = Base.read(args);
      return squared ? d : Math.sqrt(d);
    },
    normalize: function normalize(length) {
      if (length === undefined) length = 1;
      var current = this.getLength(),
          scale = current !== 0 ? length / current : 0,
          point = new Point(this.x * scale, this.y * scale);
      if (scale >= 0) point._angle = this._angle;
      return point;
    },
    rotate: function rotate(angle, center) {
      if (angle === 0) return this.clone();
      angle = angle * Math.PI / 180;
      var point = center ? this.subtract(center) : this,
          sin = Math.sin(angle),
          cos = Math.cos(angle);
      point = new Point(point.x * cos - point.y * sin, point.x * sin + point.y * cos);
      return center ? point.add(center) : point;
    },
    transform: function transform(matrix) {
      return matrix ? matrix._transformPoint(this) : this;
    },
    add: function add() {
      var point = Point.read(arguments);
      return new Point(this.x + point.x, this.y + point.y);
    },
    subtract: function subtract() {
      var point = Point.read(arguments);
      return new Point(this.x - point.x, this.y - point.y);
    },
    multiply: function multiply() {
      var point = Point.read(arguments);
      return new Point(this.x * point.x, this.y * point.y);
    },
    divide: function divide() {
      var point = Point.read(arguments);
      return new Point(this.x / point.x, this.y / point.y);
    },
    modulo: function modulo() {
      var point = Point.read(arguments);
      return new Point(this.x % point.x, this.y % point.y);
    },
    negate: function negate() {
      return new Point(-this.x, -this.y);
    },
    isInside: function isInside() {
      return _Rectangle.read(arguments).contains(this);
    },
    isClose: function isClose() {
      var args = arguments,
          point = Point.read(args),
          tolerance = Base.read(args);
      return this.getDistance(point) <= tolerance;
    },
    isCollinear: function isCollinear() {
      var point = Point.read(arguments);
      return Point.isCollinear(this.x, this.y, point.x, point.y);
    },
    isColinear: '#isCollinear',
    isOrthogonal: function isOrthogonal() {
      var point = Point.read(arguments);
      return Point.isOrthogonal(this.x, this.y, point.x, point.y);
    },
    isZero: function isZero() {
      var isZero = Numerical.isZero;
      return isZero(this.x) && isZero(this.y);
    },
    isNaN: function (_isNaN) {
      function isNaN() {
        return _isNaN.apply(this, arguments);
      }

      isNaN.toString = function () {
        return _isNaN.toString();
      };

      return isNaN;
    }(function () {
      return isNaN(this.x) || isNaN(this.y);
    }),
    isInQuadrant: function isInQuadrant(q) {
      return this.x * (q > 1 && q < 4 ? -1 : 1) >= 0 && this.y * (q > 2 ? -1 : 1) >= 0;
    },
    dot: function dot() {
      var point = Point.read(arguments);
      return this.x * point.x + this.y * point.y;
    },
    cross: function cross() {
      var point = Point.read(arguments);
      return this.x * point.y - this.y * point.x;
    },
    project: function project() {
      var point = Point.read(arguments),
          scale = point.isZero() ? 0 : this.dot(point) / point.dot(point);
      return new Point(point.x * scale, point.y * scale);
    },
    statics: {
      min: function min() {
        var args = arguments,
            point1 = Point.read(args),
            point2 = Point.read(args);
        return new Point(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y));
      },
      max: function max() {
        var args = arguments,
            point1 = Point.read(args),
            point2 = Point.read(args);
        return new Point(Math.max(point1.x, point2.x), Math.max(point1.y, point2.y));
      },
      random: function random() {
        return new Point(Math.random(), Math.random());
      },
      isCollinear: function isCollinear(x1, y1, x2, y2) {
        return Math.abs(x1 * y2 - y1 * x2) <= Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)) * 1e-8;
      },
      isOrthogonal: function isOrthogonal(x1, y1, x2, y2) {
        return Math.abs(x1 * x2 + y1 * y2) <= Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)) * 1e-8;
      }
    }
  }, Base.each(['round', 'ceil', 'floor', 'abs'], function (key) {
    var op = Math[key];

    this[key] = function () {
      return new Point(op(this.x), op(this.y));
    };
  }, {}));
  var LinkedPoint = Point.extend({
    initialize: function Point(x, y, owner, setter) {
      this._x = x;
      this._y = y;
      this._owner = owner;
      this._setter = setter;
    },
    _set: function _set(x, y, _dontNotify) {
      this._x = x;
      this._y = y;
      if (!_dontNotify) this._owner[this._setter](this);
      return this;
    },
    getX: function getX() {
      return this._x;
    },
    setX: function setX(x) {
      this._x = x;

      this._owner[this._setter](this);
    },
    getY: function getY() {
      return this._y;
    },
    setY: function setY(y) {
      this._y = y;

      this._owner[this._setter](this);
    },
    isSelected: function isSelected() {
      return !!(this._owner._selection & this._getSelection());
    },
    setSelected: function setSelected(selected) {
      this._owner._changeSelection(this._getSelection(), selected);
    },
    _getSelection: function _getSelection() {
      return this._setter === 'setPosition' ? 4 : 0;
    }
  });
  var Size = Base.extend({
    _class: 'Size',
    _readIndex: true,
    initialize: function Size(arg0, arg1) {
      var type = _typeof(arg0),
          reading = this.__read,
          read = 0;

      if (type === 'number') {
        var hasHeight = typeof arg1 === 'number';

        this._set(arg0, hasHeight ? arg1 : arg0);

        if (reading) read = hasHeight ? 2 : 1;
      } else if (type === 'undefined' || arg0 === null) {
        this._set(0, 0);

        if (reading) read = arg0 === null ? 1 : 0;
      } else {
        var obj = type === 'string' ? arg0.split(/[\s,]+/) || [] : arg0;
        read = 1;

        if (Array.isArray(obj)) {
          this._set(+obj[0], +(obj.length > 1 ? obj[1] : obj[0]));
        } else if ('width' in obj) {
          this._set(obj.width || 0, obj.height || 0);
        } else if ('x' in obj) {
          this._set(obj.x || 0, obj.y || 0);
        } else {
          this._set(0, 0);

          read = 0;
        }
      }

      if (reading) this.__read = read;
      return this;
    },
    set: '#initialize',
    _set: function _set(width, height) {
      this.width = width;
      this.height = height;
      return this;
    },
    equals: function equals(size) {
      return size === this || size && (this.width === size.width && this.height === size.height || Array.isArray(size) && this.width === size[0] && this.height === size[1]) || false;
    },
    clone: function clone() {
      return new Size(this.width, this.height);
    },
    toString: function toString() {
      var f = Formatter.instance;
      return '{ width: ' + f.number(this.width) + ', height: ' + f.number(this.height) + ' }';
    },
    _serialize: function _serialize(options) {
      var f = options.formatter;
      return [f.number(this.width), f.number(this.height)];
    },
    add: function add() {
      var size = Size.read(arguments);
      return new Size(this.width + size.width, this.height + size.height);
    },
    subtract: function subtract() {
      var size = Size.read(arguments);
      return new Size(this.width - size.width, this.height - size.height);
    },
    multiply: function multiply() {
      var size = Size.read(arguments);
      return new Size(this.width * size.width, this.height * size.height);
    },
    divide: function divide() {
      var size = Size.read(arguments);
      return new Size(this.width / size.width, this.height / size.height);
    },
    modulo: function modulo() {
      var size = Size.read(arguments);
      return new Size(this.width % size.width, this.height % size.height);
    },
    negate: function negate() {
      return new Size(-this.width, -this.height);
    },
    isZero: function isZero() {
      var isZero = Numerical.isZero;
      return isZero(this.width) && isZero(this.height);
    },
    isNaN: function (_isNaN2) {
      function isNaN() {
        return _isNaN2.apply(this, arguments);
      }

      isNaN.toString = function () {
        return _isNaN2.toString();
      };

      return isNaN;
    }(function () {
      return isNaN(this.width) || isNaN(this.height);
    }),
    statics: {
      min: function min(size1, size2) {
        return new Size(Math.min(size1.width, size2.width), Math.min(size1.height, size2.height));
      },
      max: function max(size1, size2) {
        return new Size(Math.max(size1.width, size2.width), Math.max(size1.height, size2.height));
      },
      random: function random() {
        return new Size(Math.random(), Math.random());
      }
    }
  }, Base.each(['round', 'ceil', 'floor', 'abs'], function (key) {
    var op = Math[key];

    this[key] = function () {
      return new Size(op(this.width), op(this.height));
    };
  }, {}));
  var LinkedSize = Size.extend({
    initialize: function Size(width, height, owner, setter) {
      this._width = width;
      this._height = height;
      this._owner = owner;
      this._setter = setter;
    },
    _set: function _set(width, height, _dontNotify) {
      this._width = width;
      this._height = height;
      if (!_dontNotify) this._owner[this._setter](this);
      return this;
    },
    getWidth: function getWidth() {
      return this._width;
    },
    setWidth: function setWidth(width) {
      this._width = width;

      this._owner[this._setter](this);
    },
    getHeight: function getHeight() {
      return this._height;
    },
    setHeight: function setHeight(height) {
      this._height = height;

      this._owner[this._setter](this);
    }
  });

  var _Rectangle = Base.extend({
    _class: 'Rectangle',
    _readIndex: true,
    beans: true,
    initialize: function Rectangle(arg0, arg1, arg2, arg3) {
      var args = arguments,
          type = _typeof(arg0),
          read;

      if (type === 'number') {
        this._set(arg0, arg1, arg2, arg3);

        read = 4;
      } else if (type === 'undefined' || arg0 === null) {
        this._set(0, 0, 0, 0);

        read = arg0 === null ? 1 : 0;
      } else if (args.length === 1) {
        if (Array.isArray(arg0)) {
          this._set.apply(this, arg0);

          read = 1;
        } else if (arg0.x !== undefined || arg0.width !== undefined) {
          this._set(arg0.x || 0, arg0.y || 0, arg0.width || 0, arg0.height || 0);

          read = 1;
        } else if (arg0.from === undefined && arg0.to === undefined) {
          this._set(0, 0, 0, 0);

          if (Base.readSupported(args, this)) {
            read = 1;
          }
        }
      }

      if (read === undefined) {
        var frm = Point.readNamed(args, 'from'),
            next = Base.peek(args),
            x = frm.x,
            y = frm.y,
            width,
            height;

        if (next && next.x !== undefined || Base.hasNamed(args, 'to')) {
          var to = Point.readNamed(args, 'to');
          width = to.x - x;
          height = to.y - y;

          if (width < 0) {
            x = to.x;
            width = -width;
          }

          if (height < 0) {
            y = to.y;
            height = -height;
          }
        } else {
          var size = Size.read(args);
          width = size.width;
          height = size.height;
        }

        this._set(x, y, width, height);

        read = args.__index;
      }

      var filtered = args.__filtered;
      if (filtered) this.__filtered = filtered;
      if (this.__read) this.__read = read;
      return this;
    },
    set: '#initialize',
    _set: function _set(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      return this;
    },
    clone: function clone() {
      return new _Rectangle(this.x, this.y, this.width, this.height);
    },
    equals: function equals(rect) {
      var rt = Base.isPlainValue(rect) ? _Rectangle.read(arguments) : rect;
      return rt === this || rt && this.x === rt.x && this.y === rt.y && this.width === rt.width && this.height === rt.height || false;
    },
    toString: function toString() {
      var f = Formatter.instance;
      return '{ x: ' + f.number(this.x) + ', y: ' + f.number(this.y) + ', width: ' + f.number(this.width) + ', height: ' + f.number(this.height) + ' }';
    },
    _serialize: function _serialize(options) {
      var f = options.formatter;
      return [f.number(this.x), f.number(this.y), f.number(this.width), f.number(this.height)];
    },
    getPoint: function getPoint(_dontLink) {
      var ctor = _dontLink ? Point : LinkedPoint;
      return new ctor(this.x, this.y, this, 'setPoint');
    },
    setPoint: function setPoint() {
      var point = Point.read(arguments);
      this.x = point.x;
      this.y = point.y;
    },
    getSize: function getSize(_dontLink) {
      var ctor = _dontLink ? Size : LinkedSize;
      return new ctor(this.width, this.height, this, 'setSize');
    },
    _fw: 1,
    _fh: 1,
    setSize: function setSize() {
      var size = Size.read(arguments),
          sx = this._sx,
          sy = this._sy,
          w = size.width,
          h = size.height;

      if (sx) {
        this.x += (this.width - w) * sx;
      }

      if (sy) {
        this.y += (this.height - h) * sy;
      }

      this.width = w;
      this.height = h;
      this._fw = this._fh = 1;
    },
    getLeft: function getLeft() {
      return this.x;
    },
    setLeft: function setLeft(left) {
      if (!this._fw) {
        var amount = left - this.x;
        this.width -= this._sx === 0.5 ? amount * 2 : amount;
      }

      this.x = left;
      this._sx = this._fw = 0;
    },
    getTop: function getTop() {
      return this.y;
    },
    setTop: function setTop(top) {
      if (!this._fh) {
        var amount = top - this.y;
        this.height -= this._sy === 0.5 ? amount * 2 : amount;
      }

      this.y = top;
      this._sy = this._fh = 0;
    },
    getRight: function getRight() {
      return this.x + this.width;
    },
    setRight: function setRight(right) {
      if (!this._fw) {
        var amount = right - this.x;
        this.width = this._sx === 0.5 ? amount * 2 : amount;
      }

      this.x = right - this.width;
      this._sx = 1;
      this._fw = 0;
    },
    getBottom: function getBottom() {
      return this.y + this.height;
    },
    setBottom: function setBottom(bottom) {
      if (!this._fh) {
        var amount = bottom - this.y;
        this.height = this._sy === 0.5 ? amount * 2 : amount;
      }

      this.y = bottom - this.height;
      this._sy = 1;
      this._fh = 0;
    },
    getCenterX: function getCenterX() {
      return this.x + this.width / 2;
    },
    setCenterX: function setCenterX(x) {
      if (this._fw || this._sx === 0.5) {
        this.x = x - this.width / 2;
      } else {
        if (this._sx) {
          this.x += (x - this.x) * 2 * this._sx;
        }

        this.width = (x - this.x) * 2;
      }

      this._sx = 0.5;
      this._fw = 0;
    },
    getCenterY: function getCenterY() {
      return this.y + this.height / 2;
    },
    setCenterY: function setCenterY(y) {
      if (this._fh || this._sy === 0.5) {
        this.y = y - this.height / 2;
      } else {
        if (this._sy) {
          this.y += (y - this.y) * 2 * this._sy;
        }

        this.height = (y - this.y) * 2;
      }

      this._sy = 0.5;
      this._fh = 0;
    },
    getCenter: function getCenter(_dontLink) {
      var ctor = _dontLink ? Point : LinkedPoint;
      return new ctor(this.getCenterX(), this.getCenterY(), this, 'setCenter');
    },
    setCenter: function setCenter() {
      var point = Point.read(arguments);
      this.setCenterX(point.x);
      this.setCenterY(point.y);
      return this;
    },
    getArea: function getArea() {
      return this.width * this.height;
    },
    isEmpty: function isEmpty() {
      return this.width === 0 || this.height === 0;
    },
    contains: function contains(arg) {
      return arg && arg.width !== undefined || (Array.isArray(arg) ? arg : arguments).length === 4 ? this._containsRectangle(_Rectangle.read(arguments)) : this._containsPoint(Point.read(arguments));
    },
    _containsPoint: function _containsPoint(point) {
      var x = point.x,
          y = point.y;
      return x >= this.x && y >= this.y && x <= this.x + this.width && y <= this.y + this.height;
    },
    _containsRectangle: function _containsRectangle(rect) {
      var x = rect.x,
          y = rect.y;
      return x >= this.x && y >= this.y && x + rect.width <= this.x + this.width && y + rect.height <= this.y + this.height;
    },
    intersects: function intersects() {
      var rect = _Rectangle.read(arguments),
          epsilon = Base.read(arguments) || 0;

      return rect.x + rect.width > this.x - epsilon && rect.y + rect.height > this.y - epsilon && rect.x < this.x + this.width + epsilon && rect.y < this.y + this.height + epsilon;
    },
    intersect: function intersect() {
      var rect = _Rectangle.read(arguments),
          x1 = Math.max(this.x, rect.x),
          y1 = Math.max(this.y, rect.y),
          x2 = Math.min(this.x + this.width, rect.x + rect.width),
          y2 = Math.min(this.y + this.height, rect.y + rect.height);

      return new _Rectangle(x1, y1, x2 - x1, y2 - y1);
    },
    unite: function unite() {
      var rect = _Rectangle.read(arguments),
          x1 = Math.min(this.x, rect.x),
          y1 = Math.min(this.y, rect.y),
          x2 = Math.max(this.x + this.width, rect.x + rect.width),
          y2 = Math.max(this.y + this.height, rect.y + rect.height);

      return new _Rectangle(x1, y1, x2 - x1, y2 - y1);
    },
    include: function include() {
      var point = Point.read(arguments);
      var x1 = Math.min(this.x, point.x),
          y1 = Math.min(this.y, point.y),
          x2 = Math.max(this.x + this.width, point.x),
          y2 = Math.max(this.y + this.height, point.y);
      return new _Rectangle(x1, y1, x2 - x1, y2 - y1);
    },
    expand: function expand() {
      var amount = Size.read(arguments),
          hor = amount.width,
          ver = amount.height;
      return new _Rectangle(this.x - hor / 2, this.y - ver / 2, this.width + hor, this.height + ver);
    },
    scale: function scale(hor, ver) {
      return this.expand(this.width * hor - this.width, this.height * (ver === undefined ? hor : ver) - this.height);
    }
  }, Base.each([['Top', 'Left'], ['Top', 'Right'], ['Bottom', 'Left'], ['Bottom', 'Right'], ['Left', 'Center'], ['Top', 'Center'], ['Right', 'Center'], ['Bottom', 'Center']], function (parts, index) {
    var part = parts.join(''),
        xFirst = /^[RL]/.test(part);
    if (index >= 4) parts[1] += xFirst ? 'Y' : 'X';
    var x = parts[xFirst ? 0 : 1],
        y = parts[xFirst ? 1 : 0],
        getX = 'get' + x,
        getY = 'get' + y,
        setX = 'set' + x,
        setY = 'set' + y,
        get = 'get' + part,
        set = 'set' + part;

    this[get] = function (_dontLink) {
      var ctor = _dontLink ? Point : LinkedPoint;
      return new ctor(this[getX](), this[getY](), this, set);
    };

    this[set] = function () {
      var point = Point.read(arguments);
      this[setX](point.x);
      this[setY](point.y);
    };
  }, {
    beans: true
  }));

  var LinkedRectangle = _Rectangle.extend({
    initialize: function Rectangle(x, y, width, height, owner, setter) {
      this._set(x, y, width, height, true);

      this._owner = owner;
      this._setter = setter;
    },
    _set: function _set(x, y, width, height, _dontNotify) {
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
      if (!_dontNotify) this._owner[this._setter](this);
      return this;
    }
  }, new function () {
    var proto = _Rectangle.prototype;
    return Base.each(['x', 'y', 'width', 'height'], function (key) {
      var part = Base.capitalize(key),
          internal = '_' + key;

      this['get' + part] = function () {
        return this[internal];
      };

      this['set' + part] = function (value) {
        this[internal] = value;
        if (!this._dontNotify) this._owner[this._setter](this);
      };
    }, Base.each(['Point', 'Size', 'Center', 'Left', 'Top', 'Right', 'Bottom', 'CenterX', 'CenterY', 'TopLeft', 'TopRight', 'BottomLeft', 'BottomRight', 'LeftCenter', 'TopCenter', 'RightCenter', 'BottomCenter'], function (key) {
      var name = 'set' + key;

      this[name] = function () {
        this._dontNotify = true;
        proto[name].apply(this, arguments);
        this._dontNotify = false;

        this._owner[this._setter](this);
      };
    }, {
      isSelected: function isSelected() {
        return !!(this._owner._selection & 2);
      },
      setSelected: function setSelected(selected) {
        var owner = this._owner;

        if (owner._changeSelection) {
          owner._changeSelection(2, selected);
        }
      }
    }));
  }());

  var Matrix = Base.extend({
    _class: 'Matrix',
    initialize: function Matrix(arg, _dontNotify) {
      var args = arguments,
          count = args.length,
          ok = true;

      if (count >= 6) {
        this._set.apply(this, args);
      } else if (count === 1 || count === 2) {
        if (arg instanceof Matrix) {
          this._set(arg._a, arg._b, arg._c, arg._d, arg._tx, arg._ty, _dontNotify);
        } else if (Array.isArray(arg)) {
          this._set.apply(this, _dontNotify ? arg.concat([_dontNotify]) : arg);
        } else {
          ok = false;
        }
      } else if (!count) {
        this.reset();
      } else {
        ok = false;
      }

      if (!ok) {
        throw new Error('Unsupported matrix parameters');
      }

      return this;
    },
    set: '#initialize',
    _set: function _set(a, b, c, d, tx, ty, _dontNotify) {
      this._a = a;
      this._b = b;
      this._c = c;
      this._d = d;
      this._tx = tx;
      this._ty = ty;
      if (!_dontNotify) this._changed();
      return this;
    },
    _serialize: function _serialize(options, dictionary) {
      return Base.serialize(this.getValues(), options, true, dictionary);
    },
    _changed: function _changed() {
      var owner = this._owner;

      if (owner) {
        if (owner._applyMatrix) {
          owner.transform(null, true);
        } else {
          owner._changed(25);
        }
      }
    },
    clone: function clone() {
      return new Matrix(this._a, this._b, this._c, this._d, this._tx, this._ty);
    },
    equals: function equals(mx) {
      return mx === this || mx && this._a === mx._a && this._b === mx._b && this._c === mx._c && this._d === mx._d && this._tx === mx._tx && this._ty === mx._ty;
    },
    toString: function toString() {
      var f = Formatter.instance;
      return '[[' + [f.number(this._a), f.number(this._c), f.number(this._tx)].join(', ') + '], [' + [f.number(this._b), f.number(this._d), f.number(this._ty)].join(', ') + ']]';
    },
    reset: function reset(_dontNotify) {
      this._a = this._d = 1;
      this._b = this._c = this._tx = this._ty = 0;
      if (!_dontNotify) this._changed();
      return this;
    },
    apply: function apply(recursively, _setApplyMatrix) {
      var owner = this._owner;

      if (owner) {
        owner.transform(null, Base.pick(recursively, true), _setApplyMatrix);
        return this.isIdentity();
      }

      return false;
    },
    translate: function translate() {
      var point = Point.read(arguments),
          x = point.x,
          y = point.y;
      this._tx += x * this._a + y * this._c;
      this._ty += x * this._b + y * this._d;

      this._changed();

      return this;
    },
    scale: function scale() {
      var args = arguments,
          scale = Point.read(args),
          center = Point.read(args, 0, {
        readNull: true
      });
      if (center) this.translate(center);
      this._a *= scale.x;
      this._b *= scale.x;
      this._c *= scale.y;
      this._d *= scale.y;
      if (center) this.translate(center.negate());

      this._changed();

      return this;
    },
    rotate: function rotate(angle) {
      angle *= Math.PI / 180;
      var center = Point.read(arguments, 1),
          x = center.x,
          y = center.y,
          cos = Math.cos(angle),
          sin = Math.sin(angle),
          tx = x - x * cos + y * sin,
          ty = y - x * sin - y * cos,
          a = this._a,
          b = this._b,
          c = this._c,
          d = this._d;
      this._a = cos * a + sin * c;
      this._b = cos * b + sin * d;
      this._c = -sin * a + cos * c;
      this._d = -sin * b + cos * d;
      this._tx += tx * a + ty * c;
      this._ty += tx * b + ty * d;

      this._changed();

      return this;
    },
    shear: function shear() {
      var args = arguments,
          shear = Point.read(args),
          center = Point.read(args, 0, {
        readNull: true
      });
      if (center) this.translate(center);
      var a = this._a,
          b = this._b;
      this._a += shear.y * this._c;
      this._b += shear.y * this._d;
      this._c += shear.x * a;
      this._d += shear.x * b;
      if (center) this.translate(center.negate());

      this._changed();

      return this;
    },
    skew: function skew() {
      var args = arguments,
          skew = Point.read(args),
          center = Point.read(args, 0, {
        readNull: true
      }),
          toRadians = Math.PI / 180,
          shear = new Point(Math.tan(skew.x * toRadians), Math.tan(skew.y * toRadians));
      return this.shear(shear, center);
    },
    append: function append(mx, _dontNotify) {
      if (mx) {
        var a1 = this._a,
            b1 = this._b,
            c1 = this._c,
            d1 = this._d,
            a2 = mx._a,
            b2 = mx._c,
            c2 = mx._b,
            d2 = mx._d,
            tx2 = mx._tx,
            ty2 = mx._ty;
        this._a = a2 * a1 + c2 * c1;
        this._c = b2 * a1 + d2 * c1;
        this._b = a2 * b1 + c2 * d1;
        this._d = b2 * b1 + d2 * d1;
        this._tx += tx2 * a1 + ty2 * c1;
        this._ty += tx2 * b1 + ty2 * d1;
        if (!_dontNotify) this._changed();
      }

      return this;
    },
    prepend: function prepend(mx, _dontNotify) {
      if (mx) {
        var a1 = this._a,
            b1 = this._b,
            c1 = this._c,
            d1 = this._d,
            tx1 = this._tx,
            ty1 = this._ty,
            a2 = mx._a,
            b2 = mx._c,
            c2 = mx._b,
            d2 = mx._d,
            tx2 = mx._tx,
            ty2 = mx._ty;
        this._a = a2 * a1 + b2 * b1;
        this._c = a2 * c1 + b2 * d1;
        this._b = c2 * a1 + d2 * b1;
        this._d = c2 * c1 + d2 * d1;
        this._tx = a2 * tx1 + b2 * ty1 + tx2;
        this._ty = c2 * tx1 + d2 * ty1 + ty2;
        if (!_dontNotify) this._changed();
      }

      return this;
    },
    appended: function appended(mx) {
      return this.clone().append(mx);
    },
    prepended: function prepended(mx) {
      return this.clone().prepend(mx);
    },
    invert: function invert() {
      var a = this._a,
          b = this._b,
          c = this._c,
          d = this._d,
          tx = this._tx,
          ty = this._ty,
          det = a * d - b * c,
          res = null;

      if (det && !isNaN(det) && isFinite(tx) && isFinite(ty)) {
        this._a = d / det;
        this._b = -b / det;
        this._c = -c / det;
        this._d = a / det;
        this._tx = (c * ty - d * tx) / det;
        this._ty = (b * tx - a * ty) / det;
        res = this;
      }

      return res;
    },
    inverted: function inverted() {
      return this.clone().invert();
    },
    concatenate: '#append',
    preConcatenate: '#prepend',
    chain: '#appended',
    _shiftless: function _shiftless() {
      return new Matrix(this._a, this._b, this._c, this._d, 0, 0);
    },
    _orNullIfIdentity: function _orNullIfIdentity() {
      return this.isIdentity() ? null : this;
    },
    isIdentity: function isIdentity() {
      return this._a === 1 && this._b === 0 && this._c === 0 && this._d === 1 && this._tx === 0 && this._ty === 0;
    },
    isInvertible: function isInvertible() {
      var det = this._a * this._d - this._c * this._b;
      return det && !isNaN(det) && isFinite(this._tx) && isFinite(this._ty);
    },
    isSingular: function isSingular() {
      return !this.isInvertible();
    },
    transform: function transform(src, dst, count) {
      return arguments.length < 3 ? this._transformPoint(Point.read(arguments)) : this._transformCoordinates(src, dst, count);
    },
    _transformPoint: function _transformPoint(point, dest, _dontNotify) {
      var x = point.x,
          y = point.y;
      if (!dest) dest = new Point();
      return dest._set(x * this._a + y * this._c + this._tx, x * this._b + y * this._d + this._ty, _dontNotify);
    },
    _transformCoordinates: function _transformCoordinates(src, dst, count) {
      for (var i = 0, max = 2 * count; i < max; i += 2) {
        var x = src[i],
            y = src[i + 1];
        dst[i] = x * this._a + y * this._c + this._tx;
        dst[i + 1] = x * this._b + y * this._d + this._ty;
      }

      return dst;
    },
    _transformCorners: function _transformCorners(rect) {
      var x1 = rect.x,
          y1 = rect.y,
          x2 = x1 + rect.width,
          y2 = y1 + rect.height,
          coords = [x1, y1, x2, y1, x2, y2, x1, y2];
      return this._transformCoordinates(coords, coords, 4);
    },
    _transformBounds: function _transformBounds(bounds, dest, _dontNotify) {
      var coords = this._transformCorners(bounds),
          min = coords.slice(0, 2),
          max = min.slice();

      for (var i = 2; i < 8; i++) {
        var val = coords[i],
            j = i & 1;

        if (val < min[j]) {
          min[j] = val;
        } else if (val > max[j]) {
          max[j] = val;
        }
      }

      if (!dest) dest = new _Rectangle();
      return dest._set(min[0], min[1], max[0] - min[0], max[1] - min[1], _dontNotify);
    },
    inverseTransform: function inverseTransform() {
      return this._inverseTransform(Point.read(arguments));
    },
    _inverseTransform: function _inverseTransform(point, dest, _dontNotify) {
      var a = this._a,
          b = this._b,
          c = this._c,
          d = this._d,
          tx = this._tx,
          ty = this._ty,
          det = a * d - b * c,
          res = null;

      if (det && !isNaN(det) && isFinite(tx) && isFinite(ty)) {
        var x = point.x - this._tx,
            y = point.y - this._ty;
        if (!dest) dest = new Point();
        res = dest._set((x * d - y * c) / det, (y * a - x * b) / det, _dontNotify);
      }

      return res;
    },
    decompose: function decompose() {
      var a = this._a,
          b = this._b,
          c = this._c,
          d = this._d,
          det = a * d - b * c,
          sqrt = Math.sqrt,
          atan2 = Math.atan2,
          degrees = 180 / Math.PI,
          rotate,
          scale,
          skew;

      if (a !== 0 || b !== 0) {
        var r = sqrt(a * a + b * b);
        rotate = Math.acos(a / r) * (b > 0 ? 1 : -1);
        scale = [r, det / r];
        skew = [atan2(a * c + b * d, r * r), 0];
      } else if (c !== 0 || d !== 0) {
        var s = sqrt(c * c + d * d);
        rotate = Math.asin(c / s) * (d > 0 ? 1 : -1);
        scale = [det / s, s];
        skew = [0, atan2(a * c + b * d, s * s)];
      } else {
        rotate = 0;
        skew = scale = [0, 0];
      }

      return {
        translation: this.getTranslation(),
        rotation: rotate * degrees,
        scaling: new Point(scale),
        skewing: new Point(skew[0] * degrees, skew[1] * degrees)
      };
    },
    getValues: function getValues() {
      return [this._a, this._b, this._c, this._d, this._tx, this._ty];
    },
    getTranslation: function getTranslation() {
      return new Point(this._tx, this._ty);
    },
    getScaling: function getScaling() {
      return this.decompose().scaling;
    },
    getRotation: function getRotation() {
      return this.decompose().rotation;
    },
    applyToContext: function applyToContext(ctx) {
      if (!this.isIdentity()) {
        ctx.transform(this._a, this._b, this._c, this._d, this._tx, this._ty);
      }
    }
  }, Base.each(['a', 'b', 'c', 'd', 'tx', 'ty'], function (key) {
    var part = Base.capitalize(key),
        prop = '_' + key;

    this['get' + part] = function () {
      return this[prop];
    };

    this['set' + part] = function (value) {
      this[prop] = value;

      this._changed();
    };
  }, {}));
  var Line = Base.extend({
    _class: 'Line',
    initialize: function Line(arg0, arg1, arg2, arg3, arg4) {
      var asVector = false;

      if (arguments.length >= 4) {
        this._px = arg0;
        this._py = arg1;
        this._vx = arg2;
        this._vy = arg3;
        asVector = arg4;
      } else {
        this._px = arg0.x;
        this._py = arg0.y;
        this._vx = arg1.x;
        this._vy = arg1.y;
        asVector = arg2;
      }

      if (!asVector) {
        this._vx -= this._px;
        this._vy -= this._py;
      }
    },
    getPoint: function getPoint() {
      return new Point(this._px, this._py);
    },
    getVector: function getVector() {
      return new Point(this._vx, this._vy);
    },
    getLength: function getLength() {
      return this.getVector().getLength();
    },
    intersect: function intersect(line, isInfinite) {
      return Line.intersect(this._px, this._py, this._vx, this._vy, line._px, line._py, line._vx, line._vy, true, isInfinite);
    },
    getSide: function getSide(point, isInfinite) {
      return Line.getSide(this._px, this._py, this._vx, this._vy, point.x, point.y, true, isInfinite);
    },
    getDistance: function getDistance(point) {
      return Math.abs(this.getSignedDistance(point));
    },
    getSignedDistance: function getSignedDistance(point) {
      return Line.getSignedDistance(this._px, this._py, this._vx, this._vy, point.x, point.y, true);
    },
    isCollinear: function isCollinear(line) {
      return Point.isCollinear(this._vx, this._vy, line._vx, line._vy);
    },
    isOrthogonal: function isOrthogonal(line) {
      return Point.isOrthogonal(this._vx, this._vy, line._vx, line._vy);
    },
    statics: {
      intersect: function intersect(p1x, p1y, v1x, v1y, p2x, p2y, v2x, v2y, asVector, isInfinite) {
        if (!asVector) {
          v1x -= p1x;
          v1y -= p1y;
          v2x -= p2x;
          v2y -= p2y;
        }

        var cross = v1x * v2y - v1y * v2x;

        if (!Numerical.isMachineZero(cross)) {
          var dx = p1x - p2x,
              dy = p1y - p2y,
              u1 = (v2x * dy - v2y * dx) / cross,
              u2 = (v1x * dy - v1y * dx) / cross,
              epsilon = 1e-12,
              uMin = -epsilon,
              uMax = 1 + epsilon;

          if (isInfinite || uMin < u1 && u1 < uMax && uMin < u2 && u2 < uMax) {
            if (!isInfinite) {
              u1 = u1 <= 0 ? 0 : u1 >= 1 ? 1 : u1;
            }

            return new Point(p1x + u1 * v1x, p1y + u1 * v1y);
          }
        }
      },
      getSide: function getSide(px, py, vx, vy, x, y, asVector, isInfinite) {
        if (!asVector) {
          vx -= px;
          vy -= py;
        }

        var v2x = x - px,
            v2y = y - py,
            ccw = v2x * vy - v2y * vx;

        if (!isInfinite && Numerical.isMachineZero(ccw)) {
          ccw = (v2x * vx + v2x * vx) / (vx * vx + vy * vy);
          if (ccw >= 0 && ccw <= 1) ccw = 0;
        }

        return ccw < 0 ? -1 : ccw > 0 ? 1 : 0;
      },
      getSignedDistance: function getSignedDistance(px, py, vx, vy, x, y, asVector) {
        if (!asVector) {
          vx -= px;
          vy -= py;
        }

        return vx === 0 ? vy > 0 ? x - px : px - x : vy === 0 ? vx < 0 ? y - py : py - y : ((x - px) * vy - (y - py) * vx) / (vy > vx ? vy * Math.sqrt(1 + vx * vx / (vy * vy)) : vx * Math.sqrt(1 + vy * vy / (vx * vx)));
      },
      getDistance: function getDistance(px, py, vx, vy, x, y, asVector) {
        return Math.abs(Line.getSignedDistance(px, py, vx, vy, x, y, asVector));
      }
    }
  });
  var Project = PaperScopeItem.extend({
    _class: 'Project',
    _list: 'projects',
    _reference: 'project',
    _compactSerialize: true,
    initialize: function Project(element) {
      PaperScopeItem.call(this, true);
      this._children = [];
      this._namedChildren = {};
      this._activeLayer = null;
      this._currentStyle = new Style(null, null, this);
      this._view = View.create(this, element || CanvasProvider.getCanvas(1, 1));
      this._selectionItems = {};
      this._selectionCount = 0;
      this._updateVersion = 0;
    },
    _serialize: function _serialize(options, dictionary) {
      return Base.serialize(this._children, options, true, dictionary);
    },
    _changed: function _changed(flags, item) {
      if (flags & 1) {
        var view = this._view;

        if (view) {
          view._needsUpdate = true;
          if (!view._requested && view._autoUpdate) view.requestUpdate();
        }
      }

      var changes = this._changes;

      if (changes && item) {
        var changesById = this._changesById,
            id = item._id,
            entry = changesById[id];

        if (entry) {
          entry.flags |= flags;
        } else {
          changes.push(changesById[id] = {
            item: item,
            flags: flags
          });
        }
      }
    },
    clear: function clear() {
      var children = this._children;

      for (var i = children.length - 1; i >= 0; i--) {
        children[i].remove();
      }
    },
    isEmpty: function isEmpty() {
      return !this._children.length;
    },
    remove: function remove() {
      if (!remove.base.call(this)) return false;
      if (this._view) this._view.remove();
      return true;
    },
    getView: function getView() {
      return this._view;
    },
    getCurrentStyle: function getCurrentStyle() {
      return this._currentStyle;
    },
    setCurrentStyle: function setCurrentStyle(style) {
      this._currentStyle.set(style);
    },
    getIndex: function getIndex() {
      return this._index;
    },
    getOptions: function getOptions() {
      return this._scope.settings;
    },
    getLayers: function getLayers() {
      return this._children;
    },
    getActiveLayer: function getActiveLayer() {
      return this._activeLayer || new Layer({
        project: this,
        insert: true
      });
    },
    getSymbolDefinitions: function getSymbolDefinitions() {
      var definitions = [],
          ids = {};
      this.getItems({
        class: SymbolItem,
        match: function match(item) {
          var definition = item._definition,
              id = definition._id;

          if (!ids[id]) {
            ids[id] = true;
            definitions.push(definition);
          }

          return false;
        }
      });
      return definitions;
    },
    getSymbols: 'getSymbolDefinitions',
    getSelectedItems: function getSelectedItems() {
      var selectionItems = this._selectionItems,
          items = [];

      for (var id in selectionItems) {
        var item = selectionItems[id],
            selection = item._selection;

        if (selection & 1 && item.isInserted()) {
          items.push(item);
        } else if (!selection) {
          this._updateSelection(item);
        }
      }

      return items;
    },
    _updateSelection: function _updateSelection(item) {
      var id = item._id,
          selectionItems = this._selectionItems;

      if (item._selection) {
        if (selectionItems[id] !== item) {
          this._selectionCount++;
          selectionItems[id] = item;
        }
      } else if (selectionItems[id] === item) {
        this._selectionCount--;
        delete selectionItems[id];
      }
    },
    selectAll: function selectAll() {
      var children = this._children;

      for (var i = 0, l = children.length; i < l; i++) {
        children[i].setFullySelected(true);
      }
    },
    deselectAll: function deselectAll() {
      var selectionItems = this._selectionItems;

      for (var i in selectionItems) {
        selectionItems[i].setFullySelected(false);
      }
    },
    addLayer: function addLayer(layer) {
      return this.insertLayer(undefined, layer);
    },
    insertLayer: function insertLayer(index, layer) {
      if (layer instanceof Layer) {
        layer._remove(false, true);

        Base.splice(this._children, [layer], index, 0);

        layer._setProject(this, true);

        var name = layer._name;
        if (name) layer.setName(name);
        if (this._changes) layer._changed(5);
        if (!this._activeLayer) this._activeLayer = layer;
      } else {
        layer = null;
      }

      return layer;
    },
    _insertItem: function _insertItem(index, item, _created) {
      item = this.insertLayer(index, item) || (this._activeLayer || this._insertItem(undefined, new Layer(Item.NO_INSERT), true)).insertChild(index, item);
      if (_created && item.activate) item.activate();
      return item;
    },
    getItems: function getItems(options) {
      return Item._getItems(this, options);
    },
    getItem: function getItem(options) {
      return Item._getItems(this, options, null, null, true)[0] || null;
    },
    importJSON: function importJSON(json) {
      this.activate();
      var layer = this._activeLayer;
      return Base.importJSON(json, layer && layer.isEmpty() && layer);
    },
    removeOn: function removeOn(type) {
      var sets = this._removeSets;

      if (sets) {
        if (type === 'mouseup') sets.mousedrag = null;
        var set = sets[type];

        if (set) {
          for (var id in set) {
            var item = set[id];

            for (var key in sets) {
              var other = sets[key];
              if (other && other != set) delete other[item._id];
            }

            item.remove();
          }

          sets[type] = null;
        }
      }
    },
    draw: function draw(ctx, matrix, pixelRatio) {
      this._updateVersion++;
      ctx.save();
      matrix.applyToContext(ctx);
      var children = this._children,
          param = new Base({
        offset: new Point(0, 0),
        pixelRatio: pixelRatio,
        viewMatrix: matrix.isIdentity() ? null : matrix,
        matrices: [new Matrix()],
        updateMatrix: true
      });

      for (var i = 0, l = children.length; i < l; i++) {
        children[i].draw(ctx, param);
      }

      ctx.restore();

      if (this._selectionCount > 0) {
        ctx.save();
        ctx.strokeWidth = 1;
        var items = this._selectionItems,
            size = this._scope.settings.handleSize,
            version = this._updateVersion;

        for (var id in items) {
          items[id]._drawSelection(ctx, matrix, size, items, version);
        }

        ctx.restore();
      }
    }
  });
  var Item = Base.extend(Emitter, {
    statics: {
      extend: function extend(src) {
        if (src._serializeFields) src._serializeFields = Base.set({}, this.prototype._serializeFields, src._serializeFields);
        return extend.base.apply(this, arguments);
      },
      NO_INSERT: {
        insert: false
      }
    },
    _class: 'Item',
    _name: null,
    _applyMatrix: true,
    _canApplyMatrix: true,
    _canScaleStroke: false,
    _pivot: null,
    _visible: true,
    _blendMode: 'normal',
    _opacity: 1,
    _locked: false,
    _guide: false,
    _clipMask: false,
    _selection: 0,
    _selectBounds: true,
    _selectChildren: false,
    _serializeFields: {
      name: null,
      applyMatrix: null,
      matrix: new Matrix(),
      pivot: null,
      visible: true,
      blendMode: 'normal',
      opacity: 1,
      locked: false,
      guide: false,
      clipMask: false,
      selected: false,
      data: {}
    },
    _prioritize: ['applyMatrix']
  }, new function () {
    var handlers = ['onMouseDown', 'onMouseUp', 'onMouseDrag', 'onClick', 'onDoubleClick', 'onMouseMove', 'onMouseEnter', 'onMouseLeave'];
    return Base.each(handlers, function (name) {
      this._events[name] = {
        install: function install(type) {
          this.getView()._countItemEvent(type, 1);
        },
        uninstall: function uninstall(type) {
          this.getView()._countItemEvent(type, -1);
        }
      };
    }, {
      _events: {
        onFrame: {
          install: function install() {
            this.getView()._animateItem(this, true);
          },
          uninstall: function uninstall() {
            this.getView()._animateItem(this, false);
          }
        },
        onLoad: {},
        onError: {}
      },
      statics: {
        _itemHandlers: handlers
      }
    });
  }(), {
    initialize: function Item() {},
    _initialize: function _initialize(props, point) {
      var hasProps = props && Base.isPlainObject(props),
          internal = hasProps && props.internal === true,
          matrix = this._matrix = new Matrix(),
          project = hasProps && props.project || paper.project,
          settings = paper.settings;
      this._id = internal ? null : UID.get();
      this._parent = this._index = null;
      this._applyMatrix = this._canApplyMatrix && settings.applyMatrix;
      if (point) matrix.translate(point);
      matrix._owner = this;
      this._style = new Style(project._currentStyle, this, project);

      if (internal || hasProps && props.insert == false || !settings.insertItems && !(hasProps && props.insert === true)) {
        this._setProject(project);
      } else {
        (hasProps && props.parent || project)._insertItem(undefined, this, true);
      }

      if (hasProps && props !== Item.NO_INSERT) {
        this.set(props, {
          internal: true,
          insert: true,
          project: true,
          parent: true
        });
      }

      return hasProps;
    },
    _serialize: function _serialize(options, dictionary) {
      var props = {},
          that = this;

      function serialize(fields) {
        for (var key in fields) {
          var value = that[key];

          if (!Base.equals(value, key === 'leading' ? fields.fontSize * 1.2 : fields[key])) {
            props[key] = Base.serialize(value, options, key !== 'data', dictionary);
          }
        }
      }

      serialize(this._serializeFields);
      if (!(this instanceof Group)) serialize(this._style._defaults);
      return [this._class, props];
    },
    _changed: function _changed(flags) {
      var symbol = this._symbol,
          cacheParent = this._parent || symbol,
          project = this._project;

      if (flags & 8) {
        this._bounds = this._position = this._decomposed = undefined;
      }

      if (flags & 16) {
        this._globalMatrix = undefined;
      }

      if (cacheParent && flags & 72) {
        Item._clearBoundsCache(cacheParent);
      }

      if (flags & 2) {
        Item._clearBoundsCache(this);
      }

      if (project) project._changed(flags, this);
      if (symbol) symbol._changed(flags);
    },
    getId: function getId() {
      return this._id;
    },
    getName: function getName() {
      return this._name;
    },
    setName: function setName(name) {
      if (this._name) this._removeNamed();
      if (name === +name + '') throw new Error('Names consisting only of numbers are not supported.');

      var owner = this._getOwner();

      if (name && owner) {
        var children = owner._children,
            namedChildren = owner._namedChildren;
        (namedChildren[name] = namedChildren[name] || []).push(this);
        if (!(name in children)) children[name] = this;
      }

      this._name = name || undefined;

      this._changed(256);
    },
    getStyle: function getStyle() {
      return this._style;
    },
    setStyle: function setStyle(style) {
      this.getStyle().set(style);
    }
  }, Base.each(['locked', 'visible', 'blendMode', 'opacity', 'guide'], function (name) {
    var part = Base.capitalize(name),
        key = '_' + name,
        flags = {
      locked: 256,
      visible: 265
    };

    this['get' + part] = function () {
      return this[key];
    };

    this['set' + part] = function (value) {
      if (value != this[key]) {
        this[key] = value;

        this._changed(flags[name] || 257);
      }
    };
  }, {}), {
    beans: true,
    getSelection: function getSelection() {
      return this._selection;
    },
    setSelection: function setSelection(selection) {
      if (selection !== this._selection) {
        this._selection = selection;
        var project = this._project;

        if (project) {
          project._updateSelection(this);

          this._changed(257);
        }
      }
    },
    _changeSelection: function _changeSelection(flag, selected) {
      var selection = this._selection;
      this.setSelection(selected ? selection | flag : selection & ~flag);
    },
    isSelected: function isSelected() {
      if (this._selectChildren) {
        var children = this._children;

        for (var i = 0, l = children.length; i < l; i++) {
          if (children[i].isSelected()) return true;
        }
      }

      return !!(this._selection & 1);
    },
    setSelected: function setSelected(selected) {
      if (this._selectChildren) {
        var children = this._children;

        for (var i = 0, l = children.length; i < l; i++) {
          children[i].setSelected(selected);
        }
      }

      this._changeSelection(1, selected);
    },
    isFullySelected: function isFullySelected() {
      var children = this._children,
          selected = !!(this._selection & 1);

      if (children && selected) {
        for (var i = 0, l = children.length; i < l; i++) {
          if (!children[i].isFullySelected()) return false;
        }

        return true;
      }

      return selected;
    },
    setFullySelected: function setFullySelected(selected) {
      var children = this._children;

      if (children) {
        for (var i = 0, l = children.length; i < l; i++) {
          children[i].setFullySelected(selected);
        }
      }

      this._changeSelection(1, selected);
    },
    isClipMask: function isClipMask() {
      return this._clipMask;
    },
    setClipMask: function setClipMask(clipMask) {
      if (this._clipMask != (clipMask = !!clipMask)) {
        this._clipMask = clipMask;

        if (clipMask) {
          this.setFillColor(null);
          this.setStrokeColor(null);
        }

        this._changed(257);

        if (this._parent) this._parent._changed(2048);
      }
    },
    getData: function getData() {
      if (!this._data) this._data = {};
      return this._data;
    },
    setData: function setData(data) {
      this._data = data;
    },
    getPosition: function getPosition(_dontLink) {
      var ctor = _dontLink ? Point : LinkedPoint;

      var position = this._position || (this._position = this._getPositionFromBounds());

      return new ctor(position.x, position.y, this, 'setPosition');
    },
    setPosition: function setPosition() {
      this.translate(Point.read(arguments).subtract(this.getPosition(true)));
    },
    _getPositionFromBounds: function _getPositionFromBounds(bounds) {
      return this._pivot ? this._matrix._transformPoint(this._pivot) : (bounds || this.getBounds()).getCenter(true);
    },
    getPivot: function getPivot() {
      var pivot = this._pivot;
      return pivot ? new LinkedPoint(pivot.x, pivot.y, this, 'setPivot') : null;
    },
    setPivot: function setPivot() {
      this._pivot = Point.read(arguments, 0, {
        clone: true,
        readNull: true
      });
      this._position = undefined;
    }
  }, Base.each({
    getStrokeBounds: {
      stroke: true
    },
    getHandleBounds: {
      handle: true
    },
    getInternalBounds: {
      internal: true
    }
  }, function (options, key) {
    this[key] = function (matrix) {
      return this.getBounds(matrix, options);
    };
  }, {
    beans: true,
    getBounds: function getBounds(matrix, options) {
      var hasMatrix = options || matrix instanceof Matrix,
          opts = Base.set({}, hasMatrix ? options : matrix, this._boundsOptions);
      if (!opts.stroke || this.getStrokeScaling()) opts.cacheItem = this;

      var rect = this._getCachedBounds(hasMatrix && matrix, opts).rect;

      return !arguments.length ? new LinkedRectangle(rect.x, rect.y, rect.width, rect.height, this, 'setBounds') : rect;
    },
    setBounds: function setBounds() {
      var rect = _Rectangle.read(arguments),
          bounds = this.getBounds(),
          _matrix = this._matrix,
          matrix = new Matrix(),
          center = rect.getCenter();

      matrix.translate(center);

      if (rect.width != bounds.width || rect.height != bounds.height) {
        if (!_matrix.isInvertible()) {
          _matrix.set(_matrix._backup || new Matrix().translate(_matrix.getTranslation()));

          bounds = this.getBounds();
        }

        matrix.scale(bounds.width !== 0 ? rect.width / bounds.width : 0, bounds.height !== 0 ? rect.height / bounds.height : 0);
      }

      center = bounds.getCenter();
      matrix.translate(-center.x, -center.y);
      this.transform(matrix);
    },
    _getBounds: function _getBounds(matrix, options) {
      var children = this._children;
      if (!children || !children.length) return new _Rectangle();

      Item._updateBoundsCache(this, options.cacheItem);

      return Item._getBounds(children, matrix, options);
    },
    _getBoundsCacheKey: function _getBoundsCacheKey(options, internal) {
      return [options.stroke ? 1 : 0, options.handle ? 1 : 0, internal ? 1 : 0].join('');
    },
    _getCachedBounds: function _getCachedBounds(matrix, options, noInternal) {
      matrix = matrix && matrix._orNullIfIdentity();

      var internal = options.internal && !noInternal,
          cacheItem = options.cacheItem,
          _matrix = internal ? null : this._matrix._orNullIfIdentity(),
          cacheKey = cacheItem && (!matrix || matrix.equals(_matrix)) && this._getBoundsCacheKey(options, internal),
          bounds = this._bounds;

      Item._updateBoundsCache(this._parent || this._symbol, cacheItem);

      if (cacheKey && bounds && cacheKey in bounds) {
        var cached = bounds[cacheKey];
        return {
          rect: cached.rect.clone(),
          nonscaling: cached.nonscaling
        };
      }

      var res = this._getBounds(matrix || _matrix, options),
          rect = res.rect || res,
          style = this._style,
          nonscaling = res.nonscaling || style.hasStroke() && !style.getStrokeScaling();

      if (cacheKey) {
        if (!bounds) {
          this._bounds = bounds = {};
        }

        var cached = bounds[cacheKey] = {
          rect: rect.clone(),
          nonscaling: nonscaling,
          internal: internal
        };
      }

      return {
        rect: rect,
        nonscaling: nonscaling
      };
    },
    _getStrokeMatrix: function _getStrokeMatrix(matrix, options) {
      var parent = this.getStrokeScaling() ? null : options && options.internal ? this : this._parent || this._symbol && this._symbol._item,
          mx = parent ? parent.getViewMatrix().invert() : matrix;
      return mx && mx._shiftless();
    },
    statics: {
      _updateBoundsCache: function _updateBoundsCache(parent, item) {
        if (parent && item) {
          var id = item._id,
              ref = parent._boundsCache = parent._boundsCache || {
            ids: {},
            list: []
          };

          if (!ref.ids[id]) {
            ref.list.push(item);
            ref.ids[id] = item;
          }
        }
      },
      _clearBoundsCache: function _clearBoundsCache(item) {
        var cache = item._boundsCache;

        if (cache) {
          item._bounds = item._position = item._boundsCache = undefined;

          for (var i = 0, list = cache.list, l = list.length; i < l; i++) {
            var other = list[i];

            if (other !== item) {
              other._bounds = other._position = undefined;
              if (other._boundsCache) Item._clearBoundsCache(other);
            }
          }
        }
      },
      _getBounds: function _getBounds(items, matrix, options) {
        var x1 = Infinity,
            x2 = -x1,
            y1 = x1,
            y2 = x2,
            nonscaling = false;
        options = options || {};

        for (var i = 0, l = items.length; i < l; i++) {
          var item = items[i];

          if (item._visible && !item.isEmpty(true)) {
            var bounds = item._getCachedBounds(matrix && matrix.appended(item._matrix), options, true),
                rect = bounds.rect;

            x1 = Math.min(rect.x, x1);
            y1 = Math.min(rect.y, y1);
            x2 = Math.max(rect.x + rect.width, x2);
            y2 = Math.max(rect.y + rect.height, y2);
            if (bounds.nonscaling) nonscaling = true;
          }
        }

        return {
          rect: isFinite(x1) ? new _Rectangle(x1, y1, x2 - x1, y2 - y1) : new _Rectangle(),
          nonscaling: nonscaling
        };
      }
    }
  }), {
    beans: true,
    _decompose: function _decompose() {
      return this._applyMatrix ? null : this._decomposed || (this._decomposed = this._matrix.decompose());
    },
    getRotation: function getRotation() {
      var decomposed = this._decompose();

      return decomposed ? decomposed.rotation : 0;
    },
    setRotation: function setRotation(rotation) {
      var current = this.getRotation();

      if (current != null && rotation != null) {
        var decomposed = this._decomposed;
        this.rotate(rotation - current);

        if (decomposed) {
          decomposed.rotation = rotation;
          this._decomposed = decomposed;
        }
      }
    },
    getScaling: function getScaling() {
      var decomposed = this._decompose(),
          s = decomposed && decomposed.scaling;

      return new LinkedPoint(s ? s.x : 1, s ? s.y : 1, this, 'setScaling');
    },
    setScaling: function setScaling() {
      var current = this.getScaling(),
          scaling = Point.read(arguments, 0, {
        clone: true,
        readNull: true
      });

      if (current && scaling && !current.equals(scaling)) {
        var rotation = this.getRotation(),
            decomposed = this._decomposed,
            matrix = new Matrix(),
            isZero = Numerical.isZero;

        if (isZero(current.x) || isZero(current.y)) {
          matrix.translate(decomposed.translation);

          if (rotation) {
            matrix.rotate(rotation);
          }

          matrix.scale(scaling.x, scaling.y);

          this._matrix.set(matrix);
        } else {
          var center = this.getPosition(true);
          matrix.translate(center);
          if (rotation) matrix.rotate(rotation);
          matrix.scale(scaling.x / current.x, scaling.y / current.y);
          if (rotation) matrix.rotate(-rotation);
          matrix.translate(center.negate());
          this.transform(matrix);
        }

        if (decomposed) {
          decomposed.scaling = scaling;
          this._decomposed = decomposed;
        }
      }
    },
    getMatrix: function getMatrix() {
      return this._matrix;
    },
    setMatrix: function setMatrix() {
      var matrix = this._matrix;
      matrix.set.apply(matrix, arguments);
    },
    getGlobalMatrix: function getGlobalMatrix(_dontClone) {
      var matrix = this._globalMatrix;

      if (matrix) {
        var parent = this._parent;
        var parents = [];

        while (parent) {
          if (!parent._globalMatrix) {
            matrix = null;

            for (var i = 0, l = parents.length; i < l; i++) {
              parents[i]._globalMatrix = null;
            }

            break;
          }

          parents.push(parent);
          parent = parent._parent;
        }
      }

      if (!matrix) {
        matrix = this._globalMatrix = this._matrix.clone();
        var parent = this._parent;
        if (parent) matrix.prepend(parent.getGlobalMatrix(true));
      }

      return _dontClone ? matrix : matrix.clone();
    },
    getViewMatrix: function getViewMatrix() {
      return this.getGlobalMatrix().prepend(this.getView()._matrix);
    },
    getApplyMatrix: function getApplyMatrix() {
      return this._applyMatrix;
    },
    setApplyMatrix: function setApplyMatrix(apply) {
      if (this._applyMatrix = this._canApplyMatrix && !!apply) this.transform(null, true);
    },
    getTransformContent: '#getApplyMatrix',
    setTransformContent: '#setApplyMatrix'
  }, {
    getProject: function getProject() {
      return this._project;
    },
    _setProject: function _setProject(project, installEvents) {
      if (this._project !== project) {
        if (this._project) this._installEvents(false);
        this._project = project;
        var children = this._children;

        for (var i = 0, l = children && children.length; i < l; i++) {
          children[i]._setProject(project);
        }

        installEvents = true;
      }

      if (installEvents) this._installEvents(true);
    },
    getView: function getView() {
      return this._project._view;
    },
    _installEvents: function _installEvents(install) {
      _installEvents.base.call(this, install);

      var children = this._children;

      for (var i = 0, l = children && children.length; i < l; i++) {
        children[i]._installEvents(install);
      }
    },
    getLayer: function getLayer() {
      var parent = this;

      while (parent = parent._parent) {
        if (parent instanceof Layer) return parent;
      }

      return null;
    },
    getParent: function getParent() {
      return this._parent;
    },
    setParent: function setParent(item) {
      return item.addChild(this);
    },
    _getOwner: '#getParent',
    getChildren: function getChildren() {
      return this._children;
    },
    setChildren: function setChildren(items) {
      this.removeChildren();
      this.addChildren(items);
    },
    getFirstChild: function getFirstChild() {
      return this._children && this._children[0] || null;
    },
    getLastChild: function getLastChild() {
      return this._children && this._children[this._children.length - 1] || null;
    },
    getNextSibling: function getNextSibling() {
      var owner = this._getOwner();

      return owner && owner._children[this._index + 1] || null;
    },
    getPreviousSibling: function getPreviousSibling() {
      var owner = this._getOwner();

      return owner && owner._children[this._index - 1] || null;
    },
    getIndex: function getIndex() {
      return this._index;
    },
    equals: function equals(item) {
      return item === this || item && this._class === item._class && this._style.equals(item._style) && this._matrix.equals(item._matrix) && this._locked === item._locked && this._visible === item._visible && this._blendMode === item._blendMode && this._opacity === item._opacity && this._clipMask === item._clipMask && this._guide === item._guide && this._equals(item) || false;
    },
    _equals: function _equals(item) {
      return Base.equals(this._children, item._children);
    },
    clone: function clone(options) {
      var copy = new this.constructor(Item.NO_INSERT),
          children = this._children,
          insert = Base.pick(options ? options.insert : undefined, options === undefined || options === true),
          deep = Base.pick(options ? options.deep : undefined, true);
      if (children) copy.copyAttributes(this);
      if (!children || deep) copy.copyContent(this);
      if (!children) copy.copyAttributes(this);
      if (insert) copy.insertAbove(this);
      var name = this._name,
          parent = this._parent;

      if (name && parent) {
        var children = parent._children,
            orig = name,
            i = 1;

        while (children[name]) {
          name = orig + ' ' + i++;
        }

        if (name !== orig) copy.setName(name);
      }

      return copy;
    },
    copyContent: function copyContent(source) {
      var children = source._children;

      for (var i = 0, l = children && children.length; i < l; i++) {
        this.addChild(children[i].clone(false), true);
      }
    },
    copyAttributes: function copyAttributes(source, excludeMatrix) {
      this.setStyle(source._style);
      var keys = ['_locked', '_visible', '_blendMode', '_opacity', '_clipMask', '_guide'];

      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        if (source.hasOwnProperty(key)) this[key] = source[key];
      }

      if (!excludeMatrix) this._matrix.set(source._matrix, true);
      this.setApplyMatrix(source._applyMatrix);
      this.setPivot(source._pivot);
      this.setSelection(source._selection);
      var data = source._data,
          name = source._name;
      this._data = data ? Base.clone(data) : null;
      if (name) this.setName(name);
    },
    rasterize: function rasterize(resolution, insert) {
      var bounds = this.getStrokeBounds(),
          scale = (resolution || this.getView().getResolution()) / 72,
          topLeft = bounds.getTopLeft().floor(),
          bottomRight = bounds.getBottomRight().ceil(),
          size = new Size(bottomRight.subtract(topLeft)),
          raster = new Raster(Item.NO_INSERT);

      if (!size.isZero()) {
        var canvas = CanvasProvider.getCanvas(size.multiply(scale)),
            ctx = canvas.getContext('2d'),
            matrix = new Matrix().scale(scale).translate(topLeft.negate());
        ctx.save();
        matrix.applyToContext(ctx);
        this.draw(ctx, new Base({
          matrices: [matrix]
        }));
        ctx.restore();
        raster.setCanvas(canvas);
      }

      raster.transform(new Matrix().translate(topLeft.add(size.divide(2))).scale(1 / scale));
      if (insert === undefined || insert) raster.insertAbove(this);
      return raster;
    },
    contains: function contains() {
      var matrix = this._matrix;
      return matrix.isInvertible() && !!this._contains(matrix._inverseTransform(Point.read(arguments)));
    },
    _contains: function _contains(point) {
      var children = this._children;

      if (children) {
        for (var i = children.length - 1; i >= 0; i--) {
          if (children[i].contains(point)) return true;
        }

        return false;
      }

      return point.isInside(this.getInternalBounds());
    },
    isInside: function isInside() {
      return _Rectangle.read(arguments).contains(this.getBounds());
    },
    _asPathItem: function _asPathItem() {
      return new Path.Rectangle({
        rectangle: this.getInternalBounds(),
        matrix: this._matrix,
        insert: false
      });
    },
    intersects: function intersects(item, _matrix) {
      if (!(item instanceof Item)) return false;
      return this._asPathItem().getIntersections(item._asPathItem(), null, _matrix, true).length > 0;
    }
  }, new function () {
    function hitTest() {
      var args = arguments;
      return this._hitTest(Point.read(args), HitResult.getOptions(args));
    }

    function hitTestAll() {
      var args = arguments,
          point = Point.read(args),
          options = HitResult.getOptions(args),
          all = [];

      this._hitTest(point, new Base({
        all: all
      }, options));

      return all;
    }

    function hitTestChildren(point, options, viewMatrix, _exclude) {
      var children = this._children;

      if (children) {
        for (var i = children.length - 1; i >= 0; i--) {
          var child = children[i];

          var res = child !== _exclude && child._hitTest(point, options, viewMatrix);

          if (res && !options.all) return res;
        }
      }

      return null;
    }

    Project.inject({
      hitTest: hitTest,
      hitTestAll: hitTestAll,
      _hitTest: hitTestChildren
    });
    return {
      hitTest: hitTest,
      hitTestAll: hitTestAll,
      _hitTestChildren: hitTestChildren
    };
  }(), {
    _hitTest: function _hitTest(point, options, parentViewMatrix) {
      if (this._locked || !this._visible || this._guide && !options.guides || this.isEmpty()) {
        return null;
      }

      var matrix = this._matrix,
          viewMatrix = parentViewMatrix ? parentViewMatrix.appended(matrix) : this.getGlobalMatrix().prepend(this.getView()._matrix),
          tolerance = Math.max(options.tolerance, 1e-12),
          tolerancePadding = options._tolerancePadding = new Size(Path._getStrokePadding(tolerance, matrix._shiftless().invert()));
      point = matrix._inverseTransform(point);

      if (!point || !this._children && !this.getBounds({
        internal: true,
        stroke: true,
        handle: true
      }).expand(tolerancePadding.multiply(2))._containsPoint(point)) {
        return null;
      }

      var checkSelf = !(options.guides && !this._guide || options.selected && !this.isSelected() || options.type && options.type !== Base.hyphenate(this._class) || options.class && !(this instanceof options.class)),
          match = options.match,
          that = this,
          bounds,
          res;

      function filter(hit) {
        if (hit && match && !match(hit)) hit = null;
        if (hit && options.all) options.all.push(hit);
        return hit;
      }

      function checkPoint(type, part) {
        var pt = part ? bounds['get' + part]() : that.getPosition();

        if (point.subtract(pt).divide(tolerancePadding).length <= 1) {
          return new HitResult(type, that, {
            name: part ? Base.hyphenate(part) : type,
            point: pt
          });
        }
      }

      var checkPosition = options.position,
          checkCenter = options.center,
          checkBounds = options.bounds;

      if (checkSelf && this._parent && (checkPosition || checkCenter || checkBounds)) {
        if (checkCenter || checkBounds) {
          bounds = this.getInternalBounds();
        }

        res = checkPosition && checkPoint('position') || checkCenter && checkPoint('center', 'Center');

        if (!res && checkBounds) {
          var points = ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight', 'LeftCenter', 'TopCenter', 'RightCenter', 'BottomCenter'];

          for (var i = 0; i < 8 && !res; i++) {
            res = checkPoint('bounds', points[i]);
          }
        }

        res = filter(res);
      }

      if (!res) {
        res = this._hitTestChildren(point, options, viewMatrix) || checkSelf && filter(this._hitTestSelf(point, options, viewMatrix, this.getStrokeScaling() ? null : viewMatrix._shiftless().invert())) || null;
      }

      if (res && res.point) {
        res.point = matrix.transform(res.point);
      }

      return res;
    },
    _hitTestSelf: function _hitTestSelf(point, options) {
      if (options.fill && this.hasFill() && this._contains(point)) return new HitResult('fill', this);
    },
    matches: function matches(name, compare) {
      function matchObject(obj1, obj2) {
        for (var i in obj1) {
          if (obj1.hasOwnProperty(i)) {
            var val1 = obj1[i],
                val2 = obj2[i];

            if (Base.isPlainObject(val1) && Base.isPlainObject(val2)) {
              if (!matchObject(val1, val2)) return false;
            } else if (!Base.equals(val1, val2)) {
              return false;
            }
          }
        }

        return true;
      }

      var type = _typeof(name);

      if (type === 'object') {
        for (var key in name) {
          if (name.hasOwnProperty(key) && !this.matches(key, name[key])) return false;
        }

        return true;
      } else if (type === 'function') {
        return name(this);
      } else if (name === 'match') {
        return compare(this);
      } else {
        var value = /^(empty|editable)$/.test(name) ? this['is' + Base.capitalize(name)]() : name === 'type' ? Base.hyphenate(this._class) : this[name];

        if (name === 'class') {
          if (typeof compare === 'function') return this instanceof compare;
          value = this._class;
        }

        if (typeof compare === 'function') {
          return !!compare(value);
        } else if (compare) {
          if (compare.test) {
            return compare.test(value);
          } else if (Base.isPlainObject(compare)) {
            return matchObject(compare, value);
          }
        }

        return Base.equals(value, compare);
      }
    },
    getItems: function getItems(options) {
      return Item._getItems(this, options, this._matrix);
    },
    getItem: function getItem(options) {
      return Item._getItems(this, options, this._matrix, null, true)[0] || null;
    },
    statics: {
      _getItems: function _getItems(item, options, matrix, param, firstOnly) {
        if (!param) {
          var obj = _typeof(options) === 'object' && options,
              overlapping = obj && obj.overlapping,
              inside = obj && obj.inside,
              bounds = overlapping || inside,
              rect = bounds && _Rectangle.read([bounds]);

          param = {
            items: [],
            recursive: obj && obj.recursive !== false,
            inside: !!inside,
            overlapping: !!overlapping,
            rect: rect,
            path: overlapping && new Path.Rectangle({
              rectangle: rect,
              insert: false
            })
          };

          if (obj) {
            options = Base.filter({}, options, {
              recursive: true,
              inside: true,
              overlapping: true
            });
          }
        }

        var children = item._children,
            items = param.items,
            rect = param.rect;
        matrix = rect && (matrix || new Matrix());

        for (var i = 0, l = children && children.length; i < l; i++) {
          var child = children[i],
              childMatrix = matrix && matrix.appended(child._matrix),
              add = true;

          if (rect) {
            var bounds = child.getBounds(childMatrix);
            if (!rect.intersects(bounds)) continue;
            if (!(rect.contains(bounds) || param.overlapping && (bounds.contains(rect) || param.path.intersects(child, childMatrix)))) add = false;
          }

          if (add && child.matches(options)) {
            items.push(child);
            if (firstOnly) break;
          }

          if (param.recursive !== false) {
            _getItems(child, options, childMatrix, param, firstOnly);
          }

          if (firstOnly && items.length > 0) break;
        }

        return items;
      }
    }
  }, {
    importJSON: function importJSON(json) {
      var res = Base.importJSON(json, this);
      return res !== this ? this.addChild(res) : res;
    },
    addChild: function addChild(item) {
      return this.insertChild(undefined, item);
    },
    insertChild: function insertChild(index, item) {
      var res = item ? this.insertChildren(index, [item]) : null;
      return res && res[0];
    },
    addChildren: function addChildren(items) {
      return this.insertChildren(this._children.length, items);
    },
    insertChildren: function insertChildren(index, items) {
      var children = this._children;

      if (children && items && items.length > 0) {
        items = Base.slice(items);
        var inserted = {};

        for (var i = items.length - 1; i >= 0; i--) {
          var item = items[i],
              id = item && item._id;

          if (!item || inserted[id]) {
            items.splice(i, 1);
          } else {
            item._remove(false, true);

            inserted[id] = true;
          }
        }

        Base.splice(children, items, index, 0);
        var project = this._project,
            notifySelf = project._changes;

        for (var i = 0, l = items.length; i < l; i++) {
          var item = items[i],
              name = item._name;
          item._parent = this;

          item._setProject(project, true);

          if (name) item.setName(name);
          if (notifySelf) item._changed(5);
        }

        this._changed(11);
      } else {
        items = null;
      }

      return items;
    },
    _insertItem: '#insertChild',
    _insertAt: function _insertAt(item, offset) {
      var owner = item && item._getOwner(),
          res = item !== this && owner ? this : null;

      if (res) {
        res._remove(false, true);

        owner._insertItem(item._index + offset, res);
      }

      return res;
    },
    insertAbove: function insertAbove(item) {
      return this._insertAt(item, 1);
    },
    insertBelow: function insertBelow(item) {
      return this._insertAt(item, 0);
    },
    sendToBack: function sendToBack() {
      var owner = this._getOwner();

      return owner ? owner._insertItem(0, this) : null;
    },
    bringToFront: function bringToFront() {
      var owner = this._getOwner();

      return owner ? owner._insertItem(undefined, this) : null;
    },
    appendTop: '#addChild',
    appendBottom: function appendBottom(item) {
      return this.insertChild(0, item);
    },
    moveAbove: '#insertAbove',
    moveBelow: '#insertBelow',
    addTo: function addTo(owner) {
      return owner._insertItem(undefined, this);
    },
    copyTo: function copyTo(owner) {
      return this.clone(false).addTo(owner);
    },
    reduce: function reduce(options) {
      var children = this._children;

      if (children && children.length === 1) {
        var child = children[0].reduce(options);

        if (this._parent) {
          child.insertAbove(this);
          this.remove();
        } else {
          child.remove();
        }

        return child;
      }

      return this;
    },
    _removeNamed: function _removeNamed() {
      var owner = this._getOwner();

      if (owner) {
        var children = owner._children,
            namedChildren = owner._namedChildren,
            name = this._name,
            namedArray = namedChildren[name],
            index = namedArray ? namedArray.indexOf(this) : -1;

        if (index !== -1) {
          if (children[name] == this) delete children[name];
          namedArray.splice(index, 1);

          if (namedArray.length) {
            children[name] = namedArray[0];
          } else {
            delete namedChildren[name];
          }
        }
      }
    },
    _remove: function _remove(notifySelf, notifyParent) {
      var owner = this._getOwner(),
          project = this._project,
          index = this._index;

      if (this._style) this._style._dispose();

      if (owner) {
        if (this._name) this._removeNamed();

        if (index != null) {
          if (project._activeLayer === this) project._activeLayer = this.getNextSibling() || this.getPreviousSibling();
          Base.splice(owner._children, null, index, 1);
        }

        this._installEvents(false);

        if (notifySelf && project._changes) this._changed(5);
        if (notifyParent) owner._changed(11, this);
        this._parent = null;
        return true;
      }

      return false;
    },
    remove: function remove() {
      return this._remove(true, true);
    },
    replaceWith: function replaceWith(item) {
      var ok = item && item.insertBelow(this);
      if (ok) this.remove();
      return ok;
    },
    removeChildren: function removeChildren(start, end) {
      if (!this._children) return null;
      start = start || 0;
      end = Base.pick(end, this._children.length);
      var removed = Base.splice(this._children, null, start, end - start);

      for (var i = removed.length - 1; i >= 0; i--) {
        removed[i]._remove(true, false);
      }

      if (removed.length > 0) this._changed(11);
      return removed;
    },
    clear: '#removeChildren',
    reverseChildren: function reverseChildren() {
      if (this._children) {
        this._children.reverse();

        for (var i = 0, l = this._children.length; i < l; i++) {
          this._children[i]._index = i;
        }

        this._changed(11);
      }
    },
    isEmpty: function isEmpty(recursively) {
      var children = this._children;
      var numChildren = children ? children.length : 0;

      if (recursively) {
        for (var i = 0; i < numChildren; i++) {
          if (!children[i].isEmpty(recursively)) {
            return false;
          }
        }

        return true;
      }

      return !numChildren;
    },
    isEditable: function isEditable() {
      var item = this;

      while (item) {
        if (!item._visible || item._locked) return false;
        item = item._parent;
      }

      return true;
    },
    hasFill: function hasFill() {
      return this.getStyle().hasFill();
    },
    hasStroke: function hasStroke() {
      return this.getStyle().hasStroke();
    },
    hasShadow: function hasShadow() {
      return this.getStyle().hasShadow();
    },
    _getOrder: function _getOrder(item) {
      function getList(item) {
        var list = [];

        do {
          list.unshift(item);
        } while (item = item._parent);

        return list;
      }

      var list1 = getList(this),
          list2 = getList(item);

      for (var i = 0, l = Math.min(list1.length, list2.length); i < l; i++) {
        if (list1[i] != list2[i]) {
          return list1[i]._index < list2[i]._index ? 1 : -1;
        }
      }

      return 0;
    },
    hasChildren: function hasChildren() {
      return this._children && this._children.length > 0;
    },
    isInserted: function isInserted() {
      return this._parent ? this._parent.isInserted() : false;
    },
    isAbove: function isAbove(item) {
      return this._getOrder(item) === -1;
    },
    isBelow: function isBelow(item) {
      return this._getOrder(item) === 1;
    },
    isParent: function isParent(item) {
      return this._parent === item;
    },
    isChild: function isChild(item) {
      return item && item._parent === this;
    },
    isDescendant: function isDescendant(item) {
      var parent = this;

      while (parent = parent._parent) {
        if (parent === item) return true;
      }

      return false;
    },
    isAncestor: function isAncestor(item) {
      return item ? item.isDescendant(this) : false;
    },
    isSibling: function isSibling(item) {
      return this._parent === item._parent;
    },
    isGroupedWith: function isGroupedWith(item) {
      var parent = this._parent;

      while (parent) {
        if (parent._parent && /^(Group|Layer|CompoundPath)$/.test(parent._class) && item.isDescendant(parent)) return true;
        parent = parent._parent;
      }

      return false;
    }
  }, Base.each(['rotate', 'scale', 'shear', 'skew'], function (key) {
    var rotate = key === 'rotate';

    this[key] = function () {
      var args = arguments,
          value = (rotate ? Base : Point).read(args),
          center = Point.read(args, 0, {
        readNull: true
      });
      return this.transform(new Matrix()[key](value, center || this.getPosition(true)));
    };
  }, {
    translate: function translate() {
      var mx = new Matrix();
      return this.transform(mx.translate.apply(mx, arguments));
    },
    transform: function transform(matrix, _applyRecursively, _setApplyMatrix) {
      var _matrix = this._matrix,
          transformMatrix = matrix && !matrix.isIdentity(),
          applyMatrix = _setApplyMatrix && this._canApplyMatrix || this._applyMatrix && (transformMatrix || !_matrix.isIdentity() || _applyRecursively && this._children);
      if (!transformMatrix && !applyMatrix) return this;

      if (transformMatrix) {
        if (!matrix.isInvertible() && _matrix.isInvertible()) _matrix._backup = _matrix.getValues();

        _matrix.prepend(matrix, true);

        var style = this._style,
            fillColor = style.getFillColor(true),
            strokeColor = style.getStrokeColor(true);
        if (fillColor) fillColor.transform(matrix);
        if (strokeColor) strokeColor.transform(matrix);
      }

      if (applyMatrix && (applyMatrix = this._transformContent(_matrix, _applyRecursively, _setApplyMatrix))) {
        var pivot = this._pivot;
        if (pivot) _matrix._transformPoint(pivot, pivot, true);

        _matrix.reset(true);

        if (_setApplyMatrix && this._canApplyMatrix) this._applyMatrix = true;
      }

      var bounds = this._bounds,
          position = this._position;

      if (transformMatrix || applyMatrix) {
        this._changed(25);
      }

      var decomp = transformMatrix && bounds && matrix.decompose();

      if (decomp && decomp.skewing.isZero() && decomp.rotation % 90 === 0) {
        for (var key in bounds) {
          var cache = bounds[key];

          if (cache.nonscaling) {
            delete bounds[key];
          } else if (applyMatrix || !cache.internal) {
            var rect = cache.rect;

            matrix._transformBounds(rect, rect);
          }
        }

        this._bounds = bounds;

        var cached = bounds[this._getBoundsCacheKey(this._boundsOptions || {})];

        if (cached) {
          this._position = this._getPositionFromBounds(cached.rect);
        }
      } else if (transformMatrix && position && this._pivot) {
        this._position = matrix._transformPoint(position, position);
      }

      return this;
    },
    _transformContent: function _transformContent(matrix, applyRecursively, setApplyMatrix) {
      var children = this._children;

      if (children) {
        for (var i = 0, l = children.length; i < l; i++) {
          children[i].transform(matrix, applyRecursively, setApplyMatrix);
        }

        return true;
      }
    },
    globalToLocal: function globalToLocal() {
      return this.getGlobalMatrix(true)._inverseTransform(Point.read(arguments));
    },
    localToGlobal: function localToGlobal() {
      return this.getGlobalMatrix(true)._transformPoint(Point.read(arguments));
    },
    parentToLocal: function parentToLocal() {
      return this._matrix._inverseTransform(Point.read(arguments));
    },
    localToParent: function localToParent() {
      return this._matrix._transformPoint(Point.read(arguments));
    },
    fitBounds: function fitBounds(rectangle, fill) {
      rectangle = _Rectangle.read(arguments);
      var bounds = this.getBounds(),
          itemRatio = bounds.height / bounds.width,
          rectRatio = rectangle.height / rectangle.width,
          scale = (fill ? itemRatio > rectRatio : itemRatio < rectRatio) ? rectangle.width / bounds.width : rectangle.height / bounds.height,
          newBounds = new _Rectangle(new Point(), new Size(bounds.width * scale, bounds.height * scale));
      newBounds.setCenter(rectangle.getCenter());
      this.setBounds(newBounds);
    }
  }), {
    _setStyles: function _setStyles(ctx, param, viewMatrix) {
      var style = this._style,
          matrix = this._matrix;

      if (style.hasFill()) {
        ctx.fillStyle = style.getFillColor().toCanvasStyle(ctx, matrix);
      }

      if (style.hasStroke()) {
        ctx.strokeStyle = style.getStrokeColor().toCanvasStyle(ctx, matrix);
        ctx.lineWidth = style.getStrokeWidth();
        var strokeJoin = style.getStrokeJoin(),
            strokeCap = style.getStrokeCap(),
            miterLimit = style.getMiterLimit();
        if (strokeJoin) ctx.lineJoin = strokeJoin;
        if (strokeCap) ctx.lineCap = strokeCap;
        if (miterLimit) ctx.miterLimit = miterLimit;

        if (paper.support.nativeDash) {
          var dashArray = style.getDashArray(),
              dashOffset = style.getDashOffset();

          if (dashArray && dashArray.length) {
            if ('setLineDash' in ctx) {
              ctx.setLineDash(dashArray);
              ctx.lineDashOffset = dashOffset;
            } else {
              ctx.mozDash = dashArray;
              ctx.mozDashOffset = dashOffset;
            }
          }
        }
      }

      if (style.hasShadow()) {
        var pixelRatio = param.pixelRatio || 1,
            mx = viewMatrix._shiftless().prepend(new Matrix().scale(pixelRatio, pixelRatio)),
            blur = mx.transform(new Point(style.getShadowBlur(), 0)),
            offset = mx.transform(this.getShadowOffset());

        ctx.shadowColor = style.getShadowColor().toCanvasStyle(ctx);
        ctx.shadowBlur = blur.getLength();
        ctx.shadowOffsetX = offset.x;
        ctx.shadowOffsetY = offset.y;
      }
    },
    draw: function draw(ctx, param, parentStrokeMatrix) {
      var updateVersion = this._updateVersion = this._project._updateVersion;
      if (!this._visible || this._opacity === 0) return;
      var matrices = param.matrices,
          viewMatrix = param.viewMatrix,
          matrix = this._matrix,
          globalMatrix = matrices[matrices.length - 1].appended(matrix);
      if (!globalMatrix.isInvertible()) return;
      viewMatrix = viewMatrix ? viewMatrix.appended(globalMatrix) : globalMatrix;
      matrices.push(globalMatrix);

      if (param.updateMatrix) {
        this._globalMatrix = globalMatrix;
      }

      var blendMode = this._blendMode,
          opacity = Numerical.clamp(this._opacity, 0, 1),
          normalBlend = blendMode === 'normal',
          nativeBlend = BlendMode.nativeModes[blendMode],
          direct = normalBlend && opacity === 1 || param.dontStart || param.clip || (nativeBlend || normalBlend && opacity < 1) && this._canComposite(),
          pixelRatio = param.pixelRatio || 1,
          mainCtx,
          itemOffset,
          prevOffset;

      if (!direct) {
        var bounds = this.getStrokeBounds(viewMatrix);

        if (!bounds.width || !bounds.height) {
          matrices.pop();
          return;
        }

        prevOffset = param.offset;
        itemOffset = param.offset = bounds.getTopLeft().floor();
        mainCtx = ctx;
        ctx = CanvasProvider.getContext(bounds.getSize().ceil().add(1).multiply(pixelRatio));
        if (pixelRatio !== 1) ctx.scale(pixelRatio, pixelRatio);
      }

      ctx.save();
      var strokeMatrix = parentStrokeMatrix ? parentStrokeMatrix.appended(matrix) : this._canScaleStroke && !this.getStrokeScaling(true) && viewMatrix,
          clip = !direct && param.clipItem,
          transform = !strokeMatrix || clip;

      if (direct) {
        ctx.globalAlpha = opacity;
        if (nativeBlend) ctx.globalCompositeOperation = blendMode;
      } else if (transform) {
        ctx.translate(-itemOffset.x, -itemOffset.y);
      }

      if (transform) {
        (direct ? matrix : viewMatrix).applyToContext(ctx);
      }

      if (clip) {
        param.clipItem.draw(ctx, param.extend({
          clip: true
        }));
      }

      if (strokeMatrix) {
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        var offset = param.offset;
        if (offset) ctx.translate(-offset.x, -offset.y);
      }

      this._draw(ctx, param, viewMatrix, strokeMatrix);

      ctx.restore();
      matrices.pop();

      if (param.clip && !param.dontFinish) {
        ctx.clip(this.getFillRule());
      }

      if (!direct) {
        BlendMode.process(blendMode, ctx, mainCtx, opacity, itemOffset.subtract(prevOffset).multiply(pixelRatio));
        CanvasProvider.release(ctx);
        param.offset = prevOffset;
      }
    },
    _isUpdated: function _isUpdated(updateVersion) {
      var parent = this._parent;
      if (parent instanceof CompoundPath) return parent._isUpdated(updateVersion);
      var updated = this._updateVersion === updateVersion;

      if (!updated && parent && parent._visible && parent._isUpdated(updateVersion)) {
        this._updateVersion = updateVersion;
        updated = true;
      }

      return updated;
    },
    _drawSelection: function _drawSelection(ctx, matrix, size, selectionItems, updateVersion) {
      var selection = this._selection,
          itemSelected = selection & 1,
          boundsSelected = selection & 2 || itemSelected && this._selectBounds,
          positionSelected = selection & 4;
      if (!this._drawSelected) itemSelected = false;

      if ((itemSelected || boundsSelected || positionSelected) && this._isUpdated(updateVersion)) {
        var layer,
            color = this.getSelectedColor(true) || (layer = this.getLayer()) && layer.getSelectedColor(true),
            mx = matrix.appended(this.getGlobalMatrix(true)),
            half = size / 2;
        ctx.strokeStyle = ctx.fillStyle = color ? color.toCanvasStyle(ctx) : '#009dec';
        if (itemSelected) this._drawSelected(ctx, mx, selectionItems);

        if (positionSelected) {
          var pos = this.getPosition(true),
              parent = this._parent,
              point = parent ? parent.localToGlobal(pos) : pos,
              x = point.x,
              y = point.y;
          ctx.beginPath();
          ctx.arc(x, y, half, 0, Math.PI * 2, true);
          ctx.stroke();
          var deltas = [[0, -1], [1, 0], [0, 1], [-1, 0]],
              start = half,
              end = size + 1;

          for (var i = 0; i < 4; i++) {
            var delta = deltas[i],
                dx = delta[0],
                dy = delta[1];
            ctx.moveTo(x + dx * start, y + dy * start);
            ctx.lineTo(x + dx * end, y + dy * end);
            ctx.stroke();
          }
        }

        if (boundsSelected) {
          var coords = mx._transformCorners(this.getInternalBounds());

          ctx.beginPath();

          for (var i = 0; i < 8; i++) {
            ctx[!i ? 'moveTo' : 'lineTo'](coords[i], coords[++i]);
          }

          ctx.closePath();
          ctx.stroke();

          for (var i = 0; i < 8; i++) {
            ctx.fillRect(coords[i] - half, coords[++i] - half, size, size);
          }
        }
      }
    },
    _canComposite: function _canComposite() {
      return false;
    }
  }, Base.each(['down', 'drag', 'up', 'move'], function (key) {
    this['removeOn' + Base.capitalize(key)] = function () {
      var hash = {};
      hash[key] = true;
      return this.removeOn(hash);
    };
  }, {
    removeOn: function removeOn(obj) {
      for (var name in obj) {
        if (obj[name]) {
          var key = 'mouse' + name,
              project = this._project,
              sets = project._removeSets = project._removeSets || {};
          sets[key] = sets[key] || {};
          sets[key][this._id] = this;
        }
      }

      return this;
    }
  }), {
    tween: function tween(from, to, options) {
      if (!options) {
        options = to;
        to = from;
        from = null;

        if (!options) {
          options = to;
          to = null;
        }
      }

      var easing = options && options.easing,
          start = options && options.start,
          duration = options != null && (typeof options === 'number' ? options : options.duration),
          tween = new Tween(this, from, to, duration, easing, start);

      function onFrame(event) {
        tween._handleFrame(event.time * 1000);

        if (!tween.running) {
          this.off('frame', onFrame);
        }
      }

      if (duration) {
        this.on('frame', onFrame);
      }

      return tween;
    },
    tweenTo: function tweenTo(to, options) {
      return this.tween(null, to, options);
    },
    tweenFrom: function tweenFrom(from, options) {
      return this.tween(from, null, options);
    }
  });
  var Group = Item.extend({
    _class: 'Group',
    _selectBounds: false,
    _selectChildren: true,
    _serializeFields: {
      children: []
    },
    initialize: function Group(arg) {
      this._children = [];
      this._namedChildren = {};
      if (!this._initialize(arg)) this.addChildren(Array.isArray(arg) ? arg : arguments);
    },
    _changed: function _changed(flags) {
      _changed.base.call(this, flags);

      if (flags & 2050) {
        this._clipItem = undefined;
      }
    },
    _getClipItem: function _getClipItem() {
      var clipItem = this._clipItem;

      if (clipItem === undefined) {
        clipItem = null;
        var children = this._children;

        for (var i = 0, l = children.length; i < l; i++) {
          if (children[i]._clipMask) {
            clipItem = children[i];
            break;
          }
        }

        this._clipItem = clipItem;
      }

      return clipItem;
    },
    isClipped: function isClipped() {
      return !!this._getClipItem();
    },
    setClipped: function setClipped(clipped) {
      var child = this.getFirstChild();
      if (child) child.setClipMask(clipped);
    },
    _getBounds: function _getBounds(matrix, options) {
      var clipItem = this._getClipItem();

      return clipItem ? clipItem._getCachedBounds(clipItem._matrix.prepended(matrix), Base.set({}, options, {
        stroke: false
      })) : _getBounds.base.call(this, matrix, options);
    },
    _hitTestChildren: function _hitTestChildren(point, options, viewMatrix) {
      var clipItem = this._getClipItem();

      return (!clipItem || clipItem.contains(point)) && _hitTestChildren.base.call(this, point, options, viewMatrix, clipItem);
    },
    _draw: function _draw(ctx, param) {
      var clip = param.clip,
          clipItem = !clip && this._getClipItem();

      param = param.extend({
        clipItem: clipItem,
        clip: false
      });

      if (clip) {
        ctx.beginPath();
        param.dontStart = param.dontFinish = true;
      } else if (clipItem) {
        clipItem.draw(ctx, param.extend({
          clip: true
        }));
      }

      var children = this._children;

      for (var i = 0, l = children.length; i < l; i++) {
        var item = children[i];
        if (item !== clipItem) item.draw(ctx, param);
      }
    }
  });
  var Layer = Group.extend({
    _class: 'Layer',
    initialize: function Layer() {
      Group.apply(this, arguments);
    },
    _getOwner: function _getOwner() {
      return this._parent || this._index != null && this._project;
    },
    isInserted: function isInserted() {
      return this._parent ? isInserted.base.call(this) : this._index != null;
    },
    activate: function activate() {
      this._project._activeLayer = this;
    },
    _hitTestSelf: function _hitTestSelf() {}
  });
  var Shape = Item.extend({
    _class: 'Shape',
    _applyMatrix: false,
    _canApplyMatrix: false,
    _canScaleStroke: true,
    _serializeFields: {
      type: null,
      size: null,
      radius: null
    },
    initialize: function Shape(props, point) {
      this._initialize(props, point);
    },
    _equals: function _equals(item) {
      return this._type === item._type && this._size.equals(item._size) && Base.equals(this._radius, item._radius);
    },
    copyContent: function copyContent(source) {
      this.setType(source._type);
      this.setSize(source._size);
      this.setRadius(source._radius);
    },
    getType: function getType() {
      return this._type;
    },
    setType: function setType(type) {
      this._type = type;
    },
    getShape: '#getType',
    setShape: '#setType',
    getSize: function getSize() {
      var size = this._size;
      return new LinkedSize(size.width, size.height, this, 'setSize');
    },
    setSize: function setSize() {
      var size = Size.read(arguments);

      if (!this._size) {
        this._size = size.clone();
      } else if (!this._size.equals(size)) {
        var type = this._type,
            width = size.width,
            height = size.height;

        if (type === 'rectangle') {
          this._radius.set(Size.min(this._radius, size.divide(2).abs()));
        } else if (type === 'circle') {
          width = height = (width + height) / 2;
          this._radius = width / 2;
        } else if (type === 'ellipse') {
          this._radius._set(width / 2, height / 2);
        }

        this._size._set(width, height);

        this._changed(9);
      }
    },
    getRadius: function getRadius() {
      var rad = this._radius;
      return this._type === 'circle' ? rad : new LinkedSize(rad.width, rad.height, this, 'setRadius');
    },
    setRadius: function setRadius(radius) {
      var type = this._type;

      if (type === 'circle') {
        if (radius === this._radius) return;
        var size = radius * 2;
        this._radius = radius;

        this._size._set(size, size);
      } else {
        radius = Size.read(arguments);

        if (!this._radius) {
          this._radius = radius.clone();
        } else {
          if (this._radius.equals(radius)) return;

          this._radius.set(radius);

          if (type === 'rectangle') {
            var size = Size.max(this._size, radius.multiply(2));

            this._size.set(size);
          } else if (type === 'ellipse') {
            this._size._set(radius.width * 2, radius.height * 2);
          }
        }
      }

      this._changed(9);
    },
    isEmpty: function isEmpty() {
      return false;
    },
    toPath: function toPath(insert) {
      var path = new Path[Base.capitalize(this._type)]({
        center: new Point(),
        size: this._size,
        radius: this._radius,
        insert: false
      });
      path.copyAttributes(this);
      if (paper.settings.applyMatrix) path.setApplyMatrix(true);
      if (insert === undefined || insert) path.insertAbove(this);
      return path;
    },
    toShape: '#clone',
    _asPathItem: function _asPathItem() {
      return this.toPath(false);
    },
    _draw: function _draw(ctx, param, viewMatrix, strokeMatrix) {
      var style = this._style,
          hasFill = style.hasFill(),
          hasStroke = style.hasStroke(),
          dontPaint = param.dontFinish || param.clip,
          untransformed = !strokeMatrix;

      if (hasFill || hasStroke || dontPaint) {
        var type = this._type,
            radius = this._radius,
            isCircle = type === 'circle';
        if (!param.dontStart) ctx.beginPath();

        if (untransformed && isCircle) {
          ctx.arc(0, 0, radius, 0, Math.PI * 2, true);
        } else {
          var rx = isCircle ? radius : radius.width,
              ry = isCircle ? radius : radius.height,
              size = this._size,
              width = size.width,
              height = size.height;

          if (untransformed && type === 'rectangle' && rx === 0 && ry === 0) {
            ctx.rect(-width / 2, -height / 2, width, height);
          } else {
            var x = width / 2,
                y = height / 2,
                kappa = 1 - 0.5522847498307936,
                cx = rx * kappa,
                cy = ry * kappa,
                c = [-x, -y + ry, -x, -y + cy, -x + cx, -y, -x + rx, -y, x - rx, -y, x - cx, -y, x, -y + cy, x, -y + ry, x, y - ry, x, y - cy, x - cx, y, x - rx, y, -x + rx, y, -x + cx, y, -x, y - cy, -x, y - ry];
            if (strokeMatrix) strokeMatrix.transform(c, c, 32);
            ctx.moveTo(c[0], c[1]);
            ctx.bezierCurveTo(c[2], c[3], c[4], c[5], c[6], c[7]);
            if (x !== rx) ctx.lineTo(c[8], c[9]);
            ctx.bezierCurveTo(c[10], c[11], c[12], c[13], c[14], c[15]);
            if (y !== ry) ctx.lineTo(c[16], c[17]);
            ctx.bezierCurveTo(c[18], c[19], c[20], c[21], c[22], c[23]);
            if (x !== rx) ctx.lineTo(c[24], c[25]);
            ctx.bezierCurveTo(c[26], c[27], c[28], c[29], c[30], c[31]);
          }
        }

        ctx.closePath();
      }

      if (!dontPaint && (hasFill || hasStroke)) {
        this._setStyles(ctx, param, viewMatrix);

        if (hasFill) {
          ctx.fill(style.getFillRule());
          ctx.shadowColor = 'rgba(0,0,0,0)';
        }

        if (hasStroke) ctx.stroke();
      }
    },
    _canComposite: function _canComposite() {
      return !(this.hasFill() && this.hasStroke());
    },
    _getBounds: function _getBounds(matrix, options) {
      var rect = new _Rectangle(this._size).setCenter(0, 0),
          style = this._style,
          strokeWidth = options.stroke && style.hasStroke() && style.getStrokeWidth();
      if (matrix) rect = matrix._transformBounds(rect);
      return strokeWidth ? rect.expand(Path._getStrokePadding(strokeWidth, this._getStrokeMatrix(matrix, options))) : rect;
    }
  }, new function () {
    function getCornerCenter(that, point, expand) {
      var radius = that._radius;

      if (!radius.isZero()) {
        var halfSize = that._size.divide(2);

        for (var q = 1; q <= 4; q++) {
          var dir = new Point(q > 1 && q < 4 ? -1 : 1, q > 2 ? -1 : 1),
              corner = dir.multiply(halfSize),
              center = corner.subtract(dir.multiply(radius)),
              rect = new _Rectangle(expand ? corner.add(dir.multiply(expand)) : corner, center);
          if (rect.contains(point)) return {
            point: center,
            quadrant: q
          };
        }
      }
    }

    function isOnEllipseStroke(point, radius, padding, quadrant) {
      var vector = point.divide(radius);
      return (!quadrant || vector.isInQuadrant(quadrant)) && vector.subtract(vector.normalize()).multiply(radius).divide(padding).length <= 1;
    }

    return {
      _contains: function _contains(point) {
        if (this._type === 'rectangle') {
          var center = getCornerCenter(this, point);
          return center ? point.subtract(center.point).divide(this._radius).getLength() <= 1 : _contains.base.call(this, point);
        } else {
          return point.divide(this.size).getLength() <= 0.5;
        }
      },
      _hitTestSelf: function _hitTestSelf(point, options, viewMatrix, strokeMatrix) {
        var hit = false,
            style = this._style,
            hitStroke = options.stroke && style.hasStroke(),
            hitFill = options.fill && style.hasFill();

        if (hitStroke || hitFill) {
          var type = this._type,
              radius = this._radius,
              strokeRadius = hitStroke ? style.getStrokeWidth() / 2 : 0,
              strokePadding = options._tolerancePadding.add(Path._getStrokePadding(strokeRadius, !style.getStrokeScaling() && strokeMatrix));

          if (type === 'rectangle') {
            var padding = strokePadding.multiply(2),
                center = getCornerCenter(this, point, padding);

            if (center) {
              hit = isOnEllipseStroke(point.subtract(center.point), radius, strokePadding, center.quadrant);
            } else {
              var rect = new _Rectangle(this._size).setCenter(0, 0),
                  outer = rect.expand(padding),
                  inner = rect.expand(padding.negate());
              hit = outer._containsPoint(point) && !inner._containsPoint(point);
            }
          } else {
            hit = isOnEllipseStroke(point, radius, strokePadding);
          }
        }

        return hit ? new HitResult(hitStroke ? 'stroke' : 'fill', this) : _hitTestSelf.base.apply(this, arguments);
      }
    };
  }(), {
    statics: new function () {
      function createShape(type, point, size, radius, args) {
        var item = Base.create(Shape.prototype);
        item._type = type;
        item._size = size;
        item._radius = radius;

        item._initialize(Base.getNamed(args), point);

        return item;
      }

      return {
        Circle: function Circle() {
          var args = arguments,
              center = Point.readNamed(args, 'center'),
              radius = Base.readNamed(args, 'radius');
          return createShape('circle', center, new Size(radius * 2), radius, args);
        },
        Rectangle: function Rectangle() {
          var args = arguments,
              rect = _Rectangle.readNamed(args, 'rectangle'),
              radius = Size.min(Size.readNamed(args, 'radius'), rect.getSize(true).divide(2));

          return createShape('rectangle', rect.getCenter(true), rect.getSize(true), radius, args);
        },
        Ellipse: function Ellipse() {
          var args = arguments,
              ellipse = Shape._readEllipse(args),
              radius = ellipse.radius;

          return createShape('ellipse', ellipse.center, radius.multiply(2), radius, args);
        },
        _readEllipse: function _readEllipse(args) {
          var center, radius;

          if (Base.hasNamed(args, 'radius')) {
            center = Point.readNamed(args, 'center');
            radius = Size.readNamed(args, 'radius');
          } else {
            var rect = _Rectangle.readNamed(args, 'rectangle');

            center = rect.getCenter(true);
            radius = rect.getSize(true).divide(2);
          }

          return {
            center: center,
            radius: radius
          };
        }
      };
    }()
  });
  var Raster = Item.extend({
    _class: 'Raster',
    _applyMatrix: false,
    _canApplyMatrix: false,
    _boundsOptions: {
      stroke: false,
      handle: false
    },
    _serializeFields: {
      crossOrigin: null,
      source: null
    },
    _prioritize: ['crossOrigin'],
    _smoothing: true,
    beans: true,
    initialize: function Raster(source, position) {
      if (!this._initialize(source, position !== undefined && Point.read(arguments))) {
        var image,
            type = _typeof(source),
            object = type === 'string' ? document.getElementById(source) : type === 'object' ? source : null;

        if (object && object !== Item.NO_INSERT) {
          if (object.getContext || object.naturalHeight != null) {
            image = object;
          } else if (object) {
            var size = Size.read(arguments);

            if (!size.isZero()) {
              image = CanvasProvider.getCanvas(size);
            }
          }
        }

        if (image) {
          this.setImage(image);
        } else {
          this.setSource(source);
        }
      }

      if (!this._size) {
        this._size = new Size();
        this._loaded = false;
      }
    },
    _equals: function _equals(item) {
      return this.getSource() === item.getSource();
    },
    copyContent: function copyContent(source) {
      var image = source._image,
          canvas = source._canvas;

      if (image) {
        this._setImage(image);
      } else if (canvas) {
        var copyCanvas = CanvasProvider.getCanvas(source._size);
        copyCanvas.getContext('2d').drawImage(canvas, 0, 0);

        this._setImage(copyCanvas);
      }

      this._crossOrigin = source._crossOrigin;
    },
    getSize: function getSize() {
      var size = this._size;
      return new LinkedSize(size ? size.width : 0, size ? size.height : 0, this, 'setSize');
    },
    setSize: function setSize() {
      var size = Size.read(arguments);

      if (!size.equals(this._size)) {
        if (size.width > 0 && size.height > 0) {
          var element = this.getElement();

          this._setImage(CanvasProvider.getCanvas(size));

          if (element) this.getContext(true).drawImage(element, 0, 0, size.width, size.height);
        } else {
          if (this._canvas) CanvasProvider.release(this._canvas);
          this._size = size.clone();
        }
      }
    },
    getWidth: function getWidth() {
      return this._size ? this._size.width : 0;
    },
    setWidth: function setWidth(width) {
      this.setSize(width, this.getHeight());
    },
    getHeight: function getHeight() {
      return this._size ? this._size.height : 0;
    },
    setHeight: function setHeight(height) {
      this.setSize(this.getWidth(), height);
    },
    getLoaded: function getLoaded() {
      return this._loaded;
    },
    isEmpty: function isEmpty() {
      var size = this._size;
      return !size || size.width === 0 && size.height === 0;
    },
    getResolution: function getResolution() {
      var matrix = this._matrix,
          orig = new Point(0, 0).transform(matrix),
          u = new Point(1, 0).transform(matrix).subtract(orig),
          v = new Point(0, 1).transform(matrix).subtract(orig);
      return new Size(72 / u.getLength(), 72 / v.getLength());
    },
    getPpi: '#getResolution',
    getImage: function getImage() {
      return this._image;
    },
    setImage: function setImage(image) {
      var that = this;

      function emit(event) {
        var view = that.getView(),
            type = event && event.type || 'load';

        if (view && that.responds(type)) {
          paper = view._scope;
          that.emit(type, new Event(event));
        }
      }

      this._setImage(image);

      if (this._loaded) {
        setTimeout(emit, 0);
      } else if (image) {
        DomEvent.add(image, {
          load: function load(event) {
            that._setImage(image);

            emit(event);
          },
          error: emit
        });
      }
    },
    _setImage: function _setImage(image) {
      if (this._canvas) CanvasProvider.release(this._canvas);

      if (image && image.getContext) {
        this._image = null;
        this._canvas = image;
        this._loaded = true;
      } else {
        this._image = image;
        this._canvas = null;
        this._loaded = !!(image && image.src && image.complete);
      }

      this._size = new Size(image ? image.naturalWidth || image.width : 0, image ? image.naturalHeight || image.height : 0);
      this._context = null;

      this._changed(1033);
    },
    getCanvas: function getCanvas() {
      if (!this._canvas) {
        var ctx = CanvasProvider.getContext(this._size);

        try {
          if (this._image) ctx.drawImage(this._image, 0, 0);
          this._canvas = ctx.canvas;
        } catch (e) {
          CanvasProvider.release(ctx);
        }
      }

      return this._canvas;
    },
    setCanvas: '#setImage',
    getContext: function getContext(_change) {
      if (!this._context) this._context = this.getCanvas().getContext('2d');

      if (_change) {
        this._image = null;

        this._changed(1025);
      }

      return this._context;
    },
    setContext: function setContext(context) {
      this._context = context;
    },
    getSource: function getSource() {
      var image = this._image;
      return image && image.src || this.toDataURL();
    },
    setSource: function setSource(src) {
      var image = new self.Image(),
          crossOrigin = this._crossOrigin;
      if (crossOrigin) image.crossOrigin = crossOrigin;
      if (src) image.src = src;
      this.setImage(image);
    },
    getCrossOrigin: function getCrossOrigin() {
      var image = this._image;
      return image && image.crossOrigin || this._crossOrigin || '';
    },
    setCrossOrigin: function setCrossOrigin(crossOrigin) {
      this._crossOrigin = crossOrigin;
      var image = this._image;
      if (image) image.crossOrigin = crossOrigin;
    },
    getSmoothing: function getSmoothing() {
      return this._smoothing;
    },
    setSmoothing: function setSmoothing(smoothing) {
      this._smoothing = smoothing;

      this._changed(257);
    },
    getElement: function getElement() {
      return this._canvas || this._loaded && this._image;
    }
  }, {
    beans: false,
    getSubCanvas: function getSubCanvas() {
      var rect = _Rectangle.read(arguments),
          ctx = CanvasProvider.getContext(rect.getSize());

      ctx.drawImage(this.getCanvas(), rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
      return ctx.canvas;
    },
    getSubRaster: function getSubRaster() {
      var rect = _Rectangle.read(arguments),
          raster = new Raster(Item.NO_INSERT);

      raster._setImage(this.getSubCanvas(rect));

      raster.translate(rect.getCenter().subtract(this.getSize().divide(2)));

      raster._matrix.prepend(this._matrix);

      raster.insertAbove(this);
      return raster;
    },
    toDataURL: function toDataURL() {
      var image = this._image,
          src = image && image.src;
      if (/^data:/.test(src)) return src;
      var canvas = this.getCanvas();
      return canvas ? canvas.toDataURL.apply(canvas, arguments) : null;
    },
    drawImage: function drawImage(image) {
      var point = Point.read(arguments, 1);
      this.getContext(true).drawImage(image, point.x, point.y);
    },
    getAverageColor: function getAverageColor(object) {
      var bounds, path;

      if (!object) {
        bounds = this.getBounds();
      } else if (object instanceof PathItem) {
        path = object;
        bounds = object.getBounds();
      } else if (_typeof(object) === 'object') {
        if ('width' in object) {
          bounds = new _Rectangle(object);
        } else if ('x' in object) {
          bounds = new _Rectangle(object.x - 0.5, object.y - 0.5, 1, 1);
        }
      }

      if (!bounds) return null;
      var sampleSize = 32,
          width = Math.min(bounds.width, sampleSize),
          height = Math.min(bounds.height, sampleSize);
      var ctx = Raster._sampleContext;

      if (!ctx) {
        ctx = Raster._sampleContext = CanvasProvider.getContext(new Size(sampleSize));
      } else {
        ctx.clearRect(0, 0, sampleSize + 1, sampleSize + 1);
      }

      ctx.save();
      var matrix = new Matrix().scale(width / bounds.width, height / bounds.height).translate(-bounds.x, -bounds.y);
      matrix.applyToContext(ctx);
      if (path) path.draw(ctx, new Base({
        clip: true,
        matrices: [matrix]
      }));

      this._matrix.applyToContext(ctx);

      var element = this.getElement(),
          size = this._size;
      if (element) ctx.drawImage(element, -size.width / 2, -size.height / 2);
      ctx.restore();
      var pixels = ctx.getImageData(0.5, 0.5, Math.ceil(width), Math.ceil(height)).data,
          channels = [0, 0, 0],
          total = 0;

      for (var i = 0, l = pixels.length; i < l; i += 4) {
        var alpha = pixels[i + 3];
        total += alpha;
        alpha /= 255;
        channels[0] += pixels[i] * alpha;
        channels[1] += pixels[i + 1] * alpha;
        channels[2] += pixels[i + 2] * alpha;
      }

      for (var i = 0; i < 3; i++) {
        channels[i] /= total;
      }

      return total ? Color.read(channels) : null;
    },
    getPixel: function getPixel() {
      var point = Point.read(arguments);
      var data = this.getContext().getImageData(point.x, point.y, 1, 1).data;
      return new Color('rgb', [data[0] / 255, data[1] / 255, data[2] / 255], data[3] / 255);
    },
    setPixel: function setPixel() {
      var args = arguments,
          point = Point.read(args),
          color = Color.read(args),
          components = color._convert('rgb'),
          alpha = color._alpha,
          ctx = this.getContext(true),
          imageData = ctx.createImageData(1, 1),
          data = imageData.data;

      data[0] = components[0] * 255;
      data[1] = components[1] * 255;
      data[2] = components[2] * 255;
      data[3] = alpha != null ? alpha * 255 : 255;
      ctx.putImageData(imageData, point.x, point.y);
    },
    clear: function clear() {
      var size = this._size;
      this.getContext(true).clearRect(0, 0, size.width + 1, size.height + 1);
    },
    createImageData: function createImageData() {
      var size = Size.read(arguments);
      return this.getContext().createImageData(size.width, size.height);
    },
    getImageData: function getImageData() {
      var rect = _Rectangle.read(arguments);

      if (rect.isEmpty()) rect = new _Rectangle(this._size);
      return this.getContext().getImageData(rect.x, rect.y, rect.width, rect.height);
    },
    setImageData: function setImageData(data) {
      var point = Point.read(arguments, 1);
      this.getContext(true).putImageData(data, point.x, point.y);
    },
    _getBounds: function _getBounds(matrix, options) {
      var rect = new _Rectangle(this._size).setCenter(0, 0);
      return matrix ? matrix._transformBounds(rect) : rect;
    },
    _hitTestSelf: function _hitTestSelf(point) {
      if (this._contains(point)) {
        var that = this;
        return new HitResult('pixel', that, {
          offset: point.add(that._size.divide(2)).round(),
          color: {
            get: function get() {
              return that.getPixel(this.offset);
            }
          }
        });
      }
    },
    _draw: function _draw(ctx, param, viewMatrix) {
      var element = this.getElement();

      if (element && element.width > 0 && element.height > 0) {
        ctx.globalAlpha = Numerical.clamp(this._opacity, 0, 1);

        this._setStyles(ctx, param, viewMatrix);

        DomElement.setPrefixed(ctx, 'imageSmoothingEnabled', this._smoothing);
        ctx.drawImage(element, -this._size.width / 2, -this._size.height / 2);
      }
    },
    _canComposite: function _canComposite() {
      return true;
    }
  });
  var SymbolItem = Item.extend({
    _class: 'SymbolItem',
    _applyMatrix: false,
    _canApplyMatrix: false,
    _boundsOptions: {
      stroke: true
    },
    _serializeFields: {
      symbol: null
    },
    initialize: function SymbolItem(arg0, arg1) {
      if (!this._initialize(arg0, arg1 !== undefined && Point.read(arguments, 1))) this.setDefinition(arg0 instanceof SymbolDefinition ? arg0 : new SymbolDefinition(arg0));
    },
    _equals: function _equals(item) {
      return this._definition === item._definition;
    },
    copyContent: function copyContent(source) {
      this.setDefinition(source._definition);
    },
    getDefinition: function getDefinition() {
      return this._definition;
    },
    setDefinition: function setDefinition(definition) {
      this._definition = definition;

      this._changed(9);
    },
    getSymbol: '#getDefinition',
    setSymbol: '#setDefinition',
    isEmpty: function isEmpty() {
      return this._definition._item.isEmpty();
    },
    _getBounds: function _getBounds(matrix, options) {
      var item = this._definition._item;
      return item._getCachedBounds(item._matrix.prepended(matrix), options);
    },
    _hitTestSelf: function _hitTestSelf(point, options, viewMatrix) {
      var opts = options.extend({
        all: false
      });

      var res = this._definition._item._hitTest(point, opts, viewMatrix);

      if (res) res.item = this;
      return res;
    },
    _draw: function _draw(ctx, param) {
      this._definition._item.draw(ctx, param);
    }
  });
  var SymbolDefinition = Base.extend({
    _class: 'SymbolDefinition',
    initialize: function SymbolDefinition(item, dontCenter) {
      this._id = UID.get();
      this.project = paper.project;
      if (item) this.setItem(item, dontCenter);
    },
    _serialize: function _serialize(options, dictionary) {
      return dictionary.add(this, function () {
        return Base.serialize([this._class, this._item], options, false, dictionary);
      });
    },
    _changed: function _changed(flags) {
      if (flags & 8) Item._clearBoundsCache(this);
      if (flags & 1) this.project._changed(flags);
    },
    getItem: function getItem() {
      return this._item;
    },
    setItem: function setItem(item, _dontCenter) {
      if (item._symbol) item = item.clone();
      if (this._item) this._item._symbol = null;
      this._item = item;
      item.remove();
      item.setSelected(false);
      if (!_dontCenter) item.setPosition(new Point());
      item._symbol = this;

      this._changed(9);
    },
    getDefinition: '#getItem',
    setDefinition: '#setItem',
    place: function place(position) {
      return new SymbolItem(this, position);
    },
    clone: function clone() {
      return new SymbolDefinition(this._item.clone(false));
    },
    equals: function equals(symbol) {
      return symbol === this || symbol && this._item.equals(symbol._item) || false;
    }
  });
  var HitResult = Base.extend({
    _class: 'HitResult',
    initialize: function HitResult(type, item, values) {
      this.type = type;
      this.item = item;
      if (values) this.inject(values);
    },
    statics: {
      getOptions: function getOptions(args) {
        var options = args && Base.read(args);
        return new Base({
          type: null,
          tolerance: paper.settings.hitTolerance,
          fill: !options,
          stroke: !options,
          segments: !options,
          handles: false,
          ends: false,
          position: false,
          center: false,
          bounds: false,
          guides: false,
          selected: false
        }, options);
      }
    }
  });
  var Segment = Base.extend({
    _class: 'Segment',
    beans: true,
    _selection: 0,
    initialize: function Segment(arg0, arg1, arg2, arg3, arg4, arg5) {
      var count = arguments.length,
          point,
          handleIn,
          handleOut,
          selection;

      if (count > 0) {
        if (arg0 == null || _typeof(arg0) === 'object') {
          if (count === 1 && arg0 && 'point' in arg0) {
            point = arg0.point;
            handleIn = arg0.handleIn;
            handleOut = arg0.handleOut;
            selection = arg0.selection;
          } else {
            point = arg0;
            handleIn = arg1;
            handleOut = arg2;
            selection = arg3;
          }
        } else {
          point = [arg0, arg1];
          handleIn = arg2 !== undefined ? [arg2, arg3] : null;
          handleOut = arg4 !== undefined ? [arg4, arg5] : null;
        }
      }

      new SegmentPoint(point, this, '_point');
      new SegmentPoint(handleIn, this, '_handleIn');
      new SegmentPoint(handleOut, this, '_handleOut');
      if (selection) this.setSelection(selection);
    },
    _serialize: function _serialize(options, dictionary) {
      var point = this._point,
          selection = this._selection,
          obj = selection || this.hasHandles() ? [point, this._handleIn, this._handleOut] : point;
      if (selection) obj.push(selection);
      return Base.serialize(obj, options, true, dictionary);
    },
    _changed: function _changed(point) {
      var path = this._path;
      if (!path) return;
      var curves = path._curves,
          index = this._index,
          curve;

      if (curves) {
        if ((!point || point === this._point || point === this._handleIn) && (curve = index > 0 ? curves[index - 1] : path._closed ? curves[curves.length - 1] : null)) curve._changed();
        if ((!point || point === this._point || point === this._handleOut) && (curve = curves[index])) curve._changed();
      }

      path._changed(41);
    },
    getPoint: function getPoint() {
      return this._point;
    },
    setPoint: function setPoint() {
      this._point.set(Point.read(arguments));
    },
    getHandleIn: function getHandleIn() {
      return this._handleIn;
    },
    setHandleIn: function setHandleIn() {
      this._handleIn.set(Point.read(arguments));
    },
    getHandleOut: function getHandleOut() {
      return this._handleOut;
    },
    setHandleOut: function setHandleOut() {
      this._handleOut.set(Point.read(arguments));
    },
    hasHandles: function hasHandles() {
      return !this._handleIn.isZero() || !this._handleOut.isZero();
    },
    isSmooth: function isSmooth() {
      var handleIn = this._handleIn,
          handleOut = this._handleOut;
      return !handleIn.isZero() && !handleOut.isZero() && handleIn.isCollinear(handleOut);
    },
    clearHandles: function clearHandles() {
      this._handleIn._set(0, 0);

      this._handleOut._set(0, 0);
    },
    getSelection: function getSelection() {
      return this._selection;
    },
    setSelection: function setSelection(selection) {
      var oldSelection = this._selection,
          path = this._path;
      this._selection = selection = selection || 0;

      if (path && selection !== oldSelection) {
        path._updateSelection(this, oldSelection, selection);

        path._changed(257);
      }
    },
    _changeSelection: function _changeSelection(flag, selected) {
      var selection = this._selection;
      this.setSelection(selected ? selection | flag : selection & ~flag);
    },
    isSelected: function isSelected() {
      return !!(this._selection & 7);
    },
    setSelected: function setSelected(selected) {
      this._changeSelection(7, selected);
    },
    getIndex: function getIndex() {
      return this._index !== undefined ? this._index : null;
    },
    getPath: function getPath() {
      return this._path || null;
    },
    getCurve: function getCurve() {
      var path = this._path,
          index = this._index;

      if (path) {
        if (index > 0 && !path._closed && index === path._segments.length - 1) index--;
        return path.getCurves()[index] || null;
      }

      return null;
    },
    getLocation: function getLocation() {
      var curve = this.getCurve();
      return curve ? new CurveLocation(curve, this === curve._segment1 ? 0 : 1) : null;
    },
    getNext: function getNext() {
      var segments = this._path && this._path._segments;
      return segments && (segments[this._index + 1] || this._path._closed && segments[0]) || null;
    },
    smooth: function smooth(options, _first, _last) {
      var opts = options || {},
          type = opts.type,
          factor = opts.factor,
          prev = this.getPrevious(),
          next = this.getNext(),
          p0 = (prev || this)._point,
          p1 = this._point,
          p2 = (next || this)._point,
          d1 = p0.getDistance(p1),
          d2 = p1.getDistance(p2);

      if (!type || type === 'catmull-rom') {
        var a = factor === undefined ? 0.5 : factor,
            d1_a = Math.pow(d1, a),
            d1_2a = d1_a * d1_a,
            d2_a = Math.pow(d2, a),
            d2_2a = d2_a * d2_a;

        if (!_first && prev) {
          var A = 2 * d2_2a + 3 * d2_a * d1_a + d1_2a,
              N = 3 * d2_a * (d2_a + d1_a);
          this.setHandleIn(N !== 0 ? new Point((d2_2a * p0._x + A * p1._x - d1_2a * p2._x) / N - p1._x, (d2_2a * p0._y + A * p1._y - d1_2a * p2._y) / N - p1._y) : new Point());
        }

        if (!_last && next) {
          var A = 2 * d1_2a + 3 * d1_a * d2_a + d2_2a,
              N = 3 * d1_a * (d1_a + d2_a);
          this.setHandleOut(N !== 0 ? new Point((d1_2a * p2._x + A * p1._x - d2_2a * p0._x) / N - p1._x, (d1_2a * p2._y + A * p1._y - d2_2a * p0._y) / N - p1._y) : new Point());
        }
      } else if (type === 'geometric') {
        if (prev && next) {
          var vector = p0.subtract(p2),
              t = factor === undefined ? 0.4 : factor,
              k = t * d1 / (d1 + d2);
          if (!_first) this.setHandleIn(vector.multiply(k));
          if (!_last) this.setHandleOut(vector.multiply(k - t));
        }
      } else {
        throw new Error('Smoothing method \'' + type + '\' not supported.');
      }
    },
    getPrevious: function getPrevious() {
      var segments = this._path && this._path._segments;
      return segments && (segments[this._index - 1] || this._path._closed && segments[segments.length - 1]) || null;
    },
    isFirst: function isFirst() {
      return !this._index;
    },
    isLast: function isLast() {
      var path = this._path;
      return path && this._index === path._segments.length - 1 || false;
    },
    reverse: function reverse() {
      var handleIn = this._handleIn,
          handleOut = this._handleOut,
          tmp = handleIn.clone();
      handleIn.set(handleOut);
      handleOut.set(tmp);
    },
    reversed: function reversed() {
      return new Segment(this._point, this._handleOut, this._handleIn);
    },
    remove: function remove() {
      return this._path ? !!this._path.removeSegment(this._index) : false;
    },
    clone: function clone() {
      return new Segment(this._point, this._handleIn, this._handleOut);
    },
    equals: function equals(segment) {
      return segment === this || segment && this._class === segment._class && this._point.equals(segment._point) && this._handleIn.equals(segment._handleIn) && this._handleOut.equals(segment._handleOut) || false;
    },
    toString: function toString() {
      var parts = ['point: ' + this._point];
      if (!this._handleIn.isZero()) parts.push('handleIn: ' + this._handleIn);
      if (!this._handleOut.isZero()) parts.push('handleOut: ' + this._handleOut);
      return '{ ' + parts.join(', ') + ' }';
    },
    transform: function transform(matrix) {
      this._transformCoordinates(matrix, new Array(6), true);

      this._changed();
    },
    interpolate: function interpolate(from, to, factor) {
      var u = 1 - factor,
          v = factor,
          point1 = from._point,
          point2 = to._point,
          handleIn1 = from._handleIn,
          handleIn2 = to._handleIn,
          handleOut2 = to._handleOut,
          handleOut1 = from._handleOut;

      this._point._set(u * point1._x + v * point2._x, u * point1._y + v * point2._y, true);

      this._handleIn._set(u * handleIn1._x + v * handleIn2._x, u * handleIn1._y + v * handleIn2._y, true);

      this._handleOut._set(u * handleOut1._x + v * handleOut2._x, u * handleOut1._y + v * handleOut2._y, true);

      this._changed();
    },
    _transformCoordinates: function _transformCoordinates(matrix, coords, change) {
      var point = this._point,
          handleIn = !change || !this._handleIn.isZero() ? this._handleIn : null,
          handleOut = !change || !this._handleOut.isZero() ? this._handleOut : null,
          x = point._x,
          y = point._y,
          i = 2;
      coords[0] = x;
      coords[1] = y;

      if (handleIn) {
        coords[i++] = handleIn._x + x;
        coords[i++] = handleIn._y + y;
      }

      if (handleOut) {
        coords[i++] = handleOut._x + x;
        coords[i++] = handleOut._y + y;
      }

      if (matrix) {
        matrix._transformCoordinates(coords, coords, i / 2);

        x = coords[0];
        y = coords[1];

        if (change) {
          point._x = x;
          point._y = y;
          i = 2;

          if (handleIn) {
            handleIn._x = coords[i++] - x;
            handleIn._y = coords[i++] - y;
          }

          if (handleOut) {
            handleOut._x = coords[i++] - x;
            handleOut._y = coords[i++] - y;
          }
        } else {
          if (!handleIn) {
            coords[i++] = x;
            coords[i++] = y;
          }

          if (!handleOut) {
            coords[i++] = x;
            coords[i++] = y;
          }
        }
      }

      return coords;
    }
  });
  var SegmentPoint = Point.extend({
    initialize: function SegmentPoint(point, owner, key) {
      var x, y, selected;

      if (!point) {
        x = y = 0;
      } else if ((x = point[0]) !== undefined) {
        y = point[1];
      } else {
        var pt = point;

        if ((x = pt.x) === undefined) {
          pt = Point.read(arguments);
          x = pt.x;
        }

        y = pt.y;
        selected = pt.selected;
      }

      this._x = x;
      this._y = y;
      this._owner = owner;
      owner[key] = this;
      if (selected) this.setSelected(true);
    },
    _set: function _set(x, y) {
      this._x = x;
      this._y = y;

      this._owner._changed(this);

      return this;
    },
    getX: function getX() {
      return this._x;
    },
    setX: function setX(x) {
      this._x = x;

      this._owner._changed(this);
    },
    getY: function getY() {
      return this._y;
    },
    setY: function setY(y) {
      this._y = y;

      this._owner._changed(this);
    },
    isZero: function isZero() {
      var isZero = Numerical.isZero;
      return isZero(this._x) && isZero(this._y);
    },
    isSelected: function isSelected() {
      return !!(this._owner._selection & this._getSelection());
    },
    setSelected: function setSelected(selected) {
      this._owner._changeSelection(this._getSelection(), selected);
    },
    _getSelection: function _getSelection() {
      var owner = this._owner;
      return this === owner._point ? 1 : this === owner._handleIn ? 2 : this === owner._handleOut ? 4 : 0;
    }
  });
  var Curve = Base.extend({
    _class: 'Curve',
    beans: true,
    initialize: function Curve(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
      var count = arguments.length,
          seg1,
          seg2,
          point1,
          point2,
          handle1,
          handle2;

      if (count === 3) {
        this._path = arg0;
        seg1 = arg1;
        seg2 = arg2;
      } else if (!count) {
        seg1 = new Segment();
        seg2 = new Segment();
      } else if (count === 1) {
        if ('segment1' in arg0) {
          seg1 = new Segment(arg0.segment1);
          seg2 = new Segment(arg0.segment2);
        } else if ('point1' in arg0) {
          point1 = arg0.point1;
          handle1 = arg0.handle1;
          handle2 = arg0.handle2;
          point2 = arg0.point2;
        } else if (Array.isArray(arg0)) {
          point1 = [arg0[0], arg0[1]];
          point2 = [arg0[6], arg0[7]];
          handle1 = [arg0[2] - arg0[0], arg0[3] - arg0[1]];
          handle2 = [arg0[4] - arg0[6], arg0[5] - arg0[7]];
        }
      } else if (count === 2) {
        seg1 = new Segment(arg0);
        seg2 = new Segment(arg1);
      } else if (count === 4) {
        point1 = arg0;
        handle1 = arg1;
        handle2 = arg2;
        point2 = arg3;
      } else if (count === 8) {
        point1 = [arg0, arg1];
        point2 = [arg6, arg7];
        handle1 = [arg2 - arg0, arg3 - arg1];
        handle2 = [arg4 - arg6, arg5 - arg7];
      }

      this._segment1 = seg1 || new Segment(point1, null, handle1);
      this._segment2 = seg2 || new Segment(point2, handle2, null);
    },
    _serialize: function _serialize(options, dictionary) {
      return Base.serialize(this.hasHandles() ? [this.getPoint1(), this.getHandle1(), this.getHandle2(), this.getPoint2()] : [this.getPoint1(), this.getPoint2()], options, true, dictionary);
    },
    _changed: function _changed() {
      this._length = this._bounds = undefined;
    },
    clone: function clone() {
      return new Curve(this._segment1, this._segment2);
    },
    toString: function toString() {
      var parts = ['point1: ' + this._segment1._point];
      if (!this._segment1._handleOut.isZero()) parts.push('handle1: ' + this._segment1._handleOut);
      if (!this._segment2._handleIn.isZero()) parts.push('handle2: ' + this._segment2._handleIn);
      parts.push('point2: ' + this._segment2._point);
      return '{ ' + parts.join(', ') + ' }';
    },
    classify: function classify() {
      return Curve.classify(this.getValues());
    },
    remove: function remove() {
      var removed = false;

      if (this._path) {
        var segment2 = this._segment2,
            handleOut = segment2._handleOut;
        removed = segment2.remove();
        if (removed) this._segment1._handleOut.set(handleOut);
      }

      return removed;
    },
    getPoint1: function getPoint1() {
      return this._segment1._point;
    },
    setPoint1: function setPoint1() {
      this._segment1._point.set(Point.read(arguments));
    },
    getPoint2: function getPoint2() {
      return this._segment2._point;
    },
    setPoint2: function setPoint2() {
      this._segment2._point.set(Point.read(arguments));
    },
    getHandle1: function getHandle1() {
      return this._segment1._handleOut;
    },
    setHandle1: function setHandle1() {
      this._segment1._handleOut.set(Point.read(arguments));
    },
    getHandle2: function getHandle2() {
      return this._segment2._handleIn;
    },
    setHandle2: function setHandle2() {
      this._segment2._handleIn.set(Point.read(arguments));
    },
    getSegment1: function getSegment1() {
      return this._segment1;
    },
    getSegment2: function getSegment2() {
      return this._segment2;
    },
    getPath: function getPath() {
      return this._path;
    },
    getIndex: function getIndex() {
      return this._segment1._index;
    },
    getNext: function getNext() {
      var curves = this._path && this._path._curves;
      return curves && (curves[this._segment1._index + 1] || this._path._closed && curves[0]) || null;
    },
    getPrevious: function getPrevious() {
      var curves = this._path && this._path._curves;
      return curves && (curves[this._segment1._index - 1] || this._path._closed && curves[curves.length - 1]) || null;
    },
    isFirst: function isFirst() {
      return !this._segment1._index;
    },
    isLast: function isLast() {
      var path = this._path;
      return path && this._segment1._index === path._curves.length - 1 || false;
    },
    isSelected: function isSelected() {
      return this.getPoint1().isSelected() && this.getHandle1().isSelected() && this.getHandle2().isSelected() && this.getPoint2().isSelected();
    },
    setSelected: function setSelected(selected) {
      this.getPoint1().setSelected(selected);
      this.getHandle1().setSelected(selected);
      this.getHandle2().setSelected(selected);
      this.getPoint2().setSelected(selected);
    },
    getValues: function getValues(matrix) {
      return Curve.getValues(this._segment1, this._segment2, matrix);
    },
    getPoints: function getPoints() {
      var coords = this.getValues(),
          points = [];

      for (var i = 0; i < 8; i += 2) {
        points.push(new Point(coords[i], coords[i + 1]));
      }

      return points;
    }
  }, {
    getLength: function getLength() {
      if (this._length == null) this._length = Curve.getLength(this.getValues(), 0, 1);
      return this._length;
    },
    getArea: function getArea() {
      return Curve.getArea(this.getValues());
    },
    getLine: function getLine() {
      return new Line(this._segment1._point, this._segment2._point);
    },
    getPart: function getPart(from, to) {
      return new Curve(Curve.getPart(this.getValues(), from, to));
    },
    getPartLength: function getPartLength(from, to) {
      return Curve.getLength(this.getValues(), from, to);
    },
    divideAt: function divideAt(location) {
      return this.divideAtTime(location && location.curve === this ? location.time : this.getTimeAt(location));
    },
    divideAtTime: function divideAtTime(time, _setHandles) {
      var tMin = 1e-8,
          tMax = 1 - tMin,
          res = null;

      if (time >= tMin && time <= tMax) {
        var parts = Curve.subdivide(this.getValues(), time),
            left = parts[0],
            right = parts[1],
            setHandles = _setHandles || this.hasHandles(),
            seg1 = this._segment1,
            seg2 = this._segment2,
            path = this._path;

        if (setHandles) {
          seg1._handleOut._set(left[2] - left[0], left[3] - left[1]);

          seg2._handleIn._set(right[4] - right[6], right[5] - right[7]);
        }

        var x = left[6],
            y = left[7],
            segment = new Segment(new Point(x, y), setHandles && new Point(left[4] - x, left[5] - y), setHandles && new Point(right[2] - x, right[3] - y));

        if (path) {
          path.insert(seg1._index + 1, segment);
          res = this.getNext();
        } else {
          this._segment2 = segment;

          this._changed();

          res = new Curve(segment, seg2);
        }
      }

      return res;
    },
    splitAt: function splitAt(location) {
      var path = this._path;
      return path ? path.splitAt(location) : null;
    },
    splitAtTime: function splitAtTime(time) {
      return this.splitAt(this.getLocationAtTime(time));
    },
    divide: function divide(offset, isTime) {
      return this.divideAtTime(offset === undefined ? 0.5 : isTime ? offset : this.getTimeAt(offset));
    },
    split: function split(offset, isTime) {
      return this.splitAtTime(offset === undefined ? 0.5 : isTime ? offset : this.getTimeAt(offset));
    },
    reversed: function reversed() {
      return new Curve(this._segment2.reversed(), this._segment1.reversed());
    },
    clearHandles: function clearHandles() {
      this._segment1._handleOut._set(0, 0);

      this._segment2._handleIn._set(0, 0);
    },
    statics: {
      getValues: function getValues(segment1, segment2, matrix, straight) {
        var p1 = segment1._point,
            h1 = segment1._handleOut,
            h2 = segment2._handleIn,
            p2 = segment2._point,
            x1 = p1.x,
            y1 = p1.y,
            x2 = p2.x,
            y2 = p2.y,
            values = straight ? [x1, y1, x1, y1, x2, y2, x2, y2] : [x1, y1, x1 + h1._x, y1 + h1._y, x2 + h2._x, y2 + h2._y, x2, y2];
        if (matrix) matrix._transformCoordinates(values, values, 4);
        return values;
      },
      subdivide: function subdivide(v, t) {
        var x0 = v[0],
            y0 = v[1],
            x1 = v[2],
            y1 = v[3],
            x2 = v[4],
            y2 = v[5],
            x3 = v[6],
            y3 = v[7];
        if (t === undefined) t = 0.5;
        var u = 1 - t,
            x4 = u * x0 + t * x1,
            y4 = u * y0 + t * y1,
            x5 = u * x1 + t * x2,
            y5 = u * y1 + t * y2,
            x6 = u * x2 + t * x3,
            y6 = u * y2 + t * y3,
            x7 = u * x4 + t * x5,
            y7 = u * y4 + t * y5,
            x8 = u * x5 + t * x6,
            y8 = u * y5 + t * y6,
            x9 = u * x7 + t * x8,
            y9 = u * y7 + t * y8;
        return [[x0, y0, x4, y4, x7, y7, x9, y9], [x9, y9, x8, y8, x6, y6, x3, y3]];
      },
      getMonoCurves: function getMonoCurves(v, dir) {
        var curves = [],
            io = dir ? 0 : 1,
            o0 = v[io + 0],
            o1 = v[io + 2],
            o2 = v[io + 4],
            o3 = v[io + 6];

        if (o0 >= o1 === o1 >= o2 && o1 >= o2 === o2 >= o3 || Curve.isStraight(v)) {
          curves.push(v);
        } else {
          var a = 3 * (o1 - o2) - o0 + o3,
              b = 2 * (o0 + o2) - 4 * o1,
              c = o1 - o0,
              tMin = 1e-8,
              tMax = 1 - tMin,
              roots = [],
              n = Numerical.solveQuadratic(a, b, c, roots, tMin, tMax);

          if (!n) {
            curves.push(v);
          } else {
            roots.sort();
            var t = roots[0],
                parts = Curve.subdivide(v, t);
            curves.push(parts[0]);

            if (n > 1) {
              t = (roots[1] - t) / (1 - t);
              parts = Curve.subdivide(parts[1], t);
              curves.push(parts[0]);
            }

            curves.push(parts[1]);
          }
        }

        return curves;
      },
      solveCubic: function solveCubic(v, coord, val, roots, min, max) {
        var v0 = v[coord],
            v1 = v[coord + 2],
            v2 = v[coord + 4],
            v3 = v[coord + 6],
            res = 0;

        if (!(v0 < val && v3 < val && v1 < val && v2 < val || v0 > val && v3 > val && v1 > val && v2 > val)) {
          var c = 3 * (v1 - v0),
              b = 3 * (v2 - v1) - c,
              a = v3 - v0 - c - b;
          res = Numerical.solveCubic(a, b, c, v0 - val, roots, min, max);
        }

        return res;
      },
      getTimeOf: function getTimeOf(v, point) {
        var p0 = new Point(v[0], v[1]),
            p3 = new Point(v[6], v[7]),
            epsilon = 1e-12,
            geomEpsilon = 1e-7,
            t = point.isClose(p0, epsilon) ? 0 : point.isClose(p3, epsilon) ? 1 : null;

        if (t === null) {
          var coords = [point.x, point.y],
              roots = [];

          for (var c = 0; c < 2; c++) {
            var count = Curve.solveCubic(v, c, coords[c], roots, 0, 1);

            for (var i = 0; i < count; i++) {
              var u = roots[i];
              if (point.isClose(Curve.getPoint(v, u), geomEpsilon)) return u;
            }
          }
        }

        return point.isClose(p0, geomEpsilon) ? 0 : point.isClose(p3, geomEpsilon) ? 1 : null;
      },
      getNearestTime: function getNearestTime(v, point) {
        if (Curve.isStraight(v)) {
          var x0 = v[0],
              y0 = v[1],
              x3 = v[6],
              y3 = v[7],
              vx = x3 - x0,
              vy = y3 - y0,
              det = vx * vx + vy * vy;
          if (det === 0) return 0;
          var u = ((point.x - x0) * vx + (point.y - y0) * vy) / det;
          return u < 1e-12 ? 0 : u > 0.999999999999 ? 1 : Curve.getTimeOf(v, new Point(x0 + u * vx, y0 + u * vy));
        }

        var count = 100,
            minDist = Infinity,
            minT = 0;

        function refine(t) {
          if (t >= 0 && t <= 1) {
            var dist = point.getDistance(Curve.getPoint(v, t), true);

            if (dist < minDist) {
              minDist = dist;
              minT = t;
              return true;
            }
          }
        }

        for (var i = 0; i <= count; i++) {
          refine(i / count);
        }

        var step = 1 / (count * 2);

        while (step > 1e-8) {
          if (!refine(minT - step) && !refine(minT + step)) step /= 2;
        }

        return minT;
      },
      getPart: function getPart(v, from, to) {
        var flip = from > to;

        if (flip) {
          var tmp = from;
          from = to;
          to = tmp;
        }

        if (from > 0) v = Curve.subdivide(v, from)[1];
        if (to < 1) v = Curve.subdivide(v, (to - from) / (1 - from))[0];
        return flip ? [v[6], v[7], v[4], v[5], v[2], v[3], v[0], v[1]] : v;
      },
      isFlatEnough: function isFlatEnough(v, flatness) {
        var x0 = v[0],
            y0 = v[1],
            x1 = v[2],
            y1 = v[3],
            x2 = v[4],
            y2 = v[5],
            x3 = v[6],
            y3 = v[7],
            ux = 3 * x1 - 2 * x0 - x3,
            uy = 3 * y1 - 2 * y0 - y3,
            vx = 3 * x2 - 2 * x3 - x0,
            vy = 3 * y2 - 2 * y3 - y0;
        return Math.max(ux * ux, vx * vx) + Math.max(uy * uy, vy * vy) <= 16 * flatness * flatness;
      },
      getArea: function getArea(v) {
        var x0 = v[0],
            y0 = v[1],
            x1 = v[2],
            y1 = v[3],
            x2 = v[4],
            y2 = v[5],
            x3 = v[6],
            y3 = v[7];
        return 3 * ((y3 - y0) * (x1 + x2) - (x3 - x0) * (y1 + y2) + y1 * (x0 - x2) - x1 * (y0 - y2) + y3 * (x2 + x0 / 3) - x3 * (y2 + y0 / 3)) / 20;
      },
      getBounds: function getBounds(v) {
        var min = v.slice(0, 2),
            max = min.slice(),
            roots = [0, 0];

        for (var i = 0; i < 2; i++) {
          Curve._addBounds(v[i], v[i + 2], v[i + 4], v[i + 6], i, 0, min, max, roots);
        }

        return new _Rectangle(min[0], min[1], max[0] - min[0], max[1] - min[1]);
      },
      _addBounds: function _addBounds(v0, v1, v2, v3, coord, padding, min, max, roots) {
        function add(value, padding) {
          var left = value - padding,
              right = value + padding;
          if (left < min[coord]) min[coord] = left;
          if (right > max[coord]) max[coord] = right;
        }

        padding /= 2;
        var minPad = min[coord] + padding,
            maxPad = max[coord] - padding;

        if (v0 < minPad || v1 < minPad || v2 < minPad || v3 < minPad || v0 > maxPad || v1 > maxPad || v2 > maxPad || v3 > maxPad) {
          if (v1 < v0 != v1 < v3 && v2 < v0 != v2 < v3) {
            add(v0, 0);
            add(v3, 0);
          } else {
            var a = 3 * (v1 - v2) - v0 + v3,
                b = 2 * (v0 + v2) - 4 * v1,
                c = v1 - v0,
                count = Numerical.solveQuadratic(a, b, c, roots),
                tMin = 1e-8,
                tMax = 1 - tMin;
            add(v3, 0);

            for (var i = 0; i < count; i++) {
              var t = roots[i],
                  u = 1 - t;
              if (tMin <= t && t <= tMax) add(u * u * u * v0 + 3 * u * u * t * v1 + 3 * u * t * t * v2 + t * t * t * v3, padding);
            }
          }
        }
      }
    }
  }, Base.each(['getBounds', 'getStrokeBounds', 'getHandleBounds'], function (name) {
    this[name] = function () {
      if (!this._bounds) this._bounds = {};
      var bounds = this._bounds[name];

      if (!bounds) {
        bounds = this._bounds[name] = Path[name]([this._segment1, this._segment2], false, this._path);
      }

      return bounds.clone();
    };
  }, {}), Base.each({
    isStraight: function isStraight(p1, h1, h2, p2) {
      if (h1.isZero() && h2.isZero()) {
        return true;
      } else {
        var v = p2.subtract(p1);

        if (v.isZero()) {
          return false;
        } else if (v.isCollinear(h1) && v.isCollinear(h2)) {
          var l = new Line(p1, p2),
              epsilon = 1e-7;

          if (l.getDistance(p1.add(h1)) < epsilon && l.getDistance(p2.add(h2)) < epsilon) {
            var div = v.dot(v),
                s1 = v.dot(h1) / div,
                s2 = v.dot(h2) / div;
            return s1 >= 0 && s1 <= 1 && s2 <= 0 && s2 >= -1;
          }
        }
      }

      return false;
    },
    isLinear: function isLinear(p1, h1, h2, p2) {
      var third = p2.subtract(p1).divide(3);
      return h1.equals(third) && h2.negate().equals(third);
    }
  }, function (test, name) {
    this[name] = function (epsilon) {
      var seg1 = this._segment1,
          seg2 = this._segment2;
      return test(seg1._point, seg1._handleOut, seg2._handleIn, seg2._point, epsilon);
    };

    this.statics[name] = function (v, epsilon) {
      var x0 = v[0],
          y0 = v[1],
          x3 = v[6],
          y3 = v[7];
      return test(new Point(x0, y0), new Point(v[2] - x0, v[3] - y0), new Point(v[4] - x3, v[5] - y3), new Point(x3, y3), epsilon);
    };
  }, {
    statics: {},
    hasHandles: function hasHandles() {
      return !this._segment1._handleOut.isZero() || !this._segment2._handleIn.isZero();
    },
    hasLength: function hasLength(epsilon) {
      return (!this.getPoint1().equals(this.getPoint2()) || this.hasHandles()) && this.getLength() > (epsilon || 0);
    },
    isCollinear: function isCollinear(curve) {
      return curve && this.isStraight() && curve.isStraight() && this.getLine().isCollinear(curve.getLine());
    },
    isHorizontal: function isHorizontal() {
      return this.isStraight() && Math.abs(this.getTangentAtTime(0.5).y) < 1e-8;
    },
    isVertical: function isVertical() {
      return this.isStraight() && Math.abs(this.getTangentAtTime(0.5).x) < 1e-8;
    }
  }), {
    beans: false,
    getLocationAt: function getLocationAt(offset, _isTime) {
      return this.getLocationAtTime(_isTime ? offset : this.getTimeAt(offset));
    },
    getLocationAtTime: function getLocationAtTime(t) {
      return t != null && t >= 0 && t <= 1 ? new CurveLocation(this, t) : null;
    },
    getTimeAt: function getTimeAt(offset, start) {
      return Curve.getTimeAt(this.getValues(), offset, start);
    },
    getParameterAt: '#getTimeAt',
    getTimesWithTangent: function getTimesWithTangent() {
      var tangent = Point.read(arguments);
      return tangent.isZero() ? [] : Curve.getTimesWithTangent(this.getValues(), tangent);
    },
    getOffsetAtTime: function getOffsetAtTime(t) {
      return this.getPartLength(0, t);
    },
    getLocationOf: function getLocationOf() {
      return this.getLocationAtTime(this.getTimeOf(Point.read(arguments)));
    },
    getOffsetOf: function getOffsetOf() {
      var loc = this.getLocationOf.apply(this, arguments);
      return loc ? loc.getOffset() : null;
    },
    getTimeOf: function getTimeOf() {
      return Curve.getTimeOf(this.getValues(), Point.read(arguments));
    },
    getParameterOf: '#getTimeOf',
    getNearestLocation: function getNearestLocation() {
      var point = Point.read(arguments),
          values = this.getValues(),
          t = Curve.getNearestTime(values, point),
          pt = Curve.getPoint(values, t);
      return new CurveLocation(this, t, pt, null, point.getDistance(pt));
    },
    getNearestPoint: function getNearestPoint() {
      var loc = this.getNearestLocation.apply(this, arguments);
      return loc ? loc.getPoint() : loc;
    }
  }, new function () {
    var methods = ['getPoint', 'getTangent', 'getNormal', 'getWeightedTangent', 'getWeightedNormal', 'getCurvature'];
    return Base.each(methods, function (name) {
      this[name + 'At'] = function (location, _isTime) {
        var values = this.getValues();
        return Curve[name](values, _isTime ? location : Curve.getTimeAt(values, location));
      };

      this[name + 'AtTime'] = function (time) {
        return Curve[name](this.getValues(), time);
      };
    }, {
      statics: {
        _evaluateMethods: methods
      }
    });
  }(), new function () {
    function getLengthIntegrand(v) {
      var x0 = v[0],
          y0 = v[1],
          x1 = v[2],
          y1 = v[3],
          x2 = v[4],
          y2 = v[5],
          x3 = v[6],
          y3 = v[7],
          ax = 9 * (x1 - x2) + 3 * (x3 - x0),
          bx = 6 * (x0 + x2) - 12 * x1,
          cx = 3 * (x1 - x0),
          ay = 9 * (y1 - y2) + 3 * (y3 - y0),
          by = 6 * (y0 + y2) - 12 * y1,
          cy = 3 * (y1 - y0);
      return function (t) {
        var dx = (ax * t + bx) * t + cx,
            dy = (ay * t + by) * t + cy;
        return Math.sqrt(dx * dx + dy * dy);
      };
    }

    function getIterations(a, b) {
      return Math.max(2, Math.min(16, Math.ceil(Math.abs(b - a) * 32)));
    }

    function evaluate(v, t, type, normalized) {
      if (t == null || t < 0 || t > 1) return null;
      var x0 = v[0],
          y0 = v[1],
          x1 = v[2],
          y1 = v[3],
          x2 = v[4],
          y2 = v[5],
          x3 = v[6],
          y3 = v[7],
          isZero = Numerical.isZero;

      if (isZero(x1 - x0) && isZero(y1 - y0)) {
        x1 = x0;
        y1 = y0;
      }

      if (isZero(x2 - x3) && isZero(y2 - y3)) {
        x2 = x3;
        y2 = y3;
      }

      var cx = 3 * (x1 - x0),
          bx = 3 * (x2 - x1) - cx,
          ax = x3 - x0 - cx - bx,
          cy = 3 * (y1 - y0),
          by = 3 * (y2 - y1) - cy,
          ay = y3 - y0 - cy - by,
          x,
          y;

      if (type === 0) {
        x = t === 0 ? x0 : t === 1 ? x3 : ((ax * t + bx) * t + cx) * t + x0;
        y = t === 0 ? y0 : t === 1 ? y3 : ((ay * t + by) * t + cy) * t + y0;
      } else {
        var tMin = 1e-8,
            tMax = 1 - tMin;

        if (t < tMin) {
          x = cx;
          y = cy;
        } else if (t > tMax) {
          x = 3 * (x3 - x2);
          y = 3 * (y3 - y2);
        } else {
          x = (3 * ax * t + 2 * bx) * t + cx;
          y = (3 * ay * t + 2 * by) * t + cy;
        }

        if (normalized) {
          if (x === 0 && y === 0 && (t < tMin || t > tMax)) {
            x = x2 - x1;
            y = y2 - y1;
          }

          var len = Math.sqrt(x * x + y * y);

          if (len) {
            x /= len;
            y /= len;
          }
        }

        if (type === 3) {
          var x2 = 6 * ax * t + 2 * bx,
              y2 = 6 * ay * t + 2 * by,
              d = Math.pow(x * x + y * y, 3 / 2);
          x = d !== 0 ? (x * y2 - y * x2) / d : 0;
          y = 0;
        }
      }

      return type === 2 ? new Point(y, -x) : new Point(x, y);
    }

    return {
      statics: {
        classify: function classify(v) {
          var x0 = v[0],
              y0 = v[1],
              x1 = v[2],
              y1 = v[3],
              x2 = v[4],
              y2 = v[5],
              x3 = v[6],
              y3 = v[7],
              a1 = x0 * (y3 - y2) + y0 * (x2 - x3) + x3 * y2 - y3 * x2,
              a2 = x1 * (y0 - y3) + y1 * (x3 - x0) + x0 * y3 - y0 * x3,
              a3 = x2 * (y1 - y0) + y2 * (x0 - x1) + x1 * y0 - y1 * x0,
              d3 = 3 * a3,
              d2 = d3 - a2,
              d1 = d2 - a2 + a1,
              l = Math.sqrt(d1 * d1 + d2 * d2 + d3 * d3),
              s = l !== 0 ? 1 / l : 0,
              isZero = Numerical.isZero,
              serpentine = 'serpentine';
          d1 *= s;
          d2 *= s;
          d3 *= s;

          function type(type, t1, t2) {
            var hasRoots = t1 !== undefined,
                t1Ok = hasRoots && t1 > 0 && t1 < 1,
                t2Ok = hasRoots && t2 > 0 && t2 < 1;

            if (hasRoots && (!(t1Ok || t2Ok) || type === 'loop' && !(t1Ok && t2Ok))) {
              type = 'arch';
              t1Ok = t2Ok = false;
            }

            return {
              type: type,
              roots: t1Ok || t2Ok ? t1Ok && t2Ok ? t1 < t2 ? [t1, t2] : [t2, t1] : [t1Ok ? t1 : t2] : null
            };
          }

          if (isZero(d1)) {
            return isZero(d2) ? type(isZero(d3) ? 'line' : 'quadratic') : type(serpentine, d3 / (3 * d2));
          }

          var d = 3 * d2 * d2 - 4 * d1 * d3;

          if (isZero(d)) {
            return type('cusp', d2 / (2 * d1));
          }

          var f1 = d > 0 ? Math.sqrt(d / 3) : Math.sqrt(-d),
              f2 = 2 * d1;
          return type(d > 0 ? serpentine : 'loop', (d2 + f1) / f2, (d2 - f1) / f2);
        },
        getLength: function getLength(v, a, b, ds) {
          if (a === undefined) a = 0;
          if (b === undefined) b = 1;

          if (Curve.isStraight(v)) {
            var c = v;

            if (b < 1) {
              c = Curve.subdivide(c, b)[0];
              a /= b;
            }

            if (a > 0) {
              c = Curve.subdivide(c, a)[1];
            }

            var dx = c[6] - c[0],
                dy = c[7] - c[1];
            return Math.sqrt(dx * dx + dy * dy);
          }

          return Numerical.integrate(ds || getLengthIntegrand(v), a, b, getIterations(a, b));
        },
        getTimeAt: function getTimeAt(v, offset, start) {
          if (start === undefined) start = offset < 0 ? 1 : 0;
          if (offset === 0) return start;
          var abs = Math.abs,
              epsilon = 1e-12,
              forward = offset > 0,
              a = forward ? start : 0,
              b = forward ? 1 : start,
              ds = getLengthIntegrand(v),
              rangeLength = Curve.getLength(v, a, b, ds),
              diff = abs(offset) - rangeLength;

          if (abs(diff) < epsilon) {
            return forward ? b : a;
          } else if (diff > epsilon) {
            return null;
          }

          var guess = offset / rangeLength,
              length = 0;

          function f(t) {
            length += Numerical.integrate(ds, start, t, getIterations(start, t));
            start = t;
            return length - offset;
          }

          return Numerical.findRoot(f, ds, start + guess, a, b, 32, 1e-12);
        },
        getPoint: function getPoint(v, t) {
          return evaluate(v, t, 0, false);
        },
        getTangent: function getTangent(v, t) {
          return evaluate(v, t, 1, true);
        },
        getWeightedTangent: function getWeightedTangent(v, t) {
          return evaluate(v, t, 1, false);
        },
        getNormal: function getNormal(v, t) {
          return evaluate(v, t, 2, true);
        },
        getWeightedNormal: function getWeightedNormal(v, t) {
          return evaluate(v, t, 2, false);
        },
        getCurvature: function getCurvature(v, t) {
          return evaluate(v, t, 3, false).x;
        },
        getPeaks: function getPeaks(v) {
          var x0 = v[0],
              y0 = v[1],
              x1 = v[2],
              y1 = v[3],
              x2 = v[4],
              y2 = v[5],
              x3 = v[6],
              y3 = v[7],
              ax = -x0 + 3 * x1 - 3 * x2 + x3,
              bx = 3 * x0 - 6 * x1 + 3 * x2,
              cx = -3 * x0 + 3 * x1,
              ay = -y0 + 3 * y1 - 3 * y2 + y3,
              by = 3 * y0 - 6 * y1 + 3 * y2,
              cy = -3 * y0 + 3 * y1,
              tMin = 1e-8,
              tMax = 1 - tMin,
              roots = [];
          Numerical.solveCubic(9 * (ax * ax + ay * ay), 9 * (ax * bx + by * ay), 2 * (bx * bx + by * by) + 3 * (cx * ax + cy * ay), cx * bx + by * cy, roots, tMin, tMax);
          return roots.sort();
        }
      }
    };
  }(), new function () {
    function addLocation(locations, include, c1, t1, c2, t2, overlap) {
      var excludeStart = !overlap && c1.getPrevious() === c2,
          excludeEnd = !overlap && c1 !== c2 && c1.getNext() === c2,
          tMin = 1e-8,
          tMax = 1 - tMin;

      if (t1 !== null && t1 >= (excludeStart ? tMin : 0) && t1 <= (excludeEnd ? tMax : 1)) {
        if (t2 !== null && t2 >= (excludeEnd ? tMin : 0) && t2 <= (excludeStart ? tMax : 1)) {
          var loc1 = new CurveLocation(c1, t1, null, overlap),
              loc2 = new CurveLocation(c2, t2, null, overlap);
          loc1._intersection = loc2;
          loc2._intersection = loc1;

          if (!include || include(loc1)) {
            CurveLocation.insert(locations, loc1, true);
          }
        }
      }
    }

    function addCurveIntersections(v1, v2, c1, c2, locations, include, flip, recursion, calls, tMin, tMax, uMin, uMax) {
      if (++calls >= 4096 || ++recursion >= 40) return calls;
      var fatLineEpsilon = 1e-9,
          q0x = v2[0],
          q0y = v2[1],
          q3x = v2[6],
          q3y = v2[7],
          getSignedDistance = Line.getSignedDistance,
          d1 = getSignedDistance(q0x, q0y, q3x, q3y, v2[2], v2[3]),
          d2 = getSignedDistance(q0x, q0y, q3x, q3y, v2[4], v2[5]),
          factor = d1 * d2 > 0 ? 3 / 4 : 4 / 9,
          dMin = factor * Math.min(0, d1, d2),
          dMax = factor * Math.max(0, d1, d2),
          dp0 = getSignedDistance(q0x, q0y, q3x, q3y, v1[0], v1[1]),
          dp1 = getSignedDistance(q0x, q0y, q3x, q3y, v1[2], v1[3]),
          dp2 = getSignedDistance(q0x, q0y, q3x, q3y, v1[4], v1[5]),
          dp3 = getSignedDistance(q0x, q0y, q3x, q3y, v1[6], v1[7]),
          hull = getConvexHull(dp0, dp1, dp2, dp3),
          top = hull[0],
          bottom = hull[1],
          tMinClip,
          tMaxClip;
      if (d1 === 0 && d2 === 0 && dp0 === 0 && dp1 === 0 && dp2 === 0 && dp3 === 0 || (tMinClip = clipConvexHull(top, bottom, dMin, dMax)) == null || (tMaxClip = clipConvexHull(top.reverse(), bottom.reverse(), dMin, dMax)) == null) return calls;
      var tMinNew = tMin + (tMax - tMin) * tMinClip,
          tMaxNew = tMin + (tMax - tMin) * tMaxClip;

      if (Math.max(uMax - uMin, tMaxNew - tMinNew) < fatLineEpsilon) {
        var t = (tMinNew + tMaxNew) / 2,
            u = (uMin + uMax) / 2;
        addLocation(locations, include, flip ? c2 : c1, flip ? u : t, flip ? c1 : c2, flip ? t : u);
      } else {
        v1 = Curve.getPart(v1, tMinClip, tMaxClip);
        var uDiff = uMax - uMin;

        if (tMaxClip - tMinClip > 0.8) {
          if (tMaxNew - tMinNew > uDiff) {
            var parts = Curve.subdivide(v1, 0.5),
                t = (tMinNew + tMaxNew) / 2;
            calls = addCurveIntersections(v2, parts[0], c2, c1, locations, include, !flip, recursion, calls, uMin, uMax, tMinNew, t);
            calls = addCurveIntersections(v2, parts[1], c2, c1, locations, include, !flip, recursion, calls, uMin, uMax, t, tMaxNew);
          } else {
            var parts = Curve.subdivide(v2, 0.5),
                u = (uMin + uMax) / 2;
            calls = addCurveIntersections(parts[0], v1, c2, c1, locations, include, !flip, recursion, calls, uMin, u, tMinNew, tMaxNew);
            calls = addCurveIntersections(parts[1], v1, c2, c1, locations, include, !flip, recursion, calls, u, uMax, tMinNew, tMaxNew);
          }
        } else {
          if (uDiff === 0 || uDiff >= fatLineEpsilon) {
            calls = addCurveIntersections(v2, v1, c2, c1, locations, include, !flip, recursion, calls, uMin, uMax, tMinNew, tMaxNew);
          } else {
            calls = addCurveIntersections(v1, v2, c1, c2, locations, include, flip, recursion, calls, tMinNew, tMaxNew, uMin, uMax);
          }
        }
      }

      return calls;
    }

    function getConvexHull(dq0, dq1, dq2, dq3) {
      var p0 = [0, dq0],
          p1 = [1 / 3, dq1],
          p2 = [2 / 3, dq2],
          p3 = [1, dq3],
          dist1 = dq1 - (2 * dq0 + dq3) / 3,
          dist2 = dq2 - (dq0 + 2 * dq3) / 3,
          hull;

      if (dist1 * dist2 < 0) {
        hull = [[p0, p1, p3], [p0, p2, p3]];
      } else {
        var distRatio = dist1 / dist2;
        hull = [distRatio >= 2 ? [p0, p1, p3] : distRatio <= 0.5 ? [p0, p2, p3] : [p0, p1, p2, p3], [p0, p3]];
      }

      return (dist1 || dist2) < 0 ? hull.reverse() : hull;
    }

    function clipConvexHull(hullTop, hullBottom, dMin, dMax) {
      if (hullTop[0][1] < dMin) {
        return clipConvexHullPart(hullTop, true, dMin);
      } else if (hullBottom[0][1] > dMax) {
        return clipConvexHullPart(hullBottom, false, dMax);
      } else {
        return hullTop[0][0];
      }
    }

    function clipConvexHullPart(part, top, threshold) {
      var px = part[0][0],
          py = part[0][1];

      for (var i = 1, l = part.length; i < l; i++) {
        var qx = part[i][0],
            qy = part[i][1];

        if (top ? qy >= threshold : qy <= threshold) {
          return qy === threshold ? qx : px + (threshold - py) * (qx - px) / (qy - py);
        }

        px = qx;
        py = qy;
      }

      return null;
    }

    function getCurveLineIntersections(v, px, py, vx, vy) {
      var isZero = Numerical.isZero;

      if (isZero(vx) && isZero(vy)) {
        var t = Curve.getTimeOf(v, new Point(px, py));
        return t === null ? [] : [t];
      }

      var angle = Math.atan2(-vy, vx),
          sin = Math.sin(angle),
          cos = Math.cos(angle),
          rv = [],
          roots = [];

      for (var i = 0; i < 8; i += 2) {
        var x = v[i] - px,
            y = v[i + 1] - py;
        rv.push(x * cos - y * sin, x * sin + y * cos);
      }

      Curve.solveCubic(rv, 1, 0, roots, 0, 1);
      return roots;
    }

    function addCurveLineIntersections(v1, v2, c1, c2, locations, include, flip) {
      var x1 = v2[0],
          y1 = v2[1],
          x2 = v2[6],
          y2 = v2[7],
          roots = getCurveLineIntersections(v1, x1, y1, x2 - x1, y2 - y1);

      for (var i = 0, l = roots.length; i < l; i++) {
        var t1 = roots[i],
            p1 = Curve.getPoint(v1, t1),
            t2 = Curve.getTimeOf(v2, p1);

        if (t2 !== null) {
          addLocation(locations, include, flip ? c2 : c1, flip ? t2 : t1, flip ? c1 : c2, flip ? t1 : t2);
        }
      }
    }

    function addLineIntersection(v1, v2, c1, c2, locations, include) {
      var pt = Line.intersect(v1[0], v1[1], v1[6], v1[7], v2[0], v2[1], v2[6], v2[7]);

      if (pt) {
        addLocation(locations, include, c1, Curve.getTimeOf(v1, pt), c2, Curve.getTimeOf(v2, pt));
      }
    }

    function getCurveIntersections(v1, v2, c1, c2, locations, include) {
      var epsilon = 1e-12,
          min = Math.min,
          max = Math.max;

      if (max(v1[0], v1[2], v1[4], v1[6]) + epsilon > min(v2[0], v2[2], v2[4], v2[6]) && min(v1[0], v1[2], v1[4], v1[6]) - epsilon < max(v2[0], v2[2], v2[4], v2[6]) && max(v1[1], v1[3], v1[5], v1[7]) + epsilon > min(v2[1], v2[3], v2[5], v2[7]) && min(v1[1], v1[3], v1[5], v1[7]) - epsilon < max(v2[1], v2[3], v2[5], v2[7])) {
        var overlaps = getOverlaps(v1, v2);

        if (overlaps) {
          for (var i = 0; i < 2; i++) {
            var overlap = overlaps[i];
            addLocation(locations, include, c1, overlap[0], c2, overlap[1], true);
          }
        } else {
          var straight1 = Curve.isStraight(v1),
              straight2 = Curve.isStraight(v2),
              straight = straight1 && straight2,
              flip = straight1 && !straight2,
              before = locations.length;
          (straight ? addLineIntersection : straight1 || straight2 ? addCurveLineIntersections : addCurveIntersections)(flip ? v2 : v1, flip ? v1 : v2, flip ? c2 : c1, flip ? c1 : c2, locations, include, flip, 0, 0, 0, 1, 0, 1);

          if (!straight || locations.length === before) {
            for (var i = 0; i < 4; i++) {
              var t1 = i >> 1,
                  t2 = i & 1,
                  i1 = t1 * 6,
                  i2 = t2 * 6,
                  p1 = new Point(v1[i1], v1[i1 + 1]),
                  p2 = new Point(v2[i2], v2[i2 + 1]);

              if (p1.isClose(p2, epsilon)) {
                addLocation(locations, include, c1, t1, c2, t2);
              }
            }
          }
        }
      }

      return locations;
    }

    function getSelfIntersection(v1, c1, locations, include) {
      var info = Curve.classify(v1);

      if (info.type === 'loop') {
        var roots = info.roots;
        addLocation(locations, include, c1, roots[0], c1, roots[1]);
      }

      return locations;
    }

    function getIntersections(curves1, curves2, include, matrix1, matrix2, _returnFirst) {
      var epsilon = 1e-7,
          self = !curves2;
      if (self) curves2 = curves1;
      var length1 = curves1.length,
          length2 = curves2.length,
          values1 = new Array(length1),
          values2 = self ? values1 : new Array(length2),
          locations = [];

      for (var i = 0; i < length1; i++) {
        values1[i] = curves1[i].getValues(matrix1);
      }

      if (!self) {
        for (var i = 0; i < length2; i++) {
          values2[i] = curves2[i].getValues(matrix2);
        }
      }

      var boundsCollisions = CollisionDetection.findCurveBoundsCollisions(values1, values2, epsilon);

      for (var index1 = 0; index1 < length1; index1++) {
        var curve1 = curves1[index1],
            v1 = values1[index1];

        if (self) {
          getSelfIntersection(v1, curve1, locations, include);
        }

        var collisions1 = boundsCollisions[index1];

        if (collisions1) {
          for (var j = 0; j < collisions1.length; j++) {
            if (_returnFirst && locations.length) return locations;
            var index2 = collisions1[j];

            if (!self || index2 > index1) {
              var curve2 = curves2[index2],
                  v2 = values2[index2];
              getCurveIntersections(v1, v2, curve1, curve2, locations, include);
            }
          }
        }
      }

      return locations;
    }

    function getOverlaps(v1, v2) {
      function getSquaredLineLength(v) {
        var x = v[6] - v[0],
            y = v[7] - v[1];
        return x * x + y * y;
      }

      var abs = Math.abs,
          getDistance = Line.getDistance,
          timeEpsilon = 1e-8,
          geomEpsilon = 1e-7,
          straight1 = Curve.isStraight(v1),
          straight2 = Curve.isStraight(v2),
          straightBoth = straight1 && straight2,
          flip = getSquaredLineLength(v1) < getSquaredLineLength(v2),
          l1 = flip ? v2 : v1,
          l2 = flip ? v1 : v2,
          px = l1[0],
          py = l1[1],
          vx = l1[6] - px,
          vy = l1[7] - py;

      if (getDistance(px, py, vx, vy, l2[0], l2[1], true) < geomEpsilon && getDistance(px, py, vx, vy, l2[6], l2[7], true) < geomEpsilon) {
        if (!straightBoth && getDistance(px, py, vx, vy, l1[2], l1[3], true) < geomEpsilon && getDistance(px, py, vx, vy, l1[4], l1[5], true) < geomEpsilon && getDistance(px, py, vx, vy, l2[2], l2[3], true) < geomEpsilon && getDistance(px, py, vx, vy, l2[4], l2[5], true) < geomEpsilon) {
          straight1 = straight2 = straightBoth = true;
        }
      } else if (straightBoth) {
        return null;
      }

      if (straight1 ^ straight2) {
        return null;
      }

      var v = [v1, v2],
          pairs = [];

      for (var i = 0; i < 4 && pairs.length < 2; i++) {
        var i1 = i & 1,
            i2 = i1 ^ 1,
            t1 = i >> 1,
            t2 = Curve.getTimeOf(v[i1], new Point(v[i2][t1 ? 6 : 0], v[i2][t1 ? 7 : 1]));

        if (t2 != null) {
          var pair = i1 ? [t1, t2] : [t2, t1];

          if (!pairs.length || abs(pair[0] - pairs[0][0]) > timeEpsilon && abs(pair[1] - pairs[0][1]) > timeEpsilon) {
            pairs.push(pair);
          }
        }

        if (i > 2 && !pairs.length) break;
      }

      if (pairs.length !== 2) {
        pairs = null;
      } else if (!straightBoth) {
        var o1 = Curve.getPart(v1, pairs[0][0], pairs[1][0]),
            o2 = Curve.getPart(v2, pairs[0][1], pairs[1][1]);
        if (abs(o2[2] - o1[2]) > geomEpsilon || abs(o2[3] - o1[3]) > geomEpsilon || abs(o2[4] - o1[4]) > geomEpsilon || abs(o2[5] - o1[5]) > geomEpsilon) pairs = null;
      }

      return pairs;
    }

    function getTimesWithTangent(v, tangent) {
      var x0 = v[0],
          y0 = v[1],
          x1 = v[2],
          y1 = v[3],
          x2 = v[4],
          y2 = v[5],
          x3 = v[6],
          y3 = v[7],
          normalized = tangent.normalize(),
          tx = normalized.x,
          ty = normalized.y,
          ax = 3 * x3 - 9 * x2 + 9 * x1 - 3 * x0,
          ay = 3 * y3 - 9 * y2 + 9 * y1 - 3 * y0,
          bx = 6 * x2 - 12 * x1 + 6 * x0,
          by = 6 * y2 - 12 * y1 + 6 * y0,
          cx = 3 * x1 - 3 * x0,
          cy = 3 * y1 - 3 * y0,
          den = 2 * ax * ty - 2 * ay * tx,
          times = [];

      if (Math.abs(den) < Numerical.CURVETIME_EPSILON) {
        var num = ax * cy - ay * cx,
            den = ax * by - ay * bx;

        if (den != 0) {
          var t = -num / den;
          if (t >= 0 && t <= 1) times.push(t);
        }
      } else {
        var delta = (bx * bx - 4 * ax * cx) * ty * ty + (-2 * bx * by + 4 * ay * cx + 4 * ax * cy) * tx * ty + (by * by - 4 * ay * cy) * tx * tx,
            k = bx * ty - by * tx;

        if (delta >= 0 && den != 0) {
          var d = Math.sqrt(delta),
              t0 = -(k + d) / den,
              t1 = (-k + d) / den;
          if (t0 >= 0 && t0 <= 1) times.push(t0);
          if (t1 >= 0 && t1 <= 1) times.push(t1);
        }
      }

      return times;
    }

    return {
      getIntersections: function getIntersections(curve) {
        var v1 = this.getValues(),
            v2 = curve && curve !== this && curve.getValues();
        return v2 ? getCurveIntersections(v1, v2, this, curve, []) : getSelfIntersection(v1, this, []);
      },
      statics: {
        getOverlaps: getOverlaps,
        getIntersections: getIntersections,
        getCurveLineIntersections: getCurveLineIntersections,
        getTimesWithTangent: getTimesWithTangent
      }
    };
  }());
  var CurveLocation = Base.extend({
    _class: 'CurveLocation',
    initialize: function CurveLocation(curve, time, point, _overlap, _distance) {
      if (time >= 0.99999999) {
        var next = curve.getNext();

        if (next) {
          time = 0;
          curve = next;
        }
      }

      this._setCurve(curve);

      this._time = time;
      this._point = point || curve.getPointAtTime(time);
      this._overlap = _overlap;
      this._distance = _distance;
      this._intersection = this._next = this._previous = null;
    },
    _setPath: function _setPath(path) {
      this._path = path;
      this._version = path ? path._version : 0;
    },
    _setCurve: function _setCurve(curve) {
      this._setPath(curve._path);

      this._curve = curve;
      this._segment = null;
      this._segment1 = curve._segment1;
      this._segment2 = curve._segment2;
    },
    _setSegment: function _setSegment(segment) {
      var curve = segment.getCurve();

      if (curve) {
        this._setCurve(curve);
      } else {
        this._setPath(segment._path);

        this._segment1 = segment;
        this._segment2 = null;
      }

      this._segment = segment;
      this._time = segment === this._segment1 ? 0 : 1;
      this._point = segment._point.clone();
    },
    getSegment: function getSegment() {
      var segment = this._segment;

      if (!segment) {
        var curve = this.getCurve(),
            time = this.getTime();

        if (time === 0) {
          segment = curve._segment1;
        } else if (time === 1) {
          segment = curve._segment2;
        } else if (time != null) {
          segment = curve.getPartLength(0, time) < curve.getPartLength(time, 1) ? curve._segment1 : curve._segment2;
        }

        this._segment = segment;
      }

      return segment;
    },
    getCurve: function getCurve() {
      var path = this._path,
          that = this;

      if (path && path._version !== this._version) {
        this._time = this._offset = this._curveOffset = this._curve = null;
      }

      function trySegment(segment) {
        var curve = segment && segment.getCurve();

        if (curve && (that._time = curve.getTimeOf(that._point)) != null) {
          that._setCurve(curve);

          return curve;
        }
      }

      return this._curve || trySegment(this._segment) || trySegment(this._segment1) || trySegment(this._segment2.getPrevious());
    },
    getPath: function getPath() {
      var curve = this.getCurve();
      return curve && curve._path;
    },
    getIndex: function getIndex() {
      var curve = this.getCurve();
      return curve && curve.getIndex();
    },
    getTime: function getTime() {
      var curve = this.getCurve(),
          time = this._time;
      return curve && time == null ? this._time = curve.getTimeOf(this._point) : time;
    },
    getParameter: '#getTime',
    getPoint: function getPoint() {
      return this._point;
    },
    getOffset: function getOffset() {
      var offset = this._offset;

      if (offset == null) {
        offset = 0;
        var path = this.getPath(),
            index = this.getIndex();

        if (path && index != null) {
          var curves = path.getCurves();

          for (var i = 0; i < index; i++) {
            offset += curves[i].getLength();
          }
        }

        this._offset = offset += this.getCurveOffset();
      }

      return offset;
    },
    getCurveOffset: function getCurveOffset() {
      var offset = this._curveOffset;

      if (offset == null) {
        var curve = this.getCurve(),
            time = this.getTime();
        this._curveOffset = offset = time != null && curve && curve.getPartLength(0, time);
      }

      return offset;
    },
    getIntersection: function getIntersection() {
      return this._intersection;
    },
    getDistance: function getDistance() {
      return this._distance;
    },
    divide: function divide() {
      var curve = this.getCurve(),
          res = curve && curve.divideAtTime(this.getTime());

      if (res) {
        this._setSegment(res._segment1);
      }

      return res;
    },
    split: function split() {
      var curve = this.getCurve(),
          path = curve._path,
          res = curve && curve.splitAtTime(this.getTime());

      if (res) {
        this._setSegment(path.getLastSegment());
      }

      return res;
    },
    equals: function equals(loc, _ignoreOther) {
      var res = this === loc;

      if (!res && loc instanceof CurveLocation) {
        var c1 = this.getCurve(),
            c2 = loc.getCurve(),
            p1 = c1._path,
            p2 = c2._path;

        if (p1 === p2) {
          var abs = Math.abs,
              epsilon = 1e-7,
              diff = abs(this.getOffset() - loc.getOffset()),
              i1 = !_ignoreOther && this._intersection,
              i2 = !_ignoreOther && loc._intersection;
          res = (diff < epsilon || p1 && abs(p1.getLength() - diff) < epsilon) && (!i1 && !i2 || i1 && i2 && i1.equals(i2, true));
        }
      }

      return res;
    },
    toString: function toString() {
      var parts = [],
          point = this.getPoint(),
          f = Formatter.instance;
      if (point) parts.push('point: ' + point);
      var index = this.getIndex();
      if (index != null) parts.push('index: ' + index);
      var time = this.getTime();
      if (time != null) parts.push('time: ' + f.number(time));
      if (this._distance != null) parts.push('distance: ' + f.number(this._distance));
      return '{ ' + parts.join(', ') + ' }';
    },
    isTouching: function isTouching() {
      var inter = this._intersection;

      if (inter && this.getTangent().isCollinear(inter.getTangent())) {
        var curve1 = this.getCurve(),
            curve2 = inter.getCurve();
        return !(curve1.isStraight() && curve2.isStraight() && curve1.getLine().intersect(curve2.getLine()));
      }

      return false;
    },
    isCrossing: function isCrossing() {
      var inter = this._intersection;
      if (!inter) return false;
      var t1 = this.getTime(),
          t2 = inter.getTime(),
          tMin = 1e-8,
          tMax = 1 - tMin,
          t1Inside = t1 >= tMin && t1 <= tMax,
          t2Inside = t2 >= tMin && t2 <= tMax;
      if (t1Inside && t2Inside) return !this.isTouching();
      var c2 = this.getCurve(),
          c1 = c2 && t1 < tMin ? c2.getPrevious() : c2,
          c4 = inter.getCurve(),
          c3 = c4 && t2 < tMin ? c4.getPrevious() : c4;
      if (t1 > tMax) c2 = c2.getNext();
      if (t2 > tMax) c4 = c4.getNext();
      if (!c1 || !c2 || !c3 || !c4) return false;
      var offsets = [];

      function addOffsets(curve, end) {
        var v = curve.getValues(),
            roots = Curve.classify(v).roots || Curve.getPeaks(v),
            count = roots.length,
            offset = Curve.getLength(v, end && count ? roots[count - 1] : 0, !end && count ? roots[0] : 1);
        offsets.push(count ? offset : offset / 32);
      }

      function isInRange(angle, min, max) {
        return min < max ? angle > min && angle < max : angle > min || angle < max;
      }

      if (!t1Inside) {
        addOffsets(c1, true);
        addOffsets(c2, false);
      }

      if (!t2Inside) {
        addOffsets(c3, true);
        addOffsets(c4, false);
      }

      var pt = this.getPoint(),
          offset = Math.min.apply(Math, offsets),
          v2 = t1Inside ? c2.getTangentAtTime(t1) : c2.getPointAt(offset).subtract(pt),
          v1 = t1Inside ? v2.negate() : c1.getPointAt(-offset).subtract(pt),
          v4 = t2Inside ? c4.getTangentAtTime(t2) : c4.getPointAt(offset).subtract(pt),
          v3 = t2Inside ? v4.negate() : c3.getPointAt(-offset).subtract(pt),
          a1 = v1.getAngle(),
          a2 = v2.getAngle(),
          a3 = v3.getAngle(),
          a4 = v4.getAngle();
      return !!(t1Inside ? isInRange(a1, a3, a4) ^ isInRange(a2, a3, a4) && isInRange(a1, a4, a3) ^ isInRange(a2, a4, a3) : isInRange(a3, a1, a2) ^ isInRange(a4, a1, a2) && isInRange(a3, a2, a1) ^ isInRange(a4, a2, a1));
    },
    hasOverlap: function hasOverlap() {
      return !!this._overlap;
    }
  }, Base.each(Curve._evaluateMethods, function (name) {
    var get = name + 'At';

    this[name] = function () {
      var curve = this.getCurve(),
          time = this.getTime();
      return time != null && curve && curve[get](time, true);
    };
  }, {
    preserve: true
  }), new function () {
    function insert(locations, loc, merge) {
      var length = locations.length,
          l = 0,
          r = length - 1;

      function search(index, dir) {
        for (var i = index + dir; i >= -1 && i <= length; i += dir) {
          var loc2 = locations[(i % length + length) % length];
          if (!loc.getPoint().isClose(loc2.getPoint(), 1e-7)) break;
          if (loc.equals(loc2)) return loc2;
        }

        return null;
      }

      while (l <= r) {
        var m = l + r >>> 1,
            loc2 = locations[m],
            found;

        if (merge && (found = loc.equals(loc2) ? loc2 : search(m, -1) || search(m, 1))) {
          if (loc._overlap) {
            found._overlap = found._intersection._overlap = true;
          }

          return found;
        }

        var path1 = loc.getPath(),
            path2 = loc2.getPath(),
            diff = path1 !== path2 ? path1._id - path2._id : loc.getIndex() + loc.getTime() - (loc2.getIndex() + loc2.getTime());

        if (diff < 0) {
          r = m - 1;
        } else {
          l = m + 1;
        }
      }

      locations.splice(l, 0, loc);
      return loc;
    }

    return {
      statics: {
        insert: insert,
        expand: function expand(locations) {
          var expanded = locations.slice();

          for (var i = locations.length - 1; i >= 0; i--) {
            insert(expanded, locations[i]._intersection, false);
          }

          return expanded;
        }
      }
    };
  }());
  var PathItem = Item.extend({
    _class: 'PathItem',
    _selectBounds: false,
    _canScaleStroke: true,
    beans: true,
    initialize: function PathItem() {},
    statics: {
      create: function create(arg) {
        var data, segments, compound;

        if (Base.isPlainObject(arg)) {
          segments = arg.segments;
          data = arg.pathData;
        } else if (Array.isArray(arg)) {
          segments = arg;
        } else if (typeof arg === 'string') {
          data = arg;
        }

        if (segments) {
          var first = segments[0];
          compound = first && Array.isArray(first[0]);
        } else if (data) {
          compound = (data.match(/m/gi) || []).length > 1 || /z\s*\S+/i.test(data);
        }

        var ctor = compound ? CompoundPath : Path;
        return new ctor(arg);
      }
    },
    _asPathItem: function _asPathItem() {
      return this;
    },
    isClockwise: function isClockwise() {
      return this.getArea() >= 0;
    },
    setClockwise: function setClockwise(clockwise) {
      if (this.isClockwise() != (clockwise = !!clockwise)) this.reverse();
    },
    setPathData: function setPathData(data) {
      var parts = data && data.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/ig),
          coords,
          relative = false,
          previous,
          control,
          current = new Point(),
          start = new Point();

      function getCoord(index, coord) {
        var val = +coords[index];
        if (relative) val += current[coord];
        return val;
      }

      function getPoint(index) {
        return new Point(getCoord(index, 'x'), getCoord(index + 1, 'y'));
      }

      this.clear();

      for (var i = 0, l = parts && parts.length; i < l; i++) {
        var part = parts[i],
            command = part[0],
            lower = command.toLowerCase();
        coords = part.match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g);
        var length = coords && coords.length;
        relative = command === lower;
        if (previous === 'z' && !/[mz]/.test(lower)) this.moveTo(current);

        switch (lower) {
          case 'm':
          case 'l':
            var move = lower === 'm';

            for (var j = 0; j < length; j += 2) {
              this[move ? 'moveTo' : 'lineTo'](current = getPoint(j));

              if (move) {
                start = current;
                move = false;
              }
            }

            control = current;
            break;

          case 'h':
          case 'v':
            var coord = lower === 'h' ? 'x' : 'y';
            current = current.clone();

            for (var j = 0; j < length; j++) {
              current[coord] = getCoord(j, coord);
              this.lineTo(current);
            }

            control = current;
            break;

          case 'c':
            for (var j = 0; j < length; j += 6) {
              this.cubicCurveTo(getPoint(j), control = getPoint(j + 2), current = getPoint(j + 4));
            }

            break;

          case 's':
            for (var j = 0; j < length; j += 4) {
              this.cubicCurveTo(/[cs]/.test(previous) ? current.multiply(2).subtract(control) : current, control = getPoint(j), current = getPoint(j + 2));
              previous = lower;
            }

            break;

          case 'q':
            for (var j = 0; j < length; j += 4) {
              this.quadraticCurveTo(control = getPoint(j), current = getPoint(j + 2));
            }

            break;

          case 't':
            for (var j = 0; j < length; j += 2) {
              this.quadraticCurveTo(control = /[qt]/.test(previous) ? current.multiply(2).subtract(control) : current, current = getPoint(j));
              previous = lower;
            }

            break;

          case 'a':
            for (var j = 0; j < length; j += 7) {
              this.arcTo(current = getPoint(j + 5), new Size(+coords[j], +coords[j + 1]), +coords[j + 2], +coords[j + 4], +coords[j + 3]);
            }

            break;

          case 'z':
            this.closePath(1e-12);
            current = start;
            break;
        }

        previous = lower;
      }
    },
    _canComposite: function _canComposite() {
      return !(this.hasFill() && this.hasStroke());
    },
    _contains: function _contains(point) {
      var winding = point.isInside(this.getBounds({
        internal: true,
        handle: true
      })) ? this._getWinding(point) : {};
      return winding.onPath || !!(this.getFillRule() === 'evenodd' ? winding.windingL & 1 || winding.windingR & 1 : winding.winding);
    },
    getIntersections: function getIntersections(path, include, _matrix, _returnFirst) {
      var self = this === path || !path,
          matrix1 = this._matrix._orNullIfIdentity(),
          matrix2 = self ? matrix1 : (_matrix || path._matrix)._orNullIfIdentity();

      return self || this.getBounds(matrix1).intersects(path.getBounds(matrix2), 1e-12) ? Curve.getIntersections(this.getCurves(), !self && path.getCurves(), include, matrix1, matrix2, _returnFirst) : [];
    },
    getCrossings: function getCrossings(path) {
      return this.getIntersections(path, function (inter) {
        return inter.isCrossing();
      });
    },
    getNearestLocation: function getNearestLocation() {
      var point = Point.read(arguments),
          curves = this.getCurves(),
          minDist = Infinity,
          minLoc = null;

      for (var i = 0, l = curves.length; i < l; i++) {
        var loc = curves[i].getNearestLocation(point);

        if (loc._distance < minDist) {
          minDist = loc._distance;
          minLoc = loc;
        }
      }

      return minLoc;
    },
    getNearestPoint: function getNearestPoint() {
      var loc = this.getNearestLocation.apply(this, arguments);
      return loc ? loc.getPoint() : loc;
    },
    interpolate: function interpolate(from, to, factor) {
      var isPath = !this._children,
          name = isPath ? '_segments' : '_children',
          itemsFrom = from[name],
          itemsTo = to[name],
          items = this[name];

      if (!itemsFrom || !itemsTo || itemsFrom.length !== itemsTo.length) {
        throw new Error('Invalid operands in interpolate() call: ' + from + ', ' + to);
      }

      var current = items.length,
          length = itemsTo.length;

      if (current < length) {
        var ctor = isPath ? Segment : Path;

        for (var i = current; i < length; i++) {
          this.add(new ctor());
        }
      } else if (current > length) {
        this[isPath ? 'removeSegments' : 'removeChildren'](length, current);
      }

      for (var i = 0; i < length; i++) {
        items[i].interpolate(itemsFrom[i], itemsTo[i], factor);
      }

      if (isPath) {
        this.setClosed(from._closed);

        this._changed(9);
      }
    },
    compare: function compare(path) {
      var ok = false;

      if (path) {
        var paths1 = this._children || [this],
            paths2 = path._children ? path._children.slice() : [path],
            length1 = paths1.length,
            length2 = paths2.length,
            matched = [],
            count = 0;
        ok = true;
        var boundsOverlaps = CollisionDetection.findItemBoundsCollisions(paths1, paths2, Numerical.GEOMETRIC_EPSILON);

        for (var i1 = length1 - 1; i1 >= 0 && ok; i1--) {
          var path1 = paths1[i1];
          ok = false;
          var pathBoundsOverlaps = boundsOverlaps[i1];

          if (pathBoundsOverlaps) {
            for (var i2 = pathBoundsOverlaps.length - 1; i2 >= 0 && !ok; i2--) {
              if (path1.compare(paths2[pathBoundsOverlaps[i2]])) {
                if (!matched[pathBoundsOverlaps[i2]]) {
                  matched[pathBoundsOverlaps[i2]] = true;
                  count++;
                }

                ok = true;
              }
            }
          }
        }

        ok = ok && count === length2;
      }

      return ok;
    }
  });
  var Path = PathItem.extend({
    _class: 'Path',
    _serializeFields: {
      segments: [],
      closed: false
    },
    initialize: function Path(arg) {
      this._closed = false;
      this._segments = [];
      this._version = 0;
      var args = arguments,
          segments = Array.isArray(arg) ? _typeof(arg[0]) === 'object' ? arg : args : arg && arg.size === undefined && (arg.x !== undefined || arg.point !== undefined) ? args : null;

      if (segments && segments.length > 0) {
        this.setSegments(segments);
      } else {
        this._curves = undefined;
        this._segmentSelection = 0;

        if (!segments && typeof arg === 'string') {
          this.setPathData(arg);
          arg = null;
        }
      }

      this._initialize(!segments && arg);
    },
    _equals: function _equals(item) {
      return this._closed === item._closed && Base.equals(this._segments, item._segments);
    },
    copyContent: function copyContent(source) {
      this.setSegments(source._segments);
      this._closed = source._closed;
    },
    _changed: function _changed(flags) {
      _changed.base.call(this, flags);

      if (flags & 8) {
        this._length = this._area = undefined;

        if (flags & 32) {
          this._version++;
        } else if (this._curves) {
          for (var i = 0, l = this._curves.length; i < l; i++) {
            this._curves[i]._changed();
          }
        }
      } else if (flags & 64) {
        this._bounds = undefined;
      }
    },
    getStyle: function getStyle() {
      var parent = this._parent;
      return (parent instanceof CompoundPath ? parent : this)._style;
    },
    getSegments: function getSegments() {
      return this._segments;
    },
    setSegments: function setSegments(segments) {
      var fullySelected = this.isFullySelected(),
          length = segments && segments.length;
      this._segments.length = 0;
      this._segmentSelection = 0;
      this._curves = undefined;

      if (length) {
        var last = segments[length - 1];

        if (typeof last === 'boolean') {
          this.setClosed(last);
          length--;
        }

        this._add(Segment.readList(segments, 0, {}, length));
      }

      if (fullySelected) this.setFullySelected(true);
    },
    getFirstSegment: function getFirstSegment() {
      return this._segments[0];
    },
    getLastSegment: function getLastSegment() {
      return this._segments[this._segments.length - 1];
    },
    getCurves: function getCurves() {
      var curves = this._curves,
          segments = this._segments;

      if (!curves) {
        var length = this._countCurves();

        curves = this._curves = new Array(length);

        for (var i = 0; i < length; i++) {
          curves[i] = new Curve(this, segments[i], segments[i + 1] || segments[0]);
        }
      }

      return curves;
    },
    getFirstCurve: function getFirstCurve() {
      return this.getCurves()[0];
    },
    getLastCurve: function getLastCurve() {
      var curves = this.getCurves();
      return curves[curves.length - 1];
    },
    isClosed: function isClosed() {
      return this._closed;
    },
    setClosed: function setClosed(closed) {
      if (this._closed != (closed = !!closed)) {
        this._closed = closed;

        if (this._curves) {
          var length = this._curves.length = this._countCurves();

          if (closed) this._curves[length - 1] = new Curve(this, this._segments[length - 1], this._segments[0]);
        }

        this._changed(41);
      }
    }
  }, {
    beans: true,
    getPathData: function getPathData(_matrix, _precision) {
      var segments = this._segments,
          length = segments.length,
          f = new Formatter(_precision),
          coords = new Array(6),
          first = true,
          curX,
          curY,
          prevX,
          prevY,
          inX,
          inY,
          outX,
          outY,
          parts = [];

      function addSegment(segment, skipLine) {
        segment._transformCoordinates(_matrix, coords);

        curX = coords[0];
        curY = coords[1];

        if (first) {
          parts.push('M' + f.pair(curX, curY));
          first = false;
        } else {
          inX = coords[2];
          inY = coords[3];

          if (inX === curX && inY === curY && outX === prevX && outY === prevY) {
            if (!skipLine) {
              var dx = curX - prevX,
                  dy = curY - prevY;
              parts.push(dx === 0 ? 'v' + f.number(dy) : dy === 0 ? 'h' + f.number(dx) : 'l' + f.pair(dx, dy));
            }
          } else {
            parts.push('c' + f.pair(outX - prevX, outY - prevY) + ' ' + f.pair(inX - prevX, inY - prevY) + ' ' + f.pair(curX - prevX, curY - prevY));
          }
        }

        prevX = curX;
        prevY = curY;
        outX = coords[4];
        outY = coords[5];
      }

      if (!length) return '';

      for (var i = 0; i < length; i++) {
        addSegment(segments[i]);
      }

      if (this._closed && length > 0) {
        addSegment(segments[0], true);
        parts.push('z');
      }

      return parts.join('');
    },
    isEmpty: function isEmpty() {
      return !this._segments.length;
    },
    _transformContent: function _transformContent(matrix) {
      var segments = this._segments,
          coords = new Array(6);

      for (var i = 0, l = segments.length; i < l; i++) {
        segments[i]._transformCoordinates(matrix, coords, true);
      }

      return true;
    },
    _add: function _add(segs, index) {
      var segments = this._segments,
          curves = this._curves,
          amount = segs.length,
          append = index == null,
          index = append ? segments.length : index;

      for (var i = 0; i < amount; i++) {
        var segment = segs[i];
        if (segment._path) segment = segs[i] = segment.clone();
        segment._path = this;
        segment._index = index + i;
        if (segment._selection) this._updateSelection(segment, 0, segment._selection);
      }

      if (append) {
        Base.push(segments, segs);
      } else {
        segments.splice.apply(segments, [index, 0].concat(segs));

        for (var i = index + amount, l = segments.length; i < l; i++) {
          segments[i]._index = i;
        }
      }

      if (curves) {
        var total = this._countCurves(),
            start = index > 0 && index + amount - 1 === total ? index - 1 : index,
            insert = start,
            end = Math.min(start + amount, total);

        if (segs._curves) {
          curves.splice.apply(curves, [start, 0].concat(segs._curves));
          insert += segs._curves.length;
        }

        for (var i = insert; i < end; i++) {
          curves.splice(i, 0, new Curve(this, null, null));
        }

        this._adjustCurves(start, end);
      }

      this._changed(41);

      return segs;
    },
    _adjustCurves: function _adjustCurves(start, end) {
      var segments = this._segments,
          curves = this._curves,
          curve;

      for (var i = start; i < end; i++) {
        curve = curves[i];
        curve._path = this;
        curve._segment1 = segments[i];
        curve._segment2 = segments[i + 1] || segments[0];

        curve._changed();
      }

      if (curve = curves[this._closed && !start ? segments.length - 1 : start - 1]) {
        curve._segment2 = segments[start] || segments[0];

        curve._changed();
      }

      if (curve = curves[end]) {
        curve._segment1 = segments[end];

        curve._changed();
      }
    },
    _countCurves: function _countCurves() {
      var length = this._segments.length;
      return !this._closed && length > 0 ? length - 1 : length;
    },
    add: function add(segment1) {
      var args = arguments;
      return args.length > 1 && typeof segment1 !== 'number' ? this._add(Segment.readList(args)) : this._add([Segment.read(args)])[0];
    },
    insert: function insert(index, segment1) {
      var args = arguments;
      return args.length > 2 && typeof segment1 !== 'number' ? this._add(Segment.readList(args, 1), index) : this._add([Segment.read(args, 1)], index)[0];
    },
    addSegment: function addSegment() {
      return this._add([Segment.read(arguments)])[0];
    },
    insertSegment: function insertSegment(index) {
      return this._add([Segment.read(arguments, 1)], index)[0];
    },
    addSegments: function addSegments(segments) {
      return this._add(Segment.readList(segments));
    },
    insertSegments: function insertSegments(index, segments) {
      return this._add(Segment.readList(segments), index);
    },
    removeSegment: function removeSegment(index) {
      return this.removeSegments(index, index + 1)[0] || null;
    },
    removeSegments: function removeSegments(start, end, _includeCurves) {
      start = start || 0;
      end = Base.pick(end, this._segments.length);
      var segments = this._segments,
          curves = this._curves,
          count = segments.length,
          removed = segments.splice(start, end - start),
          amount = removed.length;
      if (!amount) return removed;

      for (var i = 0; i < amount; i++) {
        var segment = removed[i];
        if (segment._selection) this._updateSelection(segment, segment._selection, 0);
        segment._index = segment._path = null;
      }

      for (var i = start, l = segments.length; i < l; i++) {
        segments[i]._index = i;
      }

      if (curves) {
        var index = start > 0 && end === count + (this._closed ? 1 : 0) ? start - 1 : start,
            curves = curves.splice(index, amount);

        for (var i = curves.length - 1; i >= 0; i--) {
          curves[i]._path = null;
        }

        if (_includeCurves) removed._curves = curves.slice(1);

        this._adjustCurves(index, index);
      }

      this._changed(41);

      return removed;
    },
    clear: '#removeSegments',
    hasHandles: function hasHandles() {
      var segments = this._segments;

      for (var i = 0, l = segments.length; i < l; i++) {
        if (segments[i].hasHandles()) return true;
      }

      return false;
    },
    clearHandles: function clearHandles() {
      var segments = this._segments;

      for (var i = 0, l = segments.length; i < l; i++) {
        segments[i].clearHandles();
      }
    },
    getLength: function getLength() {
      if (this._length == null) {
        var curves = this.getCurves(),
            length = 0;

        for (var i = 0, l = curves.length; i < l; i++) {
          length += curves[i].getLength();
        }

        this._length = length;
      }

      return this._length;
    },
    getArea: function getArea() {
      var area = this._area;

      if (area == null) {
        var segments = this._segments,
            closed = this._closed;
        area = 0;

        for (var i = 0, l = segments.length; i < l; i++) {
          var last = i + 1 === l;
          area += Curve.getArea(Curve.getValues(segments[i], segments[last ? 0 : i + 1], null, last && !closed));
        }

        this._area = area;
      }

      return area;
    },
    isFullySelected: function isFullySelected() {
      var length = this._segments.length;
      return this.isSelected() && length > 0 && this._segmentSelection === length * 7;
    },
    setFullySelected: function setFullySelected(selected) {
      if (selected) this._selectSegments(true);
      this.setSelected(selected);
    },
    setSelection: function setSelection(selection) {
      if (!(selection & 1)) this._selectSegments(false);
      setSelection.base.call(this, selection);
    },
    _selectSegments: function _selectSegments(selected) {
      var segments = this._segments,
          length = segments.length,
          selection = selected ? 7 : 0;
      this._segmentSelection = selection * length;

      for (var i = 0; i < length; i++) {
        segments[i]._selection = selection;
      }
    },
    _updateSelection: function _updateSelection(segment, oldSelection, newSelection) {
      segment._selection = newSelection;
      var selection = this._segmentSelection += newSelection - oldSelection;
      if (selection > 0) this.setSelected(true);
    },
    divideAt: function divideAt(location) {
      var loc = this.getLocationAt(location),
          curve;
      return loc && (curve = loc.getCurve().divideAt(loc.getCurveOffset())) ? curve._segment1 : null;
    },
    splitAt: function splitAt(location) {
      var loc = this.getLocationAt(location),
          index = loc && loc.index,
          time = loc && loc.time,
          tMin = 1e-8,
          tMax = 1 - tMin;

      if (time > tMax) {
        index++;
        time = 0;
      }

      var curves = this.getCurves();

      if (index >= 0 && index < curves.length) {
        if (time >= tMin) {
          curves[index++].divideAtTime(time);
        }

        var segs = this.removeSegments(index, this._segments.length, true),
            path;

        if (this._closed) {
          this.setClosed(false);
          path = this;
        } else {
          path = new Path(Item.NO_INSERT);
          path.insertAbove(this);
          path.copyAttributes(this);
        }

        path._add(segs, 0);

        this.addSegment(segs[0]);
        return path;
      }

      return null;
    },
    split: function split(index, time) {
      var curve,
          location = time === undefined ? index : (curve = this.getCurves()[index]) && curve.getLocationAtTime(time);
      return location != null ? this.splitAt(location) : null;
    },
    join: function join(path, tolerance) {
      var epsilon = tolerance || 0;

      if (path && path !== this) {
        var segments = path._segments,
            last1 = this.getLastSegment(),
            last2 = path.getLastSegment();
        if (!last2) return this;
        if (last1 && last1._point.isClose(last2._point, epsilon)) path.reverse();
        var first2 = path.getFirstSegment();

        if (last1 && last1._point.isClose(first2._point, epsilon)) {
          last1.setHandleOut(first2._handleOut);

          this._add(segments.slice(1));
        } else {
          var first1 = this.getFirstSegment();
          if (first1 && first1._point.isClose(first2._point, epsilon)) path.reverse();
          last2 = path.getLastSegment();

          if (first1 && first1._point.isClose(last2._point, epsilon)) {
            first1.setHandleIn(last2._handleIn);

            this._add(segments.slice(0, segments.length - 1), 0);
          } else {
            this._add(segments.slice());
          }
        }

        if (path._closed) this._add([segments[0]]);
        path.remove();
      }

      var first = this.getFirstSegment(),
          last = this.getLastSegment();

      if (first !== last && first._point.isClose(last._point, epsilon)) {
        first.setHandleIn(last._handleIn);
        last.remove();
        this.setClosed(true);
      }

      return this;
    },
    reduce: function reduce(options) {
      var curves = this.getCurves(),
          simplify = options && options.simplify,
          tolerance = simplify ? 1e-7 : 0;

      for (var i = curves.length - 1; i >= 0; i--) {
        var curve = curves[i];
        if (!curve.hasHandles() && (!curve.hasLength(tolerance) || simplify && curve.isCollinear(curve.getNext()))) curve.remove();
      }

      return this;
    },
    reverse: function reverse() {
      this._segments.reverse();

      for (var i = 0, l = this._segments.length; i < l; i++) {
        var segment = this._segments[i];
        var handleIn = segment._handleIn;
        segment._handleIn = segment._handleOut;
        segment._handleOut = handleIn;
        segment._index = i;
      }

      this._curves = null;

      this._changed(9);
    },
    flatten: function flatten(flatness) {
      var flattener = new PathFlattener(this, flatness || 0.25, 256, true),
          parts = flattener.parts,
          length = parts.length,
          segments = [];

      for (var i = 0; i < length; i++) {
        segments.push(new Segment(parts[i].curve.slice(0, 2)));
      }

      if (!this._closed && length > 0) {
        segments.push(new Segment(parts[length - 1].curve.slice(6)));
      }

      this.setSegments(segments);
    },
    simplify: function simplify(tolerance) {
      var segments = new PathFitter(this).fit(tolerance || 2.5);
      if (segments) this.setSegments(segments);
      return !!segments;
    },
    smooth: function smooth(options) {
      var that = this,
          opts = options || {},
          type = opts.type || 'asymmetric',
          segments = this._segments,
          length = segments.length,
          closed = this._closed;

      function getIndex(value, _default) {
        var index = value && value.index;

        if (index != null) {
          var path = value.path;
          if (path && path !== that) throw new Error(value._class + ' ' + index + ' of ' + path + ' is not part of ' + that);
          if (_default && value instanceof Curve) index++;
        } else {
          index = typeof value === 'number' ? value : _default;
        }

        return Math.min(index < 0 && closed ? index % length : index < 0 ? index + length : index, length - 1);
      }

      var loop = closed && opts.from === undefined && opts.to === undefined,
          from = getIndex(opts.from, 0),
          to = getIndex(opts.to, length - 1);

      if (from > to) {
        if (closed) {
          from -= length;
        } else {
          var tmp = from;
          from = to;
          to = tmp;
        }
      }

      if (/^(?:asymmetric|continuous)$/.test(type)) {
        var asymmetric = type === 'asymmetric',
            min = Math.min,
            amount = to - from + 1,
            n = amount - 1,
            padding = loop ? min(amount, 4) : 1,
            paddingLeft = padding,
            paddingRight = padding,
            knots = [];

        if (!closed) {
          paddingLeft = min(1, from);
          paddingRight = min(1, length - to - 1);
        }

        n += paddingLeft + paddingRight;
        if (n <= 1) return;

        for (var i = 0, j = from - paddingLeft; i <= n; i++, j++) {
          knots[i] = segments[(j < 0 ? j + length : j) % length]._point;
        }

        var x = knots[0]._x + 2 * knots[1]._x,
            y = knots[0]._y + 2 * knots[1]._y,
            f = 2,
            n_1 = n - 1,
            rx = [x],
            ry = [y],
            rf = [f],
            px = [],
            py = [];

        for (var i = 1; i < n; i++) {
          var internal = i < n_1,
              a = internal ? 1 : asymmetric ? 1 : 2,
              b = internal ? 4 : asymmetric ? 2 : 7,
              u = internal ? 4 : asymmetric ? 3 : 8,
              v = internal ? 2 : asymmetric ? 0 : 1,
              m = a / f;
          f = rf[i] = b - m;
          x = rx[i] = u * knots[i]._x + v * knots[i + 1]._x - m * x;
          y = ry[i] = u * knots[i]._y + v * knots[i + 1]._y - m * y;
        }

        px[n_1] = rx[n_1] / rf[n_1];
        py[n_1] = ry[n_1] / rf[n_1];

        for (var i = n - 2; i >= 0; i--) {
          px[i] = (rx[i] - px[i + 1]) / rf[i];
          py[i] = (ry[i] - py[i + 1]) / rf[i];
        }

        px[n] = (3 * knots[n]._x - px[n_1]) / 2;
        py[n] = (3 * knots[n]._y - py[n_1]) / 2;

        for (var i = paddingLeft, max = n - paddingRight, j = from; i <= max; i++, j++) {
          var segment = segments[j < 0 ? j + length : j],
              pt = segment._point,
              hx = px[i] - pt._x,
              hy = py[i] - pt._y;
          if (loop || i < max) segment.setHandleOut(hx, hy);
          if (loop || i > paddingLeft) segment.setHandleIn(-hx, -hy);
        }
      } else {
        for (var i = from; i <= to; i++) {
          segments[i < 0 ? i + length : i].smooth(opts, !loop && i === from, !loop && i === to);
        }
      }
    },
    toShape: function toShape(insert) {
      if (!this._closed) return null;
      var segments = this._segments,
          type,
          size,
          radius,
          topCenter;

      function isCollinear(i, j) {
        var seg1 = segments[i],
            seg2 = seg1.getNext(),
            seg3 = segments[j],
            seg4 = seg3.getNext();
        return seg1._handleOut.isZero() && seg2._handleIn.isZero() && seg3._handleOut.isZero() && seg4._handleIn.isZero() && seg2._point.subtract(seg1._point).isCollinear(seg4._point.subtract(seg3._point));
      }

      function isOrthogonal(i) {
        var seg2 = segments[i],
            seg1 = seg2.getPrevious(),
            seg3 = seg2.getNext();
        return seg1._handleOut.isZero() && seg2._handleIn.isZero() && seg2._handleOut.isZero() && seg3._handleIn.isZero() && seg2._point.subtract(seg1._point).isOrthogonal(seg3._point.subtract(seg2._point));
      }

      function isArc(i) {
        var seg1 = segments[i],
            seg2 = seg1.getNext(),
            handle1 = seg1._handleOut,
            handle2 = seg2._handleIn,
            kappa = 0.5522847498307936;

        if (handle1.isOrthogonal(handle2)) {
          var pt1 = seg1._point,
              pt2 = seg2._point,
              corner = new Line(pt1, handle1, true).intersect(new Line(pt2, handle2, true), true);
          return corner && Numerical.isZero(handle1.getLength() / corner.subtract(pt1).getLength() - kappa) && Numerical.isZero(handle2.getLength() / corner.subtract(pt2).getLength() - kappa);
        }

        return false;
      }

      function getDistance(i, j) {
        return segments[i]._point.getDistance(segments[j]._point);
      }

      if (!this.hasHandles() && segments.length === 4 && isCollinear(0, 2) && isCollinear(1, 3) && isOrthogonal(1)) {
        type = Shape.Rectangle;
        size = new Size(getDistance(0, 3), getDistance(0, 1));
        topCenter = segments[1]._point.add(segments[2]._point).divide(2);
      } else if (segments.length === 8 && isArc(0) && isArc(2) && isArc(4) && isArc(6) && isCollinear(1, 5) && isCollinear(3, 7)) {
        type = Shape.Rectangle;
        size = new Size(getDistance(1, 6), getDistance(0, 3));
        radius = size.subtract(new Size(getDistance(0, 7), getDistance(1, 2))).divide(2);
        topCenter = segments[3]._point.add(segments[4]._point).divide(2);
      } else if (segments.length === 4 && isArc(0) && isArc(1) && isArc(2) && isArc(3)) {
        if (Numerical.isZero(getDistance(0, 2) - getDistance(1, 3))) {
          type = Shape.Circle;
          radius = getDistance(0, 2) / 2;
        } else {
          type = Shape.Ellipse;
          radius = new Size(getDistance(2, 0) / 2, getDistance(3, 1) / 2);
        }

        topCenter = segments[1]._point;
      }

      if (type) {
        var center = this.getPosition(true),
            shape = new type({
          center: center,
          size: size,
          radius: radius,
          insert: false
        });
        shape.copyAttributes(this, true);

        shape._matrix.prepend(this._matrix);

        shape.rotate(topCenter.subtract(center).getAngle() + 90);
        if (insert === undefined || insert) shape.insertAbove(this);
        return shape;
      }

      return null;
    },
    toPath: '#clone',
    compare: function compare(path) {
      if (!path || path instanceof CompoundPath) return compare.base.call(this, path);
      var curves1 = this.getCurves(),
          curves2 = path.getCurves(),
          length1 = curves1.length,
          length2 = curves2.length;

      if (!length1 || !length2) {
        return length1 == length2;
      }

      var v1 = curves1[0].getValues(),
          values2 = [],
          pos1 = 0,
          pos2,
          end1 = 0,
          end2;

      for (var i = 0; i < length2; i++) {
        var v2 = curves2[i].getValues();
        values2.push(v2);
        var overlaps = Curve.getOverlaps(v1, v2);

        if (overlaps) {
          pos2 = !i && overlaps[0][0] > 0 ? length2 - 1 : i;
          end2 = overlaps[0][1];
          break;
        }
      }

      var abs = Math.abs,
          epsilon = 1e-8,
          v2 = values2[pos2],
          start2;

      while (v1 && v2) {
        var overlaps = Curve.getOverlaps(v1, v2);

        if (overlaps) {
          var t1 = overlaps[0][0];

          if (abs(t1 - end1) < epsilon) {
            end1 = overlaps[1][0];

            if (end1 === 1) {
              v1 = ++pos1 < length1 ? curves1[pos1].getValues() : null;
              end1 = 0;
            }

            var t2 = overlaps[0][1];

            if (abs(t2 - end2) < epsilon) {
              if (!start2) start2 = [pos2, t2];
              end2 = overlaps[1][1];

              if (end2 === 1) {
                if (++pos2 >= length2) pos2 = 0;
                v2 = values2[pos2] || curves2[pos2].getValues();
                end2 = 0;
              }

              if (!v1) {
                return start2[0] === pos2 && start2[1] === end2;
              }

              continue;
            }
          }
        }

        break;
      }

      return false;
    },
    _hitTestSelf: function _hitTestSelf(point, options, viewMatrix, strokeMatrix) {
      var that = this,
          style = this.getStyle(),
          segments = this._segments,
          numSegments = segments.length,
          closed = this._closed,
          tolerancePadding = options._tolerancePadding,
          strokePadding = tolerancePadding,
          join,
          cap,
          miterLimit,
          area,
          loc,
          res,
          hitStroke = options.stroke && style.hasStroke(),
          hitFill = options.fill && style.hasFill(),
          hitCurves = options.curves,
          strokeRadius = hitStroke ? style.getStrokeWidth() / 2 : hitFill && options.tolerance > 0 || hitCurves ? 0 : null;

      if (strokeRadius !== null) {
        if (strokeRadius > 0) {
          join = style.getStrokeJoin();
          cap = style.getStrokeCap();
          miterLimit = style.getMiterLimit();
          strokePadding = strokePadding.add(Path._getStrokePadding(strokeRadius, strokeMatrix));
        } else {
          join = cap = 'round';
        }
      }

      function isCloseEnough(pt, padding) {
        return point.subtract(pt).divide(padding).length <= 1;
      }

      function checkSegmentPoint(seg, pt, name) {
        if (!options.selected || pt.isSelected()) {
          var anchor = seg._point;
          if (pt !== anchor) pt = pt.add(anchor);

          if (isCloseEnough(pt, strokePadding)) {
            return new HitResult(name, that, {
              segment: seg,
              point: pt
            });
          }
        }
      }

      function checkSegmentPoints(seg, ends) {
        return (ends || options.segments) && checkSegmentPoint(seg, seg._point, 'segment') || !ends && options.handles && (checkSegmentPoint(seg, seg._handleIn, 'handle-in') || checkSegmentPoint(seg, seg._handleOut, 'handle-out'));
      }

      function addToArea(point) {
        area.add(point);
      }

      function checkSegmentStroke(segment) {
        var isJoin = closed || segment._index > 0 && segment._index < numSegments - 1;

        if ((isJoin ? join : cap) === 'round') {
          return isCloseEnough(segment._point, strokePadding);
        } else {
          area = new Path({
            internal: true,
            closed: true
          });

          if (isJoin) {
            if (!segment.isSmooth()) {
              Path._addBevelJoin(segment, join, strokeRadius, miterLimit, null, strokeMatrix, addToArea, true);
            }
          } else if (cap === 'square') {
            Path._addSquareCap(segment, cap, strokeRadius, null, strokeMatrix, addToArea, true);
          }

          if (!area.isEmpty()) {
            var loc;
            return area.contains(point) || (loc = area.getNearestLocation(point)) && isCloseEnough(loc.getPoint(), tolerancePadding);
          }
        }
      }

      if (options.ends && !options.segments && !closed) {
        if (res = checkSegmentPoints(segments[0], true) || checkSegmentPoints(segments[numSegments - 1], true)) return res;
      } else if (options.segments || options.handles) {
        for (var i = 0; i < numSegments; i++) {
          if (res = checkSegmentPoints(segments[i])) return res;
        }
      }

      if (strokeRadius !== null) {
        loc = this.getNearestLocation(point);

        if (loc) {
          var time = loc.getTime();

          if (time === 0 || time === 1 && numSegments > 1) {
            if (!checkSegmentStroke(loc.getSegment())) loc = null;
          } else if (!isCloseEnough(loc.getPoint(), strokePadding)) {
            loc = null;
          }
        }

        if (!loc && join === 'miter' && numSegments > 1) {
          for (var i = 0; i < numSegments; i++) {
            var segment = segments[i];

            if (point.getDistance(segment._point) <= miterLimit * strokeRadius && checkSegmentStroke(segment)) {
              loc = segment.getLocation();
              break;
            }
          }
        }
      }

      return !loc && hitFill && this._contains(point) || loc && !hitStroke && !hitCurves ? new HitResult('fill', this) : loc ? new HitResult(hitStroke ? 'stroke' : 'curve', this, {
        location: loc,
        point: loc.getPoint()
      }) : null;
    }
  }, Base.each(Curve._evaluateMethods, function (name) {
    this[name + 'At'] = function (offset) {
      var loc = this.getLocationAt(offset);
      return loc && loc[name]();
    };
  }, {
    beans: false,
    getLocationOf: function getLocationOf() {
      var point = Point.read(arguments),
          curves = this.getCurves();

      for (var i = 0, l = curves.length; i < l; i++) {
        var loc = curves[i].getLocationOf(point);
        if (loc) return loc;
      }

      return null;
    },
    getOffsetOf: function getOffsetOf() {
      var loc = this.getLocationOf.apply(this, arguments);
      return loc ? loc.getOffset() : null;
    },
    getLocationAt: function getLocationAt(offset) {
      if (typeof offset === 'number') {
        var curves = this.getCurves(),
            length = 0;

        for (var i = 0, l = curves.length; i < l; i++) {
          var start = length,
              curve = curves[i];
          length += curve.getLength();

          if (length > offset) {
            return curve.getLocationAt(offset - start);
          }
        }

        if (curves.length > 0 && offset <= this.getLength()) {
          return new CurveLocation(curves[curves.length - 1], 1);
        }
      } else if (offset && offset.getPath && offset.getPath() === this) {
        return offset;
      }

      return null;
    },
    getOffsetsWithTangent: function getOffsetsWithTangent() {
      var tangent = Point.read(arguments);

      if (tangent.isZero()) {
        return [];
      }

      var offsets = [];
      var curveStart = 0;
      var curves = this.getCurves();

      for (var i = 0, l = curves.length; i < l; i++) {
        var curve = curves[i];
        var curveTimes = curve.getTimesWithTangent(tangent);

        for (var j = 0, m = curveTimes.length; j < m; j++) {
          var offset = curveStart + curve.getOffsetAtTime(curveTimes[j]);

          if (offsets.indexOf(offset) < 0) {
            offsets.push(offset);
          }
        }

        curveStart += curve.length;
      }

      return offsets;
    }
  }), new function () {
    function drawHandles(ctx, segments, matrix, size) {
      if (size <= 0) return;
      var half = size / 2,
          miniSize = size - 2,
          miniHalf = half - 1,
          coords = new Array(6),
          pX,
          pY;

      function drawHandle(index) {
        var hX = coords[index],
            hY = coords[index + 1];

        if (pX != hX || pY != hY) {
          ctx.beginPath();
          ctx.moveTo(pX, pY);
          ctx.lineTo(hX, hY);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(hX, hY, half, 0, Math.PI * 2, true);
          ctx.fill();
        }
      }

      for (var i = 0, l = segments.length; i < l; i++) {
        var segment = segments[i],
            selection = segment._selection;

        segment._transformCoordinates(matrix, coords);

        pX = coords[0];
        pY = coords[1];
        if (selection & 2) drawHandle(2);
        if (selection & 4) drawHandle(4);
        ctx.fillRect(pX - half, pY - half, size, size);

        if (miniSize > 0 && !(selection & 1)) {
          var fillStyle = ctx.fillStyle;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(pX - miniHalf, pY - miniHalf, miniSize, miniSize);
          ctx.fillStyle = fillStyle;
        }
      }
    }

    function drawSegments(ctx, path, matrix) {
      var segments = path._segments,
          length = segments.length,
          coords = new Array(6),
          first = true,
          curX,
          curY,
          prevX,
          prevY,
          inX,
          inY,
          outX,
          outY;

      function drawSegment(segment) {
        if (matrix) {
          segment._transformCoordinates(matrix, coords);

          curX = coords[0];
          curY = coords[1];
        } else {
          var point = segment._point;
          curX = point._x;
          curY = point._y;
        }

        if (first) {
          ctx.moveTo(curX, curY);
          first = false;
        } else {
          if (matrix) {
            inX = coords[2];
            inY = coords[3];
          } else {
            var handle = segment._handleIn;
            inX = curX + handle._x;
            inY = curY + handle._y;
          }

          if (inX === curX && inY === curY && outX === prevX && outY === prevY) {
            ctx.lineTo(curX, curY);
          } else {
            ctx.bezierCurveTo(outX, outY, inX, inY, curX, curY);
          }
        }

        prevX = curX;
        prevY = curY;

        if (matrix) {
          outX = coords[4];
          outY = coords[5];
        } else {
          var handle = segment._handleOut;
          outX = prevX + handle._x;
          outY = prevY + handle._y;
        }
      }

      for (var i = 0; i < length; i++) {
        drawSegment(segments[i]);
      }

      if (path._closed && length > 0) drawSegment(segments[0]);
    }

    return {
      _draw: function _draw(ctx, param, viewMatrix, strokeMatrix) {
        var dontStart = param.dontStart,
            dontPaint = param.dontFinish || param.clip,
            style = this.getStyle(),
            hasFill = style.hasFill(),
            hasStroke = style.hasStroke(),
            dashArray = style.getDashArray(),
            dashLength = !paper.support.nativeDash && hasStroke && dashArray && dashArray.length;
        if (!dontStart) ctx.beginPath();

        if (hasFill || hasStroke && !dashLength || dontPaint) {
          drawSegments(ctx, this, strokeMatrix);
          if (this._closed) ctx.closePath();
        }

        function getOffset(i) {
          return dashArray[(i % dashLength + dashLength) % dashLength];
        }

        if (!dontPaint && (hasFill || hasStroke)) {
          this._setStyles(ctx, param, viewMatrix);

          if (hasFill) {
            ctx.fill(style.getFillRule());
            ctx.shadowColor = 'rgba(0,0,0,0)';
          }

          if (hasStroke) {
            if (dashLength) {
              if (!dontStart) ctx.beginPath();
              var flattener = new PathFlattener(this, 0.25, 32, false, strokeMatrix),
                  length = flattener.length,
                  from = -style.getDashOffset(),
                  to,
                  i = 0;

              while (from > 0) {
                from -= getOffset(i--) + getOffset(i--);
              }

              while (from < length) {
                to = from + getOffset(i++);
                if (from > 0 || to > 0) flattener.drawPart(ctx, Math.max(from, 0), Math.max(to, 0));
                from = to + getOffset(i++);
              }
            }

            ctx.stroke();
          }
        }
      },
      _drawSelected: function _drawSelected(ctx, matrix) {
        ctx.beginPath();
        drawSegments(ctx, this, matrix);
        ctx.stroke();
        drawHandles(ctx, this._segments, matrix, paper.settings.handleSize);
      }
    };
  }(), new function () {
    function getCurrentSegment(that) {
      var segments = that._segments;
      if (!segments.length) throw new Error('Use a moveTo() command first');
      return segments[segments.length - 1];
    }

    return {
      moveTo: function moveTo() {
        var segments = this._segments;
        if (segments.length === 1) this.removeSegment(0);
        if (!segments.length) this._add([new Segment(Point.read(arguments))]);
      },
      moveBy: function moveBy() {
        throw new Error('moveBy() is unsupported on Path items.');
      },
      lineTo: function lineTo() {
        this._add([new Segment(Point.read(arguments))]);
      },
      cubicCurveTo: function cubicCurveTo() {
        var args = arguments,
            handle1 = Point.read(args),
            handle2 = Point.read(args),
            to = Point.read(args),
            current = getCurrentSegment(this);
        current.setHandleOut(handle1.subtract(current._point));

        this._add([new Segment(to, handle2.subtract(to))]);
      },
      quadraticCurveTo: function quadraticCurveTo() {
        var args = arguments,
            handle = Point.read(args),
            to = Point.read(args),
            current = getCurrentSegment(this)._point;

        this.cubicCurveTo(handle.add(current.subtract(handle).multiply(1 / 3)), handle.add(to.subtract(handle).multiply(1 / 3)), to);
      },
      curveTo: function curveTo() {
        var args = arguments,
            through = Point.read(args),
            to = Point.read(args),
            t = Base.pick(Base.read(args), 0.5),
            t1 = 1 - t,
            current = getCurrentSegment(this)._point,
            handle = through.subtract(current.multiply(t1 * t1)).subtract(to.multiply(t * t)).divide(2 * t * t1);

        if (handle.isNaN()) throw new Error('Cannot put a curve through points with parameter = ' + t);
        this.quadraticCurveTo(handle, to);
      },
      arcTo: function arcTo() {
        var args = arguments,
            abs = Math.abs,
            sqrt = Math.sqrt,
            current = getCurrentSegment(this),
            from = current._point,
            to = Point.read(args),
            through,
            peek = Base.peek(args),
            clockwise = Base.pick(peek, true),
            center,
            extent,
            vector,
            matrix;

        if (typeof clockwise === 'boolean') {
          var middle = from.add(to).divide(2),
              through = middle.add(middle.subtract(from).rotate(clockwise ? -90 : 90));
        } else if (Base.remain(args) <= 2) {
          through = to;
          to = Point.read(args);
        } else if (!from.equals(to)) {
          var radius = Size.read(args),
              isZero = Numerical.isZero;
          if (isZero(radius.width) || isZero(radius.height)) return this.lineTo(to);
          var rotation = Base.read(args),
              clockwise = !!Base.read(args),
              large = !!Base.read(args),
              middle = from.add(to).divide(2),
              pt = from.subtract(middle).rotate(-rotation),
              x = pt.x,
              y = pt.y,
              rx = abs(radius.width),
              ry = abs(radius.height),
              rxSq = rx * rx,
              rySq = ry * ry,
              xSq = x * x,
              ySq = y * y;
          var factor = sqrt(xSq / rxSq + ySq / rySq);

          if (factor > 1) {
            rx *= factor;
            ry *= factor;
            rxSq = rx * rx;
            rySq = ry * ry;
          }

          factor = (rxSq * rySq - rxSq * ySq - rySq * xSq) / (rxSq * ySq + rySq * xSq);
          if (abs(factor) < 1e-12) factor = 0;
          if (factor < 0) throw new Error('Cannot create an arc with the given arguments');
          center = new Point(rx * y / ry, -ry * x / rx).multiply((large === clockwise ? -1 : 1) * sqrt(factor)).rotate(rotation).add(middle);
          matrix = new Matrix().translate(center).rotate(rotation).scale(rx, ry);
          vector = matrix._inverseTransform(from);
          extent = vector.getDirectedAngle(matrix._inverseTransform(to));
          if (!clockwise && extent > 0) extent -= 360;else if (clockwise && extent < 0) extent += 360;
        }

        if (through) {
          var l1 = new Line(from.add(through).divide(2), through.subtract(from).rotate(90), true),
              l2 = new Line(through.add(to).divide(2), to.subtract(through).rotate(90), true),
              line = new Line(from, to),
              throughSide = line.getSide(through);
          center = l1.intersect(l2, true);

          if (!center) {
            if (!throughSide) return this.lineTo(to);
            throw new Error('Cannot create an arc with the given arguments');
          }

          vector = from.subtract(center);
          extent = vector.getDirectedAngle(to.subtract(center));
          var centerSide = line.getSide(center, true);

          if (centerSide === 0) {
            extent = throughSide * abs(extent);
          } else if (throughSide === centerSide) {
            extent += extent < 0 ? 360 : -360;
          }
        }

        if (extent) {
          var epsilon = 1e-7,
              ext = abs(extent),
              count = ext >= 360 ? 4 : Math.ceil((ext - epsilon) / 90),
              inc = extent / count,
              half = inc * Math.PI / 360,
              z = 4 / 3 * Math.sin(half) / (1 + Math.cos(half)),
              segments = [];

          for (var i = 0; i <= count; i++) {
            var pt = to,
                out = null;

            if (i < count) {
              out = vector.rotate(90).multiply(z);

              if (matrix) {
                pt = matrix._transformPoint(vector);
                out = matrix._transformPoint(vector.add(out)).subtract(pt);
              } else {
                pt = center.add(vector);
              }
            }

            if (!i) {
              current.setHandleOut(out);
            } else {
              var _in = vector.rotate(-90).multiply(z);

              if (matrix) {
                _in = matrix._transformPoint(vector.add(_in)).subtract(pt);
              }

              segments.push(new Segment(pt, _in, out));
            }

            vector = vector.rotate(inc);
          }

          this._add(segments);
        }
      },
      lineBy: function lineBy() {
        var to = Point.read(arguments),
            current = getCurrentSegment(this)._point;

        this.lineTo(current.add(to));
      },
      curveBy: function curveBy() {
        var args = arguments,
            through = Point.read(args),
            to = Point.read(args),
            parameter = Base.read(args),
            current = getCurrentSegment(this)._point;

        this.curveTo(current.add(through), current.add(to), parameter);
      },
      cubicCurveBy: function cubicCurveBy() {
        var args = arguments,
            handle1 = Point.read(args),
            handle2 = Point.read(args),
            to = Point.read(args),
            current = getCurrentSegment(this)._point;

        this.cubicCurveTo(current.add(handle1), current.add(handle2), current.add(to));
      },
      quadraticCurveBy: function quadraticCurveBy() {
        var args = arguments,
            handle = Point.read(args),
            to = Point.read(args),
            current = getCurrentSegment(this)._point;

        this.quadraticCurveTo(current.add(handle), current.add(to));
      },
      arcBy: function arcBy() {
        var args = arguments,
            current = getCurrentSegment(this)._point,
            point = current.add(Point.read(args)),
            clockwise = Base.pick(Base.peek(args), true);

        if (typeof clockwise === 'boolean') {
          this.arcTo(point, clockwise);
        } else {
          this.arcTo(point, current.add(Point.read(args)));
        }
      },
      closePath: function closePath(tolerance) {
        this.setClosed(true);
        this.join(this, tolerance);
      }
    };
  }(), {
    _getBounds: function _getBounds(matrix, options) {
      var method = options.handle ? 'getHandleBounds' : options.stroke ? 'getStrokeBounds' : 'getBounds';
      return Path[method](this._segments, this._closed, this, matrix, options);
    },
    statics: {
      getBounds: function getBounds(segments, closed, path, matrix, options, strokePadding) {
        var first = segments[0];
        if (!first) return new _Rectangle();

        var coords = new Array(6),
            prevCoords = first._transformCoordinates(matrix, new Array(6)),
            min = prevCoords.slice(0, 2),
            max = min.slice(),
            roots = new Array(2);

        function processSegment(segment) {
          segment._transformCoordinates(matrix, coords);

          for (var i = 0; i < 2; i++) {
            Curve._addBounds(prevCoords[i], prevCoords[i + 4], coords[i + 2], coords[i], i, strokePadding ? strokePadding[i] : 0, min, max, roots);
          }

          var tmp = prevCoords;
          prevCoords = coords;
          coords = tmp;
        }

        for (var i = 1, l = segments.length; i < l; i++) {
          processSegment(segments[i]);
        }

        if (closed) processSegment(first);
        return new _Rectangle(min[0], min[1], max[0] - min[0], max[1] - min[1]);
      },
      getStrokeBounds: function getStrokeBounds(segments, closed, path, matrix, options) {
        var style = path.getStyle(),
            stroke = style.hasStroke(),
            strokeWidth = style.getStrokeWidth(),
            strokeMatrix = stroke && path._getStrokeMatrix(matrix, options),
            strokePadding = stroke && Path._getStrokePadding(strokeWidth, strokeMatrix),
            bounds = Path.getBounds(segments, closed, path, matrix, options, strokePadding);

        if (!stroke) return bounds;
        var strokeRadius = strokeWidth / 2,
            join = style.getStrokeJoin(),
            cap = style.getStrokeCap(),
            miterLimit = style.getMiterLimit(),
            joinBounds = new _Rectangle(new Size(strokePadding));

        function addPoint(point) {
          bounds = bounds.include(point);
        }

        function addRound(segment) {
          bounds = bounds.unite(joinBounds.setCenter(segment._point.transform(matrix)));
        }

        function addJoin(segment, join) {
          if (join === 'round' || segment.isSmooth()) {
            addRound(segment);
          } else {
            Path._addBevelJoin(segment, join, strokeRadius, miterLimit, matrix, strokeMatrix, addPoint);
          }
        }

        function addCap(segment, cap) {
          if (cap === 'round') {
            addRound(segment);
          } else {
            Path._addSquareCap(segment, cap, strokeRadius, matrix, strokeMatrix, addPoint);
          }
        }

        var length = segments.length - (closed ? 0 : 1);

        if (length > 0) {
          for (var i = 1; i < length; i++) {
            addJoin(segments[i], join);
          }

          if (closed) {
            addJoin(segments[0], join);
          } else {
            addCap(segments[0], cap);
            addCap(segments[segments.length - 1], cap);
          }
        }

        return bounds;
      },
      _getStrokePadding: function _getStrokePadding(radius, matrix) {
        if (!matrix) return [radius, radius];
        var hor = new Point(radius, 0).transform(matrix),
            ver = new Point(0, radius).transform(matrix),
            phi = hor.getAngleInRadians(),
            a = hor.getLength(),
            b = ver.getLength();
        var sin = Math.sin(phi),
            cos = Math.cos(phi),
            tan = Math.tan(phi),
            tx = Math.atan2(b * tan, a),
            ty = Math.atan2(b, tan * a);
        return [Math.abs(a * Math.cos(tx) * cos + b * Math.sin(tx) * sin), Math.abs(b * Math.sin(ty) * cos + a * Math.cos(ty) * sin)];
      },
      _addBevelJoin: function _addBevelJoin(segment, join, radius, miterLimit, matrix, strokeMatrix, addPoint, isArea) {
        var curve2 = segment.getCurve(),
            curve1 = curve2.getPrevious(),
            point = curve2.getPoint1().transform(matrix),
            normal1 = curve1.getNormalAtTime(1).multiply(radius).transform(strokeMatrix),
            normal2 = curve2.getNormalAtTime(0).multiply(radius).transform(strokeMatrix),
            angle = normal1.getDirectedAngle(normal2);

        if (angle < 0 || angle >= 180) {
          normal1 = normal1.negate();
          normal2 = normal2.negate();
        }

        if (isArea) addPoint(point);
        addPoint(point.add(normal1));

        if (join === 'miter') {
          var corner = new Line(point.add(normal1), new Point(-normal1.y, normal1.x), true).intersect(new Line(point.add(normal2), new Point(-normal2.y, normal2.x), true), true);

          if (corner && point.getDistance(corner) <= miterLimit * radius) {
            addPoint(corner);
          }
        }

        addPoint(point.add(normal2));
      },
      _addSquareCap: function _addSquareCap(segment, cap, radius, matrix, strokeMatrix, addPoint, isArea) {
        var point = segment._point.transform(matrix),
            loc = segment.getLocation(),
            normal = loc.getNormal().multiply(loc.getTime() === 0 ? radius : -radius).transform(strokeMatrix);

        if (cap === 'square') {
          if (isArea) {
            addPoint(point.subtract(normal));
            addPoint(point.add(normal));
          }

          point = point.add(normal.rotate(-90));
        }

        addPoint(point.add(normal));
        addPoint(point.subtract(normal));
      },
      getHandleBounds: function getHandleBounds(segments, closed, path, matrix, options) {
        var style = path.getStyle(),
            stroke = options.stroke && style.hasStroke(),
            strokePadding,
            joinPadding;

        if (stroke) {
          var strokeMatrix = path._getStrokeMatrix(matrix, options),
              strokeRadius = style.getStrokeWidth() / 2,
              joinRadius = strokeRadius;

          if (style.getStrokeJoin() === 'miter') joinRadius = strokeRadius * style.getMiterLimit();
          if (style.getStrokeCap() === 'square') joinRadius = Math.max(joinRadius, strokeRadius * Math.SQRT2);
          strokePadding = Path._getStrokePadding(strokeRadius, strokeMatrix);
          joinPadding = Path._getStrokePadding(joinRadius, strokeMatrix);
        }

        var coords = new Array(6),
            x1 = Infinity,
            x2 = -x1,
            y1 = x1,
            y2 = x2;

        for (var i = 0, l = segments.length; i < l; i++) {
          var segment = segments[i];

          segment._transformCoordinates(matrix, coords);

          for (var j = 0; j < 6; j += 2) {
            var padding = !j ? joinPadding : strokePadding,
                paddingX = padding ? padding[0] : 0,
                paddingY = padding ? padding[1] : 0,
                x = coords[j],
                y = coords[j + 1],
                xn = x - paddingX,
                xx = x + paddingX,
                yn = y - paddingY,
                yx = y + paddingY;
            if (xn < x1) x1 = xn;
            if (xx > x2) x2 = xx;
            if (yn < y1) y1 = yn;
            if (yx > y2) y2 = yx;
          }
        }

        return new _Rectangle(x1, y1, x2 - x1, y2 - y1);
      }
    }
  });
  Path.inject({
    statics: new function () {
      var kappa = 0.5522847498307936,
          ellipseSegments = [new Segment([-1, 0], [0, kappa], [0, -kappa]), new Segment([0, -1], [-kappa, 0], [kappa, 0]), new Segment([1, 0], [0, -kappa], [0, kappa]), new Segment([0, 1], [kappa, 0], [-kappa, 0])];

      function createPath(segments, closed, args) {
        var props = Base.getNamed(args),
            path = new Path(props && props.insert == false && Item.NO_INSERT);

        path._add(segments);

        path._closed = closed;
        return path.set(props, {
          insert: true
        });
      }

      function createEllipse(center, radius, args) {
        var segments = new Array(4);

        for (var i = 0; i < 4; i++) {
          var segment = ellipseSegments[i];
          segments[i] = new Segment(segment._point.multiply(radius).add(center), segment._handleIn.multiply(radius), segment._handleOut.multiply(radius));
        }

        return createPath(segments, true, args);
      }

      return {
        Line: function Line() {
          var args = arguments;
          return createPath([new Segment(Point.readNamed(args, 'from')), new Segment(Point.readNamed(args, 'to'))], false, args);
        },
        Circle: function Circle() {
          var args = arguments,
              center = Point.readNamed(args, 'center'),
              radius = Base.readNamed(args, 'radius');
          return createEllipse(center, new Size(radius), args);
        },
        Rectangle: function Rectangle() {
          var args = arguments,
              rect = _Rectangle.readNamed(args, 'rectangle'),
              radius = Size.readNamed(args, 'radius', 0, {
            readNull: true
          }),
              bl = rect.getBottomLeft(true),
              tl = rect.getTopLeft(true),
              tr = rect.getTopRight(true),
              br = rect.getBottomRight(true),
              segments;

          if (!radius || radius.isZero()) {
            segments = [new Segment(bl), new Segment(tl), new Segment(tr), new Segment(br)];
          } else {
            radius = Size.min(radius, rect.getSize(true).divide(2));
            var rx = radius.width,
                ry = radius.height,
                hx = rx * kappa,
                hy = ry * kappa;
            segments = [new Segment(bl.add(rx, 0), null, [-hx, 0]), new Segment(bl.subtract(0, ry), [0, hy]), new Segment(tl.add(0, ry), null, [0, -hy]), new Segment(tl.add(rx, 0), [-hx, 0], null), new Segment(tr.subtract(rx, 0), null, [hx, 0]), new Segment(tr.add(0, ry), [0, -hy], null), new Segment(br.subtract(0, ry), null, [0, hy]), new Segment(br.subtract(rx, 0), [hx, 0])];
          }

          return createPath(segments, true, args);
        },
        RoundRectangle: '#Rectangle',
        Ellipse: function Ellipse() {
          var args = arguments,
              ellipse = Shape._readEllipse(args);

          return createEllipse(ellipse.center, ellipse.radius, args);
        },
        Oval: '#Ellipse',
        Arc: function Arc() {
          var args = arguments,
              from = Point.readNamed(args, 'from'),
              through = Point.readNamed(args, 'through'),
              to = Point.readNamed(args, 'to'),
              props = Base.getNamed(args),
              path = new Path(props && props.insert == false && Item.NO_INSERT);
          path.moveTo(from);
          path.arcTo(through, to);
          return path.set(props);
        },
        RegularPolygon: function RegularPolygon() {
          var args = arguments,
              center = Point.readNamed(args, 'center'),
              sides = Base.readNamed(args, 'sides'),
              radius = Base.readNamed(args, 'radius'),
              step = 360 / sides,
              three = sides % 3 === 0,
              vector = new Point(0, three ? -radius : radius),
              offset = three ? -1 : 0.5,
              segments = new Array(sides);

          for (var i = 0; i < sides; i++) {
            segments[i] = new Segment(center.add(vector.rotate((i + offset) * step)));
          }

          return createPath(segments, true, args);
        },
        Star: function Star() {
          var args = arguments,
              center = Point.readNamed(args, 'center'),
              points = Base.readNamed(args, 'points') * 2,
              radius1 = Base.readNamed(args, 'radius1'),
              radius2 = Base.readNamed(args, 'radius2'),
              step = 360 / points,
              vector = new Point(0, -1),
              segments = new Array(points);

          for (var i = 0; i < points; i++) {
            segments[i] = new Segment(center.add(vector.rotate(step * i).multiply(i % 2 ? radius2 : radius1)));
          }

          return createPath(segments, true, args);
        }
      };
    }()
  });
  var CompoundPath = PathItem.extend({
    _class: 'CompoundPath',
    _serializeFields: {
      children: []
    },
    beans: true,
    initialize: function CompoundPath(arg) {
      this._children = [];
      this._namedChildren = {};

      if (!this._initialize(arg)) {
        if (typeof arg === 'string') {
          this.setPathData(arg);
        } else {
          this.addChildren(Array.isArray(arg) ? arg : arguments);
        }
      }
    },
    insertChildren: function insertChildren(index, items) {
      var list = items,
          first = list[0];
      if (first && typeof first[0] === 'number') list = [list];

      for (var i = items.length - 1; i >= 0; i--) {
        var item = list[i];
        if (list === items && !(item instanceof Path)) list = Base.slice(list);

        if (Array.isArray(item)) {
          list[i] = new Path({
            segments: item,
            insert: false
          });
        } else if (item instanceof CompoundPath) {
          list.splice.apply(list, [i, 1].concat(item.removeChildren()));
          item.remove();
        }
      }

      return insertChildren.base.call(this, index, list);
    },
    reduce: function reduce(options) {
      var children = this._children;

      for (var i = children.length - 1; i >= 0; i--) {
        var path = children[i].reduce(options);
        if (path.isEmpty()) path.remove();
      }

      if (!children.length) {
        var path = new Path(Item.NO_INSERT);
        path.copyAttributes(this);
        path.insertAbove(this);
        this.remove();
        return path;
      }

      return reduce.base.call(this);
    },
    isClosed: function isClosed() {
      var children = this._children;

      for (var i = 0, l = children.length; i < l; i++) {
        if (!children[i]._closed) return false;
      }

      return true;
    },
    setClosed: function setClosed(closed) {
      var children = this._children;

      for (var i = 0, l = children.length; i < l; i++) {
        children[i].setClosed(closed);
      }
    },
    getFirstSegment: function getFirstSegment() {
      var first = this.getFirstChild();
      return first && first.getFirstSegment();
    },
    getLastSegment: function getLastSegment() {
      var last = this.getLastChild();
      return last && last.getLastSegment();
    },
    getCurves: function getCurves() {
      var children = this._children,
          curves = [];

      for (var i = 0, l = children.length; i < l; i++) {
        Base.push(curves, children[i].getCurves());
      }

      return curves;
    },
    getFirstCurve: function getFirstCurve() {
      var first = this.getFirstChild();
      return first && first.getFirstCurve();
    },
    getLastCurve: function getLastCurve() {
      var last = this.getLastChild();
      return last && last.getLastCurve();
    },
    getArea: function getArea() {
      var children = this._children,
          area = 0;

      for (var i = 0, l = children.length; i < l; i++) {
        area += children[i].getArea();
      }

      return area;
    },
    getLength: function getLength() {
      var children = this._children,
          length = 0;

      for (var i = 0, l = children.length; i < l; i++) {
        length += children[i].getLength();
      }

      return length;
    },
    getPathData: function getPathData(_matrix, _precision) {
      var children = this._children,
          paths = [];

      for (var i = 0, l = children.length; i < l; i++) {
        var child = children[i],
            mx = child._matrix;
        paths.push(child.getPathData(_matrix && !mx.isIdentity() ? _matrix.appended(mx) : _matrix, _precision));
      }

      return paths.join('');
    },
    _hitTestChildren: function _hitTestChildren(point, options, viewMatrix) {
      return _hitTestChildren.base.call(this, point, options.class === Path || options.type === 'path' ? options : Base.set({}, options, {
        fill: false
      }), viewMatrix);
    },
    _draw: function _draw(ctx, param, viewMatrix, strokeMatrix) {
      var children = this._children;
      if (!children.length) return;
      param = param.extend({
        dontStart: true,
        dontFinish: true
      });
      ctx.beginPath();

      for (var i = 0, l = children.length; i < l; i++) {
        children[i].draw(ctx, param, strokeMatrix);
      }

      if (!param.clip) {
        this._setStyles(ctx, param, viewMatrix);

        var style = this._style;

        if (style.hasFill()) {
          ctx.fill(style.getFillRule());
          ctx.shadowColor = 'rgba(0,0,0,0)';
        }

        if (style.hasStroke()) ctx.stroke();
      }
    },
    _drawSelected: function _drawSelected(ctx, matrix, selectionItems) {
      var children = this._children;

      for (var i = 0, l = children.length; i < l; i++) {
        var child = children[i],
            mx = child._matrix;

        if (!selectionItems[child._id]) {
          child._drawSelected(ctx, mx.isIdentity() ? matrix : matrix.appended(mx));
        }
      }
    }
  }, new function () {
    function getCurrentPath(that, check) {
      var children = that._children;
      if (check && !children.length) throw new Error('Use a moveTo() command first');
      return children[children.length - 1];
    }

    return Base.each(['lineTo', 'cubicCurveTo', 'quadraticCurveTo', 'curveTo', 'arcTo', 'lineBy', 'cubicCurveBy', 'quadraticCurveBy', 'curveBy', 'arcBy'], function (key) {
      this[key] = function () {
        var path = getCurrentPath(this, true);
        path[key].apply(path, arguments);
      };
    }, {
      moveTo: function moveTo() {
        var current = getCurrentPath(this),
            path = current && current.isEmpty() ? current : new Path(Item.NO_INSERT);
        if (path !== current) this.addChild(path);
        path.moveTo.apply(path, arguments);
      },
      moveBy: function moveBy() {
        var current = getCurrentPath(this, true),
            last = current && current.getLastSegment(),
            point = Point.read(arguments);
        this.moveTo(last ? point.add(last._point) : point);
      },
      closePath: function closePath(tolerance) {
        getCurrentPath(this, true).closePath(tolerance);
      }
    });
  }(), Base.each(['reverse', 'flatten', 'simplify', 'smooth'], function (key) {
    this[key] = function (param) {
      var children = this._children,
          res;

      for (var i = 0, l = children.length; i < l; i++) {
        res = children[i][key](param) || res;
      }

      return res;
    };
  }, {}));
  PathItem.inject(new function () {
    var min = Math.min,
        max = Math.max,
        abs = Math.abs,
        operators = {
      unite: {
        '1': true,
        '2': true
      },
      intersect: {
        '2': true
      },
      subtract: {
        '1': true
      },
      exclude: {
        '1': true,
        '-1': true
      }
    };

    function getPaths(path) {
      return path._children || [path];
    }

    function preparePath(path, resolve) {
      var res = path.clone(false).reduce({
        simplify: true
      }).transform(null, true, true);

      if (resolve) {
        var paths = getPaths(res);

        for (var i = 0, l = paths.length; i < l; i++) {
          var path = paths[i];

          if (!path._closed && !path.isEmpty()) {
            path.closePath(1e-12);
            path.getFirstSegment().setHandleIn(0, 0);
            path.getLastSegment().setHandleOut(0, 0);
          }
        }

        res = res.resolveCrossings().reorient(res.getFillRule() === 'nonzero', true);
      }

      return res;
    }

    function createResult(paths, simplify, path1, path2, options) {
      var result = new CompoundPath(Item.NO_INSERT);
      result.addChildren(paths, true);
      result = result.reduce({
        simplify: simplify
      });

      if (!(options && options.insert == false)) {
        result.insertAbove(path2 && path1.isSibling(path2) && path1.getIndex() < path2.getIndex() ? path2 : path1);
      }

      result.copyAttributes(path1, true);
      return result;
    }

    function filterIntersection(inter) {
      return inter.hasOverlap() || inter.isCrossing();
    }

    function traceBoolean(path1, path2, operation, options) {
      if (options && (options.trace == false || options.stroke) && /^(subtract|intersect)$/.test(operation)) return splitBoolean(path1, path2, operation);

      var _path1 = preparePath(path1, true),
          _path2 = path2 && path1 !== path2 && preparePath(path2, true),
          operator = operators[operation];

      operator[operation] = true;
      if (_path2 && (operator.subtract || operator.exclude) ^ (_path2.isClockwise() ^ _path1.isClockwise())) _path2.reverse();

      var crossings = divideLocations(CurveLocation.expand(_path1.getIntersections(_path2, filterIntersection))),
          paths1 = getPaths(_path1),
          paths2 = _path2 && getPaths(_path2),
          segments = [],
          curves = [],
          paths;

      function collectPaths(paths) {
        for (var i = 0, l = paths.length; i < l; i++) {
          var path = paths[i];
          Base.push(segments, path._segments);
          Base.push(curves, path.getCurves());
          path._overlapsOnly = true;
        }
      }

      function getCurves(indices) {
        var list = [];

        for (var i = 0, l = indices && indices.length; i < l; i++) {
          list.push(curves[indices[i]]);
        }

        return list;
      }

      if (crossings.length) {
        collectPaths(paths1);
        if (paths2) collectPaths(paths2);
        var curvesValues = new Array(curves.length);

        for (var i = 0, l = curves.length; i < l; i++) {
          curvesValues[i] = curves[i].getValues();
        }

        var curveCollisions = CollisionDetection.findCurveBoundsCollisions(curvesValues, curvesValues, 0, true);
        var curveCollisionsMap = {};

        for (var i = 0; i < curves.length; i++) {
          var curve = curves[i],
              id = curve._path._id,
              map = curveCollisionsMap[id] = curveCollisionsMap[id] || {};
          map[curve.getIndex()] = {
            hor: getCurves(curveCollisions[i].hor),
            ver: getCurves(curveCollisions[i].ver)
          };
        }

        for (var i = 0, l = crossings.length; i < l; i++) {
          propagateWinding(crossings[i]._segment, _path1, _path2, curveCollisionsMap, operator);
        }

        for (var i = 0, l = segments.length; i < l; i++) {
          var segment = segments[i],
              inter = segment._intersection;

          if (!segment._winding) {
            propagateWinding(segment, _path1, _path2, curveCollisionsMap, operator);
          }

          if (!(inter && inter._overlap)) segment._path._overlapsOnly = false;
        }

        paths = tracePaths(segments, operator);
      } else {
        paths = reorientPaths(paths2 ? paths1.concat(paths2) : paths1.slice(), function (w) {
          return !!operator[w];
        });
      }

      return createResult(paths, true, path1, path2, options);
    }

    function splitBoolean(path1, path2, operation) {
      var _path1 = preparePath(path1),
          _path2 = preparePath(path2),
          crossings = _path1.getIntersections(_path2, filterIntersection),
          subtract = operation === 'subtract',
          divide = operation === 'divide',
          added = {},
          paths = [];

      function addPath(path) {
        if (!added[path._id] && (divide || _path2.contains(path.getPointAt(path.getLength() / 2)) ^ subtract)) {
          paths.unshift(path);
          return added[path._id] = true;
        }
      }

      for (var i = crossings.length - 1; i >= 0; i--) {
        var path = crossings[i].split();

        if (path) {
          if (addPath(path)) path.getFirstSegment().setHandleIn(0, 0);

          _path1.getLastSegment().setHandleOut(0, 0);
        }
      }

      addPath(_path1);
      return createResult(paths, false, path1, path2);
    }

    function linkIntersections(from, to) {
      var prev = from;

      while (prev) {
        if (prev === to) return;
        prev = prev._previous;
      }

      while (from._next && from._next !== to) {
        from = from._next;
      }

      if (!from._next) {
        while (to._previous) {
          to = to._previous;
        }

        from._next = to;
        to._previous = from;
      }
    }

    function clearCurveHandles(curves) {
      for (var i = curves.length - 1; i >= 0; i--) {
        curves[i].clearHandles();
      }
    }

    function reorientPaths(paths, isInside, clockwise) {
      var length = paths && paths.length;

      if (length) {
        var lookup = Base.each(paths, function (path, i) {
          this[path._id] = {
            container: null,
            winding: path.isClockwise() ? 1 : -1,
            index: i
          };
        }, {}),
            sorted = paths.slice().sort(function (a, b) {
          return abs(b.getArea()) - abs(a.getArea());
        }),
            first = sorted[0];
        var collisions = CollisionDetection.findItemBoundsCollisions(sorted, null, Numerical.GEOMETRIC_EPSILON);
        if (clockwise == null) clockwise = first.isClockwise();

        for (var i = 0; i < length; i++) {
          var path1 = sorted[i],
              entry1 = lookup[path1._id],
              containerWinding = 0,
              indices = collisions[i];

          if (indices) {
            var point = null;

            for (var j = indices.length - 1; j >= 0; j--) {
              if (indices[j] < i) {
                point = point || path1.getInteriorPoint();
                var path2 = sorted[indices[j]];

                if (path2.contains(point)) {
                  var entry2 = lookup[path2._id];
                  containerWinding = entry2.winding;
                  entry1.winding += containerWinding;
                  entry1.container = entry2.exclude ? entry2.container : path2;
                  break;
                }
              }
            }
          }

          if (isInside(entry1.winding) === isInside(containerWinding)) {
            entry1.exclude = true;
            paths[entry1.index] = null;
          } else {
            var container = entry1.container;
            path1.setClockwise(container ? !container.isClockwise() : clockwise);
          }
        }
      }

      return paths;
    }

    function divideLocations(locations, include, clearLater) {
      var results = include && [],
          tMin = 1e-8,
          tMax = 1 - tMin,
          clearHandles = false,
          clearCurves = clearLater || [],
          clearLookup = clearLater && {},
          renormalizeLocs,
          prevCurve,
          prevTime;

      function getId(curve) {
        return curve._path._id + '.' + curve._segment1._index;
      }

      for (var i = (clearLater && clearLater.length) - 1; i >= 0; i--) {
        var curve = clearLater[i];
        if (curve._path) clearLookup[getId(curve)] = true;
      }

      for (var i = locations.length - 1; i >= 0; i--) {
        var loc = locations[i],
            time = loc._time,
            origTime = time,
            exclude = include && !include(loc),
            curve = loc._curve,
            segment;

        if (curve) {
          if (curve !== prevCurve) {
            clearHandles = !curve.hasHandles() || clearLookup && clearLookup[getId(curve)];
            renormalizeLocs = [];
            prevTime = null;
            prevCurve = curve;
          } else if (prevTime >= tMin) {
            time /= prevTime;
          }
        }

        if (exclude) {
          if (renormalizeLocs) renormalizeLocs.push(loc);
          continue;
        } else if (include) {
          results.unshift(loc);
        }

        prevTime = origTime;

        if (time < tMin) {
          segment = curve._segment1;
        } else if (time > tMax) {
          segment = curve._segment2;
        } else {
          var newCurve = curve.divideAtTime(time, true);
          if (clearHandles) clearCurves.push(curve, newCurve);
          segment = newCurve._segment1;

          for (var j = renormalizeLocs.length - 1; j >= 0; j--) {
            var l = renormalizeLocs[j];
            l._time = (l._time - time) / (1 - time);
          }
        }

        loc._setSegment(segment);

        var inter = segment._intersection,
            dest = loc._intersection;

        if (inter) {
          linkIntersections(inter, dest);
          var other = inter;

          while (other) {
            linkIntersections(other._intersection, inter);
            other = other._next;
          }
        } else {
          segment._intersection = dest;
        }
      }

      if (!clearLater) clearCurveHandles(clearCurves);
      return results || locations;
    }

    function getWinding(point, curves, dir, closed, dontFlip) {
      var curvesList = Array.isArray(curves) ? curves : curves[dir ? 'hor' : 'ver'];
      var ia = dir ? 1 : 0,
          io = ia ^ 1,
          pv = [point.x, point.y],
          pa = pv[ia],
          po = pv[io],
          windingEpsilon = 1e-9,
          qualityEpsilon = 1e-6,
          paL = pa - windingEpsilon,
          paR = pa + windingEpsilon,
          windingL = 0,
          windingR = 0,
          pathWindingL = 0,
          pathWindingR = 0,
          onPath = false,
          onAnyPath = false,
          quality = 1,
          roots = [],
          vPrev,
          vClose;

      function addWinding(v) {
        var o0 = v[io + 0],
            o3 = v[io + 6];

        if (po < min(o0, o3) || po > max(o0, o3)) {
          return;
        }

        var a0 = v[ia + 0],
            a1 = v[ia + 2],
            a2 = v[ia + 4],
            a3 = v[ia + 6];

        if (o0 === o3) {
          if (a0 < paR && a3 > paL || a3 < paR && a0 > paL) {
            onPath = true;
          }

          return;
        }

        var t = po === o0 ? 0 : po === o3 ? 1 : paL > max(a0, a1, a2, a3) || paR < min(a0, a1, a2, a3) ? 1 : Curve.solveCubic(v, io, po, roots, 0, 1) > 0 ? roots[0] : 1,
            a = t === 0 ? a0 : t === 1 ? a3 : Curve.getPoint(v, t)[dir ? 'y' : 'x'],
            winding = o0 > o3 ? 1 : -1,
            windingPrev = vPrev[io] > vPrev[io + 6] ? 1 : -1,
            a3Prev = vPrev[ia + 6];

        if (po !== o0) {
          if (a < paL) {
            pathWindingL += winding;
          } else if (a > paR) {
            pathWindingR += winding;
          } else {
            onPath = true;
          }

          if (a > pa - qualityEpsilon && a < pa + qualityEpsilon) quality /= 2;
        } else {
          if (winding !== windingPrev) {
            if (a0 < paL) {
              pathWindingL += winding;
            } else if (a0 > paR) {
              pathWindingR += winding;
            }
          } else if (a0 != a3Prev) {
            if (a3Prev < paR && a > paR) {
              pathWindingR += winding;
              onPath = true;
            } else if (a3Prev > paL && a < paL) {
              pathWindingL += winding;
              onPath = true;
            }
          }

          quality /= 4;
        }

        vPrev = v;
        return !dontFlip && a > paL && a < paR && Curve.getTangent(v, t)[dir ? 'x' : 'y'] === 0 && getWinding(point, curves, !dir, closed, true);
      }

      function handleCurve(v) {
        var o0 = v[io + 0],
            o1 = v[io + 2],
            o2 = v[io + 4],
            o3 = v[io + 6];

        if (po <= max(o0, o1, o2, o3) && po >= min(o0, o1, o2, o3)) {
          var a0 = v[ia + 0],
              a1 = v[ia + 2],
              a2 = v[ia + 4],
              a3 = v[ia + 6],
              monoCurves = paL > max(a0, a1, a2, a3) || paR < min(a0, a1, a2, a3) ? [v] : Curve.getMonoCurves(v, dir),
              res;

          for (var i = 0, l = monoCurves.length; i < l; i++) {
            if (res = addWinding(monoCurves[i])) return res;
          }
        }
      }

      for (var i = 0, l = curvesList.length; i < l; i++) {
        var curve = curvesList[i],
            path = curve._path,
            v = curve.getValues(),
            res;

        if (!i || curvesList[i - 1]._path !== path) {
          vPrev = null;

          if (!path._closed) {
            vClose = Curve.getValues(path.getLastCurve().getSegment2(), curve.getSegment1(), null, !closed);

            if (vClose[io] !== vClose[io + 6]) {
              vPrev = vClose;
            }
          }

          if (!vPrev) {
            vPrev = v;
            var prev = path.getLastCurve();

            while (prev && prev !== curve) {
              var v2 = prev.getValues();

              if (v2[io] !== v2[io + 6]) {
                vPrev = v2;
                break;
              }

              prev = prev.getPrevious();
            }
          }
        }

        if (res = handleCurve(v)) return res;

        if (i + 1 === l || curvesList[i + 1]._path !== path) {
          if (vClose && (res = handleCurve(vClose))) return res;

          if (onPath && !pathWindingL && !pathWindingR) {
            pathWindingL = pathWindingR = path.isClockwise(closed) ^ dir ? 1 : -1;
          }

          windingL += pathWindingL;
          windingR += pathWindingR;
          pathWindingL = pathWindingR = 0;

          if (onPath) {
            onAnyPath = true;
            onPath = false;
          }

          vClose = null;
        }
      }

      windingL = abs(windingL);
      windingR = abs(windingR);
      return {
        winding: max(windingL, windingR),
        windingL: windingL,
        windingR: windingR,
        quality: quality,
        onPath: onAnyPath
      };
    }

    function propagateWinding(segment, path1, path2, curveCollisionsMap, operator) {
      var chain = [],
          start = segment,
          totalLength = 0,
          winding;

      do {
        var curve = segment.getCurve();

        if (curve) {
          var length = curve.getLength();
          chain.push({
            segment: segment,
            curve: curve,
            length: length
          });
          totalLength += length;
        }

        segment = segment.getNext();
      } while (segment && !segment._intersection && segment !== start);

      var offsets = [0.5, 0.25, 0.75],
          winding = {
        winding: 0,
        quality: -1
      },
          tMin = 1e-3,
          tMax = 1 - tMin;

      for (var i = 0; i < offsets.length && winding.quality < 0.5; i++) {
        var length = totalLength * offsets[i];

        for (var j = 0, l = chain.length; j < l; j++) {
          var entry = chain[j],
              curveLength = entry.length;

          if (length <= curveLength) {
            var curve = entry.curve,
                path = curve._path,
                parent = path._parent,
                operand = parent instanceof CompoundPath ? parent : path,
                t = Numerical.clamp(curve.getTimeAt(length), tMin, tMax),
                pt = curve.getPointAtTime(t),
                dir = abs(curve.getTangentAtTime(t).y) < Math.SQRT1_2;
            var wind = null;

            if (operator.subtract && path2) {
              var otherPath = operand === path1 ? path2 : path1,
                  pathWinding = otherPath._getWinding(pt, dir, true);

              if (operand === path1 && pathWinding.winding || operand === path2 && !pathWinding.winding) {
                if (pathWinding.quality < 1) {
                  continue;
                } else {
                  wind = {
                    winding: 0,
                    quality: 1
                  };
                }
              }
            }

            wind = wind || getWinding(pt, curveCollisionsMap[path._id][curve.getIndex()], dir, true);
            if (wind.quality > winding.quality) winding = wind;
            break;
          }

          length -= curveLength;
        }
      }

      for (var j = chain.length - 1; j >= 0; j--) {
        chain[j].segment._winding = winding;
      }
    }

    function tracePaths(segments, operator) {
      var paths = [],
          starts;

      function isValid(seg) {
        var winding;
        return !!(seg && !seg._visited && (!operator || operator[(winding = seg._winding || {}).winding] && !(operator.unite && winding.winding === 2 && winding.windingL && winding.windingR)));
      }

      function isStart(seg) {
        if (seg) {
          for (var i = 0, l = starts.length; i < l; i++) {
            if (seg === starts[i]) return true;
          }
        }

        return false;
      }

      function visitPath(path) {
        var segments = path._segments;

        for (var i = 0, l = segments.length; i < l; i++) {
          segments[i]._visited = true;
        }
      }

      function getCrossingSegments(segment, collectStarts) {
        var inter = segment._intersection,
            start = inter,
            crossings = [];
        if (collectStarts) starts = [segment];

        function collect(inter, end) {
          while (inter && inter !== end) {
            var other = inter._segment,
                path = other && other._path;

            if (path) {
              var next = other.getNext() || path.getFirstSegment(),
                  nextInter = next._intersection;

              if (other !== segment && (isStart(other) || isStart(next) || next && isValid(other) && (isValid(next) || nextInter && isValid(nextInter._segment)))) {
                crossings.push(other);
              }

              if (collectStarts) starts.push(other);
            }

            inter = inter._next;
          }
        }

        if (inter) {
          collect(inter);

          while (inter && inter._previous) {
            inter = inter._previous;
          }

          collect(inter, start);
        }

        return crossings;
      }

      segments.sort(function (seg1, seg2) {
        var inter1 = seg1._intersection,
            inter2 = seg2._intersection,
            over1 = !!(inter1 && inter1._overlap),
            over2 = !!(inter2 && inter2._overlap),
            path1 = seg1._path,
            path2 = seg2._path;
        return over1 ^ over2 ? over1 ? 1 : -1 : !inter1 ^ !inter2 ? inter1 ? 1 : -1 : path1 !== path2 ? path1._id - path2._id : seg1._index - seg2._index;
      });

      for (var i = 0, l = segments.length; i < l; i++) {
        var seg = segments[i],
            valid = isValid(seg),
            path = null,
            finished = false,
            closed = true,
            branches = [],
            branch,
            visited,
            handleIn;

        if (valid && seg._path._overlapsOnly) {
          var path1 = seg._path,
              path2 = seg._intersection._segment._path;

          if (path1.compare(path2)) {
            if (path1.getArea()) paths.push(path1.clone(false));
            visitPath(path1);
            visitPath(path2);
            valid = false;
          }
        }

        while (valid) {
          var first = !path,
              crossings = getCrossingSegments(seg, first),
              other = crossings.shift(),
              finished = !first && (isStart(seg) || isStart(other)),
              cross = !finished && other;

          if (first) {
            path = new Path(Item.NO_INSERT);
            branch = null;
          }

          if (finished) {
            if (seg.isFirst() || seg.isLast()) closed = seg._path._closed;
            seg._visited = true;
            break;
          }

          if (cross && branch) {
            branches.push(branch);
            branch = null;
          }

          if (!branch) {
            if (cross) crossings.push(seg);
            branch = {
              start: path._segments.length,
              crossings: crossings,
              visited: visited = [],
              handleIn: handleIn
            };
          }

          if (cross) seg = other;

          if (!isValid(seg)) {
            path.removeSegments(branch.start);

            for (var j = 0, k = visited.length; j < k; j++) {
              visited[j]._visited = false;
            }

            visited.length = 0;

            do {
              seg = branch && branch.crossings.shift();

              if (!seg || !seg._path) {
                seg = null;
                branch = branches.pop();

                if (branch) {
                  visited = branch.visited;
                  handleIn = branch.handleIn;
                }
              }
            } while (branch && !isValid(seg));

            if (!seg) break;
          }

          var next = seg.getNext();
          path.add(new Segment(seg._point, handleIn, next && seg._handleOut));
          seg._visited = true;
          visited.push(seg);
          seg = next || seg._path.getFirstSegment();
          handleIn = next && next._handleIn;
        }

        if (finished) {
          if (closed) {
            path.getFirstSegment().setHandleIn(handleIn);
            path.setClosed(closed);
          }

          if (path.getArea() !== 0) {
            paths.push(path);
          }
        }
      }

      return paths;
    }

    return {
      _getWinding: function _getWinding(point, dir, closed) {
        return getWinding(point, this.getCurves(), dir, closed);
      },
      unite: function unite(path, options) {
        return traceBoolean(this, path, 'unite', options);
      },
      intersect: function intersect(path, options) {
        return traceBoolean(this, path, 'intersect', options);
      },
      subtract: function subtract(path, options) {
        return traceBoolean(this, path, 'subtract', options);
      },
      exclude: function exclude(path, options) {
        return traceBoolean(this, path, 'exclude', options);
      },
      divide: function divide(path, options) {
        return options && (options.trace == false || options.stroke) ? splitBoolean(this, path, 'divide') : createResult([this.subtract(path, options), this.intersect(path, options)], true, this, path, options);
      },
      resolveCrossings: function resolveCrossings() {
        var children = this._children,
            paths = children || [this];

        function hasOverlap(seg, path) {
          var inter = seg && seg._intersection;
          return inter && inter._overlap && inter._path === path;
        }

        var hasOverlaps = false,
            hasCrossings = false,
            intersections = this.getIntersections(null, function (inter) {
          return inter.hasOverlap() && (hasOverlaps = true) || inter.isCrossing() && (hasCrossings = true);
        }),
            clearCurves = hasOverlaps && hasCrossings && [];
        intersections = CurveLocation.expand(intersections);

        if (hasOverlaps) {
          var overlaps = divideLocations(intersections, function (inter) {
            return inter.hasOverlap();
          }, clearCurves);

          for (var i = overlaps.length - 1; i >= 0; i--) {
            var overlap = overlaps[i],
                path = overlap._path,
                seg = overlap._segment,
                prev = seg.getPrevious(),
                next = seg.getNext();

            if (hasOverlap(prev, path) && hasOverlap(next, path)) {
              seg.remove();

              prev._handleOut._set(0, 0);

              next._handleIn._set(0, 0);

              if (prev !== seg && !prev.getCurve().hasLength()) {
                next._handleIn.set(prev._handleIn);

                prev.remove();
              }
            }
          }
        }

        if (hasCrossings) {
          divideLocations(intersections, hasOverlaps && function (inter) {
            var curve1 = inter.getCurve(),
                seg1 = inter.getSegment(),
                other = inter._intersection,
                curve2 = other._curve,
                seg2 = other._segment;
            if (curve1 && curve2 && curve1._path && curve2._path) return true;
            if (seg1) seg1._intersection = null;
            if (seg2) seg2._intersection = null;
          }, clearCurves);
          if (clearCurves) clearCurveHandles(clearCurves);
          paths = tracePaths(Base.each(paths, function (path) {
            Base.push(this, path._segments);
          }, []));
        }

        var length = paths.length,
            item;

        if (length > 1 && children) {
          if (paths !== children) this.setChildren(paths);
          item = this;
        } else if (length === 1 && !children) {
          if (paths[0] !== this) this.setSegments(paths[0].removeSegments());
          item = this;
        }

        if (!item) {
          item = new CompoundPath(Item.NO_INSERT);
          item.addChildren(paths);
          item = item.reduce();
          item.copyAttributes(this);
          this.replaceWith(item);
        }

        return item;
      },
      reorient: function reorient(nonZero, clockwise) {
        var children = this._children;

        if (children && children.length) {
          this.setChildren(reorientPaths(this.removeChildren(), function (w) {
            return !!(nonZero ? w : w & 1);
          }, clockwise));
        } else if (clockwise !== undefined) {
          this.setClockwise(clockwise);
        }

        return this;
      },
      getInteriorPoint: function getInteriorPoint() {
        var bounds = this.getBounds(),
            point = bounds.getCenter(true);

        if (!this.contains(point)) {
          var curves = this.getCurves(),
              y = point.y,
              intercepts = [],
              roots = [];

          for (var i = 0, l = curves.length; i < l; i++) {
            var v = curves[i].getValues(),
                o0 = v[1],
                o1 = v[3],
                o2 = v[5],
                o3 = v[7];

            if (y >= min(o0, o1, o2, o3) && y <= max(o0, o1, o2, o3)) {
              var monoCurves = Curve.getMonoCurves(v);

              for (var j = 0, m = monoCurves.length; j < m; j++) {
                var mv = monoCurves[j],
                    mo0 = mv[1],
                    mo3 = mv[7];

                if (mo0 !== mo3 && (y >= mo0 && y <= mo3 || y >= mo3 && y <= mo0)) {
                  var x = y === mo0 ? mv[0] : y === mo3 ? mv[6] : Curve.solveCubic(mv, 1, y, roots, 0, 1) === 1 ? Curve.getPoint(mv, roots[0]).x : (mv[0] + mv[6]) / 2;
                  intercepts.push(x);
                }
              }
            }
          }

          if (intercepts.length > 1) {
            intercepts.sort(function (a, b) {
              return a - b;
            });
            point.x = (intercepts[0] + intercepts[1]) / 2;
          }
        }

        return point;
      }
    };
  }());
  var PathFlattener = Base.extend({
    _class: 'PathFlattener',
    initialize: function initialize(path, flatness, maxRecursion, ignoreStraight, matrix) {
      var curves = [],
          parts = [],
          length = 0,
          minSpan = 1 / (maxRecursion || 32),
          segments = path._segments,
          segment1 = segments[0],
          segment2;

      function addCurve(segment1, segment2) {
        var curve = Curve.getValues(segment1, segment2, matrix);
        curves.push(curve);
        computeParts(curve, segment1._index, 0, 1);
      }

      function computeParts(curve, index, t1, t2) {
        if (t2 - t1 > minSpan && !(ignoreStraight && Curve.isStraight(curve)) && !Curve.isFlatEnough(curve, flatness || 0.25)) {
          var halves = Curve.subdivide(curve, 0.5),
              tMid = (t1 + t2) / 2;
          computeParts(halves[0], index, t1, tMid);
          computeParts(halves[1], index, tMid, t2);
        } else {
          var dx = curve[6] - curve[0],
              dy = curve[7] - curve[1],
              dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 0) {
            length += dist;
            parts.push({
              offset: length,
              curve: curve,
              index: index,
              time: t2
            });
          }
        }
      }

      for (var i = 1, l = segments.length; i < l; i++) {
        segment2 = segments[i];
        addCurve(segment1, segment2);
        segment1 = segment2;
      }

      if (path._closed) addCurve(segment2 || segment1, segments[0]);
      this.curves = curves;
      this.parts = parts;
      this.length = length;
      this.index = 0;
    },
    _get: function _get(offset) {
      var parts = this.parts,
          length = parts.length,
          start,
          i,
          j = this.index;

      for (;;) {
        i = j;
        if (!j || parts[--j].offset < offset) break;
      }

      for (; i < length; i++) {
        var part = parts[i];

        if (part.offset >= offset) {
          this.index = i;
          var prev = parts[i - 1],
              prevTime = prev && prev.index === part.index ? prev.time : 0,
              prevOffset = prev ? prev.offset : 0;
          return {
            index: part.index,
            time: prevTime + (part.time - prevTime) * (offset - prevOffset) / (part.offset - prevOffset)
          };
        }
      }

      return {
        index: parts[length - 1].index,
        time: 1
      };
    },
    drawPart: function drawPart(ctx, from, to) {
      var start = this._get(from),
          end = this._get(to);

      for (var i = start.index, l = end.index; i <= l; i++) {
        var curve = Curve.getPart(this.curves[i], i === start.index ? start.time : 0, i === end.index ? end.time : 1);
        if (i === start.index) ctx.moveTo(curve[0], curve[1]);
        ctx.bezierCurveTo.apply(ctx, curve.slice(2));
      }
    }
  }, Base.each(Curve._evaluateMethods, function (name) {
    this[name + 'At'] = function (offset) {
      var param = this._get(offset);

      return Curve[name](this.curves[param.index], param.time);
    };
  }, {}));
  var PathFitter = Base.extend({
    initialize: function initialize(path) {
      var points = this.points = [],
          segments = path._segments,
          closed = path._closed;

      for (var i = 0, prev, l = segments.length; i < l; i++) {
        var point = segments[i].point;

        if (!prev || !prev.equals(point)) {
          points.push(prev = point.clone());
        }
      }

      if (closed) {
        points.unshift(points[points.length - 1]);
        points.push(points[1]);
      }

      this.closed = closed;
    },
    fit: function fit(error) {
      var points = this.points,
          length = points.length,
          segments = null;

      if (length > 0) {
        segments = [new Segment(points[0])];

        if (length > 1) {
          this.fitCubic(segments, error, 0, length - 1, points[1].subtract(points[0]), points[length - 2].subtract(points[length - 1]));

          if (this.closed) {
            segments.shift();
            segments.pop();
          }
        }
      }

      return segments;
    },
    fitCubic: function fitCubic(segments, error, first, last, tan1, tan2) {
      var points = this.points;

      if (last - first === 1) {
        var pt1 = points[first],
            pt2 = points[last],
            dist = pt1.getDistance(pt2) / 3;
        this.addCurve(segments, [pt1, pt1.add(tan1.normalize(dist)), pt2.add(tan2.normalize(dist)), pt2]);
        return;
      }

      var uPrime = this.chordLengthParameterize(first, last),
          maxError = Math.max(error, error * error),
          split,
          parametersInOrder = true;

      for (var i = 0; i <= 4; i++) {
        var curve = this.generateBezier(first, last, uPrime, tan1, tan2);
        var max = this.findMaxError(first, last, curve, uPrime);

        if (max.error < error && parametersInOrder) {
          this.addCurve(segments, curve);
          return;
        }

        split = max.index;
        if (max.error >= maxError) break;
        parametersInOrder = this.reparameterize(first, last, uPrime, curve);
        maxError = max.error;
      }

      var tanCenter = points[split - 1].subtract(points[split + 1]);
      this.fitCubic(segments, error, first, split, tan1, tanCenter);
      this.fitCubic(segments, error, split, last, tanCenter.negate(), tan2);
    },
    addCurve: function addCurve(segments, curve) {
      var prev = segments[segments.length - 1];
      prev.setHandleOut(curve[1].subtract(curve[0]));
      segments.push(new Segment(curve[3], curve[2].subtract(curve[3])));
    },
    generateBezier: function generateBezier(first, last, uPrime, tan1, tan2) {
      var epsilon = 1e-12,
          abs = Math.abs,
          points = this.points,
          pt1 = points[first],
          pt2 = points[last],
          C = [[0, 0], [0, 0]],
          X = [0, 0];

      for (var i = 0, l = last - first + 1; i < l; i++) {
        var u = uPrime[i],
            t = 1 - u,
            b = 3 * u * t,
            b0 = t * t * t,
            b1 = b * t,
            b2 = b * u,
            b3 = u * u * u,
            a1 = tan1.normalize(b1),
            a2 = tan2.normalize(b2),
            tmp = points[first + i].subtract(pt1.multiply(b0 + b1)).subtract(pt2.multiply(b2 + b3));
        C[0][0] += a1.dot(a1);
        C[0][1] += a1.dot(a2);
        C[1][0] = C[0][1];
        C[1][1] += a2.dot(a2);
        X[0] += a1.dot(tmp);
        X[1] += a2.dot(tmp);
      }

      var detC0C1 = C[0][0] * C[1][1] - C[1][0] * C[0][1],
          alpha1,
          alpha2;

      if (abs(detC0C1) > epsilon) {
        var detC0X = C[0][0] * X[1] - C[1][0] * X[0],
            detXC1 = X[0] * C[1][1] - X[1] * C[0][1];
        alpha1 = detXC1 / detC0C1;
        alpha2 = detC0X / detC0C1;
      } else {
        var c0 = C[0][0] + C[0][1],
            c1 = C[1][0] + C[1][1];
        alpha1 = alpha2 = abs(c0) > epsilon ? X[0] / c0 : abs(c1) > epsilon ? X[1] / c1 : 0;
      }

      var segLength = pt2.getDistance(pt1),
          eps = epsilon * segLength,
          handle1,
          handle2;

      if (alpha1 < eps || alpha2 < eps) {
        alpha1 = alpha2 = segLength / 3;
      } else {
        var line = pt2.subtract(pt1);
        handle1 = tan1.normalize(alpha1);
        handle2 = tan2.normalize(alpha2);

        if (handle1.dot(line) - handle2.dot(line) > segLength * segLength) {
          alpha1 = alpha2 = segLength / 3;
          handle1 = handle2 = null;
        }
      }

      return [pt1, pt1.add(handle1 || tan1.normalize(alpha1)), pt2.add(handle2 || tan2.normalize(alpha2)), pt2];
    },
    reparameterize: function reparameterize(first, last, u, curve) {
      for (var i = first; i <= last; i++) {
        u[i - first] = this.findRoot(curve, this.points[i], u[i - first]);
      }

      for (var i = 1, l = u.length; i < l; i++) {
        if (u[i] <= u[i - 1]) return false;
      }

      return true;
    },
    findRoot: function findRoot(curve, point, u) {
      var curve1 = [],
          curve2 = [];

      for (var i = 0; i <= 2; i++) {
        curve1[i] = curve[i + 1].subtract(curve[i]).multiply(3);
      }

      for (var i = 0; i <= 1; i++) {
        curve2[i] = curve1[i + 1].subtract(curve1[i]).multiply(2);
      }

      var pt = this.evaluate(3, curve, u),
          pt1 = this.evaluate(2, curve1, u),
          pt2 = this.evaluate(1, curve2, u),
          diff = pt.subtract(point),
          df = pt1.dot(pt1) + diff.dot(pt2);
      return Numerical.isMachineZero(df) ? u : u - diff.dot(pt1) / df;
    },
    evaluate: function evaluate(degree, curve, t) {
      var tmp = curve.slice();

      for (var i = 1; i <= degree; i++) {
        for (var j = 0; j <= degree - i; j++) {
          tmp[j] = tmp[j].multiply(1 - t).add(tmp[j + 1].multiply(t));
        }
      }

      return tmp[0];
    },
    chordLengthParameterize: function chordLengthParameterize(first, last) {
      var u = [0];

      for (var i = first + 1; i <= last; i++) {
        u[i - first] = u[i - first - 1] + this.points[i].getDistance(this.points[i - 1]);
      }

      for (var i = 1, m = last - first; i <= m; i++) {
        u[i] /= u[m];
      }

      return u;
    },
    findMaxError: function findMaxError(first, last, curve, u) {
      var index = Math.floor((last - first + 1) / 2),
          maxDist = 0;

      for (var i = first + 1; i < last; i++) {
        var P = this.evaluate(3, curve, u[i - first]);
        var v = P.subtract(this.points[i]);
        var dist = v.x * v.x + v.y * v.y;

        if (dist >= maxDist) {
          maxDist = dist;
          index = i;
        }
      }

      return {
        error: maxDist,
        index: index
      };
    }
  });
  var TextItem = Item.extend({
    _class: 'TextItem',
    _applyMatrix: false,
    _canApplyMatrix: false,
    _serializeFields: {
      content: null
    },
    _boundsOptions: {
      stroke: false,
      handle: false
    },
    initialize: function TextItem(arg) {
      this._content = '';
      this._lines = [];
      var hasProps = arg && Base.isPlainObject(arg) && arg.x === undefined && arg.y === undefined;

      this._initialize(hasProps && arg, !hasProps && Point.read(arguments));
    },
    _equals: function _equals(item) {
      return this._content === item._content;
    },
    copyContent: function copyContent(source) {
      this.setContent(source._content);
    },
    getContent: function getContent() {
      return this._content;
    },
    setContent: function setContent(content) {
      this._content = '' + content;
      this._lines = this._content.split(/\r\n|\n|\r/mg);

      this._changed(521);
    },
    isEmpty: function isEmpty() {
      return !this._content;
    },
    getCharacterStyle: '#getStyle',
    setCharacterStyle: '#setStyle',
    getParagraphStyle: '#getStyle',
    setParagraphStyle: '#setStyle'
  });
  var PointText = TextItem.extend({
    _class: 'PointText',
    initialize: function PointText() {
      TextItem.apply(this, arguments);
    },
    getPoint: function getPoint() {
      var point = this._matrix.getTranslation();

      return new LinkedPoint(point.x, point.y, this, 'setPoint');
    },
    setPoint: function setPoint() {
      var point = Point.read(arguments);
      this.translate(point.subtract(this._matrix.getTranslation()));
    },
    _draw: function _draw(ctx, param, viewMatrix) {
      if (!this._content) return;

      this._setStyles(ctx, param, viewMatrix);

      var lines = this._lines,
          style = this._style,
          hasFill = style.hasFill(),
          hasStroke = style.hasStroke(),
          leading = style.getLeading(),
          shadowColor = ctx.shadowColor;
      ctx.font = style.getFontStyle();
      ctx.textAlign = style.getJustification();

      for (var i = 0, l = lines.length; i < l; i++) {
        ctx.shadowColor = shadowColor;
        var line = lines[i];

        if (hasFill) {
          ctx.fillText(line, 0, 0);
          ctx.shadowColor = 'rgba(0,0,0,0)';
        }

        if (hasStroke) ctx.strokeText(line, 0, 0);
        ctx.translate(0, leading);
      }
    },
    _getBounds: function _getBounds(matrix, options) {
      var style = this._style,
          lines = this._lines,
          numLines = lines.length,
          justification = style.getJustification(),
          leading = style.getLeading(),
          width = this.getView().getTextWidth(style.getFontStyle(), lines),
          x = 0;
      if (justification !== 'left') x -= width / (justification === 'center' ? 2 : 1);
      var rect = new _Rectangle(x, numLines ? -0.75 * leading : 0, width, numLines * leading);
      return matrix ? matrix._transformBounds(rect, rect) : rect;
    }
  });
  var Color = Base.extend(new function () {
    var types = {
      gray: ['gray'],
      rgb: ['red', 'green', 'blue'],
      hsb: ['hue', 'saturation', 'brightness'],
      hsl: ['hue', 'saturation', 'lightness'],
      gradient: ['gradient', 'origin', 'destination', 'highlight']
    };
    var componentParsers = {},
        namedColors = {
      transparent: [0, 0, 0, 0]
    },
        colorCtx;

    function fromCSS(string) {
      var match = string.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?$/i) || string.match(/^#([\da-f])([\da-f])([\da-f])([\da-f])?$/i),
          type = 'rgb',
          components;

      if (match) {
        var amount = match[4] ? 4 : 3;
        components = new Array(amount);

        for (var i = 0; i < amount; i++) {
          var value = match[i + 1];
          components[i] = parseInt(value.length == 1 ? value + value : value, 16) / 255;
        }
      } else if (match = string.match(/^(rgb|hsl)a?\((.*)\)$/)) {
        type = match[1];
        components = match[2].trim().split(/[,\s]+/g);
        var isHSL = type === 'hsl';

        for (var i = 0, l = Math.min(components.length, 4); i < l; i++) {
          var component = components[i];
          var value = parseFloat(component);

          if (isHSL) {
            if (i === 0) {
              var unit = component.match(/([a-z]*)$/)[1];
              value *= {
                turn: 360,
                rad: 180 / Math.PI,
                grad: 0.9
              }[unit] || 1;
            } else if (i < 3) {
              value /= 100;
            }
          } else if (i < 3) {
            value /= /%$/.test(component) ? 100 : 255;
          }

          components[i] = value;
        }
      } else {
        var color = namedColors[string];

        if (!color) {
          if (window) {
            if (!colorCtx) {
              colorCtx = CanvasProvider.getContext(1, 1);
              colorCtx.globalCompositeOperation = 'copy';
            }

            colorCtx.fillStyle = 'rgba(0,0,0,0)';
            colorCtx.fillStyle = string;
            colorCtx.fillRect(0, 0, 1, 1);
            var data = colorCtx.getImageData(0, 0, 1, 1).data;
            color = namedColors[string] = [data[0] / 255, data[1] / 255, data[2] / 255];
          } else {
            color = [0, 0, 0];
          }
        }

        components = color.slice();
      }

      return [type, components];
    }

    var hsbIndices = [[0, 3, 1], [2, 0, 1], [1, 0, 3], [1, 2, 0], [3, 1, 0], [0, 1, 2]];
    var converters = {
      'rgb-hsb': function rgbHsb(r, g, b) {
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            delta = max - min,
            h = delta === 0 ? 0 : (max == r ? (g - b) / delta + (g < b ? 6 : 0) : max == g ? (b - r) / delta + 2 : (r - g) / delta + 4) * 60;
        return [h, max === 0 ? 0 : delta / max, max];
      },
      'hsb-rgb': function hsbRgb(h, s, b) {
        h = (h / 60 % 6 + 6) % 6;
        var i = Math.floor(h),
            f = h - i,
            i = hsbIndices[i],
            v = [b, b * (1 - s), b * (1 - s * f), b * (1 - s * (1 - f))];
        return [v[i[0]], v[i[1]], v[i[2]]];
      },
      'rgb-hsl': function rgbHsl(r, g, b) {
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            delta = max - min,
            achromatic = delta === 0,
            h = achromatic ? 0 : (max == r ? (g - b) / delta + (g < b ? 6 : 0) : max == g ? (b - r) / delta + 2 : (r - g) / delta + 4) * 60,
            l = (max + min) / 2,
            s = achromatic ? 0 : l < 0.5 ? delta / (max + min) : delta / (2 - max - min);
        return [h, s, l];
      },
      'hsl-rgb': function hslRgb(h, s, l) {
        h = (h / 360 % 1 + 1) % 1;
        if (s === 0) return [l, l, l];
        var t3s = [h + 1 / 3, h, h - 1 / 3],
            t2 = l < 0.5 ? l * (1 + s) : l + s - l * s,
            t1 = 2 * l - t2,
            c = [];

        for (var i = 0; i < 3; i++) {
          var t3 = t3s[i];
          if (t3 < 0) t3 += 1;
          if (t3 > 1) t3 -= 1;
          c[i] = 6 * t3 < 1 ? t1 + (t2 - t1) * 6 * t3 : 2 * t3 < 1 ? t2 : 3 * t3 < 2 ? t1 + (t2 - t1) * (2 / 3 - t3) * 6 : t1;
        }

        return c;
      },
      'rgb-gray': function rgbGray(r, g, b) {
        return [r * 0.2989 + g * 0.587 + b * 0.114];
      },
      'gray-rgb': function grayRgb(g) {
        return [g, g, g];
      },
      'gray-hsb': function grayHsb(g) {
        return [0, 0, g];
      },
      'gray-hsl': function grayHsl(g) {
        return [0, 0, g];
      },
      'gradient-rgb': function gradientRgb() {
        return [];
      },
      'rgb-gradient': function rgbGradient() {
        return [];
      }
    };
    return Base.each(types, function (properties, type) {
      componentParsers[type] = [];
      Base.each(properties, function (name, index) {
        var part = Base.capitalize(name),
            hasOverlap = /^(hue|saturation)$/.test(name),
            parser = componentParsers[type][index] = type === 'gradient' ? name === 'gradient' ? function (value) {
          var current = this._components[0];
          value = Gradient.read(Array.isArray(value) ? value : arguments, 0, {
            readNull: true
          });

          if (current !== value) {
            if (current) current._removeOwner(this);
            if (value) value._addOwner(this);
          }

          return value;
        } : function () {
          return Point.read(arguments, 0, {
            readNull: name === 'highlight',
            clone: true
          });
        } : function (value) {
          return value == null || isNaN(value) ? 0 : +value;
        };

        this['get' + part] = function () {
          return this._type === type || hasOverlap && /^hs[bl]$/.test(this._type) ? this._components[index] : this._convert(type)[index];
        };

        this['set' + part] = function (value) {
          if (this._type !== type && !(hasOverlap && /^hs[bl]$/.test(this._type))) {
            this._components = this._convert(type);
            this._properties = types[type];
            this._type = type;
          }

          this._components[index] = parser.call(this, value);

          this._changed();
        };
      }, this);
    }, {
      _class: 'Color',
      _readIndex: true,
      initialize: function Color(arg) {
        var args = arguments,
            reading = this.__read,
            read = 0,
            type,
            components,
            alpha,
            values;

        if (Array.isArray(arg)) {
          args = arg;
          arg = args[0];
        }

        var argType = arg != null && _typeof(arg);

        if (argType === 'string' && arg in types) {
          type = arg;
          arg = args[1];

          if (Array.isArray(arg)) {
            components = arg;
            alpha = args[2];
          } else {
            if (reading) read = 1;
            args = Base.slice(args, 1);
            argType = _typeof(arg);
          }
        }

        if (!components) {
          values = argType === 'number' ? args : argType === 'object' && arg.length != null ? arg : null;

          if (values) {
            if (!type) type = values.length >= 3 ? 'rgb' : 'gray';
            var length = types[type].length;
            alpha = values[length];

            if (reading) {
              read += values === arguments ? length + (alpha != null ? 1 : 0) : 1;
            }

            if (values.length > length) values = Base.slice(values, 0, length);
          } else if (argType === 'string') {
            var converted = fromCSS(arg);
            type = converted[0];
            components = converted[1];

            if (components.length === 4) {
              alpha = components[3];
              components.length--;
            }
          } else if (argType === 'object') {
            if (arg.constructor === Color) {
              type = arg._type;
              components = arg._components.slice();
              alpha = arg._alpha;

              if (type === 'gradient') {
                for (var i = 1, l = components.length; i < l; i++) {
                  var point = components[i];
                  if (point) components[i] = point.clone();
                }
              }
            } else if (arg.constructor === Gradient) {
              type = 'gradient';
              values = args;
            } else {
              type = 'hue' in arg ? 'lightness' in arg ? 'hsl' : 'hsb' : 'gradient' in arg || 'stops' in arg || 'radial' in arg ? 'gradient' : 'gray' in arg ? 'gray' : 'rgb';
              var properties = types[type],
                  parsers = componentParsers[type];
              this._components = components = [];

              for (var i = 0, l = properties.length; i < l; i++) {
                var value = arg[properties[i]];

                if (value == null && !i && type === 'gradient' && 'stops' in arg) {
                  value = {
                    stops: arg.stops,
                    radial: arg.radial
                  };
                }

                value = parsers[i].call(this, value);
                if (value != null) components[i] = value;
              }

              alpha = arg.alpha;
            }
          }

          if (reading && type) read = 1;
        }

        this._type = type || 'rgb';

        if (!components) {
          this._components = components = [];
          var parsers = componentParsers[this._type];

          for (var i = 0, l = parsers.length; i < l; i++) {
            var value = parsers[i].call(this, values && values[i]);
            if (value != null) components[i] = value;
          }
        }

        this._components = components;
        this._properties = types[this._type];
        this._alpha = alpha;
        if (reading) this.__read = read;
        return this;
      },
      set: '#initialize',
      _serialize: function _serialize(options, dictionary) {
        var components = this.getComponents();
        return Base.serialize(/^(gray|rgb)$/.test(this._type) ? components : [this._type].concat(components), options, true, dictionary);
      },
      _changed: function _changed() {
        this._canvasStyle = null;

        if (this._owner) {
          if (this._setter) {
            this._owner[this._setter](this);
          } else {
            this._owner._changed(129);
          }
        }
      },
      _convert: function _convert(type) {
        var converter;
        return this._type === type ? this._components.slice() : (converter = converters[this._type + '-' + type]) ? converter.apply(this, this._components) : converters['rgb-' + type].apply(this, converters[this._type + '-rgb'].apply(this, this._components));
      },
      convert: function convert(type) {
        return new Color(type, this._convert(type), this._alpha);
      },
      getType: function getType() {
        return this._type;
      },
      setType: function setType(type) {
        this._components = this._convert(type);
        this._properties = types[type];
        this._type = type;
      },
      getComponents: function getComponents() {
        var components = this._components.slice();

        if (this._alpha != null) components.push(this._alpha);
        return components;
      },
      getAlpha: function getAlpha() {
        return this._alpha != null ? this._alpha : 1;
      },
      setAlpha: function setAlpha(alpha) {
        this._alpha = alpha == null ? null : Math.min(Math.max(alpha, 0), 1);

        this._changed();
      },
      hasAlpha: function hasAlpha() {
        return this._alpha != null;
      },
      equals: function equals(color) {
        var col = Base.isPlainValue(color, true) ? Color.read(arguments) : color;
        return col === this || col && this._class === col._class && this._type === col._type && this.getAlpha() === col.getAlpha() && Base.equals(this._components, col._components) || false;
      },
      toString: function toString() {
        var properties = this._properties,
            parts = [],
            isGradient = this._type === 'gradient',
            f = Formatter.instance;

        for (var i = 0, l = properties.length; i < l; i++) {
          var value = this._components[i];
          if (value != null) parts.push(properties[i] + ': ' + (isGradient ? value : f.number(value)));
        }

        if (this._alpha != null) parts.push('alpha: ' + f.number(this._alpha));
        return '{ ' + parts.join(', ') + ' }';
      },
      toCSS: function toCSS(hex) {
        var components = this._convert('rgb'),
            alpha = hex || this._alpha == null ? 1 : this._alpha;

        function convert(val) {
          return Math.round((val < 0 ? 0 : val > 1 ? 1 : val) * 255);
        }

        components = [convert(components[0]), convert(components[1]), convert(components[2])];
        if (alpha < 1) components.push(alpha < 0 ? 0 : alpha);
        return hex ? '#' + ((1 << 24) + (components[0] << 16) + (components[1] << 8) + components[2]).toString(16).slice(1) : (components.length == 4 ? 'rgba(' : 'rgb(') + components.join(',') + ')';
      },
      toCanvasStyle: function toCanvasStyle(ctx, matrix) {
        if (this._canvasStyle) return this._canvasStyle;
        if (this._type !== 'gradient') return this._canvasStyle = this.toCSS();
        var components = this._components,
            gradient = components[0],
            stops = gradient._stops,
            origin = components[1],
            destination = components[2],
            highlight = components[3],
            inverse = matrix && matrix.inverted(),
            canvasGradient;

        if (inverse) {
          origin = inverse._transformPoint(origin);
          destination = inverse._transformPoint(destination);
          if (highlight) highlight = inverse._transformPoint(highlight);
        }

        if (gradient._radial) {
          var radius = destination.getDistance(origin);

          if (highlight) {
            var vector = highlight.subtract(origin);
            if (vector.getLength() > radius) highlight = origin.add(vector.normalize(radius - 0.1));
          }

          var start = highlight || origin;
          canvasGradient = ctx.createRadialGradient(start.x, start.y, 0, origin.x, origin.y, radius);
        } else {
          canvasGradient = ctx.createLinearGradient(origin.x, origin.y, destination.x, destination.y);
        }

        for (var i = 0, l = stops.length; i < l; i++) {
          var stop = stops[i],
              offset = stop._offset;
          canvasGradient.addColorStop(offset == null ? i / (l - 1) : offset, stop._color.toCanvasStyle());
        }

        return this._canvasStyle = canvasGradient;
      },
      transform: function transform(matrix) {
        if (this._type === 'gradient') {
          var components = this._components;

          for (var i = 1, l = components.length; i < l; i++) {
            var point = components[i];

            matrix._transformPoint(point, point, true);
          }

          this._changed();
        }
      },
      statics: {
        _types: types,
        random: function random() {
          var random = Math.random;
          return new Color(random(), random(), random());
        },
        _setOwner: function _setOwner(color, owner, setter) {
          if (color) {
            if (color._owner && owner && color._owner !== owner) {
              color = color.clone();
            }

            if (!color._owner ^ !owner) {
              color._owner = owner || null;
              color._setter = setter || null;
            }
          }

          return color;
        }
      }
    });
  }(), new function () {
    var operators = {
      add: function add(a, b) {
        return a + b;
      },
      subtract: function subtract(a, b) {
        return a - b;
      },
      multiply: function multiply(a, b) {
        return a * b;
      },
      divide: function divide(a, b) {
        return a / b;
      }
    };
    return Base.each(operators, function (operator, name) {
      this[name] = function (color) {
        color = Color.read(arguments);

        var type = this._type,
            components1 = this._components,
            components2 = color._convert(type);

        for (var i = 0, l = components1.length; i < l; i++) {
          components2[i] = operator(components1[i], components2[i]);
        }

        return new Color(type, components2, this._alpha != null ? operator(this._alpha, color.getAlpha()) : null);
      };
    }, {});
  }());
  var Gradient = Base.extend({
    _class: 'Gradient',
    initialize: function Gradient(stops, radial) {
      this._id = UID.get();

      if (stops && Base.isPlainObject(stops)) {
        this.set(stops);
        stops = radial = null;
      }

      if (this._stops == null) {
        this.setStops(stops || ['white', 'black']);
      }

      if (this._radial == null) {
        this.setRadial(typeof radial === 'string' && radial === 'radial' || radial || false);
      }
    },
    _serialize: function _serialize(options, dictionary) {
      return dictionary.add(this, function () {
        return Base.serialize([this._stops, this._radial], options, true, dictionary);
      });
    },
    _changed: function _changed() {
      for (var i = 0, l = this._owners && this._owners.length; i < l; i++) {
        this._owners[i]._changed();
      }
    },
    _addOwner: function _addOwner(color) {
      if (!this._owners) this._owners = [];

      this._owners.push(color);
    },
    _removeOwner: function _removeOwner(color) {
      var index = this._owners ? this._owners.indexOf(color) : -1;

      if (index != -1) {
        this._owners.splice(index, 1);

        if (!this._owners.length) this._owners = undefined;
      }
    },
    clone: function clone() {
      var stops = [];

      for (var i = 0, l = this._stops.length; i < l; i++) {
        stops[i] = this._stops[i].clone();
      }

      return new Gradient(stops, this._radial);
    },
    getStops: function getStops() {
      return this._stops;
    },
    setStops: function setStops(stops) {
      if (stops.length < 2) {
        throw new Error('Gradient stop list needs to contain at least two stops.');
      }

      var _stops = this._stops;

      if (_stops) {
        for (var i = 0, l = _stops.length; i < l; i++) {
          _stops[i]._owner = undefined;
        }
      }

      _stops = this._stops = GradientStop.readList(stops, 0, {
        clone: true
      });

      for (var i = 0, l = _stops.length; i < l; i++) {
        _stops[i]._owner = this;
      }

      this._changed();
    },
    getRadial: function getRadial() {
      return this._radial;
    },
    setRadial: function setRadial(radial) {
      this._radial = radial;

      this._changed();
    },
    equals: function equals(gradient) {
      if (gradient === this) return true;

      if (gradient && this._class === gradient._class) {
        var stops1 = this._stops,
            stops2 = gradient._stops,
            length = stops1.length;

        if (length === stops2.length) {
          for (var i = 0; i < length; i++) {
            if (!stops1[i].equals(stops2[i])) return false;
          }

          return true;
        }
      }

      return false;
    }
  });
  var GradientStop = Base.extend({
    _class: 'GradientStop',
    initialize: function GradientStop(arg0, arg1) {
      var color = arg0,
          offset = arg1;

      if (_typeof(arg0) === 'object' && arg1 === undefined) {
        if (Array.isArray(arg0) && typeof arg0[0] !== 'number') {
          color = arg0[0];
          offset = arg0[1];
        } else if ('color' in arg0 || 'offset' in arg0 || 'rampPoint' in arg0) {
          color = arg0.color;
          offset = arg0.offset || arg0.rampPoint || 0;
        }
      }

      this.setColor(color);
      this.setOffset(offset);
    },
    clone: function clone() {
      return new GradientStop(this._color.clone(), this._offset);
    },
    _serialize: function _serialize(options, dictionary) {
      var color = this._color,
          offset = this._offset;
      return Base.serialize(offset == null ? [color] : [color, offset], options, true, dictionary);
    },
    _changed: function _changed() {
      if (this._owner) this._owner._changed(129);
    },
    getOffset: function getOffset() {
      return this._offset;
    },
    setOffset: function setOffset(offset) {
      this._offset = offset;

      this._changed();
    },
    getRampPoint: '#getOffset',
    setRampPoint: '#setOffset',
    getColor: function getColor() {
      return this._color;
    },
    setColor: function setColor() {
      Color._setOwner(this._color, null);

      this._color = Color._setOwner(Color.read(arguments, 0), this, 'setColor');

      this._changed();
    },
    equals: function equals(stop) {
      return stop === this || stop && this._class === stop._class && this._color.equals(stop._color) && this._offset == stop._offset || false;
    }
  });
  var Style = Base.extend(new function () {
    var itemDefaults = {
      fillColor: null,
      fillRule: 'nonzero',
      strokeColor: null,
      strokeWidth: 1,
      strokeCap: 'butt',
      strokeJoin: 'miter',
      strokeScaling: true,
      miterLimit: 10,
      dashOffset: 0,
      dashArray: [],
      shadowColor: null,
      shadowBlur: 0,
      shadowOffset: new Point(),
      selectedColor: null
    },
        groupDefaults = Base.set({}, itemDefaults, {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
      fontSize: 12,
      leading: null,
      justification: 'left'
    }),
        textDefaults = Base.set({}, groupDefaults, {
      fillColor: new Color()
    }),
        flags = {
      strokeWidth: 193,
      strokeCap: 193,
      strokeJoin: 193,
      strokeScaling: 201,
      miterLimit: 193,
      fontFamily: 9,
      fontWeight: 9,
      fontSize: 9,
      font: 9,
      leading: 9,
      justification: 9
    },
        item = {
      beans: true
    },
        fields = {
      _class: 'Style',
      beans: true,
      initialize: function Style(style, _owner, _project) {
        this._values = {};
        this._owner = _owner;
        this._project = _owner && _owner._project || _project || paper.project;
        this._defaults = !_owner || _owner instanceof Group ? groupDefaults : _owner instanceof TextItem ? textDefaults : itemDefaults;
        if (style) this.set(style);
      }
    };
    Base.each(groupDefaults, function (value, key) {
      var isColor = /Color$/.test(key),
          isPoint = key === 'shadowOffset',
          part = Base.capitalize(key),
          flag = flags[key],
          set = 'set' + part,
          get = 'get' + part;

      fields[set] = function (value) {
        var owner = this._owner,
            children = owner && owner._children,
            applyToChildren = children && children.length > 0 && !(owner instanceof CompoundPath);

        if (applyToChildren) {
          for (var i = 0, l = children.length; i < l; i++) {
            children[i]._style[set](value);
          }
        }

        if ((key === 'selectedColor' || !applyToChildren) && key in this._defaults) {
          var old = this._values[key];

          if (old !== value) {
            if (isColor) {
              if (old) {
                Color._setOwner(old, null);

                old._canvasStyle = null;
              }

              if (value && value.constructor === Color) {
                value = Color._setOwner(value, owner, applyToChildren && set);
              }
            }

            this._values[key] = value;
            if (owner) owner._changed(flag || 129);
          }
        }
      };

      fields[get] = function (_dontMerge) {
        var owner = this._owner,
            children = owner && owner._children,
            applyToChildren = children && children.length > 0 && !(owner instanceof CompoundPath),
            value;

        if (applyToChildren && !_dontMerge) {
          for (var i = 0, l = children.length; i < l; i++) {
            var childValue = children[i]._style[get]();

            if (!i) {
              value = childValue;
            } else if (!Base.equals(value, childValue)) {
              return undefined;
            }
          }
        } else if (key in this._defaults) {
          var value = this._values[key];

          if (value === undefined) {
            value = this._defaults[key];

            if (value && value.clone) {
              value = value.clone();
            }
          } else {
            var ctor = isColor ? Color : isPoint ? Point : null;

            if (ctor && !(value && value.constructor === ctor)) {
              this._values[key] = value = ctor.read([value], 0, {
                readNull: true,
                clone: true
              });
            }
          }
        }

        if (value && isColor) {
          value = Color._setOwner(value, owner, applyToChildren && set);
        }

        return value;
      };

      item[get] = function (_dontMerge) {
        return this._style[get](_dontMerge);
      };

      item[set] = function (value) {
        this._style[set](value);
      };
    });
    Base.each({
      Font: 'FontFamily',
      WindingRule: 'FillRule'
    }, function (value, key) {
      var get = 'get' + key,
          set = 'set' + key;
      fields[get] = item[get] = '#get' + value;
      fields[set] = item[set] = '#set' + value;
    });
    Item.inject(item);
    return fields;
  }(), {
    set: function set(style) {
      var isStyle = style instanceof Style,
          values = isStyle ? style._values : style;

      if (values) {
        for (var key in values) {
          if (key in this._defaults) {
            var value = values[key];
            this[key] = value && isStyle && value.clone ? value.clone() : value;
          }
        }
      }
    },
    equals: function equals(style) {
      function compare(style1, style2, secondary) {
        var values1 = style1._values,
            values2 = style2._values,
            defaults2 = style2._defaults;

        for (var key in values1) {
          var value1 = values1[key],
              value2 = values2[key];
          if (!(secondary && key in values2) && !Base.equals(value1, value2 === undefined ? defaults2[key] : value2)) return false;
        }

        return true;
      }

      return style === this || style && this._class === style._class && compare(this, style) && compare(style, this, true) || false;
    },
    _dispose: function _dispose() {
      var color;
      color = this.getFillColor();
      if (color) color._canvasStyle = null;
      color = this.getStrokeColor();
      if (color) color._canvasStyle = null;
      color = this.getShadowColor();
      if (color) color._canvasStyle = null;
    },
    hasFill: function hasFill() {
      var color = this.getFillColor();
      return !!color && color.alpha > 0;
    },
    hasStroke: function hasStroke() {
      var color = this.getStrokeColor();
      return !!color && color.alpha > 0 && this.getStrokeWidth() > 0;
    },
    hasShadow: function hasShadow() {
      var color = this.getShadowColor();
      return !!color && color.alpha > 0 && (this.getShadowBlur() > 0 || !this.getShadowOffset().isZero());
    },
    getView: function getView() {
      return this._project._view;
    },
    getFontStyle: function getFontStyle() {
      var fontSize = this.getFontSize();
      return this.getFontWeight() + ' ' + fontSize + (/[a-z]/i.test(fontSize + '') ? ' ' : 'px ') + this.getFontFamily();
    },
    getFont: '#getFontFamily',
    setFont: '#setFontFamily',
    getLeading: function getLeading() {
      var leading = getLeading.base.call(this),
          fontSize = this.getFontSize();
      if (/pt|em|%|px/.test(fontSize)) fontSize = this.getView().getPixelSize(fontSize);
      return leading != null ? leading : fontSize * 1.2;
    }
  });
  var DomElement = new function () {
    function handlePrefix(el, name, set, value) {
      var prefixes = ['', 'webkit', 'moz', 'Moz', 'ms', 'o'],
          suffix = name[0].toUpperCase() + name.substring(1);

      for (var i = 0; i < 6; i++) {
        var prefix = prefixes[i],
            key = prefix ? prefix + suffix : name;

        if (key in el) {
          if (set) {
            el[key] = value;
          } else {
            return el[key];
          }

          break;
        }
      }
    }

    return {
      getStyles: function getStyles(el) {
        var doc = el && el.nodeType !== 9 ? el.ownerDocument : el,
            view = doc && doc.defaultView;
        return view && view.getComputedStyle(el, '');
      },
      getBounds: function getBounds(el, viewport) {
        var doc = el.ownerDocument,
            body = doc.body,
            html = doc.documentElement,
            rect;

        try {
          rect = el.getBoundingClientRect();
        } catch (e) {
          rect = {
            left: 0,
            top: 0,
            width: 0,
            height: 0
          };
        }

        var x = rect.left - (html.clientLeft || body.clientLeft || 0),
            y = rect.top - (html.clientTop || body.clientTop || 0);

        if (!viewport) {
          var view = doc.defaultView;
          x += view.pageXOffset || html.scrollLeft || body.scrollLeft;
          y += view.pageYOffset || html.scrollTop || body.scrollTop;
        }

        return new _Rectangle(x, y, rect.width, rect.height);
      },
      getViewportBounds: function getViewportBounds(el) {
        var doc = el.ownerDocument,
            view = doc.defaultView,
            html = doc.documentElement;
        return new _Rectangle(0, 0, view.innerWidth || html.clientWidth, view.innerHeight || html.clientHeight);
      },
      getOffset: function getOffset(el, viewport) {
        return DomElement.getBounds(el, viewport).getPoint();
      },
      getSize: function getSize(el) {
        return DomElement.getBounds(el, true).getSize();
      },
      isInvisible: function isInvisible(el) {
        return DomElement.getSize(el).equals(new Size(0, 0));
      },
      isInView: function isInView(el) {
        return !DomElement.isInvisible(el) && DomElement.getViewportBounds(el).intersects(DomElement.getBounds(el, true));
      },
      isInserted: function isInserted(el) {
        return document.body.contains(el);
      },
      getPrefixed: function getPrefixed(el, name) {
        return el && handlePrefix(el, name);
      },
      setPrefixed: function setPrefixed(el, name, value) {
        if (_typeof(name) === 'object') {
          for (var key in name) {
            handlePrefix(el, key, true, name[key]);
          }
        } else {
          handlePrefix(el, name, true, value);
        }
      }
    };
  }();
  var DomEvent = {
    add: function add(el, events) {
      if (el) {
        for (var type in events) {
          var func = events[type],
              parts = type.split(/[\s,]+/g);

          for (var i = 0, l = parts.length; i < l; i++) {
            var name = parts[i];
            var options = el === document && (name === 'touchstart' || name === 'touchmove') ? {
              passive: false
            } : false;
            el.addEventListener(name, func, options);
          }
        }
      }
    },
    remove: function remove(el, events) {
      if (el) {
        for (var type in events) {
          var func = events[type],
              parts = type.split(/[\s,]+/g);

          for (var i = 0, l = parts.length; i < l; i++) {
            el.removeEventListener(parts[i], func, false);
          }
        }
      }
    },
    getPoint: function getPoint(event) {
      var pos = event.targetTouches ? event.targetTouches.length ? event.targetTouches[0] : event.changedTouches[0] : event;
      return new Point(pos.pageX || pos.clientX + document.documentElement.scrollLeft, pos.pageY || pos.clientY + document.documentElement.scrollTop);
    },
    getTarget: function getTarget(event) {
      return event.target || event.srcElement;
    },
    getRelatedTarget: function getRelatedTarget(event) {
      return event.relatedTarget || event.toElement;
    },
    getOffset: function getOffset(event, target) {
      return DomEvent.getPoint(event).subtract(DomElement.getOffset(target || DomEvent.getTarget(event)));
    }
  };
  DomEvent.requestAnimationFrame = new function () {
    var nativeRequest = DomElement.getPrefixed(window, 'requestAnimationFrame'),
        requested = false,
        callbacks = [],
        timer;

    function handleCallbacks() {
      var functions = callbacks;
      callbacks = [];

      for (var i = 0, l = functions.length; i < l; i++) {
        functions[i]();
      }

      requested = nativeRequest && callbacks.length;
      if (requested) nativeRequest(handleCallbacks);
    }

    return function (callback) {
      callbacks.push(callback);

      if (nativeRequest) {
        if (!requested) {
          nativeRequest(handleCallbacks);
          requested = true;
        }
      } else if (!timer) {
        timer = setInterval(handleCallbacks, 1000 / 60);
      }
    };
  }();
  var View = Base.extend(Emitter, {
    _class: 'View',
    initialize: function View(project, element) {
      function getSize(name) {
        return element[name] || parseInt(element.getAttribute(name), 10);
      }

      function getCanvasSize() {
        var size = DomElement.getSize(element);
        return size.isNaN() || size.isZero() ? new Size(getSize('width'), getSize('height')) : size;
      }

      var size;

      if (window && element) {
        this._id = element.getAttribute('id');
        if (this._id == null) element.setAttribute('id', this._id = 'paper-view-' + View._id++);
        DomEvent.add(element, this._viewEvents);
        var none = 'none';
        DomElement.setPrefixed(element.style, {
          userDrag: none,
          userSelect: none,
          touchCallout: none,
          contentZooming: none,
          tapHighlightColor: 'rgba(0,0,0,0)'
        });

        if (PaperScope.hasAttribute(element, 'resize')) {
          var that = this;
          DomEvent.add(window, this._windowEvents = {
            resize: function resize() {
              that.setViewSize(getCanvasSize());
            }
          });
        }

        size = getCanvasSize();

        if (PaperScope.hasAttribute(element, 'stats') && typeof Stats !== 'undefined') {
          this._stats = new Stats();
          var stats = this._stats.domElement,
              style = stats.style,
              offset = DomElement.getOffset(element);
          style.position = 'absolute';
          style.left = offset.x + 'px';
          style.top = offset.y + 'px';
          document.body.appendChild(stats);
        }
      } else {
        size = new Size(element);
        element = null;
      }

      this._project = project;
      this._scope = project._scope;
      this._element = element;
      if (!this._pixelRatio) this._pixelRatio = window && window.devicePixelRatio || 1;

      this._setElementSize(size.width, size.height);

      this._viewSize = size;

      View._views.push(this);

      View._viewsById[this._id] = this;
      (this._matrix = new Matrix())._owner = this;
      if (!View._focused) View._focused = this;
      this._frameItems = {};
      this._frameItemCount = 0;
      this._itemEvents = {
        native: {},
        virtual: {}
      };
      this._autoUpdate = !paper.agent.node;
      this._needsUpdate = false;
    },
    remove: function remove() {
      if (!this._project) return false;
      if (View._focused === this) View._focused = null;

      View._views.splice(View._views.indexOf(this), 1);

      delete View._viewsById[this._id];
      var project = this._project;
      if (project._view === this) project._view = null;
      DomEvent.remove(this._element, this._viewEvents);
      DomEvent.remove(window, this._windowEvents);
      this._element = this._project = null;
      this.off('frame');
      this._animate = false;
      this._frameItems = {};
      return true;
    },
    _events: Base.each(Item._itemHandlers.concat(['onResize', 'onKeyDown', 'onKeyUp']), function (name) {
      this[name] = {};
    }, {
      onFrame: {
        install: function install() {
          this.play();
        },
        uninstall: function uninstall() {
          this.pause();
        }
      }
    }),
    _animate: false,
    _time: 0,
    _count: 0,
    getAutoUpdate: function getAutoUpdate() {
      return this._autoUpdate;
    },
    setAutoUpdate: function setAutoUpdate(autoUpdate) {
      this._autoUpdate = autoUpdate;
      if (autoUpdate) this.requestUpdate();
    },
    update: function update() {},
    draw: function draw() {
      this.update();
    },
    requestUpdate: function requestUpdate() {
      if (!this._requested) {
        var that = this;
        DomEvent.requestAnimationFrame(function () {
          that._requested = false;

          if (that._animate) {
            that.requestUpdate();
            var element = that._element;

            if ((!DomElement.getPrefixed(document, 'hidden') || PaperScope.getAttribute(element, 'keepalive') === 'true') && DomElement.isInView(element)) {
              that._handleFrame();
            }
          }

          if (that._autoUpdate) that.update();
        });
        this._requested = true;
      }
    },
    play: function play() {
      this._animate = true;
      this.requestUpdate();
    },
    pause: function pause() {
      this._animate = false;
    },
    _handleFrame: function _handleFrame() {
      paper = this._scope;
      var now = Date.now() / 1000,
          delta = this._last ? now - this._last : 0;
      this._last = now;
      this.emit('frame', new Base({
        delta: delta,
        time: this._time += delta,
        count: this._count++
      }));
      if (this._stats) this._stats.update();
    },
    _animateItem: function _animateItem(item, animate) {
      var items = this._frameItems;

      if (animate) {
        items[item._id] = {
          item: item,
          time: 0,
          count: 0
        };
        if (++this._frameItemCount === 1) this.on('frame', this._handleFrameItems);
      } else {
        delete items[item._id];

        if (--this._frameItemCount === 0) {
          this.off('frame', this._handleFrameItems);
        }
      }
    },
    _handleFrameItems: function _handleFrameItems(event) {
      for (var i in this._frameItems) {
        var entry = this._frameItems[i];
        entry.item.emit('frame', new Base(event, {
          time: entry.time += event.delta,
          count: entry.count++
        }));
      }
    },
    _changed: function _changed() {
      this._project._changed(4097);

      this._bounds = this._decomposed = undefined;
    },
    getElement: function getElement() {
      return this._element;
    },
    getPixelRatio: function getPixelRatio() {
      return this._pixelRatio;
    },
    getResolution: function getResolution() {
      return this._pixelRatio * 72;
    },
    getViewSize: function getViewSize() {
      var size = this._viewSize;
      return new LinkedSize(size.width, size.height, this, 'setViewSize');
    },
    setViewSize: function setViewSize() {
      var size = Size.read(arguments),
          delta = size.subtract(this._viewSize);
      if (delta.isZero()) return;

      this._setElementSize(size.width, size.height);

      this._viewSize.set(size);

      this._changed();

      this.emit('resize', {
        size: size,
        delta: delta
      });

      if (this._autoUpdate) {
        this.update();
      }
    },
    _setElementSize: function _setElementSize(width, height) {
      var element = this._element;

      if (element) {
        if (element.width !== width) element.width = width;
        if (element.height !== height) element.height = height;
      }
    },
    getBounds: function getBounds() {
      if (!this._bounds) this._bounds = this._matrix.inverted()._transformBounds(new _Rectangle(new Point(), this._viewSize));
      return this._bounds;
    },
    getSize: function getSize() {
      return this.getBounds().getSize();
    },
    isVisible: function isVisible() {
      return DomElement.isInView(this._element);
    },
    isInserted: function isInserted() {
      return DomElement.isInserted(this._element);
    },
    getPixelSize: function getPixelSize(size) {
      var element = this._element,
          pixels;

      if (element) {
        var parent = element.parentNode,
            temp = document.createElement('div');
        temp.style.fontSize = size;
        parent.appendChild(temp);
        pixels = parseFloat(DomElement.getStyles(temp).fontSize);
        parent.removeChild(temp);
      } else {
        pixels = parseFloat(pixels);
      }

      return pixels;
    },
    getTextWidth: function getTextWidth(font, lines) {
      return 0;
    }
  }, Base.each(['rotate', 'scale', 'shear', 'skew'], function (key) {
    var rotate = key === 'rotate';

    this[key] = function () {
      var args = arguments,
          value = (rotate ? Base : Point).read(args),
          center = Point.read(args, 0, {
        readNull: true
      });
      return this.transform(new Matrix()[key](value, center || this.getCenter(true)));
    };
  }, {
    _decompose: function _decompose() {
      return this._decomposed || (this._decomposed = this._matrix.decompose());
    },
    translate: function translate() {
      var mx = new Matrix();
      return this.transform(mx.translate.apply(mx, arguments));
    },
    getCenter: function getCenter() {
      return this.getBounds().getCenter();
    },
    setCenter: function setCenter() {
      var center = Point.read(arguments);
      this.translate(this.getCenter().subtract(center));
    },
    getZoom: function getZoom() {
      var scaling = this._decompose().scaling;

      return (scaling.x + scaling.y) / 2;
    },
    setZoom: function setZoom(zoom) {
      this.transform(new Matrix().scale(zoom / this.getZoom(), this.getCenter()));
    },
    getRotation: function getRotation() {
      return this._decompose().rotation;
    },
    setRotation: function setRotation(rotation) {
      var current = this.getRotation();

      if (current != null && rotation != null) {
        this.rotate(rotation - current);
      }
    },
    getScaling: function getScaling() {
      var scaling = this._decompose().scaling;

      return new LinkedPoint(scaling.x, scaling.y, this, 'setScaling');
    },
    setScaling: function setScaling() {
      var current = this.getScaling(),
          scaling = Point.read(arguments, 0, {
        clone: true,
        readNull: true
      });

      if (current && scaling) {
        this.scale(scaling.x / current.x, scaling.y / current.y);
      }
    },
    getMatrix: function getMatrix() {
      return this._matrix;
    },
    setMatrix: function setMatrix() {
      var matrix = this._matrix;
      matrix.set.apply(matrix, arguments);
    },
    transform: function transform(matrix) {
      this._matrix.append(matrix);
    },
    scrollBy: function scrollBy() {
      this.translate(Point.read(arguments).negate());
    }
  }), {
    projectToView: function projectToView() {
      return this._matrix._transformPoint(Point.read(arguments));
    },
    viewToProject: function viewToProject() {
      return this._matrix._inverseTransform(Point.read(arguments));
    },
    getEventPoint: function getEventPoint(event) {
      return this.viewToProject(DomEvent.getOffset(event, this._element));
    }
  }, {
    statics: {
      _views: [],
      _viewsById: {},
      _id: 0,
      create: function create(project, element) {
        if (document && typeof element === 'string') element = document.getElementById(element);
        var ctor = window ? CanvasView : View;
        return new ctor(project, element);
      }
    }
  }, new function () {
    if (!window) return;
    var prevFocus,
        tempFocus,
        dragging = false,
        mouseDown = false;

    function getView(event) {
      var target = DomEvent.getTarget(event);
      return target.getAttribute && View._viewsById[target.getAttribute('id')];
    }

    function updateFocus() {
      var view = View._focused;

      if (!view || !view.isVisible()) {
        for (var i = 0, l = View._views.length; i < l; i++) {
          if ((view = View._views[i]).isVisible()) {
            View._focused = tempFocus = view;
            break;
          }
        }
      }
    }

    function handleMouseMove(view, event, point) {
      view._handleMouseEvent('mousemove', event, point);
    }

    var navigator = window.navigator,
        mousedown,
        mousemove,
        mouseup;

    if (navigator.pointerEnabled || navigator.msPointerEnabled) {
      mousedown = 'pointerdown MSPointerDown';
      mousemove = 'pointermove MSPointerMove';
      mouseup = 'pointerup pointercancel MSPointerUp MSPointerCancel';
    } else {
      mousedown = 'touchstart';
      mousemove = 'touchmove';
      mouseup = 'touchend touchcancel';

      if (!('ontouchstart' in window && navigator.userAgent.match(/mobile|tablet|ip(ad|hone|od)|android|silk/i))) {
        mousedown += ' mousedown';
        mousemove += ' mousemove';
        mouseup += ' mouseup';
      }
    }

    var viewEvents = {},
        docEvents = {
      mouseout: function mouseout(event) {
        var view = View._focused,
            target = DomEvent.getRelatedTarget(event);

        if (view && (!target || target.nodeName === 'HTML')) {
          var offset = DomEvent.getOffset(event, view._element),
              x = offset.x,
              abs = Math.abs,
              ax = abs(x),
              max = 1 << 25,
              diff = ax - max;
          offset.x = abs(diff) < ax ? diff * (x < 0 ? -1 : 1) : x;
          handleMouseMove(view, event, view.viewToProject(offset));
        }
      },
      scroll: updateFocus
    };

    viewEvents[mousedown] = function (event) {
      var view = View._focused = getView(event);

      if (!dragging) {
        dragging = true;

        view._handleMouseEvent('mousedown', event);
      }
    };

    docEvents[mousemove] = function (event) {
      var view = View._focused;

      if (!mouseDown) {
        var target = getView(event);

        if (target) {
          if (view !== target) {
            if (view) handleMouseMove(view, event);
            if (!prevFocus) prevFocus = view;
            view = View._focused = tempFocus = target;
          }
        } else if (tempFocus && tempFocus === view) {
          if (prevFocus && !prevFocus.isInserted()) prevFocus = null;
          view = View._focused = prevFocus;
          prevFocus = null;
          updateFocus();
        }
      }

      if (view) handleMouseMove(view, event);
    };

    docEvents[mousedown] = function () {
      mouseDown = true;
    };

    docEvents[mouseup] = function (event) {
      var view = View._focused;
      if (view && dragging) view._handleMouseEvent('mouseup', event);
      mouseDown = dragging = false;
    };

    DomEvent.add(document, docEvents);
    DomEvent.add(window, {
      load: updateFocus
    });
    var called = false,
        prevented = false,
        fallbacks = {
      doubleclick: 'click',
      mousedrag: 'mousemove'
    },
        wasInView = false,
        overView,
        downPoint,
        lastPoint,
        downItem,
        overItem,
        dragItem,
        clickItem,
        clickTime,
        dblClick;

    function emitMouseEvent(obj, target, type, event, point, prevPoint, stopItem) {
      var stopped = false,
          mouseEvent;

      function emit(obj, type) {
        if (obj.responds(type)) {
          if (!mouseEvent) {
            mouseEvent = new MouseEvent(type, event, point, target || obj, prevPoint ? point.subtract(prevPoint) : null);
          }

          if (obj.emit(type, mouseEvent)) {
            called = true;
            if (mouseEvent.prevented) prevented = true;
            if (mouseEvent.stopped) return stopped = true;
          }
        } else {
          var fallback = fallbacks[type];
          if (fallback) return emit(obj, fallback);
        }
      }

      while (obj && obj !== stopItem) {
        if (emit(obj, type)) break;
        obj = obj._parent;
      }

      return stopped;
    }

    function emitMouseEvents(view, hitItem, type, event, point, prevPoint) {
      view._project.removeOn(type);

      prevented = called = false;
      return dragItem && emitMouseEvent(dragItem, null, type, event, point, prevPoint) || hitItem && hitItem !== dragItem && !hitItem.isDescendant(dragItem) && emitMouseEvent(hitItem, null, type === 'mousedrag' ? 'mousemove' : type, event, point, prevPoint, dragItem) || emitMouseEvent(view, dragItem || hitItem || view, type, event, point, prevPoint);
    }

    var itemEventsMap = {
      mousedown: {
        mousedown: 1,
        mousedrag: 1,
        click: 1,
        doubleclick: 1
      },
      mouseup: {
        mouseup: 1,
        mousedrag: 1,
        click: 1,
        doubleclick: 1
      },
      mousemove: {
        mousedrag: 1,
        mousemove: 1,
        mouseenter: 1,
        mouseleave: 1
      }
    };
    return {
      _viewEvents: viewEvents,
      _handleMouseEvent: function _handleMouseEvent(type, event, point) {
        var itemEvents = this._itemEvents,
            hitItems = itemEvents.native[type],
            nativeMove = type === 'mousemove',
            tool = this._scope.tool,
            view = this;

        function responds(type) {
          return itemEvents.virtual[type] || view.responds(type) || tool && tool.responds(type);
        }

        if (nativeMove && dragging && responds('mousedrag')) type = 'mousedrag';
        if (!point) point = this.getEventPoint(event);

        var inView = this.getBounds().contains(point),
            hit = hitItems && inView && view._project.hitTest(point, {
          tolerance: 0,
          fill: true,
          stroke: true
        }),
            hitItem = hit && hit.item || null,
            handle = false,
            mouse = {};

        mouse[type.substr(5)] = true;

        if (hitItems && hitItem !== overItem) {
          if (overItem) {
            emitMouseEvent(overItem, null, 'mouseleave', event, point);
          }

          if (hitItem) {
            emitMouseEvent(hitItem, null, 'mouseenter', event, point);
          }

          overItem = hitItem;
        }

        if (wasInView ^ inView) {
          emitMouseEvent(this, null, inView ? 'mouseenter' : 'mouseleave', event, point);
          overView = inView ? this : null;
          handle = true;
        }

        if ((inView || mouse.drag) && !point.equals(lastPoint)) {
          emitMouseEvents(this, hitItem, nativeMove ? type : 'mousemove', event, point, lastPoint);
          handle = true;
        }

        wasInView = inView;

        if (mouse.down && inView || mouse.up && downPoint) {
          emitMouseEvents(this, hitItem, type, event, point, downPoint);

          if (mouse.down) {
            dblClick = hitItem === clickItem && Date.now() - clickTime < 300;
            downItem = clickItem = hitItem;

            if (!prevented && hitItem) {
              var item = hitItem;

              while (item && !item.responds('mousedrag')) {
                item = item._parent;
              }

              if (item) dragItem = hitItem;
            }

            downPoint = point;
          } else if (mouse.up) {
            if (!prevented && hitItem === downItem) {
              clickTime = Date.now();
              emitMouseEvents(this, hitItem, dblClick ? 'doubleclick' : 'click', event, point, downPoint);
              dblClick = false;
            }

            downItem = dragItem = null;
          }

          wasInView = false;
          handle = true;
        }

        lastPoint = point;

        if (handle && tool) {
          called = tool._handleMouseEvent(type, event, point, mouse) || called;
        }

        if (event.cancelable !== false && (called && !mouse.move || mouse.down && responds('mouseup'))) {
          event.preventDefault();
        }
      },
      _handleKeyEvent: function _handleKeyEvent(type, event, key, character) {
        var scope = this._scope,
            tool = scope.tool,
            keyEvent;

        function emit(obj) {
          if (obj.responds(type)) {
            paper = scope;
            obj.emit(type, keyEvent = keyEvent || new KeyEvent(type, event, key, character));
          }
        }

        if (this.isVisible()) {
          emit(this);
          if (tool && tool.responds(type)) emit(tool);
        }
      },
      _countItemEvent: function _countItemEvent(type, sign) {
        var itemEvents = this._itemEvents,
            native = itemEvents.native,
            virtual = itemEvents.virtual;

        for (var key in itemEventsMap) {
          native[key] = (native[key] || 0) + (itemEventsMap[key][type] || 0) * sign;
        }

        virtual[type] = (virtual[type] || 0) + sign;
      },
      statics: {
        updateFocus: updateFocus,
        _resetState: function _resetState() {
          dragging = mouseDown = called = wasInView = false;
          prevFocus = tempFocus = overView = downPoint = lastPoint = downItem = overItem = dragItem = clickItem = clickTime = dblClick = null;
        }
      }
    };
  }());
  var CanvasView = View.extend({
    _class: 'CanvasView',
    initialize: function CanvasView(project, canvas) {
      if (!(canvas instanceof window.HTMLCanvasElement)) {
        var size = Size.read(arguments, 1);
        if (size.isZero()) throw new Error('Cannot create CanvasView with the provided argument: ' + Base.slice(arguments, 1));
        canvas = CanvasProvider.getCanvas(size);
      }

      var ctx = this._context = canvas.getContext('2d');
      ctx.save();
      this._pixelRatio = 1;

      if (!/^off|false$/.test(PaperScope.getAttribute(canvas, 'hidpi'))) {
        var deviceRatio = window.devicePixelRatio || 1,
            backingStoreRatio = DomElement.getPrefixed(ctx, 'backingStorePixelRatio') || 1;
        this._pixelRatio = deviceRatio / backingStoreRatio;
      }

      View.call(this, project, canvas);
      this._needsUpdate = true;
    },
    remove: function remove() {
      this._context.restore();

      return remove.base.call(this);
    },
    _setElementSize: function _setElementSize(width, height) {
      var pixelRatio = this._pixelRatio;

      _setElementSize.base.call(this, width * pixelRatio, height * pixelRatio);

      if (pixelRatio !== 1) {
        var element = this._element,
            ctx = this._context;

        if (!PaperScope.hasAttribute(element, 'resize')) {
          var style = element.style;
          style.width = width + 'px';
          style.height = height + 'px';
        }

        ctx.restore();
        ctx.save();
        ctx.scale(pixelRatio, pixelRatio);
      }
    },
    getContext: function getContext() {
      return this._context;
    },
    getPixelSize: function getPixelSize(size) {
      var agent = paper.agent,
          pixels;

      if (agent && agent.firefox) {
        pixels = getPixelSize.base.call(this, size);
      } else {
        var ctx = this._context,
            prevFont = ctx.font;
        ctx.font = size + ' serif';
        pixels = parseFloat(ctx.font);
        ctx.font = prevFont;
      }

      return pixels;
    },
    getTextWidth: function getTextWidth(font, lines) {
      var ctx = this._context,
          prevFont = ctx.font,
          width = 0;
      ctx.font = font;

      for (var i = 0, l = lines.length; i < l; i++) {
        width = Math.max(width, ctx.measureText(lines[i]).width);
      }

      ctx.font = prevFont;
      return width;
    },
    update: function update() {
      if (!this._needsUpdate) return false;
      var project = this._project,
          ctx = this._context,
          size = this._viewSize;
      ctx.clearRect(0, 0, size.width + 1, size.height + 1);
      if (project) project.draw(ctx, this._matrix, this._pixelRatio);
      this._needsUpdate = false;
      return true;
    }
  });
  var Event = Base.extend({
    _class: 'Event',
    initialize: function Event(event) {
      this.event = event;
      this.type = event && event.type;
    },
    prevented: false,
    stopped: false,
    preventDefault: function preventDefault() {
      this.prevented = true;
      this.event.preventDefault();
    },
    stopPropagation: function stopPropagation() {
      this.stopped = true;
      this.event.stopPropagation();
    },
    stop: function stop() {
      this.stopPropagation();
      this.preventDefault();
    },
    getTimeStamp: function getTimeStamp() {
      return this.event.timeStamp;
    },
    getModifiers: function getModifiers() {
      return Key.modifiers;
    }
  });
  var KeyEvent = Event.extend({
    _class: 'KeyEvent',
    initialize: function KeyEvent(type, event, key, character) {
      this.type = type;
      this.event = event;
      this.key = key;
      this.character = character;
    },
    toString: function toString() {
      return "{ type: '" + this.type + "', key: '" + this.key + "', character: '" + this.character + "', modifiers: " + this.getModifiers() + " }";
    }
  });
  var Key = new function () {
    var keyLookup = {
      '\t': 'tab',
      ' ': 'space',
      '\b': 'backspace',
      '\x7f': 'delete',
      'Spacebar': 'space',
      'Del': 'delete',
      'Win': 'meta',
      'Esc': 'escape'
    },
        charLookup = {
      'tab': '\t',
      'space': ' ',
      'enter': '\r'
    },
        keyMap = {},
        charMap = {},
        metaFixMap,
        downKey,
        modifiers = new Base({
      shift: false,
      control: false,
      alt: false,
      meta: false,
      capsLock: false,
      space: false
    }).inject({
      option: {
        get: function get() {
          return this.alt;
        }
      },
      command: {
        get: function get() {
          var agent = paper && paper.agent;
          return agent && agent.mac ? this.meta : this.control;
        }
      }
    });

    function getKey(event) {
      var key = event.key || event.keyIdentifier;
      key = /^U\+/.test(key) ? String.fromCharCode(parseInt(key.substr(2), 16)) : /^Arrow[A-Z]/.test(key) ? key.substr(5) : key === 'Unidentified' || key === undefined ? String.fromCharCode(event.keyCode) : key;
      return keyLookup[key] || (key.length > 1 ? Base.hyphenate(key) : key.toLowerCase());
    }

    function handleKey(down, key, character, event) {
      var type = down ? 'keydown' : 'keyup',
          view = View._focused,
          name;
      keyMap[key] = down;

      if (down) {
        charMap[key] = character;
      } else {
        delete charMap[key];
      }

      if (key.length > 1 && (name = Base.camelize(key)) in modifiers) {
        modifiers[name] = down;
        var agent = paper && paper.agent;

        if (name === 'meta' && agent && agent.mac) {
          if (down) {
            metaFixMap = {};
          } else {
            for (var k in metaFixMap) {
              if (k in charMap) handleKey(false, k, metaFixMap[k], event);
            }

            metaFixMap = null;
          }
        }
      } else if (down && metaFixMap) {
        metaFixMap[key] = character;
      }

      if (view) {
        view._handleKeyEvent(down ? 'keydown' : 'keyup', event, key, character);
      }
    }

    DomEvent.add(document, {
      keydown: function keydown(event) {
        var key = getKey(event),
            agent = paper && paper.agent;

        if (key.length > 1 || agent && agent.chrome && (event.altKey || agent.mac && event.metaKey || !agent.mac && event.ctrlKey)) {
          handleKey(true, key, charLookup[key] || (key.length > 1 ? '' : key), event);
        } else {
          downKey = key;
        }
      },
      keypress: function keypress(event) {
        if (downKey) {
          var key = getKey(event),
              code = event.charCode,
              character = code >= 32 ? String.fromCharCode(code) : key.length > 1 ? '' : key;

          if (key !== downKey) {
            key = character.toLowerCase();
          }

          handleKey(true, key, character, event);
          downKey = null;
        }
      },
      keyup: function keyup(event) {
        var key = getKey(event);
        if (key in charMap) handleKey(false, key, charMap[key], event);
      }
    });
    DomEvent.add(window, {
      blur: function blur(event) {
        for (var key in charMap) {
          handleKey(false, key, charMap[key], event);
        }
      }
    });
    return {
      modifiers: modifiers,
      isDown: function isDown(key) {
        return !!keyMap[key];
      }
    };
  }();
  var MouseEvent = Event.extend({
    _class: 'MouseEvent',
    initialize: function MouseEvent(type, event, point, target, delta) {
      this.type = type;
      this.event = event;
      this.point = point;
      this.target = target;
      this.delta = delta;
    },
    toString: function toString() {
      return "{ type: '" + this.type + "', point: " + this.point + ', target: ' + this.target + (this.delta ? ', delta: ' + this.delta : '') + ', modifiers: ' + this.getModifiers() + ' }';
    }
  });
  var ToolEvent = Event.extend({
    _class: 'ToolEvent',
    _item: null,
    initialize: function ToolEvent(tool, type, event) {
      this.tool = tool;
      this.type = type;
      this.event = event;
    },
    _choosePoint: function _choosePoint(point, toolPoint) {
      return point ? point : toolPoint ? toolPoint.clone() : null;
    },
    getPoint: function getPoint() {
      return this._choosePoint(this._point, this.tool._point);
    },
    setPoint: function setPoint(point) {
      this._point = point;
    },
    getLastPoint: function getLastPoint() {
      return this._choosePoint(this._lastPoint, this.tool._lastPoint);
    },
    setLastPoint: function setLastPoint(lastPoint) {
      this._lastPoint = lastPoint;
    },
    getDownPoint: function getDownPoint() {
      return this._choosePoint(this._downPoint, this.tool._downPoint);
    },
    setDownPoint: function setDownPoint(downPoint) {
      this._downPoint = downPoint;
    },
    getMiddlePoint: function getMiddlePoint() {
      if (!this._middlePoint && this.tool._lastPoint) {
        return this.tool._point.add(this.tool._lastPoint).divide(2);
      }

      return this._middlePoint;
    },
    setMiddlePoint: function setMiddlePoint(middlePoint) {
      this._middlePoint = middlePoint;
    },
    getDelta: function getDelta() {
      return !this._delta && this.tool._lastPoint ? this.tool._point.subtract(this.tool._lastPoint) : this._delta;
    },
    setDelta: function setDelta(delta) {
      this._delta = delta;
    },
    getCount: function getCount() {
      return this.tool[/^mouse(down|up)$/.test(this.type) ? '_downCount' : '_moveCount'];
    },
    setCount: function setCount(count) {
      this.tool[/^mouse(down|up)$/.test(this.type) ? 'downCount' : 'count'] = count;
    },
    getItem: function getItem() {
      if (!this._item) {
        var result = this.tool._scope.project.hitTest(this.getPoint());

        if (result) {
          var item = result.item,
              parent = item._parent;

          while (/^(Group|CompoundPath)$/.test(parent._class)) {
            item = parent;
            parent = parent._parent;
          }

          this._item = item;
        }
      }

      return this._item;
    },
    setItem: function setItem(item) {
      this._item = item;
    },
    toString: function toString() {
      return '{ type: ' + this.type + ', point: ' + this.getPoint() + ', count: ' + this.getCount() + ', modifiers: ' + this.getModifiers() + ' }';
    }
  });
  var Tool = PaperScopeItem.extend({
    _class: 'Tool',
    _list: 'tools',
    _reference: 'tool',
    _events: ['onMouseDown', 'onMouseUp', 'onMouseDrag', 'onMouseMove', 'onActivate', 'onDeactivate', 'onEditOptions', 'onKeyDown', 'onKeyUp'],
    initialize: function Tool(props) {
      PaperScopeItem.call(this);
      this._moveCount = -1;
      this._downCount = -1;
      this.set(props);
    },
    getMinDistance: function getMinDistance() {
      return this._minDistance;
    },
    setMinDistance: function setMinDistance(minDistance) {
      this._minDistance = minDistance;

      if (minDistance != null && this._maxDistance != null && minDistance > this._maxDistance) {
        this._maxDistance = minDistance;
      }
    },
    getMaxDistance: function getMaxDistance() {
      return this._maxDistance;
    },
    setMaxDistance: function setMaxDistance(maxDistance) {
      this._maxDistance = maxDistance;

      if (this._minDistance != null && maxDistance != null && maxDistance < this._minDistance) {
        this._minDistance = maxDistance;
      }
    },
    getFixedDistance: function getFixedDistance() {
      return this._minDistance == this._maxDistance ? this._minDistance : null;
    },
    setFixedDistance: function setFixedDistance(distance) {
      this._minDistance = this._maxDistance = distance;
    },
    _handleMouseEvent: function _handleMouseEvent(type, event, point, mouse) {
      paper = this._scope;
      if (mouse.drag && !this.responds(type)) type = 'mousemove';
      var move = mouse.move || mouse.drag,
          responds = this.responds(type),
          minDistance = this.minDistance,
          maxDistance = this.maxDistance,
          called = false,
          tool = this;

      function update(minDistance, maxDistance) {
        var pt = point,
            toolPoint = move ? tool._point : tool._downPoint || pt;

        if (move) {
          if (tool._moveCount >= 0 && pt.equals(toolPoint)) {
            return false;
          }

          if (toolPoint && (minDistance != null || maxDistance != null)) {
            var vector = pt.subtract(toolPoint),
                distance = vector.getLength();
            if (distance < (minDistance || 0)) return false;

            if (maxDistance) {
              pt = toolPoint.add(vector.normalize(Math.min(distance, maxDistance)));
            }
          }

          tool._moveCount++;
        }

        tool._point = pt;
        tool._lastPoint = toolPoint || pt;

        if (mouse.down) {
          tool._moveCount = -1;
          tool._downPoint = pt;
          tool._downCount++;
        }

        return true;
      }

      function emit() {
        if (responds) {
          called = tool.emit(type, new ToolEvent(tool, type, event)) || called;
        }
      }

      if (mouse.down) {
        update();
        emit();
      } else if (mouse.up) {
        update(null, maxDistance);
        emit();
      } else if (responds) {
        while (update(minDistance, maxDistance)) {
          emit();
        }
      }

      return called;
    }
  });
  var Tween = Base.extend(Emitter, {
    _class: 'Tween',
    statics: {
      easings: {
        linear: function linear(t) {
          return t;
        },
        easeInQuad: function easeInQuad(t) {
          return t * t;
        },
        easeOutQuad: function easeOutQuad(t) {
          return t * (2 - t);
        },
        easeInOutQuad: function easeInOutQuad(t) {
          return t < 0.5 ? 2 * t * t : -1 + 2 * (2 - t) * t;
        },
        easeInCubic: function easeInCubic(t) {
          return t * t * t;
        },
        easeOutCubic: function easeOutCubic(t) {
          return --t * t * t + 1;
        },
        easeInOutCubic: function easeInOutCubic(t) {
          return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        easeInQuart: function easeInQuart(t) {
          return t * t * t * t;
        },
        easeOutQuart: function easeOutQuart(t) {
          return 1 - --t * t * t * t;
        },
        easeInOutQuart: function easeInOutQuart(t) {
          return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
        },
        easeInQuint: function easeInQuint(t) {
          return t * t * t * t * t;
        },
        easeOutQuint: function easeOutQuint(t) {
          return 1 + --t * t * t * t * t;
        },
        easeInOutQuint: function easeInOutQuint(t) {
          return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
        }
      }
    },
    initialize: function Tween(object, from, to, duration, easing, start) {
      this.object = object;

      var type = _typeof(easing);

      var isFunction = type === 'function';
      this.type = isFunction ? type : type === 'string' ? easing : 'linear';
      this.easing = isFunction ? easing : Tween.easings[this.type];
      this.duration = duration;
      this.running = false;
      this._then = null;
      this._startTime = null;
      var state = from || to;
      this._keys = state ? Object.keys(state) : [];
      this._parsedKeys = this._parseKeys(this._keys);
      this._from = state && this._getState(from);
      this._to = state && this._getState(to);

      if (start !== false) {
        this.start();
      }
    },
    then: function then(_then) {
      this._then = _then;
      return this;
    },
    start: function start() {
      this._startTime = null;
      this.running = true;
      return this;
    },
    stop: function stop() {
      this.running = false;
      return this;
    },
    update: function update(progress) {
      if (this.running) {
        if (progress >= 1) {
          progress = 1;
          this.running = false;
        }

        var factor = this.easing(progress),
            keys = this._keys,
            getValue = function getValue(value) {
          return typeof value === 'function' ? value(factor, progress) : value;
        };

        for (var i = 0, l = keys && keys.length; i < l; i++) {
          var key = keys[i],
              from = getValue(this._from[key]),
              to = getValue(this._to[key]),
              value = from && to && from.__add && to.__add ? to.__subtract(from).__multiply(factor).__add(from) : (to - from) * factor + from;

          this._setProperty(this._parsedKeys[key], value);
        }

        if (this.responds('update')) {
          this.emit('update', new Base({
            progress: progress,
            factor: factor
          }));
        }

        if (!this.running && this._then) {
          this._then(this.object);
        }
      }

      return this;
    },
    _events: {
      onUpdate: {}
    },
    _handleFrame: function _handleFrame(time) {
      var startTime = this._startTime,
          progress = startTime ? (time - startTime) / this.duration : 0;

      if (!startTime) {
        this._startTime = time;
      }

      this.update(progress);
    },
    _getState: function _getState(state) {
      var keys = this._keys,
          result = {};

      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i],
            path = this._parsedKeys[key],
            current = this._getProperty(path),
            value;

        if (state) {
          var resolved = this._resolveValue(current, state[key]);

          this._setProperty(path, resolved);

          value = this._getProperty(path);
          value = value && value.clone ? value.clone() : value;

          this._setProperty(path, current);
        } else {
          value = current && current.clone ? current.clone() : current;
        }

        result[key] = value;
      }

      return result;
    },
    _resolveValue: function _resolveValue(current, value) {
      if (value) {
        if (Array.isArray(value) && value.length === 2) {
          var operator = value[0];
          return operator && operator.match && operator.match(/^[+\-\*\/]=/) ? this._calculate(current, operator[0], value[1]) : value;
        } else if (typeof value === 'string') {
          var match = value.match(/^[+\-*/]=(.*)/);

          if (match) {
            var parsed = JSON.parse(match[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": '));
            return this._calculate(current, value[0], parsed);
          }
        }
      }

      return value;
    },
    _calculate: function _calculate(left, operator, right) {
      return paper.PaperScript.calculateBinary(left, operator, right);
    },
    _parseKeys: function _parseKeys(keys) {
      var parsed = {};

      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i],
            path = key.replace(/\.([^.]*)/g, '/$1').replace(/\[['"]?([^'"\]]*)['"]?\]/g, '/$1');
        parsed[key] = path.split('/');
      }

      return parsed;
    },
    _getProperty: function _getProperty(path, offset) {
      var obj = this.object;

      for (var i = 0, l = path.length - (offset || 0); i < l && obj; i++) {
        obj = obj[path[i]];
      }

      return obj;
    },
    _setProperty: function _setProperty(path, value) {
      var dest = this._getProperty(path, 1);

      if (dest) {
        dest[path[path.length - 1]] = value;
      }
    }
  });
  var Http = {
    request: function request(options) {
      var xhr = new self.XMLHttpRequest();
      xhr.open((options.method || 'get').toUpperCase(), options.url, Base.pick(options.async, true));
      if (options.mimeType) xhr.overrideMimeType(options.mimeType);

      xhr.onload = function () {
        var status = xhr.status;

        if (status === 0 || status === 200) {
          if (options.onLoad) {
            options.onLoad.call(xhr, xhr.responseText);
          }
        } else {
          xhr.onerror();
        }
      };

      xhr.onerror = function () {
        var status = xhr.status,
            message = 'Could not load "' + options.url + '" (Status: ' + status + ')';

        if (options.onError) {
          options.onError(message, status);
        } else {
          throw new Error(message);
        }
      };

      return xhr.send(null);
    }
  };
  var CanvasProvider = Base.exports.CanvasProvider = {
    canvases: [],
    getCanvas: function getCanvas(width, height) {
      if (!window) return null;
      var canvas,
          clear = true;

      if (_typeof(width) === 'object') {
        height = width.height;
        width = width.width;
      }

      if (this.canvases.length) {
        canvas = this.canvases.pop();
      } else {
        canvas = document.createElement('canvas');
        clear = false;
      }

      var ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas ' + canvas + ' is unable to provide a 2D context.');
      }

      if (canvas.width === width && canvas.height === height) {
        if (clear) ctx.clearRect(0, 0, width + 1, height + 1);
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.save();
      return canvas;
    },
    getContext: function getContext(width, height) {
      var canvas = this.getCanvas(width, height);
      return canvas ? canvas.getContext('2d') : null;
    },
    release: function release(obj) {
      var canvas = obj && obj.canvas ? obj.canvas : obj;

      if (canvas && canvas.getContext) {
        canvas.getContext('2d').restore();
        this.canvases.push(canvas);
      }
    }
  };
  var BlendMode = new function () {
    var min = Math.min,
        max = Math.max,
        abs = Math.abs,
        sr,
        sg,
        sb,
        sa,
        br,
        bg,
        bb,
        ba,
        dr,
        dg,
        db;

    function getLum(r, g, b) {
      return 0.2989 * r + 0.587 * g + 0.114 * b;
    }

    function setLum(r, g, b, l) {
      var d = l - getLum(r, g, b);
      dr = r + d;
      dg = g + d;
      db = b + d;
      var l = getLum(dr, dg, db),
          mn = min(dr, dg, db),
          mx = max(dr, dg, db);

      if (mn < 0) {
        var lmn = l - mn;
        dr = l + (dr - l) * l / lmn;
        dg = l + (dg - l) * l / lmn;
        db = l + (db - l) * l / lmn;
      }

      if (mx > 255) {
        var ln = 255 - l,
            mxl = mx - l;
        dr = l + (dr - l) * ln / mxl;
        dg = l + (dg - l) * ln / mxl;
        db = l + (db - l) * ln / mxl;
      }
    }

    function getSat(r, g, b) {
      return max(r, g, b) - min(r, g, b);
    }

    function setSat(r, g, b, s) {
      var col = [r, g, b],
          mx = max(r, g, b),
          mn = min(r, g, b),
          md;
      mn = mn === r ? 0 : mn === g ? 1 : 2;
      mx = mx === r ? 0 : mx === g ? 1 : 2;
      md = min(mn, mx) === 0 ? max(mn, mx) === 1 ? 2 : 1 : 0;

      if (col[mx] > col[mn]) {
        col[md] = (col[md] - col[mn]) * s / (col[mx] - col[mn]);
        col[mx] = s;
      } else {
        col[md] = col[mx] = 0;
      }

      col[mn] = 0;
      dr = col[0];
      dg = col[1];
      db = col[2];
    }

    var modes = {
      multiply: function multiply() {
        dr = br * sr / 255;
        dg = bg * sg / 255;
        db = bb * sb / 255;
      },
      screen: function screen() {
        dr = br + sr - br * sr / 255;
        dg = bg + sg - bg * sg / 255;
        db = bb + sb - bb * sb / 255;
      },
      overlay: function overlay() {
        dr = br < 128 ? 2 * br * sr / 255 : 255 - 2 * (255 - br) * (255 - sr) / 255;
        dg = bg < 128 ? 2 * bg * sg / 255 : 255 - 2 * (255 - bg) * (255 - sg) / 255;
        db = bb < 128 ? 2 * bb * sb / 255 : 255 - 2 * (255 - bb) * (255 - sb) / 255;
      },
      'soft-light': function softLight() {
        var t = sr * br / 255;
        dr = t + br * (255 - (255 - br) * (255 - sr) / 255 - t) / 255;
        t = sg * bg / 255;
        dg = t + bg * (255 - (255 - bg) * (255 - sg) / 255 - t) / 255;
        t = sb * bb / 255;
        db = t + bb * (255 - (255 - bb) * (255 - sb) / 255 - t) / 255;
      },
      'hard-light': function hardLight() {
        dr = sr < 128 ? 2 * sr * br / 255 : 255 - 2 * (255 - sr) * (255 - br) / 255;
        dg = sg < 128 ? 2 * sg * bg / 255 : 255 - 2 * (255 - sg) * (255 - bg) / 255;
        db = sb < 128 ? 2 * sb * bb / 255 : 255 - 2 * (255 - sb) * (255 - bb) / 255;
      },
      'color-dodge': function colorDodge() {
        dr = br === 0 ? 0 : sr === 255 ? 255 : min(255, 255 * br / (255 - sr));
        dg = bg === 0 ? 0 : sg === 255 ? 255 : min(255, 255 * bg / (255 - sg));
        db = bb === 0 ? 0 : sb === 255 ? 255 : min(255, 255 * bb / (255 - sb));
      },
      'color-burn': function colorBurn() {
        dr = br === 255 ? 255 : sr === 0 ? 0 : max(0, 255 - (255 - br) * 255 / sr);
        dg = bg === 255 ? 255 : sg === 0 ? 0 : max(0, 255 - (255 - bg) * 255 / sg);
        db = bb === 255 ? 255 : sb === 0 ? 0 : max(0, 255 - (255 - bb) * 255 / sb);
      },
      darken: function darken() {
        dr = br < sr ? br : sr;
        dg = bg < sg ? bg : sg;
        db = bb < sb ? bb : sb;
      },
      lighten: function lighten() {
        dr = br > sr ? br : sr;
        dg = bg > sg ? bg : sg;
        db = bb > sb ? bb : sb;
      },
      difference: function difference() {
        dr = br - sr;
        if (dr < 0) dr = -dr;
        dg = bg - sg;
        if (dg < 0) dg = -dg;
        db = bb - sb;
        if (db < 0) db = -db;
      },
      exclusion: function exclusion() {
        dr = br + sr * (255 - br - br) / 255;
        dg = bg + sg * (255 - bg - bg) / 255;
        db = bb + sb * (255 - bb - bb) / 255;
      },
      hue: function hue() {
        setSat(sr, sg, sb, getSat(br, bg, bb));
        setLum(dr, dg, db, getLum(br, bg, bb));
      },
      saturation: function saturation() {
        setSat(br, bg, bb, getSat(sr, sg, sb));
        setLum(dr, dg, db, getLum(br, bg, bb));
      },
      luminosity: function luminosity() {
        setLum(br, bg, bb, getLum(sr, sg, sb));
      },
      color: function color() {
        setLum(sr, sg, sb, getLum(br, bg, bb));
      },
      add: function add() {
        dr = min(br + sr, 255);
        dg = min(bg + sg, 255);
        db = min(bb + sb, 255);
      },
      subtract: function subtract() {
        dr = max(br - sr, 0);
        dg = max(bg - sg, 0);
        db = max(bb - sb, 0);
      },
      average: function average() {
        dr = (br + sr) / 2;
        dg = (bg + sg) / 2;
        db = (bb + sb) / 2;
      },
      negation: function negation() {
        dr = 255 - abs(255 - sr - br);
        dg = 255 - abs(255 - sg - bg);
        db = 255 - abs(255 - sb - bb);
      }
    };
    var nativeModes = this.nativeModes = Base.each(['source-over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in', 'destination-out', 'destination-atop', 'lighter', 'darker', 'copy', 'xor'], function (mode) {
      this[mode] = true;
    }, {});
    var ctx = CanvasProvider.getContext(1, 1);

    if (ctx) {
      Base.each(modes, function (func, mode) {
        var darken = mode === 'darken',
            ok = false;
        ctx.save();

        try {
          ctx.fillStyle = darken ? '#300' : '#a00';
          ctx.fillRect(0, 0, 1, 1);
          ctx.globalCompositeOperation = mode;

          if (ctx.globalCompositeOperation === mode) {
            ctx.fillStyle = darken ? '#a00' : '#300';
            ctx.fillRect(0, 0, 1, 1);
            ok = ctx.getImageData(0, 0, 1, 1).data[0] !== darken ? 170 : 51;
          }
        } catch (e) {}

        ctx.restore();
        nativeModes[mode] = ok;
      });
      CanvasProvider.release(ctx);
    }

    this.process = function (mode, srcContext, dstContext, alpha, offset) {
      var srcCanvas = srcContext.canvas,
          normal = mode === 'normal';

      if (normal || nativeModes[mode]) {
        dstContext.save();
        dstContext.setTransform(1, 0, 0, 1, 0, 0);
        dstContext.globalAlpha = alpha;
        if (!normal) dstContext.globalCompositeOperation = mode;
        dstContext.drawImage(srcCanvas, offset.x, offset.y);
        dstContext.restore();
      } else {
        var process = modes[mode];
        if (!process) return;
        var dstData = dstContext.getImageData(offset.x, offset.y, srcCanvas.width, srcCanvas.height),
            dst = dstData.data,
            src = srcContext.getImageData(0, 0, srcCanvas.width, srcCanvas.height).data;

        for (var i = 0, l = dst.length; i < l; i += 4) {
          sr = src[i];
          br = dst[i];
          sg = src[i + 1];
          bg = dst[i + 1];
          sb = src[i + 2];
          bb = dst[i + 2];
          sa = src[i + 3];
          ba = dst[i + 3];
          process();
          var a1 = sa * alpha / 255,
              a2 = 1 - a1;
          dst[i] = a1 * dr + a2 * br;
          dst[i + 1] = a1 * dg + a2 * bg;
          dst[i + 2] = a1 * db + a2 * bb;
          dst[i + 3] = sa * alpha + a2 * ba;
        }

        dstContext.putImageData(dstData, offset.x, offset.y);
      }
    };
  }();
  var SvgElement = new function () {
    var svg = 'http://www.w3.org/2000/svg',
        xmlns = 'http://www.w3.org/2000/xmlns',
        xlink = 'http://www.w3.org/1999/xlink',
        attributeNamespace = {
      href: xlink,
      xlink: xmlns,
      xmlns: xmlns + '/',
      'xmlns:xlink': xmlns + '/'
    };

    function create(tag, attributes, formatter) {
      return set(document.createElementNS(svg, tag), attributes, formatter);
    }

    function get(node, name) {
      var namespace = attributeNamespace[name],
          value = namespace ? node.getAttributeNS(namespace, name) : node.getAttribute(name);
      return value === 'null' ? null : value;
    }

    function set(node, attributes, formatter) {
      for (var name in attributes) {
        var value = attributes[name],
            namespace = attributeNamespace[name];
        if (typeof value === 'number' && formatter) value = formatter.number(value);

        if (namespace) {
          node.setAttributeNS(namespace, name, value);
        } else {
          node.setAttribute(name, value);
        }
      }

      return node;
    }

    return {
      svg: svg,
      xmlns: xmlns,
      xlink: xlink,
      create: create,
      get: get,
      set: set
    };
  }();
  var SvgStyles = Base.each({
    fillColor: ['fill', 'color'],
    fillRule: ['fill-rule', 'string'],
    strokeColor: ['stroke', 'color'],
    strokeWidth: ['stroke-width', 'number'],
    strokeCap: ['stroke-linecap', 'string'],
    strokeJoin: ['stroke-linejoin', 'string'],
    strokeScaling: ['vector-effect', 'lookup', {
      true: 'none',
      false: 'non-scaling-stroke'
    }, function (item, value) {
      return !value && (item instanceof PathItem || item instanceof Shape || item instanceof TextItem);
    }],
    miterLimit: ['stroke-miterlimit', 'number'],
    dashArray: ['stroke-dasharray', 'array'],
    dashOffset: ['stroke-dashoffset', 'number'],
    fontFamily: ['font-family', 'string'],
    fontWeight: ['font-weight', 'string'],
    fontSize: ['font-size', 'number'],
    justification: ['text-anchor', 'lookup', {
      left: 'start',
      center: 'middle',
      right: 'end'
    }],
    opacity: ['opacity', 'number'],
    blendMode: ['mix-blend-mode', 'style']
  }, function (entry, key) {
    var part = Base.capitalize(key),
        lookup = entry[2];
    this[key] = {
      type: entry[1],
      property: key,
      attribute: entry[0],
      toSVG: lookup,
      fromSVG: lookup && Base.each(lookup, function (value, name) {
        this[value] = name;
      }, {}),
      exportFilter: entry[3],
      get: 'get' + part,
      set: 'set' + part
    };
  }, {});
  new function () {
    var formatter;

    function getTransform(matrix, coordinates, center) {
      var attrs = new Base(),
          trans = matrix.getTranslation();

      if (coordinates) {
        var point;

        if (matrix.isInvertible()) {
          matrix = matrix._shiftless();
          point = matrix._inverseTransform(trans);
          trans = null;
        } else {
          point = new Point();
        }

        attrs[center ? 'cx' : 'x'] = point.x;
        attrs[center ? 'cy' : 'y'] = point.y;
      }

      if (!matrix.isIdentity()) {
        var decomposed = matrix.decompose();

        if (decomposed) {
          var parts = [],
              angle = decomposed.rotation,
              scale = decomposed.scaling,
              skew = decomposed.skewing;
          if (trans && !trans.isZero()) parts.push('translate(' + formatter.point(trans) + ')');
          if (angle) parts.push('rotate(' + formatter.number(angle) + ')');
          if (!Numerical.isZero(scale.x - 1) || !Numerical.isZero(scale.y - 1)) parts.push('scale(' + formatter.point(scale) + ')');
          if (skew.x) parts.push('skewX(' + formatter.number(skew.x) + ')');
          if (skew.y) parts.push('skewY(' + formatter.number(skew.y) + ')');
          attrs.transform = parts.join(' ');
        } else {
          attrs.transform = 'matrix(' + matrix.getValues().join(',') + ')';
        }
      }

      return attrs;
    }

    function exportGroup(item, options) {
      var attrs = getTransform(item._matrix),
          children = item._children;
      var node = SvgElement.create('g', attrs, formatter);

      for (var i = 0, l = children.length; i < l; i++) {
        var child = children[i];

        var childNode = _exportSVG(child, options);

        if (childNode) {
          if (child.isClipMask()) {
            var clip = SvgElement.create('clipPath');
            clip.appendChild(childNode);
            setDefinition(child, clip, 'clip');
            SvgElement.set(node, {
              'clip-path': 'url(#' + clip.id + ')'
            });
          } else {
            node.appendChild(childNode);
          }
        }
      }

      return node;
    }

    function exportRaster(item, options) {
      var attrs = getTransform(item._matrix, true),
          size = item.getSize(),
          image = item.getImage();
      attrs.x -= size.width / 2;
      attrs.y -= size.height / 2;
      attrs.width = size.width;
      attrs.height = size.height;
      attrs.href = options.embedImages == false && image && image.src || item.toDataURL();
      return SvgElement.create('image', attrs, formatter);
    }

    function exportPath(item, options) {
      var matchShapes = options.matchShapes;

      if (matchShapes) {
        var shape = item.toShape(false);
        if (shape) return exportShape(shape, options);
      }

      var segments = item._segments,
          length = segments.length,
          type,
          attrs = getTransform(item._matrix);

      if (matchShapes && length >= 2 && !item.hasHandles()) {
        if (length > 2) {
          type = item._closed ? 'polygon' : 'polyline';
          var parts = [];

          for (var i = 0; i < length; i++) {
            parts.push(formatter.point(segments[i]._point));
          }

          attrs.points = parts.join(' ');
        } else {
          type = 'line';
          var start = segments[0]._point,
              end = segments[1]._point;
          attrs.set({
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y
          });
        }
      } else {
        type = 'path';
        attrs.d = item.getPathData(null, options.precision);
      }

      return SvgElement.create(type, attrs, formatter);
    }

    function exportShape(item) {
      var type = item._type,
          radius = item._radius,
          attrs = getTransform(item._matrix, true, type !== 'rectangle');

      if (type === 'rectangle') {
        type = 'rect';
        var size = item._size,
            width = size.width,
            height = size.height;
        attrs.x -= width / 2;
        attrs.y -= height / 2;
        attrs.width = width;
        attrs.height = height;
        if (radius.isZero()) radius = null;
      }

      if (radius) {
        if (type === 'circle') {
          attrs.r = radius;
        } else {
          attrs.rx = radius.width;
          attrs.ry = radius.height;
        }
      }

      return SvgElement.create(type, attrs, formatter);
    }

    function exportCompoundPath(item, options) {
      var attrs = getTransform(item._matrix);
      var data = item.getPathData(null, options.precision);
      if (data) attrs.d = data;
      return SvgElement.create('path', attrs, formatter);
    }

    function exportSymbolItem(item, options) {
      var attrs = getTransform(item._matrix, true),
          definition = item._definition,
          node = getDefinition(definition, 'symbol'),
          definitionItem = definition._item,
          bounds = definitionItem.getStrokeBounds();

      if (!node) {
        node = SvgElement.create('symbol', {
          viewBox: formatter.rectangle(bounds)
        });
        node.appendChild(_exportSVG(definitionItem, options));
        setDefinition(definition, node, 'symbol');
      }

      attrs.href = '#' + node.id;
      attrs.x += bounds.x;
      attrs.y += bounds.y;
      attrs.width = bounds.width;
      attrs.height = bounds.height;
      attrs.overflow = 'visible';
      return SvgElement.create('use', attrs, formatter);
    }

    function exportGradient(color) {
      var gradientNode = getDefinition(color, 'color');

      if (!gradientNode) {
        var gradient = color.getGradient(),
            radial = gradient._radial,
            origin = color.getOrigin(),
            destination = color.getDestination(),
            attrs;

        if (radial) {
          attrs = {
            cx: origin.x,
            cy: origin.y,
            r: origin.getDistance(destination)
          };
          var highlight = color.getHighlight();

          if (highlight) {
            attrs.fx = highlight.x;
            attrs.fy = highlight.y;
          }
        } else {
          attrs = {
            x1: origin.x,
            y1: origin.y,
            x2: destination.x,
            y2: destination.y
          };
        }

        attrs.gradientUnits = 'userSpaceOnUse';
        gradientNode = SvgElement.create((radial ? 'radial' : 'linear') + 'Gradient', attrs, formatter);
        var stops = gradient._stops;

        for (var i = 0, l = stops.length; i < l; i++) {
          var stop = stops[i],
              stopColor = stop._color,
              alpha = stopColor.getAlpha(),
              offset = stop._offset;
          attrs = {
            offset: offset == null ? i / (l - 1) : offset
          };
          if (stopColor) attrs['stop-color'] = stopColor.toCSS(true);
          if (alpha < 1) attrs['stop-opacity'] = alpha;
          gradientNode.appendChild(SvgElement.create('stop', attrs, formatter));
        }

        setDefinition(color, gradientNode, 'color');
      }

      return 'url(#' + gradientNode.id + ')';
    }

    function exportText(item) {
      var node = SvgElement.create('text', getTransform(item._matrix, true), formatter);
      node.textContent = item._content;
      return node;
    }

    var exporters = {
      Group: exportGroup,
      Layer: exportGroup,
      Raster: exportRaster,
      Path: exportPath,
      Shape: exportShape,
      CompoundPath: exportCompoundPath,
      SymbolItem: exportSymbolItem,
      PointText: exportText
    };

    function applyStyle(item, node, isRoot) {
      var attrs = {},
          parent = !isRoot && item.getParent(),
          style = [];
      if (item._name != null) attrs.id = item._name;
      Base.each(SvgStyles, function (entry) {
        var get = entry.get,
            type = entry.type,
            value = item[get]();

        if (entry.exportFilter ? entry.exportFilter(item, value) : !parent || !Base.equals(parent[get](), value)) {
          if (type === 'color' && value != null) {
            var alpha = value.getAlpha();
            if (alpha < 1) attrs[entry.attribute + '-opacity'] = alpha;
          }

          if (type === 'style') {
            style.push(entry.attribute + ': ' + value);
          } else {
            attrs[entry.attribute] = value == null ? 'none' : type === 'color' ? value.gradient ? exportGradient(value, item) : value.toCSS(true) : type === 'array' ? value.join(',') : type === 'lookup' ? entry.toSVG[value] : value;
          }
        }
      });
      if (style.length) attrs.style = style.join(';');
      if (attrs.opacity === 1) delete attrs.opacity;
      if (!item._visible) attrs.visibility = 'hidden';
      return SvgElement.set(node, attrs, formatter);
    }

    var definitions;

    function getDefinition(item, type) {
      if (!definitions) definitions = {
        ids: {},
        svgs: {}
      };
      return item && definitions.svgs[type + '-' + (item._id || item.__id || (item.__id = UID.get('svg')))];
    }

    function setDefinition(item, node, type) {
      if (!definitions) getDefinition();
      var typeId = definitions.ids[type] = (definitions.ids[type] || 0) + 1;
      node.id = type + '-' + typeId;
      definitions.svgs[type + '-' + (item._id || item.__id)] = node;
    }

    function exportDefinitions(node, options) {
      var svg = node,
          defs = null;

      if (definitions) {
        svg = node.nodeName.toLowerCase() === 'svg' && node;

        for (var i in definitions.svgs) {
          if (!defs) {
            if (!svg) {
              svg = SvgElement.create('svg');
              svg.appendChild(node);
            }

            defs = svg.insertBefore(SvgElement.create('defs'), svg.firstChild);
          }

          defs.appendChild(definitions.svgs[i]);
        }

        definitions = null;
      }

      return options.asString ? new self.XMLSerializer().serializeToString(svg) : svg;
    }

    function _exportSVG(item, options, isRoot) {
      var exporter = exporters[item._class],
          node = exporter && exporter(item, options);

      if (node) {
        var onExport = options.onExport;
        if (onExport) node = onExport(item, node, options) || node;
        var data = JSON.stringify(item._data);
        if (data && data !== '{}' && data !== 'null') node.setAttribute('data-paper-data', data);
      }

      return node && applyStyle(item, node, isRoot);
    }

    function setOptions(options) {
      if (!options) options = {};
      formatter = new Formatter(options.precision);
      return options;
    }

    Item.inject({
      exportSVG: function exportSVG(options) {
        options = setOptions(options);
        return exportDefinitions(_exportSVG(this, options, true), options);
      }
    });
    Project.inject({
      exportSVG: function exportSVG(options) {
        options = setOptions(options);
        var children = this._children,
            view = this.getView(),
            bounds = Base.pick(options.bounds, 'view'),
            mx = options.matrix || bounds === 'view' && view._matrix,
            matrix = mx && Matrix.read([mx]),
            rect = bounds === 'view' ? new _Rectangle([0, 0], view.getViewSize()) : bounds === 'content' ? Item._getBounds(children, matrix, {
          stroke: true
        }).rect : _Rectangle.read([bounds], 0, {
          readNull: true
        }),
            attrs = {
          version: '1.1',
          xmlns: SvgElement.svg,
          'xmlns:xlink': SvgElement.xlink
        };

        if (rect) {
          attrs.width = rect.width;
          attrs.height = rect.height;
          if (rect.x || rect.x === 0 || rect.y || rect.y === 0) attrs.viewBox = formatter.rectangle(rect);
        }

        var node = SvgElement.create('svg', attrs, formatter),
            parent = node;

        if (matrix && !matrix.isIdentity()) {
          parent = node.appendChild(SvgElement.create('g', getTransform(matrix), formatter));
        }

        for (var i = 0, l = children.length; i < l; i++) {
          parent.appendChild(_exportSVG(children[i], options, true));
        }

        return exportDefinitions(node, options);
      }
    });
  }();
  new function () {
    var definitions = {},
        rootSize;

    function getValue(node, name, isString, allowNull, allowPercent, defaultValue) {
      var value = SvgElement.get(node, name) || defaultValue,
          res = value == null ? allowNull ? null : isString ? '' : 0 : isString ? value : parseFloat(value);
      return /%\s*$/.test(value) ? res / 100 * (allowPercent ? 1 : rootSize[/x|^width/.test(name) ? 'width' : 'height']) : res;
    }

    function getPoint(node, x, y, allowNull, allowPercent, defaultX, defaultY) {
      x = getValue(node, x || 'x', false, allowNull, allowPercent, defaultX);
      y = getValue(node, y || 'y', false, allowNull, allowPercent, defaultY);
      return allowNull && (x == null || y == null) ? null : new Point(x, y);
    }

    function getSize(node, w, h, allowNull, allowPercent) {
      w = getValue(node, w || 'width', false, allowNull, allowPercent);
      h = getValue(node, h || 'height', false, allowNull, allowPercent);
      return allowNull && (w == null || h == null) ? null : new Size(w, h);
    }

    function convertValue(value, type, lookup) {
      return value === 'none' ? null : type === 'number' ? parseFloat(value) : type === 'array' ? value ? value.split(/[\s,]+/g).map(parseFloat) : [] : type === 'color' ? getDefinition(value) || value : type === 'lookup' ? lookup[value] : value;
    }

    function importGroup(node, type, options, isRoot) {
      var nodes = node.childNodes,
          isClip = type === 'clippath',
          isDefs = type === 'defs',
          item = new Group(),
          project = item._project,
          currentStyle = project._currentStyle,
          children = [];

      if (!isClip && !isDefs) {
        item = applyAttributes(item, node, isRoot);
        project._currentStyle = item._style.clone();
      }

      if (isRoot) {
        var defs = node.querySelectorAll('defs');

        for (var i = 0, l = defs.length; i < l; i++) {
          importNode(defs[i], options, false);
        }
      }

      for (var i = 0, l = nodes.length; i < l; i++) {
        var childNode = nodes[i],
            child;
        if (childNode.nodeType === 1 && !/^defs$/i.test(childNode.nodeName) && (child = importNode(childNode, options, false)) && !(child instanceof SymbolDefinition)) children.push(child);
      }

      item.addChildren(children);
      if (isClip) item = applyAttributes(item.reduce(), node, isRoot);
      project._currentStyle = currentStyle;

      if (isClip || isDefs) {
        item.remove();
        item = null;
      }

      return item;
    }

    function importPoly(node, type) {
      var coords = node.getAttribute('points').match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g),
          points = [];

      for (var i = 0, l = coords.length; i < l; i += 2) {
        points.push(new Point(parseFloat(coords[i]), parseFloat(coords[i + 1])));
      }

      var path = new Path(points);
      if (type === 'polygon') path.closePath();
      return path;
    }

    function importPath(node) {
      return PathItem.create(node.getAttribute('d'));
    }

    function importGradient(node, type) {
      var id = (getValue(node, 'href', true) || '').substring(1),
          radial = type === 'radialgradient',
          gradient;

      if (id) {
        gradient = definitions[id].getGradient();

        if (gradient._radial ^ radial) {
          gradient = gradient.clone();
          gradient._radial = radial;
        }
      } else {
        var nodes = node.childNodes,
            stops = [];

        for (var i = 0, l = nodes.length; i < l; i++) {
          var child = nodes[i];
          if (child.nodeType === 1) stops.push(applyAttributes(new GradientStop(), child));
        }

        gradient = new Gradient(stops, radial);
      }

      var origin,
          destination,
          highlight,
          scaleToBounds = getValue(node, 'gradientUnits', true) !== 'userSpaceOnUse';

      if (radial) {
        origin = getPoint(node, 'cx', 'cy', false, scaleToBounds, '50%', '50%');
        destination = origin.add(getValue(node, 'r', false, false, scaleToBounds, '50%'), 0);
        highlight = getPoint(node, 'fx', 'fy', true, scaleToBounds);
      } else {
        origin = getPoint(node, 'x1', 'y1', false, scaleToBounds, '0%', '0%');
        destination = getPoint(node, 'x2', 'y2', false, scaleToBounds, '100%', '0%');
      }

      var color = applyAttributes(new Color(gradient, origin, destination, highlight), node);
      color._scaleToBounds = scaleToBounds;
      return null;
    }

    var importers = {
      '#document': function document(node, type, options, isRoot) {
        var nodes = node.childNodes;

        for (var i = 0, l = nodes.length; i < l; i++) {
          var child = nodes[i];
          if (child.nodeType === 1) return importNode(child, options, isRoot);
        }
      },
      g: importGroup,
      svg: importGroup,
      clippath: importGroup,
      polygon: importPoly,
      polyline: importPoly,
      path: importPath,
      lineargradient: importGradient,
      radialgradient: importGradient,
      image: function image(node) {
        var raster = new Raster(getValue(node, 'href', true));
        raster.on('load', function () {
          var size = getSize(node);
          this.setSize(size);
          var center = getPoint(node).add(size.divide(2));

          this._matrix.append(new Matrix().translate(center));
        });
        return raster;
      },
      symbol: function symbol(node, type, options, isRoot) {
        return new SymbolDefinition(importGroup(node, type, options, isRoot), true);
      },
      defs: importGroup,
      use: function use(node) {
        var id = (getValue(node, 'href', true) || '').substring(1),
            definition = definitions[id],
            point = getPoint(node);
        return definition ? definition instanceof SymbolDefinition ? definition.place(point) : definition.clone().translate(point) : null;
      },
      circle: function circle(node) {
        return new Shape.Circle(getPoint(node, 'cx', 'cy'), getValue(node, 'r'));
      },
      ellipse: function ellipse(node) {
        return new Shape.Ellipse({
          center: getPoint(node, 'cx', 'cy'),
          radius: getSize(node, 'rx', 'ry')
        });
      },
      rect: function rect(node) {
        return new Shape.Rectangle(new _Rectangle(getPoint(node), getSize(node)), getSize(node, 'rx', 'ry'));
      },
      line: function line(node) {
        return new Path.Line(getPoint(node, 'x1', 'y1'), getPoint(node, 'x2', 'y2'));
      },
      text: function text(node) {
        var text = new PointText(getPoint(node).add(getPoint(node, 'dx', 'dy')));
        text.setContent(node.textContent.trim() || '');
        return text;
      },
      switch: importGroup
    };

    function applyTransform(item, value, name, node) {
      if (item.transform) {
        var transforms = (node.getAttribute(name) || '').split(/\)\s*/g),
            matrix = new Matrix();

        for (var i = 0, l = transforms.length; i < l; i++) {
          var transform = transforms[i];
          if (!transform) break;
          var parts = transform.split(/\(\s*/),
              command = parts[0],
              v = parts[1].split(/[\s,]+/g);

          for (var j = 0, m = v.length; j < m; j++) {
            v[j] = parseFloat(v[j]);
          }

          switch (command) {
            case 'matrix':
              matrix.append(new Matrix(v[0], v[1], v[2], v[3], v[4], v[5]));
              break;

            case 'rotate':
              matrix.rotate(v[0], v[1] || 0, v[2] || 0);
              break;

            case 'translate':
              matrix.translate(v[0], v[1] || 0);
              break;

            case 'scale':
              matrix.scale(v);
              break;

            case 'skewX':
              matrix.skew(v[0], 0);
              break;

            case 'skewY':
              matrix.skew(0, v[0]);
              break;
          }
        }

        item.transform(matrix);
      }
    }

    function applyOpacity(item, value, name) {
      var key = name === 'fill-opacity' ? 'getFillColor' : 'getStrokeColor',
          color = item[key] && item[key]();
      if (color) color.setAlpha(parseFloat(value));
    }

    var attributes = Base.set(Base.each(SvgStyles, function (entry) {
      this[entry.attribute] = function (item, value) {
        if (item[entry.set]) {
          item[entry.set](convertValue(value, entry.type, entry.fromSVG));

          if (entry.type === 'color') {
            var color = item[entry.get]();

            if (color) {
              if (color._scaleToBounds) {
                var bounds = item.getBounds();
                color.transform(new Matrix().translate(bounds.getPoint()).scale(bounds.getSize()));
              }
            }
          }
        }
      };
    }, {}), {
      id: function id(item, value) {
        definitions[value] = item;
        if (item.setName) item.setName(value);
      },
      'clip-path': function clipPath(item, value) {
        var clip = getDefinition(value);

        if (clip) {
          clip = clip.clone();
          clip.setClipMask(true);

          if (item instanceof Group) {
            item.insertChild(0, clip);
          } else {
            return new Group(clip, item);
          }
        }
      },
      gradientTransform: applyTransform,
      transform: applyTransform,
      'fill-opacity': applyOpacity,
      'stroke-opacity': applyOpacity,
      visibility: function visibility(item, value) {
        if (item.setVisible) item.setVisible(value === 'visible');
      },
      display: function display(item, value) {
        if (item.setVisible) item.setVisible(value !== null);
      },
      'stop-color': function stopColor(item, value) {
        if (item.setColor) item.setColor(value);
      },
      'stop-opacity': function stopOpacity(item, value) {
        if (item._color) item._color.setAlpha(parseFloat(value));
      },
      offset: function offset(item, value) {
        if (item.setOffset) {
          var percent = value.match(/(.*)%$/);
          item.setOffset(percent ? percent[1] / 100 : parseFloat(value));
        }
      },
      viewBox: function viewBox(item, value, name, node, styles) {
        var rect = new _Rectangle(convertValue(value, 'array')),
            size = getSize(node, null, null, true),
            group,
            matrix;

        if (item instanceof Group) {
          var scale = size ? size.divide(rect.getSize()) : 1,
              matrix = new Matrix().scale(scale).translate(rect.getPoint().negate());
          group = item;
        } else if (item instanceof SymbolDefinition) {
          if (size) rect.setSize(size);
          group = item._item;
        }

        if (group) {
          if (getAttribute(node, 'overflow', styles) !== 'visible') {
            var clip = new Shape.Rectangle(rect);
            clip.setClipMask(true);
            group.addChild(clip);
          }

          if (matrix) group.transform(matrix);
        }
      }
    });

    function getAttribute(node, name, styles) {
      var attr = node.attributes[name],
          value = attr && attr.value;

      if (!value && node.style) {
        var style = Base.camelize(name);
        value = node.style[style];
        if (!value && styles.node[style] !== styles.parent[style]) value = styles.node[style];
      }

      return !value ? undefined : value === 'none' ? null : value;
    }

    function applyAttributes(item, node, isRoot) {
      var parent = node.parentNode,
          styles = {
        node: DomElement.getStyles(node) || {},
        parent: !isRoot && !/^defs$/i.test(parent.tagName) && DomElement.getStyles(parent) || {}
      };
      Base.each(attributes, function (apply, name) {
        var value = getAttribute(node, name, styles);
        item = value !== undefined && apply(item, value, name, node, styles) || item;
      });
      return item;
    }

    function getDefinition(value) {
      var match = value && value.match(/\((?:["'#]*)([^"')]+)/),
          name = match && match[1],
          res = name && definitions[window ? name.replace(window.location.href.split('#')[0] + '#', '') : name];

      if (res && res._scaleToBounds) {
        res = res.clone();
        res._scaleToBounds = true;
      }

      return res;
    }

    function importNode(node, options, isRoot) {
      var type = node.nodeName.toLowerCase(),
          isElement = type !== '#document',
          body = document.body,
          container,
          parent,
          next;

      if (isRoot && isElement) {
        rootSize = paper.getView().getSize();
        rootSize = getSize(node, null, null, true) || rootSize;
        container = SvgElement.create('svg', {
          style: 'stroke-width: 1px; stroke-miterlimit: 10'
        });
        parent = node.parentNode;
        next = node.nextSibling;
        container.appendChild(node);
        body.appendChild(container);
      }

      var settings = paper.settings,
          applyMatrix = settings.applyMatrix,
          insertItems = settings.insertItems;
      settings.applyMatrix = false;
      settings.insertItems = false;
      var importer = importers[type],
          item = importer && importer(node, type, options, isRoot) || null;
      settings.insertItems = insertItems;
      settings.applyMatrix = applyMatrix;

      if (item) {
        if (isElement && !(item instanceof Group)) item = applyAttributes(item, node, isRoot);
        var onImport = options.onImport,
            data = isElement && node.getAttribute('data-paper-data');
        if (onImport) item = onImport(node, item, options) || item;

        if (options.expandShapes && item instanceof Shape) {
          item.remove();
          item = item.toPath();
        }

        if (data) item._data = JSON.parse(data);
      }

      if (container) {
        body.removeChild(container);

        if (parent) {
          if (next) {
            parent.insertBefore(node, next);
          } else {
            parent.appendChild(node);
          }
        }
      }

      if (isRoot) {
        definitions = {};
        if (item && Base.pick(options.applyMatrix, applyMatrix)) item.matrix.apply(true, true);
      }

      return item;
    }

    function _importSVG(source, options, owner) {
      if (!source) return null;
      options = typeof options === 'function' ? {
        onLoad: options
      } : options || {};
      var scope = paper,
          item = null;

      function onLoad(svg) {
        try {
          var node = _typeof(svg) === 'object' ? svg : new self.DOMParser().parseFromString(svg.trim(), 'image/svg+xml');

          if (!node.nodeName) {
            node = null;
            throw new Error('Unsupported SVG source: ' + source);
          }

          paper = scope;
          item = importNode(node, options, true);

          if (!options || options.insert !== false) {
            owner._insertItem(undefined, item);
          }

          var onLoad = options.onLoad;
          if (onLoad) onLoad(item, svg);
        } catch (e) {
          onError(e);
        }
      }

      function onError(message, status) {
        var onError = options.onError;

        if (onError) {
          onError(message, status);
        } else {
          throw new Error(message);
        }
      }

      if (typeof source === 'string' && !/^[\s\S]*</.test(source)) {
        var node = document.getElementById(source);

        if (node) {
          onLoad(node);
        } else {
          Http.request({
            url: source,
            async: true,
            onLoad: onLoad,
            onError: onError
          });
        }
      } else if (typeof File !== 'undefined' && source instanceof File) {
        var reader = new FileReader();

        reader.onload = function () {
          onLoad(reader.result);
        };

        reader.onerror = function () {
          onError(reader.error);
        };

        return reader.readAsText(source);
      } else {
        onLoad(source);
      }

      return item;
    }

    Item.inject({
      importSVG: function importSVG(node, options) {
        return _importSVG(node, options, this);
      }
    });
    Project.inject({
      importSVG: function importSVG(node, options) {
        this.activate();
        return _importSVG(node, options, this);
      }
    });
  }();

  Base.exports.PaperScript = function () {
    var global = this,
        acorn = global.acorn;

    if (!acorn && typeof require !== 'undefined') {
      try {
        acorn = require('acorn');
      } catch (e) {}
    }

    if (!acorn) {
      var exports, module;
      acorn = exports = module = {};

      (function (root, mod) {
        if (_typeof(exports) == "object" && _typeof(module) == "object") return mod(exports);
        if (typeof define == "function" && define.amd) return define(["exports"], mod);
        mod(root.acorn || (root.acorn = {}));
      })(this, function (exports) {
        "use strict";

        exports.version = "0.5.0";
        var options, input, inputLen, sourceFile;

        exports.parse = function (inpt, opts) {
          input = String(inpt);
          inputLen = input.length;
          setOptions(opts);
          initTokenState();
          return parseTopLevel(options.program);
        };

        var defaultOptions = exports.defaultOptions = {
          ecmaVersion: 5,
          strictSemicolons: false,
          allowTrailingCommas: true,
          forbidReserved: false,
          allowReturnOutsideFunction: false,
          locations: false,
          onComment: null,
          ranges: false,
          program: null,
          sourceFile: null,
          directSourceFile: null
        };

        function setOptions(opts) {
          options = opts || {};

          for (var opt in defaultOptions) {
            if (!Object.prototype.hasOwnProperty.call(options, opt)) options[opt] = defaultOptions[opt];
          }

          sourceFile = options.sourceFile || null;
        }

        var getLineInfo = exports.getLineInfo = function (input, offset) {
          for (var line = 1, cur = 0;;) {
            lineBreak.lastIndex = cur;
            var match = lineBreak.exec(input);

            if (match && match.index < offset) {
              ++line;
              cur = match.index + match[0].length;
            } else break;
          }

          return {
            line: line,
            column: offset - cur
          };
        };

        exports.tokenize = function (inpt, opts) {
          input = String(inpt);
          inputLen = input.length;
          setOptions(opts);
          initTokenState();
          var t = {};

          function getToken(forceRegexp) {
            lastEnd = tokEnd;
            readToken(forceRegexp);
            t.start = tokStart;
            t.end = tokEnd;
            t.startLoc = tokStartLoc;
            t.endLoc = tokEndLoc;
            t.type = tokType;
            t.value = tokVal;
            return t;
          }

          getToken.jumpTo = function (pos, reAllowed) {
            tokPos = pos;

            if (options.locations) {
              tokCurLine = 1;
              tokLineStart = lineBreak.lastIndex = 0;
              var match;

              while ((match = lineBreak.exec(input)) && match.index < pos) {
                ++tokCurLine;
                tokLineStart = match.index + match[0].length;
              }
            }

            tokRegexpAllowed = reAllowed;
            skipSpace();
          };

          return getToken;
        };

        var tokPos;
        var tokStart, tokEnd;
        var tokStartLoc, tokEndLoc;
        var tokType, tokVal;
        var tokRegexpAllowed;
        var tokCurLine, tokLineStart;
        var lastStart, lastEnd, lastEndLoc;
        var inFunction, labels, strict;

        function raise(pos, message) {
          var loc = getLineInfo(input, pos);
          message += " (" + loc.line + ":" + loc.column + ")";
          var err = new SyntaxError(message);
          err.pos = pos;
          err.loc = loc;
          err.raisedAt = tokPos;
          throw err;
        }

        var empty = [];
        var _num = {
          type: "num"
        },
            _regexp = {
          type: "regexp"
        },
            _string = {
          type: "string"
        };
        var _name = {
          type: "name"
        },
            _eof = {
          type: "eof"
        };
        var _break = {
          keyword: "break"
        },
            _case = {
          keyword: "case",
          beforeExpr: true
        },
            _catch = {
          keyword: "catch"
        };
        var _continue = {
          keyword: "continue"
        },
            _debugger = {
          keyword: "debugger"
        },
            _default = {
          keyword: "default"
        };
        var _do = {
          keyword: "do",
          isLoop: true
        },
            _else = {
          keyword: "else",
          beforeExpr: true
        };
        var _finally = {
          keyword: "finally"
        },
            _for = {
          keyword: "for",
          isLoop: true
        },
            _function = {
          keyword: "function"
        };
        var _if = {
          keyword: "if"
        },
            _return = {
          keyword: "return",
          beforeExpr: true
        },
            _switch = {
          keyword: "switch"
        };
        var _throw = {
          keyword: "throw",
          beforeExpr: true
        },
            _try = {
          keyword: "try"
        },
            _var = {
          keyword: "var"
        };
        var _while = {
          keyword: "while",
          isLoop: true
        },
            _with = {
          keyword: "with"
        },
            _new = {
          keyword: "new",
          beforeExpr: true
        };
        var _this = {
          keyword: "this"
        };
        var _null = {
          keyword: "null",
          atomValue: null
        },
            _true = {
          keyword: "true",
          atomValue: true
        };
        var _false = {
          keyword: "false",
          atomValue: false
        };
        var _in = {
          keyword: "in",
          binop: 7,
          beforeExpr: true
        };
        var keywordTypes = {
          "break": _break,
          "case": _case,
          "catch": _catch,
          "continue": _continue,
          "debugger": _debugger,
          "default": _default,
          "do": _do,
          "else": _else,
          "finally": _finally,
          "for": _for,
          "function": _function,
          "if": _if,
          "return": _return,
          "switch": _switch,
          "throw": _throw,
          "try": _try,
          "var": _var,
          "while": _while,
          "with": _with,
          "null": _null,
          "true": _true,
          "false": _false,
          "new": _new,
          "in": _in,
          "instanceof": {
            keyword: "instanceof",
            binop: 7,
            beforeExpr: true
          },
          "this": _this,
          "typeof": {
            keyword: "typeof",
            prefix: true,
            beforeExpr: true
          },
          "void": {
            keyword: "void",
            prefix: true,
            beforeExpr: true
          },
          "delete": {
            keyword: "delete",
            prefix: true,
            beforeExpr: true
          }
        };
        var _bracketL = {
          type: "[",
          beforeExpr: true
        },
            _bracketR = {
          type: "]"
        },
            _braceL = {
          type: "{",
          beforeExpr: true
        };
        var _braceR = {
          type: "}"
        },
            _parenL = {
          type: "(",
          beforeExpr: true
        },
            _parenR = {
          type: ")"
        };
        var _comma = {
          type: ",",
          beforeExpr: true
        },
            _semi = {
          type: ";",
          beforeExpr: true
        };
        var _colon = {
          type: ":",
          beforeExpr: true
        },
            _dot = {
          type: "."
        },
            _question = {
          type: "?",
          beforeExpr: true
        };
        var _slash = {
          binop: 10,
          beforeExpr: true
        },
            _eq = {
          isAssign: true,
          beforeExpr: true
        };
        var _assign = {
          isAssign: true,
          beforeExpr: true
        };
        var _incDec = {
          postfix: true,
          prefix: true,
          isUpdate: true
        },
            _prefix = {
          prefix: true,
          beforeExpr: true
        };
        var _logicalOR = {
          binop: 1,
          beforeExpr: true
        };
        var _logicalAND = {
          binop: 2,
          beforeExpr: true
        };
        var _bitwiseOR = {
          binop: 3,
          beforeExpr: true
        };
        var _bitwiseXOR = {
          binop: 4,
          beforeExpr: true
        };
        var _bitwiseAND = {
          binop: 5,
          beforeExpr: true
        };
        var _equality = {
          binop: 6,
          beforeExpr: true
        };
        var _relational = {
          binop: 7,
          beforeExpr: true
        };
        var _bitShift = {
          binop: 8,
          beforeExpr: true
        };
        var _plusMin = {
          binop: 9,
          prefix: true,
          beforeExpr: true
        };
        var _multiplyModulo = {
          binop: 10,
          beforeExpr: true
        };
        exports.tokTypes = {
          bracketL: _bracketL,
          bracketR: _bracketR,
          braceL: _braceL,
          braceR: _braceR,
          parenL: _parenL,
          parenR: _parenR,
          comma: _comma,
          semi: _semi,
          colon: _colon,
          dot: _dot,
          question: _question,
          slash: _slash,
          eq: _eq,
          name: _name,
          eof: _eof,
          num: _num,
          regexp: _regexp,
          string: _string
        };

        for (var kw in keywordTypes) {
          exports.tokTypes["_" + kw] = keywordTypes[kw];
        }

        function makePredicate(words) {
          words = words.split(" ");
          var f = "",
              cats = [];

          out: for (var i = 0; i < words.length; ++i) {
            for (var j = 0; j < cats.length; ++j) {
              if (cats[j][0].length == words[i].length) {
                cats[j].push(words[i]);
                continue out;
              }
            }

            cats.push([words[i]]);
          }

          function compareTo(arr) {
            if (arr.length == 1) return f += "return str === " + JSON.stringify(arr[0]) + ";";
            f += "switch(str){";

            for (var i = 0; i < arr.length; ++i) {
              f += "case " + JSON.stringify(arr[i]) + ":";
            }

            f += "return true}return false;";
          }

          if (cats.length > 3) {
            cats.sort(function (a, b) {
              return b.length - a.length;
            });
            f += "switch(str.length){";

            for (var i = 0; i < cats.length; ++i) {
              var cat = cats[i];
              f += "case " + cat[0].length + ":";
              compareTo(cat);
            }

            f += "}";
          } else {
            compareTo(words);
          }

          return new Function("str", f);
        }

        var isReservedWord3 = makePredicate("abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile");
        var isReservedWord5 = makePredicate("class enum extends super const export import");
        var isStrictReservedWord = makePredicate("implements interface let package private protected public static yield");
        var isStrictBadIdWord = makePredicate("eval arguments");
        var isKeyword = makePredicate("break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this");
        var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
        var nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
        var nonASCIIidentifierChars = "\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u0620-\u0649\u0672-\u06D3\u06E7-\u06E8\u06FB-\u06FC\u0730-\u074A\u0800-\u0814\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0840-\u0857\u08E4-\u08FE\u0900-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962-\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09D7\u09DF-\u09E0\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5F-\u0B60\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2-\u0CE3\u0CE6-\u0CEF\u0D02\u0D03\u0D46-\u0D48\u0D57\u0D62-\u0D63\u0D66-\u0D6F\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E34-\u0E3A\u0E40-\u0E45\u0E50-\u0E59\u0EB4-\u0EB9\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F41-\u0F47\u0F71-\u0F84\u0F86-\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1029\u1040-\u1049\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u170E-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17B2\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1920-\u192B\u1930-\u193B\u1951-\u196D\u19B0-\u19C0\u19C8-\u19C9\u19D0-\u19D9\u1A00-\u1A15\u1A20-\u1A53\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1B46-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C00-\u1C22\u1C40-\u1C49\u1C5B-\u1C7D\u1CD0-\u1CD2\u1D00-\u1DBE\u1E01-\u1F15\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2D81-\u2D96\u2DE0-\u2DFF\u3021-\u3028\u3099\u309A\uA640-\uA66D\uA674-\uA67D\uA69F\uA6F0-\uA6F1\uA7F8-\uA800\uA806\uA80B\uA823-\uA827\uA880-\uA881\uA8B4-\uA8C4\uA8D0-\uA8D9\uA8F3-\uA8F7\uA900-\uA909\uA926-\uA92D\uA930-\uA945\uA980-\uA983\uA9B3-\uA9C0\uAA00-\uAA27\uAA40-\uAA41\uAA4C-\uAA4D\uAA50-\uAA59\uAA7B\uAAE0-\uAAE9\uAAF2-\uAAF3\uABC0-\uABE1\uABEC\uABED\uABF0-\uABF9\uFB20-\uFB28\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F";
        var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
        var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
        var newline = /[\n\r\u2028\u2029]/;
        var lineBreak = /\r\n|[\n\r\u2028\u2029]/g;

        var isIdentifierStart = exports.isIdentifierStart = function (code) {
          if (code < 65) return code === 36;
          if (code < 91) return true;
          if (code < 97) return code === 95;
          if (code < 123) return true;
          return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
        };

        var isIdentifierChar = exports.isIdentifierChar = function (code) {
          if (code < 48) return code === 36;
          if (code < 58) return true;
          if (code < 65) return false;
          if (code < 91) return true;
          if (code < 97) return code === 95;
          if (code < 123) return true;
          return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
        };

        function line_loc_t() {
          this.line = tokCurLine;
          this.column = tokPos - tokLineStart;
        }

        function initTokenState() {
          tokCurLine = 1;
          tokPos = tokLineStart = 0;
          tokRegexpAllowed = true;
          skipSpace();
        }

        function finishToken(type, val) {
          tokEnd = tokPos;
          if (options.locations) tokEndLoc = new line_loc_t();
          tokType = type;
          skipSpace();
          tokVal = val;
          tokRegexpAllowed = type.beforeExpr;
        }

        function skipBlockComment() {
          var startLoc = options.onComment && options.locations && new line_loc_t();
          var start = tokPos,
              end = input.indexOf("*/", tokPos += 2);
          if (end === -1) raise(tokPos - 2, "Unterminated comment");
          tokPos = end + 2;

          if (options.locations) {
            lineBreak.lastIndex = start;
            var match;

            while ((match = lineBreak.exec(input)) && match.index < tokPos) {
              ++tokCurLine;
              tokLineStart = match.index + match[0].length;
            }
          }

          if (options.onComment) options.onComment(true, input.slice(start + 2, end), start, tokPos, startLoc, options.locations && new line_loc_t());
        }

        function skipLineComment() {
          var start = tokPos;
          var startLoc = options.onComment && options.locations && new line_loc_t();
          var ch = input.charCodeAt(tokPos += 2);

          while (tokPos < inputLen && ch !== 10 && ch !== 13 && ch !== 8232 && ch !== 8233) {
            ++tokPos;
            ch = input.charCodeAt(tokPos);
          }

          if (options.onComment) options.onComment(false, input.slice(start + 2, tokPos), start, tokPos, startLoc, options.locations && new line_loc_t());
        }

        function skipSpace() {
          while (tokPos < inputLen) {
            var ch = input.charCodeAt(tokPos);

            if (ch === 32) {
              ++tokPos;
            } else if (ch === 13) {
              ++tokPos;
              var next = input.charCodeAt(tokPos);

              if (next === 10) {
                ++tokPos;
              }

              if (options.locations) {
                ++tokCurLine;
                tokLineStart = tokPos;
              }
            } else if (ch === 10 || ch === 8232 || ch === 8233) {
              ++tokPos;

              if (options.locations) {
                ++tokCurLine;
                tokLineStart = tokPos;
              }
            } else if (ch > 8 && ch < 14) {
              ++tokPos;
            } else if (ch === 47) {
              var next = input.charCodeAt(tokPos + 1);

              if (next === 42) {
                skipBlockComment();
              } else if (next === 47) {
                skipLineComment();
              } else break;
            } else if (ch === 160) {
              ++tokPos;
            } else if (ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
              ++tokPos;
            } else {
              break;
            }
          }
        }

        function readToken_dot() {
          var next = input.charCodeAt(tokPos + 1);
          if (next >= 48 && next <= 57) return readNumber(true);
          ++tokPos;
          return finishToken(_dot);
        }

        function readToken_slash() {
          var next = input.charCodeAt(tokPos + 1);

          if (tokRegexpAllowed) {
            ++tokPos;
            return readRegexp();
          }

          if (next === 61) return finishOp(_assign, 2);
          return finishOp(_slash, 1);
        }

        function readToken_mult_modulo() {
          var next = input.charCodeAt(tokPos + 1);
          if (next === 61) return finishOp(_assign, 2);
          return finishOp(_multiplyModulo, 1);
        }

        function readToken_pipe_amp(code) {
          var next = input.charCodeAt(tokPos + 1);
          if (next === code) return finishOp(code === 124 ? _logicalOR : _logicalAND, 2);
          if (next === 61) return finishOp(_assign, 2);
          return finishOp(code === 124 ? _bitwiseOR : _bitwiseAND, 1);
        }

        function readToken_caret() {
          var next = input.charCodeAt(tokPos + 1);
          if (next === 61) return finishOp(_assign, 2);
          return finishOp(_bitwiseXOR, 1);
        }

        function readToken_plus_min(code) {
          var next = input.charCodeAt(tokPos + 1);

          if (next === code) {
            if (next == 45 && input.charCodeAt(tokPos + 2) == 62 && newline.test(input.slice(lastEnd, tokPos))) {
              tokPos += 3;
              skipLineComment();
              skipSpace();
              return readToken();
            }

            return finishOp(_incDec, 2);
          }

          if (next === 61) return finishOp(_assign, 2);
          return finishOp(_plusMin, 1);
        }

        function readToken_lt_gt(code) {
          var next = input.charCodeAt(tokPos + 1);
          var size = 1;

          if (next === code) {
            size = code === 62 && input.charCodeAt(tokPos + 2) === 62 ? 3 : 2;
            if (input.charCodeAt(tokPos + size) === 61) return finishOp(_assign, size + 1);
            return finishOp(_bitShift, size);
          }

          if (next == 33 && code == 60 && input.charCodeAt(tokPos + 2) == 45 && input.charCodeAt(tokPos + 3) == 45) {
            tokPos += 4;
            skipLineComment();
            skipSpace();
            return readToken();
          }

          if (next === 61) size = input.charCodeAt(tokPos + 2) === 61 ? 3 : 2;
          return finishOp(_relational, size);
        }

        function readToken_eq_excl(code) {
          var next = input.charCodeAt(tokPos + 1);
          if (next === 61) return finishOp(_equality, input.charCodeAt(tokPos + 2) === 61 ? 3 : 2);
          return finishOp(code === 61 ? _eq : _prefix, 1);
        }

        function getTokenFromCode(code) {
          switch (code) {
            case 46:
              return readToken_dot();

            case 40:
              ++tokPos;
              return finishToken(_parenL);

            case 41:
              ++tokPos;
              return finishToken(_parenR);

            case 59:
              ++tokPos;
              return finishToken(_semi);

            case 44:
              ++tokPos;
              return finishToken(_comma);

            case 91:
              ++tokPos;
              return finishToken(_bracketL);

            case 93:
              ++tokPos;
              return finishToken(_bracketR);

            case 123:
              ++tokPos;
              return finishToken(_braceL);

            case 125:
              ++tokPos;
              return finishToken(_braceR);

            case 58:
              ++tokPos;
              return finishToken(_colon);

            case 63:
              ++tokPos;
              return finishToken(_question);

            case 48:
              var next = input.charCodeAt(tokPos + 1);
              if (next === 120 || next === 88) return readHexNumber();

            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              return readNumber(false);

            case 34:
            case 39:
              return readString(code);

            case 47:
              return readToken_slash(code);

            case 37:
            case 42:
              return readToken_mult_modulo();

            case 124:
            case 38:
              return readToken_pipe_amp(code);

            case 94:
              return readToken_caret();

            case 43:
            case 45:
              return readToken_plus_min(code);

            case 60:
            case 62:
              return readToken_lt_gt(code);

            case 61:
            case 33:
              return readToken_eq_excl(code);

            case 126:
              return finishOp(_prefix, 1);
          }

          return false;
        }

        function readToken(forceRegexp) {
          if (!forceRegexp) tokStart = tokPos;else tokPos = tokStart + 1;
          if (options.locations) tokStartLoc = new line_loc_t();
          if (forceRegexp) return readRegexp();
          if (tokPos >= inputLen) return finishToken(_eof);
          var code = input.charCodeAt(tokPos);
          if (isIdentifierStart(code) || code === 92) return readWord();
          var tok = getTokenFromCode(code);

          if (tok === false) {
            var ch = String.fromCharCode(code);
            if (ch === "\\" || nonASCIIidentifierStart.test(ch)) return readWord();
            raise(tokPos, "Unexpected character '" + ch + "'");
          }

          return tok;
        }

        function finishOp(type, size) {
          var str = input.slice(tokPos, tokPos + size);
          tokPos += size;
          finishToken(type, str);
        }

        function readRegexp() {
          var content = "",
              escaped,
              inClass,
              start = tokPos;

          for (;;) {
            if (tokPos >= inputLen) raise(start, "Unterminated regular expression");
            var ch = input.charAt(tokPos);
            if (newline.test(ch)) raise(start, "Unterminated regular expression");

            if (!escaped) {
              if (ch === "[") inClass = true;else if (ch === "]" && inClass) inClass = false;else if (ch === "/" && !inClass) break;
              escaped = ch === "\\";
            } else escaped = false;

            ++tokPos;
          }

          var content = input.slice(start, tokPos);
          ++tokPos;
          var mods = readWord1();
          if (mods && !/^[gmsiy]*$/.test(mods)) raise(start, "Invalid regexp flag");

          try {
            var value = new RegExp(content, mods);
          } catch (e) {
            if (e instanceof SyntaxError) raise(start, e.message);
            raise(e);
          }

          return finishToken(_regexp, value);
        }

        function readInt(radix, len) {
          var start = tokPos,
              total = 0;

          for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
            var code = input.charCodeAt(tokPos),
                val;
            if (code >= 97) val = code - 97 + 10;else if (code >= 65) val = code - 65 + 10;else if (code >= 48 && code <= 57) val = code - 48;else val = Infinity;
            if (val >= radix) break;
            ++tokPos;
            total = total * radix + val;
          }

          if (tokPos === start || len != null && tokPos - start !== len) return null;
          return total;
        }

        function readHexNumber() {
          tokPos += 2;
          var val = readInt(16);
          if (val == null) raise(tokStart + 2, "Expected hexadecimal number");
          if (isIdentifierStart(input.charCodeAt(tokPos))) raise(tokPos, "Identifier directly after number");
          return finishToken(_num, val);
        }

        function readNumber(startsWithDot) {
          var start = tokPos,
              isFloat = false,
              octal = input.charCodeAt(tokPos) === 48;
          if (!startsWithDot && readInt(10) === null) raise(start, "Invalid number");

          if (input.charCodeAt(tokPos) === 46) {
            ++tokPos;
            readInt(10);
            isFloat = true;
          }

          var next = input.charCodeAt(tokPos);

          if (next === 69 || next === 101) {
            next = input.charCodeAt(++tokPos);
            if (next === 43 || next === 45) ++tokPos;
            if (readInt(10) === null) raise(start, "Invalid number");
            isFloat = true;
          }

          if (isIdentifierStart(input.charCodeAt(tokPos))) raise(tokPos, "Identifier directly after number");
          var str = input.slice(start, tokPos),
              val;
          if (isFloat) val = parseFloat(str);else if (!octal || str.length === 1) val = parseInt(str, 10);else if (/[89]/.test(str) || strict) raise(start, "Invalid number");else val = parseInt(str, 8);
          return finishToken(_num, val);
        }

        function readString(quote) {
          tokPos++;
          var out = "";

          for (;;) {
            if (tokPos >= inputLen) raise(tokStart, "Unterminated string constant");
            var ch = input.charCodeAt(tokPos);

            if (ch === quote) {
              ++tokPos;
              return finishToken(_string, out);
            }

            if (ch === 92) {
              ch = input.charCodeAt(++tokPos);
              var octal = /^[0-7]+/.exec(input.slice(tokPos, tokPos + 3));
              if (octal) octal = octal[0];

              while (octal && parseInt(octal, 8) > 255) {
                octal = octal.slice(0, -1);
              }

              if (octal === "0") octal = null;
              ++tokPos;

              if (octal) {
                if (strict) raise(tokPos - 2, "Octal literal in strict mode");
                out += String.fromCharCode(parseInt(octal, 8));
                tokPos += octal.length - 1;
              } else {
                switch (ch) {
                  case 110:
                    out += "\n";
                    break;

                  case 114:
                    out += "\r";
                    break;

                  case 120:
                    out += String.fromCharCode(readHexChar(2));
                    break;

                  case 117:
                    out += String.fromCharCode(readHexChar(4));
                    break;

                  case 85:
                    out += String.fromCharCode(readHexChar(8));
                    break;

                  case 116:
                    out += "\t";
                    break;

                  case 98:
                    out += "\b";
                    break;

                  case 118:
                    out += "\x0B";
                    break;

                  case 102:
                    out += "\f";
                    break;

                  case 48:
                    out += "\0";
                    break;

                  case 13:
                    if (input.charCodeAt(tokPos) === 10) ++tokPos;

                  case 10:
                    if (options.locations) {
                      tokLineStart = tokPos;
                      ++tokCurLine;
                    }

                    break;

                  default:
                    out += String.fromCharCode(ch);
                    break;
                }
              }
            } else {
              if (ch === 13 || ch === 10 || ch === 8232 || ch === 8233) raise(tokStart, "Unterminated string constant");
              out += String.fromCharCode(ch);
              ++tokPos;
            }
          }
        }

        function readHexChar(len) {
          var n = readInt(16, len);
          if (n === null) raise(tokStart, "Bad character escape sequence");
          return n;
        }

        var containsEsc;

        function readWord1() {
          containsEsc = false;
          var word,
              first = true,
              start = tokPos;

          for (;;) {
            var ch = input.charCodeAt(tokPos);

            if (isIdentifierChar(ch)) {
              if (containsEsc) word += input.charAt(tokPos);
              ++tokPos;
            } else if (ch === 92) {
              if (!containsEsc) word = input.slice(start, tokPos);
              containsEsc = true;
              if (input.charCodeAt(++tokPos) != 117) raise(tokPos, "Expecting Unicode escape sequence \\uXXXX");
              ++tokPos;
              var esc = readHexChar(4);
              var escStr = String.fromCharCode(esc);
              if (!escStr) raise(tokPos - 1, "Invalid Unicode escape");
              if (!(first ? isIdentifierStart(esc) : isIdentifierChar(esc))) raise(tokPos - 4, "Invalid Unicode escape");
              word += escStr;
            } else {
              break;
            }

            first = false;
          }

          return containsEsc ? word : input.slice(start, tokPos);
        }

        function readWord() {
          var word = readWord1();
          var type = _name;
          if (!containsEsc && isKeyword(word)) type = keywordTypes[word];
          return finishToken(type, word);
        }

        function next() {
          lastStart = tokStart;
          lastEnd = tokEnd;
          lastEndLoc = tokEndLoc;
          readToken();
        }

        function setStrict(strct) {
          strict = strct;
          tokPos = tokStart;

          if (options.locations) {
            while (tokPos < tokLineStart) {
              tokLineStart = input.lastIndexOf("\n", tokLineStart - 2) + 1;
              --tokCurLine;
            }
          }

          skipSpace();
          readToken();
        }

        function node_t() {
          this.type = null;
          this.start = tokStart;
          this.end = null;
        }

        function node_loc_t() {
          this.start = tokStartLoc;
          this.end = null;
          if (sourceFile !== null) this.source = sourceFile;
        }

        function startNode() {
          var node = new node_t();
          if (options.locations) node.loc = new node_loc_t();
          if (options.directSourceFile) node.sourceFile = options.directSourceFile;
          if (options.ranges) node.range = [tokStart, 0];
          return node;
        }

        function startNodeFrom(other) {
          var node = new node_t();
          node.start = other.start;

          if (options.locations) {
            node.loc = new node_loc_t();
            node.loc.start = other.loc.start;
          }

          if (options.ranges) node.range = [other.range[0], 0];
          return node;
        }

        function finishNode(node, type) {
          node.type = type;
          node.end = lastEnd;
          if (options.locations) node.loc.end = lastEndLoc;
          if (options.ranges) node.range[1] = lastEnd;
          return node;
        }

        function isUseStrict(stmt) {
          return options.ecmaVersion >= 5 && stmt.type === "ExpressionStatement" && stmt.expression.type === "Literal" && stmt.expression.value === "use strict";
        }

        function eat(type) {
          if (tokType === type) {
            next();
            return true;
          }
        }

        function canInsertSemicolon() {
          return !options.strictSemicolons && (tokType === _eof || tokType === _braceR || newline.test(input.slice(lastEnd, tokStart)));
        }

        function semicolon() {
          if (!eat(_semi) && !canInsertSemicolon()) unexpected();
        }

        function expect(type) {
          if (tokType === type) next();else unexpected();
        }

        function unexpected() {
          raise(tokStart, "Unexpected token");
        }

        function checkLVal(expr) {
          if (expr.type !== "Identifier" && expr.type !== "MemberExpression") raise(expr.start, "Assigning to rvalue");
          if (strict && expr.type === "Identifier" && isStrictBadIdWord(expr.name)) raise(expr.start, "Assigning to " + expr.name + " in strict mode");
        }

        function parseTopLevel(program) {
          lastStart = lastEnd = tokPos;
          if (options.locations) lastEndLoc = new line_loc_t();
          inFunction = strict = null;
          labels = [];
          readToken();
          var node = program || startNode(),
              first = true;
          if (!program) node.body = [];

          while (tokType !== _eof) {
            var stmt = parseStatement();
            node.body.push(stmt);
            if (first && isUseStrict(stmt)) setStrict(true);
            first = false;
          }

          return finishNode(node, "Program");
        }

        var loopLabel = {
          kind: "loop"
        },
            switchLabel = {
          kind: "switch"
        };

        function parseStatement() {
          if (tokType === _slash || tokType === _assign && tokVal == "/=") readToken(true);
          var starttype = tokType,
              node = startNode();

          switch (starttype) {
            case _break:
            case _continue:
              next();
              var isBreak = starttype === _break;
              if (eat(_semi) || canInsertSemicolon()) node.label = null;else if (tokType !== _name) unexpected();else {
                node.label = parseIdent();
                semicolon();
              }

              for (var i = 0; i < labels.length; ++i) {
                var lab = labels[i];

                if (node.label == null || lab.name === node.label.name) {
                  if (lab.kind != null && (isBreak || lab.kind === "loop")) break;
                  if (node.label && isBreak) break;
                }
              }

              if (i === labels.length) raise(node.start, "Unsyntactic " + starttype.keyword);
              return finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");

            case _debugger:
              next();
              semicolon();
              return finishNode(node, "DebuggerStatement");

            case _do:
              next();
              labels.push(loopLabel);
              node.body = parseStatement();
              labels.pop();
              expect(_while);
              node.test = parseParenExpression();
              semicolon();
              return finishNode(node, "DoWhileStatement");

            case _for:
              next();
              labels.push(loopLabel);
              expect(_parenL);
              if (tokType === _semi) return parseFor(node, null);

              if (tokType === _var) {
                var init = startNode();
                next();
                parseVar(init, true);
                finishNode(init, "VariableDeclaration");
                if (init.declarations.length === 1 && eat(_in)) return parseForIn(node, init);
                return parseFor(node, init);
              }

              var init = parseExpression(false, true);

              if (eat(_in)) {
                checkLVal(init);
                return parseForIn(node, init);
              }

              return parseFor(node, init);

            case _function:
              next();
              return parseFunction(node, true);

            case _if:
              next();
              node.test = parseParenExpression();
              node.consequent = parseStatement();
              node.alternate = eat(_else) ? parseStatement() : null;
              return finishNode(node, "IfStatement");

            case _return:
              if (!inFunction && !options.allowReturnOutsideFunction) raise(tokStart, "'return' outside of function");
              next();
              if (eat(_semi) || canInsertSemicolon()) node.argument = null;else {
                node.argument = parseExpression();
                semicolon();
              }
              return finishNode(node, "ReturnStatement");

            case _switch:
              next();
              node.discriminant = parseParenExpression();
              node.cases = [];
              expect(_braceL);
              labels.push(switchLabel);

              for (var cur, sawDefault; tokType != _braceR;) {
                if (tokType === _case || tokType === _default) {
                  var isCase = tokType === _case;
                  if (cur) finishNode(cur, "SwitchCase");
                  node.cases.push(cur = startNode());
                  cur.consequent = [];
                  next();
                  if (isCase) cur.test = parseExpression();else {
                    if (sawDefault) raise(lastStart, "Multiple default clauses");
                    sawDefault = true;
                    cur.test = null;
                  }
                  expect(_colon);
                } else {
                  if (!cur) unexpected();
                  cur.consequent.push(parseStatement());
                }
              }

              if (cur) finishNode(cur, "SwitchCase");
              next();
              labels.pop();
              return finishNode(node, "SwitchStatement");

            case _throw:
              next();
              if (newline.test(input.slice(lastEnd, tokStart))) raise(lastEnd, "Illegal newline after throw");
              node.argument = parseExpression();
              semicolon();
              return finishNode(node, "ThrowStatement");

            case _try:
              next();
              node.block = parseBlock();
              node.handler = null;

              if (tokType === _catch) {
                var clause = startNode();
                next();
                expect(_parenL);
                clause.param = parseIdent();
                if (strict && isStrictBadIdWord(clause.param.name)) raise(clause.param.start, "Binding " + clause.param.name + " in strict mode");
                expect(_parenR);
                clause.guard = null;
                clause.body = parseBlock();
                node.handler = finishNode(clause, "CatchClause");
              }

              node.guardedHandlers = empty;
              node.finalizer = eat(_finally) ? parseBlock() : null;
              if (!node.handler && !node.finalizer) raise(node.start, "Missing catch or finally clause");
              return finishNode(node, "TryStatement");

            case _var:
              next();
              parseVar(node);
              semicolon();
              return finishNode(node, "VariableDeclaration");

            case _while:
              next();
              node.test = parseParenExpression();
              labels.push(loopLabel);
              node.body = parseStatement();
              labels.pop();
              return finishNode(node, "WhileStatement");

            case _with:
              if (strict) raise(tokStart, "'with' in strict mode");
              next();
              node.object = parseParenExpression();
              node.body = parseStatement();
              return finishNode(node, "WithStatement");

            case _braceL:
              return parseBlock();

            case _semi:
              next();
              return finishNode(node, "EmptyStatement");

            default:
              var maybeName = tokVal,
                  expr = parseExpression();

              if (starttype === _name && expr.type === "Identifier" && eat(_colon)) {
                for (var i = 0; i < labels.length; ++i) {
                  if (labels[i].name === maybeName) raise(expr.start, "Label '" + maybeName + "' is already declared");
                }

                var kind = tokType.isLoop ? "loop" : tokType === _switch ? "switch" : null;
                labels.push({
                  name: maybeName,
                  kind: kind
                });
                node.body = parseStatement();
                labels.pop();
                node.label = expr;
                return finishNode(node, "LabeledStatement");
              } else {
                node.expression = expr;
                semicolon();
                return finishNode(node, "ExpressionStatement");
              }

          }
        }

        function parseParenExpression() {
          expect(_parenL);
          var val = parseExpression();
          expect(_parenR);
          return val;
        }

        function parseBlock(allowStrict) {
          var node = startNode(),
              first = true,
              strict = false,
              oldStrict;
          node.body = [];
          expect(_braceL);

          while (!eat(_braceR)) {
            var stmt = parseStatement();
            node.body.push(stmt);

            if (first && allowStrict && isUseStrict(stmt)) {
              oldStrict = strict;
              setStrict(strict = true);
            }

            first = false;
          }

          if (strict && !oldStrict) setStrict(false);
          return finishNode(node, "BlockStatement");
        }

        function parseFor(node, init) {
          node.init = init;
          expect(_semi);
          node.test = tokType === _semi ? null : parseExpression();
          expect(_semi);
          node.update = tokType === _parenR ? null : parseExpression();
          expect(_parenR);
          node.body = parseStatement();
          labels.pop();
          return finishNode(node, "ForStatement");
        }

        function parseForIn(node, init) {
          node.left = init;
          node.right = parseExpression();
          expect(_parenR);
          node.body = parseStatement();
          labels.pop();
          return finishNode(node, "ForInStatement");
        }

        function parseVar(node, noIn) {
          node.declarations = [];
          node.kind = "var";

          for (;;) {
            var decl = startNode();
            decl.id = parseIdent();
            if (strict && isStrictBadIdWord(decl.id.name)) raise(decl.id.start, "Binding " + decl.id.name + " in strict mode");
            decl.init = eat(_eq) ? parseExpression(true, noIn) : null;
            node.declarations.push(finishNode(decl, "VariableDeclarator"));
            if (!eat(_comma)) break;
          }

          return node;
        }

        function parseExpression(noComma, noIn) {
          var expr = parseMaybeAssign(noIn);

          if (!noComma && tokType === _comma) {
            var node = startNodeFrom(expr);
            node.expressions = [expr];

            while (eat(_comma)) {
              node.expressions.push(parseMaybeAssign(noIn));
            }

            return finishNode(node, "SequenceExpression");
          }

          return expr;
        }

        function parseMaybeAssign(noIn) {
          var left = parseMaybeConditional(noIn);

          if (tokType.isAssign) {
            var node = startNodeFrom(left);
            node.operator = tokVal;
            node.left = left;
            next();
            node.right = parseMaybeAssign(noIn);
            checkLVal(left);
            return finishNode(node, "AssignmentExpression");
          }

          return left;
        }

        function parseMaybeConditional(noIn) {
          var expr = parseExprOps(noIn);

          if (eat(_question)) {
            var node = startNodeFrom(expr);
            node.test = expr;
            node.consequent = parseExpression(true);
            expect(_colon);
            node.alternate = parseExpression(true, noIn);
            return finishNode(node, "ConditionalExpression");
          }

          return expr;
        }

        function parseExprOps(noIn) {
          return parseExprOp(parseMaybeUnary(), -1, noIn);
        }

        function parseExprOp(left, minPrec, noIn) {
          var prec = tokType.binop;

          if (prec != null && (!noIn || tokType !== _in)) {
            if (prec > minPrec) {
              var node = startNodeFrom(left);
              node.left = left;
              node.operator = tokVal;
              var op = tokType;
              next();
              node.right = parseExprOp(parseMaybeUnary(), prec, noIn);
              var exprNode = finishNode(node, op === _logicalOR || op === _logicalAND ? "LogicalExpression" : "BinaryExpression");
              return parseExprOp(exprNode, minPrec, noIn);
            }
          }

          return left;
        }

        function parseMaybeUnary() {
          if (tokType.prefix) {
            var node = startNode(),
                update = tokType.isUpdate;
            node.operator = tokVal;
            node.prefix = true;
            tokRegexpAllowed = true;
            next();
            node.argument = parseMaybeUnary();
            if (update) checkLVal(node.argument);else if (strict && node.operator === "delete" && node.argument.type === "Identifier") raise(node.start, "Deleting local variable in strict mode");
            return finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
          }

          var expr = parseExprSubscripts();

          while (tokType.postfix && !canInsertSemicolon()) {
            var node = startNodeFrom(expr);
            node.operator = tokVal;
            node.prefix = false;
            node.argument = expr;
            checkLVal(expr);
            next();
            expr = finishNode(node, "UpdateExpression");
          }

          return expr;
        }

        function parseExprSubscripts() {
          return parseSubscripts(parseExprAtom());
        }

        function parseSubscripts(base, noCalls) {
          if (eat(_dot)) {
            var node = startNodeFrom(base);
            node.object = base;
            node.property = parseIdent(true);
            node.computed = false;
            return parseSubscripts(finishNode(node, "MemberExpression"), noCalls);
          } else if (eat(_bracketL)) {
            var node = startNodeFrom(base);
            node.object = base;
            node.property = parseExpression();
            node.computed = true;
            expect(_bracketR);
            return parseSubscripts(finishNode(node, "MemberExpression"), noCalls);
          } else if (!noCalls && eat(_parenL)) {
            var node = startNodeFrom(base);
            node.callee = base;
            node.arguments = parseExprList(_parenR, false);
            return parseSubscripts(finishNode(node, "CallExpression"), noCalls);
          } else return base;
        }

        function parseExprAtom() {
          switch (tokType) {
            case _this:
              var node = startNode();
              next();
              return finishNode(node, "ThisExpression");

            case _name:
              return parseIdent();

            case _num:
            case _string:
            case _regexp:
              var node = startNode();
              node.value = tokVal;
              node.raw = input.slice(tokStart, tokEnd);
              next();
              return finishNode(node, "Literal");

            case _null:
            case _true:
            case _false:
              var node = startNode();
              node.value = tokType.atomValue;
              node.raw = tokType.keyword;
              next();
              return finishNode(node, "Literal");

            case _parenL:
              var tokStartLoc1 = tokStartLoc,
                  tokStart1 = tokStart;
              next();
              var val = parseExpression();
              val.start = tokStart1;
              val.end = tokEnd;

              if (options.locations) {
                val.loc.start = tokStartLoc1;
                val.loc.end = tokEndLoc;
              }

              if (options.ranges) val.range = [tokStart1, tokEnd];
              expect(_parenR);
              return val;

            case _bracketL:
              var node = startNode();
              next();
              node.elements = parseExprList(_bracketR, true, true);
              return finishNode(node, "ArrayExpression");

            case _braceL:
              return parseObj();

            case _function:
              var node = startNode();
              next();
              return parseFunction(node, false);

            case _new:
              return parseNew();

            default:
              unexpected();
          }
        }

        function parseNew() {
          var node = startNode();
          next();
          node.callee = parseSubscripts(parseExprAtom(), true);
          if (eat(_parenL)) node.arguments = parseExprList(_parenR, false);else node.arguments = empty;
          return finishNode(node, "NewExpression");
        }

        function parseObj() {
          var node = startNode(),
              first = true,
              sawGetSet = false;
          node.properties = [];
          next();

          while (!eat(_braceR)) {
            if (!first) {
              expect(_comma);
              if (options.allowTrailingCommas && eat(_braceR)) break;
            } else first = false;

            var prop = {
              key: parsePropertyName()
            },
                isGetSet = false,
                kind;

            if (eat(_colon)) {
              prop.value = parseExpression(true);
              kind = prop.kind = "init";
            } else if (options.ecmaVersion >= 5 && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set")) {
              isGetSet = sawGetSet = true;
              kind = prop.kind = prop.key.name;
              prop.key = parsePropertyName();
              if (tokType !== _parenL) unexpected();
              prop.value = parseFunction(startNode(), false);
            } else unexpected();

            if (prop.key.type === "Identifier" && (strict || sawGetSet)) {
              for (var i = 0; i < node.properties.length; ++i) {
                var other = node.properties[i];

                if (other.key.name === prop.key.name) {
                  var conflict = kind == other.kind || isGetSet && other.kind === "init" || kind === "init" && (other.kind === "get" || other.kind === "set");
                  if (conflict && !strict && kind === "init" && other.kind === "init") conflict = false;
                  if (conflict) raise(prop.key.start, "Redefinition of property");
                }
              }
            }

            node.properties.push(prop);
          }

          return finishNode(node, "ObjectExpression");
        }

        function parsePropertyName() {
          if (tokType === _num || tokType === _string) return parseExprAtom();
          return parseIdent(true);
        }

        function parseFunction(node, isStatement) {
          if (tokType === _name) node.id = parseIdent();else if (isStatement) unexpected();else node.id = null;
          node.params = [];
          var first = true;
          expect(_parenL);

          while (!eat(_parenR)) {
            if (!first) expect(_comma);else first = false;
            node.params.push(parseIdent());
          }

          var oldInFunc = inFunction,
              oldLabels = labels;
          inFunction = true;
          labels = [];
          node.body = parseBlock(true);
          inFunction = oldInFunc;
          labels = oldLabels;

          if (strict || node.body.body.length && isUseStrict(node.body.body[0])) {
            for (var i = node.id ? -1 : 0; i < node.params.length; ++i) {
              var id = i < 0 ? node.id : node.params[i];
              if (isStrictReservedWord(id.name) || isStrictBadIdWord(id.name)) raise(id.start, "Defining '" + id.name + "' in strict mode");
              if (i >= 0) for (var j = 0; j < i; ++j) {
                if (id.name === node.params[j].name) raise(id.start, "Argument name clash in strict mode");
              }
            }
          }

          return finishNode(node, isStatement ? "FunctionDeclaration" : "FunctionExpression");
        }

        function parseExprList(close, allowTrailingComma, allowEmpty) {
          var elts = [],
              first = true;

          while (!eat(close)) {
            if (!first) {
              expect(_comma);
              if (allowTrailingComma && options.allowTrailingCommas && eat(close)) break;
            } else first = false;

            if (allowEmpty && tokType === _comma) elts.push(null);else elts.push(parseExpression(true));
          }

          return elts;
        }

        function parseIdent(liberal) {
          var node = startNode();
          if (liberal && options.forbidReserved == "everywhere") liberal = false;

          if (tokType === _name) {
            if (!liberal && (options.forbidReserved && (options.ecmaVersion === 3 ? isReservedWord3 : isReservedWord5)(tokVal) || strict && isStrictReservedWord(tokVal)) && input.slice(tokStart, tokEnd).indexOf("\\") == -1) raise(tokStart, "The keyword '" + tokVal + "' is reserved");
            node.name = tokVal;
          } else if (liberal && tokType.keyword) {
            node.name = tokType.keyword;
          } else {
            unexpected();
          }

          tokRegexpAllowed = false;
          next();
          return finishNode(node, "Identifier");
        }
      });

      if (!acorn.version) acorn = null;
    }

    function parse(code, options) {
      return (global.acorn || acorn).parse(code, options);
    }

    var binaryOperators = {
      '+': '__add',
      '-': '__subtract',
      '*': '__multiply',
      '/': '__divide',
      '%': '__modulo',
      '==': '__equals',
      '!=': '__equals'
    };
    var unaryOperators = {
      '-': '__negate',
      '+': '__self'
    };
    var fields = Base.each(['add', 'subtract', 'multiply', 'divide', 'modulo', 'equals', 'negate'], function (name) {
      this['__' + name] = '#' + name;
    }, {
      __self: function __self() {
        return this;
      }
    });
    Point.inject(fields);
    Size.inject(fields);
    Color.inject(fields);

    function __$__(left, operator, right) {
      var handler = binaryOperators[operator];

      if (left && left[handler]) {
        var res = left[handler](right);
        return operator === '!=' ? !res : res;
      }

      switch (operator) {
        case '+':
          return left + right;

        case '-':
          return left - right;

        case '*':
          return left * right;

        case '/':
          return left / right;

        case '%':
          return left % right;

        case '==':
          return left == right;

        case '!=':
          return left != right;
      }
    }

    function $__(operator, value) {
      var handler = unaryOperators[operator];
      if (value && value[handler]) return value[handler]();

      switch (operator) {
        case '+':
          return +value;

        case '-':
          return -value;
      }
    }

    function compile(code, options) {
      if (!code) return '';
      options = options || {};
      var insertions = [];

      function getOffset(offset) {
        for (var i = 0, l = insertions.length; i < l; i++) {
          var insertion = insertions[i];
          if (insertion[0] >= offset) break;
          offset += insertion[1];
        }

        return offset;
      }

      function getCode(node) {
        return code.substring(getOffset(node.range[0]), getOffset(node.range[1]));
      }

      function getBetween(left, right) {
        return code.substring(getOffset(left.range[1]), getOffset(right.range[0]));
      }

      function replaceCode(node, str) {
        var start = getOffset(node.range[0]),
            end = getOffset(node.range[1]),
            insert = 0;

        for (var i = insertions.length - 1; i >= 0; i--) {
          if (start > insertions[i][0]) {
            insert = i + 1;
            break;
          }
        }

        insertions.splice(insert, 0, [start, str.length - end + start]);
        code = code.substring(0, start) + str + code.substring(end);
      }

      function handleOverloading(node, parent) {
        switch (node.type) {
          case 'UnaryExpression':
            if (node.operator in unaryOperators && node.argument.type !== 'Literal') {
              var arg = getCode(node.argument);
              replaceCode(node, '$__("' + node.operator + '", ' + arg + ')');
            }

            break;

          case 'BinaryExpression':
            if (node.operator in binaryOperators && node.left.type !== 'Literal') {
              var left = getCode(node.left),
                  right = getCode(node.right),
                  between = getBetween(node.left, node.right),
                  operator = node.operator;
              replaceCode(node, '__$__(' + left + ',' + between.replace(new RegExp('\\' + operator), '"' + operator + '"') + ', ' + right + ')');
            }

            break;

          case 'UpdateExpression':
          case 'AssignmentExpression':
            var parentType = parent && parent.type;

            if (!(parentType === 'ForStatement' || parentType === 'BinaryExpression' && /^[=!<>]/.test(parent.operator) || parentType === 'MemberExpression' && parent.computed)) {
              if (node.type === 'UpdateExpression') {
                var arg = getCode(node.argument),
                    exp = '__$__(' + arg + ', "' + node.operator[0] + '", 1)',
                    str = arg + ' = ' + exp;

                if (node.prefix) {
                  str = '(' + str + ')';
                } else if (parentType === 'AssignmentExpression' || parentType === 'VariableDeclarator' || parentType === 'BinaryExpression') {
                  if (getCode(parent.left || parent.id) === arg) str = exp;
                  str = arg + '; ' + str;
                }

                replaceCode(node, str);
              } else {
                if (/^.=$/.test(node.operator) && node.left.type !== 'Literal') {
                  var left = getCode(node.left),
                      right = getCode(node.right),
                      exp = left + ' = __$__(' + left + ', "' + node.operator[0] + '", ' + right + ')';
                  replaceCode(node, /^\(.*\)$/.test(getCode(node)) ? '(' + exp + ')' : exp);
                }
              }
            }

            break;
        }
      }

      function handleExports(node) {
        switch (node.type) {
          case 'ExportDefaultDeclaration':
            replaceCode({
              range: [node.start, node.declaration.start]
            }, 'module.exports = ');
            break;

          case 'ExportNamedDeclaration':
            var declaration = node.declaration;
            var specifiers = node.specifiers;

            if (declaration) {
              var declarations = declaration.declarations;

              if (declarations) {
                declarations.forEach(function (dec) {
                  replaceCode(dec, 'module.exports.' + getCode(dec));
                });
                replaceCode({
                  range: [node.start, declaration.start + declaration.kind.length]
                }, '');
              }
            } else if (specifiers) {
              var exports = specifiers.map(function (specifier) {
                var name = getCode(specifier);
                return 'module.exports.' + name + ' = ' + name + '; ';
              }).join('');

              if (exports) {
                replaceCode(node, exports);
              }
            }

            break;
        }
      }

      function walkAST(node, parent, paperFeatures) {
        if (node) {
          for (var key in node) {
            if (key !== 'range' && key !== 'loc') {
              var value = node[key];

              if (Array.isArray(value)) {
                for (var i = 0, l = value.length; i < l; i++) {
                  walkAST(value[i], node, paperFeatures);
                }
              } else if (value && _typeof(value) === 'object') {
                walkAST(value, node, paperFeatures);
              }
            }
          }

          if (paperFeatures.operatorOverloading !== false) {
            handleOverloading(node, parent);
          }

          if (paperFeatures.moduleExports !== false) {
            handleExports(node);
          }
        }
      }

      function encodeVLQ(value) {
        var res = '',
            base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        value = (Math.abs(value) << 1) + (value < 0 ? 1 : 0);

        while (value || !res) {
          var next = value & 32 - 1;
          value >>= 5;
          if (value) next |= 32;
          res += base64[next];
        }

        return res;
      }

      var url = options.url || '',
          sourceMaps = options.sourceMaps,
          paperFeatures = options.paperFeatures || {},
          source = options.source || code,
          offset = options.offset || 0,
          agent = paper.agent,
          version = agent.versionNumber,
          offsetCode = false,
          lineBreaks = /\r\n|\n|\r/mg,
          map;

      if (sourceMaps && (agent.chrome && version >= 30 || agent.webkit && version >= 537.76 || agent.firefox && version >= 23 || agent.node)) {
        if (agent.node) {
          offset -= 2;
        } else if (window && url && !window.location.href.indexOf(url)) {
          var html = document.getElementsByTagName('html')[0].innerHTML;
          offset = html.substr(0, html.indexOf(code) + 1).match(lineBreaks).length + 1;
        }

        offsetCode = offset > 0 && !(agent.chrome && version >= 36 || agent.safari && version >= 600 || agent.firefox && version >= 40 || agent.node);
        var mappings = ['AA' + encodeVLQ(offsetCode ? 0 : offset) + 'A'];
        mappings.length = (code.match(lineBreaks) || []).length + 1 + (offsetCode ? offset : 0);
        map = {
          version: 3,
          file: url,
          names: [],
          mappings: mappings.join(';AACA'),
          sourceRoot: '',
          sources: [url],
          sourcesContent: [source]
        };
      }

      if (paperFeatures.operatorOverloading !== false || paperFeatures.moduleExports !== false) {
        walkAST(parse(code, {
          ranges: true,
          preserveParens: true,
          sourceType: 'module'
        }), null, paperFeatures);
      }

      if (map) {
        if (offsetCode) {
          code = new Array(offset + 1).join('\n') + code;
        }

        if (/^(inline|both)$/.test(sourceMaps)) {
          code += "\n//# sourceMappingURL=data:application/json;base64," + self.btoa(unescape(encodeURIComponent(JSON.stringify(map))));
        }

        code += "\n//# sourceURL=" + (url || 'paperscript');
      }

      return {
        url: url,
        source: source,
        code: code,
        map: map
      };
    }

    function execute(code, scope, options) {
      paper = scope;
      var view = scope.getView(),
          tool = /\btool\.\w+|\s+on(?:Key|Mouse)(?:Up|Down|Move|Drag)\b/.test(code) && !/\bnew\s+Tool\b/.test(code) ? new Tool() : null,
          toolHandlers = tool ? tool._events : [],
          handlers = ['onFrame', 'onResize'].concat(toolHandlers),
          params = [],
          args = [],
          func,
          compiled = _typeof(code) === 'object' ? code : compile(code, options);
      code = compiled.code;

      function expose(scope, hidden) {
        for (var key in scope) {
          if ((hidden || !/^_/.test(key)) && new RegExp('([\\b\\s\\W]|^)' + key.replace(/\$/g, '\\$') + '\\b').test(code)) {
            params.push(key);
            args.push(scope[key]);
          }
        }
      }

      expose({
        __$__: __$__,
        $__: $__,
        paper: scope,
        tool: tool
      }, true);
      expose(scope);
      code = 'var module = { exports: {} }; ' + code;
      var exports = Base.each(handlers, function (key) {
        if (new RegExp('\\s+' + key + '\\b').test(code)) {
          params.push(key);
          this.push('module.exports.' + key + ' = ' + key + ';');
        }
      }, []).join('\n');

      if (exports) {
        code += '\n' + exports;
      }

      code += '\nreturn module.exports;';
      var agent = paper.agent;

      if (document && (agent.chrome || agent.firefox && agent.versionNumber < 40)) {
        var script = document.createElement('script'),
            head = document.head || document.getElementsByTagName('head')[0];
        if (agent.firefox) code = '\n' + code;
        script.appendChild(document.createTextNode('document.__paperscript__ = function(' + params + ') {' + code + '\n}'));
        head.appendChild(script);
        func = document.__paperscript__;
        delete document.__paperscript__;
        head.removeChild(script);
      } else {
        func = Function(params, code);
      }

      var exports = func && func.apply(scope, args);
      var obj = exports || {};
      Base.each(toolHandlers, function (key) {
        var value = obj[key];
        if (value) tool[key] = value;
      });

      if (view) {
        if (obj.onResize) view.setOnResize(obj.onResize);
        view.emit('resize', {
          size: view.size,
          delta: new Point()
        });
        if (obj.onFrame) view.setOnFrame(obj.onFrame);
        view.requestUpdate();
      }

      return exports;
    }

    function loadScript(script) {
      if (/^text\/(?:x-|)paperscript$/.test(script.type) && PaperScope.getAttribute(script, 'ignore') !== 'true') {
        var canvasId = PaperScope.getAttribute(script, 'canvas'),
            canvas = document.getElementById(canvasId),
            src = script.src || script.getAttribute('data-src'),
            async = PaperScope.hasAttribute(script, 'async'),
            scopeAttribute = 'data-paper-scope';
        if (!canvas) throw new Error('Unable to find canvas with id "' + canvasId + '"');
        var scope = PaperScope.get(canvas.getAttribute(scopeAttribute)) || new PaperScope().setup(canvas);
        canvas.setAttribute(scopeAttribute, scope._id);

        if (src) {
          Http.request({
            url: src,
            async: async,
            mimeType: 'text/plain',
            onLoad: function onLoad(code) {
              execute(code, scope, src);
            }
          });
        } else {
          execute(script.innerHTML, scope, script.baseURI);
        }

        script.setAttribute('data-paper-ignore', 'true');
        return scope;
      }
    }

    function loadAll() {
      Base.each(document && document.getElementsByTagName('script'), loadScript);
    }

    function load(script) {
      return script ? loadScript(script) : loadAll();
    }

    if (window) {
      if (document.readyState === 'complete') {
        setTimeout(loadAll);
      } else {
        DomEvent.add(window, {
          load: loadAll
        });
      }
    }

    return {
      compile: compile,
      execute: execute,
      load: load,
      parse: parse,
      calculateBinary: __$__,
      calculateUnary: $__
    };
  }.call(this);

  var paper = new (PaperScope.inject(Base.exports, {
    Base: Base,
    Numerical: Numerical,
    Key: Key,
    DomEvent: DomEvent,
    DomElement: DomElement,
    document: document,
    window: window,
    Symbol: SymbolDefinition,
    PlacedSymbol: SymbolItem
  }))();

  if (paper.agent.node) {
    require('./node/extend.js')(paper);
  }

  if (typeof define === 'function' && define.amd) {
    define('paper', paper);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module) {
    module.exports = paper;
  }

  return paper;
}.call(this, (typeof self === "undefined" ? "undefined" : _typeof(self)) === 'object' ? self : null);
},{"./node/self.js":"vMTe","./node/extend.js":"vMTe","process":"PgLh"}],"Vme4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function round(n, d) {
  var power = Math.pow(10, d);
  return Math.round((n + Number.EPSILON) * power) / power;
}

exports.default = round;
},{}],"NSZU":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawLeaf = exports.calcLeaf = void 0;

var round_1 = __importDefault(require("./round"));

var paper_1 = __importDefault(require("paper"));

function calcLeaf(prc, jd, k1, k2, b1, b2, p1, p2) {
  var ROUNDING = 3; // List will store points on the contour

  var pts_cnt = []; // List will store points on the midrib

  var pts_mid = []; // Iterating

  for (var i = 0; i < prc; i++) {
    var j = 1 / (prc - 1) * i; // Appending midrib

    pts_mid.push([round_1.default(j, ROUNDING), 0]); // Calculating glj and sj

    var glj = void 0;
    var sj = void 0;

    if (0 <= j && j <= jd) {
      glj = 1 - Math.pow((jd - j) / jd, k1);
      sj = -b1 * Math.pow((jd - j) / jd, p1);
    } else if (jd <= j && j <= 1) {
      glj = 1 - Math.pow((j - jd) / (1 - jd), k2);
      sj = b2 * Math.pow((j - jd) / (1 - jd), p2);
    } // Calculating contour point


    var xj = j + sj * (glj / Math.sqrt(1 + Math.pow(sj, 2)));
    var yj = glj / Math.sqrt(1 + Math.pow(sj, 2)); // Appending contour point

    pts_cnt.push([round_1.default(xj, ROUNDING), round_1.default(yj, ROUNDING)]);
  }

  return [pts_cnt, pts_mid];
}

exports.calcLeaf = calcLeaf;

function drawLeaf(leafPts, x, y, w, h, sh, color) {
  var leafGroup = new paper_1.default.Group(); // Contour path left

  var cnt_path_lft = new paper_1.default.Path();

  for (var i = 0; i < leafPts[0].length; i++) {
    var cnt_pnt = new paper_1.default.Point(leafPts[0][i][0], leafPts[0][i][1]);

    if (i == 0) {
      cnt_path_lft.moveTo(cnt_pnt);
    } else {
      cnt_path_lft.lineTo(cnt_pnt);
    } // Drawing rib


    var rib = new paper_1.default.Path.Line(cnt_pnt, new paper_1.default.Point(leafPts[1][i]));
    leafGroup.addChild(rib);
  } // Contour path right


  var cnt_path_rgt = new paper_1.default.Path();

  for (var i = 0; i < leafPts[0].length; i++) {
    var cnt_pnt = new paper_1.default.Point(leafPts[0][i][0], -leafPts[0][i][1]);

    if (i == 0) {
      cnt_path_rgt.moveTo(cnt_pnt);
    } else {
      cnt_path_rgt.lineTo(cnt_pnt);
    } // Drawing rib


    var rib = new paper_1.default.Path.Line(cnt_pnt, new paper_1.default.Point(leafPts[1][i]));
    leafGroup.addChild(rib);
  }

  leafGroup.addChildren([cnt_path_lft, cnt_path_rgt]);
  leafGroup.strokeColor = color;
  leafGroup.scale(h, w / 2, new paper_1.default.Point(0, 0));
  leafGroup.rotate(-90, new paper_1.default.Point(0, 0));
  leafGroup.translate(new paper_1.default.Point(0, h));
  leafGroup.translate(new paper_1.default.Point(x, y)); // Drawing central line

  var rib_cnt = new paper_1.default.Path();
  rib_cnt.moveTo(new paper_1.default.Point(x, y));
  rib_cnt.lineBy(new paper_1.default.Point(0, h));
  rib_cnt.strokeColor = color; // Drawing stem

  var stem = new paper_1.default.Path();
  stem.moveTo(new paper_1.default.Point(x, y + h));
  stem.lineBy(new paper_1.default.Point(0, sh));
  stem.strokeColor = color;
}

exports.drawLeaf = drawLeaf;
},{"./round":"Vme4","paper":"kGI0"}],"ArXC":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.GUI = exports.gui = exports.dom = exports.controllers = exports.color = void 0;

/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
function ___$insertStyle(css) {
  if (!css) {
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

function colorToString(color, forceCSSHex) {
  var colorFormat = color.__state.conversionName.toString();

  var r = Math.round(color.r);
  var g = Math.round(color.g);
  var b = Math.round(color.b);
  var a = color.a;
  var h = Math.round(color.h);
  var s = color.s.toFixed(1);
  var v = color.v.toFixed(1);

  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
    var str = color.hex.toString(16);

    while (str.length < 6) {
      str = '0' + str;
    }

    return '#' + str;
  } else if (colorFormat === 'CSS_RGB') {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  } else if (colorFormat === 'CSS_RGBA') {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  } else if (colorFormat === 'HEX') {
    return '0x' + color.hex.toString(16);
  } else if (colorFormat === 'RGB_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ']';
  } else if (colorFormat === 'RGBA_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
  } else if (colorFormat === 'RGB_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
  } else if (colorFormat === 'RGBA_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
  } else if (colorFormat === 'HSV_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
  } else if (colorFormat === 'HSVA_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
  }

  return 'unknown format';
}

var ARR_EACH = Array.prototype.forEach;
var ARR_SLICE = Array.prototype.slice;
var Common = {
  BREAK: {},
  extend: function extend(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (!this.isUndefined(obj[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  defaults: function defaults(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (this.isUndefined(target[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  compose: function compose() {
    var toCall = ARR_SLICE.call(arguments);
    return function () {
      var args = ARR_SLICE.call(arguments);

      for (var i = toCall.length - 1; i >= 0; i--) {
        args = [toCall[i].apply(this, args)];
      }

      return args[0];
    };
  },
  each: function each(obj, itr, scope) {
    if (!obj) {
      return;
    }

    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
      obj.forEach(itr, scope);
    } else if (obj.length === obj.length + 0) {
      var key = void 0;
      var l = void 0;

      for (key = 0, l = obj.length; key < l; key++) {
        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
          return;
        }
      }
    } else {
      for (var _key in obj) {
        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
          return;
        }
      }
    }
  },
  defer: function defer(fnc) {
    setTimeout(fnc, 0);
  },
  debounce: function debounce(func, threshold, callImmediately) {
    var timeout = void 0;
    return function () {
      var obj = this;
      var args = arguments;

      function delayed() {
        timeout = null;
        if (!callImmediately) func.apply(obj, args);
      }

      var callNow = callImmediately || !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold);

      if (callNow) {
        func.apply(obj, args);
      }
    };
  },
  toArray: function toArray(obj) {
    if (obj.toArray) return obj.toArray();
    return ARR_SLICE.call(obj);
  },
  isUndefined: function isUndefined(obj) {
    return obj === undefined;
  },
  isNull: function isNull(obj) {
    return obj === null;
  },
  isNaN: function (_isNaN) {
    function isNaN(_x) {
      return _isNaN.apply(this, arguments);
    }

    isNaN.toString = function () {
      return _isNaN.toString();
    };

    return isNaN;
  }(function (obj) {
    return isNaN(obj);
  }),
  isArray: Array.isArray || function (obj) {
    return obj.constructor === Array;
  },
  isObject: function isObject(obj) {
    return obj === Object(obj);
  },
  isNumber: function isNumber(obj) {
    return obj === obj + 0;
  },
  isString: function isString(obj) {
    return obj === obj + '';
  },
  isBoolean: function isBoolean(obj) {
    return obj === false || obj === true;
  },
  isFunction: function isFunction(obj) {
    return obj instanceof Function;
  }
};
var INTERPRETATIONS = [{
  litmus: Common.isString,
  conversions: {
    THREE_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);

        if (test === null) {
          return false;
        }

        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
        };
      },
      write: colorToString
    },
    SIX_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9]{6})$/i);

        if (test === null) {
          return false;
        }

        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString(), 0)
        };
      },
      write: colorToString
    },
    CSS_RGB: {
      read: function read(original) {
        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);

        if (test === null) {
          return false;
        }

        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3])
        };
      },
      write: colorToString
    },
    CSS_RGBA: {
      read: function read(original) {
        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);

        if (test === null) {
          return false;
        }

        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3]),
          a: parseFloat(test[4])
        };
      },
      write: colorToString
    }
  }
}, {
  litmus: Common.isNumber,
  conversions: {
    HEX: {
      read: function read(original) {
        return {
          space: 'HEX',
          hex: original,
          conversionName: 'HEX'
        };
      },
      write: function write(color) {
        return color.hex;
      }
    }
  }
}, {
  litmus: Common.isArray,
  conversions: {
    RGB_ARRAY: {
      read: function read(original) {
        if (original.length !== 3) {
          return false;
        }

        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b];
      }
    },
    RGBA_ARRAY: {
      read: function read(original) {
        if (original.length !== 4) return false;
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2],
          a: original[3]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b, color.a];
      }
    }
  }
}, {
  litmus: Common.isObject,
  conversions: {
    RGBA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b,
            a: original.a
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a
        };
      }
    },
    RGB_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b
        };
      }
    },
    HSVA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v,
            a: original.a
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v,
          a: color.a
        };
      }
    },
    HSV_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v
        };
      }
    }
  }
}];
var result = void 0;
var toReturn = void 0;

var interpret = function interpret() {
  toReturn = false;
  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
  Common.each(INTERPRETATIONS, function (family) {
    if (family.litmus(original)) {
      Common.each(family.conversions, function (conversion, conversionName) {
        result = conversion.read(original);

        if (toReturn === false && result !== false) {
          toReturn = result;
          result.conversionName = conversionName;
          result.conversion = conversion;
          return Common.BREAK;
        }
      });
      return Common.BREAK;
    }
  });
  return toReturn;
};

var tmpComponent = void 0;
var ColorMath = {
  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = v * (1.0 - s);
    var q = v * (1.0 - f * s);
    var t = v * (1.0 - (1.0 - f) * s);
    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
    return {
      r: c[0] * 255,
      g: c[1] * 255,
      b: c[2] * 255
    };
  },
  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h = void 0;
    var s = void 0;

    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }

    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }

    h /= 6;

    if (h < 0) {
      h += 1;
    }

    return {
      h: h * 360,
      s: s,
      v: max / 255
    };
  },
  rgb_to_hex: function rgb_to_hex(r, g, b) {
    var hex = this.hex_with_component(0, 2, r);
    hex = this.hex_with_component(hex, 1, g);
    hex = this.hex_with_component(hex, 0, b);
    return hex;
  },
  component_from_hex: function component_from_hex(hex, componentIndex) {
    return hex >> componentIndex * 8 & 0xFF;
  },
  hex_with_component: function hex_with_component(hex, componentIndex, value) {
    return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Color = function () {
  function Color() {
    classCallCheck(this, Color);
    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }

    this.__state.a = this.__state.a || 1;
  }

  createClass(Color, [{
    key: 'toString',
    value: function toString() {
      return colorToString(this);
    }
  }, {
    key: 'toHexString',
    value: function toHexString() {
      return colorToString(this, true);
    }
  }, {
    key: 'toOriginal',
    value: function toOriginal() {
      return this.__state.conversion.write(this);
    }
  }]);
  return Color;
}();

function defineRGBComponent(target, component, componentHexIndex) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'RGB') {
        return this.__state[component];
      }

      Color.recalculateRGB(this, component, componentHexIndex);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'RGB') {
        Color.recalculateRGB(this, component, componentHexIndex);
        this.__state.space = 'RGB';
      }

      this.__state[component] = v;
    }
  });
}

function defineHSVComponent(target, component) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'HSV') {
        return this.__state[component];
      }

      Color.recalculateHSV(this);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'HSV') {
        Color.recalculateHSV(this);
        this.__state.space = 'HSV';
      }

      this.__state[component] = v;
    }
  });
}

Color.recalculateRGB = function (color, component, componentHexIndex) {
  if (color.__state.space === 'HEX') {
    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
  } else if (color.__state.space === 'HSV') {
    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
  } else {
    throw new Error('Corrupted color state');
  }
};

Color.recalculateHSV = function (color) {
  var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
  Common.extend(color.__state, {
    s: result.s,
    v: result.v
  });

  if (!Common.isNaN(result.h)) {
    color.__state.h = result.h;
  } else if (Common.isUndefined(color.__state.h)) {
    color.__state.h = 0;
  }
};

Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
defineRGBComponent(Color.prototype, 'r', 2);
defineRGBComponent(Color.prototype, 'g', 1);
defineRGBComponent(Color.prototype, 'b', 0);
defineHSVComponent(Color.prototype, 'h');
defineHSVComponent(Color.prototype, 's');
defineHSVComponent(Color.prototype, 'v');
Object.defineProperty(Color.prototype, 'a', {
  get: function get$$1() {
    return this.__state.a;
  },
  set: function set$$1(v) {
    this.__state.a = v;
  }
});
Object.defineProperty(Color.prototype, 'hex', {
  get: function get$$1() {
    if (this.__state.space !== 'HEX') {
      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
      this.__state.space = 'HEX';
    }

    return this.__state.hex;
  },
  set: function set$$1(v) {
    this.__state.space = 'HEX';
    this.__state.hex = v;
  }
});

var Controller = function () {
  function Controller(object, property) {
    classCallCheck(this, Controller);
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  }

  createClass(Controller, [{
    key: 'onChange',
    value: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    }
  }, {
    key: 'onFinishChange',
    value: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    }
  }, {
    key: 'setValue',
    value: function setValue(newValue) {
      this.object[this.property] = newValue;

      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }

      this.updateDisplay();
      return this;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.object[this.property];
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      return this;
    }
  }, {
    key: 'isModified',
    value: function isModified() {
      return this.initialValue !== this.getValue();
    }
  }]);
  return Controller;
}();

var EVENT_MAP = {
  HTMLEvents: ['change'],
  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
  KeyboardEvents: ['keydown']
};
var EVENT_MAP_INV = {};
Common.each(EVENT_MAP, function (v, k) {
  Common.each(v, function (e) {
    EVENT_MAP_INV[e] = k;
  });
});
var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;

function cssValueToPixels(val) {
  if (val === '0' || Common.isUndefined(val)) {
    return 0;
  }

  var match = val.match(CSS_VALUE_PIXELS);

  if (!Common.isNull(match)) {
    return parseFloat(match[1]);
  }

  return 0;
}

var dom = {
  makeSelectable: function makeSelectable(elem, selectable) {
    if (elem === undefined || elem.style === undefined) return;
    elem.onselectstart = selectable ? function () {
      return false;
    } : function () {};
    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
    elem.unselectable = selectable ? 'on' : 'off';
  },
  makeFullscreen: function makeFullscreen(elem, hor, vert) {
    var vertical = vert;
    var horizontal = hor;

    if (Common.isUndefined(horizontal)) {
      horizontal = true;
    }

    if (Common.isUndefined(vertical)) {
      vertical = true;
    }

    elem.style.position = 'absolute';

    if (horizontal) {
      elem.style.left = 0;
      elem.style.right = 0;
    }

    if (vertical) {
      elem.style.top = 0;
      elem.style.bottom = 0;
    }
  },
  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
    var params = pars || {};
    var className = EVENT_MAP_INV[eventType];

    if (!className) {
      throw new Error('Event type ' + eventType + ' not supported.');
    }

    var evt = document.createEvent(className);

    switch (className) {
      case 'MouseEvents':
        {
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, 0, clientX, clientY, false, false, false, false, 0, null);
          break;
        }

      case 'KeyboardEvents':
        {
          var init = evt.initKeyboardEvent || evt.initKeyEvent;
          Common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
          break;
        }

      default:
        {
          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
          break;
        }
    }

    Common.defaults(evt, aux);
    elem.dispatchEvent(evt);
  },
  bind: function bind(elem, event, func, newBool) {
    var bool = newBool || false;

    if (elem.addEventListener) {
      elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + event, func);
    }

    return dom;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;

    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, func);
    }

    return dom;
  },
  addClass: function addClass(elem, className) {
    if (elem.className === undefined) {
      elem.className = className;
    } else if (elem.className !== className) {
      var classes = elem.className.split(/ +/);

      if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
      }
    }

    return dom;
  },
  removeClass: function removeClass(elem, className) {
    if (className) {
      if (elem.className === className) {
        elem.removeAttribute('class');
      } else {
        var classes = elem.className.split(/ +/);
        var index = classes.indexOf(className);

        if (index !== -1) {
          classes.splice(index, 1);
          elem.className = classes.join(' ');
        }
      }
    } else {
      elem.className = undefined;
    }

    return dom;
  },
  hasClass: function hasClass(elem, className) {
    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
  },
  getWidth: function getWidth(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
  },
  getHeight: function getHeight(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
  },
  getOffset: function getOffset(el) {
    var elem = el;
    var offset = {
      left: 0,
      top: 0
    };

    if (elem.offsetParent) {
      do {
        offset.left += elem.offsetLeft;
        offset.top += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }

    return offset;
  },
  isActive: function isActive(elem) {
    return elem === document.activeElement && (elem.type || elem.href);
  }
};

var BooleanController = function (_Controller) {
  inherits(BooleanController, _Controller);

  function BooleanController(object, property) {
    classCallCheck(this, BooleanController);

    var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));

    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement('input');

    _this2.__checkbox.setAttribute('type', 'checkbox');

    function onChange() {
      _this.setValue(!_this.__prev);
    }

    dom.bind(_this2.__checkbox, 'change', onChange, false);

    _this2.domElement.appendChild(_this2.__checkbox);

    _this2.updateDisplay();

    return _this2;
  }

  createClass(BooleanController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);

      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }

      this.__prev = this.getValue();
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute('checked', 'checked');

        this.__checkbox.checked = true;
        this.__prev = true;
      } else {
        this.__checkbox.checked = false;
        this.__prev = false;
      }

      return get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return BooleanController;
}(Controller);

var OptionController = function (_Controller) {
  inherits(OptionController, _Controller);

  function OptionController(object, property, opts) {
    classCallCheck(this, OptionController);

    var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));

    var options = opts;
    var _this = _this2;
    _this2.__select = document.createElement('select');

    if (Common.isArray(options)) {
      var map = {};
      Common.each(options, function (element) {
        map[element] = element;
      });
      options = map;
    }

    Common.each(options, function (value, key) {
      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);

      _this.__select.appendChild(opt);
    });

    _this2.updateDisplay();

    dom.bind(_this2.__select, 'change', function () {
      var desiredValue = this.options[this.selectedIndex].value;

      _this.setValue(desiredValue);
    });

    _this2.domElement.appendChild(_this2.__select);

    return _this2;
  }

  createClass(OptionController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);

      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }

      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (dom.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller);

var StringController = function (_Controller) {
  inherits(StringController, _Controller);

  function StringController(object, property) {
    classCallCheck(this, StringController);

    var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));

    var _this = _this2;

    function onChange() {
      _this.setValue(_this.__input.value);
    }

    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    _this2.__input = document.createElement('input');

    _this2.__input.setAttribute('type', 'text');

    dom.bind(_this2.__input, 'keyup', onChange);
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });

    _this2.updateDisplay();

    _this2.domElement.appendChild(_this2.__input);

    return _this2;
  }

  createClass(StringController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }

      return get(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return StringController;
}(Controller);

function numDecimals(x) {
  var _x = x.toString();

  if (_x.indexOf('.') > -1) {
    return _x.length - _x.indexOf('.') - 1;
  }

  return 0;
}

var NumberController = function (_Controller) {
  inherits(NumberController, _Controller);

  function NumberController(object, property, params) {
    classCallCheck(this, NumberController);

    var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));

    var _params = params || {};

    _this.__min = _params.min;
    _this.__max = _params.max;
    _this.__step = _params.step;

    if (Common.isUndefined(_this.__step)) {
      if (_this.initialValue === 0) {
        _this.__impliedStep = 1;
      } else {
        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
      }
    } else {
      _this.__impliedStep = _this.__step;
    }

    _this.__precision = numDecimals(_this.__impliedStep);
    return _this;
  }

  createClass(NumberController, [{
    key: 'setValue',
    value: function setValue(v) {
      var _v = v;

      if (this.__min !== undefined && _v < this.__min) {
        _v = this.__min;
      } else if (this.__max !== undefined && _v > this.__max) {
        _v = this.__max;
      }

      if (this.__step !== undefined && _v % this.__step !== 0) {
        _v = Math.round(_v / this.__step) * this.__step;
      }

      return get(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
    }
  }, {
    key: 'min',
    value: function min(minValue) {
      this.__min = minValue;
      return this;
    }
  }, {
    key: 'max',
    value: function max(maxValue) {
      this.__max = maxValue;
      return this;
    }
  }, {
    key: 'step',
    value: function step(stepValue) {
      this.__step = stepValue;
      this.__impliedStep = stepValue;
      this.__precision = numDecimals(stepValue);
      return this;
    }
  }]);
  return NumberController;
}(Controller);

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}

var NumberControllerBox = function (_NumberController) {
  inherits(NumberControllerBox, _NumberController);

  function NumberControllerBox(object, property, params) {
    classCallCheck(this, NumberControllerBox);

    var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));

    _this2.__truncationSuspended = false;
    var _this = _this2;
    var prevY = void 0;

    function onChange() {
      var attempted = parseFloat(_this.__input.value);

      if (!Common.isNaN(attempted)) {
        _this.setValue(attempted);
      }
    }

    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onBlur() {
      onFinish();
    }

    function onMouseDrag(e) {
      var diff = prevY - e.clientY;

      _this.setValue(_this.getValue() + diff * _this.__impliedStep);

      prevY = e.clientY;
    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      onFinish();
    }

    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prevY = e.clientY;
    }

    _this2.__input = document.createElement('input');

    _this2.__input.setAttribute('type', 'text');

    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'mousedown', onMouseDown);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
    });

    _this2.updateDisplay();

    _this2.domElement.appendChild(_this2.__input);

    return _this2;
  }

  createClass(NumberControllerBox, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return get(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController);

function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}

var NumberControllerSlider = function (_NumberController) {
  inherits(NumberControllerSlider, _NumberController);

  function NumberControllerSlider(object, property, min, max, step) {
    classCallCheck(this, NumberControllerSlider);

    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, {
      min: min,
      max: max,
      step: step
    }));

    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    dom.bind(_this2.__background, 'mousedown', onMouseDown);
    dom.bind(_this2.__background, 'touchstart', onTouchStart);
    dom.addClass(_this2.__background, 'slider');
    dom.addClass(_this2.__foreground, 'slider-fg');

    function onMouseDown(e) {
      document.activeElement.blur();
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }

    function onMouseDrag(e) {
      e.preventDefault();

      var bgRect = _this.__background.getBoundingClientRect();

      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));

      return false;
    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);

      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }

      dom.bind(window, 'touchmove', onTouchMove);
      dom.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }

    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;

      var bgRect = _this.__background.getBoundingClientRect();

      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }

    function onTouchEnd() {
      dom.unbind(window, 'touchmove', onTouchMove);
      dom.unbind(window, 'touchend', onTouchEnd);

      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    _this2.updateDisplay();

    _this2.__background.appendChild(_this2.__foreground);

    _this2.domElement.appendChild(_this2.__background);

    return _this2;
  }

  createClass(NumberControllerSlider, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);

      this.__foreground.style.width = pct * 100 + '%';
      return get(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerSlider;
}(NumberController);

var FunctionController = function (_Controller) {
  inherits(FunctionController, _Controller);

  function FunctionController(object, property, text) {
    classCallCheck(this, FunctionController);

    var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));

    var _this = _this2;
    _this2.__button = document.createElement('div');
    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(_this2.__button, 'click', function (e) {
      e.preventDefault();

      _this.fire();

      return false;
    });
    dom.addClass(_this2.__button, 'button');

    _this2.domElement.appendChild(_this2.__button);

    return _this2;
  }

  createClass(FunctionController, [{
    key: 'fire',
    value: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }

      this.getValue().call(this.object);

      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    }
  }]);
  return FunctionController;
}(Controller);

var ColorController = function (_Controller) {
  inherits(ColorController, _Controller);

  function ColorController(object, property) {
    classCallCheck(this, ColorController);

    var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));

    _this2.__color = new Color(_this2.getValue());
    _this2.__temp = new Color(0);
    var _this = _this2;
    _this2.domElement = document.createElement('div');
    dom.makeSelectable(_this2.domElement, false);
    _this2.__selector = document.createElement('div');
    _this2.__selector.className = 'selector';
    _this2.__saturation_field = document.createElement('div');
    _this2.__saturation_field.className = 'saturation-field';
    _this2.__field_knob = document.createElement('div');
    _this2.__field_knob.className = 'field-knob';
    _this2.__field_knob_border = '2px solid ';
    _this2.__hue_knob = document.createElement('div');
    _this2.__hue_knob.className = 'hue-knob';
    _this2.__hue_field = document.createElement('div');
    _this2.__hue_field.className = 'hue-field';
    _this2.__input = document.createElement('input');
    _this2.__input.type = 'text';
    _this2.__input_textShadow = '0 1px 1px ';
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__selector, 'mousedown', function () {
      dom.addClass(this, 'drag').bind(window, 'mouseup', function () {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    dom.bind(_this2.__selector, 'touchstart', function () {
      dom.addClass(this, 'drag').bind(window, 'touchend', function () {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    var valueField = document.createElement('div');
    Common.extend(_this2.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });
    Common.extend(_this2.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    Common.extend(_this2.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });
    Common.extend(_this2.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });
    Common.extend(valueField.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
    Common.extend(_this2.__hue_field.style, {
      width: '15px',
      height: '100px',
      border: '1px solid #555',
      cursor: 'ns-resize',
      position: 'absolute',
      top: '3px',
      right: '3px'
    });
    hueGradient(_this2.__hue_field);
    Common.extend(_this2.__input.style, {
      outline: 'none',
      textAlign: 'center',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
    dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
    dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
    dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
    dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
    dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);

    function fieldDown(e) {
      setSV(e);
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'touchmove', setSV);
      dom.bind(window, 'mouseup', fieldUpSV);
      dom.bind(window, 'touchend', fieldUpSV);
    }

    function fieldDownH(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'touchmove', setH);
      dom.bind(window, 'mouseup', fieldUpH);
      dom.bind(window, 'touchend', fieldUpH);
    }

    function fieldUpSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'touchmove', setSV);
      dom.unbind(window, 'mouseup', fieldUpSV);
      dom.unbind(window, 'touchend', fieldUpSV);
      onFinish();
    }

    function fieldUpH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'touchmove', setH);
      dom.unbind(window, 'mouseup', fieldUpH);
      dom.unbind(window, 'touchend', fieldUpH);
      onFinish();
    }

    function onBlur() {
      var i = interpret(this.value);

      if (i !== false) {
        _this.__color.__state = i;

        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }

    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }

    _this2.__saturation_field.appendChild(valueField);

    _this2.__selector.appendChild(_this2.__field_knob);

    _this2.__selector.appendChild(_this2.__saturation_field);

    _this2.__selector.appendChild(_this2.__hue_field);

    _this2.__hue_field.appendChild(_this2.__hue_knob);

    _this2.domElement.appendChild(_this2.__input);

    _this2.domElement.appendChild(_this2.__selector);

    _this2.updateDisplay();

    function setSV(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }

      var fieldRect = _this.__saturation_field.getBoundingClientRect();

      var _ref = e.touches && e.touches[0] || e,
          clientX = _ref.clientX,
          clientY = _ref.clientY;

      var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }

      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }

      _this.__color.v = v;
      _this.__color.s = s;

      _this.setValue(_this.__color.toOriginal());

      return false;
    }

    function setH(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }

      var fieldRect = _this.__hue_field.getBoundingClientRect();

      var _ref2 = e.touches && e.touches[0] || e,
          clientY = _ref2.clientY;

      var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }

      _this.__color.h = h * 360;

      _this.setValue(_this.__color.toOriginal());

      return false;
    }

    return _this2;
  }

  createClass(ColorController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var i = interpret(this.getValue());

      if (i !== false) {
        var mismatch = false;
        Common.each(Color.COMPONENTS, function (component) {
          if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {};
          }
        }, this);

        if (mismatch) {
          Common.extend(this.__color.__state, i);
        }
      }

      Common.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;

      var _flip = 255 - flip;

      Common.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + 'px',
        marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
        backgroundColor: this.__temp.toHexString(),
        border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
      });
      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
      this.__temp.s = 1;
      this.__temp.v = 1;
      linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
      this.__input.value = this.__color.toString();
      Common.extend(this.__input.style, {
        backgroundColor: this.__color.toHexString(),
        color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
        textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
      });
    }
  }]);
  return ColorController;
}(Controller);

var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];

function linearGradient(elem, x, a, b) {
  elem.style.background = '';
  Common.each(vendors, function (vendor) {
    elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
  });
}

function hueGradient(elem) {
  elem.style.background = '';
  elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
  elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}

var css = {
  load: function load(url, indoc) {
    var doc = indoc || document;
    var link = doc.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    doc.getElementsByTagName('head')[0].appendChild(link);
  },
  inject: function inject(cssContent, indoc) {
    var doc = indoc || document;
    var injected = document.createElement('style');
    injected.type = 'text/css';
    injected.innerHTML = cssContent;
    var head = doc.getElementsByTagName('head')[0];

    try {
      head.appendChild(injected);
    } catch (e) {}
  }
};
var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

var ControllerFactory = function ControllerFactory(object, property) {
  var initialValue = object[property];

  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
    return new OptionController(object, property, arguments[2]);
  }

  if (Common.isNumber(initialValue)) {
    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
      if (Common.isNumber(arguments[4])) {
        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
      }

      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
    }

    if (Common.isNumber(arguments[4])) {
      return new NumberControllerBox(object, property, {
        min: arguments[2],
        max: arguments[3],
        step: arguments[4]
      });
    }

    return new NumberControllerBox(object, property, {
      min: arguments[2],
      max: arguments[3]
    });
  }

  if (Common.isString(initialValue)) {
    return new StringController(object, property);
  }

  if (Common.isFunction(initialValue)) {
    return new FunctionController(object, property, '');
  }

  if (Common.isBoolean(initialValue)) {
    return new BooleanController(object, property);
  }

  return null;
};

function requestAnimationFrame(callback) {
  setTimeout(callback, 1000 / 60);
}

var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;

var CenteredDiv = function () {
  function CenteredDiv() {
    classCallCheck(this, CenteredDiv);
    this.backgroundElement = document.createElement('div');
    Common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear',
      transition: 'opacity 0.2s linear'
    });
    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';
    this.domElement = document.createElement('div');
    Common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);

    var _this = this;

    dom.bind(this.backgroundElement, 'click', function () {
      _this.hide();
    });
  }

  createClass(CenteredDiv, [{
    key: 'show',
    value: function show() {
      var _this = this;

      this.backgroundElement.style.display = 'block';
      this.domElement.style.display = 'block';
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
      this.layout();
      Common.defer(function () {
        _this.backgroundElement.style.opacity = 1;
        _this.domElement.style.opacity = 1;
        _this.domElement.style.webkitTransform = 'scale(1)';
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this = this;

      var hide = function hide() {
        _this.domElement.style.display = 'none';
        _this.backgroundElement.style.display = 'none';
        dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
        dom.unbind(_this.domElement, 'transitionend', hide);
        dom.unbind(_this.domElement, 'oTransitionEnd', hide);
      };

      dom.bind(this.domElement, 'webkitTransitionEnd', hide);
      dom.bind(this.domElement, 'transitionend', hide);
      dom.bind(this.domElement, 'oTransitionEnd', hide);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
    }
  }]);
  return CenteredDiv;
}();

var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

css.inject(styleSheet);
var CSS_NAMESPACE = 'dg';
var HIDE_KEY_CODE = 72;
var CLOSE_BUTTON_HEIGHT = 20;
var DEFAULT_DEFAULT_PRESET_NAME = 'Default';

var SUPPORTS_LOCAL_STORAGE = function () {
  try {
    return !!window.localStorage;
  } catch (e) {
    return false;
  }
}();

var SAVE_DIALOGUE = void 0;
var autoPlaceVirgin = true;
var autoPlaceContainer = void 0;
var hide = false;
var hideableGuis = [];

var GUI = function GUI(pars) {
  var _this = this;

  var params = pars || {};
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);
  dom.addClass(this.domElement, CSS_NAMESPACE);
  this.__folders = {};
  this.__controllers = [];
  this.__rememberedObjects = [];
  this.__rememberedObjectIndecesToControllers = [];
  this.__listening = [];
  params = Common.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI.DEFAULT_WIDTH
  });
  params = Common.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });

  if (!Common.isUndefined(params.load)) {
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = {
      preset: DEFAULT_DEFAULT_PRESET_NAME
    };
  }

  if (Common.isUndefined(params.parent) && params.hideable) {
    hideableGuis.push(this);
  }

  params.resizable = Common.isUndefined(params.parent) && params.resizable;

  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }

  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
  var saveToLocalStorage = void 0;
  var titleRow = void 0;
  Object.defineProperties(this, {
    parent: {
      get: function get$$1() {
        return params.parent;
      }
    },
    scrollable: {
      get: function get$$1() {
        return params.scrollable;
      }
    },
    autoPlace: {
      get: function get$$1() {
        return params.autoPlace;
      }
    },
    closeOnTop: {
      get: function get$$1() {
        return params.closeOnTop;
      }
    },
    preset: {
      get: function get$$1() {
        if (_this.parent) {
          return _this.getRoot().preset;
        }

        return params.load.preset;
      },
      set: function set$$1(v) {
        if (_this.parent) {
          _this.getRoot().preset = v;
        } else {
          params.load.preset = v;
        }

        setPresetSelectIndex(this);

        _this.revert();
      }
    },
    width: {
      get: function get$$1() {
        return params.width;
      },
      set: function set$$1(v) {
        params.width = v;
        setWidth(_this, v);
      }
    },
    name: {
      get: function get$$1() {
        return params.name;
      },
      set: function set$$1(v) {
        params.name = v;

        if (titleRow) {
          titleRow.innerHTML = params.name;
        }
      }
    },
    closed: {
      get: function get$$1() {
        return params.closed;
      },
      set: function set$$1(v) {
        params.closed = v;

        if (params.closed) {
          dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
        } else {
          dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
        }

        this.onResize();

        if (_this.__closeButton) {
          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
        }
      }
    },
    load: {
      get: function get$$1() {
        return params.load;
      }
    },
    useLocalStorage: {
      get: function get$$1() {
        return useLocalStorage;
      },
      set: function set$$1(bool) {
        if (SUPPORTS_LOCAL_STORAGE) {
          useLocalStorage = bool;

          if (bool) {
            dom.bind(window, 'unload', saveToLocalStorage);
          } else {
            dom.unbind(window, 'unload', saveToLocalStorage);
          }

          localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
        }
      }
    }
  });

  if (Common.isUndefined(params.parent)) {
    this.closed = params.closed || false;
    dom.addClass(this.domElement, GUI.CLASS_MAIN);
    dom.makeSelectable(this.domElement, false);

    if (SUPPORTS_LOCAL_STORAGE) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;
        var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));

        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }

    this.__closeButton = document.createElement('div');
    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
    dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);

    if (params.closeOnTop) {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }

    dom.bind(this.__closeButton, 'click', function () {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }

    var titleRowName = document.createTextNode(params.name);
    dom.addClass(titleRowName, 'controller-name');
    titleRow = addRow(_this, titleRowName);

    var onClickTitle = function onClickTitle(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };

    dom.addClass(this.__ul, GUI.CLASS_CLOSED);
    dom.addClass(titleRow, 'title');
    dom.bind(titleRow, 'click', onClickTitle);

    if (!params.closed) {
      this.closed = false;
    }
  }

  if (params.autoPlace) {
    if (Common.isUndefined(params.parent)) {
      if (autoPlaceVirgin) {
        autoPlaceContainer = document.createElement('div');
        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
        dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer);
        autoPlaceVirgin = false;
      }

      autoPlaceContainer.appendChild(this.domElement);
      dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }

    if (!this.parent) {
      setWidth(_this, params.width);
    }
  }

  this.__resizeHandler = function () {
    _this.onResizeDebounced();
  };

  dom.bind(window, 'resize', this.__resizeHandler);
  dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
  this.onResize();

  if (params.resizable) {
    addResizeHandle(this);
  }

  saveToLocalStorage = function saveToLocalStorage() {
    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }
  };

  this.saveToLocalStorageIfPossible = saveToLocalStorage;

  function resetWidth() {
    var root = _this.getRoot();

    root.width += 1;
    Common.defer(function () {
      root.width -= 1;
    });
  }

  if (!params.parent) {
    resetWidth();
  }
};

GUI.toggleHide = function () {
  hide = !hide;
  Common.each(hideableGuis, function (gui) {
    gui.domElement.style.display = hide ? 'none' : '';
  });
};

GUI.CLASS_AUTO_PLACE = 'a';
GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI.CLASS_MAIN = 'main';
GUI.CLASS_CONTROLLER_ROW = 'cr';
GUI.CLASS_TOO_TALL = 'taller-than-window';
GUI.CLASS_CLOSED = 'closed';
GUI.CLASS_CLOSE_BUTTON = 'close-button';
GUI.CLASS_CLOSE_TOP = 'close-top';
GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI.CLASS_DRAG = 'drag';
GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = 'Close Controls';
GUI.TEXT_OPEN = 'Open Controls';

GUI._keydownHandler = function (e) {
  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
    GUI.toggleHide();
  }
};

dom.bind(window, 'keydown', GUI._keydownHandler, false);
Common.extend(GUI.prototype, {
  add: function add(object, property) {
    return _add(this, object, property, {
      factoryArgs: Array.prototype.slice.call(arguments, 2)
    });
  },
  addColor: function addColor(object, property) {
    return _add(this, object, property, {
      color: true
    });
  },
  remove: function remove(controller) {
    this.__ul.removeChild(controller.__li);

    this.__controllers.splice(this.__controllers.indexOf(controller), 1);

    var _this = this;

    Common.defer(function () {
      _this.onResize();
    });
  },
  destroy: function destroy() {
    if (this.parent) {
      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
    }

    if (this.autoPlace) {
      autoPlaceContainer.removeChild(this.domElement);
    }

    var _this = this;

    Common.each(this.__folders, function (subfolder) {
      _this.removeFolder(subfolder);
    });
    dom.unbind(window, 'keydown', GUI._keydownHandler, false);
    removeListeners(this);
  },
  addFolder: function addFolder(name) {
    if (this.__folders[name] !== undefined) {
      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }

    var newGuiParams = {
      name: name,
      parent: this
    };
    newGuiParams.autoPlace = this.autoPlace;

    if (this.load && this.load.folders && this.load.folders[name]) {
      newGuiParams.closed = this.load.folders[name].closed;
      newGuiParams.load = this.load.folders[name];
    }

    var gui = new GUI(newGuiParams);
    this.__folders[name] = gui;
    var li = addRow(this, gui.domElement);
    dom.addClass(li, 'folder');
    return gui;
  },
  removeFolder: function removeFolder(folder) {
    this.__ul.removeChild(folder.domElement.parentElement);

    delete this.__folders[folder.name];

    if (this.load && this.load.folders && this.load.folders[folder.name]) {
      delete this.load.folders[folder.name];
    }

    removeListeners(folder);

    var _this = this;

    Common.each(folder.__folders, function (subfolder) {
      folder.removeFolder(subfolder);
    });
    Common.defer(function () {
      _this.onResize();
    });
  },
  open: function open() {
    this.closed = false;
  },
  close: function close() {
    this.closed = true;
  },
  hide: function hide() {
    this.domElement.style.display = 'none';
  },
  show: function show() {
    this.domElement.style.display = '';
  },
  onResize: function onResize() {
    var root = this.getRoot();

    if (root.scrollable) {
      var top = dom.getOffset(root.__ul).top;
      var h = 0;
      Common.each(root.__ul.childNodes, function (node) {
        if (!(root.autoPlace && node === root.__save_row)) {
          h += dom.getHeight(node);
        }
      });

      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
        dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
      } else {
        dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = 'auto';
      }
    }

    if (root.__resize_handle) {
      Common.defer(function () {
        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
      });
    }

    if (root.__closeButton) {
      root.__closeButton.style.width = root.width + 'px';
    }
  },
  onResizeDebounced: Common.debounce(function () {
    this.onResize();
  }, 50),
  remember: function remember() {
    if (Common.isUndefined(SAVE_DIALOGUE)) {
      SAVE_DIALOGUE = new CenteredDiv();
      SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
    }

    if (this.parent) {
      throw new Error('You can only call remember on a top level GUI.');
    }

    var _this = this;

    Common.each(Array.prototype.slice.call(arguments), function (object) {
      if (_this.__rememberedObjects.length === 0) {
        addSaveMenu(_this);
      }

      if (_this.__rememberedObjects.indexOf(object) === -1) {
        _this.__rememberedObjects.push(object);
      }
    });

    if (this.autoPlace) {
      setWidth(this, this.width);
    }
  },
  getRoot: function getRoot() {
    var gui = this;

    while (gui.parent) {
      gui = gui.parent;
    }

    return gui;
  },
  getSaveObject: function getSaveObject() {
    var toReturn = this.load;
    toReturn.closed = this.closed;

    if (this.__rememberedObjects.length > 0) {
      toReturn.preset = this.preset;

      if (!toReturn.remembered) {
        toReturn.remembered = {};
      }

      toReturn.remembered[this.preset] = getCurrentPreset(this);
    }

    toReturn.folders = {};
    Common.each(this.__folders, function (element, key) {
      toReturn.folders[key] = element.getSaveObject();
    });
    return toReturn;
  },
  save: function save() {
    if (!this.load.remembered) {
      this.load.remembered = {};
    }

    this.load.remembered[this.preset] = getCurrentPreset(this);
    markPresetModified(this, false);
    this.saveToLocalStorageIfPossible();
  },
  saveAs: function saveAs(presetName) {
    if (!this.load.remembered) {
      this.load.remembered = {};
      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
    }

    this.load.remembered[presetName] = getCurrentPreset(this);
    this.preset = presetName;
    addPresetOption(this, presetName, true);
    this.saveToLocalStorageIfPossible();
  },
  revert: function revert(gui) {
    Common.each(this.__controllers, function (controller) {
      if (!this.getRoot().load.remembered) {
        controller.setValue(controller.initialValue);
      } else {
        recallSavedValue(gui || this.getRoot(), controller);
      }

      if (controller.__onFinishChange) {
        controller.__onFinishChange.call(controller, controller.getValue());
      }
    }, this);
    Common.each(this.__folders, function (folder) {
      folder.revert(folder);
    });

    if (!gui) {
      markPresetModified(this.getRoot(), false);
    }
  },
  listen: function listen(controller) {
    var init = this.__listening.length === 0;

    this.__listening.push(controller);

    if (init) {
      updateDisplays(this.__listening);
    }
  },
  updateDisplay: function updateDisplay() {
    Common.each(this.__controllers, function (controller) {
      controller.updateDisplay();
    });
    Common.each(this.__folders, function (folder) {
      folder.updateDisplay();
    });
  }
});

function addRow(gui, newDom, liBefore) {
  var li = document.createElement('li');

  if (newDom) {
    li.appendChild(newDom);
  }

  if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
  } else {
    gui.__ul.appendChild(li);
  }

  gui.onResize();
  return li;
}

function removeListeners(gui) {
  dom.unbind(window, 'resize', gui.__resizeHandler);

  if (gui.saveToLocalStorageIfPossible) {
    dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
  }
}

function markPresetModified(gui, modified) {
  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];

  if (modified) {
    opt.innerHTML = opt.value + '*';
  } else {
    opt.innerHTML = opt.value;
  }
}

function augmentController(gui, li, controller) {
  controller.__li = li;
  controller.__gui = gui;
  Common.extend(controller, {
    options: function options(_options) {
      if (arguments.length > 1) {
        var nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: nextSibling,
          factoryArgs: [Common.toArray(arguments)]
        });
      }

      if (Common.isArray(_options) || Common.isObject(_options)) {
        var _nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: _nextSibling,
          factoryArgs: [_options]
        });
      }
    },
    name: function name(_name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
      return controller;
    },
    listen: function listen() {
      controller.__gui.listen(controller);

      return controller;
    },
    remove: function remove() {
      controller.__gui.remove(controller);

      return controller;
    }
  });

  if (controller instanceof NumberControllerSlider) {
    var box = new NumberControllerBox(controller.object, controller.property, {
      min: controller.__min,
      max: controller.__max,
      step: controller.__step
    });
    Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function (method) {
      var pc = controller[method];
      var pb = box[method];

      controller[method] = box[method] = function () {
        var args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });
    dom.addClass(li, 'has-slider');
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox) {
    var r = function r(returned) {
      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
        controller.remove();

        var newController = _add(gui, controller.object, controller.property, {
          before: controller.__li.nextElementSibling,
          factoryArgs: [controller.__min, controller.__max, controller.__step]
        });

        newController.name(oldName);
        if (wasListening) newController.listen();
        return newController;
      }

      return returned;
    };

    controller.min = Common.compose(r, controller.min);
    controller.max = Common.compose(r, controller.max);
  } else if (controller instanceof BooleanController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__checkbox, 'click');
    });
    dom.bind(controller.__checkbox, 'click', function (e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__button, 'click');
    });
    dom.bind(li, 'mouseover', function () {
      dom.addClass(controller.__button, 'hover');
    });
    dom.bind(li, 'mouseout', function () {
      dom.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
    controller.updateDisplay = Common.compose(function (val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);
    controller.updateDisplay();
  }

  controller.setValue = Common.compose(function (val) {
    if (gui.getRoot().__preset_select && controller.isModified()) {
      markPresetModified(gui.getRoot(), true);
    }

    return val;
  }, controller.setValue);
}

function recallSavedValue(gui, controller) {
  var root = gui.getRoot();

  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);

  if (matchedIndex !== -1) {
    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];

    if (controllerMap === undefined) {
      controllerMap = {};
      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
    }

    controllerMap[controller.property] = controller;

    if (root.load && root.load.remembered) {
      var presetMap = root.load.remembered;
      var preset = void 0;

      if (presetMap[gui.preset]) {
        preset = presetMap[gui.preset];
      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
      } else {
        return;
      }

      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
        var value = preset[matchedIndex][controller.property];
        controller.initialValue = value;
        controller.setValue(value);
      }
    }
  }
}

function _add(gui, object, property, params) {
  if (object[property] === undefined) {
    throw new Error('Object "' + object + '" has no property "' + property + '"');
  }

  var controller = void 0;

  if (params.color) {
    controller = new ColorController(object, property);
  } else {
    var factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory.apply(gui, factoryArgs);
  }

  if (params.before instanceof Controller) {
    params.before = params.before.__li;
  }

  recallSavedValue(gui, controller);
  dom.addClass(controller.domElement, 'c');
  var name = document.createElement('span');
  dom.addClass(name, 'property-name');
  name.innerHTML = controller.property;
  var container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow(gui, container, params.before);
  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);

  if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
  } else {
    dom.addClass(li, _typeof(controller.getValue()));
  }

  augmentController(gui, li, controller);

  gui.__controllers.push(controller);

  return controller;
}

function getLocalStorageHash(gui, key) {
  return document.location.href + '.' + key;
}

function addPresetOption(gui, name, setSelected) {
  var opt = document.createElement('option');
  opt.innerHTML = name;
  opt.value = name;

  gui.__preset_select.appendChild(opt);

  if (setSelected) {
    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
  }
}

function showHideExplain(gui, explain) {
  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
}

function addSaveMenu(gui) {
  var div = gui.__save_row = document.createElement('li');
  dom.addClass(gui.domElement, 'has-save');

  gui.__ul.insertBefore(div, gui.__ul.firstChild);

  dom.addClass(div, 'save-row');
  var gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom.addClass(gears, 'button gears');
  var button = document.createElement('span');
  button.innerHTML = 'Save';
  dom.addClass(button, 'button');
  dom.addClass(button, 'save');
  var button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom.addClass(button2, 'button');
  dom.addClass(button2, 'save-as');
  var button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom.addClass(button3, 'button');
  dom.addClass(button3, 'revert');
  var select = gui.__preset_select = document.createElement('select');

  if (gui.load && gui.load.remembered) {
    Common.each(gui.load.remembered, function (value, key) {
      addPresetOption(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
  }

  dom.bind(select, 'change', function () {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
    }

    gui.preset = this.value;
  });
  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);

  if (SUPPORTS_LOCAL_STORAGE) {
    var explain = document.getElementById('dg-local-explain');
    var localStorageCheckBox = document.getElementById('dg-local-storage');
    var saveLocally = document.getElementById('dg-save-locally');
    saveLocally.style.display = 'block';

    if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
      localStorageCheckBox.setAttribute('checked', 'checked');
    }

    showHideExplain(gui, explain);
    dom.bind(localStorageCheckBox, 'change', function () {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain(gui, explain);
    });
  }

  var newConstructorTextArea = document.getElementById('dg-new-constructor');
  dom.bind(newConstructorTextArea, 'keydown', function (e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE.hide();
    }
  });
  dom.bind(gears, 'click', function () {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom.bind(button, 'click', function () {
    gui.save();
  });
  dom.bind(button2, 'click', function () {
    var presetName = prompt('Enter a new preset name.');

    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom.bind(button3, 'click', function () {
    gui.revert();
  });
}

function addResizeHandle(gui) {
  var pmouseX = void 0;
  gui.__resize_handle = document.createElement('div');
  Common.extend(gui.__resize_handle.style, {
    width: '6px',
    marginLeft: '-3px',
    height: '200px',
    cursor: 'ew-resize',
    position: 'absolute'
  });

  function drag(e) {
    e.preventDefault();
    gui.width += pmouseX - e.clientX;
    gui.onResize();
    pmouseX = e.clientX;
    return false;
  }

  function dragStop() {
    dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.unbind(window, 'mousemove', drag);
    dom.unbind(window, 'mouseup', dragStop);
  }

  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.bind(window, 'mousemove', drag);
    dom.bind(window, 'mouseup', dragStop);
    return false;
  }

  dom.bind(gui.__resize_handle, 'mousedown', dragStart);
  dom.bind(gui.__closeButton, 'mousedown', dragStart);
  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
}

function setWidth(gui, w) {
  gui.domElement.style.width = w + 'px';

  if (gui.__save_row && gui.autoPlace) {
    gui.__save_row.style.width = w + 'px';
  }

  if (gui.__closeButton) {
    gui.__closeButton.style.width = w + 'px';
  }
}

function getCurrentPreset(gui, useInitialValues) {
  var toReturn = {};
  Common.each(gui.__rememberedObjects, function (val, index) {
    var savedValues = {};
    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
    Common.each(controllerMap, function (controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });
    toReturn[index] = savedValues;
  });
  return toReturn;
}

function setPresetSelectIndex(gui) {
  for (var index = 0; index < gui.__preset_select.length; index++) {
    if (gui.__preset_select[index].value === gui.preset) {
      gui.__preset_select.selectedIndex = index;
    }
  }
}

function updateDisplays(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame$1.call(window, function () {
      updateDisplays(controllerArray);
    });
  }

  Common.each(controllerArray, function (c) {
    c.updateDisplay();
  });
}

var color = {
  Color: Color,
  math: ColorMath,
  interpret: interpret
};
exports.color = color;
var controllers = {
  Controller: Controller,
  BooleanController: BooleanController,
  OptionController: OptionController,
  StringController: StringController,
  NumberController: NumberController,
  NumberControllerBox: NumberControllerBox,
  NumberControllerSlider: NumberControllerSlider,
  FunctionController: FunctionController,
  ColorController: ColorController
};
exports.controllers = controllers;
var dom$1 = {
  dom: dom
};
exports.dom = dom$1;
var gui = {
  GUI: GUI
};
exports.gui = gui;
var GUI$1 = GUI;
exports.GUI = GUI$1;
var index = {
  color: color,
  controllers: controllers,
  dom: dom$1,
  gui: gui,
  GUI: GUI$1
};
var _default = index;
exports.default = _default;
},{}],"QCba":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var paper_1 = __importDefault(require("paper"));

var leaf_1 = require("./leaf");

var dat = __importStar(require("dat.gui"));

window.onload = function () {
  // Get a reference to the canvas object
  var canvas = document.getElementById("leaf"); // Create an empty project and a view for the canvas:

  paper_1.default.setup(canvas);
  var vars = {
    prc: 40,
    jd: 0.6,
    k1: 2,
    k2: 9,
    b1: -1,
    b2: 6,
    p1: 10,
    p2: 7,
    color: "green",
    stem_hgt_f: 0.3,
    leaf_wdt_f: 1.3,
    svg: function guiDownloadSVG() {
      downloadSVG();
    },
    png: function guiDownloadPNG() {
      downloadPNG();
    },
    randomize: function guiRandomize() {
      randomize();
    }
  };
  var gui = new dat.GUI(); //

  gui.add(vars, "prc").name("Dettaglio").min(1).max(100).step(1).onChange(function (newValue) {
    refresh();
  }); //

  gui.add(vars, "stem_hgt_f").name("Altezza gambo").min(0).max(1).step(0.01).onChange(function (newValue) {
    refresh();
  });
  gui.add(vars, "leaf_wdt_f").name("Larghezza foglia").min(0).max(3).step(0.01).onChange(function (newValue) {
    refresh();
  });
  gui.add(vars, "jd").min(0).max(1).step(0.01).onChange(function (newValue) {
    refresh();
  });
  gui.add(vars, "k1").min(0).max(30).step(0.5).onChange(function (newValue) {
    refresh();
  });
  gui.add(vars, "k2").min(0).max(30).step(0.5).onChange(function (newValue) {
    refresh();
  });
  gui.add(vars, "b1").min(-30).max(30).step(0.01).onChange(function (newValue) {
    refresh();
  });
  gui.add(vars, "b2").min(-30).max(30).step(0.01).onChange(function (newValue) {
    refresh();
  });
  gui.add(vars, "p1").min(0).max(20).step(0.01).onChange(function (newValue) {
    refresh();
  });
  gui.add(vars, "p2").min(0).max(20).step(0.01).onChange(function (newValue) {
    refresh();
  });
  gui.add(vars, "svg").name("↓ SVG");
  gui.add(vars, "png").name("↓ PNG");
  gui.add(vars, "randomize").name("Randomizza!");

  function refresh() {
    paper_1.default.project.clear();
    var leaf_hgt = paper_1.default.view.size.height / 3;
    var leaf_wdt = leaf_hgt * vars.leaf_wdt_f;
    var stem_hgt = leaf_hgt * vars.stem_hgt_f;
    var leaf_x = paper_1.default.view.size.width / 2;
    var leaf_y = (paper_1.default.view.size.height - leaf_hgt) / 2;
    var leaf = leaf_1.calcLeaf(vars.prc, vars.jd, vars.k1, vars.k2, vars.b1, vars.b2, vars.p1, vars.p2);
    leaf_1.drawLeaf(leaf, leaf_x, leaf_y, leaf_wdt, leaf_hgt - stem_hgt, stem_hgt, vars.color);
  } // Draw the view now:


  refresh(); // randomize();

  paper_1.default.view.onResize = function () {
    refresh();
  };

  window.addEventListener("resize", function (event) {
    refresh();
  }); // Download

  function downloadSVG() {
    var svgData = paper_1.default.project.exportSVG(); // Use any when stuff is not recognized

    svgData.outerHTML; // So now we can use outerHTML even if not recognized by typescript

    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData.outerHTML], {
      type: "image/svg+xml;charset=utf-8"
    });
    var svgUrl = URL.createObjectURL(svgBlob);
    var name = getname() + ".svg";
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    downloadLink.click();
  }

  function downloadPNG() {
    var imgData = canvas.toDataURL();
    var name = getname() + ".png";
    var downloadLink = document.createElement("a");
    downloadLink.href = imgData;
    downloadLink.download = name;
    downloadLink.click();
  }

  function randomize() {
    console.log(gui);

    gui.__controllers.forEach(function (control) {
      if (control.constructor.name == "NumberControllerSlider") {
        var max = control.__max;
        var min = control.__min;
        var val = min + (max - min) * Math.random();
        control.setValue(val); //

        getname();
      }
    });
  }

  function getname() {
    var name = "";

    gui.__controllers.forEach(function (control) {
      if (control.constructor.name == "NumberControllerSlider") {
        name += control.property + "=" + control.object[control.property] + "_";
      }
    });

    return name;
  }
};
},{"paper":"kGI0","./leaf":"NSZU","dat.gui":"ArXC"}]},{},["QCba"], null)