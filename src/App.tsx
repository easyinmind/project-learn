import React from "react";
import { add } from "./tools/tool";
import "./app.less";

const App = () => {
  add();
  // import('./tools/tool').then(res => {
  //   console.log(res)
  // })

  const a = "111";
  console.log(a);

  return <div>test</div>;
};
export default App;
