import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Transition from 'react-transition-group/Transition';

class CardDeck extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this._setRefs = this._setRefs.bind(this);
    this._refs = [];
    this._bottoms = [];
    this.state = {
      initialRendered: false
    };
  }

  componentDidMount() {
    this._refs.forEach(ref => {
      this._bottoms.push(ReactDOM.findDOMNode(ref).clientHeight);
    });
    for (let i = 1; i < this._bottoms.length; i++) {
      for (let j = i + 1; j < this._bottoms.length; j++) {
        this._bottoms[j] += this._bottoms[i];
      }
    }
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
  _renderContent(init) {
    const { children } = this.props;
    const { initialRendered } = this.state;
    const clonedElement = children.map((e, index) => {
      const makeAdditionalProps = index => {
        const refCallback = this._setRefs(index);
        const bottomValue =
          index === 0 || this._bottoms[index] === undefined
            ? '0'
            : Math.floor(this._bottoms[index] * 0.9).toString() + 'px';
        return {
          id: index,
          key: 'card_' + index.toString(),
          ref: refCallback,
          bottom: bottomValue,
          zIndex: this._refs.length - index,
          marginBottom: initialRendered ? '0' : '1.5rem',
          opacity: init ? 1 : 0
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
  init: PropTypes.bool,
  withStyle: PropTypes.array
};

const StyledDiv = styled.div`
  position: relative;
  margin: auto;
  margin-top: ${props => (props.init ? '12vh' : '10vh')};
  margin-bottom: 10vh;
  ${props => props.withStyle};
`;

export default CardDeck;
