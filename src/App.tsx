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
    tabs: [],
    description: "",
  });

  console.log(inputs.tabs);

  return (
    <>
      <Form {...inputs} setInputs={setInputs} />
      <Display {...inputs} />
    </>
  );
};
