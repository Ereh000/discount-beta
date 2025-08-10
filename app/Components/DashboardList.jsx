import {
  ActionList,
  Badge,
  BlockStack,
  Button,
  Card,
  EmptyState,
  LegacyCard,
  Popover,
  Text,
} from "@shopify/polaris";

const DashboardList = ({
  bundles,
  volumes,
  handleStatusToggle,
  handleVolumeToggle,
  togglePopover,
  activePopoverId,
  setActivePopoverId,
  EditIcon,
  DeleteIcon,
  DuplicateIcon,
  MenuHorizontalIcon,
}) => {
  // Render bundles
  const renderBundles = () => {
    if (!bundles || bundles.length === 0) return null;

    return bundles.map((bundle) => (
      <Card key={`bundle-${bundle.id}`}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Toggle button */}
            <div style={{ position: "relative" }}>
              <input
                type="checkbox"
                name="bundle-status"
                id={`toggle-bundle-${bundle.id}`}
                checked={bundle.status === "published"}
                onChange={() =>
                  handleStatusToggle(bundle.id, bundle.status, "bundle")
                }
                style={{
                  appearance: "none",
                  width: "36px",
                  height: "20px",
                  backgroundColor:
                    bundle.status === "published" ? "#008060" : "#E4E5E7",
                  borderRadius: "10px",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
              />
              <label
                htmlFor={`toggle-bundle-${bundle.id}`}
                style={{
                  position: "absolute",
                  left: bundle.status === "published" ? "23px" : "9px",
                  top: "23%",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  transition: "left 0.3s",
                }}
              ></label>
            </div>

            {/* Bundle name */}
            <Text variant="headingMd" as="h3">
              {bundle.name || "Bundle"}
            </Text>

            {/* Position type */}
            <Text variant="bodyMd" as="span" color="subdued">
              {bundle.settings?.position === "all"
                ? "All products"
                : bundle.settings?.position === "specific"
                  ? "Specific products"
                  : bundle.settings?.position === "collections"
                    ? "Specific collections"
                    : bundle.settings?.position === "except"
                      ? "All except selected"
                      : "All products"}
            </Text>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Product type */}
            <Text variant="bodyMd" as="span">
              Product Bundle
            </Text>

            {/* Status badge */}
            <Badge tone={bundle.status === "published" ? "success" : "info"}>
              {bundle.status === "published" ? "Active" : "Draft"}
            </Badge>

            {/* Three dots menu */}
            <div>
              <Popover
                active={activePopoverId === `bundle-${bundle.id}`}
                activator={
                  <Button
                    icon={MenuHorizontalIcon}
                    onClick={() => togglePopover(`bundle-${bundle.id}`)}
                    variant="plain"
                  />
                }
                onClose={() => setActivePopoverId(null)}
              >
                <ActionList
                  actionRole="menuitem"
                  items={[
                    {
                      content: "Edit",
                      icon: EditIcon,
                      url: `/app/product-bundle/${bundle.id}`,
                    },
                    {
                      content: "Duplicate",
                      icon: DuplicateIcon,
                      onAction: () => {
                        console.log(`Duplicate bundle ${bundle.id}`);
                        setActivePopoverId(null);
                      },
                    },
                    {
                      content: "Delete",
                      icon: DeleteIcon,
                      destructive: true,
                      onAction: () => {
                        console.log(`Delete bundle ${bundle.id}`);
                        setActivePopoverId(null);
                      },
                    },
                  ]}
                />
              </Popover>
            </div>
          </div>
        </div>
      </Card>
    ));
  };

  // Render volumes
  const renderVolumes = () => {
    if (!volumes || volumes.length === 0) return null;

    return volumes.map((volume) => (
      <Card key={`volume-${volume.id}`}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Toggle button */}
            <div style={{ position: "relative" }}>
              <input
                type="checkbox"
                name="volume-status"
                id={`toggle-volume-${volume.id}`}
                checked={volume.status === "published"}
                onChange={() => handleVolumeToggle(volume.id, volume.status)}
                style={{
                  appearance: "none",
                  width: "36px",
                  height: "20px",
                  backgroundColor:
                    volume.status === "published" ? "#008060" : "#E4E5E7",
                  borderRadius: "10px",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
              />
              <label
                htmlFor={`toggle-volume-${volume.id}`}
                style={{
                  position: "absolute",
                  left: volume.status === "published" ? "23px" : "9px",
                  top: "23%",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  transition: "left 0.3s",
                }}
              ></label>
            </div>

            {/* Volume name */}
            <Text variant="headingMd" as="h3">
              {volume.bundleName || "Volume Discount"}
            </Text>

            {/* Visibility type */}
            <Text variant="bodyMd" as="span" color="subdued">
              {volume.settings?.bundleSettings?.visibilitySettings
                ?.visibility === "all_products"
                ? "All products"
                : "Specific products"}
            </Text>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Product type */}
            <Text variant="bodyMd" as="span">
              Volume Discount
            </Text>

            {/* Status badge */}
            <Badge tone={volume.status === "published" ? "success" : "info"}>
              {volume.status === "published" ? "Active" : "Draft"}
            </Badge>

            {/* Three dots menu */}
            <div>
              <Popover
                active={activePopoverId === `volume-${volume.id}`}
                activator={
                  <Button
                    icon={MenuHorizontalIcon}
                    onClick={() => togglePopover(`volume-${volume.id}`)}
                    variant="plain"
                  />
                }
                onClose={() => setActivePopoverId(null)}
              >
                <ActionList
                  actionRole="menuitem"
                  items={[
                    {
                      content: "Edit",
                      icon: EditIcon,
                      url: `/app/volume-discount/${volume.id}`, // This will work with the dynamic route
                    },
                    {
                      content: "Duplicate",
                      icon: DuplicateIcon,
                      onAction: () => {
                        console.log(`Duplicate volume ${volume.id}`);
                        setActivePopoverId(null);
                      },
                    },
                    {
                      content: "Delete",
                      icon: DeleteIcon,
                      destructive: true,
                      onAction: () => {
                        console.log(`Delete volume ${volume.id}`);
                        setActivePopoverId(null);
                      },
                    },
                  ]}
                />
              </Popover>
            </div>
          </div>
        </div>
      </Card>
    ));
  };

  // Check if we have any data to display
  const hasData =
    (bundles && bundles.length > 0) || (volumes && volumes.length > 0);

  return (
    <div>
      {hasData ? (
        <BlockStack gap="400">
          {renderBundles()}
          {renderVolumes()}
        </BlockStack>
      ) : (
        <LegacyCard sectioned>
          <EmptyState
            heading="Add new Bundle Blocks or Volume Discounts"
            action={{ content: "Add Bundle Blocks", onAction: () => {} }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>
              Create product bundles or volume discounts to increase your
              average order value.
            </p>
          </EmptyState>
        </LegacyCard>
      )}
    </div>
  );
};

export default DashboardList;
