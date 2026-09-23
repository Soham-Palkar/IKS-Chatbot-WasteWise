# WasteWise — Project Status & Roadmap

## 1. Project Overview

**WasteWise — AI-Powered Waste Segregation and Indian Knowledge Systems (IKS) Assistant**

WasteWise is an intelligent waste-management companion that bridges contemporary environmental practices with documented Indian ecological traditions. Rather than functioning simply as "an AI chatbot for waste," WasteWise combines:

1. **AI Conversational Assistance**: Interactive, context-aware dialogue for daily waste segregation queries.
2. **Image-Based Waste Identification**: Visual recognition of household waste items with confidence scoring.
3. **Waste Segregation Guidance**: Direct categorization into municipal disposal streams (Wet/Organic, Dry/Recyclable, E-Waste, Hazardous/Special).
4. **Curated IKS Knowledge Layer**: Documented historical, agricultural, artisanal, and traditional conservation principles from Indian Knowledge Systems.
5. **Traditional-to-Contemporary Synthesis**: A structured 4-step conceptual connection between documented Indian sustainability practices and modern municipal resource recovery.

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

## 4. IKS Integration & Scholarly Boundary

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

## 5. Two Knowledge Streams

WasteWise maintains an explicit structural separation between its two core knowledge domains:

### A. IKS Knowledge (Traditional Ecological Heritage)
Documented Indian traditions relating to:
- Resource conservation and minimal-waste living (*Aparigraha*, thriftiness).
- Material reuse and upcycling practices (*Godhadi* / *Kantha* fabric quilting).
- Responsible resource stewardship and reverence for the elements (*Pancha Mahabhuta* - earth element mineral return in unglazed *Kulhads*).
- Traditional agricultural practices and soil enrichment (*Krishi*, *Vrikshayurveda*, *Kunapajala* composting).
- Organic resource utilization (biomass recycling, *Pattal* leaf platters, *Kalpavriksha* whole-palm utilization).
- Community environmental ethics and sacred grove preservation (*Devrai* / *Kavu* / *Oran*).

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

## 6. Current Architecture

```
Frontend:
  React 19 + TypeScript + Vite + Tailwind CSS v4

AI Engine:
  Google Gemini API (@google/genai with gemini-2.5-flash) with strict WasteWise persona

Vision Pipeline:
  POST /predict (Dedicated CV endpoint with fallback to Gemini Multimodal Vision)

IKS Layer:
  Curated knowledge database (src/data/iksKnowledge.ts) and service matcher (src/services/iksService.ts)

Storage:
  sessionStorage for client-side API key isolation (auto-cleared on session close)
  No server authentication or user profiles required.
```

---

## 7. Implementation Matrix

| Module | Status | Primary File(s) | Implementation Notes |
| :--- | :---: | :--- | :--- |
| **Eco-Intelligence UI** | **Complete** | `src/App.tsx`, `src/index.css` | Sage canvas (`#f3fcf0`), deep forest accents, Manrope typography |
| **Session Credit Counter**| **Complete** | `src/components/Header.tsx` | Live `● X / 50 credits (Y%)` pill with session throttling |
| **API Key Management** | **Complete** | `src/components/SettingsModal.tsx` | Default vs Custom key via `sessionStorage` with live validation ping |
| **Real Gemini Chat** | **Complete** | `src/services/gemini.ts` | Multi-turn chat with WasteWise persona & context memory |
| **Topic Guardrail** | **Complete** | `src/services/gemini.ts` | Intercepts non-waste queries with standardized redirection |
| **Image Upload & Preview**| **Complete** | `src/components/ChatInput.tsx`, `ImagePreviewCard.tsx` | Camera upload + file drag/drop + preview card |
| **`/predict` Pipeline** | **Complete** | `src/services/wasteService.ts` | Vision API contract with Gemini Multimodal Vision fallback |
| **Confidence Handling** | **Complete** | `src/components/LowConfidenceCard.tsx` | Confidence scoring bar; low-confidence (<0.70) triggers clarification |
| **Decision Cards** | **Complete** | `src/components/DecisionCard.tsx` | Interactive verification for contaminated/composite items |
| **IKS Knowledge Layer** | **Complete** | `src/data/iksKnowledge.ts` | Curated database of documented traditional sustainability practices |
| **IKS Service Matcher** | **Complete** | `src/services/iksService.ts` | Contextual connector between waste items and authentic IKS principles |
| **IKS Connection UI** | **Complete** | `src/components/IKSReasoningView.tsx`, `IKSInsightCard.tsx` | 4-stage explainable timeline with verifiable source tags |
| **Documentation Suite** | **Complete** | `README.md`, `docs/*.md` | Complete architecture, IKS rationale, API, setup, and demo guide |
| **Production CV Server** | *Future* | External microservice | Standalone Python YOLO service (Phase 2) |
| **Barcode / OCR Scanner**| *Future* | External / Phase 2 | Barcode lookup & packaging OCR (Phase 2) |
| **Multilingual Voice** | *Future* | Phase 2 | Regional speech synthesis (Phase 2) |
| **Offline PWA** | *Future* | Phase 2 | Service workers & edge inference (Phase 2) |
| **Campus Analytics** | *Future* | Phase 3 | Cloud database & audit logging (Phase 3) |

---

## 8. Out of Scope

The following features are explicitly **Out of Scope** for this MVP:

- **General-Purpose AI**: Not a general conversational bot, writing assistant, or trivia bot.
- **Programming Assistant**: Will not write, debug, or explain code.
- **General Education Chatbot**: Will not solve mathematics, physics, or general homework.
- **Medical & Diagnostic Advice**: Will not provide healthcare or biomedical waste treatment.
- **Professional Hazardous-Material Analysis**: Does not replace laboratory chemical safety analysis.
- **Municipal Authority Replacement**: Informational aid only; does not override local municipal bylaws.
- **Industrial Waste Management**: Does not handle enterprise freight logistics or industrial effluent tracking.
- **Complete IKS Encyclopedia**: Strictly focused on waste, conservation, reuse, and composting.
- **Religious Chatbot**: Strictly secular, ecological, and cultural knowledge focus.
- **Automatic API-Key Quota Bypass**: No key rotation or unauthorized scraping.
- **Authentication**: No user logins, passwords, or persistent tracking profiles.
- **Enterprise Analytics**: No campus-wide dashboards or kg-tracking tables for MVP.
- **Full Offline AI**: Requires server connection or API key for Gemini models.
- **Complex Production ML Training**: Focuses on real-time inference and integration.
