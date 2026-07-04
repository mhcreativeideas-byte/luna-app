# Design System Documentation: Clinical Elegance & Organic Vitality

## 1. Overview & Creative North Star
This design system is built upon the North Star of **"The Scientific Editorial."** It is a visual manifesto that rejects the friendly, rounded "app-like" conventions of the last decade in favor of a sophisticated juxtaposition: the cold, exacting precision of a laboratory and the warm, visceral reality of human biology.

By combining sharp, 0px radiuses with high-contrast serif typography and macro photography, we create an experience that feels curated, not generated. We break the rigid, centered grid by utilizing intentional asymmetry and generous white space, allowing the "chemistry of the cycle" to breathe. This is high-end digital curation for the modern era.

---

## 2. Color Palette & Tonal Theory
Our color strategy relies on a "Clinical Foundation" (creams and whites) interrupted by "Vitality Bursts" (blood orange and amber).

### Primary Energy
- **Primary (`#ab3600`) & Primary Container (`#ff5f1f`):** These represent the "Glow." Use these sparingly for high-impact CTAs and energy-focused data points.
- **Secondary (`#006687`):** Use for technical balance and calm, sky-like transitions.

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined through:
1.  **Tonal Shifts:** Placing a `surface-container-low` (`#f5f3ef`) section against a `background` (`#fbf9f5`).
2.  **Edge-to-Edge Imagery:** Using saturated photography blocks to define the end of a layout section.

### Glass & Gradient Execution
To achieve "Laboratory Chic," use Glassmorphism for floating elements (modals, navigation overlays). Use a semi-transparent `surface` color with a `backdrop-blur` of 20px. 
**Signature Polish:** Apply subtle linear gradients from `primary` to `primary_container` on interactive elements to give them a "lit from within" quality.

---

## 3. Typography: The Editorial Voice
The typography is a dialogue between the "Human" (Serif) and the "Technical" (Sans-Serif).

- **Display & Headlines (Noto Serif):** These are our "Magazine" moments. Use `display-lg` (3.5rem) with tight letter-spacing for high-impact statements. The high contrast of Noto Serif conveys authority and sophistication.
- **Title & Body (Inter):** Inter provides the functional clarity required for health data. It is the "Scientific" voice that grounds the editorial flourishes.
- **Labels (Space Grotesk):** For technical data, timestamps, and "laboratory" notes, use Space Grotesk. Its monospaced feel adds a layer of clinical precision to the UI.

---

## 4. Elevation & Depth: Tonal Layering
We move away from traditional drop shadows, which feel "software-heavy." Instead, we use **Tonal Layering.**

- **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` (#ffffff) card on top of a `surface-container` (#efeeea) background. This creates a natural, soft lift.
- **Ambient Shadows:** When an element must float (e.g., a glassmorphic menu), use a shadow with a 40px–60px blur and only 4% opacity, using the `on-surface` color. It should feel like an ambient light cast, not a digital effect.
- **The "Ghost Border":** For technical containment (like input fields), use a 0.5px line using the `outline-variant` (`#e3bfb3`) at 20% opacity. This mimics the thin glass of a test tube.

---

## 5. Components & UI Patterns

### Buttons
- **Shape:** Strictly 0px (Sharp edges).
- **Primary:** `primary` background with `on-primary` text. No border.
- **Secondary:** Transparent background with a 0.5px `outline` and `on-surface` text.
- **States:** On hover, shift from `primary` to `primary_container` to simulate a "glow" increase.

### Glassmorphic Cards
- **Construction:** Background of `surface` at 70% opacity + `backdrop-blur`. 
- **Spacing:** Use `spacing-6` (2rem) for internal padding to maintain the "High-End" feel. 
- **Constraint:** Never use a divider line within a card. Use `spacing-4` (1.4rem) to separate content blocks.

### Photography Blocks
- **Style:** Macro shots of liquids, botanical textures, or skin.
- **Layout:** Use asymmetrical crops. A photo might occupy 60% of the screen width, bleeding off the left edge, while typography sits in the remaining white space on the right.

### Inputs & Data
- **Technical Precision:** Use 0.5px lines for underlines only. Labels should be in `label-sm` (Space Grotesk) to reinforce the scientific aesthetic.
- **Error States:** Use `error` (`#ba1a1a`) for text only. Avoid large red boxes; a subtle 0.5px underline in the error color is sufficient.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace Asymmetry:** Offset your text blocks from your images. Avoid "perfect" center alignment.
- **Use Macro Scale:** If using an image of a leaf or a liquid, zoom in until it becomes a texture.
- **Respect the 0px Radius:** Every corner must be sharp. This is a non-negotiable for the "Scientific" identity.
- **Prioritize White Space:** If a screen feels "busy," double the spacing tokens (e.g., move from `spacing-8` to `spacing-16`).

### Don’t:
- **No Rounded Corners:** Never use `border-radius`. It breaks the laboratory chic aesthetic immediately.
- **No Heavy Dividers:** Avoid 1px solid lines. Let color and space define the hierarchy.
- **No Generic Icons:** Use thin-stroke (0.5px to 1px) technical icons. Avoid "filled" or "bubbly" icon sets.
- **No Flat "App" Grids:** Avoid the standard 3-column card row. Experiment with overlapping elements and varied column widths.