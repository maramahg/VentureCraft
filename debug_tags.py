
import re

path = r'c:\Users\maram\OneDrive\Desktop\venturecraft\app\admin\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

tags_to_track = ['div', 'main', 'motion.div', 'AnimatePresence', 'Suspense']

def get_stats():
    stack = []
    issues = []
    
    content = "".join(lines)
    # Using a simpler regex to be sure
    pattern = re.compile(r'<(/?(?:div|main|motion\.div|AnimatePresence|Suspense))', re.IGNORECASE)
    
    for match in pattern.finditer(content):
        tag = match.group(1).lower()
        full_tag_match = re.match(r'<(/?(?:div|main|motion\.div|AnimatePresence|Suspense))[^>]*>', content[match.start():], re.IGNORECASE)
        
        if not full_tag_match: continue
        full_tag = full_tag_match.group(0)
        
        if full_tag.endswith('/>'): continue
        
        line_num = content.count('\n', 0, match.start()) + 1
        
        if tag.startswith('/'):
            tag_name = tag[1:]
            if not stack:
                issues.append(f"Rogue closing </{tag_name}> at line {line_num}")
            else:
                top_tag, top_line = stack.pop()
                if top_tag != tag_name:
                    issues.append(f"Mismatch: Opened <{top_tag}> at {top_line}, closed with </{tag_name}> at {line_num}")
        else:
            stack.append((tag, line_num))
            
    return issues, stack

issues, remaining = get_stats()
with open(r'c:\Users\maram\OneDrive\Desktop\venturecraft\tag_report_debug.txt', 'w', encoding='utf-8') as f:
    f.write("ISSUES:\n")
    f.write("\n".join(issues))
    f.write("\n\nUNCLOSED:\n")
    for tag, line in remaining:
        f.write(f"<{tag}> at {line}\n")
