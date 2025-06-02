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

def get_all_tasks():
    tasks = db.get('all_tasks')
    return tasks if tasks else []

def save_all_tasks(tasks):
    db.set('all_tasks', tasks)
    db.save()

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
    return jsonify({"message": "Invalid credentials!"}, 401)

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
    # Đảm bảo assigned_user và created_by luôn là string hợp lệ
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
    all_tasks = get_all_tasks()
    all_tasks.append(task)
    save_all_tasks(all_tasks)
    return jsonify({"message": "Task added successfully!", "task": task}), 201

@app.route('/tasks/<username>', methods=['GET'])
def get_user_tasks(username):
    all_tasks = get_all_tasks()
    user_tasks = [t for t in all_tasks if t.get('created_by') == username or t.get('assigned_user') == username]
    return jsonify({"tasks": user_tasks}), 200

@app.route('/task/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    all_tasks = get_all_tasks()
    updated = False
    old_assigned_user = None
    for t in all_tasks:
        if t['id'] == task_id:
            old_assigned_user = t.get('assigned_user')
            # Chỉ update các trường hợp hợp lệ, không ghi đè toàn bộ object
            for key in ['title', 'description', 'due_date', 'status', 'priority', 'assigned_user']:
                if key in data:
                    t[key] = data[key]
            updated = True
            break
    if updated:
        # Nếu assigned_user thay đổi, đảm bảo task chỉ xuất hiện ở user mới và không còn ở user cũ
        if 'assigned_user' in data and old_assigned_user and old_assigned_user != data['assigned_user']:
            # Không cần thao tác gì thêm vì all_tasks là danh sách chung, filter theo assigned_user ở frontend/backend
            pass
        save_all_tasks(all_tasks)
        return jsonify({"message": "Task updated", "task": t}), 200
    return jsonify({"message": "Task not found"}), 404

@app.route('/task/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    all_tasks = get_all_tasks()
    new_tasks = [t for t in all_tasks if t['id'] != task_id]
    if len(new_tasks) == len(all_tasks):
        return jsonify({"message": "Task not found"}), 404
    save_all_tasks(new_tasks)
    return jsonify({"message": "Task deleted"}), 200

@app.route('/dashboard/<username>', methods=['GET'])
def dashboard(username):
    all_tasks = get_all_tasks()
    created = [t for t in all_tasks if t.get('created_by') == username]
    assigned = [t for t in all_tasks if t.get('assigned_user') == username]
    involved = [t for t in all_tasks if t.get('created_by') == username or t.get('assigned_user') == username]
    # Thống kê trạng thái cho toàn bộ hệ thống (tất cả user đều giống nhau)
    completed = [t for t in all_tasks if t.get('status') == 'completed']
    in_progress = [t for t in all_tasks if t.get('status') == 'in_progress']
    overdue = [t for t in all_tasks if t.get('status') == 'open']
    # Thống kê trạng thái cho task được giao cho user này (nếu muốn hiển thị riêng)
    assigned_completed = [t for t in assigned if t.get('status') == 'completed']
    assigned_in_progress = [t for t in assigned if t.get('status') == 'in_progress']
    assigned_open = [t for t in assigned if t.get('status') == 'open']
    return jsonify({
        "total_created": len(created),
        "total_assigned": len(assigned),
        "total_involved": len(involved),
        "completed_created": len(completed),      # Thống kê toàn hệ thống
        "in_progress_created": len(in_progress),  # Thống kê toàn hệ thống
        "overdue_created": len(overdue),          # Thống kê toàn hệ thống
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
    all_tasks = get_all_tasks()
    all_tasks = [t for t in all_tasks if t.get('created_by') != username and t.get('assigned_user') != username]
    save_all_tasks(all_tasks)
    return jsonify({"message": f"User '{username}' deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)
