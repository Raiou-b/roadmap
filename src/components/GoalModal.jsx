import { useState } from 'react';

function getInitialForm(goal) {
  return {
    text: goal?.text || '',
    description: goal?.description || '',
  };
}

export default function GoalModal({ goal, onSave, onClose }) {
  const [form, setForm] = useState(() => getInitialForm(goal));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>人生の目標を設定</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>目標</label>
            <input
              type="text"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="例: 世界を旅する、起業する"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>詳細</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="目標の詳細（任意）"
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <div className="modal-actions-right">
              <button type="button" className="btn-cancel" onClick={onClose}>
                キャンセル
              </button>
              <button type="submit" className="btn-save">
                保存
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
