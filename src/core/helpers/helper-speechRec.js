/**
 * Base class for a Speech Recognizer
 *
 * @class p5.SpeechRec
 * @constructor
 */
class SpeechRec {
  constructor(_lang, _callback) {
    //
    // speech recognition consists of a recognizer object per
    // window instance that returns a JSON object containing
    // recognition.  this JSON object grows when the synthesizer
    // is in 'continuous' mode, with new recognized phrases
    // appended into an internal array.
    //
    // this implementation returns the full JSON, but also a set
    // of simple, query-ready properties containing the most
    // recently recognized speech.
    //

    // make a recognizer object.
    if ('webkitSpeechRecognition' in window) {
      this.rec = new window.webkitSpeechRecognition();
    } else {
      this.rec = {};
      console.log('p5.SpeechRec: webkitSpeechRecognition not supported in this browser.');
    }

    // first parameter is language model (defaults to empty=U.S. English)
    // no list of valid models in API, but it must use BCP-47.
    // here's some hints:
    // http://stackoverflow.com/questions/14257598/what-are-language-codes-for-voice-recognition-languages-in-chromes-implementati
    if (_lang !== undefined) this.rec.lang = _lang;

    // callback properties to be filled in within the p5 sketch
    // if the author needs custom callbacks:
    // this.onResult; // fires when something has been recognized
    // this.onStart; // fires when the recognition system is started...
    // this.onError; // ...has a problem (e.g. the mic is shut off)...
    // this.onEnd; // ...and ends (in non-continuous mode).
    if (_callback !== undefined) this.onResult = _callback;

    // recognizer properties:

    // continous mode means the object keeps recognizing speech,
    // appending new tokens to the internal JSON.
    this.continuous = false;
    // interimResults means the object will report (i.e. fire its
    // onresult() callback) more frequently, rather than at pauses
    // in microphone input.  this gets you quicker, but less accurate,
    // results.
    this.interimResults = false;

    // result data:

    // resultJSON:
    // this is a full JSON returned by onresult().  it consists of a
    // SpeechRecognitionEvent object, which contains a (wait for it)
    // SpeechRecognitionResultList.  this is an array.  in continuous
    // mode, it will be appended to, not cleared.  each element is a
    // SpeechRecognition result, which contains a (groan)
    // SpeechRecognitionAlternative, containing a 'transcript' property.
    // the 'transcript' is the recognized phrase.  have fun.
    // this.resultJSON;
    // resultValue:
    // validation flag which indicates whether the recognizer succeeded.
    // this is *not* a metric of speech clarity, but rather whether the
    // speech recognition system successfully connected to and received
    // a response from the server.  you can construct an if() around this
    // if you're feeling worried.
    // this.resultValue;
    // resultValue:
    // the 'transcript' of the most recently recognized speech as a simple
    // string.  this will be blown out and replaced at every firing of the
    // onresult() callback.
    // this.resultString;
    // resultConfidence:
    // the 'confidence' (0-1) of the most recently recognized speech, e.g.
    // that it reflects what was actually spoken.  you can use this to filter
    // out potentially bogus recognition tokens.
    // this.resultConfidence;

    // onresult() fires automatically when the recognition engine
    // detects speech, or times out trying.
    //
    // it fills up a JSON array internal to the webkitSpeechRecognition
    // object.  we reference it over in our struct here, and also copy
    // out the most recently detected phrase and confidence value.
    this.rec.onresult = (e) => {
      this.resultJSON = e; // full JSON of callback event
      this.resultValue = e.returnValue; // was successful?
      // store latest result in top-level object struct
      this.resultString = e.results[e.results.length - 1][0].transcript.trim();
      this.resultConfidence = e.results[e.results.length - 1][0].confidence;
      if (this.onResult !== undefined) this.onResult();
    };

    // fires when the recognition system starts (i.e. when you 'allow'
    // the mic to be used in the browser).
    this.rec.onstart = (e) => {
      if (this.onStart !== undefined) this.onStart(e);
    };
    // fires on a client-side error (server-side errors are expressed
    // by the resultValue in the JSON coming back as 'false').
    this.rec.onerror = (e) => {
      if (this.onError !== undefined) this.onError(e);
    };
    // fires when the recognition finishes, in non-continuous mode.
    this.rec.onend = () => {
      if (this.onEnd !== undefined) this.onEnd();
    };
  }

  // start the speech recognition engine.  this will prompt a
  // security dialog in the browser asking for permission to
  // use the microphone.  this permission will persist throughout
  // this one 'start' cycle.  if you need to recognize speech more
  // than once, use continuous mode rather than firing start()
  // multiple times in a single script.
  start(_continuous, _interim) {
    if ('webkitSpeechRecognition' in window) {
      if (_continuous !== undefined) this.continuous = _continuous;
      if (_interim !== undefined) this.interimResults = _interim;
      this.rec.continuous = this.continuous;
      this.rec.interimResults = this.interimResults;
      this.rec.start();
    }
  }
}

export default SpeechRec;
