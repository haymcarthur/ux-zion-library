import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { spacing } from '../tokens/spacing'
import { IconButton } from './IconButton'
import { Button } from './Button'
import { Breadcrumb } from './Breadcrumb'
import { Header } from './Header'
import { Paragraph } from './Paragraph'
import { Arrow } from '../icons'

/**
 * FullPageOverlay
 *
 * A full-page modal overlay with header, content area, and optional footer.
 * Matches Zion UI design system.
 *
 * @param {boolean} isOpen - Whether the overlay is open
 * @param {function} close - Function to close the overlay
 * @param {string} title - Title displayed in the header
 * @param {string} subtitle - Optional subtitle displayed below title
 * @param {array} breadcrumb - Optional breadcrumb items [{label, onClick}]
 * @param {array} iconButtons - Array of icon button configs for header right side
 * @param {object} primaryButton - Optional primary button config {label, onClick}
 * @param {node} footer - Optional footer content
 * @param {node} children - Content to display in the overlay body
 * @param {string} ariaLabel - Optional aria-label for accessibility
 */
export const FullPageOverlay = ({
  isOpen = false,
  close,
  title,
  subtitle,
  breadcrumb,
  iconButtons = [],
  primaryButton,
  footer,
  children,
  'aria-label': ariaLabel
}) => {
  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (e.key === 'Escape' && close) {
        close()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, close])

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: (breadcrumb || subtitle) ? `${spacing.xxs} ${spacing.xs}` : `0 ${spacing.xs}`,
          minHeight: '56px',
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0,
          gap: spacing.xxs
        }}
      >
        {/* Left side: Close button + Title/Subtitle/Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xxs, flex: 1, minWidth: 0 }}>
          {/* Close button */}
          {close && (
            <IconButton
              icon={(props) => <Arrow {...props} direction="backward" />}
              label="Close"
              onClick={close}
              size="md"
            />
          )}

          {/* Title area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Breadcrumb */}
            {breadcrumb && breadcrumb.length > 0 && (
              <div style={{ marginBottom: '2px' }}>
                <Breadcrumb items={breadcrumb} />
              </div>
            )}

            {/* Title */}
            <div style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              <Header level="h5">{title}</Header>
            </div>

            {/* Subtitle */}
            {subtitle && (
              <div style={{
                marginTop: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                <Paragraph size="sm" secondary>{subtitle}</Paragraph>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Icon buttons + Primary button */}
        <div style={{
          display: 'flex',
          gap: spacing.nano,
          alignItems: 'center',
          flexShrink: 0
        }}>
          {/* Icon buttons */}
          {iconButtons.map((button, index) => (
            <IconButton
              key={index}
              icon={button.icon}
              label={button.label}
              onClick={button.onClick}
              size="md"
            />
          ))}

          {/* Primary button */}
          {primaryButton && (
            <Button
              variant="blue"
              onClick={primaryButton.onClick}
            >
              {primaryButton.label}
            </Button>
          )}
        </div>
      </header>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#ffffff'
        }}
      >
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <footer
          style={{
            padding: spacing.xs,
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            flexShrink: 0
          }}
        >
          {footer}
        </footer>
      )}
    </div>
  )
}

FullPageOverlay.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  breadcrumb: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func
  })),
  iconButtons: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func
  })),
  primaryButton: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  footer: PropTypes.node,
  children: PropTypes.node,
  'aria-label': PropTypes.string
}

/**
 * Hook to manage overlay state
 * Matches Zion's useOverlay API
 */
export const useOverlay = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    handleClick: () => setIsOpen(!isOpen)
  }
}
