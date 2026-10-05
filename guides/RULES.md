# Rules and Reasons

Most rules come from each tool's **recommended** preset. We add only a few on top.

**The pattern:** errors are real bugs or clear mistakes. Warnings are nudges.

## Formatting (Prettier)

| Setting                      | Value    | Why                                                                      |
| ---------------------------- | -------- | ------------------------------------------------------------------------ |
| Semicolons                   | None     | Less noise. Prettier handles the edge cases.                             |
| Quotes in code               | Single   | Common in JS. Angular's own default. Strings with HTML need no escaping. |
| Quotes in markup (JSX, HTML) | Double   | Matches HTML. Angular templates are double, so both stacks match.        |
| Indent                       | 2 spaces | Standard for JS, TS, HTML.                                               |
| Line width                   | 120      | Fits modern screens without forcing early wraps.                         |
| Trailing commas              | All      | Cleaner diffs when adding items.                                         |
| Arrow parens                 | Always   | One style, easy to add parameters.                                       |
| One attribute per line       | On       | Templates and JSX are easier to read and diff.                           |
| Line endings                 | LF       | One standard on every OS. See `.gitattributes`.                          |
| Angular template whitespace  | Ignored  | Prettier can wrap templates freely.                                      |

Short rule: **single quotes for code, double for markup, backticks for inserting values.**

## Base (every project)

| Rule                            | Level  | Why                                                        |
| ------------------------------- | ------ | ---------------------------------------------------------- |
| `@eslint/js` recommended        | preset | Catches common JS bugs.                                    |
| `typescript-eslint` recommended | preset | Catches common TS bugs.                                    |
| `no-unused-vars`                | warn   | Prefix a name with `_` to mark it as intentionally unused. |
| `no-explicit-any`               | warn   | Nudges toward real types without blocking work.            |

Config files (`*.config.*`) and `scripts/` get Node globals, like `process`.

## Angular

| Rule                                         | Level  | Why                                                                     |
| -------------------------------------------- | ------ | ----------------------------------------------------------------------- |
| angular-eslint TS + template + accessibility | preset | Angular bugs and a11y.                                                  |
| Selector prefix `app`                        | error  | Avoids clashes with other libraries' elements.                          |
| `===` in templates                           | error  | `==` hides type bugs.                                                   |
| No negated async                             | error  | `!(x \| async)` is true while loading. Usually a bug.                   |
| No duplicate attributes                      | error  | Always a mistake.                                                       |
| Track-by in loops                            | warn   | Performance.                                                            |
| Attribute order                              | warn   | Structural, refs, attributes, inputs, two-way, outputs. Easier to scan. |

## React

| Rule                    | Level  | Why                                                |
| ----------------------- | ------ | -------------------------------------------------- |
| react + jsx-runtime     | preset | React bugs. No need to import React in every file. |
| react-hooks recommended | preset | Hook rules, including the React Compiler rules.    |
| jsx-a11y recommended    | preset | Accessibility. Matches Angular's a11y rules.       |
| `prop-types`            | off    | TypeScript covers this.                            |
| Self-closing components | warn   | `<Foo />` instead of `<Foo></Foo>`.                |
| No useless fragments    | warn   | Removes extra `<></>`.                             |
