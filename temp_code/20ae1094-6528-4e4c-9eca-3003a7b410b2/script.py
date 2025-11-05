import sys

def solve():
    nums = eval(sys.stdin.read().strip())  # Read input like [1,2,3,3,2,1]
    n = len(nums)
    total_sum = sum(nums)
    prefix_sum = 0

    for i in range(1, n):  # partition after i elements (so both sides non-empty)
        prefix_sum += nums[i - 1]
        if prefix_sum * n == total_sum * i:
            print("true")
            return
    
    print("false")


if __name__ == "__main__":
    solve()
