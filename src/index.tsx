import ReactDOM from 'react-dom/client';
import { 
    Application
} from './Application';
import App from './ApplicationView';

import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

//Инициализируем приложение
applicationInit();

//Отображаем GUI приложения
// root.render(<ApplicationView />);
root.render(<App/>);

/**
 * Инициализирует приложение.
 */
async function applicationInit(): Promise<void> {
    await Application.init();
};