import { ChangeEvent, Dispatch, SetStateAction } from "react";
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
      placeholder + "|" + tabWithoutBrackets + "|" + tabWithBrackets,
      "g"
    );

    const tabs = [...body.matchAll(regex)];

    const newTabs = tabs.map((tab) => {
      const currentMatch = tab[0];

      const id = currentMatch.split(":")[0];
      const label = currentMatch.slice(id.length + 1);
      const startPos = tab.index!;
      const endPos = startPos + currentMatch.length;

      let object: Tab = { id: +id, startPos, endPos };

      if (label) object.label = label;

      return object;
    });

    // TODO: Better Architecture
    for (let i = 0; i < newTabs.length; i++) {
      for (let j = 1; j < newTabs.length; j++) {
        if (newTabs[i].id === newTabs[j].id) {
          if (!newTabs[i].label && !newTabs[j].label) continue;

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
    </form>
  );
};

// let input = "$09321 ${209321} ${0: label test32134 %@#$@#!)%*#${}}";
// let regex = /(?<=\$)(\d+)|(?<=\$\{)(\d+)(?=\})|(?<=\$\{)(.*)(?=\})/g;
// let matches = input.match(regex);
// console.log(matches); // ["09321", "209321","0: label test32134 %@#$@#!)%*#${}"]
