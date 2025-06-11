import { Card, Grid, Page } from "@shopify/polaris";
import React from "react";
import VolumeSettings from "../Components/VolumeDiscount/VolumeSettings";
import VolumePreview from "../Components/VolumeDiscount/VolumePreview";
import { useState } from "react";
import { useCallback } from "react";

function MainVolumeDiscount() {
  return (
    <Page title="Bundle 1">
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 6, xl: 6 }}>
          <VolumeSettings />
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 6, xl: 6 }}>
          <Card>
            <VolumePreview />
          </Card>
        </Grid.Cell>
      </Grid>
      <br />
      <br />
    </Page>
  );
}

export default MainVolumeDiscount;
