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
import Select from '@/components/Select';
import getValidationErrors from '@/utils/getValidationErrors';

import api from '../../../services/api';

interface IFormData {
  name: string;
  url_cam: string;
  cemetery_id: string;
}

interface ICemeteries {
  id: string;
  name: string;
}

interface ICreateFuneralsModalProps {
  isOpen: boolean;
  onClose?: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void;
  cemeteries: ICemeteries[];
}

const CreateFuneralsModal: React.FC<ICreateFuneralsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  cemeteries,
}) => {
  const formRef = useRef<FormHandles>(null);

  const toast = useToast();

  const handleSubmit = useCallback(async (data: IFormData, event) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        url_cam: Yup.string().required('Link da camêra obrigatório'),
        cemetery_id: Yup.string().uuid().required('Cemitério obrigatório'),
      });

      await schema.validate(data, { abortEarly: false });

      await api.post('funerals', data);

      toast({
        status: 'success',
        title: 'Velório criado com sucesso',
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
        title: 'Erro ao registrar o velório',
        description: 'Ocorreu um erro ao registrar o velório, tente novamente.',
        position: 'top',
        duration: 5000,
      });
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent maxWidth={900} borderRadius="md">
        <ModalHeader>Registrar velório</ModalHeader>
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
              <Input
                name="url_cam"
                placeholder="Link da camêra do velório"
                containerProps={{
                  marginLeft: '16px',
                  border: '1px solid',
                  borderColor: 'gray.400',
                  bg: 'white',
                }}
              />
              <Select
                backgroundColor="White"
                name="cemetery_id"
                placeholder="Selecione o cemitério"
                containerProps={{
                  marginLeft: '16px',
                  border: '1px solid',
                  borderColor: 'gray.400',
                  bg: 'white',
                }}
              >
                {cemeteries.map(cemetery => (
                  <option value={cemetery.id}>{cemetery.name}</option>
                ))}
              </Select>
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

export default CreateFuneralsModal;
