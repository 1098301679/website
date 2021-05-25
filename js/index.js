new Vue({

  el: '#features',

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

      axios.get('http://noox.top:8000//findAllBlogKinds').then(function (response) {
        console.log(response.data);
        that.blogKinds = response.data
      })
    },

    showDetails(blogKindName) {


      console.log('blogkindname' + blogKindName);
      sessionStorage.setItem("blogKindName", blogKindName);
      location.href = 'list.html';
    }
  }
})
