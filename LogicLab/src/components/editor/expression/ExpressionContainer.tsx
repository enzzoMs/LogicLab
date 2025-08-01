import {Info, RotateCcw, Trash2} from "lucide-react";
import type {BooleanToken} from "@engine/parser/AST";
import {tokenToString} from "@engine/parser/AST";
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
        <h2>
          Current Expression
          <span className={styles.precedenceTooltip}
            title="Precende Order:&#013;( ), NOT, NAND, AND,&#013;NOR, XOR, OR,&#013;->, <=>">
            <Info />
          </span>
        </h2>
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
            className={getTokenStyle(token)}>
            {tokenToString(token)}
          </span>
        ))}
      </div>

      {errorMsg && (
        <p className={styles.error}>{errorMsg}</p>
      )}
    </div>
  )
}

function getTokenStyle(token: BooleanToken) {
  if (token === "IMPLICATION" || token === "EQUIVALENCE") {
    return styles.monospaceToken;
  } else {
    return styles.token;
  }
}