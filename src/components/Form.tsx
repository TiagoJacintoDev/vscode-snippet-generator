import { ChangeEvent, Dispatch, SetStateAction, useRef } from "react";
import { Inputs } from "../types/Inputs";
import { Tab } from "../types/Tab";

interface FormProps {
  setInputs: Dispatch<SetStateAction<Inputs>>;
}

export const Form = ({
  name,
  prefix,
  indentation,
  body,
  description,
  tabs,
  setInputs,
}: Inputs & FormProps) => {
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
    const placeholder = "(?<=\\${)(.+?)(?=})";
    const tabWithBrackets = "(?<=\\${)(\\d+)(?=})";
    const tabWithoutBrackets = "(?<=\\$)(\\d+)";
    const regex = new RegExp(
      `${placeholder}|${tabWithoutBrackets}|${tabWithBrackets}`,
      "g"
    );

    const tabs = [...body.matchAll(regex)];

    const tabIds = tabs.map((tab) => {
      const id = +tab[0].split(":")[0];

      return { id };
    });

    let uniqueTabs = [...new Set(tabIds.map((tab) => tab.id))].map(
      (id) => tabIds.find((tab) => tab.id === id)!
    );

    const newTabs = uniqueTabs.map((newTab) => {
      const label = tabs
        .map((tab) => {
          const currentMatch = tab[0];
          const id = currentMatch.split(":")[0];
          const label = currentMatch.slice(id.length + 1) || undefined;
          return { id: +id, label };
        })
        .find(({ id, label }) => label && newTab?.id === id)?.label;

      const positions = tabs
        .filter((tab) => {
          const currentMatch = tab[0];
          const id = +currentMatch.split(":")[0];
          return newTab?.id === id;
        })
        .map((tab) => {
          const currentMatch = tab[0];
          const startPos = tab.index!;
          const endPos = startPos + currentMatch.length;
          return { startPos, endPos };
        });

      return { ...newTab, label, positions };
    });

    setInputs((lastInputs) => ({ ...lastInputs, tabs: newTabs }));
  };

  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const goToBodyLine = (e: ChangeEvent<HTMLSelectElement>) => {
    const splitValue = e.target.value.split(" ");
    const selectStart = +splitValue[0];
    const selectEnd = +splitValue[1];

    bodyRef.current!.focus();
    bodyRef.current!.setSelectionRange(selectStart, selectEnd);
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
          <label htmlFor="tagSelector">Go To Tag:</label>
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
                      Go to tab at line {tab.startPos}
                    </option>
                  );
                })}
              </optgroup>
            ))}
          </select>
        </>
      )}
    </form>
  );
};
