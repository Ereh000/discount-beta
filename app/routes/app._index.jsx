import { useState, useCallback, useEffect } from "react";
import {
  Page,
  Layout,
  Button,
  Banner,
  InlineStack,
  Modal,
  Toast,
  Frame,
} from "@shopify/polaris";
import {
  MenuHorizontalIcon,
  EditIcon,
  DeleteIcon,
} from "@shopify/polaris-icons";
import { json, useLoaderData, useFetcher } from "@remix-run/react";
import prisma from "../db.server";
import SelectionModel from "../Components/IndexPage/SelectionModel";
import DashboardList from "../Components/DashboardList";
import { fetchShop } from "../utils/getShop";
import Analytics from "../Components/IndexPage/Analytics";

// Loader and action functions remain the same...
export async function loader({ request }) {
  const shop = await fetchShop(request);

  try {
    const bundles = await prisma.bundle.findMany({
      where: {
        shop: shop.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const volumes = await prisma.volumeDiscount.findMany({
      where: {
        shop: shop.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return json({ bundles, volumes });
  } catch (error) {
    console.error("Error fetching bundles and volumes:", error);
    return json({ bundles: [], volumes: [] }, { status: 500 });
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const itemId = formData.get("itemId");
  const itemType = formData.get("itemType");
  const newStatus = formData.get("newStatus");

  try {
    if (itemType === "bundle") {
      if (newStatus === "published") {
        await prisma.bundle.updateMany({
          where: {
            status: "published",
          },
          data: {
            status: "draft",
          },
        });
      }

      const updatedBundle = await prisma.bundle.update({
        where: {
          id: parseInt(itemId),
        },
        data: {
          status: newStatus,
        },
      });

      return json({ success: true, item: updatedBundle, type: "bundle" });
    } else if (itemType === "volume") {
      if (newStatus === "published") {
        await prisma.volumeDiscount.updateMany({
          where: {
            status: "published",
          },
          data: {
            status: "draft",
          },
        });
      }

      const updatedVolume = await prisma.volumeDiscount.update({
        where: {
          id: parseInt(itemId),
        },
        data: {
          status: newStatus,
        },
      });

      return json({ success: true, item: updatedVolume, type: "volume" });
    }
  } catch (error) {
    console.error(`Error updating ${itemType} status:`, error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export default function Dashboard() {
  const { bundles, volumes } = useLoaderData();

  // Banner states (keep existing banner for other notifications)
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerTone, setBannerTone] = useState("info");

  // Modal and popover states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePopoverId, setActivePopoverId] = useState(null);

  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);

  const fetcher = useFetcher();
  const deleteVolumeFetcher = useFetcher();
  const deleteBundleFetcher = useFetcher();

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  const togglePopover = useCallback(
    (id) => {
      setActivePopoverId(activePopoverId === id ? null : id);
    },
    [activePopoverId],
  );

  const handleStatusToggle = useCallback(
    (itemId, currentStatus, itemType = "bundle") => {
      const newStatus = currentStatus === "published" ? "draft" : "published";

      fetcher.submit(
        {
          itemId: itemId.toString(),
          itemType,
          newStatus,
        },
        { method: "post" },
      );
    },
    [fetcher],
  );

  const handleVolumeToggle = useCallback(
    (volumeId, currentStatus) => {
      handleStatusToggle(volumeId, currentStatus, "volume");
    },
    [handleStatusToggle],
  );

  // Handle delete volume discount responses with Toast
  useEffect(() => {
    if (deleteVolumeFetcher.data) {
      setToastMessage(deleteVolumeFetcher.data.message);
      setToastError(!deleteVolumeFetcher.data.success);
      setShowToast(true);

      if (deleteVolumeFetcher.data.success) {
        // Refresh the page data after successful deletion
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  }, [deleteVolumeFetcher.data]);

  // Handle delete product bundle responses with Toast
  useEffect(() => {
    if (deleteBundleFetcher.data) {
      setToastMessage(deleteBundleFetcher.data.message);
      setToastError(!deleteBundleFetcher.data.success);
      setShowToast(true);

      if (deleteBundleFetcher.data.success) {
        // Refresh the page data after successful deletion
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  }, [deleteBundleFetcher.data]);

  // Show delete confirmation modal for volume discounts
  const showDeleteConfirmation = (volumeId, volumeName) => {
    setItemToDelete({ id: volumeId, name: volumeName, type: 'volume' });
    setIsDeleteModalOpen(true);
  };

  // Show delete confirmation modal for product bundles
  const showBundleDeleteConfirmation = (bundleId, bundleName) => {
    setItemToDelete({ id: bundleId, name: bundleName, type: 'bundle' });
    setIsDeleteModalOpen(true);
  };

  // Handle confirmed deletion
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'volume') {
        deleteVolumeFetcher.submit(
          { volumeId: itemToDelete.id.toString() },
          { method: "post", action: "/api/delete-volume-discount" },
        );
      } else if (itemToDelete.type === 'bundle') {
        deleteBundleFetcher.submit(
          { bundleId: itemToDelete.id.toString() },
          { method: "post", action: "/api/delete-product-bundle" },
        );
      }
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // Handle cancel deletion
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // Toast dismiss handler
  const toggleToast = useCallback(
    () => setShowToast((showToast) => !showToast),
    [],
  );

  return (
    <Frame>
      <Page title="Dashboard">
        <Layout>
          {/* Top Banner */}
          <Layout.Section>
            <Banner
              title="Rapi app is not activated yet"
              status="warning"
              tone="warning"
              onDismiss={() => {}}
              action={{
                content: "Activate",
                onAction: () => {},
              }}
            >
              <p>
                Please activate the app by clicking 'Activate' button below and
                then 'Save' in the following page.
              </p>
            </Banner>
          </Layout.Section>

          <Layout.Section>
            <Analytics />
          </Layout.Section>

          {/* Middle Banner */}
          <Layout.Section>
            <Banner
              title="Exciting news"
              status="warning"
              tone="info"
              onDismiss={() => {}}
            >
              <p>
                We just rolled out a highly requested feature in Rapi Bundle:
                Free Gift.
              </p>
              <p>
                From what we've seen, merchants who add a Free Gift to their
                bundles see a 23% increase in revenue on average. You can enable
                it in a few clicks — no dev required. Please contact us if you
                have any question!
              </p>
            </Banner>
          </Layout.Section>

          <Layout.Section>
            <InlineStack align="end">
              <Button
                variant="primary"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Create a new bundle
              </Button>
            </InlineStack>
          </Layout.Section>

          {/* Bundle & Volume Discount List */}
          {showBanner && (
            <Banner
              title={bannerMessage}
              onDismiss={() => setShowBanner(false)}
              tone={bannerTone}
            />
          )}
          <Layout.Section>
            <DashboardList
              bundles={bundles}
              volumes={volumes}
              handleStatusToggle={handleStatusToggle}
              handleVolumeToggle={handleVolumeToggle}
              togglePopover={togglePopover}
              activePopoverId={activePopoverId}
              setActivePopoverId={setActivePopoverId}
              EditIcon={EditIcon}
              DeleteIcon={DeleteIcon}
              MenuHorizontalIcon={MenuHorizontalIcon}
              // Updated delete handler to show modal
              onDeleteVolume={showDeleteConfirmation}
              onDeleteBundle={showBundleDeleteConfirmation}
              deleteVolumeLoading={deleteVolumeFetcher.state === "submitting"}
            />
          </Layout.Section>
        </Layout>

        <br />

        {/* Bundle Type Selection Modal */}
        <SelectionModel
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          open={isDeleteModalOpen}
          onClose={handleCancelDelete}
          title={itemToDelete?.type === 'bundle' ? "Delete Product Bundle" : "Delete Volume Discount"}
          primaryAction={{
            content: "Delete",
            onAction: handleConfirmDelete,
            destructive: true,
            loading: (itemToDelete?.type === 'bundle' ? deleteBundleFetcher.state : deleteVolumeFetcher.state) === "submitting",
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: handleCancelDelete,
            },
          ]}
        >
          <Modal.Section>
            <p>
              Are you sure you want to delete{" "}
              <strong>"{itemToDelete?.name}"</strong>?
            </p>
            <br />
            <p>This will permanently remove:</p>
            <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
              {itemToDelete?.type === 'bundle' ? (
                <>
                  <li>The product bundle from your database</li>
                  <li>All associated bundle products</li>
                  <li>Associated metafield data</li>
                  <li>The Shopify automatic discount (if exists)</li>
                </>
              ) : (
                <>
                  <li>The volume discount from your database</li>
                  <li>Associated metafield data</li>
                  <li>The Shopify automatic discount</li>
                </>
              )}
            </ul>
            <br />
            <p>
              <strong>This action cannot be undone.</strong>
            </p>
          </Modal.Section>
        </Modal>

        {/* Toast Notification */}
        {showToast && (
          <Toast
            content={toastMessage}
            onDismiss={toggleToast}
            error={toastError}
            duration={toastError ? 5000 : 3000}
          />
        )}
      </Page>
    </Frame>
  );
}
