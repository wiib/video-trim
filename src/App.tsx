import { Component, createSignal, onMount, Show } from 'solid-js';
import NavBar from './components/NavBar';

import styles from './App.module.scss';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

const App: Component = () => {
  const [ready, setReady] = createSignal<boolean>(false);
  const [video, setVideo] = createSignal<null | File>(null);
  const [videoOut, setVideoOut] = createSignal<null | string>(null);

  const [startTime, setStartTime] = createSignal<number>(0);
  const [endTime, setEndTIme] = createSignal<number>(0);

  let videoRef: undefined | HTMLVideoElement;

  /**
   * Trim the video via FFmpeg and then store it in the app state
   * @param {number} start - The starting point, in seconds.
   * @param {number} end - The ending point, in seconds.
   */
  const trimVideo = async (start: number, end: number) => {
    // Hide the previous output
    setVideoOut(null);

    // Write the input file to the WASM virtual file system
    ffmpeg.FS('writeFile', 'in.mp4', await fetchFile(video()));

    // Run the FFmpeg command to trim the video and encode
    // prettier-ignore
    await ffmpeg.run(
      '-ss', `${start}`,
      '-i', 'in.mp4',
      '-t', `${end - start}`,
      '-c:a', 'aac',
      '-c:v', 'libx264',
      'out.mp4'
    );

    // Read the output file from the WASM virtual file system
    const data = ffmpeg.FS('readFile', 'out.mp4');

    // Create an ObjectURL with the video's buffer Blob
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

    // Save the video output state
    setVideoOut(url);
  };

  // Load the FFmpeg binaries
  const load = async () => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
      setReady(true);
    }
  };

  // Execute the above function only once at mount time
  onMount(async () => {
    load();
  });

  return (
    <div class={styles.App}>
      <NavBar />
      <main class={styles.AppContent}>
        <p>This SolidJS + FFmpeg.wasm applcation lets you trim videos in-browser.</p>
        <p>
          The output is the trimmed video, re-encoded to h264/aac as to avoid video/audio desync.
          Therefore, it's very slow for lenghts over 10 seconds.
        </p>
        <Show when={ready()} fallback={<h2>Loading FFmpeg...</h2>}>
          <div class={styles.container}>
            <section class={styles.containerChild} style="margin-right: 2ch;">
              <h2>Input</h2>
              <Show when={video()}>
                <video controls ref={videoRef} src={URL.createObjectURL(video() as Blob)} />
              </Show>
              <input
                type="file"
                accept="video/mp4,video/*"
                onChange={(e) => {
                  setVideo(e.currentTarget.files?.item(0) ?? null);
                  setVideoOut(null);
                }}
              />
              <p>Start time: {startTime()}</p>
              <p>End time: {endTime()}</p>
              <button type="button" onClick={() => setStartTime(videoRef?.currentTime ?? 0)}>
                Set start
              </button>
              <button type="button" onClick={() => setEndTIme(videoRef?.currentTime ?? 0)}>
                Set end
              </button>
              <button type="button" onClick={() => trimVideo(startTime(), endTime())}>
                Trim
              </button>
            </section>
            <section class={styles.containerChild} style="margin-left: 2ch;">
              <h2>Output</h2>
              <Show when={videoOut()} fallback={<p>Your video will appear here.</p>}>
                <video controls src={videoOut() ?? undefined} />
              </Show>
            </section>
          </div>
        </Show>
      </main>
    </div>
  );
};

export default App;
