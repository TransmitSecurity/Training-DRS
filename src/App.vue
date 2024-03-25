<script setup lang="ts">
import NavbarSection from "@/components/NavbarSection.vue";
import { onBeforeMount, onMounted } from "vue";
import { userPreferenceStore } from "./store/userPreferences";
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";
import {
  type DaisyThemes,
  useThemeManager,
  daisyThemes,
} from "@/plugins/themeManager";
import * as tsSdk from "./helpers/tsSdk";
import { ref } from "vue";
import { loadSession } from "./helpers/session";

const preference = userPreferenceStore();
const i18n = useI18n();
const $theme = useThemeManager();
const platformLoading = ref(true);
const sessionLoading = ref(true);

onBeforeMount(() => {
  // Add a script tag to the page to download the ts-platform sdk
  // https://developer.transmitsecurity.com/guides/risk/quick_start_web/#step-2-load-sdk
  const platformScript = document.createElement("script");
  platformScript.src = import.meta.env.VITE_PLATFORM_SDK_URL;
  platformScript.defer = true;
  platformScript.id = "ts-platform-script";
  document.head.appendChild(platformScript);

  // Then, initialize the ts-platform sdk
  tsSdk.initWhenLoaded();

  // The ts platform SDK is not loaded yet, we need to wait
  // for it to be loaded and then initialize the app
  // this is necessary to perform a silent risk based user authentication
  document.addEventListener("tsPlatformLoaded", async function (e) {
    platformLoading.value = false;
    await loadSession();

    // Dispatch an event indicating that the session was loaded
    // when the session is loaded the app is displayed
    const event = new CustomEvent("sessionLoaded");
    document.dispatchEvent(event);
    console.log("Session loading attempt done");
  });

  // The session is not loaded yet, we need to wait
  // this is necessary to perform a silent risk based user authentication
  document.addEventListener("sessionLoaded", function (e) {
    sessionLoading.value = false;
  });
});

onMounted(() => {
  // Set the language based on saved preferences
  if (preference.language !== "" && i18n.locale.value !== preference.language)
    i18n.locale.value = preference.language;

  // Set the theme based on the .env configuration or saved preferences
  const theme = preference.theme || import.meta.env.VITE_THEME || "breeze";
  $theme.set(theme as DaisyThemes);
});
</script>

<template>
  <div class="min-h-screen overflow-auto flex flex-col">
    <div
      v-if="platformLoading || sessionLoading"
      class="flex h-screen w-full justify-center items-center"
    >
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
    <div v-else>
      <navbar-section />
      <router-view />
    </div>
  </div>
</template>
