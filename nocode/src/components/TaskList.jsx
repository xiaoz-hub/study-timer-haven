import React, { useState } from 'react';
import { CheckCircle, Trash2, Calendar, Clock, BookOpen, TrendingUp } from 'lucide-react';

const TaskList = ({ tasks, onDeleteTask, onClearAllTasks }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const today = new Date().toLocaleDateString('zh-CN');
  const todayTasks = tasks.filter(task => task.date === today);
  const otherTasks = tasks.filter(task => task.date !== today);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 计算统计数据
  const todayTotalMinutes = todayTasks.reduce((sum, task) => sum + task.duration, 0);
  const totalSessions = tasks.length;
  const completedTasks = tasks.filter(task => task.status === '已完成').length;

  const TaskItem = ({ task, showDate = false }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
          task.status === '已完成' ? 'bg-green-500' : 
          task.status === '进行中' ? 'bg-blue-500' : 'bg-gray-400'
        }`}></div>
        <div>
          <div className="font-medium text-gray-800 dark:text-white">
            {task.subject}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-3">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {task.duration}分钟
            </span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatTime(task.completedAt)}
            </span>
            {showDate && (
              <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                {task.date}
              </span>
            )}
            <span className={`text-xs px-2 py-1 rounded ${
              task.status === '已完成' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
              task.status === '进行中' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {task.status}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onDeleteTask(task.id)}
        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  const handleClearAllTasks = () => {
    if (window.confirm('确定要清空所有任务记录吗？此操作不可恢复。')) {
      onClearAllTasks();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
      {/* 统计数据 */}
      <div className="grid grid-cols-3 gap-4 mb-4 md:mb-6">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
            {todayTotalMinutes}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            今日专注(分钟)
          </div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
            {totalSessions}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            总专注次数
          </div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">
            {completedTasks}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">
            已完成任务
          </div>
        </div>
      </div>

      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            完成记录
            <span className="ml-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
              {tasks.length}
            </span>
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          {tasks.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearAllTasks();
              }}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="清除所有记录"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
          {tasks.length > 0 ? (
            <>
              {/* 今日任务 */}
              {todayTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    今日完成 ({todayTasks.length})
                  </h3>
                  <div className="space-y-2">
                    {todayTasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              )}

              {/* 历史任务 */}
              {otherTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    历史记录 ({otherTasks.length})
                  </h3>
                  <div className="space-y-2">
                    {otherTasks.slice(0, 10).map((task) => (
                      <TaskItem key={task.id} task={task} showDate={true} />
                    ))}
                    {otherTasks.length > 10 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                        显示最近10条记录，共{otherTasks.length}条
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                还没有完成任何番茄钟
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                完成第一个专注时段后，记录将显示在这里
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;
