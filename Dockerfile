FROM public.ecr.aws/lambda/nodejs:14
# copy all js files and package-lock json files to
# can also create docker ignore file and copy all
COPY *.js package*.json /var/task/

RUN npm install

CMD [ "app.handler" ]
