import React from 'react';
import ReactDOM from 'react-dom/client';
import { Application } from './Application';
import { ApplicationView } from './ApplicationView';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

//Инициализируем приложение
applicationInit();

//Отображаем GUI приложения
root.render(<ApplicationView />);

/**
 * Инициализирует приложение.
 */
async function applicationInit(): Promise<void> {
  await Application.init();
};