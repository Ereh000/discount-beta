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

// Add loader function to fetch bundles
export async function loader() {
  try {
    const bundles = await prisma.bundle.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return json({ bundles });
  } catch (error) {
    console.error("Error fetching bundles:", error);
    return json({ bundles: [] });
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
  const { bundles } = useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePopoverId, setActivePopoverId] = useState(null);
  const fetcher = useFetcher();

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
            <Button variant="primary" onClick={handleOpenModal}>Create a new bundle</Button>
          </InlineStack>
        </Layout.Section>

        <Layout.Section>
          {bundles && bundles.length > 0 ? (
            <BlockStack gap="400">
              {bundles.map((bundle) => (
                <Card key={bundle.id}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* Toggle button */}
                      <div style={{ position: 'relative' }}>
                        <input
                          type="checkbox"
                          name='bundle-status'
                          id={`toggle-${bundle.id}`}
                          checked={bundle.status === 'published'}
                          onChange={() => handleStatusToggle(bundle.id, bundle.status)}
                          style={{
                            appearance: 'none',
                            width: '36px',
                            height: '20px',
                            backgroundColor: bundle.status === 'published' ? '#008060' : '#E4E5E7',
                            borderRadius: '10px',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s'
                          }}
                        />
                        <label htmlFor={`toggle-${bundle.id}`} style={{
                          position: 'absolute',
                          left: bundle.status === 'published' ? '23px' : '9px',
                          top: '23%',
                          width: '12px',
                          height: '12px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: 'left 0.3s'
                        }}></label>
                      </div>
                      
                      {/* Bundle name */}
                      <Text variant="headingMd" as="h3">{bundle.name || 'Bundle'}</Text>

                      {/* Position type */}
                      <Text variant="bodyMd" as="span" color="subdued">
                        {bundle.settings?.position === 'all' ? 'All products' :
                          bundle.settings?.position === 'specific' ? 'Specific products' :
                            bundle.settings?.position === 'collections' ? 'Specific collections' :
                              bundle.settings?.position === 'except' ? 'All except selected' : 'All products'}
                      </Text>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* Product type */}
                      <Text variant="bodyMd" as="span">Product Combo</Text>

                      {/* Status badge */}
                      <Badge tone={bundle.status === 'published' ? 'success' : 'info'}>
                        {bundle.status === 'published' ? 'Active' : 'Draft'}
                      </Badge>

                      {/* Three dots menu */}
                      <div>
                        <Popover
                          active={activePopoverId === bundle.id}
                          activator={
                            <Button
                              icon={MenuHorizontalIcon}
                              onClick={() => togglePopover(bundle.id)}
                              variant="plain"
                            />
                          }
                          onClose={() => setActivePopoverId(null)}
                        >
                          <ActionList
                            actionRole="menuitem"
                            items={[
                              {
                                content: 'Edit',
                                icon: EditIcon,
                                url: `/app/edit-product-bundle/${bundle.id}`
                              },
                              {
                                content: 'Duplicate',
                                icon: DuplicateIcon,
                                onAction: () => {
                                  console.log(`Duplicate bundle ${bundle.id}`);
                                  setActivePopoverId(null);
                                }
                              },
                              {
                                content: 'Delete',
                                icon: DeleteIcon,
                                destructive: true,
                                onAction: () => {
                                  console.log(`Delete bundle ${bundle.id}`);
                                  setActivePopoverId(null);
                                }
                              }
                            ]}
                          />
                        </Popover>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </BlockStack>
          ) : (
            <LegacyCard sectioned>
              <EmptyState
                heading="Add new Bundle Blocks"
                action={{ content: 'Add Bundle Blocks', onAction: () => { } }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
              </EmptyState>
            </LegacyCard>
          )}
        </Layout.Section>
      </Layout>

      <br />

      {/* Bundle Type Selection Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Select type of bundle"
        titleHidden={false}
        size="large"
      >
        <Modal.Section>
          <div style={{ display: 'flex', gap: '20px' }}>

            {/* Mix and Match Bundle Option */}
            <div style={{
              flex: 1,
              border: '1px solid #e1e3e5',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Mix and Match product bundles
              </Text>
              <Text variant="bodyMd" as="p" color="subdued">
                (Different products)
              </Text>

              <div style={{
                background: '#f6f6f7',
                borderRadius: '8px',
                padding: '30px',
                margin: '20px 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'white',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid #e1e3e5',
                  marginRight: '10px'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M19 8C19 11.866 15.866 15 12 15C8.13401 15 5 11.866 5 8C5 4.13401 8.13401 1 12 1C15.866 1 19 4.13401 19 8Z" stroke="black" strokeWidth="2" />
                    <path d="M15 13V23H9V13" stroke="black" strokeWidth="2" />
                  </svg>
                </div>

                <div style={{
                  position: 'absolute',
                  width: '30px',
                  height: '30px',
                  background: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid #e1e3e5',
                  zIndex: 2
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3V13M3 8H13" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'white',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid #e1e3e5',
                  marginLeft: '10px'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M5 7H19V21H5V7Z" stroke="black" strokeWidth="2" />
                    <path d="M8 7V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V7" stroke="black" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              <div style={{
                width: '80px',
                height: '80px',
                background: 'white',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #e1e3e5',
                margin: '0 auto 20px'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17C9.76142 17 12 14.7614 12 12C12 9.23858 9.76142 7 7 7C4.23858 7 2 9.23858 2 12C2 14.7614 4.23858 17 7 17Z" stroke="black" strokeWidth="2" />
                  <path d="M17 7C19.7614 7 22 4.76142 22 2" stroke="black" strokeWidth="2" />
                  <path d="M17 7C14.2386 7 12 4.76142 12 2" stroke="black" strokeWidth="2" />
                  <path d="M17 17C19.7614 17 22 19.2386 22 22" stroke="black" strokeWidth="2" />
                  <path d="M17 17C14.2386 17 12 19.2386 12 22" stroke="black" strokeWidth="2" />
                </svg>
              </div>

              <div style={{
                background: '#f6f6f7',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                marginBottom: '10px'
              }}>
                <Text variant="bodyMd" as="p" fontWeight="medium">
                  Combo Product
                </Text>
              </div>

              <Text variant="bodyXs" as="p" color="subdued">
                Your customers can buy related products with one single click.
              </Text>

              <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                <Button fullWidth variant='primary' url='/app/product-bundle'>Create the deal</Button>
              </div>
            </div>

            {/* Quantity Breaks Option */}
            <div style={{
              flex: 1,
              border: '1px solid #e1e3e5',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Quantity breaks
              </Text>
              <Text variant="bodyMd" as="p" color="subdued">
                (Same product)
              </Text>

              <div style={{
                background: '#f6f6f7',
                borderRadius: '8px',
                padding: '20px',
                margin: '20px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #e1e3e5'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'white',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '1px solid #e1e3e5'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19 8C19 11.866 15.866 15 12 15C8.13401 15 5 11.866 5 8C5 4.13401 8.13401 1 12 1C15.866 1 19 4.13401 19 8Z" stroke="black" strokeWidth="2" />
                        <path d="M15 13V23H9V13" stroke="black" strokeWidth="2" />
                      </svg>
                    </div>
                    <Text variant="bodyLg" as="p" fontWeight="semibold">Buy 1</Text>
                  </div>
                  <Text variant="bodyMd" as="p">Save 10%</Text>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #e1e3e5'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'white',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '1px solid #e1e3e5'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19 8C19 11.866 15.866 15 12 15C8.13401 15 5 11.866 5 8C5 4.13401 8.13401 1 12 1C15.866 1 19 4.13401 19 8Z" stroke="black" strokeWidth="2" />
                        <path d="M15 13V23H9V13" stroke="black" strokeWidth="2" />
                      </svg>
                    </div>
                    <Text variant="bodyLg" as="p" fontWeight="semibold">Buy 2</Text>
                  </div>
                  <Text variant="bodyMd" as="p">Save 20%</Text>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #e1e3e5'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'white',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '1px solid #e1e3e5'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19 8C19 11.866 15.866 15 12 15C8.13401 15 5 11.866 5 8C5 4.13401 8.13401 1 12 1C15.866 1 19 4.13401 19 8Z" stroke="black" strokeWidth="2" />
                        <path d="M15 13V23H9V13" stroke="black" strokeWidth="2" />
                      </svg>
                    </div>
                    <Text variant="bodyLg" as="p" fontWeight="semibold">Buy 3</Text>
                  </div>
                  <Text variant="bodyMd" as="p">Save 30%</Text>
                </div>
              </div>

              <div style={{
                background: '#f6f6f7',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                marginBottom: '10px'
              }}>
                <Text variant="bodyMd" as="p" fontWeight="medium">
                  Volume Discounts
                </Text>
              </div>

              <Text variant="bodyXs" as="p" color="subdued">
                Increase your average order value with volume discount.
              </Text>

              <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                <Button fullWidth variant='primary'>Create the deal</Button>
              </div>
            </div>
          </div>
        </Modal.Section>
      </Modal>
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