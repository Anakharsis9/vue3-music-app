import type { Song } from '@/components/types';
import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import { Howl } from 'howler';
import { formatTime } from '@/utils/time';

export default defineStore('player', () => {
  const current_song: Ref<Song | null> = ref(null);
  const sound: Ref<Howl | null> = ref(null);
  const seek = ref('00:00');
  const duration = ref('00:00');
  const progress = ref('0%');

  async function newSong(song: Song) {
    if (sound.value instanceof Howl) {
      sound.value.unload();
    }

    current_song.value = song;
    sound.value = new Howl({
      src: [song.url],
      html5: true,
    });
    if (!sound.value) {
      return;
    }
    sound.value.play();

    sound.value.on('play', () => {
      requestAnimationFrame(updateProgress);
    });
  }
  async function toggleAudio() {
    if (!sound.value) {
      return;
    }
    if (sound.value.playing()) {
      sound.value.pause();
    } else {
      sound.value.play();
    }
  }

  function updateProgress() {
    seek.value = formatTime(sound.value!.seek());
    duration.value = formatTime(sound.value!.duration());

    progress.value = `${(sound.value!.seek() / sound.value!.duration()) * 100}%`;

    if (sound.value!.playing()) {
      requestAnimationFrame(updateProgress);
    }
  }

  const isPlaying = computed(() => {
    if (sound.value?.playing) {
      return sound.value?.playing();
    }
    return false;
  });

  return {
    current_song,
    newSong,
    toggleAudio,
    isPlaying,
    sound,
    seek,
    duration,
    progress,
  };
});
