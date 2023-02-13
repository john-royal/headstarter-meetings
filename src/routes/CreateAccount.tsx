import Alert from '@mui/joy/Alert';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/lib/auth';

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface CreateAccountFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function CreateAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createAccount } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<CreateAccountFormElement>) => {
    e.preventDefault();

    const elements = e.currentTarget.elements;

    const email = elements.email.value;
    const password = elements.password.value;

    setLoading(true);
    setError('');

    createAccount(email, password)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div>
        <Typography level='h4' component='h1'>
          Create an Account
        </Typography>
        <Typography
          endDecorator={<Link href='/sign-in'>Sign In</Link>}
          fontSize='sm'
          sx={{ alignSelf: 'center' }}
        >
          or
        </Typography>
      </div>

      {error && <Alert color='danger'>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Email</FormLabel>
          <Input name='email' type='email' placeholder='johndoe@email.com' />
        </FormControl>
        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Password</FormLabel>
          <Input name='password' type='password' placeholder='•••••' />
        </FormControl>
        <Button type='submit' loading={loading}>
          Create Account
        </Button>
      </form>
    </>
  );
}
