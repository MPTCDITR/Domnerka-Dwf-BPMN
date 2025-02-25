// src/services/bpmnService.ts
import { BpmnProcess } from '@/types/bpmnTypes';
import { useAxios } from '@/hooks/useAxios';

const API_URL = '/bpmn-process'; // Relative to the base URL in useAxios

// Fetch all BPMN processes
export const fetchBpmnProcesses = async (): Promise<BpmnProcess[]> => {
  const axiosInstance = useAxios();
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

// Create a new BPMN process
export const createBpmnProcess = async (
  processName: string,
  bpmnXml: string,
  description: string,
  isFeatured: boolean
): Promise<BpmnProcess> => {
  const axiosInstance = useAxios();
  const response = await axiosInstance.post(API_URL, {
    processName,
    bpmn: bpmnXml,
    description,
    isFeatured,
  });
  return response.data;
};

// Update a BPMN process
export const updateBpmnProcess = async (
  processId: string,
  bpmnXml: string
): Promise<void> => {
  const axiosInstance = useAxios();
  await axiosInstance.put(`${API_URL}/${processId}`, { bpmn: bpmnXml });
};

// Delete a BPMN process
export const deleteBpmnProcess = async (processId: string): Promise<void> => {
  const axiosInstance = useAxios();
  await axiosInstance.delete(`${API_URL}/${processId}`);
};