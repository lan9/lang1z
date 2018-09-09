import React, { Component, Fragment } from 'react';
import './styles/App.css';
import twitterLogo from './images/twitter.svg';
import linkedInLogo from './images/linkedin.svg';
import sunIcon from './images/sun.svg';
import moonIcon from './images/moon.svg';
import registerServiceWorker from './registerServiceWorker';
import Icon from './Icon';
import styled, { css, ThemeProvider } from 'styled-components';
import Transition from 'react-transition-group/Transition';
import { connect } from 'react-redux';
import Card from './Card';
import CardDeck from './CardDeck';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      width: undefined,
      height: undefined,
      show: true
    };
    this._toggleNightMode = this._toggleNightMode.bind(this);
    this._updateDimensions = this._updateDimensions.bind(this);
    this._renderContent = this._renderContent.bind(this);
    this._renderMainCardBottomBar = this._renderMainCardBottomBar(this);
  }

  _toggleNightMode() {
    const { toggleNightmode } = this.props;
    toggleNightmode();
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

  _renderMainCardBottomBar() {
    const { nightmode } = this.props;
    const nightmodeIcon = nightmode ? sunIcon : moonIcon;
    return (
      <Fragment>
        <Icon url="https://twitter.com/lang1z" logo={twitterLogo} />
        <Icon url="https://linkedin.com/in/yuzelang" logo={linkedInLogo} />
        <Icon nightmode logo={nightmodeIcon} onClick={this._toggleNightMode} />
      </Fragment>
    );
  }
  _renderContent(init) {
    const widthStyle = css`
      min-width: 200px;
      max-width: 400px;
    `;
    return (
      <CardDeck withStyle={widthStyle}>
        <Card id={1} init={init} top={'1rem'} opacity={0.5}>
          {'aa'}
        </Card>
        <Card id={0} init={init} bottomBarContent={this._renderMainCardBottomBar}>
          <div className="App-title">{"Hello I'm Yuze."}</div>
          <p>{`I'm a software engineer. I work on Twitter's web team right now.`}</p>
          <p>{`I'm also a untalented photographer and failing gardener.`}</p>
        </Card>
      </CardDeck>
    );
  }

  render() {
    //const wideMode = window.innerWidth > 500;
    const { show } = this.state;
    const { nightmode } = this.props;
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

const mapDispatchToProps = dispatch => {
  return {
    toggleNightmode: () => {
      dispatch({ type: 'TOGGLE_NIGHTMODE' });
    }
  };
};

const mapStateToProps = state => {
  return {
    nightmode: state.nightmode
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
