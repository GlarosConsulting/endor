import React, { useCallback, useRef } from 'react';

import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import Input from '@/components/Input';
import getValidationErrors from '@/utils/getValidationErrors';

import api from '../../../services/api';

interface IFormData {
  name: string;
}

interface ICreateCemeteriesModalProps {
  isOpen: boolean;
  onClose?: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void;
}

const CreateCemeteriesModal: React.FC<ICreateCemeteriesModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const formRef = useRef<FormHandles>(null);

  const toast = useToast();

  const handleSubmit = useCallback(async (data: IFormData, event) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
      });

      await schema.validate(data, { abortEarly: false });

      await api.post('cemeteries', data);

      toast({
        status: 'success',
        title: 'Cemitério criado com sucesso',
        position: 'top',
        duration: 3000,
      });

      onClose(event);
      onSave();
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent maxWidth={900} borderRadius="md">
        <ModalHeader>Registrar cemitério</ModalHeader>
        <ModalCloseButton />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <ModalBody paddingBottom={4}>
            <Flex>
              <Input
                name="name"
                placeholder="Nome"
                containerProps={{
                  border: '1px solid',
                  borderColor: 'gray.400',
                  bg: 'white',
                }}
              />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose} marginRight={4}>
              Cancelar
            </Button>

            <Button type="submit" variantColor="green">
              Salvar
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default CreateCemeteriesModal;
