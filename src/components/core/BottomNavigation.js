/**
 * ═══════════════════════════════════════════════════════════════════
 * Bottom Navigation Component - Autism-Friendly Navigation
 * ═══════════════════════════════════════════════════════════════════
 *
 * Replaces the draggable floating button with:
 * - Fixed, predictable position (always bottom)
 * - Clear visual indicators for current page
 * - Large touch targets
 * - No movement or dragging required
 * - Simple, consistent layout
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';
import '../../styles/design-system.css';
import '../../styles/bottom-navigation.css';

const BottomNavigation = () => {
  const location = useLocation();
  const { settings } = useEnhancedSettings();

  // Navigation is ALWAYS shown to prevent users from getting trapped in settings
  // Previously hidden in maximal focus mode, but this caused navigation bugs

  /* ═══════════════════════════════════════════════════════════════════
     Navigation Items Definition
     ═══════════════════════════════════════════════════════════════════ */

  const navItems = [
    {
      id: 'home',
      path: '/',
      icon: '🏠',
      label: 'Home',
      ariaLabel: 'Vai alla home',
    },
    {
      id: 'emotion',
      path: '/emotion',
      icon: '💭',
      label: 'Emozioni',
      ariaLabel: 'Vai alla sezione emozioni',
    },
    {
      id: 'calmspace',
      path: '/calmspace',
      icon: '🌊',
      label: 'Spazio',
      ariaLabel: 'Vai al tuo spazio calmo',
    },
    {
      id: 'timer',
      path: '/timer',
      icon: '⏱️',
      label: 'Timer',
      ariaLabel: 'Vai ai timer',
    },
    {
      id: 'settings',
      path: '/settings',
      icon: '⚙️',
      label: 'Impostazioni',
      ariaLabel: 'Vai alle impostazioni',
    },
  ];

  /* ═══════════════════════════════════════════════════════════════════
     Check if Path is Active
     ═══════════════════════════════════════════════════════════════════ */

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    // Check if current path starts with the nav item path
    // This handles sub-routes like /emotion/intensity
    return location.pathname.startsWith(path);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Render Component
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <nav className="bottom-navigation" role="navigation" aria-label="Navigazione principale">
      <div className="bottom-nav-container">
        {navItems.map((item) => {
          const active = isActive(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${active ? 'active' : ''}`}
              aria-label={item.ariaLabel}
              aria-current={active ? 'page' : undefined}
            >
              {/* Icon */}
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>

              {/* Label */}
              <span className="nav-label">{item.label}</span>

              {/* Active Indicator (visual only) */}
              {active && (
                <span className="active-indicator" aria-hidden="true"></span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
