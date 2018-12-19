import React, { Component, Fragment } from 'react';
import './styles/App.css';
import twitterLogo from './images/twitter.svg';
import linkedInLogo from './images/linkedin.svg';
import sunIcon from './images/sun.svg';
import moonIcon from './images/moon.svg';
import Icon from './Icon';
import styled, { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';
import Card from './Card';
import CardDeck from './CardDeck';
import PropTypes from 'prop-types';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      width: undefined,
      height: undefined
    };
    this._toggleNightMode = this._toggleNightMode.bind(this);
    this._updateDimensions = this._updateDimensions.bind(this);
    this._renderContent = this._renderContent.bind(this);
    this._renderMainCardBottomBar = this._renderMainCardBottomBar.bind(this);
  }

  _toggleNightMode() {
    const { toggleNightmode, nightmode } = this.props;
    toggleNightmode(!nightmode);
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
  _renderContent() {
    return (
      <CardDeck minWidth={200} maxWidth={500} initialActiveIndex={0}>
        <Card bottomBarContent={this._renderMainCardBottomBar()}>
          <div className="App-title">{"Hello I'm Yuze."}</div>
          <p>{`I'm a software engineer at Twitter.`}</p>
        </Card>
        <Card>{'This card is left blank intentionally.'}</Card>
      </CardDeck>
    );
  }

  render() {
    //const wideMode = window.innerWidth > 500;
    const { nightmode } = this.props;
    const theme = nightmode
      ? { backdropColor: 'black', bgColor: 'darkgray', textColor: 'black' }
      : { backdropColor: 'darkgray', bgColor: 'white', textColor: 'black' };
    return (
      <ThemeProvider theme={theme}>
        <Backdrop>{this._renderContent()}</Backdrop>
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

App.propTypes = {
  toggleNightmode: PropTypes.func,
  nightmode: PropTypes.bool
};
const mapDispatchToProps = dispatch => {
  return {
    toggleNightmode: mode => {
      dispatch({ type: 'TOGGLE_NIGHTMODE', payload: { mode } });
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
