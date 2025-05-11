import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const PomodoroTimer = () => {
  const POMODORO_TIME = 10;
  const SHORT_BREAK_TIME = 5;
  const LONG_BREAK_TIME = 15;

  const [currentTime, setCurrentTime] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState('pomodoro');
  const [cycles, setCycles] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskText, setTaskText] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('pomodoroTasks');
        if (savedTasks) setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Error loading tasks:', e);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
      } catch (e) {
        console.error('Error saving tasks:', e);
      }
    };
    saveTasks();
  }, [tasks]);

  useEffect(() => {
    let interval;
    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev - 1);
      }, 1000);
    } else if (currentTime === 0) {
      handleTimerCompletion();
    }
    return () => clearInterval(interval);
  }, [isRunning, currentTime]);

  const handleTimerCompletion = async () => {
    setIsRunning(false);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Pomodoro',
        body: currentMode === 'pomodoro' ? 'Nghỉ ngơi!' : 'Bắt đầu làm việc!',
      },
      trigger: null,
    });

    if (currentMode === 'pomodoro') {
      setCycles((prev) => prev + 1);
      if (currentTask) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === currentTask ? { ...task, completed: true } : task
          )
        );
        setCurrentTask(null);
      }
      const nextMode = cycles % 4 === 3 ? 'longBreak' : 'shortBreak';
      switchMode(nextMode);
    } else {
      switchMode('pomodoro');
    }
    setTimeout(() => setIsRunning(true), 1000);
  };

  const switchMode = (mode) => {
    setCurrentMode(mode);
    setIsRunning(false);
    switch (mode) {
      case 'pomodoro':
        setCurrentTime(POMODORO_TIME);
        break;
      case 'shortBreak':
        setCurrentTime(SHORT_BREAK_TIME);
        break;
      case 'longBreak':
        setCurrentTime(LONG_BREAK_TIME);
        break;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = () => {
    if (!taskText.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập công việc!');
      return;
    }
    if (taskText.length > 200) {
      Alert.alert('Lỗi', 'Công việc không được vượt quá 200 ký tự!');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setTaskText('');
  };

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    if (isRunning) setIsRunning(false);
    setCurrentTime(POMODORO_TIME);
  };

  const deleteTask = (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa công việc này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        onPress: () => {
          setTasks(tasks.filter((task) => task.id !== id));
          if (currentTask === id) {
            setCurrentTask(null);
            if (isRunning) setIsRunning(false);
          }
        },
      },
    ]);
  };

  const focusTask = (id) => {
    setCurrentTask(id);
    if (currentMode !== 'pomodoro') switchMode('pomodoro');
    if (!isRunning) setIsRunning(true);
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
        <Text style={styles.taskButton}>✅</Text>
      </TouchableOpacity>
      <Text
        style={[styles.taskText, item.completed && styles.taskCompleted]}
        onPress={() => toggleTaskCompletion(item.id)}
      >
        {item.text}
      </Text>
      <View style={styles.taskActions}>
        <TouchableOpacity onPress={() => focusTask(item.id)}>
          <Text style={styles.taskButton}>🔵</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Text style={styles.taskButton}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pomodoro Timer</Text>
      <View style={styles.timerContainer}>
        <View style={styles.modeTabs}>
          {['pomodoro', 'shortBreak', 'longBreak'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.modeTab,
                currentMode === mode && styles.modeTabActive,
              ]}
              onPress={() => switchMode(mode)}
            >
              <Text
                style={[
                  styles.modeTabText,
                  currentMode === mode && { color: '#fff' },
                ]}
              >
                {mode === 'pomodoro'
                  ? 'Pomodoro'
                  : mode === 'shortBreak'
                    ? 'Short Break'
                    : 'Long Break'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {currentTask && (
          <Text style={styles.currentTask}>
            Task: {tasks.find((task) => task.id === currentTask)?.text}
          </Text>
        )}
        <Text style={styles.timer}>{formatTime(currentTime)}</Text>
        <View style={styles.timerControls}>
          <Button
            title={isRunning ? 'Pause' : 'Start'}
            onPress={() => setIsRunning(!isRunning)}
            color={
              currentMode === 'pomodoro'
                ? '#2575fc'
                : currentMode === 'shortBreak'
                  ? '#00bcd4'
                  : '#28a745'
            }
          />
          <Button title="Reset" onPress={() => setCurrentTime(POMODORO_TIME)} color="#6c757d" />
        </View>
        <Text style={styles.cycles}>Chu kỳ: {cycles}</Text>
      </View>

      <View style={styles.taskContainer}>
        <View style={styles.taskInputContainer}>
          <TextInput
            style={styles.taskInput}
            value={taskText}
            onChangeText={setTaskText}
            placeholder="Thêm công việc mới..."
            onSubmitEditing={addTask}
          />
          <Button title="+" onPress={addTask} color="#2575fc" />
        </View>
        {tasks.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
            Danh sách công việc đang trống.
          </Text>
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            style={styles.taskList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2575fc',
    marginBottom: 20,
  },
  timerContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  modeTabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modeTab: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  modeTabActive: {
    backgroundColor: '#2575fc',
  },
  modeTabText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  currentTask: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  timer: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 10,
  },
  cycles: {
    fontSize: 16,
    color: '#333',
  },
  taskContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  taskInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  taskInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskActions: {
    flexDirection: 'row',
  },
  taskButton: {
    fontSize: 20,
    marginLeft: 10,
  },
});

export default PomodoroTimer;
