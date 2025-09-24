# medical chatbot

This repository contains a TypeScript-based medical AI that gives suggestions to users to help prevent minor health issues and recommend seeing a doctor for more serious concerns based on text symptom input.

Overview

- Project name: medical chatbot
- Description: A lightweight chatbot that accepts symptom descriptions and returns suggestions for self-care or recommends consulting a medical professional for serious issues.
- Languages: TypeScript, HTML

Quick start

1. Install dependencies (if applicable):

   npm install

2. Run the project locally:

   npm start

3. Open the website at docs/index.html for the static front page or enable GitHub Pages (see below).

Website (GitHub Pages - private repo)

This repository includes a docs/ folder (docs/index.html) which can be used to publish a simple static site using GitHub Pages. For a private site:
- Keep the repository set to Private (Settings → General → Repository visibility).
- Enable Pages in Settings → Pages and choose the "docs" folder on the main branch as the source.
- GitHub Pages for private repositories can be restricted to repository collaborators depending on your plan.

If you prefer automatic deployment to gh-pages, I can add a GitHub Action workflow instead — tell me if you'd like that.

Replacing previous product name

All public-facing materials in this repository should now use the name "medical chatbot" instead of any previous product name. A helper script replace_name.sh is provided to find and optionally replace occurrences across the repo (dry-run by default).

replace_name.sh

- Dry run: bash replace_name.sh --dry-run
- Apply changes: bash replace_name.sh --apply

If you run --apply, review the created backups (*.bak) and tests, then commit the changes.

License

Add a LICENSE file if you want to open source this project.

Contact

Repository owner: vishnu-2134