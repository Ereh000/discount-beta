import { Button, Modal, Text } from '@shopify/polaris'

const SelectionModel = ({ isModalOpen, handleCloseModal }) => {
    return (
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
                            <Button fullWidth url='/app/volume-discount' variant='primary'>Create the deal</Button>
                        </div>
                    </div>
                </div>
            </Modal.Section>
        </Modal>
    )
}

export default SelectionModel
