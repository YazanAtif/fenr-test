import { Product, Review } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'fenr-hoodie-mj-23',
    name: 'MJ-23 MONOLITH HOODIE // ARCHIVAL EDITION',
    japaneseName: 'MJ-23 // 480GSM TERRY',
    category: 'Hoodies',
    pricePKR: 8900,
    priceUSD: 32,
    originalPricePKR: 11500,
    originalPriceUSD: 42,
    description: 'Constructed from monolithic 480GSM combed diagonal loopback French Terry in Desert Oatmeal. Features bold archival collegiate "23" typography across the chest, rendered with crack-resistant mineral discharge ink. Built with an architectural drawstring-free structured hood and oversized drop-shoulder drape.',
    highlightSpecs: [
      '480GSM Heavyweight Combed Loopback French Terry',
      'Archival "23" Collegiate Discharge Screenprint',
      'Architectural 3D Hood Construction (No drawstrings, sits upright)',
      'Pre-shrunk Sand Dune / Desert Oatmeal Mineral Wash',
      'Deep Concealed Kangaroo Pouch with Reinforced Seams'
    ],
    details: [
      'Oversized boxy drop-shoulder brutalist silhouette',
      'Bold collegiate number 23 chest graphic',
      'Tonal ribbed hem and cuffs that retain memory',
      'Woven damask archive classification tag at lower hem',
      'Reinforced double-needle topstitching across all strain points'
    ],
    fabricCare: [
      '100% Combed Long-Staple Loopback French Terry Cotton',
      'Machine wash gentle in cold water inside out',
      'Dry flat in shade to preserve architectural drape and mineral hue',
      'Do not tumble dry'
    ],
    shippingInfo: 'Dispatched via TCS Express / Leopards within 24 hours. Includes archival dust bag.',
    images: [
      '/images/mj-1.jpg',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85'
    ],
    primaryColor: '#D9D0C1',
    availableColors: [
      { name: 'Desert Oatmeal', hex: '#D9D0C1' },
      { name: 'Charcoal Black', hex: '#111111' },
      { name: 'Muted Olive', hex: '#6B7C5E' }
    ],
    sizes: [
      { size: 'S', inStock: true, quantity: 12 },
      { size: 'M', inStock: true, quantity: 20 },
      { size: 'L', inStock: true, quantity: 15 },
      { size: 'XL', inStock: true, quantity: 6 }
    ],
    badge: 'NEW DROP',
    badgeColor: '#A67C52',
    rating: 5.0,
    reviewsCount: 24,
    isFeatured: true,
    measurements: [
      { size: 'S', chestInches: 44, lengthInches: 27, shoulderInches: 21, sleeveInches: 24, chestCm: 112, lengthCm: 68, shoulderCm: 53, sleeveCm: 61 },
      { size: 'M', chestInches: 47, lengthInches: 28.5, shoulderInches: 22.5, sleeveInches: 25, chestCm: 119, lengthCm: 72, shoulderCm: 57, sleeveCm: 63 },
      { size: 'L', chestInches: 50, lengthInches: 30, shoulderInches: 24, sleeveInches: 26, chestCm: 127, lengthCm: 76, shoulderCm: 61, sleeveCm: 66 },
      { size: 'XL', chestInches: 53, lengthInches: 31, shoulderInches: 25.5, sleeveInches: 26.5, chestCm: 135, lengthCm: 78, shoulderCm: 65, sleeveCm: 67 }
    ]
  },
  {
    id: 'fenr-tee-pete-spidey',
    name: 'PETE "HEY ITS SPIDEY" // ARCHIVE BOX TEE',
    japaneseName: 'SPIDEY // 280GSM PANEL',
    category: 'Graphic Tees',
    pricePKR: 5200,
    priceUSD: 19,
    originalPricePKR: 6500,
    originalPriceUSD: 24,
    description: 'Constructed from custom-milled 280GSM combed Pakistani long-staple cotton in Raw Cream. Front features gothic blackletter "hey its spidey" typography with a hanging Spider-Man detail. The back carries an archival 4-color halftone graphic depicting Spidey leaping through brutalist skyscrapers.',
    highlightSpecs: [
      '280GSM Heavyweight 100% Combed Pakistani Cotton',
      'Gothic Blackletter Chest Typography with Hanging Spidey Detail',
      'High-Contrast Skyscraper Halftone Comic Backprint',
      '1.25" High-Density Collar Rib (Anti-Bacon Guarantee)',
      'Pre-shrunk Boxy Drop-Shoulder Silhouette'
    ],
    details: [
      'Relaxed boxy cut with elongated sleeve drape',
      'Breathable water-based discharge screenprint with zero plastic hand-feel',
      'Vintage comic frame border on back graphic',
      'Blind stitched sleeves and hem',
      'Custom woven damask brand label on outer hem'
    ],
    fabricCare: [
      '100% Organic Combed Long-Staple Cotton',
      'Machine wash cold inside out with like colors',
      'Line dry in shade to preserve crisp graphic register',
      'Do not iron directly over print'
    ],
    shippingInfo: 'Dispatched via TCS Express / Leopards within 24 hours. Includes archival sticker set.',
    images: [
      '/images/pete-1.jpg',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85'
    ],
    primaryColor: '#F0EDE8',
    availableColors: [
      { name: 'Raw Cream', hex: '#F0EDE8' },
      { name: 'Deep Black', hex: '#0A0A0A' },
      { name: 'Washed Indigo', hex: '#5B6A8A' }
    ],
    sizes: [
      { size: 'S', inStock: true, quantity: 16 },
      { size: 'M', inStock: true, quantity: 22 },
      { size: 'L', inStock: true, quantity: 18 },
      { size: 'XL', inStock: true, quantity: 8 }
    ],
    badge: 'NEW DROP',
    badgeColor: '#9E6B6B',
    rating: 5.0,
    reviewsCount: 29,
    isFeatured: true,
    measurements: [
      { size: 'S', chestInches: 38, lengthInches: 27, shoulderInches: 18, sleeveInches: 8.5, chestCm: 96, lengthCm: 68, shoulderCm: 46, sleeveCm: 21 },
      { size: 'M', chestInches: 41, lengthInches: 28.5, shoulderInches: 19.5, sleeveInches: 9, chestCm: 104, lengthCm: 72, shoulderCm: 49, sleeveCm: 23 },
      { size: 'L', chestInches: 44, lengthInches: 30, shoulderInches: 21, sleeveInches: 9.5, chestCm: 112, lengthCm: 76, shoulderCm: 53, sleeveCm: 24 },
      { size: 'XL', chestInches: 47, lengthInches: 31, shoulderInches: 22.5, sleeveInches: 10, chestCm: 120, lengthCm: 78, shoulderCm: 57, sleeveCm: 25 }
    ]
  },
  {
    id: 'fenr-hoodie-sbr',
    name: 'SABR (صَبْر) ARCHITECTURAL OVERSIZED HOODIE',
    japaneseName: 'SABR // 480GSM TERRY',
    category: 'Hoodies',
    pricePKR: 8900,
    priceUSD: 32,
    originalPricePKR: 11500,
    originalPriceUSD: 42,
    description: 'Constructed from monolithic 480GSM combed diagonal loopback French Terry in Desert Oatmeal. Features archival architectural Arabic brush calligraphy "صَبْرٌ" (Sabr - Sacred Patience & Endurance) across the chest, complemented by an eight-point geometric star sleeve embroidery and woven archive hem label.',
    highlightSpecs: [
      '480GSM Ultra-Heavyweight Combed Diagonal French Terry',
      'Archival "صَبْرٌ" Calligraphic Discharge Screenprint (Zero hand-feel)',
      'Intricate Eight-Point Geometric Star Sleeve Forearm Embroidery',
      'Architectural 3D Hood Construction (No drawstrings, sits upright)',
      'Pre-shrunk Sand Dune / Desert Oatmeal Volcanic Mineral Wash'
    ],
    details: [
      'Oversized drop-shoulder brutalist silhouette',
      'Arabic brush calligraphy across chest symbolizing steadfast resilience',
      'Geometric Islamic star patch on left forearm',
      'Woven damask archive classification tag at lower hem',
      'Reinforced double-needle topstitching across all strain points'
    ],
    fabricCare: [
      '100% Combed Long-Staple Loopback French Terry Cotton',
      'Machine wash gentle in cold water inside out',
      'Dry flat in shade to preserve architectural drape and mineral hue',
      'Do not tumble dry'
    ],
    shippingInfo: 'Dispatched via TCS Express / Leopards within 24 hours. Includes archival dust bag.',
    images: [
      '/images/sbr-1.jpg',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85'
    ],
    primaryColor: '#D9D0C1',
    availableColors: [
      { name: 'Desert Oatmeal', hex: '#D9D0C1' },
      { name: 'Charcoal Black', hex: '#111111' },
      { name: 'Muted Olive', hex: '#6B7C5E' }
    ],
    sizes: [
      { size: 'S', inStock: true, quantity: 14 },
      { size: 'M', inStock: true, quantity: 22 },
      { size: 'L', inStock: true, quantity: 18 },
      { size: 'XL', inStock: true, quantity: 8 }
    ],
    badge: 'NEW DROP',
    badgeColor: '#A67C52',
    rating: 5.0,
    reviewsCount: 31,
    isFeatured: true,
    measurements: [
      { size: 'S', chestInches: 44, lengthInches: 27, shoulderInches: 21, sleeveInches: 24, chestCm: 112, lengthCm: 68, shoulderCm: 53, sleeveCm: 61 },
      { size: 'M', chestInches: 47, lengthInches: 28.5, shoulderInches: 22.5, sleeveInches: 25, chestCm: 119, lengthCm: 72, shoulderCm: 57, sleeveCm: 63 },
      { size: 'L', chestInches: 50, lengthInches: 30, shoulderInches: 24, sleeveInches: 26, chestCm: 127, lengthCm: 76, shoulderCm: 61, sleeveCm: 66 },
      { size: 'XL', chestInches: 53, lengthInches: 31, shoulderInches: 25.5, sleeveInches: 26.5, chestCm: 135, lengthCm: 78, shoulderCm: 65, sleeveCm: 67 }
    ]
  },
  {
    id: 'kuro-tee-01',
    name: 'PHANTOM GHOST // BOX TEE',
    japaneseName: 'PHANTOM // 280GSM COMIC',
    category: 'Graphic Tees',
    pricePKR: 5200,
    priceUSD: 19,
    originalPricePKR: 6500,
    originalPriceUSD: 24,
    description: 'Constructed from custom-milled 280GSM combed Pakistani long-staple cotton. Features an archival vintage comic halftone backprint depicting neon-drenched urban back-alleys, finished with premium water-based discharge ink that softens with every wash.',
    highlightSpecs: [
      '280GSM Heavyweight 100% Combed Cotton',
      'Drop-shoulder boxy architectural silhouette',
      'Water-based breathable halftone discharge print',
      'Reinforced 1.25" rib knit collar (won\'t sag or bacon)',
      'Pre-shrunk to retain structural drape'
    ],
    details: [
      'Relaxed, slightly boxy drop-shoulder cut',
      'Archival comic halftone illustration on back',
      'Tonal minimalist typography on left chest',
      'Blind stitched sleeves and hem',
      'Custom woven damask brand label on outer hem'
    ],
    fabricCare: [
      '100% Organic Long-Staple Combed Cotton',
      'Machine wash cold inside out with like darks',
      'Line dry in shade to preserve deep black pigment',
      'Do not iron directly over discharge screenprint'
    ],
    shippingInfo: 'Dispatched via TCS Express / Leopards within 24 hours. Free shipping across Pakistan on orders over Rs. 5,000. 14-day hassle-free size exchanges.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85'
    ],
    primaryColor: '#0A0A0A',
    availableColors: [
      { name: 'Deep Black', hex: '#0A0A0A' },
      { name: 'Washed Indigo', hex: '#5B6A8A' },
      { name: 'Muted Olive', hex: '#6B7C5E' }
    ],
    sizes: [
      { size: 'S', inStock: true, quantity: 18 },
      { size: 'M', inStock: true, quantity: 24 },
      { size: 'L', inStock: true, quantity: 12 },
      { size: 'XL', inStock: true, quantity: 6 }
    ],
    badge: 'NEW DROP',
    badgeColor: '#6B7C5E',
    rating: 4.9,
    reviewsCount: 42,
    isFeatured: true,
    measurements: [
      { size: 'S', chestInches: 38, lengthInches: 27, shoulderInches: 18, sleeveInches: 8.5, chestCm: 96, lengthCm: 68, shoulderCm: 46, sleeveCm: 21 },
      { size: 'M', chestInches: 41, lengthInches: 28.5, shoulderInches: 19.5, sleeveInches: 9, chestCm: 104, lengthCm: 72, shoulderCm: 49, sleeveCm: 23 },
      { size: 'L', chestInches: 44, lengthInches: 30, shoulderInches: 21, sleeveInches: 9.5, chestCm: 112, lengthCm: 76, shoulderCm: 53, sleeveCm: 24 },
      { size: 'XL', chestInches: 47, lengthInches: 31, shoulderInches: 22.5, sleeveInches: 10, chestCm: 120, lengthCm: 78, shoulderCm: 57, sleeveCm: 25 }
    ]
  },
  {
    id: 'kuro-hoodie-01',
    name: 'CYBER-RONIN 460GSM HEAVY HOODIE',
    japaneseName: 'CYBER-RONIN // 460GSM HEAVY',
    category: 'Hoodies',
    pricePKR: 8900,
    priceUSD: 32,
    originalPricePKR: 11000,
    originalPriceUSD: 39,
    description: 'An architectural statement piece engineered from 460GSM diagonal french terry loopback fleece. Built without drawstrings for an uncompromising minimalist silhouette, featuring a double-walled structured hood that stands tall on its own.',
    highlightSpecs: [
      '460GSM Diagonal French Terry Cotton',
      'Double-ply crossover hood (no drawstrings, clean structure)',
      'Concealed side-seam kangaroo pocket with matte YKK zips',
      'Heavyweight 2x2 ribbing at hem and cuffs',
      'Zero synthetic polyester fillers — 100% breathable pure cotton'
    ],
    details: [
      'Oversized boxy drape with articulated drop-shoulders',
      'Vintage comic halftone graphic discreetly embedded in lining',
      'Tonal silicone brand stamp on wrist cuff',
      'Hidden internal zip pocket for AirPods/wallet',
      'Pre-washed with volcanic pumice for soft luxury hand feel'
    ],
    fabricCare: [
      '100% Heavyweight Diagonal French Terry Cotton',
      'Cold gentle wash cycle with mild detergent',
      'Lay flat to dry to preserve silhouette geometry',
      'Do not tumble dry'
    ],
    shippingInfo: 'Ships express across Pakistan via TCS or Leopards Courier. Dispatch takes 24 hours. Includes complimentary protective dust bag.',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85'
    ],
    primaryColor: '#1A1A1A',
    availableColors: [
      { name: 'Charcoal Black', hex: '#111111' },
      { name: 'Muted Olive', hex: '#6B7C5E' },
      { name: 'Burnt Amber', hex: '#A67C52' }
    ],
    sizes: [
      { size: 'S', inStock: true, quantity: 15 },
      { size: 'M', inStock: true, quantity: 20 },
      { size: 'L', inStock: true, quantity: 8 },
      { size: 'XL', inStock: true, quantity: 4 }
    ],
    badge: 'SELLING FAST',
    badgeColor: '#A67C52',
    rating: 5.0,
    reviewsCount: 68,
    isFeatured: true,
    measurements: [
      { size: 'S', chestInches: 44, lengthInches: 27, shoulderInches: 21, sleeveInches: 24, chestCm: 112, lengthCm: 68, shoulderCm: 53, sleeveCm: 61 },
      { size: 'M', chestInches: 47, lengthInches: 28.5, shoulderInches: 22.5, sleeveInches: 25, chestCm: 119, lengthCm: 72, shoulderCm: 57, sleeveCm: 63 },
      { size: 'L', chestInches: 50, lengthInches: 30, shoulderInches: 24, sleeveInches: 26, chestCm: 127, lengthCm: 76, shoulderCm: 61, sleeveCm: 66 },
      { size: 'XL', chestInches: 53, lengthInches: 31, shoulderInches: 25.5, sleeveInches: 26.5, chestCm: 135, lengthCm: 78, shoulderCm: 65, sleeveCm: 67 }
    ]
  },
  {
    id: 'kuro-tee-02',
    name: 'NEO-AKIRA VINTAGE COMIC TEE',
    japaneseName: 'AKIRA // 260GSM ARCHIVE',
    category: 'Graphic Tees',
    pricePKR: 4900,
    priceUSD: 18,
    originalPricePKR: 5800,
    originalPriceUSD: 21,
    description: 'A tribute to 1988 cyberpunk manga illustration. Printed on an acid-washed vintage black tee using a 4-color halftone dot matrix process that mimics 1980s newsprint comic registers.',
    highlightSpecs: [
      '260GSM 100% Combed Cotton with mineral wash',
      'Retro comic frame border graphic with Ben-Day dot styling',
      'Distressed hand-cracked print technique for vintage authenticity',
      'Reinforced shoulder-to-shoulder chainstitch tape',
      'Relaxed unisex streetwear cut'
    ],
    details: [
      'Custom mineral wash treatment creates a 1-of-1 subtle fade',
      'Front comic panel: "CAN YOU HEAR THE CITY BREATHING?"',
      'Back minimalist coordinate stamp: 31.5204° N, 74.3587° E',
      'Split side vents with herringbone tape reinforcement',
      'No itching: heat-transferred neck label'
    ],
    fabricCare: [
      '100% Combed Cotton Mineral Washed',
      'Wash inside out in cold water',
      'Hang dry only',
      'Do not bleach or dry clean'
    ],
    shippingInfo: 'Instant dispatch in 24 hours. Packaged in biodegradable matte frosted archive bag with commemorative sticker set.',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85'
    ],
    primaryColor: '#222222',
    availableColors: [
      { name: 'Acid Washed Black', hex: '#222222' },
      { name: 'Dusty Rose', hex: '#9E6B6B' },
      { name: 'Washed Indigo', hex: '#5B6A8A' }
    ],
    sizes: [
      { size: 'S', inStock: true, quantity: 10 },
      { size: 'M', inStock: true, quantity: 18 },
      { size: 'L', inStock: true, quantity: 14 },
      { size: 'XL', inStock: false, quantity: 0 }
    ],
    badge: 'LIMITED',
    badgeColor: '#9E6B6B',
    rating: 4.8,
    reviewsCount: 31,
    isFeatured: true,
    measurements: [
      { size: 'S', chestInches: 38, lengthInches: 27, shoulderInches: 18, sleeveInches: 8.5, chestCm: 96, lengthCm: 68, shoulderCm: 46, sleeveCm: 21 },
      { size: 'M', chestInches: 41, lengthInches: 28.5, shoulderInches: 19.5, sleeveInches: 9, chestCm: 104, lengthCm: 72, shoulderCm: 49, sleeveCm: 23 },
      { size: 'L', chestInches: 44, lengthInches: 30, shoulderInches: 21, sleeveInches: 9.5, chestCm: 112, lengthCm: 76, shoulderCm: 53, sleeveCm: 24 },
      { size: 'XL', chestInches: 47, lengthInches: 31, shoulderInches: 22.5, sleeveInches: 10, chestCm: 120, lengthCm: 78, shoulderCm: 57, sleeveCm: 25 }
    ]
  },
  {
    id: 'kuro-hoodie-02',
    name: 'VOIDWALKER ZIP HOODIE // 420GSM',
    japaneseName: 'VOIDWALKER // 420GSM ZIP',
    category: 'Hoodies',
    pricePKR: 9400,
    priceUSD: 34,
    originalPricePKR: 12000,
    originalPriceUSD: 43,
    description: 'Engineered with double-ended two-way oxidized gunmetal zipper, letting you sculpt dynamic proportions on the fly. Heavyweight loopback cotton provides insulation without clamminess.',
    highlightSpecs: [
      '420GSM Brushed Cotton Terry',
      'Dual two-way heavy metal zipper with engraved pullers',
      'Oversized drop-tail hem with side slits',
      'Reinforced elbow articulation panels',
      'Anti-pilling enzyme treated exterior'
    ],
    details: [
      'Two-way custom zipper allows bottom-up styling',
      'Deep hood designed to fit comfortably over beanies and caps',
      'Raw edge seam accents with safety lockstitch',
      'Two deep slant front pockets',
      'Subtle monochrome embroidery on hood peak'
    ],
    fabricCare: [
      '100% Compact Spun Cotton',
      'Zip fully before washing',
      'Machine wash gentle cold',
      'Dry flat away from direct sunlight'
    ],
    shippingInfo: 'Guaranteed 2-3 business day doorstep delivery across Pakistan. Cash on Delivery (COD) available with no hidden fees.',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85'
    ],
    primaryColor: '#111111',
    availableColors: [
      { name: 'Deep Black', hex: '#0A0A0A' },
      { name: 'Faded Mauve', hex: '#8A7090' },
      { name: 'Charcoal', hex: '#1A1A1A' }
    ],
    sizes: [
      { size: 'S', inStock: true, quantity: 8 },
      { size: 'M', inStock: true, quantity: 15 },
      { size: 'L', inStock: true, quantity: 11 },
      { size: 'XL', inStock: true, quantity: 5 }
    ],
    badge: 'NEW DROP',
    badgeColor: '#8A7090',
    rating: 4.9,
    reviewsCount: 27,
    isFeatured: true,
    measurements: [
      { size: 'S', chestInches: 43, lengthInches: 26.5, shoulderInches: 20.5, sleeveInches: 23.5, chestCm: 109, lengthCm: 67, shoulderCm: 52, sleeveCm: 60 },
      { size: 'M', chestInches: 46, lengthInches: 28, shoulderInches: 22, sleeveInches: 24.5, chestCm: 117, lengthCm: 71, shoulderCm: 56, sleeveCm: 62 },
      { size: 'L', chestInches: 49, lengthInches: 29.5, shoulderInches: 23.5, sleeveInches: 25.5, chestCm: 124, lengthCm: 75, shoulderCm: 60, sleeveCm: 65 },
      { size: 'XL', chestInches: 52, lengthInches: 31, shoulderInches: 25, sleeveInches: 26, chestCm: 132, lengthCm: 78, shoulderCm: 63, sleeveCm: 66 }
    ]
  },
  {
    id: 'kuro-tee-03',
    name: 'DRIFT ARCHIVE HEAVY TEE',
    japaneseName: 'DRIFT // 270GSM GRAPHIC',
    category: 'Graphic Tees',
    pricePKR: 4800,
    priceUSD: 17,
    originalPricePKR: 6000,
    originalPriceUSD: 22,
    description: 'Inspired by underground midnight street racing and architectural subcultures. Minimalist chest typography with an explosive multi-panel comic narrative silkscreened across the entire upper back.',
    highlightSpecs: [
      '270GSM 100% Combed Pakistani Cotton',
      'High-density screen print with micro-matte finish',
      'Boxy drop-shoulder cut with elongated silhouette',
      'Woven side-seam tab label with serial number',
      'Reinforced collar that never stretches'
    ],
    details: [
      'Subtle tonal screenprint on front left chest',
      '6-panel comic narrative strip on back',
      'Seamless tubular body knit for no side-twist',
      'Pre-washed with soft organic softener',
      'Made in Pakistan with export-grade craftsmanship'
    ],
    fabricCare: [
      '100% Heavy Combed Cotton',
      'Wash cold inside out',
      'Line dry only',
      'Iron low if needed (avoid print)'
    ],
    shippingInfo: 'Fast delivery in 24-48 hours via Leopard / TCS. Same-day dispatch for orders placed before 3PM PKT.',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1200&q=85'
    ],
    primaryColor: '#0A0A0A',
    availableColors: [
      { name: 'Deep Black', hex: '#0A0A0A' },
      { name: 'Burnt Amber', hex: '#A67C52' },
      { name: 'Muted Olive', hex: '#6B7C5E' }
    ],
    sizes: [
      { size: 'S', inStock: true, quantity: 12 },
      { size: 'M', inStock: true, quantity: 20 },
      { size: 'L', inStock: true, quantity: 18 },
      { size: 'XL', inStock: true, quantity: 9 }
    ],
    badge: 'SELLING FAST',
    badgeColor: '#A67C52',
    rating: 4.9,
    reviewsCount: 39,
    measurements: [
      { size: 'S', chestInches: 38, lengthInches: 27, shoulderInches: 18, sleeveInches: 8.5, chestCm: 96, lengthCm: 68, shoulderCm: 46, sleeveCm: 21 },
      { size: 'M', chestInches: 41, lengthInches: 28.5, shoulderInches: 19.5, sleeveInches: 9, chestCm: 104, lengthCm: 72, shoulderCm: 49, sleeveCm: 23 },
      { size: 'L', chestInches: 44, lengthInches: 30, shoulderInches: 21, sleeveInches: 9.5, chestCm: 112, lengthCm: 76, shoulderCm: 53, sleeveCm: 24 },
      { size: 'XL', chestInches: 47, lengthInches: 31, shoulderInches: 22.5, sleeveInches: 10, chestCm: 120, lengthCm: 78, shoulderCm: 57, sleeveCm: 25 }
    ]
  },
  {
    id: 'kuro-hoodie-03',
    name: 'MIDNIGHT PROTOCOL OVERSIZED HOODIE',
    japaneseName: 'MIDNIGHT // 480GSM ARMOR',
    category: 'Hoodies',
    pricePKR: 9800,
    priceUSD: 35,
    originalPricePKR: 12500,
    originalPriceUSD: 45,
    description: 'Our heaviest silhouette to date. Crafted from ultra-dense 480GSM carbon-brushed fleece that feels like armor yet drapes like fluid sculpture. Detailed with discreet thumbholes in the ribbed cuffs for thermal retention on chilly nights.',
    highlightSpecs: [
      '480GSM Carbon-Brushed Ultra-Dense Fleece',
      'Engineered thumbhole wrist cuffs',
      'Double-ply crossover scuba hood with internal storm flap',
      'Raw cut stepped hem with lockstitch boundary',
      'Water-repellent nanotech surface coating'
    ],
    details: [
      'Monolithic boxy drape with extra volume in arms and torso',
      'High-grade matte silicone print on left sleeve',
      'Deep kangaroo pouch with interior coin/key separator',
      'Reinforced shoulder yoke to handle bag straps without sagging',
      'Individually numbered archival run (1 of 300 pieces)'
    ],
    fabricCare: [
      '100% Carbon-Brushed Cotton Fleece',
      'Machine wash cold on gentle cycle',
      'Dry flat — do not tumble dry',
      'Do not use fabric conditioners'
    ],
    shippingInfo: 'Express courier across Pakistan via TCS or Leopards. Free express shipping included.',
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85'
    ],
    primaryColor: '#0A0A0A',
    availableColors: [
      { name: 'Deep Black', hex: '#0A0A0A' },
      { name: 'Dusty Rose', hex: '#9E6B6B' },
      { name: 'Muted Olive', hex: '#6B7C5E' }
    ],
    sizes: [
      { size: 'S', inStock: true, quantity: 10 },
      { size: 'M', inStock: true, quantity: 16 },
      { size: 'L', inStock: true, quantity: 7 },
      { size: 'XL', inStock: true, quantity: 3 }
    ],
    badge: 'LIMITED',
    badgeColor: '#6B7C5E',
    rating: 5.0,
    reviewsCount: 54,
    measurements: [
      { size: 'S', chestInches: 45, lengthInches: 27.5, shoulderInches: 21.5, sleeveInches: 24.5, chestCm: 114, lengthCm: 70, shoulderCm: 55, sleeveCm: 62 },
      { size: 'M', chestInches: 48, lengthInches: 29, shoulderInches: 23, sleeveInches: 25.5, chestCm: 122, lengthCm: 74, shoulderCm: 58, sleeveCm: 65 },
      { size: 'L', chestInches: 51, lengthInches: 30.5, shoulderInches: 24.5, sleeveInches: 26.5, chestCm: 130, lengthCm: 77, shoulderCm: 62, sleeveCm: 67 },
      { size: 'XL', chestInches: 54, lengthInches: 32, shoulderInches: 26, sleeveInches: 27, chestCm: 137, lengthCm: 81, shoulderCm: 66, sleeveCm: 69 }
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-01',
    author: 'Hamza Tariq',
    city: 'Lahore (Gulberg)',
    rating: 5,
    date: '3 days ago',
    title: 'The 460GSM weight is insane — feels like $200 Fear of God',
    comment: 'I usually buy from local street brands or import from UK, but this Cyber-Ronin hoodie is genuinely on another level. The hood stands up without sagging, the cotton is crazy dense, and SadaPay checkout was instant.',
    verified: true,
    sizePurchased: 'L'
  },
  {
    id: 'rev-02',
    author: 'Zainab Raza',
    city: 'Karachi (DHA Phase 6)',
    rating: 5,
    date: '1 week ago',
    title: 'Sizing bot nailed it! Perfect oversized drape',
    comment: 'I used the Fit Assistant chat bubble because I hate when hoodies fit weird around the shoulders. It told me to get M for a relaxed fit and it fits exactly like high-end luxury runway streetwear. Paid via EasyPaisa.',
    verified: true,
    sizePurchased: 'M'
  },
  {
    id: 'rev-03',
    author: 'Bilal Khan',
    city: 'Islamabad (F-7)',
    rating: 5,
    date: '2 weeks ago',
    title: 'Halftone comic backprint is pure art',
    comment: 'The Ghost tee has that vintage discharge print that actually breathes instead of sticking to your back in warm weather. Shipped to Islamabad via TCS in 2 days flat. Luxury packaging too.',
    verified: true,
    sizePurchased: 'XL'
  },
  {
    id: 'rev-04',
    author: 'Marcus Vance',
    city: 'London (Soho)',
    rating: 5,
    date: '3 weeks ago',
    title: 'Authentic underground feel with export cotton quality',
    comment: 'Rare to see a brand truly blend 80s comic ink textures with genuine 460GSM fleece. The minimalist branding and cut-and-sew architecture is world-class.',
    verified: true,
    sizePurchased: 'L'
  }
];
