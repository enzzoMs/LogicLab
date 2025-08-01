import {Clock, RotateCcw, Trophy} from "lucide-react";
import {useReducer} from "react";
import quizReducer, {type QuizState} from "@components/quizzes/QuizzReducer";
import styles from "@components/quizzes/QuizDisplay.module.css";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctOption: number;
}

export interface QuizProps {
  title: string;
  minutesDuration: number;
  questions: QuizQuestion[];
}

const initialState: QuizState = {
  currentQuestion: 0,
  selectedOption: null,
  userAnswers: [],
  endGame: false
}

export default function QuizDisplay({ title, minutesDuration, questions }: QuizProps) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const isLastQuestion = state.currentQuestion === questions.length - 1;

  return (
    <section className={styles.quizWrapper}>
      {state.endGame ?
        (
          <QuizEndGame
            questions={questions}
            userAnswers={state.userAnswers}
            onRestartQuiz={() => dispatch({ type: "RESTART_QUIZ" })}/>
        ) :
        (
          <>
            <QuizHeader
              title={title}
              minutesDuration={minutesDuration}
              numOfQuestions={questions.length}
              currentQuestion={state.currentQuestion}
              onRestartQuiz={() => dispatch({ type: "RESTART_QUIZ" })}/>
            <QuizQuestion
              quizQuestion={questions[state.currentQuestion]}
              selectedOption={state.selectedOption}
              onSelectOption={(index) => dispatch({ type: "SELECT_OPTION", optionIndex: index})}/>
            <button
              className={`btn-primary ${styles.questionButton}`}
              disabled={state.selectedOption === null}
              onClick={() => dispatch({ type: isLastQuestion ? "FINISH_QUIZ" : "NEXT_QUESTION" })}>
              {isLastQuestion ? "Finish Quiz" : "Next Question"}
            </button>
          </>
        )
      }
    </section>
  )
}

interface QuizHeaderProps {
  title: string;
  minutesDuration: number;
  numOfQuestions: number;
  currentQuestion: number;
  onRestartQuiz: () => void;
}
function QuizHeader({ title, minutesDuration, numOfQuestions, currentQuestion, onRestartQuiz }: QuizHeaderProps) {
  const completionPercentage = Math.floor((currentQuestion / numOfQuestions) * 100);

  return (
    <>
      <div className={styles.quizHeader}>
        <h1>{title}</h1>
        <div className={styles.quizDuration}>
          <Clock/> {minutesDuration} min
        </div>
        <button className="btn-outline btn-small" onClick={onRestartQuiz}>
          <RotateCcw /> Restart
        </button>
      </div>
      <div className={styles.quizProgressHeader}>
        <p>Question {currentQuestion + 1} of {numOfQuestions}</p>
        <p>{completionPercentage}% Complete</p>
      </div>
      <div className={styles.progressBarTrack}>
        <div className={styles.progressBarValue} style={{ width: `${completionPercentage}%` }}></div>
      </div>
    </>
  )
}

interface QuizQuestionProps {
  quizQuestion: QuizQuestion;
  selectedOption: number | null;
  onSelectOption: (option: number) => void;
}
function QuizQuestion({ quizQuestion, selectedOption, onSelectOption }: QuizQuestionProps) {
  return (
    <div className={styles.questionContainer}>
      <h2>{quizQuestion.question}</h2>
      {quizQuestion.options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelectOption(index)}
          className={index === selectedOption ? styles.selectedOption : styles.option}>
          <span className={styles.optionIndicator}></span>{option}
        </button>
      ))}
    </div>
  )
}

interface QuizEndGameProps {
  questions: QuizQuestion[];
  userAnswers: number[];
  onRestartQuiz: () => void;
}
function QuizEndGame({ questions, userAnswers, onRestartQuiz }: QuizEndGameProps) {
  const correctAnswers = userAnswers.filter((userAnswer, index) => {
    return questions[index].correctOption === userAnswer;
  }).length;

  const completionPercentage = Math.floor((correctAnswers / questions.length) * 100);

  return (
    <div className={styles.endGameContainer}>
      <Trophy />
      <h1>Quiz Complete!</h1>
      <p>Congratulations, you've finished the quiz.</p>
      <p className={styles.endScorePercentage}>{completionPercentage}%</p>
      <p>You got {correctAnswers} out of {questions.length} questions correct.</p>
      <div className={styles.endGameButtonsContainer}>
        <button className="btn-primary" onClick={onRestartQuiz}>Try Again</button>
        <a href="/LogicLab/quizzes" className="btn-outline">Back to Quizzes</a>
      </div>
    </div>
  )
}