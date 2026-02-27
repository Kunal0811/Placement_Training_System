import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MarkdownViewer({ filePath }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the raw text of the markdown file
    fetch(filePath)
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setContent("# Error Loading Notes\nPlease check if the file exists.");
        setLoading(false);
      });
  }, [filePath]);

  if (loading) {
    return <div className="text-neon-blue animate-pulse text-xl font-bold p-10">Loading deep theoretical concepts...</div>;
  }

  return (
    <div className="prose prose-invert prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for code blocks
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-xl border border-white/10 shadow-2xl"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-white/10 text-neon-pink px-1.5 py-0.5 rounded-md font-mono text-sm" {...props}>
                {children}
              </code>
            );
          },
          // Custom styling for Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-8 border border-white/10 rounded-xl bg-black/40">
              <table className="w-full text-left border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => <th className="p-4 bg-white/5 font-bold uppercase text-xs tracking-widest border-b border-white/10" {...props} />,
          td: ({ node, ...props }) => <td className="p-4 border-b border-white/5" {...props} />,
          // Custom styling for Headers
          h1: ({ node, ...props }) => <h1 className="text-4xl md:text-5xl font-black text-white font-display tracking-tight mb-6 border-b border-white/10 pb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-3xl font-bold text-neon-blue mt-12 mb-6" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2" {...props} />,
          // Quotes / Callouts
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-neon-purple bg-neon-purple/10 p-4 rounded-r-xl italic text-gray-300 my-6" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}