import React, { useState } from 'react'
import styled from 'styled-components'
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import { Link } from 'react-router-dom';
import {useSelector} from "react-redux"
import Upload from './Upload';

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({theme})=>theme.bgLighter};
  height: 56px;
  z-index: 999;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #8e8e8e;
  border-radius: 0.5rem;
  
`

const Input = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  width: 90%;
  margin-left: 0.8rem;
`

const Icon = styled.div`
  //background-color: #8e8e8e;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({theme})=>theme.text};
`

const Button = styled.button`
    padding: 5px 15px;
    background-color: transparent;
    border: 1px solid #3ea6ff;
    color: #3ea6ff;
    border-radius: 3px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
`
const User = styled.div`
    display: flex;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    color: ${({theme})=>theme.text};
`;

const AvatarDiv = styled.div`
    
`
const ChannelImage = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #999;
    object-fit: cover;
    display: ${(props)=>props.type === "sm" && "none"};
    cursor: pointer;
`
const Navbar = () => {

  const {currentUser} = useSelector(state=>state.user);
  const [open,setOpen] = useState(false)
  return (
    <>
    <Container>
      <Wrapper>
        <Search>
          <Input placeholder='Search'/>
          <Icon>

          <SearchOutlinedIcon />
          </Icon>
        </Search>
        {currentUser?
        (<User>
          <VideoCallOutlinedIcon style={{cursor:"pointer"}} onClick={()=>setOpen(true)}/>
          <AvatarDiv>
            <ChannelImage src={currentUser.img}/>
          </AvatarDiv>
          {currentUser.name}
        </User>):<Link to="signin" style={{textDecoration:"none"}}>
          <Button>
          <AccountCircleOutlinedIcon fontSize='small'/>
              SIGN IN 
        </Button>
        </Link>}
      </Wrapper>
    </Container>
    {open && <Upload setOpen={setOpen}/>}
    </>
  )
}

export default Navbar
