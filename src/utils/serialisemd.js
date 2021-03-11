import { Node } from "slate";

const serialiseMd = (nodes) => {
  const input = nodes.map((n) => Node.string(n)).join("\n");
  //   console.log({ input });
  return input;
};

export default serialiseMd;
