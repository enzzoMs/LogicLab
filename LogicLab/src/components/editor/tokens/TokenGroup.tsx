import {type BooleanToken, tokenToString} from "@engine/parser/AST";
import styles from "@components/editor/tokens/TokenGroup.module.css";

interface TokenGroupProps {
  groupName: string;
  tokens: BooleanToken[];
  onTokenClicked: (token: BooleanToken) => void;
  btnStyle: "outline" | "secondary";
}

export default function TokenGroup({ groupName, tokens, onTokenClicked, btnStyle }: TokenGroupProps) {
  return (
    <div>
      <h2 className={styles.groupTitle}>{groupName}</h2>
      <div className={styles.groupContainer}>
        {tokens.map((token) => (
          <button
            key={token}
            className={getTokenStyle(token, btnStyle)}
            onClick={() => onTokenClicked(token)}>
            {tokenToString(token)}
          </button>
        ))}
      </div>
    </div>
  )
}

function getTokenStyle(token: BooleanToken, btnStyle: "outline" | "secondary"): string {
  if (token === "IMPLICATION" || token === "EQUIVALENCE") {
    return `btn-${btnStyle} btn-small ${styles.monospaceToken}`;
  } else {
    return `btn-${btnStyle} btn-small`;
  }
}