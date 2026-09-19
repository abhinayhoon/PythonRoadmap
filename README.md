# Python Roadmap

An interactive 30-day Python learning roadmap for beginners. It pairs concise explanations with runnable-style examples, small exercises, search, and local progress tracking.

**Live site:** https://abhinayhoon.github.io/PythonRoadmap/

## Why this exists

Starting with Python can feel fragmented: syntax, projects, tooling, and APIs are often taught as unrelated topics. This site organizes those foundations into a self-paced path and explains the reasoning behind the code.

## Features

- 30 guided lessons from first programs through a capstone idea
- Searchable concepts and code examples
- Browser-local progress tracking
- Responsive layout and keyboard-friendly navigation
- Optional AI helper UI (see the security note below)

## Run locally

This is a static site with no build step.

```bash
git clone https://github.com/abhinayhoon/PythonRoadmap.git
cd PythonRoadmap
python -m http.server 8000
```

Open `http://localhost:8000` in a browser.

## Project structure

```text
.
├── index.html   # curriculum content and page structure
├── style.css    # responsive visual design
└── script.js    # interactions, progress state, and helper UI
```

## Technology

HTML, CSS, and vanilla JavaScript. Progress is stored locally in the browser, so no account or backend is required.

## Security note for the AI helper

The site contains a Gemini API-key placeholder for local experimentation. Never place a real API key in browser JavaScript, a Git commit, or a static-site environment variable: visitors can retrieve it. A production AI feature should call a small server-side endpoint that keeps the provider credential in a secret manager and applies rate limits.

## Roadmap

- [ ] Move lesson content into structured data for easier review
- [ ] Add automated accessibility and HTML validation
- [ ] Add a server-side, rate-limited AI-helper integration if the feature is continued
- [ ] Invite corrections through issues after adding contribution guidance

## Contributing

Corrections to examples and beginner-friendly explanations are welcome. Open an issue describing the lesson, expected behavior or wording, and a proposed improvement.

## License

This project is available under the [MIT License](LICENSE).
