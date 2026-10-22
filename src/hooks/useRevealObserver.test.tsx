import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { act } from 'react';
import { useRevealObserver } from './useRevealObserver';

const observed: Element[] = [];
class FakeIntersectionObserver {
  constructor(public cb: IntersectionObserverCallback) {}
  observe = (el: Element) => observed.push(el);
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
  root = null;
  rootMargin = '';
  thresholds = [];
}

function Harness() {
  useRevealObserver();
  return null;
}

const rect = (top: number, bottom: number) => () => ({ top, bottom, left: 0, right: 0, width: 0, height: bottom - top, x: 0, y: top, toJSON: () => ({}) });

beforeEach(() => {
  observed.length = 0;
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  window.innerHeight = 800;
});
afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

function addReveal(top: number, bottom: number) {
  const el = document.createElement('div');
  el.className = 'reveal';
  el.getBoundingClientRect = rect(top, bottom) as never;
  document.body.appendChild(el);
  return el;
}

describe('useRevealObserver', () => {
  it('handles blocks that mount after it starts (code-split pages)', async () => {
    render(<Harness />);
    expect(document.documentElement.classList.contains('reveal-ready')).toBe(true);

    // Page content arrives later, as it does with lazy-loaded pages.
    const onScreen = addReveal(100, 300);
    const below = addReveal(2000, 2300);
    const above = addReveal(-600, -100);
    await act(async () => {
      await Promise.resolve(); // let the MutationObserver deliver
    });

    expect(onScreen).toHaveClass('is-visible');
    expect(above).toHaveClass('is-visible');
    expect(below).not.toHaveClass('is-visible');
    expect(observed).toContain(below);
  });

  it('shows everything when reduced motion is requested, including late content', async () => {
    const mm = window.matchMedia;
    window.matchMedia = ((q: string) => ({ ...mm(q), matches: q.includes('reduce') })) as typeof window.matchMedia;
    render(<Harness />);
    const late = addReveal(5000, 5300);
    await act(async () => {
      await Promise.resolve();
    });
    expect(late).toHaveClass('is-visible');
    window.matchMedia = mm;
  });
});
