import { useState, useCallback } from 'react';
import RoadmapCanvas from './components/RoadmapCanvas';
import BlockModal from './components/BlockModal';
import GoalModal from './components/GoalModal';
import './App.css';

function genId() {
  return `block-${crypto.randomUUID()}`;
}

const DEFAULT_BLOCKS = [
  {
    id: 'b1',
    text: '小学校',
    row: 'main',
    startAge: 6,
    endAge: 12,
    color: '#4CAF50',
    description: '',
  },
  {
    id: 'b2',
    text: '中学校',
    row: 'main',
    startAge: 12,
    endAge: 15,
    color: '#2196F3',
    description: '',
  },
  {
    id: 'b3',
    text: '高校',
    row: 'main',
    startAge: 15,
    endAge: 18,
    color: '#FF9800',
    description: '',
  },
  {
    id: 'b4',
    text: '大学',
    row: 'main',
    startAge: 18,
    endAge: 22,
    color: '#9C27B0',
    description: '',
  },
];

const DEFAULT_GOAL = { text: '', description: '' };

function loadState() {
  try {
    const saved = localStorage.getItem('roadmap-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        blocks: parsed.blocks || DEFAULT_BLOCKS,
        goal: parsed.goal || DEFAULT_GOAL,
      };
    }
  } catch (e) {
    console.error('Failed to load saved state:', e);
  }
  return { blocks: DEFAULT_BLOCKS, goal: DEFAULT_GOAL };
}

function saveState(blocks, goal) {
  localStorage.setItem('roadmap-state', JSON.stringify({ blocks, goal }));
}

function App() {
  const [state, setState] = useState(loadState);
  const { blocks, goal } = state;

  const [blockModal, setBlockModal] = useState(null);
  const [goalModal, setGoalModal] = useState(false);

  const updateState = useCallback((newBlocks, newGoal) => {
    setState({ blocks: newBlocks, goal: newGoal });
    saveState(newBlocks, newGoal);
  }, []);

  const handleBlockClick = useCallback((block) => {
    setBlockModal({ mode: 'edit', block });
  }, []);

  const handleGoalClick = useCallback(() => {
    setGoalModal(true);
  }, []);

  const handleCanvasDoubleClick = useCallback(({ age, row }) => {
    setBlockModal({
      mode: 'add',
      block: {
        text: '',
        row,
        startAge: age,
        endAge: Math.min(age + 5, 100),
        color: '#4CAF50',
        description: '',
      },
    });
  }, []);

  const handleBlockSave = useCallback(
    (blockData) => {
      let newBlocks;
      if (blockData.id) {
        newBlocks = blocks.map((b) =>
          b.id === blockData.id ? { ...blockData } : b
        );
      } else {
        newBlocks = [...blocks, { ...blockData, id: genId() }];
      }
      updateState(newBlocks, goal);
      setBlockModal(null);
    },
    [blocks, goal, updateState]
  );

  const handleBlockDelete = useCallback(
    (id) => {
      const newBlocks = blocks.filter((b) => b.id !== id);
      updateState(newBlocks, goal);
      setBlockModal(null);
    },
    [blocks, goal, updateState]
  );

  const handleGoalSave = useCallback(
    (goalData) => {
      updateState(blocks, goalData);
      setGoalModal(false);
    },
    [blocks, updateState]
  );

  const handleAddBlock = useCallback(() => {
    setBlockModal({
      mode: 'add',
      block: {
        text: '',
        row: 'main',
        startAge: 22,
        endAge: 30,
        color: '#4CAF50',
        description: '',
      },
    });
  }, []);

  const handleReset = useCallback(() => {
    updateState(DEFAULT_BLOCKS, DEFAULT_GOAL);
  }, [updateState]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🗺️ 人生ロードマップ</h1>
        <p className="app-subtitle">
          ブロックをクリックして編集 ・ キャンバスをダブルクリックで追加
        </p>
        <div className="toolbar">
          <button className="btn-add" onClick={handleAddBlock}>
            ＋ ブロック追加
          </button>
          <button className="btn-goal" onClick={handleGoalClick}>
            🎯 目標を設定
          </button>
          <button className="btn-reset" onClick={handleReset}>
            🔄 リセット
          </button>
        </div>
      </header>

      <main className="app-main">
        <RoadmapCanvas
          blocks={blocks}
          goal={goal}
          onBlockClick={handleBlockClick}
          onGoalClick={handleGoalClick}
          onCanvasDoubleClick={handleCanvasDoubleClick}
        />
      </main>

      {blockModal && (
        <BlockModal
          block={blockModal.block}
          onSave={handleBlockSave}
          onDelete={handleBlockDelete}
          onClose={() => setBlockModal(null)}
        />
      )}

      {goalModal && (
        <GoalModal
          goal={goal}
          onSave={handleGoalSave}
          onClose={() => setGoalModal(false)}
        />
      )}
    </div>
  );
}

export default App;
