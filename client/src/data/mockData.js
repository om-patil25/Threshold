export const MOCK_USER = {
  id: 'u1',
  username: 'johndoe',
  name: 'John Doe',
  bio: 'I build things for the web.',
  worktitle: 'Frontend Engineer & UI Designer',
  profileimage: null,
  resume_url: null,
  open_to_work: true,
  theme: 'ink-and-ochre'
};

export const MOCK_LINKS = [
  { id: 'l1', label: 'My Website', url: 'https://example.com', click_count: 12, position: 1 },
  { id: 'l2', label: 'GitHub', url: 'https://github.com', click_count: 5, position: 2 },
  { id: 'l3', label: 'Twitter', url: 'https://twitter.com', click_count: 2, position: 3 },
];

export const MOCK_SHOWCASE = [
  { id: 's1', file_name: 'project1.png', url: 'https://example.com/p1.png', mimetype: 'image/png', filetype: 'project', size: 1024, file_title: 'Threshold UI Design', description: 'A complete UI overhaul for the Threshold platform including desktop and mobile responsive layouts.', link_url: 'https://example.com', created_at: '2023-10-01T00:00:00Z' },
  { id: 's2', file_name: 'cert.pdf', url: 'https://example.com/cert.pdf', mimetype: 'application/pdf', filetype: 'certification', size: 512, file_title: 'AWS Certified Developer', description: 'Passed the associate exam in 2023.', link_url: null, created_at: '2023-09-15T00:00:00Z' },
  { id: 's3', file_name: 'video.mp4', url: 'https://example.com/vid.mp4', mimetype: 'video/mp4', filetype: 'project', size: 2048, file_title: 'Motion Graphics Reel', description: 'Compilation of my 2023 3D and 2D animation work.', link_url: null, created_at: '2023-11-20T00:00:00Z' },
];

export const MOCK_UPDATES = [
  { id: 'u1', content: 'Just launched a new feature on my main project!', img_url: null, created_at: '2023-11-01T12:00:00Z', updated_at: '2023-11-01T12:00:00Z' },
  { id: 'u2', content: 'Here is a sneak peek of the mobile dashboard UI I have been working on.', img_url: 'https://example.com/img1.png', created_at: '2023-10-25T12:00:00Z', updated_at: '2023-10-25T12:00:00Z' },
  { id: 'u3', content: 'Looking for freelance opportunities starting next month. DM me if interested!', img_url: null, created_at: '2023-10-20T12:00:00Z', updated_at: '2023-10-20T12:00:00Z' },
  { id: 'u4', content: 'I wrote a blog post about using React Server Components.', img_url: null, created_at: '2023-10-15T12:00:00Z', updated_at: '2023-10-15T12:00:00Z' },
];
