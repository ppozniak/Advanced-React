import App from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import Page from '../components/Page';
import withData from '../lib/withData';

class CustomApp extends App {
  render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <ApolloProvider client={apollo}>
        <Page>
          <Component {...pageProps} />
        </Page>
      </ApolloProvider>
    );
  }
}

export default withData(CustomApp);
