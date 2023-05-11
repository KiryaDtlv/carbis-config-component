<template>
  <v-card-text
    style="
      line-height: 1.4em;
      padding: 0 0 1.645em 0 !important;
      position: relative;
    "
    class="d-flex align-center"
  >
    <v-tooltip top right v-if="hint">
      <template v-slot:activator="{ on }">
        <v-icon
          v-on="on"
          style="padding-right: 0.39em; transform: translateY(-5px)"
        >
          mdi-help-circle-outline
        </v-icon>
      </template>
      <span style="white-space: pre-wrap" v-html="hint"></span>
    </v-tooltip>

    <div style="flex-grow: 1">
      <div class="info-label-container">
        <slot name="label">
          <span
            class="info-label"
            style="
              font-size: 0.9em;
              font-style: italic;
              color: var(--v-secondary-base);
              display: inline-block;
              width: 100%;
            "
          >
            {{ label }}
          </span>
        </slot>
      </div>
      <div
        style="padding-left: 1.2em; padding-top: 0.3em; line-height: 1.6em"
        class="info-value"
      >
        <v-skeleton-loader
          style="padding: 0.4em 0; line-height: 0.8em; margin: 0 !important"
          v-if="loading"
          type="text"
        ></v-skeleton-loader>
        <slot v-else />
      </div>
    </div>
  </v-card-text>
</template>

<script>
export default {
  props: {
    label: String,
    hint: String,
    loading: Boolean,
  },
};
</script>

<style scoped>
.info-label-container {
  padding-left: 0.3em;
  /* margin-bottom: -.7em; */
  /* background: red; */
}

.info-value {
  position: relative;
  border-top: solid 1px var(--v-secondary-base);
  border-top-left-radius: 0.3em;
}

.info-value::before {
  content: " ";
  /* height: .8em; */
  height: calc(50% + 0.15em);
  width: 0.8em;
  position: absolute;
  top: 0em;
  left: 0;

  /* background: red; */
  border-left: solid 1px var(--v-secondary-base);
  border-bottom: solid 1px var(--v-secondary-base);
  border-top-left-radius: 0.3em;
  border-bottom-left-radius: 0.3em;
}
</style>

<style>
.v-skeleton-loader__text {
  margin: 0 !important;
}
</style>