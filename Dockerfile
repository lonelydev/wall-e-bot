FROM public.ecr.aws/lambda/nodejs:18 as builder

# set the working directory inside the container
WORKDIR /usr/app/src

COPY src /usr/app/src/

# copy command runs on the host
# copy all js files from where you run this to the container and package-lock json files to
# can also create docker ignore file and copy all
#COPY *.js package*.json ${LAMBDA_TASK_ROOT}
COPY *.json /usr/app/

WORKDIR /usr/app/
RUN npm install
RUN npm run build


FROM public.ecr.aws/lambda/nodejs:18
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/built/* ./

#executes an entry point to the command.
CMD [ "index.handler" ]
