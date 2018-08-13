import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            width: undefined,
            height: undefined
        }
    }

    updateDimensions() {
        const w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            height = w.innerHeight || documentElement.clientHeight || body.clientHeight;

        this.setState({width: width, height: height});

    }
    componentWillMount() {
        this.updateDimensions();
    }
    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    render() {
        const wideMode = window.innerWidth > 500;

        return (

            <div className="App-backdrop">
                <div className="App-content">
                    <div className="App-title">Hello I'm Yuze.</div>
                    I'm a software engineer at Twitter.
                </div>
            </div>
        );
    }
}

export default App;
