export interface KnowledgeComponent {
  id: string;
  nameKey: string;
  type: 'declarative' | 'procedural' | 'erroneous';
  category: 'What' | 'How' | 'So what?' | 'Misconceptions';
  learningObjective: string;
  dependsOn?: string[];
}

export interface KenmerkendAspect {
  id: string;
  title: string;
  isAvailable: boolean;
  knowledgeComponents?: KnowledgeComponent[]; // KCs zijn gekoppeld aan een aspect
}

export interface Tijdvak {
  id: string;
  title: string;
  period: string;
  aspecten: KenmerkendAspect[];
}