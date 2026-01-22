import { Button } from "@sovoli/ui/components/button";
import { ExternalLinkIcon } from "lucide-react";
import { useEffect } from "react";
import type { ChatMessage } from "../types";
import { AgeChatInput } from "./ChatInput/AgeChatInput";
import type { FamilyMember } from "./FamilyDrawer";

// Message bubble component
interface MessageBubbleProps {
  isUser: boolean;
  timestamp: Date;
  text: string;
}

function MessageBubble({ isUser, timestamp, text }: MessageBubbleProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-default-100 text-default-foreground rounded-bl-md"
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        <p
          className={`text-xs mt-1 ${
            isUser ? "text-primary-foreground/70" : "text-default-500"
          }`}
        >
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

interface MessageRendererProps {
  message: ChatMessage;
  familyMembers: FamilyMember[];
  onAddFamilyMember: (member: FamilyMember) => void;
  onToolResult: (params: {
    tool: string;
    toolCallId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    output: any;
  }) => Promise<void>;
  onAddMessage: (message: ChatMessage) => Promise<void>;
  onScrollToBottom: () => void;
  onFlowComplete: () => void;
  familyMembersRef: React.MutableRefObject<FamilyMember[]>;
}

export function MessageRenderer({
  message,
  familyMembers,
  onAddFamilyMember,
  onToolResult,
  onAddMessage,
  onScrollToBottom,
  onFlowComplete,
  familyMembersRef,
}: MessageRendererProps) {
  return (
    <div key={message.id}>
      {message.parts.map((part, index) => {
        const key = `${message.id}-${index}`;

        switch (part.type) {
          case "text":
            return (
              <MessageBubble
                key={key}
                isUser={message.role === "user"}
                timestamp={new Date()}
                text={part.text}
              />
            );

          case "tool-setupFamily":
            return <ToolSetupFamily key={key} part={part} />;

          case "tool-getAge":
            return (
              <ToolGetAge
                key={key}
                part={part}
                familyMembers={familyMembers}
                onAddFamilyMember={onAddFamilyMember}
                onToolResult={onToolResult}
                onAddMessage={onAddMessage}
              />
            );

          case "tool-getMoreChildren":
            return (
              <ToolGetMoreChildren
                key={key}
                part={part}
                familyMembersRef={familyMembersRef}
                onToolResult={onToolResult}
                onAddMessage={onAddMessage}
                onFlowComplete={onFlowComplete}
              />
            );

          case "tool-programSuggestions":
            return (
              <ToolProgramSuggestions
                key={key}
                part={part}
                familyMembersRef={familyMembersRef}
                onToolResult={onToolResult}
                onScrollToBottom={onScrollToBottom}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

// Tool-specific components

interface ToolSetupFamilyProps {
  part: Extract<ChatMessage["parts"][number], { type: "tool-setupFamily" }>;
}

function ToolSetupFamily({ part }: ToolSetupFamilyProps) {
  switch (part.state) {
    case "input-streaming":
      return <div>Input streaming</div>;
    case "input-available":
      return <div>Family Input available</div>;
    case "output-available":
      return (
        <div className="mt-2 px-2 py-1 bg-default-100 rounded-md">
          <span className="text-default-600 text-xs">
            {part.output.success
              ? "✓ Family setup completed"
              : "✗ Family setup failed"}
          </span>
        </div>
      );
    default:
      return <div>Calling tool setupFamily</div>;
  }
}

interface ToolGetAgeProps {
  part: Extract<ChatMessage["parts"][number], { type: "tool-getAge" }>;
  familyMembers: FamilyMember[];
  onAddFamilyMember: (member: FamilyMember) => void;
  onToolResult: (params: {
    tool: string;
    toolCallId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    output: any;
  }) => Promise<void>;
  onAddMessage: (message: ChatMessage) => Promise<void>;
}

function ToolGetAge({
  part,
  familyMembers,
  onAddFamilyMember,
  onToolResult,
  onAddMessage,
}: ToolGetAgeProps) {
  const callId = part.toolCallId;

  switch (part.state) {
    case "input-streaming":
      return <div>Input streaming</div>;
    case "input-available":
      return (
        <AgeChatInput
          onSubmit={(value) => {
            void (async () => {
              // Calculate total age for the family member
              const totalYears = value.years + value.months / 12;

              // Create new family member
              const newMember: FamilyMember = {
                id: crypto.randomUUID(),
                name: `Child ${familyMembers.length + 1}`,
                relationship: "Child",
                age: Math.floor(totalYears),
                notes: `${value.years} years, ${value.months} months`,
              };

              // Add to family members
              onAddFamilyMember(newMember);

              await onToolResult({
                tool: "getAge",
                toolCallId: callId,
                output: value,
              });

              await onAddMessage({
                role: "assistant",
                id: crypto.randomUUID(),
                parts: [
                  {
                    type: "text",
                    text: "Thank you! Now, do you want to add another child?",
                  },
                  {
                    type: "tool-getMoreChildren",
                    state: "input-available",
                    toolCallId: crypto.randomUUID(),
                    input: {},
                  },
                ],
              });
            })();
          }}
        />
      );
    case "output-available":
      return (
        <div className="mt-2 px-2 py-1 bg-default-100 rounded-md">
          <span className="text-default-600 text-xs">
            ✓ Age recorded: {part.output.years} years
            {part.output.months > 0 && <> {part.output.months}m</>}
          </span>
        </div>
      );
    default:
      return <div>Calling tool getAge</div>;
  }
}

interface ToolGetMoreChildrenProps {
  part: Extract<ChatMessage["parts"][number], { type: "tool-getMoreChildren" }>;
  familyMembersRef: React.MutableRefObject<FamilyMember[]>;
  onToolResult: (params: {
    tool: string;
    toolCallId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    output: any;
  }) => Promise<void>;
  onAddMessage: (message: ChatMessage) => Promise<void>;
  onFlowComplete: () => void;
}

function ToolGetMoreChildren({
  part,
  familyMembersRef,
  onToolResult,
  onAddMessage,
  onFlowComplete,
}: ToolGetMoreChildrenProps) {
  const callId = part.toolCallId;

  switch (part.state) {
    case "input-streaming":
      return <div>Input streaming</div>;
    case "input-available": {
      const handleAddChild = async () => {
        await onToolResult({
          tool: "getMoreChildren",
          toolCallId: callId,
          output: { choice: "add" },
        });

        await onAddMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "How old is your child?",
            },
            {
              type: "tool-getAge",
              state: "input-available",
              toolCallId: crypto.randomUUID(),
              input: {},
            },
          ],
        });
      };

      const handleContinue = async () => {
        await onToolResult({
          tool: "getMoreChildren",
          toolCallId: callId,
          output: { choice: "done" },
        });

        // Call programSuggestions tool
        await onAddMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "Let me find the best programs for your children...",
            },
            {
              type: "tool-programSuggestions",
              state: "input-available",
              toolCallId: crypto.randomUUID(),
              input: {
                familyMemberIds: familyMembersRef.current.map((m) => m.id),
              },
            },
          ],
        });

        // Mark flow as complete to show quick replies
        onFlowComplete();
      };

      return (
        <div className="flex gap-3 mt-3">
          <Button
            variant="bordered"
            onPress={handleAddChild}
            className="flex-1"
          >
            Yes
          </Button>
          <Button onPress={handleContinue} className="flex-1">
            No, Continue
          </Button>
        </div>
      );
    }
    case "output-available":
      return (
        <div className="mt-2 px-2 py-1 bg-default-100 rounded-md">
          <span className="text-default-600 text-xs">
            {part.output.choice === "add"
              ? "→ Adding another child"
              : "✓ Family setup complete"}
          </span>
        </div>
      );
    default:
      return null;
  }
}

interface ToolProgramSuggestionsProps {
  part: Extract<
    ChatMessage["parts"][number],
    { type: "tool-programSuggestions" }
  >;
  familyMembersRef: React.MutableRefObject<FamilyMember[]>;
  onToolResult: (params: {
    tool: string;
    toolCallId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    output: any;
  }) => Promise<void>;
  onScrollToBottom: () => void;
}

function ToolProgramSuggestions({
  part,
  familyMembersRef,
  onToolResult,
  onScrollToBottom,
}: ToolProgramSuggestionsProps) {
  const callId = part.toolCallId;

  // Auto-execute the tool to fetch program suggestions from API when state becomes input-available
  useEffect(() => {
    if (part.state !== "input-available") {
      return;
    }

    void (async () => {
      try {
        const response = await fetch("/api/programs/suggestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            familyMembers: familyMembersRef.current,
          }),
        });

        const data = (await response.json()) as {
          suggestions: {
            familyMemberId: string;
            familyMemberName: string;
            programs: {
              id: string;
              slug: string;
              name: string;
              description?: string;
              ageRange?: string;
              price?: number;
              currency?: string;
              billingCycle?: string;
            }[];
          }[];
        };

        await onToolResult({
          tool: "programSuggestions",
          toolCallId: callId,
          output: data,
        });
        onScrollToBottom();
      } catch (error) {
        console.error("Error fetching program suggestions:", error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [part.state, callId]);

  switch (part.state) {
    case "input-streaming":
      return (
        <div className="flex items-center gap-2 text-sm text-default-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          Finding best programs...
        </div>
      );
    case "input-available":
      return (
        <div className="flex items-center gap-2 text-sm text-default-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          Analyzing program options...
        </div>
      );
    case "output-available":
      return (
        <div className="mt-3 space-y-3">
          {part.output.suggestions.map((suggestion) => (
            <div key={suggestion.familyMemberId} className="space-y-2">
              <h4 className="text-sm font-medium text-default-600">
                For {suggestion.familyMemberName}
              </h4>
              <div className="space-y-2">
                {suggestion.programs.map((program) => (
                  <a
                    key={program.id}
                    href={`/programs/${program.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 bg-default-50 hover:bg-default-100 border border-divider hover:border-primary/50 rounded-lg p-3 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-medium text-foreground group-hover:text-primary truncate transition-colors">
                          {program.name}
                        </h5>
                        <ExternalLinkIcon className="w-3 h-3 text-default-400 group-hover:text-primary shrink-0 transition-colors" />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {program.ageRange && (
                          <p className="text-xs text-default-500">
                            {program.ageRange}
                          </p>
                        )}
                        {program.price && (
                          <>
                            {program.ageRange && (
                              <span className="text-xs text-default-400">
                                •
                              </span>
                            )}
                            <p className="text-xs font-medium text-primary">
                              {program.currency}{" "}
                              {program.price.toLocaleString()}
                              {program.billingCycle &&
                                program.billingCycle !== "one-time" && (
                                  <span className="text-default-500 font-normal">
                                    {" "}
                                    / {program.billingCycle}
                                  </span>
                                )}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}
