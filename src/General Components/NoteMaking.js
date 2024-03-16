import React, { useEffect, useRef, useState, useContext ,useCallback} from 'react';
import { Link } from 'react-router-dom';
import { stateToHTML } from 'draft-js-export-html';
import Select from 'react-select';
// import animationData from "../Animations/Animation - 1702456562067 (1).json"
import Lottie from 'lottie-react';
import { Editor, EditorState, RichUtils, convertToRaw, ContentState, AtomicBlockUtils, Modifier, Entity } from 'draft-js';
import 'draft-js/dist/Draft.css';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Checkbox,
  Radio,
  Card, CardBody, CardFooter,
} from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, get } from 'firebase/database';
import { css } from '@emotion/react';
import { CircleLoader } from 'react-spinners';
import User from './Context';

const ImageBlock = (props) => {
  const { contentState, block } = props;
  const entityKey = block.getEntityAt(0);
  if (!entityKey) {
    return null;
  }

  const { src } = contentState.getEntity(entityKey).getData();

  return <img src={src} alt="Inserted" style={{ width: '100%', height: '50%', margin: 'auto', display: 'block' }} />;
};

const blockRendererFn = (contentBlock) => {
  const type = contentBlock.getType();
  if (type === 'atomic') {
    return {
      component: ImageBlock,
      editable: false,
    };
  }
  return null;
};


const Writer = () => {
  const codeRef = useRef(null);
  const [user, setUser] = useContext(User);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editorRef = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCross, setIsCross] = useState(false);
  const [tittleActive, setTitleActive] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [opennoti, setOpennoti] = React.useState(false);
  const [blogId, setBlogId] = useState("")



  const handleOpennoti = () => setOpennoti(!opennoti);
  const SucsessBlog = () => {
    const [copyState, setCopyState] = useState(false);
    const handleCopy = () => {
      navigator.clipboard.writeText(blogId).then(
        function () {
          setCopyState(true);
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



    return (

      <Dialog open={opennoti} handler={handleOpennoti} className='m-0'>
        <DialogHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" color="blue-gray">
            Congratulations!🎉
          </Typography>
          <Typography variant="h5" color="blue-gray" className='truncate-ellipsis'>

            <button
              className={`relative text-gray-500 ml-5 ${copyState ? "text-black pointer-events-none" : ""
                }`}
              onClick={handleCopy}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              {copyState ? (
                <div className="absolute -top-12 -left-3 px-2 py-1.5 rounded-xl  bg-black font-semibold text-white text-[10px] after:absolute after:inset-x-0 after:mx-auto after:top-[22px] after:w-2 after:h-2 after:bg-black after:rotate-45">
                  Copied
                </div>
              ) : (
                ""
              )}
            </button>
          </Typography>
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <Lottie
            className='md:w-96 md:h-96 w-full h-60'
            lottieRef={codeRef}
            // animationData={animationData}

          />
          <Typography color="black" className='text-lg md:text-4xl font-bold'>
            We appreciate you for your publish.
          </Typography>
          <Typography className="text-center font-normal w-3/4">
            Thank you for submitting your blog. Your contribution is appreciated! Your insights and ideas are valuable to our community.
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpennoti}>
            close
          </Button>
          <Link to={`/happenings/blog/${blogId}`}>  <Button variant="gradient">
            Go to Your Blog
          </Button></Link>
        </DialogFooter>
      </Dialog>

    )

  }

  const handleIconClick = () => {
    setIsCross((prev) => !prev);
    // Use querySelectorAll to get all elements with the "menuitem" class
    const menuItems = document.querySelectorAll(".menuitem");


    menuItems.forEach((menuItem) => {
      if (menuItem.style.opacity == 0) {
        menuItem.style.opacity = 1;
      }
      else {
        menuItem.style.opacity = 0;
      }


    });
  };
  const handleInsert = (type) => {
    let newEditorState;

    switch (type) {
      case 'image':
        // Open a file dialog to select an image from the user's machine
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
              const imageUrl = readerEvent.target.result;
              const contentState = editorState.getCurrentContent();
              const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', { src: imageUrl });
              const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
              newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
              setEditorState(
                AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
              );

            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
        break;

      case 'bold':
        newEditorState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
        break;

      case 'link':
        let contentState = editorState.getCurrentContent();
        let selection = editorState.getSelection();

        const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url: 'https://example.com' });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        // Apply the link entity to the selected text
        const newContentState = Modifier.applyEntity(contentStateWithEntity, selection, entityKey);

        // Update the editor state with the new content state
        newEditorState = EditorState.push(editorState, newContentState, 'apply-entity');

        // Make the link text blue and underlined
        const currentContent = newEditorState.getCurrentContent();
        const updatedContent = Modifier.applyInlineStyle(currentContent, selection, 'BLUE_UNDERLINE');

        // Update the editor state with the new content state including the style
        newEditorState = EditorState.push(newEditorState, updatedContent, 'change-inline-style');
        break;

      case 'codeblock':
        const selectionCodeBlock = editorState.getSelection();
        if (!selectionCodeBlock.isCollapsed()) {
          // Proceed only if there's a non-collapsed selection
          const contentStateCodeBlock = editorState.getCurrentContent();
          const blockKeyCodeBlock = selectionCodeBlock.getStartKey();
          const blockCodeBlock = contentStateCodeBlock.getBlockForKey(blockKeyCodeBlock);

          // Wrap the selected text in a code block
          const newContentStateCodeBlock = Modifier.setBlockType(contentStateCodeBlock, selectionCodeBlock, 'code-block');

          // Update the editor state with the new content state
          newEditorState = EditorState.push(editorState, newContentStateCodeBlock, 'change-block-type');
        }
        break;

      case 'numberBullet':
        newEditorState = RichUtils.toggleBlockType(editorState, 'ordered-list-item');
        break;

      case 'dotBullet':
        newEditorState = RichUtils.toggleBlockType(editorState, 'unordered-list-item');
        break;

      default:
        break;
    }

    if (newEditorState) {
      setEditorState(newEditorState);
    }
  };


  const convertContentToHTML = (editorState) => {
    const contentState = editorState.getCurrentContent();

    return stateToHTML(contentState);
  };

  const calculateReadingTime = () => {
    const htmlContent = convertContentToHTML(editorState);
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const extractWordsFromNode = (node) => {
      return node.textContent.split(/\s+/).filter((word) => word !== '');
    };

    const countWordsInNode = (node) => {
      const words = extractWordsFromNode(node);
      return words.length;
    };

    // Count words in paragraphs
    const paragraphs = doc.querySelectorAll('p');
    let totalWords = 0;

    paragraphs.forEach((paragraph) => {
      totalWords += countWordsInNode(paragraph);
    });

    // Count words in list items (li)
    const listItems = doc.querySelectorAll('li');

    listItems.forEach((listItem) => {
      totalWords += countWordsInNode(listItem);

    });
    const wordsPerMinute = 150;
    const timeInMinutes = totalWords / wordsPerMinute;
    return Math.ceil(timeInMinutes);
  };

  const checkDescriptionParagraph = () => {
    const htmlContent = convertContentToHTML(editorState);

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const paragraphs = doc.querySelectorAll('p');

    for (let i = 0; i < paragraphs.length; i++) {
      const words = paragraphs[i].textContent.split(/\s+/);

      if (words.length > 10) {

        return paragraphs[i].textContent;
      }
    }
    toast.warn("There is no description found in your Blog.");
    return null;
  };



  const handleOpen = () => setOpen(!open);
  const Dailog = () => {
    const [selectedImages, setSelectedImages] = useState(Array.from({ length: 1 }, () => ({ preview: null })));
    const [titleinner, setTitleinner] = useState(title);
    const [Category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hashtags, setHashtags] = useState([])
    const [selectedType, setSelectedType] = useState('All');
    const MAX_IMAGE_SIZE_MB = 5;
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
    const textContent = async () => {
      try {
        const htmlContent = convertContentToHTML(editorState);

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        const paragraphs = doc.querySelectorAll('p');
        let text = "";

        paragraphs.forEach((paragraph) => {
          text += paragraph.textContent + ' ';
        });

        return text.trim();
      } catch (error) {
        console.error('Error getting text content:', error.message);
        return "";
      }
    };

    const handleGenerateHashtags = async () => {
      const text = await textContent();

      if(text !=""){
      try {
         console.log(text);

        const response = await fetch('https://hastages-gen.onrender.com/get_hashtags', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ blog_text: text }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setHashtags(data.hashtags);
        console.log(data.hashtags); // Log the updated state
      } catch (error) {
        console.error('Error fetching hashtags:', error.message);
      }}
      else{
        console.log(text);
        toast.warn("Your Blog is Blank, Please right something intrested!!")
      
      }
    };
    const handleGenerateHashtagsCallback = useCallback(handleGenerateHashtags, []);

    useEffect(() => {
      if (open) {
        handleGenerateHashtagsCallback();
      }
      else{
        setOpen(false)
      }
    }, [open, handleGenerateHashtagsCallback]);
    

    const handleTypeChange = (event) => {
      setSelectedType(event.target.id)
    };


    const url = "https://flask-apis-orpin.vercel.app/upload";
    const urlhtml = "https://flask-api-html.vercel.app/upload"
    const handleSelectCategoryChange = (option) => {
      setCategory(option)
    }
    const handleFileChange = (e, index) => {
      const file = e.target.files[0];

      // Check if the file is of allowed type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error('Only JPG, JPEG, and PNG images are allowed.');
        return;
      }

      // Check if the file size is within the limit
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        toast.error(`Image size should be less than ${MAX_IMAGE_SIZE_MB} MB.`);
        return;
      }

      const fr = new FileReader();

      fr.addEventListener('loadend', () => {
        const res = fr.result;
        const updatedImages = [...selectedImages];
        updatedImages[index] = { preview: res };
        setSelectedImages(updatedImages);
      });

      fr.readAsDataURL(file);
    };



    const handleRemove = (index) => {
      const updatedImages = [...selectedImages];
      updatedImages[index] = { preview: null };
      setSelectedImages(updatedImages);
    };
    const handleSendClick = async () => {
      try {


        const formData = new FormData();

        selectedImages.forEach((image, index) => {
          if (image.preview) {
            const spt = image.preview.split("base64,")[1];
            const blob = new Blob([Uint8Array.from(atob(spt), char => char.charCodeAt(0))], { type: 'image/jpeg' });
            formData.append(`image_${index + 1}`, blob, `image_${index + 1}.jpg`);
          }
        });
        if (formData != null) {
          const response = await fetch(url, {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();


            return result;
          } else {
            toast.error('Error uploading images:', response.statusText);
            return null;
          }
        }
        else {
          setLoading(false);

          toast.warn("Please select one related image.")
        }
      } catch (error) {
        toast.error('Error uploading images:', error);
        return null;
      } finally {

      }
    };
    const handleSendHtmlContent = async () => {
      try {
        const htmlContent = convertContentToHTML(editorState);

        // Create a Blob with the HTML content
        const blob = new Blob([htmlContent], { type: 'text/plain' });

        // Append the Blob to FormData with a filename
        const formData = new FormData();
        formData.append('file', blob, 'content.txt'); // 'file' is the key for the file

        if (formData != null) {
          const response = await fetch(urlhtml, {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Response:', result);
            return result;
          } else {
            console.error('Error uploading content:', response.statusText);
            return null;
          }
        }
        else {
          setLoading(false);
          toast.warn("There is no Blog found .")

        }
      } catch (error) {
        console.error('Error uploading content:', error);
        return null;
      } finally {

      }
    };


    const uploadToFirebase = async () => {
      try {
        setLoading(true);
        const tittleCount = titleinner.split(/\s+/);

        if (tittleCount.length <= 6) {
          setLoading(false);
          toast.warn('Your title is too small.');

          return;
        }

        const description = checkDescriptionParagraph();
        const imagesObject = await handleSendClick();
        if (selectedImages.filter(img => img.preview !== null).length < 1) {
          setLoading(false);
          toast.warn('Please upload at least one related image.');

          return;
        }
        const htmlObject = await handleSendHtmlContent();
        const readTime = calculateReadingTime();





        if (!Category || !htmlObject || !description || !readTime) {
          setLoading(false);
          console.log(imagesObject, htmlObject, description, readTime)
          toast.error('Please fill in all fields.');
          return;
        }


        await handleDataUpload(imagesObject, htmlObject, description, readTime);

      } catch (error) {
        toast.error('Error uploading data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    const handleDataUpload = async (imagesObject, htmlObject, description, readTime) => {
      try {
        const identifier = Date.now();
        const userId = user.userId;
        const username = user.username;
        const name = user.name;
        const categorytype = selectedType;
        const uniqueId = `blog?${categorytype}_%0108Ic_${identifier}_${userId}`.replace(/\s/g, '');
        const userData = {
          titleinner,
          userId,
          uniqueId,
          Category,
          imagesObject,
          htmlObject,
          selectedType,
          username,
          name,
          identifier,
          description,
          readTime
        };

        await set(ref(getDatabase(), `cloudburst/happenings/blogs/${uniqueId}`), userData);
        setLoading(false);
        toast.success("Blog posted sucessfully.")
        setOpen(false);
        setBlogId(uniqueId);
        handleOpennoti();
        setCategory("")
        setTitleinner("")
        selectedType("All")




      } catch (error) {
        toast.error('Error storing user data: ' + error.message);
      }
    };
    return (
      <>
        {loading ? (
          <>
            <div className="fixed inset-0 w-full z-nav h-screen bg-black opacity-40" />
            <div className="fixed top-[40%] left-[50%] translate-x-[-50%]  md:w-3/4 w-full z-nav  px-2 md:px-0">
              <div class="grid min-h-[140px] w-full fixed  place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
                <svg class="w-16 h-16 animate-spin  text-gray-900/50" viewBox="0 0 64 64" fill="none"
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                  <path
                    d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                    stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path
                    d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                    stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-900">
                  </path>
                </svg>
              </div></div></>) : (<>
                <Dialog open={open} handler={handleOpen} className='m-0' >



                  <DialogBody>
                    <Card className='p-3 '>
                      <div className='flex md:flex-row flex-col md:gap-4'>
                        <div className=' flex flex-col md:w-1/2 w-full gap-4'>
                          <Typography variant="h4" color="blue-gray">
                            Publish
                          </Typography>
                          <Typography
                            className="mb-1 font-normal"
                            variant="paragraph"
                            color="gray"
                          >
                            Upload real-time blogs directly on cloudburst.
                          </Typography>
                          <Typography className="-mb-2" variant="h6">
                            Confirm Blog Title
                          </Typography>
                          <div class="relative h-11 w-full min-w-[200px]">
                            <input
                              class="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 border-t-transparent text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                              placeholder=" " value={titleinner} onChange={(e) => setTitleinner(e.target.value)} />
                            <label
                              class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                              Title
                            </label>
                          </div>
                          <Typography className="-mb-3" variant="h6">
                            Add Related Hashtags
                          </Typography>
                          <Typography
                            className="font-normal"
                            variant="paragraph"
                            color="gray"
                          >
                            Showcase your blog to get #targeted people #impressions.
                          </Typography>
                          <Select
                            value={Category}
                            onChange={(option) => handleSelectCategoryChange(option)}
                            options={hashtags}
                            className="w-full " // Adjust width as needed
                            classNamePrefix="select"
                            placeholder="Choose Category"
                            isSearchable
                            isMulti
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                borderRadius: '0.375rem',
                                '&:focus': {
                                  border: '2px solid #111827', // Custom border color on hover
                                },
                                '&:hover': {
                                  border: '2px solid #111827', // Custom border color on hover
                                },
                                border: "0.5px solid #E5E7EB",
                                boxShadow: "#111827"
                              }),
                              option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected ? 'bg-studentplus-bgDark' : 'bg-white',
                                color: state.isSelected ? 'text-white' : 'text-gray-800',

                              }),
                            }}
                          />

                        </div>
                        <div className=' flex flex-col md:w-1/2 w-full gap-4'>
                          <Typography variant="h4" color="blue-gray">
                            image
                          </Typography>
                          <div className='w-full'>
                            {selectedImages.map((image, index) => (
                              <div key={index}>
                                {!image.preview ? (
                                  <div
                                    onClick={() => document.querySelector('input[type="file"]').click()}
                                    className='cursor-pointer rounded-2xl  border-2 border-gray-200 md:p-5 md:h-60 text-gray-200 flex-col h-20 p-3 flex justify-center md:text-lg text-xs items-center'
                                  >
                                    <input
                                      type="file"
                                      accept="image/*"
                                      style={{ display: 'none' }}
                                      onChange={(e) => handleFileChange(e, index)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                      class="w-25 h-25">
                                      <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z">
                                      </path>
                                    </svg>
                                    <p className='text-gray-300'>click to select an image.</p>
                                  </div>
                                ) : (
                                  <div className='md:h-60 h-20 w-full'>
                                    <button onClick={() => handleRemove(index)}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 mx-auto"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                    <div className='md:h-56 h-16 p-3 w-full'>
                                      <img
                                        src={image.preview}
                                        alt={`Selected ${index + 1}`}
                                        className='h-full w-full object-contain'
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div></div>
                    </Card>
                  </DialogBody>

                  <DialogFooter className=' justify-start md:flex-row flex-col'>
                    <div class="md:w-3/5 w-full">
                      <div className="grid md:grid-cols-5 grid-cols-2 gap-1 text-sm">

                        <div class="inline-flex items-center">
                          <label class="relative flex items-center p-1 rounded-full cursor-pointer" htmlFor="All">
                            <input onChange={handleTypeChange} name="type" checked={selectedType === 'All'} type="radio"
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                              id="All" defaultChecked />
                            <span
                              class="absolute text-gray-900 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                                <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                              </svg>
                            </span>
                          </label>
                          <label class="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="All">
                            All
                          </label>
                        </div>
                        <div class="inline-flex items-center">
                          <label class="relative flex items-center p-1 rounded-full cursor-pointer" htmlFor="News">
                            <input onChange={handleTypeChange} checked={selectedType === 'News'} name="type" type="radio"
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                              id="News" />
                            <span
                              class="absolute text-gray-900 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                                <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                              </svg>
                            </span>
                          </label>
                          <label class="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="News">
                            News
                          </label>
                        </div>
                        <div class="inline-flex items-center">
                          <label class="relative flex items-center p-1 rounded-full cursor-pointer" htmlFor="College">
                            <input onChange={handleTypeChange} name="type" checked={selectedType === 'College'} type="radio"
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                              id="College" />
                            <span
                              class="absolute text-gray-900 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                                <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                              </svg>
                            </span>
                          </label>
                          <label class="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="College">
                            College
                          </label>
                        </div>
                        <div class="inline-flex items-center">
                          <label class="relative flex items-center p-1 rounded-full cursor-pointer" htmlFor="Technology">
                            <input onChange={handleTypeChange} name="type" type="radio" checked={selectedType === 'Technology'}
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                              id="Technology" />
                            <span
                              class="absolute text-gray-900 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                                <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                              </svg>
                            </span>
                          </label>
                          <label class="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="Technology">
                            Technology
                          </label>
                        </div>
                        <div class="inline-flex items-center">
                          <label class="relative flex items-center p-1 rounded-full cursor-pointer" htmlFor="Relationships">
                            <input onChange={handleTypeChange} name="type" type="radio" checked={selectedType === 'Relationships'}
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                              id="Relationships" />
                            <span
                              class="absolute text-gray-900 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                                <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                              </svg>
                            </span>
                          </label>
                          <label class="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="Relationships">
                            Relationships
                          </label>
                        </div>


                      </div>
                    </div>
                    <div className='w-full flex md:w-2/5 justify-end'>
                      <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                      >
                        <span>Cancel</span>
                      </Button>
                      <Button variant="gradient" color="green" onClick={
                        uploadToFirebase
                      }>
                        <span>Confirm</span>
                      </Button></div>
                    <ToastContainer />
                  </DialogFooter>
                  <ToastContainer />
                </Dialog> </>)}
      </>
    )
  }


  return (
    <div>

       
          <Editor
            placeholder='Write something here...'
            editorState={editorState}
            onChange={setEditorState}
            blockRendererFn={blockRendererFn}
            ref={editorRef}
            className="text-2xl"
          />
      

        <div className='w-full fixed bottom-0 flex items-center justify-center h-16'>
          <svg onClick={() => handleInsert('image')} class=" menuitem svgIcon-use mr-3 cursor-pointer opacity-0  transition-opacity duration-300 " width="32" height="32" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M19 17a2 2 0 100-4 2 2 0 000 4zm0-1a1 1 0 100-2 1 1 0 000 2z" fill="#1A8917"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 10h12a2 2 0 012 2v8a2 2 0 01-2 2H10a2 2 0 01-2-2v-8a2 2 0 012-2zm0 1a1 1 0 00-1 1v4.293l2.646-2.647a.5.5 0 01.708 0L19.707 21H22a1 1 0 001-1v-8a1 1 0 00-1-1H10zm8.293 10L12 14.707l-3 3V20a1 1 0 001 1h8.293z" fill="#1A8917"></path>
            <rect x=".5" y=".5" width="31" height="31" rx="15.5" stroke="#1A8917"></rect>
          </svg>
          <svg onClick={() => handleInsert('link')} class=" menuitem svgIcon-use mr-3 cursor-pointer opacity-0  transition-opacity duration-200 " width="32" height="32" fill="none">
            <circle cx="16" cy="16" r="15.5" stroke="#1A8917" />
            <path d="M15.1968 16.4105C15.311 16.5627 15.3665 16.751 15.353 16.9408C15.3395 17.1307 15.258 17.3093 15.1234 17.4438C14.9888 17.5784 14.8102 17.6599 14.6204 17.6734C14.4306 17.6869 14.2423 17.6314 14.09 17.5173C13.7119 17.1624 13.4105 16.7337 13.2045 16.2578C12.9985 15.7819 12.8922 15.2688 12.8922 14.7502C12.8922 14.2317 12.9985 13.7186 13.2045 13.2427C13.4105 12.7667 13.7119 12.3381 14.09 11.9832L16.8571 9.13715C17.6093 8.40784 18.6159 8 19.6636 8C20.7113 8 21.7179 8.40784 22.4702 9.13715C23.1995 9.88938 23.6073 10.896 23.6073 11.9437C23.6073 12.9914 23.1995 13.998 22.4702 14.7502L21.2843 15.9361C21.3012 15.2892 21.1938 14.6451 20.9681 14.0387L21.3633 13.6434C21.7855 13.178 22.0194 12.5721 22.0194 11.9437C22.0194 11.3153 21.7855 10.7094 21.3633 10.244C20.8979 9.82175 20.292 9.58788 19.6636 9.58788C19.0352 9.58788 18.4293 9.82175 17.9639 10.244L15.1968 13.09C14.972 13.3042 14.793 13.5617 14.6707 13.8471C14.5484 14.1325 14.4853 14.4398 14.4853 14.7502C14.4853 15.0607 14.5484 15.368 14.6707 15.6534C14.793 15.9388 14.972 16.1963 15.1968 16.4105ZM25 20.0471V21.6283H22.6283V24H21.0471V21.6283H18.6754V20.0471H21.0471V17.6754H22.6283V20.0471M19.6241 16.6476C19.7611 16.0095 19.7312 15.3468 19.5373 14.7236C19.3435 14.1004 18.9921 13.5378 18.5173 13.09C18.365 12.9759 18.1767 12.9204 17.9869 12.9339C17.7971 12.9474 17.6185 13.0289 17.4839 13.1635C17.3493 13.298 17.2678 13.4766 17.2543 13.6665C17.2408 13.8563 17.2963 14.0446 17.4105 14.1968C17.6353 14.411 17.8143 14.6685 17.9366 14.9539C18.0589 15.2393 18.122 15.5466 18.122 15.8571C18.122 16.1675 18.0589 16.4748 17.9366 16.7602C17.8143 17.0456 17.6353 17.3031 17.4105 17.5173L14.6434 20.3633C14.178 20.7855 13.5721 21.0194 12.9437 21.0194C12.3153 21.0194 11.7094 20.7855 11.244 20.3633C10.8217 19.8979 10.5879 19.292 10.5879 18.6636C10.5879 18.0352 10.8217 17.4293 11.244 16.9639L11.6392 16.6476C11.4195 16.0123 11.3125 15.3434 11.323 14.6712L10.1371 15.8571C9.40784 16.6093 9 17.6159 9 18.6636C9 19.7113 9.40784 20.7179 10.1371 21.4702C10.8894 22.1995 11.896 22.6073 12.9437 22.6073C13.9914 22.6073 14.998 22.1995 15.7502 21.4702L17.1733 20.0471C17.2941 19.3306 17.578 18.6515 18.0029 18.062C18.4278 17.4726 18.9825 16.9887 19.6241 16.6476Z" fill="#1A8917" />
          </svg>

          <svg onClick={() => handleInsert('dotBullet')} class=" menuitem svgIcon-use mr-3 cursor-pointer opacity-0  transition-opacity duration-100 " width="32" height="32" fill="none">
            <circle cx="16" cy="16" r="15.5" stroke="#1A8917" />
            <path d="M11.2 16.8889C9.432 16.8889 8 18.48 8 20.4444C8 22.4089 9.432 24 11.2 24C12.968 24 14.4 22.4089 14.4 20.4444C14.4 18.48 12.968 16.8889 11.2 16.8889ZM11.2 22.2222C10.32 22.2222 9.6 21.4222 9.6 20.4444C9.6 19.4667 10.32 18.6667 11.2 18.6667C12.08 18.6667 12.8 19.4667 12.8 20.4444C12.8 21.4222 12.08 22.2222 11.2 22.2222ZM11.2 8C9.432 8 8 9.59111 8 11.5556C8 13.52 9.432 15.1111 11.2 15.1111C12.968 15.1111 14.4 13.52 14.4 11.5556C14.4 9.59111 12.968 8 11.2 8ZM16 9.77778H24V11.5556H16V9.77778ZM16 22.2222V20.4444H24V22.2222H16ZM16 15.1111H24V16.8889H16V15.1111Z" fill="#1A8917" />
          </svg>

          <span className='w-30 h-30 rounded-full bg-transparent  mr-3 flex items-center justify-center  border-c-thin '>
            <svg class="svgIcon-use" onClick={handleIconClick} className=' cursor-pointer' style={{ transform: isCross ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} width="25" height="25"><path d="M20 12h-7V5h-1v7H5v1h7v7h1v-7h7" fill-rule="evenodd"></path></svg>
          </span>
          <svg onClick={() => handleInsert('numberBullet')} class=" menuitem svgIcon-use mr-3 cursor-pointer opacity-0  transition-opacity duration-100 " width="32" height="32" fill="none">
            <path d="M11.5789 15.1111H8V13.3333H11.5789V12.4444H9.78947C8.80526 12.4444 8 11.6533 8 10.6667V9.77778C8 8.8 8.80526 8 9.78947 8H11.5789C12.5721 8 13.3684 8.8 13.3684 9.77778V13.3333C13.3684 14.32 12.5721 15.1111 11.5789 15.1111ZM11.5789 9.77778H9.78947V10.6667H11.5789M9.78947 16.8889H11.5789C12.5721 16.8889 13.3684 17.6889 13.3684 18.6667V22.2222C13.3684 23.2089 12.5721 24 11.5789 24H9.78947C8.80526 24 8 23.2089 8 22.2222V18.6667C8 17.6889 8.80526 16.8889 9.78947 16.8889ZM9.78947 22.2222H11.5789V18.6667H9.78947M16.0526 9.77778H25V11.5556H16.0526M16.0526 22.2222V20.4444H25V22.2222M16.0526 15.1111H25V16.8889H16.0526V15.1111Z" fill="#1A8917" />
            <circle cx="16" cy="16" r="15.5" stroke="#1A8917" />
          </svg>
          <svg onClick={() => handleInsert('bold')} class=" menuitem svgIcon-use mr-3 cursor-pointer opacity-0  transition-opacity duration-200 " width="32" height="32" fill="none">
            <path d="M12.0746 23V10.6364H17.0249C17.9344 10.6364 18.6931 10.7712 19.3008 11.0408C19.9085 11.3105 20.3653 11.6848 20.6712 12.1637C20.977 12.6386 21.13 13.186 21.13 13.8058C21.13 14.2887 21.0334 14.7133 20.8402 15.0795C20.647 15.4418 20.3814 15.7396 20.0433 15.973C19.7093 16.2024 19.3269 16.3654 18.8963 16.462V16.5827C19.3672 16.6029 19.8079 16.7357 20.2184 16.9812C20.6329 17.2267 20.969 17.5708 21.2266 18.0135C21.4841 18.4522 21.6129 18.9754 21.6129 19.5831C21.6129 20.2391 21.4499 20.8247 21.1239 21.3398C20.802 21.851 20.325 22.2554 19.6932 22.5533C19.0613 22.8511 18.2826 23 17.3569 23H12.0746ZM14.6886 20.8629H16.8196C17.5481 20.8629 18.0793 20.7241 18.4134 20.4464C18.7474 20.1647 18.9144 19.7904 18.9144 19.3235C18.9144 18.9814 18.8319 18.6796 18.6669 18.418C18.5019 18.1564 18.2665 17.9511 17.9606 17.8022C17.6587 17.6533 17.2985 17.5788 16.88 17.5788H14.6886V20.8629ZM14.6886 15.81H16.6264C16.9846 15.81 17.3026 15.7476 17.5803 15.6229C17.862 15.4941 18.0833 15.313 18.2443 15.0795C18.4093 14.8461 18.4918 14.5664 18.4918 14.2404C18.4918 13.7937 18.3329 13.4335 18.0149 13.1598C17.701 12.8861 17.2543 12.7493 16.6747 12.7493H14.6886V15.81Z" fill="#1A8917" />
            <circle cx="16" cy="16" r="15.5" stroke="#1A8917" />
          </svg>
          <svg onClick={() => handleInsert('codeblock')} class=" menuitem svgIcon-use mr-3 cursor-pointer opacity-0  transition-opacity duration-300 " width="33" height="33" viewBox="0 0 32 32" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.05 9.441c.771-.724 1.773-.941 2.7-.941 0 0 .5 0 .5.5s-.5.5-.5.5c-.787 0-1.5.186-2.014.67-.51.479-.914 1.332-.914 2.858 0 1.285-.32 2.232-.907 2.859-.131.14-.272.26-.42.363.148.103.289.223.42.363.587.627.907 1.574.907 2.86 0 1.525.404 2.378.914 2.857.515.484 1.227.67 2.014.67 0 0 .5 0 .5.5s-.5.5-.5.5c-.927 0-1.929-.217-2.7-.941-.776-.73-1.228-1.89-1.228-3.587 0-1.131-.281-1.796-.637-2.175-.352-.376-1.435-.547-1.435-.547s-.5 0-.5-.5.5-.5.5-.5 1.083-.17 1.435-.547c.356-.38.637-1.044.637-2.175 0-1.697.452-2.857 1.229-3.587zm9.9 0c-.771-.724-1.773-.941-2.7-.941 0 0-.5 0-.5.5s.5.5.5.5c.787 0 1.5.186 2.015.67.51.479.913 1.332.913 2.858 0 1.285.32 2.232.907 2.859.131.14.272.26.42.363a2.633 2.633 0 00-.42.363c-.587.627-.907 1.574-.907 2.86 0 1.525-.404 2.378-.913 2.857-.516.484-1.228.67-2.015.67 0 0-.5 0-.5.5s.5.5.5.5c.927 0 1.929-.217 2.7-.941.776-.73 1.229-1.89 1.229-3.587 0-1.131.28-1.796.636-2.175.352-.376 1.435-.547 1.435-.547s.5 0 .5-.5-.5-.5-.5-.5-1.083-.17-1.435-.547c-.356-.38-.637-1.044-.637-2.175 0-1.697-.452-2.857-1.229-3.587z" fill="#1A8917"></path>
            <rect x=".5" y=".5" width="31" height="31" rx="15.5" stroke="#1A8917"></rect>
          </svg>


        </div>
    




    </div>
  );
};

export default Writer;
