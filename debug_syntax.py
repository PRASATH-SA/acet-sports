
import sys

def check_balance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    line = 1
    col = 1
    
    i = 0
    while i < len(content):
        char = content[i]
        if char == '\n':
            line += 1
            col = 1
        else:
            col += 1
            
        # Ignore comments
        if char == '/' and i + 1 < len(content):
            if content[i+1] == '/':
                i += 2
                while i < len(content) and content[i] != '\n':
                    i += 1
                line += 1
                col = 1
                continue
            elif content[i+1] == '*':
                i += 2
                while i + 1 < len(content) and not (content[i] == '*' and content[i+1] == '/'):
                    if content[i] == '\n':
                        line += 1
                        col = 1
                    else:
                        col += 1
                    i += 1
                i += 2
                continue

        # Ignore strings
        if char in '"\'`':
            start_char = char
            i += 1
            col += 1
            while i < len(content) and content[i] != start_char:
                if content[i] == '\\':
                    i += 1
                    col += 1
                if content[i] == '\n':
                    line += 1
                    col = 1
                else:
                    col += 1
                i += 1
            i += 1
            col += 1
            continue

        if char in '({[':
            stack.append((char, line, col))
        elif char in ')}]':
            if not stack:
                print(f"Extra closing {char} at line {line}, col {col}")
                return
            top_char, top_line, top_col = stack.pop()
            if top_char != pairs[char]:
                print(f"Mismatched {char} at line {line}, col {col}. Expected closing for {top_char} from line {top_line}, col {top_col}")
                return
        i += 1

    if stack:
        for char, l, c in stack:
            print(f"Unclosed {char} from line {l}, col {c}")
    else:
        print("Balanced braces!")

if __name__ == "__main__":
    check_balance(sys.argv[1])
