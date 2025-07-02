import type {Variable} from "@parser/AST";
import styles from "@components/editor/expression/ExpressionContext.module.css";

export type VariableContext = Record<Variable, boolean | null>;

interface ExpressionContextProps {
  context: VariableContext;
  onToggleVariable: (variable: Variable) => void;
}

export default function ExpressionContext({ context, onToggleVariable }: ExpressionContextProps) {
  return (
    <>
      <h4 className={styles.title}>Variable Values</h4>
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