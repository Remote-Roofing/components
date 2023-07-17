import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  defaultAnimateLayoutChanges,
} from '@dnd-kit/sortable';
import { SortableTag } from './SortableTag';
import { Label, Tag } from './TagPicker';
import { CSS } from '@dnd-kit/utilities';
import { CSSProperties, ReactNode } from 'react';
import { GripVerticalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableLabelProps {
  label?: Label;
  tags: Tag[];
}

export function SortableLabel({ label, tags }: SortableLabelProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: label?.id ?? 'default',
      animateLayoutChanges: args =>
        defaultAnimateLayoutChanges({
          ...args,
          isSorting: true,
        }),
    });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <div style={style} ref={setNodeRef}>
      {label && (
        <div className='flex items-center gap-1'>
          <Button
            size='icon'
            variant='ghost'
            className='mr-1 -ml-1'
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className='w-4 h-4 text-slate-500' />
          </Button>
          <div className='font-semibold text-[#606060]'>{label.name}</div>
        </div>
      )}
      <SortableContext items={tags} strategy={verticalListSortingStrategy}>
        {tags.map(tag => (
          <SortableTag key={tag.id} tag={tag} />
        ))}
      </SortableContext>
    </div>
  );
}
