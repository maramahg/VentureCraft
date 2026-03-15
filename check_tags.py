
import re

path = r'c:\Users\maram\OneDrive\Desktop\venturecraft\app\admin\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

output = []
stack = []

content = "".join(lines)
tag_pattern = re.compile(r'<(/?(?:div|main|motion\.div|AnimatePresence|Suspense))[\s\n>][^>]*>', re.DOTALL)

for match in tag_pattern.finditer(content):
    tag_full = match.group(0)
    tag_name = match.group(1)
    line_num = content.count('\n', 0, match.start()) + 1
    
    if tag_full.endswith('/>'):
        continue
        
    if tag_name.startswith('/'):
        closing = tag_name[1:]
        if not stack:
            output.append(f"Line {line_num}: Rogue closing tag </{closing}>")
        else:
            opening, start_line = stack.pop()
            if opening != closing:
                output.append(f"Line {line_num}: Mismatch! Opened <{opening}> at line {start_line}, but tried to close with </{closing}> at line {line_num}")
    else:
        stack.append((tag_name, line_num))

if stack:
    output.append(f"Unclosed tags at end of file:")
    for tag, line_num in stack:
        output.append(f"  <{tag}> opened at Line {line_num}")
else:
    output.append("Tags are balanced!")

with open(r'c:\Users\maram\OneDrive\Desktop\venturecraft\tag_report.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))
