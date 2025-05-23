/**
 * Example of how to use the create-inline-question-rule tool
 * This example creates a rule that monitors for unencrypted critical data stores
 */

const exampleRuleCreation = {
  name: "Rule name",
  description: "Description",
  notifyOnFailure: true,
  triggerActionsOnNewEntitiesOnly: true,
  ignorePreviousResults: false,
  pollingInterval: "ONE_WEEK",
  outputs: ["alertLevel"],
  specVersion: 1,
  tags: [],
  templates: {},
  queries: [
    {
      query: "Find DataStore with classification='critical' and encrypted=false as d return d.tag.AccountName as Account, d.displayName as UnencryptedDataStores, d._type as Type, d.encrypted as Encrypted",
      name: "query0",
      version: "v1",
      includeDeleted: false
    }
  ],
  operations: [
    {
      when: {
        type: "FILTER",
        condition: ["AND", ["queries.query0.total", ">", 0]]
      },
      actions: [
        {
          type: "SET_PROPERTY",
          targetProperty: "alertLevel",
          targetValue: "HIGH"
        },
        {
          type: "CREATE_ALERT"
        }
      ]
    }
  ]
};

// In an MCP context, you would call:
// create-inline-question-rule with the parameters from exampleRuleCreation

console.log('Example rule creation parameters:', JSON.stringify(exampleRuleCreation, null, 2));