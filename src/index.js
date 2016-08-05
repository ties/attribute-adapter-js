import { fromJS, Collection, Map, List } from 'immutable';

/**
 * Handle a single attribute
 */
function getAttributeWrapper(target, targetProp) {
		// Unwind a list of ['path1', 'path2', 'tail'] elements
		if (targetProp instanceof List) {
			return targetProp.reduce((cur, value) => {
				// If the current element is a list, take the [value] from each entry.
				if (cur instanceof List) {
					return cur.map(c => c[value]).toList();
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
		}
	});
}

/**
* Rename the properties of an object
*/
export default function attributeAdapter(initialMappings) {
	const mappings = fromJS(initialMappings);

  return {
    get(target, property) {
			if (!mappings.has(property)) {
				// Check for Immutable Map/Record:
				if (target instanceof Collection.Keyed) {
					// If property is 'get'/'set'/'getIn'/'setIn', rewrite argument.
					if (['get', 'set', 'getIn', 'setIn'].includes(property)) {
						return keyedIterableApplyArgListProxy(target[property], mappings);
					}
				}

				return target[property];
			}

			return getAttributeWrapper(target, mappings.get(property));
    },

    /* eslint-disable no-param-reassign */
    set(target, property, value) {
			if (!mappings.has(property)) {
        target[property] = value;
      } else {
        const mapping = mappings.get(property);

        if (mapping instanceof List) {
          throw new Error(`Property ${property} is a synthetic property, can set this value since it could be lost...`);
        }
        target[mappings] = value;
      }
    },
    /* eslint-enable no-param-reassign */
  };
}
