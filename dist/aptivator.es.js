import _ from 'lodash';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import $ from 'jquery';

var aptivator = {};

var activatingRegulars = [];
var activatingTransients = [];
var configs = {};
var dataParams = {};
var deactivating = [];
var errorRegistry = [];
var eventRegistry = {};
var history = [];
var paramsMap = {};
var queue = [];
var registry = {};
var resolveDefinitions = {};
var resolveParams = {};
var rootStateName = 'root';
var router = new Backbone.Router();
var spaceSplitter = /\s+/;
var transientDelay = 300;
var transientRegistry = [];

aptivator.history = {
  find: function find(predicate) {
    return _.filter(history, predicate).reverse();
  },
  findOne: function findOne(predicate) {
    return this.find(predicate)[0];
  }
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// 7.1.4 ToInteger
var ceil  = Math.ceil;
var floor = Math.floor;
var _toInteger = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function(TO_STRING){
  return function(that, pos){
    var s = String(_defined(that))
      , i = _toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library = true;

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
});

var _aFunction = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function(fn, that, length){
  _aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

var _isObject = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function(it){
  if(!_isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

var document$1 = _global.document;
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function(it){
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function(){
  return Object.defineProperty(_domCreate('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function(it, S){
  if(!_isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP             = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes){
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if(_ie8DomDefine)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

var _hide = _descriptors ? function(object, key, value){
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? _core : _core[name] || (_core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])_hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
var _export = $export;

var _redefine = _hide;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function(it, key){
  return hasOwnProperty.call(it, key);
};

var _iterators = {};

var toString = {}.toString;

var _cof = function(it){
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// to indexed object, toObject with fallback for non-array-like ES3 strings

var _toIobject = function(it){
  return _iobject(_defined(it));
};

// 7.1.15 ToLength
var min       = Math.min;
var _toLength = function(it){
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max       = Math.max;
var min$1       = Math.min;
var _toIndex = function(index, length){
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes

var _arrayIncludes = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = _toIobject($this)
      , length = _toLength(O.length)
      , index  = _toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var SHARED = '__core-js_shared__';
var store  = _global[SHARED] || (_global[SHARED] = {});
var _shared = function(key){
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');
var _sharedKey = function(key){
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO$1     = _sharedKey('IE_PROTO');

var _objectKeysInternal = function(object, names){
  var O      = _toIobject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO$1)_has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(_has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)


var _objectKeys = Object.keys || function keys(O){
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties){
  _anObject(O);
  var keys   = _objectKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)_objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var _html = _global.document && document.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var IE_PROTO    = _sharedKey('IE_PROTO');
var Empty       = function(){ /* empty */ };
var PROTOTYPE$1   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe')
    , i      = _enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty;
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
var store      = _shared('wks')
  , Symbol     = _global.Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;
var TAG = _wks('toStringTag');

var _setToStringTag = function(it, tag, stat){
  if(it && !_has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function(){ return this; });

var _iterCreate = function(Constructor, NAME, next){
  Constructor.prototype = _objectCreate(IteratorPrototype, {next: _propertyDesc(1, next)});
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 7.1.13 ToObject(argument)

var _toObject = function(it){
  return Object(_defined(it));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var IE_PROTO$2    = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function(O){
  O = _toObject(O);
  if(_has(O, IE_PROTO$2))return O[IE_PROTO$2];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var ITERATOR       = _wks('iterator');
var BUGGY          = !([].keys && 'next' in [].keys());
var FF_ITERATOR    = '@@iterator';
var KEYS           = 'keys';
var VALUES         = 'values';

var returnThis = function(){ return this; };

var _iterDefine = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  _iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = _objectGpo($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!_library && !_has(IteratorPrototype, ITERATOR))_hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))_redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at  = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

// call something on iterator step with safe closing on error

var _iterCall = function(iterator, fn, value, entries){
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)_anObject(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator
var ITERATOR$1   = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function(it){
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
};

var _createProperty = function(object, index, value){
  if(index in object)_objectDp.f(object, index, _propertyDesc(0, value));
  else object[index] = value;
};

// getting tag from 19.1.3.6 Object.prototype.toString()
var TAG$1 = _wks('toStringTag');
var ARG = _cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

var _classof = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var ITERATOR$2  = _wks('iterator');
var core_getIteratorMethod = _core.getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR$2]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var ITERATOR$3     = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

var _iterDetect = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR$3]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR$3] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

_export(_export.S + _export.F * !_iterDetect(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = _toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = core_getIteratorMethod(O)
      , length, result, step, iterator;
    if(mapping)mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && _isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = _toLength(O.length);
      for(result = new C(length); length > index; index++){
        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

var from$2 = _core.Array.from;

var from = createCommonjsModule(function (module) {
module.exports = { "default": from$2, __esModule: true };
});

var toConsumableArray = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _from2 = _interopRequireDefault(from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
});

var _toConsumableArray = unwrapExports(toConsumableArray);

var registrar = (function (events, callback, context, once) {
  if (_.isString(events)) {
    events = events.trim().split(spaceSplitter);
  }

  if (!_.isArray(callback)) {
    callback = [{ callback: callback, context: context }];
  }

  callback = _.map(callback, function (callbackRecord) {
    callbackRecord = _.isFunction(callbackRecord) ? { callback: callbackRecord } : callbackRecord;
    return _.extend(callbackRecord, { once: once });
  });

  _.each(events, function (event) {
    var callbacks = eventRegistry[event] || (eventRegistry[event] = []);

    if (once) {
      var onceRemover = _.findIndex(callbacks, { onceRemover: true });
      if (onceRemover !== -1) {
        onceRemover = callbacks.splice(onceRemover, 1)[0];
      } else {
        var _callback = function _ignore() {
          var onces = _.filter(callbacks, { once: true });

          _.each(onces, function (callbackRecord) {
            var callback = callbackRecord.callback,
                context = callbackRecord.context;

            aptivator.off(event, callback, context);
          });
        };

        onceRemover = { callback: _callback, once: true, onceRemover: true };
      }

      callback.push(onceRemover);
    }

    callbacks.push.apply(callbacks, _toConsumableArray(callback));
  });
});

var unwinder = (function (eventsConfigs, handlePartsBase, once) {
  _.each(eventsConfigs, function (configs, eventName) {
    var callbacks = configs.callbacks;

    var handleParts = handlePartsBase.concat(eventName);

    if (_.isArray(configs)) {
      callbacks = configs;
    } else if (_.isFunction(configs) || _.has(configs, 'callback')) {
      callbacks = [configs];
    } else if (_.isFunction(callbacks) || _.has(callbacks, 'callback')) {
      callbacks = [callbacks];
    }

    if (callbacks) {
      var handleName = handleParts.join(':');
      aptivator.on(handleName, callbacks, null, once);
    }

    if (_.isPlainObject(configs)) {
      var childrenConfigs = _.omit(configs, 'callbacks');
      if (!_.isEmpty(childrenConfigs)) {
        aptivator.on(childrenConfigs, handleParts, null, once);
      }
    }
  });
});

var on = (function (events) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var context = arguments[2];
  var once = arguments[3];

  if (_.isString(events) || _.isArray(events)) {
    return registrar(events, callback, context, once);
  }

  unwinder(events, callback, once);
});

var once = (function (events, callback, context) {
  aptivator.on(events, callback, context, true);
});

var _addToUnscopables = function(){ /* empty */ };

var _iterStep = function(done, value){
  return {value: value, done: !!done};
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function(iterated, kind){
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return _iterStep(1);
  }
  if(kind == 'keys'  )return _iterStep(0, index);
  if(kind == 'values')return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

_addToUnscopables('keys');
_addToUnscopables('values');
_addToUnscopables('entries');

var TO_STRING_TAG = _wks('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = _global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])_hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

var ITERATOR$4  = _wks('iterator');
var core_isIterable = _core.isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR$4] !== undefined
    || '@@iterator' in O
    || _iterators.hasOwnProperty(_classof(O));
};

var isIterable$2 = core_isIterable;

var isIterable = createCommonjsModule(function (module) {
module.exports = { "default": isIterable$2, __esModule: true };
});

var core_getIterator = _core.getIterator = function(it){
  var iterFn = core_getIteratorMethod(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return _anObject(iterFn.call(it));
};

var getIterator$2 = core_getIterator;

var getIterator = createCommonjsModule(function (module) {
module.exports = { "default": getIterator$2, __esModule: true };
});

var slicedToArray = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _isIterable3 = _interopRequireDefault(isIterable);



var _getIterator3 = _interopRequireDefault(getIterator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
});

var _slicedToArray = unwrapExports(slicedToArray);

function callbacker$1(events, mainArgs) {
  var callbacks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  events.forEach(function (event) {
    if (_.isString(event)) {
      if (!_.isEmpty(eventRegistry[event])) {
        var eventRecord = { handle: event, callbacks: eventRegistry[event] };

        if (mainArgs) {
          _.extend(eventRecord, { args: mainArgs });
        }

        callbacks.push(eventRecord);
      }
      return;
    }

    var handle = event.handle,
        full = event.full,
        args = event.args;


    if (full) {
      handle = handle.split(':');
      handle = _.range(1, handle.length + 1).map(function (end) {
        return handle.slice(0, end).join(':');
      });
    } else {
      handle = [handle];
    }

    handle.forEach(function (handle) {
      return callbacker$1([handle], args || mainArgs, callbacks);
    });
  });

  return callbacks;
}

var levels = function levels(record) {
  return record.handle.split(':').length;
};

var callbacker = (function (events, mainArgs) {
  if (_.isString(events)) {
    events = events.split(spaceSplitter);
  }

  if (!_.isArray(events)) {
    events = [events];
  }

  var callbacks = callbacker$1(events, mainArgs);
  callbacks = _.uniqWith(callbacks, _.isEqual);
  return callbacks.sort(function () {
    return levels(arguments.length <= 0 ? undefined : arguments[0]) - levels(arguments.length <= 1 ? undefined : arguments[1]);
  });
});

var off = (function (events, callback, context) {
  if (!events) {
    events = _.keys(eventRegistry);
    return events.forEach(function (event) {
      return delete eventRegistry[event];
    });
  }

  callbacker(events, [callback, context]).forEach(function (eventRecord) {
    var callbacks = eventRecord.callbacks,
        args = eventRecord.args;

    var _args = _slicedToArray(args, 2),
        callback = _args[0],
        context = _args[1];

    var query = {};

    if (callback) {
      _.extend(query, { callback: callback });
    }

    if (context) {
      _.extend(query, { context: context });
    }

    if (_.isEmpty(query)) {
      return callbacks.splice(0, callbacks.length);
    }

    _.filter(callbacks, query).forEach(function (callbackRecord) {
      var index = callbacks.indexOf(callbackRecord);
      callbacks.splice(index, 1);
    });
  });
});

var runtime = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = 'object' === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof commonjsGlobal === "object" ? commonjsGlobal :
  typeof window === "object" ? window :
  typeof self === "object" ? self : commonjsGlobal
);
});

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof commonjsGlobal === "object" ? commonjsGlobal :
  typeof window === "object" ? window :
  typeof self === "object" ? self : commonjsGlobal;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

var runtimeModule = runtime;

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

var index = runtimeModule;

var _anInstance = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

var _forOf = createCommonjsModule(function (module) {
var BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : core_getIteratorMethod(iterable)
    , f      = _ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(_isArrayIter(iterFn))for(length = _toLength(iterable.length); length > index; index++){
    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = _iterCall(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
});

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var SPECIES   = _wks('species');
var _speciesConstructor = function(O, D){
  var C = _anObject(O).constructor, S;
  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

var process$2            = _global.process;
var setTask            = _global.setImmediate;
var clearTask          = _global.clearImmediate;
var MessageChannel     = _global.MessageChannel;
var counter            = 0;
var queue$1              = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer;
var channel;
var port;
var run = function(){
  var id = +this;
  if(queue$1.hasOwnProperty(id)){
    var fn = queue$1[id];
    delete queue$1[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue$1[++counter] = function(){
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue$1[id];
  };
  // Node.js 0.8-
  if(_cof(process$2) == 'process'){
    defer = function(id){
      process$2.nextTick(_ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts){
    defer = function(id){
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in _domCreate('script')){
    defer = function(id){
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function(){
        _html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set:   setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer  = _global.MutationObserver || _global.WebKitMutationObserver;
var process$3   = _global.process;
var Promise$1   = _global.Promise;
var isNode$1    = _cof(process$3) == 'process';

var _microtask = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode$1 && (parent = process$3.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode$1){
    notify = function(){
      process$3.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise$1 && Promise$1.resolve){
    var promise = Promise$1.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};

var _redefineAll = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else _hide(target, key, src[key]);
  } return target;
};

var SPECIES$1     = _wks('species');

var _setSpecies = function(KEY){
  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
  if(_descriptors && C && !C[SPECIES$1])_objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function(){ return this; }
  });
};

var task               = _task.set;
var microtask          = _microtask();
var PROMISE            = 'Promise';
var TypeError$1          = _global.TypeError;
var process$1            = _global.process;
var $Promise           = _global[PROMISE];
var process$1            = _global.process;
var isNode             = _classof(process$1) == 'process';
var empty              = function(){ /* empty */ };
var Internal;
var GenericPromiseCapability;
var Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[_wks('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError$1('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject  = _aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError$1('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(_global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process$1.emit('unhandledRejection', value, promise);
        } else if(handler = _global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = _global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(_global, function(){
    var handler;
    if(isNode){
      process$1.emit('rejectionHandled', promise);
    } else if(handler = _global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError$1("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(_speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process$1.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject  = _ctx($reject, promise, 1);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, {Promise: $Promise});
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
_export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      _forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      _forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

var promise$2 = _core.Promise;

var promise = createCommonjsModule(function (module) {
module.exports = { "default": promise$2, __esModule: true };
});

var asyncToGenerator = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _promise2 = _interopRequireDefault(promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
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
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};
});

var _asyncToGenerator = unwrapExports(asyncToGenerator);

var error$1 = {
  message: function message(errorMessage, moduleName) {
    return 'aptivator: ' + (moduleName && moduleName + ': ' || '') + errorMessage;
  },
  throw: function _throw(error, moduleName) {
    throw new Error(this.message(error, moduleName));
  },
  warn: function warn(error, moduleName) {
    console.warn(this.message(error, moduleName));
  },


  errorer: function errorer(e) {
    return console.error(e);
  }
};

var _this = undefined;

var trigger = (function () {
  var _ref = _asyncToGenerator(index.mark(function _callee(events) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var promises, results;
    return index.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            promises = [];
            results = {};


            callbacker(events, args).forEach(function (eventRecord) {
              var args = eventRecord.args,
                  handle = eventRecord.handle,
                  callbacks = eventRecord.callbacks;

              var handlePath = handle.split(':').concat('v');
              var store = {};

              callbacks.forEach(function (callbackRecord) {
                var callback = callbackRecord.callback,
                    context = callbackRecord.context;
                var name = callback.name;

                var result = callback.apply(context, args);

                result = Promise.resolve(result);
                result = result.then(function (result) {
                  if (name && name !== '_ignore') {
                    if (!_.has(results, handlePath)) {
                      _.set(results, handlePath, store);
                    }

                    if (_.has(store, name)) {
                      error$1.throw('function [' + name + '] was already called for [' + handle + '] event', 'event triggerer');
                    }

                    _.set(store, name, result);
                  }
                });

                promises.push(result);
              });
            });

            return _context.abrupt('return', Promise.all(promises).then(function () {
              return results;
            }));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

_.extend(aptivator, { on: on, once: once, off: off, trigger: trigger });

var storageActionGenerator = (function (storage, setter) {
  return setter ? function (key, val) {
    return storage.setItem(key, JSON.stringify(val));
  } : function (key, val) {
    return val = storage.getItem(key), val ? JSON.parse(val) : val;
  };
});

aptivator.m = new Map();

_.each({ l: localStorage, s: sessionStorage }, function (store, storeAbbr) {
  aptivator[storeAbbr] = {
    get: storageActionGenerator(store),
    set: storageActionGenerator(store, true)
  };
});

var addresser = {
  isStateAddress: function isStateAddress(address) {
    if (!address.includes('@')) {
      return true;
    }

    var stateName = this.stateName(address);
    return registry[stateName].uniqueAddress === address;
  },
  uniqueAddress: function uniqueAddress(stateName) {
    return _.uniqueId('aptivator-id-') + '@' + stateName;
  },


  parts: function parts(address) {
    return address.split('@');
  },

  region: function region(address) {
    return this.parts(address)[0];
  },
  stateName: function stateName(address) {
    return address.includes('@') ? this.parts(address)[1] : address;
  },
  record: function record(address) {
    var stateName = this.stateName(address);
    var views = registry[stateName].views;

    return _.filter(views, { uniqueAddress: address })[0].record;
  }
};

var relations = {
  isRoot: function isRoot(stateName) {
    return stateName === rootStateName;
  },

  parts: function parts(stateName) {
    return stateName.split('.');
  },
  family: function family(entityName) {
    if (!entityName) {
      return [];
    }

    var stateName = addresser.stateName(entityName);

    var family = this.parts(stateName);

    family = _.range(1, family.length + 1).map(function (end) {
      return family.slice(0, end).join('.');
    });

    if (!this.isRoot(stateName)) {
      family.unshift(rootStateName);
    }

    if (entityName.includes('@')) {
      family.push(entityName);
    }

    return family;
  },
  parent: function parent(stateName) {
    return this.family(stateName).slice(-2, -1)[0];
  },
  hierarchySorter: function hierarchySorter(desc) {
    var _this = this;

    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _args$map = args.map(function (stateName) {
        if (_.isObject(stateName)) {
          var _stateName = stateName;
          stateName = _stateName.stateName;
        }
        return _this.parts(stateName).length;
      }),
          _args$map2 = _slicedToArray(_args$map, 2),
          length1 = _args$map2[0],
          length2 = _args$map2[1];

      if (desc) {
        var _ref = [length1, length2];
        length2 = _ref[0];
        length1 = _ref[1];
      }

      return length1 - length2;
    };
  }
};

var approximator = {
  fromHash: function fromHash(hash) {
    if (!hash) {
      return;
    }

    for (var stateName in registry) {
      var stateConfigs = registry[stateName];
      var route = stateConfigs.route;


      if (!route) {
        continue;
      }

      if (route.rx.test(hash)) {
        return stateName;
      }
    }

    return this.fromHash(hash.split('/').slice(0, -1).join('/'));
  },
  fromStateName: function fromStateName(stateType, searchStateName) {
    var otherRegistry = stateType === 'error' ? errorRegistry : transientRegistry;

    if (!searchStateName) {
      return otherRegistry.root;
    }

    var searchStateNameParts = relations.parts(searchStateName);
    var max = 0;

    otherRegistry.forEach(function (stateName) {
      var stateNameParts = relations.parts(stateName);

      if (stateNameParts.length > searchStateNameParts.length) {
        return;
      }

      for (var i = 0, l = stateNameParts.length; i < l; i++) {
        if (stateNameParts[i] !== searchStateNameParts[i]) {
          break;
        }
      }

      if (i > max) {
        searchStateName = stateName;
        max = i;
      }
    });

    return max ? searchStateName : this.fromStateName(stateType);
  }
};

var fragment = {
  get: function get() {
    return Backbone.history.getFragment();
  },

  set: function set(route) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return router.navigate(route, options);
  },

  toState: function toState() {
    var fragment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.get();

    return _.filter(registry, function (stateConfigs, stateName) {
      var abstract = stateConfigs.abstract,
          routeRx = stateConfigs.routeRx;

      return !abstract && routeRx && routeRx.test(fragment);
    })[0];
  }
};

var errorStater = (function () {
  var hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : fragment.get();

  if (!hash) {
    return;
  }

  var stateName = approximator.fromHash(hash);

  if (stateName) {
    stateName += '.noop';
  }

  stateName = approximator.fromStateName('error', stateName);

  if (!stateName) {
    return alert('Provided route [' + hash + '] is invalid');
  }

  aptivator.activate({ stateName: stateName, route: { fragment: hash } }).catch(_.noop);
});

var invalidRouteRegistrar = (function () {
  return router.route('*error', errorStater);
});

aptivator.config = function (settings) {
  if (!settings.templateVars) {
    settings.templateVars = {};
  }

  _.extend(configs, settings);
  invalidRouteRegistrar();
};

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export(_export.S + _export.F * !_descriptors, 'Object', {defineProperty: _objectDp.f});

var $Object = _core.Object;
var defineProperty$3 = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

var defineProperty$1 = createCommonjsModule(function (module) {
module.exports = { "default": defineProperty$3, __esModule: true };
});

var defineProperty = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};
});

var _defineProperty = unwrapExports(defineProperty);

var otherStateRegistrar = (function (stateName, registeredStateNames) {
  var parentStateName = relations.parent(stateName);

  if (relations.isRoot(relations.parent(stateName))) {
    return registeredStateNames.root = stateName;
  }

  registeredStateNames.forEach(function (registeredStateName) {
    if (relations.parent(registeredStateName) === parentStateName) {
      error$1.throw('already registered [' + registeredStateName + '] under [' + parentStateName + ']', 'state declaration');
    }
  });

  registeredStateNames.push(stateName);
});

var parallelStatesNormalizer = (function (states, stateName) {
  var ancestorIndices = [];

  _.each(states, function (stateConfigs, index) {
    if (_.isString(stateConfigs)) {
      stateConfigs = {
        name: stateConfigs,
        route: true,
        direct: true
      };
    }

    if (stateName.startsWith(stateConfigs.name)) {
      return ancestorIndices.push(index);
    }

    if (!stateConfigs.flags) {
      stateConfigs.flags = {};
    }

    _.extend(stateConfigs.flags, { parallel: true });

    states.splice(index, 1, stateConfigs);
  });

  ancestorIndices.sort().reverse();

  _.each(ancestorIndices, function (index) {
    states.splice(index, 1);
  });
});

var rootStateConfigurator = (function (stateConfigs) {
  var view = stateConfigs.view,
      stateName = stateConfigs.stateName,
      resolveConfigs = stateConfigs.resolveConfigs,
      detachHidden = stateConfigs.detachHidden;

  var uniqueAddress = addresser.uniqueAddress(stateName);

  if (!view) {
    error$1.throw('root state should have a designated view', 'state setter');
  }

  if (!resolveConfigs) {
    resolveConfigs = {
      duration: 0,
      store: true
    };
  }

  if (_.isUndefined(detachHidden)) {
    detachHidden = false;
  }

  var instance = new view();
  var record = { instance: instance };
  var configs = { root: true, uniqueAddress: uniqueAddress, detachHidden: detachHidden, resolveConfigs: resolveConfigs, record: record };

  _.extend(stateConfigs, configs);
  instance.render();

  stateConfigs.views = [_.omit(stateConfigs, 'animate')];
});

var routeAsserter = (function (values, asserters) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = values.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          index = _step$value[0],
          value = _step$value[1];

      var asserter = asserters[index];

      if (!asserter) {
        continue;
      }

      if (_.isRegExp(asserter)) {
        if (!asserter.test(value)) {
          return;
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return true;
});

var moduleName = 'route assembler';

var routeAssembler = (function (stateName, routeValues, activating) {
  var stateConfigs = registry[stateName];

  if (!stateConfigs) {
    error$1.throw('state [' + stateName + '] does not exist', moduleName);
  }

  var _stateConfigs$route = stateConfigs.route,
      route = _stateConfigs$route === undefined ? {} : _stateConfigs$route;


  if (_.isEmpty(route)) {
    error$1.throw('state [' + stateName + '] does not have a route', moduleName);
  }

  var _route$values = route.values,
      values = _route$values === undefined ? [] : _route$values,
      parts = route.parts,
      asserters = route.asserters;

  var fragments = [];
  var index = -1;
  var routeObj = { params: {} };

  if (_.isEmpty(routeValues)) {
    routeValues = values;
  }

  if (asserters.length) {
    if (!routeAsserter(routeValues, asserters)) {
      if (activating) {
        errorStater();
      }

      error$1.throw('a route value did not pass validation', moduleName);
    }
  }

  _.each(parts, function (part) {
    var required = part.required,
        name = part.name,
        prefix = part.prefix,
        splat = part.splat;


    if (_.isUndefined(required)) {
      return fragments.push(name);
    }

    if (!routeValues[++index]) {
      if (required) {
        console.log(part, routeValues);
        error$1.throw('expecting a value for [' + name + '] parameter', moduleName);
      }

      if (splat) {
        routeValues[index] = '/';
      }
    }

    if (routeValues[index]) {
      routeObj.params[name] = routeValues[index];
      fragments.push(prefix + routeValues[index]);
    }
  });

  var fragment = fragments.join('/').replace(/(\/+)/g, '/');
  return _.extend(routeObj, { fragment: fragment, stateName: stateName });
});

var routePartCleanRx = /[\(\/\:\)\*]/g;

var routeParser = (function (route, parentRoute) {
  var path = route.path,
      standalone = route.standalone;

  var parts = path.match(/\/?[^\/]+/g);
  var hasSplat = parentRoute.hasSplat,
      hasOptional = parentRoute.hasOptional,
      _parentRoute$parts = parentRoute.parts,
      parentParts = _parentRoute$parts === undefined ? [] : _parentRoute$parts;

  var names = parentParts.reduce(function (names, part) {
    if (!_.isUndefined(part.required)) {
      names.push(part.name);
    }
    return names;
  }, []);

  parts = !parts ? [] : parts.map(function (part) {
    part = part.replace(/[\s\/]+/g, '');

    if (!part.match(/[\*\:]/g)) {
      if (hasSplat || hasOptional) {
        error$1.throw('cannot declare a regular route part after a splat or optional parameter', 'routing');
      }

      return { name: part.replace(routePartCleanRx, '') };
    }

    var paramParts = part.split(':');
    var isSplat = part.startsWith('*');
    var required = isSplat ? false : !part.includes(')');

    if (isSplat) {
      if (hasSplat) {
        error$1.throw('route can have only one splat', 'routing');
      }

      if (hasOptional) {
        error$1.throw('splat cannot be declared after an optional parameter', 'routing');
      }
    }

    if (required) {
      if (hasSplat || hasOptional) {
        error$1.throw('required parameter cannot be declared after a splat or optional parameter', 'routing');
      }
    }

    if (!required && hasSplat) {
      error$1.throw('optional parameter cannot be declared after a splat', 'routing');
    }

    if (!hasSplat && isSplat) {
      route.hasSplat = hasSplat = isSplat;
    }

    if (!hasOptional && !required) {
      route.hasOptional = hasOptional = !required;
    }

    var prefix = isSplat ? '' : paramParts[0];
    var name = isSplat ? part.slice(1) : paramParts[1].replace(routePartCleanRx, '');

    if (names.includes(name)) {
      error$1.throw('parameter [' + name + '] has already been declared', 'routing');
    }

    names.push(name);

    return { required: required, prefix: prefix, name: name, splat: isSplat };
  });

  _.extend(route, { parts: (standalone ? [] : parentParts).concat(parts) });
});

var valuesAssertersAssembler = (function (route, parentRoute) {
  var _route$params = route.params,
      params = _route$params === undefined ? {} : _route$params,
      parts = route.parts,
      allValues = route.allValues,
      routeValues = route.values;
  var routeAsserters = route.asserters;
  var _parentRoute$values = parentRoute.values,
      parentValues = _parentRoute$values === undefined ? [] : _parentRoute$values,
      parentAllValues = parentRoute.allValues;
  var _parentRoute$asserter = parentRoute.asserters,
      parentAsserters = _parentRoute$asserter === undefined ? [] : _parentRoute$asserter;

  var index = -1;

  var _$reduce = _.reduce(parts, function (aggregator, part) {
    var name = part.name,
        required = part.required;

    var param = params[name] || {};
    var values = aggregator.values,
        asserters = aggregator.asserters;


    if (!_.isUndefined(required)) {
      values.push(routeValues ? routeValues[++index] : param.value);
      asserters.push(routeAsserters ? routeAsserters[index] : param.asserter);
    }

    return aggregator;
  }, { asserters: [], values: [] }),
      values = _$reduce.values,
      asserters = _$reduce.asserters;

  if (_.isEmpty(parentRoute)) {
    parentAllValues = true;
  }

  values = _.compact(values);

  if (values.length && !parentAllValues) {
    error$1.throw('to assemble child values provide all parent values', 'routing');
  }

  if (!_.compact(asserters).length) {
    asserters = [];
  }

  if (values.length === _.keys(params).length) {
    allValues = true;
  }

  _.extend(route, {
    allValues: allValues,
    values: parentValues.concat(values),
    asserters: parentAsserters.concat(asserters)
  });
});

var routeConfigurator = (function (stateConfigs, parentConfigs) {
  var abstract = stateConfigs.abstract,
      stateName = stateConfigs.stateName,
      route = stateConfigs.route;
  var _parentConfigs$route = parentConfigs.route,
      parentRoute = _parentConfigs$route === undefined ? {} : _parentConfigs$route;


  if (_.isString(route)) {
    route = { path: route };
    _.extend(stateConfigs, { route: route });
  }

  var _route = route,
      _route$path = _route.path,
      path = _route$path === undefined ? '' : _route$path,
      _route$standalone = _route.standalone,
      standalone = _route$standalone === undefined ? false : _route$standalone;
  var _parentRoute$path = parentRoute.path,
      parentPath = _parentRoute$path === undefined ? '' : _parentRoute$path;


  if (path.startsWith('^')) {
    path = path.slice(1);
    standalone = true;
    _.extend(route, { path: path, standalone: standalone });
  }

  if (standalone) {
    parentPath = '';
  }

  path = (parentPath && parentPath + '/') + path;

  if (path) {
    var rx = Backbone.Router.prototype._routeToRegExp(path);
  }

  routeParser(route, parentRoute);
  valuesAssertersAssembler(route, standalone ? {} : parentRoute);
  _.extend(route, { path: path, rx: rx });

  if (!abstract) {
    router.route(rx, stateName, function () {
      for (var _len = arguments.length, routeValues = Array(_len), _key = 0; _key < _len; _key++) {
        routeValues[_key] = arguments[_key];
      }

      try {
        var _route2 = routeAssembler(stateName, _.compact(routeValues), true);
        aptivator.activate({ stateName: stateName, route: _route2 }).catch(_.noop);
      } catch (e) {
        console.error(e);
      }
    });
  }
});

aptivator.state = function (stateName, stateConfigs) {
  return !_asyncToGenerator(index.mark(function _callee() {
    var transient, error, on, once, parallelStates, substates, route, root, parentStateName, parentConfigs, eventMethods, template, view, views;
    return index.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (registry[stateName]) {
              error$1.throw('state [' + stateName + '] has already been declared', 'state declaration');
            }

            _.extend(stateConfigs, { stateName: stateName });

            if (relations.isRoot(stateName)) {
              rootStateConfigurator(stateConfigs);
            }

            transient = stateConfigs.transient, error = stateConfigs.error, on = stateConfigs.on, once = stateConfigs.once, parallelStates = stateConfigs.states, substates = stateConfigs.substates, route = stateConfigs.route, root = stateConfigs.root;
            parentStateName = root || relations.parent(stateName);
            parentConfigs = root ? {} : registry[parentStateName];
            eventMethods = {};

            if (parentConfigs) {
              _context.next = 9;
              break;
            }

            return _context.abrupt('return', queue.push([stateName, stateConfigs]));

          case 9:
            template = stateConfigs.template, view = stateConfigs.view, views = stateConfigs.views;


            if (!(template || view || views)) {
              stateConfigs.abstract = true;
            }

            if (transient || error) {
              otherStateRegistrar(stateName, transient ? transientRegistry : errorRegistry);
              delete stateConfigs.route;
            }

            if (on) {
              _.extend(eventMethods, { on: on });
            }

            if (once) {
              _.extend(eventMethods, { once: once });
            }

            _.each(eventMethods, function (eventsConfigs, eventMethod) {
              aptivator[eventMethod](_.mapValues(eventsConfigs, function (eventConfigs) {
                return _defineProperty({}, stateName, eventConfigs);
              }));
            });

            if (parallelStates) {
              parallelStatesNormalizer(parallelStates, stateName);
            }

            if (route) {
              routeConfigurator(stateConfigs, parentConfigs);
            }

            registry[stateName] = stateConfigs;

            _.each(substates, function (stateConfigs, subStateName) {
              aptivator.state(stateName + '.' + subStateName, stateConfigs);
            });

            if (queue.length) {
              aptivator.state.apply(aptivator, _toConsumableArray(queue.pop()));
            }

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }))().catch(error$1.errorer);
};

var missingParentsAssembler = (function (queue) {
  var parentNames = [];
  var stateNames = queue.map(function (stateDefinition) {
    return stateDefinition[0];
  });

  stateNames.sort(relations.hierarchySorter(true));

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = stateNames.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          i = _step$value[0],
          stateName = _step$value[1];

      var parentName = relations.parent(stateName);

      if (parentNames.includes(parentName)) {
        continue;
      }

      if (!stateNames.includes(parentName, i + 1)) {
        parentNames.push(parentName);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return parentNames.reverse().join(', ');
});

aptivator.start = function () {
  return !_asyncToGenerator(index.mark(function _callee() {
    var defaultState, missingParents;
    return index.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            defaultState = configs.defaultState;


            if (queue.length) {
              missingParents = missingParentsAssembler(queue);

              error$1.throw('undeclared parent states: [' + missingParents + ']', 'starter');
            }

            Backbone.history.start();

            /*
              aptivator.activate({name: 'app-1'});
              aptivator.activate({name: 'app-2.form', flags: {parallel: true}});
              aptivator.activate({name: 'app-2.info', flags: {parallel: true}});
            
              setTimeout(() => {
                aptivator.deactivate({name: 'app-2.form'});
                aptivator.deactivate({name: 'app-2.info'});
              }, 5000);
            */

            if (!fragment.get() && defaultState) {
              aptivator.activate({ stateName: defaultState, direct: { running: true } }).catch(_.noop);
            }

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }))().catch(error$1.errorer);
};

var canceler = (function (stateParams) {
  var stateName = stateParams.stateName;
  var _stateParams$flags = stateParams.flags,
      duplicateSerial = _stateParams$flags.duplicateSerial,
      canceled = _stateParams$flags.canceled;


  if (duplicateSerial) {
    throw {
      type: 'duplicate',
      message: 'state [' + stateName + '] is serial and cannot be activated with another serial state',
      stateParams: stateParams
    };
  }

  if (canceled) {
    throw {
      type: 'canceled',
      message: 'state [' + stateName + '] was canceled',
      stateParams: stateParams
    };
  }
});

var hookResulter = (function (hookName, stateParams, results) {
  _.extend(stateParams.flags, _defineProperty({}, hookName, true));

  if (_.isEmpty(results)) {
    return;
  }

  var hooks = stateParams.hooks;


  if (!hooks) {
    _.set(stateParams, 'hooks', hooks = {});
  }

  _.extend(hooks, results);
});

var syncHookNames = ['start', 'loading'];

var eventer = (function (hookName) {
  return function (stateParams) {
    return new Promise(function (resolve, reject) {
      var stateName = stateParams.stateName;

      var handle = hookName + ':' + stateName;
      var sync = syncHookNames.includes(hookName);

      if (!sync) {
        resolve(stateParams);
      }

      aptivator.trigger({ handle: handle, full: true }, stateParams).then(function (results) {
        hookResulter(hookName, stateParams, results);

        if (sync) {
          return resolve(stateParams);
        }
      }, function (e) {
        return reject({ type: e, stateParams: stateParams });
      });
    });
  };
});

function canceler$1(stateParams) {
  var promises = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var stateNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (!stateParams) {
    return promises;
  }

  var stateName = stateParams.stateName;


  if (stateNames.includes(stateName)) {
    return promises;
  }

  stateNames.push(stateName);

  var flags = stateParams.flags,
      transientStateParams = stateParams.transientStateParams,
      parallels = stateParams.parallels;

  var _ref = transientStateParams || {},
      owners = _ref.owners;

  if (owners) {
    owners.delete(stateParams);
  }

  _.extend(flags, { canceled: true });

  if (flags.rendered) {
    _.extend(flags, { active: true });
    var promise = aptivator.deactivate({ name: stateName }).catch(_.noop);
    promises.push(promise);
  }

  if (owners && !owners.size) {
    canceler$1(transientStateParams, promises, stateNames);
  }

  _.each(parallels, function (stateParams) {
    return canceler$1(stateParams, promises, stateNames);
  });

  return promises;
}

var _this$2 = undefined;

var duplicatesRemover = (function () {
  var _ref = _asyncToGenerator(index.mark(function _callee(startedStates) {
    var serialStates, serialStatesDuplicates, query, pendingSerialState, promises;
    return index.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            serialStates = _.filter(startedStates, { flags: { parallel: false } });
            serialStatesDuplicates = serialStates.reverse().slice(1);


            serialStates = _.difference(serialStates, serialStatesDuplicates);

            serialStatesDuplicates.forEach(function (stateParams) {
              _.extend(stateParams.flags, { active: false, canceled: true, pending: false, duplicateSerial: true });
            });

            startedStates = _.difference(startedStates, serialStatesDuplicates);

            if (serialStates.length) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', startedStates);

          case 7:
            query = { flags: { parallel: false, pending: true, canceled: false, transient: false, preprocessed: true } };
            pendingSerialState = aptivator.history.findOne(query);
            promises = canceler$1(pendingSerialState);
            _context.next = 12;
            return Promise.all(promises);

          case 12:
            return _context.abrupt('return', startedStates);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this$2);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

var transientInitializer = (function (stateName, immediate) {
  var stateParams = stateName;

  if (!_.isObject(stateParams)) {
    var transient = registry[stateName].transient;

    transient = _.isPlainObject(transient) ? transient : {};
    var _transient = transient,
        delay = _transient.delay,
        _transient$parallel = _transient.parallel,
        parallel = _transient$parallel === undefined ? false : _transient$parallel,
        _transient$noResolves = _transient.noResolves,
        noResolves = _transient$noResolves === undefined ? false : _transient$noResolves,
        _transient$spliced = _transient.spliced,
        spliced = _transient$spliced === undefined ? false : _transient$spliced;

    stateParams = { stateName: stateName, flags: { parallel: parallel, transient: true, noResolves: noResolves, spliced: spliced } };
  }

  _.extend(stateParams, { owners: new Set() });

  var transientConfigs = stateParams.transientConfigs = {};

  if (immediate) {
    delay = 0;
  } else if (!_.isNumber(delay)) {
    var transientDelay_ = configs.transientDelay;

    delay = _.isNumber(transientDelay_) ? transientDelay_ : transientDelay;
  }

  transientConfigs.timeout = setTimeout(function () {
    var promise = aptivator.activate(stateParams);
    promise = promise.then(_.noop, function (e) {
      return Promise.reject(e);
    });
    _.extend(transientConfigs, { promise: promise });
    promise.catch(_.noop);
  }, delay);

  return stateParams;
});

var _this$1 = undefined;

var eventHandles = _.mapValues({ transient: '', regular: '' }, function (value, key) {
  return 'aptivator-goto-preprocessor-' + key;
});

var initializer = (function (stateParams) {
  return new Promise(function () {
    var _ref = _asyncToGenerator(index.mark(function _callee(resolve) {
      var transient, _eventHandle, _query, startingTransients, eventHandle, startingStates, query, startedStates, transientStates;

      return index.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              transient = stateParams.flags.transient;


              _.extend(stateParams.flags, { initialized: true });

              if (!transient) {
                _context.next = 10;
                break;
              }

              _eventHandle = eventHandles.transient;


              aptivator.once(_eventHandle, function () {
                return resolve(stateParams);
              });

              _query = { flags: { transient: true, initialized: false } };
              startingTransients = aptivator.history.find(_query);

              if (!startingTransients.length) {
                _context.next = 9;
                break;
              }

              return _context.abrupt('return');

            case 9:
              return _context.abrupt('return', aptivator.trigger(_eventHandle));

            case 10:
              eventHandle = eventHandles.regular;


              aptivator.once(eventHandle, function () {
                return resolve(stateParams);
              });

              startingStates = aptivator.history.find({ flags: { initialized: false, transient: false } });

              if (!startingStates.length) {
                _context.next = 15;
                break;
              }

              return _context.abrupt('return');

            case 15:
              query = { flags: { pending: true, initialized: true, preprocessed: false, canceled: false } };
              startedStates = aptivator.history.find(query);
              _context.next = 19;
              return duplicatesRemover(startedStates);

            case 19:
              startedStates = _context.sent;
              transientStates = aptivator.history.find(function (stateParams) {
                var _stateParams$flags = stateParams.flags,
                    active = _stateParams$flags.active,
                    pending = _stateParams$flags.pending,
                    canceled = _stateParams$flags.canceled,
                    transient = _stateParams$flags.transient;

                return transient && (active || pending) && !canceled;
              });


              transientStates = transientStates.reduce(function (o, stateParams) {
                o[stateParams.stateName] = stateParams;
                return o;
              }, {});

              _.each(startedStates, function (stateParams) {
                var transientStateName = approximator.fromStateName('transient', stateParams.stateName);

                if (transientStateName) {
                  var transientStateParams = transientStates[transientStateName];
                  if (!transientStateParams) {
                    transientStateParams = transientInitializer(transientStateName);
                    transientStates[transientStateName] = transientStateParams;
                  }

                  if (!transientStateParams.owners) {
                    transientStateParams.owners = new Set();
                  }

                  transientStateParams.owners.add(stateParams);
                  _.extend(stateParams, { transientStateParams: transientStateParams });
                }
              });

              if (configs.showRuntime) {
                stateParams.time = _.now();
              }

              _.remove(activatingRegulars, function () {
                return true;
              });
              _.remove(activatingTransients, function () {
                return true;
              });
              aptivator.trigger(eventHandle);

            case 27:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this$1);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
});

var fullAddressMaker = (function (viewAddress, containerStateName) {
  var _addresser$parts = addresser.parts(viewAddress),
      _addresser$parts2 = _slicedToArray(_addresser$parts, 2),
      selector = _addresser$parts2[0],
      stateName = _addresser$parts2[1];

  if (stateName === '') {
    stateName = rootStateName;
  } else if (!stateName) {
    stateName = relations.parent(containerStateName);
  } else if (stateName === 'self') {
    stateName = containerStateName;
  }

  return selector + '@' + stateName;
});

var durationFlag = 1;
var storeFlag = 2;
var bothFlags = 1 | 2;


var resolvesNormalizer = (function (configs$$1, entityName) {
  var resolves = configs$$1.resolves;

  var hasAt = entityName.includes('@');
  var stateName = hasAt ? addresser.stateName(entityName) : entityName;
  var family = relations.family(stateName).reverse();

  _.each(resolves, function (resolveConfigs, resolveName) {
    var status;

    if (_.isFunction(resolveConfigs)) {
      resolveConfigs = { resolver: resolveConfigs };
    }

    if (!_.isUndefined(resolveConfigs.duration)) {
      status |= durationFlag;
    }

    if (!_.isUndefined(resolveConfigs.store)) {
      status |= storeFlag;
    }

    !function normalizeResolves() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var viewConfigs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : hasAt && configs$$1;

      if (index >= family.length || status === bothFlags) {
        return;
      }

      var stateConfigs = viewConfigs;

      if (!stateConfigs) {
        stateConfigs = registry[family[index++]];
      }

      if (stateConfigs.resolveConfigs) {
        if (!(status & durationFlag) && !_.isUndefined(stateConfigs.resolveConfigs.duration)) {
          resolveConfigs.duration = stateConfigs.resolveConfigs.duration;
          status |= durationFlag;
        }

        if (!(status & storeFlag) && !_.isUndefined(stateConfigs.resolveConfigs.store)) {
          resolveConfigs.store = stateConfigs.resolveConfigs.store;
          status |= storeFlag;
        }
      }

      normalizeResolves(index, null);
    }();

    resolves[resolveName] = resolveConfigs;
  });

  return resolves;
});

var viewNormalizer = (function (viewConfigs) {
  if (!_.isUndefined(viewConfigs.detachHidden)) {
    return;
  }

  var family = relations.family(viewConfigs.stateName).reverse();

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = family[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var relation = _step.value;

      var stateConfigs = registry[relation];
      if (!_.isUndefined(stateConfigs.detachHidden)) {
        viewConfigs.detachHidden = stateConfigs.detachHidden;
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
});

var reservedHashes = ['base', 'elements'];

var preprocessor = (function (stateParams) {
  var startingStateName = stateParams.stateName;

  var processed = [];
  stateParams.flags.preprocessed = true;

  !function preprocess(stateName) {
    var stateConfigs = registry[stateName];

    if (stateConfigs.resolveAddresses) {
      return;
    }

    var data = stateConfigs.data,
        resolves = stateConfigs.resolves,
        view = stateConfigs.view,
        views = stateConfigs.views,
        template = stateConfigs.template;

    var resolveAddresses = stateConfigs.resolveAddresses = [];
    var viewsArray = [];

    if (data) {
      dataParams[stateName] = data;
    }

    if (resolves) {
      resolveDefinitions[stateName] = resolvesNormalizer(stateConfigs, stateName);
      resolveAddresses.push(stateName);
    }

    if (relations.isRoot(stateName)) {
      return;
    }

    if ((view || template) && !views) {
      var _stateConfigs$parentS = stateConfigs.parentSelector,
          parentSelector = _stateConfigs$parentS === undefined ? '' : _stateConfigs$parentS,
          parentState = stateConfigs.parentState;

      var viewHash = parentSelector;

      if (parentState) {
        viewHash += '@' + parentState;
      }

      views = _defineProperty({}, viewHash, _.pick(stateConfigs, ['view', 'template', 'cache']));
    }

    var parentStateName = relations.parent(stateName);
    var viewCount = _.keys(views).length;
    var mainCount = 0;

    _.each(views, function (viewConfigs, viewHash) {
      var _viewConfigs$address = viewConfigs.address,
          address = _viewConfigs$address === undefined ? viewHash : _viewConfigs$address,
          main = viewConfigs.main,
          resolves = viewConfigs.resolves,
          data = viewConfigs.data,
          view = viewConfigs.view,
          template = viewConfigs.template,
          deps = viewConfigs.deps;

      var fullAddress = fullAddressMaker(address, stateName);

      var _addresser$parts = addresser.parts(fullAddress),
          _addresser$parts2 = _slicedToArray(_addresser$parts, 2),
          addressSelector = _addresser$parts2[0],
          addressStateName = _addresser$parts2[1];

      var uniqueAddress = addresser.uniqueAddress(stateName);

      if (reservedHashes.includes(viewHash)) {
        error$1.throw('view hashes - ' + reservedHashes.join(', ') + ' - are reserved', 'preprocessor');
      }

      if (deps) {
        var connectingViews = stateConfigs.connectingViews;


        if (!connectingViews) {
          connectingViews = stateConfigs.connectingViews = [];
        }

        connectingViews.push(viewConfigs);
      }

      if (template && !view) {
        view = Marionette.ItemView.extend({ template: template });
      }

      if (addressStateName !== parentStateName) {
        delete viewConfigs.main;
      }

      if (viewCount === 1) {
        main = true;
      }

      if (main) {
        if (++mainCount > 1) {
          error$1.throw('multiple main views for [' + stateName + ']', 'preprocessor');
        }

        _.extend(stateConfigs, { uniqueAddress: uniqueAddress });
      }

      if (resolves) {
        resolveDefinitions[uniqueAddress] = resolvesNormalizer(viewConfigs, uniqueAddress);
        resolveAddresses.push(uniqueAddress);
      }

      if (data) {
        dataParams[uniqueAddress] = data;
      }

      _.extend(viewConfigs, { address: address, main: main, view: view, uniqueAddress: uniqueAddress, fullAddress: fullAddress, stateName: stateName, viewHash: viewHash, addressSelector: addressSelector, addressStateName: addressStateName });

      viewNormalizer(viewConfigs);
      viewsArray.push(viewConfigs);
      preprocess(addressStateName);
    });

    if (!mainCount && viewCount) {
      error$1.throw('state [' + stateName + '] must have a designated main view', 'preprocessor');
    }

    if (viewCount) {
      viewsArray.sort(relations.hierarchySorter());
      _.extend(stateConfigs, { views: viewsArray });
    }

    processed.push(stateName);

    if (startingStateName === stateName) {
      var family = relations.family(startingStateName).slice(1);
      var remaining = _.difference(family, processed);
      _.each(remaining, function (stateName) {
        return preprocess(stateName);
      });
    }
  }(startingStateName);

  return stateParams;
});

var historyAdder = (function (state) {
  history.push(state);
  history.splice(0, history.length - configs.historySize);
});

var defaultFlags = {
  active: false,
  pending: true,
  initialized: false,
  preprocessed: false,
  resolved: false,
  loading: false,
  prerendered: false,
  rendered: false,
  canceled: false,
  parallel: false,
  transient: false,
  displayed: false
};

var parallelStatesStarter = (function (stateParams) {
  var flags = stateParams.flags,
      route = stateParams.route,
      direct = stateParams.direct,
      stateName = stateParams.stateName,
      parallels = stateParams.parallels;

  var family = relations.family(stateName);
  var transient = flags.transient,
      noResolves = flags.noResolves,
      spliced = flags.spliced;


  _.each(family, function (relation) {
    var stateConfigs = registry[relation];
    _.each(stateConfigs.states, function (parallelStateParams) {
      parallelStateParams = _.cloneDeep(parallelStateParams);
      var _parallelStateParams = parallelStateParams,
          parallelDirect = _parallelStateParams.direct,
          parallelRoute = _parallelStateParams.route;


      if (direct && parallelDirect) {
        parallelStateParams.direct = direct;
      } else {
        delete parallelStateParams.direct;
      }

      if (route && parallelRoute) {
        parallelStateParams.route = route;
      } else {
        delete parallelStateParams.route;
      }

      if (!parallels) {
        parallels = stateParams.parallels = [];
      }

      _.extend(parallelStateParams.flags, { transient: transient, noResolves: noResolves, spliced: spliced });

      if (transient) {
        parallelStateParams = transientInitializer(parallelStateParams, true);
      } else {
        aptivator.activate(parallelStateParams).catch(_.noop);
      }

      parallels.push(parallelStateParams);
    });
  });
});

var _this$3 = undefined;

var starter = (function () {
  var _ref = _asyncToGenerator(index.mark(function _callee(stateParams) {
    var stateName, _stateParams$name, name, _stateParams$flags, flags, route, routeValues, _flags, silent, parallel, transient, stateConfigs, tracker, routeConfigs, values;

    return index.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            stateName = stateParams.stateName, _stateParams$name = stateParams.name, name = _stateParams$name === undefined ? stateName : _stateParams$name, _stateParams$flags = stateParams.flags, flags = _stateParams$flags === undefined ? {} : _stateParams$flags, route = stateParams.route, routeValues = stateParams.routeValues;
            _flags = flags, silent = _flags.silent, parallel = _flags.parallel, transient = _flags.transient;
            stateConfigs = registry[name];
            tracker = transient ? activatingTransients : activatingRegulars;

            if (stateConfigs) {
              _context.next = 6;
              break;
            }

            throw { type: 'undeclared', message: 'state [' + name + '] does not exist' };

          case 6:
            if (!((parallel || transient) && tracker.includes(name))) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return');

          case 8:

            tracker.push(name);

            if (_.isEmpty(flags)) {
              flags = stateParams.flags = {};
            }

            _.extend(stateParams.flags, defaultFlags, _.clone(flags));

            if (!stateName) {
              stateParams.stateName = name;
              delete stateParams.name;
            }

            routeConfigs = stateConfigs.route;


            if (!_.isEmpty(routeConfigs) && !route) {
              values = routeConfigs.values;


              if (!routeValues) {
                routeValues = values;
              }

              route = routeAssembler(name, routeValues);

              if (!(silent || parallel)) {
                fragment.set(route.fragment);
              }

              _.extend(stateParams, { route: route });
            }

            parallelStatesStarter(stateParams);

            historyAdder(stateParams);

            return _context.abrupt('return', stateParams);

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this$3);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

var paramsAssembler = (function (entityName, stateParams) {
  var direct = stateParams.direct,
      route = stateParams.route,
      stateName = stateParams.stateName,
      hooks = stateParams.hooks;

  var params = { data: {}, resolves: {}, route: {}, direct: {}, hooks: {} };
  var data = params.data,
      resolves = params.resolves;

  var family = relations.family(entityName);
  var targetEntityName = _.nth(family, -1);
  var targetStateName = addresser.stateName(targetEntityName);
  var targetStateConfigs = registry[targetStateName];
  var error = targetStateConfigs.error,
      routeConfigs = targetStateConfigs.route;


  if (route && !_.isEmpty(routeConfigs)) {
    var parts = routeConfigs.parts;

    var names = _.reduce(parts, function (names, part) {
      var name = part.name,
          required = part.required;


      if (!_.isUndefined(required)) {
        names.push(name);
      }
      return names;
    }, []);

    var values = _.values(_.pick(route.params, names));

    if (values.length) {
      _.extend(params, { route: routeAssembler(targetStateName, values) });
    }
  }

  if (error) {
    _.extend(params, { route: route });
  }

  family.forEach(function (relation) {
    _.extend(data, dataParams[relation]);
    _.extend(resolves, resolveParams[relation]);
  });

  _.each(hooks, function (hookValues, hookName) {
    var values = [['v'], [targetStateName, 'v']].reduce(function (values, path) {
      return _.extend(values, _.get(hookValues, path, {}));
    }, {});

    if (!_.isEmpty(values)) {
      params.hooks[hookName] = values;
    }
  });

  if (family.includes(stateName)) {
    if (direct) {
      _.extend(params, { direct: direct });
      _.extend(stateParams, { direct: direct });
    }

    _.extend(stateParams, { data: data, resolves: resolves });
  }

  return _.cloneDeep(params);
});

var entitiesTreeBuilder = (function (entityNames) {
  var tree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return entityNames.reduce(function (tree, entityName) {
    var stateName = addresser.stateName(entityName);
    var family = relations.family(stateName);
    var current = tree;

    family.reduce(function (tree, relation) {
      if (entityNames.includes(relation)) {
        current = current[relation] || (current[relation] = {});
      }
      return tree;
    }, tree);

    if (entityName.includes('@')) {
      current[entityName] = null;
    }

    return tree;
  }, tree);
});

var resolvesProcessor = (function (resolves, resolveParams, storeKey, resolverParams) {
  return new Promise(function (resolve, reject) {
    if (!resolves) {
      return resolve();
    }

    var deps = void 0;
    var processedResolves = [];
    var results = resolveParams[storeKey] || (resolveParams[storeKey] = {});

    var storeResult = function storeResult(resolve, resolveName, result) {
      resolve.timestamp = _.now();
      processedResolves.push(resolveName);
      if (resolve.store) {
        results[resolveName] = result;
      }
    };

    !function processResolves(resolves) {
      var promises = [];
      var promiseNames = [];
      var dependents = {};

      _.each(resolves, function (resolve, resolveName) {
        var duration = resolve.duration,
            timestamp = resolve.timestamp;


        if (timestamp && _.now() - timestamp < duration) {
          return processedResolves.push(resolveName);
        }

        if (resolve.deps) {
          if (_.difference(resolve.deps, processedResolves).length) {
            return dependents[resolveName] = resolve;
          }

          _.extend(resolverParams.resolves, _.pick(resolveParams[storeKey], resolve.deps));
        }

        var result = resolve.resolver(resolverParams);

        if (result instanceof Promise) {
          promiseNames.push(resolveName);
          return promises.push(result);
        }

        storeResult(resolve, resolveName, result);
      });

      Promise.all(promises).then(function (data) {
        data.forEach(function (result, index) {
          var resolveName = promiseNames[index];
          var resolve = resolves[resolveName];

          storeResult(resolve, resolveName, result);
        });

        if (!_.keys(dependents).length) {
          return resolve();
        }

        if (deps && _.isEqual(deps, dependents)) {
          dependents = _.keys(dependents).join(', ');
          error$1.throw('some dependencies specified for [' + dependents + '] resolve(s) are not found', 'resolver');
        }

        processResolves(deps = dependents);
      }).catch(reject);
    }(resolves);
  });
});

var resolver = (function (stateParams) {
  return new Promise(function (resolve, reject) {
    stateParams.flags.resolved = true;

    if (stateParams.flags.noResolves) {
      return resolve(stateParams);
    }

    var stateName = stateParams.stateName;

    var resolveAddresses = relations.family(stateName).reduce(function (resolveAddresses, relation) {
      return resolveAddresses.concat(registry[relation].resolveAddresses);
    }, []);
    var tree = entitiesTreeBuilder(resolveAddresses);

    !function process() {
      var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : tree;

      return new Promise(function (resolve, reject) {
        var promises = [];
        _.keys(node).forEach(function (entityName) {
          var params = paramsAssembler(entityName, stateParams);
          var promise = resolvesProcessor(resolveDefinitions[entityName], resolveParams, entityName, params);
          promises.push(promise.then(function () {
            return process(node[entityName]);
          }).catch(reject));
        });
        Promise.all(promises).then(resolve).catch(reject);
      });
    }().then(function () {
      return resolve(stateParams);
    }).catch(reject);
  });
});

var serialStateDeactivator = (function () {
  var query = { flags: { active: true, parallel: false, transient: false } };
  var activeSerial = aptivator.history.findOne(query);

  if (activeSerial) {
    return aptivator.deactivate({ name: activeSerial.stateName }).catch(_.noop);
  }

  return Promise.resolve();
});

var _this$4 = undefined;

var eventHandles$1 = _.mapValues({ transient: '', regular: '' }, function (value, key) {
  return 'aptivator-goto-render-' + key;
});

var deactivator = (function (stateParams) {
  return new Promise(function () {
    var _ref = _asyncToGenerator(index.mark(function _callee(resolve, reject) {
      var transient, _eventHandle, _query, loadingTransients, serialTransients, eventHandle, query, loadingRegulars, loadedRegulars, transientStates, transientPromises, deactivationPromises, serialRegular, promise;

      return index.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              stateParams.flags.prerendered = true;

              transient = stateParams.flags.transient;

              if (!transient) {
                _context.next = 15;
                break;
              }

              _eventHandle = eventHandles$1.transient;


              aptivator.once(_eventHandle, function () {
                return resolve(stateParams);
              });

              _query = { flags: { pending: true, transient: true, loading: false, canceled: false, prerendered: false } };
              loadingTransients = aptivator.history.find(_query);

              if (!loadingTransients.length) {
                _context.next = 9;
                break;
              }

              return _context.abrupt('return');

            case 9:

              _query = { flags: { transient: true, pending: true, loading: true, canceled: false, parallel: false } };
              serialTransients = aptivator.history.findOne(_query);

              if (!serialTransients) {
                _context.next = 14;
                break;
              }

              _context.next = 14;
              return serialStateDeactivator();

            case 14:
              return _context.abrupt('return', aptivator.trigger(_eventHandle));

            case 15:
              eventHandle = eventHandles$1.regular;


              aptivator.once(eventHandle, function () {
                return resolve(stateParams);
              });

              query = { flags: { pending: true, transient: false, prerendered: false, canceled: false } };
              loadingRegulars = aptivator.history.find(query);

              if (!loadingRegulars.length) {
                _context.next = 21;
                break;
              }

              return _context.abrupt('return');

            case 21:

              query = { flags: { pending: true, transient: false, canceled: false, loading: true } };
              loadedRegulars = aptivator.history.find(query);
              transientStates = loadedRegulars.reduce(function (transientStates, stateParams) {
                return transientStates.add(stateParams.transientStateParams);
              }, new Set());
              transientPromises = [].concat(_toConsumableArray(transientStates)).reduce(function (promises, stateParams) {
                var _ref2 = stateParams.transientConfigs || {},
                    promise = _ref2.promise,
                    timeout = _ref2.timeout;

                if (!stateParams.flags.parallel && promise) {
                  promises.hasSerial = true;
                }

                if (promise) {
                  promises.push(promise);
                } else {
                  transientStates.delete(stateParams);
                  clearTimeout(timeout);
                }

                return promises;
              }, []);
              _context.next = 27;
              return Promise.all(transientPromises);

            case 27:
              deactivationPromises = [];


              transientStates.forEach(function (stateParams) {
                var promise = aptivator.deactivate({ name: stateParams.stateName }).catch(_.noop);
                deactivationPromises.push(promise);
              });

              serialRegular = _.find(loadedRegulars, { flags: { parallel: false } });


              if (!transientPromises.hasSerial && serialRegular) {
                promise = serialStateDeactivator();

                deactivationPromises.push(promise);
              }

              _context.next = 33;
              return Promise.all(deactivationPromises);

            case 33:

              aptivator.trigger(eventHandle);

            case 34:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this$4);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
});

var cacheAssessor = {
  explicit: function explicit(viewConfigs) {
    var stateName = viewConfigs.stateName,
        record = viewConfigs.record,
        viewCacheFlag = viewConfigs.cache;
    var instance = record.instance;

    var stateConfigs = registry[stateName];
    var stateCacheFlag = stateConfigs.cache;

    var cache = void 0;

    if (instance) {
      if (!_.isUndefined(viewCacheFlag)) {
        cache = viewCacheFlag;
      } else if (!_.isUndefined(stateCacheFlag)) {
        cache = stateCacheFlag;
      }
    }

    return this.explicit.cache = cache;
  },
  implicit: function implicit(viewConfigs, stateParams) {
    var uniqueAddress = viewConfigs.uniqueAddress,
        record = viewConfigs.record;

    var params = paramsAssembler(uniqueAddress, stateParams);

    delete params.data;

    if (params.route) {
      delete params.route.fragment;
      delete params.route.stateName;
    }

    if (record.instance && _.isEqual(paramsMap[uniqueAddress], params)) {
      return this.implicit.cache = true;
    }

    paramsMap[uniqueAddress] = params;

    return this.implicit.cache = false;
  },
  total: function total(viewConfigs, stateParams) {
    this.implicit(viewConfigs, stateParams);

    if (!_.isUndefined(this.explicit(viewConfigs))) {
      return this.explicit.cache;
    }

    return this.implicit.cache;
  }
};

var hideClassName = (function () {
  var cssRules = '{display: none !important;}';
  var hideClassName = 'hidden-by-aptivator-' + (Math.random() + '').slice(2);
  var $style = $('<style/>').attr('type', 'text/css').html('.' + hideClassName + ' ' + cssRules);
  $('head').append($style);
  return hideClassName;
})();

var displayer$1 = (function (viewConfigs) {
  var record = viewConfigs.record,
      parentRecord = viewConfigs.parentRecord,
      addressSelector = viewConfigs.addressSelector;
  var detached = record.detached,
      _record$instance = record.instance,
      instance = _record$instance === undefined ? {} : _record$instance;
  var $el = instance.$el;


  if (!$el) {
    return;
  }

  record.active = true;

  $el.removeClass(hideClassName);

  if (!detached) {
    return;
  }

  var $parentEl = parentRecord.instance.$el;

  var $regionEl = !addressSelector ? $parentEl : $parentEl.find(addressSelector).eq(0);

  record.detached = false;
  $regionEl.append($el);
});

var rootViewRegistrar = (function (viewConfigs, stateParams) {
  var rootViews = _.get(stateParams, 'rootViews');
  if (!rootViews) {
    _.set(stateParams, 'rootViews', rootViews = []);
  }

  rootViews.push(viewConfigs);
});

var displayer = (function (viewConfigs, stateParams, cacheAssessor) {
  var addressStateName = viewConfigs.addressStateName,
      uniqueAddress = viewConfigs.uniqueAddress;


  if (!cacheAssessor.implicit.cache) {
    var cacheConfigs = cacheAssessor.explicit.cache;

    var _ref = cacheConfigs || {},
        receiver = _ref.receiver;

    if (receiver) {
      var instance = viewConfigs.record.instance;

      var params = paramsAssembler(uniqueAddress, stateParams);
      instance[receiver](params);
    }
  }

  if (relations.isRoot(addressStateName)) {
    return rootViewRegistrar(viewConfigs, stateParams);
  }

  displayer$1(viewConfigs);
});

var callbacker$2 = (function (callback, entityName, stateParams) {
  if (callback.length) {
    var params = paramsAssembler(entityName, stateParams);
  }

  return callback(params);
});

var elementAssembler = (function (params) {
  var selector = params.selector,
      selectorConfigs = params.selectorConfigs,
      stateName = params.stateName,
      uniqueAddress = params.uniqueAddress,
      stateParams = params.stateParams,
      $parentEl = params.$el,
      animations = params.animations;

  var entityName = stateName || uniqueAddress;
  var selectorAddress = selector + '@' + entityName + '@' + selector;
  var selectorSettingsPath = [entityName, selectorAddress];
  var selectorSettings = _.get(animations, selectorSettingsPath);

  if (!selectorSettings) {
    _.set(animations, selectorSettingsPath, selectorSettings = { $el: $parentEl.find(selector), classes: [] });
  }

  if (!_.isPlainObject(selectorConfigs)) {
    selectorConfigs = { classes: selectorConfigs };
  }

  var _selectorConfigs = selectorConfigs,
      selectorClasses = _selectorConfigs.classes,
      add = _selectorConfigs.add,
      remove = _selectorConfigs.remove;


  if (_.isFunction(selectorClasses)) {
    selectorClasses = callbacker$2(selectorClasses, entityName, stateParams);
  }

  if (_.isNull(selectorClasses)) {
    return delete animations[entityName][selectorAddress];
  }

  if (_.isString(selectorClasses)) {
    selectorClasses = selectorClasses.trim().split(spaceSplitter);
  }

  var _selectorSettings = selectorSettings,
      classes = _selectorSettings.classes;


  if (add) {
    classes.push.apply(classes, _toConsumableArray(selectorClasses));
  } else if (remove) {
    _.remove(classes, function (klass) {
      return selectorClasses.includes(klass);
    });
  } else {
    classes.splice.apply(classes, [0, classes.length].concat(_toConsumableArray(selectorClasses)));
  }
});

function animationsAssembler$1(entityName, stateParams, animationType, animations, fromStateName) {
  var hasAt = entityName.includes('@');
  var stateName = addresser.stateName(entityName);
  var _registry$stateName = registry[stateName],
      _registry$stateName$a = _registry$stateName.animate,
      animate = _registry$stateName$a === undefined ? {} : _registry$stateName$a,
      uniqueAddress = _registry$stateName.uniqueAddress;


  if (!uniqueAddress) {
    return;
  }

  var _animate$animationTyp = animate[animationType],
      animationSettings = _animate$animationTyp === undefined ? {} : _animate$animationTyp;

  var _addresser$record = addresser.record(uniqueAddress),
      active = _addresser$record.active,
      _addresser$record$ins = _addresser$record.instance,
      instance = _addresser$record$ins === undefined ? {} : _addresser$record$ins;

  var $el = instance.$el;

  var stateNameToUse = stateName;

  if (!_.isPlainObject(animationSettings)) {
    animationSettings = _defineProperty({}, stateNameToUse, animationSettings);
  }

  if (fromStateName) {
    var family = relations.family(fromStateName);
    if (!family.includes(stateName) && !active) {
      return error$1.warn('state [' + stateName + '] is not activated', 'animator');
    }

    var _ref = registry[fromStateName].animate || {};

    var _ref$animationType = _ref[animationType];
    animationSettings = _ref$animationType === undefined ? {} : _ref$animationType;
  } else {
    if (animationSettings.self) {
      delete animationSettings[stateName];
      stateNameToUse = 'self';
    }
  }

  var _animationSettings2 = animationSettings,
      self_ = _animationSettings2[stateNameToUse];


  if (!_.isPlainObject(self_)) {
    self_ = { base: self_ };
  }

  var _self_ = self_,
      base = _self_.base;


  if (!_.isPlainObject(base)) {
    base = { classes: base };
  }

  var _base = base,
      baseClasses = _base.classes,
      baseAdd = _base.add,
      baseRemove = _base.remove;


  if (_.isFunction(baseClasses)) {
    baseClasses = callbacker$2(baseClasses, stateName, stateParams);
  }

  if (_.isString(baseClasses)) {
    baseClasses = baseClasses.trim().split(spaceSplitter);
  }

  if ($el) {
    _.each(self_.elements, function (selectorConfigs, selector) {
      elementAssembler({ selector: selector, selectorConfigs: selectorConfigs, stateName: stateName, stateParams: stateParams, $el: $el, animations: animations });
    });
  }

  _.each(registry[stateName].views, function (viewConfigs) {
    var uniqueAddress = viewConfigs.uniqueAddress,
        viewHash = viewConfigs.viewHash,
        animate = viewConfigs.animate,
        addressStateName = viewConfigs.addressStateName;

    var _ref2 = addresser.record(uniqueAddress).instance || {},
        $el = _ref2.$el;

    if (hasAt && uniqueAddress !== entityName || !$el) {
      return;
    }

    var viewSettingsPath = [stateName, viewHash];
    var viewSettings = _.get(animations, viewSettingsPath);

    if (!viewSettings) {
      _.set(animations, viewSettingsPath, viewSettings = { $el: $el, classes: [] });
    }

    var _viewSettings = viewSettings,
        classes = _viewSettings.classes;


    if (addressStateName !== stateName) {
      if (_.isNull(baseClasses)) {
        _.remove(classes, function () {
          return true;
        });
      } else if (baseClasses) {
        if (baseAdd) {
          classes.push.apply(classes, _toConsumableArray(baseClasses));
        } else if (baseRemove) {
          _.remove(classes, function (klass) {
            return baseClasses.includes(klass);
          });
        } else {
          classes.splice.apply(classes, [0, classes.length].concat(_toConsumableArray(baseClasses)));
        }
      }
    }

    if (!_.isPlainObject(animate)) {
      animate = _defineProperty({}, animationType, animate);
    }

    var _ref3 = animate || {};

    animate = _ref3[animationType];


    if (fromStateName || _.isUndefined(animate)) {
      animate = self_[viewHash];
    }

    if (!_.isPlainObject(animate)) {
      animate = { classes: animate };
    }

    var _animate2 = animate,
        viewClasses = _animate2.classes,
        add = _animate2.add,
        remove = _animate2.remove,
        elements = _animate2.elements;


    if (_.isFunction(viewClasses)) {
      viewClasses = callbacker$2(viewClasses, uniqueAddress, stateParams);
    }

    _.each(elements, function (selectorConfigs, selector) {
      elementAssembler({ selector: selector, selectorConfigs: selectorConfigs, uniqueAddress: uniqueAddress, stateParams: stateParams, $el: $el, animations: animations });
    });

    if (_.isString(viewClasses)) {
      viewClasses = viewClasses.trim().split(spaceSplitter);
    }

    if (_.isUndefined(viewClasses) && _.isNull(baseClasses)) {
      viewClasses = null;
    }

    if (_.isNull(viewClasses)) {
      return delete animations[stateName][viewHash];
    }

    if (_.isUndefined(viewClasses)) {
      return;
    }

    if (add) {
      classes.push.apply(classes, _toConsumableArray(viewClasses));
    } else if (remove) {
      _.remove(classes, function (klass) {
        return viewClasses.includes(klass);
      });
    } else {
      classes.splice.apply(classes, [0, classes.length].concat(_toConsumableArray(viewClasses)));
    }
  });

  if (!fromStateName && !hasAt) {
    _.each(_.omit(animationSettings, 'self'), function (animationSettings, toStateName) {
      animationsAssembler$1(toStateName, stateParams, animationType, animations, stateName);
    });
  }
}

var stateNamesAggregator = (function (animationStates) {
  animationStates = _.reduce(animationStates, function (animationStates, animationState) {
    var stateParams = animationState.stateParams,
        stateName = animationState.stateName,
        beginningStateName = animationState.beginningStateName,
        primary = animationState.primary;

    var family = relations.family(stateName);
    var beginningIndex = family.indexOf(beginningStateName);
    family = family.slice(beginningIndex);

    _.each(family, function (stateName) {
      var existingIndex = _.findIndex(animationStates, { stateName: stateName });

      if (existingIndex > -1) {
        if (primary) {
          animationStates.splice(existingIndex, 1);
        } else {
          return;
        }
      }

      animationStates.push({ stateName: stateName, stateParams: stateParams });
    });

    return animationStates;
  }, []);

  animationStates.sort(relations.hierarchySorter());

  var rootIndex = _.findIndex(animationStates, { stateName: rootStateName });

  if (rootIndex > -1) {
    var rootState = animationStates.splice(rootIndex, 1)[0];
    animationStates.unshift(rootState);
  }

  return animationStates;
});

var animationsAssembler = (function (animationStates, animationType) {
  animationStates = stateNamesAggregator(animationStates);
  return _.reduce(animationStates, function (animations, animationState) {
    var stateName = animationState.stateName,
        stateParams = animationState.stateParams;

    animationsAssembler$1(stateName, stateParams, animationType, animations);
    return animations;
  }, {});
});

var stylesAggregator = (function (el, mainProperty) {
  var computedStyles = window.getComputedStyle(el, null);
  return _.reduce(computedStyles, function (aggregator, property) {
    if (property.startsWith(mainProperty)) {
      aggregator.push(computedStyles[property]);
    }
    return aggregator;
  }, []).join(' ');
});

var animationsExecutor = (function (animations) {
  var allPromises = [];
  var activatedClasses = [];

  _.each(animations, function (views) {
    _.each(views, function (animationConfigs, viewHash) {
      var $el = animationConfigs.$el,
          classes = animationConfigs.classes;

      var elementsPromises = [];
      classes = classes.join(' ');

      _.each($el, function (el) {
        var $el = $(el);
        var css = ['animation', 'transition'].reduce(function (css, property) {
          css[property] = stylesAggregator(el, property);
          return css;
        }, {});

        $el.addClass(classes);
        activatedClasses.push([$el, classes]);

        _.each(css, function (css, property) {
          if (css !== stylesAggregator(el, property)) {
            var promise = new Promise(function (resolve) {
              return $el.one(property + 'end', resolve);
            });
            elementsPromises.push(promise);
          }
        });
      });

      allPromises.push(Promise.all(elementsPromises));
    });
  });

  return Promise.all(allPromises).then(function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = activatedClasses[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2),
            $el = _step$value[0],
            classes = _step$value[1];

        $el.removeClass(classes);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
});

var animator = (function (animationStates, animationType) {
  if (_.isPlainObject(animationStates)) {
    animationStates = [animationStates];
  }

  var animations = animationsAssembler(animationStates, animationType);
  return animationsExecutor(animations);
});

var hider = (function (record, detach) {
  var active = record.active,
      _record$instance = record.instance,
      instance = _record$instance === undefined ? {} : _record$instance;
  var $el = instance.$el;


  if (!active && !detach || !$el) {
    return;
  }

  if (!detach) {
    detach = record.detach;
  }

  _.extend(record, { active: false, detached: detach });

  if (detach) {
    return $el.removeClass(hideClassName).detach();
  }

  $el.addClass(hideClassName);
});

var deactivator$1 = {
  full: function full(params) {
    var _this = this;

    var stateName = addresser.stateName(params.name);
    var family = relations.family(stateName).slice(1);
    _.each(family, function (stateName) {
      _this.partial({ name: stateName });
    });
  },
  partial: function partial(params) {
    var _this2 = this;

    var stateName = addresser.stateName(params.name);
    _.each(registry[stateName].views, function (viewConfigs) {
      _this2.focal({ name: viewConfigs.uniqueAddress });
    });
  },
  focal: function focal(params) {
    var _this3 = this;

    var name = params.name,
        _params$detach = params.detach,
        detach = _params$detach === undefined ? {} : _params$detach;

    var record = addresser.record(name);
    var _detach = detach,
        detachFocal = _detach.focal,
        detachChildren = _detach.children,
        detachFull = _detach.full;

    detach = _.isUndefined(detachFocal) && detachFull || detachFocal;

    hider(record, detach);

    detach = { focal: detachChildren, full: detachFull };

    _.each(record.regions, function (regionObj) {
      regionObj.current.forEach(function (uniqueAddress) {
        _this3.focal({ name: uniqueAddress, detach: _.clone(detach) });
      });
    });
  }
};

var viewApi = {
  href: function href(stateName) {
    for (var _len = arguments.length, routeValues = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      routeValues[_key - 1] = arguments[_key];
    }

    return '#' + routeAssembler(stateName, routeValues).fragment;
  }
};

var instantiator = (function (viewConfigs, stateParams) {
  var view = viewConfigs.view,
      record = viewConfigs.record,
      region = viewConfigs.region,
      uniqueAddress = viewConfigs.uniqueAddress,
      detachHidden = viewConfigs.detachHidden,
      addressStateName = viewConfigs.addressStateName;
  var instance = record.instance,
      ui = record.ui;


  if (instance && ui) {
    instance.destroy();
  }

  var params = paramsAssembler(uniqueAddress, stateParams);

  instance = new view(params);
  _.extend(record, { instance: instance, active: true });

  if (!(instance instanceof Backbone.View)) {
    return _.extend(instance, Backbone.Events);
  }

  _.extend(record, { detached: true, detach: detachHidden, ui: true });

  region.current.add(uniqueAddress);
  var _instance = instance,
      destroy = _instance.destroy,
      serializeData = _instance.serializeData;


  instance.serializeData = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var data = serializeData && serializeData.apply(this, args);
    return _.extend(this.options, data, { aptivator: viewApi }, configs.templateVars);
  };

  instance.destroy = function () {
    var _ref = _asyncToGenerator(index.mark(function _callee() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var animate, animationState;
      return index.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              animate = params.animate;
              animationState = {
                stateParams: stateParams,
                beginningStateName: uniqueAddress,
                stateName: uniqueAddress,
                primary: true
              };

              if (!animate) {
                _context.next = 5;
                break;
              }

              _context.next = 5;
              return animator(animationState, 'exit');

            case 5:

              deactivator$1.focal({ name: uniqueAddress, detach: { focal: true, children: true } });
              region.current.delete(uniqueAddress);

              _.extend(record, { active: false });

              if (record.dependency) {
                record.dependency = undefined;
              }

              if (record.dependent) {
                record.dependent = undefined;
              }

              delete record.instance;

              destroy.call(this);

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function () {
      return _ref.apply(this, arguments);
    };
  }();

  instance.render();

  if (relations.isRoot(addressStateName)) {
    return rootViewRegistrar(viewConfigs, stateParams);
  }

  displayer$1(viewConfigs);
});

var renderingPreparer = (function (viewConfigs) {
  var addressSelector = viewConfigs.addressSelector,
      addressStateName = viewConfigs.addressStateName;
  var parentUniqueAddress = registry[addressStateName].uniqueAddress;

  var parentRecord = addresser.record(parentUniqueAddress);
  var parentRegions = parentRecord.regions || (parentRecord.regions = {});
  var region = parentRegions[addressSelector] || (parentRegions[addressSelector] = { current: new Set() });
  _.extend(viewConfigs, { record: {}, region: region, parentRecord: parentRecord });
});

var renderer = (function (stateParams) {
  stateParams.flags.rendered = true;
  var flags = stateParams.flags,
      beginningStateName = stateParams.beginningStateName,
      stateName = stateParams.stateName;
  var spliced = flags.spliced;

  var family = relations.family(stateName).slice(1);

  _.each(family, function (stateName) {
    _.each(registry[stateName].views, function (viewConfigs) {
      var _viewConfigs$record = viewConfigs.record,
          record = _viewConfigs$record === undefined ? {} : _viewConfigs$record,
          main = viewConfigs.main,
          stateName = viewConfigs.stateName;
      var ui = record.ui,
          active = record.active;


      if (_.isEmpty(record)) {
        renderingPreparer(viewConfigs);
      }

      if (spliced && active) {
        return;
      }

      if (main && _.isUndefined(beginningStateName)) {
        if (relations.isRoot(relations.parent(stateName))) {
          beginningStateName = rootStateName;
        } else {
          beginningStateName = stateName;
        }

        _.extend(stateParams, { beginningStateName: beginningStateName });
      }

      if (cacheAssessor.total(viewConfigs, stateParams)) {
        if (ui) {
          displayer(viewConfigs, stateParams, cacheAssessor);
        }

        return;
      }

      instantiator(viewConfigs, stateParams);
    });
  });

  return stateParams;
});

var classCallCheck = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

var createClass = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass = unwrapExports(createClass);

var _this$5 = undefined;

var errorer = (function () {
  var _ref = _asyncToGenerator(index.mark(function _callee(e) {
    var type, message, _e$stateParams, stateParams, stateName, eventName, errorHandles, errorToPrint, handle;

    return index.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(e instanceof Error)) {
              type = e.type, message = e.message, _e$stateParams = e.stateParams, stateParams = _e$stateParams === undefined ? {} : _e$stateParams;
              stateName = stateParams.stateName;
              eventName = 'error';
              errorHandles = [eventName + ':' + type];
              errorToPrint = error$1.message('' + type + (message ? ': ' + message : ''), 'errorer');


              if (stateName) {
                handle = eventName + ':' + stateName + ':' + type;

                errorHandles.push({ handle: handle, full: true });
              }

              aptivator.trigger(errorHandles, type, stateParams).then(function (results) {
                if (stateName) {
                  hookResulter(type, stateParams, results);
                }
              });

              console.log('%c' + errorToPrint, 'color: red');
            } else {
              console.error(e);
            }

            throw e;

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this$5);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

var _class = function () {
  function _class(instance, receiver, receiverConfigs, params) {
    _classCallCheck(this, _class);

    var _instance$events = instance.events,
        events = _instance$events === undefined ? {} : _instance$events;

    var method = events[receiver] || receiver;
    _.extend(this, { data: {}, instance: instance, method: method, receiverConfigs: receiverConfigs, params: params });
    return this.handler.bind(this);
  }

  _createClass(_class, [{
    key: 'handler',
    value: function handler(result, storeAs) {
      var _this = this;

      var data = this.data,
          receiverConfigs = this.receiverConfigs,
          params = this.params,
          instance = this.instance,
          method = this.method;
      var complete = receiverConfigs.complete,
          reset = receiverConfigs.reset;

      var previous = Promise.resolve(data[storeAs]);
      var current = Promise.resolve(result);

      data[storeAs] = previous.then(function () {
        return current;
      }).then(function (result) {
        data[storeAs] = result;

        if (complete) {
          if (_.keys(data).length < params.length) {
            return;
          }

          if (reset) {
            setTimeout(function () {
              return _this.data = {};
            });
          }
        }

        instance[method](_.clone(data));
      }).catch(function (e) {
        return errorer({ type: e });
      }).catch(_.noop);
    }
  }]);

  return _class;
}();

var receiversNormalizer = (function (receivers) {
  if (_.isArray(receivers)) {
    receivers = _.reduce(receivers, function (receivers, receiver) {
      return _.extend(receivers, _defineProperty({}, receiver, { complete: false }));
    }, {});
  }

  return receivers;
});

var receiversGenerator = (function (instance, receivers, params) {
  return _.map(receiversNormalizer(receivers), function (receiverConfigs, receiver) {
    return new _class(instance, receiver, receiverConfigs, params);
  });
});

var moduleName$1 = 'connector';

var connector = (function (stateParams) {
  var stateName = stateParams.stateName;

  var family = relations.family(stateName).slice(1);

  _.each(family, function (relation) {
    var _registry$relation = registry[relation],
        stateViews = _registry$relation.views,
        connectingViews = _registry$relation.connectingViews;

    var dependencyRecords = [];

    _.each(connectingViews, function (viewConfigs) {
      var storeAses = [];
      var params = {};
      var record = viewConfigs.record,
          deps = viewConfigs.deps;
      var instance = record.instance,
          dependent = record.dependent;
      var receivers = deps.receivers,
          views = deps.views;

      var depReceivers = {};

      if (receivers) {
        params.all = [];
        depReceivers.all = receiversGenerator(instance, receivers, params.all);
      }

      _.each(views, function (depConfigs, depHash) {
        var _ref = _.filter(stateViews, { viewHash: depHash })[0] || {},
            _ref$record = _ref.record,
            record = _ref$record === undefined ? {} : _ref$record;

        var dependency = record.dependency,
            dependencyInstance = record.instance;
        var _dependencyInstance$e = dependencyInstance.events,
            events = _dependencyInstance$e === undefined ? {} : _dependencyInstance$e,
            delegateEvents = dependencyInstance.delegateEvents;


        if (_.isEmpty(record)) {
          error$1.throw('dependency [' + depHash + '] view does not exist', moduleName$1);
        }

        if (dependent && dependency) {
          return;
        }

        var receivers = depConfigs.receivers,
            intercept = depConfigs.intercept;


        if (receivers) {
          params[depHash] = [];
          depReceivers[depHash] = receiversGenerator(instance, receivers, params[depHash]);
        }

        _.each(intercept, function (interceptConfigs, intercepted) {
          var storeAs = interceptConfigs.storeAs,
              debounce = interceptConfigs.debounce,
              receivers = interceptConfigs.receivers,
              local = interceptConfigs.local;


          if (!storeAs) {
            error$1.throw('[storeAs] property should be defined for every intercepted method', moduleName$1);
          }

          if (storeAses.includes(storeAs)) {
            error$1.throw('[storeAs] property should be unique', 'connector');
          }

          if (!events[intercepted] && !dependencyInstance[intercepted]) {
            error$1.throw('event or method [' + intercepted + '] is not included in the [' + depHash + '] dependency', moduleName$1);
          }

          storeAses.push(storeAs);

          var methodHash = (depHash + '-' + intercepted).replace(/\s+/g, '-');
          var method = events[intercepted] || intercepted;
          var callback = dependencyInstance[method];

          if (!callback.overriddenByAptivator) {
            var triggerer = function triggerer(result) {
              return dependencyInstance.trigger(methodHash, result);
            };
            triggerer = _.debounce(triggerer, debounce || 0);

            dependencyInstance[method] = function () {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              var result = callback.apply(this, args);
              triggerer(result);
              return result;
            };

            dependencyInstance[method].overriddenByAptivator = true;

            if (delegateEvents) {
              dependencyInstance.delegateEvents();
            }
          }

          if (receivers) {
            depReceivers[methodHash] = receiversGenerator(instance, receivers, [storeAs]);
          }

          if (!local) {
            if (params.all) {
              params.all.push(storeAs);
            }

            if (params[depHash]) {
              params[depHash].push(storeAs);
            }
          }

          _.each(depReceivers, function (receivers, receiversMethodHash) {
            if (local && receiversMethodHash !== methodHash) {
              return;
            }

            _.each(receivers, function (receiver) {
              receiver = _.partial(receiver, _, storeAs);
              instance.listenTo(dependencyInstance, methodHash, receiver);
            });
          });

          delete depReceivers[methodHash];
        });

        delete depReceivers[depHash];
        dependencyRecords.push(record);
      });

      _.extend(record, { dependent: true });
    });

    _.each(dependencyRecords, function (record) {
      return _.extend(record, { dependency: true });
    });
  });

  return stateParams;
});

var _this$6 = undefined;

var eventHandle = 'aptivator-goto-finalizer';

var displayer$2 = (function (stateParams) {
  return new Promise(function () {
    var _ref = _asyncToGenerator(index.mark(function _callee(resolve) {
      var query, renderingStates, renderedStates, animationStates;
      return index.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              stateParams.flags.displayed = true;
              aptivator.once(eventHandle, function () {
                return resolve(stateParams);
              });

              query = { flags: { pending: true, rendered: true, displayed: false, canceled: false } };
              renderingStates = aptivator.history.find(query);

              if (!renderingStates.length) {
                _context.next = 6;
                break;
              }

              return _context.abrupt('return');

            case 6:

              query = { flags: { pending: true, displayed: true, canceled: false } };
              renderedStates = aptivator.history.find(query);
              animationStates = _.reduce(renderedStates, function (animationStates, renderedStateParams) {
                var stateName = renderedStateParams.stateName,
                    rootViews = renderedStateParams.rootViews,
                    beginningStateName = renderedStateParams.beginningStateName;

                var primary = stateParams === renderedStateParams;
                setTimeout(function () {
                  return _.each(rootViews, function (rootView) {
                    return displayer$1(rootView);
                  });
                });
                delete renderedStateParams.rootViews;

                if (beginningStateName) {
                  animationStates.push({
                    stateParams: renderedStateParams,
                    beginningStateName: beginningStateName,
                    stateName: stateName,
                    primary: primary
                  });
                }

                return animationStates;
              }, []);
              _context.next = 11;
              return animator(animationStates, 'enter');

            case 11:

              aptivator.trigger(eventHandle);

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this$6);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
});

var finalizer = (function (stateParams) {
  _.extend(stateParams.flags, { pending: false, active: true });

  if (stateParams.time) {
    console.log('%cruntime: ' + (_.now() - stateParams.time) + 'ms', 'color: green;');
    delete stateParams.time;
  }

  return stateParams;
});

var processes = [initializer, eventer('start'), preprocessor, resolver, eventer('loading'), deactivator, renderer, connector, displayer$2, eventer('loaded'), finalizer, eventer('enter')];

processes = processes.map(function (process) {
  return function (stateParams) {
    if (!stateParams) {
      return;
    }

    canceler(stateParams);

    return process(stateParams);
  };
});

aptivator.activate = function (stateParams) {
  var promise = starter(stateParams);
  _.each(processes, function (process) {
    return promise = promise.then(process);
  });
  return promise.catch(errorer);
};

function inactor(statesParams) {
  _.each(statesParams, function (stateParams) {
    var flags = stateParams.flags,
        parallels = stateParams.parallels;

    _.extend(flags, { active: false });
    inactor(parallels);
  });
}

var _this$7 = undefined;

var starter$1 = (function () {
  var _ref = _asyncToGenerator(index.mark(function _callee(params) {
    var name, partial, stateConfigs, query, statesParams, stateParams, flags, family;
    return index.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = params.name, partial = params.partial;
            stateConfigs = registry[name];

            if (!deactivating.includes(name)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return');

          case 4:
            if (stateConfigs) {
              _context.next = 6;
              break;
            }

            throw { type: 'undeclared', message: 'state [' + name + '] does not exist' };

          case 6:
            query = { stateName: name, flags: { active: true } };
            statesParams = aptivator.history.find(query);
            stateParams = statesParams[0];

            if (stateParams) {
              _context.next = 11;
              break;
            }

            return _context.abrupt('return');

          case 11:

            inactor(statesParams.slice(1));

            flags = stateParams.flags;
            family = flags.spliced ? [name] : relations.family(name);


            deactivating.push(name);

            _.extend(flags, { deactivating: true, partial: partial });

            _.each(family, function (relation) {
              var stateConfigs = registry[relation];
              _.each(stateConfigs.states, function (stateParams) {
                var name = stateParams.name;

                aptivator.deactivate({ name: name }).catch(_.noop);
              });
            });

            return _context.abrupt('return', stateParams);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this$7);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

var eventHandle$1 = 'aptivator-goto-finish';

var deactivator$2 = (function (stateParams) {
  return new Promise(function (resolve) {
    if (!stateParams) {
      return resolve();
    }

    stateParams.flags.deactivating = false;

    var query = { flags: { active: true, deactivating: true } };
    var deactivatingStates = aptivator.history.find(query);

    if (deactivatingStates.length) {
      aptivator.once(eventHandle$1, resolve);
      return;
    }

    var otherActives = aptivator.history.find(function (stateParams) {
      var _stateParams$flags = stateParams.flags,
          active = _stateParams$flags.active,
          deactivating$$1 = _stateParams$flags.deactivating;

      return active && _.isUndefined(deactivating$$1);
    });

    query = { flags: { active: true, deactivating: false } };
    deactivatingStates = aptivator.history.find(query);

    var ancestorGroupings = {};
    var triggerables = [];

    _.each(deactivatingStates, function (stateParams) {
      var stateName = stateParams.stateName,
          flags = stateParams.flags;
      var partial = flags.partial;

      var ancestor = relations.parts(stateName)[0];
      var comparator = partial ? stateName : ancestor;
      var operator = partial ? 'gt' : 'gte';
      var actives = _.filter(otherActives, function (stateParams) {
        var stateName = stateParams.stateName;

        if (stateName.startsWith(comparator)) {
          return _[operator](stateName.length, comparator.length);
        }
      });

      actives.push(stateParams);
      triggerables.push.apply(triggerables, _toConsumableArray(actives));
      _.remove(otherActives, function (stateParams) {
        return actives.includes(stateParams);
      });

      var grouping = ancestorGroupings[ancestor];

      if (!grouping) {
        grouping = { stateNames: [], min: stateName, max: stateName, stateParams: stateParams };
        ancestorGroupings[ancestor] = grouping;
      }

      var _grouping = grouping,
          min = _grouping.min,
          max = _grouping.max,
          stateNames = _grouping.stateNames;


      _.each(actives, function (stateParams) {
        var stateName = stateParams.stateName,
            flags = stateParams.flags;
        var partial = flags.partial;


        stateNames.push(stateName);

        if (!relations.isRoot(min)) {
          if (!partial) {
            min = rootStateName;
          } else if (min.length > stateName.length) {
            min = stateName;
          }
        }

        if (max.length < stateName.length) {
          max = stateName;
        }
      });

      stateNames.sort(relations.hierarchySorter());
      _.extend(grouping, { min: min, max: max });
    });

    var animationStates = _.reduce(ancestorGroupings, function (animationStates, grouping) {
      var min = grouping.min,
          max = grouping.max,
          deactivatingStateParams = grouping.stateParams;

      var primary = stateParams === deactivatingStateParams;
      animationStates.push({
        beginningStateName: min,
        stateName: max,
        stateParams: deactivatingStateParams,
        primary: primary });
      return animationStates;
    }, []);

    var animationPromise = animator(animationStates, 'exit').then(function () {
      _.each(ancestorGroupings, function (grouping) {
        var min = grouping.min,
            max = grouping.max,
            stateNames = grouping.stateNames;


        if (relations.isRoot(min)) {
          return deactivator$1.full({ name: max });
        }

        _.each(stateNames, function (stateName) {
          deactivator$1.partial({ name: stateName });
        });
      });

      _.each(triggerables, function (stateParams) {
        _.extend(stateParams.flags, { active: false, deactivated: true });
        var triggerObj = { handle: 'exit:' + stateParams.stateName, full: true, args: [stateParams] };
        aptivator.trigger(triggerObj).then(function (results) {
          return hookResulter('exit', stateParams, results);
        });
      });
    });

    resolve(animationPromise);
    aptivator.trigger(eventHandle$1);
    _.remove(deactivating, function () {
      return true;
    });
  });
});

aptivator.deactivate = function (params) {
  return starter$1(params).then(deactivator$2).catch(errorer);
};

aptivator.destroy = function (params) {};

module.exports = aptivator;
