import React, { useState } from 'react';

interface TruncateTextProps {
    text: string;
    maxLength: number;
    ellipsis?: string;
    className?: string;
}

interface MultilineTruncateProps {
    text: string;
    lines?: number;
    className?: string;
}

interface ExpandableTextProps {
    text: string;
    maxLength?: number;
    showMoreText?: string;
    showLessText?: string;
    className?: string;
    buttonClassName?: string;
  }
  

export const TruncateText: React.FC<TruncateTextProps> = ({
    text,
    maxLength,
    ellipsis = '...',
    className = '',
}) => {
    if (text.length <= maxLength) return <span className={className}>{text}</span>;

    const truncated = text.substring(0, maxLength) + ellipsis;
    return <span className={className}>{truncated}</span>;
};



export const MultilineTruncate: React.FC<MultilineTruncateProps> = ({
    text,
    lines = 3,
    className = '',
}) => {
    return (
        <div
            className={`${className} overflow-hidden`}
            style={{
                display: '-webkit-box',
                WebkitLineClamp: lines,
                WebkitBoxOrient: 'vertical',
            }}
        >
            {text}
        </div>
    );
};


export const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  maxLength = 100,
  showMoreText = 'Show more',
  showLessText = 'Show less',
  className = '',
  buttonClassName = 'text-blue-500 hover:underline ml-1',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <span className={className}>{text}</span>;
  }

  const truncatedText = text.substring(0, maxLength) + '...';

  return (
    <span className={className}>
      {isExpanded ? text : truncatedText}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={buttonClassName}
      >
        {isExpanded ? showLessText : showMoreText}
      </button>
    </span>
  );
};


// usage for truncate utils

{/* <TruncateText 
  text="This is a very long text that needs to be truncated"
  maxLength={20}
  className="text-gray-700"
/> */}

{/* <MultilineTruncate 
  text={longDescription} 
  lines={4} 
  className="text-base"
/> */}

{/* <ExpandableText
  text={longContent}
  maxLength={150}
  showMoreText="Read more"
  showLessText="Collapse"
  className="text-gray-800"
/> */}