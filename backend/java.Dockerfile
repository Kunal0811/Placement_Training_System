# Use an official OpenJDK image that includes the full JDK
FROM openjdk:11-jdk-slim

# Create a non-root user for security
RUN useradd -m coder
WORKDIR /app
USER coder

# The command to compile and run will be provided at runtime
CMD ["sh", "-c", "javac MyClass.java && java MyClass"]