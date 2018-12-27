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
  blockName: 'icon',
  props: {
    label: String,
    color: {
      type: [String, Boolean],
      default: false,
    },
    size: {
      type: [String, Boolean],
      default: false,
    },
  },
};
</script>

<template>
  <svg v-bem="{ color, size }"><use :xlink:href="`#${label}`"></use></svg>
</template>
