import { ChangeEvent } from "react";
import { Variable } from "../types/Variable";

interface VariableSelectorProps {
  goToBodyLine: (e: ChangeEvent<HTMLSelectElement>) => void;
  variables: Variable[];
}

export const VariableSelector = ({
  goToBodyLine,
  variables,
}: VariableSelectorProps) => {
  return (
    <>
      <label htmlFor="variableSelector">Go To Variable:</label>
      {/* TODO: Go to body line on option click, not on change */}
      <select id="variableSelector" onChange={goToBodyLine}>
        {variables.map((variableGroup) => (
          <optgroup
            key={variableGroup.name}
            label={`Variable ${variableGroup.name}`}
          >
            {variableGroup.positions.map((variable) => {
              const variablePos = `${variable.startPos} ${variable.endPos}`;
              return (
                <option key={variablePos} value={variablePos}>
                  Go to variable at letter {variable.startPos}
                </option>
              );
            })}
          </optgroup>
        ))}
      </select>
    </>
  );
};
