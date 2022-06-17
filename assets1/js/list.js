new Vue({

  el: '#content',

  data: {
    blogKind: '',
    blogKindLogo: '',
    downloadUrl: '',
    blogs: [],
    representBlogs: [],
    uploadFlag: true,

    //html页面表单数据
    blogData: {},


    serverAddress: 'http://82.156.213.229',
    aliyunAddress: 'https://dinosaur-blogs.oss-cn-beijing.aliyuncs.com'


  },

  watch: {
    uploadFlag() {
      this.render_blogs()
    }
  },

  created() {
    this.render_blogs()
  },

  methods: {

    render_blogs() {
      

      this.blogKind = sessionStorage.getItem('blogKindName')
      this.blogKindLogo = sessionStorage.getItem('blogKindLogo')
      this.downloadUrl = sessionStorage.getItem('downloadUrl')

      document.title = this.blogKind

      axios.all([this.findBlogsByKind(), this.findRepresentBlogsByKind()])
        .then(axios.spread((res1, res2) => {
          this.blogs = res1.data
          this.representBlogs = res2.data
        }))
    },

    showBlogDetail(blogName, url) {
      sessionStorage.setItem('url', url);
      sessionStorage.setItem('blogName', blogName);
      location.href = 'blog.html';
    },

    collectData() {
      //收集页面表单数据
      this.blogData.blogName = document.querySelector('#blogName').value
      this.blogData.blogKind = document.querySelector('#blogKind').value
      this.blogData.blogIntroduction = document.querySelector('#blogIntroduction').value

      this.blogData.blogFile = document.querySelector('#blogFile').files[0]
      this.blogData.blogLogoFile = document.querySelector('#blogLogoFile').files[0]

      let blogRepresent = document.getElementsByName("represent")

      for (let i = 0; i < blogRepresent.length; i++)
        if (blogRepresent[i].checked)
          this.blogData.blogRepresent = blogRepresent[i].value

      this.blogData.blogUploadPassword = document.querySelector('#blogUploadPassword').value;
      this.blogData.tip = document.querySelector('#upload-tip');
      this.blogData.blogFileName = this.blogData.blogFile.name

      if (this.blogData.blogLogoFile != null)
        this.blogData.blogLogoFileName = this.blogData.blogLogoFile.name;
    },


    updateBlog() {

      collectData()
      //数据不合格则清空收集的数据然后返回，不进行数据处理
      if (this.blogData.blogName == '' || this.blogData.blogIntroduction == '' || this.blogData.blogFile == null
        || (this.blogData.blogRepresent == 1 && this.blogData.blogLogoFile == null)) {
          this.blogData = {};
          return;
      }
        

      //向OSS插入博客与可能的logo图，并向数据库插入
      axios.all([this.getPolicyAndInsertBlog(), this.getPolicyAndInsertBlogLogo()])
        .then(axios.spread((res1, res2) => {

          this.blogData.tip.innerHTML = "添加成功,可以继续添加别的博客或关闭！"
          this.blogData.tip.className = "col-md-9 text-left text-success"

          //清楚保存的所有数据
          this.blogData = {};

        })).catch(error => {
          this.blogData.tip.innerHTML = "添加失败"
          this.blogData.tip.className = "col-md-9 text-left text-danger"

          //清楚保存的所有数据
          this.blogData = {};
        })
    },


    //向服务端要签名数据，如果签名数据中的密码不对则不允许上传
    //如果密码正确，构造提交Oss的数据与数据库的数据并提交
    getPolicyAndInsertBlog() {
      return axios.get(`${this.serverAddress}/oss/policy/${this.blogKind}/${this.blogData.blogUploadPassword}`).then((response) => {


        if (response.data.allow == "false") {
          this.blogData.tip.innerHTML = "密码不对哦 很难办事哦！"
          this.blogData.tip.className = "col-md-9 text-left text-danger"
          return;
        }

        let formData = new FormData();
        formData.append('key', response.data.dir + this.blogData.blogFileName)
        formData.append('OSSAccessKeyId', response.data.accessid)
        formData.append('policy', response.data.policy)
        formData.append('signature', response.data.signature)
        formData.append('file', this.blogData.blogFile)

        axios.all([this.databaseInsertBlog(response.data), this.ossInsertBlog(formData)])

      })
    },


    getPolicyAndInsertBlogLogo() {
      if (this.blogData.blogLogoFileName == null)
        return null

      return axios.get(`${this.serverAddress}/oss/policy/logo/${this.blogData.blogUploadPassword}`).then((response) => {

        if (response.data.allow == "false") {
          this.blogData.tip.innerHTML = "密码不对哦 很难办事哦！"
          this.blogData.tip.className = "col-md-9 text-left text-danger"
          return;
        }

        let formData = new FormData();
        formData.append('key', response.data.dir + this.blogData.blogLogoFileName)
        formData.append('OSSAccessKeyId', response.data.accessid)
        formData.append('policy', response.data.policy)
        formData.append('signature', response.data.signature)
        formData.append('file', this.blogData.blogLogoFile)

        axios({
          method: 'post',
          url: this.aliyunAddress,
          data: formData,
          dataType: 'XML',
          headers: {
            'contentType': false,
            'processData': false,
            'Cache-Control': 'no-cache',
          }
        })
      })

    },



    databaseInsertBlog(response) {
      let logoUrl = ''
      if (this.blogData.blogLogoFileName == null)
        logoUrl = null
      else
        logoUrl = response.host + '/represent-blog-logo/' + encodeURI(this.blogData.blogLogoFileName)


      return axios({
        method: 'post',
        url: `${this.serverAddress}/blog/insert`,
        data: {
          name: this.blogData.blogName,
          kind: this.blogData.blogKind,
          introduction: this.blogData.blogIntroduction,
          represent: this.blogData.blogRepresent,
          url: response.host + '/' + response.dir + encodeURI(this.blogData.blogFileName),
          logo: logoUrl
        }
      }).then((response) => {
        this.uploadFlag = !this.uploadFlag
      })
    },


    ossInsertBlog(formData) {

      return axios({
        method: 'post',
        url: this.aliyunAddress,
        data: formData,
        dataType: 'XML',
        headers: {
          'contentType': false,
          'processData': false,
          'Cache-Control': 'no-cache',
        }
      })
    },









    //数据校验
    blogLogoFileChange() {

      let file = document.querySelector('#blogLogoFile')

      if (file.files[0] == null)
        file.nextElementSibling.nextElementSibling.innerHTML = '非代表博客logo可以为空'
      else
        file.nextElementSibling.nextElementSibling.innerHTML = '博客logo保存成功哦！'
    },
    //数据校验
    checkBlogLogoFileState(state) {

      let file = document.querySelector('#blogLogoFile')
      if (state == 0)
        file.removeAttribute('required')
      else
        file.setAttribute('required', 'required')
    },


    


    findBlogsByKind() {
      return axios(`${this.serverAddress}/findBlogsByKind/${this.blogKind}`)
    },
    findRepresentBlogsByKind() {
      return axios(`${this.serverAddress}/findRepresentBlogsByKind/${this.blogKind}`)
    },


  }
})
