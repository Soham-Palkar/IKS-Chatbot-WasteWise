# WasteWise — AI Waste Segregation Assistant

WasteWise is an intelligent waste classification assistant designed to deliver immediate, scientifically grounded waste segregation guidance with transparent Indian Knowledge System (IKS) / Inductive Knowledge System reasoning steps.

## Frontend Architecture

The frontend follows a clean, decoupled structure:

```
frontend/
├── index.html     # Semantic single-page layout matching Stitch reference
├── style.css      # Eco-Intelligence Minimal styling & design tokens
├── app.js         # Application state, image upload, API calls, UI coordination
├── chatbot.js     # Chatbot response templates, knowledge base & decision logic
└── iks.js         # 4-stage IKS reasoning timeline renderer
```

The live development environment also builds an interactive React + TypeScript implementation with Tailwind CSS and Vite for preview and testing.

## Backend API Contract

The frontend connects to the backend without altering the established contract:

- **Endpoint**: `POST /predict`
- **Payload**: `multipart/form-data` with `image` (binary file)
- **Response Format**:
```json
{
  "object": "plastic bottle",
  "category": "dry",
  "confidence": 0.94,
  "reason": "The detected object is a plastic bottle."
}
```

### Mock Fallback Mode
When the backend server is offline or still in development, the frontend automatically falls back to client-side mock classification so development, UI demonstrations, and testing remain uninterrupted.

## IKS Reasoning Architecture

Every classified item provides an expandable 4-stage reasoning timeline:
1. **01 Observation**: Direct visual and material characteristics detected.
2. **02 Evidence**: Material classification rules, resin codes, and moisture/laminate traits.
3. **03 Inference**: Processing stream suitability (mechanical recycling, biomethanation, specialized hazardous facility).
4. **04 Conclusion**: Actionable segregation recommendation for municipal collection bins.

## API Credentials & Usage

- **Session Credit Tracking**: Displays requests used (e.g. 42 / 50 credits) with visual alerts at 90% and 100%.
- **Credentials Configuration**: Supports institutional default keys as well as user-provided Gemini API keys without exposing secrets or saving keys to source control.
