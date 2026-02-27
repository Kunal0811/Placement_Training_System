import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// IMPORTANT: You must import KaTeX CSS for math formulas to show correctly!
import 'katex/dist/katex.min.css';

export default function MarkdownViewer({ content }) {
  return (
    <div className="markdown-container text-gray-300 leading-relaxed max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Custom styling for Headings
          h1: ({node, ...props}) => <h1 className="text-4xl font-display font-bold text-white mb-6 mt-10 border-b border-white/10 pb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-primary mb-4 mt-8" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-bold text-white mb-3 mt-6" {...props} />,
          
          // Custom styling for Paragraphs and Text
          p: ({node, ...props}) => <p className="mb-4 text-base text-gray-300" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-emerald-400" {...props} />,
          em: ({node, ...props}) => <em className="text-secondary italic" {...props} />,
          
          // Custom styling for Lists
          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2 marker:text-primary" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2 marker:text-secondary" {...props} />,
          li: ({node, ...props}) => <li className="pl-2" {...props} />,
          
          // Custom styling for Blockquotes (Great for Shortcuts/Tips)
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-warning bg-warning/10 p-4 rounded-r-xl my-6 italic text-gray-200" {...props} />
          ),

          // Custom styling for Tables
          table: ({node, ...props}) => <div className="overflow-x-auto mb-6"><table className="w-full text-left border-collapse" {...props} /></div>,
          th: ({node, ...props}) => <th className="bg-white/5 border-b border-white/10 p-3 font-bold text-white" {...props} />,
          td: ({node, ...props}) => <td className="border-b border-white/5 p-3 text-gray-300" {...props} />,

          // Custom styling for Code Blocks
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="rounded-xl overflow-hidden my-6 border border-white/10 shadow-2xl">
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0, padding: '1.5rem', background: '#09090b' }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}