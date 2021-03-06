import styled, { keyframes } from 'styled-components';
import { useState } from 'react';

export const Field = ({
  name,
  type = 'text',
  onChange = () => {},
  value,
  required = false,
  label = '',
  ...rest
}) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <Label name={name} label={label}>
    <input
      onChange={onChange}
      type={type}
      name={name}
      value={value}
      required={required}
      {...rest}
    />
  </Label>
);

const Label = ({ children, label, name }) => (
  <label>
    {label.toUpperCase() || name.toUpperCase()}
    {children}
  </label>
);

Field.Label = Label;

export const useForm = (defaultState = {}) => {
  const [inputs, setInputs] = useState(defaultState);

  const handleChange = ({ target: { name, value, type, files } }) => {
    let formattedValue = value;

    if (type === 'file') {
      [formattedValue] = files;
    } else if (type === 'number' && value) {
      formattedValue = parseFloat(value);
    }

    setInputs({ ...inputs, [name]: formattedValue });
  };

  return { inputs, handleChange, setInputs };
};

const loading = keyframes`
  from {
    background-position: 0 0;
    /* rotate: 0; */
  }

  to {
    background-position: 100% 100%;
    /* rotate: 360deg; */
  }
`;

export const Form = styled.form`
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.02);
  border: 5px solid white;
  padding: 20px;
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: 600;
  label {
    display: block;
    margin-bottom: 1rem;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid black;
    &:focus {
      outline: 0;
      border-color: ${props => props.theme.red};
    }
  }
  button[type='submit'],
  input[type='submit'] {
    width: auto;
    background: red;
    color: white;
    border: 0;
    font-size: 2rem;
    font-weight: 600;
    padding: 0.5rem 1.2rem;
  }
  fieldset {
    border: 0;
    padding: 0;

    &[disabled] {
      opacity: 0.5;
    }
    &::before {
      height: 10px;
      content: '';
      display: block;
      background-image: linear-gradient(to right, #ff3019 0%, #e2b04a 50%, #ff3019 100%);
    }
    &[aria-busy='true']::before {
      background-size: 50% auto;
      animation: ${loading} 0.5s linear infinite;
    }
  }
`;
