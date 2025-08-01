export type QuizAction =
  | { type: "SELECT_OPTION", optionIndex: number }
  | { type: "NEXT_QUESTION" }
  | { type: "RESTART_QUIZ" }
  | { type: "FINISH_QUIZ" };

export interface QuizState {
  currentQuestion: number;
  selectedOption: number | null;
  userAnswers: number[];
  endGame: boolean;
}

export default function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SELECT_OPTION":
      return {
        ...state,
        selectedOption: action.optionIndex
      }
    case "NEXT_QUESTION":
      return {
        currentQuestion: state.currentQuestion + 1,
        selectedOption: null,
        userAnswers: [...state.userAnswers, state.selectedOption!],
        endGame: false
      }
    case "RESTART_QUIZ":
      return {
        currentQuestion: 0,
        selectedOption: null,
        userAnswers: [],
        endGame: false
      }
    case "FINISH_QUIZ":
      return {
        currentQuestion: 0,
        selectedOption: null,
        userAnswers: [...state.userAnswers, state.selectedOption!],
        endGame: true
      }
    default:
      return state;
  }
}