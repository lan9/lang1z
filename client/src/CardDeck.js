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
    this._setActiveIndex = this._setActiveIndex.bind(this);

    this._cardRefs = [];
    this._cardHeights = [];
    this._parentHeight = undefined;

    this.state = {
      bottoms: [],
      initialRendered: false,
      activeIndex: this.props.initialActiveIndex,
      hoveredCards: new Set([])
    };
  }

  componentDidMount() {
    this._cardRefs.forEach(ref => {
      this._cardHeights.push(ReactDOM.findDOMNode(ref).clientHeight);
    });

    this._parentHeight = ReactDOM.findDOMNode(this._ref).getBoundingClientRect().height;

    this.setState({ initialRendered: true });
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
    const { topPadding, stackOffset, stackHoverOffset } = this.props;
    const { hoveredCards } = this.state;

    const numOfCards = this._cardHeights.length;
    const result = [];
    let activeCardBottom = 0;

    for (let i = 0; i < activeIndex; i++) {
      activeCardBottom += this._cardHeights[i];
    }

    result[activeIndex] = activeCardBottom;

    for (let i = 0; i < activeIndex; i++) {
      // these cards are above view port
      result[i] = this._parentHeight + 100;
    }

    if (activeIndex - 1 >= 0) {
      // this card that sticks out of the top of the parent component
      result[activeIndex - 1] = this._parentHeight - 30;
    }

    result[activeIndex] = this._parentHeight - topPadding - this._cardHeights[activeIndex];

    const shouldUseHoverOffset = Array.from(hoveredCards).filter(v => v > activeIndex).length > 0;
    for (let i = activeIndex + 1; i < numOfCards; i++) {
      result[i] = result[i - 1] - (shouldUseHoverOffset ? stackHoverOffset : stackOffset);
    }

    return result;
  }

  _generateCardWidth(width, positionAfterActiveCard) {
    return positionAfterActiveCard > 0 ? width * (1 - 0.03 * (positionAfterActiveCard || 0)) : width;
  }

  _setActiveIndex(index) {
    this.setState({ activeIndex: index });
  }

  _renderContent(init) {
    const { children, minWidth, maxWidth, initialActiveIndex } = this.props;
    const { activeIndex, initialRendered, hoveredCards } = this.state;

    const bottoms = this._calcBottoms(activeIndex);
    const clonedElement = children
      .map((e, index) => {
        const makeAdditionalProps = index => {
          const refCallback = this._setCardRefs(index);
          const bottomValue = bottoms[index] || 0;
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
            position: 'absolute',
            onClick: () => {
              this._setActiveIndex(index === activeIndex - 1 ? initialActiveIndex : index);
            },
            onMouseOver: () => {
              const clonedSet = new Set(hoveredCards);
              clonedSet.add(index);
              this.setState({ hoveredCards: clonedSet });
            },
            onMouseLeave: () => {
              const clonedSet = new Set(hoveredCards);
              clonedSet.delete(index);
              this.setState({ hoveredCards: clonedSet });
            }
          };
        };
        return React.cloneElement(e, makeAdditionalProps(index));
      })
      .filter(e => !!e);
    return (
      <StyledDiv {...this.props} ref={this._setRef}>
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
  maxWidth: PropTypes.number,
  topPadding: PropTypes.number,
  stackOffset: PropTypes.number,
  stackHoverOffset: PropTypes.number
};

CardDeck.defaultProps = {
  topPadding: 100,
  stackOffset: 10,
  stackHoverOffset: 30,
  padding: 50
};

const StyledDiv = styled.div`
  position: relative;
  margin: auto;
  margin-bottom: 10vh;
  height: 100vh;
  // maxWidth is the width of Card. So need to include padding here.
  max-width: ${props => `${props.maxWidth + props.padding * 2}px`};
  min-width: ${props => `${props.minWidth + props.padding * 2}px`};
  margin: 10px;
`;

export default CardDeck;
