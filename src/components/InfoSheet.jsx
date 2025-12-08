import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { colors } from '../tokens/colors'
import { spacing } from '../tokens/spacing'
import { elevation } from '../tokens/elevation'
import { Header } from './Header'
import { Paragraph } from './Paragraph'
import { IconButton } from './IconButton'
import { Button } from './Button'
import { Row } from './Row'
import { Arrow, MenuClose, ControlBottomSheet } from '../icons'

/**
 * InfoSheet
 *
 * A sheet that appears on the right side of the screen with header, content, and optional footer.
 * Slides content over rather than overlaying it.
 * Matches Zion UI design system.
 *
 * @param {string} title - Sheet title (H6)
 * @param {string} subtitle - Optional subtitle (XS paragraph, secondary)
 * @param {boolean} panel - Whether this is a panel info sheet with back button (default: false)
 * @param {function} onBack - Function to call when back button is clicked (for panel sheets)
 * @param {boolean} closable - Whether the sheet can be closed with X button (default: true)
 * @param {function} close - Function to close the sheet
 * @param {boolean} dockable - Whether the sheet can be docked to bottom (default: false)
 * @param {boolean} isDocked - Whether the sheet is currently docked to bottom (controlled)
 * @param {function} onDockToggle - Function to toggle dock state
 * @param {string} size - Sheet width: 'sm', 'md', 'lg', 'fullWidth'
 * @param {boolean} elevated - Whether the sheet has a drop shadow (default: true)
 * @param {object} primaryButton - Primary button config {label, onClick}
 * @param {object} secondaryButton - Secondary button config {label, onClick}
 * @param {node} children - Sheet content
 */
export const InfoSheet = ({
  title,
  subtitle,
  panel = false,
  onBack,
  closable = true,
  close,
  dockable = false,
  isDocked = false,
  onDockToggle,
  size = 'md',
  elevated = true,
  primaryButton,
  secondaryButton,
  children
}) => {
  // Size configurations (width)
  const sizeConfig = {
    sm: '300px',
    md: '360px',
    lg: '440px',
    fullWidth: '100%'
  }

  const sheetWidth = sizeConfig[size]

  const showFooter = primaryButton || secondaryButton

  // Apply margin to body when sheet is open
  useEffect(() => {
    document.body.style.transition = 'margin-right 0.3s ease, margin-bottom 0.3s ease'

    if (isDocked) {
      // When docked to bottom, push content up
      document.body.style.marginRight = '0'
      // Calculate height based on content (use auto height with min)
      document.body.style.marginBottom = '400px' // Default height for bottom sheet
    } else if (size !== 'fullWidth') {
      // When on side, push content left
      document.body.style.marginRight = sheetWidth
      document.body.style.marginBottom = '0'
    } else {
      // Full width on side
      document.body.style.marginRight = '0'
      document.body.style.marginBottom = '0'
    }

    return () => {
      document.body.style.marginRight = '0'
      document.body.style.marginBottom = '0'
    }
  }, [isDocked, sheetWidth, size])

  // Base styles for the sheet
  const sheetStyles = {
    position: 'fixed',
    right: 0,
    bottom: isDocked ? 0 : 0,
    top: isDocked ? 'auto' : 0,
    width: isDocked ? '100%' : sheetWidth,
    backgroundColor: colors.gray.gray00,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    transition: 'all 0.3s ease'
  }

  // Apply elevation or border
  if (elevated) {
    sheetStyles.boxShadow = elevation[4]
  } else {
    sheetStyles.borderLeft = '1px solid rgba(0, 14, 14, 0.208)'
  }

  return (
    <div style={sheetStyles}>
      {/* Header */}
      <div
        style={{
          padding: `${spacing.xxs} ${spacing.xs}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: spacing.xxs,
          flexShrink: 0
        }}
      >
        {/* Back button for panel sheets */}
        {panel && onBack && (
          <IconButton
            icon={(props) => <Arrow {...props} direction="backward" />}
            label="Back"
            onClick={onBack}
            variant="gray"
            emphasis="low"
            size="sm"
          />
        )}

        {/* Title and subtitle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Header level="h6">{title}</Header>
          {subtitle && (
            <div style={{ marginTop: '2px' }}>
              <Paragraph size="xs" secondary>
                {subtitle}
              </Paragraph>
            </div>
          )}
        </div>

        {/* Dock toggle button */}
        {dockable && onDockToggle && (
          <IconButton
            icon={ControlBottomSheet}
            label={isDocked ? "Dock to side" : "Dock to bottom"}
            onClick={onDockToggle}
            variant="gray"
            emphasis="low"
            size="sm"
          />
        )}

        {/* Close button */}
        {closable && close && (
          <IconButton
            icon={MenuClose}
            label="Close"
            onClick={close}
            variant="gray"
            emphasis="low"
            size="sm"
          />
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: spacing.xs,
          flex: 1,
          overflowY: isDocked ? 'visible' : 'auto'
        }}
      >
        {children}
      </div>

      {/* Footer */}
      {showFooter && (
        <div
          style={{
            padding: spacing.xs,
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: spacing.nano
          }}
        >
          {secondaryButton && (
            <Button
              variant="blue"
              emphasis="low"
              onClick={secondaryButton.onClick}
            >
              {secondaryButton.label}
            </Button>
          )}
          {primaryButton && (
            <Button
              variant="blue"
              emphasis="high"
              onClick={primaryButton.onClick}
            >
              {primaryButton.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

InfoSheet.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  panel: PropTypes.bool,
  onBack: PropTypes.func,
  closable: PropTypes.bool,
  close: PropTypes.func,
  dockable: PropTypes.bool,
  isDocked: PropTypes.bool,
  onDockToggle: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'fullWidth']),
  elevated: PropTypes.bool,
  primaryButton: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  secondaryButton: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  children: PropTypes.node
}

/**
 * useInfoSheet Hook
 *
 * Manages info sheet state including dock state
 * Returns { isOpen, open, close, handleClick, isDocked, toggleDock }
 */
export const useInfoSheet = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDocked, setIsDocked] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const handleClick = () => setIsOpen(!isOpen)
  const toggleDock = () => setIsDocked(!isDocked)

  return {
    isOpen,
    open,
    close,
    handleClick,
    isDocked,
    toggleDock
  }
}
