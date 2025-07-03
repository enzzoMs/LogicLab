import type {BooleanToken, Variable} from "@engine/parser/AST.ts";
import {EvaluationError, type VariableContext} from "@engine/evaluator/BooleanEvaluator.ts";
import {ParsingError} from "@engine/parser/BooleanParser.ts";
import BooleanEngine from "@engine/BooleanEngine.ts";

type ExpressionAction =
  | { type: "ADD_TOKEN"; token: BooleanToken }
  | { type: "EVALUATE" }
  | { type: "UNDO" }
  | { type: "CLEAR" }
  | { type: "TOGGLE_VARIABLE_VALUE"; variable: Variable };

export interface ExpressionState {
  tokens: BooleanToken[];
  context: VariableContext;
  errorMsg: string | null;
  result: boolean | null;
}

const booleanEngine = new BooleanEngine();

export default function expressionReducer(state: ExpressionState, action: ExpressionAction) {
  switch (action.type) {
    case "ADD_TOKEN": {
      const newToken = action.token;
      const newContext = { ...state.context };

      if (isVariable(newToken) && newContext[newToken] === null) {
        newContext[newToken] = false;
      }
      return {
        tokens: [...state.tokens, newToken],
        context: newContext,
        errorMsg: null,
        result: null
      };
    }
    case "EVALUATE":
      try {
        booleanEngine.parse(state.tokens);
        const result = booleanEngine.evaluate(state.context);
        return {
          ...state,
          errorMsg: null ,
          result: result
        };
      } catch (e) {
        if (e instanceof ParsingError) {
          return {
            ...state,
            errorMsg: `[ERROR] - ${e.message} at position ${e.tokenIndex + 1}.`,
          };
        }
        if (e instanceof EvaluationError) {
          return {
            ...state,
            errorMsg: `[ERROR] - ${e.message}.`,
          }
        }
        throw e;
      }
    case "UNDO": {
      const lastToken = state.tokens[state.tokens.length - 1];
      const remainingTokens = state.tokens.slice(0, -1);

      const newContext = { ...state.context };
      
      if (isVariable(lastToken) && countVariableOccurrences(remainingTokens, lastToken) === 0) {
        newContext[lastToken] = null;
      }
      return {
        tokens: remainingTokens,
        context: newContext,
        errorMsg: null,
        result: null
      };
    }
    case "CLEAR":
      return {
        tokens: [],
        context: {
          "A": null, "B": null,
          "C": null, "D": null,
          "E": null, "F": null
        },
        errorMsg: null,
        result: null
      };
    case "TOGGLE_VARIABLE_VALUE": {
      const newContext = { ...state.context };
      newContext[action.variable] = !newContext[action.variable];

      return {
        ...state,
        context: newContext
      };
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