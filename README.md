# WasteWise — AI-Powered Waste Segregation & IKS Assistant

WasteWise is an intelligent, eco-focused conversational assistant that combines modern waste segregation science with documented principles from Indian Knowledge Systems (IKS). Built with React 19, TypeScript, Vite, Tailwind CSS v4, and Google Gemini AI, WasteWise provides actionable segregation advice, visual waste identification, and cultural ecological context.

---

## 1. Key Features

- **Conversational Waste Guidance**: Ask natural language questions about classifying, cleaning, composting, and disposing of household materials.
- **Image-Based Waste Identification**: Upload or capture photos of waste items to identify material composition, resin codes (e.g. PET 1), and confidence scores.
- **Dedicated Vision Pipeline & Gemini Fallback**: Seamlessly queries `POST /predict` with fallback to Google Gemini Multimodal Vision.
- **Curated IKS Knowledge Layer**: Connects documented Indian ecological traditions (such as unglazed earthenware *Kulhad*, *Pattal* leaf platters, *Kunapajala* organic soil enrichment, and *Godhadi* textile upcycling) to modern circular practices.
- **4-Stage Explainable IKS Bridge**: Explains traditional practices through a structured timeline (`01 Traditional Knowledge` &rarr; `02 Knowledge Principle` &rarr; `03 Modern Interpretation` &rarr; `04 Practical Application`) with verifiable citations.
- **Interactive Decision Flows**: Resolves ambiguous composite waste (such as greasy takeaway containers vs. clean boxes) via interactive prompt cards.
- **Waste-Only Scope Guardrail**: Intercepts off-topic queries (coding, trivia, homework) and politely refocuses on waste management and sustainability.
- **Flexible API Key Management**: Supports default environment configuration or user-entered Gemini API keys validated live and isolated in `sessionStorage`.
- **Dynamic Session Usage Counter**: Tracks in-app session credit usage (`● 0 / 50 credits (0%)`) with real-time progress indicators.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion.
- **AI Core**: Google Gemini API (`@google/genai` with `gemini-2.5-flash`).
- **Vision Pipeline**: Dedicated `POST /predict` API with Gemini Multimodal Vision fallback.
- **Storage**: `sessionStorage` for temporary client-side API key isolation (no persistent profiles or database required).

---

## 3. Project Architecture

```
User (Browser)
     │
     ▼
React 19 UI (Eco-Intelligence Theme)
  ├── Header (Session Credit Pill & Settings Dialog)
  ├── Chat Feed (UserMessage, AssistantMatchCard, WasteIdentifiedCard)
  ├── DecisionCard (Material Verification)
  └── ChatInput (Text & Camera / File Capture)
     │
     ▼
Application State & Services
  ├── Gemini Service (gemini.ts) ── Multi-turn AI & Scope Guardrail
  ├── Waste Service (wasteService.ts) ── POST /predict & Multimodal Vision
  ├── IKS Service (iksService.ts) ── Curated IKS Database & 4-Stage Bridge
  └── API Key Storage (apiKeyStorage.ts) ── sessionStorage Isolation
```

---

## 4. Setup & Running

### Prerequisites
- Node.js $\ge$ 18.0.0
- npm $\ge$ 9.0.0

### Installation
```bash
git clone <repo-url>
cd IKS-Chatbot-WasteWise
npm install
```

### Environment Configuration (Optional)
Copy `.env.example` to `.env` and set your default Gemini key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Users can also provide their own Gemini API key dynamically via in-app Settings).*

### Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Type Check & Build
```bash
npm run lint   # Runs tsc --noEmit
npm run build  # Builds production bundle in /dist
```

---

## 5. Documentation Directory

Detailed technical and pedagogical documentation is available in `docs/`:

- [`docs/iks.md`](docs/iks.md) — Scholarly rationale, sources, and IKS knowledge boundaries.
- [`docs/architecture.md`](docs/architecture.md) — System architecture and end-to-end data flows.
- [`docs/api.md`](docs/api.md) — `POST /predict` specification and Gemini service contracts.
- [`docs/setup.md`](docs/setup.md) — Complete installation, build, and API key guide.
- [`docs/demo.md`](docs/demo.md) — 5–7 minute step-by-step demonstration walkthrough script.

---

## 6. Scholarly Boundaries & Scope

- **IKS Boundary**: WasteWise does NOT claim modern statutory color-coded bin regulations originated in ancient India. Traditional knowledge and modern regulations are kept conceptually separate.
- **Safety Boundary**: For hazardous, chemical, or medical materials, WasteWise provides high-level safety awareness and directs users to authorized municipal facilities; it never provides dangerous DIY disposal instructions.
- **Municipal Notice**: WasteWise provides general best practices and encourages following local municipal bylaws.
