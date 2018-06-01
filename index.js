import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';


const containerType = Symbol('withState');

function getDisplayName(reactComponent) {
  return reactComponent.displayName || reactComponent.name || 'undefined';
}

function initiateContainerInstances(containersObject) {
  return Object.keys(containersObject).reduce((acc, key) => {
    const StateContainer = containersObject[key];
    const ContainerInstance = StateContainer.$$type === containerType
      ? StateContainer
      : new StateContainer()
    return Object.assign(acc, {
      [key]: ContainerInstance
    })
  }, {});
}

export function Container() {
  let listeners = [];
  this.$$type = containerType;
  this.subscribe = function subscribe(fn) {
    listeners.push(fn);
  }
  this.unsubscribe = function unsubscribe(fn) {
    listeners = listeners.filter(f => f !== fn);
  }
  this.setState = function setState(updater, callback) {
    // create the updated state
    const updatedState = typeof updater === 'function'
      ? updater(this.state)
      : updater;

    // if the updatedState is null or undefined, don't update the state
    if (updatedState == null) {
      if (callback) callback();
      return;
    }

    // update the state by creating a new object and merging them all together
    this.state = Object.assign({}, this.state, updatedState);

    // call all the subscribers that there is a new state
    listeners.forEach(listener => listener());

    // and finally, call the callback
    if (callback) callback();
  }
}

export class WithState extends React.Component {
  constructor(props) {
    super(props);
    this.EMPTY_OBJECT = {};
    this.unmounted = false;
    this.onUpdate = this.onUpdate.bind(this);
    this.instances = initiateContainerInstances(props.containers);
  }
  componentDidMount() {
    Object.keys(this.instances).forEach(key => {
      this.instances[key].subscribe(this.onUpdate)
    });
  }
  componentWillUnmount() {
    Object.keys(this.instances).forEach(key => {
      this.instances[key].unsubscribe(this.onUpdate)
    });
  }
  onUpdate() {
    if (!this.unmounted) {
      this.setState(this.EMPTY_OBJECT);
    }
  }
  render() {
    return this.props.children(this.instances);
  }
}

export const withState = containers => WrappedComponent => {
  const wrappedComponentDisplayName = getDisplayName(WrappedComponent);
  const displayName = `withState(${wrappedComponentDisplayName})`;
  const ComponentWithStateContainer = props =>
    React.createElement(
      WithState,
      { containers },
      (containerInstances) => React.createElement(
        WrappedComponent,
        Object.assign({}, props, containerInstances),
      ),
    );

    ComponentWithStateContainer.displayName = displayName;

    return hoistNonReactStatics(ComponentWithStateContainer, WrappedComponent);
}
