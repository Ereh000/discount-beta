// hooks/useInitializeState.js
import { useCallback } from "react";

export function useInitializeState(isEdit, data) {
  const initializeState = useCallback(
    (defaultValue, loadedPath) => {
      if (isEdit && data?.settings && loadedPath) {
        const keys = loadedPath.split(".");
        let value = data.settings;
        for (const key of keys) {
          value = value?.[key];
        }
        return value !== undefined ? value : defaultValue;
      }
      return defaultValue;
    },
    [isEdit, data],
  );

  return initializeState;
}
