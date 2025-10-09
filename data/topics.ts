// /data/topics.ts
import { ww2DomainKnowledge, type KnowledgeComponent } from './ww2DomainModel';

export interface Topic {
  key: string;
  title: string;
  description: string;
  domainKnowledge: KnowledgeComponent[];
}

export const topics: Topic[] = [
  {
    key: 'ww2',
    title: 'World War II',
    description: 'A module covering the key events, figures, and concepts of the Second World War, based on the high school curriculum.',
    domainKnowledge: ww2DomainKnowledge,
  },
  // {
  //   key: 'french-revolution',
  //   title: 'The French Revolution',
  //   description: 'Explore the causes, major events, and lasting impact of the French Revolution.',
  //   domainKnowledge: frenchRevolutionDomainKnowledge, // You would create this new domain model file
  // },
];

// A master map for easy KC lookup on the server
const allKCs = new Map<string, KnowledgeComponent>();
topics.forEach(topic => {
  topic.domainKnowledge.forEach(kc => {
    allKCs.set(kc.id, kc);
  });
});

export { allKCs };