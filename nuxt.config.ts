import NuxtConfiguration from '@nuxt/config';

const config: NuxtConfiguration = {
    mode: 'universal',
    srcDir: 'src/',

    /*
    ** Header of the page
    */

    head: {
        title: 'Bloglite',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: 'description'}
        ],
        link: [{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}]
    },

    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#fff'},

    /*
    ** Global CSS
    */
   css: [],

   /*
   ** Plugins to load before mounting the App
   */
   plugins: [],

   /*
   ** Nuxt.js modules
   */

   modules: [
       '@nuxtjs/axios'
   ]
};

export default config;