import { describe, expect, test } from '@jest/globals';
import {
  CreateInsightsWidgetInputSchema,
  RuleTemplatesSchema,
  QueryVariablesSchema,
  QueryFlagsSchema,
  ActionTargetValueSchema,
  ActionDataSchema,
  JiraAdditionalFieldsSchema,
} from '../server/schemas';

describe('Schema Validation Tests', () => {
  describe('CreateInsightsWidgetInputSchema', () => {
    test('should validate a valid widget input', () => {
      const validInput = {
        title: 'Test Widget',
        type: 'pie',
        config: {
          queries: [
            {
              query: 'FIND DataStore',
              name: 'Query 1',
            },
          ],
          settings: {
            pie: {
              upwardTrendIsGood: true,
            },
          },
        },
      };

      const result = CreateInsightsWidgetInputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    test('should reject invalid chart type', () => {
      const invalidInput = {
        title: 'Test Widget',
        type: 'invalid-type',
        config: {
          queries: [],
        },
      };

      const result = CreateInsightsWidgetInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('RuleTemplatesSchema', () => {
    test('should validate various template types', () => {
      const validTemplates = {
        stringVar: 'test',
        numberVar: 123,
        boolVar: true,
        arrayVar: [1, 2, 3],
        objectVar: { key: 'value' },
      };

      const result = RuleTemplatesSchema.safeParse(validTemplates);
      expect(result.success).toBe(true);
    });
  });

  describe('QueryVariablesSchema', () => {
    test('should validate query variables including null', () => {
      const validVariables = {
        name: 'John',
        age: 30,
        isActive: true,
        optional: null,
        tags: ['tag1', 'tag2'],
        metadata: { key: 'value' },
      };

      const result = QueryVariablesSchema.safeParse(validVariables);
      expect(result.success).toBe(true);
    });
  });

  describe('QueryFlagsSchema', () => {
    test('should validate query flags', () => {
      const validFlags = {
        includeDeleted: true,
        deferredResponse: 'FORCE',
        returnRowMetadata: false,
        customFlag: 'custom-value', // passthrough allows this
      };

      const result = QueryFlagsSchema.safeParse(validFlags);
      expect(result.success).toBe(true);
    });

    test('should reject invalid deferredResponse value', () => {
      const invalidFlags = {
        deferredResponse: 'INVALID',
      };

      const result = QueryFlagsSchema.safeParse(invalidFlags);
      expect(result.success).toBe(false);
    });
  });

  describe('ActionTargetValueSchema', () => {
    test('should validate various target value types', () => {
      const testCases = [
        'string-value',
        123,
        true,
        ['array', 'values'],
        { key: 'object-value' },
      ];

      testCases.forEach((value) => {
        const result = ActionTargetValueSchema.safeParse(value);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('ActionDataSchema', () => {
    test('should validate string data', () => {
      const result = ActionDataSchema.safeParse('simple string');
      expect(result.success).toBe(true);
    });

    test('should validate structured data object', () => {
      const structuredData = {
        description: 'Test description',
        title: 'Test title',
        content: { nested: 'data' },
      };

      const result = ActionDataSchema.safeParse(structuredData);
      expect(result.success).toBe(true);
    });
  });

  describe('JiraAdditionalFieldsSchema', () => {
    test('should validate Jira fields with string description', () => {
      const fields = {
        description: 'Simple description',
        priority: 'High',
        labels: ['bug', 'urgent'],
        components: ['backend'],
        customField: 'custom-value',
      };

      const result = JiraAdditionalFieldsSchema.safeParse(fields);
      expect(result.success).toBe(true);
    });

    test('should validate Jira fields with document description', () => {
      const fields = {
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Formatted description',
                },
              ],
            },
          ],
        },
      };

      const result = JiraAdditionalFieldsSchema.safeParse(fields);
      expect(result.success).toBe(true);
    });
  });
});