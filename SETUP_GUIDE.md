# WasteWise Setup & Installation Guide

This document provides step-by-step instructions to configure, run, and deploy the WasteWise AI Waste Segregation Assistant.

---

## 1. Prerequisites

Ensure your development environment meets the following requirements:

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: `npm` (v9+), `yarn`, `pnpm`, or `bun`
- **Google Gemini API Key**: A valid API key from [Google AI Studio](https://aistudio.google.com/)

---

## 2. Installation

1. **Clone or Download the Repository**:
   ```bash
   git clone <repository-url>
   cd wastewise
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

---

## 3. Environment Configuration

The application reads API credentials via environment variables or directly through the UI settings.

1. **Copy the example configuration file**:
   ```bash
   cp .env.example .env
   ```

2. **Set your Gemini API Key in `.env`**:
   ```env
   # Gemini API key for AI chat and classification
   VITE_GEMINI_API_KEY="your_actual_gemini_api_key_here"

   # Optional server-side variable (if using backend proxy)
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```

> **Note on Vite Environment Variables**:
> Variables accessed in the React client must start with the `VITE_` prefix (e.g., `VITE_GEMINI_API_KEY`) so that Vite exposes them to `import.meta.env`.

---

## 4. Running the Application

### Development Mode
Start the Vite local development server:
```bash
npm run dev
```
- The application will be accessible at: `http://localhost:3000` (or the port specified by Vite).

### Production Build
Create an optimized production build:
```bash
npm run build
```
The compiled static assets will be generated in the `dist/` directory.

### Preview Production Build
Test the production build locally:
```bash
npm run preview
```

### Linting & Type Checking
Verify TypeScript types without emitting code:
```bash
npm run lint
```

---

## 5. API Key Configuration Options

WasteWise provides two flexible methods for managing API credentials:

| Method | Where to Configure | Persistence | Best For |
| :--- | :--- | :--- | :--- |
| **Default Project Key** | `.env` file (`VITE_GEMINI_API_KEY`) or in `src/services/gemini.ts` | Permanent in environment | Deployed kiosks, institutional setups, shared prototypes |
| **My API Key (Custom)** | In-app **Settings** modal (top-right gear icon) | Session storage (`sessionStorage`) | Individual users bringing their own AI Studio keys |

---

## 6. Vision Model Backend Integration (`/predict`)

When an image is uploaded via camera or file picker, the client sends a `POST` request to the vision classification endpoint:

- **URL**: `POST /predict`
- **Payload**: `multipart/form-data` with field `image` (binary image file)
- **Expected JSON Response**:
  ```json
  {
    "object": "Plastic Beverage Bottle",
    "category": "dry",
    "confidence": 0.96,
    "reason": "Clear PET polyethylene terephthalate container with #1 resin stamp.",
    "resinCode": "PET #1"
  }
  ```

### Fallback Behavior:
If a dedicated `/predict` backend service is not running, the application **automatically falls back** to client-side heuristics and Gemini multimodal vision classification. You can test full image workflows immediately without launching an external computer vision service.

---

## 7. Project Architecture Overview

```
├── .env.example          # Environment variable template
├── index.html            # Primary HTML entry point
├── package.json          # Dependencies and npm scripts
├── vite.config.ts        # Vite and Tailwind CSS plugins configuration
├── src/
│   ├── main.tsx          # React application root mount
│   ├── App.tsx           # Central application state & chat engine
│   ├── types.ts          # TypeScript interfaces (WasteCategory, IKS, etc.)
│   ├── components/       # Modular UI components
│   │   ├── Header.tsx            # Header with usage pill & settings trigger
│   │   ├── ApiUsageModal.tsx     # Session usage and credit status modal
│   │   ├── SettingsModal.tsx     # Key management modal (Default vs Custom)
│   │   ├── ChatInput.tsx         # Bottom text & camera upload bar
│   │   ├── WasteIdentifiedCard.tsx # Visual classification card
│   │   ├── IKSReasoningView.tsx  # 4-stage IKS explanation timeline
│   │   ├── DecisionCard.tsx      # Interactive question card for ambiguous items
│   │   └── WelcomeState.tsx      # Zero-state suggestion chips
│   ├── services/
│   │   ├── gemini.ts             # Gemini SDK integration & WasteWise persona
│   │   └── wasteService.ts       # Vision prediction API client & fallback logic
│   └── utils/
│       └── apiKeyStorage.ts      # Browser session storage helpers
```

---

## 8. Troubleshooting

- **Error: "Internal React error: Expected static flag was missing"**:
  - This has been resolved. Ensure all hooks in `SettingsModal.tsx` remain at the top level before any conditional guards.
- **Port Conflicts**:
  - The default dev server binds to `0.0.0.0:3000`. If port 3000 is occupied, set `--port <new_port>` in `package.json` or stop the conflicting service.
- **Missing API Key Warning**:
  - If no `.env` key is provided, the app will prompt with a **Missing Key** card. Click **Open Settings** to supply a key via the UI.
