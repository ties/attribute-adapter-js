// babel-node --presets es2015,stage-0 examples/test_wrapper.js
import { fromJS } from 'immutable';
import attributeWrapper from '../src';


const mapping = {
  two: 'one',
  path: {
    second: ['path', 'first']
  },
};

const source = fromJS({one: 1, path: {first: 'foo'}});

const proxied = new Proxy(source, attributeWrapper(mapping));
console.log(proxied.get('two'));
console.log(proxied.set('two', 'three').toJS());
console.log(proxied.setIn(['path', 'second'], 'bar').toJS());
