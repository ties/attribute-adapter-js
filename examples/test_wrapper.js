// babel-node --presets es2015,stage-0 examples/test_wrapper.js
import { fromJS } from 'immutable';
import attributeWrapper from '../src';


const mapping = {
  two: 'one',
  path: {
    second: ['path', 'first'],
  },
  traversing: ['childList', 'firstChild'],
};

const source = {
  one: 1,
  path: {
    first: 'foo',
  },
  childList: [
    { firstChild: 1 },
    { firstChild: 2 },
    { firstChild: 3 },
  ],
};

const proxied = new Proxy(fromJS(source), attributeWrapper(mapping));
console.log(proxied.get('two'));
console.log(proxied.set('two', 'three').toJS());
console.log(proxied.setIn(['path', 'second'], 'bar').toJS());

console.log('===================================================================================');
console.log('===      Proxied proxied                                                        ===');
console.log('===================================================================================');
//
// It is a bit too tricky to implement propery descriptors
//
const proxiedObject = new Proxy(source, attributeWrapper(mapping));

console.log(proxiedObject);

proxiedObject.two = 3;

// fails: It resolves proxiedObject.path, then assigns second on that path
proxiedObject.path.second = 4;

console.log(proxiedObject);
