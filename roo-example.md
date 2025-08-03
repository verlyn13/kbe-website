# Roo Example

Based on the Roo Code documentation, here's the correct YAML schema format for defining edit permissions with file path restrictions:

## Correct YAML Format for Edit Restrictions

### Basic Structure

```yaml
groups:
  - read
  - - edit # First element of the tuple
    - fileRegex: PATTERN_HERE # Second element with restrictions
      description: Optional description
```bash
### Real Examples for Your Use Cases

#### 1. **UI Mode (TSX/CSS files only)**

```yaml
customModes:
  - slug: ui-mode
    name: 🎨 UI Developer
    groups:
      - read
      - - edit
        - fileRegex: \.(tsx?|css|scss)$
          description: UI files only (TypeScript/CSS)
      - browser
```bash
#### 2. **API Mode (route.ts files)**

```yaml
- slug: api-mode
  name: 🔌 API Developer
  groups:
    - read
    - - edit
      - fileRegex: (route|middleware)\.(ts|js)$
        description: API route files only
    - command
```bash
#### 3. **Component Mode (specific directories)**

```yaml
- slug: component-mode
  name: 🧩 Component Developer
  groups:
    - read
    - - edit
      - fileRegex: ^src/components/.*\.(tsx?|css)$
        description: Component files in src/components only
```bash
### Key Points to Remember
1. **The tuple structure is critical**: It's a list with exactly 2 elements:
   - First: The string `"edit"`
   - Second: An object with `fileRegex` and optional `description`

2. **Regex escaping in YAML**: Use single backslashes (e.g., `\.tsx$` not `\\.tsx$`)

3. **Path matching**: Patterns match against relative paths from workspace root

### More Complex Examples
#### **Next.js App Directory Structure**

```yaml
- slug: app-pages
  name: 📄 Page Developer
  groups:
    - read
    - - edit
      - fileRegex: ^app/.*/(page|layout|loading|error|not-found)\.(tsx?|jsx?)$
        description: Next.js special files only
```bash
#### **Exclude Test Files**

```yaml
- slug: prod-code
  name: 🚀 Production Code
  groups:
    - read
    - - edit
      - fileRegex: ^(?!.*\.(test|spec|stories))\.(tsx?|jsx?)$
        description: No test files
```bash
#### **Multiple Directory Patterns**

```yaml
- slug: frontend-dev
  name: 🎭 Frontend Developer
  groups:
    - read
    - - edit
      - fileRegex: ^(src/components|src/hooks|src/lib|app)/.+\.(tsx?|jsx?|css|scss)$
        description: Frontend directories only
```bash
### Common Regex Patterns
| Pattern                | Description                  |
| ---------------------- | ---------------------------- |
| `\.tsx?$`              | TypeScript/TSX files         |
| `\.jsx?$`              | JavaScript/JSX files         |
| `\.(css\|scss\|sass)$` | Style files                  |
| `^app/api/`            | Files starting with app/api/ |
| `/route\.ts$`          | Files ending with /route.ts  |
| `^(?!node_modules)`    | Not in node_modules          |
| `\.(test\|spec)\.`     | Test files                   |

### Full Working Example
```yaml
customModes:
  - slug: kbe-ui-specialist
    name: 🎨 KBE UI Specialist
    description: UI components and styling for KBE portal
    roleDefinition: |
      You are a UI specialist focusing on React components and styling
    groups:
      - read
      - - edit
        - fileRegex: \.(tsx?|jsx?|css|scss)$
          description: UI-related files only
      - browser
    whenToUse: Creating or modifying UI components and styles
    customInstructions: |
      Focus on responsive design and accessibility
```text
The key is maintaining the exact nested list structure where edit restrictions are defined as a two-element list within the groups array.
