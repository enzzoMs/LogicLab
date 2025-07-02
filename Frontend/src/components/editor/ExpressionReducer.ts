import type {VariableContext} from "@components/editor/expression/ExpressionContext.tsx";
import type {BooleanToken, Variable} from "@parser/AST";
import {BooleanParser, ParsingError} from "@parser/BooleanParser";

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
}

const booleanParser = new BooleanParser();

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
        errorMsg: null
      };
    }
    case "EVALUATE":
      try {
        booleanParser.parse(state.tokens);
        return { ...state, errorMsg: null };
      } catch (e) {
        if (e instanceof ParsingError) {
          return {
            ...state,
            errorMsg: `[ERROR] - ${e.message} at position ${e.tokenIndex + 1}.`,
          };
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
        errorMsg: null
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
        errorMsg: null
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