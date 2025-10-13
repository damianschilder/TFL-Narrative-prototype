import { tijdvakken } from './onderwijsstructuur';
import type { KnowledgeComponent } from '~/types/domain';

// Maak een centrale Map van ALLE knowledge components in de hele applicatie.
// Dit is handig voor snelle lookups in de API-routes.
const allKCs = new Map<string, KnowledgeComponent>();

tijdvakken.forEach(tijdvak => {
  tijdvak.aspecten.forEach(aspect => {
    if (aspect.knowledgeComponents) {
      aspect.knowledgeComponents.forEach(kc => {
        allKCs.set(kc.id, kc);
      });
    }
  });
});

// Exporteer zowel de volledige structuur als de platte KC-map
export { tijdvakken, allKCs };