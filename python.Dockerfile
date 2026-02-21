# Use a minimal, official Python image
FROM python:3.10-slim

# Create a secure, non-root user to run the code
RUN useradd -m coder

# Set the working directory inside the container
WORKDIR /app

# Switch to the non-root user for security
USER coder

# The command to run the script will be provided at runtime
CMD ["python", "script.py"]