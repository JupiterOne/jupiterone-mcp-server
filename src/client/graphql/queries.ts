export const LIST_ALERT_INSTANCES = `
  query listAlertInstances($alertStatus: AlertStatus, $limit: Int, $cursor: String) {
    listAlertInstances(alertStatus: $alertStatus, limit: $limit, cursor: $cursor) {
      instances {
        ...AlertInstanceFragment
        __typename
      }
      pageInfo {
        endCursor
        hasNextPage
        __typename
      }
      __typename
    }
  }

  fragment AlertInstanceFragment on AlertInstance {
    accountId
    resourceGroupId
    createdOn
    dismissedOn
    endReason
    id
    lastEvaluationBeginOn
    lastEvaluationEndOn
    lastEvaluationResult {
      answerText
      evaluationEndOn
      outputs {
        name
        value
        __typename
      }
      rawDataDescriptors {
        name
        recordCount
        __typename
      }
      __typename
    }
    lastUpdatedOn
    level
    questionRuleInstance {
      id
      name
      description
      tags
      pollingInterval
      labels {
        labelName
        labelValue
        __typename
      }
      __typename
    }
    reportRuleInstance {
      name
      description
      __typename
    }
    ruleId
    ruleVersion
    status
    users
    __typename
  }
`;

export const LIST_RULE_INSTANCES = `
  query listRuleInstances($limit: Int, $cursor: String, $filters: ListRuleInstancesFilters) {
    listRuleInstances(limit: $limit, cursor: $cursor, filters: $filters) {
      questionInstances {
        ...RuleInstanceFields
        __typename
      }
      pageInfo {
        hasNextPage
        endCursor
        __typename
      }
      __typename
    }
  }

  fragment RuleInstanceFields on QuestionRuleInstance {
    id
    resourceGroupId
    accountId
    name
    description
    version
    lastEvaluationStartOn
    lastEvaluationEndOn
    evaluationStep
    specVersion
    notifyOnFailure
    triggerActionsOnNewEntitiesOnly
    ignorePreviousResults
    pollingInterval
    templates
    outputs
    labels {
      labelName
      labelValue
      __typename
    }
    question {
      queries {
        query
        name
        version
        includeDeleted
        __typename
      }
      __typename
    }
    questionId
    latest
    deleted
    type
    operations {
      when
      actions
      __typename
    }
    latestAlertId
    latestAlertIsActive
    state {
      actions
      __typename
    }
    tags
    remediationSteps
    __typename
  }
`;

export const GET_ACCOUNT_INFO = `
  query account {
    iamGetAccount {
      accountId
      accountSubdomain
      accountName
      accountOwner
      status
      accountType
      accountLogoUrl
      __typename
    }
  }
`;

export const GET_DASHBOARDS = `
  query GetDashboards {
    getDashboards(options: {includeAllJ1ManagedDashboards: true}) {
      id
      name
      userId
      category
      supportedUseCase
      prerequisites {
        prerequisitesMet
        preRequisitesGroupsFulfilled
        preRequisitesGroupsRequired
        __typename
      }
      isJ1ManagedBoard
      resourceGroupId
      starred
      _timeUpdated
      _createdAt
      __typename
    }
  }
`;

export const GET_DASHBOARD_DETAILS = `
  query solo_GetDashboard($dashboardId: String!) {
    getDashboard(dashboardId: $dashboardId) {
      ...InsightsDashboard
      __typename
    }
  }

  fragment InsightsDashboard on InsightsDashboard {
    id
    name
    category
    userId
    supportedUseCase
    isJ1ManagedBoard
    published
    publishedToUserIds
    publishedToGroupIds
    groupIds
    userIds
    scopeFilters
    resourceGroupId
    starred
    _timeUpdated
    _createdAt
    prerequisites {
      prerequisitesMet
      preRequisitesGroupsFulfilled
      preRequisitesGroupsRequired
      __typename
    }
    parameters {
      ...DashboardParameterFields
      __typename
    }
    widgets {
      ...InsightsWidget
      __typename
    }
    layouts {
      ...InsightsDashboardLayoutConfig
      __typename
    }
    __typename
  }

  fragment DashboardParameterFields on DashboardParameter {
    dashboardId
    accountId
    id
    label
    name
    options
    valueType
    type
    default
    disableCustomInput
    requireValue
    __typename
  }

  fragment InsightsWidget on InsightsWidget {
    id
    title
    description
    type
    questionId
    noResultMessage
    includeDeleted
    config {
      queries {
        id
        name
        query
        __typename
      }
      settings
      postQueryFilters
      disableQueryPolicyFilters
      __typename
    }
    __typename
  }

  fragment InsightsDashboardLayoutConfig on InsightsDashboardLayoutConfig {
    xs {
      ...InsightsDashboardLayoutItem
      __typename
    }
    sm {
      ...InsightsDashboardLayoutItem
      __typename
    }
    md {
      ...InsightsDashboardLayoutItem
      __typename
    }
    lg {
      ...InsightsDashboardLayoutItem
      __typename
    }
    xl {
      ...InsightsDashboardLayoutItem
      __typename
    }
    __typename
  }

  fragment InsightsDashboardLayoutItem on InsightsDashboardLayoutItem {
    static
    moved
    w
    h
    x
    y
    i
    __typename
  }
`;

export const GET_INTEGRATION_DEFINITIONS = `
  query IntegrationDefinitions($cursor: String, $includeConfig: Boolean = false) {
    integrationDefinitions(cursor: $cursor) {
      definitions {
        ...IntegrationDefinitionsValues
        __typename
      }
      pageInfo {
        endCursor
        __typename
      }
      __typename
    }
  }

  fragment IntegrationDefinitionsValues on IntegrationDefinition {
    id
    name
    type
    title
    integrationType
    integrationClass
    integrationCategory
    totalInstanceCount
    description
    ...IntegrationDefinitionConfigFragment @include(if: $includeConfig)
    __typename
  }

  fragment IntegrationDefinitionConfigFragment on IntegrationDefinition {
    configFields {
      ...ConfigFieldsRecursive
      __typename
    }
    authSections {
      id
      description
      displayName
      configFields {
        ...ConfigFieldsRecursive
        __typename
      }
      verificationDisabled
      __typename
    }
    configSections {
      displayName
      configFields {
        ...ConfigFieldsRecursive
        __typename
      }
      __typename
    }
    __typename
  }

  fragment ConfigFieldsRecursive on ConfigField {
    ...ConfigFieldValues
    configFields {
      ...ConfigFieldValues
      configFields {
        ...ConfigFieldValues
        __typename
      }
      __typename
    }
    __typename
  }

  fragment ConfigFieldValues on ConfigField {
    key
    displayName
    description
    type
    format
    defaultValue
    helperText
    inputAdornment
    mask
    optional
    immutable
    readonly
    computed
    options {
      value
      description
      label
      webLink
      default
      __typename
    }
    __typename
  }
`;

export const GET_INTEGRATION_INSTANCES = `
  query IntegrationInstances($definitionId: String, $cursor: String, $limit: Int, $filter: ListIntegrationInstancesSearchFilter) {
    integrationInstancesV2(
      definitionId: $definitionId
      cursor: $cursor
      limit: $limit
      filter: $filter
    ) {
      instances {
        ...IntegrationInstanceLiteValues
        __typename
      }
      pageInfo {
        endCursor
        __typename
      }
      __typename
    }
  }

  fragment IntegrationInstanceLiteValues on IntegrationInstanceLite {
    id
    name
    accountId
    sourceIntegrationInstanceId
    pollingInterval
    pollingIntervalCronExpression {
      hour
      dayOfWeek
      __typename
    }
    integrationDefinitionId
    description
    config
    instanceRelationship
    resourceGroupId
    createdOn
    createdBy
    updatedOn
    updatedBy
    mostRecentJob {
      status
      hasSkippedSteps
      createDate
      __typename
    }
    __typename
  }
`;

export const GET_INTEGRATION_JOBS = `
  query IntegrationJobs($status: IntegrationJobStatus, $integrationInstanceId: String, $integrationDefinitionId: String, $integrationInstanceIds: [String], $cursor: String, $size: Int) {
    integrationJobs(
      status: $status
      integrationInstanceId: $integrationInstanceId
      integrationDefinitionId: $integrationDefinitionId
      integrationInstanceIds: $integrationInstanceIds
      cursor: $cursor
      size: $size
    ) {
      jobs {
        ...IntegrationJobValues
        __typename
      }
      pageInfo {
        endCursor
        __typename
      }
      __typename
    }
  }

  fragment IntegrationJobValues on IntegrationJob {
    id
    status
    integrationInstanceId
    createDate
    endDate
    hasSkippedSteps
    integrationInstance {
      id
      name
      __typename
    }
    integrationDefinition {
      id
      title
      integrationType
      __typename
    }
    __typename
  }
`;

export const GET_INTEGRATION_JOB = `
  query IntegrationJob($integrationJobId: ID!, $integrationInstanceId: String!) {
    integrationJob(
      id: $integrationJobId
      integrationInstanceId: $integrationInstanceId
    ) {
      ...IntegrationJobValues
      __typename
    }
  }

  fragment IntegrationJobValues on IntegrationJob {
    id
    status
    integrationInstanceId
    createDate
    endDate
    hasSkippedSteps
    integrationInstance {
      id
      name
      __typename
    }
    integrationDefinition {
      id
      title
      integrationType
      __typename
    }
    __typename
  }
`;

export const GET_INTEGRATION_EVENTS = `
  query ListEvents($jobId: String!, $integrationInstanceId: String!, $cursor: String, $size: Int) {
    integrationEvents(
      size: $size
      cursor: $cursor
      jobId: $jobId
      integrationInstanceId: $integrationInstanceId
    ) {
      events {
        ...IntegrationInstanceEventValues
        __typename
      }
      pageInfo {
        endCursor
        hasNextPage
        __typename
      }
      __typename
    }
  }

  fragment IntegrationInstanceEventValues on IntegrationEvent {
    id
    name
    description
    createDate
    jobId
    level
    eventCode
    __typename
  }
`;

export const LIST_RULE_EVALUATIONS = `
  query listCollectionResults($collectionType: CollectionType!, $collectionOwnerId: String!, $beginTimestamp: Long!, $endTimestamp: Long!, $limit: Int, $cursor: String, $tag: String) {
    listCollectionResults(
      collectionType: $collectionType
      collectionOwnerId: $collectionOwnerId
      beginTimestamp: $beginTimestamp
      endTimestamp: $endTimestamp
      limit: $limit
      cursor: $cursor
      tag: $tag
    ) {
      results {
        accountId
        collectionOwnerId
        collectionOwnerVersion
        collectionType
        outputs {
          name
          value
          __typename
        }
        rawDataDescriptors {
          name
          persistedResultType
          rawDataKey
          recordCount
          recordCreateCount
          recordDeleteCount
          recordUpdateCount
          __typename
        }
        tag
        timestamp
        __typename
      }
      pageInfo {
        endCursor
        hasNextPage
        __typename
      }
      __typename
    }
  }
`;

export const GET_RULE_EVALUATION_DETAILS = `
  query ruleEvaluationDetails($ruleEvaluationDetailsInput: RuleEvaluationDetailsInput!) {
    ruleEvaluationDetails(input: $ruleEvaluationDetailsInput) {
      accountRuleId
      startedOn
      question {
        totalDuration
        queries {
          status
          queryEvaluationDetails {
            name
            duration
            status
            error
            __typename
          }
          __typename
        }
        __typename
      }
      conditions {
        status
        condition
        __typename
      }
      actions {
        status
        actionEvaluationDetails {
          actionId
          action
          status
          duration
          finishedOn
          logs
          __typename
        }
        __typename
      }
      ruleEvaluationOrigin
      __typename
    }
  }
`;

export const GET_RAW_DATA_DOWNLOAD_URL = `
  query getRawDataDownloadUrl($rawDataKey: String!) {
    getRawDataDownloadUrl(rawDataKey: $rawDataKey)
  }
`;

// J1QL Query Executor V2 - Provides more detailed error messages
export const QUERY_V2 = `
  query J1QLv2($query: String!, $variables: JSON, $cursor: String, $scopeFilters: JSON, $includeDeleted: Boolean, $returnRowMetadata: Boolean, $returnComputedProperties: Boolean) {
    queryV2(query: $query, variables: $variables, cursor: $cursor, scopeFilters: $scopeFilters, includeDeleted: $includeDeleted, returnRowMetadata: $returnRowMetadata, returnComputedProperties: $returnComputedProperties) {
      type
      url
      correlationId
    }
  }
`;

// Get entity counts by class and type
export const GET_ENTITY_COUNTS = `
  query GetEntityCounts {
    getEntityCounts {
      classes
      types
    }
  }
`;

// Get properties for a specific entity type
export const QUERY_PROPERTIES = `
  query QueryProperties($entity: String) {
    queryProperties(entity: $entity) {
      id
      accountId
      entity
      name
      valueType
      count
      __typename
    }
  }
`;