import AWS from "aws-sdk";
import fs from "fs";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

export const uploadFile = (fileName, path) => {
  try {
    // Read content from the file
    const fileContent = fs.readFileSync(path);

    // Setting up S3 upload parameters
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName, // File name you want to save as in S3
      Body: fileContent,
      ContentType: "image/jpeg",
    };

    s3.upload(params, function (err, data) {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
    });
  } catch (e) {
    console.log({ errorUploadImage: e });
  }
};
