Nuxt Theming, Structure, and i18n Template

This document outlines a robust and maintainable structure for a Nuxt 3 project using Tailwind CSS for theming and @nuxtjs/i18n for internationalization. The core philosophy is to create a "single source of truth" for all design tokens (colors, fonts, etc.) and text content to ensure consistency and scalability.
Core Philosophy

Our system is built on three clear principles:

    Define Tokens: All theme variables (colors, fonts, etc.) are defined as native CSS variables in a global stylesheet (assets/css/main.css). This file is the ultimate source of truth for the project's design language.

    Map Tokens: The tailwind.config.ts file reads these CSS variables and maps them to Tailwind's utility classes (e.g., bg-primary, text-foreground), making the design language available throughout the application.

    Centralize Content: All user-facing text is managed through locale files (e.g., locales/en.json). Components will reference translation keys instead of hardcoding text, allowing for easy updates and multi-language support.

This architecture allows for rapid re-theming by modifying assets/css/main.css and seamless content management via the locales directory.
Project Structure Overview

The essential file and folder structure is as follows. Each component plays a specific role in maintaining architectural integrity.

project-folder/
├── assets/
│   └── css/
│       └── main.css          # (PURPOSE: The single source of truth for all theme variables)
├── components/               # (PURPOSE: Reusable Vue components, auto-imported)
├── layouts/
│   └── default.vue         # (PURPOSE: The master page layout for consistent structure)
├── locales/
│   ├── en.json             # (PURPOSE: English translations, the default)
│   └── nl.json             # (PURPOSE: Dutch translations)
├── pages/
│   └── ...                 # (PURPOSE: The individual views of the application)
├── nuxt.config.ts            # (PURPOSE: Wires all modules, styles, and i18n together)
├── package.json              # (PURPOSE: Manages project dependencies)
└── tailwind.config.ts        # (PURPOSE: Maps theme variables to Tailwind utility classes)

Description of Key Files

The following sections describe the purpose of each key file and provide a structural example.
1. assets/css/main.css

Purpose: This is the most important file for theming. It defines all the color variables using :root and includes the base Tailwind directives. To change a color sitewide, you only need to edit the variables in this file.

Example Content:

/* /assets/css/main.css */
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

Purpose: This file configures Tailwind to understand our custom theme. It extends the default theme, creating new utility classes (e.g., bg-primary) based on the CSS variables defined in main.css.

Example Content:

// /tailwind.config.ts
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

3. locales/en.json

Purpose: This file contains the key-value pairs for all English text in the application. It serves as the default language. All text within components should use keys from this file via the $t() function.

Example Content:

/* /locales/en.json */
{
  "welcome": {
    "title": "Welcome to our Application",
    "subtitle": "We are glad to have you here."
  },
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel"
  }
}

4. nuxt.config.ts & layouts/default.vue

Purpose: These files handle the project's setup and structure. nuxt.config.ts registers all modules, loads the global stylesheet, and configures the i18n options. layouts/default.vue provides a consistent wrapper for all pages.
Instructions for AI Assistants (e.g., Gemini)

Your Role: You are an AI assistant tasked with creating new Vue components and pages for a Nuxt project that uses a strict, token-based theming and internationalization system.

Context: You will be provided with this manifest file AND the actual set of configuration files for a specific project. Your primary objective is to create new components that strictly adhere to the rules defined in those provided files. Assume English is the default language, and until specified otherwise, you are only interested in the en.json file for text content.

Core Directive: DO NOT INVENT STYLES OR HARDCODE TEXT. When given UX/UI inspiration, your task is to translate its visual properties and text into the project's existing theme and locale files. You must use the pre-defined utility classes and i18n keys.
Workflow:

    Analyze the Theme & Locales First: Before coding, review the provided assets/css/main.css, tailwind.config.ts, and locales/en.json files to understand the available theme classes (e.g., bg-primary, text-muted-foreground) and existing translation keys. This is your design and content language.

    Deconstruct the Inspiration: Look at the stylistic properties (e.g., background-color: #4A90E2, font-weight: 700) and all user-facing text (e.g., "Sign Up Now").

    Translate to Theme Classes & i18n Keys:

        Map stylistic properties to the corresponding utility classes from the project's theme. A blue background becomes bg-primary, bold font weight becomes font-bold, etc.

        For every piece of text, create a logical, nested key (e.g., user.profile.title) and use the $t('user.profile.title') function in the template.

    Update en.json: Add any new keys you created to the locales/en.json file with the correct English translation.

    Construct the Component: Build the final Vue component using only the translated utility classes and i18n keys. Do not write custom CSS in a <style> block unless absolutely necessary for a unique, non-reusable effect.

    Component Usage: Nuxt 3 auto-imports components. A component at components/shared/navbar.vue should be referenced as <SharedNavbar />.

    Format Your Output: When you provide code, you must start the code block with a comment indicating the full path and filename. This is crucial for organization.

        For .vue, .ts, .js, .json files: // /path/to/your/file.vue

        For .css files: /* /path/to/your/file.css */

    Avoid Code Comments: Do not add comments inside the code that explain what the code does. The code should be self-explanatory. The only required comment is the file path at the very beginning.