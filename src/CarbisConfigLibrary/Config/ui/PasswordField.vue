<template>
  <InputField
    v-bind="$attrs"
    v-on="$listeners"
    :append-icon="showpwd ? 'mdi-eye-off' : 'mdi-eye'"
    @click:append="showpwd = !showpwd"
    :type="showpwd ? $attrs.type : 'password'"
  >
    <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
  </InputField>
</template>

<script>
import InputField from "./InputField.vue";
export default {
  components: { InputField },
  mounted() {},
  data() {
    return {
      showpwd: false,
    };
  },
};
</script>

<style>
</style>