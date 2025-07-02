import type {BooleanToken} from "@parser/AST";
import styles from "@components/editor/tokens/TokenGroup.module.css";

interface TokenGroupProps {
  groupName: string;
  tokens: BooleanToken[];
  onTokenClicked: (token: BooleanToken) => void;
  tokenStyle: "outline" | "secondary";
}
export default function TokenGroup({ groupName, tokens, onTokenClicked, tokenStyle }: TokenGroupProps) {
  return (
    <>
      <h4 className={styles.groupTitle}>{groupName}</h4>
      <div className={styles.groupContainer}>
        {tokens.map((token, index) => (
          <button
            key={`${index}-${token}`}
            className={`btn-${tokenStyle} btn-small`}
            onClick={() => onTokenClicked(token)}>
            {token}
          </button>
        ))}
      </div>
    </>
  )
}