import axios from 'axios';
// import { BpmnSavePayload } from '../types/bpmnTypes';

const API_URL = '{{best_url}}bpmn-process';

// Create a new BPMN process
export const createBpmnProcess = async (processName: string, bpmnXml: string, description: string, isFeatured: boolean) => {
  try {
    const response = await axios.post(API_URL, {
      processName,
      bpmn: bpmnXml,
      description,
      isFeatured,
    });
    return response.data; // Return the created process data
  } catch (error) {
    console.error('Error creating BPMN process:', error);
    throw new Error('Failed to create BPMN process');
  }
};

// Update an existing BPMN process
export const updateBpmnProcess = async (processId: string, bpmnXml: string) => {
  try {
    const response = await axios.put(`${API_URL}/${processId}`, {
      bpmn: bpmnXml,
    });
    return response.data; // Return the updated process data
  } catch (error) {
    console.error('Error updating BPMN process:', error);
    throw new Error('Failed to update BPMN process');
  }
};


export const importBpmnDiagram = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
  
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
  
      reader.readAsText(file);
    });
  };