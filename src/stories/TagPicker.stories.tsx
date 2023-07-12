import React, { useState } from 'react';
import { useAddonState } from '@storybook/manager-api';

import { Meta, StoryObj } from '@storybook/react';

import { TagPicker, Tag, Badge, colorCircle } from '../components/TagPicker';
import { cn } from '@/lib/utils';

const meta: Meta<typeof TagPicker> = {
  component: TagPicker,
};

type Story = StoryObj<typeof TagPicker>;

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

export const MultiSelect: Story = {
  render: () => <MultiSelectTagPicker />,
};

export const SingleSelect: Story = {
  render: () => <SingleSelectTagPicker />,
};
