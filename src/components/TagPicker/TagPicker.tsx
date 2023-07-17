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
      yellow: 'bg-badge-yellow hover:bg-badge-yellow/80',
      red: 'bg-badge-red hover:bg-badge-red/80',
      grey: 'bg-badge-grey hover:bg-badge-grey/80',
      pink: 'bg-badge-pink hover:bg-badge-pink/80',
      blue: 'bg-badge-blue hover:bg-badge-blue/80',
      orange: 'bg-badge-orange hover:bg-badge-orange/80',
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
  defaultTags?: Tag[];
  onTagSelected: (tag: Tag) => void;
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
  const [tags, setTags] = useState<Tag[]>(props.defaultTags ?? []);

  function insertTag() {
    if (!search) return;
    if (search.trim().length === 0) return;
    if (tags.some(tag => tag.name === search)) return;
    setTags(
      tags.concat({
        id: nanoid(5),
        name: search,
        color: 'grey',
      })
    );
    setSearch('');
  }

  function editTag(tag: Tag) {
    if (!tag.name) return;
    if (tag.name.trim().length === 0) return;
    if (tags.some(t => t.name === tag.name)) return;
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
      <DropdownMenuContent className='pb-0 pr-0'>
        <DropdownMenuLabel>
          <Input
            placeholder='Search or add tag'
            value={search}
            autoFocus
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                insertTag();
              }
            }}
          />
          <p className='pt-1 text-xs text-gray-600'>
            Select an option or create one
          </p>
          {search.trim().length > 0 && (
            <>
              <Button
                variant='ghost'
                className='w-full p-2 my-1 text-left justify-normal'
                onClick={insertTag}
              >
                <PlusIcon className='mr-1' />
                Create
                <Badge variant='outline' className='ml-1'>
                  {search.length > 15 ? `${search.slice(0, 15)}...` : search}
                </Badge>
              </Button>
            </>
          )}
        </DropdownMenuLabel>
        <ScrollArea className='w-full m-0 mr-0 h-fit'>
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
                  .filter(tag => tag.name.toLowerCase().includes(search))
                  .map(tag => (
                    <SortableTag
                      key={tag.id}
                      tag={tag}
                      editTag={editTag}
                      deleteTag={deleteTag}
                      onTagSelected={props.onTagSelected}
                    />
                  ))}
              </SortableContext>
              {/* Temporarily comment out the overlay */}
              {/* {activeTag &&
                createPortal(
                  <DragOverlay>
                    <SortableTag
                      tag={activeTag}
                      editTag={editTag}
                      deleteTag={deleteTag}
                      onTagSelected={props.onTagSelected}
                      isDragging
                    />
                  </DragOverlay>,
                  document.body
                )} */}
            </DndContext>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
