import { Tabs, Text, Grid, Card, BlockStack, Button } from "@shopify/polaris";

import { useCallback, useState } from "react";

function TimeframeTabs() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: "today",
      content: "Today",
    },
    {
      id: "7days",
      content: "7 Days",
    },
    {
      id: "1month",
      content: "1 Month",
    },
    {
      id: "3months",
      content: "3 Months",
    },
    {
      id: "alltime",
      content: "All time",
    },
  ];

  return (
    <div style={{ marginBottom: "20px" }}>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />
    </div>
  );
}

const Analytics = () => {
  return (
    <div>
      <TimeframeTabs />
      <div>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card style={{ flex: 1 }}>
              <BlockStack gap="200" padding="400">
                <Text variant="bodyMd" as="p" color="subdued">
                  Total additional revenue
                </Text>
                <Text variant="headingLg" as="h3">
                  Rs. 0.00 INR
                </Text>
                <Text variant="bodyMd" as="p">
                  $0.00 USD
                </Text>
                <Button plain>View Report</Button>
              </BlockStack>
            </Card>
          </Grid.Cell>
          {/* Other stat cards */}
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card style={{ flex: 1 }}>
              <BlockStack gap="200" padding="400">
                <Text variant="bodyMd" as="p" color="subdued">
                  Total orders
                </Text>
                <Text variant="headingLg" as="h3">
                  0
                </Text>
                <div style={{ height: "24px" }}></div>
                <Button plain>View Report</Button>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card style={{ flex: 1 }}>
              <BlockStack gap="200" padding="400">
                <Text variant="bodyMd" as="p" color="subdued">
                  ROI
                </Text>
                <Text variant="headingLg" as="h3">
                  ∞
                </Text>
                <div style={{ height: "24px" }}></div>
                <Button plain>View Report</Button>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card style={{ flex: 1 }}>
              <BlockStack gap="200" padding="400">
                <Text variant="bodyMd" as="p" color="subdued">
                  Average extra revenue
                </Text>
                <Text variant="headingLg" as="h3">
                  Rs. 0.00 INR
                </Text>
                <Text variant="bodyMd" as="p">
                  $0.00 USD
                </Text>
                <Button plain>View Report</Button>
              </BlockStack>
            </Card>
          </Grid.Cell>
        </Grid>
      </div>
    </div>
  );
};

export default Analytics;
