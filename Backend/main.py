from flask import Flask, request, jsonify
from flask_cors import CORS
from moviepy.editor import AudioFileClip
import speech_recognition as sr
from openai import OpenAI
import os
import base64
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

api_key = "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"


client = OpenAI(api_key=api_key)

UPLOAD_FOLDER = 'public/pdf'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload-pdf', methods=['POST'])
def upload_pdf():
    if 'pdf_file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    pdf_file = request.files['pdf_file']
    # Ensure a secure filename
    filename = secure_filename(pdf_file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    pdf_file.save(file_path)

    return jsonify({'message': 'PDF file uploaded successfully', 'file_path': file_path}), 200

@app.route('/generate_questions', methods=['POST'])
def generate_questions():
    input_text = request.json.get('input_text', '')

    prompt = (
           "Generate 1 MCQ questions and 3 True/False questions along with their answers in JSON format based on the following text:\n"
           + input_text
       )
    completion1 = client.completions.create(
           model="gpt-3.5-turbo-instruct",
           prompt=prompt,
           max_tokens=1000,
           temperature=0
       )
    completion2 = client.completions.create(
           model="gpt-3.5-turbo-instruct",
           prompt="convert this into json"+completion1.choices[0].text,
           max_tokens=1000,
           temperature=0
       )
    print("Completion Text:", completion2.choices[0].text)




    
    return jsonify({"mcq":completion2.choices[0].text})

@app.route('/video-to-text', methods=['POST'])
def video_to_text():
    if 'video_file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    video_file = request.files['video_file']
    video_path = 'public/videos/temp_video.mp4'
    video_file.save(video_path)
    audio_path = 'public/audios/temp_audio.wav'
    audio_clip = AudioFileClip(video_path)
    audio_clip.write_audiofile(audio_path)
    
    recognizer = sr.Recognizer()
    
    try:
        with sr.AudioFile(audio_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_sphinx(audio_data)
            # Encode audio data as base64
            with open(audio_path, "rb") as audio_file:
                encoded_audio = base64.b64encode(audio_file.read()).decode('utf-8')
                print(text)
            return jsonify({'text': text, 'audio': encoded_audio}), 200
        
        
        
    except sr.UnknownValueError:
        return jsonify({'error': 'Speech recognition could not understand the audio'}), 400
    except sr.RequestError as e:
        return jsonify({'error': 'Speech recognition error: {}'.format(e)}), 500

           
if __name__ == '__main__':
    app.run(debug=True)
