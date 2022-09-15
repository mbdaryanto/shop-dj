import { Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { ComponentProps, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export function PasswordInput({ type, ...rest }: ComponentProps<typeof Input>) {
  const [revealed, setRevealed] = useState(false);
  return (
    <InputGroup>
      <Input
        type={revealed ? "text" : "password"}
        {...rest} />
      <InputRightElement>
        <IconButton
          aria-label="Show Password"
          icon={revealed ? <FaEye /> : <FaEyeSlash />}
          variant="link"
          onMouseDown={() => setRevealed(true)}
          onMouseLeave={() => setRevealed(false)}
          onMouseUp={() => setRevealed(false)} />
      </InputRightElement>
    </InputGroup>
  );
}
