import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
// import {createAttachmentPresignedUrl} from "../businessLogic/todos";

const XAWS = AWSXRay.captureAWS(AWS)

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})


export function createAttachmentPresignedUrl(attachmentId: string): string {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: parseInt(urlExpiration)
  })
}

export function getAttachmentBucketUrl(attachmentId: string): string {
  return `https://${bucketName}.s3.amazonaws.com/${attachmentId}`
}
