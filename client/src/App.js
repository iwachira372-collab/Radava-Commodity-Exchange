import Auth from "./components/Auth";
import Kyc from "./components/Kyc";
import BankDetails from './components/BankDetails'
import Profile from './components/Profile'
import Dashboard from "./components/Dashboard";
import Buy from "./components/Buy";
import Sell from "./components/Sell";
import {
  createBrowserRouter,
  BrowserRouter,
  RouterProvider,
  Route,
  Routes
} from "react-router-dom";
import AuthWrapper from "./components/hoc/AuthWrapper";
import Login from "./components/Login";
import Withdraw from "./pages/Withdraw";
import AddtoWallet from "./pages/AddtoWallet";
import WithdrawFromWallet from "./pages/WithdrawFromWallet";
import DepositMoney from "./pages/DepositMoney";
import Portifolio from "./components/Portifolio";
import Success from "./pages/Success";
import Support from "./pages/Support";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from "./components/ResetPassword";
import Otp from "./components/Otp";
import NewPassword from "./components/NewPassword";
import {io} from "socket.io-client"
import OrderHistory from "./pages/Orderhistory";
import Landing from "./components/Landing";
import Receipt from "./components/Receipt";

function App() {
 
  const typeOfLogin = [
    "GMAIL",
    "FACEBOOK",
    "GITHUB",
    "MICROSOFT",
    "Twitter",
    "LINKEDIN",
    "Paypal",
    "Instagram"
  ];

  return (
    <div className="App"> 
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>} />
          <Route path='/dashboard' element={<AuthWrapper><Dashboard/></AuthWrapper>} />
          <Route path='/success' element={<AuthWrapper><Success/></AuthWrapper>} />
          <Route path='/support' element={<AuthWrapper><Support/></AuthWrapper>} />
          <Route path='/buy/:comodity' element={<AuthWrapper><Buy/></AuthWrapper>} />
          <Route path='/sell/:comodity' element={<AuthWrapper><Sell/></AuthWrapper>} />
          <Route path='/buy-or-sell' element={<AuthWrapper><Portifolio/></AuthWrapper>} />
          <Route path='/login' element={<Login typeOfLogin={typeOfLogin} />} />
          <Route path='/funds' element={<AuthWrapper><Withdraw/></AuthWrapper>} />
          {/* Added profile page */}
          <Route path='/profile' element={<AuthWrapper><Profile/></AuthWrapper>}  />
          <Route path='/add-to-wallet' element={<AuthWrapper><AddtoWallet/></AuthWrapper>} />
          <Route path='/top-up-wallet/:amount' element={<AuthWrapper><DepositMoney/></AuthWrapper>} />
          <Route path='/withdraw-from-wallet' element={<AuthWrapper><WithdrawFromWallet/></AuthWrapper>} />
          <Route path='/reset-password' element={<ResetPassword/>} />
          <Route path='/otp/:email' element={<Otp/>} />
          <Route path='/receipt/:id' element={<AuthWrapper><Receipt/></AuthWrapper>} />
          <Route path='/new-password/:hash' element={<NewPassword/>} />
          <Route path="/history" element={<AuthWrapper><OrderHistory/></AuthWrapper>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
