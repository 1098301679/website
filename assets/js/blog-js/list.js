new Vue({

  el: '#pricing',

  data: {

      icons: ['icon-bg-1','icon-bg-2','icon-bg-3','icon-bg-4'],
      iconBox: ['icon-box-bg-1','icon-box-bg-2','icon-box-bg-3','icon-box-bg-4'],
      piloz: ['piloz-writing','piloz-shield','piloz-user','piloz-gear','piloz-lamp','piloz-linked','piloz-human-resources','piloz-networking'],

      blogKind: '',
      blogs: [{}]
  },


  watch: {
  },

  created() {
    this.render_blogs()
  },

  methods: {

    render_blogs() {

      this.blogKind = sessionStorage.getItem('blogKindName')

      let that = this

      axios.get('http://noox.top:8000/findBlogsByKind/' + sessionStorage.getItem('blogKindName')).then(function (response) {

        that.blogs = response.data
      })
    },
    showBlogDetail(blogName,url) {
      sessionStorage.setItem('blogName', blogName);
      sessionStorage.setItem('url', url);
      location.href = 'blog.html';
    }

  }
})
