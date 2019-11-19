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
  string: '',
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
  store.setState({
    string: `${Math.random()}`,
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

export const Optimisation: React.FC<{}> = () => {
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
          progressCountRef.current.innerText = String(i);
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
        </span>
        <span className='row left-aligned'>
          {progress && (
            <h4>
              Progressing... Iteration:
              <span ref={progressCountRef} />
            </h4>
          )}
        </span>
      </form>
      <div className='row'>
        <div className='component'>
          <ExperimentWithNoOptimisation />
        </div>
        <div className='component'>
          <ExperimentWithCustomCompareFunction />
        </div>
      </div>
      <div className='row'>
        <div className='component'>
          <ExperimentWithSimilarCompareFunction />
        </div>
        <div className='component'>
          <ExperimentWithIncludeKeys />
        </div>
      </div>
    </React.Fragment>
  );
};

Optimisation.displayName = 'Optimisation';

const ExperimentWithNoOptimisation = React.memo(() => {
  const rerenderTimeStart = Date.now();
  const rerenderTime = React.useRef(0);
  const refCount = React.useRef(0);
  const { string, number } = useStore(store);
  refCount.current = refCount.current + 1;
  hardRender();

  rerenderTime.current += Date.now() - rerenderTimeStart;

  return (
    <>
      <h4>No optimisation, useState(store)</h4>

      <div>
        <p>Store data string: {string}</p>
        <p>Store data number: {number}</p>
        <p>
          Store updates count: <strong>{refCount.current}</strong>
        </p>
        <p>
          Store rerender time: <strong>{rerenderTime.current}ms</strong>
        </p>
      </div>
    </>
  );
});

ExperimentWithNoOptimisation.displayName = 'ExperimentWithNoOptimisation';

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
      <h4>Optimisation mapState with custom compareFunction</h4>

      <div>
        <p>Store data string: {string}</p>
        <p>Store data number: {number}</p>
        <p>
          Store updates count: <strong>{refCount.current}</strong>
        </p>
        <p>
          Store rerender time: <strong>{rerenderTime.current}ms</strong>
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
      <h4>Optimisation mapState with areSimilar function</h4>

      <div>
        <p>Store data string: {string}</p>
        <p>Store data number: {number}</p>
        <p>
          Store updates count: <strong>{refCount.current}</strong>
        </p>
        <p>
          Store rerender time: <strong>{rerenderTime.current}ms</strong>
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
      <h4>Optimisation with includeKeys</h4>

      <div>
        <p>Store data string: {string}</p>
        <p>Store data number: {number}</p>
        <p>
          Store updates count: <strong>{refCount.current}</strong>
        </p>
        <p>
          Store rerender time: <strong>{rerenderTime.current}ms</strong>
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
