import React from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Settings } from 'lucide-react';

const Timer = ({ 
  timeLeft, 
  duration, 
  isActive, 
  onStart, 
  onPause, 
  onReset, 
  onDurationChange,
  currentSubject,
  isBreak = false,
  taskStatus = '未开始',
  isPomodoroMode = false,
  onTogglePomodoro
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100 
    : ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  const durationOptions = [15, 25, 30, 45, 60];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
      {/* 番茄钟模式切换 */}
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            番茄钟模式
          </h3>
          <button
            onClick={onTogglePomodoro}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isPomodoroMode
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isPomodoroMode ? '关闭标准模式' : '开启标准模式'}
          </button>
        </div>
        {isPomodoroMode && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            标准番茄钟：25分钟专注 + 5分钟休息循环
          </p>
        )}
      </div>

      {/* 时长选择 */}
      {!isBreak && !isPomodoroMode && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            专注时长
          </h3>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {durationOptions.map((option) => (
              <button
                key={option}
                onClick={() => !isActive && onDurationChange(option)}
                disabled={isActive}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  duration === option
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {option}分钟
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 自定义时长输入 */}
      {!isBreak && !isPomodoroMode && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            自定义时长（分钟）
          </label>
          <input
            type="number"
            min="1"
            max="180"
            value={duration}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              if (!isActive) {
                onDurationChange(Math.min(Math.max(value, 1), 180));
              }
            }}
            disabled={isActive}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
          />
        </div>
      )}

      {/* 当前状态显示 */}
      <div className="text-center mb-4">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
          isBreak 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
            : taskStatus === '已完成'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : taskStatus === '进行中'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {isBreak ? (
            <>
              <Coffee className="w-4 h-4 mr-2" />
              休息中
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 mr-2" />
              {taskStatus}
            </>
          )}
        </div>
      </div>

      {/* 当前科目/休息显示 */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {isBreak ? '休息时间' : '当前科目'}
        </p>
        <p className={`text-lg font-semibold ${isBreak ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
          {isBreak ? '放松一下' : currentSubject || '未选择'}
        </p>
      </div>

      {/* 圆形进度条和计时器 */}
      <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* 背景圆环 */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* 进度圆环 */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className={`transition-all duration-1000 ${
              isBreak ? 'text-blue-500' : isActive ? 'text-green-500' : 'text-gray-400'
            }`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* 时间显示 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-1">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isBreak ? '休息中...' : isActive ? '专注中...' : timeLeft === duration * 60 ? '准备开始' : '已暂停'}
            </div>
          </div>
        </div>
      </div>

      {/* 线性进度条 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>进度</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              isBreak ? 'bg-blue-500' : isActive ? 'bg-green-500' : 'bg-gray-400'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-center space-x-4">
        {!isActive ? (
          <button
            onClick={onStart}
            className={`flex items-center px-8 py-4 rounded-xl text-lg font-medium transition-colors ${
              isBreak 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <Play className="w-6 h-6 mr-2" />
            {isBreak ? '继续休息' : '开始'}
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-lg font-medium"
          >
            <Pause className="w-6 h-6 mr-2" />
            暂停
          </button>
        )}
        
        <button
          onClick={onReset}
          className="flex items-center px-6 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors text-lg font-medium"
        >
          <RotateCcw className="w-6 h-6 mr-2" />
          重置
        </button>
      </div>
    </div>
  );
};

export default Timer;
