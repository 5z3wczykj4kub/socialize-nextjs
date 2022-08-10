import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SignInFormValues } from '../components/forms/SignInForm/SignInForm';
import { SignUpFormValues } from '../components/forms/SignUpForm/SignUpForm';
import { Friend, User } from '../models/User';

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
    signIn: build.mutation<void, SignInFormValues>({
      query: (signInFormValues) => ({
        url: '/sign-in',
        method: 'POST',
        body: signInFormValues,
      }),
    }),
    signOut: build.query<void, void>({
      query: () => '/sign-out',
    }),
    search: build.query<User[], string>({
      query: (search) => `/users?search=${search}`,
    }),
    /**
     * TODO:
     * Handle canceling friend invites.
     */
    sendFriendInvite: build.mutation<void, Omit<Friend, 'status'>>({
      query: ({ requesterId, receiverId }) => ({
        url: `/users/${requesterId}/friends?receiverId=${receiverId}`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useLazySignOutQuery,
  useLazySearchQuery,
  useSendFriendInviteMutation,
} = api;
