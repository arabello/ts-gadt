export type Command =
  | { _type: "validate"; transactionId: string }
  | { _type: "process"; transactionId: string }
  | { _type: "notify"; userId: string }
  | { _type: "chain"; _cmd1: Command; _cmd2: Command };

export const validate = (transactionId: string): Command => ({
  _type: "validate",
  transactionId,
});

export const process = (transactionId: string): Command => ({
  _type: "process",
  transactionId,
});

export const notify = (userId: string): Command => ({
  _type: "notify",
  userId,
});

export const chain = (cmd1: Command, cmd2: Command): Command => ({
  _type: "chain",
  _cmd1: cmd1,
  _cmd2: cmd2,
});
