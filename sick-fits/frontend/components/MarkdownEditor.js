import React from 'react';
import ReactMarkdown from 'react-markdown';
import ReactMde from 'react-mde';
import styled from 'styled-components';
import { Field } from './Form';

const StyledMarkdownEditor = styled(ReactMde)`
  font-family: inherit;

  .grip {
    display: flex;
    justify-content: center;
  }

  .grip svg {
    display: block;
  }
`;

const MarkdownEditor = ({ value, name, handleChange, activeTab, setActiveTab }) => (
  <Field.Label label="Description">
    <StyledMarkdownEditor
      value={value}
      onChange={value => handleChange({ target: { value, name } })}
      selectedTab={activeTab}
      onTabChange={setActiveTab}
      generateMarkdownPreview={markdown => Promise.resolve(<ReactMarkdown source={markdown} />)}
    />
  </Field.Label>
);

export default MarkdownEditor;
