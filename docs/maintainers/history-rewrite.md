# Removing synced playground assets from git history

> **Status: this was run once, on 2026-11-02.** `main`, `feat/pocketjs` and
> `chore/publish-npm-packages` were force-pushed; commits from the first
> playground commit onward changed SHA, and `main`'s tree was unchanged. A fresh
> clone went from about 20 MiB to 6.3 MB. Clones made before that date must be
> replaced (see "What collaborators must do"). This page stays as the procedure
> for any future rewrite, which is just as destructive: it needs a window with
> no open PRs and invalidates every SHA, clone, fork and link to a commit.

## What it removes

These paths are fetched or staged by `packages/playground/scripts/sync-*.mjs`
and are no longer tracked at the tip of `main`:

| Path | Why it can go |
| --- | --- |
| `packages/playground/public/koka/koka-playground.wasm` | downloaded from the pinned upstream Koka commit, SHA-256 pinned |
| `packages/playground/public/koka/koka-lsp.wasm` | downloaded from the pinned upstream Koka commit, SHA-256 pinned |
| `packages/playground/public/koka/koka-runtime.json.gz` | rebuilt from upstream sources plus `vendor/kokaine-precompiled-v3.2.4/`, SHA-256 pinned |
| `packages/playground/public/koka/precompiled/` | a duplicate of upstream + vendored modules; the served copy is derived at build time |
| `packages/playground/public/devtools/` | copied from the `chii`/`chobitsu` npm devDependencies |

**Do not remove** `packages/playground/public/koka/koka-browser-repl.wasm`
(about 14.5 MiB, about 4 MiB packed). It is still tracked because it is built
from a fork commit (`32fee7eda6397dee81f4752ff7cab4e4001d3eb2`) and has no
upstream download. If it is later published as an immutable release asset and
fetched by `sync-koka-assets.mjs`, add its path to the command below.

Measured on a local clone with all branches (2026-11-02):

| | Value |
| --- | --- |
| All blobs reachable from all refs | 92.6 MiB raw, 23.3 MiB compressed |
| Blobs under the removed paths | 857 blobs, 62.1 MiB raw, about 16.7 MiB compressed (before delta compression) |
| `git count-objects -vH` `size-pack` | about 19 MiB |
| Tracked tree at the tip (`git ls-files`) | 72.4 MB before untracking, 19.8 MB after (15.2 MB of it is `koka-browser-repl.wasm`) |

So a fresh clone should shrink from roughly 19 MiB to roughly 5 MiB packed.
Re-measure before running. The numbers move with every new branch.

## Prerequisites

- [`git-filter-repo`](https://github.com/newren/git-filter-repo) 2.38 or newer
  (`brew install git-filter-repo` or `pipx install git-filter-repo`).
- Admin rights on `Eric-Song-Nop/kokaine`, so you can temporarily allow
  force-pushes to `main` in the branch protection rules.
- A list of open PRs (`gh pr list --state open`). Merge them, close them, or
  warn their authors first.

## 1. Make a fresh mirror and record the baseline

Always work in a throwaway mirror, never in a working clone.

```sh
mkdir -p ~/kokaine-rewrite && cd ~/kokaine-rewrite
git clone --mirror git@github.com:Eric-Song-Nop/kokaine.git kokaine.git
cp -R kokaine.git kokaine-backup.git          # untouched copy for rollback
cd kokaine.git

git gc --prune=now --aggressive
git count-objects -vH | tee ../before-count-objects.txt
git rev-parse refs/heads/main 'refs/heads/main^{tree}' | tee ../before-main.txt
git for-each-ref --format='%(refname) %(objectname)' refs/heads refs/tags \
  | tee ../before-refs.txt

# Per-path size report (written to filter-repo/analysis/ inside the mirror).
git filter-repo --analyze
sed -n '1,40p' filter-repo/analysis/path-all-sizes.txt
```

## 2. Dry run

`--dry-run` writes the original and filtered fast-export streams without
changing any ref, so you can inspect what would change.

```sh
git filter-repo --dry-run \
  --invert-paths \
  --path packages/playground/public/koka/koka-playground.wasm \
  --path packages/playground/public/koka/koka-lsp.wasm \
  --path packages/playground/public/koka/koka-runtime.json.gz \
  --path packages/playground/public/koka/precompiled/ \
  --path packages/playground/public/devtools/

ls -la filter-repo/fast-export.original filter-repo/fast-export.filtered
# Only the listed paths should disappear:
diff <(grep -aE '^M [0-9]+ [^ ]+ ' filter-repo/fast-export.original | awk '{print $4}' | sort -u) \
     <(grep -aE '^M [0-9]+ [^ ]+ ' filter-repo/fast-export.filtered | awk '{print $4}' | sort -u) \
  | grep '^<' | grep -vE '^< packages/playground/public/(koka/(koka-(playground|lsp)\.wasm|koka-runtime\.json\.gz|precompiled/)|devtools/)' \
  && echo 'UNEXPECTED PATHS REMOVED' || echo 'only the intended paths are removed'
```

## 3. The rewrite

This is the exact invocation. It is the dry run without `--dry-run`:

```sh
git filter-repo \
  --invert-paths \
  --path packages/playground/public/koka/koka-playground.wasm \
  --path packages/playground/public/koka/koka-lsp.wasm \
  --path packages/playground/public/koka/koka-runtime.json.gz \
  --path packages/playground/public/koka/precompiled/ \
  --path packages/playground/public/devtools/
```

`git filter-repo` removes `origin` and expires reflogs. It then repacks the
mirror. Repack fully so the size numbers are honest:

```sh
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## 4. Verify before pushing

```sh
# a. Sizes after.
git count-objects -vH | tee ../after-count-objects.txt
diff ../before-count-objects.txt ../after-count-objects.txt

# b. No removed path is reachable from any ref.
git rev-list --objects --all \
  | grep -E 'packages/playground/public/(devtools/|koka/(precompiled/|koka-(playground|lsp)\.wasm|koka-runtime\.json\.gz))' \
  && echo 'STILL PRESENT' || echo 'clean'
git log --all --oneline -- packages/playground/public/devtools \
  packages/playground/public/koka/precompiled | head

# c. The tip tree of main is unchanged. The removed paths were already
#    untracked there, so the tree hash must match the one recorded in step 1
#    even though the commit hash differs.
git rev-parse 'refs/heads/main^{tree}'
sed -n 2p ../before-main.txt

# d. Same refs, new SHAs.
git for-each-ref --format='%(refname)' refs/heads refs/tags | sort > ../after-refnames.txt
cut -d' ' -f1 ../before-refs.txt | sort | diff - ../after-refnames.txt

# e. A working clone of the rewritten history still builds and fetches the
#    assets from the pinned sources.
cd .. && git clone kokaine.git verify && cd verify
pnpm install --frozen-lockfile --ignore-scripts
pnpm --filter @kokaine/playground run build
pnpm --filter @kokaine/playground run test
pnpm --filter @kokaine/playground run test:wasm
pnpm --filter @kokaine/playground run test:architecture
```

If any check fails, delete `kokaine.git` and start again from
`kokaine-backup.git`. Nothing has been pushed yet.

## 5. Publish (force-push)

1. Announce a freeze. No merges or pushes until step 6 is done.
2. In GitHub repository settings, allow force-pushes to `main` temporarily.
3. Push branches and tags explicitly. Do not use `git push --mirror`: a GitHub
   mirror clone contains read-only `refs/pull/*` refs, and `--mirror` would also
   delete remote refs that are missing locally.

   ```sh
   cd ~/kokaine-rewrite/kokaine.git
   git remote add origin git@github.com:Eric-Song-Nop/kokaine.git
   git push --force origin 'refs/heads/*:refs/heads/*'
   git push --force origin 'refs/tags/*:refs/tags/*'
   ```

4. Restore the branch protection for `main`.
5. Clear CI caches tied to old SHAs if needed: `gh cache delete --all`.

Limits:

- GitHub keeps the old objects reachable through `refs/pull/*` and in forks.
  The size of the GitHub repository and of `git clone --mirror` will not drop
  until GitHub runs garbage collection. To speed that up, contact GitHub
  Support and ask them to run gc after the rewrite. Normal `git clone` (heads
  and tags only) shrinks immediately.
- Signed tags lose their signatures. Re-sign them if needed.
- npm packages and Cloudflare Pages deployments are unaffected. Their recorded
  commit SHAs simply stop resolving.

## 6. What collaborators must do

Old clones share no history with the rewritten remote after the first
playground commit. Pushing from an old clone would bring back every removed
blob, so:

- **Simplest: re-clone.** Move any unpushed work out first, as patches
  (`git format-patch origin/main..my-branch`) or by copying files.
- **To keep a clone:** fetch, then hard-reset each branch you own onto its
  rewritten counterpart, or replay your own commits onto the new history:

  ```sh
  git fetch origin --prune
  # For a local branch with unpushed commits on top of the old main:
  git rebase --onto origin/main <old-main-sha> my-branch
  # For branches with no local work:
  git checkout main && git reset --hard origin/main
  # Then drop the old objects:
  git reflog expire --expire=now --all && git gc --prune=now
  ```

  `<old-main-sha>` is the pre-rewrite `main` commit your branch started from.
  `git merge-base my-branch <old main ref>` from a backup tells you which one.
- **Worktrees** (`.claude/worktrees/*` and others): remove them with
  `git worktree remove` and recreate them from the rewritten branches.
- **Open pull requests:** the PR head branch still contains the old history.
  The author must rebase it onto the new `main` with the `--onto` recipe above
  and force-push it. If GitHub reports the PR as unrelated, close it and open a
  new one. Review comments anchored to old commits are lost.
- **Forks:** must re-fork or force-update from upstream. Until they do, they
  keep the large blobs.
- **Never** `git push --force` from an un-migrated clone. That would bring back
  the removed history.
