<template>
  <v-switch
    inset
    dense
    v-bind="$attrs"
    v-on="$listeners"
    v-model="currentValue"
  >
    <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
  </v-switch>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      currentValue: this.value,
    };
  },
  mounted() {
    // console.log(this.currentValue);
  },
  watch: {
    currentValue(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>

<style>
</style>