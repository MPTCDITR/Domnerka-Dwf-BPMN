// src/types/bpmnTypes.ts
export interface BpmnProcess {
    id: string;
    processName: string;
    description: string;
    isFeatured: boolean;
  }
  
  export interface BpmnSaveResponse {
    success: boolean;
    message: string;
  }
  
  export interface BpmnSavePayload {
    bpmnXml: string;
  }