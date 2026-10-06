## Change the standards (maintainers)

1. Open an issue with the change and the reason. The team discusses.
2. Make the change on a branch.
3. Test it in a real project before merging:

```bash
# in ds-frontend-lint: build the package file
npm pack

# in the project: install that file
npm install --save-dev /path/to/ds-frontend-lint/innovate-ds-frontend-lint-<version>.tgz
npm run verify:ds
```

`npm pack` builds the same file npm downloads from GitHub, so the test matches real use.
Don't use `npm install ../ds-frontend-lint`. It creates a symlink, and the package can't find ESLint or its plugins

4. Merge, bump `version` in `package.json`, then tag and push:

```bash
git tag v1.1.0
git push --tags
```

5. Note the change in [CHANGELOG.md](CHANGELOG.md). Spell out any manual steps projects need.

**Never move or delete a tag.** Projects depend on tags staying the same.

## Security

Every project runs this code during lint. Anyone can read this repo, but only the team can change it.
Treat write access as sensitive.

- Protect `main`: require a pull request and one review.
- Protect tags `v*` with a GitHub ruleset so they can't be moved or deleted.
- Keep the list of people with write access short.
- No `install`, `postinstall` or `prepare` scripts in `package.json`. Reject any PR that adds one.
- No secrets, internal URLs or project names in this repo. It's public.
