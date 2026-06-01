import './App.css'
import Navbar from './components/Navbar'
import CartList from './components/CartList'
import { Provider } from 'react-redux'
import store from './store/store'
import PriceBox from './components/PriceBox'
import Modal from './components/Modal'

function App() {
  return (
    <Provider store={store}>
      <Modal />
      <Navbar />
      <CartList />
      <PriceBox />
    </Provider>

  )
}

export default App
