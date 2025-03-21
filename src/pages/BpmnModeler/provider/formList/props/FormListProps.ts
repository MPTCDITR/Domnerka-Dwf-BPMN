import { html } from "htm/preact";
import { useService } from "bpmn-js-properties-panel";
import { useEffect, useState } from "@bpmn-io/properties-panel/preact/hooks";
import { Element } from "bpmn-js/lib/model/Types";
import { FORM_URL } from "@/services/URLs";

interface FormItem {
  key: string;
  name: string;
}

interface FormSelectorProps {
  element: Element;
  id: string;
}

const FormSelector = (props: FormSelectorProps) => {
  const modeling = useService("modeling");
  const translate = useService("translate");
  const authService = useService("authService");
  const { element, id } = props;

  const [formQueryParam, setFormQueryParam] = useState<Record<string, string>>({});
  const [formListData, setFormListData] = useState<FormItem[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>(
    element.businessObject.formRef || '',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      setIsLoading(true);
      setError(null);

      if (!authService?.isAuthenticated || !authService?.token) {
        setError("Please log in to view forms");
        setIsLoading(false);
        return;
      }

      try {
        const token = authService.token;
        const response = await fetch(`${FORM_URL}?size=10`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch forms: ${response.status}`);
        }

        const data = await response.json();
        setFormListData(data.items || []);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
      }
    };

    fetchForms();
  }, [formQueryParam, authService]);

  useEffect(() => {
    const currentFormKey = element.businessObject.formRef || '';
    if (currentFormKey !== selectedValue) {
      setSelectedValue(currentFormKey);
    }
  }, [element.businessObject]);

  const updateFormKey = (value: string) => {
    if (value === selectedValue) return;

    setSelectedValue(value);
    modeling.updateProperties(element, {
      formRef: value,
    });
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    updateFormKey(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Search changed:', e.target.value);
    const searchValue = e.target.value;
    setFormQueryParam({ search: searchValue });
  };

  return html`
    <div id=${id} class="bio-properties-panel-entry">
      <input
        class="bio-properties-panel-input"
        type="text"
        placeholder=${translate("Search form by name")}
        onInput=${handleSearchChange}
      />
      <select
        id=${id}
        name=${id}
        class="bio-properties-panel-input"
        style="margin-top: 4px"
        value=${selectedValue}
        onChange=${handleSelectChange}
        disabled=${isLoading}
      >
        <option value="">${translate("Select a form")}</option>
        ${formListData.map(
          (form) => html`<option value=${form.key}>
            <p>${form.name}</p>
            <span>: </span>
            <p style="margin-left: 4px">${form.key}</p>
          </option>`,
        )}
      </select>
      ${isLoading && html`<span>Loading forms...</span>`}
      ${error && html`<span class="bio-properties-panel-error">${error}</span>`}
    </div>
  `;
};

export function FormSelectorEntryProps(element: Element) {
  return [
    {
      id: "formSelectorEntry",
      element,
      component: FormSelector,
      isEdited: () => false,
    },
  ];
}