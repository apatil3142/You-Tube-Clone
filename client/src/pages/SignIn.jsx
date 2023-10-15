import axios from 'axios';
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { loginFailure, loginStart, loginSuccess } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { auth , provider } from '../firebase';
import {signInWithPopup} from "firebase/auth"

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 100px;
    //height: calc(100vh-56px);
    color: ${({theme})=>theme.text};
    
`;
const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: ${({theme})=>theme.bgLighter};
    border: 1px solid ${({theme})=>theme.soft};
    padding: 20px 50px;
    gap: 10px;
`;
const Title = styled.h1`
    font-size: 20px;
    font-weight: 500;
`;
const SubTitle = styled.h2`
    font-size: 14px;
    font-weight: 400;
`;
const Input = styled.input`
    
    font-size: 14px;
    padding: 10px;
    width: 100%;
    border-radius: 10px;
    border: 1px solid ${({theme})=>theme.soft};
    background-color: transparent;
    outline: none;
    color: ${({theme})=>theme.text};

`;

const Button = styled.button`
    padding: 5px 15px;
    background-color: transparent;
    border: 1px solid #3ea6ff;
    color: #3ea6ff;
    border-radius: 3px;
    font-weight: 500;
    //margin-top: 10px;
    cursor: pointer;
`;
const SignIn = () => {

    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const dispatch = useDispatch();

    const handleSignIn = async (e)=>{
        e.preventDefault();
        dispatch(loginStart());
        try{
            const res = await axios.post("/auth/signin",{name,password})
            dispatch(loginSuccess(res.data));
        }catch(err){
            dispatch(loginFailure());
        }
    }

    const signInWithGoogle = async ()=>{
        dispatch(loginStart());
        signInWithPopup(auth,provider)
        .then((result)=>{
            axios.post("/auth/google",{
                name:result.user.displayName,
                email:result.user.email,
                img: result.user.photoURL,
            }).then((res)=>{
                dispatch(loginSuccess(res.data))
            })
        })
        .catch(error=>{
            dispatch(loginFailure());
        })
    }
    const handleSignUp = useCallback(async (e) => {
        e.preventDefault();
        console.log('ebyfygryggfr', email)
        // dispatch(loginStart())
        // try{
        //     const res = axios.post('/auth/signup');
        //     console.log(res, 'ebyfygryggfr')
        // }catch(error) {
        //     dispatch(loginFailure());
        // };
    },[email]);
  return (
    <Container>
        <Wrapper>
            <Title>Sign In</Title>
            <SubTitle>to continue to YouTube</SubTitle>
            <Input type="text" placeholder='Username...' onChange={e=>setName(e.target.value)}/>
            <Input type="password" placeholder='Password...' onChange={e=>setPassword(e.target.value)}/>
            <Button onClick={handleSignIn}>Sign In</Button>
            <Title>Or</Title>
            <Button onClick={signInWithGoogle}>Continue with Google</Button>
            <Title>Or</Title>
            <Input placeholder='Username...' onChange={e=>setName(e.target.value)}/>
            <Input placeholder='Email...' onChange={e=>setEmail(e.target.value)}/>
            <Input type="password" placeholder='Password...' onChange={e=>setPassword(e.target.value)}/>
            <Button onClick={handleSignUp}>Sign Up</Button>
        </Wrapper>
    </Container>
  )
}

export default SignIn
