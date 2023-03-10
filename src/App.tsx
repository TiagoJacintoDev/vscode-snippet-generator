import { useState } from "react";
import { Display } from "./components/Display";
import { Form } from "./components/Form";
import { Inputs } from "./types/Inputs";

export const App = () => {
  const [inputs, setInputs] = useState<Inputs>({
    name: "",
    scope: "",
    prefix: "",
    body: "",
    description: "",
    indentation: 2,
    tabs: [],
    variables: [],
  });

  return (
    <main
      style={{ marginTop: "60px", marginInline: "auto" }}
      className="container grid"
    >
      <Form {...inputs} setInputs={setInputs} />
      <Display {...inputs} />
    </main>
  );
};
