/**
 * IKS Reasoning Architecture Renderer
 * Renders the 4-stage pedagogical timeline (Observation -> Evidence -> Inference -> Conclusion)
 */

window.IKSModule = (function () {
  function renderIKSReasoning(reasoning) {
    if (!reasoning) return '';

    const steps = [
      { num: '01', title: 'Observation', desc: reasoning.observation },
      { num: '02', title: 'Evidence', desc: reasoning.evidence },
      { num: '03', title: 'Inference', desc: reasoning.inference },
      { num: '04', title: 'Conclusion', desc: reasoning.conclusion }
    ];

    return `
      <div class="iks-timeline">
        <div class="iks-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2f7d4a" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.4V11a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.4c1.2-.6 2-1.9 2-3.4a4 4 0 0 0-4-4Z"/><path d="M10 17v1a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-1"/><path d="M9 13h6"/><path d="M10 21h4"/></svg>
          <span>IKS Reasoning Architecture</span>
        </div>
        <div class="timeline-items">
          <div class="timeline-line"></div>
          ${steps
            .map(
              (step) => `
            <div class="timeline-step">
              <div class="step-badge">${step.num}</div>
              <div class="step-label">${step.title}</div>
              <div class="step-desc">${step.desc}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  function toggleIKS(btnElement) {
    const card = btnElement.closest('.asst-card');
    const existing = card.querySelector('.iks-timeline');
    if (existing) {
      existing.remove();
      btnElement.querySelector('.iks-arrow').innerHTML = '&#709;';
    } else {
      const dataStr = btnElement.getAttribute('data-iks');
      if (dataStr) {
        try {
          const reasoning = JSON.parse(decodeURIComponent(dataStr));
          const html = renderIKSReasoning(reasoning);
          btnElement.insertAdjacentHTML('afterend', html);
          btnElement.querySelector('.iks-arrow').innerHTML = '&#708;';
        } catch (e) {
          console.error('Failed to parse IKS data', e);
        }
      }
    }
  }

  return {
    renderIKSReasoning,
    toggleIKS
  };
})();
