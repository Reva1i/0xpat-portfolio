# TextType Component — React Bits

## Dependencies

```bash
npm install gsap
```

## Usage Example

```jsx
import TextType from './TextType';

<TextType 
  text={["Text typing effect", "for your websites", "Happy coding!"]}
  typingSpeed={75}
  pauseDuration={1500}
  showCursor={true}
  cursorCharacter="|"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string \| string[] | - | Text or array of texts to type out |
| as | ElementType | div | HTML tag to render the component as |
| typingSpeed | number | 50 | Speed of typing in milliseconds |
| initialDelay | number | 0 | Initial delay before typing starts |
| pauseDuration | number | 2000 | Time to wait between typing and deleting |
| deletingSpeed | number | 30 | Speed of deleting characters |
| loop | boolean | true | Whether to loop through texts array |
| className | string | '' | Optional class name for styling |
| showCursor | boolean | true | Whether to show the cursor |
| hideCursorWhileTyping | boolean | false | Hide cursor while typing |
| cursorCharacter | string \| ReactNode | \| | Character or React node to use as cursor |
| cursorBlinkDuration | number | 0.5 | Animation duration for cursor blinking |
| cursorClassName | string | '' | Optional class name for cursor styling |
| textColors | string[] | [] | Array of colors for each sentence |
| variableSpeed | {min: number, max: number} | undefined | Random typing speed for human-like feel |
| onSentenceComplete | function | undefined | Callback fired after each sentence |
| startOnVisible | boolean | false | Start typing when component is visible |
| reverseMode | boolean | false | Type backwards (right to left) |

## Component Source (TextType.jsx)

```jsx
'use client';
import { useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import './TextType.css';

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef(null);
  const containerRef = useRef(null);
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return 'inherit';
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;
    const observer = new IntersectionObserver(
      entries => { entries.forEach(entry => { if (entry.isIntersecting) setIsVisible(true); }); },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible) return;
    let timeout;
    const currentText = textArray[currentTextIndex];
    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) return;
          if (onSentenceComplete) onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
          setCurrentTextIndex(prev => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev + processedText[currentCharIndex]);
            setCurrentCharIndex(prev => prev + 1);
          }, variableSpeed ? getRandomSpeed() : typingSpeed);
        } else if (textArray.length >= 1) {
          if (!loop && currentTextIndex === textArray.length - 1) return;
          timeout = setTimeout(() => { setIsDeleting(true); }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }
    return () => clearTimeout(timeout);
  }, [currentCharIndex, displayedText, isDeleting, typingSpeed, deletingSpeed, pauseDuration,
      textArray, currentTextIndex, loop, initialDelay, isVisible, reverseMode, variableSpeed, onSentenceComplete]);

  const shouldHideCursor = hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting);

  return createElement(
    Component,
    { ref: containerRef, className: `text-type ${className}`, ...props },
    <span className="text-type__content" style={{ color: getCurrentTextColor() || 'inherit' }}>
      {displayedText}
    </span>,
    showCursor && (
      <span ref={cursorRef} className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}>
        {cursorCharacter}
      </span>
    )
  );
};

export default TextType;
```

## Component CSS (TextType.css)

```css
.text-type {
  display: inline-block;
  white-space: pre-wrap;
}
.text-type__cursor {
  margin-left: 0.25rem;
  display: inline-block;
  opacity: 1;
}
.text-type__cursor--hidden {
  display: none;
}
```

## Suggested Usage on This Site

### Hero section — rotating descriptor (replace RotatingText if too animated):
```jsx
<TextType
  text={["Liquidity deals.", "Incentive design.", "Ecosystem partnerships.", "Protocol growth."]}
  typingSpeed={40}
  deletingSpeed={20}
  pauseDuration={1800}
  showCursor={true}
  cursorCharacter="_"
  cursorClassName="text-purple-400"
  startOnVisible={false}
/>
```

### About section — role descriptor:
```jsx
<TextType
  text={["DeFi BD.", "Problem solver.", "Data driven.", "Longtermist."]}
  typingSpeed={50}
  deletingSpeed={25}
  pauseDuration={2000}
  showCursor={true}
  cursorCharacter="|"
  loop={true}
/>
```

## Notes
- TextType is more subtle than RotatingText — characters type in one by one instead of flying in
- Use `variableSpeed={{ min: 30, max: 80 }}` for a human-like feel
- Use `cursorCharacter="_"` for a terminal/code aesthetic that fits the DeFi theme
- `startOnVisible={true}` is useful for sections below the fold
