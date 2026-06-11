import type { ReactNode } from "react";

function renderInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 text-indigo-700 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
}

export function MarkdownViewer({ content }: { content: string }) {
  if (!content) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 italic text-sm">
        노트가 없습니다.
      </div>
    );
  }

  const lines = content.split("\n");
  const result: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      result.push(
        <h2 key={i} className="text-gray-900 mt-5 mb-3 border-b border-gray-100 pb-2 text-lg font-bold">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      result.push(
        <h3 key={i} className="text-gray-800 mt-4 mb-2 text-base font-semibold">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      result.push(
        <ul key={`ul-${i}`} className="space-y-1.5 ml-5 mb-3 list-disc">
          {items.map((item, j) => (
            <li key={j} className="text-gray-700 text-sm">
              <span dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (line.trim() === "") {
      result.push(<div key={i} className="h-3" />);
    } else {
      result.push(
        <p key={i} className="text-gray-700 leading-relaxed text-sm mb-2"
          dangerouslySetInnerHTML={{ __html: renderInline(line) }}
        />
      );
    }
    i++;
  }
  
  return <div className="prose prose-sm max-w-none">{result}</div>;
}
