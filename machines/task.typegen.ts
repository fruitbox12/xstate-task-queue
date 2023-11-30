
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "xstate.after(1000)#Thread.Waiting for resources to be available": { type: "xstate.after(1000)#Thread.Waiting for resources to be available" };
"xstate.after(500)#Thread.Executing first step": { type: "xstate.after(500)#Thread.Executing first step" };
"xstate.after(500)#Thread.Executing second step": { type: "xstate.after(500)#Thread.Executing second step" };
"xstate.after(500)#Thread.Getting context of the thread": { type: "xstate.after(500)#Thread.Getting context of the thread" };
"xstate.after(500)#Thread.Releasing resources": { type: "xstate.after(500)#Thread.Releasing resources" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "Thread succeeded": "xstate.after(500)#Thread.Executing second step";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "Done" | "Executing first step" | "Executing second step" | "Failed" | "Getting context of the thread" | "Releasing resources" | "Waiting for resources to be available";
        tags: never;
      }
  
