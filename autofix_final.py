
import re

path = r'c:\Users\maram\OneDrive\Desktop\venturecraft\app\admin\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def find_line(pattern, start_index=0):
    for i in range(start_index, len(lines)):
        if pattern in lines[i]:
            return i
    return -1

# Fix selectedApp closures (around 3120)
idx = find_line('{selectedApp && (', 2600)
if idx != -1:
    end_idx = find_line('</AnimatePresence>', idx)
    if end_idx != -1:
        # We need to ensure it has: </div> </div> </div> </motion.div> </div> )} </AnimatePresence>
        # Let's count back from end_idx
        lines[end_idx-6:end_idx+1] = [
            '                                                </div>\n',
            '                                            </div>\n',
            '                                        </div>\n',
            '                                    </motion.div>\n',
            '                                </div>\n',
            '                            )}\n',
            '                        </AnimatePresence>\n'
        ]

# Fix selectedAmbassadorApp closures (around 3330)
idx = find_line('{selectedAmbassadorApp && (', 3100)
if idx != -1:
    end_idx = find_line('</AnimatePresence>', idx)
    if end_idx != -1:
        lines[end_idx-6:end_idx+1] = [
            '                                                </div>\n',
            '                                            </div>\n',
            '                                        </div>\n',
            '                                    </motion.div>\n',
            '                                </div>\n',
            '                            )}\n',
            '                        </AnimatePresence>\n'
        ]

# Fix showDecisionModal closures
idx = find_line('{showDecisionModal && decisionConfig && (', 3300)
if idx != -1:
    end_idx = find_line('</AnimatePresence>', idx)
    if end_idx != -1:
        lines[end_idx-5:end_idx+1] = [
            '                                                </div>\n',
            '                                            </div>\n',
            '                                        </motion.div>\n',
            '                                    </div>\n',
            '                                )}\n',
            '                            </AnimatePresence>\n'
        ]

# Fix showRemoveModal closures
idx = find_line('{showRemoveModal && userToRemove && (', 3400)
if idx != -1:
    end_idx = find_line('</AnimatePresence>', idx)
    if end_idx != -1:
        lines[end_idx-5:end_idx+1] = [
            '                                                </div>\n',
            '                                            </div>\n',
            '                                        </motion.div>\n',
            '                                    </div>\n',
            '                                )}\n',
            '                            </AnimatePresence>\n'
        ]

# Fix showHistoryModal closures
idx = find_line('showHistoryModal && historyUser && (', 3600)
if idx != -1:
    end_idx = find_line('</AnimatePresence>', idx)
    if end_idx != -1:
        lines[end_idx-6:end_idx+1] = [
            '                                                </div>\n',
            '                                            </div>\n',
            '                                        </motion.div>\n',
            '                                    </motion.div>\n',
            '                                )}\n',
            '                        </AnimatePresence>\n'
        ]

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
