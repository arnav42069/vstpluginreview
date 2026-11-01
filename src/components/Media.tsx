import { useRef, useState } from "react";
export function AudioPlayer({
  src,
  label,
  credit,
}: {
  src?: string;
  label: string;
  credit?: string;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  if (!src) return null;
  return (
    <figure className="media">
      <figcaption>
        {label}
        {credit && <small>{credit}</small>}
      </figcaption>
      <audio
        ref={audio}
        controls
        preload="metadata"
        src={src}
        onTimeUpdate={() => setTime(audio.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audio.current?.duration ?? 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setError(true)}
      />
      <div className="audio-controls">
        <button
          disabled={error}
          onClick={() => {
            if (playing) audio.current?.pause();
            else void audio.current?.play().catch(() => setError(true));
          }}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <label>
          Position{" "}
          <input
            aria-label={`${label} position`}
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={time}
            onChange={(e) => {
              if (audio.current)
                audio.current.currentTime = Number(e.target.value);
            }}
          />
        </label>
        <output>
          {Math.floor(time)} / {Math.floor(duration)} seconds
        </output>
        <label>
          Volume{" "}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            defaultValue="1"
            onChange={(e) => {
              if (audio.current) audio.current.volume = Number(e.target.value);
            }}
          />
        </label>
      </div>
      {error && <p role="status">Audio could not be loaded.</p>}
    </figure>
  );
}
export function AudioABComparison({
  a,
  b,
  levelMatched,
}: {
  a?: string;
  b?: string;
  levelMatched: boolean;
}) {
  if (!a || !b || !levelMatched) return null;
  return (
    <section aria-label="Level-matched audio comparison">
      <AudioPlayer src={a} label="A — original recording" />
      <AudioPlayer src={b} label="B — processed recording" />
      <p>Compare at the same listening level.</p>
    </section>
  );
}
export function YouTubeEmbed({
  id,
  title,
  transcript,
}: {
  id?: string;
  title: string;
  transcript?: string;
}) {
  const [open, setOpen] = useState(false);
  if (!id || !/^[-\w]{11}$/.test(id)) return null;
  return (
    <figure>
      {open ? (
        <iframe
          title={title}
          loading="lazy"
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          allowFullScreen
        />
      ) : (
        <button onClick={() => setOpen(true)}>
          Load video: {title} (connects to YouTube)
        </button>
      )}
      <figcaption>
        <a href={`https://www.youtube.com/watch?v=${id}`}>
          Watch {title} on YouTube
        </a>
        {transcript && <p>{transcript}</p>}
      </figcaption>
    </figure>
  );
}
