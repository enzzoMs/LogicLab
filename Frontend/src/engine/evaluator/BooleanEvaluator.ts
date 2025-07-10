import {type AST, type ASTNode, ASTToString, type Variable} from "../parser/AST.ts";

export type VariableContext = {
  [variable in Variable]?: boolean;
};

export interface EvaluationResult {
  steps: string[];
  result: boolean;
}

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
  evaluate(ast: AST, context: VariableContext): EvaluationResult {
    this.evaluationSteps = [];

    this.ast = structuredClone(ast);
    this.addCurrentEvaluationStep();

    const finalResult = this.evaluateNode(this.ast.root, context);
    this.ast.root = { type: "Literal", value: finalResult };
    this.addCurrentEvaluationStep();

    return { steps: this.evaluationSteps, result: finalResult };
  }

  private evaluateNode(node: ASTNode, context: VariableContext): boolean {
    switch (node.type) {
      case "Literal":
        return node.value;
      case "Variable":
        if (context[node.value] === undefined) {
          throw new EvaluationError(`Variable ${node.value} does not have a defined value`);
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