# WasteWise — Setup & Installation Guide

## 1. Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Gemini API Key** (optional for basic setup, required for live AI responses): Obtainable free at [Google AI Studio](https://aistudio.google.com/).

---

## 2. Installation

1. Clone or open the repository root:
   ```bash
   cd IKS-Chatbot-WasteWise
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

---

## 3. Environment Configuration

1. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Configure your default Gemini API key (optional):
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

> **Note**: If `VITE_GEMINI_API_KEY` is not provided in `.env`, users can easily enter their own API key dynamically through the **Settings** dialog in the application header.

---

## 4. Running the Application

### Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### Type Checking & Linting
```bash
npm run lint
```
Runs `tsc --noEmit` to verify complete TypeScript type safety.

### Production Build
```bash
npm run build
```
Creates an optimized production bundle in the `/dist` directory.

### Preview Production Build
```bash
npm run preview
```

---

## 5. In-App API Key Configuration

Users can configure custom API keys at runtime without modifying environment files:

1. Click the **Settings** button in the top-right header.
2. Select **My API Key**.
3. Paste your Gemini API key (starts with `AIzaSy...`).
4. Click **Save Key**. The app will perform a lightweight live validation ping with Google AI Studio before saving.
5. Keys are stored in `sessionStorage` for the duration of the browser tab and are never logged or exposed.
