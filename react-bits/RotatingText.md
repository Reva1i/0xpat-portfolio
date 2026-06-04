# RotatingText Component — React Bits

## Dependencies

```bash
npm install motion
```

## Usage Example

```jsx
import RotatingText from './RotatingText'

<RotatingText
  texts={['React', 'Bits', 'Is', 'Cool!']}
  mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
  staggerFrom={"last"}
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "-120%" }}
  staggerDuration={0.025}
  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
  transition={{ type: "spring", damping: 30, stiffness: 400 }}
  rotationInterval={2000}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| texts | string[] | [] | An array of text strings to be rotated. |
| rotationInterval | number | 2000 | The interval (in milliseconds) between text rotations. |
| initial | object | { y: "100%", opacity: 0 } | Initial animation state for each element. |
| animate | object | { y: 0, opacity: 1 } | Animation state when elements enter. |
| exit | object | { y: "-120%", opacity: 0 } | Exit animation state for elements. |
| animatePresenceMode | string | "wait" | Mode for AnimatePresence. |
| animatePresenceInitial | boolean | false | Whether AnimatePresence runs its initial animation. |
| staggerDuration | number | 0 | Delay between each character's animation. |
| staggerFrom | string | "first" | Order from which the stagger starts. |
| transition | object | — | Transition settings for the animations. |
| loop | boolean | true | Whether rotation loops back to the first text. |
| auto | boolean | true | If true, rotation starts automatically. |
| splitBy | string | "characters" | How text is split into animatable elements. |
| onNext | function | undefined | Callback when text rotates to next item. |
| mainClassName | string | '' | Additional classes for the main container. |
| splitLevelClassName | string | '' | Additional classes for each split group. |
| elementLevelClassName | string | '' | Additional classes for each animated element. |

## Component Source (RotatingText.jsx)

```jsx
'use client';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './RotatingText.css';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const RotatingText = forwardRef((props, ref) => {
  const {
    texts,
    transition = { type: 'spring', damping: 25, stiffness: 300 },
    initial = { y: '100%', opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: '-120%', opacity: 0 },
    animatePresenceMode = 'wait',
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = 'first',
    loop = true,
    auto = true,
    splitBy = 'characters',
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const splitIntoCharacters = text => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), segment => segment.segment);
    }
    return Array.from(text);
  };

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex];
    if (splitBy === 'characters') {
      const words = currentText.split(' ');
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1
      }));
    }
    if (splitBy === 'words') {
      return currentText.split(' ').map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1
      }));
    }
    if (splitBy === 'lines') {
      return currentText.split('\n').map((line, i, arr) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1
      }));
    }
    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1
    }));
  }, [texts, currentTextIndex, splitBy]);

  const getStaggerDelay = useCallback((index, totalChars) => {
    if (staggerFrom === 'first') return index * staggerDuration;
    if (staggerFrom === 'last') return (totalChars - 1 - index) * staggerDuration;
    if (staggerFrom === 'center') {
      const center = Math.floor(totalChars / 2);
      return Math.abs(center - index) * staggerDuration;
    }
    if (staggerFrom === 'random') {
      const randomIndex = Math.floor(Math.random() * totalChars);
      return Math.abs(randomIndex - index) * staggerDuration;
    }
    return Math.abs(staggerFrom - index) * staggerDuration;
  }, [staggerFrom, staggerDuration]);

  const handleIndexChange = useCallback(newIndex => {
    setCurrentTextIndex(newIndex);
    if (onNext) onNext(newIndex);
  }, [onNext]);

  const next = useCallback(() => {
    const nextIndex = currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const previous = useCallback(() => {
    const prevIndex = currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1;
    if (prevIndex !== currentTextIndex) handleIndexChange(prevIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const jumpTo = useCallback(index => {
    const validIndex = Math.max(0, Math.min(index, texts.length - 1));
    if (validIndex !== currentTextIndex) handleIndexChange(validIndex);
  }, [texts.length, currentTextIndex, handleIndexChange]);

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) handleIndexChange(0);
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset]);

  useEffect(() => {
    if (!auto) return;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, auto]);

  return (
    <motion.span className={cn('text-rotate', mainClassName)} {...rest} layout transition={transition}>
      <span className="text-rotate-sr-only">{texts[currentTextIndex]}</span>
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.span
          key={currentTextIndex}
          className={cn(splitBy === 'lines' ? 'text-rotate-lines' : 'text-rotate')}
          layout
          aria-hidden="true"
        >
          {elements.map((wordObj, wordIndex, array) => {
            const previousCharsCount = array.slice(0, wordIndex).reduce((sum, word) => sum + word.characters.length, 0);
            return (
              <span key={wordIndex} className={cn('text-rotate-word', splitLevelClassName)}>
                {wordObj.characters.map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{
                      ...transition,
                      delay: getStaggerDelay(
                        previousCharsCount + charIndex,
                        array.reduce((sum, word) => sum + word.characters.length, 0)
                      )
                    }}
                    className={cn('text-rotate-element', elementLevelClassName)}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordObj.needsSpace && <span className="text-rotate-space"> </span>}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
});

RotatingText.displayName = 'RotatingText';
export default RotatingText;
```

## Component CSS (RotatingText.css)

```css
.text-rotate {
  display: flex;
  flex-wrap: wrap;
  white-space: pre-wrap;
  position: relative;
}
.text-rotate-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.text-rotate-word {
  display: inline-flex;
}
.text-rotate-lines {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.text-rotate-element {
  display: inline-block;
}
.text-rotate-space {
  white-space: pre;
}
```

## Suggested Usage on This Site

### Hero section — rotating descriptor under the swap widget:
```jsx
<RotatingText
  texts={['Liquidity', 'Incentives', 'Partnerships', 'Ecosystems']}
  mainClassName="text-purple-400 font-mono"
  staggerFrom="last"
  initial={{ y: "100%", opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: "-120%", opacity: 0 }}
  staggerDuration={0.03}
  transition={{ type: "spring", damping: 30, stiffness: 400 }}
  rotationInterval={2500}
  splitBy="characters"
/>
```

### About section — rotating role descriptor:
```jsx
<RotatingText
  texts={['DeFi BD', 'Problem Solver', 'Data Driven', 'Longtermist']}
  mainClassName="text-white font-bold"
  staggerFrom="first"
  staggerDuration={0.04}
  rotationInterval={3000}
  transition={{ type: "spring", damping: 20, stiffness: 300 }}
  splitBy="words"
/>
```
