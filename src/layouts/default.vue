<template>
  <div>
    <div class="container-fluid pt-3 pb-3 border-bottom shadow-sm blog-header">
      <div class="container">
        <div class="row no-gutters">
          <div class="col-auto">
            <img class="rounded-circle" src="avatar.jpg" alt="avatar">
          </div>
          <div class="col blog-header-right">
            <div class="row no-gutters">
              <div class="col">
                <div class="row no-gutters blog-header-titles">
                  <div class="col">
                    <a href="/">
                      <h3>Mehmet Burak Aktürk</h3>
                    </a>
                  </div>
                  <div class="w-100"></div>
                  <div class="col">
                    <h6>Yazılım Mühendisi / Kişisel Blog Sitesi</h6>
                  </div>
                </div>
              </div>
              <div class="col-lg blog-header-links">
                <a href="https://github.com/mbakturk" title="Github" target="_blank">
                  <i class="mr-1 fab fa-github"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/mehmet-burak-aktürk-14115a35"
                  title="Linkedin"
                  target="_blank"
                >
                  <i class="mr-1 fab fa-linkedin"></i>
                </a>
                <a href="http://mbakturk.com/rss" title="RSS" target="_blank">
                  <i class="mr-1 fas fa-rss"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nuxt/>
  </div>
</template>

<style lang="scss">

@import "@/assets/css/custom.scss";

.blog-header {
  img {
    width: 92px;
  }

  .blog-header-right {
    padding-left: 1rem;
  }

  .blog-header-titles {
    margin-top: 0.75rem;

    h3 {
      font-weight: bold;
    }
  }

  .blog-header-links {
    text-align: right;
  }

  @include media-breakpoint-down(md) {
    .blog-header-links {
      text-align: left;
    }

    .blog-header-titles {
      margin-top: 0.25rem;
    }
  }

  @include media-breakpoint-down(sm) {
    img {
      width: 70px;
    }

    .blog-header-right {
      padding-left: 0.5rem;
    }

    h3 {
      font-size: 1.5rem;
    }

    h6 {
      font-size: 0.75rem;
    }
  }

  @include media-breakpoint-down(xs) {
    h3 {
      font-size: 1.25rem;
    }
  }
}
</style>
