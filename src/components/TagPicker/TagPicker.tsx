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

export type Label = Omit<Tag, 'color'> & { tags?: Tag[] };

export interface Tag {
  id: string;
  name: string;
  color: string;
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
                    color: '#000000',
                  })
                );
                setSearch('');
              }
            }}
          />
        </DropdownMenuLabel>
        <div className='flex flex-col gap-3 m-3'>
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
              {tags.map(tag => (
                <SortableTag
                  key={tag.id}
                  tag={tag}
                  renderBadge={props.renderBadge}
                />
              ))}
            </SortableContext>
            {activeTag &&
              createPortal(
                <DragOverlay>
                  <SortableTag
                    tag={activeTag}
                    renderBadge={props.renderBadge}
                  />
                </DragOverlay>,
                document.body
              )}
          </DndContext>
        </div>
        {search.trim().length > 0 && (
          <>
            <DropdownMenuItem
              onClick={() => {
                setTags(
                  tags.concat({
                    id: nanoid(5),
                    name: search,
                    color: '#000000',
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
