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

  evaluate(ast: AST, context: VariableContext): EvaluationResult {
    this.evaluationSteps = [];

    this.ast = structuredClone(ast);
    this.addCurrentEvaluationStep();

    if (this.ast.root.type !== "Literal") {
      this.ast.root = { type: "Literal", value: this.evaluateNode(this.ast.root, context) };
      this.addCurrentEvaluationStep();
    }
    return { steps: this.evaluationSteps, result: this.ast.root.value };
  }

  private evaluateNode(node: ASTNode, context: VariableContext): boolean {
    switch (node.type) {
      case "Variable":
        if (context[node.value] === undefined) {
          throw new EvaluationError(`Variable ${node.value} does not have a defined value`);
        }
        return context[node.value] as boolean;
      case "Unary": {
        if (node.innerNode.type !== "Literal") {
          node.innerNode = { type: "Literal", value: this.evaluateNode(node.innerNode, context) }
          this.addCurrentEvaluationStep();
        }
        return !node.innerNode.value;
      }
      case "Binary": {
        if (node.left.type !== "Literal") {
          node.left = { type: "Literal", value: this.evaluateNode(node.left, context) };
          this.addCurrentEvaluationStep();
        }
        if (node.right.type !== "Literal") {
          node.right = { type: "Literal", value: this.evaluateNode(node.right, context) };
          this.addCurrentEvaluationStep();
        }

        const leftValue = node.left.value;
        const rightValue = node.right.value;

        switch (node.operator) {
          case "AND": return leftValue && rightValue;
          case "OR": return leftValue || rightValue;
          case "XOR": return leftValue !== rightValue;
          case "NAND": return !(leftValue && rightValue);
          case "NOR": return !(leftValue || rightValue);
          case "IMPLICATION": return !leftValue || (leftValue && rightValue);
          case "EQUIVALENCE": return leftValue === rightValue;
          default:
            throw new EvaluationError(`Unknown operator: ${(node as ASTNode).type}`);
        }
      }
      case "Parenthesized": {
        if (node.innerNode.type !== "Literal") {
          node.innerNode = { type: "Literal", value: this.evaluateNode(node.innerNode, context) }
          this.addCurrentEvaluationStep();
        }
        return node.innerNode.value;
      }
      default:
        throw new EvaluationError(`Unknown node type: ${(node as ASTNode).type}`);
    }
  }

  private addCurrentEvaluationStep() {
    this.evaluationSteps.push(ASTToString(this.ast));
  }
}