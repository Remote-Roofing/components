import { DragOverEvent, DragOverlay, closestCorners } from '@dnd-kit/core';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PlusIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import { PropsWithChildren, ReactNode, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import { SortableTag } from './SortableTag';
import { createPortal } from 'react-dom';
import { cva } from 'class-variance-authority';
import { ScrollArea } from '../ui/scroll-area';

export type Label = Omit<Tag, 'color'> & { tags?: Tag[] };

export const colors = [
  'yellow',
  'red',
  'grey',
  'pink',
  'blue',
  'orange',
] as const;

export const colorCircle = cva(colors, {
  variants: {
    color: {
      yellow: 'bg-[#E5C65A]',
      red: 'bg-[#DA615D]',
      grey: 'bg-[#667085]',
      pink: 'bg-[#C95AE5]',
      blue: 'bg-[#5A60E5]',
      orange: 'bg-[#E59D5A]',
    },
  },
});

export interface Tag {
  id: string;
  name: string;
  color: (typeof colors)[number];
  labelId?: string;
}

interface TagPickerProps {
  renderBadge: (tag: Tag) => ReactNode;
}

export function TagPicker(props: PropsWithChildren<TagPickerProps>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<Tag | undefined>();
  const [tags, setTags] = useState<Tag[]>([]);

  function editTag(tag: Tag) {
    setTags(tags => tags.map(t => (t.id === tag.id ? tag : t)));
  }

  function deleteTag(tagId: string) {
    setTags(tags => tags.filter(tag => tag.id !== tagId));
  }

  function handleDragEnd(e: DragOverEvent) {
    const overId = e.over?.id;
    const activeId = e.active?.id;

    if (overId && activeId && overId !== activeId) {
      const oldIndex = tags.findIndex(tag => tag.id === activeId);
      const newIndex = tags.findIndex(tag => tag.id === overId);

      setTags(t => {
        console.log(t);
        return arrayMove(tags, oldIndex, newIndex);
      });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <Input
            placeholder='Search or add tag'
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setTags(
                  tags.concat({
                    id: nanoid(5),
                    name: search,
                    color: 'grey',
                  })
                );
                setSearch('');
              }
            }}
          />
        </DropdownMenuLabel>
        <ScrollArea className='w-48 m-3 h-fit'>
          <div className='flex flex-col gap-3 max-h-56'>
            <DndContext
              sensors={sensors}
              onDragStart={e => {
                const activeTagId = e.active.id;
                setActiveTag(tags.find(tag => tag.id === activeTagId));
              }}
              onDragEnd={handleDragEnd}
              collisionDetection={closestCorners}
            >
              <SortableContext
                items={tags}
                strategy={verticalListSortingStrategy}
              >
                {tags
                  .filter(tag => tag.name.includes(search))
                  .map(tag => (
                    <SortableTag
                      key={tag.id}
                      tag={tag}
                      renderBadge={props.renderBadge}
                      editTag={editTag}
                      deleteTag={deleteTag}
                    />
                  ))}
              </SortableContext>
              {activeTag &&
                createPortal(
                  <DragOverlay>
                    <SortableTag
                      tag={activeTag}
                      renderBadge={props.renderBadge}
                      editTag={editTag}
                      deleteTag={deleteTag}
                      isDragging
                    />
                  </DragOverlay>,
                  document.body
                )}
            </DndContext>
          </div>
        </ScrollArea>
        {search.trim().length > 0 && (
          <>
            <DropdownMenuItem
              onClick={() => {
                setTags(
                  tags.concat({
                    id: nanoid(5),
                    name: search,
                    color: 'grey',
                  })
                );
                setSearch('');
              }}
            >
              <PlusIcon className='mr-1' />
              Create
              <Badge variant='outline' className='ml-1'>
                {search}
              </Badge>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
