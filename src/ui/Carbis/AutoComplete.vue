<template>
  <v-autocomplete
    v-bind="$attrs"
    v-on="$listeners"
    :menu-props="{bottom: true, overflowY: true}"
  >
    <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
  </v-autocomplete>
</template>

<script>
export default {
  mounted() {
  },
  data() {
    return {
    };
  },
};
</script>

<style>
</style>