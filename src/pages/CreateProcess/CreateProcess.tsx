import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useCreateProcess } from "@/hooks/useCreateProcess";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  processName: z.string().min(1, "Process Name is required"),
  description: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

const CreateProcess = () => {
  const { status, deploymentId, handleDeploy } = useCreateProcess();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      processName: "",
      description: "",
      isFeatured: false,
    },
  });

  const handleBack = () => {
    navigate("/process/process_list");
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Create Process
      </h2>
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
              disabled={form.formState.isSubmitting}
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
