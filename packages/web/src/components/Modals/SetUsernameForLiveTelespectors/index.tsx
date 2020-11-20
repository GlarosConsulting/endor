import React, { useCallback, useRef } from 'react';

import {
  Button,
  Modal,
  ModalBody,
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
  onSave: (name) => void;
}

const CreateEmpployeesModal: React.FC<ICreateEmpployeesModalProps> = ({
  isOpen,
  onSave,
}) => {
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: { name: string }) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
        });

        await schema.validate(data, { abortEarly: false });

        onSave(data.name);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        }
      }
    },
    [onSave],
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        toast({
          status: 'error',
          title: 'Não é possível assistir a live sem se identificar',
          position: 'bottom-right',
          duration: 3000,
        });
      }}
    >
      <ModalOverlay />

      <ModalContent borderRadius="md">
        <ModalHeader>
          Por favor informe seu nome, para que putras pessoas te identifiquem no
          chat
        </ModalHeader>
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
          </ModalBody>

          <ModalFooter>
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
