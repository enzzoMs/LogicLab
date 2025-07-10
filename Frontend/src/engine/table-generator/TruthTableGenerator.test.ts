import { describe, it, expect } from "vitest";
import { generateTruthTableFromAst } from "./TruthTableGenerator.ts";
import BooleanEvaluator from "../evaluator/BooleanEvaluator";
import type { AST } from "../parser/AST";

describe("generateTruthTableFromAst", () => {
  const evaluator = new BooleanEvaluator();

  it("should generate a truth table for an expression with one variable", () => {
    const ast: AST = {
      root: { type: "Variable", value: "A" },
      usedVariables: ["A"]
    };

    const truthTable = generateTruthTableFromAst(ast, evaluator);

    expect(truthTable.variables).toEqual(["A"]);
    expect(truthTable.rows).toEqual([
      { variableValues: [false], result: false },
      { variableValues: [true], result: true }
    ]);
  });

  it("should generate a truth table for an expression with two variables", () => {
    const ast: AST = {
      root: {
        type: "Binary",
        operator: "AND",
        left: { type: "Variable", value: "A" },
        right: { type: "Variable", value: "B" },
      },
      usedVariables: ["A", "B"]
    };

    const truthTable = generateTruthTableFromAst(ast, evaluator);

    expect(truthTable.variables).toEqual(["A", "B"]);
    expect(truthTable.rows).toEqual([
      { variableValues: [false, false], result: false },
      { variableValues: [false, true], result: false },
      { variableValues: [true, false], result: false },
      { variableValues: [true, true], result: true }
    ]);
  });

  it("should generate a truth table for a complex expression", () => {
    const ast: AST = {
      root: {
        type: "Unary",
        operator: "NOT",
        innerNode: {
          type: "Binary",
          operator: "AND",
          left: { type: "Variable", value: "A" },
          right: { type: "Variable", value: "B" },
        }
      },
      usedVariables: ["A", "B"]
    };

    const truthTable = generateTruthTableFromAst(ast, evaluator);

    expect(truthTable.variables).toEqual(["A", "B"]);
    expect(truthTable.rows).toEqual([
      { variableValues: [false, false], result: true },
      { variableValues: [false, true], result: true },
      { variableValues: [true, false], result: true },
      { variableValues: [true, true], result: false }
    ]);
  });

  it("should sort variables alphabetically", () => {
    const ast: AST = {
      root: {
        type: "Binary",
        operator: "OR",
        left: { type: "Variable", value: "F" },
        right: { type: "Variable", value: "A" },
      },
      usedVariables: ["F", "A"]
    };

    const truthTable = generateTruthTableFromAst(ast, evaluator);

    expect(truthTable.variables).toEqual(["A", "F"]);
    expect(truthTable.rows[0].variableValues).toHaveLength(2);
  });
});