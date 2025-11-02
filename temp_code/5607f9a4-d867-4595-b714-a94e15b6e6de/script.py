import sys

def solve():
    s = sys.stdin.readline().strip()
    char_set = set()
    left = 0
    max_length = 0

    for right in range(len(s)):
        # If we see a duplicate, shrink the window from the left
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        # Add current character to the window
        char_set.add(s[right])
        # Update maximum length
        max_length = max(max_length, right - left + 1)

    print(max_length)


# Main execution block
if __name__ == "__main__":
    solve()
