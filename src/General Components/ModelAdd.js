import React, { useContext, useState } from "react";
import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { app } from '../Firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { getDatabase, ref, set, get ,update,remove} from 'firebase/database';
import User from './Context';
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

export function DialogWithForm1(props) {
    const navigate = useNavigate();
    const [user, setUser] = useContext(User);
    const [name, setName] = useState("")
    const [domain, setDomain] = useState("")
    const handleOpen = () => props.setOpen((cur) => !cur);
    const create = () => {
        const time = new Date()
        const stamp = time.getTime()
        const gid = user.username + name + domain + stamp
        const userData = {
            name,
            domain,
            gid
        };
        set(ref(getDatabase(), `groups/${gid}/info`), userData)
            .then(() => {
                toast.success('Community is created..');
                props.setOpen(!props.open)
                navigate("/interaction")



            })
            .catch((error) => {
                toast.error('Error storing user data.');

            });
    }
    return (<>
        {props.open ? (<>
            <style>
                {`

        .bg{
          background-image: url("images/banner-bg.webp");
          background-repeat: no-repeat;
          background-size: cover;
        }
        `}
            </style>
            <div className=" h-screen w-screen bg flex bg-opacity-100 fixed top-0 left-0 z-50">

                <Dialog
                    size="xs"
                    open={props.open}
                    handler={handleOpen}
                    className=" bg-transparent shadow-none"
                >
                    <Card className="mx-auto w-full max-w-[24rem]">
                        <CardBody className="flex flex-col gap-4">
                            <Typography variant="h4" color="blue-gray">
                                Create
                            </Typography>
                            <Typography
                                className="mb-3 font-normal"
                                variant="paragraph"
                                color="gray"
                            >
                                Enter name of community.
                            </Typography>
                            <Typography className="-mb-2" variant="h6">
                                Your Community name
                            </Typography>
                            <Input label="Community" size="lg" onChange={(e) => setName(e.target.value)} value={name} />
                            <Typography className="-mb-2" variant="h6">
                                Domain
                            </Typography>
                            <Input label="Domain" size="lg" onChange={(e) => setDomain(e.target.value)} value={domain} />

                        </CardBody>
                        <CardFooter className="pt-0">
                            <Button variant="gradient" onClick={create} fullWidth>
                                Create
                            </Button>
                            <Typography variant="small" className="mt-4 flex justify-center">
                                <Typography
                                    as="a"
                                    href="#signup"
                                    variant="small"
                                    color="blue-gray"
                                    className="ml-1 font-bold"
                                    onClick={handleOpen}
                                >
                                    Cancel
                                </Typography>
                            </Typography>
                        </CardFooter>
                    </Card>
                </Dialog>
            </div></>) : ("")
        }</>

    );
}



export function DialogWithForm2(props) {
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [domain, setDomain] = useState("")
    const handleOpen = () => props.setOpen((cur) => !cur);
    const isValidData = async (username) => {
        try {
            const dbRef = ref(getDatabase(), 'users/userNames');
            const snapshot = await get(dbRef);

            if (snapshot.exists()) {
                const existingUsernames = snapshot.val();
                if (existingUsernames.includes(username)) {
                    
                    return true;
                } else {
                    toast.warn('Username not found');
                    return false;
                }
            } else {
                return true;
            }
        } catch (error) {
            toast.error('Error fetching existing usernames: ' + error.message);
            return false;
        }
    };
    const create = async () => {
        const result = await isValidData(domain);
        const newName = name + domain;
    
        if (result) {
            const db = getDatabase();
            const oldGroupRef = ref(db, `groups/${name}/`);
            const newGroupRef = ref(db, `groups/${newName}/`);
            const snapshot = await get(oldGroupRef);
    
            if (snapshot.exists()) {
                const groupData = snapshot.val();
                
                // Update the gid inside the info object
                if (groupData && groupData.info) {
                    groupData.info.gid = newName; // Assuming newName is the updated gid
                }
    
                await set(newGroupRef, groupData);
                await remove(oldGroupRef);
    
                toast.success('Group key and gid updated successfully.');
                navigate("/interaction");
            } else {
                toast.error('Group node does not exist.');
            }
        }
    };
    
    
    return (<>
        {props.open ? (<>
            <style>
                {`

        .bg{
          background-image: url("images/banner-bg.webp");
          background-repeat: no-repeat;
          background-size: cover;
        }
        `}
            </style>
            <div className=" h-screen w-screen bg flex bg-opacity-100 fixed top-0 left-0 z-50">

                <Dialog
                    size="xs"
                    open={props.open}
                    handler={handleOpen}
                    className=" bg-transparent shadow-none"
                >
                    <Card className="mx-auto w-full max-w-[24rem]">
                        <CardBody className="flex flex-col gap-4">
                            <Typography variant="h4" color="blue-gray">
                                Join
                            </Typography>
                            <Typography
                                className="mb-3 font-normal"
                                variant="paragraph"
                                color="gray"
                            >
                                Enter Group Id.
                            </Typography>
                            <Typography className="-mb-2" variant="h6">
                                Group Id
                            </Typography>
                            <Input label="Community" size="lg" onChange={(e) => setName(e.target.value)} value={name} />

                       
                            <Typography className="-mb-2" variant="h6">
                                User Id
                            </Typography>
                            <Input label="Community" size="lg" onChange={(e) => setDomain(e.target.value)} value={domain} />

                        </CardBody>
                        <CardFooter className="pt-0">
                            <Button variant="gradient" onClick={create} fullWidth>
                                Join
                            </Button>
                            <Typography variant="small" className="mt-4 flex justify-center">
                                <Typography
                                    as="a"
                                    href="#signup"
                                    variant="small"
                                    color="blue-gray"
                                    className="ml-1 font-bold"
                                    onClick={handleOpen}
                                >
                                    Cancel
                                </Typography>
                            </Typography>
                        </CardFooter>
                    </Card>
                </Dialog>
            </div></>) : ("")
        }</>

    );
}


export function DialogWithForm3(props) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [domain, setDomain] = useState("");
    const [title, setTitle] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [pptFile, setPptFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);

    const handleOpen = () => props.setOpen((cur) => !cur);
    const handleUploadPdf = async () => {
     

        const formData = new FormData();
        formData.append('pdf_file', pdfFile);

        try {
            const response = await fetch('http://127.0.0.1:5000/upload-pdf', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Error uploading PDF file.');
            }
           
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to upload PDF file.');
        }
    };
    const handleVideoFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handlePdfFileChange = (e) => {
        setPdfFile(e.target.files[0]);
    };

    const handlePptFileChange = (e) => {
        setPptFile(e.target.files[0]);
    };

    const handleAudioFileChange = (e) => {
        setAudioFile(e.target.files[0]);
    };
    const handleUpload = async () => {
        if (!videoFile) {
          toast.error('Please select a video file.');
          return;
        }
    
        const formData = new FormData();
        formData.append('video_file', videoFile);
    
        try {
          const response = await fetch('http://127.0.0.1:5000/video-to-text', {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) {
            throw new Error('Error converting video to text.');
          }
          const data = await response.json();

           return data.text
        } catch (error) {
        
        }
      };
    
    const generateMCQs = async (inputText) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/generate_questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ input_text: inputText })
            });
            const data = await response.json();
            const jsonData = JSON.parse(data.mcq);
            if (jsonData) {
                console.log(jsonData)
                return jsonData
            } else {
                console.error('MCQ data not found in JSON response.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleJoin = async () => {
     
       const text = await handleUpload()
       const questions= await generateMCQs(text)
      await handleUploadPdf()
        
       const data = {
        name: name,
        domain: domain,
        text: text,
        questions: questions,
       
    };

   
    await localStorage.setItem('data', JSON.stringify(data));

    console.log("Data saved:", data);
    };

    return (
        <>
            {props.open ? (
                <div className="h-screen w-screen bg flex bg-opacity-100 fixed top-0 left-0 z-50">
                    <Dialog size="xs" open={props.open} handler={handleOpen} className="bg-transparent shadow-none">
                        <Card className="mx-auto w-full max-w-[44rem]">
                            <CardBody className="flex flex-col gap-4">
                             
                                <Typography variant="h4" color="blue-gray">
                                    Upload Content
                                </Typography>
                                <div className="flex space-x-5">
                                <div className="flex justify-start flex-col space-y-3 items-start">
                                <Typography className="-mb-2" variant="h6">
                                    Title
                                </Typography>
                                <Input label="Title" size="lg" onChange={(e) => setName(e.target.value)} value={name} />
                                </div>
                                <div className="flex justify-start flex-col space-y-3 items-start">
                                <Typography className="-mb-2" variant="h6">
                                    User Id
                                </Typography>
                                <Input label="userId" size="lg" onChange={(e) => setDomain(e.target.value)} value={domain} />
                                </div>    </div>   <div className="flex space-x-5">
                                <div className="flex justify-start flex-col space-y-3 items-start">
                                <Typography className="-mb-2" variant="h6">
                                    Video
                                </Typography>
                                <Input type="file" accept="video/*" onChange={handleVideoFileChange} />
                                </div>
                                <div className="flex justify-start flex-col space-y-3 items-start">
                                <Typography className="-mb-2" variant="h6">
                                    Pdf
                                </Typography>
                                <Input type="file" accept=".pdf" onChange={handlePdfFileChange} />
                                </div></div><div className="flex space-x-5">
                                <div className="flex justify-start flex-col space-y-3 items-start">
                                <Typography className="-mb-2" variant="h6">
                                    PPT
                                </Typography>
                                <Input type="file" accept=".ppt, .pptx" onChange={handlePptFileChange} />
                                </div>
                                <div className="flex justify-start flex-col space-y-3 items-start">
                                <Typography className="-mb-2" variant="h6">
                                    Audio
                                </Typography>
                                <Input type="file" accept="audio/*" onChange={handleAudioFileChange} />
                                </div></div>
                                
                            
                            </CardBody>
                            <CardFooter className="pt-0">
                                <Button variant="gradient" onClick={handleJoin} fullWidth>
                                    Upload 
                                </Button>
                                <Typography variant="small" className="mt-4 flex justify-center">
                                    <Typography
                                        as="a"
                                        href="#signup"
                                        variant="small"
                                        color="blue-gray"
                                        className="ml-1 font-bold"
                                        onClick={handleOpen}
                                    >
                                        Cancel
                                    </Typography>
                                </Typography>
                            </CardFooter>
                        </Card>
                    </Dialog>
                </div>
            ) : (
                ''
            )}
        </>
    );
}
