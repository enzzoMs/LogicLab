import type {BooleanToken, Variable} from "@engine/parser/AST.ts";
import {EvaluationError, type EvaluationResult, type VariableContext} from "@engine/evaluator/BooleanEvaluator.ts";
import {ParsingError} from "@engine/parser/BooleanParser.ts";
import BooleanEngine from "@engine/BooleanEngine.ts";
import {type TruthTable, TruthTableError} from "@engine/table-generator/TruthTableGenerator.ts";

type ExpressionAction =
  | { type: "ADD_TOKEN"; token: BooleanToken }
  | { type: "UNDO" }
  | { type: "CLEAR" }
  | { type: "TOGGLE_VARIABLE_VALUE"; variable: Variable }
  | { type: "EVALUATE" }
  | { type: "GEN_TRUTH_TABLE" };

export interface ExpressionState {
  tokens: BooleanToken[];
  context: VariableContext;
  errorMsg: string | null;
  evaluationResult: EvaluationResult | null;
  truthTable: TruthTable | null;
}

const booleanEngine = new BooleanEngine();
const MAX_TOKENS = 50;

export default function expressionReducer(state: ExpressionState, action: ExpressionAction) {
  switch (action.type) {
    case "ADD_TOKEN": {
      if (state.tokens.length >= MAX_TOKENS) {
        return {
          ...state,
          errorMsg: `[ERROR] Expression cannot have more than ${MAX_TOKENS} tokens.`
        }
      }

      const newToken = action.token;
      const newContext = { ...state.context };

      if (isVariable(newToken) && newContext[newToken] === undefined) {
        newContext[newToken] = false;
      }
      return {
        tokens: [...state.tokens, newToken],
        context: newContext,
        errorMsg: null,
        evaluationResult: null,
        truthTable: null
      };
    }
    case "UNDO": {
      const lastToken = state.tokens[state.tokens.length - 1];
      const remainingTokens = state.tokens.slice(0, -1);

      const newContext = { ...state.context };
      
      if (isVariable(lastToken) && countVariableOccurrences(remainingTokens, lastToken) === 0) {
        newContext[lastToken] = undefined;
      }
      return {
        tokens: remainingTokens,
        context: newContext,
        errorMsg: null,
        evaluationResult: null,
        truthTable: null
      };
    }
    case "CLEAR":
      return {
        tokens: [],
        context: {},
        errorMsg: null,
        evaluationResult: null,
        truthTable: null
      };
    case "TOGGLE_VARIABLE_VALUE": {
      const newContext = { ...state.context };
      if (newContext[action.variable] !== undefined) {
        newContext[action.variable] = !newContext[action.variable];
      }

      return {
        ...state,
        context: newContext
      };
    }
    case "EVALUATE":
    case "GEN_TRUTH_TABLE":
      try {
        booleanEngine.parse(state.tokens);
        let evaluation: EvaluationResult | null;
        let truthTable: TruthTable | null;

        if (action.type === "EVALUATE") {
          evaluation = booleanEngine.evaluate(state.context);
          truthTable = null;
        } else {
          evaluation = null;
          truthTable = booleanEngine.generateTruthTable();
        }

        return {
          ...state,
          errorMsg: null,
          truthTable: truthTable,
          evaluationResult: evaluation
        };
      } catch (e) {
        if (e instanceof ParsingError) {
          return {
            ...state,
            evaluationResult: null,
            truthTable: null,
            errorMsg: `[ERROR] - ${e.message} at position ${e.tokenIndex + 1}.`,
          };
        }
        if (e instanceof EvaluationError || e instanceof TruthTableError) {
          return {
            ...state,
            evaluationResult: null,
            truthTable: null,
            errorMsg: `[ERROR] - ${e.message}.`,
          }
        }
        throw e;
      }
    default:
      return state;
  }
}

function isVariable(token: BooleanToken): token is Variable {
  return ["A", "B", "C", "D", "E", "F"].includes(token);
}

function countVariableOccurrences(tokens: BooleanToken[], variable: Variable) {
  return tokens.filter(token => token === variable).length;
}