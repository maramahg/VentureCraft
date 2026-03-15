
import re

path = r'c:\Users\maram\OneDrive\Desktop\venturecraft\app\admin\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix selectedApp closure
selected_app_block = r'(<h2[^>]*>\{selectedApp\.startupName\s*\|\|\s*selectedApp\.pillar\}</h2>[\s\S]*?)(</div>\s*</div>\s*</motion\.div>\s*</motion\.div>\s*</div>\s*)\)'
def fix_selected_app(match):
    return match.group(1) + "</div>\n                                            </div>\n                                        </motion.div>\n                                    </div>\n                                )"

content = re.sub(selected_app_block, fix_selected_app, content)

# Fix selectedAmbassadorApp closure
selected_ambassador_block = r'(<h2[^>]*>\{selectedAmbassadorApp\.email\}</h2>[\s\S]*?)(</div>\s+</div>\s+</motion\.div>\s+</div>\s+)\)'
def fix_selected_ambassador(match):
    # We need to find the correct number of divs to close
    # The modal content starts with 2 divs (flex-col lg-row and space-y-10)
    # Then sections.
    return match.group(1) + "</div>\n                                                </div>\n                                            </div>\n                                        </motion.div>\n                                    </div>\n                                )"

# content = re.sub(selected_ambassador_block, fix_selected_ambassador, content)

# Instead of complex regex, let's just do targeted string replacement for the known problematic spots
content = content.replace(
    '</motion.div>\n                                    </div>\n                                )}\n                            </AnimatePresence>',
    '</motion.div>\n                                </div>\n                            )}\n                        </AnimatePresence>'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
