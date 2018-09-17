import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Transition from 'react-transition-group/Transition';

class CardDeck extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this._setRef = this._setRef.bind(this);
    this._setCardRefs = this._setCardRefs.bind(this);
    this._calcBottoms = this._calcBottoms.bind(this);
    this._generateCardWidth = this._generateCardWidth.bind(this);

    this._cardRefs = [];
    this._cardHeights = [];
    this._parentHeight = undefined;

    this.state = {
      bottoms: [],
      initialRendered: false,
      activeIndex: this.props.initialActiveIndex
    };
  }

  componentDidMount() {
    const { activeIndex } = this.state;
    this._cardRefs.forEach(ref => {
      this._cardHeights.push(ReactDOM.findDOMNode(ref).clientHeight);
    });

    this._parentHeight = ReactDOM.findDOMNode(this._ref).getBoundingClientRect().height;

    this.setState({ initialRendered: true, bottoms: this._calcBottoms(activeIndex) });
  }

  componentWillUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      this.setState({ bottoms: this._calcBottoms() });
    }
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

  _setRef(ref) {
    this._ref = ref;
  }
  _calcBottoms(activeIndex) {
    const result = this._cardHeights.slice(0);

    let activeCardBottom = 0;

    for (let i = 0; i < activeIndex; i++) {
      activeCardBottom += this._cardHeights[i];
    }

    result[activeIndex] = activeCardBottom;

    console.log('parentHeight = ' + this._parentHeight);
    for (let i = 0; i < activeIndex; i++) {
      // these cards are 'absolute' positioned
      result[i] = this._parentHeight;
    }

    if (activeIndex - 1 >= 0) {
      // this card, is 'absolute' position, that sticks out of the top of the parent component
      result[activeIndex - 1] = this._parentHeight - 30;
    }

    for (let i = activeIndex + 1; i < result.length - 1; i++) {
      // these card are 'relative' positioned
      result[i + 1] += result[i];
    }

    let numOfCardBelowActiveCard = result.length - activeIndex - 1;

    console.log({ numOfCardBelowActiveCard, result });

    for (let i = 0; i < numOfCardBelowActiveCard; i++) {
      const cardIndex = activeIndex + i + 1;
      result[cardIndex] = result[cardIndex] - 10 * (i + 1);
    }

    console.log({ result });
    return result;
  }

  _generateCardWidth(width, positionAfterActiveCard) {
    return positionAfterActiveCard > 0 ? width * (1 - 0.03 * (positionAfterActiveCard || 0)) : width;
  }

  _renderContent(init) {
    const { children, minWidth, maxWidth } = this.props;
    const { activeIndex, initialRendered, bottoms } = this.state;
    const clonedElement = children
      .map((e, index) => {
        const makeAdditionalProps = index => {
          const refCallback = this._setCardRefs(index);
          const bottomValue = (bottoms[index] || 0).toString() + 'px';
          const cardAboveActiveCard = index < activeIndex;
          return {
            id: index,
            key: 'card_' + index.toString(),
            ref: refCallback,
            bottom: bottomValue,
            zIndex: this._cardRefs.length - index,
            marginBottom: initialRendered ? '0' : '1.5rem',
            opacity: init ? 1 : 0,
            minWidth: this._generateCardWidth(minWidth, index - activeIndex),
            maxWidth: this._generateCardWidth(maxWidth, index - activeIndex),
            position: cardAboveActiveCard ? 'absolute' : 'relative'
          };
        };
        return React.cloneElement(e, makeAdditionalProps(index));
      })
      .filter(e => !!e);
    return (
      <StyledDiv {...this.props} ref={this._setRef}>
        <TopBlock />
        {clonedElement}
      </StyledDiv>
    );
  }

  _setCardRefs(index) {
    const i = index;
    return el => {
      this._cardRefs[i] = el;
    };
  }
}

CardDeck.propTypes = {
  initialActiveIndex: PropTypes.number,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number
};

const StyledDiv = styled.div`
  position: relative;
  margin: auto;
  margin-bottom: 10vh;
  height: 100vh;
`;

const TopBlock = styled.div`
  position: relative;
  margin: auto;
  height: 10vh;
`;

export default CardDeck;
