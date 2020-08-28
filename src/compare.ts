function getClass(obj: any): string {
  return {}.toString.call(obj).slice(8, -1);
}

function isPrimitive(object: any) {
  switch (typeof object) {
    case 'undefined':
    case 'boolean':
    case 'number':
    case 'string':
    case 'symbol': {
      return true;
    }

    default: {
      return false;
    }
  }
}

export function areSimilar(a: any, b: any, ...exceptionList: Array<string>): boolean {
  // 100% similar things, including primitives
  if (a === b) {
    return true;
  }

  // early check for primitives with different values
  // or one not being a primitive
  if (isPrimitive(a) || isPrimitive(b)) {
    return a === b;
  }

  // typeof null is object, but if both were null that would have been already detected.
  if (a === null || b === null) {
    return false;
  }

  if (typeof a === typeof b) {
    switch (getClass(a)) {
      case "Date":
        return a.getTime() === b.getTime();
    }
  }

  if ((Array.isArray(a) && !Array.isArray(b)) || (!Array.isArray(a) && Array.isArray(b))) {
    return false;
  }

  // Object similarity is determined by the same set of keys NOT in
  // the exception list (although not necessarily the same order), and equivalent values for every
  // corresponding key NOT in the exception list.
  const exceptionListSet = new Set(exceptionList);
  const setKeysA = new Set(Object.keys(a));
  const setKeysB = new Set(Object.keys(b));

  // make sure that exception list key are included
  // so it does not fail in the following steps.
  for (const key of exceptionList) {
    setKeysA.add(key);
    setKeysB.add(key);
  }

  // after adding all the keys from the exception list they
  // should have the same number of keys
  if (setKeysA.size !== setKeysB.size) {
    return false;
  }

  const keysA = Array.from(setKeysA);
  const keysB = Array.from(setKeysB);

  // the same set of keys, but not neccesarily same order
  keysA.sort();
  keysB.sort();

  // key test
  for (let i = keysA.length - 1; i >= 0; i--) {
    if (keysA[i] !== keysB[i]) {
      return false;
    }
  }

  for (let i = keysA.length - 1; i >= 0; i--) {
    const key = keysA[i];
    // just compare if not in the exception list.
    if (!exceptionListSet.has(key) && !areSimilar(a[key], b[key], ...exceptionList)) {
      return false;
    }
  }

  return typeof a === typeof b;
}
