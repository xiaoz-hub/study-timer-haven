import { useLocalStorage } from '../hooks/useLocalStorage';
import TaskList from '../components/TaskList';
import React, { useEffect, useRef, useState } from 'react';
import Timer from '../components/Timer';
import { Play, Pause, RotateCcw, Plus, Trash2, BookOpen, CheckCircle, Clock, Coffee } from 'lucide-react';
import SubjectManager from '../components/SubjectManager';
const Index = () => {
  const [subjects, setSubjects] = useLocalStorage('pomodoro-subjects', []);
  const [tasks, setTasks] = useLocalStorage('pomodoro-tasks', []);
  const [currentSubject, setCurrentSubject] = useLocalStorage('current-subject', '');
  const [duration, setDuration] = useLocalStorage('current-duration', 25);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [showSubjectManager, setShowSubjectManager] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [taskStatus, setTaskStatus] = useLocalStorage('task-status', '未开始');
  const [isPomodoroMode, setIsPomodoroMode] = useLocalStorage('pomodoro-mode', false);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // 创建音频上下文用于提示音
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.close();
      }
    };
  }, []);

  const playNotificationSound = () => {
    if (audioRef.current) {
      const oscillator = audioRef.current.createOscillator();
      const gainNode = audioRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioRef.current.destination);

      oscillator.frequency.setValueAtTime(800, audioRef.current.currentTime);
      oscillator.frequency.setValueAtTime(600, audioRef.current.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioRef.current.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioRef.current.currentTime + 0.5);

      oscillator.start(audioRef.current.currentTime);
      oscillator.stop(audioRef.current.currentTime + 0.5);
    }

    // 震动提醒
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            playNotificationSound();

            if (isBreak) {
              // 休息结束，回到专注模式
              setIsBreak(false);
              setTaskStatus('未开始');
              setIsActive(false);
              setTimeLeft(isPomodoroMode ? 25 * 60 : duration * 60);
            } else {
              // 专注结束
              if (isPomodoroMode) {
                // 标准番茄钟模式：自动进入休息
                setIsBreak(true);
                setTaskStatus('已完成');
                setIsActive(true);
                setTimeLeft(5 * 60); // 5分钟休息
              } else {
                // 普通模式：停止计时
                setIsActive(false);
                setTaskStatus('已完成');
              }
              handleTimerComplete();
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, isBreak, duration, isPomodoroMode]);

  const handleTimerComplete = () => {
    if (currentSubject && !isBreak) {
      const newTask = {
        id: Date.now(),
        subject: currentSubject,
        duration: isPomodoroMode ? 25 : duration,
        completedAt: new Date().toISOString(),
        date: new Date().toLocaleDateString('zh-CN'),
        status: '已完成'
      };
      setTasks((prev) => [newTask, ...prev]);
    }

    // 浏览器通知
    if (Notification.permission === 'granted') {
      if (isBreak) {
        new Notification('休息结束！', {
          body: '准备开始下一个专注时段',
          icon: '/favicon.ico'
        });
      } else {
        new Notification('番茄钟完成！', {
          body: `您已完成 ${isPomodoroMode ? 25 : duration} 分钟的 ${currentSubject} 学习`,
          icon: '/favicon.ico'
        });
      }
    }
  };

  const handleStart = () => {
    if (!currentSubject && !isBreak) {
      alert('请先选择一个学习科目');
      return;
    }
    setIsActive(true);
    if (!isBreak) {
      setTaskStatus('进行中');
    }
  };

  const handlePause = () => {
    setIsActive(false);
    if (!isBreak) {
      setTaskStatus('未开始');
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setIsBreak(false);
    setTaskStatus('未开始');
    setTimeLeft(isPomodoroMode ? 25 * 60 : duration * 60);
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    if (!isActive && !isBreak) {
      setTimeLeft(newDuration * 60);
    }
  };

  const handleTogglePomodoro = () => {
    setIsPomodoroMode(!isPomodoroMode);
    if (!isActive && !isBreak) {
      setTimeLeft(isPomodoroMode ? duration * 60 : 25 * 60);
    }
  };

  const clearAllTasks = () => {
    if (window.confirm('确定要清空所有任务记录吗？此操作不可恢复。')) {
      setTasks([]);
    }
  };

  const clearAllData = () => {
    if (window.confirm('确定要清空所有数据吗？包括科目和任务记录，此操作不可恢复。')) {
      setSubjects([]);
      setTasks([]);
      setCurrentSubject('');
      setDuration(25);
      setTaskStatus('未开始');
      setIsPomodoroMode(false);
      handleReset();
    }
  };

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // 科目同步逻辑：确保当前选中的科目存在于科目列表中
  useEffect(() => {
    // 如果科目列表为空，重置当前科目
    if (subjects.length === 0) {
      setCurrentSubject('');
    }
    // 如果当前科目不在科目列表中，重置当前科目
    else if (currentSubject && !subjects.includes(currentSubject)) {
      setCurrentSubject('');
    }
  }, [subjects, currentSubject, setCurrentSubject]);

  // 排序任务：今日任务在前，按完成时间倒序
  const sortedTasks = [...tasks].sort((a, b) => {
    const today = new Date().toLocaleDateString('zh-CN');
    if (a.date === today && b.date !== today) return -1;
    if (a.date !== today && b.date === today) return 1;
    return new Date(b.completedAt) - new Date(a.completedAt);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-md md:max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            番茄钟督学
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            专注学习，高效成长
          </p>
        </div>

        {/* 桌面端双列布局，移动端单列布局 */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧：科目选择和计时器 */}
          <div className="w-full md:w-1/2 space-y-6">
            {/* 科目选择 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  学习科目
                </h2>
                <button
                  onClick={() => setShowSubjectManager(true)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {subjects.length > 0 ?
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {subjects.map((subject) =>
                <button
                  key={subject}
                  onClick={() => setCurrentSubject(subject)}
                  className={`p-3 md:p-4 rounded-lg text-sm font-medium transition-colors ${
                  currentSubject === subject ?
                  'bg-blue-500 text-white' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`
                  }>
                  
                    {subject}
                  </button>
                )}
                </div> :

              <p className="text-gray-500 dark:text-gray-400 text-center py-4 md:py-6">
                点击 + 添加学习科目
              </p>
              }
            </div>

            {/* 计时器 */}
            <Timer
              timeLeft={timeLeft}
              duration={isBreak ? 5 : isPomodoroMode ? 25 : duration}
              isActive={isActive}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              onDurationChange={handleDurationChange}
              currentSubject={currentSubject}
              isBreak={isBreak}
              taskStatus={taskStatus}
              isPomodoroMode={isPomodoroMode}
              onTogglePomodoro={handleTogglePomodoro} />
          </div>

          {/* 右侧：任务历史 */}
          <div className="w-full md:w-1/2">
            <TaskList
              tasks={sortedTasks}
              onDeleteTask={(taskId) => setTasks((prev) => prev.filter((t) => t.id !== taskId))}
              onClearAllTasks={clearAllTasks} />
            
          </div>
        </div>

        {/* 清空数据按钮 - 仅在移动端显示 */}
        <div className="mt-6 md:hidden space-y-3">
          <div />




          
          
          <div />




          
        </div>

        {/* 科目管理弹窗 */}
        {showSubjectManager &&
        <SubjectManager
          subjects={subjects}
          onSubjectsChange={setSubjects}
          onClose={() => setShowSubjectManager(false)} />

        }
      </div>
    </div>);

};

export default Index;
