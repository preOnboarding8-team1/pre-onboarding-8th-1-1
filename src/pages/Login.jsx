import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { postLogin, postSignup } from '../api/auth';

import InputBox from '../components/InputBox';
import Button from '../components/Button';

const LoginComponent = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .menu {
    display: flex;
    width: 100%;
    border: 1px solid black;
    box-sizing: border-box;
    border-bottom: none;
    > div {
      flex: 1;
      text-align: center;
      cursor: pointer;
      padding: 10px 0;
    }
    .select {
      background: #f5d042;
    }
  }
  form {
    border: 1px solid black;
    width: 458px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h1 {
      font-size: 24px;
      padding: 15px;
    }
    button {
      margin: 15px 0;
    }
    padding: 15px;
  }
`;

const Login = () => {
  const [menu, setMenu] = useState('로그인');
  const menuArray = ['로그인', '회원가입'];
  const menuClickHandler = (m) => setMenu(m);
  const navigate = useNavigate();

  const LOGIN_INITIAL = {
    email: { txt: '', check: null },
    password: { txt: '', check: null },
  };
  const SIGNUP_INITIAL = {
    ...LOGIN_INITIAL,
    passwordCheck: { txt: '', check: null },
  };
  const [userInfo, setUserInfo] = useState(LOGIN_INITIAL);
  const [cursor, setCursor] = useState(false);
  const onChange = (id, txt) => {
    setUserInfo((state) => {
      const newState = { ...state };
      newState[id].txt = txt;
      newState[id].check = validity(id, txt);
      setCursor(checkCursor(newState));
      return newState;
    });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (cursor) {
      const data = {
        email: userInfo.email.txt,
        password: userInfo.password.txt,
      };
      if (menu === '로그인') {
        const res = await postLogin(data);
        if (res.status === 200) navigate('/todo');
        else if (res.response.status === 401) alert('아이디 또는 비밀번호가 다릅니다');
      } else {
        const res = await postSignup(data);
        if (res.status === 201) navigate('/todo');
        else if (res.response.status === 400) alert('중복된 회원입니다');
      }
    }
  };

  const validity = (id, txt) => {
    if (id === 'email') {
      if (!txt.includes('@')) return '이메일은 @가 포함되어야 합니다';
      return true;
    }
    if (id === 'password') {
      if (txt.length < 8) return '비밀번호는 8자리 이상이여야 합니다';
      return true;
    }
    if (id === 'passwordCheck') {
      if (txt !== userInfo.password.txt) return '비밀번호가 다릅니다';
      return true;
    }
  };
  const checkCursor = (obj) => {
    let result = true;
    const values = Object.values(obj);
    for (let i = 0; i < values.length; i++) {
      if (values[i].check !== true) {
        result = true;
        break;
      }
    }
    return result;
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) navigate('/todo');
  }, []);
  useEffect(() => {
    if (menu === '로그인') setUserInfo(LOGIN_INITIAL);
    else setUserInfo(SIGNUP_INITIAL);
  }, [menu]);
  return (
    <LoginComponent>
      <div>
        <div className="menu">
          {menuArray.map((v) => (
            <div key={v} onClick={() => menuClickHandler(v)} className={menu === v ? 'select' : ''} role="presentation">
              {v}
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit}>
          <h1>{menu}</h1>
          <InputBox type="text" value={userInfo} onChange={onChange} id="email" />
          <InputBox type="password" value={userInfo} onChange={onChange} id="password" />
          {menu === '회원가입' ? (
            <InputBox type="password" value={userInfo} id="passwordCheck" onChange={onChange} />
          ) : (
            <></>
          )}

          <Button onClick={onSubmit} style={{ cursor }}>
            {menu}
          </Button>
        </form>
      </div>
    </LoginComponent>
  );
};

export default Login;
