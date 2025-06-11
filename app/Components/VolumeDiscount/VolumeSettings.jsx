import React, { useState, useCallback } from 'react'; // Import useState and useCallback
import { BlockStack, Card, LegacyCard, Tabs } from '@shopify/polaris'; // Import Tabs component
import BlockSettings from './Settings/BlockSettings';
import OfferSettings from './Settings/OfferSettings';
import DesignSettings from './Settings/DesignSettings';

export default function VolumeSettings() {
  // Define the tabs
  const tabs = [
    {
      id: 'block-settings',
      content: 'Block',
      panelID: 'block-settings-content',
    },
    {
      id: 'offers-settings',
      content: 'Offers',
      panelID: 'offers-settings-content',
    },
    {
      id: 'design-settings',
      content: 'Design',
      panelID: 'design-settings-content',
    },
    {
      id: 'advanced-settings',
      content: 'Advanced settings',
      panelID: 'advanced-settings-content',
    },
  ];

  // State to manage the selected tab
  const [selected, setSelected] = useState(0);

  // Handler for tab change
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  // Collecting Child data

  const [allBlockSettings, setAllBlockSettings] = useState([]);
  // console.log("allBlockSettings", allBlockSettings)

  const handleBundleData = (data) => {
    setAllBlockSettings(data);
    console.log("data", data)
    // console.log("allBlockSettings", allBlockSettings)
  };

  return (
    <>
      {/* Add the Tabs component */}
      <BlockStack gap={200}>
        <LegacyCard>
          <div className="" style={{ padding: '10px 0' }}>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            </Tabs>
          </div >
        </LegacyCard>

        {selected === 0 && <div><BlockSettings onSendData={handleBundleData} /></div>}
        {selected === 1 && <div><OfferSettings/></div>}
        {selected === 2 && <div><DesignSettings/></div>}
        {selected === 3 && <div>Advanced Settings Content</div>}
      </BlockStack>
    </>
  );
}