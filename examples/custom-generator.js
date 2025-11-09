// Example: Creating a custom schema generator

import { createGenerator, createBlock } from '@uniweb/jsonld-gen';
import { SCHEMA_TYPES } from '@uniweb/jsonld-gen';
import { sanitizeString, sanitizeUrl, buildUrl } from '@uniweb/jsonld-gen';

// Create a custom Course schema generator
export const createCourseSchema = createGenerator({
  type: 'Course',
  id: 'course',
  priority: 1,
  generate: (course, config, hooks) => {
    if (!course.id || !course.name) {
      console.warn('[Course] Missing required fields');
      return null;
    }
    
    const courseUrl = buildUrl(config.baseUrl, '/courses', { id: course.id });
    
    return {
      "@context": "https://schema.org",
      "@type": "Course",
      "@id": courseUrl,
      "name": sanitizeString(course.name),
      "description": sanitizeString(course.description),
      "url": courseUrl,
      "provider": {
        "@type": "Organization",
        "name": sanitizeString(config.organizationName),
        "url": config.baseUrl,
      },
      ...(course.instructor && {
        "instructor": {
          "@type": "Person",
          "name": sanitizeString(course.instructor.name),
        },
      }),
      ...(course.startDate && { "startDate": course.startDate }),
      ...(course.endDate && { "endDate": course.endDate }),
    };
  },
});

// Usage
const config = {
  baseUrl: 'https://example.com',
  organizationName: 'Example University',
};

const course = {
  id: 'cs101',
  name: 'Introduction to Computer Science',
  description: 'Learn the fundamentals of programming...',
  instructor: { name: 'Dr. Jane Smith' },
  startDate: '2024-09-01',
  endDate: '2024-12-15',
};

const courseSchema = createCourseSchema(course, config);
console.log('Custom Course Schema:', courseSchema);
