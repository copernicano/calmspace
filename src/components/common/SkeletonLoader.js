/**
 * ═══════════════════════════════════════════════════════════════════
 * Skeleton Loader - Predictable Loading States
 * ═══════════════════════════════════════════════════════════════════
 *
 * Skeleton screens are more autism-friendly than spinners because:
 * - They show the structure of what's loading (more predictable)
 * - No rapid spinning motion (less sensory overload)
 * - Give clear indication of what to expect
 * - Can be completely static in animations-off mode
 */

import React from 'react';
import '../../styles/loading-states.css';

const SkeletonLoader = ({
  variant = 'text', // 'text' | 'circle' | 'rectangle' | 'card' | 'list'
  width = '100%',
  height,
  count = 1,
  className = '',
}) => {
  /* ═══════════════════════════════════════════════════════════════════
     Variant Renderers
     ═══════════════════════════════════════════════════════════════════ */

  const renderText = () => (
    <div
      className="skeleton skeleton-text"
      style={{ width, height: height || '1em' }}
    />
  );

  const renderCircle = () => (
    <div
      className="skeleton skeleton-circle"
      style={{
        width: width || '40px',
        height: height || width || '40px'
      }}
    />
  );

  const renderRectangle = () => (
    <div
      className="skeleton skeleton-rectangle"
      style={{ width, height: height || '120px' }}
    />
  );

  const renderCard = () => (
    <div className="skeleton-card">
      <div className="skeleton skeleton-rectangle" style={{ height: '200px' }} />
      <div className="skeleton-card-content">
        <div className="skeleton skeleton-text" style={{ width: '60%', height: '1.5em' }} />
        <div className="skeleton skeleton-text" style={{ width: '100%', height: '1em' }} />
        <div className="skeleton skeleton-text" style={{ width: '80%', height: '1em' }} />
      </div>
    </div>
  );

  const renderListItem = () => (
    <div className="skeleton-list-item">
      <div className="skeleton skeleton-circle" style={{ width: '40px', height: '40px' }} />
      <div className="skeleton-list-content">
        <div className="skeleton skeleton-text" style={{ width: '70%', height: '1em' }} />
        <div className="skeleton skeleton-text" style={{ width: '50%', height: '0.875em' }} />
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════
     Render Multiple Items
     ═══════════════════════════════════════════════════════════════════ */

  const renderVariant = () => {
    switch (variant) {
      case 'text':
        return renderText();
      case 'circle':
        return renderCircle();
      case 'rectangle':
        return renderRectangle();
      case 'card':
        return renderCard();
      case 'list':
        return renderListItem();
      default:
        return renderText();
    }
  };

  if (count > 1) {
    return (
      <div className={`skeleton-container ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>
            {renderVariant()}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {renderVariant()}
    </div>
  );
};

export default SkeletonLoader;
