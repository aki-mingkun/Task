### Bước 1: Cài đặt các thư viện cần thiết

Trước tiên, bạn cần cài đặt Flask và PickleDB. Bạn có thể làm điều này bằng cách sử dụng pip:

```bash
pip install Flask pickledb==1.3.2
```

### Bước 2: Tạo cấu trúc thư mục

Tạo cấu trúc thư mục cho dự án của bạn như sau:

```
project/
│
├── backend/
│   ├── app.py
│   └── db.py
│
└── front/
    ├── index.html
    └── script.js
```

### Bước 3: Tạo file `db.py` để quản lý cơ sở dữ liệu

```python
# backend/db.py
import pickledb

# Khởi tạo PickleDB
db = pickledb.load('database.db', auto_dump=True)

# Hàm để thêm người dùng
def add_user(username, password):
    if not db.get(username):
        db.set(username, password)
        db.dump()
        return True
    return False

# Hàm để xác thực người dùng
def authenticate_user(username, password):
    stored_password = db.get(username)
    return stored_password == password if stored_password else False

# Hàm để thêm task
def add_task(username, task):
    tasks = db.get(f'tasks_{username}') or []
    tasks.append(task)
    db.set(f'tasks_{username}', tasks)
    db.dump()

# Hàm để lấy task
def get_tasks(username):
    return db.get(f'tasks_{username}') or []
```

### Bước 4: Tạo file `app.py` để thiết lập backend

```python
# backend/app.py
from flask import Flask, request, jsonify
from db import add_user, authenticate_user, add_task, get_tasks

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if add_user(username, password):
        return jsonify({"message": "User registered successfully!"}), 201
    return jsonify({"message": "User already exists!"}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if authenticate_user(username, password):
        return jsonify({"message": "Login successful!"}), 200
    return jsonify({"message": "Invalid credentials!"}), 401

@app.route('/task', methods=['POST'])
def create_task():
    data = request.json
    username = data.get('username')
    task = data.get('task')
    add_task(username, task)
    return jsonify({"message": "Task added successfully!"}), 201

@app.route('/tasks/<username>', methods=['GET'])
def get_user_tasks(username):
    tasks = get_tasks(username)
    return jsonify({"tasks": tasks}), 200

if __name__ == '__main__':
    app.run(debug=True)
```

### Bước 5: Tạo file `index.html` cho frontend

```html
<!-- front/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager</title>
</head>
<body>
    <h1>Task Manager</h1>
    <div>
        <h2>Register</h2>
        <input type="text" id="reg-username" placeholder="Username">
        <input type="password" id="reg-password" placeholder="Password">
        <button onclick="register()">Register</button>
    </div>
    <div>
        <h2>Login</h2>
        <input type="text" id="login-username" placeholder="Username">
        <input type="password" id="login-password" placeholder="Password">
        <button onclick="login()">Login</button>
    </div>
    <div>
        <h2>Add Task</h2>
        <input type="text" id="task-username" placeholder="Username">
        <input type="text" id="task" placeholder="Task">
        <button onclick="addTask()">Add Task</button>
    </div>
    <div>
        <h2>Your Tasks</h2>
        <button onclick="getTasks()">Get Tasks</button>
        <pre id="tasks"></pre>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### Bước 6: Tạo file `script.js` cho frontend

```javascript
// front/script.js
async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    alert(data.message);
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    alert(data.message);
}

async function addTask() {
    const username = document.getElementById('task-username').value;
    const task = document.getElementById('task').value;
    const response = await fetch('/task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, task })
    });
    const data = await response.json();
    alert(data.message);
}

async function getTasks() {
    const username = document.getElementById('task-username').value;
    const response = await fetch(`/tasks/${username}`);
    const data = await response.json();
    document.getElementById('tasks').innerText = JSON.stringify(data.tasks, null, 2);
}
```

### Bước 7: Chạy ứng dụng

1. Chạy backend bằng cách vào thư mục `backend` và chạy lệnh:

```bash
python app.py
```

2. Mở file `index.html` trong trình duyệt để sử dụng frontend.

### Lưu ý

- Đảm bảo rằng bạn đã cài đặt Python và các thư viện cần thiết.
- Bạn có thể mở rộng và cải thiện mã nguồn này theo nhu cầu của dự án.
- Để triển khai thực tế, bạn nên xem xét các biện pháp bảo mật như mã hóa mật khẩu và xác thực người dùng.