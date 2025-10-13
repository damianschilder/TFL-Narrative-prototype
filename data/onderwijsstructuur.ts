import { propagandaKCs } from './kenniscomponenten/ka-propaganda';
import type { Tijdvak } from '~/types/domain';

// De volledige lijst van Tijdvakken en Kenmerkende Aspecten
export const tijdvakken: Tijdvak[] = [
  {
    id: 'tv1',
    title: 'Tijd van jagers en boeren',
    period: 'Tot 3000 v.Chr.',
    aspecten: [
      { id: 'ka1-1', title: 'De levenswijze van jager-verzamelaars.', isAvailable: false },
      { id: 'ka1-2', title: 'Het ontstaan van landbouw en landbouwsamenlevingen.', isAvailable: false },
      { id: 'ka1-3', title: 'Het ontstaan van de eerste stedelijke gemeenschappen.', isAvailable: false }
    ]
  },
  // ... (Tijdvak 2 t/m 8 hier, met isAvailable: false)
  {
    id: 'tv2',
    title: 'Tijd van Grieken en Romeinen',
    period: '3000 v.Chr. - 500 n.Chr.',
    aspecten: [ /* ... aspecten met isAvailable: false ... */ ]
  },
  {
    id: 'tv3',
    title: 'Tijd van monniken en ridders',
    period: '500 - 1000',
    aspecten: [ /* ... aspecten met isAvailable: false ... */ ]
  },
  {
    id: 'tv4',
    title: 'Tijd van steden en staten',
    period: '1000 - 1500',
    aspecten: [ /* ... aspecten met isAvailable: false ... */ ]
  },
  {
    id: 'tv5',
    title: 'Tijd van ontdekkers en hervormers',
    period: '1500 - 1600',
    aspecten: [ /* ... aspecten met isAvailable: false ... */ ]
  },
  {
    id: 'tv6',
    title: 'Tijd van regenten en vorsten',
    period: '1600 - 1700',
    aspecten: [ /* ... aspecten met isAvailable: false ... */ ]
  },
  {
    id: 'tv7',
    title: 'Tijd van pruiken en revoluties',
    period: '1700 - 1800',
    aspecten: [ /* ... aspecten met isAvailable: false ... */ ]
  },
  {
    id: 'tv8',
    title: 'Tijd van burgers en stoommachines',
    period: '1800 - 1900',
    aspecten: [ /* ... aspecten met isAvailable: false ... */ ]
  },
  {
    id: 'tv9',
    title: 'Tijd van de wereldoorlogen',
    period: '1900 - 1950',
    aspecten: [
      {
        id: 'ka-propaganda', // Belangrijke, unieke key!
        title: 'De rol van moderne propaganda- en communicatiemiddelen en vormen van massa-organisatie.',
        isAvailable: true, // Deze is beschikbaar!
        knowledgeComponents: propagandaKCs // Koppel de KCs hier
      },
      { id: 'ka9-2', title: 'De totalitaire politieke systemen: communisme en nationaalsocialisme.', isAvailable: false },
      { id: 'ka9-3', title: 'De economische wereldcrisis, het voeren van twee wereldoorlogen...', isAvailable: false },
      { id: 'ka9-4', title: 'Verwoestingen door massavernietigingswapens...', isAvailable: false },
      { id: 'ka9-5', title: 'Verzet in de koloniën tegen het West-Europese imperialisme.', isAvailable: false }
    ]
  },
  {
    id: 'tv10',
    title: 'Tijd van televisie en computer',
    period: '1950 - heden',
    aspecten: [ /* ... aspecten met isAvailable: false ... */ ]
  }
];