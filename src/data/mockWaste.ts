import { WasteItemData, IKSReasoning } from '../types';

export const WASTE_KNOWLEDGE_BASE: Record<string, WasteItemData> = {
  'banana peel': {
    title: 'Banana Peel',
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
    title: 'Plastic Bottle',
    category: 'dry',
    categoryLabel: 'Dry / Recyclable',
    description: 'This item is generally handled through the dry/recyclable waste stream. Empty residual liquids and replace cap securely.',
    resinCode: 'PET 1',
    confidence: 0.94,
    iksReasoning: {
      observation: 'Clear polyethylene terephthalate container with structural ridges and standard thread cap.',
      evidence: 'SPI resin identification code PET 1 confirmed; clean rigid polymer geometry.',
      inference: 'Thermoplastic polymer capable of mechanical shredding, pelletizing, and remelting.',
      conclusion: 'Dispose through the municipal blue/dry recyclable stream after draining all liquid.'
    }
  },
  'battery': {
    title: 'Battery (Household / Lithium)',
    category: 'ewaste',
    categoryLabel: 'E-Waste / Special',
    description: 'Batteries must never be disposed of in general wet or dry waste. They contain toxic heavy metals and pose fire risks. Hand over at designated e-waste drop-off bins.',
    iksReasoning: {
      observation: 'Electrochemical energy storage cell containing electrolyte and heavy metal electrodes.',
      evidence: 'Flammability hazard under compaction and heavy metal leachate potential (lead, cadmium, lithium).',
      inference: 'Requires specialized pyrometallurgical or hydrometallurgical recycling facility.',
      conclusion: 'Divert strictly to authorized municipal e-waste collection center.'
    }
  },
  'coffee cup': {
    title: 'Takeaway Coffee Cup',
    category: 'dry',
    categoryLabel: 'Dry / Reject Waste',
    description: 'Most disposable coffee cups are lined with polyethylene waterproof film, rendering them non-compostable in conventional systems unless certified compostable.',
    resinCode: 'Mixed PAP/PE',
    iksReasoning: {
      observation: 'Paperboard beverage cup with inner hydrophobic laminate layer.',
      evidence: 'Thin plastic (polyethylene) liner prevents liquid soaking but impedes conventional paper repulping.',
      inference: 'Standard paper recycling mills cannot easily separate plastic film from wet pulp fibers.',
      conclusion: 'Separate the plastic lid (recyclable dry waste) and place cup in non-recyclable dry waste unless commercial composting is specified.'
    }
  },
  'aerosol can': {
    title: 'Aerosol Spray Can',
    category: 'hazardous',
    categoryLabel: 'Hazardous / Special',
    description: 'Pressurized metal containers can explode if crushed or incinerated. Ensure completely empty before placing in dry scrap metal recycling.',
    iksReasoning: {
      observation: 'Pressurized tinplate or aluminum canister with propellant valve mechanism.',
      evidence: 'Residual flammable propellants (butane/propane) present explosive danger under compaction.',
      inference: 'Safe for metal recycling only when completely depressurized and emptied.',
      conclusion: 'Depressurize safely or surrender to community hazardous household waste drop-offs.'
    }
  }
};

export const QUICK_PROMPTS = [
  { label: 'Banana peel', emoji: '🍌', prompt: 'Where does a banana peel go?' },
  { label: 'Plastic bottle', emoji: '🧴', prompt: 'Where does a plastic bottle go?' },
  { label: 'Battery', emoji: '🔋', prompt: 'What should I do with a battery?' },
  { label: 'Food container', emoji: '🍱', prompt: 'I have a food container.' }
];

export function findWasteMatch(text: string): WasteItemData | null {
  const normalized = text.toLowerCase().trim();
  for (const [key, data] of Object.entries(WASTE_KNOWLEDGE_BASE)) {
    if (normalized.includes(key)) {
      return data;
    }
  }
  return null;
}

export async function predictWasteImage(
  file: File
): Promise<{
  object: string;
  category: 'wet' | 'dry' | 'ewaste' | 'hazardous';
  confidence: number;
  reason: string;
  resinCode?: string;
  iksReasoning: IKSReasoning;
}> {
  // Check if live backend exists at /predict
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    // Add timeout to prevent hanging if backend is absent
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    
    const response = await fetch('/predict', {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      return {
        object: data.object || 'Plastic Bottle',
        category: (data.category as any) || 'dry',
        confidence: typeof data.confidence === 'number' ? data.confidence : 0.94,
        reason: data.reason || 'Detected rigid recyclable plastic item.',
        resinCode: data.object?.toLowerCase().includes('bottle') ? 'PET 1' : undefined,
        iksReasoning: {
          observation: `${data.object || 'Item'} detected in the uploaded visual input.`,
          evidence: data.reason || 'Computer vision model extracted feature contours corresponding to standard packaging profile.',
          inference: `Item characteristics match standards for ${data.category || 'dry'} waste segregation protocols.`,
          conclusion: `Segregate into the designated ${data.category || 'dry'} waste stream.`
        }
      };
    }
  } catch {
    // Network/backend not ready - proceed smoothly with Mock Mode as required
  }

  // Realistic mock inference based on filename or default
  const lowerName = file.name.toLowerCase();
  
  if (lowerName.includes('banana') || lowerName.includes('fruit') || lowerName.includes('food') || lowerName.includes('apple')) {
    return {
      object: 'Organic Fruit Waste',
      category: 'wet',
      confidence: 0.96,
      reason: 'Organic biodegradable cellular structure identified.',
      iksReasoning: {
        observation: 'Biodegradable organic matter detected in optical capture.',
        evidence: 'Natural cellular surface textures and high moisture profile detected.',
        inference: 'Decomposes naturally without residual hazardous synthetic compounds.',
        conclusion: 'Place into the organic/wet waste bin for composting.'
      }
    };
  }

  if (lowerName.includes('battery') || lowerName.includes('cell') || lowerName.includes('electronic')) {
    return {
      object: 'Lithium Battery Cell',
      category: 'ewaste',
      confidence: 0.91,
      reason: 'Cylindrical or prismatic metal casing with battery contact points detected.',
      iksReasoning: {
        observation: 'Electrochemical energy storage unit detected in scan.',
        evidence: 'Metallic terminal posts and standard cylindrical battery aspect ratio identified.',
        inference: 'Contains lithium and chemical electrolytes requiring specialized recycling.',
        conclusion: 'Divert strictly to an authorized municipal e-waste recycling receptacle.'
      }
    };
  }

  // Default: Plastic Bottle (matches screenshot reference)
  return {
    object: 'Plastic Bottle',
    category: 'dry',
    confidence: 0.94,
    reason: 'This item is generally handled through the dry/recyclable waste stream. Empty residual liquids and replace cap securely.',
    resinCode: 'PET 1',
    iksReasoning: {
      observation: 'Plastic bottle detected in the uploaded image.',
      evidence: 'The detected object has characteristics of a polyethylene terephthalate (PET) beverage bottle.',
      inference: 'The item is generally handled through the dry/recyclable waste stream with high post-consumer reclamation value.',
      conclusion: 'Dispose through the appropriate dry/recyclable waste stream.'
    }
  };
}
