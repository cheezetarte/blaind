import {
    BrowserRouter,
    Route,
    Routes,
  } from "react-router-dom";
  
import Main from "./pages/main/Main";
import QnABoard from './pages/board/QnABoard'
import NoticeBoard from './pages/board/NoticeBoard'
import ExampleBoard from './pages/board/ExampleBoard'
import Login from "./pages/login/Login"
import Intro from "./pages/intro/intro";
import Pricing from "./pages/pricing/Pricing";
import PostDetail from "./pages/board/PostDetail"
import ModifyPost from "./pages/board/modifypost"
import MakePost from "./pages/board/makeboardcomp"
import SelectPlan from "./pages/Sign-up/SelectPlan"
import SignUp from "./pages/Sign-up/Sign-up";
import Payment from "./pages/payment/Payment";
import PayResult from "./pages/payment/PayResult";
import Welcome from "./pages/Sign-up/Welcome";
import Edit from "./pages/edit/Edit";
import FindPwd from "./pages/login/FindPwd";
import MyPage from "./pages/mypage/MyPage";
import PrivateRoute from "./components/PrivateRoute";
import Confirm from "./pages/login/Confirm";
import ResetPwd from "./pages/login/ResetPwd";
import PublicRoute from "./components/PublicRoute";
import Youtube from "./pages/edit/Youtube";

// import CORS from flask_cors
// CORS(app)

  function Router() {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path='/qna/:vocId/detail' element ={<ModifyPost />} />
          <Route path='/example/:vocId/detail' element ={<ModifyPost />} />
          <Route path='/notice/:vocId/detail' element ={<ModifyPost />} />
          <Route path="/qna" element={<QnABoard />} />
          <Route path="/example" element={<ExampleBoard />} />
          <Route path="/notice" element={<NoticeBoard />} />
          <Route path="/" element={<Main />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/selectplan" element={<SelectPlan />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path='/example/:vocId' element={<PostDetail />}  />
          <Route path='/qna/:vocId' element={<PostDetail />}  />
          <Route path='/notice/:vocId' element={<PostDetail />}  />
          <Route path='/welcome/' element={<Welcome />}  />
          <Route path='/payment' element={<Payment />}  />
          <Route path='/payresult' element={<PayResult />}  />
          <Route path='/qna/makepost' element={<MakePost />}  />
          <Route path='/notice/makepost' element={<MakePost />}  />
          <Route path='/example/makepost' element={<MakePost />}  />
          <Route path='/edit' element={<Edit />}  />
          <Route path='/youtube' element={<Youtube/>} />         
          <Route
            path="/findpwd/"
            element={
              <PublicRoute 
                component={<FindPwd />}
              />
            }
          />          
          <Route
            path="/mypage"
            element={
              <PrivateRoute 
                component={<MyPage />}
              />
            }
          />
          <Route
            path="/sign-up/"
            element={
              <PublicRoute 
                component={<SignUp />}
              />
            }
          />
          <Route
            path="/sign-up/:plan"
            element={
              <PublicRoute 
                component={<SignUp />}
              />
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute 
                component={<Login />}
              />
            }
          />
          <Route path="/confirm/:email" element={<Confirm/>} />
          <Route path="/resetPwd/:nickname" element={<ResetPwd/>} />
        </Routes>
      </BrowserRouter>
    );
  }
  export default Router;
  