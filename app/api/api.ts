import axios from 'axios';
import { ApiResponse } from '../models/common';
import { ApiError } from '../models/error';
import { MembershipDetailsDTO } from '../models/user';

const apiUrl = import.meta.env.VITE_RENT_MANAGER_API_URL;


export const apiClient = axios.create({
  baseURL: `${apiUrl}/rent-manager/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { message, data, statusCode } = error.response.data;

      return Promise.reject(
        new ApiError({
          message: message ?? "SERVER_ERROR",
          data: data ?? null,
          statusCode: statusCode ?? error.response.status,
        })
      );
    }

    if (error.request) {
      return Promise.reject(
        new ApiError({
          message: "NETWORK_ERROR",
          data: "No response from server",
          statusCode: 0,
        })
      );
    }

    return Promise.reject(
      new ApiError({
        message: "CLIENT_ERROR",
        data: "Unexpected error occurred",
        statusCode: 0,
      })
    );
  }
);


export const membershipApi = {
  getAllMemberships: async (userId: number, token: string) => {
    const res = await apiClient.get<ApiResponse<MembershipDetailsDTO []>>(`/memberships/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return handleResponse(res.data);
  }
};


export function handleResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message ?? "Request failed");
  }

  return response.data;
}