<docs>
### Base icon
Reference to a SVG sprite id for usage as base-icon.

##### Properties
- `label` — A label referring to the base-icon id in the SVG sprite.

##### Instantiation
`<base-icon label="icon-label"></base-icon>`
</docs>

<script>
import svg from '../svg';

export default {
  name: 'base-icon',
  props: {
    label: String,
  },
};
</script>

<template>
  <svg class="base-icon fill-current">
    <use :xlink:href="'#' + label"></use>
  </svg>
</template>
