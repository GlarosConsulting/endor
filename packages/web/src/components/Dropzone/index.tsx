import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import { Flex } from '@chakra-ui/core';
import { useField } from '@unform/core';

interface IDropzoneProps {
  name: string;
}

const Dropzone: React.FC<IDropzoneProps> = ({ name }) => {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    inputRef,
  } = useDropzone();

  const { fieldName, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'files[0]',
    });
  }, [fieldName, registerField]);

  const files = acceptedFiles.map(file => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <Flex
      height="100%"
      alignItems="center"
      justifyContent="center"
      border="dashed"
      borderColor={!error ? 'white' : 'rgba(229,62,62,0.6)'}
      backgroundColor="gray.900"
      borderRadius="md"
      opacity={0.5}
      color="white"
      width="100%"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        {...getRootProps({ className: 'dropzone' })}
      >
        <input {...getInputProps()} />
        <p style={{ fontFamily: 'Roboto', fontSize: '26px' }}>
          Arraste o arquivo de imagem para cá, ou cique para selecionar.
        </p>
      </Flex>
      <aside>
        <ul style={{ listStyleType: 'none' }}>{files}</ul>
      </aside>
    </Flex>
  );
};

export default Dropzone;
