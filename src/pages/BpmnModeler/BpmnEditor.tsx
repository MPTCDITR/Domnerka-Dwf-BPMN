import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  FaSave,
  FaTrash,
  FaDownload,
  FaUpload,
  FaArrowLeft,
} from "react-icons/fa";
import { useBpmnEditor } from "@/hooks/useBpmnEditor";

const BpmnEditor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const propertiesPanelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isValue,
    isLoading,
    status,
    handleSaveToBackend,
    handleClearAll,
    handleImport,
    handleFileChange,
    handleDownload,
    navigate,
    auth,
  } = useBpmnEditor({ 
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    propertiesPanelRef: propertiesPanelRef as React.RefObject<HTMLDivElement>,
    fileInputRef: fileInputRef as React.RefObject<HTMLInputElement>,
  });

  return (
    <div className="p-4 bg-white rounded shadow-lg">
      <div className="flex" style={{ height: "75vh" }}>
        <div
          ref={containerRef}
          className="flex-grow-1 rounded border position-relative"
        ></div>
        <div ref={propertiesPanelRef} className="w-[30vh] rounded" />
      </div>
      <div className="flex w-full justify-between">
        <Button
          onClick={() => navigate("/process/process_list")}
          className="mt-4 bg-primary text-white flex items-center gap-2"
        >
          <FaArrowLeft />
          Back
        </Button>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleDownload}
            disabled={isLoading}
            className="bg-blue-500 text-white"
          >
            <FaDownload />
            {isLoading ? "Downloading..." : " "}
          </Button>
          <Button onClick={handleImport} className="bg-gray-500 text-white">
            <FaUpload />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".bpmn"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            onClick={handleClearAll}
            disabled={isValue}
            className="bg-red-500 text-white"
          >
            <FaTrash />
            Clear All
          </Button>
          <Button
            onClick={handleSaveToBackend}
            disabled={isValue || isLoading || !auth.isAuthenticated}
            className="bg-primary text-white"
          >
            <FaSave />
            {isLoading ? "Saving..." : "Save BPMN"}
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2"></div>
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

export default BpmnEditor;