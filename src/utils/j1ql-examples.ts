/**
 * Common J1QL query patterns and examples
 * This file provides reusable query patterns for common JupiterOne use cases
 */

export const J1QLExamples = {
  // Discovery queries - Always start with these
  discovery: {
    allEntityClasses: {
      query: 'FIND * AS e RETURN e._class, COUNT(e) ORDER BY COUNT(e) DESC',
      description: 'Discover all entity classes in your environment with counts'
    },
    entityProperties: {
      query: 'FIND {{EntityClass}} AS e RETURN e.* LIMIT 10',
      description: 'See all properties of a specific entity class',
      variables: { EntityClass: 'User' }
    },
    relationships: {
      query: 'FIND {{EntityClass}} THAT RELATES TO AS rel * AS target RETURN rel._class, target._type, COUNT(target) ORDER BY COUNT(target) DESC',
      description: 'Discover how an entity relates to others',
      variables: { EntityClass: 'User' }
    },
    propertyValues: {
      query: 'FIND {{EntityClass}} AS e RETURN e.{{property}}, COUNT(e) ORDER BY COUNT(e) DESC',
      description: 'See distinct values for a property',
      variables: { EntityClass: 'User', property: 'status' }
    }
  },

  // Security queries
  security: {
    unencryptedDataStores: {
      query: 'FIND DataStore WITH encrypted = false LIMIT 100',
      description: 'Find unencrypted data stores'
    },
    publiclyExposedResources: {
      query: 'FIND (Host|Function|Database) WITH public = true LIMIT 100',
      description: 'Find publicly exposed resources'
    },
    usersWithoutMFA: {
      query: 'FIND User WITH mfaEnabled != true LIMIT 100',
      description: 'Find users without MFA enabled'
    },
    adminUsers: {
      query: 'FIND User WITH admin = true OR role ~= "admin" LIMIT 100',
      description: 'Find administrative users'
    },
    criticalFindings: {
      query: 'FIND Finding WITH severity = "critical" OR numericSeverity >= 9 LIMIT 100',
      description: 'Find critical security findings'
    }
  },

  // Unified entities
  unified: {
    allDevices: {
      query: 'FIND UnifiedDevice AS device RETURN device.displayName, device.platform, device.lastSeenOn LIMIT 100',
      description: 'List all unified devices'
    },
    userDevices: {
      query: `FIND UnifiedIdentity AS identity
        THAT IS << User 
        THAT RELATES TO (Device|Host) 
        THAT IS >> UnifiedDevice AS device
      RETURN identity.displayName, device.displayName, device.platform
      LIMIT 100`,
      description: 'Find devices associated with users'
    },
    vulnerableDevices: {
      query: `FIND UnifiedVulnerability AS vuln
        THAT AFFECTS Device
        THAT IS >> UnifiedDevice AS device
      RETURN vuln.displayName, vuln.severity, device.displayName
      LIMIT 100`,
      description: 'Find devices with vulnerabilities'
    }
  },

  // Dashboard widget queries
  dashboardWidgets: {
    pieChart: {
      query: 'FIND DataStore AS ds RETURN ds.classification AS name, COUNT(ds) AS value',
      description: 'Pie chart showing data store classifications'
    },
    numberChart: {
      query: 'FIND User AS u RETURN COUNT(u) AS value',
      description: 'Number chart showing total users'
    },
    barChart: {
      query: 'FIND Host AS h RETURN h.platform AS x, COUNT(h) AS y ORDER BY y DESC LIMIT 10',
      description: 'Bar chart showing hosts by platform'
    },
    tableChart: {
      query: 'FIND Person AS p RETURN p.name AS Name, p.email AS Email, p.department AS Department ORDER BY p._createdOn DESC LIMIT 25',
      description: 'Table showing recent people added'
    }
  },

  // Rule queries
  ruleQueries: {
    newUsers: {
      query: 'FIND User WITH _createdOn > date.now - 1 day',
      description: 'Find users created in the last day',
      condition: ['AND', ['queries.query0.total', '>', 0]]
    },
    expiredCertificates: {
      query: 'FIND Certificate WITH expiresOn < date.now',
      description: 'Find expired certificates',
      condition: ['AND', ['queries.query0.total', '>', 0]]
    },
    highSeverityFindings: {
      query: 'FIND Finding WITH numericSeverity >= 7 AND status != "resolved"',
      description: 'Find unresolved high severity findings',
      condition: ['AND', ['queries.query0.total', '>', 0]]
    }
  },

  // Common patterns
  patterns: {
    withAlias: 'FIND Entity WITH property = value AS alias',
    multipleClasses: 'FIND (Class1|Class2|Class3)',
    stringComparisons: `
      = 'exact'       // Exact match
      ~= 'contains'   // Contains
      ^= 'starts'     // Starts with
      $= 'ends'       // Ends with
      =/pattern/i     // Case-insensitive regex`,
    relationships: `
      THAT HAS                // Specific relationship
      THAT RELATES TO         // Any relationship
      THAT HAS >>            // Directional
      THAT !HAS              // Negation`,
    aggregations: `
      COUNT(entity)          // Count
      SUM(entity.property)   // Sum
      AVG(entity.property)   // Average
      MIN(entity.property)   // Minimum
      MAX(entity.property)   // Maximum`
  }
};

/**
 * Get a query example by path (e.g., 'security.unencryptedDataStores')
 */
export function getExample(path: string): any {
  const parts = path.split('.');
  let current: any = J1QLExamples;
  
  for (const part of parts) {
    if (current[part]) {
      current = current[part];
    } else {
      return null;
    }
  }
  
  return current;
}

/**
 * Common query building blocks
 */
export const QueryBuilders = {
  // Add common time filters
  addTimeFilter(query: string, days: number): string {
    const timeFilter = `_createdOn > date.now - ${days} days`;
    if (query.includes('WITH')) {
      return query.replace(/WITH\s+/, `WITH ${timeFilter} AND `);
    } else if (query.includes('FIND')) {
      return query.replace(/FIND\s+(\w+)/, `FIND $1 WITH ${timeFilter}`);
    }
    return query;
  },

  // Add limit if not present
  addLimit(query: string, limit: number = 100): string {
    if (!query.match(/\bLIMIT\s+\d+/i)) {
      return `${query.trim()} LIMIT ${limit}`;
    }
    return query;
  },

  // Build a basic discovery query
  buildDiscoveryQuery(entityClass: string): string {
    return `FIND ${entityClass} AS e RETURN e.* LIMIT 10`;
  },

  // Build a relationship discovery query
  buildRelationshipQuery(fromEntity: string, toEntity: string = '*'): string {
    return `FIND ${fromEntity} THAT RELATES TO AS rel ${toEntity} AS target RETURN rel._class, target._type, COUNT(target)`;
  }
};