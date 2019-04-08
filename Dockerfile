FROM amazon/dynamodb-local

ENTRYPOINT ["java"]
CMD ["-jar", "DynamoDBLocal.jar", "-inMemory", "-sharedDb"]
