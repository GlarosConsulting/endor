import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Flex, Box, Text } from '@chakra-ui/core';
// eslint-disable-next-line
import { format } from 'date-fns';
// eslint-disable-next-line
import { ptBR } from 'date-fns/locale'
import isUuid from 'is-uuid';

import SEO from '@/components/SEO';
import Title from '@/components/Title';
import api from '@/services/api';

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

  const queryKey = 'id';
  const queryValue =
    router.query[queryKey] ||
    router.asPath.match(new RegExp(`[&?]${queryKey}=(.*)(&|$)`));

  useEffect(() => {
    if (!queryValue) {
      router.replace('/login');
    } else if (typeof queryValue !== 'string') {
      if (!isUuid.v4(queryValue[1])) {
        console.log('não é uuid');
      } else {
        api.get(`deceaseds/${queryValue[1]}`).then(response => {
          const { data } = response;
          setDeceased(data);
          console.log(deceased);
        });
      }
    } else if (!isUuid.v4(queryValue)) {
      router.replace('/login');
    }
  }, [queryValue, setDeceased]);
  return (
    <>
      <SEO
        title="Endor"
        image="og/boost.png"
        shouldExcludeTitleSuffix
        description="Fazer login na plataforma"
      />

      <Box
        display="grid"
        gridTemplateColumns="70% 30%"
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
          backgroundColor="gray.800"
          borderRadius="md"
          width="100%"
          height="100%"
          padding={6}
        >
          <Box width="100%" color="gray.200">
            <Title css={{ color: 'gray.200' }}>Chat</Title>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Live;
