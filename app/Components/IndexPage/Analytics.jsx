import { Tabs, Text, Grid, Card, BlockStack, Button, Icon } from "@shopify/polaris";
import {
  ViewIcon,
  CartIcon,
  OrderIcon,
  CashDollarIcon,
} from "@shopify/polaris-icons";
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

const MetricCard = ({ title, value, icon, color = "success" }) => (
  <Card>
    <BlockStack gap="200" padding="400">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: color === "success" ? "#E3F2E1" : color === "warning" ? "#FFF4E5" : color === "info" ? "#E1F5FE" : "#F3E8FF",
              color: color === "success" ? "#008060" : color === "warning" ? "#B45309" : color === "info" ? "#0288D1" : "#7B1FA2",
            }}
          >
            <Icon source={icon} />
          </div>
          <div>
            <Text variant="bodyMd" color="subdued">
              {title}
            </Text>
            <Text variant="headingLg" as="h3">
              {value}
            </Text>
          </div>
        </div>
      </div>
      <Button plain url="/app/analytics">View Report</Button>
    </BlockStack>
  </Card>
);

const Analytics = ({ data }) => {
  // Default values if no data is provided
  const analyticsData = data || {
    totalImpressions: 0,
    totalAddToCarts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  };

  return (
    <div>
      <TimeframeTabs />
      <div>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <MetricCard
              title="Total Impressions"
              value={analyticsData.totalImpressions.toLocaleString()}
              icon={ViewIcon}
              color="info"
            />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <MetricCard
              title="Add to Carts"
              value={analyticsData.totalAddToCarts.toLocaleString()}
              icon={CartIcon}
              color="warning"
            />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <MetricCard
              title="Orders"
              value={analyticsData.totalOrders.toLocaleString()}
              icon={OrderIcon}
              color="success"
            />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <MetricCard
              title="Revenue"
              value={`$${analyticsData.totalRevenue.toFixed(2)}`}
              icon={CashDollarIcon}
              color="purple"
            />
          </Grid.Cell>
        </Grid>
      </div>
    </div>
  );
};

export default Analytics;
