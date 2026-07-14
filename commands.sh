bw run lint --parallel=auto
bw run build @fota/api-gateway
bw run build --parallel=auto

lsof -i :3000 -t | xargs kill -9

# Update Workspace dependencies
bunx npm-check-updates -i --workspaces

docker compose config
