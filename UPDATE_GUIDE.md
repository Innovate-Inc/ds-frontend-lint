# Maintainer Guide: Releasing a New Version

How to change the standards and ship a new version of ds-frontend-lint.

Projects install this package from a **git tag** (`github:Innovate-Inc/ds-frontend-lint#v0.8.0`), not from npm.
So a release is: change the code on a branch, merge it into `main`, then put a version tag on `main`.
Nothing reaches projects until the tag exists.

## The release at a glance

1. **Propose** the change in an issue.
2. **Change** the code on a branch.
3. **Test** the packed package in a real project.
4. **Prepare** the release on the same branch: version, README, CHANGELOG.
5. **Merge** the pull request into `main`.
6. **Tag** `main` with the new version and push the tag.
7. **Tell** projects to update.

## 1. Propose the change

Open an issue that says what should change and why. The team discusses it before anyone writes code.
Small fixes, like a typo, can skip the discussion. They still get an issue.

## 2. Change the code on a branch

Start from an up-to-date `main`:

```bash
git switch main
git pull
git switch -c <short-name-for-the-change>
```

Where things live:

| To change                    | Edit                       |
| ---------------------------- | -------------------------- |
| ESLint rules for every stack | `eslint/internal/core.mjs` |
| ESLint rules for one stack   | `eslint/<stack>.mjs`       |
| Prettier settings            | `prettier/index.json`      |
| Files projects copy          | `templates/`               |
| What `verify:ds` checks      | `bin/cli.mjs`              |
| Rule explanations            | `guides/RULES.md`          |

Keep in mind:

- **JS and TS must lint the same.** If you change a rule for one, change it for the other. See
  [guides/RULES.md](guides/RULES.md).
- **Every rule change goes in `guides/RULES.md`**, with the reason.
- **Template changes make work for every project.** `verify:ds` fails in each project until it copies the new file.
  Only change a template when you need to.
- **Never touch `eslint.overrides.mjs` in projects.** It belongs to them. Change only its template.

## 3. Test in a real project

Test the change the way projects will get it: as a packed package.

```bash
# in ds-frontend-lint: build the package file
npm pack

# in a project that uses ds-frontend-lint: install that file
npm install --save-dev /path/to/ds-frontend-lint/innovate-ds-frontend-lint-<version>.tgz
```

`npm pack` builds the same file npm downloads from GitHub, so the test matches real use.
Don't use `npm install ../ds-frontend-lint`. It creates a symlink, and the package can't find ESLint or its plugins.

In the project, check:

```bash
npm run verify:ds   # setup passes, or fails exactly where the CHANGELOG will say it should
npm run lint        # the new rules report what you expect, and nothing else
npm run fix         # auto-fixes work
```

- Test every stack the change touches. A change to `core.mjs` or `bin/cli.mjs` touches all three: `angular`, `react`
  and `base`.
- If you changed a template, copy the new file into the project first, then run `verify:ds`.
- When you're done, put the project back: `git checkout -- . && npm install`.

## 4. Prepare the release

Do this on the same branch, so the release is reviewed with the change.

**Pick the version.** Until v1.0.0, bump the middle number for every release: `0.8.0` → `0.9.0`.

**Update these files:**

1. `package.json`: set `"version"` to the new version.
2. `README.md`: change every `#v<old>` in the install commands to `#v<new>`. There are three. Search for `#v0.`.
3. `CHANGELOG.md`: add the new version at the top. List what changed, in plain words. **List every step projects must
   take by hand** (copy a file, add a script) in bold, and say whether `verify:ds` fails until they do it.

Commit and push the branch, then open a pull request into `main`.

## 5. Merge the pull request

"Merge" means merging your branch's pull request into `main` on GitHub.

- The pull request needs one approving review. `main` is protected, so GitHub won't let you merge without it.
- Merge it on GitHub. Then delete the branch.

After the merge, `main` has the change, but projects still can't get it. That needs a tag.

## 6. Tag the release

Tag the merge commit on `main`. The tag must match `"version"` in `package.json`, with a `v` in front.

```bash
git switch main
git pull
grep '"version"' package.json   # check: it shows the version you are about to tag
git tag v0.9.0
git push origin v0.9.0
```

Then check that it worked. In a project:

```bash
npm install --save-dev github:Innovate-Inc/ds-frontend-lint#v0.9.0
npm run verify:ds
```

**Never move or delete a tag.** Projects depend on tags staying the same. If a release has a bug, fix it and release a
new version.

## 7. Tell projects

Let project teams know the version is out, with a link to its CHANGELOG entry. They update by following
"Update an existing frontend project" in the [README](README.md).

## Security

Every project runs this code during lint. Anyone can read this repo, but only the team can change it.
Treat write access as sensitive.

- Protect `main`: require a pull request and one review.
- Protect tags `v*` with a GitHub ruleset so they can't be moved or deleted.
- Keep the list of people with write access short.
- No `install`, `postinstall` or `prepare` scripts in `package.json`. Reject any PR that adds one.
- No secrets, internal URLs or project names in this repo. It's public.
