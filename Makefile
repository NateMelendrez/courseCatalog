# Define variables for Docker commands
IMAGE_NAME=course-catalog
CONTAINER_NAME=course-catalog
PORT=8080
# Specify the local directory to mount into the container
# Adjust the path to where your application code resides
LOCAL_APP_DIR=.

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the Docker container with a volume mount for live updates
run:
	docker run --name $(CONTAINER_NAME) -v $(LOCAL_APP_DIR):/usr/src/app -p $(PORT):$(PORT) -d $(IMAGE_NAME)

# Stop and remove the Docker container
stop:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

# Remove the Docker image
clean:
	docker rmi $(IMAGE_NAME)

# Rebuild the Docker image (stop, remove, build, and run)
rebuild: stop clean build run

.PHONY: build run stop clean rebuild