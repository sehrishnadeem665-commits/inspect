from pathlib import Path
import re
root = Path(r'c:/Users/ADMIN/Desktop/cardefiner_final')
ext_exts = {'.ts', '.tsx', '.js', '.jsx'}
red_class_pattern = re.compile(r'red-(50|100|200|300|400|500|600|700|800|900)')
hex_replacements = {
    '#78000015': '#0f4c8115',
    '#78000010': '#0f4c8110',
    '#780000/10': '#0f4c81/10',
    '#780000/5': '#0f4c81/5',
    '#780000/20': '#0f4c81/20',
    '#780000/30': '#0f4c81/30',
    '#780000/40': '#0f4c81/40',
    '#780000': '#0f4c81',
    '#580000': '#0d3a64',
    '#5a0000': '#0f4c81',
    '#5c0000': '#0f4c81',
    '#8a0000': '#16589b',
    '#a52a2a': '#2d5ca1',
    '#E8D0D0': '#D0E3F1',
    '#D0A0A0': '#9EB8D3',
    '#fff5f5': '#eff8ff',
    '#ffecec': '#eaf5ff',
    '#78000015': '#0f4c8115',
    '#78000015': '#0f4c8115',
}
keys = sorted(hex_replacements.keys(), key=len, reverse=True)
changed_files = []
for path in root.rglob('*'):
    if path.suffix in ext_exts and path.is_file():
        text = path.read_text(encoding='utf-8')
        new_text = red_class_pattern.sub(r'blue-\1', text)
        for old in keys:
            new_text = new_text.replace(old, hex_replacements[old])
        if new_text != text:
            path.write_text(new_text, encoding='utf-8')
            changed_files.append(str(path.relative_to(root)))
print('changed files:', len(changed_files))
for f in changed_files:
    print(f)
