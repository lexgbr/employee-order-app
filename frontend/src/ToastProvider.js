import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider = () => (
  <ToastContainer
    position="top-center"
    autoClose={3000}
    hideProgressBar
    newestOnTop
    closeOnClick
    pauseOnFocusLoss={false}
    draggable
    pauseOnHover
    theme="light"
  />
);

export default ToastProvider;
