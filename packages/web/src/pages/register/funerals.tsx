import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Box, Button, Flex, useToast } from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import Input from '@/components/Input';
import Select from '@/components/Select';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Title from '@/components/Title';
import getValidationErrors from '@/utils/getValidationErrors';

import api from '../../services/api';

interface IFormData {
  name: string;
  url_cam: string;
}
// eslint-disable-next-line
interface Cemeteries {
  id: string;
  name: string;
}

const Funerals: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [cemeteries, setCemeteries] = useState<Cemeteries[]>(
    [] as Cemeteries[],
  );
  const toast = useToast();

  useEffect(() => {
    api.get('cemeteries').then(response => {
      const cemeteriesResponse: Cemeteries[] = response.data;

      setCemeteries(cemeteriesResponse);
    });
  }, []);

  const handleSubmit = useCallback(async (data: IFormData, { reset }) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        url_cam: Yup.string().required('Link da camêra obrigatório'),
        cemetery_id: Yup.string().required('Cemitério obrigatório'),
      });

      await schema.validate(data, { abortEarly: false });

      await api.post('funerals', data);

      toast({
        status: 'success',
        title: 'Velório criado com sucesso',
        position: 'top',
        duration: 3000,
      });

      reset();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      toast({
        status: 'error',
        title: 'Erro ao registrar cemitério',
        description: 'Ocorreu um erro ao registrar cemitério, tente novamente.',
        position: 'top',
        duration: 5000,
      });
    }
  }, []);

  return (
    <>
      <SEO
        title="Endor"
        image="og/boost.png"
        shouldExcludeTitleSuffix
        description="Fazer o registro de velórios na plataforma"
      />
      <Flex
        as="main"
        height="100vh"
        position="relative"
        backgroundColor="gray.800"
      >
        <Sidebar />

        <Flex
          paddingLeft={2}
          paddingTop={15}
          paddingRight={65}
          width="100%"
          height="100%"
          bg="gray.800"
          direction="column"
        >
          <Box width="100%" color="gray.200">
            <Title css={{ color: 'gray.200' }}>Velórios</Title>
          </Box>
          <Flex flexDirection="column" height="100%">
            <Form
              ref={formRef}
              css={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              onSubmit={handleSubmit}
            >
              <Flex>
                <Input
                  name="name"
                  placeholder="Nome"
                  containerProps={{ width: '33.3%' }}
                />
                <Input
                  name="url_cam"
                  placeholder="Link da camêra do velório"
                  containerProps={{ width: '33.3%', marginLeft: 15 }}
                />
                <Select
                  name="cemetery_id"
                  containerProps={{ width: '33.3%', marginLeft: 15 }}
                  placeholder="Cemiterios"
                >
                  {cemeteries.map(cemetery => (
                    <option value={cemetery.id}>{cemetery.name}</option>
                  ))}
                </Select>
              </Flex>
              <Flex marginTop={4} justifyContent="flex-end">
                <Button
                  type="submit"
                  bg="green.400"
                  color="gray.800"
                  _hover={{
                    bg: 'green.500',
                    color: 'gray.900',
                  }}
                  _focusWithin={{
                    bg: 'green.500',
                    color: 'gray.900',
                  }}
                  width={300}
                  marginY={4}
                  paddingY={6}
                >
                  Salvar
                </Button>
              </Flex>
            </Form>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Funerals;
