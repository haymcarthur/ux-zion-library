import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { colors } from '../tokens/colors'
import { spacing } from '../tokens/spacing'
import { elevation } from '../tokens/elevation'
import { IconButton } from './IconButton'
import { Button } from './Button'
import { HeadingBlock } from './HeadingBlock'
import * as Icons from '../icons'

/**
 * HelpTutorial Component
 *
 * Multi-slide tutorial overlay component with optional introduction dialog.
 * Uses slot-based architecture - add HelpTutorialSlide components to build tutorial.
 *
 * @param {string} type - Display mode: 'introduction' shows intro dialog, anything else shows slides overlay
 * @param {boolean} showIntroduction - Whether introduction dialog is available
 * @param {string} introIcon - Icon name for introduction slide
 * @param {string} introHeading - Heading for introduction slide
 * @param {string} introSubheading - Subheading for introduction slide
 * @param {function} onDismiss - Callback when "No Thanks" is clicked
 * @param {function} onStart - Callback when "Start Overview" is clicked
 * @param {number} currentSlide - Current slide number (1-indexed)
 * @param {function} onNext - Callback for next slide
 * @param {function} onPrevious - Callback for previous slide
 * @param {function} onClose - Callback to close tutorial
 * @param {object} slotChildren - Slot children containing HelpTutorialSlide components
 */
export const HelpTutorial = ({
  type = 'introduction',

  // Introduction props
  showIntroduction = true,
  introIcon = 'PlaceTemple',
  introHeading = 'Welcome to the Tutorial',
  introSubheading = 'Learn the basics in just a few steps',
  onDismiss,
  onStart,

  // Slide navigation props
  currentSlide = 1,
  onNext,
  onPrevious,
  onClose,

  // Slot children
  slotChildren = {},

  ...rest
}) => {
  // Extract slides from slot children
  const slides = slotChildren?.slides || []
  const totalSlides = slides.length
  // State for detecting scrollable content
  const [isScrollable, setIsScrollable] = useState(false)
  const contentRef = useRef(null)

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (contentRef.current) {
        const hasScroll = contentRef.current.scrollHeight > contentRef.current.clientHeight
        setIsScrollable(hasScroll)
      }
    }

    checkScrollable()
    // Recheck when content or window size changes
    window.addEventListener('resize', checkScrollable)
    return () => window.removeEventListener('resize', checkScrollable)
  }, [currentSlide, slides])

  // Get icon component
  const IntroIconComponent = Icons[introIcon] || Icons.PlaceTemple

  // Calculate dot indicators with complex logic
  const renderDotIndicators = () => {
    const dots = []
    const current = currentSlide
    const total = totalSlides

    // Determine which dots to show based on current slide
    let visibleDots = []

    if (total <= 3) {
      // Show all dots as 8x8
      for (let i = 1; i <= total; i++) {
        visibleDots.push({ slide: i, size: 8 })
      }
    } else if (total <= 5) {
      // Show first 3 as 8x8, then 4x4, then 2x2
      if (current <= 3) {
        // First three slides
        visibleDots = [
          { slide: 1, size: 8 },
          { slide: 2, size: 8 },
          { slide: 3, size: 8 },
          { slide: 4, size: 4 },
          { slide: 5, size: 2 }
        ]
      } else if (current === 4) {
        // Fourth slide
        visibleDots = [
          { slide: 1, size: 4 },
          { slide: 2, size: 8 },
          { slide: 3, size: 8 },
          { slide: 4, size: 8 },
          { slide: 5, size: 4 }
        ]
      } else {
        // Fifth slide
        visibleDots = [
          { slide: 1, size: 4 },
          { slide: 2, size: 8 },
          { slide: 3, size: 8 },
          { slide: 4, size: 8 },
          { slide: 5, size: 4 }
        ]
      }
    } else {
      // 6+ slides - complex sliding window logic
      if (current <= 3) {
        // First three slides
        visibleDots = [
          { slide: 1, size: 8 },
          { slide: 2, size: 8 },
          { slide: 3, size: 8 },
          { slide: 4, size: 4 },
          { slide: 5, size: 2 }
        ]
      } else if (current === total - 1) {
        // Second to last slide
        visibleDots = [
          { slide: total - 5, size: 2 },
          { slide: total - 4, size: 4 },
          { slide: total - 3, size: 8 },
          { slide: total - 2, size: 8 },
          { slide: total - 1, size: 8 },
          { slide: total, size: 4 }
        ]
      } else if (current === total) {
        // Last slide
        visibleDots = [
          { slide: total - 4, size: 2 },
          { slide: total - 3, size: 4 },
          { slide: total - 2, size: 8 },
          { slide: total - 1, size: 8 },
          { slide: total, size: 8 }
        ]
      } else {
        // Middle slides (4 to total-2)
        visibleDots = [
          { slide: current - 3, size: 2 },
          { slide: current - 2, size: 4 },
          { slide: current - 1, size: 8 },
          { slide: current, size: 8 },
          { slide: current + 1, size: 8 },
          { slide: current + 2, size: 4 },
          { slide: current + 3, size: 2 }
        ]
      }
    }

    // Render dots
    return visibleDots.map((dot, index) => {
      const isActive = dot.slide === current
      return (
        <div
          key={index}
          style={{
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            borderRadius: '50%',
            backgroundColor: isActive ? colors.blue.blue30 : colors.gray.gray70,
            transition: 'all 0.3s ease'
          }}
        />
      )
    })
  }

  // Introduction slide
  if (type === 'introduction') {
    return (
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 1000,
          maxWidth: '500px'
        }}
        {...rest}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: elevation[8],
            borderRadius: spacing.xs,
            padding: spacing.xxs
          }}
        >
          {/* Main content */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.md }}>
            {/* Icon with background */}
            <div style={{ flexShrink: 0, color: '#FFFFFF' }}>
              <IntroIconComponent
                size="md"
                backgroundColor={colors.yellow.yellow30}
              />
            </div>

            {/* Heading and subheading */}
            <div style={{ flex: 1 }}>
              <HeadingBlock
                level="h5"
                heading={introHeading}
                subheading={introSubheading}
                supplemental
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.xs, marginTop: spacing.sm }}>
            <Button
              emphasis="low"
              variant="blue"
              onClick={onDismiss}
            >
              No Thanks
            </Button>
            <Button
              emphasis="medium"
              variant="blue"
              onClick={onStart}
            >
              Start Overview
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Get current slide
  const currentSlideComponent = slides[currentSlide - 1]
  const currentSlideType = currentSlideComponent?.props?.type || 'main'
  const isEnd = currentSlideType === 'end'

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000
      }}
      {...rest}
    >
      <div
        style={{
          backgroundColor: colors.gray.gray00,
          borderRadius: spacing.nano,
          boxShadow: elevation[1],
          maxWidth: '564px',
          width: '90%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Header with close button */}
        <div
          style={{
            position: 'absolute',
            top: spacing.xxs,
            right: spacing.xxs,
            zIndex: 10
          }}
        >
          <IconButton
            icon={Icons.Close}
            size="md"
            emphasis="lightHigh"
            variant="gray"
            onClick={onClose}
            label="Close tutorial"
          />
        </div>

        {/* Header for end slide */}
        {isEnd && currentSlideComponent?.props?.heading && (
          <div
            style={{
              backgroundColor: colors.gray.gray00,
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: `${spacing.nano} ${spacing.nano} 0 0`,
              textAlign: 'center'
            }}
          >
            <HeadingBlock
              level="h5"
              heading={currentSlideComponent.props.heading}
            />
          </div>
        )}

        {/* Content */}
        <div
          ref={contentRef}
          style={{
            padding: `0 ${spacing.lg} ${spacing.lg} ${spacing.lg}`,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
            overflowY: 'auto',
            flex: 1
          }}
        >
          {/* Render current slide */}
          {currentSlideComponent && React.cloneElement(currentSlideComponent, {
            key: `slide-${currentSlide}`
          })}
        </div>

        {/* Footer with navigation */}
        <div
          style={{
            padding: `${spacing.sm} ${spacing.md} ${spacing.md} ${spacing.md}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.sm,
            boxShadow: isScrollable ? `0 -4px 8px rgba(0, 0, 0, 0.1)` : 'none'
          }}
        >
          {/* Exit button for end slide */}
          {isEnd && (
            <Button
              emphasis="high"
              variant="blue"
              onClick={onClose}
            >
              Exit Overview
            </Button>
          )}

          {/* Navigation controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: spacing.xs
            }}
          >
            {/* Previous button */}
            <IconButton
              icon={Icons.BackwardArrowCaret}
              size="md"
              emphasis="lightHigh"
              variant="gray"
              onClick={onPrevious}
              disabled={currentSlide === 1}
              label="Previous slide"
            />

            {/* Dot indicators */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.nano,
                padding: spacing.xxs,
                backgroundColor: colors.gray.gray100,
                borderRadius: '20px'
              }}
            >
              {renderDotIndicators()}
            </div>

            {/* Next button */}
            <IconButton
              icon={Icons.ForwardArrowCaret}
              size="md"
              emphasis="lightHigh"
              variant="blue"
              onClick={onNext}
              disabled={currentSlide === totalSlides}
              label="Next slide"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

HelpTutorial.propTypes = {
  type: PropTypes.oneOf(['introduction', 'slides']),
  showIntroduction: PropTypes.bool,
  introIcon: PropTypes.string,
  introHeading: PropTypes.string,
  introSubheading: PropTypes.string,
  onDismiss: PropTypes.func,
  onStart: PropTypes.func,
  currentSlide: PropTypes.number,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  onClose: PropTypes.func,
  slotChildren: PropTypes.object
}
