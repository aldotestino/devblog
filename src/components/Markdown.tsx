import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

function Code({ language, value }: SyntaxHighlighterProps) {
  return (
    <SyntaxHighlighter 
      style={tomorrow}
      showLineNumbers
      language={language}
    >
      {value}
    </SyntaxHighlighter>
  );
}

const renderers = {
  code: Code
};

interface MarkdownProps {
  content: string
}

function Markdown({ content }: MarkdownProps) {
  return(
    <ReactMarkdown renderers={renderers} source={content} plugins={[gfm]} className="markdown-body" />
  );
}

export default Markdown;