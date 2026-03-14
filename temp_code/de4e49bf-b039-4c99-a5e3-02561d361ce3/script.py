import sys

def solve():
    input_data = sys.stdin.read().splitlines()
    if not input_data:
        return
    
    # Parse input
    n = int(input_data[0])
    nums = list(map(int, input_data[1].split()))
    
    candidate = None
    count = 0
    
    for num in nums:
        if count == 0:
            candidate = num
        
        if num == candidate:
            count += 1
        else:
            count -= 1
    
    print(candidate)

if __name__ == '__main__':
    solve()