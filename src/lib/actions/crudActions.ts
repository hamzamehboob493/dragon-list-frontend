import api from "../api/axios";
import { routes } from "../routes";
import { Team, User } from "../types/dashboard/types";

export async function createAction(url: string, data: unknown) {
  try {
    const response = await api.post(url, data);
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}

export async function getAction(url: string) {
  try {
    const response = await api.get(url);
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}

export async function updateAction(url: string, data: unknown) {
  try {
    const response = await api.patch(url, data);
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}

export async function deleteAction(url: string) {
  try {
    const response = await api.delete(url);
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}
