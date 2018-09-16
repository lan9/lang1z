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

    this._cardRefs = [];
    this._cardHeights = [];
    this._firstCardRelativeTop = undefined;

    this.state = {
      bottoms: [],
      initialRendered: false,
      activeIndex: 0
    };
  }

  componentDidMount() {
    this._cardRefs.forEach(ref => {
      this._cardHeights.push(ReactDOM.findDOMNode(ref).clientHeight);
    });

    const firstCardTop = ReactDOM.findDOMNode(this._cardRefs[0]).getBoundingClientRect().top;
    const parentTop = ReactDOM.findDOMNode(this._ref).getBoundingClientRect().top;
    this._firstCardRelativeTop = firstCardTop - parentTop;

    this.setState({ initialRendered: true, bottoms: this._calcBottoms(0) });
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

    for (let i = activeIndex; i < result.length - 1; i++) {
      result[i + 1] += result[i];
    }

    let numOfCardBelowActiveCard = result.length - activeIndex - 1;

    console.log({ numOfCardBelowActiveCard, result });

    for (let i = 0; i < numOfCardBelowActiveCard; i++) {
      const cardIndex = activeIndex + i + 1;
      result[cardIndex] = result[cardIndex] - 10 * i;
    }

    if (activeIndex - 1 >= 0) {
      result[activeIndex - 1] = this._firstCardRelativeTop + this._cardHeights[activeIndex - 1] - 30;
    }

    console.log({ result });
    return result;
  }
  _renderContent(init) {
    const { children, minWidth, maxWidth } = this.props;
    const { initialRendered, bottoms } = this.state;
    const clonedElement = children.map((e, index) => {
      const makeAdditionalProps = index => {
        const refCallback = this._setCardRefs(index);
        const bottomValue = (bottoms[index] || 0).toString() + 'px';
        return {
          id: index,
          key: 'card_' + index.toString(),
          ref: refCallback,
          bottom: bottomValue,
          zIndex: this._cardRefs.length - index,
          marginBottom: initialRendered ? '0' : '1.5rem',
          opacity: init ? 1 : 0,
          minWidth: minWidth,
          maxWidth: maxWidth
        };
      };
      return React.cloneElement(e, makeAdditionalProps(index));
    });

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
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number
};

const StyledDiv = styled.div`
  position: relative;
  margin: auto;
  margin-bottom: 10vh;
  ${props => props.withStyle};
`;

const TopBlock = styled.div`
  position: relative;
  margin: auto;
  height: 10vh;
`;

export default CardDeck;
