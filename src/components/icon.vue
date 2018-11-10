<docs>
### Icon
Reference to a SVG sprite id for usage as icon.

##### Properties
- `label` — A label referring to the icon id in the SVG sprite.

##### Instantiation
`<icon label="icon-id"></icon>`
</docs>

<template>
  <svg class="icon fill-current"><use :xlink:href="'#' + label"></use></svg>
</template>

<script>
import svg from "../svg";

export default {
  name: "icon",
  props: {
    label: String
  }
};
</script>
