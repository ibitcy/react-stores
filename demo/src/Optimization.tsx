import * as React from 'react';
import { Store, useStore, areSimilar } from '../../lib';

const PASS_COUNT = 10;

interface Param {
  id: number;
  title: string;
  type: number;
}

interface ComplexItem {
  id: number;
  title: string;
  date: Date;
  params: Param[];
  nested: {
    number: number;
    numbers: number[];
    string: string;
    strings: string[];
    params: Param[];
  };
}

interface StoreState {
  complexItems: ComplexItem[];
  number: number;
  string: string;
  object: {
    id: number;
    title: string;
    complexItems: ComplexItem[];
  };
}

const initialStoreState: StoreState = {
  complexItems: [],
  number: 0,
  string: 'string value',
  object: {
    id: 0,
    title: '',
    complexItems: [],
  },
};

const store = new Store<StoreState>(initialStoreState, {
  persistence: false,
  immutable: true,
});

const generateStrings = (passCount: number) => {
  const array: string[] = [];

  for (let i = 0; i < passCount; i++) {
    array.push(`${i + Math.random()}`);
  }

  return array;
};

const generateNumbers = (passCount: number) => {
  const array: number[] = [];

  for (let i = 0; i < passCount; i++) {
    array.push(i);
  }

  return array;
};

const generateComplexItems = (passCount: number, nestedPassNumber: number) => {
  const array: ComplexItem[] = [];

  for (let i = 0; i < passCount; i++) {
    array.push({
      id: i,
      title: `${i + Math.random()}`,
      date: new Date(),
      params: generateParams(nestedPassNumber),
      nested: {
        number: Math.random(),
        numbers: generateNumbers(nestedPassNumber),
        string: `${i + Math.random()}`,
        strings: generateStrings(nestedPassNumber),
        params: generateParams(nestedPassNumber),
      },
    });
  }

  return array;
};

const generateParams = (passCount: number) => {
  const array: Param[] = [];

  for (let i = 0; i < passCount; i++) {
    array.push({
      id: i,
      title: `${i + Math.random()}`,
      type: Math.random(),
    });
  }

  return array;
};

async function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function fillStore(passCount: number) {
  const passCountItems = Math.ceil(passCount / 10);
  const passCountNested = Math.ceil(passCount / 10);
  const complexItems = generateComplexItems(passCountItems, passCountNested);
  store.setState({
    number: Math.random(),
  });
  await sleep(10);
  store.setState({
    complexItems,
  });
  await sleep(10);
  const array: Array<string> = [];
  for (let i = 0; i < passCount; i++) {
    array.push(String.fromCharCode(Math.floor(Math.random() * (90 - 49)) + 48));
  }
  store.setState({
    string: array.join(''),
  });
  await sleep(10);
  store.setState({
    object: {
      id: 0,
      title: '',
      complexItems,
    },
  });
  await sleep(10);
}

export const Optimization: React.FC<{}> = () => {
  const [passCount, setPassNumber] = React.useState(PASS_COUNT);
  const [progress, setProgress] = React.useState(false);
  const progressCountRef = React.useRef<HTMLSpanElement>();

  const handleStart = React.useCallback(
    async e => {
      e.preventDefault();
      if (progress) {
        return;
      }
      store.resetState();
      setProgress(true);
      for (let i = 0; i < passCount; i++) {
        if (progressCountRef.current) {
          progressCountRef.current.innerText = i.toString();
        }
        await fillStore(passCount);
      }
      setProgress(false);
    },
    [passCount, progress],
  );

  return (
    <React.Fragment>
      <form onSubmit={handleStart}>
        <label htmlFor='passCount' className='form-label'>
          Pass count
        </label>
        <span className='row left-aligned'>
          <input
            id='passCount'
            value={passCount || ''}
            type='number'
            pattern='d'
            onChange={e => {
              let number = 0;

              try {
                number = e.target.value ? parseInt(e.target.value) : 0;
              } catch (e) {}

              setPassNumber(number);
            }}
          />
          <button type='submit'>Start test</button>
          {progress && (
            <div className='info'>
              <span>
                <strong>Processing...</strong>&nbsp;
                <span className='label' ref={progressCountRef}>
                  0
                </span>
              </span>
            </div>
          )}
        </span>
      </form>
      <div className='row'>
        <div className='component'>
          <ExperimentWithNoOptimization />
        </div>
        <div className='col-separator' />
        <div className='component'>
          <ExperimentWithCustomCompareFunction />
        </div>
      </div>
      <div className='row'>
        <div className='component'>
          <ExperimentWithSimilarCompareFunction />
        </div>
        <div className='col-separator' />
        <div className='component'>
          <ExperimentWithIncludeKeys />
        </div>
      </div>
    </React.Fragment>
  );
};

Optimization.displayName = 'Optimization';

const ExperimentWithNoOptimization = React.memo(() => {
  const rerenderTimeStart = Date.now();
  const rerenderTime = React.useRef(0);
  const refCount = React.useRef(0);
  const { string, number } = useStore(store);
  refCount.current = refCount.current + 1;
  hardRender();

  rerenderTime.current += Date.now() - rerenderTimeStart;

  return (
    <>
      <h2>
        Not optimised
        <span>
          Using plain <em>useState(store)</em>
        </span>
      </h2>

      <div>
        <p>
          String: <strong>{string}</strong>
        </p>
        <p>
          Number: <strong>{number}</strong>
        </p>
        <p>
          Updates count: <strong>{refCount.current}</strong>
        </p>
        <p>
          Re-render time: <strong>{rerenderTime.current}ms</strong>
        </p>
      </div>
    </>
  );
});

ExperimentWithNoOptimization.displayName = 'ExperimentWithNoOptimization';

const ExperimentWithCustomCompareFunction = React.memo(() => {
  const rerenderTimeStart = Date.now();
  const rerenderTime = React.useRef(0);
  const refCount = React.useRef(0);
  const { string, number } = useStore(
    store,
    state => ({ number: state.number, string: state.string }),
    (a, b) => a.number === b.number && a.string === b.string,
  );
  refCount.current = refCount.current + 1;
  hardRender();
  rerenderTime.current += Date.now() - rerenderTimeStart;

  return (
    <>
      <h2>
        Optimised
        <span>
          Using <em>mapState</em> with custom <em>compareFunction</em>
        </span>
      </h2>

      <div>
        <p>
          String: <strong>{string}</strong>
        </p>
        <p>
          Number: <strong>{number}</strong>
        </p>
        <p>
          Updates count: <strong>{refCount.current}</strong>
        </p>
        <p>
          Re-render time: <strong>{rerenderTime.current}ms</strong>
        </p>
      </div>
    </>
  );
});

ExperimentWithCustomCompareFunction.displayName = 'ExperimentWithCustomCompareFunction';

const ExperimentWithSimilarCompareFunction = React.memo(() => {
  const rerenderTimeStart = Date.now();
  const rerenderTime = React.useRef(0);
  const refCount = React.useRef(0);
  const { string, number } = useStore(store, state => ({ number: state.number, string: state.string }), areSimilar);
  refCount.current = refCount.current + 1;
  hardRender();
  rerenderTime.current += Date.now() - rerenderTimeStart;

  return (
    <>
      <h2>
        Optimised{' '}
        <span>
          Using <em>mapState</em> with <em>areSimilar()</em>
        </span>
      </h2>

      <div>
        <p>
          String: <strong>{string}</strong>
        </p>
        <p>
          Number: <strong>{number}</strong>
        </p>
        <p>
          Updates count: <strong>{refCount.current}</strong>
        </p>
        <p>
          Re-render time: <strong>{rerenderTime.current}ms</strong>
        </p>
      </div>
    </>
  );
});

ExperimentWithSimilarCompareFunction.displayName = 'ExperimentWithSimilarCompareFunction';

const ExperimentWithIncludeKeys = React.memo(() => {
  const rerenderTimeStart = Date.now();
  const rerenderTime = React.useRef(0);

  const refCount = React.useRef(0);
  const { string, number } = useStore(store, ['number', 'string']);
  refCount.current = refCount.current + 1;
  hardRender();

  rerenderTime.current += Date.now() - rerenderTimeStart;

  return (
    <>
      <h2>
        Optimised
        <span>
          Using <em>includeKeys</em>
        </span>
      </h2>
      <div>
        <p>
          String: <strong>{string}</strong>
        </p>
        <p>
          Number: <strong>{number}</strong>
        </p>
        <p>
          Updates count: <strong>{refCount.current}</strong>
        </p>
        <p>
          Re-render time: <strong>{rerenderTime.current}ms</strong>
        </p>
      </div>
    </>
  );
});

ExperimentWithIncludeKeys.displayName = 'ExperimentWithIncludeKeys';

function hardRender() {
  for (let i = 0; i < 1000; i++) {
    const array = new Array(100).fill({ id: 1, string: 'aaa' }).map(item => ({
      id: Math.abs(item.id + 1),
      string: item.string + Date.now(),
    }));
  }
}
