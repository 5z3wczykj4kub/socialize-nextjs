import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SignInFormValues } from '../components/forms/SignInForm/SignInForm';
import { SignUpFormValues } from '../components/forms/SignUpForm/SignUpForm';
import { Friend, Notification, User } from '../models/User';

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
    sendFriendInvite: build.mutation<void, Omit<Friend, 'status'>>({
      query: ({ requesterId, receiverId }) => ({
        url: `/users/${requesterId}/friends?receiverId=${receiverId}`,
        method: 'PUT',
      }),
    }),
    cancelInviteOrRemoveFriend: build.mutation<void, Omit<Friend, 'status'>>({
      query: ({ requesterId, receiverId }) => ({
        url: `/users/${requesterId}/friends?receiverId=${receiverId}`,
        method: 'DELETE',
      }),
    }),
    respondToFriendInvite: build.mutation<
      void,
      Omit<Friend, 'status'> & { response: 'accept' | 'reject' }
    >({
      query: ({ requesterId, receiverId, response }) => ({
        url: `/users/${requesterId}/friends?receiverId=${receiverId}`,
        method: 'PATCH',
        body: { response },
      }),
    }),
    getNotifications: build.query<Notification[], null>({
      query: () => '/notifications',
    }),
    readNotification: build.mutation<void, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: 'PATCH',
      }),
      async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            'getNotifications',
            null,
            (notifications) => {
              const notification = notifications.find(
                (notification) => notification._id === notificationId
              )!;
              notification.read = true;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    addPost: build.mutation<void, { requesterId: string; content: string }>({
      query: ({ requesterId, content }) => ({
        url: `users/${requesterId}/posts`,
        method: 'POST',
        body: { content },
      }),
    }),
    addComment: build.mutation<void, { postId: string; content: string }>({
      query: ({ postId, content }) => ({
        url: `/posts/${postId}/comments`,
        method: 'POST',
        body: { content },
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
  useCancelInviteOrRemoveFriendMutation,
  useRespondToFriendInviteMutation,
  useGetNotificationsQuery,
  useReadNotificationMutation,
  useAddPostMutation,
  useAddCommentMutation,
} = api;
