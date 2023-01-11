import { ChangeEvent } from "react";
import { Inputs } from "../types/Inputs";

interface FormProps {
  setInput: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const Form = ({
  name,
  prefix,
  indentation,
  body,
  description,
  setInput,
}: Inputs & FormProps) => {
  return (
    <form>
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
      <textarea id="body" name="body" value={body} onChange={setInput} />

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
