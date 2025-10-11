# Nuxt 3 AI-Assisted Development Guide

This document outlines a robust and maintainable structure for a Nuxt 3 project using Tailwind CSS for theming, Pinia for state management, and @nuxtjs/i18n for internationalization. The core philosophy is to create a "single source of truth" for all design tokens, text content, and data validation to ensure consistency and scalability.

## Core Philosophy

Our system is built on these principles:

1. **Define Tokens**: All core theme variables (primarily colors) are defined as native CSS variables in a global stylesheet (`assets/css/main.css`). This file is the source of truth for the project's design language.
    
2. **Map Tokens**: The `tailwind.config.ts` file reads these CSS variables and maps them to Tailwind's utility classes (e.g., `bg-primary`, `text-foreground`), making the design language available throughout the application.
    
3. **Centralize State**: Global UI state (e.g., theme mode) is managed in a central Pinia store and accessed via a dedicated composable (`composables/useUI.ts`) for clean, decoupled access.
    
4. **Centralize Content**: All user-facing text is managed through locale files (e.g., `locales/en.json`). Components reference type-safe translation keys instead of hardcoding text.
    
5. **Centralize Validation**: All data validation rules are defined once in a central `schemas` directory using **Zod**. These schemas serve as the single source of truth for securing API endpoints on the server and providing instant user feedback in forms on the client via **`vee-validate`**.
    

## Core Dependencies Overview

This project architecture assumes the installation and configuration of the following key Nuxt modules and libraries:

- **`@nuxtjs/tailwindcss`**: Integrates Tailwind CSS for utility-first styling.
    
- **`@pinia/nuxt`**: Provides state management capabilities with Pinia.
    
- **`@nuxtjs/i18n`**: Handles internationalization and locale files.
    
- **`@nuxtjs/google-fonts`**: Optimally loads and manages Google Fonts.
    
- **`nuxt-security`**: Applies critical security headers, rate limiting, and other middleware.
    
- **`zod`**: The single source of truth for all data validation schemas.
    
- **`vee-validate` & `@vee-validate/zod`**: The client-side form validation library that connects Vue components to Zod schemas.
    

## Expanded Project Structure

This structure provides a clear separation of concerns, making the project intuitive to navigate and scale.

```
project-folder/
├── assets/                  # (PURPOSE: Source files processed by the build tool)
│   ├── css/                 # (PURPOSE: Global stylesheets, e.g., main.css)
│   ├── fonts/               # (PURPOSE: Self-hosted font files, e.g., .woff2)
│   ├── icons/               # (PURPOSE: SVG icons intended for use as components)
│   └── images/              # (PURPOSE: UI images like logos, backgrounds, illustrations)
├── components/
│   ├── ui/                  # (PURPOSE: Highly reusable, stateless UI elements, e.g., BaseButton.vue)
│   ├── shared/              # (PURPOSE: App-wide components with logic, e.g., TheNavbar.vue)
│   └── pages/               # (PURPOSE: Components specific to a single page)
├── composables/             # (PURPOSE: Stateful, reusable logic using Vue's Composition API)
│   ├── auth/
│   │   └── useAuthentication.ts
│   └── useUI.ts
├── data/                    # (PURPOSE: Static, typed data for the app, e.g., navigation links)
│   └── navigation.ts
├── layouts/
├── locales/
├── pages/
├── public/                  # (PURPOSE: Unprocessed files with static URLs)
│   ├── documents/           # (PURPOSE: Downloadable PDFs, reports, etc.)
│   └── robots.txt
├── schemas/                 # (PURPOSE: Zod schemas - the single source of truth for data validation)
│   ├── index.ts
│   ├── authSchemas.ts
│   └── storySchemas.ts
├── server/
│   └── api/
├── stores/
├── utils/                   # (PURPOSE: Stateless, pure helper functions)
│   └── formatters.ts
├── .env
├── nuxt.config.ts
├── package.json
└── tailwind.config.ts
```

## Directory Deep Dive 🧐

Understanding the role of each directory is key to maintaining architectural integrity.

### **`assets` vs. `public`**

- **`assets`**: Use this for files you reference in your components and styles. They are part of your application's source code and will be processed, optimized, and hashed by the build tool (Vite). **Use for**: CSS, fonts, UI images, and icons that need optimization.
    
- **`public`**: Use this for files that must have a fixed name and URL and should not be processed. They are copied directly to the output directory. **Use for**: `robots.txt`, `favicon.ico`, social share images, and downloadable documents like PDFs.
    

### **`composables` vs. `utils`**

This distinction is crucial for separating stateful logic from pure functions.

- **`composables`**: These are for **stateful**, reusable logic. A function belongs here if it uses Vue's Composition API (`ref`, `computed`, etc.) or interacts with a Pinia store. The file names are typically prefixed with `use` (e.g., `useAuthentication.ts`).
    
- **`utils`**: These are for **stateless**, pure helper functions. A function belongs here if it takes an input, produces an output, and has no side effects or reactivity. **Examples**: formatting dates, calculating values, or simple data transformations.
    

### **`data`**

This directory is the source of truth for semi-static, structured content that isn't managed by a CMS or API but is used throughout the application. By defining data here (e.g., in `.ts` files), you get full type safety. **Examples**: main navigation links, footer content, or options for a `<select>` dropdown.

### **`schemas`**

This directory is the absolute source of truth for your data contracts. It contains all **Zod** schemas, which define the shape and validation rules for every piece of data your application handles, from form inputs to API responses.

## Naming & API Conventions

### **1. Naming Conventions**

- **Components (`PascalCase`)**: `components/ui/BaseButton.vue`, `components/shared/TheNavbar.vue`.
    
- **TS/JS Files (`camelCase`)**: `composables/useAuthentication.ts`, `stores/userProfile.ts`, `schemas/authSchemas.ts`.
    
- **i18n Keys (`dot.notation`)**: `pages.login.form.submitButton`.
    

### **2. Server API Structure**

Adopt a **feature-based** API structure by grouping endpoints into directories named after the **resource** they manage.

```
server/
└── api/
    ├── stories/
    │   ├── index.get.ts         # (Handles GET /api/stories)
    │   ├── index.post.ts        # (Handles POST /api/stories)
    │   └── [id].get.ts          # (Handles GET /api/stories/:id)
    └── users/
        └── [id]/
            └── profile.get.ts   # (Handles GET /api/users/:id/profile)
```

## Instructions for AI Assistants

**Your Role**: You are an AI assistant creating new components, pages, and API endpoints that strictly adhere to this architecture.

**Core Directive**: **DO NOT INVENT STYLES, HARDCODE TEXT, OR WRITE CUSTOM VALIDATION.** Translate all visual properties, text, and data validation rules into the project's existing "single source of truth" systems.

### Workflow

1. **Analyze the System First**: Review `assets/css/main.css`, `tailwind.config.ts`, `locales/en.json`, and the `schemas/` directory.
    
2. **Deconstruct the Inspiration**: Analyze stylistic properties, user-facing text, and form inputs.
    
3. **Translate to Theme & i18n Keys**:
    
    - Map styles to Tailwind utility classes (e.g., a blue background becomes `bg-primary`).
        
    - For every piece of text, create a logical, nested i18n key (e.g., `user.profile.title`) and use the `t()` function.
        
4. **Content & Tone Guidelines**:
    
    - **Use Sentence Case**: All user-facing text **must** use sentence case.
        
        - **Correct**: `pages.home.title: "Create a new story"`
            
        - **Incorrect**: `pages.home.title: "Create a New Story"`
            
    - **Be Specific and Factual with Status Messages**: Avoid generic text. The text must professionally and accurately describe the system action.
        
        - **Good Example**: For a process that validates input and calls an AI model, use keys like:
            
            - `status.validatingInput: "Validating input..."`
                
            - `status.queryingModel: "Querying the AI model..."`
                
            - `status.processingResponse: "Processing response..."`
                
5. **Define or Use Validation Schema**:
    
    - For any new data, you **must** use or create a Zod schema from the `schemas/` directory.
        
    - **Server-Side**: Use the schema to validate the request body in API routes.
        
    - **Client-Side**: Import the _same schema_ and use it with `vee-validate` in forms.
        
6. **Update `en.json`**: Add any new i18n keys to `locales/en.json`.
    
7. **Construct the Component/API**: Build the final code using only the translated utility classes, i18n keys, and Zod schemas. Do not write custom CSS in a `<style>` block unless absolutely necessary.
    
8. **Format Your Output**: You **must** start every code block with a comment indicating the full path and filename.
    
    - For `.vue`, `.ts`, `.js`, `.json` files: `// /path/to/your/file.vue`
        
    - For `.css` files: `/* /path/to/your/file.css */`
        
9. **Avoid Code Comments**: Do not add comments inside the code that explain what it does. The file path at the top is the only required comment.
    

## Advanced Project Configuration

### Validation: Zod + vee-validate (Single Source of Truth)

All data validation is centralized in the `schemas/` directory. This creates a perfectly synchronized, DRY (Don't Repeat Yourself) system where a change to a schema is instantly reflected on both the client (for instant UX feedback) and the server (for security).

### API & Server Security (`nuxt-security`)

While Zod validates data _content_, `nuxt-security` handles the _transport layer_. It is configured in `nuxt.config.ts` to automatically provide rate limiting, secure headers (CSP), request size limits, and CORS handling.