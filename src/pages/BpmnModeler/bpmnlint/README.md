# bpmnlint

[[bpmn-js-bpmnlint](https://github.com/bpmn-io/bpmn-js-bpmnlint)]
[[bpmnlint](https://github.com/bpmn-io/bpmnlint)]

Validate BPMN diagrams based on configurable lint rules.

## Rules

[documentation](https://github.com/bpmn-io/bpmnlint/tree/master/docs/rules#rules) lists all currenty implemented rules, the [`./rules` folder](https://github.com/bpmn-io/bpmnlint/tree/master/rules) contains each rules implementation.

Do you miss a rule that should be included? [Propose a new rule](https://github.com/bpmn-io/bpmnlint/issues/new?assignees=&labels=rules&template=NEW_RULE.md).

## Configuration

Configuration in `.bpmnlintrc` :

Add or customize rules using the `rules` block:

Example

```json
{
  "extends": "bpmnlint:recommended",
  "rules": {
    "label-required": "off"
  }
}
```

## Bundling

After change or update `.bpmnlintrc` configuration run this command below:

```
npx bpmnlint-pack-config -c src/pages/BpmnModeler/bpmnlint/.bpmnlintrc -o src/pages/BpmnModeler/bpmnlint/packed-config.js -t es
```
