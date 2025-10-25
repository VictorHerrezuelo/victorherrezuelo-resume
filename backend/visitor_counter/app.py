import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
count_table = dynamodb.Table(os.environ['COUNT_TABLE'])
ids_table = dynamodb.Table(os.environ['IDS_TABLE'])

def lambda_handler(event, context):
    method = event.get('httpMethod', 'GET')

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        visitor_id = body.get('visitorId')

        if not visitor_id:
            return {
                "statusCode": 400,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "Missing visitorId"})
            }

        # Check if visitor already counted
        existing = ids_table.get_item(Key={'id': visitor_id}).get('Item')
        if not existing:
            # Add the visitor ID
            ids_table.put_item(Item={'id': visitor_id})

            # Increment total count
            count_table.update_item(
                Key={'id': 'visitor_count'},
                UpdateExpression='SET #c = if_not_exists(#c, :zero) + :inc',
                ExpressionAttributeNames={'#c': 'count'},
                ExpressionAttributeValues={':inc': 1, ':zero': 0}
            )

    # Return current total count
    response = count_table.get_item(Key={'id': 'visitor_count'})
    count = int(response.get('Item', {}).get('count', 0))

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        "body": json.dumps({"count": count})
    }
