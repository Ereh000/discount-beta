import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import {
  Card,
  Page,
  Layout,
  Text,
  Badge,
  Box,
  Grid,
  Icon,
} from "@shopify/polaris";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  ViewIcon,
  CartIcon,
  OrderIcon,
  CashDollarIcon,
  ChartHistogramSecondLastIcon,
  ChartLineIcon,
} from "@shopify/polaris-icons";
import { useState, useCallback } from "react";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session?.shop;

  if (!shop) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const dateFrom =
    url.searchParams.get("date_from") ||
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const dateTo = url.searchParams.get("date_to") || new Date().toISOString();

  // Get analytics summary
  const analytics = await prisma.bundleAnalytics.groupBy({
    by: ["type"],
    where: {
      shopDomain: shop,
      timestamp: {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      },
    },
    _count: { id: true },
    _sum: { revenue: true },
  });

  // Get time series data for charts
  const timeSeriesData = await prisma.$queryRaw`
  SELECT 
    DATE(timestamp) as date,
    type,
    COUNT(*) as count,
    COALESCE(SUM(revenue), 0) as revenue
  FROM "BundleAnalytics" 
  WHERE "shopDomain" = ${shop}
    AND timestamp >= ${new Date(dateFrom)}
    AND timestamp <= ${new Date(dateTo)}
  GROUP BY DATE(timestamp), type
  ORDER BY date ASC
`;

  // Get conversion funnel data
  const funnelData = await prisma.bundleAnalytics.groupBy({
    by: ["bundleId"],
    where: {
      shopDomain: shop,
      timestamp: {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      },
    },
    _count: { id: true },
    _sum: { revenue: true },
  });

  // Get top performing bundles
  const topBundles = await prisma.bundleAnalytics.groupBy({
    by: ["bundleId", "bundleName"],
    where: {
      shopDomain: shop,
      type: "ORDER",
      timestamp: {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      },
    },
    _count: { id: true },
    _sum: { revenue: true },
    orderBy: {
      _sum: { revenue: "desc" },
    },
    take: 10,
  });

  // Calculate summary metrics
  const summary = {
    totalImpressions:
      analytics.find((a) => a.type === "IMPRESSION")?._count.id || 0,
    totalAddToCarts:
      analytics.find((a) => a.type === "ADD_TO_CART")?._count.id || 0,
    totalOrders: analytics.find((a) => a.type === "ORDER")?._count.id || 0,
    totalRevenue: analytics.find((a) => a.type === "ORDER")?._sum.revenue || 0,
  };

  // Calculate conversion rates
  const conversionRate =
    summary.totalImpressions > 0
      ? ((summary.totalOrders / summary.totalImpressions) * 100).toFixed(2)
      : 0;

  const addToCartRate =
    summary.totalImpressions > 0
      ? ((summary.totalAddToCarts / summary.totalImpressions) * 100).toFixed(2)
      : 0;

  const checkoutRate =
    summary.totalAddToCarts > 0
      ? ((summary.totalOrders / summary.totalAddToCarts) * 100).toFixed(2)
      : 0;

  // Format time series data for charts
  const chartData = formatTimeSeriesData(timeSeriesData);

  return json({
    summary: { ...summary, conversionRate, addToCartRate, checkoutRate },
    topBundles,
    chartData,
    dateRange: { from: dateFrom, to: dateTo },
  });
};

function formatTimeSeriesData(rawData) {
  const dateMap = new Map();

  rawData.forEach((item) => {
    const date = new Date(item.date).toLocaleDateString();
    if (!dateMap.has(date)) {
      dateMap.set(date, {
        date,
        impressions: 0,
        addToCarts: 0,
        orders: 0,
        revenue: 0,
      });
    }

    const entry = dateMap.get(date);
    if (item.type === "IMPRESSION") entry.impressions = Number(item.count);
    if (item.type === "ADD_TO_CART") entry.addToCarts = Number(item.count);
    if (item.type === "ORDER") {
      entry.orders = Number(item.count);
      entry.revenue = Number(item.revenue);
    }
  });

  return Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
}

export default function Analytics() {
  const { summary, topBundles, chartData, dateRange } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDateRange, setSelectedDateRange] = useState("30d");

  const handleDateRangeChange = useCallback(
    (range) => {
      setSelectedDateRange(range);
      const now = new Date();
      let from;

      switch (range) {
        case "7d":
          from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      setSearchParams({
        date_from: from.toISOString(),
        date_to: now.toISOString(),
      });
    },
    [setSearchParams],
  );

  const MetricCard = ({ title, value, icon, trend, color = "success" }) => (
    <Card>
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
              backgroundColor: color === "success" ? "#E3F2E1" : "#FFF4E5",
              color: color === "success" ? "#008060" : "#B45309",
            }}
          >
            <Icon source={icon} />
          </div>
          <div>
            <Text variant="headingMd" color="subdued">
              {title}
            </Text>
            <Text variant="heading2xl">{value}</Text>
          </div>
        </div>
        {trend && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Icon source={ChartHistogramSecondLastIcon} color="success" />
            <Text variant="bodySm" color="success">
              {trend}
            </Text>
          </div>
        )}
      </div>
    </Card>
  );

  const bundleRows =
    topBundles?.map((bundle, index) => [
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Badge status={index < 3 ? "success" : "info"}>#{index + 1}</Badge>
        <Text>{bundle.bundleName || bundle.bundleId}</Text>
      </div>,
      <Text variant="bodyMd" fontWeight="semibold">
        {bundle._count.id}
      </Text>,
      <Text variant="bodyMd" fontWeight="semibold" color="success">
        ${bundle._sum.revenue?.toFixed(2) || "0.00"}
      </Text>,
      <div
        style={{
          width: "100px",
          backgroundColor: "#f6f6f7",
          borderRadius: "4px",
          height: "8px",
        }}
      >
        <div
          style={{
            width: `${Math.min((bundle._sum.revenue / (topBundles[0]?._sum.revenue || 1)) * 100, 100)}%`,
            height: "100%",
            backgroundColor: "#008060",
            borderRadius: "4px",
          }}
        />
      </div>,
    ]) || [];

  return (
    <Page
      title="Bundle Analytics"
      subtitle="Track your bundle performance and conversion rates"
      primaryAction={{
        content: "Export Report",
        icon: ChartLineIcon,
        onAction: () => console.log("Export clicked"),
      }}
    >
      {/* Date Range Filter */}
      {/* <Card>
        <Box padding="400">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text variant="headingMd">Analytics Overview</Text>
            <ButtonGroup segmented>
              {["7d", "30d", "90d"].map((period) => (
                <Button
                  key={period}
                  pressed={selectedDateRange === period}
                  onClick={() => handleDateRangeChange(period)}
                >
                  {period === "7d"
                    ? "7 Days"
                    : period === "30d"
                      ? "30 Days"
                      : "90 Days"}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </Box>
      </Card> */}

      <Layout>
        {/* Key Metrics Cards */}
        <Layout.Section>
          <Grid>
            <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
              <MetricCard
                title="Total Impressions"
                value={summary?.totalImpressions?.toLocaleString() || "0"}
                icon={ViewIcon}
                trend="+12.5%"
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
              <MetricCard
                title="Add to Carts"
                value={summary?.totalAddToCarts?.toLocaleString() || "0"}
                icon={CartIcon}
                trend="+8.3%"
                color="warning"
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
              <MetricCard
                title="Orders"
                value={summary?.totalOrders?.toLocaleString() || "0"}
                icon={OrderIcon}
                trend="+15.2%"
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
              <MetricCard
                title="Revenue"
                value={`$${summary?.totalRevenue?.toFixed(2) || "0.00"}`}
                icon={CashDollarIcon}
                trend="+22.1%"
              />
            </Grid.Cell>
          </Grid>
        </Layout.Section>

        {/* Conversion Funnel */}
        <Layout.Section>
          <Card>
            {/* <Box padding="400"> */}
              <Text variant="headingMd" marginBottom="400">
                Conversion Funnel
              </Text>
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "20px",
                  marginBottom: "20px",
                  marginTop: "20px",
                }}
              >
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      width: "auto",
                      height: "auto",
                      aspectRatio: "2/.8",
                      backgroundColor: "#E3F2E1",
                      margin: "0 auto 8px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text variant="headingLg">
                      {summary?.totalImpressions || 0}
                    </Text>
                  </div>
                  <Text variant="bodyMd">Impressions</Text>
                </div>

                <div style={{ textAlign: "center", color: "#637381", marginTop: "42px" }}>→</div>

                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      width: "auto",
                      height: "auto",
                      aspectRatio: "2/.8",
                      backgroundColor: "#FFF4E5",
                      margin: "0 auto 8px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text variant="headingLg">
                      {summary?.totalAddToCarts || 0}
                    </Text>
                  </div>
                  <Text variant="bodyMd">Add to Carts</Text>
                  <Badge>{summary?.addToCartRate}% conversion</Badge>
                </div>

                <div style={{ textAlign: "center", color: "#637381", marginTop: "42px" }}>→</div>

                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      width: "auto",
                      height: "auto",
                      aspectRatio: "2/.8",
                      backgroundColor: "#E1F5FE",
                      margin: "0 auto 8px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text variant="headingLg">{summary?.totalOrders || 0}</Text>
                  </div>
                  <Text variant="bodyMd">Orders</Text>
                  <Badge status="success">
                    {summary?.checkoutRate}% checkout
                  </Badge>
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Text variant="bodyLg" color="success">
                  Overall Conversion Rate: {summary?.conversionRate}%
                </Text>
              </div>
            {/* </Box> */}
          </Card>
        </Layout.Section>

        {/* Charts Section */}
        <Layout.Section>
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 8, xl: 8 }}>
              <Card>
                <Box padding="400">
                  <Text variant="headingMd" marginBottom="400">
                    Performance Trends
                  </Text>
                  <div style={{ width: "100%", height: "300px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#637381" fontSize={12} />
                        <YAxis stroke="#637381" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e1e3e5",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="impressions"
                          stroke="#8884d8"
                          strokeWidth={2}
                          name="Impressions"
                        />
                        <Line
                          type="monotone"
                          dataKey="addToCarts"
                          stroke="#82ca9d"
                          strokeWidth={2}
                          name="Add to Carts"
                        />
                        <Line
                          type="monotone"
                          dataKey="orders"
                          stroke="#ffc658"
                          strokeWidth={2}
                          name="Orders"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Box>
              </Card>
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}>
              <Card>
                <Box padding="400">
                  <Text variant="headingMd" marginBottom="400">
                    Revenue Trend
                  </Text>
                  <div style={{ width: "100%", height: "300px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#637381" fontSize={10} />
                        <YAxis stroke="#637381" fontSize={10} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e1e3e5",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#008060"
                          fill="#E3F2E1"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Box>
              </Card>
            </Grid.Cell>
          </Grid>
        </Layout.Section>

        {/* Top Bundles Table */}
        {/* <Layout.Section>
          <Card>
            <Box padding="400">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <Text variant="headingMd">Top Performing Bundles</Text>
                <Button size="slim">View All</Button>
              </div>

              {bundleRows.length > 0 ? (
                <DataTable
                  columnContentTypes={["text", "numeric", "numeric", "text"]}
                  headings={["Bundle Name", "Orders", "Revenue", "Performance"]}
                  rows={bundleRows}
                  hoverable
                />
              ) : (
                <EmptyState
                  heading="No bundle data available"
                  description="Start promoting your bundles to see performance metrics here."
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                />
              )}
            </Box>
          </Card>
        </Layout.Section> */}
      </Layout>
      <br />
      <br />
    </Page>
  );
}
