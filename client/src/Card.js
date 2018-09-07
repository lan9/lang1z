import styled from 'styled-components';

export default styled.div`
  position: absolute;
  color: ${props => props.theme.textColor};
  opacity: ${props => (props.init ? '0' : '1')};
  transition: 0.5s 0.3s;
  height: 200px;
  width: 100%;
  top: ${props => (props.top === undefined ? 0 : props.top)};
  opacity: ${props => (props.opacity === undefined ? 1 : props.opacity)};
  background-color: ${props => props.theme.bgColor};
  border-radius: 1.5rem;
  padding: 50px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;
