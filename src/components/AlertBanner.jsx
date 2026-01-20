import React from 'react'
import PropTypes from 'prop-types'
import { body } from '../tokens/typography'
import { colors, buttonColors, transparentColors } from '../tokens/colors'
import { NoticeInfo } from '../icons/NoticeInfo'
import { NoticeWarning } from '../icons/NoticeWarning'
import { NoticeImportant } from '../icons/NoticeImportant'
import { MenuSettings } from '../icons/MenuSettings'
import { Button } from './Button'
import * as Icons from '../icons'

/**
 * AlertBanner
 *
 * Alert banner component with icon, message, and optional action buttons.
 * Displays horizontally with icon on left, text in center, and buttons on right.
 *
 * @param {string} type - Type of alert: 'info', 'warning', 'error', 'maintenance', 'custom'
 * @param {string} message - Alert message text
 * @param {string} customIcon - Icon name for custom type (e.g., 'NoticeInfo', 'Check')
 * @param {string} customIconBackgroundColor - Background color for custom icon (e.g., '#4A90E2', 'blue')
 * @param {string} primaryButtonLabel - Label for primary action button
 * @param {function} onPrimaryClick - Handler for primary button click
 * @param {string} secondaryButtonLabel - Label for secondary action button
 * @param {function} onSecondaryClick - Handler for secondary button click
 */
export const AlertBanner = ({
  type = 'info',
  message,
  customIcon,
  customIconBackgroundColor = buttonColors.highBlue,
  primaryButtonLabel,
  onPrimaryClick,
  secondaryButtonLabel,
  onSecondaryClick,
  ...rest
}) => {
  // Type configurations for icon and background color
  const typeConfig = {
    info: {
      icon: NoticeInfo,
      backgroundColor: buttonColors.highBlue
    },
    warning: {
      icon: NoticeWarning,
      backgroundColor: colors.yellow.yellow40
    },
    error: {
      icon: NoticeImportant,
      backgroundColor: buttonColors.highRed
    },
    maintenance: {
      icon: MenuSettings,
      backgroundColor: transparentColors.transparentYellow40
    },
    custom: {
      icon: customIcon ? Icons[customIcon] || NoticeInfo : NoticeInfo,
      backgroundColor: customIconBackgroundColor
    }
  }

  const config = typeConfig[type]

  const containerStyles = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: colors.gray.gray00,
    borderTop: `1px solid ${transparentColors.transparentGray10}`,
    borderBottom: `1px solid ${transparentColors.transparentGray10}`,
    gap: '16px'
  }

  const iconContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: config.backgroundColor,
    flexShrink: 0
  }

  const messageStyles = {
    ...body.b,
    flex: 1,
    color: colors.gray.gray100
  }

  const buttonsContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '26px',
    marginLeft: 'auto'
  }

  const IconComponent = config.icon

  return (
    <div style={containerStyles} {...rest}>
      {/* Icon with colored background */}
      <div style={iconContainerStyles}>
        <IconComponent width="18px" height="18px" style={{ color: '#FFFFFF' }} />
      </div>

      {/* Message text */}
      <div style={messageStyles}>{message}</div>

      {/* Action buttons */}
      {(primaryButtonLabel || secondaryButtonLabel) && (
        <div style={buttonsContainerStyles}>
          {secondaryButtonLabel && (
            <Button
              variant="blue"
              emphasis="inline"
              onClick={onSecondaryClick}
            >
              {secondaryButtonLabel}
            </Button>
          )}
          {primaryButtonLabel && (
            <Button
              variant="blue"
              emphasis="inline"
              onClick={onPrimaryClick}
            >
              {primaryButtonLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

AlertBanner.propTypes = {
  type: PropTypes.oneOf(['info', 'warning', 'error', 'maintenance', 'custom']),
  message: PropTypes.string,
  customIcon: PropTypes.string,
  customIconBackgroundColor: PropTypes.string,
  primaryButtonLabel: PropTypes.string,
  onPrimaryClick: PropTypes.func,
  secondaryButtonLabel: PropTypes.string,
  onSecondaryClick: PropTypes.func
}
