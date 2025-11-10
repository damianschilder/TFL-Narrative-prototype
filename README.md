
# Narrative Tutor

Narrative Tutor is an innovative educational platform designed to teach historical concepts through engaging, AI-generated narratives. This application leverages the power of generative AI to create dynamic and personalized learning experiences for students. By adapting content based on student performance, Narrative Tutor aims to provide a more effective and engaging alternative to traditional learning methods.

## Key Features

- **AI-Generated Content**: Utilizes Google's Generative AI to create unique stories and questions tailored to specific learning objectives.
- **Adaptive Learning**: Adjusts the difficulty and content based on the student's mastery of a topic, ensuring a personalized learning path.
- **Interactive Quizzes**: Engages students with multiple-choice and open-ended questions to test their understanding.
- **Progress Tracking**: Monitors student performance and mastery of different knowledge components.
- **Bilingual Support**: Offers content in both English and Dutch.
- **Modern Tech Stack**: Built with Nuxt.js, Vue.js, and Tailwind CSS for a responsive and modern user experience.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/damianschilder/TFL-Narrative-prototype.git
   cd narrative-tutor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of the project and add the following variables:
   ```env
   APP_PASSWORD=your_app_password
   SESSION_SECRET=your_session_secret
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=your_gemini_model
   NUXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### Running the Application

- **Development:**
  ```bash
  npm run dev
  ```
  The application will be available at `http://localhost:3000`.

- **Production Build:**
  ```bash
  npm run build
  ```

- **Preview Production Build:**
  ```bash
  npm run preview
  ```

## Project Structure

The project is organized into several directories, each with a specific purpose:

- **`assets`**: Contains global styles and assets.
- **`components`**: Vue components are organized by page and feature.
- **`composables`**: Reusable Vue composables.
- **`data`**: Static data, including the educational structure and knowledge components.
- **`i18n`**: Internationalization configuration and locale files.
- **`layouts`**: Vue layouts for different page structures.
- **`middleware`**: Nuxt middleware for handling authentication and routing.
- **`pages`**: Top-level pages of the application.
- **`schemas`**: Zod schemas for data validation.
- **`server`**: API routes and server-side logic.
- **`stores`**: Pinia stores for state management.
- **`types`**: TypeScript type definitions.
- **`utils`**: Utility functions, including the student model logic.
- **`validation`**: Validation logic for the application.

## Core Concepts

### Student Model

The student model is the core of the adaptive learning system. It uses a Bayesian Knowledge Tracing (BKT) algorithm to estimate the student's mastery of each knowledge component. The model is defined in `utils/studentModel.ts` and includes the following key functions:

- **`initializeStudentState`**: Sets up the initial state for a student when they start a new topic.
- **`updateKCMastery`**: Updates the mastery level of a knowledge component based on the student's answer.
- **`selectNextKC`**: Selects the next knowledge component for the student to learn based on their current mastery levels and dependencies.

### AI Content Generation

The application uses Google's Generative AI to create stories and questions. The logic for this is located in `server/api/stories/index.post.ts`. The system generates different types of content based on the student's mastery level:

- **Beginner (Mastery < 0.5)**: A simple narrative with a multiple-choice question.
- **Intermediate (0.5 <= Mastery < 0.75)**: A narrative with an open-ended question requiring a factual answer.
- **Advanced (Mastery >= 0.75)**: A more nuanced narrative with a complex open-ended question and a hint.

## Technologies Used

- **Nuxt.js**: A powerful Vue.js framework for building server-side rendered and static websites.
- **Vue.js**: A progressive JavaScript framework for building user interfaces.
- **Pinia**: A state management library for Vue.js.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Google Generative AI**: Used for generating dynamic learning content.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **VeeValidate**: A form validation library for Vue.js.
- **VueUse**: A collection of essential Vue Composition Utilities.
- **i18n**: For internationalization and localization.
- **Nuxt Security**: For adding security headers and middleware.
- **Nuxt Auth Utils**: For handling authentication.
