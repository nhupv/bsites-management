rm -rf dist
docker build -t bsites-ui:latest .
docker create --name dummy bsites-ui
docker cp dummy:/app ./dist
docker rm -f dummy
