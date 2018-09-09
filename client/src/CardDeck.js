import styled from 'styled-components';
import React from "react";
import PropTypes from "prop-types";

class CardDeck extends React.PureComponent {
    render() {
        return <StyledDiv {...this.props} />;
    }
}

CardDeck.propTypes = {
    init: PropTypes.bool,
    withStyle: PropTypes.string
};

const StyledDiv = styled.div`
  position: relative;
  margin: auto;
  margin-top: ${props => (props.init ? '12vh' : '10vh')};
  margin-bottom: 10vh;
  ${props => props.withStyle};
`;

export default StyledDiv;