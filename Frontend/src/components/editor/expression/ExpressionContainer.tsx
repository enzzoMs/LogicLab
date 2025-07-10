import type {BooleanToken} from "@engine/parser/AST";
import {RotateCcw, Trash2} from "lucide-react";
import styles from "@components/editor/expression/ExpressionContainer.module.css";

interface ExpressionContainerProps {
  tokens: BooleanToken[];
  onUndoClicked: () => void;
  onClearClicked: () => void;
  errorMsg: string | null;
}

export default function ExpressionContainer(props: ExpressionContainerProps) {
  const { tokens, onUndoClicked, onClearClicked, errorMsg } = props;

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.containerHeader}>
        <h2>Current Expression</h2>
        <button className="btn-ghost btn-small" onClick={onUndoClicked}>
          <RotateCcw /> Undo
        </button>
        <button className="btn-ghost btn-small" onClick={onClearClicked}>
          <Trash2 /> Clear
        </button>
      </div>
      <div className={styles.expressionContainer}>
        {tokens.length === 0 && (
          <p className={styles.hint}>
            Use the buttons below to build your expression...
          </p>
        )}

        {tokens.map((token, index) => (
          <span
            key={`${token}-${index}`}
            className={styles.token}>
            {token}
          </span>
        ))}
      </div>

      {errorMsg && (
        <p className={styles.error}>{errorMsg}</p>
      )}
    </div>
  )
}