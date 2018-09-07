import styled from 'styled-components';

export default styled.div`
  position: relative;
  margin: auto;
  margin-top: ${props => (props.init ? '12vh' : '10vh')};
  margin-bottom: 10vh;
  min-width: 200px;
  max-width: 400px;
`;
