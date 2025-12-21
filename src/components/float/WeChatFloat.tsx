/**
 * 微信悬浮球组件
 * 显示交流群入口和二维码
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */

import React, { useState } from 'react';
import './WeChatFloat.css';

interface WeChatFloatProps {
  qrCodeUrl?: string;
  promptText?: string;
}

const WeChatFloat: React.FC<WeChatFloatProps> = ({
  qrCodeUrl = '/wechat-qr.png',
  promptText = "微信扫码发送'leetcode'加入算法交流群",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="wechat-float"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 悬浮按钮 */}
      <div className="float-button">
        <span className="float-icon">💬</span>
        <span className="float-text">交流群</span>
      </div>

      {/* 二维码弹出层 */}
      {isHovered && (
        <div className="qr-popup">
          <div className="qr-container">
            <img
              src={qrCodeUrl}
              alt="微信交流群二维码"
              className="qr-image"
            />
            <p className="qr-prompt">{promptText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeChatFloat;
