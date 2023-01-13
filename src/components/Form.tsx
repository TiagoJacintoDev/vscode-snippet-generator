import { ChangeEvent, Dispatch, SetStateAction, useRef } from "react";
import { Inputs } from "../types/Inputs";

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

    const newTabs = tabs.map((tab) => {
      const currentMatch = tab[0];

      const id = currentMatch.split(":")[0];
      const label = currentMatch.slice(id.length + 1) || undefined;
      const startPos = tab.index!;
      const endPos = startPos + currentMatch.length;

      return { id: +id, label, startPos, endPos };
    });

    for (let i = 0; i < newTabs.length; i++) {
      for (let j = 0; j < newTabs.length; j++) {
        if (i === j) continue;
        if (!newTabs[i].label && !newTabs[j].label) continue;

        if (newTabs[i].id === newTabs[j].id && i > j) {
          if (newTabs[j].label) {
            newTabs[i].label = newTabs[j].label;
          } else {
            newTabs[j].label = newTabs[i].label;
          }
        }
      }
    }

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
            {tabs.map((tab) => (
              <option value={`${tab.startPos} ${tab.endPos}`}>
                Go to tab: {tab.id} {tab.label}
              </option>
            ))}
          </select>
        </>
      )}
    </form>
  );
};
