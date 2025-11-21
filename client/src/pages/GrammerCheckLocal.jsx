// client/src/pages/GrammarCheckLocal.jsx
/*import React, { useMemo, useState } from "react";
import { Loader2, SpellCheck, Sparkles, Copy, Undo2, CheckCircle2 } from "lucide-react";

import { unified } from "unified";
import retextEnglish from "retext-english";
import retextReadability from "retext-readability";
import retextPassive from "retext-passive";
import retextRepeated from "retext-repeated-words";
import retextStringify from "retext-stringify";


function detectTone(text) {
  const t = text || "";
  const exclam = (t.match(/!/g) || []).length;
  const question = (t.match(/\?/g) || []).length;
  const words = t.toLowerCase().match(/\b\w+\b/g) || [];
  const longWords = words.filter((w) => w.length >= 10).length;
  const caps = (t.match(/\b[A-Z]{3,}\b/g) || []).length;
  const adverbs = (t.match(/\b\w+ly\b/gi) || []).length;

  const posWords = ["great","awesome","excellent","amazing","love","happy","delight","fantastic","wonderful","perfect"];
  const negWords = ["bad","terrible","awful","hate","angry","sad","annoy","issue","problem","broken"];
  const pos = words.filter((w) => posWords.includes(w)).length;
  const neg = words.filter((w) => negWords.includes(w)).length;

  let tone = "Neutral";
  if (exclam >= 2 || pos - neg >= 3) tone = "Enthusiastic";
  if (neg - pos >= 2) tone = "Negative/Concerned";
  if (longWords >= 4 || adverbs >= 6) tone = "Formal/Verbose";
  if (caps >= 2) tone = "Aggressive/Assertive";
  if (question >= 3) tone = "Inquisitive";

  const score = Math.max(0, Math.min(100, 50 + (pos - neg) * 10 + exclam * 3 - caps * 2));
  return { tone, toneScore: Math.round(score) };
}


const CONTRACTIONS = [
  ["do not", "don't"], ["cannot", "can't"], ["will not", "won't"], ["is not", "isn't"],
  ["are not", "aren't"], ["it is", "it's"], ["I am", "I'm"], ["we are", "we're"], ["they are", "they're"]
];
const EXPANSIONS = CONTRACTIONS.map(([a, b]) => [b, a]);

function toFormal(x) {
  let s = x.replace(/!{2,}/g, "!").replace(/[?]{2,}/g, "?");
  for (const [c, exp] of EXPANSIONS) s = s.replace(new RegExp(`\\b${c}\\b`, "gi"), exp);
  s = s.replace(/\b(really|very|totally|literally|just|like)\b/gi, "").replace(/\s{2,}/g, " ");
  return s;
}
function toCasual(x) {
  let s = x.replace(/\s{2,}/g, " ");
  for (const [exp, c] of CONTRACTIONS) s = s.replace(new RegExp(`\\b${exp}\\b`, "gi"), c);
  s = s.replace(/\b(therefore|however|moreover|furthermore)\b/gi, (m) =>
    ({ therefore: "so", however: "but", moreover: "also", furthermore: "also" }[m.toLowerCase()])
  );
  return s;
}
function polishToTone(text, tone) {
  if (tone === "Formal") return toFormal(text);
  if (tone === "Casual" || tone === "Friendly") return toCasual(text);
  if (tone === "Professional") return toFormal(text);
  if (tone === "Persuasive" || tone === "Confident") return toFormal(text);
  return text;
}

const TONES = ["Neutral", "Formal", "Casual", "Friendly", "Professional", "Persuasive", "Confident"];

export default function GrammarCheckLocal() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState([]);
  const [readability, setReadability] = useState(null);
  const [result, setResult] = useState(null);
  const [targetTone, setTargetTone] = useState("Neutral");
  const [error, setError] = useState("");

  const words = useMemo(() => (text.trim().match(/\S+/g) || []).length, [text]);

  async function analyze() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setIssues([]);
    setReadability(null);
    setResult(null);

    try {
      const processor = unified()
        .use(retextEnglish)
        .use(retextReadability, { age: 6 }) // readability hints
        .use(retextPassive)                 // passive voice
        .use(retextRepeated)                // repeated words
        .use(retextStringify);              // stringify compiler

      const file = await processor.process(text);

      const normalized = file.messages.map((m) => ({
        source: m.source || m.ruleId || "check",
        reason: String(m.message || m.reason),
        line: m.location?.start?.line,
        column: m.location?.start?.column,
      }));
      setIssues(normalized);

      const sentences = (text.match(/[.!?]+/g) || []).length || 1;
      const chars = text.length;
      setReadability({
        sentences,
        characters: chars,
        warnings: normalized.filter((n) => n.source === "retext-readability").length,
      });

      const { tone, toneScore } = detectTone(text);
      const corrected = text.replace(/\s{2,}/g, " ").replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
      const rewrite = polishToTone(corrected, targetTone);

      setResult({ corrected, issues: normalized, tone, toneScore, rewrite });
    } catch (e) {
      setError(e.message || "Processing failed");
    } finally {
      setLoading(false);
    }
  }

  const copy = (val) => navigator.clipboard.writeText(val || "");
  const reset = () => {
    setText("");
    setIssues([]);
    setResult(null);
    setError("");
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <SpellCheck className="w-5 h-5 text-indigo-600" />
          <h1 className="text-2xl font-semibold">Grammar & Tone Checker (Offline)</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-4">
            <textarea
              className="w-full min-h-[220px] outline-none border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
              placeholder="Paste or type your text…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{words} words • {text.length} chars</span>
              <button onClick={reset} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border hover:bg-gray-50">
                <Undo2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>

         
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Target Tone</label>
              <select
                className="mt-1 w-full border border-gray-200 rounded-xl p-2.5 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
                value={targetTone}
                onChange={(e) => setTargetTone(e.target.value)}
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <button
              onClick={analyze}
              disabled={loading || !text.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3c81F6] to-[#9234EA] text-white px-4 py-2.5 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Analyzing…" : "Analyze"}
            </button>

            {error ? <p className="text-red-600 text-sm">{error}</p> : null}
          </div>
        </div>

        
        {result && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">Corrected (light normalization)</h2>
                  <button onClick={() => copy(result.corrected)} className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg border hover:bg-gray-50">
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-gray-800">{result.corrected}</p>
              </section>

              <section className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">Polished to {targetTone}</h2>
                  <button onClick={() => copy(result.rewrite)} className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg border hover:bg-gray-50">
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-gray-800">{result.rewrite}</p>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <h3 className="font-semibold mb-1">Tone</h3>
                <p className="text-sm text-gray-700">
                  Detected: <span className="font-medium">{result.tone}</span>
                </p>
                <div className="mt-2">
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${result.toneScore}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{result.toneScore} / 100</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <h3 className="font-semibold mb-2">Issues</h3>
                {issues.length ? (
                  <ul className="space-y-2 text-sm">
                    {issues.map((m, i) => (
                      <li key={i} className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-[2px]" />
                        <div>
                          <div className="text-gray-800">
                            <span className="font-medium">{m.source}</span>
                            {m.line ? <span className="text-gray-500"> (line {m.line})</span> : null}
                            : {m.reason}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No warnings found.</p>
                )}
              </div>

              {readability && (
                <div className="bg-white border border-gray-200 rounded-2xl p-4 text-sm">
                  <h3 className="font-semibold mb-2">Readability</h3>
                  <p>Sentences: {readability.sentences}</p>
                  <p>Characters: {readability.characters}</p>
                  <p>Readability warnings: {readability.warnings}</p>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}*/

import React, { useState, useMemo } from "react";
import { FileText, Sparkles, Loader2, Copy, Undo2 } from "lucide-react";

export default function TextSummarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const words = useMemo(() => (text.trim().match(/\S+/g) || []).length, [text]);

  // --- Basic Offline Summary Algorithm ---
  function generateSummary(input) {
    if (!input.trim()) return "";

    // Split into sentences
    const sentences = input
      .replace(/\n/g, " ")
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.length > 10);

    if (sentences.length <= 2) return input;

    // Count word frequencies
    let freq = {};
    const words = input.toLowerCase().match(/\b[a-zA-Z]+\b/g) || [];

    words.forEach((w) => {
      if (!freq[w]) freq[w] = 0;
      freq[w]++;
    });

    // Score sentences based on important words
    const scored = sentences.map((s) => {
      const sWords = s.toLowerCase().match(/\b[a-zA-Z]+\b/g) || [];
      const score = sWords.reduce((sum, w) => sum + (freq[w] || 0), 0);
      return { sentence: s, score };
    });

    // Sort by importance
    scored.sort((a, b) => b.score - a.score);

    // Pick top sentences (approx 25–35% of text)
    const take = Math.max(1, Math.floor(sentences.length * 0.3));
    const topSentences = scored.slice(0, take).map((s) => s.sentence);

    return topSentences.join(" ");
  }

  async function handleSummarize() {
    setLoading(true);
    setSummary("");

    setTimeout(() => {
      const result = generateSummary(text);
      setSummary(result);
      setLoading(false);
    }, 300); // small delay for UX
  }

  const reset = () => {
    setText("");
    setSummary("");
  };

  const copy = () => navigator.clipboard.writeText(summary);

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Heading */}
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h1 className="text-2xl font-semibold">Text Summarizer </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Input Box */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-4">
            <textarea
              className="w-full min-h-[220px] outline-none border border-gray-200 rounded-xl p-3
               focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
              placeholder="Paste a paragraph to summarize..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{words} words • {text.length} chars</span>

              <button
                onClick={reset}
                className="inline-flex items-center gap-1 px-2.5 py-1.5
                  rounded-lg border hover:bg-gray-50"
              >
                <Undo2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">

            <button
              onClick={handleSummarize}
              disabled={loading || !text.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl 
              bg-gradient-to-r from-[#3c81F6] to-[#9234EA] text-white px-4 py-2.5 
              disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? "Summarizing…" : "Summarize"}
            </button>
          </div>
        </div>

        {/* Summary Result */}
        {summary && (
          <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Summary</h2>

              <button
                onClick={copy}
                className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg border hover:bg-gray-50"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>

            <p className="whitespace-pre-wrap text-gray-800">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}