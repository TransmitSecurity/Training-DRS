import { userSessionStore } from "@/store/userSession";
import { ConfigApi } from "@transmitsecurity-dev/ts-demo-client-lib";

const backendAPI = import.meta.env.VITE_BACKEND_URL;
const configApi = new ConfigApi(undefined, backendAPI);

export const sdkSourceUrl = import.meta.env.VITE_RISKID_SDK_SOURCE_URL;

export function initWhenLoaded() {
  console.log(
    "Transmit Security platform SDK - adding initialization listener"
  );
  const platformScript = document.getElementById("ts-platform-script");
  if (platformScript) {
    platformScript.addEventListener("load", async function () {
      try {
        const response = await configApi.getClientId();

        console.log("Retrieved client id");
        console.log(response);
        if (response.status == 200) {
          console.log("TSPlatform -- Starting init");
          // https://developer.transmitsecurity.com/guides/risk/quick_start_web/#step-2-load-sdk
          await window.tsPlatform.initialize({
            clientId: response.data.clientId,
            webauthn: { serverPath: import.meta.env.VITE_TS_SERVER_PATH },
          });
          console.log("TSPlatform -- End init");
          // Dispatch an event indicating that the SDK was initialized
          // this is helpful whenever webauthn authentication needs to be used
          // and we need to wait for the SDK
          const event = new CustomEvent("tsPlatformLoaded", {
            detail: {
              message: "TSPlatform loaded",
              time: new Date(),
            },
          });
          document.dispatchEvent(event);
          const userSession = userSessionStore();
          userSession.setTsPlatformLoaded(true);
        }
      } catch (error) {
        console.log("Error while retrieving the client ID");
        console.log(error);
      }
    });
  } else {
    console.log("Platform element not found");
  }
}
