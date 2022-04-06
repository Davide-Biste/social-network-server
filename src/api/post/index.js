import { Router } from "express";
import { validateJWT } from "../../services/jwt/index.js";
import Post from "./model.js";
import { getImage, uploadFile } from "../../services/storage/upload.js";
import AWS from "aws-sdk";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    const url = await getImage("keroku.png");
    res.send({ url });
  } catch (e) {
    console.log({ errorGetImage: e });
  }
});

router.post("/", async (req, res) => {
  try {
    const fileName = req.files.file.name;
    await uploadFile(fileName, req.files.file.path);
    return res.json(
      await Post.create({
        type: req.body.type,
        description: req.body.description,
        uri: `https://${process.env.AWS_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${fileName}`,
      })
    );
  } catch (e) {
    console.log({ errorPostPost: e });
  }
});

export default router;
