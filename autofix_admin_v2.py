
import re

path = r'c:\Users\maram\OneDrive\Desktop\venturecraft\app\admin\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix selectedApp
content = content.replace(
    '</motion.div>\n                                    </div>\n                                )}\n                            </AnimatePresence>',
    '</motion.div>\n                                </div>\n                            )}\n                        </AnimatePresence>'
)

# Fix selectedAmbassadorApp
# content = content.replace(...) 
# I'll use a more robust way: find blocks and replace closures

def fix_modal_closure(content, start_marker, expected_closures):
    # This is too complex for 10 min. 
    # Let's just do direct replacements for the known bad ones

    # selectedApp
    content = content.replace(
        '</motion.div>\n                                </div>\n                            )}\n                        </AnimatePresence>',
        '</motion.div>\n                                </div>\n                            )}\n                        </AnimatePresence>'
    ) # Already did this

    # ambassador modal closure I just wrote:
    # </div>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                        </motion.div>\n                                    </div>\n                                )}\n                            </AnimatePresence>
    # Wait, let's look at the file content again.

    return content

# I'll just use the view_file content to be sure

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
