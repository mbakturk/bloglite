<template>
  <div>
    <nav class="navbar-expand-lg navbar navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">BlogLite</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/editor">Create Post</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {};
  },
  methods: {},
});
</script>

<style scoped lang="scss">
.page-num-button {
  width: 100px;
}
</style>
