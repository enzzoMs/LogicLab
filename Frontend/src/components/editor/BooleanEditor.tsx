import { useState} from "react";
import {Play, RotateCcw, Trash2} from "lucide-react";
import type {BooleanToken} from "@parser/AST";
import {BooleanParser} from "@parser/BooleanParser";
import {ParsingError} from "@parser/BooleanParser";
import TokenGroup from "@components/editor/TokenGroup";
import ExpressionContainer from "@components/editor/ExpressionContainer";
import styles from "@components/editor/BooleanEditor.module.css";

const booleanParser = new BooleanParser();

export default function BooleanEditor() {
  const [expTokens, setExpTokens] = useState<BooleanToken[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addToken = (token: BooleanToken) => {
    setExpTokens([...expTokens, token]);
    setErrorMsg(null);
  }

  const replaceTokens = (tokens: BooleanToken[]) => {
    setExpTokens(tokens);
    setErrorMsg(null);
  }

  const evaluateExpression = () => {
    try {
      booleanParser.parse(expTokens);
      setErrorMsg(null);
    } catch (e) {
      if (e instanceof ParsingError) {
        setErrorMsg(`[ERROR] - ${e.message} at position ${e.tokenIndex + 1}.`);
      } else {
        throw e;
      }
    }
  }

  return (
    <div className={styles.editorContainer}>
      <ExpressionContainer tokens={expTokens} errorMsg={errorMsg} />

      <TokenGroup
        group="Variables"
        tokens={["A", "B", "C", "D", "E", "F"]}
        onTokenClicked={addToken}/>
      <TokenGroup
        group="Operators"
        tokens={["AND", "OR", "NOT", "XOR", "NAND", "NOR"]}
        onTokenClicked={addToken}/>
      <TokenGroup
        group="Parentheses"
        tokens={["(", ")"]}
        onTokenClicked={addToken}/>

      <div className={styles.editorButtons}>
        <button className="btn-primary" onClick={evaluateExpression}>
          <Play /> Evaluate
        </button>
        <button className="btn-outline" onClick={() => replaceTokens([...expTokens.slice(0, -1)])}>
          <RotateCcw /> Undo
        </button>
        <button className="btn-outline" onClick={() => replaceTokens([])}>
          <Trash2 /> Clear
        </button>
      </div>
    </div>
  )
}