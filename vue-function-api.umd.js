(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.vueFunctionApi = {}));
}(this, function (exports) { 'use strict';

  var toString = function (x) { return Object.prototype.toString.call(x); };
  var hasSymbol = typeof Symbol === 'function' && Symbol.for;
  var noopFn = function (_) { return _; };
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(obj, key) {
      return hasOwnProperty.call(obj, key);
  }
  function assert(condition, msg) {
      if (!condition)
          throw new Error("[vue-function-api] " + msg);
  }
  function isArray(x) {
      return toString(x) === '[object Array]';
  }
  function isPlainObject(x) {
      return toString(x) === '[object Object]';
  }

  var currentVue = null;
  var currentVM = null;
  function getCurrentVue() {
      {
          assert(currentVue, "must call Vue.use(plugin) before using any function.");
      }
      return currentVue;
  }
  function setCurrentVue(vue) {
      currentVue = vue;
  }
  function getCurrentVM() {
      return currentVM;
  }
  function setCurrentVM(vue) {
      currentVM = vue;
  }

  var AbstractWrapper = /** @class */ (function () {
      function AbstractWrapper() {
      }
      AbstractWrapper.prototype.setPropertyName = function (name) {
          this._name = name;
      };
      return AbstractWrapper;
  }());

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

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  var ValueWrapper = /** @class */ (function (_super) {
      __extends(ValueWrapper, _super);
      function ValueWrapper(_interal) {
          var _this = _super.call(this) || this;
          _this._interal = _interal;
          return _this;
      }
      Object.defineProperty(ValueWrapper.prototype, "value", {
          get: function () {
              return this._interal.$$state;
          },
          set: function (v) {
              this._interal.$$state = v;
          },
          enumerable: true,
          configurable: true
      });
      return ValueWrapper;
  }(AbstractWrapper));

  var ComputedWrapper = /** @class */ (function (_super) {
      __extends(ComputedWrapper, _super);
      function ComputedWrapper(_interal) {
          var _this = _super.call(this) || this;
          _this._interal = _interal;
          return _this;
      }
      Object.defineProperty(ComputedWrapper.prototype, "value", {
          get: function () {
              return this._interal.read();
          },
          set: function (val) {
              if (!this._interal.write) {
                  {
                      assert(false, "Computed property \"" + this._name + "\" was assigned to but it has no setter.");
                  }
              }
              else {
                  this._interal.write(val);
              }
          },
          enumerable: true,
          configurable: true
      });
      return ComputedWrapper;
  }(AbstractWrapper));

  function isWrapper(obj) {
      return obj instanceof AbstractWrapper;
  }
  function ensuerCurrentVMInFn(hook) {
      var vm = getCurrentVM();
      {
          assert(vm, "\"" + hook + "\" get called outside of \"setup()\"");
      }
      return vm;
  }
  function observable(obj) {
      var Vue = getCurrentVue();
      if (Vue.observable) {
          return Vue.observable(obj);
      }
      var silent = Vue.config.silent;
      Vue.config.silent = true;
      var vm = new Vue({
          data: {
              $$state: obj,
          },
      });
      Vue.config.silent = silent;
      return vm._data.$$state;
  }
  function compoundComputed(computed) {
      var Vue = getCurrentVue();
      var silent = Vue.config.silent;
      Vue.config.silent = true;
      var reactive = new Vue({
          computed: computed,
      });
      Vue.config.silent = silent;
      return reactive;
  }

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData(to, from) {
      if (!from)
          return to;
      var key;
      var toVal;
      var fromVal;
      var keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);
      for (var i = 0; i < keys.length; i++) {
          key = keys[i];
          // in case the object is already observed...
          if (key === '__ob__')
              continue;
          toVal = to[key];
          fromVal = from[key];
          if (!hasOwn(to, key)) {
              to[key] = fromVal;
          }
          else if (toVal !== fromVal &&
              (isPlainObject(toVal) && !isWrapper(toVal)) &&
              (isPlainObject(fromVal) && !isWrapper(toVal))) {
              mergeData(toVal, fromVal);
          }
      }
      return to;
  }
  function install(Vue, _install) {
      if (currentVue && currentVue === Vue) {
          {
              assert(false, 'already installed. Vue.use(plugin) should be called only once');
          }
          return;
      }
      Vue.config.optionMergeStrategies.setup = function (parent, child) {
          return function mergedSetupFn(props) {
              return mergeData(typeof child === 'function' ? child.call(this, props) || {} : {}, typeof parent === 'function' ? parent.call(this, props) || {} : {});
          };
      };
      setCurrentVue(Vue);
      _install(Vue);
  }

  function mixin(Vue) {
      Vue.mixin({
          created: vuexInit,
      });
      /**
       * Vuex init hook, injected into each instances init hooks list.
       */
      function vuexInit() {
          var vm = this;
          var setup = vm.$options.setup;
          if (setup) {
              if (typeof setup !== 'function') {
                  Vue.util.warn('The "setup" option should be a function that returns a object in component definitions.', vm);
                  return;
              }
              var binding_1;
              try {
                  setCurrentVM(vm);
                  binding_1 = setup.call(vm, vm.$props);
              }
              catch (err) {
                  {
                      Vue.util.warn("there is an error occuring in \"setup\"", vm);
                  }
                  console.log(err);
              }
              finally {
                  setCurrentVM(null);
              }
              if (!binding_1)
                  return;
              {
                  assert(isPlainObject(binding_1), "\"setup\" must return a \"Object\", get \"" + Object.prototype.toString
                      .call(binding_1)
                      .slice(8, -1) + "\"");
              }
              Object.keys(binding_1).forEach(function (name) {
                  var bindingValue = binding_1[name];
                  if (isWrapper(bindingValue)) {
                      bindingValue.setPropertyName(name);
                      proxy(vm, name, function () { return bindingValue.value; }, function (val) {
                          bindingValue.value = val;
                      });
                  }
                  else {
                      vm[name] = bindingValue;
                  }
              });
          }
      }
  }
  var sharedPropertyDefinition = {
      enumerable: true,
      configurable: true,
      get: noopFn,
      set: noopFn,
  };
  function proxy(target, key, getter, setter) {
      sharedPropertyDefinition.get = getter;
      sharedPropertyDefinition.set = setter || noopFn;
      Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function upWrapping(obj) {
      var keys = Object.keys(obj);
      for (var index = 0; index < keys.length; index++) {
          var key = keys[index];
          var value_1 = obj[key];
          if (isWrapper(value_1)) {
              obj[key] = value_1.value;
          }
          else if (isPlainObject(value_1) || isArray(value_1)) {
              obj[key] = upWrapping(value_1);
          }
      }
      return obj;
  }
  function state(value) {
      return observable(upWrapping(value));
  }
  function value(value) {
      return new ValueWrapper(observable({ $$state: upWrapping(value) }));
  }

  var genName = function (name) { return "on" + (name[0].toUpperCase() + name.slice(1)); };
  function createLifeCycle(lifeCyclehook) {
      return function (callback) {
          var vm = ensuerCurrentVMInFn(genName(lifeCyclehook));
          vm.$on("hook:" + lifeCyclehook, callback);
      };
  }
  function createLifeCycles(lifeCyclehooks, name) {
      return function (callback) {
          var vm = ensuerCurrentVMInFn(name);
          lifeCyclehooks.forEach(function (lifeCyclehook) { return vm.$on("hook:" + lifeCyclehook, callback); });
      };
  }
  var onCreated = createLifeCycle('created');
  var onBeforeMount = createLifeCycle('beforeMount');
  var onMounted = createLifeCycle('mounted');
  var onBeforeUpdate = createLifeCycle('beforeUpdate');
  var onUpdated = createLifeCycle('updated');
  var onActivated = createLifeCycle('activated');
  var onDeactivated = createLifeCycle('deactivated');
  var onBeforeDestroy = createLifeCycle('beforeDestroy');
  var onDestroyed = createLifeCycle('destroyed');
  var onErrorCaptured = createLifeCycle('errorCaptured');
  // only one event will be fired between destroyed and deactivated when an unmount occurs
  var onUnmounted = createLifeCycles(['destroyed', 'deactivated'], genName('unmounted'));

  function createSymbol(name) {
      return hasSymbol ? Symbol.for(name) : name;
  }
  var WatcherPreFlushQueueKey = createSymbol('vfa.key.preFlushQueue');
  var WatcherPostFlushQueueKey = createSymbol('vfa.key.postFlushQueue');

  function hasWatchEnv(vm) {
      return vm[WatcherPreFlushQueueKey] !== undefined;
  }
  function installWatchEnv(vm) {
      vm[WatcherPreFlushQueueKey] = [];
      vm[WatcherPostFlushQueueKey] = [];
      vm.$on('hook:beforeUpdate', createFlusher(WatcherPreFlushQueueKey));
      vm.$on('hook:updated', createFlusher(WatcherPostFlushQueueKey));
  }
  function createFlusher(key) {
      return function () {
          flushQueue(this, key);
      };
  }
  function flushQueue(vm, key) {
      var queue = vm[key];
      for (var index = 0; index < queue.length; index++) {
          queue[index]();
      }
      queue.length = 0;
  }
  function flushWatcherCallback(vm, fn, mode) {
      // flush all when beforeUpdate and updated are not fired
      function fallbackFlush() {
          vm.$nextTick(function () {
              if (vm[WatcherPreFlushQueueKey].length) {
                  flushQueue(vm, WatcherPreFlushQueueKey);
              }
              if (vm[WatcherPostFlushQueueKey].length) {
                  flushQueue(vm, WatcherPostFlushQueueKey);
              }
          });
      }
      switch (mode) {
          case 'pre':
              fallbackFlush();
              vm[WatcherPreFlushQueueKey].push(fn);
              break;
          case 'post':
              fallbackFlush();
              vm[WatcherPostFlushQueueKey].push(fn);
              break;
          case 'auto':
          case 'sync':
              fn();
              break;
          default:
              assert(false, "flush must be one of [\"post\", \"pre\", \"sync\"], but got " + mode);
              break;
      }
  }
  function createSingleSourceWatcher(vm, source, cb, options) {
      var getter;
      if (isWrapper(source)) {
          getter = function () { return source.value; };
      }
      else {
          getter = source;
      }
      var callbackRef = function (n, o) {
          callbackRef = flush;
          if (!options.lazy) {
              cb(n, o);
          }
          else {
              flush(n, o);
          }
      };
      var flush = function (n, o) {
          flushWatcherCallback(vm, function () {
              cb(n, o);
          }, options.flush);
      };
      return vm.$watch(getter, function (n, o) {
          callbackRef(n, o);
      }, {
          immediate: !options.lazy,
          deep: options.deep,
          // @ts-ignore
          sync: options.flush === 'sync',
      });
  }
  function createMuiltSourceWatcher(vm, sources, cb, options) {
      var execCallbackAfterNumRun = options.lazy ? false : sources.length;
      var pendingCallback = false;
      var watcherContext = [];
      function execCallback() {
          cb.apply(vm, watcherContext.reduce(function (acc, ctx) {
              acc[0].push(ctx.value);
              acc[1].push(ctx.oldValue);
              return acc;
          }, [[], []]));
      }
      function stop() {
          watcherContext.forEach(function (ctx) { return ctx.watcherStopHandle(); });
      }
      var callbackRef = function () {
          if (execCallbackAfterNumRun !== false) {
              if (--execCallbackAfterNumRun === 0) {
                  execCallbackAfterNumRun = false;
                  callbackRef = flush;
                  execCallback();
              }
          }
          else {
              callbackRef = flush;
              flush();
          }
      };
      var flush = function () {
          if (!pendingCallback) {
              pendingCallback = true;
              flushWatcherCallback(vm, function () {
                  pendingCallback = false;
                  execCallback();
              }, options.flush);
          }
      };
      sources.forEach(function (source) {
          var getter;
          if (isWrapper(source)) {
              getter = function () { return source.value; };
          }
          else {
              getter = source;
          }
          var watcherCtx = {};
          // must push watcherCtx before create watcherStopHandle
          watcherContext.push(watcherCtx);
          watcherCtx.watcherStopHandle = vm.$watch(getter, function (n, o) {
              watcherCtx.value = n;
              watcherCtx.oldValue = o;
              callbackRef();
          }, {
              immediate: !options.lazy,
              deep: options.deep,
              // @ts-ignore
              sync: options.flush === 'sync',
          });
      });
      return stop;
  }
  function watch(source, cb, options) {
      if (options === void 0) { options = {}; }
      var opts = __assign({
          lazy: false,
          deep: false,
          flush: 'post',
      }, options);
      var vm = getCurrentVM();
      if (!vm) {
          var Vue_1 = getCurrentVue();
          var silent = Vue_1.config.silent;
          Vue_1.config.silent = true;
          vm = new Vue_1();
          Vue_1.config.silent = silent;
          opts.flush = 'auto';
      }
      if (!hasWatchEnv(vm))
          installWatchEnv(vm);
      if (isArray(source)) {
          return createMuiltSourceWatcher(vm, source, cb, opts);
      }
      return createSingleSourceWatcher(vm, source, cb, opts);
  }

  function computed(getter, setter) {
      var computedHost = compoundComputed({
          $$state: setter
              ? {
                  get: getter,
                  set: setter,
              }
              : getter,
      });
      return new ComputedWrapper({
          read: function () { return computedHost.$$state; },
          write: function (v) {
              computedHost.$$state = v;
          },
      });
  }

  function resolveInject(provideKey, vm) {
      var source = vm;
      while (source) {
          // @ts-ignore
          if (source._provided && hasOwn(source._provided, provideKey)) {
              //@ts-ignore
              return source._provided[provideKey];
          }
          source = source.$parent;
      }
      {
          getCurrentVue().util.warn("Injection \"" + String(provideKey) + "\" not found", vm);
      }
  }
  function provide(provideOption) {
      if (!provideOption) {
          return;
      }
      var vm = ensuerCurrentVMInFn('provide');
      vm._provided =
          typeof provideOption === 'function' ? provideOption.call(vm) : provideOption;
  }
  function inject(injectKey) {
      if (!injectKey) {
          return;
      }
      var vm = ensuerCurrentVMInFn('inject');
      return resolveInject(injectKey, vm);
  }

  var _install = function (Vue) { return install(Vue, mixin); };
  var plugin = {
      install: _install,
  };
  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  if (currentVue && typeof window !== 'undefined' && window.Vue) {
      _install(window.Vue);
  }

  exports.computed = computed;
  exports.inject = inject;
  exports.onActivated = onActivated;
  exports.onBeforeDestroy = onBeforeDestroy;
  exports.onBeforeMount = onBeforeMount;
  exports.onBeforeUpdate = onBeforeUpdate;
  exports.onCreated = onCreated;
  exports.onDeactivated = onDeactivated;
  exports.onDestroyed = onDestroyed;
  exports.onErrorCaptured = onErrorCaptured;
  exports.onMounted = onMounted;
  exports.onUnmounted = onUnmounted;
  exports.onUpdated = onUpdated;
  exports.plugin = plugin;
  exports.provide = provide;
  exports.state = state;
  exports.value = value;
  exports.watch = watch;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
