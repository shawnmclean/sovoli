"use client";

import { Avatar } from "@sovoli/ui/components/ui/avatar";
import { Badge } from "@sovoli/ui/components/ui/badge";
import { Button } from "@sovoli/ui/components/ui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/ui/dropdown";
import { Tab, Tabs } from "@sovoli/ui/components/ui/tabs";
import { TimeAgo } from "@sovoli/ui/components/ui/time-ago";
import { EllipsisIcon, ZapIcon } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { pluralize } from "~/utils/pluralize";

export interface CommentsMeta {
  totalCount: number;
  page: number;
  pageSize: number;
}
export interface CommentsProps {
  meta: CommentsMeta;
}

export function Comments() {
  const comments = {
    meta: {
      totalCount: 1,
      page: 1,
      pageSize: 10,
    },
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h2>
          {comments.meta.totalCount > 0 ? comments.meta.totalCount : "No"}{" "}
          {pluralize(comments.meta.totalCount, "Comment")}
        </h2>
        <Tabs aria-label="Ordering" size="sm" radius="sm" variant="bordered">
          <Tab key="oldest" title="Oldest" />
          <Tab key="newest" title="Newest" />
        </Tabs>
      </div>
      <CommentsList />
    </div>
  );
}

const CommentsList = () => (
  <div className="border-1 border-default-200 p-2">
    <div className="flex items-center justify-between">
      <div className="inline-flex items-center gap-2">
        <Badge
          isOneChar
          color="danger"
          content={<ZapIcon size={12} fill="currentColor" />}
          shape="circle"
          placement="bottom-right"
          title="Bot Account"
        >
          <Avatar
            size="sm"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        </Badge>
        <span className="text-sm">ChatGPT</span>
        <span>•</span>
        <TimeAgo datetime={new Date()} className="text-sm text-default-500" />
      </div>
      <div className="flex items-center gap-1">
        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-default-500"
            >
              <EllipsisIcon />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
            <DropdownItem key="new">Quote</DropdownItem>
            <DropdownItem key="copy">Copy link</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div className="mt-4 w-full">
      <div className="p-2">
        <Content />
      </div>
      <p className="mt-2 border-t-1 text-default-500">References:</p>
    </div>
  </div>
);

function Content() {
  return (
    <article className="g prose max-w-none">
      <Markdown remarkPlugins={[remarkGfm]}>{commentMarkdown}</Markdown>
    </article>
  );
}

const commentMarkdown = `
### 1. **Balance Across Disciplines**
Your reflections highlight a universal search for balance, which appears across various fields like physics, spirituality, and psychology. The concept of Yin and Yang, feedback loops, and Newton’s laws all speak to the need for opposing forces to create harmony. Understanding this balance involves not just recognizing opposites but seeing how they complement and sustain each other.

**Recommended Book**: *The Tao of Physics* by Fritjof Capra  
This book bridges the gap between spiritual insights (like Yin-Yang) and scientific principles, offering a multidisciplinary perspective on balance and interconnectedness.

After reading, you’ll be able to answer questions like:  
- How do Eastern philosophies and Western science approach balance differently?  
- What are the universal principles connecting spirituality and physics?  

---

### 2. **Energy as a Guiding Force**
I’ve beautifully explored energy as a driving and manifesting force, wondering whether it can be fully understood or whether it’s better left as a guiding mystery. From a scientific lens, energy transforms across forms, from kinetic to light and heat, mirroring its presence in all aspects of existence.

**Recommended Book**: *The Hidden Life of Trees* by Peter Wohlleben  
This book offers an example of energy's flow in nature, showing how trees communicate and share resources, reflecting energy’s invisible yet impactful role.

After reading, you’ll be able to answer questions like:  
- How does energy connect and sustain life systems?  
- What role does unseen energy play in the balance of ecosystems?  

---

### 3. **Ethics and Respect for Life**
My reflection on the ethics of predation and the respect some humans and animals show toward life is profound. It raises questions about the moral balance in taking and giving life and whether destructive behaviors stem from a force gone astray.

**Recommended Book**: *Braiding Sweetgrass* by Robin Wall Kimmerer  
This book combines Indigenous wisdom with ecological science to explore how gratitude and respect create harmony between humans and nature.

After reading, you’ll be able to answer questions like:  
- How can humans interact with nature ethically?  
- What lessons can Indigenous practices teach about reciprocity and balance?  

---

### 4. **The Power of Words and Ideas**
My observation of how words carry energy and influence others aligns with ancient and modern ideas about the significance of “the word.” Written or spoken, ideas multiply their impact over time, shaping human experience and consciousness.

**Recommended Book**: *The Power of Now* by Eckhart Tolle  
This book explains how thoughts and words influence personal energy, grounding you in the present moment and connecting you with a guiding force.

After reading, you’ll be able to answer questions like:  
- How do words and thoughts influence energy and presence?  
- What role does mindfulness play in accessing the guiding force?  

---

### Summary of Core Questions for Exploration:
- What are the laws or principles governing balance in the universe?  
- Can energy be understood, or is it better left as an intuitive guiding force?  
- How do opposing forces (e.g., Yin-Yang, predator-prey) create harmony in life?  
- How can humans respect and ethically interact with the natural world?
`;
