import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import Card from '../components/Card'
import axios from "axios"

const Container = styled.div`
    color:  ${({theme})=>theme.text};
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
`

const Home = ({type}) => {
  const [videos,setVideos] = useState([]);
  useEffect(()=>{
    const fetchVideos = async ()=>{
      const res = await axios.get(`/videos/${type}`)
      setVideos(res.data);
    }
    fetchVideos();
  },[type])
console.log(videos,'edueud')

  return (
    <Container>
      {videos.map(video=>(

      <Card key={video._id} video={video}/>
      ))}
      
    </Container>
  )
}

export default Home
