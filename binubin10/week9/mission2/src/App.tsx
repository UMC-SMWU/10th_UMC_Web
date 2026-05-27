import { Provider, useSelector } from 'react-redux';
import './App.css';
import CartList from './components/CartList';
import Navbar from './components/Navbar';
import PriceBox from './components/PriceBox';
import Modal from './components/Modal';
import type { RootState } from './store/store';
import store from './store/store';

const AppContent = () => {
  const { isOpen } = useSelector((state: RootState) => state.modal);

  return (
    <>
      {isOpen && <Modal />}
      <Navbar />
      <CartList />
      <PriceBox />
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
