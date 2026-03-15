# Git Setup

This project currently has source files and dependencies, but it is not initialized as a git repository yet.

## What git is

- `git` is a version control system. It records snapshots of your project so you can review changes, make commits, and push the project to GitHub.

## Files added to support git

- `.gitignore`

`.gitignore` tells git which files and folders should not be committed. For this project it excludes generated output such as:

- `node_modules/`
- `dist/`
- `*.tsbuildinfo`
- `.DS_Store`

## First-time local setup

Run these commands from:

- `/Users/nicholasmcdowell/Documents/Codex Projects/Tashara Trade Simulator`

```bash
git init
git add .
git status --short
git commit -m "Initial commit"
```

What each command does:

- `git init`
  - Creates a new local git repository in this folder.
- `git add .`
  - Stages the current files for the next commit.
- `git status --short`
  - Shows a compact list of what is staged before you commit.
- `git commit -m "Initial commit"`
  - Creates the first saved snapshot in git history.

Risk notes:

- `git add .` stages every file not excluded by `.gitignore`, so `git status --short` is the safety check before the commit.

## Connect to GitHub

After you create an empty GitHub repository, connect this local project to it:

```bash
git remote add origin https://github.com/<you>/<repo>.git
git branch -M main
git push -u origin main
```

What each command does:

- `git remote add origin ...`
  - Saves your GitHub repository URL under the conventional remote name `origin`.
- `git branch -M main`
  - Renames the current branch to `main`.
- `git push -u origin main`
  - Uploads the local `main` branch to GitHub and sets it as the default upstream branch.

Risk notes:

- `git remote add origin ...` fails if an `origin` remote already exists.
- `git push -u origin main` publishes the current commit history to GitHub, so check the repo name and visibility before running it.

## GitHub Pages

This project includes a GitHub Pages workflow:

- `.github/workflows/deploy-pages.yml`

After the first push:

1. Open the GitHub repository.
2. Go to `Settings` -> `Pages`.
3. Choose:
   - `Source: GitHub Actions`
4. Push to `main` again if needed, or manually run the workflow from the `Actions` tab.

Important note:

- `vite.config.ts` is configured with `base: "./"` so the app works when served from a GitHub Pages repo path.

## Daily workflow after setup

```bash
git status
git add <files>
git commit -m "Describe the change"
git push
```

What each command does:

- `git status`
  - Shows modified, staged, and untracked files.
- `git add <files>`
  - Stages only the files you want in the next commit.
- `git commit -m "..."`
  - Records a named snapshot.
- `git push`
  - Sends committed changes to GitHub.
