import { useState } from 'react';

const ROW_OPTIONS = [
  { value: 'top', label: '課外活動（部活・サークル）' },
  { value: 'main', label: 'メインライン（学校・キャリア）' },
  { value: 'bottom', label: 'その他（インターン等）' },
];

const COLOR_OPTIONS = [
  '#4CAF50', '#2196F3', '#FF9800', '#9C27B0',
  '#F44336', '#00BCD4', '#FFEB3B', '#795548',
  '#607D8B', '#E91E63',
];

function getInitialForm(block) {
  return {
    text: block?.text || '',
    row: block?.row || 'main',
    startAge: block?.startAge ?? 0,
    endAge: block?.endAge ?? 10,
    color: block?.color || '#4CAF50',
    description: block?.description || '',
  };
}

export default function BlockModal({ block, onSave, onDelete, onClose }) {
  const isEditing = !!block?.id;
  const [form, setForm] = useState(() => getInitialForm(block));

  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.text.trim()) {
      setError('名前を入力してください');
      return;
    }
    if (Number(form.startAge) >= Number(form.endAge)) {
      setError('終了年齢は開始年齢より大きくしてください');
      return;
    }
    onSave({
      ...block,
      ...form,
      startAge: Number(form.startAge),
      endAge: Number(form.endAge),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? 'ブロックを編集' : '新しいブロックを追加'}</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          <div className="form-group">
            <label>名前</label>
            <input
              type="text"
              value={form.text}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="例: 高校、部活、インターンシップ"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>カテゴリ（行）</label>
            <select
              value={form.row}
              onChange={(e) => handleChange('row', e.target.value)}
            >
              {ROW_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>開始年齢</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.startAge}
                onChange={(e) => handleChange('startAge', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>終了年齢</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.endAge}
                onChange={(e) => handleChange('endAge', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>色</label>
            <div className="color-picker">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch ${form.color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => handleChange('color', c)}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>メモ</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="詳細メモ（任意）"
              rows={3}
            />
          </div>

          <div className="modal-actions">
            {isEditing && (
              <button
                type="button"
                className="btn-delete"
                onClick={() => onDelete(block.id)}
              >
                削除
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="btn-cancel" onClick={onClose}>
                キャンセル
              </button>
              <button type="submit" className="btn-save">
                {isEditing ? '更新' : '追加'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
