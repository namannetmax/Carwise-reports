import React from 'react';
import Tooltip from './Tooltip';

interface FormattedTextProps {
  text: string;
  className?: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Regex breakdown:
  // 1. (\*\*.*?\*\*) matches bold text like **text**
  // 2. (\{\{.*?\|.*?\}\}) matches tooltip syntax like {{term|definition}}
  const regex = /(\*\*.*?\*\*|\{\{.*?\|.*?\}\})/g;
  
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Handle Bold
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.slice(2, -2);
          return (
            <strong key={index} className="font-bold text-slate-900 bg-yellow-100 px-1 rounded-sm">
              {content}
            </strong>
          );
        }
        
        // Handle Tooltip
        if (part.startsWith('{{') && part.endsWith('}}')) {
          const inner = part.slice(2, -2);
          const [term, def] = inner.split('|');
          if (term && def) {
            return <Tooltip key={index} term={term} definition={def} />;
          }
          return <span key={index}>{term || inner}</span>;
        }

        // Return normal text
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default FormattedText;