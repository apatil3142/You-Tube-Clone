import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left:0;
    background-color: #000000a7;
    display: flex;
    align-items: center;
    justify-content: center;
    
`;
const Wrapper = styled.div`
    width: 600px;
    height: 600px;
    background-color: ${({theme})=>theme.bgLighter};
    color: ${({theme})=>theme.text};
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    `
const Title = styled.h1`
    text-align: center;
    `
const Input = styled.input`
    border: 1px solid ${({theme})=>theme.soft};
    color: ${({theme})=>theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;

`
const Desc = styled.textarea`
    border: 1px solid ${({theme})=>theme.soft};
    color: ${({theme})=>theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;

`
const Button = styled.button`
    border-radius: 3px;
    border: none;
    padding: 10px 20px;
    font-weight: 500;
    background-color: ${({theme})=>theme.soft};;
    color: ${({theme})=>theme.textSoft};;
    //margin-top: 10px;
    cursor: pointer;
`
const Label = styled.label`
    color: ${({theme})=>theme.text};
    font-size: 14px;
`
const Close = styled.div`
    position: absolute;
    top:10px;
    right:10px;
    cursor: pointer;

`
const Upload = ({setOpen}) => {

    const navigate = useNavigate();
    const [img,setImg] = useState(undefined)
    const [video,setVideo] = useState(undefined)
    const [imgPerc,setImgPerc] = useState(0)
    const [videoPerc,setVideoPerc] = useState(0)
    const [inputs,setInputs] = useState({})
    const [tags,setTags] = useState([])

    const handleChange = (e) =>{
        setInputs(prev=>{
            return {...prev,[e.target.name]:e.target.value};
        })
    }
    const handleTags = (e)=>{
        setTags(e.target.value.split(","));
    }

    const uploadFile = (file,urlType)=>{
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

// Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            urlType === "imgUrl" ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress));
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            }
        }, 
        (error) => {},
        () => {
            
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setInputs(prev=>{
                    return {...prev,[urlType]:downloadURL};
                })
            });
          }
        );
    };

    useEffect(()=>{
        video && uploadFile(video,"videoUrl")
    },[video]);

    useEffect(()=>{
        img && uploadFile(img,"imgUrl")
    },[img]);

    const handleUpload = async (e) =>{
        e.preventDefault();
        const res = await axios.post("/videos",{...inputs,tags})
        setOpen(false);
        res.status===200 && navigate(`/video/${res.data._id}`)
    } 

  return (
    <Container>
        <Wrapper>
            <Close onClick={()=>setOpen(false)}>X</Close>
            <Title>Upload a New Video</Title>
            <Label>Choose Video:</Label>
            {videoPerc > 0 ? ("Uploaded: " + videoPerc + "%") : (<Input 
                type="file" 
                accept='video/*' 
                onChange={e=>setVideo(e.target.files[0])}
            />)}
            
            <Input type="text" name='title' placeholder='Enter video title...' onChange={handleChange}/>
            
            <Desc name='desc' placeholder='Enter Description here...' onChange={handleChange} rows={8}/>
            <Input type="text" placeholder='Separate tags with commas...' onChange={handleTags}/>
            <Label>Choose Thumbnail:</Label>
            {imgPerc > 0 
            ? ("Uploaded: " + imgPerc + "%")
            : (<Input 
                type="file" 
                accept='image/*' 
                onChange={e=>setImg(e.target.files[0])}
            />)}
            <Button onClick={handleUpload}>Upload</Button>
        </Wrapper>
    </Container>
  )
}

export default Upload
