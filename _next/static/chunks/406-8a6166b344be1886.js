(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[406],{3718:function(e,t,n){"use strict";n.d(t,{Z:function(){return r}});var o=JSON.parse('[{"file":"2019-06-16-gcc-attribute-cleanup","title":"gcc attribute: cleanup","tags":"gcc_attribute","date":"2019-06-16","description":"The cleanup attribute runs a function when the variable goes out of scope. This attribute can only be applied to auto function scope variables."},{"file":"2019-06-30-NULL","title":"NULL != 0","tags":"GNUC","date":"2019-06-30","description":"As we can see from the results of pre-process, `NULL` was replace by ((void *)0)"},{"file":"2019-07-01-gcc-attribute-nonnull","title":"gcc attribute: nonnull","tags":"gcc_attribute","date":"2019-07-01","description":"A new function attribute, nonnull, has been added which allows pointer arguments to functions to be specified as requiring a non-null value."},{"file":"2019-07-03-gcc-options-fsigned-char","title":"gcc options: -fsigned-char","tags":"gcc_options","date":"2019-07-03","description":"These options control whether a bit-field is signed or unsigned, when the declaration does not use either signed or unsigned. By default, such a bit-field is signed, because this is consistent: the basic integer types such as int are signed types."},{"file":"2019-08-04-gcc-builtin-alloca","title":"gcc builtin: alloca","tags":"gcc_builtin","date":"2019-08-04","description":"The alloca() function allocates size bytes of space in the stack frame of the caller.  This temporary space is automatically freed when the function that called alloca() returns to its caller."},{"file":"2019-09-15-gcc-builtin_choose_expr","title":"gcc builtin: choose_expr","tags":"gcc_builtin","date":"2019-09-15","description":"You can use the built-in function __builtin_choose_expr to evaluate code depending on the value of a constant expression. This built-in function returns exp1 if const_exp, which is an integer constant expression, is nonzero. Otherwise it returns exp2."},{"file":"2020-11-28-gcc-options-format","title":"gcc options: -Wformat","tags":"gcc_options","date":"2020-11-28","description":"Check calls to printf and scanf, etc., to make sure that the arguments supplied have types appropriate to the format string specified, and that the conversions specified in the format string make sense."},{"file":"2020-12-06-gcc-attribute-format","title":"gcc attribute: format, format_arg","tags":"gcc_attribute","date":"2020-12-06","description":"The format attribute specifies that a function takes printf, scanf, strftime or strfmon style arguments which should be type-checked against a format string."},{"file":"2021-12-05-gcc-attribute-constructor-destructor","title":"gcc attribute: constructor and destructor","tags":"gcc_attribute","date":"2021-12-05","description":"gcc provides a constructor that can be executed before the main function and descturtor that can be executed after the main function. If you use it well, you can make a hooking library and use it for debugging, etc."},{"file":"2022-01-16-gcc-attribute-visibility","title":"gcc attribute: visibility","tags":"gcc_attribute","date":"2022-01-16","description":"ELF has a Symbol Binding field for symbol management. We can decide whether or not to disclose the symbol to the outside, and we can set this value using the gcc visibility attribute."},{"file":"2022-01-23-gcc-options-finstrument-functions","title":"gcc options: -finstrument-functions and no_instrument_function attribute","tags":"gcc_options","date":"2022-01-23","description":"For debugging or profiling, hooking functions that are called before and after the user function starts and ends can be inserted into the compilation type through the -finstrument-functions gcc option. You can also override this function to have the behavior you want. Insertion of hooking function can also be excluded by using no_instrument_function gcc attribute."},{"file":"2022-01-31-gcc-builtin-types_compatible","title":"gcc builtin: types_compatible_p","tags":"gcc_builtin","date":"2022-01-31","description":"You can use __builtin_types_compatible_p to compare two types for equality at compile time. Many open sources utilize this to create and utilize many creative macro functions. Since the behavior is determined at compile time, it has the advantage of no runtime overhead, which is very helpful in terms of execution performance."}]');function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function a(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var r=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.tags=[],this.date=[]}var t,r,c;return t=e,(r=[{key:"tagToString",value:function(e){return e.replace("_"," ")}},{key:"stringToTag",value:function(e){return e.replace(" ","_")}},{key:"getTags",value:function(){var e=this;if(0!==this.tags.length)return this.tags;var t=[],n={};return o.forEach((function(e){e.tags.split(",").forEach((function(e){var o=e.trim();t.push(o),isNaN(n[o])&&(n[o]=0),n[o]++}))})),(t=a(new Set(t))).forEach((function(t){e.tags.push({value:t,count:n[t]})})),this.tags}},{key:"getDate",value:function(){var e=this;if(0!==this.date.length)return this.date;var t=[],n={};return o.forEach((function(e){var o=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"long"}).format(new Date(e.date));t.push(o),isNaN(n[o])&&(n[o]=0),n[o]++})),(t=a(new Set(t))).forEach((function(t){e.date.push({value:t,count:n[t]})})),this.date}},{key:"getWithFile",value:function(e){var t=null;return o.forEach((function(n){n.file!==e||(t=n)})),t}},{key:"getWithTag",value:function(e){var t=[];return o.forEach((function(n){n.tags.split(",").forEach((function(o){o.trim()!==e||t.push(n)}))})),t}},{key:"getWithDate",value:function(e){var t=[];return o.forEach((function(n){new Intl.DateTimeFormat("en-US",{year:"numeric",month:"long"}).format(new Date(n.date))===e&&t.push(n)})),t}},{key:"getWithKeyword",value:function(e){var t=new RegExp(e,"i"),n=[];return o.forEach((function(e){(null!==e.title.match(t)||null!==e.tags.match(t)||null!==e.date.match(t)||null!==e.description.match(t))&&n.push(e)})),n}},{key:"getRecentPosts",value:function(e,t){var n=o,i=(e-1)*t;return n.sort((function(e,t){return e.date===t.date?0:e.date<t.date?1:-1})),n.slice(i,i+t)}},{key:"getPostCount",value:function(){return o.length}},{key:"getPostWithFile",value:function(e,t){return void 0===e||void 0===t?null:void n(8350)("./".concat(e.file,".json")).then((function(e){t(e.content)}))}},{key:"getAllPosts",value:function(){return o}}])&&i(t.prototype,r),c&&i(t,c),e}()},6319:function(e,t,n){"use strict";var o=n(5893),i=(n(7294),n(5793)),a=n.n(i),r=n(5697),c=function(e){return(0,o.jsx)("div",{className:a().content_title,children:(0,o.jsx)("h4",{children:e.value})})};c.propTypes={value:n.n(r)().string.isRequired},t.Z=c},8125:function(e,t,n){"use strict";var o=n(5893),i=(n(7294),n(570)),a=n.n(i),r=n(3680),c=n(6010);t.Z=function(){return(0,o.jsx)("div",{className:a().sponsor_container,children:(0,o.jsxs)(r.Z,{href:"https://www.buymeacoffee.com/jooojub",target:"_blank",className:(0,c.Z)("p-3",a().buy_me_coffee),variant:"dark",size:"sm",alt:"Buy me a coffee!!",children:[(0,o.jsx)("i",{className:"fas fa-mug-hot"}),"\xa0\xa0\xa0Buy me a coffee"]})})}},8558:function(e,t,n){"use strict";var o=n(5893),i=(n(7294),n(1664)),a=n(2890),r=n.n(a),c=n(2510),s=n(2814),l=n(1417),u=n(3718),d=n(6010);function f(){var e=new u.Z,t=[];return e.getTags().forEach((function(n){t.push((0,o.jsx)(i.default,{href:"/list/".concat(n.value),children:(0,o.jsx)("div",{className:"tag-btn",children:e.tagToString(n.value)})},"".concat(n.value)))})),t}function h(){var e=[],t=(new u.Z).getRecentPosts(1,1);return e.push((0,o.jsx)(i.default,{style:{textDecoration:"none"},href:"/post/".concat(t[0].file),children:(0,o.jsxs)("div",{className:r().footer_recent_title,children:[(0,o.jsx)("p",{className:"title",children:t[0].title}),(0,o.jsx)("p",{className:"content",children:t[0].description.slice(0,100)+"..."},"".concat(t[0].file))]})},"".concat(t[0].file))),e}t.Z=function(){var e={backgroundColor:"#213447",color:"white",fontSize:"0.8rem",padding:"0.5rem",borderRadius:"0.5rem",fontFamily:'"Nunito", sans-serif',marginBottom:"0.6rem"};return(0,o.jsxs)("footer",{children:[(0,o.jsxs)("div",{className:(0,d.Z)("row font-small pt-4 mt-4 container-fluid navbar-fixed-bottom",r().footer_container),children:[(0,o.jsx)("div",{className:"col-md-1"}),(0,o.jsx)(i.default,{href:"/profile",children:(0,o.jsxs)("div",{className:"col-md-3 text-center text-md-start",children:[(0,o.jsx)("h1",{className:r().footer_logo,children:"Jooojub"}),(0,o.jsx)("p",{className:r().footer_sub_logo,children:"system S/W engineers"})]})}),(0,o.jsxs)("div",{className:"col-md-4 text-center text-md-start mb-4",children:[(0,o.jsx)("p",{className:r().footer_tag_logo,children:"Browse by Categories"}),(0,o.jsx)("div",{className:(0,d.Z)("flex flex-wrap",r().footer_tag_container),children:f()})]}),(0,o.jsxs)("div",{className:"col-md-3 text-center text-md-start",children:[(0,o.jsx)("p",{className:r().footer_tag_logo,children:"Recent Post"}),h()]}),(0,o.jsx)("div",{className:"col-md-1"})]}),(0,o.jsxs)("div",{className:(0,d.Z)("row text-center py-3 px-4",r().footer_sub_container),children:[(0,o.jsx)("div",{className:"col-md-1"}),(0,o.jsxs)("div",{className:"col-md-8 d-flex align-items-center",children:["\xa9 ",(new Date).getFullYear()," - All Right Reserved. Designed and Developed by jooojub"]}),(0,o.jsxs)("div",{className:"col-md-2 d-flex justify-content-end",children:[(0,o.jsx)("a",{href:"https://github.com/jooojub",target:"_blank",rel:"noreferrer",children:(0,o.jsx)(c.Z,{content:"github",style:e,trigger:(0,o.jsx)(s.G,{icon:l.zhw,className:(0,d.Z)("m-2 h5",r().footer_icon)})})}),(0,o.jsx)(c.Z,{content:"linked-in",style:e,trigger:(0,o.jsx)(s.G,{icon:l.hwn,className:(0,d.Z)("m-2 h5",r().footer_icon)})}),(0,o.jsx)("a",{href:"mailto:jooojub@gmail.com",target:"_blank",rel:"noreferrer",children:(0,o.jsx)(c.Z,{content:"google",style:e,trigger:(0,o.jsx)(s.G,{icon:l.xYR,className:(0,d.Z)("m-2 h5",r().footer_icon)})})})]}),(0,o.jsx)("div",{className:"col-md-1"})]})]})}},8150:function(e,t,n){"use strict";var o=n(5893),i=(n(7294),n(194)),a=n.n(i),r=n(6010);t.Z=function(e){return(0,o.jsx)(o.Fragment,{children:(0,o.jsxs)("div",{className:(0,r.Z)("row",a().header_container),style:{backgroundImage:e.bgImage},children:[(0,o.jsx)("div",{className:a().header_overlay}),(0,o.jsx)("div",{className:"col-1 col-md-2"}),(0,o.jsx)("div",{className:"col",children:(0,o.jsx)("div",{className:"h-100 w-100 d-flex align-items-center",children:(0,o.jsxs)("div",{className:"col-md-12 w-100",style:{textAlign:"center",color:"#ffffff",zIndex:11},children:[e.mainComponent,(0,o.jsx)("br",{}),e.subComponent,(0,o.jsx)("br",{}),(0,o.jsx)("br",{}),e.subSecondComponent,(0,o.jsx)("div",{className:"mt-4 pt-4 text-center",children:(0,o.jsx)("div",{className:a().sub_button,children:e.subButton})})]})})}),(0,o.jsx)("div",{className:"col-1 col-md-2 header-container-margin"})]})})}},2908:function(e,t,n){"use strict";var o=n(5893),i=(n(7294),n(1374)),a=n(5517),r=n(7938),c=n.n(r),s=n(1664);t.Z=function(){return(0,o.jsx)("header",{children:(0,o.jsxs)(i.Z,{className:c().header_navbar,variant:"dark",children:[(0,o.jsx)("div",{className:"col-1 d-none d-md-block"}),(0,o.jsxs)("div",{className:"col d-flex align-items-center",children:[(0,o.jsx)(i.Z.Brand,{className:c().avatar,children:(0,o.jsx)(a.Z,{src:"/toto.jpg",avatar:!0,alt:"jooojub"})}),(0,o.jsx)(s.default,{href:"/",children:(0,o.jsx)(i.Z.Brand,{className:c().logo,children:(0,o.jsx)("p",{className:"title font-weight-bold mb-0",children:"Jooojub"})})}),(0,o.jsx)(i.Z.Toggle,{"aria-controls":"responsive-navbar-nav"}),(0,o.jsx)(i.Z.Collapse,{className:"justify-content-end align-items-center"})]}),(0,o.jsx)("div",{className:"col-1 d-none d-md-block"})]})})}},9494:function(e,t,n){"use strict";var o=n(5893);n(7294);t.Z=function(e){return(0,o.jsx)("div",{className:"container",children:(0,o.jsxs)("div",{className:"row",style:{paddingTop:"3rem"},children:[(0,o.jsx)("div",{className:"col-0 col-xl-1"}),(0,o.jsx)("div",{className:"col",children:e.children}),(0,o.jsx)("div",{className:"col-0 col-xl-1"})]})})}},2890:function(e){e.exports={footer_container:"Footer_footer_container__JGuHV",footer_logo:"Footer_footer_logo__4dQ_F",footer_sub_logo:"Footer_footer_sub_logo__MQvBl",footer_tag_logo:"Footer_footer_tag_logo__ZvTak",footer_tag_container:"Footer_footer_tag_container__NYtwF",footer_recent_title:"Footer_footer_recent_title__GkH_W",footer_sub_container:"Footer_footer_sub_container__Q465z",footer_icon:"Footer_footer_icon__gC2eS"}},194:function(e){e.exports={header_container:"HeaderBar_header_container__dG9gf",header_overlay:"HeaderBar_header_overlay__HxznB",sub_button:"HeaderBar_sub_button__EFe0z"}},7938:function(e){e.exports={header_navbar:"HeaderNavBar_header_navbar__Q9EHV",avatar:"HeaderNavBar_avatar__Jx1F5",logo:"HeaderNavBar_logo__Y6V5Y"}},5793:function(e){e.exports={content_title:"ContentTitle_content_title__BW7SX"}},570:function(e){e.exports={sponsor_container:"SponsorComponent_sponsor_container__OvCUE",buy_me_coffee:"SponsorComponent_buy_me_coffee__q3F6K"}},8350:function(e,t,n){var o={"./2019-06-16-gcc-attribute-cleanup.json":[1464,464],"./2019-06-30-NULL.json":[5995,995],"./2019-07-01-gcc-attribute-nonnull.json":[2966,966],"./2019-07-03-gcc-options-fsigned-char.json":[3472,472],"./2019-08-04-gcc-builtin-alloca.json":[8562,562],"./2019-09-15-gcc-builtin_choose_expr.json":[9678,678],"./2020-11-28-gcc-options-format.json":[8777,777],"./2020-12-06-gcc-attribute-format.json":[8323,323],"./2021-12-05-gcc-attribute-constructor-destructor.json":[863,863],"./2022-01-16-gcc-attribute-visibility.json":[9506,506],"./2022-01-23-gcc-options-finstrument-functions.json":[1712,712],"./2022-01-31-gcc-builtin-types_compatible.json":[7292,292]};function i(e){if(!n.o(o,e))return Promise.resolve().then((function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=o[e],i=t[0];return n.e(t[1]).then((function(){return n.t(i,19)}))}i.keys=function(){return Object.keys(o)},i.id=8350,e.exports=i}}]);