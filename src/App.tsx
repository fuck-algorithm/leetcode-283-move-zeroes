import React, { useEffect } from 'react';
import './App.css';
import VisualizerPage from './components/VisualizerPage';

function App() {
  // 添加键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 在这里可以分发键盘事件，但由于我们没有设置全局状态管理
      // 所以我们将在具体组件中实现键盘事件响应
      // 这部分代码可以扩展为使用Context API或Redux进行状态管理
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <div className="App">
      <div className="App-header">
        <VisualizerPage />
      </div>
    </div>
  );
}

export default App;
