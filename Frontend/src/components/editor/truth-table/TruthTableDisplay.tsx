import {useState} from "react";
import type {TruthTable} from "@engine/table-generator/TruthTableGenerator";
import styles from "@components/editor/truth-table/TruthTableDisplay.module.css";

export interface TruthTableDisplayProps {
  truthTable: TruthTable;
}

export default function TruthTableDisplay({ truthTable }: TruthTableDisplayProps) {
  const [highlightResults, setHighlightResults] = useState(false);

  return (
    <div className={styles.displayContainer}>
      <div className={styles.tableHeader}>
        <h2>Truth Table</h2>
        <input
          id="highlight-results"
          type="checkbox"
          checked={highlightResults}
          onChange={() => setHighlightResults(!highlightResults)}/>
        <label htmlFor="highlight-results">Highlight Results</label>
      </div>

      <table className={styles.truthTable}>
        <thead>
          <tr>
            {truthTable.variables.map(variable => (
              <th key={variable}>{variable}</th>
            ))}
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {truthTable.rows.map((row, i) => {
            let rowStyle = ""

            if (highlightResults && row.result) {
              rowStyle = styles.trueRow;
            } else if (highlightResults && !row.result) {
              rowStyle = styles.falseRow;
            }
            return (
              <tr key={i} className={rowStyle}>
                {row.variableValues.map((value, j) => (
                  <td key={j}>{value ? "1" : "0"}</td>
                ))}
                <td>{row.result ? "1" : "0"}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}