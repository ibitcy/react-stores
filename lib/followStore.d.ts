import * as React from 'react';
import { Store } from './Store111';
export declare const followStore: <StoreState>(store: Store<StoreState>) => (WrappedComponent: React.ComponentClass<any, any>) => any;
