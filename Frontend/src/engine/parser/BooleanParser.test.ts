import {beforeEach, describe, expect, test} from "vitest";
import {BooleanParser, ParsingError} from "./BooleanParser.ts";
import type {AST, ASTNode, BooleanToken} from "./AST.ts";

describe("BooleanParser", () => {
  let booleanParser: BooleanParser;

  beforeEach(() => {
    booleanParser = new BooleanParser();
  })

  test.for([
    ["TRUE", { type: "Literal", value: true }],
    ["FALSE", { type: "Literal", value: false }],
    ["A", { type: "Variable", value: "A" }],
    ["B", { type: "Variable", value: "B" }],
    ["C", { type: "Variable", value: "C" }],
    ["D", { type: "Variable", value: "D" }],
    ["E", { type: "Variable", value: "E" }],
    ["F", { type: "Variable", value: "F" }],
    ["A", { type: "Variable", value: "A" }],
    ["NOT A", { type: "Unary", operator: "NOT", innerNode: { type: "Variable", value: "A" } }],
    ["A AND B", { type: "Binary", left: { type: "Variable", value: "A" }, operator: "AND", right: { type: "Variable", value: "B" } }],
    ["A NOR B", { type: "Binary", left: { type: "Variable", value: "A" }, operator: "NOR", right: { type: "Variable", value: "B" } }],
    ["A OR B", { type: "Binary", left: { type: "Variable", value: "A" }, operator: "OR", right: { type: "Variable", value: "B" } }],
    ["A XOR B", { type: "Binary", left: { type: "Variable", value: "A" }, operator: "XOR", right: { type: "Variable", value: "B" } }],
    ["A NAND B", { type: "Binary", left: { type: "Variable", value: "A" }, operator: "NAND", right: { type: "Variable", value: "B" } }],
    ["( A AND B )", { type: "Parenthesized", innerNode: { type: "Binary", left: { type: "Variable", value: "A" }, operator: "AND", right: { type: "Variable", value: "B" } } }]
  ])("should correctly parse simple expression '%s'", ([expression, expectedNode]) => {
    const expressionTokens = (expression as string).split(" ") as BooleanToken[];
    const expectedAST: AST = { root: expectedNode as ASTNode };

    const result = booleanParser.parse(expressionTokens);
    expect(result).toEqual(expectedAST);
  })

  test.for([
    [
      "NOT ( A AND B )",
      {
        type: "Unary",
        operator: "NOT",
        innerNode: {
          type: "Parenthesized",
          innerNode: {
            type: "Binary",
            left: { type: "Variable", value: "A" },
            operator: "AND",
            right: { type: "Variable", value: "B" },
          },
        },
      },
    ],
    [
      "( A OR B ) AND C",
      {
        type: "Binary",
        left: {
          type: "Parenthesized",
          innerNode: {
            type: "Binary",
            left: { type: "Variable", value: "A" },
            operator: "OR",
            right: { type: "Variable", value: "B" },
          },
        },
        operator: "AND",
        right: { type: "Variable", value: "C" },
      },
    ],
    [
      "NOT ( A AND B ) OR C",
      {
        type: "Binary",
        left: {
          type: "Unary",
          operator: "NOT",
          innerNode: {
            type: "Parenthesized",
            innerNode: {
              type: "Binary",
              left: { type: "Variable", value: "A" },
              operator: "AND",
              right: { type: "Variable", value: "B" },
            },
          },
        },
        operator: "OR",
        right: { type: "Variable", value: "C" },
      },
    ],
  ])("should correctly parse complex expression '%s'", ([expression, expectedNode]) => {
    const expressionTokens = (expression as string).split(" ") as BooleanToken[];
    const expectedAST: AST = { root: expectedNode as ASTNode };

    const result = booleanParser.parse(expressionTokens);
    expect(result).toEqual(expectedAST);
  });

  test("should throw error if operator is missing", () => {
    const expressionTokens: BooleanToken[] = ["A", "B"];
    expect(() => booleanParser.parse(expressionTokens)).toThrowError(
      new ParsingError("Unexpected token", 1)
    );
  })

  test("should throw error if operand is missing", () => {
    const expressionTokens: BooleanToken[] = ["A", "AND"];
    expect(() => booleanParser.parse(expressionTokens)).toThrowError(
      new ParsingError(
        "Expected a boolean value (TRUE / FALSE) or a variable", 2
      )
    );
  })

  test("should throw error if parenthesis is missing", () => {
    const expressionTokens: BooleanToken[] = ["(", "A", "AND", "B"];
    expect(() => booleanParser.parse(expressionTokens)).toThrowError(
      new ParsingError("Expected a closing parenthesis ')'", 4)
    );
  })
})