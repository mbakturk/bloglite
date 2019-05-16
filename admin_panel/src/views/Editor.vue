<template>
  <div class="container editor-page">
    <div class="row">
      <div class="col">
        <h1 class="mt-3 mb-3">Editor</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <input
          class="form-control"
          type="text"
          placeholder="Title"
          v-model="title"
          @change="setPermalink($event.target.value)"
        >
      </div>
    </div>
    <div class="row justify-content-between editor-row">
      <div class="input-group col-auto">
        <div class="input-group-prepend">
          <div class="input-group-text">Permalink</div>
        </div>
        <input
          class="form-control permalink-input"
          aria-label="Permalink"
          v-model="permalink"
          @change="setPermalink($event.target.value, true)"
        >
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div ref="editor" style="height:600px;"></div>
      </div>
    </div>
    <div class="row justify-content-end">
      <label class="col-auto col-form-label">Status:</label>
      <div class="col-auto">
        <select v-model="status" class="form-control">
          <option value="0">Drafted</option>
          <option value="1">Published</option>
        </select>
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" type="button" @click="submit()">Publish</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import $http from "../http-client";

declare const Quill: any;

export default Vue.extend({
  data() {
    return {
      postId: null,
      editor: null,
      title: "",
      permalink: "",
      postOK: false,
      status: 0,
    };
  },

  mounted() {
    var toolbarOptions = [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown

      ["bold", "italic", "underline", "strike"], // toggled buttons
      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      ["link", "image", "video"],
      ["blockquote", "code-block"],
      ["clean"], // remove formatting button
    ];

    this.editor = new Quill(this.$refs.editor, {
      modules: {
        syntax: true,
        toolbar: toolbarOptions,
      },
      theme: "snow",
    });

    if (this.$route.params.id) {
      $http.post("post", { postId: +this.$route.params.id }).then(resp => {
        this.postId = resp.data.post.id;
        this.title = resp.data.post.title;
        this.permalink = resp.data.post.permalink;
        this.status = resp.data.post.status;
        // @ts-ignore
        this.editor.root.innerHTML = resp.data.post.entry;
      });
    }
  },

  methods: {
    setPermalink(val: any, force: boolean = false) {
      if (!this.permalink || !this.postId || force) {
        $http.post("getPermalink", { permalink: val }).then(resp => {
          this.permalink = resp.data.permalink;
        });
      }
    },

    submit() {
      var post = {
        id: this.postId,
        title: this.title,
        // @ts-ignore
        entry: this.editor.root.innerHTML,
        permalink: this.permalink,
        status: this.status
      };

      $http
        .post(!post.id ? "createPost" : "updatePost", post)
        .then(() => this.$router.push({ name: "dashboard" }));
    },
  },
});
</script>

<style scoped lang="scss">
.editor-page {
  .permalink-input {
    font-size: 0.75rem;
  }
  .row {
    margin-bottom: 1rem;
  }
}
</style>
