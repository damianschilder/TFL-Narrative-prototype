import { getStudentState, updateKCMastery } from '~/utils/studentModel';
import { tijdvakken } from '~/data';

// Helper function to simulate BKT updates on the server
// NOTE: This is a simplified server-side simulation.
const calculateInitialMastery = (aspectId: string, results: { kcId: string, isCorrect: boolean }[]) => {
  const aspect = tijdvakken.flatMap(t => t.aspecten).find(a => a.id === aspectId);
  if (!aspect || !aspect.knowledgeComponents) {
    console.error("Aspect or KCs not found for mastery calculation.");
    return {};
  }
  
  // Create a fresh initial state
  const P_INIT = 0.25;
  const initialState: { [key: string]: any } = {};
  aspect.knowledgeComponents.forEach(kc => {
    initialState[kc.id] = { mastery: P_INIT, attempts: 0 };
  });

  // Apply the pre-test results
  results.forEach(result => {
    const { kcId, isCorrect } = result;
    if (initialState[kcId]) {
      // Dummy updateKCMastery logic for the server.
      // A simple boost/penalty is enough for an initial state.
      const currentMastery = initialState[kcId].mastery;
      initialState[kcId].mastery = isCorrect 
          ? Math.min(0.9, currentMastery + 0.25) // Boost for correct
          : Math.max(0.1, currentMastery - 0.15); // Penalty for incorrect
      initialState[kcId].attempts = 1;
    }
  });

  return initialState;
};


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { questions, answers, aspectId } = body;

  if (!questions || !answers || !aspectId) {
    throw createError({ statusCode: 400, message: 'Missing questions, answers, or aspectId' });
  }

  let correctCount = 0;
  const masteryResults: { kcId: string, isCorrect: boolean }[] = [];

  questions.forEach((q: any, index: number) => {
    const isCorrect = answers[index] === q.correctAnswerIndex;
    if (isCorrect) {
      correctCount++;
    }
    // We assume each question maps to the first KC for simplicity. 
    // A more advanced version would link questions to specific KCs.
    const kcId = tijdvakken.flatMap(t => t.aspecten).find(a => a.id === aspectId)?.knowledgeComponents?.[index]?.id;
    if (kcId) {
        masteryResults.push({ kcId, isCorrect });
    }
  });

  const score = correctCount / questions.length;
  let tier = 'Beginner';
  if (score >= 0.7) {
    tier = 'Advanced';
  } else if (score >= 0.4) {
    tier = 'Intermediate';
  }

  // Calculate the initial BKT state based on the results
  const updatedStudentState = calculateInitialMastery(aspectId, masteryResults);

  return {
    correctCount,
    totalQuestions: questions.length,
    score,
    tier,
    updatedStudentState,
  };
});