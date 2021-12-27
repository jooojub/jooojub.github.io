import React from "react";
import { Helmet } from "react-helmet";

function ReactHelmet(props) {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{props.title}</title>
      <meta name="title" content={props.title} />
      <meta
        name="description"
        content={props.description}
      />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={props.url} />
      <meta property="og:title" content={props.title} />
      <meta
        property="og:description"
        content={props.description}
      />
      <meta
        property="og:image"
        content={props.image}
      />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={props.url} />
      <meta property="twitter:title" content={props.title} />
      <meta
        property="twitter:description"
        content={props.description}
      />
      <meta
        property="twitter:image"
        content={props.image}
      />
    </Helmet>
  );
}

export default ReactHelmet;
