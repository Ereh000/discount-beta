// Components/VolumeDiscount/Settings/BlockSettings.jsx
import {
  BlockStack,
  Card,
  Checkbox,
  Grid,
  RadioButton,
  RangeSlider,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback } from "react";

// Constants
const VISIBILITY_OPTIONS = [
  { label: "All products", value: "all_products" },
  { label: "Specific products", value: "specific_products" },
  { label: "Specific collections", value: "specific_collections" },
];

const ALIGNMENT_OPTIONS = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];

const SLIDER_CONFIGS = {
  lineThickness: { min: 0, max: 10 },
  blockRadius: { min: 0, max: 20 },
  blockThickness: { min: 0, max: 10 },
  spacing: { min: 0, max: 30 },
};

// Custom hooks for state management
function useVisibilityHandlers(setVisibilitySettings) {
  return {
    handleVisibilityChange: useCallback(
      (value) => {
        setVisibilitySettings((prev) => ({ ...prev, visibility: value }));
      },
      [setVisibilitySettings],
    ),
  };
}

function useHeaderHandlers(setHeaderSettings) {
  return {
    handleHeaderTextChange: useCallback(
      (value) => {
        setHeaderSettings((prev) => ({ ...prev, headerText: value }));
      },
      [setHeaderSettings],
    ),

    handleAlignmentChange: useCallback(
      (value) => {
        setHeaderSettings((prev) => ({ ...prev, alignment: value }));
      },
      [setHeaderSettings],
    ),

    handleHeaderLineChange: useCallback(
      (value) => {
        setHeaderSettings((prev) => ({ ...prev, headerLine: value }));
      },
      [setHeaderSettings],
    ),

    handleLineThicknessChange: useCallback(
      (value) => {
        setHeaderSettings((prev) => ({ ...prev, lineThickness: value }));
      },
      [setHeaderSettings],
    ),
  };
}

function useShapeHandlers(setShapeSettings) {
  return {
    handleBlockRadiusChange: useCallback(
      (value) => {
        setShapeSettings((prev) => ({ ...prev, blockRadius: value }));
      },
      [setShapeSettings],
    ),

    handleBlockThicknessChange: useCallback(
      (value) => {
        setShapeSettings((prev) => ({ ...prev, blockThickness: value }));
      },
      [setShapeSettings],
    ),
  };
}

function useSpacingHandlers(setSpacingSettings) {
  return {
    handleSpacingTopChange: useCallback(
      (value) => {
        setSpacingSettings((prev) => ({ ...prev, spacingTop: value }));
      },
      [setSpacingSettings],
    ),

    handleSpacingBottomChange: useCallback(
      (value) => {
        setSpacingSettings((prev) => ({ ...prev, spacingBottom: value }));
      },
      [setSpacingSettings],
    ),
  };
}

function useCheckmarkHandlers(setCheckmarkSettings) {
  return {
    handleCheckmarkVisibilityChange: useCallback(
      (_, value) => {
        setCheckmarkSettings((prev) => ({
          ...prev,
          checkmarkVisibility: value,
        }));
      },
      [setCheckmarkSettings],
    ),
  };
}

// Sub-components for better organization
function BundleNameSection({ bundleName, setBundleName }) {
  return (
    <Card>
      <TextField
        label="Bundle Name"
        value={bundleName}
        onChange={setBundleName}
        autoComplete="off"
      />
    </Card>
  );
}

function VisibilitySection({ visibilitySettings, handlers }) {
  return (
    <Card>
      <Select
        label="Visibility"
        options={VISIBILITY_OPTIONS}
        onChange={handlers.handleVisibilityChange}
        value={visibilitySettings.visibility}
      />
    </Card>
  );
}

function HeaderSection({ headerSettings, handlers }) {
  return (
    <Card>
      <BlockStack gap="400">
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <TextField
              label="Header Text"
              value={headerSettings.headerText}
              onChange={handlers.handleHeaderTextChange}
              autoComplete="off"
            />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Select
              label="Alignment"
              options={ALIGNMENT_OPTIONS}
              onChange={handlers.handleAlignmentChange}
              value={headerSettings.alignment}
            />
          </Grid.Cell>
        </Grid>

        <BlockStack gap="200">
          <Text variant="headingMd">Header line</Text>
          <Checkbox
            label="Add a line to the header title"
            checked={headerSettings.headerLine}
            onChange={handlers.handleHeaderLineChange}
          />
        </BlockStack>

        {headerSettings.headerLine && (
          <RangeSlider
            label="Line thickness"
            value={headerSettings.lineThickness}
            onChange={handlers.handleLineThicknessChange}
            min={SLIDER_CONFIGS.lineThickness.min}
            max={SLIDER_CONFIGS.lineThickness.max}
            output
          />
        )}
      </BlockStack>
    </Card>
  );
}

function ShapeSection({ shapeSettings, handlers }) {
  return (
    <BlockStack gap="200">
      <Text variant="headingMd">Shape</Text>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <RangeSlider
            label="Block radius"
            value={shapeSettings.blockRadius}
            onChange={handlers.handleBlockRadiusChange}
            min={SLIDER_CONFIGS.blockRadius.min}
            max={SLIDER_CONFIGS.blockRadius.max}
            output
          />
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <RangeSlider
            label="Block thickness"
            value={shapeSettings.blockThickness}
            onChange={handlers.handleBlockThicknessChange}
            min={SLIDER_CONFIGS.blockThickness.min}
            max={SLIDER_CONFIGS.blockThickness.max}
            output
          />
        </Grid.Cell>
      </Grid>
    </BlockStack>
  );
}

function SpacingSection({ spacingSettings, handlers }) {
  return (
    <BlockStack gap="200">
      <Text variant="headingMd">Spacing</Text>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <RangeSlider
            label="Top"
            value={spacingSettings.spacingTop}
            onChange={handlers.handleSpacingTopChange}
            min={SLIDER_CONFIGS.spacing.min}
            max={SLIDER_CONFIGS.spacing.max}
            output
          />
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <RangeSlider
            label="Bottom"
            value={spacingSettings.spacingBottom}
            onChange={handlers.handleSpacingBottomChange}
            min={SLIDER_CONFIGS.spacing.min}
            max={SLIDER_CONFIGS.spacing.max}
            output
          />
        </Grid.Cell>
      </Grid>
    </BlockStack>
  );
}

function CheckmarkSection({ checkmarkSettings, handlers }) {
  return (
    <BlockStack gap="200">
      <Text variant="headingMd">Checkmark</Text>
      <BlockStack gap="200">
        <RadioButton
          label="Show radio"
          checked={checkmarkSettings.checkmarkVisibility === "showRadio"}
          id="showRadio"
          name="checkmarkVisibility"
          onChange={handlers.handleCheckmarkVisibilityChange}
          value="show"
        />
        <RadioButton
          label="Hide radio"
          checked={checkmarkSettings.checkmarkVisibility === "hideRadio"}
          id="hideRadio"
          name="checkmarkVisibility"
          onChange={handlers.handleCheckmarkVisibilityChange}
          value="hide"
        />
      </BlockStack>
    </BlockStack>
  );
}

function BlockSettings({
  bundleName,
  setBundleName,
  visibilitySettings,
  setVisibilitySettings,
  headerSettings,
  setHeaderSettings,
  shapeSettings,
  setShapeSettings,
  spacingSettings,
  setSpacingSettings,
  checkmarkSettings,
  setCheckmarkSettings,
}) {
  // Initialize all handlers using custom hooks
  const visibilityHandlers = useVisibilityHandlers(setVisibilitySettings);
  const headerHandlers = useHeaderHandlers(setHeaderSettings);
  const shapeHandlers = useShapeHandlers(setShapeSettings);
  const spacingHandlers = useSpacingHandlers(setSpacingSettings);
  const checkmarkHandlers = useCheckmarkHandlers(setCheckmarkSettings);

  return (
    <BlockStack gap="400">
      <BundleNameSection
        bundleName={bundleName}
        setBundleName={setBundleName}
      />

      <VisibilitySection
        visibilitySettings={visibilitySettings}
        handlers={visibilityHandlers}
      />

      <HeaderSection
        headerSettings={headerSettings}
        handlers={headerHandlers}
      />

      <Card>
        <BlockStack gap="400">
          <ShapeSection
            shapeSettings={shapeSettings}
            handlers={shapeHandlers}
          />

          <SpacingSection
            spacingSettings={spacingSettings}
            handlers={spacingHandlers}
          />

          <CheckmarkSection
            checkmarkSettings={checkmarkSettings}
            handlers={checkmarkHandlers}
          />
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

export default BlockSettings;
