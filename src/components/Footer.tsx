import { Flex } from '@chakra-ui/react';

function Footer() {
  return (
    <Flex h={['24', '24']} px={['2', '16']} align="center" bg="gray.800" color="white">
      Aldo Testino © {new Date().getFullYear()}
    </Flex>
  );
}

export default Footer;
