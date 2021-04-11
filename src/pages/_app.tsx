import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../utils/apolloConfig';
import Layout from '../components/Layout';
import { AuthProvider } from '../store/User';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import '../styles/nprogress.css';
import 'github-markdown-css';
import { theme } from '../styles/theme';

NProgress.configure({ showSpinner: false });

// eslint-disable-next-line react/prop-types
function App({ Component, pageProps }) {

  // eslint-disable-next-line react/prop-types
  const client = useApollo(pageProps.initialApolloState);

  const router = useRouter();

  useEffect(() => {
    const routeChangeStart = () => NProgress.start();
    const routeChangeComplete = () => NProgress.done();

    router.events.on('routeChangeStart', routeChangeStart);
    router.events.on('routeChangeComplete', routeChangeComplete);
    router.events.on('routeChangeError', routeChangeComplete);
    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
      router.events.off('routeChangeComplete', routeChangeComplete);
      router.events.off('routeChangeError', routeChangeComplete);
    };
  }, []);

  return (
    <ChakraProvider resetCSS theme={theme}>
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
