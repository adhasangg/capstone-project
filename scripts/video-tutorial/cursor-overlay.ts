import type { Locator, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface TelemetryPoint {
  timeMs: number;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'click' | 'highlight' | 'zoom' | 'type';
}

export class VideoCursorRecorder {
  private telemetry: TelemetryPoint[] = [];
  private startTime: number = Date.now();

  constructor(private outputDir: string) {}

  resetClock() {
    this.startTime = Date.now();
    this.telemetry = [];
  }

  getCurrentTimeMs(): number {
    return Date.now() - this.startTime;
  }

  async setupPageCursor(page: Page) {
    await page.addInitScript(() => {
      const injectCursorElements = () => {
        if (document.getElementById('virtual-mouse-cursor')) return;

        const cursor = document.createElement('div');
        cursor.id = 'virtual-mouse-cursor';
        cursor.innerHTML = `
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.4));">
            <path d="M4 2L11 20L14 13L21 10L4 2Z" fill="#1E293B" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        `;
        cursor.style.position = 'fixed';
        cursor.style.top = '0px';
        cursor.style.left = '0px';
        cursor.style.pointerEvents = 'none';
        cursor.style.zIndex = '999999';
        cursor.style.transform = 'translate3d(960px, 540px, 0)';
        cursor.style.transition = 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)';
        document.documentElement.appendChild(cursor);

        const rippleContainer = document.createElement('div');
        rippleContainer.id = 'virtual-click-ripple-container';
        rippleContainer.style.position = 'fixed';
        rippleContainer.style.top = '0px';
        rippleContainer.style.left = '0px';
        rippleContainer.style.pointerEvents = 'none';
        rippleContainer.style.zIndex = '999998';
        document.documentElement.appendChild(rippleContainer);

        (window as any).__showClickRipple = (x: number, y: number) => {
          const ring = document.createElement('div');
          ring.style.position = 'absolute';
          ring.style.left = `${x - 20}px`;
          ring.style.top = `${y - 20}px`;
          ring.style.width = '40px';
          ring.style.height = '40px';
          ring.style.borderRadius = '50%';
          ring.style.border = '3px solid #4A7C59';
          ring.style.backgroundColor = 'rgba(74, 124, 89, 0.28)';
          ring.style.boxShadow = '0 0 14px rgba(74, 124, 89, 0.7)';
          ring.style.animation = 'clickRippleAnim 0.45s ease-out forwards';
          rippleContainer.appendChild(ring);

          setTimeout(() => ring.remove(), 500);
        };

        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes clickRippleAnim {
            0% { transform: scale(0.4); opacity: 1; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectCursorElements);
      } else {
        injectCursorElements();
      }
    });
  }

  async hover(page: Page, locator: Locator, label: string, dwellMs: number = 500) {
    try {
      await locator.scrollIntoViewIfNeeded().catch(() => {});
      const box = await locator.boundingBox().catch(() => null);
      if (box) {
        const targetX = Math.round(box.x + box.width / 2);
        const targetY = Math.round(box.y + box.height / 2);

        await page.evaluate(
          ({ x, y }) => {
            const cursor = document.getElementById('virtual-mouse-cursor');
            if (cursor) cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          },
          { x: targetX, y: targetY },
        ).catch(() => {});

        this.telemetry.push({
          timeMs: this.getCurrentTimeMs(),
          label: `Hover ${label}`,
          x: targetX,
          y: targetY,
          width: Math.round(box.width),
          height: Math.round(box.height),
          type: 'highlight',
        });
      }
      await page.waitForTimeout(dwellMs);
    } catch {
      // Ignore hover failure
    }
  }

  async moveAndClick(page: Page, locator: Locator, label: string, delayAfterMs: number = 600) {
    await locator.scrollIntoViewIfNeeded().catch(() => {});
    const box = await locator.boundingBox().catch(() => null);
    if (!box) {
      await locator.click({ force: true });
      if (delayAfterMs > 0) await page.waitForTimeout(delayAfterMs);
      return;
    }

    const targetX = Math.round(box.x + box.width / 2);
    const targetY = Math.round(box.y + box.height / 2);

    this.telemetry.push({
      timeMs: this.getCurrentTimeMs(),
      label,
      x: targetX,
      y: targetY,
      width: Math.round(box.width),
      height: Math.round(box.height),
      type: 'click',
    });

    await page.evaluate(
      ({ x, y }) => {
        const cursor = document.getElementById('virtual-mouse-cursor');
        if (cursor) cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      },
      { x: targetX, y: targetY },
    ).catch(() => {});

    await page.waitForTimeout(240);

    await page.evaluate(
      ({ x, y }) => {
        if ((window as any).__showClickRipple) {
          (window as any).__showClickRipple(x, y);
        }
      },
      { x: targetX, y: targetY },
    ).catch(() => {});

    await locator.click({ force: true });

    if (delayAfterMs > 0) {
      await page.waitForTimeout(delayAfterMs);
    }
  }

  async moveAndType(page: Page, locator: Locator, text: string, label: string, delayBetweenCharsMs: number = 30) {
    await this.moveAndClick(page, locator, `Focus ${label}`, 150);

    this.telemetry.push({
      timeMs: this.getCurrentTimeMs(),
      label: `Type ${label}`,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      type: 'type',
    });

    await locator.pressSequentially(text, { delay: delayBetweenCharsMs });
    await page.waitForTimeout(250);
  }

  saveTelemetry(filename: string = 'telemetry.json') {
    fs.mkdirSync(this.outputDir, { recursive: true });
    const fullPath = path.join(this.outputDir, filename);
    fs.writeFileSync(fullPath, JSON.stringify(this.telemetry, null, 2), 'utf-8');
    return fullPath;
  }
}
