// React example with iframe integration

import React from 'react';
import { useMetadata } from '@uniweb/jsonld-gen/react';
import {
  createPersonSchema,
  createBreadcrumbSchema,
  createOrganizationSchema,
} from '@uniweb/jsonld-gen';
import { sendToParent } from '@uniweb/frame-bridge';

function ExpertProfile({ expertId }) {
  // Fetch expert data (example)
  const { data: expert, isLoading } = useExpertData(expertId);
  
  // Configuration
  const config = {
    baseUrl: 'https://example.com',
    organizationName: 'Example University',
    organizationLogo: 'https://example.com/logo.png',
    mediaContactEmail: 'media@example.com',
  };
  
  // Generate and send metadata to parent frame
  const metadata = useMetadata({
    type: 'person',
    data: expert,
    isLoading,
    config,
    schemas: expert ? [
      createPersonSchema(expert, config),
      createBreadcrumbSchema(['Home', 'Faculty', expert.name], config),
      createOrganizationSchema({}, config),
    ] : [],
    onGenerate: (schemas, metaTags) => {
      // Send to parent frame
      sendToParent({
        type: 'SET_METADATA',
        payload: { schemas, metaTags },
      });
    },
  });
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>{expert.name}</h1>
      <p>{expert.title}</p>
      <p>{expert.bio}</p>
      {/* Rest of your UI */}
    </div>
  );
}

// Mock data fetching hook
function useExpertData(id) {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    fetch(`/api/experts/${id}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setIsLoading(false);
      });
  }, [id]);
  
  return { data, isLoading };
}

export default ExpertProfile;
