import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const PRESERVED_EMAILS = ['admin@photopedia.com', 'elena@example.com'];

const CREATOR_SEEDS = [
  {
    name: 'Liam Vance',
    username: 'liam_vance',
    email: 'liam@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Minimalist architecture & structural geometry photographer based in Berlin.',
    location: 'Berlin, Germany',
    website: 'https://liamvance.photo',
    cameraBody: 'Hasselblad X2D 100C',
    lenses: 'XCD 38mm f/2.5 V, XCD 90mm f/2.5 V',
  },
  {
    name: 'Maya Lin',
    username: 'maya_astro',
    email: 'maya@example.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'Deep space astrophotography and nocturnal mountain landscapes.',
    location: 'Atacama, Chile',
    website: 'https://mayalinastro.com',
    cameraBody: 'Sony Alpha 7R V (Astro Modified)',
    lenses: 'FE 14mm f/1.8 GM, FE 24mm f/1.4 GM',
  },
  {
    name: 'Julian Kross',
    username: 'julian_street',
    email: 'julian@example.com',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    bio: 'High-contrast black & white street photography in New York City.',
    location: 'New York, USA',
    website: 'https://juliankross.com',
    cameraBody: 'Leica M11 Monochrome',
    lenses: 'Summilux-M 35mm f/1.4 ASPH',
  },
  {
    name: 'Amara Okafor',
    username: 'amara_wild',
    email: 'amara@example.com',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    bio: 'Wildlife conservation visual storyteller capturing East African fauna.',
    location: 'Nairobi, Kenya',
    website: 'https://amaraokaforwild.org',
    cameraBody: 'Nikon Z9',
    lenses: 'NIKKOR Z 400mm f/2.8 TC VR S',
  },
  {
    name: 'Kai Takahashi',
    username: 'kai_tokyo',
    email: 'kai@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Atmospheric Tokyo rain, reflections, and cyberpunk alleyways.',
    location: 'Tokyo, Japan',
    website: 'https://kaitakahashi.jp',
    cameraBody: 'Fujifilm GFX 100 II',
    lenses: 'GF 45mm f/2.8 R WR, GF 110mm f/2 R LM WR',
  },
  {
    name: 'Chloe Bennett',
    username: 'chloe_portraits',
    email: 'chloe@example.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    bio: 'Editorial portraiture and natural light fashion photography.',
    location: 'Paris, France',
    website: 'https://chloebennett.studio',
    cameraBody: 'Canon EOS R3',
    lenses: 'RF 85mm f/1.2 L USM DS, RF 50mm f/1.2 L',
  },
  {
    name: 'Lucas Sterling',
    username: 'lucas_sea',
    email: 'lucas@example.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    bio: 'Ocean waves, coastal swells, and long exposure seascape horizons.',
    location: 'Sydney, Australia',
    website: 'https://lucassterlingsea.com',
    cameraBody: 'Sony Alpha 1',
    lenses: 'FE 16-35mm f/2.8 GM II, FE 70-200mm f/2.8 GM II',
  },
  {
    name: 'Nina Patel',
    username: 'nina_aerial',
    email: 'nina@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bio: 'Aerial top-down photography highlighting Earth geometry and salt flats.',
    location: 'Reykjavik, Iceland',
    website: 'https://ninapatel.photo',
    cameraBody: 'DJI Inspire 3 / Hasselblad L2D',
    lenses: 'DL 24mm F2.8 LS ASPH Lens',
  },
  {
    name: 'Hugo Dupont',
    username: 'hugo_doc',
    email: 'hugo@example.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    bio: 'Documentary photojournalism exploring cultural heritage and crafts.',
    location: 'Lyon, France',
    website: 'https://hugodupontdoc.fr',
    cameraBody: 'Leica Q3',
    lenses: 'Summilux 28mm f/1.7 ASPH',
  },
  {
    name: 'Zara Al-Mansoor',
    username: 'zara_desert',
    email: 'zara@example.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Desert dunes, golden hour shadows, and Arabian peninsula vistas.',
    location: 'Dubai, UAE',
    website: 'https://zaraalmansoor.ae',
    cameraBody: 'Nikon Z8',
    lenses: 'NIKKOR Z 14-24mm f/2.8 S, Z 50mm f/1.2 S',
  },
  {
    name: 'Mateo Silva',
    username: 'mateo_action',
    email: 'mateo@example.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    bio: 'High-speed sports, surf photography, and extreme mountain biking.',
    location: 'Rio de Janeiro, Brazil',
    website: 'https://mateosilva.art',
    cameraBody: 'Sony Alpha 9 III',
    lenses: 'FE 300mm f/2.8 GM OSS',
  },
  {
    name: 'Astrid Lindqvist',
    username: 'astrid_nordic',
    email: 'astrid@example.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    bio: 'Nordic glaciers, fjords, and northern lights in Arctic Norway.',
    location: 'Tromsø, Norway',
    website: 'https://astridlindqvist.no',
    cameraBody: 'Canon EOS R5 C',
    lenses: 'RF 15-35mm f/2.8 L IS USM',
  },
  {
    name: 'Oliver Reed',
    username: 'oliver_macro',
    email: 'oliver@example.com',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    bio: 'Macro flora and microscopic dew reflections in natural environments.',
    location: 'Vancouver, Canada',
    website: 'https://oliverreedmacro.com',
    cameraBody: 'OM System OM-1 Mark II',
    lenses: 'M.Zuiko 90mm f/3.5 Macro IS PRO',
  },
  {
    name: 'Hannah Berg',
    username: 'hannah_travel',
    email: 'hannah@example.com',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
    bio: 'Expedition travel imagery exploring remote islands and ancient ruins.',
    location: 'Copenhagen, Denmark',
    website: 'https://hannahbergtravel.com',
    cameraBody: 'Fujifilm X-T5',
    lenses: 'XF 16-55mm f/2.8 R LM WR',
  },
  {
    name: 'Tariq Habib',
    username: 'tariq_concrete',
    email: 'tariq@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    bio: 'Brutalist concrete architecture, shadows, and urban silhouettes.',
    location: 'London, UK',
    website: 'https://tariqhabib.co.uk',
    cameraBody: 'Leica SL3',
    lenses: 'APO-Summicron-SL 50mm f/2 ASPH',
  },
  {
    name: 'Camille Laurent',
    username: 'camille_grain',
    email: 'camille@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Medium format film photography and organic analog color palettes.',
    location: 'Marseille, France',
    website: 'https://camillelaurent.com',
    cameraBody: 'Mamiya 7 II (Kodak Portra 400)',
    lenses: 'N65mm f/4 L',
  },
  {
    name: 'Rowan Vance',
    username: 'rowan_peaks',
    email: 'rowan@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'High altitude mountaineering photography and alpine ridge line climbs.',
    location: 'Chamonix, France',
    website: 'https://rowanpeaks.com',
    cameraBody: 'Sony Alpha 7CR',
    lenses: 'FE 20-70mm f/4 G',
  },
  {
    name: 'Priya Sharma',
    username: 'priya_vivid',
    email: 'priya@example.com',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    bio: 'Vibrant street culture, festivals, and cinematic color theory.',
    location: 'Jaipur, India',
    website: 'https://priyasharmavivid.in',
    cameraBody: 'Nikon Z6 III',
    lenses: 'NIKKOR Z 85mm f/1.8 S',
  },
  {
    name: 'Gabriel Rossi',
    username: 'gabriel_fineart',
    email: 'gabriel@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Fine art chiaroscuro still life and dramatic shadow play.',
    location: 'Florence, Italy',
    website: 'https://gabrielrossifineart.it',
    cameraBody: 'Canon EOS R5',
    lenses: 'RF 100mm f/2.8 L Macro IS USM',
  },
  {
    name: 'Freja Jensen',
    username: 'freja_fog',
    email: 'freja@example.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    bio: 'Misty Scandinavian pine forests, morning fog, and wilderness silence.',
    location: 'Stockholm, Sweden',
    website: 'https://frejajensen.se',
    cameraBody: 'Fujifilm X-Pro3',
    lenses: 'XF 35mm f/1.4 R',
  },
];

// Verified explicit Unsplash photo collection
const VERIFIED_PHOTOS = [
  {
    title: 'Alpine Horizon Glow',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    caption: 'Golden hour reflection over the alpine lake. Filtered through natural misty mountain light 🏔️✨',
    category: 'Landscape',
    tags: 'landscape, mountain, goldenhour',
    camera: 'Sony Alpha 7R V',
    lens: 'FE 24mm f/1.4 GM',
    aperture: 'f/2.8',
    shutter: '1/1000s',
    iso: '100',
  },
  {
    title: 'Tokyo Neon Rain Reflections',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    caption: 'Cyberpunk alleyway reflections in Shinjuku after midnight rain shower 🌆🌧️',
    category: 'Urban & Street',
    tags: 'urban, tokyo, neon',
    camera: 'Fujifilm GFX 100 II',
    lens: 'GF 45mm f/2.8 R WR',
    aperture: 'f/2.8',
    shutter: '1/250s',
    iso: '800',
  },
  {
    title: 'Studio Chiaroscuro Portrait',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    caption: 'Natural sunlight portrait series: Expressions of quiet confidence and studio shadows 📸✨',
    category: 'Portraits',
    tags: 'portrait, studio, light',
    camera: 'Canon EOS R3',
    lens: 'RF 85mm f/1.2 L USM',
    aperture: 'f/1.4',
    shutter: '1/500s',
    iso: '160',
  },
  {
    title: 'Minimal Concrete Geometry',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    caption: 'Structural lines and negative space reflections in modern museum architecture 🏛️',
    category: 'Architecture',
    tags: 'architecture, brutalist, lines',
    camera: 'Hasselblad X2D 100C',
    lens: 'XCD 38mm f/2.5 V',
    aperture: 'f/5.6',
    shutter: '1/125s',
    iso: '64',
  },
  {
    title: 'Milky Way Core Over Atacama',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    caption: 'Deep space exposure revealing the galactic core high in the Atacama desert 🌌✨',
    category: 'Astro & Night',
    tags: 'astrophotography, galaxy, night',
    camera: 'Sony Alpha 7R V',
    lens: 'FE 14mm f/1.8 GM',
    aperture: 'f/1.8',
    shutter: '15s',
    iso: '3200',
  },
  {
    title: 'Pacific Coast Long Exposure Wave',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Silk ocean water motion captured with 6-stop ND filter at sunset 🌊🌅',
    category: 'Seascape',
    tags: 'seascape, ocean, longexposure',
    camera: 'Sony Alpha 1',
    lens: 'FE 16-35mm f/2.8 GM II',
    aperture: 'f/11',
    shutter: '4s',
    iso: '50',
  },
  {
    title: 'Manhattan High Contrast Shadow',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=80',
    caption: 'Pedestrians crossing 5th Avenue amidst towering skyscraper sunlight beams 🗽',
    category: 'Urban & Street',
    tags: 'street, nyc, monochrome',
    camera: 'Leica M11 Monochrome',
    lens: 'Summilux-M 35mm f/1.4',
    aperture: 'f/4.0',
    shutter: '1/2000s',
    iso: '200',
  },
  {
    title: 'Serengeti Lioness at Dawn',
    image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1200&q=80',
    caption: 'Early morning gaze of a lioness patrolling savanna grassland borders 🦁🌾',
    category: 'Landscape',
    tags: 'wildlife, safari, Africa',
    camera: 'Nikon Z9',
    lens: 'NIKKOR Z 400mm f/2.8 VR S',
    aperture: 'f/2.8',
    shutter: '1/1600s',
    iso: '400',
  },
  {
    title: 'Scandinavian Forest Fog',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Morning mist filtering through pine canopy in Swedish wilderness 🌲🌫️',
    category: 'Landscape',
    tags: 'nature, forest, fog',
    camera: 'Fujifilm X-Pro3',
    lens: 'XF 35mm f/1.4 R',
    aperture: 'f/2.0',
    shutter: '1/500s',
    iso: '200',
  },
  {
    title: 'Northern Lights Fjord Dance',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80',
    caption: 'Vivid green Aurora ribbons dance above snowy Lofoten peaks 🌌🏔️',
    category: 'Astro & Night',
    tags: 'aurora, norway, night',
    camera: 'Canon EOS R5 C',
    lens: 'RF 15-35mm f/2.8 L',
    aperture: 'f/2.8',
    shutter: '6s',
    iso: '1600',
  },
  {
    title: 'Sahara Dune Sunrise Lines',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Ripples of sand dunes meeting sunrise shadows in Merzouga desert 🏜️🌅',
    category: 'Landscape',
    tags: 'desert, sand, sunrise',
    camera: 'Nikon Z8',
    lens: 'NIKKOR Z 50mm f/1.2 S',
    aperture: 'f/2.8',
    shutter: '1/1250s',
    iso: '64',
  },
  {
    title: 'Misty Alpine Valley Vista',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sunrise breaking through fog over remote mountain pass ⛰️✨',
    category: 'Landscape',
    tags: 'mountain, foggy, valley',
    camera: 'Sony Alpha 7CR',
    lens: 'FE 20-70mm f/4 G',
    aperture: 'f/8.0',
    shutter: '1/320s',
    iso: '100',
  },
  {
    title: 'Emerald Pine Canopy Fog',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    caption: 'Deep woodland silence amidst rolling Pacific Northwest fog 🌲',
    category: 'Landscape',
    tags: 'forest, canopy, emerald',
    camera: 'OM System OM-1 Mark II',
    lens: 'M.Zuiko 12-40mm f/2.8',
    aperture: 'f/4.0',
    shutter: '1/160s',
    iso: '200',
  },
  {
    title: 'Rolling Green Hill Reflections',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Lush green valley under dramatic afternoon cloud formations 🌾',
    category: 'Landscape',
    tags: 'hills, green, valley',
    camera: 'Canon EOS R5',
    lens: 'RF 24-70mm f/2.8 L',
    aperture: 'f/5.6',
    shutter: '1/640s',
    iso: '100',
  },
  {
    title: 'Glacier Lake Sunset Horizon',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    caption: 'Mirror glass reflection of mountain peaks in calm glacial waters 🏞️',
    category: 'Seascape',
    tags: 'glacier, lake, reflection',
    camera: 'Fujifilm X-T5',
    lens: 'XF 16-55mm f/2.8',
    aperture: 'f/8.0',
    shutter: '1/250s',
    iso: '160',
  },
  {
    title: 'Deep Ocean Blue Horizon',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Vast ocean expanse meeting clear blue horizon line at midday 🌊',
    category: 'Seascape',
    tags: 'ocean, blue, sea',
    camera: 'Sony Alpha 1',
    lens: 'FE 24-70mm f/2.8 GM II',
    aperture: 'f/8.0',
    shutter: '1/1000s',
    iso: '100',
  },
  {
    title: 'Metropolis Skyline Night Lights',
    image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Illuminated city towers and urban bay reflections at dusk 🏙️✨',
    category: 'Urban & Street',
    tags: 'city, skyline, night',
    camera: 'Leica SL3',
    lens: 'APO-Summicron 50mm f/2',
    aperture: 'f/4.0',
    shutter: '2s',
    iso: '100',
  },
  {
    title: 'Urban Cyberpunk Alley',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    caption: 'Golden light filtering through narrow city alleyway 🌆',
    category: 'Urban & Street',
    tags: 'urban, alley, lights',
    camera: 'Fujifilm X-Pro3',
    lens: 'XF 23mm f/1.4',
    aperture: 'f/2.0',
    shutter: '1/320s',
    iso: '400',
  },
  {
    title: 'Glass Tower Architectural Reflection',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    caption: 'Modern glass skyscraper soaring into blue sky 🏙️',
    category: 'Architecture',
    tags: 'building, glass, modern',
    camera: 'Hasselblad X2D 100C',
    lens: 'XCD 38mm f/2.5',
    aperture: 'f/8.0',
    shutter: '1/500s',
    iso: '64',
  },
  {
    title: 'Spiral Staircase Geometry',
    image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80',
    caption: 'Abstract top-down spiral staircase geometry and shadow curves 🌀',
    category: 'Architecture',
    tags: 'stairs, spiral, geometry',
    camera: 'Leica Q3',
    lens: 'Summilux 28mm f/1.7',
    aperture: 'f/4.0',
    shutter: '1/125s',
    iso: '200',
  },
  {
    title: 'Ancient Tree Canopy Light',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sunbeams piercing through ancient oak tree leaves 🌳✨',
    category: 'Landscape',
    tags: 'tree, forest, sunlight',
    camera: 'Nikon Z6 III',
    lens: 'NIKKOR Z 35mm f/1.8 S',
    aperture: 'f/2.8',
    shutter: '1/400s',
    iso: '100',
  },
  {
    title: 'Rocky Mountain Peak Ridge',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Jagged mountain peaks against clear blue sky 🏔️',
    category: 'Landscape',
    tags: 'mountain, ridge, summit',
    camera: 'Sony Alpha 7CR',
    lens: 'FE 24-70mm f/2.8 GM II',
    aperture: 'f/8.0',
    shutter: '1/800s',
    iso: '100',
  },
  {
    title: 'Starlight Over Alpine Lake',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    caption: 'Starry night sky and constellation reflections over snowcapped peaks 🌌',
    category: 'Astro & Night',
    tags: 'stars, night, mountain',
    camera: 'Sony Alpha 7R V',
    lens: 'FE 14mm f/1.8 GM',
    aperture: 'f/1.8',
    shutter: '10s',
    iso: '2500',
  },
  {
    title: 'Coastal Cliff Waves Sunset',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    caption: 'Golden sunset over ocean waves crashing against coastal cliffs 🌊🌅',
    category: 'Seascape',
    tags: 'coastal, cliffs, sunset',
    camera: 'Canon EOS R5',
    lens: 'RF 15-35mm f/2.8 L',
    aperture: 'f/8.0',
    shutter: '1/250s',
    iso: '100',
  },
  {
    title: 'Urban Street Pedestrian Motion',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80',
    caption: 'City street blur capturing afternoon urban commute pace 🏙️',
    category: 'Urban & Street',
    tags: 'street, city, motion',
    camera: 'Fujifilm X-T5',
    lens: 'XF 23mm f/2 R WR',
    aperture: 'f/5.6',
    shutter: '1/15s',
    iso: '160',
  },
  {
    title: 'Soft Natural Studio Portrait',
    image: 'https://images.unsplash.com/photo-1531804055935-76f44d7c3621?auto=format&fit=crop&w=1200&q=80',
    caption: 'Warm ambient lighting portrait series: Quiet introspective moments 📸',
    category: 'Portraits',
    tags: 'portrait, studio, softlight',
    camera: 'Canon EOS R3',
    lens: 'RF 85mm f/1.2 L',
    aperture: 'f/1.4',
    shutter: '1/400s',
    iso: '100',
  },
  {
    title: 'Tropical Beach Sunset Horizon',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Golden sun setting over calm turquoise waters and palm silhouettes 🏖️',
    category: 'Seascape',
    tags: 'beach, sunset, tropical',
    camera: 'Sony Alpha 1',
    lens: 'FE 24-70mm f/2.8 GM II',
    aperture: 'f/5.6',
    shutter: '1/500s',
    iso: '100',
  },
  {
    title: 'Calm Fjord Reflection Boat',
    image: 'https://images.unsplash.com/photo-1476514525535-ce74f452623d?auto=format&fit=crop&w=1200&q=80',
    caption: 'Solitary wooden boat drifting on mirror calm fjord waters 🚣‍♂️',
    category: 'Seascape',
    tags: 'fjord, boat, calm',
    camera: 'Nikon Z8',
    lens: 'NIKKOR Z 24-120mm f/4 S',
    aperture: 'f/5.6',
    shutter: '1/320s',
    iso: '100',
  },
  {
    title: 'Alpine Mirror Lake Sunset',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Vivid sunset colors reflected in crystalline mountain waters 🏔️🌅',
    category: 'Landscape',
    tags: 'lake, sunset, mountain',
    camera: 'Sony Alpha 7R V',
    lens: 'FE 16-35mm f/2.8 GM',
    aperture: 'f/8.0',
    shutter: '1/200s',
    iso: '100',
  },
];

async function main() {
  console.log('🌱 Starting full-scale random database seeding with verified Unsplash images...');

  const hashedPassword = await bcrypt.hash('AdminPass123!', 10);

  // 1. Preserve or Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@photopedia.com' },
    update: { role: 'admin', status: 'active' },
    create: {
      email: 'admin@photopedia.com',
      username: 'admin',
      name: 'Photopedia Admin',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Platform Administrator & Content Manager.',
    },
  });

  // 2. Preserve or Create Elena User
  const elenaUser = await prisma.user.upsert({
    where: { email: 'elena@example.com' },
    update: { role: 'user', status: 'active' },
    create: {
      email: 'elena@example.com',
      username: 'elena_photos',
      name: 'Elena Rostova',
      password: hashedPassword,
      role: 'user',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      bio: 'Landscape & outdoor photographer documenting natural light reflections.',
      location: 'Chamonix, France',
      website: 'https://elenarostovaphotos.com',
      cameraBody: 'Sony Alpha 7R V',
      lenses: 'FE 24mm f/1.4 GM, FE 70-200mm f/2.8 GM II',
    },
  });

  // 3. Delete non-preserved users and existing activity for a clean seed
  console.log('🧹 Cleaning old non-preserved users and existing photo feeds...');
  await prisma.comment.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.exifData.deleteMany({});
  await prisma.moderationLog.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.post.deleteMany({});

  // Delete all users EXCEPT admin and elena
  await prisma.user.deleteMany({
    where: {
      email: { notIn: PRESERVED_EMAILS },
    },
  });

  console.log('✅ Cleaned old non-preserved users');

  // 4. Seed 20 Realistic Photography Creators
  const seededCreators = [adminUser, elenaUser];

  for (const seed of CREATOR_SEEDS) {
    const creator = await prisma.user.create({
      data: {
        email: seed.email,
        username: seed.username,
        name: seed.name,
        password: hashedPassword,
        role: 'user',
        status: 'active',
        avatar: seed.avatar,
        bio: seed.bio,
        location: seed.location,
        website: seed.website,
        cameraBody: seed.cameraBody,
        lenses: seed.lenses,
      },
    });
    seededCreators.push(creator);
  }

  console.log(`✅ Seeded ${CREATOR_SEEDS.length} new photography creator profiles (Total users: ${seededCreators.length})`);

  // 5. Seed Photo Posts & EXIF Camera Data using VERIFIED_PHOTOS array
  const createdPosts: any[] = [];
  const creatorUsers = seededCreators.filter((u) => u.role === 'user');

  for (let i = 0; i < VERIFIED_PHOTOS.length; i++) {
    const photo = VERIFIED_PHOTOS[i];
    const author = creatorUsers[i % creatorUsers.length];

    const post = await prisma.post.create({
      data: {
        title: photo.title,
        image: photo.image,
        caption: photo.caption,
        category: photo.category,
        tags: photo.tags,
        authorId: author.id,
        exif: {
          create: {
            camera: photo.camera,
            lens: photo.lens,
            aperture: photo.aperture,
            shutter: photo.shutter,
            iso: photo.iso,
          },
        },
      },
    });
    createdPosts.push(post);
  }

  console.log(`✅ Seeded ${createdPosts.length} verified high-quality photography posts with EXIF gear data`);

  // 6. Seed Follow Network Relationships
  console.log('🤝 Building follower & following networks...');
  let followCount = 0;
  for (let u1 of creatorUsers) {
    for (let u2 of creatorUsers) {
      if (u1.id !== u2.id && Math.random() > 0.65) {
        try {
          await prisma.follow.create({
            data: {
              followerId: u1.id,
              followingId: u2.id,
            },
          });
          followCount++;
        } catch (e) {}
      }
    }
  }
  console.log(`✅ Created ${followCount} follow network relationships`);

  // 7. Seed Likes & Comments
  console.log('❤️ Seeding likes and community comments...');
  let likeCount = 0;
  let commentCount = 0;

  const commentPhrases = [
    'Breathtaking composition! The light reflection is unreal.',
    'Stunning color grading and contrast balance.',
    'What camera lens did you use for this shot?',
    'Incredible perspective! Love the depth of field.',
    'Masterclass in lighting and negative space.',
    'The raw detail in this exposure is amazing.',
  ];

  for (const post of createdPosts) {
    for (const user of creatorUsers) {
      if (Math.random() > 0.45) {
        try {
          await prisma.like.create({
            data: {
              userId: user.id,
              postId: post.id,
            },
          });
          likeCount++;
        } catch (e) {}
      }

      if (Math.random() > 0.8) {
        try {
          await prisma.comment.create({
            data: {
              userId: user.id,
              postId: post.id,
              content: commentPhrases[Math.floor(Math.random() * commentPhrases.length)],
            },
          });
          commentCount++;
        } catch (e) {}
      }
    }
  }

  console.log(`✅ Seeded ${likeCount} likes and ${commentCount} comments`);

  // 8. Seed Admin Moderation Log Queue
  const flaggedPost = createdPosts[0];
  if (flaggedPost) {
    await prisma.moderationLog.create({
      data: {
        postId: flaggedPost.id,
        reason: 'Review requested for copyright verification and community guidelines',
        status: 'PENDING',
        action: 'FLAGGED',
      },
    });
  }

  console.log('✅ Seeded Admin Moderation Queue item');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
