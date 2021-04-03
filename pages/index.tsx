import Head from 'next/head';
import Link from 'next/link';
import { Flex, Heading, Box, Stack, Button, Img } from '@chakra-ui/react';

function Home() {
  return (
    <>
      <Head>
        <title>devBlog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex justify="space-between" direction={['column', 'column', 'row']}>
        <Box textAlign={['center', 'center', 'left']}>
          <Heading fontSize="6xl" bgGradient="linear(to-l, #DB00FF, #00A3FF)" bgClip="text">
            Enter in The Biggest
            <br/>
            Technology Blog
          </Heading>
          <Stack spacing="4" direction="row" mt="8" justify={['center', 'center', 'flex-start']}>
            <Link href="/signup">
              <Button colorScheme="blue" size="lg">
                Sign up
              </Button>
            </Link>
            <Button size="lg">
              Recent Posts
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
