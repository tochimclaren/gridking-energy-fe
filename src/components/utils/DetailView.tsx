import React, { useState } from 'react';
import { ExternalLink, Check, X, Image as ImageIcon, X as CloseIcon, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

type DetailViewProps<T extends Record<string, any>> = {
  data: T;
  title?: string;
  excludeKeys?: string[];
  className?: string;
  cardBackground?: string;
};

type ImageViewerProps = {
  images: { url: string; _id?: string; primary?: boolean }[];
  initialIndex: number;
  onClose: () => void;
};

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

const Accordion = ({ title, children, defaultOpen = false, className = '' }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <button
        className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-700">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-white border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

const ArrayTable = ({ data }: { data: any[] }) => {
  if (!data.length) return <span className="text-gray-400">Empty array</span>;
  
  // If array contains primitive values
  if (data.every(item => typeof item !== 'object' || item === null)) {
    return (
      <div className="flex flex-wrap gap-2">
        {data.map((item, index) => (
          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
            {item?.toString() || <span className="text-gray-400">null</span>}
          </span>
        ))}
      </div>
    );
  }

  // If array contains objects
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <Accordion 
          key={index} 
          title={item.name || item._id || `Item ${index + 1}`} 
          className="border-gray-200"
        >
          {typeof item === 'object' && item !== null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="p-2 bg-gray-50 rounded">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-sm">
                    {formatValue(value, key, () => {})}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span>{item?.toString() || <span className="text-gray-400">null</span>}</span>
          )}
        </Accordion>
      ))}
    </div>
  );
};

const ObjectDisplay = ({ data }: { data: Record<string, any> }) => {
  if (!data || Object.keys(data).length === 0) return <span className="text-gray-400">Empty object</span>;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="p-2 bg-gray-50 rounded">
          <div className="text-xs font-medium text-gray-500 mb-1">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </div>
          <div className="text-sm">
            {formatValue(value, key, () => {})}
          </div>
        </div>
      ))}
    </div>
  );
};

const ImageViewer = ({ images, initialIndex, onClose }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>
      
      <div className="relative w-full h-full flex items-center justify-center p-8">
        <button 
          onClick={handlePrevious}
          className="absolute left-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={images[currentIndex].url} 
            alt={`Image ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        
        <button 
          onClick={handleNext}
          className="absolute right-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      
      <div className="absolute bottom-4 text-white">
        {currentIndex + 1} / {images.length}
        {images[currentIndex].primary && (
          <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Primary
          </span>
        )}
      </div>
    </div>
  );
};

const formatValue = (value: any, key: string, setFullscreenImages: (data: {images: any[], index: number}) => void) => {
  // If value is null or undefined
  if (value === null || value === undefined) {
    return <span className="text-gray-400">-</span>;
  }

  // Handle image arrays specially with grid layout
  if (key === 'images' && Array.isArray(value) && value.length > 0 && value[0]?.url) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {value.map((image, index) => (
          <div 
            key={image._id || index} 
            className="group relative aspect-square cursor-pointer bg-gray-100"
            onClick={() => setFullscreenImages({ images: value, index })}
          >
            <img
              src={image.url}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg border border-gray-200"
              loading="lazy"
              style={{ display: 'block' }} // Ensure image displays
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 bg-white p-2 rounded-full shadow-md">
                <ExternalLink className="h-4 w-4 text-gray-700" />
              </div>
            </div>
            {image.primary && (
              <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                Primary
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Handle arrays with custom component
  if (Array.isArray(value)) {
    return <ArrayTable data={value} />;
  }

  // Handle nested objects with custom component
  if (typeof value === 'object' && value !== null) {
    return <ObjectDisplay data={value} />;
  }

  // Handle attributes field with special formatting
  if (key === 'attributes' && Array.isArray(value)) {
    return (
      <ul className="space-y-2 mt-1">
        {value.map((attr: any, index: number) => (
          <li key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="font-medium text-gray-800">{attr.name}</div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">
                Value: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{attr.value?.toString?.()}</span>
              </span>
              <span className="text-gray-500">
                {attr.dataType} • {attr.required ? (
                  <span className="text-red-500">Required</span>
                ) : (
                  <span className="text-green-500">Optional</span>
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  // Handle boolean values
  if (typeof value === 'boolean') {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value ? (
          <>
            <Check className="mr-1 h-3 w-3" /> Yes
          </>
        ) : (
          <>
            <X className="mr-1 h-3 w-3" /> No
          </>
        )}
      </span>
    );
  }

  // Handle URL strings
  if (typeof value === 'string' && value.startsWith('http')) {
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(value);
    return isImage ? (
      <div className="flex flex-col space-y-2">
        <img 
          src={value} 
          alt="Image preview" 
          className="w-full h-40 object-cover rounded-lg border border-gray-200"
          loading="lazy"
          onClick={() => setFullscreenImages({ images: [{ url: value }], index: 0 })}
          style={{ cursor: 'pointer', display: 'block' }}
        />
        <div className="flex items-center space-x-2">
          <ImageIcon className="h-4 w-4 text-gray-500" />
          <span 
            className="text-blue-600 hover:text-blue-800 hover:underline truncate cursor-pointer"
            onClick={() => setFullscreenImages({ images: [{ url: value }], index: 0 })}
          >
            View Full Size
          </span>
        </div>
      </div>
    ) : (
      <a 
        href={value} 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        {new URL(value).hostname}
        <ExternalLink className="ml-1.5 h-3 w-3" />
      </a>
    );
  }

  // Handle dates
  if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
    return (
      <div className="flex flex-col">
        <span>{new Date(value).toLocaleDateString()}</span>
        <span className="text-sm text-gray-500">{new Date(value).toLocaleTimeString()}</span>
      </div>
    );
  }

  // Default string/number rendering
  return value?.toString?.() || <span className="text-gray-400">-</span>;
};

const DetailView = <T extends Record<string, any>>({
  data,
  title = 'Details',
  excludeKeys = ['__v', 'id'],
  className = '',
  cardBackground = 'bg-white',
}: DetailViewProps<T>) => {
  const [fullscreenImages, setFullscreenImages] = useState<{images: any[], index: number} | null>(null);
  
  // Handle arrays of objects at the top level
  if (Array.isArray(data)) {
    return (
      <div className={`flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden ${className}`}>
        <div className={`${cardBackground} flex-1 flex flex-col overflow-hidden`}>
          <div className="p-5 pb-0">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 flex items-center">
              {title}
              <span className="ml-auto text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {data.length} items
              </span>
            </h2>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-4">
              {data.map((item, index) => {
                const itemTitle = item.name || item._id || `Item ${index + 1}`;
                return (
                  <Accordion 
                    key={index} 
                    title={itemTitle}
                    defaultOpen={index === 0}
                    className="shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(item)
                        .filter(([key]) => !excludeKeys.includes(key))
                        .map(([key, value]) => {
                          const isArrayOrObject = (
                            (Array.isArray(value) && value.length > 0) || 
                            (typeof value === 'object' && value !== null && Object.keys(value).length > 0)
                          );
                          
                          return (
                            <div 
                              key={key} 
                              className={`p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors ${
                                isArrayOrObject ? 'col-span-full' : ''
                              }`}
                            >
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                              <div className="text-gray-900 font-medium break-words">
                                {formatValue(value, key, setFullscreenImages)}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </Accordion>
                );
              })}
            </div>
          </div>
        </div>

        {fullscreenImages && (
          <ImageViewer 
            images={fullscreenImages.images} 
            initialIndex={fullscreenImages.index} 
            onClose={() => setFullscreenImages(null)} 
          />
        )}
      </div>
    );
  }

  // Handle single objects
  const filteredEntries = Object.entries(data).filter(([key]) => !excludeKeys.includes(key));

  return (
    <div className={`flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden ${className}`}>
      <div className={`${cardBackground} flex-1 flex flex-col overflow-hidden`}>
        <div className="p-5 pb-0">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 flex items-center">
            {title}
            <span className="ml-auto text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredEntries.length} properties
            </span>
          </h2>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntries.map(([key, value]) => {
              const isArrayOrObject = (
                (Array.isArray(value) && value.length > 0) || 
                (typeof value === 'object' && value !== null && Object.keys(value).length > 0)
              );
              
              return (
                <div 
                  key={key} 
                  className={`p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors ${
                    isArrayOrObject ? 'col-span-full' : ''
                  }`}
                >
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-gray-900 font-medium break-words">
                    {formatValue(value, key, setFullscreenImages)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {fullscreenImages && (
        <ImageViewer 
          images={fullscreenImages.images} 
          initialIndex={fullscreenImages.index} 
          onClose={() => setFullscreenImages(null)} 
        />
      )}
    </div>
  );
};

export default DetailView;