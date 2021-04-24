import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../utils/apolloConfig';
import Layout from '../components/Layout';
import { AuthProvider } from '../store/Auth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import '../styles/nprogress.css';
import 'github-markdown-css';
import { theme } from '../styles/theme';
import { AppProps } from 'next/dist/next-server/lib/router/router';

NProgress.configure({ showSpinner: false });

function App({ Component, pageProps }: AppProps) {

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
