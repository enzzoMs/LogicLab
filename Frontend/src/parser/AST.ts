export type BooleanToken = Variable | BinaryOperator | UnaryOperator | Parentheses | Literal;

export type BinaryOperator = "OR" | "NAND" | "XOR" | "AND";
export type UnaryOperator = "NOT";
export type Variable = "A" | "B" | "C" | "D" | "E" | "F";
export type Parentheses = "(" | ")";
export type Literal = "TRUE" | "FALSE";

export interface AST {
  readonly root: ASTNode;
}

export type ASTNode =
  | { type: "Literal"; value: boolean }
  | { type: "Variable"; value: Variable }
  | { type: "Binary";  left: ASTNode; operator: BinaryOperator; right: ASTNode; }
  | { type: "Unary";  operator: UnaryOperator; innerNode: ASTNode }
  | { type: "Parenthesized"; innerNode: ASTNode }