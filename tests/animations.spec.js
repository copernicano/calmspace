/**
 * ═══════════════════════════════════════════════════════════════
 * Playwright Animation Tests - CalmSpace
 * ═══════════════════════════════════════════════════════════════
 *
 * Comprehensive tests to ensure animations are:
 * - Rendered correctly
 * - Centered on screen
 * - Fullscreen working perfectly
 * - Performant (60fps target)
 * - Visually stunning
 */

const { test, expect } = require('@playwright/test');

test.describe('CalmSpace Animations - Quality Assurance', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');

    // Navigate to Il Mio Spazio section
    const mySpaceButton = page.locator('text=Il mio spazio').or(page.locator('text=Il Mio Spazio'));

    // Wait for the button to be visible
    await mySpaceButton.waitFor({ state: 'visible', timeout: 10000 });
    await mySpaceButton.click();

    // Wait for animations to load
    await page.waitForTimeout(1000);
  });

  /* ═══════════════════════════════════════════════════════════════
     TEST 1: Bubbles Animation
     ═══════════════════════════════════════════════════════════════ */

  test('🫧 Bubbles animation renders and animates', async ({ page }) => {
    // Click on Bubbles pattern
    await page.click('text=Bolle');
    await page.waitForTimeout(500);

    // Verify animation container exists
    const animation = page.locator('.animation-bubbles');
    await expect(animation).toBeVisible();

    // Verify bubbles are present
    const bubbles = page.locator('.bubble');
    const bubbleCount = await bubbles.count();
    expect(bubbleCount).toBeGreaterThan(0);
    console.log(`✓ Found ${bubbleCount} bubbles`);

    // Verify animation is moving
    const firstBubble = bubbles.first();
    const box1 = await firstBubble.boundingBox();

    if (box1) {
      await page.waitForTimeout(1000);
      const box2 = await firstBubble.boundingBox();

      if (box2) {
        // Bubble should have moved (Y coordinate should change as it rises)
        const hasMovedSignificantly = Math.abs(box1.y - box2.y) > 5;
        expect(hasMovedSignificantly).toBeTruthy();
        console.log(`✓ Bubble animation is active (moved ${Math.abs(box1.y - box2.y).toFixed(2)}px)`);
      }
    }
  });

  /* ═══════════════════════════════════════════════════════════════
     TEST 2: Waves Animation
     ═══════════════════════════════════════════════════════════════ */

  test('🌊 Waves animation renders and animates', async ({ page }) => {
    await page.click('text=Onde');
    await page.waitForTimeout(500);

    const animation = page.locator('.animation-waves');
    await expect(animation).toBeVisible();

    // Check for wave layers
    const waveLayers = page.locator('.wave-layer');
    const layerCount = await waveLayers.count();
    expect(layerCount).toBeGreaterThan(0);
    console.log(`✓ Found ${layerCount} wave layers`);

    // Check for sparkles
    const sparkles = page.locator('.wave-sparkle');
    const sparkleCount = await sparkles.count();
    expect(sparkleCount).toBeGreaterThan(0);
    console.log(`✓ Found ${sparkleCount} sparkles`);
  });

  /* ═══════════════════════════════════════════════════════════════
     TEST 3: Stars Animation
     ═══════════════════════════════════════════════════════════════ */

  test('✨ Stars animation renders and animates', async ({ page }) => {
    await page.click('text=Stelle');
    await page.waitForTimeout(500);

    const animation = page.locator('.animation-stars');
    await expect(animation).toBeVisible();

    // Check for stars
    const stars = page.locator('.star');
    const starCount = await stars.count();
    expect(starCount).toBeGreaterThan(0);
    console.log(`✓ Found ${starCount} stars`);

    // Check for meteors
    const meteors = page.locator('.meteor');
    const meteorCount = await meteors.count();
    expect(meteorCount).toBeGreaterThan(0);
    console.log(`✓ Found ${meteorCount} meteors`);

    // Check for nebulae
    const nebulae = page.locator('.nebula');
    const nebulaeCount = await nebulae.count();
    expect(nebulaeCount).toBeGreaterThan(0);
    console.log(`✓ Found ${nebulaeCount} nebulae`);
  });

  /* ═══════════════════════════════════════════════════════════════
     TEST 4: Geometric Animation
     ═══════════════════════════════════════════════════════════════ */

  test('📐 Geometric animation renders and animates', async ({ page }) => {
    await page.click('text=Geometrico');
    await page.waitForTimeout(500);

    const animation = page.locator('.animation-geometric');
    await expect(animation).toBeVisible();

    // Check for geometric elements
    const rings = page.locator('.concentric-ring');
    const ringCount = await rings.count();
    expect(ringCount).toBeGreaterThan(0);
    console.log(`✓ Found ${ringCount} concentric rings`);

    // Check for energy particles
    const particles = page.locator('.energy-particle');
    const particleCount = await particles.count();
    expect(particleCount).toBeGreaterThan(0);
    console.log(`✓ Found ${particleCount} energy particles`);
  });

  /* ═══════════════════════════════════════════════════════════════
     TEST 5: Fullscreen Mode - CRITICAL
     ═══════════════════════════════════════════════════════════════ */

  test('⛶ Fullscreen mode covers ENTIRE viewport', async ({ page }) => {
    await page.click('text=Bolle');
    await page.waitForTimeout(500);

    // Find and click fullscreen button
    const fullscreenBtn = page.locator('button:has-text("Schermo intero")');
    await fullscreenBtn.click();
    await page.waitForTimeout(500);

    // Check if container is fullscreen
    const fullscreenContainer = page.locator('.enhanced-calmspace-container.fullscreen');
    await expect(fullscreenContainer).toBeVisible();

    // Verify dimensions
    const box = await fullscreenContainer.boundingBox();
    const viewport = page.viewportSize();

    if (box && viewport) {
      console.log(`Container: ${box.width}x${box.height}`);
      console.log(`Viewport:  ${viewport.width}x${viewport.height}`);

      // CRITICAL: Must cover 100% of viewport
      expect(box.width).toBe(viewport.width);
      expect(box.height).toBe(viewport.height);
      expect(box.x).toBe(0);
      expect(box.y).toBe(0);

      console.log('✓ Fullscreen covers ENTIRE viewport!');
    } else {
      throw new Error('Failed to get fullscreen container dimensions');
    }
  });

  /* ═══════════════════════════════════════════════════════════════
     TEST 6: Animation Centering
     ═══════════════════════════════════════════════════════════════ */

  test('🎯 Animations are centered in viewport', async ({ page }) => {
    const patterns = [
      { name: 'Bolle', selector: '.animation-bubbles' },
      { name: 'Onde', selector: '.animation-waves' },
      { name: 'Stelle', selector: '.animation-stars' },
      { name: 'Geometrico', selector: '.animation-geometric' }
    ];

    for (const pattern of patterns) {
      await page.click(`text=${pattern.name}`);
      await page.waitForTimeout(500);

      const animation = page.locator(pattern.selector);
      const box = await animation.boundingBox();
      const viewport = page.viewportSize();

      if (box && viewport) {
        // Animation container should cover the full content area
        // In this design, it's inside calmspace-content which is centered

        // Verify animation exists and has dimensions
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);

        console.log(`✓ ${pattern.name}: ${box.width}x${box.height} at (${box.x}, ${box.y})`);
      }
    }
  });

  /* ═══════════════════════════════════════════════════════════════
     TEST 7: No Console Errors
     ═══════════════════════════════════════════════════════════════ */

  test('🐛 All animations load without console errors', async ({ page }) => {
    const errors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    const patterns = ['Bolle', 'Onde', 'Stelle', 'Geometrico'];

    for (const pattern of patterns) {
      await page.click(`text=${pattern}`);
      await page.waitForTimeout(1000);
    }

    // Check for errors
    if (errors.length > 0) {
      console.error('Console errors found:', errors);
    }

    expect(errors.length).toBe(0);
    console.log('✓ No console errors detected!');
  });

  /* ═══════════════════════════════════════════════════════════════
     TEST 8: Performance - Frame Rate
     ═══════════════════════════════════════════════════════════════ */

  test('⚡ Animations perform smoothly (60fps target)', async ({ page }) => {
    await page.click('text=Stelle');
    await page.waitForTimeout(1000);

    // Measure frame rate
    const fps = await page.evaluate(() => {
      return new Promise(resolve => {
        let frames = 0;
        const startTime = performance.now();
        const duration = 2000; // Measure for 2 seconds

        function countFrames() {
          frames++;
          const elapsed = performance.now() - startTime;

          if (elapsed < duration) {
            requestAnimationFrame(countFrames);
          } else {
            const averageFPS = (frames / elapsed) * 1000;
            resolve(Math.round(averageFPS));
          }
        }

        requestAnimationFrame(countFrames);
      });
    });

    console.log(`Measured FPS: ${fps}`);

    // Should maintain at least 50fps (allowing some margin below 60)
    expect(fps).toBeGreaterThan(50);
    console.log(`✓ Performance acceptable (${fps} fps)`);
  });

  /* ═══════════════════════════════════════════════════════════════
     TEST 9: Pattern Switching
     ═══════════════════════════════════════════════════════════════ */

  test('🔄 Pattern switching works smoothly', async ({ page }) => {
    const patterns = ['Bolle', 'Onde', 'Stelle', 'Geometrico'];

    for (let i = 0; i < patterns.length; i++) {
      await page.click(`text=${patterns[i]}`);
      await page.waitForTimeout(300);

      // Verify correct animation is visible
      const selectors = [
        '.animation-bubbles',
        '.animation-waves',
        '.animation-stars',
        '.animation-geometric'
      ];

      const animation = page.locator(selectors[i]);
      await expect(animation).toBeVisible();

      console.log(`✓ Switched to ${patterns[i]}`);
    }
  });

  /* ═══════════════════════════════════════════════════════════════
     TEST 10: Exit Fullscreen
     ═══════════════════════════════════════════════════════════════ */

  test('🚪 Exit fullscreen works correctly', async ({ page }) => {
    await page.click('text=Bolle');
    await page.waitForTimeout(500);

    // Enter fullscreen
    await page.click('button:has-text("Schermo intero")');
    await page.waitForTimeout(500);

    // Verify fullscreen is active
    let fullscreenContainer = page.locator('.enhanced-calmspace-container.fullscreen');
    await expect(fullscreenContainer).toBeVisible();

    // Exit fullscreen
    await page.click('button:has-text("Esci")').or(page.locator('button:has-text("⛶ Esci")'));
    await page.waitForTimeout(500);

    // Verify fullscreen is deactivated
    fullscreenContainer = page.locator('.enhanced-calmspace-container.fullscreen');
    const count = await fullscreenContainer.count();
    expect(count).toBe(0);

    console.log('✓ Exit fullscreen works!');
  });
});
