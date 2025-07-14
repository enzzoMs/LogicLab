import {BooleanParser} from "@engine/parser/BooleanParser.ts";
import {type AST, type BooleanToken} from "@engine/parser/AST.ts";
import BooleanEvaluator, {type EvaluationResult, type VariableContext} from "@engine/evaluator/BooleanEvaluator.ts";
import {generateTruthTableFromAst, type TruthTable} from "@engine/table-generator/TruthTableGenerator.ts";

/**
 * Handles boolean expressions processing, including parsing and evaluation.
 * Provides a unified interface for working with boolean logic operations.
 */
export default class BooleanEngine {
  private readonly parser = new BooleanParser();
  private readonly evaluator = new BooleanEvaluator();

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
   * @return An array of strings containing the step-by-step evaluation of the boolean expression.
   * @throws {Error} If the expression hasn't been parsed yet.
   * @throws {EvaluationError} If the evaluation produced errors.
   */
  evaluate(context: VariableContext): EvaluationResult {
    if (!this.ast) {
      throw new Error("Expression must be parsed before evaluation");
    }

    return this.evaluator.evaluate(this.ast, context);
  }

  /**
   * Generates a truth table for the current boolean expression.
   * @throws {Error} If the expression hasn't been parsed yet.
   * @throws {TruthTableError} If the expression has no variables.
   * @throws {EvaluationError} If any evaluation produced errors.
   */
  generateTruthTable(): TruthTable {
    if (!this.ast) {
      throw new Error("Expression must be parsed before generating truth table");
    }

    return generateTruthTableFromAst(this.ast, this.evaluator);
  }
}