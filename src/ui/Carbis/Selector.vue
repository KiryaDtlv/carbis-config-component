<template>
  <AutoComplete
    v-model="currentValue"
    :items="items"
    item-text="name"
    :item-value="(value) => value"
    @change="(v) => checkChange(v)"
  >
    <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
  </AutoComplete>
</template>

<script>
import AutoComplete from "./AutoComplete.vue";
export default {
  props: ["items", "value"],
  data() {
    return {
      currentValue: undefined,
    };
  },
  components: { AutoComplete },
  mounted() {
    this.currentValue = this.getCurrent(this.value, this.items);
  },
  methods: {
    getCurrent(value, items) {
      const index = items.findIndex((x) => x.id == value);
      if (index !== -1) {
        return items[index];
      } else {
        return undefined;
      }
    },
    checkChange(value) {
      console.log(value);
      this.$emit("input", value.id);
    },
  },
};
</script>

<style>
</style>