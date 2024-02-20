import { expect, test, describe, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import SongItem from '../SongItem.vue';
import type { Song } from '../types';

describe('SongItem.vue', () => {
  test('renders song.display_name', () => {
    const song: Song = {
      comment_count: 0,
      uid: '123',
      display_name: 'Test',
      genre: '',
      hash: '',
      modified_name: '',
      original_name: '',
      url: '',
      id: '',
    };
    const wrapper = mount(SongItem, {
      props: {
        song,
      },
      global: {
        components: {
          'router-link': RouterLinkStub,
        },
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });

    expect(wrapper.text()).toContain(song.display_name);
  });
});
