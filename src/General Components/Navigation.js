import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLoginState } from './Structure';
import User from './Context';
import { DialogWithForm3 } from './ModelAdd';

export default () => {
    const [user, setUser] = useContext(User);
    const [state, setState] = useState(false)
    const [profile, setProfile] = useState(false)
    const[upload,setUpload]= useState(false)
    const[open,setOpen]= useState(false)

    // Replace javascript:void(0) paths with your paths
    const navigation = [
        { title: "Resourses", path: "resources" },

        { title: "Interaction", path: "interaction" },

        { title: "FAQ", path: "faq" }
    ]

    useEffect(() => {
        document.onclick = (e) => {
            const target = e.target;
            if (!target.closest(".menu-btn")) setState(false);
        };


    }, [])

    return (<>
        <nav className={` bg-transparent  border-b nav-1  w-full z-40 md:text-sm ${state ? "shadow-lg rounded-xl border  mt-2 md:shadow-none md:border-none  md:mt-0" : ""}`}>


            <div className="lg:gap-x-14 items-center  w-full mx-auto pr-4 pl-4 lg:flex md:px-8">
                <div className="flex items-center justify-between py-5 md:block">
                    <Link className='cursor-pointer' to={"home"}>
                        <svg width="39" height="40" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.47819 4.47045C14.1142 1.7151 19.8858 1.7151 24.5218 4.47045V4.47045C28.9862 7.12379 31.7224 11.933 31.7224 17.1264V17.8736C31.7224 23.067 28.9862 27.8762 24.5218 30.5296V30.5296C19.8858 33.2849 14.1142 33.2849 9.47819 30.5296V30.5296C5.01378 27.8762 2.27757 23.067 2.27757 17.8736V17.1264C2.27757 11.933 5.01378 7.12379 9.47819 4.47045V4.47045Z" fill="#146BA1" />
                            <path d="M9.47819 4.47045C14.1142 1.7151 19.8858 1.7151 24.5218 4.47045V4.47045C28.9862 7.12379 31.7224 11.933 31.7224 17.1264V17.8736C31.7224 23.067 28.9862 27.8762 24.5218 30.5296V30.5296C19.8858 33.2849 14.1142 33.2849 9.47819 30.5296V30.5296C5.01378 27.8762 2.27757 23.067 2.27757 17.8736V17.1264C2.27757 11.933 5.01378 7.12379 9.47819 4.47045V4.47045Z" fill="#146BA1" />
                            <path d="M9.47819 4.47045C14.1142 1.7151 19.8858 1.7151 24.5218 4.47045V4.47045C28.9862 7.12379 31.7224 11.933 31.7224 17.1264V17.8736C31.7224 23.067 28.9862 27.8762 24.5218 30.5296V30.5296C19.8858 33.2849 14.1142 33.2849 9.47819 30.5296V30.5296C5.01378 27.8762 2.27757 23.067 2.27757 17.8736V17.1264C2.27757 11.933 5.01378 7.12379 9.47819 4.47045V4.47045Z" fill="#146BA1" />
                            <path d="M9.47819 4.47045C14.1142 1.7151 19.8858 1.7151 24.5218 4.47045V4.47045C28.9862 7.12379 31.7224 11.933 31.7224 17.1264V17.8736C31.7224 23.067 28.9862 27.8762 24.5218 30.5296V30.5296C19.8858 33.2849 14.1142 33.2849 9.47819 30.5296V30.5296C5.01378 27.8762 2.27757 23.067 2.27757 17.8736V17.1264C2.27757 11.933 5.01378 7.12379 9.47819 4.47045V4.47045Z" fill="#28B889" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4709 26.535L15.8292 23.2723L14.3205 18.9488C14.3205 18.9488 17.3078 17.9064 19.0943 17.283C20.8807 16.6596 23.9129 19.512 20.6784 21.8227L16.4611 23.2943C16.0339 23.9586 16.0753 24.5364 16.3086 25.6817L21.9609 23.7094C25.4862 21.655 25.7998 16.8226 21.5172 15.3767C23.2013 11.3005 21.2884 7.84817 16.5267 8.41852L10.3472 10.5748C9.62858 11.0605 9.46457 11.4595 9.44317 12.315L14.4709 26.535ZM13.5662 16.7871L12.0387 12.4096L17.281 10.5803C18.8625 10.0284 21.351 13.6766 18.8085 14.9579C16.266 16.2391 13.5662 16.7871 13.5662 16.7871Z" fill="white" />
                        </svg>







                    </Link>
                    <div className="md:hidden">
                        <button className="menu-btn text-gray-500 hover:text-gray-800"
                            onClick={() => setState(!state)}
                        >
                            {
                                state ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                )
                            }
                        </button>
                    </div>
                </div>
                <div className={`flex-1 items-center mt-8 md:mt-0  md:flex ${state ? 'block' : 'hidden'} `}>
                    <ul className="justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                        {
                            navigation.map((item, idx) => {
                                return (
                                    <li key={idx} className="  text-white text-lg cursor-pointer font-semibold  hover:text-[#29B888] px-3 rounded py-1.5">
                                        <Link smooth={true} duration={2000} to={item.path} className="block">
                                            {item.title}
                                        </Link>
                                    </li>
                                )
                            })
                        }
                           <li  className="  text-white text-lg cursor-pointer font-semibold  hover:text-[#29B888] px-3 rounded py-1.5">
                                        <a href='Dash.html' className="block">
                                            DashBoard
                                        </a>
                                    </li>
                    </ul>
                    <style>
                        {`.btn-login{
                background: linear-gradient(90deg, #1AB69D 0%, #31B978 100%);
                box-shadow: 0px 6px 15px 0px rgba(0, 0, 0, 0.05);
            }`}
                    </style>
                    <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 my-3 lg:my-0 md:flex md:space-y-0 md:mt-0">
                        {!user.login ? (
                            <Link to='login' smooth={true} duration={2000} className="flex btn-login cursor-pointer items-center font-semibold justify-center gap-x-1 py-2.5 px-6  text-white  text-lg   bg-bg-logo   rounded md:inline-flex">
                                Login

                            </Link>) : (<><img src='/images/WhatsApp Image 2024-02-18 at 9.51.19 AM.jpeg' onClick={() => setProfile(!profile)} className=' cursor-pointer w-10 h-10 rounded-full' />
                            </>)
                        }
                    </div>
                </div>
            </div>
        </nav>
        <div className={`${profile ? "flex" : "hidden"} fixed right-0 top-20 z-[9999] bg-white rounded-b-2xl p-3  justify-start items-start space-y-1 flex-col`}>
            <h1 className=' text-lg font-bold text-black'>
                {user.name}
            </h1>
            <h1 className=' text-lg font-bold text-gray-700'>
                {user.username}
            </h1>
            <div onClick={()=>setOpen(!open)} className=' cursor-pointer border-t-2 text-lg mt-3 font-medium'>
                Upload Content
            </div>
        </div>
        <DialogWithForm3 open={open} setOpen={setOpen}/>
    </>

    )
}