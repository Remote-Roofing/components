import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DeleteIcon,
  EditIcon,
  GripVerticalIcon,
  MoreVerticalIcon,
  TrashIcon,
} from 'lucide-react';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { MouseEvent } from 'react';

import { Tag, colorCircle, colors } from './TagPicker';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';

interface SortableTagProps {
  tag: Tag;
  renderBadge: (tag: Tag) => ReactNode;
  editTag: (tag: Tag) => void;
}

export function SortableTag(props: SortableTagProps) {
  const [name, setName] = useState(props.tag.name);
  const [color, setColor] = useState<(typeof colors)[number]>(props.tag.color);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.tag.id,
      animateLayoutChanges: args =>
        defaultAnimateLayoutChanges({
          ...args,
          isSorting: true,
        }),
    });

  useEffect(() => {
    const tag = { ...props.tag, name, color } satisfies Tag;
    props.editTag(tag);
  }, [name, color]);

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className='flex items-center justify-between'>
      <div
        ref={setNodeRef}
        style={style}
        className='flex items-center justify-between'
      >
        <div className='flex items-center'>
          <Button
            size='icon'
            variant='ghost'
            className='mr-1 -ml-1'
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className='w-4 h-4 text-slate-500' />
          </Button>
          {props.renderBadge(props.tag)}
        </div>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button size='icon' variant='ghost' className='mr-1 -ml-1'>
            <MoreVerticalIcon className='w-4 h-4 text-slate-500' />
          </Button>
        </PopoverTrigger>
        <PopoverContent asChild className='w-80'>
          <div className='flex flex-col gap-3'>
            <div className='relative'>
              <EditIcon className='absolute w-5 h-5 top-2.5 left-1.5' />
              <Input
                value={name}
                autoFocus
                onChange={e => setName(e.target.value)}
                className='pl-8'
              />
            </div>
            <Button
              variant='ghost'
              className='text-[#606060] items-center gap-2 justify-start'
            >
              <TrashIcon className='w-5 h-5' />
              Delete
            </Button>
            <Separator className='my-1' />
            <div className='flex flex-col gap-2'>
              {colors.map(color => (
                <Button
                  variant='ghost'
                  className='items-center justify-start gap-2'
                  onClick={() => setColor(color)}
                >
                  <div
                    className={cn(
                      'rounded-full w-5 h-5',
                      colorCircle({ color })
                    )}
                  ></div>
                  <span>
                    {color.slice(0, 1).toUpperCase() + color.slice(1)}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
