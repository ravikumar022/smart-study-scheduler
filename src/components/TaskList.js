import React from 'react';

function TaskList({ tasks, onDelete }) {
  return (
    <div className="task-list">
      <h2>🗓️ Today's Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks added yet.</p>
      ) : (
        tasks.map((task, index) => (
          <div key={index} className="task-item">
            <span>{task.text}</span>
            <button onClick={() => onDelete(index)}>❌</button>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;
