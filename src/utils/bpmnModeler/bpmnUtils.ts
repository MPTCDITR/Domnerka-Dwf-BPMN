import baseSchema from "../bpmnModeler/BpmnSchema.bpmn";

export const generateBpmnXml = async (name: string) => {
  try {
    const response = await fetch(baseSchema);
    const bpmnSchema = await response.text();

    const randomKey = `process_${crypto.randomUUID()}`;
    return bpmnSchema
      .replace(/%IDPLACEHOLDER%/g, randomKey)
      .replace(/%NAMEPLACEHOLDER%/g, name);
  } catch (error) {
    console.error("Error loading BPMN schema:", error);
    throw new Error("Failed to load BPMN schema");
  }
};
