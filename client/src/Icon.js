import React from 'react';
import styled from 'styled-components';

const NightmodeSpan = styled.span`
  cursor: pointer;
  float: right;
`;

const Span = styled.span``;

export default function Icon(props) {

    const Element = props.nightmode? NightmodeSpan: Span;
    return <Element onClick={props.onClick}>
        {props.url ? <span className="App-icon">
          <a target="_blank" rel="noopener noreferrer" href={props.url}><img src={props.logo}/></a>
        </span> : <img src={props.logo}/>}
    </Element>
}
