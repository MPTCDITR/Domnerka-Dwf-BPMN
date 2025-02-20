import React, { useEffect, useRef } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";
import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";
import lintModule from "bpmn-js-bpmnlint";

import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
import "@bpmn-io/properties-panel/dist/assets/properties-panel.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bpmnlintConfig from "./bpmnlint/packed-config";
import axios from "axios";
import { Button } from "@/components/ui/button";

const BpmnEditor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const propertiesPanelRef = useRef<HTMLDivElement | null>(null);
  const bpmnModelerRef = useRef<BpmnModeler | null>(null);

  useEffect(() => {
    if (!containerRef.current || !propertiesPanelRef.current) return;

    // Initialize the BPMN Modeler
    bpmnModelerRef.current = new BpmnModeler({
      container: containerRef.current,
      propertiesPanel: {
        parent: propertiesPanelRef.current,
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
        lintModule,
      ],
      moddleExtensions: { camunda: CamundaBpmnModdle },
    });

    // Load an empty diagram
    bpmnModelerRef.current.createDiagram();

    // Cleanup function
    return () => {
      if (bpmnModelerRef.current) {
        bpmnModelerRef.current.destroy();
        bpmnModelerRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  const handleSave = async () => {
    try {
      if (!bpmnModelerRef.current) {
        throw new Error("BPMN Modeler instance is not available.");
      }

      const { xml } = await bpmnModelerRef.current.saveXML({ format: true });
      console.log("Saved BPMN XML:", xml);

      // Send the XML to the backend API
      const response = await axios.post("/api/save-bpmn", { bpmnXml: xml });
      console.log("API Response:", response.data);
      alert("Diagram saved successfully!");
    } catch (error) {
      console.error("Error saving diagram:", error);
      alert("Failed to save the diagram.");
    }
  };

  return (
    <div className="flex h-screen">
      <div ref={containerRef} style={{ flex: 3 }} />
      <div
        ref={propertiesPanelRef}
        style={{ flex: 1, borderLeft: "1px solid #ccc" }}
      />
      <Button
        onClick={handleSave}
        size="lg"
        className=" absolute bottom-5 right-5 "
      >
        Save Diagram
      </Button>
    </div>
  );
};

export default BpmnEditor;
