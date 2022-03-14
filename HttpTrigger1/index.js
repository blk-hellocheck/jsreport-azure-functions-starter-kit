const JsReport = require("jsreport");
const path = require("path");
const ncp = require("ncp");
const { BlobServiceClient } = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");

let jsreport;
const init = (async () => {
  jsreport = JsReport({
    configFile: path.join(__dirname, "../", "prod.config.json"),
  });

  await ncp(path.join(__dirname, "../", "data"), "/tmp/data");
  return jsreport.init();
})();

module.exports = async function (context, req) {
  try {
    await init;
    // use the request body from post, if not specified return a sample template report for preview in browser
    const res = await jsreport.render(
      req.body || {
        template: {
          name: "invoice",
        },
      }
    );

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AzureWebJobsStorage
    );

    const blobName = "clientId_" + req.body.clientId + "_" + uuidv4() + ".pdf";

    const containerName =
      req.body.template.name === "quote" ? "quotes" : "invoices";

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const uploadResponse = await blockBlobClient.uploadData(res.content);

    const blobUri =
      `https://checkdevstorage.blob.core.windows.net/${containerName}/` +
      blobName;

    context.res = {
      body: blobUri,
    };
  } catch (e) {
    console.warn(e);
    context.res = {
      status: 400,
      body: e.stack,
    };
  }
};
