import {useReducer} from "react";
import {Play, RotateCcw, Trash2} from "lucide-react";
import type {BooleanToken} from "@parser/AST";
import expressionReducer, {type ExpressionState} from "@components/editor/ExpressionReducer";
import TokenGroup from "@components/editor/tokens/TokenGroup";
import ExpressionContainer from "@components/editor/expression/ExpressionContainer";
import ExpressionContext, {type VariableContext} from "@components/editor/expression/ExpressionContext";
import styles from "@components/editor/BooleanEditor.module.css";

const initialExpState: ExpressionState = {
  tokens: [],
  context: {
    "A": null, "B": null,
    "C": null, "D": null,
    "E": null, "F": null
  },
  errorMsg: null
}

export default function BooleanEditor() {
  const [expression, dispatch] = useReducer(expressionReducer, initialExpState);

  const addToken = (token: BooleanToken) => dispatch({ type: "ADD_TOKEN", token });

  return (
    <div className={styles.editorContainer}>
      <ExpressionContainer tokens={expression.tokens} errorMsg={expression.errorMsg} />

      <TokenGroup
        groupName="Variables"
        tokens={["A", "B", "C", "D", "E", "F"]}
        tokenStyle="outline"
        onTokenClicked={addToken} />
      <TokenGroup
        groupName="Operators"
        tokens={["AND", "OR", "NOT", "XOR", "NAND", "NOR"]}
        tokenStyle="secondary"
        onTokenClicked={addToken} />
      <TokenGroup
        groupName="Parentheses"
        tokens={["(", ")"]}
        tokenStyle="outline"
        onTokenClicked={addToken} />

      {expressionHasVariables(expression.context) && (
        <ExpressionContext
          context={expression.context}
          onToggleVariable={(variable) => dispatch({ type: "TOGGLE_VARIABLE_VALUE", variable })}/>
      )}

      <div className={styles.editorButtons}>
        <button className="btn-primary" onClick={() => dispatch({ type: "EVALUATE" })}>
          <Play /> Evaluate
        </button>
        <button className="btn-outline" onClick={() => dispatch({ type: "UNDO" })}>
          <RotateCcw /> Undo
        </button>
        <button className="btn-outline" onClick={() => dispatch({ type: "CLEAR" })}>
          <Trash2 /> Clear
        </button>
      </div>
    </div>
  )
}

function expressionHasVariables(context: VariableContext) {
  for (const variable in context) {
    if (context[variable as keyof VariableContext] !== null) {
      return true;
    }
  }
  return false;
}