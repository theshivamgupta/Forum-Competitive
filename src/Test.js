import React, { useState } from "react";
import "./assets/test.css";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ReactHtmlParser from "react-html-parser";
import gfm from "remark-gfm";
import Layout from "./components/shared/Layout";

function Test() {
  const [text, setText] = useState("");

  function handleClick(e) {
    e.preventDefault();
    // html = DOMPurify.sanitize(html);
    let html = ReactHtmlParser(text);
    console.log(html);
    setText(html);
  }

  const renderers = {
    image: ({ alt, src, title }) => (
      <img alt={alt} src={src} title={title} style={{ maxWidth: 400 }} />
    ),
    code: Highlight,
  };

  return (
    <Layout>
      <div className="p-3">
        <textarea
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <div></div>
        <button onClick={handleClick}>Click</button>
        <div className="mt-8 mx-auto" style={{ width: "900px" }}>
          <div className="prose lg:prose-lg xl:prose-xl mt-10 mb-10 mx-auto">
            <h1>Everything You Need to Know to Succeed as a Freelancer</h1>
          </div>
          <ReactMarkdown
            source={text}
            escapeHtml={false}
            className="prose mx-auto md:prose-lg lg:prose-xl"
            style={{ width: "150%" }}
            renderers={renderers}
            plugins={[gfm]}
            onChange={(e) => console.log("yup")}
            children={text}
          />
        </div>
      </div>
    </Layout>
  );
}

function Highlight({ value, langauge }) {
  return (
    <SyntaxHighlighter language={langauge ?? null} style={docco}>
      {value ?? ""}
    </SyntaxHighlighter>
  );
}

export default Test;
