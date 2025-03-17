import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FORM_URL } from "@/services/URLs";

interface FormDefinition {
  id: string;
  key: string;
  name: string;
  description?: string;
  createdAt?: string;
  version?: number;
}

const FormList = () => {
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
      setError(err instanceof Error ? err.message : "An error occurred during deletion");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading forms...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        Error: {error}
        <Button onClick={handleBack} className="ml-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Form List</h2>
        <div className="space-x-4">
          <Button onClick={handleCreateNew}>Create Form</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Form Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No forms found
              </TableCell>
            </TableRow>
          ) : (
            forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell>{form.name}</TableCell>
                <TableCell>{form.description || "N/A"}</TableCell>
                <TableCell>
                  {form.createdAt
                    ? new Date(form.createdAt).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditForm(form.id)}
                    >
                      Edit Form
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteForm(form.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FormList;