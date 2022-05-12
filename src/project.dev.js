window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Animation: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9b28ffIUXRINaX4xYH+BqEr", "Animation");
    "use strict";
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        Skeleton: sp.Skeleton,
        Bullet: cc.Prefab,
        _jump: null,
        _slide: null,
        _moveLeft: null,
        _moveRight: null,
        _shoot: null,
        _flag: false
      },
      onLoad: function onLoad() {
        this._jump = this.jump.bind(this);
        this._slide = this.slide.bind(this);
        this._moveRight = this.moveRight.bind(this);
        this._moveLeft = this.moveLeft.bind(this);
        this._shoot = this.shoot.bind(this);
        Emitter.instance = new Emitter();
        Emitter.instance.registerEvent("keyup_down", this._jump);
        Emitter.instance.registerEvent("keydown_up", this._slide);
        Emitter.instance.registerEvent("keyright_down", this._moveRight);
        Emitter.instance.registerEvent("keyright_up", this._moveRight);
        Emitter.instance.registerEvent("keyleft_down", this._moveLeft);
        Emitter.instance.registerEvent("keyleft_up", this._moveLeft);
        Emitter.instance.registerEvent("keyspace_down", this._shoot);
      },
      shoot: function shoot(value) {
        cc.log(value);
        if (!this._flag) {
          var bullet = cc.instantiate(this.Bullet);
          bullet.parent = this.Skeleton.node;
          bullet.active = true;
          bullet.runAction(cc.sequence(cc.moveBy(.1, 3e3, 0), cc.callFunc(this.removeBullet, this)));
          this.Skeleton.setAnimation(0, "idle-shoot", false);
          this.Skeleton.addAnimation(0, "idle", true);
        }
      },
      removeBullet: function removeBullet() {
        for (var i = 0; i < this.node._children.length; i++) this.node._children[i].destroy();
      },
      jump: function jump(value) {
        var _this = this;
        cc.log(value);
        if (!this._flag) {
          var jumpUp = cc.moveBy(.4, cc.v2(0, 200));
          var jumpDown = cc.moveBy(.4, cc.v2(0, -200));
          var jump = cc.sequence(jumpUp, cc.delayTime(.1), jumpDown);
          this.node.getComponent(cc.BoxCollider).node.runAction(jump);
          this._flag = true;
          this.Skeleton.setAnimation(0, "jump", false);
          this.Skeleton.addAnimation(0, "idle-turn", false);
          this.Skeleton.addAnimation(0, "idle", true);
          this.Skeleton.setEventListener(function(entry, event) {
            0 != entry.animationEnd && (_this._flag = false);
          });
        }
      },
      slide: function slide(value) {
        var _this2 = this;
        cc.log(value);
        if (!this._flag) {
          this._flag = true;
          this.Skeleton.setAnimation(0, "hoverboard", true);
          this.Skeleton.setEventListener(function(entry, event) {
            0 != entry.animationEnd && (_this2._flag = false);
          });
        }
      },
      moveLeft: function moveLeft(value) {
        cc.log(value);
        var move = cc.sequence(cc.moveBy(5, -1e3, 0), cc.moveBy(4, -3e3, 0));
        if (!this._flag && value) {
          this._flag = true;
          this.node.runAction(cc.flipX(true));
          this.node.runAction(move);
          move.setTag(0);
          this.Skeleton.setAnimation(0, "walk", false);
          this.Skeleton.addAnimation(0, "run", true);
        } else if (!this._flag || !value) {
          this._flag = false;
          this.node.stopActionByTag(0);
          this.Skeleton.setAnimation(0, "run-to-idle", false);
          this.Skeleton.addAnimation(0, "idle", true);
        }
      },
      moveRight: function moveRight(value) {
        cc.log(value);
        var move = cc.sequence(cc.moveBy(5, 1e3, 0), cc.moveBy(4, 3e3, 0));
        if (!this._flag && value) {
          this._flag = true;
          this.node.runAction(cc.flipX(false));
          this.node.runAction(move);
          move.setTag(0);
          this.Skeleton.setAnimation(0, "walk", false);
          this.Skeleton.addAnimation(0, "run", true);
        } else if (!this._flag || !value) {
          this._flag = false;
          this.node.stopActionByTag(0);
          this.Skeleton.setAnimation(0, "run-to-idle", false);
          this.Skeleton.addAnimation(0, "idle", true);
        }
      },
      start: function start() {
        this.Skeleton.addAnimation(0, "portal", false);
        this.Skeleton.addAnimation(0, "idle", true);
      }
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  1: [ function(require, module, exports) {
    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || void 0;
    }
    module.exports = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.emit = function(type) {
      var er, handler, len, args, i, listeners;
      this._events || (this._events = {});
      if ("error" === type && (!this._events.error || isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) throw er;
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
        err.context = er;
        throw err;
      }
      handler = this._events[type];
      if (isUndefined(handler)) return false;
      if (isFunction(handler)) switch (arguments.length) {
       case 1:
        handler.call(this);
        break;

       case 2:
        handler.call(this, arguments[1]);
        break;

       case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

       default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }
      return true;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      var m;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      this._events || (this._events = {});
      this._events.newListener && this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
      this._events[type] ? isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener;
      if (isObject(this._events[type]) && !this._events[type].warned) {
        m = isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners;
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          "function" === typeof console.trace && console.trace();
        }
      }
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function(type, listener) {
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      var fired = false;
      function g() {
        this.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }
      g.listener = listener;
      this.on(type, g);
      return this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var list, position, length, i;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      if (!this._events || !this._events[type]) return this;
      list = this._events[type];
      length = list.length;
      position = -1;
      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        this._events.removeListener && this.emit("removeListener", type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0; ) if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
        if (position < 0) return this;
        if (1 === list.length) {
          list.length = 0;
          delete this._events[type];
        } else list.splice(position, 1);
        this._events.removeListener && this.emit("removeListener", type, listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      var key, listeners;
      if (!this._events) return this;
      if (!this._events.removeListener) {
        0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type];
        return this;
      }
      if (0 === arguments.length) {
        for (key in this._events) {
          if ("removeListener" === key) continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this;
      }
      listeners = this._events[type];
      if (isFunction(listeners)) this.removeListener(type, listeners); else if (listeners) while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      delete this._events[type];
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var ret;
      ret = this._events && this._events[type] ? isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
      return ret;
    };
    EventEmitter.prototype.listenerCount = function(type) {
      if (this._events) {
        var evlistener = this._events[type];
        if (isFunction(evlistener)) return 1;
        if (evlistener) return evlistener.length;
      }
      return 0;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      return emitter.listenerCount(type);
    };
    function isFunction(arg) {
      return "function" === typeof arg;
    }
    function isNumber(arg) {
      return "number" === typeof arg;
    }
    function isObject(arg) {
      return "object" === typeof arg && null !== arg;
    }
    function isUndefined(arg) {
      return void 0 === arg;
    }
  }, {} ],
  Collider: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6e1e63+uYdNbavegsW2rKOZ", "Collider");
    "use strict";
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        winLayout: cc.Layout
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        cc.log("on collision enter");
        cc.log(self);
        cc.log(other);
        switch (self.node.name) {
         case "SpineBoy":
          self.node.getComponent(sp.Skeleton).setAnimation(0, "death", false);
          "windoor" == other.node.name && (this.winLayout.node.active = true);
          break;

         case "Bullet":
          if ("Rabbit" == other.node.name) {
            self.node.destroy();
            other.node.runAction(cc.blink(.5, 3));
            cc.log(other.node._children[0]._components[1].barSprite.node.color.b);
            other.node._children[0]._components[1].progress -= .1;
            other.node._children[0]._components[1].progress <= 0 && other.node.destroy();
            Emitter.instance.emit("hit", true);
          }
        }
      },
      onCollisionStay: function onCollisionStay(other, self) {
        cc.log("on collision stay");
      },
      onCollisionExit: function onCollisionExit(other, self) {
        cc.log("on collision exit");
      },
      onLoad: function onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  HelloWorld: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "280c3rsZJJKnZ9RqbALVwtK", "HelloWorld");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        label: {
          default: null,
          type: cc.Label
        },
        text: "Hello, World!"
      },
      onLoad: function onLoad() {
        this.label.string = this.text;
      },
      update: function update(dt) {}
    });
    cc._RF.pop();
  }, {} ],
  KeyController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c113189MsBD15CsBcbcrkMY", "KeyController");
    "use strict";
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        _flag: false
      },
      onLoad: function onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
      },
      onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.up:
          if (!this._flag) {
            this._flag = true;
            console.log("Press Up");
            Emitter.instance.emit("keyup_down", true);
          }
          break;

         case cc.macro.KEY.down:
          console.log("Press Down");
          break;

         case cc.macro.KEY.left:
          if (!this._flag) {
            this._flag = true;
            console.log("Press Left");
            Emitter.instance.emit("keyleft_down", true);
          }
          break;

         case cc.macro.KEY.right:
          if (!this._flag) {
            this._flag = true;
            console.log("Press Right");
            Emitter.instance.emit("keyright_down", true);
          }
          break;

         case cc.macro.KEY.space:
          if (!this._flag) {
            this._flag = true;
            console.log("Press Space");
            Emitter.instance.emit("keyspace_down", true);
          }
        }
      },
      onKeyUp: function onKeyUp(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.up:
          this._flag = false;
          console.log("Release Up");
          Emitter.instance.emit("keyup_up", false);
          break;

         case cc.macro.KEY.down:
          console.log("Release Down");
          Emitter.instance.emit("keydown_up", true);
          break;

         case cc.macro.KEY.left:
          this._flag = false;
          console.log("Release Left");
          Emitter.instance.emit("keyleft_up", false);
          break;

         case cc.macro.KEY.right:
          this._flag = false;
          console.log("Release Right");
          Emitter.instance.emit("keyright_up", false);
          break;

         case cc.macro.KEY.space:
          this._flag = false;
          console.log("Release Space");
          Emitter.instance.emit("keyspace_up", false);
        }
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  ScaleY: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "584f43Q0CROUL4ZmIXWYrdB", "ScaleY");
    "use strict";
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        Hp: cc.ProgressBar,
        _decreaseHp: null
      },
      onLoad: function onLoad() {
        this._decreaseHp = this.decreaseHp.bind(this);
        Emitter.instance = new Emitter();
        Emitter.instance.registerEvent("hit", this._decreaseHp);
      },
      decreaseHp: function decreaseHp(value) {
        cc.log(value);
        this.Hp.progress -= .1;
      },
      start: function start() {
        this.Hp.progress = 1;
        this.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.5, .4, .38), cc.scaleTo(.5, .4, .4))));
      }
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  mEmitter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cb46aAtteZNOYRFkavQxGCI", "mEmitter");
    "use strict";
    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          "value" in descriptor && (descriptor.writable = true);
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        protoProps && defineProperties(Constructor.prototype, protoProps);
        staticProps && defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var EventEmitter = require("events");
    var mEmitter = function() {
      function mEmitter() {
        _classCallCheck(this, mEmitter);
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
      }
      _createClass(mEmitter, [ {
        key: "emit",
        value: function emit() {
          var _emiter;
          (_emiter = this._emiter).emit.apply(_emiter, arguments);
        }
      }, {
        key: "registerEvent",
        value: function registerEvent(event, listener) {
          this._emiter.on(event, listener);
        }
      }, {
        key: "registerOnce",
        value: function registerOnce(event, listener) {
          this._emiter.once(event, listener);
        }
      }, {
        key: "removeEvent",
        value: function removeEvent(event, listener) {
          this._emiter.removeListener(event, listener);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this._emiter.removeAllListeners();
          this._emiter = null;
          mEmitter.instance = null;
        }
      } ]);
      return mEmitter;
    }();
    mEmitter.instance = null;
    module.exports = mEmitter;
    cc._RF.pop();
  }, {
    events: 1
  } ]
}, {}, [ "Animation", "Collider", "HelloWorld", "KeyController", "ScaleY", "mEmitter" ]);