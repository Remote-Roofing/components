import React, { useState } from 'react';
import { useAddonState } from '@storybook/manager-api';

import { Meta, StoryObj } from '@storybook/react';

import { TagPicker, Tag, Badge, colorCircle } from '../components/TagPicker';
import { cn } from '@/lib/utils';

const meta: Meta<typeof TagPicker> = {
  component: TagPicker,
};

type Story = StoryObj<typeof TagPicker>;

function MultiSelectTagPickerWithDefaultTags() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  return (
    <div className='flex flex-col items-center gap-10'>
      <TagPicker
        defaultTags={[
          { id: '1', name: 'Tag 1', color: 'blue' },
          { id: '2', name: 'Tag 2', color: 'red' },
          { id: '3', name: 'Tag 3', color: 'yellow' },
          { id: '4', name: 'Tag 4', color: 'orange' },
          { id: '5', name: 'Tag 5', color: 'red' },
          { id: '6', name: 'Tag 6', color: 'pink' },
          { id: '7', name: 'Tag 7', color: 'blue' },
          { id: '8', name: 'Tag 8', color: 'grey' },
          { id: '9', name: 'Tag 9', color: 'orange' },
        ]}
        renderBadge={tag => (
          <Badge
            key={tag.id}
            onClick={() => setSelectedTags([...selectedTags, tag])}
            className={cn('cursor-pointer', colorCircle({ color: tag.color }))}
          >
            {tag.name}
          </Badge>
        )}
      />
      <h2 className='text-2xl font-bold'>Selected Tags:</h2>
      {selectedTags.map(tag => (
        <Badge
          // onClick={() => setSelectedTag(null)}
          className={cn('cursor-pointer', colorCircle({ color: tag.color }))}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}

function MultiSelectTagPicker() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  return (
    <div className='flex flex-col items-center gap-10'>
      <TagPicker
        renderBadge={tag => (
          <Badge
            key={tag.id}
            onClick={() => setSelectedTags([...selectedTags, tag])}
            className={cn('cursor-pointer', colorCircle({ color: tag.color }))}
          >
            {tag.name}
          </Badge>
        )}
      />
      <h2 className='text-2xl font-bold'>Selected Tags:</h2>
      {selectedTags.map(tag => (
        <Badge
          // onClick={() => setSelectedTag(null)}
          className={cn('cursor-pointer', colorCircle({ color: tag.color }))}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}

function SingleSelectTagPicker() {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  return (
    <div className='flex flex-col items-center gap-10'>
      <TagPicker
        renderBadge={tag => (
          <Badge
            key={tag.id}
            onClick={() => setSelectedTag(tag)}
            className={cn('cursor-pointer', colorCircle({ color: tag.color }))}
          >
            {tag.name}
          </Badge>
        )}
      />
      <h2 className='text-2xl font-bold'>Selected Tag:</h2>
      {selectedTag && (
        <Badge
          // onClick={() => setSelectedTag(null)}
          className={cn(
            'cursor-pointer',
            colorCircle({ color: selectedTag.color })
          )}
        >
          {selectedTag.name}
        </Badge>
      )}
    </div>
  );
}

export default meta;

export const MultiSelectWithDefaultTags: Story = {
  render: () => <MultiSelectTagPickerWithDefaultTags />,
};

export const MultiSelect: Story = {
  render: () => <MultiSelectTagPicker />,
};

export const SingleSelect: Story = {
  render: () => <SingleSelectTagPicker />,
};
