// /data/ww2DomainModel.ts
export interface KnowledgeComponent {
  id: string;
  name: string;
  type: 'declarative' | 'procedural' | 'erroneous';
  category: 'What' | 'How' | 'So what?' | 'Misconceptions';
  learningObjective: string;
  dependsOn?: string[];
}

export const ww2DomainKnowledge: KnowledgeComponent[] = [
  // What
  { id: 'kc1', name: 'WWII Timeline', type: 'declarative', category: 'What', learningObjective: 'The timeline of World War II is from 1939 to 1945.' },
  { id: 'kc2', name: 'Interwar Conditions', type: 'declarative', category: 'What', learningObjective: 'Explain the political and economic conditions of the interwar period that led to WWII.' },
  { id: 'kc3', name: 'Invasion of Poland', type: 'declarative', category: 'What', learningObjective: 'The invasion of Poland by Germany was the immediate cause of World War II.' },
  { id: 'kc6', name: 'Hitler\'s Ideology', type: 'declarative', category: 'What', learningObjective: 'Summarize Adolf Hitler\'s ideology and leadership style.' },
  { id: 'kc9', name: 'Occupation Impact', type: 'declarative', category: 'What', learningObjective: 'Describe the impact of Axis occupation on European territories.' },
  // How
  { id: 'kc13', name: 'Isolationism to Alliances', type: 'procedural', category: 'How', learningObjective: 'Analyze the shift in global politics from isolationism to the formation of global alliances during WWII.' },
  { id: 'kc14', name: 'Sequence WWII Events', type: 'procedural', category: 'How', dependsOn: ['kc1', 'kc3'], learningObjective: 'Sequence the key causes, turning points, and outcomes of WWII.' },
  { id: 'kc16', name: 'Analyze Propaganda', type: 'procedural', category: 'How', learningObjective: 'Critically analyze wartime propaganda and speeches as historical sources.' },
  // So what?
  { id: 'kc17', name: 'Fascist Regime Collapse', type: 'declarative', category: 'So what?', learningObjective: 'Explain how fascist regimes in Europe collapsed post-WWII.' },
  { id: 'kc22', name: 'Holocaust\'s Impact', type: 'declarative', category: 'So what?', learningObjective: 'Explain the Holocaust\'s impact on the development of human rights discourse.' },
  { id: 'kc25', name: 'Postwar Human Rights', type: 'declarative', category: 'So what?', learningObjective: 'Explain the rise of postwar human rights principles.' },
  // Misconceptions
  { id: 'kc27', name: 'Misconception: Sole Cause', type: 'erroneous', category: 'Misconceptions', learningObjective: 'Address the misconception that WWII was caused solely by Hitler\'s actions by explaining the multiple contributing factors.' },
  { id: 'kc28', name: 'Misconception: US Entry', type: 'erroneous', category: 'Misconceptions', learningObjective: 'Correct the misconception that the US entered the war immediately after it began, explaining the actual timeline and reasons for US entry.' },
  { id: 'kc29', name: 'Misconception: Atomic Bombings', type: 'erroneous', category: 'Misconceptions', learningObjective: 'Clarify the misconception that the atomic bombings ended the war instantly, discussing the complexities of Japan\'s surrender.' }
];