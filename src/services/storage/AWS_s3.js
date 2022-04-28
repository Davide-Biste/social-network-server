import AWS from "aws-sdk";
import fs from "fs";
import compress_images from "compress-images";
import _ from "lodash";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

export const uploadFile = async (fileName, path, username, id) => {
  try {
    console.log({ fileName, path, username, id });

    const final = _.trim(path, _.split(path, "/", 7));

    await compress_images(
      path, //path
      final + username,
      { compress_force: false, statistic: true, autoupdate: true },
      false,
      { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
      { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
      { svg: { engine: "svgo", command: "--multipass" } },
      {
        gif: {
          engine: "gifsicle",
          command: ["--colors", "64", "--use-col=web"],
        },
      },
      function (err, completed) {
        if (completed === true) {
          const newPath = _.split(path, "/", 7);
          // Read content from the file
          const fileContent = fs.readFileSync(final + username + newPath[6]);
          // Setting up S3 upload parameters
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${username}/${fileName}`, // File name you want to save as in S3
            Body: fileContent,
            ContentType: "image/jpeg",
          };

          s3.upload(params, function (err, data) {
            if (err) {
              throw err;
            }
            fs.rmSync("img/", { recursive: true, force: true });
            console.log(`File uploaded successfully. ${data.Location}`);
          });
        }
      }
    );
  } catch (e) {
    console.log({ errorUploadImage: e });
  }
};

export const deleteFile = (fileName, username) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${username}/${fileName.toString()}.jpg`,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });
};
