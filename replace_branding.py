from pathlib import Path

root = Path('.')
text_targets = ['Car Bronze', 'car bronze']
replace_with = ['True Inspectify', 'true inspectify']
changed = []

for path in root.rglob('*'):
    if path.is_file() and path.suffix.lower() in {'.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.txt', '.css', '.yml', '.yaml'}:
        try:
            text = path.read_text(encoding='utf-8')
        except Exception:
            continue

        new_text = text
        for old, new in zip(text_targets, replace_with):
            new_text = new_text.replace(old, new)

        if new_text != text:
            path.write_text(new_text, encoding='utf-8')
            changed.append(str(path))

print('UPDATED_FILES=' + str(len(changed)))
for path in changed[:200]:
    print(path)
