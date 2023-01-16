import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { getSyntaxRegex } from "../data/syntaxRegex";
import {
  composeRegex,
  getCurrentMatches,
  getDefaultValues,
  getFirstAssignedTab,
  getTabPositions,
  getUniqueIds,
} from "../helpers/functions";
import { Inputs } from "../types/Inputs";
import { TabSelector } from "./TabSelector";
import { VariableSelector } from "./VariableSelector";

interface FormProps {
  setInputs: Dispatch<SetStateAction<Inputs>>;
}

export const Form = ({
  name,
  prefix,
  scope,
  indentation,
  body,
  description,
  tabs,
  variables,
  setInputs,
}: Inputs & FormProps) => {
  const [selectedTab, setSelectedTab] = useState("0");

  const setInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs((lastInputs) => ({
      ...lastInputs,
      [e.target.name]:
        e.target.type === "number"
          ? Math.max(0, +e.target.value)
          : e.target.value,
    }));
  };

  const syncTabs = (body: string) => {
    const { tabsRegex, variablesRegex } = getSyntaxRegex();

    const variableMatches = [...body.matchAll(composeRegex(variablesRegex))];
    const uniqueVariableNames = getUniqueIds(variableMatches, ":");

    const tabMatches = [...body.matchAll(composeRegex(tabsRegex))];
    const uniqueTabIds = getUniqueIds(tabMatches, /:|\|/);

    const newVariables = uniqueVariableNames.map((name) => {
      const variableWithCurrentName = getCurrentMatches(
        variableMatches,
        name,
        ":"
      );

      const defaultValues = getDefaultValues(variableWithCurrentName);
      const positions = getTabPositions(variableWithCurrentName);

      return { name, defaultValues, positions };
    });

    const newTabs = uniqueTabIds.map((id) => {
      const tabsWithCurrentId = getCurrentMatches(tabMatches, id, /:|\|/);
      const firstAssignedTab = getFirstAssignedTab(tabsWithCurrentId, id);
      const positions = getTabPositions(tabsWithCurrentId);

      return {
        id,
        choices: firstAssignedTab?.choices,
        label: firstAssignedTab?.label,
        positions,
      };
    });

    if (newTabs.length > 0) {
      setSelectedTab(newTabs[0].id);
    }

    setInputs((lastInputs) => ({
      ...lastInputs,
      variables: newVariables,
      tabs: newTabs,
    }));
  };

  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const goToBodyLine = (e: ChangeEvent<HTMLSelectElement>) => {
    const splitValue = e.target.value.split(" ");
    const selectStart = +splitValue[0];
    const selectEnd = +splitValue[1];

    bodyRef.current!.focus();
    bodyRef.current!.setSelectionRange(selectStart, selectEnd);
  };

  const addTextToBody = (text: string) => {
    const start = bodyRef.current!.selectionStart;

    const firstSlice = body.slice(0, start);
    const secondSlice = body.slice(start);
    const updatedBody = firstSlice + text + secondSlice;

    setInputs((lastInputs) => ({ ...lastInputs, body: updatedBody }));
    syncTabs(updatedBody);
  };

  const addSelectedTab = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "i") {
      addTextToBody("$" + selectedTab);
    }
  };

  const addNextTab = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "y") {
      const currentTab =
        tabs.length > 0 ? +tabs.sort((a, b) => +b.id - +a.id)[0].id : 0;

      const nextTab = currentTab + 1;

      addTextToBody("$" + nextTab);
    }
  };

  const IndentBodyWithTag = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      addTextToBody("\\t");
    }
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "5px",
      }}
    >
      <label htmlFor="name">Name:</label>
      <input id="name" name="name" value={name} onChange={setInput} />

      <label htmlFor="scope">Scope:</label>
      <input id="scope" name="scope" value={scope} onChange={setInput} />

      <label htmlFor="prefix">Prefix:</label>
      <input id="prefix" name="prefix" value={prefix} onChange={setInput} />

      <label htmlFor="indentation">Indentation:</label>
      <input
        type="number"
        id="indentation"
        name="indentation"
        value={indentation}
        onChange={setInput}
      />

      <label htmlFor="body">Body:</label>
      <textarea
        ref={bodyRef}
        rows={5}
        cols={30}
        id="body"
        name="body"
        value={body}
        onChange={(e) => {
          setInput(e);
          syncTabs(e.target.value);
        }}
        onKeyDown={(e) => {
          addSelectedTab(e);
          addNextTab(e);
          IndentBodyWithTag(e);
        }}
      />

      <label htmlFor="description">Description:</label>
      <input
        id="description"
        name="description"
        value={description}
        onChange={setInput}
      />

      {tabs.length > 0 && (
        <>
          <label htmlFor="selectTab">Select Tab:</label>
          <select
            id="selectTab"
            value={selectedTab}
            onChange={(e) => setSelectedTab(e.target.value)}
          >
            {tabs.map((tab) => (
              <option value={tab.id} key={tab.id}>
                {tab.id} {tab.label}
              </option>
            ))}
          </select>
        </>
      )}

      {tabs.length > 0 && <TabSelector {...{ goToBodyLine, tabs }} />}

      {variables.length > 0 && (
        <VariableSelector {...{ goToBodyLine, variables }} />
      )}
    </form>
  );
};
