import React from 'react';
import { Meta, StoryObj, storiesOf } from '@storybook/react';

import { TagPicker, Tag, Label, Badge } from '../components/TagPicker';

const meta: Meta<typeof TagPicker> = {
  component: TagPicker,
};

type Story = StoryObj<typeof TagPicker>;

function TagPickerWithHooks() {
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);
  return (
    <TagPicker
      renderBadge={tag => (
        <Badge
          key={tag.id}
          onClick={() => setSelectedTags([...selectedTags, tag])}
          className='cursor-pointer'
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
