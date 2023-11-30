
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"done.invoke.Thread queue.Processing:invocation[0]": { type: "done.invoke.Thread queue.Processing:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.Thread queue.Processing:invocation[0]": { type: "error.platform.Thread queue.Processing:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "Process thread": "done.invoke.Thread queue.Processing:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "Assign new thread's priority": "Update thread's priority";
"Mark thread as being processed": "";
"Mark thread as done": "done.invoke.Thread queue.Processing:invocation[0]";
"Mark thread as failed": "error.platform.Thread queue.Processing:invocation[0]";
"Push thread to queue": "Add thread to queue";
"Reorder queue": "Add thread to queue" | "Update thread's priority";
"Reset currently processed thread id": "done.invoke.Thread queue.Processing:invocation[0]" | "error.platform.Thread queue.Processing:invocation[0]";
"Take thread from queue": "";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "A thread is available for processing": "";
"Thread is in queue": "Update thread's priority";
        };
        eventsCausingServices: {
          "Process thread": "";
        };
        matchesStates: "Idle" | "Processing";
        tags: never;
      }
  
