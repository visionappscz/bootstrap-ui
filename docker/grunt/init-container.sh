#!/usr/bin/env sh

# This script is to be executed when the docker container is started

# Set UID of user www-data on guest to match the UID of the user on the host machine
usermod -u $(stat -c "%u" $1) docker-container-user
# Set GID of group www-data on guest to match the GID of the users primary group on the host machine
groupmod -g $(stat -c "%g" $1) docker-container-user

chown -R docker-container-user /workspace
chown -R docker-container-user /home/docker-container-user

