import React, { useState } from 'react';

export function MCQForm({ mcqString }) {
  const [answers, setAnswers] = useState([]);

  const parseMCQString = (mcqString) => {
    const questions = [];
    if(mcqString != null){   const blocks = mcqString.split('Answer:');

    blocks.forEach((block) => {
      const questionAndOptions = block.split(/\d+\.\s*/);
      const question = questionAndOptions[1].split('?')[0].trim();
      const options = questionAndOptions[1].split(/[A-Z]\)\s*/).slice(1).map(option => option.trim());
      const answer = block.match(/Answer: ([A-D])\)/)[1];
      questions.push({ question, options, answer });
    });}
 

    return questions;
  };

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // You can handle submission logic here, like sending answers to server
    console.log('Submitted Answers:', answers);
  };

  const questions = parseMCQString(mcqString);

  return (
    <div>
      {questions.map((question, index) => (
        <div key={index}>
          <p>{`${index + 1}. ${question.question}`}</p>
          <div onChange={(e) => handleAnswerChange(index, e.target.value)}>
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex}>
                <input type="radio" value={String.fromCharCode(65 + optionIndex)} name={`question${index}`} />
                {`${String.fromCharCode(65 + optionIndex)}) ${option}`}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
