import React, { useState } from 'react';

const VideoToQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loadingTime, setLoadingTime] = useState(null);
  const [video, setVideo] = useState('');
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const generateQuestions = async () => {
    const fileInput = document.getElementById('videoInput');
    const formData = new FormData();
    formData.append('video', fileInput.files[0]);

    setLoadingQuestions(true); // Start loading questions

    const startTime = Date.now();

    try {
      const response = await fetch('http://127.0.0.1:5000/generate-questions', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setQuestions(data.questions);
      const endTime = Date.now();
      setLoadingTime(endTime - startTime);
      setLoadingQuestions(false); // Stop loading questions
    } catch (error) {
      console.error('Error:', error);
      setLoadingQuestions(false); // Stop loading questions in case of error
    }
  };

  const checkAnswer = (selectedOption, correctAnswer) => {
//     const selectedValue = selectedOption.value;
//     if (selectedValue === correctAnswer) {
//       selectedOption.parentNode.classList.add('correct');
//     } else {
//       selectedOption.parentNode.classList.add('incorrect');
//       const correctOption = selectedOption.parentNode.querySelector('[data-correct="true"]');
//       correctOption.style.color = 'green';
//       correctOption.style.display = 'inline'; // Display correct answer for debugging
//     }
  };

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideo(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      {video && <video src={video} controls muted autoPlay className='w-full h-[60vh] p-3 rounded-3xl' />}
      <input type="file" id="videoInput" accept="video/*" onChange={handleVideoChange} />
      <button onClick={generateQuestions} className='rounded-full bg-black text-lg font-semibold text-white px-6 py-2'>Generate Questions</button>
      {loadingQuestions && <div className=' text-lg text-black font-medium'>Loading questions...</div>}
      <div id="questionsContainer" className=' w-full'>
        {questions.map((question, index) => (
          <div key={index}>
            <p className=' text-lg font-medium'>{question.text}</p>
            {['A', 'B', 'C', 'D'].map((option, optionIndex) => (
              <label key={optionIndex} className=' mx-4 text-lg font-medium'>
                <input
                className=' mx-2'
                  type="radio"
                  name={`question${index}`}
                  value={option}
                  onChange={(e) => checkAnswer(e.target, question.correct_answer)}
                />
                {option}
                {option === question.correct_answer.trim() && (
                  <span data-correct="true" style={{ display: 'none' }}>{question.correct_answer}</span>
                )}
              </label>
            ))}
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default VideoToQuestions;
