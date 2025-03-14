import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormBuilder } from "formiojs";
import { FORM_URL } from "@/services/URLs";

const CreateForm: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [formName, setFormName] = useState<string>("");
  const [formSchema, setFormSchema] = useState<any>({
    components: [],
    id: `form_${Date.now()}`,
  });
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const builderRef = useRef<HTMLDivElement>(null);
  const formBuilderRef = useRef<any>(null);

  useEffect(() => {
    if (builderRef.current && !formBuilderRef.current) {
      formBuilderRef.current = new FormBuilder(builderRef.current, formSchema, {
        builder: true,
      });
      formBuilderRef.current.render().then(() => {
        formBuilderRef.current.on("change", () => {
          setFormSchema({ ...formBuilderRef.current.form, id: formSchema.id });
        });
      });
    }
    return () => {
      formBuilderRef.current?.destroy();
    };
  }, [formSchema.id]);

  const handleDeployForm = async () => {
    if (!auth.isAuthenticated || !auth.user?.access_token) {
      setStatus("Error: Please log in to deploy a form");
      return;
    }

    if (!formName) {
      setStatus("Error: Form name is required");
      return;
    }

    if (!formSchema.components.length) {
      setStatus("Error: Please add at least one component to the form");
      return;
    }

    try {
      setIsLoading(true);
      const token = auth.user.access_token;
      const formDto = {
        name: formName,
        schema: JSON.stringify(formSchema),
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
      setFormSchema({ components: [], id: `form_${Date.now()}` });

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
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Create New Form</h2>

      <div className="mb-4">
        <Input
          placeholder="Enter form name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="mb-4" ref={builderRef}></div>

      <div className="flex gap-4 mb-4">
        <Button
          onClick={handleDeployForm}
          disabled={isLoading || !formName || !formSchema.components.length}
          className="bg-green-500 text-white"
        >
          {isLoading ? "Deploying..." : "Deploy Form"}
        </Button>
        <Button onClick={handleBack} className="bg-gray-500 text-white">
          Back to Form List
        </Button>
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

export default CreateForm;