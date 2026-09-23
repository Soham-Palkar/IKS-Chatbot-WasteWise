# WasteWise — Comprehensive Demonstration Guide (5–7 Minutes)

This structured demo walkthrough demonstrates all core capabilities of WasteWise for academic, competition, and stakeholder reviews.

---

## Demonstration Script

### Step 1: Clean Initial Workspace (0:00 – 0:30)
- Open `http://localhost:3000`.
- **Show**: Clean, uncluttered Eco-Intelligence interface.
- **Explain**: The app launches directly with the `WelcomeState` and 4 quick prompt suggestions without fake pre-loaded demo dialogue.
- **Point out**: The header displays `WasteWise | AI Waste Segregation Assistant` with dynamic session credits: `● 0 / 50 credits (0%)` and `Settings`.

---

### Step 2: Natural Language Waste Query & AI Classification (0:30 – 1:30)
- Click the quick prompt: `"Where does a banana peel go?"` (or type it in the input bar).
- **Show**: `ThinkingIndicator` active during generation.
- **Result**: `AssistantMatchCard` appears:
  - Title: Banana Peel
  - Category: `Wet / Organic Waste` (Green double-dot badge)
  - Practical segregation and composting guidance
  - Degradation time: `~2 to 5 weeks`
  - Soil nutrient yield: `High`
- **Notice**: Credit counter in header increments to `● 1 / 50 credits (2%)`.

---

### Step 3: Curated IKS Knowledge Connection (1:30 – 2:30)
- On the Banana Peel result (or by typing `"What is the IKS connection to sustainable waste practices?"`), expand the **IKS Knowledge Connection** section.
- **Show**: The 4-step explainable pedagogical timeline:
  - `01 Traditional Knowledge`: Documented organic fermentation & composting (*Kunapajala*).
  - `02 Knowledge Principle`: Soil vitality cycling & biological loop return.
  - `03 Modern Interpretation`: Decentralized aerobic composting and biomethanation.
  - `04 Practical Application`: Segregate organic food scraps to nourish soil.
  - **Source Attribution**: Attributed to historical agricultural treatises (*Vrikshayurveda* of Surapala).
- **Explain**: Traditional knowledge and modern statutory bin rules are kept conceptually separate.

---

### Step 4: Multi-Turn Conversational Memory (2:30 – 3:15)
- In the chat bar, type a contextual follow-up:
  - User: *"Can I put the peel in a plastic bag before throwing it?"*
- **Show**: AI remembers the conversation context and explains that plastic bags seal organic waste from oxygen, preventing natural aerobic decomposition and contaminating the wet waste stream.

---

### Step 5: Ambiguous Composite Item & Interactive Decision Card (3:15 – 4:00)
- In the chat bar, type:
  - User: *"I have a takeout food container."*
- **Show**: The app does not assume a guess. It returns an interactive **Material Verification** `DecisionCard`:
  - Question: *"Is the container or box contaminated with food residue or grease?"*
  - Option 1: `[ 🍽️ Yes, contaminated ]`
  - Option 2: `[ 🧼 No, clean & dry ]`
- Click `[ 🍽️ Yes, contaminated ]`.
- **Show**: The selection flows into conversation context and AI delivers precise instructions on separating the soiled portion or disposing in non-recyclable stream to prevent batch contamination.

---

### Step 6: Image-Based Waste Identification (4:00 – 5:00)
- Click the camera/image button in the bottom input bar.
- Upload an image of a plastic water bottle or battery.
- **Show**: `ImagePreviewCard` displays image with `Analyze Waste` and `Cancel` buttons.
- Click `Analyze Waste`.
- **Result**: `WasteIdentifiedCard` renders:
  - Detected title: `Plastic Bottle`
  - Category: `Dry / Recyclable`
  - Resin Code badge: `PET 1`
  - AI Confidence Score bar: `94%`
  - Practical preparation tips (rinse, empty liquids, replace cap securely).

---

### Step 7: API Key Management & Custom Key Mode (5:00 – 5:45)
- Click the **Settings** button in the header.
- **Show**: Authentication modal with `Default API Key` and `My API Key`.
- Select `My API Key`, enter an API key, and demonstrate live validation before saving.
- **Explain**: Custom keys reside safely in browser `sessionStorage` and are never exposed or transmitted to intermediate servers.

---

### Step 8: Out-of-Scope Guardrail Test (5:45 – 6:30)
- In the chat bar, type:
  - User: *"What is Python?"* (or *"Write a poem about dogs"*).
- **Result**: Polite, instant redirection without wasting quota:
  > *"I'm WasteWise, an AI assistant focused on waste segregation and sustainable waste practices. Ask me about identifying, segregating, recycling, composting, or responsibly managing waste."*
- **Conclude**: WasteWise is a specialized, purpose-built ecological assistant.
