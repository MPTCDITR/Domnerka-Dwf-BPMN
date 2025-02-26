import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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

const schema = z.object({
  processName: z.string().min(1, "Process Name is required"),
  description: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

const EditProcess = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [bpmnXml, setBpmnXml] = useState<string>("");
  const [processKey, setProcessKey] = useState<string>("");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
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

      const updateUrl = `${BPMN_PROCESS_URL}/process/${processKey}`;

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
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      setStatus("Process updated successfully!");
      navigate("/process/process_list");
    } catch (error) {
      console.error("Update error:", error);
      setStatus(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error: Failed to update process"
      );
    }
  };

  const handleBack = () => {
    navigate("/process/process_list");
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Edit Process</h2>
      {loading ? (
        <p className="text-center">Loading process data...</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
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
                    <FormLabel>Set as Featured Process</FormLabel>
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
                Cancel
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
      )}
      {status && (
        <div className="mt-4 text-center">
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

export default EditProcess;