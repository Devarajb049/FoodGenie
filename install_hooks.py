import os
import sys
import stat

HOOK_CONTENT = """#!/bin/sh
# Git post-commit hook to auto-generate documentation on commits
echo "=== Git Post-Commit Hook: Auto-generating Documentation ==="
python generate_docs.py
echo "=== Documentation Generation Complete ==="
"""

def install_hook():
    git_dir = os.path.abspath(".git")
    if not os.path.exists(git_dir):
        print("Error: .git directory not found. Please run this script in the root of your git repository.")
        sys.exit(1)
        
    hooks_dir = os.path.join(git_dir, "hooks")
    os.makedirs(hooks_dir, exist_ok=True)
    
    post_commit_path = os.path.join(hooks_dir, "post-commit")
    
    # Write hook content
    with open(post_commit_path, "w", newline="\n") as f:
        f.write(HOOK_CONTENT)
        
    # Make executable (UNIX/Bash compatibility)
    try:
        st = os.stat(post_commit_path)
        os.chmod(post_commit_path, st.st_mode | stat.S_IEXEC)
    except Exception as e:
        print(f"Warning: Could not set executable permissions: {e}")
        
    print(f"Successfully installed Git post-commit hook at: {post_commit_path}")

if __name__ == "__main__":
    install_hook()
