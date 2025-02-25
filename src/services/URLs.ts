export const baseURL = () => {
  if (process.env.NODE_ENV == 'development') {
    return process.env.REACT_APP_API_DEV_URL;
  } else {
    return process.env.REACT_APP_API_PRO_URL;
  }
};

export const CATEGORIES_URL = 'v1/categories';
export const FORM_URL = 'v1/forms';
export const TASK_LIST_URL = 'v1/tasks';
export const PROCESS_LIST_URL = 'v1/process-instances';
export const BPMN_PROCESS_URL = 'v1/bpmn-processes';
export const NOTIFICATION_URL = 'v1/notifications';
export const FILE_URL = 'v1/files';
export const MY_FILE_URL = 'v1/my/files';
export const USER_PROFILE = 'v1/users';
export const GROUP_URL = 'v1/groups';
