# How does the localization work?

This website offers multiple translations, and a component [LocaleSwitcher](../../src/components/language/LocaleSwitcher.vue) allowing to change the language dynamically directly from the navigation bar.

## Tech stack

Translations are provided thanks to the [Vue i18n](https://vue-i18n.intlify.dev/) plugin.

In VueJS templates, you will see it referred as `$t`:

```jsx
<h2 class="text-lg leading-6 font-medium text-base-content">
    {{ $t('authentication.password') }}
</h2>
```

In VueJS scripts, you will see it being initialized with `const { t } = useI18n()` then used with `t()`:

```js
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
toast.error(t('error.anErrorOccurred'))
```

## Translation files

Translations are stored in the [locales](../../src/locales/) folder.
Each translation consists of a JSON file where the key is the name of the translation and the value is the translation itself.


```json
{
    "password": {
        "currentPasswordRequired": "Your current password is required",
        "newPasswordRequired": "Your new password is required",
        "updatePassword": "Update password"
    }
}
```

## Using translations in pages

To allow text to be translated dynamically, instead of writing your text directly in your page or component, refer to the complete translation path instead.

For example, you are probably used to having a button "Update password" like this, that would never update when the language is changed:

```jsx
<button class="btn btn-primary" type="submit">
    Update password
</button>
```

Instead, you can reference the path `password.updatePassword` as written in the JSON files:

```jsx
<button class="btn btn-primary" type="submit">
    {{ $t('password.updatePassword') }}
</button>
```

## Default locale

The locale will be chosen with the following priorities:

1. The locale selected by the user, saved in the user preferences (in the local storage)
2. The navigator's locale
3. The fallback locale as defined in the environment variable `VITE_FALLBACK_LOCALE`
4. As a last resort, 'en-US'.

