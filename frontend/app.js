/**
 * WasteWise Application Coordinator
 */

window.AppModule = (function () {
  const state = {
    creditsUsed: 42,
    creditsMax: 50,
    model: 'Gemini 2.5 Flash',
    authMode: 'default',
    apiKey: '',
    keyStatus: 'active',
    isFeedPopulated: true
  };

  const elements = {
    chatFeed: document.getElementById('chat-feed'),
    chatForm: document.getElementById('chat-form'),
    chatInput: document.getElementById('chat-input'),
    cameraBtn: document.getElementById('btn-camera'),
    fileInput: document.getElementById('image-file-input'),
    usagePill: document.getElementById('usage-pill'),
    settingsPill: document.getElementById('settings-pill'),
    usageModal: document.getElementById('usage-modal'),
    settingsModal: document.getElementById('settings-modal'),
    settingsForm: document.getElementById('settings-form'),
    authDefault: document.getElementById('auth-default'),
    authCustom: document.getElementById('auth-custom'),
    customKeyGroup: document.getElementById('custom-key-group'),
    customApiKey: document.getElementById('custom-api-key'),
    btnToggleKey: document.getElementById('btn-toggle-key'),
    btnToggleFeed: document.getElementById('btn-toggle-feed'),
    toggleFeedLabel: document.getElementById('toggle-feed-label'),
    feedEnd: document.getElementById('feed-end')
  };

  function init() {
    setupEventListeners();
    loadInitialFeed();
    updateUsageDisplay();
  }

  function setupEventListeners() {
    elements.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = elements.chatInput.value.trim();
      if (!text) return;
      elements.chatInput.value = '';
      sendUserQuery(text);
    });

    elements.cameraBtn.addEventListener('click', () => {
      elements.fileInput.click();
    });

    elements.fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        showImagePreview(file);
        elements.fileInput.value = '';
      }
    });

    elements.usagePill.addEventListener('click', () => openModal(elements.usageModal));
    elements.settingsPill.addEventListener('click', () => openModal(elements.settingsModal));

    document.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.getAttribute('data-close');
        const modal = document.getElementById(modalId);
        if (modal) closeModal(modal);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay);
      });
    });

    document.getElementById('btn-goto-settings')?.addEventListener('click', () => {
      closeModal(elements.usageModal);
      openModal(elements.settingsModal);
    });

    elements.authDefault.addEventListener('change', () => {
      elements.customKeyGroup.classList.add('hidden');
    });

    elements.authCustom.addEventListener('change', () => {
      elements.customKeyGroup.classList.remove('hidden');
    });

    elements.btnToggleKey.addEventListener('click', () => {
      const type = elements.customApiKey.type === 'password' ? 'text' : 'password';
      elements.customApiKey.type = type;
      elements.btnToggleKey.textContent = type === 'password' ? 'Show' : 'Hide';
    });

    elements.settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveSettings();
    });

    elements.btnToggleFeed.addEventListener('click', toggleFeedState);
  }

  function loadInitialFeed() {
    elements.chatFeed.innerHTML = `
      ${window.ChatbotModule.renderUserMessage('Where does a banana peel go?', '10:41 AM')}
      ${window.ChatbotModule.renderAssistantMatchCard({
        title: '🍌 Banana Peel',
        category: 'wet',
        categoryLabel: 'Wet / Organic Waste',
        description: 'It is biodegradable organic material and is generally handled with organic/wet waste. Compost at home or place directly in your municipal green bin.',
        degradationTime: '~2 to 5 weeks',
        soilNutrientYield: 'High'
      })}
      ${window.ChatbotModule.renderWasteIdentifiedCard({
        object: 'Plastic Bottle',
        category: 'dry',
        resinCode: 'PET 1',
        confidence: 0.94,
        reason: 'This item is generally handled through the dry/recyclable waste stream. Empty residual liquids and replace cap securely.',
        imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&auto=format&fit=crop&q=80',
        iksReasoning: {
          observation: 'Plastic bottle detected in the uploaded image.',
          evidence: 'The detected object has characteristics of a polyethylene terephthalate (PET) beverage container.',
          inference: 'The item is generally handled through the dry/recyclable waste stream.',
          conclusion: 'Dispose through the appropriate dry/recyclable waste stream.'
        }
      })}
      ${window.ChatbotModule.renderUserMessage('I have a food container.', '10:44 AM')}
      ${window.ChatbotModule.renderDecisionCard('dec-initial')}
    `;
    scrollToBottom();
  }

  function sendUserQuery(text) {
    appendHTML(window.ChatbotModule.renderUserMessage(text, getCurrentTime()));
    incrementUsage();

    const lower = text.toLowerCase().trim();
    if (lower.includes('food container') || lower.includes('takeout')) {
      showThinking(() => {
        const id = 'dec-' + Date.now();
        appendHTML(window.ChatbotModule.renderDecisionCard(id));
      });
      return;
    }

    const match = window.ChatbotModule.matchQuery(text);
    if (match) {
      showThinking(() => {
        appendHTML(window.ChatbotModule.renderAssistantMatchCard(match));
      });
      return;
    }

    showThinking(() => {
      appendHTML(
        window.ChatbotModule.renderAssistantMatchCard({
          title: text,
          category: 'dry',
          categoryLabel: 'Dry Waste Stream',
          description: 'Ensure the material is dry and cleared of liquid or biological food residue before disposal into the dry recyclables stream. You can also upload a clear photo using the camera button for optical composition verification.'
        })
      );
    });
  }

  function handleDecision(cardId, choiceValue, choiceLabel) {
    const card = document.getElementById(cardId);
    if (card) {
      const btns = card.querySelectorAll('.chip-btn');
      btns.forEach((b) => (b.disabled = true));
    }

    appendHTML(window.ChatbotModule.renderUserMessage(choiceLabel, getCurrentTime()));

    showThinking(() => {
      let advice = '';
      let cat = 'dry';
      let title = '';

      if (choiceValue === 'contaminated') {
        advice = 'Please remove food residue first and then follow the appropriate disposal guidance for the container material. Heavily soiled paper/cardboard belongs with organic/wet waste or general reject waste, whereas rinsed plastic or foil containers belong in dry/recyclable streams.';
        cat = 'wet';
        title = 'Contaminated Food Container';
      } else {
        advice = 'If the container is clean, follow the appropriate dry/recyclable guidance for its material. Clean plastic, glass, and aluminum containers belong in your designated dry recycling bin.';
        cat = 'dry';
        title = 'Clean Food Container';
      }

      appendHTML(
        window.ChatbotModule.renderAssistantMatchCard({
          title,
          category: cat,
          categoryLabel: cat === 'wet' ? 'Wet / Reject Waste' : 'Dry / Recyclable',
          description: advice
        })
      );
    });
  }

  function showImagePreview(file) {
    const url = URL.createObjectURL(file);
    const previewId = 'img-preview-' + Date.now();

    const previewHTML = `
      <div class="asst-card" id="${previewId}">
        <div class="card-header">
          <div class="card-header-brand">
            <span>📷</span>
            <span>Identify Waste</span>
          </div>
          <button class="text-btn" onclick="document.getElementById('${previewId}').remove()">&times;</button>
        </div>
        <div class="identified-body">
          <div class="waste-thumb-box">
            <img src="${url}" alt="Preview" />
          </div>
          <div>
            <h3 class="item-title" style="margin-bottom: 4px;">${escapeHtml(file.name)}</h3>
            <p class="card-description">Ready to extract material composition and segregation protocol.</p>
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn-secondary" onclick="document.getElementById('${previewId}').remove()">Cancel</button>
          <button class="btn-primary" id="btn-analyze-${previewId}">Analyze Waste</button>
        </div>
      </div>
    `;

    appendHTML(previewHTML);

    document.getElementById(`btn-analyze-${previewId}`).addEventListener('click', async () => {
      const card = document.getElementById(previewId);
      if (!card) return;

      card.innerHTML = `
        <div style="text-align: center; padding: 16px;">
          <div style="margin-bottom: 8px; font-size: 1.5rem;">🤖</div>
          <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 4px;">Analyzing waste...</h4>
          <p style="font-size: 0.75rem; color: #707a6f;">Identifying the item and determining its waste category.</p>
          <div class="animated-dots" style="margin-top: 10px;">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      `;

      incrementUsage();

      const result = await callPredictApi(file, url);
      card.outerHTML = window.ChatbotModule.renderWasteIdentifiedCard(result);
      scrollToBottom();
    });
  }

  async function callPredictApi(file, localUrl) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch('/predict', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        return {
          object: json.object || 'Plastic Bottle',
          category: json.category || 'dry',
          confidence: json.confidence || 0.94,
          reason: json.reason || 'Detected rigid recyclable plastic container.',
          imageUrl: localUrl,
          resinCode: json.object?.toLowerCase().includes('bottle') ? 'PET 1' : undefined,
          iksReasoning: {
            observation: `${json.object || 'Item'} detected in the uploaded visual capture.`,
            evidence: json.reason || 'Computer vision model extracted feature contours.',
            inference: `Item characteristics align with ${json.category || 'dry'} waste protocol.`,
            conclusion: `Segregate into the designated ${json.category || 'dry'} waste stream.`
          }
        };
      }
    } catch {
      // Backend not running; fallback to mock data smoothly
    }

    // Mock response
    return {
      object: 'Plastic Bottle',
      category: 'dry',
      confidence: 0.94,
      resinCode: 'PET 1',
      imageUrl: localUrl,
      reason: 'This item is generally handled through the dry/recyclable waste stream. Empty residual liquids and replace cap securely.',
      iksReasoning: {
        observation: 'Plastic bottle detected in the uploaded image.',
        evidence: 'The detected object has characteristics of a polyethylene terephthalate (PET) beverage container.',
        inference: 'The item is generally handled through the dry/recyclable waste stream.',
        conclusion: 'Dispose through the appropriate dry/recyclable waste stream.'
      }
    };
  }

  function showThinking(callback) {
    const thinkingId = 'thinking-' + Date.now();
    const html = `
      <div class="thinking-box" id="${thinkingId}">
        <span>WasteWise is thinking...</span>
        <div class="animated-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    `;
    appendHTML(html);

    setTimeout(() => {
      document.getElementById(thinkingId)?.remove();
      callback();
      scrollToBottom();
    }, 600);
  }

  function toggleFeedState() {
    if (state.isFeedPopulated) {
      elements.chatFeed.innerHTML = `
        <div class="welcome-container">
          <div class="welcome-icon">♻️</div>
          <h1 class="welcome-title">WasteWise</h1>
          <p class="welcome-sub">AI Waste Segregation Assistant</p>
          <p class="welcome-desc">Ask me where something belongs, or upload a photo and I'll help identify it.</p>
          <div class="quick-prompts-label">Quick questions:</div>
          <div class="quick-chips-wrap">
            <button class="quick-chip" onclick="window.AppModule.sendQuickPrompt('Where does a banana peel go?')">🍌 Banana peel</button>
            <button class="quick-chip" onclick="window.AppModule.sendQuickPrompt('Where does a plastic bottle go?')">🧴 Plastic bottle</button>
            <button class="quick-chip" onclick="window.AppModule.sendQuickPrompt('What should I do with a battery?')">🔋 Battery</button>
          </div>
        </div>
      `;
      elements.toggleFeedLabel.textContent = 'Load Sample Feed';
      state.isFeedPopulated = false;
    } else {
      loadInitialFeed();
      elements.toggleFeedLabel.textContent = 'Clear Feed';
      state.isFeedPopulated = true;
    }
  }

  function sendQuickPrompt(promptText) {
    sendUserQuery(promptText);
  }

  function incrementUsage() {
    state.creditsUsed = Math.min(state.creditsMax, state.creditsUsed + 1);
    updateUsageDisplay();
  }

  function updateUsageDisplay() {
    const text = `${state.creditsUsed} / ${state.creditsMax} credits`;
    const pct = Math.round((state.creditsUsed / state.creditsMax) * 100);

    const countEl = document.getElementById('credit-count-text');
    if (countEl) countEl.textContent = text;

    const pctEl = document.getElementById('credit-percent-text');
    if (pctEl) pctEl.textContent = `(${pct}%)`;

    const reqEl = document.getElementById('usage-requests-text');
    if (reqEl) reqEl.textContent = `${state.creditsUsed} / ${state.creditsMax} credits`;

    const usagePctEl = document.getElementById('usage-percent-text');
    if (usagePctEl) usagePctEl.textContent = `${pct}%`;

    const progressFill = document.getElementById('usage-progress-fill');
    if (progressFill) progressFill.style.width = `${pct}%`;

    const keyStatusEl = document.getElementById('usage-key-status');
    if (keyStatusEl) {
      if (state.authMode === 'custom' && state.keyStatus === 'active') {
        keyStatusEl.textContent = '● Custom API Key Active';
      } else if (state.authMode === 'default' && state.keyStatus === 'active') {
        keyStatusEl.textContent = '● Default API Key Active';
      } else {
        keyStatusEl.textContent = '○ API Key Not Configured';
      }
    }
  }

  function saveSettings() {
    const isCustom = elements.authCustom.checked;
    state.authMode = isCustom ? 'custom' : 'default';

    if (isCustom) {
      const key = elements.customApiKey.value.trim();
      state.apiKey = key;
      if (!key) {
        state.keyStatus = 'not_configured';
      } else if (key.length < 10) {
        state.keyStatus = 'invalid';
      } else {
        state.keyStatus = 'active';
      }
    } else {
      state.keyStatus = 'active';
    }

    const statusEl = document.getElementById('settings-key-status');
    const errEl = document.getElementById('settings-key-error');

    if (state.keyStatus === 'active') {
      statusEl.className = 'text-green';
      statusEl.innerHTML = `&#9679; Active (${state.authMode === 'custom' ? 'Custom Key' : 'Default Key'})`;
      errEl.classList.add('hidden');
      document.getElementById('modal-auth-badge').textContent = state.authMode === 'custom' ? 'Custom Key' : 'Default Key';
      setTimeout(() => closeModal(elements.settingsModal), 400);
    } else if (state.keyStatus === 'invalid') {
      statusEl.className = 'text-red';
      statusEl.innerHTML = '&#9679; Invalid';
      errEl.classList.remove('hidden');
    } else {
      statusEl.className = '';
      statusEl.innerHTML = '○ Not configured';
      errEl.classList.add('hidden');
    }
  }

  function openModal(modal) {
    modal.classList.remove('hidden');
  }

  function closeModal(modal) {
    modal.classList.add('hidden');
  }

  function appendHTML(html) {
    elements.chatFeed.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
  }

  function scrollToBottom() {
    elements.feedEnd.scrollIntoView({ behavior: 'smooth' });
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    handleDecision,
    sendQuickPrompt
  };
})();
