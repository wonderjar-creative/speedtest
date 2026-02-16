export const getBlockBaseClass = (blockName: string): string => {
  // Convert block name to base class, e.g., 'core/paragraph' to 'wp-block-paragraph'
  return `wp-block-${blockName.replace('core/', '').replace(/\//g, '-')}`;
}

export const getBlockClasses = (
  attributes: Record<string, any>,
  baseClass: string = ''
): string => {
  const {
    align,
    backgroundColor,
    borderColor,
    className,
    dimRatio,
    direction,
    dropCap,
    fontFamily,
    fontSize,
    gradient,
    id,
    isStackedOnMobile,
    layout,
    level,
    tagName,
    textAlign,
    textColor,
    sizeSlug,
    style,
    // add more as needed
  } = attributes;

  // Main classes array - use WordPress-style classes for consistency with patterns/CSS
  const classes = [
    baseClass,
    align ? `align${align}` : '',
    backgroundColor ? `has-${backgroundColor}-background-color has-background` : '',
    borderColor ? `has-${borderColor}-border-color` : '',
    className || '',
    dimRatio ? `has-background-dim has-background-dim-${dimRatio || '50'}` : '',
    direction ? `text-direction-${direction}` : '',
    dropCap ? 'has-drop-cap' : '',
    fontFamily ? `has-${fontFamily}-font-family` : '',
    fontSize ? `has-${fontSize}-font-size` : '',
    gradient ? `has-${gradient}-gradient-background has-background` : '',
    id ? `wp-image-${id}` : '',
    isStackedOnMobile ? 'is-stacked-on-mobile' : '',
    sizeSlug ? `size-${sizeSlug}` : '',
    textAlign ? `has-text-align-${textAlign}` : '',
    textColor ? `has-${textColor}-color has-text-color` : ''
  ];

  const { type, flexWrap, justifyContent, orientation, verticalAlignment } = layout || {};

  if (type) {
    classes.push(`is-layout-${type}`);

    if (type === 'flex') {
      if (orientation === 'vertical') {
        classes.push('is-vertical');
      }
      if (justifyContent) {
        classes.push(`is-content-justification-${justifyContent}`);
      }
      if (verticalAlignment) {
        classes.push(`is-vertically-aligned-${verticalAlignment}`);
      }
      if (flexWrap === 'nowrap') {
        classes.push('is-nowrap');
      }
    }

    if (type === 'constrained') {
      classes.push('has-global-padding');
    }
  }

  // Handle isStackedOnMobile — WP defaults columns to stacked; class marks opt-out
  if (isStackedOnMobile === false) {
    classes.push('is-not-stacked-on-mobile');
  }

  // Handle classes from style object
  if (style) {
    if (style?.color?.background || style?.color?.gradient) {
      classes.push('has-background');
    }
  }

  return classes.filter(Boolean).join(' ');
}

const convertPreset = (value: string): string => {
  // Converts "var:preset|spacing|40" to "var(--wp--preset--spacing--40)"
  // Matches WordPress CSS custom property naming convention
  if (typeof value === 'string' && value.startsWith('var:preset|')) {
    const parts = value.replace('var:preset|', '').split('|');
    value = `var(--wp--preset--${parts.join('--')})`;
  }

  return value;
}

interface StyleProps {
  elements?: Record<string, Record<string, string>>;
  layout?: {
    contentSize?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

export const getBlockStyleAttr = (styleObj: StyleProps): React.CSSProperties => {
  const result: React.CSSProperties = {};

  if (!styleObj || typeof styleObj !== 'object') return result;

  // Handle spacing (padding, margin)
  if (styleObj.spacing) {
    const { margin, padding, blockGap } = styleObj.spacing;
    if (margin) {
      if (margin.top) result.marginTop = convertPreset(margin.top);
      if (margin.right) result.marginRight = convertPreset(margin.right);
      if (margin.bottom) result.marginBottom = convertPreset(margin.bottom);
      if (margin.left) result.marginLeft = convertPreset(margin.left);
    }
    if (padding) {
      if (padding.top) result.paddingTop = convertPreset(padding.top);
      if (padding.right) result.paddingRight = convertPreset(padding.right);
      if (padding.bottom) result.paddingBottom = convertPreset(padding.bottom);
      if (padding.left) result.paddingLeft = convertPreset(padding.left);
    }
    if (blockGap) {
      if (typeof blockGap === 'string') {
        result.gap = convertPreset(blockGap);
      } else if (typeof blockGap === 'object') {
        Array.from(Object.entries(blockGap)).forEach(([key, value]: [string, any]) => {
          if ('top' === key) {
            result.rowGap = convertPreset(value);
          } else if ('left' === key) {
            result.columnGap = convertPreset(value);
          }
        });
      }
    }
  }

  // Handle border
  if (styleObj.border) {
    // Handle simple border properties
    if (styleObj.border.width) result.borderWidth = styleObj.border.width;
    if (styleObj.border.color) result.borderColor = styleObj.border.color.includes('var:') ? convertPreset(styleObj.border.color) : styleObj.border.color;
    if (styleObj.border.style) result.borderStyle = styleObj.border.style;

    // Handle border radius
    if (styleObj.border.radius) {
      const r = styleObj.border?.radius;
      if (typeof r === 'string') {
        result.borderRadius = r;
      } else if (typeof r === 'object') {
        if (r.topLeft) result.borderTopLeftRadius = `${r.topLeft}`;
        if (r.topRight) result.borderTopRightRadius = `${r.topRight}`;
        if (r.bottomRight) result.borderBottomRightRadius = `${r.bottomRight}`;
        if (r.bottomLeft) result.borderBottomLeftRadius = `${r.bottomLeft}`;
      }
    }

    // Handle individual border sides (top, right, bottom, left) as objects
    const sides = ['top', 'right', 'bottom', 'left'] as const;
    sides.forEach((side) => {
      const borderSide = styleObj.border[side];
      if (borderSide && typeof borderSide === 'object' && Object.keys(borderSide).length > 0) {
        const capitalizedSide = side.charAt(0).toUpperCase() + side.slice(1);
        if (borderSide.width) {
          result[`border${capitalizedSide}Width` as keyof React.CSSProperties] = borderSide.width;
        }
        if (borderSide.color) {
          result[`border${capitalizedSide}Color` as keyof React.CSSProperties] = borderSide.color.includes('var:') ? convertPreset(borderSide.color) : borderSide.color;
        }
        if (borderSide.style) {
          result[`border${capitalizedSide}Style` as keyof React.CSSProperties] = borderSide.style;
        }
      }
    });
  }

  // Handle color
  if (styleObj.color) {
    if (styleObj.color.background) result.background = styleObj.color.background.includes('var:') ? convertPreset(styleObj.color.background) : styleObj.color.background;
    if (styleObj.color.gradient) result.background = styleObj.color.gradient.includes('var:') ? convertPreset(styleObj.color.gradient) : styleObj.color.gradient;
    if (styleObj.color.text) result.color = styleObj.color.text.includes('var:') ? convertPreset(styleObj.color.text) : styleObj.color.text;
  }

  // Handle background-color
  if (styleObj.backgroundColor) {
    result.backgroundColor = styleObj.backgroundColor.includes('var:') ? convertPreset(styleObj.backgroundColor) : styleObj.backgroundColor;
  }

  // Handle typography
  if (styleObj.typography) {
    const t = styleObj.typography;
    if (t.fontSize) result.fontSize = typeof t.fontSize === 'number' ? `${t.fontSize}px` : convertPreset(t.fontSize);
    if (t.fontStyle) result.fontStyle = t.fontStyle;
    if (t.fontWeight) result.fontWeight = t.fontWeight;
    if (t.lineHeight) result.lineHeight = t.lineHeight;
    if (t.letterSpacing) result.letterSpacing = t.letterSpacing;
    if (t.textDecoration) result.textDecoration = t.textDecoration;
    if (t.writingMode) result.writingMode = t.writingMode;
    if (t.textTransform) result.textTransform = t.textTransform;
  }

  // Handle minHeight
  if (styleObj.minHeight) {
    const value = styleObj.minHeight;
    const unit = styleObj.minHeightUnit || 'px';
    result.minHeight = `${value}${unit}`;
  }

  // Handle height
  if (styleObj.height) {
    const value = styleObj.height;
    const unit = styleObj.heightUnit || 'px';
    result.height = `${value}${unit}`;
  }

  // Handle width
  if (styleObj.width) {
    const value = styleObj.width;
    const unit = styleObj.widthUnit || 'px';
    result.width = `${value}${unit}`;
  }

  // Handle maxWidth
  if (styleObj.maxWidth) {
    const value = styleObj.maxWidth;
    const unit = styleObj.maxWidthUnit || 'px';
    result.maxWidth = `${value}${unit}`;
  }

  return result;
}

const processStyleProperties = (
  properties: Record<string, any>,
  indent: string = '  '
): string => {
  let css = '';
  Object.entries(properties).forEach(([property, value]) => {
    if (typeof value === 'object' && value !== null) {
      // Handle nested objects (e.g., color: { text: ... })
      Object.entries(value as Record<string, any>).forEach(([subProp, subValue]) => {
        let cssPropName: string;

        // Map WordPress style properties to CSS properties
        if (property === 'color') {
          if (subProp === 'text') {
            cssPropName = 'color';
          } else if (subProp === 'background') {
            cssPropName = 'background-color';
          } else if (subProp === 'gradient') {
            cssPropName = 'background';
          } else {
            cssPropName = `${property}-${subProp}`.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
          }
        } else {
          cssPropName = `${property}-${subProp}`.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
        }

        const cssValue =
          typeof subValue === 'string' && subValue.startsWith('var:')
            ? convertPreset(subValue)
            : subValue;
        css += `${indent}${cssPropName}: ${cssValue};\n`;
      });
    }
  });
  return css;
};

export const styleElementsToCSS = (
  blockId: string,
  style: StyleProps,
  layout?: { contentSize?: string }
): string => {
  if (!style?.elements && !layout?.contentSize) return '';

  let css = '';
  if (style.elements) {
    Object.entries(style.elements).forEach(([selector, styles]) => {
      let cssSelector = '';
      switch (selector) {
        case 'link':
          cssSelector = 'a';
          break;
        case 'heading':
          cssSelector = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(tag => `.wp-block-${blockId} ${tag}`).join(', ');
          break;
        case 'button':
          cssSelector = ['button', '.wp-block-button__link'].map(sel => `.wp-block-${blockId} ${sel}`).join(', ');
          break;
        default:
          cssSelector = selector;
          break;
      }

      // Separate pseudo-selectors from regular properties
      const regularProps: Record<string, any> = {};
      const pseudoSelectors: Record<string, any> = {};

      Object.entries(styles).forEach(([property, value]) => {
        if (property.startsWith(':')) {
          pseudoSelectors[property] = value;
        } else {
          regularProps[property] = value;
        }
      });

      // Process regular properties
      if (Object.keys(regularProps).length > 0) {
        css += `.wp-block-${blockId} ${cssSelector} {\n`;
        css += processStyleProperties(regularProps);
        css += '}\n';
      }

      // Process pseudo-selectors
      Object.entries(pseudoSelectors).forEach(([pseudo, pseudoStyles]) => {
        css += `.wp-block-${blockId} ${cssSelector}${pseudo} {\n`;
        css += processStyleProperties(pseudoStyles as Record<string, any>);
        css += '}\n';
      });
    });
  }
  if (layout?.contentSize) {
    css += `.wp-block-${blockId} > * {\n`;
    css += `  max-width: ${layout.contentSize};\n`;
    css += `  margin-left: auto;\n`;
    css += `  margin-right: auto;\n`;
    css += `}\n`;
  }

  return css ? `/* Styles for ${blockId} */\n${css}` : '';
};
