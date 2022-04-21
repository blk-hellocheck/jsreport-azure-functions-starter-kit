const axios = require("axios");
const fs = require("fs");
const concat = require("concat-stream");

const AZURE_FUNCTION_TRIGGER_URL =
  "https://checkdev.azurewebsites.net/api/httptrigger1";

async function test() {
  console.time("test1");
  try {
    const resOne = await axios({
      url: AZURE_FUNCTION_TRIGGER_URL,
      method: "post",
      headers: {
        "x-functions-key":
          "lKQjqTy265LXQX6pwWaHYg3N9Ym/Yh82RryBn6vhp106klQW/wWngw==",
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

    console.time("test2");

    const resTwo = await axios({
      url: AZURE_FUNCTION_TRIGGER_URL,
      method: "post",
      headers: {
        "x-functions-key":
          "lKQjqTy265LXQX6pwWaHYg3N9Ym/Yh82RryBn6vhp106klQW/wWngw==",
      },
      data: {
        template: {
          name: "invoice",
        },
        clientId: 103,
        data: {
          date: "June 1, 2021",
          businessName: "Lawns Company",
          businessAddress: "1234 Main St. Central City, ST 12345",
          logoUrl:
            "https://prodblock.blob.core.windows.net/logos/Operator_7956_Business_Logo.png",
          operatorPhoneNumber: "555-555-5555",
          operatorEmailAddress: "matthew@lawnscompany.com",
          operatorName: "Matthew Armstrong",
          clientName: "Blake Anderson",
          paymentTerms: "30 days",
          serviceDetails: [
            {
              service: {
                name: "Lawn Care",
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
                name: "Edge Setting",
              },
              price: "20.00",
            },
            {
              service: {
                name: "Gutter Cleaning",
              },
              price: "40.00",
            },
          ],
          totalAmount: "115.00",
          stripeLink: "https://www.stripe.com",
          notes:
            "Thank you again, Jacob! It was a pleasure serving you this season. I look forward to working with you again next year. Please, consider me if you have any future needs during the Fall and Winter. I offer leaf cleanup and pressure washing services as well.",
        },
      },
    });

    console.log(resTwo.data);
    console.timeEnd("test2");
  } catch (e) {
    console.error(e.message);
    if (e.response) {
      const responseBuffer = await streamToBuffer(e.response.data);
      console.error(responseBuffer.toString());
    }
  }
}

function streamToBuffer(response) {
  return new Promise((resolve, reject) => {
    const writeStream = concat((data) => resolve(data));
    response.on("error", reject);
    response.pipe(writeStream);
  });
}

test().catch(console.error);
