export function musicTimeFormatter(music: HTMLAudioElement) {
  const musicMinutes = Math.floor(music.duration / 60);
  const musicSeconds = Math.floor(music.duration % 60);

  const musicMinutesTotal = String(musicMinutes).padStart(2, "0");
  const musicSecondsTotal = String(musicSeconds).padStart(2, "0");

  const musicCurrentMinutes = Math.floor(music.currentTime / 60)
    .toString()
    .padStart(2, "0");
  const musicCurrentSeconds = Math.floor(music.currentTime % 60)
    .toString()
    .padStart(2, "0");

  const musicCurrentTime = `${musicCurrentMinutes}:${musicCurrentSeconds}`;
  const musicDurationTime = `${musicMinutesTotal}:${musicSecondsTotal}`;

  return { musicCurrentTime, musicDurationTime };
}
