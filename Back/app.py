from flask import Flask, request, jsonify
from flask_cors import CORS
from pickledb import PickleDB
import uuid
import os

app = Flask(__name__)
CORS(app)


# Sử dụng đường dẫn tuyệt đối cho database (pickleDB 1.3.2)
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)
DB_PATH = os.path.join(DATA_DIR, 'tasks.db')
db = PickleDB(DB_PATH)

# Helper functions
def get_all_users():
    users = db.get('users')
    return users if users else {}

def save_all_users(users):
    db.set('users', users)
    db.save()

def get_all_task_ids():
    ids = db.get('all_task_ids')
    return ids if ids else []

def save_all_task_ids(ids):
    db.set('all_task_ids', ids)
    db.save()

def get_task_by_id(task_id):
    return db.get(f'task_{task_id}')

def save_task(task):
    db.set(f'task_{task["id"]}', task)
    db.save()

def delete_task_by_id(task_id):
    db.rem(f'task_{task_id}')
    db.save()

def get_all_tasks():
    ids = get_all_task_ids()
    return [get_task_by_id(tid) for tid in ids if get_task_by_id(tid)]

@app.route('/')
def home():
    return "Task Manager Backend is running!"

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    if not username or not password or not email:
        return jsonify({"message": "Username, email and password required"}), 400
    users = get_all_users()
    if username in users:
        return jsonify({"message": "User already exists!"}), 400
    users[username] = {"password": password, "email": email}
    save_all_users(users)
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
    return jsonify([{"username": u, "email": users[u].get("email", "")} for u in users.keys()]), 200

@app.route('/task', methods=['POST'])
def create_task():
    data = request.json
    username = data.get('username')
    task_data = data.get('task')
    if not username or not task_data:
        return jsonify({"message": "Username and task required"}), 400
    task_id = str(uuid.uuid4())
    assigned_user = task_data.get('assigned_user') or username
    if not assigned_user:
        assigned_user = username
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
    ids = get_all_task_ids()
    ids.append(task_id)
    save_all_task_ids(ids)
    save_task(task)
    return jsonify({"message": "Task added successfully!", "task": task}), 201

@app.route('/tasks/<username>', methods=['GET'])
def get_user_tasks(username):
    all_tasks = get_all_tasks()
    user_tasks = [t for t in all_tasks if t and (t.get('created_by') == username or t.get('assigned_user') == username)]
    return jsonify({"tasks": user_tasks}), 200

@app.route('/task/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    task = get_task_by_id(task_id)
    if not task:
        return jsonify({"message": "Task not found"}), 404
    for key in ['title', 'description', 'due_date', 'status', 'priority', 'assigned_user']:
        if key in data:
            task[key] = data[key]
    save_task(task)
    return jsonify({"message": "Task updated", "task": task}), 200

@app.route('/task/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    ids = get_all_task_ids()
    if task_id not in ids:
        return jsonify({"message": "Task not found"}), 404
    ids = [tid for tid in ids if tid != task_id]
    save_all_task_ids(ids)
    delete_task_by_id(task_id)
    return jsonify({"message": "Task deleted"}), 200

@app.route('/dashboard/<username>', methods=['GET'])
def dashboard(username):
    all_tasks = get_all_tasks()
    created = [t for t in all_tasks if t and t.get('created_by') == username]
    assigned = [t for t in all_tasks if t and t.get('assigned_user') == username]
    involved = [t for t in all_tasks if t and (t.get('created_by') == username or t.get('assigned_user') == username)]
    completed = [t for t in all_tasks if t and t.get('status') == 'completed']
    in_progress = [t for t in all_tasks if t and t.get('status') == 'in_progress']
    overdue = [t for t in all_tasks if t and t.get('status') == 'open']
    assigned_completed = [t for t in assigned if t.get('status') == 'completed']
    assigned_in_progress = [t for t in assigned if t.get('status') == 'in_progress']
    assigned_open = [t for t in assigned if t.get('status') == 'open']
    return jsonify({
        "total_created": len(created),
        "total_assigned": len(assigned),
        "total_involved": len(involved),
        "completed_created": len(completed),
        "in_progress_created": len(in_progress),
        "overdue_created": len(overdue),
        "completed_assigned": len(assigned_completed),
        "in_progress_assigned": len(assigned_in_progress),
        "open_assigned": len(assigned_open),
        "tasks_created": created,
        "tasks_assigned": assigned,
        "tasks_involved": involved
    }), 200

@app.route('/user/<username>', methods=['DELETE'])
def delete_user(username):
    users = get_all_users()
    if username not in users:
        return jsonify({"message": "User not found"}), 404
    del users[username]
    save_all_users(users)
    # Xóa các task liên quan đến user này
    ids = get_all_task_ids()
    to_delete = []
    for tid in ids:
        t = get_task_by_id(tid)
        if t and (t.get('created_by') == username or t.get('assigned_user') == username):
            delete_task_by_id(tid)
            to_delete.append(tid)
    ids = [tid for tid in ids if tid not in to_delete]
    save_all_task_ids(ids)
    return jsonify({"message": f"User '{username}' deleted"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)