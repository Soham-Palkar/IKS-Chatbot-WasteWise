import { WasteItemData } from '../types';
import { IKS_KNOWLEDGE_DATABASE } from './iksKnowledge';
import { formatIKSSteps } from '../services/iksService';

export const QUICK_PROMPTS = [
  { label: 'Banana peel', emoji: '🍌', prompt: 'Where does a banana peel go?' },
  { label: 'Plastic recycling', emoji: '🧴', prompt: 'Is this plastic bottle recyclable?' },
  { label: 'Battery disposal', emoji: '🔋', prompt: 'How should I dispose of an old battery?' },
  { label: 'IKS Sustainability', emoji: '🌿', prompt: 'What is the IKS connection to sustainable waste practices?' },
];

const getIksEntry = (id: string) => {
  const item = IKS_KNOWLEDGE_DATABASE.find((e) => e.id === id);
  return formatIKSSteps(item);
};

export const WASTE_KNOWLEDGE_BASE: Record<string, WasteItemData> = {
  // Wet / Organic Waste
  'banana': {
    title: 'Banana Peel / Fruit Waste',
    category: 'wet',
    categoryLabel: 'Wet / Organic Waste',
    description: 'Banana peels and fruit scraps are 100% biodegradable organic matter. Place them in your green wet waste bin or home compost unit.',
    degradationTime: '~2 to 5 weeks',
    soilNutrientYield: 'High (Rich in Potassium & Phosphorus)',
    iksReasoning: getIksEntry('agricultural-composting-kunapajala'),
  },
  'banana peel': {
    title: 'Banana Peel',
    category: 'wet',
    categoryLabel: 'Wet / Organic Waste',
    description: 'Biodegradable organic material. Place in the green wet waste bin or home compost. High in potassium and organic matter.',
    degradationTime: '~2 to 5 weeks',
    soilNutrientYield: 'High (Potassium & Carbon)',
    iksReasoning: getIksEntry('agricultural-composting-kunapajala'),
  },
  'apple': {
    title: 'Apple Core / Fruit Residue',
    category: 'wet',
    categoryLabel: 'Wet / Organic Waste',
    description: 'Organic fruit scraps decompose quickly. Add to home compost or your municipal green wet waste bin.',
    degradationTime: '~2 to 8 weeks',
    soilNutrientYield: 'Medium-High',
    iksReasoning: getIksEntry('agricultural-composting-kunapajala'),
  },
  'vegetable': {
    title: 'Vegetable Peels & Scraps',
    category: 'wet',
    categoryLabel: 'Wet / Organic Waste',
    description: 'Kitchen vegetable trimmings and peels are nitrogen-rich wet waste ideal for vermicomposting and anaerobic digestion (biogas).',
    degradationTime: '~1 to 4 weeks',
    soilNutrientYield: 'High (Nitrogen & Trace Minerals)',
    iksReasoning: getIksEntry('agricultural-composting-kunapajala'),
  },
  'food': {
    title: 'Cooked Food / Leftovers',
    category: 'wet',
    categoryLabel: 'Wet / Organic Waste',
    description: 'Leftover food scraps belong in the green wet waste bin. Drain excess liquids before disposal to prevent leachate.',
    degradationTime: '~1 to 3 weeks',
    soilNutrientYield: 'Medium',
    iksReasoning: getIksEntry('agricultural-composting-kunapajala'),
  },
  'tea': {
    title: 'Used Tea Leaves & Coffee Grounds',
    category: 'wet',
    categoryLabel: 'Wet / Organic Waste',
    description: 'Used tea leaves and coffee grounds are fantastic soil conditioners. Remove any plastic stapler pins or synthetic tea bags before composting.',
    degradationTime: '~2 to 4 weeks',
    soilNutrientYield: 'Very High (Nitrogen & Aeration)',
    iksReasoning: getIksEntry('agricultural-composting-kunapajala'),
  },
  'eggshell': {
    title: 'Eggshells',
    category: 'wet',
    categoryLabel: 'Wet / Organic Waste',
    description: 'Eggshells provide excellent calcium carbonate to compost. Crush them finely before adding to compost or garden soil.',
    degradationTime: '~1 to 3 years (accelerated by crushing)',
    soilNutrientYield: 'High (Calcium Carbonate)',
    iksReasoning: getIksEntry('agricultural-composting-kunapajala'),
  },
  'coconut': {
    title: 'Coconut Shell & Coir',
    category: 'wet',
    categoryLabel: 'Wet / Biodegradable Biomass',
    description: 'Dry coconut shells and husk (coir) are high in lignin. Great for carbon-heavy composting, mulching, or coir pit moisture retention.',
    degradationTime: '~6 to 12 months',
    soilNutrientYield: 'High Carbon mulching material',
    iksReasoning: getIksEntry('coconut-biomass-coir'),
  },
  'kulhad': {
    title: 'Earthen Clay Cup (Kulhad)',
    category: 'wet',
    categoryLabel: 'Wet / Earthen Biodegradable',
    description: 'Unglazed terracotta clay cups naturally disintegrate into topsoil minerals without toxic chemical residue. Crush and place in garden soil or compost.',
    degradationTime: 'Immediate dissolution upon moisture exposure',
    soilNutrientYield: 'Mineral enrichment (Clay/Silica)',
    iksReasoning: getIksEntry('earthen-kulhad-matka'),
  },
  'pattal': {
    title: 'Biodegradable Leaf Platter (Pattal)',
    category: 'wet',
    categoryLabel: 'Wet / Organic Compostable',
    description: 'Stitched Sal or banana leaf plates without synthetic plastic coating. 100% compostable in municipal wet waste or backyard composting.',
    degradationTime: '~3 to 6 weeks',
    soilNutrientYield: 'High Organic Biomass',
    iksReasoning: getIksEntry('leaf-platters-pattal'),
  },

  // Dry / Recyclable Waste
  'bottle': {
    title: 'Plastic Bottle',
    category: 'dry',
    categoryLabel: 'Dry / Recyclable',
    description: 'Clean plastic bottles (PET 1 or HDPE 2) are fully recyclable. Empty residual liquids, rinse, flatten, and replace the cap securely before placing in the blue dry bin.',
    resinCode: 'PET 1',
    confidence: 0.96,
  },
  'plastic bottle': {
    title: 'Plastic Beverage Bottle',
    category: 'dry',
    categoryLabel: 'Dry / Recyclable',
    description: 'Empty residual liquid, rinse and compress. Place in the blue dry recyclable bin.',
    resinCode: 'PET 1',
    confidence: 0.98,
  },
  'plastic bag': {
    title: 'Plastic Carry Bag / LDPE Film',
    category: 'dry',
    categoryLabel: 'Dry / Recyclable Plastic',
    description: 'Clean, dry flexible plastics (LDPE 4). Collect clean bags together and hand over to local dry waste recyclers or municipal dry bins.',
    resinCode: 'LDPE 4',
  },
  'milk packet': {
    title: 'Milk Pouch / Polyethylene Film',
    category: 'dry',
    categoryLabel: 'Dry / Recyclable Plastic',
    description: 'Cut open, rinse residual milk cleanly with water, and dry completely. Keep the small corner tip attached so it does not become micro-litter.',
    resinCode: 'LDPE 4',
  },
  'paper': {
    title: 'Paper / Newspaper / Office Paper',
    category: 'dry',
    categoryLabel: 'Dry / Recyclable Paper',
    description: 'Keep paper clean and dry. Soiled or greasy paper cannot be recycled and must go into wet waste or composting.',
    degradationTime: '~2 to 6 weeks',
  },
  'cardboard': {
    title: 'Cardboard Box / Packaging',
    category: 'dry',
    categoryLabel: 'Dry / Recyclable',
    description: 'Flatten cardboard boxes to save space. Remove heavy adhesive tape and place into the dry recyclable stream.',
  },
  'can': {
    title: 'Metal / Aluminium Beverage Can',
    category: 'dry',
    categoryLabel: 'Dry / Recyclable Metal',
    description: 'Aluminium and tin cans are infinitely recyclable. Rinse residual liquids and place in the dry recycling bin.',
    iksReasoning: getIksEntry('closed-loop-metallurgy-thathera'),
  },
  'glass': {
    title: 'Glass Bottle / Jar',
    category: 'dry',
    categoryLabel: 'Dry / Recyclable Glass',
    description: 'Rinse out contents. Glass is 100% infinitely recyclable. If broken, wrap carefully in thick newspaper to protect sanitation workers.',
  },
  'cloth': {
    title: 'Textile / Old Fabric',
    category: 'dry',
    categoryLabel: 'Dry / Reusable Textile',
    description: 'Clean old textiles can be upcycled into cleaning rags, quilts (Godhadi), or donated. Place clean scrap textiles into dry waste.',
    iksReasoning: getIksEntry('textile-upcycling-godhadi-kantha'),
  },

  // E-Waste
  'battery': {
    title: 'Battery (Household / Lithium / Lead-Acid)',
    category: 'ewaste',
    categoryLabel: 'E-Waste / Specialized Drop-Off',
    description: 'Batteries must NEVER be thrown into wet or dry household bins. They contain toxic heavy metals (Cadmium, Lithium, Lead) and pose fire hazards. Deposit at designated municipal e-waste collection bins.',
  },
  'phone': {
    title: 'Mobile Phone / Smartphone',
    category: 'ewaste',
    categoryLabel: 'E-Waste / Take-Back Program',
    description: 'Contains precious metals (gold, copper) and hazardous flame retardants. Return via authorized brand take-back programs or registered e-waste recyclers.',
  },
  'charger': {
    title: 'Charging Cable / Adapter',
    category: 'ewaste',
    categoryLabel: 'E-Waste',
    description: 'Cables and power adapters contain copper and PVC. Hand over to certified e-waste aggregators.',
  },
  'laptop': {
    title: 'Laptop / Computer Electronics',
    category: 'ewaste',
    categoryLabel: 'E-Waste',
    description: 'Complex electronics with circuit boards and lithium batteries. Dispose exclusively through authorized e-waste collection centers.',
  },
  'bulb': {
    title: 'CFL / Fluorescent Tube Bulb',
    category: 'hazardous',
    categoryLabel: 'Hazardous / Mercury Waste',
    description: 'CFLs and fluorescent tubes contain toxic mercury vapor. Never break or throw in normal bins. Hand over intact at municipal hazardous waste centers.',
  },

  // Hazardous / Special
  'medicine': {
    title: 'Expired Medicines / Blister Packs',
    category: 'hazardous',
    categoryLabel: 'Hazardous / Domestic Biomedical',
    description: 'Expired pharmaceuticals should never be flushed down drains or tossed in wet/dry bins. Return through pharmacy take-back programs or municipal hazardous waste drop-offs.',
  },
  'aerosol': {
    title: 'Pressurized Aerosol Spray Can',
    category: 'hazardous',
    categoryLabel: 'Hazardous / Pressurized Flammable',
    description: 'Pressurized cans can explode under compaction. Ensure completely empty before disposing of through special hazardous waste channels.',
  },
  'paint': {
    title: 'Paint Can / Chemical Thinner',
    category: 'hazardous',
    categoryLabel: 'Hazardous / Toxic Chemical',
    description: 'Paints and chemical thinners contain VOCs and toxic solvents. Must be collected separately as domestic hazardous waste.',
  },
};

export function findWasteMatch(text: string): WasteItemData | null {
  if (!text) return null;
  const normalized = text.toLowerCase().trim();

  // Exact or direct word inclusion check
  for (const [key, data] of Object.entries(WASTE_KNOWLEDGE_BASE)) {
    if (normalized === key || normalized.includes(key)) {
      return data;
    }
  }

  // Common synonyms / stem matches
  if (normalized.includes('banana') || normalized.includes('kela')) {
    return WASTE_KNOWLEDGE_BASE['banana'];
  }
  if (normalized.includes('fruit') || normalized.includes('peel') || normalized.includes('chhilka')) {
    return WASTE_KNOWLEDGE_BASE['vegetable'];
  }
  if (normalized.includes('sabzi') || normalized.includes('veggie')) {
    return WASTE_KNOWLEDGE_BASE['vegetable'];
  }
  if (normalized.includes('plastic') || normalized.includes('pet')) {
    return WASTE_KNOWLEDGE_BASE['bottle'];
  }
  if (normalized.includes('cell') || normalized.includes('lithium')) {
    return WASTE_KNOWLEDGE_BASE['battery'];
  }
  if (normalized.includes('paper') || normalized.includes('newspaper') || normalized.includes('khabar')) {
    return WASTE_KNOWLEDGE_BASE['paper'];
  }
  if (normalized.includes('can') || normalized.includes('tin') || normalized.includes('aluminium')) {
    return WASTE_KNOWLEDGE_BASE['can'];
  }

  return null;
}
