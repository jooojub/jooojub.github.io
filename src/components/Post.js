import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCalendarMinus } from "@fortawesome/free-regular-svg-icons";
import PostParser from "../api/PostParser";

// import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
// import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

import hljs from "highlight.js";
import c from "highlight.js/lib/languages/c";
import javascript from "highlight.js/lib/languages/javascript";

import marked, { Renderer } from "marked";

import "../highlights/monokai.css";

const useStyles = makeStyles({
  blogContent: {
    // fontSize: ".87rem",
    // lineHeight: "1.5rem",
    marginTop: "1rem",

    fontSize: "15px",
    color: "rgb(41, 41, 41)",
    fontWeight: "600",
    lineHeight: "2",
  },

  blogDate: {
    fontSize: ".87rem",
    lineHeight: "1.5rem",
    fontColor: "grey",
  },
  readmoreText: {
    "&:hover": {
      color: "#607d8b !important",
    },
  },
  blogMarkdown: {
    "& ul": {
      "& li::marker": {
        fontSize: "1rem",
      },
    },
    "& p": {
      fontFamily: "'Noto Sans KR', sans-serif",
    },
    // "& #requires": {
    //   color: "red",
    // },
    "& h4": {
      fontWeight: "700 !important",
    },
    "& blockquote": {
      textAlign: "left",
      backgroundColor: "#FAFAFA",
      borderLeft: "7px solid #666666",
      padding: "0.7rem",
      borderRadius: "5px",
      "& p": {
        fontSize: "14px",
        marginBottom: "0rem",
      },
    },
    "& mark": {
      backgroundColor: "#272823",
      color: "white",
      paddingLeft: "0.5rem",
      paddingRight: "0.5rem",
      paddingTop: "0rem",
      paddingBottom: "0rem",
      borderRadius: "5px",
    },
    "& cd": {
      color: "#F92672",
    },
    "& pre": {
      borderRadius: "0.5rem",
      boxShadow:
        "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;",
      "& code": {
        padding: "1rem",
      },
    },
    "& #codeTitle": {
      backgroundColor: "#212121",
      color: "white",
      padding: "0.8rem",
    },
    "& thead tr th": {
      fontSize: "20px",
    },
    "& tbody tr td": {
      fontSize: "16px",
    },
    "& dt": {
      fontSize: "1rem",
    },
    "& ol": {
      "& li.doc_endnote": {
        fontSize: "0.8rem",
        marginBottom: "1rem",
      },
    },
  },
});

const tags = (file) => {
  const jsx = [];

  if (file === undefined) return;

  file.tags.split(",").forEach((tag, index) => {
    const key = tag.trim();

    if (index === 0) {
      jsx.push(
        <div
          key={key}
          className="btn btn-primary rounded-lg btn-sm pt-1 pb-1 pl-3 pr-3 m-0 mr-2"
        >
          {key}
        </div>
      );
    } else {
      jsx.push(
        <div
          key={key}
          className="btn btn-dark rounded-lg btn-sm pt-1 pb-1 pl-3 pr-3 m-0"
        >
          {key}
        </div>
      );
    }
  });

  return jsx;
};

const date = (file) => {
  if (file === undefined) return;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(file.date));
};

const description = {
  name: "description",
  level: "inline", // Is this a block-level or inline-level tokenizer?
  start(src) {
    return src.match(/:/)?.index;
  }, // Hint to Marked.js to stop and check for a match
  tokenizer(src, tokens) {
    const rule = /^:([^:\n]+):([^:\n]*)(?:\n|$)/; // Regex for the complete token
    const match = rule.exec(src);
    if (match) {
      return {
        // Token to generate
        type: "description", // Should match "name" above
        raw: match[0], // Text to consume from the source
        dt: this.lexer.inlineTokens(match[1].trim()), // Additional custom properties, including
        dd: this.lexer.inlineTokens(match[2].trim()), //   any further-nested inline tokens
      };
    }
  },
  renderer(token) {
    return `\n<dt><div><i class="fas fa-asterisk"></i>&nbsp;${this.parser.parseInline(
      token.dt
    )}</div></dt><dd>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${this.parser.parseInline(
      token.dd
    )}</dd>`;
  },
  childTokens: ["dt", "dd"], // Any child tokens to be visited by walkTokens
  walkTokens(token) {
    // Post-processing on the completed token tree
    if (token.type === "strong") {
      token.text += " walked";
    }
  },
};

marked.use({ extensions: [description] });

const doc_endnote = {
  name: "doc_endnote",
  level: "inline", // Is this a block-level or inline-level tokenizer?
  start(src) {
    return src.match(/\[\^/)?.index;
  }, // Hint to Marked.js to stop and check for a match
  tokenizer(src, tokens) {
    const rule = /^\[\^([1-9]+)\]([^\n]*)/; // Regex for the complete token
    const match = rule.exec(src);
    if (match) {
      return {
        // Token to generate
        type: "doc_endnote", // Should match "name" above
        raw: match[0], // Text to consume from the source
        num: this.lexer.inlineTokens(match[1].trim()), // Additional custom properties, including
        txt: this.lexer.inlineTokens(match[2].trim()), //   any further-nested inline tokens
      };
    }
  },
  renderer(token) {
    return `
    <li id="fn:${this.parser.parseInline(token.num)}" class="doc_endnote">
    ${this.parser.parseInline(token.txt)}
    </li>
    `;
  },
  childTokens: ["num", "txt"], // Any child tokens to be visited by walkTokens
  walkTokens(token) {
    // Post-processing on the completed token tree
    if (token.type === "strong") {
      token.text += " walked";
    }
  },
};

marked.use({ extensions: [doc_endnote] });

const link_doc_endnote = {
  name: "link_doc_endnote",
  level: "inline", // Is this a block-level or inline-level tokenizer?
  start(src) {
    return src.match(/->\[\^/)?.index;
  }, // Hint to Marked.js to stop and check for a match
  tokenizer(src, tokens) {
    const rule = /^->\[\^([1-9]+)\]([^[]*)\[\/\^\]/; // Regex for the complete token
    const match = rule.exec(src);
    if (match) {
      return {
        // Token to generate
        type: "link_doc_endnote", // Should match "name" above
        raw: match[0], // Text to consume from the source
        num: this.lexer.inlineTokens(match[1].trim()), // Additional custom properties, including
        txt: this.lexer.inlineTokens(match[2].trim()), //   any further-nested inline tokens
      };
    }
  },
  renderer(token) {
    return `
      <a href="#fn:${this.parser.parseInline(token.num)}">
      ${this.parser.parseInline(token.txt)}
        <sup>
          ${this.parser.parseInline(token.num)}
        </sup>
      </a>
    `;
  },
  childTokens: ["num", "txt"], // Any child tokens to be visited by walkTokens
  walkTokens(token) {
    // Post-processing on the completed token tree
    if (token.type === "strong") {
      token.text += " walked";
    }
  },
};

marked.use({ extensions: [link_doc_endnote] });

const renderer = new Renderer();

const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeForHTML(input) {
  return input.replace(/([&<>'"])/g, (char) => escapeMap[char]);
}

renderer.code = (code, language) => {
  const validLang = !!(language && hljs.getLanguage(language));

  const rule = /^:([^:^\n]+)\n([\s\S]+)/; // Regex for the complete token
  const match = rule.exec(code);
  var title = "";

  if (match) {
    title = match[1].trim();
    code = match[2];
  }

  // Highlight only if the language is valid.
  // highlight.js escapes HTML in the code, but we need to escape by ourselves
  // when we don't use it.
  const highlighted = validLang
    ? hljs.highlight(language, code).value
    : escapeForHTML(code);

  // Render the highlighted code with `hljs` class.
  if (match)
    return `<pre><div id="codeTitle"><i class="far fa-file-code"></i>&nbsp;${title}</div><code class="hljs ${language}">${highlighted}</code></pre>`;
  else return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

marked.use({ renderer: renderer });

const getMarkup = (content) => {
  const rawMarkup = marked(content, {
    // langPrefix: "hljs language-",
    breaks: true,
    // gfm: true,
    // pedantic: true,
    // highlight: function (code) {
    //   return hljs.highlightAuto(code).value;
    // },
  });

  return {
    __html: rawMarkup,
  };
};

function Post(props) {
  const classes = useStyles();
  const [currentPost, setCurrentPost] = useState(undefined);
  const [currentPostContent, setCurrentPostContent] = useState(null);

  useEffect(() => {
    setCurrentPost(props.file);

    new PostParser().getPostWithFile(props.file, setCurrentPostContent);

    hljs.registerLanguage("javascript", javascript);
    hljs.registerLanguage("c", c);
  }, [props.file]);

  useEffect(() => {
    hljs.highlightAll();
  }, [currentPostContent]);

  return (
    <div className="row">
      <div className="col-12 col-md-12 p-3">
        <div className="mb-3">{tags(currentPost)}</div>
        <div className="mb-3">
          <h4 className="font-weight-bold text-left">
            {currentPost && currentPost.title}
          </h4>
        </div>
        <div>
          <h6 className="blue-grey-text text-left font-small font-weight-bold">
            <FontAwesomeIcon className="mr-2" icon={faCalendarMinus} />{" "}
            {date(currentPost)}
          </h6>
        </div>
        <hr />
        <div>
          {currentPostContent && (
            <div
              className={classes.blogMarkdown}
              dangerouslySetInnerHTML={getMarkup(currentPostContent)}
            >
              {/* <MarkdownPreview
                className={classes.blogMarkdown}
                value={currentPostContent}
                markedOptions={{
                  langPrefix: "hljs language-",
                  tables: true,
                  renderer: renderer,
                }}
              /> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
