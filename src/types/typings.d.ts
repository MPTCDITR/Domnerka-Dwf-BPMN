// declare module '*.bpmn';
declare module '*.png';
declare module '*.svg';
declare module '*.webp';
declare module '*.bpmn' {
    const content: string;
    export default content;
  }