import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  UserProfile,
} from '@/types/auth'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/api/v1/auth/`,
    credentials: 'include',
  }),
  tagTypes: ['Auth', 'User'],
  endpoints: (builder) => ({
    getSession: builder.query<{ user: UserProfile }, void>({
      query: () => 'session',
      providesTags: ['Auth'],
    }),
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (data) => ({
        url: 'register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<{ message: string }, { allDevices?: boolean }>({
      query: (options = {}) => ({
        url: 'logout',
        method: 'POST',
        body: options,
      }),
      invalidatesTags: ['Auth'],
    }),
    getUserProfile: builder.query<UserProfile, void>({
      query: () => 'profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (data) => ({
        url: 'profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation<
      { message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (data) => ({
        url: 'change-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useGetSessionQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi
