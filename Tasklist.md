Mission: High-Performance BMW M5 (G90) Web Experience

Phase 01: Image Sequence Setup (The Hero)

    Asset Management: Access the folder of [Insert Number, e.g., 60] sequential images.

    Rendering: Use a <canvas> element for the image sequence to ensure 60fps performance.

    Scroll Binding: Map the window.scrollY to the image index. As the user scrolls from 0 to 100vh, progress through the sequence frames.

    Appearance: Start at opacity: 0. From scroll 0% to 15%, fade the car to opacity: 1.

Phase 02: Layout & Section Transitions

    Section 01 (Hero): Center the canvas. Overlay the "BMW M5" logo in a fixed position.

    Section 02 (Performance): When the scroll reaches 45%, "Pin" the car sequence. Trigger the appearance of three Glassmorphism cards using the following data:

        Card A: "M TwinPower Turbo V8" | 717 HP

        Card B: "Launch Control" | 0–100 km/h in 3.5s

        Card C: "M xDrive AWD" | 1,000 Nm Torque

    Section 03 (Features): From 75% to 100%, continue the sequence to the final frame. Overlay three interactive hotspots (pulsing white dots) on the car's Grille, Wheels, and Charging Port.

Phase 03: Design & Typography Systems

    Background: Constant #000000 (Pure Black).

    Typography: * Headlines: Inter Tight, Bold, All-Caps.

        Data/Stats: JetBrains Mono or similar Monospace font for a telemetry look.

    Accents: Use #E01E26 (M-Red) for the scroll progress indicator and active hover states.

Technical Constraints:

    Implement Smooth Inertial Scrolling.

    Ensure the image sequence is pre-loaded before the "Hero" text fades in to prevent flickering.

    The site must be fully responsive, scaling the canvas for mobile viewports.