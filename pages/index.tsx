import {
  Heading,
  Box,
  Container,
  Text,
  Code,
  VStack,
  Badge,
  HStack,
  ThemeTypings,
  FormControl,
  FormLabel,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Button,
  Spacer,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { useMachine } from "@xstate/react";
import Head from "next/head";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { threadQueueMachine } from "~/machines/threadQueue";
import { ThreadStatus, ThreadType } from "~/types";

const addThreadSchema = zfd.formData({
  instances: zfd.numeric(z.number().int().min(1).max(10)),
  "thread-type": zfd.text(ThreadType),
});

export default function Home() {
  const [state, send] = useMachine(threadQueueMachine);
  const threads = Object.values(state.context.threads);

  return (
    <>    <iframe
        className="responsive-iframe"
        src="https://mesh-xi.vercel.app/"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",

          border: "none",
          zIndex: -1,
        }}
      ></iframe> 
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative">
        <Box py="10" style={{background: "white"}}>
          <Container maxW="3xl">

            <Box borderWidth={1} p="4" mt="4">
              <Box>
                <Text>
                  Current state of the queue:{" "}
                  <Code>{String(state.value)}</Code>
                </Text>

                <Text mt="6">Threads:</Text>

                <VStack mt="2" spacing="2" alignItems="stretch">
                  {threads.length === 0 ? (
                    <Text>No thread in queue. Add a thread below.</Text>
                  ) : (
                    threads.map(({ id, status, instances, threadType }) => {
                      const badgeColors: Record<
                        ThreadStatus,
                        ThemeTypings["colorSchemes"]
                      > = {
                        "waiting for processing": "gray",
                        processing: "orange",
                        done: "green",
                        errored: "red",
                      };

                      return (
                        <HStack
                          key={id}
                          spacing="2"
                          borderWidth={1}
                          borderRadius="sm"
                          p="2"
                        >
                          <Text fontWeight="bold">#{id}</Text>

                          <Badge colorScheme={badgeColors[status]}>
                            {status}
                          </Badge>

                          <Badge
                            colorScheme={
                              threadType === "TestRun" ? "blue" : "teal"
                            }
                          >
                            {threadType}
                          </Badge>

                          <Spacer />

                          <FormControl w="auto">
                            <HStack spacing="4">
                              <FormLabel m={0}>Instances</FormLabel>

                              <NumberInput
                                size="sm"
                                maxW={16}
                                value={instances}
                                min={1}
                                max={10}
                                onChange={(_, newInstances) => {
                                  send({
                                    type: "Update thread's instances",
                                    id,
                                    newInstances,
                                  });
                                }}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </HStack>
                          </FormControl>
                        </HStack>
                      );
                    })
                  )}
                </VStack>
              </Box>

              <Box mt="10">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();

                    const { instances, "thread-type": threadType } =
                      addThreadSchema.parse(
                        new FormData(event.target as HTMLFormElement)
                      );

                    send({
                      type: "Add thread to queue",
                      instances,
                      threadType,
                    });
                  }}
                >
                  <VStack spacing="4" alignItems="stretch">
                    <Heading size="md">Add a thread</Heading>

                    <FormControl>
                      <FormLabel>Instances</FormLabel>

                      <NumberInput
                        name="instances"
                        defaultValue={1}
                        min={1}
                        max={10}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>

                      <FormHelperText>
                        By default the instances is 1. 10 is max instances.
                      </FormHelperText>
                    </FormControl>

                    <FormControl as="fieldset">
                      <FormLabel as="legend">
                        Type of the thread to launch
                      </FormLabel>

                      <RadioGroup name="thread-type" defaultValue="TestRun">
                        <HStack spacing="24px">
                          {ThreadType.options.map((type) => (
                            <Radio key={type} value={type}>
                              {type}
                            </Radio>
                          ))}
                        </HStack>
                      </RadioGroup>
                    </FormControl>

                    <Flex justifyContent="end">
                      <Button type="submit">Submit</Button>
                    </Flex>
                  </VStack>
                </form>
              </Box>
            </Box>
          </Container>
        </Box>

        <Flex
          position="absolute"
          top={0}
          right={0}
          justifyContent="center"
          alignItems="center"
          p="1"
          m="4"
          color="white"
          bg="gray.800"
          rounded="md"
          shadow="lg"
        >
          <a href="https://github.com/Devessier/xstate-thread-queue">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              ></path>
            </svg>
          </a>
        </Flex>
      </main>
    </>
  );
}
