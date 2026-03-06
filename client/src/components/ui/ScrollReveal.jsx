import { useEffect, useRef, useState } from 'react';

const defaultOptions = {
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1,
};

/**
 * Wraps content and reveals it with a smooth animation when it scrolls into view.
 * Victor Sin–style scroll-triggered reveal; lightweight (Intersection Observer + CSS).
 * @param {React.ReactNode} children
 * @param {string} [className] - Extra classes (e.g. for layout)
 * @param {string} [variant] - 'up' (default, slide up + fade) or 'fade' (fade only)
 * @param {number} [delay] - Stagger delay in ms (e.g. for list items)
 * @param {object} [ioOptions] - { rootMargin, threshold } for Intersection Observer
 * @param {string} [as] - Element type: 'div' | 'section' | 'article'
 */
export function ScrollReveal({
  children,
  className = '',
  variant = 'up',
  delay = 0,
  ioOptions = {},
  as: Component = 'div',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const options = { ...defaultOptions, ...ioOptions };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timeoutId;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (delay > 0) {
          timeoutId = setTimeout(() => setVisible(true), delay);
        } else {
          setVisible(true);
        }
      },
      options
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delay, options.rootMargin, options.threshold]);

  const baseClass = variant === 'fade' ? 'scroll-reveal scroll-reveal--fade' : 'scroll-reveal';
  const visibleClass = visible ? ' is-visible' : '';

  return (
    <Component
      ref={ref}
      className={`${baseClass}${visibleClass} ${className}`.trim()}
      style={delay > 0 ? { transitionDelay: visible ? `${delay}ms` : undefined } : undefined}
    >
      {children}
    </Component>
  );
}

export default ScrollReveal;
