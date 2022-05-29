import { Component, createSignal, onMount } from 'solid-js';
import NavBar from './components/NavBar';

import styles from './App.module.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

const App: Component = () => {
  const [ready, setReady] = createSignal(false);
  const [video, setVideo] = createSignal<undefined | null | File>(undefined);
  const [videoOut, setVideoOut] = createSignal<undefined | string>(undefined);

  const [startTime, setStartTime] = createSignal<undefined | number>(0);
  const [endTime, setEndTIme] = createSignal<undefined | number>(0);

  let videoRef: undefined | HTMLVideoElement;

  const trimVideo = async (startTime: number | undefined, endTime: number | undefined) => {
    ffmpeg.FS('writeFile', 'in.mp4', await fetchFile(video()));

    await ffmpeg.run(
      '-ss', `${startTime}`,
      '-i', 'in.mp4',
      '-t', `${endTime! - startTime!}`,
      '-c:a', 'aac',
      '-c:v', 'libx264',
      'out.mp4'
    );

    const data = ffmpeg.FS('readFile', 'out.mp4');

    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    setVideoOut(url);
  };

  const load = async () => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
      setReady(true);
    }
  };

  onMount(async () => {
    load();
  });

  return (
    <div class={styles.App}>
      <NavBar />
      <main class={styles.AppContent}>
        <p>Trim your videos right in the browser, with the magic of WebAssembly!</p>
        {ready() ? <></> : <h2>Loading FFmpeg...</h2>}
        <h2>Input</h2>
        <input type="file" onChange={(e) => setVideo(e.currentTarget.files?.item(0))} />
        {video() && (
          <video controls width="512" ref={videoRef} src={URL.createObjectURL(video() as Blob)} />
        )}
        <p>Start time: {startTime()}</p>
        <p>End time: {endTime()}</p>
        <button onClick={() => setStartTime(videoRef?.currentTime)}>Set start</button>
        <button onClick={() => setEndTIme(videoRef?.currentTime)}>Set end</button>
        <button onClick={() => trimVideo(startTime(), endTime())}>Trim</button>
        <h2>Output</h2>
        {videoOut() ? (
          <video controls width="512" src={videoOut()} />
        ): <p>Your video will appear here</p>}
      </main>
    </div>
  );
};

export default App;
