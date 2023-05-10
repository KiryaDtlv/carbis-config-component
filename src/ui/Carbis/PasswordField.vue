<template>
  <v-text-field
    v-bind="$attrs"
    v-on="$listeners"
    :append-icon="showpwd ? 'mdi-eye-off' : 'mdi-eye'"
    @click:append="showpwd = !showpwd"
    :type="showpwd ? $attrs.type : 'password'"
  >
    <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
  </v-text-field>
</template>

<script>
export default {
  mounted() {
    console.log(this.$attrs);
  },
  data() {
    return {
      showpwd: false,
    };
  },
};
</script>

<style>
</style>