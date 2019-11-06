import React, { useCallback, useState } from 'react';
import { Store, StoreEventType, useStore } from '../../src';

interface Param {
  id: number;
  title: string;
  type: number;
}

interface SimpleItem {
  id: number;
  title: string;
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
  simpleItems: SimpleItem[];
  complexItems: ComplexItem[];
  number: number;
  string: string;
  startDate: Date;
  endDate: Date;
  passCount: number;
  object: {
    id: number;
    title: string;
    complexItems: ComplexItem[];
    simpleItems: SimpleItem[];
  };
}

const initialStoreState = {
  simpleItems: [],
  complexItems: [],
  number: 0,
  string: '',
  startDate: new Date(),
  endDate: new Date(),
  passCount: 0,
  object: {
    id: 0,
    title: '',
    complexItems: [],
    simpleItems: [],
  },
};

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

const generateSimpleItems = (passCount: number) => {
  const array: SimpleItem[] = [];

  for (let i = 0; i < passCount; i++) {
    array.push({
      id: i,
      title: `${i + Math.random()}`,
    });
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

const performanceStoreImmutable = new Store<StoreState>(initialStoreState, {
  persistence: false,
  immutable: true,
});

const performanceStoreMutable = new Store<StoreState>(initialStoreState, {
  persistence: false,
  immutable: false,
});

const PASS_COUNT = 100;
const PASS_COUNT_CRITICAL_MASS = 650;

export const Performance: React.FC = () => {
  const performanceStoreMutableState = useStore(performanceStoreMutable);
  const performanceStoreImmutableState = useStore(performanceStoreImmutable);
  const [inProgress, setInProgress] = useState(false);
  const [results, setResults] = useState(false);
  const [passCount, setPassNumber] = useState(PASS_COUNT);
  const [updateCount, setUpdateCount] = useState(0);
  const [updatedObjectsCount, setUpdatedObjectsCount] = useState(0);

  const fillUpStore = useCallback((mutable: boolean, passCount: number) => {
    const store = mutable ? performanceStoreMutable : performanceStoreImmutable;
    const passCountItems = Math.ceil(passCount / 10);
    const passCountNested = Math.ceil(passCount / 10);
    let updateCount = 0;
    let updatedObjectsCount = 0;

    const event = store.on(StoreEventType.Update, () => {
      updateCount++;
    });

    store.resetState();
    store.setState({
      startDate: new Date(),
    });

    for (let i = 0; i < passCount; i++) {
      updatedObjectsCount++;
      const simpleItems = generateSimpleItems(passCountItems);
      updatedObjectsCount += passCountItems;
      const complexItems = generateComplexItems(passCountItems, passCountNested);
      updatedObjectsCount += passCountItems + passCountNested * 4;

      store.setState({
        simpleItems,
        complexItems,
        number: Math.random(),
        string: `${i + Math.random()}`,
        object: {
          id: 0,
          title: '',
          complexItems,
          simpleItems,
        },
      });
      updatedObjectsCount += 3;
    }

    store.setState({
      endDate: new Date(),
      passCount,
    });

    setUpdateCount(updateCount);
    setUpdatedObjectsCount(updatedObjectsCount);
    event.remove();
  }, []);

  const handleStart = useCallback(() => {
    setUpdateCount(0);
    setUpdatedObjectsCount(0);
    setInProgress(true);

    setTimeout(() => {
      fillUpStore(true, passCount);
      fillUpStore(false, passCount);
      setInProgress(false);
      setResults(true);
    }, 100);
  }, [passCount]);

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
          {passCount >= PASS_COUNT_CRITICAL_MASS && (
            <div className='warning'>
              <span>
                <strong>Warning!</strong>&nbsp;Such count of mutations may result in your browser to hang on forever
              </span>
            </div>
          )}
        </span>
      </form>

      {results && (
        <div className='row'>
          <div className='component'>
            <h2>Mutable results</h2>

            {inProgress ? (
              <div>Progress...</div>
            ) : (
              <div>
                <p>
                  Store updates count: <strong>{updateCount}</strong>
                </p>
                <p>
                  Store objects updated: <strong>{updatedObjectsCount}</strong>
                </p>
                <p>
                  Time:{' '}
                  <strong>
                    {performanceStoreMutableState.endDate.getTime() - performanceStoreMutableState.startDate.getTime()}
                    ms
                  </strong>
                </p>
                Pass count: <strong>{performanceStoreMutableState.passCount}</strong>
              </div>
            )}
          </div>

          <div className='col-separator' />

          <div className='component'>
            <h2>Immutable results</h2>

            {inProgress ? (
              <div>Progress...</div>
            ) : (
              <div>
                <p>
                  Store updates count: <strong>{updateCount}</strong>
                </p>
                <p>
                  Store objects updated: <strong>{updatedObjectsCount}</strong>
                </p>
                <p>
                  Time:{' '}
                  <strong>
                    {performanceStoreImmutableState.endDate.getTime() -
                      performanceStoreImmutableState.startDate.getTime()}
                    ms
                  </strong>
                </p>
                Pass count: <strong>{performanceStoreImmutableState.passCount}</strong>
              </div>
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
