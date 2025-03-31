import React from 'react';
import './UserGuide.css';

interface UserGuideProps {
  onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ onClose }) => {
  return (
    <div className="visualizer-guide">
      <h3>👉 使用指南</h3>
      <div className="guide-content">
        <p>
          1. <span className="guide-blue">蓝色方块</span>表示非零数，<span className="guide-gray">灰色方块</span>表示零
        </p>
        <p>
          2. <span className="guide-green">绿色标记(S)</span>表示慢指针，<span className="guide-red">红色标记(F)</span>表示快指针
        </p>
        <p>
          3. 点击"播放"开始动画，或使用"上一步"/"下一步"手动控制
        </p>
      </div>
      <button className="guide-close" onClick={onClose}>
        明白了
      </button>
    </div>
  );
};

export default UserGuide; 