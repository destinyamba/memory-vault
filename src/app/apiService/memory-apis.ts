import axios from "axios";
import { Memory } from "@/app/types";
import { format } from "date-fns";

const FETCH_MEMORIES_URL =
  "https://prod-126.westus.logic.azure.com:443/workflows/79ab0429f5034b70a48e2a4fac052df8/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=AQFfcEGgamJ130ChozvCf5d2ERAjHgP25PH-3JF2O40";
const UPLOAD_MEMORY_URL =
  "https://prod-184.westus.logic.azure.com:443/workflows/15c54184d1054629971a43963c99c7bc/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=kYRqKXA4VGB8Y1oyxzyInP80VFC0nVbSmDU78QnMT9o";
const DELETE_MEMORY_URL =
  "https://prod-09.westus.logic.azure.com/workflows/7957ff40e8c14947ab9bc1f4fe731423/triggers/When_a_HTTP_request_is_received/paths/invoke/rest/v1/memory/";
const UPDATE_MEMORY_URL =
  "https://prod-36.eastus.logic.azure.com/workflows/f8f09a6b5ab94c189009dbd5cd954af8/triggers/When_a_HTTP_request_is_received/paths/invoke/rest/v1/memory/";

export const getBlobStorageUrl = (filePath: string): string => {
  const storageAccountName = "memoryvaultblobstore";
  const cleanFilePath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  return `https://${storageAccountName}.blob.core.windows.net/${cleanFilePath}`;
};

export const fetchAllMemories = async (): Promise<Memory[]> => {
  try {
    const response = await axios.get<Memory[]>(FETCH_MEMORIES_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching memories:", error);
    throw error;
  }
};

export const uploadMemory = async (formData: FormData) => {
  try {
    const response = await axios.post(UPLOAD_MEMORY_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error uploading memory:", error);
    throw error;
  }
};

export const deleteMemory = async (memoryId: string) => {
  try {
    await axios.delete(
      `${DELETE_MEMORY_URL}${memoryId}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=_bn3K5qVMQRPKEoetjFpiPFcxaD8WjoGFFBkVKbBnnc`
    );
  } catch (error) {
    console.error("Error deleting memory:", error);
    throw error;
  }
};

export const updateMemory = async (
  memoryId: string,
  memoryData: Partial<Memory>
) => {
  try {
    const updatePayload = {
      location: memoryData.location ?? "",
      tags: memoryData.tags ?? "",
      updated_at: new Date().toISOString(),
    };

    const formData = new FormData();
    formData.append("location", updatePayload.location);
    formData.append("tags", updatePayload.tags);
    formData.append("updated_at", updatePayload.updated_at);

    await axios.patch(
      `${UPDATE_MEMORY_URL}${memoryId}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=NTM_4BnEjxKZsenp2anhTzco05SGnpAL5Ei5T5T4Vuc`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting memory:", error);
    throw error;
  }
};

export const parseTags = (tagsString: string) => {
  return tagsString ? tagsString.split(",").map((tag) => tag.trim()) : [];
};

export const formatTicksToTime = (ticks: string | number): string => {
  const ticksNumber = typeof ticks === "string" ? Number(ticks) : ticks;
  const milliseconds = ticksNumber / 10000;
  const date = new Date(milliseconds);

  return format(date, "hh:mm a");
};
