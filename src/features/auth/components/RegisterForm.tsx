'use client';

import {
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  registerSchema,
  RegisterFormData,
} from '../validations/registerSchema';

import { useRegister } from '../hooks/useRegister';

export default function LoginForm() {
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <Stack
      spacing={3}
      sx={{
        width: 400,
        p: 4,
        bgcolor: 'background.paper',
        borderRadius: 3,
      }}
    >
      <Typography variant="h5">
        Login
      </Typography>

      <TextField
        label="Email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Password"
        type="password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Button
        variant="contained"
        onClick={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending ? 'Loading...' : 'Login'}
      </Button>
    </Stack>
  );
}