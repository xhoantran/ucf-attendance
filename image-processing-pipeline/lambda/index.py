#! /usr/bin/env python3
import json
import logging
import re

import boto3
import requests

LOGGER = logging.getLogger()
LOGGER.setLevel(logging.INFO)


def handler(event, context):
    try:
        for sqs_rec in event["Records"]:
            s3_event = json.loads(sqs_rec["body"])

            # Skip the test event
            if "Event" in s3_event.keys() and s3_event["Event"] == "s3:TestEvent":
                break

            # Loop through each record
            for s3_rec in s3_event["Records"]:
                # Get the bucket name and object key from the event
                bucket_name: str = s3_rec["s3"]["bucket"]["name"]
                object_key: str = s3_rec["s3"]["object"]["key"]
                LOGGER.info(f"S3 Record: {bucket_name}/{object_key}")

                REGEX = r"^\d+/\d+_(init|\d+)\.jpeg$"
                match = re.match(REGEX, object_key)

                # Check if the object key is valid
                if not match:
                    break

                # Parse the object key
                parts = object_key.split("/")
                student_id = parts[0]
                attendance_parts = parts[1].split("_")
                attendance_id = attendance_parts[0]
                init_or_timestamp = attendance_parts[1].split(".")[0]

                # If the image is init image, copy it to the student_id/init.jpeg
                if init_or_timestamp == "init":
                    LOGGER.info("Copy init image to %s/init.jpeg", student_id)
                    s3 = boto3.client("s3")
                    s3.copy_object(
                        Bucket=bucket_name,
                        CopySource=f"{bucket_name}/{object_key}",
                        Key=f"{student_id}/init.jpeg",
                    )
                    sendToBackend(attendance_id, "SUCCESS", object_key)
                    break

                LOGGER.info("Compare face with %s/init.jpeg", student_id)
                # Compare the face
                compare_face_res = compareFace(
                    bucket_name,
                    f"{student_id}/init.jpeg",
                    object_key,
                )

                if compare_face_res:
                    face_compare_result = "SUCCESS"
                else:
                    face_compare_result = "FAILED"

                LOGGER.info("Face compare result: %s", face_compare_result)
                sendToBackend(attendance_id, face_compare_result, object_key)

    except Exception as exception:
        LOGGER.error("Exception: %s", exception)
        raise


def sendToBackend(attendance_id, face_recognition_status, face_image):
    res = requests.post(
        "http://10.0.15.46:9999/api/v1/image-processing-callback/",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        json={
            "id": attendance_id,
            "face_recognition_status": face_recognition_status,
            "face_image": face_image,
        },
        verify=False,
    )
    LOGGER.info(
        "Send to backend status code: %s, body: %s", res.status_code, res.content
    )


def compareFace(bucket_name, init_image, target_image):
    # Assign the client type
    reko = boto3.client("rekognition")
    try:
        res = reko.compare_faces(
            SourceImage={
                "S3Object": {
                    "Bucket": bucket_name,
                    "Name": init_image,
                }
            },
            TargetImage={
                "S3Object": {
                    "Bucket": bucket_name,
                    "Name": target_image,
                }
            },
        )
        return len(res["FaceMatches"]) > 0
    except reko.exceptions.InvalidParameterException:
        return False
