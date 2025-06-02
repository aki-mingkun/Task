from flask import Flask, request, jsonify
from flask_cors import CORS
from pickledb import PickleDB
import uuid
import os

app = Flask(__name__)
CORS(app)

db = PickleDB('database.db')
print("PickleDB file path:", os.path.abspath('database.db'))
print("Writable?", os.access(os.path.abspath('database.db'), os.W_OK))

# Helper functions
def get_all_users():
    users = db.get('users')
    return users if users else {}

def save_all_users(users):
    db.set('users', users)
    db.save()

def get_user_tasks_list(username):
    tasks = db.get(f'tasks_{username}')
    return tasks if tasks else []

def save_user_tasks_list(username, tasks):
    db.set(f'tasks_{username}', tasks)
    db.save()

@app.route('/')
def home():
    return "Task Manager Backend is running!"

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"message": "Username and password required"}), 400
    users = get_all_users()
    if username in users:
        return jsonify({"message": "User already exists!"}), 400
    users[username] = {"password": password}
    save_all_users(users)
    db.set(f'tasks_{username}', [])
    db.save()
    return jsonify({"message": "User registered successfully!"}), 201

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.json
    username = data.get('username')
    password = data.get('password')
    users = get_all_users()
    if username in users and users[username]['password'] == password:
        return jsonify({"message": "Login successful!"}), 200
    return jsonify({"message": "Invalid credentials!"}), 401

@app.route('/users', methods=['GET'])
def get_users():
    users = get_all_users()
    return jsonify([{"username": u} for u in users.keys()]), 200

@app.route('/task', methods=['POST'])
def create_task():
    data = request.json
    print("API /task received data:", data)
    username = data.get('username')
    task_data = data.get('task')
    if not username or not task_data:
        print("Missing username or task_data:", data)
        return jsonify({"message": "Username and task required"}), 400
    task_id = str(uuid.uuid4())
    assigned_user = task_data.get('assigned_user', username)
    task = {
        "id": task_id,
        "title": task_data.get('title'),
        "description": task_data.get('description'),
        "due_date": task_data.get('due_date'),
        "status": task_data.get('status', 'open'),
        "priority": task_data.get('priority', 'low'),
        "created_by": username,
        "assigned_user": assigned_user
    }
    # Lưu vào danh sách task của người tạo
    creator_tasks = get_user_tasks_list(username)
    creator_tasks.append(task)
    save_user_tasks_list(username, creator_tasks)
    # Nếu assigned_user khác người tạo, lưu vào danh sách task của người được giao
    if assigned_user != username:
        assigned_tasks = get_user_tasks_list(assigned_user)
        assigned_tasks.append(task)
        save_user_tasks_list(assigned_user, assigned_tasks)
    print("Created task:", task)
    return jsonify({"message": "Task added successfully!", "task": task}), 201

@app.route('/tasks/<username>', methods=['GET'])
def get_user_tasks(username):
    print(f"API /tasks/{username} called")
    users = get_all_users()
    all_tasks = []
    seen_ids = set()
    for u in users:
        tasks = get_user_tasks_list(u)
        print(f"Tasks for user {u}:", tasks)
        for t in tasks:
            # Bỏ qua task nếu thiếu trường bắt buộc (tránh lỗi frontend)
            if not isinstance(t, dict) or 'id' not in t or 'created_by' not in t or 'assigned_user' not in t:
                continue
            if (t['created_by'] == username or t['assigned_user'] == username) and t['id'] not in seen_ids:
                all_tasks.append(t)
                seen_ids.add(t['id'])
    print(f"Tasks returned for {username}:", all_tasks)
    return jsonify({"tasks": all_tasks}), 200

@app.route('/dashboard/<username>', methods=['GET'])
def dashboard(username):
    # Lấy task do user tạo
    users = get_all_users()
    created = []
    assigned = []
    seen_ids = set()
    for u in users:
        tasks = get_user_tasks_list(u)
        for t in tasks:
            if t['id'] in seen_ids:
                continue
            if t['created_by'] == username:
                created.append(t)
            elif t['assigned_user'] == username:
                assigned.append(t)
            seen_ids.add(t['id'])
    completed = [t for t in created if t['status'] == 'completed']
    in_progress = [t for t in created if t['status'] == 'in_progress']
    overdue = [t for t in created if t['status'] == 'open']
    return jsonify({
        "total_created": len(created),
        "total_assigned": len(assigned),
        "completed_created": len(completed),
        "in_progress_created": len(in_progress),
        "overdue_created": len(overdue),
        "tasks_created": created,
        "tasks_assigned": assigned
    }), 200

@app.route('/user/<username>', methods=['DELETE'])
def delete_user(username):
    users = get_all_users()
    if username not in users:
        return jsonify({"message": "User not found"}), 404
    del users[username]
    save_all_users(users)
    db.rem(f'tasks_{username}')
    db.save()
    return jsonify({"message": f"User '{username}' deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)
