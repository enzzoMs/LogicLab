import {type AST, type ASTNode, ASTToString, type Variable} from "@engine/parser/AST.ts";

export type VariableContext = Record<Variable, boolean | null>;

export class EvaluationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export default class BooleanEvaluator {
  private ast!: AST;
  private evaluationSteps: string[] = [];

  /**
   * @return An array of strings containing the step-by-step evaluation of the boolean expression.
   */
  evaluate(ast: AST, context: VariableContext): string[] {
    this.evaluationSteps = [];

    this.ast = ast;
    this.addCurrentEvaluationStep();

    const finalResult = this.evaluateNode(ast.root, context)
    ast.root = { type: "Literal", value: finalResult };
    this.addCurrentEvaluationStep();

    return this.evaluationSteps;
  }

  private evaluateNode(node: ASTNode, context: VariableContext): boolean {
    switch (node.type) {
      case "Literal":
        return node.value;
      case "Variable":
        if (context[node.value] === null) {
          throw new EvaluationError(`Variable ${node.value} does not have a defined value.`);
        }
        return context[node.value] as boolean;
      case "Unary": {
        const innerValue = this.evaluateNode(node.innerNode, context);
        node.innerNode = { type: "Literal", value: innerValue }
        this.addCurrentEvaluationStep();

        return !innerValue;
      }
      case "Binary": {
        const leftValue = this.evaluateNode(node.left, context);
        node.left = { type: "Literal", value: leftValue };
        this.addCurrentEvaluationStep();

        const rightValue = this.evaluateNode(node.right, context);
        node.right = { type: "Literal", value: rightValue };
        this.addCurrentEvaluationStep();

        switch (node.operator) {
          case "AND": return leftValue && rightValue;
          case "OR": return leftValue || rightValue;
          case "XOR": return leftValue !== rightValue;
          case "NAND": return !(leftValue && rightValue);
          case "NOR": return !(leftValue || rightValue);
          default:
            throw new EvaluationError(`Unknown operator: ${(node as ASTNode).type}`);
        }
      }
      case "Parenthesized": {
        const innerValue = this.evaluateNode(node.innerNode, context);
        node.innerNode = { type: "Literal", value: innerValue }
        this.addCurrentEvaluationStep();
        
        return innerValue;
      }
      default:
        throw new EvaluationError(`Unknown node type: ${(node as ASTNode).type}`);
    }
  }

  private addCurrentEvaluationStep() {
    this.evaluationSteps.push(ASTToString(this.ast));
  }
}