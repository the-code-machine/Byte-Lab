import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Writer from '../General Components/NoteMaking'
import { Document, Page } from 'react-pdf';
import CodeEditor from '../General Components/CodeEditor';
import MyStatefulEditor from './Writer';
import VideoToTextConverter from '../General Components/UploadVideo';
import VideoToQuestions from '../General Components/UploadVideo';
export default function Resources() {
    const [active, setActive] = useState("video")
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const[data,setData]= useState(null)

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    useEffect(()=>{
        const data = localStorage.getItem('data');
        if(data){ setData(data)
        
        console.log(data)}
        
    },[data])
    return (
        <div className=' flex justify-center items-center w-full h-screen'>
            <div className='lg:w-1/5 w-full lg:block hidden shadow-md'>
                <div className="flex h-screen flex-col justify-between border-e bg-white">
                    <div className="px-4 py-6">
                        <div className=' flex justify-start items-center text-2xl font-bold '>
                        <Link className='mr-3 cursor-pointer' to={"/"}>
                            <svg width="39" height="40" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.47819 4.47045C14.1142 1.7151 19.8858 1.7151 24.5218 4.47045V4.47045C28.9862 7.12379 31.7224 11.933 31.7224 17.1264V17.8736C31.7224 23.067 28.9862 27.8762 24.5218 30.5296V30.5296C19.8858 33.2849 14.1142 33.2849 9.47819 30.5296V30.5296C5.01378 27.8762 2.27757 23.067 2.27757 17.8736V17.1264C2.27757 11.933 5.01378 7.12379 9.47819 4.47045V4.47045Z" fill="#146BA1" />
                                <path d="M9.47819 4.47045C14.1142 1.7151 19.8858 1.7151 24.5218 4.47045V4.47045C28.9862 7.12379 31.7224 11.933 31.7224 17.1264V17.8736C31.7224 23.067 28.9862 27.8762 24.5218 30.5296V30.5296C19.8858 33.2849 14.1142 33.2849 9.47819 30.5296V30.5296C5.01378 27.8762 2.27757 23.067 2.27757 17.8736V17.1264C2.27757 11.933 5.01378 7.12379 9.47819 4.47045V4.47045Z" fill="#146BA1" />
                                <path d="M9.47819 4.47045C14.1142 1.7151 19.8858 1.7151 24.5218 4.47045V4.47045C28.9862 7.12379 31.7224 11.933 31.7224 17.1264V17.8736C31.7224 23.067 28.9862 27.8762 24.5218 30.5296V30.5296C19.8858 33.2849 14.1142 33.2849 9.47819 30.5296V30.5296C5.01378 27.8762 2.27757 23.067 2.27757 17.8736V17.1264C2.27757 11.933 5.01378 7.12379 9.47819 4.47045V4.47045Z" fill="#146BA1" />
                                <path d="M9.47819 4.47045C14.1142 1.7151 19.8858 1.7151 24.5218 4.47045V4.47045C28.9862 7.12379 31.7224 11.933 31.7224 17.1264V17.8736C31.7224 23.067 28.9862 27.8762 24.5218 30.5296V30.5296C19.8858 33.2849 14.1142 33.2849 9.47819 30.5296V30.5296C5.01378 27.8762 2.27757 23.067 2.27757 17.8736V17.1264C2.27757 11.933 5.01378 7.12379 9.47819 4.47045V4.47045Z" fill="#28B889" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4709 26.535L15.8292 23.2723L14.3205 18.9488C14.3205 18.9488 17.3078 17.9064 19.0943 17.283C20.8807 16.6596 23.9129 19.512 20.6784 21.8227L16.4611 23.2943C16.0339 23.9586 16.0753 24.5364 16.3086 25.6817L21.9609 23.7094C25.4862 21.655 25.7998 16.8226 21.5172 15.3767C23.2013 11.3005 21.2884 7.84817 16.5267 8.41852L10.3472 10.5748C9.62858 11.0605 9.46457 11.4595 9.44317 12.315L14.4709 26.535ZM13.5662 16.7871L12.0387 12.4096L17.281 10.5803C18.8625 10.0284 21.351 13.6766 18.8085 14.9579C16.266 16.2391 13.5662 16.7871 13.5662 16.7871Z" fill="white" />
                            </svg> </Link>
                            ByteLab</div>

                   
                    </div>
                    <MyStatefulEditor/>

                </div>
            </div>
            <div className=' flex flex-col justify-center items-center lg:w-4/5 h-screen'>

                <div className='  w-full flex flex-col justify-center items-center'>
                    <nav className=' w-1/2 h-[8vh] shadow-md flex justify-center items-center '>
                        <div onClick={() => setActive("video")} className={` border-t-2 px-7 py-2 hover:border-[#28B889]   cursor-pointer textlg font-semibold flex justify-center items-center h-full ${active === "video" ? "border-[#28B889]" : ""}`}>
                            Video
                        </div>
                        <div onClick={() => setActive("pdf")} className={` border-t-2 px-6 py-2 hover:border-[#28B889]   cursor-pointer textlg font-semibold flex justify-center items-center h-full ${active === "pdf" ? "border-[#28B889]" : ""}`}>
                            Pdf
                        </div>
                        <div onClick={() => setActive("audio")} className={` border-t-2 px-6 py-2 hover:border-[#28B889]   cursor-pointer textlg font-semibold flex justify-center items-center h-full ${active === "audio" ? "border-[#28B889]" : ""}`}>
                            Audio
                        </div>
                        <div onClick={() => setActive("ppt")} className={` border-t-2 px-6 py-2 hover:border-[#28B889]   cursor-pointer textlg font-semibold flex justify-center items-center h-full ${active === "ppt" ? "border-[#28B889]" : ""}`}>
                            PPT
                        </div>
                        <div onClick={() => setActive("compiler")} className={` border-t-2 px-7 py-2 hover:border-[#28B889]   cursor-pointer textlg font-semibold flex justify-center items-center h-full ${active === "compiler" ? "border-[#28B889]" : ""}`}>
                            Compiler
                        </div>

                    </nav>
                    <div className='w-full    overflow-y-auto overflow-x-hidden scroll flex justify-start items-center flex-col'>
                        {active === "video" && <>
                   
                           
                            <div className=' flex justify-center w-full p-5 h-[80vh]  items-center  text-left'>
                            <VideoToQuestions/>
                            </div>
                         
                         


                        </>
                        }
                        {active === "compiler" && <>
                            <div className=' w-full h-[85vh]  p-5'>
                             <CodeEditor/>
                            </div>
                        


                        </>
                        }
                        {active === "audio" && <>
                            <div className=' w-full h-[85vh] flex justify-center items-center p-5'>
                                <audio className=" rounded-lg" controls>
                                    <source
                                        src="images/y2mate.com - Hear it out this till the END .mp3"
                                        type="video/mp4"
                                    />

                                </audio>
                            </div>
                            <h1 className=' text-2xl font-bold  text-left'>
                                Covid
                            </h1>
                            <div className=' p-5 w-full text-lg font-medium'>
                              
                            </div>


                        </>
                        }

                        {active === "ppt" && <>
                            <div className=' p-5 w-full h-[85vh]'>
                                <iframe
                                    title="PDF Viewer"
                                    src="pdf/small.pdf"
                                    width="100%"
                                    height="700px"
                                    frameBorder="0"
                                >
                                    This browser does not support PDFs. Please download the PDF to view it.
                                </iframe>
                            </div>

                        </>}
                        {active === "pdf" && <>
                            <div className=' p-5 w-full h-[85vh]'>
                                <iframe
                                    title="PDF Viewer"
                                    src="pdf/small.pdf"
                                    width="100%"
                                    height="700px"
                                    frameBorder="0"
                                >
                                    This browser does not support PDFs. Please download the PDF to view it.
                                </iframe>
                            </div>

                        </>}


                    </div>
                </div>
            </div>


        </div>
    )
}




