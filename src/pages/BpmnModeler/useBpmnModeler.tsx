// src/hooks/useBpmnModeler.ts
import { useEffect, useRef } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
// import propertiesPanelModule from "bpmn-js-properties-panel";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";

import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";
import lintModule from "bpmn-js-bpmnlint";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bpmnlintConfig from "./bpmnlint/packed-config";

import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
import "@bpmn-io/properties-panel/dist/assets/properties-panel.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

export const useBpmnModeler = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const propertiesPanelRef = useRef<HTMLDivElement | null>(null);
  const bpmnModelerRef = useRef<BpmnModeler | null>(null);

  useEffect(() => {
    if (!containerRef.current || !propertiesPanelRef.current) return;

    const bpmnModeler = new BpmnModeler({
      container: containerRef.current,
      propertiesPanel: {
        parent: propertiesPanelRef.current,
      },
      additionalModules: [
        // propertiesPanelModule,
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
        lintModule,
      ],
      moddleExtensions: { camunda: CamundaBpmnModdle },
    });

    bpmnModelerRef.current = bpmnModeler;
    bpmnModelerRef.current.createDiagram();

    return () => {
      bpmnModeler.destroy();
    };
  }, []);

  // Load a BPMN diagram into the editor
  const loadDiagram = async (xml: string) => {
    if (bpmnModelerRef.current) {
      try {
        await bpmnModelerRef.current.importXML(xml);
      } catch (error) {
        console.error("Error loading diagram:", error);
        throw new Error("Failed to load diagram");
      }
    }
  };

  // Export the current BPMN diagram
  const exportDiagram = async () => {
    if (bpmnModelerRef.current) {
      try {
        const { xml } = await bpmnModelerRef.current.saveXML({ format: true });
        return xml;
      } catch (error) {
        console.error("Error exporting diagram:", error);
        throw new Error("Failed to export diagram");
      }
    }
    return "";
  };

  return { containerRef, propertiesPanelRef, loadDiagram, exportDiagram };
};
