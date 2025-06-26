import {useState} from "react";
import {RotateCcw, Trash2} from "lucide-react";
import styles from "./ExpressionEditor.module.css";

interface Token {
  value: string;
  group: "Variables" | "Operators" | "Parentheses";
}

export default function ExpressionEditor() {
  const [expTokens, setExpTokens] = useState<Token[]>([]);

  return (
    <div className={styles.editorContainer}>
      <div className={styles.expressionContainer}>
        {expTokens.length === 0 && (
          <p className={styles.hintToken}>
            Use the buttons below to build your expression...
          </p>
        )}

        {expTokens.map((token, index) => (
          <span
            key={`${token.value}-${index}`}
            className={token.group === "Operators" ? styles.operatorToken : styles.token}>
            {token.value}
          </span>
        ))}
      </div>

      <TokenGroup
        tokenGroup="Variables"
        tokens={["A", "B", "C", "D", "E", "F"]}
        tokenBtnStyle="btn-outline"
        onTokenClicked={
          (variable) => {setExpTokens([...expTokens, variable])}
        }/>
      <TokenGroup
        tokenGroup="Operators"
        tokens={["AND", "OR", "NOT", "XOR", "NAND", "NOR"]}
        tokenBtnStyle="btn-secondary"
        onTokenClicked={
          (operator) => {setExpTokens([...expTokens, operator])}
        }/>
      <TokenGroup
        tokenGroup="Parentheses"
        tokens={["(", ")"]}
        tokenBtnStyle="btn-outline"
        onTokenClicked={
          (parenthesis) => {setExpTokens([...expTokens, parenthesis])}
        }/>

      <div className={styles.editorButtons}>
        <button className="btn-outline" onClick={() => setExpTokens([...expTokens.slice(0, -1)])}>
          <RotateCcw /> Undo
        </button>
        <button className="btn-outline" onClick={() => setExpTokens([])}>
          <Trash2 /> Clear
        </button>
      </div>
    </div>
  )
}

interface TokenGroupProps {
  tokenGroup: "Variables" | "Operators" | "Parentheses";
  tokens: string[];
  onTokenClicked: (token: Token) => void;
  tokenBtnStyle: "btn-outline" | "btn-secondary"
}
function TokenGroup({ tokenGroup, tokens, onTokenClicked, tokenBtnStyle }: TokenGroupProps) {
  return (
    <>
      <h4>{tokenGroup}</h4>
      <div className={styles.tokensContainer}>
        {tokens.map((token) => (
          <button
            key={token}
            className={`${tokenBtnStyle} btn-small`}
            onClick={() => onTokenClicked({ value: token, group: tokenGroup})}>
            {token}
          </button>
        ))}
      </div>
    </>
  )
}