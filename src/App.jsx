import { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('Google français');
  const [isSpeaking, setIsSpeaking] = useState(true);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleVoiceChange = (e) => {
    setSelectedVoice(e.target.value);
  };

  const textToSpeech = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    for (let voice of voices) {
      if (voice.name === selectedVoice) {
        utterance.voice = voice;
      }
    }

    synth.speak(utterance);
  };

  const handleSpeech = () => {
    if (text !== '') {
      const synth = window.speechSynthesis;

      if (!synth.speaking) {
        textToSpeech(text);
      }

      if (text.length > 80) {
        if (isSpeaking) {
          synth.resume();
          setIsSpeaking(false);
        } else {
          synth.pause();
          setIsSpeaking(true);
        }
      }
    }
  };

  return (
    <main>
      <h2 className="title">Text To Speech</h2>
      <div className="text-section">
        <h4 className="text-title">Enter Text</h4>
        <textarea
          id="text"
          cols="40"
          rows="10"
          value={text}
          onChange={handleTextChange}
        ></textarea>
      </div>
      <div className="voice-section">
        <h4 className="voice-title">Select Voice</h4>
        <select id="voice" value={selectedVoice} onChange={handleVoiceChange}>
          {voices.map((voice, index) => (
            <option key={index} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>
      <button className="submit" onClick={handleSpeech}>
        {isSpeaking ? 'Convert To Speech' : 'Pause Speech'}
      </button>
    </main>
  );
}

export default App;
