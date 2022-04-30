const axios = require("axios");
const fs = require("fs");
const concat = require("concat-stream");

const AZURE_FUNCTION_TRIGGER_URL =
  "https://checkprod.azurewebsites.net/api/httptrigger1";

async function test() {
  console.time("test1");
  try {
    const resOne = await axios({
      url: AZURE_FUNCTION_TRIGGER_URL,
      method: "post",
      headers: {
        "x-functions-key":
          "5MEptPjt7BkJNIpvCxoLffUC3amYa8BSpWUrwsiheJjpKu3lBb1V1Q==",
      },
      data: {
        template: {
          name: "quote",
        },
        blobName: "33171095-4616-48ae-a845-334413be8bfc.pdf",
        data: {
          businessName: "Armstrong Lawncare",
          businessAddress: "1234 Main St. Central City, ST 12345",
          operatorPhoneNumber: "555-555-5555",
          operatorEmailAddress: "matthew@lawnscompany.com",
          operatorName: "Bubba Armstrong",
          clientName: "Blake Anderson",
          validFor: "7 days",
          date: "June 1, 2021",
          serviceDetails: [
            {
              service: {
                name: "Lawn Care",
                frequency: "Every week",
              },
              lineItems: [
                {
                  name: "Mowing",
                  price: "30.00",
                },
                {
                  name: "Weed Eating",
                  price: "20.00",
                },
                {
                  name: "Blowing",
                  price: "5.00",
                },
              ],
              price: "55.00",
            },
            {
              service: {
                name: "Lawn Care",
                tag: "Optional",
                frequency: "Every 2 weeks",
              },
              lineItems: [
                {
                  name: "Mowing",
                  price: "35.00",
                },
                {
                  name: "Weed Eating",
                  price: "20.00",
                },
                {
                  name: "Blowing",
                  price: "5.00",
                },
              ],
              price: "55.00",
            },
          ],
          notes:
            "Thank you again, Jacob! It was a pleasure getting to meet you and I look forward to working with you this season. Please, consider me if you have any other home service needs. I offer leaf cleanup and pressure washing services as well.",
        },
      },
    });

    console.timeEnd("test1");
    console.log(resOne.data);
  } catch (e) {
    console.error(e.message);
    
  }
}

function streamToBuffer(response) {
  return new Promise((resolve, reject) => {
    const writeStream = concat((data) => resolve(data));
    response.on("error", reject);
    response.pipe(writeStream);
  });
}

test().catch(console.log("error"));
