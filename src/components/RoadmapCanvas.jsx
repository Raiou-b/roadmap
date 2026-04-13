import { useRef } from 'react';

const YEAR_WIDTH = 70;
const MAX_AGE = 100;
const ROW_HEIGHT = 90;
const HEADER_WIDTH = 140;
const CANVAS_WIDTH = HEADER_WIDTH + MAX_AGE * YEAR_WIDTH + 160;
const GOAL_WIDTH = 140;

const ROW_LABELS = [
  { key: 'top', label: '課外活動' },
  { key: 'main', label: '学校・キャリア' },
  { key: 'bottom', label: 'その他' },
];

function ageToX(age) {
  return HEADER_WIDTH + age * YEAR_WIDTH;
}

export default function RoadmapCanvas({
  blocks,
  goal,
  onBlockClick,
  onGoalClick,
  onCanvasDoubleClick,
}) {
  const canvasRef = useRef(null);

  const gridLines = [];
  for (let age = 0; age <= MAX_AGE; age += 10) {
    const x = ageToX(age);
    gridLines.push(
      <div key={`line-${age}`} className="grid-line" style={{ left: x }}>
        <span className="grid-label">{age}歳</span>
      </div>
    );
  }

  const handleDoubleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left + canvas.scrollLeft;
    const y = e.clientY - rect.top + canvas.scrollTop;

    const age = Math.max(0, Math.floor((x - HEADER_WIDTH) / YEAR_WIDTH));

    let row = 'main';
    const headerHeight = 40;
    const relY = y - headerHeight;
    if (relY < ROW_HEIGHT) row = 'top';
    else if (relY < ROW_HEIGHT * 2) row = 'main';
    else row = 'bottom';

    onCanvasDoubleClick({ age, row });
  };

  return (
    <div className="roadmap-scroll-container">
      <div
        className="roadmap-canvas"
        ref={canvasRef}
        onDoubleClick={handleDoubleClick}
        style={{ width: CANVAS_WIDTH, minHeight: ROW_HEIGHT * 3 + 80 }}
      >
        {/* Grid lines */}
        {gridLines}

        {/* Row backgrounds and labels */}
        {ROW_LABELS.map((r, i) => (
          <div
            key={r.key}
            className={`roadmap-row roadmap-row-${r.key}`}
            style={{ top: 40 + i * ROW_HEIGHT, height: ROW_HEIGHT }}
          >
            <div className="row-label">{r.label}</div>
          </div>
        ))}

        {/* Blocks */}
        {blocks.map((block) => {
          const rowIndex = ROW_LABELS.findIndex((r) => r.key === block.row);
          const left = ageToX(block.startAge);
          const width = (block.endAge - block.startAge) * YEAR_WIDTH;
          const top = 40 + rowIndex * ROW_HEIGHT + 15;

          return (
            <div
              key={block.id}
              className="roadmap-block"
              style={{
                left,
                top,
                width: Math.max(width, 40),
                backgroundColor: block.color,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onBlockClick(block);
              }}
              title={block.description || block.text}
            >
              <span className="block-text">{block.text}</span>
              {block.description && (
                <span className="block-desc">{block.description}</span>
              )}
            </div>
          );
        })}

        {/* Goal block */}
        <div
          className="goal-block"
          style={{
            left: CANVAS_WIDTH - GOAL_WIDTH - 20,
            top: 40 + ROW_HEIGHT + 10,
            width: GOAL_WIDTH,
            height: ROW_HEIGHT - 20,
          }}
          onClick={onGoalClick}
        >
          <div className="goal-icon">🎯</div>
          <div className="goal-text">{goal.text || '目標を設定'}</div>
          {goal.description && (
            <div className="goal-desc">{goal.description}</div>
          )}
        </div>
      </div>
    </div>
  );
}
