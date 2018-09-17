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
  bottom: PropTypes.number,
  id: PropTypes.number,
  init: PropTypes.bool,
  top: PropTypes.string,
  opacity: PropTypes.number,
  textColor: PropTypes.string,
  bgColor: PropTypes.string,
  zIndex: PropTypes.number,
  marginBottom: PropTypes.string,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  position: PropTypes.string,
  padding: PropTypes.number
};

Card.defaultProps = {
  minWidth: 100,
  maxWidth: 500,
  padding: 50,
  position: 'relative',
  marginBottom: '20',
  bottom: 0,
  opacity: 1,
  zIndex: 0
};
const Content = styled.div`
  bottom: ${props => `${props.bottom}px`};
  margin-bottom: ${props => `${props.marginBottom}px`};
  width: 100%;
  left: 50%;
  position: ${props => props.position};
  color: ${props => props.theme.textColor};
  transform: translate(-50%);
  transition: 0.5s 0.3s;
  min-width: ${props => `${props.minWidth}px`};
  max-width: ${props => `${props.maxWidth}px`};
  min-height: 150px;
  opacity: ${props => props.opacity};
  background-color: ${props => props.theme.bgColor};
  border-radius: 1.5rem;
  padding: 50px;
  box-sizing: border-box;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  z-index: ${props => props.zIndex};
  };
`;

const BottomBar = styled.div`
  margin-top: 2rem;
`;

export default Card;
