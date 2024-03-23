<script setup lang="ts">
/**
 * This component displays a form with an email input
 * and a password input providing a way for a user
 * to either login or signup with a password.
 */
import { type Ref, ref, computed, onMounted } from "vue";
import useVuelidate from "@vuelidate/core";
import UserInput from "@/components/inputs/UserInput.vue";
import { useToast } from "vue-toastification";
import PasswordInput from "@/components/inputs/PasswordInput.vue";
import { useI18n } from "vue-i18n";
import { emailRule, loginPasswordRule } from "@/helpers/validationRules";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { AuthenticationApi } from "@transmitsecurity-dev/ts-demo-client-lib";
import { loadSession } from "@/helpers/session";
import { userSessionStore } from "@/store/userSession";
import { handleError } from "@/helpers/errors";
import FaceIdIcon from "@/components/icons/FaceIdIcon.vue";
import TouchIdIcon from "@/components/icons/TouchIdIcon.vue";
import { Action, reportAction } from "@/helpers/risk";
import FooterSection from "@/components/FooterSection.vue";

const { t } = useI18n();
const email: Ref<string> = ref("");
const password: Ref<string> = ref("");
const toast = useToast();
const loading = ref(false);

const router = useRouter();
defineEmits(["resetPassword", "onLoginSuccess", "onLoginError"]);
const userSession = userSessionStore();

/**
 * Server APIs
 */
const authApi = new AuthenticationApi(
  undefined,
  import.meta.env.VITE_BACKEND_URL
);

onMounted(() => {
  if (userSession.tsPlatformLoaded) {
    initializeWebauthn();
  } else {
    // The ts platform SDK is not loaded yet, we need to wait
    // for it to be loaded and then initialize webauthn
    document.addEventListener("tsPlatformLoaded", function (e) {
      initializeWebauthn();
    });
  }
});

onBeforeRouteLeave(async () => {
  // Abord any conditional mediation started when the user leaves the login page
  await window.tsPlatform.webauthn.authenticate.autofill.abort();
});

async function initializeWebauthn() {
  console.log("Verifying if webauthn is supported");
  window.tsPlatform.webauthn
    .isPlatformAuthenticatorSupported()
    .then((supported: boolean) => {
      userSession.setWebAuthnSupported(supported);
      console.log(`Webauthn is ${supported ? "" : "not"} supported`);
    });

  console.log("Verifying if autofill is supported");
  const autofillSupported = window.tsPlatform.webauthn.isAutofillSupported();
  if (autofillSupported) {
    console.log("Initializing conditional UI");
    // First, abort any conditional mediation started when the user leaves the login page
    await window.tsPlatform.webauthn.authenticate.autofill.abort();
    // Then activate a new conditional mediation
    await window.tsPlatform.webauthn.authenticate.autofill.activate({
      onSuccess: loginWebauthnAutofill,
      onError: onWebauthnAutofillError,
    });
  } else {
    console.log("Autofill not supported");
  }
}

async function loginPassword() {
  const isFormCorrect =
    (await v$.value.email.$validate()) && (await v$.value.password.$validate());
  console.log(`formCorrect ${isFormCorrect}`);
  if (isFormCorrect) {
    // Authenticate with a password
    loading.value = true;
    try {
      // WEBINAR ACTION - Report the login action
      /* reportAction(Action.LOGIN) */
      const response = await authApi.authenticatePassword({
        email: email.value,
        password: password.value,
      });
      if (response.status == 200) {
        console.log(response.data);
        await loadSession();
        router.push({ name: "home" });
      } else {
        toast.error(response.statusText);
      }
    } catch (error) {
      handleError(error);
    } finally {
      loading.value = false;
    }
  } else {
    toast.error(t("toast.error.invalidForm"));
  }
}

async function loginWebauthn() {
  try {
    // Abort autofill login
    await window.tsPlatform.webauthn.authenticate.autofill.abort();
    // Proceed to traditional login
    // WEBINAR ACTION - Report the login action
    /* reportAction(Action.LOGIN); */
    const webauthnEncodedResult =
      await window.tsPlatform.webauthn.authenticate.modal(email.value);
    const response = await authApi.authenticateWebauthn({
      webauthnEncodedResult,
    });
    console.log(response);
    console.log(response.data);
    await loadSession();
    router.push({ name: "home" });
  } catch (error) {
    // handleError(error)
  } finally {
    loading.value = false;
  }
}

async function loginWebauthnAutofill(webauthnEncodedResult: string) {
  try {
    // WEBINAR ACTION - Report the login action
    /* reportAction(Action.LOGIN); */
    const response = await authApi.authenticateWebauthn({
      webauthnEncodedResult,
    });
    console.log(response);
    console.log(response.data);
    await loadSession();
    router.push({ name: "home" });
  } catch (error) {
    // handleError(error)
  } finally {
    loading.value = false;
  }
}

async function onWebauthnAutofillError(error: any) {
  // handleError(error)
}

const validationRules = {
  email: emailRule(),
  password: loginPasswordRule(),
};

const v$ = useVuelidate(validationRules, {
  email: email,
  password,
});

const errorFound = computed(() => {
  return v$.value.$errors && v$.value.$errors.length > 0;
});

const errorMessage = computed(() => {
  if (errorFound.value) {
    return v$.value.$errors[0].$message.toString();
  } else {
    return "Hidden error message";
  }
});
</script>
<template>
  <div class="flex flex-grow flex-col px-6 py-12 lg:px-8 bg-base-200">
    <div class="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-base-content"
      >
        {{ $t("authentication.signInToYourAccount") }}
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="flex flex-col">
        <form
          @submit.prevent="loginWebauthn"
          class="flex flex-col gap-y-4 w-full bg-base-100 p-5 rounded-btn"
          novalidate
        >
          <h2 class="text-center">Sign in with a passkey</h2>
          <div class="flex flex-row justify-center gap-4">
            <face-id-icon class="w-10 fill-primary stroke-primary" />
            <hr />
            <touch-id-icon class="w-10 fill-primary stroke-primary" />
          </div>
          <button
            type="submit"
            class="btn btn-block btn-primary"
            :class="loading ? 'loading loading-spinner btn-disabled' : ''"
          >
            {{ $t("authentication.login") }}
          </button>
        </form>
        <div
          class="flex items-center my-4 before:flex-1 before:border-t before:border-base-300 before:mt-0.5 after:flex-1 after:border-t after:border-base-300 after:mt-0.5"
        >
          <p class="text-center font-semibold mx-4 mb-0">
            {{ $t("authentication.or") }}
          </p>
        </div>
        <form
          @submit.prevent="loginPassword"
          class="flex flex-col gap-y-4 w-full"
          novalidate
        >
          <div class="flex-col flex gap-y-4">
            <user-input
              :label="$t('userData.email')"
              v-model="email"
              :validation="v$.email"
              input-type="email"
              :display-invalid-message="false"
              :placeholder="$t('userData.email')"
              autocomplete="username webauthn"
              autofocus
            />
            <password-input
              :label="$t('authentication.password')"
              v-model="password"
              :validation="v$.password"
              :display-invalid-message="false"
              :placeholder="$t('authentication.password')"
            />
          </div>

          <div class="text-xs" :class="errorFound ? 'visible' : 'invisible'">
            <span class="text-error-content">{{ errorMessage }}</span>
          </div>

          <div class="flex flex-col gap-y-1">
            <button
              type="submit"
              class="btn btn-block btn-primary"
              :class="loading ? 'loading loading-spinner btn-disabled' : ''"
            >
              {{ $t("authentication.login") }}
            </button>

            <div class="flex justify-center">
              <a class="link link-hover" @click="$emit('resetPassword')">
                {{ $t("password.forgotPassword") }}
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="mt-5 text-center">
      <p class="text-sm">
        {{ $t("authentication.dontHaveAccount") }}
        <router-link :to="{ name: 'signup' }" class="link text-accent">
          {{ $t("authentication.signup") }}
        </router-link>
      </p>
    </div>
  </div>

  <footer-section />
</template>
