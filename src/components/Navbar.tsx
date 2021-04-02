import { ChevronDownIcon } from '@chakra-ui/icons';
import { Stack, Flex, Heading, Button, Menu, MenuItem, MenuButton, MenuList, MenuDivider, Avatar, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '../store/User';

function Navbar() {

  const { user, isAuth, logout } = useAuth();

  return (
    <Flex h={['16', '20']} px={['2', '16']} bg="whiteAlpha.700" style={{ backdropFilter: 'blur(4px)' }} align="center" position="sticky" top="0" zIndex="10" justify="space-between">
      <Heading size="lg">
        <Link href="/">
          devBlog
        </Link>
      </Heading>
      {!isAuth ? <Link href="/login">
        <Button colorScheme="blue" variant="outline">
          Login
        </Button>
      </Link> : 
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Account
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Stack spacing="2" direction="row">
                <Avatar src={user.avatar} name={[user.name, user.surname].join(' ')} />
                <Text>Signed in as<br/>@{user.username}</Text>
              </Stack>
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      }
    </Flex>
  );
}

export default Navbar;
