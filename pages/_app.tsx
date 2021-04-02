import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../src/utils/apolloConfig';
import Layout from '../src/components/Layout';
import { AuthProvider } from '../src/store/User';

// eslint-disable-next-line react/prop-types
function App({ Component, pageProps }) {

  // eslint-disable-next-line react/prop-types
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ChakraProvider resetCSS>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </ApolloProvider>
    </ChakraProvider>
  );
}

export default App;
