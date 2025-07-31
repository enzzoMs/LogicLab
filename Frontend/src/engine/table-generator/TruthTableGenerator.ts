import BooleanEvaluator, {type VariableContext} from "../evaluator/BooleanEvaluator.ts";
import type {AST, Variable} from "../parser/AST.ts";

export interface TruthTable {
  variables: Variable[];
  rows: {
    variableValues: boolean[];
    result: boolean;
  }[]
}

export class TruthTableError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function generateTruthTableFromAST(ast: AST, evaluator: BooleanEvaluator): TruthTable {
  if (ast.variables.length === 0) {
    throw new TruthTableError("Cannot generate a truth table from an expression with no variables");
  }

  const variables = ast.variables.sort();
  const truthTable: TruthTable = { variables, rows: [] };

  const numOfRows = 2 ** ast.variables.length;

  for (let row = 0; row < numOfRows; row++) {
    const variableValues = row
      .toString(2)
      .padStart(variables.length, "0")
      .split("")
      .map((c) => c === "1");

    const variableContext: VariableContext = {};

    variables.forEach((variable, index) => {
      variableContext[variable] = variableValues[index];
    })

    const evaluation = evaluator.evaluate(ast, variableContext);
    truthTable.rows.push({ variableValues, result: evaluation.result });
  }

  return truthTable;
}

export function truthTableToString(truthTable: TruthTable): string {
  const NEW_LINE = "%0A";
  const truthTableAsString: string[] = [];

  truthTableAsString.push(...truthTable.variables.join(","));
  truthTableAsString.push(",Result," + NEW_LINE);

  for (const row of truthTable.rows) {
    truthTableAsString.push(...row.variableValues.map((v) => v ? "1," : "0,"));
    truthTableAsString.push((row.result ? "1," : "0,") + NEW_LINE);
  }
  return truthTableAsString.join("");
}