/**
 * Game Constants, Districts, Syndicates, Landmarks, and Vehicle Specifications
 * for GTA Karnataka: Namma Bengaluru
 */

export interface DistrictInfo {
  id: string;
  name: string;
  kannadaName: string;
  tagline: string;
  center: { x: number; z: number };
  radius: number;
  landmarks: string[];
  trafficDensity: 'dense' | 'gridlock' | 'moderate' | 'scenic';
  syndicate: string;
  accentColor: string;
}

export interface SyndicateInfo {
  id: string;
  name: string;
  boss: string;
  territory: string;
  color: string;
  description: string;
  bounty: number;
  reputation: number;
}

export interface VehicleSpec {
  id: string;
  name: string;
  type: 'auto' | 'bike' | 'bus' | 'car';
  description: string;
  topSpeed: number; // m/s
  acceleration: number;
  handling: number; // steer sharpness
  health: number;
  armor: number;
  passengerCapacity: number;
  hasSiren?: boolean;
  hasMeter?: boolean;
  color: string;
  roofColor?: string;
  specialTrait: string;
}

export interface LandmarkInfo {
  id: string;
  name: string;
  kannadaName: string;
  district: string;
  pos: { x: number; z: number };
  description: string;
  type: 'heritage' | 'transit' | 'tech' | 'garden' | 'monument';
}

export interface FestivalEvent {
  id: string;
  name: string;
  kannadaName: string;
  district: string;
  description: string;
  bannerColor: string;
  perks: string;
  musicGenre: string;
}

// 5 Vibrant Karnataka & Bengaluru Districts
export const DISTRICTS: DistrictInfo[] = [
  {
    id: 'vidhana_cubbon',
    name: 'Vidhana Soudha & Cubbon Park',
    kannadaName: 'ವಿಧಾನ ಸೌಧ ಮತ್ತು ಕಬ್ಬನ್ ಪಾರ್ಕ್',
    tagline: 'Seat of Power & Grand Neo-Dravidian Heritage',
    center: { x: 0, z: 0 },
    radius: 120,
    landmarks: ['vidhana_soudha', 'high_court', 'bangalore_palace'],
    trafficDensity: 'moderate',
    syndicate: 'syndicate_political',
    accentColor: '#D97706' // Golden Sandalwood
  },
  {
    id: 'majestic_shivaji',
    name: 'Majestic & Shivaji Nagar',
    kannadaName: 'ಮೆಜೆಸ್ಟಿಕ್ ಮತ್ತು ಶಿವಾಜಿನಗರ',
    tagline: 'Heart of Street Hustle, BMTC Depot & Alleys',
    center: { x: -140, z: -40 },
    radius: 110,
    landmarks: ['majestic_terminus', 'sangam_theatre', 'commercial_street'],
    trafficDensity: 'dense',
    syndicate: 'syndicate_majestic',
    accentColor: '#EF4444' // Crimson Red
  },
  {
    id: 'silk_board_tech',
    name: 'Silk Board & Silicon Valley Corridor',
    kannadaName: 'ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ಮತ್ತು ಟೆಕ್ ಕಾರಿಡಾರ್',
    tagline: 'The Legendary Gridlock, Flyovers & Cyber Titans',
    center: { x: 130, z: 80 },
    radius: 130,
    landmarks: ['silk_board_junction', 'ub_city_tower', 'electronic_city_flyover'],
    trafficDensity: 'gridlock',
    syndicate: 'syndicate_tech',
    accentColor: '#3B82F6' // Electric Blue
  },
  {
    id: 'lalbagh_heritage',
    name: 'Lalbagh Gardens & Basavanagudi',
    kannadaName: 'ಲಾಲ್ ಬಾಗ್ ಮತ್ತು ಬಸವನಗುಡಿ',
    tagline: 'Glass House, Gandhi Bazaar & Cultural Celebrations',
    center: { x: -60, z: 140 },
    radius: 110,
    landmarks: ['glass_house', 'bull_temple', 'gandhi_bazaar'],
    trafficDensity: 'moderate',
    syndicate: 'syndicate_auto_union',
    accentColor: '#10B981' // Lush Garden Green
  },
  {
    id: 'heritage_gateway',
    name: 'Mysore & Hampi Heritage Excursion',
    kannadaName: 'ಮೈಸೂರು ಮತ್ತು ಹಂಪಿ ಗೇಟ್ ವೇ',
    tagline: 'Royal Chamundi Arches & Vijayanagara Monoliths',
    center: { x: 80, z: -150 },
    radius: 120,
    landmarks: ['mysore_gate', 'hampi_chariot', 'chamundi_arch'],
    trafficDensity: 'scenic',
    syndicate: 'syndicate_sandalwood',
    accentColor: '#F59E0B' // Royal Amber Gold
  }
];

// Crime Syndicates operating across Bangalore
export const CRIME_SYNDICATES: SyndicateInfo[] = [
  {
    id: 'syndicate_majestic',
    name: 'The Majestic Bus Terminus Mafia',
    boss: 'Don "Majestic" Chandru',
    territory: 'Majestic & Shivaji Nagar Alleys',
    color: '#DC2626',
    description: 'Rules ticket scalping, counterfeit Sandalwood smuggling, and underground hawala at the bus terminal.',
    bounty: 15000,
    reputation: 60
  },
  {
    id: 'syndicate_auto_union',
    name: 'The Auto Raja Brotherhood',
    boss: 'Leader "Meter" Manja',
    territory: 'Basavanagudi & Gandhi Bazaar Stands',
    color: '#FBBF24',
    description: 'Controls 15,000 yellow-green auto rickshaws. Strict "No Meter / Onduvardhu" (1.5x) pricing and turbo mods.',
    bounty: 8000,
    reputation: 85
  },
  {
    id: 'syndicate_tech',
    name: 'Silicon Valley Black-Hat Syndicate',
    boss: 'Dr. "Crypto" Vikram',
    territory: 'Silk Board & UB City Penthouse',
    color: '#2563EB',
    description: 'Tech moguls running algorithmic cryptocurrency heists and electronic toll hacks across the Elevated Flyover.',
    bounty: 25000,
    reputation: 40
  },
  {
    id: 'syndicate_sandalwood',
    name: 'Western Ghats Sandalwood Cartel',
    boss: 'Sultan Veeranna',
    territory: 'Hampi Excursion & Border Outposts',
    color: '#D97706',
    description: 'Smuggles precious fragrant red sanders and sandalwood trunks past Karnataka forest police checkpoints.',
    bounty: 20000,
    reputation: 50
  },
  {
    id: 'syndicate_political',
    name: 'Vidhana Secret Service Liaisons',
    boss: 'Minister "Power" Gowda',
    territory: 'Vidhana Soudha Secretariat',
    color: '#84CC16',
    description: 'High-stakes bureaucratic kingmakers orchestrating covert tenders, minister convoys, and VIP dossiers.',
    bounty: 30000,
    reputation: 30
  }
];

// Iconic Landmarks in Bengaluru & Karnataka
export const LANDMARKS: LandmarkInfo[] = [
  {
    id: 'vidhana_soudha',
    name: 'Vidhana Soudha',
    kannadaName: 'ವಿಧಾನ ಸೌಧ',
    district: 'vidhana_cubbon',
    pos: { x: 0, z: -10 },
    description: 'The monumental legislature of Karnataka, featuring grand stone stairs, 40-foot pillars, and Ashoka lions.',
    type: 'heritage'
  },
  {
    id: 'high_court',
    name: 'Attara Kacheri (High Court)',
    kannadaName: 'ಅಠಾರಾ ಕಛೇರಿ',
    district: 'vidhana_cubbon',
    pos: { x: 0, z: 45 },
    description: 'Crimson-red two-storied neoclassical palace facing the legislative assembly in lush Cubbon Park.',
    type: 'heritage'
  },
  {
    id: 'bangalore_palace',
    name: 'Bangalore Palace',
    kannadaName: 'ಬೆಂಗಳೂರು ಅರಮನೆ',
    district: 'vidhana_cubbon',
    pos: { x: -65, z: -70 },
    description: 'Tudor-style royal estate with medieval battlements, fortified towers, and regal ballroom courtyards.',
    type: 'heritage'
  },
  {
    id: 'majestic_terminus',
    name: 'Majestic BMTC Bus Terminus',
    kannadaName: 'ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣ',
    district: 'majestic_shivaji',
    pos: { x: -140, z: -40 },
    description: 'The legendary central transit vortex where hundreds of blue and green BMTC buses converge day and night.',
    type: 'transit'
  },
  {
    id: 'silk_board_junction',
    name: 'Silk Board Junction',
    kannadaName: 'ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ಜಂಕ್ಷನ್',
    district: 'silk_board_tech',
    pos: { x: 130, z: 75 },
    description: 'The world-famous gridlock boss arena with multi-tier flyover ramps, traffic cops, and bumper-to-bumper autos.',
    type: 'transit'
  },
  {
    id: 'ub_city_tower',
    name: 'UB City Sky Towers',
    kannadaName: 'ಯುಬಿ ಸಿಟಿ ಗೋಪುರ',
    district: 'silk_board_tech',
    pos: { x: 90, z: 25 },
    description: 'Gleaming luxury glass skyscrapers with high-end sports cars and VIP rooftop helipads.',
    type: 'tech'
  },
  {
    id: 'glass_house',
    name: 'Lalbagh Botanical Glass House',
    kannadaName: 'ಲಾಲ್ ಬಾಗ್ ಗ್ಲಾಸ್ ಹೌಸ್',
    district: 'lalbagh_heritage',
    pos: { x: -60, z: 140 },
    description: 'Crystal glass palace modeled after London Crystal Palace, host of the world-renowned bi-annual flower show.',
    type: 'garden'
  },
  {
    id: 'hampi_chariot',
    name: 'Hampi Stone Chariot Monument',
    kannadaName: 'ಹಂಪಿ ಕಲ್ಲಿನ ರಥ',
    district: 'heritage_gateway',
    pos: { x: 80, z: -150 },
    description: 'Intricately carved granite chariot shrine commemorating the glory of the Vijayanagara Empire.',
    type: 'monument'
  }
];

// Authentic Vehicles
export const VEHICLE_SPECS: Record<string, VehicleSpec> = {
  auto: {
    id: 'auto',
    name: 'Namma Bengaluru Auto-Rickshaw',
    type: 'auto',
    description: 'Iconic yellow roof, bright green chassis, digital meter, and ultra-agile 3-wheel drift handling.',
    topSpeed: 23, // m/s (~83 km/h with turbo!)
    acceleration: 17,
    handling: 3.4,
    health: 220,
    armor: 40,
    passengerCapacity: 3,
    hasMeter: true,
    color: '#15803D', // Emerald Green bottom
    roofColor: '#FACC15', // Vibrant Yellow top
    specialTrait: 'Weaves through tight traffic gridlocks & Nitro Boost'
  },
  bullet: {
    id: 'bullet',
    name: 'Royal Enfield 350 "Bullet"',
    type: 'bike',
    description: 'Heavy chrome classic cruiser with legendary thump-thump exhaust beat. King of Bangalore streets.',
    topSpeed: 28, // ~100 km/h
    acceleration: 22,
    handling: 3.8,
    health: 150,
    armor: 20,
    passengerCapacity: 2,
    color: '#18181B', // Jet Black with Gold pinstripe
    specialTrait: 'Ultimate traffic filter agility & high jump capability'
  },
  bmtc: {
    id: 'bmtc',
    name: 'BMTC Suvarna / Vayu Vajra Bus',
    type: 'bus',
    description: 'Massive public transport behemoth. Smashes through obstacles and pushes traffic aside.',
    topSpeed: 18,
    acceleration: 10,
    handling: 1.6,
    health: 600,
    armor: 180,
    passengerCapacity: 30,
    color: '#0284C7', // Classic BMTC Sky Blue / White
    roofColor: '#FFFFFF',
    specialTrait: 'Heavy ramming mass - clears traffic barricades'
  },
  hoysala: {
    id: 'hoysala',
    name: 'Karnataka Police "Hoysala" Patrol SUV',
    type: 'car',
    description: 'White police interceptor with red-and-blue roof beacons, siren, and reinforced bullbar.',
    topSpeed: 26,
    acceleration: 20,
    handling: 2.8,
    health: 350,
    armor: 120,
    passengerCapacity: 4,
    hasSiren: true,
    color: '#F8FAFC',
    specialTrait: 'Police Siren scatters pedestrian traffic'
  },
  supercar: {
    id: 'supercar',
    name: 'UB City Hyper-GT',
    type: 'car',
    description: 'Billionaire luxury supercar with neon underglow and immense top-end speed on flyovers.',
    topSpeed: 36,
    acceleration: 28,
    handling: 3.1,
    health: 240,
    armor: 60,
    passengerCapacity: 2,
    color: '#DC2626', // Ferrari Crimson
    specialTrait: 'Highest top speed on Electronic City expressway'
  },
  taxi: {
    id: 'taxi',
    name: 'Karnataka Tourist Ambassador Taxi',
    type: 'car',
    description: 'Sturdy vintage yellow-and-black sedan with luggage carrier on top.',
    topSpeed: 22,
    acceleration: 14,
    handling: 2.2,
    health: 280,
    armor: 80,
    passengerCapacity: 4,
    hasMeter: true,
    color: '#1E293B',
    roofColor: '#F59E0B',
    specialTrait: 'Classic rugged suspension over potholes'
  }
};

// Vibrant Cultural Festivals
export const FESTIVALS: FestivalEvent[] = [
  {
    id: 'rajyotsava',
    name: 'Kannada Rajyotsava Carnival',
    kannadaName: 'ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ ಉತ್ಸವ',
    district: 'vidhana_cubbon',
    description: 'Massive red-and-yellow Karnataka flag procession, Dollu Kunitha drum troupes, and flower cannons.',
    bannerColor: '#DC2626',
    perks: 'Double cash payouts & Unlimited vehicle nitro',
    musicGenre: 'folk'
  },
  {
    id: 'karaga',
    name: 'Bengaluru Karaga Shakthi Procession',
    kannadaName: 'ಬೆಂಗಳೂರು ಕರಗ ಶಕ್ತಿ ಮೆರವಣಿಗೆ',
    district: 'majestic_shivaji',
    description: 'Mystical midnight torchlit celebration with flower pyramids, sword-bearers, and nadaswaram echoes.',
    bannerColor: '#9333EA',
    perks: 'Police wanted level drops 2x faster & Night glow visual',
    musicGenre: 'sandalwood'
  },
  {
    id: 'ganesha',
    name: 'Bengaluru Ganesha Utsava & Dasara',
    kannadaName: 'ಬೆಂಗಳೂರು ಗಣೇಶ ಉತ್ಸವ',
    district: 'lalbagh_heritage',
    description: 'Giant Ganesha pandals, royal caparisoned elephants, dhol-tasha beats, and celebratory sweets.',
    bannerColor: '#EA580C',
    perks: 'Instant full health prasad pickups & Maximum crowd vitality',
    musicGenre: 'folk'
  },
  {
    id: 'kambala',
    name: 'Coastal Kambala Buffalo Sprint Rush',
    kannadaName: 'ಕಂಬಳ ಕೋಣಗಳ ಓಟ',
    district: 'heritage_gateway',
    description: 'High-speed muddy sprint challenge inspired by traditional coastal Karnataka buffalo racing.',
    bannerColor: '#B45309',
    perks: 'Off-road speed boost & Mud drift multiplier',
    musicGenre: 'rock'
  }
];

// Story Missions & Syndicate Bounties
export interface Mission {
  id: string;
  title: string;
  kannadaTitle: string;
  syndicate: string;
  district: string;
  description: string;
  rewardCash: number;
  rewardRep: number;
  objectiveType: 'delivery' | 'heist' | 'escape' | 'taxi' | 'protection' | 'race';
  targetPos: { x: number; z: number };
  timeLimitSec?: number;
  dialogue: string[];
}

export const MISSIONS: Mission[] = [
  {
    id: 'mission_1',
    title: 'The Silk Board Traffic Escape',
    kannadaTitle: 'ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ಟ್ರಾಫಿಕ್ ಎಸ್ಕೇಪ್',
    syndicate: 'syndicate_auto_union',
    district: 'silk_board_tech',
    description: 'Evade Karnataka Hoysala police by weaving an Auto-Rickshaw through the infamous Silk Board gridlock!',
    rewardCash: 4500,
    rewardRep: 25,
    objectiveType: 'escape',
    targetPos: { x: -60, z: 140 }, // Lalbagh
    timeLimitSec: 90,
    dialogue: [
      'Auto Raja Manja: "Guru! The cops have blocked the main lane at Silk Board."',
      'Manja: "Take the service road, cut between the BMTC buses, and gun the throttle!"',
      'Manja: "Reach Lalbagh safe and the union will back you for life!"'
    ]
  },
  {
    id: 'mission_2',
    title: 'Vidhana Soudha Sandalwood Heist',
    kannadaTitle: 'ವಿಧಾನ ಸೌಧ ಶ್ರೀಗಂಧ ರಕ್ಷಣೆ',
    syndicate: 'syndicate_political',
    district: 'vidhana_cubbon',
    description: 'Retrieve the ceremonial Sandalwood Seal from the grand steps of Vidhana Soudha before the rival syndicate arrives.',
    rewardCash: 8000,
    rewardRep: 35,
    objectiveType: 'heist',
    targetPos: { x: 0, z: -10 },
    timeLimitSec: 120,
    dialogue: [
      'Minister Gowda: "The antique Sandalwood casket is at the central portico."',
      'Minister Gowda: "Keep your wanted level below 3 stars or the Hoysala tactical squad will intercept you!"'
    ]
  },
  {
    id: 'mission_3',
    title: 'Majestic Midnight Meter Frenzy',
    kannadaTitle: 'ಮೆಜೆಸ್ಟಿಕ್ ಮಿಡ್‌ನೈಟ್ ಮೀಟರ್ ರಶ್',
    syndicate: 'syndicate_majestic',
    district: 'majestic_shivaji',
    description: 'Pick up 3 VIP syndicate couriers from Sangam Theatre and deliver them to Commercial Street in under 2 minutes.',
    rewardCash: 6000,
    rewardRep: 30,
    objectiveType: 'taxi',
    targetPos: { x: -140, z: -40 },
    timeLimitSec: 110,
    dialogue: [
      'Don Chandru: "Our boys got hot cargo from Shivaji Nagar."',
      'Chandru: "Drop them off before the traffic inspectors smell anything!"'
    ]
  },
  {
    id: 'mission_4',
    title: 'Karaga Procession Royal Escort',
    kannadaTitle: 'ಕರಗ ಮೆರವಣಿಗೆ ರಕ್ಷಣೆ',
    syndicate: 'syndicate_auto_union',
    district: 'lalbagh_heritage',
    description: 'Clear the path for the holy Karaga torch procession, push away rogue hooligans, and set off celebratory firecrackers!',
    rewardCash: 7500,
    rewardRep: 40,
    objectiveType: 'protection',
    targetPos: { x: -60, z: 140 },
    timeLimitSec: 100,
    dialogue: [
      'Priest Narasimha: "The flower Karaga has begun its sacred march."',
      'Manja: "Clear the intersection! Sound the auto horn and light up the sky!"'
    ]
  },
  {
    id: 'mission_5',
    title: 'Silicon Valley Crypto Server Raid',
    kannadaTitle: 'ಸಿಲಿಕಾನ್ ವ್ಯಾಲಿ ಸರ್ವರ್ ರೈಡ್',
    syndicate: 'syndicate_tech',
    district: 'silk_board_tech',
    description: 'Infiltrate UB City luxury penthouse, swipe the cold wallet encrypted drive, and make a high-speed exit on the elevated expressway.',
    rewardCash: 12000,
    rewardRep: 50,
    objectiveType: 'heist',
    targetPos: { x: 90, z: 25 },
    timeLimitSec: 130,
    dialogue: [
      'Crypto Vikram: "The servers at UB City hold 500 Bitcoins."',
      'Vikram: "Grab the drive and floor it onto the flyover before lockdown!"'
    ]
  }
];

// Weapon Arsenal
export interface WeaponSpec {
  id: string;
  name: string;
  damage: number;
  range: number;
  ammo: number; // -1 for melee
  cooldown: number; // sec
  description: string;
}

export const WEAPONS: WeaponSpec[] = [
  {
    id: 'fist',
    name: 'Bare Knuckle Punch',
    damage: 25,
    range: 2.2,
    ammo: -1,
    cooldown: 0.35,
    description: 'Standard Bangalore street brawl combo.'
  },
  {
    id: 'cricket_bat',
    name: 'M. Chinnaswamy Cricket Bat',
    damage: 65,
    range: 2.8,
    ammo: -1,
    cooldown: 0.5,
    description: 'Signed English willow bat. Delivers a massive sixer knockback!'
  },
  {
    id: 'slingshot',
    name: 'Tender Coconut Slingshot',
    damage: 40,
    range: 25,
    ammo: 50,
    cooldown: 0.6,
    description: 'Hurls rock-hard green tender coconuts at distance.'
  },
  {
    id: 'sandalwood_pistol',
    name: 'Sandalwood Grip Revolver',
    damage: 85,
    range: 40,
    ammo: 60,
    cooldown: 0.4,
    description: 'Engraved vintage pistol favored by Shivaji Nagar dons.'
  }
];

export const WORLD_SIZE = 420; // 420m x 420m open world map
export const ROAD_WIDTH = 14;
