import React, { useEffect } from 'react';
import { useCustomTranslation } from './i18n';
import './App.css';
import VisualizerPage from './components/VisualizerPage';
import LanguageSwitcher from './components/LanguageSwitcher';
import GithubLink from './components/GithubLink';

function App() {
  const { t } = useCustomTranslation();

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
      {/* 右上角工具栏 */}
      <GithubLink />
      <LanguageSwitcher />
      
      <header className="App-header">
        <VisualizerPage />
      </header>
    </div>
  );
}

export default App;
