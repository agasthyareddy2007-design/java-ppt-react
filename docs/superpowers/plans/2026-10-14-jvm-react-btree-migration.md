# Java & JVM Presentation — React + Vite Migration & B-Trees Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the existing 12-slide Java & JVM presentation to a high-performance React 18 + Vite application and expand it with a rigorous 3-slide B-Trees section, resulting in an exact 15-slide deck with full interactive parity.

**Architecture:** A modular React 18 application with a central `Deck` controller managing 16:9 stage scaling and keyboard navigation, Three.js ambient particles/meshes, Matrix rain canvas, GSAP 3 animation timelines, a deterministic 12-phase Live JVM Execution simulation, and mathematically validated SVG B-Tree visualizations ($t=2$ minimum-degree convention).

**Tech Stack:** React 18, Vite, GSAP 3, Three.js, SVG, CSS Modules / CSS Variables.

**Spec:** `docs/superpowers/specs/2026-10-14-jvm-react-btree-design.md`

## Global Constraints
- Absolute deployment restriction: Localhost development only. No GitHub repository, no remote push, no Vercel deployment.
- Exactly 15 slides in specified order: Slides 1-11 (Existing Java & JVM), Slides 12-14 (B-Trees: Understanding, Insertion, Deletion), Slide 15 (Thank You).
- Fixed 16:9 stage model: 1920×1080 canvas scaled uniformly to fit viewport with letterbox/pillarbox.
- B-Tree mathematical invariants: Minimum degree $t=2$, maximum keys $2t-1=3$, maximum children $2t=4$, non-root minimum keys $t-1=1$, non-leaf root minimum 2 children.
- No code or pseudocode on B-Tree slides.
- Recoverable backup maintained at `/home/agasthya/Downloads/JVM_PPT_backup`.

## Review Focus
- Live JVM Execution simulation reset and timeline cleanup when navigating away and back.
- Fullscreen toggle via `F` key and Escape behavior without interfering with input elements.
- B-Tree step-by-step state machine: Next, Previous, and Reset controls maintaining valid tree invariants at every step.
- Scalable SVG rendering and label readability across 16:9 and ultrawide aspect ratios.
- Total slide count indicator displaying `XX / 15` accurately.

---

### Task 1: Scaffolding Vite + React Project & Dependencies
**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`

- [ ] **Step 1: Create package.json with React 18, Vite, Three.js, and GSAP**
- [ ] **Step 2: Create vite.config.js**
- [ ] **Step 3: Create index.html pointing to src/main.jsx**
- [ ] **Step 4: Create src/main.jsx entrypoint**
- [ ] **Step 5: Run npm install and verify setup**

---

### Task 2: Core Styling, 16:9 Stage Scaling, and Deck Controller
**Files:**
- Create: `src/styles/presentation.css`
- Create: `src/components/Deck.jsx`
- Create: `src/components/Chrome.jsx`

- [ ] **Step 1: Write presentation.css with custom properties, glassmorphism, and viewport-base 16:9 scaling**
- [ ] **Step 2: Implement Chrome.jsx with branding and dynamic page indicator (01 / 15)**
- [ ] **Step 3: Implement Deck.jsx with uniform stage scaling and keyboard navigation (ArrowRight, Space, ArrowLeft, F for fullscreen)**

---

### Task 3: Background Atmospherics (Three.js & Matrix Canvas)
**Files:**
- Create: `src/components/AmbientBackground.jsx`

- [ ] **Step 1: Implement Matrix rain canvas stream with bytecode hex tokens**
- [ ] **Step 2: Implement Three.js particle space (2000 particles) with camera sway and wireframe geometric meshes (Icosahedron, Dodecahedron, Torus)**
- [ ] **Step 3: Connect slide transitions to Three.js camera rotation and mesh positions**

---

### Task 4: Java Foundations Slides (Slides 1 to 5)
**Files:**
- Create: `src/slides/Slide01Title.jsx`
- Create: `src/slides/Slide02Features.jsx`
- Create: `src/slides/Slide03HowJavaRuns.jsx`
- Create: `src/slides/Slide04Architecture.jsx`
- Create: `src/slides/Slide05Overview.jsx`

- [ ] **Step 1: Implement Slide 1 (Title and Author metadata: K. Agasthya Reddy | 25B81A6768 | CSD-B)**
- [ ] **Step 2: Implement Slide 2 (10 Core Java Features in glowing responsive grid)**
- [ ] **Step 3: Implement Slide 3 (How Java Runs with animated packet flow)**
- [ ] **Step 4: Implement Slide 4 (JVM Architecture Blueprint)**
- [ ] **Step 5: Implement Slide 5 (JVM Components Overview Theory)**

---

### Task 5: Deep-Dive JVM Subsystems Slides (Slides 6 to 10)
**Files:**
- Create: `src/slides/Slide06ClassLoader.jsx`
- Create: `src/slides/Slide07MemoryComponents.jsx`
- Create: `src/slides/Slide08JITCompiler.jsx`
- Create: `src/slides/Slide09GarbageCollection.jsx`
- Create: `src/slides/Slide10PlatformIndependence.jsx`

- [ ] **Step 1: Implement Slide 6 (Class Loader Loading, Linking, Initialization with animated flow)**
- [ ] **Step 2: Implement Slide 7 (Method Area, Heap, Stack, PC Register, Native Stack)**
- [ ] **Step 3: Implement Slide 8 (JIT Compiler flow & runtime optimization)**
- [ ] **Step 4: Implement Slide 9 (Garbage Collection reachability graph & scanner ring animation)**
- [ ] **Step 5: Implement Slide 10 (Platform Independence multi-OS bytecode mapping)**

---

### Task 6: Live JVM Execution Simulation (Slide 11)
**Files:**
- Create: `src/slides/Slide11LiveJVMExecution.jsx`
- Create: `src/simulations/jvmExecutionTimeline.js`

- [ ] **Step 1: Build the 3-column layout (Source Debugger, JVM Runtime Memory, Stdout Console)**
- [ ] **Step 2: Implement deterministic 12-phase GSAP timeline (Class Loading, Static Init, main Frame, Heap Demo Object, Reference Binding, Local Vars x, y, calculate() Frame, Calculation, Return & Pop, Native Sysout, Completion)**
- [ ] **Step 3: Implement clean reset and destruction logic when navigating into and out of Slide 11**

---

### Task 7: B-Trees — Understanding the Data Structure (Slide 12)
**Files:**
- Create: `src/slides/Slide12BTreeUnderstanding.jsx`
- Create: `src/components/BTreeSVG.jsx`

- [ ] **Step 1: Implement theoretical content explaining multiway search, sorted key ranges, leaf depth, and database indexing purpose**
- [ ] **Step 2: Define and display minimum-degree $t=2$ invariants explicitly**
- [ ] **Step 3: Create crisp, scalable SVG B-Tree diagram showing root, internal nodes, leaves, key ranges, and child pointers with interactive node inspection**
- [ ] **Step 4: Display $O(\log n)$ search, insert, and delete complexity**

---

### Task 8: B-Trees — Insertion and Node Splitting (Slide 13)
**Files:**
- Create: `src/slides/Slide13BTreeInsertion.jsx`

- [ ] **Step 1: Define mathematically valid insertion sequence with $t=2$ invariants**
- [ ] **Step 2: Implement step-by-step state machine (Steps 0 to 5) with Previous, Next, and Reset buttons**
- [ ] **Step 3: Visually illustrate search path, leaf insertion, overflow detection, median promotion, node split, and new root creation**
- [ ] **Step 4: Add clear step explanation text and highlighted nodes/keys for each step**

---

### Task 9: B-Trees — Deletion and Other Operations (Slide 14)
**Files:**
- Create: `src/slides/Slide14BTreeDeletion.jsx`

- [ ] **Step 1: Implement visual sections for Search, Leaf Deletion, Internal Node Deletion (predecessor/successor replacement), and Underflow Rebalancing (borrowing vs. merging)**
- [ ] **Step 2: Implement interactive step controller demonstrating leaf deletion, borrowing from sibling, and merging with separator key**
- [ ] **Step 3: Summarize sorted traversal and storage system usage**

---

### Task 10: Closing Slide (Slide 15) & Assembly in App.jsx
**Files:**
- Create: `src/slides/Slide15ThankYou.jsx`
- Create: `src/App.jsx`

- [ ] **Step 1: Implement Slide 15 (Cinematic Thank You)**
- [ ] **Step 2: Assemble all 15 slides in order inside Deck.jsx and App.jsx**
- [ ] **Step 3: Verify slide count (01 / 15) and navigation bounds**

---

### Task 11: Local Verification & Testing
**Files:**
- Test: Local browser verification on localhost

- [ ] **Step 1: Start Vite dev server locally**
- [ ] **Step 2: Verify all 15 slides in exact sequence**
- [ ] **Step 3: Verify keyboard navigation and fullscreen toggle (F key)**
- [ ] **Step 4: Verify Live JVM Execution simulation executes cleanly and resets**
- [ ] **Step 5: Verify B-Tree step-by-step interactive controllers on Slides 13 and 14**
- [ ] **Step 6: Confirm zero deployment or git remote actions taken**
