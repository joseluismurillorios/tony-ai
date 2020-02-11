/* eslint-disable new-cap */
/* eslint-disable prefer-destructuring */

/**
 * Base class for a Speech Synthesizer
 *
 * @class p5.Speech
 * @constructor
 */
export class Speech {
  constructor(_callback, _dv) {
    //
    // speech synthesizers consist of a single synthesis engine
    // per window instance, and a variable number of 'utterance'
    // objects, which can be cached and re-used for, e.g.
    // auditory UI.
    //
    // this implementation assumes a monolithic (one synth,
    // one phrase at a time) system.
    //

    // make a speech synthizer (this will load voices):
    this.synth = window.speechSynthesis;

    // make an utterance to use with this synthesizer:
    this.utterance = new SpeechSynthesisUtterance();

    this.isLoaded = 0; // do we have voices yet?

    // do we queue new utterances upon firing speak()
    // or interrupt what's speaking:
    this.interrupt = false;

    // callback properties to be filled in within the p5 sketch
    // if the author needs custom callbacks:
    // this.onLoad; // fires when voices are loaded and synth is ready
    // this.onStart; // fires when an utterance begins...
    // this.onPause; // ...is paused...
    // this.onResume; // ...resumes...
    // this.onEnd; // ...and ends.

    this.voices = []; // array of available voices (dependent on browser/OS)

    // first parameter of constructor is an initial voice selector
    // this.initvoice;
    if (_dv !== undefined) this.initvoice = _dv;
    if (_callback !== undefined) this.onLoad = _callback;

    // onvoiceschanged() fires automatically when the synthesizer
    // is configured and has its voices loaded.  you don't need
    // to wait for this if you're okay with the default voice.
    //
    // we use this function to load the voice array and bind our
    // custom callback functions.
    window.speechSynthesis.onvoiceschanged = this.onVoicesChanged.bind(this);

    this.listVoices = this.listVoices.bind(this);

    this.setVoice = this.setVoice.bind(this);

    this.setVolume = this.setVolume.bind(this);

    this.setRate = this.setRate.bind(this);

    this.setPitch = this.setPitch.bind(this);

    this.setLang = this.setLang.bind(this);

    this.speak = this.speak.bind(this);

    this.pause = this.pause.bind(this);

    this.resume = this.resume.bind(this);

    this.stop = this.stop.bind(this);

    this.cancel = this.cancel.bind(this);

    this.started = this.started.bind(this);

    this.ended = this.ended.bind(this);

    this.paused = this.paused.bind(this);

    this.resumed = this.resumed.bind(this);
  }

  onVoicesChanged() {
    if (this.isLoaded === 0) { // run only once
      this.voices = window.speechSynthesis.getVoices();
      this.isLoaded = 1; // we're ready
      console.log('p5.Speech: voices loaded!');

      if (this.initvoice !== undefined) {
        this.setVoice(this.initvoice); // set a custom initial voice
        console.log(`p5.Speech: initial voice: ${this.initvoice}`);
      }

      // fire custom onLoad() callback, if it exists:
      if (this.onLoad !== undefined) {
        this.onLoad();
      }

      //
      // bind other custom callbacks:
      //

      this.utterance.onstart = (e) => {
        // console.log("STARTED");
        if (this.onStart !== undefined) this.onStart(e);
      };
      this.utterance.onpause = (e) => {
        // console.log("PAUSED");
        if (this.onPause !== undefined) this.onPause(e);
      };
      this.utterance.onresume = (e) => {
        // console.log("RESUMED");
        if (this.onResume !== undefined) this.onResume(e);
      };
      this.utterance.onend = (e) => {
        // console.log("ENDED");
        if (this.onEnd !== undefined) this.onEnd(e);
      };
    }
  }

  // listVoices() - dump voice names to javascript console:
  listVoices() {
    if (this.isLoaded) {
      for (let i = 0; i < this.voices.length; i += 1) {
        console.log(this.voices[i].name);
      }
    } else {
      console.log('p5.Speech: voices not loaded yet!');
    }
  }

  // setVoice() - assign voice to speech synthesizer, by name
  // (using voices found in the voices[] array), or by index.
  setVoice(_v) {
    // type check so you can set by label or by index:
    if (typeof (_v) === 'string') {
      this.utterance.voice = this.voices.filter(({ name }) => name === _v)[0];
    } else if (typeof (_v) === 'number') {
      this.utterance.voice = this.voices[Math.min(Math.max(_v, 0), this.voices.length - 1)];
    }
  }

  // volume of voice. API range 0.0-1.0.
  setVolume(_v) {
    this.utterance.volume = Math.min(Math.max(_v, 0.0), 1.0);
  }

  // rate of voice.  not all voices support this feature.
  // API range 0.1-2.0.  voice will crash out of bounds.
  setRate(_v) {
    this.utterance.rate = Math.min(Math.max(_v, 0.1), 2.0);
  }

  // pitch of voice.  not all voices support this feature.
  // API range >0.0-2.0.  voice will crash out of bounds.
  setPitch(_v) {
    this.utterance.pitch = Math.min(Math.max(_v, 0.01), 2.0);
  }

  // sets the language of the voice.
  setLang(_lang) {
    this.utterance.lang = _lang;
  }

  // speak a phrase through the current synthesizer:
  speak(_phrase) {
    if (this.interrupt) this.synth.cancel();
    this.utterance.text = _phrase;

    this.synth.speak(this.utterance);
  }

  // not working...
  pause() {
    this.synth.pause();
  }

  // not working...
  resume() {
    this.synth.resume();
  }

  // stop current utterance:
  stop() {
    // not working...
    // this.synth.stop();
    this.synth.cancel();
  }

  // kill synthesizer completely, clearing any queued utterances:
  cancel() {
    this.synth.cancel(); // KILL SYNTH
  }

  // Setting callbacks with functions instead
  started(_cb) {
    this.onStart = _cb;
  }

  ended(_cb) {
    this.onEnd = _cb;
  }

  paused(_cb) {
    this.onPause = _cb;
  }

  resumed(_cb) {
    this.onResume = _cb;
  }
}

/**
 * Base class for a Speech Recognizer
 *
 * @class p5.SpeechRec
 * @constructor
 */
export class SpeechRec extends Speech {
  constructor(_lang, _callback) {
    super();
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
      if (this.onResult !== undefined) {
        this.onResult({
          resultString: this.resultString,
          resultConfidence: this.resultConfidence,
        });
      }
    };

    // fires when the recognition system starts (i.e. when you 'allow'
    // the mic to be used in the browser).
    this.rec.onstart = (e) => {
      if (this.onStart !== undefined) {
        this.onStart(e);
      }
    };
    // fires on a client-side error (server-side errors are expressed
    // by the resultValue in the JSON coming back as 'false').
    this.rec.onerror = (e) => {
      if (this.onError !== undefined) {
        this.onError(e);
      }
    };
    // fires when the recognition finishes, in non-continuous mode.
    this.rec.onend = () => {
      if (this.onEnd !== undefined) {
        this.onEnd();
      }
    };

    this.isPlaying = false;
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  stop() {
    if (this.isPlaying) {
      this.rec.abort();
    }
  }

  // start the speech recognition engine.  this will prompt a
  // security dialog in the browser asking for permission to
  // use the microphone.  this permission will persist throughout
  // this one 'start' cycle.  if you need to recognize speech more
  // than once, use continuous mode rather than firing start()
  // multiple times in a single script.
  start(_continuous, _interim) {
    if ('webkitSpeechRecognition' in window) {
      if (_continuous !== undefined) {
        this.continuous = _continuous;
      }
      if (_interim !== undefined) {
        this.interimResults = _interim;
      }
      this.rec.continuous = this.continuous;
      this.rec.interimResults = this.interimResults;
      this.rec.start();
      this.isPlaying = true;
    }
  }
}