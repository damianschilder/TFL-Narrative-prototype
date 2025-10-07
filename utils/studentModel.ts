// /utils/studentModel.ts
import { domainKnowledge, type KnowledgeComponent } from "~/data/domainModel";

// Interface voor de staat van een enkele KC
export interface KCState {
  kcId: string;
  mastery: number; // Waarschijnlijkheid dat de student dit beheerst (0.0 tot 1.0)
  attempts: number;
  correct: number;
}

// BKT parameters (vereenvoudigd)
const P_INIT = 0.25;      // Startkans op kennis
const P_TRANSIT = 0.15;   // Kans om te leren na een poging
const P_GUESS = 0.20;     // Kans op goed gokken
const P_SLIP = 0.10;      // Kans op fout maken ondanks kennis

// Haalt de volledige studentstaat op
export function getStudentState(): KCState[] {
  const storedState = sessionStorage.getItem('studentState');
  if (storedState) {
    return JSON.parse(storedState);
  }
  // Initialiseer de staat als deze niet bestaat
  const initialState = domainKnowledge.map(kc => ({
    kcId: kc.id,
    mastery: P_INIT,
    attempts: 0,
    correct: 0,
  }));
  sessionStorage.setItem('studentState', JSON.stringify(initialState));
  return initialState;
}

// Slaat de studentstaat op
function saveStudentState(state: KCState[]) {
  sessionStorage.setItem('studentState', JSON.stringify(state));
}

// Update de beheersing van een KC na een antwoord
export function updateKCMastery(kcId: string, isCorrect: boolean) {
  const state = getStudentState();
  const kcState = state.find(s => s.kcId === kcId);
  if (!kcState) return;

  kcState.attempts += 1;
  if (isCorrect) kcState.correct += 1;
  
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
  saveStudentState(state);
}

// Kiest de volgende KC om te leren
export function selectNextKC(): KnowledgeComponent | null {
  const state = getStudentState();
  
  for (const kc of domainKnowledge) {
    const kcState = state.find(s => s.kcId === kc.id);
    if (!kcState || kcState.mastery < 0.95) { // Drempel voor beheersing
      // Check of vereisten zijn voldaan
      if (!kc.dependsOn || kc.dependsOn.every(depId => {
        const depState = state.find(s => s.kcId === depId);
        return depState && depState.mastery >= 0.95;
      })) {
        return kc; // Dit is de volgende KC
      }
    }
  }
  
  return null; // Alles is geleerd!
}