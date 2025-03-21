import { useNavigate, useParams } from "react-router-dom";
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
import { useEditProcess } from "@/hooks/useEditProcess";

const EditProcess = () => {
  const { id } = useParams<{ id: string }>();
  const { status, loading, form, handleUpdate } = useEditProcess(id);
  const navigate = useNavigate();

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
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="space-y-4"
          >
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
                disabled={form.formState.isSubmitting}
                onClick={handleBack}
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
