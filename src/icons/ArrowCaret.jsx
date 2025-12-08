import React from 'react'
import PropTypes from 'prop-types'
import { iconSizes, iconBackgroundPadding } from '../tokens/iconSizes'

/**
 * ArrowCaret Icon
 */
export const ArrowCaret = ({ size = 'sm', backgroundColor, ...props }) => {
  const iconSize = iconSizes[size]

  const svg = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9.4 17.17 14.68 12 9.4 6.83l1.4-1.43 6.73 6.6-6.73 6.6-1.4-1.43ZM6.47 12" />
    </svg>
  )

  if (backgroundColor) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        borderRadius: '50%',
        padding: iconBackgroundPadding[size]
      }}>
        {svg}
      </div>
    )
  }

  return svg
}

ArrowCaret.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  backgroundColor: PropTypes.string
}
