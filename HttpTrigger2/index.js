const JsReport = require("jsreport");
const path = require("path");
const ncp = require("ncp");
const { BlobServiceClient } = require("@azure/storage-blob");

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
    context.log.verbose(req.template, req.data);
    await init;
    // use the request body from post, if not specified return a sample template report for preview in browser
    const res = await jsreport.render({
      template: req.template,
      data: req.data,
    });

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AzureWebJobsStorage
    );

    const blobName = req.blobName;
    context.log.verbose("BloblName:", blobName);
    const containerName = req.template.name === "quote" ? "quotes" : "invoices";

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const blobOptions = {
      blobHTTPHeaders: { blobContentType: "application/pdf" },
    };

    const uploadResponse = await blockBlobClient.upload(
      res.content,
      res.content.length,
      blobOptions
    );

    const blobUri =
      `https://checkprodstorage.blob.core.windows.net/${containerName}/` +
      blobName;

    context.res = {
      body: blobUri,
    };

    context.done();
  } catch (e) {
    console.warn(e);
    context.res = {
      status: 400,
      body: e.stack,
    };
  }
};
