import React, {Component} from 'react';
import './styles/App.css';
import twitterLogo from './images/twitter.svg'
import linkedInLogo from './images/linkedin.svg'
import sunIcon from './images/sun.svg'
import moonIcon from './images/moon.svg'
import registerServiceWorker from './registerServiceWorker';

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            width: undefined,
            height: undefined,
            nightmode: false
        }
        this._toggleNightMode = this._toggleNightMode.bind(this);
        this._updateDimensions = this._updateDimensions.bind(this);
    }

    _toggleNightMode() {
        const {nightmode} = this.state;
        this.setState({nightmode: !nightmode});
    }

    _updateDimensions() {
        const w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            height = w.innerHeight || documentElement.clientHeight || body.clientHeight;

        this.setState({width: width, height: height});

    }

    componentWillMount() {
        this._updateDimensions();
    }

    componentDidMount() {
        window.addEventListener("resize", this._updateDimensions);
        registerServiceWorker();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this._updateDimensions);
    }

    render() {
        const wideMode = window.innerWidth > 500;
        const {nightmode} = this.state;
        const nightmodeIcon = nightmode ? moonIcon : sunIcon;
        return (

            <div className="App-backdrop">
                <div className="App-content">
                    <div className="App-title">Hello I'm Yuze.</div>
                    I'm a software engineer at Twitter.
                    <div className="App-bottom-bar">
                        <Icon url="https://twitter.com/lang1z" logo={twitterLogo}/>
                        <Icon url="https://linkedin.com/in/yuzelang" logo={linkedInLogo}/>
                        <Icon className="App-nightmode" logo={nightmodeIcon} onClick={this._toggleNightMode}/>
                    </div>
                </div>
            </div>
        );
    }
}

function Icon(props) {
    return <span className={props.className} onClick={props.onClick}>
        {props.url ? <span className="App-icon">
          <a target="_blank" href={props.url}><img src={props.logo}/></a>
        </span> : <img src={props.logo}/>}
    </span>
}

export default App;
