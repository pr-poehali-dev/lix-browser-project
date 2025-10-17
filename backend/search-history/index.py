import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление историей поисковых запросов
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database URL not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        query = body_data.get('query', '')
        user_ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', '')
        
        cur.execute(
            "INSERT INTO t_p52045837_lix_browser_project.search_history (query, user_ip) VALUES (%s, %s)",
            (query, user_ip)
        )
        conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'message': 'Search saved'})
        }
    
    if method == 'GET':
        limit = int(event.get('queryStringParameters', {}).get('limit', '10'))
        
        cur.execute(
            "SELECT id, query, search_time, results_count FROM t_p52045837_lix_browser_project.search_history ORDER BY search_time DESC LIMIT %s",
            (limit,)
        )
        
        rows = cur.fetchall()
        history = []
        for row in rows:
            history.append({
                'id': row[0],
                'query': row[1],
                'search_time': row[2].isoformat() if row[2] else None,
                'results_count': row[3]
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'history': history})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
