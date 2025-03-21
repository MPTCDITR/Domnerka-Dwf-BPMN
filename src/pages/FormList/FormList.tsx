import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useFormList } from "@/hooks/useFormList";

const FormList = () => {
  const {
    forms,
    loading,
    error,
    handleBack,
    handleCreateNew,
    handleEditForm,
    handleDeleteForm,
  } = useFormList();

  if (loading) {
    return <div className="text-center p-4">Loading forms...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        Error: {error}
        <Button onClick={handleBack} className="ml-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Form List</h2>
        <div className="space-x-4">
          <Button onClick={handleCreateNew}>Create Form</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Form Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No forms found
              </TableCell>
            </TableRow>
          ) : (
            forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell>{form.name}</TableCell>
                <TableCell>
                  {form.createdAt
                    ? new Date(form.createdAt).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditForm(form.id)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteForm(form.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FormList;