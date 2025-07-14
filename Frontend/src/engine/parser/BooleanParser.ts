import type {AST, ASTNode, BinaryOperator, BooleanToken, Variable} from "@engine/parser/AST.ts";

/*
Grammar for Boolean expressions:

<bool-expression> ::= <eqv_exp>
<eqv_exp> ::= <impl_exp> ("IMPLICATION" <impl_exp>)*
<impl_exp> ::= <or_exp> ("EQUIVALENCE" <or_exp>)*
<or_exp> ::= <xor_exp> ("OR" <xor_exp>)*
<xor_exp> ::= <nor_exp> ("XOR" <nor_exp>)*
<nor_exp> ::= <and_exp> ("NOR" <and_exp>)*
<and_exp> ::= <nand_exp> ("AND" <nand_exp>)*
<nand_exp> ::= <not_exp> ("NAND" <not_exp>)*
<not_exp> ::= "NOT" <primary> | <primary>
<primary> ::= "TRUE" | "FALSE" | "(" <bool-expression> ")" | <variable>
<variable> ::= "A" | "B" | "C" | "D" | "E" | "F"

This grammar implicitly defines operator precedence based on the
order of precedence below (from highest to lowest):

* PARENTHESES
* NOT
* NAND
* AND
* NOR
* XOR
* OR
* IMPLICATION
* EQUIVALENCE
*/

const binaryOperatorSequence: Map<BinaryOperator, BinaryOperator | "NOT"> = new Map([
  ["EQUIVALENCE", "IMPLICATION"],
  ["IMPLICATION", "OR"],
  ["OR", "XOR"],
  ["XOR", "NOR"],
  ["NOR", "AND"],
  ["AND", "NAND"],
  ["NAND", "NOT"]
]);

export class ParsingError extends Error {
  tokenIndex: number;

  constructor(message: string, tokenIndex: number) {
    super(message);
    this.tokenIndex = tokenIndex;
  }
}

export class BooleanParser {
  private tokens!: BooleanToken[];
  private currentTokenIndex = 0;
  private usedVariables!: Variable[];

  public parse(tokens: BooleanToken[]): AST {
    this.tokens = tokens;
    this.currentTokenIndex = 0;
    this.usedVariables = [];

    const rootNode = this.parseBoolExpression();

    if (this.currentTokenIndex < tokens.length) {
      throw new ParsingError("Unexpected token", this.currentTokenIndex)
    }

    return { root: rootNode, usedVariables: this.usedVariables };
  }

  private currentToken(): BooleanToken {
    return this.tokens[this.currentTokenIndex];
  }

  private tryMatch(...tokens: string[]): boolean {
    if (tokens.includes(this.currentToken())) {
      this.currentTokenIndex++;
      return true;
    }
    return false;
  }

  private parseBoolExpression(): ASTNode {
    return this.parseBinaryExpression("EQUIVALENCE");
  }

  private parseBinaryExpression(operator: BinaryOperator): ASTNode {
    const nextOperator = binaryOperatorSequence.get(operator)!;

    let leftExp = nextOperator === "NOT" ?
      this.parseNotExpression() :
      this.parseBinaryExpression(nextOperator);

    while (this.tryMatch(operator)) {
      const rightExp = nextOperator === "NOT" ?
        this.parseNotExpression() :
        this.parseBinaryExpression(nextOperator);

      leftExp = { type: "Binary", left: leftExp, operator: operator, right: rightExp };
    }
    return leftExp;
  }

  private parseNotExpression(): ASTNode {
    if (this.tryMatch("NOT")) {
      const innerNode = this.parsePrimary();
      return { type: "Unary", operator: "NOT", innerNode };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): ASTNode {
    if (this.tokens.length === 0) {
      throw new ParsingError(
        "Expected a boolean value (TRUE / FALSE) or a variable", this.currentTokenIndex
      );
    }

    if (this.tryMatch("TRUE")) return { type: "Literal", value: true };
    if (this.tryMatch("FALSE")) return { type: "Literal", value: false };

    const variableToken = this.currentToken();

    if (this.tryMatch("A", "B", "C", "D", "E", "F")) {
      if (!this.usedVariables.includes(variableToken as Variable)) {
        this.usedVariables.push(variableToken as Variable);
      }
      return { type: "Variable", value: variableToken as Variable };
    }

    if (this.tryMatch("(")) {
      const innerNode = this.parseBoolExpression();
      if (this.tryMatch(")")) {
        return { type: "Parenthesized", innerNode };
      }
      throw new ParsingError("Expected a closing parenthesis ')'", this.currentTokenIndex);
    }

    throw new ParsingError(
      "Expected a boolean value (TRUE / FALSE) or a variable", this.currentTokenIndex
    );
  }
}