import { ChevronDownIcon } from '@chakra-ui/icons';
import { Stack, Flex, Heading, Button, Menu, MenuItem, MenuButton, MenuList, MenuDivider, Avatar, Text, useColorMode, useColorModeValue, Switch } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '../store/User';

function Navbar() {

  const { user, isAuth, logout } = useAuth();
  const { toggleColorMode, colorMode } = useColorMode();
  const theme = useColorModeValue('dark', 'light');

  return (
    <Flex h={['16', '20']} px={['2', '4', '16']} bg={colorMode === 'light' ? 'whiteAlpha.700' : 'grayAlpha.700'} style={{ backdropFilter: 'blur(4px)' }} align="center" position="sticky" top="0" zIndex="10" justify="space-between">
      <Heading size="lg">
        <Link href="/">
          devBlog
        </Link>
      </Heading>
      {!isAuth ?
        <Flex align="center">
          <Switch size="lg" onChange={toggleColorMode} colorScheme="blue" mr="4" />
          <Link href="/login">
            <Button colorScheme="blue" variant="outline">      
            Login
            </Button>
          </Link>
        </Flex> : 
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Account
          </MenuButton>
          <MenuList>
            <Link href={`/@${user.username}`}>
              <MenuItem>       
                <Stack spacing="2" direction="row">
                  <Avatar src={user.avatar} name={user.username} />
                  <Text>Signed in as<br/>@{user.username}</Text>
                </Stack>
              </MenuItem>
            </Link>
            <MenuDivider />
            <MenuItem onClick={toggleColorMode}>   
                Switch to {theme} mode
            </MenuItem>
            <Link href="/posts/create">
              <MenuItem>   
                New Post
              </MenuItem>
            </Link>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      }
    </Flex>
  );
}

export default Navbar;
