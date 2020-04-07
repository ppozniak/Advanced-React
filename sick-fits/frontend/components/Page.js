import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Header from './Header';
import Meta from './Meta';

const theme = {
  red: '#FF0000',
  darkerRed: '#AA2200',
  black: '#131313',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  offWhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
  blue: '#0096ff',
  green: '#00b376',
};

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'radnika_next';
    src: url('/static/radnikanext-medium-webfont.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }

  html {
    box-sizing: border-box;
    font-size: 10px;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    padding: 0;
    margin: 0;
    line-height: 1.5;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 1.5rem;
  }

  p {
    font-size: 1.2rem;
  }

  a {
    text-decoration: underline;
    color: ${theme.blue};
  }
`;

const Page = ({ children }) => (
  <ThemeProvider theme={theme}>
    <>
      <GlobalStyles />
      <StyledPage>
        <Meta />
        <Header />
        <Inner>{children}</Inner>
      </StyledPage>
    </>
  </ThemeProvider>
);

export default Page;
