import { Flex, Heading, Button } from '@chakra-ui/react';
import Link from 'next/link';

function Navbar() {
  return (
    <Flex h={['16', '20']} px={['2', '16']} align="center" justify="space-between">
      <Heading size="lg">
        <Link href="/">
          devBlog
        </Link>
      </Heading>
      <Link href="/login">
        <Button colorScheme="blue" variant="outline">
          Login
        </Button>
      </Link>
    </Flex>
  );
}

export default Navbar;
