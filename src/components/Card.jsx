import React from 'react'
import PropTypes from 'prop-types'
import { spacing } from '../tokens/spacing'
import { colors } from '../tokens/colors'

/**
 * Card
 *
 * A versatile container component that can be used in three modes:
 * 1. Content-only: No image, just children content (ContentCard)
 * 2. Combo: Image + children content combined (ComboCard)
 * 3. Image-only: Just image, no children (ImageCard)
 *
 * Matches Zion UI design system.
 *
 * @param {string} size - Card size: 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'
 * @param {string} variant - Visual variant: 'elevated', 'outlined', 'none'
 * @param {string} image - Optional image URL (if provided without children, renders image-only)
 * @param {string} imagePosition - Image position: 'top', 'bottom', 'left', 'right', 'middle'
 * @param {string} imageAspectRatio - Image aspect ratio: '16:9', '4:3', '3:2', '1:1', '2:3', '3:4', '9:16'
 * @param {boolean} removeOppositeMargin - Remove margin on opposite side of image
 * @param {string} backgroundColor - Color token name (e.g., 'blue00', 'green02')
 * @param {function} onClick - Optional click handler (makes card interactive)
 * @param {node} children - Card content (if provided with image, creates combo card)
 */
export const Card = ({
  size = 'md',
  variant = 'elevated',
  image,
  imagePosition = 'top',
  imageAspectRatio = '16:9',
  removeOppositeMargin = false,
  backgroundColor,
  onClick,
  children,
  ...rest
}) => {
  // Size configurations (padding and border radius)
  const sizeConfig = {
    xxs: { padding: spacing.xxs, borderRadius: spacing.nano },
    xs: { padding: spacing.xs, borderRadius: spacing.nano },
    sm: { padding: spacing.sm, borderRadius: spacing.nano },
    md: { padding: spacing.md, borderRadius: spacing.xxs },
    lg: { padding: spacing.lg, borderRadius: '16px' },
    xl: { padding: spacing.xl, borderRadius: '20px' },
    xxl: { padding: spacing.xxl, borderRadius: '24px' }
  }

  // Variant configurations
  const variantStyles = {
    elevated: {
      boxShadow: '0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.20)',
      border: 'none'
    },
    outlined: {
      border: '1px solid #CACDCD',
      boxShadow: 'none'
    },
    none: {
      border: 'none',
      boxShadow: 'none'
    }
  }

  // Aspect ratio configurations (as percentage)
  const aspectRatios = {
    '16:9': 56.25,
    '4:3': 75,
    '3:2': 66.67,
    '1:1': 100,
    '2:3': 150,
    '3:4': 133.33,
    '9:16': 177.78
  }

  const config = sizeConfig[size]
  const variantStyle = variantStyles[variant]
  const paddingTop = aspectRatios[imageAspectRatio]

  // Resolve backgroundColor token to actual color value
  const getBackgroundColor = () => {
    // If elevated variant, default to gray00
    if (variant === 'elevated') {
      return colors.gray.gray00
    }

    // If outlined variant, use transparent
    if (variant === 'outlined') {
      return 'transparent'
    }

    // For 'none' variant, use backgroundColor prop or default to white
    if (!backgroundColor) return '#FFFFFF'

    // Parse the token name (e.g., 'blue00' -> colors.blue.blue00)
    const colorFamily = backgroundColor.replace(/\d+$/, '') // Remove numbers
    const tokenName = backgroundColor

    // Map color families to colors object
    const colorMap = {
      gray: colors.gray,
      blue: colors.blue,
      green: colors.green,
      yellow: colors.yellow,
      red: colors.red,
      danger: colors.danger,
      purple: colors.purple
    }

    const family = colorMap[colorFamily]
    return family && family[tokenName] ? family[tokenName] : '#FFFFFF'
  }

  // Base card styles
  const cardStyles = {
    backgroundColor: getBackgroundColor(),
    borderRadius: config.borderRadius,
    overflow: 'hidden',
    ...variantStyle,
    ...(onClick && {
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    })
  }

  // Interactive styles for hover when clickable
  const interactiveProps = onClick ? {
    onClick,
    onMouseEnter: (e) => {
      if (variant === 'elevated') {
        e.currentTarget.style.boxShadow = '0 4px 8px -2px rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.14), 0 4px 8px 0 rgba(0, 0, 0, 0.20)'
      }
      e.currentTarget.style.transform = 'translateY(-2px)'
    },
    onMouseLeave: (e) => {
      if (variant === 'elevated') {
        e.currentTarget.style.boxShadow = variantStyle.boxShadow
      }
      e.currentTarget.style.transform = 'translateY(0)'
    }
  } : {}

  // Content padding based on image position and removeOppositeMargin
  // Image styles (must be defined before use)
  const imageWrapperStyles = {
    position: 'relative',
    width: '100%',
    paddingTop: `${paddingTop}%`,
    overflow: 'hidden',
    flexShrink: 0
  }

  const imageStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }

  const getContentPadding = () => {
    const padding = config.padding

    if (!image) {
      return padding
    }

    switch (imagePosition) {
      case 'top':
        return removeOppositeMargin ? `0 ${padding} ${padding} ${padding}` : padding
      case 'bottom':
        return removeOppositeMargin ? `${padding} ${padding} 0 ${padding}` : padding
      case 'left':
        return removeOppositeMargin ? `${padding} ${padding} ${padding} 0` : padding
      case 'right':
        return removeOppositeMargin ? `${padding} 0 ${padding} ${padding}` : padding
      case 'middle':
        return removeOppositeMargin ? '0' : padding
      default:
        return padding
    }
  }

  const contentStyles = {
    padding: getContentPadding(),
    flex: imagePosition === 'middle' ? 'none' : '1'
  }

  // If no image, render simple content card
  if (!image) {
    return (
      <div style={{ ...cardStyles, padding: config.padding }} {...interactiveProps} {...rest}>
        {children}
      </div>
    )
  }

  // If image but no children, render image-only card (ImageCard style)
  if (image && !children) {
    return (
      <div style={{ ...cardStyles, overflow: 'hidden' }} {...interactiveProps} {...rest}>
        <div style={imageWrapperStyles}>
          <img src={image} alt="" style={imageStyles} />
        </div>
      </div>
    )
  }

  // Layout for top/bottom images
  if (imagePosition === 'top' || imagePosition === 'bottom') {
    return (
      <div style={{ ...cardStyles, display: 'flex', flexDirection: 'column' }} {...interactiveProps} {...rest}>
        {imagePosition === 'top' && (
          <div style={imageWrapperStyles}>
            <img src={image} alt="" style={imageStyles} />
          </div>
        )}
        <div style={contentStyles}>
          {children}
        </div>
        {imagePosition === 'bottom' && (
          <div style={imageWrapperStyles}>
            <img src={image} alt="" style={imageStyles} />
          </div>
        )}
      </div>
    )
  }

  // Layout for left/right images
  if (imagePosition === 'left' || imagePosition === 'right') {
    const imageContainerStyles = {
      ...imageWrapperStyles,
      width: '50%', // Can be adjusted as needed
      paddingTop: 0,
      height: 'auto',
      minHeight: '200px'
    }

    const imageStylesHorizontal = {
      ...imageStyles,
      position: 'static',
      height: '100%'
    }

    return (
      <div style={{ ...cardStyles, display: 'flex', flexDirection: 'row' }} {...interactiveProps} {...rest}>
        {imagePosition === 'left' && (
          <div style={imageContainerStyles}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img src={image} alt="" style={imageStylesHorizontal} />
            </div>
          </div>
        )}
        <div style={{ ...contentStyles, flex: 1 }}>
          {children}
        </div>
        {imagePosition === 'right' && (
          <div style={imageContainerStyles}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img src={image} alt="" style={imageStylesHorizontal} />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Layout for middle image
  if (imagePosition === 'middle') {
    return (
      <div style={{ ...cardStyles, display: 'flex', flexDirection: 'column' }} {...interactiveProps} {...rest}>
        <div style={contentStyles}>
          {children}
        </div>
        <div style={imageWrapperStyles}>
          <img src={image} alt="" style={imageStyles} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...cardStyles, padding: config.padding }} {...interactiveProps} {...rest}>
      {children}
    </div>
  )
}

Card.propTypes = {
  size: PropTypes.oneOf(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  variant: PropTypes.oneOf(['elevated', 'outlined', 'none']),
  image: PropTypes.string,
  imagePosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'middle']),
  imageAspectRatio: PropTypes.oneOf(['16:9', '4:3', '3:2', '1:1', '2:3', '3:4', '9:16']),
  removeOppositeMargin: PropTypes.bool,
  backgroundColor: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node
}
