/**
 * Curated Indian Knowledge Systems (IKS) Knowledge Layer
 *
 * IMPORTANT SCHOLARLY BOUNDARIES:
 * 1. WasteWise does NOT claim modern municipal bin segregation originated in antiquity.
 * 2. Traditional knowledge and modern statutory waste regulations are kept strictly separate.
 * 3. Sources represent documented historical, agricultural, artisanal, and community traditions.
 * 4. No Sanskrit verses, citations, or historical traditions are fabricated.
 */

import { WasteCategory } from '../types';

export interface IKSKnowledgeEntry {
  id: string;
  topic: string;
  category: WasteCategory;
  principle: string;
  traditionalKnowledge: string;
  modernInterpretation: string;
  practicalApplication: string;
  source: string;
  keywords: string[];
}

export const IKS_KNOWLEDGE_DATABASE: IKSKnowledgeEntry[] = [
  {
    id: 'earthen-kulhad-matka',
    topic: 'Terracotta & Earthenware Cyclical Lifecycle (Kulhad / Matka)',
    category: 'wet',
    principle: 'Pancha Mahabhuta (Earth Element Cycle) & Natural Mineral Return',
    traditionalKnowledge:
      'Unbaked or low-fired unglazed terracotta vessels (such as Kulhad tea cups and Matka water pots) are crafted from local riverbed clay. After single or seasonal use, discarded pottery naturally dissolves and reintegrates into topsoil as inert mineral sand without hazardous synthetic residue.',
    modernInterpretation:
      'Presents an ancestral precursor to circular zero-waste packaging, eliminating persistent non-biodegradable synthetic polymers.',
    practicalApplication:
      'Crush unglazed earthen kulhad pieces and place them in the wet/organic compost bin or directly into garden soil where they improve soil aeration.',
    source: 'Documented traditional terracotta craft practices (Kumhar communities) and rural vernacular pottery traditions across the Indo-Gangetic plains.',
    keywords: ['kulhad', 'clay cup', 'earthen pot', 'matka', 'terracotta', 'clay', 'mud pot']
  },
  {
    id: 'leaf-platters-pattal',
    topic: 'Biodegradable Leaf Platters & Bowls (Pattal & Dona)',
    category: 'wet',
    principle: 'Natural Biomass Utilization & Zero-Toxicity Dining',
    traditionalKnowledge:
      'Traditional community feasts utilized stitched dining plates and bowls (Pattal and Dona) fashioned from naturally shed broad leaves of Sal (Shorea robusta), Banana (Musa), Banyan (Ficus benghalensis), or Mahua (Madhuca longifolia) using dried bamboo splints.',
    modernInterpretation:
      'Functions as single-use tableware completely free from petrochemical laminates (PE/PFAS), supporting direct aerobic compostability.',
    practicalApplication:
      'Discard leaf plates into the organic/wet waste stream for community composting or biogas generation. Remove any synthetic staples or plastic wrapping first.',
    source: 'Documented cottage craft traditions of rural/tribal communities in Central and Eastern India, and traditional Ayurvedic dining hygiene principles.',
    keywords: ['pattal', 'dona', 'leaf plate', 'banana leaf', 'sal leaf', 'areca plate', 'palm leaf plate']
  },
  {
    id: 'agricultural-composting-kunapajala',
    topic: 'Organic Soil Replenishment & Biological Fermentation (Kunapajala & Krishi)',
    category: 'wet',
    principle: 'Soil Vitality Cycling & Organic Waste Conversion',
    traditionalKnowledge:
      'Classical Indian agricultural texts document sophisticated techniques for fermenting organic biomass, animal dung, crop residues, and kitchen organics into nutrient-rich soil elixirs (such as Kunapajala) and compost (Khad) to nourish the earth.',
    modernInterpretation:
      'Aligns with contemporary aerobic composting, vermicomposting, and biomethanation to prevent organic waste from generating anaerobic methane in landfills.',
    practicalApplication:
      'Segregate all fruit peels, vegetable scraps, tea leaves, and garden waste into the wet waste stream to convert household organics into nutrient-dense compost.',
    source: 'Documented in historical agricultural treatises including Vrikshayurveda of Surapala (c. 10th century CE) and Krishi Parashara.',
    keywords: ['banana peel', 'fruit peel', 'vegetable scrap', 'food waste', 'tea leaves', 'compost', 'organic waste', 'eggshell', 'spoiled food', 'organic']
  },
  {
    id: 'textile-upcycling-godhadi-kantha',
    topic: 'Textile Stewardship & Multilayer Upcycling (Godhadi & Kantha)',
    category: 'dry',
    principle: 'Aparigraha (Non-Possessiveness/Thrift) & Cascade Reuse',
    traditionalKnowledge:
      'In traditional Indian households, worn cotton sarees and dhotis were never discarded. They were systematically layered, quilted with running hand stitches, and converted into durable blankets (Godhadi in Maharashtra, Kantha in Bengal), baby bedding, carry bags (Th पishvi), and cleaning cloths.',
    modernInterpretation:
      'Illustrates the highest tier of the modern waste hierarchy: cascade reuse and creative upcycling before downcycling or disposal.',
    practicalApplication:
      'Repurpose old natural cotton clothing into cleaning rags, cloth grocery totes, or donate clean wearables before placing degraded textiles in dry waste.',
    source: 'Documented indigenous textile folk arts of Maharashtra, Gujarat, and Bengal, reflecting household resource conservation ethics.',
    keywords: ['cotton cloth', 'old clothes', 'fabric', 'textile', 'saree', 'rag', 'kantha', 'godhadi', 'cloth bag']
  },
  {
    id: 'closed-loop-metallurgy-thathera',
    topic: 'Infinite Recyclability of Traditional Metals (Kansara / Thathera Craft)',
    category: 'dry',
    principle: 'High-Value Material Circularity & Indefinite Reclamation',
    traditionalKnowledge:
      'Traditional brass, bronze (Kansa), and copper household utensils were treated as enduring family assets. Worn or broken vessels were routinely traded to traveling metal artisans (Kansara/Thathera) to be melted down and re-beaten into new utensils with zero material downcycling.',
    modernInterpretation:
      'Parallels modern closed-loop non-ferrous metal recycling, which conserves up to 95% of the energy compared to primary ore smelting.',
    practicalApplication:
      'Keep metal scrap, copper/aluminum foils, and tin cans clean and dry. Hand them over to authorized dry recyclers or scrap recovery channels.',
    source: 'Documented traditional metallurgy and the UNESCO-inscribed traditional brass and copper craft of the Thatheras of Jandiala Guru (Punjab).',
    keywords: ['metal', 'can', 'tin', 'brass', 'copper', 'aluminum', 'metal scrap', 'bronze', 'foil']
  },
  {
    id: 'coconut-biomass-coir',
    topic: 'Whole-Plant Biomass Utilization (Kalpavriksha Principle)',
    category: 'wet',
    principle: 'Zero-Residue Multi-Utility Plant Processing',
    traditionalKnowledge:
      'In coastal Indian traditions, the coconut palm was termed Kalpavriksha (tree providing all necessities) because every component had structured utility: flesh and water for nourishment, hard shell for bowls and ladle craft, husk fiber (coir) for ropes and matting, and fronds for thatch.',
    modernInterpretation:
      'Exemplifies total biomass valorization where agricultural byproduct is converted into high-value biodegradable industrial substrates (coco-peat and coir geotextiles).',
    practicalApplication:
      'Place coconut shells and husks in organic/wet waste or use them as moisture-retaining garden mulch, planting medium, or coir compost.',
    source: 'Documented coastal agro-ecological practices of Kerala, Karnataka, Goa, and Tamil Nadu.',
    keywords: ['coconut', 'coconut shell', 'coir', 'husk', 'dry leaves', 'garden waste']
  },
  {
    id: 'community-forest-stewardship-devrai',
    topic: 'Sacred Grove & Watershed Stewardship (Devrai / Oran / Kavu)',
    category: 'special',
    principle: 'Community Ecological Restraint & Habitat Inviolability',
    traditionalKnowledge:
      'Ancient community-protected forest patches (Devrai in Maharashtra, Kavu in Kerala, Oran in Rajasthan) enforced community-wide taboos against felling trees, burning underbrush, or dumping wastes near sacred natural groves and freshwater sources.',
    modernInterpretation:
      'Constitutes an indigenous forerunner to modern eco-sensitive zoning, watershed protection, and community environmental buffer management.',
    practicalApplication:
      'Never dump waste, hazardous chemicals, or non-biodegradable trash into natural waterways, parks, or open soils. Use municipal segregation infrastructure.',
    source: 'Documented ecological studies on Indian sacred groves and customary community conservation systems.',
    keywords: ['environment', 'nature', 'conservation', 'stewardship', 'water body', 'forest', 'iks connection', 'sustainable practices']
  }
];
