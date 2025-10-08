Nuxt Theming & Structure Template
This document outlines a robust and maintainable structure for a Nuxt 3 project using Tailwind CSS for theming. The core philosophy is to create a "single source of truth" for all design tokens (colors, fonts, etc.) to ensure theme consistency across the entire application.

Core Philosophy
Our theming system is built on a clear, two-step principle:

Define Tokens: All theme variables (colors, fonts, etc.) are defined as native CSS variables in a global stylesheet (assets/css/main.css). This file is the ultimate source of truth for the project's design language.

Map Tokens: The tailwind.config.ts file reads these CSS variables and maps them to Tailwind's utility classes (e.g., bg-primary, text-foreground). This makes the design language available throughout the application in a consistent and predictable way.

This architecture allows for rapid and consistent re-theming by modifying only the variable definitions in assets/css/main.css.

Project Structure Overview
The essential file and folder structure is as follows. Each component plays a specific role in maintaining architectural integrity.

project-folder/
├── assets/
│   └── css/
│       └── main.css        # (PURPOSE: The single source of truth for all theme variables)
├── components/             # (PURPOSE: Reusable Vue components, auto-imported)
├── layouts/
│   └── default.vue       # (PURPOSE: The master page layout for consistent structure)
├── pages/
│   └── ...               # (PURPOSE: The individual views of the application)
├── nuxt.config.ts          # (PURPOSE: Wires all modules and styles together)
├── package.json            # (PURPOSE: Manages project dependencies)
└── tailwind.config.ts      # (PURPOSE: Maps theme variables to Tailwind utility classes)

Description of Key Files
The following sections describe the purpose of each key file and provide a structural example. The actual content of these files will be provided separately for each project.

1. assets/css/main.css
Purpose: This is the most important file for theming. It defines all the color variables using :root and includes the base Tailwind directives. To change a color sitewide, you only need to edit the variables in this file.

Example Content: The code below is a representative example. The actual project-specific file provided to you should be used as the source of truth.

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 222 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... and so on for all other theme variables */
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: 'Inter', sans-serif;
}

2. tailwind.config.ts
Purpose: This file configures Tailwind to understand our custom theme. It extends the default theme, creating new utility classes (e.g., bg-primary) based on the CSS variables defined in main.css. It acts as the bridge between our variables and our Vue components.

Example Content: The code below is a representative example.

import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [ /* paths to all template files */ ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        /* ... and so on for all other theme colors */
      },
    },
  },
  plugins: [],
}

3. nuxt.config.ts & layouts/default.vue
Purpose: These files handle the project's setup and structure. nuxt.config.ts registers all modules and loads the global stylesheet. layouts/default.vue provides a consistent wrapper for all pages, preventing code duplication.

Instructions for AI Assistants (e.g., Gemini)
Your Role: You are an AI assistant tasked with creating new Vue components and pages for a Nuxt project that uses a strict, token-based theming system.

Context: You will be provided with this manifest file AND the actual set of configuration files for a specific project (especially assets/css/main.css and tailwind.config.ts). Your primary objective is to create new components that strictly adhere to the theming rules defined in those provided files, not the examples in this manifest.

Core Directive: DO NOT INVENT STYLES. When given UX/UI inspiration (e.g., raw HTML/CSS from another source), your task is to translate its visual properties into the project's existing theme. You must use the utility classes that have been pre-defined in the provided theme files.

Workflow:
Analyze the Theme First: Before looking at the inspiration code, review the provided assets/css/main.css and tailwind.config.ts files to understand the available theme classes (e.g., bg-primary, text-muted-foreground, border-border, etc.). This is your design language.

Deconstruct the Inspiration: Look at the stylistic properties of the inspiration code (e.g., background-color: #4A90E2, font-weight: 700, border-radius: 8px).

Translate to Theme Classes: Map these properties to the corresponding utility classes from the project's theme you analyzed in step 1.

If the inspiration uses a blue background, find the corresponding theme color (e.g., bg-primary).

If it uses a light gray text, find the matching theme color (e.g., text-muted-foreground).

A bold font weight becomes font-bold.

A rounded corner becomes rounded-md or rounded-lg.

Padding and margins must use standard Tailwind spacing classes (p-4, m-2, gap-4, etc.).

Construct the Component: Build the final Vue component using only the translated utility classes. Do not write custom CSS in a <style> block unless absolutely necessary for a unique, non-reusable effect (like a complex animation).

Component Usage: Nuxt 3 automatically imports components from the components/ directory. You do not need to add an import statement in the <script> tag. For example, a component located at components/shared/navbar.vue should be referenced in the template as <SharedNavbar />.

Use the Layout: Ensure your new pages are designed to be rendered within the layouts/default.vue structure, which provides the global background and container.

Format Your Output: When you provide the code for a new or updated file, you must start the code block with a comment indicating the full path and filename. This is crucial for clarity and organization.

For .vue, .ts, .js files: // /path/to/your/file.vue

For .css files: /* /path/to/your/file.css */

Avoid Code Comments: Do not add comments inside the code that explain what the code does (e.g., <!-- Main container --> or // Fetch user data). The code should be self-explanatory. The only required comment is the file path at the very beginning of the code block.