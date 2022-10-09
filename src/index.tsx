import ReactDOM from 'react-dom/client';
import { 
    ApplicationView
} from './ApplicationView';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

//Initialize application
initApp();

//Отображаем GUI приложения
root.render(<ApplicationView />);

/**
 * Initialize application.
 */
async function initApp(): Promise<void> {
    await App.init();
};