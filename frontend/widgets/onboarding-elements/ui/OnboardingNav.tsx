import React, { useState } from "react";
import {useRouter} from "expo-router";
import {useOnboardingStore} from "@/widgets/onboarding-elements/model/store/useOnboardingStore";
import {Box, OnboardingButton, Stepper} from "@/shared/ui";

export const OnboardingNav = () => {
  const router = useRouter();
  const { page, incPage, decPage } = useOnboardingStore();

  return (
    <Box
      width={"100%"}
      paddingBottom={"l"}
      style={{
        gap: 36,
        paddingHorizontal: 32,
      }}
    >
      <Stepper
        pagesCount={3}
        currentPage={page}
      />
    </Box>
  )
}

