from pathlib import Path

root = Path('.')
repls = [
    ('#0f4c81', '#b08a5a'),
    ('#0b3360', '#7a5a33'),
    ('#0d3a64', '#7a5a33'),
    ('#16589b', '#8b6a43'),
    ('#2d5ca1', '#a67c4a'),
    ('#1e40af', '#b08a5a'),
    ('#2563eb', '#b08a5a'),
    ('#1d4ed8', '#a88352'),
    ('from-blue-', 'from-amber-'),
    ('via-blue-', 'via-amber-'),
    ('to-blue-', 'to-amber-'),
    ('border-blue-', 'border-amber-'),
    ('text-blue-', 'text-amber-'),
    ('bg-blue-', 'bg-amber-'),
    ('hover:bg-blue-', 'hover:bg-amber-'),
    ('hover:text-blue-', 'hover:text-amber-'),
    ('focus:border-blue-', 'focus:border-amber-'),
    ('focus:ring-blue-', 'focus:ring-amber-'),
    ('shadow-blue-', 'shadow-amber-'),
    ('fill-blue-', 'fill-amber-'),
    ('ring-blue-', 'ring-amber-'),
]

files = list(root.glob('app/**/*')) + list(root.glob('components/**/*')) + list(root.glob('lib/**/*'))
changed = []
for p in files:
    if p.is_file() and p.suffix.lower() in {'.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md'}:
        text = p.read_text(encoding='utf-8', errors='ignore')
        new = text
        for a, b in repls:
            new = new.replace(a, b)
        if new != text:
            p.write_text(new, encoding='utf-8')
            changed.append(str(p))

print('CHANGED_COUNT=', len(changed))
for path in changed[:200]:
    print(path)
