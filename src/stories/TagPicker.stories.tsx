import React, { useState } from 'react';
import { useAddonState } from '@storybook/manager-api';

import { Meta, StoryObj } from '@storybook/react';

import { TagPicker, Tag, Badge, colorCircle } from '../components/TagPicker';
import { cn } from '@/lib/utils';

const meta: Meta<typeof TagPicker> = {
  component: TagPicker,
};

type Story = StoryObj<typeof TagPicker>;

function TagPickerWithHooks() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  return (
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
  );
}

export default meta;

export const Primary: Story = {
  render: () => <TagPickerWithHooks />,
};
