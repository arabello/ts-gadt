import { match, P } from "ts-pattern";
import { Command } from "./1.1-basic-adt";

type State = {
  /** */
};

const nextState = (prev: State, command: Command): State =>
  match(command)
    .with({ _type: P.union("validate", "process") }, (cmd) => {
      // ...
      return prev;
    })
    .with({ _type: "notify" }, (cmd) => {
      // ...
      return prev;
    })
    .with({ _type: "chain" }, (cmd) => {
      // ...
      return prev;
    })
    .exhaustive();
