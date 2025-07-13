import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

interface Memo {
  id: string;
  title: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  completed: boolean;
  createdAt: string;
}

type FilterType = 'all' | 'pending' | 'completed' | 'high';

const ScheduleMemo: React.FC = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const savedMemos = localStorage.getItem('schedule-memos');
    if (savedMemos) {
      setMemos(JSON.parse(savedMemos));
    }
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  useEffect(() => {
    localStorage.setItem('schedule-memos', JSON.stringify(memos));
  }, [memos]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addMemo = () => {
    if (!title.trim()) {
      alert('할 일을 입력해주세요!');
      return;
    }

    const newMemo: Memo = {
      id: generateId(),
      title: title.trim(),
      date,
      time,
      priority,
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setMemos(prev => [...prev, newMemo]);
    clearInputs();
  };

  const clearInputs = () => {
    setTitle('');
    setDescription('');
    setTime('');
    setPriority('low');
  };

  const deleteMemo = (id: string) => {
    if (window.confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      setMemos(prev => prev.filter(memo => memo.id !== id));
    }
  };

  const toggleComplete = (id: string) => {
    setMemos(prev => prev.map(memo => 
      memo.id === id ? { ...memo, completed: !memo.completed } : memo
    ));
  };

  const editMemo = (id: string) => {
    const memo = memos.find(m => m.id === id);
    if (!memo) return;

    const newTitle = window.prompt('할 일 수정:', memo.title);
    if (newTitle !== null && newTitle.trim()) {
      setMemos(prev => prev.map(memo => 
        memo.id === id ? { ...memo, title: newTitle.trim() } : memo
      ));
    }
  };

  const getFilteredMemos = () => {
    switch (currentFilter) {
      case 'completed':
        return memos.filter(memo => memo.completed);
      case 'pending':
        return memos.filter(memo => !memo.completed);
      case 'high':
        return memos.filter(memo => memo.priority === 'high');
      default:
        return memos;
    }
  };

  const formatDate = (date: string, time: string) => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dateStr = '';
    if (dateObj.toDateString() === today.toDateString()) {
      dateStr = '오늘';
    } else if (dateObj.toDateString() === tomorrow.toDateString()) {
      dateStr = '내일';
    } else {
      dateStr = dateObj.toLocaleDateString('ko-KR');
    }
    
    if (time) {
      dateStr += ` ${time}`;
    }
    
    return dateStr;
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '보통';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const sortedMemos = getFilteredMemos().sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    if (a.date && b.date) {
      const dateA = new Date(a.date + ' ' + (a.time || '00:00'));
      const dateB = new Date(b.date + ' ' + (b.time || '00:00'));
      return dateA.getTime() - dateB.getTime();
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filterButtons = [
    { key: 'all', label: '전체' },
    { key: 'pending', label: '진행중' },
    { key: 'completed', label: '완료' },
    { key: 'high', label: '높은 우선순위' }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <Calendar className="w-8 h-8" />
              일정 관리 메모장
            </CardTitle>
            <p className="text-blue-100">효율적인 일정 관리로 더 나은 하루를 만들어보세요</p>
          </CardHeader>
        </Card>

        {/* Input Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="할 일을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addMemo()}
                className="md:col-span-2"
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
              </select>
              <Textarea
                placeholder="상세 설명 (선택사항)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="md:col-span-2 min-h-10"
                rows={1}
              />
              <Button onClick={addMemo} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                추가
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter Section */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 self-center mr-2">필터:</span>
          {filterButtons.map(({ key, label }) => (
            <Button
              key={key}
              variant={currentFilter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentFilter(key)}
              className={currentFilter === key ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Memo List */}
        <div className="space-y-4">
          {sortedMemos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {currentFilter === 'all' ? '아직 등록된 일정이 없습니다' : '해당하는 일정이 없습니다'}
                </h3>
                <p className="text-gray-500">
                  {currentFilter === 'all' ? '위에서 새로운 일정을 추가해보세요!' : '다른 필터를 선택해보세요.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedMemos.map((memo) => (
              <Card key={memo.id} className={`transition-all hover:shadow-md ${memo.completed ? 'opacity-70' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`text-lg font-semibold ${memo.completed ? 'line-through text-gray-500' : ''}`}>
                      {memo.title}
                    </h3>
                    <Badge variant={getPriorityColor(memo.priority)}>
                      {getPriorityText(memo.priority)}
                    </Badge>
                  </div>
                  
                  {(memo.date || memo.time) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Clock className="w-4 h-4" />
                      {formatDate(memo.date, memo.time)}
                    </div>
                  )}
                  
                  {memo.description && (
                    <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                      {memo.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={memo.completed ? "outline" : "default"}
                      onClick={() => toggleComplete(memo.id)}
                      className={memo.completed ? "" : "bg-green-600 hover:bg-green-700"}
                    >
                      {memo.completed ? <X className="w-4 h-4 mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                      {memo.completed ? '미완료' : '완료'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editMemo(memo.id)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      수정
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMemo(memo.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      삭제
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleMemo;