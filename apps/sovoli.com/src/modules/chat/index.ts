export { ChatDialog } from "./components/ChatDialog";
export { ChatDialogExample } from "./components/ChatDialogExample";
export { FamilyDrawer } from "./components/FamilyDrawer";
export { GuidedChatFlow } from "./components/GuidedChatFlow";
export { GuidedFlowManager } from "./components/GuidedFlowManager";
export { AgePickerDrawer } from "./components/ChatInput/AgePickerDrawer";
export { UnifiedMessageBubble } from "./components/UnifiedMessageBubble";

export type { ChatMessage, ChatDialogProps } from "./components/ChatDialog";
export type { FamilyMember } from "./components/FamilyDrawer";
export type {
  Audience,
  QuestionType,
  Question,
  QuestionResponse,
  ChatFlow,
  FlowStep,
  ProgramInfo,
  AgeSelection,
  QuickReplyOption,
} from "./types/guided-chat";

export {
  createFlow,
  createParentFlow,
  createStudentFlow,
} from "./config/flows";
export {
  getProgramForAge,
  formatAgeDisplay,
  PROGRAMS,
} from "./utils/programMapping";

// New unified message system
export { useMessageManager } from "./hooks/useMessageManager";
export type {
  UnifiedMessage,
  MessageType,
  QuestionState,
  GuidedFlowState,
} from "./types/message";
