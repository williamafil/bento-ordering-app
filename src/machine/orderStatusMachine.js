import { createMachine, assign } from "xstate";

export const resettledAction = assign({
  resettle: (context, event) => context.resettle + 1,
});

export const orderStatusMachine = createMachine({
  id: "orderStatusMachine",
  initial: "pending",
  context: {
    resettle: 0,
  },
  states: {
    pending: {
      on: {
        PROCEEDING: "inProgress",
        CANCELING: "canceled",
      },
    },
    inProgress: {
      on: {
        READY_TO_GO: "ready",
        CANCELING: "canceled",
      },
    },
    ready: {
      on: {
        DELIVERED: "delivered",
      },
    },
    delivered: {},
    canceled: {
      on: {
        RESET: {
          target: "pending",
          actions: "resettledAction",
        },
      },
    },
  },
});
