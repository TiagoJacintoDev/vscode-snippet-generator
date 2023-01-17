import { ChangeEvent } from "react";
import { Tab } from "../types/Tab";

interface TabSelectorProps {
  goToBodyLine: (e: ChangeEvent<HTMLSelectElement>) => void;
  tabs: Tab[];
}

export const TabSelector = ({ goToBodyLine, tabs }: TabSelectorProps) => {
  return (
    <div>
      <label htmlFor="tagSelector">Go To Tab:</label>
      {/* TODO: Go to body line on option click, not on change */}
      <select id="tagSelector" onChange={goToBodyLine}>
        {tabs.map((tabGroup) => (
          <optgroup
            key={tabGroup.id}
            label={`Tag ${tabGroup.id} ${tabGroup.label ?? ""}`}
          >
            {tabGroup.positions.map((tab) => {
              const tabPos = `${tab.startPos} ${tab.endPos}`;
              return (
                <option key={tabPos} value={tabPos}>
                  Go to tab at letter {tab.startPos}
                </option>
              );
            })}
          </optgroup>
        ))}
      </select>
    </div>
  );
};
