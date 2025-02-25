import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BPMN_PROCESS_URL } from "@/services/URLs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import baseSchema from "../BpmnModeler/BpmnSchema.bpmn";

const schema = z.object({
  processName: z.string().min(1, "Process Name is required"),
  description: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

const CreateProcess = () => {
  const [status, setStatus] = useState("");
  const [deploymentId, setDeploymentId] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      processName: "",
      description: "",
      isFeatured: false,
    },
  });

  const generateBpmnXml = async (name: string) => {
    try {
      const response = await fetch(baseSchema);
      const bpmnSchema = await response.text();

      const randomKey = `process_${crypto.randomUUID()}`;
      return bpmnSchema
        .replace(/%IDPLACEHOLDER%/g, randomKey)
        .replace(/%NAMEPLACEHOLDER%/g, name);
    } catch (error) {
      console.error("Error loading BPMN schema:", error);
      throw new Error("Failed to load BPMN schema");
    }
  };

  const handleDeploy = async (values: FormValues) => {
    if (!auth.isAuthenticated || !auth.user?.access_token) {
      setStatus("Error: Unauthorized - Please log in first");
      return;
    }

    const token = auth.user.access_token;

    try {
      setStatus("Deploying...");

      const bpmnXml = await generateBpmnXml(values.processName);

      const requestBody = {
        bpmn: bpmnXml,
        description: values.description || "No description",
        processName: values.processName,
        isFeatured: values.isFeatured,
      };

      const response = await fetch(BPMN_PROCESS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      let deploymentId;
      try {
        const data = JSON.parse(responseText);
        deploymentId = data.deploymentId;
      } catch (error) {
        deploymentId = responseText;
      }

      if (!deploymentId) {
        throw new Error("Invalid response: No deployment ID received");
      }

      setDeploymentId(deploymentId);
      setStatus(
        `Process deployed successfully! Deployment ID: ${deploymentId}`
      );
    } catch (error: unknown) {
      console.error("Deployment error:", error);
      setStatus(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error: Failed to deploy process - Check console for details"
      );
    }
  };
  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Create Process</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleDeploy)} className="space-y-4">
          <FormField
            control={form.control}
            name="processName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Process Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter process name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Set is Feature Process</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <div className="w-full flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="w-20"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={auth.isLoading || form.formState.isSubmitting}
              className="w-20"
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
      {status && (
        <div className="mt-4 text-center">
          <p
            className={`text-sm font-semibold ${
              status.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {status}
          </p>
          {deploymentId && (
            <p className="text-sm text-gray-500">
              Deployment ID: {deploymentId}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateProcess;
