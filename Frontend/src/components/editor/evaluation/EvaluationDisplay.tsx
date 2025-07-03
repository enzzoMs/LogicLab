import styles from "@components/editor/evaluation/EvaluationDisplay.module.css";
import {useState} from "react";

interface ExpressionEvaluationProps {
  evaluationSteps: string[];
}

export default function EvaluationDisplay({ evaluationSteps }: ExpressionEvaluationProps) {
  const [showSteps, setShowSteps] = useState(false);

  const finalResult = evaluationSteps[evaluationSteps.length - 1] === "TRUE";

  return (
    <div className={styles.evaluationContainer}>
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
          {evaluationSteps.map((step, index) => (
            <div key={step} className={styles.stepContainer}>
              <p>Step {index + 1}:</p>
              <p className={styles.step}>{step}</p>
            </div>
          ))}
        </div>
      )}
      <p className={finalResult ? styles.trueResult : styles.falseResult}>
        {finalResult ? "True" : "False"}
      </p>
    </div>
  )
}