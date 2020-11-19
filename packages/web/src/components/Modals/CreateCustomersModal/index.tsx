import React, { useCallback, useRef } from 'react';

import {
  Button,
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

import DatePicker from '@/components/DatePicker';
import Input from '@/components/Input';
import Select from '@/components/Select';
import getValidationErrors from '@/utils/getValidationErrors';

import api from '../../../services/api';

interface IFormData {
  name: string;
  email: string;
  telephone: string;
  gender: string;
  cpf: string;
  birth_date: Date;
}

interface ICreateCustomersModalProps {
  isOpen: boolean;
  onClose?: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void;
}

const CreateCustomersModal: React.FC<ICreateCustomersModalProps> = ({
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
        email: Yup.string().email().required('E-mail obrigatória'),
        telephone: Yup.string().required('Telefone obrigatório'),
        gender: Yup.string().required('Gênero obrigatório'),
        cpf: Yup.string()
          .length(11, 'Cpf deve ter somente 11 dígitos')
          .required('Cpf obrigatório'),
        birth_date: Yup.date().required('Data de nascimento obrigatória'),
      });

      await schema.validate(data, { abortEarly: false });

      await api.post('customers', data);

      toast({
        status: 'success',
        title: 'Cliente registrado com sucesso!',
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
        title: 'Erro no registro do cliente',
        description:
          'Ocorreu um erro ao tentar registrar o cliente, tente novamente.',
        position: 'top',
        duration: 5000,
      });
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent borderRadius="md">
        <ModalHeader>Registrar cliente</ModalHeader>
        <ModalCloseButton />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <ModalBody paddingBottom={4}>
            <Input
              name="name"
              placeholder="Nome"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
              }}
            />

            <DatePicker
              name="birth_date"
              placeholderText="Data de nascimento"
              containerProps={{ marginTop: 3, color: 'black' }}
            />

            <Input
              name="email"
              placeholder="E-mail"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            />

            <Input
              name="telephone"
              placeholder="Telefone"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            />

            <Input
              name="cpf"
              placeholder="CPF"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            />

            <Select
              name="gender"
              bg="white"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            >
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose} marginRight={4}>
              Cancelar
            </Button>

            <Button type="submit" variantColor="green">
              Confirmar
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default CreateCustomersModal;
