import React from 'react';

const containerType = Symbol('StateContainer');

export function Container() {
    this.$$type = containerType;
    this.listeners = [];
    this.setState = function setState(updater, callback) {
        const nextState = typeof updater === 'function'
            ? updater(this.state)
            : updater;
        if (nextState == null) {
            if (callback) callback();
            return;
        }

        this.state = Object.assign({}, this.state, nextState);

        this.listeners.forEach(listener => listener());

        if (callback) callback();
    };
    this.subscribe = function subscribe(fn) {
        this.listeners.push(fn);
    };
    this.unsubscribe = function unsubscribe(fn) {
        this.listeners = this.listeners.filter(f => f !== fn);
    };
}

export const withState = containerObject => (WrappedComponent) => {
    const DUMMY_STATE = {};
    const instances = Object.keys(containerObject).map((key) => {
        const StateContainer = containerObject[key];
        const container = StateContainer.$$type === containerType
            ? StateContainer
            : new StateContainer();
        return {
            name: key,
            container,
        };
    });

    return class WithState extends React.Component {
        unmounted = false;

        componentDidMount() {
            instances.forEach(instance => instance.container.subscribe(this.onChange));
        }
        componentWillUnmount() {
            this.unmounted = true;
            instances.forEach(instance => instance.container.unsubscribe(this.onChange));
        }
        onChange = () => {
            this.setState(DUMMY_STATE);
        }

        render() {
            const mapContainerState = instances.reduce((acc, { name, container }) => ({
                ...acc,
                [name]: container,
            }), {});
            const props = {
                ...this.props,
                ...mapContainerState,
            };
            return <WrappedComponent {...props} />;
        }
    };
};
