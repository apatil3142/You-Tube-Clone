import React from 'react'
import styled from 'styled-components'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Comments from '../components/Comments';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import {useDispatch, useSelector} from "react-redux"
import { useEffect } from 'react';
import axios from 'axios';
import { dislike, fetchSuccess, like } from '../redux/videoSlice';
import { subscription } from '../redux/userSlice';
import { format } from 'timeago.js';
import Recommendation from '../components/Recommendation';

const Container = styled.div`
  display: flex;
  gap: 25px;
`
const Content = styled.div`
  flex : 5;
`
const VideoWrapper = styled.div`
  
`
const VidepFrame = styled.video`
    max-height: 520px;
    width: 100%;
    object-fit: cover;
    background-color: #999;
`;
const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 17px;
  margin-bottom: 10px;
  color: ${({theme})=>theme.text};
`
const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ChannelInfo = styled.div`
    margin:10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

`
const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  background-color: #999;
`;
const ChannelDetail = styled.div`
  display: flex;
    gap: 3px;
  flex-direction: column;
  color:${({theme})=>theme.text};
`;
const ChannelName = styled.span`
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
`
const ChannelCounter = styled.span`
    font-size: 12px;
    color: ${({theme})=>theme.textSoft};
`;
const Subscribe = styled.button`
    background-color: #cc1a00;
    font-weight: 500;
    color: white;
    border: none;
    padding: 7px; 
    border-radius: 3px;
    cursor: pointer;
`;
const Buttons = styled.div`
  display:flex;
  align-items: center;
  gap: 20px;
  color: ${({theme})=>theme.text};
`
const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({theme})=>theme.text};
  cursor: pointer;
  `
  
const Hr = styled.hr`
    margin: 15px 0px;
    border: 0.5px solid ${({theme})=>theme.soft};
`
const VideoDetailWrapper = styled.div`
    border-radius: 10px;
    background-color: ${({theme})=>theme.soft};
`
const VideoDetails = styled.div`
    padding: 10px 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    
`
const VideoViews = styled.span`
    font-size: 14px;
    color: ${({theme})=>theme.textSoft};
`;

const Description = styled.p`
    font-size: 14px;
    color: ${({theme})=>theme.text};
`;

const Video = () => {

  const {currentUser} = useSelector((state)=>state.user)
  const {currentVideo} = useSelector((state)=>state.video)

  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2]
  const [channel,setChannel] = useState({})

  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const videoRes = await axios.get(`/videos/find/${path}`)
        console.log(videoRes, 'videoRes');
        dispatch(fetchSuccess(videoRes.data));
        const channelRes = await axios.get(`/users/find/${videoRes.data.userId}`)
        await axios.put(`/videos/view/${path}`)
        setChannel(channelRes.data)

      }catch(err){
        console.log(err, 'edeuuhe');
      }
    }

    fetchData();
  },[path,dispatch])

  

  const handleLikes = async ()=>{
    await axios.put(`/users/like/${currentVideo._id}`)
    dispatch(like(currentUser._id))
  }
  const handleDisLikes = async ()=>{
    await axios.put(`/users/dislike/${currentVideo._id}`)
    dispatch(dislike(currentUser._id))
  }
  const handleSub = async ()=>{
    currentUser.subscribedUsers.includes(channel._id)
    ? await axios.put(`/users/unsub/${channel._id}`)
    : await axios.put(`/users/sub/${channel._id}`)
    dispatch(subscription(channel._id))

  }

  console.log(currentVideo, 'currentVideo');
  
  return (
    <Container>
      <Content>
        <VideoWrapper>
        <VidepFrame src={currentVideo.videoUrl} controls/>
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <ChannelInfo>
            <ChannelImage src={channel.img}/>
            <ChannelDetail>
                <ChannelName>{channel.name}</ChannelName>
                <ChannelCounter>{channel.subscribers} Subscribers</ChannelCounter>
            </ChannelDetail>
            <Subscribe onClick={handleSub}>
              {currentUser.subscribedUsers?.includes(channel._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
            </Subscribe>
          </ChannelInfo>
          <Buttons>
            <Button onClick={handleLikes}>
              { currentVideo.likes?.includes(currentUser._id) ? (<ThumbUpIcon/>) : (<ThumbUpOutlinedIcon/>)}
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDisLikes}>
              {currentVideo.dislikes?.includes(currentUser._id) ? (<ThumbDownIcon/>): (<ThumbDownOffAltOutlinedIcon/>)}
              Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon/>Share
            </Button>
            <Button>
              <PlaylistAddOutlinedIcon/>Save
            </Button>
          </Buttons>
        </Details>
        <Hr/>
        <VideoDetailWrapper>

        <VideoDetails>
            <VideoViews>{11} views | {format(currentVideo.createdAt)}</VideoViews>
            <Description>
               {currentVideo.desc}
            </Description>
        </VideoDetails>
        </VideoDetailWrapper>
        <Hr/>
        <Comments videoId={currentVideo._id}/>
      </Content>
      <Recommendation tags={currentVideo.tags} videoId={currentVideo._id}/>
    </Container>
  )
}

export default Video
