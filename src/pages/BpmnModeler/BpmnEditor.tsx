
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import BpmnModeler from "bpmn-js/lib/Modeler";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";
import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";
import lintModule from "bpmn-js-bpmnlint";
import { Button } from "@/components/ui/button";
import { BPMN_PROCESS_URL } from "@/services/URLs";
import BpmnModdle from "bpmn-moddle";
import baseSchema from "../BpmnModeler/BpmnSchema.bpmn";
import customFormListDescriptor from "./descriptors/customFormListDescriptor.json";
import CustomPaletteProvider from "./provider/palette/CustomPaletteProvider";

import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
import "@bpmn-io/properties-panel/dist/assets/properties-panel.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bpmnlintConfig from "./bpmnlint/packed-config";

const BpmnEditor: React.FC = () => {
  const { id: bpmnID } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const propertiesPanelRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bpmnModelerRef = useRef<BpmnModeler | null>(null);
  const [processName, setProcessName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [bpmnKey, setBpmnKey] = useState<string>("");
  const [isValue, setIsValue] = useState(true);
  const [isClearAll, setIsClearAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const moddle = new BpmnModdle();

  useEffect(() => {
    if (!containerRef.current || !propertiesPanelRef.current || !bpmnID) return;

    const initializeModeler = () => {
      const modeler = new BpmnModeler({
        container: containerRef.current ?? document.body,
        propertiesPanel: { parent: propertiesPanelRef.current },
        linting: {
          bpmnlint: bpmnlintConfig,
        },
        additionalModules: [
          BpmnPropertiesPanelModule,
          BpmnPropertiesProviderModule,
          CamundaPlatformPropertiesProviderModule,
          lintModule,
          CustomPaletteProvider,
        ],
        moddleExtensions: {
          camunda: CamundaBpmnModdle,
          customFormList: customFormListDescriptor,
        },
      });

      bpmnModelerRef.current = modeler;
      return modeler;
    };


    const fetchDataAndImportXML = async (modeler: BpmnModeler) => {
      try {
        if (!modeler) throw new Error("Modeler not initialized");
        setStatus("Loading BPMN data...");
        if (!auth.isAuthenticated || !auth.user?.access_token) {
          throw new Error("Unauthorized");
        }
    
        const token = auth.user.access_token;
        const response = await fetch(`${BPMN_PROCESS_URL}/${bpmnID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
    
        const data = await response.json();
        const { bpmn, processDefinitionDto, description, isFeatured } = data;
        setProcessName(processDefinitionDto.name || "Default Process");
        setDescription(description || "No description");
        setIsFeatured(isFeatured || false);
        setBpmnKey(processDefinitionDto.key);
    
        let xmlToImport = localStorage.getItem(`bpmn-${bpmnID}`) || bpmn;
        const { error: parseError } = await moddle.fromXML(xmlToImport);
        if (parseError) {
          xmlToImport = bpmn;
        }
    
        await modeler.importXML(xmlToImport);
        setIsValue(!localStorage.getItem(`bpmn-${bpmnID}`));
        setStatus("BPMN data loaded successfully");
      } catch (error: any) {
        setStatus(`Error: ${error.message}`);
    
        // Use baseSchema directly as a string
        const initialXml = baseSchema
          .replace("%IDPLACEHOLDER%", bpmnKey || `process_${bpmnID || "default"}`)
          .replace("%NAMEPLACEHOLDER%", processName || "Default Process");
        await modeler.importXML(initialXml);
        setIsValue(true);
      }
    };

    const modeler = initializeModeler();
    fetchDataAndImportXML(modeler);

    const handleElementChanged = async () => {
      try {
        const result = await modeler.saveXML({ format: true });
        if (!result?.xml) {
          return;
        }

        const response = await fetch(baseSchema);
        const baseXml = await response.text();
        if (baseXml === result.xml) {
          setIsValue(true);
        } else {
          localStorage.setItem(`bpmn-${bpmnID}`, result.xml);
          setIsValue(false);
        }
      } catch (error) {
        console.error("Failed to save XML:", error);
      }
    };

    modeler.on("element.changed", handleElementChanged);

    if (isClearAll) {
      modeler.destroy();
      localStorage.removeItem(`bpmn-${bpmnID}`);
      setIsValue(true);
      setIsClearAll(false);
      bpmnModelerRef.current = null;
    }

    return () => {
      modeler.off("element.changed", handleElementChanged);
      modeler.destroy();
      bpmnModelerRef.current = null;
    };
  }, [bpmnID, auth, isClearAll, bpmnKey, processName]);

  const updateBpmnXml = async (xmlStr: string): Promise<string> => {
    try {
      const { rootElement: definitions } = await moddle.fromXML(xmlStr);
      const process = definitions.rootElements.find(
        (el: { $type: string }) => el.$type === "bpmn:Process"
      );

      if (!process) {
        throw new Error("No bpmn:Process found in XML");
      }

      const oldProcessId = process.id;
      process.id = bpmnKey;
      process.name = processName || "Updated Process";

      if (!definitions.$attrs["xmlns:camunda"]) {
        definitions.$attrs["xmlns:camunda"] =
          "http://camunda.org/schema/1.0/bpmn";
      }

      process.$attrs["camunda:historyTimeToLive"] =
        process.$attrs["camunda:historyTimeToLive"] || "P180D";

      const diagram = definitions.diagrams?.[0];
      if (diagram && diagram.plane) {
        diagram.plane.bpmnElement = process.id;
      }

      definitions.rootElements.forEach((element: any) => {
        if (element.$type === "bpmn:Collaboration" && element.participants) {
          element.participants.forEach((participant: any) => {
            if (participant.processRef?.id === oldProcessId) {
              participant.processRef = process;
            }
          });
        }
      });

      const { xml: xmlStrUpdated } = await moddle.toXML(definitions, {
        format: true,
      });
      return xmlStrUpdated;
    } catch (error) {
      console.error("Failed to update BPMN XML:", error);
      throw error;
    }
  };

  const handleSaveToBackend = async () => {
    try {
      if (
        !bpmnModelerRef.current ||
        !bpmnKey ||
        !auth.isAuthenticated ||
        !auth.user?.access_token
      ) {
        setStatus("Error: Unauthorized or missing key");
        return;
      }

      if (!confirm("Do you want to save your changes?")) return;
      setIsLoading(true);

      const result = await bpmnModelerRef.current.saveXML({ format: true });
      if (!result?.xml) {
        throw new Error("Failed to generate BPMN XML");
      }

      const updatedXml = await updateBpmnXml(result.xml);
      const bpmnProcessDto = {
        bpmn: updatedXml,
        processName: processName || "Updated Process",
        description: description || "Updated process description",
        isFeatured,
      };

      const token = auth.user.access_token;
      const response = await fetch(`${BPMN_PROCESS_URL}/process/${bpmnKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(bpmnProcessDto),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      localStorage.removeItem(`bpmn-${bpmnID}`);
      setIsValue(true);
      setStatus("BPMN saved successfully");
      navigate("/process/process_list");
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => setIsClearAll(true);

  const handleImport = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !bpmnModelerRef.current) {
      setStatus("Error: No file selected or modeler not initialized");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target?.result as string;
      if (!fileData) {
        setStatus("Error: Failed to read file");
        return;
      }

      try {
        const updatedXml = await updateBpmnXml(fileData);
        await bpmnModelerRef.current!.importXML(updatedXml);
        setIsValue(false);
        localStorage.setItem(`bpmn-${bpmnID}`, updatedXml);
        setStatus("BPMN imported and updated successfully");
      } catch (error) {
        setStatus(
          `Error: Failed to import BPMN - ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    };
    reader.readAsText(file);
  };


  return (
    <div className="p-4 bg-white rounded shadow-lg">
      <div className="flex" style={{ height: "75vh" }}>
        <div
          ref={containerRef}
          className="flex-grow-1 rounded border position-relative"
        >
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              onClick={handleSaveToBackend}
              disabled={isValue || isLoading || !auth.isAuthenticated}
              className="bg-primary text-white"
            >
              {isLoading ? "Saving..." : "Save BPMN"}
            </Button>
            <Button
              onClick={handleClearAll}
              disabled={isValue}
              className="bg-red-500 text-white"
            >
              Clear All
            </Button>
            <Button onClick={handleImport} className="bg-gray-500 text-white">
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".bpmn"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        <div ref={propertiesPanelRef} className="w-[30vh] rounded border-l" />
      </div>
      <Button
        onClick={() => navigate("/process/process_list")}
        className="mt-4 bg-primary text-white"
      >
        Back
      </Button>
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