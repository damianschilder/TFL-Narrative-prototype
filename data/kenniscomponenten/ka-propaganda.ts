import type { KnowledgeComponent } from '~/types/domain';

// Kenniscomponenten specifiek voor het kenmerkend aspect:
// "De rol van moderne propaganda- en communicatiemiddelen en vormen van massa-organisatie."
export const propagandaKCs: KnowledgeComponent[] = [
  // What (Wat is het?)
  {
    id: 'prop-kc1',
    nameKey: 'kcs.prop-kc1.name',
    type: 'declarative',
    category: 'What',
    learningObjective: 'Definiëren wat propaganda is en hoe het werd ingezet in de eerste helft van de 20e eeuw.'
  },
  {
    id: 'prop-kc2',
    nameKey: 'kcs.prop-kc2.name',
    type: 'declarative',
    category: 'What',
    learningObjective: 'De belangrijkste communicatiemiddelen (radio, film, posters) benoemen die werden gebruikt voor propaganda.'
  },
  {
    id: 'prop-kc3',
    nameKey: 'kcs.prop-kc3.name',
    type: 'declarative',
    category: 'What',
    learningObjective: 'Uitleggen wat een massa-organisatie is, met de Hitlerjugend en de Komsomol als voorbeelden.'
  },
  // How (Hoe werkte het?)
  {
    id: 'prop-kc4',
    nameKey: 'kcs.prop-kc4.name',
    type: 'procedural',
    category: 'How',
    dependsOn: ['prop-kc1', 'prop-kc2'],
    learningObjective: 'Een propagandaposter analyseren op basis van visuele technieken en boodschap.'
  },
  {
    id: 'prop-kc5',
    nameKey: 'kcs.prop-kc5.name',
    type: 'procedural',
    category: 'How',
    dependsOn: ['prop-kc1'],
    learningObjective: 'De rol van radio in het verspreiden van totalitaire ideologieën beschrijven.'
  },
  // So what? (Wat was de impact?)
  {
    id: 'prop-kc6',
    nameKey: 'kcs.prop-kc6.name',
    type: 'declarative',
    category: 'So what?',
    dependsOn: ['prop-kc3', 'prop-kc5'],
    learningObjective: 'De impact van propaganda en massa-organisaties op de burgerbevolking in totalitaire staten evalueren.'
  },
  // Misconceptions (Veelvoorkomende misvattingen)
  {
    id: 'prop-kc7',
    nameKey: 'kcs.prop-kc7.name',
    type: 'erroneous',
    category: 'Misconceptions',
    learningObjective: 'De misvatting corrigeren dat propaganda alleen uit leugens bestaat, door uit te leggen hoe het ook waarheden kan verdraaien.'
  }
];