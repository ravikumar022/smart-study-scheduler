import React, { useState } from 'react';
import* as chrono from 'chrono-node';

function TaskForm({ onAdd }) {
  const [text, setText] = useState('');

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Voice Input:", transcript);
      setText(transcript);
    };

    recognition.onerror = (e) => {
      console.error('Voice Error:', e);
      alert('Voice input failed. Try again.');
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const parsedDate = chrono.parseDate(text);
    const time = parsedDate ? parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';

    const durationMatch = text.match(/(\d+\.?\d*)\s*(hours|hrs|minutes|mins)/i);
    const duration = durationMatch ? `${durationMatch[1]} ${durationMatch[2]}` : 'Not specified';

    const taskText = text.replace(/(for\s+\d+.*|at\s+\d+.*)/gi, '').trim();

    onAdd({
      text: `${taskText} (${duration} @ ${time})`,
      createdAt: new Date().toISOString()
    });

    setText('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="e.g., Study Java for 2 hrs at 5 PM"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">➕ Add</button>
      <button type="button" onClick={handleVoiceInput}>🎤 Speak</button>
    </form>
  );
}

export default TaskForm;
