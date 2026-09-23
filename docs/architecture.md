# WasteWise — System Architecture

## 1. High-Level Architecture

WasteWise is built as a single-page React + TypeScript application with modular services, strict state isolation, and dual-mode AI key resolution.

```
+-------------------------------------------------------------------------+
|                               USER (BROWSER)                            |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                                REACT UI                                 |
|  - Header (Compact dynamic session usage pill & Settings modal trigger)  |
|  - Chat Feed (UserMessage, AssistantMatchCard, WasteIdentifiedCard)     |
|  - DecisionCard (Interactive contamination verification)                |
|  - IKSInsightCard & IKSReasoningView (4-step pedagogical bridge)        |
|  - ChatInput (Text field + Camera / File capture)                       |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                           APPLICATION STATE                             |
|  - Messages list: ChatMessage[]                                         |
|  - Session usage: 0 to 50 credits (auto-throttled at limit)             |
|  - Multi-turn conversation memory: ChatHistoryTurn[]                   |
|  - Optical context memory: LastVisionContext                            |
+-------------------------------------------------------------------------+
           |                    |                    |
           v                    v                    v
+-------------------+ +-------------------+ +-------------------+
|  GEMINI SERVICE   | |   WASTE SERVICE   | |    IKS SERVICE    |
| (gemini.ts)       | | (wasteService.ts) | | (iksService.ts)   |
| - Waste persona   | | - POST /predict   | | - Curated dataset |
| - Scope guardrail | | - Gemini Vision   | | - 4-stage bridge  |
| - Multi-turn memory| |   fallback        | | - Verifiable      |
| - Error handler   | | - Confidence score| |   attributions    |
+-------------------+ +-------------------+ +-------------------+
           |                    |                    |
           +--------------------+--------------------+
                                |
                                v
+-------------------------------------------------------------------------+
|                           API KEY RESOLUTION                            |
|                            (apiKeyStorage.ts)                           |
|                                                                         |
| Priority 1: User's Custom Key (stored in window.sessionStorage)         |
| Priority 2: Default Key (from client env VITE_GEMINI_API_KEY)           |
| Fallback: MissingKeyCard prompt                                         |
+-------------------------------------------------------------------------+
```

---

## 2. Core Operational Data Flows

### A. Text Chat Query Flow
1. **User input**: User types a question or clicks a quick prompt in `ChatInput.tsx`.
2. **Pre-flight scope filter**: `isClearlyOutOfScope()` catches blatant off-topic queries client-side without consuming API calls.
3. **Session limit check**: If session usage $\ge 50$, app renders `LimitReachedCard`.
4. **Context extraction**: Recent message history (last 6 turns) + any active `LastVisionContext` are formatted into Google GenAI content parts.
5. **Gemini execution**: Call dispatched to `gemini-2.5-flash` with the WasteWise system prompt.
6. **IKS lookup**: `findIKSConnection()` scans for authentic traditional parallels.
7. **UI render**: Response is displayed inside `AssistantMatchCard` with category badge and optional collapsible IKS connection.

### B. Image Recognition Flow
1. **File capture**: User captures or uploads a photo through `ChatInput.tsx`.
2. **Preview stage**: `ImagePreviewCard` displays thumbnail with Analyze and Cancel controls.
3. **Dedicated endpoint**: `analyzeWasteImage()` attempts `POST /predict`.
4. **Gemini Vision fallback**: If `/predict` is offline, app encodes image to base64 and invokes Gemini multimodal vision.
5. **Confidence evaluation**:
   - If confidence $\ge 0.70$: Renders `WasteIdentifiedCard` with resin code, category badge, and confidence bar.
   - If confidence $< 0.70$: Renders `LowConfidenceCard` prompting the user for material clarification.
6. **Context retention**: Result is stored in `lastVisionPrediction` state for seamless follow-up questions.

### C. Contamination Decision Flow
1. **Ambiguity trigger**: User mentions a composite container (e.g. pizza box, food takeaway container).
2. **Interactive prompt**: App displays `DecisionCard` ("Is it contaminated with grease/food?").
3. **Selection**: User clicks *"Yes, contaminated"* or *"No, clean & dry"*.
4. **Context dispatch**: The selected state is fed into the active conversation to generate precise handling instructions.

### D. Session Credit Flow
- The header tracks `sessionUsage` / `SESSION_LIMIT` (e.g., `44 / 50 credits (88%)`).
- Each successful AI generation or image analysis increments the session counter by 1.
- At 50 credits, additional requests are paused with a clear limit message.
- The counter represents in-app session usage, not Google Cloud account quota.

---

## 3. Security & Key Privacy
- Keys are never hardcoded in repository source code or build artifacts.
- Custom keys are kept strictly in browser `sessionStorage` and vanish when the session closes.
- API keys are never logged in console outputs, network payloads, or UI elements.
