import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../components/Layout';

// eslint-disable-next-line react/prop-types
function App({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
