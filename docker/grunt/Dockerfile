FROM            node:8

RUN             apt-get update -y \
                && apt-get upgrade -y \
                && apt-get install -y --no-install-recommends \
                    git \
                    git-core \
                    curl \
                    bzip2 \
                    gnupg \
                && npm install --global grunt-cli \
                && mkdir /workspace \
                && useradd -s /bin/bash docker-container-user \
                && mkdir /home/docker-container-user

COPY            ./init-container.sh /root/init-container.sh
WORKDIR         /workspace
