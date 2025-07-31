export type BooleanToken = Variable | BinaryOperator | UnaryOperator | Parentheses | Literal;

export type BinaryOperator = "OR" | "NAND" | "XOR" | "AND" | "NOR" | "EQUIVALENCE" | "IMPLICATION";
export type UnaryOperator = "NOT";
export type Variable = "A" | "B" | "C" | "D" | "E" | "F";
export type Parentheses = "(" | ")";
export type Literal = "TRUE" | "FALSE";

export interface AST {
  root: ASTNode;
  variables: Variable[];
}

export type ASTNode =
  | { type: "Literal"; value: boolean }
  | { type: "Variable"; value: Variable }
  | { type: "Binary";  left: ASTNode; operator: BinaryOperator; right: ASTNode; }
  | { type: "Unary";  operator: UnaryOperator; innerNode: ASTNode }
  | { type: "Parenthesized"; innerNode: ASTNode };

export function ASTToString(ast: AST): string {
  return ASTNodeToString(ast.root, []).join(" ");
}

function ASTNodeToString(node: ASTNode, strNodes: string[]): string[] {
  switch (node.type) {
    case "Literal":
      strNodes.push(node.value ? "TRUE" : "FALSE");
      return strNodes;
    case "Variable":
      strNodes.push(node.value);
      return strNodes;
    case "Unary":
      strNodes.push(tokenToString(node.operator));
      strNodes.concat(ASTNodeToString(node.innerNode, strNodes));
      return strNodes;
    case "Binary": {
      strNodes.concat(ASTNodeToString(node.left, strNodes));
      strNodes.push(tokenToString(node.operator));
      strNodes.concat(ASTNodeToString(node.right, strNodes));
      return strNodes;
    }
    case "Parenthesized":
      strNodes.push("(");
      strNodes.concat(ASTNodeToString(node.innerNode, strNodes));
      strNodes.push(")");
      return strNodes;
    default:
      throw new Error(`Unknown node type: ${(node as ASTNode).type}`);
  }
}

export function tokenToString(token: BooleanToken): string {
  switch (token) {
    case "IMPLICATION":
      return "->";
    case "EQUIVALENCE":
      return "<=>";
    default:
      return token;
  }
}