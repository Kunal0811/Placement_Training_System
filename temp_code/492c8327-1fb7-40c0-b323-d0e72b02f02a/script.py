def sum_digits(n):
    # Write your code here
    add = 0
    rem = 0
    while n>0:
      rem =rem + n%10
      n = n//10

    return rem
    pass
import sys

if __name__ == '__main__':
    input_data = sys.stdin.readline().strip()
    if input_data:
        n = int(input_data)
        print(sum_digits(n))