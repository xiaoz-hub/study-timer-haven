import { Trash2, BookOpen, X, Plus, Edit3 } from 'lucide-react';
import React, { useState } from 'react';
const SubjectManager = ({ subjects, onSubjectsChange, onClose }) => {
  const [newSubject, setNewSubject] = useState('');
  const [editingSubject, setEditingSubject] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      onSubjectsChange([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const handleDeleteSubject = (subjectToDelete) => {
    onSubjectsChange(subjects.filter((subject) => subject !== subjectToDelete));
  };

  const handleStartEdit = (subject) => {
    setEditingSubject(subject);
    setEditValue(subject);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue.trim() !== editingSubject && !subjects.includes(editValue.trim())) {
      const updatedSubjects = subjects.map(subject => 
        subject === editingSubject ? editValue.trim() : subject
      );
      onSubjectsChange(updatedSubjects);
      setEditingSubject(null);
      setEditValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingSubject(null);
    setEditValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (editingSubject) {
        handleSaveEdit();
      } else {
        handleAddSubject();
      }
    } else if (e.key === 'Escape' && editingSubject) {
      handleCancelEdit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            管理科目
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* 添加新科目 */}
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入新科目名称"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleAddSubject}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 科目列表 */}
        <div className="p-4 md:p-6 max-h-64 overflow-y-auto">
          {subjects.length > 0 ? (
            <div className="space-y-2">
              {subjects.map((subject) => (
                <div key={subject} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {editingSubject === subject ? (
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                      >
                        保存
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-800 dark:text-white font-medium">
                        {subject}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleStartEdit(subject)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(subject)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                还没有添加任何科目
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                在上方输入框中添加您的学习科目
              </p>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectManager;
