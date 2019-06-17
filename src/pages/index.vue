<template>
  <h1>{{msg}}</h1>
</template>

<script lang="ts">
import "reflect-metadata";
import axios from "axios";
import { Component, Vue, Prop } from "vue-property-decorator";

console.log("page is running");
@Component({
  async asyncData({ params }) {
    console.log("asyncData is working");

    return { msg: "hello" };
  }
})
export default class PostPreview extends Vue {
  msg: string = "burki";
}
</script>