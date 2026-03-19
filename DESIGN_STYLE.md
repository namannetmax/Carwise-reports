# CarWise AI: Design System & Aesthetic

## Style Persona: The Automotive Risk Architect
The design of CarWise AI is defined as **"Technical Editorial"** or **"Architectural Diagnostic."** It is crafted to move beyond generic consumer software, instead evoking the authority of a professional-grade diagnostic tool used by a specialist.

---

## 1. Typography Strategy
The interface uses a deliberate three-font system to balance human authority with mechanical precision.

| Font Family | Usage | Purpose |
| :--- | :--- | :--- |
| **Playfair Display** (Serif) | Primary Headers, Verdicts | Editorial elegance; conveys "expert opinion" and human authority. |
| **JetBrains Mono** (Mono) | Technical Data, Micro-labels | Diagnostic precision; signals "under-the-hood" mechanical analysis. |
| **Inter** (Sans-Serif) | Body Text, General UI | Modern foundation; ensures high legibility for long-form content. |

---

## 2. Color Palette & Contrast
The palette follows a "Diagnostic Dark" theme, prioritizing high-contrast readouts.

- **Base Surfaces:** `Zinc-950` (Deep Charcoal) for high-impact headers; `Zinc-50` (Off-white) for data grids.
- **Accents:** 
  - `Cyan-600`: Optimal Health / Low Risk.
  - `Yellow-500`: Caution / Moderate Risk.
  - `Rose-600`: Critical Failure / High Risk.
  - `Violet-600`: System Primary / Interactive Elements.
- **Borders:** `Zinc-200` for light mode; `Zinc-800` for dark mode. Subtlety is key to maintaining a "crafted" feel.

---

## 3. Layout Principles
The layout is inspired by architectural blueprints and technical service manuals.

- **Visible Grids:** Data is presented in structured matrices and "Deduction Logic" tables. We celebrate the structure of the data rather than hiding it.
- **Glassmorphism:** Use of `backdrop-blur-md` on sticky navigation bars to create depth and a sense of layered information.
- **Bento-Grid Compartmentalization:** Information is grouped into distinct, bordered "cells" to make complex reports scannable.

---

## 4. Kinetic Experience (Micro-Animations)
Animations are used to simulate a "Live System" state.

- **Sequential Initialization:** Ticks and labels appear in sequence (staggered) to mimic a hardware boot-up.
- **Diagnostic Dial:** The reliability score features a rotating "scanning beam" and a counting numerical value to suggest real-time processing.
- **Pulsing Glows:** Subtle, colored background glows indicate the "health" or "severity" of the current diagnostic state.

---

## 5. Component Language
- **Radii:** `rounded-2xl` and `rounded-3xl` for a modern, approachable feel that softens the technical data.
- **Shadows:** Deep, soft shadows (`shadow-2xl`) on primary cards to make them feel like physical diagnostic tablets.
- **Microcopy:** All-caps, tracked-out monospaced text for labels (e.g., `TRACKING-WIDEST`) to reinforce the "instrument" aesthetic.
