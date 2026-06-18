'use client';

import { useEffect } from 'react';

const PROBE_CLASSES = [
  'text-hill',
  'text-hill-dark',
  'text-earth',
  'text-foreground',
  'text-lake',
  'text-sunrise',
  'text-sunrise-soft',
  'text-white',
  'text-earth/60',
] as const;

const BG_CLASSES = ['bg-background', 'bg-card', 'komera-gradient-hero'] as const;

function hasCssRule(className: string): boolean {
  const selector = `.${className.replace(/\//g, '\\/')}`;
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSStyleRule && rule.selectorText.includes(className.split('/')[0])) {
          return true;
        }
      }
    }
  } catch {
    /* ignore cross-origin */
  }
  return false;
}

function parseRgb(color: string): [number, number, number] | null {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(fg: string, bg: string): number | null {
  const f = parseRgb(fg);
  const b = parseRgb(bg);
  if (!f || !b) return null;
  const l1 = luminance(...f);
  const l2 = luminance(...b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function sendLog(message: string, data: Record<string, unknown>, hypothesisId: string) {
  // #region agent log
  fetch('http://127.0.0.1:7645/ingest/a7d6f053-160f-41f5-9a9d-98e131eb883b', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'af03d0' },
    body: JSON.stringify({
      sessionId: 'af03d0',
      runId: 'post-fix',
      hypothesisId,
      location: 'ThemeDebugProbe.tsx',
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

export default function ThemeDebugProbe() {
  useEffect(() => {
    const host = document.createElement('div');
    host.setAttribute('data-theme-probe', 'true');
    host.style.cssText = 'position:fixed;left:-9999px;top:0;pointer-events:none;';
    document.body.appendChild(host);

    const cssRuleChecks: Record<string, boolean> = {};
    PROBE_CLASSES.forEach((cls) => {
      cssRuleChecks[cls] = hasCssRule(cls.split('/')[0]);
    });

    sendLog('css-rule-presence', { cssRuleChecks, pathname: window.location.pathname }, 'A');

    const probeResults: Array<Record<string, unknown>> = [];

    BG_CLASSES.forEach((bgCls) => {
      const bgWrap = document.createElement('div');
      bgWrap.className = bgCls;
      bgWrap.style.padding = '8px';
      host.appendChild(bgWrap);

      PROBE_CLASSES.forEach((textCls) => {
        const el = document.createElement('p');
        el.className = textCls;
        el.textContent = 'probe';
        bgWrap.appendChild(el);

        const cs = getComputedStyle(el);
        const bgCs = getComputedStyle(bgWrap);
        const ratio = contrastRatio(cs.color, bgCs.backgroundColor);

        probeResults.push({
          textClass: textCls,
          bgClass: bgCls,
          color: cs.color,
          backgroundColor: bgCs.backgroundColor,
          opacity: cs.opacity,
          contrastRatio: ratio,
          invisible: ratio !== null && ratio < 2,
          transparentColor: cs.color === 'rgba(0, 0, 0, 0)' || cs.color === 'transparent',
        });
      });
    });

    sendLog('computed-style-probes', { probeResults }, 'B');

    const lowContrastOnPage: Array<Record<string, unknown>> = [];
    document.querySelectorAll('p, h1, h2, h3, h4, span, a, button, label').forEach((el) => {
      if (el.closest('[data-theme-probe]')) return;
      const text = (el.textContent || '').trim();
      if (!text || text.length < 2) return;
      const cs = getComputedStyle(el);
      const parentBg = getComputedStyle(el.parentElement || document.body);
      const ratio = contrastRatio(cs.color, parentBg.backgroundColor);
      if (ratio !== null && ratio < 2.5) {
        lowContrastOnPage.push({
          tag: el.tagName,
          text: text.slice(0, 40),
          className: el.className,
          color: cs.color,
          parentBg: parentBg.backgroundColor,
          contrastRatio: ratio,
          opacity: cs.opacity,
        });
      }
    });

    sendLog('low-contrast-elements', { count: lowContrastOnPage.length, samples: lowContrastOnPage.slice(0, 15), pathname: window.location.pathname }, 'C');

    const bodyCs = getComputedStyle(document.body);
    sendLog('body-base-styles', {
      bodyColor: bodyCs.color,
      bodyBackground: bodyCs.backgroundColor,
      bodyForegroundVar: getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim(),
      bodyHillVar: getComputedStyle(document.documentElement).getPropertyValue('--hill').trim(),
    }, 'D');

    return () => {
      host.remove();
    };
  }, []);

  return null;
}
