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