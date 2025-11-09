import { createGenerator } from '../core/generator-base.js';
import { SCHEMA_TYPES, BLOCK_IDS, DEFAULT_CONFIG } from '../core/config.js';
import {
  sanitizeString,
  sanitizeUrl,
  sanitizeEmail,
  sanitizeArray,
  parseNameParts,
  extractHonorific,
  buildUrl,
} from '../utils/index.js';

/**
 * Create a Person schema
 * @param {Object} person - Person data
 * @param {string} person.id - Unique identifier
 * @param {string} person.name - Full name
 * @param {string} [person.firstName] - First name
 * @param {string} [person.lastName] - Last name
 * @param {string} [person.title] - Job title
 * @param {string} [person.bio] - Biography
 * @param {string} [person.email] - Email address
 * @param {string} [person.photoUrl] - Photo URL
 * @param {string[]} [person.researchInterests] - Research interests/expertise
 * @param {Object[]} [person.education] - Education history
 * @param {string[]} [person.awards] - Awards and honors
 * @param {Object} config - Configuration
 * @param {string} config.baseUrl - Base URL
 * @param {string} config.organizationName - Organization name
 * @param {Object} [hooks] - Lifecycle hooks
 * @returns {Object|null} JSON-LD block
 */
export const createPersonSchema = createGenerator({
  type: SCHEMA_TYPES.PERSON,
  id: BLOCK_IDS.PERSON,
  priority: 1,
  generate: (person, config, hooks) => {
    const { baseUrl, organizationName, mediaContactEmail } = config;
    
    if (!person.id || !person.name) {
      console.warn('[Person] Missing required fields: id, name');
      return null;
    }
    
    const personUrl = buildUrl(baseUrl, '/experts', { id: person.id });
    
    // Parse name parts
    const { firstName, lastName } = parseNameParts(
      person.name,
      person.firstName,
      person.lastName
    );
    
    const honorific = extractHonorific(person.name);
    
    // Build schema
    const schema = {
      "@context": "https://schema.org",
      "@type": SCHEMA_TYPES.PERSON,
      "@id": personUrl,
      "url": personUrl,
      "name": sanitizeString(person.name),
    };
    
    // Optional fields
    if (firstName) schema.givenName = sanitizeString(firstName);
    if (lastName) schema.familyName = sanitizeString(lastName);
    if (honorific) schema.honorificPrefix = honorific;
    
    const photoUrl = sanitizeUrl(person.photoUrl || person.image);
    if (photoUrl) schema.image = photoUrl;
    
    if (person.title) {
      schema.jobTitle = sanitizeString(person.title);
    }
    
    if (organizationName) {
      schema.worksFor = {
        "@type": SCHEMA_TYPES.ORGANIZATION,
        "@id": baseUrl,
        "name": sanitizeString(organizationName),
      };
    }
    
    // Research interests
    const expertise = sanitizeArray(
      person.researchInterests || person.expertise || person.knowsAbout,
      DEFAULT_CONFIG.maxExpertiseItems,
      (item) => typeof item === 'string' && item.trim()
    ).map(sanitizeString);
    
    if (expertise.length > 0) {
      schema.knowsAbout = expertise;
    }
    
    if (person.bio || person.description) {
      schema.description = sanitizeString(person.bio || person.description);
    }
    
    // Contact info
    const email = sanitizeEmail(person.email);
    if (email || mediaContactEmail) {
      schema.contactPoint = {
        "@type": SCHEMA_TYPES.CONTACT_POINT,
        "contactType": "Media Relations",
      };
      
      if (mediaContactEmail) {
        schema.contactPoint.email = mediaContactEmail;
      } else if (email) {
        schema.contactPoint.email = email;
      }
      
      const languages = sanitizeArray(
        person.languages || config.defaultLanguages,
        10,
        (lang) => typeof lang === 'string'
      ).map(sanitizeString);
      
      if (languages.length > 0) {
        schema.contactPoint.availableLanguage = languages;
      }
    }
    
    // Education
    const education = sanitizeArray(
      person.education,
      DEFAULT_CONFIG.maxEducation,
      (edu) => edu && (edu.institution || edu.name)
    );
    
    if (education.length > 0) {
      schema.alumniOf = education.map(edu => ({
        "@type": SCHEMA_TYPES.ORGANIZATION,
        "name": sanitizeString(edu.institution || edu.name),
      }));
    }
    
    // Awards
    const awards = sanitizeArray(
      person.awards || person.honors,
      DEFAULT_CONFIG.maxAwards,
      (award) => typeof award === 'string' && award.trim()
    ).map(sanitizeString);
    
    if (awards.length > 0) {
      schema.award = awards;
    }
    
    // Department affiliation
    if (person.department) {
      schema.affiliation = {
        "@type": SCHEMA_TYPES.ORGANIZATION,
        "name": sanitizeString(person.department),
        "parentOrganization": {
          "@type": SCHEMA_TYPES.ORGANIZATION,
          "@id": baseUrl,
          "name": sanitizeString(organizationName),
        },
      };
    }
    
    return schema;
  },
});
