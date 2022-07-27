import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SignUpFormValues } from './components/forms/SignUpForm/SignUpForm';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (build) => ({
    signUp: build.mutation<void, SignUpFormValues>({
      query: (signUpFormValues) => ({
        url: '/sign-up',
        method: 'POST',
        body: signUpFormValues,
      }),
    }),
  }),
});

export const { useSignUpMutation } = api;
