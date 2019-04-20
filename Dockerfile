FROM amazon/dynamodb-local

ENTRYPOINT ["java"]
RUN mkdir data && chown -R 1000 data
