import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { BPMN_PROCESS_URL } from "@/services/URLs";

interface Process {
  id: string;
  key: string;
  name: string;
  description: string;
  isFeatured?: boolean;
  deploymentId: string;
  createdAt: string | null;
  version?: number;
  category?: string;
  resource?: string;
  suspended?: boolean;
}

export const useProcessList = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  useEffect(() => {
    const fetchProcesses = async () => {
      if (!auth.isAuthenticated || !auth.user?.access_token) {
        setError("Please log in to view processes");
        setLoading(false);
        return;
      }

      try {
        const token = auth.user.access_token;
        const response = await fetch(BPMN_PROCESS_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch processes");
        }

        const data = await response.json();
        setProcesses(data.items);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchProcesses();
  }, [auth]);

  const handleDeleteProcess = async (key: string) => {
    if (!auth.isAuthenticated || !auth.user?.access_token) {
      setError("Please log in to delete processes");
      return;
    }

    if (
      !confirm(`Are you sure you want to delete the process with key: ${key}?`)
    ) {
      return;
    }

    try {
      const token = auth.user.access_token;
      const response = await fetch(`${BPMN_PROCESS_URL}/${key}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete process: ${errorText}`);
      }

      setProcesses(processes.filter((process) => process.key !== key));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during deletion"
      );
    }
  };

  return { processes, loading, error, handleDeleteProcess };
};
