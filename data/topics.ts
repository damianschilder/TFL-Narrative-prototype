// /data/topics.ts
import { ww2DomainKnowledge, type KnowledgeComponent } from './ww2DomainModel';

export interface Topic {
  key: string;
  titleKey: string;
  descriptionKey: string;
  domainKnowledge: KnowledgeComponent[];
}

export const topics: Topic[] = [
  {
    key: 'ww2',
    titleKey: 'topics.ww2.title',
    descriptionKey: 'topics.ww2.description',
    domainKnowledge: ww2DomainKnowledge,
  },
];

const allKCs = new Map<string, KnowledgeComponent>();
topics.forEach(topic => {
  topic.domainKnowledge.forEach(kc => {
    allKCs.set(kc.id, kc);
  });
});

export { allKCs };