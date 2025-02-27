// src/pages/ProcessListPage.tsx
import React, { useState, useEffect } from "react";
import {
  fetchBpmnProcesses,
  handleCreateProcess,
  handleDeleteProcess,
} from "@/services/bpmnService";
import { useAxios } from "@/hooks/useAxios";

import { BpmnProcess } from "@/types/bpmnTypes";
import ProcessTable from "./ProcessTable";
import CreateProcessDialog from "./CreateProcessDialog";
// import baseSchema from "@/pages/BpmnModeler/BpmnSchema.bpmn";
import { Button } from "@/components/ui/button";

const ProcessListPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch processes on mount
  const axiosInstance = useAxios();
  const [processes, setProcesses] = useState<BpmnProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProcesses = async () => {
    setLoading(true);
    try {
      const data = await fetchBpmnProcesses(axiosInstance);
      setProcesses(data);
    } catch (err) {
      setError("Failed to fetch processes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProcesses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Handle process creation
  const handleCreate = async () => {
    try {
      const newProcess = await handleCreateProcess(
        axiosInstance,
        "New Process",
        "<bpmn>...</bpmn>",
        "Description",
        false
      );
      console.log("Created process:", newProcess);
      await loadProcesses(); // Refresh the list after creating
    } catch (err) {
      setError("Failed to create process");
    }
  };

  const handleDelete = async (processId: string) => {
    try {
      await handleDeleteProcess(axiosInstance, processId);
      console.log("Deleted process:", processId);
      await loadProcesses(); // Refresh the list after deleting
    } catch (err) {
      setError("Failed to delete process");
    }
  };

  return (
    <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-8xl">
      {/* <button onClick={() => setIsDialogOpen(true)}>Create New Process</button> */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Processes</h1>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            Create new
          </Button> */}
          <CreateProcessDialog />
        </div>
      </div>
      <ProcessTable processes={processes} onDelete={handleDelete} />
      {/* <CreateProcessDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreate}
      /> */}
    </main>
  );
};

export default ProcessListPage;
