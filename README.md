# An implementation of the adapter pattern that renames variables

**But why would you want this?**: When interfacing with objects from an API which declares two
objects, with similar fields (semantics) that have different names...

The code works on ImmutableJS objects, Immutable Records (main use case), and is not totally broken
 on regular objects.

 ```
 babel-node --presets es2015,stage-0 examples/test_wrapper.js
// const proxied = new Proxy(fromJS(source), attributeWrapper(mapping));
// console.log(proxied.get('two'));
1
{ one: 'three',
// console.log(proxied.set('two', 'three').toJS());
  path: { first: 'foo' },
  childList: [ { firstChild: 1 }, { firstChild: 2 }, { firstChild: 3 } ] }
// console.log(proxied.setIn(['path', 'second'], 'bar').toJS());
{ one: 1,
  path: { first: 'bar' },
  childList: [ { firstChild: 1 }, { firstChild: 2 }, { firstChild: 3 } ] }
===================================================================================
===      Proxied proxied                                                        ===
===================================================================================
> const proxiedObject = new Proxy(source, attributeWrapper(mapping));
> console.log(proxiedObject);
{ one: 1,
  path: { first: 'foo' },
  childList: [ { firstChild: 1 }, { firstChild: 2 }, { firstChild: 3 } ] }
> proxiedObject.two = 3;
> // fails: It resolves proxiedObject.path, then assigns second on that path
> proxiedObject.path.second = 4;
> console.log(proxiedObject);
{ one: 3,
  path: { first: 'foo', second: 4 },
  childList: [ { firstChild: 1 }, { firstChild: 2 }, { firstChild: 3 } ] }

> // Fails: setter returns false, i.e. not assignable
> // proxiedObject.traversing = 6;
~/.../examples/test_wrapper.js:51
proxiedobject.traversing = 6;
                         ^

typeerror: 'set' on proxy: trap returned falsish for property 'traversing'
    at object.<anonymous> (test_wrapper.js:49:1)
    at module._compile (module.js:541:32)
    at loader (/users/kockt/src/projects/olo/crm_authentication/js_tools/renamed_attribute_adapter/node_modules/babel-register/lib/node.js:148:5)
    at Object.require.extensions.(anonymous function) [as .js] (~/.../node_modules/babel-register/lib/node.js:158:7)
    at Module.load (module.js:458:32)
    at tryModuleLoad (module.js:417:12)
    at Function.Module._load (module.js:409:3)
    at Function.Module.runMain (module.js:575:10)
    at ~/.../node_modules/babel-cli/lib/_babel-node.js:160:24
    at Object.<anonymous> (~/.../node_modules/babel-cli/lib/_babel-node.js:161:7)
```
