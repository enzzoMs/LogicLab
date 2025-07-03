/*
Grammar for Boolean expressions:

<bool-expression> ::= <or_exp>
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
*/
import type {AST, ASTNode, BooleanToken, Variable} from "@engine/parser/AST.ts";

export class ParsingError extends Error {
  tokenIndex: number;

  constructor(message: string, tokenIndex: number) {
    super(message);
    this.tokenIndex = tokenIndex;
  }
}

export class BooleanParser {
  private tokens: BooleanToken[] = [];
  private currentTokenIndex = 0;

  public parse(tokens: BooleanToken[]): AST {
    this.tokens = tokens;
    this.currentTokenIndex = 0;

    const rootNode = this.parseBoolExpression();

    if (this.currentTokenIndex < tokens.length) {
      throw new ParsingError("Unexpected token", this.currentTokenIndex)
    }

    return { root: rootNode }
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
    return this.parseOrExpression();
  }

  private parseOrExpression(): ASTNode {
    let leftExp = this.parseXorExpression();

    while (this.tryMatch("OR")) {
      const rightExp = this.parseXorExpression();
      leftExp = { type: "Binary", left: leftExp, operator: "OR", right: rightExp };
    }
    return leftExp;
  }

  private parseXorExpression(): ASTNode {
    let leftExp = this.parseNorExpression();

    while (this.tryMatch("XOR")) {
      const rightExp = this.parseNorExpression();
      leftExp = { type: "Binary", left: leftExp, operator: "XOR", right: rightExp };
    }
    return leftExp;
  }

  private parseNorExpression(): ASTNode {
    let leftExp = this.parseAndExpression();

    while (this.tryMatch("NOR")) {
      const rightExp = this.parseAndExpression();
      leftExp = { type: "Binary", left: leftExp, operator: "NOR", right: rightExp };
    }
    return leftExp;
  }

  private parseAndExpression(): ASTNode {
    let leftExp = this.parseNandExpression();

    while (this.tryMatch("AND")) {
      const rightExp = this.parseNandExpression();
      leftExp = { type: "Binary", left: leftExp, operator: "AND", right: rightExp };
    }
    return leftExp;
  }

  private parseNandExpression(): ASTNode {
    let leftExp = this.parseNotExpression();

    while (this.tryMatch("NAND")) {
      const rightExp = this.parseNotExpression();
      leftExp = { type: "Binary", left: leftExp, operator: "NAND", right: rightExp };
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