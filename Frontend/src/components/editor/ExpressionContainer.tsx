import type {BooleanToken} from "@parser/AST";
import styles from "@components/editor/ExpressionContainer.module.css";

interface ExpressionContainerProps {
  tokens: BooleanToken[];
  errorMsg: string | null;
}

export default function ExpressionContainer({ tokens, errorMsg }: ExpressionContainerProps) {
  return (
    <div className={styles.containerWrapper}>
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