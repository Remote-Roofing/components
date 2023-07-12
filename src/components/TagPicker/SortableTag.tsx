import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon } from "lucide-react";
import { CSSProperties, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { Tag } from "./TagPicker";

interface SortableTagProps {
  tag: Tag;
  renderBadge: (tag: Tag) => ReactNode;
}

export function SortableTag(props: SortableTagProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.tag.id,
      animateLayoutChanges: args =>
        defaultAnimateLayoutChanges({
          ...args,
          isSorting: true,
        }),
    });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <DropdownMenuItem ref={setNodeRef} style={style}>
      <Button
        size="icon"
        variant="ghost"
        className="mr-1 -ml-1"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="w-4 h-4 text-slate-500" />
      </Button>
      {props.renderBadge(props.tag)}
    </DropdownMenuItem>
  );
}
