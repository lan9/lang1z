import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { throttle } from 'lodash';
import Transition from 'react-transition-group/Transition';

class CardDeck extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this._setRef = this._setRef.bind(this);
    this._setCardRefs = this._setCardRefs.bind(this);
    this._calcBottoms = this._calcBottoms.bind(this);
    this._generateCardWidth = this._generateCardWidth.bind(this);
    this._setActiveIndex = this._setActiveIndex.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._getAdjustedSwipeOffset = this._getAdjustedSwipeOffset.bind(this);
    this._getParentHeight = this._getParentHeight.bind(this);
    this._updateCardPosition = throttle(this._updateCardPosition.bind(this), 30);
    this.updateParentHeight = this.updateParentHeight.bind(this);

    this._cardRefs = [];
    this._cardHeights = [];
    this._lastSwipeChangeY = undefined;

    this.state = {
      bottoms: [],
      initialRendered: false,
      activeIndex: this.props.initialActiveIndex,
      hoveredCards: new Set([]),
      swipeOffset: 0
    };
  }

  componentDidMount() {
    this._cardRefs.forEach(ref => {
      this._cardHeights.push(ReactDOM.findDOMNode(ref).clientHeight);
    });
    this.setState({ initialRendered: true, parentHeight: this._getParentHeight() });
  }

  _getParentHeight() {
    return ReactDOM.findDOMNode(this._ref).getBoundingClientRect().height;
  }

  updateParentHeight() {
    this.setState({ parentHeight: this._getParentHeight() });
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
    const { hoveredCards, parentHeight } = this.state;

    const numOfCards = this._cardHeights.length;
    const result = [];
    let activeCardBottom = 0;

    for (let i = 0; i < activeIndex; i++) {
      activeCardBottom += this._cardHeights[i];
    }

    result[activeIndex] = activeCardBottom;

    for (let i = 0; i < activeIndex; i++) {
      // these cards are above view port
      result[i] = parentHeight + 100;
    }

    if (activeIndex - 1 >= 0) {
      // this card that sticks out of the top of the parent component
      result[activeIndex - 1] = parentHeight - 30;
    }

    result[activeIndex] = parentHeight - topPadding - this._cardHeights[activeIndex];

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
    const { activeIndex, initialRendered, hoveredCards, swipeOffset } = this.state;

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
      <Container
        {...this.props}
        swipeOffset={-1 * swipeOffset}
        onTouchStart={e => {
          this._lastSwipeChangeY = e.touches[0].screenY;
        }}
        onTouchMove={this._onTouchMove}
        onTouchEnd={() => {
          this._lastSwipeChangeY = undefined;
          this.setState({ swipeOffset: 0 });
        }}
      >
        <StyledDiv {...this.props} ref={this._setRef}>
          {clonedElement}
        </StyledDiv>
      </Container>
    );
  }

  _onTouchMove(e) {
    const newScreenY = e.changedTouches[0] && e.changedTouches[0].screenY;
    this._updateCardPosition(newScreenY)
  }

  _updateCardPosition(newScreenY) {

    const { children } = this.props;
    const { activeIndex } = this.state;

    const cardNum = children.length;
    const cardScrollThreshold = window.innerHeight / cardNum / 3;

    if (newScreenY !== undefined) {
      const delta = this._lastSwipeChangeY !== undefined ? this._lastSwipeChangeY - newScreenY : 0;
      if (Math.abs(delta) > cardScrollThreshold) {
        let newActiveIndex = undefined;
        if (delta > 0) {
          newActiveIndex = activeIndex + 1 > cardNum - 1 ? activeIndex : activeIndex + 1;
        } else {
          newActiveIndex = activeIndex - 1 < 0 ? 0 : activeIndex - 1;
        }
        this.setState({ activeIndex: newActiveIndex });
        this._lastSwipeChangeY = newScreenY;
      } else {
        const swipeOffset = this._getAdjustedSwipeOffset(delta);
        this.setState({ swipeOffset });
      }
    }
  }

  _getAdjustedSwipeOffset(delta) {
    const symbol = delta < 0 ? -1 : 1;
    return symbol * (delta === 0 ? 0 : Math.log(Math.abs(delta)) * 10);
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

const Container = styled.div`
  position: relative;
  margin: auto;
  // maxWidth is the width of Card. So need to include padding here.
  max-width: ${props => `${props.maxWidth + props.padding * 2}px`};
  min-width: ${props => `${props.minWidth + props.padding * 2}px`};
  top: ${props => `${props.swipeOffset}px`};
  transition: top 0.5s;
`;
const StyledDiv = styled.div`
  position: relative;
  margin: auto;
  margin-bottom: 10vh;
  height: 100vh;
  margin: 10px;
`;

export default CardDeck;
