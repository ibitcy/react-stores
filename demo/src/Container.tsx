import React, { useCallback, useEffect, useState } from 'react';

import * as packageJson from '../../package.json';
import { useStore } from '../../src';
import { Complex } from './complex';
import { Counter } from './Counter';
import { CounterDecorator } from './CounterDecorator';
import { CounterEvents } from './CounterEvents';
import { History } from './history';
import { IsolatedStores } from './IsolatedStores';
import { Optimization } from './Optimization';
import { Performance } from './Performance';
import { Persistent } from './persistent';
import { EPage, historyStore, pageStore, persistentStore, stores } from './stores';

interface IInnerNav {
  pageId: EPage;
}
interface ILinkNav {
  href: string;
  title: string;
}
type TProps = IInnerNav | ILinkNav;

const NavItem: React.FC<TProps> = props => {
  const pageStoreState = useStore(pageStore);
  if ((props as any).pageId) {
    const { pageId } = props as IInnerNav;
    const className = pageId === pageStoreState.page ? 'active' : '';

    const handleClick = (e, id) => {
      e.preventDefault();
      location.hash = `#${pageId}`;
    };

    return (
      <a className={className} href='#' onClick={e => handleClick(e, pageId)}>
        {pageId}
      </a>
    );
  }
  const { href, title } = props as ILinkNav;
  return (
    <a href={href} target='_blank' rel='nofollow noreferrer noopener'>
      {title}
    </a>
  );
};

export const Container: React.FC = () => {
  const pageStoreState = useStore(pageStore);

  const [items, setItems] = useState([]);
  useEffect(() => {
    const setPage = () => {
      const hashPage = EPage[location.hash.replace('#', '')];
      pageStore.setState({
        page: hashPage ? hashPage : EPage.Components,
        $actionName: 'changePage',
      });
    };

    window.onhashchange = () => {
      setPage();
    };

    setPage();
  }, []);

  const handleIterateStateValue = e => {
    e.preventDefault();
    setItems(items.concat(Math.random()));
  };

  return (
    <React.Fragment>
      <nav className='main-nav'>
        <NavItem pageId={EPage.Components} />
        <NavItem pageId={EPage.Persistent} />
        <NavItem pageId={EPage.Snapshots} />
        <NavItem pageId={EPage.Performance} />
        <NavItem pageId={EPage.Optimization} />
        <NavItem pageId={EPage.Isolated} />
        <NavItem
          href='https://github.com/ibitcy/react-stores-devtools-extension#react-stores-devtools-extension'
          title='Devtool debugger'
        />
      </nav>

      <div className='inner'>
        {pageStoreState.page === EPage.Components && (
          <React.Fragment>
            <h1>Components demo</h1>
            <button onClick={() => stores.resetState()}>Reset store</button>
            <button onClick={handleIterateStateValue}>
              Iterate parent state value <span className='label'>{items.length}</span>
            </button>
            <Complex />
            <Counter />
            <CounterEvents />
            <CounterDecorator />
          </React.Fragment>
        )}
        {pageStoreState.page === EPage.Persistent && (
          <React.Fragment>
            <h1>Persistent store demo</h1>

            <button onClick={() => persistentStore.resetPersistence()}>Reset persistence</button>
            <button onClick={() => persistentStore.resetState()}>Reset store</button>

            <Persistent />
          </React.Fragment>
        )}
        {pageStoreState.page === EPage.Snapshots && (
          <React.Fragment>
            <h1>Snapshots demo</h1>

            <button onClick={() => historyStore.resetPersistence()}>Reset persistence</button>
            <button onClick={() => historyStore.resetState()}>Reset store</button>
            <button onClick={() => historyStore.resetDumpHistory()}>Reset history</button>
            <button onClick={() => historyStore.saveDump()}>Save dump</button>

            <History />
          </React.Fragment>
        )}
        {pageStoreState.page === EPage.Performance && (
          <React.Fragment>
            <h1>Performance test</h1>

            <Performance />
          </React.Fragment>
        )}

        {pageStoreState.page === EPage.Optimization && (
          <React.Fragment>
            <h1>Re-renders optimization</h1>

            <Optimization />
          </React.Fragment>
        )}

        {pageStoreState.page === EPage.Isolated && (
          <React.Fragment>
            <h1>Isolated store</h1>

            <IsolatedStores />
          </React.Fragment>
        )}

        <div className='version'>React Stores Version: {packageJson.version}</div>
      </div>
    </React.Fragment>
  );
};
