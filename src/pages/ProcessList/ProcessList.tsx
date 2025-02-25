// ProcessList.tsx
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
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
import { BPMN_PROCESS_URL } from "@/services/URLs";

interface Process {
  id: string;
  name: string;
  description: string;
  isFeatured: boolean;
  deploymentId: string;
  createdAt: string;
}

const ProcessList = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProcesses = async () => {
      if (!auth.isAuthenticated || !auth.user?.access_token) {
        setError("Please log in to view processes");
        setLoading(false);
        return;
      }

      try {
        const token = auth.user.access_token;
        const response = await fetch(BPMN_PROCESS_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch processes");
        }

        const data = await response.json();
        setProcesses(data.items);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchProcesses();
  }, [auth]);

  const handleBack = () => {
    navigate("/process_list");
  };

  const handleCreateNew = () => {
    navigate("/process/create_process");
  };

  const handleEditProcess = (id: string) => {
    navigate(`/process/${id}`);
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
              <TableRow key={process.id}>
                <TableCell>{process.name}</TableCell>
                <TableCell>{process.description || "N/A"}</TableCell>
                <TableCell>
                  {new Date(process.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProcess(process.id)}
                  >
                    Edit in BPMN Editor
                  </Button>
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