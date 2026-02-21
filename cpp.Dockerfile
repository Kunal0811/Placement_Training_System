# Use an image with the g++ compiler
FROM gcc:11

# Create a non-root user
RUN useradd -m coder
WORKDIR /app
USER coder

# The command to compile and run will be provided at runtime
CMD ["sh", "-c", "g++ script.cpp -o script && ./script"]