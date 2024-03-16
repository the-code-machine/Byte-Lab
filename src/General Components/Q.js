import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const McqGenerator = () => {
    const [inputText, setInputText] = useState('');
    const [questions, setQuestions] = useState([]);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const generateMCQs = async () => {
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
                setQuestions(jsonData);
            } else {
                console.error('MCQ data not found in JSON response.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleChange = (e) => {
        if (e === questions.MCQ.answer) {
            toast.success("Correct answer!")
        }
        else {
            toast.error("wrong answer!")
        }
    }

    return (
        <div>
            <h1>MCQ Generator</h1>
            <textarea value={inputText} onChange={handleInputChange} placeholder="Enter input text"></textarea>
            <button onClick={generateMCQs}>Generate MCQs</button>
            <div>
                {questions.MCQ && (
                    <div>
                        <h2>{questions.MCQ.question}</h2>
                        <ul>
                            {questions.MCQ.options && questions.MCQ.options.map((option, index) => (
                                <li className=' cursor-pointer' onClick={()=>handleChange(option)} key={index}>{option}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default McqGenerator;
