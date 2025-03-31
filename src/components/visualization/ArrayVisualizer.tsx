import React from 'react';
import './ArrayVisualizer.css';

interface ArrayElement {
  value: number;
  isZero: boolean;
  slowPointer: boolean;
  fastPointer: boolean;
}

interface ArrayVisualizerProps {
  elements: ArrayElement[];
}

const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ elements }) => {
  return (
    <div className="array-container">
      {elements.map((element, index) => (
        <div 
          key={index} 
          className={`array-element ${element.isZero ? 'zero-element' : ''}`}
          data-value={element.value}
        >
          {element.value}
          {element.slowPointer && (
            <div className="pointer slow">
              <span className="pointer-label">S</span>
              <div className="pointer-arrow"></div>
            </div>
          )}
          {element.fastPointer && (
            <div className="pointer fast">
              <span className="pointer-label">F</span>
              <div className="pointer-arrow"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ArrayVisualizer; 