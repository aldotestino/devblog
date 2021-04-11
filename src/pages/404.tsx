import { Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import Error from '../svg/ErrorImage';
import React from 'react';

function ErrorPage() {
  return (
    <Flex align="center" justify="center" h="lg">
      <Stack direction="column" spacing="10" align="center">
        <Error w={['md', 'md', 'lg']}/>
        <Flex align="center">
          <Heading fontStyle="italic">404</Heading> 
          <Divider h="40px" mx="2" size="lg" orientation="vertical" />
          <Text>This page couldn't be found</Text>
        </Flex>
      </Stack>
    </Flex>
  );
}

export default ErrorPage;