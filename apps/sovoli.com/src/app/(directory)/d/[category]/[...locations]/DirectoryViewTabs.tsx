'use client';

import { useState } from 'react';
import { Tabs, Tab } from '@sovoli/ui/components/tabs';

export function DirectoryViewTabs() {
  const [selected, setSelected] = useState('list');

  const handleChange = (key: React.Key) => {
    if (key === 'map') {
      alert('Map coming soon');
      return;
    }
    setSelected(key as string);
  };

  return (
    <Tabs
      aria-label="View options"
      variant="underlined"
      selectedKey={selected}
      onSelectionChange={handleChange}
      classNames={{
        tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
        cursor: 'w-full',
        tab: 'max-w-fit px-0 h-12',
      }}
    >
      <Tab key="list" title="List" />
      <Tab key="map" title="Map" />
    </Tabs>
  );
}

