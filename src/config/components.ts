export interface ShowcaseComponentItem {
  slug: string;
  name: string;
  issuer: string;
  issued: string;
  credentialId?: string;
  credentialUrl?: string;
  sampleImage: string;
}

export const CERTIFICATIONS_LINKEDIN_URL =
  'https://www.linkedin.com/in/saumojyoti-chakraborty-412564278/details/certifications/';

export const showcaseComponents: ShowcaseComponentItem[] = [
  {
    slug: 'machine-learning-with-python',
    name: 'Machine Learning with Python',
    issuer: 'IBM',
    issued: 'Issued Dec 2024',
    credentialId: 'IKCUMNNX4QZF',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/IKCUMNNX4QZF',
    sampleImage: '/assets/aistudio/1_Machine_Learning_with_Python_1b31cfd5.jpeg',
  },
  {
    slug: 'gen-ai-academy',
    name: 'Gen AI Academy',
    issuer: 'Google',
    issued: 'Issued Jul 2025',
    credentialId: '2025H2S04GENAI-A800098',
    credentialUrl: 'https://certificate.hack2skill.com/legacy/2025H2S04GENAI-A800098',
    sampleImage: '/assets/aistudio/2_Gen_Al_Academy_9996c0ba.png',
  },
  {
    slug: 'intro-to-machine-learning',
    name: 'Intro to Machine Learning',
    issuer: 'Kaggle',
    issued: 'Issued Jan 2026',
    credentialUrl: 'https://www.kaggle.com/learn/certification/saumojyoti/intro-to-machine-learning',
    sampleImage: '/assets/aistudio/3_Intro_to_Machine_Learning_74dfb5be.png',
  },
  {
    slug: 'develop-genai-apps-gemini-streamlit',
    name: 'Develop GenAI Apps with Gemini and Streamlit',
    issuer: 'Google',
    issued: 'Issued Jul 2025',
    credentialId: '16810267',
    credentialUrl:
      'https://www.skills.google/public_profiles/f07f692d-9ae0-4155-a4fc-c803d1958f67/badges/16810267?utm_medium=social&utm_source=linkedin&utm_campaign=ql-social-share',
    sampleImage: '/assets/aistudio/4_Develop_GenAI_Apps_with_Gemini_and_Streamlit_e0939da9.png',
  },
  {
    slug: 'build-real-world-ai-gemini-imagen',
    name: 'Build Real World AI Applications with Gemini and Imagen',
    issuer: 'Google',
    issued: 'Issued May 2025',
    credentialId: '15724038',
    credentialUrl:
      'https://www.skills.google/public_profiles/f07f692d-9ae0-4155-a4fc-c803d1958f67/badges/15724038?utm_medium=social&utm_source=linkedin&utm_campaign=ql-social-share',
    sampleImage: '/assets/aistudio/5_Build_Real_World_AI_Applications_with_Gemini_and_Imagen_c57e1054.png',
  },
  {
    slug: 'inspect-rich-documents-gemini-multimodal-rag',
    name: 'Inspect Rich Documents with Gemini Multimodality and Multimodal RAG',
    issuer: 'Google',
    issued: 'Issued Jul 2025',
    credentialId: '16930811',
    credentialUrl:
      'https://www.skills.google/public_profiles/f07f692d-9ae0-4155-a4fc-c803d1958f67/badges/16930811?utm_medium=social&utm_source=linkedin&utm_campaign=ql-social-share',
    sampleImage:
      '/assets/aistudio/6_Inspect_Rich_Documents_with_Gemini_Multimodality_and_Multimodal_RAG_6dd2cfc9.png',
  },
  {
    slug: 'explore-generative-ai-gemini-api-vertex-ai',
    name: 'Explore Generative AI with the Gemini API in Vertex AI',
    issuer: 'Google',
    issued: 'Issued Jul 2025',
    credentialId: '16931369',
    credentialUrl:
      'https://www.skills.google/public_profiles/f07f692d-9ae0-4155-a4fc-c803d1958f67/badges/16931369?utm_medium=social&utm_source=linkedin&utm_campaign=ql-social-share',
    sampleImage:
      '/assets/aistudio/7_Explore_Generative_AI_with_the_Gemini_API_in_Vertex_AI_c0d81312.png',
  },
];
