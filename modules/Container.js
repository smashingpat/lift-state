export default function Container() {
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
