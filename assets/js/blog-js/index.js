new Vue({

  el: '#blog',

  data: {

      icons: ['icon-bg-1','icon-bg-2','icon-bg-3','icon-bg-4'],
      iconBox: ['icon-box-bg-1','icon-box-bg-2','icon-box-bg-3','icon-box-bg-4'],
      piloz: ['piloz-writing','piloz-shield','piloz-user','piloz-gear','piloz-lamp','piloz-linked','piloz-human-resources','piloz-networking'],

      blogKinds: [{}]
  },


  watch: {
  },

  created() {
    this.render_blogKind()
  },

  methods: {

    render_blogKind() {

      let that = this

      axios.get('http://82.156.213.229//findAllBlogKinds').then(function (response) {
        that.blogKinds = response.data
        console.log(response.data)
      })
    },

    showDetails(blogKindName,blogKindLogo,downloadUrl) {
      sessionStorage.setItem("blogKindName", blogKindName);
      sessionStorage.setItem("blogKindLogo", blogKindLogo);
      sessionStorage.setItem("downloadUrl", downloadUrl);
      location.href = 'list.html';
    },


  }
})
