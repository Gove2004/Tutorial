import os, re, json
from datetime import datetime

root = os.path.dirname(os.path.abspath('update.bat'))
courses = []

for name in sorted(os.listdir(root)):
    dirpath = os.path.join(root, name)
    if not os.path.isdir(dirpath):
        continue
    idx = os.path.join(dirpath, 'index.html')
    if not os.path.isfile(idx):
        continue
    with open(idx, encoding='utf-8') as f:
        content = f.read()
    m = re.search(r'<title>(.*?)</title>', content)
    title = m.group(1).strip() if m else name
    chapters = len([fn for fn in os.listdir(dirpath) if re.match(r'\d{2}-.*\.html$', fn)])
    mtimes = []
    for fn in os.listdir(dirpath):
        fp = os.path.join(dirpath, fn)
        if os.path.isfile(fp):
            mtimes.append(os.path.getmtime(fp))
    updated = datetime.fromtimestamp(max(mtimes)).strftime('%Y-%m-%d') if mtimes else ''
    courses.append({
        'dir': name,
        'title': title,
        'chapters': chapters,
        'updated': updated
    })

with open(os.path.join(root, 'courses.json'), 'w', encoding='utf-8') as f:
    json.dump(courses, f, ensure_ascii=False, indent=2)

for c in courses:
    print(f'  Found: {c["title"]} ({c["chapters"]} chapters, {c["updated"]})')
print(f'  Total: {len(courses)} -> courses.json')
