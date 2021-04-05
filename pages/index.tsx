import Head from 'next/head';
import Link from 'next/link';
import { Flex, Heading, Box, Stack, Button, Img, LinkOverlay } from '@chakra-ui/react';
import React from 'react';

function Home() {
  return (
    <>
      <Head>
        <title>devBlog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex justify="space-between" direction={['column', 'column', 'row']}>
        <Box textAlign={['center', 'center', 'left']}>
          <Heading fontSize="6xl" bgGradient="linear(to-l, #7928CA,#FF0080)" bgClip="text">
            The Blog for Developers
          </Heading>
          <Stack spacing="4" direction="row" mt="8" justify={['center', 'center', 'flex-start']}>            
            <Button colorScheme="blue" size="lg">
              <Link href="/signup" passHref>
                <LinkOverlay>
                  Sign up
                </LinkOverlay>
              </Link>
            </Button>      
            <Button as="a" target="blank" href="https://github.com/aldotestino/devblog" size="lg">
              Follow on GitHub
            </Button>
          </Stack>
        </Box>
        <Flex align="center" justify="center" flex="1" mt={['10', '10', '0']}>
          <Img width={['80%', '80%', '50%']} mb={['4', '4', '0']} src="/homeImage.svg" />
        </Flex>
      </Flex>
    </>
  );
}

export default Home;
