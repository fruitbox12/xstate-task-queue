import { z } from "zod";

export type ThreadStatus =
  | "waiting for processing"
  | "processing"
  | "done"
  | "errored";

export const ThreadType = z.enum(["Promise", "Machine"]);
export type ThreadType = z.infer<typeof ThreadType>;
