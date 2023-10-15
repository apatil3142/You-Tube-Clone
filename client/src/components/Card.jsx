import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import {format} from "timeago.js"
import axios from 'axios'

const Container = styled.div`
  width: ${(props)=>props.type !== "sm" && "17rem"};
  margin-bottom: ${(props)=>props.type === "sm" ? "10px":"45px"};
  cursor: pointer;
  display: ${(props)=>props.type === "sm" && "flex"};
  //gap: 10px;
  border-radius: 6px;
  &:hover{
    transform: scale(1.06);
    box-shadow: 0px 0px 5px 0px #f7f7f7;
    /* border: 1px solid red; */
  }
  transition: all 600ms ease;
`
const Image = styled.img`
  width: 100%;
  height: ${(props)=>props.type === "sm" ? "6.5rem":"11rem"};
  background-color: #999;
  flex:1;
  border-radius: 5px;
    
`
const Details = styled.div`
  display: flex;
  margin-top: ${(props)=>props.type === "sm" ? "0px":"16px"};
  gap: 12px;
  flex:1;
`
const AvatarDiv = styled.div`
    
`
const ChannelImage = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #999;
  object-fit: cover;
  display: ${(props)=>props.type === "sm" && "none"};
`
const Texts = styled.div``;
const Title = styled.h1`
  font-size: 1rem;
  font-weight: 500;
  color: ${({theme})=>theme.text};
`;
const ChannelName = styled.h2`
  font-size: 0.8rem;
  color: ${({theme})=>theme.textSoft};
  margin: ${(props)=>props.type === "sm" ? "6px" : "9px"} 0px;
`;
const Info = styled.div`
  font-size: 0.8rem;
  color: ${({theme})=>theme.textSoft};
`;
const Card = ({type,video}) => {

  const [channel,setChannel] = useState({});

  useEffect(()=>{
    const fetchChannel = async ()=>{
      const res = await axios.get(`/users/find/${video.userId}`)
      setChannel(res.data);
    }
    fetchChannel();
  },[video.userId])

  const handleViews = async (e) => {
    e.preventDefault();
    try{
      await axios.put(`/videos/view/${video._id}`)

    }catch(err){
      console.log(err);
    }
  }

  return (
    <Link to={`/video/${video._id}`} style={{textDecoration:"none"}}>
    <Container type={type} >
      <Image type={type} src={video.imgUrl}/>
      <Details type={type}>
        <AvatarDiv>
          <ChannelImage type={type} src={channel.img}/>
        </AvatarDiv>
        <Texts>
            <Title>{video.title}</Title>
            <ChannelName type={type}>{channel.name}</ChannelName>
            <Info>{video.views} views | {format(video.createdAt)}</Info>
        </Texts>
      </Details>
    </Container>
    </Link>
  )
}

export default Card
