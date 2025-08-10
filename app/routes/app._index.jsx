import { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Button,
  Banner,
  InlineStack,
} from "@shopify/polaris";
import {
  MenuHorizontalIcon,
  EditIcon,
  DuplicateIcon,
  DeleteIcon,
} from "@shopify/polaris-icons";
import { json, useLoaderData, useFetcher } from "@remix-run/react";
import prisma from "../db.server";
import SelectionModel from "../Components/IndexPage/SelectionModel";
import DashboardList from "../Components/DashboardList";
import { fetchShop } from "../utils/getShop";
import Analytics from "../Components/IndexPage/Analytics";

// Updated loader function to fetch both bundles and volumes
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

// Updated action function to handle both bundle and volume status toggle
export async function action({ request }) {
  const formData = await request.formData();
  const itemId = formData.get("itemId");
  const itemType = formData.get("itemType"); // 'bundle' or 'volume'
  const newStatus = formData.get("newStatus");

  try {
    if (itemType === "bundle") {
      // If setting to published, first set all bundles to draft
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

      // Then update the selected bundle
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
      // If setting to published, first set all volumes to draft
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

      // Then update the selected volume
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
  console.log("Bundles:", bundles);
  console.log("Volumes:", volumes);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePopoverId, setActivePopoverId] = useState(null);
  const fetcher = useFetcher();

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  // Toggle popover for both bundle and volume actions
  const togglePopover = useCallback(
    (id) => {
      setActivePopoverId(activePopoverId === id ? null : id);
    },
    [activePopoverId],
  );

  // Handle bundle status toggle
  const handleStatusToggle = useCallback(
    (itemId, currentStatus, itemType = "bundle") => {
      const newStatus = currentStatus === "published" ? "draft" : "published";

      // Use fetcher to submit the form data
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

  // Handle volume status toggle
  const handleVolumeToggle = useCallback(
    (volumeId, currentStatus) => {
      handleStatusToggle(volumeId, currentStatus, "volume");
    },
    [handleStatusToggle],
  );

  return (
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
              We just rolled out a highly requested feature in Rapi Bundle: Free
              Gift.
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
}
