new Vue({

  el: '#app',

  data: {
    blogName: ''
  },

  watch: {
  },

  created() {
    this.render_blog();
  },

  methods: {

    change_style(event) {

      let id = event.path[0].id;
      if (id === 'yellow') {
        document.body.style.backgroundColor = '#fff5ec';
        let aa = document.querySelectorAll('#write p,#write li,#write h1,#write h2,#write h3,#write h4,#write h5,#write h6');

        for (let item of aa)
          item.style.color = 'black';

        let bb = document.querySelectorAll('#write blockquote p');
        for (let item of bb)
          item.style.color = 'black';


        let cc = document.querySelectorAll('.list-item');
        for (let item of cc) {
          item.style.boxShadow = '-2em 1.5em 0 #e1e1e1';
          // item.style.background = 'antiquewhite';

        }


      }

      else if (id === 'white') {
        document.body.style.backgroundColor = '#fff';

        let aa = document.querySelectorAll('#write p,#write li,#write h1,#write h2,#write h3,#write h4,#write h5,#write h6');

        for (let item of aa)
          item.style.color = 'black';

        let bb = document.querySelectorAll('#write blockquote p');
        for (let item of bb)
          item.style.color = 'black';

        let cc = document.querySelectorAll('.list-item');
        for (let item of cc)
          item.style.boxShadow = '-2em 1.5em 0 #e1e1e1';

      }

      else {
        document.body.style.backgroundColor = '#1b1f23';


        let aa = document.querySelectorAll('#write p,#write li,#write h1,#write h2,#write h3,#write h4,#write h5,#write h6');

        for (let item of aa)
          item.style.color = 'white';

        let bb = document.querySelectorAll('#write blockquote p');
        for (let item of bb)
          item.style.color = 'black';

        let cc = document.querySelectorAll('.list-item');
        for (let item of cc)
          item.style.boxShadow = '-2em 1.5em 0 grey';


      }
    },

    render_blog() {

      this.blogName = sessionStorage.getItem('blogName')

      axios.get(sessionStorage.getItem('url')).then(function (response) {


        var toc = [];
        var renderer = (function () {
          var renderer = new marked.Renderer();
          renderer.heading = function (text, level, raw) {
            var anchor = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w\\u4e00-\\u9fa5]]+/g, '-');
            toc.push({
              anchor: anchor,
              level: level,
              text: text
            });
            return '<h'
              + level
              + ' id="'
              + anchor
              + '">'
              + text
              + '<a href="#table-of-contents" title="返回目录"></a>'
              + '</h'
              + level
              + '>\n';
          };
          return renderer;
        })();

        marked.setOptions({
          renderer: renderer
        });
        
        function build(coll, k, level, ctx) {
          if (k >= coll.length || coll[k].level <= level) { return k; }
          var node = coll[k];
          ctx.push("<li><a href='#" + node.anchor + "'>" + node.text + "<svg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' focusable='false' x='0px' y='0px' viewBox='0 0 100 100' width='15' height='15' class='icon outbound'><path fill='currentColor' d='M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z'></path> <polygon fill='currentColor' points='45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9'></polygon></svg></a>");
          k++;
          var childCtx = [];
          k = build(coll, k, node.level, childCtx);
          if (childCtx.length > 0) {
            ctx.push("<ul>");
            childCtx.forEach(function (idm) {
              ctx.push(idm);
            });
            ctx.push("</ul>");
          }
          ctx.push("</li>");
          k = build(coll, k, level, ctx);
          return k;
        }

        var html = marked(response.data);
        var ctx = [];
        ctx.push('<h1 id="table-of-contents">文章目录表</h1>\n<ul>');
        build(toc, 0, 0, ctx);
        ctx.push("</ul>");

        document.querySelector('#write').innerHTML = ctx.join('') + html;

        hljs.initHighlighting();

      });
    },

    go_top() {

      let timer = null;
      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(function fn() {
        let oTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (oTop > 0) {
          document.body.scrollTop = document.documentElement.scrollTop = oTop - 100;
          timer = requestAnimationFrame(fn);
        } else {
          cancelAnimationFrame(timer);
        }
      });
    },


    change_code_background() {

      let a = document.querySelector('.toolbar-contents')

      if(a.getAttribute("status") === 'close')
      for (let item of document.querySelectorAll('#write pre code,pre')) {
        item.style.backgroundColor = '#282c34'
        a.setAttribute('status','open')
      }
      else 
      for (let item of document.querySelectorAll('#write pre code,pre')) {
        item.style.backgroundColor = '#008a8a'
        a.setAttribute('status','close')
      }


      
    },

    hidden() {
      let item = document.querySelector('#bg-reverse')
      if(item.getAttribute("status") === 'close') {
        $('#bg-reverse').fadeIn('slow');
        item.setAttribute('status','open')
      } else {
        $('#bg-reverse').fadeOut('slow');
        item.setAttribute('status','close')
      }

    }

  }
})
