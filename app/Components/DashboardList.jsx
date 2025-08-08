import { ActionList, Badge, BlockStack, Button, Card, EmptyState, LegacyCard, Popover, Text } from '@shopify/polaris';

const DashboardList = ({ bundles, handleStatusToggle, togglePopover, activePopoverId, setActivePopoverId, EditIcon, DeleteIcon, DuplicateIcon, MenuHorizontalIcon   }) => {



    return (
        <div>
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
        </div>
    )
}

export default DashboardList
