import moment from "moment-timezone";
import { Billing } from "./Billing";
import { SlackClient } from "./SlackClient";

const fromTime = moment({ hour: 0, minute: 0, second: 0 })
  .tz("Asia/Tokyo")
  .subtract(1, "days")
  .format("X");

const toTime = moment({ hour: 23, minute: 59, second: 59 })
  .tz("Asia/Tokyo")
  .subtract(1, "days")
  .format("X");

/*
const billing = new Billing();
async function main() {
  const report = await billing.calculate(fromTime, toTime);
  try {
    const slackClient = new SlackClient();
    await slackClient.post(report.slackMessageDetail());
  } catch (err) {
    console.log(err);
  }
}
main();
*/

import AWS from "aws-sdk";
import { DynamoDB } from "aws-sdk";

const dynamo = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
  region: "ap-north-east1",
});

const params: DynamoDB.Types.PutItemInput = {
  TableName: "DatadogPlan",
  Item: { Product: { S: "uzou" }, PlanedHostCount: { N: "30" } },
};

const getParams = {
  Key: {
    Product: {
      S: "uzou",
    },
  },
  TableName: "DatadogPlan",
};

dynamo.listTables({}, function(err, data) {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log(data);
  }
});

// put Item
/*
dynamo.putItem(params, (err, data) => {
  console.log(err);
  console.log(data);
});

// get Item
dynamo.getItem(getParams, (err, data) => {
  console.log(err);
  console.log(data);
});
*/
