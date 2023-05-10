<template>
  <v-card>
    <v-card-title>{{ fieldSet.label || "Настройки" }}</v-card-title>
    <v-card-text>
      <slot v-for="key in fieldSetKeys" :name="slotName(relativeKey, key)">
        <FieldSet
          :exclude="excludeObject[key] ? [excludeObject[key], ...newExclude] : newExclude"
          :fieldSet="currentFieldSet[key]"
          :relativeKey="relativeKey ? `${relativeKey}.${key}` : key"
          v-model="value[key]"
        >
          <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
        </FieldSet>
        </slot>
        <slot v-for="key in primitiveKeys" :name="slotName(relativeKey, key)">
          <Primitive
            :meta="currentFieldSet[key]"
            v-model="value[key]"
          >
          </Primitive>
        </slot>
    </v-card-text>
    <v-card-actions>
      <slot :name="relativeKey ? `${relativeKey}-btn` : 'button'"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
        // @updateValue="(newValue) => {value[key] = newValue; $emit('input',)} "
import Primitive from "./Primitive.vue";
export default {
  props: ["fieldSet", "value", "exclude", "relativeKey"],
  name: "FieldSet",
  components: { Primitive },
  mounted() {
    console.log('полученный exclude: ', this.exclude)
    console.log('fieldSet slots: ', this.$slots)
    this.primitiveKeys.forEach((element) => {
      this.value[element];
    });
  },
  methods: {
    slotName(relative, current){
      console.log((relative ? `${relative}-${current}` : current) + '-slot')
      return (relative ? `${relative}-${current}` : current) + '-slot'
    }
  },
  computed: {
    splittedExclude(){
      return this.exclude?.map((x) => x.split('.'))
    },
    currentExclude(){
      return this.splittedExclude.filter((x) => x.length == 1).map(x => x.join('.'))
    },
    newExclude(){
      return this.splittedExclude.map(x => {
        return x.join('.')
      })
    },
    excludeObject(){
      return this.splittedExclude.reduce((acc, currentValue) => {
        if (currentValue.length > 1){
          const [key, value] = currentValue          
          return { ...acc , ...Object.fromEntries([[key, value]])}
        } else {

          return acc
        }
      }, {})
    },
    metaKeys() {
      console.log('meta')
      console.log('current_exclude: ', this.currentExclude)
      console.log('currentFields: ', Object.keys(this.currentFieldSet))
      console.log('excludeObject', this.excludeObject)
      console.log('----------')
      return Object.keys(this.currentFieldSet).filter(key => !this.currentExclude.includes(key));
    },
    primitiveKeys() {
      console.log("curr: ", this.currentFieldSet);
      return this.metaKeys.filter(
        (key) => this.currentFieldSet[key].is_primitive
      );
    },
    fieldSetKeys() {
      return this.metaKeys.filter(
        (key) => !this.currentFieldSet[key].is_primitive
      );
    },
    iterableKeys() {
      return this.metaKeys.filter(
        (key) => this.currentFieldSet[key].is_iterable
      );
    },
    currentFieldSet() {
      return this.fieldSet.type || this.fieldSet;
    },
  },
};
</script>

<style>
</style>