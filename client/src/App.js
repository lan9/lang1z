import React, {Component} from 'react';
import './styles/App.css';
import twitterLogo from './images/twitter.svg'
import linkedInLogo from './images/linkedin.svg'
import sunIcon from './images/sun.svg'
import moonIcon from './images/moon.svg'
import registerServiceWorker from './registerServiceWorker';
import Icon from './Icon'
import styled, {ThemeProvider} from 'styled-components';

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

        const theme = nightmode
            ? {backdropColor: "black", bgColor: "darkgray", textColor: "black"}
            : {backdropColor: "darkgray", bgColor: "white", textColor: "black"};
        return (
            <ThemeProvider theme={theme}>
                <Backdrop>
                    <AppContent>
                        <div className="App-title">Hello I'm Yuze.</div>
                        I'm a software engineer at Twitter.
                        <div className="App-bottom-bar">
                            <Icon url="https://twitter.com/lang1z" logo={twitterLogo}/>
                            <Icon url="https://linkedin.com/in/yuzelang" logo={linkedInLogo}/>
                            <Icon nightmode logo={nightmodeIcon} onClick={this._toggleNightMode}/>
                        </div>
                    </AppContent>
                </Backdrop>
            </ThemeProvider>
        );
    }
}

const Backdrop = styled.div`
  background: ${props => props.theme.backdropColor};
  width:      100%;
  height:     100%; 
  z-index:    10;
  top:        0; 
  left:       0; 
  position:   fixed; 
}
`;
const AppContent = styled.div`
  color: ${props => props.theme.textColor};
  position: relative;
  margin: auto;
  margin-top: 10vh;
  margin-bottom: 10vh;
  min-width: 200px;
  max-width: 400px;
  height: 200px;
  background-color: ${props => props.theme.bgColor};
  border-radius: 1.5rem;
  border: 10px solid darkgray;
  padding: 50px;
`;

export default App;
