import { J1qlService } from '../client/services/j1ql-service.js';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
  results?: any;
}

export class J1QLValidator {
  constructor(private j1qlService: J1qlService) {}

  /**
   * Validates a J1QL query by executing it with a small limit
   * Returns validation result with error details and suggestions
   */
  async validateQuery(query: string): Promise<ValidationResult> {
    try {
      // Add a small limit if not present to avoid large result sets during validation
      let validationQuery = query.trim();
      if (!validationQuery.match(/\bLIMIT\s+\d+/i)) {
        validationQuery += ' LIMIT 5';
      }

      const result = await this.j1qlService.executeJ1qlQuery({
        query: validationQuery
      });

      // Check if we got valid results
      if (result && result.data) {
        return {
          isValid: true,
          results: result
        };
      }

      return {
        isValid: false,
        error: 'Query returned no data',
        suggestion: 'Verify that entities matching your criteria exist. Try removing filters or using broader entity classes.'
      };
    } catch (error) {
      return this.handleQueryError(error, query);
    }
  }

  /**
   * Provides detailed error handling with suggestions
   */
  public handleQueryError(error: any, query: string): ValidationResult {
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    
    // Check specific error patterns first
    for (const { pattern, suggestion } of this.getErrorPatterns()) {
      const match = errorMessage.match(pattern);
      if (match) {
        const suggestionText = typeof suggestion === 'function' 
          ? suggestion(match) 
          : suggestion === 'syntax_analysis'
            ? this.analyzeSyntaxError(query, errorMessage)
            : suggestion;
        
        return {
          isValid: false,
          error: errorMessage,
          suggestion: suggestionText as string
        };
      }
    }

    return {
      isValid: false,
      error: errorMessage,
      suggestion: this.getGenericSuggestions(query)
    };
  }

  /**
   * Consolidated error patterns for better maintainability
   */
  private getErrorPatterns() {
    return [
      // New queryV2 error patterns
      {
        pattern: /Error parsing query\. Unexpected token "(\w+)" at line \d+ column \d+/i,
        suggestion: (match: RegExpMatchArray) => {
          const token = match[1].toLowerCase();
          // Check for reserved keywords used as aliases
          const reservedKeywords = ['count', 'sum', 'avg', 'min', 'max', 'find', 'that', 'with', 'where', 'return', 'order', 'by', 'limit', 'skip', 'has', 'relates', 'to', 'from', 'and', 'or', 'not', 'true', 'false', 'null', 'undefined', 'as'];
          if (reservedKeywords.includes(token)) {
            return `Cannot use reserved keyword "${token}" as an alias. Choose a different name.`;
          }
          // Check for unquoted string values
          if (match[0].includes('WITH') && match[0].includes('=')) {
            return `String values must be quoted: ${token} should be '${token}'`;
          }
          return 'syntax_analysis'; // Fall back to syntax analysis
        }
      },
      {
        pattern: /Error parsing query\. Unexpected token "(>>|<<)" at line \d+ column \d+/i,
        suggestion: 'Direction arrows must follow the relationship verb: "THAT HAS >>" not "THAT >>"'
      },
      {
        pattern: /Error parsing query\. Unexpected token ">" at line \d+ column \d+.*=>/i,
        suggestion: 'Invalid operator "=>". Use ">=" for greater than or equal'
      },
      {
        pattern: /Error parsing query\. Unexpected token "-" at line \d+ column \d+.*LIMIT/i,
        suggestion: 'SKIP and LIMIT values must be positive numbers'
      },
      {
        pattern: /Error parsing query\. Unexpected token "WITH" at line \d+ column \d+\. Did you mean "with"\?/i,
        suggestion: 'Place alias after WITH: "WITH property = value AS alias"'
      },
      // Existing patterns that still work with queryV2
      {
        pattern: /Invalid return selector provided: "(\w+)", valid return selectors are: "([^"]+)"/i,
        suggestion: (match: RegExpMatchArray) => `Undefined alias "${match[1]}". Use "${match[2]}" or define alias: FIND ${match[2]} AS ${match[1]}`
      },
      {
        pattern: /Invalid predicate filter selector provided: "(\w+)", valid predicate selectors are: "([^"]+)"/i,
        suggestion: (match: RegExpMatchArray) => `Undefined alias "${match[1]}" in WHERE clause. Aliases in WHERE must be defined earlier. Valid selectors: ${match[2]}`
      },
      {
        pattern: /"limit" must be a value between \d+ and \d+/i,
        suggestion: 'LIMIT must be between 1 and 250. Try using COUNT for aggregation queries.'
      },
      // Legacy patterns (keeping for backward compatibility)
      {
        pattern: /J1QL Query is invalid\. Please check the syntax/i,
        suggestion: 'syntax_analysis' // Special marker for syntax analysis
      },
      {
        pattern: /exceeds maximum allowed tokens/i,
        suggestion: 'Query returned too much data. Add LIMIT clause to reduce result size (e.g., LIMIT 100)'
      },
      {
        pattern: /Invalid entity type or class/i,
        suggestion: 'Check entity class capitalization (e.g., User not user) and type format (e.g., aws_iam_user).'
      },
      {
        pattern: /Unknown property/i,
        suggestion: 'Property does not exist. Run discovery: FIND <EntityClass> AS e RETURN e.* LIMIT 10'
      },
      {
        pattern: /Invalid comparison operator/i,
        suggestion: 'Use valid operators: =, !=, ~=, ^=, $=, !~=, !^=, !$=, >, <, >=, <='
      },
      {
        pattern: /timeout|timed out/i,
        suggestion: 'Query took too long. Add LIMIT clause or simplify the query.'
      }
    ];
  }

  /**
   * Analyzes generic "J1QL Query is invalid" errors for specific issues
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  public analyzeSyntaxError(query: string, _errorMessage: string): string {
    const syntaxChecks = [
      {
        pattern: /"/,
        message: 'Use single quotes for strings, not double quotes'
      },
      {
        pattern: /=\s*([a-zA-Z]+)(?:\s|$)/,
        message: (match: RegExpMatchArray) => {
          const value = match[1];
          if (!['true', 'false', 'null', 'undefined'].includes(value)) {
            return `String values must be quoted: ${value} should be '${value}'`;
          }
          return null;
        }
      },
      {
        pattern: /\bAS\s+\w+\s+WITH\b/i,
        message: 'Place alias after WITH: "WITH property = value AS alias"'
      },
      {
        pattern: /\bWHERE\b/i,
        message: query.match(/\bAS\s+\w+.*WHERE/i) ? null : 'WHERE clause requires aliases. Use "FIND Entity AS e WHERE e.property = value"'
      },
      {
        pattern: /=>/,
        message: 'Invalid operator "=>". Use ">=" for greater than or equal'
      },
      {
        pattern: /THAT\s*>>/i,
        message: 'Direction arrows must follow the relationship verb: "THAT HAS >>" not "THAT >>"'
      },
      {
        pattern: /FIND\s+([a-z]\w*)/,
        message: (match: RegExpMatchArray) => {
          const entityClass = match[1];
          if (!entityClass.includes('_')) {
            return `Entity classes should be capitalized: "${entityClass}" should be "${entityClass.charAt(0).toUpperCase() + entityClass.slice(1)}"`;
          }
          return null;
        }
      },
      {
        pattern: /=\s*(yes|no|YES|NO)\b/,
        message: 'Use "true" or "false" for boolean values, not "yes"/"no"'
      },
      {
        pattern: /^(?!.*\bLIMIT\s+\d+)(?!.*\bCOUNT\s*\()/i,
        message: query.match(/\bLIMIT\s+\d+/i) || query.match(/\bCOUNT\s*\(/i) ? null : 'Add LIMIT clause to prevent query timeout'
      },
      {
        pattern: /=\s*\/[^/]*$/,
        message: 'Invalid regex pattern - missing closing slash'
      },
      {
        pattern: /\b(SKIP|LIMIT)\s+-\d+/i,
        message: 'SKIP and LIMIT values must be positive numbers'
      },
      {
        pattern: /\bLIMIT\s+0\b/i,
        message: 'LIMIT must be at least 1'
      },
      {
        pattern: /\bAS\s+(count|sum|avg|min|max|find|that|with|where|return|order|by|limit|skip|has|relates|to|from|and|or|not|true|false|null|undefined|as)\b/i,
        message: (match: RegExpMatchArray) => {
          const keyword = match[1];
          return `Cannot use reserved keyword "${keyword}" as an alias. Choose a different name.`;
        }
      }
    ];

    const issues = syntaxChecks
      .map(check => {
        const match = query.match(check.pattern);
        if (match) {
          return typeof check.message === 'function' ? check.message(match) : check.message;
        }
        return null;
      })
      .filter(Boolean) as string[];

    return issues.length > 0 
      ? issues.join('\n') 
      : this.getGenericSuggestions(query);
  }

  /**
   * Provides generic suggestions based on query structure
   */
  private getGenericSuggestions(query: string): string {
    const commonIssues = [
      { check: () => !query.match(/\bLIMIT\s+\d+/i) && !query.match(/\bCOUNT\s*\(/i), message: 'Add LIMIT clause to prevent large result sets' },
      { check: () => query.match(/\bWHERE\b/i) && !query.match(/\bAS\s+\w+.*WHERE/i), message: 'WHERE clause requires aliases. Use "FIND Entity AS e WHERE e.property = value"' },
      { check: () => query.includes('"'), message: 'Use single quotes for strings, not double quotes' },
      { check: () => query.match(/\bAS\s+\w+\s+WITH\b/i), message: 'Place alias after WITH: "WITH property = value AS alias"' },
      { check: () => !query.match(/\b(FIND|find)\b/), message: 'Query must start with FIND' }
    ];

    const suggestions = commonIssues
      .filter(issue => issue.check())
      .map(issue => issue.message);

    if (suggestions.length === 0) {
      suggestions.push(
        'Try these discovery queries first:',
        '1. FIND * AS e RETURN e._class, COUNT(e) - to see available entity classes',
        '2. FIND <EntityClass> AS e RETURN e.* LIMIT 10 - to see entity properties',
        '3. FIND Entity1 THAT RELATES TO AS rel Entity2 RETURN rel._class - to discover relationships'
      );
    }

    return suggestions.join('\n');
  }

  /**
   * Extracts query metadata for better context
   */
  getQueryMetadata(query: string): {
    hasLimit: boolean;
    hasCount: boolean;
    entityClasses: string[];
    relationships: string[];
  } {
    return {
      hasLimit: /\bLIMIT\s+\d+/i.test(query),
      hasCount: /\bCOUNT\s*\(/i.test(query),
      entityClasses: this.extractEntityClasses(query),
      relationships: this.extractRelationships(query)
    };
  }

  private extractEntityClasses(query: string): string[] {
    const matches = query.match(/\bFIND\s+(\w+|\*)/gi) || [];
    return matches.map(m => m.replace(/FIND\s+/i, ''));
  }

  private extractRelationships(query: string): string[] {
    const matches = query.match(/\bTHAT\s+(\w+)/gi) || [];
    return matches.map(m => m.replace(/THAT\s+/i, ''));
  }
}