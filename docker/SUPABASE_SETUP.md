# Supabase Docker Setup (Flattened Submodule)

This document explains how the Supabase configuration is integrated into our monorepo.

To avoid committing third-party files directly and prevent cluttered nested paths (like `docker/supabase/docker/`), we use **Git Submodule with Non-Cone Sparse Checkout** combined with a localized **symlink**. This tracks the upstream repository cleanly while keeping our file structure completely flat.

---

## How It Was Created (Reference)

If this setup ever needs to be recreated from scratch, these are the commands that were used from the monorepo root:

```bash
# 1. Clear any broken configurations
git rm -f docker/supabase 2>/dev/null
rm -rf docker/supabase
rm -rf .git/modules/supabase_docker

# 2. Add the submodule under a custom name to a hidden root directory
git submodule add --name supabase_docker --depth=1 https://github.com/supabase/supabase docker/.supabase-root

# 3. Restrict tracking strictly to the docker directory (Non-Cone Mode)
cd docker/.supabase-root
git config core.sparseCheckout true
git sparse-checkout disable
git sparse-checkout set --no-cone "docker/"
cd ../..

# 4. Flatten the directory structure using a relative symlink
ln -s .supabase-root/docker docker/supabase

# 5. Commit the architecture layout
git add docker/.supabase-root docker/supabase
git commit -m "chore: add flattened supabase docker submodule configuration"
```

---

## How to Initialize (For Teammates / CI-CD)

When cloning this monorepo for the first time or pulling updates down on a new machine, the hidden submodule files and symlink targets will not download automatically. Run this command at the root directory to safely hydrate the configs:

```bash
git submodule update --init --recursive --depth=1
```

Once executed, Git will fetch only the `docker/` folder from Supabase, and your local `docker/supabase/` symlink folder will instantly work.

---

## How to Pull Upstream Updates

If you need to update the Supabase environment files to the latest versions released by the Supabase team:

```bash
# Move into the tracked submodule root
cd docker/.supabase-root

# Fetch and pull latest changes from master
git fetch origin master --depth=1
git reset --hard origin/master

# Return to root and commit the bump
cd ../..
git add docker/.supabase-root
git commit -m "chore: bump supabase submodule configuration to latest upstream master"
```

---

## File Structure Result

Your local workspace will look completely clean, hiding all root-level clutter from the Supabase repo (such as `package.json`, `turbo.jsonc`, `apps/`, etc.):

```text
docker/
├── .supabase-root/     <-- Hidden Git tracking pointer (Contains ONLY the docker folder)
└── supabase/           <-- Active Symlink (Flattens everything out beautifully)
    ├── docker-compose.yml
    ├── run.sh
    ├── setup.sh
    └── volumes/
```
