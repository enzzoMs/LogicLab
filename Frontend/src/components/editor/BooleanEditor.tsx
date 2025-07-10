import {useReducer} from "react";
import {Play, Table} from "lucide-react";
import type {BooleanToken} from "@engine/parser/AST";
import expressionReducer, {type ExpressionState} from "@components/editor/ExpressionReducer";
import TokenGroup from "@components/editor/tokens/TokenGroup";
import ExpressionContainer from "@components/editor/expression/ExpressionContainer";
import ExpressionContext from "@components/editor/expression/ExpressionContext";
import EvaluationDisplay from "@components/editor/evaluation/EvaluationDisplay";
import TruthTableDisplay from "@components/editor/truth-table/TruthTableDisplay";
import styles from "@components/editor/BooleanEditor.module.css";

const initialExpState: ExpressionState = {
  tokens: [],
  context: {},
  errorMsg: null,
  evaluationResult: null,
  truthTable: null
}

export default function BooleanEditor() {
  const [expression, dispatch] = useReducer(expressionReducer, initialExpState);

  const addToken = (token: BooleanToken) => dispatch({ type: "ADD_TOKEN", token });

  return (
    <>
      <div className={styles.editorContainer}>
        <ExpressionContainer
          tokens={expression.tokens}
          onUndoClicked={() => dispatch({ type: "UNDO" })}
          onClearClicked={() => dispatch({ type: "CLEAR" })}
          errorMsg={expression.errorMsg} />

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

        {expressionHasVariables(expression) && (
          <ExpressionContext
            context={expression.context}
            onToggleVariable={(variable) => dispatch({ type: "TOGGLE_VARIABLE_VALUE", variable })}/>
        )}

        <div className={styles.editorButtons}>
          <button className="btn-primary" onClick={() => dispatch({ type: "EVALUATE" })}>
            <Play /> Evaluate
          </button>
          <button className="btn-secondary" onClick={() => dispatch({ type: "GEN_TRUTH_TABLE" })}>
            <Table /> Truth Table
          </button>
        </div>
      </div>

      {expression.evaluationResult !== null && (
        <EvaluationDisplay evaluationResult={expression.evaluationResult} />
      )}
      {expression.truthTable !== null && (
        <TruthTableDisplay truthTable={expression.truthTable} />
      )}
    </>
  )
}

function expressionHasVariables(expression: ExpressionState) {
  return Object.entries(expression.context).length > 0;
}