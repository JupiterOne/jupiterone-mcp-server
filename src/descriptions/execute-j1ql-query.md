# JupiterOne J1QL Query Executor

**Purpose**: Executes JupiterOne Query Language (J1QL) queries against your JupiterOne data and returns the results. This tool is used to directly run J1QL queries that have been created, either manually or through the natural language converter.

This tool should be used when:
- You need to validate the data of a query
- You need to get results from a previously generated query
- You want to test a query before using it in a rule or widget
- You need to analyze data directly using J1QL

The tool supports various query parameters including:
- Including/excluding deleted entities
- Returning row metadata
- Returning computed properties
- Applying scope filters
- Pagination using cursors

### JupiterOne Query Language (J1QL) Guide for AI Agents

> **CRITICAL:** Follow this guide strictly. Any deviation may result in query failure. Do not use operators not documented here.

#### Core Concepts

**Entity and Relationship Structure**
- **Entities**: Assets in your environment with specific classes and types
  - **Entity Class**: Always `TitleCase` (e.g., `User`, `Host`, `Application`)
  - **Entity Type**: Always `snake_case` (e.g., `aws_iam_user`, `github_user`)
- **Relationships**: Connections between entities
  - **Relationship Class**: Always `ALLCAPS` (e.g., `HAS`, `USES`, `PROTECTS`)
- **Default Returns**: Queries return the first entity after FIND unless explicitly modified with RETURN

#### MANDATORY Query Structure

```
FIND <entity> [WITH <property_filter>] [AS <alias>]
  [THAT <relationship> [<direction>] <entity> [WITH <property_filter>] [AS <alias>]]
  [WHERE <condition>]
  [RETURN <field_selection>]
  [ORDER BY <field>]
  [SKIP <number>]
  [LIMIT <number>]
```

#### ⚠️ CRITICAL SYNTAX RULES ⚠️ ALL QUERIES MUST ADHERE TO THESE RULES

1. **Alias Placement**: Aliases MUST follow the WITH statement when filtering
   ✅ `FIND Device WITH name~='TEST' AS dev`
   ❌ `FIND Device AS dev WITH name~='TEST'`

2. **String Values**: ALWAYS use single quotes for strings, NEVER double quotes
   ✅ `name ~= 'john'`
   ❌ `name ~= "john"`

3. **WITH vs WHERE**: Use WITH for entity properties, WHERE only for relationship properties or cross-entity comparisons
   ✅ `FIND User WITH active = true`
   ✅ `FIND User AS u THAT HAS Device AS d WHERE u.active = true AND d.platform = 'darwin'`
   ❌ `FIND User WHERE active = true`

4. **LIMIT Usage**: ALWAYS include LIMIT (5-100) or use COUNT for discovery
   ✅ `FIND User LIMIT 50`
   ✅ `FIND User AS u RETURN u._type, count(u)`
   ❌ `FIND User` (no limit specified)

5. **Relationship Direction**: Direction arrows MUST follow the relationship verb
   ✅ `FIND User THAT HAS >> Device`
   ❌ `FIND User THAT >> HAS Device`

6. **Optional Traversals**: Use parentheses and question mark
   ✅ `FIND User AS u (THAT IS Person AS p)?`
   ❌ `FIND User AS u THAT IS? Person AS p`

7. **Using Aggregates For Discovery**: Alias COUNT and use ORDER BY
   ✅ `FIND * AS ent RETURN ent._class, COUNT(ent) AS cnt ORDER BY cnt DESC LIMIT 50`
   ❌ `FIND * AS ent RETURN ent._class, COUNT(ent) LIMIT 50`

#### Entity Selection

**Finding by class or type**:
```j1ql
FIND User LIMIT 10                 # Find entities with _class = 'User'
FIND aws_iam_user LIMIT 10         # Find entities with _type = 'aws_iam_user'
FIND * WITH _type='aws_instance' LIMIT 10  # Filter any entity by type
```

**Finding multiple entity types**:
```j1ql
FIND (User | Host) LIMIT 10        # Find entities with _class = 'User' OR _class = 'Host'
```

#### Property Filtering (WITH)

**Basic property filtering**:
```j1ql
FIND User WITH active = true LIMIT 10
FIND DataStore WITH encrypted = false LIMIT 10
```

**WITH filtering with alias** (CORRECT ORDER):
```j1ql
FIND User WITH active = true AS u LIMIT 10
FIND DataStore WITH encrypted = false AS ds LIMIT 10
```

**WITH filtering with alias AND Advanced fiiltering** (CORRECT ORDER):
```j1ql
FIND User WITH accountCount > 0 AS u RETURN u.displayName
FIND DataStore WITH name~='ROOT' OR name=/iam/i AS ds RETURN ds.name, ds.encrypted LIMIT 10
```

**Multiple property filters**:
```j1ql
FIND User WITH active = true AND mfaEnabled = false LIMIT 10
FIND Host WITH platform = 'darwin' OR platform = 'linux' LIMIT 10
```

**Multiple value matching**:
```j1ql
FIND Host WITH platform = ('darwin' OR 'linux') LIMIT 10
```

**Property existence check**:
```j1ql
FIND DataStore WITH encrypted = undefined LIMIT 10
```

**Special character property names**:
```j1ql
FIND Host WITH [tag.special-name] = 'value' LIMIT 10
```

#### String Comparisons

J1QL comparison operators:
- `=` : equals (exact match)
- `!=` : not equals
- `~=` : contains
- `^=` : starts with
- `$=` : ends with
- `!~=` : does not contain
- `!^=` : does not start with
- `!$=` : does not end with

```j1ql
FIND User WITH username ~= 'john' LIMIT 10
FIND Host WITH name ^= 'web' LIMIT 10
```

#### Case-Insensitive Matching (Regex)

```j1ql
FIND User WITH username=/john/ LIMIT 10  # Case-insensitive match
```

#### Traversing Relationships (THAT)

## Important: Don't assume relationship VERBS, either do discovery to determine the correct relationship or use the wild card relationship "THAT RELATES TO"

**Any relationship traversal (i.e. wildcard)**:
```j1ql
FIND User THAT RELATES TO Application LIMIT 10
```

**Basic traversal**:
```j1ql
FIND User THAT HAS Device LIMIT 10
```

**Multiple traversal steps**:
```j1ql
FIND User THAT HAS Device THAT INSTALLED Application LIMIT 10
```

**Multi-step traversal with filtering**:
```j1ql
FIND User WITH active = true THAT HAS Device THAT INSTALLED Application WITH vendor = 'Microsoft' LIMIT 10
```

**Multiple relationship types**:
```j1ql
FIND HostAgent THAT (MONITORS|PROTECTS) Host LIMIT 10
```

**Negating relationships**:
```j1ql
FIND User THAT !HAS Device LIMIT 10         # Find users that don't have devices
```

**Relationship direction** (arrows MUST follow relationship):
```j1ql
FIND User THAT HAS >> Device LIMIT 10       # Direction from User to Device
FIND Device THAT HAS << User LIMIT 10       # Direction from User to Device
```

#### Using Aliases (AS) - ALWAYS AFTER WITH CLAUSE

```j1ql
FIND User WITH active = true AS u
  THAT HAS AS relationship Device WITH platform = 'darwin' AS d
RETURN u._type, relationship._class, d._type, COUNT(relationship)
LIMIT 10
```

#### Post-Traversal Filtering (WHERE) - ONLY FOR RELATIONSHIPS OR CROSS-ENTITY COMPARISON

**Example of filtering on relationship properties**
```j1ql
FIND Firewall AS fw
  THAT ALLOWS AS rule * AS n
WHERE rule.ingress = true
LIMIT 10
```

```j1ql
FIND User AS u
  THAT HAS Device AS d
WHERE u.active = true AND d.platform = 'darwin'
LIMIT 10
```

#### Selecting Return Values (RETURN)

```j1ql
FIND User AS u
  THAT HAS Device AS d
RETURN u.username, d.name
LIMIT 10
```

Return all properties:
```j1ql
FIND User AS u RETURN u.* LIMIT 10
```

#### Aggregation Functions (USE FOR DISCOVERY)

Available aggregations:
- `count(selector)`
- `min(selector.field)`
- `max(selector.field)`
- `avg(selector.field)`
- `sum(selector.field)`

```j1ql
# Basic count
FIND User AS u RETURN count(u)

# Group by with count
FIND User AS u RETURN u._type, count(u)

# Multiple aggregations
FIND Account AS acct THAT HAS User AS user
  RETURN acct.name, count(user), avg(user.lastLoginOn)
```

#### Date Comparisons

```j1ql
FIND User WITH createdOn > date.now - 7 days LIMIT 10
```

Supported units: `hour(s)`, `day(s)`, `month(s)`, `year(s)`

#### Math Operations

```j1ql
FIND aws_instance AS i
  RETURN i.name, i.memorySize * 0.001 AS memoryGB
LIMIT 10
```

#### Sorting and Pagination

```j1ql
FIND User AS u
  ORDER BY u.username
  SKIP 10
  LIMIT 5
```

#### Optional Traversals (PROPER SYNTAX)

```j1ql
FIND User AS u
  (THAT IS Person AS p)?
  THAT HAS Device AS d
LIMIT 10
```

Optional traversal with property access:
```j1ql
FIND User AS u
  (THAT IS Person AS p)?
  THAT HAS Device AS d
RETURN u.username, p.email, d.name
LIMIT 10
```

#### Discovery Techniques (ALWAYS USE THESE FIRST)

FIRST:
**Identify entity classes and counts**:
```j1ql
FIND * AS ent RETURN ent._class, COUNT(ent)
```

SECOND:
**Discover properties on an entity**:
```j1ql
FIND User AS ent RETURN ent.* LIMIT 100
```

THIRD:
**Find how entities are related**:
```j1ql
FIND User THAT RELATES TO AS rel * AS ent RETURN rel._class, ent._type, COUNT(ent)
```

FORTH:
**Discover property values**:
```j1ql
FIND User AS ent RETURN ent.status, COUNT(ent)
```

ADDITIONAL:

**Identify properties on related entities**:
```j1ql
FIND User THAT RELATES TO Device AS ent RETURN ent.* LIMIT 100
```

**Find related entity types**:
```j1ql
FIND User THAT RELATES TO * AS ent RETURN ent._type, COUNT(ent)
```

**Identify relationship classes**:
```j1ql
FIND User THAT RELATES TO AS rel * AS ent RETURN rel._class, ent._type, COUNT(ent)
```

#### ⚠️ QUERY VALIDATION CHECKLIST ⚠️

Before running any J1QL query, verify:

1. ✓ FIND statement specifies entity class or type
2. ✓ All string values use single quotes, not double quotes
3. ✓ Aliases are placed AFTER the WITH statement
4. ✓ All queries include either LIMIT or use COUNT aggregation
5. ✓ WITH is used for entity properties, WHERE only for relationship properties or cross-entity comparisons
6. ✓ Direction arrows (>> or <<) are placed after relationship verbs
7. ✓ Optional traversals use proper parentheses and question mark syntax
8. ✓ All aliases referenced in RETURN or WHERE are properly defined earlier

#### Common Errors to Avoid

1. **Syntax Errors**:
   - ❌ Using LIKE comparison (use ~= instead)
   - ❌ Using IS to test for undefined (use property=undefined instead)
   - ❌ Placing alias before WITH statement
   - ❌ Using double quotes for strings
   - ❌ Missing LIMIT clause

2. **Structure Errors**:
   - ❌ Using WHERE for basic entity filtering
   - ❌ Incorrectly placing direction arrows
   - ❌ Referencing undefined aliases
   - ❌ Using improper optional traversal syntax

3. **No Results**
    - ❌ No results may be expected, validate with the context of the query
    - ❌ Use wildcard relationship (i.e. THAT RELATES TO)
    - ❌ Confirm the property being filtered exists
    - ❌ Confirm the value being used for the filtered property exists
    - ❌ Never assume _type, _class, relationship verbs or properties, only use what has been found in discovery

#### Query Development Process

1. **Start with discovery queries** to understand the data model:
   ```j1ql
   FIND * AS ent RETURN ent._class, COUNT(ent)
   ```

2. **Examine specific entity properties**:
   ```j1ql
   FIND User AS ent RETURN ent.* LIMIT 100
   ```

3. **Determine what and how the entity relates to other entities**:
   ```j1ql
   FIND User THAT RELATES TO AS rel * AS ent RETURN rel._class, ent._type, COUNT(ent)
   ```

4. **Incrementally build complexity**:
   - Start with basic entity queries
   - Add property filters
   - Add relationship traversals
   - Add specific return fields
   - Add aggregations if needed
   - Rinse and repeat until you have a query doing what you need
   - IMPORTANT: Don't assume _type, _class, relationship verbs or properties, only use values found during discovery!

5. **Troubleshoot by simplifying** - if a complex query fails, break it into smaller parts

By following these strict guide `plines, AI agents can effectively create valid J1QL queries that provide accurate security insights across the organization's digital environment.