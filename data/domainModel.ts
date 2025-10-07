// /data/domainModel.ts

export interface KnowledgeComponent {
  id: string;          // Unieke identifier, bijv. 'sas-origin'
  name: string;        // Korte naam van de KC, bijv. "Ontstaan van de SAS"
  category: 'What' | 'How' | 'So what?'; // De categorie in de mindmap
  learningObjective: string; // De kerninformatie die de AI moet verwerken
  dependsOn?: string[]; // Optionele IDs van KCs die eerst beheerst moeten worden
}

// Voorbeeld voor het domein "Operatie HOUNDSWORTH / Lt-Col. Mayne"
export const domainKnowledge: KnowledgeComponent[] = [
  {
    id: 'mayne-role',
    name: 'Rol van Lt-Col. Mayne',
    category: 'What',
    learningObjective: 'Luitenant-Kolonel R.B. Mayne was de commandant van het 1e SAS Regiment tijdens de operaties in Frankrijk in 1944.'
  },
  {
    id: 'houndsworth-mission',
    name: 'Missie HOUNDSWORTH',
    category: 'What',
    learningObjective: 'Op 8 augustus 1944 werd Mayne gedropt voor Operatie HOUNDSWORTH om SAS-detachementen te coördineren voor een geplande luchtlanding.'
  },
  {
    id: 'jeep-daring',
    name: 'Gevaarlijke Jeeptocht',
    category: 'How',
    dependsOn: ['houndsworth-mission'],
    learningObjective: 'Mayne reisde overdag in zijn eentje per jeep door vijandelijk gebied om verschillende bases te bereiken en te coördineren.'
  },
  {
    id: 'breakthrough-lines',
    name: 'Doorbreken van Linies',
    category: 'How',
    dependsOn: ['jeep-daring'],
    learningObjective: 'Na contact met Amerikaanse troepen, doorbrak Mayne meermaals (vier keer) de Duitse en Amerikaanse linies om versterkingen en konvooien van jeeps te leiden.'
  },
  {
    id: 'leadership-impact',
    name: 'Impact van Leiderschap',
    category: 'So what?',
    dependsOn: ['breakthrough-lines'],
    learningObjective: 'Het was uitsluitend te danken aan het leiderschap en de minachting voor gevaar van Lt-Col. Mayne dat zijn eenheid buitengewone successen behaalde.'
  }
];