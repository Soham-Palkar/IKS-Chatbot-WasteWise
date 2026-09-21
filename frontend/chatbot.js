/**
 * WasteWise Chatbot Logic & Responses
 */

window.ChatbotModule = (function () {
  const KNOWLEDGE_BASE = {
    'banana peel': {
      title: '🍌 Banana Peel',
      category: 'wet',
      categoryLabel: 'Wet / Organic Waste',
      description: 'It is biodegradable organic material and is generally handled with organic/wet waste. Compost at home or place directly in your municipal green bin.',
      degradationTime: '~2 to 5 weeks',
      soilNutrientYield: 'High',
      iksReasoning: {
        observation: 'Organic fruit peel exhibiting cellulosic composition.',
        evidence: 'High moisture, nitrogen-rich, easily degradable by aerobic microorganisms.',
        inference: 'Rapidly converts into humus and bio-fertilizer without microplastic leaching.',
        conclusion: 'Segregate into the green organic/wet waste stream for composting or biomethanation.'
      }
    },
    'plastic bottle': {
      title: '🧴 Plastic Bottle',
      category: 'dry',
      categoryLabel: 'Dry / Recyclable',
      description: 'This item is generally handled through the dry/recyclable waste stream. Empty residual liquids and replace cap securely.',
      resinCode: 'PET 1',
      confidence: 0.94,
      iksReasoning: {
        observation: 'Plastic bottle detected in the visual frame.',
        evidence: 'The detected object has characteristics of a polyethylene terephthalate (PET) beverage container.',
        inference: 'The item is generally handled through the dry/recyclable waste stream.',
        conclusion: 'Dispose through the appropriate dry/recyclable waste stream.'
      }
    },
    'battery': {
      title: '🔋 Battery',
      category: 'ewaste',
      categoryLabel: 'E-Waste',
      description: 'Batteries should not be placed in normal wet or dry waste. Use an appropriate battery/e-waste collection facility to prevent fire hazards and heavy metal contamination.',
      iksReasoning: {
        observation: 'Electrochemical energy storage cell containing heavy metal electrodes.',
        evidence: 'Flammability hazard under compaction and heavy metal leachate potential.',
        inference: 'Requires specialized pyrometallurgical or hydrometallurgical recycling facility.',
        conclusion: 'Divert strictly to authorized municipal e-waste collection center.'
      }
    }
  };

  function matchQuery(text) {
    const lower = text.toLowerCase().trim();
    for (const [key, item] of Object.entries(KNOWLEDGE_BASE)) {
      if (lower.includes(key)) {
        return item;
      }
    }
    return null;
  }

  function renderUserMessage(text, time) {
    return `
      <div class="user-msg-wrap">
        <div class="msg-meta">
          <span>You</span>
          <span>${time}</span>
        </div>
        <div class="user-bubble">${escapeHtml(text)}</div>
      </div>
    `;
  }

  function renderAssistantMatchCard(item) {
    const catClass = item.category === 'wet' ? 'wet' : item.category === 'ewaste' ? 'ewaste' : 'dry';
    const metrics = (item.degradationTime || item.soilNutrientYield) ? `
      <div class="card-metrics-row">
        ${item.degradationTime ? `<span>🌱 Degradation time: <strong>${item.degradationTime}</strong></span>` : ''}
        ${item.soilNutrientYield ? `<span>Soil Nutrient Yield: <strong>${item.soilNutrientYield}</strong></span>` : ''}
      </div>
    ` : '';

    return `
      <div class="asst-card">
        <div class="card-header">
          <div class="card-header-brand">
            <div class="card-header-icon">♻️</div>
            <span>WasteWise Assistant</span>
          </div>
          <span class="card-badge-muted">Instant Match</span>
        </div>
        <div class="card-title-row">
          <h3 class="item-title">${escapeHtml(item.title)}</h3>
          <span class="category-pill ${catClass}">● ${escapeHtml(item.categoryLabel || 'Segregation Protocol')}</span>
        </div>
        <p class="card-description">${escapeHtml(item.description)}</p>
        ${metrics}
      </div>
    `;
  }

  function renderWasteIdentifiedCard(data) {
    const iksDataEncoded = data.iksReasoning ? encodeURIComponent(JSON.stringify(data.iksReasoning)) : '';
    const confidencePct = Math.round((data.confidence || 0.94) * 100);

    return `
      <div class="asst-card">
        <div class="card-header">
          <div class="card-header-brand">
            <div class="card-header-icon">▣</div>
            <span>WASTE IDENTIFIED</span>
          </div>
          <span class="category-pill dry">● ● Dry / Recyclable</span>
        </div>
        <div class="identified-body">
          <div class="waste-thumb-box">
            <img src="${data.imageUrl || 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&auto=format&fit=crop&q=80'}" alt="Waste item" />
            ${data.resinCode ? `<span class="resin-tag">${data.resinCode}</span>` : ''}
          </div>
          <div>
            <h3 class="item-title" style="margin-bottom: 4px;">${escapeHtml(data.object || 'Plastic Bottle')}</h3>
            <p class="card-description" style="margin-bottom: 0;">${escapeHtml(data.reason || 'This item is generally handled through the dry/recyclable waste stream. Empty residual liquids and replace cap securely.')}</p>
          </div>
        </div>
        <div>
          <div class="confidence-row">
            <span>🛡️ AI Confidence Score</span>
            <span>${confidencePct}%</span>
          </div>
          <div class="meter-track">
            <div class="meter-fill" style="width: ${confidencePct}%;"></div>
          </div>
        </div>
        ${data.iksReasoning ? `
          <button class="iks-toggle-btn" data-iks="${iksDataEncoded}" onclick="window.IKSModule.toggleIKS(this)">
            <span>🧠 View IKS Reasoning Architecture</span>
            <span class="iks-arrow">&#709;</span>
          </button>
        ` : ''}
      </div>
    `;
  }

  function renderDecisionCard(cardId) {
    return `
      <div class="asst-card" id="${cardId}">
        <div class="card-header">
          <div class="card-header-brand">
            <span class="status-dot amber"></span>
            <span>Material Verification</span>
          </div>
          <span class="category-pill amber">? Decision Required</span>
        </div>
        <p class="card-description">
          I can help identify the container. Is it still contaminated with food or grease residue?
        </p>
        <div class="decision-options">
          <button class="chip-btn" onclick="window.AppModule.handleDecision('${cardId}', 'contaminated', '🍽️ Yes, contaminated')">
            <span>🍽️</span>
            <span>Yes, contaminated</span>
          </button>
          <button class="chip-btn" onclick="window.AppModule.handleDecision('${cardId}', 'clean', '🧼 No, clean & dry')">
            <span>🧼</span>
            <span>No, clean & dry</span>
          </button>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return {
    matchQuery,
    renderUserMessage,
    renderAssistantMatchCard,
    renderWasteIdentifiedCard,
    renderDecisionCard
  };
})();
