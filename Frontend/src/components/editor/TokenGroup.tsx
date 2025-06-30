import type {BooleanToken} from "../../parser/AST";
import styles from "./TokenGroup.module.css";

interface TokenGroupProps {
  group: "Variables" | "Operators" | "Parentheses";
  tokens: BooleanToken[];
  onTokenClicked: (token: BooleanToken) => void;
}
export default function TokenGroup({ group, tokens, onTokenClicked }: TokenGroupProps) {
  return (
    <>
      <h4 className={styles.groupTitle}>{group}</h4>
      <div className={styles.groupContainer}>
        {tokens.map((token, index) => (
          <button
            key={`${index}-${token}`}
            className={group === "Operators" ? "btn-secondary btn-small" : "btn-outline btn-small"}
            onClick={() => onTokenClicked(token)}>
            {token}
          </button>
        ))}
      </div>
    </>
  )
}