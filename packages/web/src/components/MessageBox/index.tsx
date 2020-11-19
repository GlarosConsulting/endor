import React from 'react';

import { Flex } from '@chakra-ui/core';

interface IBoxMessagesProps {
  username: string;
  message: string;
}

const BoxMessages: React.FC<IBoxMessagesProps> = ({ username, message }) => (
  <Flex
    backgroundColor="gray.700"
    position="relative"
    padding="8px 16px"
    borderRadius="md"
    color="White"
    marginBottom={4}
  >
    <p style={{ wordBreak: 'break-word' }}>
      <span>
        <strong>{username}: </strong>
      </span>
      {message}
    </p>
  </Flex>
);

export default BoxMessages;
