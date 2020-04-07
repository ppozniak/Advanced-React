import styled from 'styled-components';

const SickButton = styled.button`
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  background: ${props => props.theme.black};
  color: white;
  font-weight: 500;
  border: 0;
  border-radius: 0;
  text-transform: uppercase;
  font-size: 1.9rem;
  padding: 0.9rem 1.5rem;
  display: inline-block;
  transition: all 0.2s;
  text-decoration: none;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.blue};
  }
  &[disabled] {
    opacity: 0.5;
  }
`;

export default SickButton;
