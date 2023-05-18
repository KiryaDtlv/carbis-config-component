<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
    </template>
    {{ hint || label }}
  </v-tooltip>
</template>

<script>
export default {
  props: ["label", "hint"],
};
</script>

<style>
</style>