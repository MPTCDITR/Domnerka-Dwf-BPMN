import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { FORM_URL } from "@/services/URLs";

interface FormDefinition {
  id: string;
  key: string;
  name: string;
  createdAt?: string;
  version?: number;
}

export const useFormList = () => {
  const [forms, setForms] = useState<FormDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      if (!auth.isAuthenticated || !auth.user?.access_token) {
        setError("Please log in to view forms");
        setLoading(false);
        return;
      }

      try {
        const token = auth.user.access_token;
        const response = await fetch(`${FORM_URL}?size=10`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch forms");
        }

        const data = await response.json();
        setForms(data.items);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchForms();
  }, [auth]);

  const handleBack = () => {
    navigate("/form_list");
  };

  const handleCreateNew = () => {
    navigate("/form/form_modeler");
  };

  const handleEditForm = (id: string) => {
    navigate(`/form/form_modeler/${id}`);
  };

  const handleDeleteForm = async (id: string) => {
    if (!auth.isAuthenticated || !auth.user?.access_token) {
      setError("Please log in to delete forms");
      return;
    }

    if (!confirm(`Are you sure you want to delete the form with ID: ${id}?`)) {
      return;
    }

    try {
      const token = auth.user.access_token;
      const response = await fetch(`${FORM_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete form: ${errorText}`);
      }

      setForms(forms.filter((form) => form.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during deletion"
      );
    }
  };

  return {
    forms,
    loading,
    error,
    handleBack,
    handleCreateNew,
    handleEditForm,
    handleDeleteForm,
  };
};