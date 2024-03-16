import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';

// For autocompletion
import { StreamLanguage } from '@codemirror/language';
import { python } from '@codemirror/legacy-modes/mode/python';
import { c } from '@codemirror/legacy-modes/mode/clike'
import { java } from '@codemirror/legacy-modes/mode/clike';
import { dracula } from '@uiw/codemirror-theme-dracula';
const CodeEditor = () => {
    const pyLang = `# Python program to find the factorial of a number provided by the user.
# change the value for a different result
num = 7
# To take input from the user
#num = int(input("Enter a number: "))
        
factorial = 1
        
# check if the number is negative, positive or zero
if num < 0:
   print("Sorry, factorial does not exist for negative numbers")
elif num == 0:
   print("The factorial of 0 is 1")
else:
   for i in range(1,num + 1):
       factorial = factorial*i
   print("The factorial of",num,"is",factorial)
`;
    const javalang = `//Java Hello world Program
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

`;
    const cpplang = `//C Hello World Program
#include <stdio.h>
int main() {
printf("Hello, World!");
return 0;
}

`;
    const [options, setOptions] = useState(1);
    const [code, setCode] = useState({ 1: pyLang, 2: cpplang, 3: javalang });


    // Define a list of supported modes
    const modes = {
        python: 'python',
        c: 'text/x-csrc',
        java: 'text/x-java',
    };

    // Define a function to handle autocompletion
    const handleAutocomplete = (editor) => {
        const mode = modes['python']; // Change this based on the selected language

        CodeMirror.commands.autocomplete(editor, null, { mode });
    };

    const run = async () => {
        let language;
        if (options == 1) {
            language = "python3"
        }
        else if (options == 2) {
            language = "c"
        }
        else {
            language = "java"
        }
        var data = {
            code: code[options],
            language: language,
            input: "null",
            version: "latest"
        };
        console.log(data)

        var oData = await fetch("https://online-code-compiler.p.rapidapi.com/v1/", {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': 'c8bb3ea8d3mshc86f58f359c006ep1c8779jsnea40fd068200',
                'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
            },
            body: JSON.stringify(data)
        });


        var d = await oData.json();
        console.log(d.output)
        setCode({ ...code, [options]: d.output });

    }
    return (
        <div className="flex-col  bg-code-editor rounded-xl ">
            <style>
                {`
                .cm-scroller::-webkit-scrollbar{
                    display: none;
                  }
                  
                  .CodeMirror-vscrollbar{
                    overflow-y: hidden;
                  }`}
            </style>
            <div className=" text-lg font-mono font-semibold flex w-full ">
                <div className=" text-lg font-mono  font-semibold flex w-1/2 p-2">
                    <div onClick={() => setOptions(1)} className={`text-white bg-black flex items-center mr-3 cursor-pointer  justify-center w-5 h-5 mb-1 rounded-full ${options==1?"bg-white":"bg-code-editor"} `}>
                        <svg width="16" height="16" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_21_181)">
                                <path d="M18.0112 24.7941L17.7421 25.1803L17.6483 25.6603L17.7421 26.1403L18.0112 26.5266L18.3974 26.7957L18.8774 26.8894L19.3574 26.7957L19.7437 26.5266L20.0127 26.1403L20.1065 25.6603L20.0127 25.1803L19.7437 24.7941L19.3574 24.525L18.8774 24.4313L18.3974 24.525L18.0112 24.7941ZM25.5908 8.10003L25.919 8.17035L26.294 8.31097L26.7037 8.52191L27.1255 8.83785L27.5474 9.24753L27.9571 9.79785L28.3321 10.4888L28.6602 11.3438L28.9058 12.375L29.0699 13.5938L29.128 15.0347L29.0577 16.4757L28.8702 17.6944L28.589 18.7022L28.214 19.5338L27.7921 20.2013L27.3233 20.7282L26.8312 21.1144L26.339 21.3957L25.8702 21.5832L25.4483 21.6882L25.0733 21.7463L24.7921 21.7697L24.6046 21.7585H14.9746V22.7194H21.8165L21.8277 25.9528L21.8512 26.3747L21.793 26.7732L21.6646 27.136L21.4658 27.4753L21.1733 27.7678L20.8105 28.0491L20.3652 28.2835L19.8496 28.4822L19.2524 28.6575L18.5727 28.8094L17.8227 28.9144L16.9912 28.996L16.0893 29.0428L15.1049 29.0541L13.6171 29.0072L12.3637 28.8432L11.309 28.6088L10.454 28.3163L9.76303 27.9647L9.23615 27.5785L8.83771 27.18L8.54521 26.7816L8.35771 26.3953L8.24053 26.0438L8.19365 25.7513L8.17022 25.5169L8.18147 25.365V19.1091L8.24053 18.3591L8.3924 17.7263L8.63803 17.1872L8.94271 16.7419L9.29428 16.3669L9.68053 16.0857L10.0902 15.8513L10.4999 15.6872L10.8862 15.57L11.2377 15.4997L11.5424 15.4528L11.788 15.4294L11.9399 15.4182H18.7818L19.5899 15.36L20.2808 15.196L20.8668 14.9503L21.3468 14.6222L21.733 14.2472L22.049 13.8375L22.2833 13.4157L22.4587 12.9938L22.5758 12.5841L22.6574 12.2091L22.7043 11.881L22.7277 11.6353V8.05035H25.1765L25.3405 8.0616L25.5908 8.10003ZM10.2552 3.47253L9.98615 3.85878L9.8924 4.33878L9.98615 4.81878L10.2552 5.21722L10.6415 5.47503L11.1215 5.58003L11.6015 5.4741L11.9877 5.21628L12.2568 4.81785L12.3505 4.33785L12.2568 3.85785L11.9877 3.4716L11.6015 3.21378L11.1215 3.10878L10.6415 3.21378L10.2552 3.47253ZM17.6362 1.15222L18.6908 1.3866L19.5458 1.69128L20.2368 2.04285L20.7637 2.41785L21.1621 2.81628L21.4546 3.21472L21.6421 3.60097L21.7593 3.95253L21.8062 4.25722L21.8296 4.4916L21.8183 4.64347V10.8994L21.7602 11.6372L21.6083 12.2813L21.3627 12.8203L21.058 13.2657L20.7065 13.6285L20.3202 13.921L19.9105 14.1432L19.5008 14.3072L19.1146 14.4244L18.763 14.506L18.4583 14.5528L18.2118 14.5763H11.218L10.4099 14.6344L9.71896 14.7985L9.13303 15.0563L8.65303 15.3722L8.26678 15.7472L7.95084 16.1569L7.71646 16.5788L7.54115 17.0119L7.42397 17.4216L7.3424 17.7966L7.29553 18.1125L7.27209 18.3582V21.9432H4.65928L4.41365 21.9085L4.08553 21.8269L3.71053 21.6863L3.30084 21.4753L2.87896 21.1707L2.45709 20.7488L2.0474 20.2097L1.6724 19.5188L1.34428 18.6638L1.09865 17.6325L0.93459 16.4025L0.876465 14.9616L0.946777 13.5328L1.13428 12.3141L1.41553 11.295L1.79053 10.4635L2.2124 9.79597L2.68115 9.28035L3.17334 8.8941L3.66553 8.61285L4.13428 8.42535L4.55615 8.30816L4.93115 8.25003L5.2124 8.23878H5.3999L5.47021 8.25003H15.0299V7.27785H8.18803L8.17678 4.0566L8.15334 3.62347L8.21146 3.22503L8.3399 2.86222L8.53865 2.5341L8.83115 2.22941L9.19396 1.96035L9.63928 1.72597L10.1549 1.51503L10.7521 1.33972L11.4318 1.1991L12.1818 1.08191L13.0133 1.0116L13.9152 0.964722L14.8996 0.941284L16.3874 1.00035L17.6362 1.15222Z" fill="currentColor" />
                            </g>
                            <defs>
                                <clipPath id="clip0_21_181">
                                    <rect width="30" height="30" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>

                    </div>
                    <div onClick={() => setOptions(2)} className={`text-white bg-black flex cursor-pointer items-center mr-3 justify-center w-5 h-5 mb-1 rounded-full ${options ==2?"bg-white":"bg-code-editor"} `}>
                        <svg width="16" height="16" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.7303 17.1141C18.6276 17.5992 18.5031 18.0559 18.3348 18.4799C18.1709 18.9038 17.9545 19.2753 17.6923 19.5835C17.4323 19.896 17.111 20.1342 16.7351 20.3112C16.3593 20.486 15.8938 20.5712 15.3518 20.5712C14.5957 20.5712 13.9663 20.4095 13.4659 20.0774C12.9633 19.7496 12.5568 19.3103 12.2531 18.7662C11.9537 18.2242 11.7395 17.6145 11.604 16.9371C11.4663 16.2552 11.3964 15.5691 11.3964 14.8741C11.3964 14.1792 11.4642 13.4865 11.604 12.8112C11.7395 12.1294 11.9537 11.5197 12.2531 10.9777C12.5568 10.4357 12.9589 10.0009 13.4659 9.66871C13.9663 9.34309 14.6001 9.17483 15.3518 9.17483C16.014 9.17483 16.5516 9.30157 16.9646 9.55289C17.382 9.8042 17.7163 10.0948 17.9698 10.4248C18.219 10.7526 18.396 11.0913 18.4899 11.4279C18.5883 11.7688 18.6538 12.031 18.6954 12.2255H24.9213C24.6438 9.6097 23.7303 7.5861 22.1722 6.16565C20.6097 4.74082 18.396 4.01748 15.5267 4C13.9183 4 12.4716 4.26005 11.1823 4.78453C9.89292 5.30682 8.78715 6.04545 7.86713 6.99169C6.94493 7.94449 6.23907 9.08523 5.74082 10.4205C5.24694 11.7579 5 13.2417 5 14.8676C5 16.3995 5.23383 17.8309 5.69493 19.1573C6.16477 20.4838 6.84222 21.6333 7.74475 22.6014C8.64292 23.5717 9.74432 24.3387 11.0446 24.9025C12.3448 25.4642 13.8374 25.7439 15.5245 25.7439C17.0345 25.7439 18.3851 25.4926 19.5673 24.9878C20.7452 24.4851 21.7395 23.8186 22.5459 22.9948C23.3479 22.1709 23.9576 21.2487 24.3772 20.2194C24.7902 19.1901 25 18.1587 25 17.1075L18.7303 17.1141Z" fill="currentColor" />
                        </svg>

                    </div>
                    <div onClick={() => setOptions(3)} className={`  text-white bg-black flex items-center mr-3 cursor-pointer justify-center w-5 h-5 mb-1 rounded-full ${options==3?"bg-white":"bg-code-editor"} `}>
                        <svg width="16" height="16" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.345 28.9697C17.4085 29.2941 25.1841 28.7907 25.3678 26.3944C25.3678 26.3944 25.0144 27.3019 21.1828 28.0238C19.0669 28.4053 16.6313 28.6228 14.1441 28.6228C12.1069 28.6228 10.1044 28.4766 8.14597 28.1944L8.37003 28.2207C8.37003 28.2197 9.01784 28.756 12.345 28.9697ZM17.8125 0.941284C17.8125 0.941284 20.7347 3.86347 15.0422 8.35691C10.4775 11.9616 14.0016 14.0175 15.0413 16.366C12.3769 13.9603 10.4222 11.8463 11.7328 9.8766C13.6585 6.98441 18.9919 5.58285 17.8125 0.941284ZM20.9935 21.5419C26.2688 18.8007 23.8294 16.1653 22.1278 16.5216C21.8944 16.5657 21.6919 16.6219 21.496 16.6922L21.5241 16.6838C21.6357 16.5272 21.7894 16.4063 21.9685 16.3378L21.975 16.336C25.3435 15.1519 27.9338 19.8282 20.8875 21.6807C20.9307 21.6422 20.9663 21.5963 20.9916 21.5447L20.9935 21.5419ZM11.8275 16.4175C11.8275 16.4175 6.71722 17.6316 10.0191 18.0713C10.9078 18.1444 11.9428 18.1857 12.9872 18.1857C14.3222 18.1857 15.6413 18.1172 16.9416 17.985L16.7785 17.9982C18.8944 17.82 21.0169 17.4394 21.0169 17.4394C20.5191 17.6569 20.0963 17.8866 19.696 18.1482L19.7307 18.1275C14.5416 19.4925 4.51691 18.8578 7.40347 17.4619C8.67566 16.8028 10.1813 16.4166 11.7769 16.4166C11.7947 16.4166 11.8125 16.4166 11.8303 16.4166L11.8275 16.4175ZM23.5875 24.9628C23.5875 24.9628 24.3835 25.6182 22.7128 26.1235C19.5357 27.0863 9.48847 27.376 6.69941 26.1619C5.69628 25.725 7.57784 25.1194 8.16847 24.9928C8.44128 24.9235 8.75534 24.8832 9.07784 24.8832C9.09941 24.8832 9.12003 24.8832 9.14159 24.8841H9.13878C8.02222 24.0975 1.92659 26.4272 6.04222 27.0947C17.266 28.9144 26.4985 26.2744 23.5875 24.9628ZM16.3078 14.385C16.6022 14.7385 16.7813 15.1988 16.7813 15.6994C16.7813 16.3735 16.4569 16.9725 15.9563 17.3485L15.9507 17.3522C15.9507 17.3522 19.3941 15.5738 17.8125 13.3482C16.335 11.2725 15.2025 10.2413 21.3357 6.68441C21.3357 6.68347 11.7103 9.08722 16.3078 14.385ZM10.6369 19.6078C10.6369 19.6078 9.43222 20.4994 11.2716 20.6907C12.0769 20.7919 13.0078 20.8491 13.9528 20.8491C15.6647 20.8491 17.3325 20.6597 18.9357 20.3007L18.7838 20.3288C19.1063 20.6307 19.4916 20.8707 19.9172 21.0263L19.9407 21.0338C13.2872 22.98 5.87441 21.1857 10.636 19.6069L10.6369 19.6078ZM11.311 22.6857C11.311 22.6857 10.2366 23.311 12.076 23.5219C12.75 23.6222 13.5272 23.6794 14.3185 23.6794C15.5878 23.6794 16.8225 23.5322 18.0066 23.2528L17.8978 23.2744C18.3357 23.5416 18.8447 23.7966 19.3763 24.0075L19.4457 24.0319C13.9407 26.3907 6.98909 23.8941 11.3119 22.6857H11.311Z" fill="currentColor" />
                        </svg>

                    </div>
                </div>
                <div className=" text-lg font-mono font-semibold flex justify-end w-1/2 p-2">

                    <div onClick={run} className="flex items-center mr-3 justify-center w-5 h-5 mb-1 rounded-full cursor-pointer bg-black  ">
                        <svg
                            className="w-8 h-8  text-white"
                            stroke="currentColor"
                            viewBox="0 0 52 52"
                        >
                            <polygon
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                points="29 13 14 29 25 29 23 39 38 23 27 23"
                            />
                        </svg>

                    </div>
                </div>
            </div>
            <CodeMirror
                onChange={(value) => setCode({ ...code, [options]: value })}
                value={code[options]}
                height="530px"
                theme={dracula}
                extensions={[StreamLanguage.define(
                    options === 1 ? python :
                        options === 2 ? c :
                            options === 3 ? java :
                                python
                )]} />

        </div>
    );
};

export default CodeEditor;
