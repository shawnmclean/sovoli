import { logger, task, wait } from "@trigger.dev/sdk/v3";

//1. You need to export each task
export const helloWorld = task({
  //2. Use a unique id for each task
  id: "hello-world",
  //3. The run function is the main function of the task
  run: async ({ message }: { message: string }, { ctx }) => {
    logger.log(`q: ${message}`, { message, ctx });

    await wait.for({ seconds: 5 });

    return {
      message: `Hello, ${message}!`,
    };
  },
});
