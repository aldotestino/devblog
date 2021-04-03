import { Flex, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import React from 'react';

function Footer() {
  return (
    <Flex h={['24', '24']} justify="space-between" px={['2', '16']} align="center" bg="gray.800" color="white">
      <Text fontSize="md">Aldo Testino © {new Date().getFullYear()}</Text>
      <a href="https://github.com/aldotestino">
        <FontAwesomeIcon size="2x" icon={faGithub} />
      </a>
    </Flex>
  );
}

export default Footer;
