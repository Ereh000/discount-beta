import { Card, Grid, Page } from "@shopify/polaris";
import React from "react";
import BundleSettings from "../Components/Productbundle/BundleSettings";
import BundleLivePreview from "../Components/Productbundle/BundleLivePreview";

function ProductBundle() {
  return (
    <>
      <Page title="Product Bundle" backAction={() => window.history.back()}>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
            {/* <Card> */}
            <BundleSettings />
            {/* </Card> */}
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
            <Card>
              <BundleLivePreview />
            </Card>
          </Grid.Cell>
        </Grid>
        <br />
        <br />
      </Page>
    </>
  );
}

export default ProductBundle;
