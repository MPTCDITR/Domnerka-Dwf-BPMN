// src/components/ProcessTable.tsx
import React from "react";
import { BpmnProcess } from "@/types/bpmnTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Edit, Trash, Eye } from "lucide-react";

interface ProcessTableProps {
  processes: BpmnProcess[];
  onDelete: (processId: string) => void;
}

const ProcessTable: React.FC<ProcessTableProps> = ({ processes, onDelete }) => {
  console.log("Processes:", processes);

  if (!Array.isArray(processes)) {
    return <div>No processes available.</div>;
  }
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name & ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes && processes.length > 0 ? (
              processes.map((process, index) => (
                <TableRow key={process.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{process.name}</div>
                      <div className="text-sm text-gray-500">{process.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{process.description}</TableCell>

                  <TableCell>
                    <Badge
                      className={`rounded-full text-xs font-medium ${
                        index !== 1
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {process.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-md">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-md">
                        <Edit className="h-4 w-4 text-blue-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-md">
                        <Trash className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <h1>No processes available</h1>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ProcessTable;
