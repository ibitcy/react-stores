import * as React from 'react';
interface Props {
}
interface State {
    counter: number;
}
export declare class Persistent extends React.Component<Props, State> {
    state: State;
    private plusOne;
    render(): JSX.Element;
}
export {};
