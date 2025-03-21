import { FormSelectorEntryProps } from './props/FormListProps';
import { is } from 'bpmn-js/lib/util/ModelUtil';

interface PropertiesPanel {
  registerProvider(priority: number, provider: FormListPropertiesProvider): void;
}

const LOW_PRIORITY = 500;

export default class FormListPropertiesProvider {
  private propertiesPanel: PropertiesPanel;
  private translate: (key: string) => string;

  constructor(propertiesPanel: PropertiesPanel, translate: (key: string) => string) {
    this.propertiesPanel = propertiesPanel;
    this.translate = translate;
    this.propertiesPanel.registerProvider(LOW_PRIORITY, this);
  }

  getGroups(element: any): (groups: any[]) => any[] {
    return (groups: any[]) => {
      if (is(element, 'bpmn:UserTask')) {
        groups.push({
          id: 'CustomFormList',
          label: this.translate('Forms List'),
          entries: FormSelectorEntryProps(element),
        });
      }
      return groups;
    };
  }
}