const baseUrl = import.meta.env.VITE_API_URL;
export const baseURL = () => {
  return baseUrl;
};

export const BPMN_PROCESS_URL = '/v1/bpmn-process';