import React from 'react'
import PropTypes from 'prop-types'
import { spacing } from '../tokens/spacing'
import { HeadingBlock } from './HeadingBlock'
import { Paragraph } from './Paragraph'

/**
 * HelpTutorialSlide Component
 *
 * Individual slide for HelpTutorial component.
 * Renders differently based on type: title, main, or end.
 *
 * @param {string} type - Slide type: 'title' | 'main' | 'end'
 * @param {string} imageSrc - Image source for slide
 * @param {string} heading - Heading text
 * @param {string} paragraph - Paragraph text (shown if no cards)
 * @param {string} endTitle - Optional h4 title for end slide
 * @param {object} slotChildren - Slot children (cards for end slide)
 */
export const HelpTutorialSlide = ({
  type = 'main',
  imageSrc,
  heading = '',
  paragraph = '',
  endTitle = '',
  slotChildren = {},
  ...rest
}) => {
  const isTitle = type === 'title'
  const isMain = type === 'main'
  const isEnd = type === 'end'

  // Extract cards from slot children
  const cards = slotChildren?.cards || []

  return (
    <>
      {/* Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={heading}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: spacing.xs
          }}
        />
      )}

      {/* End slide optional h4 title */}
      {isEnd && endTitle && (
        <HeadingBlock
          level="h4"
          heading={endTitle}
        />
      )}

      {/* Heading - only show for title and main slides */}
      {!isEnd && (
        <HeadingBlock
          level={isTitle ? 'h3' : 'h5'}
          heading={heading}
        />
      )}

      {/* Content - paragraph or cards */}
      {!isEnd || cards.length === 0 ? (
        <Paragraph size={isTitle ? 'md' : 'sm'}>
          {paragraph}
        </Paragraph>
      ) : null}

      {/* Related cards for end slide */}
      {isEnd && cards.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: spacing.md
          }}
        >
          {cards}
        </div>
      )}
    </>
  )
}

HelpTutorialSlide.propTypes = {
  type: PropTypes.oneOf(['title', 'main', 'end']),
  imageSrc: PropTypes.string,
  heading: PropTypes.string,
  paragraph: PropTypes.string,
  endTitle: PropTypes.string,
  slotChildren: PropTypes.object
}
