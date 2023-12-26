#/bin/bash

# script to check if there were changes in the backend folder in
# commits pushed to github through github actions
# if there are changes it will fail

# get the last commit hash
last_commit=$(git rev-parse HEAD)

# get the last commit hash of the backend folder
last_backend_commit=$(git log -1 --pretty=format:"%h" backend)

# compare the two hashes
CHANGED=$(git diff-tree --no-commit-id --name-only -r $last_backend_commit.. $last_commit ./backend)
if [ -n "$CHANGED" ]; then
  echo "Changes detected in backend folder"
  # exit with error code 1
  exit 1
fi
