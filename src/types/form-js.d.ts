declare module "@bpmn-io/form-js-editor" {
  export interface FormEditorOptions {
    container: HTMLElement;
    propertiesPanel?: {
      parent: HTMLElement;
    };
    [key: string]: any;
  }

  export interface FormEditorConstructor {
    new (options: FormEditorOptions): FormEditor;
  }

  export interface FormEditor {
    importSchema(schema: any): Promise<void>;
    getSchema(): any;
    destroy(): void;
    on(event: string, callback: () => void): void;
  }

  export const FormEditor: FormEditorConstructor;
}

declare module "@bpmn-io/form-js/playground" {
  export class FormPlayground {
    constructor(options: { container: HTMLElement; schema: any; data: any });
    importSchema(schema: any, data: any): void;
    destroy(): void;
  }
}
