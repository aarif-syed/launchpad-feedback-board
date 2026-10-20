# LaunchPad — Product Feedback Board

A responsive product feedback dashboard built with HTML, CSS, and vanilla JavaScript. It helps a small product team collect requests, prioritize them, and track their status.

## Features

- Dashboard metrics for total, open, in-progress, and completed feedback
- Create feedback with title, description, priority, and status
- Search by title or description
- Filter by priority and status view
- Advance an item's status from Open → In progress → Done
- Browser persistence with `localStorage`
- Responsive layout, accessible labels, keyboard-friendly native dialog, and empty state
- Safe text rendering for user-entered content

## Run locally

No package installation or build step is required.

1. Download or clone this project.
2. Open `index.html` in a modern browser.

For a local development server, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Tech stack

- HTML5
- CSS3 (responsive grid/flexbox, mobile breakpoints)
- JavaScript (DOM events, filtering, state updates, localStorage)

## Engineering notes

- State is stored in one versioned localStorage key (`launchpad-feedback-v1`).
- Rendering is centralized so filters and dashboard metrics stay consistent.
- User-provided text is escaped before being inserted into generated table markup.
- This is a frontend portfolio project; it does not include a hosted backend or multi-user sync.

## Portfolio description

**LaunchPad — Product Feedback Board:** Built a responsive feedback management dashboard with searchable requests, priority/status filters, live summary metrics, and persistent browser storage. Implemented reusable rendering and state-update flows, form validation, safe text rendering, and responsive UI behavior without external dependencies.

## Before sharing

Replace the starter demo data with your own examples if desired. Be ready to explain the implementation and limitations honestly during an interview.
