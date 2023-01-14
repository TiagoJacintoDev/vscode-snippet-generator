import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
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
    const tab = /(?<=\${)(\d+)(?=})|(?<=\$)(\d+)/g;
    const placeholder = /(?<=\${)(\d+:.+?)(?=})/g;
    const choice = /(?<=\${)(\d+\|.+?)(?=\|})/g;
    const variable =
      /(?<=\$)([A-Z_]+?)|(?<=\${)([A-Z_]+?)(?=})|(?<=\${)([A-Z_]+?:[a-z]+)(?=})/g;

    const tabs = [...body.matchAll(tab)];
    const placeholders = [...body.matchAll(placeholder)];
    const choices = [...body.matchAll(choice)];
    const variables = [...body.matchAll(variable)];
    console.log(variables);

    const tabsWithIds = [...tabs, ...placeholders, ...choices];

    const tabIds = tabsWithIds.map((tab) => {
      const id = tab[0].split(":")[0];
      return { id };
    });

    const variableNames = variables.map((variable) => {
      const name = variable[0].split(":")[0];
      return { name };
    });

    const uniqueTabs = [...new Set(tabIds.map((tab) => tab.id))].map(
      (id) => tabIds.find((tab) => tab.id === id)!
    );

    const uniqueVariables = [
      ...new Set(variableNames.map((variable) => variable.name)),
    ].map((name) => variableNames.find((variable) => variable.name === name)!);

    const newVariables = uniqueVariables.map((newVariable) => {
      console.log(newVariable);

      const defaultValues = variables
        .filter((variable) => {
          const currentMatch = variable[0];
          const name = currentMatch.split(":")[0];
          return newVariable?.name === name;
        })
        .map((variable) => {
          const currentMatch = variable[0];
          const defaultValue = currentMatch.split(":")[1];
          return defaultValue;
        });

      const positions = variables
        .filter((variable) => {
          const currentMatch = variable[0];
          const name = currentMatch.split(":")[0];
          return newVariable?.name === name;
        })
        .map((variable) => {
          const currentMatch = variable[0];
          const startPos = variable.index!;
          const endPos = startPos + currentMatch.length;
          return { startPos, endPos };
        });

      return { ...newVariable, defaultValues, positions };
    });

    const newTabs = uniqueTabs.map((newTab) => {
      const firstAssignedTab = tabsWithIds
        .map((tab) => {
          const currentMatch = tab[0];
          const labelId = currentMatch.split(":")[0];
          const choiceId = currentMatch.split("|")[0];
          const label = currentMatch.slice(labelId.length + 1) || undefined;
          const values = currentMatch.slice(choiceId.length + 1) || undefined;
          const choices = values?.split(",");

          return { id: labelId || choiceId, label, choices };
        })
        .find(({ id, label, choices }) => {
          if (label && id === newTab.id) {
            return true;
          } else if (choices && id === newTab.id) {
            return true;
          } else {
            return false;
          }
        });

      const positions = tabsWithIds
        .filter((tab) => {
          const currentMatch = tab[0];
          const id = currentMatch.split(":")[0];
          return newTab?.id === id;
        })
        .map((tab) => {
          const currentMatch = tab[0];
          const startPos = tab.index!;
          const endPos = startPos + currentMatch.length;
          return { startPos, endPos };
        });

      return {
        ...newTab,
        choices: firstAssignedTab?.choices,
        label: firstAssignedTab?.label,
        positions,
      };
    });

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

  const addSelectedTabOnKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.keyCode === 73) {
      const start = bodyRef.current!.selectionStart;

      const firstSlice = body.slice(0, start);
      const secondSlice = body.slice(start);
      const updatedBody = firstSlice + "$" + selectedTab + secondSlice;

      setInputs((lastInputs) => ({ ...lastInputs, body: updatedBody }));
      syncTabs(updatedBody);
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
        onKeyDown={addSelectedTabOnKeyPress}
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
