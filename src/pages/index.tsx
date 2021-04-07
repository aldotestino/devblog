import Head from 'next/head';
import Link from 'next/link';
import { Text, Heading, Box, Stack, Button } from '@chakra-ui/react';
import React from 'react';

function Home() {
  return (
    <>
      <Head>
        <title>devBlog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <Box textAlign={['center', 'center', 'left']}>
        <Heading fontSize="6xl" w="auto">
          <Box bgGradient="linear(to-l, #7928CA, #FF0080)" bgClip="text">
            The Blog for Developers
          </Box>
        </Heading>
        <Text fontSize="2xl" maxW="xl">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus excepturi exercitationem repellat beatae animi minima odit molestiae fugit ducimus dignissimos?
        </Text>
        <Stack spacing="4" direction="row" mt="4" justify={['center', 'center', 'flex-start']}> 
          <Link href="/signup" passHref>        
            <Button colorScheme="blue" as="a" size="lg">     
                  Sign up
            </Button>
          </Link>
          <Button as="a" target="blank" href="https://github.com/aldotestino/devblog" size="lg">
              Follow on GitHub
          </Button>
        </Stack>
      </Box>
    </>
  );
}

export default Home;
