import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { getLatestNews } from '../services/NewsApi';
import { sendNewsNotification } from '../utils/notificationUtils';

const TASK_NAME = 'background-news-task';
let lastTitle = '';

TaskManager.defineTask(TASK_NAME, async () => {
  const article = await fetchLatestArticle();
  if (article && article.title !== lastTitle) {
    lastTitle = article.title;
    await sendNewsNotification(article.title, article.url);
  }
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export async function registerNewsBackgroundTask() {
  await BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 60 * 15, 
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
