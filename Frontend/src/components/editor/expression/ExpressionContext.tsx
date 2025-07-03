import type {Variable} from "@engine/parser/AST.ts";
import type { VariableContext } from "@engine/evaluator/BooleanEvaluator";
import styles from "@components/editor/expression/ExpressionContext.module.css";

interface ExpressionContextProps {
  context: VariableContext;
  onToggleVariable: (variable: Variable) => void;
}

export default function ExpressionContext({ context, onToggleVariable }: ExpressionContextProps) {
  return (
    <>
      <h2 className={styles.title}>Variable Values</h2>
      <div className={styles.variableContainer}>
        {Object.entries(context).map(([variable, value]) => (
          (value !== null) && (
            <div
              key={variable}
              className={styles.variable}>
              <p>{variable}</p>
              <p>=</p>
              <button
                className={`${value ? "btn-primary" : "btn-outline"} btn-small`}
                onClick={() => onToggleVariable(variable as Variable)}>
                {value ? "True" : "False"}
              </button>
            </div>
          )
        ))}
      </div>
    </>
  )
}