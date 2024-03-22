# How to use DaisyUI's components

DaisyUI is a framework built on TailwindCSS, allowing to save time on writing CSS.
DaisyUI come with [a collection of components](https://daisyui.com/components/button/): buttons, navigation bars, modals, footers, inputs, tables, etc.

For example, to use DaisyUI's buttons, you simply have to use the usual HTML `<button>` tag, and add the corresponding class to it:

```html
<button class="btn">Button</button>
```

Then if you want to change the color you can specify it in the class:

```html
<button class="btn btn-primary">Button</button>
```

DaisyUI also provides color shortcuts for backgrounds:
```html
<div class="bg-primary">The background of this text will be of color primary</div>
```

Or texts:
```html
<div class="text-primary">The color of this text will be of color primary</div>
```

And more:
* border
* stroke
* fill: for SVG components
* outline
* placeholder
* [etc.](https://daisyui.com/docs/colors/#-3)

For more information and examples, take a look at TailwindCSS's [documentation](https://tailwindcss.com/docs/ring-offset-color)

If you are wondering how to apply this on the navigation bar for example, take a look at this [tutorial](./change-navigation-bar-color.md).