---
name: jvm-react-btree-migration-design
description: Design specification for migrating Java & JVM presentation to React + Vite with B-Trees expansion and 15-slide order.
metadata:
  type: project
---

# Design Specification: Java & JVM Presentation — React + Vite Migration & B-Trees Expansion

## 1. Overview & Objectives
Migrate the existing vanilla HTML/JS presentation (`/home/agasthya/Downloads/JVM_PPT/index.html`) to a robust React 18 + Vite application while preserving:
- The exact visual identity (dark technology-keynote aesthetic, glassmorphism, backdrop blur, radial gradients, ambient particle space, matrix rain).
- All 11 existing Java & JVM slides (Title, Features, How Java Runs, JVM Architecture, Components Overview, Class Loader, Memory Components, JIT Compiler, Garbage Collection, Platform Independence, Live JVM Execution simulation).
- The deterministic 12-phase Live JVM Execution simulation.
- 16:9 stage scaling (`1920×1080` reference canvas), keyboard navigation (`→`/`Space`/`PageDown`, `←`/`PageUp`, `F` fullscreen).

Add a rigorous 3-slide B-Trees expansion (minimum degree $t=2$ invariants, no code/pseudocode, interactive SVG step-by-step visualizations) placed immediately after Live JVM Execution and before Thank You, resulting in exactly **15 slides**.

## 2. Technical Stack & Architecture
- **Framework**: React 18 with Vite.
- **Styling**: Modular CSS + CSS Variables mirroring original palette (`#030305` bg, cyan `#06b6d4`, emerald `#10b981`, amber `#f59e0b`, purple `#a855f7`, rose `#f43f5e`).
- **Animations & Graphics**: GSAP 3 (for Live JVM execution timeline and transitions), Three.js (ambient particle space & wireframe meshes), Canvas (matrix rain), SVG (B-Tree diagrams).

## 3. Slide Deck Structure (15 Slides Total)
1. Java — The Language & the Runtime (Title & Author Metadata)
2. Java Features (10 foundation cards)
3. How Java Runs (Compilation pipeline & packet flow)
4. JVM Architecture (Class Loader, Runtime Data Areas, Execution Engine)
5. JVM Components Overview (Theory)
6. Class Loader (Loading, Linking, Initialization)
7. JVM Memory Components (Method Area, Heap, Stack, PC Register, Native Stack)
8. JIT Compiler (Interpreter + Runtime compilation)
9. Garbage Collection (Reachability graph & interactive GC scanner)
10. Platform Independence (WORA & multi-OS JVM mapping)
11. Live JVM Execution (12-phase deterministic simulation)
12. B-Trees: Understanding the Data Structure ($t=2$ invariants, properties, balanced multiway search, database index purpose)
13. B-Trees: Insertion and Node Splitting (Interactive step-by-step visual demonstration with top-down / split-on-full child strategy preserving invariants)
14. B-Trees: Deletion and Other Operations (Search, leaf removal, internal replacement, underflow borrowing & merging)
15. Thank You (Closing slide)

## 4. B-Tree Mathematical Invariants ($t \ge 2$)
- Minimum degree $t = 2$ (maximum keys = $2t-1 = 3$, maximum children = $2t = 4$).
- Every non-root node has at least $t-1 = 1$ key and at least $t = 2$ children (if internal).
- Root must have at least 2 children if not a leaf, and at least 1 key (unless empty root).
- All leaves at identical depth.
- Validated insertion with top-down splitting of full children during descent.
- Validated deletion with borrowing and merging.
