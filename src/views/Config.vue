<template>
  <v-card>
    <v-card-text>
      <FieldSet :fieldSet="metaConfig" :exclude="exclude" v-model="value" >
        <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
      </FieldSet>
    </v-card-text>
  </v-card>
</template>

<script>
import FieldSet from "../components/Config/FieldSet.vue";
export default {
  props: ["value", "metaConfig", 'exclude'],
  components: { FieldSet },
  mounted() {
    console.log(this.config);
    console.log('слоты: ', this.$slots)
  },
  computed: {},
  
};
</script>

<style>
</style>