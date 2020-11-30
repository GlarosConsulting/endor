import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Button,
  Checkbox,
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
import { useAuthentication } from '@/hooks/authentication';
import getValidationErrors from '@/utils/getValidationErrors';

import api from '../../../services/api';

interface IFormData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface ICreateEmpployeesModalProps {
  isOpen: boolean;
  onClose?: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void;
}

const CreateEmpployeesModal: React.FC<ICreateEmpployeesModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { user } = useAuthentication();
  const toast = useToast();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [admRole, setAdmRole] = useState<boolean>(false);

  useEffect(() => {
    setUserRole(user.role);
  }, []);

  const handleSubmit = useCallback(
    async (data: IFormData, event) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string().email().required('E-mail obrigatória'),
          password: Yup.string().required('Senha obrigatório'),
          passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'As senhas devem ser iguais',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        let requestBodyData;

        if (admRole) {
          requestBodyData = {
            name: data.name,
            role: 'administrador',
            email: data.email,
            password: data.password,
          };
        } else {
          requestBodyData = {
            name: data.name,
            role: 'funcionario',
            email: data.email,
            password: data.password,
          };
        }

        await api.post('employees', requestBodyData);

        toast({
          status: 'success',
          title: 'Funcionário registrado com sucesso!',
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
          title: 'Erro no registro do funcionário',
          description:
            'Ocorreu um erro ao tentar registrar o funcionário, tente novamente.',
          position: 'top',
          duration: 5000,
        });
      }
    },
    [admRole],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent borderRadius="md">
        <ModalHeader>Registrar funcionário</ModalHeader>
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
              name="password"
              type="password"
              placeholder="Senha"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            />

            <Input
              name="passwordConfirmation"
              type="password"
              placeholder="Confirme a senha do funcionário"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Checkbox
              color="green"
              hidden={userRole !== 'administrador'}
              isChecked={admRole}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setAdmRole(event.target.checked);
              }}
            >
              Administrador
            </Checkbox>
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

export default CreateEmpployeesModal;
