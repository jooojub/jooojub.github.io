(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[105],{9948:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/post/[title]",function(){return t(2022)}])},5049:function(e,n,t){"use strict";var s=t(5893),r=(t(7294),t(1664)),i=t(7596),a=t.n(i),c=t(3718),o=function(){var e=new c.Z,n=[];return e.getDate().forEach((function(e){n.push((0,s.jsx)(r.default,{href:"/list/".concat(e.value),children:(0,s.jsx)("div",{className:"archive-btn",children:e.value})},"".concat(e.value)))})),n};n.Z=function(){return(0,s.jsx)("div",{className:a().archive_container,children:o()})}},4806:function(e,n,t){"use strict";var s=t(5893),r=(t(7294),t(1664)),i=t(3718),a=t(3533),c=t.n(a),o=function(){var e=new i.Z,n=[];return e.getTags().forEach((function(t){n.push((0,s.jsx)(r.default,{href:"/list/".concat(t.value),children:(0,s.jsxs)("div",{className:"tag-btn",children:[e.tagToString(t.value),(0,s.jsx)("span",{className:"ml-2 badge bg-dark ms-2",children:t.count})]})},"".concat(t.value)))})),n};n.Z=function(){return(0,s.jsx)("div",{className:c().categories_container,children:o()})}},3875:function(e,n,t){"use strict";var s=t(5893),r=t(7294),i=t(1163),a=t(2814),c=t(1436),o=t(2368),l=t.n(o),d=t(6010);n.Z=function(e){var n=(0,i.useRouter)(),t=(0,r.useState)(""),o=t[0],u=t[1];return(0,s.jsx)("div",{className:"row",children:(0,s.jsx)("div",{className:l().search_container,children:(0,s.jsxs)("div",{className:"input-group",children:[(0,s.jsx)("input",{className:"form-control",type:"text",placeholder:"Search","aria-label":"Search",value:o,onInput:function(e){return u(e.target.value)}}),(0,s.jsx)("button",{type:"button",className:(0,d.Z)("btn btn-dark btn-sm",l().search_btn),onClick:function(){var e;""!==(e=o)&&n.push("/search/".concat(e))},children:(0,s.jsx)(a.G,{icon:c.wn1})})]})})})}},2022:function(e,n,t){"use strict";t.r(n),t.d(n,{__N_SSG:function(){return D},default:function(){return L}});var s=t(5893),r=t(1163),i=t(7294),a=t(9008),c=t(3210),o=t.n(c),l=t(2908),d=t(8150),u=t(9494),h=t(6319),f=t(4806),x=t(3875),m=t(5049),p=t(8125),_=t(8558),v=t(3944),j=t(2814),g=t(6024),b=t(3718),k=t(637),w=t(7382),N=t(6167),Z=t(9622),S=t(7084),y=t.n(S),T=t(4003),I=t.n(T),P=function(e){var n=[];if(void 0!==e)return e.tags.split(",").forEach((function(e,t){var r=e.trim();n.push((0,s.jsx)("div",{className:I().tag_btn,children:r},r))})),n},C=function(e){if(void 0!==e)return new Intl.DateTimeFormat("en-US",{year:"numeric",month:"long",day:"numeric"}).format(new Date(e.date))};y().use({extensions:[{name:"description",level:"inline",start:function(e){var n;return null===(n=e.match(/:/))||void 0===n?void 0:n.index},tokenizer:function(e,n){var t=/^:([^:\n]+):([^:\n]*)(?:\n|$)/.exec(e);if(t)return{type:"description",raw:t[0],dt:this.lexer.inlineTokens(t[1].trim()),dd:this.lexer.inlineTokens(t[2].trim())}},renderer:function(e){return'\n<dt><div><i class="fas fa-asterisk"></i>&nbsp;'.concat(this.parser.parseInline(e.dt),"</div></dt><dd>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;").concat(this.parser.parseInline(e.dd),"</dd>")},childTokens:["dt","dd"],walkTokens:function(e){"strong"===e.type&&(e.text+=" walked")}}]});y().use({extensions:[{name:"doc_endnote",level:"inline",start:function(e){var n;return null===(n=e.match(/\[\^/))||void 0===n?void 0:n.index},tokenizer:function(e,n){var t=/^\[\^([1-9]+)\]([^\n]*)/.exec(e);if(t)return{type:"doc_endnote",raw:t[0],num:this.lexer.inlineTokens(t[1].trim()),txt:this.lexer.inlineTokens(t[2].trim())}},renderer:function(e){return'\n    <li id="fn:'.concat(this.parser.parseInline(e.num),'" class="doc_endnote">\n    ').concat(this.parser.parseInline(e.txt),"\n    </li>\n    ")},childTokens:["num","txt"],walkTokens:function(e){"strong"===e.type&&(e.text+=" walked")}}]});y().use({extensions:[{name:"link_doc_endnote",level:"inline",start:function(e){var n;return null===(n=e.match(/->\[\^/))||void 0===n?void 0:n.index},tokenizer:function(e,n){var t=/^->\[\^([1-9]+)\]([^[]*)\[\/\^\]/.exec(e);if(t)return{type:"link_doc_endnote",raw:t[0],num:this.lexer.inlineTokens(t[1].trim()),txt:this.lexer.inlineTokens(t[2].trim())}},renderer:function(e){return'\n      <a href="#fn:'.concat(this.parser.parseInline(e.num),'">\n      ').concat(this.parser.parseInline(e.txt),"\n        <sup>\n          ").concat(this.parser.parseInline(e.num),"\n        </sup>\n      </a>\n    ")},childTokens:["num","txt"],walkTokens:function(e){"strong"===e.type&&(e.text+=" walked")}}]});var E=new S.Renderer,F={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};E.code=function(e,n){var t=!(!n||!k.Z.getLanguage(n)),s=/^:([^:^\n]+)\n([\s\S]+)/.exec(e),r="";s&&(r=s[1].trim(),e=s[2]);var i=t?k.Z.highlight(n,e).value:e.replace(/([&<>'"])/g,(function(e){return F[e]}));return s?'<pre><div class="code_title"><i class="far fa-file-code"></i>&nbsp;'.concat(r,'</div><code class="hljs ').concat(n,'">').concat(i,"</code></pre>"):'<pre><code class="hljs '.concat(n,'">').concat(i,"</code></pre>")},y().use({renderer:E});var z=function(e){var n,t=(0,i.useState)(void 0),r=t[0],a=t[1],c=(0,i.useState)(null),o=c[0],l=c[1];return(0,i.useEffect)((function(){a(e.file),(new b.Z).getPostWithFile(e.file,l),k.Z.registerLanguage("javascript",Z.Z),k.Z.registerLanguage("c",w.Z),k.Z.registerLanguage("bash",N.Z),k.Z.configure({ignoreUnescapedHTML:!0})}),[e.file]),(0,i.useEffect)((function(){k.Z.highlightAll()}),[o]),(0,s.jsx)("div",{className:"row",children:(0,s.jsxs)("div",{className:"col-12 col-md-12 p-3",children:[(0,s.jsx)("div",{className:"mb-3",children:P(r)}),(0,s.jsx)("div",{className:"mb-3",children:(0,s.jsx)("h4",{className:I().post_title,children:r&&r.title})}),(0,s.jsx)("div",{children:(0,s.jsxs)("h6",{className:I().post_date,children:[(0,s.jsx)(j.G,{className:"mr-2",icon:g.C3})," ",C(r)]})}),(0,s.jsx)("hr",{className:I().post_hr}),(0,s.jsx)("div",{children:o&&(0,s.jsx)("div",{className:I().blog_markdown,dangerouslySetInnerHTML:(n=o,{__html:y()(n,{breaks:!0})})})})]})})},W=t(3680),D=!0;function L(){var e=(0,r.useRouter)(),n=e.query.title,t=(0,i.useState)(void 0),c=t[0],j=t[1];return(0,i.useEffect)((function(){if(void 0!==n){var t=(new b.Z).getWithFile(n);null===t&&e.push("/"),j(t)}}),[n,e]),(0,s.jsxs)("div",{className:o().container,children:[(0,s.jsxs)(a.default,{children:[(0,s.jsx)("title",{children:c&&c.title}),(0,s.jsx)("meta",{name:"description",content:c&&c.description})]}),(0,s.jsxs)("header",{children:[(0,s.jsx)(l.Z,{}),(0,s.jsx)(d.Z,{bgImage:"url(/background/post_header_img.jpg)",mainComponent:(0,s.jsx)("font",{style:{fontFamily:"Inter, sans-serif",fontSize:"60px",fontWeight:"600",textShadow:"1px 1px #000000"},children:"Post"}),subComponent:(0,s.jsx)("font",{style:{fontFamily:"Inter, sans-serif",fontSize:"24px",fontWeight:"600",textShadow:"1px 1px #000000"},children:c&&c.title}),subSecondComponent:(0,s.jsx)("font",{style:{fontFamily:"Inter, sans-serif",fontSize:"14px",fontWeight:"400",textShadow:"1px 1px #000000"},children:c&&new Intl.DateTimeFormat("en-US",{year:"numeric",month:"long",day:"numeric"}).format(new Date(c.date))})})]}),(0,s.jsx)(u.Z,{children:(0,s.jsxs)("div",{className:"row text-justify d-flex",children:[(0,s.jsxs)("div",{className:"col-md-8 col-12 pr-4 pl-4 text-left",children:[c&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(z,{file:c}),(0,s.jsx)("br",{}),(0,s.jsx)(v.qw,{shortname:"jooojub",config:{url:window.location.href,identifier:c.file,title:c.title}})]}),(0,s.jsx)("br",{}),(0,s.jsx)("div",{className:"d-flex justify-content-left mt-2",children:(0,s.jsx)(W.Z,{className:o().prev_btn,variant:"dark",size:"sm",onClick:function(){e.back()},children:"Previous"})}),(0,s.jsx)("br",{}),(0,s.jsx)("br",{})]}),(0,s.jsxs)("div",{className:"col-md-4 col-12",children:[(0,s.jsx)(h.Z,{value:"Search in blog"}),(0,s.jsx)("div",{className:"m-2",children:(0,s.jsx)(x.Z,{})}),(0,s.jsx)(h.Z,{value:"Categories"}),(0,s.jsx)("div",{className:"m-2",children:(0,s.jsx)(f.Z,{})}),(0,s.jsx)(h.Z,{value:"Archive"}),(0,s.jsx)("div",{className:"m-2",children:(0,s.jsx)(m.Z,{})}),(0,s.jsx)(h.Z,{value:"Sponsor"}),(0,s.jsx)("div",{className:"m-2",children:(0,s.jsx)(p.Z,{})})]})]})}),(0,s.jsx)(_.Z,{})]})}},3210:function(e){e.exports={container:"PostPage_container__WBrXD",prev_btn:"PostPage_prev_btn__RSFrR"}},7596:function(e){e.exports={archive_container:"ArchiveComponent_archive_container__DCr3_"}},3533:function(e){e.exports={categories_container:"CategoriesComponent_categories_container___YQtc"}},4003:function(e){e.exports={tag_btn:"Post_tag_btn__edAWs",post_title:"Post_post_title__rXYUn",post_date:"Post_post_date__OBmo3",post_hr:"Post_post_hr__fFrWa",blog_markdown:"Post_blog_markdown__PmTqg",doc_endnote:"Post_doc_endnote__N8bRT"}},2368:function(e){e.exports={search_container:"SearchInBlog_search_container___Um9E",search_btn:"SearchInBlog_search_btn__zpzic"}}},function(e){e.O(0,[112,523,470,898,347,406,774,888,179],(function(){return n=9948,e(e.s=n);var n}));var n=e.O();_N_E=n}]);