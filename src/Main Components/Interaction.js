import React, { useState, useEffect, useContext } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import Modal, { DialogWithForm, DialogWithForm1, DialogWithForm2 } from '../General Components/ModelAdd'
import User from '../General Components/Context'
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import { decrypt, encrypt } from '../General Components/Functions';
import CodeEditor from '../General Components/CodeEditor';
import { Link } from 'react-router-dom';

const Item = (props) => {
  return (
    <>
      <div class="flex items-center gap-x-3 w- justify-start border-t border-b p-2 ">
        <img
          src="images/WhatsApp Image 2024-02-18 at 9.51.19 AM.jpeg"
          class="w-12 h-12 rounded-full"
        />
        <div className=' flex flex-col'>
          <span class=" text-gray-700 text-sm font-medium"
          >{props.name}</span>

          <span class=" text-gray-700 text-xs"
          >{props.domain}</span>
        </div>
      </div>
    </>
  )
}


export default function Interaction() {
  const [plainText, setPlainText] = useState('');
  const [messages, setMessages] = useState([])
  const [msg, setMessage] = useState("")
  const [open, setOpen] = useState(false)
  const [openJoin, setOpenJoin] = useState(false)
  const [items, setItems] = useState([])
  const [user, SetUser] = useContext(User)
  const [groupId, setGroupId] = useState("")
  const [groupName, setGroupName] = useState("")
  const [password, setPassword] = useState('');

  const [copyState, setCopyState] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(groupId).then(
      function () {
        setCopyState(true);
        toast.success("Group Id copied!")
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  useEffect(() => {
    if (copyState) {
      setTimeout(() => setCopyState(false), 3000);
    }
  }, [copyState]);

  const handleEncrypt = (msg) => {
    const encrypted = CryptoJS.AES.encrypt(msg, groupId).toString();
    return encrypted
  };


  const sendMsg = () => {

    const time = new Date()
    const stamp = time.getTime()
    setPassword(groupId)
    var msg1
    if (msg != null) {
      msg1 = encrypt(msg)
    }

    const id = user.username + stamp
    setMessage('')
    const userData = {
      msg1,
      stamp,

    };
    set(ref(getDatabase(), `groups/${groupId}/messages/${id}/`), userData)
      .then(() => {})
      .catch((error) => {
        toast.error('Error storing user data.');

      });
  }
  const handleClick = (name, id, index) => {
    setPassword(groupId)
    setGroupId(id)
    setGroupName(name)

    if (items[index].messages) {
      const filteredItems = Object.keys(items[index].messages).reduce((filtered, key) => {
        const item = items[index].messages[key];

        filtered.push(item);



        return filtered;
      }, []);
      setMessages(filteredItems)
    }



  }
  useEffect(() => {
    const fetchData = () => {
      const dbRef = ref(getDatabase(), `groups/${groupId}/messages/`);

      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const filteredItems = Object.keys(data).reduce((filtered, key) => {
            const item = data[key];

            filtered.push(item);



            return filtered;
          }, []);
          setMessages(filteredItems)
        }

      });


    }
    fetchData()


  }, [msg]);
  useEffect(() => {
    const fetchData = () => {
      const dbRef = ref(getDatabase(), 'groups/');

      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {

          const filteredItems = Object.keys(data).reduce((filtered, key) => {
            const item = data[key];
            console.log(user.username, key, item)
            if (key.includes(user.username)) {

              filtered.push(item);


            }
            return filtered;
          }, []);
          setItems(filteredItems);
        } else {
          setItems([]);
        }
      });


    }
    fetchData()


  }, []);

  return (
    <div className=' w-full h-screen flex '>

      <style>
        {`

        .bg3{
          background-image: url("images/WhatsApp Image 2024-02-17 at 6.34.39 PM.jpeg");
          background-repeat: no-repeat;
          background-size: cover;
        }
        `}
      </style>
      <DialogWithForm1 open={open} setOpen={setOpen} />
      <DialogWithForm2 open={openJoin} setOpen={setOpenJoin} />
      <div className=' w-1/4 h-screen flex   shadow-md flex-col '>
        <div className='w-full  bg-white flex flex-col p-3'>
          <div className=' justify-between items-center flex p-2 space-x-3'>
            <div className=' justify-center items-center space-x-3 flex'>


             <Link to={"/"}> <span className=' text-2xl font-bold text-black'>
                Community
              </span></Link></div>


            <svg onClick={() => setOpen(!open)} className=' cursor-pointer' width="30" height="26" viewBox="0 0 50 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27.8387 37.3456C26.926 37.3943 25.9797 37.4094 24.9998 37.4094C21.0031 37.4094 16.9495 37.0252 12.9595 36.2634C12.4696 36.1661 12.1139 35.7315 12.1139 35.2282V33.5856C12.1139 28.0721 16.6005 23.5856 22.1139 23.5856C24.0434 23.5873 25.9578 23.5873 27.8857 23.5856C30.3018 23.5856 32.629 24.4631 34.436 26.0604C35.0635 26.6141 36.0166 26.552 36.5686 25.9279C37.1206 25.302 37.0602 24.349 36.436 23.7953C35.1374 22.6493 33.6307 21.7987 32.0166 21.2534C34.9092 19.1024 36.7934 15.6695 36.7934 11.7953C36.7934 5.29195 31.5031 0 24.9998 0C18.4964 0 13.2062 5.29195 13.2062 11.7953C13.2062 15.6661 15.0887 19.0956 17.9763 21.2483C12.8203 22.9832 9.09375 27.8523 9.09375 33.5839V35.2265C9.09375 37.1695 10.4746 38.8507 12.384 39.2265C16.5686 40.0252 20.8119 40.4295 24.9998 40.4295C26.035 40.4295 27.035 40.4111 28.0015 40.3591C28.8354 40.3154 29.4729 39.604 29.4293 38.7701C29.3823 37.9396 28.6458 37.297 27.8387 37.3456ZM16.2263 11.7953C16.2263 6.95638 20.1625 3.02181 24.9998 3.02181C29.837 3.02181 33.7733 6.95805 33.7733 11.7953C33.7733 16.6158 29.8639 20.5369 25.0484 20.5638H24.9511C20.1357 20.5369 16.2263 16.6158 16.2263 11.7953Z" fill="black" />
              <path d="M39.475 19.7441C38.8307 19.9907 38.4364 20.6451 38.5186 21.3313C38.5991 22.0159 39.1361 22.5595 39.8206 22.6501C41.6746 22.8934 43.5253 23.9723 44.8995 25.6132C45.1981 25.9689 45.626 26.1535 46.0572 26.1535C46.3995 26.1535 46.7434 26.0377 47.0253 25.8011C47.6646 25.2659 47.7501 24.3129 47.2132 23.6719C46.173 22.4303 44.9112 21.4219 43.5454 20.7189C45.5337 18.9169 46.7434 16.3179 46.7434 13.5511C46.7434 9.56453 44.3458 6.04272 40.6361 4.57963C39.8609 4.27091 38.9834 4.65346 38.678 5.43031C38.3726 6.20547 38.7535 7.08299 39.5287 7.38836C42.0773 8.39507 43.7233 10.8129 43.7233 13.5511C43.725 16.2759 42.0169 18.7659 39.475 19.7441Z" fill="black" />
              <path d="M5 32.8877L4.39597 32.782C4.06711 32.7249 3.74497 32.6712 3.43121 32.6075C3.19631 32.5605 3.02013 32.3407 3.02013 32.0924V30.7987C3.02013 27.0269 6.43289 23.1427 10.1812 22.6494C10.8658 22.5588 11.4027 22.0152 11.4832 21.3306C11.5654 20.6444 11.1711 19.99 10.5268 19.7434C7.9849 18.7652 6.27685 16.2769 6.27685 13.5521C6.27685 10.8138 7.92282 8.39605 10.4715 7.38934C11.2466 7.08397 11.6275 6.20645 11.3221 5.43128C11.0151 4.65444 10.1376 4.27189 9.36242 4.58061C5.65269 6.0437 3.25503 9.56551 3.25503 13.5521C3.25503 16.3138 4.46141 18.9095 6.44463 20.7132C2.72819 22.6108 0 26.6326 0 30.8004V32.094C0 33.7836 1.19631 35.2467 2.83893 35.5689C3.1745 35.6377 3.52349 35.6981 3.88423 35.7585L4.46477 35.8608C4.55537 35.8776 4.6443 35.886 4.7349 35.886C5.45134 35.886 6.08725 35.3726 6.2198 34.6444C6.36577 33.8205 5.82047 33.0353 5 32.8877Z" fill="black" />
              <path d="M47.3839 30.6441C43.9024 27.1642 38.2379 27.1642 34.7564 30.6441C33.0702 32.3303 32.1406 34.5736 32.1406 36.9578C32.1406 39.3437 33.0685 41.587 34.7547 43.2733C36.441 44.9595 38.6842 45.889 41.0702 45.889C43.4561 45.889 45.6977 44.9595 47.3839 43.2733C49.0702 41.587 49.9997 39.3437 49.9997 36.9578C49.9997 34.5736 49.0718 32.3303 47.3839 30.6441ZM45.248 41.1357C43.0165 43.3706 39.1238 43.3706 36.8923 41.1357C34.5886 38.832 34.5886 35.0854 36.8923 32.7817C38.045 31.629 39.5584 31.0535 41.0718 31.0535C42.5853 31.0535 44.0987 31.6307 45.2514 32.7817C47.5534 35.0837 47.5534 38.832 45.248 41.1357Z" fill="black" />
              <path d="M43.6101 35.4478H42.5799V34.4192C42.5799 33.5854 41.9038 32.9092 41.0699 32.9092C40.236 32.9092 39.5598 33.5854 39.5598 34.4192V35.4478H38.5296C37.6957 35.4478 37.0195 36.1239 37.0195 36.9578C37.0195 37.7917 37.6957 38.4679 38.5296 38.4679H39.5598V39.4964C39.5598 40.3303 40.236 41.0065 41.0699 41.0065C41.9038 41.0065 42.5799 40.3303 42.5799 39.4964V38.4679H43.6101C44.444 38.4679 45.1202 37.7917 45.1202 36.9578C45.1202 36.1239 44.444 35.4478 43.6101 35.4478Z" fill="black" />
            </svg>
            <button onClick={() => setOpenJoin(!openJoin)} className=' px-4 py-1.5 bg-black text-white text-md font-medium rounded-full'>Join</button>
          </div>
          <div className=' justify-start items-center flex p-2'>
       

          </div>
        </div>

        <div className=' w-full scroll overflow-y-auto flex flex-col justify-center items-center '>
          {items?.map((i, index) => (

            <div key={index + 1} className='w-full cursor-pointer' onClick={() => handleClick(i.info.name, i.info.gid, index)}>
              <Item name={i.info.name} domain={i.info.domain} />
            </div>
          ))

          }
        </div>
      </div>
      {groupId ? (<>
        <div className=' w-3/4 h-screen flex flex-col '>
          <div className='   z-10  justify-between flex p-2 items-center  w-full shadow-md h-20'>
            <div className=' flex space-x-5 justify-center items-center text-2xl font-semibold text-black'>
              <svg className='mr-3' width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 12.5C25 19.4036 19.4036 25 12.5 25C5.59644 25 0 19.4036 0 12.5C0 5.59644 5.59644 0 12.5 0C19.4036 0 25 5.59644 25 12.5Z" fill="#5C5371" />
                <path d="M9 11C10.6569 11 12 9.65685 12 8C12 6.34315 10.6569 5 9 5C7.34315 5 6 6.34315 6 8C6 9.65685 7.34315 11 9 11Z" fill="#241B2F" />
                <path d="M17 11C18.6569 11 20 9.65685 20 8C20 6.34315 18.6569 5 17 5C15.3431 5 14 6.34315 14 8C14 9.65685 15.3431 11 17 11Z" fill="#241B2F" />
                <path d="M9 12C5.69 12 3 13.79 3 16V18H9V16C9 14.52 10.21 13.23 12 12.54C11.12 12.19 10.09 12 9 12ZM17 12C13.69 12 11 13.79 11 16V18H23V16C23 13.79 20.31 12 17 12Z" fill="#241B2F" />
              </svg>
              {groupName}
            </div>

            <div className=' space-x-3 flex justify-start items-center'>
              <div onClick={()=>setGroupId('')} className=' flex space-x-2 text-lg font-semibold justify-center items-center'>
                <span>
                  Compiler
                </span>
                <label
                  for="toggleTwo"
                  class="flex items-center cursor-pointer select-none text-dark dark:text-black"
                >
                  <div class="relative">
                    <input
                      type="checkbox"
                      id="toggleTwo"
                      class="peer sr-only"
                    />
                    <div
                      class="block h-8 rounded-full dark:bg-gray-100 bg-gray-100 w-14"
                    ></div>
                    <div
                      class="absolute w-6 h-6 transition bg-black rounded-full dot dark:bg-dark-4 left-1 top-1 peer-checked:translate-x-full peer-checked:bg-primary"
                    ></div>
                  </div>
                </label>
              </div>
             <a href='https://4025041e13b6ca4f2578.vercel.app/'><svg className=' cursor-pointer' width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 8V16H5V8H15ZM16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5V7C17 6.45 16.55 6 16 6Z" fill="#241B2F" />
              </svg></a>

              <svg onClick={handleCopy} className=' cursor-pointer' width="28px" height="28px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>link</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M13.9,44a10,10,0,0,1-7-2.9,9.8,9.8,0,0,1,0-14l7.2-7.2a9.8,9.8,0,0,1,14,0,2,2,0,0,1-2.8,2.8,6,6,0,0,0-8.4,0L9.7,29.9a5.9,5.9,0,0,0,8.4,8.4l4.5-4.7a2,2,0,0,1,2.8,2.8l-4.5,4.7A10,10,0,0,1,13.9,44Z"></path> <path d="M26.9,31a10,10,0,0,1-7-2.9,2,2,0,0,1,2.8-2.8,6,6,0,0,0,8.4,0l7.2-7.2a5.9,5.9,0,0,0-8.4-8.4l-4.5,4.7a2,2,0,0,1-2.8-2.8l4.5-4.7a9.9,9.9,0,0,1,14,14l-7.2,7.2A10,10,0,0,1,26.9,31Z"></path> </g> </g> </g></svg>
            </div>
          </div>
          <div className=' z-50 p-5 flex flex-col   bg-opacity-10 items-end justify-end scroll  overflow-y-auto h-[80vh]'>
            {messages?.reverse().map((item, index) => {
              let decrypted = '';
              try {
                decrypted = decrypt(item.msg1)
                console.log(decrypted, item.msg1)
              } catch (error) {
                console.error('Error decrypting:', error);
              }
              return (
                <div key={index} className="flex  bg-white items-center gap-x-3 px-4 py-2 text-lg font-bold text-black justify-center border-2 rounded-2xl my-1 ">
                  {decrypted}
                </div>
              );
            })}

          </div>

          <div className=' border-t-2 z-10 w-3/4  space-x-3  fixed flex justify-start items-center p-2 bottom-0 right-0 shadow-md h-20'>
         
            <input type='text' id='msg' value={msg} onChange={(e) => setMessage(e.target.value)} placeholder=' Enter message ...' className=' px-4 py-2 outline-none rounded shadow-md w-3/4 text-lg font-semibold text-black' />
            <svg onClick={sendMsg} className=' cursor-pointer' width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="#000000" />
            </svg>
          </div>
        </div>
      </>) : (<>
        <div className=' w-3/4 h-screen flex flex-col '>
          <CodeEditor/>
        </div>
      </>)}


    </div>
  )
}
