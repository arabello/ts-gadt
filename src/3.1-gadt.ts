import { match } from "ts-pattern";

export type Status = "unprocessed" | "processed";

export type Command<B extends Status, A extends Status> =
  | { _type: "validate"; _before: B; _after: A; transactionId: string }
  | { _type: "process"; _before: B; _after: A; transactionId: string }
  | { _type: "notify"; _before: B; _after: A; userId: string }
  | {
      _type: "chain";
      _before: B;
      _after: A;
      _cmd1: Command<B, Status>;
      _cmd2: Command<Status, A>;
    };

export const validate = (
  transactionId: string,
): Command<"unprocessed", "unprocessed"> => ({
  _type: "validate",
  _before: "unprocessed",
  _after: "unprocessed",
  transactionId,
});

export const process = (
  transactionId: string,
): Command<"unprocessed", "processed"> => ({
  _type: "process",
  _before: "unprocessed",
  _after: "processed",
  transactionId,
});

const notify = (userId: string): Command<"processed", "processed"> => ({
  _type: "notify",
  _before: "processed",
  _after: "processed",
  userId,
});

const chain = (
  cmd1: Command<Status, Status>,
  cmd2: Command<Status, Status>,
): Command<Status, Status> => ({
  _type: "chain",
  _before: cmd1._before,
  _after: cmd2._after,
  _cmd1: cmd1,
  _cmd2: cmd2,
});

const y = validate("1");
y._type; // "validate" | "process" | "notify" | "chain"
y._before; // "unprocessed"
y._after; // "unprocessed"

const x = chain(validate("1"), process("1"));
x._type; // "validate" | "process" | "notify" | "chain"
x._before; // Status
x._after; // Status

const nextState = (prev: {}, command: Command<Status, Status>) =>
  match(command)
    .with({ _type: "validate" }, (cmd) => {
      cmd._before; // Status
      cmd._after; // Status
    })
    .with({ _type: "process" }, (cmd) => {})
    .with({ _type: "notify" }, (cmd) => {})
    .with({ _type: "chain" }, (cmd) => {
      nextState(prev, cmd._cmd1);
      nextState(prev, cmd._cmd2);
    })
    .exhaustive();
