import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { FiSend } from 'react-icons/fi';

import {
  Flex,
  Box,
  Text,
  Textarea,
  Button,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/core';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import isUuid from 'is-uuid';
import io from 'socket.io-client';

import MessageBox from '@/components/MessageBox';
import SetUsernameForLiveTelespectors from '@/components/Modals/SetUsernameForLiveTelespectors';
import SEO from '@/components/SEO';
import Title from '@/components/Title';
import api from '@/services/api';

interface IMessage {
  sender: string;
  content: string;
  channel: string;
}

// eslint-disable-next-line
interface Deceased {
  id?: string;
  name?: string;
  live_chat_link?: string;
  funeral_initial_date?: string;
  funeral_final_date?: string;
  sepulting_date?: string;
  funeral?: {
    name?: string;
    cemetery?: {
      name?: string;
    };
  };
}

const Live: React.FC = () => {
  const router = useRouter();

  const [deceased, setDeceased] = useState<Deceased>({} as Deceased);
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([] as IMessage[]);

  const {
    isOpen: isGetUsernameModalOpen,
    onOpen: onOpenGetUsernameModal,
    onClose: onCloseGetUsernameModal,
  } = useDisclosure();

  useEffect(() => {
    const queryId = router.query.id as string;

    if (queryId === undefined) {
      return;
    }

    if (!queryId.length || !isUuid.v4(queryId)) {
      router.replace('/login');
      return;
    }

    onOpenGetUsernameModal();

    api.get(`deceaseds/${queryId}`).then(response => {
      setDeceased(response.data);
    });
  }, [router.query.id]);

  const onSaveUsername = useCallback(
    (name: string) => {
      setUsername(name);

      onCloseGetUsernameModal();

      const socket = io(process.env.NEXT_PUBLIC_API_URL, {
        query: { username: name },
      });

      socket.emit('join', deceased.id);

      socket.on('new', (msg: IMessage) => {
        setMessages(state => [...state, msg]);
      });
    },
    [deceased],
  );

  const handleSubmitMessage = useCallback(async () => {
    setMessage('');

    const messageData = {
      sender: username,
      content: message,
      channel: deceased.id,
    };

    await api.post('/messages', messageData);
  }, [message, username, deceased]);

  return (
    <>
      <SEO
        title="Endor"
        image="og/boost.png"
        shouldExcludeTitleSuffix
        description="Fazer login na plataforma"
      />

      <SetUsernameForLiveTelespectors
        onSave={onSaveUsername}
        isOpen={isGetUsernameModalOpen}
        onClose={onCloseGetUsernameModal}
      />

      <Box
        display="grid"
        gridTemplateColumns="75% 25%"
        as="main"
        height="100vh"
        width="100%"
        paddingX={6}
        backgroundColor="gray.900"
        paddingTop={8}
        paddingBottom={8}
        paddingRight={8}
      >
        <Flex direction="column" marginRight={8}>
          <iframe
            src={deceased.live_chat_link}
            frameBorder="0"
            title={deceased.id}
            style={{ width: '100%', height: '75%' }}
          ></iframe>
          <Flex
            backgroundColor="gray.800"
            marginTop={8}
            paddingTop={6}
            paddingRight={6}
            paddingLeft={6}
            paddingBottom={6}
            borderRadius="md"
            width="100%"
            height="25%"
          >
            <Box width="100%" color="gray.200">
              <Title css={{ color: 'gray.200' }}>{deceased.name}</Title>
              <Text fontSize="xl">{deceased?.funeral?.name}</Text>
              {deceased.funeral_final_date &&
                deceased.funeral_initial_date &&
                deceased.sepulting_date && (
                  <>
                    <Flex>
                      <Text fontSize="xl">
                        {format(
                          new Date(deceased.funeral_initial_date),
                          "'Velório: 'dd'/'MM'/'yyyy 'das' HH:mm",
                          { locale: ptBR },
                        )}
                        {' às '}
                        {format(
                          new Date(deceased.funeral_final_date),
                          'HH:mm',
                          {
                            locale: ptBR,
                          },
                        )}
                      </Text>
                    </Flex>
                    <Flex>
                      <Text fontSize="xl">
                        {format(
                          new Date(deceased.sepulting_date),
                          "'Sepultamento: 'dd'/'MM'/'yyyy 'às' HH:mm",
                          { locale: ptBR },
                        )}
                      </Text>
                    </Flex>
                  </>
                )}
            </Box>
          </Flex>
        </Flex>
        <Flex
          direction="column"
          backgroundColor="gray.800"
          borderRadius="md"
          width="100%"
          height="100%"
          padding={6}
        >
          <Box width="100%" color="gray.200">
            <Title css={{ color: 'gray.200' }}>Chat</Title>
          </Box>
          <Flex
            direction="column"
            width="100%"
            height="88%"
            overflowY="auto"
            borderBottom="2px solid #fff"
          >
            {messages.map(actualMessage => (
              <MessageBox
                username={actualMessage.sender}
                message={actualMessage.content}
              />
            ))}
          </Flex>
          <Flex width="100%" height="12%" paddingTop={2}>
            <Textarea
              onChange={e => setMessage(e.target.value)}
              value={message}
              placeholder="Digite sua mensagem"
              color="White"
              width="86%"
              border={0}
              minHeight={2}
              height="100%"
              resize="none"
              borderRadius="8px 0 0 8px"
              backgroundColor="gray.700"
            />
            <Tooltip label="Enviar mensagem" aria-label="Enviar mensagem">
              <Button
                onClick={handleSubmitMessage}
                width="14%"
                height="100%"
                backgroundColor="gray.700"
                borderRadius="0 8px 8px 0"
                alignItems="center"
                justifyContent="center"
                _hover={{
                  backgroundColor: 'gray.900',
                }}
              >
                <FiSend color="White" size={20} />
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Live;
