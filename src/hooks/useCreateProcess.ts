import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { BPMN_PROCESS_URL } from "@/services/URLs";
import { generateBpmnXml } from "@/utils/bpmnModeler/bpmnUtils";

export const useCreateProcess = () => {
  const [status, setStatus] = useState("");
  const [deploymentId, setDeploymentId] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleDeploy = async (values: {
    processName: string;
    description?: string;
    isFeatured: boolean;
  }) => {
    if (!auth.isAuthenticated || !auth.user?.access_token) {
      setStatus("Error: Unauthorized - Please log in first");
      return;
    }

    const token = auth.user.access_token;

    try {
      setStatus("Deploying...");

      const bpmnXml = await generateBpmnXml(values.processName);

      const requestBody = {
        bpmn: bpmnXml,
        description: values.description || "No description",
        processName: values.processName,
        isFeatured: values.isFeatured,
      };

      const response = await fetch(BPMN_PROCESS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      let deploymentId;
      try {
        const data = JSON.parse(responseText);
        deploymentId = data.deploymentId;
      } catch (error) {
        console.error("Failed to parse deployment ID:", error);
        deploymentId = responseText;
      }

      if (!deploymentId) {
        throw new Error("Invalid response: No deployment ID received");
      }

      setDeploymentId(deploymentId);
      setStatus(
        `Process deployed successfully! Deployment ID: ${deploymentId}`
      );

      navigate("/process/process_list");
    } catch (error: unknown) {
      console.error("Deployment error:", error);
      setStatus(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error: Failed to deploy process - Check console for details"
      );
    }
  };

  return { status, deploymentId, handleDeploy };
};
