import React from 'react'
import PropTypes from 'prop-types'

/**
 * Image
 *
 * Simple image component with configurable alignment.
 * Loads images from the public folder.
 *
 * @param {string} src - Image filename in public folder (e.g., 'logo.png', 'photos/hero.jpg')
 * @param {string} alt - Alternative text for accessibility
 * @param {string} alignment - Image alignment: 'left', 'center', or 'right'
 * @param {string} width - Image width (e.g., '100%', '400px', 'auto')
 * @param {string} height - Image height (e.g., 'auto', '300px')
 */
export const Image = ({
  src,
  alt = '',
  alignment = 'left',
  width = 'auto',
  height = 'auto',
  ...rest
}) => {
  const containerStyles = {
    display: 'flex',
    justifyContent: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start',
    width: '100%'
  }

  const imageStyles = {
    width: width,
    height: height,
    objectFit: 'contain'
  }

  // Construct the image path - if it starts with /, use as-is, otherwise prepend /
  const imagePath = src?.startsWith('/') ? src : `/${src}`

  return (
    <div style={containerStyles} {...rest}>
      <img
        src={imagePath}
        alt={alt}
        style={imageStyles}
      />
    </div>
  )
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  alignment: PropTypes.oneOf(['left', 'center', 'right']),
  width: PropTypes.string,
  height: PropTypes.string
}
