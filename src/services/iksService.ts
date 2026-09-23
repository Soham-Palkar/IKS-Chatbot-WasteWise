/**
 * IKS Service
 * Provides structured query matching for Indian Knowledge Systems concepts
 * and formats the 4-step pedagogical bridge without fabricating connections.
 */

import { IKS_KNOWLEDGE_DATABASE, IKSKnowledgeEntry } from '../data/iksKnowledge';
import { IKSReasoning, WasteCategory } from '../types';

/**
 * Searches the curated IKS knowledge base for documented traditional sustainability principles.
 * Returns null if no authentic traditional parallel is documented.
 */
export function findIKSConnection(text: string): IKSKnowledgeEntry | null {
  if (!text) return null;
  const query = text.toLowerCase().trim();

  // Check specific keyword triggers
  for (const entry of IKS_KNOWLEDGE_DATABASE) {
    const hasMatch = entry.keywords.some((kw) => query.includes(kw));
    if (hasMatch) {
      return entry;
    }
  }

  // Check general IKS inquiry
  if (
    query.includes('iks') ||
    query.includes('traditional') ||
    query.includes('ancient') ||
    query.includes('indian knowledge')
  ) {
    if (query.includes('soil') || query.includes('organic') || query.includes('compost')) {
      return IKS_KNOWLEDGE_DATABASE.find((e) => e.id === 'agricultural-composting-kunapajala') || null;
    }
    if (query.includes('textile') || query.includes('cloth') || query.includes('reuse')) {
      return IKS_KNOWLEDGE_DATABASE.find((e) => e.id === 'textile-upcycling-godhadi-kantha') || null;
    }
    if (query.includes('metal') || query.includes('recycle')) {
      return IKS_KNOWLEDGE_DATABASE.find((e) => e.id === 'closed-loop-metallurgy-thathera') || null;
    }
    if (query.includes('pot') || query.includes('clay') || query.includes('cup')) {
      return IKS_KNOWLEDGE_DATABASE.find((e) => e.id === 'earthen-kulhad-matka') || null;
    }
    // Return community stewardship as general reference
    return IKS_KNOWLEDGE_DATABASE.find((e) => e.id === 'community-forest-stewardship-devrai') || null;
  }

  return null;
}

/**
 * Safely converts a curated IKS knowledge entry into the 4-stage UI format
 */
export function formatIKSSteps(entry?: IKSKnowledgeEntry | null): IKSReasoning | undefined {
  if (!entry) return undefined;
  return {
    traditionalKnowledge: entry.traditionalKnowledge,
    knowledgePrinciple: entry.principle,
    modernInterpretation: entry.modernInterpretation,
    practicalApplication: entry.practicalApplication,
    source: entry.source,
    topic: entry.topic,
    // Backward compatibility mappings:
    observation: entry.traditionalKnowledge,
    evidence: entry.principle,
    inference: entry.modernInterpretation,
    conclusion: entry.practicalApplication,
  };
}

/**
 * Gets a category-level IKS insight if applicable
 */
export function getIKSForCategory(category: WasteCategory): IKSReasoning | undefined {
  if (category === 'wet') {
    const entry = IKS_KNOWLEDGE_DATABASE.find((e) => e.id === 'agricultural-composting-kunapajala');
    return formatIKSSteps(entry);
  }
  return undefined;
}
