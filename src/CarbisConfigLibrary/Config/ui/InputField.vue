<template>
  <v-text-field
    hide-details=""
    dense
    outlined
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
  </v-text-field>
</template>

<script>
export default {};
</script>