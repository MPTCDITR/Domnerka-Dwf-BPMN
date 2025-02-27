// src/services/bpmnProcessService.ts
import { AxiosInstance } from 'axios';
import { BPMN_PROCESS_URL } from '@/services/URLs';

interface BpmnProcess {
  id: string;
  name: string;
  bpmn: string;
  status?:string;
  description: string;
  isFeatured: boolean;
}

/**
 * Fetch all BPMN processes.
 * @param axiosInstance - The Axios instance to use for the request.
 * @returns A promise that resolves to an array of BPMN processes.
 */
export const fetchBpmnProcesses = async (
  axiosInstance: AxiosInstance
): Promise<BpmnProcess[]> => {
  try {
    const response = await axiosInstance.get(BPMN_PROCESS_URL);
    return response.data.items || []; // Extract the `items` array
  } catch (error) {
    console.error("Failed to fetch processes:", error);
    return []; // Return an empty array on error
  }
};

/**
 * Create a new BPMN process.
 * @param axiosInstance - The Axios instance to use for the request.
 * @param name - The name of the process.
 * @param bpmnXml - The BPMN XML content.
 * @param description - The description of the process.
 * @param isFeatured - Whether the process is featured.
 * @returns A promise that resolves to the created BPMN process.
 */
export const createBpmnProcess = async (
  axiosInstance: AxiosInstance,
  name: string,
  bpmnXml: string,
  description: string,
  isFeatured: boolean
): Promise<BpmnProcess> => {
  const response = await axiosInstance.post(BPMN_PROCESS_URL, {
    name,
    bpmn: bpmnXml,
    description,
    isFeatured,
  });
  return response.data;
};

/**
 * Update an existing BPMN process.
 * @param axiosInstance - The Axios instance to use for the request.
 * @param processId - The ID of the process to update.
 * @param bpmnXml - The updated BPMN XML content.
 * @returns A promise that resolves when the update is complete.
 */
export const updateBpmnProcess = async (
  axiosInstance: AxiosInstance,
  processId: string,
  bpmnXml: string
): Promise<void> => {
  await axiosInstance.put(`${BPMN_PROCESS_URL}/${processId}`, { bpmn: bpmnXml });
};

/**
 * Delete a BPMN process.
 * @param axiosInstance - The Axios instance to use for the request.
 * @param processId - The ID of the process to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteBpmnProcess = async (
  axiosInstance: AxiosInstance,
  processId: string
): Promise<void> => {
  await axiosInstance.delete(`${BPMN_PROCESS_URL}/${processId}`);
};

/**
 * Handle creating a new BPMN process.
 * @param axiosInstance - The Axios instance to use for the request.
 * @param name - The name of the process.
 * @param bpmnXml - The BPMN XML content.
 * @param description - The description of the process.
 * @param isFeatured - Whether the process is featured.
 * @returns A promise that resolves to the created BPMN process.
 */
export const handleCreateProcess = async (
  axiosInstance: AxiosInstance,
  name: string,
  bpmnXml: string,
  description: string,
  isFeatured: boolean
): Promise<BpmnProcess> => {
  return createBpmnProcess(axiosInstance, name, bpmnXml, description, isFeatured);
};

/**
 * Handle deleting a BPMN process.
 * @param axiosInstance - The Axios instance to use for the request.
 * @param processId - The ID of the process to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export const handleDeleteProcess = async (
  axiosInstance: AxiosInstance,
  processId: string
): Promise<void> => {
  await deleteBpmnProcess(axiosInstance, processId);
};