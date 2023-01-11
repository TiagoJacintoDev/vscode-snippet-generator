import { ChangeEvent, useState } from "react";
import { Display } from "./components/Display";
import { Form } from "./components/Form";
import { Inputs } from "./types/Inputs";

export const App = () => {
  const [inputs, setInputs] = useState<Inputs>({
    name: "",
    prefix: "",
    indentation: 2,
    body: "",
    description: "",
  });
  const setInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs((lastInputs) => ({
      ...lastInputs,
      [e.target.name]:
        e.target.type === "number"
          ? Math.max(0, +e.target.value)
          : e.target.value,
    }));
  };

  return (
    <>
      <Form {...inputs} setInput={setInput} />
      <Display {...inputs} />
    </>
  );
};
