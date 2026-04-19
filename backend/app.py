from flask import Flask, jsonify
import mysql.connector
import os
import time

app = Flask(__name__)
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
# Production Database Connection with Retry Logic
def get_db_connection():
    retries = 5
    while retries > 0:
        try:
            connection = mysql.connector.connect(
                host=os.environ.get('DB_HOST', 'db'),
                user=os.environ.get('DB_USER', 'app_user'),
                password=os.environ.get('DB_PASSWORD', 'app_secure_password'),
                database=os.environ.get('DB_NAME', 'production_db')
            )
            return connection
        except mysql.connector.Error as err:
            print(f"Database not ready yet. Retrying in 3 seconds... ({retries} left)")
            retries -= 1
            time.sleep(3)
    raise Exception("Could not connect to the database after multiple retries.")

# Initialize a table for testing
def init_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS server_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                log_message VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        # Insert a test row if table is empty
        cursor.execute("SELECT COUNT(*) FROM server_logs")
        if cursor.fetchone()[0] == 0:
            cursor.execute("INSERT INTO server_logs (log_message) VALUES ('System initialized on mavles.eu.org')")
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"DB Init Error: {e}")

# Run the init function before handling requests
with app.app_context():
    init_db()

@app.route('/api/status', methods=['GET'])
def get_status():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT log_message, created_at FROM server_logs ORDER BY id DESC LIMIT 1")
        latest_log = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return jsonify({
            "message": "Production Python Backend connected to MySQL!",
            "database_log": latest_log['log_message'],
            "status": "200 OK"
        })
    except Exception as e:
        return jsonify({"message": f"Database connection failed: {str(e)}", "status": "500 Error"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)