import React, {Component} from 'react';
import './styles/App.css';
import twitterLogo from './images/twitter.svg'
import linkedInLogo from './images/linkedin.svg'
import registerServiceWorker from './registerServiceWorker';

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
        registerServiceWorker();
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
                    <div className="App-bottom-bar">
                        <Icon url="https://twitter.com/lang1z" logo={twitterLogo}/>
                        <Icon url="https://linkedin.com/in/yuzelang" logo={linkedInLogo}/>
                    </div>
                </div>
            </div>
        );
    }
}

function Icon(props) {
    return <span className="App-icon">
          <a target="_blank" href={props.url}><img src={props.logo}/></a>
        </span>;
}

export default App;
