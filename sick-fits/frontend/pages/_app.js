import App from 'next/app';
import { ApolloProvider } from '@apollo/react-components';
import Page from '../components/Page';
import withData from '../lib/withData';

class CustomApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    pageProps.query = ctx.query;
    return pageProps;
  }

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
