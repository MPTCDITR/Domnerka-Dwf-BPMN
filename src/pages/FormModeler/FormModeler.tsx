import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { FormEditor } from "@bpmn-io/form-js-editor";
import { Form } from "@bpmn-io/form-js";
import "@bpmn-io/form-js-editor/dist/assets/form-js-editor.css";
import "@bpmn-io/form-js-editor/dist/assets/properties-panel.css";
import "@bpmn-io/form-js/dist/assets/form-js.css";
import { Button } from "@/components/ui/button";
import { FORM_URL } from "@/services/URLs";

const FormModeler: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const propertiesPanelRef = useRef<HTMLDivElement>(null);
  const formEditorRef = useRef<FormEditor | null>(null);
  const formPreviewRef = useRef<Form | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [schema, setSchema] = useState<any>({
    type: "default",
    components: [],
    id: `form_${Date.now()}`,
  });
  const [data] = useState<any>({});
  const [formName, setFormName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !propertiesPanelRef.current) {
      return;
    }

    formEditorRef.current = new FormEditor({
      container: containerRef.current,
      propertiesPanel: {
        parent: propertiesPanelRef.current,
      },
      canvas: {
        minZoom: 0.5,
        maxZoom: 3.0,
        zoomStep: 0.1,
      },
    });

    formEditorRef.current.importSchema(schema).catch((err: Error) => {
      console.error("Failed to import initial schema:", err);
    });

    formEditorRef.current.on("changed", () => {
      const updatedSchema = formEditorRef.current?.getSchema();
      setSchema(updatedSchema);

      if (formPreviewRef.current && updatedSchema) {
        formPreviewRef.current
          .importSchema(updatedSchema, data)
          .catch((err: Error) => {
            console.error("Failed to update preview schema:", err);
          });
      }
    });

    return () => {
      if (formEditorRef.current) formEditorRef.current.destroy();
      if (formPreviewRef.current) formPreviewRef.current.destroy();
    };
  }, [data]);

  const handleImportForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSchema = JSON.parse(e.target?.result as string);

        if (!importedSchema.type || !Array.isArray(importedSchema.components)) {
          throw new Error("Invalid form schema format");
        }
        setSchema(importedSchema);
        formEditorRef.current
          ?.importSchema(importedSchema)
          .catch((err: Error) => {
            setStatus(`Error importing form: ${err.message}`);
            console.error("Failed to import schema:", err);
          });

        const newFormName =
          importedSchema.name || file.name.replace(/\.[^/.]+$/, "");
        setFormName(newFormName);
        setStatus("Form imported successfully");
      } catch (error: any) {
        setStatus(`Error: Invalid JSON file - ${error.message}`);
      }
    };
    reader.readAsText(file);

    event.target.value = "";
  };

  const handleDeployForm = async () => {
    if (!auth.isAuthenticated || !auth.user?.access_token) {
      setStatus("Error: Please log in to deploy a form");
      return;
    }

    if (!formName) {
      setStatus("Error: Form name is required");
      return;
    }

    if (!schema.components.length) {
      setStatus("Error: Please add at least one component to the form");
      return;
    }

    try {
      setIsLoading(true);
      const token = auth.user.access_token;
      const formDto = {
        name: formName,
        schema: JSON.stringify(schema),
      };

      const response = await fetch(FORM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(formDto),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to deploy form: ${errorText}`);
      }

      const result = await response.text();
      setStatus(result);
      setFormName("");
      setSchema({ type: "default", components: [], id: `form_${Date.now()}` });
      navigate("/form/form_list");
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/form/form_list");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row items-center justify-center w-full gap-5 p-4">
        <div>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="border rounded w-[50rem] h-9 p-4"
            placeholder="Form Name"
          />
        </div>
        <div className="flex gap-4 justify-end">
          <Button
            onClick={handleDeployForm}
            disabled={isLoading || !formName || !schema.components.length}
            className="bg-green-500 text-white h-9"
          >
            {isLoading ? "Creating..." : "Create Form"}
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 text-white h-9"
          >
            Import Form
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportForm}
            accept=".json"
            className="hidden"
          />
          <Button onClick={handleBack} className="bg-gray-500 text-white h-9">
            Back
          </Button>
        </div>
      </div>
      <div className="flex flex-1 border-1 border-gray-300">
        <div ref={containerRef} className="flex-1 relative h-[750px]" />
        <div
          ref={propertiesPanelRef}
          className="border-0 border-l-1 border-gray-300 w-[300px] h-[750px] overflow-x-hidden overflow-auto"
        />
      </div>
      {status && (
        <div className="text-center">
          <p
            className={`text-sm font-semibold ${
              status.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {status}
          </p>
        </div>
      )}
    </div>
  );
};

export default FormModeler;
