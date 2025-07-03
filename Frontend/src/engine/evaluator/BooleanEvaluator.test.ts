import {beforeEach, describe, expect, test} from "vitest";
import BooleanEvaluator, {EvaluationError, type VariableContext} from "./BooleanEvaluator.ts";
import type {AST, ASTNode, BinaryOperator} from "../parser/AST.ts";

describe("BooleanEvaluator", () => {
  let booleanEvaluator: BooleanEvaluator;

  beforeEach(() => {
    booleanEvaluator = new BooleanEvaluator();
  })

  test.for([
    [{ type: "Literal", value: true }, {}, true],
    [{ type: "Literal", value: false }, {}, false],
    [{ type: "Variable", value: "A" }, { A: true }, true],
    [{ type: "Variable", value: "B" }, { B: false }, false],
    [
      { type: "Unary", operator: "NOT", innerNode: { type: "Variable", value: "A" } },
      { A: true },
      false
    ],
    [
      { type: "Binary", left: { type: "Variable", value: "A" }, operator: "AND", right: { type: "Variable", value: "B" } },
      { A: true, B: true },
      true
    ],
    [
      { type: "Binary", left: { type: "Variable", value: "A" }, operator: "OR", right: { type: "Variable", value: "B" } },
      { A: false, B: true },
      true
    ],
    [
      { type: "Binary", left: { type: "Variable", value: "A" }, operator: "XOR", right: { type: "Variable", value: "B" } },
      { A: true, B: true },
      false
    ],
    [
      { type: "Binary", left: { type: "Variable", value: "A" }, operator: "NAND", right: { type: "Variable", value: "B" } },
      { A: true, B: true },
      false
    ],
    [
      { type: "Binary", left: { type: "Variable", value: "A" }, operator: "NOR", right: { type: "Variable", value: "B" } },
      { A: false, B: false },
      true
    ]
  ])("should correctly evaluate simple expression", ([node, context, expectedValue]) => {
    const ast = { root: node as ASTNode };
    const result = booleanEvaluator.evaluate(ast, context as VariableContext);
    expect(result).toBe(expectedValue);
  });

  test.for([
    [
      {
        type: "Unary",
        operator: "NOT",
        innerNode: {
          type: "Parenthesized",
          innerNode: {
            type: "Binary",
            left: { type: "Variable", value: "A" },
            operator: "AND",
            right: { type: "Variable", value: "B" }
          }
        }
      },
      { A: true, B: false },
      true
    ],
    [
      {
        type: "Binary",
        left: {
          type: "Binary",
          left: { type: "Variable", value: "A" },
          operator: "OR",
          right: { type: "Variable", value: "B" }
        },
        operator: "AND",
        right: { type: "Variable", value: "C" }
      },
      { A: true, B: false, C: true },
      true
    ]
  ])("should correctly evaluate complex expression", ([node, context, expectedValue]) => {
    const ast = { root: node as ASTNode };
    const result = booleanEvaluator.evaluate(ast, context as VariableContext);
    expect(result).toBe(expectedValue);
  });

  test("should throw error when variable does not have a defined value", () => {
    const ast: AST = {
      root: { type: "Variable", value: "A" }
    };
    const context: VariableContext = {
      "A": null, "B": null, "C": null, "D": null, "E": null, "F": null
    }
    expect(() => booleanEvaluator.evaluate(ast, context)).toThrowError(
      new EvaluationError("Variable A does not have a defined value.")
    );
  });

  test("should throw error for unknown operator", () => {
    const ast: AST = {
      root: {
        type: "Binary",
        left: { type: "Variable", value: "A" },
        operator: "UNKNOWN" as BinaryOperator,
        right: { type: "Variable", value: "A" }
      }
    };
    const context: VariableContext = {
      "A": true, "B": null, "C": null, "D": null, "E": null, "F": null
    }

    expect(() => booleanEvaluator.evaluate(ast, context)).toThrowError(
      new EvaluationError("Unknown operator: Binary")
    );
  });
});