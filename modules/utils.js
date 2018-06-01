export const containerType = Symbol('withState');
export const isContainerType = containerInstance => containerInstance.$$type === containerType;

export function getDisplayName(reactComponent) {
    return reactComponent.displayName || reactComponent.name || 'undefined';
}

export function initiateContainerInstances(containersObject) {
    return Object.keys(containersObject).reduce((acc, key) => {
        const StateContainer = containersObject[key];
        const ContainerInstance = isContainerType(StateContainer)
            ? StateContainer
            : new StateContainer()
        return Object.assign(acc, {
            [key]: ContainerInstance
        })
    }, {});
}
