import React, { ReactNode } from 'react';

interface ScrollableContainerProps {
  children: ReactNode;
  className?: string;
  maxHeight?: string;
  maxWidth?: string;
  title?: string;
  showShadows?: boolean;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children,
  className = '',
  maxHeight = 'h-80', // Default max height (16rem)
  maxWidth = 'w-full', // Default max width
  title,
  showShadows = true,
}) => {
  return (
    <div className={`${maxWidth} ${className}`}>
      {title && (
        <h3 className="font-medium text-gray-800 mb-2">{title}</h3>
      )}
      
      <div className="relative">
        {/* Top shadow overlay */}
        {showShadows && (
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
        )}
        
        {/* Scrollable area */}
        <div className={`${maxHeight} overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-1`}>
          <div className="py-2">
            {children}
          </div>
        </div>
        
        {/* Bottom shadow overlay */}
        {showShadows && (
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};

export default ScrollableContainer;

// // usage
// <ScrollableContainer
//                 maxHeight="h-100"
//                 title="Downloads"
//                 className="bg-gray-50 rounded-lg"
//             >
// {children}
// <ScrollableContainer />