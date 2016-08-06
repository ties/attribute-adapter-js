import { Collection, List } from 'immutable';

/**
 * Handle a single attribute
 */
function getAttributeWrapper(target, targetProp) {
  // Unwind a list of ['path1', 'path2', 'tail'] elements
  if (targetProp instanceof List) {
    return targetProp.reduce((cur, value) => {
      // If the current element is a list, take the [value] from each entry.
      if (cur instanceof List) {
        return cur.map(c => c.get(value)).toList();
      }
      if (cur instanceof Array) {
        return cur.map(c => c[value]);
      }

      if (cur instanceof Collection.Keyed) {
        return cur.get(value);
      }
      return cur[value];
    }, target);
  }
  return target[targetProp];
}

/**
 * Return a proxy that only rewrites the first function argument.
 */
function keyedIterableApplyArgListProxy(targetObj, mappings) {
  return new Proxy(targetObj, {
    apply(target, thisArg, argumentsList) {
      const localArguments = argumentsList;

      // Only rewrite when arguments are given. However, ignore the number of
      // arguments, since additional arguments are valid in JS. We always
      // rewrite arg[0]
      if (argumentsList.length > 0) {
        const arg0 = argumentsList[0];
        if (Array.isArray(arg0)) {
          if (mappings.hasIn(arg0)) {
            localArguments[0] = mappings.getIn(arg0).toJS();
          }
        } else {
          const newArg = mappings.get(arg0, arg0);
          // do not rewrite an argument to a nested dictionary
          // { path: { child: ... } would rewrite it's 'path' token to
          // Map { child: ...
          if (!(newArg instanceof Collection.Keyed)) {
            localArguments[0] = mappings.get(arg0, arg0);
          }
        }
      }

      return target.apply(thisArg, localArguments);
    },
  });
}

/**
 * Check if prop has a valid mapping
 */
function hasValidMapping(mappings, prop) {
  return mappings.has(prop) && !(mappings.get(prop) instanceof Collection.Keyed);
}


/**
 * Rename the properties of an object
 * @param initailMappings: mappings. Type: Immutable Map with Immutable Lists if nested values are
 *                         included.
*/
export default function attributeAdapter(initialMappings) {
  const mappings = initialMappings;

  return {
    get(target, prop) {
      if (!hasValidMapping(mappings, prop)) {
        // Check for Immutable Map/Record:
        if (target instanceof Collection.Keyed) {
          // If property is 'get'/'set'/'getIn'/'setIn', rewrite argument.
          if (['get', 'set', 'getIn', 'setIn'].includes(prop)) {
            return keyedIterableApplyArgListProxy(target[prop], mappings);
          }
        }

        return target[prop];
      }

      return getAttributeWrapper(target, mappings.get(prop));
    },

    /* eslint-disable no-param-reassign */
    set(target, prop, value) {
      if (!hasValidMapping(mappings, prop)) {
        target[prop] = value;
      } else {
        const mapping = mappings.get(prop);

        if (mapping instanceof List) {
          return false;
          // Property ${prop} is a synthetic prop, can not be set: value would be lost
        }
        target[mapping] = value;
      }
      return true;
    },
    /* eslint-enable no-param-reassign */
  }
}
