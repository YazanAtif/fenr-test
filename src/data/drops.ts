import { Drop } from '../types';

export const DROPS: Drop[] = [
  {
    id: 'drop-04',
    code: 'DROP // 004',
    title: 'MONSOON: ARCHIVE CAPSULE',
    releaseDate: '2026-10-15T18:00:00Z',
    description: 'A capsule engineered for rain-soaked nocturnal metropolis streets. Introducing waterproof bonded zip-parkas, 500GSM heavyweight mock-necks, and raw selvedge oversized denim.',
    itemCount: 4,
    status: 'upcoming',
    images: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'drop-03',
    code: 'DROP // 003',
    title: 'THE RETRO COMIC HALFTONE SERIES',
    releaseDate: '2026-09-01T12:00:00Z',
    description: 'Phase 1 release featuring our flagship Phantom Ghost tee and Cyber-Ronin 460GSM hoodie. Limited pieces remaining in vault.',
    itemCount: 6,
    status: 'live',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'
    ]
  }
];

export interface LookbookPanel {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  accent: string;
  details: string[];
  ctaLabel?: string;
  productId?: string;
}

export const LOOKBOOK_PANELS: LookbookPanel[] = [
  {
    id: 'look-01',
    tag: 'EDITORIAL // 01',
    title: 'MIDNIGHT URBAN OVERPASS',
    subtitle: 'The art of staying invisible while demanding respect. 460GSM loopback cotton draped over an oversized dropped shoulder.',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=85',
    accent: '#6B7C5E',
    details: ['Location: Concrete Underpass', 'Time: 02:44 AM', 'Garment: Cyber-Ronin 460GSM Hoodie (Size L)'],
    ctaLabel: 'EXPLORE HOODIE',
    productId: 'kuro-hoodie-01'
  },
  {
    id: 'look-02',
    tag: 'TEXTILE BLUEPRINT // 02',
    title: '460GSM DIAGONAL FRENCH TERRY',
    subtitle: 'Close-up anatomy of our zero-polyester loopback fleece. Engineered to retain its monolithic silhouette wash after wash.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85',
    accent: '#A67C52',
    details: ['Weight: 460 Grams / Sq Meter', 'Composition: 100% Long-Staple Cotton', 'Finish: Pumice Stone Enzyme Wash'],
    ctaLabel: 'VIEW SPECS',
    productId: 'kuro-hoodie-01'
  },
  {
    id: 'look-03',
    tag: 'BEHIND THE SCENES // 03',
    title: 'WATER-BASED DISCHARGE ATELIER',
    subtitle: 'Extracting pigment directly from raw combed cotton so the vintage comic halftone becomes one with the thread.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
    accent: '#5B6A8A',
    details: ['Ink: Mineral Eco-Discharge', 'Matrix: 65 LPI Halftone Dot Pattern', 'Hand-feel: Zero surface thickness'],
    ctaLabel: 'VIEW GRAPHIC TEES',
    productId: 'kuro-tee-01'
  },
  {
    id: 'look-04',
    tag: 'EDITORIAL // 04',
    title: 'STREET WEAPONRY: DUAL-ZIP SILHOUETTE',
    subtitle: 'Sculpt your own drape. The oxidized gunmetal double zipper transforms the hoodie from full armor into a relaxed layered silhouette.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85',
    accent: '#8A7090',
    details: ['Hardware: Matte Oxidized YKK Metal', 'Construction: Split kangaroo pouch', 'Fit: Boxy drop-shoulder'],
    ctaLabel: 'DISCOVER VOIDWALKER',
    productId: 'kuro-hoodie-02'
  },
  {
    id: 'look-05',
    tag: 'MANIFESTO // 05',
    title: 'BUILT DIFFERENT. PRICED FAIR.',
    subtitle: 'Why should a 460GSM hoodie cost $250 just because a brand put a billboard in Soho? We cut out the luxury distributor markup.',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=85',
    accent: '#9E6B6B',
    details: ['Direct-to-Community', 'Milled in Pakistan, Export Quality', 'Global & Local Instant Checkout'],
    ctaLabel: 'JOIN THE ARCHIVE',
  }
];
