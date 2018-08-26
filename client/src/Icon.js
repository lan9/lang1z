import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const NightmodeSpan = styled.span`
  cursor: pointer;
  float: right;
`;

const Span = styled.span``;

class Icon extends React.PureComponent {

    constructor(props, context) {
        super(props, context);
        this.render = this.render.bind(this);
    }

    render() {
        const Element = this.props.nightmode ? NightmodeSpan : Span;
        return <Element onClick={this.props.onClick}>
            {this.props.url ? <span className="App-icon">
          <a target="_blank" rel="noopener noreferrer" href={this.props.url}><img src={this.props.logo}/></a>
        </span> : <img src={this.props.logo}/>}
        </Element>
    }
}

Icon.propTypes = {
    nightmode: PropTypes.bool,
    onClick: PropTypes.func,
    logo: PropTypes.string,
    url: PropTypes.string
}

export default Icon;