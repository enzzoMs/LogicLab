import type {AST, ASTNode, Variable} from "@engine/parser/AST.ts";

export type VariableContext = Record<Variable, boolean | null>;

export class EvaluationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export default class BooleanEvaluator {
  evaluate(ast: AST, context: VariableContext): boolean {
    return this.evaluateNode(ast.root, context);
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
      case "Unary":
        return !this.evaluateNode(node.innerNode, context);
      case "Binary": {
        const leftValue = this.evaluateNode(node.left, context);
        const rightValue = this.evaluateNode(node.right, context);

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
      case "Parenthesized":
        return this.evaluateNode(node.innerNode, context);
      default:
        throw new Error(`Unknown node type: ${(node as ASTNode).type}`);
    }
  }
}