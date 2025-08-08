import React, { useState, useCallback } from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  LegacyCard,
  EmptyState,
  Button,
  BlockStack,
  Banner,
  Tabs,
  Grid,
  InlineStack,
  Modal,
  Badge,
  Popover,
  ActionList,
} from '@shopify/polaris';
import {
  MenuHorizontalIcon,
  EditIcon,
  DuplicateIcon,
  DeleteIcon
} from '@shopify/polaris-icons';
import { json, useLoaderData, useFetcher } from '@remix-run/react';
import prisma from "../db.server";
import { constants } from 'http2';
import SelectionModel from '../Components/IndexPage/SelectionModel';
import DashboardList from '../Components/DashboardList';

// Add loader function to fetch bundles
export async function loader() {
  try {
    const bundles = await prisma.bundle.findMany({
      // where: {
      //   shop: "gid://shopify/Shop/73863725283"
      // },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const volumes = await prisma.volumeDiscount.findMany({
      // where: {
      //   shop: "gid://shopify/Shop/73863725283"
      // },
      orderBy: {
        createdAt: 'desc'
      }
    });


    return json({ bundles, volumes });
  } catch (error) {
    console.error("Error fetching bundles:", error);
    return json({ bundles: [], volumes: [] }, { status: 500 });
  }
}

// Add action function to handle status toggle
export async function action({ request }) {
  const formData = await request.formData();
  const bundleId = formData.get('bundleId');
  const newStatus = formData.get('newStatus');

  try {
    // If setting to published, first set all bundles to draft
    if (newStatus === 'published') {
      await prisma.bundle.updateMany({
        where: {
          status: 'published'
        },
        data: {
          status: 'draft'
        }
      });
    }

    // Then update the selected bundle
    const updatedBundle = await prisma.bundle.update({
      where: {
        id: parseInt(bundleId)
      },
      data: {
        status: newStatus
      }
    });

    return json({ success: true, bundle: updatedBundle });
  } catch (error) {
    console.error("Error updating bundle status:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export default function Dashboard() {
  const { bundles, volumes } = useLoaderData();
  // console.log("Bundles:", bundles);
  // console.log("Volumes:", volumes);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePopoverId, setActivePopoverId] = useState(null);
  const fetcher = useFetcher();

  console.log("isModalOpen", isModalOpen);


  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  // Toggle popover for bundle actions
  const togglePopover = useCallback((id) => {
    setActivePopoverId(activePopoverId === id ? null : id);
  }, [activePopoverId]);

  // Handle bundle status toggle
  const handleStatusToggle = useCallback((bundleId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';

    // Use fetcher to submit the form data
    fetcher.submit(
      {
        bundleId: bundleId.toString(),
        newStatus
      },
      { method: 'post' }
    );
  }, [fetcher]);

  return (
    <Page title="Dashboard">
      <Layout>
        {/* Top Banner */}
        <Layout.Section>
          <Banner
            title="Rapi app is not activated yet"
            status="warning"
            tone='warning'
            onDismiss={() => { }}
            action={{
              content: 'Activate',
              onAction: () => { }
            }}
          >
            <p>Please activate the app by clicking 'Activate' button below and then 'Save' in the following page.</p>
          </Banner>
        </Layout.Section>

        <Layout.Section>
          <TimeframeTabs />
          <div>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                <Card style={{ flex: 1 }}>
                  <BlockStack gap="200" padding="400">
                    <Text variant="bodyMd" as="p" color="subdued">Total additional revenue</Text>
                    <Text variant="headingLg" as="h3">Rs. 0.00 INR</Text>
                    <Text variant="bodyMd" as="p">$0.00 USD</Text>
                    <Button plain>View Report</Button>
                  </BlockStack>
                </Card>
              </Grid.Cell>
              {/* Other stat cards */}
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                <Card style={{ flex: 1 }}>
                  <BlockStack gap="200" padding="400">
                    <Text variant="bodyMd" as="p" color="subdued">Total orders</Text>
                    <Text variant="headingLg" as="h3">0</Text>
                    <div style={{ height: '24px' }}></div>
                    <Button plain>View Report</Button>
                  </BlockStack>
                </Card>
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                <Card style={{ flex: 1 }}>
                  <BlockStack gap="200" padding="400">
                    <Text variant="bodyMd" as="p" color="subdued">ROI</Text>
                    <Text variant="headingLg" as="h3">∞</Text>
                    <div style={{ height: '24px' }}></div>
                    <Button plain>View Report</Button>
                  </BlockStack>
                </Card>
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                <Card style={{ flex: 1 }}>
                  <BlockStack gap="200" padding="400">
                    <Text variant="bodyMd" as="p" color="subdued">Average extra revenue</Text>
                    <Text variant="headingLg" as="h3">Rs. 0.00 INR</Text>
                    <Text variant="bodyMd" as="p">$0.00 USD</Text>
                    <Button plain>View Report</Button>
                  </BlockStack>
                </Card>
              </Grid.Cell>
            </Grid>
          </div>
        </Layout.Section>

        {/* Middle Banner */}
        <Layout.Section>
          <Banner
            title="Exciting news"
            status="warning"
            tone='info'
            onDismiss={() => { }}
          >
            <p>We just rolled out a highly requested feature in Rapi Bundle: Free Gift.</p>
            <p>From what we've seen, merchants who add a Free Gift to their bundles see a 23% increase in revenue on average. You can enable it in a few clicks — no dev required. Please contact us if you have any question!</p>
          </Banner>
        </Layout.Section>

        <Layout.Section>
          <InlineStack align="end">
            <Button variant="primary" onClick={() => {
              setIsModalOpen(true);
            }}>Create a new bundle</Button>
          </InlineStack>
        </Layout.Section>

        {/* Bundle & Volume Discount List */}
        <Layout.Section>
          <DashboardList
            bundles={bundles}
            handleStatusToggle={handleStatusToggle}
            togglePopover={togglePopover}
            activePopoverId={activePopoverId}
            setActivePopoverId={setActivePopoverId}
            EditIcon={EditIcon}
            DeleteIcon={DeleteIcon}
            DuplicateIcon={DuplicateIcon}
            MenuHorizontalIcon={MenuHorizontalIcon}

          />
        </Layout.Section>
      </Layout>

      <br />

      {/* Bundle Type Selection Modal */}
      <SelectionModel
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
      />

    </Page>
  );
};


function TimeframeTabs() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'today',
      content: 'Today',
    },
    {
      id: '7days',
      content: '7 Days',
    },
    {
      id: '1month',
      content: '1 Month',
    },
    {
      id: '3months',
      content: '3 Months',
    },
    {
      id: 'alltime',
      content: 'All time',
    },
  ];

  return (
    <div style={{ marginBottom: '20px' }}>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />
    </div>
  );
}