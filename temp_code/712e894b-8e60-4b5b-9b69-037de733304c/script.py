import sys
from collections import defaultdict

def solve():
    # Input
    nums = list(map(int, input("Enter array elements (space-separated): ").split()))
    k = int(input("Enter k: "))
    
    freq = defaultdict(int)
    left = 0
    max_len = 0
    
    for right in range(len(nums)):
        freq[nums[right]] += 1
        
        # If any element exceeds frequency k, move left pointer
        while freq[nums[right]] > k:
            freq[nums[left]] -= 1
            left += 1
        
        # Update maximum valid window length
        max_len = max(max_len, right - left + 1)
    
    print(max_len)

# Main execution
if __name__ == "__main__":
    solve()

