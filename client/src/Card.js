import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';

class Card extends React.PureComponent {
  render() {
    const { children, bottomBarContent } = this.props;
    return (
      <Content {...this.props}>
        {children}
        {bottomBarContent ? <BottomBar>{bottomBarContent}</BottomBar> : null}
      </Content>
    );
  }
}

Card.propTypes = {
  bottomBarContent: PropTypes.object,
  bottom: PropTypes.string,
  id: PropTypes.number,
  init: PropTypes.bool,
  top: PropTypes.string,
  opacity: PropTypes.number,
  textColor: PropTypes.string,
  bgColor: PropTypes.string,
  zIndex: PropTypes.number,
  marginBottom: PropTypes.string,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number
};
const Content = styled.div`
  bottom: ${props => (props.bottom === undefined ? 0 : props.bottom)};
  margin-bottom: ${props => (props.marginBottom === undefined ? '1.5rem' : props.marginBottom)};
  left: 50%;
  position: relative;
  color: ${props => props.theme.textColor};
  transform: translate(-50%);
  transition: 0.5s 0.3s;
  min-width: ${props => `${(props.minWidth || 100) * (1 - 0.03 * (props.id || 0))}px`};
  max-width: ${props => `${(props.maxWidth || 500) * (1 - 0.03 * (props.id || 0))}px`};
  opacity: ${props => (props.opacity === undefined ? 1 : props.opacity)};
  background-color: ${props => props.theme.bgColor};
  border-radius: 1.5rem;
  padding: 50px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  z-index: ${props => (props.zIndex === undefined ? 0 : props.zIndex)};
  };
`;

const BottomBar = styled.div`
  margin-top: 2rem;
`;

export default Card;
