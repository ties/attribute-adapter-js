var AttributeAdapter =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = immutable;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = attributeAdapter;\n\nvar _immutable = __webpack_require__(0);\n\n/**\n * Handle a single attribute\n */\nfunction getAttributeWrapper(target, targetProp) {\n  // Unwind a list of ['path1', 'path2', 'tail'] elements\n  if (targetProp instanceof _immutable.List) {\n    return targetProp.reduce(function (cur, value) {\n      // If the current element is a list, take the [value] from each entry.\n      if (cur instanceof _immutable.List) {\n        return cur.map(function (c) {\n          return c.get(value);\n        }).toList();\n      }\n      if (cur instanceof Array) {\n        return cur.map(function (c) {\n          return c[value];\n        });\n      }\n\n      if (typeof cur.get === 'function') {\n        return cur.get(value);\n      }\n      return cur[value];\n    }, target);\n  }\n  return target[targetProp];\n}\n\n/**\n * Return a proxy that only rewrites the first function argument.\n */\nfunction keyedIterableApplyArgListProxy(targetObj, mappings) {\n  return new Proxy(targetObj, {\n    apply: function apply(target, thisArg, argumentsList) {\n      var localArguments = argumentsList;\n\n      // Only rewrite when arguments are given. However, ignore the number of\n      // arguments, since additional arguments are valid in JS. We always\n      // rewrite arg[0]\n      if (argumentsList.length > 0) {\n        var arg0 = argumentsList[0];\n        if (Array.isArray(arg0)) {\n          if (mappings.hasIn(arg0)) {\n            localArguments[0] = mappings.getIn(arg0).toJS();\n          }\n        } else {\n          var newArg = mappings.get(arg0, arg0);\n          // do not rewrite an argument to a nested dictionary\n          // { path: { child: ... } would rewrite it's 'path' token to\n          // Map { child: ...\n          if (!(newArg instanceof _immutable.Collection.Keyed)) {\n            localArguments[0] = mappings.get(arg0, arg0);\n          }\n        }\n      }\n\n      return target.apply(thisArg, localArguments);\n    }\n  });\n}\n\n/**\n * Check if prop has a valid mapping\n */\nfunction hasValidMapping(mappings, prop) {\n  return mappings.has(prop) && !(mappings.get(prop) instanceof _immutable.Collection.Keyed);\n}\n\n/**\n* Rename the properties of an object\n*/\nfunction attributeAdapter(initialMappings) {\n  var mappings = (0, _immutable.fromJS)(initialMappings);\n\n  return {\n    get: function get(target, prop) {\n      if (!hasValidMapping(mappings, prop)) {\n        // Check for Immutable Map/Record:\n        if (target instanceof _immutable.Collection.Keyed) {\n          // If property is 'get'/'set'/'getIn'/'setIn', rewrite argument.\n          if (['get', 'set', 'getIn', 'setIn'].includes(prop)) {\n            return keyedIterableApplyArgListProxy(target[prop], mappings);\n          }\n        }\n\n        return target[prop];\n      }\n\n      return getAttributeWrapper(target, mappings.get(prop));\n    },\n\n\n    /* eslint-disable no-param-reassign */\n    set: function set(target, prop, value) {\n      if (!hasValidMapping(mappings, prop)) {\n        target[prop] = value;\n      } else {\n        var mapping = mappings.get(prop);\n\n        if (mapping instanceof _immutable.List) {\n          return false;\n          // Property ${prop} is a synthetic prop, can not be set: value would be lost\n        }\n        target[mapping] = value;\n      }\n      return true;\n    }\n  };\n}//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9pbmRleC5qcz9jODcyIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGF0dHJpYnV0ZUFkYXB0ZXI7XG5cbnZhciBfaW1tdXRhYmxlID0gcmVxdWlyZSgnaW1tdXRhYmxlJyk7XG5cbi8qKlxuICogSGFuZGxlIGEgc2luZ2xlIGF0dHJpYnV0ZVxuICovXG5mdW5jdGlvbiBnZXRBdHRyaWJ1dGVXcmFwcGVyKHRhcmdldCwgdGFyZ2V0UHJvcCkge1xuICAvLyBVbndpbmQgYSBsaXN0IG9mIFsncGF0aDEnLCAncGF0aDInLCAndGFpbCddIGVsZW1lbnRzXG4gIGlmICh0YXJnZXRQcm9wIGluc3RhbmNlb2YgX2ltbXV0YWJsZS5MaXN0KSB7XG4gICAgcmV0dXJuIHRhcmdldFByb3AucmVkdWNlKGZ1bmN0aW9uIChjdXIsIHZhbHVlKSB7XG4gICAgICAvLyBJZiB0aGUgY3VycmVudCBlbGVtZW50IGlzIGEgbGlzdCwgdGFrZSB0aGUgW3ZhbHVlXSBmcm9tIGVhY2ggZW50cnkuXG4gICAgICBpZiAoY3VyIGluc3RhbmNlb2YgX2ltbXV0YWJsZS5MaXN0KSB7XG4gICAgICAgIHJldHVybiBjdXIubWFwKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgcmV0dXJuIGMuZ2V0KHZhbHVlKTtcbiAgICAgICAgfSkudG9MaXN0KCk7XG4gICAgICB9XG4gICAgICBpZiAoY3VyIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGN1ci5tYXAoZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICByZXR1cm4gY1t2YWx1ZV07XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGN1ci5nZXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGN1ci5nZXQodmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN1clt2YWx1ZV07XG4gICAgfSwgdGFyZ2V0KTtcbiAgfVxuICByZXR1cm4gdGFyZ2V0W3RhcmdldFByb3BdO1xufVxuXG4vKipcbiAqIFJldHVybiBhIHByb3h5IHRoYXQgb25seSByZXdyaXRlcyB0aGUgZmlyc3QgZnVuY3Rpb24gYXJndW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGtleWVkSXRlcmFibGVBcHBseUFyZ0xpc3RQcm94eSh0YXJnZXRPYmosIG1hcHBpbmdzKSB7XG4gIHJldHVybiBuZXcgUHJveHkodGFyZ2V0T2JqLCB7XG4gICAgYXBwbHk6IGZ1bmN0aW9uIGFwcGx5KHRhcmdldCwgdGhpc0FyZywgYXJndW1lbnRzTGlzdCkge1xuICAgICAgdmFyIGxvY2FsQXJndW1lbnRzID0gYXJndW1lbnRzTGlzdDtcblxuICAgICAgLy8gT25seSByZXdyaXRlIHdoZW4gYXJndW1lbnRzIGFyZSBnaXZlbi4gSG93ZXZlciwgaWdub3JlIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIGFyZ3VtZW50cywgc2luY2UgYWRkaXRpb25hbCBhcmd1bWVudHMgYXJlIHZhbGlkIGluIEpTLiBXZSBhbHdheXNcbiAgICAgIC8vIHJld3JpdGUgYXJnWzBdXG4gICAgICBpZiAoYXJndW1lbnRzTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBhcmcwID0gYXJndW1lbnRzTGlzdFswXTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnMCkpIHtcbiAgICAgICAgICBpZiAobWFwcGluZ3MuaGFzSW4oYXJnMCkpIHtcbiAgICAgICAgICAgIGxvY2FsQXJndW1lbnRzWzBdID0gbWFwcGluZ3MuZ2V0SW4oYXJnMCkudG9KUygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgbmV3QXJnID0gbWFwcGluZ3MuZ2V0KGFyZzAsIGFyZzApO1xuICAgICAgICAgIC8vIGRvIG5vdCByZXdyaXRlIGFuIGFyZ3VtZW50IHRvIGEgbmVzdGVkIGRpY3Rpb25hcnlcbiAgICAgICAgICAvLyB7IHBhdGg6IHsgY2hpbGQ6IC4uLiB9IHdvdWxkIHJld3JpdGUgaXQncyAncGF0aCcgdG9rZW4gdG9cbiAgICAgICAgICAvLyBNYXAgeyBjaGlsZDogLi4uXG4gICAgICAgICAgaWYgKCEobmV3QXJnIGluc3RhbmNlb2YgX2ltbXV0YWJsZS5Db2xsZWN0aW9uLktleWVkKSkge1xuICAgICAgICAgICAgbG9jYWxBcmd1bWVudHNbMF0gPSBtYXBwaW5ncy5nZXQoYXJnMCwgYXJnMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YXJnZXQuYXBwbHkodGhpc0FyZywgbG9jYWxBcmd1bWVudHMpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgcHJvcCBoYXMgYSB2YWxpZCBtYXBwaW5nXG4gKi9cbmZ1bmN0aW9uIGhhc1ZhbGlkTWFwcGluZyhtYXBwaW5ncywgcHJvcCkge1xuICByZXR1cm4gbWFwcGluZ3MuaGFzKHByb3ApICYmICEobWFwcGluZ3MuZ2V0KHByb3ApIGluc3RhbmNlb2YgX2ltbXV0YWJsZS5Db2xsZWN0aW9uLktleWVkKTtcbn1cblxuLyoqXG4qIFJlbmFtZSB0aGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3RcbiovXG5mdW5jdGlvbiBhdHRyaWJ1dGVBZGFwdGVyKGluaXRpYWxNYXBwaW5ncykge1xuICB2YXIgbWFwcGluZ3MgPSAoMCwgX2ltbXV0YWJsZS5mcm9tSlMpKGluaXRpYWxNYXBwaW5ncyk7XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCh0YXJnZXQsIHByb3ApIHtcbiAgICAgIGlmICghaGFzVmFsaWRNYXBwaW5nKG1hcHBpbmdzLCBwcm9wKSkge1xuICAgICAgICAvLyBDaGVjayBmb3IgSW1tdXRhYmxlIE1hcC9SZWNvcmQ6XG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBfaW1tdXRhYmxlLkNvbGxlY3Rpb24uS2V5ZWQpIHtcbiAgICAgICAgICAvLyBJZiBwcm9wZXJ0eSBpcyAnZ2V0Jy8nc2V0Jy8nZ2V0SW4nLydzZXRJbicsIHJld3JpdGUgYXJndW1lbnQuXG4gICAgICAgICAgaWYgKFsnZ2V0JywgJ3NldCcsICdnZXRJbicsICdzZXRJbiddLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICByZXR1cm4ga2V5ZWRJdGVyYWJsZUFwcGx5QXJnTGlzdFByb3h5KHRhcmdldFtwcm9wXSwgbWFwcGluZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBnZXRBdHRyaWJ1dGVXcmFwcGVyKHRhcmdldCwgbWFwcGluZ3MuZ2V0KHByb3ApKTtcbiAgICB9LFxuXG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuICAgIHNldDogZnVuY3Rpb24gc2V0KHRhcmdldCwgcHJvcCwgdmFsdWUpIHtcbiAgICAgIGlmICghaGFzVmFsaWRNYXBwaW5nKG1hcHBpbmdzLCBwcm9wKSkge1xuICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBtYXBwaW5nID0gbWFwcGluZ3MuZ2V0KHByb3ApO1xuXG4gICAgICAgIGlmIChtYXBwaW5nIGluc3RhbmNlb2YgX2ltbXV0YWJsZS5MaXN0KSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIC8vIFByb3BlcnR5ICR7cHJvcH0gaXMgYSBzeW50aGV0aWMgcHJvcCwgY2FuIG5vdCBiZSBzZXQ6IHZhbHVlIHdvdWxkIGJlIGxvc3RcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXRbbWFwcGluZ10gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9");

/***/ }
/******/ ]);