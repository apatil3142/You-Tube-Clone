import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components'
import Comment from './Comment';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

const Container = styled.div``;

const NewComment = styled.div`
    display: flex;
    gap: 10px;
`;

const CommentForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  color: ${({theme})=>theme.text};
`
const SendIcon = styled.button`
  margin-right: 10px;
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: ${({theme})=>theme.text}
`

const Avatar = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    background-color: #999;
`;

const Input = styled.input`
    width : 90%;
    padding: 5px;
    background-color: transparent;
    border: none;
    outline: none;
    color: ${({theme})=>theme.text};
    border-bottom: 1px solid ${({theme})=>theme.soft};
`;

const Comments = ({videoId}) => {
  const textRef = useRef()
  const {currentUser} = useSelector((state)=>state.user)

  const [comments,setComments] = useState([]);
  useEffect(()=>{
    const fetchComments = async () =>{
      try{
        const res = await axios.get(`/comments/${videoId}`)
        setComments(res.data);
      }catch(err){}
    }
    fetchComments();
  },[videoId])
  
  const addComment = async (e) =>{
    e.preventDefault();
    const newComment = textRef.current.value;
    try{
      await axios.post(`/comments`,{
        desc: newComment,
        userId: currentUser._id,
        videoId: videoId,
      });
      textRef.current.value = "";
    }catch(err){
      console.log(err);
    }
  }
  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser.img}/>
        <CommentForm>
          <Input placeholder='Add a comment...' ref={textRef} />
          <SendIcon type='submit' onClick={addComment}>
            <SendOutlinedIcon />
          </SendIcon>
        </CommentForm>
        
      </NewComment>
      {comments.map(comment=>(
        <Comment key={comment._id} comment={comment}/>
      ))}
    </Container>
  )
}

export default Comments
