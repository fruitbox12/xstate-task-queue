import { assign, createMachine } from "xstate";
import { ThreadStatus, ThreadType } from "~/types";
import { threadMachine } from "./thread";

function waitForTimeout() {
  const minTimeout = 3_000;
  const maxTimeout = 5_000;
  const ms = Math.floor(Math.random() * (maxTimeout - minTimeout) + minTimeout);

  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface Thread {
  id: number;
  status: ThreadStatus;
  priority: number;
  timestamp: number;
  threadType: ThreadType;
}

async function threadAsPromise() {
  await waitForTimeout();

  const shouldThrow = Math.random() < 0.5;
  if (shouldThrow) {
    throw new Error("Processing failed");
  }
}

export const threadQueueMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUCGsDWACAjgVzAIGIBBCCLAF3W0oHtcCCBtABgF1FQAHO2AS0r86AOy4gAHogC0ARgDMrAHTyAnKwAsANgDsAJnUBWdaoA0IAJ4zZq+UtkaNs2TtmH5Ora1sBfH+bRMRkIwIgBVbghUSjAqGgByWCxuACdhNMoLNk4kEF4BIVFxKQR5PR0lVUMNeQ09by95dy1zKwQ5W3tHZ1d3T295PwCaYIIlAEkIABtQ7PF8wWExXJL5Oz0NAA5NHUNWBybNvVbENaUvJzqj1Q3nWSGQQOx8EKUABRS6AGM4AREoIgQURgJT8EQANzoGBBT1GII+31+YKgCDBkK+0SW2TmuQWhWWoFWdi21VYOkce02GkMhhOpVqKk2WipGjJdVUng0D1hLzGCJ+sD+ALAKU+KSU3Cm0QAZnQUgBbJQ8pjwz4CoWoiHfTGibEceZ8RZFFanYmbUnk6msKmGY6WRAuOw6WyqVRaPRaLa2a1+fwgER0CBwcTKkIGgpLYoyPTOJR6QwuTZu+SyVj7PTyOnSLSqc5UrSGTayAusYxaLTcka8kGTGbho0EyTWLTrBM6JMt1PpzP2hDVFSsFs6NQ5t1pvSVoLV95qpH-ev4qMIS5dNzaPaqTbDjR0lxKIuyLe1BzqLSyDa+nxAA */
  createMachine(
    {
      id: "Thread queue",

      tsTypes: {} as import("./threadQueue.typegen").Typegen0,

      context: {
        index: 0,
        queue: [],
        threads: {},
        currentThreadId: undefined,
      },

      schema: {
        context: {} as {
          index: number;
          queue: number[];
          threads: Record<number, Thread>;
          currentThreadId: number | undefined;
        },
        events: {} as
          | {
              type: "Add thread to queue";
              priority: number;
              threadType: ThreadType;
            }
          | {
              type: "Update thread's priority";
              id: number;
              newPriority: number;
            },
      },

      states: {
        Idle: {
          always: {
            target: "Processing",
            cond: "A thread is available for processing",
            actions: "Take thread from queue",
          },
        },

        Processing: {
          invoke: {
            src: "Process thread",

            onDone: {
              target: "Idle",
              actions: [
                "Mark thread as done",
                "Reset currently processed thread id",
              ],
            },

            onError: {
              target: "Idle",
              actions: [
                "Mark thread as failed",
                "Reset currently processed thread id",
              ],
            },
          },

          entry: "Mark thread as being processed",
        },
      },

      initial: "Idle",

      on: {
        "Add thread to queue": {
          actions: ["Push thread to queue", "Reorder queue"],
          internal: true,
        },

        "Update thread's priority": {
          actions: ["Assign new thread's priority", "Reorder queue"],
          cond: "Thread is in queue",
          internal: true,
        },
      },

      predictableActionArguments: true,

      preserveActionOrder: true,
    },
    {
      actions: {
        "Push thread to queue": assign(
          ({ index, queue, threads }, { priority, threadType }) => {
            const nextIndex = index + 1;

            return {
              index: nextIndex,
              queue: [...queue, nextIndex],
              threads: {
                ...threads,
                [nextIndex]: {
                  id: nextIndex,
                  priority,
                  status: "waiting for processing" as const,
                  timestamp: Number(new Date()),
                  threadType,
                },
              },
            };
          }
        ),
        "Reorder queue": assign({
          queue: ({ queue, threads }) =>
            [...queue].sort((firstId, secondId) => {
              const firstThreadPriority = threads[firstId].priority;
              const secondThreadPriority = threads[secondId].priority;

              if (firstThreadPriority === secondThreadPriority) {
                // Smallest id first
                return firstId - secondId;
              }

              // Highest priority first
              return secondThreadPriority - firstThreadPriority;
            }),
        }),
        "Take thread from queue": assign({
          currentThreadId: ({ queue }) => queue[0],
          queue: ({ queue }) => queue.slice(1),
        }),
        "Mark thread as being processed": assign({
          threads: ({ threads, currentThreadId }) => {
            if (currentThreadId === undefined) {
              throw new Error(
                "Can not run this action without a defined currentThreadId"
              );
            }

            return {
              ...threads,
              [currentThreadId]: {
                ...threads[currentThreadId],
                status: "processing" as const,
              },
            };
          },
        }),
        "Mark thread as done": assign({
          threads: ({ threads, currentThreadId }) => {
            if (currentThreadId === undefined) {
              throw new Error(
                "Can not run this action without a defined currentThreadId"
              );
            }

            return {
              ...threads,
              [currentThreadId]: {
                ...threads[currentThreadId],
                status: "done" as const,
              },
            };
          },
        }),
        "Mark thread as failed": assign({
          threads: ({ threads, currentThreadId }) => {
            if (currentThreadId === undefined) {
              throw new Error(
                "Can not run this action without a defined currentThreadId"
              );
            }

            return {
              ...threads,
              [currentThreadId]: {
                ...threads[currentThreadId],
                status: "errored" as const,
              },
            };
          },
        }),
        "Assign new thread's priority": assign({
          threads: ({ threads }, { id, newPriority }) => ({
            ...threads,
            [id]: {
              ...threads[id],
              priority: newPriority,
            },
          }),
        }),
        "Reset currently processed thread id": assign({
          currentThreadId: (_context, _event) => undefined,
        }),
      },
      services: {
        "Process thread": ({ threads, currentThreadId }) => {
          if (currentThreadId === undefined) {
            throw new Error("currentThreadId must be defined");
          }

          const { threadType } = threads[currentThreadId];

          if (threadType === "Promise") {
            return threadAsPromise();
          }

          return threadMachine;
        },
      },
      guards: {
        "A thread is available for processing": ({ queue }) => queue.length > 0,
        "Thread is in queue": ({ queue }, { id }) => queue.includes(id),
      },
    }
  );
