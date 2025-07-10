import {useState} from "react";
import type {EvaluationResult} from "@engine/evaluator/BooleanEvaluator";
import styles from "@components/editor/evaluation/EvaluationDisplay.module.css";

interface ExpressionEvaluationProps {
  evaluationResult: EvaluationResult;
}

export default function EvaluationDisplay({ evaluationResult }: ExpressionEvaluationProps) {
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className={styles.displayContainer}>
      <div className={styles.evaluationHeader}>
        <h2>Evaluation Result</h2>
        <input
          id="show-steps"
          type="checkbox"
          checked={showSteps}
          onChange={() => setShowSteps(!showSteps)}/>
        <label htmlFor="show-steps">Show Steps</label>
      </div>

      {showSteps && (
        <div className={styles.stepsList}>
          {evaluationResult.steps.map((step, index) => (
            <div key={step} className={styles.stepContainer}>
              <p>Step {index + 1}:</p>
              <p className={styles.step}>{step}</p>
            </div>
          ))}
        </div>
      )}
      <p className={evaluationResult.result ? styles.trueResult : styles.falseResult}>
        {evaluationResult.result ? "True" : "False"}
      </p>
    </div>
  )
}