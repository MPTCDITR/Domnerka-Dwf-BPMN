import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useProcessList } from "@/hooks/useProcessList";

const ProcessList = () => {
  const { processes, loading, error, handleDeleteProcess } = useProcessList();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/process_list");
  };

  const handleCreateNew = () => {
    navigate("/process/create_process");
  };

  const handleEditProcess = (id: string) => {
    navigate(`/process/${id}`);
  };

  const handleUpdateProcess = (id: string) => {
    navigate(`/process/edit_process/${id}`);
  };

  if (loading) {
    return <div className="text-center p-4">Loading processes...</div>;
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
        <h2 className="text-2xl font-semibold">Process List</h2>
        <div className="space-x-4">
          <Button onClick={handleCreateNew}>Create New Process</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Process Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No processes found
              </TableCell>
            </TableRow>
          ) : (
            processes.map((process) => (
              <TableRow key={process.key}>
                <TableCell>{process.name}</TableCell>
                <TableCell>{process.description || "N/A"}</TableCell>
                <TableCell>
                  {process.createdAt
                    ? new Date(process.createdAt).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProcess(process.id)}
                    >
                      Edit Modeler
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateProcess(process.id)}
                    >
                      Edit Process
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProcess(process.key)}
                    >
                      Delete
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

export default ProcessList;
