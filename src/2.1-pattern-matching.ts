export type Command =
  | { _type: "validate"; transactionId: string }
  | { _type: "process"; transactionId: string }
  | { _type: "notify"; userId: string }
  | { _type: "chain"; _cmd1: Command; _cmd2: Command }
  | { _type: "newCommand" };

type State = {
  /** */
};

const nextState = (prev: State, command: Command) => {
  switch (command._type) {
    case "validate" || "process": // ⛔️ Always 'validate'
      command.userId;
      return prev;
    case "process":
      // ...
      return prev;
    case "process": // ⛔️ Duplicated branch: compiler won't complain
      // ...
      return prev;
    case "notify":
      // ...
      return prev;
    case "chain":
      // ...
      return prev;
  }
};

const s: State = nextState({}, { _type: "validate", transactionId: "123" });
