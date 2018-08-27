import React, { Component } from 'react';
import './styles/App.css';
import twitterLogo from './images/twitter.svg';
import linkedInLogo from './images/linkedin.svg';
import sunIcon from './images/sun.svg';
import moonIcon from './images/moon.svg';
import registerServiceWorker from './registerServiceWorker';
import Icon from './Icon';
import styled, { ThemeProvider } from 'styled-components';
import Transition from 'react-transition-group/Transition';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      width: undefined,
      height: undefined,
      nightmode: false,
      show: true
    };
    this._toggleNightMode = this._toggleNightMode.bind(this);
    this._updateDimensions = this._updateDimensions.bind(this);
    this._renderContent = this._renderContent.bind(this);
  }

  _toggleNightMode() {
    const { nightmode } = this.state;
    this.setState({ nightmode: !nightmode });
  }

  _updateDimensions() {
    const w = window,
      d = document,
      documentElement = d.documentElement,
      body = d.getElementsByTagName('body')[0],
      width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
      height = w.innerHeight || documentElement.clientHeight || body.clientHeight;

    this.setState({ width: width, height: height });
  }

  UNSAFE_componentWillMount() {
    this._updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this._updateDimensions);
    registerServiceWorker();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._updateDimensions);
  }

  _renderContent(init) {
    const { nightmode } = this.state;
    const nightmodeIcon = nightmode ? sunIcon : moonIcon;

    return (
      <AppContent init={init}>
        <div className="App-title">Hello I'm Yuze.</div>
        I'm a software engineer at Twitter.
        <div className="App-bottom-bar">
          <Icon url="https://twitter.com/lang1z" logo={twitterLogo} />
          <Icon url="https://linkedin.com/in/yuzelang" logo={linkedInLogo} />
          <Icon nightmode logo={nightmodeIcon} onClick={this._toggleNightMode} />
        </div>
      </AppContent>
    );
  }

  render() {
    //const wideMode = window.innerWidth > 500;
    const { nightmode, show } = this.state;
    const theme = nightmode
      ? { backdropColor: 'black', bgColor: 'darkgray', textColor: 'black' }
      : { backdropColor: 'darkgray', bgColor: 'white', textColor: 'black' };
    return (
      <ThemeProvider theme={theme}>
        <Backdrop>
          <Transition in={show} timeout={0} mountOnEnter unmountOnExit appear={true}>
            {state => {
              switch (state) {
                case 'entering':
                  return this._renderContent(true);
                case 'entered':
                case 'exiting':
                case 'exited':
                  return this._renderContent(false);
              }
            }}
          </Transition>
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
  transition: 1s;
}
`;
const AppContent = styled.div`
  color: ${props => props.theme.textColor};
  position: relative;
  margin: auto;
  margin-top: ${props => (props.init ? '12vh' : '10vh')};
  opacity: ${props => (props.init ? '0' : '1')};
  transition: 0.5s 0.3s;
  margin-bottom: 10vh;
  min-width: 200px;
  max-width: 400px;
  height: 200px;
  background-color: ${props => props.theme.bgColor};
  border-radius: 1.5rem;
  padding: 50px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

export default App;
