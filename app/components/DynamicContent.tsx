'use client';

import React from 'react';

interface DynamicContentProps {
  content: string;
}

export default function DynamicContent({ content }: DynamicContentProps) {
  if (!content) return null;

  // Simple markdown-like renderer
  const paragraphs = content.split('\n\n');

  return (
    <div className="prose prose-lg max-w-none space-y-6">
      {paragraphs.map((paragraph, index) => {
        // Handle bold headers (### Header)
        if (paragraph.startsWith('#### ')) {
          return (
            <h4 key={index} className="text-lg font-bold text-gray-900 mt-8 mb-4 border-b pb-2">
              {paragraph.replace('#### ', '')}
            </h4>
          );
        }
        if (paragraph.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl font-bold text-gray-900 mt-10 mb-6 border-b-2 pb-2">
              {paragraph.replace('### ', '')}
            </h3>
          );
        }
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-extrabold text-gray-900 mt-12 mb-8 border-b-2 border-stone-100 pb-3">
              {paragraph.replace('## ', '')}
            </h2>
          );
        }
        
        // Handle lists (bullets starting with - or *)
        if (paragraph.split('\n').some(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
          const lines = paragraph.split('\n');
          return (
            <ul key={index} className="list-disc pl-6 space-y-2 text-gray-600">
              {lines.map((line, liIndex) => {
                const cleanedLine = line.trim().replace(/^[-*]\s/, '');
                if (!cleanedLine) return null;
                return <li key={liIndex}>{cleanedLine}</li>;
              }).filter(Boolean)}
            </ul>
          );
        }

        // Handle bold text inline (**text**)
        const renderInline = (text: string) => {
          const parts = text.split(/(\*\*.*?\*\*)/g);
          return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            return part;
          });
        };

        // Regular paragraph with line breaks handled
        return (
          <p key={index} className="text-gray-600 leading-relaxed text-lg">
            {paragraph.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {renderInline(line)}
                {i < paragraph.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
