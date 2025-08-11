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
    // Add timestamp and random number to prevent caching
    const separator = url.includes('?') ? '&' : '?';
    const timestamp = Date.now();
    const random = Math.random();
    const urlWithTimestamp = `${url}${separator}_t=${timestamp}&_r=${random}`;
    console.log("Get action called for URL:", urlWithTimestamp);
    
    const response = await api.get(urlWithTimestamp);
    console.log("Get response:", response);
    if (response.data) {
      return response;
    }
  } catch (error) {
    console.error("Get action error:", error);
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
    console.log("Delete action called for URL:", url);
    const response = await api.delete(url);
    console.log("Delete response:", response);
    // For DELETE operations, we might not get data back (204 No Content)
    // So we just return the response if it's successful
    return response;
  } catch (error) {
    console.error("Delete action error:", error);
    throw error;
  }
}
