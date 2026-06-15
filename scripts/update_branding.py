from pathlib import Path

old = 'Vehicle Health Analysis'
new = 'Car Bronze'
text_exts = {'.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.html', '.css'}

count = 0
for path in Path('.').rglob('*'):
    if not path.is_file():
        continue
    if path.suffix.lower() not in text_exts:
        continue
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        continue
    if old in text:
        updated = text.replace(old, new)
        path.write_text(updated, encoding='utf-8')
        count += text.count(old)

print(f'REPLACED_COUNT={count}')
