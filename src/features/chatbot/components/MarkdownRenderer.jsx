import React, { Suspense, useState, useEffect, memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import CopyButton from "../components/CopyButton";

/**
 * MarkdownRenderer Component
 *
 * This component is responsible for rendering Markdown content with:
 * - Custom styles for headings, lists, and tables.
 * - Code syntax highlighting using Shiki.
 * - Copy-to-clipboard functionality for code blocks.
 *
 * Props:
 * - children (string): The Markdown content to render.
 */
const MarkdownRenderer = ({ children }) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]} // Enables GitHub-flavored Markdown (tables, strikethrough, etc.).
      components={COMPONENTS} // Uses custom render components.
      // className="space-y-3"
    >
      {children}
    </Markdown>
  );
};

export default MarkdownRenderer;

/**
 * HighlightedPre Component (Async)
 *
 * - Uses Shiki for syntax highlighting.
 * - Dynamically imports Shiki for on-demand code highlighting.
 */
const HighlightedPre = memo(async ({ children, language, ...props }) => {
  const { codeToTokens, bundledLanguages } = await import("shiki");

  // If the language is not supported, render a simple <pre> block.
  if (!(language in bundledLanguages)) {
    return <pre {...props}>{children}</pre>;
  }

  // Generate syntax-highlighted tokens.
  const { tokens } = await codeToTokens(children, {
    lang: language,
    defaultColor: false,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  });

  return (
    <pre {...props}>
      <code>
        {tokens.map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            <span>
              {line.map((token, tokenIndex) => (
                <span
                  key={tokenIndex}
                  className="text-[var(--shiki-light)] bg-[var(--shiki-light-bg)] dark:text-[var(--shiki-dark)] dark:bg-[var(--shiki-dark-bg)]"
                  style={typeof token.htmlStyle === "string" ? undefined : token.htmlStyle}
                >
                  {token.content}
                </span>
              ))}
            </span>
            {lineIndex !== tokens.length - 1 && "\n"}
          </React.Fragment>
        ))}
      </code>
    </pre>
  );
});

/**
 * CodeBlock Component
 *
 * - Wraps a code block in a <pre> tag.
 * - Uses `HighlightedPre` for syntax highlighting.
 * - Adds a copy button to easily copy the code.
 */
const CodeBlock = ({ children, className, language, ...restProps }) => {
  const code =
    typeof children === "string" ? children : childrenTakeAllStringContents(children);

  const preClass = cn(
    "overflow-x-scroll rounded-md border bg-background/50 p-4 font-mono text-sm [scrollbar-width:none]",
    className
  );

  return (
    <div className="group/code relative mb-4">
      <Suspense
        fallback={
          <pre className={preClass} {...restProps}>
            {children}
          </pre>
        }
      >
        <HighlightedPre language={language} className={preClass}>
          {code}
        </HighlightedPre>
      </Suspense>

      {/* Copy button appears on hover */}
      <div className="invisible absolute right-2 top-2 flex space-x-1 rounded-lg p-1 opacity-0 transition-all duration-200 group-hover/code:visible group-hover/code:opacity-100">
        <CopyButton content={code} copyMessage="Copied code to clipboard" />
      </div>
    </div>
  );
};

/**
 * Utility Function: Extracts all text content from children.
 */
const childrenTakeAllStringContents = (element) => {
  if (typeof element === "string") {
    return element;
  }

  if (element?.props?.children) {
    let children = element.props.children;

    if (Array.isArray(children)) {
      return children.map((child) => childrenTakeAllStringContents(child)).join("");
    } else {
      return childrenTakeAllStringContents(children);
    }
  }

  return "";
};

/**
 * COMPONENTS Object
 *
 * Defines custom render components for various Markdown elements.
 */
const COMPONENTS = {
  h1: withClass("h1", "text-2xl font-semibold"),
  h2: withClass("h2", "font-semibold text-xl"),
  h3: withClass("h3", "font-semibold text-lg"),
  h4: withClass("h4", "font-semibold text-base"),
  h5: withClass("h5", "font-medium"),
  strong: withClass("strong", "font-semibold"),
  a: withClass("a", "text-primary underline underline-offset-2"),
  blockquote: withClass("blockquote", "border-l-2 border-primary pl-4"),
  code: ({ children, className, node, ...rest }) => {
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <CodeBlock className={className} language={match[1]} {...rest}>
        {children}
      </CodeBlock>
    ) : (
      <code
        className={cn(
          "font-mono [:not(pre)>&]:rounded-md [:not(pre)>&]:bg-background/50 [:not(pre)>&]:px-1 [:not(pre)>&]:py-0.5"
        )}
        {...rest}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => children,
  ol: withClass("ol", "list-decimal space-y-2 pl-6"),
  ul: withClass("ul", "list-disc space-y-2 pl-6"),
  li: withClass("li", "my-1.5"),
  table: withClass(
    "table",
    "w-full border-collapse overflow-y-auto rounded-md border border-foreground/20"
  ),
  th: withClass(
    "th",
    "border border-foreground/20 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
  ),
  td: withClass(
    "td",
    "border border-foreground/20 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
  ),
  tr: withClass("tr", "m-0 border-t p-0 even:bg-muted"),
  p: withClass("p", "whitespace-pre-wrap"),
  hr: withClass("hr", "border-foreground/20"),
};

/**
 * Utility Function: Adds a class to a specific Markdown element.
 */
function withClass(Tag, classes) {
  const Component = ({ node, ...props }) => <Tag className={classes} {...props} />;
  Component.displayName = Tag;
  return Component;
}
