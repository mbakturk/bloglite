<template>
  <div class="container-fluid mt-5">
    <div class="container">
      <div class="row" v-for="(post, index) in postList" v-bind:key="index">
        <div class="col">
          <nuxt-link class="post-title" :to="`p/${post.permalink}`">
            <h2>{{post.title}}</h2>
          </nuxt-link>
          <p class="post-meta pb-3 border-bottom">{{ post.postDate}}</p>
          <div class="ql-snow">
            <div class="ql-editor post-normalize" v-html="post.entry"></div>
          </div>
        </div>
      </div>
      <div class="row justify-content-center" v-if="totalPage > 1">
        <nuxt-link
          class="btn btn-secondary btn-sm page-num-button"
          :to="`/?page=${pageNum-1}`"
          v-if="pageNum > 1"
        >Önceki</nuxt-link>
        <div class="col-auto font-weight-bold d-flex align-items-center">{{pageNum}}</div>
        <nuxt-link
          class="btn btn-secondary btn-sm page-num-button"
          :to="`/?page=${pageNum+1}`"
          v-if="pageNum < totalPage"
        >Sonraki</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import "reflect-metadata";
import axios from "axios";
import { Component, Vue, Prop } from "vue-property-decorator";

console.log("page is running");
@Component({
  watchQuery: ["page"],
  async asyncData({ route, params }) {
    const pageNum = +route.query.page;
    const resp = await axios.post("http://localhost:3000/api/getAllPosts", {
      page: pageNum
    });
    return { ...resp.data, pageNum };
  }
})
export default class PostPreview extends Vue {}
</script>

<style scpoed lang="scss">
.post-title,
.post-title:hover {
  color: #000000;
}

.post-meta {
  color: #9ba1a6;
  font-size: 0.8rem;
  font-weight: bold;
}

.brand-text,
.brand-text:hover {
  color: #494e52;
}

.footer {
  .version {
    font-size: 0.8em;
  }
}

.ql-container {
  font-family: "roboto" !important;
}

.post-normalize {
  height: auto !important;
  padding: 0px !important;
}
</style>