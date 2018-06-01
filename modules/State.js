export default class State extends React.Component {
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
