// isLogin.js

const isLogin = () => {
  if(localStorage.getItem('access_token') === null) {
    alert("접근 할 수 없는 페이지입니다.");
    window.location.replace('/');
  }
};

export default isLogin;