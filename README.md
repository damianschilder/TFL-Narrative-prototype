# KenDieAspecten

KenDieAspecten is an innovative adaptive educational platform designed to teach historical concepts through engaging, AI-generated narratives. This application, developed as the "Narrative Tutor" prototype, leverages the power of generative AI to create dynamic and personalized learning experiences.

The system links learning directly to the "Kenmerkende aspecten" fundamental to the Dutch high school history curriculum. By transforming traditional learning material into personal, adaptive stories, KenDieAspecten aims to reduce cognitive load and improve learning outcomes.

## Live Prototype

A live version of the prototype is available for demonstration:

- **URL:** `https://tfl-narrative-prototype.pages.dev/`
    
- **Password:** `jortgeschiedenis`
    

## Key Features

- **AI-Generated Content**: Utilizes Google's Generative AI (specifically `Gemini 2.5 Flash Lite`) to create unique stories and questions tailored to specific learning objectives.
    
- **Adaptive Learning (BKT)**: Implements a **Bayesian Knowledge Tracing (BKT)** model to estimate a student's mastery of each knowledge component and adapt the content difficulty accordingly.
    
- **ITS Architecture**: Built on a formal Intelligent Tutoring System (ITS) framework, including a Domain Model, Student Model, and Pedagogical Model.
    
- **Hierarchical Domain Model**: Content is structured hierarchically from `Tijdvakken` (historical periods) down to `Kenmerkende Aspecten` and granular `Knowledge Components (KCs)`.
    
- **Interactive Quizzes**: Engages students with multiple-choice and open-ended questions to test their understanding.
    
- **Progress Tracking**: Monitors student performance and mastery of different KCs, grouped by conceptual categories (What, How, So what?, Misconceptions).
    
- **Modern Tech Stack**: Built with Nuxt.js, Vue.js, and Tailwind CSS for a responsive and modern user experience.
    

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
    
- npm or yarn
    

### Installation

1. **Clone the repository:**
    
    ```
    git clone [https://github.com/damianschilder/TFL-Narrative-prototype.git](https://github.com/damianschilder/TFL-Narrative-prototype.git)
    cd TFL-Narrative-prototype
    ```
    
2. **Install dependencies:**
    
    ```
    npm install
    ```
    
3. **Set up environment variables:** Create a `.env` file in the root of the project and add the following variables:
    
    ```
    APP_PASSWORD=your_app_password
    SESSION_SECRET=your_session_secret
    GEMINI_API_KEY=your_gemini_api_key
    GEMINI_MODEL=your_gemini_model
    NUXT_PUBLIC_SITE_URL=http://localhost:3000
    ```
    

### Running the Application

- **Development:**
    
    ```
    npm run dev
    ```
    
    The application will be available at `http://localhost:3000`.
    
- **Production Build:**
    
    ```
    npm run build
    ```
    
- **Preview Production Build:**
    
    ```
    npm run preview
    ```
    

## Project Structure

- **`assets`**: Global styles and assets.
    
- **`components`**: Vue components, organized by page and feature.
    
- **`composables`**: Reusable Vue composables.
    
- **`data`**: Static data, including the educational structure (`Tijdvakken`, `Kenmerkende aspecten`, and `Knowledge Components`).
    
- **`i18n`**: Internationalization configuration and locale files.
    
- **`layouts`**: Vue layouts for different page structures.
    
- **`middleware`**: Nuxt middleware for handling authentication and routing.
    
- **`pages`**: Top-level pages of the application.
    
- **`schemas`**: Zod schemas for data validation.
    
- **`server`**: API routes and server-side logic (e.g., `api/stories/index.post.ts` for AI content generation).
    
- **`stores`**: Pinia stores for state management.
    
- **`types`**: TypeScript type definitions.
    
- **`utils`**: Utility functions, including the core **Bayesian Knowledge Tracing** logic (`studentModel.ts`).
    
- **`validation`**: Validation logic for the application.
    

## Core Concepts

### Domain Model

The domain model is the pedagogical foundation of the system. It is structured hierarchically:

1. **Tijdvakken** (Historical Periods): The highest level (e.g., "Era of World Wars").
    
2. **Kenmerkende Aspecten** (Characteristic Aspects): The key concepts for each period (e.g., "The role of modern propaganda").
    
3. **Knowledge Components (KCs)**: Atomic learning objectives for each aspect (e.g., "Define propaganda," "Analyze a propaganda poster"). These KCs are further categorized into `What` (declarative), `How` (procedural), `So what?` (interpretation), and `Misconceptions`.
    

### Student Model (Bayesian Knowledge Tracing)

The student model is the core of the adaptive system. It uses a **BKT** algorithm (defined in `utils/studentModel.ts`) to estimate the student's mastery of each individual KC.

- **`initializeStudentState`**: Sets up the initial state for a student after they complete a pre-test for a topic.
    
- **`updateKCMastery`**: Updates the probability of mastery for a KC based on whether the student's answer was correct or incorrect (accounting for guess and slip probabilities).
    
- **`selectNextKC`**: Selects the next KC for the student to learn based on their current mastery levels and dependencies.
    

### Dynamic Content Generation

The system uses Google's Generative AI to create narrative stories and questions. The logic (in `server/api/stories/index.post.ts`) requests different content based on the student's BKT mastery score for a given KC.

- **Beginner (Mastery < 0.5)**: A simple, factual narrative with a **multiple-choice question (MCQ)** to establish basic understanding.
    
- **Intermediate (0.5 <= Mastery < 0.75)**: A narrative providing context with an **open-ended "recall" question** (e.g., "who," "what," "when") to test factual knowledge.
    
- **Advanced (Mastery >= 0.75)**: A more nuanced narrative presenting a dilemma or complex situation, paired with a **complex "why/how" open-ended question** and a hint to encourage synthesis and analysis.
    

## Technologies Used

- **Nuxt.js**: A powerful Vue.js framework for server-side rendering and static sites.
    
- **Vue.js**: A progressive JavaScript framework for building user interfaces.
    
- **Pinia**: State management library for Vue.js.
    
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
    
- **Google Generative AI**: Specifically the **Gemini 2.5 Flash Lite** model for dynamic content generation.
    
- **Zod**: TypeScript-first schema declaration and validation.
    
- **VeeValidate**: Form validation library for Vue.js.
    
- **VueUse**: A collection of essential Vue Composition Utilities.
    
- **i18n**: For internationalization and localization.
    
- **Nuxt Security**: For adding security headers and middleware.
    
- **Nuxt Auth Utils**: For handling authentication.
    

## Citation

This prototype was developed as part of a research project at Utrecht University. If you use this work, please cite the accompanying paper:

> El Kandoussi, O., van Oordt, B., Schilder, D., Sebel, L., & de Vries, E. (2025). _KenDieAspecten: Transforming historical knowledge into narratives using generative AI_. Utrecht University.
