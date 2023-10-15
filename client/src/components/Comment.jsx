import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components'
import { format } from 'timeago.js';

const Container = styled.div`
    display: flex;
    gap: 10px;
    margin: 30px 0px;
`
const AvatarDiv = styled.div`
    
`
const Avatar = styled.img`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;

`;

const CommentDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: ${({theme})=>theme.text};
`;

const Name = styled.span`
    font-size: 13px;
    font-weight: 500;
`;
const Date = styled.span`
    color: ${({theme})=>theme.textSoft};
    font-size: 12px;
    margin-left: 5px;
`;
const Text = styled.span`
    
    font-size: 14px;
`;

const Comment = ({comment}) => {
    const [channel,setChannel] = useState({});

    useEffect(()=>{
        const fetchComment = async ()=>{
            const res = await axios.get(`/users/find/${comment.userId}`)
            setChannel(res.data);
        }
        fetchComment();
    },[comment.userId])
  return (
    <Container>
        <AvatarDiv>
        <Avatar src={channel.img}/>
        </AvatarDiv>
        <CommentDetails>
            <Name>{channel.name} <Date>{format(comment.createdAt)}</Date></Name>
            <Text>{comment.desc}</Text>
        </CommentDetails>
    
    </Container>
  )
}

export default Comment
