import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Transition from 'react-transition-group/Transition';

class CardDeck extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this._setRefs = this._setRefs.bind(this);
    this._calcBottoms = this._calcBottoms.bind(this);

    this._refs = [];
    this._initialBottoms = [];
    this.state = {
      bottoms: [],
      initialRendered: false,
      activeIndex: 0
    };
  }

  componentDidMount() {
    this._refs.forEach(ref => {
      this._initialBottoms.push(ReactDOM.findDOMNode(ref).clientHeight);
    });

    this.setState({ initialRendered: true, bottoms: this._calcBottoms() });
  }

  render() {
    return (
      //TODO I don't really know why it worked
      <Transition in={true} timeout={1000} mountOnEnter unmountOnExit appear={true}>
        {state => {
          switch (state) {
            case 'entering':
            case 'entered':
              return this._renderContent(true);
            case 'exiting':
            case 'exited':
              return this._renderContent(false);
          }
        }}
      </Transition>
    );
  }

  _calcBottoms() {
    const { activeIndex } = this.state;

    const result = this._initialBottoms.slice(0);
    result[activeIndex] = 0;

    for (let i = activeIndex + 1; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        result[j] += result[i];
      }
    }

    for (let i = activeIndex + 1; i < result.length; i++) {
      result[i] = Math.floor(result[i] * 0.9);
    }

    return result;
  }
  _renderContent(init) {
    const { children, minWidth, maxWidth } = this.props;
    const { initialRendered, bottoms } = this.state;
    const clonedElement = children.map((e, index) => {
      const makeAdditionalProps = index => {
        const refCallback = this._setRefs(index);
        const bottomValue = (bottoms[index] || 0).toString() + 'px';
        return {
          id: index,
          key: 'card_' + index.toString(),
          ref: refCallback,
          bottom: bottomValue,
          zIndex: this._refs.length - index,
          marginBottom: initialRendered ? '0' : '1.5rem',
          opacity: init ? 1 : 0,
          minWidth: minWidth,
          maxWidth: maxWidth
        };
      };
      return React.cloneElement(e, makeAdditionalProps(index));
    });

    return <StyledDiv {...this.props}>{clonedElement}</StyledDiv>;
  }

  _setRefs(index) {
    const i = index;
    return el => {
      this._refs[i] = el;
    };
  }
}

CardDeck.propTypes = {
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number
};

const StyledDiv = styled.div`
  position: relative;
  margin: auto;
  margin-top: ${props => (props.init ? '12vh' : '10vh')};
  margin-bottom: 10vh;
  ${props => props.withStyle};
`;

export default CardDeck;
