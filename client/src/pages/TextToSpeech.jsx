// TextToSpeech.jsx
/*import React, { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, Play, Pause, Square, Upload, Languages, Trash2 } from "lucide-react";

const TextToSpeech = () => {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const utteranceRef = useRef(null);

  // Load voices
  useEffect(() => {
    if (!synth) return;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.onvoiceschanged = load;
    return () => (synth.onvoiceschanged = null);
  }, [synth]);

  // Select default voice
  useEffect(() => {
    if (voiceURI || voices.length === 0) return;
    const def = voices.find(v => v.default) || voices[0];
    setVoiceURI(def?.voiceURI || "");
  }, [voices, voiceURI]);

  const selectedVoice = useMemo(
    () => voices.find(v => v.voiceURI === voiceURI),
    [voices, voiceURI]
  );

  const speak = () => {
    if (!synth || !text.trim()) return;
    synth.cancel();

    const u = new SpeechSynthesisUtterance(text);
    if (selectedVoice) u.voice = selectedVoice;
    u.rate = rate;
    u.pitch = pitch;
    u.volume = volume;

    u.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
    u.onpause = () => setIsPaused(true);
    u.onresume = () => setIsPaused(false);
    u.onend = () => { setIsSpeaking(false); setIsPaused(false); utteranceRef.current = null; };
    u.onerror = () => { setIsSpeaking(false); setIsPaused(false); utteranceRef.current = null; };

    utteranceRef.current = u;
    synth.speak(u);
  };

  const pause = () => { if (synth?.speaking && !synth.paused) synth.pause(); };
  const resume = () => { if (synth?.paused) synth.resume(); };
  const stop = () => { if (synth && (synth.speaking || synth.paused)) synth.cancel(); setIsSpeaking(false); setIsPaused(false); };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    setText(prev => (prev ? prev + "\n\n" + content : content));
    e.target.value = "";
  };

  const words = (text.trim().match(/\S+/g) || []).length;
  const chars = text.length;

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
     
      <div className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Volume2 className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Text to Speech</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Enter text</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here..."
          className="w-full min-h-52 p-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-700"
          maxLength={8000}
        />

        <div className="flex items-center justify-between mt-2">
          <label className="text-xs text-indigo-600 underline inline-flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <input type="file" accept=".txt,.md,.srt" hidden onChange={onFile} />
            Import File
          </label>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-0.5 rounded-full bg-gray-100 border">{words} words</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 border">{chars} chars</span>
          </div>
        </div>

        <button
          onClick={() => setText("")}
          className="flex items-center gap-2 px-3 py-1.5 mt-3 text-xs rounded-md border text-gray-600 hover:bg-gray-50"
        >
          <Trash2 className="w-4 h-4" /> Clear
        </button>
      </div>

      
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Languages className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Voice & Controls</h1>
        </div>

        
        <div className="mt-4">
          <p className="text-sm font-medium">Voice</p>
          <select
            value={voiceURI}
            onChange={(e) => setVoiceURI(e.target.value)}
            className="w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-700 bg-white"
          >
            {voices
              .slice()
              .sort((a, b) => (a.lang || "").localeCompare(b.lang || ""))
              .sort((a, b) => Number(b.default) - Number(a.default))
              .map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} — {v.lang}{v.default ? " (default)" : ""}
                </option>
              ))}
          </select>
        </div>

    
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Rate ({rate.toFixed(2)})</label>
            <input type="range" min="0.5" max="2" step="0.05" value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="text-sm font-medium">Pitch ({pitch.toFixed(2)})</label>
            <input type="range" min="0" max="2" step="0.05" value={pitch} onChange={(e) => setPitch(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="text-sm font-medium">Volume ({volume.toFixed(2)})</label>
            <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(+e.target.value)} className="w-full" />
          </div>
        </div>

       
        <div className="grid grid-cols-3 gap-2 mt-6">
          <button onClick={speak} disabled={!text.trim()} className="bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white rounded-lg px-4 py-2 flex justify-center items-center gap-2">
            <Play className="w-5" /> Speak
          </button>
          {!isPaused ? (
            <button onClick={pause} disabled={!isSpeaking} className="border rounded-lg px-4 py-2 flex justify-center items-center gap-2">
              <Pause className="w-5" /> Pause
            </button>
          ) : (
            <button onClick={resume} className="border rounded-lg px-4 py-2 flex justify-center items-center gap-2">
              <Play className="w-5" /> Resume
            </button>
          )}
          <button onClick={stop} disabled={!isSpeaking && !isPaused} className="border border-red-400 text-red-500 rounded-lg px-4 py-2 flex justify-center items-center gap-2">
            <Square className="w-5" /> Stop
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;*/

import React, { useState } from "react";
import { Languages, RefreshCcw, Upload, Trash2 } from "lucide-react";

const EnglishToBangla = () => {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");

  const translateText = async () => {
    if (!text.trim()) return;

    try {
      // simple free translating (no external API)
      const res = await fetch("https://api.mymemory.translated.net/get?q=" +
        encodeURIComponent(text) + "&langpair=en|bn");

      const data = await res.json();
      setTranslated(data.responseData.translatedText || "Translation error");
    } catch (err) {
      setTranslated("Error translating text.");
    }
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    setText(prev => (prev ? prev + "\n\n" + content : content));
    e.target.value = "";
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">

      {/* Input Box */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Languages className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">English to Bangla Translator</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Enter English Text</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste English text..."
          className="w-full min-h-52 p-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-700"
        />

        {/*<div className="flex items-center justify-between mt-2">
          <label className="text-xs text-indigo-600 underline inline-flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <input type="file" accept=".txt,.md,.srt" hidden onChange={onFile} />
            Import File
          </label>
        </div>*/}

        <button
          onClick={() => setText("")}
          className="flex items-center gap-2 px-3 py-1.5 mt-3 text-xs rounded-md border text-gray-600 hover:bg-gray-50"
        >
          <Trash2 className="w-4 h-4" /> Clear
        </button>
      </div>

      {/* Output Box */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Languages className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Translation</h1>
        </div>

        <textarea
          value={translated}
          readOnly
          placeholder="Bangla translation will appear here..."
          className="w-full min-h-52 p-3 mt-4 outline-none text-sm rounded-md border border-gray-300 text-gray-700 bg-gray-50"
        />

        <button
          onClick={translateText}
          disabled={!text.trim()}
          className="bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white rounded-lg px-4 py-2 mt-4 flex justify-center items-center gap-2"
        >
          <RefreshCcw className="w-5" /> Translate
        </button>
      </div>
    </div>
  );
};

export default EnglishToBangla;
