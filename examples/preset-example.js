// Example using presets for common patterns

import { universityPreset } from '@uniweb/jsonld-gen/presets/university';
import { videoLibraryPreset } from '@uniweb/jsonld-gen/presets/video-library';

// Configuration
const config = {
  baseUrl: 'https://uottawa.ca',
  organizationName: 'University of Ottawa',
  organizationLogo: 'https://uottawa.ca/logo.png',
  mediaContactEmail: 'media@uottawa.ca',
};

// Example 1: Expert profile
const expertData = {
  id: '456',
  name: 'Dr. John Doe',
  title: 'Professor of Environmental Science',
  bio: 'Expert in climate change and sustainability...',
  researchInterests: ['Climate Change', 'Sustainability', 'Renewable Energy'],
};

const expertMetadata = universityPreset.generateExpertProfile(
  expertData,
  config,
  'climate change' // Optional search term
);

console.log('Expert Profile Metadata:', expertMetadata);

// Example 2: Video page
const videoData = {
  id: '789',
  title: 'Introduction to Climate Science',
  description: 'A comprehensive overview of climate science...',
  thumbnailUrl: 'https://uottawa.ca/videos/thumbnails/789.jpg',
  videoUrl: 'https://uottawa.ca/videos/789.mp4',
  durationSeconds: 1800,
  uploadDate: '2024-01-15T10:00:00Z',
  viewCount: 5432,
};

const videoMetadata = videoLibraryPreset.generateVideoPage(videoData, config);

console.log('Video Page Metadata:', videoMetadata);

// Example 3: Search interface
const searchMetadata = universityPreset.generateExpertSearch(config);

console.log('Search Interface Metadata:', searchMetadata);
