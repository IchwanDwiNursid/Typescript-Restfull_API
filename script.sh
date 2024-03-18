# Docker Environment


# create APP
docker run -d --name typescript-app -e DATABASE_URL="mysql://root:iwan@typescript-DB:3306/belajar_typescript_restful_api" -p 3000:3000 --network my-network typescript:latest

# create Database 
docker run -d --name typescript-DB -e MYSQL_DATABASE=belajar_typescript_restful_api -e MYSQL_ROOT_PASSWORD=iwan --network my-network mysql:8.0.31

# create APP using docker Image Pull
docker run -d --name typescript-app -e DATABASE_URL="mysql://root:iwan@typescript-DB:3306/belajar_typescript_restful_api" -p 3000:3000 --network my-network nursid/typescript_restfull_api:1.0.0
