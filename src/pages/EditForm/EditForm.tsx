import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  FaSave,
  FaTrash,
  FaDownload,
  FaUpload,
  FaArrowLeft,
} from "react-icons/fa";
import { useFormEditor } from "@/hooks/useFormEditor";

const EditForm: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const propertiesPanelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    formName,
    setFormName,
    schema,
    status,
    isLoading,
    handleUpdateForm,
    handleBack,
    handleReset,
    handleImportForm,
    handleDownloadForm,
  } = useFormEditor({ containerRef, propertiesPanelRef, fileInputRef });

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row items-center justify-center w-full gap-5 p-4">
        <div>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="border rounded w-[50rem] h-9 p-4"
            placeholder="Form Name"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={handleDownloadForm}
            disabled={isLoading}
            className="bg-blue-500 text-white"
          >
            <FaDownload />
            {isLoading ? "Downloading..." : " "}
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-500 text-white"
          >
            <FaUpload />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportForm}
            accept=".json"
            className="hidden"
          />
          <Button onClick={handleReset} className="bg-red-500 text-white">
            <FaTrash />
            Clear all
          </Button>
          <Button
            onClick={handleUpdateForm}
            disabled={isLoading || !formName || !schema?.components?.length}
            className="bg-primary text-white"
          >
            <FaSave />
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      <div className="flex flex-1 border-1 border-gray-300">
        <div ref={containerRef} className="flex-1 relative h-[750px]" />
        <div
          ref={propertiesPanelRef}
          className="border-0 border-l-1 border-gray-300 w-[300px] h-[750px] overflow-x-hidden overflow-auto"
        />
      </div>
      <Button
        onClick={handleBack}
        className="w-[5rem] m-4 bg-primary text-white flex items-center gap-2"
      >
        <FaArrowLeft />
        Back
      </Button>
      {status && (
        <div className="text-center">
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

export default EditForm;