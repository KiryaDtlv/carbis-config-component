<template>
  <v-icon color="warning" @click="reset(oldValue)">{{
    oldValue !== newValue ? "mdi-update" : undefined
  }}</v-icon>
</template>

<script>
export default {
  props: ["newValue", "oldValue"],
  methods: {
    reset(oldValue) {
      this.$emit("reset", oldValue);
    },
  },
};
</script>

<style>
</style>