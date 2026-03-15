
import os

filepath = r'c:\Users\maram\OneDrive\Desktop\venturecraft\app\admin\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def find_line(lines, query, start_at=0):
    for i in range(start_at, len(lines)):
        if query in lines[i]:
            return i
    return -1

# Fix 1: Malformed main tag
for i in range(len(lines)):
    if '</main >' in lines[i]:
        lines[i] = lines[i].replace('</main >', '</main>')

# Fix 2: Screening Round 2 Button Ternary mismatch (the rogue one found earlier)
# Look for handleSaveScreeningRound2
for i in range(len(lines)):
    if 'handleSaveScreeningRound2' in lines[i]:
        # Look for the </div> that should be a </button> or closure
        for j in range(i, i+20):
            if '</button>' in lines[j] and ')}' not in lines[j]:
                if j+1 < len(lines) and '</div>' in lines[j+1]:
                     # This is a common pattern where a ternary is broken
                     pass


# System Reset of Modal Closures
# We need to find the major boundaries and ensure they match.

# Let's use a simpler approach: Re-apply the known working repair logic
# but specifically target the lines from the NEW sync.

def repair_modal(lines, start_query, end_marker, fix_content):
    idx = find_line(lines, start_query)
    if idx != -1:
        for i in range(idx, len(lines)):
            if end_marker in lines[i]:
                lines[i] = fix_content + lines[i]
                return True
    return False

# selectedApp (2686 approx)
repair_modal(lines, 'selectedApp && (', '</motion.div>', '                                    </div>\n                                </div>\n                            </div>\n')

# selectedAmbassadorApp (3145 approx)
repair_modal(lines, 'selectedAmbassadorApp && (', '</motion.div>', '                                </div>\n                            </div>\n')

# Decision Modal
repair_modal(lines, 'showDecisionModal && decisionConfig && (', '</motion.div>', '                            </div>\n                        </div>\n')

# Reward Modal
repair_modal(lines, 'showRewardModal && rewardUser && (', '</motion.div>', '                            </div>\n                        </div>\n')

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)
