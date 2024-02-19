import { match } from "ts-pattern";

export type CommandType = "validate" | "process" | "notify" | "chain";
export type Status = "unprocessed" | "processed";

export type Command<
  C extends CommandType = CommandType,
  B extends Status = Status,
  A extends Status = Status,
> = {
  _type: C;
  _before: B;
  _after: A;
} & (
  | {
      _type: "validate";
      _before: "unprocessed";
      _after: "unprocessed";
      transactionId: string;
    }
  | {
      _type: "process";
      _before: "unprocessed";
      _after: "processed";
      transactionId: string;
    }
  | {
      _type: "notify";
      _before: "processed";
      _after: "processed";
      userId: string;
    }
  | {
      _type: "chain";
      _before: Status;
      _after: Status;
      _cmd1: Command<CommandType, B, Status>;
      _cmd2: Command<CommandType, Status, A>;
    }
);

type Validate = Command<"validate", "unprocessed", "unprocessed">;
type Process = Command<"process", "unprocessed", "processed">;
type Notify = Command<"notify", "processed", "processed">;
type Chain<B extends Status, A extends Status> = Command<"chain", B, A>;

export const validate = (transactionId: string): Validate => ({
  _type: "validate",
  _before: "unprocessed",
  _after: "unprocessed",
  transactionId,
});

export const process = (transactionId: string): Process => ({
  _type: "process",
  _before: "unprocessed",
  _after: "processed",
  transactionId,
});

export const notify = (userId: string): Notify => ({
  _type: "notify",
  _before: "processed",
  _after: "processed",
  userId,
});

export const chain =
  <B extends Status, T extends Status>(cmd1: Command<CommandType, B, T>) =>
  <A extends Status>(cmd2: Command<CommandType, T, A>): Chain<B, A> => ({
    _type: "chain",
    _before: cmd1._before,
    _after: cmd2._after,
    _cmd1: cmd1,
    _cmd2: cmd2,
  });

const y = validate("1");
y._type; // validate
y._before; // "unprocessed"
y._after; // "unprocessed"

const x = chain(validate("1"))(chain(process("1"))(notify("1"))); // ⚠️
x._type; // chain
x._before; // "unprocessed"
x._after; // "processed"

const nextState = (prev: {}, command: Command) =>
  match(command)
    .with({ _type: "validate" }, (cmd) => {
      cmd._before; // "unprocessed"
      cmd._after; // "unprocessed"
    })
    .with({ _type: "process" }, (cmd) => {})
    .with({ _type: "notify" }, (cmd) => {})
    .with({ _type: "chain" }, (cmd) => {
      nextState(prev, cmd._cmd1);
      nextState(prev, cmd._cmd2);
    })
    .exhaustive();
