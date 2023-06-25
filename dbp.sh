docker build -t wall-e .

docker tag wall-e:latest 167362428455.dkr.ecr.us-east-1.amazonaws.com/wall-e:latest

docker push 167362428455.dkr.ecr.us-east-1.amazonaws.com/wall-e:latest
