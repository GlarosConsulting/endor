import { useRouter } from 'next/router';
import React, { useCallback, useRef } from 'react';

import { Box, Button, Flex, useToast } from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import Dropzone from '@/components/Dropzone';
import Select from '@/components/Select';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Title from '@/components/Title';
import api from '@/services/api';
import getValidationErrors from '@/utils/getValidationErrors';

const ImagesSettings: React.FC = () => {
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);
  const router = useRouter();

  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

  const handleSubmit = useCallback(async (data, { reset }) => {
    try {
      formRef.current?.setErrors({});

      const schemaFile = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        file: Yup.mixed().test(
          'fileType',
          'O arquivo deve ser uma imagem.',
          value => SUPPORTED_FORMATS.includes(value.type),
        ),
      });

      if (!data.file) {
        formRef.current?.setErrors({ file: 'file must be imported.' });

        toast({
          position: 'top-right',
          status: 'error',
          title: 'Arquivo não importado.',
          description: 'O arquivo deve ser importado.',
        });

        return;
      }

      await schemaFile.validate(data, { abortEarly: false });

      const formData = new FormData();

      formData.append('file', data.file);
      formData.append('name', data.name);

      await api.post('images', formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });

      router.replace('/register/cemeteries');

      toast({
        position: 'top',
        status: 'success',
        title: 'Imagem importada.',
        description:
          'Imagem já está disponível para os usuários na tela de live.',
      });

      reset();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        if (errors.file === 'O arquivo deve ser uma imagem.') {
          toast({
            position: 'top-right',
            status: 'error',
            title: 'Arquivo inválido.',
            description: 'O arquivo selecionado deve ser uma imagem.',
          });
        }

        formRef.current?.setErrors(errors);
      }
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
        width="100%"
      >
        <Sidebar />

        <Flex
          paddingLeft={2}
          paddingTop={15}
          paddingRight={65}
          width="calc(100vw - 310px)"
          height="100%"
          bg="gray.800"
          direction="column"
        >
          <Flex justifyContent="space-between" width="100%" color="gray.200">
            <Box width="100%" color="gray.200">
              <Title css={{ color: 'gray.200' }}>
                Configurar imagens de propaganda na página de live{' '}
              </Title>
            </Box>
          </Flex>

          <Form onSubmit={handleSubmit} ref={formRef}>
            <Select
              name="name"
              height={8}
              backgroundColor="White"
              placeholder="Selecione a resolução da sua imagem"
              containerProps={{
                width: 400,
                height: 10,
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
              }}
            >
              <option value="378x372">378x372</option>
              <option value="240x920">240x920</option>
            </Select>

            <Flex height={300} width="100%" marginY={4}>
              <Dropzone name="file" />
            </Flex>
            <Button isDisabled variantColor="green" width={300} type="submit">
              Hospedar imagem
            </Button>
          </Form>
        </Flex>
      </Flex>
    </>
  );
};

export default ImagesSettings;
