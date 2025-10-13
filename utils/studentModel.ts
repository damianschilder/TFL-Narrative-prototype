import { tijdvakken } from '~/data';
import type { KnowledgeComponent, KenmerkendAspect } from '~/types/domain';

// Interface for the state of a single KC
export interface StudentKCState {
  mastery: number;
  attempts: number;
}

// BKT Parameters (gelijk gebleven)
const P_INIT = 0.25;
const P_TRANSIT = 0.15;
const P_GUESS = 0.20;
const P_SLIP = 0.10;
const MASTERY_THRESHOLD = 0.95;

// --- State Management ---

// Vind het actieve Kenmerkend Aspect op basis van de key in sessionStorage
const getActiveKenmerkendAspect = (): KenmerkendAspect | null => {
  if (typeof window === 'undefined') return null;
  const activeAspectKey = sessionStorage.getItem('activeAspectKey');
  if (!activeAspectKey) return null;

  // Doorzoek de tijdvakken om het juiste aspect te vinden
  for (const tijdvak of tijdvakken) {
    const aspect = tijdvak.aspecten.find(a => a.id === activeAspectKey);
    if (aspect) return aspect;
  }
  return null;
};

export const getStudentState = (): { [kcId: string]: StudentKCState } | null => {
  if (typeof window === 'undefined') return null;
  const stateStr = sessionStorage.getItem('studentState');
  return stateStr ? JSON.parse(stateStr) : null;
};

const saveStudentState = (state: { [kcId: string]: StudentKCState }): void => {
  sessionStorage.setItem('studentState', JSON.stringify(state));
};

// Initialiseer de state voor een specifiek Kenmerkend Aspect
export const initializeStudentState = (aspectKey: string): void => {
  const aspect = tijdvakken.flatMap(t => t.aspecten).find(a => a.id === aspectKey);
  
  if (!aspect || !aspect.knowledgeComponents) {
    console.error('[studentModel] Kenmerkend Aspect of KCs niet gevonden voor key:', aspectKey);
    return;
  }
  
  sessionStorage.setItem('activeAspectKey', aspectKey);

  const initialState: { [kcId: string]: StudentKCState } = {};
  for (const kc of aspect.knowledgeComponents) {
    initialState[kc.id] = { mastery: P_INIT, attempts: 0 };
  }
  
  console.log('[studentModel] Initialized student state for aspect:', aspectKey, initialState);
  saveStudentState(initialState);
};

// --- BKT Logic (deze functie is ongewijzigd) ---
export function updateKCMastery(kcId: string, isCorrect: boolean): void {
  const state = getStudentState();
  if (!state || !state[kcId]) {
    console.error('[studentModel] Could not find state to update for KC:', kcId);
    return;
  }
  const kcState = state[kcId];
  console.log(`[studentModel] Updating KC: ${kcId}. Correct: ${isCorrect}. Current mastery: ${kcState.mastery}`);
  kcState.attempts += 1;
  const pKnown = kcState.mastery;
  let pNewKnown;
  if (isCorrect) {
    const pCorrectGivenKnown = 1 - P_SLIP;
    const pCorrectGivenUnknown = P_GUESS;
    pNewKnown = (pCorrectGivenKnown * pKnown) / ((pCorrectGivenKnown * pKnown) + (pCorrectGivenUnknown * (1 - pKnown)));
  } else {
    const pIncorrectGivenKnown = P_SLIP;
    const pIncorrectGivenUnknown = 1 - P_GUESS;
    pNewKnown = (pIncorrectGivenKnown * pKnown) / ((pIncorrectGivenKnown * pKnown) + (pIncorrectGivenUnknown * (1 - pKnown)));
  }
  kcState.mastery = pNewKnown + (1 - pNewKnown) * P_TRANSIT;
  console.log(`[studentModel] BKT calculation complete. New mastery: ${kcState.mastery}`);
  saveStudentState(state);
}


// Selecteer de volgende KC om te leren
export function selectNextKC(): KnowledgeComponent | null {
  const aspect = getActiveKenmerkendAspect();
  const state = getStudentState();

  console.log('[studentModel] Selecting next KC...');

  if (!aspect || !state || !aspect.knowledgeComponents) {
    console.warn('[studentModel] No active aspect, student state, or KCs found.');
    return null;
  }

  for (const kc of aspect.knowledgeComponents) {
    const kcState = state[kc.id];
    if (kcState && kcState.mastery < MASTERY_THRESHOLD) {
      const dependenciesMet = !kc.dependsOn || kc.dependsOn.every(depId => {
        const depState = state[depId];
        return depState && depState.mastery >= MASTERY_THRESHOLD;
      });

      if (dependenciesMet) {
        console.log(`[studentModel] Found next KC to learn: ${kc.id}.`);
        return kc;
      }
    }
  }

  console.log('[studentModel] No suitable KC found. All KCs may be mastered.');
  return null;
}