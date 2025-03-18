import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router-dom";
import { FormEditor } from "@bpmn-io/form-js-editor";
import "@bpmn-io/form-js-editor/dist/assets/form-js-editor.css";
import "@bpmn-io/form-js-editor/dist/assets/properties-panel.css";
import { Button } from "@/components/ui/button";
import { FORM_URL } from "@/services/URLs";

const EditForm: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const propertiesPanelRef = useRef<HTMLDivElement>(null);
  const formEditorRef = useRef<FormEditor | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasFetched = useRef(false);

  const [schema, setSchema] = useState<any>(null);
  const [formName, setFormName] = useState<string>("");
  const [formKey, setFormKey] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchFormData = useCallback(async () => {
    if (!auth.isAuthenticated || !auth.user?.access_token || !id) {
      setStatus("Error: Authentication required or invalid form ID");
      setIsLoading(false);
      return;
    }

    try {
      const token = auth.user.access_token;
      const response = await fetch(`${FORM_URL}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch form data: ${response.statusText}`);
      }

      const formData = await response.json();

      setFormName(formData.name || "");
      setFormKey(formData.key || "");

      let parsedSchema;
      if (!formData.schema) {
        parsedSchema = { type: "default", components: [] };
      } else {
        try {
          parsedSchema = JSON.parse(formData.schema);
          if (!parsedSchema.type) {
            parsedSchema.type = "default";
          }
          if (!Array.isArray(parsedSchema.components)) {
            parsedSchema.components = [];
          }
        } catch (parseError: unknown) {
          const error = parseError as Error;
          console.error("Schema parsing failed:", error.message);
          setStatus(
            `Error: Invalid schema format from server - ${error.message}`
          );
          parsedSchema = { type: "default", components: [] };
        }
      }

      setSchema(parsedSchema);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [auth, id]);

  // Fetch data only once on mount
  useEffect(() => {
    if (!hasFetched.current) {
      fetchFormData();
      hasFetched.current = true;
    }
  }, [fetchFormData]);

  useEffect(() => {
    if (!schema || !containerRef.current || !propertiesPanelRef.current) {
      return;
    }

    if (formEditorRef.current) {
      formEditorRef.current.destroy();
      formEditorRef.current = null;
    }

    if (propertiesPanelRef.current) {
      propertiesPanelRef.current.innerHTML = "";
    }

    try {
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

      formEditorRef.current
        .importSchema(schema)
        .then(() => {
          setIsLoading(false);
        })
        .catch((err: Error) => {
          console.error("Failed to import schema:", err);
          setStatus(`Error: Failed to import schema - ${err.message}`);
          setIsLoading(false);
        });

      formEditorRef.current.on("changed", () => {
        const updatedSchema = formEditorRef.current?.getSchema();
        setSchema(updatedSchema);
      });
    } catch (error: any) {
      setStatus(`Error initializing editor: ${error.message}`);
      setIsLoading(false);
    }

    return () => {
      if (formEditorRef.current) {
        formEditorRef.current.destroy();
        formEditorRef.current = null;
      }
      if (propertiesPanelRef.current) {
        propertiesPanelRef.current.innerHTML = "";
      }
    };
  }, [schema]);

  const handleUpdateForm = async () => {
    if (!auth.isAuthenticated || !auth.user?.access_token) {
      setStatus("Error: Please log in to update a form");
      return;
    }

    if (!formName || !formKey) {
      setStatus("Error: Form name and key are required");
      return;
    }

    if (!schema?.components?.length) {
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

      const response = await fetch(`${FORM_URL}/${formKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(formDto),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update form: ${errorText}`);
      }

      const result = await response.text();
      setStatus(result);
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

  const handleReset = () => {
    setIsLoading(true);
    hasFetched.current = false;
    fetchFormData();
  };

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
            setStatus(`Error import form: ${err.message}`);
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
            onClick={handleUpdateForm}
            disabled={isLoading || !formName || !schema?.components?.length}
            className="bg-blue-500 text-white h-9"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button onClick={handleReset} className="bg-red-500 text-white h-9">
            Clear all
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-500 text-white h-9"
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

export default EditForm;
