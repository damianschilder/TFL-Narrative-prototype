// /utils/studentModel.ts
import { topics, type Topic } from '~/data/topics';
import type { KnowledgeComponent } from '~/data/ww2DomainModel';

// Interface for the state of a single KC
export interface StudentKCState {
  mastery: number; // Probability that the student knows this (0.0 to 1.0)
  attempts: number;
}

// BKT Parameters
const P_INIT = 0.25;      // Initial probability of knowing the concept
const P_TRANSIT = 0.15;   // Probability of learning after an attempt
const P_GUESS = 0.20;     // Probability of guessing correctly
const P_SLIP = 0.10;      // Probability of making a mistake despite knowing

const MASTERY_THRESHOLD = 0.95; // Threshold to consider a KC as mastered

// --- Topic and State Management ---

const getActiveTopic = (): Topic | null => {
  if (typeof window === 'undefined') return null;
  const activeTopicKey = sessionStorage.getItem('activeTopicKey');
  if (!activeTopicKey) return null;
  return topics.find(t => t.key === activeTopicKey) || null;
};

export const getStudentState = (): { [kcId: string]: StudentKCState } | null => {
  if (typeof window === 'undefined') return null;
  const stateStr = sessionStorage.getItem('studentState');
  return stateStr ? JSON.parse(stateStr) : null;
};

const saveStudentState = (state: { [kcId: string]: StudentKCState }): void => {
  sessionStorage.setItem('studentState', JSON.stringify(state));
};

export const initializeStudentState = (topicKey: string): void => {
  const topic = topics.find(t => t.key === topicKey);
  if (!topic) {
    console.error('[studentModel] Topic not found for key:', topicKey);
    return;
  }
  
  sessionStorage.setItem('activeTopicKey', topicKey);

  const initialState: { [kcId: string]: StudentKCState } = {};
  for (const kc of topic.domainKnowledge) {
    initialState[kc.id] = { mastery: P_INIT, attempts: 0 };
  }
  // --- ADDED LOG ---
  console.log('[studentModel] Initialized student state for topic:', topicKey, initialState);
  saveStudentState(initialState);
};

// --- BKT Logic ---

export function updateKCMastery(kcId: string, isCorrect: boolean): void {
  const state = getStudentState();
  if (!state || !state[kcId]) {
    console.error('[studentModel] Could not find state to update for KC:', kcId);
    return;
  }

  const kcState = state[kcId];
  // --- ADDED LOG ---
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
  // --- ADDED LOG ---
  console.log(`[studentModel] BKT calculation complete. P(Known) after evidence: ${pNewKnown}. New mastery after transit: ${kcState.mastery}`);
  saveStudentState(state);
  // --- ADDED LOG ---
  console.log('[studentModel] New student state saved.');
}

export function selectNextKC(): KnowledgeComponent | null {
  const topic = getActiveTopic();
  const state = getStudentState();

  // --- ADDED LOG ---
  console.log('[studentModel] Selecting next KC...');

  if (!topic || !state) {
    console.warn('[studentModel] No active topic or student state found.');
    return null;
  }

  // --- ADDED LOG ---
  console.log('[studentModel] Current student state:', state);

  for (const kc of topic.domainKnowledge) {
    const kcState = state[kc.id];
    if (kcState && kcState.mastery < MASTERY_THRESHOLD) {
      // --- ADDED LOG ---
      console.log(`[studentModel] Checking candidate KC: ${kc.id} (Mastery: ${kcState.mastery})`);
      const dependenciesMet = !kc.dependsOn || kc.dependsOn.every(depId => {
        const depState = state[depId];
        const isMet = depState && depState.mastery >= MASTERY_THRESHOLD;
        // --- ADDED LOG ---
        console.log(`[studentModel]   - Checking dependency ${depId}: Mastery=${depState?.mastery}, Met=${isMet}`);
        return isMet;
      });

      if (dependenciesMet) {
        // --- ADDED LOG ---
        console.log(`[studentModel] Found next KC to learn: ${kc.id}. Dependencies met.`);
        return kc; // This is the next KC to learn
      }
    }
  }
  
  // --- ADDED LOG ---
  console.log('[studentModel] No suitable KC found. All KCs may be mastered.');
  return null; // All KCs for this topic are learned
}