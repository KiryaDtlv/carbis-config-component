<template>
  <v-card>
    <v-card-text>
      <v-skeleton-loader
        v-if="loading"
        type="list-item-three-line"
      ></v-skeleton-loader>
      <FieldSet
        v-else
        :locale="localization"
        :fieldSet="metaConfig"
        :isDev="isDev"
        :exclude="exclude"
        v-model="value"
        @validate="(v) => $emit('validate', v)"
      >
        <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
      </FieldSet>
    </v-card-text>
  </v-card>
</template>

<script>
import FieldSet from "../components/Config/FieldSet.vue";
export default {
  props: ["value", "metaConfig", "exclude", "loading", "locale", "isDev"],
  components: { FieldSet },
  mounted() {},
  methods: {
    localization(value) {
      if (this.locale) {
        return this.locale(value) || value;
      } else {
        return value;
      }
    },
  },
};
</script>

<style>
</style>