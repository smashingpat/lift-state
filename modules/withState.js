import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { getDisplayName } from './utils';

export const withState = containers => WrappedComponent => {
    const wrappedComponentDisplayName = getDisplayName(WrappedComponent);
    const displayName = `withState(${wrappedComponentDisplayName})`;
    const ComponentWithStateContainer = props =>
        React.createElement(
            WithState, {
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
