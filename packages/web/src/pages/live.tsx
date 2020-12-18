import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { FiSend } from 'react-icons/fi';

import {
  Flex,
  Box,
  Grid,
  Text,
  Textarea,
  Button,
  Tooltip,
  useDisclosure,
  Image,
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
  id: string;
  sender: string;
  content: string;
}

interface IDeceased {
  id?: string;
  name?: string;
  live_chat_link?: string;
  funeral_initial_date?: string;
  funeral_final_date?: string;
  sepulting_date?: string;
  funeral_location?: {
    name?: string;
  };
  sepulting_location?: {
    name?: string;
  };
}

const Live: React.FC = () => {
  const router = useRouter();

  const [deceased, setDeceased] = useState<IDeceased>({} as IDeceased);
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  // const [rightImageFilename, setRightImageFilename] = useState<string>('');
  // const [leftImageFilename, setLeftImageFilename] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([] as IMessage[]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    isOpen: isGetUsernameModalOpen,
    onOpen: onOpenGetUsernameModal,
    onClose: onCloseGetUsernameModal,
  } = useDisclosure();

  const scrollToLastMessage = useCallback((ignoreScrollTopOffset = false) => {
    if (!messagesContainerRef.current) return;

    const { scrollHeight, scrollTop } = messagesContainerRef.current;

    if (!ignoreScrollTopOffset && scrollHeight - scrollTop >= 1000) return;

    messagesContainerRef.current?.scrollTo({
      top: scrollHeight,
    });
  }, []);

  useEffect(() => {
    scrollToLastMessage();
  }, [messages, scrollToLastMessage]);

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

    api.get(`/messages/${queryId}`).then(response => {
      const messagesResponse = response.data;

      setMessages(messagesResponse);
      scrollToLastMessage(true);
    });

    // api.get('images?name=378x372').then(response => {
    //   const { file } = response.data;

    //   setRightImageFilename(file);
    // });

    // api.get('images?name=240x920').then(response => {
    //   const { file } = response.data;

    //   setLeftImageFilename(file);
    // });
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
    const messageData = {
      sender: username,
      content: message,
      channel: deceased.id,
    };

    await api.post('/messages', messageData);

    setMessage('');
  }, [message, username, deceased, scrollToLastMessage]);

  const handleKeyUp = useCallback(
    async e => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        handleSubmitMessage();
      }
    },
    [handleSubmitMessage],
  );

  return (
    <>
      <SEO
        title="Live page"
        image="og/boost.png"
        shouldExcludeTitleSuffix
        description=""
      />

      <Grid
        as="main"
        height="100vh"
        width="100%"
        templateColumns={{ xs: '100%', lg: '15% 65% 20%' }}
        templateRows="100%"
        templateAreas={{ xs: "'video' 'chat' 'ad'", lg: "'ad video chat'" }}
        paddingX={4}
        paddingTop={4}
        paddingBottom={4}
        paddingRight={4}
      >
        <SetUsernameForLiveTelespectors
          onSave={onSaveUsername}
          isOpen={isGetUsernameModalOpen}
          onClose={onCloseGetUsernameModal}
        />

        <Image
          gridArea="ad"
          borderRadius="md"
          marginTop={{ xs: 6, lg: 0 }}
          marginBottom={{ xs: 8, lg: 0 }}
          height={{ xs: 920, lg: '100%' }}
          width={{ xs: '100%' }}
          src="https://drive.google.com/file/d/1xN3cLlRTXlIUQEF5cpOz2x9GAgwh6F3D/view?usp=sharing"
        />
        <Flex
          gridArea="video"
          direction="column"
          marginRight={{ xs: 0, lg: 4 }}
          marginLeft={{ xs: 0, lg: 4 }}
        >
          <iframe
            src={deceased.live_chat_link}
            frameBorder="0"
            title={deceased.id}
            style={{ width: '100%', height: '72%' }}
          ></iframe>
          <Flex
            backgroundColor="gray.800"
            marginTop={4}
            paddingTop={4}
            paddingRight={4}
            paddingLeft={4}
            paddingBottom={4}
            borderRadius="md"
            width="100%"
            height="28%"
          >
            <Box width="100%" color="gray.200" overflowY="auto">
              <Title css={{ color: 'gray.200' }}>{deceased.name}</Title>
              <Text fontSize="lg">{deceased?.funeral_location?.name}</Text>
              {deceased.funeral_final_date &&
                deceased.funeral_initial_date &&
                deceased.sepulting_date && (
                  <>
                    <Flex>
                      <Text fontSize="lg">
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
                      <Text fontSize="lg">
                        {format(
                          new Date(deceased.sepulting_date),
                          "'Sepultamento: 'dd'/'MM'/'yyyy 'às' HH:mm",
                          { locale: ptBR },
                        )}
                        {' no '}
                        {deceased.sepulting_location.name}
                      </Text>
                    </Flex>
                  </>
                )}
            </Box>
          </Flex>
        </Flex>

        <Flex
          gridArea="chat"
          marginTop={{ xs: 4, lg: 0 }}
          direction="column"
          borderRadius="md"
          width="100%"
          height={{ xs: 900, lg: '100%' }}
        >
          <Image
            gridArea="ad"
            borderRadius="md"
            height={{ xs: 300, lg: '40%' }}
            marginBottom={4}
            src="https://drive.google.com/file/d/1WZMrn0giL9gs1vRax95QYvjHYnbwDONe/view?usp=sharing"
          />

          <Flex
            borderRadius="md"
            padding={{ xs: 6, lg: 4 }}
            backgroundColor="gray.800"
            direction="column"
            height={{ lg: '60%', xs: 600 }}
          >
            <Box marginBottom={8} width="100%" height="3%" color="gray.200">
              <Title css={{ color: 'gray.200' }}>Chat</Title>
            </Box>

            <Flex
              direction="column"
              width="100%"
              height="85%"
              overflowY="auto"
              borderBottom="2px solid #fff"
              ref={messagesContainerRef}
            >
              {messages.map(actualMessage => (
                <MessageBox
                  key={actualMessage.id}
                  username={actualMessage.sender}
                  message={actualMessage.content}
                />
              ))}
            </Flex>

            <Flex width="100%" height="12%" paddingTop={2}>
              <Textarea
                onChange={e => setMessage(e.target.value)}
                onKeyUp={e => handleKeyUp(e)}
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
        </Flex>
      </Grid>
    </>
  );
};

export default Live;
