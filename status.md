# WasteWise — Project Status & Roadmap

## 1. Project Overview

**WasteWise — AI-Powered Waste Segregation and Indian Knowledge Systems (IKS) Assistant**

WasteWise is an intelligent waste-management companion that bridges contemporary environmental practices with documented Indian ecological traditions. Rather than functioning simply as "an AI chatbot for waste," WasteWise combines:

1. **AI Conversational Assistance**: Interactive, context-aware dialogue for daily waste segregation queries.
2. **Image-Based Waste Identification**: Visual recognition of household waste items with confidence scoring.
3. **Waste Segregation Guidance**: Direct categorization into municipal disposal streams (Wet/Organic, Dry/Recyclable, E-Waste, Sanitary/Hazardous).
4. **A Curated IKS Knowledge Layer**: Documented historical, agricultural, and traditional conservation principles from Indian Knowledge Systems.
5. **Traditional-to-Contemporary Synthesis**: A structured conceptual connection between documented Indian sustainability practices and modern municipal resource recovery.

---

## 2. Problem Being Addressed

Urban and household waste segregation remains a critical environmental challenge. Mixed waste contaminates recyclable materials, overwhelms municipal landfills, and prevents effective organic composting. Simultaneously, rich indigenous traditions of resource stewardship, upcycling, circular material use, and soil nutrient cycling documented across Indian knowledge traditions are often viewed in isolation from contemporary waste management rules. WasteWise addresses both challenges by providing clear, actionable segregation instructions reinforced by the cultural and ecological wisdom of Indian Knowledge Systems.

---

## 3. Project Objective

WasteWise aims to help users:
- **Identify common waste items** accurately through conversational input or photograph uploads.
- **Understand appropriate waste categories** aligned with standard source-segregation frameworks.
- **Receive practical segregation and disposal guidance** for immediate household action.
- **Understand why an item belongs to a particular stream**, explaining material properties and degradation behavior.
- **Explore relevant documented Indian knowledge traditions** related to ecological responsibility, resource use, reuse, conservation, and sustainable community practices.
- **Connect traditional knowledge concepts with appropriate contemporary waste-management practices**, providing cultural depth to modern ecological citizenship.

> **Note on Technology**: AI (Google Gemini) is the communication and classification technology used to deliver and explain this knowledge, not the IKS itself.

---

## 4. IKS Integration

WasteWise **does not claim** that modern waste segregation systems—such as today's municipal color-coded bin classifications—originated directly from ancient Indian knowledge systems. Modern synthetic materials (like single-use plastics and lithium batteries) did not exist in antiquity.

Instead, the project establishes a rigorous, transparent pedagogical bridge:

```
Documented Indian Knowledge / Traditions
                ↓
Relevant ecological or sustainability principle
                ↓
Modern interpretation
                ↓
Contemporary waste-management practice
                ↓
Practical user guidance
```

The IKS layer focuses strictly on documented, attributable knowledge rather than AI-generated historical claims.

---

## 5. IKS Knowledge Boundary

To maintain scholarly credibility and academic integrity, the IKS component adheres to strict guardrails:

- **Documented & Attributable Knowledge**: Draw exclusively from historical, agricultural, and cultural literature where possible.
- **Clear Distinction**: Clearly distinguish historical/traditional knowledge from modern scientific, industrial, or regulatory guidance.
- **Explicit Interpretations**: Clearly identify when information represents a contemporary application or conceptual parallel rather than an ancient literal rule.
- **No Unsupported Claims**: Never present unsupported claims or myths as historical facts.
- **No Fictional Provenance**: Avoid claiming that every modern waste-management practice originated in ancient India.
- **No Fabricated Citations**: Strictly avoid inventing Sanskrit texts, nonexistent traditions, fictitious communities, fabricated quotations, or false citations.
- **No Generic "Ancient Wisdom"**: Avoid vague platitudes as a substitute for verifiable documented IKS concepts.
- **No Synthetic Tradition Generation**: The AI model must NOT generate fictional traditional practices merely to make responses appear more IKS-oriented.

---

## 6. Two Knowledge Streams

WasteWise maintains an explicit structural separation between its two core knowledge domains:

### A. IKS Knowledge (Traditional Ecological Heritage)
Documented Indian traditions relating to:
- Resource conservation and minimal-waste living (*Aparigraha*, thriftiness).
- Material reuse and upcycling practices (*Jugaad*, fabric re-purposing, brass/copper vessel lifecycle).
- Responsible resource stewardship and reverence for the elements (*Pancha Mahabhuta*).
- Traditional agricultural practices and soil enrichment (*Krishi*, *Vrikshayurveda*).
- Organic resource utilization (biomass recycling, cattle manure composting, natural leaf platters/*pattal*).
- Community environmental ethics and sacred grove preservation (*Devrai* / *Kavu*).

### B. Contemporary Waste Management (Modern Municipal Science)
Contemporary systems based on modern waste science and statutory frameworks (e.g., Solid Waste Management Rules 2016):
- Source segregation protocols (Wet/Organic vs. Dry/Recyclable vs. Hazardous vs. E-Waste).
- Polyethylene resin identification codes (#1 PET through #7 OTHER).
- Industrial material recovery facilities (MRFs) and mechanical recycling.
- Controlled microbial composting and biomethanation.
- Municipal disposal collection schedules and sanitary landfill diversion.
- Hazardous battery and chemical handling protocols.

> **Rule**: These two streams MUST NOT be mixed together as if they share the same historical origin.

---

## 7. Current Architecture

```
Frontend:
  React 19 + TypeScript + Vite + Tailwind CSS v4

AI Engine:
  Google Gemini API (via server/client SDK) with strict WasteWise persona

Vision Pipeline:
  POST /predict (Dedicated CV endpoint with fallback to Gemini Multimodal Vision)

IKS Layer:
  Curated knowledge layer and explainable pedagogical mapping

Storage:
  sessionStorage for client-side API key isolation (auto-cleared on session close)
  No server authentication required.
  No user accounts or persistent tracking profiles.
```

---

## 8. Completed Work

### A. Core Architecture
- Initialized React 19 single-page application bundled with Vite and strict TypeScript type checking (`tsc --noEmit`).
- Configured clean modular architecture under `/src` separating components, services, and types.

### B. UI & Design System
- Built the **Eco-Intelligence** visual identity using Tailwind CSS v4:
  - Sage canvas (`#f3fcf0`), deep forest accents (`#124727`), crisp white cards with subtle borders (`#e2ebdf`), and typography set in `Manrope`.
- Standardized all iconography using `lucide-react`.
- Zero placeholder or landing-page clutter: launches directly into the functional chat and analysis workspace.
- **Dynamic Session Usage Pill**: Compact header indicator formatted as `🟢 0 / 50 credits (0%)` with real-time session tracking. Model selection menus have been completely removed per specification.

### C. AI Chat & Topic Guardrails
- Integrated Gemini conversational service (`src/services/gemini.ts`) configured with the custom WasteWise persona.
- Enforced Indian Solid Waste Management Rules (2016) bin alignment.
- Multi-turn conversational memory allowing users to ask follow-up questions about items previously identified.
- **Waste-Only Scope Guardrail**: Out-of-scope queries (e.g., coding, politics, homework) are automatically intercepted and politely redirected.

### D. API Key Management
- **Settings Modal (`SettingsModal.tsx`)**: Allows users to toggle between Default Project Key and Custom Gemini API Key.
- **Validation**: Verifies user-entered keys against the Gemini endpoint before saving.
- **Secure Isolation (`apiKeyStorage.ts`)**: Custom keys are stored solely in browser `sessionStorage`, never printed to logs or committed to version control.

### E. Image Recognition & Decision Cards
- **Image Input**: Direct camera upload and file drag-and-drop integrated into bottom bar (`ChatInput.tsx`).
- **Waste Identified Card (`WasteIdentifiedCard.tsx`)**: Displays detected waste title, resin code badge, category badge (`CategoryBadge.tsx`), and confidence rating.
- **Decision Cards (`DecisionCard.tsx`)**: Interactive prompt cards for composite or contaminated items (e.g., greasy pizza box top vs. clean lid).
- **Vision Pipeline (`wasteService.ts`)**: Structured client for `POST /predict` with automatic fallback to Gemini vision when external CV services are offline.

### F. IKS Components
- **IKS Reasoning Architecture (`IKSReasoningView.tsx`)**: Transparent 4-step explainable knowledge timeline:
  - `01 Observation`: Detected visual state and material condition.
  - `02 Evidence`: Material rules and degradation parameters.
  - `03 Inference`: Municipal stream suitability and environmental impact.
  - `04 Conclusion`: Actionable segregation step.

### G. Error Handling & Stability
- Resolved React 19 hook execution order bug (*"Expected static flag was missing"*).
- Graceful error states (`ErrorCard.tsx`, `ThinkingIndicator.tsx`, and `MissingKeyCard.tsx`).

---

## 9. Project Boundaries

### In Scope
- Household and everyday municipal waste segregation.
- Wet/organic, dry/recyclable, domestic hazardous, and e-waste classification.
- Image-based single-item waste identification.
- Confidence scoring and uncertainty handling.
- Practical recycling and composting advice.
- Documented IKS sustainability concepts connected to modern practices.
- Multi-turn conversational context.
- User-provided Gemini API key configuration.
- Client-side session credit tracking.

### Out of Scope — General AI
WasteWise is **NOT** a general-purpose AI chatbot. It must not assist with:
- Programming, coding, or debugging.
- Mathematics or homework.
- Politics, sports, or entertainment gossip.
- Creative writing or general knowledge queries.

When presented with out-of-scope questions, WasteWise responds:
> *"I'm WasteWise, an AI assistant focused on waste segregation and waste management. I can help identify waste, explain segregation, recycling, composting, and related sustainable practices."*

### Out of Scope — IKS Breadth
WasteWise does **NOT** attempt to be:
- An exhaustive encyclopedia of Indian civilization.
- A religious or theological information repository.
- A general cultural archive.
- A replacement for dedicated IKS historians or scholars.

The IKS layer is strictly restricted to principles governing **waste minimization, reuse, resource conservation, composting, and ecological stewardship**.

### Out of Scope — Medical & Chemical Safety
WasteWise does **NOT** provide:
- Medical diagnoses or biomedical waste treatment.
- Industrial hazardous materials handling instructions.
- Chemical hazard laboratory analysis.

For dangerous items (e.g., broken mercury thermometers, corrosive industrial chemicals), it provides high-level hazard awareness and directs users to authorized municipal centers.

### Out of Scope — Municipal Authority
WasteWise is an informational assistant, not a statutory municipal authority. Local municipal bylaws vary. Responses employ cautious language (*"typically"*, *"generally"*, *"where local facilities accept it"*, *"follow your local municipal guidance"*).

### Out of Scope — Industrial Waste Operations
The MVP does **NOT** cover:
- Commercial industrial waste logistics.
- Hospital biomedical waste chain-of-custody tracking.
- Municipal fleet route optimization.
- Formal regulatory compliance certification.

---

## 10. AI & Gemini Boundaries

### API Key Security
- Keys are never hardcoded in source code or committed to git.
- Keys are never printed in console logs or displayed in chat messages.
- The UI exclusively reflects status: `● Custom API Key Active`, `● Default API Key Active`, or `○ API Key Not Configured`.

### No Automatic Key Rotation
WasteWise **MUST NOT** implement automatic API key rotation or quota circumvention mechanisms. If a key hits its provider rate limit or quota, the app presents a clear `LimitReachedCard` prompting the user to wait or supply an alternate valid key.

### Session Credit Counter vs. Provider Quotas
The header counter (e.g., `44 / 50 credits (88%)`) measures **WasteWise session credits** (`sessionUsage` / `sessionLimit`). It is an in-app throttling mechanism for demonstrations and is **not** Google's official cloud billing or API quota remaining.

---

## 11. Image Recognition Boundaries

### AI Classification vs. Material Certification
WasteWise image recognition is an **AI-assisted classification aid**, not:
- Laboratory chemical spectrometry.
- Certified recyclability verification.
- Material purity testing.

### Handling Low Confidence
When visual confidence is insufficient, the system avoids confident assertions. It displays an uncertain state (`LowConfidenceCard.tsx`) asking clarifying questions (e.g., *"Is this container glass or PET plastic?"*).

---

## 12. Knowledge Integrity

To ensure academic and pedagogical rigor:
- **Fact vs. Interpretation**: Clear distinction between physical material properties and cultural traditions.
- **Documented References**: Wherever an IKS principle is cited, the reference should trace to documented practices (e.g., terracotta vessel lifecycles, traditional leaf wraps, cow dung anaerobics).
- **Zero Fabrication**: Hallucinated Sanskrit verses or fabricated ancient environmental treaties are strictly barred.

---

## 13. Current MVP (Phase 1 Deliverables)

The WasteWise MVP is defined by 12 core capabilities:

1. **Real AI Waste Chatbot**: Contextual chat powered by Gemini.
2. **User-Configured Gemini Key**: Support for custom AI Studio API keys.
3. **Session Credit Counter**: Header pill tracking session usage out of 50 credits.
4. **Waste-Related Topic Guardrail**: Automatic redirection of off-topic requests.
5. **Multi-Turn Natural Dialogue**: Memory of prior conversation turns.
6. **Image Upload Interface**: Camera input and file selector.
7. **`/predict` Waste Recognition Pipeline**: Vision endpoint with fallback.
8. **Confidence Display**: Explicit confidence percentages on identified items.
9. **IKS Knowledge Layer**: Documented Indian ecological principles.
10. **IKS Knowledge Connection UI**: Explainable knowledge timeline.
11. **Interactive Decision Cards**: Branching choices for contaminated/composite items.
12. **Clean Eco-Intelligence UI**: Single-screen responsive workspace without promo clutter.

---

## 14. Planned Work (Next Iteration)

The following items are actively being formalized for the IKS layer:

- [ ] **Dedicated IKS Knowledge Module (`src/data/iksKnowledge.ts`)**: Structured repository of documented Indian sustainability traditions, categorized by material stream.
- [ ] **IKS Service Interface (`src/services/iksService.ts`)**: Algorithmic matching of identified waste items to relevant IKS principles.
- [ ] **IKS Source Attribution**: Adding academic and historical source tags to IKS insights.
- [ ] **Curated IKS Insight Card (`src/components/IKSInsightCard.tsx`)**: Standalone knowledge connection card shown when a relevant traditional parallel exists.

---

## 15. Future Enhancements (Phase 2 & Phase 3)

*Note: These are explicitly non-MVP features planned for future research cycles.*

### Phase 2: Advanced Sensing & Localization
- **Dedicated CV Backend**: Custom YOLOv8 microservice returning bounding box coordinates for multiple items in a single frame.
- **Packaging Barcode & OCR**: Scanning barcodes against open product databases and reading microscopic resin stamps via OCR.
- **Multilingual & Voice Support**: Regional Indian languages (Hindi, Marathi, Tamil) and native speech recognition.
- **Offline PWA**: Progressive Web App with on-device quantized models for connectivity-free field audits.

### Phase 3: Institutional Analytics
- **Campus Analytics Dashboard**: Aggregate waste audit metrics for colleges and corporate campuses.
- **Contamination Logging**: Longitudinal tracking of municipal segregation compliance.

---

## 16. Implementation Matrix

| Module | Status | Primary File(s) | Implementation Notes |
| :--- | :---: | :--- | :--- |
| **Eco-Intelligence UI** | **Complete** | `src/App.tsx`, `src/index.css` | Tailwind CSS v4, Manrope, sage/forest palette |
| **Session Credit Counter**| **Complete** | `src/components/Header.tsx` | Live `🟢 X / 50 credits (Y%)` pill |
| **API Key Management** | **Complete** | `src/components/SettingsModal.tsx` | Default vs Custom key via `sessionStorage` |
| **Real Gemini Chat** | **Complete** | `src/services/gemini.ts` | Multi-turn chat with WasteWise persona |
| **Topic Guardrail** | **Complete** | `src/services/gemini.ts` | Intercepts non-waste queries with standard text |
| **Image Upload** | **Complete** | `src/components/ChatInput.tsx` | Camera upload + file input |
| **`/predict` Integration** | **Complete** | `src/services/wasteService.ts` | Vision API contract with Gemini fallback |
| **Decision Cards** | **Complete** | `src/components/DecisionCard.tsx` | Contextual resolution for composite waste |
| **IKS Reasoning View** | **Complete** | `src/components/IKSReasoningView.tsx` | 4-step explainable pedagogical timeline |
| **IKS Knowledge Layer** | **Planned** | `src/data/iksKnowledge.ts` | Curated traditional knowledge database |
| **IKS Service Matcher** | **Planned** | `src/services/iksService.ts` | Contextual connector between waste & IKS |
| **IKS Source Citations** | **Planned** | `src/components/IKSInsightCard.tsx` | Verifiable historical attribution tags |
| **Production CV Server** | *Future* | External microservice | Standalone Python YOLO service (Phase 2) |
| **Barcode / OCR Scanner**| *Future* | External / Phase 2 | Barcode lookup & packaging OCR (Phase 2) |
| **Multilingual Voice** | *Future* | Phase 2 | Regional speech synthesis (Phase 2) |
| **Offline PWA** | *Future* | Phase 2 | Service workers & edge inference (Phase 2) |
| **Campus Analytics** | *Future* | Phase 3 | Cloud database & audit logging (Phase 3) |

---

## 17. Demo Flow

The system is designed to demonstrate 8 clear user scenarios:

1. **Demo 1 — Text Waste Query**: User types *"Where does a used tea bag go?"* &rarr; AI categorizes as wet waste, explains composting value.
2. **Demo 2 — Image-Based Identification**: User uploads a photo of a plastic water bottle &rarr; Vision identifies PET #1, dry recyclable stream, with confidence score.
3. **Demo 3 — Follow-Up Dialogue**: User asks *"Do I need to take the cap off?"* &rarr; System remembers bottle context and advises on cap separation.
4. **Demo 4 — Decision-Required Item**: User asks about a pizza box &rarr; Decision Card prompts whether the box has grease stains, routing top to dry and bottom to wet.
5. **Demo 5 — IKS Knowledge Connection**: User examines clay cups (*kulhad*) or coconut shells &rarr; System presents the traditional lifecycle and soil replenishment principle alongside modern bin placement.
6. **Demo 6 — Custom Gemini API Key**: User opens Settings, enters their AI Studio API key, verifies live validation, and switches to Custom key mode.
7. **Demo 7 — Session Credit Usage**: Header pill increments from `44 / 50 credits` to `45 / 50 credits (90%)` upon query execution.
8. **Demo 8 — Out-of-Scope Query**: User types *"What is Python?"* &rarr; System responds:
   > *"I'm WasteWise, an AI assistant focused on waste segregation and waste management. I can help identify waste, explain segregation, recycling, composting, and related sustainable practices."*

---

## 18. IKS Differentiator

The defining innovation of WasteWise is not the mere application of an AI model to chat. The true differentiator is the **structured, explainable integration of documented Indian ecological and sustainability knowledge into contemporary waste-segregation workflows**.

```
Indian Knowledge Traditions
            ↓
Ecological / Resource Principle
            ↓
Modern Waste-Management Interpretation
            ↓
Practical User Action
```

By connecting ancestral resource stewardship with modern waste science, WasteWise transforms segregation from a routine municipal chore into a culturally grounded act of ecological citizenship.

---

## 19. Development Philosophy

WasteWise is deliberately crafted as a focused, high-craft academic and institutional project. The objective is **not** to assemble sprawling, unverified infrastructure for the sake of complexity.

**Our Core Priorities**:
1. Correct, reliable waste-segregation guidance.
2. Genuine, transparent AI interaction.
3. Documented, authentic IKS knowledge integration without pseudo-historical fabrications.
4. Clear structural separation between traditional knowledge and modern statutory regulations.
5. Simple, distraction-free user experience.
6. Practical, demonstrable image recognition with transparent confidence.
7. Responsible AI usage with user key isolation.

---

## 20. Final Project Definition

> **"WasteWise is an AI-assisted waste segregation application that combines conversational waste guidance, image-based waste identification, and a curated Indian Knowledge Systems layer. It connects documented Indian ecological and sustainability knowledge with contemporary waste-management practices to provide practical, understandable guidance to users."**
