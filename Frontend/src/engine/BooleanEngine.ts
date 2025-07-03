import {BooleanParser} from "@engine/parser/BooleanParser.ts";
import type {AST, BooleanToken} from "@engine/parser/AST.ts";
import {evaluate, type VariableContext} from "@engine/evaluator/BooleanEvaluator.ts";

/**
 * Handles boolean expressions processing, including parsing and evaluation.
 * Provides a unified interface for working with boolean logic operations.
 */
export default class BooleanEngine {
  private readonly parser = new BooleanParser();

  private ast: AST | null = null;

  /**
   * Parses a boolean expression from tokens into an Abstract Syntax Tree (AST).
   * @throws {ParsingError} If the expression contains syntax errors.
   */
  parse(tokens: BooleanToken[]): void {
    this.ast = this.parser.parse(tokens);
  }

  /**
   * Evaluates the parsed boolean expression using provided variable values.
   * @throws {Error} If the expression hasn't been parsed yet.
   * @throws {EvaluationError} If evaluation produced errors.
   */
  evaluate(context: VariableContext): boolean {
    if (!this.ast) {
      throw new Error("Expression must be parsed before evaluation");
    }
    return evaluate(this.ast, context);
  }
}