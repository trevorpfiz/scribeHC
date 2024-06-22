import "@shopify/flash-list/jestSetup";

import type { RenderOptions } from "@testing-library/react-native";
import type { ReactElement } from "react";
import React from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { render } from "@testing-library/react-native";

const createAppWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <BottomSheetModalProvider>
      <NavigationContainer>{children}</NavigationContainer>
    </BottomSheetModalProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => {
  const Wrapper = createAppWrapper(); // make sure we have a new wrapper for each render
  return render(ui, { wrapper: Wrapper, ...options });
};

export * from "@testing-library/react-native";
export { customRender as render };
