# GradientText Component — React Bits

## Dependencies

```bash
npm install motion
```

## Usage Example

```jsx
import GradientText from './GradientText'

// For a smoother animation, the gradient should start and end with the same color
<GradientText
  colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
  animationSpeed={3}
  showBorder={false}
  className="custom-class"
>
  Add a splash of color!
</GradientText>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The content to be displayed inside the gradient text. |
| className | string | '' | Adds custom classes to the root element. |
| colors | string[] | ["#5227FF", "#FF9FFC", "#B497CF"] | Array of colors for the gradient effect. |
| animationSpeed | number | 8 | Duration of one animation cycle in seconds. |
| direction | 'horizontal' \| 'vertical' \| 'diagonal' | 'horizontal' | Direction of the gradient animation. |
| pauseOnHover | boolean | false | Pauses the animation when hovering. |
| yoyo | boolean | true | Reverses animation direction at the end instead of looping. |
| showBorder | boolean | false | Displays a gradient border around the text. |

## Component Source (GradientText.jsx)

```jsx
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'motion/react';
import './GradientText.css';

export default function GradientText({
  children,
  className = '',
  colors = ['#5227FF', '#FF9FFC', '#B497CF'],
  animationSpeed = 8,
  showBorder = false,
  direction = 'horizontal',
  pauseOnHover = false,
  yoyo = true
}) {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);
  const animationDuration = animationSpeed * 1000;

  useAnimationFrame(time => {
    if (isPaused) {
      lastTimeRef.current = null;
      return;
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;

    if (yoyo) {
      const fullCycle = animationDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;
      if (cycleTime < animationDuration) {
        progress.set((cycleTime / animationDuration) * 100);
      } else {
        progress.set(100 - ((cycleTime - animationDuration) / animationDuration) * 100);
      }
    } else {
      progress.set((elapsedRef.current / animationDuration) * 100);
    }
  });

  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
  }, [animationSpeed, progress, yoyo]);

  const backgroundPosition = useTransform(progress, p => {
    if (direction === 'horizontal') return `${p}% 50%`;
    if (direction === 'vertical') return `50% ${p}%`;
    return `${p}% 50%`;
  });

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientAngle =
    direction === 'horizontal' ? 'to right' :
    direction === 'vertical' ? 'to bottom' : 'to bottom right';

  const gradientColors = [...colors, colors[0]].join(', ');
  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize: direction === 'horizontal' ? '300% 100%' : direction === 'vertical' ? '100% 300%' : '300% 300%',
    backgroundRepeat: 'repeat'
  };

  return (
    <motion.div
      className={`animated-gradient-text ${showBorder ? 'with-border' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showBorder && <motion.div className="gradient-overlay" style={{ ...gradientStyle, backgroundPosition }} />}
      <motion.div className="text-content" style={{ ...gradientStyle, backgroundPosition }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
```

## Component CSS (GradientText.css)

```css
.animated-gradient-text {
  position: relative;
  margin: 0 auto;
  display: flex;
  max-width: fit-content;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 1.25rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: box-shadow 0.5s ease-out;
  overflow: hidden;
  cursor: pointer;
}
.animated-gradient-text.with-border {
  padding: 0.35rem 0.75rem;
}
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  z-index: 0;
  pointer-events: none;
}
.gradient-overlay::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: inherit;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  transform: translate(-50%, -50%);
  background-color: #120F17;
  z-index: -1;
}
.text-content {
  display: inline-block;
  position: relative;
  z-index: 2;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
```

## Suggested Usage on This Site

### Hero section — "IDEA" and "RESULT" token labels in swap widget:
```jsx
<GradientText
  colors={["#7c3aed", "#40D6E1", "#7c3aed"]}
  animationSpeed={4}
  showBorder={false}
>
  IDEA
</GradientText>
```

### Stats bar — large metric numbers ($12.16B, $10M+, etc.):
```jsx
<GradientText
  colors={["#ffffff", "#7c3aed", "#40D6E1", "#ffffff"]}
  animationSpeed={6}
  direction="horizontal"
  pauseOnHover={true}
>
  $12.16B
</GradientText>
```

### Section headers (Liquidity, Partnerships, Launchpad, Farms, About):
```jsx
<GradientText
  colors={["#ffffff", "#a78bfa", "#ffffff"]}
  animationSpeed={8}
  direction="horizontal"
  yoyo={true}
>
  Liquidity
</GradientText>
```

### Profitability numbers in Farms section:
```jsx
// For positive number:
<GradientText colors={["#22c55e", "#40D6E1", "#22c55e"]} animationSpeed={3}>
  +26,146
</GradientText>

// For negative number:
<GradientText colors={["#ef4444", "#f97316", "#ef4444"]} animationSpeed={3}>
  -214,460
</GradientText>
```

## Combining with ShinyText

GradientText and ShinyText serve different purposes:
- **ShinyText**: Single color base with a moving highlight sweep — best for nav brand, subtle labels
- **GradientText**: Full color gradient that animates across the text — best for hero numbers, section headers, key metrics

Do NOT apply both to the same element. Use ShinyText for `0xpat / doxie` in Nav, and GradientText for stat numbers and section titles.
