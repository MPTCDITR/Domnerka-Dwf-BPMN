// src/components/BpmnEditor.tsx
import React, { useState } from "react";
import { useBpmnModeler } from "./useBpmnModeler";
import { createBpmnProcess, updateBpmnProcess } from "@/services/bpmnService";
import baseSchema from "./BpmnSchema.bpmn"; // Import the BPMN schema

const BpmnEditor: React.FC = () => {
  const { containerRef, propertiesPanelRef, loadDiagram, exportDiagram } =
    useBpmnModeler();
  const [processId, setProcessId] = useState<string | null>(null);

  const handleCreateProcess = async () => {
    try {
      const processName = prompt("Enter process name:");
      if (!processName) return;

      // Use the imported base schema as the initial XML
      const initialXml = baseSchema;

      const response = await createBpmnProcess(
        processName,
        initialXml,
        "Initial description",
        true
      );
      setProcessId(response.id); // Save the process ID
      await loadDiagram(initialXml); // Load the initial diagram
      alert("Process created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create process.");
    }
  };

  const handleSaveChanges = async () => {
    if (!processId) {
      alert("No process created yet.");
      return;
    }
    try {
      const xml = await exportDiagram();

      // Validate that xml is not undefined
      if (!xml) {
        throw new Error("Failed to export diagram. XML is undefined.");
      }

      // Pass the validated XML to the API
      await updateBpmnProcess(processId, xml);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save changes.");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div ref={containerRef} style={{ flex: 3 }} />
      <div
        ref={propertiesPanelRef}
        style={{ flex: 1, borderLeft: "1px solid #ccc" }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          display: "flex",
          gap: "10px",
        }}
      >
        <button onClick={handleCreateProcess} style={buttonStyle}>
          Create Process
        </button>
        <button onClick={handleSaveChanges} style={buttonStyle}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default BpmnEditor;
