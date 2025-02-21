const API_URL = "http://localhost:8080/api/todos";  // REST API 주소

document.addEventListener("DOMContentLoaded", () => {
    fetchTasks(); // 페이지 로딩 시 할 일 목록 가져오기
    setupInputListener(); // 입력 감지 이벤트 리스너 추가
});

// 할 일 목록 가져오기
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("서버에서 데이터를 가져오는 데 실패했습니다.");

        const tasks = await response.json();
        const todoList = document.getElementById("todo-list");
        todoList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id}, ${task.completed})">
                    ${task.title}
                </span>
                <button class="delete-btn" onclick="deleteTask(${task.id})">삭제</button>
            `;
            todoList.appendChild(li);
        });
    } catch (error) {
        console.error("fetchTasks 에러:", error);
    }
}

// 할 일 추가하기
async function addTask() {
    const input = document.getElementById("todo-input");
    const addButton = document.getElementById("add-btn");
    const title = input.value.trim();

    if (title === "") return;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, completed: false })
        });

        if (!response.ok) throw new Error("할 일 추가 실패");

        input.value = "";  // 입력창 초기화
        addButton.disabled = true; // 다시 비활성화
        fetchTasks();  // UI 업데이트
    } catch (error) {
        console.error("addTask 에러:", error);
    }
}

// 할 일 완료 상태 변경
async function toggleTask(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !completed })
        });

        if (!response.ok) throw new Error("할 일 상태 변경 실패");

        fetchTasks();  // UI 업데이트
    } catch (error) {
        console.error("toggleTask 에러:", error);
    }
}

// 할 일 삭제하기
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

        if (!response.ok) throw new Error("할 일 삭제 실패");

        fetchTasks();  // UI 업데이트
    } catch (error) {
        console.error("deleteTask 에러:", error);
    }
}

// 입력값이 있을 때 버튼 활성화하는 함수
function setupInputListener() {
    const input = document.getElementById("todo-input");
    const addButton = document.getElementById("add-btn");

    input.addEventListener("input", function () {
        addButton.disabled = this.value.trim().length === 0;
    });
}
