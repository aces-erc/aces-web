import axios from "axios";
import { API } from ".";
import { NewEvent } from "@/schema/events.zod";
import { IEvent } from "@/types/event.types";

/**
 * Retrieves a list of events from the API.
 * @returns A Promise that resolves to an array of IEvents objects.
 */
export const getEvents = async (): Promise<IEvent[]> => {
  return new Promise((resolve, reject) => {
    axios
      .get(API.events, {
        withCredentials: true,
      })
      .then((res) => {
        resolve(res.data?.data);
      })
      .catch((error) => {
        reject(error?.response?.data?.message ?? "Something went wrong!");
      });
  });
};

/**
 * Creates a new event.
 * @param newEvent - The new event object to be created.
 * @returns A promise that resolves to the created event data.
 */
export const createEvent = async (newEvent: NewEvent) => {
  return new Promise((resolve, reject) => {
    axios
      .post(API.events, newEvent, {
        withCredentials: true,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error?.response?.data?.message ?? "Something went wrong!");
      });
  });
};

/**
 * Deletes a event by its ID.
 * @param id - The ID of the event to delete.
 * @returns A Promise that resolves to a string indicating the result of the deletion.
 */
export const deleteEventById = async (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    axios
      .delete(API.events, {
        data: { id },
        withCredentials: true,
      })
      .then((res) => {
        resolve(res.data?.message ?? "Notice deleted successfully!");
      })
      .catch((error) => {
        reject(error?.response?.data?.message ?? "Something went wrong!");
      });
  });
};
