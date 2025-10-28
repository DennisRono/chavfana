import os

# Directories and files to skip (add more if needed)
EXCLUDE_DIRS = {
    "node_modules",
    "__pycache__",
    ".git",
    ".idea",
    ".vscode",
    ".venv",
    "env",
    "venv",
    "build",
    "dist",
    ".next",
    ".cache",
    ".pytest_cache",
    ".DS_Store",
    ".mypy_cache",
    ".parcel-cache",
    ".turbo"
}

EXCLUDE_FILES = {
    ".DS_Store",
    "Thumbs.db"
}

OUTPUT_FILE = "folder_structure.txt"


def is_excluded(name: str) -> bool:
    """Check if a file or directory should be excluded."""
    name_lower = name.lower()
    return any(name_lower == excl.lower() for excl in EXCLUDE_DIRS | EXCLUDE_FILES)


def get_folder_structure(root_dir: str, indent: str = "") -> str:
    """Recursively build the folder and file structure as a formatted string."""
    structure = ""
    try:
        items = sorted(os.listdir(root_dir))
    except PermissionError:
        return f"{indent}[Permission Denied]\n"

    for item in items:
        item_path = os.path.join(root_dir, item)
        if is_excluded(item):
            continue

        # Add current item to the structure
        structure += f"{indent}├── {item}\n"

        # If it's a directory, recurse into it
        if os.path.isdir(item_path):
            structure += get_folder_structure(item_path, indent + "│   ")

    return structure


def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"Scanning directory: {current_dir}\n")

    structure = f"Folder structure for: {current_dir}\n\n"
    structure += get_folder_structure(current_dir)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(structure)

    print(f"✅ Folder structure written to '{OUTPUT_FILE}'")


if __name__ == "__main__":
    main()
