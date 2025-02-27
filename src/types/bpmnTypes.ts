  export interface BpmnProcess {
    id: string;
    key?: string;
    name: string | null;
    description: string | null;
    isFeatured?: boolean;
  }
  
  export interface BpmnSaveResponse {
    success: boolean;
    message: string;
  }
  
  export interface BpmnSavePayload {
    bpmnXml: string;
  }