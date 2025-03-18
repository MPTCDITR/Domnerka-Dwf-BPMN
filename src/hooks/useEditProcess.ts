import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BPMN_PROCESS_URL } from "@/services/URLs";

const schema = z.object({
  processName: z.string().min(1, "Process Name is required"),
  description: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

export const useEditProcess = (id: string | undefined) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [bpmnXml, setBpmnXml] = useState<string>("");
  const [processKey, setProcessKey] = useState<string>("");
  const auth = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      processName: "",
      description: "",
      isFeatured: false,
    },
  });

  useEffect(() => {
    const fetchProcessData = async () => {
      if (!auth.isAuthenticated || !auth.user?.access_token || !id) {
        setStatus("Error: Unauthorized or invalid process ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = auth.user.access_token;

        const response = await fetch(`${BPMN_PROCESS_URL}/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();

        const processData = data.processDefinitionDto;
        setBpmnXml(data.bpmn);
        setProcessKey(processData.key);

        form.reset({
          processName: processData.name || "",
          description: data.description || "",
          isFeatured: data.isFeatured || false,
        });

        setStatus("Process data loaded successfully");
      } catch (error) {
        console.error("Error fetching process data:", error);
        setStatus(
          error instanceof Error
            ? `Error: ${error.message}`
            : "Error: Failed to load process data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProcessData();
  }, [auth, id, form]);

  const handleUpdate = async (values: FormValues) => {
    if (!auth.isAuthenticated || !auth.user?.access_token || !processKey) {
      setStatus("Error: Unauthorized, invalid process ID, or missing key");
      return;
    }

    const token = auth.user.access_token;

    try {
      setStatus("Updating...");

      const requestBody = {
        processName: values.processName,
        description: values.description || "",
        isFeatured: values.isFeatured,
        bpmn: bpmnXml,
      };

      const updateUrl = `${BPMN_PROCESS_URL}/${processKey}`;

      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      setStatus("Process updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      setStatus(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error: Failed to update process"
      );
    }
  };

  return { status, loading, form, handleUpdate };
};
