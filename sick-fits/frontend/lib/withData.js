import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';

function createClient() {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    credentials: 'include',
    clientState: {
      defaults: {
        cartOpen: false,
      },
      resolvers: {
        Mutation: {
          toggleCart: (_, args, { cache }) => {
            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY,
            });

            const data = {
              cartOpen: !cartOpen,
            };

            cache.writeQuery({
              query: LOCAL_STATE_QUERY,
              data,
            });

            return data;
          },
        },
      },
    },
  });
}

export default withApollo(createClient, {
  getDataFromTree: 'ssr',
});
