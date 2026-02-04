# Objective: Setup Private Repo with Google Drive Sync

**Trello card:** https://trello.com/c/KnNFiYar

## Goal
Replicate the luthien-org Google Drive ↔ GitHub sync setup for Scott's personal Google Drive (scottwofford3@gmail.com), creating a new **private** repo.

## Why
- Backup personal Drive docs to GitHub
- Enable Claude Code to search/reference personal docs via repo
- Same workflow that works well for Luthien

---

## Reference Implementation

The luthien-org repo has a working bidirectional sync with Google Drive.

### Key Files to Reference
```
/Users/scottwofford/build/luthien-org/scripts/sync-from-drive.sh   # main sync script
/Users/scottwofford/build/luthien-org/scripts/LUTHIEN_DRIVE_README.md  # docs for Drive users
/Users/scottwofford/build/luthien-org/.gitignore                    # excludes large files
```

### Existing rclone Remotes
```
gdrive:              # generic?
gdrive-luthien:      # Luthien shared drive
gdrive-claude-docs:  # bidirectional sync target for root .md/.csv files
gdrive-seldon:       # Seldon labs folder
```

### How luthien-org Sync Works
1. **Drive → GitHub**: Entire Luthien folder syncs (excluding recordings, large files, _claude-code-docs)
2. **GitHub → Drive**: Root .md and .csv files sync to `_claude-code-docs/` folder in Drive
3. Google Docs are converted to Markdown via pandoc (originals deleted after conversion)
4. Runs on Scott's laptop login/wake

---

## Steps to Replicate

### 1. Create new private GitHub repo
- Name: `scott-drive` or `personal-drive`
- Private visibility
- Clone to `/Users/scottwofford/build/scott-drive`

### 2. Configure rclone remote for personal Drive
```bash
rclone config
# Create new remote: gdrive-scott
# Type: Google Drive
# Authenticate with scottwofford3@gmail.com
# Decide: entire drive or specific folder?
```

### 3. Create sync script
Copy and adapt `luthien-org/scripts/sync-from-drive.sh`:
- Change `REPO_DIR="/Users/scottwofford/build/scott-drive"`
- Change `gdrive-luthien:` to `gdrive-scott:`
- Adjust exclusions:
  ```bash
  RCLONE_EXCLUDES=(
      --exclude "*.mp4"
      --exclude "*.webm"
      --exclude "*.mkv"
      --exclude "*.wav"
      --exclude "*Recording*"
      # Add personal exclusions
  )
  ```
- Decide on bidirectional sync: which folders go GitHub → Drive?

### 4. Create .gitignore
```gitignore
# Large files that exceed GitHub's 100MB limit
*.wav
*.mp4
*.webm
*.mkv
*Recording*
# Add personal patterns
```

### 5. Setup auto-sync (optional)
Add to LaunchAgent or login hooks like luthien-org

### 6. Test
```bash
./scripts/sync-from-drive.sh --dry-run  # preview what would sync
./scripts/sync-from-drive.sh            # actual sync
./scripts/sync-from-drive.sh --commit   # sync + commit + push
```

---

## Questions to Decide
- [ ] Repo name: `scott-drive`? `personal-drive`?
- [ ] Sync entire Drive or specific folder(s)?
- [ ] Which folders need bidirectional sync (GitHub → Drive)?
- [ ] Any sensitive folders to exclude?
