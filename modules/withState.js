import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import State from './State';
import { getDisplayName } from './utils';

const withState = containers => WrappedComponent => {
    const wrappedComponentDisplayName = getDisplayName(WrappedComponent);
    const displayName = `withState(${wrappedComponentDisplayName})`;
    const ComponentWithStateContainer = props =>
        React.createElement(
            State, {
                containers
            },
            (containerInstances) => React.createElement(
                WrappedComponent,
                Object.assign({}, props, containerInstances),
            ),
        );

    ComponentWithStateContainer.displayName = displayName;

    return hoistNonReactStatics(ComponentWithStateContainer, WrappedComponent);
}

export default withState;
