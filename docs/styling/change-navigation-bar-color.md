# Changing the navigation bar color

If you are not happy with the navigation bar color, and you would like it to be more neutral, you can easily change it.

Open the file [NavbarSection](../../src/components/NavbarSection.vue).

The background color of the navbar is defined by `bg-primary-focus` and the color of the text by `text-primary-content`.

```html
</script>
<template>
  <div class="navbar bg-primary-focus text-primary-content">
    <!-- Logo -->
    <div class="flex-1">
```

If you want the navigation bar to be the same color of the background, you can update it like this:


```html
</script>
<template>
  <div class="navbar bg-base-100 text-base-content">
    <!-- Logo -->
    <div class="flex-1">
```

For more examples of navbars, please see the DaisyUI [navbar component documentation](https://daisyui.com/components/navbar/).