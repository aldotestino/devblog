import { Box, Flex, Spacer, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {

  const bgColor = useColorModeValue('gray.50', 'inherit');

  return (
    <Flex minH="100vh" direction="column" bg={bgColor}>
      <Navbar />
      <Box px={['2', '4', '16']} py={['16', '16', '20']}>
        {children}
      </Box>
      <Spacer />
      <Footer />
    </Flex>
  );
}

export default Layout;
